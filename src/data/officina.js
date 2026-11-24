// =====================================================================
//  ZENO, LA VIGILESSA E LA CABINA DELLA CORRENTE (GDD 19.2, 19.4, 20.2‑20.5)
//  Solo dati e testi. Il codice sta in src/officina.js, src/vigilessa.js e src/cabina.js.
// =====================================================================

// ---------- Riparazioni a fasce (20.2) ----------
// min = stato minimo della fascia; prezzi per vespa / punto / trattore; minuti di lavoro.
// lento = quanto rallenta il mezzo (la Vespa messa male si spegne già più spesso da sola, vedi vehicles.js).
export const FASCE = [
  { id: 'graffi',    nome: 'graffi',     min: 75, prezzo: { vespa: 5,  punto: 8,  trattore: 15 }, minuti: 30,  lento: 0 },
  { id: 'ammaccato', nome: 'ammaccato',  min: 40, prezzo: { vespa: 10, punto: 15, trattore: 30 }, minuti: 60,  lento: 0.15 },
  { id: 'messoMale', nome: 'messo male', min: 1,  prezzo: { vespa: 15, punto: 20, trattore: 45 }, minuti: 120, lento: 0.30 },
  { id: 'rotto',     nome: 'rotto',      min: 0,  prezzo: { vespa: 25, punto: 35, trattore: 70 }, minuti: 180, lento: 1 },
];
export const TRAINO = { prezzo: 10, distanza: 14 }; // se il mezzo rotto è più lontano di così dall'officina, si paga il traino
// Rimorchio (solo trasporto, niente riparazione): Zeno riporta il mezzo bloccato, rotto o a secco al suo posto in azienda.
// Costa poco e si può fare anche senza soldi: quello che manca finisce sul conto di Zeno (debito).
// Di notte (fuori dalle ore di Zeno) viene il nipote e costa il doppio. goccio = carburante lasciato se era a secco.
export const RIMORCHIO = { prezzo: { vespa: 4, punto: 6, trattore: 8 }, notte: 2, minuti: 45, goccio: 12, ore: [7, 20] };
export const FATTURA = 0.2;                          // +20% sul prezzo, niente fregature

// ---------- Umore di Zeno (19.2) e fregature (20.3) ----------
export const UMORI = {
  buono:   { peso: 25, riuscita: +0.15, sovrapprezzo: 0.05, meta: 0.05, usato: 0,    icona: '🙂' },
  normale: { peso: 50, riuscita: 0,     sovrapprezzo: 0.15, meta: 0.10, usato: 0.05, icona: '😐' },
  cattivo: { peso: 25, riuscita: -0.15, sovrapprezzo: 0.30, meta: 0.20, usato: 0.10, icona: '😠' },
};
export const PARLANTINA_SCONTO = 0.2; // ogni grado di Parlantina toglie il 20% al rischio di fregatura
export const USATO = { giorni: 2, perdita: 20 };
export const META = 80;               // lavoro a metà: il mezzo torna all'80%

export const ZENO = {
  saluti: {
    buono: [
      "Oh, Garonio. Oggi sono di buon umore, quindi ti frego solo un pochino.",
      "Ho vinto 5 euro al gratta e vinci. Dimmi cosa ti serve prima che mi passi.",
    ],
    normale: [
      "Cosa vuoi. Se è rotto, costa. Se non è rotto, costa uguale.",
      "Garanzia? Sì, fino al cancello.",
    ],
    cattivo: [
      "Mi si è rotto il cric, il caffè e il morale. Parla in fretta.",
      "Oggi non è giornata. Per te. Per me neanche, ma per te di più.",
    ],
  },
  riparato: ["Fatto. Va. Per adesso.", "Sistemato. Se fa rumore è normale. Se non fa rumore preoccupati.", "Eccolo qua. Quasi come nuovo. Quasi."],
  sovrapprezzo: ["Eh, c'era anche la guarnizione.", "Ho dovuto cambiare il coso. Il coso costa.", "Ah, non te l'avevo detto? C'è il supplemento del sabato. Sì, anche oggi."],
  meta: ["Gli ho dato una sistemata. Il resto la prossima volta.", "È all'ottanta per cento. Come me il lunedì."],
  usato: ["Il pezzo è nuovo. Nuovo per te.", "Ricambio originale. Originale di qualcun altro."],
  usatoCede: (nome) => `Il pezzo «nuovo» di Zeno ha mollato: ${nome} −20%.`,
  fattura: ["Con la fattura? ...Va bene. Ma ti guardo male.", "Fattura. Che parola brutta. Ok, ok, lavoro pulito."],
  traino: "Vado a prenderlo col carro attrezzi. Il gasolio lo paghi tu.",
  rimorchio: [
    "Arrivo. Tu non toccare niente che peggiori.",
    "Ancora tu? Aggancio e ti riporto a casa. Il conto corre.",
    "Lo carico, lo porto in azienda e me ne vado. Non parlarmi durante il viaggio.",
  ],
  rimorchioNotte: [
    "(Risponde il nipote di Zeno, assonnato) Lo zio dorme. Vengo io col carro, ma di notte è doppio.",
  ],
  rimorchioDebito: (n) => `Non hai abbastanza? Segno ${n}€ sul conto. Il conto non dimentica.`,
  conto: (n) => `C'è anche il conto vecchio: ${n}€. Me li dai adesso, grazie.`,
  elaboraBene: ["Senti come canta! Merito mio, ovviamente.", "Riuscita. Non dirlo in giro che poi vogliono tutti lo sconto."],
  elaboraMale: ["Eh, capita.", "Non è colpa mia, è il pezzo. Che ho scelto io. Ma è colpa del pezzo.", "I soldi li tengo, il lavoro l'ho fatto. Che sia venuto male è un altro discorso."],
  nienteDaFare: "Non hai niente di rotto. Torna quando l'hai rotto, che lo so che lo romperai.",
  nonApre: "Zeno a quest'ora è in officina solo col pensiero. Torna tra le 7 e le 19.",
};

// ---------- Elaborazioni (20.4) ----------
// fx = effetti se riesce (letti da officina.mod(v)); male = effetti se va male.
// danno = stato che perde se va male (true = rotto); giorni = durata del guaio (0 = finché non lo ripari da Zeno).
export const ELABORAZIONI = {
  vespa: {
    marmitta: { nome: 'Marmitta sportiva',  prezzo: 80,  riuscita: 0.70, desc: '+20% velocità, fa rumore',
      fx: { vel: 0.20, rumore: 1 }, male: { danno: 30, giorni: 3, fx: { spegni: 2 }, testo: 'la Vespa si spegne il doppio per 3 giorni' } },
    motore:   { nome: 'Motore revisionato', prezzo: 120, riuscita: 0.60, desc: 'non si spegne più in corsa',
      fx: { spegni: 0 }, male: { danno: 40, giorni: 2, fx: { nonParte: 0.5 }, testo: 'una volta su due non parte per 2 giorni' } },
    cilindro: { nome: 'Cilindro maggiorato', prezzo: 200, riuscita: 0.45, desc: '+35% velocità',
      fx: { vel: 0.35 }, male: { danno: true, giorni: 0, fx: {}, testo: 'Vespa rotta' } },
  },
  punto: {
    gomme:    { nome: 'Gomme nuove',        prezzo: 80,  riuscita: 0.90, desc: 'non fora più',
      fx: { fora: 0 }, male: { danno: 0, giorni: 0, fx: {}, testo: 'ne ha montate di usate: fora come prima' } },
    serbatoio:{ nome: 'Serbatoio grande',   prezzo: 60,  riuscita: 0.75, desc: 'benzina doppia',
      fx: { benzina: 0.5 }, male: { danno: 0, giorni: 0, fx: { benzina: 2 }, testo: 'perde benzina: consuma il doppio finché non la ripari' } },
    assetto:  { nome: 'Assetto ribassato',  prezzo: 150, riuscita: 0.55, desc: 'curve più strette, +10% velocità',
      fx: { vel: 0.10, sterzo: 0.35 }, male: { danno: 35, giorni: 0, fx: { gratta: 1 }, testo: 'gratta su ogni sterrato finché non la ripari' } },
    stereo:   { nome: 'Impianto stereo',    prezzo: 100, riuscita: 0.80, desc: 'stress −2 all\'ora mentre guidi',
      fx: { stereo: 2 }, male: { danno: 0, giorni: 0, fx: { nonParte: 0.33 }, testo: 'la batteria si scarica: una volta su tre non parte' } },
  },
};

export const MEZZI_NOMI = { vespa: 'Vespa', punto: 'Punto', trattore1: 'Trattore rosso', trattore2: 'Trattore verde' };

// ---------- La Vigilessa (19.4) ----------
export const VIGILESSA = {
  vista: { raggio: 7, angolo: 0.75 },        // cono davanti a lei (angolo = metà apertura in radianti)
  udito: 11,                                  // con la marmitta sportiva ti sente da qui, anche alle spalle
  pausa: 45,                                  // minuti di gioco tra una multa e l'altra
  paese: { x0: 0, x1: 42, z0: 42, z1: 60 },   // dove vale «correre in paese»
  velocitaPaese: 5.2,                          // oltre questa velocità (≈47 km/h) in paese è multa
  scadenza: 3, sequestroDopo: 3, sequestroGiorni: 1,
  infrazioni: {
    urto:     { nome: 'urto con un mezzo', importo: d => Math.max(10, Math.min(40, 10 + Math.round(d * 1.5))) },
    casco:    { nome: 'Vespa senza casco', importo: () => 25 },
    corsa:    { nome: 'eccesso di velocità in paese', importo: () => 15 },
    attrezzo: { nome: 'trattore sulla provinciale con l\'attrezzo abbassato', importo: () => 30 },
    truffa:   { nome: 'comportamento sospetto nei campi altrui', importo: () => 50 },
    cabina:   { nome: 'danneggiamento di cabina elettrica', importo: () => 40 },
  },
  frasi: {
    urto: ["Il paracarro era lì da prima di te.", "Garonio. Di nuovo. Patente e libretto. Anche della zappa."],
    casco: ["Senza casco? La testa ce l'hai, almeno per ora.", "Il casco non è un accessorio di moda. Neanche su di te."],
    corsa: ["Questa è una piazza, non Monza.", "Ti ho visto. Ti ha visto anche la Pina. Ora lo sa tutto il paese."],
    attrezzo: ["L'aratro si alza prima della provinciale. Lo sa anche il trattore."],
    truffa: ["Cosa ci fai nel campo del vicino? No, non rispondere. Scrivo e basta."],
    cabina: ["Una cabina elettrica. Con la macchina. Non ho parole. Ho solo il blocchetto."],
  },
  scuse: "Era un piccione, l'ho schivato!",
  scusaOk: ["...Va bene. Ma il piccione lo multo io, la prossima volta.", "Mh. Stavolta passi. Il piccione no."],
  scusaKo: ["Un piccione. Certo. Raddoppio, così il piccione impara.", "Il piccione ha l'alibi. Tu no. Doppia."],
  pagaOra: "Paga subito",
  pagaDopo: "Pagherò al municipio (entro 3 giorni)",
  pagato: ["Ricevuta. Non perderla. Anzi, perdila: tanto ce l'ho io.", "Grazie. Il comune ringrazia. Io no."],
  rimandato: ["Tre giorni. Poi raddoppia. Poi sequestro. Poi piango io, di gioia."],
  raddoppio: (n) => `Multe scadute: raddoppiate! Ora devi ${n}€ al municipio.`,
  sequestro: (nome) => `La Vigilessa ha sequestrato la ${nome} per un giorno: troppe multe non pagate.`,
  sequestrata: (nome) => `La ${nome} ha la ganascia della Vigilessa. Torna domani (e paga le multe).`,
  restituita: (nome) => `La Vigilessa ha tolto la ganascia alla ${nome}. Per stavolta.`,
};

// L'edificio è in src/map.js (BUILDINGS, id 'municipio'); qui solo i testi dello sportello.
export const MUNICIPIO = {
  saluti: ["Ufficio multe. L'impiegata alza gli occhi dal cruciverba: «Nome? Ah. Lei.»", "«Sportello aperto. Il sorriso no.»"],
  niente: "«Non risultano multe. Strano. Ricontrollo.» ...Ricontrolla tre volte.",
};

// ---------- La cabina della corrente (20.5) ----------
export const CABINA = {
  x: 155.2, z: 29,            // in fondo alla capezzagna, appena dopo la curva dell'argine: lunga dritta per prendere velocità
  w: 1.7, d: 1.2,
  velocita: 4,                // velocità minima dello schianto (≈36 km/h)
  ricarica: 3,                // giorni prima che torni «carica»
  vita: 20,
  bottino: { niente: 0.60, comune: 0.30, leggendario: 0.10 },
  soldi: [20, 80],
  comuni: ['panino', 'caffe', 'grappa', 'pomata', 'trappola', 'benzina'],
  leggendari: [
    { tipo: 'arma', id: 'zappaFolgorata' },
    { tipo: 'vestito', id: 'cascoFulmine' },
    { tipo: 'vestito', id: 'tutaIsolante' },
    { tipo: 'vestito', id: 'stivali380' },
    { tipo: 'vestito', id: 'fusibile' },
  ],
  testi: {
    schianto: "BZZZZT! Lampi, scintille, odore di bruciato. Garonio esce dalle lamiere coi capelli dritti. Vita −20.",
    isolato: "BZZZZT! La tuta isolante fa il suo lavoro: Garonio esce dalle lamiere solo un po' spettinato.",
    distrutto: (nome) => `La ${nome} è un rottame fumante. Zeno sarà felicissimo.`,
    scarica: "La cabina fa «ztt» e basta. È scarica. Hai distrutto il mezzo per niente.",
    niente: "Dalla cabina sbuffata esce solo fumo. E il conto di Zeno, in arrivo.",
    comune: (euro, ogg) => `Dalla cabina sventrata rotolano fuori ${euro}€ e ${ogg}. Ma chi li teneva lì dentro?`,
    leggendario: (nome) => `★ BOTTINO LEGGENDARIO ★ Tra le scintille brilla qualcosa: ${nome}!`,
    tuttoTrovato: (euro) => `La cabina sputa ${euro}€ in monetine. Di leggendario non è rimasto niente: hai già tutto.`,
    ronzio: "La cabina ronza. La lucina rossa lampeggia. Che sarà mai.",
    spenta: "La cabina è muta. Si sta ricaricando.",
    cartello: "PERICOLO DI MORTE",
  },
};
