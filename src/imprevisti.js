// Imprevisti sulla mappa che fanno salire lo stress (GDD: «serve un mondo più vivo»).
// Testi e numeri: IMPREVISTI in src/data/vita.js.
//
//  - Buche sulle strade: ogni giorno ne spuntano di nuove. Coi mezzi rovinano Vespa, Punto e trattori
//    (stato −%, la Punto può forare): la riparazione è quella a pagamento di Zeno. A piedi si inciampa.
//  - Pozzanghere: nei giorni di pioggia (e il giorno dopo) su sterrati e provinciale. Calzini bagnati,
//    la Vespa scoda, le auto che passano fanno la doccia a Garonio.
//  - Cantieri: «lavori in corso» su una strada sterrata, con transenne, operai e gli umarell a guardare.
//    Occupano mezza carreggiata per tutto il giorno.
//  - Cane randagio: ogni tanto ne arriva uno e insegue Garonio. Si scappa correndo, si scaccia, si sfama con un uovo o si affronta.
//  - Paesani impiccioni: ti attaccano bottone (stress), si può ascoltare, tagliare corto o fingere una telefonata.
//  - Zanzare la sera vicino al laghetto e al canale.
//
// API (game.imprevisti):
//   buche, pozze            [{ x, z }]
//   cantiere                { strada, x, z, orizz } | null
//   cane                    il randagio in giro { x, z } | null
//   ostacoliStrada()        ostacoli per il traffico (src/vita.js)
//   prova(tipo)             (console) fa succedere subito: 'buca' | 'pozze' | 'cantiere' | 'cane' | 'impiccione'
// Eventi mandati: buca { mezzo, danno, x, z } · randagio { esito } · impiccione { png, scelta }
// Stato: s.flags.imprevisti = { buche, pozze, pozzeGiorno, cantiere, ultimoImp, impGiorno, zanzare }
import * as THREE from 'three';
import * as PIX from './pixel.js';
import * as SV from './sprite_vita.js';
import { ENEMIES } from './combat.js';
import { ROADS, ROAD_GRAPH, surfaceAt, MAP_W, MAP_H, PLACES } from './map.js';
import { IMPREVISTI as I, PARADISO, TRAFFICO } from './data/vita.js';
import { pick, fill } from './racconto.js';

const H = 60;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const randi = (a, b) => Math.floor(rand(a, b + 1));

// il randagio come nemico dello scontro a turni (senza toccare combat.js)
ENEMIES.randagio ??= {
  name: 'Cane randagio', hp: 24, atk: 7, def: 1, spd: 8, xp: 9, money: 0, size: 4,
  frames: () => [0, 1].map(f => PIX.mirror(SV.cane(f))),
  moves: [
    { name: 'Morso ai polpacci', pow: 1.1, stress: 2, w: 3 },
    { name: 'Abbaio molesto', pow: 0, stress: 5, w: 2, line: 'BAU BAU BAU BAU! Garonio sente le campane.' },
    { name: 'Pipì sulla scarpa', pow: 0.2, stress: 6, w: 1, line: 'Il randagio alza la zampa sulla scarpa di Garonio.' },
  ],
};

export class Imprevisti {
  constructor(game) {
    this.game = game;
    this.cantiere = null;
    this.cane = null;
    this._dec = [];          // decal a terra { mesh, ref }
    this._cant = [];         // oggetti del cantiere (sprite e solidi)
    this._ultimaBuca = null;
    this._pozzaT = 0;
    this._imp = null;
    game.moduli.push(this);
  }
  get s() { return this.game.s; }
  get W() { return this.game.world; }
  get f() { return this.s.flags.imprevisti; }
  get buche() { return this.f.buche; }
  get pozze() { return this.f.pozze; }

  init() {
    const f = (this.s.flags.imprevisti ??= {});
    f.buche ??= []; f.pozze ??= []; f.impGiorno ??= {}; f.ultimoImp ??= -1e9;
    if (!f.buche.length) for (let i = 0; i < 5; i++) this._nuovaBuca();
    if (!f.pozze.length && this._piove()) this._faiPozze();
    this._disegnaTutto();
    if (f.cantiere?.giorno === this.s.day) this._montaCantiere(f.cantiere);
    this.game.on('nuovoGiorno', () => this._nuovoGiorno());
    this.game.on('meteo', e => { if (e.tipo === 'pioggia') { this._faiPozze(); this._disegnaTutto(); } });
    this.game.on('ora', () => this._ognOra());
    this.game.bersagli.push(() => this._bersaglioCane());
    this._mkBau();
  }

  _piove() { return this.game.stagioni?.st?.meteo === 'pioggia'; }
  _giorno() { return this.game.stagioni?.st?.meteo; }
  _ora() { return (this.s.minutes / H) % 24; }
  _P() { return this.game.player.group.position; }

  // =====================================================================
  //  PUNTI A CASO SULLE STRADE
  // =====================================================================
  _puntoStrada(filtro = () => true, laterale = true) {
    const roads = ROADS.filter(filtro);
    const tot = roads.reduce((t, r) => t + this._len(r), 0);
    for (let tent = 0; tent < 40; tent++) {
      let k = Math.random() * tot, r = roads[0];
      for (const x of roads) { if ((k -= this._len(x)) < 0) { r = x; break; } }
      const i = randi(0, r.points.length - 2), [ax, az] = r.points[i], [bx, bz] = r.points[i + 1];
      const t = Math.random(), L = Math.hypot(bx - ax, bz - az) || 1;
      const nx = -(bz - az) / L, nz = (bx - ax) / L;
      const off = laterale ? rand(-1, 1) * (r.width / 2 - 0.5) : 0;
      const x = ax + (bx - ax) * t + nx * off, z = az + (bz - az) * t + nz * off;
      if (x < 4 || x > MAP_W - 4 || z < 8 || z > MAP_H - 4) continue;
      const surf = surfaceAt(x, z);
      if (surf !== 'asfalto' && surf !== 'sterrato' && surf !== 'piazza') continue;
      // lontano da parcheggi, porte e incroci (le buche sugli incroci sarebbero trappole)
      if (Object.values(PLACES.parking).some(p => Math.hypot(p.x - x, p.z - z) < 4)) continue;
      if (this.W.blocked(x, z, 0.4)) continue;
      return { x, z, strada: r.id, ax, az, bx, bz };
    }
    return null;
  }
  _len(r) { let l = 0; for (let i = 0; i < r.points.length - 1; i++) l += Math.hypot(r.points[i + 1][0] - r.points[i][0], r.points[i + 1][1] - r.points[i][1]); return l; }

  // =====================================================================
  //  BUCHE E POZZANGHERE
  // =====================================================================
  _nuovaBuca() {
    const p = this._puntoStrada();
    if (p && !this.buche.some(b => Math.hypot(b.x - p.x, b.z - p.z) < 3)) this.buche.push({ x: +p.x.toFixed(2), z: +p.z.toFixed(2), id: randi(1, 999) });
  }

  _faiPozze() {
    const f = this.f; f.pozze = []; f.pozzeGiorno = this.s.day;
    const n = randi(...I.pozze.numero);
    for (let i = 0; i < n; i++) {
      const p = this._puntoStrada(r => r.type === 'sterrato' || Math.random() < 0.4);
      if (p && !f.pozze.some(q => Math.hypot(q.x - p.x, q.z - p.z) < 3)) f.pozze.push({ x: +p.x.toFixed(2), z: +p.z.toFixed(2), id: randi(1, 999) });
    }
  }

  _disegnaTutto() {
    for (const d of this._dec) { this.W.scene.remove(d.mesh); d.mesh.material.dispose(); }
    this._dec = [];
    this._texB ??= [1, 2, 3].map(k => PIX.toTexture(SV.buca(k)));
    this._texP ??= [1, 2, 3].map(k => PIX.toTexture(SV.pozza(k)));
    const add = (ref, tex, w, h) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h).rotateX(-Math.PI / 2),
        new THREE.MeshLambertMaterial({ map: tex, transparent: true, depthWrite: false }));
      m.position.set(ref.x, 0.028, ref.z); m.renderOrder = 1;
      this.W.scene.add(m); this._dec.push({ mesh: m, ref });
    };
    for (const b of this.buche) add(b, this._texB[b.id % 3], 1.25, 0.9);
    for (const p of this.pozze) add(p, this._texP[p.id % 3], 1.75, 1);
  }

  _nuovoGiorno() {
    const f = this.f, B = I.buche;
    // il cantiere di ieri se ne va e (per sbaglio) tappa la buca più vicina
    if (this.cantiere) {
      const c = this.cantiere;
      const near = this.buche.filter(b => Math.hypot(b.x - c.x, b.z - c.z) < 12);
      if (near.length) this.buche.splice(this.buche.indexOf(near[0]), 1);
      this._smontaCantiere();
    }
    f.cantiere = null;
    for (let i = 0, n = randi(...B.nuovePerGiorno); i < n && this.buche.length < B.max; i++) this._nuovaBuca();
    // pozzanghere: con la pioggia nuove, il giorno dopo ne resta metà, poi spariscono
    if (this._piove()) this._faiPozze();
    else if (f.pozzeGiorno === this.s.day - 1) f.pozze = f.pozze.filter(() => Math.random() < 0.5);
    else f.pozze = [];
    if (this.s.day >= I.cantiere.daGiorno && Math.random() < I.cantiere.probabilita) this._nuovoCantiere();
    f.impGiorno = {};
    f.zanzare = 0;
    this._disegnaTutto();
  }

  _danno(v) {
    const g = this.game, s = this.s, B = I.buche, k = v.kind;
    let danno = B.danno[k] ?? 5;
    danno = Math.round(danno * rand(0.8, 1.3) * Math.min(1.5, Math.abs(v.speed) / 4 + 0.5));
    v.st.cond = clamp(v.st.cond - danno, 0, 100);
    v.speed *= 0.45;
    s.stress = clamp(s.stress + (B.stress[k] ?? 3), 0, 100);
    let msg = fill(pick(B.testi[k] || B.testi.punto), { danno });
    if (k === 'punto' && !v.st.flat && Math.random() < B.foraturaPunto) { v.st.flat = true; msg += B.testi.foratura; }
    g.ui.shake(); g.audio.sfx('crash');
    g.ui.toast(`${msg}  Stress +${B.stress[k] ?? 3}`, 'bad');
    g.emit('buca', { mezzo: v.id, danno, x: v.st.x, z: v.st.z });
    if (v.st.cond <= 0) {
      if (k === 'trattore') g.vehicles._breakTractor(v, 'La buca ha finito il lavoro: il trattore è rotto!');
      else { g.ui.toast(`${v.T.name}: ko. Serve Zeno (e il portafoglio).`, 'bad'); g.vehicles.dismount(true); }
    }
  }

  _controllaStrada(dt) {
    const g = this.game, s = this.s, v = g.vehicles.driving, P = this._P();
    const x = v ? v.st.x : P.x, z = v ? v.st.z : P.z;
    // buche
    const b = this.buche.find(b => Math.abs(b.x - x) < (v ? 0.75 : 0.45) && Math.abs(b.z - z) < (v ? 0.55 : 0.35));
    if (b && b !== this._ultimaBuca) {
      this._ultimaBuca = b;
      if (v && Math.abs(v.speed) > 2) this._danno(v);
      else if (!v && g.input.run && g.moving) {
        s.stress = clamp(s.stress + 1, 0, 100);
        g.ui.toast(`${pick(I.buche.testi.piedi)}  Stress +1`, 'bad');
      }
    } else if (!b) this._ultimaBuca = null;
    // pozzanghere
    this._pozzaT -= dt * 1.5;   // minuti di gioco circa
    const p = this.pozze.find(p => Math.abs(p.x - x) < 0.85 && Math.abs(p.z - z) < 0.5);
    if (p && this._pozzaT <= 0) {
      if (!v && g.moving) {
        this._pozzaT = 60;
        s.stress = clamp(s.stress + I.pozze.stress, 0, 100);
        g.ui.toast(`${pick(I.pozze.testi)}  Stress +${I.pozze.stress}`, 'bad'); g.audio.sfx('water');
      } else if (v && v.kind === 'vespa' && Math.abs(v.speed) > 2.5) {
        this._pozzaT = 30;
        v.st.h += rand(-0.6, 0.6); v.speed *= 0.8;
        s.stress = clamp(s.stress + 1, 0, 100);
        g.ui.toast(pick(I.pozze.vespa), 'bad'); g.audio.sfx('water');
      }
    }
    // doccia dalle auto che passano
    if (!v && this._pozzaT <= 0 && g.vita) {
      const q = this.pozze.find(q => Math.hypot(q.x - P.x, q.z - P.z) < 2.2);
      if (q && g.vita.schizza(q.x, q.z, 1.8)) {
        this._pozzaT = 60;
        s.stress = clamp(s.stress + 4, 0, 100);
        g.ui.toast(`${pick(TRAFFICO.schizzo)}  Stress +4`, 'bad'); g.audio.sfx('water');
      }
    }
  }

  // =====================================================================
  //  CANTIERE
  // =====================================================================
  _nuovoCantiere() {
    const nodi = ROAD_GRAPH.nodes;
    for (let t = 0; t < 30; t++) {
      const p = this._puntoStrada(r => I.cantiere.strade.includes(r.id), false);
      if (!p) continue;
      if (nodi.some(n => Math.hypot(n.x - p.x, n.z - p.z) < 7)) continue;
      const orizz = Math.abs(p.bz - p.az) < Math.abs(p.bx - p.ax);
      const c = { strada: p.strada, x: +p.x.toFixed(2), z: +p.z.toFixed(2), orizz, lato: Math.random() < 0.5 ? -1 : 1, giorno: this.s.day };
      this.f.cantiere = c;
      this._montaCantiere(c);
      return c;
    }
    return null;
  }

  _montaCantiere(c) {
    this._smontaCantiere();
    this.cantiere = c;
    const W = this.W;
    this._texC ??= { tr: PIX.toTexture(SV.transenna()), co: PIX.toTexture(SV.cono()), ca: PIX.toTexture(SV.cartelloLavori()), cr: PIX.toTexture(SV.carriola()) };
    const T = this._texC;
    const put = (tex, w, h, x, z) => { const s = W.sprite(tex, { w, h }); s.position.set(x, 0, z); W.scene.add(s); this._cant.push({ spr: s }); return s; };
    const solid = b => { W.solids.push(b); this._cant.push({ solid: b }); };
    const L = c.lato * 0.5;  // la metà di carreggiata occupata
    if (c.orizz) {
      put(T.tr, 2.5, 0.9, c.x, c.z + L);
      put(T.co, 0.45, 0.7, c.x - 1.6, c.z + L); put(T.co, 0.45, 0.7, c.x + 1.6, c.z + L);
      put(T.ca, 1, 1.5, c.x - 3.4, c.z + c.lato * 1.3);
      put(T.cr, 1.1, 0.6, c.x + 0.6, c.z + c.lato * 1.7);
      solid({ x0: c.x - 1.8, z0: c.z + Math.min(0, c.lato) * 1.0, x1: c.x + 1.8, z1: c.z + Math.max(0, c.lato) * 1.0 });
    } else {
      put(T.tr, 1.4, 0.9, c.x + L, c.z);
      put(T.co, 0.45, 0.7, c.x + L, c.z - 1.6); put(T.co, 0.45, 0.7, c.x + L, c.z + 1.6);
      put(T.ca, 1, 1.5, c.x + c.lato * 1.4, c.z - 3.2);
      put(T.cr, 1.1, 0.6, c.x + c.lato * 1.8, c.z + 0.8);
      solid({ x0: c.x + Math.min(0, c.lato) * 1.0, z0: c.z - 1.8, x1: c.x + Math.max(0, c.lato) * 1.0, z1: c.z + 1.8 });
    }
    // gli operai, uno appoggiato alla pala e uno che dorme quasi
    I.cantiere.operai.forEach((o, i) => {
      const id = 'operaio' + i;
      PIX.CHARACTERS[id] ??= o.aspetto;
      const fr = PIX.characterFrames(id);
      const a = W.actor(fr, { w: o.aspetto.w / 16 * 1.25, h: o.aspetto.h / 16 * 1.25, shadow: 0.35 });
      const ox = c.orizz ? (i ? 1.4 : -1) : c.lato * 2.2, oz = c.orizz ? c.lato * 2.1 : (i ? 1.2 : -1.1);
      a.group.position.set(c.x + ox, 0, c.z + oz); a.setFrame(i ? 3 : 0);
      this._cant.push({ actor: a });
    });
    this.W._idxN = -1;   // ricostruisce l'indice delle collisioni
    this._cantVisto = false;
  }

  _smontaCantiere() {
    for (const o of this._cant) {
      if (o.spr) { this.W.scene.remove(o.spr); this.W.spriteMats.delete(o.spr.material); }
      if (o.actor) o.actor.remove();
      if (o.solid) { const i = this.W.solids.indexOf(o.solid); if (i >= 0) this.W.solids.splice(i, 1); }
    }
    this._cant = []; this.cantiere = null; this.W._idxN = -1;
  }

  _controllaCantiere() {
    const c = this.cantiere; if (!c || this._cantVisto) return;
    const P = this._P();
    if (Math.hypot(P.x - c.x, P.z - c.z) > I.cantiere.raggio) return;
    this._cantVisto = true;
    const g = this.game, s = this.s;
    const umarell = g.vita?.paesani.find(p => p.visibile && p.def.umarell && Math.hypot(p.x - c.x, p.z - c.z) < 5);
    const frase = umarell && Math.random() < 0.5 ? `${umarell.def.nome}: ${pick(I.cantiere.umarell)}` : pick(I.cantiere.frasi);
    s.stress = clamp(s.stress + I.cantiere.stress, 0, 100);
    g.ui.toast(`🚧 ${frase}  Stress +${I.cantiere.stress}`, 'bad');
  }

  ostacoliStrada() { return []; }

  // =====================================================================
  //  CANE RANDAGIO
  // =====================================================================
  _mkBau() {
    this._bauTex = PIX.toTexture(SV.fumetto('BAU!'));
  }

  _ognOra() {
    const s = this.s, C = I.cane, h = this._ora();
    if (this.cane || s.day < C.daGiorno || h < 7 || h > 20 || this.game.interni?.attivo) return;
    if (Math.random() < C.probabilitaOra) this._nuovoCane();
  }

  _nuovoCane() {
    if (this.cane) return this.cane;
    const P = this._P();
    for (let t = 0; t < 20; t++) {
      const a = Math.random() * Math.PI * 2, x = P.x + Math.cos(a) * 13, z = P.z + Math.sin(a) * 9;
      if (x < 3 || z < 8 || x > MAP_W - 3 || z > MAP_H - 4 || this.W.blocked(x, z, 0.3)) continue;
      const fr = [0, 1].map(f => SV.cane(f, I.cane.aspetto.pelo, I.cane.aspetto.scuro));
      const actor = this.W.actor([fr[0], fr[1], PIX.mirror(fr[0]), PIX.mirror(fr[1])], { w: 1.2, h: 0.82, shadow: 0.3 });
      const bau = this.W.sprite(this._bauTex, { w: 1.2, h: 0.8 }); bau.position.set(0.3, 0.95, 0); bau.visible = false; actor.group.add(bau);
      this.cane = { actor, bau, x, z, stato: 'insegue', t: 0, dir: 1, walkT: 0, morso: false, avvisato: false };
      this.game.ui.toast(`🐕 ${pick(I.cane.arrivo)}`, 'bad'); this.game.audio.sfx('bad');
      return this.cane;
    }
    return null;
  }

  _viaCane(esito) {
    if (!this.cane) return;
    this.cane.actor.remove(); this.cane = null;
    if (esito) this.game.emit('randagio', { esito });
  }

  _aggiornaCane(dt) {
    const c = this.cane; if (!c) return;
    const g = this.game, s = this.s, P = this._P(), v = g.vehicles.driving;
    c.t += dt; c.walkT += dt * 10;
    const d = Math.hypot(P.x - c.x, P.z - c.z);
    c.bau.visible = Math.sin(c.t * 5) > 0.3 && c.stato !== 'via';
    if (c.t > 55 || d > 26) { this._viaCane(); return; }
    let tx = P.x, tz = P.z, sp = I.cane.vel;
    if (c.stato === 'via') { tx = c.x + c.fx * 10; tz = c.z + c.fz * 10; sp = 5; if (c.t - c.tVia > 4) { this._viaCane(); return; } }
    else if (c.stato === 'gira') {
      const k = c.t * 1.3; tx = P.x + Math.cos(k) * 2.4; tz = P.z + Math.sin(k) * 1.6; sp = 3;
      if (c.t - c.tGira > 7) c.stato = 'insegue';
    } else if (v) {
      if (!c.avvisato) { c.avvisato = true; s.stress = clamp(s.stress + 2, 0, 100); g.ui.toast(`${pick(I.cane.inMacchina)}  Stress +2`, 'bad'); }
      if (d > 10) { this._fugge(); }
    } else if (d < 0.9 && !c.morso) {
      c.morso = true;
      const M = I.cane.morso;
      s.health = clamp(s.health - M.vita, 0, s.maxHealth); s.stress = clamp(s.stress + M.stress, 0, 100);
      g.ui.shake(); g.audio.sfx('bad');
      g.ui.toast(fill(pick(I.cane.morsoTesti), M), "bad");
      c.stato = 'gira'; c.tGira = c.t;
    } else if (d < 0.9 && c.morso) { c.stato = 'gira'; c.tGira = c.t; }
    const prima = c.x;
    if (g.vita) g.vita._passo(c, tx, tz, sp, dt);
    if (Math.abs(c.x - prima) > 0.001) c.dir = c.x > prima ? 1 : -1;
    c.actor.group.position.set(c.x, 0, c.z);
    c.actor.setFrame((c.dir > 0 ? 0 : 2) + (Math.floor(c.walkT) % 2));
  }

  _fugge(esito) {
    const c = this.cane; if (!c) return;
    const P = this._P(), d = Math.hypot(c.x - P.x, c.z - P.z) || 1;
    c.stato = 'via'; c.tVia = c.t; c.fx = (c.x - P.x) / d; c.fz = (c.z - P.z) / d;
    if (esito) this.game.emit('randagio', { esito });
  }

  _bersaglioCane() {
    const c = this.cane; if (!c || c.stato === 'via' || this.game.vehicles.driving) return null;
    const P = this._P();
    if (Math.hypot(P.x - c.x, P.z - c.z) > 2.2) return null;
    return { label: 'Il cane randagio!', fn: () => this._dialogoCane() };
  }

  async _dialogoCane() {
    const g = this.game, s = this.s, C = I.cane;
    const pag = (text, choices) => ({ name: 'Cane randagio', text, choices });
    await g.ui.dialog([pag('Il randagio ringhia e ti fissa le caviglie.', [
      { label: 'SCIÒ! (stanchezza +3)', fn: () => {
        s.tired = clamp(s.tired + 3, 0, 100); g.audio.sfx('shoo');
        if (Math.random() < 0.7) { this._fugge('scacciato'); return [pag(pick(C.scio))]; }
        s.stress = clamp(s.stress + 2, 0, 100);
        return [pag(pick(C.scioMale) + ' Stress +2')];
      } },
      { label: `Lancia un uovo (${s.inv.uova} 🥚)`, disabled: !s.inv.uova, fn: () => {
        s.inv.uova--; s.stress = clamp(s.stress - 3, 0, 100); g._xp(3); g.audio.sfx('pick');
        this._fugge('amico'); return [pag(pick(C.uovo) + ' Stress −3, +3 XP')];
      } },
      { label: 'Affrontalo (scontro a turni)', fn: () => { this._lotta = true; return null; } },
      { label: 'Lascia perdere', fn: null },
    ])]);
    if (this._lotta) {
      this._lotta = false;
      const res = await g.combat.start({ enemies: ['randagio'], place: 'campo' });
      if (res === 'win') this._viaCane('battuto');
      else if (res === 'lose') { this._viaCane(); await g.mountain('sconfitta', 15); }
    }
  }

  // =====================================================================
  //  PAESANI IMPICCIONI
  // =====================================================================
  _controllaImpiccioni(dt) {
    const g = this.game, s = this.s, f = this.f, C = I.impiccioni, P = this._P();
    if (!g.vita) return;
    const imp = this._imp;
    if (imp) {
      const d = Math.hypot(imp.x - P.x, imp.z - P.z);
      imp._t = (imp._t || 0) + dt;
      if (g.vehicles.driving || d > 7) {   // Garonio è scappato
        this._imp = null; imp.chiamato = null;
        s.stress = clamp(s.stress + 1, 0, 100);
        g.ui.toast(`${imp.def.nome}: «Maleducato! Lo dico a tua madre!»`, 'bad');
        return;
      }
      if (d < 1.4 || imp._t > 6) { this._imp = null; imp.chiamato = null; this._attaccaBottone(imp); }
      else g.vita.chiama(imp, P.x + (imp.x > P.x ? 0.9 : -0.9), P.z + 0.1);
      return;
    }
    if (g.vehicles.driving || s.minutes - f.ultimoImp < C.pausa) return;
    for (const p of g.vita.paesani) {
      if (!p.visibile || !p.def.impiccione) continue;
      const d = Math.hypot(p.x - P.x, p.z - P.z);
      if (d > 6) { p._provato = false; continue; }
      if (d > C.raggio || p._provato || f.impGiorno[p.id]) continue;
      p._provato = true;
      if (Math.random() < p.def.impiccione * 0.6) { this._imp = p; p._t = 0; f.ultimoImp = s.minutes; f.impGiorno[p.id] = true; break; }
    }
  }

  async _attaccaBottone(p) {
    const g = this.game, s = this.s, C = I.impiccioni;
    if (g.ui.busy() || g.locked) return;
    const tranv = this.s.flags.paradiso?.tranvione;
    const testo = tranv != null && s.day - tranv <= 2 ? pick(PARADISO.pettegolezzo) : pick(C.attacchi);
    const pag = (text, choices) => ({ who: p.id, name: p.def.nome, text, choices });
    const fine = scelta => g.emit('impiccione', { png: p.id, scelta });
    const parl = g.prog.grado?.('parlantina') || 0;
    await g.ui.dialog([pag(testo, [
      { label: C.ascolta.etichetta, fn: () => {
        s.minutes += C.ascolta.minuti; s.stress = clamp(s.stress + C.ascolta.stress, 0, 100); g._xp(C.ascolta.xp); fine('ascolta');
        return [pag(`${pick(C.ascolta.testi)} (Stress +${C.ascolta.stress})`)];
      } },
      { label: C.taglia.etichetta, fn: () => {
        s.stress = clamp(s.stress + C.taglia.stress, 0, 100); fine('taglia');
        return [pag(pick(C.taglia.testi))];
      } },
      { label: C.telefono.etichetta, fn: () => {
        fine('telefono');
        if (Math.random() < C.telefono.riuscita + parl * C.telefono.bonusParlantina) return [pag(pick(C.telefono.ok))];
        s.stress = clamp(s.stress + C.telefono.stress, 0, 100); s.minutes += 20;
        return [pag(`${pick(C.telefono.ko)} (Stress +${C.telefono.stress})`)];
      } },
    ])]);
  }

  // =====================================================================
  //  ZANZARE
  // =====================================================================
  _zanzare(dt) {
    const h = this._ora(), Z = I.zanzare, s = this.s, f = this.f;
    if (h < Z.ore[0] || h >= Z.ore[1] || this._giorno() === 'neve') return;
    const P = this._P();
    const vicino = Math.hypot(P.x - 35, P.z - 83.5) < 11 || P.z < 10;
    if (!vicino) return;
    f.zanzare = (f.zanzare || 0) + dt * 1.5;
    if (!this._zToast) { this._zToast = true; this.game.ui.toast(`🦟 ${Z.testo}`, 'bad'); }
    if (f.zanzare >= 15) { f.zanzare -= 15; s.stress = clamp(s.stress + Z.stressOgni15min, 0, 100); }
  }

  // =====================================================================
  update(dt) {
    if (this.game.interni?.attivo) return;   // dentro un edificio: niente imprevisti
    this._controllaStrada(dt);
    this._controllaCantiere();
    this._aggiornaCane(dt);
    this._controllaImpiccioni(dt);
    this._zanzare(dt);
    if (this._ora() < 18) this._zToast = false;
  }

  // per provare dalla console: garonio.imprevisti.prova('cane')
  prova(tipo) {
    const P = this._P();
    if (tipo === 'buca') { this.buche.push({ x: P.x + 3, z: P.z, id: 1 }); this._disegnaTutto(); }
    else if (tipo === 'pozze') { this._faiPozze(); this.pozze.push({ x: P.x + 2, z: P.z, id: 2 }); this._disegnaTutto(); }
    else if (tipo === 'cantiere') return this._nuovoCantiere();
    else if (tipo === 'cane') return this._nuovoCane();
    else if (tipo === 'impiccione') { this.f.ultimoImp = -1e9; this.f.impGiorno = {}; for (const p of this.game.vita.paesani) p._provato = false; }
    return true;
  }
}
