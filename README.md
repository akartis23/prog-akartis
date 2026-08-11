# PROG.AKARTIS

**Apprendre à coder gratuitement — web offline + APK Android.**

Créé par **Akartis**.

---

## Démarrage web (PC)

```bash
git clone https://github.com/VOTRE_USER/prog-akartis.git
cd prog-akartis
python3 server.py
```

Ouvre **http://localhost:5000**

---

## Publier sur GitHub

```bash
cd prog-akartis
git init
git add .
git commit -m "PROG.AKARTIS v1.0.0 — offline web + base APK"

git branch -M main
git remote add origin https://github.com/VOTRE_USER/prog-akartis.git
git push -u origin main
```

### Versions (tags / Releases)

```bash
git tag -a v1.0.0 -m "v1.0.0"
git push origin v1.0.0
```

Sur GitHub → **Releases** → créer une release → **joindre le fichier `.apk`**.

---

## APK Android offline (Capacitor)

L’application est HTML/CSS/JS : dans l’APK elle fonctionne **sans internet**.

### Prérequis

- Node.js LTS
- Android Studio (SDK + JDK)

### Build

```bash
npm install
npx cap add android
npm run cap:sync
npx cap open android
```

Dans Android Studio : **Build → Build APK(s)**.

APK debug :

`android/app/build/outputs/apk/debug/app-debug.apk`

### CLI (SDK configuré)

```bash
npm run apk:debug
```

---

## Structure

- `index.html` / `app.html` — interface
- `data/` — cours, quiz, exercices
- `server.py` — serveur web local
- `package.json` + `capacitor.config.json` — build APK
- `scripts/prepare-www.js` — packager les fichiers pour Android

---

## Licence

MIT © Akartis
