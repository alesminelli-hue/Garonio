// Pixel art dei mezzi: Vespa carta da zucchero, Punto bianca e trattori, tutti un po' scassati.
// Ogni mezzo ha tre viste (lato verso destra, davanti, dietro), vuoto o con Garonio alla guida.
// Scala: 20 pixel = 1 casella, come gli sprite di Garonio.
import { makeCanvas, mirror, garonioFrames, GARONIO_ANIM } from './pixel.js';

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

// ---------- Garonio vero (dal suo foglio sprite) ----------
let BUST = null;
function garonioBust() {
  if (BUST) return BUST;
  const f = garonioFrames().frames[GARONIO_ANIM.idle[0]];
  const dat = f.getContext('2d').getImageData(0, 0, f.width, f.height).data;
  let x0 = f.width, y0 = f.height, x1 = 0, y1 = 0;
  for (let y = 0; y < f.height; y++) for (let x = 0; x < f.width; x++) if (dat[(y * f.width + x) * 4 + 3] > 0) {
    x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
  }
  return (BUST = { c: f, x0, y0, w: x1 - x0 + 1, h: y1 - y0 + 1 });
}
const WAIST = 0.78; // fino a dove si vede quando è seduto (frazione dell'altezza)

// Disegna lo sprite di Garonio (fermo) centrato in cx, con la cima dei capelli a top.
// clip = [x, y, w, h] per farlo vedere solo dal finestrino; rows = quante righe (seduto).
function drawGaronio(d, cx, top, { clip, seated = true } = {}) {
  const B = garonioBust(), g = d.g;
  const h = seated ? Math.round(B.h * WAIST) : B.h;
  g.save();
  if (clip) { g.beginPath(); g.rect(...clip); g.clip(); }
  g.drawImage(B.c, B.x0, B.y0, B.w, h, Math.round(cx - B.w / 2), top, B.w, h);
  g.restore();
  return h;
}
function clipped(d, rect, fn) { d.g.save(); d.g.beginPath(); d.g.rect(...rect); d.g.clip(); fn(); d.g.restore(); }

// Garonio visto da dietro, alla stessa scala del suo sprite
function bigBack(d, cx, top, { arms = 0, armY = 0 } = {}) {
  const { P, ellipse } = d;
  P(G.shirt, cx - 10, top + 19, 20, 14); P(G.shirtD, cx - 10, top + 19, 3, 14);
  if (arms) { P(G.shirt, cx - arms, armY - 1, arms - 8, 3); P(G.shirt, cx + 8, armY - 1, arms - 8, 3); P(G.skin, cx - arms, armY - 1, 2, 3); P(G.skin, cx + arms - 2, armY - 1, 2, 3); }
  else { P(G.shirt, cx - 13, top + 20, 4, 8); P(G.shirt, cx + 9, top + 20, 4, 8); P(G.skin, cx - 13, top + 28, 4, 3); P(G.skin, cx + 9, top + 28, 4, 3); }
  P(G.skin, cx - 4, top + 16, 8, 4);
  P(G.skin, cx - 10, top + 9, 2, 5); P(G.skin, cx + 8, top + 9, 2, 5);
  ellipse(cx, top + 9, 8, 8, G.hair);
  P('#6a4430', cx - 4, top + 3, 5, 2); P('#6a4430', cx + 2, top + 7, 3, 1);
  P(G.hair, cx - 3, top - 1, 3, 2); P(G.hair, cx + 1, top - 2, 2, 2);
}

// gambe e braccio quando è seduto di lato sulla Vespa
function sideLegsArm(d, x, y, armX, armY, reachX, reachY) {
  const { P } = d;
  P(G.jeans, x, y - 4, 10, 5); P(G.jeansD, x, y, 10, 1);
  P(G.jeans, x + 8, y, 4, 8); P(G.shoe, x + 8, y + 7, 6, 2);
  const len = reachX - armX;
  for (let i = 0; i <= len; i++) P(i > len - 3 ? G.skin : G.shirt, armX + i, armY + Math.round((reachY - armY) * i / Math.max(1, len)), 1, 3);
}

// ---------- Vespa blu carta da zucchero ----------
const VB = { base: '#9cc3dd', light: '#c6deee', dark: '#6990ad', rust: '#9a5a32', rustD: '#6e3c20', seat: '#3a2a22', chrome: '#c8ccd0', lamp: '#fff4b0' };

function vespaSide(occ) {
  const d = pen(48, 60); const { P, ellipse } = d;
  const gy = 59;
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
  if (occ) {
    const h = drawGaronio(d, 12, gy - 21 - Math.round(garonioBust().h * WAIST));
    sideLegsArm(d, 13, gy - 21, 17, gy - 21 - h + 25, 30, gy - 36);
  }
  return outline(d.c);
}

function vespaFront(occ) {
  const d = pen(30, 60); const { P, ellipse } = d; const cx = 15, gy = 59;
  if (occ) drawGaronio(d, cx, gy - 23 - Math.round(garonioBust().h * WAIST));
  P('#26262a', cx - 2, gy - 9, 4, 9); P('#404046', cx - 2, gy - 9, 1, 9);
  ellipse(cx, gy - 10, 4, 2, VB.base);
  // scudo
  P(VB.base, cx - 6, gy - 34, 12, 24); P(VB.base, cx - 7, gy - 22, 14, 12); P(VB.light, cx - 6, gy - 34, 12, 2); P(VB.dark, cx + 4, gy - 32, 2, 22);
  P('#2a2a30', cx - 2, gy - 26, 4, 5); for (let i = 0; i < 3; i++) P(VB.dark, cx - 2, gy - 25 + i * 2, 4, 1); // grata clacson
  P(VB.rust, cx - 5, gy - 14, 3, 2); P(VB.rust, cx + 3, gy - 21, 2, 1);
  // pedana ai lati con gambe
  if (occ) { P(G.jeans, cx - 10, gy - 25, 4, 12); P(G.jeans, cx + 6, gy - 25, 4, 12); P(G.shoe, cx - 11, gy - 14, 5, 2); P(G.shoe, cx + 6, gy - 14, 5, 2); }
  // manubrio e faro
  P(VB.base, cx - 9, gy - 35, 18, 3); P(VB.light, cx - 8, gy - 35, 16, 1);
  P('#222', cx - 13, gy - 35, 4, 2); P('#222', cx + 9, gy - 35, 4, 2);
  if (occ) { P(G.skin, cx - 13, gy - 36, 3, 2); P(G.skin, cx + 10, gy - 36, 3, 2); }
  d.disc(cx, gy - 32, 2, VB.chrome); P(VB.lamp, cx - 1, gy - 33, 2, 2);
  P(VB.chrome, cx - 10, gy - 40, 1, 5); P(VB.chrome, cx - 11, gy - 41, 3, 2); // specchietto
  return outline(d.c);
}

function vespaBack(occ) {
  const d = pen(30, 60); const { P, ellipse } = d; const cx = 15, gy = 59;
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
  if (occ) bigBack(d, cx, gy - 56, { arms: 15, armY: gy - 35 });
  P(VB.chrome, cx - 10, gy - 40, 1, 5); P(VB.chrome, cx - 11, gy - 41, 3, 2);
  return outline(d.c);
}

// ---------- Fiat Punto bianca ----------
const PB = { base: '#ecebe4', light: '#ffffff', dark: '#b8b8b0', darker: '#8c8c86', glass: '#7fa8c0', glassL: '#b8d6e6', rust: '#a0643a', rustD: '#6e4022', black: '#2a2a2e', lamp: '#fff4c0', tail: '#d03030' };

function puntoSide(occ) {
  const d = pen(86, 48); const { P, ellipse } = d; const gy = 47;
  // fiancata
  P(PB.base, 3, gy - 24, 80, 15);
  ellipse(80, gy - 15, 4, 6, PB.base);
  P(PB.dark, 3, gy - 12, 80, 3); P(PB.light, 4, gy - 23, 74, 1);
  // cofano inclinato e lunotto
  for (let i = 0; i < 6; i++) P(PB.base, 62 + i * 3, gy - 26 + i, 22 - i * 3, 2);
  // abitacolo: vetri, Garonio al volante, poi tetto e montanti sopra
  P(PB.glass, 17, gy - 40, 18, 16); for (let i = 0; i < 16; i++) P(PB.glass, 17 - Math.floor(i * 0.5), gy - 40 + i, 1, 1);
  P(PB.glass, 39, gy - 40, 16, 16); for (let i = 0; i < 16; i++) P(PB.glass, 55, gy - 40 + i, 1 + Math.floor(i * 0.65), 1);
  P(PB.glassL, 18, gy - 39, 6, 1); P(PB.glassL, 19, gy - 38, 3, 1);
  if (occ) {
    drawGaronio(d, 48, gy - 43, { clip: [39, gy - 40, 26, 16] });
    P('#333', 58, gy - 31, 1, 6); // volante
  }
  P(PB.base, 14, gy - 43, 42, 3);
  for (let i = 0; i < 18; i++) { P(PB.base, 55 + Math.floor(i * 0.65), gy - 41 + i, 3, 1); P(PB.base, 13 - Math.floor(i * 0.5), gy - 41 + i, 5, 1); }
  P(PB.base, 35, gy - 40, 4, 16); // montante B
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
  P(PB.dark, 22, gy - 43, 6, 1); // tetto rigato
  P('#333', 58, gy - 33, 2, 2); // specchietto
  return outline(d.c);
}

function puntoFront(occ) {
  const d = pen(48, 48); const { P } = d; const cx = 24, gy = 47;
  P(PB.black, 3, gy - 9, 7, 9); P(PB.black, 38, gy - 9, 7, 9); // gomme
  P(PB.base, 2, gy - 26, 44, 17); P(PB.dark, 2, gy - 12, 44, 3); P(PB.light, 3, gy - 25, 42, 1);
  // parabrezza e tetto
  P(PB.base, 8, gy - 45, 32, 3);
  for (let i = 0; i < 19; i++) P(PB.base, 7 - Math.floor(i / 6), gy - 43 + i, 34 + Math.floor(i / 6) * 2, 1);
  P(PB.glass, 9, gy - 42, 30, 16);
  if (occ) { // guida a sinistra: dal davanti lo vediamo a destra
    drawGaronio(d, 30, gy - 44, { clip: [9, gy - 42, 30, 16] });
    P('#333', 24, gy - 28, 12, 1);
  }
  P(PB.glassL, 11, gy - 41, 8, 1); P(PB.glassL, 12, gy - 40, 4, 1);
  P('#555', 22, gy - 33, 1, 6); // tergicristallo
  // fari, griglia, logo
  P(PB.lamp, 4, gy - 22, 9, 4); P(PB.lamp, 35, gy - 22, 9, 4); P('#d8c070', 4, gy - 19, 9, 1);
  P(PB.black, 16, gy - 21, 16, 3); P('#5070c0', 23, gy - 21, 2, 2);
  P(PB.black, 1, gy - 14, 46, 4); P('#e8e8d8', 18, gy - 13, 12, 3); P('#2a3a8a', 18, gy - 13, 1, 3);
  P(PB.rust, 6, gy - 15, 3, 1); P(PB.rust, 40, gy - 24, 2, 2); P(PB.dark, 14, gy - 25, 4, 1);
  P('#333', 0, gy - 30, 3, 2); P('#333', 45, gy - 30, 3, 2); // specchietti
  return outline(d.c);
}

function puntoBack(occ) {
  const d = pen(48, 48); const { P } = d; const cx = 24, gy = 47;
  P(PB.black, 3, gy - 9, 7, 9); P(PB.black, 38, gy - 9, 7, 9);
  P(PB.base, 2, gy - 27, 44, 18); P(PB.dark, 2, gy - 12, 44, 3);
  P(PB.base, 7, gy - 45, 34, 19);
  P(PB.glass, 9, gy - 43, 30, 16); P(PB.glassL, 31, gy - 42, 6, 1);
  if (occ) clipped(d, [9, gy - 43, 30, 16], () => bigBack(d, 18, gy - 44));
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
  const C = TR[col]; const d = pen(76, 68); const { P, ellipse } = d; const gy = 67;
  // telaio
  P('#3a3a40', 14, gy - 20, 52, 6);
  // cofano motore
  P(C.base, 32, gy - 32, 36, 13); P(C.light, 33, gy - 32, 33, 2); P(C.dark, 32, gy - 21, 36, 2);
  for (let i = 0; i < 4; i++) P(C.dark, 42 + i * 5, gy - 28, 3, 1); // feritoie
  P('#2a2a2e', 66, gy - 31, 4, 13); for (let i = 0; i < 5; i++) P('#5a5a60', 66, gy - 30 + i * 2, 4, 1); // griglia
  P('#fff4c0', 68, gy - 34, 3, 2);
  // marmitta verticale
  P('#2a2a2e', 54, gy - 46, 3, 14); P('#4a4a50', 53, gy - 47, 5, 2);
  // cabina (alta, così Garonio si vede bene)
  P('#2a2a2e', 8, gy - 64, 2, 34); P('#2a2a2e', 32, gy - 64, 2, 32);
  P(C.base, 6, gy - 66, 30, 3); P(C.light, 6, gy - 66, 30, 1); P('#f0f0e8', 8, gy - 63, 26, 1);
  P('#a8d0e0', 10, gy - 62, 22, 28); P('#cfe6f0', 12, gy - 60, 4, 1); P('#cfe6f0', 12, gy - 59, 2, 1);
  if (occ) {
    drawGaronio(d, 20, gy - 60, { clip: [10, gy - 62, 22, 28] });
    P('#333', 27, gy - 38, 5, 1); P('#333', 29, gy - 37, 1, 3); // volante
  }
  P(C.dark, 10, gy - 34, 24, 4);
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
  const C = TR[col]; const d = pen(52, 68); const { P } = d; const cx = 26, gy = 67;
  // ruote posteriori grandi ai lati
  P('#26262a', 0, gy - 28, 9, 28); P('#26262a', 43, gy - 28, 9, 28);
  for (let i = 0; i < 7; i++) { P('#18181a', 0, gy - 27 + i * 4, 9, 1); P('#18181a', 43, gy - 27 + i * 4, 9, 1); }
  P(C.base, 0, gy - 31, 12, 3); P(C.base, 40, gy - 31, 12, 3);
  // cabina
  P('#2a2a2e', 9, gy - 64, 2, 36); P('#2a2a2e', 41, gy - 64, 2, 36);
  P(C.base, 7, gy - 66, 38, 3); P('#f0f0e8', 9, gy - 63, 34, 1);
  P('#a8d0e0', 11, gy - 62, 30, 31); P('#cfe6f0', 13, gy - 60, 5, 1);
  if (occ) { drawGaronio(d, cx, gy - 60, { clip: [11, gy - 62, 30, 31] }); P('#333', cx - 6, gy - 35, 12, 2); }
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
  const C = TR[col]; const d = pen(52, 68); const { P } = d; const cx = 26, gy = 67;
  P('#26262a', 0, gy - 30, 11, 30); P('#26262a', 41, gy - 30, 11, 30);
  for (let i = 0; i < 7; i++) { P('#18181a', 0, gy - 29 + i * 4, 11, 1); P('#18181a', 41, gy - 29 + i * 4, 11, 1); }
  P(C.base, 0, gy - 33, 15, 4); P(C.base, 37, gy - 33, 15, 4); P(C.dark, 0, gy - 30, 15, 1); P(C.dark, 37, gy - 30, 15, 1);
  P('#2a2a2e', 9, gy - 64, 2, 36); P('#2a2a2e', 41, gy - 64, 2, 36);
  P(C.base, 7, gy - 66, 38, 3); P('#f0f0e8', 9, gy - 63, 34, 1);
  P('#a8d0e0', 11, gy - 62, 30, 30); P('#cfe6f0', 34, gy - 60, 4, 1);
  if (occ) clipped(d, [11, gy - 62, 30, 30], () => bigBack(d, cx, gy - 59));
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
