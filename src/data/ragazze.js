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
//  Tutte adulte, tutte con la battuta pronta. Niente scene: in camera si sfuma al nero.
// =====================================================================

export const RAGAZZE = {
  debora: {
    nome: 'Debora', eta: 32, icona: '🏋️‍♀️',
    chi: 'Personal trainer alla palestra «Bicipite d\'Oro» di Codogno. Corre sulla capezzagna la mattina presto.',
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
    ],
    primaVolta: "Una ragazza in tuta fucsia ti sorpassa, si ferma e corre sul posto davanti a te. «Debora. Personal trainer. E tu hai la faccia di uno che non fa uno squat dal 2009.»",
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
    ],
    appuntamento: [
      { d: "«Allora, Garonio. Cosa vuoi fare da grande? E non dire \"il figlio del Gigante\".»", a: [
        { t: "«Voglio prendere in mano l'azienda. Ma a modo mio.»", tono: 'sicuro', r: "«Un piano. Uno vero. Ok, sono colpita. Poco. Ma colpita.»" },
        { t: "«Il gatto. Volevo fare il gatto. Mia madre lo racconta ancora.»", tono: 'sincero', r: "(ride col boccone in bocca) «Un sogno ambizioso. Dormi già sedici ore, sei a metà strada.»" },
        { t: "«Il milionario. Ho già tre idee: le criptovalute delle nutrie...»", tono: 'spaccone', r: "«Le cripto-nutrie. Ah. Ok. Mi passi il sale?»" },
      ] },
      { d: "«Io mangio solo la metà della pizza. L'altra metà la vuoi tu?»", a: [
        { t: "«Mangiala tutta. È il tuo cheat day, te lo meriti.»", tono: 'sicuro', r: "«...Hai detto la cosa giusta. Nessuno mi ha mai detto la cosa giusta.»" },
        { t: "«Sì sì sì, dammela tutta!»", tono: 'cafone', r: "Garonio si avventa sulla pizza. Debora lo guarda come si guarda un procione nella spazzatura." },
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
    ],
    maestro: "«...Va bene, mi hai fregata. Era la risposta perfetta. Non abituarti.»",
    numero: "«Tieni. Il mio numero. Se mi scrivi \"ciao\" con tre punti di sospensione ti blocco.»",
    accetta: "«Un appuntamento? Mh. Ok. Ma niente sushi del discount: l'ultimo mi ha fatto saltare una gara.»",
    rifiuta: "«Uscire con te? Fammi vedere prima che arrivi in fondo alla capezzagna senza fermarti.»",
    bacio: "A fine serata Debora ti dà un bacio veloce e deciso, come un allenamento a intervalli. «Ok. Promosso. Ci risentiamo.»",
    sale: "«Senti... casa mia è qui dietro. Ho la cyclette nuova da farti vedere. E no, non è un modo di dire. Cioè sì. Vieni?»",
    letto: "Ventidue minuti dopo Debora guarda il cardiofrequenzimetro: «Zona aerobica raggiunta. Bravo, campione.»",
    reputazione: "«Mi piaci, eh. Ma in paese si dicono cose su di te... la Pina mi ha già scritto tre messaggi. Un'altra volta, ok?»",
    blocco: "Debora ti supera di corsa senza guardarti. Sulla tuta, la scritta «NON FERMARTI MAI». Vale anche per te.",
    conquistata: ["«Ehi, il mio compagno di cyclette. Corri due giri con me?»", "«Oggi gambe o braccia? Scherzo. Per te, divano.»"],
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
    conquistata: ["«Ciao, mio campione statisticamente significativo.»", "«Ho una zolla nuova da farti annusare. È un complimento, giuro.»"],
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
    conquistata: ["«Ciao, tesoro. Hai messo la crema che ti ho dato? Fammi vedere le mani.»", "«Il mio cliente preferito. E non solo cliente.»"],
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
      { d: "«Domani porto il latte fino a Cremona. Vieni con me in cabina?»", a: [
        { t: "«Ci sto. Ma si ferma all'autogrill, che ho fame.»", tono: 'sicuro', r: "«All'autogrill ci fermiamo sempre. Panino col salame e caffè doppio. Hai capito come funziona.»" },
        { t: "«Ti prego sì, non lasciarmi solo in questa fattoria...»", tono: 'bisognoso', r: "«Eh, Garonio. Il latte non lo porto in due per pietà.»" },
        { t: "«Solo se mi lasci suonare il clacson sotto casa del Gigante.»", tono: 'ironico', r: "«Alle quattro e mezza. Tre colpi lunghi. È deciso.»" },
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
    conquistata: ["«Ohi, Trattore Minore! Vieni a Cremona con me?»", "«Il mio passeggero preferito. Allacciati la cintura.»"],
  },
};

// ---------- Luoghi degli appuntamenti (la sera, dalle 20 alle 23:30) ----------
export const LUOGHI = {
  pizzeria: { nome: 'Pizzeria «Da Gennaro» in piazza', breve: 'la pizzeria in piazza', costo: 25, x: 18.5, z: 51.4,
    intro: "Pizzeria «Da Gennaro», tovaglie a quadretti, Gennaro che canta. Il Bepi guarda da fuori col naso sul vetro." },
  laghetto: { nome: 'Gelato al laghetto', breve: 'il laghetto', costo: 8, x: 34, z: 76.6,
    intro: "Due coni al pistacchio, la luna sul laghetto, le anatre che dormono. Una rana canta stonata." },
  ponte: { nome: 'Le stelle dal ponte', breve: 'il ponte sul canale', costo: 0, x: 119, z: 8,
    intro: "Il ponte sul canale. Un cielo pieno di stelle e l'odore di fosso, che però stasera non dà fastidio." },
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
  pettegolezzo: ["Ohhh, il Casanova della Bassa!", "Garonio! Ma è vero della {nome}?", "Ma guarda chi c'è, il latin lover col trattore!"],
};
