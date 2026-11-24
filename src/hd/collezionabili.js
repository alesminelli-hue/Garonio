// Collezionabili HD (GDD 22): tappi di birra, santini e figurine del 1990.
// Ogni pezzo ha il suo disegno (colori e simbolo presi da STILE[id]).
// pezzo(coll, id, luce): 20x20 per terra (luce = luccichio acceso); il diario usa lo stesso disegno nell'album.
import { pen, ramp, outline, INK } from './kit.js';

const ORO = ramp('#e0b030'), CARTA = ramp('#f2e8d0'), PELLE = ramp('#e8b48a');

// colori e dettagli di ogni pezzo (id di src/data/diario.js)
const STILE = {
  // tappi: col = metallo, segno = colore del disegno al centro, tipo = disegno
  tappo1: { col: '#d8342a', segno: '#f4f2ea', tipo: 'punto', ammaccato: true },
  tappo2: { col: '#3e8a4a', segno: '#f0d050', tipo: 'anello' },
  tappo3: { col: '#a85a2e', segno: '#6a3a1a', tipo: 'ruggine' },
  tappo4: { col: '#e8a0c0', segno: '#e0b030', tipo: 'bolle' },
  tappo5: { col: '#2f5e9a', segno: '#f4f2ea', tipo: 'stella' },
  tappo6: { col: '#e8c030', segno: '#3a2414', tipo: 'B' },
  tappo7: { col: '#e8ecf0', segno: '#3a78c0', tipo: 'onda' },
  tappo8: { col: '#f0c838', segno: '#fff6c0', tipo: 'stella', oro: true },
  // santini: manto, sfondo, simbolo
  santo1: { manto: '#7a5a3a', sfondo: '#a8d0f0', simbolo: 'spiga' },
  santo2: { manto: '#5a4a3a', sfondo: '#f0c878', simbolo: 'maialino' },
  santo3: { manto: '#c83a2e', sfondo: '#b8e0f0', simbolo: 'pastorale' },
  santo4: { manto: '#3a3a4a', sfondo: '#f0b8c8', simbolo: 'rosa' },
  santo5: { manto: '#3e8a4a', sfondo: '#a8c8e8', simbolo: 'bastone' },
  santo6: { manto: '#2f6ab8', sfondo: '#f8e8a0', simbolo: 'occhi' },
  santo7: { manto: '#c83a2e', sfondo: '#c8d8e8', simbolo: 'mantello' },
  santo8: { manto: '#b8bcc4', sfondo: '#f0d090', simbolo: 'drago' },
  // figurine: maglia (righe opzionali), capelli, baffi
  figu1: { maglia: '#f0d030', righe: null, capelli: '#3a2414', baffi: true, guanti: true },
  figu2: { maglia: '#2a5aa8', righe: '#1a1a24', capelli: '#c88a3a' },
  figu3: { maglia: '#c8302a', righe: '#1a1a24', capelli: '#1a1a24', barba: true },
  figu4: { maglia: '#f4f2ea', righe: '#1a1a24', capelli: '#6a4a2a' },
  figu5: { maglia: '#3a8ad8', righe: null, capelli: '#e0b050', lunghi: true },
  figu6: { maglia: '#3e8a4a', righe: '#f4f2ea', capelli: '#2a1a14', baffi: true },
  figu7: { maglia: '#4a4a54', righe: null, capelli: '#9a9aa0', sigaretta: true },
  figu8: { scudetto: true },
};

function luccichio(d, on) {
  if (!on) return;
  d.P('#ffffff', 16, 0, 1, 5); d.P('#ffffff', 14, 2, 5, 1); d.P('#fff6c0', 16, 2);
  d.P('#fff6c0', 2, 5); d.P('#ffffff', 3, 16);
}

// ---------- Tappo a corona, visto di tre quarti ----------
function tappo(d, S) {
  const M = ramp(S.col), cx = 10, cy = 12;
  // bordo zigrinato (fianco del tappo)
  d.ell(cx, cy + 1.5, 7, 4.2, M[0]);
  for (let i = 0; i < 14; i++) {
    const a = Math.PI * (i / 13), x = cx - Math.cos(a) * 6.6, y = cy + 1.5 + Math.sin(a) * 4;
    d.P(i % 2 ? M[1] : M[3], x, y, 1, 2);
  }
  d.ball(cx, cy, 6.2, 3.8, M);                                     // faccia del tappo
  d.ell(cx, cy, 4, 2.3, M[2]);
  d.P(M[4], cx - 4, cy - 2, 3, 1);
  const s = S.segno;
  if (S.tipo === 'punto') { d.ell(cx, cy, 2, 1.2, s); }
  else if (S.tipo === 'anello') { d.ell(cx, cy, 3, 1.8, s); d.ell(cx, cy, 1.8, 0.9, M[2]); }
  else if (S.tipo === 'ruggine') { for (const [x, y] of [[-3, -1], [1, 0], [3, 1], [-1, 2], [2, -2]]) d.P(s, cx + x, cy + y, 2, 1); d.P('#c87a48', cx - 1, cy - 1); }
  else if (S.tipo === 'bolle') { for (const [x, y] of [[-2, 0], [1, -1], [2, 1]]) { d.P(s, cx + x, cy + y); d.P('#fff6c0', cx + x - 1, cy + y - 1); } }
  else if (S.tipo === 'stella') { d.P(s, cx - 1, cy - 2, 2, 5); d.P(s, cx - 3, cy, 6, 1); d.P(s, cx - 2, cy - 1, 4, 3); }
  else if (S.tipo === 'B') { d.P(s, cx - 1, cy - 2, 1, 5); d.P(s, cx, cy - 2, 2, 1); d.P(s, cx, cy, 2, 1); d.P(s, cx, cy + 2, 2, 1); d.P(s, cx + 2, cy - 1); d.P(s, cx + 2, cy + 1); }
  else if (S.tipo === 'onda') { d.P(s, cx - 3, cy, 2, 1); d.P(s, cx - 1, cy - 1, 2, 1); d.P(s, cx + 1, cy, 2, 1); d.P(s, cx + 3, cy - 1); }
  if (S.ammaccato) { d.P(M[0], cx + 2, cy - 3, 3, 1); d.P(M[3], cx + 2, cy - 2, 2, 1); }
  if (S.oro) { d.P('#ffffff', cx - 3, cy - 2, 2, 1); d.P(M[4], cx + 4, cy + 1); }
}

// ---------- Santino: cartoncino con cornice d'oro ----------
function santino(d, S) {
  const x = 4, y = 1, w = 12, h = 17;
  d.P(CARTA[2], x, y, w, h); d.P(CARTA[4], x, y, w, 1); d.P(CARTA[1], x, y + h - 1, w, 1); d.P(CARTA[1], x + w - 1, y, 1, h);
  d.P(ORO[2], x + 1, y + 1, w - 2, h - 2); d.P(ORO[4], x + 1, y + 1, w - 2, 1);
  d.P(S.sfondo, x + 2, y + 2, w - 4, h - 5);
  const cx = x + 6;
  d.ell(cx, y + 4.5, 2.6, 1.2, '#fff0a0');                          // aureola
  d.P(PELLE[2], cx - 1, y + 4, 2, 3); d.P(PELLE[1], cx, y + 6);     // viso
  const M = ramp(S.manto);
  d.poly([[cx - 1, y + 7], [cx + 1, y + 7], [cx + 3.5, y + h - 3], [cx - 3.5, y + h - 3]], M[2]);
  d.P(M[3], cx - 1, y + 8, 1, 5); d.P(M[1], cx + 2, y + 10, 1, 4);
  const sx = x + 9, sy = y + 9;                                     // simbolo nella mano
  ({
    spiga: () => { d.P('#e8c030', sx, sy - 3, 1, 5); d.P('#f8e070', sx - 1, sy - 3); d.P('#f8e070', sx + 1, sy - 2); },
    maialino: () => { d.P('#f0a0b0', x + 3, y + 12, 3, 2); d.P('#d87a90', x + 3, y + 13, 1, 1); },
    pastorale: () => { d.P(ORO[3], sx, sy - 4, 1, 7); d.P(ORO[3], sx - 1, sy - 5, 2, 1); d.P(ORO[3], sx - 1, sy - 4); },
    rosa: () => { d.P('#e03a5a', sx - 1, sy - 1, 2, 2); d.P('#3e8a4a', sx - 1, sy + 1); },
    bastone: () => { d.P('#7a5a3a', sx, sy - 4, 1, 8); d.P('#7a5a3a', x + 3, y + 12, 2, 2); },
    occhi: () => { d.P('#f4f2ea', sx - 1, sy, 3, 2); d.P('#2f6ab8', sx, sy, 1, 1); },
    mantello: () => { d.P('#c83a2e', x + 2, y + 9, 2, 5); d.P('#e86a5a', x + 2, y + 9, 1, 2); },
    drago: () => { d.P('#3e8a4a', x + 3, y + 12, 4, 2); d.P('#5aaa5a', x + 3, y + 12, 1, 1); d.P('#e0302a', x + 2, y + 13); d.P(ORO[4], sx, sy - 4, 1, 7); },
  })[S.simbolo]();
  d.P(CARTA[3], x + 2, y + h - 3, w - 4, 1);                        // scritta sotto
  d.P(CARTA[0], x + 3, y + h - 3, w - 6, 1);
}

// ---------- Figurina del 1990 ----------
function figurina(d, S) {
  const x = 4, y = 1, w = 12, h = 17;
  d.P('#f4f2ea', x, y, w, h); d.P('#ffffff', x, y, w, 1); d.P('#c8c4b8', x, y + h - 1, w, 1); d.P('#c8c4b8', x + w - 1, y, 1, h);
  if (S.scudetto) {
    d.P('#2a5aa8', x + 1, y + 1, w - 2, h - 2);
    const cx = x + 6;
    d.poly([[cx - 4, y + 4], [cx + 4, y + 4], [cx + 4, y + 10], [cx, y + 14], [cx - 4, y + 10]], '#f4f2ea');
    d.P('#3e8a4a', cx - 3, y + 5, 2, 6); d.P('#d8342a', cx + 1, y + 5, 3, 6); d.P('#d8342a', cx, y + 11, 2, 1); d.P('#3e8a4a', cx - 2, y + 11, 2, 1);
    d.P(ORO[4], x + 2, y + 2, 2, 1); d.P(ORO[3], x + 8, y + 2, 2, 1); // brillantini
    d.P('#ffffff', x + 9, y + 13); d.P('#ffffff', x + 2, y + 12);
    return;
  }
  d.P('#9ad0e8', x + 1, y + 1, w - 2, 11);                         // cielo dello stadio
  d.P('#5aa04a', x + 1, y + 10, w - 2, 2);
  const cx = x + 6, M = ramp(S.maglia);
  // spalle e maglia
  d.P(M[2], cx - 4, y + 8, 8, 4); d.P(M[3], cx - 4, y + 8, 8, 1);
  if (S.righe) for (let i = -3; i < 4; i += 2) d.P(S.righe, cx + i, y + 9, 1, 3);
  if (S.guanti) { d.P('#3a3a42', cx - 5, y + 9, 2, 2); d.P('#3a3a42', cx + 3, y + 9, 2, 2); }
  // testa
  d.P(PELLE[2], cx - 2, y + 3, 4, 5); d.P(PELLE[1], cx + 1, y + 4, 1, 4); d.P(PELLE[2], cx - 1, y + 8, 2, 1);
  d.P(S.capelli, cx - 2, y + 2, 4, 2); d.P(S.capelli, cx - 3, y + 3, 1, S.lunghi ? 6 : 2);
  if (S.lunghi) d.P(S.capelli, cx + 2, y + 3, 1, 6);
  d.P(INK, cx - 1, y + 5); d.P(INK, cx + 1, y + 5);
  if (S.baffi) d.P(S.capelli, cx - 1, y + 6, 3, 1);
  if (S.barba) d.P(S.capelli, cx - 2, y + 6, 4, 2);
  if (S.sigaretta) { d.P('#f4f2ea', cx + 2, y + 7, 2, 1); d.P('#f08a20', cx + 4, y + 7); }
  // nome in basso
  d.P(M[2], x + 1, y + 12, w - 2, 4); d.P(M[4], x + 2, y + 13, w - 5, 1); d.P(M[0], x + 2, y + 14, w - 6, 1);
}

export function pezzo(coll, id, luce = false) {
  const d = pen(20, 20), S = STILE[id] || {};
  if (coll === 'tappi') tappo(d, { col: '#e0b030', segno: '#fff0a0', tipo: 'punto', ...S });
  else if (coll === 'santini') santino(d, { manto: '#2f6ab8', sfondo: '#a8d0f0', simbolo: 'spiga', ...S });
  else figurina(d, { maglia: '#d84a3a', capelli: '#3a2414', ...S });
  outline(d.c);
  luccichio(d, luce);
  return d.c;
}

const ID = { tappi: 'tappo', santini: 'santo', figurine: 'figu' };
export const COLLEZIONABILI = ['tappi', 'santini', 'figurine'].flatMap(c =>
  [1, 2, 3, 4, 5, 6, 7, 8].map(i => [`${c} ${i}`, () => pezzo(c, ID[c] + i, i === 8)]));
