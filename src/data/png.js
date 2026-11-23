// =====================================================================
//  PERSONAGGI NON GIOCANTI (PNG) — GDD capitoli 4, 17 e 19
//  Solo dati: dove stanno, a che ora, come sono fatti e cosa dicono.
//
//  posti: [{ ore: [da, a], x, z }]   dove si trova nelle varie ore (prima regola che combacia).
//         Coordinate della mappa grande (src/map.js). interno: 'bar' = sta dentro un edificio
//         (lo mostrerà il lavoro sugli interni; per ora non compare sulla mappa).
//  giro:  [[x, z], ...]              se c'è, il personaggio cammina avanti e indietro lungo questi punti.
//  aspetto: stesso formato dei personaggi di src/pixel.js (usato per sprite e ritratto).
//  saluti / chiacchiere: frasi a caso. {titolo} = titolo di Garonio, {nome} = nome del personaggio.
//  amicizia: [min, max, partenza]. Chiacchierare la prima volta nel giorno dà +1.
// =====================================================================

export const PNG = {
  mamma: {
    nome: 'La Mamma', ruolo: 'Gentile, l\'unica che difende Garonio.',
    posti: [{ ore: [6, 22], x: 68.8, z: 67.3 }],
    aspetto: { w: 16, h: 23, skin: '#f0c8a8', hair: '#8a6a4a', hairStyle: 'long', shirt: '#d87aa0', pants: '#5a4a6a', boots: '#3a2a1a', belly: true, eyes: 'normal' },
    amicizia: [0, 100, 60],
    saluti: [
      "Tesoro! Hai mangiato? No, perché sei pallido.",
      "Tuo padre urla, ma ti vuole bene. A modo suo. Molto a modo suo.",
      "Ti ho stirato la tuta. Non dirlo a tuo padre, dice che ti vizio.",
    ],
    chiacchiere: [
      "Quando eri piccolo dicevi che da grande volevi fare il gatto. Dormivi già tanto.",
      "La Pina dice cose su di te in paese. Io le dico che sei un bravo ragazzo. Poi vado a casa e prego.",
      "In cantina sparisce il salame. Sarà il gatto. Abbiamo un gatto? No. Allora non so.",
    ],
  },
  consulente: {
    nome: 'Il Consulente', ruolo: 'Amico fidato al bar: consigli su cosa trovare in giro.',
    posti: [{ ore: [9, 23], x: 16.6, z: 51.3, interno: 'bar' }],
    aspetto: { w: 16, h: 24, skin: '#e8b48a', hair: '#2a2a2a', hairStyle: 'flat', shirt: '#4a6aa8', tie: '#a83a3a', pants: '#3a3a4a', boots: '#1a1a1a', eyes: 'normal' },
    amicizia: [0, 100, 20],
    saluti: [
      "Garonio! Siediti. Te lo dico da professionista: oggi è una giornata di opportunità.",
      "Ecco il mio cliente preferito. Anche l'unico. Ma il preferito.",
      "Offrimi un caffè e ti cambio la giornata. Garantito, o quasi.",
    ],
    chiacchiere: [
      "Mai fidarsi di un meccanico che fischietta. Zeno fischietta sempre.",
      "Mio cugino ha preso in pieno la cabina della corrente e ha trovato... no, lascia stare.",
      "La Vigilessa fa il giro della piazza come un orologio svizzero. Svizzero di Codogno.",
    ],
  },
  zeno: {
    nome: 'Zeno il meccanico', ruolo: 'Scorbutico, ripara i mezzi e spesso ti frega.',
    posti: [{ ore: [7, 19], x: 86.3, z: 67.0 }],
    aspetto: { w: 17, h: 24, skin: '#d9a27a', hair: '#4a4a4a', hairStyle: 'flat', shirt: '#5a6a7a', overalls: '#2a3a5a', pants: '#2a3a5a', boots: '#1a1a1a', mustache: '#3a3a3a', eyes: 'angry' },
    amicizia: [-50, 50, -5],
    saluti: [
      "Cosa vuoi. Se è rotto, costa. Se non è rotto, costa uguale.",
      "Cosa le hai fatto a 'sta Vespa, l'hai portata in guerra?",
      "Garanzia? Sì, fino al cancello.",
    ],
    chiacchiere: [
      "Il prezzo è quello. Se non ti va, ripara da solo. Con cosa, con le mani?",
      "Tuo padre mi deve ancora i soldi del '98. Li aggiungo al tuo conto, così si pareggia.",
      "Fischiettare? Io? Mai. ♪ fiu fiu ♪",
    ],
  },
  bubetto: {
    nome: 'Il Bubetto', ruolo: 'Magazzino di tutto: vestiti, armi, manuali. Dà missioni secondarie.',
    posti: [{ ore: [7, 20], x: 7.6, z: 51.4 }],
    aspetto: { w: 17, h: 24, skin: '#f0c098', hair: '#c88a3a', hairStyle: 'messy', hat: '#2a5a3a', shirt: '#e0c050', pants: '#6a4a2a', boots: '#3a2a1a', belly: true, eyes: 'normal' },
    amicizia: [-50, 50, 0],
    saluti: [
      "Garonio! Il mio cliente più affidabile. Affidabile nel senso che torni sempre.",
      "Roba buona, roba nuova, roba... trovata. Non chiedere.",
      "Il magazzino lo sto sistemando. Intanto vendo dal furgone, come i grandi.",
    ],
    chiacchiere: [
      "Questa giacca? Era di un sindaco. Di quale paese non lo so.",
      "Se mi porti code di ratto ti pago. Cosa ci faccio? Affari miei.",
      "Mister Frank mi deve dei soldi. Tutti mi devono dei soldi. Io invece no.",
    ],
  },
  vigilessa: {
    nome: 'La Vigilessa', ruolo: 'Fa la multa se ti vede urtare qualcosa coi mezzi.',
    posti: [{ ore: [8, 19], x: 20, z: 51.6 }],
    giro: [[3, 51.6], [38, 51.6]],
    aspetto: { w: 16, h: 24, skin: '#f0c8a8', hair: '#2a1a1a', hairStyle: 'long', hat: '#f4f4f4', shirt: '#2a3a6a', belt: '#f4f4f4', pants: '#2a3a6a', boots: '#111', eyes: 'angry' },
    amicizia: [-50, 50, 0],
    saluti: [
      "Garonio. Di nuovo. Patente e libretto. Anche della zappa.",
      "Il paracarro era lì da prima di te.",
      "Circolare. Piano. In silenzio.",
    ],
    chiacchiere: [
      "Non accetto caffè, regali o pannocchie. Le pannocchie meno di tutto.",
      "Ho multato anche mia madre. Due volte. La seconda era recidiva.",
      "La piazza è zona pedonale. Anche per i trattori. SOPRATTUTTO per i trattori.",
    ],
  },
  patata: {
    nome: 'Il Patata', ruolo: 'Vicino grosso, lento e buono. Parla solo di patate.',
    posti: [{ ore: [6, 20], x: 101.5, z: 27.6 }],
    aspetto: { w: 19, h: 25, skin: '#e8b090', hair: '#8a6a3a', hairStyle: 'bald', hat: '#c8a050', shirt: '#7a8a4a', overalls: '#6a5a3a', pants: '#6a5a3a', boots: '#3a2a1a', belly: true, eyes: 'sleepy' },
    amicizia: [-50, 50, 10],
    saluti: [
      "Garonio, sai cosa ci vuole per essere felici? Una patata. Bollita. Basta.",
      "Ciao Garonio. Hai visto le mie patate? Belle, eh? Le ho chiamate tutte per nome.",
    ],
    chiacchiere: [
      "Tuo papà mi ha chiesto in prestito la turbina. Nel 2009. La sto ancora aspettando.",
      "Mia mamma dice che sono rotondo come una patata. È un complimento, credo.",
      "Fritte, lesse, al forno. La patata non giudica. La patata accoglie.",
    ],
  },
  postino: {
    nome: 'Il Postino', ruolo: 'Sa tutto di tutti, legge le lettere degli altri.',
    posti: [{ ore: [6, 20], x: 36.5, z: 27.6 }],
    aspetto: { w: 16, h: 24, skin: '#f0c098', hair: '#3a2a1a', hairStyle: 'flat', hat: '#2a4a8a', shirt: '#6a8ac8', pants: '#2a3a6a', boots: '#1a1a1a', mustache: '#3a2a1a', eyes: 'normal' },
    amicizia: [-50, 50, 5],
    saluti: [
      "C'è una lettera per te. Ah no, era di tuo padre. Dice che sei pigro. L'ho letta per sbaglio. Tre volte.",
      "Garonio! Novità? No? Allora te le dico io.",
    ],
    chiacchiere: [
      "Con la Pina? Ma chi l'ha detto? ...Chi l'ha detto?",
      "Mister Frank riceve pacchi dall'America. Dentro ci sono stivali. Sempre stivali.",
      "Il geometra Ballarin ha scritto al comune per le tue file storte. Ho la copia, se vuoi.",
    ],
  },
  frank: {
    nome: 'Mister Frank', ruolo: 'Emiliano che si crede americano. Ha il pozzo più profondo.',
    posti: [{ ore: [6, 21], x: 137.5, z: 27.6 }],
    aspetto: { w: 17, h: 25, skin: '#e8a080', hair: '#c8c8c8', hairStyle: 'flat', hat: '#8a5a2a', shirt: '#b84a3a', plaid: true, pants: '#3a5a8a', belt: '#c8a050', boots: '#6a3a1a', mustache: '#d8d8d8', eyes: 'normal' },
    amicizia: [-50, 50, 0],
    saluti: [
      "Hey boy! Qui siamo nel Texas della Bassa!",
      "Howdy, Garonio! Tuo papà? Good man. Ladro, ma good man.",
    ],
    chiacchiere: [
      "Il mio pozzo è il più profondo della county. Non toccarlo, eh!",
      "Il trattore? No no, quello è il mio horse. Si chiama Thunder.",
      "In America le pannocchie sono grandi così. Io in America non ci sono mai stato, ma lo so.",
    ],
  },
};
