/**
 * PROG.AKARTIS — Auth locale (register / login)
 * Stockage : localStorage (pas de serveur)
 */
(function (global) {
  const USERS_KEY = "prog-akartis-users";
  const SESSION_KEY = "prog-akartis-session";

  function loadUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    } catch {
      return [];
    }
  }
  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function hash(str) {
    // Hash simple non crypto (démo locale uniquement)
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    return "h" + (h >>> 0).toString(16);
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const Auth = {
    getSession() {
      try {
        return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      } catch {
        return null;
      }
    },
    isLoggedIn() {
      return !!this.getSession();
    },
    currentUser() {
      return this.getSession();
    },
    register({ name, email, password }) {
      name = (name || "").trim();
      email = (email || "").trim().toLowerCase();
      password = password || "";
      if (name.length < 2) return { ok: false, error: "Nom trop court (min. 2 caractères)." };
      if (!validateEmail(email)) return { ok: false, error: "Email invalide." };
      if (password.length < 6) return { ok: false, error: "Mot de passe trop court (min. 6 caractères)." };
      const users = loadUsers();
      if (users.some((u) => u.email === email)) {
        return { ok: false, error: "Un compte existe déjà avec cet email." };
      }
      const user = {
        id: "u_" + Date.now().toString(36),
        name,
        email,
        passwordHash: hash(password),
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      saveUsers(users);
      const session = { id: user.id, name: user.name, email: user.email };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { ok: true, user: session };
    },
    login({ email, password }) {
      email = (email || "").trim().toLowerCase();
      password = password || "";
      const users = loadUsers();
      const user = users.find((u) => u.email === email);
      if (!user || user.passwordHash !== hash(password)) {
        return { ok: false, error: "Email ou mot de passe incorrect." };
      }
      const session = { id: user.id, name: user.name, email: user.email };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { ok: true, user: session };
    },
    logout() {
      localStorage.removeItem(SESSION_KEY);
    },
  };

  function ensureModal() {
    if (document.getElementById("auth-modal")) return;
    const el = document.createElement("div");
    el.id = "auth-modal";
    el.className = "auth-modal hidden";
    el.innerHTML = `
      <div class="auth-backdrop" data-auth-close></div>
      <div class="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button type="button" class="auth-close" data-auth-close aria-label="Fermer">×</button>
        <div class="auth-tabs">
          <button type="button" class="auth-tab active" data-auth-tab="login">Connexion</button>
          <button type="button" class="auth-tab" data-auth-tab="register">Inscription</button>
        </div>
        <h2 id="auth-title" class="auth-title">Connexion</h2>
        <p class="auth-error hidden" id="auth-error"></p>

        <form id="auth-form-login" class="auth-form">
          <label>Email
            <input type="email" name="email" required autocomplete="email" placeholder="toi@email.com" />
          </label>
          <label>Mot de passe
            <input type="password" name="password" required autocomplete="current-password" placeholder="••••••••" minlength="6" />
          </label>
          <button type="submit" class="btn btn-primary btn-lg auth-submit">Se connecter</button>
        </form>

        <form id="auth-form-register" class="auth-form hidden">
          <label>Nom
            <input type="text" name="name" required autocomplete="name" placeholder="Ton prénom" minlength="2" />
          </label>
          <label>Email
            <input type="email" name="email" required autocomplete="email" placeholder="toi@email.com" />
          </label>
          <label>Mot de passe
            <input type="password" name="password" required autocomplete="new-password" placeholder="Min. 6 caractères" minlength="6" />
          </label>
          <button type="submit" class="btn btn-primary btn-lg auth-submit">Créer mon compte</button>
        </form>
        <p class="auth-note">Comptes stockés localement sur cet appareil (hors ligne).</p>
      </div>`;
    document.body.appendChild(el);

    el.querySelectorAll("[data-auth-close]").forEach((b) =>
      b.addEventListener("click", () => AuthUI.close())
    );
    el.querySelectorAll("[data-auth-tab]").forEach((b) =>
      b.addEventListener("click", () => AuthUI.showTab(b.dataset.authTab))
    );

    document.getElementById("auth-form-login").addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const res = Auth.login({
        email: fd.get("email"),
        password: fd.get("password"),
      });
      if (!res.ok) return AuthUI.showError(res.error);
      AuthUI.close();
      AuthUI.refreshHeader();
      if (typeof window.onAuthSuccess === "function") window.onAuthSuccess(res.user);
    });

    document.getElementById("auth-form-register").addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const res = Auth.register({
        name: fd.get("name"),
        email: fd.get("email"),
        password: fd.get("password"),
      });
      if (!res.ok) return AuthUI.showError(res.error);
      AuthUI.close();
      AuthUI.refreshHeader();
      if (typeof window.onAuthSuccess === "function") window.onAuthSuccess(res.user);
    });
  }

  const AuthUI = {
    open(tab) {
      ensureModal();
      document.getElementById("auth-modal").classList.remove("hidden");
      document.body.style.overflow = "hidden";
      this.showTab(tab || "login");
      this.showError("");
    },
    close() {
      const m = document.getElementById("auth-modal");
      if (m) m.classList.add("hidden");
      document.body.style.overflow = "";
    },
    showTab(tab) {
      const isLogin = tab === "login";
      document.querySelectorAll("[data-auth-tab]").forEach((b) => {
        b.classList.toggle("active", b.dataset.authTab === tab);
      });
      const title = document.getElementById("auth-title");
      if (title) title.textContent = isLogin ? "Connexion" : "Inscription";
      document.getElementById("auth-form-login").classList.toggle("hidden", !isLogin);
      document.getElementById("auth-form-register").classList.toggle("hidden", isLogin);
      this.showError("");
    },
    showError(msg) {
      const el = document.getElementById("auth-error");
      if (!el) return;
      if (!msg) {
        el.classList.add("hidden");
        el.textContent = "";
      } else {
        el.classList.remove("hidden");
        el.textContent = msg;
      }
    },
    refreshHeader() {
      const user = Auth.currentUser();
      document.querySelectorAll("[data-auth-area]").forEach((area) => {
        if (user) {
          area.innerHTML = `
            <span class="auth-user" title="${user.email}">👤 ${escapeHtml(user.name)}</span>
            <button type="button" class="btn btn-outline btn-sm" data-auth-logout>Déconnexion</button>`;
          area.querySelector("[data-auth-logout]")?.addEventListener("click", () => {
            Auth.logout();
            this.refreshHeader();
            if (typeof window.onAuthLogout === "function") window.onAuthLogout();
          });
        } else {
          area.innerHTML = `
            <button type="button" class="btn btn-outline btn-sm" data-auth-open="login">Connexion</button>
            <button type="button" class="btn btn-primary btn-sm" data-auth-open="register">S'inscrire</button>`;
          area.querySelectorAll("[data-auth-open]").forEach((b) =>
            b.addEventListener("click", () => this.open(b.dataset.authOpen))
          );
        }
      });
    },
    init() {
      ensureModal();
      this.refreshHeader();
      document.querySelectorAll("[data-auth-open]").forEach((b) => {
        b.addEventListener("click", (e) => {
          e.preventDefault();
          this.open(b.dataset.authOpen || "login");
        });
      });
    },
  };

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  global.Auth = Auth;
  global.AuthUI = AuthUI;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => AuthUI.init());
  } else {
    AuthUI.init();
  }
})(window);
