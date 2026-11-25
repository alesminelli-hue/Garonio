// Gli altri edifici esplorabili (GDD capitolo 29): municipio con i tre sportelli, tabacchi, alimentari, fienile,
// parrucchiera, casa della Sciura Ines, le cascine dei vicini, il Consorzio, il casotto delle Guardie, la stalla,
// il capannone del mangime e la Cascina dei Salici (casa con il baule e il letto, porcilaia, stalla, pollaio).
// Stanze, personaggi, missioni e testi in src/data/dentro.js: le stanze entrano in INTERNI (src/data/interni.js),
// i personaggi in PNG (src/data/png.js), le missioni in SECONDARIE (src/data/secondarie.js).
// Qui: le azioni dei mobili, le scelte in più dei personaggi, la chiave della Cascina dei Salici, il letto e il
// baule di Garonio, gli animali che stanno dentro.
//
// API (game.dentro):  baule() → { id: n } (la roba nel baule)
// Stato: s.flags.dentro = { giorno: { d, ...cose fatte oggi }, baule: { id: n }, letto: 'salici-casa' | null }
import * as PIX from './pixel.js';
import { ATLANTE } from './data/sprite_personaggi.js';
import { OGGETTI } from './data/armi.js';
import { PNG } from './data/png.js';
import { STRUTTURE } from './data/azienda.js';
import { AZIONI_DENTRO, COMPARSE, CHIAVI, CHIAVE_NO, BIBLIOTECA, TESTI_DENTRO as T } from './data/dentro.js';
import { pick, fill } from './racconto.js';

const H = 60;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const MAX_SCELTE = 9;

export class Dentro {
  constructor(game) { this.game = game; this.comparse = []; }
  get s() { return this.game.s; }
  get st() {
    const f = (this.s.flags ??= {}), st = (f.dentro ??= {});
    st.baule ??= {};
    if (st.giorno?.d !== this.s.day) st.giorno = { d: this.s.day };
    return st;
  }
  get oggi() { return this.st.giorno; }
  baule() { return { ...this.st.baule }; }

  init() {
    const g = this.game, I = g.interni; if (!I) return;
    for (const [zona, A] of Object.entries(AZIONI_DENTRO)) I.aggancia(zona, () => this._semplice(zona, A));
    for (const [zona, fn] of Object.entries(this._speciali())) I.aggancia(zona, ctx => fn(ctx));
    // la Cascina dei Salici è chiusa a chiave finché non è di Garonio
    const entra = I.entra.bind(I);
    I.entra = async (id, opts = {}) => {
      if (!opts.ripristino && CHIAVI[id] === 'salici' && !g.azienda?.comprata?.()) { await g.ui.dialog([{ name: I.defs[id]?.nome || '', text: CHIAVE_NO }]); return true; }
      const r = await entra(id, opts);
      this._mostraAnimali();
      return r;
    };
    // chi dorme nel letto dei Salici si sveglia lì
    const sveglia = I.svegliaDentro.bind(I);
    I.svegliaDentro = () => {
      if (I.attivo && I.edificio === 'salici-casa') {
        const w = I.mondo('salici-casa', 9.5, 3.8);
        g.player.group.position.set(w.x, 0, w.z); I.scatto = true;
        setTimeout(() => g.ui.toast(T.letto.sveglia), 1500);
        return true;
      }
      return sveglia();
    };
    this._scelte();
    this._animali();
    if (I.attivo) this._mostraAnimali();
    g.moduli.push({ update: dt => this._muovi(dt) });
    g.pilot?.sezione?.('🚪 Edifici', [
      { label: '🏛️ Vai al municipio (ore 10)', fn: () => { this.s.minutes = Math.max(this.s.minutes, 10 * H); g.player.group.position.set(27.1, 0, 50.2); return null; } },
      { label: '📦 Metti 3 roba a caso nello zaino', fn: () => { for (const o of ['mela', 'pigna', 'legna']) g.prog.dai(o, 3); return null; } },
    ]);
  }

  // ---------- azioni semplici (testo + piccolo effetto) ----------
  async _semplice(zona, A) {
    const g = this.game, s = this.s, nome = g.interni.defs[g.interni.edificio]?.nome || '';
    if (A.unaAlGiorno && this.oggi[zona]) return g.ui.dialog([{ name: nome, text: A.giaFatto || 'Per oggi basta.' }]);
    if (A.costo) {
      if (s.money < A.costo) return g.ui.dialog([{ name: nome, text: `Servono ${A.costo}€. Garonio fruga nelle tasche: trova un bottone e un tappo.` }]);
      s.money = Math.round((s.money - A.costo) * 100) / 100; g.audio.sfx('coin');
    }
    if (A.unaAlGiorno) this.oggi[zona] = true;
    const e = A.effetto || {};
    if (e.stress) s.stress = clamp(s.stress + e.stress, 0, 100);
    if (e.tired) s.tired = clamp(s.tired + e.tired, 0, 100);
    if (e.health) s.health = clamp(s.health + e.health, 0, s.maxHealth);
    if (e.minuti) s.minutes += e.minuti;
    for (const [o, n] of Object.entries(A.oggetti || {})) if (OGGETTI[o]) g.prog.dai(o, n);
    await g.ui.dialog([{ name: nome, text: pick(A.t) }]);
  }

  // ---------- azioni speciali ----------
  _speciali() {
    const g = this.game;
    const scheda = id => () => {
      const S = STRUTTURE[id], lv = g.azienda?.lv?.(id) || 0;
      return g.ui.dialog([{ name: 'Scheda', text: lv ? fill(T.scheda, { nome: S.livelli[lv - 1].nome, lv, desc: S.livelli[lv - 1].desc }) : fill(T.schedaNo, { nome: S.nome }) }]);
    };
    return {
      'municipio:multe': () => g.vigilessa ? g.ui.dialog([g.vigilessa._paginaPaga('municipio')]) : g.ui.toast('Nessuna multa. Per ora.'),
      'municipio:anagrafe': () => g.matrimonio ? g.matrimonio.anagrafe() : g.ui.toast(T.municipioChiuso),
      'municipio:agricolo': () => g.azienda?.ufficio?.(),
      'municipio:guide': () => g.ui.dialog([this._scaffale('guide')]),
      'municipio:storia': () => g.ui.dialog([this._scaffale('storia')]),
      'municipio:mestieri': () => g.ui.dialog([this._scaffale('mestieri')]),
      'municipio:segreti': () => g.ui.dialog([this._scaffale('segreti')]),
      'tabacchi:gratta': () => g.ui.dialog([this._gratta()]),
      'alimentari:banco': () => g.ui.dialog([this._spesa()]),
      'casa-rosa:poltrona': () => g.ui.dialog([this._taglio()]),
      'fienile:paglia': () => this._pisolino('fieno'),
      'salici-casa:letto': () => this._letto(),
      'salici-casa:baule': () => g.ui.dialog([this._baule()]),
      'salici-casa:registro': () => g.azienda?.apriRegistro?.(),
      'salici-casa:conti': () => {
        const A = g.azienda; if (!A) return null;
        const tot = Math.round(A.st.tot?.guadagni || 0);
        const mag = Object.entries(A.magazzino || {}).filter(([, n]) => n > 0).map(([k, n]) => `${Math.round(n)} ${k}`).join(', ') || 'niente';
        return g.ui.dialog([{ name: 'Conti', text: fill(T.conti, { tot: tot.toLocaleString('it-IT'), mag }) }]);
      },
      'salici-porcilaia:scheda': scheda('porcilaia'),
      'salici-stalla:scheda': scheda('stalla'),
      'salici-pollaio:scheda': scheda('pollaio'),
    };
  }

  _paga(n) { const s = this.s; if (s.money < n) return false; s.money = Math.round((s.money - n) * 100) / 100; this.game.audio.sfx('coin'); return true; }
  _pg(id, text, choices) { return { who: id, name: PNG[id]?.nome || '', text, choices }; }

  _gratta(testo) {
    const G = T.gratta, o = this.oggi;
    return this._pg('rosy', testo || `Gratta e Vinci «Il Bassaiolo»: ${G.prezzo}€. Oggi ne hai grattati ${o.gratta || 0} su ${G.max}.`, [
      { label: `🎟️ Gratta (${G.prezzo}€)`, disabled: (o.gratta || 0) >= G.max, fn: () => {
        if ((o.gratta || 0) >= G.max) return [this._gratta(G.finiti)];
        if (!this._paga(G.prezzo)) return [this._gratta(G.noSoldi)];
        o.gratta = (o.gratta || 0) + 1;
        let r = Math.random(), premio = G.premi[0];
        for (const p of G.premi) { if (r < p[0]) { premio = p; break; } r -= p[0]; }
        if (premio[1]) { this.s.money += premio[1]; this.game.audio.sfx('coin'); this.game.emit('grattaEVinci', { vinto: premio[1] }); }
        return [this._gratta(premio[2])];
      } },
      { label: 'Basta così', fn: null },
    ]);
  }

  _spesa(testo) {
    const S = T.spesa;
    return this._pg('rina', testo || S.benvenuto, [
      ...S.lista.filter(([o]) => OGGETTI[o]).map(([o, p]) => ({ label: `${OGGETTI[o].icona} ${OGGETTI[o].nome} (${p}€)`, fn: () => {
        if (!this._paga(p)) return [this._spesa(S.noSoldi)];
        this.game.prog.dai(o, 1);
        return [this._spesa(fill(S.fatto, { cosa: `${OGGETTI[o].icona} ${OGGETTI[o].nome}` }))];
      } })),
      { label: 'Arrivederci', fn: null },
    ]);
  }

  _taglio() {
    const C = T.taglio, s = this.s;
    if (this.oggi.taglio) return this._pg('wanda', C.gia);
    return this._pg('wanda', `Taglio e piega: ${C.prezzo}€. Stress ${C.stress}. Ti siedi?`, [
      { label: `✂️ Taglio e piega (${C.prezzo}€)`, fn: () => {
        if (!this._paga(C.prezzo)) return [this._pg('wanda', C.noSoldi)];
        this.oggi.taglio = true; s.stress = clamp(s.stress + C.stress, 0, 100); s.minutes += 30;
        this.game.emit('taglio', {});
        return [this._pg('wanda', pick(C.fatto))];
      } },
      { label: 'Un\'altra volta', fn: null },
    ]);
  }

  async _pisolino(dove) {
    const g = this.game, s = this.s, P = T.pisolino, fieno = dove === 'fieno';
    if (this.oggi.pisolino) return g.ui.dialog([{ name: fieno ? 'Fieno' : 'Letto', text: fieno ? P.fienoGia : P.gia }]);
    this.oggi.pisolino = true;
    await g.ui.fade(true);
    s.tired = clamp(s.tired + (fieno ? -20 : P.tired), 0, 100); s.minutes += P.minuti;
    await g.ui.fade(false);
    await g.ui.dialog([{ name: fieno ? 'Fieno' : 'Letto', text: fieno ? P.fieno : P.fatto }]);
  }

  async _letto() {
    const g = this.game, L = T.letto, late = this.s.minutes >= 20 * H;
    let scelta = null;
    await g.ui.dialog([{ name: 'Letto di Garonio', text: late ? L.sera : L.giorno, choices: [
      { label: L.dormi, disabled: !late, fn: () => { scelta = 'dormi'; return null; } },
      { label: L.pisolino, disabled: late, fn: () => { scelta = 'pisolino'; return null; } },
      { label: '💾 Salva la partita', fn: () => { g.save(); g.ui.toast('Partita salvata.', 'good'); return null; } },
      { label: 'Lascia stare', fn: null },
    ] }]);
    if (scelta === 'dormi') g.sleep(false);
    else if (scelta === 'pisolino') await this._pisolino('letto');
  }

  // ---------- la biblioteca comunale ----------
  _scaffale(id) {
    const letti = (this.st.letti ??= []);
    return { name: 'Biblioteca comunale', text: BIBLIOTECA.benvenuto[id], choices: [
      ...BIBLIOTECA[id].map((L, i) => ({ label: `${L.titolo}${letti.includes(`${id}:${i}`) ? ' ✓' : ''}`, fn: () => {
        const nuovo = !letti.includes(`${id}:${i}`);
        if (nuovo) { letti.push(`${id}:${i}`); this.game.prog.addXp(T.biblioteca.xp); this.game.emit('libroLetto', { scaffale: id, libro: i }); }
        return [...L.pagine.map(t => ({ name: L.titolo, text: t })),
          { name: 'Biblioteca comunale', text: nuovo ? fill(T.biblioteca.fine, { xp: T.biblioteca.xp }) : 'Rimetti il libro al suo posto.', choices: [
            { label: '📚 Un altro libro', fn: () => [this._scaffale(id)] }, { label: 'Basta leggere', fn: null }] }];
      } })),
      { label: 'Lascia stare', fn: null },
    ] };
  }

  // ---------- il baule di Garonio ----------
  _nome(o) { const O = OGGETTI[o]; return O ? `${O.icona} ${O.nome}` : o; }
  _baule(testo) {
    const B = T.baule, dep = this.st.baule;
    const lista = Object.entries(dep).filter(([, n]) => n > 0).map(([k, n]) => `${this._nome(k)} ×${n}`).join(', ');
    return { name: B.titolo, text: testo || (lista ? fill(B.dentro, { lista }) : B.vuoto), choices: [
      { label: B.metti, fn: () => [this._scegli('metti')] },
      { label: B.riprendi, disabled: !lista, fn: () => [this._scegli('riprendi')] },
      { label: 'Chiudi il baule', fn: null },
    ] };
  }
  _scegli(verso, da = 0) {
    const B = T.baule, g = this.game, inv = this.s.inv, dep = this.st.baule;
    const fonte = verso === 'metti' ? inv : dep;
    const cose = Object.entries(fonte).filter(([k, n]) => n > 0 && OGGETTI[k] && !OGGETTI[k].missione);
    if (!cose.length) return this._baule(verso === 'metti' ? B.niente : B.vuoto);
    const pezzo = cose.slice(da, da + MAX_SCELTE);
    const choices = pezzo.map(([k, n]) => ({ label: `${this._nome(k)} ×${n}`, fn: () => {
      if (verso === 'metti') { dep[k] = (dep[k] || 0) + n; g.prog.togliOggetto(k, n); }
      else { g.prog.dai(k, n); dep[k] = 0; delete dep[k]; }
      g.audio.sfx('coin');
      return [this._baule(fill(verso === 'metti' ? B.messo : B.preso, { cosa: `${this._nome(k)} ×${n}` }))];
    } }));
    if (cose.length > da + MAX_SCELTE) choices.push({ label: 'Altro…', fn: () => [this._scegli(verso, da + MAX_SCELTE)] });
    choices.push({ label: 'Indietro', fn: () => [this._baule()] });
    return { name: B.titolo, text: verso === 'metti' ? B.quale : B.qualeR, choices };
  }

  // ---------- scelte in più dei personaggi ----------
  _scelte() {
    const g = this.game, P = g.png;
    P.aggiungiScelte('rosy', () => [{ label: '🎟️ Gratta e Vinci', fn: () => [this._gratta()] }]);
    P.aggiungiScelte('rina', () => [{ label: '🛒 Fai la spesa', fn: () => [this._spesa()] }]);
    P.aggiungiScelte('wanda', () => [{ label: '✂️ Taglio e piega', fn: () => [this._taglio()] }]);
    P.aggiungiScelte('cavilli', () => g.matrimonio ? [{ label: '🏛️ Anagrafe: matrimoni e divorzi', fn: () => { setTimeout(() => g.matrimonio.anagrafe(), 50); return null; } }] : []);
  }

  // ---------- animali che stanno dentro ----------
  _animali() {
    const g = this.game, W = g.world, I = g.interni;
    for (const [id, lista] of Object.entries(COMPARSE)) {
      if (!I.defs[id]) continue;
      for (const c of lista) {
        const at = ATLANTE[c.sprite]; if (!at || !PIX.haSprite?.(c.sprite)) continue;
        const [, , sw, sh] = at, h = c.w * (sh + 1) / sw;
        const fr = (this._fr ??= {})[c.sprite] ??= [0, 1].map(f => PIX.animale(c.sprite, f, sw, sh + 1));
        const a = W.actor([...fr, ...fr.map(PIX.mirror)], { w: c.w, h, shadow: c.w * 0.3 });
        const p = I.mondo(id, c.x, c.z);
        a.group.position.set(p.x, 0, p.z); a.group.visible = false;
        this.comparse.push({ id, c, a, t: Math.random() * 6, dir: Math.random() < 0.5 ? 0 : 2 });
      }
    }
  }
  _mostraAnimali() {
    const I = this.game.interni, A = this.game.azienda;
    for (const k of this.comparse) k.a.group.visible = I.attivo && I.edificio === k.id && (!k.c.struttura || (A?.lv?.(k.c.struttura) || 0) >= (k.c.lv || 1));
  }
  _muovi(dt) {
    const I = this.game.interni;
    if (!I?.attivo) { if (this._eraDentro) { this._eraDentro = false; for (const k of this.comparse) k.a.group.visible = false; } return; }
    this._eraDentro = true;
    for (const k of this.comparse) {
      if (!k.a.group.visible) continue;
      k.t += dt;
      if (k.t > 5) { k.t = 0; if (Math.random() < 0.4) k.dir = k.dir ? 0 : 2; }
      k.a.setFrame(k.dir + (Math.floor(k.t * 1.5) % 2));
    }
  }
}
