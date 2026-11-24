// =====================================================================
//  LAVORETTI, EASTER EGG E COSE CHE CAPITANO
//  Solo dati e testi. Logica in src/lavoretti.js e src/sorprese.js.
// =====================================================================

// ---------- Lavoretti: esperienza dalle faccende di tutti i giorni ----------
export const LAVORETTI = {
  // XP in più per ogni azione (si somma a quella di base del gioco)
  xpExtra: { zappa: 2, semina: 2, annaffia: 2, raccogli: 3, uovo: 2, nutri: 3, scaccia: 2 },
  lavoratore: { soglia: 10, xp: 15, testo: 'Dieci lavoretti in un giorno! Il Gigante ti ha visto. Quasi sorride. +{xp} XP' },
  legna: {
    ceppo: [58.6, 64.6], catasta: [56.9, 63.7],
    max: 8, xp: 5, stanchezza: 4, stress: -2, minuti: 15, prezzoMamma: 2,
    testi: ["TOC! Un ciocco perfetto. Sfogarsi sulla legna fa bene.", "CRAC! Garonio immagina che il ciocco sia Mister Mountain. Funziona.", "TUNK. L'accetta resta incastrata. Al secondo colpo va meglio."],
    finita: 'La catasta di oggi è finita. Anche la voglia.',
    sorpresa: { probabilita: 0.04, testi: [
      "Dentro il ciocco c'è un barattolo con 5000 lire del '74. Valgono 2€ di nostalgia. +20 XP",
      "Nel ciocco c'è un nido di formiche. Molto arrabbiate. Garonio balla il twist per dieci minuti. +20 XP",
      "Il ciocco ha un nodo a forma di faccia del Gigante. Lo tieni come portafortuna. +20 XP",
    ] },
    mamma: 'Porta la legna per la stufa ({n} ciocchi, {soldi}€)',
    mammaGrazie: ["Che bravo il mio ragazzo! Tieni, e non dirlo a tuo padre.", "Finalmente la stufa va. Ti faccio la polenta stasera."],
  },
  pesca: {
    pontile: [35, 77.4], max: 4, minuti: 30, stanchezza: 1,
    esiti: [
      { peso: 30, testo: "Una carpa grassa come il Moreno! La vendi al volo al pescivendolo.", soldi: 4, xp: 6, stress: -6 },
      { peso: 20, testo: "Un pesce gatto con la faccia offesa. 3€ al ristorante del paese.", soldi: 3, xp: 5, stress: -5 },
      { peso: 20, testo: "Niente. Però il silenzio del laghetto vale più di un pesce.", xp: 2, stress: -4 },
      { peso: 15, testo: "Uno scarpone. Del 43. Il tuo numero. Inquietante.", xp: 1, stress: 2 },
      { peso: 6, testo: "Una bottiglia con un messaggio: «Chi trova questo biglietto è scemo». Firmato: il Consulente.", xp: 10, stress: 1 },
      { peso: 2, testo: "Un anello d'oro! Lo vendi al Compro Oro di Lodi. Meglio non chiedersi di chi era.", soldi: 80, xp: 20, stress: -10 },
      { peso: 4, testo: "Abbocca una nutria. Ti guarda. La guardi. Lei se ne va con l'esca.", xp: 3, stress: 3 },
    ],
    finita: 'I pesci per oggi hanno capito il trucco.',
  },
};

// ---------- Easter egg e cose che capitano ----------
export const SORPRESE = {
  // la fontana dei desideri in piazza: 1€ e un desiderio
  fontana: {
    x: 8.8, z: 50.7, prezzo: 1, jackpot: { probabilita: 0.05, soldi: 50 },
    desideri: [
      "Garonio desidera che il Gigante vada in pensione. La fontana gorgoglia: «Ahahah».",
      "Garonio desidera un letto più grande. Niente succede. Forse domani.",
      "Garonio desidera che Mister Mountain si perda nella nebbia. La fontana dice: «Ci sto lavorando».",
      "Garonio desidera di non dover desiderare. Filosofia da piazza.",
      "La moneta rimbalza fuori dalla fontana. Neanche i desideri ti vogliono.",
    ],
    jackpotTesto: "JACKPOT! La fontana sputa fuori le monetine di tutto il paese: +{soldi}€. Forse non si fa.",
  },
  // cinque nani da giardino nascosti per la mappa: trovali tutti
  gnomi: {
    posti: [[55.5, 26.2], [44, 87], [151, 60.5], [3.5, 74], [117, 33]],
    xp: 10, premio: { soldi: 100, xp: 60 },
    trovato: "Un nano da giardino! Ha la faccia di uno che sa delle cose. ({n}/5) +{xp} XP",
    tutti: "TUTTI E CINQUE I NANI! Si mettono in fila e cantano «Romagna mia». Poi spariscono lasciando {soldi}€. +{xp} XP",
  },
  // il maiale scappato dal capannone
  maiale: {
    daGiorno: 2, probabilita: 0.3, ore: [8, 16], riuscita: 0.6, scadenza: 18,
    arrivo: "🐷 Un maiale è scappato dal capannone! Va a spasso sulla provinciale. Acchiappalo!",
    preso: ["Placcaggio da rugby! Il maiale è tuo. Lo riporti al capannone. +{xp} XP", "Garonio lo prende per la coda. Il maiale protesta, ma torna a casa. +{xp} XP"],
    scappa: ["Il maiale ti scivola tra le mani come una saponetta. Stress +2", "Il maiale fa una finta degna di Maradona. Stress +2"],
    perso: "Il maiale è finito in piazza e ha mangiato i gerani della Sciura Ines. Lo sa tutto il paese. Stress +6",
    xp: 15,
  },
  // il turista tedesco che si è perso
  turista: {
    probabilita: 0.25, ore: [10, 17], x: 22, z: 51.3,
    aspetto: { sprite: 'escursionista', w: 16, h: 24, skin: '#f8d0b0', hair: '#f0e080', hairStyle: 'flat', hat: '#e8e0c0', shirt: '#f080a0', pants: '#e8d8a8', boots: '#a07050', eyes: 'normal' },
    nome: 'Turista tedesco',
    saluto: "Guten Tag! Ich suche... il castello di Grazzano Visconti? Mappa dice qui. Mappa è sbagliata?",
    giusta: { etichetta: 'Indica la strada giusta', testo: "«Danke schön!» Ti dà 5€ e una caramella alla menta di dubbia data. +5 XP", soldi: 5, xp: 5 },
    paradiso: { etichetta: 'Mandalo al Night Paradiso', testo: "Il turista va al Paradiso. Domani sul giornale di Monaco: «Cultura italiana molto interessante». +3 XP", xp: 3 },
    finta: { etichetta: 'Fingi di non capire («No spik inglish»)', testo: "Il turista se ne va. Garonio si sente un po' in colpa. Poco." },
  },
  // il portafoglio perso per strada
  portafoglio: {
    probabilita: 0.25, soldi: 30,
    testo: "Un portafoglio in mezzo alla strada! Dentro: 30€, la tessera della bocciofila e la foto di un barboncino.",
    restituisci: { etichetta: 'Portalo al municipio (+20 XP, reputazione +10)', testo: "Il proprietario era il Walter. Piange. Ti abbraccia. Puzza di naftalina. +20 XP", xp: 20, rep: 10 },
    tieni: { etichetta: 'Tienilo (+30€, reputazione −10)', testo: "30€ in tasca. La foto del barboncino ti fissa. Per sempre.", rep: -10 },
  },
  // Mister Mountain in ferie: la domenica mattina pesca al laghetto
  mountainPesca: {
    ogni: 7, ore: [7, 12], x: 37.6, z: 77.3,
    testi: [
      "Mister Mountain, in canottiera, con la canna da pesca. «Garonio. Oggi è domenica. Oggi non ti sgrido.» Pausa. «Domani sì.»",
      "Mister Mountain non si gira. «Shh. Spaventi le carpe.» Per la prima volta nella storia, ti fa quasi tenerezza.",
    ],
    stress: -8,
  },
  // la sagra del paese: ogni 7 giorni, la sera in piazza
  sagra: {
    ogni: 7, giornoSfasato: 6, ore: [19, 24], palco: [26, 50.6],
    banda: [{ shirt: '#c83a2e', sprite: 'chitarrista' }, { shirt: '#3a5fc8', sprite: 'punk_chitarra' }, { shirt: '#e8c040', sprite: 'hippie_barba' }],
    annuncio: "🎉 Stasera c'è la Sagra del Cotechino in piazza! Banda, liscio e salamelle.",
    balla: { etichetta: 'Balla il liscio con la Sciura Ines', testo: "Valzer, mazurka e polca. La Sciura Ines balla meglio di te. Molto meglio. Stress −12, +8 XP", stress: -12, xp: 8, stanchezza: 5 },
    salamella: { etichetta: 'Salamella e lambrusco (4€)', prezzo: 4, testo: "Salamella con le cipolle. Il paradiso esiste ed è unto. Stress −8, Vita +10", stress: -8, vita: 10 },
  },
  // luci strane sopra il grano e il cerchio misterioso il giorno dopo
  ufo: {
    ore: [21, 24], probabilitaOra: 0.05, x: 37, z: 17, durata: 10, giorniCerchio: 3, xp: 40,
    avvistamento: "👽 Luci strane sopra il campo di grano... Garonio si stropiccia gli occhi. Saranno i fari del Moreno?",
    cerchio: "Un cerchio perfetto nel grano! Al centro, un biglietto: «Torneremo. Più pigri di così non ne abbiamo trovati». +{xp} XP",
  },
};
