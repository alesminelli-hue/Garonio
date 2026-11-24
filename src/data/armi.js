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
  cappelloPaglia:  { nome: 'Cappello di paglia del Patata', slot: 'testa', bonus: { def: 1, stress: 0.05 }, desc: 'difesa +1, stress −5%. Profuma di patata' },
  stivaliPostino:  { nome: 'Stivali del Postino',      slot: 'piedi', bonus: { velocita: 0.15, def: 1 }, desc: 'cammini +15%, difesa +1. Il Postino li cerca ancora' },
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
};

// Consumabili. I primi tre ci sono già nel gioco (si raccolgono). "effetto" è letto da prog.usa().
export const OGGETTI = {
  uova:     { nome: 'Uovo',              icona: '🥚', effetto: { danno: 12 }, combattimento: 'one', vendita: 3 },
  pomodoro: { nome: 'Pomodoro',          icona: '🍅', effetto: { health: 18 }, combattimento: 'self', vendita: 6 },
  mais:     { nome: 'Pannocchia',        icona: '🌽', effetto: { tired: -15 }, combattimento: 'self', vendita: 10 },
  patata:   { nome: 'Patata del Patata', icona: '🥔', effetto: { tired: -10, health: 5 }, combattimento: 'self' },
  caffe:    { nome: 'Caffè',             icona: '☕', effetto: { tired: -20 }, combattimento: 'self', prezzo: 2 },
  panino:   { nome: 'Panino col salame', icona: '🥪', effetto: { health: 35 }, combattimento: 'self', prezzo: 5 },
  grappa:   { nome: 'Grappa',            icona: '🥃', effetto: { stress: -25, ubriaco: 3 }, combattimento: 'self', prezzo: 4 },
  trappola: { nome: 'Trappola per ratti', icona: '🪤', effetto: { stordisce: 1 }, combattimento: 'one', prezzo: 8 },
  benzina:  { nome: 'Tanica di benzina', icona: '⛽', prezzo: 12 },
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
};
