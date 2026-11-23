# Garonio

Survival gestionale con elementi da JRPG, in pixel art semi‑3D, che gira nel browser.
Garonio, figlio pigro del titolare di un'azienda agricola, deve sopravvivere alle missioni del padre (**il Gigante**), alle nutrie e alle sfuriate di **Mister Mountain**.

Il design completo è in [GDD.md](GDD.md).

## Come si gioca

- **Frecce / WASD**: muoversi · **Shift**: correre · **E / Spazio / Invio**: agire · **M**: musica on/off
- Su telefono: levetta a sinistra, pulsante **E** a destra.
- Ogni mattina il Gigante ti dà una missione con scadenza. Se fallisci arriva Mister Mountain.
- Lavorare alza **stanchezza** e **stress**. Il **bar** abbassa lo stress, la **casa** fa dormire (dopo le 20:00) o fare un pisolino.
- Se resti fermo qualche secondo Garonio si appisola: recupera stanchezza, ma se il Gigante è vicino ti becca.
- Campo (mais) e orto (pomodori): zappa, semina, annaffia ogni giorno, raccogli. Vendi tutto alla cassa di legno vicino a casa.
- Pollaio: raccogli le uova, dai da mangiare alle galline alla mangiatoia per averne di più.
- Le nutrie escono dal canale e mangiano le piante del campo: avvicinati e scacciale.
- Officina: attrezzi che rendono il lavoro meno faticoso.
- **Mezzi**: avvicinati alla Vespa, alla Punto o ai trattori e premi **E** per salire o scendere. Si guida con frecce/WASD o con la levetta, **Q** (o il pulsante 📯 sul telefono) suona il clacson.
  - La Vespa blu è veloce ma ogni tanto non parte o si spegne. La Punto bianca consuma benzina e può forare.
  - I trattori arano da soli le zolle del campo dove passano e spaventano le nutrie, ma con gli urti o guidando troppo stanco si rompono: arriva Mister Mountain.
  - In officina si riparano i mezzi, si cambia la gomma e si fa il pieno.
  - Anteprima di tutti gli sprite dei mezzi: `tools/anteprima_mezzi.html`.
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

| Scena | Traccia |
|---|---|
| `base` e `notte` | Sunset Truciolone |
| `bar` e `nutrie` | Rabbia Incontrollata |
| `mister_mountain` | Mister Scarogna |

Per aggiungere una traccia: copia il file `.mp3` nella cartella e scrivi il suo nome nella lista della scena. Se una lista è vuota suona una musichetta 8‑bit di riserva.

## Struttura

| File | Cosa contiene |
|---|---|
| `index.html`, `style.css` | Pagina, interfaccia, dialoghi |
| `src/main.js` | Avvio, camera, comandi tastiera e touch |
| `src/game.js` | Regole: tempo, barre, missioni, nutrie, Mister Mountain, bar, officina. In cima c'è `CONFIG` per bilanciare velocità e valori |
| `src/world.js` | Mappa, edifici, terreno |
| `src/pixel.js` | Grafica segnaposto disegnata via codice (verrà sostituita dagli sprite veri) |
| `src/audio.js` | Musica ed effetti sonori |
| `lib/three.module.min.js` | Three.js 0.170 (licenza MIT, `lib/THREE-LICENSE`) |
