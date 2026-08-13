/**
 * PROG.AKARTIS — enrichit toutes les leçons :
 * explications longues avant le défi + solutions alignées
 */
(function () {
  const PRINT = {
    python: (s) => `print(${s})`,
    javascript: (s) => `console.log(${s})`,
    typescript: (s) => `console.log(${s})`,
    java: (s) => `System.out.println(${s});`,
    cpp: (s) => `std::cout << ${s} << std::endl;`,
    c: (s) => `printf("%s\\n", ${s});`,
    csharp: (s) => `Console.WriteLine(${s});`,
    go: (s) => `fmt.Println(${s})`,
    rust: (s) => `println!("{}", ${s});`,
    php: (s) => `echo ${s};`,
    ruby: (s) => `puts ${s}`,
    swift: (s) => `print(${s})`,
    kotlin: (s) => `println(${s})`,
    dart: (s) => `print(${s});`,
    r: (s) => `print(${s})`,
    lua: (s) => `print(${s})`,
    bash: (s) => `echo ${s}`,
    sql: (s) => `SELECT ${s};`,
    default: (s) => `print(${s})`,
  };

  function printStmt(lang, expr) {
    const fn = PRINT[lang] || PRINT.default;
    return fn(expr);
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function sampleHello(lang) {
    const map = {
      python: 'print("Hello, World!")',
      javascript: 'console.log("Hello, World!");',
      typescript: 'console.log("Hello, World!");',
      java: 'System.out.println("Hello, World!");',
      cpp: 'std::cout << "Hello, World!" << std::endl;',
      c: 'printf("Hello, World!\\n");',
      csharp: 'Console.WriteLine("Hello, World!");',
      go: 'fmt.Println("Hello, World!")',
      rust: 'println!("Hello, World!");',
      php: 'echo "Hello, World!";',
      ruby: 'puts "Hello, World!"',
      swift: 'print("Hello, World!")',
      kotlin: 'println("Hello, World!")',
      dart: 'print("Hello, World!");',
      r: 'print("Hello, World!")',
      lua: 'print("Hello, World!")',
      bash: 'echo "Hello, World!"',
      sql: "SELECT 'Hello, World!';",
      html: "<h1>Hello, World!</h1>",
      css: "/* Hello styles */\nbody { font-family: sans-serif; }",
    };
    return map[lang] || 'print("Hello, World!")';
  }

  function conceptPack(lang, title) {
    const t = (title || "").toLowerCase();
    const name = lang.toUpperCase();

    // Generic rich blocks keyed by keywords
    if (/hello|world|intro|début|affiche/.test(t)) {
      return {
        goal: `Afficher un message à l'écran avec ${name}.`,
        body: `<p>La première étape dans tout langage est d'afficher du texte. Cela permet de vérifier que ton environnement fonctionne et de comprendre la syntaxe de base.</p>
<p>En <strong>${esc(lang)}</strong>, on utilise une instruction dédiée pour écrire dans la console ou la sortie standard.</p>
<pre><code>${esc(sampleHello(lang))}</code></pre>
<p>Les guillemets entourent une <em>chaîne de caractères</em> (du texte). Sans eux, le langage chercherait une variable.</p>`,
        keys: ["Utiliser la bonne fonction d'affichage", "Les chaînes sont entre guillemets", "Respecter la syntaxe exacte (parenthèses, points-virgules si besoin)"],
      };
    }
    if (/variable/.test(t)) {
      return {
        goal: `Créer et utiliser des variables en ${name}.`,
        body: `<p>Une <strong>variable</strong> est un nom qui référence une valeur en mémoire. Tu peux la réutiliser et la modifier plus tard.</p>
<p>En <strong>${esc(lang)}</strong>, on assigne une valeur avec <code>=</code> (parfois avec un mot-clé comme <code>let</code>, <code>var</code>, <code>int</code>… selon le langage).</p>
<pre><code>x = 42
// puis on affiche x</code></pre>
<p>Choisis des noms clairs (<code>age</code>, <code>total</code>) plutôt que <code>a</code> ou <code>x1</code> dès que le programme grossit.</p>`,
        keys: ["Nom = valeur", "Le type peut être implicite ou explicite", "Afficher la variable pour vérifier"],
      };
    }
    if (/type|données/.test(t)) {
      return {
        goal: `Comprendre les types de base en ${name}.`,
        body: `<p>Les <strong>types</strong> décrivent la nature d'une valeur : nombre entier, décimal, texte, booléen (vrai/faux), etc.</p>
<p>Certains langages sont typés dynamiquement (Python, JS) : le type se déduit à l'exécution. D'autres sont statiques (Java, TypeScript, Rust) : le type est vérifié à la compilation.</p>
<pre><code>// exemples de valeurs
42        // entier
3.14      // flottant
"texte"   // chaîne
true      // booléen</code></pre>`,
        keys: ["Entier / flottant / chaîne / booléen", "Le type influence les opérations possibles", "Conversion possible entre types"],
      };
    }
    if (/opérat|calcul|arith/.test(t)) {
      return {
        goal: `Utiliser les opérateurs arithmétiques en ${name}.`,
        body: `<p>Les opérateurs permettent de calculer : <code>+</code> <code>-</code> <code>*</code> <code>/</code> et souvent <code>%</code> (reste) ou <code>**</code> / <code>^</code> (puissance).</p>
<pre><code>6 * 7   → 42
10 % 3  → 1
10 / 4  → selon le langage : 2 ou 2.5</code></pre>
<p>Attention à la division entière vs flottante selon le langage.</p>`,
        keys: ["Priorité : * et / avant + et -", "Parenthèses pour forcer l'ordre", "Tester avec print/console"],
      };
    }
    if (/string|f-string|chaîne|concat|format|texte/.test(t)) {
      return {
        goal: `Manipuler du texte (chaînes) en ${name}.`,
        body: `<p>Une <strong>chaîne</strong> est une suite de caractères. On peut les coller (concaténer), extraire une partie, ou injecter des variables (template / f-string / interpolation).</p>
<pre><code>// idée générale
"Bonjour " + nom
// ou interpolation selon le langage</code></pre>
<p>En Python on privilégie les f-strings : <code>f"Bonjour {nom}"</code>. En JS : <code>\`Bonjour \${nom}\`</code>.</p>`,
        keys: ["Concaténation vs interpolation", "Indexation souvent à partir de 0", "Longueur via len / length / size"],
      };
    }
    if (/\bif\b|else|elif|condition|branch/.test(t)) {
      return {
        goal: `Écrire des conditions (if / else) en ${name}.`,
        body: `<p>Une condition permet d'exécuter un bloc <em>seulement si</em> un test est vrai.</p>
<pre><code>if (n % 2 == 0) {
  // pair
} else {
  // impair
}</code></pre>
<p>Les opérateurs de comparaison : <code>==</code> <code>!=</code> <code>&lt;</code> <code>&gt;</code> <code>&lt;=</code> <code>&gt;=</code>. En Python l'indentation définit le bloc ; ailleurs ce sont souvent des accolades.</p>`,
        keys: ["Expression booléenne", "else optionnel", "elif / else if pour plusieurs cas"],
      };
    }
    if (/for|while|boucle|loop|range|itér/.test(t)) {
      return {
        goal: `Répéter des actions avec des boucles en ${name}.`,
        body: `<p>Une <strong>boucle</strong> répète un bloc tant qu'une condition est vraie (<code>while</code>) ou pour chaque élément d'une séquence (<code>for</code>).</p>
<pre><code>// for conceptuel
for i de 0 à 2:
  afficher i</code></pre>
<p>Évite les boucles infinies : la condition doit finir par devenir fausse, ou la collection doit être finie.</p>`,
        keys: ["for = parcours", "while = condition", "Compteur / itérateur"],
      };
    }
    if (/list|array|tableau|vector|slice/.test(t)) {
      return {
        goal: `Stocker plusieurs valeurs dans une liste / un tableau.`,
        body: `<p>Les listes (ou tableaux) regroupent des éléments ordonnés, accessibles par un <strong>index</strong> qui commence en général à <code>0</code>.</p>
<pre><code>L = [10, 20, 30]
L[0]  → 10
L[2]  → 30</code></pre>
<p>On peut ajouter, supprimer, parcourir. La taille se lit avec len/length selon le langage.</p>`,
        keys: ["Index 0 = premier élément", "Taille variable ou fixe selon le langage", "Parcours avec for"],
      };
    }
    if (/dict|map|hash|object|json|clé/.test(t)) {
      return {
        goal: `Associer des clés à des valeurs.`,
        body: `<p>Un dictionnaire / map / objet associe une <strong>clé</strong> à une <strong>valeur</strong> pour un accès rapide.</p>
<pre><code>d = {"name": "Ada"}
d["name"]  → Ada</code></pre>`,
        keys: ["Clés uniques", "Accès par clé", "Utile pour des enregistrements"],
      };
    }
    if (/fonc|function|def|method|proc/.test(t)) {
      return {
        goal: `Créer et appeler des fonctions en ${name}.`,
        body: `<p>Une <strong>fonction</strong> regroupe des instructions réutilisables. Elle peut prendre des <em>paramètres</em> et renvoyer une valeur.</p>
<pre><code>function add(a, b) {
  return a + b
}</code></pre>
<p>Factoriser le code évite les copier-coller et facilite les tests.</p>`,
        keys: ["Paramètres d'entrée", "return / valeur de retour", "Portée des variables"],
      };
    }
    if (/class|objet|oop|hérit|struct/.test(t)) {
      return {
        goal: `Modéliser avec des classes / objets.`,
        body: `<p>La programmation orientée objet regroupe données (attributs) et comportements (méthodes) dans des <strong>classes</strong>.</p>
<pre><code>class Person {
  name
  greet() { ... }
}</code></pre>`,
        keys: ["Classe = plan", "Instance = objet concret", "Méthodes + attributs"],
      };
    }
    if (/async|await|promise|goroutine|thread|concurrent/.test(t)) {
      return {
        goal: `Gérer l'asynchrone ou la concurrence.`,
        body: `<p>Certaines opérations (réseau, fichiers) prennent du temps. L'asynchrone évite de bloquer tout le programme en attendant le résultat.</p>`,
        keys: ["Non-bloquant", "Callbacks / promises / await", "Erreurs à gérer"],
      };
    }
    if (/sql|select|query|table|join/.test(t) || lang === "sql") {
      return {
        goal: `Interroger des données avec SQL.`,
        body: `<p>SQL sert à lire et modifier des tables relationnelles.</p>
<pre><code>SELECT colonne FROM table WHERE condition;</code></pre>
<p><code>WHERE</code> filtre, <code>ORDER BY</code> trie, <code>JOIN</code> relie des tables.</p>`,
        keys: ["SELECT pour lire", "WHERE pour filtrer", "Les chaînes SQL entre quotes"],
      };
    }
    if (/git|commit|branch/.test(t) || lang === "git") {
      return {
        goal: `Versionner le code avec Git.`,
        body: `<p>Git enregistre l'historique des modifications. <code>commit</code> fixe un instantané, les branches isolent des fonctionnalités.</p>`,
        keys: ["status / add / commit", "Messages clairs", "Branches pour isoler le travail"],
      };
    }
    if (/html|balise|dom/.test(t) || lang === "html") {
      return {
        goal: `Structurer une page avec HTML.`,
        body: `<p>HTML décrit la structure : titres, paragraphes, liens, images via des <strong>balises</strong>.</p>
<pre><code>&lt;h1&gt;Titre&lt;/h1&gt;
&lt;p&gt;Paragraphe&lt;/p&gt;</code></pre>`,
        keys: ["Balise ouvrante / fermante", "Attributs (href, src…)", "Sémantique (header, main…)"],
      };
    }
    if (/css|style|flex|grid|couleur/.test(t) || lang === "css") {
      return {
        goal: `Styliser avec CSS.`,
        body: `<p>CSS contrôle couleurs, tailles, positions. Un <strong>sélecteur</strong> cible des éléments, des <strong>propriétés</strong> définissent le rendu.</p>
<pre><code>h1 { color: blue; font-size: 24px; }</code></pre>`,
        keys: ["Sélecteur { propriété: valeur; }", "Classes et id", "Responsive avec media queries"],
      };
    }

    // Fallback progressive topics
    return {
      goal: `Maîtriser « ${esc(title)} » en ${name}.`,
      body: `<p>Cette leçon porte sur <strong>${esc(title)}</strong> dans le langage <strong>${esc(lang)}</strong>.</p>
<p>Lis bien l'exemple, puis reproduis le comportement demandé dans le défi. La solution doit produire <em>exactement</em> la sortie attendue (majuscules, espaces, retours à la ligne).</p>
<pre><code>${esc(sampleHello(lang))}</code></pre>
<p>En cas de doute : affiche des valeurs intermédiaires, vérifie les types, et compare avec la solution une fois le défi tenté.</p>`,
      keys: ["Lire l'énoncé du défi mot à mot", "Tester la sortie", "Respecter la syntaxe de " + name],
    };
  }

  function buildTheory(course, lesson) {
    const lang = course.id || "python";
    const pack = conceptPack(lang, lesson.title);
    const keys = (pack.keys || []).map((k) => `<li>${k}</li>`).join("");
    return `
<div class="theory-rich">
  <div class="theory-block">
    <h4>🎯 Objectif</h4>
    <p>${pack.goal}</p>
  </div>
  <div class="theory-block">
    <h4>📖 Explication</h4>
    ${pack.body}
  </div>
  <div class="theory-block">
    <h4>✅ Points clés</h4>
    <ul>${keys}</ul>
  </div>
  <div class="theory-block theory-challenge-hint">
    <h4>🧪 Avant le défi</h4>
    <p>Tu devras : <strong>${esc(lesson.challenge || "compléter le code")}</strong>.</p>
    <p>Écris le code dans l'éditeur, exécute, et compare avec la sortie attendue. Utilise « Solution » seulement après avoir essayé.</p>
  </div>
</div>`;
  }

  function fixSolution(course, lesson) {
    // Keep existing solution if present; ensure it's a string
    let sol = lesson.solution;
    if (sol == null || String(sol).trim() === "") {
      const exp =
        lesson.tests && lesson.tests[0] && lesson.tests[0].expected != null
          ? String(lesson.tests[0].expected).split("\n")[0]
          : "ok";
      const lang = course.id || "python";
      // minimal printable solution matching first expected line
      if (lang === "python") sol = `print(${JSON.stringify(exp)})`;
      else if (lang === "javascript" || lang === "typescript" || lang === "atomjs")
        sol = `console.log(${JSON.stringify(exp)});`;
      else if (lang === "java") sol = `System.out.println(${JSON.stringify(exp)});`;
      else if (lang === "go") sol = `fmt.Println(${JSON.stringify(exp)})`;
      else if (lang === "rust") sol = `println!("{}", ${JSON.stringify(exp)});`;
      else if (lang === "sql") sol = `SELECT ${JSON.stringify(exp)};`;
      else sol = `print(${JSON.stringify(exp)})`;
    }
    return String(sol);
  }

  function enrichAll() {
    const courses = window.AKARTIS_COURSES;
    if (!courses) return;
    Object.keys(courses).forEach((id) => {
      const course = courses[id];
      if (!course || !Array.isArray(course.lessons)) return;
      course.lessons.forEach((lesson) => {
        // Always enrich theory with structured explanation
        lesson.theory = buildTheory(course, lesson);
        lesson.solution = fixSolution(course, lesson);
        if (!lesson.starter) lesson.starter = "";
      });
    });
  }

  // Run after courses.js
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enrichAll);
  } else {
    enrichAll();
  }
  // Also run immediately in case courses already loaded
  enrichAll();
  window.AKARTIS_ENRICH = enrichAll;
})();
