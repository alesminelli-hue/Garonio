// Trama delle bestie: «I re della campagna» (GDD 18.3) e nemici nuovi (GDD 11.2).
// Ogni re ha tre passi: la VOCE (un personaggio ne parla), le TRACCE (segni sulla mappa, sulla minimappa
// col colore del re), la TANA (scontro col re e i suoi seguaci, in due fasi). Vinto un re: trofeo da
// indossare, esperienza, soldi, e la sua specie compare meno (src/spawn.js).
//
// API (game.bestie):
//   stagione()                 'primavera' | 'estate' | 'autunno' | 'inverno' (da game.stagioni se c'è, se no dal giorno)
//   fase(id)                   'nulla' | 'tracce' | 'tana' | 'sconfitto'   (id: 're_ratti' | 're_nutrie' | 're_lupi')
//   sentiVoce(id)              fa partire la caccia (lo fa anche l'evento 'voce' { bestia })
//   entraTana(id) / combattiRe(id)
//   scriptBase()               mosse speciali dei nemici nuovi (veleno, carica stordente, gazza ladra) per combat.start
//   spawn                      gruppi visibili sulla mappa (src/spawn.js)
//   prova()                    pannello di prova: sezione «Bestie e nemici» del pilot (?pilot), o pulsante 🧪 con ?prova
//
// Eventi: ascolta  voce { bestia }, traccia { bestia, luogo }   ·   emette  bestiaSconfitta { id }, tracciaBestia { id, n, tot }
import * as PIX from './pixel.js';
import * as SPR from './sprite_bestie.js';
import { ENEMIES } from './combat.js';
import { NEMICI_NUOVI, BESTIE, CACCIA, STAGIONI, GIORNI_STAGIONE, GRUPPI, ZONE } from './data/bestie.js';
import { OGGETTI, VESTITI } from './data/armi.js';
import { pagina, pagine, fill } from './racconto.js';
import { Spawn } from './spawn.js';

const H = 60;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const left = arr => arr.map(PIX.mirror);

// I nemici nuovi entrano in ENEMIES del combattimento (con i loro sprite)
for (const [id, d] of Object.entries(NEMICI_NUOVI)) {
  const fn = SPR[d.sprite];
  ENEMIES[id] = { ...d, frames: () => left([fn(0), fn(1)]) };
}

// sinonimi usati da altri lavori ('ratti' dagli interni, ecc.)
const ALIAS = { ratti: 're_ratti', nutrie: 're_nutrie', lupi: 're_lupi', re_ratti: 're_ratti', re_nutrie: 're_nutrie', re_lupi: 're_lupi' };

export class Bestie {
  constructor(game) {
    this.game = game;
    this.spawn = new Spawn(game, this);
    this.segni = [];         // sprite di tracce e ingressi sulla mappa
  }
  get s() { return this.game.s; }
  get st() { return this.s.flags.bestie; }

  init() {
    const g = this.game, s = this.s;
    s.flags ??= {};
    s.flags.bestie ??= {};
    const st = s.flags.bestie;
    st.re ??= {};
    for (const id of Object.keys(BESTIE)) st.re[id] ??= { fase: 'nulla', trovate: [] };
    this._css();
    // la caccia compare nel diario delle missioni
    for (const [id, b] of Object.entries(BESTIE)) {
      g.quests.aggiungi('caccia_' + id, { da: 'bestie', titolo: `Caccia al ${b.nome}`, obiettivo: { speciale: true, n: b.tracce.length + 1 }, torna: false });
    }
    // le voci: Mamma, Consulente, Zeno (Pina e Tarcisio arrivano col lavoro sul bar, tramite l'evento 'voce')
    for (const [id, b] of Object.entries(BESTIE)) {
      g.png.aggiungiScelte(b.voce.png, () => this._puoSentire(id) ? [{ label: b.voce.etichetta, fn: () => { this.sentiVoce(id, true); return pagine(b.voce.pagine); } }] : []);
    }
    g.on('voce', d => { const id = ALIAS[d?.bestia]; if (id && this.fase(id) === 'nulla') this.sentiVoce(id); });
    g.on('traccia', d => this._tracciaEsterna(d));
    // la grata dei capannoni negli interni (lavoro A), se c'è
    try { g.interni?.aggancia?.('maiali:grata', async () => this.entraTana('re_ratti')); } catch (e) { console.warn(e); }
    this._segni();
    this.spawn.init();
    g.moduli?.push({ animate: dt => this.update(dt) });
    g.bersagli?.push(() => this.bersaglio());
    // prove: sezione nel pilot (?pilot), oppure pulsante a parte con ?prova
    g.pilot?.sezione?.('🐺 Bestie e nemici', () => this._menuProva().choices.filter(c => c.fn));
    if (new URLSearchParams(location.search).has('prova') && !document.getElementById('btn-pilot')) this._pulsanteProva();
  }

  // ---------- Stato ----------
  stagione() {
    if (this.st?.stagioneProva) return this.st.stagioneProva;
    const ext = this.game.stagioni;
    const n = typeof ext?.info === 'function' ? ext.info().chiave : typeof ext?.attuale === 'function' ? ext.attuale() : ext?.nome;
    if (typeof n === 'string' && STAGIONI.includes(n)) return n;
    if (n && STAGIONI.includes(n.nome)) return n.nome;
    return STAGIONI[clamp(Math.floor((this.s.day - 1) / GIORNI_STAGIONE), 0, 3)];
  }
  fase(id) { return this.st.re[id]?.fase || 'nulla'; }
  sconfitti() { return Object.keys(BESTIE).filter(id => this.fase(id) === 'sconfitto'); }
  specieInCaccia() { return new Set(Object.entries(BESTIE).filter(([id]) => ['tracce', 'tana'].includes(this.fase(id))).flatMap(([, b]) => b.seguaci)); }
  specieDomate() { return new Set(this.sconfitti().flatMap(id => BESTIE[id].dopo.specie)); }

  // la voce si sente dalla stagione del re in poi, a un livello dal minimo
  _puoSentire(id) {
    const b = BESTIE[id];
    return this.fase(id) === 'nulla' && this.s.level >= b.min - 1 && STAGIONI.indexOf(this.stagione()) >= STAGIONI.indexOf(b.stagione);
  }

  sentiVoce(id, silenzioso = false) {
    if (this.fase(id) !== 'nulla') return;
    this.st.re[id].fase = 'tracce';
    this.game.quests.accetta('caccia_' + id);
    if (!silenzioso) this.game.ui.toast(`Si parla del ${BESTIE[id].nome}... cerca le tracce (segnate sulla minimappa).`, 'good');
    this._segni();
  }

  _tracciaEsterna(d) {
    const id = ALIAS[d?.bestia]; if (!id) return;
    if (this.fase(id) === 'nulla') { this.sentiVoce(id); return; }
    if (this.fase(id) !== 'tracce') return;
    const b = BESTIE[id], i = b.tracce.findIndex((t, k) => !this.st.re[id].trovate.includes(k));
    if (i >= 0) this.trovaTraccia(id, i, false);
  }

  trovaTraccia(id, i, dialogo = true) {
    const b = BESTIE[id], r = this.st.re[id];
    if (r.trovate.includes(i)) return;
    r.trovate.push(i);
    this.game.quests.progresso('caccia_' + id);
    const n = r.trovate.length, tot = b.tracce.length;
    this.game.audio.sfx('pick');
    this.game.emit('tracciaBestia', { id, n, tot });
    if (n >= tot) {
      r.fase = 'tana';
      this.game.ui.toast(fill(CACCIA.tanaAperta, { nome: b.nome }), 'good');
    } else this.game.ui.toast(fill(CACCIA.tracciaTrovata, { n, tot }), 'good');
    this._segni();
    if (dialogo) return this.game.ui.dialog([pagina({ testo: b.tracce[i].testo })]);
  }

  // ---------- Segni sulla mappa ----------
  _segni() {
    const W = this.game.world, mm = window.__garonio?.minimap;
    for (const sg of this.segni) { W.scene.remove(sg.spr); W.spriteMats?.delete(sg.spr.material); mm?.setMarker(sg.key, null); }
    this.segni = [];
    for (const [id, b] of Object.entries(BESTIE)) {
      const f = this.fase(id);
      if (f === 'tracce') b.tracce.forEach((t, i) => {
        if (this.st.re[id].trovate.includes(i)) return;
        this._segno({ key: `${id}-t${i}`, id, i, x: t.x, z: t.z, canvas: SPR.traccia(t.tipo), colore: b.colore, label: 'Esamina le tracce', fn: () => this.trovaTraccia(id, i) });
      });
      // l'ingresso della tana è sempre lì (si apre solo quando hai seguito le tracce)
      const tn = b.tana;
      this._segno({ key: `${id}-tana`, id, x: tn.x, z: tn.z, canvas: SPR.ingresso(tn.tipo), colore: f === 'tana' ? '#ff3040' : null, tana: true,
        label: f === 'tana' ? `Entra: ${tn.nome}` : f === 'sconfitto' ? null : 'Guarda meglio', fn: () => this.entraTana(id) });
    }
  }

  _segno(sg) {
    const W = this.game.world;
    sg.spr = W.sprite(sg.canvas, { w: sg.canvas.width / 16 * 1.25, h: sg.canvas.height / 16 * 1.25 });
    sg.spr.position.set(sg.x, 0.01, sg.z);
    W.scene.add(sg.spr);
    if (sg.colore) window.__garonio?.minimap?.setMarker(sg.key, sg.x, sg.z, sg.colore);
    this.segni.push(sg);
  }

  update(dt) {
    this.spawn.update(dt);
    // la minimappa nasce dopo il gioco: rimette i segnalini al primo giro
    if (!this._mmOk && window.__garonio?.minimap) { this._mmOk = true; this._segni(); }
    // i segni di tracce lampeggiano un po' per farsi notare
    const k = 1 + Math.sin(performance.now() / 300) * 0.06;
    for (const sg of this.segni) if (!sg.tana) sg.spr.scale.y = sg.canvas.height / 16 * 1.25 * k;
  }

  bersaglio() {
    const P = this.game.player.group.position;
    if (!this.game.vehicles?.driving) for (const sg of this.segni) {
      if (sg.label && Math.hypot(P.x - sg.x, P.z - sg.z) < 1.6) return { label: sg.label, fn: sg.fn };
    }
    return this.spawn.bersaglio();
  }

  // ---------- Tane ----------
  async entraTana(id) {
    const g = this.game, b = BESTIE[id], tn = b.tana, f = this.fase(id);
    if (f === 'sconfitto') return g.ui.dialog([pagina({ testo: CACCIA.giaSconfitto })]);
    if (f !== 'tana') {
      const hint = { re_ratti: 'Una grata arrugginita. Da sotto arriva un odore di formaggio e un fruscio di tante zampette.', re_nutrie: 'Il buio sotto il ponte. Qualcosa di grosso respira nell\'acqua.', re_lupi: 'Un muro di rovi. Sui rami c\'è del pelo bianco.' }[id];
      return g.ui.dialog([pagina({ testo: hint + (f === 'nulla' ? ' Meglio chiedere in giro di cosa si tratta.' : ' Prima segui tutte le tracce.') })]);
    }
    const r = tn.richiede;
    if (r?.vestitoBonus && !(g.prog.bonus(r.vestitoBonus) > 0)) return g.ui.dialog([pagina({ testo: r.manca })]);
    if (r?.arma && !r.arma.some(a => g.prog.haArma(a))) return g.ui.dialog([pagina({ testo: r.manca })]);
    if (tn.notte && (this.s.minutes / H) < 20) return g.ui.dialog([pagina({ testo: tn.giorno })]);
    let entra = true;
    if (this.s.level < b.min) {
      entra = false;
      await g.ui.dialog([{ ...pagina({ chi: 'garonio', testo: CACCIA.brivido }), choices: [
        { label: CACCIA.entraLoStesso, fn: () => { entra = true; return null; } },
        { label: CACCIA.meglioDiNo, fn: null },
      ] }]);
    }
    if (!entra) return;
    let combatti = false;
    const desc = pagine(tn.descr);
    desc[desc.length - 1].choices = [
      { label: CACCIA.affronta, fn: () => { combatti = true; return null; } },
      { label: CACCIA.torna, fn: null },
    ];
    await g.ui.dialog(desc);
    if (combatti) await this.combattiRe(id);
  }

  async combattiRe(id) {
    const g = this.game, b = BESTIE[id];
    if (g.combat.active) return;
    g._wake?.(); g.idle = 0;
    const res = await g.combat.start({
      enemies: [b.nemico, ...b.seguaci], place: b.luogo, intro: b.intro, script: this._scriptRe(id),
    });
    g.combat.root?.classList.remove('luna');
    if (res === 'win') await this._vittoria(id);
    else if (res === 'lose') { await g.ui.dialog([pagina({ testo: CACCIA.sconfitta })]); await g.mountain('sconfitta', 20); }
    else await g.ui.dialog([pagina({ testo: CACCIA.fuga })]);
    return res;
  }

  async _vittoria(id) {
    const g = this.game, b = BESTIE[id], s = this.s;
    this.st.re[id].fase = 'sconfitto';
    s.money += b.soldi;
    g.prog.daiVestito(b.trofeo, true);
    if (g.quests.stato('caccia_' + id) === 'attiva' || g.quests.stato('caccia_' + id) === 'pronta') g.quests.completa('caccia_' + id);
    this._segni();
    g.audio.sfx('coin');
    const trofeo = VESTITI[b.trofeo];
    await g.ui.dialog([...pagine(b.vittoria), pagina({ testo: `Trofeo: ${trofeo?.nome} (${trofeo?.desc}), già indossato. +${b.soldi}€.` })]);
    g.emit('bestiaSconfitta', { id });
    if (this.sconfitti().length === Object.keys(BESTIE).length && !this.st.leggenda) {
      this.st.leggenda = true;
      await g.ui.dialog([pagina({ testo: CACCIA.leggenda })]);
    }
    g.save();
  }

  // ---------- Mosse speciali (tutti gli scontri) ----------
  scriptBase() {
    const game = this.game;
    return {
      heroTurn: async c => {
        const h = c.hero;
        // stordito salta UN turno e poi non si può stordire di nuovo finché non ha agito (niente stordimenti a catena)
        if (h.stordito) { h.stordito = false; h.nonStordibile = true; await c._say('Garonio è stordito... salta il turno!', 1200); return true; }
        h.nonStordibile = false;
        return false;
      },
      enemyMove: async (c, e, mv, dmg) => {
        const h = c.hero, s = game.s;
        if (mv.veleno && dmg > 0) h.veleno = { d: mv.veleno[0], t: mv.veleno[1] };
        if (mv.stordisce && dmg > 0 && !h.defending && !h.nonStordibile) h.stordito = true;
        if (mv.rubaScappa) {
          const cose = Object.keys(s.inv).filter(k => s.inv[k] > 0);
          if (cose.length) {
            const k = cose[Math.floor(Math.random() * cose.length)];
            game.prog.togliOggetto ? game.prog.togliOggetto(k, 1) : s.inv[k]--;
            c._float(e.wrap, `+1 ${OGGETTI[k]?.icona || k}`, 'miss');
            await c._sleep(500);
            e.alive = false; e.noXp = true; e.wrap.classList.add('dead');
            await c._say(`${e.name} ruba: ${OGGETTI[k]?.nome || k}! E vola via, contenta.`, 1300);
          }
        }
      },
      roundEnd: async c => {
        const h = c.hero, s = game.s;
        if (h.veleno?.t > 0) {
          h.veleno.t--; s.health -= h.veleno.d;
          c._float(c.heroWrap, `-${h.veleno.d} (morso infetto)`, 'dmg');
          await c._sleep(500);
        }
      },
    };
  }

  // unisce lo script base con quello di un re (i ganci si chiamano tutti e due, in ordine)
  _unisci(extra) {
    const base = this.scriptBase(), out = { ...base, ...extra };
    for (const k of ['heroTurn', 'enemyMove', 'roundEnd']) if (base[k] && extra[k]) {
      out[k] = async (...a) => (await base[k](...a)) || (await extra[k].call(out, ...a));
    }
    return out;
  }

  _scriptRe(id) {
    const b = BESTIE[id];
    const trova = c => c.enemies.find(e => e.id === b.nemico);
    if (id === 're_ratti') {
      let re, fase = 1, nascosto = false, dalStanato = 0, normali;
      const nascondi = async c => {
        nascosto = true; normali ??= re.frames;
        re.frames = [SPR.mucchioGrano(0), SPR.mucchioGrano(1)].map(PIX.mirror);
        re.wrap.classList.add('grano');
      };
      const stana = async c => {
        if (!nascosto) return;
        nascosto = false; dalStanato = 0; re.frames = normali; re.wrap.classList.remove('grano');
        re.sleep = 1;
        c._float(re.wrap, 'Stanato!', 'crit');
        await c._say(b.stanato, 1300);
      };
      return this._unisci({
        start: c => { re = trova(c); },
        immune: e => e === re && nascosto,
        hit: async (c, e) => {
          if (e === re && fase === 1 && re.hp > 0 && re.hp <= re.max / 2) { fase = 2; await nascondi(c); await c._say(b.fase2, 1800); }
        },
        heroTurn: async c => { if (nascosto && re.alive) await c._say(b.nascosto, 1200); return false; },
        skill: async (c, k) => { if (k === 'urlo') await stana(c); },
        item: async (c, it, t) => { if (t && t === re) await stana(c); },
        roundEnd: async c => {
          if (!re.alive) return;
          const vivi = c.enemies.filter(e => e.alive && e !== re).length;
          if (fase === 1 && c.round % b.ogniRound === 0 && vivi < b.maxSeguaci) {
            const nuovi = b.rinforzi.slice(0, b.maxSeguaci - vivi);
            for (const r of nuovi) c.addEnemy(r, { noXp: true });
            c._refresh();
            await c._say(`Il Re dei Ratti fischia: ${nuovi.length > 1 ? `arrivano ${nuovi.length} ratti` : 'arriva un ratto'} di rinforzo!`, 1300);
          }
          if (fase === 2 && !nascosto && ++dalStanato >= 3) { await nascondi(c); await c._say('Il Re dei Ratti si rintana di nuovo nel grano!', 1200); }
        },
      });
    }
    if (id === 're_nutrie') {
      let re, fase = 1, turni = 0, colpito = 0;
      return this._unisci({
        start: c => { re = trova(c); },
        immune: e => e === re && re.tuffo,
        hit: async (c, e, d) => {
          if (e !== re) return;
          colpito += d;
          if (fase === 1 && re.hp > 0 && re.hp <= re.max / 2) { fase = 2; re.tuffo = false; re.wrap.classList.remove('tuffo'); await c._say(b.fase2, 1700); }
        },
        enemyTurn: async (c, e) => {
          if (e !== re) return false;
          turni++;
          if (re.tuffo) {
            re.tuffo = false; re.wrap.classList.remove('tuffo');
            await c._say(b.riemerge, 900);
            return false;                         // e poi attacca normalmente
          }
          if (fase === 1 && turni % 2 === 1) {
            re.tuffo = true; re.wrap.classList.add('tuffo');
            await c._say(b.tuffo, 1200);
            return true;
          }
          if (fase === 2) {
            if (colpito < re.max * b.diga.soglia) {
              const cura = Math.round(re.max * b.diga.cura);
              re.hp = Math.min(re.max, re.hp + cura);
              c._float(re.wrap, `+${cura}`, 'heal'); c._refresh();
              await c._say(b.cura, 1400);
            }
            colpito = 0;
          }
          return false;
        },
      });
    }
    // re_lupi
    let re, fase = 1, turni = 0;
    return this._unisci({
      start: c => { re = trova(c); },
      hit: async (c, e) => {
        if (e === re && fase === 1 && re.hp > 0 && re.hp <= re.max / 2) {
          fase = 2; re.atk = Math.round(re.atk * 1.15);
          c.root.classList.add('luna'); c.game.ui.shake();
          await c._say(b.fase2, 1800);
        }
      },
      enemyTurn: async (c, e) => {
        if (e !== re || fase !== 1 || ++turni % b.brancoOgni !== 1) return false;
        const branco = c.enemies.filter(o => o.alive && o !== re);
        if (!branco.length) return false;
        await c._say(b.branco, 1000);
        for (const o of branco) { if (c.game.s.health <= 0) break; await c._enemyTurn(o); }
        return false;                             // poi attacca anche il re
      },
      roundEnd: async c => {
        if (fase !== 2 || !re.alive) return;
        const st = Math.round(15 * Math.max(0.3, 1 - (c.game.prog.bonus('stress') || 0)));
        c.game.s.stress += st;
        c._float(c.heroWrap, `Stress +${st}`, 'stress');
        await c._say(b.ululato, 900);
      },
    });
  }

  // ---------- Stile delle tane e dei posti nuovi nello scontro ----------
  _css() {
    if (document.getElementById('bestie-css')) return;
    const l = document.createElement('link');
    l.id = 'bestie-css'; l.rel = 'stylesheet'; l.href = new URL('./bestie.css', import.meta.url).href;
    document.head.appendChild(l);
  }

  // ---------- Pannello di prova (?prova) ----------
  _pulsanteProva() {
    const b = document.createElement('button');
    b.id = 'btn-prova'; b.textContent = '🧪'; b.title = 'Prove: bestie e nemici';
    b.addEventListener('click', e => { e.stopPropagation(); if (!this.game.ui.busy() && !this.game.combat.active) this.prova(); });
    document.getElementById('hud')?.appendChild(b);
  }

  _livello(L) {
    const s = this.s, g = this.game;
    if (s.level < L) g.prog.p.punti += L - s.level;
    s.level = L; s.xp = 0;
    s.maxHealth = g.prog.maxHealth();
    this.cura();
  }
  cura() { const s = this.s; s.health = s.maxHealth; s.stress = 10; s.tired = 0; }
  _vai(x, z) {
    const g = this.game;
    if (g.vehicles?.driving) g.vehicles.leave();
    for (let r = 0; r < 4; r += 0.4) for (const [ox, oz] of [[0, r], [r, 0], [-r, 0], [0, -r]]) {
      if (!g.world.blocked(x + ox, z + oz)) { g.player.group.position.set(x + ox, 0, z + oz); return; }
    }
    g.player.group.position.set(x, 0, z);
  }
  _prepara(id) {
    const g = this.game, b = BESTIE[id];
    this._livello(Math.max(this.s.level, b.cons));
    this.st.stagioneProva = b.stagione === 'primavera' ? 'estate' : b.stagione;
    if (id === 're_nutrie' || id === 're_lupi') { g.prog.daiVestito('stivaliAlti', true); }
    if (id === 're_lupi') { g.prog.daiArma('roncola'); g.prog.impugna('roncola'); if (this.s.minutes < 21 * H) this._ora(21); }
    this.s.inv.uova = Math.max(this.s.inv.uova || 0, 3);
    this.s.inv.pomodoro = Math.max(this.s.inv.pomodoro || 0, 3);
  }

  prova() { return this.game.ui.dialog([this._menuProva()]); }

  // pagina principale delle prove (anche come sezione del pilot dell'annata)
  _menuProva() {
    const g = this.game;
    const menu = () => this._menuProva();
    const re = id => () => {
      const b = BESTIE[id];
      return [{ name: '🧪 ' + b.nome, text: `Fase: ${this.fase(id)}. Le prove alzano Garonio al livello ${b.cons} e preparano stagione, attrezzi e ora.`, choices: [
        { label: '1. Senti la voce e vai alla prima traccia', fn: () => { this._prepara(id); this.st.re[id] = { fase: 'nulla', trovate: [] }; this.sentiVoce(id); const t = b.tracce[0]; this._vai(t.x, t.z + 1.2); return null; } },
        { label: '2. Tracce trovate: vai alla tana', fn: () => { this._prepara(id); this.st.re[id] = { fase: 'tana', trovate: b.tracce.map((t, i) => i) }; if (g.quests.stato('caccia_' + id) == null) g.quests.accetta('caccia_' + id); this._segni(); this._vai(b.tana.x, b.tana.z + 1.2); return null; } },
        { label: '3. Combatti subito il re', fn: () => { this._prepara(id); setTimeout(() => this.combattiRe(id), 50); return null; } },
        { label: '4. Ricomincia questa caccia da zero', fn: () => { this.st.re[id] = { fase: 'nulla', trovate: [] }; this._segni(); g.ui.toast('Caccia azzerata.'); return null; } },
        { label: '◀ Indietro', fn: () => [menu()] },
      ] }];
    };
    const gruppi = () => [{ name: '🧪 Gruppi di nemici', text: 'Fa comparire un gruppo accanto a Garonio (ignora ora e stagione, rispetta il livello).', choices: [
      ...GRUPPI.filter((gr, i, a) => a.findIndex(o => o.membri.join() === gr.membri.join()) === i).slice(0, 9).map(gr => ({
        label: `${gr.membri.map(m => ENEMIES[m]?.name || m).join(' + ')} (${ZONE[gr.zona].nome.toLowerCase()})`,
        fn: () => { const grp = this.spawn.crea(gr, true); if (!grp) g.ui.toast('Livello troppo basso per questo gruppo: alzalo dal pannello.', 'bad'); return null; },
      })),
      { label: '◀ Indietro', fn: () => [menu()] },
    ] }];
    const tempo = () => [{ name: '🧪 Ora, stagione, livello', text: `Ora ${Math.floor((this.s.minutes / H) % 24)}:00 · stagione delle bestie: ${this.stagione()} · livello ${this.s.level}.`, choices: [
      { label: 'Mattina (8:00)', fn: () => { this._ora(8); return tempo(); } },
      { label: 'Notte (21:00)', fn: () => { this._ora(21); return tempo(); } },
      { label: 'Stagione successiva (solo per bestie e nemici)', fn: () => { this.st.stagioneProva = STAGIONI[(STAGIONI.indexOf(this.stagione()) + 1) % 4]; return tempo(); } },
      { label: 'Livello +3', fn: () => { this._livello(Math.min(30, this.s.level + 3)); return tempo(); } },
      { label: 'Livello 1', fn: () => { this._livello(1); return tempo(); } },
      { label: '◀ Indietro', fn: () => [menu()] },
    ] }];
    return { name: '🧪 Bestie e nemici', text: 'Bestie leggendarie e gruppi di nemici. Scegli cosa provare.', choices: [
      { label: '🐀 Re dei Ratti', fn: re('re_ratti') },
      { label: '🦫 Re delle Nutrie', fn: re('re_nutrie') },
      { label: '🐺 Re dei Lupi', fn: re('re_lupi') },
      { label: '👣 Gruppi di nemici qui vicino', fn: gruppi },
      { label: '🕗 Ora, stagione, livello', fn: tempo },
      { label: '❤️ Cura Garonio', fn: () => { this.cura(); g.ui.toast('Garonio è come nuovo.', 'good'); return null; } },
      { label: 'Chiudi', fn: null },
    ] };
  }

  _ora(h) {
    const m = this.s.mission;
    if (m && !m.done && !m.failed) m.deadline = Math.max(m.deadline, h * H + 2 * H);   // la prova non fa arrabbiare Mister Mountain
    this.s.minutes = h * H;
    this.game.saveHour = h;
  }
}
