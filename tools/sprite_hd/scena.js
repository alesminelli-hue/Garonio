// Scena di prova: un pezzo di paese montato con i nuovi sprite, per vedere se stanno bene insieme.
import { pen } from './kit.js';
import * as TR from './terreno.js';
import * as OG from './oggetti.js';
import * as MZ from './mezzi.js';
import * as ED from './edifici.js';

const T = 16;
function flipV(src) { const d = pen(src.width, src.height); d.g.translate(0, src.height); d.g.scale(1, -1); d.g.drawImage(src, 0, 0); return d.c; }

export function scena() {
  const CW = 44, CH = 20;
  const d = pen(CW * T, CH * T), g = d.g;
  const tiles = {
    g0: TR.erba(0), g1: TR.erba(1), g2: TR.erba(2), w0: TR.acqua(0), ri: TR.riva(0), rb: flipV(TR.riva(0)),
    as: TR.asfalto(false), ar: TR.asfalto(false, 1), mz: TR.asfalto(true), ma: TR.marciapiede(), pz: TR.piazza(),
    gh: TR.ghiaia(), gr: TR.grano(true), at: TR.arato(), zo: TR.zolla(false), zb: TR.zolla(true), st: TR.sterrato(1), sv: TR.sterrato(0),
  };
  const map = (x, y) => {
    if (y === 0) return 'ri';
    if (y === 1) return 'w0';
    if (y === 2) return 'rb';
    if (y >= 4 && y <= 8 && x >= 26 && x <= 33) return 'gr';
    if (y >= 4 && y <= 8 && x >= 35) return 'at';
    if (y >= 3 && y <= 9 && x === 34) return 'sv';
    if (y === 9 && x < 25) return 'ma';
    if (y >= 6 && y <= 8 && x >= 9 && x <= 12) return 'pz';
    if (y === 10 || y === 12) return (x * 7 + y) % 11 === 0 ? 'ar' : 'as';
    if (y === 11) return 'mz';
    if (y >= 16 && x >= 1 && x <= 22) return 'gh';
    if (y >= 14 && y <= 17 && x >= 27 && x <= 32) return (x + y) % 3 ? 'zo' : 'zb';
    if (y >= 13 && x === 24) return 'sv';
    const h = (x * 31 + y * 17) % 23;
    return h === 0 ? 'g1' : h === 5 ? 'g2' : 'g0';
  };
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) g.drawImage(tiles[map(x, y)], x * T, y * T);

  // oggetti: [immagine, x centro (caselle), y base (caselle)]
  const items = [];
  const put = (img, x, y) => items.push({ img, x: x * T, y: y * T });
  put(ED.bar(), 4.1, 9); put(ED.alimentari(), 18, 9);
  put(ED.casa(), 6.5, 18); put(ED.officina(), 16, 18);
  for (const x of [2, 9, 16, 23, 30, 37, 42]) put(OG.pioppo(x), x + 0.5, 3.6);
  put(OG.quercia(1), 23.5, 7.5); put(OG.quercia(3, true), 38.5, 18.5); put(OG.quercia(7), 0.8, 19.6);
  put(OG.cespuglio(), 25.5, 18.6); put(OG.cespuglio(true), 34.6, 13.8);
  put(OG.fontanella(), 10.2, 8.4); put(OG.panchina(), 11.8, 8.6); put(OG.lampione(), 8.6, 9.5); put(OG.lampione(), 22.5, 9.5);
  put(OG.tavolinoBar(), 2.7, 9.4); put(OG.fioriera(), 13.6, 9.6);
  put(OG.cartello('CAMPI ↑'), 25.2, 9.7);
  for (const x of [28, 30.5, 32.4]) put(OG.rotoballa(), x, 6 + (x % 2));
  for (const [x, y] of [[27.5, 15.2], [29, 15.2], [30.5, 15.2], [27.5, 17], [29, 17]]) put(OG.coltura('pomodoro', 3), x, y);
  for (const [x, y] of [[31.5, 15.2], [31.5, 17], [30.5, 17]]) put(OG.coltura('mais', 3), x, y);
  for (const x of [26.5, 28.5, 30.5, 32.5]) put(OG.staccionata(), x + 0.5, 13.9);
  put(OG.carriola(), 26, 19.4); put(OG.secchio(), 33.6, 17.8); put(OG.cassaVendita(), 22.2, 18.6); put(OG.tanica(), 20.1, 18.4);
  put(OG.cassonetto(), 0.95, 9.6);
  put(MZ.trattoreLato(), 38.3, 8.4); put(MZ.aratro(), 34.8, 8.1);
  put(MZ.puntoLato(), 11.5, 11.9); put(MZ.vespaLato(), 14.6, 9.9);
  put(MZ.apeLato(), 32, 12.9);
  put(OG.silo(), 42.3, 13.6); put(OG.rotoballaLato(), 40, 15.8); put(OG.ballaQuadra(), 41.3, 16.8);

  items.sort((a, b) => a.y - b.y);
  for (const it of items) {
    const x = Math.round(it.x - it.img.width / 2), y = Math.round(it.y - it.img.height);
    // ombra a terra
    g.fillStyle = 'rgba(20,24,40,0.28)';
    const sw = it.img.width * 0.42, sy = it.y - 1;
    g.beginPath(); g.ellipse(Math.round(it.x), sy, sw, Math.max(2, sw * 0.18), 0, 0, Math.PI * 2); g.fill();
    g.drawImage(it.img, x, y);
  }
  return d.c;
}
