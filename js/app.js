// ===== Languages for marquee =====
const languages = [
  { name: "Python", icon: "🐍" },
  { name: "JavaScript", icon: "JS" },
  { name: "TypeScript", icon: "TS" },
  { name: "Java", icon: "☕" },
  { name: "C++", icon: "➕" },
  { name: "C", icon: "C" },
  { name: "C#", icon: "#" },
  { name: "Go", icon: "🐹" },
  { name: "Rust", icon: "🦀" },
  { name: "SQL", icon: "🗃️" },
  { name: "PHP", icon: "🐘" },
  { name: "Ruby", icon: "💎" },
  { name: "Swift", icon: "🐦" },
  { name: "Kotlin", icon: "K" },
  { name: "Dart", icon: "🎯" },
  { name: "Bash", icon: "🐚" },
  { name: "Elixir", icon: "💧" },
  { name: "Haskell", icon: "λ" },
  { name: "Scala", icon: "🔴" },
  { name: "Zig", icon: "⚡" },
  { name: "Lua", icon: "🌙" },
  { name: "R", icon: "📊" },
  { name: "Perl", icon: "🐪" },
  { name: "Solidity", icon: "⬡" },
  { name: "Assembly", icon: "⚙️" },
];

function initMarquee() {
  const el = document.getElementById("lang-marquee");
  if (!el) return;

  // Duplicate for seamless loop
  const items = [...languages, ...languages];
  el.innerHTML = items
    .map(
      (l) =>
        `<span class="lang-pill"><span class="icon">${l.icon}</span> ${l.name}</span>`
    )
    .join("");
}

// ===== Calendar =====
function initCalendar() {
  const grid = document.getElementById("calendar-grid");
  if (!grid) return;

  const today = 11; // August 11 for demo
  const daysInMonth = 31;
  const firstDayOffset = 5; // Friday (example)

  let html = "";
  // empty cells for offset
  for (let i = 0; i < firstDayOffset; i++) {
    html += `<div class="cal-day"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    let cls = "cal-day";
    if (d <= 10) cls += " done";
    if (d === today) cls += " today";
    html += `<div class="${cls}">${d}</div>`;
  }
  grid.innerHTML = html;
}

// ===== FAQ accordion =====
function initFAQ() {
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains("open");

      // close all
      document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("open"));

      if (!isOpen) {
        item.classList.add("open");
      }
    });
  });
}

// ===== Tabs =====
function initTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // Demo code change
      const codeEl = document.getElementById("code-content");
      if (!codeEl) return;

      const samples = {
        code: `const greeting = "Hello, Akartis!"

function sayHi(name) {
  return greeting + " " + name
}`,
        sql: `SELECT name, score
FROM learners
WHERE streak >= 7
ORDER BY score DESC
LIMIT 10;`,
        web: `<h1>Hello PROG.AKARTIS!</h1>
<p class="intro">Bienvenue 👋</p>
<button onclick="start()">
  Commencer
</button>`,
        ai: `// Prompt exemple
Tu es un tuteur patient.
Explique cette erreur de code
à un débutant, sans donner
la solution directement.`,
        terminal: `$ python hello.py
Hello, Akartis!
$ git status
On branch main
nothing to commit`,
      };

      const key = tab.dataset.tab;
      codeEl.textContent = samples[key] || samples.code;
    });
  });
}

// ===== Style tabs =====
function initStyleTabs() {
  document.querySelectorAll(".style-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".style-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });
}

// ===== Run code demo =====
function initRunCode() {
  const btn = document.getElementById("run-code");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const results = document.getElementById("test-results");
    results.innerHTML = `
      <div class="test-item">⏳ Exécution...</div>
    `;
    setTimeout(() => {
      results.innerHTML = `
        <div class="test-item pass">✓ Test #1 — Entrée: "Alex" → Sortie: "Hello, Akartis! Alex"</div>
        <div class="test-item pass">✓ Test #2 — Entrée: "Marie" → Sortie: "Hello, Akartis! Marie"</div>
        <div class="test-item pass">✓ Test #3 — Tous les tests passés !</div>
      `;
    }, 600);
  });
}

// ===== Theme toggle (mode sombre complet) =====
function initTheme() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  const STORAGE_KEY = "prog-akartis-theme";

  function applyTheme(isDark) {
    document.body.classList.toggle("dark", isDark);
    btn.textContent = isDark ? "☀️" : "🌙";
    btn.setAttribute("title", isDark ? "Mode clair" : "Mode sombre");
    btn.setAttribute("aria-label", isDark ? "Passer en mode clair" : "Passer en mode sombre");
  }

  // Préférence sauvegardée → sinon préférence système
  const saved = localStorage.getItem(STORAGE_KEY);
  let isDark;
  if (saved === "dark") {
    isDark = true;
  } else if (saved === "light") {
    isDark = false;
  } else {
    isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  applyTheme(isDark);

  btn.addEventListener("click", () => {
    const next = !document.body.classList.contains("dark");
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
  });

  // Réagir au changement de préférence système (si pas de choix forcé)
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches);
    }
  });
}

// ===== CTA buttons (liens vers app.html) =====
function initCTAs() {
  // Les boutons pointent déjà vers app.html – pas d'alerte
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  initMarquee();
  initCalendar();
  initFAQ();
  initTabs();
  initStyleTabs();
  initRunCode();
  initTheme();
  initCTAs();
});


/* Scroll reveal animations */
(function initReveal() {
  function run() {
    document.querySelectorAll(".section, .feature-card, .course-card, .faq-item").forEach((el, i) => {
      el.classList.add("reveal");
      if (i % 4 === 1) el.classList.add("reveal-delay-1");
      if (i % 4 === 2) el.classList.add("reveal-delay-2");
      if (i % 4 === 3) el.classList.add("reveal-delay-3");
    });
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
