# Grand Theft Tractor: Goodville City — Documento di Game Design (pilot)

> Titolo del gioco: **Grand Theft Tractor: Goodville City**. Il protagonista resta **Garonio**.

> Versione 0.3 · documento vivo: lo approfondiremo pezzo per pezzo.

## 1. In una frase

Un **survival gestionale con elementi da JRPG** in pixel art semi‑3D: guidi **Garonio**, il figlio pigro del titolare di un'azienda agricola, che deve sopravvivere alle giornate di lavoro, alle missioni del padre **il Gigante** e alle sfuriate di **Mister Mountain**, senza farsi schiacciare da stanchezza e stress.

## 2. Pilastri del gioco

1. **Gestire Garonio**: tre barre (Vita, Stress, Stanchezza) che ogni azione sposta. Lavorare costa, riposare fa perdere tempo.
2. **Gestire l'azienda**: orto, galline, campi, maiali e officina producono soldi e risorse, ma vanno curati e difesi.
3. **Crescere come in un JRPG**: esperienza, livelli, abilità e attrezzi migliori rendono Garonio un po' meno scansafatiche.

## 3. Stile e piattaforma

- **Grafica**: pixel art "semi‑3D" alla vecchi JRPG. Mondo in 3D a bassa risoluzione (render a ~1/3 della risoluzione, ingrandito senza sfocatura), personaggi e oggetti come sprite 2D che guardano sempre la camera. Camera dall'alto inclinata che segue Garonio.
- **Piattaforma**: browser game (PC e telefono). In futuro si può impacchettare come app (per esempio con Capacitor) senza riscrivere il gioco.
- **Tecnologia**: JavaScript + Three.js, nessun software da installare per giocare.
- **Musica**: supporto per le colonne sonore personali (file `.mp3`/`.ogg` nella cartella `assets/music/`), con musiche diverse per zona e momento della giornata.
- **Tono**: commedia di provincia, ironica. Nessun contenuto esplicito.

## 4. Personaggi

| Personaggio | Ruolo |
|---|---|
| **Garonio** | Protagonista. Dipendente nell'azienda agricola di suo padre. Pigro, dorme appena può, odia la fatica. |
| **Il Gigante** | Il padre e titolare dell'azienda. Lo considera uno scansafatiche. Ogni mattina assegna le missioni e controlla i risultati. |
| **Mister Mountain** | Appare quando Garonio sbaglia, perde o non completa una missione. Lo rimprovera e gli alza lo stress. È il "boss" ricorrente. |
| **Avventori del bar** | Personaggi ostili o molesti che possono far arrabbiare Garonio (eventi casuali che alzano lo stress invece di abbassarlo). |
| **La Mamma** | Gentile, l'unica che difende Garonio. In cucina dà pasti e consigli. |
| **Il Consulente** | Amico fidato di Garonio, sempre al bar. Dà consigli su cosa trovare in giro (capitolo 19.1). |
| **Zeno il meccanico** | Scorbutico, gestisce l'officina. Ripara ed elabora i mezzi, ma spesso frega Garonio (capitolo 20). |
| **Il Bubetto** | Ha un magazzino che vende di tutto: vestiti, armi, manuali. Dà missioni secondarie (capitolo 19.3). |
| **La Vigilessa** | Gira in paese e sulle strade. Se vede Garonio urtare qualcosa coi mezzi gli fa la multa (capitolo 19.4). |
| **I vicini** | Il Patata, il Postino e Mister Frank, ognuno con la sua cascina e le sue battute (capitolo 19.5). |
| **Nutrie e altri animali** | Nemici dei campi: mangiano il raccolto. Più avanti: volpi per le galline, cinghiali, ladri di attrezzi. |

## 5. Le tre barre di Garonio

| Barra | Sale quando… | Scende quando… | Se arriva al limite |
|---|---|---|---|
| **Vita** (0‑100) | Mangia, dorme bene, cure | Stress al massimo, scontri con animali, incidenti | A 0 Garonio sviene: perde la giornata e una parte dei soldi |
| **Stanchezza** (0‑100) | Ogni lavoro (zappare, raccogliere, scacciare nutrie, correre) | Dormire a casa, pisolini, caffè al bar | A 100 crolla addormentato dove si trova e passano ore |
| **Stress** (0‑100) | Rimproveri di Mister Mountain, missioni fallite, lavorare troppo, clienti molesti al bar, paesani che ti deridono | Bar (mangiare), dormire, serate di svago, tempo libero | Già da 40 guida peggio (soprattutto i trattori) e da 30 manca più colpi; a 100 perde Vita ogni ora |

**Lo stress pesa davvero** (valori in `STRESS_GUIDA` di `src/vehicles.js` e `stressDa`/`stressMira` di `src/combat.js`):
- **Alla guida**, sopra 40: il mezzo rallenta, sterza peggio e dà strattoni al volante; gli urti fanno più danni. I trattori ne soffrono di più: sopra 64 circa si ingolfano, sopra 70 Garonio può strappare la frizione (−8%) fino a romperli. L'HUD del mezzo lo avvisa.
- **In combattimento**, sopra 30 la mira cala sempre di più: a stress 100 circa un colpo su tre va a vuoto. La Rabbia Incontrollata non sbaglia mai.

Regola chiave: **lavorare stanca e stressa, riposare costa tempo**. Il giocatore deve trovare l'equilibrio fra fare abbastanza per il Gigante e non crollare.

## 6. Ciclo di gioco

### La giornata
- 06:00 sveglia a casa. Il Gigante assegna **la missione del giorno** (con scadenza).
- Il giocatore lavora tra orto, galline, campi, maiali e officina.
- Può andare al bar o a riposare quando vuole, ma il tempo scorre.
- Alla scadenza: missione riuscita → soldi ed esperienza. Missione fallita → **arriva Mister Mountain** (stress molto alto).
- **Giornata da rifare**: se la missione del giorno è fallita, quando la giornata finisce (letto, mezzanotte o svenimento) non si passa al giorno dopo. Il Gigante lo dice chiaro e si riparte da capo dalla mattina stessa, con la stessa missione e lo stato di quella mattina (copia «alba» salvata al risveglio, in `src/salvataggi.js`).
- 22:00 in poi: a casa a dormire, oppure uscita serale (bar, svago).

### Ciclo lungo
- Soldi → attrezzi e mezzi in officina, abilità, animali nuovi, campi più grandi.
- Esperienza → livelli → abilità (meno stanchezza per lavoro, più resistenza allo stress, colpi più efficaci contro le nutrie).
- Le stagioni cambiano colture, nemici ed eventi.

## 7. Mappa (160 × 112 caselle, luoghi distanti: a piedi si arriva, coi mezzi si fa prima)

```
 ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈ CANALE (da qui escono le nutrie) ≈≈≈≈≈≈≈≈╪ponte≈≈≈≈≈≈
   [grano]   FIENILE  [CAMPO DI MAIS]   [arato]                 [grano]
   ═════════════════ capezzagna (sterrato) ═════════════════════════════
       ║                    ║                                        ║
 BAR · paese ═══════════════╬══ strada provinciale (asfalto) ════════╬═══
                            ║                    silos ║
                      CASA  OFFICINA  tettoia      CAPANNONI MAIALI
                      orto  pollaio                recinto dei maiali
      laghetto
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ bosco ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

Distanze a piedi (camminando): casa → bar circa 20 secondi, casa → campo circa 15, casa → maiali circa 20, bar → maiali più di 35. Per questo servono Vespa, Punto e trattori.

- **Strade**: provinciale asfaltata (veloce), strade sterrate (medie), erba e campi (lenti). Cartelli agli incroci.
- **Minimappa** in basso a destra (sul telefono in alto): tasto **N** o tocco per ingrandirla con i nomi dei luoghi.
- Per gli sviluppatori: tutti i dati della mappa (luoghi, strade, zone, punti di parcheggio dei mezzi) stanno in `src/map.js`.

- **Casa**: si dorme, si salva, si ricevono le missioni dal Gigante.
- **Officina**: si comprano e migliorano attrezzi (zappa, annaffiatoio, rete anti‑nutria), mezzi (bici, motozappa, trattore) e abilità.
- **Orto**: piccole colture veloci (pomodori, insalata, zucchine).
- **Pollaio**: galline da nutrire, uova da raccogliere ogni giorno.
- **Campi**: colture grandi (mais, grano), da arare, seminare, irrigare, raccogliere e **difendere dalle nutrie**.
- **Capannoni dei maiali**: dare da mangiare, pulire, curare le malattie, far crescere e vendere.
- **Bar**: mangiare e bere per abbassare lo stress, incontri casuali (alcuni ostili), voci di paese che sbloccano missioni.

## 8. Missioni del Gigante

Tipi di missione (combinabili):
- **Raccolta**: "Porta 6 uova entro le 12".
- **Lavoro**: "Ara e semina il campo entro le 18".
- **Difesa**: "Non far mangiare più di 2 piante dalle nutrie oggi".
- **Allevamento**: "Pulisci i capannoni e dai da mangiare ai maiali".
- **Vendita**: "Vendi 3 maiali al mercante giovedì".

Esito:
- **Riuscita**: soldi, esperienza, a volte un oggetto. Il Gigante è un po' meno scontento.
- **Fallita o fatta male**: entra **Mister Mountain**, scena di rimprovero, stress +25/+40 secondo la gravità.
- **Indicatore di "fiducia del Gigante"** (idea da approfondire): se scende troppo, meno paga e missioni peggiori; se sale, più libertà e bonus.

## 8b. Mezzi di Garonio e dell'azienda

**Mezzi personali** (per spostarsi più veloce sulla mappa):
- **Vespa blu "carta da zucchero", scassata**: veloce e agile, ma ogni tanto si spegne o non parte. Ripararla in officina costa soldi e tempo.
- **Fiat Punto bianca, scassata**: più lenta da avviare, ma trasporta più merce (per esempio le casse da vendere). Può forare o restare senza benzina.

**Mezzi dell'azienda** (del Gigante):
- **Trattori**: servono per arare e raccogliere i campi molto più in fretta. Garonio li può **rompere** (guida distratta, stanchezza alta, manovre sbagliate): un trattore rotto è un errore grave, il Gigante si arrabbia e arriva Mister Mountain. Si riparano in officina.

Idea: con stanchezza alta aumenta la probabilità di guasti e incidenti con tutti i mezzi.

**Come funzionano nel gioco (versione 0.2)** — codice in `src/vehicles.js`, pixel art in `src/vehicle_sprites.js`:
- **E** vicino a un mezzo per salire, **E** di nuovo per scendere. Guida con frecce/WASD o levetta: il mezzo gira verso la direzione premuta; tirando all'indietro va in retromarcia. **Q** = clacson (spaventa anche le nutrie).
- **Vespa**: la più veloce e agile. Una volta su quattro circa non parte al primo colpo; ogni tanto si spegne in corsa e Garonio scende imprecando. Negli urti forti Garonio cade (Vita −6).
- **Punto**: più lenta a partire, consuma benzina (spia della riserva, a secco si ferma). Negli urti si ammacca e può forare (velocità dimezzata finché non cambi la gomma).
- **Trattori** (rosso e verde, vicino all'officina): lenti, arano automaticamente le zolle del campo dove passano. Si danneggiano molto con gli urti; a zero, o guidando con stanchezza sopra 75, si rompono → arriva Mister Mountain (stress +35).
- Con stanchezza alta tutti i mezzi sbandano un po'. Se Garonio crolla mentre guida, il mezzo si danneggia.
- **Officina**: riparazione (prezzo in base al danno), cambio gomma e pieno alla Punto. Il meccanico va a prendere il mezzo dove l'hai lasciato.
- **Rimorchio di Zeno** (`RIMORCHIO` in `src/data/officina.js`): se il mezzo è bloccato (fermo contro qualcosa per qualche secondo), rotto o a secco, con **E** chiami Zeno che lo riporta al suo posto in azienda, con Garonio a bordo. Costa poco (Vespa 4€, Punto 6€, trattore 8€, il doppio di notte quando viene il nipote) e si può fare anche senza soldi: quello che manca va **sul conto di Zeno** (debito da saldare prima delle riparazioni). Se era a secco ti lascia un goccio di carburante. Riparare resta un'altra cosa.
- **Derisione** (`src/derisione.js`): se rompi un mezzo e qualcuno ti vede (paesani, personaggi del paese, vicini e garzoni nel raggio di 10 caselle), ride di te: reputazione in paese −3 per testimone (massimo −9) e stress +3 per testimone.
- I mezzi incastrati negli ostacoli (argine del canale, transenne) possono sempre uscire con una manovra che li tira fuori.
- I mezzi sono parcheggiati vicino a casa e officina, calcolati dalla posizione degli edifici: con la mappa nuova basta aggiornare `defaultParking()`.

## 9. Nemici e combattimento (stile JRPG leggero)

- Nel prototipo: le nutrie entrano nel campo e mangiano le piante; Garonio le scaccia avvicinandosi e premendo il tasto azione (costa stanchezza).
- Scontri a turni (già nel gioco, `src/combat.js`). Armi, mosse ed equipaggiamento sono nel capitolo 15, i nemici legati al livello nel capitolo 11.2, i gruppi casuali nel capitolo 18.4.
- Al bar: "scontri" verbali con clienti ostili che possono finire in rissa (capitolo 18.2).

## 10. Economia

| Entrate | Uscite |
|---|---|
| Uova, ortaggi, raccolto dei campi | Cibo e bevande al bar |
| Vendita maiali | Sementi, mangime, medicine per gli animali |
| Paga per le missioni del Gigante | Attrezzi, mezzi e riparazioni in officina |
| Bonus eventi | Abilità e potenziamenti personali |
| | Serate di svago |

### Svago serale (contenuto non esplicito)
Con i soldi guadagnati Garonio può scegliere come scaricare lo stress:
- **Potenziamenti personali**: comprare punti abilità o statistiche.
- **Serata in compagnia**: un "catalogo" di serate con accompagnatrici, a fasce di prezzo. Più costa la serata, più **abbassa lo stress** e più **esperienza** dà. La scena è solo accennata: dialogo e dissolvenza al nero, nessun contenuto esplicito. Serve come grande ricompensa economica da pianificare.

## 11. Progressione: livelli, esperienza e punti abilità

> Versione 0.2 della progressione. I numeri sono un punto di partenza da bilanciare giocando.

### 11.1 Livelli ed esperienza

- **Livello massimo: 20** nel pilot.
- **Esperienza per salire**: resta la regola che c'è già nel codice, *livello attuale × 20* (dal 1 al 2 servono 20 punti, dal 10 all'11 ne servono 200). Per arrivare al 20 servono circa 3.800 punti in tutto.
- **Da dove arriva**: lavori (1‑5 punti), missioni del Gigante (10‑40), combattimenti (5‑25 per nemico), dialoghi vinti al bar (3‑15), bestie leggendarie (150‑400). Le missioni pagano di più man mano che l'annata va avanti, così il ritmo non rallenta.
- **Ritmo previsto**: livello 6 verso il giorno 7, livello 11 verso il giorno 20, livello 17 verso il giorno 45, livello 20 a fine annata (giorno 56 circa). Così ogni re delle bestie cade nella sua stagione (vedi capitolo 18).

**A ogni livello Garonio guadagna:**

| Cosa | Quanto |
|---|---|
| Punti abilità | +1 (vedi 11.3) |
| Attacco | +2 (già nel codice) |
| Difesa | +1 (già nel codice) |
| Vita massima | +5 (100 al livello 1, 195 al 20) |
| Fatica dei lavori | −4% (già nel codice, fino a −40%) |

**Titoli di Garonio** (compaiono sotto il ritratto, i personaggi li usano nei dialoghi):

| Livelli | Titolo | Cosa cambia |
|---|---|---|
| 1‑4 | **Lo Scansafatiche** | Il Gigante dà solo lavori semplici. Nemici: nutrie, ratti, ubriachi. |
| 5‑9 | **Il Garzone** | Si sbloccano trattore da solo e capannoni. Volpi e topi grossi. |
| 10‑14 | **Il Bracciante** | Missioni lunghe di due giorni, vendita in fiera. Cinghiali. |
| 15‑19 | **Il Fattore** | Il Gigante chiede consiglio (quasi). Lupi. |
| 20 | **La Leggenda della Bassa** | Titolo finale dopo i tre re. |

### 11.2 Nemici legati al livello

Ogni nemico ha un **livello minimo** sotto il quale non compare mai negli incontri casuali, e un **livello consigliato** per affrontarlo senza rischi. Gli incontri casuali scelgono solo nemici con livello minimo ≤ livello di Garonio, e mai più di 3 livelli sopra di lui. Le tane delle bestie leggendarie invece si possono raggiungere anche prima: Garonio sente un brivido («Qui non ci torno finché non sono più forte...») e si può fuggire, ma vincere è quasi impossibile.

| Nemico | Dove | Liv. minimo | Liv. consigliato | Note |
|---|---|---|---|---|
| Nutria | Campi, canale | 1 | 1 | c'è già |
| Ratto | Capannoni, silos, cantina | 1 | 2 | nuovo, a gruppi di 2‑4 |
| Cliente ubriaco | Bar | 1 | 2 | c'è già |
| Volpe | Pollaio, di notte | 2 | 3 | c'è già, ruba le uova |
| Bullo del paese | Bar | 3 | 4 | c'è già |
| Mamma Nutria | Campi, canale | 4 | 5 | c'è già |
| Ratto di fogna gigante | Capannoni, silos | 5 | 6 | nuovo, morso che fa ammalare (Vita −2 per turno) |
| **Re dei Ratti** | Tana sotto il silos | 6 | 8 | bestia leggendaria |
| Gazza ladra | Ovunque, di giorno | 6 | 7 | nuovo, ruba un oggetto e scappa |
| Cugino Ermes | Bar, fuori nella piazza | 7 | 8 | nuovo come nemico |
| Cinghiale | Bosco, campi di mais in autunno | 8 | 10 | c'è già |
| Nutria corazzata (di fango) | Canale | 9 | 11 | nuova, difesa alta |
| Lupo giovane | Bosco, d'inverno | 10 | 12 | nuovo |
| **Re delle Nutrie** | Tana sotto il ponte | 11 | 13 | bestia leggendaria |
| Bruno «il Toro» | Bar | 12 | 13 | boss del bar |
| Cinghiale maschio | Bosco | 13 | 15 | nuovo, carica che stordisce |
| Lupo | Bosco, nebbia e notte | 14 | 16 | nuovo, a branchi |
| Rocco il camionista | Bar | 15 | 17 | sfida finale del bar |
| **Re dei Lupi** | Radura del bosco, notte d'inverno | 17 | 19 | bestia leggendaria |

### 11.3 Punti abilità

Un punto a ogni livello: 19 punti in tutto, ma i rami ne richiederebbero 28. **Non si può prendere tutto**, quindi ogni partita ha un Garonio un po' diverso. Altri punti si comprano con lo svago serale (capitolo 10).

Sette rami, ognuno con 4 gradi. Il grado *n* richiede il livello indicato.

| Ramo | Grado 1 (liv. 1) | Grado 2 (liv. 5) | Grado 3 (liv. 10) | Grado 4 (liv. 15) |
|---|---|---|---|---|
| **Resistenza** | Lavori −10% fatica | Corsa senza fatica extra | Stanchezza max 120 | Crollo: una volta al giorno si rialza da solo |
| **Nervi saldi** | Rimproveri −15% stress | Prese in giro −25% stress | Mister Mountain −30% | Stress sopra 85: non perde Vita |
| **Agricoltore** | Colture +10% veloci | Raccolto +1 per pianta | Annaffiare annaffia 3 zolle | Grandine e siccità danneggiano la metà |
| **Allevatore** | Maiali +10% crescita | Malattie −30% | Prezzo maiali +20% | Maialini in più a ogni parto |
| **Furbizia** | Pisolini −30% rischio di farsi beccare | Gli oggetti curano +25% | Più soldi da vendite e mance | Il Gigante «non vede» la prima missione fallita della settimana |
| **Lottatore** | Attacco +3 | Colpo critico 10% | Mossa extra dell'arma sbloccata | Due azioni nel primo turno |
| **Parlantina** | Risposte a tono +10% riuscita | Nuova scelta: «Offri da bere» | Gli avventori si arrabbiano −25% | Si può vincere una rissa a parole prima di iniziare |

## 11b. Colonne sonore

Le tracce originali stanno in `assets/music/`. La **mappa centrale** è `assets/music/playlist.json`: il codice chiede solo una *scena* (`audio.setScene('bar')`) e il file decide quale traccia suona. Per cambiare abbinamento si modifica solo quel file.

| Scena (nel codice) | Traccia | Quando suona |
|---|---|---|
| `intro` | **`intro.mp3`** (da fare con Suno) | Schermata del titolo e prologo |
| `base` / `notte` / `bar` | **`sottofondo.mp3`** (da fare con Suno) | A piedi: giornata, sera e bar |
| `guida` | **📻 Radio Bassa FM:** tutte le canzoni (Il Conte della Bassa, Canaglia, Sunset Truciolone, Pappa Garonio, Mister Scarogna, Palestra Delirio, Boborriello, Rabbia incontrollata) in ordine sparso, col titolo che compare in un avviso | Alla guida di Vespa, Punto o trattore |
| `rabbia` / `nemico` / `combattimento` | musichetta 8‑bit (lista vuota) | Stress oltre 85, nemici, scontri |

**Le canzoni si sentono solo alla radio dei mezzi** (e al juke‑box del bar, che ha gli stessi dischi). Per mettere l'intro e la musica di sottofondo basta copiare in `assets/music/` i brani fatti con Suno chiamandoli esattamente `intro.mp3` e `sottofondo.mp3`: finché mancano suona la musichetta 8‑bit. I titoli delle canzoni stanno in `playlist.json` sotto `titoli`.

Per aggiungere una traccia basta mettere il file `.mp3` nella cartella e scriverne il nome nella lista della scena giusta (se ci sono più tracce, suonano a rotazione).

## 12. Controlli

- PC: frecce o WASD per muoversi, **Shift** per correre, **E / Spazio** per agire (e salire/scendere dai mezzi), **Q** per saltare (clacson alla guida), **M** musica, **N** mappa.
- Telefono: levetta virtuale (spinta fino in fondo = corsa), pulsante **E** per agire e **Q** per saltare.

### Animazioni di Garonio (dal foglio personaggio)

Fermo, cammina (4 fotogrammi), corre (3), salta (3), attacco (quando scaccia le nutrie), a terra (quando dorme in piedi o crolla). Il ritratto è l'icona nell'interfaccia e nei dialoghi. Mancano ancora le viste di spalle e di fronte per quando cammina su e giù.

## 13. Cosa c'è nel prototipo (versione 0.1)

- Mondo piccolo: casa, orto, pollaio, un campo, officina e bar (questi ultimi due in forma minima).
- Barre di Vita, Stress e Stanchezza, orologio, giorno e soldi.
- Una missione al giorno dal Gigante con scadenza.
- Nutrie che attaccano il campo.
- Mister Mountain che compare in caso di fallimento.
- Dormire a casa per passare al giorno dopo, salvataggio automatico nel browser.
- Le tre colonne sonore originali collegate alle scene (cartella `assets/music/`).

## 14. Prossimi passi proposti

1. Provare il prototipo e decidere il "feeling" (velocità delle barre, durata del giorno).
2. ✅ Garonio ha i suoi sprite e il ritratto. Mancano gli sprite veri del Gigante e di Mister Mountain, e le viste di Garonio di spalle e di fronte.
3. ✅ Mezzi: Vespa e Punto per muoversi, trattori dell'azienda che si possono rompere (prima versione).
4. Aggiungere maiali, officina vera e bar con eventi (interni: capitolo 17).
5. Sistema di livelli e abilità (progettato: capitoli 11, 15, 16; lavori: capitolo 21).
6. Svago serale e catalogo (versione non esplicita).
7. Stagioni e nuovi nemici (progettati: capitolo 18).
8. Versione app per telefono.

## 15. Armi, mosse ed equipaggiamento

### 15.1 Gli slot

Garonio porta **un'arma** (un attrezzo da lavoro) e **quattro pezzi di equipaggiamento**: testa, corpo, piedi, portafortuna. Si cambiano dall'armadio in camera di Garonio o dal menu del combattimento prima di iniziare (non durante). Gli **oggetti consumabili** stanno nello zaino, come adesso.

### 15.2 Armi (attrezzi)

Ogni arma ha attacco, una **mossa propria** che si aggiunge al menu Abilità, e un piccolo effetto fuori dal combattimento (perché è anche un attrezzo). Si comprano al **magazzino del Bubetto** se Garonio ha il livello giusto e il Bubetto le ha in negozio (capitolo 19.3). Si possono **affilare** tre volte da Zeno in officina (+2 attacco ogni volta, capitolo 16).

| Arma | Liv. | Attacco | Mossa propria | Fuori dal combattimento | Prezzo |
|---|---|---|---|---|---|
| Zappa vecchia | 1 | +0 | **Zappata**: colpo forte su uno | zappa le zolle | di partenza |
| Rastrello | 3 | +2 | **Rastrellata**: colpisce due nemici vicini | raccoglie 2 piante alla volta nell'orto | 50 € |
| Badile | 5 | +4 | **Badilata**: stordisce un nemico per un turno | scava le tane delle nutrie (meno nutrie) | 90 € |
| Forcone | 7 | +6 | **Spazzata col forcone**: colpisce tutti | pulisce i capannoni più in fretta | 140 € |
| Falce | 10 | +8 | **Falciata**: tutti, con critico più facile | taglia l'erba alta dei fossi (ci si nascondono oggetti) | 220 € |
| Roncola | 12 | +10 | **Fendente della Bassa**: uno, ignora metà difesa | taglia i rovi del bosco (apre sentieri) | 300 € |
| Motosega | 16 | +15 | **Motosegata**: enorme a tutti, consuma benzina e alza lo stress dei nemici | taglia alberi (apre la radura del Re dei Lupi) | 600 € + benzina |

**Al bar le armi restano fuori dalla porta** (lo dice Loredana). Nelle risse Garonio usa quello che trova:

| Arma da bar | Effetto |
|---|---|
| A mani nude | attacco base |
| Sgabello | colpo forte, poi si rompe (paghi 10 € a Loredana) |
| Bottiglia vuota | stordisce, ma il rispetto sale meno (colpo «da vigliacchi») |
| Stecca da biliardo | colpisce due avventori |

### 15.3 Mosse di Garonio

Alle mosse delle armi si aggiungono quelle che Garonio impara salendo di livello. Quelle che ci sono già restano.

| Mossa | Liv. | Costo | Effetto | Stato |
|---|---|---|---|---|
| Pisolino tattico | 1 | −15 fatica | il prossimo colpo ricevuto fa più male | c'è già |
| Rabbia Incontrollata | 1 | stress 60+ | colpo enorme a tutti, stress −35 | c'è già |
| Urlo da campagna | 2 | 5 fatica | nemici più deboli per 3 turni | c'è già |
| Lancio di letame | 4 | 6 fatica | un nemico sbaglia più spesso per 3 turni | nuova |
| Colpo di clacson | 6 | solo se arrivato in mezzo | i nemici piccoli (ratti, nutrie) scappano | nuova |
| Bestemmia trattenuta | 8 | 0 fatica, +10 stress | Garonio si carica: +50% danno al prossimo colpo | nuova |
| Fischio al cane | 11 | 8 fatica | arriva il cane di casa e morde un nemico | nuova (serve il cane, vedi 16) |
| Secondo fiato | 14 | 1 volta per scontro | fatica −40, Vita +20 | nuova |

**Mosse a parole** (si usano nei dialoghi del bar e nelle risse, contro l'«Orgoglio» dell'avventore, vedi capitolo 18.2): *Battuta pungente*, *Offri da bere*, *Racconto epico*, *Silenzio gelido*.

### 15.4 Equipaggiamento

| Pezzo | Slot | Effetto | Dove si trova |
|---|---|---|---|
| Stivali nuovi | piedi | cammini +20% | Bubetto (oggi in officina, diventa equipaggiamento) |
| Stivali alti da canale | piedi | si entra nell'acqua bassa, serve per il Re delle Nutrie | Bubetto, liv. 9 |
| Cappellino del consorzio | testa | stress −10% | Bubetto |
| Casco da Vespa | testa | difesa +2, niente danno nelle cadute dalla Vespa, niente multa della Vigilessa | Bubetto |
| Tuta da lavoro | corpo | difesa +2, lavori −5% fatica | Bubetto |
| Giacca imbottita | corpo | difesa +4, d'inverno niente fatica extra per il freddo | Bubetto, liv. 10 |
| Grembiule di cuoio | corpo | difesa +6 | Bubetto, liv. 14 |
| Santino della nonna | portafortuna | una volta al giorno, a Vita 0 si rialza con 20 | in cantina, cap. 1 della trama principale |
| Thermos di caffè | portafortuna | fatica −10 a inizio scontro | bar, rispetto 40 |
| **Corona del Re dei Ratti** | testa | i ratti non rosicchiano più il mangime, attacco +3 | trofeo |
| **Pelliccia del Re delle Nutrie** | corpo | difesa +8, nutrie −50% nei campi | trofeo |
| **Mantello del Re dei Lupi** | corpo | difesa +10, stress −20% in combattimento | trofeo |

### 15.5 Oggetti consumabili

Ci sono già Uovo, Pomodoro e Pannocchia. Si aggiungono:

| Oggetto | Effetto | Dove |
|---|---|---|
| Caffè | fatica −20 | bar |
| Panino col salame | Vita +35 | bar, alimentari |
| Grappa | stress −25, ma sbaglia più spesso per 3 turni | bar |
| Trappola per ratti | un ratto salta il turno; fuori dal combattimento cattura ratti nei capannoni | Bubetto |
| Tanica di benzina | ricarica la motosega, la Punto o la Vespa | officina |
| Pomata del veterinario | cura il «morso infetto» dei ratti | capannoni |

## 16. Upgrade

Gli upgrade si comprano con i soldi. Alcuni chiedono un livello minimo o un capitolo della trama.

### 16.1 Armi e affilatura

Le armi si comprano dal Bubetto, che allarga il magazzino col passare dell'annata (capitolo 19.3). In officina Zeno affila le armi in tre gradi (30/60/120 €). Come tutto quello che fa Zeno, a volte l'affilatura va storta (capitolo 20.3).

### 16.2 Mezzi

| Mezzo | Upgrade | Effetto | Prezzo |
|---|---|---|---|
| Vespa | Portapacchi | trasporta 3 oggetti | 40 € |
| Punto | Gancio traino | trasporta un maiale per la vendita | 100 € |
| Trattori | Cabina | con stanchezza alta non si rompe più | 400 € |

Gli **attrezzi dei trattori** (aratro, seminatrice, falciatrice, turbina) e le **elaborazioni** di Vespa e Punto, che possono andare male, sono nel capitolo 20.

### 16.3 Azienda

| Dove | Upgrade | Effetto | Prezzo |
|---|---|---|---|
| Campi | Nuovo campo di grano | più raccolto (si apre il campo a ovest) | 300 € |
| Campi | Irrigazione a goccia | non serve annaffiare il campo di mais | 350 € |
| Orto | Serra | l'orto produce anche d'inverno | 200 € |
| Pollaio | Galline in più (+3) | più uova | 60 € |
| Pollaio | Recinto anti‑volpe | volpi −70% | 120 € |
| Capannoni | Box in più (+4 maiali) | più maiali | 250 € |
| Capannoni | Mangiatoie automatiche | nutrire una volta al giorno basta | 220 € |
| Capannoni | Ventilatori | d'estate i maiali non soffrono il caldo | 180 € |
| Capannoni | Infermeria | malattie curate senza veterinario | 260 € |
| Casa | Letto nuovo | dormire recupera più in fretta (6 ore invece di 8) | 150 € |
| Casa | Il cane | sblocca «Fischio al cane», abbaia quando arrivano i nemici | gratis, cap. 2 della trama principale |

## 17. Edifici visitabili (interni)

Toccando la porta (tasto **E**) si entra in una **stanza a parte**, nello stesso stile pixel semi‑3D, con la camera fissa e più vicina. Dentro ci si muove con gli stessi comandi. Si esce dalla porta. Il tempo continua a scorrere. Gli altri edifici (fienile, alimentari, tabacchi, chiesa, municipio) restano chiusi per ora: verranno dopo.

### 17.1 Casa

| Stanza | Cosa si fa |
|---|---|
| **Camera di Garonio** | Letto: dormire e salvare. Armadio: cambiare arma ed equipaggiamento. Poster e trofei delle bestie appesi al muro. |
| **Cucina** | La **Mamma** (personaggio nuovo, gentile, l'unica che difende Garonio): una volta al giorno dà un pasto (Vita +20, stress −5) e consigli sulle missioni. |
| **Ufficio del Gigante** | Bacheca con la missione del giorno, **calendario della stagione** con l'obiettivo grande, registro dei conti (soldi e «fiducia del Gigante»). |
| **Soggiorno** | TV: previsioni del tempo (pioggia, grandine, nebbia) e prezzi del mercato del giorno. Divano: pisolino rapido (rischio di farsi beccare). |
| **Cantina** | Deposito del raccolto. È anche la **prima mini‑tana**: in primavera (primo capitolo dell'annata) ci sono ratti, e da qui partono le prime tracce del Re dei Ratti. |

### 17.2 Officina

| Zona | Cosa si fa |
|---|---|
| **Bancone del meccanico** | **Zeno**, il meccanico scorbutico: riparazioni a pagamento, pieno e gomme (c'è già nel menu), con il rischio che ti freghi (capitolo 20). |
| **Ponte sollevatore** | Elaborazioni di Vespa e Punto: si vede il mezzo sollevato. |
| **Mola** | Affilatura delle armi. |
| **Rastrelliera degli attrezzi** | Aratro, seminatrice, falciatrice e turbina: si comprano, si riparano e si agganciano ai trattori. |
| **Armadietti** | Upgrade dell'azienda (si ordinano qui). |

### 17.3 Capannoni dei maiali

| Zona | Cosa si fa |
|---|---|
| **Box dei maiali** | Ogni maiale ha nome, peso, salute e umore. Si nutrono, si puliscono i box, si curano. |
| **Magazzino del mangime** | Si prendono i sacchi; i ratti li rosicchiano se non ci sono trappole. |
| **Sala parto** | In primavera nascono i maialini. Un evento da seguire (missione). |
| **Infermeria** | Con l'upgrade si curano qui le malattie, senza il veterinario. |
| **Grata nel pavimento** | Chiusa all'inizio. Nel capitolo del Re dei Ratti si apre e porta alla **tana sotto il silos**. |

Di notte nei capannoni compaiono gruppi di ratti (vedi spawn, capitolo 18.4).

### 17.4 Bar

| Zona | Cosa si fa |
|---|---|
| **Bancone** | **Loredana**: ordini (c'è già), voci di paese, misuratore del **Rispetto**. |
| **Tavolino del Consulente** | Il **Consulente**, sempre lì: consigli su cosa trovare in giro (capitolo 19.1). |
| **Tavoli** | Ogni avventore ha il suo posto. Si va a parlarci: è da qui che partono i dialoghi e le risse (trama del bar). |
| **Tavolo delle carte** | Briscola con Tarcisio: mini‑gioco per soldi e rispetto. |
| **Biliardo** | Sfide a soldi; la stecca diventa un'arma nelle risse. |
| **Juke‑box** | Si sceglie una delle canzoni della radio (scena `guida` di `playlist.json`). |
| **Bacheca degli annunci** | Lavoretti extra (missioni secondarie) e avvisi sulle bestie leggendarie. |
| **Porta sul retro** | «Andiamo fuori a parlarne»: le risse grosse si fanno nella piazza. |

### 17.5 Magazzino del Bubetto

| Zona | Cosa si fa |
|---|---|
| **Bancone** | Il **Bubetto**: si compra e si vende, si chiacchiera. |
| **Scaffali** | Vestiti, armi, manuali e oggetti, divisi per reparto. |
| **Angolo dell'usato** | Oggetti rari a rotazione, ogni lunedì. |
| **Lavagna** | Le missioni secondarie del Bubetto. |

Le cascine dei vicini (capitolo 19.5) per ora si vedono solo da fuori: si parla coi vicini nel cortile.

## 18. Le tre trame

Le tre trame vanno **in parallelo**. Il **calendario agricolo** dà il tempo a tutte: un'annata di **4 stagioni da 14 giorni** (56 giorni). Il giocatore sceglie ogni giorno quanto tempo dare all'azienda, al bar e alla caccia, sempre con le tre barre da tenere sotto controllo.

Le tre trame si aiutano a vicenda:
- l'**annata** dà soldi, che diventano upgrade e armi;
- il **bar** dà le **voci** che aprono i capitoli delle bestie, e sconti;
- le **bestie** danno trofei (equipaggiamento) e tolgono i parassiti dai campi, cosa che aiuta l'annata.

### 18.1 Trama principale: «L'annata» (gestionale)

Ogni stagione è un capitolo, con un **obiettivo di stagione** (grande, controllato dal Gigante l'ultimo giorno) più le missioni giornaliere che ci sono già. Lavori nuovi e nemici arrivano con le stagioni. I nemici di questa trama li definiamo meglio dopo; per ora ci sono i segnaposto.

| Cap. | Stagione | Lavori della stagione | Obiettivo di stagione | Eventi | Nemici (segnaposto) |
|---|---|---|---|---|---|
| 1 | **Primavera: «Si semina»** | arare, seminare mais, orto, uova, arrivano i primi 4 maiali | 40 zolle di mais seminate e 4 maiali sani | pioggia (non serve annaffiare), parto delle scrofe | nutrie, ratti in cantina |
| 2 | **Estate: «Acqua e caldo»** | irrigare, trebbiare il grano, maiali da tenere al fresco | raccolto del grano venduto per 400 € | caldo (fatica +20%), grandine, sagra del paese | volpi, gazze, ratti di fogna |
| 3 | **Autunno: «Il raccolto»** | raccogliere il mais, vendere, seminare il grano per l'anno dopo | mais raccolto e 2 maiali premiati alla **fiera** | fiera di paese, prime nebbie | cinghiali nel mais |
| 4 | **Inverno: «I conti»** | maiali venduti al salumificio, manutenzione dei mezzi, serra | bilancio dell'anno in attivo | nebbia fitta, neve, Natale in famiglia | lupi dal bosco |

**Fiducia del Gigante** (0‑100): sale con missioni e obiettivi riusciti, scende coi fallimenti. Decide la paga, che missioni arrivano e il **finale**:
- fiducia alta e conti in attivo: il Gigante affida a Garonio un campo tutto suo;
- fiducia media: «Un altro anno così e ti metto a fare il garzone a vita»;
- fiducia bassa: Mister Mountain si presenta alla cena di Natale.

Missioni nuove da aggiungere ai tipi che ci sono già: **Trebbiatura** (col trattore e la falciatrice), **Irrigazione**, **Parto** (resta sveglio di notte nei capannoni), **Fiera** (porta i maiali più belli col gancio traino), **Manutenzione** (porta i mezzi da Zeno).

### 18.2 Trama del bar: «Farsi rispettare»

**Rispetto** (0‑100), mostrato al bancone. Sale vincendo dialoghi e risse, scende perdendo o scappando.

| Rispetto | Rango | Cosa si sblocca |
|---|---|---|
| 0‑19 | Lo zimbello | tutti lo prendono in giro, prezzi pieni |
| 20‑39 | Uno qualunque | tavolo delle carte |
| 40‑59 | Uno che risponde | thermos di caffè, sconto 10%, prime voci sulle bestie |
| 60‑79 | Uno da non provocare | i clienti deboli non lo sfidano più, sconto 20% |
| 80‑100 | **Il Re del bancone** | posto fisso al bancone, Loredana offre il caffè ogni mattina |

**Come funziona un dialogo con un avventore** (allarga quello che c'è già):
- L'avventore provoca con una battuta. Ogni avventore ha un **Orgoglio** (quanto resiste) e una **Rabbia** (quanto è vicino a menare le mani).
- Garonio sceglie fra: **Rispondi a tono** (toglie Orgoglio, alza la Rabbia), **Ignora** (stress +, niente rabbia), **Offri da bere** (abbassa la Rabbia, costa soldi, serve Parlantina 2), **Provoca** (alza molto la Rabbia, rischioso).
- Orgoglio a 0: l'avventore se ne va umiliato, Garonio guadagna rispetto senza combattere.
- Rabbia a 100: **rissa**. Si passa al combattimento a turni con le armi da bar. Vittoria: rispetto +, soldi «offre il bar». Sconfitta: rispetto −, stress +.
- **Regola di Loredana**: tre risse nella stessa settimana e Garonio non può entrare per due giorni.

**Gli avventori e la loro storia** (ognuno ha tre incontri che vanno in ordine, uno per volta):

| Avventore | Liv. | Tipo | Come va la sua storia |
|---|---|---|---|
| **Sciur Tarcisio** | 1 | ubriaco, si mena male | Se gli offri da bere invece di picchiarlo diventa amico e racconta la leggenda del **Re dei Lupi** (apre il cap. 3 delle bestie). |
| **La Pina** | 2 | solo a parole, non si picchia | Se la batti a parole smette di spargere voci che abbassano il rispetto. Se perdi, il rispetto scende in tutto il paese. Sa dov'è la tana del **Re delle Nutrie**. |
| **Il Geometra Ballarin** | 5 | sfida a quiz e misure, poi rissa debole | Alla fine ti dà la mappa catastale: mostra le tane sulla mappa grande. |
| **Il cugino Ermes** | 7 | rivale | Gara di trattori sulla capezzagna, poi rissa in piazza. Se vinci, ti presta il rimorchio. |
| **Bruno «il Toro»** | 12 | boss del bar | Braccio di ferro, poi rissa vera con due amici. Vincere dà il titolo di **Re del bancone**. |
| **Rocco il camionista** | 15 | forestiero, sfida finale | Arriva quando Garonio è il Re del bancone e vuole prendergli il posto. |

### 18.3 Trama delle bestie: «I re della campagna»

Tre bestie leggendarie, ognuna nella sua stagione. Ogni caccia ha tre passi:
1. **La voce**: al bar (o da Zeno o dalla Mamma) si sente parlare della bestia.
2. **Le tracce**: segni sulla mappa grande (simbolo nella minimappa), da seguire. Gruppi di suoi sottoposti compaiono più spesso.
3. **La tana**: combattimento contro il re e i suoi seguaci, in due fasi.

| | **Re dei Ratti** | **Re delle Nutrie** | **Re dei Lupi** |
|---|---|---|---|
| Stagione | primavera‑estate | estate‑autunno | inverno |
| Livello | min. 6, consigliato 8 | min. 11, consigliato 13 | min. 17, consigliato 19 |
| Voce | Mamma: «In cantina sparisce il salame» | La Pina, o il Consulente | Tarcisio, dopo il terzo bianchino |
| Tracce | sacchi di mangime rosicchiati, maialini spaventati, la grata nei capannoni | argine bucato sotto il ponte, campo di grano allagato | impronte nella neve, un maiale sparito, ululati di notte |
| Tana | sotto il silos (dalla grata dei capannoni) | sotto il ponte del canale (servono gli stivali alti) | radura del bosco (si apre con la roncola o la motosega), di notte |
| Seguaci | ratti, ratti di fogna | nutrie, mamme nutrie, nutrie corazzate | lupi giovani, lupi |
| Fase 1 | chiama 2 ratti ogni 3 turni | si tuffa: un turno senza poter essere colpito | il branco attacca insieme |
| Fase 2 (sotto metà Vita) | si nasconde nel mucchio di grano: serve Urlo o un lancio per stanarlo | «Diga di fango»: si cura se non lo colpisci forte | si alza sotto la luna: ululato che alza lo stress di 15 a turno |
| Trofeo | Corona del Re dei Ratti, 150 XP, 100 € | Pelliccia del Re delle Nutrie, 250 XP, 200 € | Mantello del Re dei Lupi, 400 XP, 300 € |
| Dopo | meno ratti nei capannoni | meno nutrie nei campi | i lupi non attaccano più i maiali |

Vinti i tre re, Garonio diventa **La Leggenda della Bassa** e in paese gli dedicano una targa al bar. Il Gigante non ci crede.

### 18.4 Gruppi di nemici casuali (spawn)

I nemici fuori dalle tane **si vedono sulla mappa**: girano nella loro zona, e se Garonio li tocca parte lo scontro. Si possono evitare, scacciare col clacson (quelli piccoli) o attaccare per primi (il primo turno è di Garonio).

| Zona | Quando | Gruppi possibili |
|---|---|---|
| Campi e canale | di giorno, più all'alba | 1‑3 nutrie; mamma nutria con 2 nutrie |
| Capannoni, silos, cantina | di notte | 2‑4 ratti; ratto di fogna con 2 ratti |
| Pollaio | sera e notte | 1‑2 volpi |
| Ovunque | di giorno | gazza ladra da sola |
| Bosco e mais d'autunno | sempre, più di sera | 1‑2 cinghiali |
| Bosco | inverno, notte e nebbia | 2‑3 lupi giovani; lupo con 2 lupi giovani |

Regole:
- Al massimo **3 gruppi** sulla mappa insieme, uno nuovo ogni 2 ore di gioco circa per zona.
- Si scelgono solo nemici con livello minimo ≤ livello di Garonio. La grandezza del gruppo cresce coi livelli.
- Durante le **tracce** di una bestia, i suoi seguaci compaiono il doppio.
- Sconfitto un re, la sua specie compare la metà e solo in gruppi piccoli.
- Con il cane, quando un gruppo si avvicina a casa o ai capannoni, abbaia.

## 19. Il paese: personaggi, cascine e missioni secondarie

> Versione 0.3. I personaggi nuovi danno vita al paese, missioni secondarie e qualche fregatura.

### 19.1 Il Consulente (al bar)

- **Chi è**: l'amico fidato di Garonio. Sempre allo stesso tavolino del bar, giacca sportiva, cellulare in mano, «consulente» di non si sa bene cosa. Parla come un esperto di tutto. Con Garonio è sincero.
- **Cosa fa**: una volta al giorno, offrendogli un caffè (2 €), dà **un consiglio su cosa trovare in giro**:
  - dove c'è un **oggetto nascosto** oggi (attrezzi persi, soldi caduti, santini, pezzi di ricambio), che compare come punto di domanda sulla minimappa;
  - dove girano **gruppi di nemici** e cosa portano in premio;
  - le **tracce** delle bestie leggendarie, quando la trama ci arriva;
  - un avviso su **Zeno** («Oggi è di luna storta, non farti fare l'elaborazione») o sulla **Vigilessa** («Stamattina è sulla provinciale»).
- **Rapporto**: più consigli segue Garonio, più il Consulente si fida e dà dritte migliori. Livelli di amicizia 1‑5. Al 5 regala il **Telefono del Consulente** (portafortuna: i consigli arrivano per messaggio senza andare al bar).
- **Battute di esempio**: «Garonio, te lo dico da professionista: dietro al fienile c'è roba. Non chiedermi come lo so.» · «Mai fidarsi di un meccanico che fischietta.»

### 19.2 Zeno il meccanico (in officina)

Scorbutico, borbotta sempre, si lamenta dei ricambi e dei clienti. È l'unico che ripara i mezzi, ed **è proprio lui che spesso frega Garonio**. Tutte le regole su riparazioni ed elaborazioni sono nel capitolo 20.

- **Umore di Zeno** (cattivo, normale, buono): cambia ogni giorno e si vede dalla prima battuta. Con l'umore cattivo fa più errori e chiede di più. Il Consulente sa dire com'è.
- **Battute di esempio**: «Cosa le hai fatto a 'sta Vespa, l'hai portata in guerra?» · «Il prezzo è quello. Se non ti va, ripara da solo. Con cosa, con le mani?» · «Garanzia? Sì, fino al cancello.»

### 19.3 Il Bubetto e il suo magazzino

- **Chi è**: un commerciante di paese un po' furbetto, che ha un **magazzino lungo la provinciale** pieno di roba di ogni tipo. Vende tutto e conosce tutti.
- **Cosa vende**:

| Reparto | Cosa | Note |
|---|---|---|
| **Vestiti** | tutto l'equipaggiamento di testa, corpo e piedi (capitolo 15.4) | casco, tuta, stivali, giacche |
| **Armi** | gli attrezzi‑arma (capitolo 15.2) | escono man mano: fino al liv. 7 in primavera, fino al 12 in estate, la motosega in autunno |
| **Manuali** (le «skill») | «Manuale del bravo contadino», «Corso di autodifesa per corrispondenza», «Come rispondere a tono»... | ognuno dà **1 punto abilità** (oppure sblocca un grado di un ramo preciso). Uno nuovo a capitolo, prezzo crescente (80, 150, 250, 400 €) |
| **Oggetti** | trappole, pomate, cibo | prezzi più bassi del bar, ma niente caffè |
| **Usato** | oggetti rari a rotazione, ogni lunedì | a volte sono roba rubata dalle cascine vicine... |

- **Missioni secondarie del Bubetto**: si prendono dalla lavagna del magazzino, una alla volta, e pagano in soldi, sconti o oggetti. Esempi da definire meglio più avanti:
  - **Caccia**: «Abbatti 10 piccioni sul silos» · «Porta 5 code di ratto».
  - **Consegne**: «Porta questo pacco al Postino, ma senza che lo veda la moglie».
  - **Raccolta**: «Trovami 3 pezzi di ferro vecchio nei fossi».
  - **Favori**: «Vai a ritirare i soldi che mi deve Mister Frank».
- **Fiducia del Bubetto**: sale con le missioni fatte. Più è alta, più sconti e più roba nel reparto «usato».

### 19.4 La Vigilessa

- **Chi è**: la vigilessa del paese, inflessibile, taccuino sempre in mano. Non si corrompe (o quasi).
- **Dove**: gira a piedi in paese e ogni tanto in macchinina sulla provinciale. Ha un **cono di vista** come le guardie dei giochi stealth, segnato a terra.
- **Multe**: se vede Garonio fare una di queste cose, lo ferma e gli dà la multa:

| Infrazione | Multa |
|---|---|
| Urtare un oggetto, un muro o un mezzo parcheggiato | 10‑40 € secondo il danno |
| Andare in Vespa senza casco | 25 € |
| Trattore sulla provinciale con l'attrezzo abbassato | 30 € |
| Correre in paese (piazza e vie) | 15 € |
| Farsi vedere durante una missione truffaldina | 50 € e la notizia arriva al bar (rispetto −) |

- **Regole**:
  - le multe si pagano al municipio entro 3 giorni, altrimenti **raddoppiano**;
  - con 3 multe non pagate la Vigilessa **sequestra la Vespa o la Punto** per un giorno;
  - con Parlantina 2 si può provare a convincerla («Era un piccione, l'ho schivato!»): riesce una volta su tre, se va male la multa raddoppia.
- **Battute di esempio**: «Garonio. Di nuovo. Patente e libretto. Anche della zappa.» · «Il paracarro era lì da prima di te.»

### 19.5 Le cascine dei vicini

Tre cascine nuove sulla mappa, accanto ai campi dei vicini che ci sono già. Ogni vicino ha un carattere, delle battute per Garonio, qualcosa da vendere o scambiare, e i suoi campi sono il bersaglio delle missioni truffaldine del Gigante.

| Cascina | Dove (sulla mappa di oggi) | Il vicino | Carattere e battute | Cosa offre |
|---|---|---|---|---|
| **Cascina del Patata** | il campo arato in mezzo, tra il campo di mais e il ponte | **il Patata**, grosso, lento, buono | Parla solo di patate e di sua mamma. «Garonio, sai cosa ci vuole per essere felici? Una patata. Bollita. Basta.» · «Tuo papà mi ha chiesto in prestito la turbina. Nel 2009. La sto ancora aspettando.» | Patate (cibo che toglie fatica), scambio di sementi, presta attrezzi se ti è amico |
| **Cascina del Postino** | il campo di grano a ovest, vicino alla Via del Mulino | **il Postino**, sa tutto di tutti, pettegolo come la Pina | Ti legge le lettere degli altri. «C'è una lettera per te. Ah no, era di tuo padre. Dice che sei pigro. L'ho letta per sbaglio. Tre volte.» · «Con la Pina? Ma chi l'ha detto? ...Chi l'ha detto?» | Consegne a pagamento, voci (come il Consulente ma meno affidabili), pacchi del Bubetto |
| **Ranch di Mister Frank** | il campo di grano a est, oltre la Strada dell'argine | **Mister Frank**, emiliano che si crede americano: cappello da cowboy, pick‑up, chiama il trattore «my horse» | «Hey boy! Qui siamo in Texas della Bassa!» · «Il mio pozzo è il più profondo della county. Non toccarlo, eh!» · «Tuo papà? Good man. Ladro, ma good man.» | Il pozzo più grande (bersaglio dell'acqua rubata), sfide di rodeo col trattore, compra il mais a prezzo alto |

Ogni vicino ha un'**amicizia** (−50…+50). Sale facendo favori, comprando, scherzando bene. Scende quando ti becca nelle missioni truffaldine. Con amicizia alta: prezzi migliori, attrezzi in prestito, aiuto nei raccolti. Con amicizia bassa: ti chiude il cancello, chiama la Vigilessa, ti aspetta col forcone.

### 19.6 Le missioni truffaldine del Gigante

Ogni tanto, al posto della missione normale o in più, il Gigante abbassa la voce e assegna una **missione truffaldina** contro i vicini. Pagano molto di più ma sono rischiose.

| Missione | Come si fa | Contro chi | Paga |
|---|---|---|---|
| **Ruba l'acqua** | Di notte porti il trattore con la **turbina** sul fosso o sul pozzo del vicino e la attacchi per irrigare il tuo campo. Serve restare lì un'ora di gioco senza farsi vedere. | Mister Frank (pozzo), il Patata (fosso) | 60‑90 € |
| **Abbatti gli alberi** | Abbatti gli alberi sul confine dei campi degli altri, così il campo del Gigante si allarga. Si fa con la **motosega del Gigante**, che te la presta solo per questa missione. Fa rumore: più alberi tagli, più alto il rischio. | tutti e tre | 40 € ad albero |
| **Sposta il confine** | Di notte sposti i paletti del confine di qualche metro. | il Postino | 50 € |
| **Prendi in prestito** | «Prendi» un attrezzo dalla cascina del vicino e portalo nella nostra tettoia. | il Patata | 70 € + l'attrezzo |

**Come funziona il rischio**:
- Ogni cascina ha il **vicino** e a volte un **cane** con un cono di vista e un raggio di udito. Il rumore del trattore e della motosega allarga il raggio.
- Di notte e con la nebbia si vede meno. Con il ramo Furbizia si fa meno rumore.
- Se ti beccano: il vicino ti scopre e parte un **dialogo** (puoi scusarti, inventare una scusa, scappare) che può finire in **rissa** col vicino e i suoi garzoni. L'amicizia col vicino crolla e, se c'è la Vigilessa in giro, arriva anche la multa.
- Il Gigante, se la missione riesce: «Non abbiamo visto niente, vero?». Se fallisce: Mister Mountain, ma la colpa resta tua.

## 20. Mezzi: attrezzi dei trattori, riparazioni ed elaborazioni

### 20.1 Il lavoro nei campi si fa coi trattori

Nei campi grandi (mais, grano, campi dei vicini) **Garonio non lavora più a mani nude**: ara, semina, raccoglie e irriga con i trattori e i loro attrezzi. A mano restano solo l'**orto** e i lavori piccoli (uova, maiali, rastrello nell'orto). Come oggi, il trattore lavora le zolle dove passa, ma ora fa quello che dice l'attrezzo agganciato.

| Attrezzo | Lavoro | Si aggancia a | Prezzo | Note |
|---|---|---|---|---|
| **Aratro** | ara le zolle (oggi il trattore lo fa già da solo) | trattore rosso o verde | di partenza | upgrade «largo»: 3 zolle insieme (200 €) |
| **Seminatrice** | semina le zolle arate | trattore rosso o verde | 150 € (il Gigante la dà nella prima missione) | consuma sacchi di semente da comprare dal Bubetto |
| **Falciatrice** (o trebbia) | raccoglie mais e grano maturi | trattore verde (il più forte) | 300 € | upgrade «rimorchio»: il raccolto va dritto nel fienile |
| **Turbina per irrigare** | irriga un'area intorno al trattore, se è vicino all'acqua (canale, laghetto, fosso, pozzo) | trattore rosso | 250 € | serve anche per le missioni truffaldine |

- L'attrezzo si **aggancia sotto la tettoia** vicino all'officina, uno per volta (si vede sullo sprite del trattore).
- Gli attrezzi hanno uno **stato** come i mezzi. Si rovinano quando urti con l'attrezzo giù o lavori su terra sassosa, e si riparano da Zeno.
- I trattori consumano **gasolio** (tanica in officina): finito il gasolio si fermano in mezzo al campo.

### 20.2 Riparazioni solo a pagamento

Nel gioco di oggi le riparazioni costano già in base al danno e i mezzi non si aggiustano da soli. Questa regola resta e diventa più chiara: **niente si ripara da solo**, si paga sempre Zeno.

| Stato del mezzo | Cosa succede guidando | Costo indicativo (Vespa / Punto / Trattore) |
|---|---|---|
| 100‑75% · **graffi** | niente | 5 / 8 / 15 € |
| 74‑40% · **ammaccato** | più lento del 15% | 10 / 15 / 30 € |
| 39‑1% · **messo male** | più lento del 30%, si spegne più spesso, il trattore lavora peggio | 15 / 20 / 45 € |
| 0% · **rotto** | non va; bisogna pagare Zeno perché venga a prenderlo (traino 10 €) | 25 / 35 / 70 € |

Il prezzo esatto è proporzionale ai punti di danno, come adesso. Il tempo di riparazione cresce col danno.

### 20.3 Zeno ti frega

Ogni lavoro di Zeno ha una piccola probabilità di andare storto. Dipende dal suo umore del giorno (19.2):

| Fregatura | Probabilità (umore buono / normale / cattivo) | Effetto |
|---|---|---|
| **Sovrapprezzo** | 5% / 15% / 30% | a lavoro finito chiede il 50% in più («Eh, c'era anche la guarnizione») |
| **Lavoro a metà** | 5% / 10% / 20% | il mezzo torna all'80% invece che al 100% |
| **Pezzo di ricambio «usato»** | 0% / 5% / 10% | dopo 2 giorni il mezzo perde di nuovo il 20% |

Si può ridurre il rischio: seguendo i consigli del Consulente, col ramo Parlantina (si contratta) o pagando la **«fattura»** (+20% sul prezzo, ma niente fregature).

### 20.4 Elaborazioni di Vespa e Punto

Garonio può far elaborare la Vespa o la Punto da Zeno. Ogni elaborazione ha una **probabilità di riuscita**. Se va male, Zeno **si tiene i soldi** e il mezzo **si rompe di più** («Eh, capita»).

| Mezzo | Elaborazione | Se riesce | Riuscita | Se va male | Prezzo |
|---|---|---|---|---|---|
| Vespa | **Marmitta sportiva** | +20% velocità, fa rumore (le nutrie scappano, la Vigilessa ti sente) | 70% | stato −30%, si spegne il doppio per 3 giorni | 80 € |
| Vespa | **Motore revisionato** | non si spegne più in corsa | 60% | stato −40%, una volta su due non parte per 2 giorni | 120 € |
| Vespa | **Cilindro maggiorato** | +35% velocità | 45% | Vespa **rotta** | 200 € |
| Punto | **Gomme nuove** | non fora più | 90% | ne ha montate di usate: fora come prima | 80 € |
| Punto | **Serbatoio grande** | benzina doppia | 75% | perde benzina: consuma il doppio | 60 € |
| Punto | **Assetto ribassato** | curve più strette, +10% velocità | 55% | stato −35%, gratta su ogni sterrato | 150 € |
| Punto | **Impianto stereo** | stress −2 all'ora mentre guidi, suona la colonna sonora a volume alto | 80% | la batteria si scarica: una volta su tre non parte | 100 € |

L'umore di Zeno sposta la riuscita di ±15%. Un'elaborazione andata male si può riprovare pagando di nuovo, dopo aver pagato la riparazione.

### 20.5 Easter egg: la cabina della corrente

Lungo una strada sterrata fuori mano c'è una **cabina elettrica** grigia, col cartello «Pericolo di morte» e un teschio. Non serve a niente. O quasi.

- Se Garonio ci si **schianta con la Punto** (o con la Vespa) sopra una certa velocità, il mezzo è **distrutto del tutto** (stato 0%, rotto), lampi e scintille, lo schermo diventa bianco per un attimo e Garonio esce dalle lamiere coi capelli dritti (Vita −20).
- Dalla cabina sbuffata esce **un bottino**, con queste probabilità:

| Probabilità | Cosa esce |
|---|---|
| 60% | niente, solo il conto di Zeno e una multa della Vigilessa se è nei paraggi |
| 30% | soldi (20‑80 €) e oggetti comuni |
| 10% | **bottino leggendario** (uno a caso tra quelli non ancora trovati) |

**Bottino leggendario** (unico, non si compra da nessuna parte):

| Oggetto | Tipo | Effetto |
|---|---|---|
| **Zappa folgorata** | arma | attacco +12, la mossa «Scossa» colpisce tutti e stordisce |
| **Casco di Nonno Fulmine** | testa | difesa +5, cadute dalla Vespa senza danni, la Vigilessa non ti vede |
| **Tuta isolante del tecnico** | corpo | difesa +7, immune alle scosse e alla pioggia |
| **Stivali a 380 volt** | piedi | velocità +35% |
| **Fusibile fortunato** | portafortuna | una volta al giorno, a Vita 0 si rialza col 50% |

- La cabina si «ricarica» dopo 3 giorni (ronzio e lucina rossa): prima, schiantarsi rompe solo il mezzo.
- Nessuno spiega niente: lo si scopre per caso, o da una battuta del Consulente («Mio cugino ha preso in pieno la cabina della corrente e ha trovato... no, lascia stare.»).

## 21. Come dividere il lavoro di sviluppo

Proposta: **un lavoro di base, poi gli altri in parallelo**. Ogni lavoro tocca file diversi, così non si pestano i piedi. Il lavoro su grafica e fluidità è finito, quindi anche gli interni possono partire.

| # | Lavoro | Cosa fa | File principali | Dipende da |
|---|---|---|---|---|
| **0** | **Base della progressione e dei personaggi** (prima di tutti, breve) | Dati di livelli, punti abilità, armi, equipaggiamento, oggetti e nemici in file di dati; un sistema unico per i **PNG** (dove stanno, orari, battute, amicizia) e per le **missioni secondarie**; salvataggio con i campi nuovi | `src/data/progressione.js`, `src/data/armi.js`, `src/data/nemici.js`, `src/data/png.js`, `src/png.js`, salvataggio in `game.js` | niente |
| **A** | **Interni degli edifici** | Le stanze di casa, officina, capannoni, bar e magazzino del Bubetto, con i personaggi dentro | `src/interni.js`, `src/data/interni.js` | lavoro 0 |
| **B** | **Armi, abilità e negozio del Bubetto** | Menu abilità e armadio, magazzino del Bubetto (vestiti, armi, manuali), mosse nuove nel combattimento | `src/combat.js` (mosse), `src/progressione.js`, `src/negozio.js` | lavoro 0 |
| **C** | **Trama dell'annata e attrezzi dei trattori** | Stagioni, obiettivi, maiali veri, fiducia del Gigante; aratro, seminatrice, falciatrice e turbina, gasolio | `src/stagioni.js`, `src/maiali.js`, `src/attrezzi.js`, `src/data/missioni.js` | lavoro 0 |
| **D** | **Trama del bar e Consulente** | Rispetto, Orgoglio e Rabbia, storie degli avventori, risse; il Consulente coi consigli e gli oggetti nascosti sulla mappa | `src/data/dialoghi.js`, `src/bar.js`, `src/consulente.js` | lavoro 0 |
| **E** | **Bestie leggendarie e spawn** | Nemici nuovi, gruppi visibili sulla mappa, tracce, tane e re | `src/spawn.js`, `src/data/bestie.js`, sprite in `src/combat.js` | lavoro 0; le tane usano gli interni (A) |
| **F** | **Zeno, la Vigilessa e la cabina** | Riparazioni a fasce, fregature di Zeno, elaborazioni che possono andare male; la Vigilessa che gira, il cono di vista, le multe e il sequestro; la cabina della corrente con il bottino leggendario | `src/vehicles.js` (officina), `src/vigilessa.js`, `src/data/officina.js` | lavoro 0 |
| **G** | **Cascine e missioni truffaldine** | Le tre cascine sulla mappa coi vicini e le battute, amicizia, missioni del Gigante contro i vicini con rischio di farsi beccare | `src/map.js` (cascine), `src/cascine.js`, `src/data/vicini.js` | lavoro 0; la turbina viene da C, la Vigilessa da F (si può partire con dei segnaposto) |

### 21.1 La base è pronta: come agganciarsi

Il lavoro 0 è fatto. Ogni lavoro parallelo usa questi pezzi **senza riscriverli**:

| Pezzo | File | Cosa offre |
|---|---|---|
| **Eventi** | `src/eventi.js` | `game.on(nome, fn)` e `game.emit(nome, dati)`. L'elenco degli eventi già mandati è in cima al file; ogni lavoro può aggiungerne e li scrive lì. |
| **Progressione** | `src/progressione.js` (`game.prog`), dati in `src/data/progressione.js` e `src/data/armi.js` | livelli fino al 20, punti abilità, `prog.bonus('chiave')`, `atk()`, `def()`, `maxHealth()`, armi (`daiArma`, `impugna`), vestiti (`daiVestito`, `indossa`), zaino (`dai`, `togliOggetto`, `ha`). Il combattimento usa già `atk()` e `def()`. |
| **Nemici per livello** | `src/data/nemici.js` | `puoComparire(id, livello)` e `nemiciDisponibili(zona, livello)`. I nemici nuovi vanno aggiunti con sprite e mosse in `ENEMIES` di `src/combat.js`. |
| **Personaggi (PNG)** | `src/png.js` (`game.png`), dati in `src/data/png.js` | compaiono sulla mappa secondo l'ora, camminano lungo un giro, si parla con E, amicizia. Per aggiungere scelte a un personaggio: `game.png.aggiungiScelte('zeno', ctx => [{ label, fn }])`. Per un dialogo tutto suo: `sostituisciDialogo`. |
| **Missioni secondarie** | `src/secondarie.js` (`game.quests`), dati in `src/data/secondarie.js` | offerta, accettazione, progressi dagli eventi, consegne, premi, scadenze, fumetto «!» sopra chi ha qualcosa. Missioni generate da codice: `game.quests.aggiungi(id, def)`. Il campo `truffaldina: true` segna quelle del Gigante. |
| **Menu di Garonio** | `src/menu.js` (tasto **J** o 📓) | scheda, abilità, arma ed equipaggiamento, zaino, diario delle missioni. |
| **Salvataggio** | `game.js` → `fresh()` | campi nuovi: `prog`, `png`, `quests`, `flags` (libero per i lavori: `s.flags.nomeLavoro = {...}`), `maxHealth`. I salvataggi vecchi vengono sistemati da soli. |

Per provare dal browser: la console ha `garonio` (il gioco), per esempio `garonio.prog.addXp(200)` o `garonio.quests.accetta('bubetto_nutrie')`.

Ordine consigliato: **0 fatto**, poi **A, B, C, D, F in parallelo**; **E** e **G** appena A, C e F hanno le prime versioni.

**Più avanti (dopo questi lavori)**: ritratti dei personaggi in **PNG** disegnati a mano, da usare nei dialoghi al posto dei ritratti generati dal codice, e **dialoghi di vita quotidiana** («slice of life»): chiacchiere con la Mamma, il Gigante, Zeno, il Consulente, i vicini e gli avventori che non fanno parte delle missioni ma raccontano il paese e i personaggi.

Sprite nuovi da fare: Mamma, Zeno, il Consulente, il Bubetto, la Vigilessa (a piedi e in macchinina), il Patata, il Postino, Mister Frank, Rocco il camionista; ratto, ratto di fogna, gazza, piccione, nutria corazzata, lupo giovane, lupo, cinghiale maschio, i tre re; armi in mano a Garonio; aratro, seminatrice, falciatrice e turbina agganciati ai trattori; tre cascine e il magazzino del Bubetto; gli interni.

## 22. Altre idee da valutare

- **Diario di Garonio**: un elenco unico di missioni del Gigante, truffaldine, del Bubetto e delle bestie, con la freccia sulla minimappa verso quella scelta.
- ✅ **Il telefonino a conchiglia** (fatto: `src/telefono.js`, dati in `src/data/telefono.js`, tasto **T** o 📱): il Gigante chiama per sollecitare la missione vicino alla scadenza e per dare lavoretti lampo (pagati con una telefonata) o le truffe; Mister Mountain chiama a sorpresa ogni 2‑3 giorni (stress, richiama se lo rifiuti); SMS di Mamma, Bubetto, Gigante e Consulente (dritta del mattino dal livello 5 di amicizia); rubrica, registro chiamate, suonerie e modalità silenziosa.
- **Reputazione in paese**: oltre al Rispetto al bar, un valore unico che sale coi favori e scende con multe e truffe scoperte. Con reputazione bassa i prezzi salgono ovunque.
- **Mercato del giovedì in piazza** (fatto: `src/mercato.js`): si vendono uova, ortaggi, mais e salami a prezzi che cambiano ogni settimana (la TV di casa li anticipa), si tratta coi venditori.
- **Collezionabili**: tappi di birra, santini e figurine nascosti nei fossi, che il Consulente aiuta a trovare. Completare una collezione dà un portafortuna.
- **Viaggio rapido coi mezzi**: con la Punto, scelta di destinazione dalla mappa grande (costa benzina e tempo, ma niente guida).
- **Scommesse al bar** (fatto: `src/scommesse.js`, con le **gare di trattori** guidate davvero in `src/gare.js`): il Consulente organizza scommesse sulle risse e sulle gare col trattore di Ermes e Mister Frank.
