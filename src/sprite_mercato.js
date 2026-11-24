// Pixel art del mercato del giovedì e delle gare di trattori (segnaposto disegnati via codice,
// nello stile di src/pixel.js e src/sprite_vita.js). Scala: 16 pixel = 1 casella.
import * as PIX from './pixel.js';
import { disegna } from './sprite_vita.js';

// Bancarella con tendone a strisce e merce sul banco. merce: 'pomodori' | 'uova' | 'mais' | 'salami' | 'pentole'
export function bancarella(tenda = '#c83a2a', merce = 'pomodori', insegna = '') {
  return disegna(52, 44, (P, g) => {
    // pali
    P('#6a4626', 3, 8, 2, 34); P('#6a4626', 47, 8, 2, 34);
    // tendone a strisce con frangia
    for (let x = 0; x < 52; x += 6) { P(tenda, x, 4, 3, 9); P('#f4efe2', x + 3, 4, 3, 9); }
    P('#2a1e18', 0, 3, 52, 1);
    for (let x = 1; x < 52; x += 4) P(tenda, x, 13, 2, 2);
    // insegna di legno
    if (insegna) { P('#8a5a30', 14, 0, 24, 5); P('#a8743e', 14, 0, 24, 1); }
    // banco
    P('#8a5a30', 2, 33, 48, 10); P('#a8743e', 2, 33, 48, 2); P('#6a4626', 2, 42, 48, 2);
    for (let x = 6; x < 50; x += 9) P('#7a4e28', x, 36, 1, 6);
    // telo sul davanti
    P('#e8dcc0', 4, 35, 44, 4); for (let x = 4; x < 48; x += 4) P('#c8b890', x, 38, 2, 1);
    // merce (sul banco, più in basso: così il venditore dietro si vede)
    const P0 = P; P = (c, x, y, w, h) => P0(c, x, y + 5, w, h);
    const M = {
      pomodori: () => { for (let i = 0; i < 9; i++) { const x = 5 + i * 4.7, y = 24 + (i % 2); P('#d8322a', x, y, 4, 4); P('#3a8a2a', x + 1, y - 1, 2, 1); P('#f07060', x + 1, y + 1, 1, 1); } P('#c8a050', 34, 21, 12, 7); for (let i = 0; i < 4; i++) P('#b8884a', 35 + i * 3, 22, 2, 2); },
      uova: () => { for (let k = 0; k < 3; k++) { const bx = 5 + k * 15; P('#b8a070', bx, 25, 13, 3); for (let i = 0; i < 4; i++) { P('#f8f0dc', bx + 1 + i * 3, 22, 2, 3); P('#fffaf0', bx + 1 + i * 3, 22, 1, 1); } } },
      mais: () => { for (let i = 0; i < 7; i++) { const x = 5 + i * 6.3; P('#f0c838', x, 21, 4, 7); P('#d8a820', x + 1, 22, 1, 5); P('#6a9a3a', x - 1, 25, 2, 3); P('#6a9a3a', x + 4, 25, 2, 3); } },
      salami: () => { P('#6a4626', 6, 16, 40, 1); for (let i = 0; i < 6; i++) { const x = 8 + i * 6.5; P('#8a2a2a', x, 17, 3, 9); P('#c8a8a0', x, 18 + (i % 3), 3, 1); P('#f0e0d0', x + 1, 16, 1, 1); } for (let i = 0; i < 3; i++) { P('#9a3030', 10 + i * 12, 24, 8, 4); P('#e8b8a8', 11 + i * 12, 25, 2, 2); } },
      pentole: () => { for (let i = 0; i < 4; i++) { const x = 5 + i * 11; P('#9aa0a8', x, 21, 9, 7); P('#c8d0d8', x, 21, 9, 1); P('#5a6068', x + 8, 22, 1, 6); P('#2a2a30', x - 1, 23, 1, 2); P('#2a2a30', x + 9, 23, 1, 2); } P('#f0d050', 38, 15, 8, 5); P('#2a1e18', 40, 17, 4, 1); },
    };
    (M[merce] || M.pomodori)();
  });
}

// Il carretto di Nando (con le ruote) per le pentole
export function carretto() {
  return disegna(48, 38, P => {
    P('#6a4626', 1, 22, 3, 2); P('#6a4626', 0, 23, 6, 1);                         // stanghe
    P('#8a5a30', 6, 14, 38, 14); P('#a8743e', 6, 14, 38, 2); P('#6a4626', 6, 26, 38, 2);
    for (let x = 10; x < 44; x += 7) P('#7a4e28', x, 17, 1, 9);
    // pentole impilate
    for (let i = 0; i < 4; i++) { const x = 9 + i * 8.5; P('#9aa0a8', x, 7 - (i % 2) * 2, 7, 7); P('#c8d0d8', x, 7 - (i % 2) * 2, 7, 1); }
    P('#c8a050', 16, 0, 16, 5); P('#f4efe2', 17, 1, 14, 3);                       // cartello «OCCASIONE»
    P('#2a2a30', 19, 2, 2, 1); P('#2a2a30', 23, 2, 2, 1); P('#2a2a30', 27, 2, 2, 1);
    // ruote
    for (const cx of [14, 36]) { P('#3a2a1c', cx - 6, 26, 12, 12); P('#a8743e', cx - 4, 28, 8, 8); P('#3a2a1c', cx - 1, 31, 2, 2); }
  });
}

// Pavé della piazzola del mercato (texture ripetibile 32x32)
export function pave() {
  const [c, g] = PIX.makeCanvas(32, 32);
  const R = PIX.rng(7);
  g.fillStyle = '#8c8478'; g.fillRect(0, 0, 32, 32);
  for (let y = 0; y < 32; y += 8) for (let x = (y / 8) % 2 ? -4 : 0; x < 32; x += 8) {
    const v = 150 + Math.floor(R() * 30);
    g.fillStyle = `rgb(${v + 12},${v + 6},${v - 8})`; g.fillRect(x + 1, y + 1, 6, 6);
    g.fillStyle = `rgba(255,255,255,0.12)`; g.fillRect(x + 1, y + 1, 6, 1);
  }
  return c;
}

// Bandierina a scacchi (traguardo e boa della gara)
export function bandierina(col = '#f4efe2') {
  return disegna(18, 40, P => {
    P('#5a5a62', 2, 2, 2, 38);
    for (let y = 0; y < 4; y++) for (let x = 0; x < 6; x++) P((x + y) % 2 ? '#1a1420' : col, 4 + x * 2, 3 + y * 2, 2, 2);
    P('#c83a2a', 1, 0, 4, 2);
  });
}

// Striscione del traguardo tra due pali (largo 4 caselle)
export function striscione(testo = 'TRAGUARDO') {
  const [c, g] = PIX.makeCanvas(64, 56);
  g.fillStyle = '#5a5a62'; g.fillRect(2, 6, 3, 50); g.fillRect(59, 6, 3, 50);
  g.fillStyle = '#f4efe2'; g.fillRect(4, 4, 56, 12);
  for (let x = 0; x < 28; x++) { g.fillStyle = x % 2 ? '#1a1420' : '#f4efe2'; g.fillRect(4 + x * 2, 14, 2, 2); g.fillStyle = x % 2 ? '#f4efe2' : '#1a1420'; g.fillRect(4 + x * 2, 2, 2, 2); }
  g.fillStyle = '#c83a2a'; g.font = 'bold 9px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(testo, 32, 10);
  return c;
}

// Lavagnetta delle gare (cartello con «GARE» e un trattorino)
export function lavagnaGare() {
  return disegna(26, 30, P => {
    P('#6a4626', 4, 14, 2, 16); P('#6a4626', 20, 14, 2, 16);
    P('#6a4626', 0, 0, 26, 17); P('#2a3a30', 2, 2, 22, 13);
    P('#f4efe2', 4, 4, 3, 1); P('#f4efe2', 4, 4, 1, 4); P('#f4efe2', 4, 7, 3, 1); P('#f4efe2', 6, 6, 1, 2);   // G
    P('#c83a2a', 11, 7, 7, 3); P('#c83a2a', 13, 5, 3, 2); P('#1a1420', 11, 10, 3, 3); P('#1a1420', 17, 11, 2, 2); // trattorino
    P('#f0d050', 20, 4, 2, 2);
  });
}

// Pozza di fango (piatta, a terra)
export function pozzaFango() {
  const [c, g] = PIX.makeCanvas(40, 22);
  g.fillStyle = '#4a3420'; g.beginPath(); g.ellipse(20, 11, 19, 10, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#5e4428'; g.beginPath(); g.ellipse(18, 10, 14, 6, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(10, 7, 6, 1); g.fillRect(24, 13, 4, 1);
  return c;
}
