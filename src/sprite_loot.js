// Icone HD (32x32) del bottino nascosto sugli alberi (src/alberi.js) e dei premi degli incontri speciali
// (src/speciali.js): attrezzi agricoli, vestiti da lavoro, frutta e cianfrusaglie. Stesso stile dei fogli
// personaggi (kit di src/hd/kit.js): contorno scuro, luce da in alto a sinistra, ombre verso il viola.
// Servono al menu J e alla roba che cade dall'albero. Babbo Natale e il Mostro della Palude usano invece gli
// sprite del foglio personaggi (babbo_natale, zombie in src/data/sprite_personaggi.js).
import * as PIX from './pixel.js';
import { pen, ramp, outline, hash } from './hd/kit.js';

const LEGNO = ramp('#a8743e'), LEGNO_SC = ramp('#7a4e2a'), FERRO = ramp('#a8b0bc'), ORO = ramp('#e0b030');
const S = 32;

// manico di legno in diagonale, con venatura e luce
function manico(d, x0, y0, x1, y1, R = LEGNO, w = 3) {
  d.line(x0, y0, x1, y1, R[0], w);
  d.line(x0, y0, x1, y1, R[2], w - 1);
  d.line(x0, y0 - 1, x1, y1 - 1, R[3], 1);
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 3; i < n; i += 5) d.P(R[1], x0 + (x1 - x0) * i / n + 1, y0 + (y1 - y0) * i / n);
}
// lama o testa di metallo: poligono con bordo lucido e ombra
function metallo(d, pts, R = FERRO, filo = null) {
  d.poly(pts, R[1]);
  const c = pts.reduce((a, p) => [a[0] + p[0] / pts.length, a[1] + p[1] / pts.length], [0, 0]);
  d.poly(pts.map(([x, y]) => [c[0] + (x - c[0]) * 0.72 - 0.6, c[1] + (y - c[1]) * 0.72 - 0.6]), R[2]);
  if (filo) d.line(...filo, R[4], 1);
}
function luccica(d, x, y) { d.P('#ffffff', x, y - 2, 1, 5); d.P('#ffffff', x - 2, y, 5, 1); d.P('#fff6c0', x, y); }
// stoffa: riempie un poligono e aggiunge pieghe in ombra
function stoffa(d, pts, R, pieghe = []) {
  d.poly(pts, R[2]);
  for (const [x0, y0, x1, y1] of pieghe) { d.line(x0, y0, x1, y1, R[1]); d.line(x0 - 1, y0, x1 - 1, y1, R[3]); }
}

// ---------- Attrezzi agricoli (armi) ----------
const ARMI = {
  zappetta() {
    const d = pen(S, S);
    manico(d, 4, 28, 20, 12);
    metallo(d, [[17, 6], [27, 4], [28, 9], [22, 14], [18, 12]], FERRO, [18, 6, 27, 4]);
    d.P(FERRO[0], 21, 13, 3, 2);
    return outline(d.c);
  },
  vanga() {
    const d = pen(S, S);
    manico(d, 6, 6, 19, 19);
    d.line(3, 7, 9, 3, LEGNO_SC[1], 3); d.line(3, 6, 9, 2, LEGNO_SC[3], 1);              // maniglia a T
    metallo(d, [[17, 20], [22, 15], [29, 22], [28, 28], [23, 29]], FERRO, [22, 16, 28, 22]);
    d.P(FERRO[0], 18, 21, 3, 1); d.P(LEGNO_SC[0], 19, 18, 3, 2);
    return outline(d.c);
  },
  pettinanebbia() {
    const d = pen(S, S);
    manico(d, 3, 29, 19, 11);
    d.line(14, 6, 27, 15, FERRO[1], 3); d.line(14, 5, 27, 14, FERRO[3], 1);              // traversa
    for (let i = 0; i < 6; i++) { const x = 15 + i * 2.4, y = 7 + i * 1.6; d.line(x, y, x - 3, y + 5, FERRO[2], 1); d.P(FERRO[4], x - 3, y + 5); }
    d.P('#dfe8f0', 25, 4, 4, 1); d.P('#dfe8f0', 22, 2, 5, 1);                              // ciuffi di nebbia
    return outline(d.c);
  },
  falcetto() {
    const d = pen(S, S);
    d.line(4, 28, 10, 22, LEGNO_SC[0], 4); d.line(4, 28, 10, 22, LEGNO_SC[2], 3); d.line(4, 27, 9, 22, LEGNO_SC[3], 1);
    for (let a = 0; a <= 1; a += 0.04) {                                                  // mezzaluna d'acciaio
      const t = Math.PI * (1.05 + a * 1.25), x = 18 + Math.cos(t) * 10, y = 14 + Math.sin(t) * 10;
      d.P(FERRO[1], x, y, 3, 3); d.P(a < 0.6 ? FERRO[4] : FERRO[3], x, y, 1, 1);
    }
    d.line(10, 22, 12, 18, FERRO[1], 3);
    d.P(ORO[3], 9, 22, 2, 2);                                                             // ghiera dorata
    luccica(d, 26, 6);
    return outline(d.c);
  },
  palaPolenta() {
    const d = pen(S, S);
    manico(d, 4, 28, 18, 14, LEGNO, 3);
    d.ball(22, 9, 7, 6, LEGNO, { grain: 0.4, seed: 3 });                                  // paletta di legno
    d.P(LEGNO[0], 20, 12, 5, 1);
    d.P('#f0c840', 21, 7, 3, 2); d.P('#ffe070', 21, 7);                                   // polenta appiccicata
    return outline(d.c);
  },
  cesoie() {
    const d = pen(S, S);
    metallo(d, [[14, 16], [27, 3], [29, 5], [17, 18]], FERRO, [15, 15, 27, 3]);
    metallo(d, [[15, 18], [29, 12], [29, 15], [17, 20]], FERRO, [16, 18, 28, 12]);
    const R = ramp('#c8302a');
    d.line(5, 21, 14, 17, R[0], 4); d.line(5, 21, 14, 17, R[2], 3); d.line(5, 20, 13, 16, R[3], 1);
    d.line(9, 28, 15, 19, R[0], 4); d.line(9, 28, 15, 19, R[2], 3); d.line(8, 27, 14, 19, R[3], 1);
    d.ball(15, 18, 2, 2, ramp('#4a4a52'));                                                // perno
    return outline(d.c);
  },
  forcaVacche() {
    const d = pen(S, S);
    manico(d, 3, 29, 17, 15, LEGNO_SC);
    d.line(13, 13, 21, 21, FERRO[1], 2);
    for (const [x, y] of [[13, 13], [17, 17], [21, 21]]) { d.line(x, y, x + 9, y - 9, FERRO[2], 2); d.P(FERRO[4], x + 9, y - 9); }
    d.P('#e8d070', 24, 9, 3, 2); d.P('#d8b850', 27, 12, 2, 2);                            // fili di fieno
    return outline(d.c);
  },
  tridente() {
    const d = pen(S, S);
    manico(d, 3, 29, 16, 16);
    d.line(12, 12, 20, 20, ORO[1], 3); d.line(12, 11, 20, 19, ORO[3], 1);                 // traversa dorata, da re
    for (const [x, y] of [[12, 12], [16, 16], [20, 20]]) { d.line(x, y, x + 10, y - 10, FERRO[2], 2); d.P(FERRO[4], x + 10, y - 10, 2, 1); }
    d.P(ORO[4], 15, 11, 2, 2); d.P('#c8302a', 17, 14);                                    // corona minuscola
    return outline(d.c);
  },
  roncolaRovi() {
    const d = pen(S, S);
    d.line(4, 28, 11, 21, LEGNO_SC[0], 4); d.line(4, 28, 11, 21, LEGNO_SC[2], 3); d.line(4, 27, 10, 21, LEGNO_SC[3], 1);
    metallo(d, [[11, 19], [22, 5], [27, 3], [28, 8], [24, 7], [16, 22], [13, 22]], FERRO, [12, 19, 23, 5]);
    d.P(FERRO[1], 26, 7, 2, 3);                                                           // becco ricurvo
    d.P('#4a8a3a', 24, 12, 3, 1); d.P('#6ab040', 26, 11); d.P('#c8302a', 27, 13);         // un rametto di rovo, con mora
    return outline(d.c);
  },
  scure() {
    const d = pen(S, S);
    manico(d, 4, 29, 20, 11);
    metallo(d, [[15, 6], [22, 5], [29, 2], [29, 15], [22, 12], [17, 12]], FERRO, [29, 3, 29, 14]);
    d.P(FERRO[0], 17, 10, 4, 2);
    luccica(d, 27, 6);
    return outline(d.c);
  },
  correggiato() {
    const d = pen(S, S);
    manico(d, 3, 29, 13, 17);
    d.line(13, 17, 16, 15, '#5a3a1c', 2);                                                 // snodo di cuoio
    manico(d, 16, 14, 28, 3, LEGNO_SC, 4);
    for (const [x, y] of [[24, 10], [27, 8], [22, 6]]) d.P('#f0d060', x, y, 2, 1);        // chicchi che saltano
    return outline(d.c);
  },
  mietinebbia() {
    const d = pen(S, S);
    manico(d, 6, 30, 16, 4, LEGNO_SC, 3);
    d.line(9, 20, 12, 22, LEGNO_SC[2], 2);                                                // impugnatura a metà
    for (let a = 0; a <= 1; a += 0.03) {                                                  // lama lunghissima
      const x = 16 - a * 14, y = 4 + Math.sin(a * Math.PI) * -1 + a * 6;
      d.P(FERRO[1], x, y, 2, 3); d.P(FERRO[4], x, y, 2, 1);
    }
    d.P('#c8d8f0', 4, 14, 6, 1); d.P('#c8d8f0', 2, 17, 5, 1); d.P('#e8f0f8', 6, 16, 4, 1); // nebbia tagliata
    luccica(d, 10, 5);
    return outline(d.c);
  },
  bastoneZucchero() {
    const d = pen(S, S);
    const pts = [];
    for (let i = 0; i <= 20; i++) pts.push([8 + i * 0.55, 30 - i * 1.15]);
    for (let a = 0; a <= 1; a += 0.06) { const t = Math.PI * (1 + a * 1.15); pts.push([22 + Math.cos(t) * 5.5, 7 + Math.sin(t) * 5.5]); }
    pts.forEach(([x, y], i) => { const r = (i >> 1) % 2; d.P(r ? '#d02028' : '#fbf6f0', x, y, 4, 4); d.P(r ? '#ff6060' : '#ffffff', x, y, 1, 1); });
    luccica(d, 28, 4); luccica(d, 6, 10);
    return outline(d.c);
  },
};

// ---------- Vestiti agricoli e regali ----------
const VESTITI = {
  cappellone() {
    const d = pen(S, S), R = ramp('#e8c460');
    d.ell(16, 21, 15, 5, R[1]); d.ell(16, 20, 14, 4, R[2]);                               // tesa enorme
    d.ball(16, 14, 8, 7, R, { grain: 0.5, seed: 4 });
    d.P(ramp('#c83028')[2], 8, 17, 17, 2); d.P(ramp('#c83028')[3], 8, 17, 17, 1);         // nastro rosso
    for (let x = 4; x < 29; x += 3) d.P(R[0], x, 21 + (x % 2), 1, 1);                     // intreccio della paglia
    d.P('#f0f0e0', 22, 10, 1, 5); d.P('#3a7a2a', 23, 9, 2, 2);                            // una spiga infilata
    return outline(d.c);
  },
  berrettoCorvi() {
    const d = pen(S, S), R = ramp('#5a6a3a');
    d.ball(16, 17, 10, 8, R, { grain: 0.3, seed: 6 });
    d.P(R[0], 6, 20, 20, 3); d.P(R[3], 6, 20, 20, 1);
    d.ell(9, 24, 6, 2, R[1]);                                                             // visiera
    const N = ramp('#2a2430');                                                            // piuma nera di corvo
    d.line(20, 12, 28, 3, N[2], 2); d.line(21, 12, 29, 4, N[4], 1);
    d.P('#f0c030', 13, 14, 2, 2);                                                         // spilla
    return outline(d.c);
  },
  elmoPentola() {
    const d = pen(S, S), R = ramp('#b8c0c8');
    d.cyl(7, 10, 18, 14, R);                                                              // pentola
    d.ell(16, 10, 9, 3, R[3]); d.ell(16, 10, 7, 2, R[1]);
    d.P(R[0], 7, 23, 18, 1);
    d.P(ramp('#2a2a30')[2], 3, 15, 4, 3); d.P(ramp('#2a2a30')[2], 25, 15, 4, 3);          // manici neri
    d.P('#3a3a44', 15, 4, 3, 4); d.P('#c8302a', 15, 3, 3, 2);                             // valvola
    d.P('#e8f0f8', 19, 1, 2, 1); d.P('#e8f0f8', 21, 0, 2, 1);                             // fischio di vapore
    return outline(d.c);
  },
  fazzolettoRosso() {
    const d = pen(S, S), R = ramp('#c8282a');
    d.poly([[2, 6], [30, 6], [16, 28]], R[2]);
    d.poly([[2, 6], [30, 6], [29, 9], [3, 9]], R[1]);
    d.line(6, 10, 16, 26, R[1]); d.line(26, 10, 16, 26, R[3]);
    for (const [x, y] of [[8, 11], [14, 12], [20, 11], [24, 13], [11, 15], [17, 17], [21, 16], [15, 21]]) { d.P('#fbf0e0', x, y, 2, 2); d.P(R[0], x + 1, y + 1); }
    d.line(2, 6, 0, 3, R[2], 2); d.line(30, 6, 31, 2, R[2], 2);                           // nodi
    return outline(d.c);
  },
  ferroCavallo() {
    const d = pen(S, S), R = ramp('#9a7a5a');
    for (let a = 0; a <= 1; a += 0.02) {
      const t = Math.PI * (0.85 - a * 1.7), x = 16 + Math.cos(t) * 10, y = 16 - Math.sin(t) * 11;
      d.P(R[a < 0.4 ? 3 : a < 0.7 ? 2 : 1], x - 2, y - 2, 4, 4);
    }
    for (const a of [0.15, 0.32, 0.68, 0.85]) { const t = Math.PI * (0.85 - a * 1.7); d.P(R[0], 16 + Math.cos(t) * 10, 16 - Math.sin(t) * 11); }
    d.P('#c8783a', 9, 20, 2, 2); d.P('#c8783a', 22, 9, 2, 1);                             // ruggine
    luccica(d, 25, 22);
    return outline(d.c);
  },
  cinturaSpago() {
    const d = pen(S, S), R = ramp('#c8a870');
    for (let a = 0; a < Math.PI * 2; a += 0.05) d.P(R[Math.sin(a * 6) > 0 ? 3 : 1], 16 + Math.cos(a) * 12, 17 + Math.sin(a) * 6, 3, 3);
    d.box(12, 18, 9, 7, ramp('#8a8a90'));                                                 // fibbia
    d.P('#3a3a44', 14, 20, 5, 3);
    d.line(20, 22, 27, 29, R[2], 2); d.line(17, 24, 15, 30, R[1], 2);                     // spago che pende
    return outline(d.c);
  },
  guantiLavoro() {
    const d = pen(S, S), R = ramp('#e8b830');
    d.ball(15, 18, 8, 8, R);                                                              // palmo
    for (const [x, h] of [[9, 9], [12, 11], [15, 12], [18, 10]]) { d.P(R[1], x, 18 - h, 3, h); d.P(R[3], x, 18 - h, 1, h - 2); d.ell(x + 1, 18 - h, 1.5, 1, R[2]); }
    d.ball(23, 19, 3, 4, R);                                                              // pollice
    d.P(ramp('#3a5a9a')[2], 8, 25, 15, 5); d.P(ramp('#3a5a9a')[3], 8, 25, 15, 1);          // polsino blu
    d.P('#8a5a28', 12, 20, 2, 1); d.P('#8a5a28', 17, 22, 3, 1);                           // macchie di lavoro
    return outline(d.c);
  },
  salopette() {
    const d = pen(S, S), R = ramp('#3a5a9a');
    stoffa(d, [[7, 12], [25, 12], [26, 30], [18, 30], [16, 22], [14, 30], [6, 30]], R, [[16, 22, 16, 29]]);
    d.box(10, 7, 12, 8, R);                                                               // pettorina
    d.P(R[1], 9, 1, 3, 8); d.P(R[1], 20, 1, 3, 8); d.P(R[3], 9, 1, 1, 8); d.P(R[3], 20, 1, 1, 8); // bretelle
    d.P(ORO[3], 10, 7, 2, 2); d.P(ORO[3], 20, 7, 2, 2);
    d.box(13, 9, 6, 4, ramp('#2e4a80'));                                                  // taschino
    d.P('#c8302a', 15, 8, 1, 3);                                                          // matita del geometra
    d.P(ramp('#b88a5a')[2], 22, 24, 3, 3);                                                // toppa
    return outline(d.c);
  },
  grembiuleMungitura() {
    const d = pen(S, S), R = ramp('#e8e4d8');
    stoffa(d, [[10, 6], [22, 6], [27, 30], [5, 30]], R, [[12, 12, 10, 28], [20, 12, 22, 28]]);
    d.line(10, 6, 4, 10, R[1], 2); d.line(22, 6, 28, 10, R[1], 2);                        // lacci
    for (const [x, y] of [[9, 16], [19, 20], [14, 24], [22, 14]]) d.ball(x, y, 2.5, 2, ramp('#2a2a30'));  // macchie da mucca
    d.box(12, 18, 8, 5, ramp('#c8b898'));
    d.P('#f4f4ff', 15, 26, 2, 3); d.P('#ffffff', 15, 26);                                 // goccia di latte
    return outline(d.c);
  },
  gileFustagno() {
    const d = pen(S, S), R = ramp('#8a5a32');
    stoffa(d, [[6, 4], [13, 4], [16, 14], [19, 4], [26, 4], [27, 29], [17, 29], [16, 20], [15, 29], [5, 29]], R, []);
    for (let x = 7; x < 27; x += 2) d.line(x, 6, x, 28, R[1]);                            // coste del fustagno
    d.P(R[3], 6, 4, 7, 1); d.P(R[3], 19, 4, 7, 1);
    for (const y of [16, 20, 24]) { d.ball(14, y, 1.2, 1.2, ORO); d.ball(18, y, 1.2, 1.2, ORO); }
    d.box(20, 17, 5, 4, ramp('#6a4228'));                                                 // taschino
    d.P('#f0a0c0', 21, 15, 2, 2);                                                         // caramella del 1983
    return outline(d.c);
  },
  giaccaVento() {
    const d = pen(S, S), R = ramp('#e86a1a');
    stoffa(d, [[8, 5], [24, 5], [27, 8], [31, 26], [26, 27], [25, 30], [7, 30], [6, 27], [1, 26], [5, 8]], R, [[4, 14, 3, 24], [28, 14, 29, 24]]);
    d.P(R[0], 15, 5, 2, 25); d.P('#e8ecf0', 16, 6, 1, 23);                                // zip
    d.box(9, 2, 14, 4, ramp('#2a5a2a'));                                                  // colletto del consorzio
    d.box(8, 20, 6, 5, R); d.box(18, 20, 6, 5, R);                                        // tasche
    d.P('#ffffff', 19, 10, 4, 3); d.P('#3a8a3a', 20, 11, 2, 1);                           // stemma col trattorino
    d.P('#f8f8a0', 7, 16, 18, 1);                                                         // banda catarifrangente
    return outline(d.c);
  },
  stivaliGomma() {
    const d = pen(S, S), R = ramp('#2e8a3a');
    for (const ox of [0, 12]) {
      d.cyl(4 + ox, 4, 8, 18, R);
      d.ball(10 + ox, 25, 7, 4, R);
      d.P(R[0], 3 + ox, 28, 14, 2);
      d.P(R[4], 4 + ox, 4, 8, 1);
      d.P('#5a3a1c', 6 + ox, 22, 3, 2);                                                   // fango
    }
    d.P('#80d0ff', 27, 30, 2, 1); d.P('#80d0ff', 1, 30, 1, 1);
    return outline(d.c);
  },
  ciabatteStalla() {
    const d = pen(S, S), R = ramp('#5a7ac0');
    for (const [ox, oy] of [[0, 0], [12, 6]]) {
      d.ell(10 + ox, 18 + oy, 9, 4, ramp('#e8e0d0')[1]);                                  // suola
      d.ball(12 + ox, 16 + oy, 6, 4, R);
      d.P(R[4], 9 + ox, 14 + oy, 4, 1);
    }
    for (const [x, y] of [[2, 10], [4, 8], [1, 13]]) d.P('#f0e070', x, y, 3, 1);          // scie supersoniche
    d.P('#f0e070', 28, 4, 1, 4); d.P('#f0e070', 26, 6, 5, 1);
    return outline(d.c);
  },
  zoccoli() {
    const d = pen(S, S), R = ramp('#e8b860');
    d.ball(16, 18, 13, 8, R, { grain: 0.35, seed: 9 });
    d.ell(11, 15, 6, 3, R[0]);                                                            // buco del piede
    d.ell(27, 17, 3, 4, R[3]);                                                            // punta all'insù
    d.P(R[1], 3, 24, 26, 2);
    for (const [x, y, c] of [[17, 18, '#d02830'], [21, 20, '#3a6ad0'], [24, 17, '#f0e050']]) { d.P(c, x, y, 2, 2); d.P('#3a8a3a', x + 2, y + 1); }
    return outline(d.c);
  },
  cappelloNatale() {
    const d = pen(S, S), R = ramp('#d02028'), B = ramp('#f4f0ea');
    d.poly([[5, 24], [27, 24], [24, 12], [20, 6], [28, 9], [22, 3], [12, 6]], R[2]);
    d.line(12, 7, 7, 22, R[3], 2); d.line(22, 10, 25, 22, R[1], 2);
    d.ball(16, 25, 13, 4, B, { grain: 0.5, seed: 2 });                                    // pelliccia
    d.ball(28, 9, 3.5, 3.5, B);                                                           // pon pon
    d.ball(28, 13, 1.5, 1.5, ORO);                                                        // campanellino
    return outline(d.c);
  },
  maglioneRenne() {
    const d = pen(S, S), R = ramp('#c02028');
    stoffa(d, [[8, 4], [24, 4], [30, 10], [31, 26], [26, 26], [25, 30], [7, 30], [6, 26], [1, 26], [2, 10]], R, [[4, 14, 3, 24], [28, 14, 29, 24]]);
    for (const y of [8, 27]) for (let x = 5; x < 28; x += 4) { d.P('#f4f0ea', x, y, 2, 2); d.P('#2a8a3a', x + 2, y, 2, 2); }
    for (const ox of [9, 19]) {                                                           // due renne
      d.P('#8a5a28', ox, 15, 5, 4); d.P('#8a5a28', ox + 4, 12, 3, 4);
      d.P('#5a3a1c', ox + 4, 9, 1, 3); d.P('#5a3a1c', ox + 6, 9, 1, 3);
      d.P('#ff2020', ox + 7, 14, 2, 2); d.P('#5a3a1c', ox, 19, 1, 3); d.P('#5a3a1c', ox + 4, 19, 1, 3);
    }
    return outline(d.c);
  },
  mantelloAlghe() {
    const d = pen(S, S), R = ramp('#3e7a2a');
    stoffa(d, [[9, 2], [23, 2], [29, 28], [3, 28]], R, [[12, 6, 8, 26], [16, 6, 16, 27], [20, 6, 24, 26]]);
    for (let x = 3; x < 30; x += 2) d.P(R[x % 4 ? 1 : 3], x, 28, 1, 2 + (hash(x, 1) * 3 | 0));   // frange
    d.P('#7ac040', 13, 10, 1, 6); d.P('#7ac040', 21, 14, 1, 5);
    for (const [x, y] of [[7, 30], [18, 31], [26, 30], [11, 20]]) d.P('#80d0ff', x, y);   // gocce
    d.P('#f0f0d0', 19, 8, 2, 1);                                                          // lisca di carpa
    return outline(d.c);
  },
};

// ---------- Roba che cade dagli alberi ----------
const OGGETTI = {
  mela() {
    const d = pen(S, S), R = ramp('#d83028');
    d.ball(16, 18, 10, 9, R);
    d.ell(16, 10, 3, 1.5, R[0]);
    d.P(ramp('#c87a3a')[2], 18, 17, 3, 2); d.P(ramp('#c87a3a')[1], 13, 22, 2, 2);         // ruggine della Rugginella
    d.line(16, 9, 17, 4, LEGNO_SC[1], 2);
    d.ball(21, 5, 4, 2, ramp('#4ab050'));
    return outline(d.c);
  },
  noci() {
    const d = pen(S, S), R = ramp('#b88a4e');
    for (const [x, y] of [[10, 20], [21, 21], [16, 11]]) {
      d.ball(x, y, 6, 6, R, { grain: 0.6, seed: x });
      d.line(x, y - 6, x, y + 6, R[0]);
    }
    d.P('#1a1420', 14, 11); d.P('#1a1420', 18, 11); d.P(R[0], 15, 14, 3, 1);            // la noce in cima ha la faccia del nonno
    return outline(d.c);
  },
  fico() {
    const d = pen(S, S), R = ramp('#7a3a7a');
    d.ball(16, 20, 9, 9, R);
    d.poly([[13, 12], [19, 12], [17, 6], [15, 6]], R[1]);
    d.line(16, 6, 16, 3, LEGNO_SC[2], 2);
    d.P('#f0a8a0', 20, 22, 4, 3); d.P('#e86a70', 21, 23, 2, 1);                           // spaccato dolce
    d.P('#ffd060', 24, 18); d.P('#ffd060', 25, 20);                                       // goccia di miele
    return outline(d.c);
  },
  castagna() {
    const d = pen(S, S), R = ramp('#3e8a2a');
    d.ball(16, 18, 11, 10, R);
    for (let i = 0; i < 46; i++) {                                                         // riccio spinoso
      const a = i * 2.4, r = 9 + (i % 3);
      d.line(16 + Math.cos(a) * 6, 18 + Math.sin(a) * 6, 16 + Math.cos(a) * (r + 3), 18 + Math.sin(a) * (r + 3), R[i % 2 ? 3 : 1]);
    }
    d.ball(16, 16, 5, 4, ramp('#8a4a24'));                                                // castagna che sbuca
    d.P('#1a1420', 14, 15); d.P('#1a1420', 18, 15); d.P('#1a1420', 15, 18, 3, 1);         // ...matta
    return outline(d.c);
  },
  pigna() {
    const d = pen(S, S), R = ramp('#9a6430');
    d.ball(16, 17, 8, 12, R);
    for (let y = 7; y < 28; y += 3) for (let x = 10 + (y % 2) * 2; x < 23; x += 4) { d.P(R[0], x, y + 1, 3, 1); d.P(R[4], x, y, 2, 1); }
    d.ball(16, 4, 3, 2, ramp('#3a7a2a'));
    luccica(d, 25, 8);
    return outline(d.c);
  },
  nido() {
    const d = pen(S, S), R = ramp('#9a7442');
    d.ell(16, 20, 14, 8, R[1]);
    d.ell(16, 18, 10, 5, ramp('#4a3420')[2]);
    for (let i = 0; i < 40; i++) { const a = i * 0.9, r = 11 + (i % 3); d.line(16 + Math.cos(a) * r, 20 + Math.sin(a) * 6, 16 + Math.cos(a + 0.6) * r, 20 + Math.sin(a + 0.6) * 6, R[i % 3 + 2]); }
    d.P('#1a1420', 12, 17, 2, 1); d.P('#1a1420', 19, 17, 2, 1);                           // nido offeso: sopracciglia
    return outline(d.c);
  },
  uovoGazza() {
    const d = pen(S, S);
    d.ball(16, 17, 8, 11, ramp('#c8e0e8'));
    for (const [x, y] of [[13, 12], [19, 16], [14, 21], [18, 24], [11, 18]]) d.P('#6a7a5a', x, y, 2, 2);
    d.ball(16, 16, 3, 3, ORO);                                                            // dentro luccica qualcosa
    luccica(d, 24, 7); luccica(d, 8, 25);
    return outline(d.c);
  },
  cartolina() {
    const d = pen(S, S);
    d.box(3, 7, 26, 19, ramp('#f0e8d0'));
    d.P('#5ab0e8', 5, 9, 14, 8); d.P('#f0d080', 5, 15, 14, 3); d.ball(15, 11, 2, 2, ORO); // mare, spiaggia e sole
    d.P('#e84a6a', 7, 13, 1, 3); d.P('#3a8a3a', 10, 13, 1, 3);                           // ombrelloni
    d.box(21, 9, 6, 7, ramp('#c83030'));                                                  // francobollo
    for (const y of [19, 21, 23]) d.P('#8a8a9a', 5, y, 20, 1);
    d.P('#c83030', 20, 19, 6, 1);                                                         // «baci da Rimini»
    return outline(d.c);
  },
  biscotti() {
    const d = pen(S, S), R = ramp('#d8a050');
    d.ball(12, 19, 9, 8, R); d.ball(21, 13, 8, 7, R);
    d.poly([[21, 8], [24, 12], [21, 16], [18, 12]], '#f8f4f0');                           // stella glassata
    for (const [x, y] of [[9, 17], [14, 21], [10, 22], [16, 16]]) d.P('#5a3418', x, y, 2, 1);
    d.P('#d02028', 12, 18); d.P('#3a9a3a', 13, 18);
    return outline(d.c);
  },
  carbone() {
    const d = pen(S, S), R = ramp('#3a3a46');
    d.ball(16, 19, 11, 9, R, { grain: 0.8, seed: 7 });
    d.poly([[10, 14], [15, 11], [17, 16]], R[3]);
    d.ell(16, 8, 5, 2, '#d02028'); d.P('#f0c030', 15, 6, 3, 2);                           // fiocco regalo
    luccica(d, 23, 14);
    return outline(d.c);
  },
};

export const ICONE_LOOT = { ...ARMI, ...VESTITI, ...OGGETTI };

// immagine (dataURL) dell'icona, per il menu; null se non c'è uno sprite per quell'id
const _url = {};
export function iconaUrl(id) {
  if (!ICONE_LOOT[id]) return null;
  return (_url[id] ??= ICONE_LOOT[id]().toDataURL());
}

// ---------- Babbo Natale smemorato: lo sprite del foglio personaggi ----------
PIX.CHARACTERS.babbo_natale ??= { sprite: 'babbo_natale', w: 16, h: 24, skin: '#f0c0a0', hair: '#f4f4f4', hairStyle: 'flat', shirt: '#d02028', pants: '#d02028', boots: '#111' };
export const babboFrames = () => PIX.characterFrames('babbo_natale');
export const babboMisure = () => { const o = PIX.CHARACTERS.babbo_natale; return { w: o.w / 16 * 1.25, h: o.h / 16 * 1.25 }; };
