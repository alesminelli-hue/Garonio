// =====================================================================
//  IL CONSORZIO AGRARIO DI MISTER RODELLA (src/consorzio.js, GDD capitolo 27.4)
//  Capannone verde sulla strada, a est della Cascina dei Salici. Mister Rodella sta sul piazzale.
//  - Sementi gratis: una volta al giorno regala qualche bustina di semi per l'orto (zucchine, insalata,
//    zucche, peperoni, fragole). «La prima dose è sempre gratis.» Il resto lo compri tu: il mangime.
//  - Mangimi: sacchi per i maiali del Gigante (meno cari che al telefono), il Mangime Gold per le galline
//    (alla mangiatoia: tre uova in più) e, se hai l'azienda, il contratto settimanale (spese della cascina −35%).
//  - Trattori: solo per chi ha l'azienda. Ogni trattore comprato è guidabile e dà più raccolto ai campi della cascina.
// =====================================================================

export const CONSORZIO = {
  posto: { x: 102.5, z: 49.2 },              // dove sta Rodella (anche nel PNG di src/data/png.js)
  ore: [7, 19],
  semiAlGiorno: [5, 8],                       // bustine regalate al giorno (in tutto)
  // semi per stagione: d'inverno solo insalata (in serra, dice lui)
  semi: {
    primavera: ['semiInsalata', 'semiZucchina', 'semiFragola', 'semiPeperone'],
    estate: ['semiZucchina', 'semiPeperone', 'semiZucca', 'semiFragola'],
    autunno: ['semiZucca', 'semiInsalata', 'semiPeperone'],
    inverno: ['semiInsalata'],
  },
  mangime: { sacchi: 5, prezzo: 32 },         // 5 sacchi per i maiali del Gigante (al telefono costano 8€ l'uno)
  gold: { n: 3, prezzo: 18 },                 // 3 sacchetti di Mangime Gold
  goldUova: 3,                                // uova in più quando lo dai alle galline
  contratto: { giorni: 7, sconto: 0.35 },     // spese giornaliere della cascina −35% per 7 giorni (pagati subito)
  trattori: [
    { id: 'trattore3', nome: 'Trattore blu «Il Rodellino»', colore: 'blu', prezzo: 6500, campi: 0.2, posto: { x: 86.5, z: 36.6, h: Math.PI / 2 },
      desc: 'Usato garantito: «garantito che è usato». Campi della cascina +20%.' },
    { id: 'trattore4', nome: 'Trattore arancione «Testa Calda 4x4»', colore: 'arancio', prezzo: 16000, campi: 0.35, posto: { x: 90.5, z: 36.6, h: Math.PI / 2 },
      desc: 'Nuovo, con l\'aria condizionata e la radio che prende solo Radio Bassa. Campi della cascina +35%.' },
  ],
};

export const RODELLA = {
  nome: 'Mister Rodella',
  // la prima volta
  presentazione: [
    { chi: 'rodella', testo: "Ma guarda chi c'è! Il figlio del Gigante! Rodella, Consorzio Agrario Rodella. Mister Rodella per gli amici. Per i clienti: Mister Rodella lo stesso." },
    { chi: 'garonio', testo: "Piacere. Mi ha detto mio padre di non comprare niente da lei." },
    { chi: 'rodella', testo: "Tuo padre mi deve ancora un erpice del 1991. Ma io non porto rancore. Porto solo il conto. Tieni: semi gratis! La prima dose è sempre gratis." },
  ],
  saluti: [
    "Giovanotto! Il cliente più bello della Bassa! Dopo di me, ovviamente.",
    "Garonio! Proprio tu! Stavo giusto pensando: «chi è che ha bisogno di un trattore nuovo?». E sei arrivato tu.",
    "Benvenuto al Consorzio Rodella: dove il cliente ha sempre ragione, finché paga.",
    "Ah, sei tu. Credevo fosse la Finanza. Entra, entra.",
  ],
  chiacchiere: [
    "Lo sai che il mio primo trattore l'ho venduto a me stesso? Affare d'oro. Mi sono fatto anche lo sconto.",
    "Mia moglie dice che parlo solo di mangimi. Non è vero: parlo anche di sementi. E di concimi. E di lei, che è andata via con quello delle sementi Pioneer.",
    "Il marketing del consorzio lo fa mio nipote. Ha diciannove anni e ha scritto «CONZORZIO» sul furgone. È un genio incompreso.",
    "Il tuo amico Potato ha comprato un trattore da me nel '98. Lo sta ancora pagando. A rate. Da dodicimila lire.",
    "Il segreto di un buon pomodoro? Musica classica. Il segreto di una buona zucchina? Non dirle mai che è una zucchina. Si offende.",
    "Ho venduto un aratro anche al prete. Non so cosa ci faccia. Non chiedo. Il cliente ha sempre ragione.",
  ],
  // sementi gratis: una gag diversa ogni volta
  semi: [
    { rodella: "Tieni, giovanotto: semi gratis. Gratis! Senti come suona bene? Gra-tis. Io lo dico solo una volta al giorno, poi mi fa male la bocca.", garonio: "Ma perché me li regala?", fine: "Perché poi le zucchine crescono, tu vieni qui a comprare il concime, il concime costa, e io mi compro una Mercedes. Si chiama strategia." },
    { rodella: "Le bustine di oggi. Quelle con la foto della verdura bella. Quella che ti viene a te sarà più brutta, ma è normale: la foto è di mio cugino che fa il fotografo.", garonio: "E se non crescono?", fine: "Allora hai sbagliato tu. I semi Rodella crescono anche sul cemento. Non provarci, eh. Ma crescono." },
    { rodella: "Semi gratis per il mio cliente preferito! Non dirlo al Potato, lui crede di essere il mio cliente preferito.", garonio: "Lo dice a tutti, vero?", fine: "Lo dico a tutti quelli che hanno un portafoglio. Tu ce l'hai? Bravo. Allora sei il mio preferito." },
    { rodella: "Ecco qui. Ah, quelle con l'etichetta storta le ha fatte mio nipote. Se ti nascono carote invece delle zucchine, è colpa sua.", garonio: "Va bene, grazie.", fine: "Grazie a te! E ricordati: zappa, semina, annaffia, raccogli, vendi alla cassa. Poi vieni qui e spendi tutto. È il cerchio della vita." },
  ],
  semiGiaDati: [
    "Oggi te li ho già dati, giovanotto. Gratis sì, scemo no.",
    "Ancora? Ma li mangi crudi i semi? Torna domani.",
    "Una volta al giorno. È scritto anche sul cartello. Il cartello l'ha scritto mio nipote, quindi c'è scritto «una vota al giono», ma il senso è quello.",
  ],
  semeScelto: "Nell'orto semino:",
  nessunSeme: "Non hai bustine. Nell'orto semini i soliti pomodori. Passa da me, che i semi li regalo!",
  // mangimi
  mangime: [
    "Cinque sacchi di mangime per i maiali di tuo padre. Al telefono te li fanno pagare otto euro l'uno, io te li do a trentadue tutti e cinque. Ho fatto i conti con la calcolatrice. Quella col nastro.",
    "Mangime Rodella: i maiali lo mangiano e poi ti ringraziano. Non con le parole, eh. Con i prosciutti.",
  ],
  gold: "Il Mangime Rodella GOLD! Con le vitamine, i sali minerali e un ingrediente segreto che non posso dirti perché non lo so neanche io. Daglielo alle galline e vedi che uova.",
  contratto: "Il contratto settimanale per la tua cascina: per sette giorni mangime e gasolio te li porto io, col furgone. Sconto del trentacinque per cento. Il furgone lo guida mio nipote, quindi arriva... quando arriva.",
  contrattoAttivo: "Il contratto è già attivo: ancora {giorni} giorni. Il furgone passa ogni mattina. Più o meno.",
  // trattori
  trattoriChiusi: "I trattori li vendo solo ai professionisti. Ai titolari d'azienda. A chi ha la partita IVA. Tu hai la partita IVA? No? Allora guarda e non toccare. E non appoggiarti al cofano.",
  trattori: "Ah, l'Imprenditore Agricolo! Vieni, vieni. Guarda che gioielli. Questo non è un trattore, è un'opera d'arte. Con le ruote.",
  trattoreComprato: [
    { chi: 'rodella', testo: "VENDUTO! Firma qui, e qui, e qui. E qui. Questo è per la garanzia, questo per l'assicurazione e questo è il mio autografo, te lo regalo." },
    { chi: 'garonio', testo: "Dove lo trovo?" },
    { chi: 'rodella', testo: "Te l'ho già portato alla cascina. Cioè, l'ha portato mio nipote. Se ha qualche graffio, il graffio era già lì. Garantito." },
  ],
  pocoSoldi: "Eh, giovanotto. Mancano {manca}€. Il Consorzio Rodella fa credito solo a chi ha i soldi.",
  // gag a caso dopo un acquisto
  dopoAcquisto: [
    "Piacere di fare affari con te! Torna presto. Anzi, torna subito, che ho ancora roba da vendere.",
    "Ottimo acquisto! Il migliore della giornata. Anche l'unico, ma il migliore.",
    "Bravo! Tuo padre sarebbe fiero. No, scherzo, tuo padre ti direbbe che ti sei fatto fregare. Ma io sono fiero!",
  ],
};
