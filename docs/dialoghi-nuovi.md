# Dialoghi nuovi di Grand Theft Tractor Goodville City

Approvata da Alessandro e **collegata al gioco**: ogni blocco sta nel file di dati indicato tra parentesi. Questo file resta come riferimento; per cambiare una battuta si modifica il file di dati.

Come leggere le risposte del corteggiamento:

- ✔ = il tono le piace (gusto +1, sale l'affinità e i punti red pill)
- ～ = così così (gusto 0)
- ✘ = la fa scappare (gusto −1)

Il tono è scritto in corsivo prima della battuta di Garonio, poi `→` e la reazione di lei. Tutte le ragazze sono adulte, e ogni serata che va «bene» sfuma al nero come già succede nel gioco.

## Indice

1. Le 4 nuove ragazze corteggiabili (da 4 a 8)
2. Battute in più per Blu Belga, Federica, Sabrina e Ilenia
3. Tutte le altre donne del paese
4. Tutti gli altri personaggi

---

# 1. Le 4 nuove ragazze corteggiabili

*(src/data/ragazze.js → `RAGAZZE`; i tre luoghi nuovi vanno in `LUOGHI`)*

Ho scelto quattro caratteri che non si sovrappongono a quelli che ci sono già. Ognuna premia una combinazione di toni diversa, così la red pill di Garonio deve davvero «leggerle» una per una:

| Ragazza | Età | Dove vive nel gioco | Le piace | La fa scappare |
|---|---|---|---|---|
| Blu Belga (c'è già) | 32 | capezzagna, mattina | sicuro, sincero | spaccone, bisognoso, cafone |
| Federica (c'è già) | 28 | capezzagna, sera | ironico, sincero | spaccone, bisognoso, cafone |
| Sabrina (c'è già) | 35 | fontana e bar | romantico, sincero | spaccone, bisognoso, cafone |
| Ilenia (c'è già) | 30 | bar e parcheggio del Night | ironico, sicuro | romantico, spaccone, bisognoso, cafone |
| **Ludovica, la Contessina** | 31 | castello e fontana | **spaccone**, romantico | ironico, bisognoso, cafone |
| **Noemi, l'infermiera** | 29 | studio medico e farmacia | **bisognoso**, sincero | sicuro, spaccone, cafone |
| **Tamara «la Tigre»** | 38 | palestra e kebab | **cafone**, sincero | romantico, spaccone, bisognoso |
| **Balerion, l'organista** | 31 | chiesa e bar | ironico, romantico | spaccone, bisognoso, cafone |

La novità: per la prima volta ci sono ragazze a cui piacciono i toni «sbagliati». La Contessina vuole un uomo ambizioso e premia lo spaccone, Noemi è una crocerossina e premia il bisognoso, Tamara odia le frasi da cioccolatino e premia il cafone. Per Tamara il «cafone» è sempre maleducazione da tavola (rutti, fame, schiettezza), mai frasi contro le donne: quelle restano sbagliate con tutte.

### Tre luoghi nuovi per gli appuntamenti

Usano gli edifici aggiunti di recente:

- **castello** → nome: «Cena al castello», breve: «il castello del Conte», costo: 60€
  intro: «Candelabri (due candele vere, le altre sono lampadine), Ambrogio in livrea, e il Conte che vi spia dalla scala fingendo di cercare gli occhiali.»
- **kebab** → nome: «Kebab di mezzanotte da Kemal», breve: «il kebab di Kemal», costo: 12€
  intro: «L'insegna al neon che ronza, due sgabelli di plastica, Kemal che taglia la carne come un samurai. Profumo di cipolla nella nebbia.»
- **campanile** → nome: «Sul campanile al chiaro di luna», breve: «il campanile», costo: 5€
  intro: «Novantasei gradini, una coperta, la luna sopra la nebbia. Don Peppino ha chiesto "un'offerta per i lumini". Cinque euro, esatti.»

---

## 👑 Ludovica, la Contessina (31)

**chi:** Nipote del Conte della Bassa. Laureata in storia dell'arte, nobile fino al midollo e squattrinata fino al midollo. Cerca un marito con un trattore e una visione: il tetto del castello perde.
**dove:** La mattina nel giardino del castello, il pomeriggio alla fontana della piazza «a farsi vedere» (indicativo: 9–12 castello, 15–19 fontana).
**aspetto (idea):** cappello a tesa larga, guanti, vestito verde bottiglia. Porta a spasso un cagnolino che in realtà è un peluche su rotelle.
**gusti:** spaccone +1, romantico +1, sicuro 0, sincero 0, ironico −1, bisognoso −1, cafone −1
**posto preferito:** castello

**Saluti**
- «Oh. Il villico simpatico. Si avvicini pure, ma non troppo: è appena passato il profumiere.»
- «Garonio, giusto? Mio zio dice che suo padre ci deve tre sacchi di grano dal 1952. Interessi compresi.»
- «Buongiorno. Ha visto il mio cavallo? No? Neanche io. L'abbiamo venduto nel 2011.»
- «Non le porgo la mano: me l'hanno appena baciata Ambrogio e il geometra. Per oggi basta.»
- «Ha un trattore? Grande? Con l'aria condizionata? ...Peccato.»
- «In famiglia abbiamo un motto: "Nobiltà obbliga". Di solito obbliga a chiedere prestiti.»

**Prima volta:** Una ragazza con un cappello a tesa larga ti sbarra la strada. Al guinzaglio ha un barboncino che, a guardarlo bene, è un peluche su rotelle. «Ludovica Ottavia Maria dei Conti della Bassa. Lei può chiamarmi Contessina. O Ludo, se un giorno mi restaura il tetto.»

**Approccio**

**D:** «Lei cosa possiede, esattamente?»
- ✔ *spaccone* — «Un trattore, quattro maiali, una Vespa e grandi progetti. Fra dieci anni compro mezzo paese.» → «Grandi progetti! Finalmente un uomo con le ambizioni di un Visconti. Anche se coi maiali.»
- ～ *sincero* — «Quasi niente. È tutto di mio padre.» → «Ah. Come me. Lo zio possiede tutto, io possiedo il cognome. Almeno siamo onesti.»
- ✘ *ironico* — «Possiedo un gran senso dell'umorismo. Quanto vale?» → «All'asta? Meno dei candelabri. E i candelabri sono finti.»

**D:** «Mi dica: lei sa fare il baciamano?»
- ✔ *romantico* — (si inchina e le bacia il guanto, lasciandoci un po' di fango) «Per lei imparo tutto, Contessina.» → «Il fango sul guanto è... rustico. Ma il gesto c'era. Mi sono emozionata. Pochissimo.»
- ✘ *ironico* — «No, però so fare il batti cinque. Va bene lo stesso?» → «Il batti... No. Niente che finisca con "cinque" va bene. Tranne i secoli di nobiltà.»
- ✘ *bisognoso* — «Io bacio solo la mia mamma...» → «Ammirevole. Torni quando la mamma le avrà dato il permesso di baciare altro.»

**D:** «Le piace l'arte?»
- ✔ *spaccone* — «Moltissimo. Ho in giardino un nano di bronzo alto un metro e venti. Bronzo vero. Quasi.» → «Un metro e venti! Una scultura monumentale! Il bronzo è plastica, vero? Non importa: l'ambizione c'è.»
- ✔ *romantico* — «Mi piace guardare lei. È arte anche quella?» → «È la frase più popolana e più dolce che abbia sentito questa settimana. Me la segno.»
- ✘ *cafone* — «Sì, soprattutto il calendario dei pompieri.» → «Ambrogio. Accompagni il signore all'uscita. Quella di servizio.»

**D:** «Il mio trisavolo ha combattuto a Clearville. Il suo?»
- ✔ *spaccone* — «Il mio ha combattuto a Clearville contro una mucca. E ha vinto.» → «Contro una mucca, e ha vinto! Una stirpe di guerrieri. Devo informare lo zio.»
- ～ *sincero* — «Non lo so. Credo zappasse. Le vostre terre, probabilmente.» → «Probabilmente. Grazie per il lavoro, con un secolo e mezzo di ritardo, a nome della famiglia.»
- ✘ *ironico* — «Il mio era nella stanza accanto a ridere di Clearville.» → «Non si ride di Clearville. Non in mia presenza. Arrivederla.»

**D:** «Lei mi trova snob?»
- ✔ *romantico* — «Un po'. Ma le sta bene, come il cappello.» → «Il cappello era di mia nonna. Lo snobismo pure. Grazie: li porto bene tutti e due.»
- ✔ *spaccone* — «Snob lei? Io sono molto più snob: non mangio la polenta del giorno prima.» → «Neanche lei?! Siamo anime gemelle. La polenta riscaldata è una barbarie.»
- ✘ *bisognoso* — «Non mi guardi dall'alto in basso, la prego, mi fa sentire piccolo...» → «Sono sul gradino della fontana, signor Garonio. È una questione di altimetria.»

**D:** «Sa ballare il valzer?»
- ✔ *spaccone* — «Lo ballo da quando avevo sei anni. Sagra del cotechino, primo classificato.» → «Primo classificato! Sapevo che sotto quella tuta batteva il cuore di un ballerino di corte.»
- ✔ *romantico* — «No. Ma se lei mi insegna, le pesterò i piedi con grande rispetto.» → «Con grande rispetto. Lo zio la chiamerebbe dichiarazione. Io la chiamo un inizio.»
- ✘ *ironico* — «Il valzer? Quello che si balla in tre? Valzer, polka e mazurka?» → «Si balla in due. E stasera, chiaramente, senza di lei.»

**Appuntamento** (al castello)

**D:** «Ambrogio ha servito il consommé. È acqua calda col dado. Non lo dica a nessuno. Com'è?»
- ✔ *spaccone* — «Il miglior consommé della mia vita. Dica ad Ambrogio che lo assumo io.» → «Ha sentito, Ambrogio? Un ingaggio!» Ambrogio vacilla per la gioia. Tre stipendi arretrati gli passano davanti agli occhi.
- ✔ *romantico* — «Con lei di fronte, anche il dado sembra tartufo.» → «Lo racconterò a mia nonna, giù nella cripta. Sarà fiera di me.»
- ～ *sincero* — «Si sente che è dado. Quello col bollino d'oro.» → «Lo sapevo. Però il bollino d'oro è una specie di nobiltà. Lo prendo come un complimento al brodo.»

**D:** «Lo zio dice che dovrei sposare un uomo ricco. Lei è ricco, Garonio?»
- ✔ *spaccone* — «Lo sarò. Maiali, mais e un giorno un capannone col mio nome sopra. In oro.» → «In oro! In corsivo? Mi lasci scegliere il carattere. Lo zio sarà felicissimo.»
- ～ *sincero* — «No. E i soldi non riscaldano le altre quarantuno stanze.» → «È vero. Me lo ricorda ogni inverno la bolletta. Mi ha fatto pensare, che fastidio.»
- ✘ *cafone* — «Dipende. Lei quanto costa?» → «Ambrogio, il cappotto del signore. E poi alzi il ponte levatoio. Quello che non abbiamo.»

**D:** «Nella sala accanto c'è il ritratto della mia bisnonna. Dicono che le somiglio. Che dice?»
- ✘ *ironico* — «Le somiglia. Ma lei sorride, la bisnonna sembra aver appena visto la bolletta.» → «La bisnonna aveva visto la bolletta della luce del 1911. Non si ride di queste tragedie.»
- ✔ *romantico* — «Più bella lei. Il pittore avrebbe dovuto inventare colori nuovi.» → «Ambrogio, un ventaglio. Subito. Anzi, due.»
- ～ *sincero* — «Uguale. Bella, ma con la faccia di chi sa che il tetto perde.» → «Il tetto perdeva anche allora. È una tradizione di famiglia, come il naso.»

**D:** «Mi dica una cosa che farebbe per me. Una grande.»
- ✔ *spaccone* — «Le rifarei il tetto del castello. Tutto. Col trattore e una scala molto lunga.» → «Col trattore sul tetto! Folle! Magnifico! Mi tenga la mano mentre immagino la scena.»
- ✔ *romantico* — «Le dedicherei il mio primo raccolto vero. Una cassetta di pomodori col suo nome.» → «Pomodori col mio nome. Nessuno mi aveva mai dedicato un ortaggio. Mi scusi, mi commuovo.»
- ✘ *bisognoso* — «Tutto. Ma lei mi deve dire che mi vuole bene. Ogni giorno.» → «Ogni giorno? Nemmeno lo zio, che è parente. Ambrogio, il dessert. Cambiamo argomento.»

**D:** «Lo sa che mio zio ci spia dalla scala da mezz'ora?»
- ✘ *ironico* — «Lo so. Gli ho fatto ciao. Mi ha risposto. Ormai siamo in famiglia.» → «Lo zio non risponde ai saluti. Era un tic. Adesso è offeso. Bel lavoro.»
- ✔ *spaccone* — «Che guardi pure. Fra un anno il prestito me lo chiede lui.» → (ride nobilmente, con la mano davanti) «Oh, lo farà! Lo farà di sicuro!»
- ✔ *romantico* — «Allora approfittiamo. Contessina, stasera è bellissima.» → «Davanti allo zio? Che sfrontatezza. Me lo ridica più forte.»

**Frasi singole**
- **maestro:** «...Garonio. Questa era la risposta di un cavaliere. Lo zio vorrà conoscerla. Purtroppo.»
- **numero:** «Le do il numero del castello. È fisso, c'è la segreteria con la voce di Ambrogio. Lasci un messaggio dopo il sospiro.»
- **accetta:** «Un invito? Accetto. Venga in camicia. Una camicia vera, non la tuta col colletto disegnato.»
- **rifiuta:** «Troppo presto. Una dama si fa corteggiare almeno quanto dura un restauro. Cioè anni.»
- **bacio:** Sul ponte levatoio (un ponticello di legno sopra il fosso) Ludovica ti porge la guancia, poi ci ripensa e ti bacia lei. «Non lo dica allo zio. Né alla bisnonna.»
- **sale:** «Il castello ha quarantadue stanze, Garonio. Vorrei mostrarle quella col camino. È l'unica riscaldata. Ambrogio ha la serata libera.»
- **letto (sfuma al nero):** La mattina dopo Ambrogio entra con un vassoio d'argento e due caffè. Non batte ciglio. «Il signor Conte domanda se il giovane si ferma a pranzo. E se porta il trattore, per il tetto.»
- **reputazione:** «Lei mi piace. Ma una Contessina non sale con un uomo di cui ridono al bar. Lo zio ha già letto il gruppo WhatsApp del paese. Sistemi la sua fama.»
- **blocco:** Ludovica ti passa davanti col naso all'insù. Il peluche su rotelle ti guarda con disprezzo.

**Conquistata**
- «Il mio cavaliere coi maiali! Lo zio chiede quando cominciamo il tetto.»
- «Ho parlato di noi alla bisnonna. Il ritratto si è staccato dal muro. Lo prendo come un sì.»
- «Ambrogio le ha stirato la tuta. Con l'amido. Adesso sta in piedi da sola.»
- «Cena al castello stasera? Ho trovato due candele intere. Una festa.»

---

## 🩺 Noemi, l'infermiera (29)

**chi:** Infermiera allo studio del Dottor Mutua, il pomeriggio dà una mano in farmacia. Dolcissima e apprensiva, si innamora di chi ha bisogno di cure. Diffida dei troppo sicuri: «quelli finiscono al pronto soccorso».
**dove:** Mattina allo studio medico (8–13), pomeriggio in farmacia (15–19).
**aspetto (idea):** camice azzurro, capelli raccolti con una matita, zoccoli bianchi.
**gusti:** bisognoso +1, sincero +1, romantico 0, ironico 0, sicuro −1, spaccone −1, cafone −1
**posto preferito:** laghetto

**Saluti**
- «Garonio! Hai la faccia gialla. No, è la luce. No, è proprio gialla. Siediti.»
- «Ciao! Hai preso la pastiglia che ti ho detto? Quale pastiglia? Appunto.»
- «Martedì ti ho visto cadere dal trattore. Stavo per chiamare l'ambulanza, ma ti sei rialzato. Peccato. Cioè, no!»
- «Oggi ho fatto quaranta prelievi. Quello del Tarcisio era metà sangue e metà Lambrusco.»
- «Dormi troppo poco. Te lo leggo nelle occhiaie. Sono le occhiaie più belle del paese, comunque.»
- «L'infermiera Assunta dice che sono troppo buona coi pazienti. Lei li chiama "unità".»

**Prima volta:** Una ragazza col camice azzurro e i capelli tenuti su da una matita ti prende il polso senza chiedere. «Noemi, infermiera. Hai centodieci battiti. È colpa mia o del Gigante? Siediti un attimo.»

**Approccio**

**D:** «Come stai? Ma come stai davvero?»
- ✔ *bisognoso* — «Male. Mio padre urla, ho mal di schiena e una nutria mi segue. Davvero.» → «Oddio, vieni qui. La nutria la segno in cartella. Il resto lo curiamo un pezzo per volta.»
- ✘ *spaccone* — «Benissimo. Non mi ammalo mai. Ho gli anticorpi del Gigante.» → «Lo diceva anche tuo padre. Poi gli ho fatto l'antitetanica e ha pianto.»
- ✔ *sincero* — «Stanco. Però adesso un po' meglio, sinceramente.» → «Un po' meglio è un ottimo parametro. Lo segno come progresso.»

**D:** «Ti sei mai fatto le analisi del sangue?»
- ✔ *sincero* — «Una volta. Sono svenuto prima dell'ago. Il Dottor Mutua ha detto che era un record.» → «Il record ce l'ha il Sergente: è svenuto guardando il cotone. La prossima volta ti tengo la mano io.»
- ✔ *bisognoso* — «No, ho paura degli aghi... e del buio... e delle oche...» → «Tre paure! Che tenero. Le oche fanno paura anche a me. Facciamo un piano di cura.»
- ✘ *spaccone* — «Non mi servono. Sono sano come un toro.» → «Il Bruno "il Toro" ha il colesterolo a trecento. Vuoi sapere altro sui tori?»

**D:** «Mi aiuti a portare queste scatole di garze in farmacia?»
- ✔ *bisognoso* — «Certo. Ma se mi viene il colpo della strega mi curi tu?» → «Ovviamente. Anzi, prendi pure la scatola grande. ...Scherzo! La piccola. Piano.»
- ✘ *sicuro* — «Le porto tutte io. Anche te, se vuoi.» → «Per carità! L'ultimo che ha fatto il forte adesso ha la schiena a punto interrogativo.»
- ✔ *sincero* — «Volentieri. Ne prendo metà, così non ci facciamo male in due.» → «Il buon senso! Rarissimo. Quasi lo aggiungo ai parametri vitali.»

**D:** «Cosa ti piace fare quando non lavori?»
- ✔ *bisognoso* — «Dormire. Ma dormo male. Mi spieghi perché?» → «Sì! Allora: niente caffè dopo le quattro e niente telefonate di Mister Mountain. Ecco.»
- ✔ *sincero* — «Vado al laghetto a guardare le anatre. Lo dico solo a te.» → «Anch'io! Col pane secco. Il Dottor Mutua dice che fa male alle anatre. Non ditelo alle anatre.»
- ～ *romantico* — «Niente. Aspetto che arrivi tu.» → «Ohh. Dolce. Un po' appiccicoso, ma dolce. Come un cerotto.»

**D:** «Mi hanno detto che fai a botte al bar. È vero?»
- ✔ *bisognoso* — «Ogni tanto. Poi mi fanno male le nocche e non so a chi dirlo.» → «A me! Lo dici a me. Fammi vedere. Mamma mia, sembrano due noci.»
- ✘ *spaccone* — «Sì, e vinco sempre. Chiedi al Bruno.» → «Il Bruno l'ho medicato io. Dice che hai vinto perché gli sei inciampato addosso.»
- ✔ *sincero* — «Sì. Non ne vado fiero. Sto provando a smettere.» → «Ammetterlo è il primo passo. Il secondo è non sederti vicino al Bruno.»

**D:** «La Pina ti ha già fatto la diagnosi. Dice che sei "pigro cronico".»
- ✔ *bisognoso* — «Ha ragione. Ma credo sia curabile, se qualcuno se ne occupa.» → «Terapia d'urto: una passeggiata al laghetto al giorno. Con me. Per controllo.»
- ～ *ironico* — «La Pina dovrebbe curarsi la lingua. C'è una diagnosi anche per quella?» → «Logorrea acuta da piazza. È sul manuale, alla voce "Pina".»
- ✘ *cafone* — «La Pina è una vecchia befana che dovrebbe farsi gli affari suoi!» → «La Pina è la mia paziente delle undici. È dolcissima. Coi miei pazienti no, Garonio.»

**Appuntamento** (al laghetto)

**D:** «Hai messo la giacca? La sera al laghetto c'è umido, poi ti viene la tosse.»
- ✔ *bisognoso* — «No... ho un po' freddo, in effetti. E mi gratta la gola.» → «Lo sapevo! Tieni la mia sciarpa. E questa caramella al miele. Il gelato dopo.»
- ✘ *spaccone* — «Il freddo non lo sento. Sono di ferro.» → «Di ferro? Allora arrugginisci. Ti ho visto tremare davanti a un'anatra.»
- ✔ *sincero* — «L'ho dimenticata. Però ne ho portata una per te.» → «Hai portato la giacca a me e hai dimenticato la tua. È la cosa più stupida e più dolce di stasera.»

**D:** «Il mio ex vendeva integratori. Diceva che non si ammalava mai. E tu?»
- ✔ *bisognoso* — «Io mi ammalo sempre. Ho il raffreddore da quando sono nato.» → «Davvero? Allora sei il contrario di lui. Già mi piaci di più.»
- ✔ *sincero* — «Poco. Ma quando succede chiamo la Mamma. Sinceramente.» → «La Mamma! Un uomo che conosce la gerarchia sanitaria. Brava la Mamma.»
- ✘ *cafone* — «Integratori? Io prendo solo la grappa del cugino. Fa tutto.» → «La grappa del Nando. L'ultimo che l'ha bevuta parlava col ponte. Ciao, Garonio.»

**D:** «Che gusto hai preso? Ti giudico, sappilo.»
- ✔ *sincero* — «Pistacchio. E un fior di latte di riserva, nel caso mi andasse male.» → «Un gelato di scorta! Previdente. Sei di pressione e otto di simpatia.»
- ✔ *bisognoso* — «Stracciatella. Ma mi si scioglie sempre sulle mani e mi sento in colpa...» → «Vieni, ti pulisco io. Ho sempre una salvietta. Anzi, dieci.»
- ✘ *spaccone* — «Tutti. Tre coni. Li finisco in due minuti.» → «Congestione garantita. Il Dottor Mutua riaprirà lo studio solo per te. Contento?»

**D:** «Posso dirti una cosa? A volte sono stanca di curare tutti.»
- ✔ *sincero* — «E chi cura te? Stasera ci provo io. Male, ma ci provo.» → «...Nessuno me l'aveva mai chiesto. Male va benissimo.»
- ✔ *bisognoso* — «Anch'io sono stanco. Di tutto. Mi abbracci?» → «Ah ah, va bene, va bene. Due stanchi su una panchina. Terapia di coppia.»
- ✘ *sicuro* — «Tranquilla, da adesso ci sono io. Risolvo tutto.» → «Tutto? Anche le liste d'attesa? Mi metti ansia, Garonio.»

**D:** «Domani ho il turno all'alba. Mi accompagni?»
- ✔ *sincero* — «Sì. Poi dormo in sala d'attesa. L'Assunta mi lascia, se le porto un caffè.» → «L'Assunta non lascia dormire nessuno. Però per te faccio domanda ufficiale.»
- ✔ *bisognoso* — «Se mi provi la pressione mentre aspetto.» → «Te la provo due volte. Una per lavoro e una per scusa.»
- ✘ *spaccone* — «All'alba? Ti porto io col trattore a duecento all'ora.» → «Il trattore fa venticinque all'ora, Garonio. E ho appena finito di medicare quelli che ci credevano.»

**Frasi singole**
- **maestro:** «...Dici proprio la cosa giusta. Te lo scrivo in cartella: "paziente sorprendente".»
- **numero:** «Ecco il mio numero. Usalo se ti senti male. O se ti senti bene. Insomma, usalo.»
- **accetta:** «Sì! Però vestiti a strati. E porta un fazzoletto di stoffa, quelli di carta si disintegrano.»
- **rifiuta:** «Stasera no, ho il turno. E prima voglio vedere come guarisce quel graffio. Non l'hai disinfettato, vero?»
- **bacio:** Al laghetto Noemi ti sistema il bavero, poi ti bacia piano. «Era per sentire la temperatura. Alta. Rifacciamo, per sicurezza.»
- **sale:** «Abito sopra la farmacia. Ho la cassetta del pronto soccorso più fornita della provincia. E un divano. Sali? Visita di controllo.»
- **letto (sfuma al nero):** Al buio si sente solo la voce di Noemi: «Respira. Ancora. Bravo.» Poi una pausa. «Scusa. È l'abitudine.»
- **reputazione:** «Mi piaci, Garonio. Ma in sala d'attesa non si parla d'altro che di te, e non delle tue analisi. Sistemati un po', va bene?»
- **blocco:** Noemi ti vede e si mette a riordinare i cerotti per taglia, con grande concentrazione. Sei stato archiviato: «caso chiuso».

**Conquistata**
- «Il mio paziente preferito! Hai bevuto due litri d'acqua oggi? Bugiardo.»
- «Ti ho messo nel portafoglio una bustina di Oki. Non per adesso. Per sempre.»
- «Stasera la pressione me la provi tu. Tanto lo so che ti sale quando mi vedi.»
- «L'Assunta ha capito tutto. Mi ha detto "contenta tu". Da lei è una benedizione.»

---

## 🥊 Tamara «la Tigre» (38)

**chi:** Ex campionessa regionale di kickboxing, insegna alla palestra «Bicipite d'Oro». Schietta, rutta più forte del Tarcisio, odia i leccapiedi e le frasi da Bacio Perugina. Le piace chi dice le cose come stanno, anche male.
**dove:** Pomeriggio in palestra (15–19), a notte fonda al kebab di Kemal (22–1).
**aspetto (idea):** spalle da armadio, codino, canotta leopardata, fasce ai polsi.
**gusti:** cafone +1, sincero +1, ironico 0, sicuro 0, spaccone −1, romantico −1, bisognoso −1
**posto preferito:** kebab

**Saluti**
- «Garonio! Vieni qua che ti tiro un calcio. Affettuoso. Tipo tra amici.»
- «Kebab doppio a mezzanotte e alle sei ero in palestra. Tu cos'hai fatto di eroico oggi?»
- «Tuo padre una volta ha sfidato il mio a braccio di ferro. Ha perso il tavolo.»
- «Ho rotto un sacco da boxe. Il Sergente piange in ufficio. Bella giornata.»
- «Hai una faccia da pugno. Non dico di dartelo. Dico che ce l'hai.»
- (rutto) «Scusa. Anzi no. Ciao.»

**Prima volta:** Una donna con le spalle da armadio e il codino ti ferma con un braccio sul petto, poi addenta una piadina. «Tamara. Mi chiamano la Tigre. Perché mordo. La piadina, di solito.»

**Approccio**

**D:** «Cosa ne pensi delle donne che fanno a pugni?»
- ✔ *sincero* — «Che se mi fai male, almeno ho una scusa per non lavorare domani.» → «Ah ah! Onesto. Allora ti faccio male poco: mezza giornata.»
- ✘ *romantico* — «Che siete bellissime e delicate come fiori, anche coi guantoni.» → «Delicate come fiori. L'aveva detto anche il mio ultimo fidanzato. Adesso mangia con la cannuccia.»
- ✔ *cafone* — «Che mi fai paura e mi fai venire fame insieme. Hai un'altra piadina?» → (ti lancia mezza piadina) «Uno che pensa con lo stomaco. Finalmente uno sincero.»

**D:** «Mi offri da bere o offro io? Decidi in fretta.»
- ✔ *sincero* — «Offri tu. Ho dodici euro e devo fare benzina alla Vespa.» → «Dodici euro! Mi piace un uomo che sa i suoi conti. Due medie.»
- ✔ *cafone* — «Paga tu e porta le patatine. E un'altra birra. E un'altra.» → «Questo è parlare. Kemal! Patatine per il signore, che ha fame vera.»
- ✘ *spaccone* — «Offro io. Champagne per tutti!» → «Al kebab? Kemal ha la gazzosa. Fai meno lo sbruffone, va'.»

**D:** «Hai mai fatto un incontro vero?»
- ～ *ironico* — «Una volta con un'oca. Mi ha battuto ai punti.» → «Ai punti! L'oca vince sempre ai punti. Ha più cattiveria di noi.»
- ✔ *sincero* — «No. Mi fa paura anche il Sergente quando starnutisce.» → «Il Sergente starnutisce come una mitraglia. È normale. Mi piaci perché lo ammetti.»
- ✘ *spaccone* — «Ho steso dieci uomini in una sera, al bar.» → «Al bar ci sono sette sgabelli e il Tarcisio. Rifai i conti.»

**D:** «Cosa ti piace in una donna? Sincero, eh. Niente poesie.»
- ✔ *sincero* — «Che mangi senza fare finta. E che non mi chieda perché ho il fango nelle orecchie.» → «Del fango te l'avrei chiesto. Ma il resto va bene. Molto bene.»
- ✔ *cafone* — «Il kebab che ha in mano. Me lo dai?» → (ride con la bocca piena) «Un morso. Uno. Non approfittarne.»
- ✘ *romantico* — «I suoi occhi, che brillano come le stelle nel cielo della Bassa.» → «Il cielo della Bassa è grigio. Tutto l'anno. Non mi convinci.»

**D:** «Scommetto che non fai dieci flessioni.»
- ✔ *sincero* — «Hai ragione. Ne faccio tre e poi resto giù a riposare.» → «Tre e poi riposo! È il mio programma della domenica.»
- ✔ *cafone* — (ne fa due, poi rutta) «Ecco. Due più il bonus.» → (applaude) «Questo è spirito! Il bonus vale doppio.»
- ✘ *bisognoso* — «Ti prego, niente flessioni, ho la schiena delicata...» → «Schiena delicata. Ok. Vai all'acquagym con la Sciura Ines.»

**D:** «Dicono che ho un caratteraccio. Tu che ne pensi?»
- ✔ *sincero* — «Che hai un caratteraccio. Anch'io. Potremmo fare a turno.» → «A turno! Lunedì io, martedì tu. Il mercoledì li usiamo tutti e due sul Moreno.»
- ✔ *cafone* — «Chi se ne frega della gente. Passami la salsa piccante e parliamo d'altro.» → «Giusto. La salsa prima delle chiacchiere. Sei uno con le priorità.»
- ✘ *romantico* — «Che sotto sotto sei una tenerona. Lo vedo io.» → «Sotto sotto c'è un gancio sinistro. Vuoi vedere anche quello?»

**Appuntamento** (al kebab di Kemal, a mezzanotte)

**D:** «Kemal chiede se vuoi la cipolla. Attento: se dici di no, ti giudico.»
- ✔ *cafone* — «Doppia cipolla. E piccante. Se domani nessuno mi parla, meglio.» → «Uomo vero. Kemal, anche a me. Domani nessuno parla a nessuno dei due.»
- ✔ *sincero* — «La cipolla mi rovina, ma la prendo lo stesso. Per te.» → «Sacrificio digestivo. Lo apprezzo. Kemal, dopo dagli un digestivo.»
- ✘ *romantico* — «Niente cipolla... dopo magari ci baciamo.» → «Ah, ti fai già i programmi? Kemal: tripla cipolla al signore.»

**D:** «Una volta ho fatto a botte col Moreno. Dice che gli ho rotto il naso. Tu che avresti fatto?»
- ✔ *cafone* — «Gli avrei tenuto la giacca. Per non sporcarla. Era una bella giacca.» → «Ah ah ah! Era bellissima! Sei matto quanto me.»
- ✔ *sincero* — «Avrei chiamato Noemi. Il Moreno mi fa sempre un po' pena.» → «Anche a me, dopo. Un pochino. Gli ho offerto un gelato. Ha pianto di nuovo.»
- ✘ *spaccone* — «Io l'avrei steso con un colpo, senza guardarlo.» → «Tu hai perso contro un'oca. L'hai detto tu. Mangia, va'.»

**D:** «Perché sei uscito con me? E non dirmi che sono bella.»
- ✔ *sincero* — «Perché sei l'unica che mangia più di me. Mi sento meno in colpa.» → «Il complimento più vero della mia vita. Ti do una patatina.»
- ✔ *cafone* — (rutta forte) «Ecco perché. Tu non ti scandalizzi.» → (rutta più forte) «Vinco io. Ma mi piaci.»
- ✘ *romantico* — «Perché sei bellissima, anche se mi hai detto di non dirlo.» → «Te l'avevo detto. Adesso paghi tu.»

**D:** «Domani ho un incontro amatoriale a Littlesound. Vieni a fare il tifo?»
- ✔ *cafone* — «Vengo. Col fischietto della sagra e un panino col salame.» → «Il fischietto della sagra! Faremo vergognare tutta Littlesound. Perfetto.»
- ✔ *sincero* — «Vengo. Ma se ti fanno male mi metto a piangere. Te lo dico prima.» → «Piangi pure. Poi però le guardi male. Molto male.»
- ✘ *spaccone* — «Vengo, e se l'altra ti fa male ci penso io.» → «Tu? Quella di Littlesound pesa cento chili. Semmai ti difendo io.»

**D:** «Kemal sta chiudendo. Ultima domanda: com'era il kebab?»
- ✔ *sincero* — «Buonissimo. Ma tu sei meglio. ...No, il kebab è meglio. Scusa.» → «Hai ragione. Ma arrivo seconda solo al kebab. È un onore.»
- ✔ *cafone* — «Ne voglio un altro. Kemal, non chiudere!» → «KEMAL! Un altro! Il mio uomo ha fame!» Kemal riapre la saracinesca sospirando.
- ✘ *romantico* — «Come la nostra serata: piccante e indimenticabile.» → «Sembra la pubblicità di una gomma da masticare. Non farlo più.»

**Frasi singole**
- **maestro:** «...Ok. Hai detto la cosa giusta senza fare il poeta. Ti meriti un pugno sulla spalla. Piano.»
- **numero:** «Segnati il numero. Se mi mandi i cuoricini ti blocco. Se mi mandi la foto del kebab ti rispondo.»
- **accetta:** «Ci sto. Ma si va da Kemal, si mangia con le mani e chi lascia avanzi paga.»
- **rifiuta:** «No. Prima vieni in palestra e fai un round con me. Uno. Se ti rialzi, ne parliamo.»
- **bacio:** Fuori dal kebab Tamara ti prende per il bavero e ti bacia come se fosse un round. Sa di cipolla. Anche tu. Pareggio tecnico. «Gong.»
- **sale:** «Abito sopra la palestra. Ho il sacco da boxe in camera e una doccia che fa paura. Vieni? Non mordo. Forse.»
- **letto (sfuma al nero):** Al buio, una voce: «Round due?» Un'altra voce, più debole: «Mi arrendo. Ai punti.»
- **reputazione:** «Mi stai simpatico. Ma in palestra devo farmi rispettare, e la gente parla. Fatti una fama da uomo, non da barzelletta. Poi vediamo.»
- **blocco:** Tamara ti vede, si scrocchia le nocche e cambia marciapiede. Il marciapiede trema.

**Conquistata**
- «Ohi, il mio sparring partner! Oggi gambe o kebab? Facciamo kebab.»
- «Ho detto al Sergente che sei il mio fidanzato. Ha fatto cinquanta flessioni per lo shock.»
- «Stasera da Kemal? Ti tengo da parte la cipolla.»
- «Se al bar qualcuno ti dà fastidio, dimmelo. Gli faccio un discorsino. Coi piedi.»

---

## 🎹 Balerion, l'organista (31)

**chi:** Suona l'organo nella chiesa di San Garonio. Dal 2014 al 2016 era la bassista dei «Vespri dell'Apocalisse», punk di Littlesound. Tatuaggi sotto le maniche, ironia nera, romantica in modo gotico: ama le cose tristi e belle.
**dove:** Pomeriggio in chiesa all'organo (14–18), dopo cena al bar vicino al jukebox (18–20).
**aspetto (idea):** caschetto nero, unghie nere, maglione lungo, anfibi.
**gusti:** ironico +1, romantico +1, sincero 0, sicuro 0, spaccone −1, bisognoso −1, cafone −1
**posto preferito:** campanile

**Saluti**
- «Ciao Garonio. Al matrimonio dei Ferrari ho suonato la marcia funebre. Nessuno se n'è accorto. Che tristezza. Che bellezza.»
- «Don Peppino dice di suonare più allegro. Ho fatto i Ramones a velocità da messa. Ha detto "brava".»
- «Ciao. Sei vivo? Bene. Non si sa mai, di questi tempi.»
- «In sagrestia c'è un pipistrello. L'ho chiamato Garonio. Dorme di giorno, come te.»
- «Suor Carmela mi ha visto il tatuaggio. Le ho detto che è un santo. È Sid Vicious. Si è fatta il segno della croce.»
- «La nebbia di stasera è perfetta. Sembra un video anni Ottanta girato a Saint James Borough.»

**Prima volta:** In chiesa l'organo attacca un accordo cupissimo e si ferma di colpo. Dalla cantoria si sporge una ragazza con le unghie nere. «Ciao. Sono Balerion, suono qui. Tu sei quello che dorme al terzo banco. Russi in re minore, lo sapevi?»

**Approccio**

**D:** «Che musica ascolti?»
- ✔ *ironico* — «Liscio. Ma lo ascolto in modo molto triste e profondo.» → «Il liscio esistenziale. "Romagna mia" con la nebbia dentro. Ok, mi hai incuriosita.»
- ✔ *romantico* — «Quella che suoni tu. Anche quando sbagli. Soprattutto quando sbagli.» → «Io non sbaglio, faccio dissonanze intenzionali. ...Ok, a volte sbaglio. Grazie.»
- ✘ *spaccone* — «La migliore. Ho tremila canzoni sul telefono, tutte belle.» → «Nessuno ha tremila canzoni belle. Nemmeno Dio, e ha l'organo più grande.»

**D:** «Credi nel destino, Garonio?»
- ✔ *ironico* — «Credo che il destino mi abbia fatto nascere figlio del Gigante per punirmi. Non so ancora di cosa.» → «Un karma agricolo. Ci scrivo un pezzo: "Il figlio del Gigante (lato B)".»
- ✔ *romantico* — «Adesso un po' di più. Prima di entrare qui, no.» → «Eri entrato a cercare il bagno, vero? Lo so. Ha funzionato lo stesso.»
- ✘ *spaccone* — «Il destino me lo costruisco io. Coi bicipiti.» → «I bicipiti non costruiscono niente. Chiedi al Sergente: hanno lasciato pure lui.»

**D:** «Dicono che sono strana. Tu che dici?»
- ✔ *ironico* — «Strana è la Vigilessa che multa sua madre. Tu sei solo interessante.» → «"Solo" interessante. Ti accetto il "solo". Per ora.»
- ✔ *romantico* — «Sei strana come una notte di nebbia: non vedi niente, ma non vuoi tornare a casa.» → «...Ma da dove l'hai tirata fuori? Ok. Ok. Dammi un minuto.»
- ✘ *cafone* — «Un po'. Sembri una che abita al cimitero. Non offenderti.» → «Ci abito vicino. Ed è meglio del bar. Ciao, Garonio.»

**D:** «Cosa faresti se domani finisse il mondo?»
- ✔ *ironico* — «Andrei al bar a dirlo al Tarcisio. Per vedere se se ne accorge.» → «Non se ne accorgerebbe. Ordinerebbe un bianchino. Il Tarcisio sopravvive all'apocalisse.»
- ✔ *romantico* — «Verrei qui ad ascoltarti. L'ultima canzone la sceglieresti tu.» → «Sceglierei una cosa lentissima. Così il mondo dovrebbe aspettare che finisca.»
- ✘ *bisognoso* — «Non dire queste cose, mi metti ansia... ho già tanta ansia...» → «Ok. Respira. ...Anzi, vai da Noemi. Io suono l'organo, non faccio la psicologa.»

**D:** «Ti piacciono i film dell'orrore?»
- ～ *sincero* — «Li guardo con la Mamma. Lei urla, io mi nascondo dietro di lei. Siamo una squadra.» → «Madre e figlio contro gli zombie. Sei più tenero di quanto pensassi.»
- ✔ *ironico* — «Ne vivo uno tutti i giorni. Si chiama Mister Mountain.» → «Un horror senza budget. Il peggiore: quello in cui non muore mai nessuno.»
- ✘ *cafone* — «No, sono stupidi. Roba da ragazzine.» → «Ti lascio con la tua roba da uomini: il silenzio. Ciao.»

**D:** «Ti piace il suono delle campane?»
- ✔ *ironico* — «Sempre, tranne la domenica alle sette. Lì le odio con tutto il mio cuore cristiano.» → «Le campane delle sette le suono io. Per vendetta. Contro tutti. Anche contro di te.»
- ✔ *romantico* — «Adesso che so che le suoni tu, mi sveglio contento.» → «Allora domenica faccio un rintocco in più. Quello è tuo. Non dirlo a Don Peppino.»
- ✘ *spaccone* — «Le ho suonate io una volta. Meglio di chiunque.» → «Quella volta che si è staccato il batacchio? Sì. Lo sanno tutti.»

**Appuntamento** (sul campanile)

**D:** «Da qui si vede tutto il paese. Tu cosa vedi?»
- ✔ *ironico* — «Il bar, il kebab e la nebbia. In pratica, tutto il mio futuro.» → «Un futuro avvolto nella nebbia. Il più romantico che esista. Dico sul serio.»
- ✔ *romantico* — «Un paese piccolo. E te, che lo fai sembrare più grande.» → «Non dirlo così vicino alla campana. Rimbomba. Mi si sente il cuore fin giù in piazza.»
- ✘ *spaccone* — «Il castello del Conte. Un giorno me lo compro.» → «Il castello cade a pezzi. E tu cadi dal campanile se ti sporgi così. Siediti.»

**D:** «Suonavo il basso nei Vespri dell'Apocalisse. Ti sembro cambiata?»
- ✔ *ironico* — «No. Solo che adesso il tuo pubblico sono vecchiette che cantano più forte di un concerto punk.» → «È vero! La Sciura Ines al Gloria fa più casino di un pogo.»
- ✔ *romantico* — «Un po'. Ma il punk ti è rimasto negli occhi. E nelle calze.» → «Le calze sono del 2015. Te ne sei accorto. Non se n'era mai accorto nessuno.»
- ✘ *cafone* — «Allora suonami qualcosa. Adesso. Voglio sentire quanto sei brava.» → «Qui? Senza basso? Sei un fan esigente o un cretino? Non rispondere.»

**D:** «Hai paura dell'altezza?»
- ✔ *romantico* — «Sì, tanto. Ma resto. Stai vicina, così sembra meno alto.» → «È alto uguale. Però va bene. Resto anch'io.»
- ✔ *ironico* — «Ho paura delle cose basse. Tipo il mio conto in banca.» → «Ah ah! L'abisso più profondo della Bassa.»
- ✘ *spaccone* — «Paura? Potrei saltare giù e atterrare in piedi.» → «Prego. Ma sotto c'è la Vigilessa. Ti fa la multa anche in volo.»

**D:** «Se scrivessi una canzone su di te, che titolo avrebbe?»
- ✔ *ironico* — «"Ballata per un trattore e un cuore che non parte".» → «Questa te la rubo. Nei crediti ti metto come "il Vespa".»
- ✔ *romantico* — «"Balerion". Non serve altro.» → «...La canzone doveva essere su di te, Garonio. Ma va bene. Va bene così.»
- ✘ *spaccone* — «"Il più grande di tutti". Rap, ovviamente.» → «Un rap su un campanile del Seicento. Le campane si vergognano per te.»

**D:** «Mi passi la coperta? Quassù fa freddo.»
- ✔ *ironico* — «Te la passo e mi siedo vicino. È fisica: il calore si trasmette.» → «Termodinamica sul campanile. Va bene, professore. Più vicino.»
- ✔ *romantico* — «Prendila tutta. Io mi scaldo guardandoti.» → «Smettila. No, non smettere. Sì, smettila. Ok, siediti qui.»
- ✘ *bisognoso* — «Dividiamola, ti prego, sto congelando, non sento più le dita...» → «Ma non eri tu quello col "sangue caldo della Bassa"? Tieni, piagnone.»

**Frasi singole**
- **maestro:** «...Era una battuta e una dichiarazione insieme. La cosa più punk mai sentita in chiesa.»
- **numero:** «Il mio numero. Non chiamare durante la messa delle undici: ho la suoneria dei Nirvana.»
- **accetta:** «Va bene. Stasera c'è la luna giusta. Non chiedermi come lo so.»
- **rifiuta:** «No. Mi servono più indizi. Per ora sei un mistero mediocre.»
- **bacio:** In cima al campanile Balerion ti bacia proprio mentre la campana batte le undici. Per poco non restate sordi tutti e due. «Bacio con accompagnamento musicale. Non capita a tutti.»
- **sale:** «Abito sopra il negozio di dischi chiuso dal 2003. Ho un giradischi e una candela a forma di teschio. Sali?»
- **letto (sfuma al nero):** Al buio parte un vinile dei Cure. Finisce e gira a vuoto per mezz'ora. Nessuno si alza a cambiarlo.
- **reputazione:** «Mi piaci, sai? Ma Suor Carmela mi ha fatto la predica su di te. Tre ore, senza pause. Sistema la tua fama, io qui ci devo ancora suonare.»
- **blocco:** Balerion ti vede entrare in chiesa e attacca all'organo la Toccata e Fuga. Il messaggio è chiaro: fuga.

**Conquistata**
- «Ciao, Vespa. Stasera campanile o jukebox?»
- «Ho scritto un pezzo su di te. Dura quattro minuti. Tre sono di nebbia.»
- «Don Peppino dice che da quando ci sei tu suono più allegro. Gli ho detto che è un effetto collaterale.»
- «Domenica le campane delle sette le suono più piano. Così dormi. Visto? È amore.»

---

# 2. Battute in più per le 4 ragazze che ci sono già

*(src/data/ragazze.js: si aggiungono in coda alle liste esistenti, non si tocca niente di quello che c'è)*

## 🏋️‍♀️ Blu Belga (sicuro ✔, sincero ✔)

**Saluti in più**
- «Garonio! Fatte le scale stamattina? No? Neanche quelle di casa? Ok.»
- (ti sorpassa senza fermarsi) «Ti saluto da qui, se mi fermo mi si raffreddano i polpacci.»
- «Ho visto il Gigante sollevare un vitello. Tu hai preso tutto da tua madre, eh?»
- «Ciao. Hai l'aria di uno che ha mangiato cotechino a colazione. Lo sento da qui.»
- «Oggi è il giorno delle gambe. Per me. Per te è il giorno del divano, come sempre.»
- «Il Sergente dice che sei una recluta persa. Io dico che sei una recluta in ritardo. Di dieci anni.»

**Approccio in più**

**D:** «Cosa mangi a colazione? Non mentire, ti vedo la pancia.»
- ✔ *sincero* — «Pane e salame. A volte solo salame, per risparmiare il pane.» → «Almeno è proteina. Ti salvi per un pelo. Di maiale.»
- ✘ *spaccone* — «Sei uova crude, come Rocky.» → «Sei uova? Ho visto le tue galline. Non ne fanno sei in una settimana.»
- ✔ *sicuro* — «Quello che decidi tu. Domani colazione insieme e mi fai vedere.» → «Mi stai chiedendo un appuntamento travestito da piano alimentare. Furbo. Avena alle sette.»

**D:** «Il Sergente dice che sono troppo severa coi clienti. Tu che dici?»
- ～ *ironico* — «Che se non fossi severa saresti il Sergente. E nessuno vuole essere il Sergente.» → «Neanche lui vuole esserlo. L'ho sentito piangere negli spogliatoi.»
- ✔ *sincero* — «Che fai bene. Se nessuno mi urla dietro, io non faccio niente.» → «Tuo padre è un personal trainer e non lo sa. E tu lo ammetti. Mi piace.»
- ✘ *spaccone* — «Severa con me? Non ci riusciresti. Sono indistruttibile.» → «Dieci burpees. Adesso. ...Ecco, sei già distrutto. Erano tre.»

**D:** «Perché mi guardi le scarpe?»
- ✔ *sicuro* — «Perché sono l'unica cosa ferma di te. Il resto va troppo veloce.» → «Ok, questa me la scrivo sullo specchio della palestra.»
- ✔ *sincero* — «Sono belle. Quanto costano? Mi servono per scappare da Mister Mountain.» → «Centottanta euro. Ma da Mountain non si scappa con le scarpe, serve allenamento. Ti faccio un prezzo.»
- ✘ *bisognoso* — «Ti prego non correre via di nuovo, non ti raggiungo mai...» → «Appunto. Ciao!» E riparte di scatto.

**Appuntamento in più**

**D:** «Gennaro mi ha portato la pizza senza mozzarella perché sa che sono a dieta. Gli dico qualcosa?»
- ✔ *sicuro* — «Ci penso io: "Gennaro, stasera la signorina mangia come un camionista". E pago io.» → «Mi hai difesa da una pizza dietetica. Sei un eroe minore, ma un eroe.»
- ✔ *sincero* — «Ti do metà della mia. È salsiccia e cipolla, ti faccio un favore.» → «Domani un'ora di tapis roulant. Ma stasera grazie.»
- ✘ *cafone* — «GENNAROOO! PORTA ROBA!» → Gennaro smette di cantare. Tutta la pizzeria si gira. Blu Belga si nasconde dietro al menu.

**D:** «Dimmi una cosa di cui hai paura. Una vera.»
- ✔ *sincero* — «Di deludere mio padre. E delle oche. Più delle oche, a dire il vero.» → «Le oche fanno paura anche a me. Sul resto ci lavoriamo. Una ripetizione alla volta.»
- ✘ *spaccone* — «Paura? Io ho preso a schiaffi un cinghiale.» → «Era un sacco della spazzatura, Garonio. La Pina ha il video.»
- ✔ *sicuro* — «Di essere qui con te e non saperlo fare bene. Ma ci sono lo stesso.» → «Questa era coraggiosa. Il coraggio è un muscolo. Il tuo stasera lavora.»

**Conquistata in più**
- «Ho messo la tua foto nella bacheca "prima" della palestra. Prima o poi ci mettiamo anche quella "dopo".»
- «Stamattina ho corso pensando a te e ho fatto il record. Adesso mi sento in colpa per il record.»
- «Se ti becco con un cornetto ti faccio fare un giro di campo. Se lo dividi con me, mezzo giro.»

## 📚 Federica (ironico ✔, sincero ✔)

**Saluti in più**
- «Ho analizzato un campione del tuo campo. Contiene argilla, limo e la tua dignità.»
- «Lo sai che le nutrie hanno una vita sociale più ricca della tua? L'ho misurato.»
- «Ho appena fatto ridere un lombrico. Scherzo, i lombrichi non ridono. Però si è mosso.»
- «Il mio relatore mi ha risposto a una mail dopo quaranta giorni. Mi sento corteggiata.»
- «Ho un panino al cavolo cappuccio e trentasette tabelle Excel. Che giornata.»
- «La nebbia della Bassa è un fenomeno affascinante. No, eh? Si vede dalla faccia.»

**Approccio in più**

**D:** «Se fossi un tipo di terreno, quale saresti?»
- ✔ *ironico* — «Torba. Morbido, umido e prendo fuoco facilmente.» → «La torba! Stai studiando di nascosto. Ammettilo.»
- ✔ *sincero* — «Il cemento del piazzale. Non ci cresce niente, ma regge tutto.» → «Più profonda di quanto volessi. Il cemento ha i suoi meriti.»
- ✘ *spaccone* — «Il terreno più fertile della Bassa. Chiedi in giro.» → «Ho chiesto. Mi hanno detto: "il Garonio è sabbia, ci scivola via tutto".»

**D:** «È vero che hai bocciato chimica tre volte?»
- ✔ *ironico* — «Due. La terza mi sono ritirato per dignità.» → «Ritirato per dignità. È una categoria che metto nella tesi.»
- ✔ *sincero* — «Vero. Ma adesso mi piacerebbe capirci qualcosa. Davvero.» → «Va bene. Lezione uno: l'acqua non si chiama "il liquido". Partiamo da lì.»
- ✘ *cafone* — «Chi te l'ha detto? Dimmi chi è quella pettegola, che le rigo la macchina.» → «Era mia zia. Minacciare le zie. Sexy come la cocciniglia. Ciao.»

**D:** «Cerco qualcuno che mi tenga il metro mentre misuro il fosso. Ti offri?»
- ✔ *ironico* — «Mi offro. Ma poi dici a tutti che il fosso l'ho misurato io.» → «Affare fatto. Nei ringraziamenti: "a Garonio, che teneva il metro e le pretese".»
- ～ *romantico* — «Certo. Mi piace stare dove sei tu, anche nel fango.» → «Nel fango. Romantico in un modo molto preciso. Tieni il metro.»
- ✘ *bisognoso* — «Sì, ma tienimi la mano, il fosso mi fa paura...» → «È profondo trenta centimetri. Ci si annega solo impegnandosi molto.»

**Appuntamento in più**

**D:** «Una volta mi hanno detto che sono "troppo" per un uomo di qui. Troppo cosa, secondo te?»
- ✔ *sincero* — «Troppo intelligente. Ci fai sembrare tutti zolle.» → «Sei la prima zolla che lo ammette. Mi piace.»
- ✔ *ironico* — «Troppo rossa. Il Bepi ti scambia per un semaforo.» → «Il Bepi si ferma quando passo! Pensavo fosse educazione!»
- ✘ *cafone* — «Troppo complicata. A me piacciono semplici.» → «Allora goditi il gelato. È alla crema. Semplice, come te.»

**D:** «Se mi offrissero un posto a Utrecht, verresti con me?»
- ✔ *ironico* — «Sì. Imparo l'olandese, compro una bici e cado nei canali come tutti.» → «Cadere nei canali è tradizione. Ti presento ai colleghi come "il mio campione locale".»
- ✔ *sincero* — «Non lo so. Qui c'è mia madre, ci sono i campi. Ma ci penserei sul serio.» → «La risposta più onesta che mi abbiano mai dato. Ci pensiamo insieme.»
- ✘ *cafone* — «Tu non vai da nessuna parte. Resti qui con me.» → «Ah, l'uomo delle caverne. Peccato, il gelato era buono.»

**Conquistata in più**
- «Ho chiamato un campione di terreno come te: G-07. È il più disordinato. Lo adoro.»
- «Il relatore mi ha chiesto chi è "Garonio" nei ringraziamenti. Gli ho detto: un dato anomalo.»
- «Ti ho portato un lombrico. È un regalo serio. È un lombrico eccellente.»

## 💅 Sabrina (romantico ✔, sincero ✔)

**Saluti in più**
- «Ciao tesoro. Ti hanno visto alla fontana col trattore. Di nuovo. Io non ho detto niente. A quasi nessuno.»
- «Ho fatto la piega alla Pina. Mi ha parlato di te per tre ore. Due e mezza inventate. Forse.»
- «Garonio, quelle sopracciglia. Vieni da me, ti faccio sembrare un uomo con un progetto.»
- «Il mio ex è tornato in paese. Ha una Porsche. A rate. Te lo dico perché lo so.»
- «Hai un'aria romantica oggi. O stanca. Negli uomini di qui è uguale.»
- «Ho visto la Giusy guardarti. Tranquillo, guarda così anche il kebab di Kemal.»

**Approccio in più**

**D:** «Cosa regaleresti a una donna al primo appuntamento?»
- ✔ *romantico* — «Fiori di campo. Raccolti da me, con le nutrie che mi guardano storto.» → «Fiori raccolti rischiando la vita. Ok, così si fa.»
- ～ *ironico* — «Un buono per l'estetista. La tua, ovviamente.» → «Mi porti i clienti e mi corteggi. Fai il rappresentante?»
- ✘ *spaccone* — «Niente. Il regalo sono io.» → «Un regalo così lo riciclo a Natale, tesoro.»

**D:** «Credi al colpo di fulmine, Garonio?»
- ✔ *romantico* — «Prima poco. Poi sei entrata tu e ho rovesciato lo spritz.» → «L'hai rovesciato davvero. Sui pantaloni del Tarcisio. Ma l'intenzione era bella.»
- ✔ *sincero* — «No. Credo all'amore alla terza volta, quando ci si conosce.» → «Alla terza volta. Questa è la seconda. Vedi di non sbagliare la prossima.»
- ✘ *cafone* — «Credo a quello che mi conviene, bambola.» → «"Bambola". Lo spritz me lo pago da sola, grazie.»

**D:** «Ti hanno mai fatto una maschera viso? Sii sincero.»
- ✔ *sincero* — «Una volta, con lo yogurt della Mamma. Mi ha inseguito con la scopa.» → «Lo yogurt! Scaduto? Non dirmelo. Domani ti faccio una cosa seria.»
- ～ *ironico* — «No, ma il fango in faccia me lo faccio già gratis, nei campi.» → «Fango della Bassa: trattamento esfoliante a chilometro zero. Ci faccio un pacchetto.»
- ✘ *cafone* — «Le maschere sono roba da femmine.» → «Lo diceva anche il Moreno. Poi è venuto di nascosto per i punti neri. Tre volte.»

**Appuntamento in più**

**D:** «Il mio ex diceva che sono troppo esigente. Lo sono?»
- ✔ *romantico* — «Esigente no. Sai quanto vali. Era lui che non lo sapeva.» → «Tesoro... non farmi colare il mascara, costa ventidue euro.»
- ✔ *sincero* — «Un po'. Ma un po' di esigenza fa bene a uno come me.» → «Vero. Infatti ti sto già migliorando: stasera hai le unghie pulite.»
- ✘ *spaccone* — «Sì. Ma io sono bravissimo, quindi nessun problema.» → «Lo diceva anche il primo. Vuoi conoscere il secondo? È al bar.»

**D:** «Che canzone metteresti per ballare con me adesso?»
- ✔ *romantico* — «"Romagna mia". Lenta. Non so ballare, mi serve tempo.» → «Gennaro sta già cantando. Vieni qui, imbranato.»
- ✔ *sincero* — «Una qualunque. Basta che il ritmo lo tieni tu.» → «Il ritmo lo tengo da quarant'anni. Ehm, trentacinque. Dai, vieni.»
- ✘ *cafone* — «Il remix del trattore! TUNZ TUNZ!» → «Hai svegliato il bambino del tavolo quattro. E anche me, da un'illusione.»

**Conquistata in più**
- «Ho messo la tua foto nel gruppo delle clienti. Hanno votato: "carino ma da sistemare". Ci penso io.»
- «Tesoro, il trattore lo lavi tu o devo prenotare anche lui?»
- «Passa stasera. Ho una crema nuova da provare. Su di te. Per lavoro, ovviamente.»

## 🚛 Ilenia (ironico ✔, sicuro ✔, romantico ✘)

**Saluti in più**
- «Ohi. Stamattina il camion faceva lo stesso rumore del tuo trattore. L'ho portato da Zeno per pietà.»
- «Da lontano ho pensato: chi è quel sacco di mangime con le gambe? Ah, eri tu.»
- «Newbarley-Oldbarley in quaranta minuti. Non dirlo alla Vigilessa. Né al latte.»
- «Hai la faccia di uno che ha dormito nel fienile. Pratico. Ci ho dormito anch'io, una volta.»
- «Dieci-quattro, Garonio. Cosa vuol dire? Boh, lo dicono in tv.»
- «Il Moreno mi ha chiesto di uscire. Gli ho detto che il camion è geloso. Ci ha creduto.»

**Approccio in più**

**D:** «Se potessi guidare qualsiasi mezzo, cosa sceglieresti?»
- ✔ *ironico* — «Un carro armato. Per non fare la coda al passaggio a livello.» → «Il carro armato al passaggio a livello. Lo sogno anch'io ogni mattina.»
- ✔ *sicuro* — «Il tuo camion. Tu al volante e io a fare il navigatore.» → «Navigatore? Ok. Ma se sbagli strada ti lascio all'autogrill.»
- ✘ *romantico* — «Una carrozza bianca coi cavalli, per portarti all'altare.» → «Ma sei una bomboniera? Mi vengono le carie.»

**D:** «Ti hanno mai detto che hai le mani da contadino?»
- ✔ *ironico* — «Sì, la Sabrina. Ha pianto un po'.» → «Ha pianto per le tue mani? Fammi vedere. ...Cavolo. Ha ragione.»
- ✔ *sicuro* — «Sì, e ne vado fiero. Le tue sono da camionista: siamo pari.» → «Pari. Stretta di mano? ...Ahi. Ok, bella presa.»
- ✘ *bisognoso* — «Ti prego, non dirlo, sono molto insicuro sulle mie mani...» → «Oddio. Ok. Belle mani. Vai pure.»

**D:** «Scommessa: se imbuco la nera di sponda mi offri un caffè. Ci stai?»
- ✔ *sicuro* — «Ci sto. E se sbagli, il caffè lo offri tu. Doppio.» → «Doppio? Ti piace rischiare.» (imbuca) «Ristretto, grazie.»
- ✔ *ironico* — «Ci sto. Ma se la imbuchi ti chiedo di sposarmi.» → (sbaglia apposta) «Ecco. Salva. Il caffè lo offro io, per pietà.»
- ✘ *cafone* — «Dai, le donne di sponda non sanno giocare.» → (imbuca la nera di sponda, poi altre due per cattiveria) «Caffè. E brioche.»

**Appuntamento in più**

**D:** «Se ti dico che domani parto per la Germania col camion, tre giorni, che fai?»
- ✔ *sicuro* — «Ti preparo un panino col salame per ogni giorno. Anzi due. I tedeschi non sanno fare il salame.» → «Due panini al giorno. Mi hai capita. È grave.»
- ✔ *ironico* — «Chiedo se posso venire. Voglio vedere l'autostrada senza limiti.» → «Senza limiti di velocità. Col trattore lì faresti la figura della lumaca. Vieni.»
- ✘ *romantico* — «Ti scrivo una poesia per ogni chilometro.» → «Sono milleduecento chilometri, Garonio. Ti prego, no.»

**D:** «Una volta un cliente mi ha chiesto se il camion lo guida mio marito. Tu cosa gli avresti detto?»
- ✔ *ironico* — «Che il marito è il camion. Siete sposati da anni, si vede.» → (ride fino alle lacrime) «Io gli ho detto "è il mio ex". Ma questa è meglio.»
- ✔ *sicuro* — «Niente. L'avrei lasciato parlare con te. È peggio di qualsiasi cosa potessi dirgli io.» → «Giusto. A lui il pieno di insulti, a me il pieno di latte. Pari.»
- ✘ *cafone* — «Che le donne al volante sono un pericolo! Scherzo... forse.» → «"Forse". Vuoi tornare a casa a piedi? Il ponte è lungo.»

**Conquistata in più**
- «Ho attaccato la tua foto sul cruscotto, vicino a San Cristoforo. Lui mi protegge, tu mi fai ridere.»
- «Stamattina ho suonato tre colpi lunghi sotto casa tua. Il Gigante ha risposto con quattro.»
- «Caffè all'autogrill di Somaglia? Pago io. Tu porti le battute.»

## Pettegolezzi in più dopo una conquista

*(src/data/ragazze.js → `TESTI_RAGAZZE.pettegolezzo`)*
- «Garonio! Ma è vero che hai cenato al castello? Il Conte ti ha già chiesto un prestito?»
- «Ehi Casanova, la Tamara ti cerca. Spero per te che sia per amore.»
- «Ho visto la Noemi comprare lo sciroppo per la tosse. Per due. Ah-ah.»
- «Dicono che domenica le campane suonavano più piano. Chissà perché, eh, Garonio?»
- «Il Bepi ha aperto un registro. Ci segna le tue fidanzate. Gli serve un quaderno nuovo.»

---

# 3. Tutte le altre donne del paese

Per ognuna: **saluti** (quando Garonio le parla), **chiacchiere** (quando chiacchiera di nuovo) e **sulle ragazze** (frasi che dicono quando Garonio frequenta una delle 8: si può usare `{nome}` per il nome della ragazza). Dove il personaggio ha già un formato suo, l'ho indicato.

## 👩‍🍳 La Mamma *(src/data/png.js → `mamma`)*

**Saluti**
- «Tesoro, ti ho messo la maglia della salute nello zaino. No, non è da bambini. Sì, la metti.»
- «Sei tornato! Siediti. No, prima lavati le mani. No, prima togli gli stivali. Ecco, adesso siediti.»
- «Hai la faccia di uno che ha litigato con una nutria. Chi ha vinto? Non dirmelo.»
- «Ti ho fatto i tortelli. Quelli di zucca. Tuo padre dice che sono troppi. Tuo padre ne ha mangiati quaranta.»
- «Amore di mamma! Sei dimagrito. Non è vero, ma lo dico lo stesso.»
- «C'è il minestrone. C'era anche ieri. Ci sarà anche domani. È un minestrone di famiglia.»

**Chiacchiere**
- «Tuo padre da giovane era magro e romantico. Poi ha scoperto i trattori.»
- «Ho acceso un cero a Sant'Isidoro per il raccolto. E uno a Sant'Antonio per te. Il tuo era più grosso.»
- «La Rina mi ha detto che ti ha visto dormire sulla Vespa. In movimento? Dimmi di no.»
- «Quando sei nato pesavi cinque chili. L'ostetrica ha detto "questo farà il contadino". Sbagliava, ma era gentile.»
- «Ho lavato la tuta. Era in piedi da sola. Ora si è seduta.»
- «Il telefono di casa ha suonato. Era Mister Mountain. Gli ho detto che eri a messa. Ha riso. Anch'io.»
- «Tuo padre urla perché ti vuole bene. Poi urla anche perché non hai fatto niente. Sono due urla diverse.»

**Sulle ragazze**
- «Tesoro, mi hanno detto della {nome}. Portala a pranzo domenica. No, non sto già comprando il vestito.»
- «Una ragazza! Finalmente! Pensavo che volessi sposare la Vespa.»
- «Mi raccomando, trattala bene. E fatti trattare bene. E porta il casco.»
- «La Pina dice che hai una fidanzata. Le ho detto che è una bugia. Poi sono andata a pregare che non lo fosse.»

## ☕ Loredana, la barista *(png.js → `loredana`)*

**Saluti**
- «Garonio. Caffè, bianchino o lamentela? La lamentela costa uguale.»
- «Siediti dove vuoi. Tranne lì. E lì. Lì c'è il Tarcisio da trent'anni.»
- «Non dirmi niente. Tuo padre. Lo so. Te lo faccio doppio.»
- «Oh, il mio cliente che ordina un caffè e occupa il tavolo tre ore. Ben arrivato.»
- «Mi hai portato il fango fino al bancone. Bravo. Adesso lo lucidi.»
- «Garonio! Ti stavo aspettando. Cioè no. Ma dillo in giro che ti aspettavo, fa atmosfera.»

**Chiacchiere**
- «In questo bar ne ho viste di tutti i colori. Il marrone è il più frequente. È il colore del Tarcisio.»
- «Il Consulente mi ha proposto un investimento. Gli ho proposto di pagare i caffè di marzo.»
- «Dietro il bancone ho un quaderno. Ci sono scritti tutti i debiti del paese. Si chiama "La Bibbia".»
- «Mi chiedono perché non mi sposo. Ho già il bar: è un marito che non russa e chiude alle due.»
- «Il Bruno "il Toro" si è commosso guardando un film di cani. Non l'hai sentito da me.»
- «Il biliardo pende a sinistra dal 1994. Chi gioca bene lo sa. Chi gioca male dà la colpa a me.»
- «Le risse fuori, le scommesse dentro, i segreti dietro al bancone. Ognuno al suo posto.»

**Sulle ragazze**
- «Ho saputo della {nome}. Brava ragazza. Troppo, per te. Ma brava.»
- «Se la porti qui ti offro il primo giro. Il secondo lo paghi doppio, è la tassa sulla felicità.»
- «L'amore va e viene. Il conto resta. Ricordatelo.»

## 👮‍♀️ La Vigilessa *(png.js → `vigilessa`)*

**Saluti**
- «Garonio. Ti tengo d'occhio. Anche quando non ti guardo. Soprattutto allora.»
- «Il casco. Sulla Vespa ci vuole il casco. Anche quando è spenta. Sì, è una regola mia.»
- «Buongiorno. Ho il blocchetto nuovo. Profuma ancora di carta. Vuoi essere il primo?»
- «Hai parcheggiato il trattore in diagonale. Il diagonale non esiste. Esiste il parallelo e la multa.»
- «Fermo dove sei. ...Niente, volevo vedere se ti fermavi.»
- «Garonio. Hai lo sguardo di chi sta per urtare un paracarro. Lo sento.»

**Chiacchiere**
- «Una volta ho multato un'ambulanza. Aveva la sirena troppo alta. Il ricorso l'ho vinto io.»
- «Il Bepi attraversa fuori dalle strisce da quarant'anni. Ogni volta gli dico qualcosa. Ogni volta mi dice "bondì".»
- «Ho un sogno: un paese dove nessuno parcheggia sul marciapiede. Si chiama Svizzera. Non ci vado, perché lì non servo.»
- «Il Conte non paga le multe da quando c'era la lira. Dice che è un "privilegio feudale". Il pignoramento sarà feudale anche lui.»
- «Mi piace la nebbia. Nessuno vede niente, ma io sento tutto. Soprattutto i clacson abusivi.»
- «Il fischietto me l'ha regalato mio padre. Era vigile. Anche mio nonno. Anche la mia bisnonna, in un certo senso.»

**Sulle ragazze**
- «Ho visto la {nome} salire sulla tua Vespa. Col casco? Senza? Rispondi con calma, ti sto scrivendo.»
- «L'amore non dà diritto a parcheggiare davanti al passo carraio. Nemmeno quello vero.»

## ✝️ Suor Carmela *(png.js → `suoraCarmela`)*

**Saluti**
- «Garonio. Il segno della croce si fa dall'alto in basso. Non a caso, come stai facendo tu.»
- «Ti ho visto. Non ho detto cosa. Ma ti ho visto.»
- «Benvenuto nella casa del Signore. Pulisciti i piedi, che il Signore il pavimento non lo lava. Io sì.»
- «Hai l'aria di uno che deve confessarsi da sei anni. Don Peppino è libero. Porta da mangiare, sarà lunga.»
- «Ciao, Garonio. Da piccolo hai rubato le ostie non consacrate. Erano per la messa. Me lo ricordo ancora.»

**Chiacchiere**
- «La bacchetta? Non la uso più. La tengo per fare scena. Funziona meglio così.»
- «Ho insegnato catechismo a mezzo paese. L'altra metà era peggio.»
- «Don Peppino dice le messe in quaranta minuti quando gioca il Milan. Il Signore capisce. Io meno.»
- «Le candele costano cinquanta centesimi. Chi le accende senza pagare, il Signore lo vede. E poi lo vedo io in sagrestia.»
- «La Pina si confessa ogni giorno. Una volta ha confessato i peccati della Sciura Ines. Per errore, dice.»
- «Balerion l'organista ha un tatuaggio. Dice che è un santo. Io non conosco santi con la cresta.»

**Sulle ragazze**
- «Ho saputo della {nome}. Prega per lei. Ne ha bisogno, se sta con te.»
- «Fidanzarsi è una cosa seria, Garonio. Si comincia con un gelato e si finisce a fare i tortelli per trenta persone.»

## 💉 L'infermiera Assunta *(png.js → `assunta`)*

**Saluti**
- «Siediti. Non lì, lì si siede la Sciura Ines. Sì, anche quando non c'è.»
- «Nome, cognome, sintomi, colpe. In quest'ordine.»
- «Hai un aspetto terribile. Benvenuto, sei nel posto giusto.»
- «Il dottore ti riceve tra dieci minuti. I dieci minuti dello studio medico, cioè un'ora.»
- «Se è per il certificato, no. Se è per la nutria, sì. Se è per il Gigante, non abbiamo la cura.»

**Chiacchiere**
- «Trent'anni di servizio. Ho visto nascere mezzo paese e ho tolto un amo dal sedere all'altra metà.»
- «La Noemi è brava, ma troppo dolce. I pazienti vanno trattati come i polli: con amore e fermezza.»
- «Il Tarcisio fa le analisi ogni anno. Ogni anno il laboratorio ci chiama per chiedere se è vivo.»
- «Il Dottor Mutua ha mani d'oro. È un peccato che le usi soprattutto per firmare.»
- «La sala d'attesa è il vero centro del paese. Qui si sa tutto prima del Postman.»
- «Il termometro è sempre giusto. Sono i pazienti che sbagliano la febbre.»

**Sulle ragazze**
- «La {nome}? Contenta lei. Fai le analisi, comunque. Così, per sicurezza.»
- «In sala d'attesa non si parla d'altro. Il Walter ha fatto una scommessa. Io ho puntato cinque euro.»

## 🍕 La Concetta, cameriera *(png.js → `concetta`)*

**Saluti**
- «Garonio! Tavolo vicino al forno? Così almeno hai caldo, se l'appuntamento va male.»
- «La margherita? Lo so già. Il menu te lo porto lo stesso, ti piace sfogliarlo.»
- «Ciao! Stasera Gennaro è di buon umore. Ha cantato tre canzoni prima delle otto. Pessimo segno per la pasta.»
- «Siediti. Ti porto l'acqua. Naturale. Quella frizzante la danno solo a chi lascia la mancia.»
- «Ancora tu? Ti devo mettere il nome sul tavolo, come al Tarcisio al bar.»

**Chiacchiere**
- «Ho visto passare più coppie io che il prete. E le ho viste lasciarsi tutte qui, al tavolo sette. Porta sfortuna.»
- «Gennaro canta "O sole mio" mentre fa la pizza. Quando canta "Malafemmena" è meglio non ordinare.»
- «Il Commendatore viene ogni giovedì e ordina sempre la stessa cosa. E ogni volta chiede se è cambiata.»
- «Se mi chiedi un tavolo per due, lo so prima di tutti. Poi lo sa la Pina. Poi il mondo.»
- «La pizza all'ananas l'ha ordinata solo un turista tedesco. Gennaro l'ha accompagnato al confine. Di Newbarley.»

**Sulle ragazze**
- «Stasera tavolo per due? Ti preparo quello buono. Quello che non traballa.»
- «La {nome} è venuta qui ieri con le amiche. Hanno parlato di te. Non tutto male. Quasi.»
- «Se le cose vanno bene, ordina il tiramisù per due. Se vanno male, ordina il conto per uno.»

## 🗣️ La Pina *(src/data/dialoghi.js → `BAR.avventori` id `pina`: battute e risposte buone)*

**Battute in più**
- «Garonio! È vero che il Gigante ti ha messo in punizione? A trent'anni? Lo scrivo nel gruppo.»
- «Ho visto la tua Vespa dal meccanico. Di nuovo. Zeno ci si è comprato le ferie, dicono.»
- «Lo sai cosa si dice di te in paese? No? Siediti, che ci vuole un'ora.»
- «Ieri hai salutato la Sciura Ines e non me. Ho preso nota. Ho un quaderno apposta.»
- «Si dice che tu sia stato visto al Night. Io non lo dico. Lo dicono. Io lo ripeto.»
- «Mio marito, buonanima, era un gran lavoratore. Non come te. Lui almeno è morto stanco.»

**Risposte buone in più**
- «Pina, se il pettegolezzo fosse uno sport saresti alle Olimpiadi. Nel decathlon.»
- «Hai un quaderno su di me? Io ne ho uno su di te. Si chiama "il gruppo WhatsApp del calcetto".»
- «Raccontalo pure, Pina. Ma raccontalo giusto, che l'ultima volta mi hai fatto più alto.»

**Sulle ragazze**
- «La {nome}? Con te? Ma lei lo sa chi sei? No, glielo dico io.»
- «Garonio fidanzato. Dovevo vivere fino a questo giorno. Ora posso morire. Ma dopo averlo detto a tutti.»

## 🍅 La Rina della verdura *(src/data/mercato.js → banco `rina`)*

**Saluti in più**
- «Garonio! Hai una faccia da zucchina lessa. Comprati un pomodoro, ti tira su il colore.»
- «Il mio Gianni, pace all'anima sua, diceva: "Rina, i pomodori si toccano, le donne no". Era un uomo di principi. Pochi.»
- «Avvicinati, bel giovane! Ah, sei tu. Avvicinati lo stesso.»
- «Patate del Potato? Le compro. Il Potato le saluta una per una prima di vendermele, ci mette tre ore.»

**Tratta bene in più**
- «Mi ricordi mio figlio il terzo. Il terzo era il più furbo. Ti do di più.»
- «Hai trattato come un uomo. Un uomo piccolo, ma un uomo.»

**Tratta male in più**
- «Tesoro, ho venduto pomodori sotto i bombardamenti. Tu sei una nuvoletta.»
- «Così tratti una vedova? Il prezzo scende. Anche la mia stima.»

**Sulle ragazze**
- «La {nome}? Brava ragazza. Mangia la verdura? Allora va bene.»

## 👵 La Sciura Ines *(src/data/vita.js → paesana `ines`: oggi ha solo i fumetti; queste sono le frasi se le si parla)*

- «Garonio! Ai miei tempi i giovani salutavano col cappello. Tu il cappello non ce l'hai. Salutami con quello che hai.»
- «Vado dal dottore. No, non sono malata. C'è il riscaldamento e la gente con cui parlare.»
- «Hai visto la Pina? Non dirle che mi hai visto. Dille che sono morta, così sta tranquilla una settimana.»
- «Mio marito era un santo. Lo dico io, ma lo dice anche la lapide.»
- «Questi giovani d'oggi, sempre col telefono. Io ho il fisso. Mi chiama solo Mister Mountain, per sbaglio.»
- «Al Gloria canto forte perché Dio è vecchio come me e ci sente poco.»
- «Hai mangiato? Sei magro. No, sei grasso. Insomma, sei qualcosa.»
- **Sulle ragazze:** «Con la {nome}? Ai miei tempi prima si chiedeva il permesso al padre di lei. Tu chiedilo al tuo, così ridiamo.»

## 💇‍♀️ La Giusy parrucchiera *(vita.js → paesana `giusy`)*

- «Garonio, quei capelli. Non dico niente, però li guardo. E li guardo male.»
- «Oggi ho fatto la permanente alla Sciura Ines. Adesso sembra una pecora felice.»
- «Vieni da me che ti faccio la sfumatura. Così almeno quando dormi nel fosso sei in ordine.»
- «Dal parrucchiere si sanno più cose che dal prete. Il prete non ha il phon: le donne parlano sotto il casco.»
- «La Sabrina ha la Panda rosa. Io ho la Twingo viola. Siamo in guerra. Una guerra pastello.»
- «Lo sai che tuo padre ha un ciuffo ribelle? È l'unica cosa che gli si ribella.»
- **Sulle ragazze:** «Esci con la {nome}? Passa prima da me. Gratis, per la causa.»

## 🐩 L'Ornella col barboncino *(vita.js → paesana `ornella`)*

- «Fifì, saluta Garonio. Fifì! ...Non ti saluta. Ha buon gusto, Fifì.»
- «Non avvicinarti col trattore, che Fifì ha i nervi fragili. Anche io.»
- «Fifì oggi ha il cappottino rosso. Abbinato alle mie scarpe. Tu sei abbinato al fango.»
- «Il Potato ha provato ad accarezzare Fifì. Fifì gli ha morso una patata. Erano nella tasca.»
- «Lo sai che Fifì ha più follower di te? Ha un profilo. Anche tu? Peccato.»
- «Il Dottor Sbrana dice che Fifì è ansioso. Mi sa che l'ha preso da me.»
- **Sulle ragazze:** «La {nome}? Fifì l'ha annusata. Ha approvato. Fifì non sbaglia mai.»

---

## Il Night Paradiso

*(src/data/vita.js → `lola` e `svetlana`: oggi non parlano. Battute da usare quando Garonio è nella sala. Solo chiacchiere da bancone, niente di esplicito.)*

## 🍸 Lola, la barista del Night

- «Benvenuto al Paradiso. Il cocktail della casa è il "Peccato padano": Lambrusco e gazzosa.»
- «Garonio! Tranquillo, qui dentro nessuno ti ha visto. Tranne tutti.»
- «Lo specchio dietro il bancone è stato rotto tre volte. Sempre dal Moreno, sempre ballando "L'amour toujours".»
- «Sandokan sembra cattivo, ma piange coi film di Natale. Il ventiquattro dicembre chiude per lutto.»
- «Il Commendatore ordina sempre un "whisky di classe". È tè freddo. Lo sa, ma gli piace dirlo.»
- «Ho studiato da sommelier. Ora servo Lambrusco a uno che ha la cravatta coi tortellini. La vita è strana.»
- «Se cerchi il Geometra Ballarin, è al tavolo in fondo. Misura il divano. Dice che non è a norma.»

## 💎 Madame Svetlana

- «Ah, il figlio del Gigante. Tuo padre veniva qui negli anni Novanta. Ballava il twist. Male.»
- «Io ho visto molto, ragazzo. Ho visto Mister Mountain pagare in contanti. Nessuno ci crede.»
- «Queste banconote non sono stirate. Qui si accetta solo denaro elegante.»
- «La Bassa è come Mosca: freddo, nebbia, e tutti che bevono per dimenticare. Solo che qui c'è il cotechino.»
- «Ho avuto tre mariti. Uno pilota, uno poeta, uno di Littlesound. Il peggiore era il poeta.»
- «Sandokan è come un figlio per me. Un figlio di centoquaranta chili che ha paura dei gatti.»

## Le ragazze del catalogo

*(solo chiacchiere al bancone, per dare un po' di carattere; niente di esplicito)*

- **Jessica:** «Mio cugino fa il DJ a Riccione. Si chiama DJ Cuggino. Sì, con due g. È un nome d'arte.»
- **Jessica:** (scoppia una bolla di gomma) «Ho visto il tuo trattore fuori. Ha il clacson che fa "La cucaracha"? No? Peccato.»
- **Samantha:** «Miss Sagra del Cotechino 2009. La fascia ce l'ho ancora. La uso come cintura.»
- **Samantha:** «Il segreto della bellezza? Dormire otto ore e non andare mai a Newbarley di sabato.»
- **Natasha:** «Sono stata a Wishville. Internazionale. Ho comprato la cioccolata e sono tornata.»
- **Natasha:** «La spaccata la faccio solo il venerdì. Gli altri giorni mi faccio spaccare la schiena dal Sergente in palestra.»

---

# 4. Tutti gli altri personaggi

Stesso schema: saluti, chiacchiere e (dove ha senso) una frase sulle ragazze. Per chi ha un formato speciale (avventori del bar, venditori, vicini) l'ho segnato.

## In famiglia e i nemici giurati

### 👹 Il Gigante *(src/data/dialoghi.js → `GIGANTE`, frasi sparse da aggiungere alle liste esistenti)*
- «Garonio! Ho visto una nutria più operosa di te. L'ho assunta. Prende più di te.»
- «Tuo nonno arava col bue. Tuo padre ara col trattore. Tu ari col telefono. Il risultato è uguale: io lavoro.»
- «Non urlo. Questa è la mia voce quando sono contento. Ora sono arrabbiato: senti la differenza?»
- «Hai fatto il lavoro? Sì? Fammi vedere. ...Hai fatto UN lavoro. Non IL lavoro.»
- «Quando avevo la tua età mi alzavo alle quattro. Adesso mi alzo alle tre, per svegliare te.»
- «Tua madre dice che sono troppo duro. Le ho detto che il ferro si batte finché è caldo. Tu sei tiepido.»
- «Se continui così ti lascio in eredità solo la Vespa. Quella che non parte. Un'eredità simbolica.»
- **Sulle ragazze:** «Una fidanzata? Tu? Si alza presto? Allora sposala. Se no, lasciala.»
- **Sulle ragazze:** «La Contessina? Suo nonno mi ha venduto un campo pieno di sassi nel '79. Digli che me lo ricordo.»

### 🏔️ Mister Mountain *(dialoghi.js → `MOUNTAIN`)*
- «Garonio. Non ti preoccupare. Sono solo passato a vedere. A vedere tutto.»
- «Ho un'agenda. Ci sono scritti tutti i tuoi errori. È al terzo volume.»
- «Ti porto i saluti della banca. La banca ti saluta. Anche il tuo fido ti saluta: se ne va.»
- «Bella giornata, eh? Per me. Per te dipende da cosa trovo.»
- «Ho chiamato a casa tua. Ha risposto tua madre. Mi ha detto che eri a messa. Io a messa ci vado sempre. Non ti ho visto.»
- «Respira, Garonio. Così. Ecco. Ora pagami.»
- **Sulle ragazze:** «Ho visto la {nome}. Brava ragazza. Ha un conto corrente? Chiedo per un amico. L'amico sono io.»

## Al bar

### 🕴️ Il Consulente *(png.js → `consulente`)*
- «Ti do un consiglio gratis. Il prossimo costa. Il terzo costa doppio. Il quarto è un abbonamento.»
- «Ho un'intuizione. Me ne vengono tre al giorno. Una volta all'anno una funziona.»
- «Lo vedi quel lampione? Lì sotto ho trovato cinquanta euro nel 2017. Da allora lo controllo ogni giorno.»
- «Garonio, diversifica. Non mettere tutte le nutrie nello stesso fosso.»
- «Io e te siamo una squadra. Io penso, tu fai. Io incasso il dieci per cento. È il mercato.»
- «Il segreto è il networking. Io parlo con tutti. Nessuno mi risponde, ma io parlo.»
- **Sulle ragazze:** «Te lo dico da professionista: la red pill non è una pillola. È un percorso. Da dieci euro a seduta.»
- **Sulle ragazze:** «La {nome}? Ottimo investimento sentimentale. Rischio alto, rendimento incerto. Come le cripto-nutrie.»

### 🍺 Il Sciur Tarcisio *(dialoghi.js → avventore `tarcisio`)*
**Battute in più**
- «Il medico mi ha detto di smettere di bere. Ho smesso di andare dal medico.»
- «Questo sgabello l'ho comprato io. Nel '91. Con i punti del bar.»
- «Hic. Tuo nonno a briscola mi ha battuto una volta sola. Ho fatto finta di essere ubriaco. Lo ero.»
- «Cosa vuoi, giovanotto? Io qui ci sono dal paleolitico. Prima del bar c'era lo sgabello.»
**Risposte buone in più**
- «Tarcisio, quando morirai ti seppelliranno con lo sgabello. Vi vogliono insieme.»
- «Hai il conto aperto dal 1987. Loredana l'ha messo nel testamento.»

### 🐂 Bruno «il Toro» *(dialoghi.js → avventore `bullo`)*
**Battute in più**
- «Garonio! Ho fatto centoventi chili di panca. E tu? Centoventi minuti di pisolino?»
- «Sai cos'hanno in comune la tua Vespa e te? Tutti e due vanno spinti.»
- «Tuo padre è un uomo vero. Tu sei il suo scontrino.»
**Risposte buone in più**
- «Bruno, il bicipite ce l'hai grosso. Peccato per il cervello, che è uno solo e piccolo.»
- «Dicono che piangi coi film di cani. Il "Toro" di cosa, di peluche?»

### 📏 Il Geometra Ballarin *(dialoghi.js → avventore `geometra`)*
**Battute in più**
- «Garonio, la tua cuccia del cane è abusiva. L'ho segnalato. Anche il cane.»
- «Ho calcolato quanto lavori al giorno. Il risultato è un numero negativo. Non sapevo fosse possibile.»
- «Il tuo campo ha più buche di una forma di Emmental. Ho la planimetria.»
**Risposte buone in più**
- «Geometra, quel righello lo usi anche per misurare quanto ti vuole bene tua moglie? Si vede che è corto.»
- «Hai misurato tutto il paese, tranne la tua simpatia. Lì non c'è niente da misurare.»
- **Sulle ragazze:** «Hai portato la Contessina al castello? Sai che il castello non è a norma? Neanche le vostre intenzioni.»

### 🧢 Il cugino Ermes *(dialoghi.js → avventore `ermes`)*
**Battute in più**
- «Cugino! Ho cambiato il telefono. È il quarto quest'anno. Il tuo è ancora quello con lo sportellino?»
- «Mio padre mi ha regalato un drone per controllare i campi. Il tuo ti controlla da Mister Mountain.»
- «Ti offro da bere. Scherzo. Ti guardo bere da lontano, che costa meno.»
**Risposte buone in più**
- «Ermes, hai tutto pagato da tuo padre. Anche questa battuta, si sente.»
- «Il drone ti serve per vedere i campi dall'alto. Così almeno una volta li vedi.»
- **Sulle ragazze:** «Esci con la {nome}? Prima è uscita con me. Cioè, mi ha detto di no. Ma ero lì.»

### 🚚 Rocco il camionista *(dialoghi.js → avventore `rocco`)*
- «Ho guidato da Palermo a Bolzano senza fermarmi. Mi sono fermato solo qui. Per il Lambrusco.»
- «Sai cosa vedo dal camion? Tutto. Anche te che dormi sul trattore alle due del pomeriggio.»
- «La Ilenia guida meglio di me. Non dirlo in giro, o ti carico nel rimorchio.»
- «Re del bancone, eh? Io sono il re della Statale 9. Si vede che i re si incontrano.»

## L'officina di Zeno

### 🔧 Zeno il meccanico *(png.js → `zeno`)*
- «La Vespa? Ha bisogno di una cosa sola: un altro proprietario.»
- «Il preventivo è questo. Sì, il numero è giusto. No, non ci sono troppi zeri. Sono gli zeri della tua tranquillità.»
- «Ti cambio l'olio, ti controllo i freni e ti do un consiglio: comprati una bicicletta.»
- «Tuo padre una volta mi ha portato il trattore con dentro una nutria. Viva. Al motore. Gliel'ho messa in conto.»
- «Ho riparato il camion della Ilenia in un'ora. Il tuo in tre giorni. Sai perché? Lei mi porta le paste.»
- «Fischiettare? Io fischio solo quando i conti tornano. ♪ fiu fiu ♪ Ecco.»
- **Sulle ragazze:** «Porti a spasso la {nome} con la Vespa? Coraggiosa. Le faccio una polizza.»

### 🎧 Ivan, il garzone *(png.js → `ivan`)*
- «Zeno mi ha detto di fare l'inventario. Ho contato le viti. Sono tante. Fine dell'inventario.»
- «Sto facendo un corso online di meccanica. Siamo alla lezione due. Da otto mesi.»
- «Ehi, la tua Vespa fa un rumore strano. Ah, no, sono le mie cuffie.»
- «Il ponte sollevatore cigola. Zeno dice che è il ponte. Io dico che è la sua schiena.»
- «Se mi chiedi un consiglio: ascolta la trap. Le macchine vanno meglio con la trap.»

## Il magazzino e i vicini

### 📦 Il Bubetto *(png.js → `bubetto`)*
- «Ho una cosa per te. Non sai cos'è, io nemmeno. Ma costa.»
- «Questo cappello era di un generale. O di un capostazione. Comunque uno che comandava.»
- «Scontrino? Per cosa? Per la fiducia non si fa lo scontrino.»
- «Hai visto la mia nuova collezione? Sono le stesse cose di ieri, spostate a destra.»
- «Il Nando delle pentole è mio fornitore. Io sono il suo. Ci compriamo e vendiamo le stesse cose da vent'anni.»
- **Sulle ragazze:** «Ti serve un regalo per la {nome}? Ho un mazzo di fiori di plastica. Durano per sempre. Come l'amore. Quasi.»

### 🥔 Il Potato *(png.js e vicini.js → `patata`)*
- «Oggi ho parlato con una patata per un'ora. Non ha detto niente, ma mi ha ascoltato. Come la mamma.»
- «Garonio, sei felice? Io sì. Ho mangiato una patata. Due, veramente.»
- «Sai cos'è un gnocco? È una patata che ce l'ha fatta.»
- «Il Bollito ha scavato una buca. Dentro c'erano patate. Era la mia dispensa. Bravo Bollito.»
- «Quando sarò vecchio voglio una casa a forma di patata. Rotonda, calda, con i bitorzoli.»
- **Sulle ragazze:** «La {nome}? Ma le piacciono le patate? Se no, non è amore. È amicizia.»

### 🧢 Ugo, il nipote del Potato *(vicini.js → `garzone` del Potato)*
- «Lo zio dice che da grande diventerò una patata anch'io. Io voglio fare lo youtuber.»
- «Se vedi lo zio digli che sto lavorando. Sto lavorando. Guarda, mi muovo.»
- «Ho chiesto allo zio il WiFi. Mi ha dato una patata. Ha detto "connettiti con la terra".»
- «Non ti ho visto. Non mi hai visto. Siamo d'accordo, vero?»

### ✉️ Il Postman *(png.js e vicini.js → `postino`)*
- «Una cartolina per te! Da Rimini. Dice "Ciao Garonio, ti penso". Non è firmata. Ho una teoria. Anzi, tre.»
- «Ho consegnato una raccomandata al Conte. Ha firmato con lo stemma di famiglia. Su una ricevuta del supermercato.»
- «La Pina ha ricevuto quattro pacchi questa settimana. Tutti da un certo "Ufficio Pettegolezzi". Scherzo. Ma chissà.»
- «Mister Mountain spedisce lettere a tuo padre ogni lunedì. Le buste sono sempre più spesse. Non le apro. Le peso.»
- «Il Francobollo, il mio cane, ha morso il Geometra. Era una lettera di reclamo. Gliel'ha resa più breve.»
- **Sulle ragazze:** «Hai ricevuto una lettera profumata. Non te la do finché non mi dici chi è. Ah, la {nome}. Lo sapevo già.»

### 🤠 Mister Frank *(png.js e vicini.js → `frank`)*
- «Howdy, partner! Oggi c'è il sole. In Texas c'è sempre il sole. Qui c'è la nebbia, ma io me lo immagino.»
- «Ho comprato un cappello nuovo. Texano. Fatto a Carpi. Il migliore.»
- «Il mio horse Thunder ha bevuto il gasolio sbagliato. Adesso è un pony.»
- «In America mi chiamerebbero "Big Frank". Qui mi chiamano "il Franco di Sorbolo". Non hanno visione.»
- «Il mio pozzo è così profondo che una volta ho sentito parlare in cinese. Era la radio del Kevin.»
- **Sulle ragazze:** «A girlfriend? Good job, boy! Portala al ranch, facciamo il barbecue. Il barbecue è una griglia del Bubetto.»

### 🎮 Kevin, il garzone di Frank *(vicini.js → `garzone` di Frank)*
- «Frank vuole che lo chiami "boss". Io lo chiamo "zio Franco". Si offende in inglese.»
- «Faccio il cowboy da tre anni. Non ho mai visto una mucca da vicino. Solo i maiali.»
- «Ho chiesto un aumento. Frank mi ha dato un cappello. Uguale al suo. Di Carpi.»
- «Shh. Sto facendo la guardia. Cioè, sto giocando al telefono. Ma con gli occhi aperti.»

## La chiesa

### ⛪ Don Peppino *(png.js → `donPeppino`)*
- «Figliolo, ti benedico. Ma non contarci troppo, la benedizione non ara il campo.»
- «La messa delle undici dura quaranta minuti. Quella delle dieci, se gioca il Milan, venticinque.»
- «Ho la chiave del campanile. Non per niente: ci vado a sentire la radiolina quando c'è la partita.»
- «Le offerte sono calate. La gente dice che non ha soldi. Poi li vedo tutti al Night. Il Signore vede. E anch'io, dalla finestra.»
- «In confessionale ho sentito cose che Mister Mountain si sogna. Una riguardava lui.»
- «La Balerion all'organo è un dono di Dio. Un po' rumoroso, ma un dono.»
- **Sulle ragazze:** «Ho saputo della {nome}. Se diventa una cosa seria, il matrimonio te lo faccio io. Sconto famiglia, ma niente Gigi D'Agostino in chiesa.»

## Il castello

### 🏰 Il Conte della Bassa *(png.js → `conte`)*
- «Lei viene dalla zappa, io dal sangue blu. Ci incontriamo a metà: il debito.»
- «Ho un albero genealogico di sei secoli. Ho anche un albero vero in giardino. È morto. Ma rimane nobile.»
- «Mi hanno offerto di trasformare il castello in un bed and breakfast. Ho rifiutato. Poi ho visto la bolletta. Sto riconsiderando.»
- «Ambrogio! Il tè! ...Ah, già. Ambrogio! L'acqua calda!»
- «Il mio antenato faceva giustizia sulle sue terre. Io faccio la raccolta differenziata. I tempi cambiano.»
- **Sulle ragazze:** «Lei corteggia mia nipote? Bene. Il tetto è da rifare, la dote è un dipinto e i debiti sono di famiglia. Benvenuto.»
- **Sulle ragazze (se è un'altra):** «Ho saputo della {nome}. Peccato. Mia nipote ha detto "chi se ne importa" con un tono molto nobile.»

### 🎩 Ambrogio, il maggiordomo *(png.js → `ambrogio`)*
- «Il signor Conte la riceverà. Dopo il riposino delle dieci, quello delle undici e quello delle dodici.»
- «Si accomodi in salotto. Non su quella poltrona: è del Seicento. Neanche su quella: è dell'Ikea, ma ci tiene.»
- «Ho lucidato l'argenteria. Tutta e due le forchette.»
- «In questa famiglia servo da tre generazioni. Mi pagano in titoli nobiliari. Sono il Barone del Ripostiglio.»
- «Il fantasma della torre? Sono io. Ci vado a fumare.»
- **Sulle ragazze:** «La signorina Ludovica le sorride. Non succedeva dal 2009. Il signor Conte ha chiesto se lei è ricco.»

## Farmacia e studio medico

### 💊 Il Dottor Pastiglia, farmacista *(png.js → `pastiglia`)*
- «Mal di testa? Ho tre scatole: quella che funziona, quella che costa e quella che funziona e costa.»
- «Il Gigante è venuto a comprare le gocce per dormire. Per te, ha detto. Le hai prese tu, quindi?»
- «Questo sciroppo è alla fragola. Non cura niente, ma la fragola è buona.»
- «Lo sai che ogni anno vendo più antiacido a Mister Mountain che caramelle ai bambini?»
- «Ho una crema per ogni cosa. Anche per i calli da trattore. Si chiama "Pedale".»
- **Sulle ragazze:** «La Noemi mi ha detto di te. Ti consiglio le vitamine. Per stare dietro a lei, servono.»

### 🩻 Il Dottor Mutua *(png.js → `dottorMutua`)*
- «Respira. Non respirare. Respira. Ecco, sei vivo. Venti euro.»
- «Hai qualcosa, ma non so cosa. Torna tra una settimana: o passa, o lo scopriamo.»
- «Il segreto della salute è camminare, dormire e non lavorare per Mister Mountain. Due su tre li hai.»
- «Ho studiato a Goodthought. Sei anni. Per sentirmi dire dal Tarcisio "secondo me è il fegato". Ha ragione, ma comunque.»
- «Il certificato? Ti do quello che posso: "il paziente è stanco". L'ultima volta tuo padre l'ha usato per accendere il camino.»
- **Sulle ragazze:** «Esci con la mia infermiera? Bene. Se la fai piangere, la visita costa il triplo.»

## Palestra, pizzeria e kebab

### 🎖️ Il Sergente *(png.js → `sergente`)*
- «Recluta! La pancia dentro! ...Quella è la pancia dentro? Mamma mia.»
- «Al militare mi chiamavano "il Mulo". Perché ero forte. E perché non capivo le domande.»
- «Il riscaldamento? Al fronte ci scaldavamo coi sassi. Ok, non c'ero al fronte. Ma ci sarei stato bene.»
- «Uno! Due! Uno! Due! ...Garonio, siamo ancora all'uno. Sei fermo all'uno da dieci minuti.»
- «La Tamara mi ha rotto il sacco da boxe nuovo. Il terzo. Le voglio bene come una figlia che ti rompe i sacchi.»
- **Sulle ragazze:** «Esci con una delle mie istruttrici? Fai cento addominali. Ti serviranno. Per non piangere quando ti lascia.»

### 🍕 Gennaro, il pizzaiolo *(png.js → `gennaro`)*
- «Uè, Garonio! Stasera pizza speciale: la "Nebbiolina". Mozzarella, panna e malinconia.»
- «A Napoli la pizza è arte. Qui è sopravvivenza. Ma sempre arte.»
- «♪ Funiculì funiculà... ♪ Qua non ci stanno le funicolari. Ci stanno i trattori. Pure loro salgono piano.»
- «Mi hanno chiesto la pizza col cotechino. Ci ho pensato. Ci ho pensato tanto. Poi ho pianto.»
- «Il forno l'ho portato da Napoli in pezzi. Sulla Panda di mio cugino. Ci abbiamo messo tre giorni e una multa della Vigilessa.»
- **Sulle ragazze:** «Stasera porti la {nome}? Ti faccio la pizza a forma di cuore. Se va male, la tagliamo a metà.»

### 🥙 Kemal, il kebabbaro *(png.js → `kemal`)*
- «Garonio! Kebab per uno o per due? Ah, per uno. Cipolla extra, allora. Tanto non baci nessuno.»
- «Il mio kebab è il migliore della Bassa. È anche l'unico. Ma il migliore.»
- «La salsa piccante è così piccante che il Bruno "il Toro" ha chiamato la mamma.»
- «Di notte vengono tutti da me. Il Moreno, il Tarcisio, il Sergente. Il Sergente piange nella piadina, ma paga.»
- «Mi hanno chiesto il kebab vegano. Gli ho dato una piadina con l'insalata e lo sguardo triste.»
- **Sulle ragazze:** «La Tamara ha mangiato tre kebab e ha detto "il mio uomo paga". Tu sei il suo uomo? Sono quarantadue euro.»

## I paesani in giro

*(src/data/vita.js → `PAESANI`: oggi hanno solo i fumetti, queste sono le frasi se Garonio si ferma a parlare)*

### 🧓 Il Bepi
- «Bondì. Sto guardando il cantiere. Il cantiere guarda me. Siamo amici.»
- «Quel tubo lo stanno mettendo storto. Io lo so. Non glielo dico. Mi diverte.»
- «Una volta questa piazza era tutta campi. Poi hanno fatto la piazza. Poi hanno detto che volevano rifare i campi. Non hanno deciso.»
- «Il Bepi sa tutto. Il Bepi non dice niente. Il Bepi dice tutto, ma con lo sguardo.»
- **Sulle ragazze:** «Te e la {nome}. Lo sapevo da tre settimane. Lo sapevo prima di te.»

### 🚬 Il Gino del tabacchi
- «Gratta e vinci? No? Fai bene. Io li vendo, mica li compro.»
- «Ho fatto le parole crociate. Sette verticale: "chi lavora poco nella Bassa". Sette lettere. Ho scritto "Garonio".»
- «Il Tarcisio mi compra le sigarette e me le fa segnare. Ho un quaderno uguale a quello di Loredana. Il quaderno della gente in debito con Gino.»
- «Il lotto è uscito il 47, il morto che parla. Era il Bepi che diceva i numeri.»
- **Sulle ragazze:** «Per la {nome} ci vogliono i cioccolatini. Li ho. Scaduti a marzo, ma il cioccolato non scade. Si stagiona.»

### 🏃 Il Moreno in tuta
- «Ehi bro. Sto facendo l'imprenditore. Vendo accendini. Con la mia faccia sopra.»
- «Ho la tuta nuova. Identica a quella vecchia. Ma nuova.»
- «Stasera al Paradiso c'è la serata latino. Io ci vado per il buffet.»
- «La Tamara mi ha rotto il naso. Ora respiro meglio da una parte sola. È una scelta di stile.»
- **Sulle ragazze:** «Ma come fai, bro? Io ci provo da dieci anni. Ho il record di due di picche in una sera: sette.»

### 🧑‍⚕️ Il Dottor Sbrana, veterinario
- «I tuoi maiali stanno bene. Uno ha chiesto di te. Scherzo, ma mi ha guardato in un certo modo.»
- «Ho fatto un parto gemellare alle tre di notte. Una vacca. Poi il Potato mi ha chiesto di visitare una patata.»
- «Il Dottor Mutua e io abbiamo lo stesso stetoscopio. I miei pazienti però non si lamentano.»
- «Il barboncino dell'Ornella ha l'ansia. Anche l'Ornella. Ho dato una pastiglia a tutti e due.»
- **Sulle ragazze:** «Se la {nome} ha un cane, fatti dare il mio biglietto da visita. Così ci guadagno anch'io.»

### 👴 Il Walter pensionato
- «Ero geometra delle ferrovie. Adesso guardo i treni passare. Ne passano meno. Era meglio prima.»
- «Ogni mattina vado al ponte a guardare l'acqua. L'acqua mi guarda. Ci capiamo.»
- «Quei ragazzi del cantiere non sanno usare la livella. Io ce l'ho in tasca. Non gliela presto.»
- «Ho scommesso col Bepi su chi finisce prima i lavori, il comune o la nutria sotto il ponte. Punto sulla nutria.»
- **Sulle ragazze:** «Mia moglie l'ho conosciuta al ballo del liscio nel '64. Le ho pestato i piedi per due ore. Siamo sposati da sessant'anni. Pesta, Garonio, pesta.»

### 🦺 Gli operai Gianni e Franco *(vita.js → cantiere)*
- **Gianni:** «Sì, lavoriamo. Stiamo facendo la pausa del lavoro, poi la pausa della pausa.»
- **Gianni:** «Il Bepi dice che il tubo è storto. Il tubo è dritto. È il paese che è storto.»
- **Franco:** «Il preventivo diceva due settimane. Siamo al quarto mese. È un preventivo ottimista.»
- **Franco:** «Il Walter mi ha corretto la livella. Aveva ragione. Non glielo dire.»

## Il mercato del giovedì

*(src/data/mercato.js → `banchi`: saluti in più; trattaBene e trattaMale se servono)*

### 🥚 Ottavio delle uova
- «Chi dorme non piglia pesci. Ma tu non devi pigliare pesci, devi portarmi le uova. Dormi pure.»
- «L'uovo di Colombo, Garonio. Colombo l'ha messo in piedi. Tu lo fai cadere.»
- «Non dire gatto se non ce l'hai nel sacco. E non dire uova se non ce le hai nel cestino.»
- **Tratta bene:** «Chi la dura la vince. E tu l'hai durata. Prendi.»
- **Tratta male:** «L'erba del vicino è sempre più verde. Le mie uova sono sempre meno pagate.»

### 🌽 Il Sor Bortolo, granaglie
- «EHI! SEI IL FIGLIO DEL GIGANTE? NO? SÌ? COMUNQUE TI ASSOMIGLI!»
- «AI MIEI TEMPI IL MAIS LO SGRANAVAMO CON I DENTI. ADESSO HO LA DENTIERA. È MEGLIO.»
- «COSA? SPOSARE LA RINA? ME L'HA CHIESTO DI NUOVO? ...AH, HAI DETTO "PRENDI LA RETINA". HO CAPITO MALE.»
- **Tratta bene:** «HAI VINTO TU! NON SO COSA, MA HAI VINTO!»
- **Tratta male:** «COSA? HAI DETTO "SCONTO"? IO HO SENTITO "SCONTO PER BORTOLO". VA BENE.»

### 🥓 Gilberto «Salamella», il norcino
- «♪ Libiam ne' lieti calici ♪ E nei lieti panini col salame, Garonio!»
- «Il mio salame stagiona come il Barolo. Il Barolo però non ha l'aglio.»
- «♪ Figaro qua, Figaro là ♪ E il salame dappertutto!»
- **Tratta bene:** «♪ Brindisi! ♪ All'affare! A te! Al maiale che ci ha lasciato!»
- **Tratta male:** «Una stecca! Hai preso una stecca, Garonio! Il prezzo scende di un'ottava.»

### 🍳 Nando delle pentole
- «Venghino, signori, venghino! La pentola antiaderente! Antiaderente anche alla Mister Mountain!»
- «Questa grappa la fa mio cugino. Mio cugino non ha la licenza. Ha il talento.»
- «Il gratta e vinci della Cascina d'Oro! Una volta ha vinto il Tarcisio. Ha vinto un altro gratta e vinci.»
- «La pomata miracolosa! Cura i maiali, i calli e le delusioni d'amore. Le delusioni no, ma provaci.»

## Il Night Paradiso

### 🦍 Sandokan, il buttafuori *(vita.js → `sandokan`)*
- «Garonio. Scarpe? Sì. Soldi? Vediamo. Dignità? Non serve, entra.»
- «Qui dentro si rispettano tre regole: non toccare, non fotografare, non mettere "Romagna mia" al jukebox. La terza è la più importante.»
- «Ho paura dei gatti. Lo sanno tutti. Tu non lo sai. Ok?»
- «Tuo padre era cliente. Negli anni Novanta. Ballava. L'ho fermato io. Per il bene di tutti.»
- **Sulle ragazze:** «Sei fidanzato? Allora cosa ci fai qui? Ah, il buffet. Ok, il buffet è gratis per i fidanzati. Scherzo, costa doppio.»

### 🎩 Il Commendatore *(vita.js → `commendatore`)*
- «Giovanotto, ai miei tempi un uomo si giudicava dalla cravatta. La tua cravatta è il collo della tuta.»
- «Ho fondato tre aziende. Ne ho chiuse quattro. Una era del vicino.»
- «Questo whisky ha diciotto anni. Il tè freddo, dice Lola. Ma diciotto anni di tè freddo, eh.»
- «Conosco il Conte. Abbiamo fatto la naja insieme. Lui aveva il maggiordomo anche lì.»
- **Sulle ragazze:** «Ah, l'amore! Io mi sono sposato tre volte. Ogni volta per sempre.»

## Le sorprese per strada

### 📸 Il turista tedesco *(src/data/sorprese.js)*
- «Guten Tag! Dov'è il lago di Garda? ...Ah. Molto lontano? Ma qui c'è la nebbia, sembra il lago!»
- «Io fotografare trattore! Molto romantico! In Germania i trattori sono puliti. Questo è autentico.»
- «Ho mangiato la pizza all'ananas da Gennaro. Gennaro mi ha guardato come un nemico della patria.»
- «Questo paese è wunderbar! Tutti urlano, ma con amore. Come mia moglie.»
