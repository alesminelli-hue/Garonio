// =====================================================================
//  LA STALLA (src/stalla.js, GDD capitolo 26.6)
//  Il recinto accanto alla cascina, a est della via della stalla. Ogni animale ha un nome, un lavoretto
//  al giorno (E vicino a lui) e un carattere. Sprite: foglio personaggi (mucca, pecora, gallo, oca, cavallo, asino).
//  ogni = ogni quanti giorni si può rifare · dai = oggetti · xp · stress / fatica / vita = effetti su Garonio
//  calcio = probabilità che vada storta (e cosa succede)
// =====================================================================
export const STALLA = {
  recinto: [100, 77.6, 107.4, 83.4],     // dove girano gli animali (x0, z0, x1, z1)
  raggio: 1.5,
  animali: {
    mucca:   { nome: 'Carolina', sprite: 'mucca', w: 1.95, casa: [102, 80], vel: 0.35,
      azione: '🥛 Mungi la Carolina', ogni: 1, fatica: 5, xp: 10, dai: { latte: 2 },
      testi: ["Plin, plin, plin... La Carolina ti guarda con aria materna. Due bottiglie di latte.", "La Carolina rumina, tu mungi. È l'unico momento di pace della giornata."],
      calcio: { p: 0.12, vita: 5, testo: "La Carolina sposta la zampa. Il secchio vola. Tu pure." } },
    pecora:  { nome: 'Dolly', sprite: 'pecora', w: 1.15, casa: [104.5, 82], vel: 0.45,
      azione: '✂️ Tosa la Dolly', ogni: 3, fatica: 8, xp: 18, dai: { lana: 1 },
      testi: ["Zac, zac, zac... Dolly resta mezza nuda e molto offesa. Un bel mucchio di lana.", "Dolly bela per tutto il tempo come se la stessi derubando. Tecnicamente è così."],
      giaFatto: "Dolly è ancora rasata e ti guarda con odio. La lana ricresce in tre giorni." },
    oca:     { nome: 'Gertrude', sprite: 'oca', w: 0.8, casa: [101.5, 82.6], vel: 0.6,
      azione: "🥚 Prendi l'uovo di Gertrude", ogni: 1, fatica: 2, xp: 8, dai: { uovoOca: 1 },
      testi: ["Gertrude si alza sdegnata e lascia un uovo grande come un pugno.", "Uovo preso. Gertrude ti segue starnazzando per dieci metri. Poi si dimentica."],
      calcio: { p: 0.3, vita: 4, testo: "QUAAAK! Gertrude ti morde il polpaccio. Le oche sono dinosauri con le piume." } },
    cavallo: { nome: 'Furia', sprite: 'cavallo', w: 1.95, casa: [105.5, 78.6], vel: 0.4,
      azione: '🪮 Striglia Furia', ogni: 1, fatica: 4, xp: 15, stress: -12,
      testi: ["Furia sbuffa contento. Strigliare un cavallo è meglio di qualsiasi psicologo. E costa meno.", "Il pelo di Furia luccica. Lui ti appoggia il muso sulla spalla. Ti scappa quasi una lacrima."] },
    asino:   { nome: 'Ernesto', sprite: 'asino', w: 1.2, casa: [100.8, 78.6], vel: 0.3,
      azione: '🫏 Accarezza Ernesto', ogni: 1, fatica: 1, xp: 6, stress: -6,
      testi: ["Ernesto si lascia accarezzare. Poi raglia: «IIIH-OOOH». Lo prendi come un grazie.", "Ernesto ti fissa. Tu fissi Ernesto. Nessuno dei due capisce l'altro. È bellissimo."],
      calcio: { p: 0.25, vita: 7, testo: "Ernesto ti tira un calcio nel sedere. Ti guarda come per dire: «Non oggi.»" } },
    gallo:   { nome: 'Napoleone', sprite: 'gallo', w: 0.85, casa: [103.4, 79.2], vel: 0.7,
      azione: '🐓 Parla con Napoleone', ogni: 1, fatica: 0, xp: 3,
      testi: ["Napoleone gonfia il petto: «CHICCHIRICHÌ!» Alle quattro e mezza, domattina, lo rifarà. Sotto la tua finestra.", "Napoleone ti squadra dall'alto in basso. Ed è alto trenta centimetri.", "Napoleone becca un sassolino, poi te. Per sicurezza."],
      alba: { ore: [6, 8], fatica: -10, testo: "«CHICCHIRICHÌÌÌ!» Il canto di Napoleone ti sveglia meglio di un caffè. (Stanchezza −10)" } },
  },
  premioSettimana: { giorni: 7, soldi: 120, testo: "🐄 Sette giorni di stalla di fila! Il Vecchio Camper ti lascia 120€ sotto la porta: «Per il garzone delle bestie.»" },
  cartello: 'STALLA',
};
