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
//  sulleRagazze: frasi quando Garonio esce con una delle ragazze ({ragazza} = il suo nome). Una voce può essere
//         { solo: ['id'], t } o { tranne: ['id'], t } per le frasi che valgono solo per certe ragazze.
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
      "Tesoro, ti ho messo la maglia della salute nello zaino. No, non è da bambini. Sì, la metti.",
      "Sei tornato! Siediti. No, prima lavati le mani. No, prima togli gli stivali. Ecco, adesso siediti.",
      "Hai la faccia di uno che ha litigato con una nutria. Chi ha vinto? Non dirmelo.",
      "Ti ho fatto i tortelli. Quelli di zucca. Tuo padre dice che sono troppi. Tuo padre ne ha mangiati quaranta.",
      "Amore di mamma! Sei dimagrito. Non è vero, ma lo dico lo stesso.",
      "C'è il minestrone. C'era anche ieri. Ci sarà anche domani. È un minestrone di famiglia.",
    ],
    chiacchiere: [
      "Quando eri piccolo dicevi che da grande volevi fare il gatto. Dormivi già tanto.",
      "La Pina dice cose su di te in paese. Io le dico che sei un bravo ragazzo. Poi vado a casa e prego.",
      "In cantina sparisce il salame. Sarà il gatto. Abbiamo un gatto? No. Allora non so.",
      "Tuo padre da giovane era magro e romantico. Poi ha scoperto i trattori.",
      "Ho acceso un cero a Sant'Isidoro per il raccolto. E uno a Sant'Antonio per te. Il tuo era più grosso.",
      "La Rina mi ha detto che ti ha visto dormire sulla Vespa. In movimento? Dimmi di no.",
      "Quando sei nato pesavi cinque chili. L'ostetrica ha detto \"questo farà il contadino\". Sbagliava, ma era gentile.",
      "Ho lavato la tuta. Era in piedi da sola. Ora si è seduta.",
      "Il telefono di casa ha suonato. Era Mister Mountain. Gli ho detto che eri a messa. Ha riso. Anch'io.",
      "Tuo padre urla perché ti vuole bene. Poi urla anche perché non hai fatto niente. Sono due urla diverse.",
    ],
    sulleRagazze: [
      "Tesoro, mi hanno detto della {ragazza}. Portala a pranzo domenica. No, non sto già comprando il vestito.",
      "Una ragazza! Finalmente! Pensavo che volessi sposare la Vespa.",
      "Mi raccomando, trattala bene. E fatti trattare bene. E porta il casco.",
      "La Pina dice che hai una fidanzata. Le ho detto che è una bugia. Poi sono andata a pregare che non lo fosse.",
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
      "Ti do un consiglio gratis. Il prossimo costa. Il terzo costa doppio. Il quarto è un abbonamento.",
      "Lo vedi quel lampione? Lì sotto ho trovato cinquanta euro nel 2017. Da allora lo controllo ogni giorno.",
      "Io e te siamo una squadra. Io penso, tu fai. Io incasso il dieci per cento. È il mercato.",
    ],
    chiacchiere: [
      "Mai fidarsi di un meccanico che fischietta. Zeno fischietta sempre.",
      "Mio cugino ha preso in pieno la cabina della corrente e ha trovato... no, lascia stare.",
      "La Vigilessa fa il giro della piazza come un orologio svizzero. Svizzero di Codogno.",
      "Ho un'intuizione. Me ne vengono tre al giorno. Una volta all'anno una funziona.",
      "Garonio, diversifica. Non mettere tutte le nutrie nello stesso fosso.",
      "Il segreto è il networking. Io parlo con tutti. Nessuno mi risponde, ma io parlo.",
    ],
    sulleRagazze: [
      "Te lo dico da professionista: la red pill non è una pillola. È un percorso. Da dieci euro a seduta.",
      "La {ragazza}? Ottimo investimento sentimentale. Rischio alto, rendimento incerto. Come le cripto-nutrie.",
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
      "Garonio. Caffè, bianchino o lamentela? La lamentela costa uguale.",
      "Siediti dove vuoi. Tranne lì. E lì. Lì c'è il Tarcisio da trent'anni.",
      "Non dirmi niente. Tuo padre. Lo so. Te lo faccio doppio.",
      "Oh, il mio cliente che ordina un caffè e occupa il tavolo tre ore. Ben arrivato.",
      "Mi hai portato il fango fino al bancone. Bravo. Adesso lo lucidi.",
      "Garonio! Ti stavo aspettando. Cioè no. Ma dillo in giro che ti aspettavo, fa atmosfera.",
    ],
    chiacchiere: [
      "Le regole del bar sono tre: si paga, non si sputa, e le risse si fanno fuori. La terza è più un consiglio.",
      "Tarcisio ha il conto aperto dal 1987. Ormai è un monumento.",
      "Il Consulente beve un caffè all'ora. Non so che lavoro faccia, ma lo fa sveglio.",
      "In questo bar ne ho viste di tutti i colori. Il marrone è il più frequente. È il colore del Tarcisio.",
      "Il Consulente mi ha proposto un investimento. Gli ho proposto di pagare i caffè di marzo.",
      "Dietro il bancone ho un quaderno. Ci sono scritti tutti i debiti del paese. Si chiama \"La Bibbia\".",
      "Mi chiedono perché non mi sposo. Ho già il bar: è un marito che non russa e chiude alle due.",
      "Il Bruno \"il Toro\" si è commosso guardando un film di cani. Non l'hai sentito da me.",
      "Il biliardo pende a sinistra dal 1994. Chi gioca bene lo sa. Chi gioca male dà la colpa a me.",
      "Le risse fuori, le scommesse dentro, i segreti dietro al bancone. Ognuno al suo posto.",
    ],
    sulleRagazze: [
      "Ho saputo della {ragazza}. Brava ragazza. Troppo, per te. Ma brava.",
      "Se la porti qui ti offro il primo giro. Il secondo lo paghi doppio, è la tassa sulla felicità.",
      "L'amore va e viene. Il conto resta. Ricordatelo.",
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
      "La Vespa? Ha bisogno di una cosa sola: un altro proprietario.",
      "Ti cambio l'olio, ti controllo i freni e ti do un consiglio: comprati una bicicletta.",
      "Ho riparato il camion della Ilenia in un'ora. Il tuo in tre giorni. Sai perché? Lei mi porta le paste.",
    ],
    chiacchiere: [
      "Il prezzo è quello. Se non ti va, ripara da solo. Con cosa, con le mani?",
      "Tuo padre mi deve ancora i soldi del '98. Li aggiungo al tuo conto, così si pareggia.",
      "Fischiettare? Io? Mai. ♪ fiu fiu ♪",
      "Il preventivo è questo. Sì, il numero è giusto. No, non ci sono troppi zeri. Sono gli zeri della tua tranquillità.",
      "Tuo padre una volta mi ha portato il trattore con dentro una nutria. Viva. Al motore. Gliel'ho messa in conto.",
      "Fischiettare? Io fischio solo quando i conti tornano. ♪ fiu fiu ♪ Ecco.",
    ],
    sulleRagazze: [
      "Porti a spasso la {ragazza} con la Vespa? Coraggiosa. Le faccio una polizza.",
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
      "Ho una cosa per te. Non sai cos'è, io nemmeno. Ma costa.",
      "Scontrino? Per cosa? Per la fiducia non si fa lo scontrino.",
      "Il Nando delle pentole è mio fornitore. Io sono il suo. Ci compriamo e vendiamo le stesse cose da vent'anni.",
    ],
    chiacchiere: [
      "Questa giacca? Era di un sindaco. Di quale paese non lo so.",
      "Se mi porti code di ratto ti pago. Cosa ci faccio? Affari miei.",
      "Mister Frank mi deve dei soldi. Tutti mi devono dei soldi. Io invece no.",
      "Questo cappello era di un generale. O di un capostazione. Comunque uno che comandava.",
      "Hai visto la mia nuova collezione? Sono le stesse cose di ieri, spostate a destra.",
    ],
    sulleRagazze: [
      "Ti serve un regalo per la {ragazza}? Ho un mazzo di fiori di plastica. Durano per sempre. Come l'amore. Quasi.",
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
      "Garonio. Ti tengo d'occhio. Anche quando non ti guardo. Soprattutto allora.",
      "Il casco. Sulla Vespa ci vuole il casco. Anche quando è spenta. Sì, è una regola mia.",
      "Buongiorno. Ho il blocchetto nuovo. Profuma ancora di carta. Vuoi essere il primo?",
      "Hai parcheggiato il trattore in diagonale. Il diagonale non esiste. Esiste il parallelo e la multa.",
      "Fermo dove sei. ...Niente, volevo vedere se ti fermavi.",
      "Garonio. Hai lo sguardo di chi sta per urtare un paracarro. Lo sento.",
    ],
    chiacchiere: [
      "Non accetto caffè, regali o pannocchie. Le pannocchie meno di tutto.",
      "Ho multato anche mia madre. Due volte. La seconda era recidiva.",
      "La piazza è zona pedonale. Anche per i trattori. SOPRATTUTTO per i trattori.",
      "Una volta ho multato un'ambulanza. Aveva la sirena troppo alta. Il ricorso l'ho vinto io.",
      "Il Bepi attraversa fuori dalle strisce da quarant'anni. Ogni volta gli dico qualcosa. Ogni volta mi dice \"bondì\".",
      "Ho un sogno: un paese dove nessuno parcheggia sul marciapiede. Si chiama Svizzera. Non ci vado, perché lì non servo.",
      "Il Conte non paga le multe da quando c'era la lira. Dice che è un \"privilegio feudale\". Il pignoramento sarà feudale anche lui.",
      "Mi piace la nebbia. Nessuno vede niente, ma io sento tutto. Soprattutto i clacson abusivi.",
      "Il fischietto me l'ha regalato mio padre. Era vigile. Anche mio nonno. Anche la mia bisnonna, in un certo senso.",
    ],
    sulleRagazze: [
      "Ho visto la {ragazza} salire sulla tua Vespa. Col casco? Senza? Rispondi con calma, ti sto scrivendo.",
      "L'amore non dà diritto a parcheggiare davanti al passo carraio. Nemmeno quello vero.",
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
      "Oggi ho parlato con una patata per un'ora. Non ha detto niente, ma mi ha ascoltato. Come la mamma.",
      "Sai cos'è un gnocco? È una patata che ce l'ha fatta.",
      "Quando sarò vecchio voglio una casa a forma di patata. Rotonda, calda, con i bitorzoli.",
    ],
    chiacchiere: [
      "Tuo papà mi ha chiesto in prestito la turbina. Nel 2009. La sto ancora aspettando.",
      "Mia mamma dice che sono rotondo come una patata. È un complimento, credo.",
      "Fritte, lesse, al forno. La patata non giudica. La patata accoglie.",
      "Garonio, sei felice? Io sì. Ho mangiato una patata. Due, veramente.",
      "Il Bollito ha scavato una buca. Dentro c'erano patate. Era la mia dispensa. Bravo Bollito.",
    ],
    sulleRagazze: [
      "La {ragazza}? Ma le piacciono le patate? Se no, non è amore. È amicizia.",
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
      "Una cartolina per te! Da Rimini. Dice \"Ciao Garonio, ti penso\". Non è firmata. Ho una teoria. Anzi, tre.",
      "La Pina ha ricevuto quattro pacchi questa settimana. Tutti da un certo \"Ufficio Pettegolezzi\". Scherzo. Ma chissà.",
      "Il Francobollo, il mio cane, ha morso il Geometra. Era una lettera di reclamo. Gliel'ha resa più breve.",
    ],
    chiacchiere: [
      "Con la Pina? Ma chi l'ha detto? ...Chi l'ha detto?",
      "Mister Frank riceve pacchi dall'America. Dentro ci sono stivali. Sempre stivali.",
      "Il geometra Ballarin ha scritto al comune per le tue file storte. Ho la copia, se vuoi.",
      "Ho consegnato una raccomandata al Conte. Ha firmato con lo stemma di famiglia. Su una ricevuta del supermercato.",
      "Mister Mountain spedisce lettere a tuo padre ogni lunedì. Le buste sono sempre più spesse. Non le apro. Le peso.",
    ],
    sulleRagazze: [
      "Hai ricevuto una lettera profumata. Non te la do finché non mi dici chi è. Ah, la {ragazza}. Lo sapevo già.",
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
      "Howdy, partner! Oggi c'è il sole. In Texas c'è sempre il sole. Qui c'è la nebbia, ma io me lo immagino.",
      "Il mio horse Thunder ha bevuto il gasolio sbagliato. Adesso è un pony.",
      "Il mio pozzo è così profondo che una volta ho sentito parlare in cinese. Era la radio del Kevin.",
    ],
    chiacchiere: [
      "Il mio pozzo è il più profondo della county. Non toccarlo, eh!",
      "Il trattore? No no, quello è il mio horse. Si chiama Thunder.",
      "In America le pannocchie sono grandi così. Io in America non ci sono mai stato, ma lo so.",
      "Ho comprato un cappello nuovo. Texano. Fatto a Carpi. Il migliore.",
      "In America mi chiamerebbero \"Big Frank\". Qui mi chiamano \"il Franco di Sorbolo\". Non hanno visione.",
    ],
    sulleRagazze: [
      "A girlfriend? Good job, boy! Portala al ranch, facciamo il barbecue. Il barbecue è una griglia del Bubetto.",
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
      "Figliolo, ti benedico. Ma non contarci troppo, la benedizione non ara il campo.",
      "Ho la chiave del campanile. Non per niente: ci vado a sentire la radiolina quando c'è la partita.",
      "In confessionale ho sentito cose che Mister Mountain si sogna. Una riguardava lui.",
    ],
    chiacchiere: [
      "Il Signore perdona tutto. Il Gigante no, ma il Signore sì.",
      "La Pina viene a confessarsi tutti i giorni. Non per i suoi peccati: per raccontarmi quelli degli altri.",
      "Il campanile pende un po'. Il geometra Ballarin dice che è artistico.",
      "La messa delle undici dura quaranta minuti. Quella delle dieci, se gioca il Milan, venticinque.",
      "Le offerte sono calate. La gente dice che non ha soldi. Poi li vedo tutti al Night. Il Signore vede. E anch'io, dalla finestra.",
      "La Balerion all'organo è un dono di Dio. Un po' rumoroso, ma un dono.",
    ],
    sulleRagazze: [
      "Ho saputo della {ragazza}. Se diventa una cosa seria, il matrimonio te lo faccio io. Sconto famiglia, ma niente Gigi D'Agostino in chiesa.",
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
      "Garonio. Il segno della croce si fa dall'alto in basso. Non a caso, come stai facendo tu.",
      "Ti ho visto. Non ho detto cosa. Ma ti ho visto.",
      "Benvenuto nella casa del Signore. Pulisciti i piedi, che il Signore il pavimento non lo lava. Io sì.",
      "Hai l'aria di uno che deve confessarsi da sei anni. Don Peppino è libero. Porta da mangiare, sarà lunga.",
      "Ciao, Garonio. Da piccolo hai rubato le ostie non consacrate. Erano per la messa. Me lo ricordo ancora.",
    ],
    chiacchiere: [
      "Il vino della messa è contato. Lo so io quante bottiglie ci sono. E anche Don Peppino lo sa, purtroppo.",
      "Facevo catechismo a tuo padre. Era già grosso a nove anni. E già non ascoltava.",
      "La bacchetta? Non la uso più. La tengo per fare scena. Funziona meglio così.",
      "Ho insegnato catechismo a mezzo paese. L'altra metà era peggio.",
      "Don Peppino dice le messe in quaranta minuti quando gioca il Milan. Il Signore capisce. Io meno.",
      "Le candele costano cinquanta centesimi. Chi le accende senza pagare, il Signore lo vede. E poi lo vedo io in sagrestia.",
      "La Pina si confessa ogni giorno. Una volta ha confessato i peccati della Sciura Ines. Per errore, dice.",
      "Balerion l'organista ha un tatuaggio. Dice che è un santo. Io non conosco santi con la cresta.",
    ],
    sulleRagazze: [
      "Ho saputo della {ragazza}. Prega per lei. Ne ha bisogno, se sta con te.",
      "Fidanzarsi è una cosa seria, Garonio. Si comincia con un gelato e si finisce a fare i tortelli per trenta persone.",
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
      "Lei viene dalla zappa, io dal sangue blu. Ci incontriamo a metà: il debito.",
      "Mi hanno offerto di trasformare il castello in un bed and breakfast. Ho rifiutato. Poi ho visto la bolletta. Sto riconsiderando.",
      "Il mio antenato faceva giustizia sulle sue terre. Io faccio la raccolta differenziata. I tempi cambiano.",
    ],
    chiacchiere: [
      "Il mio trisavolo ha combattuto a Solferino. Dalla parte sbagliata, ma con eleganza.",
      "Il castello ha quarantadue stanze. Ne riscaldo una. Le altre le riscalda la mia dignità.",
      "Ho venduto gli affreschi per rifare il tetto. Ora piove sugli affreschi del vicino.",
      "Ho un albero genealogico di sei secoli. Ho anche un albero vero in giardino. È morto. Ma rimane nobile.",
      "Ambrogio! Il tè! ...Ah, già. Ambrogio! L'acqua calda!",
    ],
    sulleRagazze: [
      { solo: ['ludovica'], t: "Lei corteggia mia nipote? Bene. Il tetto è da rifare, la dote è un dipinto e i debiti sono di famiglia. Benvenuto." },
      { tranne: ['ludovica'], t: "Ho saputo della {ragazza}. Peccato. Mia nipote ha detto \"chi se ne importa\" con un tono molto nobile." },
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
      "Il signor Conte la riceverà. Dopo il riposino delle dieci, quello delle undici e quello delle dodici.",
      "Ho lucidato l'argenteria. Tutta e due le forchette.",
      "Il fantasma della torre? Sono io. Ci vado a fumare.",
    ],
    chiacchiere: [
      "Nelle segrete c'è un forziere. Il signor Conte dice che è vuoto. Il signor Conte dice tante cose.",
      "Lucido le armature ogni martedì. Quella a destra, una volta, mi ha risposto.",
      "Si accomodi in salotto. Non su quella poltrona: è del Seicento. Neanche su quella: è dell'Ikea, ma ci tiene.",
      "In questa famiglia servo da tre generazioni. Mi pagano in titoli nobiliari. Sono il Barone del Ripostiglio.",
    ],
    sulleRagazze: [
      { solo: ['ludovica'], t: "La signorina Ludovica le sorride. Non succedeva dal 2009. Il signor Conte ha chiesto se lei è ricco." },
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
      "Mal di testa? Ho tre scatole: quella che funziona, quella che costa e quella che funziona e costa.",
      "Questo sciroppo è alla fragola. Non cura niente, ma la fragola è buona.",
      "Ho una crema per ogni cosa. Anche per i calli da trattore. Si chiama \"Pedale\".",
    ],
    chiacchiere: [
      "Il Bubetto vende la pomata del veterinario. Io vendo quella per le persone. Il tubetto è lo stesso, il prezzo no.",
      "Mister Mountain compra l'antiacido a scatoloni. Si vede che anche lui ha un capo.",
      "Il Gigante è venuto a comprare le gocce per dormire. Per te, ha detto. Le hai prese tu, quindi?",
      "Lo sai che ogni anno vendo più antiacido a Mister Mountain che caramelle ai bambini?",
    ],
    sulleRagazze: [
      { solo: ['noemi'], t: "La Noemi mi ha detto di te. Ti consiglio le vitamine. Per stare dietro a lei, servono." },
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
      "Respira. Non respirare. Respira. Ecco, sei vivo. Venti euro.",
      "Il segreto della salute è camminare, dormire e non lavorare per Mister Mountain. Due su tre li hai.",
      "Il certificato? Ti do quello che posso: \"il paziente è stanco\". L'ultima volta tuo padre l'ha usato per accendere il camino.",
    ],
    chiacchiere: [
      "Il certificato per non lavorare? A te? Tuo padre mi aspetta sotto casa col forcone.",
      "Il veterinario e io abbiamo studiato insieme. Lui ha scelto le mucche perché non si lamentano.",
      "Hai qualcosa, ma non so cosa. Torna tra una settimana: o passa, o lo scopriamo.",
      "Ho studiato a Pavia. Sei anni. Per sentirmi dire dal Tarcisio \"secondo me è il fegato\". Ha ragione, ma comunque.",
    ],
    sulleRagazze: [
      { solo: ['noemi'], t: "Esci con la mia infermiera? Bene. Se la fai piangere, la visita costa il triplo." },
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
      "Siediti. Non lì, lì si siede la Sciura Ines. Sì, anche quando non c'è.",
      "Nome, cognome, sintomi, colpe. In quest'ordine.",
      "Hai un aspetto terribile. Benvenuto, sei nel posto giusto.",
      "Il dottore ti riceve tra dieci minuti. I dieci minuti dello studio medico, cioè un'ora.",
      "Se è per il certificato, no. Se è per la nutria, sì. Se è per il Gigante, non abbiamo la cura.",
    ],
    chiacchiere: [
      "La Sciura Ines viene ogni mattina. Non è malata: qui c'è il riscaldamento.",
      "Ho fatto più punture io che le zanzare del laghetto.",
      "Trent'anni di servizio. Ho visto nascere mezzo paese e ho tolto un amo dal sedere all'altra metà.",
      "La Noemi è brava, ma troppo dolce. I pazienti vanno trattati come i polli: con amore e fermezza.",
      "Il Tarcisio fa le analisi ogni anno. Ogni anno il laboratorio ci chiama per chiedere se è vivo.",
      "Il Dottor Mutua ha mani d'oro. È un peccato che le usi soprattutto per firmare.",
      "La sala d'attesa è il vero centro del paese. Qui si sa tutto prima del Postino.",
      "Il termometro è sempre giusto. Sono i pazienti che sbagliano la febbre.",
    ],
    sulleRagazze: [
      "La {ragazza}? Contenta lei. Fai le analisi, comunque. Così, per sicurezza.",
      "In sala d'attesa non si parla d'altro. Il Walter ha fatto una scommessa. Io ho puntato cinque euro.",
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
      "Recluta! La pancia dentro! ...Quella è la pancia dentro? Mamma mia.",
      "Il riscaldamento? Al fronte ci scaldavamo coi sassi. Ok, non c'ero al fronte. Ma ci sarei stato bene.",
      "La Tamara mi ha rotto il sacco da boxe nuovo. Il terzo. Le voglio bene come una figlia che ti rompe i sacchi.",
    ],
    chiacchiere: [
      "La Blu Belga fa la personal trainer qui. È più dura di me. E io ho fatto la naja a Merano.",
      "Il Bruno «il Toro» si allena qui. Solleva centoventi chili. Poi va al bar e non solleva il portafoglio.",
      "Al militare mi chiamavano \"il Mulo\". Perché ero forte. E perché non capivo le domande.",
      "Uno! Due! Uno! Due! ...Garonio, siamo ancora all'uno. Sei fermo all'uno da dieci minuti.",
    ],
    sulleRagazze: [
      { solo: ['debora', 'tamara'], t: "Esci con una delle mie istruttrici? Fai cento addominali. Ti serviranno. Per non piangere quando ti lascia." },
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
      "Uè, Garonio! Stasera pizza speciale: la \"Nebbiolina\". Mozzarella, panna e malinconia.",
      "♪ Funiculì funiculà... ♪ Qua non ci stanno le funicolari. Ci stanno i trattori. Pure loro salgono piano.",
      "Il forno l'ho portato da Napoli in pezzi. Sulla Panda di mio cugino. Ci abbiamo messo tre giorni e una multa della Vigilessa.",
    ],
    chiacchiere: [
      "Il Gigante una volta ha ordinato la pizza con la panna. Da allora il forno non è più lo stesso.",
      "La nebbia qua è così fitta che la pizza arriva al tavolo fredda. Anche se il tavolo è di fianco al forno.",
      "A Napoli la pizza è arte. Qui è sopravvivenza. Ma sempre arte.",
      "Mi hanno chiesto la pizza col cotechino. Ci ho pensato. Ci ho pensato tanto. Poi ho pianto.",
    ],
    sulleRagazze: [
      "Stasera porti la {ragazza}? Ti faccio la pizza a forma di cuore. Se va male, la tagliamo a metà.",
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
      "Garonio! Tavolo vicino al forno? Così almeno hai caldo, se l'appuntamento va male.",
      "La margherita? Lo so già. Il menu te lo porto lo stesso, ti piace sfogliarlo.",
      "Ciao! Stasera Gennaro è di buon umore. Ha cantato tre canzoni prima delle otto. Pessimo segno per la pasta.",
      "Siediti. Ti porto l'acqua. Naturale. Quella frizzante la danno solo a chi lascia la mancia.",
      "Ancora tu? Ti devo mettere il nome sul tavolo, come al Tarcisio al bar.",
    ],
    chiacchiere: [
      "Il Bepi viene qui solo a guardare dalla vetrina. Mai entrato. Dice che l'odore è gratis.",
      "Mancia? Sì, grazie. Anche un consiglio: non ordinare la pizza all'ananas davanti a Gennaro.",
      "Ho visto passare più coppie io che il prete. E le ho viste lasciarsi tutte qui, al tavolo sette. Porta sfortuna.",
      "Gennaro canta \"O sole mio\" mentre fa la pizza. Quando canta \"Malafemmena\" è meglio non ordinare.",
      "Il Commendatore viene ogni giovedì e ordina sempre la stessa cosa. E ogni volta chiede se è cambiata.",
      "Se mi chiedi un tavolo per due, lo so prima di tutti. Poi lo sa la Pina. Poi il mondo.",
      "La pizza all'ananas l'ha ordinata solo un turista tedesco. Gennaro l'ha accompagnato al confine. Di Codogno.",
    ],
    sulleRagazze: [
      "Stasera tavolo per due? Ti preparo quello buono. Quello che non traballa.",
      "La {ragazza} è venuta qui ieri con le amiche. Hanno parlato di te. Non tutto male. Quasi.",
      "Se le cose vanno bene, ordina il tiramisù per due. Se vanno male, ordina il conto per uno.",
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
      "Garonio! Kebab per uno o per due? Ah, per uno. Cipolla extra, allora. Tanto non baci nessuno.",
      "La salsa piccante è così piccante che il Bruno \"il Toro\" ha chiamato la mamma.",
      "Mi hanno chiesto il kebab vegano. Gli ho dato una piadina con l'insalata e lo sguardo triste.",
    ],
    chiacchiere: [
      "Sono qui da vent'anni. Parlo il dialetto meglio del Bepi. Lui dice di no, in dialetto.",
      "La ricetta della salsa è segreta. Anche per me, la fa mia zia e non me la dice.",
      "Il mio kebab è il migliore della Bassa. È anche l'unico. Ma il migliore.",
      "Di notte vengono tutti da me. Il Moreno, il Tarcisio, il Sergente. Il Sergente piange nella piadina, ma paga.",
    ],
    sulleRagazze: [
      { solo: ['tamara'], t: "La Tamara ha mangiato tre kebab e ha detto \"il mio uomo paga\". Tu sei il suo uomo? Sono quarantadue euro." },
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
      "Zeno mi ha detto di fare l'inventario. Ho contato le viti. Sono tante. Fine dell'inventario.",
      "Ehi, la tua Vespa fa un rumore strano. Ah, no, sono le mie cuffie.",
      "Se mi chiedi un consiglio: ascolta la trap. Le macchine vanno meglio con la trap.",
    ],
    chiacchiere: [
      "Zeno dice che il ponte sollevatore è del '74. Io dico che è Zeno a essere del '74.",
      "Una volta ho cambiato le gomme alla Punto della Vigilessa. Al contrario. Non ditelo a nessuno.",
      "Sto facendo un corso online di meccanica. Siamo alla lezione due. Da otto mesi.",
      "Il ponte sollevatore cigola. Zeno dice che è il ponte. Io dico che è la sua schiena.",
    ],
  },
};
