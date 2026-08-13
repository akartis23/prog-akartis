// ===== Languages for marquee =====
const languages = [
  { id: "python", name: "Python" },
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "java", name: "Java" },
  { id: "cpp", name: "C++" },
  { id: "c", name: "C" },
  { id: "csharp", name: "C#" },
  { id: "go", name: "Go" },
  { id: "rust", name: "Rust" },
  { id: "sql", name: "SQL" },
  { id: "php", name: "PHP" },
  { id: "ruby", name: "Ruby" },
  { id: "swift", name: "Swift" },
  { id: "kotlin", name: "Kotlin" },
  { id: "dart", name: "Dart" },
  { id: "bash", name: "Bash" },
  { id: "elixir", name: "Elixir" },
  { id: "haskell", name: "Haskell" },
  { id: "scala", name: "Scala" },
  { id: "zig", name: "Zig" },
  { id: "lua", name: "Lua" },
  { id: "r", name: "R" },
  { id: "perl", name: "Perl" },
  { id: "solidity", name: "Solidity" },
  { id: "docker", name: "Docker" },
  { id: "git", name: "Git" },
  { id: "flutter", name: "Flutter" },
];

function initMarquee() {
  // utilise les icônes locales si disponibles

  const el = document.getElementById("lang-marquee");
  if (!el) return;

  // Duplicate for seamless loop
  const items = [...languages, ...languages];
  el.innerHTML = items
    .map((l) => {
      const ic = window.akartisIcon
        ? window.akartisIcon(l.id, 20, "")
        : "";
      return `<span class="lang-pill">${ic} ${l.name}</span>`;
    })
    .join("");
}

// ===== Calendar =====
function initCalendar() {
  const grid = document.getElementById("calendar-grid");
  if (!grid) return;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11
  const today = now.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // JS: 0=Sun ... convert to Mon-first offset
  let firstDow = new Date(year, month, 1).getDay(); // 0 Sun
  firstDow = (firstDow + 6) % 7; // Monday = 0

  const monthNames = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const header = document.getElementById("calendar-month");
  if (header) header.textContent = monthNames[month] + " " + year;

  // week day labels
  let html = ["L","M","M","J","V","S","D"].map(d => `<div class="cal-day cal-label">${d}</div>`).join("");
  for (let i = 0; i < firstDow; i++) html += `<div class="cal-day empty"></div>`;

  // demo: mark last 7 days before today as done (série)
  for (let d = 1; d <= daysInMonth; d++) {
    let cls = "cal-day";
    if (d < today && d >= today - 7) cls += " done";
    if (d === today) cls += " today done";
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


/* Mobile nav toggle */
(function initMobileNav() {
  function run() {
    const btn = document.getElementById("mobile-menu-btn");
    const nav = document.querySelector("header .nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", () => {
      nav.classList.toggle("nav-open");
    });
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !btn.contains(e.target)) {
        nav.classList.remove("nav-open");
      }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
