// Mezzi: Vespa, Punto, trattori, attrezzi e traffico. Viste senza guidatore
// (Garonio alla guida si aggiunge sopra come adesso in src/vehicle_sprites.js).
// Scala come i mezzi attuali: 20 px = 1 casella.
import { pen, ramp, rng, outline, wheel, text, INK } from './kit.js';

const GOMMA = ramp('#34323a'), FERRO = ramp('#4a4a54'), CROMO = ramp('#b8bcc4');
const VETRO = ramp('#86b2d0'), FARO = ramp('#f4ecb0'), STOP = ramp('#d8342a');

function ruggine(d, pts) { for (const [x, y, w = 1, h = 1] of pts) { d.P('#a85a2e', x, y, w, h); d.P('#c87a48', x, y); } }
function vetro(d, pts, streaks = []) {
  d.poly(pts, VETRO[2]);
  for (const [x0, y0, x1, y1] of streaks) { d.line(x0, y0, x1, y1, VETRO[4]); d.line(x0 + 1, y0, x1 + 1, y1, VETRO[3]); }
}

// ---------- Vespa (carta da zucchero) ----------
const VESPA = '#9cc4e4';
export function vespaLato() {
  const d = pen(44, 36), B = ramp(VESPA);
  wheel(d, 11, 30, 5, { rim: '#9a9aa0' });
  wheel(d, 35, 30, 5, { rim: '#9a9aa0' });
  d.ball(13, 22, 11, 7, B);                                   // scocca posteriore bombata
  d.P(B[0], 4, 27, 18, 1);
  for (const x of [7, 10, 13]) d.P(B[1], x, 21, 2, 1);          // feritoie
  d.P('#3a3a42', 19, 25, 11, 2); d.P('#5a5a62', 19, 25, 11, 1);  // pedana con gommini
  d.poly([[27, 8], [32, 8], [33, 27], [26, 27], [25, 21]], B[2]); // scudo
  d.P(B[3], 27, 9, 1, 16); d.P(B[1], 32, 9, 1, 18);
  d.poly([[29, 26], [31, 22], [35, 21], [39, 22], [41, 26]], B[2]); d.P(B[3], 32, 22, 5, 1); // parafango
  d.P(B[1], 30, 3, 2, 6);                                      // piantone
  d.ball(30, 5, 4, 2.5, B);                                    // manubrio
  d.ball(35, 5, 2, 2, FARO); d.P(FARO[4], 34, 4);
  d.P('#2a2a30', 25, 3, 3, 2);                                 // manopola
  d.line(27, 2, 26, 0, CROMO[1]); d.P(CROMO[3], 25, 0, 2, 1);  // specchietto
  d.ball(12, 15, 7.5, 2, ramp('#5a3a28')); d.P('#3a2618', 6, 17, 13, 1); // sella
  d.P(STOP[2], 1, 19, 2, 3); d.P(STOP[4], 1, 19);
  ruggine(d, [[6, 25, 2, 1], [28, 22], [37, 24]]);
  return outline(d.c);
}
export function vespaDavanti() {
  const d = pen(22, 36), B = ramp(VESPA), cx = 11;
  d.ball(cx, 31, 2.5, 5, GOMMA);
  d.ball(cx, 26, 4.5, 3, B);
  d.P(B[1], cx - 7, 24, 14, 2);
  d.poly([[cx - 5, 8], [cx + 5, 8], [cx + 6, 24], [cx - 6, 24]], B[2]);
  d.P(B[3], cx - 5, 9, 2, 14); d.P(B[1], cx + 4, 9, 2, 15);
  d.P(B[0], cx - 1, 11, 3, 8); for (let y = 12; y < 19; y += 2) d.P(B[1], cx - 1, y, 3, 1); // cravatta
  d.P('#2a2a30', 0, 4, 4, 2); d.P('#2a2a30', 18, 4, 4, 2);
  d.P(B[1], 3, 4, 16, 2);
  d.ball(cx, 5, 5, 3, B);
  d.ball(cx, 5, 2.2, 2.2, FARO); d.P(FARO[4], cx - 1, 4);
  d.P(CROMO[2], 2, 0, 2, 2); d.P(CROMO[2], 18, 0, 2, 2); d.P(CROMO[1], 3, 2, 1, 2); d.P(CROMO[1], 18, 2, 1, 2);
  ruggine(d, [[cx + 3, 20], [cx - 4, 25]]);
  return outline(d.c);
}
export function vespaDietro() {
  const d = pen(22, 36), B = ramp(VESPA), cx = 11;
  d.ball(cx, 31, 2.5, 5, GOMMA);
  d.P('#2a2a30', 0, 5, 4, 2); d.P('#2a2a30', 18, 5, 4, 2); d.P(B[1], 3, 5, 16, 2);
  d.ball(cx, 6, 4, 2.5, B);
  d.ball(cx, 20, 8.5, 8, B);
  d.ball(cx, 13, 5, 1.8, ramp('#5a3a28'));
  d.P(STOP[2], cx - 2, 18, 4, 2); d.P(STOP[4], cx - 2, 18);
  d.P('#f4f2ea', cx - 3, 23, 6, 3); d.P('#9aa0a8', cx - 3, 25, 6, 1); d.P(INK, cx - 2, 24, 4, 1);
  ruggine(d, [[cx + 5, 16], [cx - 6, 22]]);
  return outline(d.c);
}

// ---------- La Punto bianca di Garonio ----------
const BIANCO = '#ecebe2';
export function puntoLato(col = BIANCO) {
  const d = pen(90, 45), B = ramp(col);
  d.ell(20, 34, 9, 8, '#2a2830'); d.ell(70, 34, 9, 8, '#2a2830');            // passaruota
  d.poly([[3, 21], [62, 19], [84, 22], [87, 26], [87, 34], [3, 34]], B[2]);    // fiancata
  d.poly([[5, 10], [12, 6], [50, 6], [64, 20], [4, 22]], B[2]);                // abitacolo
  d.P(B[4], 13, 6, 37, 1); d.line(50, 6, 63, 19, B[3]);
  d.line(62, 19, 84, 22, B[3]); d.P(B[3], 4, 22, 58, 1);                        // linea cofano
  d.P(B[1], 4, 30, 82, 4); d.P(B[0], 4, 33, 82, 1);
  vetro(d, [[8, 11], [13, 9], [30, 9], [30, 20], [7, 20]], [[14, 18, 22, 10]]);
  vetro(d, [[33, 9], [49, 9], [60, 20], [33, 20]], [[37, 19, 46, 10], [41, 19, 49, 11]]);
  d.P(B[1], 8, 20, 52, 1);
  d.P(B[1], 31, 20, 1, 13); d.P(B[1], 58, 21, 1, 12);                          // porta
  d.P('#8a8a92', 26, 23, 3, 1);
  d.P(B[2], 57, 16, 4, 3); d.P(B[1], 57, 18, 4, 1);                            // specchietto
  d.P('#55555e', 4, 26, 82, 2); d.P('#6a6a74', 4, 26, 82, 1);                  // modanatura
  d.P(FERRO[2], 0, 29, 8, 5); d.P(FERRO[3], 0, 29, 8, 1);                      // paraurti
  d.P(FERRO[2], 81, 28, 9, 6); d.P(FERRO[3], 81, 28, 9, 1);
  d.P(FARO[2], 83, 22, 4, 3); d.P(FARO[4], 83, 22, 2, 1);
  d.P(STOP[2], 3, 20, 3, 6); d.P('#f0a030', 3, 24, 3, 1); d.P(STOP[4], 3, 20, 1, 2);
  wheel(d, 20, 36, 7.5, { rim: '#a8a8ae' });
  wheel(d, 70, 36, 7.5, { rim: '#a8a8ae' });
  ruggine(d, [[11, 29, 3, 1], [28, 31, 2, 1], [62, 30, 3, 1], [79, 27], [44, 32, 2, 1]]);
  d.P(B[0], 40, 24, 5, 1); d.P(B[3], 40, 25, 5, 1);                            // bozzo
  return outline(d.c);
}
export function puntoDavanti() {
  const d = pen(50, 42), B = ramp(BIANCO), cx = 25;
  d.P(GOMMA[1], 5, 32, 8, 9); d.P(GOMMA[1], 37, 32, 8, 9); d.P(GOMMA[2], 5, 32, 2, 9); d.P(GOMMA[2], 37, 32, 2, 9);
  d.poly([[3, 19], [47, 19], [48, 34], [2, 34]], B[2]); d.P(B[3], 3, 19, 44, 2);
  d.poly([[10, 5], [40, 5], [46, 19], [4, 19]], B[2]); d.P(B[4], 10, 5, 30, 1);
  vetro(d, [[12, 7], [38, 7], [43, 18], [7, 18]], [[13, 17, 21, 8], [18, 17, 25, 8]]);
  d.P(B[1], 0, 14, 4, 3); d.P(B[1], 46, 14, 4, 3);
  for (const x of [4, 36]) { d.P('#7a7a84', x, 22, 10, 5); d.P(FARO[2], x + 1, 23, 8, 3); d.P(FARO[4], x + 1, 23, 3, 1); }
  d.P('#2e2e36', 16, 23, 18, 4); for (let x = 17; x < 34; x += 2) d.P('#4a4a54', x, 24, 1, 2);
  d.P(FERRO[2], 1, 28, 48, 6); d.P(FERRO[3], 1, 28, 48, 1);
  d.P('#f4f2ea', cx - 7, 29, 14, 4); d.P('#2f4fa8', cx - 7, 29, 2, 4); d.P(INK, cx - 4, 30, 9, 1); d.P(INK, cx - 4, 32, 9, 1);
  ruggine(d, [[6, 31, 2, 1], [44, 20]]);
  return outline(d.c);
}
export function puntoDietro() {
  const d = pen(50, 42), B = ramp(BIANCO), cx = 25;
  d.P(GOMMA[1], 5, 32, 8, 9); d.P(GOMMA[1], 37, 32, 8, 9);
  d.poly([[3, 18], [47, 18], [48, 34], [2, 34]], B[2]); d.P(B[3], 3, 18, 44, 1);
  d.poly([[8, 5], [42, 5], [45, 18], [5, 18]], B[2]); d.P(B[4], 8, 5, 34, 1);
  vetro(d, [[10, 7], [40, 7], [42, 17], [8, 17]], [[12, 16, 18, 8]]);
  d.P(B[1], 0, 14, 4, 3); d.P(B[1], 46, 14, 4, 3);
  for (const x of [3, 42]) { d.P(STOP[2], x, 14, 5, 13); d.P('#f0a030', x, 22, 5, 2); d.P(STOP[4], x, 14, 2, 4); }
  d.P(B[1], 9, 26, 32, 1);
  d.P('#f4f2ea', cx - 7, 21, 14, 4); d.P('#2f4fa8', cx - 7, 21, 2, 4); d.P(INK, cx - 4, 22, 9, 1); d.P(INK, cx - 4, 24, 9, 1);
  d.P(FERRO[2], 1, 28, 48, 6); d.P(FERRO[3], 1, 28, 48, 1);
  d.P('#5a5a62', 8, 33, 3, 2); // marmitta
  ruggine(d, [[12, 30, 3, 1], [38, 20]]);
  return outline(d.c);
}

// ---------- Trattori ----------
export function trattoreLato(col = '#c83a2e') {
  const d = pen(76, 68), B = ramp(col);
  // cabina
  vetro(d, [[10, 7], [35, 7], [35, 34], [10, 34]], [[13, 30, 24, 9], [18, 30, 29, 9]]);
  d.P('#2a2a30', 14, 25, 8, 6); d.P('#3a3a44', 14, 25, 8, 1);               // sedile
  d.line(27, 22, 31, 26, '#2a2a30'); d.P('#2a2a30', 30, 26, 2, 8);           // volante
  d.P(B[1], 8, 6, 3, 30); d.P(B[2], 35, 6, 3, 30); d.P(B[3], 35, 6, 1, 30);  // montanti
  d.box(5, 1, 36, 6, B); d.P('#f4f2ea', 5, 4, 36, 1);                       // tetto
  d.P('#f08a20', 21, 0, 4, 2); d.P('#ffc060', 21, 0, 2, 1);                 // lampeggiante
  d.box(5, 33, 33, 5, B);
  // cofano
  d.box(30, 34, 41, 13, B); d.P(B[4], 31, 34, 39, 1);
  for (let x = 42; x < 62; x += 4) d.P(B[0], x, 38, 2, 6);
  d.P('#2e2e36', 69, 36, 3, 10); for (let y = 37; y < 46; y += 2) d.P('#5a5a62', 69, y, 3, 1);
  d.P(FARO[2], 66, 31, 4, 3); d.P(FARO[4], 66, 31, 2, 1); d.P(FERRO[1], 67, 34, 2, 1);
  d.cyl(52, 15, 3, 19, ramp('#3a3a42')); d.P('#2a2a30', 51, 14, 5, 2);     // scarico
  d.P(FERRO[1], 30, 47, 38, 5); d.P(FERRO[2], 30, 47, 38, 1);              // telaio
  d.P(FERRO[2], 0, 45, 7, 3);                                               // gancio
  // ruote
  wheel(d, 21, 51, 16, { rim: '#e0b830', mud: 14 });
  for (let a = 0; a < 360; a += 18) { const r = a * Math.PI / 180; d.P(GOMMA[0], 21 + Math.cos(r) * 14.5, 51 + Math.sin(r) * 14.5, 2, 2); }
  wheel(d, 62, 59, 8.5, { rim: '#e0b830', mud: 6 });
  // parafango sulla ruota grande
  for (let y = 30; y < 50; y++) for (let x = 0; x < 44; x++) {
    const r = Math.hypot(x - 21, y - 51);
    if (r >= 16.5 && r < 19.5 && y < 47) d.P(r < 17.5 ? B[0] : y < 36 ? B[3] : B[2], x, y);
  }
  ruggine(d, [[33, 45, 3, 1], [58, 36], [6, 35, 2, 1], [40, 39]]);
  return outline(d.c);
}
export function trattoreDavanti(col = '#c83a2e') {
  const d = pen(56, 68), B = ramp(col);
  for (const x of [0, 44]) { // ruote grandi
    d.P(GOMMA[1], x, 34, 12, 33); d.P(GOMMA[2], x + 1, 34, 3, 33);
    for (let y = 36; y < 66; y += 3) d.P(GOMMA[0], x, y, 12, 1);
    d.box(x - (x ? 1 : 0), 30, 13, 5, B);
  }
  vetro(d, [[11, 7], [45, 7], [45, 33], [11, 33]], [[14, 30, 26, 9], [20, 30, 32, 9]]);
  d.P('#2a2a30', 20, 22, 16, 3); d.P('#2a2a30', 27, 25, 2, 8);             // volante
  d.P(B[2], 9, 6, 3, 28); d.P(B[3], 9, 6, 1, 28); d.P(B[1], 44, 6, 3, 28);
  d.box(6, 1, 44, 6, B); d.P('#f4f2ea', 6, 4, 44, 1);
  d.P('#f08a20', 26, 0, 4, 2);
  d.cyl(38, 13, 3, 19, ramp('#3a3a42'));
  d.box(18, 32, 20, 17, B); d.P(B[4], 19, 32, 18, 1);
  d.P('#2e2e36', 21, 36, 14, 10); for (let y = 37; y < 46; y += 2) d.P('#5a5a62', 22, y, 12, 1);
  d.P(FARO[2], 19, 33, 4, 2); d.P(FARO[2], 33, 33, 4, 2);
  d.P(FERRO[1], 12, 51, 32, 3);
  for (const x of [12, 38]) { d.P(GOMMA[1], x, 49, 7, 17); d.P(GOMMA[2], x + 1, 49, 2, 17); for (let y = 51; y < 65; y += 3) d.P(GOMMA[0], x, y, 7, 1); d.P('#e0b830', x + 2, 55, 3, 5); }
  ruggine(d, [[20, 47, 3, 1], [2, 32]]);
  return outline(d.c);
}
export function trattoreDietro(col = '#c83a2e') {
  const d = pen(56, 68), B = ramp(col);
  for (const x of [0, 44]) {
    d.P(GOMMA[1], x, 34, 12, 33); d.P(GOMMA[2], x + 1, 34, 3, 33);
    for (let y = 36; y < 66; y += 3) d.P(GOMMA[0], x, y, 12, 1);
    d.box(x - (x ? 1 : 0), 30, 13, 5, B);
  }
  vetro(d, [[11, 7], [45, 7], [45, 31], [11, 31]], [[14, 28, 24, 9]]);
  d.P('#2a2a30', 20, 18, 16, 12); d.P('#3a3a44', 20, 18, 16, 2);           // schienale
  d.P(B[2], 9, 6, 3, 28); d.P(B[3], 9, 6, 1, 28); d.P(B[1], 44, 6, 3, 28);
  d.box(6, 1, 44, 6, B); d.P('#f4f2ea', 6, 4, 44, 1);
  d.box(12, 31, 32, 15, B);
  d.P(STOP[2], 13, 33, 4, 3); d.P(STOP[2], 39, 33, 4, 3); d.P(STOP[4], 13, 33); d.P(STOP[4], 39, 33);
  d.P('#f4f2ea', 22, 34, 12, 4); d.P(INK, 24, 35, 8, 1);
  d.P(FERRO[2], 26, 46, 4, 5);                                             // presa di forza
  d.line(16, 46, 20, 58, FERRO[1], 2); d.line(39, 46, 35, 58, FERRO[1], 2);  // sollevatore a tre punti
  d.P(FERRO[2], 19, 57, 18, 2); d.line(28, 46, 28, 52, FERRO[2], 2);
  ruggine(d, [[15, 42, 3, 1], [46, 32]]);
  return outline(d.c);
}

// ---------- Attrezzi (di lato, il gancio a destra verso il trattore) ----------
export function aratro() {
  const d = pen(48, 28), R = ramp('#c03a2a'), A = ramp('#c8ccd4');
  d.box(4, 3, 36, 4, R);
  d.poly([[38, 3], [47, 1], [47, 9], [40, 7]], R[1]); d.P(FERRO[2], 44, 2, 3, 6);
  for (const x of [12, 24, 36]) {
    d.line(x, 7, x - 4, 19, R[1], 2);
    d.poly([[x - 11, 19], [x - 3, 17], [x - 1, 22], [x - 8, 24]], A[2]);
    d.P(A[4], x - 9, 19, 4, 1); d.P(A[1], x - 7, 23, 5, 1); d.P('#3a3a42', x - 1, 21, 2, 2);
  }
  wheel(d, 5, 20, 5, { rim: '#9a9aa0' }); d.line(5, 7, 5, 15, R[1], 2);
  d.P('#6a4a2a', 25, 24, 4, 1); // terra
  return outline(d.c);
}
export function seminatrice() {
  const d = pen(50, 34), G = ramp('#3e8a4a'), Y = ramp('#e8c030');
  d.box(4, 2, 34, 14, G); d.box(3, 1, 36, 3, Y);
  d.P('#f4ecd6', 10, 7, 20, 4); text(d, 'SEMI', 12, 7, G[0]);
  d.P(FERRO[1], 2, 16, 42, 3);
  for (let x = 8; x <= 36; x += 7) { d.P(FERRO[0], x, 18, 1, 4); d.ball(x, 24, 2, 5, CROMO); d.P(CROMO[4], x - 1, 21); }
  wheel(d, 42, 26, 6, { rim: '#e8c030' });
  d.P(FERRO[2], 42, 12, 8, 3);
  return outline(d.c);
}
export function falciatrice() {
  const d = pen(54, 26), O = ramp('#e07a2a');
  d.line(52, 5, 30, 12, FERRO[1], 3); d.P(FERRO[2], 48, 3, 6, 4);
  d.box(4, 9, 40, 7, O); d.P(O[4], 6, 9, 30, 1);
  for (let x = 8; x < 40; x += 8) d.P(O[0], x, 11, 3, 3);
  d.P('#f4ecd6', 18, 11, 10, 3); d.P(INK, 20, 12, 6, 1);
  d.P(CROMO[2], 2, 17, 44, 2); d.P(CROMO[4], 2, 17, 44, 1);
  for (let x = 3; x < 46; x += 3) { d.P(CROMO[1], x, 19, 2, 1); d.P(CROMO[0], x, 20); }
  d.P(FERRO[2], 0, 15, 4, 4);
  return outline(d.c);
}
export function turbina() { // atomizzatore: botte con ventola dietro
  const d = pen(48, 40), W = ramp('#e8e4d8');
  d.ball(24, 16, 15, 11, W);
  d.P('#2f5e9a', 10, 18, 28, 2); d.P('#4a7ab8', 10, 18, 28, 1);
  d.ball(24, 5, 4, 1.8, ramp('#e07a2a'));                                    // tappo
  d.ball(7, 18, 6, 12, ramp('#4a4a54'));
  for (let y = 9; y < 28; y += 3) d.P('#2a2a30', 3, y, 8, 1);                // griglia
  for (const y of [8, 14, 20, 26]) d.P('#e07a2a', 1, y, 2, 2);               // ugelli
  d.P(FERRO[1], 12, 27, 30, 3);
  wheel(d, 27, 32, 7, { rim: '#9a9aa0' });
  d.P(FERRO[2], 38, 26, 10, 2); d.P(FERRO[3], 44, 25, 4, 1);
  return outline(d.c);
}

// ---------- Traffico del paese ----------
export function apeLato(col = '#3e8a5a') {
  const d = pen(58, 44), B = ramp(col), L = ramp('#9a7448');
  d.box(2, 18, 29, 13, L); for (let x = 9; x < 30; x += 7) d.P(L[1], x, 19, 1, 11);
  for (const [x, c] of [[5, '#d83a2a'], [12, '#f0c030'], [19, '#3e8a4a']]) { d.box(x, 11, 7, 7, ramp('#b88a4a')); d.ball(x + 3, 10, 3, 2, ramp(c)); }
  d.poly([[31, 6], [45, 6], [51, 14], [53, 31], [31, 31]], B[2]);
  d.P(B[4], 32, 6, 13, 1); d.P(B[1], 31, 28, 22, 3);
  vetro(d, [[41, 9], [45, 9], [50, 16], [41, 16]], [[43, 15, 46, 10]]);
  vetro(d, [[33, 9], [39, 9], [39, 17], [33, 17]], [[34, 16, 37, 10]]);
  d.P(B[1], 40, 17, 1, 11); d.P('#8a8a92', 36, 20, 2, 1);
  d.P(FARO[2], 51, 22, 2, 3);
  d.P(FERRO[1], 2, 31, 50, 3);
  wheel(d, 14, 36, 5.5); wheel(d, 46, 36, 5.5);
  ruggine(d, [[33, 27, 2, 1], [50, 18]]);
  return outline(d.c);
}
export function camionLato(col = '#c8302a') {
  const d = pen(112, 58), B = ramp(col), T = ramp('#4a6a8a');
  d.box(2, 4, 74, 36, T);
  for (let x = 12; x < 74; x += 12) { d.P(T[1], x, 5, 2, 34); d.P(T[3], x + 2, 5, 1, 34); }
  d.P('#f4ecd6', 20, 16, 40, 9); text(d, 'TRASPORTI', 22, 18, T[0]);
  d.poly([[78, 8], [100, 8], [108, 20], [109, 42], [78, 42]], B[2]);
  d.P(B[4], 79, 8, 21, 1); d.P(B[1], 78, 38, 31, 4);
  vetro(d, [[88, 11], [99, 11], [106, 21], [88, 21]], [[91, 20, 97, 12]]);
  d.P(B[1], 86, 22, 1, 16); d.P('#8a8a92', 90, 26, 3, 1);
  d.P(FARO[2], 106, 30, 3, 4); d.P(FERRO[2], 104, 38, 8, 4);
  d.P(FERRO[1], 2, 40, 104, 4);
  for (const x of [16, 30, 94]) wheel(d, x, 47, 7.5, { rim: '#c8c8cc' });
  return outline(d.c);
}

export const MEZZI = [
  ['Vespa · lato', vespaLato], ['Vespa · davanti', vespaDavanti], ['Vespa · dietro', vespaDietro],
  ['Punto · lato', puntoLato], ['Punto · davanti', puntoDavanti], ['Punto · dietro', puntoDietro],
  ['Trattore rosso · lato', () => trattoreLato()], ['davanti', () => trattoreDavanti()], ['dietro', () => trattoreDietro()],
  ['Trattore verde · lato', () => trattoreLato('#3e8a3a')], ['davanti', () => trattoreDavanti('#3e8a3a')], ['dietro', () => trattoreDietro('#3e8a3a')],
];
export const ATTREZZI = [['Aratro', aratro], ['Seminatrice', seminatrice], ['Falciatrice', falciatrice], ['Turbina', turbina]];
export const TRAFFICO = [['Motocarro', () => apeLato()], ['Motocarro', () => apeLato('#d8a830')], ['Utilitaria', () => puntoLato('#c84a3a')], ['Utilitaria', () => puntoLato('#4a6aa8')], ['Camion', () => camionLato()]];
