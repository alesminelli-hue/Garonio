// Sprite dei nemici nuovi e dei tre re (GDD 11.2 e 18.3), in pixel art generata dal codice.
// Ogni funzione disegna l'animale rivolto a DESTRA, con due fotogrammi (frame 0 e 1).
// Il combattimento li specchia verso sinistra (verso Garonio); la mappa usa entrambe le direzioni.
import * as PIX from './pixel.js';
import * as HDA from './hd/animali.js';
import * as HDB from './hd/bestiario.js';

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

// ---------- Bestie ----------
// HD in stile fantasy/anime (src/hd/bestiario.js e src/hd/animali.js), a risoluzione doppia:
// in mappa la misura la dà `mappa` di src/data/bestie.js, nello scontro conta solo l'altezza.
export const { ratto, rattoFogna, reRatti, gazza, piccione, lupoGiovane, lupo, reLupi, cinghialeMaschio } = HDB;
export const nutriaCorazzata = HDA.nutriaCorazzata;
export const reNutrie = HDA.reNutrie;

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
