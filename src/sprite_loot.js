// Sprite del bottino nascosto sugli alberi (src/alberi.js), dei regali di Babbo Natale e dei due incontri speciali
// (src/speciali.js): icone 16x16 per il menu e per la roba che cade dall'albero, più Babbo Natale smemorato
// (che segue Garonio) e il Mostro della Palude (scontro al laghetto). Pixel art generata dal codice.
import * as PIX from './pixel.js';

const OUT = '#1a1420';
function outline(c, color = OUT) {
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
function canvas(w = 16, h = 16) {
  const [c, g] = PIX.makeCanvas(w, h);
  const P = (col, x, y, ww = 1, hh = 1) => { g.fillStyle = col; g.fillRect(x, y, ww, hh); };
  // linea di pixel (manici in diagonale)
  const L = (col, x0, y0, x1, y1, t = 1) => {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
    for (let i = 0; i <= n; i++) P(col, Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), t, t);
  };
  return [c, P, L, g];
}
const LEGNO = '#9a6a3a', LEGNO2 = '#6e4824', FERRO = '#b8c0c8', FERRO2 = '#7a8490', LUCE = '#eef4f8';

// ---------- Attrezzi agricoli (armi) ----------
const ARMI = {
  vanga() {
    const [c, P, L] = canvas();
    L(LEGNO, 3, 2, 10, 9, 2); P(LEGNO2, 1, 1, 5, 2); P(LEGNO2, 2, 0, 2, 4);          // manico con la maniglia a T
    P(FERRO2, 10, 9, 5, 6); P(FERRO, 10, 9, 4, 5); P(LUCE, 11, 10, 1, 3);           // lama piatta
    return outline(c);
  },
  falcetto() {
    const [c, P, L] = canvas();
    L(LEGNO, 2, 13, 6, 9, 2); P(LEGNO2, 2, 14, 2, 1);                                // impugnatura
    L(FERRO, 7, 8, 9, 3); L(FERRO, 9, 3, 12, 1); L(FERRO, 12, 1, 14, 3); L(FERRO, 14, 3, 14, 6);
    L(FERRO2, 8, 8, 10, 4); L(LUCE, 10, 2, 12, 2);                                   // mezzaluna
    return outline(c);
  },
  cesoie() {
    const [c, P, L] = canvas();
    L(FERRO, 7, 8, 13, 2, 2); L(FERRO2, 8, 8, 14, 4, 1);                             // lame
    L(FERRO, 8, 7, 14, 6, 2);
    P('#c03028', 2, 9, 4, 3); P('#c03028', 5, 11, 3, 4); L('#c03028', 5, 9, 7, 8, 2); L('#c03028', 7, 11, 8, 9, 2); // manici rossi
    P(LUCE, 12, 3); P('#3a3a3a', 8, 8);
    return outline(c);
  },
  tridente() {
    const [c, P, L] = canvas();
    L(LEGNO, 1, 15, 9, 7, 2);
    L(FERRO2, 8, 5, 12, 9);                                                           // traversa
    L(FERRO, 8, 5, 12, 1); L(FERRO, 10, 7, 14, 3); L(FERRO, 12, 9, 15, 6);           // tre punte
    P(LUCE, 12, 1); P(LUCE, 14, 3);
    return outline(c);
  },
  scure() {
    const [c, P, L] = canvas();
    L(LEGNO, 2, 14, 11, 5, 2); P(LEGNO2, 2, 14, 2, 2);
    P(FERRO2, 9, 1, 4, 6); P(FERRO, 10, 1, 5, 4); P(FERRO, 13, 0, 2, 6); P(LUCE, 14, 1, 1, 4); // testa della scure
    return outline(c);
  },
  correggiato() {
    const [c, P, L] = canvas();
    L(LEGNO, 1, 15, 7, 9, 2);                                                         // manico lungo
    P('#5a3a1c', 7, 8, 2, 2);                                                         // cinghia di cuoio
    L(LEGNO2, 9, 8, 14, 2, 2); P('#c8a060', 13, 2, 1, 1);                             // bastone che batte
    return outline(c);
  },
  bastoneZucchero() {
    const [c, P, L] = canvas();
    const s = (x, y, i) => P(i % 2 ? '#d02028' : '#fbf6f0', x, y, 2, 2);
    const pts = [[3, 14], [4, 12], [5, 10], [6, 8], [7, 6], [8, 4], [9, 2], [11, 1], [13, 2], [14, 4], [13, 6]];
    pts.forEach(([x, y], i) => s(x, y, i));
    P('#fff', 10, 2); P('#ffe060', 15, 0);                                            // scintilla
    return outline(c);
  },
};

// ---------- Vestiti agricoli e regali ----------
const VESTITI = {
  cappellone() {
    const [c, P] = canvas();
    P('#e8c860', 0, 9, 16, 3); P('#d8b04a', 1, 11, 14, 1);                            // tesa larga
    P('#f0d878', 4, 4, 8, 6); P('#c83028', 4, 8, 8, 1);                               // cupola col nastro
    P('#fff4b0', 5, 5, 2, 1); P('#c8a040', 2, 10, 1, 1); P('#c8a040', 12, 10, 1, 1);
    return outline(c);
  },
  fazzolettoRosso() {
    const [c, P] = canvas();
    for (let y = 0; y < 9; y++) P('#c82828', 1 + y, 3 + y, 14 - 2 * y, 1);            // triangolo
    P('#c82828', 0, 2, 16, 2);
    for (const [x, y] of [[3, 3], [7, 4], [11, 3], [5, 6], [9, 6], [7, 8]]) P('#fbf0e0', x, y);
    return outline(c);
  },
  salopette() {
    const [c, P] = canvas();
    P('#3a5a9a', 3, 6, 10, 9); P('#2a4478', 7, 10, 2, 5);                             // pantalone e cavallo
    P('#3a5a9a', 4, 1, 2, 6); P('#3a5a9a', 10, 1, 2, 6);                              // bretelle
    P('#4a6cb0', 5, 5, 6, 4); P('#e8c050', 4, 6); P('#e8c050', 11, 6);                // pettorina e bottoni
    P('#2a4478', 7, 6, 2, 2);                                                         // taschino
    return outline(c);
  },
  guantiLavoro() {
    const [c, P] = canvas();
    P('#e8b830', 3, 6, 9, 8); P('#c8981c', 3, 12, 9, 2);                              // palmo e polsino
    P('#e8b830', 4, 2, 2, 5); P('#e8b830', 6, 1, 2, 6); P('#e8b830', 8, 2, 2, 5); P('#e8b830', 10, 4, 2, 4); // dita
    P('#e8b830', 12, 7, 2, 3);                                                        // pollice
    P('#fff0a0', 6, 2, 1, 3); P('#a87818', 4, 13, 7, 1);
    return outline(c);
  },
  stivaliGomma() {
    const [c, P] = canvas();
    P('#2e8a3a', 4, 1, 6, 11); P('#2e8a3a', 4, 10, 10, 4);                            // gambale e piede
    P('#4ab050', 5, 2, 1, 8); P('#1e6a28', 4, 13, 10, 2);                             // luce e suola
    P('#1e6a28', 4, 1, 6, 1);
    return outline(c);
  },
  zoccoli() {
    const [c, P] = canvas();
    P('#e8c070', 1, 7, 13, 5); P('#f4d690', 3, 5, 7, 3); P('#c89848', 1, 11, 13, 2); // zoccolo di legno
    P('#e8c070', 12, 6, 3, 4); P('#8a5a28', 4, 7, 5, 2);                              // punta e buco del piede
    P('#c83028', 6, 9, 2, 1); P('#3a6ad0', 9, 9, 2, 1);                               // fiorellini dipinti
    return outline(c);
  },
  giaccaVento() {
    const [c, P] = canvas();
    P('#e86a1a', 3, 3, 10, 11); P('#e86a1a', 0, 4, 3, 9); P('#e86a1a', 13, 4, 3, 9); // giacca e maniche
    P('#c8500e', 7, 3, 2, 11); P('#f0f0f0', 8, 4, 1, 9);                              // zip
    P('#2a5a2a', 5, 2, 6, 2);                                                         // colletto
    P('#ffffff', 4, 8, 2, 1); P('#2a5a2a', 10, 7, 2, 2);                              // logo del consorzio
    return outline(c);
  },
  cappelloNatale() {
    const [c, P] = canvas();
    P('#fbf6f0', 1, 11, 14, 3);                                                       // bordo di pelo
    P('#d02028', 3, 6, 10, 5); P('#d02028', 6, 3, 6, 3); P('#d02028', 11, 2, 3, 2);  // cappello che cade di lato
    P('#fbf6f0', 13, 2, 3, 3);                                                        // pon pon
    P('#ff5a5a', 5, 7, 2, 1);
    return outline(c);
  },
  maglioneRenne() {
    const [c, P] = canvas();
    P('#c02028', 3, 2, 10, 12); P('#c02028', 0, 3, 3, 10); P('#c02028', 13, 3, 3, 10);
    P('#fbf6f0', 3, 4, 10, 1); P('#fbf6f0', 3, 12, 10, 1);                            // greche
    P('#8a5a28', 5, 7, 3, 3); P('#8a5a28', 9, 7, 3, 3); P('#e01010', 6, 9); P('#e01010', 10, 9); // due renne col naso rosso
    P('#5a3a1c', 5, 6); P('#5a3a1c', 7, 6); P('#5a3a1c', 9, 6); P('#5a3a1c', 11, 6);
    P('#2a8a3a', 3, 2, 10, 1);
    return outline(c);
  },
  mantelloAlghe() {
    const [c, P] = canvas();
    P('#3a6a2a', 3, 1, 10, 13); P('#2a5020', 1, 4, 2, 11); P('#2a5020', 13, 4, 2, 11);
    for (let x = 2; x < 15; x += 2) P('#4a8a30', x, 13 + (x % 4 ? 1 : 0), 1, 2);     // frange che gocciolano
    P('#6ab040', 5, 3, 1, 6); P('#6ab040', 9, 5, 1, 5); P('#80d0ff', 11, 10); P('#80d0ff', 4, 12);
    return outline(c);
  },
};

// ---------- Roba che cade dagli alberi ----------
const OGGETTI = {
  mela() {
    const [c, P] = canvas();
    P('#d82828', 3, 5, 10, 9); P('#d82828', 4, 4, 8, 11); P('#ff6a5a', 5, 6, 2, 3);
    P('#6e4824', 8, 1, 1, 4); P('#4ab050', 9, 2, 3, 2);
    return outline(c);
  },
  noci() {
    const [c, P] = canvas();
    for (const [x, y] of [[2, 7], [8, 8], [5, 3]]) { P('#a8783e', x, y, 6, 6); P('#c8984e', x + 1, y + 1, 2, 2); P('#7a5228', x + 3, y, 1, 6); }
    return outline(c);
  },
  pigna() {
    const [c, P] = canvas();
    P('#8a5a2a', 4, 3, 8, 11); P('#8a5a2a', 5, 2, 6, 13);
    for (let y = 3; y < 14; y += 2) for (let x = 5 + (y % 4 ? 1 : 0); x < 11; x += 2) P('#c08a4a', x, y);
    P('#3a7a2a', 7, 0, 2, 2);
    return outline(c);
  },
  nido() {
    const [c, P] = canvas();
    P('#8a6a3a', 1, 7, 14, 6); P('#6e4824', 2, 12, 12, 2); P('#3a2a1a', 3, 7, 10, 2);
    for (let x = 1; x < 15; x += 3) P('#b8925a', x, 8 + (x % 2), 2, 1);
    P('#b8925a', 0, 6, 2, 1); P('#b8925a', 14, 6, 2, 1);
    return outline(c);
  },
  biscotti() {
    const [c, P] = canvas();
    P('#d8a050', 2, 4, 12, 10); P('#d8a050', 3, 3, 10, 12);
    for (const [x, y] of [[5, 6], [9, 5], [7, 9], [11, 10], [4, 11]]) P('#5a3418', x, y, 2, 1);
    P('#f0c870', 4, 4, 3, 1);
    return outline(c);
  },
  carbone() {
    const [c, P] = canvas();
    P('#2a2a30', 2, 6, 12, 8); P('#2a2a30', 4, 4, 8, 11); P('#4a4a56', 5, 6, 3, 2); P('#4a4a56', 9, 9, 2, 2);
    return outline(c, '#000');
  },
};

export const ICONE_LOOT = { ...ARMI, ...VESTITI, ...OGGETTI };

// immagine (dataURL) dell'icona, per il menu; null se non c'è uno sprite per quell'id
const _url = {};
export function iconaUrl(id) {
  if (!ICONE_LOOT[id]) return null;
  return (_url[id] ??= ICONE_LOOT[id]().toDataURL());
}

// ---------- Babbo Natale smemorato (cammina dietro a Garonio): 3 fotogrammi rivolti a destra ----------
export function babbo(f = 0) {
  const [c, P] = canvas(20, 28);
  const passo = f === 1 ? 1 : f === 2 ? -1 : 0;
  P('#d02028', 5, 3, 9, 3); P('#d02028', 12, 1, 4, 3); P('#fbf6f0', 15, 0, 3, 3);   // cappello col pon pon
  P('#fbf6f0', 4, 5, 11, 2);                                                        // bordo di pelo
  P('#f0c0a0', 6, 7, 8, 4); P('#1a1420', 11, 8); P('#f08080', 13, 9, 2, 1);         // faccia, occhio, naso rosso
  P('#fbf6f0', 5, 10, 10, 6); P('#fbf6f0', 6, 16, 8, 2); P('#e8e0d8', 7, 17, 6, 1); // barbone bianco
  P('#d02028', 4, 15, 12, 7); P('#d02028', 3, 16, 2, 5); P('#d02028', 15, 16, 2, 5); // giubba
  P('#1a1420', 4, 19, 12, 2); P('#f0c040', 9, 19, 2, 2);                           // cintura con la fibbia
  P('#fbf6f0', 4, 21, 12, 1); P('#f0c0a0', 15, 20, 2, 2); P('#f0c0a0', 3, 20, 2, 2); // orlo e mani
  P('#d02028', 6, 22, 3, 3 + Math.max(0, -passo)); P('#d02028', 11, 22, 3, 3 + Math.max(0, passo)); // pantaloni
  P('#1a1420', 5, 25 + Math.max(0, -passo) - 0, 4, 2 - Math.max(0, -passo)); P('#1a1420', 11, 25 + Math.max(0, passo), 4, 2 - Math.max(0, passo)); // stivali
  return outline(c);
}
export const babboFrames = () => { const r = [0, 1, 2].map(babbo); return [...r, ...r.map(PIX.mirror)]; };

// ---------- Il Mostro della Palude (lo «zombie verde» del laghetto): 2 fotogrammi rivolti a destra ----------
export function mostroPalude(f = 0) {
  const [c, P] = canvas(30, 40);
  const pelle = '#5a9a3a', pelle2 = '#3e7a2a', pelle3 = '#2a5a1e';
  const b = f;   // il fotogramma 1 si sporge in avanti
  P(pelle2, 9 + b, 4, 12, 11); P(pelle, 10 + b, 5, 10, 8);                          // testone
  P('#e8f040', 16 + b, 8, 3, 2); P('#e8f040', 11 + b, 8, 3, 2); P('#1a1420', 17 + b, 8); P('#1a1420', 12 + b, 9); // occhi gialli storti
  P(pelle3, 11 + b, 12, 9, 2); P('#f0ead0', 12 + b, 12); P('#f0ead0', 15 + b, 12); P('#f0ead0', 18 + b, 12); // bocca coi dentacci
  P('#2a4a1a', 8 + b, 3, 14, 2); P('#4a8a2a', 7 + b, 4, 2, 6); P('#4a8a2a', 21 + b, 4, 2, 8); // alghe sulla testa
  P('#6a5a3a', 6, 15, 18, 13); P('#4e4228', 6, 15, 18, 2);                         // camicia a brandelli di fango
  P(pelle, 9, 17, 3, 3); P(pelle2, 17, 20, 4, 3);                                    // pelle verde dagli strappi
  P(pelle2, 2, 16, 4, 12); P(pelle, 2, 27, 4, 3);                                    // braccio dietro
  P(pelle2, 24 + b, 15, 4, 6); P(pelle2, 25 + b * 2, 20, 4, 4); P(pelle, 26 + b * 2, 23, 3, 3); // braccio teso in avanti
  P('#3a3a5a', 7, 28, 7, 9 - b); P('#3a3a5a', 16, 28, 7, 8 + b);                    // pantaloni zuppi
  P(pelle3, 6, 37 - b, 8, 3); P(pelle3, 16, 36 + b, 8, 3);                           // piedoni palmati
  for (const [x, y] of [[8, 28], [14, 30], [22, 27], [4, 30]]) P('#4a8a2a', x, y, 1, 3); // alghe che pendono
  P('#80d0ff', 23 + b, 22); P('#80d0ff', 5, 31); P('#80d0ff', 19, 37);              // gocce
  return outline(c);
}
