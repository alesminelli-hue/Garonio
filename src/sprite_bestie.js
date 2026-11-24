// Sprite dei nemici nuovi e dei tre re (GDD 11.2 e 18.3), in pixel art generata dal codice.
// Ogni funzione disegna l'animale rivolto a DESTRA, con due fotogrammi (frame 0 e 1).
// Il combattimento li specchia verso sinistra (verso Garonio); la mappa usa entrambe le direzioni.
import * as PIX from './pixel.js';
import * as HDA from './hd/animali.js';

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
  return [c, P];
}

// ---------- Ratti ----------
export function ratto(f = 0) {
  const [c, P] = canvas(17, 9);
  P('#d89aa0', 0, 6 - f, 5, 1); P('#d89aa0', 4, 5, 2, 1);              // coda rosa
  P('#6e6660', 5, 3, 8, 4); P('#827a72', 6, 3, 5, 1);                   // corpo
  P('#6e6660', 12, 2, 4, 4); P('#d89aa0', 16, 4, 1, 1);                 // testa e naso
  P('#a89088', 12, 1, 2, 2);                                            // orecchio
  P('#e03030', 14, 3, 1, 1);                                            // occhietto
  P('#3a3430', 6, 7, 1, 2 - f); P('#3a3430', 11, 7, 1, 1 + f);          // zampe
  return outline(c);
}

export function rattoFogna(f = 0) {
  const [c, P] = canvas(24, 13);
  P('#c08890', 0, 8 - f, 6, 2); P('#c08890', 5, 7, 2, 1);
  P('#4a5240', 6, 3, 12, 7); P('#5c6650', 7, 3, 8, 2);                  // corpo verdastro
  for (let x = 8; x < 17; x += 3) P('#363c2e', x, 2, 1, 2);             // pelo ritto
  P('#4a5240', 16, 2, 6, 6); P('#c08890', 22, 5, 2, 2);                 // testa
  P('#8a9a70', 16, 0, 2, 3);                                            // orecchio rosicchiato
  P('#ff4020', 19, 3, 2, 1);                                            // occhi rossi
  P('#f4ead8', 21, 7, 1, 2);                                            // dente
  P('#9ad040', 20, 9, 1, 1 + f);                                        // bava verde
  P('#2a2e22', 8, 10, 2, 3 - f); P('#2a2e22', 15, 10, 2, 2 + f);
  return outline(c);
}

export function reRatti(f = 0) {
  const [c, P] = canvas(34, 26);
  P('#d89aa0', 0, 20 - f, 8, 2); P('#d89aa0', 7, 18, 2, 3);             // coda
  P('#a02028', 6, 9, 6, 13);                                            // mantello rosso
  P('#e8e0d0', 6, 9, 6, 2);                                             // bordo d'ermellino
  P('#5c5650', 9, 10, 15, 12); P('#746c64', 10, 10, 11, 3);             // corpo
  P('#c8b8a8', 15, 15, 7, 5);                                           // pancia
  P('#5c5650', 20, 5, 10, 9); P('#d89aa0', 30, 10, 2, 2);               // testa
  P('#a89088', 20, 3, 3, 4); P('#a89088', 26, 3, 3, 3);                 // orecchie
  P('#f0d050', 21, 0, 8, 3); P('#f0d050', 21, 0, 1, 1);                 // corona
  P('#e0b030', 22, -1 + 1, 1, 1); P('#e03030', 24, 1, 2, 1);            // gemma
  P('#ffe040', 25, 7, 2, 2); P('#1a1420', 26, 8, 1, 1);                 // occhio giallo
  P('#f4ead8', 28, 12, 1, 2); P('#f4ead8', 30, 12, 1, 2);               // dentoni
  P('#3a3430', 12, 22, 3, 4 - f); P('#3a3430', 20, 22, 3, 3 + f);       // zampe
  P('#c8a040', 31, 14 - f, 1, 6); P('#f0d050', 30, 13 - f, 3, 2);       // scettro (uno stuzzicadenti d'oro)
  return outline(c);
}

// ---------- Uccelli ----------
export function gazza(f = 0) {
  const [c, P] = canvas(18, 14);
  P('#1a1a2a', 0, 7, 6, 2);                                             // coda lunga
  P('#2a6ab0', 1, 7, 4, 1);                                             // riflesso blu
  P('#1a1a2a', 5, 5, 8, 5); P('#f4f4f4', 7, 8, 5, 2);                   // corpo e pancia bianca
  P('#f4f4f4', 6, 5, 4, 2);                                             // spalla bianca
  P('#1a1a2a', 12, 2, 4, 4); P('#3a3a3a', 16, 3, 2, 1);                 // testa e becco
  P('#ffffff', 14, 3, 1, 1);                                            // occhio furbo
  if (f) { P('#1a1a2a', 6, 1, 6, 4); P('#2a6ab0', 7, 1, 4, 1); }        // ala su
  else { P('#2a6ab0', 7, 6, 5, 1); }
  P('#3a3a3a', 9, 10, 1, 3); P('#3a3a3a', 11, 10, 1, 3);
  P('#f0d050', 16, 5, 2, 1);                                            // anello rubato nel becco
  return outline(c);
}

export function piccione(f = 0) {
  const [c, P] = canvas(15, 12);
  P('#7a8090', 0, 6, 4, 2);                                             // coda
  P('#9aa0b0', 3, 4, 8, 5); P('#b0b6c4', 4, 5, 5, 2);                   // corpo grigio
  P('#5a9a7a', 9, 3, 3, 3); P('#8a5aa0', 9, 5, 3, 1);                   // collo cangiante
  P('#8a90a0', 10, 0, 4, 4); P('#e0c8a0', 14, 2, 1, 1);                 // testa e becco
  P('#ff8020', 12, 1, 1, 1);                                            // occhio arancio
  if (f) P('#6a7080', 4, 1, 5, 3); else P('#6a7080', 4, 5, 5, 1);       // ala
  P('#d06070', 6, 9, 1, 3); P('#d06070', 8, 9, 1, 3);                   // zampette rosa
  return outline(c);
}

// ---------- Nutrie ----------
// HD in src/hd/animali.js (risoluzione doppia: in mappa la misura la dà `mappa` di src/data/bestie.js)
export const nutriaCorazzata = HDA.nutriaCorazzata;
export const reNutrie = HDA.reNutrie;

// ---------- Lupi ----------
function wolf(f, big, colBody, colLight, colDark) {
  const W = big ? 28 : 24, Hh = big ? 17 : 15;
  const [c, P] = canvas(W, Hh);
  const k = big ? 1 : 0;
  P(colBody, 0, 4 + f, 6, 3); P(colLight, 0, 4 + f, 2, 2);              // coda
  P(colBody, 5, 5, 13 + k * 2, 6 + k); P(colLight, 7, 9 + k, 8, 2);     // corpo
  P(colDark, 6, 5, 11, 1);                                              // schiena scura
  P(colBody, 16 + k * 2, 2, 6 + k, 6); P(colLight, 20 + k * 2, 5, 4 + k, 2); // testa e muso
  P(colBody, 17 + k * 2, 0, 2, 2); P(colBody, 20 + k * 2, 0, 2, 2);     // orecchie
  P('#f0d050', 19 + k * 2, 3, 1, 1); P('#1a1420', 23 + k * 3, 5, 1, 1); // occhio giallo, naso
  P(colDark, 6, 11 + k, 2, 4 - f); P(colDark, 15, 11 + k, 2, 3 + f);    // zampe
  return outline(c);
}
export const lupoGiovane = f => wolf(f, false, '#9a9a9a', '#d0ccc4', '#6a6a6a');
export const lupo = f => wolf(f, true, '#5a5a62', '#a8a4a0', '#34343a');

export function reLupi(f = 0) {
  const [c, P] = canvas(36, 28);
  P('#d8dce8', 0, 8 + f, 8, 4); P('#ffffff', 0, 8 + f, 3, 2);           // coda
  P('#c0c4d0', 7, 10, 18, 10); P('#e8ecf4', 9, 16, 12, 3);              // corpo argento
  P('#9aa0b0', 8, 10, 16, 2);
  P('#c0c4d0', 20, 3, 9, 11); P('#e8ecf4', 26, 8, 6, 4);                // testa alzata (ulula)
  P('#c0c4d0', 21, 0, 3, 4); P('#c0c4d0', 26, 0, 3, 4);                 // orecchie
  P('#60e0ff', 24, 5, 2, 1); P('#1a1420', 31, 9, 1, 1);                 // occhi di ghiaccio
  P('#f4ead8', 28, 12, 1, 2); P('#f4ead8', 30, 12, 1, 2);
  for (let x = 9; x < 24; x += 4) P('#7a8090', x, 12, 1, 3);            // cicatrici
  P('#9aa0b0', 9, 20, 3, 8 - f * 2); P('#9aa0b0', 20, 20, 3, 6 + f * 2); // zampe lunghe
  return outline(c);
}

// ---------- Cinghiale maschio ----------
export function cinghialeMaschio(f = 0) {
  const [c, P] = canvas(32, 20);
  P('#3a2e24', 2, 5, 21, 11); P('#4e3e30', 3, 5, 17, 3);                // corpo
  for (let x = 4; x < 21; x += 2) P('#1e1812', x, 3, 1, 3);             // cresta di setole
  P('#3a2e24', 21, 6, 9, 9); P('#6a5040', 27, 10, 4, 4);                // testa e grugno
  P('#f4ead8', 25, 12, 1, 5); P('#f4ead8', 30, 11, 1, 4);               // zanne lunghe
  P('#f4ead8', 24, 16, 2, 1);
  P('#ff3020', 24, 8, 2, 1);                                            // occhio furioso
  P('#8a6a50', 9, 9, 6, 1);                                             // cicatrice
  P('#1e1812', 0, 7, 2, 1);
  P('#1e1812', 4, 16, 3, 4 - f); P('#1e1812', 17, 16, 3, 3 + f);
  return outline(c);
}

// ---------- Scenografia ----------
// mucchio di grano dove si nasconde il Re dei Ratti (fase 2)
export function mucchioGrano(f = 0) {
  const [c, P] = canvas(30, 18);
  P('#c89a40', 2, 10, 26, 8); P('#d8b050', 5, 6, 20, 6); P('#e8c870', 9, 3, 12, 4); P('#f0d890', 12, 1, 6, 3);
  for (let i = 0; i < 14; i++) P('#a87a30', 3 + (i * 7) % 24, 8 + (i * 5) % 9, 1, 1);
  P('#5c5650', 13 + f * 3, 2, 4, 2);                                    // spunta qualcosa...
  P('#ffe040', 14 + f * 3, 2, 1, 1);
  return outline(c);
}

// segni sulla mappa: tracce e ingressi delle tane
export function traccia(tipo) {
  const [c, P] = canvas(16, 12);
  if (tipo === 'sacco') { P('#d8c8a0', 2, 2, 11, 9); P('#b8a880', 2, 2, 11, 2); P('#e8d070', 12, 8, 3, 3); P('#e8d070', 1, 10, 2, 1); P('#3a3430', 9, 6, 2, 2); }
  else if (tipo === 'impronte') { for (const [x, y] of [[1, 8], [5, 5], [9, 8], [13, 5]]) { P('#5a5a62', x, y, 2, 2); P('#5a5a62', x - 1, y - 1, 1, 1); P('#5a5a62', x + 2, y - 1, 1, 1); } }
  else if (tipo === 'argine') { P('#7a5434', 0, 4, 16, 8); P('#3a78c0', 4, 6, 8, 4); P('#2a5a90', 6, 7, 4, 2); P('#6a5a3a', 0, 4, 16, 1); }
  else if (tipo === 'grano') { P('#3a78c0', 0, 6, 16, 6); for (let x = 1; x < 16; x += 3) P('#d8b850', x, 2 + (x % 2), 1, 6); }
  else if (tipo === 'maialino') { P('#f0a8b0', 4, 4, 9, 6); P('#f0a8b0', 12, 3, 3, 4); P('#1a1420', 13, 4, 1, 1); P('#d08890', 2, 5, 2, 1); P('#d08890', 5, 10, 1, 2); P('#d08890', 11, 10, 1, 2); }
  else if (tipo === 'osso') { P('#f4ead8', 3, 5, 10, 2); P('#f4ead8', 2, 4, 2, 4); P('#f4ead8', 12, 4, 2, 4); P('#c0302a', 6, 8, 3, 1); }
  else { P('#c8b8a8', 4, 4, 8, 6); }
  return outline(c);
}

export function ingresso(tipo) {
  if (tipo === 'grata') {
    const [c, P] = canvas(18, 10);
    P('#3a3e44', 0, 2, 18, 8); for (let x = 2; x < 17; x += 3) P('#1a1c20', x, 3, 1, 6);
    P('#6a7078', 0, 2, 18, 1); P('#e03030', 8, 5, 1, 1); P('#e03030', 11, 5, 1, 1); // occhi nel buio
    return outline(c);
  }
  if (tipo === 'ponte') {
    const [c, P] = canvas(20, 12);
    P('#2a2420', 2, 2, 16, 10); P('#3a78c0', 0, 9, 20, 3); P('#6a5a3a', 0, 0, 20, 3);
    P('#f08a1c', 9, 6, 1, 2); P('#f08a1c', 11, 6, 1, 2);                // denti nel buio
    return outline(c);
  }
  // rovi della radura
  const [c, P] = canvas(22, 16);
  P('#2e4a24', 0, 4, 22, 12); P('#3e6a2e', 2, 2, 8, 8); P('#3e6a2e', 12, 1, 9, 9);
  for (let i = 0; i < 10; i++) P('#7a2a3a', 1 + (i * 5) % 20, 3 + (i * 3) % 11, 1, 1);
  P('#60e0ff', 9, 9, 1, 1); P('#60e0ff', 12, 9, 1, 1);
  return outline(c);
}
