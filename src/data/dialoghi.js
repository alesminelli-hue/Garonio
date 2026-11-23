// =====================================================================
//  DIALOGHI DI GARONIO
//  Solo testi: si possono cambiare, aggiungere o togliere frasi senza
//  toccare il resto del gioco. Dove c'è una lista [ ... ] il gioco ne
//  sceglie una a caso, quindi più frasi = meno ripetizioni.
//
//  Una "pagina" di dialogo è { chi, testo }:
//    chi = 'gigante' | 'mountain' | 'garonio' | 'barista' | un avventore
//          (lasciarlo vuoto = voce narrante, senza ritratto)
//
//  Segnaposto: {n} {ora} {missione} {fatto} {soldi} come in missioni.js
// =====================================================================

// Nomi mostrati nei dialoghi. Per cambiare nome a un personaggio basta qui.
export const NOMI = {
  garonio: 'Garonio',
  gigante: 'Il Gigante',
  mountain: 'Mister Mountain',
  barista: 'Loredana',
};

// ---------------------------------------------------------------------
//  INIZIO PARTITA
// ---------------------------------------------------------------------
export const INTRO = [
  { testo: "Pianura padana, ore 6:00. Il gallo canta. Garonio no." },
  { chi: 'gigante', testo: "GARONIO! Sono le sei! I campi non si zappano da soli!" },
  { chi: 'garonio', testo: "Mmh... cinque minuti, papà..." },
  { chi: 'gigante', testo: "Cinque minuti li hai chiesti nel 2009. Ogni mattina ti do un lavoro. Se non lo fai... chiamo Mister Mountain." },
  { chi: 'garonio', testo: "(No, Mister Mountain no...)" },
  { testo: "Muoviti con FRECCE/WASD (Shift per correre). Agisci con E o SPAZIO sulla casella evidenziata o vicino a persone, porte e oggetti." },
  { testo: "Occhio alle barre: lavorare alza STANCHEZZA e STRESS. Il bar abbassa lo stress, dormire a casa recupera tutto." },
];

// ---------------------------------------------------------------------
//  STORIA: scene che partono la mattina di certi giorni,
//  prima che il Gigante assegni la missione.
// ---------------------------------------------------------------------
export const STORIA = {
  3: [
    { testo: "Giorno 3. Al risveglio Garonio trova un biglietto attaccato al cuscino." },
    { testo: "«SE LEGGI QUESTO SEI ANCORA A LETTO. — Il Gigante»" },
    { chi: 'garonio', testo: "Come fa a saperlo..." },
    { chi: 'gigante', testo: "Perché ti conosco da trent'anni. Senti: le nutrie si stanno facendo furbe. Ieri una mi ha guardato negli occhi e ha sorriso. Coi denti arancioni." },
    { chi: 'gigante', testo: "Se vedi una nutria, la scacci. Se vedi due nutrie, le scacci. Se vedi Mister Mountain... beh, lì scappa tu." },
  ],
  4: [
    { testo: "Giorno 4. Squilla il telefono di casa. Nessuno usa più il telefono di casa. Tranne UNA persona." },
    { chi: 'mountain', testo: "Garonio. Sono io. Volevo solo dirti che ti sto guardando." },
    { chi: 'garonio', testo: "Da dove?!" },
    { chi: 'mountain', testo: "Da ovunque. Buona giornata di lavoro. *click*" },
    { chi: 'garonio', testo: "(Stanotte dormo con la luce accesa.)" },
  ],
  5: [
    { chi: 'gigante', testo: "Garonio, siediti. Ti devo parlare da padre a figlio." },
    { chi: 'garonio', testo: "Mi dai un aumento?" },
    { chi: 'gigante', testo: "No. Volevo dirti che tuo nonno, alla tua età, aveva già due trattori, quaranta maiali e la schiena distrutta." },
    { chi: 'gigante', testo: "Tu hai una Vespa che non parte e la schiena perfetta. Riflettici." },
    { chi: 'garonio', testo: "(Ci sto riflettendo. La schiena perfetta mi piace.)" },
  ],
  7: [
    { testo: "Giorno 7. Una settimana in azienda. Garonio è ancora vivo, e questo stupisce tutti." },
    { chi: 'gigante', testo: "Una settimana. Sette giorni. Al bar scommettevano che mollavi al secondo." },
    { chi: 'gigante', testo: "Io avevo scommesso sul terzo. Mi hai fatto perdere venti euro. Sono... quasi orgoglioso." },
    { chi: 'garonio', testo: "Quasi?" },
    { chi: 'gigante', testo: "Non tirare la corda. Al lavoro!" },
  ],
  10: [
    { chi: 'gigante', testo: "Ho sentito in paese che ti chiamano «il Re del Pisolino»." },
    { chi: 'garonio', testo: "È un titolo onorifico." },
    { chi: 'gigante', testo: "È una vergogna. Oggi voglio vedere il Re della Zappa. Muoviti, Maestà." },
  ],
};

// ---------------------------------------------------------------------
//  IL GIGANTE
// ---------------------------------------------------------------------
export const GIGANTE = {
  // quando ci parli e non c'è una missione
  nessunaMissione: [
    "Che vuoi? Vai a lavorare.",
    "Se sei venuto a chiedere soldi, la risposta è no. Se sei venuto a chiedere lavoro, è un miracolo.",
  ],
  // missione già finita
  missioneFatta: [
    "Hai finito? Allora vai al bar, prima che ci ripensi.",
    "Bravo... per modo di dire. Non montarti la testa.",
    "Oggi sei stato utile. Segno la data sul calendario.",
    "Hai finito presto. Sospetto. Hai corrotto le galline?",
  ],
  // missione fallita
  missioneFallita: [
    "Non parlarmi. Mister Mountain ti ha già detto tutto.",
    "Vai via. Ti guardo e mi sale la pressione.",
    "Domani si ricomincia. Cerca di essere un altro. Uno che lavora.",
  ],
  // missione in corso
  inCorso: [
    "Ancora qui? Devi: {missione}. Sei a {fatto}/{n} e la scadenza è alle {ora}.",
    "{fatto} su {n}. Alle {ora} passo a controllare. E non nasconderti nel fienile, ti ho visto ieri.",
    "Ti vedo fermo. Perché ti vedo fermo? Devi: {missione}, entro le {ora}. Sei a {fatto}/{n}.",
  ],
  // in corso, ma Garonio è stanchissimo (stanchezza oltre 70)
  inCorsoStanco: [
    "Hai la faccia di uno che ha lavorato tutto il giorno. Peccato che sei a {fatto}/{n}.",
    "Sei stanco? Anch'io. Sono stanco di guardarti. {fatto}/{n}, scadenza alle {ora}.",
  ],
  // toast quando ti becca a dormire sul lavoro
  beccatoDormire: [
    "GARONIO! Non si dorme sul lavoro!",
    "Ti pago per lavorare, non per fare la statua!",
    "Ah, il Re del Pisolino! Sveglia!",
    "Se russi un'altra volta ti vendo insieme ai maiali!",
  ],
  // le scelte quando gli parli
  scelte: {
    aumento: {
      etichetta: "Chiedi un aumento",
      risposte: [
        "Un aumento? Certo: da domani ti aumento le ore di lavoro.",
        "Ti do un aumento quando le nutrie pagheranno l'affitto.",
        "Ahahah. Bella questa. Raccontala anche al bar.",
        "Ne parliamo quando finisci una settimana senza Mister Mountain. Cioè mai.",
      ],
      stress: 3,
    },
    lamentati: {
      etichetta: "Lamentati della fatica",
      risposte: [
        "Fatica? Ai miei tempi si arava col cucchiaio. Col CUCCHIAIO, Garonio!",
        "Mio padre mi svegliava alle quattro con una secchiata di acqua del canale. Tu hai la sveglia del telefono. Viziato.",
        "La fatica fa bene. Lo dice anche il dottore. Il dottore non lo sa, ma lo dice.",
        "Lamentati pure. Intanto la zappa ti aspetta, lei non si lamenta mai.",
      ],
      minuti: 15,
      stress: -2,
    },
    niente: { etichetta: "Niente, torno al lavoro" },
  },
};

// ---------------------------------------------------------------------
//  MISTER MOUNTAIN
// ---------------------------------------------------------------------
export const MOUNTAIN = {
  // come entra in scena (voce narrante)
  arrivo: [
    "Il terreno trema... arriva MISTER MOUNTAIN!",
    "Un'ombra copre il sole. Non è una nuvola. È MISTER MOUNTAIN!",
    "Le galline smettono di fare coccodè. Silenzio. Passi pesanti... MISTER MOUNTAIN!",
    "Un trattore in lontananza si spegne da solo per la paura. Arriva MISTER MOUNTAIN!",
    "Profumo di dopobarba e delusione. È MISTER MOUNTAIN!",
  ],
  // perché arriva: due frasi, la prima specifica e la seconda di rincaro
  motivi: {
    missione: [
      "GARONIO! Il Gigante ti aveva dato UN compito. UNO!",
      "Un lavoro, una scadenza, un fallimento. Sei regolare come un orologio rotto.",
    ],
    nutrie: [
      "Le nutrie si stanno mangiando il campo e tu dov'eri?!",
      "Tre piante mangiate! Le nutrie hanno aperto un ristorante nel NOSTRO campo!",
    ],
    dormito: [
      "Ti hanno trovato a dormire in mezzo al lavoro. DI NUOVO.",
      "Sei crollato per terra come un sacco di patate. Almeno le patate si vendono.",
    ],
    svenuto: [
      "Sei svenuto! Lo stress ti ha steso, scansafatiche.",
      "Il Gigante ha dovuto chiamare il medico. Il medico ha riso. Poi ha mandato il conto.",
    ],
    // pronti per i mezzi (Vespa, Punto, trattori)
    trattore: [
      "Il TRATTORE! Hai rotto il TRATTORE! Lo sai quanto costa un trattore?!",
      "Quel trattore ha arato i campi di tuo nonno per quarant'anni. Tu l'hai finito in un pomeriggio.",
    ],
    vespa: [
      "La Vespa è di nuovo ferma in mezzo alla strada. E tu ci dormivi sopra.",
      "Quella Vespa ha più anni di te e più voglia di lavorare.",
    ],
    punto: [
      "La Punto è finita nel fosso! Di nuovo! Il fosso ormai la chiama per nome!",
      "Benzina finita, gomma bucata, specchietto appeso col nastro. Complimenti, pilota.",
    ],
    ritardo: [
      "Sei in ritardo. Sei sempre in ritardo. Sei nato in ritardo!",
      "Il Gigante ti ha aspettato un'ora. Un'ora che non tornerà mai più.",
    ],
  },
  // rincari generici (dopo la frase specifica, ne prende una a caso)
  rincari: [
    "Mio nonno a novant'anni lavorava più di te. E aveva una gamba sola.",
    "Lavorano più loro di te, e almeno loro si fanno la tana.",
    "Questa la racconto in tutto il paese.",
    "Sai cosa sei? Un'occasione persa con gli stivali.",
    "Ti hanno visto anche dal campanile. Hanno suonato le campane a lutto.",
    "Se la pigrizia fosse uno sport, saresti in nazionale. In panchina, ovviamente.",
    "Domani mattina ti voglio vedere lavorare. Se no torno. E porto un amico.",
  ],
  // cosa risponde Garonio
  risposteGaronio: [
    "...scusa.",
    "Ma io stavo per farlo!",
    "(Fingi di essere un albero.)",
    "È colpa delle nutrie. Mi hanno ipnotizzato.",
    "Avevo un piano. Il piano prevedeva un pisolino.",
    "(Se non respiro forse non mi vede.)",
    "Posso spiegare! ...No, non posso.",
  ],
  // come se ne va (voce narrante)
  uscita: [
    "Mister Mountain se ne va. L'erba dove ha camminato non ricrescerà più.",
    "Mister Mountain si allontana a passi pesanti. Il pollaio ricomincia a respirare.",
    "Mister Mountain sparisce dietro il capannone. Ma senti ancora il suo sguardo.",
  ],
};

// ---------------------------------------------------------------------
//  CASA E OFFICINA
// ---------------------------------------------------------------------
export const CASA = {
  sera: [
    "Il letto ti chiama. Ed è la voce più dolce del mondo.",
    "Il pigiama è lì, piegato dalla mamma. Ti guarda con amore. Ricambia.",
  ],
  giorno: [
    "Il divano è lì. Il Gigante pure, da qualche parte.",
    "Casa. Il cuscino ti fa l'occhiolino. Ma è ancora giorno...",
    "In cucina c'è la mamma che stira. «Già a casa? Tuo padre lo sa?»",
  ],
  pisolino: [
    "Zzz... un'ora di pace.",
    "Zzz... sogni un mondo senza zappe.",
    "Zzz... nel sogno le nutrie lavorano per te.",
  ],
};

export const OFFICINA = {
  benvenuto: [
    "Attrezzi, ricambi e odore di gasolio. Qui un giorno sistemerai la Vespa, la Punto e i trattori.",
    "Il meccanico alza gli occhi dal motore: «Garonio! Hai rotto qualcosa o vuoi comprare qualcosa? Di solito la prima.»",
  ],
};

// ---------------------------------------------------------------------
//  BAR
// ---------------------------------------------------------------------
export const BAR = {
  saluti: [
    "Il solito, Garonio?",
    "Ancora tu? Oggi cosa ti ha fatto tuo padre?",
    "Siediti, che hai la faccia di uno che ha visto Mister Mountain.",
    "Lo sgabello libero è quello in fondo. Quello di Tarcisio non toccarlo, morde.",
  ],
  ancora: [
    "Qualcos'altro?",
    "Altro? Il tuo conto è lungo come la Via Emilia.",
    "Vuoi qualcos'altro o resti qui a guardare il frigo dei gelati?",
  ],
  // cosa succede quando ordini (testi del messaggio a schermo)
  ordini: {
    panino: ["Gnam. Stress -15", "Panino con la mortadella. Il mondo è un posto migliore. Stress -15"],
    caffe: ["Caffè doppio. Stanchezza -12", "Caffè così forte che senti i colori. Stanchezza -12"],
    birra: ["Ahh. Stress -22", "Birra fresca. Per un attimo dimentichi il Gigante. Stress -22"],
  },
  // voci di paese: Garonio ascolta le chiacchiere al bancone
  voci: {
    etichetta: "Ascolta le chiacchiere (gratis)",
    frasi: [
      { chi: 'pina', testo: "Dicono che le nutrie odiano il rumore. Mio cugino le scaccia cantando Albano. Funziona, ma poi scappano anche i vicini." },
      { chi: 'pina', testo: "Le galline fanno più uova se mangiano la mattina presto. Lo dice la Gina, che di galline se ne intende. E di pettegolezzi." },
      { chi: 'tarcisio', testo: "Ai miei tempi... hic... il caffè si beveva prima di zappare. Così la zappa sembrava più leggera. Hic." },
      { chi: 'barista', testo: "In officina hanno una zappa affilata nuova. Il meccanico dice che zappa da sola. Il meccanico dice tante cose." },
      { chi: 'geometra', testo: "Ho calcolato che una rete anti-nutria riduce le incursioni del 50%. Più o meno. Ho arrotondato. Sono un geometra." },
      { chi: 'pina', testo: "Ho visto Mister Mountain al supermercato. Comprava solo yogurt magri. Fa paura anche così." },
      { chi: 'barista', testo: "Se lavori tanto e non mangi, poi crolli. Me l'ha insegnato la vita. E il mio ex." },
      { chi: 'ermes', testo: "Io col trattore nuovo faccio un campo in mezz'ora. Tu con la zappa? Una settimana? Ahahah!" },
    ],
    stress: -3,
    minuti: 20,
  },
  // avventori ostili: ne arriva uno ogni tanto dopo che hai ordinato
  probabilitaAvventore: 0.3,
  avventori: [
    {
      id: 'bullo',
      nome: "Bruno «il Toro»",
      battute: [
        "Ehi Garonio! È vero che tuo padre ti paga per dormire?",
        "Guarda chi c'è, il re delle nutrie! Quante ne hai scacciate oggi, zero?",
        "Garonio, ho visto la tua Vespa. Anzi no, l'ho spinta io fino al distributore.",
      ],
      risposteBuone: [
        "Almeno io un padre che mi dà lavoro ce l'ho. Tu hai solo quello sgabello.",
        "Bruno, l'unica cosa che hai mai scacciato è la voglia di lavarti.",
      ],
      riuscita: 0.5,
    },
    {
      id: 'tarcisio',
      nome: "Il Sciur Tarcisio",
      battute: [
        "Questo è il mio sgabello. Lo era anche ieri. E domani. Hic.",
        "Tuo nonno sì che era un lavoratore. Tu sei... hic... un'altra cosa. Non so cosa. Ma un'altra cosa.",
        "Offrimi un bianchino e ti racconto della volta che ho vinto la gara di briscola nel '78.",
      ],
      risposteBuone: [
        "Tarcisio, lo sgabello ha preso la tua forma. Ormai siete parenti.",
        "Me l'hai raccontata ieri la briscola del '78. E l'altro ieri. E nel 2012.",
      ],
      riuscita: 0.65,
    },
    {
      id: 'pina',
      nome: "La Pina",
      battute: [
        "Garonio! In paese dicono che ti sei addormentato in piedi in mezzo al pollaio. Vero? Lo dico a tutti, eh.",
        "Ho sentito che Mister Mountain ti ha sgridato di nuovo. Racconta, racconta! Voglio i dettagli.",
        "Tua madre dice che sei bravo ragazzo. Io dico che tua madre è una santa.",
      ],
      risposteBuone: [
        "Pina, se le chiacchiere fossero mais saresti la più ricca della provincia.",
        "Certo, raccontalo pure. Così dopo raccontiamo di te e del postino.",
      ],
      riuscita: 0.45,
    },
    {
      id: 'geometra',
      nome: "Il Geometra Ballarin",
      battute: [
        "Garonio, ho misurato il tuo campo. Le file sono storte di dodici gradi. Dodici! Una vergogna catastale.",
        "Sai cos'è un lavoratore? È uno che... ah, scusa, non puoi saperlo.",
        "Io ho studiato. Tu hai studiato? Le nutrie non contano.",
      ],
      risposteBuone: [
        "Le file sono storte apposta, geometra. Così le nutrie si perdono.",
        "Hai studiato tanto per finire al bar alle tre del pomeriggio come me. Complimenti.",
      ],
      riuscita: 0.5,
    },
    {
      id: 'ermes',
      nome: "Il cugino Ermes",
      battute: [
        "Garonio! Hai visto il mio trattore nuovo? Ha l'aria condizionata. E la radio. E il frigo. Tu hai una zappa.",
        "Mio padre mi ha regalato un capannone. Il tuo ti regala Mister Mountain. Ognuno ha quel che si merita.",
        "Ermes ti dà una pacca sulla spalla troppo forte. «Cugino! Sempre il solito scansafatiche, eh?»",
      ],
      risposteBuone: [
        "Il trattore te l'ha comprato tuo padre, Ermes. Anche la patente, dicono.",
        "Ermes, l'aria condizionata ce l'hai nel cervello: è vuoto e soffia.",
      ],
      riuscita: 0.4,
    },
  ],
  // esiti delle scelte con un avventore
  rispondi: {
    etichetta: "Rispondi a tono",
    bene: "Il bar ride. {nome} se ne va borbottando. Stress -5",
    male: [
      "La risposta ti esce storta e tutti ridono di te. Stress +12",
      "Volevi dire una cosa intelligente, ti è uscito un rutto. Tutti ridono. Stress +12",
      "Balbetti. {nome} ti imita. Ridono anche i bicchieri. Stress +12",
    ],
    stressBene: -5, xpBene: 3, stressMale: 12,
  },
  ignora: {
    etichetta: "Ignoralo",
    testi: [
      "Fai finta di niente, ma ti rode. Stress +6",
      "Guardi fisso il tuo bicchiere. Il bicchiere ti capisce. Ma ti rode lo stesso. Stress +6",
      "Conti fino a dieci. Arrivi a tre e ti viene il mal di testa. Stress +6",
    ],
    stress: 6,
  },
};

// Aspetto dei personaggi del bar (ritratti nei dialoghi), stesso formato di src/pixel.js
export const ASPETTO = {
  tarcisio: { w: 16, h: 24, skin: '#e8a080', hair: '#c8c8c8', hairStyle: 'bald', shirt: '#6a5a3a', pants: '#4a4a4a', boots: '#222', mustache: '#d8d8d8', belly: true, eyes: 'sleepy' },
  pina: { w: 16, h: 24, skin: '#f0c8a8', hair: '#c8c0e0', hairStyle: 'long', shirt: '#9a4a8a', pants: '#4a3a5a', boots: '#222', eyes: 'normal' },
  geometra: { w: 16, h: 24, skin: '#f0c8a8', hair: '#3a2a1a', hairStyle: 'flat', shirt: '#3a6a9a', tie: '#e0c020', pants: '#2a2a3a', boots: '#111', eyes: 'normal' },
  ermes: { w: 16, h: 24, skin: '#e8b48a', hair: '#d8a040', hairStyle: 'messy', hat: '#d03030', shirt: '#2a8a4a', pants: '#3a5fa8', boots: '#4a2e1c', eyes: 'normal' },
};
