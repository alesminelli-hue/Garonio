// =====================================================================
//  INTERNI DEGLI EDIFICI — GDD capitolo 17
//  Solo dati: com'è fatta ogni stanza, dove stanno i mobili e cosa dicono.
//  Il motore (src/interni.js) li costruisce in 3D nello stesso stile HD-2D della mappa.
//
//  Coordinate locali della stanza: x da 0 a w (sinistra → destra), z da 0 (muro in fondo) a d (davanti, verso la camera).
//  stanze:    [{ id, nome, x0, x1, luce }]  la camera si ferma sulla stanza dove si trova Garonio.
//             luce: 1 = normale, meno = più buio (cantina).
//  pareti:    muri divisori fra le stanze, con il varco della porta vicino al davanti.
//  uscita:    { x, z } zerbino della porta: con E si esce.
//  mobili:    [{ tipo, x, z, w, d, h, zona, etichetta, ... }]
//             x, z = angolo in alto a sinistra; w, d = ingombro; h = altezza.
//             parete: true = appeso al muro di fondo (y = altezza da terra), non ingombra.
//             pavimento: true = disegnato per terra, non ingombra.
//             zona = id dell'azione (src/interni.js) che parte con E vicino al mobile.
//             Altri lavori possono sostituire l'azione con game.interni.aggancia('edificio:zona', fn).
//  orari:     [da, a] ore in cui si può entrare (facoltativo).
//  musica:    scena musicale (assets/music/playlist.json) mentre si è dentro.
// =====================================================================

import { INTERNI_NUOVI, PORTE_NUOVE, ENTRATE, CHIUSI } from './dentro.js';

export const INTERNI = {
  casa: {
    nome: 'Casa', w: 40, d: 7, h: 3.2, pavimento: 'parquet', muro: 'carta', musica: 'base',
    entrata: { x: 12.5, z: 6.0 },
    uscita: { x: 12.5, z: 6.7 },
    stanze: [
      { id: 'camera', nome: 'Camera di Garonio', x0: 0, x1: 8, muro: 'carta', pavimento: 'parquet' },
      { id: 'soggiorno', nome: 'Soggiorno', x0: 8, x1: 17, muro: 'carta2', pavimento: 'parquet' },
      { id: 'cucina', nome: 'Cucina', x0: 17, x1: 25, muro: 'piastrelle', pavimento: 'cotto' },
      { id: 'ufficio', nome: 'Ufficio del Gigante', x0: 25, x1: 32, muro: 'legno', pavimento: 'parquet' },
      { id: 'cantina', nome: 'Cantina', x0: 32, x1: 40, muro: 'mattoni', pavimento: 'cemento', luce: 0.55 },
    ],
    finestre: [{ x: 4.2, y: 1.3, w: 1.2, h: 1 }, { x: 15.5, y: 1.3, w: 1.2, h: 1 }, { x: 23.2, y: 1.4, w: 1.1, h: 0.9 }, { x: 28.5, y: 1.4, w: 1.1, h: 0.9 }, { x: 36.8, y: 2.3, w: 1, h: 0.45 }],
    mobili: [
      // camera
      { tipo: 'letto', x: 0.4, z: 0.3, w: 2.2, d: 3.2, h: 0.65, zona: 'letto', etichetta: 'Letto' },
      { tipo: 'comodino', x: 2.75, z: 0.25, w: 0.7, d: 0.6, h: 0.65 },
      { tipo: 'poster', parete: true, x: 0.9, y: 1.55, w: 1.2, h: 0.9, zona: 'poster', etichetta: 'Guarda il poster' },
      { tipo: 'trofei', parete: true, x: 2.6, y: 1.6, w: 1.2, h: 0.55, zona: 'trofei', etichetta: 'Trofei delle bestie' },
      { tipo: 'armadio', x: 5.7, z: 0.2, w: 2, d: 0.8, h: 2.4, zona: 'armadio', etichetta: 'Armadio: arma ed equipaggiamento' },
      { tipo: 'tappeto', pavimento: true, x: 2.6, z: 4, w: 2.6, d: 1.6, colore: '#3a6a9a' },
      // soggiorno
      { tipo: 'mobiletv', x: 9.3, z: 0.25, w: 2, d: 0.6, h: 0.6 },
      { tipo: 'tv', x: 9.6, z: 0.35, w: 1.4, d: 0.45, h: 1.0, y: 0.6, zona: 'tv', etichetta: 'Accendi la TV' },
      { tipo: 'divano', x: 9.1, z: 2.6, w: 2.6, d: 0.95, h: 0.9, zona: 'divano', etichetta: 'Divano: pisolino' },
      { tipo: 'tappeto', pavimento: true, x: 8.9, z: 1.2, w: 3, d: 1.2, colore: '#a83a2a' },
      { tipo: 'libreria', x: 13.2, z: 0.2, w: 1.6, d: 0.5, h: 2.2 },
      { tipo: 'pianta', x: 16.2, z: 0.4, w: 0.5, d: 0.5, h: 1.2 },
      { tipo: 'zerbino', pavimento: true, x: 11.8, z: 6.25, w: 1.4, d: 0.6 },
      // cucina
      { tipo: 'fornelli', x: 17.4, z: 0.2, w: 1.6, d: 0.7, h: 0.95 },
      { tipo: 'lavello', x: 19.0, z: 0.2, w: 1.6, d: 0.7, h: 0.95 },
      { tipo: 'frigo', x: 20.7, z: 0.2, w: 0.9, d: 0.75, h: 2.0 },
      { tipo: 'tavolo', x: 21.4, z: 3.2, w: 2.2, d: 1.2, h: 0.8, colore: '#c8a070', tovaglia: '#d84a4a', zona: 'tavola', etichetta: 'Tavola apparecchiata' },
      { tipo: 'sedia', x: 21.0, z: 3.5, w: 0.4, d: 0.5, h: 0.95 },
      { tipo: 'sedia', x: 23.7, z: 3.5, w: 0.4, d: 0.5, h: 0.95 },
      // ufficio del Gigante
      { tipo: 'bacheca', parete: true, x: 25.6, y: 1.2, w: 1.5, h: 1.1, zona: 'bacheca', etichetta: 'Bacheca delle missioni' },
      { tipo: 'calendario', parete: true, x: 30.2, y: 1.4, w: 0.9, h: 1.1, zona: 'calendario', etichetta: 'Calendario della stagione' },
      { tipo: 'scrivania', x: 26.8, z: 1.6, w: 2.4, d: 1.0, h: 0.8, zona: 'conti', etichetta: 'Registro dei conti' },
      { tipo: 'sedia', x: 27.8, z: 1.0, w: 0.5, d: 0.5, h: 1.1, colore: '#5a3a22' },
      { tipo: 'cassaforte', x: 31.0, z: 0.25, w: 0.7, d: 0.6, h: 0.8 },
      // cantina
      { tipo: 'botte', x: 32.6, z: 0.3, w: 1.1, d: 1.0, h: 1.2 },
      { tipo: 'botte', x: 33.8, z: 0.3, w: 1.1, d: 1.0, h: 1.2 },
      { tipo: 'scaffale', x: 35.2, z: 0.2, w: 2.2, d: 0.6, h: 2.0, merce: 'conserve', zona: 'deposito', etichetta: 'Deposito del raccolto' },
      { tipo: 'salami', parete: true, x: 33.0, y: 1.9, w: 1.8, h: 0.6 },
      { tipo: 'cassa', x: 38.2, z: 1.6, w: 0.9, d: 0.8, h: 0.7 },
      { tipo: 'buco', parete: true, x: 38.6, y: 0, w: 0.8, h: 0.55, zona: 'cantina', etichetta: 'Il buco nel muro' },
    ],
  },

  // l'officina di casa ora è solo il deposito di Garonio e del Gigante: Zeno lavora in paese («Da Zeno», interno 'meccanico')
  officina: {
    nome: 'Deposito', w: 16, d: 8, h: 3.6, pavimento: 'cemento', muro: 'lamiera', musica: 'base',
    entrata: { x: 8, z: 7.0 },
    uscita: { x: 8, z: 7.7 },
    stanze: [{ id: 'officina', nome: 'Deposito di Garonio e del Gigante', x0: 0, x1: 16 }],
    finestre: [{ x: 6.5, y: 2.1, w: 3, h: 0.8 }],
    mobili: [
      { tipo: 'bancone', x: 0.5, z: 1.6, w: 3.4, d: 0.6, h: 1.05, colore: '#6a7078', piano: '#8a5a32', zona: 'bancone', etichetta: 'Banco da lavoro del Gigante' },
      { tipo: 'mensola', parete: true, x: 0.6, y: 1.5, w: 3, h: 0.7, merce: 'ricambi' },
      { tipo: 'scaffale', x: 4.6, z: 0.2, w: 2.4, d: 0.6, h: 2.2, merce: 'ricambi', zona: 'scaffale', etichetta: 'Scaffale della roba vecchia' },
      { tipo: 'cassa', x: 7.4, z: 0.4, w: 1.0, d: 0.8, h: 0.7 },
      { tipo: 'cassa', x: 7.6, z: 0.4, w: 0.8, d: 0.7, h: 1.3, colore: '#7a5a32' },
      { tipo: 'sacchi', x: 8.7, z: 0.3, w: 2.0, d: 1.0, h: 1.0, zona: 'sacchi', etichetta: 'Sacchi di concime' },
      { tipo: 'rastrelliera', x: 11.1, z: 0.2, w: 2.6, d: 0.5, h: 2.2, zona: 'rastrelliera', etichetta: 'Rastrelliera degli attrezzi' },
      { tipo: 'armadietti', x: 13.9, z: 0.2, w: 1.9, d: 0.6, h: 2.1, zona: 'armadietti', etichetta: 'Armadietti: upgrade dell\'azienda' },
      { tipo: 'gomme', x: 0.5, z: 5.2, w: 0.9, d: 0.9, h: 1.0 },
      { tipo: 'bidone', x: 14.9, z: 5.4, w: 0.7, d: 0.7, h: 1.0 },
      { tipo: 'bidone', x: 14.2, z: 6.1, w: 0.7, d: 0.7, h: 1.0, colore: '#2a6a3a' },
      { tipo: 'macchia', pavimento: true, x: 5.8, z: 3.6, w: 1.6, d: 0.9 },
      { tipo: 'zerbino', pavimento: true, x: 7.3, z: 7.25, w: 1.4, d: 0.6, colore: '#4a4a4a' },
    ],
  },

  maiali: {
    nome: 'Capannone dei maiali', w: 24, d: 8, h: 3, pavimento: 'cemento', muro: 'lamiera', musica: 'base',
    entrata: { x: 7, z: 7.0 },
    uscita: { x: 7, z: 7.7 },
    stanze: [
      { id: 'box', nome: 'Box dei maiali', x0: 0, x1: 14 },
      { id: 'magazzino', nome: 'Mangime, sala parto e infermeria', x0: 14, x1: 24 },
    ],
    finestre: [{ x: 2, y: 2.1, w: 1.6, h: 0.5 }, { x: 7.5, y: 2.1, w: 1.6, h: 0.5 }, { x: 18.5, y: 2.1, w: 1.6, h: 0.5 }],
    mobili: [
      { tipo: 'box', x: 0.3, z: 0.2, w: 3.1, d: 3.4, h: 0.8, box: 0, zona: 'box', etichetta: 'Box' },
      { tipo: 'box', x: 3.6, z: 0.2, w: 3.1, d: 3.4, h: 0.8, box: 1, zona: 'box', etichetta: 'Box' },
      { tipo: 'box', x: 6.9, z: 0.2, w: 3.1, d: 3.4, h: 0.8, box: 2, zona: 'box', etichetta: 'Box' },
      { tipo: 'box', x: 10.2, z: 0.2, w: 3.1, d: 3.4, h: 0.8, box: 3, zona: 'box', etichetta: 'Box' },
      { tipo: 'secchio', x: 12.6, z: 5.6, w: 0.5, d: 0.5, h: 0.5 },
      { tipo: 'sacchi', x: 14.6, z: 0.3, w: 2.2, d: 1.1, h: 1.1, zona: 'mangime', etichetta: 'Sacchi del mangime' },
      { tipo: 'parto', x: 17.4, z: 0.2, w: 3.0, d: 2.6, h: 0.8, zona: 'parto', etichetta: 'Sala parto' },
      { tipo: 'infermeria', x: 21.4, z: 0.2, w: 2.2, d: 0.6, h: 1.8, zona: 'infermeria', etichetta: 'Infermeria' },
      { tipo: 'grata', pavimento: true, x: 19.3, z: 4.6, w: 1.2, d: 1.0, zona: 'grata', etichetta: 'La grata nel pavimento' },
      { tipo: 'paglia', x: 22.4, z: 5.2, w: 1.2, d: 1.0, h: 0.7 },
      { tipo: 'zerbino', pavimento: true, x: 6.3, z: 7.25, w: 1.4, d: 0.6, colore: '#5a4a2a' },
    ],
  },

  bar: {
    nome: 'Bar', w: 22, d: 8, h: 3, pavimento: 'scacchi', muro: 'legno', musica: 'bar',
    entrata: { x: 6.5, z: 7.0 },
    uscita: { x: 6.5, z: 7.7 },
    stanze: [
      { id: 'sala', nome: 'Bar', x0: 0, x1: 13 },
      { id: 'saletta', nome: 'Saletta del biliardo', x0: 13, x1: 22, muro: 'verde' },
    ],
    finestre: [{ x: 8.4, y: 1.3, w: 1.3, h: 1 }, { x: 11.2, y: 1.3, w: 1.3, h: 1 }],
    mobili: [
      { tipo: 'bancone', x: 0.6, z: 1.6, w: 6.2, d: 0.6, h: 1.1, colore: '#7a4a26', piano: '#d8c8a8', spine: true, zona: 'bancone', etichetta: 'Bancone' },
      { tipo: 'mensola', parete: true, x: 0.8, y: 1.3, w: 5.6, h: 1.0, merce: 'bottiglie' },
      { tipo: 'insegna', parete: true, x: 2.6, y: 2.4, w: 2.2, h: 0.45, testo: 'BAR SPORT' },
      { tipo: 'tavolino', x: 9.7, z: 1.3, w: 0.9, d: 0.8, h: 0.75, zona: 'consulente', etichetta: 'Tavolino del Consulente' },
      { tipo: 'tavolino', x: 1.6, z: 4.6, w: 0.9, d: 0.8, h: 0.75, zona: 'tavolo', tavolo: 'tavolo1', etichetta: 'Tavolo' },
      { tipo: 'tavolino', x: 4.4, z: 4.6, w: 0.9, d: 0.8, h: 0.75, zona: 'tavolo', tavolo: 'tavolo2', etichetta: 'Tavolo' },
      { tipo: 'tavolino', x: 8.8, z: 4.6, w: 0.9, d: 0.8, h: 0.75, zona: 'tavolo', tavolo: 'tavolo3', etichetta: 'Tavolo' },
      { tipo: 'tavolino', x: 11.3, z: 4.0, w: 0.9, d: 0.8, h: 0.75, zona: 'tavolo', tavolo: 'tavolo4', etichetta: 'Tavolo' },
      { tipo: 'sgabello', x: 1.6, z: 2.5, w: 0.4, d: 0.4, h: 0.7 },
      { tipo: 'sgabello', x: 5.4, z: 2.5, w: 0.4, d: 0.4, h: 0.7 },
      { tipo: 'frigogelati', x: 7.2, z: 0.3, w: 1.0, d: 0.7, h: 1.0 },
      { tipo: 'tavolino', x: 14.2, z: 1.3, w: 1.2, d: 0.9, h: 0.75, colore: '#2a6a3a', zona: 'carte', etichetta: 'Tavolo delle carte' },
      { tipo: 'biliardo', x: 16.4, z: 3.5, w: 3.4, d: 1.8, h: 0.85, zona: 'biliardo', etichetta: 'Biliardo' },
      { tipo: 'stecche', parete: true, x: 16.6, y: 0.4, w: 0.8, h: 1.6 },
      { tipo: 'jukebox', x: 20.6, z: 0.25, w: 1.0, d: 0.7, h: 1.7, zona: 'jukebox', etichetta: 'Juke-box' },
      { tipo: 'bacheca', parete: true, x: 13.6, y: 1.5, w: 1.0, h: 0.9, zona: 'annunci', etichetta: 'Bacheca degli annunci' },
      { tipo: 'porta', parete: true, x: 18.2, y: 0, w: 1.1, h: 2.1, zona: 'retro', etichetta: 'Porta sul retro' },
      { tipo: 'zerbino', pavimento: true, x: 5.8, z: 7.25, w: 1.4, d: 0.6, colore: '#2a5a3a' },
    ],
    // dove si siedono gli avventori (coordinate locali), per posto
    posti: {
      tavolo1: { x: 2.05, z: 4.2 }, tavolo2: { x: 4.85, z: 4.2 }, tavolo3: { x: 9.25, z: 4.2 }, tavolo4: { x: 12.3, z: 4.4 },
      bancone: { x: 3.4, z: 2.6 }, carte: { x: 14.8, z: 0.85 }, biliardo: { x: 18.1, z: 6.0 },
    },
  },

  magazzino: {
    nome: 'Magazzino del Bubetto', w: 14, d: 8, h: 3.4, pavimento: 'assi', muro: 'lamiera2', musica: 'base',
    orari: [7, 21],
    entrata: { x: 7, z: 7.0 },
    uscita: { x: 7, z: 7.7 },
    stanze: [{ id: 'magazzino', nome: 'Magazzino del Bubetto', x0: 0, x1: 14 }],
    finestre: [{ x: 5.8, y: 2.2, w: 2.4, h: 0.6 }],
    mobili: [
      { tipo: 'scaffale', x: 0.3, z: 0.2, w: 2.3, d: 0.6, h: 2.4, merce: 'vestiti', reparto: 'vestiti', zona: 'scaffali', etichetta: 'Scaffale: vestiti' },
      { tipo: 'scaffale', x: 2.8, z: 0.2, w: 2.3, d: 0.6, h: 2.4, merce: 'armi', reparto: 'armi', zona: 'scaffali', etichetta: 'Scaffale: armi e attrezzi' },
      { tipo: 'scaffale', x: 8.9, z: 0.2, w: 2.3, d: 0.6, h: 2.4, merce: 'manuali', reparto: 'manuali', zona: 'scaffali', etichetta: 'Scaffale: manuali' },
      { tipo: 'scaffale', x: 11.4, z: 0.2, w: 2.3, d: 0.6, h: 2.4, merce: 'oggetti', reparto: 'oggetti', zona: 'scaffali', etichetta: 'Scaffale: oggetti' },
      { tipo: 'bancone', x: 5.3, z: 2.0, w: 3.4, d: 0.6, h: 1.05, colore: '#8a6a3a', piano: '#c8a070', cassa: true, zona: 'bancone', etichetta: 'Bancone del Bubetto' },
      { tipo: 'insegna', parete: true, x: 5.6, y: 1.5, w: 2.8, h: 0.5, testo: 'NIENTE CREDITO' },
      { tipo: 'usato', x: 11.3, z: 4.4, w: 2.3, d: 1.5, h: 0.9, zona: 'usato', etichetta: 'Angolo dell\'usato' },
      { tipo: 'lavagna', x: 0.9, z: 4.4, w: 1.4, d: 0.4, h: 1.7, zona: 'lavagna', etichetta: 'Lavagna delle missioni' },
      { tipo: 'cassa', x: 0.4, z: 6.3, w: 0.9, d: 0.8, h: 0.7 },
      { tipo: 'cassa', x: 12.8, z: 6.4, w: 0.9, d: 0.8, h: 0.7 },
      { tipo: 'zerbino', pavimento: true, x: 6.3, z: 7.25, w: 1.4, d: 0.6, colore: '#6a4a2a' },
    ],
  },

  // =================== Edifici del paese esplorabili (azioni in src/edifici.js, testi in src/data/edifici.js) ===================
  chiesa: {
    nome: 'Chiesa', w: 18, d: 9, h: 4.6, pavimento: 'marmo', muro: 'chiesa', musica: 'base',
    orari: [6, 21],
    entrata: { x: 6.5, z: 8.0 },
    uscita: { x: 6.5, z: 8.7 },
    stanze: [
      { id: 'navata', nome: 'Chiesa di San Garonio', x0: 0, x1: 13 },
      { id: 'sagrestia', nome: 'Sagrestia', x0: 13, x1: 18, muro: 'legno', pavimento: 'parquet' },
    ],
    finestre: [],
    mobili: [
      { tipo: 'altare', x: 5.0, z: 0.6, w: 3.0, d: 1.1, h: 1.05, zona: 'altare', etichetta: 'Altare' },
      { tipo: 'crocifisso', parete: true, x: 6.0, y: 2.0, w: 1.0, h: 1.6 },
      { tipo: 'vetrata', parete: true, x: 1.8, y: 1.7, w: 1.2, h: 2.2, colore: '#3a5aa8' },
      { tipo: 'vetrata', parete: true, x: 10.0, y: 1.7, w: 1.2, h: 2.2, colore: '#a83a3a' },
      { tipo: 'candele', x: 9.4, z: 0.35, w: 1.3, d: 0.5, h: 1.0, zona: 'candele', etichetta: 'Accendi un cero' },
      { tipo: 'confessionale', x: 0.3, z: 0.3, w: 1.4, d: 1.0, h: 2.4, zona: 'confessionale', etichetta: 'Confessionale' },
      { tipo: 'banco', x: 1.2, z: 3.0, w: 4.0, d: 0.6, h: 0.9 },
      { tipo: 'banco', x: 7.8, z: 3.0, w: 4.0, d: 0.6, h: 0.9 },
      { tipo: 'banco', x: 1.2, z: 4.5, w: 4.0, d: 0.6, h: 0.9, zona: 'banco', etichetta: 'Siediti sul banco' },
      { tipo: 'banco', x: 7.8, z: 4.5, w: 4.0, d: 0.6, h: 0.9, zona: 'banco', etichetta: 'Siediti sul banco' },
      { tipo: 'banco', x: 1.2, z: 6.0, w: 4.0, d: 0.6, h: 0.9 },
      { tipo: 'banco', x: 7.8, z: 6.0, w: 4.0, d: 0.6, h: 0.9 },
      { tipo: 'tappeto', pavimento: true, x: 5.6, z: 1.8, w: 1.8, d: 6.6, colore: '#8a2a2a' },
      { tipo: 'acquasantiera', x: 4.4, z: 7.6, w: 0.5, d: 0.45, h: 0.95, zona: 'acquasantiera', etichetta: 'Acquasantiera' },
      { tipo: 'offerte', x: 8.3, z: 7.6, w: 0.5, d: 0.45, h: 0.95, zona: 'offerte', etichetta: 'Cassetta delle offerte' },
      // sagrestia
      { tipo: 'armadio', x: 13.4, z: 0.2, w: 2.0, d: 0.7, h: 2.3, zona: 'paramenti', etichetta: 'Armadio dei paramenti' },
      { tipo: 'tavolo', x: 14.6, z: 4.6, w: 1.6, d: 0.9, h: 0.8, colore: '#7a4a26', zona: 'vino', etichetta: 'Il vino della messa' },
      { tipo: 'corda', parete: true, x: 16.9, y: 0.3, w: 0.3, h: 3.6, zona: 'campane', etichetta: 'Corda delle campane' },
      { tipo: 'zerbino', pavimento: true, x: 5.8, z: 8.25, w: 1.4, d: 0.6, colore: '#6a2a2a' },
    ],
  },

  castello: {
    nome: 'Castello', w: 30, d: 9, h: 4.8, pavimento: 'pietra', muro: 'pietra', musica: 'intro',
    orari: [9, 21],
    entrata: { x: 5, z: 8.0 },
    uscita: { x: 5, z: 8.7 },
    stanze: [
      { id: 'armi', nome: 'Salone delle armi', x0: 0, x1: 10 },
      { id: 'trono', nome: 'Sala del trono', x0: 10, x1: 20, muro: 'velluto' },
      { id: 'biblioteca', nome: 'Biblioteca', x0: 20, x1: 26, muro: 'legno', pavimento: 'parquet' },
      { id: 'segrete', nome: 'Segrete', x0: 26, x1: 30, luce: 0.5 },
    ],
    finestre: [{ x: 4.4, y: 2.6, w: 0.6, h: 1.3 }, { x: 22.8, y: 2.4, w: 0.6, h: 1.3 }],
    mobili: [
      { tipo: 'armatura', x: 0.5, z: 0.3, w: 0.8, d: 0.6, h: 2.0, zona: 'armatura', etichetta: 'Armatura' },
      { tipo: 'armatura', x: 8.6, z: 0.3, w: 0.8, d: 0.6, h: 2.0, zona: 'armatura', etichetta: 'Armatura' },
      { tipo: 'arazzo', parete: true, x: 1.8, y: 1.3, w: 2.2, h: 2.6, zona: 'arazzo', etichetta: 'Arazzo della battaglia' },
      { tipo: 'arazzo', parete: true, x: 5.8, y: 1.3, w: 2.2, h: 2.6, colore: '#2a4a7a' },
      { tipo: 'cassapanca', x: 3.4, z: 0.3, w: 1.6, d: 0.6, h: 0.7, zona: 'cassapanca', etichetta: 'Cassapanca' },
      // sala del trono
      { tipo: 'camino', x: 10.6, z: 0.1, w: 2.4, d: 0.8, h: 2.3, zona: 'camino', etichetta: 'Camino' },
      { tipo: 'trono', x: 16.3, z: 0.4, w: 1.4, d: 1.1, h: 2.3, zona: 'trono', etichetta: 'Siediti sul trono' },
      { tipo: 'tappeto', pavimento: true, x: 16.1, z: 1.6, w: 1.8, d: 6.8, colore: '#a82a2a' },
      { tipo: 'ritratto', parete: true, x: 18.5, y: 1.4, w: 1.2, h: 1.6, zona: 'ritratto', etichetta: 'Ritratto degli antenati' },
      { tipo: 'ritratto', parete: true, x: 13.8, y: 1.4, w: 1.2, h: 1.6, colore: '#4a6a3a' },
      { tipo: 'tavolo', x: 11.2, z: 4.2, w: 3.4, d: 1.2, h: 0.8, colore: '#6a3a1c', tovaglia: '#e8e0c8', zona: 'banchetto', etichetta: 'Tavola del banchetto' },
      { tipo: 'sedia', x: 11.6, z: 3.7, w: 0.5, d: 0.5, h: 1.2, colore: '#5a2a12' },
      { tipo: 'sedia', x: 13.6, z: 3.7, w: 0.5, d: 0.5, h: 1.2, colore: '#5a2a12' },
      // biblioteca
      { tipo: 'libreria', x: 20.3, z: 0.2, w: 2.0, d: 0.5, h: 2.6, zona: 'libreria', etichetta: 'Libreria del Conte' },
      { tipo: 'libreria', x: 23.6, z: 0.2, w: 2.0, d: 0.5, h: 2.6, zona: 'libreria', etichetta: 'Libreria del Conte' },
      { tipo: 'scrivania', x: 21.6, z: 3.4, w: 2.0, d: 0.9, h: 0.8, colore: '#5a3a1c', zona: 'mappa', etichetta: 'Mappa dei possedimenti' },
      { tipo: 'pianta', x: 25.2, z: 6.2, w: 0.5, d: 0.5, h: 1.2 },
      // segrete
      { tipo: 'catene', parete: true, x: 26.6, y: 1.1, w: 1.0, h: 1.4 },
      { tipo: 'botte', x: 26.4, z: 5.0, w: 1.1, d: 1.0, h: 1.2 },
      { tipo: 'forziere', x: 28.2, z: 0.4, w: 1.2, d: 0.8, h: 0.8, zona: 'forziere', etichetta: 'Il forziere del Conte' },
      { tipo: 'zerbino', pavimento: true, x: 4.3, z: 8.25, w: 1.4, d: 0.6, colore: '#6a2a2a' },
    ],
  },

  farmacia: {
    nome: 'Farmacia', w: 12, d: 7, h: 3.2, pavimento: 'scacchi', muro: 'farmacia', musica: 'base',
    orari: [8, 20],
    entrata: { x: 6, z: 6.0 },
    uscita: { x: 6, z: 6.7 },
    stanze: [{ id: 'farmacia', nome: 'Farmacia del Dottor Pastiglia', x0: 0, x1: 12 }],
    finestre: [{ x: 9.6, y: 1.3, w: 1.4, h: 1.0 }],
    mobili: [
      { tipo: 'scaffale', x: 0.3, z: 0.2, w: 2.6, d: 0.5, h: 2.5, merce: 'medicine' },
      { tipo: 'scaffale', x: 3.1, z: 0.2, w: 2.6, d: 0.5, h: 2.5, merce: 'medicine' },
      { tipo: 'scaffale', x: 6.3, z: 0.2, w: 2.6, d: 0.5, h: 2.5, merce: 'medicine' },
      { tipo: 'croce', parete: true, x: 9.8, y: 2.5, w: 0.9, h: 0.6 },
      { tipo: 'bancone', x: 3.4, z: 2.0, w: 5.4, d: 0.6, h: 1.05, colore: '#f0f0ec', piano: '#3a8a5a', cassa: true, zona: 'bancone', etichetta: 'Banco della farmacia' },
      { tipo: 'espositore', x: 0.4, z: 3.6, w: 1.0, d: 1.0, h: 1.3, zona: 'espositore', etichetta: 'Espositore delle offerte' },
      { tipo: 'bilancia', x: 10.4, z: 4.4, w: 0.8, d: 0.8, h: 1.6, zona: 'bilancia', etichetta: 'Pesati (20 centesimi)' },
      { tipo: 'sedia', x: 10.8, z: 2.3, w: 0.5, d: 0.5, h: 0.95 },
      { tipo: 'pianta', x: 0.4, z: 6.0, w: 0.5, d: 0.5, h: 1.1 },
      { tipo: 'zerbino', pavimento: true, x: 5.3, z: 6.25, w: 1.4, d: 0.6, colore: '#2a6a3a' },
    ],
  },

  dottore: {
    nome: 'Studio medico', w: 14, d: 7, h: 3, pavimento: 'scacchi', muro: 'carta2', musica: 'base',
    orari: [8, 19],
    entrata: { x: 3.5, z: 6.0 },
    uscita: { x: 3.5, z: 6.7 },
    stanze: [
      { id: 'attesa', nome: 'Sala d\'attesa', x0: 0, x1: 7 },
      { id: 'studio', nome: 'Studio del Dottor Mutua', x0: 7, x1: 14, muro: 'farmacia', pavimento: 'cotto' },
    ],
    finestre: [{ x: 1.0, y: 1.3, w: 1.2, h: 1.0 }, { x: 11.2, y: 1.3, w: 1.2, h: 1.0 }],
    mobili: [
      { tipo: 'bancone', x: 4.6, z: 1.3, w: 2.0, d: 0.6, h: 1.0, colore: '#e8e8e4', piano: '#8aa8c8', zona: 'accettazione', etichetta: 'Accettazione' },
      { tipo: 'sedia', x: 0.4, z: 2.4, w: 0.5, d: 0.5, h: 0.95 },
      { tipo: 'sedia', x: 1.1, z: 2.4, w: 0.5, d: 0.5, h: 0.95 },
      { tipo: 'sedia', x: 1.8, z: 2.4, w: 0.5, d: 0.5, h: 0.95, zona: 'attesa', etichetta: 'Siediti ad aspettare' },
      { tipo: 'tavolino', x: 0.7, z: 3.8, w: 1.0, d: 0.7, h: 0.5, zona: 'riviste', etichetta: 'Riviste del 2003' },
      { tipo: 'bacheca', parete: true, x: 3.0, y: 1.3, w: 1.2, h: 0.9, zona: 'avvisi', etichetta: 'Avvisi dell\'ASL' },
      { tipo: 'pianta', x: 6.2, z: 5.8, w: 0.5, d: 0.5, h: 1.2 },
      // studio
      { tipo: 'scrivania', x: 9.0, z: 1.3, w: 2.2, d: 1.0, h: 0.8, colore: '#7a4a26', zona: 'scrivania', etichetta: 'Scrivania del dottore' },
      { tipo: 'sedia', x: 9.8, z: 2.5, w: 0.5, d: 0.5, h: 0.95 },
      { tipo: 'lettino', x: 11.6, z: 3.4, w: 2.0, d: 0.9, h: 0.7, zona: 'lettino', etichetta: 'Lettino: fatti visitare' },
      { tipo: 'infermeria', x: 12.0, z: 0.2, w: 1.8, d: 0.5, h: 1.8, zona: 'armadietto', etichetta: 'Armadietto dei medicinali' },
      { tipo: 'ottotipo', parete: true, x: 7.6, y: 1.2, w: 0.8, h: 1.2, zona: 'ottotipo', etichetta: 'Tabella della vista' },
      { tipo: 'zerbino', pavimento: true, x: 2.8, z: 6.25, w: 1.4, d: 0.6, colore: '#3a5a7a' },
    ],
  },

  palestra: {
    nome: 'Palestra', w: 18, d: 8, h: 3.4, pavimento: 'gomma', muro: 'palestra', musica: 'rabbia',
    orari: [7, 23],
    entrata: { x: 7.5, z: 7.0 },
    uscita: { x: 7.5, z: 7.7 },
    stanze: [
      { id: 'pesi', nome: 'Palestra «Bicipite d\'Oro»', x0: 0, x1: 13 },
      { id: 'spogliatoio', nome: 'Spogliatoio', x0: 13, x1: 18, muro: 'piastrelle', pavimento: 'cotto' },
    ],
    finestre: [{ x: 9.8, y: 2.2, w: 2.4, h: 0.7 }],
    mobili: [
      { tipo: 'panca', x: 0.6, z: 1.2, w: 2.0, d: 0.8, h: 1.2, zona: 'panca', etichetta: 'Panca: solleva pesi' },
      { tipo: 'manubri', x: 3.2, z: 0.2, w: 2.6, d: 0.6, h: 1.0 },
      { tipo: 'specchio', parete: true, x: 3.0, y: 1.2, w: 3.0, h: 1.6, zona: 'specchio', etichetta: 'Guardati allo specchio' },
      { tipo: 'tapis', x: 6.6, z: 0.4, w: 1.0, d: 2.0, h: 1.3, zona: 'tapis', etichetta: 'Tapis roulant' },
      { tipo: 'tapis', x: 7.9, z: 0.4, w: 1.0, d: 2.0, h: 1.3, zona: 'tapis', etichetta: 'Tapis roulant' },
      { tipo: 'sacco', x: 10.6, z: 1.6, w: 0.7, d: 0.7, h: 3.0, zona: 'sacco', etichetta: 'Sacco da boxe' },
      { tipo: 'bacheca', parete: true, x: 11.4, y: 1.4, w: 1.2, h: 0.9, zona: 'abbonamenti', etichetta: 'Bacheca degli abbonamenti' },
      { tipo: 'tappeto', pavimento: true, x: 0.6, z: 4.0, w: 3.0, d: 2.0, colore: '#2a5a9a' },
      // spogliatoio
      { tipo: 'armadietti', x: 13.4, z: 0.2, w: 2.2, d: 0.6, h: 2.1, zona: 'armadietto', etichetta: 'Armadietto' },
      { tipo: 'doccia', x: 16.0, z: 0.2, w: 1.6, d: 1.2, h: 2.4, zona: 'doccia', etichetta: 'Doccia' },
      { tipo: 'banco', x: 13.6, z: 3.6, w: 2.6, d: 0.6, h: 0.5, colore: '#a87a4a' },
      { tipo: 'zerbino', pavimento: true, x: 6.8, z: 7.25, w: 1.4, d: 0.6, colore: '#2a2a2a' },
    ],
  },

  pizzeria: {
    nome: 'Bella Napoli', w: 14, d: 8, h: 3, pavimento: 'cotto', muro: 'piastrelle', musica: 'base',
    orari: [11, 24],
    entrata: { x: 9, z: 7.0 },
    uscita: { x: 9, z: 7.7 },
    stanze: [{ id: 'sala', nome: 'Pizzeria «Bella Napoli»', x0: 0, x1: 14 }],
    finestre: [{ x: 10.6, y: 1.3, w: 1.4, h: 1.0 }],
    mobili: [
      { tipo: 'forno', x: 0.4, z: 0.2, w: 2.2, d: 1.5, h: 1.9, zona: 'forno', etichetta: 'Forno a legna' },
      { tipo: 'bancone', x: 3.2, z: 1.6, w: 3.8, d: 0.6, h: 1.05, colore: '#f0ece0', piano: '#c8c8c0', zona: 'bancone', etichetta: 'Ordina al banco' },
      { tipo: 'mensola', parete: true, x: 3.4, y: 1.4, w: 3.4, h: 0.8, merce: 'bottiglie' },
      { tipo: 'insegna', parete: true, x: 7.6, y: 2.2, w: 2.4, h: 0.45, testo: 'BELLA NAPOLI' },
      { tipo: 'quadro', parete: true, x: 7.8, y: 1.1, w: 1.6, h: 1.0, zona: 'vesuvio', etichetta: 'Il quadro del Vesuvio' },
      { tipo: 'tavolo', x: 1.0, z: 4.2, w: 1.4, d: 1.0, h: 0.8, colore: '#8a5a32', tovaglia: '#d84a4a', zona: 'tavolo', etichetta: 'Tavolo' },
      { tipo: 'tavolo', x: 4.2, z: 4.2, w: 1.4, d: 1.0, h: 0.8, colore: '#8a5a32', tovaglia: '#d84a4a', zona: 'tavolo', etichetta: 'Tavolo' },
      { tipo: 'tavolo', x: 10.4, z: 3.0, w: 1.4, d: 1.0, h: 0.8, colore: '#8a5a32', tovaglia: '#d84a4a', zona: 'tavolo', etichetta: 'Tavolo' },
      { tipo: 'tavolo', x: 11.6, z: 5.4, w: 1.4, d: 1.0, h: 0.8, colore: '#8a5a32', tovaglia: '#d84a4a', zona: 'tavolo', etichetta: 'Tavolo' },
      { tipo: 'sedia', x: 0.5, z: 4.4, w: 0.4, d: 0.5, h: 0.95 },
      { tipo: 'sedia', x: 2.5, z: 4.4, w: 0.4, d: 0.5, h: 0.95 },
      { tipo: 'sedia', x: 3.7, z: 4.4, w: 0.4, d: 0.5, h: 0.95 },
      { tipo: 'sedia', x: 5.7, z: 4.4, w: 0.4, d: 0.5, h: 0.95 },
      { tipo: 'pianta', x: 13.2, z: 0.4, w: 0.5, d: 0.5, h: 1.2 },
      { tipo: 'zerbino', pavimento: true, x: 8.3, z: 7.25, w: 1.4, d: 0.6, colore: '#2a6a3a' },
    ],
  },

  kebab: {
    nome: 'Kebab', w: 9, d: 6, h: 3, pavimento: 'scacchi', muro: 'piastrelle', musica: 'base',
    orari: [11, 24],
    entrata: { x: 4.5, z: 5.0 },
    uscita: { x: 4.5, z: 5.7 },
    stanze: [{ id: 'kebab', nome: 'Kebab di Kemal', x0: 0, x1: 9 }],
    finestre: [],
    mobili: [
      { tipo: 'spiedo', x: 1.6, z: 0.25, w: 0.8, d: 0.8, h: 1.8, zona: 'spiedo', etichetta: 'Lo spiedo che gira' },
      { tipo: 'bancone', x: 0.6, z: 1.6, w: 4.6, d: 0.6, h: 1.05, colore: '#c8401a', piano: '#d8d8d0', zona: 'bancone', etichetta: 'Ordina al banco' },
      { tipo: 'menu', parete: true, x: 2.6, y: 1.8, w: 3.0, h: 0.9, zona: 'menu', etichetta: 'Il menu illuminato' },
      { tipo: 'frigogelati', x: 6.2, z: 0.3, w: 1.0, d: 0.7, h: 1.6, zona: 'frigo', etichetta: 'Frigo delle bibite' },
      { tipo: 'tavolino', x: 6.6, z: 3.0, w: 0.9, d: 0.8, h: 0.75, zona: 'tavolino', etichetta: 'Tavolino' },
      { tipo: 'sgabello', x: 6.0, z: 3.3, w: 0.4, d: 0.4, h: 0.7 },
      { tipo: 'sgabello', x: 7.7, z: 3.3, w: 0.4, d: 0.4, h: 0.7 },
      { tipo: 'zerbino', pavimento: true, x: 3.8, z: 5.25, w: 1.4, d: 0.6, colore: '#6a2a1a' },
    ],
  },

  meccanico: {
    nome: 'Da Zeno', w: 16, d: 8, h: 3.6, pavimento: 'cemento', muro: 'lamiera', musica: 'base',
    orari: [7, 19],
    entrata: { x: 12, z: 7.0 },
    uscita: { x: 12, z: 7.7 },
    stanze: [{ id: 'meccanico', nome: 'Officina di Zeno', x0: 0, x1: 16 }],
    finestre: [{ x: 10.5, y: 2.1, w: 3, h: 0.8 }],
    mobili: [
      { tipo: 'bancone', x: 0.5, z: 1.6, w: 3.4, d: 0.6, h: 1.05, colore: '#6a7078', piano: '#8a5a32', zona: 'bancone', etichetta: 'Bancone di Zeno' },
      { tipo: 'mensola', parete: true, x: 0.6, y: 1.5, w: 3, h: 0.7, merce: 'ricambi' },
      { tipo: 'calendario', parete: true, x: 3.4, y: 1.5, w: 0.8, h: 1.0, zona: 'calendario', etichetta: 'Calendario delle gomme' },
      { tipo: 'ponte', x: 4.6, z: 0.6, w: 4.4, d: 2.6, h: 0.3, zona: 'ponte', etichetta: 'Ponte sollevatore: elaborazioni' },
      { tipo: 'mola', x: 9.8, z: 1.2, w: 0.8, d: 0.6, h: 1.1, zona: 'mola', etichetta: 'Mola: affilatura' },
      { tipo: 'mensola', parete: true, x: 11.2, y: 1.2, w: 2.6, h: 1.0, merce: 'ricambi' },
      { tipo: 'macchinetta', x: 14.4, z: 0.3, w: 0.8, d: 0.6, h: 1.6, zona: 'caffe', etichetta: 'Macchinetta del caffè (1€)' },
      { tipo: 'gomme', x: 0.5, z: 5.2, w: 0.9, d: 0.9, h: 1.0 },
      { tipo: 'gomme', x: 1.5, z: 5.4, w: 0.9, d: 0.9, h: 0.7 },
      { tipo: 'bidone', x: 14.9, z: 5.4, w: 0.7, d: 0.7, h: 1.0 },
      { tipo: 'bidone', x: 14.2, z: 6.1, w: 0.7, d: 0.7, h: 1.0, colore: '#c8302a' },
      { tipo: 'macchia', pavimento: true, x: 5.8, z: 3.6, w: 1.6, d: 0.9 },
      { tipo: 'macchia', pavimento: true, x: 10.4, z: 5.0, w: 1.2, d: 0.7 },
      { tipo: 'zerbino', pavimento: true, x: 11.3, z: 7.25, w: 1.4, d: 0.6, colore: '#4a4a4a' },
    ],
  },
};

// Etichetta della porta sulla mappa (tasto E davanti all'edificio)
export const PORTE = {
  casa: 'Entra in casa', officina: 'Entra nel deposito', bar: 'Entra al bar', maiali: 'Entra nel capannone', magazzino: 'Entra dal Bubetto',
  chiesa: 'Entra in chiesa', castello: 'Entra nel castello', farmacia: 'Entra in farmacia', dottore: 'Entra dal dottore',
  palestra: 'Entra in palestra', pizzeria: 'Entra in pizzeria', kebab: 'Entra al kebab', meccanico: 'Entra da Zeno',
};

// I quattro maiali finti dei box, finché i maiali veri (lavoro "annata") non arrivano
export const MAIALI_FINTI = [
  { nome: 'Gina', frase: "Gina ti guarda come si guarda uno che non ha portato da mangiare." },
  { nome: 'Brontolo', frase: "Brontolo brontola. È il suo lavoro, e lo fa meglio di te il tuo." },
  { nome: 'Rosina', frase: "Rosina si rotola nel fango con una felicità che tu non hai mai provato." },
  { nome: 'Il Sindaco', frase: "Il Sindaco è il maiale più grosso. Lo chiamano così perché non fa niente e mangia per tre." },
];

// ---------------------------------------------------------------------
//  TESTI (tono ironico di provincia)
// ---------------------------------------------------------------------
export const TESTI = {
  entrata: {
    casa: ["Casa. Profumo di ragù e di rimproveri.", "Casa dolce casa. Il Gigante ha lasciato gli stivali in mezzo, come sempre."],
    officina: ["Il deposito: attrezzi, concime e la roba che il Gigante «prima o poi aggiusta».", "Odore di gasolio e di cose rimandate. Zeno ormai lavora in paese."],
    meccanico: ["Odore di gasolio e di brutte notizie.", "Da Zeno. Qui il tempo si misura in fatture."],
    chiesa: ["Silenzio, incenso e uno scricchiolio di banchi. Anche il tuo stomaco si fa il segno della croce.", "La chiesa. Fa fresco anche ad agosto. Forse è per quello che la Sciura Ines viene tutti i giorni."],
    castello: ["Il castello del Conte. Spifferi nobili, polvere antica.", "Un'eco ti risponde mentre entri. Anche l'eco ha la erre moscia."],
    farmacia: ["Il campanello della farmacia fa «din». Il Dottor Pastiglia alza gli occhi dal Sudoku.", "Odore di disinfettante e di caramelle alla menta."],
    dottore: ["Sala d'attesa. Il tempo qui scorre in modo diverso: più lento.", "L'odore di ospedale ti fa venire voglia di stare bene. Subito."],
    palestra: ["Ferro, sudore e musica a tutto volume. «Bicipite d'Oro», dove i sogni diventano lividi.", "Qualcuno grugnisce sotto un bilanciere. Non è un maiale, ma ci assomiglia."],
    pizzeria: ["Profumo di forno a legna. Gennaro canta. Stona, ma con amore.", "Tovaglie a quadretti e un Vesuvio dipinto male. Casa, per chi ha fame."],
    kebab: ["Lo spiedo gira lento, ipnotico. Ti chiama per nome.", "Kebab di Kemal: il posto più vivo del paese dopo le undici di sera."],
    maiali: ["L'odore ti arriva prima dei grugniti.", "Capannone dei maiali. Il naso chiede le ferie."],
    bar: ["Il bar. Il centro del mondo, se il mondo è grande come il paese.", "Il campanello della porta suona. Tutti si girano. Poi tornano a farsi gli affari tuoi."],
    magazzino: ["Il magazzino del Bubetto: se non c'è, non esiste. Se c'è, non chiedere da dove viene.", "Polvere, scatoloni e il Bubetto che conta soldi."],
  },
  chiuso: {
    chiesa: "Il portone è chiuso. Un biglietto: «Messa alle 7. Chi arriva dopo le 21 si confessa domani». Firmato Don Peppino.",
    castello: "Il portone è sbarrato. Una targa d'ottone: «Visite dalle 9 alle 21. I nobili non ricevono a quest'ora, e neanche Ambrogio».",
    farmacia: "Saracinesca giù. Sulla porta: «Farmacia di turno: Newbarley. Auguri». Apre dalle 8 alle 20.",
    dottore: "Studio chiuso. Sul citofono: «Il dottore riceve dalle 8 alle 19. Per le urgenze, il veterinario». Ottimismo di paese.",
    palestra: "La palestra è chiusa. Sulla vetrina: «Apriamo alle 7. Anche i muscoli dormono». Firmato il Sergente.",
    pizzeria: "Forno spento. Un cartello a forma di pizza: «Aperti dalle 11 a mezzanotte. Gennaro dorme, non bussate».",
    kebab: "Saracinesca giù. A pennarello: «Apro alle 11. Dopo mezzanotte solo per i disperati: tornate domani, disperati».",
    meccanico: "Saracinesca abbassata. «Chiuso. Si riapre alle 7. Per i mezzi rotti: chiamare Zeno col telefonino, se ha voglia di rispondere.»",
    magazzino: "Sulla porta c'è un cartello: «CHIUSO. Torno quando torno. Il Bubetto». Apre dalle 7 alle 21, più o meno.",
  },
  letto: {
    giorno: "Il letto ti chiama. Ma il sole è alto e il Gigante pure.",
    sera: "Il letto ti chiama. Ed è la voce più dolce del mondo.",
    dormi: "Dormi fino a domani",
    dormiNo: "Dormire (solo dopo le 20:00)",
    salva: "Salva la partita",
    salvato: "Partita salvata. Il cuscino custodirà il segreto.",
  },
  poster: [
    "Il poster del trattore più bello del mondo. Il Gigante dice che è uno spreco di muro.",
    "«Campionato provinciale di briscola 1998». Il nonno arrivò secondo. Al primo si ruppe il polso, misteriosamente.",
    "Un poster di Albano e Romina. Non sai chi l'ha attaccato. Non hai il coraggio di staccarlo.",
  ],
  trofeiVuoto: "Lo spazio per i trofei è vuoto. Il chiodo aspetta la testa di un re. O almeno una corona.",
  trofei: "Appesi al muro, con orgoglio: {lista}.",
  tv: {
    canali: [
      "TG regionale: «Nutrie in aumento nella Bassa. Gli esperti consigliano: correre».",
      "Televendita: la pentola che cuoce da sola. La mamma la guarda con desiderio.",
      "Telenovela brasiliana, puntata 4.812. Tutti piangono. Anche tu, un po'.",
      "Quiz del pomeriggio: «Quante zolle si zappano in un'ora?». Il concorrente sbaglia. Tu non lo sapresti.",
    ],
    meteo: {
      sole: "Previsioni: sole pieno. Ottimo per lavorare. Pessimo per avere scuse.",
      pioggia: "Previsioni: pioggia nel pomeriggio. Le piante ringraziano, le galline no.",
      grandine: "Previsioni: rischio grandine. Il Gigante ha già bestemmiato due volte.",
      nebbia: "Previsioni: nebbia fitta la mattina. Come sempre. Siamo nella Bassa.",
    },
    prezzi: "Prezzi del mercato oggi: uova {uova}€, pomodori {pomodoro}€, mais {mais}€.",
  },
  divano: {
    ok: ["Zzz... un'ora di pace.", "Zzz... sogni un mondo senza zappe.", "Zzz... nel sogno le nutrie lavorano per te."],
    beccato: "Ti svegli col Gigante che ti fissa dalla porta. «Comodo? Vuoi anche il caffè a letto?» Stress +8",
    stanco: "Garonio non è stanco. Per una volta. Segnatelo sul calendario.",
  },
  tavola: [
    "La tavola è apparecchiata per tre. Il piatto del Gigante è il più grande. Anche il bicchiere.",
    "Sulla tovaglia c'è una macchia di sugo del 2004. La mamma dice che porta fortuna.",
  ],
  bacheca: {
    titolo: "Bacheca del Gigante. In grande, a pennarello: «LAVORARE».",
    nessuna: "Nessuna missione appesa. Strano. Sospetto.",
  },
  calendario: "Calendario del consorzio. {stagione}, giorno {giorno} di {tot}. In rosso, scritto dal Gigante: «{obiettivo}».",
  obiettivoFinto: "FARE IL RACCOLTO. E NON DORMIRE.",
  conti: "Registro dei conti. Soldi di Garonio: {soldi}€. Venduto oggi: {venduto}€. Fiducia del Gigante: {fiducia}.",
  fiduciaFinta: "«da guadagnare», scritto a matita",
  cantina: {
    deposito: "Sullo scaffale ci sono: {lista}.",
    vuoto: "Lo scaffale del raccolto è vuoto. Ci sono solo due vasetti di conserva del 2011.",
    deposita: "Deposita tutto il raccolto",
    riprendi: "Riprendi tutto",
    depositato: "Raccolto al sicuro in cantina. Al fresco, al buio, lontano dai ratti. Speriamo.",
    ripreso: "Hai ripreso il raccolto dalla cantina.",
    silenzio: "Dal buco nel muro arriva aria fredda. E un odore di formaggio sparito.",
    squittii: "Dal buco nel muro arrivano squittii. Tanti. Troppi. Escono dei ratti!",
    traccia: "Fra i calcinacci c'è un'impronta enorme e una crosta di parmigiano rosicchiata a forma di corona. Il Re dei Ratti esiste.",
  },
  armadio: "L'armadio scricchiola. Dentro, la tuta di sempre e qualche sorpresa.",
  // officina
  officina: {
    zenoAssente: "Sul bancone c'è un biglietto: «TORNO SUBITO». Il biglietto è giallo. Ingiallito dal 1998. Zeno c'è dalle 7 alle 19.",
    banco: [
      "Il banco da lavoro del Gigante: fil di ferro, nastro americano e una morsa arrugginita. «Ripariamo da soli», dice. Poi chiama Zeno.",
      "Sul banco c'è un carburatore smontato dal 2015. Il Gigante dice che lo rimonta «quando ha tempo». Il tempo non viene mai.",
    ],
    scaffale: "Scaffale della roba vecchia: bulloni spaiati, una marmitta della Vespa del nonno, tre caschi e nessuno della tua taglia.",
    sacchi: "Sacchi di concime impilati. Puzzano di campagna e di soldi spesi. Il Gigante li conta ogni sera.",
    ponte: "Sul ponte sollevatore c'è una Vespa a gambe all'aria. Le elaborazioni arriveranno quando Zeno avrà voglia.",
    mola: "La mola gira e fa scintille. Per affilare le armi bisogna parlare con Zeno, o col Bubetto. O con Dio.",
    rastrelliera: "Aratro, seminatrice, falciatrice, turbina. Tutti appesi in fila, come le promesse del Gigante.",
  },
  // capannone
  maiali: {
    vuoto: "Il box è vuoto. C'è solo l'impronta di un maiale nel fango, a forma di delusione.",
    gratta: "Gratti la schiena a {nome}. Grugnisce di gioia. Stress -2",
    giaGrattato: "{nome} ha già avuto le sue coccole oggi. Non viziarlo, poi pretende.",
    mangime: "Prendi un sacco di mangime. Pesa come una giornata di lavoro. Lo rimetti a posto.",
    parto: "La sala parto è pronta: paglia pulita, lampada calda. In primavera qui nascono i maialini.",
    infermeria: "L'armadietto dell'infermeria è chiuso. Ci vuole l'upgrade, dice il Gigante. O il veterinario, che costa.",
    grata: "Una grata arrugginita. Da sotto viene un'aria che sa di silos e di guai. È chiusa con un lucchetto grosso come un pugno.",
  },
  // bar
  bar: {
    consulente: "Il tavolino del Consulente. C'è una tazzina vuota, un'agenda piena e un biglietto da visita con scritto «CONSULENTE». Di cosa, non si sa.",
    tavoloVuoto: "Un tavolo libero. Ci sono tre cerchi di bicchiere e un tappo di birra.",
    carte: "Il mazzo di carte è consumato. Il due di coppe è segnato con la penna. Tutti lo sanno.",
    carteTarcisio: "Tarcisio mischia le carte: «Una briscola? Hic. Se perdi paghi da bere».",
    jukebox: "Il juke-box si accende con un ronzio. Cosa mettiamo?",
    jukeboxScelto: "Il juke-box gracchia e parte: «{titolo}».",
    annunci: "Bacheca degli annunci. Fra un «VENDO TRATTORE (NON VA)» e un «CERCO GATTO (NON TORNARE)»:",
    annunciVuoti: "Nessun lavoretto in giro, per oggi. Solo un volantino del liscio del sabato.",
    bestie: [
      "Volantino scritto a mano: «AVVISTATO RATTO GROSSO COME UN CANE VICINO AL SILOS. NON DATEGLI DA MANGIARE».",
      "«Chi ha visto una nutria con la corazza chiami la Pina». La Pina non ha visto niente, ma vuole sapere.",
      "«Ululati verso il bosco. Il lupo c'è. Firmato: Tarcisio (sobrio)».",
    ],
    retro: "La porta sul retro: «Andiamo fuori a parlarne». Dà sul vicolo dietro al bar.",
    retroEsci: "Esci dal retro",
  },
  biliardo: {
    invito: "Il biliardo. Il panno verde ha visto più liti del tribunale. Una partita a soldi?",
    nessuno: "Non c'è nessuno con cui giocare. Fai due tiri da solo e mandi una palla nel portaombrelli.",
    poste: [{ label: 'Partita da 5€', posta: 5 }, { label: 'Partita da 15€', posta: 15 }],
    tiri: [
      { label: 'Tiro tranquillo', p: 0.6, dice: "Colpo pulito: la palla va in buca senza fretta, come te." },
      { label: 'Tiro d\'effetto', p: 0.4, dice: "Effetto, sponda, buca! Il bar applaude. Tarcisio si sveglia." },
      { label: 'Spaccata alla Garonio', p: 0.25, dice: "BAM! Tre palle in buca e una fuori dalla finestra. Vale lo stesso, dicono." },
    ],
    sbagli: [
      "La stecca scivola. La palla bianca fa un giro su se stessa e si ferma. Ti guarda. Ti giudica.",
      "Sbagli di un niente. Di un niente grande così.",
      "La palla sbatte, rimbalza, ci pensa, e non entra.",
    ],
    avversarioSegna: "{nome} imbuca con la faccia di chi lo fa da quarant'anni.",
    avversarioSbaglia: "{nome} sbaglia e dà la colpa al gesso.",
    vinto: "Hai vinto {posta}€! {nome} paga brontolando.",
    perso: "Hai perso {posta}€. {nome} li bacia e li mette nel taschino.",
    poveri: "Non hai abbastanza soldi per la posta. Il biliardo è uno sport per ricchi. O per Tarcisio.",
  },
  // magazzino
  magazzino: {
    bubettoAssente: "Il bancone è vuoto. C'è un campanello con scritto «SUONARE». Suoni. Non viene nessuno. Il Bubetto è qui dalle 9 alle 20.",
    scaffali: {
      vestiti: "Giacche di sindaci, stivali di ignoti, cappellini del consorzio. Il Bubetto sta ancora attaccando i prezzi.",
      armi: "Zappe, forconi, rastrelli e una mazza da baseball «presa in America». Il Bubetto sta ancora attaccando i prezzi.",
      manuali: "«Zappare senza fatica», «Come parlare al Gigante», «Briscola per tutti». Il Bubetto sta ancora attaccando i prezzi.",
      oggetti: "Trappole, pomate, caffè in polvere, grappa «medicinale». Il Bubetto sta ancora attaccando i prezzi.",
    },
    usato: "L'angolo dell'usato: roba rara che cambia ogni lunedì. Oggi c'è un ferro da stiro a carbone e un elmetto da pompiere.",
    lavagna: "Lavagna del Bubetto. Scritto col gesso:",
    lavagnaVuota: "Lavagna del Bubetto. C'è solo scritto «CERCASI CODE DI RATTO. PAGO BENE (FORSE)».",
  },
  // la Mamma
  mamma: {
    pasto: "Hai qualcosa da mangiare?",
    pastoFatto: [
      "«Siediti, tesoro.» Tortellini in brodo. Il mondo smette di fare male. Vita +20, stress -5",
      "«Ti ho tenuto da parte il risotto.» È la cosa più buona che ti succede da giorni. Vita +20, stress -5",
      "«Mangia, che sei sciupato.» Cotoletta e patatine. Hai sette anni di nuovo. Vita +20, stress -5",
    ],
    pastoGia: "«Hai già mangiato, tesoro. Poi ingrassi e tuo padre dice che è colpa mia.»",
    consiglio: "Un consiglio?",
    consigli: {
      missione: "«Tuo padre oggi vuole questo: {missione}. Fallo prima delle {ora}, così stasera non urla. Cioè, urla meno.»",
      fatta: "«Hai già fatto quello che voleva tuo padre? Bravo! Ora riposati, prima che se ne inventi un'altra.»",
      fallita: "«Lo so, tuo padre è arrabbiato. Domani andrà meglio. Il sole sorge anche per gli scansafatiche.»",
      secondaria: "«Il {chi} ti aspetta per quella cosa: {titolo}. Non farlo aspettare, che poi parla in paese.»",
      niente: "«Vai al bar a sentire cosa si dice. Ma non bere. Cioè, bevi poco. Cioè, torna a casa intero.»",
    },
  },
  loredana: {
    ordina: "Ordina qualcosa",
  },
  uscita: "Esci",
  uscitaInterno: "Torna indietro",
};


// gli altri edifici esplorabili (src/dentro.js, GDD capitolo 29)
Object.assign(INTERNI, INTERNI_NUOVI);
Object.assign(PORTE, PORTE_NUOVE);
Object.assign(TESTI.entrata, ENTRATE);
Object.assign((TESTI.chiuso ??= {}), CHIUSI);
