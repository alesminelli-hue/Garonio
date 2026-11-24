# Sprite HD

Nuova pixel art disegnata via codice per terreno, mezzi, edifici e oggetti, nello stile dei fogli personaggi
(contorno scuro, luce da in alto a sinistra, ombre che virano al viola).

- `kit.js` colori, penna, contorno, carattere pixel 3x5
- `terreno.js` caselle 16x16 ripetibili
- `oggetti.js` alberi, colture, roba di campagna, arredo del paese
- `mezzi.js` Vespa, Punto, trattori (3 viste), attrezzi, traffico
- `animali.js` nutrie: nutria, Mamma Nutria, nutria corazzata, Re delle Nutrie (2 fotogrammi)
- `collezionabili.js` tappi, santini e figurine del diario (un disegno per pezzo)
- `edifici.js` tutti gli edifici di `src/map.js`, stesse larghezze
- `scena.js` prova d'insieme

Per rigenerare i fogli PNG:

    python3 -m http.server 8765 &
    node tools/sprite_hd/esporta.mjs <cartella-uscita> [sezione]

Oppure apri `http://localhost:8765/tools/sprite_hd/anteprima.html` nel browser.
