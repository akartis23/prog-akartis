/**
 * Contrôleur principal de l'app d'apprentissage
 */
(function () {
  let currentCourseId = null;
  let currentLessonId = null;
  let lastRunPassed = false;

  // Quiz state
  let quizId = null;
  let quizData = null;
  let quizIndex = 0;
  let quizAnswers = []; // index chosen per question, -1 if none
  let quizRevealed = false;
  let exLang = null;
  let exCurrent = null;
  let exPassed = false;

  // ---------- Helpers ----------
  function $(sel) {
    return document.querySelector(sel);
  }
  function $$(sel) {
    return document.querySelectorAll(sel);
  }

  function showToast(msg, type = "") {
    const t = $("#toast");
    t.textContent = msg;
    t.className = "toast " + type;
    clearTimeout(t._tid);
    t._tid = setTimeout(() => t.classList.add("hidden"), 2800);
  }

  function showView(name) {
    $$(".view").forEach((v) => v.classList.remove("active"));
    const el = $(`#view-${name}`);
    if (el) el.classList.add("active");

    $$(".app-nav-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.view === name);
    });

    // Scroll top
    window.scrollTo(0, 0);

    if (name === "catalog") renderCatalog();
    if (name === "dashboard") renderDashboard();
    if (name === "quizzes") renderQuizList();
    if (name === "exercises") renderExerciseList();
  }

  function updateHeaderStats() {
    const stats = Progress.getStats();
    $("#xp-pill").textContent = `⚡ ${stats.totalXP} XP`;
    $("#streak-pill").textContent = `🔥 ${stats.streak.count}`;
  }

  // ---------- Catalog ----------
  function renderCatalog() {
    const grid = $("#course-grid");
    grid.innerHTML = "";

    (window.AKARTIS_CATALOG || []).forEach((id) => {
      const c = window.AKARTIS_COURSES[id];
      if (!c) return;
      const pct = Progress.coursePercent(id);
      const done = Progress.isCourseComplete(id);

      const card = document.createElement("div");
      card.className = "course-card";
      card.innerHTML = `
        ${done ? '<span class="badge-done">Terminé</span>' : ""}
        <div class="course-icon">${c.icon}</div>
        <h3>${c.name}</h3>
        <p>${c.description}</p>
        <div class="course-meta">
          <span>${c.level} · ${c.lessons.length} leçons</span>
          <span>${pct}%</span>
        </div>
        <div class="progress-bar"><div class="fill" style="width:${pct}%"></div></div>
      `;
      card.addEventListener("click", () => openCourse(id));
      grid.appendChild(card);
    });
  }

  // ---------- Course ----------
  function openCourse(courseId) {
    currentCourseId = courseId;
    const c = window.AKARTIS_COURSES[courseId];
    if (!c) return;

    const header = $("#course-header");
    const pct = Progress.coursePercent(courseId);
    header.innerHTML = `
      <div class="big-icon">${c.icon}</div>
      <div>
        <h1>${c.name}</h1>
        <div class="desc">${c.description}</div>
        <div style="margin-top:8px;font-size:0.9rem;color:var(--text-muted)">
          ${c.lessons.length} leçons · ${pct}% complété · ${c.level}
        </div>
      </div>
    `;

    const list = $("#lessons-list");
    list.innerHTML = "";
    c.lessons.forEach((lesson, idx) => {
      const done = Progress.isLessonDone(courseId, lesson.id);
      const item = document.createElement("div");
      item.className = "lesson-item" + (done ? " done" : "");
      item.innerHTML = `
        <div class="num">${done ? "✓" : idx + 1}</div>
        <div class="info">
          <strong>${lesson.title}</strong>
          <span>${done ? "Terminée" : "À faire"}</span>
        </div>
        <div class="xp">+${lesson.xp} XP</div>
      `;
      item.addEventListener("click", () => openLesson(courseId, lesson.id));
      list.appendChild(item);
    });

    // Bouton quiz du cours s'il existe
    const quiz = window.getQuizForCourse?.(courseId);
    if (quiz) {
      const btnWrap = document.createElement("div");
      btnWrap.className = "course-quiz-btn";
      const best = Progress.getQuizResult(courseId);
      btnWrap.innerHTML = `
        <button class="btn btn-primary" id="course-start-quiz">
          📝 Lancer le quiz ${c.name}${best ? ` (meilleur : ${best.bestPct}%)` : ""}
        </button>
      `;
      list.appendChild(btnWrap);
      btnWrap.querySelector("button").addEventListener("click", () => startQuiz(courseId));
    }

    showView("course");
  }

  // ---------- Lesson ----------
  function openLesson(courseId, lessonId) {
    currentCourseId = courseId;
    currentLessonId = lessonId;
    lastRunPassed = false;
    $("#btn-submit").disabled = true;

    const c = window.AKARTIS_COURSES[courseId];
    const lesson = c.lessons.find((l) => l.id === lessonId);
    if (!lesson) return;

    $("#lesson-meta").innerHTML = `
      <h2>${lesson.title}</h2>
      <div class="xp-label">+${lesson.xp} XP · ${c.name}</div>
    `;
    $("#lesson-theory").innerHTML = lesson.theory || "";
    $("#lesson-challenge").innerHTML = `
      <h3>🎯 Défi</h3>
      <p>${lesson.challenge}</p>
    `;
    $("#editor-lang").textContent = c.name;
    $("#code-editor").value = lesson.starter || "";
    $("#output-content").textContent = "Clique sur Exécuter pour tester ton code.";
    $("#output-content").className = "";
    $("#output-status").textContent = "";

    showView("lesson");
  }

  function runCode() {
    const c = window.AKARTIS_COURSES[currentCourseId];
    const lesson = c.lessons.find((l) => l.id === currentLessonId);
    const code = $("#code-editor").value;
    const result = Runner.runLesson(c.id, code, lesson.tests);

    const out = $("#output-content");
    const status = $("#output-status");

    if (result.error) {
      out.textContent = "Erreur : " + result.error;
      out.className = "error";
      status.textContent = "Erreur";
      lastRunPassed = false;
      $("#btn-submit").disabled = true;
      return;
    }

    let text = "";
    if (result.output) text += "Sortie :\n" + result.output + "\n\n";
    result.results.forEach((r) => {
      text += r.message + "\n";
    });

    out.textContent = text.trim();
    lastRunPassed = result.passed;

    if (result.passed) {
      out.className = "success";
      status.textContent = "✓ Tous les tests passés";
      $("#btn-submit").disabled = false;
      showToast("Tests réussis ! Tu peux valider la leçon.", "success");
    } else {
      out.className = "error";
      status.textContent = "Échec";
      $("#btn-submit").disabled = true;
    }
  }

  function submitLesson() {
    if (!lastRunPassed) return;
    const c = window.AKARTIS_COURSES[currentCourseId];
    const lesson = c.lessons.find((l) => l.id === currentLessonId);

    const firstTime = Progress.completeLesson(currentCourseId, lesson.id, lesson.xp);
    updateHeaderStats();

    if (firstTime) {
      showToast(`+${lesson.xp} XP · Leçon terminée !`, "success");
    } else {
      showToast("Leçon déjà validée.", "");
    }

    // Cours terminé ?
    if (Progress.isCourseComplete(currentCourseId)) {
      setTimeout(() => showCertificate(currentCourseId), 800);
      return;
    }

    // Prochaine leçon
    const idx = c.lessons.findIndex((l) => l.id === currentLessonId);
    if (idx < c.lessons.length - 1) {
      setTimeout(() => openLesson(currentCourseId, c.lessons[idx + 1].id), 600);
    } else {
      setTimeout(() => openCourse(currentCourseId), 600);
    }
  }

  function showHint() {
    const c = window.AKARTIS_COURSES[currentCourseId];
    const lesson = c.lessons.find((l) => l.id === currentLessonId);
    const hint = lesson.tests?.[0]?.hint || "Relis la théorie et le défi attentivement.";
    showToast("💡 " + hint);
  }

  function showSolution() {
    const c = window.AKARTIS_COURSES[currentCourseId];
    const lesson = c.lessons.find((l) => l.id === currentLessonId);
    if (confirm("Afficher la solution ? Tu pourras toujours réessayer après.")) {
      $("#code-editor").value = lesson.solution || "";
    }
  }

  function resetCode() {
    const c = window.AKARTIS_COURSES[currentCourseId];
    const lesson = c.lessons.find((l) => l.id === currentLessonId);
    $("#code-editor").value = lesson.starter || "";
    $("#output-content").textContent = "Clique sur Exécuter pour tester ton code.";
    $("#output-content").className = "";
    lastRunPassed = false;
    $("#btn-submit").disabled = true;
  }

  // ---------- Certificate ----------
  function showCertificate(courseId) {
    const c = window.AKARTIS_COURSES[courseId];
    $("#cert-course-name").textContent = c.name + " · Fondamentaux";
    $("#cert-date").textContent =
      "Date · " +
      new Date().toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
    $("#cert-id").textContent =
      "PROG-" + courseId.toUpperCase().slice(0, 3) + "-" + Date.now().toString(36).toUpperCase();
    showView("certificate");
  }

  
  // ---------- Exercises ----------
  function renderExerciseList(lang) {
    const langs = window.AKARTIS_EXERCISE_LANGS || Object.keys(window.AKARTIS_EXERCISES || {});
    if (!langs.length) return;
    if (!lang || !window.AKARTIS_EXERCISES[lang]) lang = langs[0];
    exLang = lang;

    const tabs = $("#ex-lang-tabs");
    if (tabs) {
      tabs.innerHTML = langs
        .map((l) => {
          const c = window.AKARTIS_COURSES[l];
          const label = c ? c.icon + " " + c.name : l;
          return `<button class="tab ${l === lang ? "active" : ""}" data-lang="${l}">${label}</button>`;
        })
        .join("");
      $$("#ex-lang-tabs .tab").forEach((btn) => {
        btn.addEventListener("click", () => renderExerciseList(btn.dataset.lang));
      });
    }

    const list = $("#ex-list");
    if (!list) return;
    const items = window.AKARTIS_EXERCISES[lang] || [];
    list.innerHTML = items
      .map((ex) => {
        const done = Progress.isExerciseDone(ex.id);
        return `<div class="ex-item ${done ? "done" : ""}" data-id="${ex.id}">
          <span class="diff ${ex.difficulty}">${ex.difficulty}</span>
          <div class="info">
            <strong>${done ? "✓ " : ""}${ex.title}</strong>
            <span>${done ? "Terminé" : "À faire"} · +${ex.xp} XP</span>
          </div>
        </div>`;
      })
      .join("");
    $$("#ex-list .ex-item").forEach((el) => {
      el.addEventListener("click", () => openExercise(lang, el.dataset.id));
    });
  }

  function openExercise(lang, exId) {
    const items = window.AKARTIS_EXERCISES[lang] || [];
    const ex = items.find((e) => e.id === exId);
    if (!ex) return;
    exLang = lang;
    exCurrent = ex;
    exPassed = false;
    const course = window.AKARTIS_COURSES[lang];
    $("#ex-meta").innerHTML = `<h2>${ex.title}</h2><div class="xp-label">+${ex.xp} XP · ${course ? course.name : lang}</div>`;
    $("#ex-prompt").innerHTML = `<h3>🎯 Énoncé</h3><p>${ex.prompt}</p>`;
    $("#ex-diff").textContent = "Difficulté : " + ex.difficulty;
    $("#ex-editor-lang").textContent = course ? course.name : lang;
    $("#ex-code-editor").value = ex.starter || "";
    $("#ex-output-content").textContent = "Clique sur Exécuter pour tester.";
    $("#ex-output-content").className = "";
    $("#ex-output-status").textContent = "";
    $("#ex-submit").disabled = true;
    showView("exercise");
  }

  function runExercise() {
    if (!exCurrent) return;
    const code = $("#ex-code-editor").value;
    const result = Runner.runLesson(exLang, code, exCurrent.tests);
    const out = $("#ex-output-content");
    const status = $("#ex-output-status");
    if (result.error) {
      out.textContent = "Erreur : " + result.error;
      out.className = "error";
      status.textContent = "Erreur";
      exPassed = false;
      $("#ex-submit").disabled = true;
      return;
    }
    let text = "";
    if (result.output) text += "Sortie :\n" + result.output + "\n\n";
    result.results.forEach((r) => (text += r.message + "\n"));
    out.textContent = text.trim();
    exPassed = result.passed;
    if (result.passed) {
      out.className = "success";
      status.textContent = "✓ Réussi";
      $("#ex-submit").disabled = false;
      showToast("Tests OK — tu peux valider !", "success");
    } else {
      out.className = "error";
      status.textContent = "Échec";
      $("#ex-submit").disabled = true;
    }
  }

  function submitExercise() {
    if (!exPassed || !exCurrent) return;
    const first = Progress.completeExercise(exCurrent.id, exCurrent.xp);
    updateHeaderStats();
    showToast(first ? `+${exCurrent.xp} XP · Exercice validé !` : "Déjà validé", first ? "success" : "");
    setTimeout(() => showView("exercises"), 700);
  }

  function resetExercise() {
    if (!exCurrent) return;
    $("#ex-code-editor").value = exCurrent.starter || "";
    $("#ex-output-content").textContent = "Clique sur Exécuter pour tester.";
    $("#ex-output-content").className = "";
    exPassed = false;
    $("#ex-submit").disabled = true;
  }


  // ---------- Quiz ----------
  function renderQuizList() {
    const grid = $("#quiz-grid");
    if (!grid) return;
    grid.innerHTML = "";
    const quizzes = window.AKARTIS_QUIZZES || {};
    Object.keys(quizzes).forEach((id) => {
      const qz = quizzes[id];
      if (!qz || !qz.questions) return;
      const course = window.AKARTIS_COURSES[id];
      const best = Progress.getQuizResult(id);
      const card = document.createElement("div");
      card.className = "quiz-card-item";
      card.innerHTML = `
        <h3>${course ? course.icon + " " : ""}${qz.title}</h3>
        <p>${qz.questions.length} questions · +${qz.xp} XP (si ≥ 50%)</p>
        <div class="quiz-meta">
          <span>${course ? course.name : id}</span>
          <span class="best">${best ? "Meilleur : " + best.bestPct + "%" : "Pas encore tenté"}</span>
        </div>
      `;
      card.addEventListener("click", () => startQuiz(id));
      grid.appendChild(card);
    });
  }

  function startQuiz(id) {
    const qz = window.AKARTIS_QUIZZES[id];
    if (!qz) return;
    quizId = id;
    quizData = qz;
    quizIndex = 0;
    quizAnswers = qz.questions.map(() => -1);
    quizRevealed = false;
    $("#quiz-header").innerHTML = `
      <h1>${qz.title}</h1>
      <div class="q-count">${qz.questions.length} questions</div>
    `;
    renderQuizQuestion();
    showView("quiz");
  }

  function renderQuizQuestion() {
    const qs = quizData.questions;
    const q = qs[quizIndex];
    const letters = "ABCDEFGH";
    const chosen = quizAnswers[quizIndex];

    $("#quiz-progress-fill").style.width = ((quizIndex + 1) / qs.length) * 100 + "%";
    const countEl = $("#quiz-header .q-count");
    if (countEl) countEl.textContent = `Question ${quizIndex + 1} / ${qs.length}`;

    const choicesHtml = q.choices
      .map(
        (c, i) => `
      <button type="button" class="quiz-choice ${chosen === i ? "selected" : ""}" data-i="${i}">
        <span class="letter">${letters[i]}</span>
        <span>${c}</span>
      </button>`
      )
      .join("");

    $("#quiz-card").innerHTML = `
      <div class="q-text">${q.q}</div>
      <div class="quiz-choices">${choicesHtml}</div>
      <div class="quiz-explain" id="quiz-explain">${q.explain || ""}</div>
    `;

    $$("#quiz-card .quiz-choice").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (quizRevealed) return;
        quizAnswers[quizIndex] = +btn.dataset.i;
        renderQuizQuestion();
      });
    });

    $("#quiz-prev").disabled = quizIndex === 0;
    const isLast = quizIndex === qs.length - 1;
    $("#quiz-next").classList.toggle("hidden", isLast);
    $("#quiz-finish").classList.toggle("hidden", !isLast);
  }

  function quizNext() {
    if (quizIndex < quizData.questions.length - 1) {
      quizIndex++;
      quizRevealed = false;
      renderQuizQuestion();
    }
  }

  function quizPrev() {
    if (quizIndex > 0) {
      quizIndex--;
      quizRevealed = false;
      renderQuizQuestion();
    }
  }

  function finishQuiz() {
    const qs = quizData.questions;
    let score = 0;
    const details = [];
    qs.forEach((q, i) => {
      const ok = quizAnswers[i] === q.answer;
      if (ok) score++;
      details.push({
        ok,
        q: q.q,
        chosen: quizAnswers[i],
        answer: q.answer,
        choices: q.choices,
      });
    });
    const total = qs.length;
    const pct = Math.round((score / total) * 100);
    const { granted } = Progress.saveQuizResult(quizId, score, total, quizData.xp);
    updateHeaderStats();

    let msg = "Continue comme ça !";
    if (pct === 100) msg = "Parfait ! 🎉";
    else if (pct >= 80) msg = "Très bon score !";
    else if (pct >= 50) msg = "Validé — tu peux encore t'améliorer.";
    else msg = "Révise les leçons et réessaie.";

    const detailsHtml = details
      .map(
        (d, i) => `
      <div class="rd-item ${d.ok ? "ok" : "ko"}">
        <span>${d.ok ? "✓" : "✗"}</span>
        <span>Q${i + 1}: ${d.q.slice(0, 70)}${d.q.length > 70 ? "…" : ""}
        ${!d.ok && d.chosen >= 0 ? `<br><small>Ta réponse : ${d.choices[d.chosen]} · Correct : ${d.choices[d.answer]}</small>` : !d.ok ? "<br><small>Sans réponse · Correct : " + d.choices[d.answer] + "</small>" : ""}
        </span>
      </div>`
      )
      .join("");

    $("#quiz-result-card").innerHTML = `
      <div class="score-big">${pct}%</div>
      <div class="score-label">${score} / ${total} correctes</div>
      <div class="result-msg">${msg}</div>
      <div class="result-xp">${
        granted
          ? "+" + granted + " XP gagnés"
          : pct >= 50
            ? "XP déjà obtenus pour ce quiz"
            : "Pas d'XP (score < 50%)"
      }</div>
      <div class="quiz-result-details">${detailsHtml}</div>
      <button class="btn btn-primary" id="quiz-retry">Réessayer</button>
      <button class="btn btn-outline" id="quiz-back-list" style="margin-left:8px">Tous les quiz</button>
    `;
    $("#quiz-retry")?.addEventListener("click", () => startQuiz(quizId));
    $("#quiz-back-list")?.addEventListener("click", () => showView("quizzes"));
    showView("quiz-result");
  }

  // ---------- Dashboard ----------
  function renderDashboard() {
    const stats = Progress.getStats();
    $("#dash-grid").innerHTML = `
      <div class="dash-stat"><div class="value">${stats.totalXP}</div><div class="label">XP total</div></div>
      <div class="dash-stat"><div class="value">${stats.lessonsDone}</div><div class="label">Leçons terminées</div></div>
      <div class="dash-stat"><div class="value">${stats.coursesStarted}</div><div class="label">Cours commencés</div></div>
      <div class="dash-stat"><div class="value">${stats.coursesDone}</div><div class="label">Cours terminés</div></div>
      <div class="dash-stat"><div class="value">${stats.streak.count}</div><div class="label">Jours de série</div></div>
      <div class="dash-stat"><div class="value">${stats.quizzesDone || 0}</div><div class="label">Quiz faits</div></div>
      <div class="dash-stat"><div class="value">${stats.exercisesDone || 0}</div><div class="label">Exercices faits</div></div>
    `;

    let html = "<h2>Tes cours</h2>";
    (window.AKARTIS_CATALOG || []).forEach((id) => {
      const c = window.AKARTIS_COURSES[id];
      const pct = Progress.coursePercent(id);
      if (pct === 0) return;
      html += `
        <div class="lesson-item" style="margin-bottom:10px;cursor:pointer" data-course="${id}">
          <div class="num">${c.icon}</div>
          <div class="info">
            <strong>${c.name}</strong>
            <span>${pct}% · ${Progress.getCourseProgress(id).completed.length}/${c.lessons.length} leçons</span>
          </div>
          <div class="progress-bar" style="width:100px"><div class="fill" style="width:${pct}%"></div></div>
        </div>
      `;
    });
    if (html === "<h2>Tes cours</h2>") {
      html += '<p style="color:var(--text-muted)">Aucun cours commencé. Va dans le Catalogue !</p>';
    }
    $("#dash-courses").innerHTML = html;

    $$("#dash-courses .lesson-item").forEach((el) => {
      el.addEventListener("click", () => openCourse(el.dataset.course));
    });
  }

  // ---------- Playground ----------
  function initPlayground() {
    let pgLang = "javascript";

    const SAMPLES = {
      javascript: 'console.log("Hello, Akartis!");\nconsole.log(2 + 2);',
      typescript: 'const msg: string = "Hello, TS!";\nconsole.log(msg);',
      python: 'print("Hello, Akartis!")\nprint(2 + 2)',
      java: 'System.out.println("Hello, Java!");',
      go: 'fmt.Println("Hello, Go!")',
      rust: 'println!("Hello, Rust!");',
      c: 'printf("Hello, C!");',
      cpp: 'std::cout << "Hello, C++!";',
      csharp: 'Console.WriteLine("Hello, C#!");',
      php: 'echo "Hello, PHP!";',
      ruby: 'puts "Hello, Ruby!"',
      swift: 'print("Hello, Swift!")',
      kotlin: 'println("Hello, Kotlin!")',
      dart: 'print("Hello, Dart!");',
      r: 'print("Hello, R")',
      lua: 'print("Hello, Lua")',
      bash: 'echo "Hello, Bash!"',
      sql: "SELECT * FROM users WHERE age > 18;",
      html: "<h1>Hello, Akartis!</h1>",
      css: "body { color: #29ABE2; font-family: sans-serif; }",
      git: "git status",
      docker: "docker ps",
      terminal: "ls -la",
      flutter: 'print("Hello, Flutter!");',
      capacitor: 'console.log("Hello, Capacitor!");',
      atomjs: 'console.log("Hello, AtomJS!");',
      elixir: 'IO.puts("Hello, Elixir!")',
      haskell: 'putStrLn "Hello, Haskell"',
      scala: 'println("Hello, Scala")',
      rust: 'println!("Hello, Rust!");',
    };

    const NATIVE_HINT = {
      javascript: "Exécution native dans le navigateur",
      typescript: "Simulé (syntaxe TS → sorties console.log)",
    };

    function allLangIds() {
      const cat = window.AKARTIS_CATALOG || Object.keys(window.AKARTIS_COURSES || {});
      return cat.filter((id) => window.AKARTIS_COURSES && window.AKARTIS_COURSES[id]);
    }

    function setLang(id, loadSample) {
      pgLang = id;
      const course = window.AKARTIS_COURSES[id];
      const name = course ? `${course.icon || ""} ${course.name}`.trim() : id;

      // select
      const sel = $("#pg-lang-select");
      if (sel) sel.value = id;

      // tabs
      $$("#pg-lang-tabs .tab").forEach((t) => {
        t.classList.toggle("active", t.dataset.lang === id);
      });
      const activeTab = $(`#pg-lang-tabs .tab[data-lang="${id}"]`);
      if (activeTab) activeTab.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });

      $("#pg-current-lang").textContent = name;
      $("#pg-hint").textContent =
        NATIVE_HINT[id] ||
        (id === "javascript"
          ? "Exécution native dans le navigateur"
          : "Simulation des sorties print / echo / console");

      if (loadSample) {
        $("#pg-editor").value = SAMPLES[id] || "";
      }
      $("#pg-output").textContent = "Prêt — clique sur Exécuter.";
      $("#pg-output").style.color = "";
    }

    function buildNav() {
      const ids = allLangIds();
      const sel = $("#pg-lang-select");
      const tabs = $("#pg-lang-tabs");
      if (!sel || !tabs) return;

      sel.innerHTML = ids
        .map((id) => {
          const c = window.AKARTIS_COURSES[id];
          const label = c ? `${c.icon || ""} ${c.name}`.trim() : id;
          return `<option value="${id}">${label}</option>`;
        })
        .join("");

      tabs.innerHTML = ids
        .map((id) => {
          const c = window.AKARTIS_COURSES[id];
          const label = c ? `${c.icon || ""} ${c.name}`.trim() : id;
          return `<button type="button" class="tab" data-lang="${id}" title="${c ? c.name : id}">${label}</button>`;
        })
        .join("");

      sel.addEventListener("change", () => setLang(sel.value, true));
      $$("#pg-lang-tabs .tab").forEach((tab) => {
        tab.addEventListener("click", () => setLang(tab.dataset.lang, true));
      });

      // default
      if (ids.includes("javascript")) setLang("javascript", false);
      else if (ids[0]) setLang(ids[0], false);
    }

    buildNav();

    $("#pg-run").addEventListener("click", () => {
      const code = $("#pg-editor").value;
      const out = $("#pg-output");
      if (!code.trim()) {
        out.textContent = "(éditeur vide)";
        out.style.color = "#fbbf24";
        return;
      }
      if (pgLang === "javascript") {
        const res = Runner.runJS(code);
        if (res.error) {
          out.textContent = "Erreur : " + res.error;
          out.style.color = "#f87171";
        } else {
          out.textContent = res.output || "(aucune sortie — utilise console.log)";
          out.style.color = "#6ee7a0";
        }
      } else {
        const prints = Runner.extractPrints(code);
        if (prints.length > 0) {
          out.textContent = prints.join("\n");
          out.style.color = "#6ee7a0";
        } else {
          out.textContent =
            "(simulation) Aucune sortie print détectée.\nAstuce : utilise print / console.log / echo / puts / println…";
          out.style.color = "#fbbf24";
        }
      }
    });

    $("#pg-clear").addEventListener("click", () => {
      $("#pg-editor").value = "";
      $("#pg-output").textContent = "";
    });

    $("#pg-sample")?.addEventListener("click", () => {
      $("#pg-editor").value = SAMPLES[pgLang] || '// Exemple non fourni pour ce langage\nconsole.log("Hello");';
    });
  }

  // ---------- Theme ----------
  function initTheme() {
    const btn = $("#theme-toggle");
    if (!btn) return;
    const KEY = "prog-akartis-theme";

    function apply(isDark) {
      document.body.classList.toggle("dark", isDark);
      btn.textContent = isDark ? "☀️" : "🌙";
    }

    const saved = localStorage.getItem(KEY);
    let isDark =
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (saved === "light") isDark = false;
    apply(isDark);

    btn.addEventListener("click", () => {
      const next = !document.body.classList.contains("dark");
      apply(next);
      localStorage.setItem(KEY, next ? "dark" : "light");
    });
  }

  // ---------- Tab key in editors ----------
  function enableTab(el) {
    if (!el) return;
    el.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = el.selectionStart;
        const end = el.selectionEnd;
        el.value = el.value.substring(0, start) + "  " + el.value.substring(end);
        el.selectionStart = el.selectionEnd = start + 2;
      }
    });
  }

  // ---------- Init ----------
  function init() {
    // Nav
    $$(".app-nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => showView(btn.dataset.view));
    });

    $("#back-to-catalog")?.addEventListener("click", () => showView("catalog"));
    $("#back-to-course")?.addEventListener("click", () => openCourse(currentCourseId));
    $("#btn-back-catalog")?.addEventListener("click", () => showView("catalog"));
    $("#back-to-quizzes")?.addEventListener("click", () => showView("quizzes"));
    $("#quiz-next")?.addEventListener("click", quizNext);
    $("#quiz-prev")?.addEventListener("click", quizPrev);
    $("#quiz-finish")?.addEventListener("click", finishQuiz);
    $("#back-to-exercises")?.addEventListener("click", () => showView("exercises"));
    $("#ex-run")?.addEventListener("click", runExercise);
    $("#ex-submit")?.addEventListener("click", submitExercise);
    $("#ex-reset")?.addEventListener("click", resetExercise);
    $("#ex-hint")?.addEventListener("click", () => {
      const h = exCurrent?.tests?.[0]?.hint || "Relis l'énoncé attentivement.";
      showToast("💡 " + h);
    });
    $("#ex-solution")?.addEventListener("click", () => {
      if (exCurrent && confirm("Afficher la solution ?")) {
        $("#ex-code-editor").value = exCurrent.solution || "";
      }
    });
    enableTab($("#ex-code-editor"));

    $("#btn-run")?.addEventListener("click", runCode);
    $("#btn-submit")?.addEventListener("click", submitLesson);
    $("#btn-hint")?.addEventListener("click", showHint);
    $("#btn-solution")?.addEventListener("click", showSolution);
    $("#btn-reset")?.addEventListener("click", resetCode);

    $("#btn-reset-progress")?.addEventListener("click", () => {
      if (confirm("Effacer toute ta progression ? Cette action est irréversible.")) {
        Progress.resetAll();
        updateHeaderStats();
        renderDashboard();
        showToast("Progression réinitialisée");
      }
    });

    enableTab($("#code-editor"));
    enableTab($("#pg-editor"));
    initPlayground();
    initTheme();
    updateHeaderStats();
    renderCatalog();

    // Deep link ?course=python&lesson=1 ou ?view=playground|quizzes|dashboard
    const params = new URLSearchParams(location.search);
    const course = params.get("course");
    const lesson = params.get("lesson");
    const view = params.get("view");
    if (course && window.AKARTIS_COURSES[course]) {
      if (lesson) openLesson(course, +lesson);
      else openCourse(course);
    } else if (view && ["catalog", "dashboard", "playground", "quizzes", "exercises"].includes(view)) {
      showView(view);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
