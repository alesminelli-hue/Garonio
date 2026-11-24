// =====================================================================
//  PERSONAGGI NON GIOCANTI (PNG) — GDD capitoli 4, 17 e 19
//  Solo dati: dove stanno, a che ora, come sono fatti e cosa dicono.
//
//  posti: [{ ore: [da, a], x, z }]   dove si trova nelle varie ore (prima regola che combacia).
//         Coordinate della mappa grande (src/map.js). interno: 'bar' = sta dentro quell'edificio e x, z sono
//         coordinate locali della stanza (src/data/interni.js): compare solo quando Garonio entra.
//  giro:  [[x, z], ...]              se c'è, il personaggio cammina avanti e indietro lungo questi punti.
//  aspetto: stesso formato dei personaggi di src/pixel.js (usato per sprite e ritratto).
//  saluti / chiacchiere: frasi a caso. {titolo} = titolo di Garonio, {nome} = nome del personaggio.
//  amicizia: [min, max, partenza]. Chiacchierare la prima volta nel giorno dà +1.
// =====================================================================

export const PNG = {
  mamma: {
    nome: 'La Mamma', ruolo: 'Gentile, l\'unica che difende Garonio.',
    // in cucina (src/data/interni.js), tranne a metà mattina quando stende i panni in cortile
    posti: [{ ore: [6, 9], interno: 'casa', x: 19.8, z: 1.4 }, { ore: [9, 11], x: 68.8, z: 67.3 }, { ore: [11, 22], interno: 'casa', x: 20.4, z: 1.4 }],
    aspetto: { sprite: 'contadina_cesto', w: 16, h: 23, skin: '#f0c8a8', hair: '#8a6a4a', hairStyle: 'long', shirt: '#d87aa0', pants: '#5a4a6a', boots: '#3a2a1a', belly: true, eyes: 'normal' },
    amicizia: [0, 100, 60],
    saluti: [
      "Tesoro! Hai mangiato? No, perché sei pallido.",
      "Tuo padre urla, ma ti vuole bene. A modo suo. Molto a modo suo.",
      "Ti ho stirato la tuta. Non dirlo a tuo padre, dice che ti vizio.",
    ],
    chiacchiere: [
      "Quando eri piccolo dicevi che da grande volevi fare il gatto. Dormivi già tanto.",
      "La Pina dice cose su di te in paese. Io le dico che sei un bravo ragazzo. Poi vado a casa e prego.",
      "In cantina sparisce il salame. Sarà il gatto. Abbiamo un gatto? No. Allora non so.",
    ],
  },
  consulente: {
    nome: 'Il Consulente', ruolo: 'Amico fidato al bar: consigli su cosa trovare in giro.',
    posti: [{ ore: [9, 23], interno: 'bar', x: 10.15, z: 0.85 }],   // al suo tavolino
    aspetto: { sprite: 'completo_cravatta', w: 16, h: 24, skin: '#e8b48a', hair: '#2a2a2a', hairStyle: 'flat', shirt: '#4a6aa8', tie: '#a83a3a', pants: '#3a3a4a', boots: '#1a1a1a', eyes: 'normal' },
    amicizia: [0, 100, 20],
    saluti: [
      "Garonio! Siediti. Te lo dico da professionista: oggi è una giornata di opportunità.",
      "Ecco il mio cliente preferito. Anche l'unico. Ma il preferito.",
      "Offrimi un caffè e ti cambio la giornata. Garantito, o quasi.",
    ],
    chiacchiere: [
      "Mai fidarsi di un meccanico che fischietta. Zeno fischietta sempre.",
      "Mio cugino ha preso in pieno la cabina della corrente e ha trovato... no, lascia stare.",
      "La Vigilessa fa il giro della piazza come un orologio svizzero. Svizzero di Codogno.",
    ],
  },
  loredana: {
    nome: 'Loredana', ruolo: 'La barista. Ha visto tutto, ha sentito tutto, non dimentica niente.',
    posti: [{ ore: [6, 24], interno: 'bar', x: 3.9, z: 1.05 }],   // dietro al bancone
    aspetto: { sprite: 'barista', w: 16, h: 24, skin: '#f0c8a8', hair: '#a0522d', hairStyle: 'long', shirt: '#ffffff', pants: '#333', boots: '#222', eyes: 'normal' },
    amicizia: [-50, 50, 5],
    saluti: [
      "Il solito, Garonio?",
      "Ancora tu? Oggi cosa ti ha fatto tuo padre?",
      "Siediti, che hai la faccia di uno che ha visto Mister Mountain.",
    ],
    chiacchiere: [
      "Le regole del bar sono tre: si paga, non si sputa, e le risse si fanno fuori. La terza è più un consiglio.",
      "Tarcisio ha il conto aperto dal 1987. Ormai è un monumento.",
      "Il Consulente beve un caffè all'ora. Non so che lavoro faccia, ma lo fa sveglio.",
    ],
  },
  zeno: {
    nome: 'Zeno il meccanico', ruolo: 'Scorbutico, ripara i mezzi e spesso ti frega.',
    posti: [{ ore: [7, 19], interno: 'meccanico', x: 2.2, z: 1.05 }],   // dietro al bancone della sua officina in paese («Da Zeno»)
    aspetto: { sprite: 'meccanico', w: 17, h: 24, skin: '#d9a27a', hair: '#4a4a4a', hairStyle: 'flat', shirt: '#5a6a7a', overalls: '#2a3a5a', pants: '#2a3a5a', boots: '#1a1a1a', mustache: '#3a3a3a', eyes: 'angry' },
    amicizia: [-50, 50, -5],
    saluti: [
      "Cosa vuoi. Se è rotto, costa. Se non è rotto, costa uguale.",
      "Cosa le hai fatto a 'sta Vespa, l'hai portata in guerra?",
      "Garanzia? Sì, fino al cancello.",
    ],
    chiacchiere: [
      "Il prezzo è quello. Se non ti va, ripara da solo. Con cosa, con le mani?",
      "Tuo padre mi deve ancora i soldi del '98. Li aggiungo al tuo conto, così si pareggia.",
      "Fischiettare? Io? Mai. ♪ fiu fiu ♪",
    ],
  },
  bubetto: {
    nome: 'Il Bubetto', ruolo: 'Magazzino di tutto: vestiti, armi, manuali. Dà missioni secondarie.',
    // la mattina presto vende dal furgone in piazza, poi apre il magazzino
    posti: [{ ore: [7, 9], x: 7.6, z: 51.4 }, { ore: [9, 20], interno: 'magazzino', x: 7.0, z: 1.35 }],
    aspetto: { sprite: 'hippie', w: 17, h: 24, skin: '#f0c098', hair: '#c88a3a', hairStyle: 'messy', hat: '#2a5a3a', shirt: '#e0c050', pants: '#6a4a2a', boots: '#3a2a1a', belly: true, eyes: 'normal' },
    amicizia: [-50, 50, 0],
    saluti: [
      "Garonio! Il mio cliente più affidabile. Affidabile nel senso che torni sempre.",
      "Roba buona, roba nuova, roba... trovata. Non chiedere.",
      "Benvenuto nel mio magazzino! Se non c'è, te lo procuro. Se c'è, costa.",
    ],
    chiacchiere: [
      "Questa giacca? Era di un sindaco. Di quale paese non lo so.",
      "Se mi porti code di ratto ti pago. Cosa ci faccio? Affari miei.",
      "Mister Frank mi deve dei soldi. Tutti mi devono dei soldi. Io invece no.",
    ],
  },
  vigilessa: {
    nome: 'La Vigilessa', ruolo: 'Fa la multa se ti vede urtare qualcosa coi mezzi.',
    posti: [{ ore: [8, 19], x: 20, z: 51.6 }],
    giro: [[3, 51.6], [38, 51.6]],
    aspetto: { sprite: 'vigilessa', w: 16, h: 24, skin: '#f0c8a8', hair: '#2a1a1a', hairStyle: 'long', hat: '#f4f4f4', shirt: '#2a3a6a', belt: '#f4f4f4', pants: '#2a3a6a', boots: '#111', eyes: 'angry' },
    amicizia: [-50, 50, 0],
    saluti: [
      "Garonio. Di nuovo. Patente e libretto. Anche della zappa.",
      "Il paracarro era lì da prima di te.",
      "Circolare. Piano. In silenzio.",
    ],
    chiacchiere: [
      "Non accetto caffè, regali o pannocchie. Le pannocchie meno di tutto.",
      "Ho multato anche mia madre. Due volte. La seconda era recidiva.",
      "La piazza è zona pedonale. Anche per i trattori. SOPRATTUTTO per i trattori.",
    ],
  },
  patata: {
    nome: 'Il Patata', ruolo: 'Vicino grosso, lento e buono. Parla solo di patate.',
    posti: [{ ore: [6, 17], x: 101.5, z: 27.6 }, { ore: [17, 20], x: 101.5, z: 40.4 }],   // di giorno sul bordo del campo, la sera davanti alla cascina (src/data/vicini.js)
    aspetto: { sprite: 'contadino_patate', w: 19, h: 25, skin: '#e8b090', hair: '#8a6a3a', hairStyle: 'bald', hat: '#c8a050', shirt: '#7a8a4a', overalls: '#6a5a3a', pants: '#6a5a3a', boots: '#3a2a1a', belly: true, eyes: 'sleepy' },
    amicizia: [-50, 50, 10],
    saluti: [
      "Garonio, sai cosa ci vuole per essere felici? Una patata. Bollita. Basta.",
      "Ciao Garonio. Hai visto le mie patate? Belle, eh? Le ho chiamate tutte per nome.",
    ],
    chiacchiere: [
      "Tuo papà mi ha chiesto in prestito la turbina. Nel 2009. La sto ancora aspettando.",
      "Mia mamma dice che sono rotondo come una patata. È un complimento, credo.",
      "Fritte, lesse, al forno. La patata non giudica. La patata accoglie.",
    ],
  },
  postino: {
    nome: 'Il Postino', ruolo: 'Sa tutto di tutti, legge le lettere degli altri.',
    posti: [{ ore: [6, 20], x: 36.5, z: 27.6 }],
    giro: [[30, 27.6], [47, 27.6]],   // passeggia sul bordo del suo grano (e tiene d'occhio i paletti)
    aspetto: { sprite: 'uomo_zaino', w: 16, h: 24, skin: '#f0c098', hair: '#3a2a1a', hairStyle: 'flat', hat: '#2a4a8a', shirt: '#6a8ac8', pants: '#2a3a6a', boots: '#1a1a1a', mustache: '#3a2a1a', eyes: 'normal' },
    amicizia: [-50, 50, 5],
    saluti: [
      "C'è una lettera per te. Ah no, era di tuo padre. Dice che sei pigro. L'ho letta per sbaglio. Tre volte.",
      "Garonio! Novità? No? Allora te le dico io.",
    ],
    chiacchiere: [
      "Con la Pina? Ma chi l'ha detto? ...Chi l'ha detto?",
      "Mister Frank riceve pacchi dall'America. Dentro ci sono stivali. Sempre stivali.",
      "Il geometra Ballarin ha scritto al comune per le tue file storte. Ho la copia, se vuoi.",
    ],
  },
  frank: {
    nome: 'Mister Frank', ruolo: 'Emiliano che si crede americano. Ha il pozzo più profondo.',
    posti: [{ ore: [6, 17], x: 137.5, z: 27.6 }, { ore: [17, 21], x: 144.5, z: 40.4 }],
    aspetto: { sprite: 'cowboy_fucile', w: 17, h: 25, skin: '#e8a080', hair: '#c8c8c8', hairStyle: 'flat', hat: '#8a5a2a', shirt: '#b84a3a', plaid: true, pants: '#3a5a8a', belt: '#c8a050', boots: '#6a3a1a', mustache: '#d8d8d8', eyes: 'normal' },
    amicizia: [-50, 50, 0],
    saluti: [
      "Hey boy! Qui siamo nel Texas della Bassa!",
      "Howdy, Garonio! Tuo papà? Good man. Ladro, ma good man.",
    ],
    chiacchiere: [
      "Il mio pozzo è il più profondo della county. Non toccarlo, eh!",
      "Il trattore? No no, quello è il mio horse. Si chiama Thunder.",
      "In America le pannocchie sono grandi così. Io in America non ci sono mai stato, ma lo so.",
    ],
  },
  // ---------- Personaggi degli edifici del paese (interni in src/data/interni.js, scelte in src/edifici.js) ----------
  donPeppino: {
    nome: 'Don Peppino', ruolo: 'Il parroco. Confessa, benedice e tifa Milan dal pulpito.',
    posti: [{ ore: [7, 20], interno: 'chiesa', x: 9.0, z: 2.3 }],   // accanto all'altare
    aspetto: { sprite: 'prete', w: 16, h: 24, skin: '#e8b48a', hair: '#2a2a2a', hairStyle: 'flat', shirt: '#1e1e24', pants: '#1e1e24', boots: '#111', eyes: 'normal' },
    amicizia: [-30, 60, 10],
    saluti: [
      "Garonio, figliolo! Era da Pasqua del 2009 che non ti vedevo. E anche allora eri venuto per le uova.",
      "Pace e bene. Soprattutto pace, che tuo padre ieri ha bestemmiato fino al campanile.",
      "Entra, entra. Qui il Gigante non comanda. Comanda uno più grosso di lui.",
    ],
    chiacchiere: [
      "Il Signore perdona tutto. Il Gigante no, ma il Signore sì.",
      "La Pina viene a confessarsi tutti i giorni. Non per i suoi peccati: per raccontarmi quelli degli altri.",
      "Il campanile pende un po'. Il geometra Ballarin dice che è artistico.",
    ],
  },
  suoraCarmela: {
    nome: 'Suor Carmela', ruolo: 'Tiene in ordine la sagrestia e il paese. Con la bacchetta.',
    posti: [{ ore: [8, 18], interno: 'chiesa', x: 15.6, z: 3.6 }],
    aspetto: { sprite: 'suora', w: 16, h: 24, skin: '#f0c8a8', hair: '#1e1e24', hairStyle: 'long', shirt: '#1e1e24', pants: '#1e1e24', boots: '#111', eyes: 'normal' },
    amicizia: [-30, 50, 0],
    saluti: [
      "Garonio. Le scarpe. Fango in sagrestia, no.",
      "Ti ho visto alla processione. Masticavi la gomma. Il Signore ha visto. Io pure.",
    ],
    chiacchiere: [
      "Il vino della messa è contato. Lo so io quante bottiglie ci sono. E anche Don Peppino lo sa, purtroppo.",
      "Facevo catechismo a tuo padre. Era già grosso a nove anni. E già non ascoltava.",
    ],
  },
  conte: {
    nome: 'Il Conte della Bassa', ruolo: 'Ultimo nobile del paese. Castello enorme, conto in banca piccolo.',
    posti: [{ ore: [10, 21], interno: 'castello', x: 17.0, z: 2.6 }],   // davanti al trono
    aspetto: { sprite: 'conte', w: 17, h: 24, skin: '#f0d0b8', hair: '#f4f0e4', hairStyle: 'long', shirt: '#1e1e24', pants: '#1e1e24', boots: '#111', eyes: 'normal' },
    amicizia: [-30, 60, 0],
    saluti: [
      "Oh, il giovane del Gigante. Si inchini. Non così tanto, mi fa venire il mal di schiena per lei.",
      "Benvenuto nella mia umile dimora. Umile per un conte, s'intende.",
      "Le ricordo che i suoi bisnonni zappavano le mie terre. Ora le zappa lei. Il mondo è giusto.",
    ],
    chiacchiere: [
      "Il mio trisavolo ha combattuto a Solferino. Dalla parte sbagliata, ma con eleganza.",
      "Il castello ha quarantadue stanze. Ne riscaldo una. Le altre le riscalda la mia dignità.",
      "Ho venduto gli affreschi per rifare il tetto. Ora piove sugli affreschi del vicino.",
    ],
  },
  ambrogio: {
    nome: 'Ambrogio', ruolo: 'Il maggiordomo del Conte. Serve la famiglia da tre generazioni e da tre stipendi arretrati.',
    posti: [{ ore: [9, 21], interno: 'castello', x: 6.6, z: 3.0 }],
    aspetto: { sprite: 'professore', w: 16, h: 23, skin: '#e8c0a0', hair: '#d8d8d8', hairStyle: 'flat', shirt: '#5a3a22', pants: '#3a3a3a', boots: '#111', eyes: 'normal' },
    amicizia: [-20, 50, 0],
    saluti: [
      "Il signor Conte la riceverà. Forse. Si pulisca i piedi, prego. Tutti e due.",
      "Desidera un tè? Non ne abbiamo. Ma desiderarlo è gratis.",
    ],
    chiacchiere: [
      "Nelle segrete c'è un forziere. Il signor Conte dice che è vuoto. Il signor Conte dice tante cose.",
      "Lucido le armature ogni martedì. Quella a destra, una volta, mi ha risposto.",
    ],
  },
  pastiglia: {
    nome: 'Il Dottor Pastiglia', ruolo: 'Il farmacista. Ha una pillola per tutto, anche per i Gigante.',
    posti: [{ ore: [8, 20], interno: 'farmacia', x: 6.2, z: 1.3 }],   // dietro al banco
    aspetto: { sprite: 'farmacista', w: 16, h: 24, skin: '#e8b48a', hair: '#3a2a1a', hairStyle: 'flat', shirt: '#f4f4f0', pants: '#3a3a4a', boots: '#222', eyes: 'normal' },
    amicizia: [-20, 50, 5],
    saluti: [
      "Buongiorno! Mal di schiena da zappa, mal di testa da padre o mal di cuore da bar?",
      "Ricetta? No? Allora le do quello che darei a me. Cioè una camomilla.",
    ],
    chiacchiere: [
      "Il Bubetto vende la pomata del veterinario. Io vendo quella per le persone. Il tubetto è lo stesso, il prezzo no.",
      "Mister Mountain compra l'antiacido a scatoloni. Si vede che anche lui ha un capo.",
    ],
  },
  dottorMutua: {
    nome: 'Il Dottor Mutua', ruolo: 'Il medico condotto. Visita tutti, guarisce qualcuno.',
    posti: [{ ore: [8, 19], interno: 'dottore', x: 10.0, z: 0.75 }],   // dietro alla scrivania
    aspetto: { sprite: 'dottore', w: 16, h: 23, skin: '#e8b48a', hair: '#2a2a2a', hairStyle: 'flat', shirt: '#f4f4f0', pants: '#3a3a4a', boots: '#222', eyes: 'normal' },
    amicizia: [-20, 50, 5],
    saluti: [
      "Si accomodi. Dica trentatré. Ecco, già sta meglio.",
      "Ancora tu? Cos'è stavolta, nutria, trattore o Gigante?",
    ],
    chiacchiere: [
      "Il certificato per non lavorare? A te? Tuo padre mi aspetta sotto casa col forcone.",
      "Il veterinario e io abbiamo studiato insieme. Lui ha scelto le mucche perché non si lamentano.",
    ],
  },
  assunta: {
    nome: 'L\'infermiera Assunta', ruolo: 'Gestisce la sala d\'attesa come un campo di battaglia.',
    posti: [{ ore: [8, 18], interno: 'dottore', x: 5.4, z: 0.8 }],   // dietro alla scrivania dell'accettazione
    aspetto: { sprite: 'infermiera', w: 16, h: 23, skin: '#f0c8a8', hair: '#6a3a1a', hairStyle: 'long', shirt: '#f4f4f0', pants: '#f4f4f0', boots: '#ddd', eyes: 'normal' },
    amicizia: [-20, 50, 5],
    saluti: [
      "Numero? Non hai preso il numero. Allora aspetti. Sì, anche se non c'è nessuno.",
      "Siediti. Il dottore arriva. Il dottore arriva sempre. Prima o poi.",
    ],
    chiacchiere: [
      "La Sciura Ines viene ogni mattina. Non è malata: qui c'è il riscaldamento.",
      "Ho fatto più punture io che le zanzare del laghetto.",
    ],
  },
  sergente: {
    nome: 'Il Sergente', ruolo: 'Istruttore della palestra «Bicipite d\'Oro». Ex militare, ex tutto.',
    posti: [{ ore: [7, 23], interno: 'palestra', x: 5.6, z: 3.8 }],
    aspetto: { sprite: 'sergente', w: 16, h: 24, skin: '#d9a27a', hair: '#2a2a2a', hairStyle: 'flat', shirt: '#5a6a3a', pants: '#5a6a3a', boots: '#2a2a1a', mustache: '#2a2a2a', eyes: 'angry' },
    amicizia: [-30, 50, 0],
    saluti: [
      "RECLUTA! Dieci flessioni. Poi parliamo. Poi altre dieci.",
      "Quella pancia è un'arma impropria. La sequestriamo a suon di squat.",
      "Al fronte mangiavamo sassi. Tu cosa mangi? Tortellini? Si vede.",
    ],
    chiacchiere: [
      "La Debora fa la personal trainer qui. È più dura di me. E io ho fatto la naja a Merano.",
      "Il Bruno «il Toro» si allena qui. Solleva centoventi chili. Poi va al bar e non solleva il portafoglio.",
    ],
  },
  gennaro: {
    nome: 'Gennaro', ruolo: 'Il pizzaiolo. Napoletano trapiantato nella nebbia, canta per non piangere.',
    posti: [{ ore: [11, 24], interno: 'pizzeria', x: 2.8, z: 2.2 }],   // accanto al forno
    aspetto: { sprite: 'cuoco2', w: 17, h: 24, skin: '#e0a986', hair: '#2a2a2a', hairStyle: 'flat', shirt: '#f4f4f0', pants: '#f4f4f0', boots: '#222', mustache: '#2a2a2a', eyes: 'normal' },
    amicizia: [-20, 60, 10],
    saluti: [
      "Uè, Garonio! Margherita? Diavola? Una pizza con le pannocchie? No, quella no, mi rifiuto.",
      "♪ O sole mio... ♪ Qui il sole lo vedo a luglio, ma la pizza è buona tutto l'anno.",
    ],
    chiacchiere: [
      "Il Gigante una volta ha ordinato la pizza con la panna. Da allora il forno non è più lo stesso.",
      "La nebbia qua è così fitta che la pizza arriva al tavolo fredda. Anche se il tavolo è di fianco al forno.",
    ],
  },
  concetta: {
    nome: 'La Concetta', ruolo: 'Cameriera della pizzeria. Sa chi esce con chi prima che lo sappiano loro.',
    posti: [{ ore: [12, 15], interno: 'pizzeria', x: 7.6, z: 3.2 }, { ore: [18, 24], interno: 'pizzeria', x: 7.6, z: 3.2 }],
    aspetto: { sprite: 'cameriera2', w: 16, h: 23, skin: '#f0c8a8', hair: '#c8602a', hairStyle: 'long', shirt: '#1e1e24', pants: '#1e1e24', boots: '#222', eyes: 'normal' },
    amicizia: [-20, 50, 5],
    saluti: [
      "Tavolo per uno? Come sempre. Ti porto anche il menu, così fai finta di leggerlo.",
      "Ciao Garonio! Stasera c'è la Federica al tavolo due. No, non ti ho detto niente.",
    ],
    chiacchiere: [
      "Il Bepi viene qui solo a guardare dalla vetrina. Mai entrato. Dice che l'odore è gratis.",
      "Mancia? Sì, grazie. Anche un consiglio: non ordinare la pizza all'ananas davanti a Gennaro.",
    ],
  },
  kemal: {
    nome: 'Kemal', ruolo: 'Il kebabbaro della piazza. Aperto quando tutti gli altri dormono.',
    posti: [{ ore: [11, 24], interno: 'kebab', x: 3.3, z: 1.0 }],   // dietro al banco, vicino allo spiedo
    aspetto: { sprite: 'cameriere', w: 16, h: 23, skin: '#c89070', hair: '#1e1e1e', hairStyle: 'flat', shirt: '#f4f4f0', pants: '#1e1e24', boots: '#222', eyes: 'normal' },
    amicizia: [-20, 60, 10],
    saluti: [
      "Ciao amico! Kebab completo? Cipolla? Piccante? Con tuo padre che urla è già abbastanza piccante, eh?",
      "Garonio! Il mio cliente migliore dopo mezzanotte. Prima di mezzanotte sei il secondo, dopo il Tarcisio.",
    ],
    chiacchiere: [
      "Sono qui da vent'anni. Parlo il dialetto meglio del Bepi. Lui dice di no, in dialetto.",
      "La ricetta della salsa è segreta. Anche per me, la fa mia zia e non me la dice.",
    ],
  },
  ivan: {
    nome: 'Ivan', ruolo: 'Il garzone di Zeno. Cuffie in testa, chiave inglese in mano, testa altrove.',
    posti: [{ ore: [8, 18], interno: 'meccanico', x: 7.2, z: 4.3 }],
    aspetto: { sprite: 'garzone_cuffie', w: 16, h: 24, skin: '#e8b48a', hair: '#4a2a1a', hairStyle: 'flat', shirt: '#f4f4f0', overalls: '#2a4a8a', pants: '#2a4a8a', boots: '#222', eyes: 'normal' },
    amicizia: [-20, 50, 5],
    saluti: [
      "Eh? Cosa? Aspetta che mi tolgo le cuffie. ...Eh? Cosa?",
      "Zeno è di là. Se chiede, io stavo lavorando.",
    ],
    chiacchiere: [
      "Zeno dice che il ponte sollevatore è del '74. Io dico che è Zeno a essere del '74.",
      "Una volta ho cambiato le gomme alla Punto della Vigilessa. Al contrario. Non ditelo a nessuno.",
    ],
  },
};
