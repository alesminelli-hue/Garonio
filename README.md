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
- Le nutrie escono dal canale e mangiano le piante del campo: avvicinati e affrontale in uno scontro a turni (Attacca, Abilità, Oggetti, Difendi, Fuggi). Con lo stress sopra 60 si sblocca **Rabbia Incontrollata**.
- Officina: attrezzi che rendono il lavoro meno faticoso.
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
| `base` / `notte` | **Sunset Truciolone** | Giornata in azienda e sera |
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
| `src/pixel.js` | Grafica segnaposto disegnata via codice (verrà sostituita dagli sprite veri) |
| `src/audio.js` | Musica ed effetti sonori |
| `lib/three.module.min.js` | Three.js 0.170 (licenza MIT, `lib/THREE-LICENSE`) |
