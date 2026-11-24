// Pixel art generata via codice (segnaposto finché non avremo gli sprite veri).
// Ogni funzione restituisce un <canvas> piccolo che poi diventa una texture "nearest".
import * as THREE from 'three';
import * as HDT from './hd/terreno.js';
import * as HDO from './hd/oggetti.js';
import * as HDK from './hd/kit.js';
import { ATLANTE, ATLANTE_FILE } from './data/sprite_personaggi.js';

export const PX = 16; // pixel per unità di mondo (1 casella = 16 px)

export function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  return [c, g];
}

export function toTexture(canvas, repeat = false) {
  const t = new THREE.CanvasTexture(canvas);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  return t;
}

// Generatore pseudo-casuale con seme, così la grafica è sempre uguale.
export function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = Math.max(0, Math.min(255, Math.round(r * f)));
  g = Math.max(0, Math.min(255, Math.round(g * f)));
  b = Math.max(0, Math.min(255, Math.round(b * f)));
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

// Aggiunge il contorno scuro tipico della pixel art.
function outline(c, color = '#1a1420') {
  const g = c.getContext('2d');
  const { width: w, height: h } = c;
  const d = g.getImageData(0, 0, w, h).data;
  const a = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? 0 : d[(y * w + x) * 4 + 3];
  g.fillStyle = color;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (a(x, y) > 0) continue;
    if (a(x - 1, y) || a(x + 1, y) || a(x, y - 1) || a(x, y + 1)) g.fillRect(x, y, 1, 1);
  }
  return c;
}

export function mirror(src) {
  const [c, g] = makeCanvas(src.width, src.height);
  g.translate(src.width, 0); g.scale(-1, 1); g.drawImage(src, 0, 0);
  return c;
}

// ---------- Personaggi ----------
// o: { w,h, skin, hair, hairStyle:'messy'|'bald'|'flat'|'grey', hat, shirt, pants, boots,
//      overalls, beard, mustache, belly, tie, eyes:'sleepy'|'angry'|'normal'|'sad' }
//    sprite: nome nell'atlante dei personaggi disegnati (vedi sotto): se c'è, si usa quello al posto del segnaposto
export function humanoid(o, frame = 0) {
  if (o.sprite && SPR[o.sprite]) return spriteUmano(o, frame);
  const W = o.w, H = o.h;
  const [c, g] = makeCanvas(W, H);
  const P = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const cx = W / 2;
  const top = 1 + (o.hat ? 2 : 0);
  const headW = Math.round(W * 0.56), headH = Math.round(H * 0.29);
  const hx = Math.round(cx - headW / 2), hy = top;
  const bodyW = Math.round(W * (o.belly ? 0.74 : 0.62)), bodyH = Math.round(H * 0.36);
  const bx = Math.round(cx - bodyW / 2), by = hy + headH;
  const legTop = by + bodyH;
  const legW = Math.max(2, Math.round(W * 0.2));
  const legH = H - 1 - legTop;
  const lx1 = Math.round(cx - legW - 0.5), lx2 = Math.round(cx + 0.5);
  const lift1 = frame === 1 ? 1 : 0, lift2 = frame === 2 ? 1 : 0;

  // gambe e scarpe
  P(o.pants, lx1, legTop, legW, legH - lift1);
  P(o.pants, lx2, legTop, legW, legH - lift2);
  P(shade(o.pants, 0.75), lx2 + legW - 1, legTop, 1, legH - lift2);
  P(o.boots, lx1 - 1, H - 3 - lift1, legW + 1, 2);
  P(o.boots, lx2, H - 3 - lift2, legW + 1, 2);

  // braccia
  const armW = Math.max(2, Math.round(W * 0.14));
  const armSwing = frame === 1 ? 1 : frame === 2 ? -1 : 0;
  P(o.shirt, bx - armW, by + 1 + armSwing, armW, bodyH - 3);
  P(o.shirt, bx + bodyW, by + 1 - armSwing, armW, bodyH - 3);
  P(o.skin, bx - armW, by + bodyH - 2 + armSwing, armW, 2);
  P(o.skin, bx + bodyW, by + bodyH - 2 - armSwing, armW, 2);

  // corpo
  P(o.shirt, bx, by, bodyW, bodyH);
  if (o.overalls) {
    P(o.overalls, bx + 1, by + Math.round(bodyH * 0.3), bodyW - 2, bodyH - Math.round(bodyH * 0.3));
    P(o.overalls, bx + 2, by, 1, Math.round(bodyH * 0.3));
    P(o.overalls, bx + bodyW - 3, by, 1, Math.round(bodyH * 0.3));
    P('#f0d050', bx + 2, by + Math.round(bodyH * 0.3), 1, 1);
    P('#f0d050', bx + bodyW - 3, by + Math.round(bodyH * 0.3), 1, 1);
  }
  if (o.tie) { P('#f4f0e8', cx - 2, by, 4, 3); P(o.tie, cx - 1, by, 2, bodyH - 2); }
  if (o.plaid) {
    for (let y = by; y < by + bodyH; y += 3) P(shade(o.shirt, 0.7), bx, y, bodyW, 1);
    for (let x = bx + 1; x < bx + bodyW; x += 3) P(shade(o.shirt, 0.7), x, by, 1, bodyH);
  }
  P(shade(o.shirt, 0.8), bx + bodyW - 1, by, 1, bodyH);
  if (o.belt) P(o.belt, bx, by + bodyH - 2, bodyW, 1);

  // testa
  P(o.skin, hx, hy, headW, headH);
  P(shade(o.skin, 0.85), hx + headW - 1, hy, 1, headH);
  // capelli
  const hair = o.hair;
  if (o.hairStyle === 'messy') { P(hair, hx, hy, headW, 2); P(hair, hx - 1, hy + 1, 2, 3); P(hair, hx + headW - 1, hy + 1, 2, 3); }
  else if (o.hairStyle === 'flat') { P(hair, hx - 1, hy - 1, headW + 2, 3); }
  else if (o.hairStyle === 'bald') { P(hair, hx - 1, hy + 2, 1, 3); P(hair, hx + headW, hy + 2, 1, 3); }
  else if (o.hairStyle === 'coda') { P(hair, hx - 1, hy - 1, headW + 2, 3); P(hair, hx - 1, hy, 2, 3); P(hair, hx - 3, hy + 1, 3, 2); P(hair, hx - 4, hy + 2, 2, 4); }  // coda di cavallo (ragazze che corrono)
  else if (o.hairStyle === 'long') { P(hair, hx - 1, hy, headW + 2, 2); P(hair, hx - 1, hy, 2, headH + 2); P(hair, hx + headW - 1, hy, 2, headH + 2); }
  // cappello
  if (o.hat) {
    P(o.hat, hx, hy - 3, headW, 3);
    P(shade(o.hat, 0.7), hx - 1, hy - 1, headW + 3, 1);
  }
  // occhi
  const ey = hy + Math.round(headH * 0.45);
  const ex1 = hx + Math.round(headW * 0.25), ex2 = hx + Math.round(headW * 0.62);
  const ink = '#1a1420';
  if (o.eyes === 'sleepy') { P(ink, ex1, ey, 2, 1); P(ink, ex2, ey, 2, 1); P(shade(o.skin, 0.8), ex1, ey + 1, 2, 1); P(shade(o.skin, 0.8), ex2, ey + 1, 2, 1); }
  else if (o.eyes === 'angry') { P(ink, ex1, ey, 2, 2); P(ink, ex2, ey, 2, 2); P(ink, ex1 - 1, ey - 2, 2, 1); P(ink, ex1 + 1, ey - 1, 1, 1); P(ink, ex2 + 1, ey - 2, 2, 1); P(ink, ex2, ey - 1, 1, 1); }
  else { P(ink, ex1, ey, 1, 2); P(ink, ex2 + 1, ey, 1, 2); }
  // barba / baffi / bocca
  const my = hy + Math.round(headH * 0.75);
  if (o.beard) { P(o.beard, hx, my - 1, headW, headH - (my - 1 - hy) + 1); P(o.beard, hx + 1, hy + headH, headW - 2, 1); }
  if (o.mustache) P(o.mustache, cx - 2, my - 1, 4, 1);
  if (!o.beard) P(o.eyes === 'angry' ? '#7a1f1f' : '#9a4a40', cx - 1, my, o.eyes === 'angry' ? 3 : 2, 1);
  return outline(c);
}

export const CHARACTERS = {
  garonio: { w: 16, h: 24, skin: '#f2c39b', hair: '#5a3a22', hairStyle: 'messy', hat: '#3f8f3a', shirt: '#c8453c', overalls: '#3a5fa8', pants: '#3a5fa8', boots: '#4a2e1c', eyes: 'sleepy' },
  gigante: { sprite: 'contadino_forcone', w: 22, h: 32, skin: '#e8b48a', hair: '#9a9a9a', hairStyle: 'bald', shirt: '#b03a2e', plaid: true, pants: '#5a4630', boots: '#2e2218', mustache: '#8a8a8a', belly: true, belt: '#2e2218', eyes: 'angry' },
  mountain: { sprite: 'boss_sigaro', w: 30, h: 42, skin: '#d9a27a', hair: '#2a1d14', hairStyle: 'flat', shirt: '#2b2b3a', pants: '#22222e', boots: '#111111', beard: '#2a1d14', tie: '#c0242c', belly: true, eyes: 'angry' },
  bullo: { sprite: 'bullo', w: 16, h: 24, skin: '#e0a986', hair: '#1c1c1c', hairStyle: 'flat', shirt: '#2f2f2f', pants: '#3c5a8a', boots: '#222', eyes: 'angry' },
  barista: { sprite: 'barista', w: 16, h: 24, skin: '#f0c8a8', hair: '#a0522d', hairStyle: 'long', shirt: '#ffffff', pants: '#333', boots: '#222', eyes: 'normal' },
};

// frames: [idleR, walk1R, walk2R, idleL, walk1L, walk2L]
export function characterFrames(key) {
  const o = CHARACTERS[key];
  const r = [0, 1, 2].map(f => humanoid(o, f));
  return [...r, ...r.map(mirror)];
}

// ---------- Animali ----------
export function nutria(frame = 0) {
  const [c, g] = makeCanvas(18, 12);
  const P = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  P('#6b4a2e', 0, 7 - frame, 5, 2);           // coda
  P('#7a5434', 4, 4, 10, 6);                   // corpo
  P('#8f6640', 5, 4, 7, 2);
  P('#7a5434', 12, 3, 5, 5);                   // testa
  P('#1a1420', 15, 4, 1, 1);                   // occhio
  P('#f08a1c', 16, 7, 1, 2);                   // denti arancioni!
  P('#5a3c22', 5, 10, 2, 1 + frame); P('#5a3c22', 11, 10, 2, 2 - frame); // zampe
  return outline(c);
}

export function chicken(frame = 0) {
  const spr = animale('gallina', frame, 12, 12); if (spr) return spr;
  const [c, g] = makeCanvas(12, 12);
  const P = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  P('#f4f0e6', 2, 5, 7, 4);
  P('#f4f0e6', 7, 2, 3, 4);
  P('#d8d0c0', 2, 7, 5, 2);
  P('#d33', 8, 0, 2, 2);
  P('#f0a020', 10, 3, 2, 1);
  P('#1a1420', 8, 3, 1, 1);
  P('#f0a020', 4, 9, 1, 2 - frame); P('#f0a020', 6, 9, 1, 1 + frame);
  return outline(c);
}

export function egg() {
  const [c, g] = makeCanvas(6, 7);
  g.fillStyle = '#fbf3df'; g.fillRect(1, 1, 4, 5); g.fillRect(2, 0, 2, 1);
  g.fillStyle = '#e8dcc0'; g.fillRect(4, 3, 1, 3);
  return outline(c);
}

// ---------- Piante ----------
// stage: 1 germoglio, 2 crescita, 3 maturo
// Colture HD (src/hd/oggetti.js): 16x24
export function crop(type, stage) { return HDO.coltura(type, stage); }

// ---------- Scenografia ----------
export function tree(seed = 1) { return HDO.quercia(seed, seed % 5 === 3); } // 36x46

// Pioppo: alto e stretto, tipico dei filari della Bassa.
export function poplar(seed = 1) { return HDO.pioppo(seed); } // 20x58

// Rotoballa di fieno vista di fronte.
export function hayBale() { return HDO.rotoballa(); } // 24x22

// Cartello stradale su palo.
export function signpost(text) { return HDO.cartello(text); }

// Lamiera ondulata per i silos (texture ripetibile).
export function siloTexture() {
  const [c, g] = makeCanvas(32, 32);
  g.fillStyle = '#b8c0c8'; g.fillRect(0, 0, 32, 32);
  g.fillStyle = '#8a949c'; for (let x = 0; x < 32; x += 4) g.fillRect(x, 0, 1, 32);
  g.fillStyle = '#d8e0e8'; for (let x = 2; x < 32; x += 4) g.fillRect(x, 0, 1, 32);
  g.fillStyle = '#6e7880'; g.fillRect(0, 15, 32, 1);
  return c;
}

export function bush(fiori = false) { return HDO.cespuglio(fiori); } // 22x15

export function crate() { return HDO.cassaVendita(); } // 26x22

export function trough() { return HDO.mangiatoia(); } // 26x16

export function bubble(text) {
  const [c, g] = makeCanvas(20, 12);
  g.fillStyle = '#fff'; g.fillRect(1, 1, 18, 8); g.fillRect(4, 9, 3, 2);
  g.fillStyle = '#1a1420'; g.font = 'bold 8px monospace'; g.textBaseline = 'top';
  g.fillText(text, 3, 1);
  return outline(c);
}

// Insegna con testo, per gli edifici.
export function sign(text) {
  // insegna di legno in stile HD, scritta col carattere pixel di src/hd/kit.js
  const w = Math.max(32, HDK.textWidth(text) + 10), d = HDK.pen(w, 12), R = HDK.ramp('#7a4a26');
  d.P(R[0], 0, 0, w, 12); d.P(R[2], 1, 1, w - 2, 10); d.P(R[3], 1, 1, w - 2, 1); d.P(R[1], 1, 9, w - 2, 2);
  for (let x = 6; x < w - 4; x += 9) d.P(R[1], x, 2, 3, 1);
  d.P('#c8c0a8', 2, 2); d.P('#c8c0a8', w - 3, 2); d.P('#c8c0a8', 2, 8); d.P('#c8c0a8', w - 3, 8);
  HDK.text(d, text, (w - HDK.textWidth(text)) >> 1, 3, '#fff0c8', R[0]);
  return d.c;
}

// ---------- Texture delle pareti ----------
export function wallTexture(kind, wTiles, hTiles, door = false, windows = 0) {
  const W = wTiles * PX, H = hTiles * PX;
  const [c, g] = makeCanvas(W, H);
  const R = rng(W * 7 + H + kind.length);
  const P = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  if (kind === 'casa') {
    P('#e8d8b0', 0, 0, W, H);
    for (let i = 0; i < W * H / 40; i++) P(R() < 0.5 ? '#d8c69a' : '#f2e6c4', R() * W | 0, R() * H | 0, 2, 1);
    P('#b89a6a', 0, H - 4, W, 4);
  } else if (kind === 'metallo') {
    P('#8a949c', 0, 0, W, H);
    for (let x = 0; x < W; x += 4) P('#6e7880', x, 0, 1, H);
    P('#a8b0b8', 0, 0, W, 2);
  } else if (kind === 'legno') {
    P('#a0703e', 0, 0, W, H);
    for (let y = 0; y < H; y += 5) P('#7a5430', 0, y, W, 1);
    for (let i = 0; i < W * H / 50; i++) P('#8a5e34', R() * W | 0, R() * H | 0, 3, 1);
  } else if (kind[0] === '#') { // intonaco colorato (case del paese)
    P(kind, 0, 0, W, H);
    for (let i = 0; i < W * H / 40; i++) P(shade(kind, R() < 0.5 ? 0.92 : 1.06), R() * W | 0, R() * H | 0, 2, 1);
    P(shade(kind, 0.75), 0, H - 4, W, 4);
  } else if (kind === 'bar') {
    P('#d9884a', 0, 0, W, H);
    for (let y = 3; y < H; y += 6) for (let x = (y / 6 | 0) % 2 * 4; x < W; x += 8) P('#c27038', x, y, 7, 1);
    P('#8a3a20', 0, H - 4, W, 4);
  }
  // finestre
  for (let i = 0; i < windows; i++) {
    const wx = Math.round((W / (windows + 1)) * (i + 1) - 6) + (door ? (i < windows / 2 ? -10 : 10) : 0);
    const wy = Math.round(H * 0.3);
    P('#3e2816', wx - 1, wy - 1, 14, 12);
    P('#9fd4f0', wx, wy, 12, 10);
    P('#dff2fb', wx + 1, wy + 1, 4, 3);
    P('#3e2816', wx + 5, wy, 2, 10); P('#3e2816', wx, wy + 4, 12, 1);
  }
  if (door) {
    const dw = 14, dh = Math.min(H - 2, 24);
    const dx = Math.round(W / 2 - dw / 2);
    P('#3e2816', dx - 1, H - dh - 1, dw + 2, dh + 1);
    P(kind === 'metallo' ? '#5a646c' : '#7a4a26', dx, H - dh, dw, dh);
    P('#f0d050', dx + dw - 4, H - dh / 2, 2, 2);
  }
  return c;
}

export function roofTexture(color) {
  const [c, g] = makeCanvas(16, 16);
  g.fillStyle = color; g.fillRect(0, 0, 16, 16);
  g.fillStyle = shade(color, 0.75);
  for (let y = 3; y < 16; y += 4) g.fillRect(0, y, 16, 1);
  for (let y = 0; y < 16; y += 4) for (let x = (y / 4) % 2 * 4; x < 16; x += 8) g.fillRect(x, y, 1, 4);
  return c;
}

// ---------- Terreno ----------
// colori di base delle caselle (servono ai bordi sfumati di blendTile): uguali alle caselle HD
const GROUND = {
  g: ['#5ca63c', '#4c9232', '#6cb44a'],   // erba
  p: ['#b68c58', '#a27a4a', '#c49a64'],   // strada sterrata
  f: ['#86a84a', '#7a9c40', '#93b452'],   // campo incolto
  o: ['#86a84a', '#7a9c40', '#93b452'],   // orto incolto
  c: ['#a88458', '#987650', '#b89262'],   // paglia del pollaio
  w: ['#3d80cc', '#336fb8', '#5a98d8'],   // acqua del canale
  s: ['#6e5232', '#5e462a', '#7e6040'],   // recinto maiali (fango)
  a: ['#5c6068', '#50545c', '#666a72'],   // asfalto
  q: ['#a89880', '#968878', '#b4a690'],   // piazza in ciottoli
  b: ['#a8743e', '#8a5e32', '#b07c46'],   // ponte di legno
  y: ['#c8a040', '#b89034', '#e0bc58'],   // grano maturo
  r: ['#8a5e36', '#7a5030', '#966a40'],   // campo arato
};

// Caselle HD (src/hd/terreno.js), con qualche variante per non far vedere la ripetizione.
let HD_TILES = null;
function rot90(src) {
  const [c, g] = makeCanvas(src.height, src.width);
  g.translate(c.width, 0); g.rotate(Math.PI / 2); g.drawImage(src, 0, 0);
  return c;
}
function flipV(src) {
  const [c, g] = makeCanvas(src.width, src.height);
  g.translate(0, c.height); g.scale(1, -1); g.drawImage(src, 0, 0);
  return c;
}
function hdTiles() {
  if (HD_TILES) return HD_TILES;
  const erbe = [0, 11, 22, 33, 44, 55].map(s => HDT.erba(0, s));
  HD_TILES = {
    g: [...erbe, ...erbe, HDT.erba(1, 1), HDT.erba(2, 2)],
    p: [0, 7, 14, 21].map(s => HDT.sterrato(0, s)),
    f: [0, 9, 18].map(s => HDT.erba(0, s + 5, '#86a84a')),
    o: [0, 9, 18].map(s => HDT.erba(0, s + 6, '#86a84a')),
    c: [HDT.paglia()],
    w: [HDT.acqua(0), HDT.acqua(1)],
    s: [HDT.fango(false), HDT.fango(false), HDT.fango(true)],
    a: [0, 3, 6, 9, 12, 15, 18].map(s => HDT.asfalto(false, 0, s)).concat([HDT.asfalto(false, 1, 1)]),
    q: [HDT.piazza()],
    b: [rot90(HDT.ponte())],
    y: [HDT.grano(true)],
    r: [HDT.arato()],
  };
  HD_TILES.rivaN = HDT.riva(0); HD_TILES.rivaS = flipV(HDT.riva(0));
  HD_TILES.zolla = HDT.zolla(false); HD_TILES.zollaB = HDT.zolla(true);
  return HD_TILES;
}
export function paintTile(g, ch, x, y, seed, plot, grid = null) {
  const X = x * PX, Y = y * PX;
  const H = hdTiles(), set = H[ch] || H.g;
  const R = rng(seed);
  let img = set[(R() * set.length) | 0];
  if (ch === 'w' && grid) { // riva: argine con le canne dove l'acqua tocca la terra
    const wet = c => c === 'w' || c === 'b';
    if (grid[y - 1] && !wet(grid[y - 1][x])) img = H.rivaN;
    else if (grid[y + 1] && !wet(grid[y + 1][x])) img = H.rivaS;
  }
  g.drawImage(img, X, Y);
  if (plot) {
    // zolla lavorata (la casella HD dell'orto, bagnata o asciutta)
    g.drawImage(plot.water ? H.zollaB : H.zolla, 1, 1, PX - 2, PX - 2, X + 1, Y + 1, PX - 2, PX - 2);
    if (plot.stoppie) {
      g.fillStyle = '#c8a850';
      for (let r = 2; r < PX - 1; r += 4) for (let i = 2 + (r % 3); i < PX - 2; i += 3) g.fillRect(X + i, Y + r - 1, 1, 2);
    }
    if (plot.stage === 0 && plot.crop) {
      g.fillStyle = '#e8d8a0';
      g.fillRect(X + 4, Y + 5, 1, 1); g.fillRect(X + 10, Y + 6, 1, 1); g.fillRect(X + 7, Y + 10, 1, 1); g.fillRect(X + 5, Y + 12, 1, 1);
    }
  }
}

// Bordi morbidi tra terreni diversi: il terreno "più forte" (erba, grano...) sconfina
// di qualche pixel irregolare in quello vicino, così i confini non sono più a quadretti.
const BLEND = { g: 6, y: 5, f: 4, o: 4, r: 4, s: 3, c: 3, q: 2, p: 2, a: 1, w: 0 };
function hash2(a, b) { let h = (a * 374761393 + b * 668265263) >>> 0; h = ((h ^ (h >>> 13)) * 1274126177) >>> 0; return (h ^ (h >>> 16)) / 4294967296; }
// rumore liscio lungo un bordo: valori casuali ogni 4 px, interpolati
function edgeNoise(line, t) {
  const i = Math.floor(t / 4), f = (t % 4) / 4;
  const a = hash2(line, i), b = hash2(line, i + 1);
  return a + (b - a) * (f * f * (3 - 2 * f));
}
export function blendTile(g, grid, x, y) {
  const me = grid[y]?.[x], pm = BLEND[me];
  if (pm === undefined) return;
  const X = x * PX, Y = y * PX;
  const nb = (dx, dy) => grid[y + dy]?.[x + dx];
  const stronger = ch => ch !== undefined && BLEND[ch] !== undefined && BLEND[ch] > pm;
  const dot = (col, px, py) => { g.fillStyle = col; g.fillRect(X + px, Y + py, 1, 1); };
  const sides = [[0, -1], [0, 1], [-1, 0], [1, 0]];
  for (const [dx, dy] of sides) {
    const ch = nb(dx, dy);
    if (!stronger(ch)) continue;
    const pal = GROUND[ch];
    const horiz = dy !== 0;
    // id univoco della linea di confine, uguale da entrambe le parti
    const line = horiz ? (y + Math.max(0, dy)) * 7919 + 1 : (x + Math.max(0, dx)) * 7919 + 2;
    for (let i = 0; i < PX; i++) {
      const t = horiz ? X + i : Y + i;
      const d = 2 + Math.floor(edgeNoise(line, t) * 4.5);
      for (let k = 0; k < d; k++) {
        const col = hash2(t * 31 + k, line) < 0.8 ? pal[0] : pal[2];
        const px = horiz ? i : (dx < 0 ? k : PX - 1 - k), py = horiz ? (dy < 0 ? k : PX - 1 - k) : i;
        dot(col, px, py);
      }
      if (hash2(t, line * 3) < 0.35) { // pixel sparso oltre il bordo: sfumatura a retino
        const k = d + 1 + (hash2(line, t * 7) * 2 | 0);
        const px = horiz ? i : (dx < 0 ? k : PX - 1 - k), py = horiz ? (dy < 0 ? k : PX - 1 - k) : i;
        dot(pal[0], px, py);
      }
    }
  }
  // angoli: se solo la diagonale è più forte, arrotonda l'angolo
  for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const ch = nb(dx, dy);
    if (!stronger(ch) || stronger(nb(dx, 0)) || stronger(nb(0, dy))) continue;
    const pal = GROUND[ch];
    const r = 4 + (hash2(x * 3 + dx, y * 5 + dy) * 3 | 0);
    for (let j = 0; j < r; j++) for (let i = 0; i < r; i++) {
      if ((r - i - 0.5) ** 2 + (r - j - 0.5) ** 2 > r * r) continue;
      dot(pal[0], dx < 0 ? i : PX - 1 - i, dy < 0 ? j : PX - 1 - j);
    }
  }
}

// ---------- Garonio: sprite disegnati da Alessandro ----------
// assets/sprites/garonio.png = 13 fotogrammi in fila (vedi tools/taglia_sprite.py)
export const GARONIO_ANIM = { idle: [0], walk: [1, 2, 3, 4], run: [5, 6, 7], jump: [8, 9, 10], attack: [11], ko: [12] };
export const GARONIO_N = 13;
let garonioSheet = null;

function loadImage(src) {
  return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
}

export async function loadGaronio() {
  try {
    const img = await loadImage('assets/sprites/garonio.png');
    const cw = img.width / GARONIO_N, ch = img.height;
    const right = [];
    for (let i = 0; i < GARONIO_N; i++) { const [c, g] = makeCanvas(cw, ch); g.drawImage(img, i * cw, 0, cw, ch, 0, 0, cw, ch); right.push(c); }
    garonioSheet = { frames: [...right, ...right.map(mirror)], w: cw / 20, h: ch / 20, portrait: 'assets/sprites/garonio_ritratto.png' };
  } catch { garonioSheet = null; }
}

// Fotogrammi di Garonio: i 13 a destra seguiti dai 13 a sinistra.
// Se l'immagine non c'è, usa il segnaposto disegnato via codice.
export function garonioFrames() {
  if (garonioSheet) return garonioSheet;
  const r = [0, 1, 2].map(f => humanoid(CHARACTERS.garonio, f));
  const map = [0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 2, 1, 0];
  const right = map.map(i => r[i]);
  return { frames: [...right, ...right.map(mirror)], w: 1, h: 1.5 };
}

// Ritratti per i dialoghi (data URL)
const portraitCache = {};
export function portrait(key) {
  if (key === 'garonio' && garonioSheet) return garonioSheet.portrait;
  if (portraitCache[key]) return portraitCache[key];
  const o = CHARACTERS[key];
  if (o?.sprite && SPR[o.sprite]) return (portraitCache[key] = ritrattoSprite(SPR[o.sprite].c));
  const src = humanoid(CHARACTERS[key], 0);
  const headH = Math.round(src.height * 0.5);
  const [c, g] = makeCanvas(48, 48);
  g.fillStyle = '#26305a'; g.fillRect(0, 0, 48, 48);
  const scale = Math.floor(44 / Math.max(src.width, headH));
  const dw = src.width * scale, dh = headH * scale;
  g.drawImage(src, 0, 0, src.width, headH, (48 - dw) / 2, 48 - dh, dw, dh);
  return (portraitCache[key] = c.toDataURL());
}

// ---------- Personaggi e animali disegnati (assets/sprites/personaggi.png) ----------
// L'atlante lo crea tools/taglia_personaggi.py dai due fogli in assets/sprites/originali/.
// Un personaggio usa uno sprite se il suo aspetto ha sprite: 'nome'. L'altezza in gioco resta quella
// dell'aspetto (per l'altezza relativa della figura) e la larghezza segue le proporzioni del disegno.
// Gli animali (gallina, maiale, gatto, cane) prendono lo sprite dentro le loro funzioni di disegno.
const SPR = {};   // nome -> { c: canvas, k: altezza relativa }

export async function loadPersonaggi() {
  try {
    const img = await loadImage(ATLANTE_FILE);
    for (const [nome, [x, y, w, h, k]] of Object.entries(ATLANTE)) {
      const [c, g] = makeCanvas(w, h);
      g.drawImage(img, x, y, w, h, 0, 0, w, h);
      SPR[nome] = { c, k };
    }
  } catch { /* senza atlante restano i segnaposto disegnati via codice */ }
}
export const haSprite = nome => !!SPR[nome];

// fotogramma: lo sprite appoggiato in basso al centro; nel fotogramma 1 (passo) si alza di un pixel
function spriteFrame(src, frame, W = src.width, H = src.height + 1) {
  const [c, g] = makeCanvas(W, H);
  g.drawImage(src, Math.round((W - src.width) / 2), H - src.height - (frame === 1 ? 1 : 0));
  return c;
}

function spriteUmano(o, frame) {
  const { c: src, k } = SPR[o.sprite];
  if (o._h0 == null) {   // una volta sola: misure dell'aspetto adattate al disegno
    o._h0 = o.h;
    o.h = Math.round(o._h0 * k * 10) / 10;
    o.w = Math.round(o.h * src.width / (src.height + 1) * 10) / 10;
  }
  return spriteFrame(src, frame);
}

// pelo ricolorato (gatti e cani di colori diversi): i toni arancio e marroni diventano la tinta
const tinteCache = {};
function tingi(nome, tinta) {
  const key = nome + tinta;
  if (tinteCache[key]) return tinteCache[key];
  const src = SPR[nome].c;
  const [c, g] = makeCanvas(src.width, src.height);
  g.drawImage(src, 0, 0);
  const img = g.getImageData(0, 0, c.width, c.height), d = img.data;
  const n = parseInt(tinta.slice(1), 16), tr = n >> 16 & 255, tg = n >> 8 & 255, tb = n & 255;
  const pelo = [], lum = (r, gg, b) => 0.3 * r + 0.59 * gg + 0.11 * b;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], gg = d[i + 1], b = d[i + 2];
    if (!d[i + 3]) continue;
    const mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
    if (mx > 60 && (mx - mn) / mx > 0.3 && r >= gg && gg > b) pelo.push(i);   // arancio, marrone
  }
  if (pelo.length) {
    const lm = pelo.reduce((t, i) => t + lum(d[i], d[i + 1], d[i + 2]), 0) / pelo.length;
    const lt = lum(tr, tg, tb) || 1;
    for (const i of pelo) {
      const f = lum(d[i], d[i + 1], d[i + 2]) / lm;
      d[i] = Math.min(255, tr * f); d[i + 1] = Math.min(255, tg * f); d[i + 2] = Math.min(255, tb * f);
      if (lt < 40) { d[i] += 18 * f; d[i + 1] += 18 * f; d[i + 2] += 22 * f; }   // nero: un filo di riflesso
    }
  }
  g.putImageData(img, 0, 0);
  return (tinteCache[key] = c);
}

// Sprite di un animale dentro una tela con le proporzioni del segnaposto (w x h), così chi lo usa
// tiene le sue misure. tinta: colore del pelo. dorme: schiacciato a terra. null se lo sprite non c'è.
export function animale(nome, frame, w, h, { tinta, dorme } = {}) {
  if (!SPR[nome]) return null;
  let src = tinta ? tingi(nome, tinta) : SPR[nome].c;
  if (dorme) {
    const [c, g] = makeCanvas(src.width, Math.round(src.height * 0.55));
    g.drawImage(src, 0, 0, src.width, src.height, 0, 0, c.width, c.height);
    src = c;
  }
  const asp = w / h;
  let H = SPR[nome].c.height + 1, W = Math.round(H * asp);
  if (W < src.width) { W = src.width; H = Math.round(W / asp); }
  return spriteFrame(src, dorme ? 0 : frame, W, H);
}

// ritratto: la testa (parte alta dello sprite) su sfondo blu
function ritrattoSprite(src) {
  const rows = Math.round(src.height * 0.55);
  const d = src.getContext('2d').getImageData(0, 0, src.width, rows).data;
  let sx = 0, n = 0;
  for (let y = 0; y < rows; y++) for (let x = 0; x < src.width; x++) if (d[(y * src.width + x) * 4 + 3]) { sx += x; n++; }
  const cx = n ? sx / n : src.width / 2, lato = rows;
  const [c, g] = makeCanvas(96, 96);
  g.fillStyle = '#26305a'; g.fillRect(0, 0, 96, 96);
  const scale = Math.max(1, Math.floor(92 / lato)), dl = lato * scale;
  g.drawImage(src, Math.round(cx - lato / 2), 0, lato, lato, (96 - dl) / 2, 96 - dl, dl, dl);
  return c.toDataURL();
}
