const loginTitle = document.getElementById("login-title");
const alertBox = document.getElementById("login-alert");
const successBox = document.getElementById("login-success");

const loginForm = document.getElementById("login-form");
const loginEmailInput = document.getElementById("login-email");
const loginPasswordInput = document.getElementById("login-password");
const loginSubmitBtn = document.getElementById("login-submit");
const loginSubmitLabel = loginSubmitBtn?.querySelector(".c-btn__label");
const forgotToggleBtn = document.getElementById("forgot-toggle");

const forgotForm = document.getElementById("forgot-form");
const forgotEmailInput = document.getElementById("forgot-email");
const forgotSubmitBtn = document.getElementById("forgot-submit");
const forgotSubmitLabel = forgotSubmitBtn?.querySelector(".c-btn__label");
const forgotCancelBtn = document.getElementById("forgot-cancel");

const resetForm = document.getElementById("reset-form");
const resetTokenInput = document.getElementById("reset-token");
const resetPasswordInput = document.getElementById("reset-password");
const resetPasswordConfirmInput = document.getElementById("reset-password-confirm");
const resetSubmitBtn = document.getElementById("reset-submit");
const resetSubmitLabel = resetSubmitBtn?.querySelector(".c-btn__label");
const resetCancelBtn = document.getElementById("reset-cancel");

const MODE_LOGIN = "login";
const MODE_FORGOT = "forgot";
const MODE_RESET = "reset";
const AUTH_TOKEN_KEY = "caixa_auth_token";

function getStoredAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

function setStoredAuthToken(token) {
  try {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
  try {
    if (token) {
      document.cookie = `auth_token=${encodeURIComponent(token)}; Path=/; SameSite=Lax`;
    } else {
      document.cookie = "auth_token=; Max-Age=0; Path=/; SameSite=Lax";
    }
  } catch {
    // ignore cookie errors
  }
}

function authHeaders(extra = {}) {
  const token = getStoredAuthToken();
  const headers = { ...extra };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    headers["X-Auth-Token"] = token;
  }
  return headers;
}

function showError(message) {
  alertBox.textContent = message;
  alertBox.hidden = false;
  successBox.hidden = true;
}

function showSuccess(message) {
  successBox.textContent = message;
  successBox.hidden = false;
  alertBox.hidden = true;
}

function hideMessages() {
  alertBox.hidden = true;
  successBox.hidden = true;
  alertBox.textContent = "";
  successBox.textContent = "";
}

function setButtonLoading(button, labelNode, isLoading, loadingText, defaultText) {
  if (!button) {
    return;
  }
  button.disabled = isLoading;
  button.classList.toggle("is-loading", isLoading);
  if (labelNode) {
    labelNode.textContent = isLoading ? loadingText : defaultText;
  }
}

function setMode(mode) {
  hideMessages();
  loginForm.hidden = mode !== MODE_LOGIN;
  forgotForm.hidden = mode !== MODE_FORGOT;
  resetForm.hidden = mode !== MODE_RESET;

  if (mode === MODE_LOGIN) {
    loginTitle.textContent = "Entrar na conta";
  } else if (mode === MODE_FORGOT) {
    loginTitle.textContent = "Recuperar senha";
  } else {
    loginTitle.textContent = "Redefinir senha";
  }
}

function looksLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function tryLoadSession() {
  try {
    const response = await fetch("/api/account/profile", {
      method: "GET",
      credentials: "same-origin",
      headers: authHeaders({ Accept: "application/json" }),
    });
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    if (!data || !data.email) {
      return;
    }
    window.location.href = "/dashboard";
  } catch {
    // Ignora falhas de rede nessa verificacao inicial.
  }
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  hideMessages();

  const email = loginEmailInput.value.trim().toLowerCase();
  const password = loginPasswordInput.value;
  if (!email || !password) {
    showError("Informe email e senha.");
    return;
  }

  setButtonLoading(loginSubmitBtn, loginSubmitLabel, true, "Entrando...", "Entrar");
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      // Fallback padrao abaixo.
    }

    if (!response.ok) {
      if (response.status === 429) {
        showError("Muitas tentativas. Aguarde alguns minutos e tente novamente.");
      } else {
        showError(data?.error || "Falha na autenticação.");
      }
      loginPasswordInput.value = "";
      loginPasswordInput.focus();
      return;
    }

    setStoredAuthToken(String(data?.token || ""));
    loginForm.reset();
    window.location.href = "/dashboard";
  } catch {
    showError("Falha de rede ao tentar autenticar.");
  } finally {
    setButtonLoading(loginSubmitBtn, loginSubmitLabel, false, "Entrando...", "Entrar");
  }
}

async function handleForgotSubmit(event) {
  event.preventDefault();
  hideMessages();

  const email = forgotEmailInput.value.trim().toLowerCase();
  if (!looksLikeEmail(email)) {
    showError("Informe um e-mail válido.");
    forgotEmailInput.focus();
    return;
  }

  setButtonLoading(forgotSubmitBtn, forgotSubmitLabel, true, "Enviando...", "Enviar link");
  try {
    const response = await fetch("/api/auth/password/forgot", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email }),
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      // Fallback padrao abaixo.
    }

    if (!response.ok) {
      if (response.status === 429) {
        showError("Muitas tentativas. Aguarde alguns minutos.");
      } else {
        showError(data?.error || "Não foi possível enviar o link.");
      }
      return;
    }

    showSuccess(data?.message || "Se o e-mail estiver cadastrado, enviaremos o link de recuperação.");
  } catch {
    showError("Falha de rede ao solicitar recuperação.");
  } finally {
    setButtonLoading(forgotSubmitBtn, forgotSubmitLabel, false, "Enviando...", "Enviar link");
  }
}

async function handleResetSubmit(event) {
  event.preventDefault();
  hideMessages();

  const token = resetTokenInput.value.trim();
  const password = resetPasswordInput.value;
  const confirm = resetPasswordConfirmInput.value;

  if (!token) {
    showError("Token de recuperação ausente.");
    return;
  }
  if (password.length < 8) {
    showError("A nova senha deve ter pelo menos 8 caracteres.");
    resetPasswordInput.focus();
    return;
  }
  if (password !== confirm) {
    showError("As senhas não conferem.");
    resetPasswordConfirmInput.focus();
    return;
  }

  setButtonLoading(resetSubmitBtn, resetSubmitLabel, true, "Redefinindo...", "Redefinir senha");
  try {
    const response = await fetch("/api/auth/password/reset", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ token, password }),
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      // Fallback padrao abaixo.
    }

    if (!response.ok) {
      if (response.status === 429) {
        showError("Muitas tentativas. Aguarde alguns minutos.");
      } else {
        showError(data?.error || "Não foi possível redefinir a senha.");
      }
      return;
    }

    showSuccess("Senha redefinida. Faça login com a nova senha.");
    resetForm.reset();
    window.history.replaceState({}, "", "/");
    setMode(MODE_LOGIN);
    loginEmailInput.focus();
  } catch {
    showError("Falha de rede ao redefinir a senha.");
  } finally {
    setButtonLoading(resetSubmitBtn, resetSubmitLabel, false, "Redefinindo...", "Redefinir senha");
  }
}

function bindUiEvents() {
  loginForm?.addEventListener("submit", handleLoginSubmit);
  forgotForm?.addEventListener("submit", handleForgotSubmit);
  resetForm?.addEventListener("submit", handleResetSubmit);

  forgotToggleBtn?.addEventListener("click", () => {
    setMode(MODE_FORGOT);
    forgotEmailInput.value = loginEmailInput.value.trim().toLowerCase();
    forgotEmailInput.focus();
  });

  forgotCancelBtn?.addEventListener("click", () => {
    setMode(MODE_LOGIN);
    loginEmailInput.focus();
  });

  resetCancelBtn?.addEventListener("click", () => {
    window.history.replaceState({}, "", "/");
    setMode(MODE_LOGIN);
    loginEmailInput.focus();
  });
}

function resolveInitialMode() {
  const params = new URLSearchParams(window.location.search);
  const token = (params.get("reset_token") || "").trim();
  if (token) {
    resetTokenInput.value = token;
    setMode(MODE_RESET);
    resetPasswordInput.focus();
    return MODE_RESET;
  }

  setMode(MODE_LOGIN);
  return MODE_LOGIN;
}

bindUiEvents();
const initialMode = resolveInitialMode();
if (initialMode === MODE_LOGIN) {
  void tryLoadSession();
}

if ("serviceWorker" in navigator && window.isSecureContext) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {
      // Falha de registro nao bloqueia o app.
    });
  });
}
