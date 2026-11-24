// Sprite dei boss delle missioni secondarie (src/data/boss.js) e dei loro tirapiedi, in pixel art generata dal codice.
// Stesse regole di src/sprite_bestie.js: animale rivolto a DESTRA, due fotogrammi (0 e 1),
// il combattimento li specchia verso Garonio. I boss umani usano invece gli sprite dei personaggi (src/pixel.js).
import * as PIX from './pixel.js';
import * as SB from './sprite_bestie.js';

function outline(c, color = '#1a1420') {
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

function canvas(w, h) {
  const [c, g] = PIX.makeCanvas(w, h);
  const P = (col, x, y, ww, hh) => { g.fillStyle = col; g.fillRect(x, y, ww, hh); };
  return [c, P, g];
}

// ---------- Casa: il Tasso ladro di salami ----------
export function tasso(f = 0) {
  const [c, P] = canvas(30, 17);
  P('#5a5a5e', 0, 7, 4, 3);                                             // codino
  P('#5a5a5e', 3, 4, 19, 9); P('#74747a', 4, 4, 15, 3);                 // corpo grigio
  P('#2a2a2e', 4, 11, 16, 2);                                           // pancia scura
  P('#f4f0e8', 19, 3, 9, 8); P('#1e1e22', 21, 4, 5, 2); P('#1e1e22', 21, 8, 5, 2); // muso a strisce
  P('#f4f0e8', 19, 6, 9, 2);
  P('#1e1e22', 28, 7, 2, 2);                                            // naso
  P('#e03030', 24, 5, 1, 1);                                            // occhio cattivo
  P('#c0504a', 23, 10, 6, 3); P('#e8c0a0', 24, 10, 4, 1);               // salame in bocca
  P('#2a2a2e', 5, 13, 3, 4 - f); P('#2a2a2e', 16, 13, 3, 3 + f);        // zampe con unghioni
  P('#e8e0d0', 18, 16 + f - 1, 2, 1);
  return outline(c);
}

// ---------- Pollaio: la Faina argentata ----------
export function faina(f = 0) {
  const [c, P] = canvas(32, 14);
  P('#c8ccd4', 0, 4 - f, 8, 3); P('#ffffff', 0, 4 - f, 3, 2);           // coda folta
  P('#a8acb8', 7, 5, 16, 5); P('#e8ecf4', 10, 8, 10, 2);                // corpo lungo e basso
  P('#a8acb8', 21, 2, 7, 6); P('#e8ecf4', 25, 5, 5, 3);                 // testa
  P('#a8acb8', 21, 0, 2, 2); P('#a8acb8', 25, 0, 2, 2);                 // orecchie
  P('#ff3040', 24, 3, 1, 1); P('#1a1420', 30, 5, 1, 1);                 // occhio rosso, naso
  P('#f4f0e8', 28, 8, 2, 2); P('#f0c040', 28, 9, 1, 1);                 // un uovo rubato
  P('#6a6e78', 9, 10, 2, 4 - f); P('#6a6e78', 19, 10, 2, 3 + f);
  return outline(c);
}

// ---------- Cascina del Patata: la Dorifora regina ----------
export function dorifora(f = 0, piccola = false) {
  const k = piccola ? 0.5 : 1;
  const W = Math.round(30 * k) + 2, H = Math.round(20 * k) + 2;
  const [c, P] = canvas(W, H);
  const S = (col, x, y, w, h) => P(col, Math.round(x * k), Math.round(y * k), Math.max(1, Math.round(w * k)), Math.max(1, Math.round(h * k)));
  S('#e8b830', 3, 4, 20, 12); S('#f4d050', 5, 4, 14, 3);                // guscio giallo
  for (let x = 5; x < 22; x += 4) S('#1e1a14', x, 4, 2, 12);            // strisce nere
  S('#d07020', 21, 6, 7, 8); S('#1e1a14', 22, 7, 2, 2); S('#1e1a14', 25, 9, 2, 2); // testa arancio a pois
  S('#ffffff', 26, 7, 1, 1);                                            // occhietto
  S('#1e1a14', 28, 4 - f, 1, 3); S('#1e1a14', 26, 3 + f, 1, 3);         // antenne
  for (let x = 6; x < 22; x += 5) S('#1e1a14', x, 16, 1, 3 - ((x / 5 + f) % 2)); // zampette
  if (!piccola) { S('#f0d050', 9, 0, 8, 3); S('#e03030', 12, 1, 2, 1); } // corona
  return outline(c);
}
export const doriforaPiccola = f => dorifora(f, true);

// ---------- Chiesa: il Pipistrellone del campanile ----------
export function pipistrello(f = 0, piccolo = false) {
  const k = piccolo ? 0.5 : 1;
  const W = Math.round(36 * k) + 2, H = Math.round(22 * k) + 2;
  const [c, P] = canvas(W, H);
  const S = (col, x, y, w, h) => P(col, Math.round(x * k), Math.round(y * k), Math.max(1, Math.round(w * k)), Math.max(1, Math.round(h * k)));
  const ala = f ? 0 : 4;
  S('#3a2a3e', 0, 4 + ala, 13, 6); S('#2a1e2e', 2, 10 + ala, 3, 3); S('#2a1e2e', 7, 10 + ala, 3, 3);   // ala sinistra
  S('#3a2a3e', 23, 4 + ala, 13, 6); S('#2a1e2e', 26, 10 + ala, 3, 3); S('#2a1e2e', 31, 10 + ala, 3, 3); // ala destra
  S('#5a4060', 4, 5 + ala, 6, 2); S('#5a4060', 26, 5 + ala, 6, 2);
  S('#4a3450', 13, 5, 10, 12); S('#6a5070', 15, 9, 6, 6);               // corpo
  S('#4a3450', 13, 0, 3, 6); S('#4a3450', 20, 0, 3, 6);                 // orecchie a punta
  S('#ff4030', 15, 7, 2, 1); S('#ff4030', 19, 7, 2, 1);                 // occhi
  S('#f4ead8', 16, 10, 1, 2); S('#f4ead8', 19, 10, 1, 2);               // dentini
  S('#2a1e2e', 15, 17, 2, 3); S('#2a1e2e', 19, 17, 2, 3);               // zampette
  return outline(c);
}
export const pipistrelloPiccolo = f => pipistrello(f, true);

// ---------- Ranch di Frank: il toro «Dollaro» ----------
export function toro(f = 0) {
  const [c, P] = canvas(36, 24);
  P('#2e2420', 0, 7 + f, 3, 1); P('#2e2420', 0, 7 + f, 1, 4);           // coda
  P('#3a2e28', 3, 6, 22, 12); P('#524238', 4, 6, 18, 3);                // corpo massiccio
  P('#4a3a30', 18, 3, 8, 7);                                            // gobba
  P('#3a2e28', 24, 6, 9, 10); P('#8a6a5a', 29, 11, 5, 5);               // testa e muso
  P('#f4ead8', 23, 3, 2, 3); P('#f4ead8', 22, 2, 2, 1); P('#f4ead8', 31, 3, 2, 3); P('#f4ead8', 32, 2, 2, 1); // corna
  P('#ff3020', 27, 8, 2, 1);                                            // occhio furioso
  P('#f0c040', 31, 14, 2, 2);                                           // anello al naso
  P('#e8e0d0', 7, 9, 4, 3);                                             // marchio a forma di $
  P('#2a7a3a', 8, 10, 2, 1);
  P('#2a201c', 5, 18, 3, 6 - f); P('#2a201c', 19, 18, 3, 5 + f);
  P('#1a1410', 4, 23 - f, 5, 1); P('#1a1410', 18, 23, 5, 1);            // zoccoli
  return outline(c);
}

// ---------- Laghetto: il Siluro ----------
export function siluro(f = 0) {
  const [c, P] = canvas(40, 18);
  P('#4a5a4a', 0, 5 - f, 6, 8); P('#3a4a3a', 0, 4 - f, 3, 10);          // coda
  P('#5a6a52', 5, 4, 26, 10); P('#7a8a6a', 6, 4, 22, 3);                // corpo lungo
  P('#c8c8a8', 8, 11, 20, 3);                                           // pancia chiara
  for (let x = 8; x < 28; x += 5) P('#3a4a3a', x, 7, 2, 2);             // macchie
  P('#5a6a52', 30, 5, 9, 9); P('#3a2a28', 34, 10, 5, 2);                // testone e bocca
  P('#f0d050', 33, 7, 2, 2); P('#1a1420', 34, 7, 1, 1);                 // occhio
  P('#2a3a2a', 37, 12, 1, 6 - f); P('#2a3a2a', 35, 12, 1, 5); P('#2a3a2a', 38, 4, 2, 1); // baffi
  P('#3a78c0', 2, 15, 4, 1); P('#3a78c0', 24, 16, 5, 1);                // acqua
  P('#4a5a4a', 16, 1 + f, 6, 3);                                        // pinna dorsale
  return outline(c);
}

// ---------- Deposito di casa: la Regina dei calabroni ----------
export function calabrone(f = 0, regina = true) {
  const k = regina ? 1 : 0.5;
  const W = Math.round(30 * k) + 2, H = Math.round(26 * k) + 2;
  const [c, P] = canvas(W, H);
  const S = (col, x, y, w, h) => P(col, Math.round(x * k), Math.round(y * k), Math.max(1, Math.round(w * k)), Math.max(1, Math.round(h * k)));
  S('#d8ecf8', 8, 0 + f * 2, 8, 7); S('#d8ecf8', 14, 1 - f, 7, 6);       // ali trasparenti
  S('#e8a020', 2, 9, 16, 11); for (let x = 4; x < 18; x += 4) S('#2a1a10', x, 9, 2, 11); // addome a strisce
  S('#1a1008', 0, 13, 3, 2);                                            // pungiglione
  S('#5a3a1a', 17, 9, 6, 8);                                            // torace
  S('#e8a020', 22, 8, 7, 8); S('#1a1008', 25, 9, 3, 3);                 // testa e occhio
  S('#1a1008', 27, 4, 1, 4); S('#1a1008', 24, 4, 1, 4);                 // antenne
  S('#1a1008', 8, 20, 1, 4 - f); S('#1a1008', 13, 20, 1, 3 + f); S('#1a1008', 19, 17, 1, 4);
  if (regina) { S('#f0d050', 22, 4, 6, 2); S('#e03030', 24, 4, 1, 1); }
  return outline(c);
}
export const calabronePiccolo = f => calabrone(f, false);

// ---------- Cascina del Postino: Brutus ----------
export function brutus(f = 0) {
  const fatto = PIX.animale?.('cane', f, 30, 22, { tinta: '#3a2c22' });
  if (fatto) {   // il cane disegnato dell'atlante, scuro, con un collare borchiato
    const [c, , g] = canvas(fatto.width, fatto.height);
    g.drawImage(fatto, 0, 0);
    return c;
  }
  const [c, P] = canvas(30, 20);
  P('#3a2c22', 0, 5 + f, 4, 2);                                         // coda
  P('#3a2c22', 3, 6, 17, 8); P('#5a4434', 4, 6, 13, 2);                 // corpo
  P('#3a2c22', 18, 2, 9, 9); P('#5a4434', 24, 6, 5, 4);                 // testone
  P('#2a1e18', 18, 2, 3, 5);                                            // orecchio
  P('#ff3020', 22, 4, 2, 1); P('#1a1420', 28, 6, 1, 1);
  P('#f4ead8', 25, 10, 1, 2); P('#f4ead8', 27, 10, 1, 2);               // denti
  P('#c02020', 17, 10, 4, 2); P('#e0e0e0', 18, 10, 1, 1); P('#e0e0e0', 20, 10, 1, 1); // collare borchiato
  P('#2a1e18', 5, 14, 3, 6 - f); P('#2a1e18', 15, 14, 3, 5 + f);
  return outline(c);
}

// ---------- Piazza: il Generale Piccione ----------
export function generalePiccione(f = 0) {
  const base = SB.piccione(f);
  const k = 2;
  const [c, P, g] = canvas(base.width * k + 2, base.height * k + 6);
  g.imageSmoothingEnabled = false;
  g.drawImage(base, 0, 0, base.width, base.height, 0, 6, base.width * k, base.height * k);
  const hx = Math.round(base.width * k * 0.62);
  P('#3a5a3a', hx - 2, 2, 10, 4); P('#2a402a', hx - 4, 5, 14, 2);        // berretto da generale
  P('#f0d050', hx + 2, 3, 2, 2);                                        // stelletta
  P('#f0d050', Math.round(base.width * k * 0.35), Math.round(base.height * k * 0.55) + 6, 3, 2); // medaglie
  P('#e03030', Math.round(base.width * k * 0.35) + 4, Math.round(base.height * k * 0.55) + 6, 3, 2);
  return outline(c);
}

// ---------- Ritocchi ----------
// ingresso della tana di un boss sulla mappa: un segno rosso a terra (croce) che lampeggia
export function segnoBoss() {
  const [c, P] = canvas(16, 10);
  P('#c01828', 2, 4, 12, 2); P('#c01828', 7, 0, 2, 10);
  P('#ff5060', 3, 4, 10, 1); P('#ff5060', 7, 1, 1, 8);
  return outline(c);
}

// ---------- Laghetto (incontro speciale, src/speciali.js): il Mostro della Palude ----------
export { mostroPalude } from './sprite_loot.js';
