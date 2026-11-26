// =====================================================================
//  PARCO OGLIO (src/parco.js, GDD capitolo 26)
//  Il bosco e il fiume in fondo alla mappa. Di notte ci girano i mostri, la sera le coppiette;
//  le guardie del parco (capo: Boss MM) pattugliano i sentieri. Accanto c'è la cascina del
//  Vecchio Camper, che paga bene chi fa danni nel parco. Se le guardie ti beccano: livello 30.
//  Sprite: tutti dal foglio personaggi (src/data/sprite_personaggi.js).
// =====================================================================

// ---------- Mostri della notte (gruppi sulla mappa, zona 'parco', dalle 20 a mezzanotte) ----------
// lv = livelli possibili (escono a livelli molto diversi: anche più forti di Garonio), min = livello di Garonio
// da cui possono comparire. k = moltiplicatori su Vita e attacco rispetto a un nemico medio di quel livello.
export const MOSTRI = {
  fantasma:     { nome: 'Fantasma del mugnaio', sprite: 'fantasma', lv: [3, 16], min: 2, k: [0.8, 0.9], spd: 14, vola: true,
    fuga: 'passa attraverso un albero e sparisce.',
    moves: [{ name: 'BUH!', pow: 0.3, stress: 9, w: 2, line: 'Un «BUH!» gelido. Garonio fa un salto di un metro.' }, { name: 'Lenzuolata', pow: 1.0, stress: 3, w: 3 }] },
  scheletro:    { nome: 'Scheletro del bracconiere', sprite: 'scheletro', lv: [5, 20], min: 3, k: [0.85, 1.05], spd: 10,
    fuga: 'si smonta e rotola via, un osso alla volta.',
    moves: [{ name: 'Ossata', pow: 1.1, stress: 2, w: 3 }, { name: 'Risata che scricchiola', pow: 0, stress: 8, w: 1 }] },
  alieno:       { nome: 'Alieno dei cerchi nel mais', sprite: 'alieno', lv: [6, 24], min: 4, k: [0.9, 1.0], spd: 12,
    fuga: 'sale su un raggio di luce. «Ci rivedremo, terrestre agricolo.»',
    moves: [{ name: 'Raggio sonda', pow: 1.2, stress: 3, w: 3 }, { name: 'Telepatia', pow: 0.4, stress: 10, w: 1, stordisce: true, line: 'Garonio sente nella testa la voce del Gigante. È terribile.' }] },
  pagliaccio:   { nome: 'Pagliaccio della sagra', sprite: 'pagliaccio', lv: [8, 24], min: 6, k: [1.0, 1.0], spd: 9,
    fuga: 'se ne va su un monociclo, suonando una trombetta.',
    moves: [{ name: 'Torta in faccia', pow: 0.8, stress: 6, w: 2, line: 'Panna e fragole. Garonio non vede più niente.' }, { name: 'Clacson a pera', pow: 1.1, stress: 3, w: 3 }] },
  mummia:       { nome: 'Mummia del Conte', sprite: 'mummia', lv: [10, 26], min: 8, k: [1.25, 0.9], spd: 6,
    fuga: 'si srotola e scappa tirando le bende.',
    moves: [{ name: 'Bendaggio stretto', pow: 1.0, stress: 3, w: 3, stordisce: true }, { name: 'Polvere dei secoli', pow: 0.5, stress: 7, w: 1 }] },
  strega:       { nome: 'Strega della Bassa', sprite: 'strega', lv: [12, 28], min: 9, k: [0.85, 1.15], spd: 12,
    fuga: 'parte sulla scopa e quasi si schianta su un pioppo.',
    moves: [{ name: 'Scopata in testa', pow: 1.2, stress: 3, w: 3 }, { name: 'Maledizione del raccolto', pow: 0.6, stress: 9, w: 1, veleno: [6, 3], line: 'Garonio sente che le sue patate stanno marcendo. Tutte. (Vita −6 per 3 turni)' }] },
  mago:         { nome: 'Mago Brontolone', sprite: 'mago', lv: [14, 30], min: 11, k: [0.9, 1.2], spd: 9,
    fuga: 'sparisce in una nuvola di fumo viola e tosse.',
    moves: [{ name: 'Palla di fuoco fatua', pow: 1.3, stress: 3, w: 3 }, { name: 'Incantesimo del sonno', pow: 0.4, stress: 5, w: 1, stordisce: true, line: 'Garonio sbadiglia. È una magia o è lunedì?' }] },
  vampiro:      { nome: 'Vampiro di Saint James Borough', sprite: 'vampiro', lv: [16, 32], min: 13, k: [1.0, 1.2], spd: 13,
    fuga: 'diventa un pipistrello e sbatte contro un ramo.',
    moves: [{ name: 'Morso al collo', pow: 1.3, stress: 4, w: 3, cura: 0.3, line: 'Il Vampiro succhia e sorride: «Sangue di contadino, annata 2026. Corposo.»' }, { name: 'Sguardo ipnotico', pow: 0, stress: 11, w: 1 }] },
  lupo_mannaro: { nome: 'Lupo mannaro dell\'Oglio', sprite: 'lupo_mannaro', lv: [18, 34], min: 15, k: [1.3, 1.15], spd: 12,
    fuga: 'ulula alla luna e corre via a quattro zampe.',
    moves: [{ name: 'Artigliata', pow: 1.3, stress: 3, w: 3 }, { name: 'Ululato', pow: 0, stress: 10, w: 1 }] },
  diavolo:      { nome: 'Diavoletto del Forcone', sprite: 'diavolo', lv: [22, 36], min: 18, k: [1.1, 1.3], spd: 11,
    fuga: 'sprofonda in una buca fumante. Puzza di zolfo e di bruciato.',
    moves: [{ name: 'Forconata infernale', pow: 1.4, stress: 3, w: 3 }, { name: 'Fiammella', pow: 0.9, stress: 4, w: 1, veleno: [9, 3], line: 'Il diavoletto gli dà fuoco ai pantaloni! (Vita −9 per 3 turni)' }] },
};
// bottino dei mostri (oltre al bottino normale)
export const BOTTINO_MOSTRI = {
  fantasma: [{ id: 'lenzuolo', p: 0.5 }], scheletro: [{ id: 'ossoFortunato', p: 0.4 }], alieno: [{ id: 'cristalloAlieno', p: 0.35 }],
  pagliaccio: [{ id: 'nasoRosso', p: 0.4 }], mummia: [{ id: 'bende', p: 0.5 }], strega: [{ id: 'pozione', p: 0.4 }],
  mago: [{ id: 'pozione', p: 0.5 }, { id: 'cristalloAlieno', p: 0.1 }], vampiro: [{ id: 'mantelloVampiro', p: 0.12, vestito: true }, { id: 'pepita', p: 0.3 }],
  lupo_mannaro: [{ id: 'pelleLupo', p: 0.8 }, { id: 'pepita', p: 0.3 }], diavolo: [{ id: 'forconcinoInfernale', p: 0.1, arma: true }, { id: 'pepita', p: 0.5 }],
};

// ---------- Coppiette nel bosco: la sera, dietro i cespugli. Spiarle è da maleducati ----------
// a, b = sprite del foglio personaggi; nomi = come si chiamano in paese
export const COPPIE = [
  { a: 'uomo_zaino', b: 'sciura', nomi: ['il Postman', 'la Sciura Ines'], battuta: "Il Postman le recita le cartoline degli altri come fossero poesie. Lei sospira." },
  { a: 'geometra', b: 'cameriera_vassoio', nomi: ['il Geometra Ballarin', 'Lola del Welcome'], battuta: "Il Geometra le misura la distanza dal cuore col metro laser. «Tre metri e venti, amore.»" },
  { a: 'canottiera', b: 'bionda_rosa', nomi: ['Bruno «il Toro»', 'la Giusy'], battuta: "Bruno le regala un mazzo di fiori strappati dall'aiuola del municipio. Con la terra attaccata." },
  { a: 'commendatore', b: 'bionda_bianco', nomi: ['il Commendatore', 'Sabrina'], battuta: "Il Commendatore le promette una villa a Portofino. Ha un monolocale a Newbarley." },
  { a: 'felpa_cappellino', b: 'mora_occhiali', nomi: ['il cugino Ermes', 'Ilenia'], battuta: "Ermes le dedica una canzone di Gigi D'Agostino col telefono. Lei balla. Lui piange." },
  { a: 'ubriaco_birra', b: 'nonna', nomi: ['Tarcisio', 'la Pina'], battuta: "Tarcisio e la Pina, settant'anni in due... no, in due ne fanno centocinquanta. Si sbaciucchiano come ragazzini." },
  { a: 'barbuto', b: 'mora_rosso', nomi: ['Rocco il camionista', 'Federica'], battuta: "Rocco le fa sentire il clacson del camion registrato sul telefono. È il loro modo di dirsi «ti amo»." },
];
export const COPPIETTE = {
  ore: [19, 24], probabilita: 0.55,          // ogni sera, una coppietta da qualche parte nel bosco
  scoperti: 0.35, scopertiVicino: 0.65,       // probabilità di farsi beccare spiando (da lontano / da vicino)
  arrivo: "💕 Dal bosco del Parco Oglio arrivano risatine e sospiri. C'è una coppietta, da qualche parte.",
  etichetta: '👀 Spia la coppietta',
  spia: ["Garonio si acquatta dietro un cespuglio. Pianissimo.", "Garonio sbircia tra le foglie, trattenendo il respiro (e una risata)."],
  visti: "Sono {a} e {b}! Si sbaciucchiano come in un film degli anni Ottanta.",
  ok: "Garonio si allontana in punta di piedi. Domani in paese ne avrà da raccontare. (+1 Foto sfocata: al bar qualcuno la compra...)",
  beccato: "CRACK! Un ramo secco sotto lo scarpone. «MA CHE GUARDI?! GUARDONE!» Adesso sono furiosi. Tutti e due.",
  troppoVicino: "Garonio passa troppo vicino. «EHI! Ci stavi spiando?!» Non c'è modo di spiegarsi.",
  moves: [
    { name: 'Ciabattata', pow: 1.1, stress: 3, w: 3 },
    { name: 'Borsettata', pow: 1.0, stress: 3, w: 2 },
    { name: '«Lo dico a tua madre!»', pow: 0, stress: 12, w: 1, line: 'Il colpo più basso di tutti.' },
  ],
  vinto: "I due piccioncini scappano, ognuno da una parte, fingendo di non conoscersi.",
};

// ---------- Guardie del parco ----------
export const GUARDIE = {
  livello: 30,
  vista: 7, vistaNotte: 4.5,                // a che distanza vedono un danno
  giro: [[76, 91], [96, 91], [118, 91], [118, 98], [118, 106], [118, 91], [140, 91], [118, 91], [96, 91], [62, 91], [62, 106], [62, 91]],
  numero: 2,
  nome: 'Guardia del parco',
  moves: [
    { name: 'Manganellata regolamentare', pow: 1.2, stress: 3, w: 3 },
    { name: 'Verbale', pow: 0, stress: 12, w: 1, line: '«Articolo 7, comma 3: danneggiamento di bene naturalistico.» Garonio si sente piccolissimo.' },
    { name: 'Calcio d\'ordinanza', pow: 1.4, stress: 2, w: 2 },
  ],
  fuga: 'torna a pattugliare, prendendo appunti su un blocchetto.',
  beccato: "🚨 «ALT! GUARDIE DEL PARCO!» Una guardia ti ha visto. Fischietto, torcia in faccia, e adesso tocca combattere.",
  sconfitta: "Le guardie ti scortano fuori dal parco e ti fanno una multa salatissima. Boss MM, dal casotto, ride.",
  multa: 80,
  vinto: "La guardia si rialza, si sistema il cappello e se ne va zoppicando: «Questa la mettiamo a verbale...»",
};

// ---------- Boss MM, il capo delle guardie ----------
export const BOSS_MM = {
  nome: 'Boss MM', lv: 32,
  posto: { x: 111.5, z: 90.4 },             // davanti al casotto delle guardie
  ore: [7, 22],
};

// ---------- Il Vecchio Camper e i suoi «lavoretti» nel parco ----------
// tipo di danno → dove si fa e come si chiama
export const DANNI = {
  albero:   { etichetta: '🪓 Taglia l\'albero del parco', tempo: 2.0, testo: 'TOC, TOC, TOC... l\'albero del parco viene giù con un gran fruscio.' },
  cartello: { etichetta: '🔧 Svita il cartello del parco', tempo: 1.5, testo: 'Garonio svita i bulloni e si mette il cartello sotto il braccio. «VIETATO» cosa, adesso?',
    punti: [[67, 92.8], [96, 89.4], [130, 92.8], [64.2, 106], [120.2, 106.5], [140, 89.4]] },
  nido:     { etichetta: '🥚 Prendi le uova dell\'anatra protetta', tempo: 1.2, testo: 'L\'anatra protetta ti guarda male. Tu prendi le uova e fischietti.',
    punti: [[50, 98.2], [84, 94.2], [98, 99.2], [125, 99.2], [148, 95.2], [70, 103.2]] },
  pesca:    { etichetta: '🎣 Pesca di frodo nell\'Oglio', tempo: 2.5, testo: 'Lenza, verme, pazienza... ABBOCCA! Un pesce dell\'Oglio, protetto e saporito.',
    punti: [[56, 98.3], [90, 94.3], [79, 98.8], [110, 99.3], [128, 103.8], [145, 95.3]] },
  carriola: { etichetta: '🛒 Ruba la carriola delle guardie', tempo: 1.5, testo: 'Garonio afferra la carriola delle guardie e scappa cigolando nel buio.',
    punti: [[116.4, 88.2]] },
  cappello: { etichetta: '🎩 Ruba il cappello di Boss MM', tempo: 1, testo: '' },
};
// premio in oggetti per ogni danno fatto (il Camper paga a missione finita)
export const OGGETTI_DANNO = { albero: { legna: 2 }, cartello: { cartello: 1 }, nido: { uovaAnatra: 2 }, pesca: { pesceOglio: 1 }, carriola: {} };

export const CAMPER = {
  nome: 'Il Vecchio Camper',
  missioni: {
    camper_alberi: {
      titolo: 'Legna gratis', tipo: 'albero', n: 3, livello: 4,
      offerta: "Ragazzo. Quelli del parco mi hanno vietato di fare legna nel MIO bosco. Mio dal 1961. Taglia tre alberi del parco e portami la legna. Occhio alle guardie: picchiano come muli.",
      premio: { soldi: 180, xp: 140, vestiti: ['berrettoCorvi'] },
      grazie: "Bella legna! Quest'inverno mi scaldo alla faccia loro. Tieni, e un berretto per quando fai la posta.",
    },
    camper_cartelli: {
      titolo: 'Vietato vietare', tipo: 'cartello', n: 3, livello: 7, dopo: 'camper_alberi',
      offerta: "Hanno messo dei cartelli: «VIETATO PESCARE», «VIETATO RACCOGLIERE», «VIETATO RIDERE». L'ultimo me lo sono immaginato. Portamene tre. Li uso per il pollaio.",
      premio: { soldi: 240, xp: 200, oggetti: { pepita: 1 } },
      grazie: "Perfetti! Questo va sulla porta del pollaio: «VIETATO L'INGRESSO». Le galline sanno leggere, sai?",
    },
    camper_uova: {
      titolo: 'La frittata protetta', tipo: 'nido', n: 3, livello: 10, dopo: 'camper_cartelli',
      offerta: "Le anatre del parco sono protette. Le loro uova no: c'è un vuoto normativo. Credo. Portami tre nidiate e facciamo la frittata più illegale della Bassa.",
      premio: { soldi: 300, xp: 260, vestiti: ['cinturaSpago'] },
      grazie: "Che frittata verrà fuori! Se arrivano le guardie, io non ti conosco.",
    },
    camper_pesca: {
      titolo: 'Pesca di frodo', tipo: 'pesca', n: 4, livello: 13, dopo: 'camper_uova',
      offerta: "Una volta l'Oglio era pieno di pesci e nessuno ti diceva niente. Adesso serve il permesso. Io il permesso ce l'ho: è questa canna. Pescami quattro pesci.",
      premio: { soldi: 380, xp: 330, oggetti: { pepita: 1, elisir: 1 } },
      grazie: "Pesci dell'Oglio! Li cucino in carpione. Tu prendi questi, che sono più facili da digerire.",
    },
    camper_carriola: {
      titolo: 'La carriola delle guardie', tipo: 'carriola', n: 1, livello: 17, dopo: 'camper_pesca',
      offerta: "Le guardie hanno una carriola nuova di zecca, con la ruota che non cigola. Io ho una carriola del '58 che urla. Hai capito cosa devi fare.",
      premio: { soldi: 500, xp: 450, armi: ['forcaVacche'] },
      grazie: "Non cigola! È la cosa più bella che mi sia successa dal 1974. Tieni, una forca che non mi serve più.",
    },
    camper_cappello: {
      titolo: 'Il cappello di Boss MM', tipo: 'cappello', n: 1, livello: 24, dopo: 'camper_carriola',
      offerta: "L'ultima. Boss MM, il capo delle guardie. Quarant'anni fa mi ha soffiato la morosa alla sagra. Voglio il suo cappello. Lo trovi al casotto, la sera. Lui però è un osso duro: livello trentadue, dicono.",
      premio: { soldi: 900, xp: 800, vestiti: ['cappelloBossMM'], oggetti: { pepita: 3 } },
      grazie: "IL CAPPELLO! Sa ancora di brillantina. Tienilo tu, io lo guardo e basta. Ragazzo, sei il nipote che non ho mai avuto.",
    },
  },
};

export const PARCO_TESTI = {
  dentro: '🌲 Parco Oglio: bosco, fiume e guardie. Di notte, mostri.',
  danno: 'Garonio si guarda intorno...',
  guardieLontane: 'Nessuno ti ha visto. ',
  cappelloSera: "Boss MM tiene il cappello al casotto: si può rubare solo la sera, dalle 19 alle 23, quando lo appende al chiodo.",
  bossIntro: "Boss MM esce dal casotto con il fischietto in bocca. «Il mio cappello? IL MIO CAPPELLO?!» Da solo: le guardie, a quest'ora, dormono.",
};
