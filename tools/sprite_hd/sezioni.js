// Impagina i fogli d'anteprima (sprite ingranditi + nome sotto).
import { TERRENI } from '../../src/hd/terreno.js';
import { OGGETTI, PAESE, COLTURE } from '../../src/hd/oggetti.js';
import { MEZZI, ATTREZZI, TRAFFICO } from '../../src/hd/mezzi.js';
import { EDIFICI } from '../../src/hd/edifici.js';
import { NUTRIE } from '../../src/hd/animali.js';
import { BESTIARIO } from '../../src/hd/bestiario.js';
import { pezzo } from '../../src/hd/collezionabili.js';
import { COLLEZIONI } from '../../src/data/diario.js';
import { scena } from './scena.js';

const BG = '#3b5182', BG2 = '#34497a';

export function foglio(titolo, voci, { scale = 4, maxW = 1800, gap = 26, sotto = '' } = {}) {
  const items = voci.map(([nome, fn]) => ({ nome, img: typeof fn === 'function' ? fn() : fn }));
  // impaginazione a righe
  const rows = []; let row = [], x = gap, rowH = 0;
  for (const it of items) {
    const w = Math.max(it.img.width * scale, 90), h = it.img.height * scale + 26;
    if (x + w + gap > maxW && row.length) { rows.push({ row, h: rowH }); row = []; x = gap; rowH = 0; }
    row.push({ ...it, x, w }); x += w + gap; rowH = Math.max(rowH, h);
  }
  if (row.length) rows.push({ row, h: rowH });
  const W = Math.min(maxW, Math.max(...rows.map(r => { const l = r.row[r.row.length - 1]; return l.x + l.w + gap; })));
  const H = 64 + rows.reduce((s, r) => s + r.h + gap, 0) + (sotto ? 28 : 0);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  g.fillStyle = BG; g.fillRect(0, 0, W, H);
  g.fillStyle = '#f4ecd6'; g.font = 'bold 24px system-ui, sans-serif'; g.textBaseline = 'top';
  g.fillText(titolo, gap, 18);
  let y = 64;
  for (const r of rows) {
    for (const it of r.row) {
      const iw = it.img.width * scale, ih = it.img.height * scale;
      const ix = it.x + (it.w - iw) / 2, iy = y + (r.h - 26 - ih); // allineati in basso
      g.fillStyle = BG2; g.fillRect(it.x - 6, y - 6, it.w + 12, r.h + 8);
      g.drawImage(it.img, ix, iy, iw, ih);
      g.fillStyle = '#e8e0c8'; g.font = '14px system-ui, sans-serif'; g.textAlign = 'center';
      g.fillText(it.nome, it.x + it.w / 2, y + r.h - 20);
      g.textAlign = 'left';
    }
    y += r.h + gap;
  }
  if (sotto) { g.fillStyle = '#b8c4dc'; g.font = '14px system-ui, sans-serif'; g.fillText(sotto, gap, H - 30); }
  return c;
}

// ripete una casella n×n per far vedere che non ha cuciture
function ripeti(tile, n = 3) {
  const c = document.createElement('canvas'); c.width = tile.width * n; c.height = tile.height * n;
  const g = c.getContext('2d');
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) g.drawImage(tile, x * tile.width, y * tile.height);
  return c;
}

export const SEZIONI = [
  { id: 'scena', render: () => foglio('Prova d\'insieme: un pezzo di paese con i nuovi sprite (zoom 2×)', [['', scena]], { scale: 2, maxW: 1500 }) },
  { id: 'terreno', render: () => foglio('Terreno della mappa (caselle 16×16 ripetute 3×3, zoom 3×)', TERRENI.map(([n, f]) => [n, () => ripeti(f())]), { scale: 3, maxW: 1500 }) },
  { id: 'edifici', render: () => foglio('Edifici (stesse misure della mappa: 16 px = 1 casella · zoom 3×)', EDIFICI, { scale: 3, maxW: 1800 }) },
  { id: 'mezzi', render: () => foglio('Mezzi di Garonio (vuoti: Garonio alla guida si aggiunge come adesso · zoom 4×)', MEZZI, { scale: 4, maxW: 1500 }) },
  { id: 'attrezzi', render: () => foglio('Attrezzi del trattore e traffico del paese (zoom 4×)', [...ATTREZZI, ...TRAFFICO], { scale: 4, maxW: 1700 }) },
  { id: 'nutrie', render: () => foglio('Nutrie (zoom 5×)', NUTRIE, { scale: 5, maxW: 1700 }) },
  { id: 'bestiario', render: () => foglio('Bestiario fantasy (zoom 5×)', BESTIARIO, { scale: 5, maxW: 1800 }) },
  { id: 'collezionabili', render: () => foglio('Collezionabili: tappi, santini e figurine (zoom 6×, l\'ultimo di ogni riga col luccichio)', Object.entries(COLLEZIONI).flatMap(([c, C]) => C.pezzi.map((p, i) => [p.nome, () => pezzo(c, p.id, i === 7)])), { scale: 6, maxW: 1700 }) },
  { id: 'oggetti', render: () => foglio('Oggetti di campagna (zoom 4×)', OGGETTI, { scale: 4, maxW: 1700 }) },
  { id: 'paese', render: () => foglio('Arredo del paese (zoom 4×)', PAESE, { scale: 4, maxW: 1700 }) },
  { id: 'colture', render: () => foglio('Colture: germoglio, crescita, maturo (zoom 5×)', COLTURE, { scale: 5, maxW: 1700 }) },
];
