// =====================================================================
//  MISSIONI DEL GIGANTE
//  Questo file contiene solo testi e numeri: si può modificare senza
//  toccare il resto del gioco.
//
//  Segnaposto che il gioco sostituisce nei testi:
//    {n}        quantità richiesta          {ora}   scadenza (es. 12:00)
//    {missione} testo breve della missione  {fatto} quanto hai già fatto
//
//  Campi di ogni missione:
//    testo      cosa compare nel riquadro "Missione del Gigante"
//    stat       il contatore del giorno che la missione controlla
//    quantita   [minimo, massimo]: sale coi giorni
//    scadenza   ora entro cui finirla
//    paga, xp   ricompensa
//    peso       quanto spesso esce (più alto = più spesso)
//    daGiorno   primo giorno in cui può uscire
//    servePiante  quante piante devono esserci già (per annaffiare/raccogliere)
//    limite     'piante' o 'uova': non chiede più di quanto è possibile fare
//    stressFallimento  stress dato da Mister Mountain se fallisci (25-40)
//    richieste  come il Gigante la assegna la mattina (ne sceglie una)
//    consiglio  suggerimento pratico dopo la richiesta
//    successo   cosa dice il Gigante quando la finisci
//    rimprovero prima frase di Mister Mountain se la fallisci
//    stagione   'primavera' | 'estate' | 'autunno' | 'inverno' (o una lista): esce solo in quelle stagioni
//    serveAttrezzo  esce solo se Garonio ha quell'attrezzo del trattore (src/attrezzi.js)
//    serveMaiali    esce solo dopo che sono arrivati i maiali (src/maiali.js)
// =====================================================================

export const MISSIONI = {
  semina: {
    testo: "Ara e semina {n} zolle di mais col trattore",
    stat: 'seminaCampo', quantita: [6, 10], scadenza: 17, paga: 25, xp: 10, peso: 2, stagione: ['primavera', 'estate'],
    stressFallimento: 30,
    richieste: [
      "Il campo nord è lì che aspetta da tre giorni. Ara e semina {n} zolle entro le {ora}.",
      "Il mais non si pianta da solo, e nemmeno tu ti alzi da solo. Voglio {n} zolle seminate entro le {ora}.",
      "Oggi semina. {n} zolle nel campo grande, entro le {ora}. E dritte, non a zig-zag come l'altra volta.",
    ],
    consiglio: "Trattori sotto la tettoia, accanto al deposito: il rosso ha l'aratro, il verde la seminatrice. Il campo di mais è a nord: prima ari, poi semini.",
    successo: [
      "Le file sono storte, ma almeno ci sono. Hmpf.",
      "Seminato? Bene. Fra due mesi vediamo se è nato mais o vergogna.",
    ],
    rimprovero: [
      "Il campo è ancora nudo come un uovo sbucciato! Dov'erano i semi? In tasca tua?",
      "{fatto} zolle su {n}. Anche una gallina con la zappa faceva di più.",
    ],
  },

  zappa: {
    testo: "Ara col trattore o zappa nell'orto {n} zolle",
    stat: 'zappate', quantita: [8, 14], scadenza: 13, paga: 20, xp: 8, peso: 1, daGiorno: 3,
    stressFallimento: 25,
    richieste: [
      "Prendi la zappa. Sì, quella cosa col manico che non hai mai visto. Voglio {n} zolle zappate entro le {ora}.",
      "La terra è dura come la tua testa. Zappa {n} zolle entro le {ora}, almeno una delle due si ammorbidisce.",
    ],
    consiglio: "Nel campo grande si ara col trattore e l'aratro; nell'orto si zappa a mano. Contano tutte e due.",
    successo: [
      "Hai sudato? Fammi vedere. Oh, una goccia! Chiamo il giornale.",
      "Zappato. Visto che le braccia ce le hai anche tu?",
    ],
    rimprovero: [
      "La zappa era ancora appoggiata al muro con la ragnatela sopra! GARONIO!",
      "{fatto} zolle. {fatto}! Le talpe ne fanno di più e non le paga nessuno.",
    ],
  },

  orto: {
    testo: "Semina {n} piante di pomodoro nell'orto",
    stat: 'seminaOrto', quantita: [3, 6], scadenza: 15, paga: 18, xp: 8, peso: 1, daGiorno: 2,
    stressFallimento: 25,
    richieste: [
      "La mamma vuole i pomodori per il sugo della domenica. Semina {n} piante nell'orto entro le {ora}.",
      "Nell'orto ci sono più erbacce che pomodori. Semina {n} piante entro le {ora}, e non metterle sotto il fico che poi non crescono.",
    ],
    consiglio: "L'orto è vicino a casa, a sud. Zappa la terra prima di seminare.",
    successo: [
      "Pomodori seminati. La mamma ti ha perdonato per il 2017. Io no.",
      "Bravo. Se nascono, il primo sugo lo mangi tu. Se non nascono, pure.",
    ],
    rimprovero: [
      "Niente pomodori! Domenica la pasta la mangi in bianco, e la mamma piange!",
      "Nell'orto ci sono solo le tue impronte e una lattina di aranciata.",
    ],
  },

  uova: {
    testo: "Raccogli {n} uova al pollaio",
    stat: 'uova', quantita: [3, 5], scadenza: 12, paga: 15, xp: 10, peso: 2, limite: 'uova',
    stressFallimento: 25,
    richieste: [
      "Le galline hanno lavorato tutta la notte. Tu hai russato. Vai a prendere {n} uova entro le {ora}.",
      "Il fornaio vuole le uova fresche per le crostate. {n} uova entro le {ora}, senza romperle in tasca.",
      "Pollaio. {n} uova. Entro le {ora}. Non è difficile: le fanno loro, tu devi solo chinarti.",
    ],
    consiglio: "Le galline stanno nel pollaio. Dagli da mangiare alla mangiatoia e ne faranno di più.",
    successo: [
      "Uova arrivate. Le galline sono più puntuali di te, ma almeno oggi hai tenuto il passo.",
      "Hmpf. Neanche una rotta. Sei sicuro di essere mio figlio?",
    ],
    rimprovero: [
      "Le galline hanno fatto il loro lavoro. TU NO!",
      "Il fornaio ha fatto la crostata senza uova. È venuta una piadina triste. Per colpa tua.",
    ],
  },

  galline: {
    testo: "Dai da mangiare alle galline",
    stat: 'galline', quantita: [1, 1], scadenza: 10, paga: 10, xp: 6, peso: 1,
    stressFallimento: 25,
    richieste: [
      "Le galline stamattina mi guardavano male. Hanno fame. Riempi la mangiatoia entro le {ora}.",
      "Prima di tutto le galline: mangime nella mangiatoia entro le {ora}. Poi, se avanza, mangi anche tu.",
    ],
    consiglio: "La mangiatoia è dentro il recinto del pollaio. Galline sfamate fanno più uova oggi e domani.",
    successo: [
      "Le galline ringraziano. Io no, è il minimo.",
      "Brave bestie. E bravo anche tu, va. Ma poco.",
    ],
    rimprovero: [
      "Le galline sono venute a bussare alla porta di casa! Avevano FAME!",
      "Una gallina ha provato a mangiarsi il tuo cappello. Perché? Perché NON LE HAI DATO DA MANGIARE!",
    ],
  },

  nutrie: {
    testo: "Scaccia {n} nutrie (campo o fossi)",
    stat: 'nutrie', quantita: [2, 4], scadenza: 19, paga: 30, xp: 12, peso: 2,
    stressFallimento: 35,
    richieste: [
      "Stanotte ho sentito sgranocchiare. Le nutrie sono tornate. Scacciane {n} entro le {ora}.",
      "Il canale è pieno di nutrie che ridono di noi. Voglio {n} nutrie scacciate entro le {ora}. Fagli vedere chi comanda.",
      "Oggi fai la guardia al campo. {n} nutrie via entro le {ora}. E non metterti a dormire tra il mais, che ti scambiano per una di loro.",
    ],
    consiglio: "Le nutrie escono dal canale e puntano alle piante del campo. Avvicinati e scacciale.",
    successo: [
      "Le nutrie scappano. Ti hanno visto e hanno avuto paura. Capita anche a me ogni mattina.",
      "Bravo. Per stasera il campo è salvo. Le nutrie torneranno, come i tuoi debiti al bar.",
    ],
    rimprovero: [
      "Le nutrie hanno fatto festa nel campo e tu non eri invitato. Anzi, non c'eri proprio!",
      "Solo {fatto} nutrie scacciate! Le altre adesso pagano l'affitto?",
    ],
  },

  annaffia: {
    testo: "Annaffia {n} piante",
    stat: 'annaffiate', quantita: [4, 10], scadenza: 14, paga: 15, xp: 8, peso: 2, servePiante: 4, limite: 'piante',
    stressFallimento: 25,
    richieste: [
      "Non piove da una settimana e le piante hanno la lingua fuori. Annaffiane {n} entro le {ora}.",
      "Acqua alle piante: {n} entro le {ora}. L'acqua, Garonio. Non la birra.",
    ],
    consiglio: "L'orto si annaffia a mano; il campo di mais con la turbina sul trattore rosso, vicino all'acqua. Ogni mattina tornano asciutte.",
    successo: [
      "Piante annaffiate. Guarda come sono contente. Loro.",
      "Bene. Adesso bevi un bicchiere d'acqua anche tu, che hai la faccia secca.",
    ],
    rimprovero: [
      "Le piante sono più secche delle battute di tuo zio Ermes!",
      "Hai annaffiato {fatto} piante. Le altre si sono annaffiate da sole piangendo.",
    ],
  },

  raccolto: {
    testo: "Raccogli {n} tra pomodori e pannocchie",
    stat: 'raccolti', quantita: [2, 5], scadenza: 18, paga: 30, xp: 12, peso: 1, daGiorno: 3, servePiante: 2, limite: 'piante',
    stressFallimento: 30,
    richieste: [
      "È roba matura, Garonio. Come dovresti essere tu. Raccogline {n} entro le {ora}.",
      "Il raccolto non aspetta. {n} pezzi raccolti entro le {ora}, prima che ci pensino le nutrie.",
    ],
    consiglio: "Nell'orto raccogli a mano; nel campo serve la falciatrice sul trattore verde. Poi tutto alla cassa vicino a casa.",
    successo: [
      "Ecco, questo è lavoro vero. Una volta ogni tanto non fa male, eh?",
      "Raccolto fatto. Quasi quasi stasera ti offro un caffè. Quasi.",
    ],
    rimprovero: [
      "La roba è marcita sulla pianta! Marcita! Come la tua voglia di lavorare!",
      "Solo {fatto} raccolti. Il resto se lo sono presi le nutrie e ti hanno anche salutato.",
    ],
  },

  vendi: {
    testo: "Guadagna {n}€ vendendo alla cassa",
    stat: 'venduto', quantita: [15, 35], scadenza: 20, paga: 20, xp: 10, peso: 2,
    stressFallimento: 30,
    richieste: [
      "La bolletta della luce non si paga con i sogni. Voglio {n}€ di roba venduta entro le {ora}.",
      "Oggi si vende! Porta alla cassa roba per {n}€ entro le {ora}. Uova, pomodori, mais: tutto fa brodo.",
    ],
    consiglio: "La cassa di legno vicino alla porta di casa compra uova, pomodori e mais.",
    successo: [
      "Soldi in cassa! Per una volta i conti tornano. Non ci credo, li ricontrollo.",
      "Venduto. Visto che lavorare rende? Rende soprattutto a me, ma rende.",
    ],
    rimprovero: [
      "La cassa è più vuota del tuo frigorifero il lunedì!",
      "{fatto}€ su {n}! Con quei soldi non ci compri neanche una gomma da masticare usata!",
    ],
  },
};

// ---------------------------------------------------------------------
//  MISSIONI DELL'ANNATA (stagioni, attrezzi dei trattori, maiali)
// ---------------------------------------------------------------------
Object.assign(MISSIONI, {
  trebbia: {
    testo: "Trebbia {n} zolle di grano col trattore verde",
    stat: 'trebbiate', quantita: [20, 45], scadenza: 19, paga: 40, xp: 15, peso: 3, stagione: 'estate', serveAttrezzo: 'falciatrice',
    stressFallimento: 30,
    richieste: [
      "Il grano è giallo come i denti di Zeno. Si trebbia! {n} zolle entro le {ora}.",
      "Oggi trebbiatura. {n} zolle di grano entro le {ora}, e il cassone si scarica al fienile, non al bar.",
    ],
    consiglio: "Falciatrice sul trattore verde (tettoia). Campo del grano a ovest, accanto al fienile: lì si scarica il cassone.",
    successo: ["Trebbiato. Senti che profumo? È il profumo dei soldi. E della polvere.", "Bene. Il consorzio paga. Io incasso. Tu guardi."],
    rimprovero: ["Il grano è ancora in piedi! Sta lì, dorato, a ridere di noi!", "{fatto} zolle trebbiate. Le ha fatte il vento, il resto?"],
  },
  irriga: {
    testo: "Irriga {n} zolle con la turbina",
    stat: 'irrigate', quantita: [8, 20], scadenza: 15, paga: 30, xp: 12, peso: 2, stagione: ['primavera', 'estate'], serveAttrezzo: 'turbina', servePiante: 8, limite: 'piante',
    stressFallimento: 30,
    richieste: [
      "Il mais ha sete e tu hai la turbina. Fate amicizia. {n} zolle irrigate entro le {ora}.",
      "Irrigazione! {n} zolle bagnate entro le {ora}. Pesca dal canale, non dal pozzo dei vicini. Per oggi.",
    ],
    consiglio: "Turbina sul trattore rosso: spruzza da sola intorno al trattore quando sei vicino al canale o al laghetto.",
    successo: ["Il mais beve, tu sudi. Equilibrio perfetto.", "Bagnato tutto. Anche te, vedo."],
    rimprovero: ["Le piante hanno la lingua fuori e tu la turbina spenta!", "Solo {fatto} zolle bagnate. Il deserto avanza, Garonio."],
  },
  maiali: {
    testo: "Dai da mangiare ai maiali e pulisci i box",
    stat: 'maialiAccuditi', quantita: [2, 2], scadenza: 13, paga: 22, xp: 10, peso: 3, serveMaiali: true,
    stressFallimento: 30,
    richieste: [
      "I maiali hanno fame e i box puzzano fino a casa. Mangime e pala entro le {ora}.",
      "Capannone: mangime ai maiali e box puliti entro le {ora}. Se ti lamenti della puzza, pensa a loro che ci vivono.",
    ],
    consiglio: "Capannone dei maiali a est, oltre i silos. Il mangime si ordina lì se è finito.",
    successo: ["I maiali sono contenti. Più di me, ma meno di quanto meritano.", "Box puliti. Adesso lavati tu, però."],
    rimprovero: ["I maiali hanno urlato tutta la mattina! Si sentivano dal bar!", "Box sporchi, maiali affamati. Sembra camera tua."],
  },
  seminaGrano: {
    testo: "Ara e semina {n} zolle di grano per l'anno prossimo",
    stat: 'seminaGrano', quantita: [15, 35], scadenza: 18, paga: 35, xp: 14, peso: 3, stagione: 'autunno',
    stressFallimento: 30,
    richieste: [
      "Il grano dell'anno prossimo si semina adesso. {n} zolle nel campo del grano entro le {ora}. Prima ari le stoppie, poi semini.",
      "Autunno: si semina il grano. {n} zolle entro le {ora}. Pensa al futuro, Garonio. Lo so che è un concetto nuovo.",
    ],
    consiglio: "Campo del grano accanto al fienile: aratro per le stoppie, poi seminatrice. Serve la semente (Bubetto o tettoia).",
    successo: ["Seminato. Fra un anno mangiamo pane. Grazie a te. Quasi.", "Bene, il grano è sotto terra. Come le mie speranze, ma il grano spunta."],
    rimprovero: ["Il campo del grano è pieno di stoppie! L'anno prossimo cosa mangiamo, le stoppie?", "{fatto} zolle su {n}. Il pane quest'anno lo fai tu, con la farina immaginaria."],
  },
  raccoltaMais: {
    testo: "Raccogli {n} pannocchie con la falciatrice",
    stat: 'raccoltiMais', quantita: [10, 25], scadenza: 18, paga: 35, xp: 14, peso: 3, stagione: ['estate', 'autunno'], serveAttrezzo: 'falciatrice', servePiante: 10, limite: 'piante',
    stressFallimento: 30,
    richieste: [
      "Il mais è maturo e i cinghiali lo sanno. Raccogline {n} pannocchie prima di loro, entro le {ora}.",
      "Raccolto del mais: {n} pannocchie entro le {ora}. Falciatrice sul verde, cassone al fienile.",
    ],
    consiglio: "Falciatrice sul trattore verde. Il cassone si scarica al fienile: le pannocchie finiscono nello zaino, da vendere alla cassa.",
    successo: ["Pannocchie! Le guardo e mi commuovo. Poi le vendo.", "Raccolto. Le nutrie piangono, io no."],
    rimprovero: ["Il mais è ancora sulla pianta! Lo stai facendo invecchiare apposta?", "{fatto} pannocchie. Le altre le hanno prese i cinghiali, con la tua benedizione."],
  },
  salumificio: {
    testo: "Vendi {n} maiale al salumificio",
    stat: 'maialiVenduti', quantita: [1, 1], scadenza: 18, paga: 20, xp: 10, peso: 2, stagione: 'inverno', serveMaiali: true,
    stressFallimento: 25,
    richieste: [
      "È inverno, Garonio. Lo sai cosa vuol dire. Un maiale al salumificio entro le {ora}. Scegli tu, io non ce la faccio.",
      "Il salumificio aspetta. Uno dei maiali grassi, entro le {ora}. Non dare nomi ai maiali, te l'avevo detto.",
    ],
    consiglio: "Dal capannone dei maiali: «Vendi un maiale al salumificio». D'inverno pagano di più.",
    successo: ["Fatto. Non ne parliamo più. A Natale però il cotechino lo mangi.", "Bravo. Il salumificio paga bene. Il maiale un po' meno contento."],
    rimprovero: ["Il camion del salumificio è ripartito vuoto! Vuoto!", "Il salumificio ha chiamato. Due volte. Ha chiesto se sei vivo."],
  },
  manutenzione: {
    testo: "Manutenzione: pieno di gasolio o un attrezzo riparato",
    stat: 'manutenzione', quantita: [1, 1], scadenza: 17, paga: 18, xp: 8, peso: 2, stagione: ['autunno', 'inverno'],
    stressFallimento: 25,
    richieste: [
      "D'inverno i mezzi si sistemano. Pieno di gasolio ai trattori o un attrezzo da Zeno, entro le {ora}.",
      "I trattori hanno sete e gli attrezzi cigolano. Sistema qualcosa entro le {ora}.",
    ],
    consiglio: "Cisterna del gasolio sotto la tettoia, accanto al deposito. Le riparazioni degli attrezzi le fa Zeno.",
    successo: ["Mezzi sistemati. Zeno ti ha fregato? Sì. Ma meno del solito.", "Bene. Un trattore con il pieno è un trattore felice."],
    rimprovero: ["Il trattore è a secco e tu sei al bar. Indovina chi arriva?", "Niente manutenzione. A primavera si rompe tutto e la colpa è tua."],
  },
});

// Missioni fisse dei primi giorni (il tutorial). Dopo si sceglie a caso.
export const MISSIONI_FISSE = {
  1: { id: 'semina', n: 6 },
  2: { id: 'uova' },
};

// Saluti del Gigante prima della richiesta (ne sceglie uno a caso).
export const SALUTI_GIGANTE = [
  "Sveglia, scansafatiche!",
  "Ancora a letto? Fuori!",
  "Oggi niente scuse.",
  "Il sole è su da un pezzo. Tu no.",
  "Buongiorno. Cioè, buongiorno per me: per te è giorno di lavoro.",
  "Il gallo ha cantato tre volte. Alla quarta ti tiro il secchio.",
  "Ti ho portato il caffè. Scherzo. Alzati.",
];
