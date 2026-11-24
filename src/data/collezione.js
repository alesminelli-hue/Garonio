// =====================================================================
//  COMPLETI E ALBUM DEL BOTTINO (src/collezione.js, GDD capitolo 26.7)
//  COMPLETI: indossando più pezzi dello stesso completo arriva un bonus in più (2 pezzi: metà, tutti: pieno).
//            I pezzi sono quelli di src/data/armi.js (VESTITI). Chiavi dei bonus: come i vestiti.
//  ALBUM: ogni attrezzo, vestito e oggetto speciale trovato finisce nell'album (scheda 📒 del menu J).
//         Quelli che mancano si vedono come sagome nere. Ogni traguardo dà un premio.
// =====================================================================
export const COMPLETI = {
  mondino: {
    nome: 'Completo del Mondino', icona: '🌾', pezzi: ['cappellone', 'salopette', 'stivaliGomma', 'fazzolettoRosso'],
    bonus: { fatica: 0.12, stress: 0.1 }, desc: 'lavori −12% fatica, stress −10%. Sembri uscito da una foto del 1952',
  },
  trebbiatore: {
    nome: 'Completo del Trebbiatore', icona: '🚜', pezzi: ['berrettoCorvi', 'gileFustagno', 'zoccoli', 'guantiLavoro'],
    bonus: { atk: 5, critico: 0.06 }, desc: 'attacco +5, critico +6%. Profumi di gasolio e di paglia',
  },
  corazzato: {
    nome: 'Il Contadino Corazzato', icona: '🛡️', pezzi: ['elmoPentola', 'giaccaVento', 'ciabatteStalla', 'cinturaSpago'],
    bonus: { def: 10, vitaMax: 25 }, desc: 'difesa +10, Vita massima +25. Fai rumore di pentole quando corri',
  },
  cavaliere: {
    nome: 'Il Cavaliere del Banco', icona: '⚔️', pezzi: ['elmoCavaliere', 'grembiuleMungitura', 'calzettoni', 'ferroCavallo'],
    bonus: { def: 6, atk: 4, cure: 0.15 }, desc: 'difesa +6, attacco +4, cure +15%. Armatura fatta in casa, coraggio vero',
  },
  notte: {
    nome: 'Il Signore della Notte', icona: '🌙', pezzi: ['cappelloBossMM', 'mantelloVampiro', 'stivaliReazione', 'cornetto'],
    bonus: { velocita: 0.1, critico: 0.08, stress: 0.1 }, desc: 'cammini +10%, critico +8%, stress −10%. I mostri del parco ti salutano',
  },
};

export const ALBUM = {
  // traguardi: percentuale dell'album → premio
  premi: [
    { pct: 25, soldi: 200, oggetti: { elisir: 1 }, testo: "📒 Un quarto dell'album! La Mamma lo sfoglia commossa e ti allunga 200€." },
    { pct: 50, soldi: 400, oggetti: { elisir: 3 }, testo: "📒 Mezzo album! Il Consulente lo vuole comprare. Gli dici di no. Lui ti dà 400€ lo stesso, «per l'esclusiva»." },
    { pct: 75, soldi: 700, oggetti: { pepita: 3 }, testo: "📒 Tre quarti dell'album! In paese parlano di te. Il Bubetto ti regala tre pepite «da collezionista a collezionista»." },
    { pct: 100, soldi: 2000, oggetti: { trofeoBoss: 1 }, testo: "📒 ALBUM COMPLETO! Garonio è ufficialmente il più grande collezionista di cianfrusaglie della Bassa. Il Gigante dice: «Tutto questo per della roba?» Ma è fiero." },
  ],
};
