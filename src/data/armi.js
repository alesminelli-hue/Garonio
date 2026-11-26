// =====================================================================
//  ARMI, EQUIPAGGIAMENTO E OGGETTI (GDD capitolo 15)
//  Solo dati. Il codice li legge tramite game.prog (src/progressione.js).
//
//  Armi:    atk = attacco in più, liv = livello minimo, prezzo al Bubetto,
//           mossa = id della mossa propria (il menu del combattimento la mostrerà),
//           mossa2 = seconda mossa (Lottatore grado 3),
//           fuori = cosa fa come attrezzo fuori dal combattimento
//  Vestiti: slot testa | corpo | piedi | portafortuna, bonus letti da prog.bonus()
//  Oggetti: consumabili nello zaino (s.inv). "combattimento" = usabile negli scontri.
// =====================================================================

export const ARMI = {
  zappa:     { nome: 'Zappa vecchia', liv: 1,  atk: 0,  prezzo: 0,   mossa: 'zappata', mossa2: 'zappataDoppia',   fuori: 'zappa le zolle' },
  rastrello: { nome: 'Rastrello',     liv: 3,  atk: 2,  prezzo: 50,  mossa: 'rastrellata', mossa2: 'pettinata', fuori: 'raccoglie 2 piante alla volta nell\'orto' },
  badile:    { nome: 'Badile',        liv: 5,  atk: 4,  prezzo: 90,  mossa: 'badilata', mossa2: 'palata',  fuori: 'scava le tane delle nutrie' },
  forcone:   { nome: 'Forcone',       liv: 7,  atk: 6,  prezzo: 140, mossa: 'spazzata', mossa2: 'infilzata',  fuori: 'pulisce i capannoni più in fretta' },
  falce:     { nome: 'Falce',         liv: 10, atk: 8,  prezzo: 220, mossa: 'falciata', mossa2: 'mezzaluna',  fuori: 'taglia l\'erba alta dei fossi' },
  roncola:   { nome: 'Roncola',       liv: 12, atk: 10, prezzo: 300, mossa: 'fendente', mossa2: 'sfoltita',  fuori: 'taglia i rovi del bosco' },
  motosega:  { nome: 'Motosega',      liv: 16, atk: 15, prezzo: 600, mossa: 'motosegata', mossa2: 'avviamento', fuori: 'taglia alberi', benzina: true },
  // leggendaria: solo dalla cabina della corrente (GDD 20.5)
  zappaFolgorata: { nome: 'Zappa folgorata', liv: 1, atk: 12, mossa: 'scossa', mossa2: 'cortocircuito', fuori: 'zappa e illumina', leggendario: true },
  // bottino dei boss delle missioni secondarie (src/data/boss.js): non si comprano e non si vendono
  piedeDiPorco:  { nome: 'Piede di porco del ladro', liv: 1, atk: 13, mossa: 'scasso', mossa2: 'leva', fuori: 'apre i lucchetti', leggendario: true, bottino: true },
  forchettone:   { nome: 'Forchettone d\'oro',       liv: 1, atk: 15, mossa: 'triplaForchettata', mossa2: 'assaggio', fuori: 'assaggia tutto', leggendario: true, bottino: true },
  chiaveInglese: { nome: 'Chiave inglese da 32',     liv: 1, atk: 18, mossa: 'sbullonata', mossa2: 'giroDiChiave', fuori: 'svita tutto', leggendario: true, bottino: true },
  arpione:       { nome: 'Arpione del laghetto',     liv: 1, atk: 21, mossa: 'arpionata', mossa2: 'tiraARiva', fuori: 'pesca i siluri', leggendario: true, bottino: true },
  spadone:       { nome: 'Spadone del Trisavolo',    liv: 1, atk: 24, mossa: 'fendenteNobile', mossa2: 'colpoDiGrazia', fuori: 'fa scena', leggendario: true, bottino: true },
  palaForno:     { nome: 'Pala del forno di Gennaro', liv: 1, atk: 27, mossa: 'infornata', mossa2: 'margheritaVolante', fuori: 'sforna pizze', leggendario: true, bottino: true },
  // attrezzi agricoli nascosti sugli alberi (src/alberi.js, src/data/alberi.js): si trovano scuotendo gli alberi giusti
  zappetta:   { nome: 'Zappetta Rompizolle di Nonna Adalgisa', liv: 2, atk: 4, mossa: 'zappata', mossa2: 'zappataDoppia', fuori: 'zappa e brontola', bottino: true, albero: true },
  vanga:      { nome: 'Vanga del Bisnonno Ercolino',   liv: 3,  atk: 5,  mossa: 'badilata', mossa2: 'palata',     fuori: 'scava dritto come nel 1931', bottino: true, albero: true },
  pettinanebbia: { nome: 'Rastrello Pettinanebbia',    liv: 5,  atk: 7,  mossa: 'rastrellata', mossa2: 'pettinata', fuori: 'pettina la nebbia di novembre', bottino: true, albero: true },
  falcetto:   { nome: 'Falcetto Lunadoro',             liv: 6,  atk: 8,  mossa: 'falciata', mossa2: 'mezzaluna',  fuori: 'taglia l\'erba al chiaro di luna', bottino: true, albero: true },
  palaPolenta:{ nome: 'Pala da Polenta della Sagra',   liv: 8,  atk: 10, mossa: 'badilata', mossa2: 'palata',     fuori: 'gira il paiolo da quaranta porzioni', bottino: true, albero: true },
  cesoie:     { nome: 'Le Forbici della Suocera',      liv: 9,  atk: 11, mossa: 'sfoltita', mossa2: 'fendente',   fuori: 'potano viti e conversazioni', bottino: true, albero: true },
  forcaVacche:{ nome: 'Forca Sbuffavacche',            liv: 11, atk: 13, mossa: 'spazzata', mossa2: 'infilzata',  fuori: 'sposta il fieno e le vacche testarde', bottino: true, albero: true },
  tridente:   { nome: 'Tridente del Re del Letame',    liv: 13, atk: 15, mossa: 'spazzata', mossa2: 'infilzata',  fuori: 'gira il letame con regalità', bottino: true, albero: true },
  roncolaRovi:{ nome: 'Roncola Sciabolarovi',          liv: 15, atk: 17, mossa: 'fendente', mossa2: 'sfoltita',   fuori: 'apre i sentieri del bosco', bottino: true, albero: true },
  scure:      { nome: 'Scure Spaccaquerce',            liv: 17, atk: 19, mossa: 'fendente', mossa2: 'colpoDiGrazia', fuori: 'spacca la legna per tre inverni', bottino: true, albero: true },
  correggiato:{ nome: 'Correggiato Battigrano del \'48', liv: 21, atk: 23, mossa: 'pettinata', mossa2: 'spazzata', fuori: 'batte il grano come ai tempi del nonno', bottino: true, albero: true },
  mietinebbia:{ nome: 'Falce Mietinebbia',             liv: 25, atk: 27, mossa: 'falciata', mossa2: 'mezzaluna',  fuori: 'falcia il grano e la malinconia', bottino: true, albero: true },
  // Babbo Natale smemorato (src/speciali.js): solo se gli paghi Madame Svetlana al Welcome
  bastoneZucchero: { nome: 'Bastone di Zucchero Polare', liv: 1, atk: 29, mossa: 'renneInCarica', mossa2: 'sacchettoCarbone', fuori: 'profuma di menta', leggendario: true, bottino: true },
  // Parco Oglio (src/parco.js): il Diavoletto del Forcone, raro. Banco del Gigante (src/banco.js): da costruire
  forconcinoInfernale: { nome: 'Forconcino Infernale del Diavoletto', liv: 1, atk: 28, mossa: 'spazzata', mossa2: 'infilzata', fuori: 'scalda le mani d\'inverno', leggendario: true, bottino: true },
  forconeTaglie: { nome: 'Forcone del Cacciatore di Taglie', liv: 1, atk: 30, mossa: 'spazzata', mossa2: 'infilzata', fuori: 'ha una tacca per ogni taglia riscossa', leggendario: true, bottino: true },
  falceLunare: { nome: 'Falce Lunare Spaccanebbia', liv: 1, atk: 26, mossa: 'falciata', mossa2: 'mezzaluna', fuori: 'taglia la nebbia a fette', leggendario: true, bottino: true, banco: true },
  // endgame: solo dalle sfide leggendarie (livello 30)
  zappaDoro:     { nome: 'Zappa d\'oro della Bassa', liv: 30, atk: 30, mossa: 'zappataDoro', mossa2: 'raccoltoFinale', fuori: 'zappa le zolle e luccica', leggendario: true, bottino: true },
};
export const AFFILATURA = { max: 3, atk: 2, prezzi: [30, 60, 120] };

// =====================================================================
//  MOSSE (GDD 15.2 e 15.3) — lette da src/combat.js
//  target: 'one' | 'two' | 'all' | 'self'    pow: forza del colpo (1 = attacco normale)
//  tired: stanchezza (negativa = recupera)     lvl: livello minimo
//  extra: stordisce (turni), critico (+probabilità), ignoraDif (0..1), benzina (consuma una tanica),
//         paura (turni di nemici spaventati), scaccia ('piccoli'), carica, secondoFiato, cane, letame
// =====================================================================

// La mossa propria di ogni arma (ARMI[x].mossa) e la seconda, sbloccata da Lottatore grado 3 (ARMI[x].mossa2)
export const MOSSE_ARMI = {
  zappata:     { nome: 'Zappata',               target: 'one', pow: 1.7, tired: 6,  desc: 'Colpo forte su un nemico.' },
  zappataDoppia: { nome: 'Zappata doppia',      target: 'one', pow: 1.1, tired: 8,  colpi: 2, desc: 'Due colpi di fila sullo stesso nemico.' },
  rastrellata: { nome: 'Rastrellata',           target: 'two', pow: 1.3, tired: 7,  desc: 'Colpisce due nemici vicini.' },
  pettinata:   { nome: 'Pettinata',             target: 'all', pow: 0.7, tired: 6, letame: 2, desc: 'Graffia tutti: sbagliano più spesso per 2 turni.' },
  badilata:    { nome: 'Badilata',              target: 'one', pow: 1.4, tired: 8,  stordisce: 1, desc: 'Stordisce un nemico per un turno.' },
  palata:      { nome: 'Palata di terra',       target: 'all', pow: 0.6, tired: 8,  letame: 3, desc: 'Terra in faccia a tutti: sbagliano più spesso per 3 turni.' },
  spazzata:    { nome: 'Spazzata col forcone',  target: 'all', pow: 1.0, tired: 10, desc: 'Colpisce tutti i nemici.' },
  infilzata:   { nome: 'Infilzata',             target: 'one', pow: 2.1, tired: 10, desc: 'Un colpo secco e profondo su un nemico.' },
  falciata:    { nome: 'Falciata',              target: 'all', pow: 1.2, tired: 12, critico: 0.25, desc: 'Tutti, con il critico più facile.' },
  mezzaluna:   { nome: 'Mezzaluna',             target: 'one', pow: 2.2, tired: 10, critico: 0.4, desc: 'Un colpo solo, ma il critico arriva quasi sempre.' },
  fendente:    { nome: 'Fendente della Bassa',  target: 'one', pow: 2.0, tired: 11, ignoraDif: 0.5, desc: 'Un nemico, ignora metà della difesa.' },
  sfoltita:    { nome: 'Sfoltita',              target: 'two', pow: 1.6, tired: 12, ignoraDif: 0.5, desc: 'Due nemici, ignora metà della difesa.' },
  motosegata:  { nome: 'Motosegata',            target: 'all', pow: 2.4, tired: 14, benzina: true, paura: 3, desc: 'Enorme su tutti e li terrorizza. Consuma una tanica di benzina.' },
  avviamento:  { nome: 'Strappo d\'avviamento', target: 'self', tired: 0, paura: 2, desc: 'Vrooom! Nessun danno, ma i nemici attaccano più piano per 2 turni. Gratis.' },
  scossa:      { nome: 'Scossa',                target: 'all', pow: 1.6, tired: 8,  stordisce: 1, desc: 'La zappa folgorata dà la scossa a tutti e li stordisce.' },
  cortocircuito: { nome: 'Cortocircuito',       target: 'one', pow: 3.0, tired: 12, desc: 'Tutta la corrente su un nemico solo.' },
  // armi dei boss
  scasso:      { nome: 'Scasso',                target: 'one', pow: 1.7, tired: 8,  ignoraDif: 0.8, desc: 'Fa leva sulla corazza: ignora quasi tutta la difesa.' },
  leva:        { nome: 'Colpo di leva',         target: 'one', pow: 1.3, tired: 8,  stordisce: 1, desc: 'Stordisce un nemico per un turno.' },
  triplaForchettata: { nome: 'Tripla forchettata', target: 'one', pow: 0.85, tired: 10, colpi: 3, desc: 'Tre colpi di fila sullo stesso nemico.' },
  assaggio:    { nome: 'Assaggio',              target: 'one', pow: 1.8, tired: 9,  critico: 0.35, desc: 'Un colpo da intenditore: critico facile.' },
  sbullonata:  { nome: 'Sbullonata',            target: 'one', pow: 1.9, tired: 10, stordisce: 1, desc: 'Colpo forte che stordisce.' },
  giroDiChiave:{ nome: 'Giro di chiave',        target: 'all', pow: 1.3, tired: 12, desc: 'Gira come una trottola: colpisce tutti.' },
  arpionata:   { nome: 'Arpionata',             target: 'one', pow: 2.4, tired: 11, critico: 0.2, desc: 'Un colpo profondo, spesso critico.' },
  tiraARiva:   { nome: 'Tira a riva',           target: 'two', pow: 1.7, tired: 12, desc: 'Arpiona due nemici e li tira giù.' },
  fendenteNobile: { nome: 'Fendente nobile',    target: 'all', pow: 1.6, tired: 13, ignoraDif: 0.3, desc: 'Tutti i nemici, ignora un terzo della difesa.' },
  colpoDiGrazia:  { nome: 'Colpo di grazia',    target: 'one', pow: 3.1, tired: 14, desc: 'Il colpo più forte dello spadone.' },
  renneInCarica:    { nome: 'Renne in carica',       target: 'all', pow: 1.8, tired: 12, stordisce: 1, desc: 'Nove renne travolgono tutti: stordisce per un turno.' },
  sacchettoCarbone: { nome: 'Sacchetto di carbone',  target: 'one', pow: 3.0, tired: 13, ignoraDif: 0.5, desc: 'Per chi è stato cattivo: un nemico, ignora metà della difesa.' },
  infornata:   { nome: 'Infornata',             target: 'all', pow: 1.7, tired: 12, letame: 2, desc: 'Una palata di brace: tutti, e sbagliano più spesso per 2 turni.' },
  margheritaVolante: { nome: 'Margherita volante', target: 'one', pow: 3.2, tired: 13, stordisce: 1, desc: 'Una pizza bollente in faccia: enorme e stordisce.' },
  zappataDoro: { nome: 'Zappata d\'oro',        target: 'all', pow: 2.1, tired: 12, critico: 0.2, desc: 'Tutti i nemici, critico facile. Luccica.' },
  raccoltoFinale: { nome: 'Raccolto finale',    target: 'one', pow: 3.6, tired: 14, ignoraDif: 0.5, desc: 'Un colpo enorme che ignora metà difesa.' },
};

// Mosse che Garonio impara salendo di livello (GDD 15.3). Le prime tre c'erano già.
export const MOSSE_GARONIO = [
  { id: 'pisolino',  nome: 'Pisolino tattico',     lvl: 1,  tired: -15, target: 'self', desc: 'Stanchezza −15, ma il prossimo colpo fa più male.' },
  { id: 'rabbia',    nome: 'Rabbia Incontrollata', lvl: 1,  tired: 8,  target: 'all', pow: 2.4, rage: true, desc: 'Sfoga lo stress: colpo enorme a tutti, stress −35. Serve stress 60+.' },
  { id: 'urlo',      nome: 'Urlo da campagna',     lvl: 2,  tired: 5,  target: 'all', paura: 3, desc: 'Spaventa i nemici: attaccano più piano per 3 turni.' },
  { id: 'letame',    nome: 'Lancio di letame',     lvl: 4,  tired: 6,  target: 'one', letame: 3, desc: 'Un nemico sbaglia più spesso per 3 turni.' },
  { id: 'clacson',   nome: 'Colpo di clacson',     lvl: 6,  tired: 2,  target: 'all', scaccia: 'piccoli', soloMezzo: true, desc: 'Solo se sei arrivato col mezzo: ratti, nutrie e piccioni scappano.' },
  { id: 'bestemmia', nome: 'Bestemmia trattenuta', lvl: 8,  tired: 0,  target: 'self', stress: 10, carica: 0.5, desc: 'Stress +10, ma il prossimo colpo fa +50% di danno.' },
  { id: 'cane',      nome: 'Fischio al cane',      lvl: 11, tired: 8,  target: 'one', pow: 1.5, cane: true, desc: 'Arriva il cane di casa e morde un nemico. Serve il cane.' },
  { id: 'fiato',     nome: 'Secondo fiato',        lvl: 14, tired: -40, target: 'self', vita: 20, unaVolta: true, desc: 'Una volta per scontro: stanchezza −40, Vita +20.' },
];
// nemici "piccoli" che il clacson fa scappare
export const NEMICI_PICCOLI = ['nutria', 'ratto', 'piccione', 'gazza'];

// Al bar le armi restano fuori dalla porta
export const ARMI_BAR = {
  mani:     { nome: 'A mani nude',      atk: 0 },
  sgabello: { nome: 'Sgabello',         atk: 6, siRompe: 10 },
  bottiglia:{ nome: 'Bottiglia vuota',  atk: 3, stordisce: true, rispetto: 0.5 },
  stecca:   { nome: 'Stecca da biliardo', atk: 4, colpisce: 2 },
};

export const SLOT = ['testa', 'corpo', 'piedi', 'portafortuna'];
export const NOMI_SLOT = { testa: 'Testa', corpo: 'Corpo', piedi: 'Piedi', portafortuna: 'Portafortuna' };

export const VESTITI = {
  stivali:         { nome: 'Stivali nuovi',            slot: 'piedi', bonus: { velocita: 0.2 }, prezzo: 30, desc: 'cammini +20%' },
  stivaliAlti:     { nome: 'Stivali alti da canale',   slot: 'piedi', bonus: { acquaBassa: 1 }, prezzo: 90, liv: 9, desc: 'si entra nell\'acqua bassa' },
  cappellino:      { nome: 'Cappellino del consorzio', slot: 'testa', bonus: { stress: 0.10 }, prezzo: 25, desc: 'stress −10%' },
  casco:           { nome: 'Casco da Vespa',           slot: 'testa', bonus: { def: 2, casco: 1 }, prezzo: 45, desc: 'difesa +2, niente multa senza casco' },
  tuta:            { nome: 'Tuta da lavoro',           slot: 'corpo', bonus: { def: 2, fatica: 0.05 }, prezzo: 40, desc: 'difesa +2, lavori −5% fatica' },
  giacca:          { nome: 'Giacca imbottita',         slot: 'corpo', bonus: { def: 4, freddo: 1 }, prezzo: 110, liv: 10, desc: 'difesa +4, niente fatica extra col freddo' },
  grembiule:       { nome: 'Grembiule di cuoio',       slot: 'corpo', bonus: { def: 6 }, prezzo: 180, liv: 14, desc: 'difesa +6' },
  santino:         { nome: 'Santino della nonna',      slot: 'portafortuna', bonus: { santino: 1 }, desc: 'una volta al giorno, a Vita 0 si rialza' },
  thermos:         { nome: 'Thermos di caffè',         slot: 'portafortuna', bonus: { faticaInizioScontro: 10 }, desc: 'fatica −10 a inizio scontro' },
  telefonoConsulente: { nome: 'Numero del Consulente', slot: 'portafortuna', bonus: { consigliAlTelefono: 1 }, desc: 'le dritte arrivano per SMS sul telefonino' },
  // angolo dell'usato del Bubetto: roba che "arriva" dalle cascine vicine (GDD 19.3)
  cappelloPaglia:  { nome: 'Cappello di paglia del Potato', slot: 'testa', bonus: { def: 1, stress: 0.05 }, desc: 'difesa +1, stress −5%. Profuma di patata' },
  stivaliPostino:  { nome: 'Stivali del Postman',      slot: 'piedi', bonus: { velocita: 0.15, def: 1 }, desc: 'cammini +15%, difesa +1. Il Postman li cerca ancora' },
  giubbottoFrank:  { nome: 'Giubbotto texano di Frank', slot: 'corpo', bonus: { def: 3, vendite: 0.05 }, desc: 'difesa +3, vendite +5%. Yee-haw' },
  cornetto:        { nome: 'Cornetto rosso',           slot: 'portafortuna', bonus: { critico: 0.05 }, desc: 'critico +5%. Toccare ferro non basta' },
  // leggendari: solo dalla cabina della corrente (GDD 20.5)
  cascoFulmine:    { nome: 'Casco di Nonno Fulmine',   slot: 'testa', bonus: { def: 5, casco: 1, invisibileVigilessa: 1 }, leggendario: true, desc: 'difesa +5, la Vigilessa non ti vede' },
  tutaIsolante:    { nome: 'Tuta isolante del tecnico', slot: 'corpo', bonus: { def: 7, scosse: 1 }, leggendario: true, desc: 'difesa +7, immune alle scosse' },
  stivali380:      { nome: 'Stivali a 380 volt',       slot: 'piedi', bonus: { velocita: 0.35 }, leggendario: true, desc: 'velocità +35%' },
  fusibile:        { nome: 'Fusibile fortunato',       slot: 'portafortuna', bonus: { santino: 1, rialzaMeta: 1 }, leggendario: true, desc: 'una volta al giorno, a Vita 0 si rialza col 50%' },
  coronaRatti:     { nome: 'Corona del Re dei Ratti',  slot: 'testa', bonus: { atk: 3, ratti: 1 }, trofeo: true, desc: 'attacco +3, i ratti non rosicchiano il mangime' },
  pellicciaNutrie: { nome: 'Pelliccia del Re delle Nutrie', slot: 'corpo', bonus: { def: 8, nutrie: 0.5 }, trofeo: true, desc: 'difesa +8, nutrie −50%' },
  mantelloLupi:    { nome: 'Mantello del Re dei Lupi', slot: 'corpo', bonus: { def: 10, stress: 0.2 }, trofeo: true, desc: 'difesa +10, stress −20% in combattimento' },
  // bottino dei boss delle missioni secondarie (src/data/boss.js)
  berrettoTasso:   { nome: 'Berretto di pelo di tasso', slot: 'testa', bonus: { def: 2, stress: 0.05 }, trofeo: true, desc: 'difesa +2, stress −5%' },
  medagliaPiccione:{ nome: 'Medaglia del Generale Piccione', slot: 'portafortuna', bonus: { stressPreseInGiro: 0.2, critico: 0.03 }, trofeo: true, desc: 'prese in giro −20% stress, critico +3%' },
  ricettario:      { nome: 'Ricettario di Sor Ugo',    slot: 'portafortuna', bonus: { cure: 0.3 }, trofeo: true, desc: 'gli oggetti curano +30%' },
  collareBrutus:   { nome: 'Collare di Brutus',        slot: 'portafortuna', bonus: { cane: 1, def: 2 }, trofeo: true, desc: 'difesa +2, sblocca «Fischio al cane»: Brutus ti segue' },
  stolaFaina:      { nome: 'Stola della Faina argentata', slot: 'corpo', bonus: { def: 5, velocita: 0.05 }, trofeo: true, desc: 'difesa +5, cammini +5%' },
  corazzaDorifora: { nome: 'Corazza di Dorifora',      slot: 'corpo', bonus: { def: 7 }, trofeo: true, desc: 'difesa +7. A strisce gialle e nere' },
  valigetta:       { nome: 'Valigetta dei campioni omaggio', slot: 'portafortuna', bonus: { cure: 0.2, faticaInizioScontro: 8 }, trofeo: true, desc: 'cure +20%, fatica −8 a inizio scontro' },
  cappelloSpaventapasseri: { nome: 'Cappello dello Spaventapasseri', slot: 'testa', bonus: { def: 4, stress: 0.1 }, trofeo: true, desc: 'difesa +4, stress −10%' },
  mantelloPipistrello: { nome: 'Mantello del Pipistrellone', slot: 'corpo', bonus: { def: 9, critico: 0.04 }, trofeo: true, desc: 'difesa +9, critico +4%' },
  giubbottoBorchie:{ nome: 'Giubbotto con le borchie',  slot: 'corpo', bonus: { def: 10, atk: 2 }, trofeo: true, desc: 'difesa +10, attacco +2' },
  cornaToro:       { nome: 'Elmo con le corna di Dollaro', slot: 'testa', bonus: { atk: 4, def: 5 }, trofeo: true, desc: 'attacco +4, difesa +5' },
  pungiglione:     { nome: 'Pungiglione della Regina', slot: 'portafortuna', bonus: { critico: 0.08 }, trofeo: true, desc: 'critico +8%' },
  cinturaPesi:     { nome: 'Cintura da sollevamento',  slot: 'portafortuna', bonus: { vitaMax: 30, def: 2 }, trofeo: true, desc: 'Vita massima +30, difesa +2' },
  elmoTrisavolo:   { nome: 'Elmo del Trisavolo',       slot: 'testa', bonus: { def: 9 }, trofeo: true, desc: 'difesa +9. Odora di naftalina' },
  occhialiScuri:   { nome: 'Occhiali scuri da buttafuori', slot: 'testa', bonus: { def: 6, stress: 0.15 }, trofeo: true, desc: 'difesa +6, stress −15%' },
  scarpeButtafuori:{ nome: 'Anfibi da buttafuori',     slot: 'piedi', bonus: { def: 5, velocita: 0.2 }, trofeo: true, desc: 'difesa +5, cammini +20%' },
  grembiulePizzaiolo: { nome: 'Grembiule di Gennaro', slot: 'corpo', bonus: { def: 13, cure: 0.15 }, trofeo: true, desc: 'difesa +13, gli oggetti curano +15%. Sa di basilico' },
  sigaroMountain:  { nome: 'Il sigaro di Mister Mountain', slot: 'portafortuna', bonus: { atk: 6, critico: 0.1, stress: 0.1 }, trofeo: true, desc: 'attacco +6, critico +10%, stress −10%. Spento, per fortuna' },
  // vestiti agricoli nascosti sugli alberi (src/alberi.js)
  cappellone:      { nome: 'Cappellone Parasole del Mondino', slot: 'testa', bonus: { def: 3, stress: 0.08 }, albero: true, desc: 'difesa +3, stress −8%. Fa ombra anche al trattore' },
  berrettoCorvi:   { nome: 'Berretto Spaventacorvi',   slot: 'testa', bonus: { def: 4, stressPreseInGiro: 0.1 }, albero: true, desc: 'difesa +4, prese in giro −10% stress. I corvi ti rispettano' },
  elmoPentola:     { nome: 'Elmo di Pentola a Pressione', slot: 'testa', bonus: { def: 7 }, albero: true, desc: 'difesa +7. Fischia quando ti arrabbi' },
  fazzolettoRosso: { nome: 'Bandana Rossofuoco del Trebbiatore', slot: 'portafortuna', bonus: { critico: 0.04, stress: 0.03 }, albero: true, desc: 'critico +4%, stress −3%' },
  ferroCavallo:    { nome: 'Ferro di Cavallo Fortunello', slot: 'portafortuna', bonus: { critico: 0.06 }, albero: true, desc: 'critico +6%. Era di un cavallo molto fortunato' },
  cinturaSpago:    { nome: 'Cintura di Spago Rinforzato', slot: 'portafortuna', bonus: { vitaMax: 18, def: 1 }, albero: true, desc: 'Vita massima +18, difesa +1. Tiene su tutto' },
  guantiLavoro:    { nome: 'Guantoni Spaccacalli',     slot: 'portafortuna', bonus: { atk: 3, fatica: 0.04 }, albero: true, desc: 'attacco +3, lavori −4% fatica' },
  salopette:       { nome: 'Salopette Indistruttibile del \'79', slot: 'corpo', bonus: { def: 5, fatica: 0.06 }, albero: true, desc: 'difesa +5, lavori −6% fatica' },
  grembiuleMungitura: { nome: 'Grembiule della Mungitura', slot: 'corpo', bonus: { def: 4, cure: 0.12 }, albero: true, desc: 'difesa +4, cure +12%. Profuma di latte e coraggio' },
  gileFustagno:    { nome: 'Gilè di Fustagno del Nonno', slot: 'corpo', bonus: { def: 7, stress: 0.05 }, albero: true, desc: 'difesa +7, stress −5%. Nel taschino, una caramella del 1983' },
  giaccaVento:     { nome: 'Giaccone Antinebbia del Consorzio', slot: 'corpo', bonus: { def: 9, freddo: 1 }, albero: true, desc: 'difesa +9, niente fatica extra col freddo' },
  stivaliGomma:    { nome: 'Stivaloni Squish-Squash',  slot: 'piedi', bonus: { def: 3, velocita: 0.12 }, albero: true, desc: 'difesa +3, cammini +12%' },
  ciabatteStalla:  { nome: 'Ciabatte da Stalla Supersoniche', slot: 'piedi', bonus: { velocita: 0.2, def: 1 }, albero: true, desc: 'cammini +20%, difesa +1. Nessuno sa come' },
  zoccoli:         { nome: 'Zoccoli Ciocca-Ciocca',    slot: 'piedi', bonus: { velocita: 0.28 }, albero: true, desc: 'cammini +28%. Si sentono arrivare da Littlesound' },
  // Babbo Natale smemorato e Mostro della Palude (src/speciali.js)
  cappelloNatale:  { nome: 'Berretto Tintinnante di Babbo Natale', slot: 'testa', bonus: { def: 5, stress: 0.15 }, trofeo: true, desc: 'difesa +5, stress −15%. Il pon pon fa «din»' },
  maglioneRenne:   { nome: 'Maglione Rudolph Edizione Limitata',    slot: 'corpo', bonus: { def: 12, stress: 0.1 }, trofeo: true, desc: 'difesa +12, stress −10%. Fatto a mano dalla signora Claus' },
  mantelloAlghe:   { nome: 'Mantello Melmoso della Palude', slot: 'corpo', bonus: { def: 16, cure: 0.1 }, trofeo: true, desc: 'difesa +16, cure +10%. Gocciola sempre' },
  // Parco Oglio (src/parco.js): mostri, Vecchio Camper e Boss MM
  mantelloVampiro: { nome: 'Mantello del Conte di Saint James Borough', slot: 'corpo', bonus: { def: 14, critico: 0.05 }, trofeo: true, desc: 'difesa +14, critico +5%. Fodera rosso sangue (di pomodoro)' },
  cappelloBossMM:  { nome: 'Il Cappello di Boss MM', slot: 'testa', bonus: { def: 9, stress: 0.12, guardie: 1 }, trofeo: true, desc: 'difesa +9, stress −12%. Le guardie del parco ti vedono la metà' },
  // Banco del Gigante (src/banco.js): roba costruita in officina
  distintivo:      { nome: 'Distintivo dello Sceriffo della Bassa', slot: 'portafortuna', bonus: { atk: 4, critico: 0.05 }, desc: 'attacco +4, critico +5%. Di latta, ma luccica' },
  gambaloneOro:    { nome: 'Gambalone d\'Oro dell\'Agricoltore dell\'Anno', slot: 'portafortuna', bonus: { def: 8, atk: 5, vendite: 0.1 }, trofeo: true, desc: 'attacco +5, difesa +8, vendite +10%. Il trofeo del Concilio' },
  elmoCavaliere:   { nome: 'Elmo del Cavaliere Contadino', slot: 'testa', bonus: { def: 11, atk: 2 }, banco: true, desc: 'difesa +11, attacco +2. Era un secchio del latte' },
  calzettoni:      { nome: 'Calzettoni di Lana di Dolly', slot: 'piedi', bonus: { def: 4, velocita: 0.15, freddo: 1 }, banco: true, desc: 'difesa +4, cammini +15%, niente freddo. Pizzicano' },
  stivaliReazione: { nome: 'Stivali a Reazione del Gigante', slot: 'piedi', bonus: { def: 5, velocita: 0.42 }, banco: true, desc: 'difesa +5, cammini +42%. Puzzano di miscela' },
  // endgame: sfide leggendarie
  tutaLeggenda:    { nome: 'Tuta della Leggenda',      slot: 'corpo', bonus: { def: 15, fatica: 0.1 }, leggendario: true, desc: 'difesa +15, lavori −10% fatica' },
  stivaliSette:    { nome: 'Stivali delle sette cascine', slot: 'piedi', bonus: { def: 7, velocita: 0.35 }, leggendario: true, desc: 'difesa +7, cammini +35%' },
  coronaBassa:     { nome: 'Corona della Bassa',       slot: 'testa', bonus: { def: 10, atk: 4, stress: 0.1 }, leggendario: true, desc: 'difesa +10, attacco +4, stress −10%' },
};

// Consumabili. I primi tre ci sono già nel gioco (si raccolgono). "effetto" è letto da prog.usa().
export const OGGETTI = {
  uova:     { nome: 'Uovo',              icona: '🥚', effetto: { danno: 12 }, combattimento: 'one', vendita: 3 },
  pomodoro: { nome: 'Pomodoro',          icona: '🍅', effetto: { health: 18 }, combattimento: 'self', vendita: 6 },
  mais:     { nome: 'Pannocchia',        icona: '🌽', effetto: { tired: -15 }, combattimento: 'self', vendita: 10 },
  patata:   { nome: 'Patata del Potato', icona: '🥔', effetto: { tired: -10, health: 5 }, combattimento: 'self' },
  caffe:    { nome: 'Caffè',             icona: '☕', effetto: { tired: -20 }, combattimento: 'self', prezzo: 2 },
  panino:   { nome: 'Panino col salame', icona: '🥪', effetto: { health: 35 }, combattimento: 'self', prezzo: 5 },
  grappa:   { nome: 'Grappa',            icona: '🥃', effetto: { stress: -25, ubriaco: 3 }, combattimento: 'self', prezzo: 4 },
  trappola: { nome: 'Trappola per ratti', icona: '🪤', effetto: { stordisce: 1 }, combattimento: 'one', prezzo: 8 },
  benzina:  { nome: 'Tanica di benzina', icona: '⛽', effetto: { benzina: 50 }, prezzo: 12 },   // motosega, o +50% nella Punto
  // si compra da Fuel l'Havana (src/benzinaio.js): si versa nel trattore guidato o lì vicino
  tanica:   { nome: 'Tanica di gasolio', icona: '🛢️', effetto: { gasolio: 50 }, prezzo: 15 },
  pomata:   { nome: 'Pomata del veterinario', icona: '🧴', effetto: { guarisce: 1, health: 5 }, combattimento: 'self', prezzo: 10 },
  pacco:    { nome: 'Pacco del Bubetto', icona: '📦', missione: true },
  paccoSegreto: { nome: 'Pacco «riservato»', icona: '🎁', missione: true },
  codaRatto: { nome: 'Coda di ratto',    icona: '🐀', vendita: 2 },
  ferro:    { nome: 'Ferro vecchio',     icona: '🔩', vendita: 3 },
  // farmacia, pizzeria e kebab del paese (src/edifici.js)
  aspirina: { nome: 'Aspirina',          icona: '💊', effetto: { stress: -12, health: 5 }, combattimento: 'self', prezzo: 4 },
  sciroppo: { nome: 'Sciroppo ricostituente', icona: '🧪', effetto: { health: 45 }, combattimento: 'self', prezzo: 9 },
  integratore: { nome: 'Integratore «Forza Bassa»', icona: '🥤', effetto: { tired: -25 }, combattimento: 'self', prezzo: 6 },
  pizza:    { nome: 'Pizza da asporto',  icona: '🍕', effetto: { health: 40, stress: -5 }, combattimento: 'self', prezzo: 8 },
  kebab:    { nome: 'Kebab da asporto',  icona: '🥙', effetto: { health: 30, tired: -5 }, combattimento: 'self', prezzo: 6 },
  // bottino dei nemici e dei boss (src/data/boss.js): si vende al Bubetto
  miele:    { nome: 'Miele dei calabroni', icona: '🍯', effetto: { health: 70, stress: -10 }, combattimento: 'self', vendita: 15 },
  salame:   { nome: 'Salame recuperato', icona: '🥓', effetto: { health: 55 }, combattimento: 'self', vendita: 12 },
  pelleNutria: { nome: 'Pelle di nutria', icona: '🟫', vendita: 4 },
  piuma:    { nome: 'Piuma di gazza',    icona: '🪶', vendita: 3 },
  gingillo: { nome: 'Gingillo luccicante', icona: '💍', vendita: 25 },
  zanna:    { nome: 'Zanna di cinghiale', icona: '🦷', vendita: 12 },
  pelleLupo:{ nome: 'Pelliccia di lupo', icona: '🐺', vendita: 20 },
  pennaVolpe: { nome: 'Coda di volpe',   icona: '🦊', vendita: 9 },
  rottame:  { nome: 'Pezzo di ricambio', icona: '⚙️', vendita: 15 },
  trofeoBoss: { nome: 'Trofeo di un boss', icona: '🏆', vendita: 60 },
  pepita:   { nome: 'Pepita della Bassa', icona: '🪙', vendita: 150 },
  elisir:   { nome: 'Elisir del Dottor Pastiglia', icona: '⚗️', effetto: { health: 120, tired: -30, stress: -20 }, combattimento: 'self', vendita: 40 },
  // cose che cadono dagli alberi (src/alberi.js) e regali di Babbo Natale
  mela:     { nome: 'Mela Rugginella',   icona: '🍎', effetto: { health: 15, tired: -5 }, combattimento: 'self', vendita: 2 },
  noci:     { nome: 'Noci del Nonno Brontolo', icona: '🌰', effetto: { health: 10, stress: -4 }, combattimento: 'self', vendita: 3 },
  fico:     { nome: 'Fico Fiorone Mieloso', icona: '🟣', effetto: { health: 22, stress: -6 }, combattimento: 'self', vendita: 4 },
  castagna: { nome: 'Castagna Matta Riccioluta', icona: '🌰', effetto: { danno: 14 }, combattimento: 'one', vendita: 2 },
  pigna:    { nome: 'Pigna Contundente', icona: '🌲', effetto: { danno: 10 }, combattimento: 'one', vendita: 1 },
  nido:     { nome: 'Nido di Gazza (vuoto e offeso)', icona: '🪺', vendita: 6 },
  uovoGazza:{ nome: 'Uovo Luccicone di Gazza', icona: '🥚', vendita: 35 },
  cartolina:{ nome: 'Cartolina da Rimini 1987', icona: '💌', effetto: { stress: -15 }, combattimento: 'self', vendita: 8 },
  biscotti: { nome: 'Biscotti della Signora Claus', icona: '🍪', effetto: { health: 30, stress: -12 }, combattimento: 'self', vendita: 5 },
  carbone:  { nome: 'Carbone di Prima Scelta', icona: '🪨', effetto: { danno: 20 }, combattimento: 'one', vendita: 1 },
  // alberi di stagione (src/alberi.js)
  sambuco:  { nome: 'Fiori di Sambuco Profumatissimi', icona: '🌼', effetto: { stress: -12 }, combattimento: 'self', vendita: 3 },
  ciliegie: { nome: 'Ciliegie Duroni del Prete', icona: '🍒', effetto: { health: 20, tired: -6 }, combattimento: 'self', vendita: 4 },
  ghiacciolo: { nome: 'Ghiacciolo di Ramo Appuntito', icona: '🧊', effetto: { danno: 18 }, combattimento: 'one', vendita: 1 },
  // Parco Oglio (src/parco.js): bottino dei mostri, «lavoretti» del Vecchio Camper, coppiette
  lenzuolo: { nome: 'Lenzuolo Infestato del Mugnaio', icona: '👻', vendita: 12 },
  ossoFortunato: { nome: 'Osso Fortunato del Bracconiere', icona: '🦴', vendita: 16 },
  cristalloAlieno: { nome: 'Cristallo Verdognolo Extraterrestre', icona: '💎', vendita: 60 },
  nasoRosso: { nome: 'Naso Rosso Strombazzante', icona: '🔴', effetto: { stress: -18 }, combattimento: 'self', vendita: 8 },
  bende:    { nome: 'Bende Millenarie del Conte', icona: '🩹', effetto: { health: 45, guarisce: 1 }, combattimento: 'self', vendita: 9 },
  pozione:  { nome: 'Pozione Fumante della Strega', icona: '🧪', effetto: { health: 65, stress: -10 }, combattimento: 'self', vendita: 25 },
  legna:    { nome: 'Legna di Pioppo del Parco', icona: '🪵', vendita: 6 },
  cartello: { nome: 'Cartello «VIETATO» Svitato', icona: '🪧', vendita: 5 },
  uovaAnatra: { nome: 'Uova d\'Anatra Protetta', icona: '🥚', effetto: { health: 22 }, combattimento: 'self', vendita: 7 },
  pesceOglio: { nome: 'Luccio dell\'Oglio di Frodo', icona: '🐟', effetto: { health: 38 }, combattimento: 'self', vendita: 14 },
  fotoSfocata: { nome: 'Foto Sfocata della Coppietta', icona: '📷', vendita: 30 },
  // stalla (src/stalla.js)
  latte:    { nome: 'Latte Appena Munto della Carolina', icona: '🥛', effetto: { health: 22, tired: -8 }, combattimento: 'self', vendita: 4 },
  lana:     { nome: 'Lana Arruffata di Dolly', icona: '🧶', vendita: 14 },
  uovoOca:  { nome: 'Uovo d\'Oca Gigantesco', icona: '🥚', effetto: { health: 32 }, combattimento: 'self', vendita: 8 },
  // Banco del Gigante (src/banco.js)
  tortaMele: { nome: 'Torta di Mele della Nonna Adalgisa', icona: '🥧', effetto: { health: 85, stress: -15 }, combattimento: 'self', vendita: 20 },
  croccante: { nome: 'Croccante Spaccadenti alle Noci', icona: '🍬', effetto: { tired: -35, health: 15 }, combattimento: 'self', vendita: 12 },
  zabaione: { nome: 'Zabaione Corroborante del Nonno', icona: '🍮', effetto: { health: 55, tired: -25, stress: -12 }, combattimento: 'self', vendita: 18 },
  fritturaOglio: { nome: 'Frittura Mista dell\'Oglio', icona: '🍤', effetto: { health: 110, stress: -8 }, combattimento: 'self', vendita: 30 },
  bombaPigne: { nome: 'Bomba di Pigne del Gigante', icona: '💣', effetto: { danno: 45 }, combattimento: 'one', vendita: 10 },
  // l'orto con i semi di Mister Rodella (src/consorzio.js): si seminano nell'orto, si raccolgono, si vendono alla cassa
  zucchina: { nome: 'Zucchina', icona: '🥒', effetto: { health: 14 }, combattimento: 'self', vendita: 7 },
  insalata: { nome: 'Cespo d\'Insalata', icona: '🥬', effetto: { health: 10, stress: -4 }, combattimento: 'self', vendita: 5 },
  zucca:    { nome: 'Zucca Mantovana', icona: '🎃', effetto: { health: 30 }, combattimento: 'self', vendita: 16 },
  peperone: { nome: 'Peperone', icona: '🫑', effetto: { health: 16, tired: -5 }, combattimento: 'self', vendita: 9 },
  fragola:  { nome: 'Cestino di Fragole', icona: '🍓', effetto: { health: 12, stress: -8 }, combattimento: 'self', vendita: 12 },
  semiZucchina: { nome: 'Semi di Zucchina (bustina Rodella)', icona: '🌱', seme: 'zucchina' },
  semiInsalata: { nome: 'Semi d\'Insalata (bustina Rodella)', icona: '🌱', seme: 'insalata' },
  semiZucca:    { nome: 'Semi di Zucca (bustina Rodella)', icona: '🌱', seme: 'zucca' },
  semiPeperone: { nome: 'Semi di Peperone (bustina Rodella)', icona: '🌱', seme: 'peperone' },
  semiFragola:  { nome: 'Piantine di Fragola (bustina Rodella)', icona: '🌱', seme: 'fragola' },
  mangimeGold:  { nome: 'Mangime Rodella Gold', icona: '🌾', vendita: 6 },
};
