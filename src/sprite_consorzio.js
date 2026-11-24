// Icone HD (32x32) della roba dell'endgame: verdure dell'orto e bustine di semi di Mister Rodella,
// Mangime Gold, Forcone del Cacciatore di Taglie, Distintivo dello Sceriffo, Gambalone d'Oro.
// Stesso stile di src/sprite_loot.js e src/sprite_parco.js. Si aggiungono a ICONE_LOOT (menu J, album).
import { pen, ramp, outline } from './hd/kit.js';
import { ICONE_LOOT } from './sprite_loot.js';

const S = 32;
const LEGNO = ramp('#a8743e'), ORO = ramp('#e0b030'), FERRO = ramp('#a8b0bc');
function luccica(d, x, y) { d.P('#ffffff', x, y - 2, 1, 5); d.P('#ffffff', x - 2, y, 5, 1); d.P('#fff6c0', x, y); }
function foglia(d, x, y, R = ramp('#4c9a3a')) { d.ell(x, y, 3, 2, R[2]); d.P(R[4], x - 1, y - 1, 2, 1); d.P(R[0], x, y + 1, 2, 1); }

// la bustina di semi con la figura della verdura sopra
function bustina(fig) {
  return () => {
    const d = pen(S, S), C = ramp('#f0e8d0');
    d.poly([[6, 4], [26, 4], [27, 29], [5, 29]], C[2]); d.P(C[4], 6, 4, 20, 2); d.P(C[0], 5, 27, 22, 2);
    for (let x = 6; x < 26; x += 2) d.P(C[1], x, 4);                                 // bordo seghettato
    d.P('#2a6a3a', 7, 23, 18, 4); d.P('#fff2b0', 9, 24, 14, 1); d.P('#fff2b0', 9, 26, 9, 1);  // «RODELLA»
    const f = fig(); d.g.drawImage(f, 0, 0, S, S, 7, 5, 18, 18);
    return outline(d.c);
  };
}

const ICONE = {
  zucchina() {
    const d = pen(S, S), Z = ramp('#3a8a2a');
    d.poly([[4, 22], [22, 6], [27, 10], [9, 27]], Z[2]); d.line(6, 22, 22, 8, Z[4], 2); d.line(9, 26, 26, 11, Z[0], 1);
    for (const [x, y] of [[10, 20], [15, 15], [20, 11]]) d.P('#c8e870', x, y, 2, 1);
    d.P('#7a6a3a', 24, 5, 4, 3); d.P('#f0c030', 3, 24, 4, 4); d.P('#f8e070', 3, 24, 2, 2);
    return outline(d.c);
  },
  insalata() {
    const d = pen(S, S);
    d.ball(16, 18, 12, 10, ramp('#4c9a3a')); d.ball(16, 17, 9, 8, ramp('#7ac84a')); d.ball(15, 15, 5, 4, ramp('#b8e870'));
    for (const [x0, y0, x1, y1] of [[16, 26, 16, 12], [16, 22, 8, 14], [16, 22, 24, 14]]) d.line(x0, y0, x1, y1, '#e8f8c0', 1);
    return outline(d.c);
  },
  zucca() {
    const d = pen(S, S), Z = ramp('#e07028');
    d.ball(16, 19, 13, 10, Z); d.line(10, 11, 9, 28, Z[1], 1); d.line(22, 11, 23, 28, Z[1], 1); d.line(16, 10, 16, 29, Z[1], 1);
    d.P('#6a4a1a', 15, 5, 3, 6); d.P('#8a6a2a', 15, 5, 1, 6); foglia(d, 21, 7);
    luccica(d, 9, 14);
    return outline(d.c);
  },
  peperone() {
    const d = pen(S, S), P = ramp('#d8302a'), G = ramp('#e8b820');
    d.ball(12, 19, 8, 10, G); d.ball(19, 18, 8, 10, P); d.P(P[4], 15, 12, 2, 8); d.P(G[4], 8, 14, 2, 6);
    d.P('#3a7a2a', 16, 6, 3, 4); d.P('#3a7a2a', 11, 7, 3, 3); d.P('#5a9a3a', 13, 6, 6, 2);
    return outline(d.c);
  },
  fragola() {
    const d = pen(S, S), C = ramp('#b8844a');
    d.poly([[3, 15], [29, 15], [26, 28], [6, 28]], C[2]);
    for (let x = 5; x < 28; x += 4) d.line(x, 16, x - 1, 27, C[1], 1);
    d.P(C[4], 3, 15, 26, 1); d.line(5, 15, 16, 6, C[1], 1); d.line(16, 6, 27, 15, C[1], 1);   // manico
    for (const [x, y] of [[8, 13], [14, 12], [20, 13], [11, 16], [17, 16], [23, 16]]) {
      d.ball(x, y, 3, 3, ramp('#d8202a')); d.P('#f8e070', x - 1, y); d.P('#f8e070', x + 1, y + 1); d.P('#3a8a2a', x - 1, y - 3, 3, 1);
    }
    return outline(d.c);
  },
  mangimeGold() {
    const d = pen(S, S), C = ramp('#e8dcb8');
    d.poly([[7, 6], [25, 6], [27, 29], [5, 29]], C[2]); d.P(C[4], 7, 6, 18, 2); d.P(C[0], 5, 27, 22, 2);
    d.P(C[1], 9, 3, 14, 4); d.P(C[3], 10, 3, 12, 1);
    d.ell(16, 18, 7, 6, ORO[2]); d.ell(16, 17, 5, 4, ORO[3]); d.P('#7a4a10', 13, 15, 6, 1); d.P('#7a4a10', 13, 18, 6, 1);
    luccica(d, 23, 11);
    return outline(d.c);
  },
  forconeTaglie() {
    const d = pen(S, S), R = ramp('#7a5a3a');
    d.line(4, 29, 19, 12, R[1], 3); d.line(4, 28, 19, 11, R[3], 1);
    for (const [x, y] of [[8, 23], [11, 20], [14, 17]]) d.P('#2a1a10', x, y, 2, 1);        // le tacche
    d.line(15, 10, 25, 20, FERRO[1], 3); d.line(15, 9, 25, 19, FERRO[3], 1);
    for (const [x, y] of [[16, 10], [20, 14], [24, 18]]) { d.line(x, y, x + 6, y - 7, FERRO[2], 2); d.P(FERRO[4], x + 6, y - 8, 2, 2); }
    d.ell(9, 6, 4, 4, ORO[2]); d.P('#fff2b0', 8, 5, 2, 2);                                 // la stella dello sceriffo
    return outline(d.c);
  },
  distintivo() {
    const d = pen(S, S);
    const pts = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 6 : 13; pts.push([16 + Math.cos(a) * r, 16 + Math.sin(a) * r]); }
    d.poly(pts, ORO[2]); d.ell(16, 16, 5, 5, ORO[3]); d.ell(16, 16, 3, 3, ORO[1]);
    for (const [x, y] of pts.filter((_, i) => i % 2 === 0)) d.ball(x, y, 1.5, 1.5, ORO);
    luccica(d, 11, 10);
    return outline(d.c);
  },
  gambaloneOro() {
    const d = pen(S, S);
    d.P('#7a3a2a', 9, 27, 14, 3); d.P('#9a4a32', 9, 27, 14, 1);                             // base di legno
    d.poly([[12, 4], [19, 4], [19, 18], [26, 21], [26, 26], [11, 26], [11, 18]], ORO[2]);    // lo stivale (il gambalone)
    d.P(ORO[4], 12, 4, 2, 14); d.P(ORO[0], 18, 5, 1, 13); d.P(ORO[1], 11, 24, 15, 2); d.P(ORO[3], 12, 4, 7, 2);
    luccica(d, 22, 9);
    return outline(d.c);
  },
};
ICONE.semiZucchina = bustina(ICONE.zucchina);
ICONE.semiInsalata = bustina(ICONE.insalata);
ICONE.semiZucca = bustina(ICONE.zucca);
ICONE.semiPeperone = bustina(ICONE.peperone);
ICONE.semiFragola = bustina(ICONE.fragola);

Object.assign(ICONE_LOOT, ICONE);
