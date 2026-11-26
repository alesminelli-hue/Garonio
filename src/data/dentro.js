// =====================================================================
//  GLI ALTRI EDIFICI ESPLORABILI (src/dentro.js, GDD capitolo 29)
//  Solo dati. Ogni edificio della mappa che prima era «di facciata» ora ha il suo interno, nello stesso
//  formato di src/data/interni.js (id = id dell'edificio in src/map.js), uno o più personaggi dentro
//  (src/data/png.js, posto `interno`), una missione a testa (src/data/secondarie.js) e le azioni dei mobili.
//
//  AZIONI_DENTRO['edificio:zona'] = { nome, t: [frasi], effetto: { stress, tired, health, minuti }, costo,
//      oggetti: { id: n }, unaAlGiorno: true, giaFatto: 'frase' }
//  Le azioni speciali (sportelli del municipio, gratta e vinci, spesa, pisolino, registro...) sono in src/dentro.js.
//  COMPARSE[edificio] = [{ sprite, x, z, w, struttura?, lv? }]: animali che stanno dentro (struttura = si vedono solo
//      se quella struttura della Cascina dei Salici è almeno al livello lv).
//  CHIAVI[edificio] = 'salici': si entra solo se Garonio ha comprato la Cascina dei Salici.
// =====================================================================

const z = (x, d, colore) => ({ tipo: 'zerbino', pavimento: true, x: x - 0.7, z: d - 0.75, w: 1.4, d: 0.6, colore });
const porta = (x, d) => ({ entrata: { x, z: d - 1 }, uscita: { x, z: d - 0.3 } });

export const INTERNI_NUOVI = {
  municipio: {
    nome: 'Municipio', w: 26, d: 7, h: 3.4, pavimento: 'marmo', muro: 'carta2', musica: 'base', orari: [8, 19],
    ...porta(5, 7),
    stanze: [
      { id: 'atrio', nome: 'Municipio: gli sportelli', x0: 0, x1: 11 },
      { id: 'archivio', nome: 'Archivio comunale', x0: 11, x1: 15, muro: 'mattoni', pavimento: 'cemento', luce: 0.7 },
      { id: 'sindaco', nome: 'Ufficio del Sindaco', x0: 15, x1: 20, muro: 'legno', pavimento: 'parquet' },
      { id: 'biblioteca', nome: 'Biblioteca comunale', x0: 20, x1: 26, muro: 'carta', pavimento: 'parquet' },
    ],
    finestre: [{ x: 4.2, y: 1.4, w: 1.4, h: 1.0 }, { x: 17.2, y: 1.4, w: 1.2, h: 1.0 }],
    mobili: [
      { tipo: 'insegna', parete: true, x: 0.5, y: 2.3, w: 2.6, h: 0.42, testo: 'MULTE' },
      { tipo: 'bancone', x: 0.4, z: 1.5, w: 2.8, d: 0.6, h: 1.05, colore: '#d8d0b8', piano: '#8a6a42', zona: 'multe', etichetta: 'Sportello 1: multe' },
      { tipo: 'insegna', parete: true, x: 3.8, y: 2.3, w: 2.6, h: 0.42, testo: 'ANAGRAFE' },
      { tipo: 'bancone', x: 3.7, z: 1.5, w: 2.8, d: 0.6, h: 1.05, colore: '#d8d0b8', piano: '#3a5a8a', zona: 'anagrafe', etichetta: 'Sportello 2: anagrafe (matrimoni e divorzi)' },
      { tipo: 'insegna', parete: true, x: 7.2, y: 2.3, w: 3.4, h: 0.42, testo: 'UFFICIO AGRICOLO' },
      { tipo: 'bancone', x: 7.3, z: 1.5, w: 3.2, d: 0.6, h: 1.05, colore: '#d8d0b8', piano: '#3a7a3a', zona: 'agricolo', etichetta: 'Sportello 3: Ufficio agricolo' },
      { tipo: 'sedia', x: 0.5, z: 4.2, w: 0.5, d: 0.5, h: 0.95 }, { tipo: 'sedia', x: 1.2, z: 4.2, w: 0.5, d: 0.5, h: 0.95 },
      { tipo: 'sedia', x: 1.9, z: 4.2, w: 0.5, d: 0.5, h: 0.95, zona: 'attesa', etichetta: 'Prendi il numero e aspetta' },
      { tipo: 'bacheca', parete: true, x: 2.5, y: 1.1, w: 1.0, h: 0.8, zona: 'albo', etichetta: 'Albo pretorio' },
      { tipo: 'pianta', x: 10.2, z: 5.6, w: 0.5, d: 0.5, h: 1.3 },
      // archivio
      { tipo: 'scaffale', x: 11.3, z: 0.2, w: 1.7, d: 0.5, h: 2.6, merce: 'manuali', zona: 'archivio', etichetta: 'Faldoni dell\'archivio' },
      { tipo: 'scaffale', x: 13.1, z: 0.2, w: 1.7, d: 0.5, h: 2.6, merce: 'manuali' },
      { tipo: 'cassa', x: 13.6, z: 3.6, w: 0.9, d: 0.8, h: 0.7, zona: 'scatoloni', etichetta: 'Scatoloni «DA BUTTARE (1998)»' },
      // sindaco
      { tipo: 'ritratto', parete: true, x: 16.6, y: 1.5, w: 0.8, h: 1.0, colore: '#2a3a5a', zona: 'ritratto', etichetta: 'Ritratto del Sindaco (da giovane)' },
      { tipo: 'scrivania', x: 16.4, z: 1.6, w: 2.4, d: 1.0, h: 0.8, colore: '#5a3a22', zona: 'scrivania', etichetta: 'Scrivania del Sindaco' },
      { tipo: 'sedia', x: 17.4, z: 1.0, w: 0.6, d: 0.5, h: 1.2, colore: '#7a1a1a' },
      { tipo: 'bandiera', x: 19.2, z: 0.3, w: 0.4, d: 0.4, h: 2.2, colore: '#3a8a3a' },
      { tipo: 'tappeto', pavimento: true, x: 16.0, z: 3.6, w: 3.2, d: 1.6, colore: '#7a1a1a' },
      // biblioteca comunale: guide del gioco, storia, personaggi, mestieri, edifici e qualche indizio
      { tipo: 'insegna', parete: true, x: 21.3, y: 2.6, w: 3.4, h: 0.5, testo: 'BIBLIOTECA' },
      { tipo: 'libreria', x: 20.3, z: 0.2, w: 1.8, d: 0.5, h: 2.4, zona: 'guide', etichetta: 'Biblioteca: le guide (come si gioca)' },
      { tipo: 'libreria', x: 22.2, z: 0.2, w: 1.8, d: 0.5, h: 2.4, zona: 'storia', etichetta: 'Biblioteca: storia e personaggi' },
      { tipo: 'libreria', x: 24.1, z: 0.2, w: 1.7, d: 0.5, h: 2.4, zona: 'mestieri', etichetta: 'Biblioteca: mestieri ed edifici' },
      { tipo: 'cassapanca', x: 24.6, z: 4.8, w: 1.2, d: 0.8, h: 0.7, colore: '#4a2a1a', zona: 'segreti', etichetta: 'Biblioteca: lo scaffale proibito («Leggende della Bassa»)' },
      { tipo: 'tavolo', x: 21.2, z: 3.4, w: 2.2, d: 1.1, h: 0.8, colore: '#7a5a3a', zona: 'tavolo', etichetta: 'Tavolo di lettura' },
      { tipo: 'sedia', x: 20.8, z: 3.7, w: 0.4, d: 0.5, h: 0.95 }, { tipo: 'sedia', x: 23.5, z: 3.7, w: 0.4, d: 0.5, h: 0.95 },
      z(5, 7, '#3a5a8a'),
    ],
  },

  tabacchi: {
    nome: 'Tabacchi', w: 9, d: 6, h: 3, pavimento: 'scacchi', muro: 'carta', musica: 'base', orari: [7, 20],
    ...porta(4.5, 6),
    stanze: [{ id: 'tabacchi', nome: 'Tabacchi «da Gino e Rosy»', x0: 0, x1: 9 }],
    finestre: [{ x: 7.0, y: 1.3, w: 1.2, h: 1.0 }],
    mobili: [
      { tipo: 'mensola', parete: true, x: 0.4, y: 1.3, w: 3.6, h: 1.2, merce: 'oggetti' },
      { tipo: 'bancone', x: 0.5, z: 1.5, w: 3.8, d: 0.6, h: 1.05, colore: '#7a4a26', piano: '#d8c8a0', cassa: true, zona: 'gratta', etichetta: 'Gratta e Vinci «Il Bassaiolo» (5€)' },
      { tipo: 'espositore', x: 5.0, z: 0.4, w: 1.0, d: 1.0, h: 1.4, zona: 'giornali', etichetta: 'I giornali di oggi' },
      { tipo: 'lavagna', x: 6.4, z: 0.3, w: 1.4, d: 0.5, h: 1.8, zona: 'lotto', etichetta: 'I numeri ritardatari del Lotto' },
      { tipo: 'macchinetta', x: 8.0, z: 0.3, w: 0.7, d: 0.6, h: 1.6, zona: 'macchinetta', etichetta: 'Distributore di caramelle (1€)' },
      z(4.5, 6, '#7a2a1a'),
    ],
  },

  alimentari: {
    nome: 'Alimentari', w: 12, d: 7, h: 3, pavimento: 'cotto', muro: 'piastrelle', musica: 'base', orari: [7, 20],
    ...porta(6, 7),
    stanze: [{ id: 'alimentari', nome: 'Alimentari della Rina', x0: 0, x1: 12 }],
    finestre: [{ x: 9.6, y: 1.3, w: 1.4, h: 1.0 }],
    mobili: [
      { tipo: 'scaffale', x: 0.3, z: 0.2, w: 2.4, d: 0.5, h: 2.3, merce: 'conserve', zona: 'scaffali', etichetta: 'Scaffale delle conserve' },
      { tipo: 'scaffale', x: 2.9, z: 0.2, w: 2.4, d: 0.5, h: 2.3, merce: 'bottiglie' },
      { tipo: 'salami', parete: true, x: 5.8, y: 1.9, w: 2.2, h: 0.6, zona: 'salami', etichetta: 'I salami appesi' },
      { tipo: 'bancone', x: 5.4, z: 1.6, w: 3.6, d: 0.6, h: 1.05, colore: '#f0ece0', piano: '#c8c8c0', cassa: true, zona: 'banco', etichetta: 'Banco: fai la spesa' },
      { tipo: 'frigo', x: 10.2, z: 0.2, w: 1.0, d: 0.75, h: 2.0, zona: 'frigo', etichetta: 'Frigo dei formaggi' },
      { tipo: 'cassa', x: 0.5, z: 4.4, w: 0.9, d: 0.8, h: 0.6, colore: '#c88a3a', zona: 'frutta', etichetta: 'Cassetta della frutta' },
      { tipo: 'cassa', x: 1.6, z: 4.4, w: 0.9, d: 0.8, h: 0.6, colore: '#6a8a3a' },
      { tipo: 'sacchi', x: 10.0, z: 4.6, w: 1.6, d: 0.9, h: 0.9 },
      z(6, 7, '#3a6a3a'),
    ],
  },

  fienile: {
    nome: 'Fienile', w: 12, d: 7, h: 3.8, pavimento: 'assi', muro: 'legno', musica: 'base',
    ...porta(6, 7),
    stanze: [{ id: 'fienile', nome: 'Fienile del Gigante', x0: 0, x1: 12, luce: 0.8 }],
    finestre: [{ x: 5.4, y: 2.6, w: 1.2, h: 0.6 }],
    mobili: [
      { tipo: 'paglia', x: 0.3, z: 0.3, w: 1.6, d: 1.2, h: 1.2, zona: 'paglia', etichetta: 'Mucchio di fieno: pisolino' },
      { tipo: 'paglia', x: 0.3, z: 1.6, w: 1.6, d: 1.2, h: 0.8 },
      { tipo: 'paglia', x: 2.1, z: 0.3, w: 1.6, d: 1.2, h: 1.6 },
      { tipo: 'paglia', x: 9.8, z: 0.3, w: 1.8, d: 1.4, h: 2.0 },
      { tipo: 'paglia', x: 9.8, z: 1.9, w: 1.8, d: 1.2, h: 1.0 },
      { tipo: 'rastrelliera', x: 4.4, z: 0.2, w: 2.4, d: 0.5, h: 2.2, zona: 'attrezzi', etichetta: 'Forconi e rastrelli vecchi' },
      { tipo: 'botte', x: 7.4, z: 0.3, w: 1.0, d: 0.9, h: 1.1, zona: 'botte', etichetta: 'La botte del Filosofo' },
      { tipo: 'secchio', x: 8.6, z: 0.6, w: 0.5, d: 0.5, h: 0.5 },
      { tipo: 'corda', parete: true, x: 3.6, y: 1.2, w: 0.4, h: 2.4 },
      z(6, 7, '#7a5a3a'),
    ],
  },

  'casa-rosa': {
    nome: 'Salone Wanda', w: 11, d: 7, h: 3.2, pavimento: 'scacchi', muro: 'velluto', musica: 'base', orari: [9, 19],
    ...porta(5.5, 7),
    stanze: [{ id: 'salone', nome: 'Salone di bellezza «Wanda»', x0: 0, x1: 11 }],
    finestre: [{ x: 8.6, y: 1.3, w: 1.4, h: 1.0 }],
    mobili: [
      { tipo: 'specchio', parete: true, x: 0.6, y: 1.0, w: 1.4, h: 1.4 },
      { tipo: 'sedia', x: 1.0, z: 1.0, w: 0.7, d: 0.7, h: 1.2, colore: '#c8304a', zona: 'poltrona', etichetta: 'Poltrona: taglio e piega (15€)' },
      { tipo: 'specchio', parete: true, x: 2.8, y: 1.0, w: 1.4, h: 1.4 },
      { tipo: 'sedia', x: 3.2, z: 1.0, w: 0.7, d: 0.7, h: 1.2, colore: '#c8304a' },
      { tipo: 'mensola', parete: true, x: 4.8, y: 1.3, w: 2.2, h: 0.8, merce: 'bottiglie' },
      { tipo: 'lavello', x: 5.0, z: 0.2, w: 1.6, d: 0.7, h: 0.95, zona: 'shampoo', etichetta: 'Lavatesta' },
      { tipo: 'divano', x: 7.4, z: 3.6, w: 2.4, d: 0.9, h: 0.9, colore: '#e8a0b0', zona: 'riviste', etichetta: 'Divanetto e riviste di gossip' },
      { tipo: 'tavolino', x: 7.9, z: 2.4, w: 1.2, d: 0.7, h: 0.45 },
      { tipo: 'poster', parete: true, x: 8.0, y: 1.6, w: 1.4, h: 1.0, zona: 'poster', etichetta: 'Poster «Acconciature 1989»' },
      { tipo: 'pianta', x: 10.2, z: 0.4, w: 0.5, d: 0.5, h: 1.2 },
      z(5.5, 7, '#c8304a'),
    ],
  },

  'casa-azzurra': {
    nome: 'Casa della Sciura Ines', w: 11, d: 6, h: 3, pavimento: 'parquet', muro: 'carta2', musica: 'base', orari: [7, 22],
    ...porta(5.5, 6),
    stanze: [{ id: 'salotto', nome: 'Salotto della Sciura Ines', x0: 0, x1: 11 }],
    finestre: [{ x: 1.2, y: 1.3, w: 1.2, h: 1.0 }, { x: 8.6, y: 1.3, w: 1.2, h: 1.0 }],
    mobili: [
      { tipo: 'mobiletv', x: 3.2, z: 0.25, w: 2.0, d: 0.6, h: 0.6 },
      { tipo: 'tv', x: 3.5, z: 0.35, w: 1.4, d: 0.45, h: 1.0, y: 0.6, zona: 'tv', etichetta: 'La TV sempre accesa sul quiz' },
      { tipo: 'divano', x: 3.0, z: 2.6, w: 2.6, d: 0.95, h: 0.9, colore: '#6a8ab8' },
      { tipo: 'credenza', x: 6.6, z: 0.2, w: 2.2, d: 0.6, h: 1.6, zona: 'credenza', etichetta: 'Credenza delle bomboniere' },
      { tipo: 'ritratto', parete: true, x: 0.5, y: 1.4, w: 0.7, h: 0.9, colore: '#4a3a2a', zona: 'foto', etichetta: 'Foto del matrimonio (1961)' },
      { tipo: 'tavolo', x: 8.0, z: 3.2, w: 1.6, d: 1.0, h: 0.8, colore: '#8a5a32', tovaglia: '#e8e0f0', zona: 'centrino', etichetta: 'Il centrino sul tavolo' },
      { tipo: 'tappeto', pavimento: true, x: 2.8, z: 1.3, w: 3.0, d: 1.2, colore: '#3a5a8a' },
      z(5.5, 6, '#3a5a8a'),
    ],
  },

  'cascina-patata': {
    nome: 'Cascina del Potato', w: 13, d: 7, h: 3, pavimento: 'cotto', muro: 'carta', musica: 'base', orari: [6, 22],
    ...porta(6.5, 7),
    stanze: [
      { id: 'cucina', nome: 'Cucina del Potato', x0: 0, x1: 8 },
      { id: 'dispensa', nome: 'Dispensa delle patate', x0: 8, x1: 13, muro: 'mattoni', pavimento: 'cemento', luce: 0.7 },
    ],
    finestre: [{ x: 1.0, y: 1.3, w: 1.2, h: 1.0 }],
    mobili: [
      { tipo: 'fornelli', x: 2.6, z: 0.2, w: 1.6, d: 0.7, h: 0.95, zona: 'pentola', etichetta: 'La pentola che bolle (patate)' },
      { tipo: 'lavello', x: 4.3, z: 0.2, w: 1.4, d: 0.7, h: 0.95 },
      { tipo: 'tavolo', x: 2.6, z: 3.0, w: 2.2, d: 1.2, h: 0.8, colore: '#a87a4a', tovaglia: '#e8c050', zona: 'tavola', etichetta: 'Tavola del Potato' },
      { tipo: 'sedia', x: 2.2, z: 3.3, w: 0.4, d: 0.5, h: 0.95 }, { tipo: 'sedia', x: 4.9, z: 3.3, w: 0.4, d: 0.5, h: 0.95 },
      { tipo: 'quadro', parete: true, x: 6.0, y: 1.3, w: 1.4, h: 1.0, zona: 'quadro', etichetta: 'Il quadro della Patata d\'Oro 1998' },
      { tipo: 'sacchi', x: 8.4, z: 0.3, w: 2.2, d: 1.1, h: 1.1, zona: 'patate', etichetta: 'Sacchi di patate (con i nomi)' },
      { tipo: 'cassa', x: 11.0, z: 0.4, w: 1.2, d: 0.9, h: 0.8 },
      { tipo: 'cassa', x: 11.2, z: 1.5, w: 1.0, d: 0.8, h: 0.6 },
      z(6.5, 7, '#a87a4a'),
    ],
  },

  'cascina-postino': {
    nome: 'Cascina del Postman', w: 12, d: 7, h: 3, pavimento: 'parquet', muro: 'carta2', musica: 'base', orari: [6, 22],
    ...porta(6, 7),
    stanze: [{ id: 'casa', nome: 'Casa del Postman (e centro smistamento abusivo)', x0: 0, x1: 12 }],
    finestre: [{ x: 9.6, y: 1.3, w: 1.2, h: 1.0 }],
    mobili: [
      { tipo: 'scaffale', x: 0.3, z: 0.2, w: 2.6, d: 0.5, h: 2.2, merce: 'oggetti', zona: 'casellario', etichetta: 'Casellario delle lettere' },
      { tipo: 'scrivania', x: 3.4, z: 1.4, w: 2.4, d: 1.0, h: 0.8, colore: '#7a5a3a', zona: 'timbri', etichetta: 'Timbri e francobolli' },
      { tipo: 'cassa', x: 6.6, z: 0.3, w: 1.0, d: 0.8, h: 0.8, colore: '#c8a070', zona: 'pacchi', etichetta: 'Pacchi «in giacenza» (dal 2019)' },
      { tipo: 'cassa', x: 7.7, z: 0.3, w: 0.8, d: 0.7, h: 1.2, colore: '#b8905a' },
      { tipo: 'divano', x: 8.4, z: 3.8, w: 2.4, d: 0.9, h: 0.9, colore: '#8a6a3a' },
      { tipo: 'calendario', parete: true, x: 6.0, y: 1.5, w: 0.8, h: 1.0, zona: 'calendario', etichetta: 'Calendario delle Poste 2007' },
      z(6, 7, '#c8a040'),
    ],
  },

  'ranch-frank': {
    nome: 'Ranch di Mister Frank', w: 14, d: 7, h: 3.4, pavimento: 'assi', muro: 'legno', musica: 'base', orari: [6, 24],
    ...porta(7, 7),
    stanze: [{ id: 'saloon', nome: 'Saloon del ranch di Mister Frank', x0: 0, x1: 14 }],
    finestre: [{ x: 1.2, y: 1.3, w: 1.2, h: 1.0 }, { x: 11.4, y: 1.3, w: 1.2, h: 1.0 }],
    mobili: [
      { tipo: 'bancone', x: 3.4, z: 1.4, w: 4.4, d: 0.6, h: 1.1, colore: '#6a3a1c', piano: '#3a2010', zona: 'bancone', etichetta: 'Bancone del saloon' },
      { tipo: 'mensola', parete: true, x: 3.6, y: 1.4, w: 4.0, h: 0.8, merce: 'bottiglie' },
      { tipo: 'trofei', parete: true, x: 8.6, y: 1.8, w: 1.6, h: 0.7, zona: 'corna', etichetta: 'Corna di toro sopra la porta' },
      { tipo: 'jukebox', x: 12.4, z: 0.3, w: 1.0, d: 0.7, h: 1.7, zona: 'jukebox', etichetta: 'Jukebox country' },
      { tipo: 'tavolo', x: 9.4, z: 3.6, w: 1.4, d: 1.0, h: 0.8, colore: '#7a4a26', zona: 'poker', etichetta: 'Tavolo da poker' },
      { tipo: 'sedia', x: 9.0, z: 3.9, w: 0.4, d: 0.5, h: 0.95 }, { tipo: 'sedia', x: 10.9, z: 3.9, w: 0.4, d: 0.5, h: 0.95 },
      { tipo: 'botte', x: 0.4, z: 0.3, w: 1.0, d: 0.9, h: 1.1 },
      { tipo: 'sella', x: 0.4, z: 3.4, w: 1.0, d: 0.7, h: 1.0, colore: '#7a3a1a', zona: 'sella', etichetta: 'La sella di Frank (non sederti)' },
      z(7, 7, '#7a2a22'),
    ],
  },

  'cascina-oglio': {
    nome: 'Cascina del Camper', w: 12, d: 7, h: 3, pavimento: 'assi', muro: 'carta', musica: 'base', orari: [6, 23],
    ...porta(6, 7),
    stanze: [{ id: 'casa', nome: 'Cascina del Vecchio Camper', x0: 0, x1: 12 }],
    finestre: [{ x: 9.4, y: 1.3, w: 1.4, h: 1.0 }],
    mobili: [
      { tipo: 'camino', x: 0.4, z: 0.2, w: 1.8, d: 0.8, h: 1.6, zona: 'stufa', etichetta: 'La stufa a legna' },
      { tipo: 'libreria', x: 2.6, z: 0.2, w: 1.8, d: 0.5, h: 2.2, zona: 'libri', etichetta: 'Libri sul fiume Oglio' },
      { tipo: 'mensola', parete: true, x: 4.8, y: 1.6, w: 2.4, h: 0.6, merce: 'conserve' },
      { tipo: 'tavolo', x: 5.0, z: 2.8, w: 2.0, d: 1.1, h: 0.8, colore: '#9a7048', tovaglia: '#6a9a5a', zona: 'tisane', etichetta: 'Tisane della Zaira' },
      { tipo: 'sedia', x: 4.6, z: 3.1, w: 0.4, d: 0.5, h: 0.95 }, { tipo: 'sedia', x: 7.1, z: 3.1, w: 0.4, d: 0.5, h: 0.95 },
      { tipo: 'rastrelliera', x: 9.4, z: 0.2, w: 2.2, d: 0.5, h: 2.0, zona: 'canne', etichetta: 'Canne da pesca del Camper' },
      { tipo: 'tappeto', pavimento: true, x: 4.6, z: 4.6, w: 2.8, d: 1.2, colore: '#8a6a3a' },
      z(6, 7, '#6a8a3a'),
    ],
  },

  consorzio: {
    nome: 'Consorzio Rodella', w: 16, d: 7, h: 3.8, pavimento: 'cemento', muro: 'lamiera', musica: 'base', orari: [7, 19],
    ...porta(5, 7),
    stanze: [{ id: 'magazzino', nome: 'Consorzio Agrario Rodella', x0: 0, x1: 16 }],
    finestre: [{ x: 6.5, y: 2.2, w: 3, h: 0.8 }],
    mobili: [
      { tipo: 'insegna', parete: true, x: 5.4, y: 2.7, w: 4.6, h: 0.5, testo: 'CONSORZIO RODELLA' },
      { tipo: 'sacchi', x: 0.4, z: 0.3, w: 2.2, d: 1.1, h: 1.1, zona: 'sacchi', etichetta: 'Sacchi di mangime in offerta' },
      { tipo: 'sacchi', x: 2.8, z: 0.3, w: 2.2, d: 1.1, h: 1.1 },
      { tipo: 'bancone', x: 6.0, z: 1.5, w: 3.6, d: 0.6, h: 1.05, colore: '#2a6a3a', piano: '#d8d0b8', zona: 'cassa', etichetta: 'Cassa del Consorzio' },
      { tipo: 'scaffale', x: 10.4, z: 0.2, w: 2.4, d: 0.5, h: 2.4, merce: 'ricambi', zona: 'semi', etichetta: 'Scaffale delle sementi' },
      { tipo: 'espositore', x: 13.6, z: 0.4, w: 1.2, d: 1.0, h: 1.4, zona: 'catalogo', etichetta: 'Catalogo dei trattori' },
      { tipo: 'bacheca', parete: true, x: 13.4, y: 1.8, w: 1.6, h: 0.9, zona: 'organigramma', etichetta: 'Organigramma aziendale (tutti Rodella)' },
      { tipo: 'gomme', x: 14.6, z: 5.0, w: 0.9, d: 0.9, h: 1.0 },
      { tipo: 'bidone', x: 0.6, z: 5.2, w: 0.7, d: 0.7, h: 1.0, colore: '#2a6a3a' },
      z(5, 7, '#2a6a3a'),
    ],
  },

  'casotto-guardie': {
    nome: 'Casotto delle Guardie', w: 11, d: 6, h: 3, pavimento: 'assi', muro: 'legno', musica: 'base', orari: [7, 24],
    ...porta(5.5, 6),
    stanze: [{ id: 'casotto', nome: 'Casotto delle Guardie del Parco', x0: 0, x1: 11 }],
    finestre: [{ x: 8.6, y: 1.3, w: 1.4, h: 1.0 }],
    mobili: [
      { tipo: 'scrivania', x: 3.6, z: 1.4, w: 2.4, d: 1.0, h: 0.8, colore: '#5a4a2a', zona: 'verbali', etichetta: 'Blocchetto dei verbali' },
      { tipo: 'bacheca', parete: true, x: 0.5, y: 1.1, w: 2.0, h: 1.2, zona: 'mappa', etichetta: 'Mappa del Parco Oglio' },
      { tipo: 'rastrelliera', x: 6.8, z: 0.2, w: 1.8, d: 0.5, h: 2.0, zona: 'binocoli', etichetta: 'Binocoli e retini' },
      { tipo: 'macchinetta', x: 9.6, z: 0.3, w: 0.8, d: 0.6, h: 1.6, zona: 'caffe', etichetta: 'Macchinetta del caffè (1€)' },
      { tipo: 'cassa', x: 0.5, z: 4.2, w: 1.0, d: 0.8, h: 0.7, colore: '#6a5a3a', zona: 'sequestri', etichetta: 'Cassa dei sequestri' },
      z(5.5, 6, '#3a5a2a'),
    ],
  },

  stalla: {
    nome: 'Stalla', w: 14, d: 7, h: 3.6, pavimento: 'cemento', muro: 'legno', musica: 'base',
    ...porta(7, 7),
    stanze: [{ id: 'stalla', nome: 'Stalla del Gigante', x0: 0, x1: 14, luce: 0.85 }],
    finestre: [{ x: 3.2, y: 2.2, w: 1.4, h: 0.6 }, { x: 9.4, y: 2.2, w: 1.4, h: 0.6 }],
    mobili: [
      { tipo: 'box', x: 0.3, z: 0.2, w: 3.0, d: 3.0, h: 0.8 },
      { tipo: 'box', x: 3.5, z: 0.2, w: 3.0, d: 3.0, h: 0.8 },
      { tipo: 'box', x: 6.7, z: 0.2, w: 3.0, d: 3.0, h: 0.8 },
      { tipo: 'paglia', x: 10.2, z: 0.3, w: 1.6, d: 1.2, h: 1.2, zona: 'fieno', etichetta: 'Balle di fieno' },
      { tipo: 'secchio', x: 12.2, z: 0.6, w: 0.5, d: 0.5, h: 0.5, zona: 'secchio', etichetta: 'Secchio del latte' },
      { tipo: 'sgabello', x: 12.0, z: 1.6, w: 0.45, d: 0.45, h: 0.5 },
      { tipo: 'bacheca', parete: true, x: 10.4, y: 1.4, w: 1.4, h: 0.9, zona: 'turni', etichetta: 'Turni di mungitura' },
      z(7, 7, '#5a4a2a'),
    ],
  },

  capannone2: {
    nome: 'Capannone del mangime', w: 14, d: 7, h: 3.2, pavimento: 'cemento', muro: 'lamiera', musica: 'base',
    ...porta(7, 7),
    stanze: [{ id: 'capannone', nome: 'Capannone del mangime', x0: 0, x1: 14, luce: 0.8 }],
    finestre: [{ x: 6, y: 2.2, w: 2, h: 0.5 }],
    mobili: [
      { tipo: 'sacchi', x: 0.4, z: 0.3, w: 2.2, d: 1.1, h: 1.1, zona: 'sacchi', etichetta: 'Mangime del 2016' },
      { tipo: 'sacchi', x: 2.8, z: 0.3, w: 2.2, d: 1.1, h: 1.1 },
      { tipo: 'sacchi', x: 5.2, z: 0.3, w: 2.2, d: 1.1, h: 1.1 },
      { tipo: 'bidone', x: 9.0, z: 0.4, w: 0.7, d: 0.7, h: 1.0 },
      { tipo: 'cassa', x: 10.2, z: 0.4, w: 1.2, d: 0.9, h: 0.9, zona: 'cassa', etichetta: 'Cassa misteriosa' },
      { tipo: 'gomme', x: 12.4, z: 4.8, w: 0.9, d: 0.9, h: 1.0 },
      { tipo: 'macchia', pavimento: true, x: 6.0, z: 3.4, w: 1.6, d: 0.9 },
      z(7, 7, '#5a5a5a'),
    ],
  },

  // ---------- Cascina dei Salici: si entra solo dopo averla comprata ----------
  'salici-casa': {
    nome: 'Casa della Cascina dei Salici', w: 13, d: 7, h: 3.2, pavimento: 'parquet', muro: 'carta', musica: 'base',
    ...porta(6.5, 7),
    stanze: [
      { id: 'soggiorno', nome: 'Casa padronale dei Salici', x0: 0, x1: 8 },
      { id: 'camera', nome: 'Camera del padrone', x0: 8, x1: 13, muro: 'carta2' },
    ],
    finestre: [{ x: 1.2, y: 1.3, w: 1.2, h: 1.0 }, { x: 10.6, y: 1.3, w: 1.2, h: 1.0 }],
    mobili: [
      { tipo: 'scrivania', x: 3.0, z: 1.4, w: 2.4, d: 1.0, h: 0.8, colore: '#6a4a2a', zona: 'registro', etichetta: 'Registro della cascina' },
      { tipo: 'sedia', x: 3.9, z: 0.8, w: 0.5, d: 0.5, h: 1.1 },
      { tipo: 'camino', x: 0.3, z: 0.2, w: 1.8, d: 0.8, h: 1.6, zona: 'camino', etichetta: 'Il camino' },
      { tipo: 'calendario', parete: true, x: 6.2, y: 1.4, w: 0.8, h: 1.0, zona: 'conti', etichetta: 'I conti della cascina' },
      { tipo: 'divano', x: 4.4, z: 4.0, w: 2.4, d: 0.9, h: 0.9, colore: '#7a5a3a' },
      { tipo: 'cassapanca', x: 0.5, z: 4.6, w: 1.8, d: 0.8, h: 0.8, zona: 'baule', etichetta: 'Il baule di Garonio: metti e riprendi la roba' },
      { tipo: 'letto', x: 8.4, z: 0.3, w: 2.2, d: 3.0, h: 0.65, zona: 'letto', etichetta: 'Letto di Garonio' },
      { tipo: 'armadio', x: 11.0, z: 0.2, w: 1.8, d: 0.8, h: 2.3 },
      { tipo: 'trofei', parete: true, x: 10.8, y: 1.6, w: 1.2, h: 0.5, zona: 'trofei', etichetta: 'Le coccarde del Concilio' },
      z(6.5, 7, '#7a5a3a'),
    ],
  },
  'salici-porcilaia': {
    nome: 'Porcilaia dei Salici', w: 14, d: 7, h: 3, pavimento: 'cemento', muro: 'lamiera', musica: 'base',
    ...porta(7, 7),
    stanze: [{ id: 'porcilaia', nome: 'Porcilaia della Cascina dei Salici', x0: 0, x1: 14 }],
    finestre: [{ x: 3, y: 2.1, w: 1.6, h: 0.5 }, { x: 9, y: 2.1, w: 1.6, h: 0.5 }],
    mobili: [
      { tipo: 'box', x: 0.3, z: 0.2, w: 3.1, d: 3.2, h: 0.8 },
      { tipo: 'box', x: 3.6, z: 0.2, w: 3.1, d: 3.2, h: 0.8 },
      { tipo: 'box', x: 6.9, z: 0.2, w: 3.1, d: 3.2, h: 0.8 },
      { tipo: 'sacchi', x: 10.6, z: 0.3, w: 2.2, d: 1.1, h: 1.1, zona: 'mangime', etichetta: 'Mangime della porcilaia' },
      { tipo: 'bacheca', parete: true, x: 10.8, y: 1.6, w: 1.4, h: 0.9, zona: 'scheda', etichetta: 'Scheda della porcilaia' },
      z(7, 7, '#5a4a2a'),
    ],
  },
  'salici-stalla': {
    nome: 'Stalla dei Salici', w: 12, d: 7, h: 3.4, pavimento: 'cemento', muro: 'legno', musica: 'base',
    ...porta(6, 7),
    stanze: [{ id: 'stalla', nome: 'Stalla della Cascina dei Salici', x0: 0, x1: 12, luce: 0.9 }],
    finestre: [{ x: 5, y: 2.2, w: 1.6, h: 0.6 }],
    mobili: [
      { tipo: 'box', x: 0.3, z: 0.2, w: 3.4, d: 3.2, h: 0.8 },
      { tipo: 'box', x: 3.9, z: 0.2, w: 3.4, d: 3.2, h: 0.8 },
      { tipo: 'paglia', x: 8.0, z: 0.3, w: 1.6, d: 1.2, h: 1.2 },
      { tipo: 'secchio', x: 10.0, z: 0.6, w: 0.5, d: 0.5, h: 0.5 },
      { tipo: 'bacheca', parete: true, x: 9.8, y: 1.6, w: 1.4, h: 0.9, zona: 'scheda', etichetta: 'Scheda della stalla' },
      z(6, 7, '#5a4a2a'),
    ],
  },
  'salici-pollaio': {
    nome: 'Pollaio dei Salici', w: 9, d: 6, h: 2.8, pavimento: 'assi', muro: 'legno', musica: 'base',
    ...porta(4.5, 6),
    stanze: [{ id: 'pollaio', nome: 'Pollaio della Cascina dei Salici', x0: 0, x1: 9, luce: 0.9 }],
    finestre: [{ x: 6.6, y: 1.6, w: 1.0, h: 0.6 }],
    mobili: [
      { tipo: 'scaffale', x: 0.3, z: 0.2, w: 3.2, d: 0.6, h: 1.3, colore: '#8a6a3a', zona: 'nidi', etichetta: 'I nidi delle galline' },
      { tipo: 'paglia', x: 6.8, z: 0.3, w: 1.6, d: 1.0, h: 0.8 },
      { tipo: 'bacheca', parete: true, x: 4.0, y: 1.3, w: 1.2, h: 0.8, zona: 'scheda', etichetta: 'Scheda del pollaio' },
      z(4.5, 6, '#7a5a3a'),
    ],
  },
};

export const CHIAVI = { 'salici-casa': 'salici', 'salici-porcilaia': 'salici', 'salici-stalla': 'salici', 'salici-pollaio': 'salici' };
export const CHIAVE_NO = "🔒 È chiuso a chiave. Sulla porta: «Proprietà privata. Rivolgersi all'Ufficio agricolo». E sotto, a pennarello: «o al Gigante».";

export const PORTE_NUOVE = {
  municipio: 'Entra in municipio', tabacchi: 'Entra dal tabaccaio', alimentari: 'Entra all\'alimentari', fienile: 'Entra nel fienile',
  'casa-rosa': 'Entra dalla parrucchiera', 'casa-azzurra': 'Bussa dalla Sciura Ines', 'cascina-patata': 'Bussa dal Potato',
  'cascina-postino': 'Bussa dal Postman', 'ranch-frank': 'Entra nel ranch', 'cascina-oglio': 'Bussa dal Camper',
  consorzio: 'Entra nel Consorzio', 'casotto-guardie': 'Entra nel casotto', stalla: 'Entra nella stalla', capannone2: 'Entra nel capannone',
  'salici-casa': 'Entra in casa (Salici)', 'salici-porcilaia': 'Entra nella porcilaia', 'salici-stalla': 'Entra nella stalla', 'salici-pollaio': 'Entra nel pollaio',
};

export const ENTRATE = {
  municipio: ["Municipio. Odore di timbri e di caffè della macchinetta. Il numeretto dice 47. Stanno servendo il 3.", "Il municipio: tre sportelli, un impiegato, infinite marche da bollo."],
  tabacchi: ["Il campanello fa «dlin». La Rosy alza gli occhi dal Gratta e Vinci. Il suo.", "Tabacchi: profumo di carta, liquirizia e speranza mal riposta."],
  alimentari: ["Alimentari della Rina. Qui si sa tutto prima del telegiornale.", "Odore di salame, pane e pettegolezzo fresco."],
  fienile: ["Il fienile. Polvere dorata, silenzio, e qualcuno che russa dentro un mucchio di fieno.", "Fieno ovunque. Anche nelle mutande, tra cinque minuti."],
  'casa-rosa': ["Salone Wanda. Lacca nell'aria: un fiammifero e salta il paese.", "Il casco della piega ronza. Sotto c'è una signora che sa tutto di tutti."],
  'casa-azzurra': ["La casa della Sciura Ines. Centrini su ogni superficie. Anche sul gatto, se ci fosse.", "Odore di naftalina e di caffè d'orzo. Il Gaetano non si gira: c'è il quiz."],
  'cascina-patata': ["La cascina del Potato. Patate ovunque. Una ha gli occhiali da sole.", "In cucina bolle una pentola. Indovina cosa c'è dentro."],
  'cascina-postino': ["Casa del Postman: lettere sul tavolo, lettere sulla sedia, lettere nel frigo.", "Qui finiscono le lettere che non arrivano. Cioè quasi tutte."],
  'ranch-frank': ["Il ranch di Mister Frank. Il pavimento scricchiola in inglese.", "Yeehaw. Lo dice il cartello sulla porta. E il pappagallo, ma il pappagallo è finto."],
  'cascina-oglio': ["La cascina del Vecchio Camper. Profumo di legna, tisana e pesce.", "Il fiume si sente anche da qui. O è la pentola della Zaira."],
  consorzio: ["Il magazzino del Consorzio Rodella. Un altoparlante dice: «Oggi offerta sul mangime. Anche domani. Sempre.»", "Sacchi, sementi e un ragazzo con un tablet che ti sorride troppo."],
  'casotto-guardie': ["Il casotto delle Guardie. Sul muro: «Giorni senza incidenti nel parco: 0».", "Odore di stivali bagnati e di verbale."],
  stalla: ["La stalla. Calda, umida, e qualcuno ti guarda masticando.", "Muuu. Non sei tu. Speri."],
  capannone2: ["Il capannone del mangime. C'è un gatto che ti fissa come il padrone di casa.", "Sacchi, polvere e un bidone che fa rumore anche da fermo."],
  'salici-casa': ["Casa tua. Tua davvero. Il Gigante non c'è. Respira.", "La casa padronale dei Salici. Il tetto, oggi, non gocciola. Quasi."],
  'salici-porcilaia': ["La tua porcilaia. Sono tuoi, i maiali. Anche l'odore.", "Grugniti di benvenuto. O di fame."],
  'salici-stalla': ["La tua stalla. Le mucche ti guardano come si guarda un capo nuovo: con sospetto.", "Odore di fieno e di latte. Profumo di soldi, dice il Gigante."],
  'salici-pollaio': ["Il pollaio. Venti galline smettono di parlare quando entri.", "Coccodè. Il tono è di rimprovero."],
};
export const CHIUSI = {
  municipio: "Il municipio apre dalle 8 alle 19. Sul vetro: «Torno subito». Il cartello è del 2011.",
  tabacchi: "Il tabacchi apre alle 7 e chiude alle 20. Il distributore fuori funziona, a modo suo.",
  alimentari: "L'alimentari apre alle 7 e chiude alle 20. La Rina dorme. Con un occhio solo.",
  'casa-rosa': "Il Salone Wanda apre alle 9 e chiude alle 19. Dentro, la lacca riposa.",
  'casa-azzurra': "Dalla finestra: «A quest'ora? Sono le ore di Dio! Torni domani, giovanotto.»",
  'cascina-patata': "Dentro si sente russare. Due persone e, sembra, una patata.",
  'cascina-postino': "Sulla porta: «Il Postman riposa. Le lettere no: sono già in ritardo.»",
  'ranch-frank': "Dall'interno: «Go home, boy! It's late!» E un colpo di fucile in aria. Per sicurezza.",
  'cascina-oglio': "La Zaira, dalla finestra: «Il fiume dorme. Dormi anche tu.»",
  consorzio: "Il Consorzio apre alle 7 e chiude alle 19. Il cartello dice: «Per urgenze: Rodella». Non c'è il numero.",
  'casotto-guardie': "Il casotto apre alle 7. La natura, invece, è sempre aperta.",
};

// ---------------------------------------------------------------------
//  PERSONAGGI NUOVI (stanno dentro)
// ---------------------------------------------------------------------
export const PNG_NUOVI = {
  sindaco: {
    nome: 'Il Sindaco Fumagalli', ruolo: 'Sindaco da ventidue anni. Inaugura tutto, anche le buche.',
    posti: [{ ore: [9, 18], interno: 'municipio', x: 17.6, z: 3.0 }],
    aspetto: { sprite: 'boss_sigaro', w: 16, h: 24, skin: '#e8b48a', hair: '#8a8a8a', hairStyle: 'flat', shirt: '#2a2a3a', pants: '#2a2a3a', boots: '#1a1a1a', eyes: 'normal' },
    amicizia: [-20, 100, 10],
    saluti: [
      "Garonio! Il nostro giovane agricoltore! Sorridi, c'è il fotografo. Non c'è? Sorridi lo stesso, non si sa mai.",
      "Benvenuto nel palazzo del popolo! Cioè il municipio. Il palazzo è una parola grossa, ma il popolo c'è.",
      "Ah, un cittadino! Prego, si accomodi. Le sedie sono nuove: le ho inaugurate io.",
      "Sai qual è il segreto della politica, Garonio? Stringere mani. E non ricordarsi mai di chi.",
    ],
    chiacchiere: [
      "La rotonda all'ingresso del paese la faccio l'anno prossimo. Lo dico da otto anni. È una promessa a lungo termine.",
      "Tuo padre, il Gigante, mi ha votato contro sette volte. L'ottava ha sbagliato scheda.",
      "La Vigilessa fa più multe di quante il Comune ne possa spendere. È il mio migliore assessore.",
      "Il Conte vuole il castello patrimonio dell'umanità. Io mi accontento che non crolli prima delle elezioni.",
    ],
    sulleRagazze: ["La {ragazza}? Bella coppia. Se vi sposate, il rinfresco lo inauguro io."],
  },
  cavilli: {
    nome: 'Il ragionier Cavilli', ruolo: 'Impiegato dell\'Anagrafe. Ha timbrato più fogli di quanti alberi abbia la Bassa.',
    posti: [{ ore: [8, 13], interno: 'municipio', x: 5.0, z: 1.0 }],
    aspetto: { sprite: 'geometra', w: 16, h: 23, skin: '#e8c4a0', hair: '#5a4a3a', hairStyle: 'flat', shirt: '#c8d0d8', pants: '#3a3a42', boots: '#222', eyes: 'normal' },
    amicizia: [-30, 60, 0],
    saluti: [
      "Numero? Non ha il numero? Allora lei per me non esiste. Scherzo. In parte.",
      "Buongiorno. Certificati, timbri, rimpianti: sportello due.",
      "Mi dica. Con calma. Io ho tempo fino alle 13. Poi non ho più tempo per nessuno.",
    ],
    chiacchiere: [
      "In quarant'anni ho sposato duecento coppie e ne ho divorziate centoventi. È un buon rapporto, per la Bassa.",
      "Il timbro rotondo è per le cose belle. Quello quadrato per le multe. Quello triangolare non so, me l'hanno dato.",
      "Ogni tanto nell'archivio sento dei rumori. Sono i topi. O i faldoni del 1974 che si lamentano.",
    ],
  },
  rosy: {
    nome: 'La Rosy del tabacchi', ruolo: 'Moglie del Gino. Vende la fortuna a cinque euro e la usa tutta per sé.',
    posti: [{ ore: [7, 20], interno: 'tabacchi', x: 2.2, z: 1.0 }],
    aspetto: { sprite: 'donna_grembiule', w: 16, h: 24, skin: '#f0c8a8', hair: '#c85a2a', hairStyle: 'long', shirt: '#e8a040', pants: '#4a3a5a', boots: '#2a1a1a', eyes: 'normal' },
    amicizia: [0, 100, 20],
    saluti: [
      "Ciao bello! Un Gratta e Vinci? Questo pacchetto è caldo, me lo sento. Me lo sento da tre anni.",
      "Il Gino? È fuori a guardare i cantieri. Lui guarda i cantieri, io gratto. Siamo una coppia moderna.",
      "Francobolli, sigarette, marche da bollo, sogni. Cosa ti serve?",
    ],
    chiacchiere: [
      "Nel 1994 ho vinto ventimila lire. Le ho rigiocate. Sono ancora lì, da qualche parte.",
      "Il Bepi gioca sempre gli stessi numeri: la data di nascita della sua mucca. È morta nel '99. I numeri no.",
      "Una volta il Gigante ha comprato un Gratta e Vinci. Ha vinto. Non l'ha più rifatto: dice che la fortuna va risparmiata.",
    ],
    sulleRagazze: ["La {ragazza}? Ti porta fortuna, si vede. Usala qui, che la paghi meno."],
  },
  rina: {
    nome: 'La Rina dell\'alimentari', ruolo: 'Bottegaia. Sa cosa mangia ogni famiglia del paese, e perché.',
    posti: [{ ore: [7, 20], interno: 'alimentari', x: 7.2, z: 1.0 }],
    aspetto: { sprite: 'grembiule_verde', w: 16, h: 24, skin: '#f0c8a8', hair: '#d8d8d8', hairStyle: 'bun', shirt: '#3a8a4a', pants: '#3a3a4a', boots: '#2a1a1a', eyes: 'normal' },
    amicizia: [0, 100, 30],
    saluti: [
      "Garonio! Tua madre è passata stamattina: ha preso il salame. Il salame che dice di non prendere mai.",
      "Due etti di crudo? Mezzo chilo di pane? Una notizia fresca? Ho tutto.",
      "Il pane di oggi è buono. Quello di ieri è più buono: ha più carattere.",
    ],
    chiacchiere: [
      "La Pina compra due vasetti di Nutella alla settimana. Dice che sono per i nipoti. Non ha nipoti.",
      "Il Bubetto mi chiede sempre lo sconto. Io gli dico di sì. Poi alzo il prezzo prima.",
      "Ti ho visto dormire sulla Vespa, sai. Io vedo tutto. È il mio lavoro. Cioè no, ma lo faccio.",
    ],
    sulleRagazze: ["La {ragazza} è passata a comprare i biscotti. Due pacchi. Sta pensando a te, o ha fame. Tutte e due."],
  },
  filosofo: {
    nome: 'Il Filosofo del fienile', ruolo: 'Vive nel fienile del Gigante da anni. Il Gigante finge di non saperlo.',
    posti: [{ ore: [6, 30], interno: 'fienile', x: 8.4, z: 3.2 }],
    aspetto: { sprite: 'hippie_barba', w: 16, h: 24, skin: '#d8a878', hair: '#7a6a5a', hairStyle: 'long', shirt: '#8a7a4a', pants: '#5a4a3a', boots: '#3a2a1a', eyes: 'normal' },
    amicizia: [0, 100, 25],
    saluti: [
      "Ah, Garonio. Sai che il fieno è solo erba che ha smesso di sperare?",
      "Siediti. Il tempo qui dentro non passa. Esce dalla finestra e va a dormire.",
      "Il Gigante sa che sto qui? Lo sa. Io so che lui sa. Lui sa che io so. È un equilibrio.",
    ],
    chiacchiere: [
      "Ho studiato filosofia a Goodthought. Poi ho capito che la risposta era: dormire nel fieno. Ho lasciato l'università.",
      "Diogene viveva in una botte. Io in un fienile. È un passo avanti: c'è più spazio.",
      "Le nutrie sono le uniche creature libere della Bassa. Non pagano l'IMU.",
      "Tu zappi per vivere, Garonio, o vivi per zappare? Non rispondere. Zappa.",
    ],
  },
  wanda: {
    nome: 'La Wanda parrucchiera', ruolo: 'Ha pettinato tre generazioni del paese. E le ha ascoltate tutte.',
    posti: [{ ore: [9, 19], interno: 'casa-rosa', x: 2.2, z: 2.4 }],
    aspetto: { sprite: 'bionda_rosa', w: 16, h: 24, skin: '#f0c8a8', hair: '#e8c050', hairStyle: 'long', shirt: '#e88aa8', pants: '#4a2a4a', boots: '#2a1a1a', eyes: 'normal' },
    amicizia: [0, 100, 20],
    saluti: [
      "Tesoro, quei capelli sono una richiesta d'aiuto. Siediti.",
      "Garonio! Taglio, piega o confessione? Faccio tutte e tre, la confessione è gratis.",
      "Hai il ciuffo del Gigante. È una condanna di famiglia. Si può curare.",
    ],
    chiacchiere: [
      "La Sciura Ines viene il giovedì. Il venerdì tutto il paese sa quello che ha detto. Merito mio.",
      "Il Sindaco si tinge i capelli. Non lo dire a nessuno. Lo sanno già tutti.",
      "Il Gigante è venuto una volta, nel 1991. Ha detto «corti». Gliel'ho fatti corti. Non è più tornato. Credo sia contento.",
    ],
    sulleRagazze: ["La {ragazza}? Viene da me. Ti dico solo una cosa: le piacciono gli uomini pettinati. Siediti."],
  },
  gaetano: {
    nome: 'Il Gaetano', ruolo: 'Marito della Sciura Ines. Guarda la TV dal 1987. La Ines parla anche per lui.',
    posti: [{ ore: [6, 23], interno: 'casa-azzurra', x: 4.3, z: 3.9 }],
    aspetto: { sprite: 'anziano_coppola', w: 16, h: 22, skin: '#e8b48a', hair: '#d8d8d8', hairStyle: 'flat', shirt: '#6a6a7a', pants: '#3a3a42', boots: '#2a1a1a', eyes: 'normal' },
    amicizia: [0, 100, 15],
    saluti: [
      "Shh! C'è il quiz! ...Risposta C. È sempre la C.",
      "Ah, il figlio del Gigante. La Ines è fuori. Siediti, parla piano, goditi il silenzio.",
      "Non dire alla Ines che sono stato sveglio. Lei pensa che dorma. È il nostro accordo.",
    ],
    chiacchiere: [
      "Siamo sposati da sessantadue anni. Lei parla, io annuisco. Il segreto è annuire.",
      "Una volta ho detto «no» alla Ines. Era il 1974. Me lo ricorda ancora.",
      "Quando la Ines è in paese, io sono l'uomo più libero della Bassa. Per tre ore.",
    ],
  },
  ornella: {
    nome: 'L\'Ornella', ruolo: 'Moglie del Potato. Cucina le patate in 47 modi e ne inventa uno ogni domenica.',
    posti: [{ ore: [6, 22], interno: 'cascina-patata', x: 3.4, z: 1.1 }],
    aspetto: { sprite: 'contadina_cesto', w: 16, h: 23, skin: '#e8b48a', hair: '#5a3a2a', hairStyle: 'bun', shirt: '#c8a040', pants: '#5a4a3a', boots: '#3a2a1a', belly: true, eyes: 'normal' },
    amicizia: [0, 100, 30],
    saluti: [
      "Garonio! Hai fame? Ho fatto le patate. Lesse, fritte, al forno, ripiene di patate.",
      "Il mio Potato è nei campi. Parla con le piante. Loro gli rispondono meglio di me.",
      "Entra, entra, ma pulisci gli stivali. Qui si mangia per terra. No, scherzo. Quasi.",
    ],
    chiacchiere: [
      "Abbiamo dato un nome a ogni patata. Quest'anno siamo arrivati a Zaccaria Secondo.",
      "Il tuo papà e il mio Potato litigano da quarant'anni per un metro di fosso. È la loro amicizia.",
      "Una volta abbiamo mangiato la pasta. Il Potato ha pianto. Non lo rifaremo.",
    ],
  },
  mirella: {
    nome: 'La Mirella', ruolo: 'Moglie del Postman. Smista la posta del paese sul tavolo di cucina.',
    posti: [{ ore: [7, 21], interno: 'cascina-postino', x: 4.6, z: 2.8 }],
    aspetto: { sprite: 'sciura', w: 16, h: 22, skin: '#f0c8a8', hair: '#8a5a3a', hairStyle: 'bun', shirt: '#4a6ab8', pants: '#3a3a4a', boots: '#2a1a1a', eyes: 'normal' },
    amicizia: [0, 100, 25],
    saluti: [
      "Garonio! C'è una lettera per te. Del 2021. È ancora valida, credo.",
      "Il mio uomo è in giro col furgone. Io smisto. Lui consegna. Ogni tanto.",
      "Non guardare le lettere, sono private. Ma se vuoi ti dico cosa c'è scritto.",
    ],
    chiacchiere: [
      "Le bollette le consegniamo dopo la scadenza. Così la gente si arrabbia una volta sola.",
      "Mister Frank riceve pacchi dall'America. Dentro ci sono stivali. Sempre stivali. Ha due piedi.",
      "La Pina scrive lettere anonime. Le riconosco dalla calligrafia. E dal profumo di Nutella.",
    ],
  },
  billybob: {
    nome: 'Billy Bob', ruolo: 'Nipote americano di Mister Frank. Suona il banjo, non ha mai visto una mucca prima.',
    posti: [{ ore: [8, 24], interno: 'ranch-frank', x: 5.6, z: 1.0 }],
    aspetto: { sprite: 'chitarrista', w: 16, h: 23, skin: '#f0c8a8', hair: '#d8a040', hairStyle: 'flat', shirt: '#c83a2a', pants: '#3a4a7a', boots: '#6a3a1a', eyes: 'normal' },
    amicizia: [0, 100, 20],
    saluti: [
      "Howdy, partner! Cioè, ciao. Lo zio dice che devo parlare italiano. I'm trying!",
      "Ehi Garonio! Ti suono una canzone? Parla di una nutria triste. Very sad.",
      "In Texas tutto è più grande. Qui tutto è più umido.",
    ],
    chiacchiere: [
      "Lo zio Frank dice che la Bassa è come il Texas. Ma con la nebbia. E il risotto. And no cowboys, except him.",
      "Ho provato il gorgonzola. Ho chiamato la mamma. Ho pianto. It was beautiful.",
      "Your father, the Giant? He is scary. In Texas lo eleggerebbero governatore.",
    ],
    sulleRagazze: ["La {ragazza}? She's a ten, partner! Portala al rodeo. Cioè, alla sagra."],
  },
  zaira: {
    nome: 'La Zaira', ruolo: 'Sorella del Vecchio Camper. Fa tisane per tutto e legge il futuro nei fondi.',
    posti: [{ ore: [7, 23], interno: 'cascina-oglio', x: 6.0, z: 2.2 }],
    aspetto: { sprite: 'hippie', w: 16, h: 24, skin: '#e8b48a', hair: '#9a9a9a', hairStyle: 'long', shirt: '#8a5aa8', pants: '#5a7a4a', boots: '#3a2a1a', eyes: 'normal' },
    amicizia: [0, 100, 25],
    saluti: [
      "Garonio. Ti aspettavo. Non è vero, ma fa effetto dirlo.",
      "Tisana? Ho quella per lo stress, quella per il sonno e quella per tuo padre. L'ultima è molto forte.",
      "Mio fratello è al fiume. Parla coi pesci. Io parlo con le erbe. In famiglia siamo così.",
    ],
    chiacchiere: [
      "Nei fondi della tua tisana vedo... un trattore. E un uomo che urla. È il futuro o è il passato? Con te è uguale.",
      "La camomilla dell'Oglio fa dormire anche i lupi. L'ho provata su un lupo. Dorme ancora.",
      "Il fiume porta via tutto. Anche le preoccupazioni. E le ciabatte del Camper.",
    ],
  },
  kevin: {
    nome: 'Kevin Rodella', ruolo: 'Il nipote di Mister Rodella. Fa il marketing. Nessuno sa cosa voglia dire.',
    posti: [{ ore: [8, 19], interno: 'consorzio', x: 7.6, z: 1.0 }],
    aspetto: { sprite: 'felpa_cappellino', w: 16, h: 24, skin: '#f0c8a8', hair: '#2a2a2a', hairStyle: 'flat', shirt: '#2a6a3a', pants: '#2a2a3a', boots: '#e8e8e8', eyes: 'normal' },
    amicizia: [0, 100, 15],
    saluti: [
      "Ciao Garonio! Sei un cliente o un lead? Scherzo. Sei un lead.",
      "Benvenuto nell'esperienza Consorzio Rodella! Ti va di lasciare una recensione a cinque stelle? Anche sei.",
      "Lo zio dice che il marketing non serve. Poi mi chiede di fare i volantini. Coerenza.",
    ],
    chiacchiere: [
      "Ho aperto la pagina Instagram del Consorzio. Abbiamo 14 follower. 12 sono zii.",
      "Il nostro slogan nuovo è: «Rodella: il mangime che parla al tuo maiale». Lo zio dice che i maiali non leggono.",
      "Ho proposto il trattore in abbonamento. Lo zio ha detto che si chiama «rate» e si fa dal 1962.",
    ],
  },
  ottavio: {
    nome: 'Il Capo Guardia Ottavio', ruolo: 'Capo delle Guardie del Parco Oglio. Trent\'anni di servizio, zero animali presi.',
    posti: [{ ore: [7, 24], interno: 'casotto-guardie', x: 4.8, z: 1.0 }],
    aspetto: { sprite: 'escursionista', w: 16, h: 24, skin: '#d8a878', hair: '#5a5a5a', hairStyle: 'flat', shirt: '#4a6a3a', pants: '#4a4a3a', boots: '#3a2a1a', eyes: 'normal' },
    amicizia: [0, 100, 10],
    saluti: [
      "Documenti. No, scherzo. Ma tienili pronti.",
      "Garonio. Il parco ti osserva. Io osservo il parco. Il parco osserva me. È un triangolo.",
      "Siediti, ma non sulla sedia rossa: è per i sequestri.",
    ],
    chiacchiere: [
      "In trent'anni ho multato quattro cacciatori, due pescatori e un'anatra. L'anatra ha fatto ricorso.",
      "Di notte nel parco succedono cose. Io di notte dormo. È un metodo.",
      "Il Vecchio Camper pesca senza licenza dal 1979. Ha più anzianità di me.",
    ],
  },
  tonino: {
    nome: 'Il Tonino mungitore', ruolo: 'Munge le mucche del Gigante da quando c\'era la lira. Canta per loro.',
    posti: [{ ore: [5, 10], interno: 'stalla', x: 11.4, z: 2.6 }, { ore: [16, 20], interno: 'stalla', x: 11.4, z: 2.6 }],
    aspetto: { sprite: 'contadino_salopette', w: 16, h: 23, skin: '#d8a878', hair: '#3a2a1a', hairStyle: 'flat', shirt: '#e8e0c8', pants: '#3a5a8a', boots: '#3a2a1a', eyes: 'normal' },
    amicizia: [0, 100, 20],
    saluti: [
      "Ciao Garonio. Abbassa la voce: la Carolina è sensibile.",
      "Le mucche vanno munte con amore. E con le mani calde. Soprattutto con le mani calde.",
      "Vuoi imparare? Prima regola: non dalla parte dei calci.",
    ],
    chiacchiere: [
      "Canto «Romagna mia» alla Carolina e fa due litri in più. Con «Volare» ne fa tre.",
      "Tuo padre ha provato la mungitrice automatica. La Gertrude l'ha presa a calci. Siamo tornati alle mani.",
      "Ernesto non è una mucca. Te lo dico perché il Gigante ci ha provato, una volta, al buio.",
    ],
  },
};

// ---------------------------------------------------------------------
//  MISSIONI (formato di src/data/secondarie.js)
// ---------------------------------------------------------------------
export const MISSIONI_DENTRO = {
  sindaco_sagra: {
    da: 'sindaco', titolo: 'La polenta della sagra',
    offerta: "Garonio! Sabato c'è la sagra e manca il mais per la polenta. Mi porti 5 pannocchie? Le inauguro io, prima di cuocerle.",
    obiettivo: { consegna: { mais: 5 } },
    premio: { soldi: 80, xp: 20, amicizia: { sindaco: 10 } },
    grazie: "Perfette! Taglio il nastro sulla prima pannocchia. Clic, clic. Fatto. Ecco i soldi del Comune. Non dirlo all'opposizione.",
    scusa: "Cinque pannocchie, Garonio. Il Comune conta. Male, ma conta.",
  },
  cavilli_archivio: {
    da: 'cavilli', titolo: 'I topi dell\'archivio',
    offerta: "Nell'archivio i topi si stanno mangiando i certificati di nascita. Tra poco nessuno sarà mai nato. Ne scacci 4? Le faccio un timbro gratis.",
    obiettivo: { evento: 'nemicoSconfitto', filtro: { id: 'ratto' }, n: 4 },
    premio: { soldi: 45, xp: 18, oggetti: { trappola: 2 }, amicizia: { cavilli: 12 } },
    grazie: "Benissimo. Ecco: TIMBRO. Le ho certificato che è una persona utile. È la prima volta che lo scrivo.",
    requisiti: { giorno: 2 },
  },
  rosy_gazze: {
    da: 'rosy', titolo: 'Le gazze dei Gratta e Vinci',
    offerta: "Le gazze mi rubano i Gratta e Vinci dalla vetrina! Luccicano, capisci. Scacciane 3 e ti regalo un biglietto. Fortunato. Forse.",
    obiettivo: { evento: 'nemicoSconfitto', filtro: { id: 'gazza' }, n: 3 },
    premio: { soldi: 50, xp: 15, amicizia: { rosy: 10 } },
    grazie: "Grazie bello! Il biglietto l'ho grattato io per controllare. Non vinceva. Tieni i soldi, va'.",
  },
  rina_pomodori: {
    da: 'rina', titolo: 'I pomodori per la Rina',
    offerta: "I pomodori del grossista sanno di cartone. Me ne porti 5 dei tuoi? Li vendo come «nostrani». Lo sono, quindi non è nemmeno una bugia.",
    obiettivo: { consegna: { pomodoro: 5 } },
    premio: { soldi: 40, xp: 12, oggetti: { panino: 3 }, amicizia: { rina: 10 } },
    grazie: "Ah, questi sì che sono pomodori! Tieni, tre panini col salame. Quello buono, non quello per i turisti.",
    scusa: "Cinque, Garonio. Con quattro faccio solo il sugo per me.",
  },
  filosofo_domanda: {
    da: 'filosofo', titolo: 'La Grande Domanda',
    offerta: "Ho una domanda per Don Peppino: «Se Dio è ovunque, è anche nel fienile?». Vai a chiederglielo. Io non esco, fuori c'è troppa realtà.",
    obiettivo: { parla: 'donPeppino' },
    torna: true,
    premio: { xp: 25, oggetti: { grappa: 1 }, amicizia: { filosofo: 15, donPeppino: 3 } },
    grazie: "«Sì, ma paga l'affitto», ha detto? Profondo. Molto profondo. Tieni, la grappa della meditazione.",
  },
  wanda_piume: {
    da: 'wanda', titolo: 'Piume per la Wanda',
    offerta: "Sto inventando l'acconciatura «Gazza Ladra»: mi servono 3 piume di gazza. Le trovi addosso alle gazze. Che non le danno volentieri.",
    obiettivo: { consegna: { piuma: 3 } },
    premio: { soldi: 35, xp: 15, amicizia: { wanda: 12 } },
    grazie: "Meravigliose! La Sciura Ines sarà la prima. Non lo sa ancora. Tieni, e passa per un taglio gratis. No, a pagamento. Ma con amore.",
    scusa: "Tre piume, tesoro. Con due viene un'acconciatura «Piccione».",
  },
  gaetano_grappa: {
    da: 'gaetano', titolo: 'La grappa del Gaetano',
    offerta: "Ragazzo. Senti. La Ines ha nascosto la grappa. Me ne porti una? Di nascosto. Se te lo chiede, sei venuto per il centrino.",
    obiettivo: { consegna: { grappa: 1 } },
    premio: { soldi: 30, xp: 15, oggetti: { cartolina: 1 }, amicizia: { gaetano: 15 } },
    grazie: "Bravo ragazzo. Tieni, una cartolina di quando sono stato a Rimini. Senza la Ines. Era il 1987. Il più bel giorno della mia vita.",
    scusa: "La grappa, ragazzo. Il Bubetto ce l'ha. O il bar. Sbrigati, la Ines torna alle sette.",
  },
  ornella_uova: {
    da: 'ornella', titolo: 'Il tortino della domenica',
    offerta: "Domenica faccio il tortino di patate. Mi mancano le uova: me ne porti 6? Le nostre galline sono in sciopero.",
    obiettivo: { consegna: { uova: 6 } },
    premio: { xp: 15, oggetti: { tortaMele: 1, patata: 3 }, amicizia: { ornella: 10, patata: 4 } },
    grazie: "Grazie caro! Tieni, una torta di mele. L'ho fatta con le mele, sì. Per una volta. E tre patate per il viaggio.",
    scusa: "Sei uova, caro. Con meno viene un tortino triste.",
  },
  mirella_lettera: {
    da: 'mirella', titolo: 'La lettera per Mister Frank',
    offerta: "C'è una lettera per Mister Frank. Dall'America. È qui dal mese scorso. Gliela porti? Il mio uomo dice che domani. Lo dice da un mese.",
    obiettivo: { parla: 'frank' },
    torna: true,
    premio: { soldi: 25, xp: 12, amicizia: { mirella: 10, frank: 5 } },
    grazie: "Gliel'hai data? Bravo. Era la bolletta del ranch del 2023. Speriamo l'abbia presa bene.",
  },
  billybob_nutrie: {
    da: 'billybob', titolo: 'Il banjo di Billy Bob',
    offerta: "Partner, the nutrias ate my banjo strings! Le nutrie mi hanno mangiato le corde. Ne scacci 6? Ti dedico una canzone.",
    obiettivo: { evento: 'nemicoSconfitto', filtro: { id: 'nutria' }, n: 6 },
    premio: { soldi: 60, xp: 20, amicizia: { billybob: 15, frank: 5 } },
    grazie: "Yeehaw! Ecco la canzone: «Garonio, Garonio, the nutria slayer of the Bassa...». Rima male, ma è sincera. E tieni dei dollari. Cioè euro.",
  },
  zaira_legna: {
    da: 'zaira', titolo: 'Legna per la stufa della Zaira',
    offerta: "La stufa ha fame. Mi porti 3 pezzi di legna di pioppo dal Parco? Quella del pioppo fa un fuoco che parla.",
    obiettivo: { consegna: { legna: 3 } },
    premio: { soldi: 30, xp: 15, oggetti: { pozione: 1 }, amicizia: { zaira: 12, camper: 4 } },
    grazie: "Senti come crepita? Dice grazie. Tieni, una tisana speciale. Non chiedere cosa c'è dentro. Nemmeno io lo so più.",
    scusa: "Tre pezzi, Garonio. Due fanno solo fumo e tristezza.",
  },
  kevin_cliente: {
    da: 'kevin', titolo: 'Il cliente fidelizzato',
    offerta: "Ho bisogno di dati! Fai 3 acquisti o ritiri dallo zio Rodella (anche i semi gratis contano) e ti faccio una carta fedeltà. Di cartone, ma plastificata.",
    obiettivo: { evento: 'consorzio', filtro: {}, n: 3 },
    premio: { soldi: 50, xp: 15, oggetti: { mangimeGold: 1 }, amicizia: { kevin: 12, rodella: 5 } },
    grazie: "Dati raccolti! Sei il nostro cliente numero uno. Anche l'unico profilato. Tieni, un sacco di Mangime Gold: è un omaggio. Lo zio non lo sa.",
  },
  ottavio_cartelli: {
    da: 'ottavio', titolo: 'I cartelli del parco',
    offerta: "Qualcuno svita i cartelli «VIETATO» del parco. Riportamene 2. Se li trovi addosso a qualche mostro, non fare domande. Io non le faccio mai.",
    obiettivo: { consegna: { cartello: 2 } },
    premio: { soldi: 70, xp: 25, amicizia: { ottavio: 15 } },
    grazie: "Eccoli! Adesso li riavvito. Domani li risvitano. È il ciclo della vita del parco.",
    scusa: "Due cartelli, Garonio. Uno solo vieta a metà.",
  },
  tonino_stalla: {
    da: 'tonino', titolo: 'Apprendista mungitore',
    offerta: "Vuoi imparare il mestiere? Occupati 5 volte degli animali della stalla: mungi, tosa, striglia. Poi ti do il mio diploma. L'ho disegnato io.",
    obiettivo: { evento: 'azione', filtro: { tipo: 'stalla' }, n: 5 },
    premio: { soldi: 40, xp: 20, oggetti: { latte: 3 }, amicizia: { tonino: 12 } },
    grazie: "Bravo! Le mucche ti hanno accettato. La Gertrude no, ma lei non accetta nessuno. Tieni, tre litri di latte. Della Carolina, il migliore.",
  },
};

// ---------------------------------------------------------------------
//  AZIONI DEI MOBILI (testi e piccoli effetti)
// ---------------------------------------------------------------------
export const AZIONI_DENTRO = {
  'municipio:attesa': { t: ["Prendi il numero: 48. Sul tabellone: 3. Ti siedi. Passa mezz'ora. Sul tabellone: 3.", "Accanto a te una signora aspetta dal 2019. È diventata amica dell'usciere."], effetto: { minuti: 20, stress: 3 } },
  'municipio:albo': { t: ["Albo pretorio: «Avviso: è vietato dar da mangiare ai piccioni. Firmato: il Generale Piccione». Qualcuno ha fatto uno scherzo.", "«Ordinanza n. 12: è vietato il rumore dopo le 22, eccetto il Gigante.» C'è scritto proprio così.", "«Cercasi assessore alla nebbia. Requisiti: saper vedere a un metro.»"] },
  'municipio:archivio': { t: ["Faldone «NATI 1974». Trovi il certificato del Gigante. Peso alla nascita: «tanto».", "Faldone «MATRIMONI». Uno è annullato per «la sposa era un trattore». Nessuno ricorda come.", "Faldone «MULTE». È più alto di te."] },
  'municipio:tavolo': { t: ["Sul tavolo: un cartello «SILENZIO» e sotto, a penna: «tranne il Sindaco».", "Un registro delle presenze. Ultimo lettore: «il Filosofo del fienile, 14 volte questo mese»."] },
  'municipio:scatoloni': { t: ["Dentro: il plastico della rotonda promessa nel 2003. Bellissimo. Mai fatto.", "Dentro: trecento spillette «VOTA FUMAGALLI». Ne prendi una. Poi la rimetti: hai una dignità."] },
  'municipio:ritratto': { t: ["Il Sindaco da giovane: stessi baffi, più capelli. I capelli sono veri, i baffi no.", "Sotto il ritratto: «Inaugurato dal Sindaco». Si è inaugurato da solo."] },
  'municipio:scrivania': { t: ["Sulla scrivania: un nastro tricolore, delle forbici e un timbro con scritto «SÌ».", "Una cartellina «PROGETTI»: dentro c'è solo un menu della pizzeria."] },
  'tabacchi:giornali': { t: ["«La Gazzetta della Bassa»: in prima pagina il Gigante che solleva un trattore. Foto del 1989. La rimettono ogni anno.", "Titolo: «Nebbia fitta in pianura». È il titolo di ogni giorno da ottobre ad aprile.", "Pagina dei necrologi, pagina dello sport, pagina della Pina. La Pina ha una pagina."] },
  'tabacchi:lotto': { t: ["I ritardatari: il 47 manca da 120 estrazioni. Il Bepi l'ha giocato tutte e 120 le volte.", "«Sogni e numeri»: sognare un maiale = 17. Sognare il Gigante = 90, la paura."] },
  'tabacchi:macchinetta': { t: ["Metti un euro. Esce una caramella alla liquirizia del 2008. Ha il sapore della nostalgia.", "Esce una gomma da masticare a forma di trattore. Stress −3."], costo: 1, effetto: { stress: -3 } },
  'alimentari:scaffali': { t: ["Conserve, sottaceti e un barattolo di «giardiniera della nonna». La nonna di chi, non si sa.", "Un barattolo di sugo della Rina. Sull'etichetta: «Fatto con amore e pomodori del Garonio». Sono i tuoi."] },
  'alimentari:salami': { t: ["Sette salami appesi. Ognuno ha un nome. Uno si chiama Gigante: è il più grosso e il più stagionato.", "I salami oscillano. C'è corrente, o hanno paura di te."] },
  'alimentari:frigo': { t: ["Grana, gorgonzola e una formaggella che si muove da sola. «È viva», dice la Rina. «Come deve essere.»"] },
  'alimentari:frutta': { t: ["Una mela ti cade in mano. La Rina: «Quella è omaggio. Le altre no.»"], oggetti: { mela: 1 }, unaAlGiorno: true, giaFatto: "La Rina ti guarda: «Una al giorno toglie il medico di torno. Due tolgono a me il guadagno.»" },
  'fienile:attrezzi': { t: ["Forconi arrugginiti, un rastrello senza denti e una falce con scritto «NON TOCCARE — G.». G. sta per Gigante.", "C'è anche il tuo primo rastrellino, di quando avevi sei anni. Il Gigante l'ha tenuto. Non dirà mai perché."] },
  'fienile:botte': { t: ["Dentro la botte: libri di filosofia, una candela, e una scatola di biscotti della Mamma. La Mamma lo sa, allora.", "«Kant», «Nietzsche», «Il manuale del trattorista 1982». Il Filosofo li legge tutti allo stesso modo."] },
  'casa-rosa:shampoo': { t: ["La Wanda ti lava i capelli. Acqua calda, massaggio, canzone di Mina. Stress −8.", "Lo shampoo «Fieno di Montagna». Ora profumi di fienile. Come prima, ma con intenzione."], effetto: { stress: -8 }, unaAlGiorno: true, giaFatto: "«Due shampoo al giorno ti fanno cadere i capelli, tesoro. E il portafoglio.»" },
  'casa-rosa:riviste': { t: ["«Novella Bassa»: «Il Conte e la Contessa: crisi?». Non c'è nessuna Contessa.", "Rivista del 1996: «I 10 tagli dell'estate». Il quarto è il tuo, di adesso."] },
  'casa-rosa:poster': { t: ["«Acconciature 1989»: cotonature alte come il campanile. La Wanda le sa fare ancora tutte. Minaccia di farle."] },
  'casa-azzurra:tv': { t: ["Il quiz: «Qual è la capitale della Mongolia?». Il Gaetano: «C!». Non ci sono opzioni. Ha ragione lo stesso.", "Telenovela: lei scopre che lui è suo fratello. Il Gaetano non batte ciglio: l'ha già vista nel '92."], effetto: { stress: -3, minuti: 15 } },
  'casa-azzurra:credenza': { t: ["Centoquaranta bomboniere. Una per ogni matrimonio del paese dal 1961. Anche quelli finiti male.", "Una bomboniera a forma di trattore. Era del matrimonio del Gigante. La Ines non la usa mai: «porta male»."] },
  'casa-azzurra:foto': { t: ["1961: la Ines sorride e il Gaetano anche. È l'ultima volta documentata che il Gaetano sorride."] },
  'casa-azzurra:centrino': { t: ["Il centrino è perfetto. Lo sposti di un centimetro. Da qualche parte in paese, la Ines sente un brivido."] },
  'cascina-patata:pentola': { t: ["Patate che bollono. L'Ornella: «Quelle sono Gino e Pina. Le mangiamo stasera. Le salutiamo.»"] },
  'cascina-patata:tavola': { t: ["Sulla tovaglia c'è ricamato «Dio benedica la patata». E sotto, più piccolo: «e il Potato»."] },
  'cascina-patata:quadro': { t: ["Il Potato nel 1998 con la Patata d'Oro: due chili e tre. Lui sorride. La patata, sembra, anche."] },
  'cascina-patata:patate': { t: ["Ogni sacco ha un cartellino: «Famiglia Rossi», «Famiglia Verdi», «Ugo (da solo)».", "Prendi una patata. L'Ornella: «Quella è Ernesto. Trattalo bene.»"], oggetti: { patata: 1 }, unaAlGiorno: true, giaFatto: "«Una patata al giorno, Garonio. Siamo generosi, non pazzi.»" },
  'cascina-postino:casellario': { t: ["Lettere per tutto il paese. Una è per te: «Cartolina da Rimini». Il timbro è del 2019.", "Una busta con scritto «URGENTE». Data: 2016. È ancora qui. Era urgente."] },
  'cascina-postino:timbri': { t: ["Un timbro con scritto «RESPINTO». La Mirella lo usa per le bollette del suo uomo."] },
  'cascina-postino:pacchi': { t: ["Un pacco per il Conte, «fragile». Fa un rumore di cocci. Era fragile.", "Un pacco per Mister Frank. Stivali. Lo sai senza aprirlo. Lo sanno tutti."] },
  'cascina-postino:calendario': { t: ["Calendario delle Poste 2007. Il mese di aprile: un francobollo con un'anatra. È fermo lì da diciassette anni."] },
  'ranch-frank:bancone': { t: ["Billy Bob ti versa un «whiskey» del ranch. È succo di mela. Frank non lo sa.", "Sul bancone: una foto di Frank a Dallas nel 1985. Ha gli stessi stivali di oggi."], effetto: { stress: -4 }, unaAlGiorno: true, giaFatto: "«Easy, partner. Un succo al giorno.»" },
  'ranch-frank:corna': { t: ["Le corna di un toro. Frank dice che l'ha preso a mani nude. Billy Bob dice che l'ha comprato su eBay."] },
  'ranch-frank:jukebox': { t: ["Parte «Take me home, country roads». Billy Bob piange. Fuori, un maiale canta.", "Parte una canzone in inglese su un cowboy che perde il cavallo. Ti senti capito."], costo: 1, effetto: { stress: -6 } },
  'ranch-frank:poker': { t: ["Sul tavolo, una partita a poker interrotta. Le carte di Frank: quattro assi. Le altre: quattro assi. Il mazzo è truccato da entrambe le parti."] },
  'ranch-frank:sella': { t: ["Ti siedi sulla sella. Da fuori, la voce di Frank: «GET OFF MY SADDLE!». Come ha fatto a saperlo?"] },
  'cascina-oglio:stufa': { t: ["La stufa scoppietta. Ti scaldi le mani. Stanchezza −5.", "Sulla stufa bolle una pentola. Pesce. Erbe. Qualcosa che ti guarda."], effetto: { tired: -5 } },
  'cascina-oglio:libri': { t: ["«I pesci dell'Oglio e i loro sentimenti», volume II. Il volume I è andato nel fiume.", "«Come parlare ai lucci», scritto a mano. Capitolo 1: «Non parlare ai lucci»."] },
  'cascina-oglio:tisane': { t: ["La Zaira ti versa una tisana: menta, sambuco e «un segreto». Stress −10.", "La tisana sa di fiume. La Zaira dice che è il bello."], effetto: { stress: -10 }, unaAlGiorno: true, giaFatto: "«Una tisana al giorno, Garonio. Con due inizi a vedere i pesci che parlano.»" },
  'cascina-oglio:canne': { t: ["Le canne da pesca del Camper. Una ha cinquant'anni e un nome: «La Vedova»."] },
  'consorzio:sacchi': { t: ["«Mangime Super Maiale. Con vitamine, minerali e un buono sconto per il prossimo sacco.»", "Un sacco dice «NUOVA FORMULA». Sotto, scritto piccolo: «stessa di prima»."] },
  'consorzio:cassa': { t: ["Alla cassa un cartello: «Si accettano contanti, assegni e promesse (solo dal Potato)».", "Un registratore di cassa del 1978. Fa «DLIN» così forte che le galline fuori depongono per lo spavento."] },
  'consorzio:semi': { t: ["Bustine di semi: zucchine, insalata, peperoni. Su una c'è scritto «Pomodoro Rodella F1: il pomodoro che si vende da solo».", "Per i semi gratis devi parlare con Mister Rodella, fuori. Kevin dice: «Fuori c'è l'esperienza cliente»."] },
  'consorzio:catalogo': { t: ["Catalogo trattori: il Rodellino blu e il Testa Calda arancione. A pagina 3 c'è una foto di Rodella che abbraccia un trattore.", "Un volantino di Kevin: «Trattore + mangime + un selfie con lo zio: pacchetto Premium»."] },
  'consorzio:organigramma': { t: ["Presidente: Rodella. Vice: Rodella. Marketing: Rodella (Kevin). Magazzino: Rodella (cugino). Clienti: Potato."] },
  'casotto-guardie:verbali': { t: ["Verbale n. 1: «Anatra in sosta vietata». Verbale n. 2: «La stessa anatra, recidiva».", "Un verbale contro «ignoto, probabilmente il Vecchio Camper». È del 1983."] },
  'casotto-guardie:mappa': { t: ["La mappa del Parco Oglio. Una zona ha scritto «QUI NON SI VA». Sotto, a matita: «ci sono andato. sconsiglio»."] },
  'casotto-guardie:binocoli': { t: ["Guardi dal binocolo: vedi un airone, un pescatore abusivo e il Vecchio Camper che ti saluta. Ti ha visto prima lui."] },
  'casotto-guardie:caffe': { t: ["La macchinetta fa un caffè che sa di stivale. Stanchezza −15."], costo: 1, effetto: { tired: -15 } },
  'casotto-guardie:sequestri': { t: ["Nella cassa dei sequestri: tre canne da pesca, una fionda e un nano da giardino. Il nano non si sa perché."] },
  'stalla:fieno': { t: ["Fieno buono, di primo taglio. Una mucca allunga il collo e te lo ruba di mano."] },
  'stalla:secchio': { t: ["Il secchio del Tonino. Ha scritto sopra: «Carolina». Ognuno ha il suo secchio, è una questione di rispetto."] },
  'stalla:turni': { t: ["Turni di mungitura: «Tonino, Tonino, Tonino, Tonino». Domenica: «Tonino (forse)»."] },
  'capannone2:sacchi': { t: ["Mangime del 2016. Il gatto ci dorme sopra da allora. È più suo che del Gigante."] },
  'capannone2:cassa': { t: ["Apri la cassa misteriosa: dentro c'è un'altra cassa. Dentro, un biglietto: «Ciao Garonio. Papà.» Il Gigante sapeva che l'avresti aperta.", "Dentro la cassa: un pezzo di ricambio. Lo prendi. Nessuno lo saprà. Il gatto sì."], oggetti: { rottame: 1 }, unaAlGiorno: true, giaFatto: "La cassa è vuota. C'è solo il biglietto: «Ancora tu? Papà.»" },
  'salici-casa:camino': { t: ["Accendi il camino. Il fumo esce dalla canna fumaria. È la prima volta dal 2014: la canna tossisce.", "Il fuoco scoppietta. È casa tua. Stress −6."], effetto: { stress: -6 }, unaAlGiorno: true, giaFatto: "Il camino è già acceso. Brucia anche le tue preoccupazioni, ma una volta al giorno." },
  'salici-casa:trofei': { t: ["Le coccarde del Concilio del Gambalone. Più sono, più il Gigante borbotta."] },
  'salici-porcilaia:mangime': { t: ["I maiali sentono il fruscio del sacco e urlano tutti insieme. È il coro più sincero della Bassa."] },
  'salici-pollaio:nidi': { t: ["Nei nidi ci sono le uova di stanotte. Le raccoglie il garzone, o finiscono nel magazzino da sole. Il pollaio è autonomo.", "Una gallina non si alza dal nido. Ti guarda. Esci tu."] },
};

// animali dentro
export const COMPARSE = {
  stalla: [{ sprite: 'mucca', x: 1.8, z: 1.8, w: 1.7 }, { sprite: 'mucca', x: 5.0, z: 1.8, w: 1.7 }, { sprite: 'asino', x: 8.2, z: 1.8, w: 1.3 }, { sprite: 'pecora', x: 6.0, z: 4.6, w: 1.0 }],
  capannone2: [{ sprite: 'gatto', x: 1.4, z: 1.7, w: 0.7 }],
  fienile: [{ sprite: 'gatto', x: 2.8, z: 1.9, w: 0.7 }, { sprite: 'gallina', x: 6.8, z: 4.6, w: 0.6 }],
  'ranch-frank': [{ sprite: 'cane', x: 2.0, z: 4.6, w: 0.9 }],
  'cascina-patata': [{ sprite: 'gatto', x: 6.4, z: 4.8, w: 0.7 }],
  'salici-stalla': [{ sprite: 'mucca', x: 2.0, z: 1.8, w: 1.7, struttura: 'stalla', lv: 1 }, { sprite: 'mucca', x: 5.6, z: 1.8, w: 1.7, struttura: 'stalla', lv: 2 },
    { sprite: 'mucca', x: 8.6, z: 4.4, w: 1.7, struttura: 'stalla', lv: 3 }, { sprite: 'mucca', x: 3.6, z: 4.6, w: 1.7, struttura: 'stalla', lv: 4 }],
  'salici-porcilaia': [{ sprite: 'maiale', x: 1.8, z: 1.8, w: 1.05, struttura: 'porcilaia', lv: 1 }, { sprite: 'maiale', x: 5.1, z: 1.8, w: 1.05, struttura: 'porcilaia', lv: 2 },
    { sprite: 'maiale', x: 8.4, z: 1.8, w: 1.05, struttura: 'porcilaia', lv: 3 }, { sprite: 'maiale', x: 4.0, z: 2.4, w: 1.05, struttura: 'porcilaia', lv: 4 }],
  'salici-pollaio': [{ sprite: 'gallina', x: 1.0, z: 2.2, w: 0.6, struttura: 'pollaio', lv: 1 }, { sprite: 'gallina', x: 2.4, z: 3.4, w: 0.6, struttura: 'pollaio', lv: 1 },
    { sprite: 'gallina', x: 5.6, z: 2.4, w: 0.6, struttura: 'pollaio', lv: 2 }, { sprite: 'gallina', x: 7.0, z: 3.6, w: 0.6, struttura: 'pollaio', lv: 3 },
    { sprite: 'gallo', x: 4.2, z: 4.4, w: 0.7, struttura: 'pollaio', lv: 4 }],
};

// testi delle azioni speciali (src/dentro.js)
export const TESTI_DENTRO = {
  gratta: { prezzo: 5, max: 5,
    premi: [[0.6, 0, "Gratti. «RITENTA». Gratti l'altro. «RITENTA». La Rosy: «Vedi? Ti dice di ritentare. È un segno.»"],
      [0.3, 10, "Gratti... 10€! La Rosy applaude: «Rigiocali!». Il tuo istinto dice di no. Il tuo istinto ha ragione, per una volta."],
      [0.09, 50, "50€! La Rosy si fa il segno della croce. Il Gino, fuori, si gira di scatto."],
      [0.01, 500, "500€!!! La Rosy sviene. Il Bepi entra di corsa: ha sentito l'odore. Il paese lo saprà prima che tu esca."]],
    finiti: "La Rosy: «Cinque al giorno, bello. Poi è vizio. Il vizio lo lascio a me.»",
    noSoldi: "Il Gratta e Vinci costa 5€. Garonio ha 5 bottoni e una gomma da masticare." },
  spesa: { titolo: 'Alimentari della Rina', lista: [['panino', 5], ['caffe', 2], ['mela', 2], ['pomodoro', 4]],
    benvenuto: "«Cosa ti do, Garonio? Il salame è fresco. Il pane anche. La notizia del giorno è gratis.»",
    fatto: "La Rina incarta {cosa}. «Altro? Una notizia? La Pina ha litigato col prete. Questa era gratis.»",
    noSoldi: "«Il conto, Garonio. Il conto. Non faccio più credito dal 1993: c'è il cartello.»" },
  taglio: { prezzo: 15, stress: -15,
    fatto: ["La Wanda taglia, spunta, pettina. Ti guardi allo specchio: sembri uno che ha una vita in ordine. Stress −15.", "Taglio «Bassa Elegante». La Wanda: «Adesso sì che sei un partito.» Stress −15."],
    gia: "«Tesoro, oggi sei già perfetto. Domani magari no. Torna domani.»",
    noSoldi: "Il taglio costa 15€. La Wanda guarda il portafoglio: «Quello si può tagliare solo a metà.»" },
  baule: { titolo: 'Il baule di Garonio', vuoto: "Il baule è vuoto. Odora di naftalina e di possibilità.",
    dentro: "Nel baule: {lista}.", metti: '📥 Metti nel baule', riprendi: '📤 Riprendi dal baule', quale: 'Cosa metti nel baule?', qualeR: 'Cosa riprendi?',
    messo: '📥 Nel baule: {cosa}.', preso: '📤 Ripreso: {cosa}.', niente: 'Non hai niente da metterci. Le tasche di Garonio sono vuote come le promesse del Sindaco.' },
  letto: { sera: "Il tuo letto, nella tua casa. Nessuno urlerà alle sei. Forse.", giorno: "È presto per dormire. Ma un pisolino si può fare.",
    dormi: '😴 Dormi fino a domattina', pisolino: '💤 Pisolino (un\'ora)', sveglia: "Ti svegli alla Cascina dei Salici. Silenzio. Il gallo canta, ma è il tuo gallo." },
  pisolino: { tired: -30, minuti: 60, fatto: "Ti sdrai. Un'ora di sonno vero, senza il Gigante che urla. Stanchezza −30.", gia: "Hai già fatto il pisolino oggi. Il letto ti guarda come a dire: «stasera».",
    fieno: "Ti butti nel fieno. Il Filosofo ti copre con una coperta. «Dormi, che il mondo aspetta.» Stanchezza −20.", fienoGia: "Il fieno ti punge. Il corpo ha capito: niente secondo pisolino." },
  scheda: "{nome}: livello {lv} di 4. {desc}.",
  schedaNo: "{nome}: non l'hai ancora sistemata. All'Ufficio agricolo, in municipio.",
  conti: "Conti della cascina: in tutto incassati {tot}€. In magazzino ci sono {mag}.",
  biblioteca: { leggi: 'Quale libro prendi?', fine: 'Rimetti il libro sullo scaffale. Esperienza +{xp}: leggere fa bene, dice il Sindaco, che non legge.', xp: 3 },
  municipioChiuso: "Lo sportello è chiuso: sul vetro c'è scritto «Torno alle 8». L'orario è dalle 8 alle 13.",
};

// ---------------------------------------------------------------------
//  BIBLIOTECA COMUNALE (in municipio): libri da leggere. scaffale -> [{ titolo, pagine }]
// ---------------------------------------------------------------------
export const BIBLIOTECA = {
  benvenuto: {
    guide: "Scaffale delle guide. Sul cartello: «Per chi è appena arrivato. O per chi, come Garonio, è qui da sempre e non ha ancora capito.»",
    storia: "Scaffale della storia e dei personaggi. Libri rilegati, foto ingiallite e un album delle sagre dal 1952.",
    mestieri: "Scaffale dei mestieri e degli edifici. Manuali col dorso consumato e un libro di ricette del Bubetto (vietato).",
    segreti: "Lo scaffale proibito. Sulla targhetta: «Leggende della Bassa. Il Comune non si assume responsabilità». Il lucchetto è aperto. È sempre aperto.",
  },
  guide: [
    { titolo: '📘 Come si gioca (per Garonio)', pagine: [
      "Capitolo 1. Ti muovi con le frecce o WASD (o col joystick sul telefono). Con E parli, entri, raccogli e fai le cose. Con J apri il menu: zaino, missioni, abilità, album, record e tutto il resto.",
      "Capitolo 2. Ogni mattina alle 6 il Gigante ti dà la missione del giorno, con un orario. Se la fai: soldi ed esperienza. Se non la fai: arriva Mister Mountain, e la giornata si rifà da capo. Come al cinema, ma senza popcorn.",
      "Capitolo 3. Si gira anche di notte, finché la stanchezza non è piena. Alle 6, se non hai dormito, crolli dove sei. Il Gigante ti trova sempre. Sempre.",
    ] },
    { titolo: '📗 Le tre barre (Vita, Stress, Stanchezza)', pagine: [
      "La Vita scende negli scontri e negli incidenti, e sale mangiando: panini, pomodori, torte, frutta degli alberi. A zero svieni: perdi la giornata e un po' di soldi.",
      "La Stanchezza sale lavorando. Si toglie dormendo, coi pisolini, col caffè. A cento crolli addormentato e passano ore.",
      "Lo Stress è il nemico vero. Sopra 30 sbagli più colpi, sopra 40 guidi male, e i trattori sopra 64 si ingolfano. Si toglie al bar, con la parrucchiera, con le tisane della Zaira, coi trucchi della Mamma. E dormendo.",
    ] },
    { titolo: '📙 Combattere senza piangere', pagine: [
      "Gli scontri sono a turni. Attacca, usa una mossa, un oggetto, difenditi o scappa. Quando un boss «si carica», difenditi: ringrazierai questo libro.",
      "Le uova, le castagne e le pigne si tirano. Fanno male. Le torte e lo zabaione curano. Il caffè sveglia. La grappa... dipende.",
      "Le armi si affilano e si migliorano. Alcune arrivano con un marchio: «della Nonna», «del Diavolo»... Cambiano attacco, difesa o critico. Alla bacheca delle taglie c'è la Pergamena del Fabbro per cambiarlo.",
    ] },
    { titolo: '📕 Livelli e abilità', pagine: [
      "Ogni livello dà punti abilità: forza, resistenza allo stress, fatica, furbizia. La furbizia serve con le truffaldine del Gigante. E con la Vigilessa.",
      "La storia finisce al livello 30 contro Mister Mountain, in 8-10 ore. Poi diventi l'erede: azienda agricola, Concilio del Gambalone, taglie, Notte delle Leggende. Il gioco non finisce. Come il lavoro nei campi.",
    ] },
    { titolo: '📒 Soldi: come farli e come perderli', pagine: [
      "Si guadagna con le missioni, vendendo alla cassa uova, pomodori, mais e verdure dell'orto, vendendo il bottino al Bubetto, con le taglie e, più avanti, con la Cascina dei Salici.",
      "Si perdono con le multe della Vigilessa, con Zeno («tre pezzi da cambiare, minimo»), al Night Welcome e al tabacchi. Il Gratta e Vinci della Rosy è un'ottima scuola: insegna a perdere con dignità.",
    ] },
  ],
  storia: [
    { titolo: '📜 Garonio, una biografia (non autorizzata)', pagine: [
      "Garonio nasce nella Bassa, cinque chili alla nascita. L'ostetrica disse: «questo farà il contadino». Sbagliava, ma era gentile.",
      "Figlio del Gigante e della Mamma. Il Gigante voleva un erede. Ha avuto Garonio. Si sta abituando.",
      "Passioni: dormire, la Vespa, dormire sulla Vespa. Sogno: un giorno avere una cascina tutta sua. C'è chi dice che succederà. C'è chi dice che il Gigante non lo permetterà mai. Leggi il prossimo libro.",
    ] },
    { titolo: '📜 Il Gigante e Mister Mountain', pagine: [
      "Il Gigante ha sollevato un trattore nel 1989. C'è la foto in tabaccheria. Da allora non si è più seduto.",
      "Mister Mountain è il padrone delle terre. Arriva quando sbagli. Urla. Toglie la voglia di vivere e un po' di stress in più. Si dice che anche lui abbia un capo. Nessuno l'ha mai visto.",
      "Chi batte Mister Mountain, al livello 30, diventa l'erede del Gigante. È scritto qui. Il Gigante ha cancellato la frase a matita. Si legge lo stesso.",
    ] },
    { titolo: '📜 I re della campagna', pagine: [
      "Nelle campagne comandano bestie strane: il Re dei Ratti, la Regina delle Nutrie, il Re dei Lupi. E ogni edificio del paese ha il suo boss: il Tasso in cantina, il Generale Piccione in piazza...",
      "I personaggi te lo chiedono nel dialogo, con il punto esclamativo. La tana compare in rosso sulla minimappa e all'ora giusta premi E su «Affronta».",
    ] },
    { titolo: '📜 Chi è chi in paese', pagine: [
      "Don Peppino e Suor Carmela (chiesa). Il Conte e Ambrogio (castello). Il Dottor Pastiglia (farmacia), il Dottor Mutua e l'Assunta (ambulatorio). Il Sergente (palestra). Gennaro e Concetta (pizzeria). Kemal (kebab). Zeno e Ivan (officina). Il Bubetto (magazzino). Loredana e il Consulente (bar).",
      "In municipio: il Sindaco Fumagalli, il ragionier Cavilli e, ogni tanto, la Vigilessa. Al tabacchi la Rosy, all'alimentari la Rina, dalla parrucchiera la Wanda. Nel fienile, il Filosofo. Non dite al Gigante che lo sapete.",
      "Nelle cascine: il Potato e l'Ornella, il Postman e la Mirella, Mister Frank e il nipote Billy Bob, il Vecchio Camper e la sorella Zaira. Al Consorzio Mister Rodella e il nipote Kevin. Nella stalla il Tonino. Al casotto il Capo Guardia Ottavio.",
    ] },
    { titolo: '📜 Le ragazze della Bassa (e come non fare figuracce)', pagine: [
      "Con le ragazze si parla, si sceglie la risposta giusta e si sale di affinità. Le risposte sbagliate fanno male. Più delle nutrie.",
      "Chi conquista una ragazza può chiederle di sposarlo: anello, chiesa il giorno dopo tra le 10 e le 13, mezzo paese sui banchi. E se va male, l'Anagrafe è allo sportello 2. Con gli alimenti.",
    ] },
  ],
  mestieri: [
    { titolo: '🔧 Trattori, Vespa e Punto', pagine: [
      "I campi si lavorano coi trattori: aratro, seminatrice, falciatrice e turbina si agganciano sotto la tettoia. Il gasolio finisce. Le gomme si forano. Zeno lo sa e ne approfitta.",
      "La Vespa e la Punto si elaborano da Zeno. Più veloci, più belle, più multe. Con lo stress alto si guida male: rallenti, sbandi, ti schianti. Respira prima di partire.",
    ] },
    { titolo: '🌱 Orto, galline, maiali e stalla', pagine: [
      "L'orto si zappa, si semina, si annaffia e si raccoglie. Mister Rodella regala i semi una volta al giorno. Le galline vogliono mangiare la mattina e fanno le uova. Il Mangime Gold ne fa fare di più.",
      "I maiali del Gigante stanno nel capannone: da nutrire, da pulire, da far crescere. Nella stalla ci sono la Carolina, Dolly, la Gertrude (morde), Furia, Ernesto (scalcia) e Napoleone. Una volta al giorno ciascuno.",
    ] },
    { titolo: '🏡 L\'azienda agricola dei Salici', pagine: [
      "Dopo la storia, all'Ufficio agricolo (sportello 3 del municipio) si compra la Cascina dei Salici. Poi le strutture, quattro livelli ciascuna: casa, porcilaia, pollaio, stalla e tre campi da comprare uno per uno.",
      "Ogni notte la cascina produce. Dal registro si vende al consorzio a prezzi che cambiano ogni giorno, e si assume il garzone. Nella casa dei Salici c'è il baule per la roba di Garonio e un letto tutto suo.",
      "A ogni stagione c'è il Concilio del Gambalone, a fine anno l'Agricoltore dell'Anno. Il Gigante dice che non gli interessa. Ha la giacca pronta da febbraio.",
    ] },
    { titolo: '🏛️ Guida agli edifici del paese', pagine: [
      "Si entra quasi ovunque: municipio, tabacchi, alimentari, parrucchiera, chiesa, castello, farmacia, dottore, palestra, pizzeria, kebab, Zeno, il Bubetto, il bar, il fienile, le cascine dei vicini, il Consorzio, il casotto delle Guardie e la stalla.",
      "Ogni posto ha i suoi orari: di notte i negozi sono chiusi, le case dei vicini anche (e se insisti, Frank spara in aria). Dentro c'è sempre qualcuno con una missione. Cerca il punto esclamativo.",
    ] },
    { titolo: '⚖️ Multe, Vigilessa e burocrazia', pagine: [
      "La Vigilessa fa il giro della piazza come un orologio svizzero. Di Newbarley. Le multe si pagano a lei o allo sportello 1 del municipio. Se non le paghi, arriva il sequestro.",
      "All'Anagrafe (sportello 2, dalle 8 alle 13) il ragionier Cavilli fa matrimoni e divorzi. All'Ufficio agricolo (sportello 3) si comprano la cascina e le strutture.",
    ] },
  ],
  segreti: [
    { titolo: '🕯️ La cabina che ronza', pagine: [
      "Si racconta di una cabina della corrente lungo una sterrata fuori mano. «Pericolo di morte», dice il cartello. Il cugino del Consulente ci è finito contro con la macchina, forte. Dice di aver trovato... no, non lo dice.",
      "Chi ci ha provato racconta di lampi, capelli dritti e, a volte, di attrezzi che non si vendono in nessun negozio. La cabina, dicono, si ricarica in tre giorni. Il Comune smentisce. Il Comune non sa dov'è.",
    ] },
    { titolo: '🕯️ Il laghetto che conta', pagine: [
      "I vecchi dicono di non saltare troppo sulla riva del laghetto. Le rane smettono di cantare. Le bolle salgono. Gli occhi gialli guardano.",
      "Al centesimo salto, dicono, esce qualcosa coperto di alghe. Chi lo batte torna a casa con un mantello che puzza di fosso e protegge come un'armatura.",
    ] },
    { titolo: '🕯️ Il vecchietto vestito di rosso', pagine: [
      "Certe sere, nel bosco a sud, si sentono campanelli. Un vecchietto vestito di rosso non si ricorda chi è. Se lo porti al Night Welcome e gli trovi la compagnia giusta, gli torna la memoria.",
      "Più cara è la compagnia, più si ricorda. Si dice che una signora russa con una sberla sola gli abbia fatto ricordare tutto. E che lui abbia lasciato un bastone di zucchero che picchia come un trattore.",
    ] },
    { titolo: '🕯️ Gli alberi e le gazze', pagine: [
      "Ogni mattina qualche albero della Bassa nasconde un tesoro: attrezzi dei nonni, vestiti da lavoro, pepite. Bisogna scuoterli. Tutti. Il Filosofo dice che è una metafora. È solo un albero.",
      "Se una gazza ti ruba qualcosa, non piangere: lo nasconde sull'albero più vicino. Un punto nero sulla minimappa. Scuoti, e torna tutto, con un regalino.",
    ] },
    { titolo: '🕯️ Le parole magiche del Gigante', pagine: [
      "Si dice che esistano parole che, scritte nel campo dei codici (nel titolo o nel menu J), cambiano il destino. Il Gigante ne conosce una: dice di essere il suo erede. Tutto attaccato, tutto maiuscolo.",
      "Un'altra parla di grattare e vincere. Un'altra ancora di un pugno solo. Il Comune non approva. Il Comune ha provato la prima.",
    ] },
    { titolo: '🕯️ Le notti rosse', pagine: [
      "Una notte a settimana la luna si fa rossa come il naso del Tarcisio. Dalle 21 le bestie sono più forti e più ricche. Chi vince torna con gettoni che la bacheca delle taglie accetta volentieri.",
      "Le armi trovate in quelle notti, a volte, portano il marchio «delle Leggende». Nessun fabbro sa farlo. Nemmeno Zeno, ma lui dice di sì.",
    ] },
  ],
};
