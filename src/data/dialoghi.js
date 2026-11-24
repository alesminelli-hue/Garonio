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
    sconfitta: [
      "Ti sei fatto mettere sotto da una bestiola?! Una BESTIOLA!",
      "Domani ti mando a combattere con le galline, così almeno pareggi.",
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
  tarcisio: { sprite: 'ubriaco_birra', w: 16, h: 24, skin: '#e8a080', hair: '#c8c8c8', hairStyle: 'bald', shirt: '#6a5a3a', pants: '#4a4a4a', boots: '#222', mustache: '#d8d8d8', belly: true, eyes: 'sleepy' },
  pina: { sprite: 'nonna', w: 16, h: 24, skin: '#f0c8a8', hair: '#c8c0e0', hairStyle: 'long', shirt: '#9a4a8a', pants: '#4a3a5a', boots: '#222', eyes: 'normal' },
  geometra: { sprite: 'geometra', w: 16, h: 24, skin: '#f0c8a8', hair: '#3a2a1a', hairStyle: 'flat', shirt: '#3a6a9a', tie: '#e0c020', pants: '#2a2a3a', boots: '#111', eyes: 'normal' },
  ermes: { sprite: 'felpa_cappellino', w: 16, h: 24, skin: '#e8b48a', hair: '#d8a040', hairStyle: 'messy', hat: '#d03030', shirt: '#2a8a4a', pants: '#3a5fa8', boots: '#4a2e1c', eyes: 'normal' },
};

// ---------------------------------------------------------------------
//  TRAMA DEL BAR: «FARSI RISPETTARE» (GDD 18.2) — il codice sta in src/bar.js
//  Rispetto 0-100, ranghi, regola di Loredana, i sei avventori e le loro
//  storie in tre incontri. Orgoglio = quanto resiste l'avventore,
//  Rabbia = quanto è vicino a menare le mani (a 100 si fa la rissa).
// ---------------------------------------------------------------------
export const BAR_STORIA = {
  rispettoIniziale: 10,
  ranghi: [
    { da: 0,  nome: 'Lo zimbello',          sconto: 0,    sblocca: 'tutti ti prendono in giro, prezzi pieni' },
    { da: 20, nome: 'Uno qualunque',        sconto: 0,    sblocca: 'il tavolo delle carte: briscola con Tarcisio' },
    { da: 40, nome: 'Uno che risponde',     sconto: 0.10, sblocca: 'thermos di caffè, sconto 10%, prime voci sulle bestie' },
    { da: 60, nome: 'Uno da non provocare', sconto: 0.20, sblocca: 'i clienti deboli non ti sfidano più, sconto 20%' },
    { da: 80, nome: 'Il Re del bancone',    sconto: 0.20, sblocca: 'posto fisso al bancone, Loredana ti offre il caffè ogni mattina' },
  ],
  rangoSu: "Al bar ora sei «{rango}»: {sblocca}.",
  rangoGiu: "Al bar sei sceso a «{rango}». La gente parla.",
  // tre risse nella stessa settimana e Loredana chiude la porta per due giorni
  regolaLoredana: {
    risse: 3, giorni: 2,
    avviso: "Garonio, questa settimana hai fatto {n} risse. Alla terza ti lascio fuori due giorni. Lo dico per il bancone, non per te.",
    bando: "Basta! Tre risse in una settimana! Per due giorni qui dentro non metti piede. Vai a sfogarti sulle nutrie.",
    porta: [
      "Loredana ti vede dalla vetrina e scuote la testa. «Torna dopodomani, Garonio.»",
      "Sulla porta c'è un foglio: «GARONIO NO». Con la tua faccia disegnata. Somigliante.",
    ],
  },
  caffeDelRe: [
    "Loredana ti mette davanti il caffè senza che tu lo chieda. «Offre la casa, Re del bancone.» Stanchezza -12",
    "«Il solito per il mio Re.» Il caffè è già lì, caldo. Stanchezza -12",
  ],
  thermos: "Loredana ti passa un thermos ammaccato. «Tieni, per il caffè. Uno che risponde come te deve restare sveglio.» (Thermos di caffè: portafortuna)",
  vociBestie: [
    "Loredana abbassa la voce: «Dicono che nel canale ci sia una nutria grande come un vitello. La Pina sa dove. Ma la Pina parla solo con chi la batte.»",
    "«Tarcisio di notte racconta di un lupo bianco nel bosco. Da sobrio però non ne parla mai. Offrigli da bere, magari.»",
    "«Nei capannoni i ratti hanno un capo. L'ha visto il veterinario e si è licenziato.»",
  ],
  pinaParla: [
    "La Pina in paese racconta che ti sei addormentato nel letame. Rispetto -2",
    "La Pina dice al mercato che hai paura delle galline. Rispetto -2",
    "La Pina giura che Mister Mountain ti ha messo in castigo. Rispetto -2",
  ],

  // le quattro scelte di un dialogo con un avventore (numeri facili da ritoccare)
  scelte: {
    rispondi: { etichetta: 'Rispondi a tono', riuscita: 0.6, orgoglio: [24, 34], rabbia: 14, rabbiaMale: 10, stressMale: 6 },
    ignora:   { etichetta: 'Ignora', stress: 6, rabbia: -6, maxIgnora: 3 },
    offri:    { etichetta: 'Offri da bere', prezzo: 4, rabbia: -30, orgoglio: 8 },
    provoca:  { etichetta: 'Provoca', riuscita: 0.5, orgoglio: [38, 50], rabbia: 34 },
    parole:   { etichetta: 'Chiudila a parole (Parlantina)', riuscita: 0.55 },
  },
  testiScelte: {
    rispondiBene: ["Colpito. Al bar qualcuno ride, e non di te.", "Bella questa. Loredana fa finta di non aver sentito, ma sorride.", "Silenzio. Poi una risata da un tavolo. Punto per Garonio."],
    rispondiMale: ["Ti si incastra la frase in gola. Esce un verso.", "Volevi dire una cosa intelligente, ti è uscito un rutto.", "Balbetti. Ridono anche i bicchieri."],
    ignora: ["Guardi fisso il bicchiere. Il bicchiere ti capisce. Ma ti rode.", "Conti fino a dieci. Arrivi a tre.", "Fai finta di niente. Fuori sei calmo, dentro sei il Gigante."],
    offri: ["Due bianchini, Loredana. La faccia di {nome} si ammorbidisce.", "Un giro offerto da te. {nome} brontola, ma beve.", "«Questo lo offro io.» {nome} non se l'aspettava."],
    provocaBene: ["Lo dici davanti a tutti. {nome} diventa viola. Il bar fa «uuuh».", "Colpo basso, ma preciso. {nome} stringe i pugni."],
    provocaMale: ["La provocazione cade nel vuoto. Però {nome} si arrabbia lo stesso.", "Nessuno ride. {nome} invece si gonfia come un tacchino."],
    paroleBene: "Garonio trova la frase perfetta. Il bar applaude. {nome} non ha niente da rispondere.",
    paroleMale: "Garonio cerca la frase perfetta. Trova solo «eh».",
    umiliato: ["{nome} prende la giacca e se ne va senza più una parola. Rispetto +{r}", "{nome} si siede in fondo e non parla più. Rispetto +{r}"],
    scappato: "{nome} ride ancora un po', poi si stufa. Tu hai fatto la figura del moscio. Rispetto -{r}",
    rissa: ["{nome} rovescia la sedia. «Fuori! Anzi no, qui!»", "Il bicchiere vola. {nome} ha deciso: si fa a botte."],
    // Pina non mena: a Rabbia 100 se ne va e sparge voci
    pinaVia: "La Pina se ne va sbattendo la porta. Domani lo saprà tutto il paese. Rispetto -{r}",
  },
  rissa: {
    scegliArma: "Al bar le armi restano fuori dalla porta. Con cosa combatti?",
    vinta: "Vittoria al bar! Rispetto +{r}. Loredana: «Chi paga i bicchieri?»",
    persa: "Garonio finisce sotto il tavolo. Rispetto -{r}, stress +10",
    fuga: "Garonio scappa dal retro. Lo hanno visto tutti. Rispetto -{r}",
  },
  rispetto: { vittoriaParole: 6, rissaVinta: 8, rissaPersa: 8, fuga: 5, ignorato: 3, pinaPersa: 6, casuale: 3 },

  // ---- gli avventori: liv = livello minimo di Garonio perché ci sia, posto = dove sta nel bar
  avventori: {
    tarcisio: {
      nome: 'Il Sciur Tarcisio', liv: 1, posto: 'carte', ore: [10, 24], nemico: 'tarcisio', offriSempre: true,
      chiacchiere: ["Hic. Ciao Garonio. Siediti, che ti racconto del '78.", "Il bianchino di Loredana è il migliore della Bassa. Anche l'unico che bevo, ma il migliore."],
      incontri: [
        { titolo: 'Lo sgabello conteso', orgoglio: 60, rabbia: 30,
          intro: "Tarcisio ti guarda storto. «Ti sei seduto vicino al mio sgabello. Vicino! È quasi peggio che sopra. Hic.»",
          battute: ["Tuo nonno sì che era un lavoratore. Tu... hic... sei un'altra cosa.", "Ai miei tempi a vent'anni si arava a mano. Con le mani! Hic.", "Hai la faccia di uno che dorme in piedi. Lo so perché lo faccio anch'io."],
          risposte: ["Tarcisio, lo sgabello ha preso la tua forma. Ormai siete parenti.", "Ai tuoi tempi c'erano anche i dinosauri, ma non li rimpiange nessuno."],
          vinto: "Tarcisio borbotta e si gira verso il muro. «Domani ne riparliamo. Se mi ricordo.»" },
        { titolo: 'Il bianchino', orgoglio: 70, rabbia: 45,
          intro: "Tarcisio ha già bevuto tre bianchini. «Garonio! Offrimi il quarto e siamo amici. Se no... hic... siamo nemici. Non c'è il mezzo.»",
          battute: ["Il quarto bianchino è quello che fa bene. Lo dice il dottore. Il mio dottore è Loredana.", "Sei tirchio come tuo padre. Anzi no, di più.", "Hic. Chi sei? Ah sì. Quello tirchio."],
          risposte: ["Tarcisio, se ti offro il quarto poi chi ti porta a casa, la Vigilessa?", "Il tuo fegato mi ha scritto: dice di smetterla."],
          vinto: "Tarcisio ti fa il gesto delle corna, poi si addormenta sul tavolo." },
        { titolo: 'La leggenda del lupo bianco', orgoglio: 80, rabbia: 40, serveAmico: 2,
          intro: "Tarcisio è stranamente serio. «Garonio. Vuoi sapere una cosa che non ho mai detto a nessuno? Prima dimostrami che sei un amico.»",
          battute: ["Gli amici veri offrono. Gli altri ascoltano e basta.", "Io parlo solo con chi beve con me. È una regola. L'ho inventata adesso."],
          risposte: ["Tarcisio, io ti ascolto anche senza bere. È un miracolo, ma è così."],
          nonAmico: "«Mi hai battuto, ma non mi hai mai offerto niente. Le storie vere si raccontano col bicchiere in mano.» (Offrigli da bere negli incontri: da amico ti racconterà tutto)",
          leggenda: [
            "Tarcisio si avvicina. Sa di bianchino e di segreto.",
            "«Nel bosco a nord, d'inverno, c'è un lupo bianco grande come un vitello. Il Re dei Lupi. Ha mangiato il mio cane nel '78. Anzi, il cane è scappato con lui. Non so cos'è peggio.»",
            "«Si sente ululare quando c'è la luna piena. Se lo trovi, salutamelo. Hic. Anzi no, non salutarlo.»",
          ] },
      ],
      fine: "Tarcisio ti offre lui un bianchino. È la prima volta dal 1978. Ora siete amici.",
    },
    pina: {
      nome: 'La Pina', liv: 2, posto: 'tavolo1', ore: [9, 20], parole: true,
      chiacchiere: ["Ciao Garonio. Non ho niente da dirti. Per ora.", "Ho smesso con i pettegolezzi. Quasi. Diciamo che li tengo per me."],
      incontri: [
        { titolo: 'La voce del letame', orgoglio: 65, rabbia: 20,
          intro: "La Pina ti chiama dal tavolo. «Garonio! In paese dicono che ti sei addormentato nel letame. È vero? Racconta, così lo dico giusto.»",
          battute: ["Tua madre è una santa. Te lo dico perché con te ci vuole pazienza.", "L'ho detto solo alla Gina. E alla Rosa. E al postino. Basta.", "Dicono che Mister Mountain ti chiami «il materasso». Io non l'ho detto. L'ho solo ripetuto."],
          risposte: ["Pina, se le chiacchiere fossero mais saresti la più ricca della provincia.", "Certo, raccontalo pure. Così dopo raccontiamo di te e del postino."],
          vinto: "La Pina prende la borsetta. «Va bene, va bene. Ma la storia del letame la tengo.»" },
        { titolo: 'Il segreto del postino', orgoglio: 75, rabbia: 25,
          intro: "La Pina ha saputo qualcosa. «Garonio, è vero che il Gigante ti ha tolto la paghetta? Me l'ha detto uno che lo sa.»",
          battute: ["Uno che lo sa è uno che lo sa. Non posso dire chi.", "La Vigilessa ti ha multato tre volte. Lo dice la Vigilessa. Cioè, la cugina.", "Al bar sei lo zimbello, lo sanno tutti. Io lo dico solo più forte."],
          risposte: ["Pina, il tuo «uno che lo sa» è il postino. Che legge le lettere degli altri. Anche le tue.", "La paghetta no, ma tu hai perso la tua dignità nel '95."],
          vinto: "La Pina diventa rossa. «Il postino non c'entra niente!» Poi se ne va. Il postino al bancone tossisce." },
        { titolo: 'La tana nel canale', orgoglio: 85, rabbia: 30,
          intro: "La Pina ti guarda con rispetto, per la prima volta. «Ultima sfida, Garonio. Se mi batti ancora, smetto di parlare di te. E ti dico una cosa che so solo io.»",
          battute: ["Io so tutto di tutti. Anche di te. Anche le cose che non sai tu.", "Sai cosa dicono di tuo padre? No? Allora non te lo dico."],
          risposte: ["Pina, tu sai tutto di tutti ma nessuno sa niente di te. Perché non fai niente.", "Se sapere le cose servisse, saresti sindaco."],
          vinto: "La Pina sospira. «Hai vinto. Basta voci su di te.»",
          segreto: [
            "La Pina si guarda intorno e abbassa la voce.",
            "«Il Re delle Nutrie. Esiste. Sta dove il canale fa la curva, sotto le canne. L'ho visto mentre... non importa cosa facevo lì.»",
            "«Ha i denti arancioni grandi come tegole. Non dirlo a nessuno. Tanto lo dico io.»",
          ] },
      ],
      fine: "La Pina ti saluta con un cenno. In paese ora dice solo cose buone di te. Più o meno.",
    },
    geometra: {
      nome: 'Il Geometra Ballarin', liv: 5, posto: 'tavolo2', ore: [11, 22], nemico: 'geometra',
      chiacchiere: ["Garonio, il tuo bancone è storto di due gradi. Non il tuo, quello di Loredana. Ma anche il tuo.", "Ho ricalcolato il catasto del paese. Tre case non esistono. Ci abitano lo stesso."],
      incontri: [
        { titolo: 'Le file storte', tipo: 'quiz', soglia: 2,
          intro: "Il Geometra Ballarin srotola un metro. «Garonio, le tue file sono storte di dodici gradi. Ti sfido: tre domande. Se perdi, le rifai tutte.»",
          domande: [
            { d: "Quanti metri quadri fa una biolca?", r: ["Circa 2.900", "100, come un campo da calcio", "Dipende da quanto beve il geometra"], giusta: 0 },
            { d: "Come si chiama la strada sterrata in mezzo ai campi?", r: ["Tangenziale", "Capezzagna", "Viottolo catastale"], giusta: 1 },
            { d: "Quanta acqua serve per allagare una nutria?", r: ["Nessuna, le nutrie nuotano", "Due secchi", "Una turbina di Mister Frank"], giusta: 0 },
          ],
          vintoQuiz: "Ballarin chiude il metro con uno schiocco. «Fortuna! Solo fortuna! Adesso ti misuro la faccia!» (rissa debole)",
          persoQuiz: "Ballarin sorride. «Lo sapevo. Riprova quando hai studiato. Cioè mai.» Rispetto -3",
          rissa: true },
        { titolo: 'Il regolamento edilizio', orgoglio: 80, rabbia: 30,
          intro: "Ballarin ha portato un faldone. «Garonio, il tuo pollaio non è a norma. Articolo 47, comma 3. Lo sai cosa dice?»",
          battute: ["Il comma 3 dice che sei un abusivo. Più o meno.", "Io ho studiato. Tu hai studiato? Le nutrie non contano.", "Una laurea è per sempre. Il tuo pollaio no."],
          risposte: ["Geometra, il comma 3 l'hai scritto tu. Sul tovagliolo. Ieri.", "Hai studiato tanto per finire al bar alle tre del pomeriggio come me."],
          vinto: "Ballarin chiude il faldone. «Ne riparliamo in sede opportuna.» Lascia una matita. Rotta." },
        { titolo: 'La mappa catastale', tipo: 'quiz', soglia: 2,
          intro: "Ballarin è stanco di perdere. «Ultima sfida, Garonio. Se vinci, ti do una cosa che vale più di un trattore.»",
          domande: [
            { d: "Dove si mettono le uova delle galline per venderle?", r: ["Alla cassa dell'azienda", "Dal Bubetto", "In tasca al postino"], giusta: 0 },
            { d: "Cosa misura il geometra col teodolite?", r: ["Gli angoli", "La pressione delle mucche", "La pazienza del Gigante"], giusta: 0 },
            { d: "A che ora chiude il bar di Loredana?", r: ["Mai, per Tarcisio", "Mezzanotte", "Quando lo dice la Vigilessa"], giusta: 1 },
          ],
          vintoQuiz: "Ballarin ti consegna un rotolo ingiallito. «La mappa catastale del '62. Ci sono segnati i buchi, le tane e i fossi. Non dire a nessuno dove l'hai presa.»",
          persoQuiz: "«Quasi, Garonio. Quasi non conta, tranne nei terremoti.» Rispetto -3",
          premio: 'mappaCatastale' },
      ],
      fine: "Ballarin ti saluta con un cenno misurato. Esattamente di trenta gradi.",
    },
    ermes: {
      nome: 'Il cugino Ermes', liv: 7, posto: 'biliardo', ore: [16, 24], nemico: 'ermes',
      chiacchiere: ["Cugino! Ho il trattore nuovo. Te l'ho già detto? Te lo ridico.", "Mio padre dice che sei bravo. Mio padre sbaglia spesso."],
      incontri: [
        { titolo: 'Il trattore con il frigo', orgoglio: 80, rabbia: 30,
          intro: "Ermes ti dà una pacca troppo forte. «Cugino! Hai visto il mio trattore nuovo? Ha l'aria condizionata. E il frigo. Tu hai una zappa.»",
          battute: ["Mio padre mi ha regalato un capannone. Il tuo ti regala Mister Mountain.", "Sempre il solito scansafatiche, eh cugino?", "Il tuo trattore è più vecchio del Tarcisio. E fa lo stesso rumore."],
          risposte: ["Il trattore te l'ha comprato tuo padre, Ermes. Anche la patente, dicono.", "Ermes, l'aria condizionata ce l'hai nel cervello: è vuoto e soffia."],
          vinto: "Ermes smette di ridere. «Va bene, cugino. Allora sfida vera: gara di trattori sulla capezzagna. Domani.»" },
        { titolo: 'Gara sulla capezzagna', tipo: 'gara',
          intro: "La capezzagna all'alba. Il trattore di Ermes brilla. Il tuo tossisce. Ermes: «Al tre! Uno... TRE!»",
          tratti: [
            { d: "Prima curva vicino al fienile. Ermes la prende larga.", r: [{ t: 'Tagli dentro nel fosso', rischio: 0.45, guadagno: 3 }, { t: 'Curva pulita', rischio: 0.1, guadagno: 1 }, { t: 'Freni e aspetti', rischio: 0, guadagno: 0 }] },
            { d: "Rettilineo. Ermes accende la radio a tutto volume.", r: [{ t: 'Giù col piede, tutto gas', rischio: 0.35, guadagno: 2 }, { t: 'Clacson per disturbarlo', rischio: 0.2, guadagno: 1 }, { t: 'Andatura costante', rischio: 0.05, guadagno: 1 }] },
            { d: "Ultimo tratto: una balla di fieno in mezzo alla strada!", r: [{ t: 'La prendi in pieno', rischio: 0.5, guadagno: 3 }, { t: 'La schivi sull\'erba', rischio: 0.2, guadagno: 2 }, { t: 'Rallenti', rischio: 0, guadagno: 0 }] },
          ],
          ermes: 3.5,
          bene: "Ce la fai! Il trattore regge.", male: "Il trattore sbanda, perdi terreno.",
          vintaGara: "Arrivi primo! Ermes scende dal trattore rosso in faccia. «Hai barato! In piazza, adesso! A mani nude!» (rissa in piazza)",
          persaGara: "Ermes arriva primo e ti suona il clacson in faccia per un minuto intero. Rispetto -4",
          rissa: true, piazza: true },
        { titolo: 'La rivincita in piazza', orgoglio: 90, rabbia: 50, piazza: true,
          intro: "Ermes ti aspetta fuori dal bar con mezza famiglia. «Cugino, la rissa di ieri non conta. Rivincita!»",
          battute: ["Ieri ero distratto. Oggi no.", "Lo dico alla nonna che mi hai menato.", "Cugino, oggi ti faccio vedere il mio frigo da vicino."],
          risposte: ["Dillo pure alla nonna. Lei sta dalla mia parte da quando le hai rotto il presepe.", "Ermes, l'unica cosa che vinci tu sono le lotterie di tuo padre."],
          vinto: "Ermes ti stringe la mano, alla fine. «Va bene, cugino. Sei uno tosto. Se ti serve il rimorchio, è tuo. Prestato. Prestato, eh!»",
          premio: 'rimorchio' },
      ],
      fine: "Ermes ti offre un giro e chiama «cugino» con un tono diverso. Quasi rispetto.",
    },
    bruno: {
      nome: 'Bruno «il Toro»', liv: 12, posto: 'bancone', ore: [17, 24], nemico: 'bruno',
      chiacchiere: ["Garonio. Siediti. Non lì, quello è il posto del Re. Cioè il mio.", "Bevo il latte. Il latte fa i muscoli. La birra fa il resto."],
      incontri: [
        { titolo: 'Il posto al bancone', orgoglio: 95, rabbia: 40,
          intro: "Bruno «il Toro» occupa due sgabelli. «Garonio. Questo è il mio bancone. Tu stai in fondo, vicino al frigo dei gelati.»",
          battute: ["È vero che tuo padre ti paga per dormire?", "Ho visto la tua Vespa. Anzi no, l'ho spinta io fino al distributore.", "Ho braccia più grosse del tuo campo di mais."],
          risposte: ["Bruno, l'unica cosa che hai mai sollevato è il prezzo della birra.", "Due sgabelli per un solo cervello. Spreco."],
          vinto: "Bruno si alza, enorme. «Domani. Braccio di ferro. Davanti a tutti.»" },
        { titolo: 'Braccio di ferro', tipo: 'braccio',
          intro: "Tutto il bar intorno al tavolo. Loredana fa da arbitro. Bruno appoggia il gomito come un'incudine. «Pronto, moscerino?»",
          mosse: [
            { t: 'Spingi forte', forza: 18, rischio: 0.35, fatica: 4 },
            { t: 'Tieni duro', forza: 6, rischio: 0.05, fatica: 2 },
            { t: 'Finta e strattone', forza: 28, rischio: 0.55, fatica: 6 },
          ],
          bruno: [8, 16],
          vintaBraccio: "Il polso di Bruno tocca il tavolo. Il bar esplode. Bruno è viola: «Ragazzi! Prendetelo!» (rissa: Bruno e due amici)",
          persoBraccio: "Il tuo polso fa «crac». Non si è rotto, ma il rispetto sì. Rispetto -5",
          rissa: true, nemici: ['bruno', 'amicoBruno', 'amicoBruno'] },
        { titolo: 'La corona del bancone', orgoglio: 100, rabbia: 55, nemici: ['bruno', 'amicoBruno'],
          intro: "Bruno ha portato i rinforzi. «Ultima volta, Garonio. Chi vince stasera è il Re del bancone. Per sempre.»",
          battute: ["Il bancone è mio da quindici anni. Era di mio padre prima.", "Tu sei un ragazzino con la zappa. Io sono il Toro.", "Nessuno mi ha mai battuto due volte. Neanche una, a dire il vero."],
          risposte: ["Bruno, il Toro di cui parli è quello della pubblicità del ragù.", "Quindici anni sullo stesso sgabello. Non è un regno, è un'emorroide."],
          vinto: "Bruno si inchina. Il bar applaude in piedi. Loredana ti spinge il tuo sgabello: «Il posto del Re è tuo.»",
          premio: 'reBancone' },
      ],
      fine: "Bruno ora ti offre il latte. Dice che fa i muscoli. Ti chiama «Maestà», con un po' di ironia.",
    },
    rocco: {
      nome: 'Rocco il camionista', liv: 15, posto: 'tavolo3', ore: [19, 24], nemico: 'rocco', serveRe: true,
      chiacchiere: ["Bel paese. Piccolo. Lo attraverso in tre marce.", "Ho fatto Lisbona-Varsavia senza dormire. Tu hai dormito oggi? Si vede."],
      incontri: [
        { titolo: 'Il forestiero', orgoglio: 100, rabbia: 40,
          intro: "Un camion da quaranta tonnellate parcheggiato in piazza. Dentro il bar, un uomo con la canotta: «Mi hanno detto che qui c'è un Re. Sei tu? Ahahah.»",
          battute: ["Ho visto re più grossi nelle stazioni di servizio.", "Il tuo regno finisce al cartello del paese. Il mio no.", "Il bancone mi piace. Me lo prendo."],
          risposte: ["Rocco, qui il re si fa col rispetto. Tu hai solo il gasolio.", "Quaranta tonnellate di camion e neanche un grammo di simpatia."],
          vinto: "Rocco ride, ma meno. «Ok, Re. Domani torno con la cabina carica.»" },
        { titolo: 'La prova del camionista', tipo: 'braccio',
          intro: "Rocco schiaccia una lattina con due dita. «Braccio di ferro, come si fa nelle aree di sosta. Chi perde paga il pieno.»",
          mosse: [
            { t: 'Spingi forte', forza: 16, rischio: 0.4, fatica: 4 },
            { t: 'Tieni duro', forza: 6, rischio: 0.05, fatica: 2 },
            { t: 'Finta e strattone', forza: 26, rischio: 0.6, fatica: 6 },
          ],
          bruno: [10, 18],
          vintaBraccio: "Rocco guarda il polso come se non fosse suo. «Domani si fa sul serio.»",
          persoBraccio: "Rocco ti batte e ti fa pagare il pieno a parole. Rispetto -5" },
        { titolo: 'Il Re contro il Re della strada', orgoglio: 120, rabbia: 60, piazza: true,
          intro: "Rocco ti aspetta in piazza col motore acceso. «Re del bancone contro Re della strada. Solo uno resta.»",
          battute: ["Ho investito un cinghiale e il cinghiale si è scusato.", "Sai quante piazze ho visto? Tutte uguali. E tutti i re uguali.", "Dopo di te mi prendo anche il distributore."],
          risposte: ["Rocco, qui non è un'area di sosta. Qui è casa mia.", "Il tuo camion ha più cavalli di te. E più cervello."],
          vinto: "Rocco risale sul camion. «Rispetto, Re.» Suona il clacson due volte e sparisce verso la provinciale. Il paese è tuo.",
          premio: 'rocco' },
      ],
      fine: "Ogni tanto arriva una cartolina da Varsavia: «Al Re del bancone. Rocco.»",
    },
  },

  // la briscola con Tarcisio al tavolo delle carte (dal rango «Uno qualunque»)
  briscola: {
    posta: 5, mani: 5,
    intro: "Tarcisio mescola il mazzo con le mani che tremano. «Briscola a cinque mani, cinque euro. Comincio io, che sono vecchio.»",
    vinta: "Hai vinto {tuoi} a {suoi}! Tarcisio paga borbottando. +{soldi}€, rispetto +2",
    persa: "Tarcisio vince {suoi} a {tuoi}. «Il '78 non era fortuna.» -{soldi}€",
    pari: "Pareggio, {tuoi} a {suoi}. Tarcisio si tiene i soldi «per il disturbo».",
    poco: "Non hai cinque euro. Tarcisio non gioca coi poveri. È una regola. L'ha inventata adesso.",
  },
};

// Aspetto di Bruno e Rocco (Bruno è più grosso del bullo generico)
ASPETTO.bruno = { sprite: 'canottiera', w: 19, h: 26, skin: '#e0a986', hair: '#1c1c1c', hairStyle: 'flat', shirt: '#2f2f2f', pants: '#3c5a8a', boots: '#222', belly: true, mustache: '#1c1c1c', eyes: 'angry' };
ASPETTO.rocco = { sprite: 'barbuto', w: 19, h: 26, skin: '#d9a27a', hair: '#5a3a22', hairStyle: 'flat', hat: '#2a5a9a', shirt: '#f4f4f4', pants: '#3a3a4a', boots: '#1a1a1a', beard: '#5a3a22', belly: true, eyes: 'angry' };
ASPETTO.amicoBruno = { sprite: 'cresta', w: 17, h: 24, skin: '#e8b48a', hair: '#7a4a2a', hairStyle: 'messy', shirt: '#5a2a2a', pants: '#2a2a3a', boots: '#222', eyes: 'angry' };
