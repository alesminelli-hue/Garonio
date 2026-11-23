// =====================================================================
//  IL MONDO VIVO — paesani, traffico, animali, imprevisti e Night Paradiso
//  Solo dati e testi: si cambiano senza toccare il codice.
//  Logica in src/vita.js (paesani, traffico, animali, luci della sera),
//  src/imprevisti.js (buche, pozzanghere, cantieri, cane randagio, impiccioni, zanzare)
//  e src/paradiso.js (il locale del catalogo).
// =====================================================================

// ---------- Posti del paese dove vanno i paesani (coordinate della mappa grande) ----------
export const METE = {
  alimentari: [4.5, 50.7], bar: [13.5, 50.8], piazza: [20, 51], fontana: [8.5, 51.2], municipio: [27.1, 50.4],
  casaRosa: [33, 50.7], strisce: [20.5, 57.2], tabacchi: [16, 66.8], casaAzzurra: [6, 66.8], fermata: [38.5, 57.1],
  paradiso: [49, 66.9], vialetto: [74.8, 58], aia: [72, 69.5], capannoni: [124, 70], ponte: [119, 30.5], laghetto: [35, 77],
};

// ---------- Paesani: compaiono di giorno, la sera tornano a casa ----------
// ore: [da, a] quando sono in giro · casa: dove spariscono la sera · mete: dove vanno a zonzo
// impiccione: 0..1 quanto attaccano bottone a Garonio (stress!) · umarell: va a guardare i cantieri
export const PAESANI = [
  {
    id: 'ines', nome: 'La Sciura Ines', ore: [7, 19], casa: 'casaAzzurra', mete: ['alimentari', 'piazza', 'municipio', 'tabacchi', 'fontana'], impiccione: 0.9,
    aspetto: { w: 15, h: 21, skin: '#f0c8a8', hair: '#d8d8e0', hairStyle: 'long', shirt: '#7a4a8a', pants: '#3a3040', boots: '#2a1a1a', eyes: 'normal' },
  },
  {
    id: 'bepi', nome: 'Il Bepi', ore: [8, 12], ore2: [15, 19], casa: 'tabacchi', mete: ['strisce', 'fermata', 'piazza', 'bar', 'vialetto'], impiccione: 0.5, umarell: true,
    aspetto: { w: 16, h: 23, skin: '#e8b48a', hair: '#bbbbbb', hairStyle: 'bald', hat: '#6a5a4a', shirt: '#8a8a70', pants: '#4a4a3a', boots: '#2a2018', mustache: '#cccccc', belly: true, eyes: 'normal' },
  },
  {
    id: 'gino', nome: 'Il Gino del tabacchi', ore: [7, 20], casa: 'tabacchi', mete: ['tabacchi', 'bar', 'piazza', 'strisce'], impiccione: 0.4, umarell: true,
    aspetto: { w: 16, h: 24, skin: '#e0a986', hair: '#3a2a1a', hairStyle: 'flat', shirt: '#e8e0c8', pants: '#2a2a3a', boots: '#1a1a1a', mustache: '#3a2a1a', eyes: 'normal' },
  },
  {
    id: 'giusy', nome: 'La Giusy parrucchiera', ore: [9, 19], casa: 'casaRosa', mete: ['casaRosa', 'alimentari', 'piazza', 'bar', 'fontana'], impiccione: 0.7,
    aspetto: { w: 15, h: 23, skin: '#f0c0a0', hair: '#e0a020', hairStyle: 'long', shirt: '#e05080', pants: '#1a1a2a', boots: '#a02040', eyes: 'normal' },
  },
  {
    id: 'moreno', nome: 'Il Moreno in tuta', ore: [16, 23.5], casa: 'casaRosa', mete: ['bar', 'paradiso', 'piazza', 'fermata'], impiccione: 0.3,
    aspetto: { w: 16, h: 24, skin: '#e8b08a', hair: '#1a1a1a', hairStyle: 'flat', shirt: '#2050c0', pants: '#2050c0', boots: '#f0f0f0', eyes: 'normal' },
  },
  {
    id: 'sbrana', nome: 'Il Dottor Sbrana, veterinario', ore: [8, 18], casa: 'municipio', mete: ['capannoni', 'aia', 'vialetto', 'bar'], impiccione: 0.5,
    aspetto: { w: 16, h: 24, skin: '#f0c8a8', hair: '#6a6a6a', hairStyle: 'flat', shirt: '#f4f4f4', pants: '#4a5a6a', boots: '#3a2a1a', beard: '#6a6a6a', eyes: 'normal' },
  },
  {
    id: 'ornella', nome: "L'Ornella col barboncino", ore: [7, 10], ore2: [17, 21], casa: 'casaAzzurra', mete: ['laghetto', 'piazza', 'strisce', 'fontana', 'fermata'], impiccione: 0.6, cagnolino: true,
    aspetto: { w: 15, h: 22, skin: '#f0c8a8', hair: '#8a3a2a', hairStyle: 'long', shirt: '#40a090', pants: '#3a3a4a', boots: '#2a2a2a', eyes: 'normal' },
  },
  {
    id: 'walter', nome: 'Il Walter pensionato', ore: [8, 12], ore2: [14, 19], casa: 'municipio', mete: ['strisce', 'ponte', 'fermata', 'piazza', 'vialetto'], impiccione: 0.6, umarell: true,
    aspetto: { w: 16, h: 22, skin: '#e8b48a', hair: '#e0e0e0', hairStyle: 'grey', hat: '#3a4a3a', shirt: '#a07050', pants: '#5a5040', boots: '#2a2018', eyes: 'normal' },
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
      { nome: 'Operaio Gianni', aspetto: { w: 16, h: 24, skin: '#d9a27a', hair: '#3a2a1a', hairStyle: 'flat', hat: '#f0d020', shirt: '#f07020', pants: '#3a4a6a', boots: '#2a2a2a', belly: true, eyes: 'sleepy' } },
      { nome: 'Operaio Franco', aspetto: { w: 16, h: 24, skin: '#e8b48a', hair: '#1a1a1a', hairStyle: 'flat', hat: '#f0d020', shirt: '#f07020', pants: '#3a4a6a', boots: '#2a2a2a', mustache: '#2a1a1a', eyes: 'normal' } },
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
    { id: 'valentina', nome: 'Madame Valentina, 47', prezzo: 300, stress: 80, xp: 150, vita: 15,
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
