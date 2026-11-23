# Garonio — Documento di Game Design (pilot)

> Versione 0.1 · documento vivo: lo approfondiremo pezzo per pezzo.

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
| **Nutrie e altri animali** | Nemici dei campi: mangiano il raccolto. Più avanti: volpi per le galline, cinghiali, ladri di attrezzi. |

## 5. Le tre barre di Garonio

| Barra | Sale quando… | Scende quando… | Se arriva al limite |
|---|---|---|---|
| **Vita** (0‑100) | Mangia, dorme bene, cure | Stress al massimo, scontri con animali, incidenti | A 0 Garonio sviene: perde la giornata e una parte dei soldi |
| **Stanchezza** (0‑100) | Ogni lavoro (zappare, raccogliere, scacciare nutrie, correre) | Dormire a casa, pisolini, caffè al bar | A 100 crolla addormentato dove si trova e passano ore |
| **Stress** (0‑100) | Rimproveri di Mister Mountain, missioni fallite, lavorare troppo, clienti molesti al bar | Bar (mangiare), dormire, serate di svago, tempo libero | A 100 perde Vita ogni ora e lavora peggio |

Regola chiave: **lavorare stanca e stressa, riposare costa tempo**. Il giocatore deve trovare l'equilibrio fra fare abbastanza per il Gigante e non crollare.

## 6. Ciclo di gioco

### La giornata
- 06:00 sveglia a casa. Il Gigante assegna **la missione del giorno** (con scadenza).
- Il giocatore lavora tra orto, galline, campi, maiali e officina.
- Può andare al bar o a riposare quando vuole, ma il tempo scorre.
- Alla scadenza: missione riuscita → soldi ed esperienza. Missione fallita → **arriva Mister Mountain** (stress molto alto).
- 22:00 in poi: a casa a dormire, oppure uscita serale (bar, svago).

### Ciclo lungo
- Soldi → attrezzi e mezzi in officina, abilità, animali nuovi, campi più grandi.
- Esperienza → livelli → abilità (meno stanchezza per lavoro, più resistenza allo stress, colpi più efficaci contro le nutrie).
- Le stagioni cambiano colture, nemici ed eventi.

## 7. Mappa (piccola e raccolta)

```
            [ CAMPI ]  ← nutrie
               |
[ BAR ] —— strada —— [ CASA ] — [ OFFICINA ]
                         |
                 [ ORTO ] [ POLLAIO ]
                         |
                 [ CAPANNONI MAIALI ]
```

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

## 9. Nemici e combattimento (stile JRPG leggero)

- Nel prototipo: le nutrie entrano nel campo e mangiano le piante; Garonio le scaccia avvicinandosi e premendo il tasto azione (costa stanchezza).
- Più avanti: piccoli scontri a turni o in tempo reale semplice, con attrezzi come "armi" (forcone, rete, trappole) e abilità sbloccabili.
- Al bar: "scontri" verbali con clienti ostili, risolti con scelte di dialogo (rispondere male alza lo stress ma dà rispetto; ignorare costa meno).

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

## 11. Progressione e abilità (bozza)

- **Livello**: sale con l'esperienza. Ogni livello dà 1 punto abilità.
- **Rami di abilità**:
  - *Resistenza*: meno stanchezza per azione.
  - *Nervi saldi*: meno stress dai rimproveri.
  - *Agricoltore*: raccolti migliori, colture più veloci.
  - *Allevatore*: maiali più sani, vendite migliori.
  - *Furbizia*: pisolini più efficaci senza farsi scoprire (in tema con Garonio).

## 11b. Colonne sonore

Le tracce originali stanno in `assets/music/` e sono collegate alle scene in `assets/music/playlist.json` (si può cambiare l'abbinamento senza toccare il codice):

| Traccia | Quando suona |
|---|---|
| **Sunset Truciolone** | Base: giornata in azienda e sera |
| **Rabbia Incontrollata** | Al bar e quando le nutrie attaccano il campo (momenti di "scontro") |
| **Mister Scarogna** | Quando compare Mister Mountain |

Per aggiungere una traccia nuova basta mettere il file `.mp3` nella cartella e scriverne il nome nella lista della scena giusta.

## 12. Controlli

- PC: frecce o WASD per muoversi, **E / Spazio** per agire, **Shift** per correre.
- Telefono: levetta virtuale e pulsante azione sullo schermo.

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
2. Inserire lo stile e l'icona di Garonio che hai già in mente (per ora ci sono segnaposti) e poi gli sprite veri del Gigante e di Mister Mountain.
3. Mezzi: Vespa e Punto per muoversi, trattori dell'azienda che si possono rompere.
4. Aggiungere maiali, officina vera e bar con eventi.
5. Sistema di livelli e abilità.
6. Svago serale e catalogo (versione non esplicita).
7. Stagioni e nuovi nemici.
8. Versione app per telefono.
