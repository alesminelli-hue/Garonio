// Bestiario HD in stile fantasy/anime: volpe, cinghiali, lupi, ratti, uccelli e i Re.
// Occhioni lucidi con i riflessi, ciuffi a punta, luce di contorno in alto (rim light),
// segni magici che brillano sulle bestie più forti. Stesso kit e contorno degli altri sprite HD.
// Tutte rivolte a DESTRA, due fotogrammi (f = 0 / 1); il combattimento le specchia verso Garonio.
// Risoluzione doppia dei vecchi sprite: in mappa la misura la dà `mappa` (ENEMIES / NEMICI_NUOVI).
import { pen, ramp, tone, outline, rng, INK } from './kit.js';

// ---------- Attrezzi del pittore ----------
// occhio anime: contorno, iride a due toni, pupilla, due riflessi
function occhio(d, x, y, w, h, iride, { pupilla = INK, cattivo = false, brilla = false } = {}) {
  const I = ramp(iride);
  d.P(INK, x - 1, y - 1, w + 2, h + 2);
  d.P(I[1], x, y, w, h); d.P(I[3], x, y + Math.ceil(h / 2), w, Math.floor(h / 2)); d.P(I[0], x, y, w, 1);
  if (w > 2) d.P(pupilla, x + Math.floor(w / 2), y + 1, Math.max(1, w >> 1), Math.max(1, h - 2));
  d.P('#ffffff', x, y, Math.max(1, w >> 1), Math.max(1, h >> 1));        // riflesso grande
  if (h > 2) d.P('#ffffff', x + w - 1, y + h - 1);                     // riflesso piccolo
  if (cattivo) d.line(x - 1, y - 2, x + w, y - 1 + (w > 2 ? 1 : 0), INK); // sopracciglio arrabbiato
  if (brilla) { d.P(I[4], x - 2, y + 1); d.P(I[4], x + w + 1, y); }
}
// ciuffo a punta (triangolo) con un lato in luce
function ciuffo(d, bx, by, tx, ty, w, R, luce = 3) {
  d.poly([[bx - w, by], [tx, ty], [bx + w, by]], R[2]);
  d.line(bx - w + 1, by - 1, tx, ty, R[luce]);
}
// pelo: palla ombreggiata con grana leggera
const pelo = (d, cx, cy, rx, ry, R, seed = 1) => d.ball(cx, cy, rx, ry, R, { seed, grain: 0.22 });
// zampa con la "calza" scura e l'unghia
function zampa(d, x, y, w, h, R, calza) {
  d.P(R[1], x, y, w, h); d.P(R[2], x, y, 1, h - 1);
  if (calza) d.P(calza, x, y + h - 3, w, 3);
  if (w >= 3) d.g.clearRect(x + w - 1, y + h - 4, 1, 3);              // caviglia più sottile
  d.P(INK, x, y + h - 1, w + (w >= 3 ? 0 : 1), 1);
}
// coda folta fatta di palle lungo una curva
function codaFolta(d, pts, R, punta) {
  pts.forEach(([x, y, r], i) => pelo(d, x, y, r, r * 0.8, R, 10 + i));
  if (punta) { const [x, y, r] = pts[pts.length - 1]; d.ball(x, y, r, r * 0.8, ramp(punta)); }
}
// luce di contorno: i pixel con il vuoto sopra (o in alto a sinistra) si schiariscono verso il giallo
function rim(c, k = 0.38, col = [255, 244, 214]) {
  const g = c.getContext('2d'), { width: w, height: h } = c;
  const img = g.getImageData(0, 0, w, h), a = img.data;
  const vuoto = (x, y) => x < 0 || y < 0 || a[(y * w + x) * 4 + 3] === 0;
  const seg = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    if (a[i + 3] && (vuoto(x, y - 1) || vuoto(x - 1, y - 1) && vuoto(x - 1, y))) seg.push(i);
  }
  for (const i of seg) for (let j = 0; j < 3; j++) a[i + j] = Math.round(a[i + j] + (col[j] - a[i + j]) * k);
  g.putImageData(img, 0, 0);
  return c;
}
// scintille magiche intorno (dopo il contorno, così restano "sospese")
function scintille(d, pts, col) {
  const C = ramp(col);
  for (const [x, y, big] of pts) {
    d.P(C[4], x, y);
    if (big) { d.P(C[3], x - 1, y); d.P(C[3], x + 1, y); d.P(C[3], x, y - 1); d.P(C[3], x, y + 1); d.P('#ffffff', x, y); }
  }
}
const fine = (d, k) => outline(rim(d.c, k));

// ---------- Volpe (44x28): volpe-kitsune con la punta della coda che brilla ----------
export function volpe(f = 0) {
  const d = pen(44, 28), R = ramp('#e0702a'), W = ramp('#f6ecdc'), K = '#3a2418';
  codaFolta(d, [[15, 16, 4], [11, 13 - f, 5], [7, 10 - f, 5], [4, 7 - f * 2, 4]], R, '#f6ecdc');
  d.P('#7ae0e8', 2, 5 - f * 2, 2, 2);                                  // fiammella turchese
  zampa(d, 14, 18, 3, 9 - f, R, K); zampa(d, 30, 18, 3, 8 + f, R, K);
  pelo(d, 22, 15, 10, 5.5, R, 3);
  d.ball(23, 18.5, 6.5, 2, W);                                         // pancia
  zampa(d, 18, 19, 3, 8 + f, R, K); zampa(d, 33, 19, 3, 8 - f, R, K);
  d.ball(31, 15, 4, 4, W);                                             // collare di pelo bianco
  ciuffo(d, 30, 17, 28, 21, 2, W, 4);
  // testa
  ciuffo(d, 30, 8, 31, 0, 2.5, R); ciuffo(d, 36, 7, 38, 0, 2.5, R);     // orecchie grandi
  d.P(K, 31, 0, 1, 2); d.P(K, 38, 0, 1, 2); d.P('#e8a0a0', 31, 4, 1, 3); d.P('#e8a0a0', 37, 4, 1, 3);
  pelo(d, 34, 11, 6, 4.5, R, 5);
  d.poly([[37, 10], [44, 13], [38, 15]], R[2]); d.poly([[37, 13], [43, 14], [38, 16]], W[2]); // muso
  d.P(INK, 42, 12, 2, 2);
  ciuffo(d, 31, 13, 29, 17, 2, W, 4);                                   // guancia a punta
  occhio(d, 35, 9, 3, 3, '#f0b020');
  d.P('#7ae0e8', 33, 7, 2, 1); d.P('#7ae0e8', 30, 12, 1, 2);             // segni magici
  return fine(d, 0.35);
}

// ---------- Cinghiale (52x34) e cinghiale maschio (64x40) ----------
function cinghialeBase(d, s, R, { maschio = false, f = 0 } = {}) {
  const K = ramp('#241a14'), Z = ramp('#f4ead8');
  const X = v => Math.round(v * s);
  zampa(d, X(10), X(22), X(4), X(10) - f, R, K[1]); zampa(d, X(32), X(22), X(4), X(9) + f, R, K[1]);
  pelo(d, X(22), X(16), X(15), X(8.5), R, 7);
  zampa(d, X(15), X(23), X(4), X(9) + f, R, K[2]); zampa(d, X(36), X(23), X(4), X(9) - f, R, K[2]);
  // cresta di setole a punta sulla schiena
  for (let i = 0; i < 7; i++) { const bx = X(10 + i * 3.6), by = X(9 - Math.sin(i / 6 * Math.PI) * 1.5); ciuffo(d, bx, by + X(1), bx - X(1.5), by - X(4 + (i % 2) * 1.5), X(1.6), K, 3); }
  // testa a cuneo e grugno
  pelo(d, X(38), X(16), X(7), X(6.5), R, 9);
  d.poly([[X(40), X(11)], [X(49), X(17)], [X(49), X(22)], [X(40), X(22)]], R[2]);
  d.ball(X(48), X(19.5), X(2.5), X(3), ramp('#a07a68'));
  d.P(INK, X(48), X(18), Math.max(1, X(1)), Math.max(1, X(1))); d.P(INK, X(48), X(20.5), Math.max(1, X(1)), Math.max(1, X(1)));
  ciuffo(d, X(35), X(11), X(33), X(5), X(2), R);                         // orecchio
  // zanne curve
  const zl = maschio ? 7 : 4.5;
  d.line(X(44), X(22), X(46), X(22 - zl), Z[2], Math.max(1, X(1.2))); d.P(Z[4], X(46), X(22 - zl), Math.max(1, X(1)), Math.max(1, X(1)));
  occhio(d, X(40), X(13), X(2.4), X(2.4), maschio ? '#ff3020' : '#e86020', { cattivo: true, brilla: maschio });
}
export function cinghiale(f = 0) {
  const d = pen(52, 34), R = ramp('#5a4434');
  cinghialeBase(d, 1, R, { f });
  d.P('#2a1e16', 5, 13, 3, 1); d.P('#2a1e16', 4, 12, 1, 3);             // codina
  return fine(d, 0.3);
}
export function cinghialeMaschio(f = 0) {
  const d = pen(64, 40), R = ramp('#43342a');
  cinghialeBase(d, 1.22, R, { maschio: true, f });
  // cicatrici di rune che brillano di rosso
  for (const [x, y] of [[18, 16], [24, 14], [30, 17]]) { d.line(x, y, x + 3, y + 4, '#ff5030', 1); d.P('#ffb090', x + 1, y + 1); }
  d.P('#2a1e16', 6, 16, 3, 1); d.P('#2a1e16', 5, 15, 1, 3);
  fine(d, 0.3);
  // vapore dalle narici
  if (f) scintille(d, [[62, 21, false], [63, 19, false]], '#d8d8e0'); else scintille(d, [[61, 23, false]], '#d8d8e0');
  return d.c;
}

// ---------- Lupi ----------
function lupoBase(f, { W, H, s, col, iride, cicatrici = false, segno = null }) {
  const d = pen(W, H), R = ramp(col), L = ramp(tone(col, 2.2)), X = v => Math.round(v * s);
  codaFolta(d, [[X(13), X(14), X(3.5)], [X(9), X(12 + f), X(4)], [X(5), X(10 + f * 2), X(3.5)]], R, tone(col, 2.5));
  const lw = Math.max(2, Math.round(2.6 * s));
  zampa(d, X(12), X(17), lw, X(10) - f, R, R[0]); zampa(d, X(29), X(17), lw, X(10) + f, R, R[0]);
  pelo(d, X(20), X(14), X(10), X(5.5), R, 4);
  d.ball(X(21), X(17.5), X(7), X(2.2), L);
  zampa(d, X(16), X(18), lw, X(9) + f, R, R[0]); zampa(d, X(32), X(18), lw, X(9) - f, R, R[0]);
  // criniera a ciuffi sul collo
  for (let i = 0; i < 4; i++) ciuffo(d, X(25 + i * 1.5), X(9 + i * 2), X(21 + i), X(6 + i * 2.4), X(2), R);
  pelo(d, X(29), X(13), X(5), X(5), R, 6);
  ciuffo(d, X(28), X(8), X(29), X(1), X(2), R); ciuffo(d, X(32), X(8), X(34), X(1.5), X(2), R); // orecchie
  d.P(INK, X(29), X(2), 1, X(1.5)); d.P(INK, X(34), X(2), 1, X(1.5));
  d.poly([[X(31), X(10)], [X(41), X(13)], [X(41), X(15)], [X(32), X(16)]], R[2]);  // muso lungo
  d.poly([[X(33), X(14)], [X(41), X(14.5)], [X(33), X(17)]], L[2]);
  d.P(INK, X(40), X(12), Math.max(2, X(1.5)), Math.max(1, X(1.5)));
  d.P('#f4ead8', X(37), X(15), 1, X(1.5)); d.P('#f4ead8', X(34), X(15), 1, X(1.5));   // zanne
  ciuffo(d, X(27), X(15), X(25), X(19), X(1.5), L, 4);
  occhio(d, X(31), X(10), Math.max(2, X(2.4)), Math.max(2, X(2)), iride, { cattivo: true, brilla: s > 1.1 });
  if (cicatrici) { d.line(X(30), X(8), X(33), X(13), '#d8b8b0'); d.line(X(16), X(11), X(19), X(15), R[0]); d.line(X(19), X(11), X(22), X(15), R[0]); }
  if (segno) { d.P(segno, X(29), X(7), 2, 1); d.P(segno, X(30), X(6), 1, 1); }
  return { d, R, X };
}
export function lupoGiovane(f = 0) { return fine(lupoBase(f, { W: 48, H: 30, s: 1.05, col: '#9a9aa4', iride: '#f0c030' }).d, 0.35); }
export function lupo(f = 0) {
  const { d } = lupoBase(f, { W: 56, H: 36, s: 1.28, col: '#545460', iride: '#ff6a20', cicatrici: true, segno: '#a0e0ff' });
  return fine(d, 0.3);
}

// Re dei Lupi (72x46): un lupo d'argento enorme, criniera di brina, occhi di ghiaccio e mezzaluna in fronte
export function reLupi(f = 0) {
  const { d, X } = lupoBase(f, { W: 72, H: 46, s: 1.62, col: '#c4cadc', iride: '#60d8ff', cicatrici: true });
  const L = ramp('#f2f6ff'), I = ramp('#60d8ff');
  for (let i = 0; i < 5; i++) ciuffo(d, X(24 + i * 1.4), X(10 + i * 2), X(19 + i), X(6 + i * 2.2), X(1.6), L, 4); // criniera di brina
  d.P(I[4], X(28), X(6), 3, 1); d.P(I[3], X(29), X(5), 1, 1); d.P(I[4], X(29), X(7), 1, 1);  // mezzaluna
  for (const [x, y] of [[14, 20], [22, 22], [6, 14]]) { d.P(I[3], X(x), X(y), 2, 1); d.P(I[4], X(x), X(y)); } // cristalli sul pelo
  fine(d, 0.4);
  scintille(d, [[66, 3, true], [4, 6, true], [70, 24, false], [36 + f * 3, 2, true], [18, 4, false], [58, 40, true]], '#9ae8ff');
  return d.c;
}

// ---------- Ratti ----------
function rattoBase(d, s, col, { iride = '#e03030', f = 0, punk = false, coda = '#e0a0a8' } = {}) {
  const R = ramp(col), X = v => Math.round(v * s), C = ramp(coda);
  for (let i = 0; i <= X(9); i++) { const t = i / X(9); d.P(C[2], X(8) - i, X(12) + Math.round(Math.sin(t * 3 + f * 1.4) * X(1.5) + t * t * X(2)), 1, Math.max(1, X(1.2) - Math.round(t))); }
  zampa(d, X(10), X(13), X(2), X(4) - f, R, null); zampa(d, X(21), X(13), X(2), X(4) + f, R, null);
  pelo(d, X(15), X(10), X(8), X(4.5), R, 2);
  if (punk) for (let i = 0; i < 5; i++) ciuffo(d, X(10 + i * 2.5), X(7), X(9 + i * 2.5), X(2 + (i % 2)), X(1.3), R);
  pelo(d, X(24), X(9), X(5), X(4), R, 3);
  d.poly([[X(26), X(7)], [X(33), X(10)], [X(27), X(12)]], R[2]);
  d.P(C[2], X(32), X(9), Math.max(1, X(1.5)), Math.max(1, X(1.5)));
  d.ball(X(21), X(5), X(2.5), X(2.8), R); d.ball(X(21), X(5), X(1.5), X(1.8), C);   // orecchio
  occhio(d, X(25), X(7), Math.max(2, X(2)), Math.max(2, X(2)), iride, { cattivo: punk });
  d.P('#f4ead8', X(29), X(12), 1, Math.max(2, X(1.5)));
  for (const dy of [-1, 1]) d.line(X(30), X(10), X(34), X(10) + dy * 2, '#f4eee0');
}
export function ratto(f = 0) { const d = pen(34, 18); rattoBase(d, 1, '#7a726c', { f }); return fine(d, 0.35); }
export function rattoFogna(f = 0) {
  const d = pen(48, 26); rattoBase(d, 1.4, '#4e5a44', { iride: '#9aff40', f, punk: true, coda: '#b88890' });
  d.P('#9ad040', 41, 18, 1, 2 + f); d.P('#c8ff70', 41, 18);              // bava verde
  d.P(INK, 30, 3, 2, 2);                                                // orecchio rosicchiato
  return fine(d, 0.3);
}
// Re dei Ratti (68x52): ritto, mantello rosso e ermellino, corona, scettro-stuzzicadenti, aura dorata
export function reRatti(f = 0) {
  const d = pen(68, 52), R = ramp('#6a625c'), M = ramp('#b02030'), O = ramp('#f0c840'), C = ramp('#e0a0a8');
  for (let i = 0; i < 18; i++) { const t = i / 18; d.P(C[2], 14 - i * 0.7, 44 + Math.sin(t * 4 + f) * 2 + t * 4, 2, 2); }
  // mantello dietro
  d.poly([[18, 18], [34, 16], [38, 50], [10, 50]], M[2]); d.line(18, 18, 10, 50, M[3]); d.P(M[0], 12, 48, 26, 2);
  d.P('#f4f0e8', 12, 46, 26, 2); for (let x = 13; x < 37; x += 4) d.P(INK, x, 46, 1, 1); // ermellino
  // corpo ritto
  pelo(d, 32, 34, 10, 13, R, 2);
  d.ball(34, 37, 6, 8, ramp('#c8b8a8'));
  zampa(d, 26, 45, 5, 7, R, null); zampa(d, 36, 45, 5, 7, R, null);
  d.P('#f4f0e8', 20, 18, 18, 3); for (let x = 21; x < 38; x += 4) d.P(INK, x, 19, 1, 1); // collo d'ermellino
  // testa
  pelo(d, 38, 13, 8, 7, R, 3);
  d.poly([[42, 10], [54, 15], [43, 19]], R[2]); d.P(C[3], 52, 14, 3, 2);
  d.ball(32, 6, 3.5, 4, R); d.ball(32, 6, 2, 2.6, C); d.ball(43, 5, 3, 3.5, R); d.ball(43, 5, 1.8, 2.2, C);
  occhio(d, 42, 11, 3, 3, '#ffd040', { cattivo: true });
  d.P('#f4ead8', 47, 18, 2, 3); d.P('#f4ead8', 50, 17, 1, 3);
  for (const dy of [-1, 1]) d.line(52, 16, 58, 16 + dy * 3, '#f4eee0');
  // corona a punte con la gemma
  d.P(O[2], 33, 2, 10, 3); for (const x of [33, 37, 41]) ciuffo(d, x + 1, 2, x + 1, -2, 1.5, O, 4);
  d.P('#e03040', 37, 3, 2, 1); d.P(O[4], 34, 2, 2, 1);
  // braccio e scettro (uno stuzzicadenti d'oro)
  d.P(R[1], 42, 26, 6, 3);
  d.line(50, 16 - f, 50, 38 - f, O[1], 2); d.ball(50, 15 - f, 2.5, 2.5, O); d.P('#ffffff', 49, 14 - f);
  fine(d, 0.35);
  scintille(d, [[58, 6, true], [8, 20, true], [60, 34, false], [4, 36, false], [24, 6 + f, true]], '#ffd860');
  return d.c;
}

// ---------- Uccelli ----------
// gazza ladra (36x28): bianca e nera coi riflessi blu-verdi, un anello rubato nel becco
export function gazza(f = 0) {
  const d = pen(36, 28), N = ramp('#22223a'), B = ramp('#f6f4f0'), V = ramp('#2a7ab0');
  d.poly([[1, 15], [12, 13], [12, 17], [2, 18]], N[2]); d.line(2, 15, 11, 14, V[3]); d.line(2, 17, 11, 16, V[1]); // coda lunga
  pelo(d, 17, 15, 7, 5, N, 4);
  d.ball(19, 18, 5, 3, B);                                              // pancia bianca
  d.P(INK, 18, 20, 1, 6); d.P(INK, 21, 20, 1, 6); d.P(INK, 17, 25, 3, 1); d.P(INK, 20, 25, 3, 1);
  pelo(d, 26, 10, 4.5, 4, N, 5);
  d.poly([[29, 9], [35, 11], [29, 12]], '#3a3a44');
  occhio(d, 26, 8, 2, 2, '#d0e8ff');
  if (f) { d.poly([[13, 12], [20, 2], [24, 4], [22, 12]], N[2]); d.line(14, 11, 20, 3, V[3]); d.P(B[2], 18, 7, 3, 2); }
  else { d.poly([[12, 13], [23, 12], [20, 17], [13, 17]], N[1]); d.line(13, 14, 22, 13, V[3]); d.P(B[2], 15, 13, 4, 2); }
  d.P('#f0d050', 33, 12, 2, 2); d.P('#fff6a0', 33, 12);                  // anello
  return fine(d, 0.35);
}
// piccione (30x24): paffuto, collo cangiante, occhio arancio
export function piccione(f = 0) {
  const d = pen(30, 24), G = ramp('#9aa0b4'), S = ramp('#6a7084');
  d.poly([[1, 12], [8, 11], [8, 15], [1, 15]], S[2]);
  pelo(d, 13, 13, 8, 6, G, 3);
  d.ball(19, 9, 3.5, 3, ramp('#5aa088')); d.P('#9a6ac0', 17, 10, 4, 1); d.P('#7ad0b0', 18, 8, 2, 1); // collo
  pelo(d, 22, 6, 4, 3.5, G, 4);
  d.poly([[25, 5], [29, 7], [25, 8]], '#e0c8a0'); d.P('#f4f0e8', 25, 5, 1, 1);
  occhio(d, 22, 4, 2, 2, '#ff8a20');
  if (f) d.poly([[8, 10], [14, 1], [18, 3], [16, 11]], S[2]); else { d.poly([[7, 11], [17, 10], [15, 15], [8, 15]], S[1]); d.P(S[0], 9, 13, 6, 1); }
  d.P('#e07080', 12, 19, 1, 4); d.P('#e07080', 15, 19, 1, 4); d.P('#e07080', 11, 22, 3, 1); d.P('#e07080', 14, 22, 3, 1);
  return fine(d, 0.35);
}
// corvo (24x20): 0 a terra, 1 becca, 2/3 vola
export function corvo(frame = 0) {
  const d = pen(24, 20), N = ramp('#24243a'), V = ramp('#4a4a8a');
  if (frame >= 2) {
    const su = frame === 2;
    pelo(d, 11, 11, 6, 3, N, 2); d.poly([[16, 9], [22, 10], [16, 12]], '#d8a020');
    occhio(d, 14, 9, 1, 1, '#ff3030');
    d.poly([[2, 11], [5, 9], [6, 12]], N[1]);
    if (su) { d.poly([[6, 9], [9, 0], [14, 2], [13, 10]], N[2]); d.line(7, 8, 10, 1, V[3]); }
    else { d.poly([[6, 12], [9, 19], [14, 18], [13, 12]], N[2]); d.line(7, 13, 10, 18, V[3]); }
    return fine(d, 0.3);
  }
  const b = frame === 1 ? 2 : 0;
  d.poly([[1, 12], [7, 10], [7, 14], [2, 15]], N[1]);
  pelo(d, 11, 12, 6, 4, N, 2); d.line(6, 11, 14, 10, V[3]);
  pelo(d, 16, 7 + b, 3.5, 3.5, N, 3);
  d.poly([[18, 6 + b], [23, 8 + b * 1.5], [18, 9 + b]], '#d8a020');
  occhio(d, 16, 6 + b, 1, 1, '#ff3030');
  d.P('#d8a020', 10, 16, 1, 3); d.P('#d8a020', 13, 16, 1, 3);
  return fine(d, 0.3);
}
// anatra germano (28x20) che galleggia
export function anatra(frame = 0) {
  const d = pen(28, 20), B = ramp('#e8e0d0'), M = ramp('#8a6a4a'), V = ramp('#2a9a5a');
  d.poly([[2, 9], [7, 8], [6, 12]], B[1]);
  pelo(d, 12, 12, 9, 4.5, B, 3);
  d.ball(12, 10, 6, 2.2, M); d.P('#3a6ac8', 13, 11, 4, 1); d.P('#9ac8ff', 13, 11);  // ala con lo specchio blu
  d.P('#f4f4f4', 18, 8, 3, 1);                                          // collarino
  pelo(d, 21, 5, 4, 3.5, V, 4);
  d.poly([[24, 5], [28, 6], [24, 8]], '#f0b020');
  occhio(d, 21, 3, 2, 2, '#3a2a1a');
  const y = 16 + frame;
  d.P('#8ad0ff', 2, y, 22, 1); d.P('#d8f0ff', 6 + frame * 4, y, 4, 1);  // increspatura
  return fine(d, 0.3);
}
// barboncino (22x18): bianco coi pompon e il fiocco rosa
export function barboncino(frame = 0) {
  const d = pen(22, 18), B = ramp('#f6f2f6'), K = ramp('#e85a90');
  d.ball(3, 5 + frame, 2.5, 2.5, B);                                    // pompon della coda
  d.P(B[1], 5, 8, 2, 2);
  pelo(d, 10, 9, 5, 3, B, 2);
  d.ball(8, 7, 3.5, 3.5, B);                                            // nuvola di pelo
  zampa(d, 6, 11, 2, 5 - frame, B, null); zampa(d, 13, 11, 2, 4 + frame, B, null);
  d.ball(7, 16 - frame, 2, 1.5, B); d.ball(14, 15 + frame, 2, 1.5, B);    // pompon alle zampe
  d.ball(16, 5, 3.5, 3.5, B); d.ball(15, 2, 3, 2, B);                    // testa e ciuffo
  d.P(B[2], 18, 6, 4, 2); d.P(INK, 21, 6, 1, 1);
  d.ball(13, 7, 2, 3, B);                                               // orecchio riccio
  occhio(d, 17, 4, 1, 2, '#3a2a3a');
  d.P(K[2], 13, 0, 3, 2); d.P(K[4], 13, 0); d.P(K[2], 17, 0, 1, 1);      // fiocco
  return fine(d, 0.25);
}

export const BESTIARIO = [
  ['Volpe', () => volpe(0)], ['passo 2', () => volpe(1)],
  ['Cinghiale', () => cinghiale(0)], ['passo 2', () => cinghiale(1)],
  ['Cinghiale maschio', () => cinghialeMaschio(0)], ['passo 2', () => cinghialeMaschio(1)],
  ['Lupo giovane', () => lupoGiovane(0)], ['passo 2', () => lupoGiovane(1)],
  ['Lupo', () => lupo(0)], ['passo 2', () => lupo(1)],
  ['Re dei Lupi', () => reLupi(0)], ['passo 2', () => reLupi(1)],
  ['Ratto', () => ratto(0)], ['passo 2', () => ratto(1)],
  ['Ratto di fogna', () => rattoFogna(0)], ['passo 2', () => rattoFogna(1)],
  ['Re dei Ratti', () => reRatti(0)], ['passo 2', () => reRatti(1)],
  ['Gazza ladra', () => gazza(0)], ['ali su', () => gazza(1)],
  ['Piccione', () => piccione(0)], ['ali su', () => piccione(1)],
  ['Corvo', () => corvo(0)], ['becca', () => corvo(1)], ['vola', () => corvo(2)], ['vola', () => corvo(3)],
  ['Anatra', () => anatra(0)], ['Barboncino', () => barboncino(0)], ['passo 2', () => barboncino(1)],
];
