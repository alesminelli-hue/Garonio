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
// =====================================================================

export const MISSIONI = {
  semina: {
    testo: "Zappa e semina {n} zolle nel campo",
    stat: 'seminaCampo', quantita: [6, 10], scadenza: 17, paga: 25, xp: 10, peso: 2,
    stressFallimento: 30,
    richieste: [
      "Il campo nord è lì che aspetta da tre giorni. Zappa e semina {n} zolle entro le {ora}.",
      "Il mais non si pianta da solo, e nemmeno tu ti alzi da solo. Voglio {n} zolle seminate entro le {ora}.",
      "Oggi semina. {n} zolle nel campo grande, entro le {ora}. E dritte, non a zig-zag come l'altra volta.",
    ],
    consiglio: "Il campo è a nord, oltre la casa. Prima zappi, poi semini.",
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
    testo: "Zappa {n} zolle tra campo e orto",
    stat: 'zappate', quantita: [8, 14], scadenza: 13, paga: 20, xp: 8, peso: 1, daGiorno: 3,
    stressFallimento: 25,
    richieste: [
      "Prendi la zappa. Sì, quella cosa col manico che non hai mai visto. Voglio {n} zolle zappate entro le {ora}.",
      "La terra è dura come la tua testa. Zappa {n} zolle entro le {ora}, almeno una delle due si ammorbidisce.",
    ],
    consiglio: "Zappare stanca parecchio: in officina vendono una zappa affilata che fa faticare la metà.",
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
    testo: "Scaccia {n} nutrie dal campo",
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
    consiglio: "Le piante bagnate crescono. Ogni mattina tornano asciutte.",
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
    consiglio: "Quando la pianta è matura, raccoglila e portala alla cassa vicino a casa.",
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
