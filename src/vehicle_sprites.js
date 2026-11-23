// Pixel art dei mezzi: Vespa carta da zucchero, Punto bianca e trattori, tutti un po' scassati.
// Ogni mezzo ha tre viste (lato verso destra, davanti, dietro), vuoto o con Garonio alla guida.
// Scala: 20 pixel = 1 casella, come gli sprite di Garonio.
import { makeCanvas, mirror } from './pixel.js';

export const VPX = 20;

const INK = '#1a1420';
// colori di Garonio (dal foglio personaggio)
const G = { hair: '#4a2e1c', skin: '#e8a878', skinD: '#c98a60', shirt: '#a8aab4', shirtD: '#7e808c', jeans: '#2e4a8a', jeansD: '#22386a', shoe: '#2a2a2a', must: '#3a2414' };

function outline(c, color = INK) {
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

function pen(w, h) {
  const [c, g] = makeCanvas(w, h);
  const P = (col, x, y, ww = 1, hh = 1) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), Math.round(ww), Math.round(hh)); };
  const disc = (cx, cy, r, col, sy = 1) => {
    g.fillStyle = col;
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + (y * y) / (sy * sy) <= r * r + r * 0.6) g.fillRect(Math.round(cx + x), Math.round(cy + y), 1, 1);
  };
  const ellipse = (cx, cy, rx, ry, col) => {
    g.fillStyle = col;
    for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1.05) g.fillRect(Math.round(cx + x), Math.round(cy + y), 1, 1);
  };
  return { c, g, P, disc, ellipse };
}

// ruota vista di lato: gomma, cerchione e (se c'è) coprimozzo
function wheel(d, cx, cy, r, hub = '#9a9aa0', cap = true) {
  d.disc(cx, cy, r, '#26262a');
  d.disc(cx, cy, Math.max(1, Math.round(r * 0.55)), hub);
  if (cap) d.disc(cx, cy, Math.max(1, Math.round(r * 0.25)), '#d0d0d4');
  else d.P('#3a3a40', cx, cy);
  d.P('#404046', cx - r + 1, cy - 1, 1, 2);
}

// ---------- Garonio seduto (lato, verso destra) ----------
function riderSide(d, x, y, reachX, reachY) {
  // x,y = punto del sedere sul sellino
  const { P } = d;
  // gamba: coscia in avanti, stinco giù
  P(G.jeans, x, y - 3, 9, 4); P(G.jeansD, x, y, 9, 1);
  P(G.jeans, x + 7, y, 3, 7); P(G.shoe, x + 7, y + 6, 5, 2);
  // busto con pancia
  P(G.shirt, x - 3, y - 13, 8, 11); P(G.shirt, x + 4, y - 10, 2, 8); P(G.shirtD, x - 3, y - 13, 2, 11);
  // braccio verso il manubrio
  const ax = x + 3, ay = y - 11;
  const len = reachX - ax;
  for (let i = 0; i <= len; i++) P(i > len - 3 ? G.skin : G.shirt, ax + i, ay + Math.round((reachY - ay) * i / Math.max(1, len)), 1, 3);
  // testa
  const hx = x - 3, hy = y - 22;
  P(G.skin, hx, hy + 2, 8, 8); P(G.skinD, hx, hy + 2, 2, 8);
  P(G.hair, hx - 1, hy, 9, 3); P(G.hair, hx - 1, hy + 2, 3, 5); P(G.hair, hx + 3, hy - 1, 4, 1);
  P(G.skin, hx + 8, hy + 5, 1, 2);            // naso
  P(INK, hx + 6, hy + 4, 1, 1);               // occhio
  P(G.must, hx + 5, hy + 7, 4, 1);            // baffi
}

// Garonio di fronte, a mezzo busto (dietro un parabrezza o lo scudo)
function riderFront(d, cx, top, { arms = 0, armY = 0 } = {}) {
  const { P } = d;
  P(G.shirt, cx - 5, top + 9, 10, 9); P(G.shirtD, cx + 3, top + 9, 2, 9);
  if (arms) { P(G.shirt, cx - arms, armY - 1, arms - 4, 3); P(G.shirt, cx + 4, armY - 1, arms - 4, 3); P(G.skin, cx - arms, armY - 1, 2, 3); P(G.skin, cx + arms - 2, armY - 1, 2, 3); }
  P(G.skin, cx - 4, top + 1, 8, 8); P(G.skinD, cx + 3, top + 1, 1, 8);
  P(G.hair, cx - 5, top - 1, 10, 3); P(G.hair, cx - 5, top + 1, 1, 3); P(G.hair, cx + 4, top + 1, 1, 3); P(G.hair, cx - 2, top - 2, 4, 1);
  P(INK, cx - 2, top + 4); P(INK, cx + 1, top + 4);
  P(G.must, cx - 2, top + 6, 4, 1);
}

function riderBack(d, cx, top, { arms = 0, armY = 0 } = {}) {
  const { P } = d;
  P(G.shirt, cx - 5, top + 9, 10, 10); P(G.shirtD, cx - 5, top + 9, 2, 10);
  if (arms) { P(G.shirt, cx - arms, armY - 1, arms - 4, 3); P(G.shirt, cx + 4, armY - 1, arms - 4, 3); P(G.skin, cx - arms, armY - 1, 2, 3); P(G.skin, cx + arms - 2, armY - 1, 2, 3); }
  P(G.skin, cx - 4, top + 1, 8, 8); P(G.skin, cx - 5, top + 4, 1, 2); P(G.skin, cx + 4, top + 4, 1, 2);
  P(G.hair, cx - 5, top - 1, 10, 7); P(G.hair, cx - 4, top + 6, 8, 1); P(G.hair, cx - 2, top - 2, 4, 1);
}

// ---------- Vespa blu carta da zucchero ----------
const VB = { base: '#9cc3dd', light: '#c6deee', dark: '#6990ad', rust: '#9a5a32', rustD: '#6e3c20', seat: '#3a2a22', chrome: '#c8ccd0', lamp: '#fff4b0' };

function vespaSide(occ) {
  const d = pen(48, 48); const { P, ellipse } = d;
  const gy = 47;
  wheel(d, 12, gy - 5, 5); wheel(d, 38, gy - 5, 5, '#9a9aa0', false);
  // scocca posteriore tondeggiante
  ellipse(13, gy - 13, 10, 7, VB.base);
  P(VB.base, 4, gy - 13, 19, 4);
  ellipse(11, gy - 16, 6, 3, VB.light);
  P(VB.dark, 5, gy - 9, 17, 1);
  // ruggine e ammaccature
  P(VB.rust, 6, gy - 10, 3, 2); P(VB.rustD, 7, gy - 9, 1, 1); P(VB.rust, 19, gy - 14, 2, 1); P(VB.dark, 15, gy - 17, 2, 1);
  // pedana
  P(VB.base, 18, gy - 10, 14, 3); P(VB.dark, 18, gy - 8, 14, 1);
  // scudo anteriore: pannello inclinato dalla pedana al manubrio
  for (let i = 0; i < 24; i++) { const x = 28 + Math.floor(i / 4); P(VB.base, x, gy - 8 - i, 7, 1); P(VB.light, x + 6, gy - 8 - i, 1, 1); P(VB.dark, x, gy - 8 - i, 1, 1); }
  P(VB.rust, 30, gy - 13, 2, 2); P(VB.rustD, 31, gy - 12, 1, 1);
  // parafango anteriore
  ellipse(38, gy - 10, 6, 3, VB.base); P(VB.light, 35, gy - 13, 5, 1);
  // piantone e manubrio
  P(VB.dark, 34, gy - 36, 3, 6);
  P(VB.base, 29, gy - 37, 12, 4); P(VB.light, 30, gy - 37, 9, 1);
  P(VB.chrome, 41, gy - 37, 2, 4); P(VB.lamp, 42, gy - 36, 1, 2);
  P('#222', 29, gy - 38, 2, 1); // manopola
  // specchietto storto
  P(VB.chrome, 33, gy - 40, 1, 4); P(VB.chrome, 31, gy - 41, 3, 2);
  // sellino
  P(VB.seat, 6, gy - 22, 15, 3); P('#5a4232', 7, gy - 22, 6, 1); P('#7a6040', 16, gy - 21, 2, 1); // strappo
  // targa e fanale
  P('#d03030', 2, gy - 17, 2, 2); P('#e8e8d8', 2, gy - 12, 2, 3);
  if (occ) riderSide(d, 12, gy - 22, 30, gy - 36);
  return outline(d.c);
}

function vespaFront(occ) {
  const d = pen(30, 48); const { P, ellipse } = d; const cx = 15, gy = 47;
  P('#26262a', cx - 2, gy - 9, 4, 9); P('#404046', cx - 2, gy - 9, 1, 9);
  ellipse(cx, gy - 10, 4, 2, VB.base);
  // scudo
  P(VB.base, cx - 6, gy - 34, 12, 24); P(VB.base, cx - 7, gy - 22, 14, 12); P(VB.light, cx - 6, gy - 34, 12, 2); P(VB.dark, cx + 4, gy - 32, 2, 22);
  P('#2a2a30', cx - 2, gy - 26, 4, 5); for (let i = 0; i < 3; i++) P(VB.dark, cx - 2, gy - 25 + i * 2, 4, 1); // grata clacson
  P(VB.rust, cx - 5, gy - 14, 3, 2); P(VB.rust, cx + 3, gy - 21, 2, 1);
  // pedana ai lati con gambe
  if (occ) { P(G.jeans, cx - 10, gy - 25, 4, 12); P(G.jeans, cx + 6, gy - 25, 4, 12); P(G.shoe, cx - 11, gy - 14, 5, 2); P(G.shoe, cx + 6, gy - 14, 5, 2); }
  // manubrio e faro
  if (occ) riderFront(d, cx, gy - 47);
  P(VB.base, cx - 9, gy - 35, 18, 3); P(VB.light, cx - 8, gy - 35, 16, 1);
  P('#222', cx - 13, gy - 35, 4, 2); P('#222', cx + 9, gy - 35, 4, 2);
  if (occ) { P(G.skin, cx - 13, gy - 36, 3, 2); P(G.skin, cx + 10, gy - 36, 3, 2); }
  d.disc(cx, gy - 32, 2, VB.chrome); P(VB.lamp, cx - 1, gy - 33, 2, 2);
  P(VB.chrome, cx - 10, gy - 40, 1, 5); P(VB.chrome, cx - 11, gy - 41, 3, 2); // specchietto
  return outline(d.c);
}

function vespaBack(occ) {
  const d = pen(30, 48); const { P, ellipse } = d; const cx = 15, gy = 47;
  P('#26262a', cx - 2, gy - 8, 4, 8);
  P(VB.dark, cx - 6, gy - 34, 12, 14); P(VB.base, cx - 2, gy - 36, 4, 4); // retro dello scudo
  // scocca larga
  ellipse(cx, gy - 15, 9, 8, VB.base); ellipse(cx - 3, gy - 18, 4, 3, VB.light);
  P(VB.dark, cx - 8, gy - 10, 16, 1);
  P(VB.rust, cx + 4, gy - 13, 3, 2); P(VB.rustD, cx + 5, gy - 12, 1, 1);
  P('#e8e8d8', cx - 3, gy - 13, 6, 4); P('#3a3a3a', cx - 2, gy - 12, 4, 1); // targa
  P('#d03030', cx - 2, gy - 19, 4, 2);
  P(VB.seat, cx - 5, gy - 24, 10, 3);
  if (occ) { P(G.jeans, cx - 7, gy - 26, 14, 5); P(G.shoe, cx - 9, gy - 14, 3, 3); P(G.shoe, cx + 6, gy - 14, 3, 3); }
  P(VB.base, cx - 9, gy - 35, 18, 2);
  P('#222', cx - 13, gy - 35, 4, 2); P('#222', cx + 9, gy - 35, 4, 2);
  if (occ) riderBack(d, cx, gy - 46, { arms: 12, armY: gy - 34 });
  P(VB.chrome, cx - 10, gy - 40, 1, 5); P(VB.chrome, cx - 11, gy - 41, 3, 2);
  return outline(d.c);
}

// ---------- Fiat Punto bianca ----------
const PB = { base: '#ecebe4', light: '#ffffff', dark: '#b8b8b0', darker: '#8c8c86', glass: '#7fa8c0', glassL: '#b8d6e6', rust: '#a0643a', rustD: '#6e4022', black: '#2a2a2e', lamp: '#fff4c0', tail: '#d03030' };

function puntoSide(occ) {
  const d = pen(86, 42); const { P, ellipse } = d; const gy = 41;
  // fiancata
  P(PB.base, 3, gy - 24, 80, 15);
  ellipse(80, gy - 15, 4, 6, PB.base);
  P(PB.dark, 3, gy - 12, 80, 3); P(PB.light, 4, gy - 23, 74, 1);
  // cofano inclinato e lunotto
  for (let i = 0; i < 6; i++) P(PB.base, 62 + i * 3, gy - 26 + i, 22 - i * 3, 2);
  // abitacolo: tetto, montanti, vetri
  P(PB.base, 14, gy - 37, 42, 3);
  for (let i = 0; i < 12; i++) { P(PB.base, 55 + i, gy - 35 + i, 3, 1); P(PB.base, 13 - Math.floor(i * 0.7), gy - 35 + i, 5, 1); }
  P(PB.glass, 17, gy - 34, 18, 10); for (let i = 0; i < 10; i++) P(PB.glass, 17 - Math.floor(i * 0.7), gy - 34 + i, 1, 1); P(PB.glass, 39, gy - 34, 15, 10);
  for (let i = 0; i < 10; i++) P(PB.glass, 54, gy - 34 + i, 1 + i, 1);
  P(PB.glassL, 18, gy - 33, 6, 1); P(PB.glassL, 41, gy - 33, 4, 1);
  P(PB.base, 35, gy - 34, 4, 10); // montante B
  if (occ) { // Garonio al volante
    P(G.hair, 43, gy - 34, 8, 3); P(G.skin, 44, gy - 31, 7, 6); P(G.hair, 43, gy - 32, 2, 4);
    P(INK, 49, gy - 30); P(G.must, 48, gy - 28, 4, 1); P(G.shirt, 42, gy - 25, 10, 1);
    P('#333', 53, gy - 29, 1, 4); // volante
  }
  // portiera, maniglia, linea
  P(PB.darker, 38, gy - 24, 1, 13); P(PB.darker, 59, gy - 24, 1, 12); P(PB.black, 52, gy - 21, 4, 1);
  // paraurti, fari
  P(PB.black, 1, gy - 14, 7, 4); P(PB.black, 79, gy - 14, 6, 4); P(PB.black, 8, gy - 11, 71, 2);
  P(PB.lamp, 80, gy - 22, 3, 4); P(PB.tail, 3, gy - 24, 3, 6); P('#f0a020', 3, gy - 18, 3, 1);
  // passaruota e ruote
  ellipse(19, gy - 9, 9, 8, '#3a3a3e'); ellipse(67, gy - 9, 9, 8, '#3a3a3e');
  P(PB.base, 8, gy - 9, 80, 0);
  wheel(d, 19, gy - 7, 7, '#a0a0a6', false); wheel(d, 67, gy - 7, 7);
  // ruggine e ammaccature: è scassata
  P(PB.rust, 28, gy - 12, 5, 2); P(PB.rustD, 30, gy - 11, 2, 1); P(PB.rust, 75, gy - 16, 3, 2);
  P(PB.rust, 9, gy - 13, 2, 2); P(PB.dark, 46, gy - 20, 5, 2); P(PB.darker, 47, gy - 19, 3, 1);
  P(PB.dark, 22, gy - 37, 6, 1); // tetto rigato
  P('#333', 56, gy - 32, 2, 2); // specchietto
  return outline(d.c);
}

function puntoFront(occ) {
  const d = pen(48, 42); const { P } = d; const cx = 24, gy = 41;
  P(PB.black, 3, gy - 9, 7, 9); P(PB.black, 38, gy - 9, 7, 9); // gomme
  P(PB.base, 2, gy - 26, 44, 17); P(PB.dark, 2, gy - 12, 44, 3); P(PB.light, 3, gy - 25, 42, 1);
  // parabrezza e tetto
  P(PB.base, 8, gy - 39, 32, 3);
  for (let i = 0; i < 13; i++) P(PB.base, 7 - Math.floor(i / 5), gy - 37 + i, 34 + Math.floor(i / 5) * 2, 1);
  P(PB.glass, 9, gy - 36, 30, 10); P(PB.glassL, 11, gy - 35, 8, 1); P(PB.glassL, 12, gy - 34, 4, 1);
  if (occ) { // guida a sinistra: dal davanti lo vediamo a destra
    P(G.hair, 27, gy - 36, 8, 3); P(G.skin, 28, gy - 34, 6, 6); P(INK, 29, gy - 32); P(INK, 32, gy - 32); P(G.must, 29, gy - 30, 4, 1); P(G.shirt, 26, gy - 28, 10, 2);
    P('#333', 27, gy - 28, 8, 1);
  }
  P('#555', 22, gy - 34, 1, 6); // tergicristallo
  // fari, griglia, logo
  P(PB.lamp, 4, gy - 22, 9, 4); P(PB.lamp, 35, gy - 22, 9, 4); P('#d8c070', 4, gy - 19, 9, 1);
  P(PB.black, 16, gy - 21, 16, 3); P('#5070c0', 23, gy - 21, 2, 2);
  P(PB.black, 1, gy - 14, 46, 4); P('#e8e8d8', 18, gy - 13, 12, 3); P('#2a3a8a', 18, gy - 13, 1, 3);
  P(PB.rust, 6, gy - 15, 3, 1); P(PB.rust, 40, gy - 24, 2, 2); P(PB.dark, 14, gy - 25, 4, 1);
  P('#333', 0, gy - 30, 3, 2); P('#333', 45, gy - 30, 3, 2); // specchietti
  return outline(d.c);
}

function puntoBack(occ) {
  const d = pen(48, 42); const { P } = d; const cx = 24, gy = 41;
  P(PB.black, 3, gy - 9, 7, 9); P(PB.black, 38, gy - 9, 7, 9);
  P(PB.base, 2, gy - 27, 44, 18); P(PB.dark, 2, gy - 12, 44, 3);
  P(PB.base, 7, gy - 39, 34, 13);
  P(PB.glass, 9, gy - 37, 30, 10); P(PB.glassL, 11, gy - 36, 6, 1);
  if (occ) { P(G.hair, 13, gy - 36, 9, 7); P(G.skin, 13, gy - 29, 9, 2); }
  P('#555', 23, gy - 29, 1, 2); // tergilunotto
  // fanali verticali tipici
  P(PB.tail, 2, gy - 30, 4, 12); P('#f0a020', 2, gy - 22, 4, 2); P(PB.tail, 42, gy - 30, 4, 12); P('#f0a020', 42, gy - 22, 4, 2);
  P('#e8e8d8', 17, gy - 20, 14, 4); P('#2a3a8a', 17, gy - 20, 1, 4); P('#3a3a3a', 19, gy - 19, 10, 1);
  P(PB.black, 1, gy - 14, 46, 4);
  P('#555', 36, gy - 9, 3, 2); // marmitta
  P(PB.rust, 8, gy - 16, 4, 2); P(PB.rust, 33, gy - 25, 3, 2); P(PB.darker, 26, gy - 24, 5, 2); // botta sul portellone
  return outline(d.c);
}

// ---------- Trattore ----------
const TR = {
  rosso: { base: '#c83a2a', light: '#e86048', dark: '#8a2418' },
  verde: { base: '#3f8a3a', light: '#62b050', dark: '#285c26' },
};

function tractorSide(occ, col) {
  const C = TR[col]; const d = pen(76, 62); const { P, ellipse } = d; const gy = 61;
  // telaio
  P('#3a3a40', 14, gy - 20, 52, 6);
  // cofano motore
  P(C.base, 32, gy - 32, 36, 13); P(C.light, 33, gy - 32, 33, 2); P(C.dark, 32, gy - 21, 36, 2);
  for (let i = 0; i < 4; i++) P(C.dark, 42 + i * 5, gy - 28, 3, 1); // feritoie
  P('#2a2a2e', 66, gy - 31, 4, 13); for (let i = 0; i < 5; i++) P('#5a5a60', 66, gy - 30 + i * 2, 4, 1); // griglia
  P('#fff4c0', 68, gy - 34, 3, 2);
  // marmitta verticale
  P('#2a2a2e', 54, gy - 46, 3, 14); P('#4a4a50', 53, gy - 47, 5, 2);
  // cabina
  P('#2a2a2e', 8, gy - 58, 2, 28); P('#2a2a2e', 32, gy - 58, 2, 26);
  P(C.base, 6, gy - 60, 30, 3); P(C.light, 6, gy - 60, 30, 1); P('#f0f0e8', 8, gy - 57, 26, 1);
  P('#a8d0e0', 10, gy - 56, 22, 22); P('#cfe6f0', 12, gy - 54, 4, 1); P('#cfe6f0', 12, gy - 53, 2, 1);
  P(C.dark, 10, gy - 34, 24, 4);
  if (occ) {
    const hx = 17, hy = gy - 52;
    P(G.shirt, hx - 2, hy + 9, 10, 9);
    P(G.skin, hx, hy + 1, 8, 8); P(G.hair, hx - 1, hy - 1, 9, 3); P(G.hair, hx - 1, hy + 1, 2, 4);
    P(INK, hx + 6, hy + 4); P(G.must, hx + 5, hy + 6, 3, 1); P(G.skin, hx + 8, hy + 4, 1, 2);
    P('#333', hx + 9, hy + 10, 4, 1); P(G.skin, hx + 7, hy + 10, 2, 2); // volante e mano
  }
  // parafango e ruote
  P(C.base, 3, gy - 30, 34, 4); P(C.dark, 3, gy - 27, 34, 1);
  wheel(d, 20, gy - 14, 14, '#c8b020'); // ruote gialle come i trattori veri
  for (let a = 0; a < 12; a++) { const t = a / 12 * Math.PI * 2; P('#18181a', 20 + Math.cos(t) * 14, gy - 14 + Math.sin(t) * 14, 2, 2); } // tasselli
  wheel(d, 60, gy - 8, 8, '#c8b020');
  // ruggine e fango
  P(C.dark, 46, gy - 24, 6, 2); P('#6e4a2a', 4, gy - 27, 6, 1); P('#6e4a2a', 30, gy - 28, 4, 2); P('#8a6a40', 44, gy - 21, 8, 1);
  P('#3a3a40', 0, gy - 16, 8, 3); // gancio
  return outline(d.c);
}

function tractorFront(occ, col) {
  const C = TR[col]; const d = pen(52, 62); const { P } = d; const cx = 26, gy = 61;
  // ruote posteriori grandi ai lati
  P('#26262a', 0, gy - 28, 9, 28); P('#26262a', 43, gy - 28, 9, 28);
  for (let i = 0; i < 7; i++) { P('#18181a', 0, gy - 27 + i * 4, 9, 1); P('#18181a', 43, gy - 27 + i * 4, 9, 1); }
  P(C.base, 0, gy - 31, 12, 3); P(C.base, 40, gy - 31, 12, 3);
  // cabina
  P('#2a2a2e', 9, gy - 58, 2, 30); P('#2a2a2e', 41, gy - 58, 2, 30);
  P(C.base, 7, gy - 60, 38, 3); P('#f0f0e8', 9, gy - 57, 34, 1);
  P('#a8d0e0', 11, gy - 56, 30, 25); P('#cfe6f0', 13, gy - 54, 5, 1);
  if (occ) riderFront(d, cx, gy - 52, { arms: 9, armY: gy - 38 });
  // cofano stretto e griglia
  P(C.base, 17, gy - 34, 18, 20); P(C.light, 17, gy - 34, 18, 2); P(C.dark, 33, gy - 32, 2, 18);
  P('#2a2a2e', 19, gy - 30, 14, 12); for (let i = 0; i < 6; i++) P('#5a5a60', 19, gy - 29 + i * 2, 14, 1);
  P('#fff4c0', 18, gy - 34, 3, 2); P('#fff4c0', 31, gy - 34, 3, 2);
  P('#2a2a2e', 36, gy - 50, 2, 18); // marmitta
  // ruote anteriori
  P('#26262a', 11, gy - 14, 6, 14); P('#26262a', 35, gy - 14, 6, 14); P('#c8b020', 12, gy - 9, 1, 3); P('#c8b020', 39, gy - 9, 1, 3);
  P('#3a3a40', 17, gy - 12, 18, 3);
  P('#6e4a2a', 20, gy - 18, 5, 1); P(C.dark, 28, gy - 25, 3, 2);
  return outline(d.c);
}

function tractorBack(occ, col) {
  const C = TR[col]; const d = pen(52, 62); const { P } = d; const cx = 26, gy = 61;
  P('#26262a', 0, gy - 30, 11, 30); P('#26262a', 41, gy - 30, 11, 30);
  for (let i = 0; i < 7; i++) { P('#18181a', 0, gy - 29 + i * 4, 11, 1); P('#18181a', 41, gy - 29 + i * 4, 11, 1); }
  P(C.base, 0, gy - 33, 15, 4); P(C.base, 37, gy - 33, 15, 4); P(C.dark, 0, gy - 30, 15, 1); P(C.dark, 37, gy - 30, 15, 1);
  P('#2a2a2e', 9, gy - 58, 2, 30); P('#2a2a2e', 41, gy - 58, 2, 30);
  P(C.base, 7, gy - 60, 38, 3); P('#f0f0e8', 9, gy - 57, 34, 1);
  P('#a8d0e0', 11, gy - 56, 30, 24); P('#cfe6f0', 34, gy - 54, 4, 1);
  if (occ) riderBack(d, cx, gy - 52);
  P(C.base, 13, gy - 32, 26, 12); P(C.dark, 13, gy - 22, 26, 2);
  P('#d03030', 14, gy - 31, 3, 3); P('#d03030', 35, gy - 31, 3, 3);
  // attacco a tre punti e presa di forza
  P('#3a3a40', 17, gy - 18, 18, 4); P('#3a3a40', 18, gy - 14, 3, 8); P('#3a3a40', 31, gy - 14, 3, 8); P('#5a5a60', 24, gy - 16, 4, 6);
  P('#2a2a2e', 36, gy - 50, 2, 18);
  P('#6e4a2a', 2, gy - 32, 7, 1); P('#6e4a2a', 40, gy - 31, 5, 1);
  return outline(d.c);
}

// ---------- Fumo ----------
export function smokePuff(dark = false) {
  const d = pen(12, 12);
  const c1 = dark ? '#4a4a50' : '#d8d8dc', c2 = dark ? '#2e2e34' : '#b8b8c0';
  d.disc(6, 6, 5, c1); d.disc(4, 4, 2, dark ? '#6a6a70' : '#f0f0f2'); d.P(c2, 7, 8, 3, 2);
  return d.c;
}

// views: R (verso destra), L, F (verso la camera), B (di spalle). Ognuna [vuoto, con Garonio].
export function vehicleArt(kind, color) {
  const make = {
    vespa: [vespaSide, vespaFront, vespaBack],
    punto: [puntoSide, puntoFront, puntoBack],
    trattore: [o => tractorSide(o, color), o => tractorFront(o, color), o => tractorBack(o, color)],
  }[kind];
  const [side, front, back] = make;
  const R = [side(false), side(true)];
  return { R, L: R.map(mirror), F: [front(false), front(true)], B: [back(false), back(true)] };
}
