/**
 * Quizzes par cours – QCM + vrai/faux
 * Chaque question : { q, choices[], answer (index), explain }
 */
window.AKARTIS_QUIZZES = {
  python: {
    title: "Quiz Python",
    xp: 30,
    questions: [
      { q: "Quelle fonction affiche du texte en Python ?", choices: ["echo()", "print()", "console.log()", "printf()"], answer: 1, explain: "En Python on utilise print()." },
      { q: "Comment crée-t-on une variable ?", choices: ["var x = 1", "x := 1", "x = 1", "let x = 1"], answer: 2, explain: "Pas de mot-clé obligatoire : x = 1." },
      { q: "Que fait range(3) ?", choices: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "3"], answer: 1, explain: "range(n) va de 0 à n-1." },
      { q: "L'indentation est obligatoire en Python.", choices: ["Vrai", "Faux"], answer: 0, explain: "Oui, les blocs sont définis par l'indentation." },
      { q: "Comment accéder au 1er élément d'une liste L ?", choices: ["L(0)", "L[0]", "L{0}", "L.1"], answer: 1, explain: "Indexation avec des crochets, à partir de 0." },
      { q: "Que retourne len([1,2,3]) ?", choices: ["2", "3", "4", "Erreur"], answer: 1, explain: "len compte le nombre d'éléments." },
      { q: "Une f-string s'écrit :", choices: ['f"Bonjour {nom}"', '"Bonjour {nom}"f', "f'Bonjour'+nom", "fmt(nom)"], answer: 0, explain: "Préfixe f et accolades pour les variables." },
      { q: "def sert à définir :", choices: ["Une variable", "Une fonction", "Une classe uniquement", "Un module"], answer: 1, explain: "def nom(): définit une fonction." }
    ]
  },
  javascript: {
    title: "Quiz JavaScript",
    xp: 30,
    questions: [
      { q: "Comment afficher dans la console ?", choices: ["print()", "echo()", "console.log()", "System.out"], answer: 2, explain: "console.log() est la méthode standard." },
      { q: "Quelle déclaration pour une constante ?", choices: ["var", "let", "const", "final"], answer: 2, explain: "const = valeur qui ne doit pas être réassignée." },
      { q: "=== compare :", choices: ["Valeur seulement", "Valeur et type", "Type seulement", "Références"], answer: 1, explain: "=== est l'égalité stricte." },
      { q: "Les tableaux commencent à l'index :", choices: ["1", "0", "-1", "Selon le navigateur"], answer: 1, explain: "Comme en Python, index 0." },
      { q: "Une arrow function :", choices: ["function => {}", "() => {}", "-> {}", "lambda:"], answer: 1, explain: "Syntaxe : (params) => expression." },
      { q: "typeof null renvoie :", choices: ['"null"', '"undefined"', '"object"', '"number"'], answer: 2, explain: "Particularité historique de JS : typeof null === 'object'." },
      { q: "Array.map() :", choices: ["Modifie le tableau", "Retourne un nouveau tableau", "Supprime des éléments", "Trie"], answer: 1, explain: "map transforme et renvoie un nouveau tableau." },
      { q: "Une Promise représente :", choices: ["Une boucle", "Une valeur future", "Un objet DOM", "Une erreur"], answer: 1, explain: "Promise = résultat éventuel d'une opération async." }
    ]
  },
  sql: {
    title: "Quiz SQL",
    xp: 25,
    questions: [
      { q: "SELECT * FROM users signifie :", choices: ["Supprimer users", "Toutes les colonnes de users", "Créer users", "Compter users"], answer: 1, explain: "* = toutes les colonnes." },
      { q: "WHERE sert à :", choices: ["Trier", "Filtrer les lignes", "Joindre", "Grouper"], answer: 1, explain: "WHERE filtre les résultats." },
      { q: "ORDER BY name ASC :", choices: ["Supprime name", "Trie par name croissant", "Renomme name", "Compte name"], answer: 1, explain: "ASC = croissant." },
      { q: "INSERT INTO ajoute :", choices: ["Une table", "Des lignes", "Un index", "Une vue"], answer: 1, explain: "INSERT ajoute des enregistrements." },
      { q: "JOIN combine :", choices: ["Deux bases", "Des tables liées", "Deux serveurs", "Des fichiers"], answer: 1, explain: "JOIN relie des tables via une condition." },
      { q: "COUNT(*) avec GROUP BY :", choices: ["Compte tout sans groupe", "Compte par groupe", "Supprime des lignes", "Trie"], answer: 1, explain: "Agrégation par groupe." }
    ]
  },
  java: {
    title: "Quiz Java",
    xp: 25,
    questions: [
      { q: "Point d'entrée d'un programme Java ?", choices: ["start()", "main(String[] args)", "init()", "run()"], answer: 1, explain: "public static void main(String[] args)." },
      { q: "Afficher du texte :", choices: ["print()", "console.log", "System.out.println", "echo"], answer: 2, explain: "System.out.println(...)." },
      { q: "int est un type :", choices: ["Objet", "Primitif entier", "Décimal", "Texte"], answer: 1, explain: "int = entier primitif." },
      { q: "Les tableaux en Java ont une taille :", choices: ["Dynamique toujours", "Fixe à la création", "Illimitée", "Variable sans déclaration"], answer: 1, explain: "Taille fixée à l'allocation." },
      { q: "Une classe définit :", choices: ["Uniquement des variables", "Un type d'objets", "Un package", "Un fichier système"], answer: 1, explain: "Classe = modèle pour créer des objets." }
    ]
  },
  javascript_extra: null, // placeholder
  go: {
    title: "Quiz Go",
    xp: 20,
    questions: [
      { q: "Package obligatoire du point d'entrée ?", choices: ["lib", "main", "go", "fmt"], answer: 1, explain: "package main + func main()." },
      { q: "Afficher avec le package standard :", choices: ["print()", "fmt.Println", "console.log", "echo"], answer: 1, explain: "fmt.Println dans package fmt." },
      { q: "Déclaration courte d'une variable :", choices: ["var x = 1", "x := 1", "let x = 1", "x = 1 seulement"], answer: 1, explain: ":= déduit le type dans une fonction." },
      { q: "Go est connu pour :", choices: ["Le DOM", "La concurrence (goroutines)", "Les applets", "Le styling"], answer: 1, explain: "Goroutines et channels." }
    ]
  },
  typescript: {
    title: "Quiz TypeScript",
    xp: 20,
    questions: [
      { q: "TypeScript ajoute surtout :", choices: ["Un runtime", "Des types statiques", "Un DOM", "SQL"], answer: 1, explain: "Typage statique au-dessus de JS." },
      { q: "let n: number = 42 déclare :", choices: ["Une string", "Un nombre", "Un booléen", "Un any"], answer: 1, explain: "Annotation de type number." },
      { q: "Une interface décrit :", choices: ["Un fichier CSS", "La forme d'un objet", "Une base de données", "Un serveur"], answer: 1, explain: "Contrat de structure." },
      { q: "TypeScript compile vers :", choices: ["Python", "JavaScript", "Bytecode JVM", "WASM uniquement"], answer: 1, explain: "tsc émet du JavaScript." }
    ]
  },
  rust: {
    title: "Quiz Rust",
    xp: 20,
    questions: [
      { q: "Afficher en Rust :", choices: ["print!", "println!", "console.log", "echo"], answer: 1, explain: "println! macro." },
      { q: "let mut indique :", choices: ["Une constante", "Une variable mutable", "Un type", "Un module"], answer: 1, explain: "mut = mutable." },
      { q: "L'ownership sert à :", choices: ["Le styling", "La sécurité mémoire", "Le réseau", "Les GUI"], answer: 1, explain: "Un seul propriétaire pour éviter les bugs mémoire." },
      { q: "for i in 0..3 itère :", choices: ["1,2,3", "0,1,2", "0,1,2,3", "3,2,1"], answer: 1, explain: "Range exclusive à droite." }
    ]
  },
  php: {
    title: "Quiz PHP",
    xp: 15,
    questions: [
      { q: "Les variables PHP commencent par :", choices: ["var", "$", "@", "#"], answer: 1, explain: "$nom." },
      { q: "Afficher du texte :", choices: ["print_only", "echo", "console.log", "printf_js"], answer: 1, explain: "echo ou print." },
      { q: "PHP s'exécute surtout :", choices: ["Dans le navigateur uniquement", "Côté serveur", "Sur GPU", "Dans Excel"], answer: 1, explain: "Langage serveur (HTML généré)." }
    ]
  }
};

/** Associe un quiz disponible à un courseId (si le quiz existe) */
window.getQuizForCourse = function (courseId) {
  return window.AKARTIS_QUIZZES[courseId] || null;
};
