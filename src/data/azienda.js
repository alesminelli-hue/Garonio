// =====================================================================
//  L'AZIENDA AGRICOLA (src/azienda.js, GDD capitolo 27)
//  Endgame. Battuto Mister Mountain (la storia), il Gigante dà a Garonio le «missioni dell'erede».
//  Finite quelle, all'Ufficio agricolo (accanto al municipio) si compra la Cascina dei Salici e si diventa
//  Imprenditore Agricolo. Poi, sempre in comune, si comprano e si migliorano le strutture: ogni mattina
//  producono roba che finisce nel magazzino della cascina; si vende dal registro (prezzi che cambiano ogni giorno).
//  Ogni struttura costa mangime/gasolio ogni giorno e a volte si guasta. Un garzone può fare tutto da solo.
// =====================================================================

export const AZIENDA = {
  nome: 'Cascina dei Salici',
  nomeDopo: 'Azienda Agricola Garonio',
  prezzo: 9000,                                   // la cascina (con la casa al livello 1)
  titolo: "L'Imprenditore Agricolo",
  ufficio: { x: 23.9, z: 47.6 },                  // il cartello dell'Ufficio agricolo, sul fianco del municipio
  registro: { x: 80.6, z: 35.5 },                 // davanti alla casa della cascina
  vendesi: { x: 75.6, z: 33.2 },
  guasto: 0.06,                                   // probabilità di guasto al giorno, per struttura
  garzone: { nome: 'il cugino Ermes', costo: 70, taglio: 0.1 },   // al giorno; vende col 10% in meno
};

// Prodotti: prezzo base (al pezzo). Ogni giorno il consorzio cambia il prezzo di ±25%.
export const PRODOTTI = {
  maiale:    { nome: 'Maiali da salumificio', icona: '🐖', prezzo: 260 },
  uova:      { nome: 'Uova fresche',          icona: '🥚', prezzo: 2 },
  latte:     { nome: 'Litri di latte',        icona: '🥛', prezzo: 3 },
  formaggio: { nome: 'Forme di grana',        icona: '🧀', prezzo: 45 },
  mais:      { nome: 'Quintali di mais',      icona: '🌽', prezzo: 6 },
  grano:     { nome: 'Quintali di grano',     icona: '🌾', prezzo: 9 },
};

// Strutture: livelli 1-4. prezzo = costo per arrivare a quel livello (in comune), prod = al giorno, costo = al giorno.
// «animali»: quante bestie girano davanti alla struttura (solo estetica).
export const STRUTTURE = {
  casa: {
    nome: 'Casa padronale', icona: '🏡', posto: { x: 78, z: 35.3 },
    livelli: [
      { prezzo: 0, nome: 'Casa da sistemare', stress: -4, desc: 'tetto che gocciola, ma è tua. Ogni mattina stress −4' },
      { prezzo: 4500, nome: 'Casa ristrutturata', stress: -8, vitaMax: 10, desc: 'ogni mattina stress −8, Vita massima +10' },
      { prezzo: 11000, nome: 'Casa con la taverna', stress: -12, vitaMax: 25, desc: 'stress −12, Vita +25. Taverna con il biliardino' },
      { prezzo: 24000, nome: 'Villa con piscina (gonfiabile)', stress: -18, vitaMax: 45, desc: 'stress −18, Vita +45. Il Gigante finge di non essere invidioso' },
    ],
  },
  porcilaia: {
    nome: 'Porcilaia', icona: '🐖', posto: { x: 88.5, z: 35.0 }, animale: { sprite: 'maiale', w: 1.05, area: [85, 35.4, 92.4, 36.3] },
    livelli: [
      { prezzo: 3500, nome: 'Porcilaia rimessa in piedi', prod: { maiale: 1 }, costo: 30, desc: '1 maiale al giorno' },
      { prezzo: 7500, nome: 'Porcilaia con i box nuovi', prod: { maiale: 2 }, costo: 55, desc: '2 maiali al giorno' },
      { prezzo: 15000, nome: 'Porcilaia ventilata', prod: { maiale: 3.5 }, costo: 90, desc: '3,5 maiali al giorno' },
      { prezzo: 30000, nome: 'Porcilaia della Mora della Bassa', prod: { maiale: 6 }, costo: 140, desc: '6 maiali al giorno, razza «Mora della Bassa»' },
    ],
  },
  pollaio: {
    nome: 'Pollaio', icona: '🐔', posto: { x: 86.2, z: 42.3 }, animale: { sprite: 'gallina', w: 0.6, area: [84.6, 42.4, 87.8, 43.6] },
    livelli: [
      { prezzo: 1500, nome: 'Pollaio con la rete nuova', prod: { uova: 60 }, costo: 10, desc: '60 uova al giorno' },
      { prezzo: 3200, nome: 'Pollaio grande', prod: { uova: 130 }, costo: 20, desc: '130 uova al giorno' },
      { prezzo: 6500, nome: 'Pollaio con i nidi a nastro', prod: { uova: 250 }, costo: 40, desc: '250 uova al giorno' },
      { prezzo: 13000, nome: 'Pollaio da concorso', prod: { uova: 450 }, costo: 70, desc: '450 uova al giorno, galline ovaiole da concorso' },
    ],
  },
  stalla: {
    nome: 'Stalla', icona: '🐄', posto: { x: 90.7, z: 42.8 }, animale: { sprite: 'mucca', w: 1.7, area: [88.8, 43.0, 92.6, 43.8] },
    livelli: [
      { prezzo: 4500, nome: 'Stalla con tre mucche', prod: { latte: 90 }, costo: 25, desc: '90 litri di latte al giorno' },
      { prezzo: 9500, nome: 'Stalla con la mungitrice', prod: { latte: 140, formaggio: 4 }, costo: 50, desc: '140 litri e 4 forme di grana' },
      { prezzo: 19000, nome: 'Stalla col caseificio', prod: { latte: 220, formaggio: 9 }, costo: 90, desc: '220 litri e 9 forme' },
      { prezzo: 36000, nome: 'Stalla robotizzata', prod: { latte: 320, formaggio: 16 }, costo: 150, desc: '320 litri e 16 forme, la mungitura la fa il robot' },
    ],
  },
  campi: {
    nome: 'Campi', icona: '🌽', posto: { x: 75.9, z: 39.7 },
    livelli: [
      { prezzo: 2500, nome: 'Cinque ettari dissodati', prod: { mais: 25, grano: 8 }, costo: 20, desc: '25 q di mais e 8 di grano (d\'inverno riposano)' },
      { prezzo: 5500, nome: 'Campi con l\'irrigazione', prod: { mais: 50, grano: 18 }, costo: 40, desc: '50 q di mais e 18 di grano' },
      { prezzo: 11000, nome: 'Campi col trattore nuovo', prod: { mais: 95, grano: 35 }, costo: 70, desc: '95 q di mais e 35 di grano' },
      { prezzo: 22000, nome: 'Campi con la mietitrebbia', prod: { mais: 170, grano: 60 }, costo: 120, desc: '170 q di mais e 60 di grano, mietitrebbia nuova' },
    ],
  },
};
// d'inverno i campi riposano (niente mais né grano), d'estate le galline fanno meno uova
export const STAGIONE_AZIENDA = { inverno: { mais: 0, grano: 0, campiCosto: 0 }, estate: { uova: 0.75 } };

// ---------- Le missioni dell'erede (il Gigante, dopo la storia) ----------
export const EREDE = {
  annuncio: [
    { chi: 'gigante', testo: "Garonio. Vieni qua. Siediti. No, non lì, quella è la sedia della nonna." },
    { chi: 'gigante', testo: "Hai battuto Mister Mountain. Tu. Mio figlio. Quello che si addormentava nel trattore col motore acceso." },
    { chi: 'gigante', testo: "Allora ascolta. Ho delle cose da insegnarti. Cose da padrone, non da garzone. Quando sei pronto, chiedimi le «missioni dell'erede»." },
  ],
  etichetta: "👑 Le missioni dell'erede",
  missioni: {
    erede_mani: {
      titolo: 'Le mani in pasta', obiettivo: { evento: 'azione', filtro: {}, n: 25 },
      offerta: "Un padrone che non sa zappare è un padrone che si fa fregare. Fammi 25 lavoretti in azienda: orto, pollaio, campi, legna, quello che vuoi. Ti guardo dalla finestra.",
      grazie: "Venticinque. Non male. Le mani ce le hai. Adesso vediamo la testa.",
      premio: { soldi: 400, xp: 200 },
    },
    erede_nome: {
      titolo: 'Farsi un nome', obiettivo: { evento: 'nemicoSconfitto', filtro: {}, n: 12 },
      offerta: "In paese devono sapere che i Garonio non si toccano. Dodici bestiacce, mostri, quello che trovi. Che si sappia in giro.",
      grazie: "Al bar parlano di te. Bene. Anzi, male, ma con rispetto. È uguale.",
      premio: { soldi: 600, xp: 300 },
    },
    erede_camper: {
      titolo: 'Il consiglio del vecchio', obiettivo: { parla: 'camper' },
      offerta: "Il Vecchio Camper ha avuto una cascina sua per quarant'anni. Io e lui non ci parliamo dal '74, ma è il più furbo della Bassa. Vai a chiedergli come si fa.",
      grazie: "«Non fidarti del consorzio, compra la porcilaia per prima e non farti mai vedere dal geometra.» Ti ha detto così? È proprio lui.",
      grazieCamper: "Vuoi una cascina tua? Ascolta il vecchio: la porcilaia prima di tutto, i maiali pagano sempre. Il consorzio ti frega sui prezzi: vendi quando il prezzo sale. E il geometra... evitalo. Dì a tuo padre che è ancora un caprone.",
      premio: { soldi: 300, xp: 150 },
    },
    erede_carta: {
      titolo: 'La carta bollata', obiettivo: { evento: 'ufficioAgricolo', filtro: {}, n: 1 },
      offerta: "Ultima cosa. In comune, sul fianco del municipio, c'è l'Ufficio agricolo. Vai a chiedere della Cascina dei Salici, quella abbandonata dietro la capezzagna. È in vendita da dieci anni. Costa un occhio, ma è un buon pezzo di terra.",
      grazie: "Hai visto il prezzo, eh? Lo so. Lavora, risparmia, e quando la compri... vengo a vederla. Forse.",
      premio: { soldi: 1000, xp: 400 },
    },
  },
  finite: "Ormai non ho più niente da insegnarti. Vai in comune e comprati quella cascina. E quando sei padrone, ricordati chi ti ha insegnato a zappare.",
  // dopo: le commesse del Gigante (una al giorno), con la roba della tua azienda, pagate più del consorzio
  commessa: {
    etichetta: '📜 Una commessa per il Gigante',
    testi: [
      "Mi servono {n} {nome}. Il consorzio te li paga una miseria; io ti do il {pct}% in più. Affare di famiglia.",
      "Ho promesso {n} {nome} al cugino di Lodi. Tu li hai, io li pago. Più del consorzio. Non dirlo a tua madre.",
    ],
    fatta: "Bravo. Così si fanno gli affari: tra parenti, in contanti, senza fattura. (Questo non l'hai sentito.)",
    niente: "Oggi niente commesse. Torna domani, imprenditore.",
    manca: "Ti servono {n} {nome} nel magazzino della cascina. Ne hai {ha}.",
  },
};

export const TESTI_AZIENDA = {
  vendesi: '🏚️ Cascina dei Salici: VENDESI (rivolgersi all\'Ufficio agricolo in comune)',
  ufficio: '🏛️ Ufficio agricolo',
  ufficioChiuso: "L'Ufficio agricolo apre dalle 8 alle 13. Sulla porta c'è scritto: «Torno subito». Il biglietto è del 2016.",
  impiegata: 'La dottoressa Brambati',
  benvenuto: [
    "Buongiorno. Ufficio agricolo. Si sieda. Moduli A38, B12 o il 740 agricolo?",
    "Sì? Ah, il figlio del Gigante. Prego. Faccia in fretta, alle 13 ho la pausa caffè. Dalle 9.",
  ],
  primaStoria: "La Cascina dei Salici? È in vendita, certo. Ma lei non ha l'età. Cioè, l'età ce l'ha, ma non la faccia. Torni quando suo padre la considera un uomo.",
  info: "La Cascina dei Salici: casa, porcilaia, stalla, pollaio e cinque ettari di campi. Abbandonata dal 2014. Prezzo: {prezzo}€. Le strutture vanno comprate a parte, una per una. Poi ci sono gli upgrade. Poi le tasse. Soprattutto le tasse.",
  compra: "🏡 Compra la Cascina dei Salici ({prezzo}€)",
  pocoSoldi: "Le mancano {manca}€. La banca? La banca ride. Torni quando ha i soldi.",
  comprata: [
    { testo: "La dottoressa Brambati timbra sette moduli, uno dopo l'altro. TUNC. TUNC. TUNC. Poi ti allunga una chiave arrugginita." },
    { testo: "«Complimenti. Da oggi lei è titolare di un'azienda agricola. Si ricordi: IMU, contributi, PAC, quote latte, registro dei trattamenti, quaderno di campagna...» Garonio ha smesso di ascoltare alla parola «complimenti»." },
    { testo: "🏆 Nuovo titolo: «L'Imprenditore Agricolo». In paese, la voce gira in fretta." },
    { chi: 'gigante', testo: "(Al telefono) «Ho saputo. Bravo. Allora l'orto di casa da oggi è mio: il tuo è dietro la stalla della cascina. E i trattori nuovi li vende Rodella. Non farti fregare. Cioè, fatti fregare poco.»" },
  ],
  struttura: '{icona} {nome}: {livello}',
  compraStruttura: '{icona} {nome} → {lvNome} · {prezzo}€',
  comprataStruttura: "TUNC. Timbro. «{nome}: livello {lv}. I lavori finiscono stanotte. Non mi chieda come.»",
  massimo: '{icona} {nome}: già al massimo',
  registro: '📒 Registro della cascina',
  magazzinoVuoto: 'Il magazzino è vuoto. Le bestie lavorano di notte: torna domattina.',
  venduto: '💶 Venduto al consorzio: {cose}. Totale {tot}€.',
  guasto: "⚠️ Stanotte alla cascina si è guastato qualcosa: {nome}. Oggi non produce finché non lo ripari.",
  ripara: '🔧 Ripara: {nome} ({prezzo}€ o 2 pezzi di ricambio)',
  riparata: '🔧 {nome} riparata. Si riparte.',
  produzione: '🌅 Alla cascina, stanotte: {cose}.',
  conti: '📒 Ieri: entrate {entrate}€ · spese {spese}€.',
  fame: '🐷 Non avevi i soldi per mangime e gasolio: stanotte la cascina ha prodotto la metà.',
  garzone: '🧑‍🌾 Assumi {nome} ({costo}€ al giorno: vende e ripara da solo, si tiene il {taglio}%)',
  licenzia: '🧑‍🌾 Licenzia {nome}',
  garzoneFatto: "{nome}: «Ho venduto tutto, cugino! Tolta la mia parte, ecco {tot}€. Ah, ho anche riparato {riparato}.»",
  cartello: 'AZIENDA AGRICOLA GARONIO',
};
