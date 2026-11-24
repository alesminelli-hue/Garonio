// Il mondo vivo: paesani con le loro abitudini, traffico sulla provinciale, animali, luci della sera.
// Dati e testi: src/data/vita.js. Sprite: src/sprite_vita.js.
//
// Cosa fa:
//  - i paesani girano per il paese di giorno, chiacchierano tra loro, la sera tornano a casa;
//    gli «umarell» vanno a guardare i cantieri (src/imprevisti.js);
//  - auto, Ape e camion del latte passano sulla provinciale (di più all'ora di punta, pochi di notte coi fari),
//    frenano se Garonio è in mezzo e suonano il clacson (stress); tamponarli è un urto vero (danni, Vigilessa);
//  - gatti da accarezzare (stress −), corvi che volano via quando passi, anatre sul laghetto, lucciole d'estate;
//  - lampioni che si accendono al tramonto; la sera le auto parcheggiano davanti al bar e al Night Paradiso.
//
// API (game.vita):
//   ora()                      ora del giorno (0-24, decimale)
//   notte()                    0 (giorno) .. 1 (notte piena)
//   piove()                    true se oggi piove (meteo del lavoro sulle stagioni)
//   paesani                    [{ id, def, x, z, visibile, ... }] (src/imprevisti.js li usa per gli impiccioni)
//   chiama(p, x, z)            fa venire un paesano verso un punto (impiccioni)
//   auto                       auto in strada: [{ x, z, dir, v, tipo }]
//   schizza(x, z, r)           true se un'auto è passata veloce entro r da (x, z) in questo fotogramma
// Eventi: ascolta 'urto' (tamponamento di un'auto del traffico).
import * as THREE from 'three';
import * as PIX from './pixel.js';
import * as SV from './sprite_vita.js';
import { MAP_W } from './map.js';
import { METE, PAESANI, FUMETTI, TRAFFICO, IMPREVISTI } from './data/vita.js';
import { pick, fill } from './racconto.js';

const H = 60;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const inOre = (o, h) => !!o && (o[0] <= o[1] ? h >= o[0] && h < o[1] : h >= o[0] || h < o[1]);

// posti dei lampioni e delle auto parcheggiate la sera
const LAMPIONI = [[3, 57.3], [9, 57.3], [15, 57.3], [27, 57.3], [33, 57.3], [41, 57.3], [53, 57.3], [9, 49.6], [21, 49.6], [37, 49.6],
  [59.4, 65], [72.6, 66], [71.6, 57.3], [123.4, 57.3], [117.6, 66], [44, 67]];
const PARCHEGGI = [
  { x: 46, z: 68.6, ore: [20.5, 24], col: '#2a2a30', tipo: 'auto' }, { x: 51.5, z: 68.8, ore: [21, 24], col: '#c83a2e', tipo: 'auto' },
  { x: 41.5, z: 68.4, ore: [22, 24], col: '#f0f0f0', tipo: 'auto' }, { x: 27, z: 51.2, ore: [18, 23.5], col: '#3a8a4a', tipo: 'auto' },
  { x: 4, z: 51.4, ore: [8, 12.5], col: '#4a8ac8', tipo: 'ape' },
];
const GATTI = [{ x: 71, z: 69.4, col: '#e08a30' }, { x: 24, z: 58.6, col: '#3a3a40' }, { x: 131, z: 70, col: '#d8d0c8' }];
const CAMPI_CORVI = [{ x0: 27, x1: 46, z0: 10, z1: 25 }, { x0: 91, x1: 112, z0: 10, z1: 25 }, { x0: 124, x1: 149, z0: 10, z1: 25 }];
const LAGHETTO = { x: 35, z: 83.5, rx: 4.2, rz: 2.8 };
const LUCCIOLE = [[35, 77.5, 4], [70, 8.6, 6], [100, 8.6, 6], [65, 80, 3], [140, 86, 5], [50, 30.5, 5]];

export class Vita {
  constructor(game) {
    this.game = game;
    this.paesani = [];
    this.auto = [];
    this.gatti = [];
    this.stormi = [];
    this.anatre = [];
    this.lucciole = [];
    this.luci = [];
    this.parcheggiati = [];
    this._prossimaAuto = 2;
    this._prossimaApe = 20;
    this._clacsonT = 0;
    this._schizzi = [];
    this.t = 0;
    game.moduli.push(this);
  }
  get s() { return this.game.s; }
  get W() { return this.game.world; }

  init() {
    this.s.flags.vita ??= { gatti: {} };
    this._texAuto = {};
    this._fumetti = FUMETTI.map(t => PIX.toTexture(SV.fumetto(t)));
    this._creaPaesani();
    this._creaAnimali();
    this._creaLuci();
    // le auto del traffico sono ostacoli per i mezzi guidati da Garonio (tamponamenti veri)
    const veh = this.game.vehicles;
    const free = veh._free.bind(veh);
    veh._free = (v, x, z) => free(v, x, z) && !this._colpisceAuto(veh._box(v, x, z));
    this.game.on('urto', e => this._tamponamento(e));
    this.game.bersagli.push(() => this._bersaglioGatto());
    this.game.on('nuovoGiorno', () => { this.s.flags.vita.gatti = {}; });
  }

  // ---------- Tempo ----------
  ora() { return (this.s.minutes / H) % 24; }
  notte(h = this.ora()) {
    if (h >= 20.5 || h < 5.5) return 1;
    if (h >= 18.5) return (h - 18.5) / 2;
    if (h < 6.8) return 1 - (h - 5.5) / 1.3;
    return 0;
  }
  piove() { return this.game.stagioni?.st?.meteo === 'pioggia'; }
  _vicino(x, z, r) { const P = this.game.player.group.position; return Math.hypot(P.x - x, P.z - z) < r; }

  // ---------- Ogni fotogramma (anche coi dialoghi aperti: solo grafica) ----------
  animate(dt) {
    this.t += dt;
    const nf = this.notte();
    for (const l of this.luci) { l.glow.material.opacity = nf * 0.9; l.pool.material.opacity = nf * 0.55; l.glow.visible = l.pool.visible = nf > 0.02; }
    for (const a of this.auto) if (a.fari) { a.fari.visible = nf > 0.05; a.fari.material.opacity = nf * 0.7; }
    const h = this.ora();
    for (const p of this.parcheggiati) p.spr.visible = inOre(p.ore, h);
    const lu = nf > 0.6 && !this.piove() && this.game.stagioni?.st?.meteo !== 'neve';
    for (const f of this.lucciole) {
      f.spr.visible = lu;
      if (!lu) continue;
      const k = this.t * f.v + f.ph;
      f.spr.position.set(f.x + Math.sin(k) * 0.8, 0.5 + Math.sin(k * 1.7) * 0.35, f.z + Math.cos(k * 0.8) * 0.6);
      f.spr.material.opacity = Math.max(0, Math.sin(this.t * 2.2 + f.ph * 3)) * 0.95;
    }
    // anatre: girano piano sul laghetto (di notte dormono)
    for (const d of this.anatre) {
      if (nf < 0.8) d.ang += dt * d.v;
      const x = LAGHETTO.x + Math.cos(d.ang) * LAGHETTO.rx * d.r, z = LAGHETTO.z + Math.sin(d.ang) * LAGHETTO.rz * d.r;
      d.a.group.position.set(x, 0, z);
      const dir = -Math.sin(d.ang) * d.v >= 0 ? 0 : 2;
      d.a.setFrame(dir + (Math.floor(this.t * 1.5 + d.ang) % 2));
    }
  }

  // ---------- Ogni fotogramma di gioco (fermo durante i dialoghi) ----------
  update(dt) {
    const h = this.ora();
    this._schizzi.length = 0;
    this._aggiornaPaesani(dt, h);
    this._aggiornaTraffico(dt, h);
    this._aggiornaGatti(dt, h);
    this._aggiornaCorvi(dt, h);
    if (this._clacsonT > 0) this._clacsonT -= dt;
  }

  // =====================================================================
  //  PAESANI
  // =====================================================================
  _creaPaesani() {
    for (const def of PAESANI) {
      PIX.CHARACTERS[def.id] ??= def.aspetto;      // ritratto nei dialoghi
      const a = this.W.actor(PIX.characterFrames(def.id), { w: def.aspetto.w / 16 * 1.25, h: def.aspetto.h / 16 * 1.25, shadow: 0.35 });
      a.group.visible = false;
      const bub = this.W.sprite(this._fumetti[0], { w: 1, h: 0.8 });
      bub.position.set(0.2, def.aspetto.h / 16 * 1.25 + 0.1, 0); bub.visible = false; a.group.add(bub);
      const p = { id: def.id, def, a, bub, bubT: 0, bubPausa: rand(0, 10), x: 0, z: 0, visibile: false, meta: null, attesa: 0, dir: 1, walkT: 0, stuck: 0, chiamato: null };
      if (def.cagnolino) {
        const fr = [SV.barboncino(0), SV.barboncino(1)];
        p.cane = this.W.actor([fr[0], fr[1], PIX.mirror(fr[0]), PIX.mirror(fr[1])], { w: 0.7, h: 0.56, shadow: 0.2 });
        p.cane.group.visible = false; p.cx = 0; p.cz = 0;
      }
      this.paesani.push(p);
    }
    // all'avvio chi è in giro è già sparso per il paese
    const h = this.ora();
    for (const p of this.paesani) if (this._inGiro(p.def, h)) this._mostra(p, METE[pick(p.def.mete)]);
  }

  _inGiro(def, h) { return inOre(def.ore, h) || inOre(def.ore2, h); }

  _mostra(p, [x, z]) {
    const q = this._libero(x, z);
    p.x = q.x; p.z = q.z; p.visibile = true; p.a.group.visible = true; p.attesa = rand(1, 6); p.meta = null;
    if (p.cane) { p.cx = p.x - 0.8; p.cz = p.z + 0.3; p.cane.group.visible = true; }
  }
  _nascondi(p) { p.visibile = false; p.a.group.visible = false; p.bub.visible = false; if (p.cane) p.cane.group.visible = false; }

  _libero(x, z) {
    for (let r = 0; r < 4; r += 0.5) for (const [ox, oz] of [[0, 0], [r, 0], [-r, 0], [0, r], [0, -r]]) if (!this.W.blocked(x + ox, z + oz, 0.2)) return { x: x + ox, z: z + oz };
    return { x, z };
  }

  chiama(p, x, z) { p.chiamato = { x, z }; p.attesa = 0; }

  _scegliMeta(p) {
    const imp = this.game.imprevisti;
    if (p.def.umarell && imp?.cantiere && Math.random() < 0.5) {
      const c = imp.cantiere;
      return [c.x + rand(-2.5, 2.5), c.z + (Math.random() < 0.5 ? -2.2 : 2.2)];
    }
    const [x, z] = METE[pick(p.def.mete)];
    return [x + rand(-1.2, 1.2), z + rand(-0.4, 0.4)];
  }

  // passo verso (tx, tz) aggirando gli ostacoli; true se arrivato.
  // Non attraversa mai muri ed edifici: se resta incastrato a lungo si arrende (o.bloccato = true)
  // e chi lo usa sceglie un'altra meta. Se è già dentro un ostacolo (spuntato addosso), può uscirne.
  _passo(o, tx, tz, sp, dt) {
    const dx = tx - o.x, dz = tz - o.z, d = Math.hypot(dx, dz);
    o.bloccato = false;
    if (d < 0.2) { o.stuck = 0; return true; }
    const st = Math.min(d, sp * dt), a0 = Math.atan2(dz, dx);
    const dentro = this.W.blocked(o.x, o.z, 0.18);
    // ostacolo davanti: prova ad aggirarlo, tenendo il lato scelto finché non si libera
    for (const k of [0, 0.6, 1.2, 1.8, 2.4]) for (const sgn of (o.lato ? [o.lato, -o.lato] : [1, -1])) {
      const off = k * sgn;
      const nx = o.x + Math.cos(a0 + off) * st, nz = o.z + Math.sin(a0 + off) * st;
      if (dentro || !this.W.blocked(nx, nz, 0.18)) {
        o.x = nx; o.z = nz;
        if (k === 0) { o.stuck = 0; o.lato = 0; } else { o.lato = sgn; o.stuck = (o.stuck || 0) + dt * 0.25; }
        const c = Math.cos(a0 + off); if (Math.abs(c) > 0.2) o.dir = c >= 0 ? 1 : -1;
        if (o.stuck > 4) { o.stuck = 0; o.lato = 0; o.bloccato = true; }
        return false;
      }
      if (k === 0) break;
    }
    o.stuck = (o.stuck || 0) + dt;
    if (o.stuck > 1.5) { o.stuck = 0; o.lato = 0; o.bloccato = true; }   // non passa: meglio rinunciare che entrare nei muri
    return false;
  }

  _aggiornaPaesani(dt, h) {
    const P = this.game.player.group.position;
    for (const p of this.paesani) {
      const inGiro = this._inGiro(p.def, h);
      if (!p.visibile) {
        if (inGiro) this._mostra(p, METE[p.def.casa]);
        continue;
      }
      let moving = false;
      if (p.chiamato) {
        moving = !this._passo(p, p.chiamato.x, p.chiamato.z, 1.8, dt);
        if (!moving || p.bloccato) { p.chiamato = null; moving = false; }
      } else if (!inGiro) {
        const [hx, hz] = METE[p.def.casa];
        // arrivato alla porta (o la strada è chiusa): torna a casa e sparisce
        if (this._passo(p, hx, hz, 1.3, dt) || p.bloccato) { this._nascondi(p); continue; }
        moving = true;
      } else if (p.meta) {
        if (this._passo(p, p.meta[0], p.meta[1], 1.15, dt) || p.bloccato) { p.meta = null; p.attesa = rand(4, 14); }
        else moving = true;
      } else {
        p.attesa -= dt;
        if (p.attesa <= 0) p.meta = this._scegliMeta(p);
        else {
          // fermo: guarda Garonio se è vicino, altrimenti chiacchiera con chi gli sta accanto
          const vic = this.paesani.find(o => o !== p && o.visibile && Math.hypot(o.x - p.x, o.z - p.z) < 1.8);
          if (Math.hypot(P.x - p.x, P.z - p.z) < 4) p.dir = P.x > p.x ? 1 : -1;
          else if (vic) p.dir = vic.x > p.x ? 1 : -1;
        }
      }
      // fumetto: quando Garonio passa vicino o due paesani chiacchierano
      p.bubPausa -= dt; p.bubT -= dt;
      if (p.bubT <= 0) p.bub.visible = false;
      if (p.bubPausa <= 0 && !moving && Math.hypot(P.x - p.x, P.z - p.z) < 5) {
        p.bubPausa = rand(12, 25); p.bubT = 2.5; p.bub.visible = true;
        p.bub.material.map = this._fumetti[Math.floor(Math.random() * this._fumetti.length)];
      }
      p.walkT += dt * 6;
      p.a.group.position.set(p.x, 0, p.z);
      p.a.setFrame((p.dir > 0 ? 0 : 3) + (moving ? 1 + (Math.floor(p.walkT) % 2) : 0));
      if (p.cane) {
        const tx = p.x - p.dir * 0.9, tz = p.z + 0.35, d = Math.hypot(tx - p.cx, tz - p.cz);
        if (d > 0.1) { const st = Math.min(d, 2.4 * dt); p.cx += (tx - p.cx) / d * st; p.cz += (tz - p.cz) / d * st; }
        p.cane.group.position.set(p.cx, 0, p.cz);
        p.cane.setFrame((p.dir > 0 ? 0 : 2) + (d > 0.15 ? Math.floor(p.walkT * 1.5) % 2 : 0));
      }
    }
  }

  // =====================================================================
  //  TRAFFICO
  // =====================================================================
  _tex(tipo, col) {
    const k = tipo + col;
    if (!this._texAuto[k]) {
      const r = [0, 1].map(f => SV.auto_(tipo, col, f));
      this._texAuto[k] = [...r, ...r.map(PIX.mirror)].map(c => PIX.toTexture(c));
    }
    return this._texAuto[k];
  }

  _nuovaAuto(tipo, col, dir, z, x) {
    const tex = this._tex(tipo, col), img = tex[0].image;
    const w = img.width / PIX.PX, hh = img.height / PIX.PX;
    const spr = this.W.sprite(tex[0], { w, h: hh });
    const group = new THREE.Group(); group.add(spr);
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.9, 0.9).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25, depthWrite: false }));
    sh.position.y = 0.02; group.add(sh);
    this.W.scene.add(group);
    const T = TRAFFICO.tipi[tipo];
    const a = { tipo, col, tex, spr, group, dir, z, x, v: T.vel * 0.8, vmax: T.vel * rand(0.85, 1.1), half: w * 0.45, ruoteT: 0, fermoT: 0 };
    // fari di notte: alone davanti al muso
    this._texFari ??= PIX.toTexture(SV.alone('255,240,180'));
    const fari = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.6).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ map: this._texFari, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    fari.position.set(dir * (w * 0.5 + 1.3), 0.04, 0); fari.visible = false;
    group.add(fari); a.fari = fari;
    group.position.set(x, 0, z);
    spr.material.map = tex[dir > 0 ? 0 : 2];
    this.auto.push(a);
    return a;
  }

  _togliAuto(a) {
    this.W.scene.remove(a.group); this.W.spriteMats.delete(a.spr.material);
    this.auto.splice(this.auto.indexOf(a), 1);
  }

  _ogni(h) { return (TRAFFICO.ogni.find(f => inOre(f.ore, h)) || TRAFFICO.ogni.at(-1)).s; }

  _tipoACaso() {
    const T = TRAFFICO.tipi, tot = Object.values(T).reduce((t, x) => t + x.per, 0);
    let r = Math.random() * tot;
    for (const [k, x] of Object.entries(T)) if ((r -= x.per) < 0) return k;
    return 'auto';
  }

  _aggiornaTraffico(dt, h) {
    // nuove auto sulla provinciale
    this._prossimaAuto -= dt;
    if (this._prossimaAuto <= 0) {
      const [a, b] = this._ogni(h); this._prossimaAuto = rand(a, b);
      if (this.auto.length < TRAFFICO.max) {
        const dir = Math.random() < 0.5 ? 1 : -1, z = dir > 0 ? TRAFFICO.corsie.est : TRAFFICO.corsie.ovest;
        const x = dir > 0 ? -6 : MAP_W + 6;
        if (!this.auto.some(o => o.z === z && Math.abs(o.x - x) < 9)) {
          const tipo = this._tipoACaso();
          this._nuovaAuto(tipo, pick(TRAFFICO.tipi[tipo].colori), dir, z, x);
        }
      }
    }
    // ogni tanto l'Ape di un vicino sulla capezzagna (solo di giorno)
    this._prossimaApe -= dt;
    if (this._prossimaApe <= 0) {
      this._prossimaApe = rand(40, 90);
      const z = TRAFFICO.capezzagna;
      if (h > 7 && h < 19 && !this.auto.some(o => o.z === z)) {
        const dir = Math.random() < 0.5 ? 1 : -1;
        const a = this._nuovaAuto('ape', pick(TRAFFICO.tipi.ape.colori), dir, z, dir > 0 ? 23.5 : 152.5);
        a.fine = dir > 0 ? 152.5 : 23.5; a.vmax *= 0.8;
      }
    }

    const g = this.game, P = g.player.group.position, drv = g.vehicles.driving;
    const ostacoli = [];
    if (drv) ostacoli.push({ x: drv.st.x, z: drv.st.z, r: drv.T.box[0], garonio: true });
    else ostacoli.push({ x: P.x, z: P.z, r: 0.35, garonio: true });
    for (const p of this.paesani) if (p.visibile) ostacoli.push({ x: p.x, z: p.z, r: 0.3 });
    const vig = g.png.dove('vigilessa'); if (vig) ostacoli.push({ x: vig.x, z: vig.z, r: 0.3 });
    const cane = g.imprevisti?.cane; if (cane) ostacoli.push({ x: cane.x, z: cane.z, r: 0.4 });
    for (const t of g.imprevisti?.ostacoliStrada?.() || []) ostacoli.push(t);

    for (const a of [...this.auto]) {
      let vWant = a.vmax * (a.x < 42 ? 0.65 : 1);
      let gap = Infinity, perGaronio = false;
      for (const o of ostacoli) {
        if (Math.abs(o.z - a.z) > 1.15 + (o.r > 0.5 ? 0.4 : 0)) continue;
        const d = (o.x - a.x) * a.dir - a.half - o.r;
        if (d > -a.half * 1.6 && d < gap) { gap = d; perGaronio = !!o.garonio; }
      }
      for (const o of this.auto) {
        if (o === a || o.z !== a.z || o.dir !== a.dir) continue;
        const d = (o.x - a.x) * a.dir - a.half - o.half;
        if (d > -0.5 && d < gap) { gap = d; perGaronio = false; }
      }
      if (gap < 5) vWant = gap < 1 ? 0 : Math.min(vWant, (gap - 0.8) * 1.6);
      const acc = vWant < a.v ? 9 : 3;
      a.v += clamp(vWant - a.v, -acc * dt, acc * dt);
      const dx = a.v * a.dir * dt;
      a.x += dx;
      a.ruoteT += Math.abs(dx);
      a.group.position.set(a.x, 0, a.z);
      a.spr.material.map = a.tex[(a.dir > 0 ? 0 : 2) + (Math.floor(a.ruoteT * 3) % 2)];
      // ferma per colpa di Garonio: clacson e stress
      if (a.v < 0.6 && perGaronio && gap < 3) {
        a.fermoT += dt;
        if (a.fermoT > 1.2 && !a.suonato) {
          a.suonato = true;
          g.audio.sfx(a.tipo === 'camion' ? 'horn_trattore' : 'horn_punto');
          if (this._clacsonT <= 0) {
            this._clacsonT = 20;
            g.s.stress = clamp(g.s.stress + 2, 0, 100);
            g.ui.toast(`${pick(TRAFFICO.clacson)}  Stress +2`, 'bad');
          }
        }
      } else if (a.v > 1) { a.fermoT = 0; a.suonato = false; }
      if (a.v > 3.5) this._schizzi.push({ x: a.x, z: a.z });
      const fuori = a.fine != null ? (a.x - a.fine) * a.dir > 0 : a.x < -10 || a.x > MAP_W + 10;
      if (fuori) this._togliAuto(a);
    }
  }

  schizza(x, z, r) { return this._schizzi.some(o => Math.hypot(o.x - x, o.z - z) < r); }

  _colpisceAuto([x0, z0, x1, z1]) {
    for (const a of this.auto) {
      const ax0 = a.x - a.half, ax1 = a.x + a.half, az0 = a.z - 0.5, az1 = a.z + 0.5;
      if (x1 > ax0 && x0 < ax1 && z1 > az0 && z0 < az1) return a;
    }
    return null;
  }

  _tamponamento(e) {
    const a = this.auto.find(o => Math.hypot(o.x - e.x, o.z - e.z) < 3.2);
    if (!a || !e.velocita || e.velocita < 1.2) return;
    const g = this.game;
    g.audio.sfx('horn_punto');
    g.s.stress = clamp(g.s.stress + 4, 0, 100);
    g.ui.toast(`${pick(TRAFFICO.tamponato)}  Stress +4`, 'bad');
    a.v = 0;
  }

  // =====================================================================
  //  ANIMALI
  // =====================================================================
  _creaAnimali() {
    const W = this.W;
    // gatti
    GATTI.forEach((c, i) => {
      const fr = [0, 1, 2].map(f => SV.gatto(c.col, f));
      const a = W.actor([fr[0], fr[1], fr[2], PIX.mirror(fr[0]), PIX.mirror(fr[1]), PIX.mirror(fr[2])], { w: 0.85, h: 0.6, shadow: 0.25 });
      this.gatti.push({ i, a, casa: c, x: c.x, z: c.z, tx: c.x, tz: c.z, attesa: rand(1, 5), dir: 1, fuga: 0, walkT: 0 });
    });
    // corvi: stormi sui campi di grano e sull'arato
    const fc = [0, 1, 2, 3].map(f => SV.corvo(f));
    const frames = [...fc, ...fc.map(PIX.mirror)];
    for (let k = 0; k < 2; k++) {
      const st = { uccelli: [], stato: 'terra', t: 0, x: 0, z: 0 };
      for (let i = 0; i < 5; i++) {
        const a = W.actor(frames, { w: 0.6, h: 0.5, shadow: 0.15 });
        st.uccelli.push({ a, ox: rand(-1.8, 1.8), oz: rand(-1.2, 1.2), y: 0, ph: rand(0, 6), dir: Math.random() < 0.5 ? 1 : -1 });
      }
      this._posaStormo(st, k);
      this.stormi.push(st);
    }
    // anatre sul laghetto
    const fa = [0, 1].map(f => SV.anatra(f));
    for (let i = 0; i < 4; i++) {
      const a = W.actor([fa[0], fa[1], PIX.mirror(fa[0]), PIX.mirror(fa[1])], { w: 0.8, h: 0.58, shadow: 0.01 });
      this.anatre.push({ a, ang: i * 1.6, r: 0.55 + i * 0.12, v: (i % 2 ? 1 : -1) * rand(0.08, 0.14) });
    }
    // lucciole (solo d'estate e di notte senza pioggia: vedi animate)
    const tex = PIX.toTexture(SV.alone('200,255,120', 16));
    for (const [cx, cz, n] of LUCCIOLE) for (let i = 0; i < n; i++) {
      const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      spr.scale.set(0.35, 0.35, 1); spr.visible = false; W.scene.add(spr);
      this.lucciole.push({ spr, x: cx + rand(-3, 3), z: cz + rand(-1.5, 1.5), v: rand(0.3, 0.7), ph: rand(0, 6) });
    }
  }

  _posaStormo(st, k = Math.floor(Math.random() * CAMPI_CORVI.length)) {
    const c = CAMPI_CORVI[k % CAMPI_CORVI.length];
    st.x = rand(c.x0 + 2, c.x1 - 2); st.z = rand(c.z0 + 2, c.z1 - 2); st.stato = 'terra'; st.t = 0;
    for (const u of st.uccelli) { u.y = 0; u.a.group.visible = true; }
  }

  _aggiornaCorvi(dt, h) {
    const giorno = h > 6 && h < 20;
    const P = this.game.player.group.position;
    for (const st of this.stormi) {
      st.t += dt;
      if (!giorno) { for (const u of st.uccelli) u.a.group.visible = false; st.stato = 'via'; continue; }
      if (st.stato === 'via') { if (st.t > 40) this._posaStormo(st); else continue; }
      if (st.stato === 'terra' && Math.hypot(P.x - st.x, P.z - st.z) < 4.5) {
        st.stato = 'vola'; st.t = 0; st.fx = Math.sign(st.x - P.x) || 1;
        if (this._vicino(st.x, st.z, 12)) this.game.audio.sfx('shoo');
      }
      for (const u of st.uccelli) {
        let x = st.x + u.ox, z = st.z + u.oz, f;
        if (st.stato === 'terra') {
          f = Math.sin(this.t * 3 + u.ph) > 0.6 ? 1 : 0;
          if (Math.random() < dt * 0.2) u.dir = -u.dir;
        } else {
          u.y += dt * 3.2; x += st.fx * st.t * 5; z -= st.t * 2;
          f = 2 + (Math.floor(this.t * 10 + u.ph) % 2); u.dir = st.fx;
          if (st.t > 4) { u.a.group.visible = false; }
        }
        u.a.group.position.set(x, u.y, z);
        u.a.setFrame((u.dir > 0 ? 0 : 4) + f);
      }
      if (st.stato === 'vola' && st.t > 4) { st.stato = 'via'; st.t = 0; }
    }
  }

  _aggiornaGatti(dt, h) {
    const P = this.game.player.group.position;
    const corre = this.game.input.run && this.game.moving;
    const dorme = h >= 12.5 && h < 15.5;
    for (const c of this.gatti) {
      const dP = Math.hypot(P.x - c.x, P.z - c.z);
      let moving = false;
      if ((corre && dP < 2.6) || (this.game.vehicles.driving && dP < 3)) {
        c.fuga = 1.2; const k = 3 / (dP || 1); c.tx = c.x + (c.x - P.x) * k; c.tz = c.z + (c.z - P.z) * k;
      }
      if (c.fuga > 0) { c.fuga -= dt; moving = !this._passo(c, c.tx, c.tz, 4.5, dt); }
      else if (dorme) { c.a.group.position.set(c.x, 0, c.z); c.a.setFrame((c.dir > 0 ? 0 : 3) + 2); continue; }
      else {
        c.attesa -= dt;
        if (c.attesa <= 0) {
          if (this._passo(c, c.tx, c.tz, 1.1, dt)) { c.attesa = rand(3, 9); c.tx = c.casa.x + rand(-3, 3); c.tz = c.casa.z + rand(-1.5, 1.5); }
          else moving = true;
        }
      }
      // se scappa troppo lontano torna verso casa
      if (Math.hypot(c.x - c.casa.x, c.z - c.casa.z) > 8 && c.fuga <= 0) { c.tx = c.casa.x; c.tz = c.casa.z; c.attesa = 0; }
      c.walkT += dt * 8;
      c.a.group.position.set(c.x, 0, c.z);
      c.a.setFrame((c.dir > 0 ? 0 : 3) + (moving ? Math.floor(c.walkT) % 2 : 0));
    }
  }

  _bersaglioGatto() {
    if (this.game.vehicles.driving) return null;
    const P = this.game.player.group.position, G = IMPREVISTI.gatti, f = this.s.flags.vita;
    const c = this.gatti.find(c => Math.hypot(P.x - c.x, P.z - c.z) < 1.2);
    if (!c) return null;
    return { label: 'Accarezza il gatto', fn: () => {
      const s = this.s, g = this.game;
      if (Math.random() < G.graffio) {
        s.health = clamp(s.health - 2, 0, s.maxHealth); s.stress = clamp(s.stress + 2, 0, 100);
        g.ui.toast(pick(G.graffioTesti), "bad"); g.audio.sfx('bad'); return;
      }
      if (f.gatti[c.i]) { g.ui.float('Il gatto ti ignora con eleganza. Per oggi basta.'); return; }
      f.gatti[c.i] = true;
      s.stress = clamp(s.stress - G.carezza, 0, 100);
      g.ui.toast(fill(pick(G.testi), { s: G.carezza }), 'good'); g.audio.sfx('meow');
      g.emit('gatto', {});
    } };
  }

  // =====================================================================
  //  LUCI DELLA SERA
  // =====================================================================
  _creaLuci() {
    const W = this.W;
    const tLamp = PIX.toTexture(SV.lampione()), tGlow = PIX.toTexture(SV.alone()), tPool = PIX.toTexture(SV.alone('255,200,120', 64));
    for (const [x, z] of LAMPIONI) {
      const s = W.sprite(tLamp, { w: 0.5, h: 3.1 }); s.position.set(x, 0, z); W.scene.add(s);
      W.solids.push({ x0: x - 0.12, z0: z - 0.1, x1: x + 0.12, z1: z + 0.1 });
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: tGlow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
      glow.scale.set(1.6, 1.6, 1); glow.position.set(x, 2.75, z + 0.05); W.scene.add(glow);
      const pool = new THREE.Mesh(new THREE.PlaneGeometry(5, 3.4).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ map: tPool, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
      pool.position.set(x, 0.035, z + 0.3); W.scene.add(pool);
      this.luci.push({ glow, pool });
    }
    for (const p of PARCHEGGI) {
      const tex = this._tex(p.tipo, p.col), img = tex[0].image;
      const spr = W.sprite(tex[0], { w: img.width / PIX.PX, h: img.height / PIX.PX });
      spr.position.set(p.x, 0, p.z); spr.visible = false; W.scene.add(spr);
      this.parcheggiati.push({ ...p, spr });
    }
  }
}
