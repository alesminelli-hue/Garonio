// Oggetti di scena: alberi, colture, roba di campagna e arredo del paese.
import { pen, ramp, rng, hash, outline, text, textWidth, INK } from './kit.js';

// ---------- Vegetazione ----------
// Chioma fatta di "nuvolette", ognuna illuminata da in alto a sinistra, con grana a foglie.
function chioma(d, clusters, base, seed) {
  const R = ramp(base);
  for (const [cx, cy, rx, ry = rx] of clusters) {
    for (let y = Math.floor(-ry - 1); y <= ry + 1; y++) for (let x = Math.floor(-rx - 1); x <= rx + 1; x++) {
      const nx = x / rx, ny = y / ry, q = nx * nx + ny * ny;
      const edge = 1 + (hash(cx + x, cy + y, seed) - 0.5) * 0.35;
      if (q > edge) continue;
      let t = -0.5 * nx - 0.85 * ny + (hash((cx + x) >> 1, (cy + y) >> 1, seed + 1) - 0.5) * 0.7;
      if (q > 0.7) t -= 0.3;
      d.P(R[t > 0.75 ? 4 : t > 0.25 ? 3 : t > -0.3 ? 2 : t > -0.8 ? 1 : 0], cx + x, cy + y);
    }
  }
}
function tronco(d, x, y, w, h) {
  const R = ramp('#6a4428');
  d.cyl(x, y, w, h, R);
  d.P(R[1], x - 1, y + h - 2, 1, 2); d.P(R[1], x + w, y + h - 2, 1, 2); // radici
  for (let j = 2; j < h; j += 3) d.P(R[0], x + 1 + (j % 2), y + j);
}

export function quercia(seed = 1, frutti = false) {
  const d = pen(36, 46);
  tronco(d, 15, 28, 6, 17);
  d.P('#4a2e1a', 17, 26, 2, 3);
  const j = rng(seed * 7 + 3), J = v => v + Math.round((j() - 0.5) * 3);
  const verdi = ['#3f8c36', '#3f8c36', '#4a9438', '#3a8240'];
  chioma(d, [[18, 26, 13, 9], [J(9), J(21), 8], [J(27), J(20), 8], [18, J(15), 10, 8], [J(11), J(11), 6], [J(24), J(10), 6], [J(18), 7, 6, 5]].map(([x, y, rx, ry]) => [x, y, rx, ry]), verdi[seed % 4], seed);
  if (frutti) {
    const r = rng(seed + 9);
    for (let i = 0; i < 9; i++) {
      const x = 6 + r() * 24 | 0, y = 6 + r() * 22 | 0;
      d.P('#d8382a', x, y, 2, 2); d.P('#ff8a70', x, y); d.P('#8a1a1a', x + 1, y + 1);
    }
  }
  return outline(d.c);
}

export function pioppo(seed = 1) {
  const d = pen(20, 58);
  tronco(d, 8, 44, 4, 13);
  const cl = [];
  for (let i = 0; i < 7; i++) cl.push([10 + (i % 2 ? 1 : -1), 42 - i * 5.5, 6 - Math.abs(i - 3) * 0.6, 6]);
  chioma(d, cl, '#3e7f3a', seed + 50);
  return outline(d.c);
}

export function cespuglio(fiori = false) {
  const d = pen(22, 15);
  chioma(d, [[11, 9, 9, 5], [6, 7, 5, 4], [15, 6, 5, 4], [11, 4, 4, 3]], '#3f8c36', fiori ? 77 : 33);
  if (fiori) for (const [x, y] of [[5, 6], [12, 3], [16, 8], [9, 10], [17, 4]]) { d.P('#f2a6c8', x, y, 2, 1); d.P('#fff0f6', x, y); d.P('#c85a8a', x + 1, y + 1); }
  return outline(d.c);
}

// Fogliame di una pianta d'appartamento (il vaso lo fa il mobile 3D)
export function piantaFoglie(seed = 1) {
  const d = pen(16, 18);
  d.P('#4a3a2a', 7, 12, 2, 6);
  chioma(d, [[8, 13, 6, 4], [5, 9, 4, 4], [11, 8, 4, 4], [8, 5, 4, 4]], '#3a8a3a', seed + 90);
  return outline(d.c);
}

export function canne() {
  const d = pen(16, 22);
  const G = ramp('#6a8c3a');
  for (const [x, h] of [[2, 16], [5, 20], [8, 14], [11, 18], [13, 12]]) {
    d.P(G[1], x, 22 - h, 1, h); d.P(G[3], x + 1, 22 - h + 4, 1, 3);
    d.P('#6a4426', x, 22 - h - 3, 2, 4); d.P('#8a5a34', x, 22 - h - 3);
  }
  return outline(d.c);
}

// ---------- Colture (stadi 1-3) ----------
export function coltura(tipo, stadio) {
  const d = pen(16, 24);
  const G = ramp('#4c9a3a');
  const terra = ramp('#6e4a2a');
  d.ell(8, 22, 6, 1.6, terra[1]); d.P(terra[3], 4, 21, 3, 1);
  if (stadio === 1) {
    d.P(G[1], 7, 16, 2, 5); d.P(G[3], 4, 15, 3, 2); d.P(G[2], 9, 14, 3, 2); d.P(G[4], 4, 15); d.P(G[4], 10, 14);
    return outline(d.c);
  }
  if (tipo === 'mais') {
    const h = stadio === 2 ? 12 : 20, top = 22 - h;
    d.P(G[1], 7, top, 2, h); d.P(G[3], 7, top, 1, h);
    for (const [y, dir, l] of [[4, -1, 5], [7, 1, 5], [10, -1, 6], [13, 1, 6]]) {
      if (top + y > 20) continue;
      for (let i = 0; i < l; i++) { d.P(G[i < 2 ? 2 : 3], 8 + dir * (i + 1), top + y + (i > 2 ? 1 : 0)); d.P(G[1], 8 + dir * (i + 1), top + y + 1 + (i > 2 ? 1 : 0)); }
    }
    if (stadio === 3) {
      const Y = ramp('#f0c030'); // pannocchia con foglie
      d.P(Y[2], 10, 8, 3, 6); d.P(Y[3], 10, 8, 1, 6); d.P(Y[1], 12, 9, 1, 5); d.P(Y[4], 10, 9);
      d.P(G[2], 9, 12, 2, 3); d.P(G[3], 13, 13, 1, 2);
      d.P('#d8b468', 7, 0, 2, 2); d.P('#b88c40', 6, 1); d.P('#b88c40', 9, 1); // pennacchio
    }
  } else if (tipo === 'pomodoro') {
    const h = stadio === 2 ? 11 : 16, top = 22 - h;
    d.P('#8a6a40', 3, top - 1, 1, h + 1); d.P('#8a6a40', 12, top - 1, 1, h + 1); // canne di sostegno
    d.P(G[1], 7, top, 2, h);
    chioma(d, [[8, top + 4, 5, 3], [6, top + 9, 5, 3], [10, top + 10, 4, 3]], '#4c9a3a', 5);
    if (stadio === 3) for (const [x, y] of [[4, top + 6], [10, top + 3], [7, top + 11], [11, top + 9]]) {
      d.P('#d83a2a', x, y, 3, 3); d.P('#ff8a6a', x, y); d.P('#9a1e16', x + 2, y + 2); d.P('#3a7a2a', x + 1, y - 1);
    }
  } else if (tipo === 'zucchina' || tipo === 'zucca') {
    // foglie larghe a terra; frutti sotto le foglie
    const big = stadio === 3;
    chioma(d, [[5, 17, 4, 3], [11, 17, 4, 3], [8, 14, 4, 3]], '#4c9a3a', tipo === 'zucca' ? 9 : 8);
    d.P('#f0c030', 8, 12, 2, 2); d.P('#f8e070', 8, 12);                                              // fiore giallo
    if (big && tipo === 'zucchina') for (const [x, y] of [[2, 19], [10, 19]]) { const Z = ramp('#3a7a2a'); d.P(Z[2], x, y, 6, 2); d.P(Z[3], x, y, 6, 1); d.P('#c8e870', x + 1, y); }
    if (big && tipo === 'zucca') { d.ball(8, 18, 5, 4, ramp('#e07028')); d.P('#a84a18', 6, 15, 1, 6); d.P('#a84a18', 10, 15, 1, 6); d.P('#5a3a1a', 8, 13, 1, 2); }
  } else if (tipo === 'insalata') {
    const r = stadio === 3 ? 5 : 3.5, I = ramp('#7ac84a');
    d.ball(8, 20 - r * 0.6, r + 1, r * 0.8, ramp('#4c9a3a'));
    d.ball(8, 19 - r * 0.6, r, r * 0.7, I);
    if (stadio === 3) { d.P(I[4], 6, 15, 3, 1); d.P(I[1], 8, 17, 1, 3); d.P(I[1], 5, 18, 1, 2); d.P(I[1], 11, 18, 1, 2); }
  } else if (tipo === 'peperone' || tipo === 'fragola') {
    const fr = tipo === 'fragola', h = fr ? 6 : stadio === 2 ? 10 : 13, top = 22 - h;
    if (!fr) d.P(G[1], 7, top, 2, h);
    chioma(d, fr ? [[5, 18, 3, 2], [11, 18, 3, 2], [8, 17, 3, 2]] : [[8, top + 3, 4, 3], [6, top + 7, 4, 3], [10, top + 8, 4, 3]], '#3e8a32', fr ? 11 : 12);
    if (stadio === 3 && fr) for (const [x, y] of [[3, 19], [8, 20], [12, 19]]) { d.P('#d8202a', x, y, 2, 2); d.P('#ff7a6a', x, y); d.P('#f8e070', x + 1, y + 1); d.P('#3a7a2a', x, y - 1, 2, 1); }
    if (stadio === 3 && !fr) for (const [x, y, c] of [[4, top + 6, '#d83a2a'], [10, top + 4, '#e8b820'], [9, top + 10, '#3e8a3a']]) { const P = ramp(c); d.P(P[2], x, y, 3, 4); d.P(P[3], x, y, 1, 3); d.P(P[1], x + 2, y + 3); d.P('#2a5a1a', x + 1, y - 1); }
  } else { // grano: ciuffo di steli a ventaglio
    const ripe = stadio === 3, h = ripe ? 17 : 13;
    const S = ramp(ripe ? '#c8a038' : '#4c9a3a'), E = ramp(ripe ? '#eecb5a' : '#86c45a');
    for (const [dx, k] of [[-5, 0], [-2, 1], [2, 1], [5, 0], [0, 2]]) {
      const top = 22 - h + (k === 2 ? 0 : k === 1 ? 2 : 4), x1 = 8 + dx;
      d.line(8 + Math.sign(dx), 21, x1, top + 4, S[k === 2 ? 3 : 2]);
      d.P(E[2], x1 - 1, top, 2, 5); d.P(E[3], x1 - 1, top, 1, 4); d.P(E[1], x1, top + 3);
      if (ripe) { d.P(E[4], x1 - 1, top - 1); d.P(S[1], x1 + 1, top - 2); }
    }
  }
  return outline(d.c);
}

// ---------- Campagna ----------
export function rotoballa() { // di fronte: spirale
  const d = pen(24, 22);
  const R = ramp('#d0a448');
  d.ball(12, 11, 10.5, 10, R, { grain: 0.5, seed: 4 });
  for (let a = 0; a < 6.28 * 2.6; a += 0.09) {
    const r = 1 + a * 0.55;
    d.P(R[1], 12 + Math.cos(a) * r, 11 + Math.sin(a) * r * 0.95);
  }
  d.P(R[4], 6, 5, 3, 1); d.P(R[4], 5, 6, 1, 2);
  return outline(d.c);
}
export function rotoballaLato() {
  const d = pen(30, 22);
  const R = ramp('#d0a448');
  for (let x = 4; x < 26; x++) for (let y = 1; y < 21; y++) {
    const ny = (y - 11) / 10, t = -ny * 0.9 + (hash(x >> 1, y, 8) - 0.5) * 0.5;
    d.P(R[t > 0.6 ? 4 : t > 0.15 ? 3 : t > -0.35 ? 2 : t > -0.75 ? 1 : 0], x, y);
  }
  d.ell(4, 11, 3.5, 10, R[1]); d.ell(4, 11, 2, 7, R[0]);
  for (const x of [10, 19]) d.P('#e8e0d0', x, 1, 1, 20); // reti
  return outline(d.c);
}
export function ballaQuadra() {
  const d = pen(24, 16);
  const R = ramp('#d8b058');
  d.P(R[3], 1, 1, 22, 4); d.P(R[2], 1, 5, 22, 10); d.P(R[1], 18, 5, 5, 10);
  for (let i = 0; i < 40; i++) d.P(hash(i, 1, 2) < 0.5 ? R[1] : R[4], 1 + hash(i, 2, 3) * 22 | 0, 1 + hash(i, 4, 5) * 14 | 0, 2, 1);
  d.P('#8a5a2a', 7, 1, 1, 14); d.P('#8a5a2a', 15, 1, 1, 14);
  return outline(d.c);
}

export function staccionata() {
  const d = pen(32, 18);
  const W = ramp('#a87a48');
  for (const x of [1, 15, 28]) { d.P(W[2], x, 2, 3, 16); d.P(W[3], x, 2, 1, 16); d.P(W[0], x + 2, 3, 1, 15); d.P(W[4], x, 1, 3, 1); }
  for (const y of [5, 11]) { d.P(W[2], 0, y, 32, 3); d.P(W[3], 0, y, 32, 1); d.P(W[0], 0, y + 2, 32, 1); }
  d.P('#5a5a60', 2, 6); d.P('#5a5a60', 16, 12); d.P('#5a5a60', 29, 6);
  return outline(d.c);
}
export function cancello() {
  const d = pen(34, 20);
  const M = ramp('#6a7a6a');
  d.cyl(0, 0, 3, 20, ramp('#8a8478')); d.cyl(31, 0, 3, 20, ramp('#8a8478'));
  d.P(M[2], 3, 3, 28, 2); d.P(M[2], 3, 15, 28, 2); d.P(M[3], 3, 3, 28, 1);
  for (let x = 7; x < 31; x += 6) { d.P(M[2], x, 5, 2, 10); d.P(M[3], x, 5, 1, 10); }
  d.line(4, 15, 30, 5, M[2]);
  d.P('#b85a2a', 12, 4, 2, 1); d.P('#b85a2a', 22, 16, 3, 1); // ruggine
  return outline(d.c);
}

export function abbeveratoio() {
  const d = pen(30, 14);
  const S = ramp('#a8a49a');
  d.P(S[2], 1, 3, 28, 10); d.P(S[3], 1, 3, 28, 1); d.P(S[1], 1, 11, 28, 2); d.P(S[0], 27, 3, 2, 10);
  const A = ramp('#4a8ad0');
  d.P(A[2], 3, 4, 24, 3); d.P(A[3], 6, 4, 6, 1); d.P(A[4], 7, 4, 2, 1);
  d.P('#6a8a4a', 3, 7, 24, 1); // muschio
  return outline(d.c);
}
export function mangiatoia() {
  const d = pen(26, 16);
  const W = ramp('#946a3e');
  d.P(W[1], 3, 10, 2, 6); d.P(W[1], 21, 10, 2, 6);
  d.poly([[1, 4], [25, 4], [22, 11], [4, 11]], W[2]); d.P(W[3], 1, 4, 24, 1); d.P(W[0], 4, 10, 18, 1);
  d.P('#e0c060', 3, 3, 20, 2); d.P('#f4dc80', 5, 2, 5, 1); d.P('#c8a040', 14, 3, 6, 1);
  return outline(d.c);
}
export function cassa() {
  const d = pen(18, 16);
  const W = ramp('#a8743e');
  d.box(1, 1, 16, 14, W);
  for (const y of [5, 10]) { d.P(W[0], 1, y, 16, 1); d.P(W[3], 1, y + 1, 16, 1); }
  d.P(W[1], 1, 1, 2, 14); d.P(W[1], 15, 1, 2, 14);
  d.P('#3a3030', 2, 2); d.P('#3a3030', 15, 2); d.P('#3a3030', 2, 13); d.P('#3a3030', 15, 13);
  return outline(d.c);
}
export function cassaVendita() { // cassone per vendere, pieno di roba
  const d = pen(26, 22);
  const W = ramp('#9a6a3a');
  d.box(1, 8, 24, 13, W);
  for (const y of [12, 16]) d.P(W[0], 1, y, 24, 1);
  for (const [x, y, c] of [[3, 5, '#d83a2a'], [7, 4, '#f0c030'], [11, 5, '#d83a2a'], [15, 3, '#f0c030'], [19, 5, '#e8e0c8'], [6, 7, '#e8e0c8'], [14, 6, '#d83a2a'], [20, 7, '#f0c030']]) {
    const R = ramp(c); d.ball(x + 1, y + 1, 2, 2, R);
  }
  // cartellino
  d.P('#f4ecd6', 8, 14, 10, 6); d.P('#c8b890', 8, 19, 10, 1);
  text(d, '€', 11, 14, '#2a6a3a');
  return outline(d.c);
}
export function uovo() {
  const d = pen(8, 9);
  d.ball(4, 4.5, 3, 3.8, ramp('#f0e4c8'));
  return outline(d.c);
}
export function cestoUova() {
  const d = pen(20, 16);
  for (const [x, y] of [[6, 6], [10, 5], [14, 6], [8, 7], [12, 7]]) d.ball(x, y, 2.5, 3, ramp('#f0e4c8'));
  const W = ramp('#b88a4a');
  d.poly([[1, 8], [19, 8], [17, 15], [3, 15]], W[2]);
  for (let y = 9; y < 15; y += 2) d.P(W[1], 2, y, 16, 1);
  for (let x = 4; x < 17; x += 3) d.P(W[3], x, 9, 1, 5);
  d.line(3, 8, 10, 1, W[1]); d.line(10, 1, 17, 8, W[1]);
  return outline(d.c);
}
export function tanica() {
  const d = pen(14, 18);
  const R = ramp('#c8302a');
  d.box(1, 3, 12, 14, R);
  d.P(R[1], 3, 6, 8, 8); d.P(R[3], 3, 6, 8, 1); d.P(R[3], 3, 6, 1, 8); d.P(R[0], 1, 15, 12, 1);
  d.P(R[2], 3, 0, 5, 3); d.P(R[0], 4, 1, 3, 1); // maniglia
  d.P('#c8c8c0', 9, 0, 3, 3); d.P('#f0f0e8', 9, 0);
  return outline(d.c);
}
export function bidone() {
  const d = pen(16, 22);
  const R = ramp('#2f5e9a');
  d.cyl(1, 2, 14, 19, R);
  for (const y of [6, 14]) { d.P(R[0], 1, y, 14, 1); d.P(R[4], 1, y + 1, 14, 1); }
  d.ell(8, 2, 7, 1.5, R[3]); d.P('#1a1a22', 10, 1, 2, 1);
  d.P('#b85a2a', 3, 18, 3, 2); d.P('#b85a2a', 11, 10, 1, 2);
  return outline(d.c);
}
export function carriola() {
  const d = pen(30, 18);
  const M = ramp('#3e8a4a');
  d.poly([[2, 3], [22, 3], [19, 11], [5, 11]], M[2]); d.P(M[3], 2, 3, 20, 1); d.P(M[0], 5, 10, 14, 1);
  d.P('#8a8478', 20, 9, 9, 1); d.P('#8a8478', 6, 11, 1, 6); // manici e gamba
  d.line(19, 10, 28, 6, '#6a5a48'); d.P('#2a2a2a', 27, 5, 3, 2);
  const T = ramp('#34323a'); d.ball(21, 14, 3.5, 3.5, T); d.P('#c8c8c0', 21, 14);
  d.P('#b85a2a', 8, 6, 2, 2);
  return outline(d.c);
}
export function secchio() {
  const d = pen(12, 13);
  const R = ramp('#a8b0b8');
  d.poly([[1, 3], [11, 3], [10, 12], [2, 12]], R[2]); d.P(R[3], 2, 4, 2, 8); d.P(R[1], 8, 4, 2, 8);
  d.ell(6, 3, 5, 1.2, R[0]); d.P('#4a8ad0', 3, 3, 6, 1);
  d.line(1, 3, 6, 0, R[1]); d.line(6, 0, 11, 3, R[1]);
  return outline(d.c);
}
export function saccoSemi() {
  const d = pen(16, 18);
  const R = ramp('#d8c8a0');
  d.poly([[2, 4], [14, 4], [15, 17], [1, 17]], R[2]); d.P(R[3], 2, 5, 3, 11); d.P(R[1], 12, 5, 3, 12);
  d.P(R[1], 4, 2, 8, 3); d.P('#8a6a40', 5, 3, 6, 1);
  d.P('#3e8a4a', 5, 9, 6, 4); text(d, 'S', 7, 8, '#f4ecd6');
  return outline(d.c);
}
export function attrezziMano() { // zappa e forcone appoggiati
  const d = pen(16, 26);
  const L = ramp('#a87a48');
  d.line(4, 25, 7, 3, L[2]); d.line(5, 25, 8, 3, L[1]);
  d.P('#8a9098', 4, 1, 7, 3); d.P('#c8d0d8', 4, 1, 7, 1);
  d.line(11, 25, 11, 7, L[2]); d.line(12, 25, 12, 7, L[1]);
  for (const x of [9, 11, 13]) d.P('#9aa0a8', x, 1, 1, 6); d.P('#9aa0a8', 9, 6, 5, 1);
  return outline(d.c);
}

// ---------- Paese ----------
export function cartello(testo) {
  const w = Math.max(24, textWidth(testo) + 8);
  const d = pen(w, 26);
  const L = ramp('#7a5434');
  d.P(L[2], (w >> 1) - 1, 10, 3, 16); d.P(L[3], (w >> 1) - 1, 10, 1, 16);
  const B = ramp('#2a6a3a');
  d.P('#f4f0e0', 0, 0, w, 11); d.P(B[2], 1, 1, w - 2, 9); d.P(B[3], 1, 1, w - 2, 1); d.P(B[1], 1, 9, w - 2, 1);
  text(d, testo, (w - textWidth(testo)) >> 1, 3, '#ffffff', B[0]);
  return outline(d.c);
}
export function cartelloPaese(nome = 'GARONIO') { // cartello d'inizio paese (bianco, bordo nero)
  const w = textWidth(nome) + 12;
  const d = pen(w, 30);
  d.cyl(3, 12, 2, 18, ramp('#9aa0a8')); d.cyl(w - 5, 12, 2, 18, ramp('#9aa0a8'));
  d.P('#1e1e22', 0, 0, w, 14); d.P('#f4f2ea', 1, 1, w - 2, 12); d.P('#1e1e22', 2, 2, w - 4, 1); d.P('#1e1e22', 2, 11, w - 4, 1);
  d.P('#1e1e22', 2, 2, 1, 10); d.P('#1e1e22', w - 3, 2, 1, 10);
  text(d, nome, 6, 4, '#1e1e22');
  return outline(d.c);
}
export function lampione() {
  const d = pen(14, 44);
  const M = ramp('#3e4a44');
  d.cyl(5, 8, 3, 34, M); d.P(M[1], 3, 41, 7, 3); d.P(M[3], 3, 41, 7, 1);
  d.P(M[2], 6, 3, 7, 2); d.P(M[1], 10, 5, 3, 1);
  d.poly([[8, 5], [14, 5], [13, 9], [9, 9]], M[2]);
  d.P('#fff2b0', 9, 9, 4, 1); d.P('#ffe070', 10, 10, 2, 1);
  return outline(d.c);
}
export function panchina() {
  const d = pen(30, 18);
  const W = ramp('#2f7a4a'), M = ramp('#3a3a40');
  for (const y of [2, 5]) { d.P(W[2], 2, y, 26, 2); d.P(W[3], 2, y, 26, 1); }
  d.P(W[2], 1, 9, 28, 3); d.P(W[3], 1, 9, 28, 1); d.P(W[0], 1, 11, 28, 1);
  for (const x of [4, 24]) { d.P(M[2], x, 2, 2, 16); d.P(M[1], x + 1, 12, 1, 6); }
  return outline(d.c);
}
export function fontanella() { // la classica fontanella in ghisa verde
  const d = pen(16, 30);
  const G = ramp('#2f6a4a');
  d.cyl(4, 6, 8, 20, G);
  d.ell(8, 6, 4, 2, G[3]); d.ball(8, 3, 3, 3, G);
  d.P(G[1], 2, 26, 12, 3); d.P(G[3], 2, 26, 12, 1);
  d.P(G[2], 12, 12, 3, 2); d.P(G[0], 14, 13, 1, 1); // becco
  const A = ramp('#6aa8e0'); d.P(A[3], 14, 14, 1, 7); d.P(A[4], 14, 15);
  d.ell(13, 25, 2, 0.8, A[2]);
  d.P(G[4], 5, 10, 1, 10);
  return outline(d.c);
}
export function cassonetto() {
  const d = pen(30, 26);
  const G = ramp('#3e7a3e');
  d.box(1, 5, 28, 17, G);
  d.poly([[0, 1], [30, 1], [29, 6], [1, 6]], G[3]); d.P(G[4], 1, 1, 28, 1); d.P(G[1], 1, 5, 28, 1);
  d.P(G[1], 4, 10, 22, 1); d.P(G[0], 4, 16, 22, 1);
  for (const x of [4, 22]) d.ball(x + 2, 23, 2, 2, ramp('#34323a'));
  d.P('#f0f0e8', 4, 13, 22, 2); d.P('#e8c030', 4, 13, 3, 2); d.P('#e8c030', 23, 13, 3, 2);
  d.P('#c8c0b0', 25, 0, 4, 2); // sacchetto che spunta
  return outline(d.c);
}
export function cabina() { // cabina telefonica di paese
  const d = pen(22, 46);
  const C = ramp('#9aa0a8'), A = ramp('#e0802a');
  d.box(1, 4, 20, 40, C);
  d.P(A[2], 0, 0, 22, 5); d.P(A[3], 0, 0, 22, 1); d.P(A[1], 0, 4, 22, 1);
  d.P('#f4ecd6', 4, 1, 14, 3); text(d, 'TEL', 5, 0, A[0]);
  const V = ramp('#8fbcd8');
  d.P(V[2], 3, 7, 16, 32); d.P(V[3], 4, 8, 2, 30); d.line(8, 12, 14, 6, V[4]); d.line(8, 20, 17, 11, V[4]);
  d.P('#3a3a42', 12, 16, 5, 8); d.P('#5a5a62', 12, 16, 5, 1); d.P('#1e1e22', 13, 18, 1, 4);
  d.P(C[1], 3, 39, 16, 1); d.P(C[0], 1, 43, 20, 1);
  return outline(d.c);
}
export function tavolinoBar() {
  const d = pen(34, 22);
  const M = ramp('#c8c8c4'), S = ramp('#d8382a');
  // sedie
  for (const x of [1, 25]) {
    d.P(S[2], x, 4, 8, 2); d.P(S[3], x, 4, 8, 1); d.P(S[2], x + (x < 10 ? 0 : 6), 4, 2, 9); d.P(S[2], x, 11, 8, 2);
    d.P(M[1], x + 1, 13, 1, 9); d.P(M[1], x + 6, 13, 1, 9);
  }
  d.ell(17, 9, 8, 2, M[3]); d.P(M[2], 9, 9, 16, 2); d.P(M[1], 16, 11, 2, 10); d.P(M[1], 13, 20, 8, 1);
  d.P('#e8c050', 13, 6, 2, 3); d.P('#fff4c0', 13, 6); // spritz
  d.P('#f4ecd6', 19, 7, 3, 2);
  return outline(d.c);
}
export function fioriera() {
  const d = pen(22, 18);
  const C = ramp('#b8683a');
  d.poly([[1, 8], [21, 8], [19, 17], [3, 17]], C[2]); d.P(C[3], 1, 8, 20, 1); d.P(C[1], 3, 16, 16, 1);
  chioma(d, [[11, 6, 9, 3], [6, 4, 4, 3], [15, 4, 4, 3]], '#3f8c36', 12);
  for (const [x, y, c] of [[4, 3, '#e8382a'], [9, 2, '#f4d23c'], [14, 3, '#e8382a'], [18, 5, '#f6f2e4'], [7, 6, '#f6f2e4']]) { d.P(c, x, y, 2, 2); d.P('#fff8e0', x, y); }
  return outline(d.c);
}
export function silo() {
  const d = pen(30, 72);
  const R = ramp('#b8c0c8');
  d.cyl(2, 12, 26, 58, R);
  for (let y = 18; y < 70; y += 7) { d.P(R[0], 2, y, 26, 1); }
  d.poly([[2, 13], [15, 1], [28, 13]], R[3]); d.poly([[15, 1], [28, 13], [15, 13]], R[1]);
  d.P(R[4], 15, 0, 1, 2);
  for (let y = 16; y < 68; y += 3) d.P('#6a6460', 22, y, 3, 1); // scaletta
  d.P('#6a6460', 22, 16, 1, 52); d.P('#6a6460', 24, 16, 1, 52);
  d.P('#b8784a', 6, 41, 2, 2); d.P('#a86a42', 12, 61, 2, 1); d.P('#a86a42', 13, 62);
  return outline(d.c);
}

export const OGGETTI = [
  ['Quercia', () => quercia(1)], ['Quercia 2', () => quercia(7)], ['Albero da frutto', () => quercia(3, true)],
  ['Pioppo', () => pioppo(1)], ['Cespuglio', () => cespuglio()], ['Cespuglio fiorito', () => cespuglio(true)], ['Canne', canne],
  ['Rotoballa', rotoballa], ['Rotoballa (lato)', rotoballaLato], ['Balla quadra', ballaQuadra],
  ['Staccionata', staccionata], ['Cancello', cancello], ['Abbeveratoio', abbeveratoio], ['Mangiatoia', mangiatoia],
  ['Cassa', cassa], ['Cassa vendita', cassaVendita], ['Uovo', uovo], ['Cesto uova', cestoUova],
  ['Tanica gasolio', tanica], ['Bidone', bidone], ['Carriola', carriola], ['Secchio', secchio], ['Sacco semi', saccoSemi], ['Zappa e forcone', attrezziMano],
  ['Silo', silo],
];
export const PAESE = [
  ['Cartello', () => cartello('CAMPI ↑')], ['Cartello', () => cartello('← BAR')], ['Inizio paese', () => cartelloPaese()],
  ['Lampione', lampione], ['Panchina', panchina], ['Fontanella', fontanella], ['Cassonetto', cassonetto],
  ['Cabina telefonica', cabina], ['Tavolino del bar', tavolinoBar], ['Fioriera', fioriera],
];
export const COLTURE = ['mais', 'pomodoro', 'grano'].flatMap(t => [1, 2, 3].map(s => [`${t[0].toUpperCase() + t.slice(1)} ${s}`, () => coltura(t, s)]));
