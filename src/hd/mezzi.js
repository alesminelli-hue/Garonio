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
// Trattore da Bassa con un po' di carattere: cofano arrotondato con la fascia, zavorre davanti,
// ruote coi tasselli a spina di pesce, scarico cromato col cappellotto, fari da lavoro sul tetto.
// Le misure (76x68 di lato, 56x68 davanti/dietro) e i finestrini (TRACTOR_WIN) restano quelli di prima.
const GIALLO = ramp('#e8b820'), ZAVORRA = ramp('#2e2c34'), FANGO_T = ['#5a4028', '#7a5a34', '#8e6c40'];

function schizzi(d, seed, x0, y0, w, h, n) { // fango schizzato in basso
  const R = rng(seed);
  for (let i = 0; i < n; i++) { const y = y0 + Math.floor(Math.pow(R(), 0.6) * h); d.P(FANGO_T[(R() * 3) | 0], x0 + Math.floor(R() * w), y, R() < 0.3 ? 2 : 1, 1); }
}

// ruota posteriore vista di lato: tasselli che sporgono dal profilo, cerchio giallo coi bulloni
function ruotaGrande(d, cx, cy, r, rim) {
  d.ball(cx, cy, r, r, GOMMA);
  for (let a = 0; a < 360; a += 20) {                               // tasselli sul profilo
    const t = a * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
    for (let k = -0.5; k <= 1; k += 0.5) d.P(s < -0.3 ? GOMMA[2] : GOMMA[1], cx + c * (r + k), cy + s * (r + k), 2, 2);
  }
  for (let a = 10; a < 360; a += 20) { const t = a * Math.PI / 180; d.P(GOMMA[0], cx + Math.cos(t) * (r - 2), cy + Math.sin(t) * (r - 2), 2, 2); }
  d.ell(cx, cy, r * 0.74, r * 0.74, GOMMA[0]);                       // spalla
  const rr = r * 0.62, Y = ramp(rim);
  d.ball(cx, cy, rr, rr, Y);
  d.ell(cx, cy, rr * 0.7, rr * 0.7, Y[1]);                           // disco incavato
  d.ball(cx, cy, rr * 0.55, rr * 0.55, Y);
  for (let a = 0; a < 360; a += 45) { const t = a * Math.PI / 180; d.P(Y[0], cx + Math.cos(t) * rr * 0.38, cy + Math.sin(t) * rr * 0.38); }
  d.ball(cx, cy, rr * 0.25, rr * 0.25, CROMO);
  d.P(Y[4], cx - rr * 0.6, cy - rr * 0.5, 2, 1);
}
function ruotaPiccola(d, cx, cy, r, rim) {
  d.ball(cx, cy, r, r, GOMMA);
  for (let a = 0; a < 360; a += 30) { const t = a * Math.PI / 180; d.P(GOMMA[1], cx + Math.cos(t) * (r + 0.3), cy + Math.sin(t) * (r + 0.3), 2, 1); }
  const Y = ramp(rim);
  d.ball(cx, cy, r * 0.55, r * 0.55, Y); d.ell(cx, cy, r * 0.32, r * 0.32, Y[1]);
  d.ball(cx, cy, r * 0.18 + 0.6, r * 0.18 + 0.6, CROMO);
}
// gomma vista da davanti/dietro: battistrada a spina di pesce
function gommaFronte(d, x, y, w, h) {
  d.P(GOMMA[1], x, y, w, h);
  d.P(GOMMA[2], x + 1, y + 1, 2, h - 2); d.P(GOMMA[0], x + w - 2, y + 1, 2, h - 2);
  for (let j = y + 2; j < y + h - 2; j += 4) {
    const m = x + w / 2;
    d.line(x + 1, j + 2, m - 1, j, GOMMA[3]); d.line(m, j, x + w - 2, j + 2, GOMMA[0]);
    d.line(x + 1, j + 3, m - 1, j + 1, GOMMA[0]);
  }
  d.P(GOMMA[0], x, y, w, 1); d.P(GOMMA[0], x, y + h - 1, w, 1);
}
// zavorre davanti (pila di pesi neri con la maniglia)
function zavorre(d, x, y, w, n) {
  for (let i = 0; i < n; i++) {
    const yy = y + i * 3;
    d.P(ZAVORRA[2], x, yy, w, 3); d.P(ZAVORRA[3], x, yy, w, 1); d.P(ZAVORRA[0], x, yy + 2, w, 1);
    d.P(ZAVORRA[4], x + 1, yy, 2, 1);
  }
}
// faro da lavoro squadrato
function faroLavoro(d, x, y) { d.P(FERRO[1], x, y, 4, 3); d.P(FARO[2], x + 1, y + 1, 2, 1); d.P(FARO[4], x + 1, y + 1); }

export function trattoreLato(col = '#c83a2e') {
  const d = pen(76, 68), B = ramp(col);
  // scarico cromato col cappellotto (dietro alla cabina, davanti nel disegno)
  d.cyl(51, 13, 3, 21, ramp('#3a3a42'));
  d.cyl(51, 9, 3, 5, CROMO); d.P(CROMO[4], 51, 9, 1, 5);
  d.poly([[50, 9], [55, 6], [55, 8], [51, 10]], CROMO[1]);           // cappellotto aperto
  // cabina
  vetro(d, [[10, 7], [35, 7], [35, 34], [10, 34]], [[13, 30, 24, 9], [18, 30, 29, 9]]);
  d.P('#2a2a30', 14, 25, 8, 6); d.P('#3a3a44', 14, 25, 8, 1);        // sedile
  d.line(27, 22, 31, 26, '#2a2a30'); d.P('#2a2a30', 30, 26, 2, 8);    // volante
  d.P(INK, 22, 7, 1, 27);                                            // guarnizione della porta
  d.P(B[1], 8, 6, 3, 30); d.P(B[0], 10, 6, 1, 30);
  d.P(B[2], 35, 6, 3, 30); d.P(B[3], 35, 6, 1, 30);                   // montanti
  d.P(FERRO[1], 38, 10, 3, 1); d.P(FERRO[2], 40, 8, 3, 5); d.P(VETRO[3], 41, 9, 1, 3); // specchietto
  // tetto bombato con lo sbalzo, faro da lavoro e lampeggiante
  d.poly([[4, 3], [8, 1], [38, 1], [42, 3], [42, 6], [4, 6]], B[2]);
  d.P(B[4], 9, 1, 29, 1); d.P(B[3], 5, 3, 36, 1); d.P(B[0], 4, 6, 38, 1);
  d.P('#f4f2ea', 4, 4, 38, 1);                                        // filetto bianco
  faroLavoro(d, 37, 2);
  d.P('#f08a20', 19, 0, 5, 2); d.P('#ffc060', 19, 0, 2, 1); d.P('#c86010', 22, 1, 2, 1);
  // pianale sotto la cabina e scaletta
  d.box(5, 33, 33, 4, B);
  d.P(FERRO[1], 6, 37, 2, 8); d.P(FERRO[2], 3, 39, 5, 1); d.P(FERRO[2], 3, 43, 5, 1);
  // blocco motore sotto il cofano
  d.P(FERRO[1], 36, 46, 30, 6); d.P(FERRO[2], 36, 46, 30, 1);
  for (let x = 40; x < 64; x += 5) d.P(FERRO[0], x, 48, 2, 3);
  // cofano arrotondato, più basso davanti
  d.poly([[34, 33], [62, 33], [67, 35], [69, 38], [69, 47], [34, 47]], B[2]);
  d.P(B[4], 35, 33, 27, 1); d.line(62, 33, 67, 35, B[3]); d.P(B[3], 35, 34, 30, 1);
  d.P(B[1], 34, 45, 35, 2); d.P(B[0], 34, 46, 35, 1);
  // fascia decorativa con la scritta
  d.P('#f4f2ea', 36, 38, 30, 3); d.P(B[0], 36, 41, 30, 1);
  text(d, 'GT 90', 44, 37, B[0]);
  d.P('#f4f2ea', 36, 38, 7, 1);
  // feritoie del cofano
  for (let x = 37; x < 66; x += 3) d.P(B[0], x, 43, 2, 1);
  // calandra e fari
  d.P('#2e2e36', 66, 37, 3, 9); for (let y = 38; y < 46; y += 2) d.P('#6a6a74', 66, y, 3, 1);
  d.P(FARO[2], 64, 34, 4, 2); d.P(FARO[4], 64, 34, 2, 1);
  // zavorre davanti e supporto
  d.P(FERRO[2], 68, 47, 4, 4);
  zavorre(d, 69, 39, 6, 4);
  // ruota anteriore col suo parafanghino
  ruotaPiccola(d, 61, 59, 8.5, GIALLO[2]);
  for (let x = 52; x < 71; x++) { const y = 50 - Math.round(Math.sqrt(Math.max(0, 90 - (x - 61) ** 2)) * 0.25); d.P(B[2], x, y, 1, 2); d.P(B[3], x, y); }
  // ruota grande e parafango tondo con la luce dietro
  ruotaGrande(d, 21, 51, 15.5, GIALLO[2]);
  for (let y = 30; y < 50; y++) for (let x = 0; x < 44; x++) {
    const r = Math.hypot(x - 21, y - 51);
    if (r >= 17 && r < 20.5 && y < 47) d.P(r < 18 ? B[0] : y < 37 ? B[4] : r > 19.5 ? B[1] : B[2], x, y);
  }
  d.P(STOP[2], 2, 40, 2, 3); d.P(STOP[4], 2, 40);
  d.P('#f08a20', 2, 43, 2, 1);
  // gancio di traino
  d.P(FERRO[2], 0, 45, 7, 3); d.P(FERRO[3], 0, 45, 7, 1);
  // ruggine e fango
  ruggine(d, [[33, 44, 3, 1], [58, 36], [6, 35, 2, 1], [47, 44]]);
  schizzi(d, 5, 34, 41, 36, 6, 18);
  return outline(d.c);
}

export function trattoreDavanti(col = '#c83a2e') {
  const d = pen(56, 68), B = ramp(col);
  // ruote grandi dietro, col parafango
  for (const x of [0, 44]) { gommaFronte(d, x, 34, 12, 33); d.box(x - (x ? 1 : 0), 30, 13, 5, B); d.P(B[4], x, 30, 12, 1); }
  // cabina
  vetro(d, [[11, 7], [45, 7], [45, 33], [11, 33]], [[14, 30, 26, 9], [20, 30, 32, 9]]);
  d.P('#2a2a30', 20, 22, 16, 3); d.P('#2a2a30', 27, 25, 2, 8);        // volante
  d.P(B[2], 9, 6, 3, 28); d.P(B[3], 9, 6, 1, 28); d.P(B[1], 44, 6, 3, 28);
  // specchietti a braccio
  d.P(FERRO[1], 3, 10, 6, 1); d.P(FERRO[2], 1, 8, 3, 6); d.P(VETRO[3], 2, 9, 1, 4);
  d.P(FERRO[1], 47, 10, 6, 1); d.P(FERRO[2], 52, 8, 3, 6); d.P(VETRO[3], 53, 9, 1, 4);
  // tetto con sbalzo, fari da lavoro e lampeggiante
  d.poly([[4, 3], [8, 1], [48, 1], [52, 3], [52, 6], [4, 6]], B[2]);
  d.P(B[4], 9, 1, 39, 1); d.P(B[3], 5, 3, 46, 1); d.P(B[0], 4, 6, 48, 1); d.P('#f4f2ea', 4, 4, 48, 1);
  faroLavoro(d, 13, 3); faroLavoro(d, 39, 3);
  d.P('#f08a20', 25, 0, 6, 2); d.P('#ffc060', 25, 0, 2, 1);
  // scarico che spunta a destra
  d.cyl(38, 12, 3, 20, ramp('#3a3a42')); d.cyl(38, 9, 3, 4, CROMO);
  // cofano visto di fronte, arrotondato in alto
  d.poly([[17, 33], [39, 33], [41, 35], [41, 50], [15, 50], [15, 35]], B[2]);
  d.P(B[4], 18, 33, 20, 1); d.P(B[3], 16, 35, 2, 14); d.P(B[1], 39, 35, 2, 15);
  // calandra a nido d'ape con la fascia
  d.P('#2e2e36', 19, 37, 18, 11);
  for (let y = 38; y < 47; y += 2) for (let x = 20 + (y % 4 ? 1 : 0); x < 36; x += 2) d.P('#5a5a64', x, y);
  d.P('#f4f2ea', 19, 36, 18, 1);
  d.P(B[0], 26, 37, 4, 2); d.P('#e8b820', 27, 37, 2, 1);              // stemma
  // fari incassati nel cofano
  for (const x of [16, 37]) { d.P('#3a3a44', x, 34, 4, 3); d.P(FARO[2], x + 1, 35, 2, 1); d.P(FARO[4], x + 1, 35); }
  // zavorre davanti
  d.P(FERRO[1], 17, 50, 22, 2);
  zavorre(d, 15, 52, 26, 2); d.P(FERRO[3], 26, 52, 4, 1);
  // assale e ruote anteriori
  d.P(FERRO[1], 11, 58, 34, 3); d.P(FERRO[2], 11, 58, 34, 1);
  for (const x of [11, 38]) { gommaFronte(d, x, 50, 7, 17); d.P(GIALLO[2], x + 2, 56, 3, 5); d.P(GIALLO[4], x + 2, 56, 1, 2); }
  ruggine(d, [[20, 48, 3, 1], [2, 32], [40, 40]]);
  schizzi(d, 9, 15, 44, 26, 8, 10);
  return outline(d.c);
}

export function trattoreDietro(col = '#c83a2e') {
  const d = pen(56, 68), B = ramp(col);
  for (const x of [0, 44]) gommaFronte(d, x, 34, 12, 33);
  // cabina e schienale
  vetro(d, [[11, 7], [45, 7], [45, 31], [11, 31]], [[14, 28, 24, 9]]);
  d.P('#2a2a30', 20, 18, 16, 12); d.P('#3a3a44', 20, 18, 16, 2);
  d.P(B[2], 9, 6, 3, 28); d.P(B[3], 9, 6, 1, 28); d.P(B[1], 44, 6, 3, 28);
  d.P(FERRO[1], 3, 10, 6, 1); d.P(FERRO[2], 1, 8, 3, 6);
  d.P(FERRO[1], 47, 10, 6, 1); d.P(FERRO[2], 52, 8, 3, 6);
  d.poly([[4, 3], [8, 1], [48, 1], [52, 3], [52, 6], [4, 6]], B[2]);
  d.P(B[4], 9, 1, 39, 1); d.P(B[3], 5, 3, 46, 1); d.P(B[0], 4, 6, 48, 1); d.P('#f4f2ea', 4, 4, 48, 1);
  faroLavoro(d, 13, 3); faroLavoro(d, 39, 3);
  d.P('#f08a20', 25, 0, 6, 2);
  // parafanghi tondi sulle ruote con le luci
  for (const x of [0, 43]) {
    d.box(x, 29, 13, 6, B); d.P(B[4], x + 1, 29, 11, 1);
    const lx = x ? x + 1 : x + 8;
    d.P(STOP[2], lx, 31, 4, 2); d.P('#f08a20', lx, 33, 4, 1); d.P(STOP[4], lx, 31);
  }
  // scatola del cambio e sollevatore
  d.box(12, 31, 32, 14, B); d.P(B[0], 12, 44, 32, 1);
  d.P('#f4f2ea', 22, 34, 12, 5); d.P('#2f4fa8', 22, 34, 2, 5); d.P(INK, 25, 35, 8, 1); d.P(INK, 25, 37, 8, 1); // targa
  d.P(FERRO[2], 14, 32, 6, 1); d.P(FERRO[2], 36, 32, 6, 1);
  // presa di forza con la cuffia gialla
  d.P(GIALLO[2], 24, 45, 8, 4); d.P(GIALLO[4], 24, 45, 8, 1); d.P(GIALLO[0], 24, 48, 8, 1);
  d.P(FERRO[2], 27, 49, 2, 3);
  // tre punti
  d.line(16, 45, 20, 58, FERRO[1], 2); d.line(39, 45, 35, 58, FERRO[1], 2);
  d.P(FERRO[2], 18, 57, 20, 2); d.P(FERRO[3], 18, 57, 20, 1);
  d.line(28, 44, 28, 54, FERRO[2], 2); d.P(GIALLO[2], 17, 56, 3, 3); d.P(GIALLO[2], 36, 56, 3, 3);
  ruggine(d, [[15, 42, 3, 1], [46, 32]]);
  schizzi(d, 13, 12, 40, 32, 5, 10);
  return outline(d.c);
}

// ---------- Attrezzi (di lato, il gancio a destra verso il trattore) ----------
const ATT_ROSSO = ramp('#c03a2a'), ACCIAIO = ramp('#c8ccd4'), STRISCE = ['#d8342a', '#f4f2ea'];
function strisce(d, x, y, w, h) { for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) d.P(STRISCE[((i + j) >> 1) % 2], x + i, y + j); }
function cardano(d, x0, y0, x1, y1) { d.line(x0, y0, x1, y1, FERRO[1], 2); d.line(x0, y0 - 1, x1, y1 - 1, GIALLO[2], 1); }

export function aratro() {
  const d = pen(48, 28), R = ATT_ROSSO, A = ACCIAIO;
  // castello del tre punti (a destra) e trave
  d.poly([[38, 1], [46, 1], [47, 9], [40, 9]], R[1]); d.P(R[3], 39, 1, 7, 1);
  d.P(GIALLO[2], 44, 2, 3, 3); d.P(FERRO[2], 44, 6, 4, 3);
  d.box(3, 3, 37, 5, R); d.P(R[4], 4, 3, 35, 1); d.P(R[0], 3, 7, 37, 1);
  for (const x of [8, 20, 32]) d.P(CROMO[3], x, 5);                // bulloni
  // tre corpi: montante rosso, versoio d'acciaio che si avvita all'indietro, vomere scuro in avanti
  for (const x of [14, 26, 38]) {
    d.P(R[1], x - 1, 8, 3, 9); d.P(R[3], x - 1, 8, 1, 9);
    d.poly([[x + 3, 23], [x + 1, 16], [x - 3, 13], [x - 9, 13], [x - 7, 18], [x - 4, 23]], A[2]);
    d.line(x - 9, 13, x - 3, 13, A[4]); d.line(x - 8, 14, x - 6, 18, A[3]);
    d.line(x - 4, 22, x + 2, 22, A[1]); d.line(x + 1, 16, x + 3, 22, A[0]);
    d.P('#3a3a42', x - 4, 23, 8, 1); d.P(A[4], x + 2, 23, 2, 1);     // vomere
  }
  ruotaPiccola(d, 4, 20, 4.5, '#9a9aa0'); d.line(4, 7, 4, 15, R[1], 2);
  // zolle rivoltate
  for (const [x, y] of [[0, 26], [10, 26], [22, 26]]) { d.P('#6a4a2a', x, y, 5, 2); d.P('#8a6a3a', x + 1, y, 3, 1); }
  return outline(d.c);
}
export function seminatrice() {
  const d = pen(50, 34), G = ramp('#3e8a4a'), Y = ramp('#e8c030');
  // tramoggia a trapezio col coperchio giallo
  d.poly([[4, 4], [38, 4], [35, 15], [7, 15]], G[2]);
  d.P(G[3], 5, 5, 32, 1); d.P(G[1], 8, 14, 27, 1); d.line(36, 5, 34, 14, G[1]);
  d.box(2, 1, 38, 3, Y); d.P(Y[4], 3, 1, 36, 1);
  d.P('#f4ecd6', 11, 7, 20, 6); d.P('#d8ccb0', 11, 12, 20, 1); text(d, 'SEMI', 14, 8, G[0]);
  d.P(FERRO[2], 37, 5, 1, 10); for (let y = 6; y < 15; y += 3) d.P(FERRO[3], 36, y, 3, 1); // scaletta
  // tubi di caduta e assolcatori a disco
  d.P(FERRO[1], 2, 15, 42, 3); d.P(FERRO[2], 2, 15, 42, 1);
  for (let x = 7; x <= 35; x += 7) {
    d.line(x + 1, 18, x, 24, '#2a2a30', 2);
    d.ball(x, 25, 3, 3, CROMO); d.P(CROMO[0], x, 25);
    d.ball(x - 2, 29, 2, 2, GOMMA);                                  // ruotino che chiude il solco
  }
  // tracciafile ripiegato e ruota motrice
  d.line(3, 1, 0, 12, Y[1], 2); d.ball(1, 13, 2, 2, CROMO);
  ruotaPiccola(d, 42, 26, 6, '#e8c030');
  d.P(FERRO[2], 42, 12, 8, 3); d.P(GIALLO[2], 46, 11, 3, 2);
  return outline(d.c);
}
export function falciatrice() {
  const d = pen(54, 26), O = ramp('#e07a2a');
  cardano(d, 52, 5, 34, 11); d.P(FERRO[2], 48, 3, 6, 4);
  // carter arrotondato con le strisce di sicurezza
  d.poly([[4, 10], [8, 7], [42, 7], [45, 10], [45, 16], [4, 16]], O[2]);
  d.P(O[4], 8, 7, 34, 1); d.P(O[3], 5, 9, 39, 1); d.P(O[0], 4, 15, 41, 1);
  strisce(d, 5, 11, 6, 3); strisce(d, 39, 11, 5, 3);
  d.P('#f4ecd6', 13, 9, 25, 7); text(d, 'FALCIA', 14, 10, O[0]);
  d.P(FERRO[2], 24, 4, 4, 3);
  // tendina di gomma nera e dischi che si intravedono
  for (let x = 4; x < 45; x += 2) d.P(x % 4 ? '#2a2a30' : '#3a3a44', x, 16, 2, 3);
  for (let x = 6; x < 44; x += 8) { d.ell(x + 2, 20, 3, 1, CROMO[2]); d.P(CROMO[4], x, 20, 2, 1); }
  d.P(CROMO[1], 2, 21, 44, 1);
  d.P(FERRO[2], 0, 13, 4, 6);                                         // pattino
  return outline(d.c);
}
export function turbina() { // atomizzatore: botte con ventola dietro
  const d = pen(48, 40), W = ramp('#e8e4d8');
  d.ball(25, 16, 15, 11, W);
  d.P('#2f5e9a', 11, 18, 29, 2); d.P('#4a7ab8', 11, 18, 29, 1);
  d.P('#9a968a', 31, 11, 3, 6); d.P('#8ab8d8', 32, 13, 1, 3); // spia del livello
  d.ball(25, 5, 4, 1.8, ramp('#e07a2a')); d.P('#ffb070', 23, 4, 2, 1);   // tappo
  // ventola con la gabbia e il convogliatore
  d.ball(7, 18, 6.5, 12.5, ramp('#4a4a54'));
  d.ell(7, 18, 4, 9, '#2a2a30');
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + 0.4; d.line(7, 18, 7 + Math.cos(a) * 3.5, 18 + Math.sin(a) * 8, '#8a8a94'); }
  d.ball(7, 18, 1.2, 1.2, CROMO);
  for (const y of [7, 13, 19, 25, 30]) { d.P('#e07a2a', 0, y, 2, 2); d.P('#ffb070', 0, y); } // ugelli
  // telaio, cardano e ruota col parafango
  d.P(FERRO[1], 12, 27, 30, 3); d.P(FERRO[2], 12, 27, 30, 1);
  cardano(d, 47, 25, 38, 27);
  ruotaPiccola(d, 27, 32, 7, '#9a9aa0');
  for (let x = 19; x < 36; x++) { const y = 25 - Math.round(Math.sqrt(Math.max(0, 72 - (x - 27) ** 2)) * 0.3); d.P(FERRO[2], x, y, 1, 1); }
  return outline(d.c);
}

// ---------- Attrezzi visti da davanti/dietro (dietro al trattore che va verso la camera o si allontana) ----------
export function aratroFronte() {
  const d = pen(58, 24), R = ATT_ROSSO, A = ACCIAIO;
  d.box(3, 3, 52, 5, R); d.P(R[4], 4, 3, 50, 1);
  d.P(R[1], 24, 0, 10, 4); d.P(GIALLO[2], 27, 0, 4, 2);
  for (const x of [9, 22, 35, 48]) {
    d.P(R[1], x - 1, 8, 3, 7); d.P(CROMO[2], x, 4, 1, 1);
    d.poly([[x - 5, 14], [x + 3, 14], [x + 5, 21], [x - 4, 22]], A[2]);
    d.P(A[4], x - 4, 15, 6, 1); d.P(A[3], x - 4, 16, 2, 4); d.P(A[0], x - 3, 21, 7, 1);
  }
  return outline(d.c);
}
export function seminatriceFronte() {
  const d = pen(58, 30), G = ramp('#3e8a4a'), Y = ramp('#e8c030');
  d.poly([[4, 4], [54, 4], [51, 16], [7, 16]], G[2]); d.P(G[3], 5, 5, 48, 1); d.P(G[1], 8, 15, 42, 1);
  d.box(3, 1, 52, 3, Y); d.P(Y[4], 4, 1, 50, 1);
  d.P('#f4ecd6', 19, 7, 20, 6); text(d, 'SEMI', 21, 8, G[0]);
  d.P(FERRO[1], 2, 16, 54, 3);
  for (let x = 7; x < 52; x += 6) { d.P('#2a2a30', x, 19, 1, 2); d.ball(x, 23, 1.5, 3.5, CROMO); }
  gommaFronte(d, 0, 18, 5, 11); gommaFronte(d, 53, 18, 5, 11);
  return outline(d.c);
}
export function falciatriceFronte() {
  const d = pen(66, 22), O = ramp('#e07a2a');
  d.poly([[3, 7], [7, 4], [59, 4], [63, 7], [63, 13], [3, 13]], O[2]);
  d.P(O[4], 7, 4, 52, 1); d.P(O[3], 4, 6, 58, 1); d.P(O[0], 3, 12, 60, 1);
  strisce(d, 4, 8, 8, 3); strisce(d, 54, 8, 8, 3);
  d.P('#f4ecd6', 21, 6, 25, 7); text(d, 'FALCIA', 22, 7, O[0]);
  d.P(FERRO[2], 29, 0, 8, 5); d.P(GIALLO[2], 31, 0, 4, 2);
  for (let x = 3; x < 63; x += 2) d.P(x % 4 ? '#2a2a30' : '#3a3a44', x, 13, 2, 4);
  d.P(CROMO[2], 1, 17, 64, 2); d.P(CROMO[4], 1, 17, 64, 1);
  for (let x = 2; x < 64; x += 3) d.P(CROMO[0], x, 19, 2, 1);
  return outline(d.c);
}
export function turbinaFronte() {
  const d = pen(42, 42), W = ramp('#e8e4d8');
  d.ball(21, 17, 15, 12, W);
  d.P('#2f5e9a', 7, 21, 28, 2);
  d.ball(21, 5, 4, 1.8, ramp('#e07a2a'));
  // ventola rotonda con le pale
  d.ball(21, 19, 9, 9, ramp('#4a4a54')); d.ell(21, 19, 7, 7, '#2a2a30');
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + 0.3; d.line(21, 19, 21 + Math.cos(a) * 6, 19 + Math.sin(a) * 6, '#8a8a94'); }
  d.ball(21, 19, 1.5, 1.5, CROMO);
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; d.P('#e07a2a', 21 + Math.cos(a) * 10.5, 19 + Math.sin(a) * 10.5, 2, 2); }
  d.P(FERRO[1], 6, 30, 30, 3);
  gommaFronte(d, 2, 29, 6, 12); gommaFronte(d, 34, 29, 6, 12);
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
