# GT Tractor per Android (APK)

Il gioco impacchettato in un'app Android con [Capacitor](https://capacitorjs.com): tutti i file stanno dentro l'APK, quindi parte a schermo intero e funziona senza internet.

- **Scaricare l'ultima versione:** https://github.com/alesminelli-hue/Garonio/releases/download/android/GT-Tractor.apk
- Si ricostruisce da sola (GitHub Action `.github/workflows/apk.yml`) a ogni aggiornamento del ramo del gioco, oppure a mano da Actions → «APK Android» → Run workflow.
- Per aggiornare basta scaricare il nuovo APK e installarlo sopra: i salvataggi restano.

## File
- `prepara.sh`: copia il gioco in `www/`, genera il progetto Android, mette icona, schermata di avvio, schermo intero e numero di versione.
- `MainActivity.java`: schermo intero (barre nascoste) e schermo sempre acceso.
- `res/`: icone e schermata di avvio col ritratto di Garonio.
- `gt-tractor.keystore`: chiave di firma dell'app. Serve sempre la stessa, altrimenti Android non accetta l'aggiornamento sopra la versione installata. È nel repository di proposito (password nel workflow): è una chiave solo per questa app installata a mano, non per il Play Store.
