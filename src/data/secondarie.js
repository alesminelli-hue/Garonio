// =====================================================================
//  MISSIONI SECONDARIE — GDD capitoli 19.3 e 19.6
//  Solo dati. Il sistema (src/secondarie.js) le offre, segue i progressi e paga.
//
//  da          personaggio che la offre (id di src/data/png.js, oppure 'gigante')
//  titolo      nome breve (diario)
//  offerta     cosa dice quando la propone
//  accetta / rifiuta   etichette delle scelte (facoltative)
//  obiettivo   uno di questi:
//      { evento: 'nemicoSconfitto', filtro: { id: 'nutria' }, n: 5 }   conta gli eventi (src/eventi.js) che combaciano col filtro
//      { consegna: { mais: 3 }, a: 'patata' }                          porta questi oggetti al personaggio "a" (default: chi la dà)
//      { parla: 'frank' }                                               vai a parlare con qualcuno
//  dai         oggetti dati a Garonio quando accetta (es. il pacco da consegnare)
//  torna       true = finita la parte "evento", bisogna tornare da chi l'ha data per la paga (default true)
//  premio      { soldi, xp, oggetti: { id: n }, armi: [id], vestiti: [id], amicizia: { png: delta } }
//  requisiti   { livello, giorno, amicizia: { png: min }, dopo: 'idMissione' }
//  giorni      giorni di tempo dopo averla accettata (facoltativo): scaduto il tempo, fallisce
//  truffaldina true = missione del Gigante contro i vicini (rischio di farsi beccare: lavoro "cascine")
//  grazie / scusa   frasi quando la consegni / quando manca qualcosa
// =====================================================================

export const SECONDARIE = {
  bubetto_nutrie: {
    da: 'bubetto', titolo: 'Code di nutria per il Bubetto',
    offerta: "Ho un cliente che compra... cose di nutria. Non chiedere. Scacciane 5 e ti do 30 euro e una sorpresa.",
    obiettivo: { evento: 'nemicoSconfitto', filtro: { id: 'nutria' }, n: 5 },
    premio: { soldi: 30, xp: 15, vestiti: ['cappellino'], amicizia: { bubetto: 5 } },
    grazie: "Bravo! Tieni, un cappellino del consorzio. Me l'ha regalato il consorzio. Credo.",
  },
  patata_pannocchie: {
    da: 'patata', titolo: 'Le pannocchie del Patata',
    offerta: "Garonio... le patate sono la mia vita. Ma ogni tanto ho voglia di una pannocchia. Me ne porti 3? Ti do le mie patate migliori.",
    obiettivo: { consegna: { mais: 3 } },
    premio: { soldi: 10, xp: 12, oggetti: { patata: 4 }, amicizia: { patata: 8 } },
    grazie: "Che belle! Quasi belle come una patata. Tieni, queste si chiamano Gino, Pino, Lino e Ugo.",
    scusa: "Ne servono 3, Garonio. Le pannocchie, non le patate. Le patate ce le ho.",
  },
  postino_pacco: {
    da: 'postino', titolo: 'Un pacco per Mister Frank',
    offerta: "Mi fa male la schiena e Mister Frank sta lontano. Gli porti questo pacco? Dentro ci sono stivali. Lo so perché... l'ho pesato.",
    dai: { pacco: 1 },
    obiettivo: { consegna: { pacco: 1 }, a: 'frank' },
    torna: false,
    premio: { soldi: 15, xp: 10, amicizia: { postino: 5, frank: 5 } },
    grazie: "My boots! Thank you boy! Tieni qualche dollaro. Cioè, euro. Same thing.",
  },
  consulente_livello: {
    da: 'consulente', titolo: 'Fatti le ossa',
    offerta: "Ti do un consiglio da professionista: prima di andare a cercare guai, fatti le ossa. Torna quando sei al livello 3 e ti do una dritta vera.",
    obiettivo: { evento: 'livello', filtro: {}, n: 1, oPiu: { livello: 3 } },
    premio: { soldi: 20, xp: 10, oggetti: { caffe: 2 }, amicizia: { consulente: 10 } },
    grazie: "Livello 3! Ti offro due caffè. Cioè, li paghi tu la prossima volta, ma te li offro.",
  },
  mamma_uova: {
    da: 'mamma', titolo: 'Le uova per la torta',
    offerta: "Tesoro, mi porti 4 uova? Faccio la torta. Ma non dirlo a tuo padre, sennò la vuole tutta lui.",
    obiettivo: { consegna: { uova: 4 } },
    premio: { xp: 8, vestiti: ['santino'], amicizia: { mamma: 10 } },
    grazie: "Grazie amore! Tieni, il santino della nonna. Ti protegge. Lei proteggeva anche tuo padre, ma lì ha fatto quello che ha potuto.",
    requisiti: { giorno: 2 },
  },
};
