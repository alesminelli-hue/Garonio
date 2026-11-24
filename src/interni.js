// Interni degli edifici (GDD capitolo 17): casa, officina, capannone dei maiali, bar e magazzino del Bubetto.
// Ogni interno è una stanza a parte, costruita in 3D nello stesso stile HD-2D della mappa (pixel art nitida,
// luce calda, ombre morbide) e messa fuori dalla mappa, oltre il bordo est. Si entra dalla porta con E,
// si esce dallo zerbino con E. La camera è fissa sulla stanza dove si trova Garonio. Il tempo continua a scorrere.
// I dati (stanze, mobili, testi) stanno in src/data/interni.js.
//
// API (game.interni):
//   attivo, edificio            true e 'casa' | 'officina' | 'maiali' | 'bar' | 'magazzino' | 'meccanico' | 'chiesa' | ... quando Garonio è dentro
//   entra(id) / esci()          entra o esce (async). game.enter(id) passa da qui.
//   aggancia('edificio:zona', async ctx => ...)
//                               sostituisce l'azione di un mobile (tasto E). ctx = { game, edificio, zona, mobile,
//                               box, reparto, tavolo, predefinito }: predefinito() esegue l'azione di serie.
//                               Zone: casa:letto|armadio|poster|trofei|tv|divano|tavola|bacheca|calendario|conti|deposito|cantina
//                                     officina (il deposito di casa):bancone|scaffale|sacchi|rastrelliera|armadietti
//                                     meccanico (Zeno, in paese):bancone|ponte|mola|calendario|caffe
//                                     chiesa, castello, farmacia, dottore, palestra, pizzeria, kebab: vedi src/edifici.js
//                                     maiali:box|mangime|parto|infermeria|grata
//                                     bar:bancone|consulente|tavolo|carte|biliardo|jukebox|annunci|retro
//                                     magazzino:bancone|scaffali|usato|lavagna
//   registra(id, def)           aggiunge un interno nuovo (es. una tana), stesso formato di src/data/interni.js
//   mondo(id, x, z)             da coordinate locali della stanza a coordinate del mondo
//   stanza()                    la stanza attuale { id, nome, ... }
// I PNG con un posto `interno: 'bar'` (src/data/png.js) compaiono solo dentro, alle coordinate locali del posto.
// Eventi: entrato { edificio }, uscito { edificio }, traccia { bestia, luogo }.
import * as THREE from 'three';
import * as PIX from './pixel.js';
import { ramp, tone as hdTono, hash as hdHash } from './hd/kit.js';
import * as HDO from './hd/oggetti.js';
import { INTERNI, TESTI, MAIALI_FINTI, JUKEBOX, PORTE } from './data/interni.js';
import { BUILDINGS, MAP_W, PLACES } from './map.js';
import { SPALLE } from './world.js';
import { VESTITI } from './data/armi.js';
import { PNG } from './data/png.js';
import { BAR, NOMI } from './data/dialoghi.js';
import { puoComparire } from './data/nemici.js';
import { pick, fill, pagina, ora, variabiliMissione } from './racconto.js';
import { CONFIG } from './game.js';

const BASE_X = 600, PASSO = 70, BASE_Z = 30;   // le stanze stanno in fila, oltre il bordo est della mappa
const H = 60;
const PX = 16;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const EL = THREE.MathUtils.degToRad(38);         // inclinazione della camera dentro (fuori è circa 35°)

// ---------- Pixel art ----------
function tono(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const r = clamp(Math.round((n >> 16 & 255) * f), 0, 255), g = clamp(Math.round((n >> 8 & 255) * f), 0, 255), b = clamp(Math.round((n & 255) * f), 0, 255);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}
// canvas di wu × hu unità (16 px l'una); draw(P, W, H, g, rnd)
function tela(wu, hu, draw, seed = 1) {
  const W = Math.max(2, Math.round(wu * PX)), Hh = Math.max(2, Math.round(hu * PX));
  const [c, g] = PIX.makeCanvas(W, Hh);
  const P = (col, x, y, w = 1, h = 1) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  draw(P, W, Hh, g, PIX.rng(seed * 7919 + W * 31 + Hh));
  return c;
}
const tex = (wu, hu, draw, seed) => PIX.toTexture(tela(wu, hu, draw, seed));
// superfici in stile HD (src/hd/kit.js): toni con l'ombra che vira al viola e la luce al giallo
const rumore = (col, k = 0.06) => (P, W, H, g, r) => {
  P(col, 0, 0, W, H);
  const sp = hdTono(col, -k * 5), sl = hdTono(col, k * 5), s = (r() * 1000) | 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const n = hdHash(x >> 1, y >> 1, s) * 0.6 + hdHash(x, y, s + 1) * 0.4;
    if (n < 0.14) P(sp, x, y); else if (n > 0.88) P(sl, x, y);
  }
};
const pieno = (col, bordo = true) => (P, W, H, g, r) => {
  rumore(col, 0.04)(P, W, H, g, r);
  if (bordo) {
    const R = ramp(col);
    P(R[4], 1, 1, W - 2, 1); P(R[3], 1, 2, W - 2, 1); P(R[3], 1, 1, 1, H - 2);
    P(R[1], 1, H - 3, W - 2, 2); P(R[1], W - 2, 1, 1, H - 2);
  }
};
const legno = (col, verticale = false) => (P, W, H, g, r) => {
  const n = verticale ? W : H, L = verticale ? H : W;
  for (let i = 0; i < n; i += 4) {
    const R = ramp(hdTono(col, (r() - 0.5) * 0.35));
    const A = (c, o, a, len, t = 1) => verticale ? P(c, i + o, a, t, len) : P(c, a, i + o, len, t);
    A(R[2], 0, 0, L, 4); A(hdTono(R[2], 0.45), 0, 0, L); A(hdTono(R[2], -0.7), 3, 0, L);
    for (let k = 0; k < L / 12; k++) { const a = r() * L; A(hdTono(R[2], -0.4), 1 + (r() < 0.5 ? 0 : 1), a, 3 + r() * 5); }     // venature
    if (r() < 0.15) { const a = r() * (L - 3); A(R[0], 1, a, 2, 2); A(R[3], 1, a - 1, 1); }                    // nodo
  }
  const R = ramp(col); P(R[0], 0, H - 1, W, 1); P(R[0], W - 1, 0, 1, H);
};

// pavimenti: dipinti su una tela grande quanto la stanza
const PAVIMENTI = {
  parquet: (P, W, H, g, r) => {
    for (let y = 0; y < H; y += 4) {
      let x = -Math.floor(r() * 24);
      while (x < W) { const l = 20 + Math.floor(r() * 18), R = ramp(hdTono('#b07848', (r() - 0.5) * 0.7)); P(R[2], x, y, l, 4); P(R[3], x, y, l, 1); P(R[1], x, y + 3, l, 1); P(R[0], x + l - 1, y, 1, 4); if (r() < 0.4) P(R[1], x + 3 + r() * (l - 8), y + 1 + (r() < 0.5 ? 0 : 1), 4, 1); x += l; }
    }
  },
  cotto: (P, W, H) => { for (let y = 0; y < H; y += 8) for (let x = 0; x < W; x += 8) { const R = ramp(hdTono('#c0643a', (((x * 7 + y * 13) % 5) - 2) * 0.12)); P(R[2], x, y, 8, 8); P(R[3], x, y, 7, 1); P(R[3], x, y, 1, 7); P(R[4], x, y); P(R[1], x + 1, y + 6, 6, 1); P(R[0], x, y + 7, 8, 1); P(R[0], x + 7, y, 1, 8); } },
  scacchi: (P, W, H) => { for (let y = 0; y < H; y += 8) for (let x = 0; x < W; x += 8) { const R = ramp(((x + y) / 8) % 2 ? '#34323a' : '#e4dccb'); P(R[2], x, y, 8, 8); P(R[3], x, y, 7, 1); P(R[3], x, y, 1, 7); P(R[1], x + 1, y + 7, 7, 1); P(R[1], x + 7, y + 1, 1, 7); } },
  cemento: (P, W, H, g, r) => {
    rumore('#8a8a84', 0.08)(P, W, H, g, r);
    for (let x = 0; x < W; x += 48) P('#76766f', x, 0, 1, H);
    for (let i = 0; i < W / 30; i++) { const x = r() * W, y = r() * H; P('rgba(40,36,30,0.18)', x, y, 10 + r() * 14, 5 + r() * 6); }
  },
  moquette: (P, W, H, g, r) => { P('#5a1e4a', 0, 0, W, H); for (let i = 0; i < W * H / 12; i++) P(r() < 0.5 ? '#6a2a5a' : '#4a1640', r() * W, r() * H, 2, 1); },   // Night Paradiso (src/paradiso.js)
  marmo: (P, W, H, g, r) => { // chiesa: lastre chiare con le fughe e qualche venatura
    for (let y = 0; y < H; y += 16) for (let x = ((y / 16) % 2) * 8; x < W + 16; x += 16) {
      const R = ramp(hdTono(((x + y) / 16) % 2 ? '#e8e0d0' : '#d8ccb8', (hdHash(x, y, 3) - 0.5) * 0.25));
      P(R[2], x, y, 16, 16); P(R[3], x, y, 15, 1); P(R[1], x, y + 15, 16, 1); P(R[1], x + 15, y, 1, 16);
      if (hdHash(x, y, 5) < 0.5) for (let k = 0; k < 6; k++) P(R[1], x + 3 + k * 1.6, y + 4 + Math.sin(k + x) * 3, 1, 1);
    }
  },
  pietra: (P, W, H, g, r) => { // castello: lastroni di pietra irregolari
    P('#5a564e', 0, 0, W, H);
    for (let y = 0; y < H; y += 12) { let x = -((y / 12) % 2) * 9; while (x < W) { const l = 14 + Math.floor(r() * 12), R = ramp(hdTono('#8a8476', (r() - 0.5) * 0.5)); P(R[2], x + 1, y + 1, l - 2, 10); P(R[3], x + 1, y + 1, l - 2, 1); P(R[1], x + 1, y + 10, l - 2, 1); x += l; } }
  },
  gomma: (P, W, H, g, r) => { // palestra: pavimento in gomma nera a quadrotte
    for (let y = 0; y < H; y += 16) for (let x = 0; x < W; x += 16) { P('#2e2e34', x, y, 16, 16); P('#3a3a42', x, y, 15, 1); P('#222228', x, y + 15, 16, 1); }
    for (let i = 0; i < W * H / 40; i++) P(r() < 0.5 ? '#46464e' : '#5a5a3a', r() * W, r() * H, 1, 1);
  },
  assi: (P, W, H, g, r) => {
    for (let x = 0; x < W; x += 6) { const c = tono('#9a7048', 0.88 + r() * 0.2); P(c, x, 0, 6, H); P(tono(c, 0.7), x, 0, 1, H); for (let y = Math.floor(r() * 40); y < H; y += 40 + Math.floor(r() * 30)) P(tono(c, 0.6), x, y, 6, 1); }
  },
};
// muri (h unità di altezza): zoccolo in basso, motivo sopra
const MURI = {
  carta: (P, W, H) => { P('#efe0b8', 0, 0, W, H); for (let x = 0; x < W; x += 8) { P('#e4d2a4', x, 0, 3, H); for (let y = 4; y < H; y += 10) P('#c88a7a', x + 5, y + (x % 16 ? 5 : 0), 1, 1); } zoccolo(P, W, H, '#8a5a32', 14); },
  carta2: (P, W, H) => { P('#cfe0c0', 0, 0, W, H); for (let y = 0; y < H; y += 8) for (let x = (y / 8 % 2) * 4; x < W; x += 8) P('#b8cca8', x, y, 2, 2); zoccolo(P, W, H, '#7a4a2a', 14); },
  piastrelle: (P, W, H) => { P('#f0e8d0', 0, 0, W, H); const t = Math.round(H * 0.5); for (let y = H - t; y < H; y += 6) for (let x = 0; x < W; x += 6) { P('#e8eef0', x, y, 6, 6); P('#b8c4c8', x, y + 5, 6, 1); P('#b8c4c8', x + 5, y, 1, 6); } P('#5a8ab0', 0, H - t - 2, W, 2); },
  legno: (P, W, H, g, r) => { legno('#8a5a32', true)(P, W, H, g, r); P('#5a3a1c', 0, 0, W, 3); zoccolo(P, W, H, '#4a2e16', 10); },
  verde: (P, W, H) => { P('#2f5a3e', 0, 0, W, H); for (let x = 0; x < W; x += 10) P('#2a5238', x, 0, 2, H); P('#c8a050', 0, Math.round(H * 0.45), W, 1); zoccolo(P, W, H, '#4a2e16', 12); },
  mattoni: (P, W, H) => { P('#6a5a50', 0, 0, W, H); for (let y = 0; y < H; y += 5) for (let x = (y / 5 % 2) * 6 - 6; x < W; x += 12) { P(tono('#8a4a36', 0.85 + ((x * 3 + y) % 7) * 0.04), x + 1, y + 1, 11, 4); } },
  lamiera: (P, W, H) => { P('#8a96a0', 0, 0, W, H); for (let x = 0; x < W; x += 6) { P('#a4b0b8', x, 0, 2, H); P('#6a7680', x + 4, 0, 1, H); } for (let y = 0; y < H; y += 32) P('#5a6470', 0, y, W, 1); zoccolo(P, W, H, '#5a6068', 8); },
  velluto: (P, W, H) => { P('#4a1a3e', 0, 0, W, H); for (let x = 0; x < W; x += 6) P('#5a2450', x, 0, 2, H); P('#c8a040', 0, Math.round(H * 0.62), W, 1); P('#2a0e24', 0, H - 4, W, 4); },   // Night Paradiso
  chiesa: (P, W, H) => { // intonaco chiaro con le lesene e la fascia dorata
    P('#efe4c8', 0, 0, W, H);
    for (let x = 12; x < W; x += 48) { P('#e0d2b0', x, 0, 8, H); P('#f8f0dc', x, 0, 1, H); P('#c8b890', x + 7, 0, 1, H); }
    P('#c8a040', 0, Math.round(H * 0.42), W, 2); P('#a87a28', 0, Math.round(H * 0.42) + 2, W, 1);
    zoccolo(P, W, H, '#8a7a68', 16);
  },
  pietra: (P, W, H) => { // castello: conci di pietra
    P('#6a6458', 0, 0, W, H);
    for (let y = 0; y < H; y += 7) for (let x = -((y / 7) % 2) * 7; x < W; x += 14) { const R = ramp(tono('#9a9484', 0.86 + ((x * 7 + y * 3) % 9) * 0.035)); P(R[2], x + 1, y + 1, 12, 5); P(R[3], x + 1, y + 1, 12, 1); P(R[1], x + 1, y + 5, 12, 1); }
  },
  farmacia: (P, W, H) => { // bianco con la fascia verde
    P('#f2f2ee', 0, 0, W, H); for (let x = 0; x < W; x += 16) P('#e8e8e2', x, 0, 1, H);
    P('#3a8a5a', 0, Math.round(H * 0.55), W, 3); P('#5aaa7a', 0, Math.round(H * 0.55), W, 1);
    zoccolo(P, W, H, '#3a6a4a', 10);
  },
  palestra: (P, W, H) => { // blocchi di cemento con la riga gialla
    P('#c8c4b8', 0, 0, W, H);
    for (let y = 0; y < H; y += 8) { P('#b0aca0', 0, y + 7, W, 1); for (let x = ((y / 8) % 2) * 8; x < W; x += 16) P('#b0aca0', x, y, 1, 7); }
    P('#e8b030', 0, Math.round(H * 0.6), W, 6); P('#f4d060', 0, Math.round(H * 0.6), W, 1);
    zoccolo(P, W, H, '#3a3a42', 8);
  },
  lamiera2: (P, W, H, g, r) => { MURI.lamiera(P, W, H); for (let i = 0; i < W / 4; i++) P('rgba(150,80,30,0.35)', r() * W, r() * H, 2, 3 + r() * 8); },
};
function zoccolo(P, W, H, col, h) { const R = ramp(col); P(R[2], 0, H - h, W, h); P(R[4], 0, H - h, W, 1); P(R[3], 0, H - h + 1, W, 1); P(R[1], 0, H - 3, W, 2); P(R[0], 0, H - 1, W, 1); }

// facce dei mobili
const F = {
  armadio: (col) => (P, W, H, g, r) => {
    legno(col, true)(P, W, H, g, r);
    const m = W / 2;
    P(tono(col, 0.6), m, 2, 1, H - 4);
    for (const x0 of [3, m + 3]) { P(tono(col, 0.82), x0, 6, m - 6, H - 14); P(tono(col, 1.1), x0, 6, m - 6, 1); }
    P('#e0c060', m - 3, H / 2, 2, 3); P('#e0c060', m + 2, H / 2, 2, 3);
    P(tono(col, 0.55), 0, 0, W, 3); P(tono(col, 0.5), 0, H - 3, W, 3);
  },
  cassetti: (col, n = 2) => (P, W, H, g, r) => {
    legno(col)(P, W, H, g, r);
    const h = (H - 4) / n;
    for (let i = 0; i < n; i++) { P(tono(col, 0.65), 2, 2 + i * h, W - 4, 1); P('#d8b050', W / 2 - 2, 2 + i * h + h / 2, 4, 1); }
  },
  libri: (col) => (P, W, H, g, r) => {
    P(tono(col, 0.55), 0, 0, W, H);
    for (let y = 2; y < H - 2; y += 9) {
      let x = 2;
      while (x < W - 3) { const w = 2 + Math.floor(r() * 3), h = 5 + Math.floor(r() * 3); P(pick(['#a83a2a', '#3a6a9a', '#d8b050', '#4a8a4a', '#e8e0d0', '#6a3a7a']), x, y + 8 - h, w, h); x += w + (r() < 0.15 ? 2 : 0); }
      P(tono(col, 1.1), 0, y + 8, W, 1);
    }
    P(tono(col, 0.8), 0, 0, 2, H); P(tono(col, 0.8), W - 2, 0, 2, H);
  },
  scaffale: (merce) => (P, W, H, g, r) => {
    P('#4a3a2a', 0, 0, W, H);
    const righe = Math.max(2, Math.round(H / 9));
    const passo = (H - 2) / righe;
    for (let i = 0; i < righe; i++) {
      const y = 1 + i * passo, base = y + passo - 2;
      let x = 2;
      while (x < W - 3) {
        const it = MERCE[merce] ? MERCE[merce](r) : MERCE.oggetti(r);
        if (x + it.w > W - 2) break;
        P(it.c, x, base - it.h, it.w, it.h); if (it.c2) P(it.c2, x, base - it.h, it.w, 1);
        if (it.top) P(it.top, x + 1, base - it.h - 1, Math.max(1, it.w - 2), 1);
        x += it.w + 1;
      }
      P('#8a6a42', 0, base, W, 2);
    }
    P('#6a4a2a', 0, 0, 2, H); P('#6a4a2a', W - 2, 0, 2, H);
  },
};
const MERCE = {
  conserve: r => ({ w: 3, h: 4, c: pick(['#c8402a', '#e08a2a', '#7a2a3a', '#d8c040']), c2: '#f0f0f0', top: '#d8d8d8' }),
  vestiti: r => ({ w: 4 + Math.floor(r() * 2), h: 3, c: pick(['#3a5fa8', '#c8453c', '#3f8f3a', '#d8c050', '#6a4a2a', '#e8e0d0']), c2: '#ffffff40' }),
  armi: r => ({ w: 1, h: 6 + Math.floor(r() * 2), c: pick(['#8a6a42', '#7a5a32']), top: pick(['#a8b0b8', '#c8c8d0']) }),
  manuali: r => ({ w: 2, h: 5 + Math.floor(r() * 2), c: pick(['#a83a2a', '#3a6a9a', '#d8b050', '#4a8a4a']) }),
  oggetti: r => ({ w: 3 + Math.floor(r() * 2), h: 3 + Math.floor(r() * 3), c: pick(['#c8a070', '#a8a8a0', '#d8c040', '#5a8ab0', '#c8402a']) }),
  bottiglie: r => ({ w: 2, h: 5 + Math.floor(r() * 3), c: pick(['#3a7a3a', '#8a5a2a', '#e8e0c0', '#6a1a2a', '#c8a040']), top: '#2a2a2a' }),
  ricambi: r => ({ w: 3, h: 2 + Math.floor(r() * 3), c: pick(['#6a7078', '#a8b0b8', '#2a2a2a', '#c86a2a']) }),
  medicine: r => ({ w: 3 + Math.floor(r() * 2), h: 3 + Math.floor(r() * 3), c: pick(['#f4f4f0', '#e8f0f8', '#f8e8e8', '#e8f4e8', '#f8f0d8']), c2: pick(['#3a8a5a', '#d83a3a', '#3a6ac8', '#e8a030']) }),
};

// ---------- Il maiale (sprite via codice, segnaposto) ----------
function maiale(frame = 0) {
  const spr = PIX.animale('maiale', frame, 22, 15); if (spr) return spr;
  const [c, g] = PIX.makeCanvas(22, 15);
  const P = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  P('#e89aa8', 3, 4, 15, 8); P('#f4b4c0', 4, 4, 13, 3);        // corpo
  P('#e89aa8', 15, 2 + frame, 6, 7);                         // testa
  P('#f8c8d0', 19, 5 + frame, 3, 3); P('#a85a6a', 20, 6 + frame, 1, 1); P('#a85a6a', 21, 6 + frame, 1, 1); // grugno
  P('#1a1420', 17, 4 + frame, 1, 1);                          // occhio
  P('#d07888', 15, 1 + frame, 2, 2);                          // orecchio
  P('#c87888', 4, 12, 2, 2 + frame); P('#c87888', 8, 12, 2, 2 - frame); P('#c87888', 12, 12, 2, 2 + frame); P('#c87888', 15, 12, 2, 2 - frame);
  P('#d07888', 1, 4, 2, 1); P('#d07888', 2, 3, 1, 1);           // codina
  P('rgba(110,70,40,0.6)', 6, 9, 4, 2);                       // fango
  return c;
}

export class Interni {
  constructor(game) {
    this.game = game;
    this.defs = { ...INTERNI };
    this.agganci = {};
    this.origini = {};
    this.cache = {};               // id -> { grp, solidi, extra }
    this.attivo = false; this.edificio = null; this.scatto = false;
    this._musica = null; this._luce = 1; this._stanza = null;
    Object.keys(this.defs).forEach((id, i) => { this.origini[id] = { x: BASE_X + i * PASSO, z: BASE_Z }; });
    this._camT = new THREE.Vector3(); this._camL = new THREE.Vector3();
    this._sceltePng();
  }
  get s() { return this.game.s; }
  get st() { const f = (this.s.flags ??= {}); return (f.interni ??= { dentro: null }); }

  // ================= API =================
  registra(id, def) {
    this.defs[id] = def;
    if (!this.origini[id]) this.origini[id] = { x: BASE_X + Object.keys(this.origini).length * PASSO, z: BASE_Z };
  }
  aggancia(zona, fn) { this.agganci[zona] = fn; }
  mondo(id, x, z) { const o = this.origini[id]; return { x: o.x + x, z: o.z + z }; }
  stanza() { return this._stanza; }
  etichettaPorta(id) { return PORTE[id]; }

  // ================= Avvio =================
  init() {
    const g = this.game;
    g.world.bloccatoFuoriMappa = (x, z, r) => this.blocked(x, z, r);
    // Loredana ti ha bandito dal bar (lavoro "bar"): fuori, subito
    const via = () => { if (this.edificio !== 'bar') return; if (g.ui.busy() || g.locked || g.combat?.active) { setTimeout(via, 400); return; } this.esci(); };
    g.on('bandoBar', () => setTimeout(via, 300));
    this._css();
    const st = this.st;
    if (st.dentro && this.defs[st.dentro]) {
      const o = this.origini[st.dentro], def = this.defs[st.dentro];
      const lx = this.s.px - o.x, lz = this.s.pz - o.z;
      const pos = lx > 0 && lx < def.w && lz > 0 && lz < def.d ? { x: lx, z: lz } : def.entrata;
      this.entra(st.dentro, { ripristino: true, pos, fuori: st.fuori });
    } else {
      st.dentro = null;
      if (this.s.px > MAP_W + 5) g.player.group.position.set(PLACES.spawn.x, 0, PLACES.spawn.z);
    }
  }

  _css() {
    if (document.getElementById('interni-css')) return;
    const css = document.createElement('style'); css.id = 'interni-css';
    css.textContent = `
      body.dentro #minimap { display: none; }
      #stanza-nome { position: absolute; left: 50%; top: 12px; transform: translateX(-50%); background: var(--panel, rgba(20,24,60,.85));
        border: 2px solid var(--gold, #f0d050); color: var(--gold, #f0d050); padding: 4px 12px; border-radius: 4px; font-size: 14px;
        white-space: nowrap; pointer-events: none; transition: opacity .3s; }
      #stanza-nome[hidden] { display: block; opacity: 0; }
      @media (max-width: 700px), (max-height: 500px) { #stanza-nome { top: auto; bottom: 230px; font-size: 12px; } }
      @media (max-height: 500px) { #stanza-nome { bottom: auto; top: 8px; } }`;
    document.head.appendChild(css);
    const el = document.createElement('div'); el.id = 'stanza-nome'; el.hidden = true;
    document.getElementById('hud').appendChild(el);
    this._label = el;
  }

  // scelte aggiunte ai personaggi che stanno dentro
  _sceltePng() {
    const g = this.game, T = TESTI.mamma;
    g.png.aggiungiScelte('mamma', () => [
      { label: T.pasto, fn: () => {
        const st = this.st;
        if (st.pasto === this.s.day) return [{ who: 'mamma', name: PNG.mamma.nome, text: T.pastoGia }];
        st.pasto = this.s.day;
        const s = this.s;
        s.health = clamp(s.health + 20, 0, s.maxHealth); s.stress = clamp(s.stress - 5, 0, 100); s.minutes += 20;
        g.audio.sfx('eat'); g.png.cambiaAmicizia('mamma', 1);
        return [{ who: 'mamma', name: PNG.mamma.nome, text: pick(T.pastoFatto) }];
      } },
      { label: T.consiglio, fn: () => [{ who: 'mamma', name: PNG.mamma.nome, text: this._consiglioMamma() }] },
    ]);
    g.png.aggiungiScelte('loredana', () => [
      { label: TESTI.loredana.ordina, fn: () => [g._barMenu(false)] },
    ]);
    // finché il lavoro "officina" non porta le sue scelte, Zeno ripara come prima
    g.png.aggiungiScelte('zeno', () => (g.officina || this.edificio !== 'meccanico' ? [] : g.vehicles.workshopChoices()));
  }

  _consiglioMamma() {
    const s = this.s, m = s.mission, C = TESTI.mamma.consigli;
    if (m && !m.done && !m.failed) return fill(C.missione, variabiliMissione(m));
    const att = this.game.quests?.attive?.() || [];
    if (att.length) { const q = att[0]; return fill(C.secondaria, { chi: PNG[q.def.da]?.nome?.replace(/^(Il|La|Lo) /, '') || 'Gigante', titolo: q.def.titolo }); }
    if (m?.done) return C.fatta;
    if (m?.failed) return C.fallita;
    return C.niente;
  }

  // ================= Entrare e uscire =================
  async entra(id, opts = {}) {
    const def = this.defs[id];
    if (!def) return false;
    const g = this.game;
    if (this.attivo || (g.locked && !opts.ripristino)) return true;
    if (opts.ripristino && id === 'bar' && g.bar?.bandito?.()) { this.st.dentro = null; g.player.group.position.set(PLACES.spawn.x, 0, PLACES.spawn.z); return true; }
    if (!opts.ripristino) {
      if (def.orari) {
        const h = (this.s.minutes / H) % 24;
        if (h < def.orari[0] || h >= def.orari[1]) { await g.ui.dialog([{ name: def.nome, text: TESTI.chiuso[id] || 'È chiuso.' }]); return true; }
      }
      if (id === 'bar' && g.bar?.ingresso) { try { if ((await g.bar.ingresso()) === false) return true; } catch (e) { console.error(e); } }
      g.emit('entrato', { edificio: id });
      g.locked = true;
      await g.ui.fade(true);
    }
    const b = BUILDINGS.find(b => b.id === id);
    this.fuori = opts.fuori || (b?.door ? { x: b.door.x, z: b.door.z + 0.3 } : { x: PLACES.spawn.x, z: PLACES.spawn.z });
    const c = this._costruisci(id);
    for (const k of Object.keys(this.cache)) this.cache[k].grp.visible = k === id;
    this.attivo = true; this.edificio = id;
    const st = this.st; st.dentro = id; st.fuori = this.fuori;
    this._musica = null;
    const p = opts.pos || def.entrata, w = this.mondo(id, p.x, p.z);
    g.player.group.position.set(w.x, 0, w.z);
    g._wake?.(); g.idle = 0;
    this._arreda(id, c);
    g.png.update(0, true);
    document.body.classList.add('dentro');
    this._stanza = null; this._aggiornaStanza(true);
    this.scatto = true;
    g.audio.setScene(this.musica());
    if (!opts.ripristino) {
      await g.ui.fade(false);
      g.locked = false;
      const frase = TESTI.entrata[id];
      if (frase) g.ui.toast(pick(frase));
    }
    return true;
  }

  async esci(dest = null) {
    const g = this.game;
    if (!this.attivo || g.locked) return;
    const id = this.edificio;
    g.locked = true;
    await g.ui.fade(true);
    this._chiudi();
    const p = dest || this.fuori || PLACES.spawn;
    g.player.group.position.set(p.x, 0, p.z);
    g.png.update(0, true);
    this.scatto = true;
    await g.ui.fade(false);
    g.locked = false;
    g.emit('uscito', { edificio: id });
  }

  _chiudi() {
    if (this.cache[this.edificio]) this.cache[this.edificio].grp.visible = false;
    this.attivo = false; this.edificio = null; this._musica = null; this._stanza = null;
    this.st.dentro = null;
    document.body.classList.remove('dentro');
    if (this._label) this._label.hidden = true;
    this.game.audio.scene = null; // il gioco sceglie di nuovo la musica di fuori
  }

  // chiamato da game.sleep(): si dorme nel letto di casa e ci si sveglia lì; altrove si torna fuori
  svegliaDentro() {
    if (!this.attivo) return false;
    if (this.edificio === 'casa') {
      const w = this.mondo('casa', 1.5, 4.2);
      this.game.player.group.position.set(w.x, 0, w.z);
      this.scatto = true;
      return true;
    }
    this._chiudi();
    this.scatto = true;
    return false;
  }

  musica() {
    if (this._musica) return this._musica;
    const def = this.defs[this.edificio];
    const m = def?.musica || 'base';
    return m === 'base' && this.s.minutes >= 20 * H ? 'notte' : m;
  }

  // ================= Collisioni =================
  blocked(x, z, r = 0.28) {
    if (!this.attivo) return true;
    const def = this.defs[this.edificio], o = this.origini[this.edificio];
    const lx = x - o.x, lz = z - o.z, rz = r * 0.6;
    const rx = r + SPALLE;   // sui fianchi la figura è più larga del raggio: niente spalle dentro i muri
    if (lx - rx < 0.08 || lx + rx > def.w - 0.08 || lz - rz < 0.3 || lz + rz > def.d - 0.02) return true;
    for (const s of this.cache[this.edificio]?.solidi || []) {
      if (lx + rx > s.x0 && lx - rx < s.x1 && lz + rz > s.z0 && lz - rz < s.z1) return true;
    }
    return false;
  }

  // ================= Costruzione della stanza =================
  _costruisci(id) {
    if (this.cache[id]) return this.cache[id];
    const def = this.defs[id], o = this.origini[id], W = this.game.world;
    const grp = new THREE.Group();
    grp.position.set(o.x, 0, o.z);
    const c = { grp, solidi: [], vetri: [], maiali: [], avventori: {}, mobili: [], ruote: [], luci: [] };
    const M = t => new THREE.MeshLambertMaterial({ map: t });
    const add = (m, x, y, z) => { m.position.set(x, y, z); grp.add(m); m.traverse?.(k => { if (k.isMesh) { k.castShadow = !k.userData.piatto; k.receiveShadow = true; } }); return m; };
    const D = def.d, Hh = def.h;
    let seme = 1;
    // pavimento e muro di fondo, stanza per stanza
    for (const s of def.stanze) {
      const w = s.x1 - s.x0;
      const ft = tex(w, D, PAVIMENTI[s.pavimento || def.pavimento] || PAVIMENTI.cemento, seme++);
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(w, D).rotateX(-Math.PI / 2), M(ft));
      floor.userData.piatto = true;
      add(floor, s.x0 + w / 2, 0, D / 2);
      const wt = tex(w, Hh, MURI[s.muro || def.muro] || MURI.lamiera, seme++);
      const back = new THREE.Mesh(new THREE.PlaneGeometry(w, Hh), M(wt));
      back.userData.piatto = true;
      add(back, s.x0 + w / 2, Hh / 2, 0);
    }
    // muri laterali
    const first = def.stanze[0], last = def.stanze[def.stanze.length - 1];
    const lato = (s, x, rot) => {
      const t = tex(D, Hh, MURI[s.muro || def.muro] || MURI.lamiera, seme++);
      const m = new THREE.Mesh(new THREE.PlaneGeometry(D, Hh).rotateY(rot), M(t));
      m.userData.piatto = true; add(m, x, Hh / 2, D / 2);
    };
    lato(first, 0, Math.PI / 2); lato(last, def.w, -Math.PI / 2);
    // muri divisori, con il varco della porta davanti
    const varco = 2.3;
    for (let i = 1; i < def.stanze.length; i++) {
      const x = def.stanze[i].x0, len = D - varco;
      const t = tex(len, Hh, MURI[def.stanze[i].muro || def.muro] || MURI.lamiera, seme++);
      const top = new THREE.MeshLambertMaterial({ color: '#3a2e26' });
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.22, Hh, len), [M(t), M(t), top, top, top, top]);
      add(m, x, Hh / 2, len / 2);
      // stipite
      const st = new THREE.Mesh(new THREE.BoxGeometry(0.3, Hh, 0.12), new THREE.MeshLambertMaterial({ color: '#5a3a22' }));
      add(st, x, Hh / 2, len);
      c.solidi.push({ x0: x - 0.15, z0: 0, x1: x + 0.15, z1: len + 0.08 });
    }
    // bordo del pavimento davanti (stile diorama)
    const bordo = new THREE.Mesh(new THREE.BoxGeometry(def.w + 0.2, 0.16, 0.16), new THREE.MeshLambertMaterial({ color: '#2a2018' }));
    add(bordo, def.w / 2, 0.06, D + 0.06);
    const sotto = new THREE.Mesh(new THREE.BoxGeometry(def.w + 0.2, 0.8, 0.1), new THREE.MeshLambertMaterial({ color: '#1a1410' }));
    add(sotto, def.w / 2, -0.38, D + 0.14);
    // cornice in alto
    const cornice = new THREE.Mesh(new THREE.BoxGeometry(def.w, 0.18, 0.18), new THREE.MeshLambertMaterial({ color: '#2a2018' }));
    add(cornice, def.w / 2, Hh, 0.06);
    // finestre: telaio + vetro che prende il colore del cielo
    for (const f of def.finestre || []) {
      const vetro = new THREE.Mesh(new THREE.PlaneGeometry(f.w, f.h), new THREE.MeshBasicMaterial({ color: '#a8d4ea' }));
      vetro.userData.piatto = true;
      add(vetro, f.x + f.w / 2, f.y + f.h / 2, 0.01);
      c.vetri.push(vetro.material);
      const tt = tela(f.w, f.h, (P, W2, H2) => {
        P('#f4f0e8', 0, 0, W2, 2); P('#f4f0e8', 0, H2 - 2, W2, 2); P('#f4f0e8', 0, 0, 2, H2); P('#f4f0e8', W2 - 2, 0, 2, H2);
        P('#f4f0e8', Math.floor(W2 / 2) - 1, 0, 2, H2); if (H2 > 10) P('#f4f0e8', 0, Math.floor(H2 / 2) - 1, W2, 2);
        P('#ffffff60', 3, 3, 2, 4); P('#ffffff40', Math.floor(W2 / 2) + 3, 3, 2, 4);
      });
      const tel = new THREE.Mesh(new THREE.PlaneGeometry(f.w, f.h), new THREE.MeshLambertMaterial({ map: PIX.toTexture(tt), transparent: true, alphaTest: 0.1 }));
      tel.userData.piatto = true;
      add(tel, f.x + f.w / 2, f.y + f.h / 2, 0.02);
      const dav = new THREE.Mesh(new THREE.BoxGeometry(f.w + 0.2, 0.08, 0.14), new THREE.MeshLambertMaterial({ color: '#d8d0c0' }));
      add(dav, f.x + f.w / 2, f.y - 0.04, 0.07);
    }
    // mobili
    for (const m of def.mobili) {
      const obj = this._mobile(m, c, seme++);
      if (obj) add(obj, m.x + m.w / 2, obj.position.y, m.parete ? 0.03 : m.z + m.d / 2);
      if (!m.parete && !m.pavimento) c.solidi.push({ x0: m.x, z0: m.z, x1: m.x + m.w, z1: m.z + m.d });
      c.mobili.push({ m, obj });
    }
    W.scene.add(grp);
    grp.visible = false;
    this.cache[id] = c;
    return c;
  }

  // un mobile: restituisce un Object3D centrato in x/z sul suo ingombro (y = altezza da terra)
  _mobile(m, c, seme) {
    const M = t => new THREE.MeshLambertMaterial({ map: t });
    const C = (col) => new THREE.MeshLambertMaterial({ color: col });
    // contorno scuro sui bordi di ogni faccia: i mobili si staccano come gli sprite HD
    const orla = draw => (P, W, H2, g, r) => {
      draw(P, W, H2, g, r);
      if (W < 4 || H2 < 4) return;
      const im = g.getImageData(0, 0, W, H2), dd = im.data;
      const scurisci = (x, y, k) => { const i = (y * W + x) * 4; dd[i] *= k; dd[i + 1] *= k; dd[i + 2] *= k * 1.06; };
      for (let x = 0; x < W; x++) { scurisci(x, 0, 0.55); scurisci(x, H2 - 1, 0.5); }
      for (let y = 1; y < H2 - 1; y++) { scurisci(0, y, 0.55); scurisci(W - 1, y, 0.5); }
      g.putImageData(im, 0, 0);
    };
    const blocco = (w, h, d, { fronte, lato, sopra, colore = '#8a6a42' } = {}) => {
      fronte = fronte && orla(fronte); lato = lato && orla(lato); sopra = sopra && orla(sopra);
      if (!fronte) fronte = orla(pieno(colore)); if (!lato) lato = orla(pieno(tono(colore, 0.85))); if (!sopra) sopra = orla(pieno(tono(colore, 1.1)));
      const L = lato ? M(tex(d, h, lato, seme)) : M(tex(d, h, pieno(tono(colore, 0.85)), seme));
      const T = sopra ? M(tex(w, d, sopra, seme + 1)) : M(tex(w, d, pieno(tono(colore, 1.1)), seme + 1));
      const Fm = fronte ? M(tex(w, h, fronte, seme + 2)) : M(tex(w, h, pieno(colore), seme + 2));
      return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [L, L, T, C(tono(colore, 0.5)), Fm, L]);
    };
    const gruppo = () => new THREE.Group();
    const piano = (w, d, draw, y = 0.012) => {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ map: tex(w, d, draw, seme), transparent: true, alphaTest: 0.1 }));
      p.userData.piatto = true; p.position.y = y; return p;
    };
    const quadro = (w, h, draw) => {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshLambertMaterial({ map: tex(w, h, draw, seme), transparent: true, alphaTest: 0.1 }));
      p.userData.piatto = true; return p;
    };
    const { w, d = 0.1, h = 1 } = m;
    let o;
    switch (m.tipo) {
      case 'letto': {
        o = gruppo();
        const base = blocco(w, 0.4, d, { colore: '#7a4a26', fronte: legno('#7a4a26') }); base.position.y = 0.2; o.add(base);
        const mat = blocco(w - 0.1, 0.22, d - 0.15, {
          colore: '#3a6aa8',
          sopra: (P, W, H2) => { P('#f0ece0', 0, 0, W, H2); P('#e8e4f0', 3, 2, W - 6, 9); P('#c8c4d8', 3, 10, W - 6, 1); P('#3a6aa8', 0, 15, W, H2 - 15); for (let y = 17; y < H2; y += 6) for (let x = (y % 12 ? 0 : 3); x < W; x += 6) P('#5a8ac8', x, y, 3, 3); P('#2a4a88', 0, 15, W, 1); },
          fronte: (P, W, H2) => { P('#3a6aa8', 0, 0, W, H2); P('#2a4a88', 0, H2 - 1, W, 1); for (let x = 1; x < W; x += 6) P('#5a8ac8', x, 1, 3, 2); },
          lato: (P, W, H2) => { P('#3a6aa8', 0, 0, W, H2); P('#f0ece0', 0, 0, 8, H2); },
        });
        mat.position.set(0, 0.51, 0.05); o.add(mat);
        const testata = blocco(w, 1.1, 0.14, { colore: '#6a3a1c', fronte: legno('#6a3a1c', true) }); testata.position.set(0, 0.55, -d / 2 + 0.07); o.add(testata);
        break;
      }
      case 'comodino': {
        o = gruppo();
        const b = blocco(w, h, d, { colore: '#7a4a26', fronte: F.cassetti('#7a4a26', 2) }); b.position.y = h / 2; o.add(b);
        const lamp = blocco(0.22, 0.3, 0.22, { colore: '#f0e0a0' }); lamp.position.set(0.1, h + 0.15, 0); o.add(lamp);
        const sv = blocco(0.3, 0.06, 0.24, { colore: '#d84a3a' }); sv.position.set(-0.18, h + 0.03, 0.08); o.add(sv);
        break;
      }
      case 'armadio': { o = blocco(w, h, d, { colore: '#8a5a32', fronte: F.armadio('#8a5a32') }); o.position.y = h / 2; break; }
      case 'cassaforte': { o = blocco(w, h, d, { colore: '#4a5058', fronte: (P, W, H2) => { pieno('#4a5058')(P, W, H2, null, () => 0.5); P('#8a9098', W / 2 - 3, H2 / 2 - 3, 6, 6); P('#2a2e34', W / 2 - 1, H2 / 2 - 1, 2, 2); P('#c8a040', W - 4, H2 / 2 - 2, 2, 4); } }); o.position.y = h / 2; break; }
      case 'mobiletv': { o = blocco(w, h, d, { colore: '#5a3a22', fronte: F.cassetti('#5a3a22', 1) }); o.position.y = h / 2; break; }
      case 'tv': {
        o = blocco(w, h, d, {
          colore: '#2a2a2e',
          fronte: (P, W, H2) => { P('#3a3a40', 0, 0, W, H2); P('#1a1a20', 2, 2, W - 8, H2 - 4); P('#4a7aa8', 3, 3, W - 10, H2 - 6); P('#8ab8d8', 4, 4, 5, 2); P('#c8c8c8', W - 5, 4, 2, 2); P('#c8c8c8', W - 5, 8, 2, 2); },
        });
        o.position.y = (m.y || 0) + h / 2;
        c.tv = o.material[4];
        break;
      }
      case 'divano': {
        o = gruppo();
        const col = '#a85a3a';
        const seat = blocco(w, 0.45, d, { colore: col }); seat.position.y = 0.225; o.add(seat);
        const schienale = blocco(w, 0.55, 0.25, { colore: tono(col, 0.9), fronte: (P, W, H2) => { P(tono(col, 0.9), 0, 0, W, H2); for (let x = 0; x < W; x += Math.floor(W / 3)) P(tono(col, 0.7), x, 1, 1, H2 - 2); } });
        schienale.position.set(0, 0.6, d / 2 - 0.12); o.add(schienale);
        for (const sx of [-1, 1]) { const br = blocco(0.22, 0.6, d, { colore: tono(col, 0.85) }); br.position.set(sx * (w / 2 - 0.11), 0.3, 0); o.add(br); }
        const cus = blocco(0.4, 0.3, 0.12, { colore: '#e8c050' }); cus.position.set(-w / 2 + 0.5, 0.6, -0.1); o.add(cus);
        break;
      }
      case 'libreria': { o = blocco(w, h, d, { colore: '#6a4a2a', fronte: F.libri('#6a4a2a') }); o.position.y = h / 2; break; }
      case 'pianta': {
        o = gruppo();
        const vaso = blocco(w, 0.4, d, { colore: '#b8603a' }); vaso.position.y = 0.2; o.add(vaso);
        const fo = new THREE.Sprite(new THREE.SpriteMaterial({ map: PIX.toTexture(HDO.piantaFoglie(seme)), alphaTest: 0.5 }));
        fo.center.set(0.5, 0); fo.scale.set(1, 1.1, 1); fo.position.y = 0.35; o.add(fo);
        this.game.world.spriteMats.add(fo.material);
        break;
      }
      case 'fornelli': {
        o = blocco(w, h, d, {
          colore: '#e8e4dc',
          fronte: (P, W, H2) => { P('#e8e4dc', 0, 0, W, H2); P('#2a2a2e', 3, 5, W - 6, H2 - 9); P('#5a5a60', 4, 6, W - 8, 1); P('#c8c4bc', 0, 0, W, 3); for (let x = 4; x < W - 2; x += 5) P('#2a2a2e', x, 1, 2, 1); },
          sopra: (P, W, H2) => { P('#d8d4cc', 0, 0, W, H2); for (const [x, y] of [[0.25, 0.3], [0.7, 0.3], [0.25, 0.72], [0.7, 0.72]]) { P('#2a2a2e', W * x - 3, H2 * y - 3, 6, 6); P('#5a5a60', W * x - 1, H2 * y - 1, 2, 2); } },
        });
        o.position.y = h / 2;
        break;
      }
      case 'lavello': {
        o = blocco(w, h, d, {
          colore: '#c8a070', fronte: F.armadio('#c8a070'),
          sopra: (P, W, H2) => { P('#d8d4cc', 0, 0, W, H2); P('#9aa4ac', 4, 2, W - 8, H2 - 4); P('#7a848c', 5, 3, W - 10, 1); P('#c8ccd0', W / 2, 0, 2, 4); },
        });
        o.position.y = h / 2;
        break;
      }
      case 'frigo': {
        o = blocco(w, h, d, { colore: '#f0f0ec', fronte: (P, W, H2) => { P('#f4f4f0', 0, 0, W, H2); P('#c8c8c4', 0, Math.floor(H2 * 0.35), W, 1); P('#a8a8a4', W - 3, 6, 1, 8); P('#a8a8a4', W - 3, Math.floor(H2 * 0.35) + 4, 1, 12); P('#d84a3a', 3, 4, 3, 3); P('#3a8a3a', 4, 10, 4, 3); P('#e8c050', 3, 20, 3, 4); } });
        o.position.y = h / 2;
        break;
      }
      case 'tavolo': case 'scrivania': {
        o = gruppo();
        const col = m.colore || (m.tipo === 'scrivania' ? '#6a4024' : '#c8a070');
        const sopra = m.tovaglia
          ? (P, W, H2) => { P(m.tovaglia, 0, 0, W, H2); for (let y = 0; y < H2; y += 4) for (let x = ((y / 4) % 2) * 4; x < W; x += 8) P('#f4f0e8', x, y, 4, 4); P('#f4f4f4', W * 0.2, H2 * 0.3, 5, 4); P('#f4f4f4', W * 0.6, H2 * 0.3, 5, 4); P('#c84a2a', W * 0.4, H2 * 0.5, 4, 3); }
          : m.tipo === 'scrivania'
            ? (P, W, H2, g, r) => { legno(col)(P, W, H2, g, r); P('#f4f0e0', 4, 3, 9, 7); P('#f4f0e0', 6, 4, 9, 7); P('#2a4a2a', W - 14, 3, 10, 8); P('#c8a040', W - 13, 4, 8, 1); P('#2a2a2a', W / 2, 6, 4, 3); }
            : legno(col);
        const top = blocco(w, 0.08, d, { colore: col, sopra, fronte: m.tovaglia ? (P, W, H2) => { P(m.tovaglia, 0, 0, W, H2); } : legno(col) });
        top.position.y = h - 0.04; o.add(top);
        if (m.tovaglia) { const tv = blocco(w + 0.02, 0.25, d + 0.02, { colore: m.tovaglia, fronte: (P, W, H2) => { P(m.tovaglia, 0, 0, W, H2); for (let x = 0; x < W; x += 8) P('#f4f0e8', x, 0, 4, H2); } }); tv.position.y = h - 0.18; o.add(tv); }
        if (m.tipo === 'scrivania') { const cs = blocco(0.6, h - 0.08, d - 0.1, { colore: col, fronte: F.cassetti(col, 3) }); cs.position.set(w / 2 - 0.35, (h - 0.08) / 2, 0); o.add(cs); }
        for (const [lx, lz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { if (m.tipo === 'scrivania' && lx > 0) continue; const g2 = blocco(0.08, h - 0.08, 0.08, { colore: tono(col, 0.7) }); g2.position.set(lx * (w / 2 - 0.08), (h - 0.08) / 2, lz * (d / 2 - 0.08)); o.add(g2); }
        if (m.tipo === 'scrivania') { const lamp = blocco(0.16, 0.4, 0.16, { colore: '#3a7a3a' }); lamp.position.set(-w / 2 + 0.25, h + 0.2, -0.2); o.add(lamp); }
        break;
      }
      case 'sedia': case 'sgabello': {
        o = gruppo();
        const col = m.colore || (m.tipo === 'sgabello' ? '#a83a2a' : '#8a5a32');
        const sh = m.tipo === 'sgabello' ? h : 0.48;
        const seat = blocco(w, 0.07, d, { colore: col }); seat.position.y = sh; o.add(seat);
        const leg = blocco(0.07, sh, 0.07, { colore: '#4a3a2a' });
        if (m.tipo === 'sgabello') { leg.position.y = sh / 2; o.add(leg); const base = blocco(w * 0.8, 0.04, d * 0.8, { colore: '#3a3a3a' }); base.position.y = 0.02; o.add(base); }
        else { for (const [lx, lz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const l2 = leg.clone(); l2.position.set(lx * (w / 2 - 0.05), sh / 2, lz * (d / 2 - 0.05)); o.add(l2); } const back = blocco(w, h - sh, 0.06, { colore: col, fronte: legno(col, true) }); back.position.set(0, sh + (h - sh) / 2, -d / 2 + 0.03); o.add(back); }
        break;
      }
      case 'botte': {
        o = gruppo();
        const t = tex(3.4, h, (P, W, H2, g, r) => { legno('#8a5a2a', true)(P, W, H2, g, r); for (const y of [0.15, 0.5, 0.85]) P('#4a4a4a', 0, Math.floor(H2 * y), W, 2); });
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(w / 2 - 0.02, w / 2 - 0.02, h, 14), [M(t), C('#6a4020'), C('#6a4020')]);
        cyl.position.y = h / 2; o.add(cyl);
        break;
      }
      case 'bidone': case 'secchio': {
        o = gruppo();
        const col = m.colore || (m.tipo === 'secchio' ? '#8a96a0' : '#3a5a8a');
        const t = tex(2, h, (P, W, H2) => { P(col, 0, 0, W, H2); P(tono(col, 0.7), 0, 2, W, 1); P(tono(col, 0.7), 0, H2 - 3, W, 1); P(tono(col, 1.2), 3, 0, 2, H2); if (m.tipo === 'bidone') { P('#f0f0f0', W / 2 - 3, H2 / 2 - 2, 6, 4); P('#c83a2a', W / 2 - 2, H2 / 2 - 1, 4, 2); } });
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(w / 2, w / 2 * 0.92, h, 12), [M(t), C(tono(col, 1.1)), C(tono(col, 0.6))]);
        cyl.position.y = h / 2; o.add(cyl);
        break;
      }
      case 'gomme': {
        o = gruppo();
        for (let i = 0; i < 3; i++) { const t = new THREE.Mesh(new THREE.TorusGeometry(w / 2 - 0.12, 0.13, 6, 14).rotateX(Math.PI / 2), C('#232326')); t.position.y = 0.14 + i * 0.28; o.add(t); }
        break;
      }
      case 'scaffale': { o = blocco(w, h, d, { colore: '#4a3a2a', fronte: F.scaffale(m.merce) }); o.position.y = h / 2; break; }
      case 'cassa': case 'paglia': {
        const pag = m.tipo === 'paglia';
        const dr = pag ? (P, W, H2, g, r) => { P('#d8b850', 0, 0, W, H2); for (let i = 0; i < W * H2 / 4; i++) P(r() < 0.5 ? '#c8a040' : '#e8d070', r() * W, r() * H2, 2, 1); P('#a88030', 0, Math.floor(H2 * 0.3), W, 1); P('#a88030', 0, Math.floor(H2 * 0.7), W, 1); }
          : (P, W, H2, g, r) => { legno('#b8884a')(P, W, H2, g, r); P('#7a5228', 0, 0, W, 2); P('#7a5228', 0, H2 - 2, W, 2); P('#7a5228', 0, 0, 2, H2); P('#7a5228', W - 2, 0, 2, H2); for (let i = 0; i < W; i++) P('#7a5228', i, Math.floor(i * H2 / W), 1, 1); };
        o = blocco(w, h, d, { colore: pag ? '#d8b850' : '#b8884a', fronte: dr, lato: dr, sopra: dr });
        o.position.y = h / 2;
        break;
      }
      case 'bancone': {
        o = gruppo();
        const col = m.colore || '#7a4a26';
        const corpo = blocco(w, h - 0.08, d, { colore: col, fronte: (P, W, H2, g, r) => { legno(col, true)(P, W, H2, g, r); for (let x = 4; x < W - 6; x += 18) { P(tono(col, 0.75), x, 4, 14, H2 - 8); P(tono(col, 1.1), x, 4, 14, 1); } P(tono(col, 0.5), 0, H2 - 3, W, 3); } });
        corpo.position.y = (h - 0.08) / 2; o.add(corpo);
        const top = blocco(w + 0.15, 0.08, d + 0.12, { colore: m.piano || '#c8a070', sopra: rumore(m.piano || '#c8a070', 0.05) }); top.position.y = h - 0.04; o.add(top);
        if (m.spine) for (let i = 0; i < 3; i++) { const sp = blocco(0.1, 0.35, 0.1, { colore: '#c8c8d0' }); sp.position.set(-w / 2 + 1.0 + i * 0.25, h + 0.17, -0.05); o.add(sp); const tp = blocco(0.06, 0.12, 0.06, { colore: ['#d8b040', '#2a2a2a', '#c83a2a'][i] }); tp.position.set(-w / 2 + 1.0 + i * 0.25, h + 0.4, -0.05); o.add(tp); }
        if (m.spine) { const mac = blocco(0.5, 0.45, 0.4, { colore: '#9aa4ac', fronte: (P, W, H2) => { P('#9aa4ac', 0, 0, W, H2); P('#2a2a2e', 2, 2, W - 4, 3); P('#c83a2a', 3, 3, 2, 1); P('#4a4a4a', W / 2 - 1, 8, 2, 4); } }); mac.position.set(w / 2 - 0.6, h + 0.22, -0.05); o.add(mac); }
        if (m.cassa) { const ca = blocco(0.5, 0.35, 0.4, { colore: '#3a3a40', fronte: (P, W, H2) => { P('#3a3a40', 0, 0, W, H2); P('#7ac87a', 1, 1, W - 2, 2); for (let x = 1; x < W - 1; x += 2) P('#d8d8d8', x, 4, 1, 1); } }); ca.position.set(w / 2 - 0.5, h + 0.18, 0); o.add(ca); }
        break;
      }
      case 'tavolino': {
        o = gruppo();
        const col = m.colore || '#8a5a32';
        const top = blocco(w, 0.07, d, { colore: col, sopra: m.zona === 'carte' ? (P, W, H2) => { P(col, 0, 0, W, H2); for (const [x, y] of [[4, 4], [10, 5], [W - 8, 6]]) { P('#f4f0e8', x, y, 4, 6); P('#c83a2a', x + 1, y + 1, 2, 2); } } : (P, W, H2) => { P(col, 0, 0, W, H2); P(tono(col, 1.15), 1, 1, W - 2, 1); P('#e8e8e0', W / 2 - 2, H2 / 2 - 2, 3, 3); } });
        top.position.y = h; o.add(top);
        const leg = blocco(0.1, h, 0.1, { colore: '#3a3a3a' }); leg.position.y = h / 2; o.add(leg);
        const base = blocco(w * 0.6, 0.04, d * 0.6, { colore: '#3a3a3a' }); base.position.y = 0.02; o.add(base);
        break;
      }
      case 'frigogelati': {
        o = blocco(w, h, d, { colore: '#e8e8f0', fronte: (P, W, H2) => { P('#e8e8f0', 0, 0, W, H2); P('#d84a3a', 2, 3, W - 4, 4); P('#ffffff', 4, 4, W - 8, 1); P('#3a6aa8', 2, H2 - 4, W - 4, 2); }, sopra: (P, W, H2) => { P('#a8c8d8', 0, 0, W, H2); for (let x = 2; x < W - 2; x += 4) P(pick(['#e8c050', '#c84a6a', '#f4f0e8']), x, 3, 3, H2 - 6); } });
        o.position.y = h / 2;
        break;
      }
      case 'biliardo': {
        o = gruppo();
        const legni = blocco(w, h - 0.12, d, { colore: '#6a3a1a', fronte: (P, W, H2, g, r) => { legno('#6a3a1a')(P, W, H2, g, r); P('#c8a040', W / 2 - 2, 3, 4, 2); } });
        legni.position.y = (h - 0.12) / 2; o.add(legni);
        const panno = blocco(w, 0.12, d, {
          colore: '#2a7a3a',
          sopra: (P, W, H2) => { P('#5a3018', 0, 0, W, H2); P('#2a8a3a', 3, 3, W - 6, H2 - 6); for (const [x, y] of [[2, 2], [W / 2 - 1, 1], [W - 4, 2], [2, H2 - 4], [W / 2 - 1, H2 - 3], [W - 4, H2 - 4]]) P('#111', x, y, 3, 3);
            for (const [x, y, col] of [[W * 0.3, H2 * 0.5, '#f4f4f4'], [W * 0.62, H2 * 0.4, '#d8b020'], [W * 0.66, H2 * 0.55, '#c83a2a'], [W * 0.7, H2 * 0.45, '#2a4aa8'], [W * 0.74, H2 * 0.6, '#1a1a1a']]) P(col, x, y, 2, 2); },
        });
        panno.position.y = h - 0.06; o.add(panno);
        break;
      }
      case 'jukebox': {
        o = gruppo();
        const b = blocco(w, h, d, {
          colore: '#c84a2a',
          fronte: (P, W, H2) => { P('#7a2a1a', 0, 0, W, H2); P('#e8c050', 1, 1, W - 2, 10); P('#f4e8a0', 3, 3, W - 6, 6); P('#3a2a2a', 2, 12, W - 4, 8); for (let i = 0; i < 4; i++) P(['#c84a6a', '#4a8ac8', '#7ac84a', '#e8c050'][i], 3 + i * 3, 14, 2, 4); P('#c8c8d0', 2, 22, W - 4, H2 - 26); for (let y = 24; y < H2 - 4; y += 3) P('#8a8a90', 3, y, W - 6, 1); },
        });
        b.position.y = h / 2; o.add(b);
        c.jukebox = b.material[4];
        break;
      }
      case 'ponte': {
        o = gruppo();
        for (const sx of [-1, 1]) { const col = blocco(0.3, 2.2, 0.3, { colore: '#d8a020', fronte: (P, W, H2) => { P('#d8a020', 0, 0, W, H2); for (let y = 0; y < H2; y += 6) P('#2a2a2a', 0, y, W, 2); } }); col.position.set(sx * (w / 2 - 0.15), 1.1, -d / 2 + 0.3); o.add(col); }
        const pedana = blocco(w - 0.7, 0.12, d - 0.6, { colore: '#6a7078' }); pedana.position.set(0, 1.0, 0); o.add(pedana);
        for (const sx of [-1, 1]) { const br = blocco(0.12, 0.08, d - 0.6, { colore: '#d8a020' }); br.position.set(sx * (w / 2 - 0.4), 1.0, 0); o.add(br); }
        try {
          const { vehicleArt } = this._vs || {};
          if (vehicleArt) {
            const art = vehicleArt('vespa', '#7ab8d8');
            const sp = this.game.world.sprite(art.R[0], { w: art.R[0].width / 20 * 1.1, h: art.R[0].height / 20 * 1.1 });
            sp.position.set(0, 1.06, 0); o.add(sp);
          }
        } catch { /* niente Vespa */ }
        const base = piano(w, d, (P, W, H2) => { for (let x = 0; x < W; x += 8) { P('#d8a020', x, 0, 4, 3); P('#2a2a2a', x + 4, 0, 4, 3); P('#d8a020', x, H2 - 3, 4, 3); P('#2a2a2a', x + 4, H2 - 3, 4, 3); } }); o.add(base);
        break;
      }
      case 'mola': {
        o = gruppo();
        const banco = blocco(w, 0.8, d, { colore: '#5a6068' }); banco.position.y = 0.4; o.add(banco);
        const mot = blocco(0.3, 0.22, 0.22, { colore: '#3a6a3a' }); mot.position.set(0, 0.92, 0); o.add(mot);
        for (const sx of [-1, 1]) {
          const ruota = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 14).rotateZ(Math.PI / 2), [M(tex(1.3, 0.1, (P, W, H2) => { for (let x = 0; x < W; x += 2) P(x % 4 ? '#b8b0a0' : '#8a8478', x, 0, 2, H2); })), C('#a8a090'), C('#a8a090')]);
          ruota.position.set(sx * 0.24, 0.94, 0); o.add(ruota); c.ruote.push(ruota);
        }
        break;
      }
      case 'rastrelliera': {
        o = blocco(w, h, d, {
          colore: '#7a5a3a',
          fronte: (P, W, H2, g, r) => {
            legno('#7a5a3a', true)(P, W, H2, g, r);
            P('#4a3020', 0, 6, W, 2);
            const att = [['#c83a2a', 'aratro'], ['#3a7a3a', 'seminatrice'], ['#d8a020', 'falciatrice'], ['#3a5a9a', 'turbina']];
            att.forEach(([col], i) => { const x = 3 + i * Math.floor((W - 6) / 4); P('#2a2a2a', x + 4, 8, 1, 4); P(col, x, 12, 9, 10); P(tono(col, 0.7), x, 20, 9, 2); P('#2a2a2a', x + 1, 22, 2, 6); P('#2a2a2a', x + 6, 22, 2, 6); });
            for (let x = 4; x < W - 4; x += 7) { P('#8a6a42', x, H2 - 16, 1, 14); P('#a8b0b8', x - 1, H2 - 17, 3, 2); }
          },
        });
        o.position.y = h / 2;
        break;
      }
      case 'armadietti': {
        o = blocco(w, h, d, { colore: '#4a7a9a', fronte: (P, W, H2) => { const n = 3, lw = Math.floor(W / n); for (let i = 0; i < n; i++) { const x = i * lw; P('#4a7a9a', x, 0, lw, H2); P('#3a5a7a', x, 0, 1, H2); for (let y = 4; y < 12; y += 2) P('#2a4a6a', x + 3, y, lw - 6, 1); P('#c8c8d0', x + lw - 4, H2 / 2, 1, 4); P('#f4f0e0', x + 3, H2 / 2 + 6, lw - 6, 3); } } });
        o.position.y = h / 2;
        break;
      }
      case 'box': case 'parto': {
        o = gruppo();
        const pf = piano(w, d, (P, W, H2, g, r) => { P(m.tipo === 'parto' ? '#d8b850' : '#7a5a3a', 0, 0, W, H2); for (let i = 0; i < W * H2 / 5; i++) P(r() < 0.5 ? '#c8a040' : (m.tipo === 'parto' ? '#e8d070' : '#5a4020'), r() * W, r() * H2, 2, 1); }, 0.015);
        o.add(pf);
        const rec = (len, horiz) => { const g2 = gruppo(); for (const y of [0.3, 0.65]) { const b = blocco(horiz ? len : 0.07, 0.08, horiz ? 0.07 : len, { colore: '#9aa4ac' }); b.position.y = y; g2.add(b); } for (let i = 0; i <= Math.round(len / 0.8); i++) { const p = blocco(0.09, h, 0.09, { colore: '#6a7078' }); const t = i / Math.max(1, Math.round(len / 0.8)) - 0.5; p.position.set(horiz ? t * len : 0, h / 2, horiz ? 0 : t * len); g2.add(p); } return g2; };
        const fr = rec(w, true); fr.position.z = d / 2; o.add(fr);
        const sl = rec(d, false); sl.position.x = -w / 2; o.add(sl);
        const sr = rec(d, false); sr.position.x = w / 2; o.add(sr);
        const tr = blocco(0.9, 0.25, 0.35, { colore: '#8a96a0', sopra: (P, W, H2) => { P('#8a96a0', 0, 0, W, H2); P('#6a5a3a', 2, 2, W - 4, H2 - 4); } }); tr.position.set(w / 2 - 0.65, 0.125, -d / 2 + 0.35); o.add(tr);
        if (m.tipo === 'parto') { const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), new THREE.MeshBasicMaterial({ color: '#ff9a40' })); lamp.position.set(0, 1.8, -0.3); o.add(lamp); const filo = blocco(0.02, 1.2, 0.02, { colore: '#2a2a2a' }); filo.position.set(0, 2.45, -0.3); o.add(filo); }
        if (m.tipo === 'box') c.maiali.push({ box: m.box, m, attori: [] });
        break;
      }
      case 'sacchi': {
        o = gruppo();
        const sacco = (P, W, H2, g, r) => { P('#c8b088', 0, 0, W, H2); for (let i = 0; i < W * H2 / 6; i++) P('#b89a70', r() * W, r() * H2, 1, 1); P('#3a6a3a', 3, H2 / 2 - 2, W - 6, 4); P('#f4f0e0', 4, H2 / 2 - 1, W - 8, 1); };
        let k = 0;
        for (let i = 0; i < 2; i++) for (let j = 0; j < 3 - i; j++) { const s = blocco(0.68, 0.36, d - 0.1, { colore: '#c8b088', fronte: sacco }); s.position.set(-w / 2 + 0.4 + j * 0.72 + i * 0.36, 0.18 + i * 0.36, 0); s.rotation.y = (k++ % 2 ? 0.05 : -0.04); o.add(s); }
        break;
      }
      case 'infermeria': {
        o = blocco(w, h, d, { colore: '#f0f0ec', fronte: (P, W, H2) => { P('#f0f0ec', 0, 0, W, H2); P('#c8c8c4', W / 2, 0, 1, H2); P('#d83a2a', W / 4 - 3, 6, 6, 2); P('#d83a2a', W / 4 - 1, 4, 2, 6); P('#d83a2a', W * 3 / 4 - 3, 6, 6, 2); P('#d83a2a', W * 3 / 4 - 1, 4, 2, 6); P('#8a8a8a', W / 2 - 3, H2 / 2, 2, 3); P('#8a8a8a', W / 2 + 2, H2 / 2, 2, 3); P('#6a6a6a', W / 2 - 2, H2 / 2 + 4, 5, 3); } });
        o.position.y = h / 2;
        break;
      }
      case 'usato': {
        o = gruppo();
        const cas = blocco(w, h * 0.7, d, { colore: '#7a5a3a', fronte: (P, W, H2, g, r) => { legno('#7a5a3a')(P, W, H2, g, r); P('#f4f0e0', W / 2 - 10, 3, 20, 6); P('#c83a2a', W / 2 - 8, 5, 16, 2); } });
        cas.position.y = h * 0.35; o.add(cas);
        const cose = [['#c8c8d0', 0.35, 0.3], ['#d83a2a', 0.4, 0.35], ['#3a3a3a', 0.3, 0.2], ['#e8c050', 0.25, 0.4], ['#4a8ac8', 0.5, 0.25], ['#8a5a2a', 0.3, 0.45]];
        cose.forEach(([col, cw, ch], i) => { const b = blocco(cw, ch, 0.3, { colore: col }); b.position.set(-w / 2 + 0.3 + (i % 3) * (w / 3), h * 0.7 + ch / 2, i < 3 ? -0.3 : 0.3); b.rotation.y = (i * 0.7) % 0.5 - 0.25; o.add(b); });
        const elmo = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), C('#c83a2a')); elmo.position.set(w / 2 - 0.4, h * 0.7 + 0.45, 0); o.add(elmo);
        break;
      }
      case 'lavagna': {
        o = gruppo();
        const tav = blocco(w, h * 0.65, 0.08, { colore: '#6a4a2a', fronte: (P, W, H2) => { P('#8a6a3a', 0, 0, W, H2); P('#24302a', 2, 2, W - 4, H2 - 4); for (let y = 5; y < H2 - 5; y += 4) P('#d8d8cc', 4, y, 6 + ((y * 7) % 11), 1); P('#e8e0a0', W - 8, 4, 4, 1); } });
        tav.position.set(0, h * 0.6, 0); tav.rotation.x = -0.1; o.add(tav);
        for (const sx of [-1, 1]) { const g2 = blocco(0.06, h, 0.06, { colore: '#6a4a2a' }); g2.position.set(sx * (w / 2 - 0.1), h / 2, 0.08); g2.rotation.x = -0.12; o.add(g2); }
        break;
      }
      // ---------- chiesa ----------
      case 'altare': {
        o = gruppo();
        const b = blocco(w, h, d, { colore: '#e8e0d0', fronte: (P, W, H2) => { P('#e8e0d0', 0, 0, W, H2); P('#c8a040', 0, 0, W, 2); for (let x = 4; x < W - 4; x += 12) { P('#d8ccb8', x, 5, 8, H2 - 9); P('#f4ecdc', x, 5, 8, 1); } P('#c8a040', W / 2 - 1, 6, 2, 8); P('#c8a040', W / 2 - 4, 8, 8, 2); } });
        b.position.y = h / 2; o.add(b);
        const tov = blocco(w + 0.06, 0.06, d + 0.06, { colore: '#f8f6ee' }); tov.position.y = h + 0.03; o.add(tov);
        for (const sx of [-1, 1]) { const ca = blocco(0.1, 0.4, 0.1, { colore: '#f4f0e0' }); ca.position.set(sx * (w / 2 - 0.3), h + 0.26, 0); o.add(ca); const fi = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 4), new THREE.MeshBasicMaterial({ color: '#ffd060' })); fi.position.set(sx * (w / 2 - 0.3), h + 0.5, 0); o.add(fi); }
        const lib = blocco(0.5, 0.06, 0.35, { colore: '#a8302a' }); lib.position.set(0.2, h + 0.09, 0); lib.rotation.y = 0.2; o.add(lib);
        break;
      }
      case 'candele': {
        o = gruppo();
        const b = blocco(w, h * 0.75, d, { colore: '#6a4a2a', fronte: legno('#6a4a2a') }); b.position.y = h * 0.375; o.add(b);
        const fm = new THREE.MeshBasicMaterial({ color: '#ffc850' });
        for (let i = 0; i < 9; i++) { const x = -w / 2 + 0.15 + (i % 5) * (w - 0.3) / 4, z = i < 5 ? -0.1 : 0.1, hh = 0.12 + (i * 37 % 5) * 0.03; const c = blocco(0.06, hh, 0.06, { colore: '#f4f0e0' }); c.position.set(x + (i >= 5 ? 0.12 : 0), h * 0.75 + hh / 2, z); o.add(c); const f = new THREE.Mesh(new THREE.SphereGeometry(0.035, 5, 4), fm); f.position.set(x + (i >= 5 ? 0.12 : 0), h * 0.75 + hh + 0.04, z); o.add(f); }
        c.fuochi = (c.fuochi || []).concat([fm]);
        break;
      }
      case 'confessionale': {
        o = blocco(w, h, d, { colore: '#5a3218', fronte: (P, W, H2, g, r) => { legno('#5a3218', true)(P, W, H2, g, r); const m3 = W / 3; for (let i = 0; i < 3; i++) { P(i === 1 ? '#3a1e0c' : '#8a2a2a', i * m3 + 2, 10, m3 - 4, H2 - 14); if (i !== 1) for (let y = 12; y < H2 - 6; y += 3) P('#6a1e1e', i * m3 + 2, y, m3 - 4, 1); } P('#c8a040', W / 2 - 1, 2, 2, 6); P('#c8a040', W / 2 - 3, 4, 6, 2); } });
        o.position.y = h / 2; break;
      }
      case 'banco': {
        o = gruppo();
        const col = m.colore || '#6a3a1c';
        const seduta = blocco(w, 0.08, d * 0.6, { colore: col, sopra: legno(col) }); seduta.position.set(0, h * 0.5, d * 0.15); o.add(seduta);
        const schienale = blocco(w, h * 0.55, 0.07, { colore: col, fronte: legno(col) }); schienale.position.set(0, h * 0.72, -d / 2 + 0.05); o.add(schienale);
        for (const sx of [-1, 1]) { const f = blocco(0.08, h, d, { colore: tono(col, 0.8), fronte: legno(tono(col, 0.8), true) }); f.position.set(sx * (w / 2 - 0.04), h / 2, 0); o.add(f); }
        break;
      }
      case 'acquasantiera': case 'offerte': {
        o = gruppo();
        if (m.tipo === 'acquasantiera') {
          const col = blocco(0.16, h - 0.2, 0.16, { colore: '#d8ccb8' }); col.position.y = (h - 0.2) / 2; o.add(col);
          const v = new THREE.Mesh(new THREE.CylinderGeometry(w / 2, w / 2.6, 0.2, 10), C('#e8e0d0')); v.position.y = h - 0.1; o.add(v);
          const ac = new THREE.Mesh(new THREE.CircleGeometry(w / 2 - 0.04, 10).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#8ac8e8' })); ac.position.y = h - 0.01; ac.userData.piatto = true; o.add(ac);
        } else {
          const col = blocco(0.14, h - 0.35, 0.14, { colore: '#5a3218' }); col.position.y = (h - 0.35) / 2; o.add(col);
          const cs = blocco(w, 0.35, d, { colore: '#7a5a32', fronte: (P, W, H2) => { P('#7a5a32', 0, 0, W, H2); P('#2a1a10', W / 2 - 3, 2, 6, 1); P('#f4ecd6', 2, H2 - 5, W - 4, 3); } }); cs.position.y = h - 0.175; o.add(cs);
        }
        break;
      }
      // ---------- castello ----------
      case 'armatura': {
        o = gruppo();
        const ferro = '#a8b0b8';
        const base = blocco(w, 0.15, d, { colore: '#5a4a3a' }); base.position.y = 0.075; o.add(base);
        const gambe = blocco(0.36, 0.75, 0.24, { colore: ferro, fronte: (P, W, H2) => { P('#a8b0b8', 0, 0, W, H2); P('#7a828a', W / 2, 0, 1, H2); P('#d0d8e0', 1, 0, 1, H2); } }); gambe.position.y = 0.52; o.add(gambe);
        const busto = blocco(0.5, 0.6, 0.3, { colore: ferro, fronte: (P, W, H2) => { P('#a8b0b8', 0, 0, W, H2); P('#d0d8e0', 2, 1, 2, H2 - 2); P('#7a828a', 0, H2 - 2, W, 2); P('#c83a2a', W / 2 - 1, 3, 2, 4); } }); busto.position.y = 1.2; o.add(busto);
        const elmo = blocco(0.3, 0.32, 0.3, { colore: ferro, fronte: (P, W, H2) => { P('#a8b0b8', 0, 0, W, H2); P('#1e1e22', 1, H2 / 2 - 1, W - 2, 1); P('#d0d8e0', 1, 1, 1, H2 - 2); } }); elmo.position.y = 1.67; o.add(elmo);
        const pi = blocco(0.1, 0.18, 0.1, { colore: '#c83a2a' }); pi.position.y = 1.92; o.add(pi);
        const lancia = blocco(0.05, h + 0.4, 0.05, { colore: '#6a4a2a' }); lancia.position.set(w / 2 - 0.05, (h + 0.4) / 2, 0.1); o.add(lancia);
        const punta = blocco(0.1, 0.2, 0.04, { colore: ferro }); punta.position.set(w / 2 - 0.05, h + 0.5, 0.1); o.add(punta);
        break;
      }
      case 'cassapanca': case 'forziere': {
        const col = m.tipo === 'forziere' ? '#6a3a1c' : '#7a4a26';
        o = blocco(w, h, d, { colore: col, fronte: (P, W, H2, g, r) => { legno(col)(P, W, H2, g, r); P('#3a3a42', 0, 3, W, 2); P('#3a3a42', 0, H2 - 4, W, 2); P('#3a3a42', 3, 0, 2, H2); P('#3a3a42', W - 5, 0, 2, H2); P('#e0c060', W / 2 - 2, H2 / 2 - 2, 4, 5); P('#2a2a2a', W / 2 - 1, H2 / 2, 2, 2); } });
        o.position.y = h / 2; break;
      }
      case 'camino': {
        o = gruppo();
        const pietra = (P, W, H2) => { P('#8a8476', 0, 0, W, H2); for (let y = 0; y < H2; y += 5) for (let x = (y / 5 % 2) * 5; x < W; x += 10) { P('#a49e90', x + 1, y + 1, 8, 3); P('#b8b2a4', x + 1, y + 1, 8, 1); } };
        const corpo = blocco(w, h, d, { colore: '#8a8476', fronte: (P, W, H2) => { pietra(P, W, H2); const bw = W * 0.6, bx = (W - bw) / 2, by = H2 * 0.45; P('#1a1210', bx, by, bw, H2 - by); P('#5a564e', bx - 2, by - 3, bw + 4, 3); } });
        corpo.position.y = h / 2; o.add(corpo);
        const mens = blocco(w + 0.2, 0.12, d + 0.1, { colore: '#6a5a48' }); mens.position.y = h * 0.42; o.add(mens);
        const fuoco = new THREE.MeshBasicMaterial({ color: '#ff8a30' });
        for (const [x, s] of [[-0.25, 0.16], [0.05, 0.22], [0.3, 0.14]]) { const f = new THREE.Mesh(new THREE.ConeGeometry(s, s * 2.4, 5), fuoco); f.position.set(x, 0.12 + s * 1.2, d / 2 - 0.05); o.add(f); }
        const legna = blocco(0.8, 0.1, 0.25, { colore: '#5a3a1c' }); legna.position.set(0, 0.08, d / 2 - 0.05); o.add(legna);
        c.fuochi = (c.fuochi || []).concat([fuoco]);
        break;
      }
      case 'trono': {
        o = gruppo();
        const oro = '#c8a040', vel = '#a82a3a';
        const sed = blocco(w, 0.5, d, { colore: oro, fronte: (P, W, H2) => { P(oro, 0, 0, W, H2); P('#e8c860', 0, 0, W, 1); P(vel, 3, 2, W - 6, H2 - 4); } }); sed.position.y = 0.25; o.add(sed);
        const cus = blocco(w - 0.2, 0.12, d - 0.2, { colore: vel }); cus.position.y = 0.56; o.add(cus);
        const sch = blocco(w, h - 0.5, 0.16, { colore: oro, fronte: (P, W, H2) => { P(oro, 0, 0, W, H2); P('#e8c860', 0, 0, W, 1); P(vel, 3, 5, W - 6, H2 - 8); P(oro, W / 2 - 2, 8, 4, 4); P('#3a6ac8', W / 2 - 1, 9, 2, 2); for (const x of [2, W / 2 - 1, W - 4]) P('#e8c860', x, 0, 2, 3); } });
        sch.position.set(0, 0.5 + (h - 0.5) / 2, -d / 2 + 0.08); o.add(sch);
        for (const sx of [-1, 1]) { const br = blocco(0.12, 0.35, d - 0.1, { colore: oro }); br.position.set(sx * (w / 2 - 0.06), 0.7, 0.02); o.add(br); }
        break;
      }
      // ---------- farmacia e dottore ----------
      case 'espositore': {
        o = gruppo();
        for (let i = 0; i < 3; i++) { const p = blocco(w - i * 0.15, 0.06, d - i * 0.15, { colore: '#e8e8e4' }); p.position.y = 0.3 + i * 0.4; o.add(p); for (let k = 0; k < 3; k++) { const sc = blocco(0.18, 0.22, 0.12, { colore: ['#e85a8a', '#3a8ac8', '#f0c030', '#3e8a4a'][(i + k) % 4] }); sc.position.set(-0.25 + k * 0.25, 0.44 + i * 0.4, 0); o.add(sc); } }
        const asta = blocco(0.06, h, 0.06, { colore: '#9aa4ac' }); asta.position.y = h / 2; o.add(asta);
        const cart = blocco(0.6, 0.25, 0.04, { colore: '#d83a3a', fronte: (P, W, H2) => { P('#d83a3a', 0, 0, W, H2); P('#f4f0e4', 2, 1, W - 4, 2); } }); cart.position.y = h + 0.1; o.add(cart);
        break;
      }
      case 'bilancia': {
        o = gruppo();
        const pedana = blocco(w, 0.12, d, { colore: '#d8d8d8' }); pedana.position.y = 0.06; o.add(pedana);
        const col = blocco(0.12, h - 0.4, 0.12, { colore: '#c83a2a' }); col.position.set(0, (h - 0.4) / 2 + 0.1, -d / 2 + 0.1); o.add(col);
        const qu = blocco(0.45, 0.45, 0.14, { colore: '#c83a2a', fronte: (P, W, H2) => { P('#c83a2a', 0, 0, W, H2); P('#f4f0e4', 2, 2, W - 4, H2 - 4); P('#2a2a2a', W / 2, 3, 1, H2 / 2 - 2); P('#2a2a2a', 3, H2 - 4, W - 6, 1); } }); qu.position.set(0, h - 0.2, -d / 2 + 0.1); o.add(qu);
        break;
      }
      case 'lettino': {
        o = gruppo();
        const tela2 = blocco(w, 0.15, d, { colore: '#4a7aa8', sopra: (P, W, H2) => { P('#4a7aa8', 0, 0, W, H2); P('#f4f4f0', 2, 1, W - 4, H2 - 2); P('#e8e8e4', 2, 1, 8, H2 - 2); } }); tela2.position.y = h - 0.075; o.add(tela2);
        for (const [lx, lz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const g2 = blocco(0.07, h - 0.15, 0.07, { colore: '#9aa4ac' }); g2.position.set(lx * (w / 2 - 0.1), (h - 0.15) / 2, lz * (d / 2 - 0.1)); o.add(g2); }
        break;
      }
      // ---------- palestra ----------
      case 'panca': {
        o = gruppo();
        const s = blocco(w * 0.8, 0.12, 0.35, { colore: '#2a2a30', sopra: pieno('#3a3a44') }); s.position.set(0, 0.45, 0); o.add(s);
        for (const sx of [-1, 1]) { const g2 = blocco(0.08, 0.45, 0.3, { colore: '#9aa4ac' }); g2.position.set(sx * w * 0.32, 0.22, 0); o.add(g2); const sup = blocco(0.07, h - 0.1, 0.07, { colore: '#9aa4ac' }); sup.position.set(sx * w * 0.3, (h - 0.1) / 2, -d / 2 + 0.1); o.add(sup); }
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, w + 0.3, 6).rotateZ(Math.PI / 2), C('#c8c8d0')); bar.position.set(0, h, -d / 2 + 0.1); o.add(bar);
        for (const sx of [-1, 1]) { const di = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 12).rotateZ(Math.PI / 2), C('#2a2a30')); di.position.set(sx * (w / 2 + 0.05), h, -d / 2 + 0.1); o.add(di); }
        break;
      }
      case 'manubri': {
        o = gruppo();
        const r2 = blocco(w, 0.08, d, { colore: '#3a3a42' }); r2.position.y = 0.5; o.add(r2);
        const r3 = blocco(w, 0.08, d, { colore: '#3a3a42' }); r3.position.y = 0.95; o.add(r3);
        for (const sx of [-1, 1]) { const g2 = blocco(0.08, h, d, { colore: '#4a4a52' }); g2.position.set(sx * (w / 2 - 0.04), h / 2, 0); o.add(g2); }
        for (let i = 0; i < 6; i++) for (const y of [0.6, 1.05]) { const k = 0.08 + (i % 3) * 0.02; const mb = blocco(0.3, k * 2, k * 2, { colore: ['#2a2a30', '#c83a2a', '#3a6ac8'][i % 3] }); mb.position.set(-w / 2 + 0.25 + i * (w - 0.5) / 5, y + k, 0); o.add(mb); }
        break;
      }
      case 'tapis': {
        o = gruppo();
        const nastro = blocco(w, 0.18, d, { colore: '#2a2a30', sopra: (P, W, H2) => { P('#2a2a30', 0, 0, W, H2); for (let y = 2; y < H2; y += 4) P('#3a3a42', 2, y, W - 4, 1); P('#9aa4ac', 0, 0, 1, H2); P('#9aa4ac', W - 1, 0, 1, H2); } }); nastro.position.y = 0.09; o.add(nastro);
        for (const sx of [-1, 1]) { const g2 = blocco(0.06, h - 0.2, 0.06, { colore: '#9aa4ac' }); g2.position.set(sx * (w / 2 - 0.05), 0.18 + (h - 0.2) / 2, -d / 2 + 0.15); o.add(g2); }
        const qu = blocco(w, 0.25, 0.2, { colore: '#3a3a42', fronte: (P, W, H2) => { P('#3a3a42', 0, 0, W, H2); P('#3ac85a', 3, 1, W - 6, 2); P('#c83a2a', 2, H2 - 2, 2, 1); } }); qu.position.set(0, h, -d / 2 + 0.15); o.add(qu);
        break;
      }
      case 'sacco': {
        o = gruppo();
        const sac = new THREE.Mesh(new THREE.CylinderGeometry(w / 2, w / 2, 1.3, 12), C('#a82a2a')); sac.position.y = 1.15; o.add(sac);
        const fa = new THREE.Mesh(new THREE.CylinderGeometry(w / 2 + 0.01, w / 2 + 0.01, 0.1, 12), C('#2a2a30')); fa.position.y = 1.55; o.add(fa);
        const cat = blocco(0.03, h - 1.8, 0.03, { colore: '#6a6a72' }); cat.position.y = 1.8 + (h - 1.8) / 2; o.add(cat);
        break;
      }
      case 'doccia': {
        o = gruppo();
        const piatto = blocco(w, 0.08, d, { colore: '#e8eef0' }); piatto.position.y = 0.04; o.add(piatto);
        const vetro = new THREE.Mesh(new THREE.BoxGeometry(0.04, h - 0.2, d), new THREE.MeshLambertMaterial({ color: '#b8d8e8', transparent: true, opacity: 0.45 })); vetro.position.set(-w / 2 + 0.02, h / 2, 0); o.add(vetro);
        const tubo = blocco(0.05, h - 0.4, 0.05, { colore: '#c8c8d0' }); tubo.position.set(0, (h - 0.4) / 2, -d / 2 + 0.06); o.add(tubo);
        const sof = blocco(0.3, 0.06, 0.3, { colore: '#c8c8d0' }); sof.position.set(0, h - 0.4, -d / 2 + 0.25); o.add(sof);
        const tenda = blocco(w * 0.6, h - 0.5, 0.03, { colore: '#e8e0a0', fronte: (P, W, H2) => { P('#e8e0a0', 0, 0, W, H2); for (let x = 0; x < W; x += 4) P('#d8c870', x, 0, 1, H2); P('#3a8ac8', 3, H2 / 3, W - 6, 2); } }); tenda.position.set(w * 0.18, (h - 0.5) / 2 + 0.3, d / 2 - 0.02); o.add(tenda);
        break;
      }
      // ---------- pizzeria, kebab, Zeno ----------
      case 'forno': {
        o = gruppo();
        const base = blocco(w, 0.9, d, { colore: '#b4583a', fronte: (P, W, H2) => { P('#b4583a', 0, 0, W, H2); for (let y = 0; y < H2; y += 4) for (let x = (y / 4 % 2) * 4; x < W; x += 8) { P('#c86a48', x + 1, y + 1, 6, 2); } P('#3a2a1a', W / 2 - 8, H2 - 9, 16, 7); P('#8a5a2a', W / 2 - 7, H2 - 8, 14, 2); } });
        base.position.y = 0.45; o.add(base);
        const cupola = new THREE.Mesh(new THREE.SphereGeometry(Math.min(w, d) / 2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), C('#c8784a'));
        cupola.scale.set(w / Math.min(w, d), 0.9, d / Math.min(w, d)); cupola.position.y = 0.9; o.add(cupola);
        const bocca = new THREE.Mesh(new THREE.CircleGeometry(0.28, 10, 0, Math.PI), new THREE.MeshBasicMaterial({ color: '#ff8a30' })); bocca.position.set(0, 0.92, d / 2 + 0.01); bocca.userData.piatto = true; o.add(bocca);
        const can = blocco(0.3, h - 0.9, 0.3, { colore: '#8a8476' }); can.position.set(0, 0.9 + (h - 0.9) / 2 + 0.4, -d / 4); o.add(can);
        c.fuochi = (c.fuochi || []).concat([bocca.material]);
        break;
      }
      case 'spiedo': {
        o = gruppo();
        const base = blocco(w, 0.9, d, { colore: '#9aa4ac', fronte: (P, W, H2) => { P('#9aa4ac', 0, 0, W, H2); P('#c8401a', 1, 2, W - 2, 3); } }); base.position.y = 0.45; o.add(base);
        const carne = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, h - 1.05, 10), new THREE.MeshLambertMaterial({ map: tex(1, 1, (P, W, H2, g, r) => { P('#a8602a', 0, 0, W, H2); for (let i = 0; i < 60; i++) P(r() < 0.5 ? '#c8803a' : '#7a3a1a', r() * W, r() * H2, 2, 1); }) }));
        carne.position.y = 0.95 + (h - 1.05) / 2; o.add(carne);
        const asta = blocco(0.03, h - 0.85, 0.03, { colore: '#c8c8d0' }); asta.position.y = 0.9 + (h - 0.85) / 2; o.add(asta);
        const res = blocco(0.06, h - 1.1, 0.4, { colore: '#ff6a2a' }); res.position.set(-w / 2 + 0.05, 0.95 + (h - 1.1) / 2, 0); o.add(res);
        c.ruote.push(Object.assign(carne, { asse: 'y' }));
        break;
      }
      case 'macchinetta': {
        o = blocco(w, h, d, { colore: '#3a3a42', fronte: (P, W, H2) => { P('#3a3a42', 0, 0, W, H2); P('#c8a040', 2, 2, W - 4, 6); P('#2a1a10', 4, 3, W - 8, 4); P('#1e1e22', 3, H2 * 0.45, W - 6, 8); P('#f4f0e4', W / 2 - 1, H2 * 0.45 + 4, 3, 3); for (let i = 0; i < 3; i++) P('#d83a3a', 3 + i * 4, H2 * 0.75, 2, 2); } });
        o.position.y = h / 2; break;
      }
      // ---------- appesi al muro ----------
      case 'poster': o = quadro(w, h, (P, W, H2) => { P('#f4e8c8', 0, 0, W, H2); P('#8ac8e8', 2, 2, W - 4, H2 * 0.55); P('#5aa83a', 2, H2 * 0.55, W - 4, H2 * 0.25); P('#c83a2a', W * 0.25, H2 * 0.35, W * 0.4, H2 * 0.25); P('#2a2a2a', W * 0.25, H2 * 0.58, 5, 5); P('#2a2a2a', W * 0.58, H2 * 0.55, 7, 7); P('#f0d050', W * 0.5, H2 * 0.25, 3, 4); P('#2a2a2a', 3, H2 - 5, W - 6, 2); }); break;
      case 'trofei': o = quadro(w, h, (P, W, H2) => { P('#6a3a1c', 0, 0, W, H2); P('#8a5a32', 1, 1, W - 2, H2 - 2); P('#4a2a12', 1, H2 - 2, W - 2, 1); for (let x = 4; x < W - 2; x += Math.floor(W / 3)) P('#c8c8c8', x + 3, 3, 1, 1); }); c.trofei = { o, m }; break;
      case 'bacheca': o = quadro(w, h, (P, W, H2, g, r) => { P('#6a4a2a', 0, 0, W, H2); P('#c89a5a', 2, 2, W - 4, H2 - 4); for (let i = 0; i < 4; i++) { const x = 3 + r() * (W - 14), y = 3 + r() * (H2 - 12); P(pick(['#f4f0e0', '#f0e890', '#c8e8f0']), x, y, 9, 8); P('#c83a2a', x + 4, y, 1, 1); P('#8a8a8a', x + 2, y + 3, 5, 1); P('#8a8a8a', x + 2, y + 5, 4, 1); } }); break;
      case 'calendario': o = quadro(w, h, (P, W, H2) => { P('#f4f0e8', 0, 0, W, H2); P('#3a7a3a', 0, 0, W, Math.floor(H2 * 0.35)); P('#e8c050', 2, 2, W - 4, Math.floor(H2 * 0.35) - 4); for (let y = Math.floor(H2 * 0.4); y < H2 - 2; y += 3) for (let x = 2; x < W - 2; x += 3) P('#8a8a8a', x, y, 2, 2); P('#c83a2a', 5, Math.floor(H2 * 0.4) + 3, 2, 2); }); break;
      case 'salami': o = quadro(w, h, (P, W, H2) => { P('#5a3a22', 0, 0, W, 2); for (let x = 2; x < W - 3; x += 5) { const l = 6 + (x * 7) % 4; P('#d8c8a0', x + 1, 2, 1, 2); P('#8a2a2a', x, 4, 3, l); P('#a84a3a', x, 4, 1, l); P('#f0e0d0', x + 1, 6, 1, 1); } }); break;
      case 'buco': o = quadro(w, h, (P, W, H2) => { P('#1a1210', 2, 2, W - 4, H2 - 2); P('#2a1e1a', 3, 1, W - 6, 2); P('#6a5a50', 0, H2 - 3, 3, 3); P('#6a5a50', W - 4, H2 - 2, 4, 2); P('#e8c050', W - 6, H2 - 3, 2, 1); P('#ff3a3a', W / 2 - 2, H2 / 2, 1, 1); P('#ff3a3a', W / 2 + 1, H2 / 2, 1, 1); }); break;
      case 'mensola': o = quadro(w, h, F.scaffale(m.merce)); break;
      case 'crocifisso': o = quadro(w, h, (P, W, H2) => { const cx = W / 2; P('#5a3218', cx - 2, 0, 4, H2); P('#5a3218', 1, H2 * 0.25, W - 2, 4); P('#7a4a26', cx - 1, 0, 1, H2); P('#e8c8a0', cx - 1, H2 * 0.2, 3, 3); P('#e8c8a0', cx - 1, H2 * 0.3, 2, H2 * 0.35); P('#e8c8a0', 3, H2 * 0.27, W - 6, 1); P('#c8a040', cx - 2, 0, 4, 2); }); break;
      case 'vetrata': o = quadro(w, h, (P, W, H2) => { const r0 = W / 2; P('#3a3a42', 0, r0, W, H2 - r0); for (let y = 0; y < r0; y++) for (let x = 0; x < W; x++) { const nx = (x + 0.5 - r0) / r0, ny = (y + 0.5 - r0) / r0; if (nx * nx + ny * ny <= 1) P('#3a3a42', x, y); } const cols = [m.colore || '#3a5aa8', '#f0c030', '#d83a2a', '#3e8a4a', '#8a4ac8']; for (let y = 2; y < H2 - 2; y += 4) for (let x = 2; x < W - 2; x += 4) { const nx = (x + 2 - r0) / r0, ny = (y + 2 - r0) / r0; if (y < r0 && nx * nx + ny * ny > 0.7) continue; P(cols[(x * 3 + y * 7) % 5], x, y, 3, 3); } P('#f4ecc8', W / 2 - 2, H2 * 0.3, 4, 6); P('#f8e080', W / 2 - 3, H2 * 0.3 - 3, 6, 3); }); break;
      case 'corda': o = quadro(w, h, (P, W, H2) => { P('#c8a870', W / 2 - 1, 0, 2, H2 - 6); for (let y = 0; y < H2 - 6; y += 3) P('#a8885a', W / 2 - 1, y, 1, 1); P('#a82a2a', 0, H2 - 8, W, 6); P('#d84a3a', 1, H2 - 8, 1, 6); }); break;
      case 'arazzo': o = quadro(w, h, (P, W, H2, g, r) => { const col = m.colore || '#8a2a2a'; P('#5a3a1c', 0, 0, W, 2); P(col, 1, 2, W - 2, H2 - 5); P('#c8a040', 1, 2, W - 2, 1); P('#c8a040', 1, H2 - 4, W - 2, 1); P('#6a8a4a', 3, H2 * 0.65, W - 6, H2 * 0.25); for (let i = 0; i < 5; i++) { const x = 5 + i * (W - 10) / 4, y = H2 * 0.4 + (i % 2) * 4; P('#e8e0c8', x, y, 3, 6); P('#a8b0b8', x - 1, y - 2, 5, 2); P('#6a4a2a', x + 3, y - 4, 1, 10); } P('#f0c030', W / 2 - 3, 6, 6, 6); for (let x = 1; x < W - 1; x += 2) P('#c8a040', x, H2 - 3, 1, 3); }); break;
      case 'stemma': o = quadro(w, h, (P, W, H2) => { P('#2f4f8a', 1, 0, W - 2, H2 * 0.65); for (let y = H2 * 0.65; y < H2; y++) { const k = (y - H2 * 0.65) / (H2 * 0.35); P('#2f4f8a', 1 + k * W / 2, y, W - 2 - k * W, 1); } P('#f0c030', W / 2 - 1, 2, 2, H2 * 0.7); P('#f0c030', 3, H2 * 0.3, W - 6, 2); }); break;
      case 'ritratto': o = quadro(w, h, (P, W, H2) => { P('#c8a040', 0, 0, W, H2); P('#8a6a20', 1, 1, W - 2, H2 - 2); P(m.colore || '#3a2a4a', 3, 3, W - 6, H2 - 6); P('#f0d0b0', W / 2 - 3, H2 * 0.25, 6, 7); P('#f4f0e4', W / 2 - 4, H2 * 0.18, 8, 4); P('#1e1622', W / 2 - 2, H2 * 0.32, 1, 1); P('#1e1622', W / 2 + 1, H2 * 0.32, 1, 1); P('#1e1e24', W / 2 - 6, H2 * 0.48, 12, H2 * 0.45); P('#f4f0e4', W / 2 - 1, H2 * 0.48, 2, 3); }); break;
      case 'catene': o = quadro(w, h, (P, W, H2) => { for (const x of [3, W - 5]) { for (let y = 0; y < H2 - 6; y += 3) { P('#6a6a72', x, y, 2, 2); P('#4a4a52', x + 1, y + 1, 1, 2); } P('#5a5a62', x - 2, H2 - 6, 6, 4); } }); break;
      case 'croce': o = quadro(w, h, (P, W, H2) => { const c2 = W / 2; P('#2a8a4a', c2 - 2, 0, 5, H2); P('#2a8a4a', c2 - 7, H2 / 2 - 2, 15, 5); P('#5ac87a', c2 - 1, 1, 3, H2 - 2); P('#5ac87a', c2 - 6, H2 / 2 - 1, 13, 3); }); break;
      case 'ottotipo': o = quadro(w, h, (P, W, H2) => { P('#f8f8f4', 0, 0, W, H2); P('#c8c8c4', 0, 0, W, 1); const righe = [['E', 6], ['FP', 4], ['TOZ', 3], ['LPED', 2], ['PECFD', 1]]; let y = 2; for (const [s2, k] of righe) { const tw = s2.length * (k * 2 + 1); for (let i = 0; i < s2.length; i++) P('#1e1e22', (W - tw) / 2 + i * (k * 2 + 1), y, k * 2, k * 2); y += k * 2 + 2; } }); break;
      case 'specchio': o = quadro(w, h, (P, W, H2) => { P('#8a8a92', 0, 0, W, H2); P('#b8d4e0', 1, 1, W - 2, H2 - 2); for (let i = 0; i < 3; i++) { P('#e8f4f8', 4 + i * 12, H2 - 4, 6, 1); for (let k = 0; k < H2 - 6; k++) P('#d8eef4', 6 + i * 12 + k * 0.6, H2 - 4 - k, 1, 1); } }); break;
      case 'quadro': o = quadro(w, h, (P, W, H2) => { P('#c8a040', 0, 0, W, H2); P('#7ab8e8', 2, 2, W - 4, H2 * 0.55); P('#2a5a9a', 2, H2 * 0.68, W - 4, H2 - H2 * 0.68 - 2); const cx = W * 0.55; for (let y = 0; y < H2 * 0.4; y++) P('#6a5a4a', cx - y * 1.1, H2 * 0.3 + y, y * 2.2 + 2, 1); P('#9a9a9a', cx - 2, H2 * 0.12, 5, 5); P('#4a8a3a', 2, H2 * 0.62, W - 4, 2); }); break;
      case 'menu': o = quadro(w, h, (P, W, H2) => { P('#1e1e22', 0, 0, W, H2); const cols = ['#e8a030', '#c8401a', '#3e8a4a']; for (let i = 0; i < 3; i++) { const x = 2 + i * (W - 4) / 3, ww = (W - 4) / 3 - 2; P(cols[i], x, 2, ww, H2 * 0.45); P('#f4e0b0', x + 2, 4, ww - 4, H2 * 0.3); P('#f4f0e4', x, H2 * 0.6, ww * 0.7, 1); P('#f0c030', x + ww - 5, H2 * 0.6, 4, 2); P('#f4f0e4', x, H2 * 0.75, ww * 0.5, 1); } }); break;
      case 'insegna': { const cv = PIX.sign(m.testo); o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshLambertMaterial({ map: PIX.toTexture(cv), transparent: true, alphaTest: 0.1 })); o.userData.piatto = true; break; }
      case 'stecche': o = quadro(w, h, (P, W, H2) => { P('#5a3018', 0, 0, W, 3); P('#5a3018', 0, H2 - 3, W, 3); for (let x = 2; x < W - 1; x += 3) { P('#d8b070', x, 3, 1, H2 - 6); P('#2a2a2a', x, H2 - 5, 1, 2); P('#4a8ac8', x, 3, 1, 1); } }); break;
      case 'porta': o = quadro(w, h, (P, W, H2, g, r) => { legno('#6a3a1c', true)(P, W, H2, g, r); P('#3a2010', 0, 0, W, 2); P('#3a2010', 0, 0, 2, H2); P('#3a2010', W - 2, 0, 2, H2); P(tono('#6a3a1c', 0.8), 4, 4, W - 8, H2 * 0.4); P(tono('#6a3a1c', 0.8), 4, H2 * 0.5, W - 8, H2 * 0.42); P('#e0c060', W - 5, H2 * 0.5, 2, 2); P('#f4f0e0', 4, 6, W - 8, 4); P('#c83a2a', 5, 7, W - 10, 2); }); break;
      // ---------- per terra ----------
      case 'tappeto': o = piano(w, d, (P, W, H2) => { const col = m.colore || '#a83a2a'; P(tono(col, 0.75), 0, 0, W, H2); P(col, 2, 2, W - 4, H2 - 4); P('#e8c050', 4, 4, W - 8, 1); P('#e8c050', 4, H2 - 5, W - 8, 1); for (let x = 8; x < W - 8; x += 8) P(tono(col, 1.3), x, H2 / 2 - 1, 3, 3); for (let x = 0; x < W; x += 2) { P('#f0e0c0', x, 0, 1, 1); P('#f0e0c0', x, H2 - 1, 1, 1); } }); break;
      case 'zerbino': o = piano(w, d, (P, W, H2) => { const col = m.colore || '#7a5a3a'; P(col, 0, 0, W, H2); for (let y = 1; y < H2; y += 2) P(tono(col, 0.8), 1, y, W - 2, 1); P('#f0e0c0', W / 2 - 3, H2 / 2 - 1, 6, 2); }); break;
      case 'macchia': o = piano(w, d, (P, W, H2) => { P('rgba(20,18,16,0.55)', 2, 2, W - 4, H2 - 4); P('rgba(20,18,16,0.4)', 0, 4, W, H2 - 8); P('rgba(120,140,200,0.25)', W / 2, 4, 6, 2); }); break;
      case 'grata': o = piano(w, d, (P, W, H2) => { P('#3a3a3a', 0, 0, W, H2); P('#0a0a0a', 2, 2, W - 4, H2 - 4); for (let x = 2; x < W - 2; x += 3) P('#6a6a6a', x, 2, 1, H2 - 4); P('#8a5a2a', W - 5, H2 / 2 - 2, 4, 4); P('#c8a040', W - 4, H2 / 2 - 1, 2, 2); }, 0.02); break;
      default: o = blocco(w, h, d, { colore: m.colore || '#8a6a42' }); o.position.y = h / 2;
    }
    if (m.parete) { o.position.y = (m.y || 0) + h / 2; o.position.z = 0.03; }
    return o;
  }

  // arredi che cambiano: trofei, avventori del bar, maiali
  _arreda(id, c) {
    if (c.trofei) this._trofei(c);
    if (id === 'bar') this._avventori(c);
    if (id === 'maiali') this._maiali(c);
  }

  _trofei(c) {
    const own = (this.s.prog?.vestiti || []).filter(v => VESTITI[v]?.trofeo);
    const key = own.join(',');
    if (c.trofeiKey === key) return;
    c.trofeiKey = key;
    const { o, m } = c.trofei;
    const ICONE = { coronaRatti: ['#e8c040', 'corona'], pellicciaNutrie: ['#7a5434', 'pelle'], mantelloLupi: ['#8a8a96', 'pelle'] };
    const t = tex(m.w, m.h, (P, W, H2) => {
      P('#6a3a1c', 0, 0, W, H2); P('#8a5a32', 1, 1, W - 2, H2 - 2); P('#4a2a12', 1, H2 - 2, W - 2, 1);
      own.slice(0, 3).forEach((v, i) => {
        const [col, k] = ICONE[v] || ['#c8c8c8', 'pelle'];
        const x = 2 + i * Math.floor((W - 4) / 3);
        if (k === 'corona') { P(col, x + 1, 4, 10, 4); P(col, x + 1, 1, 2, 3); P(col, x + 5, 1, 2, 3); P(col, x + 9, 1, 2, 3); P('#c83a2a', x + 5, 5, 2, 2); }
        else { P(col, x, 2, 12, 6); P(tono(col, 0.7), x + 2, 3, 2, 2); P(tono(col, 0.7), x + 7, 4, 3, 2); }
      });
    });
    o.material.map = t; o.material.needsUpdate = true;
  }

  // ---------- Avventori del bar ----------
  presentiBar() {
    const g = this.game;
    if (g.bar?.presenti) { try { return g.bar.presenti() || []; } catch (e) { console.error(e); } }
    // senza il lavoro "bar": ogni giorno qualcuno a caso, dalle 10 a mezzanotte
    const h = (this.s.minutes / H) % 24;
    if (h < 10) return [];
    const r = PIX.rng(this.s.day * 97 + 13);
    const ids = BAR.avventori.map(a => a.id).filter(id => id !== 'tarcisio').sort(() => r() - 0.5).slice(0, 2 + Math.floor(r() * 2));
    const posti = ['tavolo1', 'tavolo2', 'tavolo3', 'tavolo4'].sort(() => r() - 0.5);
    const out = ids.map((id, i) => ({ id, nome: BAR.avventori.find(a => a.id === id).nome, posto: posti[i] }));
    out.push({ id: 'tarcisio', nome: BAR.avventori.find(a => a.id === 'tarcisio').nome, posto: 'carte' });
    return out;
  }

  _avventori(c) {
    const def = this.defs.bar, W = this.game.world;
    const pres = this.presentiBar();
    for (const a of Object.values(c.avventori)) { a.visibile = false; a.a.group.visible = false; }
    const usati = new Set();
    for (const p of pres) {
      let posto = def.posti[p.posto] ? p.posto : null;
      if (!posto || usati.has(posto)) posto = Object.keys(def.posti).find(k => !usati.has(k) && k.startsWith('tavolo'));
      if (!posto) continue;
      usati.add(posto);
      let av = c.avventori[p.id];
      if (!av) {
        const key = PIX.CHARACTERS[p.id] ? p.id : 'bullo';
        const o = PIX.CHARACTERS[key];
        const a = W.actor(PIX.characterFrames(key), { w: o.w / 16 * 1.25, h: o.h / 16 * 1.25, shadow: 0.4 });
        c.grp.add(a.group);
        av = c.avventori[p.id] = { id: p.id, a, t: Math.random() * 5 };
      }
      const q = def.posti[posto];
      av.nome = p.nome; av.posto = posto; av.x = q.x; av.z = q.z; av.visibile = true;
      av.a.group.visible = true; av.a.group.position.set(q.x, 0, q.z);
    }
  }

  // ---------- Maiali ----------
  _listaMaiali() {
    const g = this.game;
    if (g.maiali?.lista) { try { return { veri: true, lista: g.maiali.lista() || [] }; } catch (e) { console.error(e); } }
    return { veri: false, lista: MAIALI_FINTI };
  }

  _maiali(c) {
    const { lista } = this._listaMaiali();
    const W = this.game.world;
    if (!this._maialeTex) { const f0 = maiale(0), f1 = maiale(1); this._maialeFrames = [f0, f1, PIX.mirror(f0), PIX.mirror(f1)]; this._maialeTex = true; }
    c.maiali.forEach((b, i) => {
      const p = lista[i];
      if (p && !b.attori.length) {
        const a = W.actor(this._maialeFrames, { w: 22 / 16 * 0.95, h: 15 / 16 * 0.95, shadow: 0.45 });
        c.grp.add(a.group);
        const m = b.m;
        b.attori.push({ a, x: m.x + m.w / 2, z: m.z + m.d / 2, tx: m.x + m.w / 2, tz: m.z + m.d / 2, wait: Math.random() * 3, dir: 1 });
      }
      b.attori.forEach(x => { x.a.group.visible = !!p; });
      b.nome = p?.nome;
    });
  }

  // ================= Ogni fotogramma =================
  update(dt) {
    if (!this.attivo) return;
    const g = this.game, W = g.world, c = this.cache[this.edificio];
    this._aggiornaStanza();
    // luce di dentro: calda, uguale di giorno e di notte (le lampade sono accese), più buia in cantina
    const target = this._stanza?.luce ?? 1;
    this._luce += (target - this._luce) * Math.min(1, dt * 4);
    const k = this._luce, h = this.s.minutes / H;
    const notte = h >= 20 || h < 6.5;
    W.amb.color.set(notte ? '#ffd8a8' : '#fff0dc'); W.amb.intensity = 0.42 * k + 0.12;
    W.hemi.intensity = 0.45 * k; W.sun.intensity = 1.25 * k; W.sun.color.set('#ffe2b8');
    W.sunOff.set(-4, 13, 9);
    const tint = this._tint ??= new THREE.Color();
    tint.set(notte ? '#ffe6c8' : '#fff8ee').multiplyScalar(0.55 + 0.45 * k);
    for (const m of W.spriteMats) m.color.copy(tint);
    if (W.scene.background?.isColor) W.scene.background.set('#0e0b0a');
    // finestre: il colore del cielo di fuori
    if (W._sky) for (const v of c.vetri) v.color.copy(W._sky).lerp(new THREE.Color('#ffffff'), notte ? 0.05 : 0.25);
    // dettagli animati
    const t = performance.now() / 1000;
    for (const r of c.ruote) { if (r.asse === 'y') r.rotation.y = t * 1.2; else r.rotation.x = t * 12; }
    if (c.fuochi) for (const f of c.fuochi) f.color.setHSL(0.08 + Math.sin(t * 9) * 0.012, 1, 0.56 + Math.sin(t * 13 + 1) * 0.05);
    if (c.tv) c.tv.color.setHSL(0, 0, 0.85 + Math.sin(t * 7) * 0.08 + Math.sin(t * 2.3) * 0.07);
    if (c.jukebox) c.jukebox.color.setHSL((t * 0.2) % 1, this._musica ? 0.5 : 0.15, 0.85);
    for (const av of Object.values(c.avventori)) { if (!av.visibile) continue; const P = g.player.group.position, o = this.origini.bar; av.a.setFrame((P.x - o.x) > av.x ? 0 : 3); }
    for (const b of c.maiali) for (const p of b.attori) this._muoviMaiale(p, b.m, dt);
  }

  _muoviMaiale(p, m, dt) {
    p.wait -= dt;
    const dx = p.tx - p.x, dz = p.tz - p.z, d = Math.hypot(dx, dz);
    if (p.wait <= 0 && d > 0.05) {
      const st = Math.min(d, 0.55 * dt); p.x += dx / d * st; p.z += dz / d * st;
      if (Math.abs(dx) > 0.02) p.dir = dx > 0 ? 1 : -1;
      p.a.setFrame((p.dir > 0 ? 0 : 2) + (Math.floor(performance.now() / 220) % 2));
    } else if (p.wait <= 0) {
      p.tx = m.x + 0.6 + Math.random() * (m.w - 1.2); p.tz = m.z + 0.7 + Math.random() * (m.d - 1.2); p.wait = 1 + Math.random() * 4;
      p.a.setFrame(p.dir > 0 ? 0 : 2);
    }
    p.a.group.position.set(p.x, 0, p.z);
  }

  _aggiornaStanza(force = false) {
    const def = this.defs[this.edificio], o = this.origini[this.edificio];
    const lx = this.game.player.group.position.x - o.x;
    let s = def.stanze.find(s => lx >= s.x0 && lx < s.x1) || def.stanze[0];
    // un po' di isteresi vicino ai muri divisori
    if (!force && this._stanza && s !== this._stanza && lx > this._stanza.x0 - 0.3 && lx < this._stanza.x1 + 0.3) s = this._stanza;
    if (s !== this._stanza) {
      const prima = this._stanza;
      this._stanza = s;
      if (this._label && !force) { // all'entrata parla già il messaggio di benvenuto
        this._label.textContent = def.stanze.length > 1 && !s.nome.startsWith(def.nome) ? `${def.nome} · ${s.nome}` : s.nome;
        this._label.hidden = false;
        clearTimeout(this._labelT); this._labelT = setTimeout(() => { if (this._label) this._label.hidden = true; }, 2500);
      }
      if (prima) this.game.emit('stanza', { edificio: this.edificio, stanza: s.id });
    }
  }

  // camera fissa sulla stanza: inquadra tutta la stanza se ci sta, altrimenti segue Garonio di lato
  camera(cam, dt) {
    const def = this.defs[this.edificio], o = this.origini[this.edificio], s = this._stanza || def.stanze[0];
    const P = this.game.player.group.position, lx = P.x - o.x;
    const tanV = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)), tanH = tanV * cam.aspect;
    const span = def.d * Math.sin(EL) + def.h * Math.cos(EL);
    const dV = (span / 2 + 0.5) / tanV;
    const sw = s.x1 - s.x0;
    const dH = (sw / 2 + 0.3) / tanH;
    const dist = clamp(dH, dV, dV * (cam.aspect < 1 ? 1.9 : 1.45)); // in verticale (telefono) si allarga di più
    const half = dist * tanH;
    const cx = half * 2 >= sw ? s.x0 + sw / 2 : clamp(lx, s.x0 + half - 0.2, s.x1 - half + 0.2);
    const look = this._camL.set(o.x + cx, 0.9, o.z + def.d * 0.52);
    const pos = this._camT.set(look.x, look.y + Math.sin(EL) * dist, look.z + Math.cos(EL) * dist);
    if (this.scatto) { cam.position.copy(pos); this._lookNow = look.clone(); this.scatto = false; }
    else { cam.position.lerp(pos, 1 - Math.exp(-dt * 5)); this._lookNow.lerp(look, 1 - Math.exp(-dt * 5)); }
    cam.lookAt(this._lookNow);
  }

  // ================= Tasto E =================
  bersaglio() {
    const g = this.game, id = this.edificio, def = this.defs[id], o = this.origini[id], c = this.cache[id];
    const P = g.player.group.position, lx = P.x - o.x, lz = P.z - o.z;
    // personaggi (PNG)
    const pt = g.png.bersaglio();
    if (pt) return { label: pt.label, fn: async () => { await pt.fn(); await this._dopo(); } };
    // avventori del bar
    for (const av of Object.values(c.avventori)) {
      if (av.visibile && Math.hypot(lx - av.x, lz - av.z) < 1.3) return { label: `Parla con ${av.nome}`, fn: () => this._parlaAvventore(av) };
    }
    // uscita
    const u = def.uscita;
    if (Math.hypot(lx - u.x, lz - u.z) < 1.0) return { label: TESTI.uscita, fn: () => this.esci() };
    // mobili
    let best = null, bd = 0.75;
    for (const { m } of c.mobili) {
      if (!m.zona) continue;
      const z0 = m.parete ? 0 : m.z, z1 = m.parete ? 0.35 : m.z + m.d;
      const dx = Math.max(m.x - lx, 0, lx - (m.x + m.w)), dz = Math.max(z0 - lz, 0, lz - z1);
      const dd = Math.hypot(dx, dz) - (m.pavimento ? 0.3 : 0);
      if (dd < bd) { bd = dd; best = m; }
    }
    if (best) return { label: this._etichetta(best), fn: () => this._azione(best) };
    return null;
  }

  _etichetta(m) {
    if (m.zona === 'box') {
      const b = this.cache.maiali?.maiali.find(x => x.box === m.box);
      return b?.nome ? `Box di ${b.nome}` : `Box ${m.box + 1}`;
    }
    if (m.zona === 'tavolo') {
      const av = Object.values(this.cache.bar?.avventori || {}).find(a => a.visibile && a.posto === m.tavolo);
      return av ? `Parla con ${av.nome}` : m.etichetta;
    }
    return m.etichetta || 'Guarda';
  }

  async _azione(m) {
    const g = this.game, key = `${this.edificio}:${m.zona}`;
    const def = this._azioni()[key];
    const ctx = { game: g, edificio: this.edificio, zona: m.zona, mobile: m, box: m.box, reparto: m.reparto, tavolo: m.tavolo, predefinito: () => (def ? def(m) : this._dice(m.etichetta)) };
    try {
      if (this.agganci[key]) await this.agganci[key](ctx);
      else if (def) await def(m);
      else await this._dice(m.etichetta || '...');
    } catch (e) { console.error('[interni]', key, e); }
    await this._dopo();
  }

  // dopo un dialogo: nel bar parte la rissa se qualcuno l'ha cercata
  async _dopo() {
    const g = this.game;
    if (this.edificio !== 'bar') return;
    while (g._barFight) {
      const foe = g._barFight; g._barFight = null;
      if (typeof foe === 'function') { await foe(); continue; }
      const res = await g.combat.start({ enemies: [foe], place: 'bar' });
      if (res === 'lose') { await g.mountain('sconfitta', 15); break; }
    }
    if (this.attivo) g.audio.setScene(this.musica());
  }

  _dice(text, name = '', who) { return this.game.ui.dialog([{ name, text, who }]); }

  // ================= Azioni di serie =================
  _azioni() {
    if (this._az) return this._az;
    const g = this.game, T = TESTI, s = () => this.s;
    const toast = (t, k) => g.ui.toast(t, k);
    const stagione = () => {
      try { const i = g.stagioni?.info?.(); if (i) return i; } catch (e) { console.error(e); }
      const d = s().day, idx = Math.floor((d - 1) / 14) % 4;
      return { nome: ['Primavera', 'Estate', 'Autunno', 'Inverno'][idx], chiave: ['primavera', 'estate', 'autunno', 'inverno'][idx], giorno: (d - 1) % 14 + 1, giorniTot: 14, obiettivo: T.obiettivoFinto, fiducia: null };
    };
    this._az = {
      // ---------- casa ----------
      'casa:letto': async () => {
        const late = s().minutes >= 20 * H;
        await g.ui.dialog([{ name: 'Letto', text: late ? T.letto.sera : T.letto.giorno, choices: [
          { label: late ? T.letto.dormi : T.letto.dormiNo, disabled: !late, fn: () => { g.sleep(false); return null; } },
          { label: T.letto.salva, fn: () => { g.save(); toast(T.letto.salvato, 'good'); return null; } },
          { label: 'Lascia stare', fn: null },
        ] }]);
      },
      'casa:armadio': async () => { await g.ui.dialog([g.menu._equip(T.armadio)]); },
      'casa:poster': async () => { await this._dice(pick(T.poster), 'Poster'); },
      'casa:trofei': async () => {
        const own = (s().prog?.vestiti || []).filter(v => VESTITI[v]?.trofeo).map(v => VESTITI[v].nome);
        await this._dice(own.length ? fill(T.trofei, { lista: own.join(', ') }) : T.trofeiVuoto, 'Trofei');
      },
      'casa:tv': async () => {
        const st = stagione();
        const r = PIX.rng(s().day * 53 + 7);
        const meteo = T.tv.meteo[st.meteo] || T.tv.meteo[['sole', 'sole', 'pioggia', 'nebbia', 'grandine', 'sole'][Math.floor(r() * 6)]];
        const pr = CONFIG?.prices || { uova: 3, pomodoro: 6, mais: 10 };
        s().minutes += 15;
        await g.ui.dialog([
          { name: 'TV', text: pick(T.tv.canali) },
          { name: 'TV · Meteo', text: meteo },
          { name: 'TV · Mercato', text: fill(T.tv.prezzi, this._prezzi(pr)) },
        ]);
      },
      'casa:divano': async () => {
        const st = s();
        if (st.tired < 5) { await this._dice(T.divano.stanco, 'Divano'); return; }
        await g.ui.fade(true);
        st.minutes += 60; st.tired = clamp(st.tired - 20, 0, 100); st.stress = clamp(st.stress - 3, 0, 100);
        const beccato = st.minutes < 20 * H && Math.random() < 0.25;
        await g.ui.fade(false);
        if (beccato) { st.stress = clamp(st.stress + 8, 0, 100); g.audio.sfx('bad'); await g.ui.dialog([pagina({ chi: 'gigante', testo: T.divano.beccato })]); }
        else toast(pick(T.divano.ok));
      },
      'casa:tavola': async () => { await this._dice(pick(T.tavola), 'Cucina'); },
      'casa:bacheca': async () => {
        const m = s().mission;
        const testo = m ? `${m.text}\n${m.done ? '✅ fatta' : m.failed ? '❌ fallita' : `${Math.min(m.progress, m.n)}/${m.n} · entro le ${ora(m.deadline / H)} · paga ${m.pay}€`}` : T.bacheca.nessuna;
        await g.ui.dialog([{ name: 'Bacheca del Gigante', text: T.bacheca.titolo }, { name: 'Missione del giorno', text: testo }]);
      },
      'casa:calendario': async () => {
        const st = stagione();
        await this._dice(fill(T.calendario, { stagione: st.nome, giorno: st.giorno, tot: st.giorniTot || 14, obiettivo: st.obiettivo || T.obiettivoFinto }), 'Calendario');
      },
      'casa:conti': async () => {
        const st = stagione();
        await this._dice(fill(T.conti, { soldi: Math.floor(s().money), venduto: s().today?.venduto || 0, fiducia: st.fiducia ?? T.fiduciaFinta }), 'Registro dei conti');
      },
      'casa:deposito': async () => {
        const st = this.st, dep = (st.cantina ??= {}), inv = s().inv;
        const nomi = { uova: '🥚 uova', pomodoro: '🍅 pomodori', mais: '🌽 pannocchie' };
        const lista = Object.entries(dep).filter(([, n]) => n > 0).map(([k, n]) => `${n} ${nomi[k] || k}`).join(', ');
        const mano = ['uova', 'pomodoro', 'mais'].some(k => inv[k] > 0);
        await g.ui.dialog([{ name: 'Cantina', text: lista ? fill(T.cantina.deposito, { lista }) : T.cantina.vuoto, choices: [
          { label: T.cantina.deposita, disabled: !mano, fn: () => { for (const k of ['uova', 'pomodoro', 'mais']) if (inv[k] > 0) { dep[k] = (dep[k] || 0) + inv[k]; g.prog.togliOggetto(k, inv[k]); } toast(T.cantina.depositato, 'good'); return null; } },
          { label: T.cantina.riprendi, disabled: !lista, fn: () => { for (const [k, n] of Object.entries(dep)) if (n > 0) { g.prog.dai(k, n); dep[k] = 0; } toast(T.cantina.ripreso); return null; } },
          { label: 'Lascia stare', fn: null },
        ] }]);
      },
      'casa:cantina': async () => {
        const st = this.st, prim = stagione().chiave === 'primavera';
        if (!prim || st.ratti === s().day || Math.random() > 0.6) { await this._dice(T.cantina.silenzio, 'Cantina'); return; }
        st.ratti = s().day;
        await this._dice(T.cantina.squittii, 'Cantina');
        let nemici = ['nutria'];
        try { const C = await import('./combat.js'); if (C.ENEMIES?.ratto) nemici = ['ratto', 'ratto']; } catch { /* va bene la nutria */ }
        const res = await g.combat.start({ enemies: nemici, place: 'campo' });
        if (res === 'win' && !st.tracciaRatti) {
          st.tracciaRatti = true;
          await this._dice(T.cantina.traccia, 'Cantina');
          g.emit('traccia', { bestia: 'ratti', luogo: 'cantina' });
        } else if (res === 'lose') await g.mountain('sconfitta', 15);
      },
      // ---------- deposito (l'officina di casa) e officina di Zeno in paese ----------
      'officina:bancone': async () => { await this._dice(pick(T.officina.banco), 'Banco da lavoro'); },
      'officina:scaffale': async () => { await this._dice(T.officina.scaffale, 'Scaffale'); },
      'officina:sacchi': async () => { await this._dice(T.officina.sacchi, 'Concime'); },
      'officina:rastrelliera': async () => { await this._dice(T.officina.rastrelliera, 'Rastrelliera'); },
      'officina:armadietti': async () => { await g.enter('officina', true); },
      'meccanico:bancone': async () => {
        if (g.png.dove('zeno')) await g.png.parla('zeno');
        else await this._dice(T.officina.zenoAssente, 'Da Zeno');
      },
      'meccanico:ponte': async () => { await this._dice(T.officina.ponte, 'Ponte sollevatore'); },
      'meccanico:mola': async () => { await this._dice(T.officina.mola, 'Mola'); },
      // ---------- capannone dei maiali ----------
      'maiali:box': async (m) => {
        const b = this.cache.maiali.maiali.find(x => x.box === m.box);
        if (!b?.nome) { await this._dice(T.maiali.vuoto, `Box ${m.box + 1}`); return; }
        const st = this.st, gr = (st.grattati ??= {});
        const fake = MAIALI_FINTI.find(x => x.nome === b.nome);
        const pages = [];
        if (fake) pages.push({ name: b.nome, text: fake.frase });
        if (gr[m.box] === s().day) pages.push({ name: b.nome, text: fill(T.maiali.giaGrattato, { nome: b.nome }) });
        else { gr[m.box] = s().day; s().stress = clamp(s().stress - 2, 0, 100); g.audio.sfx('pick'); pages.push({ name: b.nome, text: fill(T.maiali.gratta, { nome: b.nome }) }); }
        await g.ui.dialog(pages);
      },
      'maiali:mangime': async () => { await this._dice(T.maiali.mangime, 'Mangime'); },
      'maiali:parto': async () => { await this._dice(T.maiali.parto, 'Sala parto'); },
      'maiali:infermeria': async () => { await this._dice(T.maiali.infermeria, 'Infermeria'); },
      'maiali:grata': async () => { await this._dice(T.maiali.grata, 'Grata'); },
      // ---------- bar ----------
      'bar:bancone': async () => {
        if (g.png.dove('loredana')) await g.png.parla('loredana');
        else await g.ui.dialog([g._barMenu(false)]);
      },
      'bar:consulente': async () => {
        if (g.png.dove('consulente')) await g.png.parla('consulente');
        else await this._dice(T.bar.consulente, 'Tavolino del Consulente');
      },
      'bar:tavolo': async (m) => {
        const av = Object.values(this.cache.bar.avventori).find(a => a.visibile && a.posto === m.tavolo);
        if (av) await this._parlaAvventore(av);
        else await this._dice(T.bar.tavoloVuoto, 'Tavolo');
      },
      'bar:carte': async () => {
        const av = Object.values(this.cache.bar.avventori).find(a => a.visibile && a.posto === 'carte');
        if (av && g.bar?.parlaAvventore) await g.bar.parlaAvventore(av.id);
        else if (av) await this._dice(T.bar.carteTarcisio, av.nome, PIX.CHARACTERS[av.id] ? av.id : undefined);
        else await this._dice(T.bar.carte, 'Tavolo delle carte');
      },
      'bar:biliardo': async () => { await this._biliardo(); },
      'bar:jukebox': async () => {
        const pl = g.audio.playlist || {};
        const scene = Object.keys(JUKEBOX).filter(k => (pl[k] || []).length || !Object.keys(pl).length);
        const choices = scene.map(k => ({ label: `${this._musica === k ? '▶ ' : ''}${JUKEBOX[k]}`, fn: () => { this._musica = k; g.audio.setScene(k); toast(fill(T.bar.jukeboxScelto, { titolo: JUKEBOX[k] })); return null; } }));
        choices.push({ label: 'Lascia stare', fn: null });
        await g.ui.dialog([{ name: 'Juke-box', text: T.bar.jukebox, choices }]);
      },
      'bar:annunci': async () => {
        const righe = [];
        for (const id of Object.keys(PNG)) {
          let lst = [];
          try { lst = g.quests?.disponibili?.(id) || []; } catch { lst = []; }
          for (const q of lst) righe.push(`• ${g.quests.defs[q]?.titolo || q} (${PNG[id].nome})`);
        }
        const testo = righe.length ? `${T.bar.annunci}\n${righe.slice(0, 5).join('\n')}` : T.bar.annunciVuoti;
        await g.ui.dialog([{ name: 'Bacheca degli annunci', text: testo }, { name: 'Bacheca degli annunci', text: pick(T.bar.bestie) }]);
      },
      'bar:retro': async () => {
        let esci = false;
        await g.ui.dialog([{ name: 'Porta sul retro', text: T.bar.retro, choices: [
          { label: T.bar.retroEsci, fn: () => { esci = true; return null; } },
          { label: 'Lascia stare', fn: null },
        ] }]);
        const b = BUILDINGS.find(b => b.id === 'bar');
        if (esci) await this.esci({ x: b.x0 + b.w / 2, z: b.z0 - 0.7 });
      },
      // ---------- magazzino del Bubetto ----------
      'magazzino:bancone': async () => {
        if (g.png.dove('bubetto')) await g.png.parla('bubetto');
        else await this._dice(T.magazzino.bubettoAssente, 'Bancone');
      },
      'magazzino:scaffali': async (m) => {
        if (g.negozio?.apri) await g.negozio.apri(m.reparto);
        else await this._dice(T.magazzino.scaffali[m.reparto] || '...', m.etichetta);
      },
      'magazzino:usato': async () => {
        if (g.negozio?.apri) await g.negozio.apri('usato');
        else await this._dice(T.magazzino.usato, 'Angolo dell\'usato');
      },
      'magazzino:lavagna': async () => {
        if (g.negozio?.lavagna) { await g.negozio.lavagna(); return; }
        let lst = [];
        try { lst = g.quests?.disponibili?.('bubetto') || []; } catch { lst = []; }
        const att = (g.quests?.attive?.() || []).filter(q => q.def.da === 'bubetto').map(q => `• ${q.def.titolo} (in corso)`);
        const righe = [...lst.map(q => `• ${g.quests.defs[q]?.titolo || q}`), ...att];
        await this._dice(righe.length ? `${T.magazzino.lavagna}\n${righe.join('\n')}` : T.magazzino.lavagnaVuota, 'Lavagna');
      },
    };
    return this._az;
  }

  _prezzi(pr) {
    const v = { ...pr };
    const b = 1 + (this.game.prog?.bonus?.('vendite') || 0);
    for (const k of Object.keys(v)) v[k] = Math.round(v[k] * b * 10) / 10;
    return v;
  }

  // ---------- Avventori: con il lavoro "bar" parte la loro storia, altrimenti la scena di sempre ----------
  async _parlaAvventore(av) {
    const g = this.game;
    if (g.bar?.parlaAvventore) { await g.bar.parlaAvventore(av.id); await this._dopo(); return; }
    const b = BAR.avventori.find(a => a.id === av.id);
    if (!b) return;
    const s = this.s, R = BAR.rispondi, I = BAR.ignora, v = { nome: b.nome };
    g.audio.setScene('rabbia');
    await g.ui.dialog([{
      ...pagina({ chi: b.id, testo: b.battute }),
      choices: [
        { label: 'Affrontalo (scontro a turni)', fn: () => { g._barFight = b.id === 'bullo' && puoComparire('bullo', s.level) ? 'bullo' : 'ubriaco'; return null; } },
        { label: R.etichetta, fn: () => {
          if (Math.random() < (b.riuscita ?? 0.5)) { s.stress = clamp(s.stress + R.stressBene, 0, 100); g._xp(R.xpBene); return [pagina({ chi: 'garonio', testo: b.risposteBuone }), pagina({ testo: R.bene }, v)]; }
          s.stress = clamp(s.stress + R.stressMale, 0, 100);
          return [pagina({ testo: R.male }, v)];
        } },
        { label: I.etichetta, fn: () => { s.stress = clamp(s.stress + I.stress, 0, 100); return [pagina({ testo: I.testi }, v)]; } },
      ],
    }]);
    await this._dopo();
  }

  // ---------- Biliardo: partita a soldi, vince chi imbuca 2 volte per primo ----------
  async _biliardo() {
    const g = this.game, s = this.s, B = TESTI.biliardo;
    const avv = Object.values(this.cache.bar.avventori).filter(a => a.visibile);
    if (!avv.length) { await this._dice(B.nessuno, 'Biliardo'); return; }
    const sfid = avv.find(a => a.posto === 'biliardo') || avv[Math.floor(Math.random() * avv.length)];
    const who = PIX.CHARACTERS[sfid.id] ? sfid.id : undefined;
    const v = { nome: sfid.nome };
    const partita = (posta) => {
      const st = { mio: 0, suo: 0 };
      const turno = (msg) => ({ name: 'Biliardo', text: `${msg ? msg + '\n' : ''}Garonio ${st.mio} – ${st.suo} ${sfid.nome}. Tocca a te.`, choices: B.tiri.map(t => ({ label: `${t.label} (${Math.round(t.p * 100)}%)`, fn: () => tiro(t) })) });
      const tiro = (t) => {
        s.minutes += 5; s.tired = clamp(s.tired + 1, 0, 100);
        const out = [];
        const p = t.p + (g.prog?.bonus?.('biliardo') || 0);
        if (Math.random() < p) { st.mio += t === B.tiri[2] ? 2 : 1; out.push({ name: 'Garonio', who: 'garonio', text: t.dice }); }
        else out.push({ name: 'Garonio', who: 'garonio', text: pick(B.sbagli) });
        if (st.mio >= 2) { s.money += posta; g.audio.sfx('coin'); g._xp(3); g.emit('biliardo', { esito: 'vinto', posta, contro: sfid.id }); out.push({ name: 'Biliardo', text: fill(B.vinto, { ...v, posta }) }); return out; }
        const segna = Math.random() < 0.45;
        if (segna) st.suo++;
        out.push({ name: sfid.nome, who, text: fill(segna ? B.avversarioSegna : B.avversarioSbaglia, v) });
        if (st.suo >= 2) { s.money -= posta; s.stress = clamp(s.stress + 4, 0, 100); g.audio.sfx('bad'); g.emit('biliardo', { esito: 'perso', posta, contro: sfid.id }); out.push({ name: 'Biliardo', text: fill(B.perso, { ...v, posta }) }); return out; }
        out.push(turno(''));
        return out;
      };
      return [turno(`Sfida con ${sfid.nome}: ${posta}€.`)];
    };
    await g.ui.dialog([{ name: 'Biliardo', text: B.invito, choices: [
      ...B.poste.map(p => ({ label: p.label, disabled: s.money < p.posta, fn: () => partita(p.posta) })),
      { label: 'Lascia stare', fn: null },
    ] }]);
  }
}

// La Vespa sul ponte sollevatore: caricata a parte, così l'officina si costruisce anche senza
import('./vehicle_sprites.js').then(m => { Interni.prototype._vs = m; }).catch(() => {});
