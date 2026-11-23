// =====================================================================
//  BESTIE LEGGENDARIE E GRUPPI DI NEMICI (GDD capitoli 11.2, 18.3 e 18.4)
//  Solo dati: numeri, testi e posizioni. Il codice sta in src/bestie.js e src/spawn.js.
//
//  NEMICI_NUOVI: statistiche e mosse dei nemici nuovi (finiscono in ENEMIES di src/combat.js).
//    sprite = funzione di src/sprite_bestie.js · size = altezza nello scontro · mappa = larghezza sulla mappa
//    mosse: pow = forza (0 = niente danno), stress, w = probabilità relativa, line = battuta
//           veleno: [danno, turni] · stordisce: true · rubaScappa: true (gazza) · piccolo: si scaccia col clacson
//  BESTIE: i tre re. voce → tracce → tana → scontro in due fasi → trofeo.
//  ZONE e GRUPPI: dove e quando compaiono i gruppi visibili sulla mappa.
// =====================================================================

export const NEMICI_NUOVI = {
  ratto: {
    name: 'Ratto', hp: 12, atk: 5, def: 0, spd: 9, xp: 4, money: 0, size: 2.2, sprite: 'ratto', mappa: 0.95, piccolo: true,
    fuga: 'sparisce in un buco del muro.',
    moves: [
      { name: 'Morsetto', pow: 1, stress: 1, w: 3 },
      { name: 'Corsa sui piedi', pow: 0.4, stress: 4, w: 1, line: 'Ti passa sopra gli stivali. Brrr.' },
      { name: 'Squittio', pow: 0, stress: 3, w: 1 },
    ],
  },
  ratto_fogna: {
    name: 'Ratto di fogna', hp: 34, atk: 10, def: 2, spd: 7, xp: 12, money: 0, size: 3, sprite: 'rattoFogna', mappa: 1.4,
    fuga: 'torna nella fogna, offeso.',
    moves: [
      { name: 'Morso infetto', pow: 1, stress: 2, w: 2, veleno: [2, 3], line: 'Garonio si sente poco bene. (Vita −2 per 3 turni)' },
      { name: 'Graffio', pow: 1.2, stress: 1, w: 3 },
      { name: 'Puzza di fogna', pow: 0, stress: 7, w: 1 },
    ],
  },
  gazza: {
    name: 'Gazza ladra', hp: 20, atk: 7, def: 1, spd: 14, xp: 10, money: 0, size: 2.6, sprite: 'gazza', mappa: 1, vola: true, piccolo: true,
    fuga: 'vola sul campanile a lamentarsi.',
    moves: [
      { name: 'Beccata', pow: 1, stress: 1, w: 3 },
      { name: 'Gracchio beffardo', pow: 0, stress: 6, w: 1 },
      { name: 'Ruba e scappa', pow: 0.3, stress: 5, w: 1, rubaScappa: true },
    ],
  },
  piccione: {
    name: 'Piccione', hp: 8, atk: 3, def: 0, spd: 10, xp: 2, money: 0, size: 2, sprite: 'piccione', mappa: 0.85, vola: true, piccolo: true,
    fuga: 'torna sul silos a tubare.',
    moves: [
      { name: 'Beccatina', pow: 1, stress: 1, w: 3 },
      { name: 'Bombardamento', pow: 0.3, stress: 5, w: 1, line: 'Centro perfetto sulla spalla. Porta fortuna, dicono.' },
      { name: 'Tubare', pow: 0, stress: 2, w: 1 },
    ],
  },
  nutria_corazzata: {
    name: 'Nutria corazzata', hp: 52, atk: 13, def: 12, spd: 4, xp: 20, money: 0, size: 3.6, sprite: 'nutriaCorazzata', mappa: 1.3,
    fuga: 'rotola nel canale con un tonfo.',
    moves: [
      { name: 'Morso di fango', pow: 1, stress: 2, w: 3 },
      { name: 'Rotolata corazzata', pow: 1.4, stress: 2, w: 1 },
      { name: 'Si rintana nella corazza', pow: 0, stress: 3, w: 1, line: 'Le placche di fango secco sembrano cemento.' },
    ],
  },
  lupo_giovane: {
    name: 'Lupo giovane', hp: 46, atk: 15, def: 5, spd: 12, xp: 20, money: 0, size: 3.6, sprite: 'lupoGiovane', mappa: 1.5,
    fuga: 'scappa nel bosco guaendo.',
    moves: [
      { name: 'Morso', pow: 1, stress: 2, w: 3 },
      { name: 'Ringhio', pow: 0, stress: 6, w: 1 },
      { name: 'Salto alla gola', pow: 1.4, stress: 3, w: 1 },
    ],
  },
  cinghiale_maschio: {
    name: 'Cinghiale maschio', hp: 95, atk: 20, def: 9, spd: 5, xp: 34, money: 0, size: 5, sprite: 'cinghialeMaschio', mappa: 2,
    fuga: 'se ne va sbuffando tra il mais.',
    moves: [
      { name: 'Zannata', pow: 1.1, stress: 2, w: 3 },
      { name: 'Carica stordente', pow: 1.4, stress: 4, w: 1, stordisce: true, line: 'Garonio vede le stelle. Salta il prossimo turno!' },
      { name: 'Grugnito da capobranco', pow: 0, stress: 8, w: 1 },
    ],
  },
  lupo: {
    name: 'Lupo', hp: 75, atk: 20, def: 8, spd: 13, xp: 30, money: 0, size: 4.2, sprite: 'lupo', mappa: 1.75,
    fuga: 'sparisce nella nebbia.',
    moves: [
      { name: 'Morso feroce', pow: 1.1, stress: 2, w: 3 },
      { name: 'Ululato', pow: 0, stress: 9, w: 1 },
      { name: 'Attacco ai fianchi', pow: 1.5, stress: 3, w: 1 },
    ],
  },

  // ---------- i tre re (solo nelle tane) ----------
  re_ratti: {
    name: 'Re dei Ratti', hp: 150, atk: 10, def: 5, spd: 8, xp: 150, money: 0, size: 8.5, sprite: 'reRatti', boss: true,
    fuga: 'crolla sul trono di formaggio.',
    moves: [
      { name: 'Morso reale', pow: 1.2, stress: 2, w: 3 },
      { name: 'Colpo di scettro', pow: 1.5, stress: 2, w: 2 },
      { name: 'Editto reale', pow: 0, stress: 8, w: 1, line: '«Per decreto, tu sei un formaggino.»' },
    ],
  },
  re_nutrie: {
    name: 'Re delle Nutrie', hp: 240, atk: 14, def: 10, spd: 6, xp: 250, money: 0, size: 9, sprite: 'reNutrie', boss: true,
    fuga: 'affonda nel canale, sconfitto. Le bolle sembrano parolacce.',
    moves: [
      { name: 'Dentoni arancioni', pow: 1.3, stress: 2, w: 3 },
      { name: 'Codata da diga', pow: 1.1, stress: 3, w: 2 },
      { name: 'Sguardo da padrone del canale', pow: 0, stress: 8, w: 1 },
    ],
  },
  re_lupi: {
    name: 'Re dei Lupi', hp: 340, atk: 18, def: 12, spd: 13, xp: 400, money: 0, size: 10, sprite: 'reLupi', boss: true,
    fuga: 'si allontana nella neve. Per la prima volta abbassa la testa.',
    moves: [
      { name: 'Zannata di ghiaccio', pow: 1.2, stress: 3, w: 3 },
      { name: 'Balzo nella neve', pow: 1.5, stress: 3, w: 2 },
      { name: 'Sguardo gelido', pow: 0, stress: 10, w: 1 },
    ],
  },
};

// stagioni dell'annata: 4 da 14 giorni (segnaposto finché il lavoro C non ha game.stagioni)
export const STAGIONI = ['primavera', 'estate', 'autunno', 'inverno'];
export const GIORNI_STAGIONE = 14;

// ---------- I tre re ----------
// tracce: x, z sulla mappa; tipo = disegno (src/sprite_bestie.js → traccia); notte = si trova solo di notte
// tana.richiede: { vestitoBonus, arma: [..] } · tana.notte: si apre solo dalle 20:00
export const BESTIE = {
  re_ratti: {
    nome: 'Re dei Ratti', nemico: 're_ratti', min: 6, cons: 8, stagione: 'primavera',
    luogo: 'tana_ratti', colore: '#d0a0ff',
    voce: {
      png: 'mamma', etichetta: '🐀 «Mamma, in cantina manca ancora il salame?»',
      pagine: [
        { chi: 'mamma', testo: "Tesoro, il salame sparisce. Tutto. Anche quello per la Cresima della cugina." },
        { chi: 'mamma', testo: "Stanotte dai capannoni si sentiva squittire. Ma squittire con autorità, come se qualcuno desse ordini." },
        { chi: 'garonio', testo: "Mamma, sono topi. I topi non danno ordini." },
        { chi: 'mamma', testo: "La Pina dice che c'è un Re. Con la corona. Lei l'ha visto tornando dal bar. Lo so, era la Pina. Ma guarda i sacchi del mangime vicino al silos." },
      ],
    },
    tracce: [
      { tipo: 'sacco', x: 124.5, z: 69.8, testo: "Sacchi di mangime rosicchiati. Rosicchiati in fila, con ordine. Qualcuno organizza il lavoro meglio del Gigante." },
      { tipo: 'maialino', x: 133.5, z: 71.6, testo: "Un maialino tremante. Fissa la grata vicino al silos e non vuole saperne di tornare nel recinto." },
      { tipo: 'sacco', x: 145.5, z: 70.2, testo: "Briciole di salame. Il salame della Mamma! Le briciole portano dritte verso la grata sotto il silos." },
    ],
    tana: {
      tipo: 'grata', x: 122.8, z: 66.4, nome: 'la grata sotto il silos',
      descr: [
        { testo: "Garonio solleva la grata. Sotto c'è una galleria che puzza di formaggio e di potere." },
        { testo: "In fondo, su un trono di forme di grana rosicchiate, siede lui. Il Re dei Ratti. Ha la corona. Ha il mantello. Ha il salame della Mamma." },
        { chi: 'garonio', testo: "Quello era per la Cresima." },
      ],
    },
    seguaci: ['ratto', 'ratto_fogna'],
    rinforzi: ['ratto', 'ratto'], maxSeguaci: 2, ogniRound: 3,
    trofeo: 'coronaRatti', soldi: 100,
    intro: "Il Re dei Ratti batte lo scettro: «Guardie! Mordetelo!»",
    fase2: "Il Re dei Ratti, ferito, si tuffa nel mucchio di grano! Da lì sotto i colpi non arrivano. Serve un Urlo o un lancio per stanarlo!",
    nascosto: "Il grano attutisce tutto. Prova con l'Urlo da campagna o lanciagli qualcosa!",
    stanato: "Stanato! Il Re dei Ratti schizza fuori dal grano, frastornato.",
    vittoria: [
      { testo: "Il Re dei Ratti crolla. La corona rotola ai piedi di Garonio, che la raccoglie. È di latta. Ma è sua." },
      { chi: 'garonio', testo: "Mamma, ho trovato il ladro del salame. No, il salame non c'è più." },
    ],
    dopo: { specie: ['ratto', 'ratto_fogna'] },
  },
  re_nutrie: {
    nome: 'Re delle Nutrie', nemico: 're_nutrie', min: 11, cons: 13, stagione: 'estate',
    luogo: 'tana_nutrie', colore: '#f08a1c',
    voce: {
      png: 'consulente', etichetta: '🦫 «Hai sentito di quella nutria grossa?»',
      pagine: [
        { chi: 'consulente', testo: "Te lo dico da professionista: sotto il ponte del canale c'è una nutria grossa come un vitello. In paese la chiamano il Re delle Nutrie." },
        { chi: 'consulente', testo: "Ha bucato l'argine e allagato il grano di Mister Frank. Lui dice che è sabotaggio sovietico. È una nutria." },
        { chi: 'consulente', testo: "Consiglio gratis, il primo: senza stivali alti, lì sotto non ci entri. Il secondo costa un caffè." },
      ],
    },
    tracce: [
      { tipo: 'argine', x: 112.5, z: 7.6, testo: "L'argine è bucato come un groviera. Dai buchi esce acqua... e un rumore di denti che masticano." },
      { tipo: 'grano', x: 136.5, z: 12.5, testo: "Il grano di Mister Frank è allagato. Nel fango ci sono impronte di nutria grandi come una padella." },
      { tipo: 'argine', x: 127.5, z: 7.6, testo: "Un cumulo di canne intrecciate a forma di trono. Qualcuno qui si crede importante. Le impronte vanno sotto il ponte." },
    ],
    tana: {
      tipo: 'ponte', x: 121.6, z: 7.4, nome: 'il buio sotto il ponte',
      richiede: { vestitoBonus: 'acquaBassa', manca: "L'acqua sotto il ponte arriva alle ginocchia. Con questi stivali Garonio si bagnerebbe i calzini, e senza calzini asciutti non si combatte. Servono gli stivali alti da canale (dal Bubetto)." },
      descr: [
        { testo: "Garonio entra nell'acqua bassa sotto il ponte. Gli stivali alti tengono. Più o meno." },
        { testo: "Nel buio brillano due dentoni arancioni grandi come tegole. Il Re delle Nutrie emerge dal fango, con una corona di canne." },
        { chi: 'garonio', testo: "Buonasera, maestà. Le devo chiedere di spostare la diga." },
      ],
    },
    seguaci: ['nutria_corazzata', 'nutria'],
    diga: { soglia: 0.06, cura: 0.08 },   // fase 2: se in un giro prende meno del 6% della Vita, si cura dell'8%
    trofeo: 'pellicciaNutrie', soldi: 200,
    intro: "Il Re delle Nutrie sbatte la coda nell'acqua: arrivano i suoi sudditi!",
    tuffo: "Il Re delle Nutrie si tuffa! Per un turno non si può colpire.",
    riemerge: "Il Re delle Nutrie riemerge con uno spruzzo di fango!",
    fase2: "Il Re delle Nutrie ammucchia fango e rami: «DIGA DI FANGO!» Se non lo colpisci forte, si cura.",
    cura: "La diga di fango lo rimette in sesto. Colpiscilo più forte (Zappata, Rabbia, armi pesanti)!",
    vittoria: [
      { testo: "Il Re delle Nutrie si arrende e lascia la pelliccia sull'argine, come chi lascia la giacca sulla sedia." },
      { chi: 'garonio', testo: "Mister Frank mi deve un grano. Un favore. Insomma, mi deve qualcosa." },
    ],
    dopo: { specie: ['nutria', 'nutria_gigante', 'nutria_corazzata'] },
  },
  re_lupi: {
    nome: 'Re dei Lupi', nemico: 're_lupi', min: 17, cons: 19, stagione: 'inverno',
    luogo: 'tana_lupi', colore: '#60e0ff',
    voce: {
      png: 'zeno', etichetta: '🐺 «Zeno, cos\'è questa storia del lupo bianco?»',
      pagine: [
        { chi: 'zeno', testo: "Tarcisio dice di aver visto un lupo bianco grande come la mia Punto. Tarcisio dopo il terzo bianchino vede anche gli gnomi." },
        { chi: 'zeno', testo: "Però stanotte è sparito un maiale dai capannoni. E nel fango ci sono impronte che vanno verso il bosco." },
        { chi: 'zeno', testo: "Se ci vai, di notte, portati la roncola: la radura è chiusa dai rovi. E portati i soldi: se torni coi morsi, ti ricucio io. A pagamento." },
      ],
    },
    tracce: [
      { tipo: 'impronte', x: 150.5, z: 86.5, testo: "Impronte enormi nella brina, vicino al recinto. Un maiale manca all'appello. Il Gigante darà la colpa a Garonio, ovviamente." },
      { tipo: 'osso', x: 118.5, z: 90.5, testo: "Un osso spolpato e un ciuffo di pelo bianco, morbido come una sciarpa. Nel bosco, di notte, qualcosa ulula." },
      { tipo: 'impronte', x: 96.5, z: 91.5, testo: "Le impronte entrano nel bosco e spariscono dietro un muro di rovi. Dall'altra parte, la radura." },
    ],
    tana: {
      tipo: 'rovi', x: 99.5, z: 92.6, nome: 'i rovi della radura', notte: true,
      richiede: { arma: ['roncola', 'motosega'], manca: "Un muro di rovi spessi come il filo spinato. A mani nude non si passa: serve una roncola o una motosega (dal Bubetto)." },
      giorno: "Di giorno la radura è vuota: solo neve e silenzio. Il Re dei Lupi esce di notte (dopo le 20:00).",
      descr: [
        { testo: "Garonio apre un varco nei rovi. Dall'altra parte c'è una radura bianca di neve, illuminata dalla luna." },
        { testo: "Al centro, un lupo argentato grande come una Punto. Non ringhia. Guarda Garonio come il Gigante guarda un preventivo." },
        { chi: 'garonio', testo: "Bella bestia. Ci sarebbe un maiale da restituire." },
      ],
    },
    seguaci: ['lupo_giovane', 'lupo_giovane'],
    brancoOgni: 3,                          // fase 1: ogni 3 turni del re il branco attacca tutto insieme
    trofeo: 'mantelloLupi', soldi: 300,
    intro: "Il Re dei Lupi alza il muso: il branco esce dagli alberi tutto insieme.",
    branco: "Il branco attacca insieme!",
    fase2: "Il Re dei Lupi si alza sotto la luna e ULULA. Ogni turno lo stress sale di 15. Sfoga la rabbia!",
    ululato: "Ululato alla luna: stress +15.",
    vittoria: [
      { testo: "Il Re dei Lupi si ferma, guarda Garonio negli occhi e se ne va nel bosco. Sulla neve lascia il suo mantello di pelo argentato." },
      { chi: 'garonio', testo: "Nessuno in paese ci crederà. Il Gigante men che meno." },
    ],
    dopo: { specie: ['lupo', 'lupo_giovane'] },
  },
};

// frasi comuni della caccia
export const CACCIA = {
  brivido: "Garonio sente un brivido lungo la schiena. «Qui non ci torno finché non sono più forte...»",
  entraLoStesso: 'Entra lo stesso (quasi impossibile vincere)',
  meglioDiNo: 'Meglio di no',
  affronta: 'Affronta il re',
  torna: 'Torna indietro',
  sconfitta: "Garonio si risveglia fuori dalla tana, pieno di lividi. Il re è ancora lì. Lo aspetta.",
  fuga: "Garonio scappa dalla tana. Il re non lo insegue: sa che tornerà.",
  tracciaTrovata: 'Traccia trovata ({n}/{tot})',
  tanaAperta: 'Hai trovato la tana del {nome}! È segnata sulla minimappa.',
  giaSconfitto: "Qui ormai c'è solo silenzio. E un po' di puzza.",
  leggenda: "Tutti e tre i re sono caduti! In paese, al bar, appendono una targa: «A Garonio, la Leggenda della Bassa». Il Gigante dice che è una targa del Lotto.",
};

// ---------- Gruppi visibili sulla mappa (GDD 18.4) ----------
// Zone come rettangoli in caselle (src/map.js). quando: alba | giorno | sera | notte | sempre
export const ZONE = {
  campi:     { nome: 'Campi e canale', rett: [[26, 8, 150, 27]] },
  capannoni: { nome: 'Capannoni e silos', rett: [[117, 56, 157, 72]] },
  pollaio:   { nome: 'Pollaio', rett: [[74, 71, 90, 83]] },
  bosco:     { nome: 'Bosco', rett: [[8, 88, 152, 97]] },
  paese:     { nome: 'Piazza e silos', rett: [[2, 48, 40, 60], [117, 57, 124, 70]] },
  ovunque:   { nome: 'Ovunque', rett: [[26, 8, 150, 27], [2, 48, 40, 60], [56, 56, 95, 72]] },
};

// orari: [da, a) in ore di gioco (la giornata va dalle 6 a mezzanotte)
export const ORARI = {
  alba: [6, 9], giorno: [6, 19], sera: [17, 22], notte: [20, 24], sempre: [6, 24], seraNotte: [17, 24],
};

// gruppi: membri = elenco di id (il primo è il capogruppo), peso = probabilità relativa,
// stagioni (facoltativo), piuAlba / piuSera = peso doppio in quell'orario
export const GRUPPI = [
  { zona: 'campi', quando: 'giorno', piuAlba: true, membri: ['nutria'], cresce: 'nutria', max: 3, peso: 3 },
  { zona: 'campi', quando: 'giorno', membri: ['nutria_gigante', 'nutria', 'nutria'], peso: 1 },
  { zona: 'campi', quando: 'giorno', membri: ['nutria_corazzata'], cresce: 'nutria_corazzata', max: 2, peso: 1 },
  { zona: 'capannoni', quando: 'notte', membri: ['ratto', 'ratto'], cresce: 'ratto', max: 4, peso: 3 },
  { zona: 'capannoni', quando: 'notte', membri: ['ratto_fogna', 'ratto', 'ratto'], peso: 1 },
  { zona: 'pollaio', quando: 'seraNotte', membri: ['volpe'], cresce: 'volpe', max: 2, peso: 2 },
  { zona: 'ovunque', quando: 'giorno', membri: ['gazza'], peso: 1 },
  { zona: 'paese', quando: 'giorno', membri: ['piccione', 'piccione'], cresce: 'piccione', max: 5, peso: 2 },
  { zona: 'bosco', quando: 'sempre', piuSera: true, membri: ['cinghiale'], cresce: 'cinghiale', max: 2, peso: 2 },
  { zona: 'campi', quando: 'sempre', stagioni: ['autunno'], membri: ['cinghiale'], cresce: 'cinghiale', max: 2, peso: 1 },
  { zona: 'bosco', quando: 'sempre', piuSera: true, membri: ['cinghiale_maschio'], peso: 1 },
  { zona: 'bosco', quando: 'notte', stagioni: ['inverno'], membri: ['lupo_giovane', 'lupo_giovane'], cresce: 'lupo_giovane', max: 3, peso: 2 },
  { zona: 'bosco', quando: 'notte', stagioni: ['inverno'], membri: ['lupo', 'lupo_giovane', 'lupo_giovane'], peso: 1 },
];

export const SPAWN = {
  maxGruppi: 3,             // gruppi sulla mappa insieme
  ogniOre: 2,               // un gruppo nuovo ogni ~2 ore di gioco per zona
  distMin: 13, distMax: 45, // compaiono fuori dallo schermo, ma non troppo lontano
  inseguono: 6,             // a che distanza si accorgono di Garonio
  velocita: 1.1, velocitaInseguimento: 2.2,
  clacson: 7,               // raggio del clacson che scaccia i gruppi piccoli
  durataOre: 5,             // dopo quante ore se ne vanno da soli
};

// avvisi sulla mappa
export const AVVISI = {
  nuovo: 'Si muove qualcosa: {nome} in zona {zona}.',
  attaccaPrimo: 'Attacca per primo: {nome}',
  scacciati: 'Il clacson li fa scappare!',
  vinto: 'Gruppo sconfitto!',
};
