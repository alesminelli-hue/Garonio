// La mappa dell'azienda del Gigante: SOLO dati e funzioni pure (niente Three.js).
// La usano il mondo 3D (world.js), le regole (game.js), la minimappa e i mezzi guidabili.
// Coordinate in caselle: x verso est (destra), z verso sud (verso la camera). 1 casella = 1 unità 3D.
//
//   z=0  ┌──────────────────────── bosco ─────────────────────────┐
//        │≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈ canale (nutrie) ≈≈≈≈≈≈≈≈≈╪ponte≈≈≈≈≈≈≈│
//        │  [grano]   FIENILE [MAIS]   [arato]        │  [grano]    │
//        │  ════════════════ capezzagna (sterrato) ═══╧═══════════  │
//        │     ║                 ║                                ║ │
//   z=54 ═══ BAR/paese ══════════╬═══ provinciale (asfalto) ══════╬═══
//        │                       ║            silos  ║            │
//        │              CASA  OFFICINA         CAPANNONI MAIALI    │
//        │             orto  pollaio          recinto maiali       │
//        │     laghetto      STALLA                                │
//        │  CASCINA OGLIO ═══ viale del parco ═══ GUARDIE          │
//        │  ≈≈≈≈≈≈≈≈≈≈≈ fiume Oglio (Parco Oglio, bosco) ≈≈≈≈≈≈≈≈≈≈≈≈ │
//   z=112└──────────────────────── bosco ─────────────────────────┘

export const MAP_VERSION = 2;          // cambiarlo azzera campi e uova dei vecchi salvataggi
export const MAP_W = 160, MAP_H = 112;

// Canale a nord: da qui escono le nutrie. I ponti lo attraversano.
export const CANAL = { z0: 3, z1: 6, bridges: [{ x0: 118, x1: 120 }] };

// ---------- Strade ----------
// Ogni strada è una spezzata lungo la mezzeria. width = larghezza in caselle.
// type: 'asfalto' (veloce) | 'sterrato' (medio). Le strade possono uscire dalla mappa.
export const ROADS = [
  { id: 'provinciale', name: 'Strada provinciale', type: 'asfalto', width: 4, points: [[-6, 54], [MAP_W + 6, 54]] },
  { id: 'capezzagna', name: 'Capezzagna dei campi', type: 'sterrato', width: 2, points: [[23, 29], [153, 29]] },
  { id: 'via-mulino', name: 'Via del Mulino', type: 'sterrato', width: 2, points: [[23, 29], [23, 54]] },
  { id: 'via-campi', name: 'Via dei Campi', type: 'sterrato', width: 2, points: [[74, 29], [74, 54]] },
  { id: 'via-est', name: 'Strada dell\'argine', type: 'sterrato', width: 2, points: [[153, 29], [153, 54]] },
  { id: 'vialetto', name: 'Vialetto di casa', type: 'sterrato', width: 2, points: [[74, 54], [74, 68.5]] },
  { id: 'via-maiali', name: 'Via dei Capannoni', type: 'sterrato', width: 2, points: [[125, 54], [125, 69.5]] },
  { id: 'via-ponte', name: 'Strada del ponte', type: 'sterrato', width: 2, points: [[119, 29], [119, -4]] },
  // il paese nuovo a sud della piazza: chiesa, farmacia, dottore, pizzeria e, giù nel bosco, il castello
  { id: 'via-roma', name: 'Via Roma', type: 'sterrato', width: 2, points: [[21, 54], [21, 102], [10, 102]] },
  { id: 'via-chiesa', name: 'Via della Chiesa', type: 'sterrato', width: 2, points: [[2, 76], [21, 76]] },
  { id: 'via-gennaro', name: 'Vicolo della Pizzeria', type: 'sterrato', width: 2, points: [[21, 74], [38, 74]] },
  // Parco Oglio (src/parco.js): dal vialetto di casa giù fino al bosco e al fiume
  { id: 'via-parco', name: 'Strada del Parco', type: 'sterrato', width: 2, points: [[74, 68.5], [74, 91], [54, 91]] },
  { id: 'viale-oglio', name: 'Viale dell\'Oglio', type: 'sterrato', width: 2, points: [[74, 91], [146, 91]] },
  { id: 'sentiero-ovest', name: 'Sentiero dei pioppi', type: 'sterrato', width: 2, points: [[62, 91], [62, 108]] },
  { id: 'sentiero-guado', name: 'Sentiero del guado', type: 'sterrato', width: 2, points: [[118, 91], [118, 108]] },
  { id: 'via-stalla', name: 'Viottolo della stalla', type: 'sterrato', width: 2, points: [[74, 72], [105.5, 72], [105.5, 76]] },
];

// Parco Oglio: il fiume e i ponti dei sentieri (parapetti in world.js)
export const PARCO = { x0: 44, z0: 86, x1: 158, z1: 110 };
export const PONTI_FIUME = [{ x0: 61, x1: 63, z0: 99, z1: 102 }, { x0: 117, x1: 119, z0: 100, z1: 103 }];

// Quanto vanno veloci i mezzi su ogni fondo (1 = piena velocità). Suggerimento per i mezzi guidabili.
export const SURFACE_SPEED = { asfalto: 1, piazza: 0.9, ponte: 0.8, sterrato: 0.8, erba: 0.6, campo: 0.45, fango: 0.4, acqua: 0 };

// ---------- Zone lavorabili (usate dalle regole del gioco) ----------
export const AREAS = {
  field: { x0: 64, x1: 84, z0: 12, z1: 22, crop: 'mais', name: 'Campo di mais' },
  orto: { x0: 62, x1: 69, z0: 73, z1: 77, crop: 'pomodoro', name: 'Orto' },
  // l'orto della Cascina dei Salici: si usa quando Garonio compra l'azienda (src/azienda.js), e quello di casa torna al Gigante
  ortoSalici: { x0: 77, x1: 84, z0: 43, z1: 47, crop: 'pomodoro', name: 'Orto della Cascina dei Salici' },
  coop: { x0: 77, x1: 85, z0: 73, z1: 80, name: 'Pollaio', gate: [79, 81] },
};

// ---------- Zone di terreno decorative ----------
// tile: carattere della griglia. shape 'ellipse' usa il rettangolo come contorno.
export const ZONES = [
  { tile: 'y', x0: 26, x1: 47, z0: 9, z1: 26, name: 'Grano' },
  { tile: 'r', x0: 90, x1: 113, z0: 9, z1: 26, name: 'Campo arato' },
  { tile: 'y', x0: 123, x1: 150, z0: 9, z1: 26, name: 'Grano' },
  { tile: 'q', x0: 0, x1: 40, z0: 50, z1: 52, name: 'Piazza del paese' },
  { tile: 'p', x0: 58, x1: 92, z0: 66, z1: 71, name: 'Aia' },
  { tile: 'p', x0: 119, x1: 156, z0: 68, z1: 71, name: 'Cortile dei capannoni' },
  { tile: 's', x0: 128, x1: 152, z0: 73, z1: 83, name: 'Recinto dei maiali', fence: true, gate: [138, 141] },
  { tile: 'w', x0: 28, x1: 42, z0: 78, z1: 89, name: 'Laghetto', shape: 'ellipse', solid: true },
  { tile: 'w', x0: 114, x1: 116, z0: 10, z1: 27, name: 'Fosso del Potato', solid: true },   // cascine (src/cascine.js)
  { tile: 'p', x0: 93, x1: 109, z0: 39, z1: 42, name: 'Aia del Potato' },
  { tile: 'p', x0: 29, x1: 44, z0: 39, z1: 42, name: 'Aia del Postman' },
  { tile: 'p', x0: 134, x1: 152, z0: 38, z1: 42, name: 'Cortile del ranch' },
  { tile: 'q', x0: 3, x1: 13, z0: 74, z1: 75, name: 'Sagrato della chiesa' },
  { tile: 'q', x0: 3, x1: 18, z0: 98, z1: 101, name: 'Cortile del castello' },
  { tile: 'p', x0: 51, x1: 69, z0: 50, z1: 52, name: 'Piazzale del meccanico' },
  // Parco Oglio: il fiume esce dal laghetto e attraversa il bosco fino al bordo est
  ...[[39, 42, 87, 102], [39, 76, 99, 102], [73, 76, 95, 102], [73, 105, 95, 98], [102, 105, 95, 103], [102, 136, 100, 103], [133, 136, 96, 103], [133, 160, 96, 99]]
    .map(([x0, x1, z0, z1]) => ({ tile: 'w', x0, x1, z0, z1, name: 'Fiume Oglio', solid: true })),
  { tile: 'p', x0: 48, x1: 60, z0: 89, z1: 90, name: 'Aia del Vecchio Camper' },
  // la Cascina dei Salici: in vendita all'Ufficio agricolo dopo la storia (src/azienda.js)
  { tile: 'p', x0: 76, x1: 93, z0: 35, z1: 36.5, name: 'Aia della Cascina dei Salici' },
  { tile: 'r', x0: 76.5, x1: 84, z0: 37.6, z1: 41.8, name: 'Campo della casa (Cascina dei Salici)' },
  { tile: 'r', x0: 77.5, x1: 86.8, z0: 21.4, z1: 26.4, name: 'Campo del fosso (Cascina dei Salici)' },
  { tile: 'r', x0: 85.5, x1: 94, z0: 45, z1: 49.8, name: 'Campo del pioppo (Cascina dei Salici)' },
  { tile: 'p', x0: 96, x1: 109, z0: 48, z1: 51, name: 'Piazzale del Consorzio Rodella' },
  { tile: 'p', x0: 99, x1: 117, z0: 76, z1: 84, name: 'Recinto della stalla', fence: true, gate: [104, 107] },
];

// ---------- Edifici ----------
// I primi hanno una porta usabile (id noto a game.js). decor: true = solo scenografia.
// wall: 'casa' | 'metallo' | 'legno' | 'bar' oppure un colore '#rrggbb' (intonaco).
export const BUILDINGS = [
  { id: 'casa', label: 'CASA', x0: 62, z0: 61, w: 7, d: 5, h: 2.8, wall: 'casa', roof: '#b8432e', windows: 2 },
  { id: 'officina', label: 'DEPOSITO', x0: 80, z0: 60, w: 7, d: 6, h: 3, wall: 'metallo', roof: '#6a7078', windows: 1 },
  { id: 'bar', label: 'BAR', x0: 10, z0: 45, w: 7, d: 5, h: 2.8, wall: 'bar', roof: '#3a7a4a', windows: 2 },
  { id: 'maiali', label: 'MAIALI', x0: 128, z0: 62, w: 12, d: 6, h: 2.6, wall: 'metallo', roof: '#8a4a32', windows: 0 },
  { id: 'magazzino', label: 'BUBETTO', x0: 41, z0: 44, w: 8, d: 5.5, h: 3.2, wall: 'metallo', roof: '#4a7a5a', windows: 1 },
  { id: 'gallinaio', label: '', x0: 82, z0: 73.5, w: 2.5, d: 2, h: 1.4, wall: 'legno', roof: '#7a4a26', windows: 0, noDoor: true },
  // edifici del paese esplorabili (interni in src/data/interni.js, personaggi in src/data/png.js)
  { id: 'chiesa', label: '', x0: 2.5, z0: 68, w: 8, d: 6.4, h: 4.2, wall: '#efe2c4', roof: '#a8462e', windows: 2 },
  { id: 'farmacia', label: 'FARMACIA', x0: 13.5, z0: 69.4, w: 6, d: 5, h: 2.8, wall: '#ece6d6', roof: '#a83a2a', windows: 1 },
  { id: 'dottore', label: 'STUDIO MEDICO', x0: 23, z0: 67.4, w: 6, d: 5, h: 3, wall: '#e4ecf0', roof: '#8a3a2a', windows: 2 },
  { id: 'pizzeria', label: 'BELLA NAPOLI', x0: 30.5, z0: 67.4, w: 6, d: 5, h: 2.8, wall: '#f0d8a8', roof: '#b8432e', windows: 1 },
  { id: 'kebab', label: 'KEBAB', x0: 17.6, z0: 45.5, w: 4, d: 4, h: 2.8, wall: '#f4e4b8', roof: '#5a4a3a', windows: 0 },
  { id: 'meccanico', label: 'DA ZENO', x0: 52, z0: 44.4, w: 8, d: 6, h: 3.2, wall: 'metallo', roof: '#3a5a8a', windows: 1 },
  { id: 'palestra', label: 'PALESTRA', x0: 61, z0: 44.6, w: 7, d: 5.8, h: 3.2, wall: '#d0ccc0', roof: '#4a4a52', windows: 1 },
  { id: 'castello', label: 'CASTELLO', x0: 5.5, z0: 91, w: 9, d: 7, h: 4.5, wall: '#a8a090', roof: '#8a8476', windows: 0, tetto: 'merli' },
  { id: 'campanile', label: '', x0: 10.7, z0: 70.4, w: 2, d: 2, h: 7.5, wall: '#b4583a', roof: '#7a3a2a', windows: 0, decor: true, noDoor: true, tetto: 'cuspide' },
  { id: 'torre-sx', label: '', x0: 2.5, z0: 92, w: 3, d: 3, h: 6.5, wall: '#9a9484', roof: '#7a3a2a', windows: 0, decor: true, noDoor: true, tetto: 'cuspide' },
  { id: 'torre-dx', label: '', x0: 14.5, z0: 92, w: 3, d: 3, h: 6.5, wall: '#9a9484', roof: '#7a3a2a', windows: 0, decor: true, noDoor: true, tetto: 'cuspide' },
  // scenografia
  { id: 'capannone2', porta: true, label: '', x0: 142, z0: 62, w: 10, d: 6, h: 2.6, wall: 'metallo', roof: '#8a4a32', windows: 0, decor: true },
  { id: 'fienile', porta: true, label: 'FIENILE', x0: 51, z0: 19, w: 7, d: 5, h: 3.2, wall: 'legno', roof: '#7a4a26', windows: 0, decor: true },
  { id: 'alimentari', porta: true, label: 'ALIMENTARI', x0: 1, z0: 45, w: 7, d: 5, h: 2.8, wall: '#e8c070', roof: '#b8432e', windows: 1, decor: true },
  { id: 'casa-rosa', porta: true, label: '', x0: 30, z0: 44, w: 6, d: 6, h: 3.4, wall: '#e8a8a0', roof: '#a83a2a', windows: 2, decor: true },
  { id: 'casa-azzurra', porta: true, label: '', x0: 3, z0: 62, w: 6, d: 4, h: 2.8, wall: '#a8c8e0', roof: '#8a3a2a', windows: 2, decor: true },
  { id: 'tabacchi', porta: true, label: 'TABACCHI', x0: 13, z0: 62, w: 6, d: 4, h: 2.8, wall: '#f0e0b0', roof: '#b8432e', windows: 1, decor: true },
  { id: 'municipio', porta: true, label: 'MUNICIPIO', x0: 24.6, z0: 44.4, w: 5, d: 5, h: 3.2, wall: '#e8dcc0', roof: '#8a3a2a', windows: 1, decor: true }, // ufficio multe (src/vigilessa.js)
  { id: 'paradiso', label: 'NIGHT WELCOME', x0: 44, z0: 61, w: 8, d: 5, h: 3, wall: '#6a3a7a', roof: '#2a2030', windows: 1, decor: true }, // svago serale (src/paradiso.js)
  { id: 'tettoia', label: '', x0: 88, z0: 61, w: 5, d: 4, h: 2.2, wall: 'legno', roof: '#6a7078', windows: 0, decor: true, noDoor: true },
  // cascine dei vicini (GDD 19.5): la logica è in src/cascine.js, i dati in src/data/vicini.js
  { id: 'cascina-patata', porta: true, label: 'CASCINA DEL POTATO', x0: 97, z0: 34, w: 8, d: 5, h: 2.8, wall: '#e0c48a', roof: '#a8462e', windows: 2, decor: true },
  { id: 'cascina-postino', porta: true, label: 'CASCINA DEL POSTMAN', x0: 33, z0: 34, w: 7, d: 5, h: 2.8, wall: '#f0d8b8', roof: '#8a3a2a', windows: 2, decor: true },
  { id: 'ranch-frank', porta: true, label: 'RANCH MISTER FRANK', x0: 140, z0: 33, w: 9, d: 5, h: 3, wall: 'legno', roof: '#7a2a22', windows: 2, decor: true },
  // Parco Oglio (src/parco.js) e stalla (src/stalla.js)
  // Cascina dei Salici (src/azienda.js): abbandonata finché Garonio non la compra in comune
  { id: 'salici-casa', porta: -2, label: 'CASCINA DEI SALICI', x0: 76.5, z0: 30.4, w: 7, d: 4.4, h: 2.8, wall: '#e0d0a8', roof: '#9a4a32', windows: 2, decor: true },
  { id: 'salici-porcilaia', porta: true, label: 'PORCILAIA', x0: 84.5, z0: 30.4, w: 8, d: 4.2, h: 2.4, wall: 'metallo', roof: '#7a4a32', windows: 0, decor: true },
  { id: 'salici-stalla', porta: true, label: 'STALLA', x0: 88.4, z0: 38.6, w: 4.6, d: 3.6, h: 2.4, wall: 'legno', roof: '#6a5a3a', windows: 1, decor: true },
  { id: 'salici-pollaio', porta: true, label: 'POLLAIO', x0: 84.6, z0: 39.1, w: 3.2, d: 2.6, h: 2.0, wall: 'legno', roof: '#8a6a3a', windows: 0, decor: true },
  // Consorzio agrario di Mister Rodella (src/consorzio.js): mangimi, sementi gratis, trattori
  { id: 'consorzio', porta: -3, label: 'CONSORZIO RODELLA', x0: 97.5, z0: 42.6, w: 10, d: 5.2, h: 3.4, wall: 'metallo', roof: '#2a6a3a', windows: 1, decor: true },
  { id: 'cascina-oglio', porta: -2.8, label: 'CASCINA DEL CAMPER', x0: 49, z0: 84, w: 8, d: 5, h: 2.8, wall: '#d8c08a', roof: '#8a4a2a', windows: 2, decor: true },
  { id: 'casotto-guardie', porta: 2.6, label: 'GUARDIE DEL PARCO', x0: 108, z0: 85.4, w: 7, d: 4.4, h: 2.8, wall: 'legno', roof: '#3a5a2a', windows: 1, decor: true },
  { id: 'stalla', porta: true, label: 'STALLA', x0: 108, z0: 77, w: 7, d: 4.5, h: 3, wall: 'legno', roof: '#7a4a26', windows: 0, decor: true },
];

// ---------- Oggetti di scena ----------
export const PROPS = [
  { kind: 'silo', x: 120.5, z: 63, r: 1.3, h: 5 },
  { kind: 'silo', x: 120.5, z: 59.5, r: 1.1, h: 4.2 },
  ...[[49, 26], [50.6, 26.4], [59.5, 25.5], [30, 23], [33, 20.5], [41, 24], [128, 23], [134, 21], [143, 24.5]]
    .map(([x, z]) => ({ kind: 'balla', x, z })),
  { kind: 'cartello', x: 21.2, z: 51.4, text: 'CAMPI ↑' },
  { kind: 'cartello', x: 72.2, z: 51.4, text: 'CAMPI ↑' },
  { kind: 'cartello', x: 77.5, z: 57.6, text: 'AZIENDA ↓' },
  { kind: 'cartello', x: 127, z: 57.4, text: 'MAIALI ↓' },
  { kind: 'cartello', x: 38, z: 57.4, text: '← BAR' },
  { kind: 'cartello', x: 50.6, z: 57.4, text: 'NIGHT ↓' },   // Night Welcome (src/paradiso.js)
  { kind: 'cartello', x: 30.5, z: 51.6, text: 'NIGHT →' },
  { kind: 'cartello', x: 19.2, z: 57.4, text: 'CHIESA ↓' },
  { kind: 'cartello', x: 19.2, z: 80, text: 'CASTELLO ↓' },
  { kind: 'cartello', x: 76.2, z: 86, text: 'PARCO OGLIO ↓' },
  { kind: 'cartello', x: 72.2, z: 73.4, text: 'STALLA →' },
];

// ---------- Punti importanti ----------
export const PLACES = {
  spawn: { x: 65.5, z: 67.6 },          // davanti alla porta di casa: sveglia e ritorno a casa
  gigante: { x: 60.6, z: 67.4 },        // dove aspetta il Gigante
  cassa: { x: 70.4, z: 67.1 },          // cassa per vendere
  mangiatoia: { x: 79.5, z: 78.5 },     // mangiatoia delle galline
  titleCam: { x: 74, z: 62 },           // centro della panoramica del titolo
  nutriaSpawnZ: CANAL.z1 + 0.6,         // le nutrie escono dal bordo del canale...
  nutriaFleeZ: CANAL.z0 + 1.5,          // ...e ci ritornano quando scappano
  // dove parcheggiare/far comparire i mezzi (dir = angolo in radianti, 0 = verso est)
  parking: {
    casa: { x: 77.5, z: 68.5, dir: 0 },
    tettoia: { x: 90.5, z: 67.5, dir: Math.PI / 2 },
    officina: { x: 86.5, z: 68.5, dir: 0 },
    bar: { x: 21, z: 51, dir: 0 },
    campi: { x: 77, z: 27, dir: 0 },
    maiali: { x: 121.5, z: 69.5, dir: 0 },
    meccanico: { x: 64.5, z: 51, dir: 0 },     // davanti da Zeno (src/officina.js)
  },
};

// Punti di riferimento per minimappa e cartelli.
export const LANDMARKS = [
  { name: 'Casa', x: 65.5, z: 63.5 }, { name: 'Deposito', x: 83.5, z: 63 }, { name: 'Bar', x: 13.5, z: 47.5 }, { name: 'Bubetto', x: 45, z: 46.5 },
  { name: 'Maiali', x: 134, z: 65 }, { name: 'Campo', x: 74, z: 17 }, { name: 'Orto', x: 65.5, z: 75 },
  { name: 'Pollaio', x: 81, z: 76.5 }, { name: 'Laghetto', x: 35, z: 83.5 },
  { name: 'Welcome', x: 48, z: 63.5 },
  { name: 'Mercato', x: 33, z: 62 }, { name: 'Gare', x: 61, z: 27.5 },
  { name: 'Potato', x: 101, z: 36.5 }, { name: 'Postman', x: 36.5, z: 36.5 }, { name: 'Frank', x: 144.5, z: 35.5 },
  { name: 'Chiesa', x: 6.5, z: 71 }, { name: 'Farmacia', x: 16.5, z: 72 }, { name: 'Dottore', x: 26, z: 70 }, { name: 'Bella Napoli', x: 33.5, z: 70 },
  { name: 'Kebab', x: 19.6, z: 47.5 }, { name: 'Zeno', x: 56, z: 47.4 }, { name: 'Palestra', x: 64.5, z: 47.5 }, { name: 'Castello', x: 10, z: 94.5 },
  { name: 'Parco Oglio', x: 96, z: 104 }, { name: 'Vecchio Camper', x: 53, z: 86.5 }, { name: 'Guardie', x: 111.5, z: 87.5 }, { name: 'Stalla', x: 108, z: 80 },
  { name: 'Cascina dei Salici', x: 84, z: 34 },
  { name: 'Consorzio Rodella', x: 102.5, z: 49 },
];

// ---------- Griglia del terreno ----------
// Caratteri: g erba · w acqua · b ponte · p sterrato · a asfalto · q piazza · f campo · o orto
//            c pollaio · s recinto maiali · y grano · r arato
export function inZone(zn, x, z) {
  if (zn.shape === 'ellipse') {
    const rx = (zn.x1 - zn.x0) / 2, rz = (zn.z1 - zn.z0) / 2;
    const dx = (x + 0.5 - zn.x0 - rx) / rx, dz = (z + 0.5 - zn.z0 - rz) / rz;
    return dx * dx + dz * dz <= 1;
  }
  return x >= zn.x0 && x < zn.x1 && z >= zn.z0 && z < zn.z1;
}

export function buildTileGrid() {
  const grid = [];
  for (let z = 0; z < MAP_H; z++) {
    const row = [];
    for (let x = 0; x < MAP_W; x++) {
      let ch = 'g';
      for (const zn of ZONES) if (inZone(zn, x, z)) ch = zn.tile;
      if (z >= CANAL.z0 && z < CANAL.z1) ch = 'w';
      for (const [k, a] of Object.entries(AREAS)) if (inZone(a, x, z)) ch = k === 'coop' ? 'c' : k[0];
      row.push(ch);
    }
    grid.push(row);
  }
  // strade: prima lo sterrato, poi l'asfalto sopra; sull'acqua diventano ponte
  for (const type of ['sterrato', 'asfalto']) {
    for (const r of ROADS) {
      if (r.type !== type) continue;
      for (let i = 0; i < r.points.length - 1; i++) {
        const [ax, az] = r.points[i], [bx, bz] = r.points[i + 1];
        const x0 = Math.max(0, Math.floor(Math.min(ax, bx) - r.width)), x1 = Math.min(MAP_W - 1, Math.ceil(Math.max(ax, bx) + r.width));
        const z0 = Math.max(0, Math.floor(Math.min(az, bz) - r.width)), z1 = Math.min(MAP_H - 1, Math.ceil(Math.max(az, bz) + r.width));
        for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) {
          if (segDist(x + 0.5, z + 0.5, ax, az, bx, bz) > r.width / 2) continue;
          grid[z][x] = grid[z][x] === 'w' ? 'b' : (type === 'asfalto' ? 'a' : 'p');
        }
      }
    }
  }
  return grid;
}

const SURFACE_OF = { a: 'asfalto', q: 'piazza', b: 'ponte', p: 'sterrato', g: 'erba', c: 'erba', f: 'campo', o: 'campo', y: 'campo', r: 'campo', s: 'fango', w: 'acqua' };
let _grid = null;
// Fondo sotto un punto: 'asfalto' | 'sterrato' | 'erba' | 'campo' | ... (vedi SURFACE_SPEED)
export function surfaceAt(x, z) {
  _grid ??= buildTileGrid();
  const ch = _grid[Math.floor(z)]?.[Math.floor(x)];
  return ch ? SURFACE_OF[ch] : 'erba';
}
export function isRoad(x, z) { const s = surfaceAt(x, z); return s === 'asfalto' || s === 'sterrato' || s === 'ponte' || s === 'piazza'; }

// ---------- Rete stradale come grafo (per mezzi, IA e navigatore) ----------
function segDist(px, pz, ax, az, bx, bz) {
  const p = projectOnSeg(px, pz, ax, az, bx, bz);
  return Math.hypot(px - p.x, pz - p.z);
}
function projectOnSeg(px, pz, ax, az, bx, bz) {
  const dx = bx - ax, dz = bz - az, L2 = dx * dx + dz * dz;
  const t = L2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / L2)) : 0;
  return { x: ax + dx * t, z: az + dz * t, t };
}
function segIntersect(a, b, c, d) {
  const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]];
  const den = r[0] * s[1] - r[1] * s[0];
  if (Math.abs(den) < 1e-9) return null;
  const t = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / den;
  const u = ((c[0] - a[0]) * r[1] - (c[1] - a[1]) * r[0]) / den;
  if (t < -1e-6 || t > 1 + 1e-6 || u < -1e-6 || u > 1 + 1e-6) return null;
  return [a[0] + r[0] * t, a[1] + r[1] * t];
}

// Nodi = estremi e incroci; archi = tratti di strada tra due nodi consecutivi.
function buildGraph() {
  const nodes = [], edges = [];
  const nodeAt = (x, z) => {
    let n = nodes.find(n => Math.hypot(n.x - x, n.z - z) < 0.05);
    if (!n) { n = { id: nodes.length, x, z, edges: [] }; nodes.push(n); }
    return n;
  };
  for (const r of ROADS) {
    for (let i = 0; i < r.points.length - 1; i++) {
      const a = r.points[i], b = r.points[i + 1];
      const pts = [a, b];
      for (const o of ROADS) for (let j = 0; j < o.points.length - 1; j++) {
        if (o === r && j === i) continue;
        const p = segIntersect(a, b, o.points[j], o.points[j + 1]);
        if (p) pts.push(p);
      }
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      pts.sort((p, q) => Math.hypot(p[0] - a[0], p[1] - a[1]) / L - Math.hypot(q[0] - a[0], q[1] - a[1]) / L);
      for (let k = 0; k < pts.length - 1; k++) {
        const n1 = nodeAt(...pts[k]), n2 = nodeAt(...pts[k + 1]);
        if (n1 === n2) continue;
        const e = { id: edges.length, a: n1.id, b: n2.id, road: r.id, type: r.type, len: Math.hypot(n2.x - n1.x, n2.z - n1.z) };
        edges.push(e); n1.edges.push(e.id); n2.edges.push(e.id);
      }
    }
  }
  return { nodes, edges };
}
export const ROAD_GRAPH = buildGraph();

// Punto di strada più vicino a (x, z): { x, z, road, dist }
export function nearestRoadPoint(x, z) {
  let best = null;
  for (const r of ROADS) for (let i = 0; i < r.points.length - 1; i++) {
    const [ax, az] = r.points[i], [bx, bz] = r.points[i + 1];
    const p = projectOnSeg(x, z, ax, az, bx, bz);
    const d = Math.hypot(x - p.x, z - p.z);
    if (!best || d < best.dist) best = { x: p.x, z: p.z, road: r.id, dist: d };
  }
  return best;
}

// Percorso su strada (lista di punti [x, z]) dal nodo più vicino ad A a quello più vicino a B.
export function roadPath(ax, az, bx, bz) {
  const { nodes, edges } = ROAD_GRAPH;
  const near = (x, z) => nodes.reduce((m, n) => (Math.hypot(n.x - x, n.z - z) < Math.hypot(m.x - x, m.z - z) ? n : m));
  const s = near(ax, az), t = near(bx, bz);
  const dist = new Map([[s.id, 0]]), prev = new Map(), open = new Set([s.id]);
  while (open.size) {
    let u = null;
    for (const id of open) if (u === null || dist.get(id) < dist.get(u)) u = id;
    open.delete(u);
    if (u === t.id) break;
    for (const eid of nodes[u].edges) {
      const e = edges[eid], v = e.a === u ? e.b : e.a;
      const w = e.len / (SURFACE_SPEED[e.type] || 1);
      const nd = dist.get(u) + w;
      if (nd < (dist.get(v) ?? Infinity)) { dist.set(v, nd); prev.set(v, u); open.add(v); }
    }
  }
  const path = [];
  for (let id = t.id; id !== undefined; id = prev.get(id)) { path.unshift([nodes[id].x, nodes[id].z]); if (id === s.id) break; }
  return path;
}

// Un punto a caso dentro il pollaio, lontano dalla casetta delle galline.
export function coopSpot(rnd = Math.random) {
  const c = AREAS.coop, h = BUILDINGS.find(b => b.id === 'gallinaio');
  for (let i = 0; i < 30; i++) {
    const x = c.x0 + 0.6 + rnd() * (c.x1 - c.x0 - 1.2), z = c.z0 + 0.6 + rnd() * (c.z1 - c.z0 - 1.2);
    if (h && x > h.x0 - 0.4 && x < h.x0 + h.w + 0.4 && z > h.z0 - 0.4 && z < h.z0 + h.d + 0.6) continue;
    return { x, z };
  }
  return { x: (c.x0 + c.x1) / 2, z: c.z1 - 1 };
}
