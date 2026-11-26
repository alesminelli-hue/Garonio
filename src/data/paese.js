// =====================================================================
//  IL PAESE REAGISCE ALL'AZIENDA (src/paese.js, GDD capitolo 27.5)
//  Quando Garonio ha la Cascina dei Salici:
//  - gli AGRICOLTORI lo trattano da pari: lo salutano come un collega (quasi sempre);
//  - gli altri personaggi, a volte, al posto del saluto solito fanno un commento sull'azienda,
//    a caso tra 3-4 frasi, positive o negative a seconda del carattere;
//  - alcune RAGAZZE sono più facili da conquistare: ogni risposta non sbagliata vale un po' di più,
//    e ogni tanto lo salutano parlando dell'azienda.
// =====================================================================

export const PROB_COMMENTO = 0.55;   // quanto spesso un personaggio commenta l'azienda invece del saluto solito
export const PROB_PARI = 0.8;        // quanto spesso un agricoltore saluta da collega

// gli agricoltori: rispetto da pari
export const AGRICOLTORI = {
  patata: [
    "Collega! Le patate le metti? No? Ah. Rispetto lo stesso. Da agricoltore ad agricoltore.",
    "Imprenditore! Vieni, ti faccio vedere il mio trattore. Te lo faccio toccare. Solo a te, perché sei del mestiere.",
    "Adesso che hai la cascina capisci quanto è dura. La mattina. La sera. Le patate. Soprattutto le patate.",
  ],
  postino: [
    "Buongiorno, collega. Ho una lettera per l'Azienda Agricola Garonio. No, non l'ho aperta. L'ho solo letta.",
    "Da quando hai la cascina ti porto più posta che al sindaco. Bollette, PAC, consorzio. Benvenuto nel club, collega.",
    "Tra agricoltori ci si aiuta: se ti serve sapere chi vende i maiali a meno, chiedi a me. Io so tutto.",
  ],
  frank: [
    "Howdy, partner! Adesso siamo due ranch nella Bassa. Tu e io. Come in Texas. Ma con la nebbia.",
    "Rispetto, cowboy. Un uomo con la sua terra è un uomo libero. Anche se la terra è a Saint James Borough.",
    "Partner, quando vuoi facciamo affari. Io ti do il pozzo, tu mi dai i maiali. Stretta di mano da uomini.",
  ],
  camper: [
    "Ehi, padrone! Hai seguito il mio consiglio? La porcilaia prima di tutto. Bravo. Sei meglio di tuo padre.",
    "Adesso sei uno di noi. Uno che si alza alle cinque e va a letto con le mani rotte. Benvenuto, collega.",
    "Te l'avevo detto: la terra è tutto. Ma il geometra... evitalo. Sempre.",
  ],
  rodella: [
    "Il mio Imprenditore preferito! Da collega a collega: hai visto il trattore arancione? Ti guarda. Ti chiama.",
    "Tra professionisti ci si capisce. Tu produci, io vendo. Tu paghi, io sorrido. È un ecosistema.",
    "Collega! Che piacere! Quando sento «azienda agricola» mi si apre il portafoglio. Il tuo, intendo.",
  ],
};

// gli altri: commenti sull'azienda, positivi e negativi secondo il carattere
export const COMMENTI = {
  mamma: [
    "Il mio bambino ha una cascina! Ho detto a tutte le signore della messa che sei un imprenditore. Non sanno cosa vuol dire, ma sono invidiose.",
    "Mangi abbastanza? Con tutto quel lavoro alla cascina... Ti ho fatto le lasagne. Tre teglie. Per i garzoni, dico.",
    "Tuo padre non te lo dirà mai, ma ieri ha guardato la tua cascina dalla finestra per mezz'ora. Poi ha detto «mah».",
  ],
  consulente: [
    "Ottima mossa, la cascina. Te lo dicevo io. Non te l'ho mai detto, ma lo pensavo.",
    "Ti do un consiglio da amico: i maiali rendono, il grano d'inverno no. E non comprare mai niente da Rodella di venerdì: è il giorno in cui ha i prezzi «speciali».",
    "Adesso sei uno che conta. Offri tu da bere? Così, per festeggiare. E per ricordarti degli amici.",
  ],
  loredana: [
    "Il signor Imprenditore! Il solito? Ah, adesso devi prendere il prosecco, sei un uomo d'affari.",
    "In paese dicono che hai comprato la cascina con i soldi delle truffe di tuo padre. Io non lo dico. Lo ripeto e basta.",
    "Da quando hai la cascina paghi sempre? Strano. Mi mancano i tuoi conti in sospeso. Quasi.",
    "Hai la faccia di uno che dorme quattro ore. Benvenuto nel mondo degli adulti, Garonio.",
  ],
  zeno: [
    "Uh, l'imprenditore. Allora adesso il tagliando del trattore costa il doppio. È la legge del mercato.",
    "Hai preso il trattore da Rodella? Te l'ha venduto con le gomme giuste? No, perché di solito no.",
    "Cascina, maiali, trattori... e la Vespa? La Vespa si spegne ancora. Quella non te la sistema nessuno.",
  ],
  bubetto: [
    "Ah, il nuovo padrone dei Salici! Al magazzino ho dei cappelli da imprenditore. Sono uguali a quelli da contadino, ma costano di più.",
    "Ti serve roba per la cascina? Ho tutto: forconi, secchi, un cavallo a dondolo. Il cavallo non serve, ma ce l'ho.",
    "Complimenti! Quando fallisci, ricordati che compro tutto all'asta. Scherzo. Più o meno.",
  ],
  vigilessa: [
    "Azienda agricola, eh? Allora adesso le multe le faccio all'azienda. Stessa cifra, ma con l'IVA.",
    "I trattori della tua azienda in strada vanno a quaranta all'ora. Lo dico per te. E per il mio blocchetto, che ha fame.",
    "Complimenti per la cascina. Davvero. Ma il cartello VENDESI l'hai tolto con l'autorizzazione del comune? Ah, sì. Peccato.",
  ],
  donPeppino: [
    "Figliolo! Ho sentito della cascina. La Provvidenza lavora in modi misteriosi. A volte anche coi maiali.",
    "Una cascina è una benedizione. Te la benedico io, gratis. Cioè, con un'offerta. Libera. Ma non troppo libera.",
    "Ricordati: «Beati i ricchi»... no, aspetta, non era così. Comunque passa a messa, che adesso hai un'immagine.",
  ],
  suoraCarmela: [
    "Un'azienda. Tu. Che a catechismo mangiavi le ostie non consacrate. Il Signore è davvero misericordioso.",
    "Spero che nella tua cascina si lavori e non si dorma nel fieno. Ti tengo d'occhio. Anche da lontano. Soprattutto da lontano.",
    "Brava la mamma, che ti ha cresciuto. Il merito è suo, sappilo.",
  ],
  conte: [
    "Un Garonio proprietario terriero. I miei antenati si rivolterebbero nella tomba. Ma la tomba ha bisogno di restauri: mi presti dei soldi?",
    "Benvenuto tra i possidenti, caro. Ora capirà il peso della terra. E delle tasse sulla terra. Soprattutto quelle.",
    "La Cascina dei Salici era della mia famiglia, nel 1700. L'abbiamo persa a carte. Se vuole ridarmela, accetto con dignità.",
  ],
  ambrogio: [
    "Mi permetta di congratularmi, signor Garonio. Se mai cercasse un maggiordomo... pagato... mi faccia sapere. Con discrezione.",
    "Il signor Conte ha visto la sua cascina e ha detto «che volgarità». Poi ha chiesto quanto rende.",
    "Una tenuta, signore. Con una tenuta si comincia. Poi vengono i debiti, ma quella è un'altra storia. La nostra.",
  ],
  pastiglia: [
    "Imprenditore agricolo? Allora le serve il pacchetto «stress da titolare»: camomilla, valeriana e una pillola blu. Per la pressione. Solo per la pressione.",
    "Ho una pastiglia per i maiali nervosi. Funziona anche sugli imprenditori. Due al giorno.",
    "Lei adesso è un uomo in vista. Le consiglio il collirio: tutti la guardano, e lei deve guardarli meglio.",
  ],
  dottorMutua: [
    "Ah, l'imprenditore. Pressione alta, sonno poco, colesterolo da salame. Benvenuto: adesso è un vero agricoltore.",
    "Si ricordi: l'azienda va avanti anche se lei si riposa. No, scherzo, non va avanti. Però si riposi lo stesso.",
    "Le faccio un certificato di sana e robusta costituzione per la banca? Sana no, robusta sì.",
  ],
  assunta: [
    "Un'azienda, e ancora vieni in ambulatorio senza appuntamento? I titolari prendono il numero come tutti.",
    "Complimenti, Garonio. Adesso quando ti fai male lavorando è un infortunio sul lavoro. Compila il modulo.",
    "Mia cugina dice che sei diventato ricco. Io dico che sei diventato stanco. Si vede dalle occhiaie.",
  ],
  sergente: [
    "Recluta! Anzi, comandante! Una cascina è un battaglione: maiali, galline, mucche. Disciplina, ordine, e niente pisolini nel fieno!",
    "Ti sei fatto un'azienda. Bene. Ma la pancia è sempre quella. Un imprenditore deve avere il fisico. Venti flessioni. ADESSO.",
    "Ho sentito che dai ordini a un garzone. Finalmente qualcuno a cui urli tu. Non è bello? Eh? È bello.",
  ],
  gennaro: [
    "Uè, l'imprenditore! La mozzarella me la fai tu adesso? Con il latte della tua stalla? Mamma mia, che pizza ci facciamo!",
    "Tengo un'idea: pizza «Garonio». Con salsiccia dei tuoi maiali e mais della tua cascina. Il mais sulla pizza no, però. Ho una dignità.",
    "Da quando hai la cascina, mangi qua e paghi. Mi commuovo. Canto una canzone per te. Una triste, per abitudine.",
  ],
  concetta: [
    "Tutte le ragazze del paese parlano di te, sai? «Garonio ha la cascina, Garonio ha i soldi». Prima dicevano solo «Garonio puzza».",
    "Ho sentito che una certa persona ha chiesto di te. Non posso dire chi. Inizia con una lettera. Una qualsiasi.",
    "Imprenditore! Allora la mancia adesso la lasci, vero? Vero?",
  ],
  kemal: [
    "Amico imprenditore! Kebab speciale per te: doppia carne, dei tuoi maiali no, che io non posso. Ma doppia.",
    "Anche io ho un'azienda: questo kebab. Siamo colleghi. Aperti tutta la notte, come le galline. No, le galline dormono.",
    "Tu adesso ricco, eh? Allora la salsa piccante la paghi. Prima era gratis per pietà.",
  ],
  ivan: [
    "Bella zio, hai una cascina? Tipo... vera? Con le mucche vere? Pazzesco. (si rimette le cuffie)",
    "Se ti serve un garzone... no aspetta, io lavoro già per Zeno. Però Zeno non paga. Quanto paghi?",
    "Il tuo trattore nuovo ha il bluetooth? No? Allora è vecchio, zio.",
  ],
  bossmm: [
    "Il nuovo proprietario dei Salici. Ricordi: i confini della cascina finiscono dove inizia il parco. Ho la mappa. E il fischietto.",
    "Un imprenditore deve dare l'esempio. Niente legna rubata nel parco. Neanche per la stufa della taverna.",
    "Complimenti. Davvero. Ora ha qualcosa da perdere: ci pensi prima di entrare di notte nel mio parco.",
  ],
  guardia1: [
    "(fischio) Imprenditore! Il parco non è una dependance della sua cascina! (fischio)",
    "Ho visto il suo trattore nuovo. Bello. Se entra nel parco glielo multo. Bello lo stesso.",
    "(fischio lungo) Era un fischio di complimenti. Ne ho anche uno di rimprovero, se serve.",
  ],
  guardia2: [
    "Annoto: «Garonio, ora imprenditore agricolo». Annoto anche: «ha la stessa faccia di prima».",
    "Con l'azienda le conviene comportarsi bene. Ho un taccuino nuovo, tutto per lei.",
    "Pagina 112: «Il soggetto compra una cascina». Pagina 113: «Il soggetto saluta». Pagina 114: libera, per ora.",
  ],
};

// le ragazze che si lasciano conquistare più facilmente da un ragazzo con un'azienda (bonus = affinità in più
// per ogni risposta non sbagliata) e un saluto in più
export const RAGAZZE_AZIENDA = {
  ludovica: { bonus: 6, saluti: [
    "«Mi dicono che possiedi la Cascina dei Salici. E un trattore arancione. Garonio... sei un partito. Non ridere, è un termine tecnico.»",
    "«Il tetto del castello ha bisogno di un uomo con una visione. E con un'azienda agricola. Sto parlando in astratto, naturalmente.»",
  ] },
  federica: { bonus: 5, saluti: [
    "«Ho fatto i carotaggi alla Cascina dei Salici, sai? Terreno franco-limoso. Bellissimo. Sei fortunato. E forse anche io.»",
    "«Un imprenditore agricolo che sa cos'è il pH del terreno sarebbe il mio sogno. Tu non lo sai, ma posso insegnartelo.»",
  ] },
  sabrina: { bonus: 4, saluti: [
    "«Imprenditore, eh? Mi piacciono gli uomini che sanno cosa vogliono. E che hanno un posto dove andare che non sia la casa della mamma.»",
    "«Ho sentito che hai una villa con la piscina. Gonfiabile, dicono. Io dico che un inizio è un inizio.»",
  ] },
  ilenia: { bonus: 4, saluti: [
    "«Passo a ritirare il latte alla tua stalla, domattina. Così, per lavoro. Fatti trovare sveglio, imprenditore.»",
    "«Un uomo con la sua stalla e un camion del latte che passa ogni mattina. Sembra l'inizio di una canzone di Ligabue.»",
  ] },
};
