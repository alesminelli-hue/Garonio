// =====================================================================
//  LE CHICCHE DELL'ENDGAME (src/endgame.js, GDD capitolo 27.6-27.9)
//  - Concilio del Gambalone: a ogni cambio di stagione la classifica provvisoria delle cascine della Bassa
//    (Gigante compreso); a fine anno il Concilio finale elegge l'Agricoltore dell'Anno.
//  - Notte delle Leggende: una notte a settimana (dalle 21) i mostri sono più forti, più spesso feroci,
//    più numerosi e lasciano bottino doppio e gettoni.
//  - Taglie settimanali: tre alla bacheca della piazza, pagate in soldi e gettoni 🪙; con i gettoni si compra
//    roba esclusiva alla bacheca stessa.
//  - Armi con il «marchio»: un'arma nuova a volte arriva con un marchio a caso (della Nonna, del Diavolo...),
//    che cambia attacco, difesa o colpo critico. Si cambia con la Pergamena del Fabbro (bacheca).
//  - Record: le imprese di Garonio, nella scheda 📜 del menu J.
// =====================================================================

// ---------- Concilio del Gambalone ----------
export const CONCILIO = {
  nome: 'Concilio del Gambalone',
  presidente: 'Il Presidente del Concilio',
  // chi gareggia. prod = produzione media al giorno per categoria (cresce un po' ogni anno)
  cascine: {
    gigante: { nome: 'Il Gigante', icona: '🧔', prod: { maiale: 2.4, uova: 140, latte: 0, mais: 45, grano: 16, guadagni: 1400 } },
    patata:  { nome: 'Il Patata', icona: '🥔', prod: { maiale: 0.8, uova: 60, latte: 40, mais: 60, grano: 22, guadagni: 900 } },
    postino: { nome: 'Il Postino', icona: '✉️', prod: { maiale: 1.0, uova: 210, latte: 30, mais: 25, grano: 12, guadagni: 850 } },
    frank:   { nome: 'Mister Frank', icona: '🤠', prod: { maiale: 3.0, uova: 40, latte: 120, mais: 20, grano: 8, guadagni: 1300 } },
    camper:  { nome: 'Il Vecchio Camper', icona: '🧓', prod: { maiale: 1.4, uova: 90, latte: 150, mais: 35, grano: 26, guadagni: 1000 } },
  },
  crescitaAnno: 0.25,                     // +25% all'anno
  categorie: {
    maiale: { nome: 'Maiali migliori', icona: '🐖' },
    uova: { nome: 'Più uova', icona: '🥚' },
    latte: { nome: 'Più latte', icona: '🥛' },
    mais: { nome: 'Miglior mais', icona: '🌽' },
    grano: { nome: 'Miglior grano', icona: '🌾' },
    guadagni: { nome: 'Più guadagni', icona: '💶' },
  },
  punti: [5, 3, 2, 1],                    // primo, secondo, terzo, quarto di ogni categoria
  truffa: 0.12,                           // ogni truffa riuscita a una cascina vicina le toglie il 12% (fino al 50%)
  premioStagione: [1500, 800, 400],       // soldi per Garonio se arriva primo, secondo o terzo in classifica di stagione
  premioAnno: { soldi: 10000, vestito: 'gambaloneOro' },
  annuncio: "📣 Domani mattina, in Pro Loco: il {nome}! Classifica provvisoria della stagione.",
  apertura: [
    "Pro Loco della Bassa, salone delle feste. Sedie di plastica, un gambalone di cartone sul palco, odore di caffè e brillantina.",
    "Il Presidente del Concilio batte tre volte il mestolo sul tavolo. «Silenzio! Si apre il {nome}! Classifica della stagione: {stagione}!»",
  ],
  noGara: "Garonio guarda dal fondo della sala. «Lei non ha un'azienda, giovanotto: non è in gara. Si accomodi tra il pubblico. Senza fischiare.»",
  vince: [
    "«...e primo in classifica: l'Azienda Agricola Garonio!» Applausi. Il Patata piange. Il Gigante applaude con due dita.",
    "«Primo, con distacco: Garonio!» Mister Frank grida «Yeehaw!» anche se ha perso. Lo fa sempre.",
  ],
  giganteVince: [
    "«Primo: il Gigante!» Il Gigante si alza, saluta come un papa e ti guarda: «Visto? Hai ancora da imparare.»",
    "«Il Gigante, ancora lui!» Tuo padre sale sul palco e ringrazia «la sua schiena, il suo trattore e nessun altro».",
  ],
  altroVince: "«Primo: {nome}!» Applausi di cortesia. Il Gigante borbotta: «comprato. È tutto comprato.»",
  finale: [
    "Fine dell'anno. Il gran Concilio del Gambalone: banda, salamelle, il sindaco in fascia e il Gambalone d'Oro su un cuscino di velluto.",
    "«Si sommano i punti delle quattro stagioni. E l'Agricoltore dell'Anno è...»",
  ],
  annoGaronio: [
    "«...GARONIO! L'Azienda Agricola Garonio!» La banda attacca. Il Gigante si alza, ti stringe la mano davanti a tutti. Poi, piano: «Bravo. Ma l'anno prossimo ti straccio.»",
  ],
  annoGigante: "«...il GIGANTE!» Tuo padre alza il Gambalone d'Oro come una coppa. Ti guarda. Ti fa l'occhiolino. Ti fa anche il gesto dell'ombrello, ma con affetto.",
  annoAltro: "«...{nome}!» Il Gigante esce prima della fine. «Non ci vengo più. Fino all'anno prossimo.»",
};

// ---------- Notte delle Leggende ----------
export const NOTTE = {
  ogni: 7,                 // ogni 7 giorni (giorno 7, 14, 21...)
  ore: [21, 24],
  livello: 3,              // livelli in più dei mostri
  feroce: 0.6,             // probabilità che un mostro sia feroce
  maxGruppi: 5, ogniOre: 1,
  gettoni: 1,              // gettoni per ogni scontro vinto
  leggenda: 0.12,          // probabilità che un'arma trovata stanotte prenda il marchio «delle Leggende»
  annuncio: "🌕 Stanotte è la Notte delle Leggende: dalle 21 i mostri sono più forti, più feroci e più ricchi. Bottino doppio!",
  inizio: "🌕 È iniziata la Notte delle Leggende. La luna è rossa come il naso del Tarcisio.",
  fine: "🌅 La Notte delle Leggende è finita. Scontri vinti stanotte: {n}.",
};

// ---------- Taglie ----------
export const TAGLIE = {
  bacheca: { x: 18.6, z: 50.6 },
  perSettimana: 3,
  // modelli: tipo nemico ('id' tra quelli che Garonio può incontrare), feroci, notte, boss leggendari
  modelli: [
    { tipo: 'nemico', n: [4, 7], soldi: 120, gettoni: 2, testo: 'RICERCATI: {nome} ×{n}. Vivi o morti. Meglio morti.' },
    { tipo: 'nemico', n: [6, 10], soldi: 180, gettoni: 3, testo: 'Il Comune paga per avere meno {nome} in giro: abbattine {n}. Firmato: il Sindaco (e la Vigilessa).' },
    { tipo: 'feroci', n: [3, 5], soldi: 250, gettoni: 3, testo: 'Bestie feroci in giro: abbattine {n}. Ricompensa offerta dalla Pro Loco.' },
    { tipo: 'notte', n: [3, 5], soldi: 300, gettoni: 4, testo: 'Notte delle Leggende: vinci {n} scontri prima dell\'alba.' },
    { tipo: 'stagione', n: [1, 1], soldi: 200, gettoni: 3, testo: 'Il Consorzio cerca prodotti: vendi almeno 500€ dalla tua cascina.', azienda: true },
  ],
  negozio: [
    { id: 'pergamena', nome: '📜 Pergamena del Fabbro: nuovo marchio all\'arma impugnata', gettoni: 3 },
    { id: 'tortaMele', nome: '🥧 Torta di Mele della Nonna Adalgisa', gettoni: 2, oggetto: 'tortaMele' },
    { id: 'zabaione', nome: '🍮 Zabaione Corroborante', gettoni: 2, oggetto: 'zabaione' },
    { id: 'distintivo', nome: '⭐ Distintivo dello Sceriffo della Bassa (esclusivo)', gettoni: 12, vestito: 'distintivo' },
    { id: 'forconeTaglie', nome: '🔱 Forcone del Cacciatore di Taglie (esclusivo)', gettoni: 20, arma: 'forconeTaglie' },
  ],
  titolo: '📌 Bacheca delle taglie',
  vuota: 'Le taglie di questa settimana sono tutte riscosse. Le nuove arrivano lunedì. Cioè ogni sette giorni, il Comune non sa i giorni della settimana.',
  riscossa: '📌 Taglia riscossa: +{soldi}€ e +{gettoni} 🪙!',
};

// ---------- Marchi delle armi ----------
export const MARCHI = {
  nonna:    { nome: 'della Nonna', bonus: { atk: 2, def: 2 }, peso: 4 },
  ruggine:  { nome: 'di Ruggine', bonus: { atk: -2 }, peso: 3 },
  gigante:  { nome: 'del Gigante', bonus: { atk: 4, def: 2 }, peso: 3 },
  nebbia:   { nome: 'della Nebbia', bonus: { def: 4 }, peso: 3 },
  fortuna:  { nome: 'della Fortuna', bonus: { critico: 0.06 }, peso: 3 },
  diavolo:  { nome: 'del Diavolo', bonus: { atk: 6 }, peso: 2 },
  leggende: { nome: 'delle Leggende', bonus: { atk: 8, critico: 0.04 }, peso: 0 },   // solo dalla Notte delle Leggende
};
export const PROB_MARCHIO = 0.45;   // un'arma nuova arriva con un marchio

// ---------- Record ----------
export const RECORD = [
  ['nemici', '⚔️ Nemici sconfitti'],
  ['feroci', '😡 Bestie feroci abbattute'],
  ['notti', '🌕 Scontri vinti nelle Notti delle Leggende'],
  ['taglie', '📌 Taglie riscosse'],
  ['soldiMax', '💰 Soldi in tasca, il massimo'],
  ['incassoMax', '🏡 Incasso più alto in un giorno di cascina'],
  ['concili', '🏆 Concili del Gambalone vinti'],
  ['anni', '🥇 Agricoltore dell\'Anno'],
  ['raccolti', '🧺 Verdure raccolte nell\'orto'],
];
