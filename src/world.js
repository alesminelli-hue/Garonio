// Il mondo: mappa, edifici, terreno e sprite.
import * as THREE from 'three';
import * as PIX from './pixel.js';

export const MAP_W = 40, MAP_H = 30;

// Zone coltivabili e speciali (coordinate in caselle, x1/z1 esclusi)
export const AREAS = {
  field: { x0: 12, x1: 28, z0: 4, z1: 10, crop: 'mais', name: 'Campo' },
  orto: { x0: 13, x1: 19, z0: 20, z1: 23, crop: 'pomodoro', name: 'Orto' },
  coop: { x0: 22, x1: 29, z0: 20, z1: 26, name: 'Pollaio' },
};

export const BUILDINGS = [
  { id: 'casa', label: 'CASA', x0: 15, z0: 12, w: 5, d: 4, h: 2.6, wall: 'casa', roof: '#b8432e', windows: 2 },
  { id: 'officina', label: 'OFFICINA', x0: 23, z0: 12, w: 5, d: 4, h: 2.8, wall: 'metallo', roof: '#6a7078', windows: 1 },
  { id: 'bar', label: 'BAR', x0: 4, z0: 12, w: 5, d: 4, h: 2.6, wall: 'bar', roof: '#3a7a4a', windows: 2 },
  { id: 'maiali', label: 'MAIALI (presto)', x0: 31, z0: 20, w: 6, d: 5, h: 2.4, wall: 'metallo', roof: '#8a4a32', windows: 0 },
  { id: 'gallinaio', label: '', x0: 26, z0: 20.5, w: 2.5, d: 2, h: 1.4, wall: 'legno', roof: '#7a4a26', windows: 0, noDoor: true },
];

export class World {
  constructor(scene) {
    this.scene = scene;
    this.tint = new THREE.Color(1, 1, 1);
    this.spriteMats = new Set();
    this.solids = [];        // rettangoli di collisione {x0,z0,x1,z1}
    this.grid = [];
    this.cropSprites = new Map();
    this.cropTex = {};
  }

  build() {
    this._makeGrid();
    this._makeGround();
    this._makeLights();
    BUILDINGS.forEach(b => this._makeBuilding(b));
    this._makeFence();
    this._makeTrees();
    this._makeProps();
    // bordi mappa e canale
    this.solids.push({ x0: -5, z0: -5, x1: MAP_W + 5, z1: 0.6 });
    this.solids.push({ x0: -5, z0: -5, x1: 0.6, z1: MAP_H + 5 });
    this.solids.push({ x0: MAP_W - 0.6, z0: -5, x1: MAP_W + 5, z1: MAP_H + 5 });
    this.solids.push({ x0: -5, z0: MAP_H - 0.6, x1: MAP_W + 5, z1: MAP_H + 5 });
    this.solids.push({ x0: 0, z0: 1, x1: MAP_W, z1: 3 }); // canale
  }

  _makeGrid() {
    for (let z = 0; z < MAP_H; z++) {
      const row = [];
      for (let x = 0; x < MAP_W; x++) {
        let ch = 'g';
        if (z >= 1 && z < 3) ch = 'w';
        if (z >= 17 && z < 19) ch = 'p';
        if (x >= 21 && x < 23 && z >= 10 && z < 17) ch = 'p';
        if (x >= 24 && x < 26 && z >= 19 && z < 20) ch = 'p';
        if (x >= 16 && x < 17 && z >= 19 && z < 20) ch = 'p';
        if (x >= 33 && x < 35 && z >= 19 && z < 20) ch = 'p';
        for (const k of ['field', 'orto']) { const a = AREAS[k]; if (x >= a.x0 && x < a.x1 && z >= a.z0 && z < a.z1) ch = k[0]; }
        const c = AREAS.coop; if (x >= c.x0 && x < c.x1 && z >= c.z0 && z < c.z1) ch = 'c';
        row.push(ch);
      }
      this.grid.push(row);
    }
  }

  _makeGround() {
    const [c, g] = PIX.makeCanvas(MAP_W * PIX.PX, MAP_H * PIX.PX);
    this.groundCanvas = c; this.groundCtx = g;
    for (let z = 0; z < MAP_H; z++) for (let x = 0; x < MAP_W; x++) this.paint(x, z, null);
    this.groundTex = PIX.toTexture(c);
    const geo = new THREE.PlaneGeometry(MAP_W, MAP_H);
    geo.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: this.groundTex }));
    mesh.position.set(MAP_W / 2, 0, MAP_H / 2);
    this.scene.add(mesh);
    // fondale oltre i bordi
    const far = new THREE.Mesh(new THREE.PlaneGeometry(200, 200).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: '#3f7a2e' }));
    far.position.set(MAP_W / 2, -0.02, MAP_H / 2);
    this.scene.add(far);
  }

  paint(x, z, plot) {
    PIX.paintTile(this.groundCtx, this.grid[z][x], x, z, x * 131 + z * 977 + 7, plot);
    if (this.groundTex) this.groundTex.needsUpdate = true;
  }

  _makeLights() {
    this.amb = new THREE.AmbientLight(0xffffff, 1.6);
    this.sun = new THREE.DirectionalLight(0xfff2d8, 1.6);
    this.sun.position.set(-10, 20, 14);
    this.scene.add(this.amb, this.sun);
  }

  _makeBuilding(b) {
    const front = PIX.toTexture(PIX.wallTexture(b.wall, b.w, b.h, !b.noDoor, b.windows));
    const side = PIX.toTexture(PIX.wallTexture(b.wall, b.d, b.h, false, b.id === 'casa' ? 1 : 0));
    const back = PIX.toTexture(PIX.wallTexture(b.wall, b.w, b.h, false, 0));
    const M = t => new THREE.MeshLambertMaterial({ map: t });
    const box = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), [M(side), M(side), M(back), M(back), M(front), M(back)]);
    box.position.set(b.x0 + b.w / 2, b.h / 2, b.z0 + b.d / 2);
    this.scene.add(box);
    // tetto a capanna
    const o = 0.3, rh = b.d * 0.45;
    const shape = new THREE.Shape();
    shape.moveTo(-b.d / 2 - o, 0); shape.lineTo(b.d / 2 + o, 0); shape.lineTo(0, rh); shape.lineTo(-b.d / 2 - o, 0);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: b.w + o * 2, bevelEnabled: false });
    geo.rotateY(Math.PI / 2);
    const rt = PIX.toTexture(PIX.roofTexture(b.roof), true);
    rt.repeat.set(1, 1);
    const roof = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: rt }));
    roof.position.set(b.x0 - o, b.h, b.z0 + b.d / 2);
    this.scene.add(roof);
    // insegna
    if (b.label) {
      const sc = PIX.sign(b.label);
      const s = this.sprite(sc, { anchorBottom: false, lit: true });
      s.position.set(b.x0 + b.w / 2, b.h - 0.5, b.z0 + b.d + 0.36);
      this.scene.add(s);
    }
    this.solids.push({ x0: b.x0, z0: b.z0, x1: b.x0 + b.w, z1: b.z0 + b.d });
    b.mats = [...box.material, roof.material];
    b.mats.forEach(m => { m.transparent = true; });
    b.door = { x: b.x0 + b.w / 2, z: b.z0 + b.d + 0.5 };
  }

  _makeFence() {
    const c = AREAS.coop;
    const mat = new THREE.MeshLambertMaterial({ color: '#c8a070' });
    const post = new THREE.MeshLambertMaterial({ color: '#8a6038' });
    const seg = (x0, z0, x1, z1) => {
      const len = Math.hypot(x1 - x0, z1 - z0);
      const horiz = z0 === z1;
      for (const y of [0.25, 0.55]) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(horiz ? len : 0.08, 0.08, horiz ? 0.08 : len), mat);
        m.position.set((x0 + x1) / 2, y, (z0 + z1) / 2); this.scene.add(m);
      }
      for (let i = 0; i <= Math.round(len); i++) {
        const t = len ? i / Math.round(len) : 0;
        const p = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.75, 0.12), post);
        p.position.set(x0 + (x1 - x0) * t, 0.37, z0 + (z1 - z0) * t); this.scene.add(p);
      }
      this.solids.push({ x0: Math.min(x0, x1) - 0.08, z0: Math.min(z0, z1) - 0.08, x1: Math.max(x0, x1) + 0.08, z1: Math.max(z0, z1) + 0.08 });
    };
    seg(c.x0, c.z0, 24, c.z0); seg(26, c.z0, c.x1, c.z0);           // lato nord con cancello
    seg(c.x0, c.z1, c.x1, c.z1);
    seg(c.x0, c.z0, c.x0, c.z1); seg(c.x1, c.z0, c.x1, c.z1);
  }

  _makeTrees() {
    const R = PIX.rng(42);
    const texs = [1, 2, 3].map(s => PIX.toTexture(PIX.tree(s)));
    const free = (x, z) => {
      if (this.grid[z][x] !== 'g') return false;
      for (const s of this.solids) if (x + 1 > s.x0 - 1 && x < s.x1 + 1 && z + 1 > s.z0 - 1 && z < s.z1 + 1) return false;
      return true;
    };
    const spots = [];
    for (let x = 0; x < MAP_W; x += 2) { spots.push([x, 0]); spots.push([x, MAP_H - 1]); spots.push([x + 1, MAP_H - 2]); }
    for (let z = 3; z < MAP_H; z += 2) { spots.push([0, z]); spots.push([MAP_W - 1, z]); spots.push([1, z + 1]); spots.push([MAP_W - 2, z + 1]); }
    for (let i = 0; i < 26; i++) spots.push([R() * MAP_W | 0, 3 + (R() * (MAP_H - 4) | 0)]);
    for (const [x, z] of spots) {
      if (x < 0 || z < 0 || x >= MAP_W || z >= MAP_H) continue;
      if (z > 0 && z < MAP_H - 2 && x > 1 && x < MAP_W - 2 && !free(x, z)) continue;
      if (this.grid[z][x] !== 'g') continue;
      const s = this.sprite(texs[(R() * 3) | 0], { w: 2, h: 2.75 });
      s.position.set(x + 0.5 + (R() - 0.5) * 0.4, 0, z + 0.5 + (R() - 0.5) * 0.4);
      this.scene.add(s);
      this.solids.push({ x0: s.position.x - 0.3, z0: s.position.z - 0.2, x1: s.position.x + 0.3, z1: s.position.z + 0.2 });
    }
    const bt = PIX.toTexture(PIX.bush());
    for (let i = 0; i < 18; i++) {
      const x = 2 + (R() * (MAP_W - 4) | 0), z = 3 + (R() * (MAP_H - 5) | 0);
      if (!free(x, z)) continue;
      const s = this.sprite(bt, { w: 1, h: 0.62 });
      s.position.set(x + 0.5, 0, z + 0.5); this.scene.add(s);
    }
  }

  _makeProps() {
    this.props = {};
    const crate = this.sprite(PIX.toTexture(PIX.crate()), { w: 1, h: 0.875 });
    crate.position.set(15.9, 0, 16.6); this.scene.add(crate);
    this.props.cassa = { x: 15.9, z: 16.6 };
    this.solids.push({ x0: 15.5, z0: 16.3, x1: 16.3, z1: 16.8 });
    const tr = this.sprite(PIX.toTexture(PIX.trough()), { w: 1, h: 0.5 });
    tr.position.set(23.5, 0, 24.5); this.scene.add(tr);
    this.props.mangiatoia = { x: 23.5, z: 24.5 };
  }

  // ---------- Sprite ----------
  sprite(canvasOrTex, { w, h, anchorBottom = true, lit = true } = {}) {
    const map = canvasOrTex.isTexture ? canvasOrTex : PIX.toTexture(canvasOrTex);
    const img = map.image;
    const mat = new THREE.SpriteMaterial({ map, alphaTest: 0.5, transparent: false });
    const s = new THREE.Sprite(mat);
    s.scale.set(w ?? img.width / PIX.PX, h ?? img.height / PIX.PX, 1);
    if (anchorBottom) s.center.set(0.5, 0);
    if (lit) { this.spriteMats.add(mat); mat.color.copy(this.tint); }
    return s;
  }

  // Personaggio o animale animato con ombra
  actor(frames, opts = {}) {
    const texs = frames.map(f => PIX.toTexture(f));
    const group = new THREE.Group();
    const spr = this.sprite(texs[0], opts);
    group.add(spr);
    const r = opts.shadow ?? spr.scale.x * 0.35;
    const sh = new THREE.Mesh(new THREE.CircleGeometry(r, 12).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28, depthWrite: false }));
    sh.position.y = 0.02; sh.scale.z = 0.6;
    group.add(sh);
    this.scene.add(group);
    return {
      group, spr, texs, frame: 0,
      setFrame(i) { if (i !== this.frame) { this.frame = i; spr.material.map = texs[i]; } },
      remove: () => { this.scene.remove(group); this.spriteMats.delete(spr.material); },
    };
  }

  // ---------- Colture ----------
  setPlot(x, z, plot) {
    this.paint(x, z, plot);
    const key = x + ',' + z;
    const old = this.cropSprites.get(key);
    const stage = plot && plot.crop ? plot.stage : 0;
    if (old && old.userData.stage === stage && old.userData.crop === plot?.crop) return;
    if (old) { this.scene.remove(old); this.spriteMats.delete(old.material); this.cropSprites.delete(key); }
    if (stage > 0) {
      const tk = plot.crop + stage;
      this.cropTex[tk] ??= PIX.toTexture(PIX.crop(plot.crop, stage));
      const s = this.sprite(this.cropTex[tk], { w: 0.875, h: 1.125 });
      s.position.set(x + 0.5, 0, z + 0.55);
      s.userData = { stage, crop: plot.crop };
      this.scene.add(s);
      this.cropSprites.set(key, s);
    }
  }

  // Rende trasparenti gli edifici quando Garonio ci passa dietro
  updateOcclusion(px, pz) {
    for (const b of BUILDINGS) {
      if (!b.mats) continue;
      const behind = px > b.x0 - 0.6 && px < b.x0 + b.w + 0.6 && pz < b.z0 + b.d - 0.2 && pz > b.z0 - 5.5;
      const target = behind ? 0.35 : 1;
      for (const m of b.mats) {
        m.opacity += (target - m.opacity) * 0.2;
        m.depthWrite = m.opacity > 0.95;
      }
    }
  }

  // ---------- Utilità ----------
  tile(x, z) { return this.grid[z]?.[x]; }

  areaAt(x, z) {
    for (const [k, a] of Object.entries(AREAS)) if (x >= a.x0 && x < a.x1 && z >= a.z0 && z < a.z1) return k;
    return null;
  }

  blocked(x, z, r = 0.28) {
    for (const s of this.solids) if (x + r > s.x0 && x - r < s.x1 && z + r * 0.6 > s.z0 && z - r * 0.6 < s.z1) return true;
    return false;
  }

  // Luce del giorno: k = 0 (notte) .. 1 (pieno giorno); warm = tramonto
  setDaylight(k, warm = 0) {
    const night = new THREE.Color('#5868a8'), day = new THREE.Color('#ffffff'), dusk = new THREE.Color('#ffb070');
    this.tint.copy(night).lerp(day, k).lerp(dusk, warm * 0.5);
    this.amb.color.copy(this.tint); this.amb.intensity = 0.7 + 0.9 * k;
    this.sun.intensity = 0.3 + 1.3 * k;
    for (const m of this.spriteMats) m.color.copy(this.tint);
  }
}
