// Fuel l'Havana, il benzinaio sulla provinciale (src/benzinaio.js): pixel art HD disegnata via codice,
// stesso stile degli altri fogli (contorno scuro, luce da in alto a sinistra, ombre verso il viola).
//   distributore()     pensilina turchese con le due colonnine (gasolio verde, benzina rossa) e l'insegna (96x72)
//   facciata()         il chiosco con la cassa (facciata per le texture 3D, 5 caselle di larghezza)
import { pen, ramp, outline, text, textWidth } from './kit.js';

const TURCHESE = '#2aa8a0', ROSA = '#ff6a8a', GIALLO = '#f4c430';

// ---------- Pensilina con le colonnine (96x72) ----------
export function distributore() {
  const d = pen(96, 72);
  const T = ramp(TURCHESE), B = ramp('#f4f0e4'), M = ramp('#a8adb4');
  // pilastri
  d.cyl(8, 20, 5, 48, M); d.cyl(83, 20, 5, 48, M);
  // tettoia turchese con la fascia rosa e la scritta
  d.P(T[1], 1, 8, 94, 14); d.P(T[2], 1, 8, 94, 11); d.P(T[3], 1, 8, 94, 2);
  d.P(ROSA, 1, 19, 94, 3); d.P('#ff9ab0', 1, 19, 94, 1);
  const scritta = "FUEL L'HAVANA", w = textWidth(scritta);
  text(d, scritta, 48 - (w >> 1), 11, '#fff6d8', T[0]);
  for (let i = 0; i < 6; i++) d.P('#ffe890', 10 + i * 15, 22, 6, 1);       // luci sotto la tettoia
  // palma in cima (insegna)
  d.line(48, 8, 48, 1, '#6a4a2a', 2);
  for (const [dx, dy] of [[-7, 2], [7, 2], [-5, -1], [5, -1], [0, -2]]) d.line(48, 1, 48 + dx, 1 + dy + 3, '#3e9a3e', 2);
  // isola delle colonnine
  d.P('#c8c0b0', 18, 62, 60, 6); d.P('#e8e0d0', 18, 62, 60, 1); d.P('#e8c030', 18, 67, 60, 1);
  for (let i = 0; i < 8; i++) d.P('#2a2228', 20 + i * 7, 67, 3, 1);
  const colonnina = (x, col, etichetta) => {
    const R = ramp(col), cw = 24;
    d.box(x, 34, cw, 28, R);
    d.P(B[2], x + 3, 36, cw - 6, 9); d.P('#1e3a2a', x + 4, 37, cw - 8, 5); text(d, '1.9', x + 6, 37, '#7aff9a');  // display del prezzo
    text(d, etichetta, x + (cw >> 1) - (textWidth(etichetta) >> 1), 48, '#fff6d8', R[0]);
    d.P(R[0], x + cw - 1, 44, 3, 9); d.P('#2a2a30', x + cw, 53, 2, 7);        // pistola appesa e tubo
    d.P(B[3], x + 6, 56, cw - 12, 3);
  };
  colonnina(21, '#2a8a3a', 'DIESEL');
  colonnina(51, '#c8302a', 'SUPER');
  // tanica rossa e secchio dell'acqua
  d.box(80, 58, 7, 8, ramp('#d8302a')); d.P('#2a2228', 82, 56, 3, 2);
  d.box(13, 60, 5, 6, ramp('#7a8a9a'));
  return outline(d.c);
}

// ---------- Chiosco con la cassa: facciata per le texture 3D (5 caselle) ----------
export function facciata() {
  const hM = 45, hT = 18, W = 5 * 16 + 6, d = pen(W, hT + hM + 1);
  d.c.muro = { x: 3, y: hT, w: 80, h: hM };
  const T = ramp(TURCHESE), I = ramp('#f2dca8');
  // tetto piatto turchese
  d.P(T[1], 0, 4, W, hT - 4); d.P(T[2], 0, 4, W, hT - 7); d.P(T[3], 0, 4, W, 2);
  // muro a intonaco color crema con le righe rosa
  d.P(I[2], 3, hT, 80, hM); d.P(I[3], 3, hT, 1, hM); d.P(I[1], 82, hT, 1, hM);
  d.P(ROSA, 3, hT + hM - 7, 80, 2); d.P(TURCHESE, 3, hT + hM - 5, 80, 5);
  d.g.fillStyle = 'rgba(30,18,40,0.3)'; d.g.fillRect(3, hT, 80, 3);
  // insegna
  const s = "FUEL L'HAVANA", w = textWidth(s) + 8, x = 43 - (w >> 1);
  d.P('#f4ecd6', x - 1, hT + 3, w + 2, 11); d.P(T[2], x, hT + 4, w, 9); d.P(T[3], x, hT + 4, w, 1);
  text(d, s, x + 4, hT + 6, '#fff6d8', T[0]);
  // vetrina con le taniche impilate e la porta
  const V = ramp('#7fa8c8');
  d.P('#ece4d0', 8, hT + 17, 38, 17); d.P(V[2], 9, hT + 18, 36, 15); d.line(12, hT + 31, 22, hT + 19, V[4]);
  for (let i = 0; i < 4; i++) { d.box(12 + i * 8, hT + 26, 6, 7, ramp(i % 2 ? '#c8302a' : '#2a8a3a')); d.P('#2a2228', 14 + i * 8, hT + 25, 2, 1); }
  d.P('#ece4d0', 55, hT + 15, 15, 24); d.P(V[1], 56, hT + 16, 13, 22); d.P(V[3], 57, hT + 17, 3, 20); d.P(GIALLO, 66, hT + 27, 2, 2);
  // cartello del prezzo
  d.P('#f4f0e4', 73, hT + 18, 8, 14); text(d, '1', 75, hT + 20, '#2a8a3a'); text(d, '9', 75, hT + 26, '#c8302a');
  return outline(d.c);
}
