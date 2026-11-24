// =====================================================================
//  ALBERI COL TESORO — loot nascosto sugli alberi della mappa (src/alberi.js)
//  Ogni giorno alcuni alberi a caso (cambiano ogni mattina) nascondono qualcosa tra i rami:
//  ci si avvicina a piedi, «🌳 Scuoti l'albero» (E) e la roba cade giù.
//  Gli altri alberi a volte danno una mela, una pigna in testa o una gazza arrabbiata.
// =====================================================================

export const ALBERI = {
  tesoriAlGiorno: 18,     // alberi col tesoro ogni giorno, scelti a caso fra quelli raggiungibili
  raggio: 1.35,           // quanto vicino bisogna stare all'albero
  fatica: 1.5,            // fatica per ogni scossone
  // albero col tesoro: un'estrazione pesata (w). Armi e vestiti: solo quelli che Garonio non ha,
  // e solo fino a qualche livello sopra il suo (liv dell'arma in src/data/armi.js).
  tesoro: [
    { tipo: 'arma', w: 14, livelloSopra: 3 },
    { tipo: 'vestito', w: 16 },
    { tipo: 'oggetto', id: 'mela', n: [2, 4], w: 14 },
    { tipo: 'oggetto', id: 'noci', n: [2, 4], w: 10 },
    { tipo: 'oggetto', id: 'nido', n: [1, 1], w: 7 },
    { tipo: 'oggetto', id: 'gingillo', n: [1, 2], w: 6 },
    { tipo: 'oggetto', id: 'miele', n: [1, 2], w: 5 },
    { tipo: 'oggetto', id: 'pepita', n: [1, 1], w: 2, daLivello: 15 },
    { tipo: 'soldi', n: [12, 45], w: 8 },
  ],
  // albero normale
  comune: [
    { tipo: 'niente', w: 52 },
    { tipo: 'oggetto', id: 'mela', n: [1, 2], w: 16 },
    { tipo: 'oggetto', id: 'noci', n: [1, 2], w: 10 },
    { tipo: 'oggetto', id: 'pigna', n: [1, 2], w: 10 },
    { tipo: 'pignaInTesta', vita: 4, w: 8 },
    { tipo: 'gazza', w: 4 },
  ],
  testi: {
    etichetta: "🌳 Scuoti l'albero",
    giaScosso: ["Questo l'hai già scosso oggi. Ormai ha solo foglie e un'espressione offesa.", "L'albero non ha più niente da darti. Torna domani."],
    niente: ["Scuoti, scuoti... cadono tre foglie e un ragno. Niente.", "Niente. Solo un merlo che ti guarda male.", "L'albero fa «fruuush». Basta.", "Cade solo un po' di resina. Sulle mani. Per sempre."],
    tesoro: ["Qualcosa luccica tra i rami... e ti cade in testa!", "Tonf! Dall'albero cade un fagotto legato con lo spago.", "Chi l'aveva nascosto lassù? Il Bubetto? Tuo nonno? Non importa: è tuo."],
    pignaInTesta: "TOC! Una pigna ti centra in pieno la testa. Vita −{vita}.",
    gazza: "Dal nido salta fuori una gazza furiosa: hai scosso casa sua!",
    trovato: 'Dall\'albero: {cose}',
  },
};
