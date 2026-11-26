// =====================================================================
//  L'ANNATA: stagioni, meteo, fiducia del Gigante, attrezzi dei trattori
//  e maiali (GDD 18.1, 17.3 e 20.1).
//  Solo testi e numeri: si possono ritoccare senza toccare il codice
//  (src/stagioni.js, src/attrezzi.js, src/maiali.js).
// =====================================================================

export const GIORNI_STAGIONE = 14;   // 4 stagioni da 14 giorni = un'annata di 56 giorni
export const GRANO_MINUTI = 1e7;    // il grano non matura con l'acqua: segue le stagioni (vedi stagioni.js)

// ---------------------------------------------------------------------
//  LE QUATTRO STAGIONI (un capitolo ciascuna)
//  obiettivi: controllati dal Gigante la mattina dopo l'ultimo giorno.
//    chiave  contatore della stagione (vedi stagioni.js → progressi)
//    n       quanto serve
//  meteo: probabilità di ogni evento al mattino (il resto è sereno).
//  eventi: giorni speciali della stagione (1..14).
// ---------------------------------------------------------------------
export const STAGIONI = [
  {
    chiave: 'primavera', nome: 'Primavera', titolo: 'Si semina', icona: '🌱', capitolo: 1,
    obiettivi: [
      { chiave: 'maisSeminato', n: 40, testo: 'Zolle di mais seminate' },
      { chiave: 'maialiSani', n: 4, testo: 'Maiali sani' },
    ],
    meteo: { pioggia: 0.4 },
    eventi: { 3: 'arrivoMaiali', 9: 'parto' },
    intro: [
      { testo: "Capitolo 1 · Primavera: «Si semina». La terra è morbida, l'aria profuma di letame. Garonio starnutisce." },
      { chi: 'gigante', testo: "Primavera, Garonio. Si ara, si semina, e arrivano i maiali. Entro due settimane voglio 40 zolle di mais seminate e quattro maiali sani nel capannone." },
      { chi: 'gigante', testo: "Nel campo non si va più con la zappa come i nonni. Trattore e attrezzo, sotto la tettoia accanto al deposito. Il rosso ha l'aratro, il verde la seminatrice." },
    ],
  },
  {
    chiave: 'estate', nome: 'Estate', titolo: 'Acqua e caldo', icona: '☀️', capitolo: 2,
    obiettivi: [
      { chiave: 'granoVenduto', n: 400, testo: 'Grano venduto (€)', euro: true },
    ],
    meteo: { caldo: 0.35, grandine: 0.08, pioggia: 0.1 },
    eventi: { 7: 'sagra' },
    intro: [
      { testo: "Capitolo 2 · Estate: «Acqua e caldo». Le cicale urlano. Anche il Gigante." },
      { chi: 'gigante', testo: "Il grano è maturo. Falciatrice sul trattore verde, si trebbia, e il cassone si scarica al fienile: il camion del consorzio lo ritira lì." },
      { chi: 'gigante', testo: "Voglio 400 euro di grano venduto prima di settembre. E il mais vuole acqua: turbina sul rosso, vicino al canale o al laghetto." },
    ],
  },
  {
    chiave: 'autunno', nome: 'Autunno', titolo: 'Il raccolto', icona: '🍂', capitolo: 3,
    obiettivi: [
      { chiave: 'maisRaccolto', n: 30, testo: 'Pannocchie raccolte' },
      { chiave: 'maialiPremiati', n: 2, testo: 'Maiali premiati alla fiera' },
    ],
    meteo: { nebbia: 0.3, pioggia: 0.2 },
    eventi: { 10: 'fiera' },
    intro: [
      { testo: "Capitolo 3 · Autunno: «Il raccolto». Le prime nebbie. I cinghiali hanno scoperto che il mais è buono." },
      { chi: 'gigante', testo: "Si raccoglie il mais, almeno 30 pannocchie. E si semina il grano per l'anno prossimo: aratro e seminatrice sul campo del grano, vicino al fienile." },
      { chi: 'gigante', testo: "Il giorno 10 c'è la fiera. Due maiali premiati, Garonio. Puliti, pasciuti e contenti. Come te dopo la sagra, ma meno sudati." },
    ],
  },
  {
    chiave: 'inverno', nome: 'Inverno', titolo: 'I conti', icona: '❄️', capitolo: 4,
    obiettivi: [
      { chiave: 'bilancio', n: 1, testo: 'Bilancio dell\'anno in attivo (€)', euro: true, bilancio: true },
    ],
    meteo: { nebbia: 0.3, neve: 0.25 },
    eventi: { 14: 'natale' },
    intro: [
      { testo: "Capitolo 4 · Inverno: «I conti». Fa freddo, la nebbia si taglia col coltello e il Gigante tira fuori il quaderno dei conti." },
      { chi: 'gigante', testo: "D'inverno si fanno i conti. I maiali grassi vanno al salumificio, i mezzi da Zeno, e a Natale si guarda il quaderno." },
      { chi: 'gigante', testo: "Se l'anno chiude in attivo, ne parliamo. Se chiude in rosso... ne parla Mister Mountain. Alla cena di Natale." },
    ],
  },
];

// ---------------------------------------------------------------------
//  METEO DEL GIORNO
// ---------------------------------------------------------------------
export const METEO = {
  sereno:   { nome: 'Sereno', icona: '🌤️' },
  pioggia:  { nome: 'Pioggia', icona: '🌧️', testo: "Piove! Oggi campi e orto si annaffiano da soli. Il Gigante dice che è merito suo." },
  caldo:    { nome: 'Caldo', icona: '🥵', testo: "Caldo boia: ogni lavoro stanca il 20% in più e i maiali soffrono. Rinfrescali nel capannone." },
  grandine: { nome: 'Grandine', icona: '🌨️', testo: "Stanotte è venuta giù la grandine grossa come le noci. Qualche pianta non ce l'ha fatta." },
  nebbia:   { nome: 'Nebbia', icona: '🌫️', testo: "Nebbia fitta. Non si vede a dieci metri: occhio coi mezzi." },
  neve:     { nome: 'Neve', icona: '❄️', testo: "Ha nevicato! I mezzi scivolano e i maiali vogliono stare al caldo." },
};

// ---------------------------------------------------------------------
//  FIDUCIA DEL GIGANTE (0-100)
// ---------------------------------------------------------------------
export const FIDUCIA = {
  iniziale: 50,
  missioneFatta: 3, missioneFallita: -6, trattoreRotto: -5, maialeMorto: -8,
  obiettivoRiuscito: 15, obiettivoFallito: -15,
  // la paga delle missioni cambia con la fiducia: +/- metà della differenza da 50, in percentuale
  pagaPerPunto: 0.01,
  soglie: { alta: 70, bassa: 35 },
};

// Verifica di fine stagione
export const VERIFICA = {
  riuscita: [
    "Ho guardato i numeri tre volte. Tornano. Non so se essere contento o preoccupato.",
    "Obiettivo raggiunto. Non abbracciarmi. Ho detto non abbracciarmi.",
    "Bene. Lo scrivo sul calendario, col pennarello indelebile.",
  ],
  fallita: [
    "Obiettivo mancato. Sai chi è contento? Mister Mountain. Lui è sempre contento quando sbagli.",
    "Ti avevo chiesto una cosa sola. Una. Due, contando i maiali.",
    "Questa stagione la segno col pennarello rosso. Quello che uso per le multe.",
  ],
  premio: 60,   // € in più quando l'obiettivo riesce
};

// Il finale dell'anno (la cena di Natale, GDD 18.1)
export const FINALE = {
  alta: [
    { testo: "La sera di Natale. Il cappone è nel piatto, la Mamma ha il grembiule buono, il Gigante si schiarisce la voce." },
    { chi: 'gigante', testo: "Garonio. Quest'anno hai lavorato. Non bene, ma hai lavorato. E i conti sono in attivo." },
    { chi: 'gigante', testo: "Il campo dietro il fienile... da domani è tuo. Tutto tuo. Se lo rovini, però, te lo riprendo e ci pianto le ortiche." },
    { chi: 'garonio', testo: "Papà... non so cosa dire." },
    { chi: 'gigante', testo: "Allora non dire niente e passami la mostarda. Buon Natale." },
    { testo: "FINALE: «Il campo di Garonio». L'anno ricomincia: le stagioni ripartono e tu adesso hai qualcosa di tuo da difendere." },
  ],
  media: [
    { testo: "La sera di Natale. Tortellini in brodo, la TV accesa, il Gigante che conta sulle dita." },
    { chi: 'gigante', testo: "Un anno così così. Né carne né pesce. Come il cappone della zia." },
    { chi: 'gigante', testo: "Un altro anno così e ti metto a fare il garzone a vita. Con la divisa. Te la cuce la Mamma." },
    { chi: 'garonio', testo: "(Poteva andare peggio. Poteva venire Mister Mountain.)" },
    { testo: "FINALE: «Garzone a vita». L'anno ricomincia: hai un'altra annata per far cambiare idea al Gigante." },
  ],
  bassa: [
    { testo: "La sera di Natale. Suonano alla porta. La Mamma va ad aprire e lancia un piccolo urlo." },
    { chi: 'mountain', testo: "Buon Natale, famiglia. Il Gigante mi ha invitato a cena. Dice che c'è da parlare dell'anno di Garonio." },
    { chi: 'mountain', testo: "Fiducia sotto le scarpe. Conti in rosso. Maiali tristi. Passami il panettone, che ti spiego tutto. Con calma. Fino a Capodanno." },
    { chi: 'garonio', testo: "(Il Natale peggiore della mia vita. E l'anno scorso mi era caduto il presepe in testa.)" },
    { testo: "FINALE: «Mister Mountain a Natale». L'anno ricomincia: si riparte da zero, con lo stress alle stelle." },
  ],
};

// Eventi speciali (pagine della mattina)
export const EVENTI = {
  arrivoMaiali: [
    { testo: "Un camion fa retromarcia nel cortile dei capannoni. Bip, bip, bip. Il Gigante dirige le manovre con un salame in mano." },
    { chi: 'gigante', testo: "Sono arrivati i maiali! Quattro. Hanno un nome, non chiedermi perché: li ha battezzati la Mamma." },
    { chi: 'gigante', testo: "Una delle scrofe è incinta. Mangiano tutti i giorni, i box si puliscono, e se uno si ammala si chiama il veterinario. Capannone a est, oltre i silos." },
  ],
  parto: [
    { chi: 'gigante', testo: "Stanotte la scrofa partorisce. Dalle 21 resti nel capannone a vegliare, che se c'è un problema serve qualcuno. Qualcuno sveglio. Quindi non tu, ma ci provo." },
  ],
  sagra: [
    { chi: 'gigante', testo: "Stasera c'è la sagra del paese. Dopo le 18 passa dal bar: c'è da ballare, da mangiare e da fare figuracce. Lo stress te lo togli lì." },
  ],
  fiera: [
    { chi: 'gigante', testo: "Oggi c'è la fiera! Entro le 18 porta i maiali più belli. Dal capannone: «Porta i maiali alla fiera». Se non vincono, la colpa è tua, non loro." },
  ],
  natale: [
    { testo: "È la Vigilia di Natale. Il paese ha le lucine, il bar ha il panettone, il Gigante ha il quaderno dei conti sotto il braccio." },
    { chi: 'gigante', testo: "Stasera si cena tutti insieme. Vai a dormire quando hai finito: domattina facciamo i conti dell'anno." },
  ],
};

// ---------------------------------------------------------------------
//  ATTREZZI DEI TRATTORI (GDD 20.1)
//  trattori: a quali si aggancia (trattore1 = rosso, trattore2 = verde)
//  larghezza: quante zolle lavora insieme. usura: stato perso per zolla.
// ---------------------------------------------------------------------
export const ATTREZZI = {
  aratro:      { nome: 'Aratro', icona: '⛏️', trattori: ['trattore1', 'trattore2'], prezzo: 0, larghezza: 1, usura: 0.12, gasolio: 0.08,
                 lavoro: 'ara le zolle (anche le stoppie del grano)' },
  seminatrice: { nome: 'Seminatrice', icona: '🌱', trattori: ['trattore1', 'trattore2'], prezzo: 150, larghezza: 2, usura: 0.06, gasolio: 0.05,
                 lavoro: 'semina le zolle arate (consuma la semente)' },
  falciatrice: { nome: 'Falciatrice', icona: '🌾', trattori: ['trattore1', 'trattore2'], prezzo: 300, larghezza: 2, usura: 0.08, gasolio: 0.1, noleggio: 35,
                 lavoro: 'raccoglie mais e grano maturi; il cassone si scarica al fienile' },
  turbina:     { nome: 'Turbina per irrigare', icona: '💦', trattori: ['trattore1', 'trattore2'], prezzo: 250, raggio: 2.6, usura: 0.02, gasolio: 0.35, noleggio: 30,
                 lavoro: 'irriga intorno al trattore, se sei vicino all\'acqua (canale o laghetto)' },
};

export const UPGRADE_ATTREZZI = {
  aratroLargo: { nome: 'Aratro largo', desc: 'ara 3 zolle insieme', prezzo: 200, serve: 'aratro' },
  rimorchio:   { nome: 'Rimorchio della falciatrice', desc: 'niente cassone da scaricare: il raccolto va dritto al fienile', prezzo: 180, serve: 'falciatrice' },
};

export const TRATTORI_NOMI = { trattore1: 'trattore rosso', trattore2: 'trattore verde' };

export const LAVORO_CAMPI = {
  gasolioPerUnita: 0.09,        // gasolio consumato per casella percorsa (serbatoio 0-100)
  pienoPrezzo: 12,              // cisterna del gasolio sotto la tettoia
  pienoMinuti: 10,
  sementeSacco: 10,             // zolle seminate con un sacco
  sementePrezzo: 10,            // dal Bubetto
  sementePrezzoConsorzio: 14,   // alla tettoia (consegna a domicilio, costa di più)
  sementeIniziale: 4,
  cassone: 40,                  // quanto tiene il cassone della falciatrice
  prezzoGrano: 3,               // € per zolla di grano, pagati al fienile dal consorzio
  raggioAcqua: 18,              // distanza massima dall'acqua per la turbina
  riparaPerPunto: 1.2,          // € per ogni punto di stato da riparare (da Zeno)
  // campo del grano del Gigante (dentro la zona dorata a ovest, vicino al fienile)
  campoGrano: { x0: 28, x1: 46, z0: 11, z1: 21, name: 'Campo del grano' },
  rastrelliera: { x: 94.6, z: 65.4 },   // dove si agganciano gli attrezzi (tettoia, accanto al deposito)
};

// Battute di lavoro (a caso)
export const BATTUTE_LAVORO = {
  senzaAttrezzo: "Il trattore senza attrezzo è solo un modo rumoroso di andare a spasso.",
  seccoGasolio: "Il trattore tossisce e si ferma: gasolio finito! Premi E: versa una tanica (le vende Fuel l'Havana, sulla provinciale) o chiama il rimorchio. Il pieno si fa anche alla cisterna sotto la tettoia.",
  riservaGasolio: "Spia del gasolio accesa. Il trattore ha sete.",
  niente: "Niente semente! Il Bubetto in paese ne vende, oppure ordinala alla tettoia.",
  cassonePieno: "Cassone pieno! Portalo al fienile, vicino al campo del grano.",
  attrezzoRotto: "L'attrezzo fa un rumore brutto e si blocca. Va riparato da Zeno.",
  granoVerde: "Il grano è ancora verde: si trebbia d'estate.",
  turbinaSecca: "La turbina pesca aria: troppo lontano dall'acqua.",
  scarico: "Cassone scaricato al fienile.",
};

// ---------------------------------------------------------------------
//  MAIALI (GDD 17.3)
// ---------------------------------------------------------------------
export const MAIALI = {
  primi: [
    { nome: 'Rosina', sesso: 'scrofa', peso: 95, incinta: true },
    { nome: 'Gino', sesso: 'maschio', peso: 88 },
    { nome: 'Peppa', sesso: 'scrofa', peso: 82 },
    { nome: 'Ugo', sesso: 'maschio', peso: 90 },
  ],
  nomiMaialini: ['Pallino', 'Briciola', 'Salamino', 'Ciccio', 'Tortellino', 'Zampone', 'Fagiolo', 'Pancetta', 'Mortadella', 'Gnocco'],
  mangimePrezzo: 8,           // € per sacco (basta per tutti, un giorno)
  mangimeIniziale: 3,
  veterinario: 25,            // € per una cura
  crescita: [2, 4],           // kg al giorno se mangiano
  sporcoAlGiorno: 30,
  malattia: 0.18,             // probabilità al giorno se i box sono sporchi
  saluteSano: 60,             // da qui in su conta come «sano»
  prezzoKg: { salumificio: 2.2, commerciante: 1.4 },  // d'inverno il salumificio paga di più
  premioFiera: 40,
  sogliaFiera: 70,
  minuti: { nutri: 20, pulisci: 40, rinfresca: 20, cura: 30, fiera: 180 },
  fatica: { nutri: 4, pulisci: 8, rinfresca: 3, cura: 2 },
  battute: {
    nutri: ["I maiali si lanciano sul mangime come gli zii al buffet dei matrimoni.", "Grugniti di gioia. Almeno qualcuno in questa famiglia è contento."],
    pulisci: ["Box puliti. Garonio puzza come un box, però.", "Pala, carriola, pala, carriola. Il glamour dell'agricoltura."],
    rinfresca: ["Doccia fresca con la canna: i maiali ringraziano rotolandosi nel fango. Di nuovo."],
    fame: "I maiali urlano dalla fame. Si sentono fino al bar.",
    sporco: "I box sono sporchi: i maiali sono di cattivo umore e rischiano di ammalarsi.",
    malato: "{nome} sta male: tossisce e non mangia. Serve il veterinario o una pomata.",
    morto: "{nome} non ce l'ha fatta. Il Gigante non dice niente, ed è peggio.",
    caldo: "Caldo nel capannone: i maiali boccheggiano. Rinfrescali con la canna.",
  },
  partoVegliato: [
    { testo: "Mezzanotte passata. Nel capannone c'è odore di paglia e di caffè freddo. Rosina sbuffa." },
    { testo: "Uno, due, tre... quattro maialini! Garonio li asciuga col maglione buono. La Mamma non lo saprà mai." },
    { chi: 'garonio', testo: "Benvenuti in azienda. Ve lo dico subito: il capo urla, ma la paga è buona. Scherzo, la paga fa schifo." },
  ],
  partoSolo: "Stanotte Rosina ha partorito da sola. È nato un maialino solo: gli altri... il Gigante non vuole parlarne.",
};
