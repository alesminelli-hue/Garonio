// =====================================================================
//  PROGRESSIONE DI GARONIO (GDD capitolo 11)
//  Solo numeri e testi: si può ritoccare senza toccare il codice.
// =====================================================================

// Livello massimo 30: è l'endgame. Arrivati lì si sbloccano le sfide leggendarie dei boss (src/boss.js)
// e comincia il gioco libero. La velocità resta quella di prima (livello × 20 per salire).
export const LIVELLI = {
  max: 30,
  xpPer: level => level * 16,        // esperienza per passare dal livello L al L+1 (storia di 8-10 ore)
  perLivello: { atk: 2, def: 1, vitaMax: 5, punti: 1 },
  vitaBase: 100,
  faticaPerLivello: 0.04, faticaMin: 0.6,   // lavori: −4% fatica a livello, fino a −40%
};

// Titoli mostrati nella scheda di Garonio e usati nei dialoghi ({titolo})
export const TITOLI = [
  { da: 1, nome: 'Lo Scansafatiche' },
  { da: 5, nome: 'Il Garzone' },
  { da: 10, nome: 'Il Bracciante' },
  { da: 15, nome: 'Il Fattore' },
  { da: 20, nome: 'La Leggenda della Bassa' },
  { da: 25, nome: 'Il Terrore dei Fossi' },
  { da: 30, nome: 'Il Padrone della Bassa' },
];
export const titolo = level => [...TITOLI].reverse().find(t => level >= t.da).nome;

// Rami di abilità: 4 gradi ciascuno, il grado n richiede il livello in GRADI_LIVELLO[n-1].
// "bonus" sono effetti numerici che il codice legge con game.prog.bonus('chiave').
// Chiavi già lette dal gioco: atk, def, fatica, velocita, vitaMax, stressRimproveri, critico.
// Le altre (agricoltore, allevatore, parlantina...) le leggono i lavori che arriveranno.
export const GRADI_LIVELLO = [1, 5, 10, 15];

export const RAMI = {
  resistenza: {
    nome: 'Resistenza',
    gradi: [
      { desc: 'Lavori −10% fatica', bonus: { fatica: 0.10 } },
      { desc: 'Corsa senza fatica extra', bonus: { corsaGratis: 1 } },
      { desc: 'Stanchezza massima 120', bonus: { stanchezzaMax: 20 } },
      { desc: 'Crollo: una volta al giorno si rialza da solo', bonus: { rialzati: 1 } },
    ],
  },
  nervi: {
    nome: 'Nervi saldi',
    gradi: [
      { desc: 'Rimproveri −15% stress', bonus: { stressRimproveri: 0.15 } },
      { desc: 'Prese in giro −25% stress', bonus: { stressPreseInGiro: 0.25 } },
      { desc: 'Mister Mountain −30% stress', bonus: { stressRimproveri: 0.30 } },
      { desc: 'Stress sopra 85: non perde Vita', bonus: { stressImmune: 1 } },
    ],
  },
  agricoltore: {
    nome: 'Agricoltore',
    gradi: [
      { desc: 'Colture +10% veloci', bonus: { crescita: 0.10 } },
      { desc: 'Raccolto +1 per pianta', bonus: { raccoltoExtra: 1 } },
      { desc: 'Annaffiare annaffia 3 zolle', bonus: { annaffiaLargo: 1 } },
      { desc: 'Grandine e siccità fanno metà danni', bonus: { meteoDifesa: 0.5 } },
    ],
  },
  allevatore: {
    nome: 'Allevatore',
    gradi: [
      { desc: 'Maiali +10% crescita', bonus: { maialiCrescita: 0.10 } },
      { desc: 'Malattie −30%', bonus: { malattie: 0.30 } },
      { desc: 'Prezzo maiali +20%', bonus: { prezzoMaiali: 0.20 } },
      { desc: 'Un maialino in più a ogni parto', bonus: { maialini: 1 } },
    ],
  },
  furbizia: {
    nome: 'Furbizia',
    gradi: [
      { desc: 'Pisolini −30% rischio di farsi beccare', bonus: { pisolinoNascosto: 0.30 } },
      { desc: 'Gli oggetti curano +25%', bonus: { cure: 0.25 } },
      { desc: 'Più soldi da vendite e mance (+10%)', bonus: { vendite: 0.10 } },
      { desc: 'Il Gigante «non vede» la prima missione fallita della settimana', bonus: { perdonoGigante: 1 } },
    ],
  },
  lottatore: {
    nome: 'Lottatore',
    gradi: [
      { desc: 'Attacco +3', bonus: { atk: 3 } },
      { desc: 'Colpo critico 10%', bonus: { critico: 0.10 } },
      { desc: 'Seconda mossa dell\'arma sbloccata', bonus: { mossaExtra: 1 } },
      { desc: 'Due azioni nel primo turno', bonus: { primoTurnoDoppio: 1 } },
    ],
  },
  parlantina: {
    nome: 'Parlantina',
    gradi: [
      { desc: 'Risposte a tono +10% riuscita', bonus: { rispostaATono: 0.10 } },
      { desc: 'Nuova scelta: «Offri da bere»', bonus: { offriDaBere: 1 } },
      { desc: 'Gli avventori si arrabbiano −25%', bonus: { rabbiaAvventori: 0.25 } },
      { desc: 'Si può vincere una rissa a parole prima di iniziare', bonus: { vittoriaAParole: 1 } },
    ],
  },
};
