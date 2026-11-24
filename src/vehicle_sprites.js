// Mezzi: Vespa carta da zucchero, Punto bianca e trattori, tutti un po' scassati (corpi in src/hd/mezzi.js).
// Ogni mezzo ha tre viste (lato verso destra, davanti, dietro), vuoto o con Garonio alla guida.
// Scala: 20 pixel = 1 casella, come gli sprite di Garonio.
import { makeCanvas, mirror, garonioFrames, GARONIO_ANIM } from './pixel.js';
import * as HDM from './hd/mezzi.js';

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

// ---------- Mezzi HD (src/hd/mezzi.js) con Garonio alla guida ----------
// I corpi dei mezzi sono disegnati in src/hd/mezzi.js; qui si aggiunge Garonio seduto.
const TRC = { rosso: '#c83a2e', verde: '#3e8a3a', giallo: '#e8b820', blu: '#2a5aa8', arancio: '#e07028' };
// finestrini dei trattori (per i piloti delle gare, src/gare.js): [x, y, w, h]
export const TRACTOR_WIN = { R: [10, 7, 25, 27], F: [11, 7, 34, 26], B: [11, 7, 34, 24] };
function base(body, w, h, ox, oy) { const d = pen(w, h); d.g.drawImage(body, ox, oy); return d; }
const top = seatY => seatY - Math.round(garonioBust().h * WAIST);

// Vespa: corpo 44x36, tela 48x60 (spazio sopra per Garonio)
function vespaSide(occ) {
  const d = base(HDM.vespaLato(), 48, 60, 2, 24);
  if (occ) {
    const seat = 24 + 14;
    const h = drawGaronio(d, 14, top(seat));
    sideLegsArm(d, 15, seat, 19, seat - h + 25, 29, 24 + 4);
  }
  return d.c;
}
function vespaFront(occ) {
  const body = HDM.vespaDavanti();
  const d = pen(30, 60), cx = 15;
  if (occ) drawGaronio(d, cx, top(59 - 22));
  d.g.drawImage(body, 4, 24);
  if (occ) {
    const { P } = d;
    P(G.jeans, cx - 10, 59 - 25, 4, 11); P(G.jeans, cx + 6, 59 - 25, 4, 11); P(G.shoe, cx - 11, 59 - 14, 5, 2); P(G.shoe, cx + 6, 59 - 14, 5, 2);
    P(G.skin, cx - 11, 27, 3, 2); P(G.skin, cx + 8, 27, 3, 2);
  }
  return d.c;
}
function vespaBack(occ) {
  const d = base(HDM.vespaDietro(), 30, 60, 4, 24), cx = 15;
  if (occ) {
    const { P } = d;
    P(G.jeans, cx - 6, 59 - 25, 12, 5); P(G.shoe, cx - 9, 59 - 14, 3, 3); P(G.shoe, cx + 6, 59 - 14, 3, 3);
    bigBack(d, cx, 59 - 56, { arms: 14, armY: 30 });
  }
  return d.c;
}

// Punto: lato 90x45, davanti/dietro 50x42 (Garonio dal finestrino, guida a sinistra)
function puntoSide(occ) {
  const d = base(HDM.puntoLato(), 90, 45, 0, 0);
  if (occ) drawGaronio(d, 46, 6, { clip: [34, 9, 24, 12] });
  return d.c;
}
function puntoFront(occ) {
  const d = base(HDM.puntoDavanti(), 50, 42, 0, 0);
  if (occ) drawGaronio(d, 31, 4, { clip: [13, 8, 26, 11] });
  return d.c;
}
function puntoBack(occ) {
  const d = base(HDM.puntoDietro(), 50, 42, 0, 0);
  if (occ) clipped(d, [10, 8, 30, 10], () => bigBack(d, 19, 6));
  return d.c;
}

// Trattori: lato 76x68, davanti/dietro 56x68
function tractorSide(occ, col) {
  const d = base(HDM.trattoreLato(TRC[col] || col), 76, 68, 0, 0);
  if (occ) drawGaronio(d, 21, 9, { clip: TRACTOR_WIN.R });
  return d.c;
}
function tractorFront(occ, col) {
  const d = base(HDM.trattoreDavanti(TRC[col] || col), 56, 68, 0, 0);
  if (occ) { drawGaronio(d, 28, 9, { clip: TRACTOR_WIN.F }); d.P('#2a2a30', 20, 24, 16, 3); }
  return d.c;
}
function tractorBack(occ, col) {
  const d = base(HDM.trattoreDietro(TRC[col] || col), 56, 68, 0, 0);
  if (occ) clipped(d, TRACTOR_WIN.B, () => bigBack(d, 28, 8));
  return d.c;
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
