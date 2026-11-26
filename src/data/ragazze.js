// =====================================================================
//  LE RAGAZZE DEL PAESE — il dating simulator di Garonio
//  Solo dati e testi: si cambiano senza toccare il codice (logica in src/ragazze.js).
//
//  Ogni ragazza è un personaggio (PNG) come gli altri: posti, giro, aspetto (src/data/png.js).
//  gusti: quanto le piace ogni «tono» di risposta: +1 le piace, 0 così così, −1 la fa scappare.
//    Toni: sicuro, ironico, romantico, sincero, spaccone, bisognoso, cafone.
//  approccio: domande del primo corteggiamento (ne escono 2 a incontro).
//  appuntamento: domande della serata (ne escono 3).
//  Ogni risposta: { t: cosa dice Garonio, tono, r: come reagisce lei }.
//  posto: il posto dell'appuntamento che preferisce (vedi LUOGHI).
//  aspetto.ricolora: variante di colore dello sprite (vedi src/pixel.js), per non avere due ragazze uguali.
//  Tutte adulte, tutte con la battuta pronta. Niente scene: in camera si sfuma al nero.
// =====================================================================

export const RAGAZZE = {
  debora: {
    nome: 'Blu Belga', eta: 32, icona: '🏋️‍♀️',
    chi: 'Personal trainer alla palestra «Bicipite d\'Oro» di Newbarley. Corre sulla capezzagna la mattina presto.',
    dove: 'Fa jogging sulla capezzagna dalle 7 alle 10:30.',
    jogging: true,
    posti: [{ ore: [7, 10.5], x: 27, z: 29.4 }],
    giro: [[27, 29.4], [62, 29.4], [104, 29.4], [62, 29.4]],
    vel: 2.7,
    aspetto: { sprite: 'sportiva', w: 15, h: 23, skin: '#e8b48a', hair: '#2a1a12', hairStyle: 'coda', shirt: '#e83a7a', pants: '#2a2a3a', boots: '#f4f4f4', eyes: 'normal' },
    gusti: { sicuro: 1, sincero: 1, ironico: 0, romantico: 0, spaccone: -1, bisognoso: -1, cafone: -1 },
    posto: 'pizzeria',
    saluti: [
      "(senza smettere di correre sul posto) «Ciao. Hai trenta secondi, poi riparto. Ventinove...»",
      "«Oh, il figlio del Gigante. Ti ho visto dormire nel fosso, ieri. Bella postura, comunque.»",
      "«Garonio! Fatte le scale stamattina? No? Neanche quelle di casa? Ok.»",
      "(ti sorpassa senza fermarsi) «Ti saluto da qui, se mi fermo mi si raffreddano i polpacci.»",
      "«Ho visto il Gigante sollevare un vitello. Tu hai preso tutto da tua madre, eh?»",
      "«Ciao. Hai l'aria di uno che ha mangiato cotechino a colazione. Lo sento da qui.»",
      "«Oggi è il giorno delle gambe. Per me. Per te è il giorno del divano, come sempre.»",
      "«Il Sergente dice che sei una recluta persa. Io dico che sei una recluta in ritardo. Di dieci anni.»",
    ],
    primaVolta: "Una ragazza in tuta fucsia ti sorpassa, si ferma e corre sul posto davanti a te. «Blu Belga. Personal trainer. E tu hai la faccia di uno che non fa uno squat dal 2009.»",
    approccio: [
      { d: "«Quanti chilometri fai a settimana?»", a: [
        { t: "«Nessuno. Però li guido tutti col trattore.»", tono: 'sincero', r: "(ride) «Almeno sei onesto. Gli altri mi dicono \"una decina\" e poi svengono al primo palo.»" },
        { t: "«Una cinquantina. Così, per scaldarmi.»", tono: 'spaccone', r: "«Cinquanta? Allora domattina vieni con me. Alle sei.» Garonio impallidisce. Lei lo nota." },
        { t: "«Dipende. Se mi corri davanti, anche cento.»", tono: 'sicuro', r: "«Mh. Frase fatta, ma detta con convinzione. Te la passo.»" },
      ] },
      { d: "«Cosa ci fai sulla mia capezzagna alle otto di mattina?»", a: [
        { t: "«Cercavo te. Ho sentito che qui passa la più veloce del paese.»", tono: 'sicuro', r: "«Più veloce della Vigilessa, almeno. Lei mi ha multata per eccesso di velocità. A piedi.»" },
        { t: "«Mio padre mi ha cacciato di casa per lavorare. Sto facendo finta.»", tono: 'sincero', r: "«Lo sapevo. Hai la faccia di uno che finge benissimo. Rispetto.»" },
        { t: "«Ti prego parlami, è da settimane che non parlo con nessuno...»", tono: 'bisognoso', r: "«Ehm. Prova col Consulente. Lui parla con tutti.» Riparte di scatto." },
      ] },
      { d: "«Ti alleni? Sinceramente.»", a: [
        { t: "«Sollevo sacchi di mangime da quaranta chili. Per sbaglio, ma li sollevo.»", tono: 'sincero', r: "«Il sollevamento accidentale. Lo inserisco nel programma.»" },
        { t: "«Ho un fisico naturale. Non ne ho bisogno.»", tono: 'spaccone', r: "(ti pizzica la pancia) «Naturale, sì. Come la polenta.»" },
        { t: "«Se mi alleni tu, comincio domani.»", tono: 'sicuro', r: "«Domani non esiste, campione. Esiste adesso. Però l'offerta la segno.»" },
      ] },
      { d: "«Che musica ascolti quando corri?»", a: [
        { t: "«Gigi D'Agostino. Anche quando non corro.»", tono: 'ironico', r: "«L'Amour Toujours sulla capezzagna. Ok, questo è un punto per te.»" },
        { t: "«Il silenzio interiore. E il rumore del mio cuore che batte per te.»", tono: 'romantico', r: "«...Sto cercando di non vomitare il frullato. Riproviamo un'altra volta.»" },
        { t: "«Quella che ascolti tu, così ne parliamo.»", tono: 'sicuro', r: "«Furbo. Rock anni Ottanta. Adesso sei obbligato a imparare i Queen.»" },
      ] },
      { d: "«Cosa mangi a colazione? Non mentire, ti vedo la pancia.»", a: [
        { t: "«Pane e salame. A volte solo salame, per risparmiare il pane.»", tono: 'sincero', r: "«Almeno è proteina. Ti salvi per un pelo. Di maiale.»" },
        { t: "«Sei uova crude, come Rocky.»", tono: 'spaccone', r: "«Sei uova? Ho visto le tue galline. Non ne fanno sei in una settimana.»" },
        { t: "«Quello che decidi tu. Domani colazione insieme e mi fai vedere.»", tono: 'sicuro', r: "«Mi stai chiedendo un appuntamento travestito da piano alimentare. Furbo. Avena alle sette.»" },
      ] },
      { d: "«Il Sergente dice che sono troppo severa coi clienti. Tu che dici?»", a: [
        { t: "«Che se non fossi severa saresti il Sergente. E nessuno vuole essere il Sergente.»", tono: 'ironico', r: "«Neanche lui vuole esserlo. L'ho sentito piangere negli spogliatoi.»" },
        { t: "«Che fai bene. Se nessuno mi urla dietro, io non faccio niente.»", tono: 'sincero', r: "«Tuo padre è un personal trainer e non lo sa. E tu lo ammetti. Mi piace.»" },
        { t: "«Severa con me? Non ci riusciresti. Sono indistruttibile.»", tono: 'spaccone', r: "«Dieci burpees. Adesso. ...Ecco, sei già distrutto. Erano tre.»" },
      ] },
      { d: "«Perché mi guardi le scarpe?»", a: [
        { t: "«Perché sono l'unica cosa ferma di te. Il resto va troppo veloce.»", tono: 'sicuro', r: "«Ok, questa me la scrivo sullo specchio della palestra.»" },
        { t: "«Sono belle. Quanto costano? Mi servono per scappare da Mister Mountain.»", tono: 'sincero', r: "«Centottanta euro. Ma da Mountain non si scappa con le scarpe, serve allenamento. Ti faccio un prezzo.»" },
        { t: "«Ti prego non correre via di nuovo, non ti raggiungo mai...»", tono: 'bisognoso', r: "«Appunto. Ciao!» E riparte di scatto." },
      ] },
    ],
    appuntamento: [
      { d: "«Allora, Garonio. Cosa vuoi fare da grande? E non dire \"il figlio del Gigante\".»", a: [
        { t: "«Voglio prendere in mano l'azienda. Ma a modo mio.»", tono: 'sicuro', r: "«Un piano. Uno vero. Ok, sono colpita. Poco. Ma colpita.»" },
        { t: "«Il gatto. Volevo fare il gatto. Mia madre lo racconta ancora.»", tono: 'sincero', r: "(ride col boccone in bocca) «Un sogno ambizioso. Dormi già sedici ore, sei a metà strada.»" },
        { t: "«Il milionario. Ho già tre idee: le criptovalute delle nutrie...»", tono: 'spaccone', r: "«Le cripto-nutrie. Ah. Ok. Mi passi il sale?»" },
      ] },
      { d: "«Io mangio solo la metà della pizza. L'altra metà la vuoi tu?»", a: [
        { t: "«Mangiala tutta. È il tuo cheat day, te lo meriti.»", tono: 'sicuro', r: "«...Hai detto la cosa giusta. Nessuno mi ha mai detto la cosa giusta.»" },
        { t: "«Sì sì sì, dammela tutta!»", tono: 'cafone', r: "Garonio si avventa sulla pizza. Blu Belga lo guarda come si guarda un procione nella spazzatura." },
        { t: "«Facciamo a metà della metà. Così è un allenamento di coppia.»", tono: 'ironico', r: "«Allenamento di coppia. Mh. Questa la rubo per i miei clienti.»" },
      ] },
      { d: "«Il mio ex correva le maratone. Tu cosa sai fare meglio di lui?»", a: [
        { t: "«Fermarmi. A guardarti.»", tono: 'romantico', r: "«Ok, era sdolcinata. Però l'hai detta guardandomi negli occhi. Pareggio.»" },
        { t: "«Ascoltarti. Lui correva sempre via, no?»", tono: 'sincero', r: "(si ferma un attimo) «...Sì. Correva via. Brutto, eh, quando uno ti capisce al primo appuntamento.»" },
        { t: "«Tutto. Sono meglio in tutto, di chiunque.»", tono: 'spaccone', r: "«Anche a pagare il conto? Perché lui almeno pagava.»" },
      ] },
      { d: "«Domani mattina alle sei corro. Vieni anche tu?»", a: [
        { t: "«Ci sarò. Lento, sudato e in pigiama, ma ci sarò.»", tono: 'sincero', r: "«In pigiama. Ti tengo il posto. Il posto in fondo, ovviamente.»" },
        { t: "«Alle sei? Ma le sei esistono davvero?»", tono: 'ironico', r: "«Esistono. Sono quelle in cui tu russi. Ti mando un vocale per svegliarti.»" },
        { t: "«Solo se mi porti in braccio.»", tono: 'bisognoso', r: "«Io porto in braccio i bilancieri, Garonio. Non gli uomini adulti.»" },
      ] },
      { d: "«Gennaro mi ha portato la pizza senza mozzarella perché sa che sono a dieta. Gli dico qualcosa?»", a: [
        { t: "«Ci penso io: \"Gennaro, stasera la signorina mangia come un camionista\". E pago io.»", tono: 'sicuro', r: "«Mi hai difesa da una pizza dietetica. Sei un eroe minore, ma un eroe.»" },
        { t: "«Ti do metà della mia. È salsiccia e cipolla, ti faccio un favore.»", tono: 'sincero', r: "«Domani un'ora di tapis roulant. Ma stasera grazie.»" },
        { t: "«GENNAROOO! PORTA ROBA!»", tono: 'cafone', r: "Gennaro smette di cantare. Tutta la pizzeria si gira. Blu Belga si nasconde dietro al menu." },
      ] },
      { d: "«Dimmi una cosa di cui hai paura. Una vera.»", a: [
        { t: "«Di deludere mio padre. E delle oche. Più delle oche, a dire il vero.»", tono: 'sincero', r: "«Le oche fanno paura anche a me. Sul resto ci lavoriamo. Una ripetizione alla volta.»" },
        { t: "«Paura? Io ho preso a schiaffi un cinghiale.»", tono: 'spaccone', r: "«Era un sacco della spazzatura, Garonio. La Pina ha il video.»" },
        { t: "«Di essere qui con te e non saperlo fare bene. Ma ci sono lo stesso.»", tono: 'sicuro', r: "«Questa era coraggiosa. Il coraggio è un muscolo. Il tuo stasera lavora.»" },
      ] },
    ],
    maestro: "«...Va bene, mi hai fregata. Era la risposta perfetta. Non abituarti.»",
    numero: "«Tieni. Il mio numero. Se mi scrivi \"ciao\" con tre punti di sospensione ti blocco.»",
    accetta: "«Un appuntamento? Mh. Ok. Ma niente sushi del discount: l'ultimo mi ha fatto saltare una gara.»",
    rifiuta: "«Uscire con te? Fammi vedere prima che arrivi in fondo alla capezzagna senza fermarti.»",
    bacio: "A fine serata Blu Belga ti dà un bacio veloce e deciso, come un allenamento a intervalli. «Ok. Promosso. Ci risentiamo.»",
    sale: "«Senti... casa mia è qui dietro. Ho la cyclette nuova da farti vedere. E no, non è un modo di dire. Cioè sì. Vieni?»",
    letto: "Ventidue minuti dopo Blu Belga guarda il cardiofrequenzimetro: «Zona aerobica raggiunta. Bravo, campione.»",
    reputazione: "«Mi piaci, eh. Ma in paese si dicono cose su di te... la Pina mi ha già scritto tre messaggi. Un'altra volta, ok?»",
    blocco: "Blu Belga ti supera di corsa senza guardarti. Sulla tuta, la scritta «NON FERMARTI MAI». Vale anche per te.",
    conquistata: [
      "«Ehi, il mio compagno di cyclette. Corri due giri con me?»",
      "«Oggi gambe o braccia? Scherzo. Per te, divano.»",
      "«Ho messo la tua foto nella bacheca \"prima\" della palestra. Prima o poi ci mettiamo anche quella \"dopo\".»",
      "«Stamattina ho corso pensando a te e ho fatto il record. Adesso mi sento in colpa per il record.»",
      "«Se ti becco con un cornetto ti faccio fare un giro di campo. Se lo dividi con me, mezzo giro.»",
    ],
  },

  federica: {
    nome: 'Federica', eta: 28, icona: '📚',
    chi: 'Agronoma, fa il dottorato sui terreni della Bassa. Corre la sera verso il ponte. Smonta le balle in tre secondi.',
    dove: 'Fa jogging sulla capezzagna verso il ponte, dalle 17 alle 20.',
    jogging: true,
    posti: [{ ore: [17, 20], x: 80, z: 29.6 }],
    giro: [[80, 29.6], [116, 29.6], [150, 29.6], [116, 29.6]],
    vel: 2.3,
    aspetto: { sprite: 'mora_rosso', w: 15, h: 23, skin: '#f2c8a8', hair: '#c0602a', hairStyle: 'coda', shirt: '#3aa07a', pants: '#3a3a4a', boots: '#e8e0d0', eyes: 'normal' },
    gusti: { ironico: 1, sincero: 1, sicuro: 0, romantico: 0, spaccone: -1, cafone: -1, bisognoso: -1 },
    posto: 'laghetto',
    saluti: [
      "«Garonio. Sto calcolando la sostanza organica del campo di tuo padre. È più alta della tua, senza offesa.»",
      "(si toglie un auricolare solo) «Ho un podcast sui nematodi a metà. Sii breve e interessante.»",
      "«Ho analizzato un campione del tuo campo. Contiene argilla, limo e la tua dignità.»",
      "«Lo sai che le nutrie hanno una vita sociale più ricca della tua? L'ho misurato.»",
      "«Ho appena fatto ridere un lombrico. Scherzo, i lombrichi non ridono. Però si è mosso.»",
      "«Il mio relatore mi ha risposto a una mail dopo quaranta giorni. Mi sento corteggiata.»",
      "«Ho un panino al cavolo cappuccio e trentasette tabelle Excel. Che giornata.»",
      "«La nebbia della Bassa è un fenomeno affascinante. No, eh? Si vede dalla faccia.»",
    ],
    primaVolta: "Una ragazza coi capelli rossi e una coda alta si ferma a raccogliere una zolla dal campo. La annusa. Poi guarda te. «Federica. Faccio il dottorato sui suoli. Anche tu sei un po' argilloso, sai?»",
    approccio: [
      { d: "«Sai cos'è il pH del terreno?»", a: [
        { t: "«No. Ma mi sembra un argomento in cui potresti stregarmi.»", tono: 'ironico', r: "«\"Stregarmi\" e \"pH\" nella stessa frase. Sei il primo. Nessuno ci aveva mai provato.»" },
        { t: "«Certo. È una cosa... chimica. Basica. Tipo.»", tono: 'spaccone', r: "«Basica. Tipo. Ti boccerei, ma mi fai tenerezza.»" },
        { t: "«No, però mio padre sì. E lo usa per urlarmi contro.»", tono: 'sincero', r: "«Il Gigante conosce il pH? Ok, adesso voglio intervistarlo. Tu mi fai da tramite.»" },
      ] },
      { d: "«Perché mi segui da cinque minuti? Ti ho visto, eh.»", a: [
        { t: "«Non ti seguivo. Andavo nella tua stessa direzione con molto interesse.»", tono: 'ironico', r: "«\"Con molto interesse\". Segnato a verbale. Puoi continuare a camminare nella mia direzione.»" },
        { t: "«Volevo dirti che sei la cosa più bella della capezzagna.»", tono: 'romantico', r: "«La concorrenza è un fosso, tre nutrie e un trattore rotto. Grazie, credo.»" },
        { t: "«Sono il proprietario di tutto questo. Posso andare dove voglio.»", tono: 'spaccone', r: "«Il proprietario è tuo padre. Tu sei... il comodato d'uso.»" },
      ] },
      { d: "«Che libro stai leggendo?»", a: [
        { t: "«Il libretto d'istruzioni della Vespa. Ci sono dei colpi di scena.»", tono: 'ironico', r: "(ride forte) «La Vespa blu che non parte? Allora è un thriller.»" },
        { t: "«Nessuno. Però dimmi tu cosa leggere, che comincio.»", tono: 'sincero', r: "«Ti presto \"Il suolo vivente\". Se arrivi a pagina trenta, ti offro un caffè.»" },
        { t: "«Leggo solo i grandi classici. Tipo... quello lì famoso.»", tono: 'spaccone', r: "«\"Quello lì famoso\". Il capolavoro di Autore Qualcuno. Lo conosco bene.»" },
      ] },
      { d: "«Cosa pensi delle nutrie? Domanda seria.»", a: [
        { t: "«Le odio. Ma con rispetto. Sono nemiche degne.»", tono: 'ironico', r: "«Una rivalità rispettosa. Ti vedo, Garonio. Vi vedo, entrambi.»" },
        { t: "«Le temo. Una mi ha preso un calzino. Mai più ritrovato.»", tono: 'sincero', r: "«Lo usano per i nidi. Il tuo calzino adesso ospita una famiglia. Sei un benefattore.»" },
        { t: "«Le sterminerei tutte a mani nude. Grr.»", tono: 'cafone', r: "«Mh. Le nutrie sono ingegneri idraulici fallimentari, mica criminali. Ciao, Garonio.»" },
      ] },
      { d: "«Se fossi un tipo di terreno, quale saresti?»", a: [
        { t: "«Torba. Morbido, umido e prendo fuoco facilmente.»", tono: 'ironico', r: "«La torba! Stai studiando di nascosto. Ammettilo.»" },
        { t: "«Il cemento del piazzale. Non ci cresce niente, ma regge tutto.»", tono: 'sincero', r: "«Più profonda di quanto volessi. Il cemento ha i suoi meriti.»" },
        { t: "«Il terreno più fertile della Bassa. Chiedi in giro.»", tono: 'spaccone', r: "«Ho chiesto. Mi hanno detto: \"il Garonio è sabbia, ci scivola via tutto\".»" },
      ] },
      { d: "«È vero che hai bocciato chimica tre volte?»", a: [
        { t: "«Due. La terza mi sono ritirato per dignità.»", tono: 'ironico', r: "«Ritirato per dignità. È una categoria che metto nella tesi.»" },
        { t: "«Vero. Ma adesso mi piacerebbe capirci qualcosa. Davvero.»", tono: 'sincero', r: "«Va bene. Lezione uno: l'acqua non si chiama \"il liquido\". Partiamo da lì.»" },
        { t: "«Chi te l'ha detto? Dimmi chi è quella pettegola, che le rigo la macchina.»", tono: 'cafone', r: "«Era mia zia. Minacciare le zie. Sexy come la cocciniglia. Ciao.»" },
      ] },
      { d: "«Cerco qualcuno che mi tenga il metro mentre misuro il fosso. Ti offri?»", a: [
        { t: "«Mi offro. Ma poi dici a tutti che il fosso l'ho misurato io.»", tono: 'ironico', r: "«Affare fatto. Nei ringraziamenti: \"a Garonio, che teneva il metro e le pretese\".»" },
        { t: "«Certo. Mi piace stare dove sei tu, anche nel fango.»", tono: 'romantico', r: "«Nel fango. Romantico in un modo molto preciso. Tieni il metro.»" },
        { t: "«Sì, ma tienimi la mano, il fosso mi fa paura...»", tono: 'bisognoso', r: "«È profondo trenta centimetri. Ci si annega solo impegnandosi molto.»" },
      ] },
    ],
    appuntamento: [
      { d: "«Il mio relatore dice che la mia tesi è \"troppo ambiziosa\". Tu che dici?»", a: [
        { t: "«Che il tuo relatore non ha mai visto una nutria in faccia. Tu sì.»", tono: 'ironico', r: "«...Questa la metto nei ringraziamenti. Giuro.»" },
        { t: "«Che se lo è, meglio. Spiegamela.»", tono: 'sincero', r: "Federica parla per venti minuti di azoto. Garonio ascolta davvero. Lei se ne accorge, e sorride." },
        { t: "«Lascia perdere la tesi. Ci sono io adesso.»", tono: 'spaccone', r: "«Ah. Quindi devo scegliere tra il dottorato e un uomo con la tuta macchiata di uovo. Interessante.»" },
      ] },
      { d: "«Guarda le anatre. Secondo te sono felici?»", a: [
        { t: "«Più di me alle sei di mattina. Meno di me adesso.»", tono: 'romantico', r: "«Ok... era un po' sdolcinata. Ma il \"meno di me adesso\" l'hai detto bene.»" },
        { t: "«Quella grossa no. Ha la faccia di mio padre.»", tono: 'ironico', r: "(scoppia a ridere e spaventa le anatre) «È vero! Ha proprio il cipiglio del Gigante!»" },
        { t: "«Sì, ma solo perché nessuna di loro ha un mutuo.»", tono: 'sincero', r: "«Questo è il pensiero più adulto che hai detto stasera. Mi piace.»" },
      ] },
      { d: "«Io parto per un convegno a Wageningen. Tre settimane. Che fai?»", a: [
        { t: "«Ti scrivo tutti i giorni. Anche due volte. Anche venti. Rispondimi, ti prego.»", tono: 'bisognoso', r: "«Venti messaggi al giorno. Così il convegno lo passo a silenziare il telefono.»" },
        { t: "«Ti aspetto. E intanto imparo a pronunciare Wageningen.»", tono: 'ironico', r: "«\"Vaghenìnghen\". Più gola. Più gola. Ecco. Sei pronto per l'Olanda.»" },
        { t: "«Vai e spacca tutto. Al ritorno mi racconti.»", tono: 'sicuro', r: "«...Sai che mi aspettavo una scenata? Grazie. Davvero.»" },
      ] },
      { d: "«Cos'è che non sopporti delle ragazze come me?»", a: [
        { t: "«Che sapete sempre la risposta. È terrificante.»", tono: 'ironico', r: "«Lo so. Infatti sapevo anche che avresti detto così.»" },
        { t: "«Niente. Sei perfetta.»", tono: 'romantico', r: "«Nessuno è perfetto. Io per esempio rubo i cornetti dal bar dell'università. Ecco. Ora lo sai.»" },
        { t: "«Che parlate troppo. Tipo adesso.»", tono: 'cafone', r: "Federica smette di parlare. Per sempre, almeno con te, stasera." },
      ] },
      { d: "«Una volta mi hanno detto che sono \"troppo\" per un uomo di qui. Troppo cosa, secondo te?»", a: [
        { t: "«Troppo intelligente. Ci fai sembrare tutti zolle.»", tono: 'sincero', r: "«Sei la prima zolla che lo ammette. Mi piace.»" },
        { t: "«Troppo rossa. Il Bepi ti scambia per un semaforo.»", tono: 'ironico', r: "«Il Bepi si ferma quando passo! Pensavo fosse educazione!»" },
        { t: "«Troppo complicata. A me piacciono semplici.»", tono: 'cafone', r: "«Allora goditi il gelato. È alla crema. Semplice, come te.»" },
      ] },
      { d: "«Se mi offrissero un posto a Utrecht, verresti con me?»", a: [
        { t: "«Sì. Imparo l'olandese, compro una bici e cado nei canali come tutti.»", tono: 'ironico', r: "«Cadere nei canali è tradizione. Ti presento ai colleghi come \"il mio campione locale\".»" },
        { t: "«Non lo so. Qui c'è mia madre, ci sono i campi. Ma ci penserei sul serio.»", tono: 'sincero', r: "«La risposta più onesta che mi abbiano mai dato. Ci pensiamo insieme.»" },
        { t: "«Tu non vai da nessuna parte. Resti qui con me.»", tono: 'cafone', r: "«Ah, l'uomo delle caverne. Peccato, il gelato era buono.»" },
      ] },
    ],
    maestro: "«Ok, Garonio. Questa era intelligente. Mi tocca rivedere la mia ipotesi su di te.»",
    numero: "«Ti do il numero. Se mi mandi un buongiornissimo col caffè e i fiori, lo uso per la tesi come dato anomalo.»",
    accetta: "«Uscire? Va bene. Ma niente posti con la musica alta: voglio sentire se dici cose intelligenti.»",
    rifiuta: "«Non ancora. Ho bisogno di più dati su di te. Campionamento più ampio.»",
    bacio: "A fine serata Federica ti bacia di sorpresa e poi ti guarda come una provetta: «Mh. Risultato promettente. Serve una replica.»",
    sale: "«Ho in macchina dei campioni di terreno da sistemare. Mi aiuti? A casa mia. Adesso. Non sono i campioni il punto, Garonio.»",
    letto: "Più tardi Federica annota qualcosa sul quaderno. «Che scrivi?» «Niente. Risultato statisticamente significativo.»",
    reputazione: "«Mi sono informata. In paese la tua reputazione è... diciamo un dato da ripulire. Buonanotte, Garonio.»",
    blocco: "Federica corre via alzando il volume del podcast sui nematodi. Ti ha classificato come «rumore di fondo».",
    conquistata: [
      "«Ciao, mio campione statisticamente significativo.»",
      "«Ho una zolla nuova da farti annusare. È un complimento, giuro.»",
      "«Ho chiamato un campione di terreno come te: G-07. È il più disordinato. Lo adoro.»",
      "«Il relatore mi ha chiesto chi è \"Garonio\" nei ringraziamenti. Gli ho detto: un dato anomalo.»",
      "«Ti ho portato un lombrico. È un regalo serio. È un lombrico eccellente.»",
    ],
  },

  sabrina: {
    nome: 'Sabrina', eta: 35, icona: '💅',
    chi: 'Estetista con la Panda rosa. Divorziata, sa cosa vuole e sa riconoscere un cafone da dieci metri.',
    dove: 'Nel pomeriggio alla fontana della piazza, la sera al bancone del bar.',
    posti: [{ ore: [14, 18], x: 10, z: 51.6 }, { ore: [18, 23.5], interno: 'bar', x: 6.3, z: 2.85 }],
    aspetto: { sprite: 'bionda_bianco', w: 15, h: 23, skin: '#f0c4a0', hair: '#e8d070', hairStyle: 'long', shirt: '#c03a8a', pants: '#1a1a2a', boots: '#c02a5a', eyes: 'normal' },
    gusti: { romantico: 1, sincero: 1, sicuro: 0, ironico: 0, spaccone: -1, cafone: -1, bisognoso: -1 },
    posto: 'pizzeria',
    saluti: [
      "«Ciao tesoro. Hai le mani rovinate, lo sai? Mi fai venire voglia di farti una manicure d'ufficio.»",
      "«Garonio. Lo stesso Garonio che ha parcheggiato il trattore sulle strisce? Sì, lo stesso.»",
      "«Ciao tesoro. Ti hanno visto alla fontana col trattore. Di nuovo. Io non ho detto niente. A quasi nessuno.»",
      "«Ho fatto la piega alla Pina. Mi ha parlato di te per tre ore. Due e mezza inventate. Forse.»",
      "«Garonio, quelle sopracciglia. Vieni da me, ti faccio sembrare un uomo con un progetto.»",
      "«Il mio ex è tornato in paese. Ha una Porsche. A rate. Te lo dico perché lo so.»",
      "«Hai un'aria romantica oggi. O stanca. Negli uomini di qui è uguale.»",
      "«Ho visto la Giusy guardarti. Tranquillo, guarda così anche il kebab di Kemal.»",
    ],
    primaVolta: "Una bionda con le unghie fucsia ti squadra dalla testa ai piedi. Si ferma sugli stivali. Sospira. «Sabrina. Estetista. Siediti, prima che ti veda qualcuno vestito così.»",
    approccio: [
      { d: "«Allora, cosa vuoi? Offrirmi da bere?»", a: [
        { t: "«Volevo solo dirti che hai un bel sorriso. Il drink se vuoi.»", tono: 'romantico', r: "«...Un complimento senza secondo fine. Rarissimo. Prendo uno spritz, grazie.»" },
        { t: "«Sì, e poi vediamo dove finiamo, eh? Eh?»", tono: 'cafone', r: "«Finiamo che tu vai al tuo tavolo e io resto al mio. Ciao, tesoro.»" },
        { t: "«Niente. Volevo conoscerti. Sono un po' imbranato, scusa.»", tono: 'sincero', r: "«Imbranato e sincero. Il mio ex era sicuro e bugiardo. Siediti.»" },
      ] },
      { d: "«Ti piacciono le mie unghie? Sii onesto.»", a: [
        { t: "«Sono fucsia come l'insegna del Night. Ma su di te stanno meglio.»", tono: 'ironico', r: "«Ah, sai dov'è il Night. Interessante. Però il complimento l'hai salvato.»" },
        { t: "«Sono bellissime. Come tutto il resto.»", tono: 'romantico', r: "«Mh. Scontato, ma l'hai detto arrossendo. Funziona.»" },
        { t: "«Boh. Sono unghie.»", tono: 'cafone', r: "«\"Sono unghie\". Tre ore di lavoro. \"Sono unghie\". Ciao.»" },
      ] },
      { d: "«Io sono divorziata, eh. Lo dico subito, così non scappi dopo.»", a: [
        { t: "«Io sono figlio del Gigante. Lo dico subito, così scappi adesso.»", tono: 'ironico', r: "(ride) «Ok. Pari. Nessuno dei due scappa.»" },
        { t: "«Allora sai già cosa non vuoi. È un vantaggio.»", tono: 'sincero', r: "«...Sai che è la cosa più intelligente che mi abbiano detto in questo bar? E ci vengo da dieci anni.»" },
        { t: "«Tranquilla, io sono molto meglio di lui. Garantito.»", tono: 'spaccone', r: "«Lo diceva anche lui del mio primo fidanzato. Vedi un po' tu.»" },
      ] },
      { d: "«Cosa fai di bello nella vita?»", a: [
        { t: "«Lavoro in campagna. Male, ma lavoro.»", tono: 'sincero', r: "«Almeno lo ammetti. Il Moreno dice di fare \"l'imprenditore\" e vende accendini.»" },
        { t: "«Sono il futuro proprietario dell'azienda più grande della Bassa.»", tono: 'spaccone', r: "«Futuro. Quindi adesso guidi il trattore di tuo padre. Ok.»" },
        { t: "«Sogno. Tipo adesso, che ti sto parlando.»", tono: 'romantico', r: "«Oddio. Ok, questa era da Bacio Perugina. Ma mi è piaciuta. Non dirlo a nessuno.»" },
      ] },
      { d: "«Cosa regaleresti a una donna al primo appuntamento?»", a: [
        { t: "«Fiori di campo. Raccolti da me, con le nutrie che mi guardano storto.»", tono: 'romantico', r: "«Fiori raccolti rischiando la vita. Ok, così si fa.»" },
        { t: "«Un buono per l'estetista. La tua, ovviamente.»", tono: 'ironico', r: "«Mi porti i clienti e mi corteggi. Fai il rappresentante?»" },
        { t: "«Niente. Il regalo sono io.»", tono: 'spaccone', r: "«Un regalo così lo riciclo a Natale, tesoro.»" },
      ] },
      { d: "«Credi al colpo di fulmine, Garonio?»", a: [
        { t: "«Prima poco. Poi sei entrata tu e ho rovesciato lo spritz.»", tono: 'romantico', r: "«L'hai rovesciato davvero. Sui pantaloni del Tarcisio. Ma l'intenzione era bella.»" },
        { t: "«No. Credo all'amore alla terza volta, quando ci si conosce.»", tono: 'sincero', r: "«Alla terza volta. Questa è la seconda. Vedi di non sbagliare la prossima.»" },
        { t: "«Credo a quello che mi conviene, bambola.»", tono: 'cafone', r: "«\"Bambola\". Lo spritz me lo pago da sola, grazie.»" },
      ] },
      { d: "«Ti hanno mai fatto una maschera viso? Sii sincero.»", a: [
        { t: "«Una volta, con lo yogurt della Mamma. Mi ha inseguito con la scopa.»", tono: 'sincero', r: "«Lo yogurt! Scaduto? Non dirmelo. Domani ti faccio una cosa seria.»" },
        { t: "«No, ma il fango in faccia me lo faccio già gratis, nei campi.»", tono: 'ironico', r: "«Fango della Bassa: trattamento esfoliante a chilometro zero. Ci faccio un pacchetto.»" },
        { t: "«Le maschere sono roba da femmine.»", tono: 'cafone', r: "«Lo diceva anche il Moreno. Poi è venuto di nascosto per i punti neri. Tre volte.»" },
      ] },
    ],
    appuntamento: [
      { d: "«Il mio ex mi portava sempre qui e guardava il telefono. Tu cosa guardi?»", a: [
        { t: "«Te. E ogni tanto la pizza, che ha un aspetto incredibile.»", tono: 'romantico', r: "«Pareggio onesto tra me e una margherita. Accetto.»" },
        { t: "«Il telefono. Scherzo! L'ho lasciato a casa apposta.»", tono: 'sincero', r: "(lo verifica tastandoti le tasche) «È vero. Non ce l'hai. Sei il primo uomo sopra i vent'anni.»" },
        { t: "«La cameriera. Scherzo, scherzo...»", tono: 'cafone', r: "«Il sorriso di Sabrina si raffredda di trenta gradi. La cameriera si allontana, prudente.»" },
      ] },
      { d: "«Quanti figli vorresti, Garonio? Domanda a bruciapelo.»", a: [
        { t: "«Ne parleremo quando avrò imparato a badare alle galline.»", tono: 'sincero', r: "«Risposta matura. Le galline sono un buon allenamento. Anche il Gigante, se è per questo.»" },
        { t: "«Undici. Una squadra di calcio. Tutti col mio nome.»", tono: 'spaccone', r: "«Undici Garonii. Il paese non reggerebbe. Io nemmeno.»" },
        { t: "«Quanti ne vuoi tu. Ho buona volontà e un trattore grande.»", tono: 'ironico', r: "«...Il trattore grande non c'entrava niente. Però ho riso. Maledetto.»" },
      ] },
      { d: "«Mi fai un complimento? Uno vero, non sul fisico.»", a: [
        { t: "«Hai riso tre volte stasera. Ogni volta il locale è diventato più bello.»", tono: 'romantico', r: "Sabrina non risponde. Ti guarda. Si sistema i capelli. Hai segnato." },
        { t: "«Sei la prima persona che non mi ha chiesto di mio padre.»", tono: 'sincero', r: "«...È vero. Non me ne frega niente di tuo padre. Mi interessi tu.» Pausa. «Questo era un complimento a te, tesoro.»" },
        { t: "«Hai davvero due belle... unghie.»", tono: 'cafone', r: "«Bella ripresa. Ma ti ho visto, sai. Ti ho visto eccome.»" },
      ] },
      { d: "«Io voglio uno che mi porti a ballare il liscio. Tu sai ballare?»", a: [
        { t: "«No. Ma per te imparo la mazurka anche da solo in stalla.»", tono: 'romantico', r: "«In stalla. Con le mucche come pubblico. Ti prendo in parola.»" },
        { t: "«Ballo da dio. Chiedi in giro.»", tono: 'spaccone', r: "«Ho chiesto. Mi hanno detto \"il ballo del trattore\" alla sagra del 2019. Ti hanno filmato.»" },
        { t: "«No, ma pesto benissimo i piedi. Correrai il rischio?»", tono: 'ironico', r: "«Ho i tacchi da dodici. Chi rischia sei tu, tesoro.»" },
      ] },
      { d: "«Il mio ex diceva che sono troppo esigente. Lo sono?»", a: [
        { t: "«Esigente no. Sai quanto vali. Era lui che non lo sapeva.»", tono: 'romantico', r: "«Tesoro... non farmi colare il mascara, costa ventidue euro.»" },
        { t: "«Un po'. Ma un po' di esigenza fa bene a uno come me.»", tono: 'sincero', r: "«Vero. Infatti ti sto già migliorando: stasera hai le unghie pulite.»" },
        { t: "«Sì. Ma io sono bravissimo, quindi nessun problema.»", tono: 'spaccone', r: "«Lo diceva anche il primo. Vuoi conoscere il secondo? È al bar.»" },
      ] },
      { d: "«Che canzone metteresti per ballare con me adesso?»", a: [
        { t: "«\"Romagna mia\". Lenta. Non so ballare, mi serve tempo.»", tono: 'romantico', r: "«Gennaro sta già cantando. Vieni qui, imbranato.»" },
        { t: "«Una qualunque. Basta che il ritmo lo tieni tu.»", tono: 'sincero', r: "«Il ritmo lo tengo da quarant'anni. Ehm, trentacinque. Dai, vieni.»" },
        { t: "«Il remix del trattore! TUNZ TUNZ!»", tono: 'cafone', r: "«Hai svegliato il bambino del tavolo quattro. E anche me, da un'illusione.»" },
      ] },
    ],
    maestro: "«Garonio... chi ti ha insegnato a parlare così? No, non dirmelo. Lasciami stupita.»",
    numero: "«Questo è il mio numero. E quello del centro estetico, che ti serve più del mio.»",
    accetta: "«Un appuntamento? Sì. Ma vieni pulito. Pulito pulito. Ti annuso, sappilo.»",
    rifiuta: "«Tesoro, mi hai appena conosciuta. Rimandiamo, finché non ti ho capito meglio.»",
    bacio: "Sotto il lampione, Sabrina ti dà un bacio che sa di spritz e di vaniglia. «Non è stato male. Quasi per niente.»",
    sale: "«La Panda è qui. Casa mia è a due minuti. Il centro estetico pure: ma stasera è chiuso. Andiamo?»",
    letto: "Più tardi Sabrina, avvolta nel lenzuolo, ti esamina le mani: «Domani manicure. Gratis. Te la sei guadagnata.»",
    reputazione: "«Ti voglio dire di sì, tesoro. Ma in paese mi ammazzano: \"La Sabrina col Garonio?\". Lavora un po' sulla tua fama, ok?»",
    blocco: "Sabrina si gira dall'altra parte e chiede a Loredana un altro spritz. Per te non c'è posto, nemmeno sullo sgabello.",
    conquistata: [
      "«Ciao, tesoro. Hai messo la crema che ti ho dato? Fammi vedere le mani.»",
      "«Il mio cliente preferito. E non solo cliente.»",
      "«Ho messo la tua foto nel gruppo delle clienti. Hanno votato: \"carino ma da sistemare\". Ci penso io.»",
      "«Tesoro, il trattore lo lavi tu o devo prenotare anche lui?»",
      "«Passa stasera. Ho una crema nuova da provare. Su di te. Per lavoro, ovviamente.»",
    ],
  },

  ilenia: {
    nome: 'Ilenia', eta: 30, icona: '🚛',
    chi: 'Guida il camion del latte. Tosta, battuta sempre pronta, sa smontare un carburatore a occhi chiusi.',
    dove: 'In pausa pranzo al bar, al biliardo. Il pomeriggio al parcheggio del Night.',
    posti: [{ ore: [12, 16], interno: 'bar', x: 15.4, z: 5.9 }, { ore: [16, 19], x: 45, z: 66.6 }],
    aspetto: { sprite: 'mora_occhiali', w: 15, h: 23, skin: '#d9a07a', hair: '#1a1a1a', hairStyle: 'coda', hat: '#2a6aa8', shirt: '#2a6aa8', pants: '#5a4a3a', boots: '#3a2a1a', eyes: 'normal' },
    gusti: { ironico: 1, sicuro: 1, sincero: 0, romantico: -1, spaccone: -1, bisognoso: -1, cafone: -1 },
    posto: 'ponte',
    saluti: [
      "«Ohi, Garonio. Ti ho quasi messo sotto col camion stamattina. Saresti stato una bella frenata.»",
      "«Il latte non si consegna da solo e io non ho tempo. Parla in fretta e fammi ridere.»",
      "«Ohi. Stamattina il camion faceva lo stesso rumore del tuo trattore. L'ho portato da Zeno per pietà.»",
      "«Da lontano ho pensato: chi è quel sacco di mangime con le gambe? Ah, eri tu.»",
      "«Newbarley-Oldbarley in quaranta minuti. Non dirlo alla Vigilessa. Né al latte.»",
      "«Hai la faccia di uno che ha dormito nel fienile. Pratico. Ci ho dormito anch'io, una volta.»",
      "«Dieci-quattro, Garonio. Cosa vuol dire? Boh, lo dicono in tv.»",
      "«Il Moreno mi ha chiesto di uscire. Gli ho detto che il camion è geloso. Ci ha creduto.»",
    ],
    primaVolta: "Una ragazza col cappellino da camionista imbuca la palla otto senza guardare. «Ilenia. Quella del camion del latte. Sei tu quello che dorme sulla provinciale? Ti ho suonato tre volte, martedì.»",
    approccio: [
      { d: "«Giochi a biliardo o guardi e basta?»", a: [
        { t: "«Gioco. Malissimo. Ma con una grande dignità.»", tono: 'ironico', r: "«La dignità non manda le palle in buca. Però mi piace. Ti spiego io come si tiene la stecca.»" },
        { t: "«Ti batto a occhi chiusi.»", tono: 'sicuro', r: "«Ah sì? Dieci euro. Anzi no, mi piace che ci credi. Facciamo la rivincita un'altra volta.»" },
        { t: "«Ti guardo. Sei bellissima quando sei concentrata.»", tono: 'romantico', r: "«...Ma che sei, un Bacio Perugina? Passami il gesso, va'.»" },
      ] },
      { d: "«Hai una Vespa blu, vero? Quella che non parte mai.»", a: [
        { t: "«Parte. Quando vuole lei. È una Vespa indipendente.»", tono: 'ironico', r: "«Una Vespa con la sua personalità. Le donne della tua vita ti comandano tutte, eh?»" },
        { t: "«Sì. Mi aiuteresti a sistemarla? Sono un disastro coi motori.»", tono: 'sincero', r: "«Ammetti di non saper fare una cosa? Raro, in un uomo di qui. Ok, porto la chiave del 10.»" },
        { t: "«È la Vespa più veloce della provincia. L'ho elaborata io.»", tono: 'spaccone', r: "«L'ha elaborata Zeno. E ti ha fregato sulla marmitta. Lo sanno tutti.»" },
      ] },
      { d: "«Io mi alzo alle quattro per il latte. Tu?»", a: [
        { t: "«Io alle quattro di solito sto ancora sognando di alzarmi.»", tono: 'ironico', r: "(ride) «Quindi in pratica ti alzi anche tu. Solo nel sogno.»" },
        { t: "«Da domani anche io, se passi davanti a casa mia.»", tono: 'sicuro', r: "«Passo alle 4:20. Se non sei in strada, suono il clacson del camion. Lo sentirà anche tuo padre.»" },
        { t: "«Wow, sei così forte... io non ce la farei mai, aiutami...»", tono: 'bisognoso', r: "«Non sono una badante, Garonio. Sono una camionista.»" },
      ] },
      { d: "«Cosa ti fa ridere, a te?»", a: [
        { t: "«Il Gino del tabacchi quando prova a fare le parole crociate.»", tono: 'ironico', r: "«Sette verticale: \"Animale da cortile\". Lui ha scritto \"MOGLIE\". Il migliore.»" },
        { t: "«Le donne che sanno guidare un camion. Mi fanno ridere di gioia.»", tono: 'sicuro', r: "«Giro della morte salvato all'ultimo. Bravo. Mi stavo già offendendo.»" },
        { t: "«Le donne al volante! Ahahah.»", tono: 'cafone', r: "«Il prossimo martedì sulla provinciale non suono. Accelero.»" },
      ] },
      { d: "«Se potessi guidare qualsiasi mezzo, cosa sceglieresti?»", a: [
        { t: "«Un carro armato. Per non fare la coda al passaggio a livello.»", tono: 'ironico', r: "«Il carro armato al passaggio a livello. Lo sogno anch'io ogni mattina.»" },
        { t: "«Il tuo camion. Tu al volante e io a fare il navigatore.»", tono: 'sicuro', r: "«Navigatore? Ok. Ma se sbagli strada ti lascio all'autogrill.»" },
        { t: "«Una carrozza bianca coi cavalli, per portarti all'altare.»", tono: 'romantico', r: "«Ma sei una bomboniera? Mi vengono le carie.»" },
      ] },
      { d: "«Ti hanno mai detto che hai le mani da contadino?»", a: [
        { t: "«Sì, la Sabrina. Ha pianto un po'.»", tono: 'ironico', r: "«Ha pianto per le tue mani? Fammi vedere. ...Cavolo. Ha ragione.»" },
        { t: "«Sì, e ne vado fiero. Le tue sono da camionista: siamo pari.»", tono: 'sicuro', r: "«Pari. Stretta di mano? ...Ahi. Ok, bella presa.»" },
        { t: "«Ti prego, non dirlo, sono molto insicuro sulle mie mani...»", tono: 'bisognoso', r: "«Oddio. Ok. Belle mani. Vai pure.»" },
      ] },
      { d: "«Scommessa: se imbuco la nera di sponda mi offri un caffè. Ci stai?»", a: [
        { t: "«Ci sto. E se sbagli, il caffè lo offri tu. Doppio.»", tono: 'sicuro', r: "«Doppio? Ti piace rischiare.» (imbuca) «Ristretto, grazie.»" },
        { t: "«Ci sto. Ma se la imbuchi ti chiedo di sposarmi.»", tono: 'ironico', r: "(sbaglia apposta) «Ecco. Salva. Il caffè lo offro io, per pietà.»" },
        { t: "«Dai, le donne di sponda non sanno giocare.»", tono: 'cafone', r: "(imbuca la nera di sponda, poi altre due per cattiveria) «Caffè. E brioche.»" },
      ] },
    ],
    appuntamento: [
      { d: "«Guarda le stelle. Sai riconoscere qualche costellazione?»", a: [
        { t: "«Quella lì è l'Orsa Maggiore. Quella lì il Trattore Minore.»", tono: 'ironico', r: "«Il Trattore Minore! Ha anche le ruote, guarda. Sei scemo. Mi piace.»" },
        { t: "«Le stelle sono niente in confronto ai tuoi occhi.»", tono: 'romantico', r: "«Garonio. Siamo su un ponte. Se continui così ti butto nel canale con le nutrie.»" },
        { t: "«No. Insegnamele tu.»", tono: 'sicuro', r: "«Quella è Cassiopea. Quella... boh, credo un aereo. Va bene, non lo so neanche io. Ah ah.»" },
      ] },
      { d: "«Io voglio comprarmi un camion tutto mio. Rosso. Che dici, sono matta?»", a: [
        { t: "«Matta? Te lo dipingo io con le fiamme sui lati.»", tono: 'sicuro', r: "«Con le fiamme! Sei il primo che non mi dice di trovarmi un lavoro da femmina.»" },
        { t: "«Un po'. Ma è la cosa più bella che ho sentito oggi.»", tono: 'sincero', r: "«...Va be'. Vai avanti a dire cose così e mi tocca farti salire in cabina.»" },
        { t: "«Lascia stare, i camion sono roba da uomini.»", tono: 'cafone', r: "Ilenia ti guarda a lungo. Poi si mette a ridere. Non è una bella risata. Per te." },
      ] },
      { d: "«Una volta un tizio mi ha portato fiori e cioccolatini. Li ho dati al cane. Tu cosa mi hai portato?»", a: [
        { t: "«Una camera d'aria di scorta. Per il tuo camion. Non si sa mai.»", tono: 'ironico', r: "«...Ok. Questo è il regalo più bello della mia vita. Lo dico senza ironia.»" },
        { t: "«Niente. Pensavo che bastassi io.»", tono: 'spaccone', r: "«Ah. Un regalo un po' piccolo, allora.»" },
        { t: "«Me stesso, puntuale e lavato. Per me è un evento.»", tono: 'sincero', r: "«È vero, profumi di sapone. Il Gigante sarà sconvolto.»" },
      ] },
      { d: "«Domani porto il latte fino a Oldbarley. Vieni con me in cabina?»", a: [
        { t: "«Ci sto. Ma si ferma all'autogrill, che ho fame.»", tono: 'sicuro', r: "«All'autogrill ci fermiamo sempre. Panino col salame e caffè doppio. Hai capito come funziona.»" },
        { t: "«Ti prego sì, non lasciarmi solo in questa fattoria...»", tono: 'bisognoso', r: "«Eh, Garonio. Il latte non lo porto in due per pietà.»" },
        { t: "«Solo se mi lasci suonare il clacson sotto casa del Gigante.»", tono: 'ironico', r: "«Alle quattro e mezza. Tre colpi lunghi. È deciso.»" },
      ] },
      { d: "«Se ti dico che domani parto per la Germania col camion, tre giorni, che fai?»", a: [
        { t: "«Ti preparo un panino col salame per ogni giorno. Anzi due. I tedeschi non sanno fare il salame.»", tono: 'sicuro', r: "«Due panini al giorno. Mi hai capita. È grave.»" },
        { t: "«Chiedo se posso venire. Voglio vedere l'autostrada senza limiti.»", tono: 'ironico', r: "«Senza limiti di velocità. Col trattore lì faresti la figura della lumaca. Vieni.»" },
        { t: "«Ti scrivo una poesia per ogni chilometro.»", tono: 'romantico', r: "«Sono milleduecento chilometri, Garonio. Ti prego, no.»" },
      ] },
      { d: "«Una volta un cliente mi ha chiesto se il camion lo guida mio marito. Tu cosa gli avresti detto?»", a: [
        { t: "«Che il marito è il camion. Siete sposati da anni, si vede.»", tono: 'ironico', r: "(ride fino alle lacrime) «Io gli ho detto \"è il mio ex\". Ma questa è meglio.»" },
        { t: "«Niente. L'avrei lasciato parlare con te. È peggio di qualsiasi cosa potessi dirgli io.»", tono: 'sicuro', r: "«Giusto. A lui il pieno di insulti, a me il pieno di latte. Pari.»" },
        { t: "«Che le donne al volante sono un pericolo! Scherzo... forse.»", tono: 'cafone', r: "«\"Forse\". Vuoi tornare a casa a piedi? Il ponte è lungo.»" },
      ] },
    ],
    maestro: "«...Oh. Ok. Questa era bella. Non lo ripeto, ma era bella.»",
    numero: "«Eccoti il numero. Se mi chiami mentre guido, rispondo col vivavoce e ti sente tutta la cabina.»",
    accetta: "«Un appuntamento? Va bene. Ma niente posti fighetti: voglio stare all'aperto.»",
    rifiuta: "«Calma, cowboy. Prima fammi vedere che non sei come tutti gli altri.»",
    bacio: "A fine serata Ilenia ti prende il colletto e ti bacia senza preavviso. «Così, per non lasciarti l'iniziativa.»",
    sale: "«Ho il camion parcheggiato qui. No, non nel camion, Garonio, che schifo. Casa mia è vicina. Vieni o no?»",
    letto: "Più tardi Ilenia accende la radiolina: «Dieci-quattro, Garonio. Consegna effettuata.»",
    reputazione: "«Mi stai simpatico, eh. Ma tutti i camionisti della zona parlano di te. E non bene. Rimettiti in sesto, poi ne riparliamo.»",
    blocco: "Ilenia passa col camion del latte e suona il clacson. Non per salutarti.",
    conquistata: [
      "«Ohi, Trattore Minore! Vieni a Oldbarley con me?»",
      "«Il mio passeggero preferito. Allacciati la cintura.»",
      "«Ho attaccato la tua foto sul cruscotto, vicino a San Cristoforo. Lui mi protegge, tu mi fai ridere.»",
      "«Stamattina ho suonato tre colpi lunghi sotto casa tua. Il Gigante ha risposto con quattro.»",
      "«Caffè all'autogrill di Somaglia? Pago io. Tu porti le battute.»",
    ],
  },

  // ---------- Le quattro nuove (dalla bozza dei dialoghi, docs/dialoghi-nuovi.md) ----------
  ludovica: {
    nome: 'Ludovica', eta: 31, icona: '👑',
    chi: "Nipote del Conte della Bassa. Laureata in storia dell'arte, nobile fino al midollo e squattrinata fino al midollo. Cerca un marito con un trattore e una visione: il tetto del castello perde.",
    dove: "La mattina nel cortile del castello, il pomeriggio alla fontana della piazza «a farsi vedere».",
    posti: [{ ore: [9, 12.5], x: 12, z: 99.6 }, { ore: [15, 19], x: 7.6, z: 51.6 }],
    aspetto: { sprite: 'mora_rosso', ricolora: { gradi: 140, capelli: '#c8a050' }, w: 15, h: 23, skin: '#f4d0b4', hair: '#c8a050', hairStyle: 'long', shirt: '#2a6a3a', pants: '#2a6a3a', boots: '#3a2a1a', eyes: 'normal' },
    gusti: { spaccone: 1, romantico: 1, sicuro: 0, sincero: 0, ironico: -1, bisognoso: -1, cafone: -1 },
    posto: 'castello',
    saluti: [
      "«Oh. Il villico simpatico. Si avvicini pure, ma non troppo: è appena passato il profumiere.»",
      "«Garonio, giusto? Mio zio dice che suo padre ci deve tre sacchi di grano dal 1952. Interessi compresi.»",
      "«Buongiorno. Ha visto il mio cavallo? No? Neanche io. L'abbiamo venduto nel 2011.»",
      "«Non le porgo la mano: me l'hanno appena baciata Ambrogio e il geometra. Per oggi basta.»",
      "«Ha un trattore? Grande? Con l'aria condizionata? ...Peccato.»",
      "«In famiglia abbiamo un motto: \"Nobiltà obbliga\". Di solito obbliga a chiedere prestiti.»",
    ],
    primaVolta: "Una ragazza con un cappello a tesa larga ti sbarra la strada. Al guinzaglio ha un barboncino che, a guardarlo bene, è un peluche su rotelle. «Ludovica Ottavia Maria dei Conti della Bassa. Lei può chiamarmi Contessina. O Ludo, se un giorno mi restaura il tetto.»",
    approccio: [
      { d: "«Lei cosa possiede, esattamente?»", a: [
        { t: "«Un trattore, quattro maiali, una Vespa e grandi progetti. Fra dieci anni compro mezzo paese.»", tono: 'spaccone', r: "«Grandi progetti! Finalmente un uomo con le ambizioni di un Visconti. Anche se coi maiali.»" },
        { t: "«Quasi niente. È tutto di mio padre.»", tono: 'sincero', r: "«Ah. Come me. Lo zio possiede tutto, io possiedo il cognome. Almeno siamo onesti.»" },
        { t: "«Possiedo un gran senso dell'umorismo. Quanto vale?»", tono: 'ironico', r: "«All'asta? Meno dei candelabri. E i candelabri sono finti.»" },
      ] },
      { d: "«Mi dica: lei sa fare il baciamano?»", a: [
        { t: "(si inchina e le bacia il guanto, lasciandoci un po' di fango) «Per lei imparo tutto, Contessina.»", tono: 'romantico', r: "«Il fango sul guanto è... rustico. Ma il gesto c'era. Mi sono emozionata. Pochissimo.»" },
        { t: "«No, però so fare il batti cinque. Va bene lo stesso?»", tono: 'ironico', r: "«Il batti... No. Niente che finisca con \"cinque\" va bene. Tranne i secoli di nobiltà.»" },
        { t: "«Io bacio solo la mia mamma...»", tono: 'bisognoso', r: "«Ammirevole. Torni quando la mamma le avrà dato il permesso di baciare altro.»" },
      ] },
      { d: "«Le piace l'arte?»", a: [
        { t: "«Moltissimo. Ho in giardino un nano di bronzo alto un metro e venti. Bronzo vero. Quasi.»", tono: 'spaccone', r: "«Un metro e venti! Una scultura monumentale! Il bronzo è plastica, vero? Non importa: l'ambizione c'è.»" },
        { t: "«Mi piace guardare lei. È arte anche quella?»", tono: 'romantico', r: "«È la frase più popolana e più dolce che abbia sentito questa settimana. Me la segno.»" },
        { t: "«Sì, soprattutto il calendario dei pompieri.»", tono: 'cafone', r: "«Ambrogio. Accompagni il signore all'uscita. Quella di servizio.»" },
      ] },
      { d: "«Il mio trisavolo ha combattuto a Clearville. Il suo?»", a: [
        { t: "«Il mio ha combattuto a Clearville contro una mucca. E ha vinto.»", tono: 'spaccone', r: "«Contro una mucca, e ha vinto! Una stirpe di guerrieri. Devo informare lo zio.»" },
        { t: "«Non lo so. Credo zappasse. Le vostre terre, probabilmente.»", tono: 'sincero', r: "«Probabilmente. Grazie per il lavoro, con un secolo e mezzo di ritardo, a nome della famiglia.»" },
        { t: "«Il mio era nella stanza accanto a ridere di Clearville.»", tono: 'ironico', r: "«Non si ride di Clearville. Non in mia presenza. Arrivederla.»" },
      ] },
      { d: "«Lei mi trova snob?»", a: [
        { t: "«Un po'. Ma le sta bene, come il cappello.»", tono: 'romantico', r: "«Il cappello era di mia nonna. Lo snobismo pure. Grazie: li porto bene tutti e due.»" },
        { t: "«Snob lei? Io sono molto più snob: non mangio la polenta del giorno prima.»", tono: 'spaccone', r: "«Neanche lei?! Siamo anime gemelle. La polenta riscaldata è una barbarie.»" },
        { t: "«Non mi guardi dall'alto in basso, la prego, mi fa sentire piccolo...»", tono: 'bisognoso', r: "«Sono sul gradino della fontana, signor Garonio. È una questione di altimetria.»" },
      ] },
      { d: "«Sa ballare il valzer?»", a: [
        { t: "«Lo ballo da quando avevo sei anni. Sagra del cotechino, primo classificato.»", tono: 'spaccone', r: "«Primo classificato! Sapevo che sotto quella tuta batteva il cuore di un ballerino di corte.»" },
        { t: "«No. Ma se lei mi insegna, le pesterò i piedi con grande rispetto.»", tono: 'romantico', r: "«Con grande rispetto. Lo zio la chiamerebbe dichiarazione. Io la chiamo un inizio.»" },
        { t: "«Il valzer? Quello che si balla in tre? Valzer, polka e mazurka?»", tono: 'ironico', r: "«Si balla in due. E stasera, chiaramente, senza di lei.»" },
      ] },
    ],
    appuntamento: [
      { d: "«Ambrogio ha servito il consommé. È acqua calda col dado. Non lo dica a nessuno. Com'è?»", a: [
        { t: "«Il miglior consommé della mia vita. Dica ad Ambrogio che lo assumo io.»", tono: 'spaccone', r: "«Ha sentito, Ambrogio? Un ingaggio!» Ambrogio vacilla per la gioia. Tre stipendi arretrati gli passano davanti agli occhi." },
        { t: "«Con lei di fronte, anche il dado sembra tartufo.»", tono: 'romantico', r: "«Lo racconterò a mia nonna, giù nella cripta. Sarà fiera di me.»" },
        { t: "«Si sente che è dado. Quello col bollino d'oro.»", tono: 'sincero', r: "«Lo sapevo. Però il bollino d'oro è una specie di nobiltà. Lo prendo come un complimento al brodo.»" },
      ] },
      { d: "«Lo zio dice che dovrei sposare un uomo ricco. Lei è ricco, Garonio?»", a: [
        { t: "«Lo sarò. Maiali, mais e un giorno un capannone col mio nome sopra. In oro.»", tono: 'spaccone', r: "«In oro! In corsivo? Mi lasci scegliere il carattere. Lo zio sarà felicissimo.»" },
        { t: "«No. E i soldi non riscaldano le altre quarantuno stanze.»", tono: 'sincero', r: "«È vero. Me lo ricorda ogni inverno la bolletta. Mi ha fatto pensare, che fastidio.»" },
        { t: "«Dipende. Lei quanto costa?»", tono: 'cafone', r: "«Ambrogio, il cappotto del signore. E poi alzi il ponte levatoio. Quello che non abbiamo.»" },
      ] },
      { d: "«Nella sala accanto c'è il ritratto della mia bisnonna. Dicono che le somiglio. Che dice?»", a: [
        { t: "«Le somiglia. Ma lei sorride, la bisnonna sembra aver appena visto la bolletta.»", tono: 'ironico', r: "«La bisnonna aveva visto la bolletta della luce del 1911. Non si ride di queste tragedie.»" },
        { t: "«Più bella lei. Il pittore avrebbe dovuto inventare colori nuovi.»", tono: 'romantico', r: "«Ambrogio, un ventaglio. Subito. Anzi, due.»" },
        { t: "«Uguale. Bella, ma con la faccia di chi sa che il tetto perde.»", tono: 'sincero', r: "«Il tetto perdeva anche allora. È una tradizione di famiglia, come il naso.»" },
      ] },
      { d: "«Mi dica una cosa che farebbe per me. Una grande.»", a: [
        { t: "«Le rifarei il tetto del castello. Tutto. Col trattore e una scala molto lunga.»", tono: 'spaccone', r: "«Col trattore sul tetto! Folle! Magnifico! Mi tenga la mano mentre immagino la scena.»" },
        { t: "«Le dedicherei il mio primo raccolto vero. Una cassetta di pomodori col suo nome.»", tono: 'romantico', r: "«Pomodori col mio nome. Nessuno mi aveva mai dedicato un ortaggio. Mi scusi, mi commuovo.»" },
        { t: "«Tutto. Ma lei mi deve dire che mi vuole bene. Ogni giorno.»", tono: 'bisognoso', r: "«Ogni giorno? Nemmeno lo zio, che è parente. Ambrogio, il dessert. Cambiamo argomento.»" },
      ] },
      { d: "«Lo sa che mio zio ci spia dalla scala da mezz'ora?»", a: [
        { t: "«Lo so. Gli ho fatto ciao. Mi ha risposto. Ormai siamo in famiglia.»", tono: 'ironico', r: "«Lo zio non risponde ai saluti. Era un tic. Adesso è offeso. Bel lavoro.»" },
        { t: "«Che guardi pure. Fra un anno il prestito me lo chiede lui.»", tono: 'spaccone', r: "(ride nobilmente, con la mano davanti) «Oh, lo farà! Lo farà di sicuro!»" },
        { t: "«Allora approfittiamo. Contessina, stasera è bellissima.»", tono: 'romantico', r: "«Davanti allo zio? Che sfrontatezza. Me lo ridica più forte.»" },
      ] },
    ],
    maestro: "«...Garonio. Questa era la risposta di un cavaliere. Lo zio vorrà conoscerla. Purtroppo.»",
    numero: "«Le do il numero del castello. È fisso, c'è la segreteria con la voce di Ambrogio. Lasci un messaggio dopo il sospiro.»",
    accetta: "«Un invito? Accetto. Venga in camicia. Una camicia vera, non la tuta col colletto disegnato.»",
    rifiuta: "«Troppo presto. Una dama si fa corteggiare almeno quanto dura un restauro. Cioè anni.»",
    bacio: "Sul ponte levatoio (un ponticello di legno sopra il fosso) Ludovica ti porge la guancia, poi ci ripensa e ti bacia lei. «Non lo dica allo zio. Né alla bisnonna.»",
    sale: "«Il castello ha quarantadue stanze, Garonio. Vorrei mostrarle quella col camino. È l'unica riscaldata. Ambrogio ha la serata libera.»",
    letto: "La mattina dopo Ambrogio entra con un vassoio d'argento e due caffè. Non batte ciglio. «Il signor Conte domanda se il giovane si ferma a pranzo. E se porta il trattore, per il tetto.»",
    reputazione: "«Lei mi piace. Ma una Contessina non sale con un uomo di cui ridono al bar. Lo zio ha già letto il gruppo WhatsApp del paese. Sistemi la sua fama.»",
    blocco: "Ludovica ti passa davanti col naso all'insù. Il peluche su rotelle ti guarda con disprezzo.",
    conquistata: [
      "«Il mio cavaliere coi maiali! Lo zio chiede quando cominciamo il tetto.»",
      "«Ho parlato di noi alla bisnonna. Il ritratto si è staccato dal muro. Lo prendo come un sì.»",
      "«Ambrogio le ha stirato la tuta. Con l'amido. Adesso sta in piedi da sola.»",
      "«Cena al castello stasera? Ho trovato due candele intere. Una festa.»",
    ],
  },

  noemi: {
    nome: 'Noemi', eta: 29, icona: '🩺',
    chi: "Infermiera allo studio del Dottor Mutua, il pomeriggio dà una mano in farmacia. Dolcissima e apprensiva, si innamora di chi ha bisogno di cure. Diffida dei troppo sicuri: «quelli finiscono al pronto soccorso».",
    dove: "La mattina allo studio medico (8-13), il pomeriggio dà una mano in farmacia (15-19).",
    posti: [{ ore: [8, 13], interno: 'dottore', x: 11.2, z: 1.4 }, { ore: [15, 19], interno: 'farmacia', x: 4.2, z: 1.3 }],
    aspetto: { sprite: 'infermiera', ricolora: { gradi: 200, capelli: '#7a4a24' }, w: 15, h: 23, skin: '#f0c8a8', hair: '#7a4a24', hairStyle: 'long', shirt: '#8ac8e8', pants: '#8ac8e8', boots: '#f4f4f4', eyes: 'normal' },
    gusti: { bisognoso: 1, sincero: 1, romantico: 0, ironico: 0, sicuro: -1, spaccone: -1, cafone: -1 },
    posto: 'laghetto',
    saluti: [
      "«Garonio! Hai la faccia gialla. No, è la luce. No, è proprio gialla. Siediti.»",
      "«Ciao! Hai preso la pastiglia che ti ho detto? Quale pastiglia? Appunto.»",
      "«Martedì ti ho visto cadere dal trattore. Stavo per chiamare l'ambulanza, ma ti sei rialzato. Peccato. Cioè, no!»",
      "«Oggi ho fatto quaranta prelievi. Quello del Tarcisio era metà sangue e metà Lambrusco.»",
      "«Dormi troppo poco. Te lo leggo nelle occhiaie. Sono le occhiaie più belle del paese, comunque.»",
      "«L'infermiera Assunta dice che sono troppo buona coi pazienti. Lei li chiama \"unità\".»",
    ],
    primaVolta: "Una ragazza col camice azzurro e i capelli tenuti su da una matita ti prende il polso senza chiedere. «Noemi, infermiera. Hai centodieci battiti. È colpa mia o del Gigante? Siediti un attimo.»",
    approccio: [
      { d: "«Come stai? Ma come stai davvero?»", a: [
        { t: "«Male. Mio padre urla, ho mal di schiena e una nutria mi segue. Davvero.»", tono: 'bisognoso', r: "«Oddio, vieni qui. La nutria la segno in cartella. Il resto lo curiamo un pezzo per volta.»" },
        { t: "«Benissimo. Non mi ammalo mai. Ho gli anticorpi del Gigante.»", tono: 'spaccone', r: "«Lo diceva anche tuo padre. Poi gli ho fatto l'antitetanica e ha pianto.»" },
        { t: "«Stanco. Però adesso un po' meglio, sinceramente.»", tono: 'sincero', r: "«Un po' meglio è un ottimo parametro. Lo segno come progresso.»" },
      ] },
      { d: "«Ti sei mai fatto le analisi del sangue?»", a: [
        { t: "«Una volta. Sono svenuto prima dell'ago. Il Dottor Mutua ha detto che era un record.»", tono: 'sincero', r: "«Il record ce l'ha il Sergente: è svenuto guardando il cotone. La prossima volta ti tengo la mano io.»" },
        { t: "«No, ho paura degli aghi... e del buio... e delle oche...»", tono: 'bisognoso', r: "«Tre paure! Che tenero. Le oche fanno paura anche a me. Facciamo un piano di cura.»" },
        { t: "«Non mi servono. Sono sano come un toro.»", tono: 'spaccone', r: "«Il Bruno \"il Toro\" ha il colesterolo a trecento. Vuoi sapere altro sui tori?»" },
      ] },
      { d: "«Mi aiuti a portare queste scatole di garze in farmacia?»", a: [
        { t: "«Certo. Ma se mi viene il colpo della strega mi curi tu?»", tono: 'bisognoso', r: "«Ovviamente. Anzi, prendi pure la scatola grande. ...Scherzo! La piccola. Piano.»" },
        { t: "«Le porto tutte io. Anche te, se vuoi.»", tono: 'sicuro', r: "«Per carità! L'ultimo che ha fatto il forte adesso ha la schiena a punto interrogativo.»" },
        { t: "«Volentieri. Ne prendo metà, così non ci facciamo male in due.»", tono: 'sincero', r: "«Il buon senso! Rarissimo. Quasi lo aggiungo ai parametri vitali.»" },
      ] },
      { d: "«Cosa ti piace fare quando non lavori?»", a: [
        { t: "«Dormire. Ma dormo male. Mi spieghi perché?»", tono: 'bisognoso', r: "«Sì! Allora: niente caffè dopo le quattro e niente telefonate di Mister Mountain. Ecco.»" },
        { t: "«Vado al laghetto a guardare le anatre. Lo dico solo a te.»", tono: 'sincero', r: "«Anch'io! Col pane secco. Il Dottor Mutua dice che fa male alle anatre. Non ditelo alle anatre.»" },
        { t: "«Niente. Aspetto che arrivi tu.»", tono: 'romantico', r: "«Ohh. Dolce. Un po' appiccicoso, ma dolce. Come un cerotto.»" },
      ] },
      { d: "«Mi hanno detto che fai a botte al bar. È vero?»", a: [
        { t: "«Ogni tanto. Poi mi fanno male le nocche e non so a chi dirlo.»", tono: 'bisognoso', r: "«A me! Lo dici a me. Fammi vedere. Mamma mia, sembrano due noci.»" },
        { t: "«Sì, e vinco sempre. Chiedi al Bruno.»", tono: 'spaccone', r: "«Il Bruno l'ho medicato io. Dice che hai vinto perché gli sei inciampato addosso.»" },
        { t: "«Sì. Non ne vado fiero. Sto provando a smettere.»", tono: 'sincero', r: "«Ammetterlo è il primo passo. Il secondo è non sederti vicino al Bruno.»" },
      ] },
      { d: "«La Pina ti ha già fatto la diagnosi. Dice che sei \"pigro cronico\".»", a: [
        { t: "«Ha ragione. Ma credo sia curabile, se qualcuno se ne occupa.»", tono: 'bisognoso', r: "«Terapia d'urto: una passeggiata al laghetto al giorno. Con me. Per controllo.»" },
        { t: "«La Pina dovrebbe curarsi la lingua. C'è una diagnosi anche per quella?»", tono: 'ironico', r: "«Logorrea acuta da piazza. È sul manuale, alla voce \"Pina\".»" },
        { t: "«La Pina è una vecchia befana che dovrebbe farsi gli affari suoi!»", tono: 'cafone', r: "«La Pina è la mia paziente delle undici. È dolcissima. Coi miei pazienti no, Garonio.»" },
      ] },
    ],
    appuntamento: [
      { d: "«Hai messo la giacca? La sera al laghetto c'è umido, poi ti viene la tosse.»", a: [
        { t: "«No... ho un po' freddo, in effetti. E mi gratta la gola.»", tono: 'bisognoso', r: "«Lo sapevo! Tieni la mia sciarpa. E questa caramella al miele. Il gelato dopo.»" },
        { t: "«Il freddo non lo sento. Sono di ferro.»", tono: 'spaccone', r: "«Di ferro? Allora arrugginisci. Ti ho visto tremare davanti a un'anatra.»" },
        { t: "«L'ho dimenticata. Però ne ho portata una per te.»", tono: 'sincero', r: "«Hai portato la giacca a me e hai dimenticato la tua. È la cosa più stupida e più dolce di stasera.»" },
      ] },
      { d: "«Il mio ex vendeva integratori. Diceva che non si ammalava mai. E tu?»", a: [
        { t: "«Io mi ammalo sempre. Ho il raffreddore da quando sono nato.»", tono: 'bisognoso', r: "«Davvero? Allora sei il contrario di lui. Già mi piaci di più.»" },
        { t: "«Poco. Ma quando succede chiamo la Mamma. Sinceramente.»", tono: 'sincero', r: "«La Mamma! Un uomo che conosce la gerarchia sanitaria. Brava la Mamma.»" },
        { t: "«Integratori? Io prendo solo la grappa del cugino. Fa tutto.»", tono: 'cafone', r: "«La grappa del Nando. L'ultimo che l'ha bevuta parlava col ponte. Ciao, Garonio.»" },
      ] },
      { d: "«Che gusto hai preso? Ti giudico, sappilo.»", a: [
        { t: "«Pistacchio. E un fior di latte di riserva, nel caso mi andasse male.»", tono: 'sincero', r: "«Un gelato di scorta! Previdente. Sei di pressione e otto di simpatia.»" },
        { t: "«Stracciatella. Ma mi si scioglie sempre sulle mani e mi sento in colpa...»", tono: 'bisognoso', r: "«Vieni, ti pulisco io. Ho sempre una salvietta. Anzi, dieci.»" },
        { t: "«Tutti. Tre coni. Li finisco in due minuti.»", tono: 'spaccone', r: "«Congestione garantita. Il Dottor Mutua riaprirà lo studio solo per te. Contento?»" },
      ] },
      { d: "«Posso dirti una cosa? A volte sono stanca di curare tutti.»", a: [
        { t: "«E chi cura te? Stasera ci provo io. Male, ma ci provo.»", tono: 'sincero', r: "«...Nessuno me l'aveva mai chiesto. Male va benissimo.»" },
        { t: "«Anch'io sono stanco. Di tutto. Mi abbracci?»", tono: 'bisognoso', r: "«Ah ah, va bene, va bene. Due stanchi su una panchina. Terapia di coppia.»" },
        { t: "«Tranquilla, da adesso ci sono io. Risolvo tutto.»", tono: 'sicuro', r: "«Tutto? Anche le liste d'attesa? Mi metti ansia, Garonio.»" },
      ] },
      { d: "«Domani ho il turno all'alba. Mi accompagni?»", a: [
        { t: "«Sì. Poi dormo in sala d'attesa. L'Assunta mi lascia, se le porto un caffè.»", tono: 'sincero', r: "«L'Assunta non lascia dormire nessuno. Però per te faccio domanda ufficiale.»" },
        { t: "«Se mi provi la pressione mentre aspetto.»", tono: 'bisognoso', r: "«Te la provo due volte. Una per lavoro e una per scusa.»" },
        { t: "«All'alba? Ti porto io col trattore a duecento all'ora.»", tono: 'spaccone', r: "«Il trattore fa venticinque all'ora, Garonio. E ho appena finito di medicare quelli che ci credevano.»" },
      ] },
    ],
    maestro: "«...Dici proprio la cosa giusta. Te lo scrivo in cartella: \"paziente sorprendente\".»",
    numero: "«Ecco il mio numero. Usalo se ti senti male. O se ti senti bene. Insomma, usalo.»",
    accetta: "«Sì! Però vestiti a strati. E porta un fazzoletto di stoffa, quelli di carta si disintegrano.»",
    rifiuta: "«Stasera no, ho il turno. E prima voglio vedere come guarisce quel graffio. Non l'hai disinfettato, vero?»",
    bacio: "Al laghetto Noemi ti sistema il bavero, poi ti bacia piano. «Era per sentire la temperatura. Alta. Rifacciamo, per sicurezza.»",
    sale: "«Abito sopra la farmacia. Ho la cassetta del pronto soccorso più fornita della provincia. E un divano. Sali? Visita di controllo.»",
    letto: "Al buio si sente solo la voce di Noemi: «Respira. Ancora. Bravo.» Poi una pausa. «Scusa. È l'abitudine.»",
    reputazione: "«Mi piaci, Garonio. Ma in sala d'attesa non si parla d'altro che di te, e non delle tue analisi. Sistemati un po', va bene?»",
    blocco: "Noemi ti vede e si mette a riordinare i cerotti per taglia, con grande concentrazione. Sei stato archiviato: «caso chiuso».",
    conquistata: [
      "«Il mio paziente preferito! Hai bevuto due litri d'acqua oggi? Bugiardo.»",
      "«Ti ho messo nel portafoglio una bustina di Oki. Non per adesso. Per sempre.»",
      "«Stasera la pressione me la provi tu. Tanto lo so che ti sale quando mi vedi.»",
      "«L'Assunta ha capito tutto. Mi ha detto \"contenta tu\". Da lei è una benedizione.»",
    ],
  },

  tamara: {
    nome: 'Tamara', eta: 38, icona: '🥊',
    chi: "Ex campionessa regionale di kickboxing, insegna alla palestra «Bicipite d'Oro». Schietta, rutta più forte del Tarcisio, odia i leccapiedi e le frasi da Bacio Perugina. Le piace chi dice le cose come stanno, anche male.",
    dove: "Il pomeriggio in palestra al sacco da boxe (15-19), la sera tardi al kebab di Kemal (21-24).",
    posti: [{ ore: [15, 19], interno: 'palestra', x: 10.95, z: 3.0 }, { ore: [21, 24], interno: 'kebab', x: 7.0, z: 4.3 }],
    aspetto: { sprite: 'sportiva', ricolora: { gradi: 210, capelli: '#1a1410' }, w: 16, h: 23, skin: '#d9a07a', hair: '#1a1410', hairStyle: 'coda', shirt: '#e08a2a', pants: '#2a2a3a', boots: '#f4f4f4', eyes: 'angry' },
    gusti: { cafone: 1, sincero: 1, ironico: 0, sicuro: 0, spaccone: -1, romantico: -1, bisognoso: -1 },
    posto: 'kebab',
    saluti: [
      "«Garonio! Vieni qua che ti tiro un calcio. Affettuoso. Tipo tra amici.»",
      "«Kebab doppio a mezzanotte e alle sei ero in palestra. Tu cos'hai fatto di eroico oggi?»",
      "«Tuo padre una volta ha sfidato il mio a braccio di ferro. Ha perso il tavolo.»",
      "«Ho rotto un sacco da boxe. Il Sergente piange in ufficio. Bella giornata.»",
      "«Hai una faccia da pugno. Non dico di dartelo. Dico che ce l'hai.»",
      "(rutto) «Scusa. Anzi no. Ciao.»",
    ],
    primaVolta: "Una donna con le spalle da armadio e il codino ti ferma con un braccio sul petto, poi addenta una piadina. «Tamara. Mi chiamano la Tigre. Perché mordo. La piadina, di solito.»",
    approccio: [
      { d: "«Cosa ne pensi delle donne che fanno a pugni?»", a: [
        { t: "«Che se mi fai male, almeno ho una scusa per non lavorare domani.»", tono: 'sincero', r: "«Ah ah! Onesto. Allora ti faccio male poco: mezza giornata.»" },
        { t: "«Che siete bellissime e delicate come fiori, anche coi guantoni.»", tono: 'romantico', r: "«Delicate come fiori. L'aveva detto anche il mio ultimo fidanzato. Adesso mangia con la cannuccia.»" },
        { t: "«Che mi fai paura e mi fai venire fame insieme. Hai un'altra piadina?»", tono: 'cafone', r: "(ti lancia mezza piadina) «Uno che pensa con lo stomaco. Finalmente uno sincero.»" },
      ] },
      { d: "«Mi offri da bere o offro io? Decidi in fretta.»", a: [
        { t: "«Offri tu. Ho dodici euro e devo fare benzina alla Vespa.»", tono: 'sincero', r: "«Dodici euro! Mi piace un uomo che sa i suoi conti. Due medie.»" },
        { t: "«Paga tu e porta le patatine. E un'altra birra. E un'altra.»", tono: 'cafone', r: "«Questo è parlare. Kemal! Patatine per il signore, che ha fame vera.»" },
        { t: "«Offro io. Champagne per tutti!»", tono: 'spaccone', r: "«Al kebab? Kemal ha la gazzosa. Fai meno lo sbruffone, va'.»" },
      ] },
      { d: "«Hai mai fatto un incontro vero?»", a: [
        { t: "«Una volta con un'oca. Mi ha battuto ai punti.»", tono: 'ironico', r: "«Ai punti! L'oca vince sempre ai punti. Ha più cattiveria di noi.»" },
        { t: "«No. Mi fa paura anche il Sergente quando starnutisce.»", tono: 'sincero', r: "«Il Sergente starnutisce come una mitraglia. È normale. Mi piaci perché lo ammetti.»" },
        { t: "«Ho steso dieci uomini in una sera, al bar.»", tono: 'spaccone', r: "«Al bar ci sono sette sgabelli e il Tarcisio. Rifai i conti.»" },
      ] },
      { d: "«Cosa ti piace in una donna? Sincero, eh. Niente poesie.»", a: [
        { t: "«Che mangi senza fare finta. E che non mi chieda perché ho il fango nelle orecchie.»", tono: 'sincero', r: "«Del fango te l'avrei chiesto. Ma il resto va bene. Molto bene.»" },
        { t: "«Il kebab che ha in mano. Me lo dai?»", tono: 'cafone', r: "(ride con la bocca piena) «Un morso. Uno. Non approfittarne.»" },
        { t: "«I suoi occhi, che brillano come le stelle nel cielo della Bassa.»", tono: 'romantico', r: "«Il cielo della Bassa è grigio. Tutto l'anno. Non mi convinci.»" },
      ] },
      { d: "«Scommetto che non fai dieci flessioni.»", a: [
        { t: "«Hai ragione. Ne faccio tre e poi resto giù a riposare.»", tono: 'sincero', r: "«Tre e poi riposo! È il mio programma della domenica.»" },
        { t: "(ne fa due, poi rutta) «Ecco. Due più il bonus.»", tono: 'cafone', r: "(applaude) «Questo è spirito! Il bonus vale doppio.»" },
        { t: "«Ti prego, niente flessioni, ho la schiena delicata...»", tono: 'bisognoso', r: "«Schiena delicata. Ok. Vai all'acquagym con la Sciura Ines.»" },
      ] },
      { d: "«Dicono che ho un caratteraccio. Tu che ne pensi?»", a: [
        { t: "«Che hai un caratteraccio. Anch'io. Potremmo fare a turno.»", tono: 'sincero', r: "«A turno! Lunedì io, martedì tu. Il mercoledì li usiamo tutti e due sul Moreno.»" },
        { t: "«Chi se ne frega della gente. Passami la salsa piccante e parliamo d'altro.»", tono: 'cafone', r: "«Giusto. La salsa prima delle chiacchiere. Sei uno con le priorità.»" },
        { t: "«Che sotto sotto sei una tenerona. Lo vedo io.»", tono: 'romantico', r: "«Sotto sotto c'è un gancio sinistro. Vuoi vedere anche quello?»" },
      ] },
    ],
    appuntamento: [
      { d: "«Kemal chiede se vuoi la cipolla. Attento: se dici di no, ti giudico.»", a: [
        { t: "«Doppia cipolla. E piccante. Se domani nessuno mi parla, meglio.»", tono: 'cafone', r: "«Uomo vero. Kemal, anche a me. Domani nessuno parla a nessuno dei due.»" },
        { t: "«La cipolla mi rovina, ma la prendo lo stesso. Per te.»", tono: 'sincero', r: "«Sacrificio digestivo. Lo apprezzo. Kemal, dopo dagli un digestivo.»" },
        { t: "«Niente cipolla... dopo magari ci baciamo.»", tono: 'romantico', r: "«Ah, ti fai già i programmi? Kemal: tripla cipolla al signore.»" },
      ] },
      { d: "«Una volta ho fatto a botte col Moreno. Dice che gli ho rotto il naso. Tu che avresti fatto?»", a: [
        { t: "«Gli avrei tenuto la giacca. Per non sporcarla. Era una bella giacca.»", tono: 'cafone', r: "«Ah ah ah! Era bellissima! Sei matto quanto me.»" },
        { t: "«Avrei chiamato Noemi. Il Moreno mi fa sempre un po' pena.»", tono: 'sincero', r: "«Anche a me, dopo. Un pochino. Gli ho offerto un gelato. Ha pianto di nuovo.»" },
        { t: "«Io l'avrei steso con un colpo, senza guardarlo.»", tono: 'spaccone', r: "«Tu hai perso contro un'oca. L'hai detto tu. Mangia, va'.»" },
      ] },
      { d: "«Perché sei uscito con me? E non dirmi che sono bella.»", a: [
        { t: "«Perché sei l'unica che mangia più di me. Mi sento meno in colpa.»", tono: 'sincero', r: "«Il complimento più vero della mia vita. Ti do una patatina.»" },
        { t: "(rutta forte) «Ecco perché. Tu non ti scandalizzi.»", tono: 'cafone', r: "(rutta più forte) «Vinco io. Ma mi piaci.»" },
        { t: "«Perché sei bellissima, anche se mi hai detto di non dirlo.»", tono: 'romantico', r: "«Te l'avevo detto. Adesso paghi tu.»" },
      ] },
      { d: "«Domani ho un incontro amatoriale a Littlesound. Vieni a fare il tifo?»", a: [
        { t: "«Vengo. Col fischietto della sagra e un panino col salame.»", tono: 'cafone', r: "«Il fischietto della sagra! Faremo vergognare tutta Littlesound. Perfetto.»" },
        { t: "«Vengo. Ma se ti fanno male mi metto a piangere. Te lo dico prima.»", tono: 'sincero', r: "«Piangi pure. Poi però le guardi male. Molto male.»" },
        { t: "«Vengo, e se l'altra ti fa male ci penso io.»", tono: 'spaccone', r: "«Tu? Quella di Littlesound pesa cento chili. Semmai ti difendo io.»" },
      ] },
      { d: "«Kemal sta chiudendo. Ultima domanda: com'era il kebab?»", a: [
        { t: "«Buonissimo. Ma tu sei meglio. ...No, il kebab è meglio. Scusa.»", tono: 'sincero', r: "«Hai ragione. Ma arrivo seconda solo al kebab. È un onore.»" },
        { t: "«Ne voglio un altro. Kemal, non chiudere!»", tono: 'cafone', r: "«KEMAL! Un altro! Il mio uomo ha fame!» Kemal riapre la saracinesca sospirando." },
        { t: "«Come la nostra serata: piccante e indimenticabile.»", tono: 'romantico', r: "«Sembra la pubblicità di una gomma da masticare. Non farlo più.»" },
      ] },
    ],
    maestro: "«...Ok. Hai detto la cosa giusta senza fare il poeta. Ti meriti un pugno sulla spalla. Piano.»",
    numero: "«Segnati il numero. Se mi mandi i cuoricini ti blocco. Se mi mandi la foto del kebab ti rispondo.»",
    accetta: "«Ci sto. Ma si va da Kemal, si mangia con le mani e chi lascia avanzi paga.»",
    rifiuta: "«No. Prima vieni in palestra e fai un round con me. Uno. Se ti rialzi, ne parliamo.»",
    bacio: "Fuori dal kebab Tamara ti prende per il bavero e ti bacia come se fosse un round. Sa di cipolla. Anche tu. Pareggio tecnico. «Gong.»",
    sale: "«Abito sopra la palestra. Ho il sacco da boxe in camera e una doccia che fa paura. Vieni? Non mordo. Forse.»",
    letto: "Al buio, una voce: «Round due?» Un'altra voce, più debole: «Mi arrendo. Ai punti.»",
    reputazione: "«Mi stai simpatico. Ma in palestra devo farmi rispettare, e la gente parla. Fatti una fama da uomo, non da barzelletta. Poi vediamo.»",
    blocco: "Tamara ti vede, si scrocchia le nocche e cambia marciapiede. Il marciapiede trema.",
    conquistata: [
      "«Ohi, il mio sparring partner! Oggi gambe o kebab? Facciamo kebab.»",
      "«Ho detto al Sergente che sei il mio fidanzato. Ha fatto cinquanta flessioni per lo shock.»",
      "«Stasera da Kemal? Ti tengo da parte la cipolla.»",
      "«Se al bar qualcuno ti dà fastidio, dimmelo. Gli faccio un discorsino. Coi piedi.»",
    ],
  },

  marta: {
    nome: 'Balerion', eta: 31, icona: '🎹',
    chi: "Suona l'organo nella chiesa di San Garonio. Dal 2014 al 2016 era la bassista dei «Vespri dell'Apocalisse», punk di Littlesound. Tatuaggi sotto le maniche, ironia nera, romantica in modo gotico: ama le cose tristi e belle.",
    dove: "Il pomeriggio in chiesa all'organo (14-18), poi al bar vicino al juke-box (18-20).",
    posti: [{ ore: [14, 18], interno: 'chiesa', x: 11.6, z: 1.5 }, { ore: [18, 20], interno: 'bar', x: 20.0, z: 1.4 }],
    aspetto: { sprite: 'mora_occhiali', ricolora: { capelli: '#141418' }, w: 15, h: 23, skin: '#f4d8c8', hair: '#141418', hairStyle: 'long', shirt: '#1a1a1a', pants: '#1a1a1a', boots: '#1a1a1a', eyes: 'normal' },
    gusti: { ironico: 1, romantico: 1, sincero: 0, sicuro: 0, spaccone: -1, bisognoso: -1, cafone: -1 },
    posto: 'campanile',
    saluti: [
      "«Ciao Garonio. Al matrimonio dei Ferrari ho suonato la marcia funebre. Nessuno se n'è accorto. Che tristezza. Che bellezza.»",
      "«Don Peppino dice di suonare più allegro. Ho fatto i Ramones a velocità da messa. Ha detto \"brava\".»",
      "«Ciao. Sei vivo? Bene. Non si sa mai, di questi tempi.»",
      "«In sagrestia c'è un pipistrello. L'ho chiamato Garonio. Dorme di giorno, come te.»",
      "«Suor Carmela mi ha visto il tatuaggio. Le ho detto che è un santo. È Sid Vicious. Si è fatta il segno della croce.»",
      "«La nebbia di stasera è perfetta. Sembra un video anni Ottanta girato a Saint James Borough.»",
    ],
    primaVolta: "In chiesa l'organo attacca un accordo cupissimo e si ferma di colpo. Dalla cantoria si sporge una ragazza con le unghie nere. «Ciao. Sono Balerion, suono qui. Tu sei quello che dorme al terzo banco. Russi in re minore, lo sapevi?»",
    approccio: [
      { d: "«Che musica ascolti?»", a: [
        { t: "«Liscio. Ma lo ascolto in modo molto triste e profondo.»", tono: 'ironico', r: "«Il liscio esistenziale. \"Romagna mia\" con la nebbia dentro. Ok, mi hai incuriosita.»" },
        { t: "«Quella che suoni tu. Anche quando sbagli. Soprattutto quando sbagli.»", tono: 'romantico', r: "«Io non sbaglio, faccio dissonanze intenzionali. ...Ok, a volte sbaglio. Grazie.»" },
        { t: "«La migliore. Ho tremila canzoni sul telefono, tutte belle.»", tono: 'spaccone', r: "«Nessuno ha tremila canzoni belle. Nemmeno Dio, e ha l'organo più grande.»" },
      ] },
      { d: "«Credi nel destino, Garonio?»", a: [
        { t: "«Credo che il destino mi abbia fatto nascere figlio del Gigante per punirmi. Non so ancora di cosa.»", tono: 'ironico', r: "«Un karma agricolo. Ci scrivo un pezzo: \"Il figlio del Gigante (lato B)\".»" },
        { t: "«Adesso un po' di più. Prima di entrare qui, no.»", tono: 'romantico', r: "«Eri entrato a cercare il bagno, vero? Lo so. Ha funzionato lo stesso.»" },
        { t: "«Il destino me lo costruisco io. Coi bicipiti.»", tono: 'spaccone', r: "«I bicipiti non costruiscono niente. Chiedi al Sergente: hanno lasciato pure lui.»" },
      ] },
      { d: "«Dicono che sono strana. Tu che dici?»", a: [
        { t: "«Strana è la Vigilessa che multa sua madre. Tu sei solo interessante.»", tono: 'ironico', r: "«\"Solo\" interessante. Ti accetto il \"solo\". Per ora.»" },
        { t: "«Sei strana come una notte di nebbia: non vedi niente, ma non vuoi tornare a casa.»", tono: 'romantico', r: "«...Ma da dove l'hai tirata fuori? Ok. Ok. Dammi un minuto.»" },
        { t: "«Un po'. Sembri una che abita al cimitero. Non offenderti.»", tono: 'cafone', r: "«Ci abito vicino. Ed è meglio del bar. Ciao, Garonio.»" },
      ] },
      { d: "«Cosa faresti se domani finisse il mondo?»", a: [
        { t: "«Andrei al bar a dirlo al Tarcisio. Per vedere se se ne accorge.»", tono: 'ironico', r: "«Non se ne accorgerebbe. Ordinerebbe un bianchino. Il Tarcisio sopravvive all'apocalisse.»" },
        { t: "«Verrei qui ad ascoltarti. L'ultima canzone la sceglieresti tu.»", tono: 'romantico', r: "«Sceglierei una cosa lentissima. Così il mondo dovrebbe aspettare che finisca.»" },
        { t: "«Non dire queste cose, mi metti ansia... ho già tanta ansia...»", tono: 'bisognoso', r: "«Ok. Respira. ...Anzi, vai da Noemi. Io suono l'organo, non faccio la psicologa.»" },
      ] },
      { d: "«Ti piacciono i film dell'orrore?»", a: [
        { t: "«Li guardo con la Mamma. Lei urla, io mi nascondo dietro di lei. Siamo una squadra.»", tono: 'sincero', r: "«Madre e figlio contro gli zombie. Sei più tenero di quanto pensassi.»" },
        { t: "«Ne vivo uno tutti i giorni. Si chiama Mister Mountain.»", tono: 'ironico', r: "«Un horror senza budget. Il peggiore: quello in cui non muore mai nessuno.»" },
        { t: "«No, sono stupidi. Roba da ragazzine.»", tono: 'cafone', r: "«Ti lascio con la tua roba da uomini: il silenzio. Ciao.»" },
      ] },
      { d: "«Ti piace il suono delle campane?»", a: [
        { t: "«Sempre, tranne la domenica alle sette. Lì le odio con tutto il mio cuore cristiano.»", tono: 'ironico', r: "«Le campane delle sette le suono io. Per vendetta. Contro tutti. Anche contro di te.»" },
        { t: "«Adesso che so che le suoni tu, mi sveglio contento.»", tono: 'romantico', r: "«Allora domenica faccio un rintocco in più. Quello è tuo. Non dirlo a Don Peppino.»" },
        { t: "«Le ho suonate io una volta. Meglio di chiunque.»", tono: 'spaccone', r: "«Quella volta che si è staccato il batacchio? Sì. Lo sanno tutti.»" },
      ] },
    ],
    appuntamento: [
      { d: "«Da qui si vede tutto il paese. Tu cosa vedi?»", a: [
        { t: "«Il bar, il kebab e la nebbia. In pratica, tutto il mio futuro.»", tono: 'ironico', r: "«Un futuro avvolto nella nebbia. Il più romantico che esista. Dico sul serio.»" },
        { t: "«Un paese piccolo. E te, che lo fai sembrare più grande.»", tono: 'romantico', r: "«Non dirlo così vicino alla campana. Rimbomba. Mi si sente il cuore fin giù in piazza.»" },
        { t: "«Il castello del Conte. Un giorno me lo compro.»", tono: 'spaccone', r: "«Il castello cade a pezzi. E tu cadi dal campanile se ti sporgi così. Siediti.»" },
      ] },
      { d: "«Suonavo il basso nei Vespri dell'Apocalisse. Ti sembro cambiata?»", a: [
        { t: "«No. Solo che adesso il tuo pubblico sono vecchiette che cantano più forte di un concerto punk.»", tono: 'ironico', r: "«È vero! La Sciura Ines al Gloria fa più casino di un pogo.»" },
        { t: "«Un po'. Ma il punk ti è rimasto negli occhi. E nelle calze.»", tono: 'romantico', r: "«Le calze sono del 2015. Te ne sei accorto. Non se n'era mai accorto nessuno.»" },
        { t: "«Allora suonami qualcosa. Adesso. Voglio sentire quanto sei brava.»", tono: 'cafone', r: "«Qui? Senza basso? Sei un fan esigente o un cretino? Non rispondere.»" },
      ] },
      { d: "«Hai paura dell'altezza?»", a: [
        { t: "«Sì, tanto. Ma resto. Stai vicina, così sembra meno alto.»", tono: 'romantico', r: "«È alto uguale. Però va bene. Resto anch'io.»" },
        { t: "«Ho paura delle cose basse. Tipo il mio conto in banca.»", tono: 'ironico', r: "«Ah ah! L'abisso più profondo della Bassa.»" },
        { t: "«Paura? Potrei saltare giù e atterrare in piedi.»", tono: 'spaccone', r: "«Prego. Ma sotto c'è la Vigilessa. Ti fa la multa anche in volo.»" },
      ] },
      { d: "«Se scrivessi una canzone su di te, che titolo avrebbe?»", a: [
        { t: "«\"Ballata per un trattore e un cuore che non parte\".»", tono: 'ironico', r: "«Questa te la rubo. Nei crediti ti metto come \"il Vespa\".»" },
        { t: "«\"Balerion\". Non serve altro.»", tono: 'romantico', r: "«...La canzone doveva essere su di te, Garonio. Ma va bene. Va bene così.»" },
        { t: "«\"Il più grande di tutti\". Rap, ovviamente.»", tono: 'spaccone', r: "«Un rap su un campanile del Seicento. Le campane si vergognano per te.»" },
      ] },
      { d: "«Mi passi la coperta? Quassù fa freddo.»", a: [
        { t: "«Te la passo e mi siedo vicino. È fisica: il calore si trasmette.»", tono: 'ironico', r: "«Termodinamica sul campanile. Va bene, professore. Più vicino.»" },
        { t: "«Prendila tutta. Io mi scaldo guardandoti.»", tono: 'romantico', r: "«Smettila. No, non smettere. Sì, smettila. Ok, siediti qui.»" },
        { t: "«Dividiamola, ti prego, sto congelando, non sento più le dita...»", tono: 'bisognoso', r: "«Ma non eri tu quello col \"sangue caldo della Bassa\"? Tieni, piagnone.»" },
      ] },
    ],
    maestro: "«...Era una battuta e una dichiarazione insieme. La cosa più punk mai sentita in chiesa.»",
    numero: "«Il mio numero. Non chiamare durante la messa delle undici: ho la suoneria dei Nirvana.»",
    accetta: "«Va bene. Stasera c'è la luna giusta. Non chiedermi come lo so.»",
    rifiuta: "«No. Mi servono più indizi. Per ora sei un mistero mediocre.»",
    bacio: "In cima al campanile Balerion ti bacia proprio mentre la campana batte le undici. Per poco non restate sordi tutti e due. «Bacio con accompagnamento musicale. Non capita a tutti.»",
    sale: "«Abito sopra il negozio di dischi chiuso dal 2003. Ho un giradischi e una candela a forma di teschio. Sali?»",
    letto: "Al buio parte un vinile dei Cure. Finisce e gira a vuoto per mezz'ora. Nessuno si alza a cambiarlo.",
    reputazione: "«Mi piaci, sai? Ma Suor Carmela mi ha fatto la predica su di te. Tre ore, senza pause. Sistema la tua fama, io qui ci devo ancora suonare.»",
    blocco: "Balerion ti vede entrare in chiesa e attacca all'organo la Toccata e Fuga. Il messaggio è chiaro: fuga.",
    conquistata: [
      "«Ciao, Vespa. Stasera campanile o jukebox?»",
      "«Ho scritto un pezzo su di te. Dura quattro minuti. Tre sono di nebbia.»",
      "«Don Peppino dice che da quando ci sei tu suono più allegro. Gli ho detto che è un effetto collaterale.»",
      "«Domenica le campane delle sette le suono più piano. Così dormi. Visto? È amore.»",
    ],
  },
};

// ---------- Luoghi degli appuntamenti (la sera, dalle 20 alle 23:30) ----------
export const LUOGHI = {
  pizzeria: { nome: 'Pizzeria «Bella Napoli» in Via Roma', breve: 'la pizzeria di Gennaro', costo: 25, x: 34.6, z: 73.1,
    intro: "Pizzeria «Bella Napoli», tovaglie a quadretti, Gennaro che canta. Il Bepi guarda da fuori col naso sul vetro." },
  laghetto: { nome: 'Gelato al laghetto', breve: 'il laghetto', costo: 8, x: 34, z: 76.6,
    intro: "Due coni al pistacchio, la luna sul laghetto, le anatre che dormono. Una rana canta stonata." },
  ponte: { nome: 'Le stelle dal ponte', breve: 'il ponte sul canale', costo: 0, x: 119, z: 8,
    intro: "Il ponte sul canale. Un cielo pieno di stelle e l'odore di fosso, che però stasera non dà fastidio." },
  castello: { nome: 'Cena al castello', breve: 'il castello del Conte', costo: 60, x: 10, z: 99.6,
    intro: "Candelabri (due candele vere, le altre sono lampadine), Ambrogio in livrea, e il Conte che vi spia dalla scala fingendo di cercare gli occhiali." },
  kebab: { nome: 'Kebab di mezzanotte da Kemal', breve: 'il kebab di Kemal', costo: 12, x: 19.6, z: 50.4,
    intro: "L'insegna al neon che ronza, due sgabelli di plastica, Kemal che taglia la carne come un samurai. Profumo di cipolla nella nebbia." },
  campanile: { nome: 'Sul campanile al chiaro di luna', breve: 'il campanile', costo: 5, x: 11.7, z: 74.5,
    intro: "Novantasei gradini, una coperta, la luna sopra la nebbia. Don Peppino ha chiesto «un'offerta per i lumini». Cinque euro, esatti." },
};
export const ORA_APPUNTAMENTO = [20, 23.5];

// ---------- Punti red pill ----------
// salgono con le risposte giuste, scendono con quelle sbagliate. Più sono alti, più si vede cosa le piace.
export const RED_PILL = {
  partenza: 10,
  giusta: 4, sbagliata: -5, mancato: -6, conquista: 10, maestro: 6,
  intuito: 35,       // da qui, a volte, Garonio intuisce la risposta giusta (👀)
  maestroDa: 70,     // da qui compare la «mossa da maestro» (😎)
  ranghi: [
    [0, 'Pillola blu', 'Garonio crede ancora che basti un «ciao» con tre punti di sospensione.'],
    [20, 'Sveglio a metà', 'Comincia a capire che le domande hanno un secondo fondo.'],
    [40, 'Pillola rossa', 'Legge le ragazze come Zeno legge un preventivo: tra le righe.'],
    [60, 'Morpheus della Bassa', 'Al bar gli chiedono consigli. Il Consulente prende appunti.'],
    [80, 'Leggenda del bancone', 'Loredana gli offre il caffè. Gratis. Mai successo a nessuno.'],
  ],
};

// ---------- Numeri del corteggiamento ----------
export const CUORE = {
  giusta: 12, neutra: 3, sbagliata: -10,  // affinità per risposta
  postoPreferito: 8,                      // bonus se il luogo dell'appuntamento è quello che le piace
  numero: 30,                             // affinità per avere il numero
  appuntamento: 40,                       // affinità minima perché accetti di uscire
  bacio: 60,                              // affinità a fine serata per il bacio
  sale: 70,                               // affinità a fine serata perché ti inviti a salire
  reputazione: 40,                        // reputazione in paese minima per salire
  blocco: -20, giorniBlocco: 3,           // sotto questa affinità ti blocca per qualche giorno
  mancato: -20,                           // appuntamento saltato
  minuti: 15,                             // durata di un approccio
  conquista: { stress: 45, xp: 80, reputazione: 3 },   // poi Garonio si sveglia a casa la mattina dopo
};

// ---------- Testi comuni ----------
export const TESTI_RAGAZZE = {
  chiusuraBuona: "«Va bene, Garonio. Non sei male come dicono. Ci si vede in giro.»",
  chiusuraMale: "«Mh. Ci devo pensare. Tanto. Magari anche per sempre.»",
  postoPreferito: "«Proprio qui? È il mio posto preferito. Come facevi a saperlo?» Punto per te.",
  giaParlato: "«Per oggi abbiamo già dato, Garonio. Non consumarmi tutta subito.»",
  affanno: "Garonio la rincorre ansimando. Stanchezza +3.",
  maestro: "😎 (sguardo alla Morpheus) «Dimmi una cosa che non hai mai detto a nessuno.»",
  appuntamentoFissato: "Appuntamento fissato: stasera dalle 20 a {luogo}. Non tardare.",
  promemoria: "«Ci vediamo stasera a {luogo}, dalle 20! Non farmi aspettare.»",
  giaFissato: "Hai già un appuntamento stasera. Non fare il furbo.",
  tardi: "«Stasera? È troppo tardi per organizzarsi. Chiedimelo prima, la prossima volta.»",
  scegliLuogo: "Dove la porti?",
  mancato: "💔 Hai dato buca a {nome}. Ha aspettato un'ora a {luogo}. Lo sa già tutto il paese.",
  senzaSoldi: "Arriva il conto: {costo}€. Garonio si tasta le tasche: ne ha {soldi}. {nome} paga lei, con un sorriso di ghiaccio.",
  paga: "Garonio paga {costo}€ con nonchalance. Quasi.",
  scappa: "{nome} guarda l'orologio. «Ah, ho lasciato il forno acceso. Da tre anni.» E se ne va.",
  guancia: "Un bacio sulla guancia e un «ci vediamo». Non male, Garonio. Non bene, ma non male.",
  scelte: {
    sale: [
      { t: "«Con piacere.» (sorriso tranquillo)", ok: true },
      { t: "«SÌÌÌ! FINALMENTE!»", ok: false, r: "«...Calma. Mi hai fatto passare la voglia. Un'altra volta, campione.»" },
      { t: "«Devo chiedere a mia mamma.»", ok: false, r: "«Tua mamma. Ok. Salutamela. Buonanotte, Garonio.»" },
    ],
  },
  buio: "...",
  mattino: [
    "Il giorno dopo, in paese, Garonio cammina un po' più dritto.",
    "Il Bepi, dalla finestra, alza il pollice. Come fa a saperlo? Il Bepi sa sempre tutto.",
  ],
  // frasi della sera dopo una conquista, al bar o in giro
  pettegolezzo: [
    "Ohhh, il Casanova della Bassa!", "Garonio! Ma è vero della {nome}?", "Ma guarda chi c'è, il latin lover col trattore!",
    "Ehi Casanova, la {nome} ti cerca. Spero per te che sia per amore.",
    "Ho visto la {nome} comprare lo sciroppo per la tosse. Per due. Ah-ah.",
    "Ho aperto un registro delle tue fidanzate. La {nome} l'ho scritta in stampatello.",
    "Te e la {nome}. Lo sapevo da tre settimane. Lo sapevo prima di te.",
    "Dicono che stanotte il paese era più silenzioso. Tutti a origliare. Brava la {nome}.",
  ],
};
