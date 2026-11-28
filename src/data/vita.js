// =====================================================================
//  IL MONDO VIVO — paesani, traffico, animali, imprevisti e Night Welcome
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
// frasi: cosa dice quando attacca bottone (se no una frase generica) · sulleRagazze: come in src/data/png.js
export const PAESANI = [
  {
    id: 'ines', nome: 'La Sciura Ines', ore: [7, 19], casa: 'casaAzzurra', mete: ['alimentari', 'piazza', 'municipio', 'tabacchi', 'fontana'], impiccione: 0.9,
    aspetto: { sprite: 'sciura', w: 15, h: 21, skin: '#f0c8a8', hair: '#d8d8e0', hairStyle: 'long', shirt: '#7a4a8a', pants: '#3a3040', boots: '#2a1a1a', eyes: 'normal' },
    frasi: [
      "Garonio! Ai miei tempi i giovani salutavano col cappello. Tu il cappello non ce l'hai. Salutami con quello che hai.",
      "Vado dal dottore. No, non sono malata. C'è il riscaldamento e la gente con cui parlare.",
      "Hai visto la Pina? Non dirle che mi hai visto. Dille che sono morta, così sta tranquilla una settimana.",
      "Mio marito era un santo. Lo dico io, ma lo dice anche la lapide.",
      "Questi giovani d'oggi, sempre col telefono. Io ho il fisso. Mi chiama solo Mister Mountain, per sbaglio.",
      "Al Gloria canto forte perché Dio è vecchio come me e ci sente poco.",
      "Hai mangiato? Sei magro. No, sei grasso. Insomma, sei qualcosa.",
    ],
    sulleRagazze: [
      "Con la {ragazza}? Ai miei tempi prima si chiedeva il permesso al padre di lei. Tu chiedilo al tuo, così ridiamo.",
    ],
  },
  {
    id: 'bepi', nome: 'Il Bepi', ore: [8, 12], ore2: [15, 19], casa: 'tabacchi', mete: ['strisce', 'fermata', 'piazza', 'bar', 'vialetto'], impiccione: 0.5, umarell: true,
    aspetto: { sprite: 'anziano_coppola', w: 16, h: 23, skin: '#e8b48a', hair: '#bbbbbb', hairStyle: 'bald', hat: '#6a5a4a', shirt: '#8a8a70', pants: '#4a4a3a', boots: '#2a2018', mustache: '#cccccc', belly: true, eyes: 'normal' },
    frasi: [
      "Bondì. Sto guardando il cantiere. Il cantiere guarda me. Siamo amici.",
      "Quel tubo lo stanno mettendo storto. Io lo so. Non glielo dico. Mi diverte.",
      "Una volta questa piazza era tutta campi. Poi hanno fatto la piazza. Poi hanno detto che volevano rifare i campi. Non hanno deciso.",
      "Il Bepi sa tutto. Il Bepi non dice niente. Il Bepi dice tutto, ma con lo sguardo.",
    ],
    sulleRagazze: [
      "Te e la {ragazza}. Lo sapevo da tre settimane. Lo sapevo prima di te.",
    ],
  },
  {
    id: 'gino', nome: 'Il Gino del tabacchi', ore: [7, 20], casa: 'tabacchi', mete: ['tabacchi', 'bar', 'piazza', 'strisce'], impiccione: 0.4, umarell: true,
    aspetto: { sprite: 'uomo_gilet', w: 16, h: 24, skin: '#e0a986', hair: '#3a2a1a', hairStyle: 'flat', shirt: '#e8e0c8', pants: '#2a2a3a', boots: '#1a1a1a', mustache: '#3a2a1a', eyes: 'normal' },
    frasi: [
      "Gratta e vinci? No? Fai bene. Io li vendo, mica li compro.",
      "Ho fatto le parole crociate. Sette verticale: \"chi lavora poco nella Bassa\". Sette lettere. Ho scritto \"Garonio\".",
      "Il Tarcisio mi compra le sigarette e me le fa segnare. Ho un quaderno uguale a quello di Loredana. Il quaderno della gente in debito con Gino.",
      "Il lotto è uscito il 47, il morto che parla. Era il Bepi che diceva i numeri.",
    ],
    sulleRagazze: [
      "Per la {ragazza} ci vogliono i cioccolatini. Li ho. Scaduti a marzo, ma il cioccolato non scade. Si stagiona.",
    ],
  },
  {
    id: 'giusy', nome: 'La Giusy parrucchiera', ore: [9, 19], casa: 'casaRosa', mete: ['casaRosa', 'alimentari', 'piazza', 'bar', 'fontana'], impiccione: 0.7,
    aspetto: { sprite: 'bionda_rosa', w: 15, h: 23, skin: '#f0c0a0', hair: '#e0a020', hairStyle: 'long', shirt: '#e05080', pants: '#1a1a2a', boots: '#a02040', eyes: 'normal' },
    frasi: [
      "Garonio, quei capelli. Non dico niente, però li guardo. E li guardo male.",
      "Oggi ho fatto la permanente alla Sciura Ines. Adesso sembra una pecora felice.",
      "Vieni da me che ti faccio la sfumatura. Così almeno quando dormi nel fosso sei in ordine.",
      "Dal parrucchiere si sanno più cose che dal prete. Il prete non ha il phon: le donne parlano sotto il casco.",
      "La Sabrina ha la Panda rosa. Io ho la Twingo viola. Siamo in guerra. Una guerra pastello.",
      "Lo sai che tuo padre ha un ciuffo ribelle? È l'unica cosa che gli si ribella.",
    ],
    sulleRagazze: [
      "Esci con la {ragazza}? Passa prima da me. Gratis, per la causa.",
    ],
  },
  {
    id: 'moreno', nome: 'Il Moreno in tuta', ore: [16, 23.5], casa: 'casaRosa', mete: ['bar', 'paradiso', 'piazza', 'fermata'], impiccione: 0.3,
    aspetto: { sprite: 'tuta_felpa', w: 16, h: 24, skin: '#e8b08a', hair: '#1a1a1a', hairStyle: 'flat', shirt: '#2050c0', pants: '#2050c0', boots: '#f0f0f0', eyes: 'normal' },
    frasi: [
      "Ehi bro. Sto facendo l'imprenditore. Vendo accendini. Con la mia faccia sopra.",
      "Ho la tuta nuova. Identica a quella vecchia. Ma nuova.",
      "Stasera al Welcome c'è la serata latino. Io ci vado per il buffet.",
      "La Tamara mi ha rotto il naso. Ora respiro meglio da una parte sola. È una scelta di stile.",
    ],
    sulleRagazze: [
      "Ma come fai, bro? Io ci provo da dieci anni. Ho il record di due di picche in una sera: sette.",
    ],
  },
  {
    id: 'sbrana', nome: 'Il Dottor Sbrana, veterinario', ore: [8, 18], casa: 'municipio', mete: ['capannoni', 'aia', 'vialetto', 'bar'], impiccione: 0.5,
    aspetto: { sprite: 'veterinario', w: 16, h: 24, skin: '#f0c8a8', hair: '#6a6a6a', hairStyle: 'flat', shirt: '#f4f4f4', pants: '#4a5a6a', boots: '#3a2a1a', beard: '#6a6a6a', eyes: 'normal' },
    frasi: [
      "I tuoi maiali stanno bene. Uno ha chiesto di te. Scherzo, ma mi ha guardato in un certo modo.",
      "Ho fatto un parto gemellare alle tre di notte. Una vacca. Poi il Potato mi ha chiesto di visitare una patata.",
      "Il Dottor Mutua e io abbiamo lo stesso stetoscopio. I miei pazienti però non si lamentano.",
      "Il barboncino dell'Ornella ha l'ansia. Anche l'Ornella. Ho dato una pastiglia a tutti e due.",
    ],
    sulleRagazze: [
      "Se la {ragazza} ha un cane, fatti dare il mio biglietto da visita. Così ci guadagno anch'io.",
    ],
  },
  {
    id: 'ornella', nome: "L'Ornella col barboncino", ore: [7, 10], ore2: [17, 21], casa: 'casaAzzurra', mete: ['laghetto', 'piazza', 'strisce', 'fontana', 'fermata'], impiccione: 0.6, cagnolino: true,
    aspetto: { sprite: 'donna_grembiule', w: 15, h: 22, skin: '#f0c8a8', hair: '#8a3a2a', hairStyle: 'long', shirt: '#40a090', pants: '#3a3a4a', boots: '#2a2a2a', eyes: 'normal' },
    frasi: [
      "Fifì, saluta Garonio. Fifì! ...Non ti saluta. Ha buon gusto, Fifì.",
      "Non avvicinarti col trattore, che Fifì ha i nervi fragili. Anche io.",
      "Fifì oggi ha il cappottino rosso. Abbinato alle mie scarpe. Tu sei abbinato al fango.",
      "Il Potato ha provato ad accarezzare Fifì. Fifì gli ha morso una patata. Erano nella tasca.",
      "Lo sai che Fifì ha più follower di te? Ha un profilo. Anche tu? Peccato.",
      "Il Dottor Sbrana dice che Fifì è ansioso. Mi sa che l'ha preso da me.",
    ],
    sulleRagazze: [
      "La {ragazza}? Fifì l'ha annusata. Ha approvato. Fifì non sbaglia mai.",
    ],
  },
  {
    id: 'walter', nome: 'Il Walter pensionato', ore: [8, 12], ore2: [14, 19], casa: 'municipio', mete: ['strisce', 'ponte', 'fermata', 'piazza', 'vialetto'], impiccione: 0.6, umarell: true,
    aspetto: { sprite: 'anziano_bastone', w: 16, h: 22, skin: '#e8b48a', hair: '#e0e0e0', hairStyle: 'grey', hat: '#3a4a3a', shirt: '#a07050', pants: '#5a5040', boots: '#2a2018', eyes: 'normal' },
    frasi: [
      "Ero geometra delle ferrovie. Adesso guardo i treni passare. Ne passano meno. Era meglio prima.",
      "Ogni mattina vado al ponte a guardare l'acqua. L'acqua mi guarda. Ci capiamo.",
      "Quei ragazzi del cantiere non sanno usare la livella. Io ce l'ho in tasca. Non gliela presto.",
      "Ho scommesso col Bepi su chi finisce prima i lavori, il comune o la nutria sotto il ponte. Punto sulla nutria.",
    ],
    sulleRagazze: [
      "Mia moglie l'ho conosciuta al ballo del liscio nel '64. Le ho pestato i piedi per due ore. Siamo sposati da sessant'anni. Pesta, Garonio, pesta.",
    ],
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
      "«Sì, lavoriamo. Stiamo facendo la pausa del lavoro, poi la pausa della pausa.»",
      "«Il Bepi dice che il tubo è storto. Il tubo è dritto. È il paese che è storto.»",
      "«Il preventivo diceva due settimane. Siamo al quarto mese. È un preventivo ottimista.»",
      "«Il Walter mi ha corretto la livella. Aveva ragione. Non glielo dire.»",
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

// ---------- Night Welcome: il catalogo ----------
// Solo testi ironici, niente scene: una riga e via. Tutte maggiorenni e consenzienti (e pagate).
export const PARADISO = {
  apertura: [20, 28],
  porta: [48, 66.4],
  chiuso: ["Il Night Welcome apre alle 20:00. L'insegna al neon lampeggia lo stesso, per abitudine.", "Chiuso. Sulla porta un cartello: «Torno subito. Sandokan»."],
  giaFatto: "Sandokan, il buttafuori, ti ferma col mignolo: «Per stasera hai già dato, campione. Vai a dormire.»",
  troppoPovero: "Sandokan ti guarda il portafoglio e ride. Ride tanto. Poi ti mette fuori con due dita.",
  benvenuto: [
    "Sandokan, il buttafuori, ti squadra: «Ah, il figlio del Gigante. Tranquillo, qui non diciamo niente a nessuno.» Ti passa il catalogo plastificato e appiccicoso.",
    "Luci viola, musica di Gigi D'Agostino, odore di deodorante alla vaniglia. Il catalogo è sul bancone.",
    "Sandokan ti blocca con una mano sul petto. «Garonio. Scarpe? Sì. Soldi? Vediamo. Dignità? Non serve, entra.»",
    "Sandokan ti blocca con una mano sul petto. «Qui dentro si rispettano tre regole: non toccare, non fotografare, non mettere \"Romagna mia\" al jukebox. La terza è la più importante.»",
    "Sandokan ti blocca con una mano sul petto. «Ho paura dei gatti. Lo sanno tutti. Tu non lo sai. Ok?»",
    "Sandokan ti blocca con una mano sul petto. «Tuo padre era cliente. Negli anni Novanta. Ballava. L'ho fermato io. Per il bene di tutti.»",
  ],
  catalogo: [
    { id: 'jessica', nome: 'Jessica, 41', prezzo: 40, stress: 20, xp: 15,
      desc: "Di Saint James Borough. Mastica la gomma come se le avesse fatto un torto. Parla solo del cugino che fa il DJ a Riccione.",
      esito: "Bum. Bum. Due colpi. Lei guarda l'orologio. Good job... più o meno.",
      battute: ["«Mio cugino fa il DJ a Riccione. Si chiama DJ Cuggino. Sì, con due g. È un nome d'arte.»", "(scoppia una bolla di gomma) «Ho visto il tuo trattore fuori. Ha il clacson che fa \"La cucaracha\"? No? Peccato.»"] },
    { id: 'samantha', nome: 'Samantha, 36', prezzo: 80, stress: 35, xp: 35,
      desc: "Ex Miss Sagra del Cotechino 2009. La corona ce l'ha ancora, in macchina, sul cruscotto.",
      esito: "Bum bum bum. Tre colpi. Good job!",
      battute: ["«Miss Sagra del Cotechino 2009. La fascia ce l'ho ancora. La uso come cintura.»", "«Il segreto della bellezza? Dormire otto ore e non andare mai a Newbarley di sabato.»"] },
    { id: 'natasha', nome: 'Natasha, 33', prezzo: 150, stress: 55, xp: 70,
      desc: "«Ballerina internazionale». Internazionale nel senso che una volta è stata a Wishville. Fa la spaccata, ma solo il venerdì.",
      esito: "Bum bum bum bum. Quattro colpi. Good job!",
      battute: ["«Sono stata a Wishville. Internazionale. Ho comprato la cioccolata e sono tornata.»", "«La spaccata la faccio solo il venerdì. Gli altri giorni mi faccio spaccare la schiena dal Sergente in palestra.»"] },
    { id: 'svetlana', nome: 'Madame Svetlana, 47', prezzo: 300, stress: 80, xp: 150, vita: 15,
      desc: "La Regina del Welcome. Ha visto cose che Mister Mountain si sogna. Accetta solo banconote stirate.",
      esito: "Bum bum bum bum bum bum. Sei colpi e un applauso dalla stanza accanto. GREAT job!",
      battute: ["«Ah, il figlio del Gigante. Tuo padre veniva qui negli anni Novanta. Ballava il twist. Male.»", "«Io ho visto molto, ragazzo. Ho visto Mister Mountain pagare in contanti. Nessuno ci crede.»", "«Queste banconote non sono stirate. Qui si accetta solo denaro elegante.»"] },
  ],
  conferma: 'Sì, lei',
  indietro: 'Torna al catalogo',
  uscita: [
    "Garonio esce dal Welcome canticchiando «Romagna mia». Si sente leggero come un sacco di mangime vuoto.",
    "Fuori, l'aria della Bassa non è mai stata così buona. Puzza di letame, ma buona.",
  ],
  // il tranvione: a volte capita e basta
  tranvione: {
    probabilita: 0.1,
    testi: [
      "TRANVIONE! Spunta il «fidanzato» di lei, Ivan, 140 chili da Littlesound. Ti alleggerisce del portafoglio, dell'orologio e della dignità. Domattina lo sa tutto il paese.",
      "TRANVIONE! Il conto finale ha voci misteriose: «supplemento divano», «IVA sentimentale», «diritti di Gigi D'Agostino». Sandokan ti accompagna al bancomat. Poi in piazza lo raccontano tutti.",
      "TRANVIONE! Era una festa a sorpresa del Moreno, con la telecamera. Il video gira già su tutte le chat del paese, e i soldi chissà dove.",
    ],
    reputazione: 40, stress: 20,
  },
  // il giorno dopo un tranvione, i paesani lo sanno
  pettegolezzo: ["Ehi, ma è vero quello che dicono del Welcome? Ahahah!", "Ciao, «good job»! Ahahah!", "Ah, il Re del Welcome! Com'era Ivan?"],
};

// ---------- Night Welcome: l'interno esplorabile (motore: src/interni.js, logica: src/paradiso.js) ----------
export const PARADISO_INTERNO = {
  nome: 'Night Welcome', w: 18, d: 8, h: 3.2, pavimento: 'moquette', muro: 'velluto', musica: 'notte',
  entrata: { x: 3, z: 7.0 },
  uscita: { x: 3, z: 7.7 },
  stanze: [
    { id: 'ingresso', nome: 'Ingresso del Welcome', x0: 0, x1: 6, luce: 0.85 },
    { id: 'sala', nome: 'Sala del Welcome', x0: 6, x1: 18, luce: 0.75, pavimento: 'scacchi' },
  ],
  finestre: [],
  mobili: [
    // ingresso: la reception di Sandokan col catalogo
    { tipo: 'bancone', x: 1, z: 1.7, w: 3, d: 0.6, h: 1.1, colore: '#2a1a2a', piano: '#c8a040', zona: 'catalogo', etichetta: 'Sandokan: il catalogo' },
    { tipo: 'insegna', parete: true, x: 1.2, y: 2.3, w: 3.4, h: 0.5, testo: 'NIGHT WELCOME' },
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
    { tipo: 'discoBall', pavimento: true, x: 9.7, z: 4.9, w: 0.55, d: 0.1, h: 0.6, y: 2.1 },   // sopra la pista (solo col foglio degli arredi)
    { tipo: 'tavolino', x: 13.2, z: 4.8, w: 0.9, d: 0.8, h: 0.75, colore: '#2a1a2a', zona: 'geometra', etichetta: 'Tavolino in penombra' },
    { tipo: 'tavolino', x: 15.8, z: 3.2, w: 0.9, d: 0.8, h: 0.75, colore: '#2a1a2a', zona: 'moreno', etichetta: 'Tavolino del Moreno' },
    { tipo: 'jukebox', x: 16.8, z: 0.25, w: 1.0, d: 0.7, h: 1.7, zona: 'jukebox', etichetta: 'Juke-box' },
    { tipo: 'porta', parete: true, x: 15.0, y: 0, w: 1.1, h: 2.1, zona: 'prive', etichetta: 'Porta del privé' },
    { tipo: 'sedia', x: 13.6, z: 0.4, w: 0.6, d: 0.6, h: 1.2, colore: '#c8a040', zona: 'svetlana', etichetta: 'Madame Svetlana' },
    { tipo: 'pianta', x: 6.4, z: 6.6, w: 0.5, d: 0.5, h: 1.2 },
  ],
};

// personaggi dentro (coordinate locali della stanza) e cosa dicono
export const PARADISO_GENTE = {
  sandokan: { nome: 'Sandokan, il buttafuori', x: 2.5, z: 1.2, aspetto: { sprite: 'bodyguard', w: 20, h: 28, skin: '#d9a27a', hair: '#1a1a1a', hairStyle: 'bald', shirt: '#1a1a24', pants: '#1a1a24', boots: '#0a0a0a', beard: '#1a1a1a', tie: '#c0242c', belly: true, eyes: 'angry' } },
  lola: { nome: 'Lola, la barista', x: 9, z: 1.2, aspetto: { sprite: 'cameriera_vassoio', w: 15, h: 23, skin: '#f0c0a0', hair: '#1a1a2a', hairStyle: 'long', shirt: '#c83a8a', pants: '#1a1a2a', boots: '#2a1a2a', eyes: 'normal' } },
  commendatore: { nome: 'Il Commendatore', x: 13.5, z: 1.7, aspetto: { sprite: 'commendatore', w: 17, h: 24, skin: '#e8b48a', hair: '#e0e0e0', hairStyle: 'grey', shirt: '#f4f4f4', pants: '#3a3a4a', boots: '#1a1a1a', tie: '#3a3aa8', mustache: '#e0e0e0', belly: true, eyes: 'sleepy' } },
  svetlana: { nome: 'Madame Svetlana', x: 14.0, z: 1.6, aspetto: { sprite: 'mora_rosso', ricolora: { gradi: -70, capelli: '#e8dcb0' }, w: 16, h: 24, skin: '#f4d8c8', hair: '#e8dcb0', hairStyle: 'long', shirt: '#7a2a8a', pants: '#7a2a8a', boots: '#1a1a1a', eyes: 'normal' } },
  geometra: { nome: 'Il Geometra Ballarin', x: 13.6, z: 4.3 },
  moreno: { nome: 'Il Moreno in tuta', x: 16.3, z: 4.3 },
};

export const PARADISO_TESTI = {
  entrata: ["Luci viola, musica di Gigi D'Agostino, odore di deodorante alla vaniglia. Benvenuto al Welcome.", "La porta si chiude alle tue spalle con un «tump» da film. Sandokan ti fa l'occhiolino. Fa paura."],
  bancone: {
    saluto: ["Lola asciuga un bicchiere da quando hai aperto la porta. «Cosa ti servo, bello?»", "«Il figlio del Gigante! Tuo padre veniva qui negli anni '80. Ballava il twist sul bancone.»",
      "«Benvenuto al Welcome. Il cocktail della casa è il \"Peccato padano\": Lambrusco e gazzosa.»",
      "«Garonio! Tranquillo, qui dentro nessuno ti ha visto. Tranne tutti.»",
      "«Lo specchio dietro il bancone è stato rotto tre volte. Sempre dal Moreno, sempre ballando \"L'amour toujours\".»",
      "«Sandokan sembra cattivo, ma piange coi film di Natale. Il ventiquattro dicembre chiude per lutto.»",
      "«Il Commendatore ordina sempre un \"whisky di classe\". È tè freddo. Lo sa, ma gli piace dirlo.»",
      "«Ho studiato da sommelier. Ora servo Lambrusco a uno che ha la cravatta coi tortellini. La vita è strana.»",
      "«Se cerchi il Geometra Ballarin, è al tavolo in fondo. Misura il divano. Dice che non è a norma.»",
    ],
    ordini: [
      { label: 'Analcolico alla fragola (5€): stress −6', prezzo: 5, stress: -6, testo: "Rosa, dolce, con l'ombrellino. Garonio si sente molto adulto." },
      { label: 'Cocktail «Welcome» (12€): stress −15, stanchezza +5', prezzo: 12, stress: -15, stanchezza: 5, testo: "Blu, fumante, con dentro una ciliegia e forse un pesce. Si vede la musica." },
      { label: 'Bottiglia di «champagne» (60€): stress −30, +10 XP', prezzo: 60, stress: -30, xp: 10, testo: "Champagne di Broni. Le bollicine ci sono, il resto è fede. Tutta la sala applaude." },
    ],
  },
  commendatore: [
    "«Ragazzo, io qui ho speso tre capannoni e una Mercedes. Ne è valsa la pena? ...Sì.»",
    "«Il segreto della vita? Mai dire a tua moglie che vai al Welcome. Dille che vai a messa. È quasi la stessa cosa, c'è anche qui l'incenso.»",
    "«Ti do un consiglio da Commendatore: il tranvione arriva quando ti senti furbo. Quindi non sentirti mai furbo.»",
    "Il Commendatore dorme seduto con un sigaro spento in bocca. Russa a tempo di musica.",
    "«Giovanotto, ai miei tempi un uomo si giudicava dalla cravatta. La tua cravatta è il collo della tuta.»",
    "«Ho fondato tre aziende. Ne ho chiuse quattro. Una era del vicino.»",
    "«Questo whisky ha diciotto anni. Il tè freddo, dice Lola. Ma diciotto anni di tè freddo, eh.»",
    "«Conosco il Conte. Abbiamo fatto la naja insieme. Lui aveva il maggiordomo anche lì.»",
    "«Ah, l'amore! Io mi sono sposato tre volte. Ogni volta per sempre.»",
  ],
  geometra: {
    primo: "Il Geometra Ballarin si nasconde dietro un menu. «Tu non mi hai visto. Io non ti ho visto. Tieni 10€ e non dirlo alla Pina.»",
    dopo: "Il Geometra fa finta di essere una pianta. Non è convincente.",
    soldi: 10,
  },
  svetlana: [
    "«Ah, il figlio del Gigante. Tuo padre veniva qui negli anni Novanta. Ballava il twist. Male.»",
    "«Io ho visto molto, ragazzo. Ho visto Mister Mountain pagare in contanti. Nessuno ci crede.»",
    "«Queste banconote non sono stirate. Qui si accetta solo denaro elegante.»",
    "«La Bassa è come Mosca: freddo, nebbia, e tutti che bevono per dimenticare. Solo che qui c'è il cotechino.»",
    "«Ho avuto tre mariti. Uno pilota, uno poeta, uno di Littlesound. Il peggiore era il poeta.»",
    "«Sandokan è come un figlio per me. Un figlio di centoquaranta chili che ha paura dei gatti.»",
  ],
  moreno: [
    "«Garonio! Sei venuto a vedere la mia telecamera nuova?» No. No, grazie.",
    "Il Moreno, in tuta, prova a fare il moonwalk. Scivola. Rimane a terra per un po'. «Sto bene!»",
    "«Ho un sistema per evitare il tranvione: vengo solo a guardare. Costa uguale, però.»",
  ],
  pista: { testo: "Garonio si lancia sulla pista. Mosse da trattorista: aratura, semina, falciatura. La sala è perplessa. Stress −6, +3 XP", stress: -6, stanchezza: 4, xp: 3 },
  jukebox: {
    testo: "Il juke-box del Welcome luccica di viola. Dentro ci sono tutti i pezzi della Bassa. Ogni canzone che metti, stress −3: il Commendatore si sveglia e balla da seduto.",
  },
  prive: "La porta del privé. C'è scritto «SOLO CON PRENOTAZIONE». La prenotazione si fa da Sandokan, al catalogo.",
};
