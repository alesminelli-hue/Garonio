// Pixel art del mondo vivo (segnaposto disegnati via codice, nello stile di src/pixel.js):
// auto, Ape, camion, gatti, corvi, anatre, barboncino, buche, pozzanghere, cantiere, lampioni, aloni di luce.
// Scala: 16 pixel = 1 casella (PIX.PX). Gli sprite di lato guardano a destra: per la sinistra si usa mirror().
import * as PIX from './pixel.js';
import * as HDM from './hd/mezzi.js';
import * as HDB from './hd/bestiario.js';

const INK = '#1a1420';
export function outline(c, color = INK) {
  const g = c.getContext('2d'), { width: w, height: h } = c;
  const d = g.getImageData(0, 0, w, h).data;
  const a = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? 0 : d[(y * w + x) * 4 + 3];
  g.fillStyle = color;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (a(x, y)) continue;
    if (a(x - 1, y) || a(x + 1, y) || a(x, y - 1) || a(x, y + 1)) g.fillRect(x, y, 1, 1);
  }
  return c;
}
export function disegna(w, h, draw, bordo = true) {
  const [c, g] = PIX.makeCanvas(w, h);
  const P = (col, x, y, ww = 1, hh = 1) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), Math.round(ww), Math.round(hh)); };
  draw(P, g);
  return bordo ? outline(c) : c;
}
const shade = (hex, k) => {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round((n >> 16 & 255) * k), g = Math.round((n >> 8 & 255) * k), b = Math.round((n & 255) * k);
  return `rgb(${Math.min(255, r)},${Math.min(255, g)},${Math.min(255, b)})`;
};
const ruota = (P, cx, cy, f) => { P('#1e1e22', cx - 3, cy - 3, 6, 6); P('#8a8a92', cx - 1, cy - 1, 2, 2); P('#5a5a62', cx - 1 + (f ? 1 : 0), cy - 3, 1, 1); };

// ---------- Mezzi del traffico (di lato, verso destra). f = frame ruote ----------
export function auto(col, f = 0) {
  return disegna(40, 22, P => {
    P(col, 2, 10, 36, 7); P(shade(col, 0.75), 2, 15, 36, 2);            // fiancata
    P(col, 10, 4, 18, 7); P(shade(col, 1.15), 10, 4, 18, 1);             // abitacolo
    P('#9ad0f0', 12, 5, 6, 5); P('#9ad0f0', 20, 5, 7, 5); P('#d8f0ff', 12, 5, 2, 2);
    P(shade(col, 0.6), 19, 5, 1, 6);                                      // montante
    P('#fff6a0', 36, 11, 2, 2); P('#c02020', 2, 11, 2, 2);               // fari
    P('#3a3a40', 1, 15, 3, 2); P('#3a3a40', 36, 15, 3, 2);               // paraurti
    P(shade(col, 0.6), 21, 12, 3, 1);                                     // maniglia
    ruota(P, 10, 17, f); ruota(P, 30, 17, f);
  });
}
export function ape(col, f = 0) {
  return disegna(30, 22, P => {
    P('#a88a5a', 1, 7, 15, 9); P('#8a6e44', 1, 7, 15, 1);               // cassone di legno
    P('#6a5030', 4, 9, 1, 6); P('#6a5030', 9, 9, 1, 6); P('#6a5030', 13, 9, 1, 6);
    P(col, 16, 3, 12, 13); P(shade(col, 1.2), 16, 3, 12, 1);            // cabina
    P('#9ad0f0', 20, 5, 7, 5); P('#d8f0ff', 20, 5, 2, 2);
    P(shade(col, 0.7), 16, 14, 12, 2); P('#fff6a0', 27, 11, 2, 2);
    ruota(P, 7, 17, f); ruota(P, 24, 17, f);
  });
}
export function camion(col, f = 0) {
  return disegna(60, 30, P => {
    P(col, 1, 3, 40, 18); P(shade(col, 0.85), 1, 18, 40, 3);           // cisterna/cassone
    P(shade(col, 0.7), 1, 8, 40, 1); P('#3a5fa8', 6, 10, 26, 5);
    P('#f4f4f4', 8, 11, 22, 3);                                          // scritta "LATTE"
    P('#2a2a30', 41, 18, 3, 3);
    P('#c83a2e', 44, 6, 14, 15); P('#e85a4e', 44, 6, 14, 1);            // motrice
    P('#9ad0f0', 50, 8, 7, 6); P('#d8f0ff', 50, 8, 2, 2);
    P('#fff6a0', 56, 16, 2, 2); P('#3a3a40', 44, 20, 16, 2);
    ruota(P, 9, 24, f); ruota(P, 18, 24, f); ruota(P, 51, 24, f);
  });
}
// Traffico HD (src/hd/mezzi.js, scala 20 px = 1 casella come i mezzi di Garonio): niente fotogrammi delle ruote.
export const AUTO_PX = 20;
export function auto_(tipo, col, f) { return tipo === 'ape' ? HDM.apeLato(col) : tipo === 'camion' ? HDM.camionLato(col) : HDM.puntoLato(col); }

// ---------- Animali ----------
export function gatto(col, frame = 0) {   // 0/1 passo, 2 dorme
  const spr = PIX.animale('gatto', frame, 14, 10, { tinta: col, dorme: frame === 2 }); if (spr) return spr;
  return disegna(14, 10, P => {
    if (frame === 2) { P(col, 2, 5, 10, 5); P(col, 9, 3, 4, 4); P(shade(col, 0.7), 1, 7, 3, 2); P(col, 9, 2, 1, 1); P(col, 12, 2, 1, 1); P(INK, 10, 5, 2, 1); return; }
    P(col, 0, 1 + frame, 2, 5);                    // coda alzata
    P(col, 2, 4, 8, 4);                            // corpo
    P(col, 9, 1, 5, 4); P(col, 9, 0, 1, 1); P(col, 13, 0, 1, 1);   // testa e orecchie
    P('#90e060', 11, 2, 1, 1); P('#f0a0a0', 13, 3, 1, 1);
    P(shade(col, 0.7), 3, 8, 1, 2 - frame); P(shade(col, 0.7), 5, 8, 1, 1 + frame); P(shade(col, 0.7), 7, 8, 1, 2 - frame); P(shade(col, 0.7), 9, 8, 1, 1 + frame);
  });
}
export const corvo = HDB.corvo; // HD fantasy (src/hd/bestiario.js)
export const anatra = HDB.anatra; // HD fantasy (src/hd/bestiario.js)
export const barboncino = HDB.barboncino; // HD fantasy (src/hd/bestiario.js)
export function cane(frame = 0, pelo = '#b89060', scuro = '#6a4a2a') {
  const spr = PIX.animale('cane', frame, 22, 15, { tinta: pelo }); if (spr) return spr;
  return disegna(22, 15, P => {
    P(scuro, 1, 4 + frame, 3, 2); P(scuro, 3, 5, 2, 2);
    P(pelo, 4, 6, 12, 5); P(scuro, 7, 6, 4, 2);                   // macchia
    P(pelo, 14, 2, 6, 6); P(scuro, 14, 1, 2, 3);
    P(pelo, 19, 5, 3, 3); P(INK, 21, 5, 1, 1); P(INK, 17, 4, 1, 1);
    P('#f0f0f0', 19, 8, 1, 1);                                      // dente
    P(scuro, 5, 11, 2, 3 - frame); P(scuro, 9, 11, 2, 2 + frame); P(scuro, 12, 11, 2, 3 - frame); P(scuro, 14, 11, 2, 2 + frame);
  });
}

// ---------- Strada: buche, pozzanghere, cantiere ----------
export function buca(seed = 1) {
  const R = PIX.rng(seed);
  return disegna(20, 14, P => {
    for (let i = 0; i < 26; i++) {
      const a = R() * Math.PI * 2, r = R() * 0.9;
      P('#3a3028', 10 + Math.cos(a) * r * 8, 7 + Math.sin(a) * r * 5, 2, 2);
    }
    P('#1e1812', 6, 5, 8, 4); P('#2a221a', 5, 6, 10, 2);
    P('#6a6058', 4, 3, 2, 1); P('#6a6058', 15, 10, 2, 1); P('#6a6058', 14, 3, 1, 1);
  }, false);
}
export function pozza(seed = 1) {
  const R = PIX.rng(seed + 7);
  return disegna(28, 16, P => {
    for (let i = 0; i < 40; i++) {
      const a = R() * Math.PI * 2, r = Math.sqrt(R());
      P('#5a7890', 14 + Math.cos(a) * r * 12, 8 + Math.sin(a) * r * 6, 2, 2);
    }
    P('#8ab0c8', 9, 5, 6, 1); P('#a8d0e8', 17, 9, 3, 1);
  }, false);
}
export const cono = () => disegna(7, 11, P => { P('#f06020', 2, 1, 3, 8); P('#f4f4f4', 2, 3, 3, 2); P('#f06020', 0, 9, 7, 2); });
export const transenna = () => disegna(40, 14, P => {
  for (let x = 0; x < 40; x += 8) { P('#e02020', x, 2, 4, 4); P('#f4f4f4', x + 4, 2, 4, 4); }
  P('#7a7a80', 2, 6, 2, 8); P('#7a7a80', 36, 6, 2, 8); P('#f0a020', 18, 0, 3, 2);
});
export const cartelloLavori = () => disegna(16, 24, P => {
  P('#7a7a80', 7, 12, 2, 12);
  P('#f4f4f4', 1, 1, 14, 12); P('#e02020', 1, 1, 14, 2); P('#e02020', 1, 11, 14, 2); P('#e02020', 1, 1, 2, 12); P('#e02020', 13, 1, 2, 12);
  P(INK, 6, 4, 3, 2); P(INK, 5, 6, 2, 4); P(INK, 8, 6, 2, 3); P(INK, 9, 9, 3, 1);   // omino con la pala
});
export const carriola = () => disegna(18, 10, P => { P('#4a7a4a', 2, 1, 11, 5); P('#3a6a3a', 3, 5, 9, 2); P('#6a6a72', 12, 4, 6, 1); ruota(P, 4, 7, 0); P('#2a2a30', 9, 7, 1, 3); });

// ---------- Luci della sera ----------
export const lampione = () => disegna(8, 50, P => {
  P('#3a3a44', 3, 6, 2, 44); P('#2a2a34', 2, 47, 4, 3);
  P('#3a3a44', 1, 3, 6, 3); P('#fff0b0', 2, 6, 4, 2);
});
// alone radiale (senza bordo) per luci additive
export function alone(rgb = '255,210,140', size = 64) {
  const [c, g] = PIX.makeCanvas(size, size);
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gr.addColorStop(0, `rgba(${rgb},1)`); gr.addColorStop(0.35, `rgba(${rgb},0.45)`); gr.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = gr; g.fillRect(0, 0, size, size);
  return c;
}
export function insegnaNeon(testo, col = '#ff4fc8') {
  const [c, g] = PIX.makeCanvas(testo.length * 7 + 10, 16);
  g.fillStyle = '#1a0e24'; g.fillRect(0, 0, c.width, 16);
  g.strokeStyle = col; g.lineWidth = 1; g.strokeRect(1.5, 1.5, c.width - 3, 13);
  g.fillStyle = col; g.font = 'bold 9px monospace'; g.textBaseline = 'top'; g.fillText(testo, 5, 3);
  return c;
}
export function fumetto(testo) {
  const w = Math.max(14, testo.length * 5 + 6);
  const [c, g] = PIX.makeCanvas(w, 13);
  g.fillStyle = '#fff'; g.fillRect(1, 1, w - 2, 9); g.fillRect(4, 10, 3, 2);
  g.fillStyle = INK; g.font = '8px monospace'; g.textBaseline = 'top'; g.fillText(testo, 3, 1);
  return outline(c);
}

// ---------- Lavoretti ed easter egg ----------
export const ceppo = (accetta = true) => disegna(16, 14, P => {
  P('#7a5434', 2, 6, 12, 8); P('#c8a070', 3, 5, 10, 2); P('#8a6038', 6, 5, 3, 1);
  if (accetta) { P('#7a5a3a', 9, 0, 2, 7); P('#b8b8c0', 7, 0, 5, 3); }
});
export const catasta = () => disegna(30, 20, P => {
  for (let r = 0; r < 3; r++) for (let i = 0; i < 5 - r; i++) {
    const x = 2 + i * 5 + r * 2.5, y = 14 - r * 5;
    P('#7a5434', x, y, 5, 5); P('#c8a070', x + 1, y + 1, 3, 3); P('#8a6038', x + 2, y + 2, 1, 1);
  }
});
export const pontile = () => disegna(32, 14, P => {
  P('#8a6038', 0, 2, 32, 6); for (let x = 0; x < 32; x += 4) P('#6a4826', x, 2, 1, 6);
  P('#5a3a20', 3, 8, 2, 6); P('#5a3a20', 27, 8, 2, 6);
});
export const fontana = () => disegna(26, 22, P => {
  P('#a8a8b0', 1, 12, 24, 9); P('#c8c8d0', 1, 12, 24, 2); P('#5a90c8', 3, 14, 20, 4);
  P('#a8a8b0', 11, 3, 4, 10); P('#c8c8d0', 8, 2, 10, 2);
  P('#8ad0ff', 12, 0, 2, 2); P('#8ad0ff', 7, 4, 1, 6); P('#8ad0ff', 18, 4, 1, 6);
});
export const gnomo = () => disegna(10, 16, P => {
  P('#d83a2e', 3, 0, 4, 2); P('#d83a2e', 2, 2, 6, 3);         // cappello
  P('#f0c8a8', 3, 5, 4, 2); P('#f4f4f4', 2, 7, 6, 3);          // faccia e barba
  P('#3a6ac8', 2, 10, 6, 4); P('#5a3a22', 2, 14, 2, 2); P('#5a3a22', 6, 14, 2, 2);
  P('#1a1420', 4, 5, 1, 1); P('#1a1420', 6, 5, 1, 1);
});
export function maialino(frame = 0) {
  const spr = PIX.animale('maiale', frame, 18, 12); if (spr) return spr;
  return disegna(18, 12, P => {
    P('#f0a0b0', 3, 3, 11, 6); P('#e08898', 3, 7, 11, 2);
    P('#f0a0b0', 13, 2, 4, 5); P('#e07888', 16, 4, 2, 2); P('#1a1420', 15, 3, 1, 1); P('#e07888', 13, 1, 2, 2);
    P('#e07888', 1, 3 + frame, 2, 1);
    P('#c86878', 4, 9, 2, 3 - frame); P('#c86878', 7, 9, 2, 2 + frame); P('#c86878', 10, 9, 2, 3 - frame); P('#c86878', 12, 9, 2, 2 + frame);
  });
}
export const cerchioGrano = () => {
  const [c, g] = PIX.makeCanvas(64, 64);
  g.strokeStyle = '#a88a30'; g.lineWidth = 3;
  for (const r of [28, 18, 8]) { g.beginPath(); g.arc(32, 32, r, 0, Math.PI * 2); g.stroke(); }
  g.beginPath(); g.moveTo(4, 32); g.lineTo(60, 32); g.moveTo(32, 4); g.lineTo(32, 60); g.stroke();
  return c;
};
