// =====================================================================
//  EDIFICI DEL PAESE ESPLORABILI — chiesa, castello, farmacia, studio medico, palestra, pizzeria, kebab
//  (e il caffè da Zeno). Solo testi e numeri: il codice sta in src/edifici.js, le stanze in src/data/interni.js,
//  i personaggi in src/data/png.js.
// =====================================================================

export const PREZZI = {
  cero: 1, offerta: 2, benedizione: 5, visita: 3, bilancia: 0.2,
  visitaMedica: 15, palestra: 5, sergente: 10,
  pizza: 7, pizzaAsporto: 8, kebab: 6, kebabNotte: 5, kebabAsporto: 6, bibita: 2, caffeZeno: 1,
};

// la farmacia: cosa si compra al banco (oggetti in src/data/armi.js)
export const FARMACIA = [
  { id: 'aspirina', prezzo: 4, dice: "«Un'aspirina. Per il mal di testa da padre è la dose da cavallo, ma lei è grosso.»" },
  { id: 'sciroppo', prezzo: 9, dice: "«Sciroppo ricostituente. Sa di ferro e di nonna. Funziona, giuro.»" },
  { id: 'pomata', prezzo: 10, dice: "«La pomata. Quella del Bubetto è per le vacche, questa per i cristiani. Il tubetto è uguale, sì.»" },
  { id: 'integratore', prezzo: 6, dice: "«Integratore Forza Bassa: magnesio, potassio e un pizzico di disperazione.»" },
];

// lavoretti al castello (uno al giorno, chiesti al Conte). Dopo 3 lavoretti il Conte dà la chiave del forziere.
export const LAVORI_CONTE = [
  { testo: "Lucidare le armature del salone. Tutte e due. Anche dentro, dove c'è il ragno.", ore: 2, paga: 25, fatica: 18 },
  { testo: "Spolverare la biblioteca. Quattrocento libri, nessuno letto dal 1911.", ore: 2, paga: 22, fatica: 14 },
  { testo: "Cacciare i piccioni dalla torre. I piccioni non sono d'accordo.", ore: 2, paga: 28, fatica: 22 },
  { testo: "Spaccare la legna per il camino della sala del trono. «Pezzi regolari, prego. Siamo nobili».", ore: 2, paga: 26, fatica: 24 },
];
export const CHIAVE_FORZIERE = 3;

export const TESTI_EDIFICI = {
  // ---------- chiesa ----------
  chiesa: {
    altare: "L'altare di marmo. Sopra, un messale aperto alla pagina «Beati i miti». Il Gigante non l'ha mai letta.",
    confessaVuoto: "Il confessionale è vuoto. Dentro c'è una Settimana Enigmistica a metà e una caramella alla menta.",
    confessaGia: "«Ancora? Figliolo, ti sei già confessato oggi. Non esagerare, che poi mi preoccupo.»",
    confessa: "Ti inginocchi. Da dietro la grata arriva odore di toscano. «Dimmi, figliolo. Cosa hai combinato?»",
    peccati: [
      { label: "Ho dormito invece di lavorare", dice: "«Il sonno è un dono di Dio. Il lavoro è un dono di tuo padre. Tre Ave Maria, e una zappata in più.»" },
      { label: "Ho rubato il salame dalla cantina", dice: "«Il salame... Di che stagionatura? No, non rispondere. Due Pater Noster e portami una fetta.»" },
      { label: "Ho pensato male di mio padre", dice: "«Tutto il paese pensa male di tuo padre, figliolo. Non è peccato, è statistica. Vai in pace.»" },
      { label: "Ho guardato le ragazze del paese", dice: "«Guardare non è peccato. Lo diventa se poi vai al Night. Ci vai al Night? ...Dieci Ave Maria.»" },
    ],
    peccatoMulte: { label: "Ho delle multe non pagate", dice: "«Dai a Cesare quel che è di Cesare, e alla Vigilessa quel che è della Vigilessa. Prima che te lo prenda lei.»" },
    peccatoTruffe: { label: "Ho fatto dei lavoretti «speciali» per mio padre", dice: "«...Questo resta tra noi e il Signore. E il Signore, ti avverto, parla con il Patata.»" },
    assolto: "Ti senti leggero come una balla di fieno vuota. Stress -12",
    cero: "Accendi un cero. La fiammella tremola. Un euro per un desiderio: più economico della fontana. Stress -4",
    ceroGia: "Hai già acceso il tuo cero oggi. Il Signore ti ha sentito. Anche la cassetta, a dire il vero.",
    ceroPovero: "Non hai neanche un euro. Il cero ti guarda con compassione.",
    banco: "Ti siedi sul banco di legno. Silenzio, fresco, luce colorata... le palpebre diventano pesanti.",
    bancoDormi: "Zzz... mezz'ora di pace celeste. Stanchezza -12, stress -3",
    bancoSveglia: "Ti sveglia Don Peppino col campanello della messa: «In chiesa si prega, non si russa!» Stress +2",
    bancoNo: "Ti siedi un attimo. Ti senti più buono. Per circa quaranta secondi.",
    acquasantiera: "Ti fai il segno della croce con l'acqua santa. È fredda. Ti svegli anche un po'.",
    offerte: "Cassetta delle offerte: «PER IL TETTO DEL CAMPANILE». Il campanile pende da trent'anni. Il tetto aspetta.",
    offerta: "Infili due euro nella cassetta. Clinc. Da qualche parte un angelo prende nota. E anche la Pina, che passava.",
    paramenti: "L'armadio dei paramenti: tonache, stole e una maglia del Milan piegata con cura. Ognuno ha la sua fede.",
    vinoSuora: "Allunghi la mano verso la bottiglia. «GARONIO.» Suor Carmela è dietro di te. Da quanto? Da sempre. Stress +3",
    vino: "Un sorso di vino della messa. È dolce, forte e ti fa sentire santo. Per un attimo. Stress -8, stanchezza +4",
    vinoGia: "La bottiglia è stata rimessa al suo posto. Con un segno a matita sul livello. Suor Carmela non perdona.",
    campane: "Tiri la corda con tutte le forze. DONG! DONG! DONG! Tutto il paese esce di casa a vedere chi è morto. Stress -6",
    campaneDon: "«CHI HA SUONATO LE CAMPANE?» Don Peppino arriva di corsa. Fai finta di pregare. Non ci crede.",
    campaneGia: "La corda è stata legata in alto. Suor Carmela impara in fretta.",
  },
  donPeppino: {
    benedizione: "Benedizione (offerta di 5€)",
    benedetto: "Don Peppino ti spruzza di acqua santa: «Benedico te, la tua zappa e anche il trattore, che ne ha bisogno.» Stress -5",
    giaBenedetto: "«Ti ho già benedetto oggi. Troppa benedizione fa male, come il lambrusco.»",
    chiediConte: "Chiedi del castello",
    conte: "«Il Conte? Brava persona. Viene a messa la domenica, si siede in prima fila e si addormenta in prima fila. Al castello c'è sempre qualche lavoretto, se ti servono soldi.»",
  },
  suoraCarmela: {
    aiuta: "Aiuta in sagrestia (1 ora)",
    aiutato: "Lucidi i candelabri, pieghi le tovaglie e trovi tre centesimi dietro l'armadio. Suor Carmela ti dà 8€ e un santino «per buona condotta».",
    giaAiutato: "«Per oggi basta così. Torna domani, e pulisciti le scarpe.»",
    stanco: "«Sei stanco morto. Vai a casa a dormire, che qui si lavora sul serio.»",
  },
  // ---------- castello ----------
  castello: {
    armatura: [
      "Un'armatura del Cinquecento. Dentro, dicono, c'è ancora il cavaliere. Ambrogio dice che è una diceria. Ambrogio non ci passa davanti di notte.",
      "L'armatura ha un'ammaccatura sul petto a forma di forcone. Antenati del Gigante?",
    ],
    arazzo: "Un arazzo: la battaglia di Codogno del 1525. A guardar bene, metà dei soldati sono contadini che scappano coi maiali.",
    cassapanca: "Apri la cassapanca: coperte di lana, naftalina e... cinque monete antiche! Le prendi. Il Conte non le conterà, spera. +5€",
    cassapancaVuota: "La cassapanca. Coperte, naftalina e il buco dove c'erano le monete.",
    camino: "Ti scaldi davanti al camino. Il fuoco scoppietta. Per un momento ti senti un conte anche tu. Stanchezza -3, stress -3",
    tronoConte: "Fai per sederti sul trono. «SI ALZI IMMEDIATAMENTE.» Il Conte ha la voce di un uomo che non ha più terre ma ha ancora l'orgoglio.",
    trono: "Ti siedi sul trono. È scomodo come tutti i troni. Per un attimo il Gigante ti sembra piccolo piccolo. Stress -5",
    ritratto: "Gli antenati del Conte ti guardano dai ritratti. Tutti con lo stesso naso. Anche la contessa del 1700.",
    banchetto: "La tavola del banchetto è apparecchiata per dodici. Il Conte mangia da solo, a capotavola, da quarant'anni.",
    libreria: "Ambrogio ti lascia sfogliare il «Trattato di agronomia nobile» del 1823. Capisci un terzo delle parole. Ma quel terzo serve. +30 XP",
    libreriaGia: "La libreria del Conte. Quattrocento volumi rilegati in pelle. Hai già letto quello utile; gli altri parlano di cavalli.",
    mappa: "La mappa dei possedimenti del Conte nel 1820: metà della Bassa. Ci sono anche i campi del Gigante, segnati come «terreno paludoso, contadini molesti».",
    forziereChiuso: "Il forziere del Conte. Chiuso con un lucchetto antico. Ambrogio dice che la chiave ce l'ha il Conte, e il Conte dice che ce l'ha Ambrogio.",
    forziere: "Giri la chiave. Il forziere cigola. Dentro: 50€ in vecchie lire «convertite», due bottiglie di grappa del 1890 e una lettera d'amore a una lavandaia. Prendi soldi e grappa. La lettera la lasci.",
    forziereVuoto: "Il forziere è vuoto. C'è solo la lettera d'amore alla lavandaia. Non la leggi. Va bene, la leggi. È bellissima.",
  },
  conte: {
    lavoro: "Lavoretto per il Conte",
    lavoroDice: "«Ah, la manodopera. Bene. Oggi c'è da...»",
    lavoroFatto: "«Ottimo lavoro, per essere del popolo. Ecco il compenso.» Il Conte ti dà {paga}€ contandoli due volte.",
    lavoroGia: "«Per oggi basta, giovanotto. Il castello è grande ma le mie finanze no.»",
    stanco: "«Lei è stanco morto. Non voglio un plebeo svenuto sui miei tappeti.»",
    chiave: "«Lei si è dimostrato onesto. Prenda: la chiave del forziere delle segrete. Tenga quello che trova, tanto è vuoto. Credo.»",
    storie: "Ascolta le storie del Conte",
    raccontiDice: [
      "«Nel 1859 il mio trisavolo ospitò Garibaldi. Garibaldi non pagò il conto. Da allora odiamo i rossi. E le camicie.»",
      "«Una volta il castello aveva un fossato pieno d'acqua. Ora è pieno di nutrie. Anche loro pagano l'affitto: zero.»",
      "«Mio padre giocò a carte il bosco a nord con il nonno del Patata. Perse. Le patate del Patata, in un certo senso, sono mie.»",
    ],
  },
  ambrogio: {
    visita: "Visita guidata del castello (3€)",
    visitaDice: "Ambrogio ti porta in giro per un'ora: armature, sale, segrete e il punto esatto dove nel 1702 scivolò un vescovo. +15 XP",
    visitaGia: "«Il giro l'ha già fatto, signore. Le stanze non sono cambiate. La polvere sì, un po'.»",
    te: "Chiedi un tè",
    teDice: "«Un tè? Certamente.» Torna dopo cinque minuti con una tazza vuota. «Il tè è finito nel 1987. Ma la tazza è di porcellana.»",
  },
  // ---------- farmacia ----------
  farmacia: {
    banco: "«Prego! Cosa le do?»",
    comprato: "Comprato: {nome}.",
    povero: "Non hai abbastanza soldi. Il Dottor Pastiglia ti consiglia una camomilla: costa meno.",
    chiuso: "Il banco è vuoto. Un cartello: «Torno subito. Non toccate le caramelle».",
    espositore: "Espositore delle offerte: crema antirughe, cerotti con le paperelle e un'«acqua miracolosa di Lourdes» con l'etichetta del discount.",
    bilancia: "Sali sulla bilancia. Clac. Un bigliettino: «{peso} kg. {commento}»",
    commentiPeso: ["La mamma dice che sei sciupato. La bilancia no.", "Il peso perfetto per un trattore. Per un uomo, ne parliamo.", "Fortuna: oggi incontrerai una nutria. Peso: tanto."],
    consiglio: "Un consiglio sulla salute",
    consigli: {
      stress: "«Lei ha la faccia di uno che ha il padre in casa. Le serve un'aspirina. O un altro padre.»",
      vita: "«È pallido, ha i lividi e puzza di nutria. Sciroppo ricostituente, due cucchiai. E stia lontano dal canale.»",
      stanco: "«Ha le occhiaie fino ai gomiti. L'integratore aiuta, ma la cosa migliore è il letto. Il suo, possibilmente.»",
      bene: "«Lei sta benissimo. È la cosa più preoccupante che ho visto oggi.»",
    },
  },
  // ---------- studio medico ----------
  dottore: {
    accettazione: "«Il dottore riceve senza appuntamento. Cioè, l'appuntamento c'è, ma è sempre adesso. Vada pure di là, sul lettino.»",
    accettazioneVuota: "Accettazione vuota. Un campanello e un biglietto: «Suonare. Non insistere».",
    attesa: "Ti siedi ad aspettare. Venti minuti. Una signora ti racconta tutte le sue operazioni. Tutte. Stress +2",
    riviste: [
      "«Gente», marzo 2003: il matrimonio del secolo. Si sono già separati due volte.",
      "«Il Trattorista Moderno», numero 4. Qualcuno ha fatto le orecchie alla pagina dei trattori rossi.",
      "Una Settimana Enigmistica con tutte le parole crociate fatte a penna. Sbagliate.",
    ],
    avvisi: "Avvisi dell'ASL: «Vaccino antinfluenzale», «Non date da mangiare alle nutrie» e, scritto a mano: «Il dottore non fa certificati per il Gigante».",
    scrivania: "La scrivania del Dottor Mutua: ricette, una foto con un pesce enorme e un fermacarte a forma di fegato.",
    visita: "Ti stendi sul lettino. Il Dottor Mutua ti ausculta, ti fa dire trentatré e ti picchietta il ginocchio. «Sano come un pesce. Un pesce stanco.» Vita al massimo, stress -5",
    visitaGia: "«Ti ho già visitato oggi. Se stai ancora male, è il carattere.»",
    visitaVuota: "Ti stendi sul lettino. È comodo. Il dottore non c'è. Ti visiti da solo: sì, hai il fegato. Bene.",
    visitaPovero: "La visita costa {prezzo}€. «La sanità è pubblica, ma io no», dice il Dottor Mutua.",
    ottotipo: "Leggi la tabella: «E... F P... T O Z...» Alla quarta riga inventi. Il dottore annuisce senza guardare.",
    armadietto: "L'armadietto dei medicinali è chiuso a chiave. Dentro vedi garze, siringhe e una bottiglia di nocino «per i casi gravi».",
  },
  dottorMutua: {
    visita: "Fatti visitare ({prezzo}€)",
    certificato: "Chiedi un certificato per non lavorare",
    certificatoDice: [
      "«Un certificato? Per non lavorare? A te? Tuo padre mi aspetta sotto casa col forcone. No.»",
      "«Ti posso scrivere: affetto da pigrizia cronica. Ma la mutua non la passa.»",
    ],
  },
  // ---------- palestra ----------
  palestra: {
    ingresso: "«RECLUTA! L'ingresso costa {prezzo}€. Si paga una volta al giorno, poi si suda gratis.»",
    paga: "Paga {prezzo}€ ed entra",
    povero: "«Niente soldi, niente bicipiti. Torna quando sei ricco, o almeno muscoloso.»",
    stanco: "Sei troppo stanco. Il Sergente ti guarda: «Così svieni sul tapis roulant e poi tocca a me chiamare tua madre».",
    panca: ["Sollevi il bilanciere. Una, due, sette volte. All'ottava il Sergente ti salva la vita.", "Spingi con tutte le forze. Il bilanciere sale. Le vene del collo pure."],
    tapis: ["Corri sul tapis roulant per mezz'ora. Arrivi esattamente dove sei partito. Come nella vita.", "Il tapis roulant va più veloce di te. Ti tieni con le mani e fai finta di niente."],
    sacco: ["Prendi a pugni il sacco immaginando la faccia di Mister Mountain. Funziona benissimo.", "Destro, sinistro, destro. Il sacco dondola. Tutto lo stress se ne va, insieme a un po' di pelle delle nocche."],
    effetto: "Stress -{stress}, stanchezza +{fatica}, +{xp} XP",
    vitaSu: "Ti guardi le braccia: sono un po' meno di gelatina. Vita massima +{n}! (allenamenti: {tot})",
    specchio: ["Ti guardi allo specchio. Lo specchio guarda te. Nessuno dei due è convinto.", "Allo specchio fai la posa del culturista. Qualcuno dietro di te ride. È il Sergente."],
    specchioForte: "Ti guardi allo specchio. Ehi: quello è un muscolo! Piccolo, timido, ma c'è.",
    doccia: "Una doccia calda. Poi fredda. Poi di nuovo calda: lo scaldabagno decide lui. Stanchezza -10, stress -3",
    armadietto: "Il tuo armadietto: una tuta che non lavi da settimane e un deodorante vuoto. Profumo di impegno.",
    abbonamenti: "Bacheca: «Abbonamento annuale: chiedere al Sergente». «Corso di zumba: chiedere alla Blu Belga». «Chi ha preso i manubri da 10 li riporti. Firmato: tutti».",
    sergente: "Allenamento col Sergente ({prezzo}€)",
    sergenteDice: "«ATTENTI! Cinquanta flessioni, cento addominali, giro di corsa dell'isolato!» Un'ora di inferno militare.",
  },
  // ---------- pizzeria ----------
  pizzeria: {
    ordina: "Margherita al tavolo ({prezzo}€)",
    scappa: "🏃 Mangia la margherita e scappa senza pagare (Gennaro è livello 30!)",
    mangiata: [
      "Una margherita fumante. Mozzarella che fila, basilico, Gennaro che canta. Per mezz'ora il mondo è perfetto. Vita +30, stress -10",
      "La pizza è buonissima. Gennaro ti guarda mangiare come un padre orgoglioso. Un padre diverso dal tuo. Vita +30, stress -10",
    ],
    asporto: "Pizza da asporto ({prezzo}€)",
    asportoDice: "Gennaro te la incarta col cartone che scotta. «Mangiala calda, o non tornare.»",
    povero: "Non hai abbastanza soldi. Gennaro ti offre un pezzo di crosta bruciata. Gratis. Con dignità.",
    forno: "Il forno a legna: brace rossa, mattoni neri di fuliggine. Gennaro dice che ha ottant'anni. Il forno, non Gennaro. Forse anche Gennaro.",
    vesuvio: "Un Vesuvio dipinto da Gennaro. Il cono è storto, il fumo pure. «È così che lo vedo quando ho nostalgia.»",
    tavolo: "Un tavolo con la tovaglia a quadretti. Le briciole raccontano la storia della serata di qualcun altro.",
    pettegolezzi: "Pettegolezzi",
    voci: [
      "«La Sabrina stasera era qui con un tipo di Lodi. Lei ha pagato. Pensa te.»",
      "«La Federica ordina sempre la diavola. Dice che le piacciono le cose piccanti. E i ragazzi sinceri, ha detto pure.»",
      "«La Blu Belga mangia solo la pizza senza mozzarella. Tutto il resto lo brucia in palestra.»",
      "«L'Ilenia prende la quattro formaggi e ne lascia tre. Gioca a biliardo meglio di come mangia.»",
    ],
  },
  // ---------- kebab ----------
  kebab: {
    ordina: "Kebab completo ({prezzo}€)",
    ordinaNotte: "Kebab della notte ({prezzo}€)",
    mangiato: "Kebab completo: carne, cipolla, salsa bianca e salsa piccante. Ti cola fino al gomito. È stupendo. Vita +25, stanchezza -5",
    malDiPancia: "...e dopo un minuto la cipolla ti presenta il conto. Stress +5",
    asporto: "Kebab da portare via ({prezzo}€)",
    asportoDice: "Kemal te lo incarta nella stagnola. «Per dopo. O per adesso, tanto lo so che lo mangi in macchina.»",
    bibita: "Bibita fresca ({prezzo}€)",
    bibitaDice: "Una lattina gelata. Il frigo di Kemal fa il freddo del Polo Nord. Stanchezza -8",
    povero: "Non hai abbastanza soldi. Kemal ti dà due patatine: «Offre la casa. La casa è povera, ma generosa.»",
    spiedo: "Lo spiedo gira, lento e ipnotico. Lo guardi per un minuto intero. Lui guarda te.",
    menu: "Il menu illuminato: kebab, piadina kebab, kebab piadina, patatine. Una foto del 2004 sbiadita dal sole.",
    tavolino: "Il tavolino. Ci hanno inciso sopra «T + S 4EVER». Tarcisio e la Sciura? No. Non ci pensare.",
    frigo: "Frigo delle bibite: aranciata, chinotto e una birra «analcolica» che Kemal vende solo ai vigili.",
  },
  // ---------- Zeno ----------
  meccanico: {
    calendario: "Il calendario delle gomme del 1998: ogni mese una gomma diversa, fotografata con amore. Zeno è fermo a novembre.",
    caffe: "Un caffè della macchinetta di Zeno. Sa di olio motore. Ti sveglia come una martellata. Stanchezza -10",
    cafPovero: "Non hai neanche un euro. La macchinetta ti fa «bip» con disprezzo.",
  },
  ivan: {
    umore: "Com'è Zeno oggi?",
    umori: {
      buono: "«Zeno oggi fischietta. Approfittane: se gli chiedi un lavoro adesso, magari non ti frega. Magari.»",
      normale: "«Normale. Cioè brontola. Cioè fattura.»",
      cattivo: "«Stai lontano. Stamattina ha tirato una chiave inglese al calendario. Se ripari oggi, chiedi la fattura.»",
    },
  },
};
