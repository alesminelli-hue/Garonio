// Il mondo: mappa, edifici, terreno e sprite.
import * as THREE from 'three';
import * as PIX from './pixel.js';
import * as HDE from './hd/edifici.js';
import * as HDO from './hd/oggetti.js';
import * as HDF from './hd/fogli.js';
import { MAP_W, MAP_H, AREAS, BUILDINGS, ZONES, ROADS, PROPS, PLACES, CANAL, PONTI_FIUME, buildTileGrid, inZone } from './map.js';

// I dati della mappa (luoghi, strade, zone) stanno in map.js.
export { MAP_W, MAP_H, AREAS, BUILDINGS } from './map.js';

// Margine laterale dei muri: il raggio di collisione (0.28) è più stretto della figura disegnata,
// e senza questo la spalla e il braccio entravano nei fianchi degli edifici e nei mobili.
export const SPALLE = 0.2;

// Sprite «in piedi» per la profondità. Gli sprite di three.js sono rivolti alla camera, che guarda
// dall'alto in diagonale: la loro parte alta pende all'indietro e, davanti a un muro o a un mobile,
// la testa di Garonio finisce dentro il muro e sparisce (sembra risucchiato). Qui l'immagine resta
// identica sullo schermo, ma la profondità di ogni vertice viene presa da un piano verticale che
// passa per i piedi: chi sta davanti a un muro resta tutto davanti, chi sta dietro resta dietro.
// (Vale per tutti gli sprite; la metà sotto l'ancora, negli sprite centrati, resta com'era.)
if (!THREE.ShaderLib.sprite.vertexShader.includes('spriteInPiedi')) {
  THREE.ShaderLib.sprite.vertexShader = THREE.ShaderLib.sprite.vertexShader.replace(
    'gl_Position = projectionMatrix * mvPosition;',
    `vec3 spriteInPiedi = viewMatrix[ 1 ].xyz;            // il «su» del mondo visto dalla camera
	vec3 nPiano = vec3( 0.0, - spriteInPiedi.z, spriteInPiedi.y ); // normale del piano verticale rivolto alla camera
	float dPiano = dot( nPiano, mvPosition.xyz );
	float tPiano = dot( nPiano, modelViewMatrix[ 3 ].xyz ) / ( abs( dPiano ) < 1e-5 ? 1e-5 : dPiano );
	vec4 mvProf = vec4( mvPosition.xyz * clamp( tPiano, 0.5, 1.0 ), 1.0 );
	vec4 clipProf = projectionMatrix * mvProf;
	gl_Position = projectionMatrix * mvPosition;
	gl_Position.z = clipProf.z / clipProf.w * gl_Position.w;`);
}

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
    this.grid = buildTileGrid();
    this._makeGround();
    this._makeLights();
    BUILDINGS.forEach(b => this._makeBuilding(b));
    this._makeFences();
    this._makeBridges();
    this._makeTrees();
    this._makeProps();
    this._setupShadows();
    // bordi mappa
    this.solids.push({ x0: -5, z0: -5, x1: MAP_W + 5, z1: 0.6 });
    this.solids.push({ x0: -5, z0: -5, x1: 0.6, z1: MAP_H + 5 });
    this.solids.push({ x0: MAP_W - 0.6, z0: -5, x1: MAP_W + 5, z1: MAP_H + 5 });
    this.solids.push({ x0: -5, z0: MAP_H - 0.6, x1: MAP_W + 5, z1: MAP_H + 5 });
    // canale (con i varchi dei ponti) e acque ferme
    let cx = 0;
    for (const br of [...CANAL.bridges].sort((a, b) => a.x0 - b.x0)) {
      this.solids.push({ x0: cx, z0: CANAL.z0 - 2, x1: br.x0, z1: CANAL.z1 - 0.2 });
      cx = br.x1;
    }
    this.solids.push({ x0: cx, z0: CANAL.z0 - 2, x1: MAP_W, z1: CANAL.z1 - 0.2 });
    for (const zn of ZONES) if (zn.solid) {
      for (let z = zn.z0; z < zn.z1; z++) {
        let a = null;
        for (let x = zn.x0; x <= zn.x1; x++) {
          const on = x < zn.x1 && inZone(zn, x, z) && this.grid[z]?.[x] !== 'b';   // i ponti dei sentieri restano liberi
          if (on && a === null) a = x;
          if (!on && a !== null) { this.solids.push({ x0: a + 0.15, z0: z + 0.15, x1: x - 0.15, z1: z + 0.85 }); a = null; }
        }
      }
    }
  }

  _makeGround() {
    const [c, g] = PIX.makeCanvas(MAP_W * PIX.PX, MAP_H * PIX.PX);
    this.groundCanvas = c; this.groundCtx = g;
    for (let z = 0; z < MAP_H; z++) for (let x = 0; x < MAP_W; x++) this.paint(x, z, null);
    this._paintRoadMarks(g);
    this.groundTex = PIX.toTexture(c);
    const geo = new THREE.PlaneGeometry(MAP_W, MAP_H);
    geo.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: this.groundTex }));
    mesh.position.set(MAP_W / 2, 0, MAP_H / 2);
    this.scene.add(mesh);
    // fondale oltre i bordi
    const far = new THREE.Mesh(new THREE.PlaneGeometry(MAP_W + 400, MAP_H + 400).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: '#3f7a2e' }));
    far.position.set(MAP_W / 2, -0.02, MAP_H / 2);
    this.scene.add(far);
  }

  // Strisce bianche sull'asfalto (solo tratti dritti orizzontali o verticali).
  _paintRoadMarks(g) {
    const P = PIX.PX;
    for (const r of ROADS) {
      if (r.type !== 'asfalto') continue;
      for (let i = 0; i < r.points.length - 1; i++) {
        const [ax, az] = r.points[i], [bx, bz] = r.points[i + 1];
        const horiz = Math.abs(bz - az) < 1e-6, half = r.width / 2;
        if (!horiz && Math.abs(bx - ax) > 1e-6) continue;
        const lo = Math.max(0, Math.min(horiz ? ax : az, horiz ? bx : bz)) * P;
        const hi = Math.min(horiz ? MAP_W : MAP_H, Math.max(horiz ? ax : az, horiz ? bx : bz)) * P;
        const c = (horiz ? az : ax) * P;
        g.fillStyle = '#e8e8e0';
        for (let t = lo; t < hi; t += 2) {
          const edge = [c - half * P + 2, c + half * P - 3];
          for (const e of edge) horiz ? g.fillRect(t, e, 2, 1) : g.fillRect(e, t, 1, 2);
        }
        g.fillStyle = '#f0f0e8';
        for (let t = lo + 4; t < hi; t += 24) horiz ? g.fillRect(t, c - 1, 12, 2) : g.fillRect(c - 1, t, 2, 12);
        // incroci: niente strisce dove entra un'altra strada
        g.fillStyle = '#5a5e66';
        for (const o of ROADS) if (o !== r && horiz) o.points.forEach(([px, pz], k) => {
          if (Math.abs(pz - az) > half + 0.01) return;
          const nb = o.points[k + 1] || o.points[k - 1];
          const e = nb[1] < az ? (az - half) * P + 1 : (az + half) * P - 4;
          g.fillRect((px - o.width / 2) * P, e, o.width * P, 3);
        });
      }
    }
  }

  paint(x, z, plot) {
    PIX.paintTile(this.groundCtx, this.grid[z][x], x, z, x * 131 + z * 977 + 7, plot, this.grid);
    if (!plot) PIX.blendTile(this.groundCtx, this.grid, x, z);
    if (this.groundTex) this.groundTex.needsUpdate = true;
  }

  _makeLights() {
    // luce in stile HD-2D: cielo azzurro dall'alto, riflesso caldo della terra dal basso, sole che fa ombre morbide
    this.amb = new THREE.AmbientLight(0xffffff, 0.8);
    this.hemi = new THREE.HemisphereLight(0xcfe8ff, 0x6a5a30, 0.9);
    this.sun = new THREE.DirectionalLight(0xffe2b0, 2.2);
    this.sun.position.set(-10, 20, 14);
    const sh = this.sun.shadow;
    this.sun.castShadow = true;
    sh.mapSize.set(2048, 2048);
    Object.assign(sh.camera, { left: -24, right: 24, top: 24, bottom: -24, near: 1, far: 90 });
    sh.bias = -0.0008; sh.normalBias = 0.02; sh.radius = 4;
    this.sunOff = new THREE.Vector3(-10, 20, 8);
    this.scene.add(this.amb, this.hemi, this.sun, this.sun.target);
  }

  // Il sole (e la sua zona d'ombra) segue Garonio, così le ombre restano nitide vicino a lui.
  followSun(x, z) {
    this.sun.position.set(x + this.sunOff.x, this.sunOff.y, z + this.sunOff.z);
    this.sun.target.position.set(x, 0, z);
  }

  // Dopo aver costruito tutto: gli oggetti 3D fanno ombra, il terreno la riceve.
  _setupShadows() {
    this.scene.traverse(o => {
      if (!o.isMesh) return;
      const flat = o.geometry.type === 'PlaneGeometry' || o.geometry.type === 'CircleGeometry';
      o.castShadow = !flat; o.receiveShadow = true;
    });
  }

  // Ombra morbida dipinta sul terreno sotto alberi e cespugli (gli sprite non fanno ombra da soli).
  _paintBlobShadow(x, z, rx, rz) {
    const g = this.groundCtx, P = PIX.PX;
    const cx = (x + 0.15) * P, cz = (z - 0.05) * P;
    for (const [k, a] of [[1, 0.10], [0.75, 0.10], [0.5, 0.10]]) {
      g.fillStyle = `rgba(20,30,10,${a})`;
      g.beginPath(); g.ellipse(Math.round(cx), Math.round(cz), rx * P * k, rz * P * k, 0, 0, Math.PI * 2); g.fill();
    }
  }

  _makeBuilding(b) {
    // facciate e tetti disegnati in src/hd/edifici.js
    const hd = HDE.texEdificio(b);
    const front = PIX.toTexture(hd.front), side = PIX.toTexture(hd.side), back = PIX.toTexture(hd.back);
    const M = t => new THREE.MeshLambertMaterial({ map: t });
    const box = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), [M(side), M(side), M(back), M(back), M(front), M(back)]);
    box.position.set(b.x0 + b.w / 2, b.h / 2, b.z0 + b.d / 2);
    this.scene.add(box);
    // tetto: a capanna (di serie), a cuspide (campanile, torri) o piatto coi merli (castello)
    // con la facciata disegnata il tetto 3D non sporge davanti (la gronda coprirebbe la facciata)
    const fac = HDF.foglio('f:' + b.id);
    const o = fac ? 0.02 : 0.3, rh = b.d * 0.45;
    const rt = PIX.toTexture(hd.roof, true);
    rt.repeat.set(1, 1);
    let roof;
    if (b.tetto === 'merli') {
      const pm = side.clone(); pm.needsUpdate = true;
      roof = new THREE.Group();
      const top = new THREE.Mesh(new THREE.BoxGeometry(b.w, 0.12, b.d), new THREE.MeshLambertMaterial({ color: '#8a8476' }));
      top.position.set(b.w / 2, 0.06, b.d / 2); roof.add(top);
      const mm = new THREE.MeshLambertMaterial({ map: pm });
      const n = Math.max(2, Math.round(b.w / 0.9)), nz = Math.max(2, Math.round(b.d / 0.9));
      for (let i = 0; i < n; i += 2) for (const z of [0.18, b.d - 0.18]) { const m = new THREE.Mesh(new THREE.BoxGeometry(b.w / n, 0.5, 0.36), mm); m.position.set((i + 0.5) * b.w / n, 0.25, z); roof.add(m); }
      for (let i = 0; i < nz; i += 2) for (const x of [0.18, b.w - 0.18]) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.5, b.d / nz), mm); m.position.set(x, 0.25, (i + 0.5) * b.d / nz); roof.add(m); }
      roof.position.set(b.x0, b.h, b.z0);
      roof.material = top.material;
    } else if (b.tetto === 'cuspide') {
      const r = Math.max(b.w, b.d) / 2 * 1.42 + 0.1;
      const geo = new THREE.ConeGeometry(r, Math.max(b.w, b.d) * 1.1, 4, 1);
      geo.rotateY(Math.PI / 4);
      roof = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: rt }));
      roof.scale.set(b.w / Math.max(b.w, b.d), 1, b.d / Math.max(b.w, b.d));
      roof.position.set(b.x0 + b.w / 2, b.h + Math.max(b.w, b.d) * 0.55, b.z0 + b.d / 2);
    } else {
      const shape = new THREE.Shape();
      shape.moveTo(-b.d / 2 - o, 0); shape.lineTo(b.d / 2 + o, 0); shape.lineTo(0, rh); shape.lineTo(-b.d / 2 - o, 0);
      const geo = new THREE.ExtrudeGeometry(shape, { depth: b.w + o * 2, bevelEnabled: false });
      geo.rotateY(Math.PI / 2);
      roof = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: rt }));
      roof.position.set(b.x0 - o, b.h, b.z0 + b.d / 2);
    }
    this.scene.add(roof);
    // facciata disegnata (tools/fogli/taglia_fogli.py): una «finta facciata» davanti al muro, col suo tetto dipinto
    let facMat = null;
    if (fac) {
      const cw = b.w * 1.08, ch = cw * fac.height / fac.width;
      facMat = new THREE.MeshLambertMaterial({ map: PIX.toTexture(fac), alphaTest: 0.5 });
      const pl = new THREE.Mesh(new THREE.PlaneGeometry(cw, ch), facMat);
      pl.position.set(b.x0 + b.w / 2, ch / 2, b.z0 + b.d + 0.04);
      this.scene.add(pl);
    }
    // insegna
    if (b.label && !hd.insegna && !fac) {
      const sc = PIX.sign(b.label);
      const s = this.sprite(sc, { anchorBottom: false, lit: true });
      s.position.set(b.x0 + b.w / 2, b.h - 0.5, b.z0 + b.d + 0.36);
      this.scene.add(s);
    }
    // px: margine in più sui fianchi, perché lo sprite (braccia comprese) è più largo del raggio di collisione
    this.solids.push({ x0: b.x0, z0: b.z0, x1: b.x0 + b.w, z1: b.z0 + b.d, px: SPALLE });
    b.mats = [...box.material, roof.material, ...(facMat ? [facMat] : [])];
    b.mats.forEach(m => { m.transparent = true; });
    // porta: true (o uno spostamento sulla x) = edificio di facciata in cui però si entra (src/dentro.js)
    if (!b.decor || b.porta) b.door = { x: b.x0 + b.w / 2 + (typeof b.porta === 'number' ? b.porta : 0), z: b.z0 + b.d + 0.5 };
  }

  // Staccionate: pollaio e recinto dei maiali, con un cancello aperto sul lato nord.
  _makeFences() {
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
    const pens = [AREAS.coop, ...ZONES.filter(z => z.fence)];
    for (const c of pens) {
      const [g0, g1] = c.gate;
      seg(c.x0, c.z0, g0, c.z0); seg(g1, c.z0, c.x1, c.z0);
      seg(c.x0, c.z1, c.x1, c.z1);
      seg(c.x0, c.z0, c.x0, c.z1); seg(c.x1, c.z0, c.x1, c.z1);
    }
  }

  // Parapetti di legno sui ponti del canale.
  _makeBridges() {
    const mat = new THREE.MeshLambertMaterial({ color: '#7a5430' });
    for (const br of CANAL.bridges) for (const x of [br.x0 - 0.05, br.x1 + 0.05]) {
      const len = CANAL.z1 - CANAL.z0 + 1;
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, len), mat);
      rail.position.set(x, 0.55, (CANAL.z0 + CANAL.z1) / 2); this.scene.add(rail);
      for (let i = 0; i <= len; i += 1) {
        const p = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.6, 0.14), mat);
        p.position.set(x, 0.3, CANAL.z0 - 0.5 + i); this.scene.add(p);
      }
    }
    // ponti sul fiume Oglio
    for (const br of PONTI_FIUME) for (const x of [br.x0 - 0.05, br.x1 + 0.05]) {
      const len = br.z1 - br.z0 + 1;
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, len), mat);
      rail.position.set(x, 0.55, (br.z0 + br.z1) / 2); this.scene.add(rail);
      for (let i = 0; i <= len; i += 1) {
        const p = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.6, 0.14), mat);
        p.position.set(x, 0.3, br.z0 - 0.5 + i); this.scene.add(p);
      }
      this.solids.push({ x0: x - 0.1, z0: br.z0 - 0.4, x1: x + 0.1, z1: br.z1 + 0.4 });
    }
  }

  _makeTrees() {
    const R = PIX.rng(42);
    this.alberi = [];   // tutti gli alberi piantati (src/alberi.js ci nasconde il bottino): { x, z, spr, w, h, bordo }
    const texs = [1, 2, 3, 4, 6, 8].map(s => PIX.toTexture(PIX.tree(s)));
    const pops = [1, 2].map(s => PIX.toTexture(PIX.poplar(s)));
    const clear = (x, z, m = 1) => {
      for (let dz = -m; dz <= m; dz++) for (let dx = -m; dx <= m; dx++) {
        const ch = this.grid[z + dz]?.[x + dx];
        if (ch !== undefined && ch !== 'g') return false;
      }
      for (const s of this.solids) if (x + 1 > s.x0 - m && x < s.x1 + m && z + 1 > s.z0 - m && z < s.z1 + m) return false;
      return true;
    };
    const used = new Set();
    const plant = (x, z, tex, w, h, jitter = 0.4) => {
      x = Math.round(x); z = Math.round(z);
      if (x < 0 || z < 0 || x >= MAP_W || z >= MAP_H || used.has(x + ',' + z)) return;
      const edge = x < 2 || z < 2 || x >= MAP_W - 2 || z >= MAP_H - 2;
      if (this.grid[z][x] !== 'g' || (!edge && !clear(x, z))) return;
      used.add(x + ',' + z);
      const s = this.sprite(tex, { w, h });
      s.position.set(x + 0.5 + (R() - 0.5) * jitter, 0, z + 0.5 + (R() - 0.5) * jitter);
      this.scene.add(s);
      this._paintBlobShadow(s.position.x, s.position.z, w * 0.42, w * 0.22);
      this.solids.push({ x0: s.position.x - 0.3, z0: s.position.z - 0.2, x1: s.position.x + 0.3, z1: s.position.z + 0.2 });
      this.alberi.push({ x: s.position.x, z: s.position.z, spr: s, w, h, bordo: edge });
    };
    const oak = (x, z) => plant(x, z, texs[(R() * texs.length) | 0], 2.25, 2.875);
    // cornice di alberi sui bordi
    for (let x = 0; x < MAP_W; x += 2) { oak(x, 0); oak(x + 1, MAP_H - 1); oak(x, MAP_H - 2); }
    for (let z = 0; z < MAP_H; z += 2) { oak(0, z); oak(MAP_W - 1, z + 1); oak(1, z + 1); oak(MAP_W - 2, z); }
    // bosco a sud
    for (let i = 0; i < 260; i++) oak(R() * MAP_W, MAP_H - 2 - Math.pow(R(), 1.6) * 16);
    // filari di pioppi lungo la provinciale, la capezzagna e l'argine del canale
    const signs = PROPS.filter(p => p.kind === 'cartello');
    const pop = (x, z) => { if (!signs.some(c => Math.abs(c.x - x - 0.5) < 3 && Math.abs(c.z - z - 0.5) < 2)) plant(x, z, pops[(R() * 2) | 0], 1.25, 3.625, 0.1); };
    // (i pioppi del canale stanno a due caselle e mezza dall'acqua: fra argine e alberi deve passare un trattore che gira)
    for (let x = 4; x < MAP_W - 2; x += 3) { pop(x, 50); pop(x, 58); pop(x, 31); pop(x, 8); }
    // boschetti sparsi
    const groves = [[10, 72, 6], [50, 92, 5], [100, 85, 7], [150, 90, 6], [105, 40, 5], [45, 38, 4], [140, 42, 5], [12, 22, 5], [95, 70, 3],
      [52, 106, 6], [80, 104, 7], [96, 107, 6], [128, 107, 7], [148, 104, 6], [88, 93, 3], [140, 93, 3]];   // gli ultimi: il bosco del Parco Oglio
    for (const [gx, gz, r] of groves) for (let i = 0; i < r * 3; i++) oak(gx + (R() - 0.5) * r * 2, gz + (R() - 0.5) * r * 2);
    for (let i = 0; i < 70; i++) oak(2 + R() * (MAP_W - 4), 8 + R() * (MAP_H - 10));
    // cespugli
    const bts = [PIX.toTexture(PIX.bush()), PIX.toTexture(PIX.bush()), PIX.toTexture(PIX.bush(true))];
    for (let i = 0; i < 160; i++) {
      const x = 2 + (R() * (MAP_W - 4) | 0), z = 7 + (R() * (MAP_H - 9) | 0);
      if (this.grid[z][x] !== 'g' || !clear(x, z, 0) || used.has(x + ',' + z)) continue;
      used.add(x + ',' + z);
      const s = this.sprite(bts[i % 3], { w: 1.375, h: 0.9375 });
      s.position.set(x + 0.5, 0, z + 0.5); this.scene.add(s);
      this._paintBlobShadow(x + 0.5, z + 0.5, 0.45, 0.2);
    }
    this.groundTex.needsUpdate = true;
  }

  _makeProps() {
    this.props = {};
    const { cassa: cp, mangiatoia: mp } = PLACES;
    const crate = this.sprite(PIX.toTexture(PIX.crate()), { w: 1.625, h: 1.375 });
    crate.position.set(cp.x, 0, cp.z); this.scene.add(crate);
    this.props.cassa = { x: cp.x, z: cp.z };
    this.solids.push({ x0: cp.x - 0.4, z0: cp.z - 0.3, x1: cp.x + 0.4, z1: cp.z + 0.2 });
    const tr = this.sprite(PIX.toTexture(PIX.trough()), { w: 1.625, h: 1 });
    tr.position.set(mp.x, 0, mp.z); this.scene.add(tr);
    this.props.mangiatoia = { x: mp.x, z: mp.z };

    const bale = PIX.toTexture(PIX.hayBale());
    const silo = PIX.toTexture(PIX.siloTexture(), true);
    for (const p of PROPS) {
      if (p.kind === 'balla') {
        const s = this.sprite(bale, { w: 1.5, h: 1.375 });
        s.position.set(p.x, 0, p.z); this.scene.add(s);
        this.solids.push({ x0: p.x - 0.55, z0: p.z - 0.3, x1: p.x + 0.55, z1: p.z + 0.2 });
      } else if (p.kind === 'silo') {
        const t = silo.clone(); t.needsUpdate = true; t.repeat.set(Math.round(p.r * 4), Math.round(p.h / 1.5));
        const body = new THREE.Mesh(new THREE.CylinderGeometry(p.r, p.r, p.h, 12), new THREE.MeshLambertMaterial({ map: t }));
        body.position.set(p.x, p.h / 2, p.z);
        const cap = new THREE.Mesh(new THREE.ConeGeometry(p.r * 1.05, p.r * 0.8, 12), new THREE.MeshLambertMaterial({ color: '#8a949c' }));
        cap.position.set(p.x, p.h + p.r * 0.4, p.z);
        this.scene.add(body, cap);
        this.solids.push({ x0: p.x - p.r, z0: p.z - p.r * 0.8, x1: p.x + p.r, z1: p.z + p.r * 0.8 });
      } else if (p.kind === 'cartello') {
        const c = PIX.signpost(p.text);
        const s = this.sprite(c, { w: c.width / PIX.PX, h: c.height / PIX.PX });
        s.position.set(p.x, 0, p.z); this.scene.add(s);
        this.solids.push({ x0: p.x - 0.1, z0: p.z - 0.1, x1: p.x + 0.1, z1: p.z + 0.1 });
      }
    }
    this._arrediFogli();
  }

  // Oggetti di scena dai fogli disegnati (src/hd/fogli.js): ognuno cerca la casella libera più vicina al suo posto.
  _arrediFogli() {
    const ARREDI = [
      ['o:pozzo', 58.5, 66.5, 0.9], ['o:carriola', 79, 67.5, 0], ['o:alberello', 70.5, 70.5, 0.3], ['o:staccionata', 57, 62, 0],
      ['o:cassettaPosta', 41.2, 40.2, 0.1], ['o:panchina', 19.5, 60, 0.3], ['o:panchina', 29, 60.5, 0.3],
      ['o:ballaQuadra', 59.5, 22.5, 0.6], ['o:fieno', 49.5, 25.5, 0.6], ['o:ballaQuadra', 60, 25, 0.6],
      ['o:silo', 109, 47, 0.7], ['o:cisterna', 127.5, 70.5, 0.4], ['o:pozzo', 104.5, 40.5, 0.9], ['o:carriola', 96.5, 40.5, 0],
      ['o:alberello', 88, 44, 0.3], ['o:cespuglioRose', 26, 50.5, 0], ['o:cassettaPosta', 104.5, 39.6, 0.1],
    ];
    const libera = (x, z, r) => {
      const ch = this.grid[Math.floor(z)]?.[Math.floor(x)];
      if (ch !== 'g' && ch !== 'q') return false;
      return !this.solids.some(s => x + r + 0.3 > s.x0 && x - r - 0.3 < s.x1 && z + 0.5 > s.z0 && z - 0.5 < s.z1);
    };
    for (const [nome, x0, z0, solido] of ARREDI) {
      const c = HDF.foglio(nome);
      if (!c) continue;
      const w = c.width / PIX.PX, h = c.height / PIX.PX;
      let pos = null;
      for (let r = 0; r <= 4 && !pos; r += 0.5) for (let a = 0; a < 8 && !pos; a++) {
        const x = x0 + Math.cos(a * Math.PI / 4) * r, z = z0 + Math.sin(a * Math.PI / 4) * r;
        if (libera(x, z, w / 2)) pos = [x, z];
        if (r === 0) break;
      }
      if (!pos) continue;
      const s = this.sprite(c, { w, h });
      s.position.set(pos[0], 0, pos[1]); this.scene.add(s);
      this._paintBlobShadow(pos[0], pos[1], w * 0.4, 0.2);
      if (solido) this.solids.push({ x0: pos[0] - w * solido / 2, z0: pos[1] - 0.25, x1: pos[0] + w * solido / 2, z1: pos[1] + 0.15 });
    }
    this.groundTex.needsUpdate = true;
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
      const s = this.sprite(this.cropTex[tk], { w: 1, h: this.cropTex[tk].image.height / PIX.PX });   // il mais maturo è più alto
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

  // Collisioni: indice a celle 8x8, ricostruito quando cambia la lista dei solidi.
  blocked(x, z, r = 0.28) {
    if (x > MAP_W + 20 && this.bloccatoFuoriMappa) return this.bloccatoFuoriMappa(x, z, r); // interni degli edifici
    if (this._idxN !== this.solids.length) this._indexSolids();
    const cell = this._idx.get(((x / 8) | 0) + ',' + ((z / 8) | 0));
    if (x < 0 || z < 0 || x >= MAP_W || z >= MAP_H) return true;
    if (!cell) return false;
    for (const s of cell) { const rx = r + (s.px || 0); if (x + rx > s.x0 && x - rx < s.x1 && z + r * 0.6 > s.z0 && z - r * 0.6 < s.z1) return true; }
    return false;
  }

  _indexSolids() {
    this._idx = new Map(); this._idxN = this.solids.length;
    const C = 8, m = 1;
    for (const s of this.solids) {
      const cx0 = Math.max(0, Math.floor((s.x0 - m) / C)), cx1 = Math.min(Math.floor(MAP_W / C), Math.floor((s.x1 + m) / C));
      const cz0 = Math.max(0, Math.floor((s.z0 - m) / C)), cz1 = Math.min(Math.floor(MAP_H / C), Math.floor((s.z1 + m) / C));
      for (let cz = cz0; cz <= cz1; cz++) for (let cx = cx0; cx <= cx1; cx++) {
        const k = cx + ',' + cz;
        if (!this._idx.has(k)) this._idx.set(k, []);
        this._idx.get(k).push(s);
      }
    }
  }

  // Luce del giorno: k = 0 (notte) .. 1 (pieno giorno); warm = tramonto
  setDaylight(k, warm = 0, hour = 12) {
    const night = new THREE.Color('#5868a8'), day = new THREE.Color('#ffffff'), dusk = new THREE.Color('#ffb070');
    this.tint.copy(night).lerp(day, k).lerp(dusk, warm * 0.5);
    this.amb.color.copy(this.tint); this.amb.intensity = 0.3 + 0.4 * k;
    this.hemi.intensity = 0.3 + 0.45 * k;
    this.sun.intensity = 0.25 + 1.6 * k;
    this.sun.color.set('#ffe2b0').lerp(dusk, warm * 0.6);
    // il sole va da est (mattina) a ovest (sera): ombre lunghe all'alba e al tramonto
    const t = Math.max(0, Math.min(1, (hour - 6) / 14));
    this.sunOff.set(18 - 36 * t, 8 + 14 * Math.sin(t * Math.PI), 7);
    // cielo e foschia cambiano con l'ora
    const sky = this._sky ??= new THREE.Color();
    sky.set('#1c2448').lerp(new THREE.Color('#a8d4ea'), k).lerp(new THREE.Color('#f0b088'), warm * 0.55);
    if (this.scene.background?.isColor) this.scene.background.copy(sky);
    if (this.scene.fog) this.scene.fog.color.copy(sky);
    for (const m of this.spriteMats) m.color.copy(this.tint);
  }

}
