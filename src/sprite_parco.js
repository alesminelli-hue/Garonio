// Icone HD (32x32) della roba nuova: bottino dei mostri del Parco Oglio, «lavoretti» del Vecchio Camper,
// stalla, alberi di stagione e Banco del Gigante. Stesso stile di src/sprite_loot.js (kit di src/hd/kit.js:
// contorno scuro, luce da in alto a sinistra). Si aggiungono a ICONE_LOOT, così le usano il menu J,
// la roba che cade dagli alberi e l'album. In fondo: gli oggetti del parco sulla mappa (cartelli, carriola, ceppi).
import { pen, ramp, outline, hash } from './hd/kit.js';
import { ICONE_LOOT } from './sprite_loot.js';

const S = 32;
const LEGNO = ramp('#a8743e'), FERRO = ramp('#a8b0bc'), ORO = ramp('#e0b030');
function luccica(d, x, y) { d.P('#ffffff', x, y - 2, 1, 5); d.P('#ffffff', x - 2, y, 5, 1); d.P('#fff6c0', x, y); }
function manico(d, x0, y0, x1, y1, R = LEGNO, w = 3) {
  d.line(x0, y0, x1, y1, R[0], w); d.line(x0, y0, x1, y1, R[2], w - 1); d.line(x0, y0 - 1, x1, y1 - 1, R[3], 1);
}
function stoffa(d, pts, R, pieghe = []) {
  d.poly(pts, R[2]);
  for (const [x0, y0, x1, y1] of pieghe) { d.line(x0, y0, x1, y1, R[1]); d.line(x0 - 1, y0, x1 - 1, y1, R[3]); }
}
function piatto(d, R = ramp('#e8e4dc')) { d.ell(16, 24, 14, 5, R[1]); d.ell(16, 23, 13, 4, R[3]); }

const ICONE = {
  // ---------- armi ----------
  forconcinoInfernale() {
    const d = pen(S, S), R = ramp('#c02020');
    manico(d, 4, 29, 20, 11, ramp('#5a2a2a'));
    d.line(16, 10, 26, 20, R[1], 3); d.line(16, 9, 26, 19, R[3], 1);                     // traversa
    for (const [x, y] of [[17, 10], [21, 14], [25, 18]]) { d.line(x, y, x + 6, y - 7, R[2], 2); d.P(R[4], x + 6, y - 8, 2, 2); }
    d.P('#ffb020', 9, 3, 2, 3); d.P('#ff6020', 8, 5, 4, 2); d.P('#ffe060', 9, 4, 1, 1);   // fiammella
    d.P('#ff8020', 27, 26, 2, 3); d.P('#ffd040', 27, 26, 1, 1);
    return outline(d.c);
  },
  falceLunare() {
    const d = pen(S, S), R = ramp('#c8d8f0');
    manico(d, 6, 30, 16, 8);
    for (let a = 0; a < 2.6; a += 0.08) {                                                  // lama a mezzaluna
      const x = 18 + Math.cos(a + 3.6) * 12, y = 13 + Math.sin(a + 3.6) * 10;
      d.P(R[a < 0.4 ? 1 : 2], x + 12, y + 2, 2, 2); d.P(R[4], x + 12, y + 1, 1, 1);
    }
    d.ball(25, 7, 3, 3, ORO); luccica(d, 8, 6);
    for (let x = 2; x < 30; x += 4) d.P('#e8eef4', x, 28 + (x % 3), 3, 1);                 // nebbia tagliata a fette
    return outline(d.c);
  },
  // ---------- vestiti ----------
  mantelloVampiro() {
    const d = pen(S, S), N = ramp('#2a2030'), R = ramp('#b01828');
    stoffa(d, [[10, 3], [22, 3], [30, 29], [16, 26], [2, 29]], N, [[12, 8, 7, 26], [20, 8, 25, 26]]);
    d.poly([[12, 5], [20, 5], [24, 24], [16, 22], [8, 24]], R[2]);                        // fodera rossa
    d.line(12, 5, 8, 24, R[3]); d.P('#f0f0f0', 11, 2, 10, 3); d.P('#d0d0d8', 11, 4, 10, 1); // colletto alto
    d.P(ORO[3], 15, 6, 2, 2);
    return outline(d.c);
  },
  cappelloBossMM() {
    const d = pen(S, S), R = ramp('#4a5a3a');
    d.ell(16, 21, 14, 4, R[1]);                                                            // tesa
    d.ball(16, 14, 10, 8, R, { grain: 0.2, seed: 3 });
    d.P('#2a2018', 6, 18, 20, 3); d.P('#5a4a30', 6, 18, 20, 1);                           // fascia
    d.ball(16, 11, 4, 4, ORO); d.P('#c02020', 15, 10, 2, 2);                               // stemma del parco
    d.P('#d8d8d8', 3, 25, 6, 1); d.P('#d8d8d8', 23, 25, 6, 1);                             // baffi appesi (scherzo)
    luccica(d, 24, 8);
    return outline(d.c);
  },
  elmoCavaliere() {
    const d = pen(S, S), R = FERRO;
    d.cyl(8, 8, 16, 18, R);                                                                // secchio del latte rovesciato
    d.P(R[0], 8, 25, 16, 2); d.P('#1e1622', 10, 15, 12, 2);                                // fessura per gli occhi
    for (let x = 11; x < 22; x += 3) d.P('#1e1622', x, 19, 1, 4);
    d.line(8, 9, 4, 3, '#c02020', 2); d.line(10, 8, 8, 1, '#f0c030', 2);                   // pennacchio di piume di gallo
    d.P(R[4], 10, 9, 2, 12);
    return outline(d.c);
  },
  calzettoni() {
    const d = pen(S, S), R = ramp('#e8e0d0');
    for (const ox of [3, 15]) {
      stoffa(d, [[ox + 2, 2], [ox + 11, 2], [ox + 11, 20], [ox + 14, 26], [ox + 12, 30], [ox, 30], [ox + 2, 22]], R);
      for (let y = 5; y < 20; y += 4) d.P(ramp('#c03030')[2], ox + 2, y, 9, 2);           // righe rosse
      d.P(R[0], ox + 2, 2, 9, 2);
    }
    for (let i = 0; i < 12; i++) d.P(R[4], 2 + hash(i, 3) * 28, 2 + hash(i, 5) * 28);     // lana che pizzica
    return outline(d.c);
  },
  stivaliReazione() {
    const d = pen(S, S), R = ramp('#6a4a2a'), M = ramp('#c03030');
    for (const ox of [2, 15]) {
      d.box(ox + 2, 4, 9, 16, R); d.box(ox, 18, 14, 6, R);
      d.box(ox + 3, 9, 7, 6, M);                                                            // motorino della Vespa
      d.P(FERRO[3], ox + 4, 10, 2, 2);
      d.P('#ffd040', ox + 3, 25, 8, 2); d.P('#ff7020', ox + 4, 27, 6, 2); d.P('#ff3020', ox + 5, 29, 4, 2); // fiammata
    }
    return outline(d.c);
  },
  cornetto() {
    const d = pen(S, S), R = ramp('#e02828');
    for (let i = 0; i < 18; i++) { const t = i / 17, x = 9 + t * 14 + Math.sin(t * 3) * 3, y = 26 - t * 20, r = 5 * (1 - t) + 1; d.ball(x, y, r, r, R); }
    d.box(5, 24, 8, 5, ORO); d.P(ORO[4], 6, 25, 6, 1);                                        // tappo dorato
    d.line(9, 29, 9, 31, '#8a6a2a');
    luccica(d, 25, 10);
    return outline(d.c);
  },
  // ---------- alberi di stagione ----------
  sambuco() {
    const d = pen(S, S);
    d.line(16, 30, 16, 14, ramp('#4a8a3a')[2], 2);
    for (let i = 0; i < 40; i++) { const a = i * 2.4, r = 3 + (i % 9); d.P(i % 4 ? '#f8f4e0' : '#e8e0a0', 16 + Math.cos(a) * r, 11 + Math.sin(a) * r * 0.7, 2, 2); }
    d.P('#f0d040', 15, 10, 2, 2); luccica(d, 26, 5);
    return outline(d.c);
  },
  ciliegie() {
    const d = pen(S, S), R = ramp('#c01828');
    d.line(10, 20, 18, 5, ramp('#4a8a3a')[1], 2); d.line(22, 21, 18, 5, ramp('#4a8a3a')[1], 2);
    d.ball(20, 6, 5, 3, ramp('#4ab050'));
    d.ball(10, 22, 6, 6, R); d.ball(22, 23, 6, 6, R);
    d.P('#ffffff', 8, 19, 2, 2); d.P('#ffffff', 20, 20, 2, 2);
    return outline(d.c);
  },
  ghiacciolo() {
    const d = pen(S, S), R = ramp('#a8d8f0');
    manico(d, 4, 6, 26, 6, ramp('#6a4a2a'), 3);                                             // il ramo
    for (const [x, l] of [[8, 14], [14, 22], [20, 17], [25, 10]]) { d.poly([[x - 2, 7], [x + 3, 7], [x, 7 + l]], R[2]); d.line(x - 1, 8, x, 6 + l, R[4]); }
    luccica(d, 14, 18);
    return outline(d.c);
  },
  // ---------- bottino dei mostri ----------
  lenzuolo() {
    const d = pen(S, S), R = ramp('#e8eef4');
    stoffa(d, [[8, 4], [24, 4], [29, 26], [25, 30], [21, 26], [16, 30], [11, 26], [7, 30], [3, 26]], R, [[12, 8, 10, 24], [20, 8, 22, 24]]);
    d.ell(12, 13, 2, 3, '#1e1622'); d.ell(20, 13, 2, 3, '#1e1622'); d.ell(16, 20, 3, 2, '#1e1622');   // faccina «BUH»
    return outline(d.c);
  },
  ossoFortunato() {
    const d = pen(S, S), R = ramp('#f0e8d0');
    d.line(8, 24, 24, 8, R[1], 5); d.line(8, 23, 24, 7, R[3], 2);
    for (const [x, y] of [[6, 22], [10, 27], [22, 5], [27, 10]]) d.ball(x, y, 3, 3, R);
    d.P('#3a9a3a', 14, 14, 3, 3); d.P('#5ac05a', 14, 14, 1, 1);                            // quadrifoglio legato
    d.line(12, 18, 20, 12, '#c02020');
    return outline(d.c);
  },
  cristalloAlieno() {
    const d = pen(S, S), R = ramp('#40e090');
    d.poly([[16, 2], [24, 12], [20, 30], [12, 30], [8, 12]], R[2]);
    d.poly([[16, 2], [16, 30], [12, 30], [8, 12]], R[3]); d.poly([[16, 2], [24, 12], [16, 14]], R[4]);
    d.line(16, 2, 16, 30, R[1]);
    d.P('#1e1622', 13, 16, 2, 3); d.P('#1e1622', 18, 16, 2, 3);                            // ti guarda
    luccica(d, 26, 6); luccica(d, 6, 24);
    return outline(d.c);
  },
  nasoRosso() {
    const d = pen(S, S);
    d.ball(16, 16, 11, 11, ramp('#e02828'));
    d.ell(11, 11, 3, 2, '#ffb0b0'); d.P('#ffffff', 10, 10, 2, 1);
    d.P('#1e1622', 2, 16, 4, 1); d.P('#1e1622', 26, 16, 4, 1);                             // elastico
    return outline(d.c);
  },
  bende() {
    const d = pen(S, S), R = ramp('#e8dcc0');
    d.ball(14, 18, 10, 10, R, { grain: 0.5, seed: 2 });
    for (let a = 0; a < 6.2; a += 0.7) d.line(14 + Math.cos(a) * 3, 18 + Math.sin(a) * 3, 14 + Math.cos(a) * 9, 18 + Math.sin(a) * 9, R[1]);
    d.ball(14, 18, 3, 3, R);
    stoffa(d, [[22, 20], [30, 24], [28, 30], [20, 26]], R);                                 // il capo che pende
    d.P('#a08060', 24, 24, 2, 2);                                                          // macchia di millennio
    return outline(d.c);
  },
  pozione() {
    const d = pen(S, S), R = ramp('#9040c0');
    d.ball(16, 21, 10, 9, ramp('#c8d8e0'));
    d.ball(16, 23, 8, 6, R);
    d.box(13, 6, 6, 7, ramp('#c8d8e0')); d.box(12, 3, 8, 4, ramp('#8a5a2a'));             // tappo di sughero
    for (const [x, y] of [[20, 2], [23, 0], [17, 1]]) d.ell(x, y + 1, 2, 1.5, '#b0e080');  // fumo verde
    d.P('#e0b0ff', 11, 20, 2, 2); luccica(d, 25, 14);
    return outline(d.c);
  },
  // ---------- «lavoretti» del Vecchio Camper ----------
  legna() {
    const d = pen(S, S);
    for (const [x, y] of [[9, 22], [23, 22], [16, 13]]) {
      d.cyl(x - 7, y - 4, 14, 9, LEGNO);
      d.ell(x + 7, y, 3, 4.5, ramp('#e0c090')[2]); d.ell(x + 7, y, 1.5, 2.5, ramp('#c09060')[1]);
    }
    return outline(d.c);
  },
  cartello() {
    const d = pen(S, S);
    d.box(14, 18, 4, 13, ramp('#7a7a82'));
    d.box(3, 3, 26, 17, ramp('#f0f0ea'));
    d.ell(9, 11, 5, 5, '#c02020'); d.ell(9, 11, 3.5, 3.5, '#f0f0ea'); d.line(6, 14, 12, 8, '#c02020', 2);
    d.P('#1e1622', 16, 7, 11, 2); d.P('#1e1622', 16, 11, 9, 2); d.P('#1e1622', 16, 15, 10, 1);   // «VIETATO»
    d.P('#a8a8b0', 4, 4, 2, 2); d.P('#a8a8b0', 26, 4, 2, 2);                                     // bulloni svitati
    return outline(d.c);
  },
  uovaAnatra() {
    const d = pen(S, S);
    d.ell(16, 24, 14, 6, ramp('#9a7442')[1]); d.ell(16, 22, 11, 4, ramp('#6a4a2a')[1]);
    for (const [x, y] of [[10, 18], [17, 16], [23, 19]]) { d.ball(x, y, 5, 6, ramp('#c8e8d0')); d.P('#ffffff', x - 2, y - 3, 2, 1); }
    d.P('#3a8a5a', 3, 10, 4, 1); d.P('#e0a020', 3, 11, 2, 1);                                    // piuma di anatra
    return outline(d.c);
  },
  pesceOglio() {
    const d = pen(S, S), R = ramp('#6a9a6a');
    d.ball(15, 16, 12, 6, R, { grain: 0.4, seed: 9 });
    d.poly([[26, 16], [31, 10], [31, 22]], R[1]);
    for (let x = 7; x < 24; x += 3) d.P(R[0], x, 14 + (x % 2), 1, 4);                       // macchie da luccio
    d.P('#1e1622', 7, 14, 2, 2); d.P('#ffffff', 7, 14, 1, 1);
    d.line(3, 18, 8, 18, '#f0f0f0'); d.line(3, 19, 7, 19, '#a02020');                          // dentoni
    return outline(d.c);
  },
  fotoSfocata() {
    const d = pen(S, S);
    d.box(3, 5, 26, 22, ramp('#f4f0e8'));
    d.P('#2a3a2a', 6, 8, 20, 14);
    for (let i = 0; i < 60; i++) d.P(hash(i, 1) > 0.5 ? '#3a5a3a' : '#2a4a2a', 6 + hash(i, 2) * 19, 8 + hash(i, 3) * 13, 2, 2);   // cespugli mossi
    d.ell(13, 15, 3, 4, '#c8a090'); d.ell(18, 15, 3, 4, '#d8b0a0');                              // due sagome sfocate...
    d.P('#ff6080', 15, 10, 2, 2);                                                                  // ...e un cuoricino
    d.P('#1e1622', 10, 24, 12, 1);
    return outline(d.c);
  },
  // ---------- stalla ----------
  latte() {
    const d = pen(S, S), R = ramp('#f4f4f0');
    d.cyl(9, 8, 14, 20, FERRO);                                                                     // bidone del latte
    d.P(FERRO[0], 9, 27, 14, 2); d.box(12, 3, 8, 6, FERRO);
    d.ell(16, 9, 5, 1.5, R[2]); d.P(R[4], 14, 8, 3, 1);
    d.P('#3a8a3a', 11, 16, 10, 5); d.P('#f4f4f0', 13, 17, 6, 3);                                   // etichetta «Carolina»
    d.P('#1e1622', 14, 18, 1, 1); d.P('#1e1622', 17, 18, 1, 1);
    return outline(d.c);
  },
  lana() {
    const d = pen(S, S), R = ramp('#f0e8d8');
    d.ball(16, 17, 12, 11, R, { grain: 0.7, seed: 5 });
    for (let a = 0; a < 6.2; a += 0.5) d.line(16 + Math.cos(a) * 4, 17 + Math.sin(a) * 9, 16 + Math.cos(a + 1.2) * 10, 17 + Math.sin(a + 1.2) * 5, R[1]);
    d.line(26, 22, 31, 28, R[2], 2);                                                                // il filo che scappa
    d.line(5, 5, 11, 11, FERRO[2], 1); d.line(7, 4, 12, 10, FERRO[3], 1);                         // ferri da calza
    return outline(d.c);
  },
  uovoOca() {
    const d = pen(S, S);
    d.ball(16, 17, 11, 14, ramp('#f8f4e8'));
    d.P('#ffffff', 10, 8, 3, 2);
    d.P('#e0a020', 20, 24, 5, 2); d.P('#e0a020', 22, 26, 2, 2);                                   // timbro «OCA»
    return outline(d.c);
  },
  // ---------- Banco del Gigante ----------
  tortaMele() {
    const d = pen(S, S), R = ramp('#d8a050');
    piatto(d);
    d.ell(16, 18, 13, 7, R[1]); d.ell(16, 17, 12, 6, R[3]);
    for (let i = -10; i <= 10; i += 4) { d.line(16 + i, 12, 16 + i + 3, 22, R[1]); }               // griglia di pasta
    for (const [x, y] of [[10, 16], [18, 15], [22, 18]]) d.P('#e8d080', x, y, 3, 2);
    d.ell(14, 17, 2, 1, '#c03028');                                                                // un pezzo di Rugginella
    return outline(d.c);
  },
  croccante() {
    const d = pen(S, S), R = ramp('#c88a30');
    d.poly([[4, 18], [14, 8], [28, 12], [26, 24], [10, 26]], R[2]);
    d.poly([[4, 18], [14, 8], [16, 12], [8, 20]], R[4]);
    for (const [x, y] of [[10, 17], [16, 14], [21, 19], [14, 22], [22, 14]]) d.ball(x, y, 2, 1.5, ramp('#e8d0a0'));
    luccica(d, 25, 7);
    return outline(d.c);
  },
  zabaione() {
    const d = pen(S, S);
    d.poly([[6, 8], [26, 8], [21, 22], [11, 22]], '#d8eef4');                                     // coppa
    d.ell(16, 10, 10, 2, '#f0d050'); d.poly([[7, 10], [25, 10], [21, 20], [11, 20]], '#f0c840');
    d.ell(16, 9, 9, 2, '#f8e080'); d.P('#fff4c0', 10, 9, 6, 1);
    d.box(14, 22, 4, 5, ramp('#d8eef4')); d.ell(16, 28, 7, 2, '#c8dee8');
    d.ball(23, 6, 3, 3, ramp('#8a4a24'));                                                         // un savoiardo
    return outline(d.c);
  },
  fritturaOglio() {
    const d = pen(S, S);
    d.poly([[6, 6], [26, 6], [22, 30], [10, 30]], '#f0e8d0');                                     // cartoccio
    d.line(6, 6, 10, 30, '#c8c0a8'); d.P('#3a6aa0', 9, 18, 14, 3);
    for (const [x, y] of [[10, 6], [15, 4], [20, 6], [13, 8], [19, 9], [24, 5]]) d.ball(x, y, 3, 2.5, ramp('#e0a840'));   // pescetti fritti
    d.P('#1e1622', 14, 3, 1, 1); d.P('#1e1622', 23, 4, 1, 1);
    d.ell(26, 12, 3, 2, '#f0f040');                                                               // spicchio di limone
    return outline(d.c);
  },
  bombaPigne() {
    const d = pen(S, S), R = ramp('#9a6430');
    for (const [x, y] of [[10, 20], [21, 20], [16, 12]]) {
      d.ball(x, y, 6, 8, R);
      for (let yy = y - 6; yy < y + 7; yy += 3) d.P(R[0], x - 4, yy, 8, 1);
    }
    d.line(4, 14, 26, 26, '#d8d0c0', 2); d.line(4, 24, 26, 12, '#d8d0c0', 2);                     // legate col fil di ferro
    d.line(16, 4, 20, 1, '#5a4a3a'); d.P('#ffd040', 20, 0, 2, 2); d.P('#ff6020', 21, 1, 1, 1);    // miccia accesa
    return outline(d.c);
  },
};
Object.assign(ICONE_LOOT, ICONE);

// ---------- Oggetti del parco sulla mappa ----------
// cartello «VIETATO» su un palo (16x22)
export function cartelloParco() {
  const d = pen(16, 22);
  d.box(7, 9, 2, 13, ramp('#7a7a82'));
  d.box(1, 1, 14, 9, ramp('#f0f0ea'));
  d.ell(4.5, 5, 2.5, 2.5, '#c02020'); d.ell(4.5, 5, 1.4, 1.4, '#f0f0ea');
  d.P('#1e1622', 8, 3, 6, 1); d.P('#1e1622', 8, 5, 5, 1); d.P('#1e1622', 8, 7, 6, 1);
  return outline(d.c);
}
// carriola nuova di zecca delle guardie (24x16)
export function carriola() {
  const d = pen(24, 16), R = ramp('#3a7a3a');
  d.poly([[2, 3], [19, 3], [16, 10], [4, 10]], R[2]); d.P(R[4], 2, 3, 17, 1);
  d.ell(5, 12, 3, 3, '#1e1622'); d.ell(5, 12, 1.5, 1.5, FERRO[3]);
  d.line(17, 5, 23, 11, LEGNO[1], 1); d.line(15, 8, 22, 14, LEGNO[1], 1);
  d.P('#f0d040', 8, 5, 6, 2);                                                                     // «PARCO OGLIO»
  return outline(d.c);
}
// ceppo di un albero tagliato (20x12)
export function ceppo() {
  const d = pen(20, 12);
  d.cyl(3, 4, 14, 7, LEGNO);
  d.ell(10, 4, 7, 2.5, ramp('#e0c090')[2]); d.ell(10, 4, 3, 1, ramp('#c09060')[1]);
  for (const [x, y] of [[1, 10], [17, 10], [5, 11]]) d.P('#6a8a3a', x, y, 2, 1);
  return outline(d.c);
}
// nido d'anatra tra le canne (16x12)
export function nidoAnatra(conUova = true) {
  const d = pen(16, 12);
  for (const x of [1, 3, 13, 15]) d.line(x, 0, x, 9, '#7a9a4a');
  d.ell(8, 9, 7, 3, ramp('#9a7442')[1]); d.ell(8, 8, 5, 2, ramp('#6a4a2a')[1]);
  if (conUova) for (const x of [5, 8, 11]) d.ball(x, 7, 1.6, 2, ramp('#c8e8d0'));
  return outline(d.c);
}
// cuoricino sopra la coppietta (10x9)
export function cuore() {
  const d = pen(10, 9), R = ramp('#ff5070');
  d.ball(3, 3, 2.5, 2.5, R); d.ball(7, 3, 2.5, 2.5, R);
  d.poly([[0.5, 4], [9.5, 4], [5, 9]], R[2]); d.P('#ffffff', 2, 2, 1, 1);
  return outline(d.c);
}
// segno di pesca: un galleggiante tra i cerchi nell'acqua (14x8)
export function galleggiante() {
  const d = pen(14, 8);
  d.ell(7, 5, 6, 2, '#a8d8f0'); d.ell(7, 5, 4.5, 1.2, '#5a9ac8');
  d.P('#e02020', 6, 1, 2, 3); d.P('#f4f4f4', 6, 3, 2, 1);
  return d.c;
}
