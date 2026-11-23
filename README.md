# Garonio

Survival gestionale con elementi da JRPG, in pixel art semi‑3D, che gira nel browser.
Garonio, figlio pigro del titolare di un'azienda agricola, deve sopravvivere alle missioni del padre (**il Gigante**), alle nutrie e alle sfuriate di **Mister Mountain**.

Il design completo è in [GDD.md](GDD.md).

## Come si gioca

- **Frecce / WASD**: muoversi · **Shift**: correre · **E / Spazio / Invio**: agire · **J**: menu di Garonio (abilità, equipaggiamento, zaino, diario) · **M**: musica on/off · **T**: telefonino a conchiglia (T risponde, X rifiuta)
- Su telefono: appoggia il pollice sulla metà sinistra dello schermo e compare la levetta (spinta fino in fondo = corsa); pulsante **E** a destra per agire, **Q** per saltare. Un tocco a sinistra fa anche avanzare i dialoghi. Si gioca sia in verticale sia in orizzontale.
- Ogni mattina il Gigante ti dà una missione con scadenza. Se fallisci arriva Mister Mountain.
- Lavorare alza **stanchezza** e **stress**. Il **bar** abbassa lo stress, la **casa** fa dormire (dopo le 20:00) o fare un pisolino.
- Se resti fermo qualche secondo Garonio si appisola: recupera stanchezza, ma se il Gigante è vicino ti becca.
- Campo (mais) e orto (pomodori): zappa, semina, annaffia ogni giorno, raccogli. Vendi tutto alla cassa di legno vicino a casa.
- Pollaio: raccogli le uova, dai da mangiare alle galline alla mangiatoia per averne di più.
- Le nutrie escono dal canale e mangiano le piante del campo: avvicinati e affrontale in uno scontro a turni (Attacca, Abilità, Oggetti, Difendi, Fuggi). Con lo stress sopra 60 si sblocca **Rabbia Incontrollata**.
- Officina: attrezzi che rendono il lavoro meno faticoso.
- **Mezzi**: avvicinati alla Vespa, alla Punto o ai trattori e premi **E** per salire o scendere. Si guida con frecce/WASD o con la levetta, **Q** (o il pulsante 📯 sul telefono) suona il clacson.
  - La Vespa blu è veloce ma ogni tanto non parte o si spegne. La Punto bianca consuma benzina e può forare.
  - I trattori arano da soli le zolle del campo dove passano e spaventano le nutrie, ma con gli urti o guidando troppo stanco si rompono: arriva Mister Mountain.
  - Le riparazioni le fa solo **Zeno** (in officina, dalle 7 alle 19), a pagamento e a fasce di danno: graffi, ammaccato (−15% velocità), messo male (−30%), rotto (serve il traino se è lontano). Ogni giorno ha un umore diverso e può fregarti: sovrapprezzo, lavoro a metà, pezzo «usato» che cede dopo 2 giorni. Con la **fattura** (+20%) niente fregature; la Parlantina riduce il rischio.
  - **Elaborazioni** di Vespa e Punto (marmitta, motore, cilindro, gomme, serbatoio, assetto, stereo): possono riuscire o andare male, e Zeno si tiene i soldi.
  - **La Vigilessa** gira in piazza col suo cono di vista giallo a terra (diventa rosso quando ti vede). Multa gli urti, la Vespa senza casco e chi corre in paese. Le multe si pagano a lei o al **municipio** entro 3 giorni, poi raddoppiano; con 3 multe non pagate mette la ganascia alla Vespa o alla Punto per un giorno. Con Parlantina 2 si può provare «Era un piccione, l'ho schivato!».
  - C'è un segreto in fondo alla capezzagna. Non lo diciamo. (Il Consulente forse sì.)
  - Anteprima di tutti gli sprite dei mezzi: `tools/anteprima_mezzi.html`.
- **Personaggi del paese**: la Mamma, il Consulente, Zeno, il Bubetto, la Vigilessa, il Patata, il Postino e Mister Frank. Avvicinati e premi **E** per parlarci. Chi ha un fumetto «!» ha una missione secondaria da darti o da ritirare.
- **Cascine dei vicini**: la Cascina del Patata, la Cascina del Postino e il Ranch di Mister Frank stanno a sud della capezzagna, accanto ai loro campi. I vicini fanno battute quando passi, il Patata vende patate (e una bollita al giorno è gratis), il Postino vende voci di paese (alcune vere e utili per le truffe), Frank compra il mais a 14 €. Ogni cascina ha un cane (accarezzalo: per quel giorno non abbaia contro di te) e, di giorno, a volte un garzone.
- **Missioni truffaldine del Gigante**: parlando col Gigante scegli 🤫 «Hai qualche lavoretto... speciale?». Rubare l'acqua col trattore rosso e la turbina, abbattere alberi con la motosega prestata, spostare i paletti del confine, «prendere in prestito» l'erpice. Durante la truffa vedi i coni di vista (giallo → rosso) e i cerchi d'udito di vicino, cane e garzone, più le barre di sospetto e rumore. Di notte (dopo le 20) vedono meno ma sentono tutto. Se ti beccano: scuse, bugia (Parlantina), fuga o rissa. Il ramo Furbizia fa meno rumore.
- **Il paese è vivo**: i paesani (la Sciura Ines, il Bepi, il Gino del tabacchi, la Giusy, il Moreno, il veterinario, l'Ornella col barboncino, il Walter) girano per il paese di giorno e la sera tornano a casa. Sulla provinciale passano auto, Ape e il camion del latte (di più all'ora di punta, di notte coi fari): se Garonio sta in mezzo frenano e suonano (stress), se le tamponi coi mezzi è un urto vero. Gatti da accarezzare (stress −3, a volte graffiano), corvi che volano via, anatre sul laghetto, lucciole nelle notti d'estate, lampioni che si accendono al tramonto.
- **Imprevisti** che alzano lo stress: **buche** sulle strade (rovinano Vespa, Punto e trattori: poi paghi Zeno; la Punto può forare), **pozzanghere** nei giorni di pioggia (calzini bagnati, la Vespa scoda, le auto ti fanno la doccia), **cantieri** con transenne, operai e umarell, il **cane randagio** che ti insegue (scappa correndo, scaccialo, lanciagli un uovo o affrontalo), i **paesani impiccioni** che attaccano bottone e le **zanzare** la sera vicino all'acqua.
- **Night Paradiso** (accanto al paese, aperto dalle 20): il catalogo, con descrizioni ironiche. Più spendi, più scende lo stress e più esperienza prendi. Una sera sola al giorno. Occhio al **tranvione**: a volte va male e perdi tutti i soldi, il rispetto al bar e la reputazione in paese.
- Per provare dalla console: `garonio.imprevisti.prova('cane' | 'buca' | 'pozze' | 'cantiere' | 'impiccione')`.
- **Livelli e abilità**: a ogni livello (fino al 20) guadagni un punto abilità da spendere nel menu (**J**) in uno dei sette rami.
- Il gioco si salva da solo nel browser.

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
| `intro` | **Il Conte della Bassa** | Schermata del titolo e prologo |
| `base` / `notte` | **A rotazione:** Sunset Truciolone, Palestra Delirio, Il Conte della Bassa, Boborriello Re della Notte (di sera parte Boborriello) | Gioco libero, giorno e sera: a fine traccia parte la successiva |
| `bar` | **Pappa Garonio** | Al bar |
| `rabbia` | **Canaglia (Rabbia Incontrollata)** | Garonio si arrabbia: stress oltre 85, litigi al bar |
| `guida` | **Canaglia (Rabbia Incontrollata)** | Alla guida di Vespa, Punto o trattore |
| `nemico` | **Mister Scarogna** | Appare un nemico: Mister Mountain, nutrie all'attacco |
| `combattimento` | **Rabbia Incontrollata** | Scontro a turni |

Nel codice si usa sempre e solo `audio.setScene('nome-scena')` (elenco in `src/audio.js`, `MUSIC_SCENES`).

Per aggiungere una traccia: copia il file `.mp3` nella cartella e scrivi il suo nome nella lista della scena. Se una lista è vuota suona una musichetta 8‑bit di riserva.

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
| `src/vita.js`, `src/imprevisti.js`, `src/paradiso.js` | Mondo vivo: paesani, traffico, animali, luci; buche, pozzanghere, cantieri, randagio, impiccioni, zanzare; Night Paradiso. Testi in `src/data/vita.js`, sprite in `src/sprite_vita.js` |
| `src/pixel.js` | Grafica segnaposto disegnata via codice (verrà sostituita dagli sprite veri) |
| `src/audio.js` | Musica ed effetti sonori |
| `lib/three.module.min.js` | Three.js 0.170 (licenza MIT, `lib/THREE-LICENSE`) |

## Grafica

Lo stile è "HD-2D": la pixel art resta nitida, ma il mondo è disegnato alla risoluzione piena dello schermo, con luce che cambia con l'ora (sole che si sposta, ombre lunghe all'alba e al tramonto), foschia in lontananza e bordi dello schermo leggermente sfocati.
Se il telefono fatica (meno di 30 fotogrammi al secondo), il gioco spegne da solo ombre e sfocature. Per forzare la qualità piena aggiungi `?qualita=alta` all'indirizzo.
