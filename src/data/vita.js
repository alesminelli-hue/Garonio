// =====================================================================
//  IL MONDO VIVO — paesani, traffico, animali, imprevisti e Night Paradiso
//  Solo dati e testi: si cambiano senza toccare il codice.
//  Logica in src/vita.js (paesani, traffico, animali, luci della sera),
//  src/imprevisti.js (buche, pozzanghere, cantieri, cane randagio, impiccioni, zanzare)
//  e src/paradiso.js (il locale del catalogo).
// =====================================================================

// ---------- Posti del paese dove vanno i paesani (coordinate della mappa grande) ----------
export const METE = {
  alimentari: [4.5, 50.7], bar: [13.5, 50.8], piazza: [20, 51], fontana: [8.8, 51.7], municipio: [27.1, 50.4],
  casaRosa: [33, 50.7], strisce: [20.5, 57.2], tabacchi: [16, 66.8], casaAzzurra: [6, 66.8], fermata: [38.5, 57.1],
  paradiso: [49, 66.9], vialetto: [74.8, 58], aia: [72, 69.5], capannoni: [124, 70], ponte: [119, 30.5], laghetto: [35, 77],
};

// ---------- Paesani: compaiono di giorno, la sera tornano a casa ----------
// ore: [da, a] quando sono in giro · casa: dove spariscono la sera · mete: dove vanno a zonzo
// impiccione: 0..1 quanto attaccano bottone a Garonio (stress!) · umarell: va a guardare i cantieri
export const PAESANI = [
  {
    id: 'ines', nome: 'La Sciura Ines', ore: [7, 19], casa: 'casaAzzurra', mete: ['alimentari', 'piazza', 'municipio', 'tabacchi', 'fontana'], impiccione: 0.9,
    aspetto: { sprite: 'sciura', w: 15, h: 21, skin: '#f0c8a8', hair: '#d8d8e0', hairStyle: 'long', shirt: '#7a4a8a', pants: '#3a3040', boots: '#2a1a1a', eyes: 'normal' },
  },
  {
    id: 'bepi', nome: 'Il Bepi', ore: [8, 12], ore2: [15, 19], casa: 'tabacchi', mete: ['strisce', 'fermata', 'piazza', 'bar', 'vialetto'], impiccione: 0.5, umarell: true,
    aspetto: { sprite: 'anziano_coppola', w: 16, h: 23, skin: '#e8b48a', hair: '#bbbbbb', hairStyle: 'bald', hat: '#6a5a4a', shirt: '#8a8a70', pants: '#4a4a3a', boots: '#2a2018', mustache: '#cccccc', belly: true, eyes: 'normal' },
  },
  {
    id: 'gino', nome: 'Il Gino del tabacchi', ore: [7, 20], casa: 'tabacchi', mete: ['tabacchi', 'bar', 'piazza', 'strisce'], impiccione: 0.4, umarell: true,
    aspetto: { sprite: 'uomo_gilet', w: 16, h: 24, skin: '#e0a986', hair: '#3a2a1a', hairStyle: 'flat', shirt: '#e8e0c8', pants: '#2a2a3a', boots: '#1a1a1a', mustache: '#3a2a1a', eyes: 'normal' },
  },
  {
    id: 'giusy', nome: 'La Giusy parrucchiera', ore: [9, 19], casa: 'casaRosa', mete: ['casaRosa', 'alimentari', 'piazza', 'bar', 'fontana'], impiccione: 0.7,
    aspetto: { sprite: 'bionda_rosa', w: 15, h: 23, skin: '#f0c0a0', hair: '#e0a020', hairStyle: 'long', shirt: '#e05080', pants: '#1a1a2a', boots: '#a02040', eyes: 'normal' },
  },
  {
    id: 'moreno', nome: 'Il Moreno in tuta', ore: [16, 23.5], casa: 'casaRosa', mete: ['bar', 'paradiso', 'piazza', 'fermata'], impiccione: 0.3,
    aspetto: { sprite: 'tuta_felpa', w: 16, h: 24, skin: '#e8b08a', hair: '#1a1a1a', hairStyle: 'flat', shirt: '#2050c0', pants: '#2050c0', boots: '#f0f0f0', eyes: 'normal' },
  },
  {
    id: 'sbrana', nome: 'Il Dottor Sbrana, veterinario', ore: [8, 18], casa: 'municipio', mete: ['capannoni', 'aia', 'vialetto', 'bar'], impiccione: 0.5,
    aspetto: { sprite: 'veterinario', w: 16, h: 24, skin: '#f0c8a8', hair: '#6a6a6a', hairStyle: 'flat', shirt: '#f4f4f4', pants: '#4a5a6a', boots: '#3a2a1a', beard: '#6a6a6a', eyes: 'normal' },
  },
  {
    id: 'ornella', nome: "L'Ornella col barboncino", ore: [7, 10], ore2: [17, 21], casa: 'casaAzzurra', mete: ['laghetto', 'piazza', 'strisce', 'fontana', 'fermata'], impiccione: 0.6, cagnolino: true,
    aspetto: { sprite: 'donna_grembiule', w: 15, h: 22, skin: '#f0c8a8', hair: '#8a3a2a', hairStyle: 'long', shirt: '#40a090', pants: '#3a3a4a', boots: '#2a2a2a', eyes: 'normal' },
  },
  {
    id: 'walter', nome: 'Il Walter pensionato', ore: [8, 12], ore2: [14, 19], casa: 'municipio', mete: ['strisce', 'ponte', 'fermata', 'piazza', 'vialetto'], impiccione: 0.6, umarell: true,
    aspetto: { sprite: 'anziano_bastone', w: 16, h: 22, skin: '#e8b48a', hair: '#e0e0e0', hairStyle: 'grey', hat: '#3a4a3a', shirt: '#a07050', pants: '#5a5040', boots: '#2a2018', eyes: 'normal' },
  },
];

// frasi che i paesani dicono quando Garonio passa vicino (solo fumetto)
export const FUMETTI = ['...', 'Mah!', 'Eh già.', 'Bondì!', 'Ciao bel!', 'Tsk.', 'Piove?', 'Uff.'];

// ---------- Traffico ----------
// per: probabilità relativa · vel: velocità (caselle/s) · corsie: z delle due corsie della provinciale
export const TRAFFICO = {
  corsie: { est: 55, ovest: 53 },     // in Italia si tiene la destra: verso est la corsia sud
  capezzagna: 29,                     // l'Ape passa anche sulla capezzagna
  max: 6,
  // secondi reali tra un'auto e l'altra, per fascia oraria
  ogni: [{ ore: [7, 9.5], s: [3, 6] }, { ore: [17, 19.5], s: [3, 6] }, { ore: [6, 21], s: [7, 14] }, { ore: [0, 24], s: [22, 45] }],
  tipi: {
    auto: { per: 6, vel: 7.2, colori: ['#c83a2e', '#3a5fc8', '#3a8a4a', '#9a9aa4', '#e8c040', '#f0f0f0', '#2a2a30'] },
    ape: { per: 2, vel: 3.6, colori: ['#4a8ac8', '#d84a2a', '#6aa84a'] },
    camion: { per: 1, vel: 5.2, colori: ['#e8e8e8', '#d8a040'] },
  },
  clacson: [
    "«Ohé! Spostati, che la strada non è il tuo letto!»",
    "«Garonio! Sempre in mezzo ai piedi!»",
    "«Pìiiii! Ma vai a lavorare!»",
    "«Ma ti sei addormentato in piedi?»",
  ],
  schizzo: [
    "SPLASH! Un'auto prende in pieno la pozzanghera. Garonio è fradicio.",
    "SPLASH! L'Ape del Bepi gli fa la doccia. Gratis, almeno.",
    "SPLASH! Acqua marrone fino alle mutande. Che giornata.",
  ],
  tamponato: [
    "«Ma sei scemo?! Lo dico a tuo padre!»",
    "«Assicurazione? Io ho il santino di Padre Pio, tu?»",
    "«Ecco il figlio del Gigante. Tale padre, tale disastro!»",
  ],
};

// ---------- Imprevisti sulla mappa ----------
export const IMPREVISTI = {
  buche: {
    nuovePerGiorno: [1, 3], max: 12, raggio: 0.55,
    // danno al mezzo (stato −%) e stress; poi si ripara a pagamento da Zeno
    danno: { vespa: 9, punto: 7, trattore: 4 }, stress: { vespa: 5, punto: 4, trattore: 2 }, foraturaPunto: 0.3,
    testi: {
      vespa: ["SBADABAM! Buca sulla Vespa: Garonio sbatte i denti. Vespa −{danno}%", "Una buca grande come una piscina. La Vespa fa un salto e un rumore che non dovrebbe fare. −{danno}%"],
      punto: ["SBONK! La Punto finisce in una buca. Qualcosa sotto si è staccato. −{danno}%", "Buca! Il cruscotto perde un altro pezzo. −{danno}%"],
      trattore: ["Il trattore prende una buca e Garonio rimbalza sul sedile. −{danno}%"],
      piedi: ["Garonio mette un piede nella buca e si storce la caviglia. Che comune è questo?", "Inciampa in una buca. Nessuno ha visto. Forse."],
      foratura: ' E una gomma a terra!',
    },
  },
  pozze: {
    numero: [8, 14], stress: 2,
    testi: ["Splash! Piede dentro la pozzanghera. Calzino bagnato per tutto il giorno.", "Pozzanghera più profonda del previsto. Garonio la odia personalmente."],
    vespa: ["La Vespa scoda sulla pozzanghera! Garonio si inzacchera tutto."],
  },
  cantiere: {
    probabilita: 0.4, daGiorno: 2, stress: 3, raggio: 3.6,
    // strade dove può comparire (la provinciale no: serve al traffico)
    strade: ['capezzagna', 'via-mulino', 'via-campi', 'via-est', 'via-maiali', 'via-ponte'],
    operai: [
      { nome: 'Operaio Gianni', aspetto: { sprite: 'operaio_casco', w: 16, h: 24, skin: '#d9a27a', hair: '#3a2a1a', hairStyle: 'flat', hat: '#f0d020', shirt: '#f07020', pants: '#3a4a6a', boots: '#2a2a2a', belly: true, eyes: 'sleepy' } },
      { nome: 'Operaio Franco', aspetto: { sprite: 'operaio_gilet', w: 16, h: 24, skin: '#e8b48a', hair: '#1a1a1a', hairStyle: 'flat', hat: '#f0d020', shirt: '#f07020', pants: '#3a4a6a', boots: '#2a2a2a', mustache: '#2a1a1a', eyes: 'normal' } },
    ],
    frasi: [
      "«Lavori in corso, si passa di là.» «Di là dove?» «Di là.»",
      "«Qui finiamo martedì.» «Quale martedì?» «Eh.»",
      "«Il capo è andato a prendere il pezzo. Tre ore fa.»",
      "«Sì sì, stiamo lavorando. Non si vede?» Uno dorme sulla carriola.",
      "«Garonio! Vuoi una mano? Ah no, sei tu che dovresti darcela.»",
    ],
    umarell: ["«Io quel tubo l'avrei messo più a sinistra.»", "«Ai miei tempi lo facevamo in un pomeriggio.»", "«Mah.» (mani dietro la schiena)"],
    fine: 'Gli operai smontano il cantiere e, per sbaglio, tappano anche una buca.',
  },
  cane: {
    daGiorno: 2, probabilitaOra: 0.14, vel: 4.4, morso: { vita: 4, stress: 6 },
    aspetto: { pelo: '#b89060', scuro: '#6a4a2a' },
    arrivo: ["Un cane randagio ti ha puntato. Corri (Shift) o affrontalo!", "Grrr... Un randagio con la faccia da pochi amici."],
    morsoTesti: ["Il randagio ti azzanna i pantaloni! Vita −{vita}, Stress +{stress}", "Morso al polpaccio! Il cane se ne va scodinzolando, soddisfatto."],
    scio: ["«SCIÒ!» Il randagio se ne va, offeso.", "Garonio fa la voce grossa. Il cane fa finta di niente, poi scappa."],
    scioMale: ["«Sciò!» Il cane ti guarda, sbadiglia e resta lì."],
    uovo: ["Gli lanci un uovo. Il cane lo mangia, ti lecca la mano e se ne va contento. Amici per la pelle."],
    inMacchina: ["Il randagio insegue il mezzo abbaiando come un ossesso."],
  },
  impiccioni: {
    pausa: 120,   // minuti di gioco tra un impiccione e l'altro
    raggio: 3,
    attacchi: [
      "Garonio! Ma sei il figlio del Gigante? Come sta tuo padre? E tua madre? E il maiale con la tosse?",
      "Oh, Garonio! Ti ho visto ieri che dormivi nel fosso. Ma stavi male? No perché lo dico in giro, eh.",
      "Ma è vero che il Gigante ti vuole diseredare? Lo dice la Pina. La Pina sa tutto.",
      "Garonio, giusto te! Mio nipote si sposa. Ti racconto tutto dall'inizio: allora, nel '94...",
      "Ma tu quando ti sposi? Alla tua età mio figlio aveva già tre figli e un mutuo.",
      "Hai visto che buche sulla strada? Scrivo al sindaco. Firmi anche tu? Firma qui. E qui. E qui.",
    ],
    ascolta: { etichetta: 'Ascolta con pazienza (−30 min, +XP)', minuti: 30, stress: 4, xp: 4,
      testi: ["...e quindi il cugino del cognato ha venduto la vacca. Fine. Garonio ha perso mezz'ora di vita.", "Dopo venti minuti di racconto, Garonio non sa più come si chiama. Però ha imparato tre pettegolezzi."] },
    taglia: { etichetta: 'Taglia corto (stress +3)', stress: 3,
      testi: ["«Scusi, devo scappare!» «Maleducato! Lo dico a tua madre!»", "Garonio scappa. Alle sue spalle: «Tale e quale al padre!»"] },
    telefono: { etichetta: '📱 Fingi una telefonata', riuscita: 0.5, bonusParlantina: 0.2, stress: 6,
      ok: ["«Pronto? Sì, arrivo subito! Scusi eh!» Garonio si dilegua. Il telefono era spento. Capolavoro."],
      ko: ["«Ma se non hai neanche il telefono in mano!» Figuraccia. E il racconto ricomincia da capo."] },
  },
  zanzare: { ore: [19, 23], stressOgni15min: 1, testo: 'Bzzz! Zanzare tigre grosse come passeri. Stress che sale.' },
  gatti: { carezza: 3, graffio: 0.2,
    testi: ["Il gatto fa le fusa. Per un attimo il mondo è un posto migliore.", "Il gatto si struscia sulle gambe di Garonio. Stress −{s}."],
    graffioTesti: ["Il gatto si lascia accarezzare... e poi ti graffia. Classico."] },
};

// ---------- Night Paradiso: il catalogo ----------
// Solo testi ironici, niente scene: una riga e via. Tutte maggiorenni e consenzienti (e pagate).
export const PARADISO = {
  apertura: [20, 24],
  porta: [48, 66.4],
  chiuso: ["Il Night Paradiso apre alle 20:00. L'insegna al neon lampeggia lo stesso, per abitudine.", "Chiuso. Sulla porta un cartello: «Torno subito. Sandokan»."],
  giaFatto: "Sandokan, il buttafuori, ti ferma col mignolo: «Per stasera hai già dato, campione. Vai a dormire.»",
  troppoPovero: "Sandokan ti guarda il portafoglio e ride. Ride tanto. Poi ti mette fuori con due dita.",
  benvenuto: [
    "Sandokan, il buttafuori, ti squadra: «Ah, il figlio del Gigante. Tranquillo, qui non diciamo niente a nessuno.» Ti passa il catalogo plastificato e appiccicoso.",
    "Luci viola, musica di Gigi D'Agostino, odore di deodorante alla vaniglia. Il catalogo è sul bancone.",
  ],
  catalogo: [
    { id: 'jessica', nome: 'Jessica, 41', prezzo: 40, stress: 20, xp: 15,
      desc: "Di Casalpusterlengo. Mastica la gomma come se le avesse fatto un torto. Parla solo del cugino che fa il DJ a Riccione.",
      esito: "Bum. Bum. Due colpi. Lei guarda l'orologio. Good job... più o meno." },
    { id: 'samantha', nome: 'Samantha, 36', prezzo: 80, stress: 35, xp: 35,
      desc: "Ex Miss Sagra del Cotechino 2009. La corona ce l'ha ancora, in macchina, sul cruscotto.",
      esito: "Bum bum bum. Tre colpi. Good job!" },
    { id: 'natasha', nome: 'Natasha, 33', prezzo: 150, stress: 55, xp: 70,
      desc: "«Ballerina internazionale». Internazionale nel senso che una volta è stata a Chiasso. Fa la spaccata, ma solo il venerdì.",
      esito: "Bum bum bum bum. Quattro colpi. Good job!" },
    { id: 'svetlana', nome: 'Madame Svetlana, 47', prezzo: 300, stress: 80, xp: 150, vita: 15,
      desc: "La Regina del Paradiso. Ha visto cose che Mister Mountain si sogna. Accetta solo banconote stirate.",
      esito: "Bum bum bum bum bum bum. Sei colpi e un applauso dalla stanza accanto. GREAT job!" },
  ],
  conferma: 'Sì, lei',
  indietro: 'Torna al catalogo',
  uscita: [
    "Garonio esce dal Paradiso canticchiando «Romagna mia». Si sente leggero come un sacco di mangime vuoto.",
    "Fuori, l'aria della Bassa non è mai stata così buona. Puzza di letame, ma buona.",
  ],
  // il tranvione: a volte capita e basta
  tranvione: {
    probabilita: 0.1,
    testi: [
      "TRANVIONE! Spunta il «fidanzato» di lei, Ivan, 140 chili da Lodi. Ti alleggerisce del portafoglio, dell'orologio e della dignità. Domattina lo sa tutto il paese.",
      "TRANVIONE! Il conto finale ha voci misteriose: «supplemento divano», «IVA sentimentale», «diritti di Gigi D'Agostino». Sandokan ti accompagna al bancomat. Poi in piazza lo raccontano tutti.",
      "TRANVIONE! Era una festa a sorpresa del Moreno, con la telecamera. Il video gira già su tutte le chat del paese, e i soldi chissà dove.",
    ],
    reputazione: 40, stress: 20,
  },
  // il giorno dopo un tranvione, i paesani lo sanno
  pettegolezzo: ["Ehi, ma è vero quello che dicono del Paradiso? Ahahah!", "Ciao, «good job»! Ahahah!", "Ah, il Re del Paradiso! Com'era Ivan?"],
};

// ---------- Night Paradiso: l'interno esplorabile (motore: src/interni.js, logica: src/paradiso.js) ----------
export const PARADISO_INTERNO = {
  nome: 'Night Paradiso', w: 18, d: 8, h: 3.2, pavimento: 'moquette', muro: 'velluto', musica: 'notte',
  entrata: { x: 3, z: 7.0 },
  uscita: { x: 3, z: 7.7 },
  stanze: [
    { id: 'ingresso', nome: 'Ingresso del Paradiso', x0: 0, x1: 6, luce: 0.85 },
    { id: 'sala', nome: 'Sala del Paradiso', x0: 6, x1: 18, luce: 0.75, pavimento: 'scacchi' },
  ],
  finestre: [],
  mobili: [
    // ingresso: la reception di Sandokan col catalogo
    { tipo: 'bancone', x: 1, z: 1.7, w: 3, d: 0.6, h: 1.1, colore: '#2a1a2a', piano: '#c8a040', zona: 'catalogo', etichetta: 'Sandokan: il catalogo' },
    { tipo: 'insegna', parete: true, x: 1.2, y: 2.3, w: 3.4, h: 0.5, testo: 'NIGHT PARADISO' },
    { tipo: 'pianta', x: 5, z: 0.4, w: 0.5, d: 0.5, h: 1.3 },
    { tipo: 'tappeto', pavimento: true, x: 2, z: 4.2, w: 2.2, d: 2.4, colore: '#a8203a' },
    { tipo: 'zerbino', pavimento: true, x: 2.3, z: 7.25, w: 1.4, d: 0.6, colore: '#5a1a3a' },
    // sala: bancone, divanetti, pista, juke-box, privé
    { tipo: 'bancone', x: 7, z: 1.7, w: 4, d: 0.6, h: 1.1, colore: '#3a1a3a', piano: '#e0d0e8', spine: true, zona: 'bancone', etichetta: 'Bancone di Lola' },
    { tipo: 'mensola', parete: true, x: 7.2, y: 1.3, w: 3.6, h: 1.0, merce: 'bottiglie' },
    { tipo: 'sgabello', x: 7.6, z: 2.6, w: 0.4, d: 0.4, h: 0.7, colore: '#c83a8a' },
    { tipo: 'sgabello', x: 10, z: 2.6, w: 0.4, d: 0.4, h: 0.7, colore: '#c83a8a' },
    { tipo: 'divano', x: 12.2, z: 0.4, w: 2.6, d: 0.95, h: 0.9, colore: '#a8203a', zona: 'divano', etichetta: 'Il Commendatore sul divanetto' },
    { tipo: 'tappeto', pavimento: true, x: 8.4, z: 4.2, w: 3.2, d: 2.2, colore: '#3a3aa8', zona: 'pista', etichetta: 'Pista da ballo' },
    { tipo: 'tavolino', x: 13.2, z: 4.8, w: 0.9, d: 0.8, h: 0.75, colore: '#2a1a2a', zona: 'geometra', etichetta: 'Tavolino in penombra' },
    { tipo: 'tavolino', x: 15.8, z: 3.2, w: 0.9, d: 0.8, h: 0.75, colore: '#2a1a2a', zona: 'moreno', etichetta: 'Tavolino del Moreno' },
    { tipo: 'jukebox', x: 16.8, z: 0.25, w: 1.0, d: 0.7, h: 1.7, zona: 'jukebox', etichetta: 'Juke-box' },
    { tipo: 'porta', parete: true, x: 15.0, y: 0, w: 1.1, h: 2.1, zona: 'prive', etichetta: 'Porta del privé' },
    { tipo: 'pianta', x: 6.4, z: 6.6, w: 0.5, d: 0.5, h: 1.2 },
  ],
};

// personaggi dentro (coordinate locali della stanza) e cosa dicono
export const PARADISO_GENTE = {
  sandokan: { nome: 'Sandokan, il buttafuori', x: 2.5, z: 1.2, aspetto: { sprite: 'bodyguard', w: 20, h: 28, skin: '#d9a27a', hair: '#1a1a1a', hairStyle: 'bald', shirt: '#1a1a24', pants: '#1a1a24', boots: '#0a0a0a', beard: '#1a1a1a', tie: '#c0242c', belly: true, eyes: 'angry' } },
  lola: { nome: 'Lola, la barista', x: 9, z: 1.2, aspetto: { sprite: 'cameriera_vassoio', w: 15, h: 23, skin: '#f0c0a0', hair: '#1a1a2a', hairStyle: 'long', shirt: '#c83a8a', pants: '#1a1a2a', boots: '#2a1a2a', eyes: 'normal' } },
  commendatore: { nome: 'Il Commendatore', x: 13.5, z: 1.7, aspetto: { sprite: 'commendatore', w: 17, h: 24, skin: '#e8b48a', hair: '#e0e0e0', hairStyle: 'grey', shirt: '#f4f4f4', pants: '#3a3a4a', boots: '#1a1a1a', tie: '#3a3aa8', mustache: '#e0e0e0', belly: true, eyes: 'sleepy' } },
  geometra: { nome: 'Il Geometra Ballarin', x: 13.6, z: 4.3 },
  moreno: { nome: 'Il Moreno in tuta', x: 16.3, z: 4.3 },
};

export const PARADISO_TESTI = {
  entrata: ["Luci viola, musica di Gigi D'Agostino, odore di deodorante alla vaniglia. Benvenuto in Paradiso.", "La porta si chiude alle tue spalle con un «tump» da film. Sandokan ti fa l'occhiolino. Fa paura."],
  bancone: {
    saluto: ["Lola asciuga un bicchiere da quando hai aperto la porta. «Cosa ti servo, bello?»", "«Il figlio del Gigante! Tuo padre veniva qui negli anni '80. Ballava il twist sul bancone.»"],
    ordini: [
      { label: 'Analcolico alla fragola (5€): stress −6', prezzo: 5, stress: -6, testo: "Rosa, dolce, con l'ombrellino. Garonio si sente molto adulto." },
      { label: 'Cocktail «Paradiso» (12€): stress −15, stanchezza +5', prezzo: 12, stress: -15, stanchezza: 5, testo: "Blu, fumante, con dentro una ciliegia e forse un pesce. Si vede la musica." },
      { label: 'Bottiglia di «champagne» (60€): stress −30, +10 XP', prezzo: 60, stress: -30, xp: 10, testo: "Champagne di Broni. Le bollicine ci sono, il resto è fede. Tutta la sala applaude." },
    ],
  },
  commendatore: [
    "«Ragazzo, io qui ho speso tre capannoni e una Mercedes. Ne è valsa la pena? ...Sì.»",
    "«Il segreto della vita? Mai dire a tua moglie che vai al Paradiso. Dille che vai a messa. È quasi la stessa cosa, c'è anche qui l'incenso.»",
    "«Ti do un consiglio da Commendatore: il tranvione arriva quando ti senti furbo. Quindi non sentirti mai furbo.»",
    "Il Commendatore dorme seduto con un sigaro spento in bocca. Russa a tempo di musica.",
  ],
  geometra: {
    primo: "Il Geometra Ballarin si nasconde dietro un menu. «Tu non mi hai visto. Io non ti ho visto. Tieni 10€ e non dirlo alla Pina.»",
    dopo: "Il Geometra fa finta di essere una pianta. Non è convincente.",
    soldi: 10,
  },
  moreno: [
    "«Garonio! Sei venuto a vedere la mia telecamera nuova?» No. No, grazie.",
    "Il Moreno, in tuta, prova a fare il moonwalk. Scivola. Rimane a terra per un po'. «Sto bene!»",
    "«Ho un sistema per evitare il tranvione: vengo solo a guardare. Costa uguale, però.»",
  ],
  pista: { testo: "Garonio si lancia sulla pista. Mosse da trattorista: aratura, semina, falciatura. La sala è perplessa. Stress −6, +3 XP", stress: -6, stanchezza: 4, xp: 3 },
  jukebox: {
    testo: "Il juke-box del Paradiso ha solo tre dischi, ma sono quelli giusti.",
    dischi: ["L'amour toujours (Gigi D'Agostino)", "Tu vuò fà l'americano", "Romagna mia (versione dance)"],
    scelto: "Parte «{titolo}». Il Commendatore si sveglia e balla da seduto. Stress −3",
  },
  prive: "La porta del privé. C'è scritto «SOLO CON PRENOTAZIONE». La prenotazione si fa da Sandokan, al catalogo.",
};
