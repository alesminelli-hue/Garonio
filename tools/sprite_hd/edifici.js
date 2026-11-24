// Edifici visti di fronte con il tetto in prospettiva (vista 3/4 come la camera del gioco).
// Scala: 16 px = 1 casella, larghezze uguali a quelle di src/map.js (BUILDINGS).
import { pen, ramp, tone, rng, hash, outline, text, textWidth, INK } from './kit.js';

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
  insegna(d, mx + (mw >> 1), my + 4, 'OFFICINA', '#2f4f8a');
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

export function capannoneMaiali() {
  const hM = 42, { d, W, mx, my, mw } = base(12, hM, 22);
  tettoLamiera(d, 0, 0, W, 23, '#8a4a32');
  blocchi(d, mx, my, mw, hM, '#b0aca0');
  ombraGronda(d, mx, my, mw);
  for (let x = mx + 10; x < mx + mw - 20; x += 26) { d.P('#3a3a42', x, my + 8, 14, 5); d.P('#6a7a8a', x + 1, my + 9, 12, 3); } // finestrelle alte
  // portone scorrevole
  const L = ramp('#8a4a32'), px = mx + 74, pw = 40;
  d.P('#2a2228', px, my + 16, pw, hM - 16);
  d.P(L[2], px + 12, my + 16, pw - 12, hM - 16);
  for (let i = px + 12; i < px + pw; i += 4) d.P(L[1], i, my + 16, 1, hM - 16);
  d.line(px + 12, my + 16, px + pw - 1, my + hM - 1, L[3]); d.line(px + 12, my + hM - 1, px + pw - 1, my + 16, L[3]);
  d.P('#5a5a62', px - 2, my + 14, pw + 6, 2);
  insegna(d, mx + 40, my + 20, 'MAIALI', '#8a4a32');
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

export const EDIFICI = [
  ['Casa di Garonio', () => casa()], ['Officina', officina], ['Bar', bar], ['Alimentari', alimentari],
  ['Tabacchi', tabacchi], ['Municipio', municipio], ['Night Paradiso', paradiso], ['Bubetto (magazzino)', magazzino],
  ['Casa rosa', () => casa({ w: 6, h: 3.4, muro: '#e8a8a0', tetto: '#a83a2a', pers: '#6a4a2a', seed: 3, piani: 2 })],
  ['Casa azzurra', () => casa({ w: 6, muro: '#a8c8e0', tetto: '#8a3a2a', pers: '#f4f0e4', seed: 5 })],
  ['Cascina del Patata', () => cascina()], ['Cascina del Postino', () => cascina({ muro: '#f0d8b8', tetto: '#8a3a2a', w: 7 })],
  ['Ranch Mister Frank', ranch], ['Fienile', fienile], ['Capannone dei maiali', capannoneMaiali],
  ['Gallinaio', gallinaio], ['Tettoia', tettoia],
];
