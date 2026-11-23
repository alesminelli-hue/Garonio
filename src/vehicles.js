// Mezzi guidabili: Vespa e Punto di Garonio, trattori dell'azienda.
// Modulo a sé: il gioco lo usa tramite pochi agganci (vedi game.js, cerca "vehicles").
// - salire/scendere col tasto azione, guida con frecce/WASD o levetta, Q = clacson
// - la Vespa ogni tanto si spegne, la Punto consuma benzina e può forare
// - i trattori arano il campo passando, ma si rompono con urti e guida da stanchi
// - riparazioni e pieno in officina
import * as THREE from 'three';
import { toTexture } from './pixel.js';
import { BUILDINGS, AREAS } from './world.js';
import { PLACES, SURFACE_SPEED } from './map.js';
import { vehicleArt, smokePuff, VPX } from './vehicle_sprites.js';

// ===== Valori facili da ritoccare =====
export const VEHICLE_TYPES = {
  vespa: {
    name: 'Vespa', article: 'la', icon: '🛵', maxSpeed: 8.5, accel: 8, turn: 5.5, box: [0.55, 0.32],
    crashSpeed: 5, fallSpeed: 7, crashDamage: 6, startFail: 0.25, stallPerSec: 0.004,
    repair: { price: 15, minutes: 60 },
  },
  punto: {
    name: 'Punto', article: 'la', icon: '🚗', maxSpeed: 7.5, accel: 6, turn: 3.8, box: [1.35, 0.62],
    crashSpeed: 3.5, crashDamage: 5, fuelPerUnit: 0.16, flatChance: 0.3,
    repair: { price: 20, minutes: 60 }, refuel: { price: 10, minutes: 15 }, tyre: { price: 8, minutes: 30 },
  },
  trattore: {
    name: 'Trattore', label: 'trattore', article: 'il', icon: '🚜', maxSpeed: 6.8, accel: 8, turn: 3.2, box: [1.25, 0.75],
    crashSpeed: 3.5, crashDamage: 12, tiredBreakPerSec: 0.006, plows: true,
    repair: { price: 40, minutes: 120 },
  },
};

// Dove sono parcheggiati all'inizio, calcolato dagli edifici: se la mappa cambia, seguono casa e officina.
// La mappa nuova può sostituire questa funzione (o passare i posti a new Vehicles(game, parking)).
export function defaultParking() {
  const P = PLACES.parking;
  if (P) { // posti auto della mappa grande (src/map.js)
    return {
      vespa: { x: P.casa.x, z: P.casa.z, h: P.casa.dir },
      punto: { x: P.casa.x + 3.2, z: P.casa.z, h: P.casa.dir },
      trattore1: { x: P.tettoia.x, z: P.tettoia.z, h: P.tettoia.dir, color: 'rosso' },
      trattore2: { x: P.officina.x, z: P.officina.z, h: P.officina.dir, color: 'verde' },
    };
  }
  const casa = BUILDINGS.find(b => b.id === 'casa'), off = BUILDINGS.find(b => b.id === 'officina');
  return {
    vespa: { x: casa.x0 + casa.w + 0.75, z: casa.z0 + casa.d - 0.7, h: Math.PI / 2 },
    punto: { x: casa.x0 - 2.2, z: casa.z0 + casa.d - 0.9, h: Math.PI },
    trattore1: { x: off.x0 + off.w + 2.2, z: off.z0 + 2.6, h: Math.PI / 2, color: 'rosso' },
    trattore2: { x: off.x0 + off.w + 5.4, z: off.z0 + 2.6, h: Math.PI / 2, color: 'verde' },
  };
}

const IDS = ['vespa', 'punto', 'trattore1', 'trattore2'];
const kindOf = id => id.startsWith('trattore') ? 'trattore' : id;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const wrap = a => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };

export class Vehicles {
  constructor(game, parking = defaultParking()) {
    this.game = game; this.world = game.world; this.ui = game.ui; this.audio = game.audio;
    this.parking = parking;
    this.list = [];
    this.driving = null;      // veicolo guidato in questo momento
    this.puffs = [];
    this.t = 0;
    this.blocchi = [];        // [(v) => messaggio | null]: chi impedisce di salire (sequestro, batteria...)
    this._makeHud();
    // i mezzi parcheggiati sono ostacoli anche per chi va a piedi
    const base = this.world.blocked.bind(this.world);
    this.world.blocked = (x, z, r = 0.28) => base(x, z, r) || this._hitsVehicle(x - r, z - r * 0.6, x + r, z + r * 0.6, this.driving);
  }

  get s() { return this.game.s; }

  // Crea gli sprite e lo stato (nuova partita o salvataggio)
  init() {
    const s = this.s;
    s.veh ??= {};
    for (const id of IDS) {
      const p = this.parking[id];
      s.veh[id] ??= { x: p.x, z: p.z, h: p.h, cond: 100, fuel: 100, flat: false };
      const st = s.veh[id];
      const kind = kindOf(id), T = VEHICLE_TYPES[kind];
      const art = vehicleArt(kind, p.color);
      const tex = {}; for (const k of ['R', 'L', 'F', 'B']) tex[k] = art[k].map(c => toTexture(c));
      const group = new THREE.Group();
      const spr = this.world.sprite(tex.R[0], { w: art.R[0].width / VPX, h: art.R[0].height / VPX });
      group.add(spr);
      const sh = new THREE.Mesh(new THREE.CircleGeometry(1, 16).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28, depthWrite: false }));
      sh.position.y = 0.02; group.add(sh);
      this.world.scene.add(group);
      const v = { id, kind, T, st, art, tex, group, spr, sh, speed: 0, view: null, occ: null, stalled: false, smokeT: 0, puffT: 0 };
      this.list.push(v);
      if (!this._free(v, st.x, st.z)) this._findFree(v);
      this._pose(v);
    }
    if (s.driving) { const v = this.get(s.driving); if (v) this._mount(v, true); else s.driving = null; }
  }

  get(id) { return this.list.find(v => v.id === id); }

  // ---------- Collisioni ----------
  // ingombro: lungo in orizzontale, girato quando il mezzo va su o giù
  _box(v, x = v.st.x, z = v.st.z, vert = v.vert) { const [a, b] = v.T.box; const hx = vert ? b : a, hz = vert ? a * 0.8 : b; return [x - hx, z - hz, x + hx, z + hz]; }

  _hitsVehicle(x0, z0, x1, z1, except) {
    for (const v of this.list) {
      if (v === except) continue;
      const [a0, b0, a1, b1] = this._box(v);
      if (x1 > a0 && x0 < a1 && z1 > b0 && z0 < b1) return true;
    }
    return false;
  }

  _free(v, x, z, vert = v.vert) {
    const [x0, z0, x1, z1] = this._box(v, x, z, vert);
    for (const s of this.world.solids) if (x1 > s.x0 && x0 < s.x1 && z1 > s.z0 && z0 < s.z1) return false;
    return !this._hitsVehicle(x0, z0, x1, z1, v);
  }

  _findFree(v) {
    const { x, z } = v.st;
    for (let r = 0.5; r < 8; r += 0.5) for (let a = 0; a < 16; a++) {
      const nx = x + Math.cos(a / 16 * Math.PI * 2) * r, nz = z + Math.sin(a / 16 * Math.PI * 2) * r;
      if (this._free(v, nx, nz)) { v.st.x = nx; v.st.z = nz; return true; }
    }
    return false;
  }

  // ---------- Grafica ----------
  _pose(v) {
    const { st } = v;
    // vista dello sprite con un po' di isteresi, così non sfarfalla in diagonale
    const CENTER = { R: 0, F: Math.PI / 2, L: Math.PI, B: -Math.PI / 2 };
    let view = v.view;
    if (!view || Math.abs(wrap(st.h - CENTER[view])) > Math.PI / 4 + 0.18) {
      const cx = Math.cos(st.h), cz = Math.sin(st.h);
      view = Math.abs(cx) >= Math.abs(cz) ? (cx >= 0 ? 'R' : 'L') : (cz > 0 ? 'F' : 'B');
    }
    const vert = view === 'F' || view === 'B';
    if (vert !== !!v.vert && this._free(v, st.x, st.z, vert)) v.vert = vert;
    const occ = v === this.driving ? 1 : 0;
    if (view !== v.view || occ !== v.occ) {
      v.view = view; v.occ = occ;
      const c = v.art[view][occ];
      v.spr.material.map = v.tex[view][occ]; v.spr.material.needsUpdate = true;
      v.spr.scale.set(c.width / VPX, c.height / VPX, 1);
      const side = view === 'R' || view === 'L';
      const [hx, hz] = v.T.box;
      v.sh.scale.set(side ? hx * 1.15 : hz * 1.5, 1, side ? hz * 0.9 : hx * 0.55);
    }
    v.group.position.set(st.x, 0, st.z);
  }

  _makeHud() {
    const el = document.createElement('div');
    el.id = 'veh'; el.className = 'panel'; el.hidden = true;
    document.getElementById('hud').appendChild(el);
    this.hud = el;
    this.btnJump = document.getElementById('btn-jump');
    // menu attrezzi dal trattore: tasto R sul PC, pulsante 🔧 sul telefono
    const b = document.createElement('button');
    b.id = 'btn-attrezzo'; b.textContent = '🔧'; b.title = 'Cambia attrezzo (R)'; b.hidden = true;
    document.getElementById('touch')?.appendChild(b);
    b.addEventListener('pointerdown', e => { e.preventDefault(); this.apriAttrezzi(); });
    this.btnAttrezzo = b;
    window.addEventListener('keydown', e => { if (e.code === 'KeyR' && !e.repeat) this.apriAttrezzi(); });
  }

  _updateHud() {
    const v = this.driving;
    this.hud.hidden = !v;
    const jl = v ? '📯<small>Clacson</small>' : 'Q<small>Salta</small>';
    if (this.btnJump && this._jl !== jl) { this._jl = jl; this.btnJump.innerHTML = jl; }
    const conAttrezzi = v?.kind === 'trattore' && !!this.game.attrezzi;
    if (this.btnAttrezzo && this.btnAttrezzo.hidden === conAttrezzi) this.btnAttrezzo.hidden = !conAttrezzi;
    if (!v) return;
    const bar = (lab, val, cls) => `<div class="vbar ${cls}"><label>${lab}</label><div class="track"><div class="fill" style="width:${clamp(val, 0, 100)}%"></div></div></div>`;
    const kmh = Math.round(Math.abs(v.speed) * 9);
    let html = `<div class="row"><b>${v.T.icon} ${v.T.name}</b><span>${kmh} km/h</span></div>` + bar('Stato', v.st.cond, v.st.cond < 30 ? 'low' : '');
    if (v.kind === 'punto') html += bar('Benz.', v.st.fuel, v.st.fuel < 20 ? 'low' : 'fuel');
    if (v.st.flat) html += '<div class="warn">Gomma a terra!</div>';
    if (v.kind === 'trattore') html += this.game.attrezzi?.hud(v) || '';
    if (v.kind === 'trattore' && this.s.tired > 70) html += '<div class="warn">Sei stanco: occhio a non romperlo!</div>';
    if (html !== this._hudHtml) { this.hud.innerHTML = html; this._hudHtml = html; }
  }

  // ---------- Salire e scendere ----------
  // Bersaglio per il tasto azione (lo chiama game._findTarget)
  target() {
    if (this.driving) {
      const v = this.driving;
      return { label: `Scendi ${v.T.article === 'il' ? 'dal' : 'dalla'} ${v.T.label ?? v.T.name}`, fn: () => this.dismount() };
    }
    const P = this.game.player.group.position;
    let best = null, bd = Infinity;
    for (const v of this.list) {
      const [hx, hz] = v.T.box;
      const dx = Math.max(0, Math.abs(P.x - v.st.x) - hx), dz = Math.max(0, Math.abs(P.z - v.st.z) - hz);
      const d = Math.hypot(dx, dz);
      if (d < 0.75 && d < bd) { bd = d; best = v; }
    }
    if (!best) return null;
    const v = best, name = v.T.label ?? v.T.name, sul = v.T.article === 'il' ? 'sul' : 'sulla';
    if (v.st.cond <= 0) return { label: v.kind === 'trattore' ? 'Trattore rotto: va riparato in officina' : `${name} rotta: va riparata in officina`, fn: () => this._brokenMsg(v) };
    if (v.kind === 'punto' && v.st.fuel <= 0) return { label: 'Punto a secco: fai il pieno in officina', fn: () => this._brokenMsg(v) };
    if (v.kind === 'vespa') return { label: 'Sali sulla Vespa e prova a metterla in moto', fn: () => this.tryMount(v) };
    return { label: `Sali ${sul} ${name}`, fn: () => this.tryMount(v) };
  }

  _brokenMsg(v) {
    this.audio.sfx('bad');
    if (v.kind === 'punto' && v.st.fuel <= 0 && v.st.cond > 0) this.ui.toast('Il serbatoio è vuoto. In officina puoi comprare una tanica.', 'bad');
    else this.ui.toast(`${v.T.name}: il motore non dà segni di vita. Serve l'officina.`, 'bad');
  }

  // effetti di danni ed elaborazioni (src/officina.js); senza officina, valori neutri
  _mod(v) { return this.game.officina?.mod(v) ?? { vel: v.st.cond < 30 ? 0.75 : 1, sterzo: 1, spegni: 1, benzina: 1, fora: 1 }; }

  tryMount(v) {
    const s = this.s;
    for (const fn of this.blocchi) {
      const msg = fn(v);
      if (msg) { this.audio.sfx('stall'); this.ui.toast(msg, 'bad'); s.minutes += 2; return; }
    }
    if (v.kind === 'vespa') {
      s.minutes += 2;
      const fail = v.T.startFail + (100 - v.st.cond) / 300 + (s.tired > 70 ? 0.1 : 0);
      if (Math.random() < fail) {
        this.audio.sfx('stall');
        s.stress = clamp(s.stress + 1, 0, 100);
        this.ui.toast(['La Vespa tossisce e si spegne. Riprova!', 'Pedalina, pedalina... niente. Ancora!', 'Puzza di miscela, ma non parte. Riprova.'][Math.random() * 3 | 0], 'bad');
        return;
      }
    }
    this._mount(v);
  }

  _mount(v, silent = false) {
    this.driving = v; this.s.driving = v.id;
    v.speed = 0; v.stalled = false;
    this.game.player.group.visible = false;
    this.game._wake?.(); this.game.idle = 0;
    this._pose(v);
    if (!silent) { this.audio.sfx('engine'); this.ui.float(`${v.T.icon} In marcia!`); }
  }

  // Scende accanto al mezzo, dove c'è posto
  dismount(force = false) {
    const v = this.driving; if (!v) return true;
    const P = this.game.player.group.position;
    const [hx, hz] = v.T.box;
    const spots = [[0, hz + 0.45], [-(hx + 0.4), 0], [hx + 0.4, 0], [0, -(hz + 0.45)], [-(hx + 0.4), hz + 0.4], [hx + 0.4, hz + 0.4]];
    this.driving = null;  // da qui in poi il mezzo conta come ostacolo
    let ok = false;
    for (const [dx, dz] of spots) {
      const x = v.st.x + dx, z = v.st.z + dz;
      if (!this.world.blocked(x, z)) { P.set(x, 0, z); ok = true; break; }
    }
    if (!ok && !force) { this.driving = v; this.ui.toast('Non c\'è spazio per scendere qui.'); return false; }
    if (!ok) P.set(v.st.x, 0, v.st.z + hz + 0.45);
    v.speed = 0; this.s.driving = null;
    this.game.player.group.visible = true;
    if (Math.abs(Math.cos(v.st.h)) > 0.3) this.game.facing = Math.cos(v.st.h) >= 0 ? 1 : -1;
    this._pose(v);
    this._updateHud();
    return true;
  }

  apriAttrezzi() {
    const v = this.driving;
    if (!v || v.kind !== 'trattore' || !this.game.attrezzi || this.ui.busy() || this.game.locked) return;
    v.speed = 0;
    this.game.attrezzi.apriDaTrattore(v.id);
  }

  horn() {
    const v = this.driving; if (!v) return false;
    this.audio.sfx('horn_' + v.kind);
    // il clacson spaventa le nutrie vicine
    for (const n of this.game.nutrie) if (n.state !== 'flee' && Math.hypot(n.x - v.st.x, n.z - v.st.z) < 3) this.game._flee(n, true);
    this.game.emit('clacson', { mezzo: v.kind, x: v.st.x, z: v.st.z });
    return true;
  }

  // ---------- Guida ----------
  drive(dt, input) {
    const v = this.driving; if (!v) return;
    const s = this.s, T = v.T, st = v.st;
    let { x: ix, z: iz } = input;
    const len = Math.hypot(ix, iz);
    let target = 0;
    const M = this._mod(v);
    let max = T.maxSpeed * (st.flat ? 0.45 : 1) * M.vel;
    if (s.tired > 80) max *= 0.85;
    max *= this.game.attrezzi?.velocita(v) ?? 1;   // gasolio finito, attrezzo giù
    // fondo stradale: sull'asfalto si va a tutta, nei campi e nell'erba si rallenta (il trattore no)
    const ch = this.world.tile(Math.floor(v.st.x), Math.floor(v.st.z));
    const surf = { a: 'asfalto', q: 'piazza', b: 'ponte', p: 'sterrato', g: 'erba', f: 'campo', o: 'campo', r: 'campo', y: 'campo', c: 'erba', s: 'fango', w: 'acqua' }[ch];
    if (surf && SURFACE_SPEED[surf] != null) max *= v.kind === 'trattore' ? Math.max(0.9, SURFACE_SPEED[surf]) : Math.max(0.3, SURFACE_SPEED[surf]);
    // sterzo morbido: il mezzo gira verso la direzione premuta con una velocità angolare che si smorza;
    // tenendo premuto all'indietro da fermi (o dopo una botta) si va in retromarcia, altrimenti fa inversione
    let wantRate = 0;
    v.stuckT = Math.max(0, (v.stuckT || 0) - dt);
    if (len > 0.08) {
      const inp = Math.pow(Math.min(1, len), 0.8);
      const want = Math.atan2(iz, ix);
      let diff = wrap(want - st.h);
      const opp = Math.abs(diff) > 2.5;
      v.oppT = opp ? (v.oppT || 0) + (Math.abs(v.speed) < 0.8 ? dt : 0) : 0;
      if (!opp) v.rev = false;
      if (opp && (v.rev || v.oppT > 0.4 || v.stuckT > 0)) {
        v.rev = true;
        target = -max * 0.4 * inp;
        diff = wrap(want + Math.PI - st.h);
      } else target = max * inp * clamp(1 - Math.abs(diff) / 4.5, 0.45, 1);
      const k = T.turn * M.sterzo * clamp(0.55 + Math.abs(v.speed) / T.maxSpeed, 0.55, 1.2);
      wantRate = clamp(diff * 5, -k, k);
    } else { v.oppT = 0; v.rev = false; }
    v.angV = (v.angV || 0) + (wantRate - (v.angV || 0)) * (1 - Math.exp(-dt * 12));
    st.h = wrap(st.h + v.angV * dt);
    // stanco: il mezzo sbanda un po'
    if (s.tired > 70 && Math.abs(v.speed) > 1) st.h = wrap(st.h + Math.sin(this.t * 2.3) * 0.35 * dt * (s.tired - 70) / 30);
    const braking = Math.sign(target) !== Math.sign(v.speed) && Math.abs(v.speed) > 0.05;
    const rate = (target === 0 ? T.accel * 1.2 : braking ? T.accel * 1.8 : T.accel) * dt;
    v.speed += clamp(target - v.speed, -rate, rate);

    // movimento con scivolamento sui muri
    const dx = Math.cos(st.h) * v.speed * dt, dz = Math.sin(st.h) * v.speed * dt;
    const before = Math.abs(v.speed);
    if (this._free(v, st.x + dx, st.z + dz)) { st.x += dx; st.z += dz; }
    else {
      const okX = this._free(v, st.x + dx, st.z), okZ = this._free(v, st.x, st.z + dz);
      if (okX && Math.abs(dx) > Math.abs(dz) * 0.3) { st.x += dx; v.speed *= 0.97; }
      else if (okZ && Math.abs(dz) > Math.abs(dx) * 0.3) { st.z += dz; v.speed *= 0.97; }
      else { v.speed = -v.speed * 0.25; v.stuckT = 1; this._crash(v, before); if (this.driving !== v) return; }
    }
    const dist = Math.hypot(dx, dz);

    // consumi e guasti
    if (v.kind === 'punto') {
      st.fuel = clamp(st.fuel - dist * T.fuelPerUnit * M.benzina, 0, 100);
      if (st.fuel <= 0) { this.ui.toast('La Punto tossisce e si ferma: benzina finita! Una tanica costa 10€ in officina.', 'bad'); this.audio.sfx('stall'); this.dismount(true); return; }
      if (st.fuel < 15 && !v.fuelWarned) { v.fuelWarned = true; this.ui.toast('Spia della riserva accesa!', 'bad'); }
      if (st.fuel >= 15) v.fuelWarned = false;
    }
    if (v.kind === 'vespa' && Math.abs(v.speed) > 2 && Math.random() < T.stallPerSec * dt * (1 + (100 - st.cond) / 50) * M.spegni) {
      this.audio.sfx('stall');
      this.ui.toast('La Vespa si è spenta di colpo. Garonio scende imprecando.', 'bad');
      this.s.stress = clamp(this.s.stress + 2, 0, 100);
      this.dismount(true); return;
    }
    if (v.kind === 'trattore' && s.tired > 75 && Math.abs(v.speed) > 1 && Math.random() < T.tiredBreakPerSec * dt * (s.tired - 70) / 10) {
      this._breakTractor(v, 'Ti si chiudono gli occhi, il trattore finisce nel fosso. Il motore fuma!');
      return;
    }
    if (this.game.attrezzi) this.game.attrezzi.guida(v, dist, dt);   // il lavoro lo fa l'attrezzo agganciato (src/attrezzi.js)
    else if (T.plows && Math.abs(v.speed) > 0.5) this._plow(v);
    this._scareNutrie(v);

    // Garonio "viaggia" col mezzo: camera, salvataggio e Mister Mountain lo trovano lì
    this.game.player.group.position.set(st.x, 0, st.z);
  }

  _crash(v, speed) {
    if (speed < 2) return;
    const dmg = speed < v.T.crashSpeed ? 0 : Math.round((speed - v.T.crashSpeed + 1) * v.T.crashDamage);
    // chi ascolta (Vigilessa, cabina della corrente) può prendersi lo schianto: gestito = true
    const ev = { mezzo: v.id, tipo: v.kind, danno: dmg, x: v.st.x, z: v.st.z, velocita: speed, gestito: false };
    this.game.emit('urto', ev);
    if (ev.gestito) return;
    this.ui.shake(); this.audio.sfx('crash');
    if (!dmg) return;
    v.st.cond = clamp(v.st.cond - dmg, 0, 100);
    const s = this.s;
    if (v.kind === 'vespa') {
      const fall = speed >= v.T.fallSpeed || v.st.cond <= 0;
      if (fall) {
        s.health = clamp(s.health - 6, 0, s.maxHealth || 100); s.stress = clamp(s.stress + 4, 0, 100);
        this.ui.toast(`Botta! Garonio vola giù dalla Vespa. Vita -6, Vespa -${dmg}%`, 'bad');
      } else this.ui.toast(`Strisciata! Vespa -${dmg}%`, 'bad');
      if (v.st.cond <= 0) this.ui.toast('La Vespa non ne vuole più sapere. Serve l\'officina.', 'bad');
      if (fall) this.dismount(true);
      return;
    }
    if (v.kind === 'punto') {
      s.stress = clamp(s.stress + 3, 0, 100);
      let msg = `Sbam! Un'altra ammaccatura sulla Punto (-${dmg}%)`;
      if (!v.st.flat && Math.random() < v.T.flatChance * this._mod(v).fora) { v.st.flat = true; msg += ' e una gomma a terra!'; }
      this.ui.toast(msg, 'bad');
      if (v.st.cond <= 0) { this.ui.toast('La Punto si spegne e non riparte più.', 'bad'); this.dismount(true); }
      return;
    }
    // trattore
    s.stress = clamp(s.stress + 4, 0, 100);
    this.game.attrezzi?.urto(v, dmg);
    if (v.st.cond <= 0) this._breakTractor(v, 'CRACK! Qualcosa si è spezzato sotto il trattore. Il motore fuma!');
    else this.ui.toast(`Hai urtato col trattore! Stato -${dmg}%. Se lo rompi, il Gigante...`, 'bad');
  }

  _breakTractor(v, msg) {
    v.st.cond = 0; v.speed = 0;
    this.audio.sfx('crash');
    this.ui.toast(msg, 'bad');
    this.dismount(true);
    this.s.today.trattoriRotti = (this.s.today.trattoriRotti || 0) + 1;
    this.game.mountain('trattore', 35);
  }

  // il trattore ara le zolle del campo dove passa
  _plow(v) {
    const tx = Math.floor(v.st.x), tz = Math.floor(v.st.z);
    const area = this.world.areaAt(tx, tz);
    if (area !== 'field') return;
    const key = tx + ',' + tz, s = this.s;
    if (s.plots[key]) return;
    s.plots[key] = { crop: null, stage: 0, water: false, g: 0 };
    this.world.setPlot(tx, tz, s.plots[key]);
    s.tired = clamp(s.tired + 0.3, 0, 100); s.minutes += 1;
    v.plowed = (v.plowed || 0) + 1;
    if (v.plowed % 3 === 0) this.game._xp?.(1);
    if (v.plowed % 6 === 1) this.audio.sfx('dig');
  }

  _scareNutrie(v) {
    if (Math.abs(v.speed) < 1.5) return;
    for (const n of this.game.nutrie) if (n.state !== 'flee' && Math.hypot(n.x - v.st.x, n.z - v.st.z) < 1.6) {
      this.game._flee(n, true); this.ui.float('Sciò! Le nutrie odiano i motori.');
    }
  }

  // Ogni fotogramma: animazioni, fumo, HUD (anche quando c'è un dialogo aperto)
  animate(dt) {
    this.t += dt;
    const busy = this.ui.busy() || this.game.locked;
    for (const v of this.list) {
      if (busy && v === this.driving) v.speed = 0;
      this._pose(v);
      // vibrazione del motore e sobbalzi
      const on = v === this.driving;
      const bob = on ? ((Math.floor(this.t * (Math.abs(v.speed) > 0.5 ? 14 : 8)) % 2) / VPX) : 0;
      v.spr.position.y = bob;
      // fumo dallo scarico quando è acceso, fumo nero quando è rotto
      v.puffT -= dt;
      if (v.puffT <= 0 && (on || v.st.cond <= 0)) {
        v.puffT = v.st.cond <= 0 ? 0.35 : on ? (Math.abs(v.speed) > 0.5 ? 0.18 : 0.45) : 1;
        const back = v.view === 'R' ? -1 : v.view === 'L' ? 1 : 0;
        const w = v.spr.scale.x;
        const tall = v.kind === 'trattore' && v.st.cond > 0;
        const x = v.st.x + (tall ? -back * w * 0.2 : back * w * 0.45), z = v.st.z + (v.view === 'B' ? 0.3 : v.view === 'F' ? -0.3 : 0.05);
        const y = v.st.cond <= 0 ? v.spr.scale.y * 0.55 : tall ? v.spr.scale.y * 0.78 : 0.25;
        this._puff(x, y, z, v.st.cond <= 0 || v.kind === 'trattore');
      }
    }
    for (const p of [...this.puffs]) {
      p.life -= dt;
      p.s.position.y += dt * 0.7; p.s.position.x += dt * 0.2;
      const k = 1 - p.life / p.max;
      p.s.scale.setScalar(0.3 + k * 0.5);
      p.s.material.opacity = Math.max(0, 0.8 * (1 - k));
      if (p.life <= 0) { this.world.scene.remove(p.s); p.s.material.dispose(); this.puffs.splice(this.puffs.indexOf(p), 1); }
    }
    this._updateHud();
  }

  _puff(x, y, z, dark) {
    if (this.puffs.length > 40) return;
    this._puffTex ??= [toTexture(smokePuff(false)), toTexture(smokePuff(true))];
    const mat = new THREE.SpriteMaterial({ map: this._puffTex[dark ? 1 : 0], transparent: true, depthWrite: false, opacity: 0.8 });
    const s = new THREE.Sprite(mat);
    s.position.set(x, y, z); s.scale.setScalar(0.3);
    this.world.scene.add(s);
    this.puffs.push({ s, life: 1.1, max: 1.1 });
  }

  // ---------- Officina ----------
  workshopChoices() {
    if (this.game.officina) return this.game.officina.scelte(); // Zeno (src/officina.js)
    const s = this.s, out = [];
    const pay = (price, minutes, fx, msg) => () => {
      s.money -= price; s.minutes += minutes; fx(); this.audio.sfx('coin'); this.ui.toast(msg, 'good');
    };
    for (const v of this.list) {
      const T = v.T, st = v.st, name = v.id === 'trattore1' ? 'Trattore rosso' : v.id === 'trattore2' ? 'Trattore verde' : T.name;
      if (st.cond < 100) {
        const price = st.cond <= 0 ? T.repair.price : Math.ceil(T.repair.price * (100 - st.cond) / 100);
        const minutes = st.cond <= 0 ? T.repair.minutes : Math.max(15, Math.round(T.repair.minutes * (100 - st.cond) / 100 / 15) * 15);
        out.push({
          label: `Ripara ${name} (${price}€, ${minutes >= 60 ? minutes / 60 + 'h' : minutes + ' min'})${st.cond <= 0 ? ': ROTTO' : `: stato ${Math.round(st.cond)}%`}`,
          disabled: s.money < price,
          fn: pay(price, minutes, () => { st.cond = 100; }, `${name} sistemato. Più o meno.`),
        });
      }
      if (v.kind === 'punto' && st.flat) out.push({ label: `Cambia la gomma della Punto (${T.tyre.price}€)`, disabled: s.money < T.tyre.price, fn: pay(T.tyre.price, T.tyre.minutes, () => { st.flat = false; }, 'Gomma nuova. Le altre tre pregano.') });
      if (v.kind === 'punto' && st.fuel < 95) out.push({ label: `Pieno alla Punto (${T.refuel.price}€): benzina ${Math.round(st.fuel)}%`, disabled: s.money < T.refuel.price, fn: pay(T.refuel.price, T.refuel.minutes, () => { st.fuel = 100; }, 'Pieno fatto. La Punto ringrazia.') });
    }
    return out;
  }

  // Garonio crolla mentre guida
  crashAsleep() {
    const v = this.driving; if (!v) return;
    v.st.cond = clamp(v.st.cond - 35, 0, 100);
    this.ui.toast(`Garonio si addormenta al volante! ${v.T.name} -35%`, 'bad');
    this.dismount(true);
  }

  // Quando Garonio viene "teletrasportato" (dormire, svenire): il mezzo resta dov'è
  leave() {
    if (!this.driving) return;
    const v = this.driving;
    this.driving = null; this.s.driving = null; v.speed = 0;
    this.game.player.group.visible = true;
    this._pose(v); this._updateHud();
  }
}
