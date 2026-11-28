// Edifici visti di fronte con il tetto in prospettiva (vista 3/4 come la camera del gioco).
// Scala: 16 px = 1 casella, larghezze uguali a quelle di src/map.js (BUILDINGS).
import { pen, ramp, tone, rng, hash, outline, text, textWidth, INK } from './kit.js';
import { facciata as fuelHavana } from './benzinaio.js';
import * as HDF from './fogli.js';

// ---------- Materiali ----------
function intonaco(d, x, y, w, h, col, seed = 1, scrostato = 1) {
  const R = ramp(col), sp = tone(col, -0.35), sl = tone(col, 0.35);
  d.P(R[2], x, y, w, h);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const n = hash(i, j, seed) * 0.5 + hash(i >> 2, j >> 2, seed + 1) * 0.5;
    if (n < 0.16) d.P(sp, x + i, y + j); else if (n > 0.86) d.P(sl, x + i, y + j);
  }
  d.P(R[3], x, y, 1, h); d.P(R[1], x + w - 1, y, 1, h);
  // zoccolo
  const Z = ramp('#9a9488');
  d.P(Z[2], x, y + h - 5, w, 5); d.P(Z[3], x, y + h - 5, w, 1); d.P(Z[1], x, y + h - 1, w, 1);
  const r = rng(seed * 3 + 1);
  for (let k = 0; k < scrostato; k++) { // intonaco scrostato: si vedono i mattoni
    const px = x + 3 + (r() * (w - 16) | 0), py = y + 6 + (r() * (h - 18) | 0);
    d.P(R[1], px - 1, py - 1, 9, 6);
    mattoni(d, px, py, 7, 4, '#b4583a', false);
  }
  // crepa
  let cx = x + 4 + (r() * (w - 8) | 0), cy = y + 2;
  for (let k = 0; k < 7; k++) { d.P(R[0], cx, cy); cx += r() < 0.5 ? 1 : -1; cy += 1; }
}
function mattoni(d, x, y, w, h, col = '#b4583a', bordi = true) {
  const R = ramp(col), malta = '#d8c8a8';
  d.P(malta, x, y, w, h);
  for (let j = 0; j < h; j += 3) for (let i = -((j / 3) % 2) * 3; i < w; i += 6) {
    const B = ramp(hash(i, j, 5) < 0.3 ? tone2(col) : col);
    const xx = Math.max(x, x + i), ww = Math.min(x + w, x + i + 5) - xx;
    if (ww <= 0) continue;
    d.P(B[2], xx, y + j, ww, Math.min(2, h - j)); d.P(B[3], xx, y + j, ww, 1);
  }
  if (bordi) { d.P(R[3], x, y, 1, h); d.P(R[0], x + w - 1, y, 1, h); }
}
function tone2(col) { return ramp(col)[1]; }
function lamiera(d, x, y, w, h, col) {
  const R = ramp(col);
  for (let i = 0; i < w; i++) d.P(R[[3, 2, 1, 2][i % 4]], x + i, y, 1, h);
  d.P(R[0], x, y + h - 1, w, 1);
  const r = rng(w + h);
  for (let k = 0; k < w / 10; k++) { const px = x + (r() * w | 0), py = y + 2 + (r() * (h - 6) | 0); d.P('#a85a2e', px, py, 1, 3 + (r() * 4 | 0)); } // colature di ruggine
}
function legno(d, x, y, w, h, col) {
  for (let i = 0; i < w; i += 5) {
    const R = ramp(hash(i, 1, 9) < 0.5 ? col : ramp(col)[1]);
    d.P(R[2], x + i, y, Math.min(4, w - i), h); d.P(R[3], x + i, y, 1, h); d.P(INK, x + i + 4, y, 1, h);
    d.P('#3a3030', x + i + 2, y + 2); d.P('#3a3030', x + i + 2, y + h - 3);
  }
}
function blocchi(d, x, y, w, h, col) {
  const R = ramp(col);
  d.P(R[2], x, y, w, h);
  for (let j = 0; j < h; j += 5) { d.P(R[1], x, y + j + 4, w, 1); for (let i = ((j / 5) % 2) * 6; i < w; i += 12) d.P(R[1], x + i, y + j, 1, 4); d.P(R[3], x, y + j, w, 1); }
}

function tettoCoppi(d, x, y, w, h, col) {
  const R = ramp(col), CH = [3, 3, 2, 2, 1];
  for (let i = 0; i < w; i++) {
    const k = CH[i % 5] - (hash((i / 5) | 0, 0, 3) < 0.15 ? 1 : 0);
    d.P(R[k], x + i, y, 1, h);
    if (i % 5 === 4) d.P(R[0], x + i, y + 2, 1, h - 2);
  }
  for (let j = 7; j < h - 3; j += 6) for (let i = 0; i < w; i++) { // sovrapposizioni tra le file
    if (i % 5 === 4) continue;
    d.P(R[0], x + i, y + j); d.P(R[4 - (i % 5 > 1 ? 1 : 0)], x + i, y + j + 1);
  }
  d.P(R[3], x, y, w, 2); d.P(R[4], x, y, w, 1);   // colmo
  d.P(R[0], x, y + h - 2, w, 2);                   // gronda
  d.P('#8a8a90', x, y + h - 1, w, 1);
  const r = rng(w * 3 + h);
  for (let k = 0; k < w / 18; k++) { const px = x + (r() * w | 0), py = y + 3 + (r() * (h - 7) | 0); d.P('#5a7a3a', px, py, 2, 1); d.P('#7a9a4a', px, py); }
}
function tettoLamiera(d, x, y, w, h, col) {
  const R = ramp(col);
  for (let i = 0; i < w; i++) d.P(R[[3, 2, 2, 1][i % 4]], x + i, y, 1, h);
  d.P(R[4], x, y, w, 1); d.P(R[0], x, y + h - 2, w, 2);
  const r = rng(w);
  for (let k = 0; k < w / 14; k++) { const px = x + (r() * w | 0); d.P('#a85a2e', px, y + 2 + (r() * (h - 6) | 0), 2, 3); }
}
function tettoPiatto(d, x, y, w, h, col) {
  const R = ramp(col);
  d.P(R[2], x, y, w, h); d.P(R[3], x, y, w, 1); d.P(R[0], x, y + h - 2, w, 2);
  for (let i = 0; i < w; i++) if (hash(i, 3, 4) < 0.2) d.P(R[1], x + i, y + 1 + (hash(i, 5, 6) * (h - 3) | 0));
}
function ombraGronda(d, x, y, w) { d.g.fillStyle = 'rgba(30,18,40,0.32)'; d.g.fillRect(x, y, w, 3); d.g.fillStyle = 'rgba(30,18,40,0.16)'; d.g.fillRect(x, y + 3, w, 2); }

// ---------- Dettagli ----------
function finestra(d, x, y, { w = 10, h = 12, pers = '#3e7a4a', luce = false } = {}) {
  const S = ramp(pers), C = ramp('#ece4d0'), V = ramp(luce ? '#f4d878' : '#7fa8c8');
  const sw = Math.ceil(w / 2) - 1;
  d.P(C[1], x - 1, y - 1, w + 2, h + 2);
  d.P(V[1], x, y, w, h); d.P(V[2], x + 1, y + 1, w - 2, h - 2);
  if (!luce) { d.line(x + 2, y + h - 3, x + w - 3, y + 2, V[4]); }
  d.P(C[2], x + (w >> 1), y, 1, h); d.P(C[2], x, y + (h >> 1), w, 1);
  for (const sx of [x - sw - 1, x + w + 1]) { // persiane aperte
    d.P(S[2], sx, y - 1, sw, h + 2);
    for (let j = y; j < y + h + 1; j += 2) d.P(S[1], sx, j, sw, 1);
    d.P(S[3], sx, y - 1, sw, 1);
  }
  const D = ramp('#b8b0a0'); d.P(D[3], x - 2, y + h + 1, w + 4, 1); d.P(D[1], x - 2, y + h + 2, w + 4, 1); // davanzale
}
function porta(d, x, y, w, h, col, { vetro = false, arco = false } = {}) {
  const R = ramp(col), C = ramp('#ece4d0');
  d.P(C[1], x - 1, y - 1, w + 2, h + 1);
  d.P(R[2], x, y, w, h); d.P(R[3], x, y, 1, h); d.P(R[1], x + w - 1, y, 1, h);
  if (vetro) { const V = ramp('#7fa8c8'); d.P(V[2], x + 2, y + 2, w - 4, h - 7); d.line(x + 3, y + h - 7, x + w - 3, y + 3, V[4]); }
  else { d.P(R[1], x + 2, y + 2, w - 4, (h >> 1) - 3); d.P(R[1], x + 2, y + (h >> 1) + 1, w - 4, (h >> 1) - 3); }
  d.P('#e0c060', x + w - 3, y + (h >> 1), 1, 2);
  d.P('#8a847a', x - 2, y + h, w + 4, 2);
}
function insegna(d, cx, y, testo, bg, fg = '#fff4d8', { bordo = '#f4ecd6' } = {}) {
  const w = textWidth(testo) + 8, x = Math.round(cx - w / 2), R = ramp(bg);
  d.P(bordo, x - 1, y - 1, w + 2, 11); d.P(R[2], x, y, w, 9); d.P(R[3], x, y, w, 1); d.P(R[1], x, y + 8, w, 1);
  text(d, testo, x + 4, y + 2, fg, R[0]);
}
function tenda(d, x, y, w, c1, c2 = '#f4f0e4') {
  const A = ramp(c1), B = ramp(c2);
  for (let i = 0; i < w; i++) {
    const R = Math.floor(i / 4) % 2 ? B : A;
    d.P(R[3], x + i, y, 1, 2); d.P(R[2], x + i, y + 2, 1, 4); d.P(R[1], x + i, y + 6, 1, 1);
    if ((i % 4) === 1 || (i % 4) === 2) d.P(R[1], x + i, y + 7);
  }
  d.g.fillStyle = 'rgba(30,18,40,0.28)'; d.g.fillRect(x, y + 8, w, 3);
}
function lampada(d, x, y) { d.P('#3a3a42', x, y, 4, 1); d.P('#3a3a42', x + 1, y + 1, 2, 2); d.P('#ffe890', x + 1, y + 3, 2, 1); }
function vaso(d, x, y) { const C = ramp('#b8683a'); d.P(C[2], x, y + 3, 5, 4); d.P(C[3], x, y + 3, 5, 1); d.P('#3f8c36', x, y, 5, 3); d.P('#e8382a', x + 1, y); d.P('#e8382a', x + 3, y + 1); }
function grondaia(d, x, y, h) { d.P('#8a8a90', x, y, 2, h); d.P('#b0b0b8', x, y, 1, h); d.P('#8a8a90', x - 1, y + h - 1, 4, 1); }

// Struttura base: tetto (in prospettiva) sopra la facciata
function base(wTiles, hMuro, hTetto, extraW = 0) {
  const W = wTiles * 16 + 6 + extraW, H = hTetto + hMuro;
  const d = pen(W, H + 1);
  d.c.muro = { x: 3, y: hTetto, w: wTiles * 16, h: hMuro }; // la facciata, per le texture 3D del gioco
  return { d, W, H, mx: 3, my: hTetto, mw: wTiles * 16 };
}

// ---------- Edifici ----------
export function casa({ w = 7, h = 2.8, muro = '#ecd49a', tetto = '#b8432e', pers = '#3e7a4a', portaCol = '#7a4a2a', seed = 1, piani = 1, finestre = 2 } = {}) {
  const hM = Math.round(h * 16), { d, W, mx, my, mw } = base(w, hM, 26);
  tettoCoppi(d, 0, 0, W, 27, tetto);
  intonaco(d, mx, my, mw, hM, muro, seed, 1);
  ombraGronda(d, mx, my, mw);
  const pw = 12, ph = 22, px = mx + (mw >> 1) - 6 + (finestre === 1 ? 14 : 0);
  porta(d, px, my + hM - ph - 2, pw, ph, portaCol);
  lampada(d, px + 4, my + hM - ph - 8);
  const fy = piani > 1 ? my + 8 : my + hM - 26;
  const slots = finestre === 1 ? [mx + 18] : [mx + 18, mx + mw - 28];
  for (const fx of slots) finestra(d, fx, fy, { pers });
  if (piani > 1) for (const fx of [mx + 18, mx + mw - 28]) finestra(d, fx, my + hM - 24, { pers, h: 11 });
  if (piani > 1) finestra(d, px + 1, my + 8, { pers, w: 10 });
  vaso(d, px - 7, my + hM - 9); vaso(d, px + pw + 2, my + hM - 9);
  grondaia(d, mx + mw - 3, my, hM);
  return outline(d.c);
}

export function officina() {
  const hM = 48, { d, W, mx, my, mw } = base(7, hM, 22);
  tettoLamiera(d, 0, 0, W, 23, '#6a7078');
  lamiera(d, mx, my, mw, hM, '#8e959e');
  ombraGronda(d, mx, my, mw);
  // saracinesca mezza alzata con l'officina buia dentro
  const sx = mx + 10, sw = 56, sh = 34, sy = my + hM - sh;
  d.P('#1e1a22', sx, sy, sw, sh);
  d.P('#3a3a44', sx + 4, sy + 16, 10, 2); d.P('#c8302a', sx + 30, sy + 20, 12, 8); d.P('#e8c030', sx + 44, sy + 24, 6, 10); // attrezzi e roba dentro
  const S = ramp('#a8adb4');
  for (let j = 0; j < 16; j += 2) { d.P(S[3], sx, sy + j, sw, 1); d.P(S[1], sx, sy + j + 1, sw, 1); }
  d.P(S[0], sx, sy + 16, sw, 1);
  d.P('#5a5a62', sx - 2, sy - 2, sw + 4, 2); d.P('#5a5a62', sx - 2, sy, 2, sh); d.P('#5a5a62', sx + sw, sy, 2, sh);
  insegna(d, mx + (mw >> 1), my + 4, 'DEPOSITO', '#2f4f8a');
  finestra(d, mx + mw - 22, my + 20, { pers: '#6a7078', w: 12, h: 10 });
  for (const [x, yy] of [[mx + mw - 26, 0], [mx + mw - 26, 5], [mx + mw - 18, 0]]) { // gomme impilate
    const G = ramp('#34323a'); d.P(G[2], x, my + hM - 6 - yy, 8, 5); d.P(G[3], x, my + hM - 6 - yy, 8, 1); d.P(G[0], x + 3, my + hM - 4 - yy, 2, 2);
  }
  d.g.fillStyle = 'rgba(20,16,24,0.35)'; d.g.fillRect(sx + 8, my + hM - 2, 14, 2); // macchia d'olio
  return outline(d.c);
}

export function bar() {
  const hM = 46, { d, W, mx, my, mw } = base(7, hM, 26);
  tettoCoppi(d, 0, 0, W, 27, '#3a7a4a');
  intonaco(d, mx, my, mw, hM, '#e8dcc0', 4, 1);
  ombraGronda(d, mx, my, mw);
  insegna(d, mx + (mw >> 1), my + 4, 'BAR SPORT', '#2a6a3a');
  tenda(d, mx + 4, my + 15, mw - 8, '#2a7a3a');
  // vetrina e porta a vetri
  const V = ramp('#7fa8c8');
  d.P('#ece4d0', mx + 9, my + 25, 46, 16); d.P(V[2], mx + 10, my + 26, 44, 14);
  d.line(mx + 14, my + 38, mx + 26, my + 27, V[4]); d.line(mx + 20, my + 38, mx + 31, my + 27, V[3]);
  d.P('#e8c050', mx + 40, my + 34, 2, 3); d.P('#d8382a', mx + 45, my + 33, 2, 4); d.P('#3a2a20', mx + 34, my + 30, 18, 2); // bancone e bottiglie
  porta(d, mx + 70, my + 24, 13, 20, '#6a4a2a', { vetro: true });
  d.P('#f4ecd6', mx + 87, my + 26, 9, 11); d.P('#c8b890', mx + 87, my + 36, 9, 1); text(d, 'IN', mx + 88, my + 28, '#2a6a3a'); // lavagnetta
  return outline(d.c);
}

export function alimentari() {
  const hM = 45, { d, W, mx, my, mw } = base(7, hM, 26);
  tettoCoppi(d, 0, 0, W, 27, '#b8432e');
  intonaco(d, mx, my, mw, hM, '#e8c070', 6, 1);
  ombraGronda(d, mx, my, mw);
  insegna(d, mx + (mw >> 1), my + 4, 'ALIMENTARI', '#b8432e');
  tenda(d, mx + 4, my + 15, mw - 8, '#c8302a');
  const V = ramp('#7fa8c8');
  d.P('#ece4d0', mx + 8, my + 26, 36, 14); d.P(V[2], mx + 9, my + 27, 34, 12); d.line(mx + 12, my + 37, mx + 22, my + 28, V[4]);
  for (let i = 0; i < 4; i++) d.P(['#f0c030', '#d8382a', '#3e8a4a', '#e8a030'][i], mx + 12 + i * 8, my + 33, 5, 4); // scaffali
  porta(d, mx + 58, my + 23, 13, 20, '#6a4a2a', { vetro: true });
  // cassette di frutta fuori
  for (const [x, c] of [[mx + 78, '#d8382a'], [mx + 90, '#f0c030'], [mx + 84, '#3e8a4a']]) {
    const yy = c === '#3e8a4a' ? my + hM - 14 : my + hM - 8;
    const L = ramp('#b88a4a'); d.P(L[2], x, yy + 2, 11, 6); d.P(L[3], x, yy + 2, 11, 1);
    for (let i = 0; i < 4; i++) { const F = ramp(c); d.P(F[2], x + 1 + i * 2.5, yy, 2, 2); d.P(F[4], x + 1 + i * 2.5, yy); }
  }
  return outline(d.c);
}

export function tabacchi() {
  const hM = 45, { d, W, mx, my, mw } = base(6, hM, 24);
  tettoCoppi(d, 0, 0, W, 25, '#b8432e');
  intonaco(d, mx, my, mw, hM, '#f0e0b0', 8, 1);
  ombraGronda(d, mx, my, mw);
  // insegna a bandiera blu con la T
  const B = ramp('#2f4fa8');
  d.P('#5a5a62', mx + mw - 18, my + 7, 8, 1);
  d.P(B[2], mx + mw - 14, my + 8, 11, 12); d.P(B[3], mx + mw - 14, my + 8, 11, 1); d.P(B[0], mx + mw - 14, my + 19, 11, 1);
  d.P('#f4f2ea', mx + mw - 12, my + 10, 7, 2); d.P('#f4f2ea', mx + mw - 10, my + 12, 3, 6);
  insegna(d, mx + 34, my + 5, 'TABACCHI', '#3a3a44');
  porta(d, mx + 46, my + 23, 12, 20, '#4a3a2a', { vetro: true });
  finestra(d, mx + 16, my + 22, { pers: '#7a4a2a', w: 12, h: 12 });
  d.P('#c8302a', mx + 62, my + 30, 6, 9); d.P('#f4ecd6', mx + 63, my + 32, 4, 2); // cassetta delle lettere / distributore
  return outline(d.c);
}

export function municipio() {
  const hM = 58, { d, W, mx, my, mw } = base(5, hM, 22);
  tettoCoppi(d, 0, 0, W, 23, '#8a3a2a');
  intonaco(d, mx, my, mw, hM, '#e8dcc0', 10, 0);
  ombraGronda(d, mx, my, mw);
  insegna(d, mx + 40, my + 5, 'MUNICIPIO', '#6a5a48');
  // balcone con bandiera
  finestra(d, mx + 35, my + 19, { pers: '#3e5a7a', w: 10, h: 11 });
  d.P('#8a847a', mx + 28, my + 32, 24, 2); for (let i = mx + 29; i < mx + 51; i += 3) d.P('#5a5a62', i, my + 28, 1, 4); d.P('#5a5a62', mx + 28, my + 27, 24, 1);
  d.line(mx + 52, my + 28, mx + 60, my + 16, '#5a5a62');
  d.P('#2a8a3a', mx + 56, my + 15, 3, 7); d.P('#f4f2ea', mx + 59, my + 15, 3, 7); d.P('#d8302a', mx + 62, my + 15, 3, 7);
  porta(d, mx + 33, my + hM - 20, 14, 18, '#5a3a22');
  d.P('#b8b0a0', mx + 29, my + hM - 2, 22, 2);
  for (const fx of [mx + 10, mx + 62]) { finestra(d, fx, my + 19, { pers: '#3e5a7a', w: 8, h: 11 }); finestra(d, fx, my + 39, { pers: '#3e5a7a', w: 8, h: 10 }); }
  return outline(d.c);
}

export function paradiso() {
  const hM = 48, { d, W, mx, my, mw } = base(8, hM, 20);
  tettoPiatto(d, 0, 0, W, 21, '#2a2030');
  intonaco(d, mx, my, mw, hM, '#6a3a7a', 12, 0);
  ombraGronda(d, mx, my, mw);
  // insegna al neon con alone
  const t = 'PARADISO', tw = textWidth(t), tx = mx + (mw - tw) / 2 | 0;
  d.g.fillStyle = 'rgba(255,80,200,0.25)'; d.g.fillRect(tx - 6, my + 3, tw + 12, 13);
  d.P('#2a1a30', tx - 4, my + 5, tw + 8, 9);
  text(d, t, tx, my + 7, '#ff6ad8', '#a02a88');
  for (const [x, y] of [[mx + 10, my + 8], [mx + mw - 14, my + 6], [mx + 20, my + 20], [mx + mw - 24, my + 22]]) { // stelline
    d.P('#ffe870', x, y - 1); d.P('#ffe870', x - 1, y); d.P('#fff8c0', x, y); d.P('#ffe870', x + 1, y); d.P('#ffe870', x, y + 1);
  }
  // porta con tenda rossa e cordone
  d.P('#1a1018', mx + 52, my + 22, 18, 24); d.P('#a81a3a', mx + 53, my + 23, 16, 22);
  for (let x = mx + 55; x < mx + 69; x += 3) d.P('#d83a5a', x, my + 23, 1, 22);
  d.P('#ffd060', mx + 50, my + 21, 22, 1);
  for (const x of [mx + 38, mx + 82]) { d.P('#e0c060', x, my + 38, 2, 8); d.P('#f4e090', x - 1, my + 37, 4, 1); }
  d.line(mx + 40, my + 40, mx + 50, my + 42, '#c8202a'); d.line(mx + 72, my + 42, mx + 82, my + 40, '#c8202a');
  // finestrelle oscurate rosa
  for (const x of [mx + 12, mx + 100]) { d.P('#1a1018', x, my + 24, 12, 10); d.P('#d84aa8', x + 1, my + 25, 10, 8); d.P('#ff9ae0', x + 2, my + 26, 3, 1); }
  return outline(d.c);
}

export function capannoneMaiali({ w = 12, scritta = true } = {}) {
  const hM = 42, { d, W, mx, my, mw } = base(w, hM, 22);
  tettoLamiera(d, 0, 0, W, 23, '#8a4a32');
  blocchi(d, mx, my, mw, hM, '#b0aca0');
  ombraGronda(d, mx, my, mw);
  for (let x = mx + 10; x < mx + mw - 20; x += 26) { d.P('#3a3a42', x, my + 8, 14, 5); d.P('#6a7a8a', x + 1, my + 9, 12, 3); } // finestrelle alte
  // portone scorrevole
  const L = ramp('#8a4a32'), pw = 40, px = mx + mw - pw - 18;
  d.P('#2a2228', px, my + 16, pw, hM - 16);
  d.P(L[2], px + 12, my + 16, pw - 12, hM - 16);
  for (let i = px + 12; i < px + pw; i += 4) d.P(L[1], i, my + 16, 1, hM - 16);
  d.line(px + 12, my + 16, px + pw - 1, my + hM - 1, L[3]); d.line(px + 12, my + hM - 1, px + pw - 1, my + 16, L[3]);
  d.P('#5a5a62', px - 2, my + 14, pw + 6, 2);
  if (scritta) insegna(d, mx + 40, my + 20, 'MAIALI', '#8a4a32');
  // fango sul fondo
  for (let i = 0; i < mw; i++) d.P(hash(i >> 2, 2, 7) < 0.5 ? '#6e5232' : '#7e6040', mx + i, my + hM - 3 - (hash(i >> 2, 3, 2) * 2 | 0), 1, 3);
  return outline(d.c);
}

export function magazzino() { // il Bubetto
  const hM = 50, { d, W, mx, my, mw } = base(8, hM, 22);
  tettoLamiera(d, 0, 0, W, 23, '#4a7a5a');
  lamiera(d, mx, my, mw, hM, '#a8a49a');
  ombraGronda(d, mx, my, mw);
  insegna(d, mx + (mw >> 1), my + 5, 'BUBETTO', '#4a7a5a');
  const G = ramp('#5a6a5a'), px = mx + 34, pw = 60;
  d.P(G[2], px, my + 18, pw, hM - 18);
  for (let j = my + 20; j < my + hM; j += 3) d.P(G[1], px, j, pw, 1);
  d.P(G[3], px, my + 18, pw, 1); d.P('#3a3a42', px + (pw >> 1), my + 18, 1, hM - 18);
  for (const [x, c] of [[mx + 8, '#c8302a'], [mx + 18, '#2f5e9a']]) { const R = ramp(c); d.cyl(x, my + hM - 14, 8, 13, R); d.P(R[0], x, my + hM - 9, 8, 1); }
  return outline(d.c);
}

export function fienile() {
  const hM = 52, { d, W, mx, my, mw } = base(7, hM, 26);
  tettoCoppi(d, 0, 0, W, 27, '#7a4a26');
  d.P('#2a1e18', mx, my, mw, hM);
  d.g.fillStyle = 'rgba(0,0,0,0.25)'; d.g.fillRect(mx, my, mw, 6);
  // balle impilate dentro
  const Hb = ramp('#d0a448');
  for (let row = 0; row < 3; row++) for (let i = 0; i < 6; i++) {
    const x = mx + 6 + i * 17 + (row % 2) * 6, y = my + hM - 13 - row * 12;
    if (x + 15 > mx + mw - 4) continue;
    d.P(Hb[2], x, y, 15, 11); d.P(Hb[3], x, y, 15, 2); d.P(Hb[1], x, y + 9, 15, 2); d.P('#8a5a2a', x + 4, y, 1, 11); d.P('#8a5a2a', x + 10, y, 1, 11);
  }
  // pilastri in mattoni
  for (const x of [mx, mx + (mw >> 1) - 4, mx + mw - 9]) mattoni(d, x, my, 9, hM, '#b4583a');
  return outline(d.c);
}

export function cascina({ muro = '#e0c48a', tetto = '#a8462e', w = 8 } = {}) {
  const hM = 46, { d, W, mx, my, mw } = base(w, hM, 26);
  tettoCoppi(d, 0, 0, W, 27, tetto);
  const pw = 52; // portico ad archi in mattoni a sinistra
  intonaco(d, mx + pw, my, mw - pw, hM, muro, 14, 1);
  mattoni(d, mx, my, pw, hM, '#b4583a');
  for (let k = 0; k < 2; k++) {
    const ax = mx + 5 + k * 24, aw = 19;
    for (let y = 0; y < hM - 10; y++) for (let x = 0; x < aw; x++) {
      const nx = (x - aw / 2 + 0.5) / (aw / 2), ny = (y - 9) / 9;
      if (y >= 9 || nx * nx + ny * ny <= 1) d.P(y < 14 ? '#1e1418' : '#2a1e1a', ax + x, my + 10 + y);
    }
    d.P('#6a4a2a', ax + 3, my + hM - 8, 5, 6); d.P('#d0a448', ax + 10, my + hM - 9, 7, 7); // carretto e balla nel portico
  }
  ombraGronda(d, mx, my, mw);
  porta(d, mx + pw + 22, my + hM - 24, 12, 22, '#6a4a2a');
  finestra(d, mx + pw + 6, my + 14, { pers: '#6a4a2a', w: 8, h: 10 }); finestra(d, mx + mw - 18, my + 14, { pers: '#6a4a2a', w: 8, h: 10 });
  return outline(d.c);
}

export function ranch() {
  const hM = 48, { d, W, mx, my, mw } = base(9, hM, 14, 0);
  // finta facciata western alta
  tettoPiatto(d, 0, 4, W, 11, '#7a2a22');
  legno(d, mx, my, mw, hM, '#9a6a3a');
  const L = ramp('#7a4a2a');
  d.P(L[2], mx + 30, my - 12, mw - 60, 14); d.P(L[3], mx + 30, my - 12, mw - 60, 1);
  text(d, 'RANCH', mx + (mw >> 1) - 9, my - 8, '#f4e0a0', L[0]);
  // portico
  d.P(L[1], mx - 2, my + 14, mw + 4, 3); d.P(L[3], mx - 2, my + 14, mw + 4, 1);
  for (let x = mx; x < mx + mw; x += 28) d.P(L[2], x, my + 17, 3, hM - 17);
  d.g.fillStyle = 'rgba(30,18,40,0.3)'; d.g.fillRect(mx, my + 17, mw, 6);
  porta(d, mx + (mw >> 1) - 7, my + hM - 22, 14, 20, '#5a3a22');
  finestra(d, mx + 20, my + 24, { pers: '#7a2a22', w: 10, h: 10 }); finestra(d, mx + mw - 32, my + 24, { pers: '#7a2a22', w: 10, h: 10 });
  // teschio di mucca
  d.P('#f4ecd6', mx + (mw >> 1) - 3, my + 4, 6, 5); d.P(INK, mx + (mw >> 1) - 2, my + 6); d.P(INK, mx + (mw >> 1) + 1, my + 6);
  d.P('#f4ecd6', mx + (mw >> 1) - 6, my + 3, 3, 1); d.P('#f4ecd6', mx + (mw >> 1) + 3, my + 3, 3, 1);
  return outline(d.c);
}

export function gallinaio() {
  const hM = 22, { d, W, mx, my, mw } = base(3, hM, 12);
  tettoLamiera(d, 0, 0, W, 13, '#7a4a26');
  legno(d, mx, my, mw, hM, '#b08050');
  d.P('#1e1418', mx + 18, my + 9, 8, 10); d.P('#2a1e1a', mx + 18, my + 9, 8, 2);
  const L = ramp('#9a6a3a'); d.line(mx + 20, my + 19, mx + 34, my + hM, L[2], 2);
  d.P('#f4ecd6', mx + 6, my + 8, 6, 5); d.P('#d83a2a', mx + 8, my + 9, 2, 1); // gallina alla finestra
  return outline(d.c);
}

export function tettoia() {
  const hM = 36, { d, W, mx, my, mw } = base(5, hM, 16);
  tettoLamiera(d, 0, 0, W, 17, '#6a7078');
  d.P('#2a2228', mx, my, mw, hM);
  d.g.fillStyle = 'rgba(0,0,0,0.2)'; d.g.fillRect(mx, my, mw, 8);
  const L = ramp('#8a5a32'); // legna accatastata
  for (let j = 0; j < 4; j++) for (let i = 0; i < 9 - j; i++) { const lx = mx + 9 + i * 7 + j * 3.5, ly = my + hM - 5 - j * 6; d.ball(lx, ly, 3, 3, L); d.ell(lx, ly, 1.5, 1.5, '#d8b080'); d.P('#b08858', lx, ly); }
  for (const x of [mx, mx + mw - 4]) { d.P(L[2], x, my, 4, hM); d.P(L[3], x, my, 1, hM); }
  return outline(d.c);
}

// ---------- Edifici del paese esplorabili (chiesa, castello, negozi, meccanico) ----------
function arco(d, x, y, w, h, col) { // vano ad arco a tutto sesto, pieno di col
  const r = w / 2;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const nx = (i + 0.5 - r) / r, ny = (j + 0.5 - r) / r;
    if (j >= r || nx * nx + ny * ny <= 1) d.P(col, x + i, y + j);
  }
}
function pietre(d, x, y, w, h, col, seed = 3) { // conci di pietra irregolari
  const R = ramp(col);
  d.P(R[1], x, y, w, h);
  for (let j = 0; j < h; j += 6) {
    let i = -((j / 6) % 2) * 5 - (hash(j, 1, seed) * 4 | 0);
    while (i < w) {
      const l = 8 + (hash(i, j, seed) * 7 | 0), xx = Math.max(x, x + i), ww = Math.min(x + w, x + i + l - 1) - xx;
      if (ww > 0) {
        const B = ramp(tone(col, (hash(i, j, seed + 2) - 0.5) * 0.5));
        d.P(B[2], xx, y + j, ww, Math.min(5, h - j)); d.P(B[3], xx, y + j, ww, 1); d.P(B[1], xx, y + j + Math.min(4, h - j - 1), ww, 1);
      }
      i += l;
    }
  }
}
function vetrina(d, x, y, w, h, merce = []) {
  const V = ramp('#7fa8c8');
  d.P('#ece4d0', x - 1, y - 1, w + 2, h + 2); d.P(V[2], x, y, w, h);
  merce.forEach(([mx, my, mw, mh, c]) => d.P(c, x + mx, y + my, mw, mh));
  d.line(x + 3, y + h - 3, x + Math.min(w - 3, h + 1), y + 2, V[4]);
}

export function chiesa() {
  const hM = 67, { d, W, mx, my, mw } = base(8, hM, 28);
  tettoCoppi(d, 0, 0, W, 29, '#a8462e');
  intonaco(d, mx, my, mw, hM, '#efe2c4', 21, 0);
  ombraGronda(d, mx, my, mw);
  const cx = mx + (mw >> 1);
  // timpano e lesene
  const C = ramp('#d8c8a0');
  d.poly([[mx + 6, my + 22], [cx, my + 6], [mx + mw - 6, my + 22]], C[3]);
  d.poly([[mx + 12, my + 20], [cx, my + 10], [mx + mw - 12, my + 20]], C[2]);
  d.P(C[1], mx + 6, my + 22, mw - 12, 2);
  for (const x of [mx + 6, mx + 26, mx + mw - 32, mx + mw - 12]) { d.P(C[3], x, my + 24, 6, hM - 26); d.P(C[1], x + 5, my + 24, 1, hM - 26); }
  // croce in cima
  d.P('#c8a040', cx - 1, my - 2, 2, 9); d.P('#c8a040', cx - 4, my + 1, 8, 2);
  // rosone
  d.ell(cx, my + 31, 7, 7, '#ece4d0'); d.ell(cx, my + 31, 6, 6, '#3a5aa8');
  for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; d.P(['#d8382a', '#f0c030', '#3e8a4a', '#f4f0e4'][k % 4], cx + Math.cos(a) * 3.5, my + 31 + Math.sin(a) * 3.5, 2, 2); }
  d.P('#f0c030', cx - 1, my + 30, 2, 2);
  // portale ad arco
  const pw = 18, ph = 25, px = cx - pw / 2, py = my + hM - ph - 2;
  arco(d, px - 2, py - 2, pw + 4, ph + 2, '#d8c8a0');
  arco(d, px, py, pw, ph, '#5a3218');
  const L = ramp('#6a3a1c');
  for (let i = 2; i < pw - 1; i += 3) d.P(L[1], px + i, py + 9, 1, ph - 9);
  d.P(INK, cx, py + 3, 1, ph - 3); d.P('#e0c060', cx - 3, py + 15, 2, 2); d.P('#e0c060', cx + 2, py + 15, 2, 2);
  // finestre ad arco laterali
  for (const x of [mx + 14, mx + mw - 21]) { arco(d, x - 1, my + 30, 9, 15, '#d8c8a0'); arco(d, x, my + 31, 7, 13, '#3a5aa8'); d.P('#d8382a', x + 2, my + 37, 3, 3); d.P('#f0c030', x + 3, my + 34, 1, 2); }
  // gradini del sagrato
  const G = ramp('#b8b0a0'); d.P(G[3], px - 8, my + hM - 2, pw + 16, 1); d.P(G[2], px - 8, my + hM - 1, pw + 16, 1);
  return outline(d.c);
}

export function campanile() {
  const hM = 120, { d, W, mx, my, mw } = base(2, hM, 10);
  tettoLamiera(d, 0, 0, W, 11, '#7a3a2a');
  mattoni(d, mx, my, mw, hM, '#b4583a');
  const C = ramp('#d8c8a0');
  d.P(C[3], mx, my, mw, 3); d.P(C[2], mx, my + 40, mw, 2); d.P(C[2], mx, my + 76, mw, 2);
  // cella campanaria con la campana
  arco(d, mx + 6, my + 8, 20, 28, '#1e1418');
  const B = ramp('#c8a040'); d.ball(mx + 16, my + 22, 6, 6, B); d.P(B[1], mx + 9, my + 26, 14, 3); d.P('#5a3a22', mx + 15, my + 12, 2, 5);
  // orologio
  d.ell(mx + 16, my + 56, 9, 9, C[1]); d.ell(mx + 16, my + 56, 8, 8, '#f4f0e4');
  for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; d.P(INK, mx + 16 + Math.cos(a) * 6.5, my + 56 + Math.sin(a) * 6.5); }
  d.line(mx + 16, my + 56, mx + 16, my + 51, INK); d.line(mx + 16, my + 56, mx + 20, my + 57, INK);
  // feritoie
  for (const y of [my + 84, my + 100]) { d.P('#1e1418', mx + 14, y, 4, 9); d.P(C[3], mx + 13, y + 9, 6, 1); }
  return outline(d.c);
}

export function castello({ w = 9 } = {}) {
  const hM = 72, { d, W, mx, my, mw } = base(w, hM, 10);
  pietre(d, mx, my - 10, mw, hM + 10, '#a8a090', 9);
  // merli sul davanti (in vista sopra il muro)
  const P2 = ramp('#a8a090');
  for (let x = mx; x < mx + mw; x += 12) d.P('#00000000', x + 6, my - 10, 6, 6);
  d.g.clearRect(0, 0, W, my - 4);
  for (let x = mx; x < mx + mw - 4; x += 12) { d.P(P2[2], x, my - 6, 7, 6); d.P(P2[3], x, my - 6, 7, 1); }
  ombraGronda(d, mx, my, mw);
  const cx = mx + (mw >> 1);
  // portone ad arco con la grata alzata
  const pw = 26, ph = 34, px = cx - pw / 2, py = my + hM - ph;
  arco(d, px - 3, py - 3, pw + 6, ph + 3, '#7a7466');
  arco(d, px, py, pw, ph, '#1e1418');
  const L = ramp('#6a3a1c');
  arco(d, px + 2, py + 6, pw - 4, ph - 6, L[2]);
  for (let i = px + 4; i < px + pw - 3; i += 4) d.P(L[1], i, py + 10, 1, ph - 10);
  for (let j = py + 14; j < py + ph; j += 8) d.P('#3a3a42', px + 3, j, pw - 6, 1);
  for (let i = px + 1; i < px + pw - 1; i += 4) d.P('#4a4a52', i, py + 1, 2, 5); // punte della grata
  // stemma e stendardi
  const S = ramp('#2f4f8a');
  d.P(S[2], cx - 6, my + 8, 12, 12); d.P(S[3], cx - 6, my + 8, 12, 1); d.poly([[cx - 6, my + 20], [cx + 6, my + 20], [cx, my + 26]], S[2]);
  d.P('#f0c030', cx - 1, my + 11, 2, 10); d.P('#f0c030', cx - 4, my + 14, 8, 2);
  for (const x of [mx + 18, mx + mw - 28]) {
    const R = ramp('#a8302a'); d.P('#5a5a62', x - 1, my + 6, 12, 1);
    d.P(R[2], x, my + 7, 10, 22); d.P(R[3], x, my + 7, 1, 22); d.poly([[x, my + 29], [x + 10, my + 29], [x + 5, my + 33]], R[2]);
    d.P('#f0c030', x + 3, my + 14, 4, 4);
  }
  // feritoie
  for (const x of [mx + 12, mx + 40, mx + mw - 44, mx + mw - 16]) { d.P('#1e1418', x, my + 40, 3, 10); d.P('#1e1418', x - 2, my + 44, 7, 2); }
  return outline(d.c);
}

export function torre() {
  const hM = 104, { d, W, mx, my, mw } = base(3, hM, 10);
  pietre(d, mx, my - 10, mw, hM + 10, '#9a9484', 13);
  d.g.clearRect(0, 0, W, my - 4);
  const P2 = ramp('#9a9484');
  for (let x = mx; x < mx + mw - 4; x += 10) { d.P(P2[2], x, my - 6, 6, 6); d.P(P2[3], x, my - 6, 6, 1); }
  ombraGronda(d, mx, my, mw);
  for (const y of [my + 20, my + 50, my + 80]) { arco(d, mx + 20, y, 8, 12, '#1e1418'); d.P('#f4d878', mx + 22, y + 6, 4, 4); }
  return outline(d.c);
}

export function farmacia() {
  const hM = 45, { d, W, mx, my, mw } = base(6, hM, 24);
  tettoCoppi(d, 0, 0, W, 25, '#a83a2a');
  intonaco(d, mx, my, mw, hM, '#ece6d6', 23, 0);
  ombraGronda(d, mx, my, mw);
  insegna(d, mx + 36, my + 4, 'FARMACIA', '#2a8a4a');
  // croce verde luminosa a bandiera
  const G = ramp('#3ac85a'), cx = mx + mw - 12, cy = my + 13;
  d.P('#5a5a62', cx - 8, cy, 3, 1);
  d.P(G[1], cx - 5, cy - 2, 11, 5); d.P(G[1], cx - 2, cy - 5, 5, 11); d.P(G[3], cx - 4, cy - 1, 9, 3); d.P(G[3], cx - 1, cy - 4, 3, 9); d.P(G[4], cx, cy, 1, 1);
  vetrina(d, mx + 8, my + 20, 34, 18, [[3, 10, 4, 6, '#f4f0e4'], [9, 12, 3, 4, '#d83a2a'], [14, 9, 5, 7, '#3a8ac8'], [21, 11, 4, 5, '#f0c030'], [27, 10, 4, 6, '#3e8a4a'], [2, 16, 30, 1, '#c8c8c8']]);
  porta(d, mx + 56, my + hM - 22, 13, 20, '#3a6a4a', { vetro: true });
  d.P('#f4f0e4', mx + 74, my + 26, 12, 10); d.P('#2a8a4a', mx + 74, my + 26, 12, 2); for (let j = my + 30; j < my + 35; j += 2) d.P('#8a8a8a', mx + 76, j, 8, 1); // orari
  return outline(d.c);
}

export function ambulatorio() {
  const hM = 48, { d, W, mx, my, mw } = base(6, hM, 26);
  tettoCoppi(d, 0, 0, W, 27, '#8a3a2a');
  intonaco(d, mx, my, mw, hM, '#e4ecf0', 25, 1);
  ombraGronda(d, mx, my, mw);
  insegna(d, mx + (mw >> 1), my + 4, 'STUDIO MEDICO', '#2f5e9a');
  finestra(d, mx + 14, my + 20, { pers: '#4a6a8a', w: 12, h: 12 });
  finestra(d, mx + mw - 26, my + 20, { pers: '#4a6a8a', w: 12, h: 12 });
  porta(d, mx + 42, my + hM - 24, 13, 22, '#4a5a6a', { vetro: true });
  // targa d'ottone e croce rossa
  d.P('#c8a040', mx + 58, my + 26, 9, 6); d.P('#8a6a20', mx + 59, my + 28, 7, 1); d.P('#8a6a20', mx + 59, my + 30, 5, 1);
  d.P('#f4f0e4', mx + 45, my + 16, 7, 7); d.P('#d83a2a', mx + 47, my + 17, 3, 5); d.P('#d83a2a', mx + 46, my + 18, 5, 3);
  vaso(d, mx + 34, my + hM - 9);
  return outline(d.c);
}

export function palestra() {
  const hM = 51, { d, W, mx, my, mw } = base(7, hM, 20);
  tettoPiatto(d, 0, 0, W, 21, '#4a4a52');
  blocchi(d, mx, my, mw, hM, '#d0ccc0');
  ombraGronda(d, mx, my, mw);
  // fascia gialla e insegna
  d.P('#e8b030', mx, my + 5, mw, 12); d.P('#f4d060', mx, my + 5, mw, 1); d.P('#a87a18', mx, my + 16, mw, 1);
  text(d, "BICIPITE D'ORO", mx + ((mw - textWidth("BICIPITE D'ORO")) >> 1), my + 9, '#2a2228', '#f8e8a0');
  // vetrate con i pesi dentro
  vetrina(d, mx + 6, my + 24, 52, 20, [[4, 12, 16, 2, '#3a3a42'], [3, 9, 3, 8, '#2a2a30'], [18, 9, 3, 8, '#2a2a30'], [30, 6, 3, 13, '#c83a2a'], [29, 5, 5, 2, '#5a5a62'], [40, 14, 9, 4, '#3a3a42']]);
  porta(d, mx + 70, my + hM - 23, 14, 21, '#3a3a42', { vetro: true });
  // manubrio dipinto
  d.P('#2a2228', mx + 92, my + 30, 3, 10); d.P('#2a2228', mx + 95, my + 34, 10, 2); d.P('#2a2228', mx + 105, my + 30, 3, 10);
  return outline(d.c);
}

export function pizzeria() {
  const hM = 45, { d, W, mx, my, mw } = base(6, hM, 26);
  tettoCoppi(d, 0, 0, W, 27, '#b8432e');
  intonaco(d, mx, my, mw, hM, '#f0d8a8', 27, 1);
  ombraGronda(d, mx, my, mw);
  insegna(d, mx + (mw >> 1), my + 3, 'BELLA NAPOLI', '#2a7a3a');
  tenda(d, mx + 4, my + 14, mw - 8, '#c8302a');
  // vetrina col forno acceso
  vetrina(d, mx + 8, my + 26, 34, 14, [[4, 4, 12, 9, '#6a3a22'], [7, 7, 6, 5, '#ff9a30'], [8, 8, 4, 3, '#ffe060'], [21, 6, 8, 2, '#f4f0e4'], [20, 8, 10, 1, '#d84a3a']]);
  porta(d, mx + 56, my + hM - 22, 13, 20, '#6a4a2a', { vetro: true });
  // tricolore
  d.P('#2a8a3a', mx + 76, my + 26, 4, 8); d.P('#f4f2ea', mx + 80, my + 26, 4, 8); d.P('#d8302a', mx + 84, my + 26, 4, 8);
  vaso(d, mx + 48, my + hM - 9);
  return outline(d.c);
}

export function kebab() {
  const hM = 45, { d, W, mx, my, mw } = base(4, hM, 22);
  tettoPiatto(d, 0, 0, W, 23, '#5a4a3a');
  intonaco(d, mx, my, mw, hM, '#f4e4b8', 29, 0);
  ombraGronda(d, mx, my, mw);
  d.P('#c8401a', mx, my + 4, mw, 11); d.P('#e86a2a', mx, my + 4, mw, 1);
  text(d, 'KEBAB', mx + ((mw - textWidth('KEBAB')) >> 1), my + 7, '#fff0c0', '#6a1a0a');
  // vetrina con lo spiedo che gira
  vetrina(d, mx + 4, my + 20, 26, 18, [[10, 3, 2, 14, '#8a8a90'], [7, 5, 8, 10, '#a8602a'], [8, 6, 2, 8, '#c8803a'], [17, 12, 6, 3, '#e8e0c0']]);
  porta(d, mx + 38, my + hM - 22, 12, 20, '#4a3a2a', { vetro: true });
  d.P('#2a2228', mx + 52, my + 22, 9, 12); d.P('#f4f0e4', mx + 53, my + 24, 7, 1); d.P('#f4f0e4', mx + 53, my + 27, 5, 1); d.P('#f4f0e4', mx + 53, my + 30, 6, 1); // lavagnetta
  return outline(d.c);
}

export function meccanico() {
  const hM = 51, { d, W, mx, my, mw } = base(8, hM, 22);
  tettoLamiera(d, 0, 0, W, 23, '#3a5a8a');
  lamiera(d, mx, my, mw, hM, '#b4bac2');
  ombraGronda(d, mx, my, mw);
  insegna(d, mx + 44, my + 4, 'DA ZENO', '#c8302a');
  // saracinesca aperta: dentro il ponte con una macchina sollevata
  const sx = mx + 8, sw = 64, sh = 36, sy = my + hM - sh;
  d.P('#1e1a22', sx, sy, sw, sh);
  d.P('#4a4a52', sx + 10, sy + 24, 3, 12); d.P('#4a4a52', sx + 50, sy + 24, 3, 12); d.P('#e8c030', sx + 8, sy + 22, 48, 2);
  const A = ramp('#d8d4c8'); d.P(A[2], sx + 14, sy + 12, 36, 9); d.P(A[3], sx + 18, sy + 7, 24, 5); d.P('#7fa8c8', sx + 21, sy + 8, 18, 3);
  d.ball(sx + 20, sy + 21, 3, 3, ramp('#34323a')); d.ball(sx + 44, sy + 21, 3, 3, ramp('#34323a'));
  const S = ramp('#a8adb4'); for (let j = 0; j < 6; j += 2) { d.P(S[3], sx, sy + j, sw, 1); d.P(S[1], sx, sy + j + 1, sw, 1); }
  d.P('#5a5a62', sx - 2, sy - 2, sw + 4, 2); d.P('#5a5a62', sx - 2, sy, 2, sh); d.P('#5a5a62', sx + sw, sy, 2, sh);
  // porta, gomme e cartello GOMMISTA
  porta(d, mx + 88, my + hM - 22, 12, 20, '#3a5a8a', { vetro: true });
  insegna(d, mx + 109, my + 24, 'GOMME', '#2a2a30');
  for (const [x, yy] of [[mx + 104, 0], [mx + 104, 5], [mx + 113, 0]]) { const G = ramp('#34323a'); d.P(G[2], x, my + hM - 6 - yy, 8, 5); d.P(G[3], x, my + hM - 6 - yy, 8, 1); d.P(G[0], x + 3, my + hM - 4 - yy, 2, 2); }
  d.g.fillStyle = 'rgba(20,16,24,0.35)'; d.g.fillRect(sx + 20, my + hM - 2, 16, 2);
  return outline(d.c);
}

// Consorzio agrario di Mister Rodella: capannone verde, saracinesca aperta sui sacchi di mangime,
// vetrina con le bustine di semi e il muso di un trattore nuovo in esposizione
export function consorzio() {
  const hM = 54, { d, W, mx, my, mw } = base(10, hM, 22);
  tettoLamiera(d, 0, 0, W, 23, '#2a6a3a');
  lamiera(d, mx, my, mw, hM, '#c8ccc0');
  d.P('#2a6a3a', mx, my + hM - 6, mw, 6); d.P('#3e8a4e', mx, my + hM - 6, mw, 1);            // zoccolo verde
  ombraGronda(d, mx, my, mw);
  insegna(d, mx + (mw >> 1), my + 4, 'CONSORZIO AGRARIO RODELLA', '#2a6a3a', '#fff2b0', { bordo: '#e0b030' });
  // saracinesca aperta: sacchi di mangime impilati
  const sx = mx + 6, sw = 50, sh = 34, sy = my + hM - sh;
  d.P('#1e1a22', sx, sy, sw, sh);
  const SA = ramp('#e8dcb8'), SB = ramp('#c8a868');
  for (let row = 0; row < 3; row++) for (let i = 0; i < 4; i++) {
    const x = sx + 3 + i * 12 + (row % 2) * 5, y = sy + sh - 9 - row * 8; if (x + 10 > sx + sw - 2) continue;
    const R = (i + row) % 3 ? SA : SB;
    d.P(R[2], x, y, 10, 8); d.P(R[3], x, y, 10, 1); d.P(R[1], x, y + 7, 10, 1); d.P('#2a6a3a', x + 3, y + 3, 4, 2);
  }
  const S = ramp('#a8adb4'); for (let j = 0; j < 6; j += 2) { d.P(S[3], sx, sy + j, sw, 1); d.P(S[1], sx, sy + j + 1, sw, 1); }
  d.P('#5a5a62', sx - 2, sy - 2, sw + 4, 2); d.P('#5a5a62', sx - 2, sy, 2, sh); d.P('#5a5a62', sx + sw, sy, 2, sh);
  // vetrina con le bustine di semi
  const vx = mx + 64, vy = my + 18, vw = 34, vh = 22, V = ramp('#7fa8c8');
  d.P('#ece4d0', vx - 1, vy - 1, vw + 2, vh + 2); d.P(V[1], vx, vy, vw, vh); d.P(V[2], vx + 1, vy + 1, vw - 2, vh - 2);
  for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) {
    const c = ['#d83a2a', '#e8b820', '#3e8a3a', '#e07028', '#8a3aa8'][(i + j * 2) % 5], x = vx + 3 + i * 6, y = vy + 3 + j * 9;
    d.P('#f4f0e4', x, y, 5, 7); d.P(c, x + 1, y + 1, 3, 3); d.P('#3a3030', x + 1, y + 5, 3, 1);
  }
  d.line(vx + 3, vy + vh - 3, vx + 14, vy + 2, V[4]);
  insegna(d, vx + (vw >> 1), vy + vh + 3, 'SEMI', '#c8302a');
  // porta
  porta(d, mx + 104, my + hM - 28, 13, 22, '#2a6a3a', { vetro: true });
  // muso del trattore in esposizione, con il fiocco
  const T = ramp('#e07028'), tx = mx + 124, ty = my + hM - 26;
  d.P(T[2], tx, ty + 6, 28, 14); d.P(T[3], tx, ty + 6, 28, 2); d.P(T[1], tx, ty + 18, 28, 2);
  d.P(ramp('#7fa8c8')[2], tx + 6, ty - 6, 16, 11); d.P('#3a3a42', tx + 5, ty - 7, 18, 2);
  d.ball(tx + 5, ty + 21, 6, 6, ramp('#34323a')); d.ball(tx + 23, ty + 21, 6, 6, ramp('#34323a'));
  d.ball(tx + 5, ty + 21, 2, 2, ramp('#e8b820')); d.ball(tx + 23, ty + 21, 2, 2, ramp('#e8b820'));
  d.P('#d8302a', tx + 12, ty + 6, 4, 14); d.P('#d8302a', tx, ty + 11, 28, 3); d.ell(tx + 14, ty + 6, 4, 2.5, '#ff5040');   // fiocco
  lampada(d, mx + 60, my + 14); lampada(d, mx + 100, my + 14);
  return outline(d.c);
}

export const EDIFICI = [
  ['Casa di Garonio', () => casa()], ['Officina', officina], ['Bar', bar], ['Alimentari', alimentari],
  ['Tabacchi', tabacchi], ['Municipio', municipio], ['Night Welcome', paradiso], ['Bubetto (magazzino)', magazzino],
  ['Casa rosa', () => casa({ w: 6, h: 3.4, muro: '#e8a8a0', tetto: '#a83a2a', pers: '#6a4a2a', seed: 3, piani: 2 })],
  ['Casa azzurra', () => casa({ w: 6, muro: '#a8c8e0', tetto: '#8a3a2a', pers: '#f4f0e4', seed: 5 })],
  ['Cascina del Potato', () => cascina()], ['Cascina del Postman', () => cascina({ muro: '#f0d8b8', tetto: '#8a3a2a', w: 7 })],
  ['Ranch Mister Frank', ranch], ['Fienile', fienile], ['Capannone dei maiali', capannoneMaiali],
  ['Gallinaio', gallinaio], ['Tettoia', tettoia],
  ['Chiesa', chiesa], ['Campanile', campanile], ['Castello', () => castello()], ['Torre', torre], ['Farmacia', farmacia],
  ['Studio medico', ambulatorio], ['Palestra', palestra], ['Pizzeria', pizzeria], ['Kebab', kebab], ['Meccanico (Zeno)', meccanico], ['Consorzio Rodella', consorzio], ["Fuel l'Havana", fuelHavana],
];

// ---------- Per il gioco (src/world.js): texture delle scatole 3D ----------
const MAT = {
  casa: ['intonaco', '#ecd49a', 'coppi'], officina: ['lamiera', '#8e959e', 'lamiera'], bar: ['intonaco', '#e8dcc0', 'coppi'],
  maiali: ['blocchi', '#b0aca0', 'lamiera'], magazzino: ['lamiera', '#a8a49a', 'lamiera'], gallinaio: ['legno', '#b08050', 'lamiera'],
  capannone2: ['blocchi', '#b0aca0', 'lamiera'], fienile: ['mattoni', '#b4583a', 'coppi'], alimentari: ['intonaco', '#e8c070', 'coppi'],
  'casa-rosa': ['intonaco', '#e8a8a0', 'coppi'], 'casa-azzurra': ['intonaco', '#a8c8e0', 'coppi'], tabacchi: ['intonaco', '#f0e0b0', 'coppi'],
  municipio: ['intonaco', '#e8dcc0', 'coppi'], paradiso: ['intonaco', '#6a3a7a', 'coppi'], tettoia: ['legno', '#8a5a32', 'lamiera'],
  'cascina-patata': ['intonaco', '#e0c48a', 'coppi'], 'cascina-postino': ['intonaco', '#f0d8b8', 'coppi'], ranch: ['legno', '#9a6a3a', 'lamiera'],
  chiesa: ['intonaco', '#efe2c4', 'coppi'], campanile: ['mattoni', '#b4583a', 'coppi'], castello: ['pietre', '#a8a090', 'lamiera'],
  'torre-sx': ['pietre', '#9a9484', 'lamiera'], 'torre-dx': ['pietre', '#9a9484', 'lamiera'], farmacia: ['intonaco', '#ece6d6', 'coppi'],
  dottore: ['intonaco', '#e4ecf0', 'coppi'], palestra: ['blocchi', '#d0ccc0', 'lamiera'], pizzeria: ['intonaco', '#f0d8a8', 'coppi'],
  kebab: ['intonaco', '#f4e4b8', 'lamiera'], meccanico: ['lamiera', '#b4bac2', 'lamiera'], consorzio: ['lamiera', '#c8ccc0', 'lamiera'],
  benzinaio: ['intonaco', '#f2dca8', 'lamiera'],
};
const FACCIATA = {
  casa: () => casa(), officina, bar, alimentari, tabacchi, municipio, paradiso, magazzino, fienile, gallinaio, tettoia, ranch,
  maiali: () => capannoneMaiali(), capannone2: () => capannoneMaiali({ w: 10, scritta: false }),
  'casa-rosa': () => casa({ w: 6, h: 3.4, muro: '#e8a8a0', tetto: '#a83a2a', pers: '#6a4a2a', seed: 3, piani: 2 }),
  'casa-azzurra': () => casa({ w: 6, muro: '#a8c8e0', tetto: '#8a3a2a', pers: '#f4f0e4', seed: 5 }),
  'cascina-patata': () => cascina(), 'cascina-postino': () => cascina({ muro: '#f0d8b8', tetto: '#8a3a2a', w: 7 }),
  chiesa, campanile, castello: () => castello(), 'torre-sx': torre, 'torre-dx': torre, farmacia, dottore: ambulatorio, palestra, pizzeria, kebab, meccanico, consorzio, benzinaio: fuelHavana,
};
// edifici la cui facciata ha già l'insegna dipinta (il gioco non ci mette il cartello sopra)
export const CON_INSEGNA = new Set(['officina', 'bar', 'alimentari', 'tabacchi', 'municipio', 'paradiso', 'magazzino', 'maiali',
  'chiesa', 'campanile', 'castello', 'torre-sx', 'torre-dx', 'farmacia', 'dottore', 'palestra', 'pizzeria', 'kebab', 'meccanico', 'consorzio', 'benzinaio']);

function parete(tipo, col, w, h, finestre, seed) {
  const d = pen(w, h);
  if (tipo === 'intonaco') intonaco(d, 0, 0, w, h, col, seed, w > 40 ? 1 : 0);
  else if (tipo === 'lamiera') lamiera(d, 0, 0, w, h, col);
  else if (tipo === 'legno') legno(d, 0, 0, w, h, col);
  else if (tipo === 'blocchi') blocchi(d, 0, 0, w, h, col);
  else if (tipo === 'pietre') pietre(d, 0, 0, w, h, col);
  else mattoni(d, 0, 0, w, h, col);
  ombraGronda(d, 0, 0, w);
  if (finestre && w >= 40) finestra(d, (w >> 1) - 5, Math.max(8, h - 28), { pers: tipo === 'intonaco' ? '#3e7a4a' : '#6a7078' });
  else if (finestre) finestra(d, (w >> 1) - 4, Math.max(8, h - 24), { w: 8, h: 10 });
  return d.c;
}

// Tegole ripetibili (una casella di tetto)
function tettoTex(tipo, col) {
  const R = ramp(col);
  if (tipo === 'lamiera') {
    const d = pen(16, 16);
    for (let i = 0; i < 16; i++) d.P(R[[3, 2, 2, 1][i % 4]], i, 0, 1, 16);
    d.P('#a85a2e', 6, 5, 1, 3); d.P('#a85a2e', 13, 11, 1, 2);
    return d.c;
  }
  const d = pen(20, 18), CH = [3, 3, 2, 2, 1];
  for (let i = 0; i < 20; i++) { d.P(R[CH[i % 5]], i, 0, 1, 18); if (i % 5 === 4) d.P(R[0], i, 0, 1, 18); }
  for (let j = 5; j < 18; j += 6) for (let i = 0; i < 20; i++) {
    if (i % 5 === 4) continue;
    d.P(R[0], i, j); d.P(R[4 - (i % 5 > 1 ? 1 : 0)], i, (j + 1) % 18);
  }
  d.P('#5a7a3a', 7, 9, 2, 1);
  return d.c;
}

// ---------- Facciate dai fogli disegnati (src/hd/fogli.js) ----------
// La facciata sta davanti al muro come una «finta facciata»; qui le misure in caselle e i lati/retro coi suoi colori.
// false: gli edifici restano quelli disegnati via codice (le facciate dei fogli sono quasi quadrate, gli edifici larghi e bassi)
export const USA_FACCIATE = false;
export function misureFacciata(b) {
  if (!USA_FACCIATE) return null;
  const f = HDF.foglio('f:' + b.id);
  if (!f) return null;
  const cw = b.w * 1.08, ch = cw * f.height / f.width;
  const muro = ch * (f.height - HDF.gronda('f:' + b.id)) / f.height;   // altezza del muro sotto la gronda dipinta
  return { f, cw, ch, muro: Math.max(b.h * 0.8, muro) };
}
function pezzaMuro(f, gr) {
  // un riquadro di muro liscio dalla facciata: in alto a sinistra sotto la gronda, dentro il contorno
  const g = f.getContext('2d');
  const x = Math.round(f.width * 0.05), y = gr + Math.round((f.height - gr) * 0.06);
  const w = Math.max(4, Math.round(f.width * 0.1)), h = Math.max(4, Math.round((f.height - gr) * 0.22));
  const d = pen(w, h); d.g.drawImage(f, x, y, w, h, 0, 0, w, h);
  return d.c;
}
function muroDaFacciata(f, gr, W, H) {
  const pz = pezzaMuro(f, gr), d = pen(W, H);
  for (let y = 0; y < H; y += pz.height) for (let x = 0; x < W; x += pz.width) {
    // le pezze si specchiano a scacchiera: niente righe dritte di ripetizione
    d.g.save(); d.g.translate(x + ((x / pz.width) % 2 ? pz.width : 0), y); if ((x / pz.width) % 2) d.g.scale(-1, 1);
    d.g.drawImage(pz, 0, 0); d.g.restore();
  }
  ombraGronda(d, 0, 0, W);
  const Z = ramp('#9a9488'); d.P(Z[2], 0, H - 4, W, 4); d.P(Z[3], 0, H - 4, W, 1); d.P(Z[1], 0, H - 1, W, 1);   // zoccolo
  d.P(INK, 0, 0, 1, H); d.P(INK, W - 1, 0, 1, H);
  return d.c;
}
function coloreTetto(f, gr) {
  // la fila di tegole sopra la gronda dipinta
  const y0 = Math.max(0, gr - 5), dd = f.getContext('2d').getImageData(0, y0, f.width, gr - y0).data;
  let r = 0, g = 0, bb = 0, n = 0;
  for (let i = 0; i < dd.length; i += 4) if (dd[i + 3] && dd[i] + dd[i + 1] + dd[i + 2] > 120) { r += dd[i]; g += dd[i + 1]; bb += dd[i + 2]; n++; }
  if (!n) return null;
  return '#' + [r, g, bb].map(v => Math.round(v / n).toString(16).padStart(2, '0')).join('');
}

export function texEdificio(b) {
  const mf = misureFacciata(b);
  if (mf) {
    const gr = HDF.gronda('f:' + b.id), [tipo, , tetto] = MAT[b.id] || ['intonaco', '#e8d8b0', 'coppi'];
    const H = Math.round(mf.muro * 16), W = Math.round(b.w * 16), D = Math.round(b.d * 16);
    return {
      front: muroDaFacciata(mf.f, gr, W, H), side: muroDaFacciata(mf.f, gr, D, H), back: muroDaFacciata(mf.f, gr, W, H),
      roof: tettoTex(tetto === 'lamiera' || tipo === 'lamiera' ? 'lamiera' : 'coppi', coloreTetto(mf.f, gr) || b.roof),
      insegna: true, facciata: mf,
    };
  }
  const [tipo, col, tetto] = MAT[b.id] || [b.wall === 'metallo' ? 'lamiera' : b.wall === 'legno' ? 'legno' : 'intonaco', b.wall?.[0] === '#' ? b.wall : '#e8d8b0', b.wall === 'metallo' ? 'lamiera' : 'coppi'];
  const W = Math.round(b.w * 16), H = Math.round(b.h * 16), D = Math.round(b.d * 16);
  let front;
  const f = FACCIATA[b.id];
  if (f) {
    const full = f(), m = full.muro;
    const d = pen(m.w, m.h); d.g.drawImage(full, m.x, m.y, m.w, m.h, 0, 0, m.w, m.h);
    front = d.c;
  } else front = parete(tipo, col, W, H, b.windows, 7);
  const finLato = tipo === 'intonaco' ? 1 : 0;
  return {
    front,
    side: parete(tipo, col, D, H, finLato, 3),
    back: parete(tipo, col, W, H, 0, 5),
    roof: tettoTex(tetto, b.roof),
    insegna: CON_INSEGNA.has(b.id),
  };
}
