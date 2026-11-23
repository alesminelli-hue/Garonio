// =====================================================================
//  IL TELEFONINO A CONCHIGLIA (GDD 22): solo dati, testi e numeri.
//  Il codice sta in src/telefono.js.
//
//  Garonio ha da sempre un vecchio cellulare a conchiglia (ereditato dal Gigante).
//  Il Gigante chiama per sollecitare la missione e per dare lavoretti, Mister Mountain
//  chiama a sorpresa, la Mamma manda messaggi, e dal livello 5 di amicizia col Consulente
//  le dritte arrivano per SMS (src/consulente.js).
//  Segnaposto nei testi: {n} quantità, {fatto} già fatti, {ora} scadenza, {mancano}, {soldi}.
// =====================================================================

export const TEL = {
  operatore: 'BASSA TEL',
  ringSecondi: 9,            // quanto squilla prima di diventare «chiamata persa» (secondi veri)
  sollecitoPrima: 150,       // il Gigante chiama se mancano meno di questi minuti alla scadenza
  commissioneOre: [9, 16],   // fascia in cui il Gigante può chiamare per un lavoretto
  commissioneProb: 0.35,     // probabilità al giorno di una chiamata di lavoretto
  mountainOgniGiorni: [1.5, 3], // ogni quanti giorni (circa) chiama Mister Mountain
  mountainOre: [8, 21],
  mountainStress: 10,        // stress se rispondi e ti fai sgridare
  mountainRifiuto: 4,        // stress se rifiuti (e lui richiama)
  mountainRichiamate: 2,     // quante volte richiama prima di passare agli SMS in maiuscolo
  mammaStress: -6,           // telefonata alla Mamma (una al giorno)
  consulentePrezzo: 1,       // dritta per telefono (una al giorno), costa la ricarica
  maxSms: 30,
};

// Rubrica. "sempre": c'è da subito; "consulente": solo col Telefono del Consulente (amicizia 5).
export const CONTATTI = [
  { id: 'gigante',    nome: 'PAPÀ (Gigante)',   icona: '👨‍🌾', who: 'gigante', sempre: true },
  { id: 'mamma',      nome: 'Mamma',            icona: '👩‍🍳', who: 'mamma', sempre: true },
  { id: 'consulente', nome: 'Consulente ★',     icona: '🕶️', who: 'consulente', consulente: true },
  { id: 'zeno',       nome: 'Zeno Officina',    icona: '🔧', who: 'zeno', sempre: true },
  { id: 'bubetto',    nome: 'Bubetto',          icona: '📦', who: 'bubetto', sempre: true },
  { id: 'mountain',   nome: 'NON RISPONDERE',   icona: '⛰️', who: 'mountain', sempre: true },
];

// Suonerie (le note sono numeri MIDI, 0 = pausa). Ogni passo dura "passo" secondi.
export const SUONERIE = {
  polka:  { nome: 'Polka del trattore', passo: 0.11, onda: 'square',
    note: [67, 0, 72, 0, 76, 0, 72, 0, 67, 0, 72, 0, 76, 76, 79, 0, 77, 0, 74, 0, 71, 0, 74, 0, 77, 77, 76, 74, 72, 0, 0, 0] },
  trillo: { nome: 'Trillo anni 2000', passo: 0.075, onda: 'square',
    note: [88, 84, 88, 84, 88, 84, 0, 0, 88, 84, 88, 84, 88, 84, 0, 0, 91, 88, 91, 88, 0, 0, 0, 0] },
  gallo:  { nome: 'Gallo in tasca', passo: 0.09, onda: 'sawtooth', glissa: true,
    note: [72, 79, 0, 74, 81, 84, 84, 79, 0, 0, 0, 0] },
  liscio: { nome: 'Liscio della sagra', passo: 0.13, onda: 'triangle',
    note: [64, 67, 71, 76, 0, 74, 72, 71, 69, 0, 72, 71, 69, 67, 66, 67, 69, 0, 0, 0] },
  mucca:  { nome: 'Muuuh', passo: 0.18, onda: 'sawtooth', note: [43, 43, 42, 41, 0, 0, 0, 0] },
};
// Mister Mountain ha la sua suoneria, non si cambia.
export const SUONERIA_MOUNTAIN = { nome: 'Marcia funebre', passo: 0.16, onda: 'sawtooth',
  note: [45, 0, 45, 45, 0, 45, 48, 0, 47, 47, 45, 45, 44, 0, 45, 0, 0, 0] };

export const TESTI = {
  benvenuto: "Benvenuto nel 2003. Il telefono serve per lavorare, non per giocare a Serpentone. Rispondi quando chiamo. PAPÀ",

  // --- il Gigante ---
  sollecito: [
    "Garonio. Sono le {adesso}. La missione: {fatto} su {n}. La scadenza è alle {ora}. Fai tu i conti, io li ho già fatti.",
    "Ti chiamo per sapere se sei vivo. Non per affetto: per la missione. {mancano} ancora. Entro le {ora}.",
    "Ho guardato dalla finestra. Non ti ho visto lavorare. Dimmi che eri dietro un albero. {fatto} su {n}, muoviti!",
    "Pronto? Sì, sono io. Chi vuoi che sia. Mancano {mancano}. Alle {ora} chiamo Mister Mountain. Lo chiamo davvero.",
  ],
  sollecitoRisposte: [
    { label: 'Ci sto lavorando, papà!', stress: 3, risposta: "Lavorare è una cosa che si vede, Garonio. Non si dice. Clic." },
    { label: 'C\'è poco campo... pronto? Pronto?', stress: 0, parlantina: true, ok: "«Pronto? Garonio? Ma è il campo o sei tu?» Tu-tu-tu. Salvo. Per ora.", ko: "«Ti sento benissimo. E ti vedo pure, sei davanti al bar.» Stress +6.", stressKo: 6 },
    { label: 'Riattacca', stress: 5, risposta: "Hai riattaccato al Gigante. Il telefono è ancora caldo di rabbia. Stress +5." },
  ],
  giganteNonRisponde: [
    "NON RISPONDI? Il telefono te l'ho dato io. Te lo posso anche togliere. PAPÀ",
    "Ho chiamato. Tu non hai risposto. Mister Mountain invece risponde sempre. PAPÀ",
    "Ti ho visto guardare il telefono e metterlo in tasca. Ho la vista lunga. PAPÀ",
  ],
  // lavoretti per telefono (commissioni): id, titolo, testo, obiettivo, premio
  commissioniIntro: [
    "Garonio, già che sei in giro e non stai facendo niente, come al solito:",
    "Ascolta bene perché non lo ripeto. Lo ripeto, ma non bene:",
    "Sono io. Ho un lavoretto. Non fare quella faccia, la sento da qui:",
  ],
  commissioni: [
    { id: 'galline', titolo: 'Sfama le galline', testo: "le galline mi guardano storto. Dagli da mangiare. Oggi.",
      obiettivo: { evento: 'azione', filtro: { tipo: 'nutri' }, n: 1 }, premio: { soldi: 8, xp: 6 } },
    { id: 'uova', titolo: 'Raccogli 3 uova', testo: "tua madre vuole fare la torta. Raccogli tre uova. Intere, possibilmente.",
      obiettivo: { evento: 'azione', filtro: { tipo: 'uovo' }, n: 3 }, premio: { soldi: 10, xp: 8 } },
    { id: 'vendi', titolo: 'Vendi qualcosa alla cassa', testo: "la cassa piange. Vendi qualcosa, uova, pomodori, quello che hai. Ma vendi.",
      obiettivo: { evento: 'venduto', filtro: {}, n: 1 }, premio: { soldi: 6, xp: 6 } },
    { id: 'nutrie', titolo: 'Scaccia 2 nutrie', testo: "ho visto due nutrie che ridevano di me. Ridevano, Garonio. Sistemale.",
      obiettivo: { evento: 'nemicoSconfitto', filtro: { id: 'nutria' }, n: 2 }, premio: { soldi: 15, xp: 12 } },
    { id: 'annaffia', titolo: 'Annaffia 3 piante', testo: "l'orto ha sete. Tu no, tu bevi al bar. Annaffia tre piante.",
      obiettivo: { evento: 'azione', filtro: { tipo: 'annaffia' }, n: 3 }, premio: { soldi: 8, xp: 6 } },
  ],
  commissioneScelte: { si: 'Va bene, papà', no: 'Sono impegnato (stress +3)' },
  commissioneSi: "Bene. Entro stasera. Poi ti richiamo io, non chiamarmi tu che costa.",
  commissioneNo: "Impegnato. Tu. Me lo segno sul calendario, accanto a «miracoli».",
  commissioneFatta: [
    "Ho visto. Non ci credevo, ma ho visto. Ti ho messo {soldi}€ sul tavolo. Non spenderli tutti al bar. Spendine metà.",
    "Fatto? Bravo. Ecco {soldi}€. Non abituarti.",
  ],
  commissioneFallita: "Il lavoretto di ieri? Lo ha fatto tua madre. Con la sciatica. PAPÀ",
  truffaIntro: "Garonio, vieni a trovarmi in cortile. Ho un lavoretto... particolare. Non al telefono, che ascoltano.",
  truffaScelte: { si: 'Arrivo (accetta)', no: 'Non sono sicuro...' },
  truffaNo: "Non sei sicuro. Neanch'io ero sicuro, quando sei nato. Eppure eccoci.",
  // il Gigante che risponde quando lo chiami tu
  chiamaGigante: [
    "Che vuoi? Se è per soldi, la linea è disturbata.",
    "Mi chiami tu? È successo qualcosa? Hai rotto il trattore? DIMMI CHE NON HAI ROTTO IL TRATTORE.",
    "Pronto. Sto lavorando. Prova anche tu, è un'esperienza.",
  ],
  chiamaGiganteMissione: "La missione: {fatto} su {n}, entro le {ora}. Me lo chiedi tu? Dovrei chiedertelo io.",
  chiamaGiganteFatta: "Hai già fatto la missione, lo so. Non serve chiamare per farti dire bravo. Bravo. Clic.",

  // --- Mister Mountain ---
  mountainSquillo: "⛰️ NON RISPONDERE ti sta chiamando...",
  mountain: [
    "GARONIO. Sono Mister Mountain. Non chiedermi come ho il tuo numero. Ho il numero di TUTTI.",
    "Ti chiamo per dirti che ti sto pensando. E non è una cosa bella, Garonio. Non lo è mai.",
    "Il Gigante mi ha detto che oggi hai respirato troppo forte. Lo sai quanto costa l'aria in campagna?",
    "Ti ho chiamato col fisso, poi col cellulare, poi ho mandato un piccione. Il piccione è tornato indietro schifato.",
    "Sono in macchina. Sto passando davanti ai vostri campi. Le zolle mi hanno salutato. TU NO.",
    "Ho fatto un sogno stanotte: lavoravi. Mi sono svegliato urlando.",
  ],
  mountainScelte: [
    { label: 'Sì, Mister Mountain', tipo: 'subisci' },
    { label: 'Fingi una galleria (parlantina)', tipo: 'galleria' },
    { label: 'Riattacca in faccia', tipo: 'riattacca' },
  ],
  mountainSubisci: "Tre minuti di urla. Il telefono si scalda. Anche l'orecchio. Anche l'anima.",
  mountainGalleriaOk: "«Pronto? Pronto? Sono in gallerkkkrrr...» In Pianura padana non ci sono gallerie. Ma lui ci casca.",
  mountainGalleriaKo: "«IN PIANURA PADANA NON CI SONO GALLERIE, GARONIO.» Ecco. Altri cinque minuti di urla.",
  mountainRiattacca: "Hai riattaccato in faccia a Mister Mountain. Il telefono vibra già. Ti richiamerà. Lo sai.",
  mountainRifiutata: "Rifiutata. Da qualche parte, nella Bassa, un uomo enorme sta stringendo un telefono fino a romperlo.",
  mountainSms: [
    "TI HO VISTO RIFIUTARE LA CHIAMATA. NON HO IL TASTO DELLE MINUSCOLE E NON MI SERVE. MM",
    "RICHIAMAMI. ANZI NO. TI RICHIAMO IO. QUANDO MENO TE LO ASPETTI. MM",
    "SONO SOTTO CASA TUA. SCHERZO. O NO? MM",
  ],
  chiamaMountain: [
    "«Il cliente da lei chiamato non è... ah no, sono io. Garonio? MI HAI CHIAMATO TU? Hai coraggio. O sei scemo.»",
    "Squilla una volta. Rispondono subito, troppo subito. Un respiro pesante. «Lo sapevo che avresti chiamato.»",
  ],
  chiamaMountainScelte: [{ label: 'Riattacca subito!', stress: 2 }, { label: 'Chiedigli come sta', stress: 8 }],
  chiamaMountainRisposte: ["Hai riattaccato. Lui ti ha sentito respirare. Basta e avanza.", "«COME STO? STO COME UNO CHE HA UN GARONIO NELLA VITA.» Dieci minuti così."],

  // --- la Mamma ---
  mamma: [
    "Tesoro! Hai mangiato? Non mentire, sento dalla voce che non hai mangiato. Stasera tortelli. Due piatti.",
    "Garonio, tuo padre urla ma ti vuole bene. Lo dice sempre. Non a te, ma lo dice. Copriti che fa freddo.",
    "Ciao amore. Niente, ti ho chiamato per sentirti. Ah, e porta su le uova quando passi. Ti voglio bene.",
    "Hai la maglia della salute? Lo so che non ce l'hai. Ti ho messo un panino nella giacca. Quella di ieri.",
  ],
  mammaGiaChiamata: "Ci siamo già sentiti oggi, tesoro. Ti richiamo io stasera. Anzi no, ti aspetto a cena.",
  mammaSms: [
    "È PRONTO! (non so come si mette la minuscola) Mamma",
    "Tuo padre ha detto che sei bravo. Cioè, ha detto «meno peggio di ieri». È un passo avanti. Mamma",
    "Ricordati di bere acqua. Non grappa. Acqua. Mamma",
    "Ho stirato le tue magliette. Anche quella con la scritta. Non dirò niente. Mamma",
  ],

  // --- il Consulente ---
  consulenteNo: "Il numero del Consulente non ce l'hai. È un numero riservato, si guadagna col caffè.",
  consulenteGia: "Garonio, una dritta al giorno. Di più fa male al portafortuna. Ti scrivo domattina.",
  consulenteRisposta: "Pronto, consulenza. Sì, sei tu, ti ho riconosciuto dal respiro da scansafatiche. Senti questa:",
  consulenteSenzaSoldi: "Non hai neanche un euro di credito. Il Consulente lavora gratis solo di persona, col caffè.",

  // --- Zeno e il Bubetto ---
  zeno: {
    buono: "Officina Zeno! Oggi sono di buon umore, è il momento giusto. Porta quello che hai rotto, prima che mi passi.",
    normale: "Officina. Sì, sono aperto. Sì, costa. No, non faccio sconti al telefono. Ciao.",
    cattivo: "CHI È? Garonio? Oggi non è giornata. Se vieni, porta pazienza. E soldi. Soprattutto soldi.",
  },
  bubetto: [
    "Bubetto, magazzino! Roba nuova arrivata dal camion di stanotte. Non chiedere quale camion.",
    "Pronto? Ah, Garonio. Passa, ho un affare per te. Sì, come l'ultima volta. No, non come l'ultima volta.",
  ],
  bubettoSms: "Arrivata roba nuova al magazzino. Prezzi da amico. Da amico mio, non tuo. Bubetto",

  // --- interfaccia ---
  persa: '📵 Chiamata persa',
  nessunSms: 'Nessun messaggio.',
  nessunaChiamata: 'Nessuna chiamata.',
  chiama: 'Chiamata in corso...',
};
