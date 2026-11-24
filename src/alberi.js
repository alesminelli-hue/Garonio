// Alberi col tesoro: loot nascosto sugli alberi della mappa (GDD capitolo 25).
// Ogni mattina alcuni alberi a caso nascondono qualcosa (attrezzi agricoli, vestiti da lavoro, mele, noci,
// gingilli, qualche soldo). A piedi, vicino a un albero: «🌳 Scuoti l'albero» (E). L'albero trema e la roba
// cade giù. Ogni albero si scuote una volta al giorno. Gli alberi normali a volte danno una mela, una pigna
// in testa o una gazza arrabbiata. Dati: src/data/alberi.js; attrezzi e vestiti: src/data/armi.js (albero: true);
// sprite: src/sprite_loot.js.
//
// API (game.alberi):
//   scuoti(i)        scuote l'albero numero i (di world.alberi)
//   tesori()         indici degli alberi col tesoro oggi
// Eventi: emette  alberoScosso { tesoro, cosa }
import * as PIX from './pixel.js';
import { ALBERI as D } from './data/alberi.js';
import { ARMI, VESTITI, OGGETTI } from './data/armi.js';
import { ICONE_LOOT } from './sprite_loot.js';
import { pick, fill } from './racconto.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rint = (R, a, b) => a + Math.floor(R() * (b - a + 1));
const estrai = (lista, R) => {
  const tot = lista.reduce((t, x) => t + x.w, 0);
  let r = R() * tot;
  for (const x of lista) { r -= x.w; if (r < 0) return x; }
  return lista[lista.length - 1];
};

export class Alberi {
  constructor(game) {
    this.game = game;
    this.cadute = [];     // roba che sta cadendo: { spr, x, z, y, vy, t }
    this.tremano = [];    // alberi che tremano: { a, x0, t }
    this._tex = {};
  }
  get s() { return this.game.s; }
  get st() {
    const f = (this.s.flags ??= {});
    const st = (f.alberi ??= { giorno: -1, scossi: [] });
    if (st.giorno !== this.s.day) { st.giorno = this.s.day; st.scossi = []; }
    return st;
  }
  get lista() { return this.game.world?.alberi || []; }

  init() {
    const g = this.game, W = g.world;
    // solo gli alberi raggiungibili: niente cornice, almeno un lato libero
    this.validi = [];
    this.lista.forEach((a, i) => {
      if (a.bordo) return;
      if ([[0, 0.9], [0, -0.9], [0.9, 0], [-0.9, 0]].some(([dx, dz]) => !W.blocked(a.x + dx, a.z + dz))) this.validi.push(i);
    });
    // griglia per trovare in fretta l'albero vicino
    this.griglia = new Map();
    for (const i of this.validi) {
      const a = this.lista[i], k = `${Math.floor(a.x / 4)},${Math.floor(a.z / 4)}`;
      if (!this.griglia.has(k)) this.griglia.set(k, []);
      this.griglia.get(k).push(i);
    }
    g.bersagli.push(() => this.bersaglio());
    g.moduli.push({ animate: dt => this.animate(dt) });
    g.pilot?.sezione?.('🌳 Alberi col tesoro', () => this._prova());
    setTimeout(() => this._segnaGazza(), 500);
  }

  // alberi col tesoro di oggi: estratti col giorno come seme, così restano gli stessi fino a domattina
  tesori() {
    if (this._tGiorno === this.s.day) return this._t;
    const R = PIX.rng(1000 + this.s.day * 7919), pool = [...this.validi], out = new Set();
    for (let k = 0; k < D.tesoriAlGiorno && pool.length; k++) out.add(pool.splice(Math.floor(R() * pool.length), 1)[0]);
    this._tGiorno = this.s.day; this._t = out;
    return out;
  }

  _vicino() {
    const P = this.game.player.group.position;
    const gx = Math.floor(P.x / 4), gz = Math.floor(P.z / 4);
    let best = -1, bd = D.raggio;
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) {
      for (const i of this.griglia.get(`${gx + dx},${gz + dz}`) || []) {
        const a = this.lista[i]; if (a.tagliato) continue;
        const d = Math.hypot(P.x - a.x, P.z - a.z);
        if (d < bd) { bd = d; best = i; }
      }
    }
    return best;
  }

  bersaglio() {
    const g = this.game;
    if (g.vehicles?.driving || g.interni?.attivo) return null;
    const i = this._vicino();
    return i < 0 ? null : { label: D.testi.etichetta, fn: () => this.scuoti(i) };
  }

  // ---------- Scuotere ----------
  async scuoti(i, forza = null) {
    const g = this.game, s = this.s, st = this.st, a = this.lista[i];
    if (!a) return;
    this.tremano.push({ a, x0: a.spr.position.x, t: 0.7 });
    g.audio.sfx('blip'); g.actT = 0.5; g.actName = 'attack';
    if (st.gazza?.i === i) return this._ritrova(a);
    if (st.scossi.includes(i) && !forza) return g.ui.toast(pick(D.testi.giaScosso));
    st.scossi.push(i);
    s.tired = clamp(s.tired + D.fatica, 0, 100);
    const tesoro = forza ? forza === 'tesoro' : this.tesori().has(i);
    const R = Math.random;
    const scelta = forza && forza !== 'tesoro' ? D.comune.find(x => x.tipo === forza) : this._scegli(tesoro ? D.tesoro : D.comune, R);
    const cose = [], icone = [];
    const dai = (tipo, id, n = 1) => {
      if (tipo === 'arma') { g.prog.daiArma(id); cose.push(`⭐ ${ARMI[id].nome}`); }
      else if (tipo === 'vestito') { g.prog.daiVestito(id, !g.prog.indossato(VESTITI[id].slot)); cose.push(`⭐ ${VESTITI[id].nome}`); }
      else { g.prog.dai(id, n); cose.push(`${OGGETTI[id]?.icona || ''} ${OGGETTI[id]?.nome || id}${n > 1 ? ` ×${n}` : ''}`); }
      for (let k = 0; k < Math.min(n, 3); k++) icone.push(id);
    };
    switch (scelta.tipo) {
      case 'arma': dai('arma', scelta.id); break;
      case 'vestito': dai('vestito', scelta.id); break;
      case 'oggetto': dai('oggetto', scelta.id, rint(R, ...(scelta.n || [1, 1]))); break;
      case 'soldi': { const n = rint(R, ...scelta.n); s.money += n; cose.push(`${n}€`); icone.push('soldi'); break; }
      case 'pignaInTesta':
        icone.push('pigna');
        s.health = clamp(s.health - scelta.vita, 1, s.maxHealth); g.ui.shake?.(); g.audio.sfx('bad');
        g.ui.toast(fill(D.testi.pignaInTesta, scelta), 'bad');
        break;
      case 'gazza':
        if (Math.random() < D.testi.gazzaLadra) { this._gazzaLadra(i); break; }
        g.ui.toast(D.testi.gazza, 'bad');
        setTimeout(() => { if (!g.combat.active) g.combat.start({ enemies: ['gazza'], place: 'campo', intro: D.testi.gazza }); }, 400);
        break;
      default: g.ui.toast(pick(D.testi.niente));
    }
    this._cade(a, icone);
    if (cose.length) {
      g.audio.sfx('coin');
      g.ui.toast(`${tesoro ? pick(D.testi.tesoro) + ' ' : ''}${fill(D.testi.trovato, { cose: cose.join(', ') })}`, 'good');
    }
    g.emit('alberoScosso', { tesoro, cosa: scelta.tipo, id: scelta.id });
  }

  // ---------- La gazza ladra ----------
  // ruba un oggetto (o qualche soldo) e lo nasconde su un albero vicino: scuotendo quello lo riprendi
  _gazzaLadra(da) {
    const g = this.game, s = this.s, st = this.st, a0 = this.lista[da];
    const roba = Object.entries(s.inv || {}).filter(([id, n]) => n > 0 && OGGETTI[id] && !OGGETTI[id].missione);
    let furto = null;
    if (roba.length) {
      const [id, n] = roba[Math.floor(Math.random() * roba.length)], k = Math.min(n, 1 + Math.floor(Math.random() * 3));
      g.prog.togliOggetto(id, k); furto = { id, n: k };
    } else if (s.money >= 10) { const n = Math.min(s.money, 10 + Math.floor(Math.random() * 30)); s.money -= n; furto = { soldi: n }; }
    if (!furto) return g.ui.toast(D.testi.gazzaNiente, 'bad');
    const vicini = this.validi.filter(i => i !== da && Math.hypot(this.lista[i].x - a0.x, this.lista[i].z - a0.z) < 14 && Math.hypot(this.lista[i].x - a0.x, this.lista[i].z - a0.z) > 4);
    const i = vicini.length ? vicini[Math.floor(Math.random() * vicini.length)] : da;
    st.gazza = { i, ...furto };
    const cosa = furto.soldi ? `${furto.soldi}€` : `${OGGETTI[furto.id].icona} ${OGGETTI[furto.id].nome}${furto.n > 1 ? ` ×${furto.n}` : ''}`;
    g.ui.toast(fill(D.testi.gazzaRuba, { cosa }), 'bad');
    g.audio.sfx('bad');
    this._segnaGazza();
  }
  _segnaGazza() {
    const gz = this.st.gazza, a = gz && this.lista[gz.i];
    window.__garonio?.minimap?.setMarker('gazzaLadra', a ? a.x : null, a?.z, '#111111');
  }
  _ritrova(a) {
    const g = this.game, s = this.s, gz = this.st.gazza;
    this.st.gazza = null; this._segnaGazza();
    const icone = [], cose = [];
    if (gz.soldi) { s.money += gz.soldi; cose.push(`${gz.soldi}€`); icone.push('soldi'); }
    else { g.prog.dai(gz.id, gz.n); cose.push(`${OGGETTI[gz.id]?.icona || ''} ${OGGETTI[gz.id]?.nome || gz.id}${gz.n > 1 ? ` ×${gz.n}` : ''}`); icone.push(gz.id); }
    const extra = Math.random() < 0.35 ? 'uovoGazza' : 'gingillo';
    g.prog.dai(extra, 1); cose.push(`${OGGETTI[extra].icona} ${OGGETTI[extra].nome}`); icone.push(extra);
    this._cade(a, icone);
    g.audio.sfx('coin');
    g.ui.toast(fill(D.testi.gazzaRitrovata, { cosa: cose.join(', ') }), 'good');
    g.emit('alberoScosso', { tesoro: true, cosa: 'gazzaLadra' });
  }

  // estrazione: armi e vestiti agricoli solo se ce n'è ancora qualcuno da trovare
  _scegli(lista, R) {
    const s = this.s, p = this.game.prog;
    const armi = Object.entries(ARMI).filter(([id, a]) => a.albero && !p.haArma(id)).map(([id, a]) => [id, a]);
    const vest = Object.keys(VESTITI).filter(id => VESTITI[id].albero && !p.haVestito(id));
    const stag = this.game.bestie?.stagione?.();
    const ok = lista.filter(x => {
      if (x.daLivello && s.level < x.daLivello) return false;
      if (x.solo && stag && !x.solo.includes(stag)) return false;
      if (x.tipo === 'arma') return armi.some(([, a]) => a.liv <= s.level + (x.livelloSopra || 0));
      if (x.tipo === 'vestito') return vest.length > 0;
      return true;
    });
    const x = { ...estrai(ok, R) };
    if (x.tipo === 'arma') {
      // la più debole che manca, così si trovano in ordine (e ogni tanto una a caso)
      const m = armi.filter(([, a]) => a.liv <= s.level + (x.livelloSopra || 0)).sort((a, b) => a[1].liv - b[1].liv);
      x.id = (R() < 0.7 ? m[0] : m[Math.floor(R() * m.length)])[0];
    }
    if (x.tipo === 'vestito') x.id = vest[Math.floor(R() * vest.length)];
    return x;
  }

  // ---------- Animazioni: l'albero trema, la roba cade e salta in tasca ----------
  _texture(id) {
    if (this._tex[id]) return this._tex[id];
    let cv;
    if (ICONE_LOOT[id]) cv = ICONE_LOOT[id]();
    else {
      const [c, g] = PIX.makeCanvas(16, 16);
      g.font = '13px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(id === 'soldi' ? '💶' : (OGGETTI[id]?.icona || '✨'), 8, 9);
      cv = c;
    }
    return (this._tex[id] = PIX.toTexture(cv));
  }

  _cade(a, icone) {
    const W = this.game.world;
    icone.forEach((id, k) => {
      const spr = W.sprite(this._texture(id), { w: 0.7, h: 0.7 });
      const x = a.x + (Math.random() - 0.5) * 1.2, z = a.z + 0.4 + Math.random() * 0.3;
      spr.position.set(x, 1.6 + Math.random() * 0.8, z);
      W.scene.add(spr);
      this.cadute.push({ spr, x, z, y: spr.position.y, vy: 0, t: -k * 0.15, a: 0 });
    });
  }

  animate(dt) {
    const W = this.game.world;
    for (const tr of this.tremano) {
      tr.t -= dt;
      tr.a.spr.position.x = tr.x0 + (tr.t > 0 ? Math.sin(tr.t * 45) * 0.07 * tr.t : 0);
    }
    this.tremano = this.tremano.filter(tr => tr.t > 0);
    const P = this.game.player.group.position;
    for (const c of this.cadute) {
      c.t += dt;
      if (c.t < 0) continue;
      if (c.t < 1.1) {                    // cade e rimbalza
        c.vy -= 14 * dt; c.y += c.vy * dt;
        if (c.y < 0) { c.y = 0; c.vy = Math.abs(c.vy) * 0.35; }
        c.spr.position.y = c.y;
      } else {                            // vola in tasca a Garonio
        c.a = Math.min(1, c.a + dt * 3);
        c.spr.position.set(c.x + (P.x - c.x) * c.a, 0.6 * Math.sin(c.a * Math.PI), c.z + (P.z - c.z) * c.a);
      }
    }
    for (const c of this.cadute.filter(c => c.a >= 1)) { W.scene.remove(c.spr); W.spriteMats?.delete(c.spr.material); }
    this.cadute = this.cadute.filter(c => c.a < 1);
  }

  // ---------- Prove (?pilot) ----------
  _prova() {
    const g = this.game, s = this.s;
    const vai = (i) => {
      const a = this.lista[i];
      for (const [dx, dz] of [[0, 0.9], [0.9, 0], [-0.9, 0], [0, -0.9]]) if (!g.world.blocked(a.x + dx, a.z + dz)) { g.player.group.position.set(a.x + dx, 0, a.z + dz); return; }
    };
    return [
      { label: `🌳 Vai a un albero col tesoro (oggi ${this.tesori().size}, scossi ${this.st.scossi.length})`, fn: () => {
        const libero = [...this.tesori()].find(i => !this.st.scossi.includes(i));
        if (libero != null) vai(libero); return null;
      } },
      { label: '🐦‍⬛ Gazza ladra qui', fn: () => { const i = this._vicino(); if (i >= 0) this._gazzaLadra(i); return null; } },
      { label: '🐦‍⬛ Vai all\'albero della gazza ladra', fn: () => { if (this.st.gazza) vai(this.st.gazza.i); return null; } },
      { label: '🎁 Scuoti qui: tesoro sicuro', fn: () => { const i = this._vicino(); if (i >= 0) setTimeout(() => this.scuoti(i, 'tesoro'), 50); return null; } },
      { label: '🧺 Dai tutti gli attrezzi e i vestiti degli alberi', fn: () => {
        for (const [id, a] of Object.entries(ARMI)) if (a.albero) g.prog.daiArma(id);
        for (const [id, v] of Object.entries(VESTITI)) if (v.albero) g.prog.daiVestito(id);
        return null;
      } },
    ];
  }
}
