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
//  requisiti   { livello, giorno, amicizia: { png: min }, dopo: 'idMissione', check: game => bool }
//  giorni      giorni di tempo dopo averla accettata (facoltativo): scaduto il tempo, fallisce
//  truffaldina true = missione del Gigante contro i vicini (rischio di farsi beccare: lavoro "cascine")
//  grazie / scusa   frasi quando la consegni / quando manca qualcosa
// =====================================================================

import { MISSIONI_DENTRO } from './dentro.js';

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

  // ---------- Missioni truffaldine del Gigante (GDD 19.6) ----------
  // Le offre il Gigante (src/cascine.js), una alla volta. obiettivo.evento = 'truffa' viene mandato da src/cascine.js
  // quando il colpo riesce. vicino = contro chi (src/data/vicini.js). Se ti beccano la missione fallisce.
  truffa_acqua_frank: {
    da: 'gigante', truffaldina: true, vicino: 'frank', tipo: 'acqua', torna: false,
    titolo: 'Ruba l\'acqua dal pozzo di Frank',
    offerta: "Il nostro mais ha sete e Mister Frank ha il pozzo più profondo della «county». Porta il trattore rosso con la turbina al suo pozzo e irriga per un'ora. Di notte, possibilmente. Frank va a letto presto, il cane no.",
    accetta: 'Ci penso io', rifiuta: 'Papà, è un furto!',
    obiettivo: { evento: 'truffa', filtro: { tipo: 'acqua', vicino: 'frank' }, n: 1 },
    premio: { soldi: 85, xp: 30 },
  },
  truffa_alberi_patata: {
    da: 'gigante', truffaldina: true, vicino: 'patata', tipo: 'alberi', torna: false,
    titolo: 'Abbatti gli alberi del Patata',
    offerta: "Gli alberi sul confine col Patata fanno ombra al nostro mais. Prendi la mia motosega e abbattine 3. Fa rumore, quindi vai quando il Patata dorme. O mangia. Che per lui è uguale.",
    dai: { motosega_gigante: 1 },
    obiettivo: { evento: 'alberoAbbattuto', filtro: { vicino: 'patata' }, n: 3 },
    premio: { soldi: 120, xp: 30 },
  },
  truffa_confine_postino: {
    da: 'gigante', truffaldina: true, vicino: 'postino', tipo: 'confine', torna: false,
    titolo: 'Sposta il confine del Postino',
    offerta: "Tra il grano del Postino e il nostro fienile ci sono quattro paletti. Spostali un paio di metri dalla sua parte. Di notte. Il Postino legge tutto, ma i paletti non li legge nessuno.",
    obiettivo: { evento: 'palettoSpostato', filtro: {}, n: 4 },
    premio: { soldi: 50, xp: 20 },
  },
  truffa_prestito_patata: {
    da: 'gigante', truffaldina: true, vicino: 'patata', tipo: 'prestito', torna: false,
    titolo: 'Prendi in prestito l\'erpice del Patata',
    offerta: "Il Patata ha un erpice che non usa mai. Noi invece lo useremmo. Vai a «prenderlo in prestito» e portalo sotto la nostra tettoia. In prestito. Per sempre.",
    obiettivo: { evento: 'truffa', filtro: { tipo: 'prestito', vicino: 'patata' }, n: 1 },
    premio: { soldi: 70, xp: 25 },
  },
  truffa_acqua_patata: {
    da: 'gigante', truffaldina: true, vicino: 'patata', tipo: 'acqua', torna: false,
    titolo: 'Ruba l\'acqua dal fosso del Patata',
    offerta: "Il fosso del Patata è pieno e il nostro campo è secco. Trattore rosso, turbina, un'ora di pompa. Il Patata è lento, ma ci sente. Il nipote Ugo invece non sente niente, ma vede tutto.",
    accetta: 'Va bene', rifiuta: 'Non mi va',
    obiettivo: { evento: 'truffa', filtro: { tipo: 'acqua', vicino: 'patata' }, n: 1 },
    premio: { soldi: 65, xp: 25 },
    requisiti: { dopo: 'truffa_acqua_frank' },
  },
  truffa_alberi_frank: {
    da: 'gigante', truffaldina: true, vicino: 'frank', tipo: 'alberi', torna: false,
    titolo: 'Abbatti gli alberi del ranch',
    offerta: "Mister Frank ha piantato una fila di alberi «per il paesaggio americano». Il paesaggio americano ci toglie due file di mais. Motosega, 3 alberi, e non farti vedere da Sceriffo.",
    dai: { motosega_gigante: 1 },
    obiettivo: { evento: 'alberoAbbattuto', filtro: { vicino: 'frank' }, n: 3 },
    premio: { soldi: 120, xp: 35 },
    requisiti: { dopo: 'truffa_alberi_patata' },
  },
  truffa_alberi_postino: {
    da: 'gigante', truffaldina: true, vicino: 'postino', tipo: 'alberi', torna: false,
    titolo: 'Abbatti gli alberi del Postino',
    offerta: "Il Postino ha due alberi sul confine da cui spia il nostro cortile. Due alberi, due colpi di motosega. E lui senza binocolo.",
    dai: { motosega_gigante: 1 },
    obiettivo: { evento: 'alberoAbbattuto', filtro: { vicino: 'postino' }, n: 2 },
    premio: { soldi: 80, xp: 25 },
    requisiti: { dopo: 'truffa_confine_postino' },
  },

  // ---------- Quest degli edifici del paese (GDD capitolo 25) ----------
  // Palestra «Bicipite d'Oro»
  palestra_salti: {
    da: 'sergente', titolo: 'La corda del Sergente',
    offerta: "Recluta! Il cuore di un contadino si allena saltando. Voglio 60 salti. Dove vuoi: nel fango, in piazza, sul trattore no. CONTATI!",
    accetta: 'Signorsì!',
    obiettivo: { evento: 'salto', filtro: { interno: false }, n: 60 },
    premio: { soldi: 25, xp: 30, oggetti: { integratore: 3 }, amicizia: { sergente: 8 } },
    grazie: "Sessanta! Sudato come un maiale a Ferragosto. Mi piace. Tieni, integratori: non chiedere cosa c'è dentro, non lo so neanche io.",
    requisiti: { livello: 2 },
  },
  palestra_frullato: {
    da: 'sergente', titolo: 'Il frullato del campione',
    offerta: "Il mio frullato segreto: sei uova crude, due mele e un vasetto di miele. Lo bevo da trent'anni. Da trent'anni non sento i sapori. Portami gli ingredienti.",
    obiettivo: { consegna: { uova: 6, mela: 2, miele: 1 } },
    premio: { soldi: 60, xp: 70, vestiti: ['guantiLavoro'], amicizia: { sergente: 10 } },
    grazie: "(glu glu glu) BLEAH. Perfetto. Tieni i miei guanti da allenamento: io ormai ho i calli al posto delle mani.",
    scusa: "Uova, mele, miele. Ti manca qualcosa, recluta. Venti flessioni e poi torna.",
    requisiti: { livello: 6, dopo: 'palestra_salti' },
  },
  // Farmacia
  farmacia_noci: {
    da: 'pastiglia', titolo: 'Lo sciroppo della nonna',
    offerta: "Sto brevettando lo «Sciroppo della Nonna»: noci e miele. Funziona come le medicine, ma costa il triplo. Mi servono 4 noci e un miele. Le noci le trovi scuotendo gli alberi.",
    obiettivo: { consegna: { noci: 4, miele: 1 } },
    premio: { soldi: 40, xp: 45, oggetti: { elisir: 1, sciroppo: 2 }, amicizia: { pastiglia: 10 } },
    grazie: "Meraviglioso. Lo venderò come «biologico, artigianale, a chilometro zero». Il chilometro è quello fino al bosco. Tieni, un assaggio di elisir.",
    scusa: "Quattro noci e un miele, Garonio. La scienza è precisa. Io meno.",
    requisiti: { livello: 4 },
  },
  farmacia_zanne: {
    da: 'pastiglia', titolo: 'Polvere di zanna',
    offerta: "Un cliente di Codogno mi chiede «polvere di zanna di cinghiale». Dice che fa ricrescere i capelli. Non è vero, ma paga. Me ne porti due?",
    obiettivo: { consegna: { zanna: 2 } },
    premio: { soldi: 90, xp: 90, oggetti: { pomata: 3 }, amicizia: { pastiglia: 8 } },
    grazie: "Perfette. Il cliente è pelato come una boccia, ma da domani sarà pelato e felice. Tieni.",
    requisiti: { livello: 10, dopo: 'farmacia_noci' },
  },
  // Ambulatorio
  dottore_mele: {
    da: 'dottorMutua', titolo: 'Una mela al giorno',
    offerta: "Dicono che una mela al giorno toglie il medico di torno. Voglio dimostrare che è una bufala. Portami 6 mele: le mangio tutte io e vediamo se sparisco.",
    obiettivo: { consegna: { mela: 6 } },
    premio: { soldi: 35, xp: 50, oggetti: { sciroppo: 2 }, amicizia: { dottorMutua: 10 } },
    grazie: "(crunch) Sei mele. Sono ancora qui. Lo sapevo! La scienza vince. Ho solo un po' di mal di pancia. Tieni, per il disturbo.",
    scusa: "Sei mele, Garonio. Le trovi sugli alberi. Le mele, non i medici.",
    requisiti: { livello: 3 },
  },
  dottore_ratti: {
    da: 'assunta', titolo: 'Ratti in sala d\'attesa',
    offerta: "Ci sono ratti che entrano in sala d'attesa e prendono il numerino. Uno era il 47: ha saltato la fila. Scacciane 6 qua fuori e ti passo avanti a tutti. Per sempre.",
    obiettivo: { evento: 'nemicoSconfitto', filtro: { id: 'ratto' }, n: 6 },
    premio: { soldi: 45, xp: 55, vestiti: ['fazzolettoRosso'], amicizia: { assunta: 12 } },
    grazie: "Bravo. Tieni questo fazzoletto: era del Sergente, l'ha dimenticato qui dopo uno svenimento. Non dirglielo.",
    requisiti: { livello: 5 },
  },
  // Chiesa
  chiesa_gazze: {
    da: 'donPeppino', titolo: 'Le gazze delle offerte',
    offerta: "Figliolo, le gazze entrano dal campanile e mi rubano le monetine delle offerte. Luccicano, capisci. Il Signore perdona, io no. Scacciane 4.",
    obiettivo: { evento: 'nemicoSconfitto', filtro: { id: 'gazza' }, n: 4 },
    premio: { soldi: 50, xp: 60, oggetti: { gingillo: 1 }, amicizia: { donPeppino: 10 } },
    grazie: "Benedetto ragazzo! Una gazza aveva questo anello nel becco. Non è delle offerte... tienilo tu. Il Signore vede, ma non è geloso.",
    requisiti: { livello: 6 },
  },
  chiesa_presepe: {
    da: 'suoraCarmela', titolo: 'Il presepe di pigne',
    offerta: "Quest'anno il presepe lo facciamo con le pigne. Le pecore, i Re Magi, il bue. Tutto di pigne. Mi servono 5 pigne e 2 nidi per le mangiatoie. Scuoti gli alberi, ma con educazione.",
    obiettivo: { consegna: { pigna: 5, nido: 2 } },
    premio: { soldi: 30, xp: 65, oggetti: { biscotti: 4 }, amicizia: { suoraCarmela: 14 } },
    grazie: "Perfette. Questa diventa San Giuseppe, questa l'asinello, questa... il Gigante, va'. Tieni, i biscotti della sagrestia. Uno a testa, non sei il bue.",
    scusa: "Cinque pigne e due nidi. Non sei capace di contare? La bacchetta è qui.",
    requisiti: { livello: 7 },
  },
  // Castello del Conte
  castello_tappeto: {
    da: 'conte', titolo: 'Il tappeto del Conte',
    offerta: "Il mio trisavolo aveva un tappeto di lupo nel salone. Mia moglie l'ha venduto per pagare la luce. Mi serve una pelliccia di lupo prima che lei se ne accorga. Ah, non ho soldi: pagherò in prestigio.",
    obiettivo: { consegna: { pelleLupo: 1 } },
    premio: { soldi: 180, xp: 160, vestiti: ['giaccaVento'], amicizia: { conte: 15 } },
    grazie: "Magnifica! Ho trovato dei soldi nella giacca del nonno, eccoli. E la giacca pure: era del consorzio, il nonno la rubò nel '62. Prestigio, ragazzo.",
    requisiti: { livello: 14 },
  },
  castello_argenteria: {
    da: 'ambrogio', titolo: 'L\'argenteria del Conte',
    offerta: "Mi perdoni l'ardire. L'argenteria del Conte è sparita, un cucchiaino alla volta. Sospetto le gazze. O il Conte, che la impegna. Mi porti tre gingilli luccicanti: li lucido e nessuno noterà la differenza.",
    obiettivo: { consegna: { gingillo: 3 } },
    premio: { soldi: 140, xp: 120, amicizia: { ambrogio: 15, conte: 3 } },
    grazie: "Splendidi. Questo è un anello del Patata, ma servito su un vassoio d'argento farà la sua figura. Gradisca il compenso, e la mia eterna discrezione.",
    requisiti: { livello: 11 },
  },
  // Kebab, pizzeria, officina
  kebab_patate: {
    da: 'kemal', titolo: 'Le patatine di Kemal',
    offerta: "Amico! Le patatine finite. Il fornitore dice «domani», ma domani non esiste. Portami 5 patate del Patata e ti faccio un kebab con tutto. TUTTO. Anche cose che non sai.",
    obiettivo: { consegna: { patata: 5 } },
    premio: { xp: 40, oggetti: { kebab: 4 }, amicizia: { kemal: 12, patata: 3 } },
    grazie: "Patate bellissime! Il Patata le ha anche chiamate per nome, ho sentito. Questa era Gina. Mi dispiace Gina. Tieni, kebab!",
    scusa: "Cinque patate, amico. Va' dal Patata: le tiene come figli, ma per Kemal fa uno sconto.",
    requisiti: { livello: 3 },
  },
  pizzeria_pettegolezzo: {
    da: 'concetta', titolo: 'Il pettegolezzo della Concetta',
    offerta: "Senti questa: la Vigilessa esce con uno. Non so chi. Vai a chiederglielo tu, con nonchalance. Se scopro chi è prima della Loredana, ti offro le pizze per una settimana. Vabbè, due pizze.",
    obiettivo: { parla: 'vigilessa' },
    premio: { xp: 35, oggetti: { pizza: 2 }, amicizia: { concetta: 10, vigilessa: -2 } },
    grazie: "Io? Uscire con qualcuno? Garonio, fatti gli affari tuoi. (diventa rossa come il semaforo) ...È uno del municipio. Se lo dici alla Concetta ti faccio la multa per eccesso di curiosità. (La Concetta ti ha lasciato due pizze: la missione è fatta.)",
    requisiti: { livello: 4 },
  },
  officina_ricambi: {
    da: 'ivan', titolo: 'I pezzi per la Punto di Ivan',
    offerta: "(si toglie una cuffia) Sto truccando la Punto. Zeno non lo deve sapere. Mi servono 2 pezzi di ricambio e 4 di ferro vecchio. Li trovi rompendo la testa a quelli che ce li hanno. (si rimette la cuffia)",
    obiettivo: { consegna: { rottame: 2, ferro: 4 } },
    premio: { soldi: 110, xp: 110, vestiti: ['salopette'], amicizia: { ivan: 15 } },
    grazie: "Yesss. Adesso la Punto fa 140 in discesa. Tieni la mia salopette di riserva, è quasi pulita. Quasi.",
    requisiti: { livello: 9 },
  },
  // Il Bubetto e gli alberi col tesoro
  bubetto_alberi: {
    da: 'bubetto', titolo: 'Il tesoro tra i rami',
    offerta: "Ti dico un segreto. Mio nonno nascondeva gli attrezzi sugli alberi, per non prestarli. Anche quelli del bisnonno, e dei vicini. Sono ancora lassù. Scuoti 15 alberi e vedrai. E se trovi qualcosa che non ti serve, io compro.",
    obiettivo: { evento: 'alberoScosso', filtro: {}, n: 15 },
    premio: { soldi: 30, xp: 40, vestiti: ['cappellone'], amicizia: { bubetto: 6 } },
    grazie: "Hai visto? Quel cappello lì l'aveva perso il nonno nel '71. Tienilo, a me sta largo. Cioè, è largo apposta.",
    requisiti: { livello: 2 },
  },
};

// le missioni dei personaggi degli altri edifici (src/data/dentro.js)
Object.assign(SECONDARIE, MISSIONI_DENTRO);
