// Caselle del terreno 16x16, ripetibili senza cuciture.
import { pen, ramp, rng, hash, T } from './kit.js';

function tile(fn) { const d = pen(T, T); const W = (col, x, y) => d.P(col, ((x % T) + T) % T, ((y % T) + T) % T); fn(d, W); return d.c; }

// Ciuffo d'erba: punte chiare sopra, base scura
function ciuffo(W, R, x, y) {
  W(R[3], x, y - 1); W(R[3], x + 2, y - 1); W(R[4], x + 1, y - 2);
  W(R[1], x, y); W(R[3], x + 1, y - 1); W(R[1], x + 2, y);
  W(R[0], x + 1, y + 1); W(R[1], x + 1, y);
}

export function erba(v = 0) {
  return tile((d, W) => {
    const R = ramp('#5ca63c');
    d.P(R[2], 0, 0, T, T);
    for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
      const n = hash(x >> 2, y >> 2, v + 3) * 0.6 + hash(x, y, v) * 0.4;
      if (n < 0.16) W(R[1], x, y); else if (n > 0.86) W(R[3], x, y);
    }
    const r = rng(v * 13 + 5);
    for (let i = 0; i < 6; i++) ciuffo(W, R, r() * T | 0, r() * T | 0);
    if (v === 1) { // fiorellini bianchi e gialli (margherite)
      for (let i = 0; i < 2; i++) {
        const x = r() * T | 0, y = r() * T | 0, col = i % 2 ? '#f6f2e4' : '#f4d23c';
        W(col, x - 1, y); W(col, x + 1, y); W(col, x, y - 1); W(col, x, y + 1); W(i % 2 ? '#f0c030' : '#c8781c', x, y);
      }
    } else if (v === 2) { // trifoglio scuro e sassolini
      for (let i = 0; i < 5; i++) { const x = r() * T | 0, y = r() * T | 0; W(R[0], x, y); W(R[0], x + 1, y); W(R[1], x, y + 1); }
      for (let i = 0; i < 2; i++) { const x = r() * T | 0, y = r() * T | 0; W('#a8a090', x, y); W('#d8d0c0', x, y - 1 + 1 - 1); W('#6a6458', x + 1, y); }
    }
  });
}

export function sterrato(v = 0) {
  return tile((d, W) => {
    const R = ramp('#b68c58');
    d.P(R[2], 0, 0, T, T);
    for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
      const n = hash(x, y, 40 + v);
      if (n < 0.12) W(R[1], x, y); else if (n > 0.9) W(R[3], x, y);
    }
    const r = rng(77 + v);
    for (let i = 0; i < 5; i++) { // sassi
      const x = r() * T | 0, y = r() * T | 0, S = ramp(r() < 0.5 ? '#a09888' : '#8c8478');
      W(S[3], x, y); W(S[2], x + 1, y); W(S[1], x, y + 1); W(S[1], x + 1, y + 1); W(R[0], x, y + 2); W(R[0], x + 1, y + 2);
    }
    if (v === 1) { // solchi delle ruote
      for (let x = 0; x < T; x++) { W(R[1], x, 4); W(R[0], x, 5); W(R[3], x, 6); W(R[1], x, 11); W(R[0], x, 12); W(R[3], x, 13); }
    }
  });
}

export function asfalto(riga = false, v = 0) {
  return tile((d, W) => {
    const R = ramp('#5c6068');
    d.P(R[2], 0, 0, T, T);
    for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
      const n = hash(x, y, 90 + v);
      if (n < 0.07) W(R[1], x, y); else if (n > 0.985) W(R[4], x, y); else if (n > 0.93) W(R[3], x, y);
    }
    if (v === 1) { // crepa e toppa
      const r = rng(5); let x = 3, y = 2;
      for (let i = 0; i < 9; i++) { W(R[0], x, y); x += r() < 0.6 ? 1 : 0; y += 1; }
      d.P(R[1], 9, 9, 5, 4); d.P(tone2(R), 9, 9, 5, 1);
    }
    if (riga) { // mezzeria tratteggiata, un po' consumata
      const Lw = ramp('#ece6cc');
      for (let x = 2; x < 12; x++) { W(Lw[2], x, 7); W(Lw[1], x, 8); }
      W(R[2], 5, 7); W(R[2], 9, 8);
    }
  });
}
function tone2(R) { return R[0]; }

export function piazza() {
  return tile((d, W) => {
    const gap = '#5e5448';
    d.P(gap, 0, 0, T, T);
    const bases = ['#b4a690', '#a89880', '#bcae98', '#9e907c'];
    for (let row = 0; row < 4; row++) for (let col = 0; col < 4; col++) {
      const ox = col * 4 + (row % 2) * 2, oy = row * 4;
      const R = ramp(bases[(hash(col, row, 7) * 4) | 0]);
      for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) {
        let k = 2;
        if (i === 0 || j === 0) k = 3;
        if (i === 2 || j === 2) k = 1;
        if (i === 0 && j === 0) k = 4;
        if (i === 2 && j === 2) k = 0;
        W(R[k], ox + i, oy + j);
      }
    }
  });
}

export function acqua(frame = 0) {
  return tile((d, W) => {
    const R = ramp('#3d80cc');
    d.P(R[2], 0, 0, T, T);
    for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) if (hash(x >> 2, y >> 1, 9) < 0.25) W(R[1], x, y);
    const waves = [[1, 2, 4], [9, 5, 3], [4, 9, 4], [12, 12, 3], [0, 14, 2]];
    for (const [x, y, l] of waves) {
      const sx = x + frame * 2;
      for (let i = 0; i < l; i++) { W(R[3], sx + i, y); W(R[1], sx + i, y + 1); }
      W(R[4], sx + 1, y);
    }
    W('#e4f2ff', 6 + frame, 3); W('#e4f2ff', 13 - frame, 10);
  });
}

// Riva: erba in alto, argine di fango, poi acqua
export function riva(frame = 0) {
  const base = acqua(frame);
  return tile((d, W) => {
    d.g.drawImage(base, 0, 0);
    const G = ramp('#5ca63c'), M = ramp('#7a5634');
    for (let x = 0; x < T; x++) {
      const e = 4 + Math.round(hash(x >> 1, 0, 31) * 1.6);
      d.P(G[2], x, 0, 1, e);
      if (hash(x, 1, 2) > 0.7) d.P(G[3], x, 1);
      d.P(G[1], x, e - 1);
      d.P(M[1], x, e); d.P(M[0], x, e + 1);
      d.P('#a8d2f4', x, e + 2);
      if (x % 3 === 0) d.P('#d8ecff', x, e + 2);
    }
    // canne
    for (const x of [3, 4, 11]) { d.P('#6a8a3a', x, 0, 1, 4); d.P('#7a4a2a', x, 0, 1, 2); }
  });
}

export function ponte() {
  return tile((d, W) => {
    const bases = ['#a8743e', '#9c6a38', '#b07c46', '#a06e3c'];
    for (let p = 0; p < 4; p++) {
      const R = ramp(bases[p]), x0 = p * 4;
      d.P(R[2], x0, 0, 3, T); d.P(R[3], x0, 0, 1, T); d.P(R[1], x0 + 2, 0, 1, T); d.P(R[0], x0 + 3, 0, 1, T);
      for (let y = 0; y < T; y++) if (hash(p, y, 4) < 0.15) d.P(R[1], x0 + 1, y);
      d.P('#3a3030', x0 + 1, 2); d.P('#3a3030', x0 + 1, 13);
      d.P('#c8c0b0', x0 + 1, 1); d.P('#c8c0b0', x0 + 1, 12);
    }
  });
}

export function arato() {
  return tile((d, W) => {
    const R = ramp('#8a5e36');
    for (let y = 0; y < T; y++) {
      const k = [4, 3, 2, 1, 0, 1][y % 4 === 0 ? 0 : y % 4 === 1 ? 1 : y % 4 === 2 ? 3 : 4];
      d.P(R[k], 0, y, T, 1);
    }
    for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
      const n = hash(x, y, 55);
      if (n > 0.92 && y % 4 < 2) W(R[4], x, y);
      else if (n < 0.08) W(R[1], x, y);
    }
  });
}

export function zolla(bagnata = false) {
  return tile((d, W) => {
    const R = ramp(bagnata ? '#57361f' : '#7c522e');
    d.P(R[2], 0, 0, T, T);
    const r = rng(bagnata ? 9 : 8);
    for (let i = 0; i < 14; i++) { // zollette
      const x = r() * T | 0, y = r() * T | 0;
      W(R[3], x, y); W(R[2], x + 1, y); W(R[1], x, y + 1); W(R[0], x + 1, y + 1);
    }
    if (bagnata) { W('#9ab8d0', 4, 5); W('#9ab8d0', 11, 10); W('#c8dcec', 5, 5); }
  });
}

function spighe(d, W, stem, ear) {
  const S = ramp(stem), E = ramp(ear);
  for (const row of [2, 7, 12]) {
    for (let x = 0; x < T; x += 2) {
      const ox = x + (row === 7 ? 1 : 0), oy = row + Math.round(hash(x, row, 3) * 2);
      W(S[1], ox, oy + 3); W(S[2], ox, oy + 2); W(S[0], ox, oy + 4);
      W(E[3], ox, oy); W(E[2], ox, oy + 1); W(E[4], ox, oy - 1); W(E[1], ox + 1, oy + 1);
    }
  }
}
export function grano(maturo = true) {
  return tile((d, W) => {
    const R = ramp(maturo ? '#b88c34' : '#4f8e34');
    d.P(R[1], 0, 0, T, T);
    spighe(d, W, maturo ? '#c09438' : '#4a8a30', maturo ? '#ecc858' : '#86c45a');
  });
}

export function fango() {
  return tile((d, W) => {
    const R = ramp('#6e5232');
    d.P(R[2], 0, 0, T, T);
    for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) if (hash(x >> 1, y >> 1, 12) < 0.3) W(R[1], x, y);
    const Pz = ramp('#5c4630');
    d.ell(9, 9, 4.5, 2.5, Pz[1]); d.ell(9, 9.5, 3, 1.5, Pz[0]);
    d.P('#a8987c', 7, 8, 2, 1); d.P('#c8b89c', 7, 8);
    for (const [x, y] of [[2, 3], [4, 4], [12, 2]]) { W(R[0], x, y); W(R[0], x + 1, y); W(R[3], x, y - 1); } // impronte
  });
}

export function paglia() {
  return tile((d, W) => {
    const R = ramp('#a88458');
    d.P(R[2], 0, 0, T, T);
    for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) if (hash(x, y, 70) < 0.12) W(R[1], x, y);
    const r = rng(21);
    for (let i = 0; i < 12; i++) {
      const x = r() * T | 0, y = r() * T | 0, dir = r() < 0.5 ? 1 : -1, col = r() < 0.5 ? '#ecca70' : '#c8a048';
      for (let k = 0; k < 3; k++) W(col, x + k * dir, y + (k >> 1));
    }
  });
}

export function ghiaia() {
  return tile((d, W) => {
    const R = ramp('#b2a58c');
    d.P(R[2], 0, 0, T, T);
    for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
      const n = hash(x, y, 33);
      if (n < 0.06) W(R[0], x, y); else if (n < 0.2) W(R[1], x, y); else if (n > 0.95) W(R[4], x, y); else if (n > 0.85) W(R[3], x, y);
    }
  });
}

export function marciapiede() {
  return tile((d, W) => {
    const R = ramp('#b8b4ac');
    d.P(R[2], 0, 0, T, T);
    for (let y = 0; y < T; y += 8) { d.P(R[0], 0, y + 7, T, 1); d.P(R[3], 0, y, T, 1); }
    for (let y = 0; y < T; y += 8) { const ox = (y / 8) % 2 ? 4 : 12; d.P(R[0], ox, y, 1, 7); d.P(R[3], ox + 1, y + 1, 1, 6); }
    for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) if (hash(x, y, 61) > 0.93) W(R[1], x, y);
  });
}

// Elenco per il foglio d'anteprima
export const TERRENI = [
  ['Erba', () => erba(0)], ['Erba fiorita', () => erba(1)], ['Erba e sassi', () => erba(2)],
  ['Sterrato', () => sterrato(0)], ['Carraia', () => sterrato(1)], ['Ghiaia (aia)', ghiaia],
  ['Asfalto', () => asfalto(false)], ['Asfalto rotto', () => asfalto(false, 1)], ['Mezzeria', () => asfalto(true)],
  ['Piazza', piazza], ['Marciapiede', marciapiede], ['Ponte', ponte],
  ['Acqua 1', () => acqua(0)], ['Acqua 2', () => acqua(1)], ['Riva', () => riva(0)],
  ['Arato', arato], ['Orto', () => zolla(false)], ['Orto bagnato', () => zolla(true)],
  ['Grano verde', () => grano(false)], ['Grano maturo', () => grano(true)], ['Fango maiali', fango], ['Pollaio', paglia],
];
