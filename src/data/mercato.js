// Dati del mercato del giovedì (src/mercato.js), delle gare di trattori (src/gare.js)
// e delle scommesse del Consulente (src/scommesse.js). Testi e numeri facili da ritoccare.

export const GIORNI = ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'];
// il giorno 1 è un lunedì: il giovedì è il giorno 4, 11, 18...
export const giornoSettimana = day => (day - 1) % 7;
export const nomeGiorno = day => GIORNI[giornoSettimana(day)];

// ===================================================================
// MERCATO DEL GIOVEDÌ
// ===================================================================
export const MERCATO = {
  giorno: 3,                   // 0 = lunedì ... 3 = giovedì
  ore: [7, 13],                // aperto dalle 7 alle 13
  // piazzola davanti al municipio, a sud della provinciale
  area: { x0: 23.5, z0: 59.2, x1: 42.5, z1: 65.2 },
  cartello: { x: 22.6, z: 59.4, testo: 'MERCATO GIOVEDÌ' },
  saturazione: 0.04,           // ogni pezzo venduto allo stesso banco abbassa il prezzo del 4%...
  saturazioneMin: 0.55,        // ...fino al 55%
  oscillazione: [0.7, 1.9],    // il prezzo della settimana va dal 70% al 190% del prezzo della cassa
  trattativa: { riuscita: 0.45, bonusParlantina: 0.25, su: 0.25, giu: 0.15 },

  // prodotti: prezzo base (quello della cassa) e chi li compra
  prodotti: {
    uova: { nome: 'uova', base: 3, icona: '🥚' },
    pomodoro: { nome: 'pomodori', base: 6, icona: '🍅' },
    patata: { nome: 'patate', base: 4, icona: '🥔' },
    mais: { nome: 'pannocchie', base: 10, icona: '🌽' },
    salame: { nome: 'salami', base: 20, icona: '🥓' },
  },

  // il salame: lo lascia il commerciante quando vendi un maiale (come da tradizione)
  salame: { nome: 'Salame nostrano', icona: '🥓', effetto: { health: 25 }, combattimento: 'self', vendita: 20 },
  salamiPerMaiale: [1, 2],
  salameRegalo: "Il camion riparte. L'autista si sporge: «Questi sono per voi, come da tradizione.» Ti lascia {n} salam{i} nostran{i}. Al mercato del giovedì valgono oro.",

  // notizie della settimana: spingono un prodotto su (o giù). Scelta a caso ogni settimana.
  notizie: [
    { su: 'pomodoro', testo: "Grandinata in Romagna: i pomodori sono spariti dai banchi. La Rina li paga a peso d'oro." },
    { su: 'uova', testo: "Arriva Pasqua (dice Ottavio, che non guarda il calendario dal '92): le uova vanno a ruba." },
    { su: 'mais', testo: "Il mangimificio di Cremona ha finito il mais. Il Sor Bortolo ha l'acquolina." },
    { su: 'salame', testo: "C'è la sagra del salame a Zibello e Gilberto ha venduto tutto. Ne cerca disperatamente." },
    { su: 'patata', testo: "Una trasmissione in TV ha detto che la patata allunga la vita. Tutto il paese vuole patate." },
    { giu: 'pomodoro', testo: "Sono arrivati i pomodori spagnoli a camion. La Rina piange e abbassa i prezzi." },
    { giu: 'uova', testo: "Le galline di tutta la provincia hanno deciso di fare gli straordinari. Uova ovunque." },
    { giu: 'mais', testo: "Raccolto record di mais in tutta la Bassa: il Sor Bortolo fa il prezioso." },
  ],

  // i venditori, uno per banco. compra: i prodotti che prende. vende: [{ id, nome, prezzo, ... }]
  banchi: [
    {
      id: 'rina', nome: 'La Rina della verdura', x: 26.3, z: 61.2, tenda: '#3f8a3a', merce: 'pomodori',
      compra: ['pomodoro', 'patata'],
      aspetto: { w: 16, h: 23, skin: '#f0c8a8', hair: '#d8d8d8', hairStyle: 'long', shirt: '#c85a8a', pants: '#4a4a5a', boots: '#2a2a2a', belly: true, eyes: 'normal' },
      saluti: [
        "Garonio! Cosa mi porti di bello? Non dirmi niente, lo vedo: niente di bello.",
        "Tesoro, i pomodori del mio Gianni erano così grossi che li vendevamo a fette. Era il '78. Che anno.",
        "Avanti, avanti! Pomodori, patate, e pettegolezzi gratis!",
      ],
      trattaBene: ["Va bene, va bene! Per te faccio uno strappo. Ma non dirlo alla Pina.", "Mi hai fatto commuovere. Ecco, prendi, prima che ci ripensi."],
      trattaMale: ["Trattare? Con me? Ho tirato su sei figli trattando. Il prezzo adesso scende, così impari.", "Tesoro, io trattavo coi tedeschi nel '44. Tu non sei nessuno. Prezzo più basso."],
      vende: [],
    },
    {
      id: 'ottavio', nome: 'Ottavio delle uova', x: 30.8, z: 61.2, tenda: '#e8c040', merce: 'uova',
      compra: ['uova'],
      aspetto: { w: 16, h: 24, skin: '#e8b48a', hair: '#8a8a8a', hairStyle: 'bald', hat: '#f4efe2', shirt: '#f4efe2', pants: '#3a4a6a', boots: '#3a2a1a', mustache: '#6a6a6a', eyes: 'sleepy' },
      saluti: [
        "Come diceva mio nonno: gallina vecchia fa buon brodo, ma l'uovo oggi è meglio della frittata domani.",
        "Chi va piano va sano e va lontano, e chi va lontano... dove va? Ah, uova. Ne hai?",
        "Rosso di sera, uova di mattina. O era un'altra cosa? Comunque compro uova.",
      ],
      trattaBene: ["Chi non risica non rosica. E tu hai risicato. Va bene, ti do di più.", "Tra i due litiganti il terzo... compra le uova a un prezzo migliore. Affare fatto."],
      trattaMale: ["Chi troppo vuole nulla stringe. E chi tratta con Ottavio stringe ancora meno.", "Non si può avere la botte piena e la moglie... Insomma, ti pago meno."],
      vende: [],
    },
    {
      id: 'bortolo', nome: 'Il Sor Bortolo, granaglie', x: 35.3, z: 61.2, tenda: '#c87830', merce: 'mais',
      compra: ['mais'],
      aspetto: { w: 17, h: 24, skin: '#d9a27a', hair: '#e8e8e8', hairStyle: 'grey', hat: '#5a4630', shirt: '#6a7a5a', pants: '#4a3a2a', boots: '#2a1e14', beard: '#e8e8e8', eyes: 'sleepy' },
      saluti: [
        "EH? MAIS? HAI DETTO MAIS? PARLA PIÙ FORTE, GIOVANOTTO!",
        "Ai miei tempi le pannocchie le portavamo a piedi. In salita. Tutte e due le strade erano in salita.",
        "COME? SÌ, IL PREZZO È SCRITTO SULLA LAVAGNA. NO, NON LA LEGGO, NON CI VEDO.",
      ],
      trattaBene: ["COSA? VUOI DI PIÙ? VA BENE, VA BENE, BASTA CHE NON URLI. Cioè, urla, che non ci sento.", "Mi ricordi me da giovane. Ero un ladro anch'io. Prendi."],
      trattaMale: ["HAI DETTO MENO? VA BENE, MENO! Affare fatto!", "Non ho capito niente, ma il prezzo scende lo stesso."],
      vende: [],
    },
    {
      id: 'gilberto', nome: 'Gilberto «Salamella», il norcino', x: 39.8, z: 61.2, tenda: '#a82a2a', merce: 'salami',
      compra: ['salame'],
      aspetto: { w: 18, h: 25, skin: '#f0b898', hair: '#2a1a1a', hairStyle: 'flat', shirt: '#f4efe2', pants: '#3a3a4a', boots: '#2a2a2a', belly: true, mustache: '#2a1a1a', eyes: 'normal' },
      saluti: [
        "♪ Nessun dormaaa... ♪ Garonio! Hai salami? Il salame è come l'opera: ci vuole tempo, pazienza e tanto pepe.",
        "♪ La donna è mobileee... ♪ Ma il salame no. Il salame è fedele. Ne porti?",
        "Assaggia questo. No, non pagare. Sì, pagare. Dipende da come va la giornata.",
      ],
      trattaBene: ["♪ Vincerò! ♪ Cioè, hai vinto tu. Ti pago come un tenore.", "Bravo! Bis! Ti do di più, ma tu non dirlo a Ottavio."],
      trattaMale: ["Stonato! Hai trattato come uno che canta sotto la doccia. Prezzo giù.", "Il salame si offende, Garonio. E quando il salame si offende, il prezzo scende."],
      vende: [
        { id: 'panino', nome: 'Panino col salame', prezzo: 5, n: 1, desc: 'vita +35 quando lo mangi' },
      ],
    },
    {
      id: 'nando', nome: 'Nando delle pentole', x: 33, z: 64.2, carretto: true,
      compra: [],
      aspetto: { w: 16, h: 24, skin: '#e8b48a', hair: '#1a1a1a', hairStyle: 'flat', shirt: '#e8e8e8', tie: '#d8b020', pants: '#2a2a3a', boots: '#6a3a1a', mustache: '#1a1a1a', eyes: 'normal' },
      saluti: [
        "Signore e signori! Garonio! Avvicinati! La pentola che non attacca! Non attacca neanche se la preghi!",
        "Oggi, solo oggi, solo per te: prezzi da fallimento! Il mio, non il tuo.",
        "Questo coltello taglia anche le scarpe! Guarda! ...Erano scarpe vecchie. Si vede?",
      ],
      vende: [
        { id: 'pentola', nome: 'La pentola che non attacca', prezzo: 15, speciale: 'pentola', desc: 'la Mamma ti vuole un po\' più bene' },
        { id: 'grappa', nome: 'Grappa «del cugino»', prezzo: 3, n: 1, desc: 'stress −25 quando la bevi' },
        { id: 'pomata', nome: 'Pomata miracolosa', prezzo: 8, n: 1, desc: 'cura i maiali (dice lui)' },
        { id: 'trappola', nome: 'Trappola per topi «a ultrasuoni»', prezzo: 6, n: 1, desc: 'è una trappola normale' },
        { id: 'gratta', nome: 'Gratta e vinci «La Cascina d\'Oro»', prezzo: 5, speciale: 'gratta', desc: 'tenta la fortuna' },
      ],
      pentola: [
        "Porti a casa la pentola. La Mamma la guarda, la gira, la annusa. «Garonio... è bellissima.» Le si inumidiscono gli occhi.",
        "La Mamma ci fa subito il ragù. Non attacca davvero. Nando aveva ragione, per una volta nella vita.",
      ],
      gratta: { vinci: [[0.55, 0], [0.3, 5], [0.12, 20], [0.03, 100]],
        niente: ["Niente. Sotto c'è scritto «RITENTA». Nando: «Te l'avevo detto che era fortunato! Il prossimo.»", "Hai trovato tre trattori su quattro. Il quarto è una mucca. Niente."],
        vinto: "Gratta, gratta... HAI VINTO {soldi}€! Nando impallidisce: «Questo non doveva succedere.»" },
    },
  ],

  testi: {
    chiuso: "Oggi niente mercato: le bancarelle ci sono solo il giovedì, dalle 7 alle 13.",
    prestoMattina: "I banchi si stanno montando. Il mercato apre alle 7.",
    finito: "Il mercato è finito: stanno smontando i banchi. Torna giovedì prossimo.",
    apre: "📣 Oggi è giovedì: mercato in piazza davanti al municipio fino alle 13! Porta uova, verdura, mais e salami.",
    domani: "Domani è giovedì: c'è il mercato in piazza. Guarda la TV di casa per i prezzi.",
    niente: "Non hai niente che mi interessa. Torna quando hai qualcosa di buono.",
    venduto: "Venduti {n} {nome}: +{soldi}€",
    tv: "MERCATO DEL GIOVEDÌ ({quando}), prezzi in piazza: {lista}.\n{notizia}",
    cartello: "MERCATO IN PIAZZA ogni GIOVEDÌ dalle 7 alle 13. Si compra: uova, verdura, patate, mais, salami. Si vende: pentole, panini e speranza.",
  },
};

// ===================================================================
// GARE DI TRATTORI SULLA CAPEZZAGNA
// ===================================================================
export const GARE = {
  // partenza e arrivo sulla capezzagna, vicino al fienile; si gira alla bandierina e si torna
  partenza: { x: 60, z: 29 },
  boa: { x: 128, z: 29 },
  corsie: { andata: 28.35, ritorno: 29.65 },
  lavagna: { x: 61.4, z: 27.2 },
  ore: [7, 20],
  balle: 5, fango: 2,
  ritiro: 16,                 // se ti allontani più di così dalla capezzagna, ti ritiri
  // ogni vittoria contro lo stesso rivale lo rende più veloce (si allena)
  allenamento: 0.12, allenamentoMax: 0.6,

  rivali: {
    patata: {
      nome: 'Il Patata', colore: 'arancio', velocita: 5.0, posta: 10, rispetto: 2, daGiorno: 1, rispettoMinimo: 0,
      sfida: "Il Patata arriva col suo trattore arancione, una patata bollita sul cruscotto. «Una gara? Va bene, ma piano, che si rovescia la patata.»",
      partenza: "Il Patata accarezza il volante. «Vai, Carolina.» Il trattore si chiama Carolina.",
      battute: ["«Piano, Carolina, piano!»", "Il Patata si ferma a raccogliere una patata caduta.", "«Ciao Garonio! Bella giornata, eh?» Saluta, invece di guidare."],
      vinta: "Arrivi primo. Il Patata ti stringe la mano e ti regala una patata. «Te la sei meritata. È la più bella che ho.»",
      persa: "Il Patata arriva prima di te. Lui stesso è sorpreso. «Carolina! Siamo campioni!» Ora lo sa tutto il paese.",
      premio: { patata: 1 },
    },
    ermes: {
      nome: 'Il cugino Ermes', colore: 'giallo', velocita: 6.0, posta: 25, rispetto: 4, daGiorno: 3, rispettoMinimo: 15,
      sfida: "Ermes arriva sgommando col trattore nuovo giallo, la radio a tutto volume. «Cugino! Vuoi perdere anche oggi? Ho l'aria condizionata, sai.»",
      partenza: "Ermes abbassa il finestrino. «Ci vediamo al traguardo. Cioè, io ti vedo dallo specchietto.»",
      battute: ["Ermes alza la radio: il trattore sbanda a ritmo di liscio.", "«Cugino, hai la gomma a terra!» Non è vero.", "Ermes si fa un selfie mentre guida. Perde terreno."],
      vinta: "Traguardo! Arrivi primo e Ermes scende dal trattore rosso in faccia. «Hai barato. Non so come, ma hai barato.» Al bar lo sanno già.",
      persa: "Ermes arriva primo e ti suona il clacson in faccia per un minuto intero. «Cugino, la prossima volta prova a pedalare!»",
    },
    frank: {
      nome: 'Mister Frank', colore: 'blu', velocita: 6.4, posta: 50, rispetto: 6, daGiorno: 5, rispettoMinimo: 35,
      sfida: "Mister Frank arriva col trattore blu e un cappello da cowboy grande come una ruota. «Howdy, boy! Una corsa? Nel Texas della Bassa non si dice mai di no!»",
      partenza: "Frank si cala il cappello sugli occhi. «Yee-haw! Let's go, Bessie!» Il trattore si chiama Bessie.",
      battute: ["«YEE-HAAAW!» Frank dà gas come un rodeo.", "Frank lancia il cappello in aria e lo deve recuperare.", "Frank fa ciao con la mano alle mucche. Le mucche non salutano."],
      vinta: "Arrivi primo! Frank si toglie il cappello. «Well, boy... sei un vero cowboy della Bassa.» Ti stringe la mano così forte che senti le ossa.",
      persa: "Frank taglia il traguardo urlando «YEE-HAW!» e fa un giro d'onore intorno a te. Due volte.",
      premio: { mais: 2 },
    },
  },

  testi: {
    lavagna: "LAVAGNA DELLE GARE. Sfide sulla capezzagna: partenza qui, si gira alla bandierina in fondo (vicino al ponte) e si torna. Vince chi arriva primo, il vincitore si prende la posta. Bisogna venire col trattore.",
    serveTrattore: "Per sfidare qualcuno devi essere sul trattore. A piedi ti ridono dietro.",
    rotto: "Con il trattore in queste condizioni? Prima passa da Zeno.",
    chiusa: "Le gare si fanno di giorno, dalle 7 alle 20. Di notte la capezzagna è delle nutrie.",
    giaCorso: "{nome} oggi ha già corso con te. Torna domani.",
    nonPronto: "{nome} non si fa ancora vedere da queste parti.",
    poveroRispetto: "{nome} non corre con gli zimbelli del bar. Serve rispetto {n} (ne hai {r}).",
    senzaSoldi: "Non hai {posta}€ per la posta.",
    via: "VIA!",
    boa: "Gira intorno alla bandierina e torna indietro!",
    traguardo: "Dritto al traguardo!",
    balla: "Balla di fieno in pieno! Il trattore rallenta.",
    fango: "Fango! Le ruote slittano.",
    sportellata: "Sportellata! {nome} ti viene addosso.",
    ritirato: "Ti sei ritirato dalla gara. {nome} vince a tavolino e si prende la posta.",
    vinto: "🏁 Hai vinto! +{posta}€ · Rispetto al bar +{r} · Tempo {tempo}",
    perso: "🏁 Hai perso. −{posta}€ · Rispetto al bar −{r} · Tempo {tempo}",
  },
};

// ===================================================================
// SCOMMESSE DEL CONSULENTE (al bar)
// ===================================================================
export const SCOMMESSE = {
  // quanto si può puntare, secondo il rango al bar
  puntate: [{ da: 0, max: 10 }, { da: 20, max: 25 }, { da: 40, max: 50 }, { da: 60, max: 100 }, { da: 80, max: 200 }],
  rispettoVincita: 1,          // vincere una scommessa grossa (almeno 20€ di guadagno) fa salire il rispetto
  rispettoBancarotta: 2,       // perdere tutto quello che hai in tasca lo fa scendere
  oraGaraFinta: 18,            // la gara tra Ermes e Frank si corre alle 18
  quote: { teStessoRissa: 1.8, controTeStesso: 2.6 },

  testi: {
    menu: "Il Consulente abbassa la voce. «Scommesse. Roba seria, Garonio. Io prendo solo una piccola commissione per il disturbo. Piccola. Quasi niente.»",
    scelta: "🎲 Scommesse del Consulente",
    zimbello: "«Garonio, con tutto il rispetto... che non hai: al massimo {max}€. Quando al bar ti rispetteranno, alzeremo la posta.»",
    quanto: "Quanto punti? (Massimo {max}€ col tuo rango.)",
    accettata: "Il Consulente scrive tutto su un tovagliolino. «Affare fatto. Il tovagliolino non mente.»",
    giaFatta: "Hai già una scommessa aperta su questo. Il tovagliolino è pieno.",
    // gara tra Ermes e Frank
    garaTitolo: "🚜 Gara delle 18: Ermes contro Mister Frank",
    gara: "Stasera alle 18 Ermes e Mister Frank si sfidano sulla capezzagna. Ermes ha il trattore nuovo, Frank ha l'esperienza e un cappello enorme. Su chi punti?",
    garaChiusa: "La gara di oggi è già partita (o finita). Torna domani.",
    garaRisultato: {
      ermes: ["Alle 18 Ermes vince la gara: Frank ha perso il cappello al giro di boa ed è tornato indietro a prenderlo.", "Ermes vince di un soffio: ha messo la radio così alta che Bessie, il trattore di Frank, si è spaventato."],
      frank: ["Alle 18 Frank vince la gara urlando «YEE-HAW!»: Ermes si è fermato a fare un selfie col tramonto.", "Frank vince e fa tre giri d'onore. Ermes dice che aveva il sole negli occhi. Erano le 18 di un giorno nuvoloso."],
    },
    // la tua gara
    tuaGaraTitolo: "🏁 Su te stesso nella prossima gara di trattori",
    tuaGara: "«Punti su di te? Coraggio. O incoscienza. Le quote dipendono da chi sfidi.» Contro chi correrai?",
    // risse
    rissaTitolo: "🥊 Sulla tua prossima rissa",
    rissa: "«La prossima volta che qualcuno ti mette le mani addosso, al bar o in piazza... ci guadagniamo. Su chi punti?»",
    suTe: "Su me stesso (quota {q})",
    controTe: "Contro me stesso (quota {q}): la «combine»",
    combineVinta: "Hai perso la rissa... ma avevi puntato contro te stesso. Il Consulente ti passa {soldi}€ sotto il tavolo. Loredana vi guarda storto: al bar si sa. Rispetto −{r}",
    combinePersa: "Hai vinto la rissa! Bravo! ...Ma avevi puntato contro te stesso. Il Consulente scuote la testa: «Garonio, la combine si fa perdendo.»",
    // risse tra avventori
    avventoriTitolo: "🍺 Sulla rissa di stasera tra avventori",
    avventoriChiusa: "Per stasera di risse in programma non ce ne sono più. Ripassa domani.",
    sfide: [
      { a: 'il Bepi', b: 'il Moreno', motivo: 'un parcheggio davanti al tabacchi', qa: 1.7, qb: 2.2 },
      { a: 'il Gino del tabacchi', b: 'il Walter', motivo: 'una schedina della Juve', qa: 2.4, qb: 1.6 },
      { a: 'la Giusy', b: 'il Moreno', motivo: 'il volume della radio in cortile', qa: 1.5, qb: 2.6 },
      { a: 'il Tarcisio', b: 'il Bepi', motivo: 'chi ha inventato la briscola', qa: 3.0, qb: 1.4 },
      { a: 'il veterinario', b: 'il Walter', motivo: 'un cane che non era malato', qa: 2.0, qb: 1.9 },
    ],
    avventori: "Stasera {a} e {b} se le danno per {motivo}. Su chi punti?",
    cronaca: [
      "{v} schiva un pugno, inciampa nello sgabello e travolge {p}. Vince per peso.",
      "{p} parte forte ma si ferma a finire la birra. {v} ne approfitta.",
      "{v} usa la tecnica segreta: la ciabatta. {p} si arrende ridendo.",
      "Loredana li divide col mestolo. Ai punti vince {v}, perché ha urlato di più.",
    ],
    vinta: "🎲 Scommessa vinta! Il Consulente ti passa {soldi}€.",
    persa: "🎲 Scommessa persa: {posta}€ nel tovagliolino del Consulente.",
    grossa: "Al bar si parla della tua vincita. Rispetto +{r}",
    bancarotta: "Hai giocato fino all'ultimo euro. Al bar ridono. Rispetto −{r}",
  },
};
