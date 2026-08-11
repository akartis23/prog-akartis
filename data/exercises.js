/**
 * Exercices pratiques – défis de code concrets (style kata)
 * Chaque exercice : énoncé, starter, tests (sortie attendue), solution, difficulté
 */
window.AKARTIS_EXERCISES = {
  python: [
    {
      id: "py-sum",
      title: "Somme de deux nombres",
      difficulty: "Facile",
      xp: 20,
      prompt: "Écris une fonction add(a, b) qui retourne la somme, puis affiche add(3, 5).",
      starter: "def add(a, b):\n    # ton code\n    pass\n\nprint(add(3, 5))",
      tests: [{ expected: "8", hint: "return a + b" }],
      solution: "def add(a, b):\n    return a + b\n\nprint(add(3, 5))"
    },
    {
      id: "py-even",
      title: "Nombre pair ?",
      difficulty: "Facile",
      xp: 20,
      prompt: "Si n = 4 est pair, affiche 'pair', sinon 'impair'.",
      starter: "n = 4\n",
      tests: [{ expected: "pair", hint: "if n % 2 == 0" }],
      solution: "n = 4\nif n % 2 == 0:\n    print('pair')\nelse:\n    print('impair')"
    },
    {
      id: "py-max",
      title: "Maximum de 3",
      difficulty: "Facile",
      xp: 25,
      prompt: "Parmi a=3, b=9, c=5, affiche le plus grand.",
      starter: "a, b, c = 3, 9, 5\n",
      tests: [{ expected: "9", hint: "max(a, b, c)" }],
      solution: "a, b, c = 3, 9, 5\nprint(max(a, b, c))"
    },
    {
      id: "py-fizz",
      title: "Fizz (simplifié)",
      difficulty: "Moyen",
      xp: 30,
      prompt: "Pour n=15 : si multiple de 3 affiche Fizz, de 5 Buzz, des deux FizzBuzz, sinon n. Ici 15 → FizzBuzz.",
      starter: "n = 15\n",
      tests: [{ expected: "FizzBuzz", hint: "n % 3 == 0 and n % 5 == 0" }],
      solution: "n = 15\nif n % 3 == 0 and n % 5 == 0:\n    print('FizzBuzz')\nelif n % 3 == 0:\n    print('Fizz')\nelif n % 5 == 0:\n    print('Buzz')\nelse:\n    print(n)"
    },
    {
      id: "py-rev",
      title: "Inverser une chaîne",
      difficulty: "Moyen",
      xp: 25,
      prompt: "Inverse la chaîne s = 'prog-akartis' et affiche le résultat.",
      starter: "s = 'prog-akartis'\n",
      tests: [{ expected: "yddoc", hint: "s[::-1]" }],
      solution: "s = 'prog-akartis'\nprint(s[::-1])"
    },
    {
      id: "py-count",
      title: "Compter les voyelles",
      difficulty: "Moyen",
      xp: 30,
      prompt: "Compte les voyelles (a,e,i,o,u) dans 'education' et affiche le nombre.",
      starter: "s = 'education'\n",
      tests: [{ expected: "5", hint: "sum(1 for c in s if c in 'aeiou')" }],
      solution: "s = 'education'\nprint(sum(1 for c in s if c in 'aeiou'))"
    },
    {
      id: "py-fact",
      title: "Factorielle",
      difficulty: "Moyen",
      xp: 35,
      prompt: "Calcule 5! (120) avec une boucle ou math, puis affiche.",
      starter: "n = 5\n",
      tests: [{ expected: "120", hint: "res = 1; for i in range(1,n+1): res *= i" }],
      solution: "n = 5\nres = 1\nfor i in range(1, n + 1):\n    res *= i\nprint(res)"
    },
    {
      id: "py-pal",
      title: "Palindrome",
      difficulty: "Moyen",
      xp: 30,
      prompt: "Si 'radar' est un palindrome, affiche 'oui', sinon 'non'.",
      starter: "s = 'radar'\n",
      tests: [{ expected: "oui", hint: "s == s[::-1]" }],
      solution: "s = 'radar'\nprint('oui' if s == s[::-1] else 'non')"
    },
    {
      id: "py-unique",
      title: "Éléments uniques",
      difficulty: "Difficile",
      xp: 35,
      prompt: "À partir de [1,2,2,3,1], affiche le nombre d'éléments uniques.",
      starter: "nums = [1, 2, 2, 3, 1]\n",
      tests: [{ expected: "3", hint: "len(set(nums))" }],
      solution: "nums = [1, 2, 2, 3, 1]\nprint(len(set(nums)))"
    },
    {
      id: "py-two-sum-idx",
      title: "Deux nombres pour la cible",
      difficulty: "Difficile",
      xp: 40,
      prompt: "Dans [2,7,11,15], trouve si 2+7=9. Affiche 'oui' si une paire donne 9.",
      starter: "nums = [2, 7, 11, 15]\ntarget = 9\n",
      tests: [{ expected: "oui", hint: "boucle double ou set" }],
      solution: "nums = [2, 7, 11, 15]\ntarget = 9\nseen = set()\nfound = False\nfor n in nums:\n    if target - n in seen:\n        found = True\n        break\n    seen.add(n)\nprint('oui' if found else 'non')"
    }
  ],

  javascript: [
    {
      id: "js-sum",
      title: "Somme",
      difficulty: "Facile",
      xp: 20,
      prompt: "Fonction add(a,b) puis console.log(add(4,6)).",
      starter: "function add(a, b) {\n  // ...\n}\nconsole.log(add(4, 6));",
      tests: [{ expected: "10", hint: "return a + b" }],
      solution: "function add(a, b) {\n  return a + b;\n}\nconsole.log(add(4, 6));"
    },
    {
      id: "js-even",
      title: "Pair ou impair",
      difficulty: "Facile",
      xp: 20,
      prompt: "n = 7 → affiche 'impair'.",
      starter: "let n = 7;\n",
      tests: [{ expected: "impair", hint: "n % 2 === 0" }],
      solution: "let n = 7;\nconsole.log(n % 2 === 0 ? 'pair' : 'impair');"
    },
    {
      id: "js-map",
      title: "Doubler un tableau",
      difficulty: "Facile",
      xp: 25,
      prompt: "[1,2,3] → map *2 → affiche '2,4,6'.",
      starter: "let t = [1, 2, 3];\n",
      tests: [{ expected: "2,4,6", hint: "t.map(x => x*2).join(',')" }],
      solution: "let t = [1, 2, 3];\nconsole.log(t.map(x => x * 2).join(','));"
    },
    {
      id: "js-filter",
      title: "Filtrer les pairs",
      difficulty: "Moyen",
      xp: 25,
      prompt: "Garde les pairs de [1,2,3,4,5,6] → '2,4,6'.",
      starter: "let t = [1, 2, 3, 4, 5, 6];\n",
      tests: [{ expected: "2,4,6", hint: "filter(x => x%2===0)" }],
      solution: "let t = [1, 2, 3, 4, 5, 6];\nconsole.log(t.filter(x => x % 2 === 0).join(','));"
    },
    {
      id: "js-rev",
      title: "Inverser",
      difficulty: "Moyen",
      xp: 25,
      prompt: "Inverse 'javascript' et affiche.",
      starter: "let s = 'javascript';\n",
      tests: [{ expected: "tpircsavaj", hint: "split('').reverse().join('')" }],
      solution: "let s = 'javascript';\nconsole.log(s.split('').reverse().join(''));"
    },
    {
      id: "js-count",
      title: "Compter les a",
      difficulty: "Moyen",
      xp: 25,
      prompt: "Compte les 'a' dans 'banana' → 3.",
      starter: "let s = 'banana';\n",
      tests: [{ expected: "3", hint: "[...s].filter(c => c==='a').length" }],
      solution: "let s = 'banana';\nconsole.log([...s].filter(c => c === 'a').length);"
    },
    {
      id: "js-fact",
      title: "Factorielle",
      difficulty: "Moyen",
      xp: 30,
      prompt: "6! = 720, affiche le résultat.",
      starter: "let n = 6;\n",
      tests: [{ expected: "720", hint: "boucle ou récursion" }],
      solution: "let n = 6;\nlet r = 1;\nfor (let i = 1; i <= n; i++) r *= i;\nconsole.log(r);"
    },
    {
      id: "js-unique",
      title: "Uniques",
      difficulty: "Difficile",
      xp: 35,
      prompt: "Nombre d'uniques dans [1,1,2,3,3,3] → 3.",
      starter: "let t = [1, 1, 2, 3, 3, 3];\n",
      tests: [{ expected: "3", hint: "new Set(t).size" }],
      solution: "let t = [1, 1, 2, 3, 3, 3];\nconsole.log(new Set(t).size);"
    },
    {
      id: "js-async",
      title: "Promise simple",
      difficulty: "Difficile",
      xp: 35,
      prompt: "Promise.resolve(99).then(v => console.log(v))",
      starter: "",
      tests: [{ expected: "99", hint: "Promise.resolve(99).then(...)" }],
      solution: "Promise.resolve(99).then(v => console.log(v));"
    },
    {
      id: "js-reduce",
      title: "Somme avec reduce",
      difficulty: "Difficile",
      xp: 35,
      prompt: "Somme de [10,20,30] avec reduce → 60.",
      starter: "let t = [10, 20, 30];\n",
      tests: [{ expected: "60", hint: "t.reduce((a,b)=>a+b,0)" }],
      solution: "let t = [10, 20, 30];\nconsole.log(t.reduce((a, b) => a + b, 0));"
    }
  ],

  sql: [
    {
      id: "sql-1", title: "Tout sélectionner", difficulty: "Facile", xp: 15,
      prompt: "Sélectionne toutes les colonnes de la table users.",
      starter: "", tests: [{ expected: "SELECT * FROM users", type: "sql" }],
      solution: "SELECT * FROM users;"
    },
    {
      id: "sql-2", title: "Filtrer", difficulty: "Facile", xp: 20,
      prompt: "users avec age > 21.",
      starter: "", tests: [{ expected: "SELECT * FROM users WHERE age > 21", type: "sql" }],
      solution: "SELECT * FROM users WHERE age > 21;"
    },
    {
      id: "sql-3", title: "Trier", difficulty: "Facile", xp: 20,
      prompt: "users triés par name croissant.",
      starter: "", tests: [{ expected: "SELECT * FROM users ORDER BY name", type: "sql" }],
      solution: "SELECT * FROM users ORDER BY name;"
    },
    {
      id: "sql-4", title: "Compter", difficulty: "Moyen", xp: 25,
      prompt: "Nombre de lignes dans orders.",
      starter: "", tests: [{ expected: "SELECT COUNT(*) FROM orders", type: "sql" }],
      solution: "SELECT COUNT(*) FROM orders;"
    },
    {
      id: "sql-5", title: "Jointure", difficulty: "Moyen", xp: 30,
      prompt: "Jointure users et orders sur user_id.",
      starter: "", tests: [{ expected: "SELECT * FROM users JOIN orders ON users.id = orders.user_id", type: "sql" }],
      solution: "SELECT * FROM users JOIN orders ON users.id = orders.user_id;"
    },
    {
      id: "sql-6", title: "Grouper", difficulty: "Difficile", xp: 30,
      prompt: "Nombre de users par country.",
      starter: "", tests: [{ expected: "SELECT country, COUNT(*) FROM users GROUP BY country", type: "sql" }],
      solution: "SELECT country, COUNT(*) FROM users GROUP BY country;"
    }
  ],





  rust: [
    {
      id: "rs-1", title: "Hello", difficulty: "Facile", xp: 15,
      prompt: "Affiche Hello, Rust!",
      starter: 'println!("");', tests: [{ expected: "Hello, Rust!" }],
      solution: 'println!("Hello, Rust!");'
    },
    {
      id: "rs-2", title: "Variable", difficulty: "Facile", xp: 15,
      prompt: "Affiche 42",
      starter: "", tests: [{ expected: "42" }],
      solution: 'let n = 42;\nprintln!("{}", n);'
    },
    {
      id: "rs-3", title: "Ownership mot-clé", difficulty: "Moyen", xp: 25,
      prompt: "Affiche : ownership",
      starter: "", tests: [{ expected: "ownership" }],
      solution: 'println!("ownership");'
    }
  ],

  go: [
    {
      id: "go-1", title: "Hello", difficulty: "Facile", xp: 15,
      prompt: "Affiche Hello, Go!",
      starter: 'fmt.Println("")', tests: [{ expected: "Hello, Go!" }],
      solution: 'fmt.Println("Hello, Go!")'
    },
    {
      id: "go-2", title: "Goroutine concept", difficulty: "Moyen", xp: 25,
      prompt: "Affiche : goroutine",
      starter: "", tests: [{ expected: "goroutine" }],
      solution: 'fmt.Println("goroutine")'
    }
  ],

  java: [
    {
      id: "jv-1", title: "Hello", difficulty: "Facile", xp: 15,
      prompt: "Affiche Hello, Java!",
      starter: 'System.out.println("");', tests: [{ expected: "Hello, Java!" }],
      solution: 'System.out.println("Hello, Java!");'
    },
    {
      id: "jv-2", title: "main", difficulty: "Facile", xp: 15,
      prompt: "Affiche : main",
      starter: "", tests: [{ expected: "main" }],
      solution: 'System.out.println("main");'
    }
  ],

  typescript: [
    {
      id: "ts-1", title: "Hello TS", difficulty: "Facile", xp: 15,
      prompt: "Affiche Hello, TS!",
      starter: 'console.log("");', tests: [{ expected: "Hello, TS!" }],
      solution: 'console.log("Hello, TS!");'
    },
    {
      id: "ts-2", title: "Type number", difficulty: "Facile", xp: 15,
      prompt: "Affiche 42",
      starter: "", tests: [{ expected: "42" }],
      solution: "let n: number = 42;\nconsole.log(n);"
    }
  ],

  bash: [
    {
      id: "sh-1", title: "Echo", difficulty: "Facile", xp: 10,
      prompt: "Affiche Hello, Bash!",
      starter: 'echo ""', tests: [{ expected: "Hello, Bash!" }],
      solution: 'echo "Hello, Bash!"'
    },
    {
      id: "sh-2", title: "pwd concept", difficulty: "Facile", xp: 10,
      prompt: "Affiche : pwd",
      starter: "", tests: [{ expected: "pwd" }],
      solution: 'echo "pwd"'
    }
  ],

};

/** Liste des langages ayant des exercices */
window.AKARTIS_EXERCISE_LANGS = Object.keys(window.AKARTIS_EXERCISES);
