// =====================================================================
//  ARMI, EQUIPAGGIAMENTO E OGGETTI (GDD capitolo 15)
//  Solo dati. Il codice li legge tramite game.prog (src/progressione.js).
//
//  Armi:    atk = attacco in più, liv = livello minimo, prezzo al Bubetto,
//           mossa = id della mossa propria (il menu del combattimento la mostrerà),
//           fuori = cosa fa come attrezzo fuori dal combattimento (testo, per ora)
//  Vestiti: slot testa | corpo | piedi | portafortuna, bonus letti da prog.bonus()
//  Oggetti: consumabili nello zaino (s.inv). "combattimento" = usabile negli scontri.
// =====================================================================

export const ARMI = {
  zappa:     { nome: 'Zappa vecchia', liv: 1,  atk: 0,  prezzo: 0,   mossa: 'zappata',   fuori: 'zappa le zolle' },
  rastrello: { nome: 'Rastrello',     liv: 3,  atk: 2,  prezzo: 50,  mossa: 'rastrellata', fuori: 'raccoglie 2 piante alla volta nell\'orto' },
  badile:    { nome: 'Badile',        liv: 5,  atk: 4,  prezzo: 90,  mossa: 'badilata',  fuori: 'scava le tane delle nutrie' },
  forcone:   { nome: 'Forcone',       liv: 7,  atk: 6,  prezzo: 140, mossa: 'spazzata',  fuori: 'pulisce i capannoni più in fretta' },
  falce:     { nome: 'Falce',         liv: 10, atk: 8,  prezzo: 220, mossa: 'falciata',  fuori: 'taglia l\'erba alta dei fossi' },
  roncola:   { nome: 'Roncola',       liv: 12, atk: 10, prezzo: 300, mossa: 'fendente',  fuori: 'taglia i rovi del bosco' },
  motosega:  { nome: 'Motosega',      liv: 16, atk: 15, prezzo: 600, mossa: 'motosegata', fuori: 'taglia alberi', benzina: true },
  // leggendaria: solo dalla cabina della corrente (GDD 20.5)
  zappaFolgorata: { nome: 'Zappa folgorata', liv: 1, atk: 12, mossa: 'scossa', fuori: 'zappa e illumina', leggendario: true },
};
export const AFFILATURA = { max: 3, atk: 2, prezzi: [30, 60, 120] };

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
  grappa:   { nome: 'Grappa',            icona: '🥃', effetto: { stress: -25 }, combattimento: 'self', prezzo: 4 },
  trappola: { nome: 'Trappola per ratti', icona: '🪤', effetto: { stordisce: 1 }, combattimento: 'one', prezzo: 8 },
  benzina:  { nome: 'Tanica di benzina', icona: '⛽', prezzo: 12 },
  pomata:   { nome: 'Pomata del veterinario', icona: '🧴', effetto: { guarisce: 1 }, combattimento: 'self', prezzo: 10 },
  pacco:    { nome: 'Pacco del Bubetto', icona: '📦', missione: true },
};
