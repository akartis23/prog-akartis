/**
 * Copie les fichiers web statiques vers www/ pour Capacitor (APK offline).
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const www = path.join(root, "www");

const FILES = [
  "index.html",
  "app.html",
  "about.html",
  "blog.html",
  "careers.html",
  "cheatsheets.html",
  "teachers.html",
  "tools.html",
];
const DIRS = ["css", "js", "data", "assets"];

function rimraf(p) {
  if (!fs.existsSync(p)) return;
  fs.rmSync(p, { recursive: true, force: true });
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

rimraf(www);
fs.mkdirSync(www, { recursive: true });

for (const f of FILES) {
  const src = path.join(root, f);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(www, f));
}
for (const d of DIRS) {
  copyDir(path.join(root, d), path.join(www, d));
}

// Point d'entrée Android : index.html
console.log("www/ prêt pour Capacitor (APK offline)");
