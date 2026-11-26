// =====================================================================
//  DIARIO, TROFEI E COLLEZIONABILI — logica in src/diario.js
//  Solo dati: dove punta la freccia per ogni missione, le collezioni
//  nascoste sulla mappa e gli obiettivi (trofei) con i loro premi.
// =====================================================================

// Luoghi della mappa grande verso cui punta la freccia (coordinate di src/map.js).
export const LUOGHI = {
  gigante:  { x: 60.6, z: 67.4, nome: 'il Gigante' },
  casa:     { x: 65.5, z: 67.0, nome: 'casa' },
  orto:     { x: 65.5, z: 75.0, nome: 'l\'orto' },
  campo:    { x: 74.0, z: 17.0, nome: 'il campo di mais' },
  canale:   { x: 74.0, z: 9.0,  nome: 'il canale (nutrie)' },
  tettoia:  { x: 90.5, z: 67.5, nome: 'la tettoia degli attrezzi' },
  pollaio:  { x: 79.5, z: 78.5, nome: 'il pollaio' },
  cassa:    { x: 70.4, z: 67.1, nome: 'la cassa' },
  officina: { x: 83.5, z: 66.6, nome: 'il deposito' },
  zeno:     { x: 56,   z: 51.0, nome: 'l\'officina di Zeno' },
  maiali:   { x: 134,  z: 68.6, nome: 'i capannoni dei maiali' },
  bar:      { x: 13.5, z: 50.6, nome: 'il bar' },
  bubetto:  { x: 45,   z: 50.0, nome: 'il magazzino del Bubetto' },
  patata:   { x: 101,  z: 40.5, nome: 'la cascina del Potato' },
  postino:  { x: 36.5, z: 40.5, nome: 'la cascina del Postman' },
  frank:    { x: 144.5, z: 40.0, nome: 'il ranch di Mister Frank' },
};

// Missione del Gigante: statistica del giorno -> luogo (vedi stat in src/data/missioni.js).
// trattore: true = prima serve un trattore (se Garonio va a piedi la freccia porta alla tettoia).
export const DOVE_MISSIONE = {
  seminaCampo: { luogo: 'campo', trattore: true },
  trebbiate: { luogo: 'campo', trattore: true },
  raccoltiMais: { luogo: 'campo', trattore: true },
  seminaGrano: { luogo: 'campo', trattore: true },
  irrigate: { luogo: 'campo', trattore: true },
  zappate: { luogo: 'orto' }, seminaOrto: { luogo: 'orto' }, annaffiate: { luogo: 'orto' }, raccolti: { luogo: 'orto' },
  uova: { luogo: 'pollaio' }, galline: { luogo: 'pollaio' },
  nutrie: { luogo: 'canale' },
  venduto: { luogo: 'cassa' },
  maialiAccuditi: { luogo: 'maiali' }, maialiVenduti: { luogo: 'maiali' },
  manutenzione: { luogo: 'officina' },
};

// Dove si trova la roba da consegnare nelle missioni secondarie (se Garonio non ce l'ha ancora).
export const DOVE_OGGETTO = { uova: 'pollaio', pomodoro: 'orto', mais: 'campo', patate: 'patata' };
// Missioni a evento: dove succede la cosa.
export const DOVE_EVENTO = { nemicoSconfitto: 'canale', raccolto: 'orto', venduto: 'cassa', azione: 'orto' };

// ---------- Collezionabili ----------
// Tre collezioni da 8 pezzi, nascoste in giro. Si vedono solo da vicino (un luccichio per terra).
// Completare una collezione regala un portafortuna (slot portafortuna, vedi VESTITI in src/data/armi.js).
export const COLLEZIONI = {
  tappi: {
    nome: 'Tappi di birra', icona: '🍺', colore: '#e0b030',
    desc: 'Tappi a corona caduti in paese. Ogni bar ne perde almeno tre a sera.',
    premio: { id: 'apribottiglie', nome: 'Apribottiglie d\'oro', slot: 'portafortuna', bonus: { stress: 0.1, atk: 1 }, desc: 'stress −10%, attacco +1' },
    pezzi: [
      { id: 'tappo1', x: 8.5,  z: 57.5, nome: 'Tappo della Peroncina', testo: 'Ammaccato col dente. Una tradizione locale.' },
      { id: 'tappo2', x: 34.5, z: 51.0, nome: 'Tappo verde', testo: 'Di una birra che non fanno più dal 1998.' },
      { id: 'tappo3', x: 23.6, z: 64.8, nome: 'Tappo arrugginito', testo: 'È qui da quando c\'era la lira.' },
      { id: 'tappo4', x: 42.5, z: 67.5, nome: 'Tappo del Welcome', testo: 'Profuma di spumante e di brutte decisioni.' },
      { id: 'tappo5', x: 3.5,  z: 78.5, nome: 'Tappo a stella', testo: 'Qualcuno l\'ha usato come fiche a poker.' },
      { id: 'tappo6', x: 50.6, z: 47.5, nome: 'Tappo del Bubetto', testo: 'Il Bubetto giura che non è suo. È suo.' },
      { id: 'tappo7', x: 42.5, z: 37.0, nome: 'Tappo della gazzosa', testo: 'Il Postman beve gazzosa. Dice.' },
      { id: 'tappo8', x: 73.5, z: 59.5, nome: 'Tappo d\'oro', testo: 'Sotto c\'è scritto «HAI VINTO». Non dice cosa.' },
    ],
  },
  santini: {
    nome: 'Santini', icona: '🙏', colore: '#a0c8f0',
    desc: 'Santini persi nei fossi e sui bordi dei campi. La nonna li cercava tutti.',
    premio: { id: 'rosario', nome: 'Rosario della nonna', slot: 'portafortuna', bonus: { santino: 1, def: 3 }, desc: 'difesa +3, a Vita 0 si rialza una volta al giorno' },
    pezzi: [
      { id: 'santo1', x: 2.5,   z: 20.0, nome: 'San Isidoro', testo: 'Protettore dei contadini. Ti guarda male.' },
      { id: 'santo2', x: 20.5,  z: 30.5, nome: 'Sant\'Antonio Abate', testo: 'Protettore degli animali. Le nutrie non contano.' },
      { id: 'santo3', x: 50.5,  z: 12.0, nome: 'San Bassiano', testo: 'Patrono di Littlesound. Lo conoscono anche le zanzare.' },
      { id: 'santo4', x: 78.5,  z: 33.0, nome: 'Santa Rita', testo: 'Santa delle cause impossibili. Tipo te.' },
      { id: 'santo5', x: 88.5,  z: 50.0, nome: 'San Cristoforo', testo: 'Protettore degli automobilisti. Mettilo nella Punto.' },
      { id: 'santo6', x: 116.5, z: 40.0, nome: 'Santa Lucia', testo: 'Protettrice della vista. Utile per trovare gli altri.' },
      { id: 'santo7', x: 131.5, z: 45.0, nome: 'San Martino', testo: 'Quello del mantello. Faceva freddo anche a lui.' },
      { id: 'santo8', x: 156.5, z: 20.0, nome: 'San Giorgio', testo: 'Ha ucciso un drago. Tu fatichi con una nutria.' },
    ],
  },
  figurine: {
    nome: 'Figurine', icona: '⚽', colore: '#e06050',
    desc: 'Figurine dell\'album del 1990 volate via dalla bici del Walter.',
    premio: { id: 'figurinaRara', nome: 'Figurina introvabile', slot: 'portafortuna', bonus: { velocita: 0.1, critico: 0.05 }, desc: 'passo +10%, critico +5%' },
    pezzi: [
      { id: 'figu1', x: 25.0,  z: 83.0,  nome: 'Il portiere coi baffi', testo: 'Parava tutto, tranne le patatine.' },
      { id: 'figu2', x: 12.5,  z: 100.0, nome: 'Il libero', testo: 'Libero di fare quello che voleva. Infatti.' },
      { id: 'figu3', x: 50.5,  z: 95.0,  nome: 'Lo stopper', testo: 'Ha la faccia di Mister Mountain da giovane.' },
      { id: 'figu4', x: 75.5,  z: 104.5, nome: 'Il mediano', testo: 'Correva per tutti. Il contrario di te.' },
      { id: 'figu5', x: 100.5, z: 90.0,  nome: 'Il fantasista', testo: 'Ha i capelli più belli del paese. Del 1990.' },
      { id: 'figu6', x: 125.5, z: 100.0, nome: 'Il centravanti', testo: 'Lo chiamavano «il trattore». Non per la velocità.' },
      { id: 'figu7', x: 150.5, z: 88.0,  nome: 'L\'allenatore', testo: 'Con la sigaretta in panchina. Altri tempi.' },
      { id: 'figu8', x: 156.5, z: 58.0,  nome: 'Lo scudetto', testo: 'Quello lucido. Ne valeva tre normali.' },
    ],
  },
};

// Il Consulente, per 3€, dice dov'è il pezzo più vicino non ancora trovato (segnato sulla minimappa).
export const DRITTA_COLLEZIONI = {
  prezzo: 3,
  label: '🔎 «Hai visto tappi, santini o figurine?» (3€)',
  testi: [
    "Ne ho visto uno {dove}. Te l'ho segnato sulla mappa. No, la mappa non me l'hai data tu: ce l'ho io. Da sempre.",
    "Fonti certe: {dove}. Le mie fonti sono certe al 60%. Che per il paese è tantissimo.",
    "Prova {dove}. Se non c'è, l'ha preso il Walter. Se c'è, mi offri un altro caffè.",
  ],
  finiti: "Li hai trovati tutti. Professionista. Quasi quanto me.",
};

// ---------- Trofei (obiettivi) ----------
// conta: il contatore da guardare (src/diario.js li aggiorna dagli eventi) e soglia: quanto serve.
// premio: { soldi, xp }. segreto: true = finché non lo prendi si vede solo «???».
export const TROFEI = [
  { id: 'dormito10', nome: 'Scansafatiche di bronzo', icona: '🥉', desc: 'Dormi 10 notti.', conta: 'dormito', soglia: 10, premio: { soldi: 10, xp: 10 } },
  { id: 'dormito25', nome: 'Scansafatiche d\'argento', icona: '🥈', desc: 'Dormi 25 notti.', conta: 'dormito', soglia: 25, premio: { soldi: 25, xp: 25 } },
  { id: 'dormito50', nome: 'Scansafatiche d\'oro', icona: '🥇', desc: 'Dormi 50 notti. Il sogno di una vita (letteralmente).', conta: 'dormito', soglia: 50, premio: { soldi: 60, xp: 60 } },
  { id: 'pisolini', nome: 'Pisolino olimpico', icona: '💤', desc: 'Appisolati in giro 30 volte.', conta: 'pisolini', soglia: 30, premio: { soldi: 15, xp: 15 } },
  { id: 'beccato', nome: 'Colto sul fatto', icona: '👹', desc: 'Fatti beccare dal Gigante mentre dormi 5 volte.', conta: 'beccato', soglia: 5, premio: { xp: 10 } },
  { id: 'nutrie10', nome: 'Spauracchio delle nutrie', icona: '🦫', desc: 'Sconfiggi 10 nutrie.', conta: 'nutrie', soglia: 10, premio: { soldi: 15, xp: 15 } },
  { id: 'nutrie50', nome: 'Terrore del canale', icona: '🏆', desc: 'Sconfiggi 50 nutrie.', conta: 'nutrie', soglia: 50, premio: { soldi: 50, xp: 50 } },
  { id: 'nemici100', nome: 'Rissaiolo di provincia', icona: '👊', desc: 'Batti 100 nemici di qualsiasi tipo.', conta: 'nemici', soglia: 100, premio: { soldi: 60, xp: 60 } },
  { id: 'uova50', nome: 'Ovaiolo', icona: '🥚', desc: 'Raccogli 50 uova.', conta: 'uova', soglia: 50, premio: { soldi: 15, xp: 15 } },
  { id: 'raccolti50', nome: 'Pollice verde (più o meno)', icona: '🍅', desc: 'Raccogli 50 piante.', conta: 'raccolti', soglia: 50, premio: { soldi: 20, xp: 20 } },
  { id: 'missioni10', nome: 'Figlio quasi modello', icona: '📋', desc: 'Completa 10 missioni del Gigante.', conta: 'missioni', soglia: 10, premio: { soldi: 30, xp: 30 } },
  { id: 'fallite5', nome: 'Cliente fisso di Mister Mountain', icona: '🏔️', desc: 'Fallisci 5 missioni del Gigante.', conta: 'fallite', soglia: 5, premio: { xp: 5 }, segreto: true },
  { id: 'secondarie5', nome: 'Il ragazzo dei lavoretti', icona: '🧰', desc: 'Completa 5 lavoretti per la gente del paese.', conta: 'secondarie', soglia: 5, premio: { soldi: 25, xp: 25 } },
  { id: 'venduto500', nome: 'Imprenditore agricolo', icona: '💶', desc: 'Vendi alla cassa per 500€ in totale.', conta: 'venduto', soglia: 500, premio: { xp: 30 } },
  { id: 'livello10', nome: 'Garzone navigato', icona: '⭐', desc: 'Arriva al livello 10.', conta: 'livello', soglia: 10, premio: { soldi: 40 } },
  { id: 'giorni14', nome: 'Una stagione intera', icona: '📅', desc: 'Sopravvivi 14 giorni.', conta: 'giorno', soglia: 14, premio: { soldi: 30, xp: 30 } },
  { id: 'multe5', nome: 'Amico della Vigilessa', icona: '👮‍♀️', desc: 'Prendi 5 multe.', conta: 'multe', soglia: 5, premio: { xp: 5 }, segreto: true },
  { id: 'zeno5', nome: 'Cliente affezionato di Zeno', icona: '🔧', desc: 'Fatti riparare un mezzo 5 volte.', conta: 'riparazioni', soglia: 5, premio: { xp: 15 } },
  { id: 'clacson50', nome: 'Clacsonatore seriale', icona: '📯', desc: 'Suona il clacson 50 volte.', conta: 'clacson', soglia: 50, premio: { xp: 10 }, segreto: true },
  { id: 'truffe3', nome: 'Furbetto del quartierino', icona: '🤫', desc: 'Porta a termine 3 colpi truffaldini.', conta: 'truffe', soglia: 3, premio: { soldi: 30, xp: 30 } },
  { id: 'bestia1', nome: 'Ammazzare un re', icona: '👑', desc: 'Sconfiggi una bestia leggendaria.', conta: 'bestie', soglia: 1, premio: { soldi: 50, xp: 50 } },
  { id: 'tranvione', nome: 'Il tranvione', icona: '💸', desc: 'Torna dal Night Welcome senza un euro.', conta: 'tranvione', soglia: 1, premio: { xp: 10 }, segreto: true },
  { id: 'cabina', nome: 'Scossa leggendaria', icona: '⚡', desc: 'Trova il bottino leggendario nella cabina della corrente.', conta: 'cabina', soglia: 1, premio: { xp: 30 }, segreto: true },
  { id: 'gatti10', nome: 'Gattaro', icona: '🐈', desc: 'Accarezza 10 gatti.', conta: 'gatti', soglia: 10, premio: { xp: 10 } },
  { id: 'tappi', nome: 'Collezionista di tappi', icona: '🍺', desc: 'Trova tutti i tappi di birra.', conta: 'coll_tappi', soglia: 8, premio: { xp: 30 } },
  { id: 'santini', nome: 'La nonna è fiera', icona: '🙏', desc: 'Trova tutti i santini.', conta: 'coll_santini', soglia: 8, premio: { xp: 30 } },
  { id: 'figurine', nome: 'Celo, celo, manca', icona: '⚽', desc: 'Completa l\'album delle figurine.', conta: 'coll_figurine', soglia: 8, premio: { xp: 30 } },
  { id: 'tuttiTrofei', nome: 'Garonio d\'oro', icona: '🌟', desc: 'Prendi tutti gli altri trofei.', conta: 'trofei', soglia: 27, premio: { soldi: 200, xp: 100 } },
];

export const TESTI_DIARIO = {
  trofeo: '🏆 Trofeo: {nome}!',
  pezzo: '{icona} {nome} ({n}/{tot})',
  collezione: '{icona} Collezione completa: {nome}! In regalo: {premio}.',
  arrivato: '📍 Sei arrivato: {nome}.',
  nessuno: 'Niente da seguire. Scegli un lavoro col 📍 nel menu (J).',
};
