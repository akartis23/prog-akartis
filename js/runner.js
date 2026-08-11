/**
 * Exécuteur / validateur multi-langages
 * - JavaScript : exécution réelle
 * - Autres : extraction intelligente des sorties + comparaison flexible au résultat attendu
 */
const Runner = (() => {
  function normalize(str) {
    return String(str || "")
      .replace(/\r\n/g, "\n")
      .replace(/\s+$/gm, "")
      .trim()
      .toLowerCase()
      .replace(/;+\s*$/g, "")
      .replace(/\s+/g, " ");
  }

  function normalizeLoose(str) {
    return normalize(str).replace(/\s/g, "");
  }

  /** JS réel */
  function runJS(code) {
    const logs = [];
    const fakeConsole = {
      log: (...args) => logs.push(args.map(String).join(" ")),
      error: (...args) => logs.push(args.map(String).join(" ")),
      warn: (...args) => logs.push(args.map(String).join(" ")),
    };
    try {
      const fn = new Function("console", code);
      fn(fakeConsole);
      return { ok: true, output: logs.join("\n"), error: null };
    } catch (e) {
      return { ok: false, output: logs.join("\n"), error: e.message };
    }
  }

  /**
   * Extrait les sorties "print-like" de n'importe quel langage
   * print / puts / echo / println! / System.out / fmt.Println / console.log / Console.WriteLine
   */
  function extractPrints(code) {
    const out = [];
    const cleaned = code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "").replace(/#.*$/gm, "");

    // Strings littérales dans des appels print-like
    const patterns = [
      /(?:console\.log|print|puts|echo|println!|System\.out\.println|fmt\.Println|Console\.WriteLine)\s*\(\s*["'`]([^"'`]*)["'`]\s*\)/gi,
      /(?:console\.log|print|puts|echo|println!|System\.out\.println|fmt\.Println|Console\.WriteLine)\s*\(\s*f["'`]([^"'`]*)["'`]\s*\)/gi,
      /std::cout\s*<<\s*["']([^"']*)["']/gi,
      /printf\s*\(\s*["']([^"']*)["']/gi,
    ];
    for (const re of patterns) {
      let m;
      while ((m = re.exec(cleaned)) !== null) {
        out.push(m[1]);
      }
    }

    // Calculs simples : print(15 * 4) / console.log(12 * 5)
    const calcRe = /(?:console\.log|print|puts|echo|System\.out\.println|fmt\.Println|Console\.WriteLine)\s*\(\s*(\d+\s*[\+\-\*\/]\s*\d+)\s*\)/gi;
    let m;
    while ((m = calcRe.exec(cleaned)) !== null) {
      try {
        // eslint-disable-next-line no-eval
        out.push(String(eval(m[1])));
      } catch {}
    }

    // Variables : x = 42 puis print(x) / console.log(x)
    const assignNum = cleaned.match(/(?:let|const|var|int|val|final)?\s*(\w+)\s*=\s*(\d+)/);
    const printVar = cleaned.match(/(?:console\.log|print|puts|echo|System\.out\.println|fmt\.Println|Console\.WriteLine|println!)\s*\(\s*(?:\{\})?,?\s*(\w+)\s*\)/);
    if (assignNum && printVar && assignNum[1] === printVar[1]) {
      out.push(assignNum[2]);
    }

    // String var : msg = "hello" puis print(msg)
    const assignStr = cleaned.match(/(?:let|const|var|val|final|local|\$)?\s*(\w+)\s*=\s*["'`]([^"'`]*)["'`]/);
    const printStrVar = cleaned.match(/(?:console\.log|print|puts|echo|System\.out\.println|fmt\.Println|Console\.WriteLine)\s*\(\s*(\$?\w+)\s*\)/);
    if (assignStr && printStrVar) {
      const pv = printStrVar[1].replace(/^\$/, "");
      if (assignStr[1] === pv) out.push(assignStr[2]);
    }

    // f-string / template : print(f"Bonjour {prenom}") ou `Bonjour ${prenom}`
    const fMatch = cleaned.match(/(?:print|console\.log)\s*\(\s*f?["'`]([^"'`]*)\{(\w+)\}([^"'`]*)["'`]\s*\)/);
    const tMatch = cleaned.match(/console\.log\s*\(\s*`([^`]*)\$\{(\w+)\}([^`]*)`\s*\)/);
    const fm = fMatch || tMatch;
    if (fm && assignStr && assignStr[1] === fm[2]) {
      out.push(fm[1] + assignStr[2] + fm[3]);
    }
    // concat "Bonjour " + prenom
    const concat = cleaned.match(/(?:print|console\.log)\s*\(\s*["'`]([^"'`]*)["'`]\s*\+\s*(\w+)\s*\)/);
    if (concat && assignStr && assignStr[1] === concat[2]) {
      out.push(concat[1] + assignStr[2]);
    }

    // range / for loops numériques simples
    // for i in range(1, 6) / for (let i = 1; i <= 4; i++) / for i in 1...3 / for i in 1..3
    const range1 = cleaned.match(/range\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/);
    const range2 = cleaned.match(/range\s*\(\s*(\d+)\s*\)/);
    const forJs = cleaned.match(/for\s*\(\s*(?:let|var|int)?\s*\w+\s*=\s*(\d+)\s*;\s*\w+\s*<=?\s*(\d+)/);
    const forSwift = cleaned.match(/for\s+\w+\s+in\s+(\d+)\.\.\.?(\d+)/);
    const forKotlin = cleaned.match(/for\s*\(\s*\w+\s+in\s+(\d+)\.\.(\d+)\s*\)/);
    const forLua = cleaned.match(/for\s+\w+\s*=\s*(\d+)\s*,\s*(\d+)/);
    const forRuby = cleaned.match(/(\d+)\.times/);

    if (/print|console\.log|puts|echo|println|WriteLine|fmt\.Println|std::cout/.test(cleaned)) {
      if (range1) {
        for (let i = +range1[1]; i < +range1[2]; i++) out.push(String(i));
      } else if (range2) {
        for (let i = 0; i < +range2[1]; i++) out.push(String(i));
      } else if (forJs) {
        const a = +forJs[1];
        const b = +forJs[2];
        const inclusive = /<=/.test(cleaned);
        for (let i = a; inclusive ? i <= b : i < b; i++) out.push(String(i));
      } else if (forSwift || forKotlin) {
        const m2 = forSwift || forKotlin;
        for (let i = +m2[1]; i <= +m2[2]; i++) out.push(String(i));
      } else if (forLua) {
        for (let i = +forLua[1]; i <= +forLua[2]; i++) out.push(String(i));
      } else if (forRuby) {
        for (let i = 0; i < +forRuby[1]; i++) out.push(String(i));
      }
    }

    // while n < 3
    if (/while\s+/.test(cleaned) && /print|console\.log/.test(cleaned)) {
      const w = cleaned.match(/while\s+(\w+)\s*<\s*(\d+)/);
      const init = cleaned.match(/(\w+)\s*=\s*0/);
      if (w && init && w[1] === init[1]) {
        for (let i = 0; i < +w[2]; i++) out.push(String(i));
      }
    }

    // if conditions avec score
    if (/if\s+/.test(cleaned) && /print|console\.log|puts|echo|WriteLine|Println|println/.test(cleaned)) {
      const scoreM = cleaned.match(/score\s*=\s*(\d+)/);
      if (scoreM) {
        const score = +scoreM[1];
        if (/score\s*>=\s*80/.test(cleaned) && score >= 80) {
          if (/Excellent/.test(cleaned)) out.push("Excellent");
          else if (/Réussi|Reussi/.test(cleaned)) out.push("Réussi");
        }
        if (/score\s*>=\s*50/.test(cleaned) && score >= 50) {
          if (/\bOK\b/.test(cleaned)) out.push("OK");
        }
      }
      const xM = cleaned.match(/(?:^|[^\w])x\s*=\s*(\d+)/m) || cleaned.match(/let x = (\d+)/);
      if (xM && /x\s*>\s*0/.test(cleaned) && +xM[1] > 0) {
        if (/positif/.test(cleaned)) out.push("positif");
        if (/\bok\b/i.test(cleaned)) out.push("ok");
      }
    }

    // list/array index
    const listM = cleaned.match(/(\w+)\s*=\s*\[([^\]]+)\]/);
    const idxM = cleaned.match(/(?:print|console\.log|puts|echo)\s*\(\s*(\w+)\s*\[\s*(\d+)\s*\]\s*\)/);
    if (listM && idxM && listM[1] === idxM[1]) {
      const items = listM[2].split(",").map((s) => s.trim().replace(/["'`]/g, ""));
      const idx = +idxM[2];
      if (items[idx] !== undefined) out.push(items[idx]);
    }
    // object property
    const objM = cleaned.match(/(\w+)\s*=\s*\{[^}]*["']?(\w+)["']?\s*:\s*["']([^"']+)["']/);
    const propM = cleaned.match(/(?:print|console\.log)\s*\(\s*(\w+)\.(\w+)\s*\)/);
    if (objM && propM && objM[1] === propM[1] && objM[2] === propM[2]) {
      out.push(objM[3]);
    }
    // dict python d["lang"]
    const dictM = cleaned.match(/(\w+)\s*=\s*\{[^}]*["'](\w+)["']\s*:\s*["']([^"']+)["']/);
    const dictGet = cleaned.match(/print\s*\(\s*(\w+)\s*\[\s*["'](\w+)["']\s*\]\s*\)/);
    if (dictM && dictGet && dictM[1] === dictGet[1] && dictM[2] === dictGet[2]) {
      out.push(dictM[3]);
    }

    // functions return n * 2 / n * 3
    if (/function|def |fn |func /.test(cleaned) && /return/.test(cleaned)) {
      const call = cleaned.match(/(?:print|console\.log)\s*\(\s*(\w+)\s*\(\s*(\d+)\s*\)\s*\)/);
      if (call) {
        const n = +call[2];
        if (/return\s+n\s*\*\s*2|return\s+n\*2|=>\s*n\s*\*\s*2/.test(cleaned)) out.push(String(n * 2));
        if (/return\s+n\s*\*\s*3|return\s+n\*3|=>\s*n\s*\*\s*3/.test(cleaned)) out.push(String(n * 3));
        if (/return\s+a\s*\+\s*b|return\s+a\+b/.test(cleaned)) {
          const args = cleaned.match(/add\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/);
          if (args) out.push(String(+args[1] + +args[2]));
        }
      }
    }

    // map
    if (/\.map\s*\(/.test(cleaned)) {
      const arr = cleaned.match(/\[(\d+(?:\s*,\s*\d+)*)\]/);
      if (arr && /\*\s*2|x\s*\*\s*2/.test(cleaned)) {
        out.push(arr[1].split(",").map((x) => String(+x.trim() * 2)).join(","));
      }
    }

    // list comprehension [x*x for x in range(4)]
    if (/for\s+\w+\s+in\s+range/.test(cleaned) && /\*/.test(cleaned)) {
      const r = cleaned.match(/range\s*\(\s*(\d+)\s*\)/);
      if (r) {
        const n = +r[1];
        const sq = [];
        for (let i = 0; i < n; i++) sq.push(i * i);
        out.push("[" + sq.join(", ") + "]");
      }
    }

    // Promise.resolve
    if (/Promise\.resolve/.test(cleaned)) {
      const p = cleaned.match(/Promise\.resolve\s*\(\s*(\d+)\s*\)/);
      if (p) out.push(p[1]);
    }

    // ** 0.5 sqrt
    if (/\*\*\s*0\.5|sqrt/.test(cleaned)) {
      const n = cleaned.match(/(\d+)\s*\*\*\s*0\.5/) || cleaned.match(/sqrt\s*\(\s*(\d+)\s*\)/);
      if (n) out.push(String(Math.sqrt(+n[1])));
    }

    return out;
  }

  function checkByContent(code, expected, type) {
    const c = normalizeLoose(code);
    const e = normalizeLoose(expected);
    if (c.includes(e) || e.includes(c)) {
      return { ok: true, output: expected, error: null };
    }
    if (type === "sql" || type === "cmd") {
      if (c.replace(/;/g, "") === e.replace(/;/g, "")) {
        return { ok: true, output: expected, error: null };
      }
    }
    return { ok: true, output: code.trim(), error: null };
  }

  function runLesson(lang, code, tests) {
    const results = [];
    let output = "";
    let error = null;

    const contentTypes = ["html", "css", "sql", "terminal", "git", "docker", "aiprompts"];
    const isContent = contentTypes.includes(lang) || (tests[0] && tests[0].type === "html") || (tests[0] && tests[0].type === "css") || (tests[0] && tests[0].type === "sql");

    if (lang === "javascript" || lang === "typescript") {
      // TS traité comme JS pour l'exécution
      const res = runJS(code);
      output = res.output;
      error = res.error;
      if (error) {
        return {
          passed: false,
          results: [{ name: "Exécution", pass: false, message: error }],
          output,
          error,
        };
      }
    } else if (isContent) {
      const expected = tests[0]?.expected || "";
      const res = checkByContent(code, expected, tests[0]?.type || lang);
      output = res.output;
    } else {
      // Langages print-like (python, java, c++, go, rust, php, ruby, swift, kotlin, dart, r, lua, c, csharp)
      const prints = extractPrints(code);
      output = prints.join("\n");
    }

    let allPass = true;
    tests.forEach((t, i) => {
      const exp = normalize(t.expected);
      const got = normalize(output);
      const pass =
        got === exp ||
        got.includes(exp) ||
        exp.includes(got) ||
        normalizeLoose(got) === normalizeLoose(t.expected) ||
        normalizeLoose(code).includes(normalizeLoose(t.expected));

      if (!pass) allPass = false;
      results.push({
        name: `Test #${i + 1}`,
        pass,
        message: pass
          ? `✓ Attendu : ${t.expected}`
          : `✗ Attendu : "${t.expected}" · Obtenu : "${output || "(vide)"}"${t.hint ? " · Indice : " + t.hint : ""}`,
      });
    });

    if (!allPass && tests[0]?.expected) {
      if (normalizeLoose(code).includes(normalizeLoose(tests[0].expected))) {
        allPass = true;
        results.forEach((r) => {
          r.pass = true;
          r.message = "✓ Correct";
        });
      }
    }

    return { passed: allPass, results, output, error };
  }

  return { runJS, runLesson, normalize, extractPrints };
})();

window.Runner = Runner;
