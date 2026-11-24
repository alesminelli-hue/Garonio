// =====================================================================
//  CASCINE DEI VICINI E MISSIONI TRUFFALDINE — GDD capitoli 19.5 e 19.6
//  Solo dati: dove stanno le cascine, chi le sorveglia (vicino, cane, garzone),
//  cosa si può rubare, le battute. Il sistema è in src/cascine.js.
//  Le missioni truffaldine vere e proprie stanno in src/data/secondarie.js (da: 'gigante', truffaldina: true).
//
//  Coordinate della mappa grande (src/map.js). Angoli: 0 = est, -PI/2 = nord (verso i campi).
//  terreno: rettangolo in cui, durante una truffa contro quel vicino, Garonio è "sorvegliato".
//  porta:   da qui il vicino ascolta di notte, quando è dentro casa.
//  vista:   [raggio, mezzo angolo in gradi] del cono di vista.  udito: raggio base dell'udito.
// =====================================================================

const N = -Math.PI / 2;

export const VICINI = {
  patata: {
    nome: 'Il Patata', cascina: 'cascina-patata',
    terreno: { x0: 84, x1: 118, z0: 8, z1: 45 },
    porta: { x: 101, z: 39.6 },
    vista: [8, 38], udito: 2.5, sguardo: N, giro: 70,
    cane: { id: 'bollito', nome: 'Bollito', x: 95.5, z: 40.8, vista: [5, 40], udito: 3, sguardo: N, dorme: 0.55,
      aspetto: { pelo: '#c89a5a', scuro: '#8a6234', taglia: 1 } },
    garzone: { id: 'ugo', nome: 'Ugo, il nipote del Patata', ore: [7, 19], giro: [[92, 27], [112, 27]], vista: [6, 35], udito: 2,
      aspetto: { sprite: 'cappellino_rosso', w: 15, h: 22, skin: '#f0c098', hair: '#c8a050', hairStyle: 'messy', shirt: '#e07a3a', pants: '#4a5a8a', boots: '#3a2a1a', eyes: 'sleepy' } },
    battute: [
      "Garonio! Guarda questa patata. Non è bellissima? Ha la faccia di mia mamma.",
      "Ehi Garonio, sei pallido. Ti serve una patata.",
      "Tuo papà mi deve ancora la turbina. Dal 2009. Diglielo. Con gentilezza.",
      "Lo sai che io e la patata siamo nati lo stesso giorno? Non la stessa patata, ma...",
    ],
    battuteTruffa: [
      "Garonio, cosa fai da queste parti? Le patate non si rubano, eh. Le patate si amano.",
      "Hmm... ho sentito un rumore. Sarà stata una patata che cade.",
    ],
    scoperta: [
      "GARONIO! Cosa stai facendo nel mio campo?! Lo dico a mia mamma!",
      "Ma... Garonio?! Io ti ho dato le mie patate migliori! E tu mi fai questo?",
    ],
    rissa: "Mi hai fatto arrabbiare. E quando mi arrabbio divento una patata... FRITTA!",
    perdonato: "Va bene, va bene. Però domani mi porti una pannocchia. Due.",
    odio: ["Garonio. Le mie patate non ti salutano più. E neanche io.", "Vai via. Anzi no, prima ridammi il mio rispetto. Poi vai via."],
    creduto: ["Ah, cercavi il gatto. Anch'io una volta ho perso un gatto. Era una patata. Va bene, vai.", "Ah ecco. Scusa, pensavo male. Io penso sempre male, poi mangio una patata e mi passa."],
    nonCreduto: ["Garonio, io sarò lento, ma non sono una patata. Cioè, un po' sì. Ma non così tanto."],
    sconfitto: ["Ahia. Va bene, hai vinto. Vado a consolarmi con una patata. Con due.", "Basta, basta! Fai quello che vuoi, ma stasera lo racconto a mia mamma!"],
    pace: ["Una pannocchia? Per me? Va bene, ti perdono. Un pochino. Ma la turbina del 2009 resta un argomento aperto."],
    vendita: ["Tieni. Trattale bene, sono ancora piccole.", "Ecco le patate. Quella grossa si chiama Gino. Salutalo."],
    bollita: ["Assaggia. Senti? È il sapore della felicità. Un po' sciapa, la felicità, ma buona.", "Bollita da stamattina alle cinque. Come me, che bollo da quando sono nato."],
    nemici: ['vicino_patata', 'garzone_ugo', 'cane_bollito'],
  },
  postino: {
    nome: 'Il Postino', cascina: 'cascina-postino',
    terreno: { x0: 22, x1: 51, z0: 8, z1: 45 },
    porta: { x: 36.5, z: 39.6 },
    vista: [9, 40], udito: 3.5, sguardo: N, giro: 80,
    cane: { id: 'francobollo', nome: 'Francobollo', x: 31.5, z: 40.8, vista: [4, 45], udito: 6, sguardo: N, dorme: 0.15,
      aspetto: { pelo: '#f0f0e8', scuro: '#a8a090', taglia: 0.7 } },
    battute: [
      "Garonio! Sai chi ho visto ieri sera con la Pina? Non te lo dico. ...Va bene, te lo dico.",
      "C'è una cartolina per tua mamma. Dal mare. Dice «ti penso». Chi la pensa? Indaghiamo.",
      "Il Gigante ha scritto al consorzio. Ha sbagliato tre parole su dieci. Ho corretto io.",
    ],
    battuteTruffa: [
      "Garonio... perché giri intorno ai miei paletti? Sto prendendo appunti.",
      "Chi va là? Ah, sei tu. Strano. Molto strano. Lo scrivo.",
    ],
    scoperta: [
      "AH-HA! Garonio coi miei paletti in mano! Questa la sa tutto il paese entro le nove!",
      "Ti ho visto, sai? Io vedo tutto. Ho anche la copia di quello che stai pensando.",
    ],
    rissa: "Ti avviso: ho fatto il corso di autodifesa per corrispondenza. Mi è arrivato aperto, ma l'ho letto!",
    perdonato: "Ok, faccio finta di niente. Però mi devi un pettegolezzo. Uno buono.",
    odio: ["Ho scritto una lettera su di te. Al sindaco. Al prete. E a tua mamma.", "Non ho niente da dirti. Cioè, ce l'ho, ma lo dico agli altri."],
    creduto: ["Ah, il piccione viaggiatore! Era per me? No? Peccato. Va bene, ti credo. Lo scrivo comunque.", "Mmh. Plausibile. Poco, ma plausibile. Vai."],
    nonCreduto: ["Il gatto? Tu non hai un gatto. Lo so perché leggo le bollette del veterinario. Di tutti."],
    sconfitto: ["Ahi! Va bene, va bene! Fai pure, tanto io scrivo tutto nel mio quaderno!", "Basta! Mi arrendo! Ma domani tutto il paese saprà che mi hai battuto. Cioè, no, questo non lo dico."],
    pace: ["Un regalo? Che pensiero gentile. Lo dirò a tutti. Il regalo, non il resto."],
    nemici: ['vicino_postino', 'cane_francobollo'],
  },
  frank: {
    nome: 'Mister Frank', cascina: 'ranch-frank',
    terreno: { x0: 121, x1: 157, z0: 8, z1: 45 },
    porta: { x: 144.5, z: 39.6 },
    vista: [10, 36], udito: 3, sguardo: N, giro: 60,
    cane: { id: 'sceriffo', nome: 'Sceriffo', x: 138.5, z: 40.8, vista: [7, 40], udito: 4, sguardo: N, dorme: 0.25,
      aspetto: { pelo: '#3a2a1e', scuro: '#1e140c', taglia: 1.25 } },
    garzone: { id: 'kevin', nome: 'Kevin, il garzone di Frank', ore: [7, 19], giro: [[124, 27], [150, 27]], vista: [7, 35], udito: 2.5,
      aspetto: { sprite: 'ragazzo_zaino', w: 16, h: 24, skin: '#e8b090', hair: '#e0c060', hairStyle: 'messy', hat: '#c8b080', shirt: '#4a7ab0', plaid: true, pants: '#3a4a7a', boots: '#6a3a1a', eyes: 'normal' } },
    battute: [
      "Hey boy! Il mio horse oggi ha fatto 3 chilometri senza spegnersi. Record della county!",
      "Howdy, Garonio! Qui nel Texas della Bassa il sole tramonta alle sette. Come da voi, ma più western.",
      "Tuo papà? Good man. Ladro, ma good man. Tu sei uguale? Spero solo la parte good.",
      "Il mio pozzo è il più profondo della county. Non toccarlo, eh!",
    ],
    battuteTruffa: [
      "Hey boy... perché giri col trattore vicino al mio pozzo? Sei un cattle rustler?",
      "Kevin! Hai sentito anche tu? Sembrava un trattore. Uno rosso. Con un Garonio sopra.",
    ],
    scoperta: [
      "WHAT?! Garonio col trattore sul MIO pozzo?! Questo è un furto di acqua, boy! In Texas ti impiccano! Qui ti multano, ma è uguale!",
      "Lo sapevo! Tuo papà ti ha mandato! Il Gigante non cambia mai, e neanche il suo cucciolo!",
    ],
    rissa: "Kevin! Sceriffo! Saddle up! Facciamogli vedere come si fa in Texas!",
    perdonato: "Ok boy, per stavolta. Ma la prossima volta chiamo lo sceriffo. Quello vero, non il cane.",
    odio: ["Get out of my ranch, boy! Questa è proprietà privata del Texas della Bassa!", "Sceriffo, guardalo bene. Se torna, mordi."],
    creduto: ["Una mandria di nutrie scappate? Damn! Ok boy, vai a cercarle. Ma non dal mio pozzo.", "Ah, ti eri perso. Capita, la county è grande. Vai a casa, boy."],
    nonCreduto: ["Boy, sono emiliano, mica stupido. Cioè, americano. Ma non stupido."],
    sconfitto: ["Ok, ok! You win, cowboy! Ma questa la racconto al saloon. Cioè, al bar.", "Damn... Kevin, prendi il cavallo. Cioè, il trattore. Ce ne andiamo a letto."],
    pace: ["Un regalo? That's the spirit, boy! Tuo papà non me ne ha mai fatti. Sei meglio di lui. Di poco."],
    vendita: ["Thank you, boy! Pannocchie da rodeo, queste!", "Le pago di più perché sono generoso. E perché le rivendo a mio cugino a Cremona."],
    nemici: ['vicino_frank', 'garzone_kevin', 'cane_sceriffo'],
  },
};

// Bersagli delle missioni sulla mappa. Gli alberi si possono abbattere solo con la motosega del Gigante
// e ricrescono dopo "ricrescita" giorni (così le missioni si possono rifare).
export const BERSAGLI = {
  // dove si attacca la turbina per rubare l'acqua
  acqua: {
    frank: { x: 131.5, z: 38, nome: 'il pozzo di Mister Frank' },
    patata: { x: 115, z: 22, nome: 'il fosso del Patata' },
  },
  alberi: {
    patata: [[87, 12], [87, 16], [87, 20], [87, 24]],
    postino: [[24.5, 12], [24.5, 16], [24.5, 20], [24.5, 24]],
    frank: [[152, 12], [152, 16], [152, 20], [152, 24]],
  },
  ricrescita: 5,
  // paletti del confine tra il grano del Postino e il fienile del Gigante: si spostano di "sposta" verso ovest
  paletti: { vicino: 'postino', x: 49, z: [12, 16, 20, 24], sposta: -2.5 },
  // l'attrezzo da "prendere in prestito" e dove va portato
  prestito: { vicino: 'patata', x: 106.4, z: 37.6, nome: 'l\'erpice del Patata', oggetto: 'erpice_patata',
    tettoia: { x: 90.5, z: 65.8 } },
  // il pozzo di Frank: oggetto di scena (solido)
  pozzo: { x: 131.5, z: 37 },
  // cartelli vicino all'acqua da rubare
  cartelli: [{ x: 127.6, z: 37.6, testo: 'POZZO PRIVATO' }, { x: 117.2, z: 24.6, testo: 'FOSSO' }],
};

// Rumore delle azioni (in caselle, si somma all'udito di chi ascolta). Il ramo Furbizia lo riduce del 12% a grado.
export const RUMORE = { cammina: 0, corre: 2.5, trattore: 6, turbina: 2.5, motosega: 11, paletto: 1.2, prestito: 1.2 };

// Quanto in fretta sale il sospetto (al secondo) e quanto scende. A 1 ti scoprono.
export const SOSPETTO = { vista: 1.3, udito: 0.4, cala: 0.22, notteVista: 0.55, giornoUdito: 0.8, odio: 1.4 };

// Durata (secondi reali) delle azioni truffaldine
export const DURATE = { albero: 3, paletto: 1.6, prestito: 1.2, turbinaMinuti: 60 };

// Multa se ti scoprono e la Vigilessa è in giro (segnaposto finché non arriva il lavoro F)
export const MULTA_TRUFFA = 50;

// Oggetti di missione (si aggiungono a OGGETTI di src/data/armi.js all'avvio)
export const OGGETTI_TRUFFA = {
  motosega_gigante: { nome: 'Motosega del Gigante', icona: '🪚', missione: true },
  erpice_patata: { nome: 'Erpice del Patata', icona: '🔱', missione: true },
};

// Cosa vendono o fanno i vicini fuori dalle truffe
export const COMMERCI = {
  patata: { patate: { n: 3, prezzo: 5 }, bollita: true },
  postino: { voce: 1 },
  frank: { mais: 14 },
};

// Le voci del Postino: metà sono vere (e aiutano le truffe), metà inventate.
// effetto: assente = quella notte il vicino non c'è; caneDorme = quella notte il cane dorme come un sasso.
export const VOCI = [
  { testo: "Stanotte Mister Frank va al ballo country a Busseto. Col cappello buono. Il ranch resta vuoto, a parte il cane.", effetto: { assente: 'frank' } },
  { testo: "Il cane del Patata stanotte dorme come un sasso: gli hanno dato le patate col burro.", effetto: { caneDorme: 'patata' } },
  { testo: "Io stanotte vado a letto presto. Te lo dico perché... così. Non venire a guardare i paletti, eh.", effetto: { assente: 'postino' } },
  { testo: "Mister Frank ha venduto il pozzo agli americani. Veri. Del Texas. Lo so da fonte certa: me l'ha detto lui." },
  { testo: "Zeno fischietta da tre giorni. Vuol dire che ha comprato pezzi usati. O che è innamorato. Peggio." },
  { testo: "La Vigilessa ha multato un piccione. Il piccione ha fatto ricorso." },
  { testo: "Il Patata parla con le patate. Le patate rispondono? Non mi sbilancio." },
];

// Frasi del Gigante per le truffe (abbassa la voce)
export const GIGANTE_TRUFFE = {
  etichetta: '🤫 «Hai qualche lavoretto... speciale?»',
  attacco: [
    "*abbassa la voce* Senti, Garonio. C'è un lavoretto. Di quelli che non si scrivono sul registro.",
    "*si guarda intorno* Vieni qui. Più vicino. No, non così vicino. Ascolta bene.",
  ],
  niente: [
    "Lavoretti speciali? Non oggi. Oggi siamo onesti. Fino a stasera.",
    "Shh! Non qui! E comunque per oggi niente. Finisci prima quello che hai.",
  ],
  inCorso: "Hai già un lavoretto da fare. E ricordati: io non ti ho mai detto niente.",
  riuscita: [
    "Non abbiamo visto niente, vero? Bravo. Tieni, e acqua in bocca. Rubata, ma in bocca.",
    "Perfetto. Se qualcuno chiede, eri al bar. Tutto il giorno. Come al solito, così ci credono.",
  ],
  rinuncia: "Lasci perdere? Va bene. Io non ti ho mai detto niente. Anzi, chi sei?",
  rifiutata: "Onesto, eh? Come tua madre. Va bene, ma il mais non si irriga con l'onestà.",
  fallita: "Ti sei fatto beccare?! E adesso tutto il paese dice che il Gigante manda il figlio a rubare! La colpa è TUA, non mia!",
};

// Mister Mountain quando una truffa fallisce (la colpa resta di Garonio)
export const MOUNTAIN_TRUFFA = [
  "GARONIO! Mandato a fare un lavoretto e ti fai beccare come un pollo! Adesso il paese dice che siamo ladri!",
  "Ti sei fatto scoprire dal vicino?! Quello che ti dava le patate?! Hai la furbizia di un sasso!",
];

// Le scuse di Garonio quando lo beccano
export const SCUSE = [
  "Cercavo il gatto. Sì, quello nero. ...Bianco. Il gatto.",
  "Era un piccione, l'ho inseguito fin qui. Un piccione enorme. Con la faccia da ladro.",
  "Sonnambulo! Sono sonnambulo. Guarda, dormo ancora. Zzz.",
  "Mi ha mandato il Consorzio. Controllo delle... cose. Del confine. Delle radici.",
  "Mi sono perso. È tutto uguale qui, campi, campi, campi...",
];

// Cosa dicono i garzoni se ci parli
export const PARLA_GARZONI = {
  ugo: [
    "Lo zio dice che da grande diventerò una patata anch'io. Spero di no.",
    "Io guardo il campo. Il campo non fa niente. Nemmeno io. Siamo una squadra.",
    "Se vedi lo zio arrabbiato, dagli una patata. Funziona sempre.",
    "Lo zio dice che da grande diventerò una patata anch'io. Io voglio fare lo youtuber.",
    "Se vedi lo zio digli che sto lavorando. Sto lavorando. Guarda, mi muovo.",
    "Ho chiesto allo zio il WiFi. Mi ha dato una patata. Ha detto \"connettiti con la terra\".",
    "Non ti ho visto. Non mi hai visto. Siamo d'accordo, vero?",
  ],
  kevin: [
    "Mister Frank mi chiama Kevin. Mi chiamo Gianluca. Però Kevin è più western.",
    "Lavoro qui da tre anni. Ho visto il Texas solo in TV. Anche lui.",
    "Il pozzo? Di notte lo guarda Sceriffo. Di giorno lo guardo io. Male, ma lo guardo.",
    "Frank vuole che lo chiami \"boss\". Io lo chiamo \"zio Franco\". Si offende in inglese.",
    "Faccio il cowboy da tre anni. Non ho mai visto una mucca da vicino. Solo i maiali.",
    "Ho chiesto un aumento. Frank mi ha dato un cappello. Uguale al suo. Di Carpi.",
    "Shh. Sto facendo la guardia. Cioè, sto giocando al telefono. Ma con gli occhi aperti.",
  ],
};

export const CANE_CAREZZE = [
  "{cane} si sdraia a pancia in su. Sei ufficialmente il suo umano preferito.",
  "{cane} ti lecca la mano. Sa di patate. O di stivali. Meglio non indagare.",
  "{cane} scodinzola così forte che quasi decolla.",
];

// Nemici della rissa nelle cascine (si aggiungono a ENEMIES di src/combat.js all'avvio).
// png / garzone / cane = da dove prendere lo sprite.
export const NEMICI_CASCINE = {
  vicino_patata: { png: 'patata', stat: { name: 'Il Patata', hp: 50, atk: 8, def: 4, spd: 2, xp: 20, money: 0, size: 8.4,
    moves: [
      { name: 'Pancia rotolante', pow: 1.4, stress: 2, w: 2 },
      { name: 'Lancio di patata', pow: 1, stress: 1, w: 3, line: 'Una patata vola dritta in fronte a Garonio.' },
      { name: 'Racconto di sua mamma', pow: 0, stress: 7, w: 1, line: '«Mia mamma diceva sempre...» (dura venti minuti)' },
    ] } },
  vicino_postino: { png: 'postino', stat: { name: 'Il Postino', hp: 30, atk: 7, def: 2, spd: 9, xp: 16, money: 3, size: 8,
    moves: [
      { name: 'Raccomandata in faccia', pow: 1.1, stress: 1, w: 3 },
      { name: 'Pettegolezzo cattivo', pow: 0, stress: 9, w: 2, line: '«Lo sai cosa dicono di te al bar? Tutto vero, eh.»' },
      { name: 'Timbro', pow: 0.8, stress: 2, w: 2, line: 'TUNK! Garonio ha il timbro «RESPINTO» sulla fronte.' },
    ] } },
  vicino_frank: { png: 'frank', stat: { name: 'Mister Frank', hp: 44, atk: 9, def: 3, spd: 6, xp: 20, money: 5, size: 8.2,
    moves: [
      { name: 'Lazo', pow: 0.6, stress: 3, w: 2, line: 'Frank ti prende al lazo. Yeehaw.' },
      { name: 'Calcio di stivale', pow: 1.4, stress: 2, w: 3 },
      { name: 'Yeehaw!', pow: 0, stress: 7, w: 1, line: '«YEEEHAW!» Garonio non capisce, ma si spaventa.' },
    ] } },
  garzone_ugo: { garzone: 'patata', stat: { name: 'Ugo', hp: 20, atk: 5, def: 1, spd: 5, xp: 8, money: 0, size: 7.4,
    moves: [
      { name: 'Spintone timido', pow: 0.8, stress: 1, w: 3 },
      { name: 'Chiama lo zio', pow: 0, stress: 4, w: 1, line: '«ZIOOOO!»' },
    ] } },
  garzone_kevin: { garzone: 'frank', stat: { name: 'Kevin', hp: 26, atk: 6, def: 2, spd: 7, xp: 10, money: 2, size: 8,
    moves: [
      { name: 'Pugno da saloon', pow: 1.1, stress: 1, w: 3 },
      { name: 'Posa da cowboy', pow: 0, stress: 4, w: 1, line: 'Kevin si sistema il cappello. Non succede nient\'altro.' },
    ] } },
  cane_bollito: { cane: 'patata', stat: { name: 'Bollito', hp: 18, atk: 5, def: 1, spd: 6, xp: 6, money: 0, size: 3.6,
    moves: [
      { name: 'Morso molle', pow: 0.9, stress: 1, w: 3 },
      { name: 'Si addormenta', pow: 0, stress: 0, skip: true, w: 1, line: 'Bollito si sdraia e dorme. In mezzo alla rissa.' },
    ] } },
  cane_francobollo: { cane: 'postino', stat: { name: 'Francobollo', hp: 12, atk: 4, def: 0, spd: 12, xp: 5, money: 0, size: 3,
    moves: [
      { name: 'Abbaio stridulo', pow: 0, stress: 5, w: 2, line: 'YIP YIP YIP YIP!' },
      { name: 'Morso alla caviglia', pow: 1, stress: 2, w: 3 },
    ] } },
  cane_sceriffo: { cane: 'frank', stat: { name: 'Sceriffo', hp: 30, atk: 9, def: 2, spd: 9, xp: 12, money: 0, size: 4.4,
    moves: [
      { name: 'Morso dello sceriffo', pow: 1.3, stress: 2, w: 3 },
      { name: 'Ringhio', pow: 0, stress: 6, w: 1 },
    ] } },
};
