// =====================================================================
//  IL BANCO DEL GIGANTE (src/banco.js, GDD capitolo 26.8)
//  Nell'officina di casa, sul banco da lavoro del Gigante, si costruisce roba con quello che si trova:
//  bottino dei mostri, cose degli alberi, prodotti della stalla e dei «lavoretti» del Camper.
//  ricetta: { tipo: 'arma' | 'vestito' | 'oggetto', id, n (quanti ne escono), serve: { oggetto: quantità }, liv, testo }
//  Armi e vestiti si costruiscono una volta sola.
// =====================================================================
export const BANCO = {
  minuti: 30, fatica: 4,
  intro: "Il banco da lavoro del Gigante: una morsa, un saldatore del '71, nastro americano e tanta fantasia. Cosa costruiamo?",
  ricette: {
    tortaMele:   { tipo: 'oggetto', id: 'tortaMele', n: 1, serve: { mela: 4, uova: 2, latte: 1 }, testo: "Mele, uova, latte e una ricetta scritta sul retro di uno scontrino della Nonna Adalgisa. Il profumo arriva fino ai maiali." },
    croccante:   { tipo: 'oggetto', id: 'croccante', n: 2, serve: { noci: 4, miele: 1 }, testo: "Miele caramellato e noci, steso sul banco e spaccato col martello. Esattamente come in pasticceria. Quasi." },
    zabaione:    { tipo: 'oggetto', id: 'zabaione', n: 1, serve: { uovoOca: 1, uova: 2, grappa: 1 }, testo: "Uovo d'oca, uova, zucchero e una grappa al posto del marsala. Il nonno approverebbe. Il dottore no." },
    fritturaOglio:{ tipo: 'oggetto', id: 'fritturaOglio', n: 1, serve: { pesceOglio: 2, uovaAnatra: 1 }, testo: "Pesci di frodo impanati nelle uova di frodo. La frittura più illegale e più buona della provincia." },
    bombaPigne:  { tipo: 'oggetto', id: 'bombaPigne', n: 2, serve: { pigna: 4, castagna: 2 }, testo: "Pigne, castagne matte, fil di ferro e una miccia. Il Gigante dice che non è una buona idea. Il Gigante ha ragione." },
    calzettoni:  { tipo: 'vestito', id: 'calzettoni', serve: { lana: 3 }, liv: 4, testo: "Ferri da calza, lana di Dolly e due ore di bestemmie sottovoce. Escono dei calzettoni che pizzicano tantissimo." },
    elmoCavaliere:{ tipo: 'vestito', id: 'elmoCavaliere', serve: { ferro: 4, rottame: 1, piuma: 2 }, liv: 8, testo: "Un secchio del latte, una fessura per gli occhi e due piume di gallo. Garonio si guarda nello specchio: Cavaliere Contadino." },
    stivaliReazione:{ tipo: 'vestito', id: 'stivaliReazione', serve: { rottame: 3, benzina: 2, pelleLupo: 1 }, liv: 15, testo: "Due motorini di Vespa avvitati sugli stivali. Il primo passo è un salto di tre metri. Il secondo, contro la porta." },
    falceLunare: { tipo: 'arma', id: 'falceLunare', serve: { ferro: 6, cristalloAlieno: 1, ossoFortunato: 1, pepita: 1 }, liv: 18, testo: "Il cristallo alieno nella lama, l'osso fortunato nel manico. La falce brilla di luce lunare e taglia la nebbia a fette." },
  },
  fatto: "🔨 Costruito: {cosa}!",
  manca: "Manca qualcosa: {cosa}.",
  basso: "Serve il livello {liv}: il Gigante non ti lascia il saldatore prima.",
  vecchio: '🔧 Dai un\'occhiata al banco',
};
