// =====================================================================
//  IL MAGAZZINO DEL BUBETTO (GDD 19.3, 17.5, 15.2, 15.4, 16.1)
//  Solo dati e testi. Il codice sta in src/negozio.js (game.negozio).
//
//  Armi: escono man mano col capitolo dell'annata (GDD 19.3):
//        capitolo 1 (primavera) fino al liv. 7, capitolo 2 (estate) fino al 12, dal 3 (autunno) tutto.
//  Manuali: uno nuovo a capitolo, ognuno dà 1 punto abilità.
//  Usato: cambia ogni lunedì (giorno 1, 8, 15...). Più fiducia = più roba e più sconto.
// =====================================================================

export const NEGOZIO = {
  // capitolo -> livello massimo delle armi in vendita
  armiPerCapitolo: { 1: 7, 2: 12, 3: 99 },
  giorniCapitolo: 14,                 // se la trama dell'annata non dice il capitolo, si conta così
  rivendita: 0.4,                     // il Bubetto ricompra al 40% (è un affare. Per lui.)
  // fiducia del Bubetto (0-100): sale con le commissioni della lavagna
  fiduciaMissione: 12,
  sconto: f => Math.min(0.2, Math.floor(f / 20) * 0.05),   // 5% ogni 20 di fiducia, fino al 20%
  usatoQuanti: f => 2 + Math.floor(f / 25),                  // pezzi nell'angolo dell'usato
};

export const VESTITI_IN_VENDITA = ['stivali', 'cappellino', 'casco', 'tuta', 'stivaliAlti', 'giacca', 'grembiule'];

export const MANUALI = [
  { id: 'manualeContadino', nome: 'Manuale del bravo contadino', prezzo: 80, capitolo: 1,
    frase: "Edizione 1974, con le figure. Le pagine sulle patate le ha strappate il Potato." },
  { id: 'manualeAutodifesa', nome: 'Corso di autodifesa per corrispondenza', prezzo: 150, capitolo: 2,
    frase: "Lezione 1: non farti prendere. Lezione 2: vedi lezione 1." },
  { id: 'manualeRispondere', nome: 'Come rispondere a tono', prezzo: 250, capitolo: 3,
    frase: "L'ha scritto un barista di Newbarley. Garantito al limone." },
  { id: 'manualeFattore', nome: 'Il Fattore moderno (VHS + libretto)', prezzo: 400, capitolo: 4,
    frase: "Il videoregistratore non è compreso. Il libretto sì, quasi tutto." },
];

// Reparto oggetti: prezzi più bassi del bar, ma niente caffè
export const OGGETTI_IN_VENDITA = [
  { id: 'trappola', prezzo: 6 },
  { id: 'pomata', prezzo: 9 },
  { id: 'panino', prezzo: 4 },
  { id: 'benzina', prezzo: 14, nota: 'per la motosega' },
];
// Attrezzatura per l'azienda (prima stava in officina)
export const ATTREZZATURA = [
  { id: 'rete', nome: 'Rete anti-nutria', prezzo: 60, desc: 'le nutrie escono dal canale la metà delle volte' },
];

// Angolo dell'usato: a rotazione ogni lunedì. tipo: 'vestito' | 'arma' | 'oggetto'
export const USATO = [
  { tipo: 'vestito', id: 'cappelloPaglia', prezzo: 35, nota: "L'ho trovato su uno spaventapasseri. Vicino alla cascina del Potato. Coincidenze." },
  { tipo: 'vestito', id: 'stivaliPostino', prezzo: 55, nota: "Erano fuori da una porta. Chi lascia gli stivali fuori, li vuole regalare." },
  { tipo: 'vestito', id: 'giubbottoFrank', prezzo: 80, nota: "Frank dice che gliel'hanno rubato. Io dico che l'ho comprato. Siamo pari." },
  { tipo: 'vestito', id: 'cornetto', prezzo: 40, nota: "Porta fortuna. A me l'ha portata: l'ho venduto." },
  { tipo: 'vestito', id: 'thermos', prezzo: 70, nota: "Thermos della Loredana. Cioè, uguale a quello della Loredana." },
  { tipo: 'arma', id: 'rastrello', prezzo: 35, nota: "Mancano due denti. Come a me, e io funziono." },
  { tipo: 'arma', id: 'badile', prezzo: 65, nota: "Usato pochissimo. Da un uomo che scavava tantissimo." },
  { tipo: 'oggetto', id: 'trappola', n: 3, prezzo: 12, nota: "Tre trappole al prezzo di due. Una è già scattata, ma si ricarica." },
  { tipo: 'oggetto', id: 'grappa', n: 2, prezzo: 6, nota: "Grappa della casa. Di quale casa non lo so." },
  { tipo: 'oggetto', id: 'benzina', n: 2, prezzo: 20, nota: "Due taniche. Profumano di trattore del Postman." },
];

// Battute del Bubetto nel negozio ({prezzo}, {nome}, {sconto})
export const FRASI = {
  benvenuto: [
    "Benvenuto nel magazzino! Qui c'è tutto. Quello che non c'è, arriva. Non chiedere da dove.",
    "Garonio! Guarda pure, toccare è gratis. Rompere no.",
    "Oggi prezzi da amico. Da amico mio, eh.",
  ],
  reparti: {
    armi: "Attrezzi da lavoro. Servono nei campi... e per le nutrie arrabbiate.",
    vestiti: "Vestiti robusti. Firmati, anche: guarda, c'è scritto «Consorzio».",
    manuali: "Libri che ti cambiano la vita. Un punto abilità alla volta.",
    oggetti: "Trappole, pomate, panini. Il caffè no: la Loredana mi ammazza.",
    usato: "L'angolo dell'usato. Roba rara, cambia ogni lunedì. Provenienza... varia.",
    vendi: "Fammi vedere cos'hai. Ti faccio un prezzo onesto. Onesto per me.",
  },
  comprato: [
    "Affare fatto! Non si accettano resi. Neanche se si rompe subito.",
    "Ottima scelta. Era l'ultimo. Ne ho altri dieci nel retro, ma era l'ultimo.",
    "Vendutoooo! Torna presto, tanto torni.",
  ],
  pocoSoldi: [
    "Mancano un po' di soldi. Il Bubetto fa credito solo a chi non ne ha bisogno.",
    "Con quei soldi ti posso vendere... un saluto. Ciao!",
  ],
  livelloBasso: "Questo è roba da gente esperta. Torna quando sei al livello {liv}.",
  nonAncora: "Questo arriva più avanti nell'annata. Il fornitore è... stagionale.",
  venduto: [
    "{prezzo} euro, e mi sto rovinando.",
    "Lo prendo. Ma solo perché sei tu. Ti do {prezzo} euro.",
  ],
  manuale: "Leggilo bene! Un punto abilità in più: premi J per spenderlo.",
  sconto: "Per te, che sei di fiducia, sconto del {sconto}%.",
};

// Commissioni della lavagna del Bubetto (GDD 19.3): una alla volta, in fila dopo «Code di nutria».
// Stesso formato di src/data/secondarie.js; il negozio le registra con game.quests.aggiungi().
export const LAVAGNA = {
  bubetto_piccioni: {
    da: 'bubetto', titolo: 'Abbatti 10 piccioni sul silos',
    offerta: "I piccioni del silos mi fanno la cacca sul furgone. Tutti i giorni. Sul MIO furgone. Scacciane 10 e ti do 40 euro e due trappole. Girano di giorno tra la piazza e il silos.",
    obiettivo: { evento: 'nemicoSconfitto', filtro: { id: 'piccione' }, n: 10 },
    premio: { soldi: 40, xp: 25, oggetti: { trappola: 2 }, amicizia: { bubetto: 5 } },
    requisiti: { dopo: 'bubetto_nutrie' },
    grazie: "Il furgone è pulito da tre ore! Un record. Tieni, te li sei meritati.",
  },
  bubetto_ferro: {
    da: 'bubetto', titolo: 'Ferro vecchio nei fossi',
    offerta: "Nei fossi lungo la capezzagna c'è del ferro vecchio. Me ne trovi 3 pezzi? Lo rivendo. A chi? A uno che ricompra il ferro. Di solito io.",
    obiettivo: { consegna: { ferro: 3 } },
    premio: { soldi: 35, xp: 20, oggetti: { benzina: 1 }, amicizia: { bubetto: 5 } },
    requisiti: { dopo: 'bubetto_piccioni' },
    grazie: "Bel ferro! Questo era un trattore. O una bicicletta. Comunque vale. Tieni, anche una tanica di benzina.",
    scusa: "Tre pezzi, Garonio. Guarda nei fossi lungo la capezzagna dei campi: luccicano.",
  },
  bubetto_pacco: {
    da: 'bubetto', titolo: 'Un pacco per il Postman',
    offerta: "Porta questo pacco al Postman. Ma senza che lo veda la moglie! È un regalo. Per lei. Cioè, da parte di lui. Lascia stare.",
    dai: { paccoSegreto: 1 },
    obiettivo: { consegna: { paccoSegreto: 1 }, a: 'postino' },
    torna: false,
    premio: { soldi: 25, xp: 20, amicizia: { bubetto: 5, postino: 5 } },
    requisiti: { dopo: 'bubetto_ferro' },
    grazie: "Shh! Dammelo, veloce. Mia moglie è dietro la tenda. Tieni, e non hai visto niente.",
  },
  bubetto_frank: {
    da: 'bubetto', titolo: 'I soldi di Mister Frank',
    offerta: "Mister Frank mi deve 50 euro da agosto. Vai a farti dare i soldi. Con gentilezza. Con molta gentilezza. È grosso.",
    obiettivo: { parla: 'frank' },
    premio: { soldi: 30, xp: 25, amicizia: { bubetto: 8, frank: -3 } },
    requisiti: { dopo: 'bubetto_pacco' },
    grazie: "Okay, okay boy! Here's the money. Dì al Bubetto che il giubbotto lo rivoglio. (Ti lascia 30 euro di mancia per il disturbo.)",
  },
  bubetto_ratti: {
    da: 'bubetto', titolo: 'Code di ratto',
    offerta: "Mi servono 5 code di ratto. I ratti girano di notte nei capannoni e al silos. A cosa servono? Collezione. Non chiedere.",
    obiettivo: { consegna: { codaRatto: 5 } },
    premio: { soldi: 50, xp: 30, vestiti: ['cornetto'], amicizia: { bubetto: 8 } },
    requisiti: { dopo: 'bubetto_frank' },
    grazie: "Cinque code! Che bellezza. Tieni il mio cornetto rosso: porta fortuna. Me l'ha venduto uno che adesso non ha più fortuna.",
    scusa: "Ne servono 5. I ratti escono di notte, vicino ai capannoni e al silos.",
  },
};

// Pezzi di ferro vecchio nei fossi (missione bubetto_ferro): lungo la capezzagna dei campi
export const FERRO_VECCHIO = [
  { x: 42.5, z: 27.2 },
  { x: 99.5, z: 31.2 },
  { x: 151.2, z: 41.5 },
];


// Affilatura da Zeno (GDD 16.1 e 20.3). Le fregature dipendono dall'umore di Zeno.
export const AFFILA = {
  rischio: { cattivo: 0.3, normale: 0.12, buono: 0.04 },
  frasi: {
    proposta: "Affilare? Se mi paghi affilo anche la lingua di tua madre. Scherzo. Non dirglielo.",
    fatto: [
      "Ecco qua. Taglia che è una bellezza. Non toccare la lama, o ti faccio pagare anche il cerotto.",
      "Affilata. Più di così si consuma.",
    ],
    sovrapprezzo: "Eh, la mola si è consumata. Sono {extra} euro in più. Cosa vuoi, che lavori gratis?",
    meta: "Ho fatto metà lavoro, l'altra metà la faccio la prossima volta. Il prezzo è intero, eh.",
    massimo: "Più affilata di così si spezza. Vai, vai.",
    pocoSoldi: "Senza soldi affilo solo le battute.",
  },
};
