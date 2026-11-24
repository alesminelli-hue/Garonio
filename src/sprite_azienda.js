// Sprite HD dell'azienda agricola (src/azienda.js): cartelli con la scritta (Ufficio agricolo, VENDESI,
// AZIENDA AGRICOLA GARONIO, una tabella per struttura col livello) e il leggio del registro della cascina.
// Stile di src/hd/kit.js: contorno scuro, luce da in alto a sinistra, carattere pixel 3x5.
import { pen, ramp, outline, text, textWidth } from './hd/kit.js';

const LEGNO = ramp('#a8743e');

function pali(d, xs, y0, y1) {
  for (const x of xs) { d.P(LEGNO[1], x, y0, 2, y1 - y0); d.P(LEGNO[3], x, y0, 1, y1 - y0); }
}
function tavola(d, x, y, w, h, R) {
  d.P(R[1], x, y, w, h); d.P(R[2], x + 1, y + 1, w - 2, h - 2); d.P(R[3], x + 1, y + 1, w - 2, 1);
}

// cartello di legno con una o due righe di testo. colori: { fondo, testo, ombra }
export function cartelloScritta(righe, { fondo = '#e8d8a8', testo = '#3a2414', ombra = null, pallini = 0, max = 4 } = {}) {
  const w = Math.max(...righe.map(textWidth)) + 8, hTesto = righe.length * 7 + (pallini ? 6 : 0) + 4;
  const H = hTesto + 9, W = Math.max(w, 20);
  const d = pen(W, H);
  pali(d, [3, W - 5], 4, H);
  tavola(d, 0, 0, W, hTesto, ramp(fondo));
  righe.forEach((r, i) => text(d, r, Math.round((W - textWidth(r)) / 2), 3 + i * 7, testo, ombra));
  if (pallini) for (let i = 0; i < max; i++) {
    const x = Math.round(W / 2 - max * 2.5 + i * 5), y = 3 + righe.length * 7;
    d.P(i < pallini ? '#e0b030' : '#7a5a3a', x, y, 3, 3);
    if (i < pallini) d.P('#fff0a0', x, y, 1, 1);
  }
  return outline(d.c);
}

// targa blu del comune, sul fianco del municipio
export function targaUfficio() {
  const d = pen(46, 30), B = ramp('#2a5aa8');
  d.P('#7a7a82', 21, 18, 4, 12); d.P('#a8a8b0', 21, 18, 1, 12);
  tavola(d, 0, 0, 46, 19, B);
  d.P('#e0b030', 2, 2, 42, 1); d.P('#e0b030', 2, 16, 42, 1);
  text(d, 'UFFICIO', 9, 4, '#ffffff', B[0]);
  text(d, 'AGRICOLO', 7, 10, '#ffffff', B[0]);
  return outline(d.c);
}

// VENDESI: cartello storto, con la scritta rossa
export function vendesi() {
  const d = pen(36, 30), R = ramp('#f0ece0');
  pali(d, [16], 12, 30);
  d.poly([[1, 3], [34, 0], [35, 14], [2, 17]], R[1]); d.poly([[2, 4], [33, 1], [34, 13], [3, 16]], R[3]);
  text(d, 'VENDESI', 4, 5, '#c02020');
  d.P('#2a2a2a', 6, 12, 22, 1); d.P('#2a2a2a', 6, 13, 14, 1);                       // il numero di telefono, sbiadito
  return outline(d.c);
}

// AZIENDA AGRICOLA GARONIO, verde con il bordo oro
export function insegnaAzienda() {
  return cartelloScritta(['AZIENDA AGRICOLA', 'GARONIO'], { fondo: '#3a7a3a', testo: '#fff2b0', ombra: '#1a3a1a' });
}

// leggio con il registro aperto
export function registro() {
  const d = pen(20, 24);
  d.P(LEGNO[1], 8, 10, 4, 14); d.P(LEGNO[3], 8, 10, 1, 14);
  d.P(LEGNO[0], 4, 22, 12, 2);
  d.poly([[1, 6], [19, 6], [17, 12], [3, 12]], LEGNO[2]);
  d.poly([[2, 1], [9, 3], [9, 9], [2, 7]], '#f4eedc'); d.poly([[11, 3], [18, 1], [18, 7], [11, 9]], '#e8e0c8');
  for (const y of [3, 5]) { d.P('#7a6a5a', 3, y + 0.5, 5, 1); d.P('#7a6a5a', 12, y, 5, 1); }
  d.P('#c02020', 10, 2, 1, 8);                                                       // il nastrino
  return outline(d.c);
}

// bacheca delle taglie in piazza: sughero, fogli appesi con le puntine, «TAGLIE» in alto
export function bacheca() {
  const d = pen(34, 34);
  pali(d, [4, 28], 18, 34);
  d.P(LEGNO[1], 0, 2, 34, 20); d.P(ramp('#c89a5a')[2], 2, 4, 30, 16);
  d.P(LEGNO[3], 0, 2, 34, 1);
  for (const [x, y, c] of [[4, 8, '#f4f0e4'], [13, 6, '#f8e8a0'], [22, 8, '#f4f0e4']]) {
    d.P(c, x, y, 8, 10); d.P('#7a6a5a', x + 1, y + 3, 6, 1); d.P('#7a6a5a', x + 1, y + 5, 5, 1); d.P('#c02020', x + 3, y, 2, 2);
  }
  d.P('#c02020', 4, 0, 27, 7); text(d, 'TAGLIE', 6, 1, '#fff2b0');
  return outline(d.c);
}
