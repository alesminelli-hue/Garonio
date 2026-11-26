# Grand Theft Tractor: Goodville City

Il gioco di **Garonio**.

Survival gestionale con elementi da JRPG, in pixel art semi‑3D, che gira nel browser.
Garonio, figlio pigro del titolare di un'azienda agricola, deve sopravvivere alle missioni del padre (**il Gigante**), alle nutrie e alle sfuriate di **Mister Mountain**.

Il design completo è in [GDD.md](GDD.md).

## Come si gioca

- **Frecce / WASD**: muoversi · **Shift**: correre · **E / Spazio / Invio**: agire · **J**: menu di Garonio (abilità, equipaggiamento, zaino, diario) · **M**: musica on/off · **T**: telefonino a conchiglia (T risponde, X rifiuta)
- Su telefono: appoggia il pollice sulla metà sinistra dello schermo e compare la levetta (spinta fino in fondo = corsa); pulsante **E** a destra per agire, **Q** per saltare. Un tocco a sinistra fa anche avanzare i dialoghi. Si gioca sia in verticale sia in orizzontale.
- **Salvataggi**: 3 slot più uno automatico che si aggiorna ogni mattina al risveglio. La partita si salva da sola ogni ora nello slot in uso. Dal menu (scheda 💾 Partite) salvi in un altro slot o ne carichi uno; sul titolo «Continua» riprende l'ultimo salvato e «Carica partita» fa scegliere.
- Ogni mattina il Gigante ti dà una missione con scadenza. Se fallisci arriva Mister Mountain, e a fine giornata **la giornata si rifà da capo** dalla mattina.
- Lo **stress** alto fa guidare male (soprattutto i trattori: sbandano, si ingolfano, si rompono) e fa mancare i colpi negli scontri.
- Lavorare alza **stanchezza** e **stress**. Il **bar** abbassa lo stress, la **casa** fa dormire (dopo le 20:00) o fare un pisolino.
- Se resti fermo qualche secondo Garonio si appisola: recupera stanchezza, ma se il Gigante è vicino ti becca.
- Campo (mais) e orto (pomodori): zappa, semina, annaffia ogni giorno, raccogli. Vendi tutto alla cassa di legno vicino a casa.
- Pollaio: raccogli le uova, dai da mangiare alle galline alla mangiatoia per averne di più.
- Le nutrie escono dal canale e mangiano le piante del campo: avvicinati e affrontale in uno scontro a turni (Attacca, Abilità, Oggetti, Difendi, Fuggi). Con lo stress sopra 60 si sblocca **Rabbia Incontrollata**.
- **Magazzino del Bubetto** (parla col Bubetto in paese): armi‑attrezzo (rastrello, badile, forcone, falce, roncola, motosega: escono man mano nell'annata), vestiti, manuali (+1 punto abilità ciascuno), trappole, pomate e la rete anti‑nutria, l'angolo dell'usato che cambia ogni lunedì, e la lavagna con le sue commissioni (piccioni sul silos, ferro vecchio nei fossi, il pacco per il Postman, i soldi di Mister Frank, le code di ratto). Più commissioni fai, più sconto ti fa.
- **Armi e mosse**: ogni arma porta la sua mossa nel menu Abilità dello scontro (Lottatore grado 3 sblocca la seconda). Coi livelli arrivano Lancio di letame, Colpo di clacson (se arrivi col mezzo), Bestemmia trattenuta, Fischio al cane e Secondo fiato. Nello scontro si usano tutti gli oggetti dello zaino: trappole, panini, grappa, pomata...
- **Da Zeno** (l'officina di Zeno in paese, sulla provinciale accanto alla palestra): Zeno affila l'arma impugnata (3 gradi, +2 attacco l'uno)... se è di buon umore. Il garzone Ivan sa dirti com'è l'umore del capo, e c'è la macchinetta del caffè. L'officina di casa ora è solo il **deposito** di Garonio e del Gigante (rastrelliera degli attrezzi, armadietti degli upgrade).
- **Edifici del paese esplorabili** (porta + **E**, ognuno coi suoi orari e i suoi personaggi):
  - **Chiesa** (Via della Chiesa, col campanile): Don Peppino confessa (stress −12 una volta al giorno) e benedice, Suor Carmela ti fa lavorare in sagrestia; ceri, banchi per un pisolino, il vino della messa e la corda delle campane.
  - **Castello del Conte** (in fondo a Via Roma, nel bosco): il Conte della Bassa dà un lavoretto al giorno (dopo 3 ti dà la chiave del forziere nelle segrete), Ambrogio il maggiordomo fa la visita guidata; trono, camino, biblioteca (+XP) e armature.
  - **Farmacia** del Dottor Pastiglia: aspirina, sciroppo ricostituente, pomata e integratore; la bilancia pesapersone.
  - **Studio medico** del Dottor Mutua con l'infermiera Assunta: visita a 15€ (vita al massimo, una al giorno).
  - **Palestra «Bicipite d'Oro»** del Sergente: panca, tapis roulant e sacco tolgono stress e danno XP; ogni 5 allenamenti +2 di vita massima (fino a +20).
  - **Pizzeria «Bella Napoli»** (anche il posto degli appuntamenti) e **Kebab di Kemal** in piazza: pasti al tavolo o da asporto nello zaino.
- **Boss e missioni secondarie** (GDD capitolo 24): ogni edificio e zona della mappa ha un boss. I personaggi te lo chiedono nel dialogo (❗), la tana compare in rosso sulla minimappa e all'ora giusta premi **E** su «⚔️ Affronta». Venti boss dal livello 5 al 30 (il Tasso in cantina, il Generale Piccione in piazza, Brutus del Postman, la Dorifora del Potato, il Pipistrellone del campanile, il Toro di Frank, l'Armatura del castello... fino a **Mister Mountain**), con meccaniche diverse: rinforzi, furia, cure, scudo e colpi caricati (quando si carica, Difenditi!). Ognuno lascia un pezzo unico: armi nuove (piede di porco, forchettone d'oro, chiave inglese, arpione, spadone) e vestiti.
- **Bella Napoli, la pizza non pagata**: al tavolo puoi mangiare e scappare senza pagare... ma Gennaro ti insegue con la pala del forno, ed è livello 30.
- **Alberi col tesoro**: ogni giorno alcuni alberi nascondono attrezzi agricoli (vanga, falcetto, cesoie, tridente, scure, correggiato), vestiti da lavoro, mele, noci e soldi. Avvicinati e «Scuoti l'albero» (E).
- **Quest degli edifici**: palestra, farmacia, ambulatorio, chiesa, castello, kebab, pizzeria, officina e Bubetto hanno missioni nuove.
- **Il Mostro della Palude**: salta 100 volte sulla riva del laghetto e qualcosa si sveglia (livello 30).
- **Babbo Natale smemorato**: certe sere compare nel bosco. Portalo al Night Welcome e pagagli una ragazza: con Madame Svetlana ritrova la memoria e ti regala un'arma leggendaria.
- **Parco Oglio**: bosco e fiume in fondo alla mappa. Di notte mostri di ogni livello, la sera coppiette da spiare (a tuo rischio), guardie del parco di livello 30 e il loro capo Boss MM. Il Vecchio Camper, nella cascina accanto, paga bene chi fa danni nel parco.
- **Endgame**: battuto Mister Mountain, il Gigante dà le missioni dell'erede. All'Ufficio agricolo compri la Cascina dei Salici e la fai crescere (porcilaia, pollaio, stalla, campi, casa): produce ogni notte, vendi al consorzio, assumi il garzone. Mister Rodella, al Consorzio, regala semi per l'orto e vende mangimi e trattori. Ogni stagione il Concilio del Gambalone fa la classifica delle cascine, a fine anno elegge l'Agricoltore dell'Anno. Una notte a settimana è la Notte delle Leggende; in piazza ci sono le taglie.
- **Codici, matrimonio e notte libera** (GDD capitolo 28): codici trucco nel titolo o nel menu J (es. EREDEDELGIGANTE per partire dall'endgame). Le ragazze conquistate si sposano in chiesa con mezzo paese; il divorzio si fa all'Anagrafe, con gli alimenti. Di notte si gira fino alle 6, finché la stanchezza non è piena.
- **Tutti gli edifici esplorabili** (GDD capitolo 29): municipio con gli sportelli e la biblioteca (guide, storia e leggende segrete), tabacchi col Gratta e Vinci, alimentari, parrucchiera, fienile, le case e le cascine dei vicini, il Consorzio, il casotto e la stalla, ognuno con un personaggio nuovo e una missione. Nella casa dei Salici c'è il baule per la roba e il letto.
- **Stalla**: Carolina, Dolly, Gertrude, Furia, Ernesto e Napoleone. Mungi, tosa, striglia (e prendi qualche calcio).
- **Banco del Gigante**: nell'officina di casa costruisci cibi, vestiti e attrezzi con quello che trovi. **Completi** con bonus e **album del bottino** nel menu J.
- **Livelli fino al 30**: ogni nemico ha il suo livello (accanto al nome nello scontro) e cresce con te; alcuni nascono **feroci** (alone rosso, più forti, bottino sicuro). I nemici lasciano bottino da vendere al Bubetto (pelli, zanne, piume, gingilli, pepite). Al **livello 30** comincia il gioco libero: i boss battuti tornano ogni settimana in versione **leggendaria** (segno dorato) con bottino raro.
- **Mezzi**: avvicinati alla Vespa, alla Punto o ai trattori e premi **E** per salire o scendere. Si guida con frecce/WASD o con la levetta, **Q** (o il pulsante 📯 sul telefono) suona il clacson.
  - La Vespa blu è veloce ma ogni tanto non parte o si spegne. La Punto bianca consuma benzina e può forare.
  - I trattori arano da soli le zolle del campo dove passano e spaventano le nutrie, ma con gli urti o guidando troppo stanco si rompono: arriva Mister Mountain.
  - Mezzo **bloccato, rotto o a secco**? Premi **E**: Zeno lo riporta in azienda col rimorchio a poco prezzo, anche a debito. Se rompi un mezzo davanti alla gente, ridono e la reputazione cala.
  - Le riparazioni le fa solo **Zeno** (in officina, dalle 7 alle 19), a pagamento e a fasce di danno: graffi, ammaccato (−15% velocità), messo male (−30%), rotto (serve il traino se è lontano). Ogni giorno ha un umore diverso e può fregarti: sovrapprezzo, lavoro a metà, pezzo «usato» che cede dopo 2 giorni. Con la **fattura** (+20%) niente fregature; la Parlantina riduce il rischio.
  - **Elaborazioni** di Vespa e Punto (marmitta, motore, cilindro, gomme, serbatoio, assetto, stereo): possono riuscire o andare male, e Zeno si tiene i soldi.
  - **La Vigilessa** gira in piazza col suo cono di vista giallo a terra (diventa rosso quando ti vede). Multa gli urti, la Vespa senza casco e chi corre in paese. Le multe si pagano a lei o al **municipio** entro 3 giorni, poi raddoppiano; con 3 multe non pagate mette la ganascia alla Vespa o alla Punto per un giorno. Con Parlantina 2 si può provare «Era un piccione, l'ho schivato!».
  - C'è un segreto in fondo alla capezzagna. Non lo diciamo. (Il Consulente forse sì.)
  - Anteprima di tutti gli sprite dei mezzi: `tools/anteprima_mezzi.html`.
- **Sprite dei personaggi e degli animali**: i paesani, i personaggi del bar e del Night, le ragazze, i vicini, la Vigilessa, Zeno, Mister Mountain, il Gigante, galline, maiali, gatti e cani usano gli sprite disegnati in `assets/sprites/personaggi.png`, ritagliati da `tools/taglia_personaggi.py` dai due fogli in `assets/sprites/originali/` (in `USATI` c'è quale figura va a chi). Se l'atlante non si carica, restano i segnaposto disegnati via codice.
- **Personaggi del paese**: la Mamma, il Consulente, Zeno, il Bubetto, la Vigilessa, il Potato, il Postman e Mister Frank. Avvicinati e premi **E** per parlarci. Chi ha un fumetto «!» ha una missione secondaria da darti o da ritirare.
- **Cascine dei vicini**: la Cascina del Potato, la Cascina del Postman e il Ranch di Mister Frank stanno a sud della capezzagna, accanto ai loro campi. I vicini fanno battute quando passi, il Potato vende patate (e una bollita al giorno è gratis), il Postman vende voci di paese (alcune vere e utili per le truffe), Frank compra il mais a 14 €. Ogni cascina ha un cane (accarezzalo: per quel giorno non abbaia contro di te) e, di giorno, a volte un garzone.
- **Missioni truffaldine del Gigante**: parlando col Gigante scegli 🤫 «Hai qualche lavoretto... speciale?». Rubare l'acqua col trattore rosso e la turbina, abbattere alberi con la motosega prestata, spostare i paletti del confine, «prendere in prestito» l'erpice. Durante la truffa vedi i coni di vista (giallo → rosso) e i cerchi d'udito di vicino, cane e garzone, più le barre di sospetto e rumore. Di notte (dopo le 20) vedono meno ma sentono tutto. Se ti beccano: scuse, bugia (Parlantina), fuga o rissa. Il ramo Furbizia fa meno rumore.
- **Il paese è vivo**: i paesani (la Sciura Ines, il Bepi, il Gino del tabacchi, la Giusy, il Moreno, il veterinario, l'Ornella col barboncino, il Walter) girano per il paese di giorno e la sera tornano a casa. Sulla provinciale passano auto, Ape e il camion del latte (di più all'ora di punta, di notte coi fari): se Garonio sta in mezzo frenano e suonano (stress), se le tamponi coi mezzi è un urto vero. Gatti da accarezzare (stress −3, a volte graffiano), corvi che volano via, anatre sul laghetto, lucciole nelle notti d'estate, lampioni che si accendono al tramonto.
- **Imprevisti** che alzano lo stress: **buche** sulle strade (rovinano Vespa, Punto e trattori: poi paghi Zeno; la Punto può forare), **pozzanghere** nei giorni di pioggia (calzini bagnati, la Vespa scoda, le auto ti fanno la doccia), **cantieri** con transenne, operai e umarell, il **cane randagio** che ti insegue (scappa correndo, scaccialo, lanciagli un uovo o affrontalo), i **paesani impiccioni** che attaccano bottone e le **zanzare** la sera vicino all'acqua.
- **Night Welcome** (accanto al paese, aperto dalle 20): il catalogo, con descrizioni ironiche. Più spendi, più scende lo stress e più esperienza prendi. Una sera sola al giorno. Occhio al **tranvione**: a volte va male e perdi tutti i soldi, il rispetto al bar e la reputazione in paese.
- **Le ragazze del paese** (dating simulator): Blu Belga e Federica fanno jogging sulla capezzagna (la mattina e la sera), Sabrina sta alla fontana e la sera al bancone del bar, Ilenia gioca a biliardo al bar in pausa pranzo, Ludovica la Contessina sta al castello la mattina e alla fontana il pomeriggio, Noemi l'infermiera allo studio medico e in farmacia, Tamara «la Tigre» in palestra e la sera tardi al kebab, Balerion l'organista in chiesa e poi al juke-box del bar. Parlaci con **E** e scegli «Corteggiala»: è un gioco a dialoghi, ognuna ha la sua personalità (chi ama le battute, chi la sincerità, chi odia gli sdolcinati; la Contessina premia gli spacconi, Noemi i bisognosi e Tamara i cafoni). Le risposte giuste alzano l'affinità e i **punti red pill**, quelle sbagliate li fanno scendere (e se esageri ti blocca per qualche giorno). Con abbastanza affinità ti dà il numero, poi puoi chiederle di uscire: la sera, dalle 20, ti aspetta in pizzeria, al laghetto, sul ponte, a cena al castello, al kebab di Kemal o sul campanile (se le dai buca lo sa tutto il paese). Se la serata va bene, hai la **reputazione** in paese (almeno 40) e rispondi con classe, ti invita a salire: dissolvenza al nero, una battuta e ti risvegli a casa. Con tanti punti red pill a volte vedi la risposta giusta (👀) e dai 70 si sblocca la «mossa da maestro» (😎). Tutto nella scheda 💘 **Cuori** del menu.
- **Mercato del giovedì** (piazzola davanti al municipio, giovedì dalle 7 alle 13; il giorno 1 è un lunedì): la Rina compra pomodori e patate, Ottavio le uova, il Sor Bortolo il mais, Gilberto «Salamella» i salami (che ti lascia il commerciante quando vendi un maiale). I prezzi cambiano ogni settimana, anche molto (la **TV di casa** li anticipa con la notizia della settimana); più vendi allo stesso banco più il prezzo cala, e con ogni banco puoi **trattare** una volta (riesce meglio con la Parlantina). Nando delle pentole vende cianfrusaglie e gratta e vinci.
- **Gare di trattori**: sali sul trattore e vai alla **lavagna delle gare** sulla capezzagna, vicino al fienile. Sfida il Potato (posta 10 €), il cugino Ermes (25 €, serve rispetto 15) o Mister Frank (50 €, rispetto 35): conto alla rovescia, fino alla bandierina in fondo, si gira e si torna. Balle di fieno e fango sulla strada, sportellate dal rivale. Chi vince prende la posta e al bar lo sanno subito (rispetto su o giù). Una gara al giorno per rivale, dalle 7 alle 20.
- **Scommesse del Consulente** (al suo tavolino al bar): la gara delle 18 tra Ermes e Frank, te stesso nella prossima gara di trattori, la tua prossima rissa (su di te o «contro», la combine, che Loredana non perdona) e la rissa della sera tra due avventori. La puntata massima sale col rango al bar; le vincite grosse alzano il rispetto.
- **Night Welcome esplorabile**: si entra dalla porta (dalle 20 alle 24; cartelli «NIGHT» sulla provinciale e cuore ♥ sulla minimappa). Dentro: Sandokan alla reception col catalogo, il bancone di Lola, il Commendatore, la pista da ballo, il juke-box, il privé e qualche faccia nota che non vuole essere vista.
- **Lavoretti**: ogni faccenda dell'orto e del pollaio dà XP in più (+ premio a 10 lavoretti al giorno). Dietro casa c'è la **legna da spaccare** (sfoga lo stress, la Mamma la compra per la stufa) e sul laghetto il **pontile per pescare**.
- **Easter egg e cose che capitano**: la fontana dei desideri in piazza, cinque nani da giardino nascosti, il maiale scappato sulla provinciale, il turista tedesco perso, il portafoglio per strada, la Sagra del Cotechino ogni 7 giorni, luci strane sopra il grano (e il giorno dopo...), e la domenica mattina qualcuno pesca al laghetto. Prove dalla console: `garonio.sorprese.prova('maiale' | 'turista' | 'portafoglio' | 'mountain' | 'sagra' | 'ufo')`.
- Per provare dalla console: `garonio.imprevisti.prova('cane' | 'buca' | 'pozze' | 'cantiere' | 'impiccione')`.
- **Diario e freccia**: nel menu (**J**) ogni lavoro ha il pulsante 📍. La freccia gialla a terra, il segnalino sopra la meta e la linea sulla minimappa portano lì (in automatico seguono la missione del Gigante).
- **Collezionabili**: 8 tappi di birra, 8 santini e 8 figurine nascosti in giro. Luccicano solo da vicino; il Consulente, per 3€, dice dov'è il più vicino. Ogni collezione completa regala un portafortuna.
- **Trofei**: scheda 🏆 nel menu, per esempio «Scansafatiche d'oro» dopo 50 notti di sonno. Alcuni sono segreti.
- **Livelli e abilità**: a ogni livello (fino al 20) guadagni un punto abilità da spendere nel menu (**J**) in uno dei sette rami.
- Il gioco si salva da solo nel browser.


## Sul telefono

- **Android:** scarica [GT-Tractor.apk](https://github.com/alesminelli-hue/Garonio/releases/download/android/GT-Tractor.apk) e aprilo per installarlo (la prima volta Android chiede di consentire l'installazione da Chrome o da File). Parte a schermo intero e funziona senza internet. Per aggiornare si installa il nuovo APK sopra il vecchio: i salvataggi restano. Dettagli in `app-android/LEGGIMI.md`.
- **iPhone:** apri il gioco con Safari → Condividi → «Aggiungi alla schermata Home». Diventa un'icona che si apre a schermo intero e funziona offline (service worker `sw.js`, che chiede sempre i file nuovi quando c'è rete).
- **Salvataggi:** restano sul telefono. Nel menu 💾 Partite → «Esporta salvataggi» crea un file da tenere su iCloud/Drive; «Importa» lo rimette, anche su un altro telefono.

## Provarlo sul computer

Il gioco è fatto solo di file statici, ma il browser deve aprirlo tramite un piccolo server (non con doppio click sul file).
Il modo più semplice, se hai Python installato:

```
python3 -m http.server 8000
```

poi apri <http://localhost:8000>.

## Pubblicarlo online (GitHub Pages)

1. Su GitHub apri il repository → **Settings** → **Pages**.
2. In **Build and deployment** scegli *Deploy from a branch*, seleziona il branch del gioco e la cartella `/ (root)`, poi **Save**.
3. Dopo un minuto il gioco è su `https://<tuo-utente>.github.io/Garonio/`.

## Musica

Le colonne sonore stanno in `assets/music/` e si collegano alle scene in `assets/music/playlist.json`:

| Scena (nel codice) | Traccia | Quando suona |
|---|---|---|
| `intro` | **Grand Theft Tractor**, due versioni a turno (`intro.mp3`, `intro_2.mp3`) | Schermata del titolo e prologo |
| `base` / `notte` / `bar` | **Morning in the Valleys** (`sottofondo.mp3`), alternato alle due versioni di Grand Theft Tractor | A piedi: giornata, sera e bar |
| `guida` | **📻 Radio Bassa FM:** tutte le canzoni (Il Conte della Bassa, Canaglia, Sunset Truciolone, Pappa Garonio, Mister Scarogna, Palestra Delirio, Boborriello, Rabbia incontrollata) in ordine sparso, col titolo che compare in un avviso | Alla guida di Vespa, Punto o trattore |
| `rabbia` / `nemico` / `combattimento` | musichetta 8‑bit (lista vuota) | Stress oltre 85, nemici, scontri |

**Le canzoni si sentono solo alla radio dei mezzi** (e al juke‑box del bar, che ha gli stessi dischi). A piedi il sottofondo e il tema del titolo si alternano: finita una traccia parte l'altra. I titoli delle canzoni stanno in `playlist.json` sotto `titoli`.

Nel codice si usa sempre e solo `audio.setScene('nome-scena')` (elenco in `src/audio.js`, `MUSIC_SCENES`).

Per aggiungere una traccia: copia il file `.mp3` nella cartella e scrivi il suo nome nella lista della scena. Se una lista è vuota suona una musichetta 8‑bit di riserva.

## Effetti sonori

Tutti gli effetti sono **sintetizzati al volo** con la Web Audio API in `src/sfx.js`: nessun file audio esterno, quindi nessuna licenza di terzi da rispettare (sono codice del gioco come il resto). Passano da un bus separato dalla musica con un compressore leggero.

- **Mezzi**: motore continuo di Vespa (2 tempi), Punto e trattore (diesel) che sale di giri con la velocità, avviamento, motore che si spegne, clacson, incidenti; traffico che passa sulla provinciale.
- **Combattimento**: colpi a vuoto, pugni, colpi critici, Garonio colpito, schivate, uovo spiaccicato, KO.
- **Mondo**: passi diversi su erba, sterrato, asfalto, ponte, campo, fango e pavimenti (il fango quando piove), porte che si aprono e chiudono, galline, maiali, anatre, nutrie, gatti, cani, fischietto della Vigilessa, uccellini di giorno, grilli la sera, pioggia, vento con nebbia o neve, brusio e bicchieri al bar.
- **Interfaccia**: click, monete, livello, errore.

Nel codice: `audio.sfx('nome')`, oppure `audio.sfx('nome', { x, z })` per un suono nel mondo (più piano da lontano, a destra o a sinistra). L'elenco dei nomi è in cima a `src/sfx.js`.

**Volumi**: nel menu (**J**) → ⚙️ Opzioni ci sono Musica ed Effetti separati, ricordati dal browser. Il tasto **M** (o ♪) spegne e riaccende tutto l'audio.

## Struttura

| File | Cosa contiene |
|---|---|
| `index.html`, `style.css` | Pagina, interfaccia, dialoghi |
| `src/main.js` | Avvio, camera, comandi tastiera e touch |
| `src/game.js` | Regole: tempo, barre, missioni, nutrie, Mister Mountain, bar, officina. In cima c'è `CONFIG` per bilanciare velocità e valori |
| `src/data/missioni.js` | Missioni del Gigante: testi, quantità, scadenze, paghe, frasi di successo e rimproveri. Si modifica senza toccare il codice |
| `src/data/dialoghi.js` | Tutti i dialoghi: intro, scene di storia per giorno, il Gigante, Mister Mountain, casa, officina, bar e i suoi avventori |
| `src/racconto.js` | Collega i testi di `src/data/` ai dialoghi del gioco |
| `src/combat.js`, `src/combat.css` | Combattimento a turni stile JRPG: nemici, abilità, oggetti. In cima c'è `COMBAT` per bilanciare |
| `src/world.js` | Mappa, edifici, terreno |
| `src/vita.js`, `src/imprevisti.js`, `src/paradiso.js`, `src/lavoretti.js`, `src/sorprese.js` | Mondo vivo: paesani, traffico, animali, luci; buche, pozzanghere, cantieri, randagio, impiccioni, zanzare; Night Welcome. Testi in `src/data/vita.js`, sprite in `src/sprite_vita.js` |
| `src/pixel.js` | Grafica segnaposto disegnata via codice (verrà sostituita dagli sprite veri) |
| `src/audio.js` | Musica ed effetti sonori |
| `lib/three.module.min.js` | Three.js 0.170 (licenza MIT, `lib/THREE-LICENSE`) |

## Grafica

Lo stile è "HD-2D": la pixel art resta nitida, ma il mondo è disegnato alla risoluzione piena dello schermo, con luce che cambia con l'ora (sole che si sposta, ombre lunghe all'alba e al tramonto), foschia in lontananza e bordi dello schermo leggermente sfocati.
Se il telefono fatica (meno di 30 fotogrammi al secondo), il gioco spegne da solo ombre e sfocature. Per forzare la qualità piena aggiungi `?qualita=alta` all'indirizzo.
