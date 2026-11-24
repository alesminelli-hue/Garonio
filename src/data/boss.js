// =====================================================================
//  BOSS DELLE MISSIONI SECONDARIE — uno per ogni edificio e zona della mappa (GDD capitolo 24)
//  Solo dati: testi, numeri e posizioni. Il sistema sta in src/boss.js.
//
//  Ogni boss è una missione secondaria (src/secondarie.js):
//    da / titolo / offerta / grazie   chi la dà e cosa dice · requisiti: livello minimo per l'offerta
//    lv          livello del boss: le statistiche si ricavano da qui (src/data/nemici.js → statBoss)
//    tana        dove si combatte. Sulla mappa: { x, z, nome, ore } · Dentro un edificio: { interno, zona, nome, ore }
//                (zona = il mobile di src/data/interni.js vicino a cui compare «⚔️ Affronta...»)
//                ore = [da, a) in cui il boss c'è · fuori = cosa si vede fuori orario · mappa = punto per la minimappa
//    descr       pagine prima dello scontro · intro = prima riga dello scontro · vittoria = pagine dopo
//    nemico      { name, size, sprite, mul, moves, fuga }: sprite = { umano: aspetto } | { fn: 'nome' in src/sprite_boss.js
//                o src/sprite_bestie.js }. mul = archetipo { hp, atk, def, spd } (1 = boss medio)
//                moves: come i nemici (pow, stress, w, line, veleno: [danno, turni], stordisce)
//    seguaci     tirapiedi che entrano con lui (due livelli sotto)
//    mecc        meccaniche dello scontro (tutte facoltative):
//                rinforzi { ids, ogni, max, testo }   ogni N round chiama aiuto
//                furia    { soglia, atk, doppio, testo }  sotto soglia di Vita: attacco ×atk (doppio = due azioni a turno)
//                cura     { soglia, quanto, volte, testo }  si cura (quanto = parte della Vita massima)
//                scudo    { ogni, testo, rotto }      ogni N round diventa intoccabile fino al round dopo
//                carica   { ogni, mossa, testo }      ogni N round si carica: il colpo dopo è enorme (Difendi!)
//                aura     { stress, testo }           stress a ogni round
//                ruba     n                           ogni colpo a segno ruba fino a n euro
//    bottino     cosa lascia subito: { vestiti, armi, oggetti: { id: n }, soldi }
//    premio      la paga di chi ha dato la missione (soldi, xp, oggetti, amicizia)
// =====================================================================

const U = (sprite, extra = {}) => ({ umano: { sprite, w: 16, h: 24, skin: '#e8b48a', hair: '#3a2a1a', hairStyle: 'flat', shirt: '#4a4a52', pants: '#2a2a32', boots: '#111', eyes: 'angry', ...extra } });

export const BOSS = {
  // ---------- CASA (cantina) ----------
  tasso: {
    nome: 'Il Tasso dei salami', lv: 5, zona: 'Casa', icona: '🦡',
    da: 'mamma', titolo: 'Il ladro della cantina', requisiti: { livello: 3 },
    offerta: "Tesoro, dalla cantina spariscono i salami. Non i ratti: quelli li conosco. Questo lascia le impronte grosse e si porta via il salame intero, con lo spago. Guardi dal buco nel muro?",
    accetta: 'Ci penso io, mamma', grazie: "Il salame della Cresima! Sei il mio eroe. Tieni, ti ho fatto i panini. Non dirlo a tuo padre.",
    tana: { luogo: 'cantina', interno: 'casa', zona: 'cantina', nome: 'il buco nel muro della cantina', ore: [6, 24], mappa: { x: 65.5, z: 63.5 } },
    descr: [
      { testo: "Dal buco nel muro arriva un odore di salame e di bestia. Poi due occhietti rossi. Poi un muso a strisce." },
      { testo: "Un tasso grosso come un cane da pastore esce dal buco trascinando un salame. Guarda Garonio come si guarda un ladro. Lui." },
      { chi: 'garonio', testo: "Quello è della Cresima." },
    ],
    intro: "Il Tasso lascia giù il salame e mostra gli unghioni.",
    nemico: {
      name: 'Il Tasso dei salami', size: 5, sprite: { fn: 'tasso' }, mul: { hp: 0.9, def: 1.3, spd: 0.8 }, fuga: 'torna nel buco con un ultimo sguardo al salame.',
      moves: [
        { name: 'Unghiata', pow: 1.1, stress: 2, w: 3 },
        { name: 'Morso ostinato', pow: 1.3, stress: 2, w: 2 },
        { name: 'Si raggomitola', pow: 0, stress: 3, w: 1, line: 'Il tasso si chiude a palla: sembra un pallone da rugby arrabbiato.' },
      ],
    },
    seguaci: ['ratto'],
    mecc: { cura: { soglia: 0.4, quanto: 0.18, volte: 1, testo: 'Il Tasso dà un morso al salame e si rimette in forze!' } },
    bottino: { vestiti: ['berrettoTasso'], oggetti: { salame: 2 } },
    premio: { soldi: 40, xp: 60, oggetti: { panino: 4 }, amicizia: { mamma: 10 } },
    vittoria: [
      { testo: "Il Tasso molla il colpo e se ne torna nel buco. Lascia un salame e un ciuffo di pelo che, a guardarlo bene, sembra un berretto." },
    ],
  },

  // ---------- PIAZZA DEL PAESE ----------
  piccione: {
    nome: 'Il Generale Piccione', lv: 6, zona: 'Piazza', icona: '🐦',
    da: 'vigilessa', titolo: 'Il Generale della piazza', requisiti: { livello: 3 },
    offerta: "In piazza c'è un piccione che comanda gli altri. Li fa volare in formazione sopra le auto lavate. Ha anche il cappello. Non posso multare un piccione: tu puoi... convincerlo.",
    accetta: 'Agli ordini', grazie: "La piazza è pulita! Per una settimana, poi tornano. Ti tolgo una multa dal registro. Non l'hai sentito da me.",
    tana: { luogo: 'paese', x: 16, z: 57.5, nome: 'la fontana della piazza', ore: [7, 19], fuori: "La piazza è vuota: i piccioni dormono sul campanile. Il Generale si fa vedere di giorno (7-19).", },
    descr: [
      { testo: "Sulla fontana c'è un piccione più grosso degli altri, col petto pieno di medaglie (tappi di birra) e un berretto da generale." },
      { testo: "Tuba un ordine. Cento piccioni si alzano in volo. Le auto parcheggiate tremano." },
      { chi: 'garonio', testo: "Va bene. Facciamola finita da uomo a piccione." },
    ],
    intro: "Il Generale Piccione tuba: «Squadriglia, in formazione!»",
    nemico: {
      name: 'Il Generale Piccione', size: 5.5, sprite: { fn: 'generalePiccione' }, mul: { hp: 0.75, atk: 0.9, spd: 1.5 }, fuga: 'vola sul campanile a scrivere le sue memorie.',
      moves: [
        { name: 'Beccata da ufficiale', pow: 1.1, stress: 2, w: 3 },
        { name: 'Bombardamento a tappeto', pow: 0.6, stress: 9, w: 2, line: 'Garonio è centrato da tre piccioni insieme.' },
        { name: 'Discorso alle truppe', pow: 0, stress: 5, w: 1 },
      ],
    },
    seguaci: ['piccione', 'piccione'],
    mecc: { rinforzi: { ids: ['piccione', 'piccione'], ogni: 2, max: 3, testo: 'Il Generale fischia: arrivano rinforzi dal campanile!' } },
    bottino: { vestiti: ['medagliaPiccione'], oggetti: { piuma: 3 } },
    premio: { soldi: 50, xp: 70, amicizia: { vigilessa: 10 }, multa: true },
    vittoria: [{ testo: "Il Generale Piccione si arrende e vola via. Sulla fontana lascia la sua medaglia più bella: un tappo della Moretti." }],
  },

  // ---------- STUDIO MEDICO ----------
  malato: {
    nome: 'Sor Ugo, il Malato Immaginario', lv: 7, zona: 'Studio medico', icona: '🤒',
    da: 'assunta', titolo: 'Il paziente infinito', requisiti: { livello: 4 },
    offerta: "In sala d'attesa c'è Sor Ugo. È lì da tre giorni. Dice che ha tutte le malattie del libro, anche quelle delle mucche. Nessuno riesce a farsi visitare. Mandalo a casa. Con le buone o con le cattive.",
    accetta: 'Con le buone (forse)', grazie: "La sala d'attesa è vuota! Dopo tre giorni! Tieni, campioni di sciroppo e il mio rispetto.",
    tana: { luogo: 'interno', interno: 'dottore', zona: 'attesa', nome: 'la sala d\'attesa', ore: [8, 19], mappa: { x: 26, z: 70 } },
    descr: [
      { testo: "Sor Ugo è seduto su tre sedie: una per lui, una per le analisi, una per il cappotto." },
      { chi: 'garonio', testo: "Sor Ugo, la accompagno a casa?" },
      { testo: "«Casa? Con la pressione che ho? Ragazzo, siediti. Ti racconto le mie analisi del '94.»" },
    ],
    intro: "Sor Ugo apre una cartella clinica spessa come un'enciclopedia.",
    nemico: {
      name: 'Sor Ugo', size: 8.5, sprite: U('anziano_bastone', { skin: '#e8c0a0', hair: '#d8d8d8', hairStyle: 'bald' }), mul: { hp: 0.85, atk: 0.8, spd: 0.6 }, fuga: 'se ne va a casa a misurarsi la febbre.',
      moves: [
        { name: 'Racconto delle analisi', pow: 0, stress: 12, w: 3, line: '«E poi i trigliceridi, ragazzo, i TRIGLICERIDI...»' },
        { name: 'Bastonata', pow: 1.2, stress: 2, w: 2 },
        { name: 'Starnuto contagioso', pow: 0.6, stress: 3, w: 1, veleno: [4, 3], line: 'Etciù! Garonio si sente la febbre addosso. (Vita −4 per 3 turni)' },
      ],
    },
    mecc: { aura: { stress: 4, testo: 'Sor Ugo continua a elencare sintomi: stress +{n}.' }, cura: { soglia: 0.5, quanto: 0.15, volte: 1, testo: 'Sor Ugo prende una pastiglia dal portapillole: si sente meglio!' } },
    bottino: { vestiti: ['ricettario'], oggetti: { sciroppo: 2, aspirina: 3 } },
    premio: { soldi: 45, xp: 80, oggetti: { sciroppo: 3 }, amicizia: { assunta: 12 } },
    vittoria: [{ testo: "Sor Ugo si alza di scatto: «Mi è passato tutto! Che miracolo!». Se ne va lasciando sulla sedia un ricettario di rimedi della nonna." }],
  },

  // ---------- CASCINA DEL POSTINO ----------
  brutus: {
    nome: 'Brutus, il cane del Postino', lv: 8, zona: 'Cascina del Postino', icona: '🐕',
    da: 'postino', titolo: 'Il cane che morde il Postino', requisiti: { livello: 5 },
    offerta: "Sai qual è l'ironia? Io porto la posta a tutti e il mio cane morde me. Brutus si è preso il cortile e non mi fa entrare in casa. Dormo nel furgone da una settimana. Ammansiscilo.",
    accetta: 'Ci provo', grazie: "Brutus scodinzola! A me! Tieni, e se ti segue, tienilo pure: con te è più buono.",
    tana: { luogo: 'campo', x: 36.5, z: 41.6, nome: 'il cortile della cascina del Postino', ore: [6, 22], fuori: "Brutus dorme nella cuccia. Anche i cani cattivi dormono. Torna di giorno (6-22)." },
    descr: [
      { testo: "Nel cortile c'è un cane nero grosso come un vitello, con un collare borchiato. Sta masticando una cassetta della posta." },
      { testo: "Ringhia. Il ringhio fa vibrare i vetri della cascina." },
      { chi: 'garonio', testo: "Bravo cane... bravo... posa la cassetta." },
    ],
    intro: "Brutus abbaia e parte alla carica!",
    nemico: {
      name: 'Brutus', size: 5.5, sprite: { fn: 'brutus' }, mul: { hp: 0.9, atk: 1.15, spd: 1.3 }, fuga: 'si siede e porge la zampa. Ha capito chi comanda.',
      moves: [
        { name: 'Morso alla caviglia', pow: 1.1, stress: 2, w: 3 },
        { name: 'Placcaggio', pow: 1.4, stress: 3, w: 2, stordisce: true, line: 'Brutus butta Garonio a terra!' },
        { name: 'Abbaio assordante', pow: 0, stress: 7, w: 1 },
      ],
    },
    mecc: { furia: { soglia: 0.35, atk: 1.25, testo: 'Brutus perde la pazienza: ringhia con la bava alla bocca!' } },
    bottino: { vestiti: ['collareBrutus'] },
    premio: { soldi: 55, xp: 90, oggetti: { panino: 2 }, amicizia: { postino: 12 } },
    vittoria: [{ testo: "Brutus si sdraia a pancia all'aria. Garonio gli toglie il collare borchiato: senza, sembra un cucciolone. Il collare se lo tiene Garonio. E Brutus, d'ora in poi, risponde al suo fischio." }],
  },

  // ---------- POLLAIO ----------
  faina: {
    nome: 'La Faina Argentata', lv: 9, zona: 'Pollaio', icona: '🦡',
    da: 'mamma', titolo: 'Chi ruba le uova?', requisiti: { livello: 6, dopo: 'boss_tasso' },
    offerta: "Amore, le galline non fanno più uova. Cioè le fanno, ma la mattina non ci sono. Stanotte ho visto un'ombra d'argento uscire dal pollaio. Tuo padre dice che è un fantasma. Tuo padre ha paura dei fantasmi.",
    accetta: 'Faccio la guardia stanotte', grazie: "Le uova sono tornate! Le galline ti guardano con rispetto. Tieni, ti ho fatto una frittata da portare.",
    tana: { luogo: 'notte', x: 81.9, z: 80.6, nome: 'il retro del pollaio', ore: [19, 24], fuori: "Le galline razzolano tranquille. La faina viene col buio (dalle 19)." },
    descr: [
      { testo: "Dietro il pollaio, alla luce della luna, una faina dal pelo d'argento lucida un uovo con la coda." },
      { testo: "Ha gli occhi rossi e la grazia di una ladra di gioielli. Accanto a lei, una montagna di gusci." },
      { chi: 'garonio', testo: "Signora, quelle sono uova a chilometro zero. Nostre." },
    ],
    intro: "La Faina Argentata fischia: dal fosso arrivano le volpi!",
    nemico: {
      name: 'La Faina Argentata', size: 4.6, sprite: { fn: 'faina' }, mul: { hp: 0.8, atk: 1.0, spd: 1.8 }, fuga: 'sparisce nel buio lasciando la stola d\'argento impigliata nella rete.',
      moves: [
        { name: 'Morso lampo', pow: 1.0, stress: 2, w: 3 },
        { name: 'Doppio graffio', pow: 1.5, stress: 2, w: 2 },
        { name: 'Ruba un uovo', pow: 0.4, stress: 5, steal: 'uova', w: 1, line: 'Sparisce un uovo dallo zaino!' },
      ],
    },
    seguaci: ['volpe'],
    mecc: { scudo: { ogni: 3, testo: 'La Faina si infila nel pollaio tra le galline: non si riesce a colpirla!', rotto: 'Le galline la cacciano fuori a beccate!' } },
    bottino: { vestiti: ['stolaFaina'], oggetti: { uova: 6, pennaVolpe: 1 } },
    premio: { soldi: 70, xp: 110, oggetti: { pomodoro: 4 }, amicizia: { mamma: 10 } },
    vittoria: [{ testo: "La Faina scappa nel fosso. Nella rete del pollaio resta la sua stola d'argento e, sotto la paglia, tutte le uova rubate. Le galline applaudono, a modo loro." }],
  },

  // ---------- CASCINA DEL PATATA ----------
  dorifora: {
    nome: 'La Dorifora Regina', lv: 10, zona: 'Cascina del Patata', icona: '🪲',
    da: 'patata', titolo: 'La regina delle patate', requisiti: { livello: 7 },
    offerta: "Garonio... le mie patate... le mangiano. Un insetto a strisce. Grosso. Con la corona. Si chiama dorifora. Lo so perché me l'ha detto lei. Non è vero, ma sembrava. Aiutami. Ti pago in patate. E in euro.",
    accetta: 'Salviamo le patate', grazie: "Le mie patate sono salve! Gino, Pino, Lino e Ugo ti ringraziano. Anche io. Tieni.",
    tana: { luogo: 'campo', x: 101.5, z: 31.2, nome: 'il campo di patate del Patata', ore: [6, 20], fuori: "Le dorifore di notte dormono sotto le foglie. Torna di giorno (6-20)." },
    descr: [
      { testo: "In mezzo al campo di patate c'è uno scarabeo a strisce gialle e nere grande come una carriola. Ha una coroncina." },
      { testo: "Intorno a lei, cento larve arancioni masticano foglie con un rumore di patatine." },
      { chi: 'garonio', testo: "Maestà, il Patata la sfratta." },
    ],
    intro: "La Dorifora Regina batte le elitre: le larve si girano tutte insieme verso Garonio.",
    nemico: {
      name: 'La Dorifora Regina', size: 5.5, sprite: { fn: 'dorifora' }, mul: { hp: 0.95, atk: 0.9, def: 1.4, spd: 0.7 }, fuga: 'vola via ronzando verso il campo di Frank. Problema suo.',
      moves: [
        { name: 'Morso di foglia', pow: 1.0, stress: 2, w: 3 },
        { name: 'Spruzzo amaro', pow: 0.7, stress: 4, w: 2, veleno: [5, 3], line: 'Uno spruzzo puzzolente: Garonio tossisce. (Vita −5 per 3 turni)' },
        { name: 'Corazzata', pow: 0, stress: 2, w: 1, line: 'La Dorifora si chiude nel guscio.' },
      ],
    },
    seguaci: ['larva', 'larva'],
    mecc: { rinforzi: { ids: ['larva'], ogni: 2, max: 3, testo: 'Dalla terra spuntano altre larve!' } },
    bottino: { vestiti: ['corazzaDorifora'], oggetti: { patata: 6 } },
    premio: { soldi: 80, xp: 130, oggetti: { patata: 8 }, amicizia: { patata: 15 } },
    vittoria: [{ testo: "La Dorifora Regina vola via perdendo il guscio. È una corazza a strisce, leggera e durissima. Il Patata la guarda e piange di gioia (o di cipolla, non si sa)." }],
  },

  // ---------- MAGAZZINO DEL BUBETTO ----------
  ladro: {
    nome: 'Il Mago dei Lucchetti', lv: 11, zona: 'Magazzino del Bubetto', icona: '🦹',
    da: 'bubetto', titolo: 'Il ladro del magazzino', requisiti: { livello: 8 },
    offerta: "Di notte qualcuno mi entra nel magazzino. Non forza niente: apre i lucchetti come fossero noccioline. Mi sparisce la roba buona e mi lascia un biglietto: «Grazie». Beccalo sul retro, dopo le otto.",
    accetta: 'Lo becco io', grazie: "Il Mago dei Lucchetti in fuga! Hai visto che faccia? Tieni, e quel piede di porco tienitelo, che a me fa paura.",
    tana: { luogo: 'notte_paese', x: 45, z: 51.8, nome: 'il retro del magazzino', ore: [20, 24], fuori: "Il retro del magazzino è tranquillo. Il ladro lavora col buio (dalle 20)." },
    descr: [
      { testo: "Sul retro del magazzino un tipo in felpa armeggia col lucchetto. Click. Aperto in due secondi." },
      { testo: "Si gira. Sorride. Ha un piede di porco e un mazzo di grimaldelli. «Serata fiacca, eh?»" },
      { chi: 'garonio', testo: "Quella roba è del Bubetto. Che l'ha presa da qualche parte. Ma è sua." },
    ],
    intro: "Il Mago dei Lucchetti fa roteare il piede di porco.",
    nemico: {
      name: 'Il Mago dei Lucchetti', size: 8.6, sprite: U('felpa_cappellino'), mul: { hp: 0.85, atk: 1.0, spd: 1.6 }, fuga: 'scavalca il muro e sparisce. Il piede di porco no.',
      moves: [
        { name: 'Colpo di piede di porco', pow: 1.2, stress: 2, w: 3 },
        { name: 'Mano lesta', pow: 0.6, stress: 4, w: 2, line: 'Ti alleggerisce il portafoglio!' },
        { name: 'Sgambetto', pow: 0.9, stress: 3, w: 1, stordisce: true, line: 'Garonio inciampa e cade!' },
      ],
    },
    mecc: { ruba: 15, furia: { soglia: 0.3, atk: 1.1, doppio: true, testo: 'Il Mago dei Lucchetti si muove velocissimo: agisce due volte!' } },
    bottino: { armi: ['piedeDiPorco'], oggetti: { gingillo: 2 }, soldi: 60 },
    premio: { soldi: 100, xp: 150, oggetti: { trappola: 3 }, amicizia: { bubetto: 12 } },
    vittoria: [{ testo: "Il Mago dei Lucchetti scappa sul tetto, lasciando cadere il piede di porco e un sacchetto di gingilli. Dal tetto grida: «Ci rivedremo!». Non ci si rivede." }],
  },

  // ---------- FARMACIA ----------
  informatore: {
    nome: 'Il Dottor Placebo', lv: 12, zona: 'Farmacia', icona: '💼',
    da: 'pastiglia', titolo: 'L\'informatore insistente', requisiti: { livello: 9 },
    offerta: "C'è un informatore farmaceutico che non se ne va. Il Dottor Placebo. Vende pastiglie di zucchero a ottanta euro. Mi ha chiuso in farmacia con la sua valigetta. Ti prego. Usa la forza. O la logica. La forza va bene.",
    accetta: 'La forza va benissimo', grazie: "Se n'è andato! Libero! Tieni, un elisir di mia invenzione. Funziona davvero. Credo.",
    tana: { luogo: 'interno', interno: 'farmacia', zona: 'espositore', nome: 'l\'espositore delle offerte', ore: [8, 20], mappa: { x: 16.5, z: 72 } },
    descr: [
      { testo: "Davanti all'espositore c'è un signore in completo con una valigetta enorme. Ha il sorriso di chi vende enciclopedie." },
      { testo: "«Buongiorno! Lei ha l'aria stanca. Ho proprio quello che fa per lei: Placebol Forte. Senza principio attivo, per non sbagliare.»" },
      { chi: 'garonio', testo: "No grazie. Ho già un padre che mi fa venire l'ansia gratis." },
    ],
    intro: "Il Dottor Placebo apre la valigetta: «Lasci che le mostri il catalogo!»",
    nemico: {
      name: 'Il Dottor Placebo', size: 8.6, sprite: U('completo_cravatta'), mul: { hp: 1.0, atk: 0.9 }, fuga: 'chiude la valigetta e scappa a un appuntamento a Cremona.',
      moves: [
        { name: 'Valigettata', pow: 1.2, stress: 2, w: 3 },
        { name: 'Campione omaggio', pow: 0.6, stress: 3, w: 2, veleno: [6, 3], line: 'Una pastiglia «omaggio» finisce in bocca a Garonio. Brutta idea. (Vita −6 per 3 turni)' },
        { name: 'Presentazione in PowerPoint', pow: 0, stress: 11, w: 1, line: 'Slide 1 di 340.' },
      ],
    },
    mecc: { cura: { soglia: 0.5, quanto: 0.2, volte: 2, testo: 'Il Dottor Placebo si prende una delle sue pastiglie. Funziona! Per lui sì.' } },
    bottino: { vestiti: ['valigetta'], oggetti: { sciroppo: 2, integratore: 2 } },
    premio: { soldi: 110, xp: 170, oggetti: { elisir: 1 }, amicizia: { pastiglia: 12 } },
    vittoria: [{ testo: "Il Dottor Placebo batte in ritirata. Nella fretta lascia la valigetta dei campioni: dentro, finalmente, qualcosa che funziona davvero." }],
  },

  // ---------- PIZZERIA ----------
  critico: {
    nome: 'Forchetta d\'Oro, il critico', lv: 13, zona: 'Pizzeria Bella Napoli', icona: '🍴',
    da: 'gennaro', titolo: 'La recensione maledetta', requisiti: { livello: 10 },
    offerta: "Uè Garonio. Sta venendo il critico «Forchetta d'Oro». Una stella a tutti, e le pizzerie chiudono. Stasera viene da me. Se gli fai cambiare idea... con le maniere forti... io ti faccio la pizza gratis a vita. Quasi a vita.",
    accetta: 'Gli faccio cambiare idea', grazie: "Cinque stelle! CINQUE! Il quadro del Vesuvio ha pianto. Tieni, pizza per tutto l'inverno. E quella forchetta d'oro, appendila al muro. O usala.",
    tana: { luogo: 'interno', interno: 'pizzeria', zona: 'vesuvio', nome: 'il tavolo sotto il Vesuvio', ore: [19, 24], mappa: { x: 33.5, z: 70 }, fuori: "Il critico arriva solo a cena (dalle 19)." },
    descr: [
      { testo: "Sotto il quadro del Vesuvio, un signore con un tovagliolo al collo e una forchetta d'oro guarda la pizza come si guarda un insulto." },
      { testo: "«Bordo troppo alto. Mozzarella troppo... mozzarella. Una stella. Forse zero.»" },
      { chi: 'garonio', testo: "Lei ha appena offeso Gennaro. E il Vesuvio." },
    ],
    intro: "Forchetta d'Oro si alza: «Lei è il cameriere? Una stella anche a lei.»",
    nemico: {
      name: 'Forchetta d\'Oro', size: 8.6, sprite: U('uomo_gilet', { eyes: 'normal' }), mul: { hp: 0.95, atk: 1.05, spd: 1.1 }, fuga: 'esce scrivendo «cinque stelle» sul taccuino. A malincuore.',
      moves: [
        { name: 'Forchettata', pow: 1.2, stress: 2, w: 3 },
        { name: 'Recensione velenosa', pow: 0, stress: 12, w: 2, line: '«Garonio: una stella. Pigro, sudato, ma con una certa grazia contadina.»' },
        { name: 'Lancio di olio piccante', pow: 1.3, stress: 3, w: 1 },
      ],
    },
    mecc: { carica: { ogni: 3, mossa: { name: 'STRONCATURA', pow: 2.2, stress: 10, line: 'Una stroncatura che si sente fino a Parma!' }, testo: 'Forchetta d\'Oro prende fiato e affila la penna: sta per stroncare tutto! (Difenditi!)' } },
    bottino: { armi: ['forchettone'], oggetti: { pizza: 4 } },
    premio: { soldi: 120, xp: 190, oggetti: { pizza: 6 }, amicizia: { gennaro: 15 } },
    vittoria: [{ testo: "Forchetta d'Oro si accascia, assaggia per sbaglio la margherita e scoppia a piangere: «È... perfetta». Lascia sul tavolo la sua forchetta d'oro. Pesa come un forcone." }],
  },

  // ---------- CAMPI E FIENILE ----------
  spaventapasseri: {
    nome: 'Lo Spaventapasseri del Mais', lv: 14, zona: 'Campi e fienile', icona: '🎃',
    da: 'consulente', titolo: 'Lo spaventapasseri che cammina', requisiti: { livello: 11 },
    offerta: "Te lo dico da professionista: lo spaventapasseri vicino al fienile di notte cammina. Tarcisio l'ha visto. Anche io, ma io ero sobrio, quindi è più grave. Spaventa i corvi, le nutrie e i contadini. Fallo smettere.",
    accetta: 'Di notte, al fienile', grazie: "L'hai fermato? Bravo. Ti offro... un consiglio. E dei soldi, va', che ho vinto una scommessa su di te.",
    tana: { luogo: 'notte', x: 54.5, z: 25.4, nome: 'il fienile in mezzo ai campi', ore: [20, 24], fuori: "Di giorno è uno spaventapasseri qualunque, appeso al palo. Di notte (dalle 20) scende." },
    descr: [
      { testo: "Davanti al fienile il palo dello spaventapasseri è vuoto. Uno scricchiolio. Lo spaventapasseri è dietro Garonio, col cappello di paglia e la falce." },
      { testo: "Ha due bottoni al posto degli occhi. I bottoni brillano." },
      { chi: 'garonio', testo: "Lo sapevo che il mais mi avrebbe ucciso, prima o poi." },
    ],
    intro: "Lo Spaventapasseri apre le braccia: dal mais si alza uno stormo di gazze!",
    nemico: {
      name: 'Lo Spaventapasseri', size: 9.5, sprite: { umano: { w: 18, h: 27, skin: '#d8b878', hair: '#e8c860', hairStyle: 'messy', hat: '#b89040', shirt: '#7a4a2a', plaid: true, pants: '#4a5a7a', boots: '#4a3a22', eyes: 'angry', belt: '#3a2a1a' } },
      mul: { hp: 1.15, atk: 1.0, def: 0.9 }, fuga: 'torna sul palo e non si muove più. Il cappello però cade.',
      moves: [
        { name: 'Falciata di paglia', pow: 1.2, stress: 2, w: 3 },
        { name: 'Sguardo di bottone', pow: 0, stress: 10, w: 1, line: 'I bottoni fissano Garonio nell\'anima.' },
        { name: 'Pioggia di paglia', pow: 0.8, stress: 3, w: 2, line: 'Paglia ovunque: negli occhi, nel naso, nei calzini.' },
      ],
    },
    seguaci: ['gazza'],
    mecc: { rinforzi: { ids: ['gazza'], ogni: 3, max: 2, testo: 'Arrivano altre gazze dal mais!' }, furia: { soglia: 0.4, atk: 1.3, testo: 'Lo Spaventapasseri prende fuoco... no, è solo il tramonto. Però è arrabbiatissimo!' } },
    bottino: { vestiti: ['cappelloSpaventapasseri'], oggetti: { mais: 5, gingillo: 1 } },
    premio: { soldi: 130, xp: 210, oggetti: { caffe: 4 }, amicizia: { consulente: 12 } },
    vittoria: [{ testo: "Lo Spaventapasseri si affloscia come un sacco vuoto. Il cappello di paglia rotola ai piedi di Garonio. Dentro c'è scritto: «Proprietà di nonno Fulmine». Ovviamente." }],
  },

  // ---------- CHIESA (campanile) ----------
  pipistrellone: {
    nome: 'Il Pipistrellone del campanile', lv: 15, zona: 'Chiesa', icona: '🦇',
    da: 'suoraCarmela', titolo: 'Il mostro del campanile', requisiti: { livello: 12 },
    offerta: "Nel campanile c'è un pipistrello. Grosso. Quando suoniamo le campane fa DONG anche lui, in un'altra tonalità. Don Peppino dice che è una creatura di Dio. Io dico che la corda delle campane è lì: sali e sistemalo.",
    accetta: 'Salgo io', grazie: "Le campane suonano giuste! Il Signore ti benedica, e anch'io, che è più raro. Tieni, l'offerta di questa settimana. Non tutta.",
    tana: { luogo: 'chiesa', interno: 'chiesa', zona: 'campane', nome: 'la corda delle campane', ore: [6, 21], mappa: { x: 6.5, z: 71 } },
    descr: [
      { testo: "Garonio tira la corda. Dal campanile non viene un DONG ma un VWOOSH. Qualcosa scende in picchiata lungo la navata." },
      { testo: "Un pipistrello con le ali larghe come un ombrellone si appende al lampadario. Ha gli occhi rossi e i denti a punta." },
      { chi: 'garonio', testo: "Perdonami, Signore, per quello che sto per fare con questa zappa." },
    ],
    intro: "Il Pipistrellone stride: un nugolo di pipistrelli piccoli si stacca dal soffitto!",
    nemico: {
      name: 'Il Pipistrellone', size: 6, sprite: { fn: 'pipistrello' }, mul: { hp: 0.9, atk: 1.05, spd: 1.7 }, fuga: 'esce dalla finestra del campanile e va a vivere a Cremona.',
      moves: [
        { name: 'Picchiata', pow: 1.3, stress: 2, w: 3 },
        { name: 'Morso vampiresco', pow: 1.0, stress: 3, w: 2, veleno: [5, 3], line: 'Un morso sul collo! (Vita −5 per 3 turni)' },
        { name: 'Ultrasuoni', pow: 0, stress: 11, w: 1, line: 'Un fischio che fa tremare le vetrate.' },
      ],
    },
    seguaci: ['pipistrellino', 'pipistrellino'],
    mecc: { scudo: { ogni: 3, testo: 'Il Pipistrellone vola in cima al campanile: fuori portata!', rotto: 'Il Pipistrellone torna giù in picchiata!' }, rinforzi: { ids: ['pipistrellino'], ogni: 4, max: 2, testo: 'Altri pipistrelli si staccano dal soffitto!' } },
    bottino: { vestiti: ['mantelloPipistrello'], oggetti: { trofeoBoss: 1 } },
    premio: { soldi: 140, xp: 230, oggetti: { grappa: 2 }, amicizia: { suoraCarmela: 15, donPeppino: 8 } },
    vittoria: [{ testo: "Il Pipistrellone sbatte contro la campana grande: DOOOONG. Esce dalla finestra e non torna più. Sull'altare resta un mantello di pelle nera, morbido e caldo. Suor Carmela finge di non vederlo." }],
  },

  // ---------- DA ZENO (officina in paese) ----------
  rottamaio: {
    nome: 'Ottavio il Rottamaio', lv: 16, zona: 'Officina di Zeno', icona: '🔧',
    da: 'zeno', titolo: 'Il rottamaio prepotente', requisiti: { livello: 13 },
    offerta: "C'è Ottavio il Rottamaio che si è messo sotto il mio ponte sollevatore e dice che l'officina è sua per usucapione. Usu-che? Non lo so. Io lo so solo che non mi fa lavorare. Toglimelo dai piedi e una riparazione te la faccio a metà prezzo. Forse.",
    accetta: 'Lo tolgo io', grazie: "Il ponte è libero! Te lo dico una volta sola: bravo. Tieni i soldi e la chiave inglese che ha lasciato, che io ne ho già sei.",
    tana: { luogo: 'officina', interno: 'meccanico', zona: 'ponte', nome: 'il ponte sollevatore', ore: [7, 19], mappa: { x: 56, z: 47.4 } },
    descr: [
      { testo: "Sotto il ponte sollevatore c'è un omone con il casco giallo e una chiave inglese lunga come una zappa." },
      { testo: "«Questa officina è mia. Ho le carte. Sono scritte sul retro di uno scontrino, ma ce le ho.»" },
      { chi: 'garonio', testo: "Zeno mi frega tutti i giorni. Ma almeno è il NOSTRO Zeno." },
    ],
    intro: "Ottavio picchia la chiave inglese sul ponte: CLANG!",
    nemico: {
      name: 'Ottavio il Rottamaio', size: 9.2, sprite: U('operaio_casco'), mul: { hp: 1.2, atk: 1.05, def: 1.3, spd: 0.8 }, fuga: 'carica i suoi rottami sul camion e se ne va borbottando.',
      moves: [
        { name: 'Chiavata inglese', pow: 1.2, stress: 2, w: 3 },
        { name: 'Lancio di marmitta', pow: 1.5, stress: 3, w: 2 },
        { name: 'Ti spiego il codice civile', pow: 0, stress: 9, w: 1 },
      ],
    },
    mecc: { carica: { ogni: 4, mossa: { name: 'MOTORE IN TESTA', pow: 2.3, stress: 6, line: 'Ottavio scaglia un blocco motore intero!' }, testo: 'Ottavio solleva un blocco motore sopra la testa... (Difenditi!)' }, cura: { soglia: 0.35, quanto: 0.15, volte: 1, testo: 'Ottavio si beve un caffè dalla macchinetta di Zeno. Senza pagarlo!' } },
    bottino: { armi: ['chiaveInglese'], oggetti: { rottame: 3, ferro: 4 } },
    premio: { soldi: 150, xp: 250, amicizia: { zeno: 12, ivan: 8 }, oggetti: { benzina: 3 } },
    vittoria: [{ testo: "Ottavio si arrende e se ne va col camion. Sotto il ponte resta una chiave inglese da 32, pesante come un rimorso." }],
  },

  // ---------- KEBAB (la piazza di notte) ----------
  teppisti: {
    nome: 'Il Biondo e i teppisti', lv: 17, zona: 'Kebab in piazza', icona: '🛹',
    da: 'kemal', titolo: 'I teppisti del sabato sera', requisiti: { livello: 14 },
    offerta: "Amico mio. Ogni sera, dopo le dieci, arriva il Biondo coi suoi amici. Mangiano, non pagano, rompono le sedie. Io sono uomo di pace. Tu sei... uomo di zappa. Aiutami e mangi gratis per sempre.",
    accetta: 'Stasera ci sono', grazie: "Il Biondo non tornerà! Amico mio, per te kebab gratis. E questo giubbotto che ha lasciato: è brutto, ma è robusto.",
    tana: { luogo: 'notte_paese', x: 19.6, z: 51.4, nome: 'davanti al kebab', ore: [22, 24], fuori: "Davanti al kebab c'è solo odore di cipolla. I teppisti arrivano tardi (dalle 22)." },
    descr: [
      { testo: "Davanti al kebab un ragazzo con la cresta bionda e un giubbotto con le borchie fa le impennate col motorino. I suoi amici ridono." },
      { testo: "«Ehi, contadino! Hai sbagliato piazza? Il trattore lo parcheggi là, coi vecchi.»" },
      { chi: 'garonio', testo: "Il trattore no. Ma la zappa ce l'ho qui." },
    ],
    intro: "Il Biondo schiocca le dita: i teppisti fanno cerchio.",
    nemico: {
      name: 'Il Biondo', size: 8.8, sprite: U('cresta'), mul: { hp: 0.95, atk: 1.1, spd: 1.3 }, fuga: 'monta sul motorino e scappa. Il motorino non parte. Scappa a piedi.',
      moves: [
        { name: 'Pugno col tirapugni', pow: 1.3, stress: 2, w: 3 },
        { name: 'Presa in giro', pow: 0, stress: 12, w: 2, line: '«Garonio! Ga-ro-nio! Il figlio del Gigante dorme in piedi!»' },
        { name: 'Calcio volante', pow: 1.5, stress: 3, w: 1 },
      ],
    },
    seguaci: ['teppista', 'teppista'],
    mecc: { rinforzi: { ids: ['teppista'], ogni: 3, max: 3, testo: 'Arriva un altro teppista in motorino!' }, furia: { soglia: 0.4, atk: 1.2, testo: 'Il Biondo si toglie il giubbotto: adesso fa sul serio!' } },
    bottino: { vestiti: ['giubbottoBorchie'], oggetti: { kebab: 4 }, soldi: 80 },
    premio: { soldi: 160, xp: 270, oggetti: { kebab: 6 }, amicizia: { kemal: 18 } },
    vittoria: [{ testo: "Il Biondo scappa a piedi lasciando il giubbotto con le borchie sulla sedia rotta. I suoi amici lo seguono. Kemal applaude con lo spiedo in mano." }],
  },

  // ---------- RANCH DI MISTER FRANK ----------
  toro: {
    nome: 'Il Toro «Dollaro»', lv: 18, zona: 'Ranch di Mister Frank', icona: '🐂',
    da: 'frank', titolo: 'Il toro del rodeo', requisiti: { livello: 15 },
    offerta: "Boy! Ho comprato un toro da rodeo. Si chiama Dollaro. È arrivato dal Texas. Cioè da Mantova. Ha sfondato il recinto, mi ha mangiato il cappello e ora il ranch è suo. Domalo! Come un vero cowboy!",
    accetta: 'Yee-haw', grazie: "You did it, boy! Dollaro è tornato nel recinto. Tieni i dollari. Cioè, gli euro. Same thing. E quelle corna sono un regalo: le aveva perse lui.",
    tana: { luogo: 'campo', x: 144.5, z: 42.2, nome: 'il recinto del ranch', ore: [6, 21], fuori: "Dollaro dorme in piedi in mezzo al cortile. Meglio non svegliarlo di notte. Torna di giorno (6-21)." },
    descr: [
      { testo: "Nel cortile del ranch c'è un toro nero come la pece, con un anello d'oro al naso e il marchio del dollaro sul fianco." },
      { testo: "Gratta il terreno con lo zoccolo. Sbuffa fumo. Mister Frank, dal tetto, grida: «Prendilo per le corna, boy!»" },
      { chi: 'garonio', testo: "Per le corna. Certo. Facile." },
    ],
    intro: "Dollaro abbassa la testa e carica!",
    nemico: {
      name: 'Dollaro', size: 6.5, sprite: { fn: 'toro' }, mul: { hp: 1.3, atk: 1.15, def: 1.1, spd: 0.8 }, fuga: 'torna nel recinto da solo, offeso.',
      moves: [
        { name: 'Cornata', pow: 1.3, stress: 2, w: 3 },
        { name: 'Calcio di zoccolo', pow: 1.1, stress: 2, w: 2 },
        { name: 'Sbuffata', pow: 0, stress: 8, w: 1 },
      ],
    },
    mecc: { carica: { ogni: 3, mossa: { name: 'CARICA DEL RODEO', pow: 2.3, stress: 6, stordisce: true, line: 'Dollaro travolge tutto quello che trova!' }, testo: 'Dollaro gratta il terreno e abbassa le corna... (Difenditi!)' }, furia: { soglia: 0.3, atk: 1.2, testo: 'Dollaro vede rosso (il cappello di Frank)!' } },
    bottino: { vestiti: ['cornaToro'], oggetti: { trofeoBoss: 1 } },
    premio: { soldi: 200, xp: 290, amicizia: { frank: 18 } },
    vittoria: [{ testo: "Dollaro si siede come un cagnone, esausto. Garonio lo riporta nel recinto tenendolo per l'anello. Nel cortile restano due corna finte che il toro si era messo per sembrare più cattivo. Funzionavano." }],
  },

  // ---------- DEPOSITO DI CASA ----------
  calabroni: {
    nome: 'La Regina dei calabroni', lv: 19, zona: 'Deposito di casa', icona: '🐝',
    da: 'mamma', titolo: 'Il nido nel deposito', requisiti: { livello: 16, dopo: 'boss_faina' },
    offerta: "Tesoro, nel deposito c'è un nido di calabroni grosso come un'anguria, dietro ai sacchi del concime. Tuo padre è entrato a prendere il badile ed è uscito correndo. Non lo vedevo correre dal '98.",
    accetta: 'Vado a vedere', grazie: "Niente più calabroni! Tuo padre è rientrato nel deposito con l'aria da padrone. Tieni, il miele del nido: è buonissimo, e non pizzica più.",
    tana: { luogo: 'officina', interno: 'officina', zona: 'sacchi', nome: 'il nido dietro ai sacchi', ore: [7, 20], mappa: { x: 83.5, z: 63 }, fuori: "Di notte i calabroni dormono nel nido. Meglio non disturbarli al buio (torna fra le 7 e le 20)." },
    descr: [
      { testo: "Dietro ai sacchi del concime c'è un nido di carta grigia grande come un'anguria. Ronza come un trattore al minimo." },
      { testo: "Dal buco esce lei: la Regina, lunga come un avambraccio, con una coroncina d'oro e un pungiglione da cucito." },
      { chi: 'garonio', testo: "Dovevo restare a letto. Lo dico sempre, ma oggi avevo ragione." },
    ],
    intro: "La Regina ronza: lo sciame esce dal nido!",
    nemico: {
      name: 'La Regina dei calabroni', size: 5.2, sprite: { fn: 'calabrone' }, mul: { hp: 0.8, atk: 1.15, spd: 1.6 }, fuga: 'vola via dalla finestra seguita dallo sciame. Il miele resta.',
      moves: [
        { name: 'Pungiglione', pow: 1.2, stress: 3, w: 3, veleno: [6, 3], line: 'Punto! Il braccio si gonfia. (Vita −6 per 3 turni)' },
        { name: 'Ronzio assordante', pow: 0, stress: 10, w: 1 },
        { name: 'Picchiata', pow: 1.4, stress: 2, w: 2 },
      ],
    },
    seguaci: ['calabrone', 'calabrone'],
    mecc: { rinforzi: { ids: ['calabrone', 'calabrone'], ogni: 2, max: 4, testo: 'Dal nido escono altri calabroni!' }, aura: { stress: 3, testo: 'Il ronzio fa impazzire: stress +{n}.' } },
    bottino: { vestiti: ['pungiglione'], oggetti: { miele: 5 } },
    premio: { soldi: 180, xp: 320, oggetti: { miele: 3 }, amicizia: { mamma: 12 } },
    vittoria: [{ testo: "La Regina vola via dalla finestra e lo sciame la segue come un corteo. Nel nido resta il miele, tanto miele, e il pungiglione che si è persa per strada." }],
  },

  // ---------- PALESTRA ----------
  culturista: {
    nome: 'Ercole «il Pompato»', lv: 21, zona: 'Palestra', icona: '💪',
    da: 'sergente', titolo: 'Il re della panca', requisiti: { livello: 18 },
    offerta: "Soldato! Un civile chiamato Ercole occupa la panca da tre settimane. Non si allena: si specchia. Ha bevuto tutti gli integratori. Ha detto «sergente chi?». Recluta, ti do un ordine: sgombra la panca!",
    accetta: 'Signorsì!', grazie: "Missione compiuta, soldato! La panca è libera! Tieni la sua cintura: te la sei guadagnata. E venti flessioni. Scherzo. Trenta.",
    tana: { luogo: 'interno', interno: 'palestra', zona: 'panca', nome: 'la panca dei pesi', ore: [7, 23], mappa: { x: 64.5, z: 47.5 } },
    descr: [
      { testo: "Sulla panca c'è un uomo con i muscoli unti e una canottiera due taglie più piccola. Solleva il bilanciere guardandosi allo specchio." },
      { testo: "«Fratello. Sei qui per la panca? La panca è mia. Anche lo specchio. Anche tu, se vuoi.»" },
      { chi: 'garonio', testo: "Io sono qui solo perché me l'ha ordinato un sergente." },
    ],
    intro: "Ercole si alza dalla panca e flette i bicipiti. Sembrano due pagnotte.",
    nemico: {
      name: 'Ercole il Pompato', size: 10, sprite: U('canottiera', { eyes: 'angry' }), mul: { hp: 1.45, atk: 1.15, def: 1.2, spd: 0.7 }, fuga: 'va a farsi un frullato proteico. Non tornerà.',
      moves: [
        { name: 'Pugno pompato', pow: 1.3, stress: 2, w: 3 },
        { name: 'Bilancierata', pow: 1.6, stress: 3, w: 1 },
        { name: 'Posa allo specchio', pow: 0, stress: 9, w: 2, line: '«Guarda questo tricipite, fratello. GUARDALO.»' },
      ],
    },
    mecc: { cura: { soglia: 0.5, quanto: 0.15, volte: 2, testo: 'Ercole si scola un frullato proteico: si rigonfia!' }, carica: { ogni: 4, mossa: { name: 'STACCO DA TERRA', pow: 2.3, stress: 6, line: 'Ercole lancia un disco da 20 chili!' }, testo: 'Ercole sgancia un disco dal bilanciere e prende la mira... (Difenditi!)' } },
    bottino: { vestiti: ['cinturaPesi'], oggetti: { integratore: 4 } },
    premio: { soldi: 220, xp: 360, oggetti: { integratore: 3 }, amicizia: { sergente: 15 } },
    vittoria: [{ testo: "Ercole si siede per terra senza fiato: «Fratello... sei pompato dentro.» Si sfila la cintura da sollevamento e te la regala, commosso." }],
  },

  // ---------- LAGHETTO ----------
  siluro: {
    nome: 'Il Siluro del laghetto', lv: 23, zona: 'Laghetto', icona: '🐟',
    da: 'donPeppino', titolo: 'Il mostro del laghetto', requisiti: { livello: 20 },
    offerta: "Figliolo, il lunedì vado a pescare al laghetto. È l'unico giorno in cui il Signore non mi guarda. Ma c'è un pesce... un siluro... che mi ruba le esche, le canne e una volta il cappello. Va' e pesca quella bestia. Il Signore capirà.",
    accetta: 'Vado a pescare', grazie: "L'hai preso! Il Signore è grande, e anche il siluro. Tieni, l'arpione me lo tengo io... no, tienilo tu. Io pesco con la fede.",
    tana: { luogo: 'laghetto', x: 34, z: 77.5, nome: 'la riva del laghetto', ore: [5, 10], fuori: "Il laghetto è calmo. Il siluro sale a galla all'alba, quando l'acqua è fresca (dalle 5 alle 10)." },
    descr: [
      { testo: "All'alba l'acqua del laghetto si muove. Una pinna. Poi un'altra. Poi due baffi lunghi come fruste." },
      { testo: "Il Siluro emerge: lungo come la Punto, con la bocca larga come una cassetta della frutta. Ha in bocca il cappello di Don Peppino." },
      { chi: 'garonio', testo: "Mi servirebbe una barca più grande. E non ho nemmeno la barca." },
    ],
    intro: "Il Siluro sbatte la coda: un'ondata travolge la riva!",
    nemico: {
      name: 'Il Siluro', size: 6, sprite: { fn: 'siluro' }, mul: { hp: 1.35, atk: 1.1, def: 1.0, spd: 0.9 }, fuga: 'torna sul fondo del laghetto. Per un po\' starà buono.',
      moves: [
        { name: 'Morso a risucchio', pow: 1.3, stress: 3, w: 3 },
        { name: 'Codata', pow: 1.2, stress: 2, w: 2 },
        { name: 'Schizzo di fango', pow: 0.5, stress: 7, w: 1, line: 'Garonio è fradicio dalla testa ai piedi.' },
      ],
    },
    mecc: { scudo: { ogni: 3, testo: 'Il Siluro si inabissa: non si vede più!', rotto: 'Il Siluro riemerge con uno spruzzo enorme!' }, carica: { ogni: 4, mossa: { name: 'ONDATA', pow: 2.3, stress: 8, line: 'Un muro d\'acqua si abbatte su Garonio!' }, testo: 'L\'acqua del laghetto comincia a gonfiarsi... (Difenditi!)' }, cura: { soglia: 0.3, quanto: 0.12, volte: 1, testo: 'Il Siluro si mangia una carpa intera e si rimette in sesto.' } },
    bottino: { armi: ['arpione'], oggetti: { trofeoBoss: 1, pepita: 1 } },
    premio: { soldi: 260, xp: 400, amicizia: { donPeppino: 18 } },
    vittoria: [{ testo: "Il Siluro si arrende e sputa tutto quello che aveva rubato: esche, canne, il cappello di Don Peppino e un vecchio arpione arrugginito. Garonio lo pulisce: è ancora affilatissimo." }],
  },

  // ---------- CASTELLO ----------
  armatura: {
    nome: 'L\'Armatura del Trisavolo', lv: 25, zona: 'Castello del Conte', icona: '🛡️',
    da: 'ambrogio', titolo: 'L\'armatura che risponde', requisiti: { livello: 22 },
    offerta: "Ricorda quando le dissi che l'armatura una volta mi ha risposto? Ora risponde sempre. E stanotte ha sfidato a duello il signor Conte. Il signor Conte ha accettato e poi si è chiuso in bagno. Potrebbe... sostituirlo lei?",
    accetta: 'Accetto il duello', grazie: "Il signor Conte ringrazia. Dal bagno. Io ringrazio di persona. L'armatura, ora che è vuota, le spetta: così dice il codice cavalleresco. E la paga, che non dice niente.",
    tana: { luogo: 'castello', interno: 'castello', zona: 'armatura', nome: 'l\'armatura del Trisavolo', ore: [9, 21], mappa: { x: 10, z: 94.5 } },
    descr: [
      { testo: "L'armatura scricchiola. Si stacca dal piedistallo. Dalla visiera escono due lucine azzurre e un odore di naftalina." },
      { testo: "«Chi osa sfidare il Conte Ottone della Bassa, eroe di Solferino?» La voce rimbomba come dentro una pentola." },
      { chi: 'garonio', testo: "Garonio, figlio del Gigante, eroe di... niente. Ma ho la zappa." },
    ],
    intro: "L'Armatura sguaina uno spadone più alto di Garonio. Le altre armature si muovono!",
    nemico: {
      name: 'L\'Armatura del Trisavolo', size: 10.5, sprite: { umano: { w: 18, h: 27, skin: '#9aa0a8', hair: '#6a7078', hairStyle: 'flat', hat: '#8a9098', shirt: '#a8b0b8', pants: '#7a8088', boots: '#4a5058', eyes: 'angry', belt: '#c8a040' } },
      mul: { hp: 1.3, atk: 1.15, def: 1.8, spd: 0.6 }, fuga: 'crolla a terra in un mucchio di ferraglia. Le lucine si spengono.',
      moves: [
        { name: 'Fendente', pow: 1.3, stress: 2, w: 3 },
        { name: 'Colpo di scudo', pow: 1.0, stress: 3, w: 2, stordisce: true, line: 'CLANG! Garonio vede le stelle.' },
        { name: 'Discorso di Solferino', pow: 0, stress: 10, w: 1, line: '«Nel 1859, la nebbia era fitta come oggi...»' },
      ],
    },
    seguaci: ['armaturaVuota'],
    mecc: { carica: { ogni: 3, mossa: { name: 'CARICA DI SOLFERINO', pow: 2.4, stress: 8, line: 'L\'Armatura carica a spadone spianato!' }, testo: 'L\'Armatura alza lo spadone sopra la testa... (Difenditi!)' }, furia: { soglia: 0.35, atk: 1.15, doppio: true, testo: 'L\'Armatura grida «SAVOIA!» e attacca due volte!' } },
    bottino: { armi: ['spadone'], vestiti: ['elmoTrisavolo'], oggetti: { trofeoBoss: 1 } },
    premio: { soldi: 320, xp: 460, oggetti: { elisir: 1 }, amicizia: { ambrogio: 15, conte: 15 } },
    vittoria: [{ testo: "L'Armatura si inginocchia: «Sei degno, contadino». Poi si smonta pezzo per pezzo. Restano l'elmo e lo spadone. Ambrogio li lucida e te li porge con un inchino." }],
  },

  // ---------- NIGHT WELCOME ----------
  buttafuori: {
    nome: 'Tonino il Buttafuori', lv: 27, zona: 'Night Welcome', icona: '🕶️',
    da: 'loredana', titolo: 'Il buttafuori del Welcome', requisiti: { livello: 24 },
    offerta: "Al Welcome c'è un buttafuori nuovo, Tonino. Non fa entrare nessuno del paese: dice che puzziamo di stalla. Ha buttato fuori il Consulente, Tarcisio e anche il sindaco. Hai la mia benedizione. Di barista.",
    accetta: 'Gli faccio vedere io la stalla', grazie: "Hanno riaperto le porte a tutti! Il sindaco ha ballato fino all'alba. Questo te lo sei guadagnato. E da stasera il primo giro lo offro io. Uno.",
    tana: { luogo: 'notte_paese', x: 48, z: 67.4, nome: 'l\'ingresso del Night Welcome', ore: [21, 24], fuori: "Il Welcome è chiuso. Tonino arriva col buio (dalle 21)." },
    descr: [
      { testo: "Davanti al Welcome c'è un armadio a quattro ante con gli occhiali da sole. Di notte. Ha le braccia conserte e un auricolare." },
      { testo: "«Tu non entri. Hai il fango sugli stivali. E la faccia da fango.»" },
      { chi: 'garonio', testo: "Il fango è di famiglia. Come le maniere." },
    ],
    intro: "Tonino si toglie gli occhiali: dal Welcome escono i suoi colleghi.",
    nemico: {
      name: 'Tonino il Buttafuori', size: 10.5, sprite: U('bodyguard'), mul: { hp: 1.4, atk: 1.2, def: 1.4, spd: 0.8 }, fuga: 'si rimette gli occhiali e va a fare il buttafuori a Rimini.',
      moves: [
        { name: 'Spinta da buttafuori', pow: 1.3, stress: 3, w: 3 },
        { name: 'Presa al collo', pow: 1.1, stress: 4, w: 2, stordisce: true, line: 'Tonino solleva Garonio da terra come un sacco di mangime!' },
        { name: '«Non sei in lista»', pow: 0, stress: 12, w: 1 },
      ],
    },
    seguaci: ['scagnozzo'],
    mecc: { rinforzi: { ids: ['scagnozzo'], ogni: 3, max: 2, testo: 'Dal Welcome esce un altro buttafuori!' }, carica: { ogni: 4, mossa: { name: 'BUTTATO FUORI', pow: 2.4, stress: 10, line: 'Tonino lancia Garonio contro il cassonetto!' }, testo: 'Tonino si scrocchia le nocche... (Difenditi!)' } },
    bottino: { vestiti: ['occhialiScuri', 'scarpeButtafuori'], oggetti: { trofeoBoss: 1, gingillo: 2 } },
    premio: { soldi: 380, xp: 520, oggetti: { grappa: 3 }, amicizia: { loredana: 18 } },
    vittoria: [{ testo: "Tonino si siede sul marciapiede: «In vent'anni non mi aveva mai buttato fuori nessuno.» Ti regala gli occhiali scuri e gli anfibi, e se ne va a piedi nudi verso Rimini." }],
  },

  // ---------- FINALE: MISTER MOUNTAIN (livello 30) ----------
  mountain: {
    nome: 'Mister Mountain', lv: 30, zona: 'Piazza del bar', icona: '🚬', finale: true,
    da: 'consulente', titolo: 'L\'ultimo affare di Mister Mountain', requisiti: { livello: 28, tuttiIBoss: true },
    offerta: "Te lo dico da professionista, e stavolta gratis: hai sistemato tutta la Bassa. Tutta. Ora c'è solo uno che comanda ancora: Mister Mountain. Stanotte, a mezzanotte meno qualcosa, davanti al bar. Ti aspetta. Dice che vuole «chiudere i conti». Io porterei la zappa buona.",
    accetta: 'Ci sarò', grazie: "Hai battuto Mister Mountain. Non so cosa dire. Io lo dico sempre, cosa dire. Ti offro il caffè. Per sempre. Sei il Padrone della Bassa, Garonio.",
    tana: { luogo: 'notte_paese', x: 13.5, z: 51.2, nome: 'la piazza davanti al bar', ore: [22, 24], fuori: "La piazza è vuota. Mister Mountain arriva a tarda notte (dalle 22)." },
    descr: [
      { testo: "La nebbia si apre. Una Mercedes nera si ferma davanti al bar. Scende Mister Mountain, col sigaro acceso e due scagnozzi." },
      { testo: "«Garonio. Ho sentito che sistemi le cose. Tasso, Siluro, Armatura... Tutti i miei clienti. Mi hai rovinato il fatturato.»" },
      { chi: 'garonio', testo: "Per una volta non devo niente a nessuno. Neanche a lei." },
      { testo: "Mister Mountain spegne il sigaro sul cofano. «Allora chiudiamo i conti.»" },
    ],
    intro: "Mister Mountain si sfila la giacca. Gli scagnozzi fanno cerchio.",
    nemico: {
      name: 'Mister Mountain', size: 12, sprite: { personaggio: 'mountain' }, mul: { hp: 1.4, atk: 1.15, def: 1.3, spd: 0.9, xp: 2 }, fuga: 'risale sulla Mercedes. Per la prima volta, senza dire niente.',
      moves: [
        { name: 'Ceffone da padrone', pow: 1.3, stress: 4, w: 3 },
        { name: 'Sguardo di Mister Mountain', pow: 0, stress: 14, w: 1, line: 'Lo stesso sguardo che fa tremare il Gigante.' },
        { name: 'Calcio del Gigante', pow: 1.6, stress: 4, w: 2 },
        { name: 'Fumata di sigaro', pow: 0.6, stress: 6, w: 1, veleno: [8, 3], line: 'Una nuvola di fumo: Garonio tossisce. (Vita −8 per 3 turni)' },
      ],
    },
    seguaci: ['scagnozzo', 'scagnozzo'],
    mecc: {
      rinforzi: { ids: ['scagnozzo'], ogni: 3, max: 2, testo: 'Dalla Mercedes scende un altro scagnozzo!' },
      carica: { ogni: 3, mossa: { name: 'CONTO DA SALDARE', pow: 2.5, stress: 12, line: 'Mister Mountain presenta il conto. Pesante.' }, testo: 'Mister Mountain tira fuori il libretto dei conti... (Difenditi!)' },
      furia: { soglia: 0.4, atk: 1.15, doppio: true, testo: 'Mister Mountain si toglie la cravatta: adesso è personale! Attacca due volte.' },
      aura: { stress: 4, testo: 'La sua presenza mette ansia: stress +{n}.' },
    },
    bottino: { vestiti: ['sigaroMountain'], oggetti: { pepita: 3, trofeoBoss: 2 }, soldi: 1000 },
    premio: { soldi: 1000, xp: 0, oggetti: { caffe: 10 }, amicizia: { consulente: 20 } },
    vittoria: [
      { testo: "Mister Mountain cade in ginocchio sull'asfalto della piazza. Il bar si svuota: tutti escono a guardare." },
      { testo: "«Va bene, Garonio. La Bassa è tua.» Si rialza, si sistema la giacca e ti lascia il sigaro. «Tienilo. Non l'ho mai acceso davvero.»" },
      { chi: 'garonio', testo: "Papà non ci crederà mai." },
      { testo: "Il Gigante, dalla finestra del bar, ci crede eccome. E per la prima volta, applaude." },
    ],
  },
};

// ---------- Bella Napoli: la pizza non pagata (non è una missione: parte se scappi senza pagare) ----------
// Gennaro è livello 30: durissimo. Si può rifare ogni volta che scappi; il bottino grosso solo la prima volta.
BOSS.gennaro = {
  nome: 'Gennaro furioso', lv: 30, zona: 'Pizzeria Bella Napoli', icona: '🍕', senzaMissione: true,
  titolo: 'La pizza non pagata',
  tana: { luogo: 'paese' },
  fuga: [
    { testo: "Garonio si alza piano piano, fa finta di andare in bagno... e scatta verso la porta!" },
    { chi: 'gennaro', nome: 'Gennaro', testo: "UÈ! UÈÈÈ! 'O CONTO! Fermate a chillo!" },
    { testo: "Garonio è fuori. Respira. Ce l'ha fatta. Poi sente dei passi pesanti, e l'odore di forno a legna che si avvicina." },
  ],
  descr: [
    { testo: "Gennaro esce dalla Bella Napoli con la pala del forno in mano e il grembiule ancora infarinato. Ha gli occhi del Vesuvio nel '44." },
    { chi: 'gennaro', nome: 'Gennaro', testo: "Tu hai mangiato 'na margherita mia e te ne vai accussì? Mo' t'insegno io 'a creanza!" },
  ],
  intro: "Gennaro fa roteare la pala del forno. Non è più il Gennaro che canta.",
  nemico: {
    name: 'Gennaro furioso', size: 10, sprite: U('pizzaiolo', { eyes: 'angry' }), mul: { hp: 1.45, atk: 1.25, def: 1.3, spd: 1.1, xp: 1.2 }, fuga: 'si siede sul marciapiede col fiatone. «Almeno sei veloce, guagliò.»',
    moves: [
      { name: 'Palata', pow: 1.3, stress: 3, w: 3 },
      { name: 'Mozzarella in faccia', pow: 0.8, stress: 6, w: 2, stordisce: true, line: 'Una mozzarella di bufala piena in faccia. Garonio non vede niente!' },
      { name: 'Insulto in napoletano', pow: 0, stress: 13, w: 1, line: "«Si' proprio nu' scurnacchiato!»" },
      { name: 'Olio bollente', pow: 1.1, stress: 4, w: 1, veleno: [9, 3], line: 'Una schizzata d\'olio piccante bollente! (Vita −9 per 3 turni)' },
    ],
  },
  mecc: {
    carica: { ogni: 3, mossa: { name: 'PIZZA AL FORNO A LEGNA', pow: 2.5, stress: 10, line: 'Gennaro tira fuori dal forno una pizza rovente e te la stampa addosso!' }, testo: 'Gennaro infila la pala nel forno portatile... (Difenditi!)' },
    furia: { soglia: 0.4, atk: 1.15, doppio: true, testo: 'Gennaro si toglie il cappello da pizzaiolo: adesso è una questione d\'onore! Attacca due volte.' },
    cura: { soglia: 0.3, quanto: 0.12, volte: 1, testo: 'Gennaro si mangia al volo un trancio di pizza: si rimette in forze!' },
  },
  bottino: { armi: ['palaForno'], vestiti: ['grembiulePizzaiolo'], oggetti: { pizza: 4 } },
  bottinoRipeti: { oggetti: { pizza: 2 } },
  vittoria: [
    { testo: "Gennaro si siede sul marciapiede, senza fiato. Poi scoppia a ridere." },
    { chi: 'gennaro', nome: 'Gennaro', testo: "Mai visto uno accussì! Tiè, pigliate 'a pala e 'o grembiule: tanto stasera nun inforno cchiù. Però 'a prossima vota... PAGHI!" },
  ],
  vittoriaRipeti: [{ chi: 'gennaro', nome: 'Gennaro', testo: "N'ata vota?! Va bene, va bene, hai vinto tu. Ma 'o conto t'o segno 'ncopp' 'o muro!" }],
  sconfitta: "Gennaro trascina Garonio dentro per un orecchio e gli fa pagare il doppio. Tutta la piazza ha visto.",
  scappato: "Garonio scappa più veloce di Gennaro. Ma Gennaro non dimentica: alla Bella Napoli adesso c'è un conto in sospeso.",
  debito: { prezzo: 16, paga: '💶 Paga il conto in sospeso ({prezzo}€)', pagato: "Bravo guagliò. Mo' sì che ragioniamo. Che te porto?", sfida: '⚔️ «Il conto? Vieni a prendertelo!»', saluto: "Tu! Tu tieni 'nu conto aperto cu' me. {prezzo} euro, o fore se ne parla." },
};

// ---------- Laghetto: il Mostro della Palude (non è una missione: esce se salti 100 volte sulla riva, src/speciali.js) ----------
// Livello 30, durissimo. Si può rifare ogni 100 salti; il bottino grosso solo la prima volta.
BOSS.palude = {
  nome: 'Il Mostro della Palude', lv: 30, zona: 'Laghetto', icona: '🧟', senzaMissione: true,
  titolo: 'Cento salti sulla riva',
  tana: { luogo: 'laghetto' },
  intro: "Il Mostro della Palude allunga le braccia piene di alghe. Puzza di fosso, di carpa e di 1974.",
  nemico: {
    name: 'Il Mostro della Palude', size: 11, sprite: U('zombie', { skin: '#6a9a4a', eyes: 'angry' }), mul: { hp: 1.4, atk: 1.1, def: 1.2, spd: 0.85, xp: 1.3 }, fuga: 'torna sott\'acqua borbottando. Stanotte non dormirai.',
    moves: [
      { name: 'Abbraccio fangoso', pow: 1.3, stress: 3, w: 3 },
      { name: 'Alito di fosso', pow: 0.6, stress: 7, w: 2, line: 'Un alito che sa di carpa morta e uova sode. Garonio lacrima.' },
      { name: 'Sanguisughe', pow: 0.9, stress: 4, w: 1, veleno: [10, 3], line: 'Tre sanguisughe grosse come zucchine! (Vita −10 per 3 turni)' },
      { name: 'Ninna nanna della palude', pow: 0.4, stress: 6, w: 0.6, stordisce: true, line: 'Il Mostro canta una ninna nanna gorgogliante. Garonio si addormenta in piedi!' },
    ],
  },
  mecc: {
    rinforzi: { ogni: 5, max: 1, ids: ['nutria_gigante'], testo: 'Dall\'acqua arrivano le nutrie: il Mostro è il loro re!' },
    carica: { ogni: 4, mossa: { name: 'RISUCCHIO DELLA PALUDE', pow: 2.4, stress: 10, line: 'Il fango risucchia Garonio fino alla cintura!' }, testo: 'L\'acqua del laghetto comincia a girare come un lavandino... (Difenditi!)' },
    cura: { soglia: 0.35, quanto: 0.12, volte: 1, testo: 'Il Mostro si rotola nel fango e le ferite si chiudono. Che schifo. Che efficacia.' },
  },
  bottino: { vestiti: ['mantelloAlghe'], oggetti: { pepita: 2, trofeoBoss: 1, elisir: 1 } },
  bottinoRipeti: { oggetti: { pepita: 1, miele: 2 } },
  vittoria: [
    { testo: "Il Mostro della Palude crolla nella melma con un «blob» lunghissimo. Poi alza un dito, come per dire qualcosa." },
    { chi: 'garonio', testo: "Cosa? Parla!" },
    { testo: "«...Basta saltare. Io qua sotto dormo.» E sparisce. Sulla riva lascia un mantello di alghe intrecciate, caldo e appiccicoso." },
  ],
  vittoriaRipeti: [{ testo: "Il Mostro torna giù borbottando: «Ancora?! Cento salti! Ma non hai un lavoro?»" }],
  sconfitta: "Garonio si sveglia sulla riva, coperto di alghe, con una rana nel taschino. Il Mostro è tornato a dormire. Il contatore dei salti, pure.",
  scappato: "Garonio scappa a gambe levate. Il Mostro lo guarda andare via e torna sott'acqua. Per richiamarlo serviranno altri cento salti.",
};

// ---------- Parco Oglio: Boss MM, il capo delle guardie (non è una missione: esce se gli rubi il cappello, src/parco.js) ----------
// Livello 32, con una guardia (livello 30) al fianco. Si può rifare; il bottino grosso solo la prima volta.
BOSS.bossmm = {
  nome: 'Boss MM', lv: 32, zona: 'Parco Oglio', icona: '🎩', senzaMissione: true,
  titolo: 'Il cappello di Boss MM',
  tana: { luogo: 'bosco notte' },
  intro: "Boss MM si sistema i baffi, soffia nel fischietto e fa schioccare le dita. «Tarantola! Brambilla! Uno dei due, insomma!» Ma le guardie dormono: è una questione tra lui e te.",
  nemico: {
    name: 'Boss MM', size: 10.5, sprite: U('soldato_capo', { eyes: 'angry' }), mul: { hp: 1.05, atk: 1.05, def: 1.1, spd: 1.0, xp: 1.4 }, fuga: 'si rimette il fischietto in tasca. «Ci rivedremo al prossimo verbale.»',
    moves: [
      { name: 'Manganello d\'ordinanza', pow: 1.3, stress: 3, w: 3 },
      { name: 'FISCHIETTO!', pow: 0.3, stress: 9, w: 1.5, stordisce: true, line: 'FIIIIIIIIIII! Garonio ha le orecchie che fischiano. Non capisce più niente!' },
      { name: 'Verbale definitivo', pow: 0, stress: 14, w: 1, line: '«Danneggiamento, furto, sguardo insolente. Totale: tutto lo stipendio di tuo padre.»' },
      { name: 'Testata col berretto', pow: 1.5, stress: 3, w: 1 },
    ],
  },
  mecc: {
    carica: { ogni: 4, mossa: { name: 'IL SALTO DELLA SAGRA DELL\'84', pow: 2.4, stress: 10, line: 'Boss MM salta come alla sagra dell\'84 e atterra sulla schiena di Garonio!' }, testo: 'Boss MM si sgranchisce le gambe e fischietta un valzer... (Difenditi!)' },
    furia: { soglia: 0.35, atk: 1.15, testo: 'Boss MM si accorge di non avere il cappello. Diventa viola. ADESSO è arrabbiato.' },
    cura: { soglia: 0.3, quanto: 0.1, volte: 1, testo: 'Boss MM beve un sorso dalla borraccia d\'ordinanza (non è acqua). Si rimette in forze!' },
  },
  bottino: { oggetti: { pepita: 2, trofeoBoss: 1 } },
  bottinoRipeti: { oggetti: { pepita: 1 } },
  vittoria: [
    { testo: "Boss MM si siede su un ceppo, si slaccia il colletto e guarda il suo cappello sotto il tuo braccio." },
    { chi: 'bossmm', nome: 'Boss MM', testo: "Dillo al Camper... dillo a quel vecchio caprone che la Ornella, alla sagra dell'84, ha ballato con me perché lui pestava i piedi. Non per il cappello." },
  ],
  vittoriaRipeti: [{ testo: "Boss MM sospira: «Ancora tu. Il cappello te lo potevo anche prestare, sai?»" }],
  sconfitta: "Le guardie ti portano fuori dal parco di peso. Boss MM si rimette il cappello, lo spolvera e scrive un verbale lunghissimo.",
  scappato: "Garonio scappa nel buio. Boss MM fischia per un minuto intero, poi torna al casotto a rimettersi il cappello.",
};

// Tirapiedi dei boss: compaiono solo negli scontri coi boss (non in giro per la mappa).
// Statistiche a livello "cons", poi crescono come tutti i nemici (src/data/nemici.js → scalaNemico).
export const TIRAPIEDI = {
  larva:        { name: 'Larva di dorifora', hp: 18, atk: 7, def: 3, spd: 5, xp: 6, size: 2.4, sprite: 'doriforaPiccola', cons: 8, lv: [5, 34], fuga: 'si infila sotto terra.',
    moves: [{ name: 'Morsetto', pow: 1, stress: 1, w: 3 }, { name: 'Bava arancione', pow: 0.5, stress: 3, w: 1 }] },
  pipistrellino:{ name: 'Pipistrellino', hp: 16, atk: 9, def: 1, spd: 15, xp: 7, size: 2.6, sprite: 'pipistrelloPiccolo', cons: 12, lv: [8, 34], fuga: 'torna appeso al soffitto.',
    moves: [{ name: 'Morsetto', pow: 1, stress: 1, w: 3 }, { name: 'Squittio', pow: 0, stress: 4, w: 1 }] },
  calabrone:    { name: 'Calabrone', hp: 14, atk: 10, def: 1, spd: 14, xp: 6, size: 2.4, sprite: 'calabronePiccolo', cons: 15, lv: [10, 34], fuga: 'torna nel nido.',
    moves: [{ name: 'Puntura', pow: 1, stress: 2, w: 3, veleno: [3, 2] }, { name: 'Ronzio', pow: 0, stress: 4, w: 1 }] },
  teppista:     { name: 'Teppista', hp: 40, atk: 14, def: 3, spd: 8, xp: 14, size: 8, umano: 'tuta_felpa', cons: 15, lv: [10, 34], fuga: 'scappa sul motorino.',
    moves: [{ name: 'Pugno', pow: 1.1, stress: 2, w: 3 }, { name: 'Sfottò', pow: 0, stress: 7, w: 1, line: '«Contadino! Contadino!»' }] },
  armaturaVuota:{ name: 'Armatura vuota', hp: 55, atk: 15, def: 12, spd: 4, xp: 18, size: 9, umano: 'armatura', cons: 20, lv: [15, 34], fuga: 'si smonta con un gran rumore di pentole.',
    moves: [{ name: 'Colpo di mazza', pow: 1.1, stress: 2, w: 3 }, { name: 'Clangore', pow: 0, stress: 5, w: 1 }] },
  scagnozzo:    { name: 'Scagnozzo', hp: 60, atk: 18, def: 6, spd: 8, xp: 20, size: 9, umano: 'completo_cravatta', cons: 22, lv: [15, 34], fuga: 'risale in macchina.',
    moves: [{ name: 'Pugno col tirapugni', pow: 1.1, stress: 2, w: 3 }, { name: 'Minaccia', pow: 0, stress: 7, w: 1, line: '«Il capo non è contento.»' }] },
};

// ---------- Bottino dei nemici normali ----------
// p = probabilità, n = [min, max]. Ai nemici «feroci» il primo oggetto della lista cade sempre.
export const BOTTINO = {
  nutria:           [{ id: 'pelleNutria', p: 0.35 }],
  nutria_gigante:   [{ id: 'pelleNutria', p: 0.9, n: [1, 2] }],
  nutria_corazzata: [{ id: 'pelleNutria', p: 0.8, n: [1, 2] }, { id: 'ferro', p: 0.2 }],
  ratto:            [{ id: 'codaRatto', p: 0.5 }],
  ratto_fogna:      [{ id: 'codaRatto', p: 0.9 }, { id: 'ferro', p: 0.25 }],
  volpe:            [{ id: 'pennaVolpe', p: 0.4 }, { id: 'uova', p: 0.3, n: [1, 2] }],
  gazza:            [{ id: 'piuma', p: 0.6 }, { id: 'gingillo', p: 0.15 }],
  piccione:         [{ id: 'piuma', p: 0.2 }],
  cinghiale:        [{ id: 'zanna', p: 0.35 }],
  cinghiale_maschio:[{ id: 'zanna', p: 0.85, n: [1, 2] }],
  lupo_giovane:     [{ id: 'pelleLupo', p: 0.25 }],
  lupo:             [{ id: 'pelleLupo', p: 0.6 }],
  calabrone:        [{ id: 'miele', p: 0.15 }],
  teppista:         [{ id: 'gingillo', p: 0.1 }],
  scagnozzo:        [{ id: 'gingillo', p: 0.2 }],
};
// a volte un nemico perde qualcosa di utile (tutti)
export const BOTTINO_EXTRA = {
  p: 0.06, pFeroce: 0.3,
  oggetti: ['panino', 'caffe', 'sciroppo', 'grappa', 'integratore', 'pomata'],
  pepita: { p: 0.03, daLivello: 22 },    // dal livello 22 qualche pepita da vendere (150€)
};

// ---------- Endgame (livello 30): le sfide leggendarie ----------
// Ogni boss battuto torna, più forte, una volta alla settimana. Il livello sale a ogni vittoria fino a +5.
export const LEGGENDA = {
  giorniFraSfide: 7,
  livelloBase: 32, livelloMax: 36,
  soldi: [300, 600],
  oggetti: [{ id: 'pepita', p: 0.8, n: [1, 3] }, { id: 'elisir', p: 0.5 }, { id: 'trofeoBoss', p: 0.6 }, { id: 'miele', p: 0.4, n: [2, 3] }],
  rari: { p: 0.3, armi: ['zappaDoro'], vestiti: ['tutaLeggenda', 'stivaliSette', 'coronaBassa'] },
  nome: n => `${n} leggendario`,
};

export const TESTI_BOSS = {
  brivido: "Garonio sente le gambe molli. «Questo è troppo forte per me... per ora.»",
  entraLoStesso: 'Affrontalo lo stesso',
  meglioDiNo: 'Meglio di no',
  affronta: '⚔️ Affronta',
  torna: 'Torna più tardi',
  sconfitta: "Garonio si risveglia malconcio. Il boss è ancora lì. Lo aspetta, quando sarà più forte.",
  fuga: "Garonio scappa. Il boss non lo insegue: sa che tornerà.",
  giaFatto: "Qui ormai è tutto tranquillo.",
  nuovaTana: 'Missione: {titolo}. Il posto è segnato in rosso sulla minimappa.',
  vinto: 'Boss sconfitto: {nome}! Torna da {chi} per la ricompensa.',
  bottino: 'Bottino: {cose}.',
  leggendaPronta: '⭐ Sfida leggendaria',
  leggendaAttesa: "Il {nome} si sta ancora leccando le ferite. Tornerà più forte fra {giorni} giorni.",
  leggendaIntro: "È tornato, più forte di prima. Gli occhi brillano d'oro.",
  leggendaVinta: 'Sfida leggendaria vinta! Il {nome} tornerà fra una settimana, ancora più forte.',
  endgame: [
    { testo: "Livello 30. Garonio si guarda le mani: callose, forti, ancora un po' pigre. Ma forti." },
    { testo: "In paese non lo chiamano più «il figlio del Gigante». Lo chiamano «il Padrone della Bassa»." },
    { testo: "Da adesso il gioco è libero: i boss battuti tornano ogni settimana in versione LEGGENDARIA (segno dorato sulla minimappa), con bottino raro: la Zappa d'oro, la Tuta della Leggenda, gli Stivali delle sette cascine, la Corona della Bassa. I nemici in giro sono più spesso «feroci» e perdono pepite." },
    { chi: 'garonio', testo: "E il Gigante? Domani mi chiederà comunque di zappare." },
  ],
};
