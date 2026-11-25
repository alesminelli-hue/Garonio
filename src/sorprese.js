// Easter egg e cose che capitano sulla mappa (dati e testi: SORPRESE in src/data/sorprese.js).
//  - la fontana dei desideri in piazza (1€, a volte jackpot);
//  - cinque nani da giardino nascosti: trovali tutti per un premio;
//  - il maiale scappato dal capannone che va a spasso sulla provinciale;
//  - il turista tedesco perso in piazza; il portafoglio perso per strada;
//  - Mister Mountain in ferie che pesca al laghetto la domenica mattina;
//  - la Sagra del Cotechino in piazza ogni 7 giorni, con la banda, il liscio e le salamelle;
//  - luci strane sopra il grano di notte, e il giorno dopo un cerchio nel grano.
// Inoltre: segnalino del Night Welcome sulla minimappa.
//
// API (game.sorprese):
//   maiale               il maiale scappato { x, z } | null (il traffico gli si ferma davanti)
//   sagra()              true se stasera c'è la sagra ed è l'ora
//   prova(tipo)          (console) 'maiale' | 'turista' | 'portafoglio' | 'mountain' | 'sagra' | 'ufo' | 'gnomi'
// Eventi mandati: sorpresa { tipo, esito }
// Stato: s.flags.sorprese = { giorno, gnomi: [i...], maiale, turista, portafoglio, mountain, sagraBallo, ufo, cerchio }
import * as THREE from 'three';
import * as PIX from './pixel.js';
import * as SV from './sprite_vita.js';
import { SORPRESE as S } from './data/sorprese.js';
import { PARADISO } from './data/vita.js';
import { pick, fill } from './racconto.js';

const H = 60;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);

export class Sorprese {
  constructor(game) {
    this.game = game;
    this.maiale = null;
    this.t = 0;
    game.moduli.push(this);
  }
  get s() { return this.game.s; }
  get W() { return this.game.world; }
  get f() { return this.s.flags.sorprese; }
  _ora() { return (this.s.minutes / H); }
  _P() { return this.game.player.group.position; }
  _vicino(x, z, r) { const P = this._P(); return Math.hypot(P.x - x, P.z - z) < r; }

  init() {
    const g = this.game, W = this.W;
    const f = (this.s.flags.sorprese ??= {});
    f.gnomi ??= [];
    // fontana dei desideri
    const F = S.fontana;
    const fo = W.sprite(PIX.toTexture(SV.fontana()), { w: 1.6, h: 1.375 }); fo.position.set(F.x, 0, F.z); W.scene.add(fo);
    W.solids.push({ x0: F.x - 0.75, z0: F.z - 0.3, x1: F.x + 0.75, z1: F.z + 0.2 });
    // nani da giardino
    const tg = PIX.toTexture(SV.gnomo());
    this.gnomi = S.gnomi.posti.map(([x, z], i) => {
      const q = this._libero(x, z);
      const spr = W.sprite(tg, { w: 0.62, h: 1 }); spr.position.set(q.x, 0, q.z); W.scene.add(spr);
      spr.visible = !f.gnomi.includes(i);
      return { i, x: q.x, z: q.z, spr };
    });
    // attori che compaiono a seconda del giorno
    PIX.CHARACTERS.turista ??= S.turista.aspetto;
    this.turista = W.actor(PIX.characterFrames('turista'), { w: S.turista.aspetto.w / 16 * 1.25, h: S.turista.aspetto.h / 16 * 1.25, shadow: 0.35 }); this.turista.group.visible = false;
    this.mountain = W.actor(PIX.characterFrames('mountain'), { w: PIX.CHARACTERS.mountain.w / 16 * 1.25, h: PIX.CHARACTERS.mountain.h / 16 * 1.25, shadow: 0.7 }); this.mountain.group.visible = false;
    this.mountain.group.position.set(S.mountainPesca.x, 0, S.mountainPesca.z); this.mountain.setFrame(3);
    this.banda = S.sagra.banda.map((b, i) => {
      const id = 'banda' + i;
      PIX.CHARACTERS[id] ??= { sprite: b.sprite, w: 16, h: 24, skin: '#e8b48a', hair: '#3a2a1a', hairStyle: 'flat', hat: '#2a2a3a', shirt: b.shirt, pants: '#2a2a3a', boots: '#1a1a1a', eyes: 'normal' };
      const a = W.actor(PIX.characterFrames(id), { w: PIX.CHARACTERS[id].w / 16 * 1.25, h: PIX.CHARACTERS[id].h / 16 * 1.25, shadow: 0.35 });
      a.group.position.set(S.sagra.palco[0] - 1.6 + i * 1.6, 0, S.sagra.palco[1] - 0.4); a.group.visible = false;
      return a;
    });
    // lucine colorate della sagra
    const colori = ['255,80,80', '80,200,255', '255,220,80', '120,255,120'];
    const tl = colori.map(c => PIX.toTexture(SV.alone(c, 16)));
    this.lucine = [];
    for (let i = 0; i < 24; i++) {
      const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tl[i % 4], transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      const x = 4 + i * 1.35;
      spr.position.set(x, 3.1 - Math.sin((i % 12) / 11 * Math.PI) * 0.6, 50.2); spr.scale.set(0.45, 0.45, 1); spr.visible = false;
      W.scene.add(spr); this.lucine.push(spr);
    }
    // portafoglio
    this.borsello = W.sprite(PIX.toTexture(SV.disegna(8, 5, P => { P('#5a3a22', 0, 0, 8, 5); P('#7a5434', 1, 1, 6, 1); P('#3a8a4a', 5, 2, 2, 1); })), { w: 0.5, h: 0.32 });
    this.borsello.visible = false; W.scene.add(this.borsello);
    // ufo e cerchio nel grano
    this.ufo = new THREE.Sprite(new THREE.SpriteMaterial({ map: PIX.toTexture(SV.alone('180,255,220', 32)), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.ufo.scale.set(2.4, 1.2, 1); this.ufo.visible = false; W.scene.add(this.ufo);
    this.cerchio = new THREE.Mesh(new THREE.PlaneGeometry(6, 6).rotateX(-Math.PI / 2),
      new THREE.MeshLambertMaterial({ map: PIX.toTexture(SV.cerchioGrano()), transparent: true, depthWrite: false }));
    this.cerchio.position.set(S.ufo.x, 0.03, S.ufo.z); this.cerchio.visible = false; W.scene.add(this.cerchio);

    g.bersagli.push(() => this._bersaglio());
    g.on('nuovoGiorno', () => this._nuovoGiorno());
    g.on('ora', e => this._ognOra(e.ora));
    if (f.giorno !== this.s.day) this._nuovoGiorno();
    if (this.f.portafoglio?.x != null) this.borsello.position.set(f.portafoglio.x, 0, f.portafoglio.z);
  }

  _libero(x, z) {
    for (let r = 0; r < 5; r += 0.5) for (const [ox, oz] of [[0, 0], [r, 0], [-r, 0], [0, r], [0, -r]]) if (!this.W.blocked(x + ox, z + oz, 0.3)) return { x: x + ox, z: z + oz };
    return { x, z };
  }

  // ---------- Il giorno nuovo: cosa capiterà oggi ----------
  _nuovoGiorno() {
    const s = this.s, f = this.f, d = s.day;
    f.giorno = d;
    f.maiale = d >= S.maiale.daGiorno && Math.random() < S.maiale.probabilita ? { ora: Math.floor(rand(...S.maiale.ore)), stato: 'attesa' } : null;
    f.turista = Math.random() < S.turista.probabilita ? 'oggi' : null;
    f.mountain = null; f.sagraBallo = false; f.ufo = false;
    f.portafoglio = null;
    if (Math.random() < S.portafoglio.probabilita) {
      const p = this.game.imprevisti?._puntoStrada();
      if (p) { f.portafoglio = { x: +p.x.toFixed(2), z: +p.z.toFixed(2) }; this.borsello.position.set(p.x, 0, p.z); }
    }
    this._togliMaiale();
  }

  sagra(h = this._ora()) { const G = S.sagra; return this.s.day % G.ogni === G.giornoSfasato && h >= G.ore[0] && h < G.ore[1]; }
  _domenica() { return this.s.day % S.mountainPesca.ogni === 0; }

  _ognOra(h) {
    const f = this.f, g = this.game;
    if (f.maiale?.stato === 'attesa' && h >= f.maiale.ora && h < S.maiale.scadenza) this._nuovoMaiale();
    if (f.maiale?.stato === 'libero' && h >= S.maiale.scadenza) {
      f.maiale.stato = 'perso'; this._togliMaiale();
      this.s.stress = clamp(this.s.stress + 6, 0, 100); g.ui.toast(S.maiale.perso, 'bad');
      g.emit('sorpresa', { tipo: 'maiale', esito: 'perso' });
    }
    if (h === S.sagra.ore[0] - 1 && this.s.day % S.sagra.ogni === S.sagra.giornoSfasato) g.ui.toast(S.sagra.annuncio, 'good');
    if (h >= S.ufo.ore[0] && h < S.ufo.ore[1] && !f.ufo && Math.random() < S.ufo.probabilitaOra) this._avvistamento();
  }

  // ---------- Ogni fotogramma (grafica) ----------
  animate(dt) {
    this.t += dt;
    const g = this.game, f = this.f, h = this._ora(), s = this.s;
    // segnalino del Welcome sulla minimappa (la minimappa nasce dopo il gioco)
    if (!this._mm) { const mm = window.__garonio?.minimap; if (mm) { mm.setMarker('paradiso', PARADISO.porta[0], PARADISO.porta[1] - 2, '#ff5fd0', '♥'); this._mm = true; } }
    const T = S.turista;
    this.turista.group.visible = f.turista === 'oggi' && h >= T.ore[0] && h < T.ore[1];
    if (this.turista.group.visible) { this.turista.group.position.set(T.x, 0, T.z); this.turista.setFrame(Math.sin(this.t * 0.7) > 0 ? 0 : 3); }
    const M = S.mountainPesca;
    this.mountain.group.visible = this._domenica() && h >= M.ore[0] && h < M.ore[1];
    const sag = this.sagra(h);
    this.banda.forEach((a, i) => { a.group.visible = sag; if (sag) a.setFrame((Math.floor(this.t * 3 + i) % 2) ? 1 : 0); });
    this.lucine.forEach((l, i) => { l.visible = sag; if (sag) l.material.opacity = 0.6 + 0.4 * Math.sin(this.t * 3 + i); });
    this.borsello.visible = !!f.portafoglio && !f.portafoglio.preso;
    const c = f.cerchio;
    this.cerchio.visible = !!c && s.day >= c.da && s.day < c.a;
    if (this._ufoT > 0) {
      this._ufoT -= dt;
      const k = S.ufo.durata - this._ufoT;
      this.ufo.visible = true;
      this.ufo.position.set(S.ufo.x - 8 + k * 1.6 + Math.sin(k * 3) * 2, 6 + Math.sin(k * 2) * 1.5, S.ufo.z + Math.cos(k * 2.3) * 2);
      this.ufo.material.opacity = 0.6 + 0.4 * Math.sin(k * 12);
    } else this.ufo.visible = false;
    if (this.maiale) {
      const m = this.maiale;
      m.walkT += dt * 8;
      m.a.group.position.set(m.x, 0, m.z);
      m.a.setFrame((m.dir > 0 ? 0 : 2) + (Math.floor(m.walkT) % 2));
    }
  }

  // ---------- Ogni fotogramma di gioco ----------
  update(dt) {
    if (this.game.interni?.attivo) return;
    const m = this.maiale, g = this.game;
    if (m) {
      if (!m.meta || Math.hypot(m.meta[0] - m.x, m.meta[1] - m.z) < 0.3) m.meta = [rand(96, 140), rand(52.6, 55.6)];
      const prima = m.x;
      if (this._vicino(m.x, m.z, 2.5) && g.input.run) { const P = this._P(); m.meta = [m.x + (m.x - P.x) * 2, clamp(m.z + (m.z - P.z), 52.4, 56)]; }
      g.vita?._passo(m, m.meta[0], m.meta[1], this._vicino(m.x, m.z, 2.5) ? 3.4 : 1.2, dt);
      if (Math.abs(m.x - prima) > 0.001) m.dir = m.x > prima ? 1 : -1;
    }
    // cerchio nel grano
    const c = this.f.cerchio;
    if (c && !c.visto && this.s.day >= c.da && this.s.day < c.a && this._vicino(S.ufo.x, S.ufo.z, 1.5) && !g.vehicles.driving) {
      c.visto = true; g._xp(S.ufo.xp); g.audio.sfx('level');
      g.ui.toast(fill(S.ufo.cerchio, { xp: S.ufo.xp }), 'good');
      g.emit('sorpresa', { tipo: 'ufo', esito: 'cerchio' });
    }
  }

  // ---------- Il maiale scappato ----------
  _nuovoMaiale() {
    if (this.maiale) return;
    const fr = [0, 1].map(k => SV.maialino(k));
    const a = this.W.actor([fr[0], fr[1], PIX.mirror(fr[0]), PIX.mirror(fr[1])], { w: 1.1, h: 0.75, shadow: 0.3 });
    this.maiale = { a, x: 125, z: 57, dir: -1, walkT: 0, meta: null };
    this.f.maiale = { ...(this.f.maiale || {}), stato: 'libero' };
    this.game.ui.toast(S.maiale.arrivo, 'bad'); this.game.audio.sfx('bad');
  }
  _togliMaiale() { if (this.maiale) { this.maiale.a.remove(); this.maiale = null; } }

  _acchiappa() {
    const g = this.game, s = this.s;
    g.actT = 0.3; g.actName = 'attack'; s.tired = clamp(s.tired + 3, 0, 100);
    if (Math.random() < S.maiale.riuscita) {
      this._togliMaiale(); this.f.maiale.stato = 'preso';
      g._xp(S.maiale.xp); g.audio.sfx('level');
      g.ui.toast(fill(pick(S.maiale.preso), { xp: S.maiale.xp }), 'good');
      g.emit('sorpresa', { tipo: 'maiale', esito: 'preso' });
    } else {
      s.stress = clamp(s.stress + 2, 0, 100); g.audio.sfx('bad');
      const m = this.maiale; m.x += m.dir * -2.5; m.meta = null;
      g.ui.toast(pick(S.maiale.scappa), 'bad');
    }
  }

  // ---------- Luci nel cielo ----------
  _avvistamento() {
    this.f.ufo = true;
    this.f.cerchio = { da: this.s.day + 1, a: this.s.day + 1 + S.ufo.giorniCerchio, visto: false };
    this._ufoT = S.ufo.durata;
    this.game.ui.toast(S.ufo.avvistamento, 'good');
  }

  // ---------- Tasto E ----------
  _bersaglio() {
    const g = this.game; if (g.vehicles.driving) return null;
    const f = this.f, s = this.s, P = this._P();
    const d = (x, z) => Math.hypot(P.x - x, P.z - z);
    if (this.maiale && d(this.maiale.x, this.maiale.z) < 1.4) return { label: 'Acchiappa il maiale!', fn: () => this._acchiappa() };
    for (const n of this.gnomi) if (n.spr.visible && d(n.x, n.z) < 1.1) return { label: 'Un nano da giardino?', fn: () => this._gnomo(n) };
    const F = S.fontana;
    if (d(F.x, F.z + 0.6) < 1.3) return { label: `Lancia 1€ nella fontana dei desideri`, fn: () => this._fontana() };
    if (f.portafoglio && !f.portafoglio.preso && d(f.portafoglio.x, f.portafoglio.z) < 1) return { label: 'Raccogli il portafoglio', fn: () => this._portafoglio() };
    if (this.turista.group.visible && d(S.turista.x, S.turista.z) < 1.5) return { label: 'Parla col turista', fn: () => this._turista() };
    if (this.mountain.group.visible && !f.mountain && d(S.mountainPesca.x, S.mountainPesca.z) < 2) return { label: 'Mister Mountain... a pesca?', fn: () => this._mountain() };
    if (this.sagra() && d(S.sagra.palco[0], S.sagra.palco[1]) < 3) return { label: 'Sagra del Cotechino', fn: () => this._sagra() };
    return null;
  }

  _gnomo(n) {
    const g = this.game, f = this.f, G = S.gnomi;
    n.spr.visible = false; f.gnomi.push(n.i);
    g._xp(G.xp); g.audio.sfx('pick');
    g.ui.toast(fill(G.trovato, { n: f.gnomi.length, xp: G.xp }), 'good');
    if (f.gnomi.length >= G.posti.length) {
      this.s.money += G.premio.soldi; g._xp(G.premio.xp); g.audio.sfx('level');
      g.ui.dialog([{ name: 'I cinque nani', text: fill(G.tutti, G.premio) }]);
    }
    g.emit('sorpresa', { tipo: 'gnomo', esito: f.gnomi.length });
  }

  _fontana() {
    const g = this.game, s = this.s, F = S.fontana;
    if (s.money < F.prezzo) { g.ui.toast('Neanche un euro per un desiderio. Questo è il vero dramma.', 'bad'); return; }
    s.money -= F.prezzo; s.minutes += 2;
    if (Math.random() < F.jackpot.probabilita) {
      s.money += F.jackpot.soldi; g.audio.sfx('level');
      g.ui.toast(fill(F.jackpotTesto, F.jackpot), 'good');
      g.emit('sorpresa', { tipo: 'fontana', esito: 'jackpot' });
    } else { g.audio.sfx('water'); s.stress = clamp(s.stress - 1, 0, 100); g.ui.toast(pick(F.desideri)); }
  }

  async _portafoglio() {
    const g = this.game, s = this.s, f = this.f, W = S.portafoglio;
    const rep = d => { const p = (s.flags.paradiso ??= {}); p.reputazione = clamp((p.reputazione ?? 50) + d, 0, 100); };
    await g.ui.dialog([{ name: 'Portafoglio', text: W.testo, choices: [
      { label: W.restituisci.etichetta, fn: () => { f.portafoglio.preso = true; g._xp(W.restituisci.xp); rep(W.restituisci.rep); g.emit('sorpresa', { tipo: 'portafoglio', esito: 'restituito' }); return [{ who: 'walter', name: 'Il Walter pensionato', text: W.restituisci.testo }]; } },
      { label: W.tieni.etichetta, fn: () => { f.portafoglio.preso = true; s.money += W.soldi; rep(W.tieni.rep); g.audio.sfx('coin'); g.emit('sorpresa', { tipo: 'portafoglio', esito: 'tenuto' }); return [{ name: 'Portafoglio', text: W.tieni.testo }]; } },
      { label: 'Lascialo lì', fn: null },
    ] }]);
  }

  async _turista() {
    const g = this.game, s = this.s, f = this.f, T = S.turista;
    const pag = (text, choices) => ({ who: 'turista', name: T.nome, text, choices });
    const fatto = () => { f.turista = 'fatto'; s.minutes += 15; };
    await g.ui.dialog([...(T.frasi?.length && Math.random() < 0.6 ? [pag(pick(T.frasi))] : []), pag(T.saluto, [
      { label: T.giusta.etichetta, fn: () => { fatto(); s.money += T.giusta.soldi; g._xp(T.giusta.xp); g.audio.sfx('coin'); g.emit('sorpresa', { tipo: 'turista', esito: 'giusta' }); return [pag(T.giusta.testo)]; } },
      { label: T.paradiso.etichetta, fn: () => { fatto(); g._xp(T.paradiso.xp); g.emit('sorpresa', { tipo: 'turista', esito: 'paradiso' }); return [pag(T.paradiso.testo)]; } },
      { label: T.finta.etichetta, fn: () => { fatto(); return [pag(T.finta.testo)]; } },
    ])]);
  }

  async _mountain() {
    const g = this.game, s = this.s, M = S.mountainPesca;
    this.f.mountain = true;
    s.stress = clamp(s.stress + M.stress, 0, 100);
    await g.ui.dialog([{ who: 'mountain', name: 'Mister Mountain (in ferie)', text: `${pick(M.testi)}\n\nStress ${M.stress}` }]);
    g.emit('sorpresa', { tipo: 'mountain', esito: 'pesca' });
  }

  async _sagra() {
    const g = this.game, s = this.s, f = this.f, G = S.sagra;
    await g.ui.dialog([{ name: 'Sagra del Cotechino', text: 'La banda attacca «Romagna mia». Odore di salamella, lambrusco e cipolle.', choices: [
      { label: f.sagraBallo ? 'Hai già ballato (la Sciura Ines è stanca)' : G.balla.etichetta, disabled: f.sagraBallo, fn: () => {
        f.sagraBallo = true; s.stress = clamp(s.stress + G.balla.stress, 0, 100); s.tired = clamp(s.tired + G.balla.stanchezza, 0, 100); s.minutes += 30;
        g._xp(G.balla.xp); g.audio.sfx('level'); g.emit('sorpresa', { tipo: 'sagra', esito: 'ballo' });
        return [{ who: 'ines', name: 'La Sciura Ines', text: G.balla.testo }];
      } },
      { label: G.salamella.etichetta, disabled: s.money < G.salamella.prezzo, fn: () => {
        s.money -= G.salamella.prezzo; s.stress = clamp(s.stress + G.salamella.stress, 0, 100); s.health = clamp(s.health + G.salamella.vita, 0, s.maxHealth); s.minutes += 20;
        g.audio.sfx('eat'); return [{ name: 'Sagra del Cotechino', text: G.salamella.testo }];
      } },
      { label: 'Torna a casa', fn: null },
    ] }]);
  }

  // per provare dalla console: garonio.sorprese.prova('maiale')
  prova(tipo) {
    const f = this.f, s = this.s, P = this._P();
    if (tipo === 'maiale') { f.maiale = { ora: 0, stato: 'attesa' }; this._nuovoMaiale(); this.maiale.x = P.x + 3; this.maiale.z = P.z; }
    else if (tipo === 'turista') { f.turista = 'oggi'; }
    else if (tipo === 'portafoglio') { f.portafoglio = { x: P.x + 1.5, z: P.z }; this.borsello.position.set(P.x + 1.5, 0, P.z); }
    else if (tipo === 'mountain') { s.day = Math.ceil(s.day / 7) * 7; s.minutes = 9 * H; }
    else if (tipo === 'sagra') { s.day = Math.floor(s.day / 7) * 7 + 6; s.minutes = 20 * H; }
    else if (tipo === 'ufo') { this._avvistamento(); f.cerchio.da = s.day; }
    else if (tipo === 'gnomi') return this.gnomi.map(n => [n.x, n.z, n.spr.visible]);
    return true;
  }
}
