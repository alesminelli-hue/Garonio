#!/usr/bin/env bash
# Prepara il progetto Android di GT Tractor (da lanciare dentro app-android/).
# Uso: ./prepara.sh <versionCode> <versionName>
# Poi: cd android && ./gradlew assembleRelease   (serve l'Android SDK: lo fa la GitHub Action .github/workflows/apk.yml)
set -euo pipefail
CODE="${1:-1}"; NOME="${2:-1.0.$CODE}"
cd "$(dirname "$0")"

# 1. i file del gioco dentro www/ (senza documenti, strumenti e service worker)
rm -rf www && mkdir www
cp -r ../index.html ../style.css ../manifest.webmanifest ../src ../lib ../assets www/
rm -rf www/assets/sprites/originali

# 2. progetto Android generato da Capacitor
npm install --no-audit --no-fund
rm -rf android
npx cap add android
npx cap sync android

# 3. icona, schermata di avvio, schermo intero, versione
rm -f android/app/src/main/res/drawable-*/splash.png
cp -r res/. android/app/src/main/res/
cp MainActivity.java android/app/src/main/java/com/garonio/gttractor/MainActivity.java
sed -i -E "s/versionCode [0-9]+/versionCode $CODE/; s/versionName \"[^\"]*\"/versionName \"$NOME\"/" android/app/build.gradle
# schermata di avvio di Android 12+: sfondo blu notte e ritratto di Garonio
sed -i 's#<item name="android:background">@drawable/splash</item>#<item name="android:background">@drawable/splash</item>\n        <item name="windowSplashScreenBackground">\#141c4a</item>\n        <item name="windowSplashScreenAnimatedIcon">@mipmap/ic_launcher_foreground</item>\n        <item name="postSplashScreenTheme">@style/AppTheme.NoActionBar</item>#' android/app/src/main/res/values/styles.xml
# niente orientamento bloccato, lo schermo si gira come vuoi
sed -i 's/android:screenOrientation="[^"]*"//' android/app/src/main/AndroidManifest.xml
grep -q "versionCode $CODE" android/app/build.gradle
echo "Progetto pronto: versione $NOME ($CODE)"
