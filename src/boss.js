// Boss delle missioni secondarie (GDD capitolo 24): uno per ogni edificio e zona della mappa, più il finale.
// Ogni boss è una missione secondaria che un personaggio offre nel dialogo (src/secondarie.js). Accettata,
// la tana compare sulla mappa e sulla minimappa (segno rosso): sulla mappa grande o dentro un edificio,
// vicino a un mobile. Lì, all'ora giusta, «⚔️ Affronta» fa partire lo scontro con le meccaniche del boss
// (rinforzi, furia, cure, scudo, colpo caricato, aura di stress, furti). Vinto: bottino subito, paga da chi
// l'ha chiesto. Al livello 30 (endgame) i boss battuti tornano ogni settimana in versione leggendaria.
// Qui sta anche il bottino dei nemici normali (lo chiama src/combat.js a fine scontro).
// I dati stanno in src/data/boss.js, gli sprite in src/sprite_boss.js.
//
// API (game.boss):
//   stato(id)                 'nulla' | 'attiva' | 'vinto'
//   affronta(id, leggenda)    scontro col boss (dalla tana)
//   bottino(nemici, place)    bottino di fine scontro: dà gli oggetti e restituisce le etichette
//   prova()                   pannello di prova (sezione «Boss» del pilot, ?pilot)
// Eventi: emette  bossSconfitto { id, leggenda }, endgame { livello }
import * as PIX from './pixel.js';
import * as SPR from './sprite_boss.js';
import * as SB from './sprite_bestie.js';
import { ENEMIES } from './combat.js';
import { NEMICI } from './data/nemici.js';
import { BOSS, TIRAPIEDI, BOTTINO, BOTTINO_EXTRA, LEGGENDA, TESTI_BOSS as T } from './data/boss.js';
import { OGGETTI, VESTITI, ARMI } from './data/armi.js';
import { LIVELLI } from './data/progressione.js';
import { PNG } from './data/png.js';
import { pagina, pagine, fill } from './racconto.js';

const H = 60;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const left = arr => arr.map(PIX.mirror);
const ARMATURA = { w: 18, h: 27, skin: '#9aa0a8', hair: '#6a7078', hairStyle: 'flat', hat: '#8a9098', shirt: '#a8b0b8', pants: '#7a8088', boots: '#4a5058', eyes: 'angry' };
const quest = id => 'boss_' + id;
export const nemicoBoss = id => 'boss_' + id;

// fotogrammi di un nemico dal suo "sprite" (vedi src/data/boss.js)
function fotogrammi(sp) {
  if (sp.fn) { const fn = SPR[sp.fn] || SB[sp.fn]; return () => left([fn(0), fn(1)]); }
  if (sp.personaggio) return () => [0, 1, 2].map(f => PIX.mirror(PIX.humanoid(PIX.CHARACTERS[sp.personaggio], f)));
  const o = { ...sp.umano };
  return () => [0, 1, 2].map(f => PIX.mirror(PIX.humanoid(o, f)));
}
const aspettoUmano = key => key === 'armatura' ? { umano: ARMATURA }
  : { umano: { sprite: key, w: 16, h: 24, skin: '#e8b48a', hair: '#2a1a10', hairStyle: 'flat', shirt: '#3a3a44', pants: '#22222a', boots: '#111', eyes: 'angry' } };

// I boss e i loro tirapiedi entrano nei nemici del combattimento (e nella tabella dei livelli)
for (const [id, b] of Object.entries(BOSS)) {
  const n = b.nemico;
  ENEMIES[nemicoBoss(id)] = { name: n.name, hp: 100, atk: 10, def: 2, spd: 8, xp: 0, money: 0, size: n.size, boss: true, lv: b.lv, mul: n.mul,
    fuga: n.fuga, moves: n.moves, frames: fotogrammi(n.sprite) };
}
for (const [id, t] of Object.entries(TIRAPIEDI)) {
  ENEMIES[id] = { ...t, money: 0, frames: fotogrammi(t.sprite ? { fn: t.sprite } : aspettoUmano(t.umano)) };
  NEMICI[id] ??= { nome: t.name, min: t.lv[0], cons: t.cons, lv: t.lv, zone: ['boss'], tirapiedi: true };
}
// i tre re delle bestie: anche loro col livello da boss (statistiche dal livello, src/data/nemici.js)
const RE = { re_ratti: { lv: 10, mul: { hp: 0.75, atk: 0.9 } }, re_nutrie: { lv: 16, mul: { hp: 0.85, atk: 0.95, def: 1.2 } }, re_lupi: { lv: 22, mul: { hp: 0.9, atk: 1.0, spd: 1.2 } } };

export class Boss {
  constructor(game) {
    this.game = game;
    this.segni = [];
  }
  get s() { return this.game.s; }
  get st() { const f = (this.s.flags ??= {}); return (f.boss ??= { boss: {}, endgame: false }); }

  init() {
    const g = this.game;
    for (const [id, r] of Object.entries(RE)) if (ENEMIES[id]) Object.assign(ENEMIES[id], r);
    this._css();
    // ogni boss è una missione secondaria offerta da un personaggio
    for (const [id, b] of Object.entries(BOSS)) {
      const req = { ...(b.requisiti || {}) };
      const tutti = req.tuttiIBoss; delete req.tuttiIBoss;
      if (tutti) req.check = () => Object.keys(BOSS).every(k => k === id || this.stato(k) === 'vinto');
      g.quests.aggiungi(quest(id), {
        da: b.da, titolo: `${b.icona} ${b.titolo}`, offerta: b.offerta, accetta: b.accetta, rifiuta: 'Non ancora',
        obiettivo: { evento: 'bossSconfitto', filtro: { id, leggenda: false }, n: 1 },
        premio: b.premio, requisiti: req, grazie: b.grazie, boss: id,
      });
    }
    g.on('secondaria', d => { if (d.id?.startsWith('boss_')) this._dopoMissione(d); });
    g.on('livello', d => { if (d.level >= LIVELLI.max) this._endgame(); });
    g.on('nuovoGiorno', () => this._segni());
    g.bersagli?.push(() => this.bersaglio());
    g.interni?.bersaglioExtra?.(ctx => this.bersaglioInterno(ctx));
    g.moduli?.push({ animate: dt => this.update(dt) });
    g.pilot?.sezione?.('👹 Boss e livelli', () => this._menuProva().choices.filter(c => c.fn));
    this._segni();
    if (this.s.level >= LIVELLI.max && !this.st.endgame) this._endgame();
  }

  // ---------- Stato ----------
  stato(id) {
    if (this.st.boss[id]?.vinto) return 'vinto';
    const q = this.game.quests.stato(quest(id));
    return q === 'attiva' ? 'attiva' : q === 'pronta' || q === 'fatta' ? 'vinto' : 'nulla';
  }
  _leggendaPronta(id) {
    const b = this.st.boss[id];
    if (!b?.vinto || this.s.level < LIVELLI.max) return false;
    return b.leggenda == null || this.s.day - b.leggenda >= LEGGENDA.giorniFraSfide;
  }
  _lvLeggenda(id) { return Math.min(LEGGENDA.livelloMax, LEGGENDA.livelloBase + (this.st.boss[id]?.vinteLeggenda || 0)); }

  _dopoMissione(d) {
    const id = d.id.slice(5), b = BOSS[id], g = this.game;
    if (!b) return;
    if (d.stato === 'accettata') g.ui.toast(fill(T.nuovaTana, { titolo: b.titolo }), 'good');
    if (d.stato === 'fatta' && b.premio?.multa) {
      const m = this.s.flags?.vigilessa?.multe;
      if (m?.length) { m.shift(); g.ui.toast('La Vigilessa ha strappato una multa dal registro.', 'good'); }
    }
    this._segni();
  }

  // ---------- Tane sulla mappa e negli edifici ----------
  _visibile(id) { return this.stato(id) === 'attiva' || this._leggendaPronta(id); }

  _segni() {
    const W = this.game.world, mm = window.__garonio?.minimap;
    if (!W) return;
    for (const sg of this.segni) { if (sg.spr) { W.scene.remove(sg.spr); W.spriteMats?.delete(sg.spr.material); } mm?.setMarker(sg.key, null); }
    this.segni = [];
    for (const [id, b] of Object.entries(BOSS)) {
      if (!this._visibile(id)) continue;
      const tn = b.tana, legg = this.stato(id) === 'vinto';
      const p = tn.interno ? tn.mappa : tn;
      const sg = { key: 'boss-' + id, id, x: p.x, z: p.z, legg };
      if (!tn.interno) {
        const cv = SPR.segnoBoss();
        sg.w0 = cv.width / 16 * 1.4; sg.h0 = cv.height / 16 * 1.4;
        sg.spr = W.sprite(cv, { w: sg.w0, h: sg.h0 });
        sg.spr.position.set(p.x, 0.02, p.z);
        W.scene.add(sg.spr);
      }
      mm?.setMarker(sg.key, p.x, p.z, legg ? '#ffd040' : '#ff3040');
      this.segni.push(sg);
    }
  }

  update() {
    if (!this._mmOk && window.__garonio?.minimap) { this._mmOk = true; this._segni(); }
    const k = 1 + Math.sin(performance.now() / 260) * 0.12;
    for (const sg of this.segni) if (sg.spr) { sg.spr.scale.x = sg.w0 * k; sg.spr.scale.y = sg.h0 * k; }
  }

  _etichetta(id) {
    const b = BOSS[id];
    return this.stato(id) === 'vinto' ? `${T.leggendaPronta}: ${b.nemico.name}` : `⚔️ Affronta: ${b.nemico.name}`;
  }

  bersaglio() {
    const g = this.game, P = g.player.group.position;
    if (g.vehicles?.driving) return null;
    for (const [id, b] of Object.entries(BOSS)) {
      const tn = b.tana;
      if (tn.interno || !this._visibile(id)) continue;
      if (Math.hypot(P.x - tn.x, P.z - tn.z) < 1.8) return { label: this._etichetta(id), fn: () => this.tana(id) };
    }
    return null;
  }

  bersaglioInterno({ edificio, vicino }) {
    for (const [id, b] of Object.entries(BOSS)) {
      const tn = b.tana;
      if (tn.interno !== edificio || !this._visibile(id)) continue;
      if (vicino(tn.zona, 1.1)) return { label: this._etichetta(id), fn: () => this.tana(id) };
    }
    return null;
  }

  _ora() { return (this.s.minutes / H) % 24; }

  async tana(id) {
    const g = this.game, b = BOSS[id], tn = b.tana, legg = this.stato(id) === 'vinto';
    if (legg && !this._leggendaPronta(id)) return g.ui.dialog([pagina({ testo: T.giaFatto })]);
    const [a, z] = tn.ore || [0, 24], h = this._ora();
    if (h < a || h >= z) return g.ui.dialog([pagina({ testo: tn.fuori || `Adesso non c'è nessuno. Torna fra le ${a} e le ${z}.` })]);
    if (!legg && this.s.level < b.lv - 2) {
      let entra = false;
      await g.ui.dialog([{ ...pagina({ chi: 'garonio', testo: T.brivido }), name: `Livello consigliato: ${b.lv} (sei al ${this.s.level})`, choices: [
        { label: T.entraLoStesso, fn: () => { entra = true; return null; } },
        { label: T.meglioDiNo, fn: null },
      ] }]);
      if (!entra) return;
    }
    let combatti = false;
    const desc = legg ? [pagina({ testo: `${b.nemico.name}: ${T.leggendaIntro} (livello ${this._lvLeggenda(id)})` })] : pagine(b.descr);
    desc[desc.length - 1].choices = [
      { label: `${T.affronta} (Lv ${legg ? this._lvLeggenda(id) : b.lv})`, fn: () => { combatti = true; return null; } },
      { label: T.torna, fn: null },
    ];
    await g.ui.dialog(desc);
    if (combatti) await this.affronta(id, legg);
  }

  // ---------- Scontro ----------
  async affronta(id, legg = false) {
    const g = this.game, b = BOSS[id];
    if (g.combat.active) return null;
    g._wake?.(); g.idle = 0;
    const L = legg ? this._lvLeggenda(id) : b.lv;
    const enemies = [{ id: nemicoBoss(id), lv: L }, ...(b.seguaci || []).map(sid => ({ id: sid, lv: Math.max(1, L - 2), feroce: false }))];
    const luogo = b.tana.luogo || (b.tana.interno ? 'interno' : 'campo');
    const res = await g.combat.start({ enemies, place: luogo, intro: legg ? `${b.nemico.name} leggendario: ${T.leggendaIntro}` : b.intro, script: this._script(id, L, legg), canFlee: true });
    if (res === 'win') await this._vittoria(id, legg);
    else if (res === 'lose') { this.s.stress = clamp(this.s.stress + 15, 0, 100); await g.ui.dialog([pagina({ testo: T.sconfitta })]); }
    else if (res === 'flee') await g.ui.dialog([pagina({ testo: T.fuga })]);
    return res;
  }

  // unisce le mosse speciali di base (veleno, stordimento: src/bestie.js) con le meccaniche del boss
  _unisci(extra) {
    const base = this.game.bestie?.scriptBase?.() || {}, out = { ...base, ...extra };
    for (const k of ['heroTurn', 'enemyMove', 'roundEnd', 'start']) if (base[k] && extra[k]) {
      out[k] = async (...a) => (await base[k](...a)) || (await extra[k].call(out, ...a));
    }
    return out;
  }

  _script(id, L, legg) {
    const b = BOSS[id], M = b.mecc || {}, g = this.game, s = this.s;
    let boss = null, furia = false, cure = 0, scudo = false, carico = false, turniBoss = 0;
    const nome = () => boss?.name || b.nemico.name;
    const aliveMinions = c => c.enemies.filter(e => e.alive && e !== boss).length;
    return this._unisci({
      start: async c => {
        boss = c.enemies.find(e => e.id === nemicoBoss(id));
        if (legg && boss) { boss.name = LEGGENDA.nome(b.nemico.name); boss.label.textContent = boss.name; boss.wrap.classList.add('leggenda'); }
      },
      immune: e => e === boss && scudo,
      enemyTurn: async (c, e) => {
        if (e !== boss) return false;
        turniBoss++;
        // colpo caricato: annunciato il turno prima, poi arriva fortissimo
        if (carico) {
          carico = false;
          const def = e.def;
          e.def = { ...def, moves: [{ w: 1, ...M.carica.mossa }] };
          try { await c._enemyTurn(e); } finally { e.def = def; }
          return true;
        }
        if (M.carica && turniBoss % M.carica.ogni === 0 && !e.stun && !e.sleep) {
          carico = true;
          c._float(e.wrap, 'Si carica!', 'crit');
          await c._say(M.carica.testo, 1500);
          return true;
        }
        await c._enemyTurn(e);
        if (furia && M.furia?.doppio && e.alive && s.health > 0) await c._enemyTurn(e);
        return true;
      },
      enemyMove: async (c, e, mv, dmg) => {
        if (e === boss && M.ruba && dmg > 0 && s.money > 0) {
          const n = Math.min(s.money, rint(Math.ceil(M.ruba / 2), M.ruba));
          s.money -= n; boss.rubati = (boss.rubati || 0) + n;
          c._float(e.wrap, `+${n}€`, 'miss');
        }
      },
      hit: async (c, e) => {
        if (e !== boss || boss.hp <= 0) return;
        const k = boss.hp / boss.max;
        if (M.furia && !furia && k <= M.furia.soglia) {
          furia = true; boss.atk = Math.round(boss.atk * (M.furia.atk || 1.2));
          boss.wrap.classList.add('furia'); g.ui.shake?.();
          await c._say(M.furia.testo, 1500);
        }
        if (M.cura && cure < (M.cura.volte || 1) && k <= M.cura.soglia) {
          cure++;
          const q = Math.round(boss.max * M.cura.quanto);
          boss.hp = Math.min(boss.max, boss.hp + q);
          c._float(boss.wrap, `+${q}`, 'heal'); c._refresh();
          await c._say(M.cura.testo, 1400);
        }
      },
      roundEnd: async c => {
        if (!boss?.alive) return;
        if (scudo) { scudo = false; boss.wrap.classList.remove('scudo'); if (M.scudo.rotto) await c._say(M.scudo.rotto, 1100); }
        else if (M.scudo && c.round % M.scudo.ogni === 0) { scudo = true; boss.wrap.classList.add('scudo'); await c._say(M.scudo.testo, 1300); }
        if (M.rinforzi && c.round % M.rinforzi.ogni === 0 && aliveMinions(c) < M.rinforzi.max) {
          await c._say(M.rinforzi.testo, 1200);
          for (const r of M.rinforzi.ids) if (aliveMinions(c) < M.rinforzi.max) c.addEnemy(r, { lv: Math.max(1, L - 2), noXp: true, feroce: false });
          c._refresh();
        }
        if (M.aura) {
          const n = Math.round(M.aura.stress * Math.max(0.3, 1 - (g.prog.bonus('stress') || 0)));
          s.stress = clamp(s.stress + n, 0, 100);
          c._float(c.heroWrap, `Stress +${n}`, 'stress');
          await c._say(fill(M.aura.testo, { n }), 900);
        }
      },
    });
  }

  async _vittoria(id, legg) {
    const g = this.game, b = BOSS[id], st = (this.st.boss[id] ??= {});
    const cose = [];
    if (legg) {
      st.leggenda = this.s.day; st.vinteLeggenda = (st.vinteLeggenda || 0) + 1;
      const soldi = rint(...LEGGENDA.soldi); this.s.money += soldi; cose.push(`${soldi}€`);
      for (const o of LEGGENDA.oggetti) if (Math.random() < o.p) { const n = o.n ? rint(...o.n) : 1; g.prog.dai(o.id, n); cose.push(this._nomeOgg(o.id, n)); }
      if (Math.random() < LEGGENDA.rari.p) {
        const pool = [...LEGGENDA.rari.armi.filter(a => !g.prog.haArma(a)).map(a => ['arma', a]), ...LEGGENDA.rari.vestiti.filter(v => !g.prog.haVestito(v)).map(v => ['vestito', v])];
        if (pool.length) {
          const [tipo, x] = pool[Math.floor(Math.random() * pool.length)];
          if (tipo === 'arma') { g.prog.daiArma(x); cose.push(`⭐ ${ARMI[x].nome}`); } else { g.prog.daiVestito(x); cose.push(`⭐ ${VESTITI[x].nome}`); }
        }
      }
      g.audio.sfx('coin');
      await g.ui.dialog([pagina({ testo: fill(T.leggendaVinta, { nome: b.nemico.name }) }), pagina({ testo: fill(T.bottino, { cose: cose.join(', ') }) })]);
    } else {
      st.vinto = true; st.giorno = this.s.day;
      const bt = b.bottino || {};
      for (const v of bt.vestiti || []) { g.prog.daiVestito(v, !g.prog.indossato(VESTITI[v].slot)); cose.push(VESTITI[v].nome); }
      for (const a of bt.armi || []) { g.prog.daiArma(a); cose.push(ARMI[a].nome); }
      for (const [o, n] of Object.entries(bt.oggetti || {})) { g.prog.dai(o, n); cose.push(this._nomeOgg(o, n)); }
      if (bt.soldi) { this.s.money += bt.soldi; cose.push(`${bt.soldi}€`); }
      g.audio.sfx('coin');
      const chi = PNG[b.da]?.nome || 'chi te l\'ha chiesto';
      await g.ui.dialog([...pagine(b.vittoria), pagina({ testo: fill(T.bottino, { cose: cose.join(', ') }) + (b.finale ? '' : ` ${fill(T.vinto, { nome: b.nemico.name, chi })}`) })]);
    }
    g.emit('bossSconfitto', { id, leggenda: !!legg });
    this._segni();
    g.save?.();
  }

  _nomeOgg(id, n = 1) { const o = OGGETTI[id]; return `${o?.icona || ''} ${o?.nome || id}${n > 1 ? ` ×${n}` : ''}`.trim(); }

  // ---------- Bottino dei nemici normali (lo chiama src/combat.js) ----------
  bottino(nemici, place) {
    if (place === 'bar') return [];
    const g = this.game, preso = {};
    const dai = (id, n = 1) => { preso[id] = (preso[id] || 0) + n; };
    for (const e of nemici) {
      if (e.def?.boss) continue;
      const tab = BOTTINO[e.id] || [];
      tab.forEach((o, i) => { if ((e.feroce && i === 0) || Math.random() < o.p) dai(o.id, o.n ? rint(...o.n) : 1); });
      if (Math.random() < (e.feroce ? BOTTINO_EXTRA.pFeroce : BOTTINO_EXTRA.p)) dai(BOTTINO_EXTRA.oggetti[Math.floor(Math.random() * BOTTINO_EXTRA.oggetti.length)]);
      const pp = BOTTINO_EXTRA.pepita;
      if ((e.lv || 0) >= pp.daLivello && Math.random() < pp.p * (e.feroce ? 3 : 1)) dai('pepita');
      if (e.feroce && Math.random() < 0.25) dai('gingillo');
    }
    return Object.entries(preso).map(([id, n]) => { g.prog.dai(id, n); return this._nomeOgg(id, n); });
  }

  // ---------- Endgame ----------
  async _endgame() {
    if (this.st.endgame) return;
    this.st.endgame = true;
    const g = this.game;
    this._segni();
    g.emit('endgame', { livello: this.s.level });
    // il dialogo aspetta la fine dello scontro (si sale di livello alla vittoria)
    const mostra = async () => {
      if (g.combat?.active || g.ui.busy?.()) return setTimeout(mostra, 800);
      await g.ui.dialog(pagine(T.endgame));
    };
    setTimeout(mostra, 600);
  }

  // ---------- Stile dei posti dello scontro ----------
  _css() {
    if (document.getElementById('boss-css')) return;
    const l = document.createElement('link');
    l.id = 'boss-css'; l.rel = 'stylesheet'; l.href = new URL('./boss.css', import.meta.url).href;
    document.head.appendChild(l);
  }

  // ---------- Prove (?pilot) ----------
  prova() { return this.game.ui.dialog([this._menuProva()]); }

  _prepara(L) {
    const s = this.s, g = this.game;
    if (s.level < L) { g.prog.p.punti += L - s.level; s.level = L; s.xp = 0; }
    s.maxHealth = g.prog.maxHealth(); s.health = s.maxHealth; s.stress = 10; s.tired = 0;
    for (const [o, n] of [['panino', 3], ['sciroppo', 2], ['caffe', 2]]) s.inv[o] = Math.max(s.inv[o] || 0, n);
  }

  _vai(x, z) {
    const g = this.game;
    if (g.vehicles?.driving) g.vehicles.leave();
    for (let r = 0; r < 4; r += 0.4) for (const [ox, oz] of [[0, r], [r, 0], [-r, 0], [0, -r]]) {
      if (!g.world.blocked(x + ox, z + oz)) { g.player.group.position.set(x + ox, 0, z + oz); return; }
    }
    g.player.group.position.set(x, 0, z);
  }

  _menuProva() {
    const g = this.game, menu = () => this._menuProva();
    const lista = () => [{ name: '🧪 Boss', text: 'Combatti subito un boss (alza Garonio al suo livello e lo cura).', choices: [
      ...Object.entries(BOSS).map(([id, b]) => ({ label: `${b.icona} Lv ${b.lv} · ${b.nemico.name} (${b.zona}) · ${this.stato(id)}`, fn: () => { this._prepara(b.lv); setTimeout(() => this.affronta(id), 50); return null; } })),
      { label: '◀ Indietro', fn: () => [menu()] },
    ] }];
    const missioni = () => [{ name: '🧪 Missioni dei boss', text: 'Accetta la missione e porta Garonio alla tana (ora compresa).', choices: [
      ...Object.entries(BOSS).map(([id, b]) => ({ label: `${b.icona} ${b.titolo}`, fn: () => {
        this._prepara(b.lv);
        if (!g.quests.stato(quest(id))) g.quests.accetta(quest(id));
        this.s.minutes = Math.floor(this.s.minutes / (24 * H)) * 24 * H + ((b.tana.ore?.[0] ?? 8) + 0.5) * H;
        if (b.tana.interno) { g.enter?.(b.tana.interno); } else this._vai(b.tana.x, b.tana.z + 1.2);
        this._segni();
        return null;
      } })),
      { label: '◀ Indietro', fn: () => [menu()] },
    ] }];
    return { name: '👹 Boss e livelli', text: `Livello ${this.s.level}/${LIVELLI.max}. Boss battuti: ${Object.keys(BOSS).filter(id => this.stato(id) === 'vinto').length}/${Object.keys(BOSS).length}.`, choices: [
      { label: '⚔️ Combatti un boss', fn: lista },
      { label: '🗺️ Missione e tana di un boss', fn: missioni },
      { label: '⬆️ Livello +5', fn: () => { this._prepara(Math.min(LIVELLI.max, this.s.level + 5)); return [menu()]; } },
      { label: '⭐ Livello 30 (endgame)', fn: () => { const prima = this.s.level; this._prepara(LIVELLI.max); if (prima < LIVELLI.max) g.emit('livello', { level: LIVELLI.max }); return null; } },
      { label: '🏆 Segna tutti i boss come battuti', fn: () => { for (const id of Object.keys(BOSS)) if (id !== 'mountain') (this.st.boss[id] ??= {}).vinto = true; this._segni(); return [menu()]; } },
      { label: '⏩ Sfide leggendarie di nuovo pronte', fn: () => { for (const b of Object.values(this.st.boss)) delete b.leggenda; this._segni(); return [menu()]; } },
      { label: 'Chiudi', fn: null },
    ] };
  }
}
