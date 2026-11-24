// Nutrie HD: la nutria del campo, la Mamma Nutria, la nutria corazzata e il Re delle Nutrie.
// Stesso stile dei mezzi e degli oggetti HD (contorno scuro, luce da in alto a sinistra).
// Tutte rivolte a DESTRA, due fotogrammi (f = 0 / 1): il combattimento le specchia verso Garonio.
// Risoluzione doppia rispetto ai vecchi sprite (32 px = 1 casella): chi le mette in mappa
// fissa la misura in caselle (game.js, ENEMIES.mappa), lo scontro usa solo l'altezza.
import { pen, ramp, outline, hash, rng, INK } from './kit.js';

const PELO = '#7a5434', MUSO = '#c8ac88', DENTI = ramp('#f08a1c'), CODA = ramp('#4e4038');
const FANGO = ramp('#7a6a44'), CANNA = ramp('#5a9a3a'), ACQUA = '#6ab4e8';

// pelo con grana: palla ombreggiata più qualche ciuffo scuro e chiaro
function pelo(d, cx, cy, rx, ry, R, seed, grain = 0.25) {
  d.ball(cx, cy, rx, ry, R, { seed, grain });
  const r = rng(seed * 13 + 7);
  for (let i = 0; i < rx * ry * 0.07; i++) {
    const a = r() * Math.PI * 2, k = 0.35 + Math.sqrt(r()) * 0.5;
    const x = cx + Math.cos(a) * rx * k, y = cy + Math.sin(a) * ry * k;
    const top = y < cy - ry * 0.1;
    d.P(top ? R[3] : R[1], x, y, 2, 1); d.P(top ? R[2] : R[0], x + 1, y + 1);   // ciuffo pettinato all'indietro
  }
}

// coda squamosa da topo, ondeggia col fotogramma
function coda(d, x0, y0, len, f, spess = 2, alza = 0) {
  for (let i = 0; i <= len; i++) {
    const t = i / len, x = x0 - i;
    const y = y0 + Math.round(Math.sin(t * 3.2 + f * 1.6) * (1.5 + t * 1.5)) + Math.round(t * t * alza);
    const w = Math.max(1, Math.round(spess * (1 - t * 0.6)));
    d.P(CODA[2], x, y, 1, w);
    d.P(CODA[3], x, y, 1, 1);
    if (i % 3 === 0) d.P(CODA[1], x, y + w - 1, 1, 1); // squame
  }
}

// muso chiaro, naso, baffi bianchi e i famosi denti arancioni
function testa(d, hx, hy, s, R, { cicatrice = false, arrabbiata = false } = {}) {
  const u = v => Math.max(1, Math.round(v * s));
  d.ball(hx - 2.5 * s, hy - 4.2 * s, 2 * s, 1.8 * s, R);            // orecchio
  d.P(R[0], hx - 2.5 * s, hy - 4 * s, u(1), u(1));
  pelo(d, hx, hy, 6.5 * s, 5.2 * s, R, 3);
  d.line(hx - 6 * s, hy - 2 * s, hx - 5 * s, hy + 4 * s, R[1], u(1)); // stacco del collo
  d.ball(hx + 5.5 * s, hy + 1.8 * s, 3 * s, 2.6 * s, ramp(MUSO));   // muso
  d.P(INK, hx + 7.5 * s, hy + 0.4 * s, u(1.5), u(1.2));               // naso
  // occhio con riflesso
  const ex = hx + 1 * s, ey = hy - 2.2 * s;
  d.P(INK, ex, ey, u(1.6), u(1.8));
  d.P('#ffffff', ex, ey, u(0.6), u(0.6));
  if (arrabbiata) d.line(ex - s, ey - 1.6 * s, ex + 2 * s, ey - 0.6 * s, INK, u(0.7));
  if (cicatrice) d.line(ex - 1.2 * s, ey - 2.2 * s, ex + 2.2 * s, ey + 3 * s, '#e8c8b8', u(0.6));
  // denti arancioni
  const tx = hx + 5 * s, ty = hy + 4 * s;
  d.P(DENTI[2], tx, ty, u(2), u(2.6)); d.P(DENTI[4], tx, ty, u(0.8), u(2));
  d.P(DENTI[0], tx + u(1), ty, u(0.5), u(2.6));
  // baffi
  for (const dy of [-1, 0.2, 1.4]) d.line(hx + 6.5 * s, hy + 2.2 * s, hx + 10 * s, hy + 2.2 * s + dy * 1.4 * s, '#f4eee0');
}

// zampe: posteriore palmata e anteriore, alternate col fotogramma
function zampe(d, xs, y, f, s, R) {
  xs.forEach((x, i) => {
    const up = (i + f) % 2 ? Math.round(s) : 0;
    d.P(R[0], x, y - up, 3 * s, 3 * s);
    d.P(R[1], x, y - up, 3 * s, Math.max(1, s));
    d.P('#3a2a24', x + (i ? 1 : 0) * s, y - up + 3 * s - 1, 4 * s, Math.max(1, s)); // dita palmate
  });
}

// ---------- Nutria del campo (36x24) ----------
export function nutria(f = 0) {
  const d = pen(36, 24), R = ramp(PELO);
  coda(d, 8, 15, 8, f, 2);
  zampe(d, [8, 21], 19, f, 1, R);
  pelo(d, 15, 13, 10.5, 7, R, 1);
  d.ball(15, 18, 6, 1.8, ramp('#8e6a46'));                          // pancia
  testa(d, 26, 10, 1, R);
  return outline(d.c);
}

// ---------- Mamma Nutria (48x32): grassa, coi bigodini e il muso grigio ----------
export function mammaNutria(f = 0) {
  const d = pen(48, 32), R = ramp('#6e4c30');
  coda(d, 10, 21, 10, f, 3);
  zampe(d, [10, 28], 26, f, 1.3, R);
  pelo(d, 20, 17, 15, 10, R, 5);
  d.ball(21, 24, 10, 3, ramp('#94704c'));                            // pancione
  testa(d, 35, 13, 1.25, R, { arrabbiata: true });
  // bigodini rosa e retina
  for (const [x, y] of [[29, 5], [33, 4], [37, 5]]) { d.ball(x, y, 2, 1.5, ramp('#e88ab0')); d.P('#fbd0e0', x - 1, y - 1); }
  d.line(28, 7, 39, 6, '#c8a0c0');
  // ciabatta a fiori su una zampa
  d.P('#e85a8a', 27, 29, 6, 2); d.P('#fbe060', 29, 29, 2, 1);
  return outline(d.c);
}

// ---------- Nutria corazzata (44x28): placche di fango secco e un secchio come elmo ----------
export function nutriaCorazzata(f = 0) {
  const d = pen(44, 28), R = ramp(PELO);
  coda(d, 9, 19, 9, f, 2);
  zampe(d, [10, 26], 23, f, 1.2, R);
  pelo(d, 18, 15, 13, 8.5, R, 9);
  // placche di fango a squame
  const r = rng(42);
  for (const [x, y, w] of [[8, 9, 7], [15, 7, 8], [23, 8, 7], [11, 14, 7], [19, 13, 8], [27, 13, 5]]) {
    d.ball(x + w / 2, y + 2, w / 2, 2.6, FANGO);
    d.P(FANGO[0], x + 1, y + 4, w - 1, 1);
    if (r() < 0.7) d.P('#d8c890', x + 2 + Math.floor(r() * (w - 4)), y + 1, 2, 1);     // paglia
  }
  testa(d, 32, 13, 1.1, R, { arrabbiata: true });
  // secchio ammaccato come elmo
  const S = ramp('#8a9aa8');
  d.poly([[25, 4], [36, 3], [35, 9], [26, 10]], S[2]);
  d.P(S[4], 26, 4, 1, 5); d.P(S[0], 26, 9, 9, 1); d.P(S[3], 25, 3, 12, 1);
  d.P('#a85a2e', 31, 6, 2, 1); d.P(S[1], 29, 5, 1, 3);
  d.line(24, 9, 22, 12, S[1]);                                        // manico
  return outline(d.c);
}

// ---------- Re delle Nutrie (76x50): enorme, corona di canne, cicatrice, gocce d'acqua ----------
export function reNutrie(f = 0) {
  const d = pen(76, 50), R = ramp('#6a4628');
  coda(d, 16, 34, 16, f, 5, 3);
  zampe(d, [16, 46], 42, f, 2, R);
  pelo(d, 32, 27, 24, 16, R, 11, 0.7);
  d.ball(32, 38, 14, 4.5, ramp('#8e6a44'));                            // pancia
  // fango e alghe sulla schiena
  for (const [x, y] of [[20, 14], [30, 12], [40, 14]]) { d.ball(x, y, 4, 2, FANGO); }
  d.line(24, 16, 22, 22, CANNA[1], 2); d.line(36, 14, 37, 20, CANNA[1], 2);
  testa(d, 56, 22, 2, R, { cicatrice: true, arrabbiata: true });
  d.P(INK, 57, 16, 4, 4); d.P('#e0302a', 58, 17, 2, 2); d.P('#ffd0a0', 58, 17);   // occhio rosso del re
  // corona di canne palustri con la tifa
  const base = 13;
  for (const [x, h, tifa] of [[47, 5, false], [50, 8, true], [53, 6, false], [56, 9, true], [59, 5, false]]) {
    d.P(CANNA[2], x, base - h, 2, h); d.P(CANNA[4], x, base - h, 1, h);
    if (tifa) { d.P('#7a4a2a', x - 1, base - h - 4, 4, 4); d.P('#a8743e', x - 1, base - h - 4, 1, 3); }
  }
  d.P(CANNA[1], 46, base, 16, 2); d.P(CANNA[3], 46, base, 16, 1); d.P('#f0d050', 53, base, 2, 2);
  // gocce che colano
  const dy = f ? 2 : 0;
  for (const [x, y] of [[12, 40], [30, 45], [62, 36]]) { d.P(ACQUA, x, y + dy, 2, 2); d.P('#d8f0ff', x, y + dy); }
  return outline(d.c);
}

export const NUTRIE = [
  ['Nutria · passo 1', () => nutria(0)], ['passo 2', () => nutria(1)],
  ['Mamma Nutria', () => mammaNutria(0)], ['passo 2', () => mammaNutria(1)],
  ['Nutria corazzata', () => nutriaCorazzata(0)], ['passo 2', () => nutriaCorazzata(1)],
  ['Re delle Nutrie', () => reNutrie(0)], ['passo 2', () => reNutrie(1)],
];
