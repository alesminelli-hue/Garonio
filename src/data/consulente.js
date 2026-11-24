// =====================================================================
//  IL CONSULENTE — GDD capitolo 19.1
//  Solo dati: prezzi, livelli di amicizia, nascondigli, premi e battute.
//  Il codice sta in src/consulente.js.
//
//  Amicizia: è quella del personaggio 'consulente' (src/data/png.js, da 0 a 100).
//  Il "livello" (1-5) si ricava dalle soglie qui sotto.
// =====================================================================

export const CONSULENTE = {
  prezzoCaffe: 2,
  // amicizia minima per ogni livello (indice 0 = livello 1)
  soglie: [0, 32, 46, 62, 80],
  amiciziaCaffe: 3,            // offrirgli il caffè
  amiciziaSeguito: 5,          // trovare l'oggetto che ti ha indicato
  minutiCaffe: 20,
  oreTrovabile: 24 * 60,       // l'oggetto resta lì fino alla fine del giorno dopo (minuti di gioco)
  telefonoLivello: 5,
};

export const LIVELLI_CONSULENTE = [
  'Cliente occasionale',
  'Cliente affezionato',
  'Socio in affari',
  'Braccio destro',
  'Fratello di consulenza',
];

// Nascondigli sulla mappa grande. "liv" = livello minimo di amicizia perché il Consulente lo conosca.
export const NASCONDIGLI = [
  { id: 'fienile',    x: 55.5, z: 25.5, dove: 'dietro al fienile', liv: 1 },
  { id: 'cartello',   x: 38.5, z: 58.5, dove: 'sotto il cartello del bar, nell\'erba', liv: 1 },
  { id: 'tabacchi',   x: 16.5, z: 67.5, dove: 'dietro al tabacchi', liv: 1 },
  { id: 'laghetto',   x: 35.0, z: 76.5, dove: 'sulla riva del laghetto', liv: 1 },
  { id: 'officina',   x: 84.0, z: 58.5, dove: 'dietro al deposito del Gigante', liv: 2 },
  { id: 'casaAzzurra',x: 10.6, z: 64.6, dove: 'nel giardino della casa azzurra', liv: 2 },
  { id: 'silos',      x: 117.5, z: 61.0, dove: 'dietro ai silos', liv: 2 },
  { id: 'capezzagna', x: 60.0, z: 31.0, dove: 'nel fosso della capezzagna', liv: 3 },
  { id: 'patata',     x: 104.0, z: 31.0, dove: 'vicino alla cascina del Patata', liv: 3 },
  { id: 'ponte',      x: 121.5, z: 9.0, dove: 'sotto il ponte del canale', liv: 4 },
  { id: 'capannoni',  x: 154.0, z: 69.5, dove: 'in fondo al cortile dei capannoni', liv: 4 },
  { id: 'argine',     x: 155.0, z: 40.0, dove: 'sulla strada dell\'argine', liv: 5 },
];

// Cosa si può trovare. "liv" = livello minimo del Consulente, "w" = probabilità relativa.
// premio: { soldi: [min, max], oggetti: { id: n }, xp, vestito, arma, pezzo }
export const TROVATELLI = [
  { id: 'soldi',     nome: 'Portafoglio caduto',  liv: 1, w: 4, premio: { soldi: [6, 15], xp: 3 },
    testo: "Un portafoglio senza documenti. Dentro: {soldi}€ e lo scontrino di una grappa. Il proprietario non lo saprà mai." },
  { id: 'uova',      nome: 'Uova abbandonate',    liv: 1, w: 2, premio: { oggetti: { uova: 3 }, xp: 2 },
    testo: "Una cesta con tre uova. Qualcuno è scappato in fretta. Forse da una volpe. Forse dalla Pina." },
  { id: 'grappa',    nome: 'Bottiglia di grappa', liv: 1, w: 2, premio: { oggetti: { grappa: 1 }, xp: 2 },
    testo: "Una grappa nascosta tra l'erba. Qualcuno se la teneva per le emergenze. Ora è un'emergenza tua." },
  { id: 'panino',    nome: 'Panino ancora buono', liv: 2, w: 2, premio: { oggetti: { panino: 1 }, xp: 3 },
    testo: "Un panino col salame avvolto nella carta. È ancora buono. Più o meno. Diciamo buono." },
  { id: 'santino',   nome: 'Santino',             liv: 2, w: 1, premio: { vestito: 'santino', soldi: [10, 10], xp: 5 },
    testo: "Un santino stropicciato. Lo infili nel portafoglio: la nonna sarebbe fiera." },
  { id: 'pezzo',     nome: 'Pezzo di ricambio',   liv: 2, w: 2, premio: { pezzo: 1, soldi: [5, 12], xp: 5 },
    testo: "Una candela della Vespa nuova di zecca, ancora nella scatola. Zeno la venderebbe a 40 euro. Tu ne hai pagati zero." },
  { id: 'attrezzo',  nome: 'Attrezzo perso',      liv: 3, w: 2, premio: { arma: 'rastrello', soldi: [15, 25], xp: 8 },
    testo: "Un rastrello abbandonato nel fosso. C'è inciso «PROPRIETÀ DI F.» con un pennarello. F. chi? Boh." },
  { id: 'busta',     nome: 'Busta del postino',   liv: 3, w: 1, premio: { soldi: [25, 40], xp: 8 },
    testo: "Una busta caduta al Postino. Dentro ci sono {soldi}€ e un biglietto: «Per la Pina, con affetto». Il segreto resta tra te e il fosso." },
  { id: 'trappola',  nome: 'Trappole per ratti',  liv: 3, w: 1, premio: { oggetti: { trappola: 2 }, xp: 5 },
    testo: "Due trappole per ratti nuove. Il Bubetto ne vende uguali. Probabilmente sono le sue." },
  { id: 'tesoretto', nome: 'Tesoretto del nonno', liv: 4, w: 1, premio: { soldi: [50, 80], xp: 15 },
    testo: "Una scatola di latta sepolta. Lire vecchie, una medaglia e {soldi}€ in banconote nuove. Il nonno pensava al futuro." },
  { id: 'pomata',    nome: 'Kit del veterinario', liv: 4, w: 1, premio: { oggetti: { pomata: 2 }, xp: 6 },
    testo: "Una borsa del veterinario dimenticata. Due pomate. Funzionano anche sugli umani, dice l'etichetta. Più o meno." },
];

export const BATTUTE_CONSULENTE = {
  caffe: [
    "Grazie del caffè, Garonio. Adesso ascoltami bene, perché te lo dico da professionista.",
    "Ristretto, come piace a me. Allora: ho un'informazione che vale oro. O almeno argento.",
    "Il caffè apre la mente. La mia è già aperta, ma così si apre di più.",
  ],
  giaPreso: [
    "Un caffè al giorno, Garonio. Due e mi tremano le mani, tre e divento consulente di me stesso.",
    "Oggi ti ho già dato la dritta. Le dritte buone sono come il formaggio: poche ma stagionate.",
  ],
  oggetto: [
    "{Dove} c'è roba. Non chiedermi come lo so. Ti metto un punto di domanda sulla mappa.",
    "Te lo dico da professionista: {dove}. Vai prima che ci arrivi qualcun altro.",
    "Un mio contatto ha perso qualcosa {dove}. Il mio contatto sono io. Vai.",
  ],
  nemici: [
    "{Zona} gira brutta gente: {nemici}. Portano esperienza e a volte qualche moneta. Vai preparato.",
    "Occhio: {zona} ho visto {nemici}. Io non ci andrei, ma io sono un consulente, non un eroe.",
  ],
  bestie: {
    re_nutrie: "La Pina ha parlato. Il Re delle Nutrie sta dove il canale fa la curva. Le tracce sono impronte grandi come piatti.",
    re_lupi: "Tarcisio ha ragione, sai? Di notte nel bosco a nord si sentono ululati. Quello è il Re dei Lupi, non un cane.",
    re_ratti: "I ratti dei capannoni hanno un capo. Uno grosso. Lo chiamano il Re. Lui non paga l'affitto.",
    nessuna: "Le bestie leggendarie? Per ora sono solo chiacchiere da bar. Ma le chiacchiere da bar, Garonio, sono notizie che non sono ancora arrivate al giornale.",
  },
  zeno: [
    "Oggi Zeno fischietta. Mai fidarsi di un meccanico che fischietta: non farti fare l'elaborazione.",
    "Zeno stamattina è di luna storta. Se devi riparare qualcosa, aspetta domani. O pregare.",
    "Zeno oggi è di buon umore: ha vinto al lotto due euro. Approfittane, ma conta il resto.",
  ],
  vigilessa: {
    dove: "La Vigilessa adesso è {dove}. Se prendi la Vespa, casco in testa e piano piano.",
    assente: "La Vigilessa oggi non è in giro. O almeno così dice lei. Io il casco me lo terrei.",
  },
  trovato: [
    "Visto? Il Consulente non sbaglia mai. Quasi mai. Stavolta no.",
    "Te l'avevo detto. Mettilo sul conto delle mie consulenze.",
  ],
  livelloSu: [
    "Garonio, sai cosa? Di te mi fido. Da adesso ti do le dritte buone, quelle che non do neanche a mio cugino.",
    "Siamo una squadra, io e te. Io penso, tu cammini. Funziona.",
  ],
  telefono: "Garonio, dammi quel catorcio a conchiglia. Ecco: ti ho salvato il mio numero riservato, quello che hanno in tre. Da domani le dritte te le mando per messaggio, così non devi venire fin qui. Però il caffè me lo offri lo stesso, quando passi.",
  messaggio: "📱 Messaggio dal Consulente: «{testo}»",
  amicizia: "Siamo al livello {livello} su 5: «{nome}». Consigli seguiti: {seguiti}.",
};
