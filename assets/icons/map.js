/**
 * Icônes locales (Devicon) — PROG.AKARTIS
 * Fichiers dans /assets/icons/*.svg
 */
window.AKARTIS_ICON_MAP = {
  python: "python.svg",
  javascript: "javascript.svg",
  typescript: "typescript.svg",
  java: "java.svg",
  cpp: "cplusplus.svg",
  c: "c.svg",
  csharp: "csharp.svg",
  go: "go.svg",
  rust: "rust.svg",
  php: "php.svg",
  ruby: "ruby.svg",
  swift: "swift.svg",
  kotlin: "kotlin.svg",
  dart: "dart.svg",
  r: "r.svg",
  lua: "lua.svg",
  bash: "bash.svg",
  elixir: "elixir.svg",
  haskell: "haskell.svg",
  scala: "scala.svg",
  clojure: "clojure.svg",
  julia: "julia.svg",
  nim: "nim.svg",
  zig: "zig.svg",
  crystal: "crystal.svg",
  fsharp: "fsharp.svg",
  ocaml: "ocaml.svg",
  erlang: "erlang.svg",
  fortran: "fortran.svg",
  perl: "perl.svg",
  powershell: "powershell.svg",
  solidity: "solidity.svg",
  groovy: "groovy.svg",
  elm: "elm.svg",
  ballerina: "ballerina.svg",
  html: "html.svg",
  css: "css.svg",
  sql: "postgresql.svg",
  git: "git.svg",
  docker: "docker.svg",
  terminal: "bash.svg",
  linux: "linux.svg",
  flutter: "flutter.svg",
  capacitor: "android.svg",
  atomjs: "javascript.svg",
  aiprompts: "markdown.svg",
  assembly: "c.svg",
  vlang: "c.svg",
  gleam: "elixir.svg",
  awk: "bash.svg",
  cobol: "c.svg",
  prolog: "haskell.svg",
  scheme: "clojure.svg",
  racket: "clojure.svg",
};

/**
 * HTML d'icône pour un courseId
 * @param {string} id
 * @param {number} size
 * @param {string} [fallbackEmoji]
 */
window.akartisIcon = function (id, size, fallbackEmoji) {
  size = size || 32;
  const file = (window.AKARTIS_ICON_MAP || {})[id];
  if (file) {
    return (
      '<img class="lang-icon" src="assets/icons/' +
      file +
      '" width="' +
      size +
      '" height="' +
      size +
      '" alt="' +
      id +
      '" loading="lazy" />'
    );
  }
  const emoji = fallbackEmoji || "📄";
  return (
    '<span class="lang-icon-fallback" style="font-size:' +
    size * 0.7 +
    'px">' +
    emoji +
    "</span>"
  );
};
