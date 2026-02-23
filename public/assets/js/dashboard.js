const periodEl = document.getElementById("dash-period");
const userTitleEl = document.getElementById("dash-user-title");
const balanceHeadEl = document.getElementById("dash-balance-head");
const entriesMetaEl = document.getElementById("dash-entries-meta");
const errorEl = document.getElementById("dash-error");
const infoEl = document.getElementById("dash-info");
const logoutBtn = document.getElementById("dash-logout-menu");
const refreshBtn = document.getElementById("dash-refresh-menu");

const kpiBalance = document.getElementById("kpi-balance");
const trendLabel = document.getElementById("kpi-trend-label");
const budgetLine = document.getElementById("dash-budget-line");
const trendLine = document.getElementById("dash-trend-line");

const reviewList = document.getElementById("review-list");
const reviewActionEl = document.getElementById("review-action");
const nextList = document.getElementById("next-list");
const catGrid = document.getElementById("cat-grid");
const entriesList = document.getElementById("entries-list");

const tabButtons = Array.from(document.querySelectorAll(".dash-tab"));
const tabSections = Array.from(document.querySelectorAll("[data-tab-content]"));
const tabNavShell = document.querySelector(".dash-nav-shell");
const tabNavWrap = document.querySelector(".dash-nav-wrap");
const rootApp = document.querySelector("ion-app");

const entryModal = document.getElementById("entry-modal");
const openEntryBtn = document.getElementById("open-entry");
const closeEntryBtn = document.getElementById("close-entry");
const cancelEntryBtn = document.getElementById("cancel-entry");
const saveEntryBtn = document.getElementById("save-entry");
const entryTypeInput = document.getElementById("entry-type");
const entryAmountInput = document.getElementById("entry-amount");
const openCategoryBtn = document.getElementById("open-category");
const selectedCategoryEl = document.getElementById("selected-category");
const categoryModal = document.getElementById("entry-category-modal");
const closeCategoryModalBtn = document.getElementById("close-category-modal");
const categorySearchInput = document.getElementById("category-search");
const categoryListEl = document.getElementById("category-list");
const entryDescriptionInput = document.getElementById("entry-description");
const openDateBtn = document.getElementById("open-date");
const selectedDateEl = document.getElementById("selected-date");
const dateModal = document.getElementById("entry-date-modal");
const closeDateModalBtn = document.getElementById("close-date-modal");
const datePicker = document.getElementById("entry-date-picker");
const openAttachmentBtn = document.getElementById("open-attachment");
const attachmentInput = document.getElementById("entry-attachment-file");
const attachmentNameEl = document.getElementById("attachment-name");
const attachmentPreview = document.getElementById("attachment-preview");
const attachmentPreviewImage = document.getElementById("attachment-preview-image");
const attachmentPreviewPdf = document.getElementById("attachment-preview-pdf");
const attachmentPreviewName = document.getElementById("attachment-preview-name");
const clearAttachmentBtn = document.getElementById("clear-attachment");
let selectedDateISO = "";
let selectedCategoryValue = "";
let selectedAttachmentFile = null;
let categories = [];
let savingEntry = false;
const AUTH_TOKEN_KEY = "caixa_auth_token";

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const moneyNoSymbol = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const CATEGORY_GLYPH = {
  salario: "account_balance_wallet",
  investimento: "trending_up",
  rend: "monitoring",
  aluguel: "home_work",
  cartao: "credit_card",
  servico: "construction",
  dizimo: "volunteer_activism",
  mercado: "shopping_cart",
  restaurante: "restaurant",
  alimentacao: "restaurant",
  casa: "home",
  transporte: "directions_car",
  internet: "wifi",
  saude: "health_and_safety",
  lazer: "movie",
  assinatura: "subscriptions",
  educacao: "school",
  default: "payments",
};

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
  infoEl.hidden = true;
  if (entriesMetaEl && String(entriesMetaEl.textContent || "").trim() === "--") {
    entriesMetaEl.textContent = "Sem dados no período";
  }
}

function getStoredAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY) || "";
  } catch {
    return "";
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

function showInfo(message) {
  infoEl.textContent = message;
  infoEl.hidden = false;
}

function hideMessages() {
  errorEl.hidden = true;
  infoEl.hidden = true;
  errorEl.textContent = "";
  infoEl.textContent = "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function showTab(tabName) {
  const previousActive = tabButtons.find((button) => button.classList.contains("is-active"));
  const transitionToken = ++navTransitionToken;
  tabSections.forEach((section) => {
    section.hidden = section.dataset.tabContent !== tabName;
  });
  tabButtons.forEach((button) => {
    const isActive = button.dataset.tab === tabName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  const active = tabButtons.find((button) => button.classList.contains("is-active"));
  triggerTabLiquidFill(previousActive, active, transitionToken);

  requestAnimationFrame(() => {
    void scrollActiveTabIntoView(transitionToken);
  });
}

function ensureTabFillLayers() {
  return;
}

function syncTabPill() {
  return;
}

function triggerTabLiquidFill(previousActive, active, transitionToken) {
  if (!active || transitionToken !== navTransitionToken) return;

  const prevIndex = previousActive ? tabButtons.indexOf(previousActive) : -1;
  const currIndex = tabButtons.indexOf(active);
  const direction = prevIndex !== -1 ? Math.sign(currIndex - prevIndex) || 1 : 1;
  const liquidClasses = ["liquid-fill-from-left", "liquid-fill-from-right"];

  tabButtons.forEach((button) => {
    liquidClasses.forEach((className) => button.classList.remove(className));
  });

  // Force animation restart reliably on the active tab only.
  if (active) {
    void active.offsetWidth;
  }

  active.classList.add(direction > 0 ? "liquid-fill-from-right" : "liquid-fill-from-left");

  window.setTimeout(() => {
    liquidClasses.forEach((className) => active.classList.remove(className));
  }, 360);
}

let navScrollFrame = null;
let navTransitionToken = 0;
function cancelNavScrollAnimation() {
  if (navScrollFrame !== null) {
    cancelAnimationFrame(navScrollFrame);
    navScrollFrame = null;
  }
}

function animateNavScrollTo(targetLeft, duration = 520, transitionToken = navTransitionToken) {
  if (!tabNavWrap) return Promise.resolve(false);
  cancelNavScrollAnimation();

  const startLeft = tabNavWrap.scrollLeft;
  const distance = targetLeft - startLeft;
  if (Math.abs(distance) < 1) return Promise.resolve(false);

  return new Promise((resolve) => {
    const startAt = performance.now();
    const step = (now) => {
      if (transitionToken !== navTransitionToken) {
        cancelNavScrollAnimation();
        resolve(false);
        return;
      }
      const t = Math.max(0, Math.min(1, (now - startAt) / duration));
      const eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
      tabNavWrap.scrollLeft = startLeft + (distance * eased);
      if (t < 1) {
        navScrollFrame = requestAnimationFrame(step);
        return;
      }
      navScrollFrame = null;
      resolve(true);
    };
    navScrollFrame = requestAnimationFrame(step);
  });
}

function scrollActiveTabIntoView(transitionToken = navTransitionToken) {
  if (!tabNavWrap) return Promise.resolve(false);
  if (transitionToken !== navTransitionToken) return Promise.resolve(false);
  const active = tabButtons.find((button) => button.classList.contains("is-active"));
  if (!active) return Promise.resolve(false);
  const navCss = getComputedStyle(tabNavShell || tabNavWrap);
  const leftFade = parseFloat(navCss.getPropertyValue("--tab-fade-left-w")) || 0;
  const rightFade = parseFloat(navCss.getPropertyValue("--tab-fade-right-w")) || 60;
  const fadeInset = parseFloat(navCss.getPropertyValue("--tab-fade-inset")) || 0;
  const safeLeft = parseFloat(navCss.getPropertyValue("--tab-safe-left")) || 8;
  const safeRight = parseFloat(navCss.getPropertyValue("--tab-safe-right")) || 28;
  const leftSafe = fadeInset + leftFade + safeLeft;
  const rightSafe = fadeInset + rightFade + safeRight;
  const currentLeft = tabNavWrap.scrollLeft;
  const viewport = tabNavWrap.clientWidth;
  const currentRight = currentLeft + viewport;
  const itemLeft = active.offsetLeft;
  const itemRight = itemLeft + active.offsetWidth;
  const safeLeftBound = currentLeft + leftSafe;
  const safeRightBound = currentRight - rightSafe;
  const centeredScroll = itemLeft + (active.offsetWidth / 2) - (viewport / 2);

  let targetScroll = centeredScroll;
  if (itemLeft < safeLeftBound) targetScroll = Math.min(targetScroll, itemLeft - leftSafe);
  if (itemRight > safeRightBound) targetScroll = Math.max(targetScroll, itemRight - viewport + rightSafe);

  const maxScroll = Math.max(0, tabNavWrap.scrollWidth - tabNavWrap.clientWidth);
  const clamped = Math.max(0, Math.min(targetScroll, maxScroll));
  if (Math.abs(clamped - currentLeft) > 1) {
    return animateNavScrollTo(clamped, 620, transitionToken);
  }
  return Promise.resolve(false);
}

function setupTabDragScroll() {
  if (!tabNavWrap) return;
  let dragging = false;
  let startX = 0;
  let startScroll = 0;
  let lastX = 0;
  let lastT = 0;
  let velocity = 0;
  let momentumFrame = null;

  const stopMomentum = () => {
    if (momentumFrame !== null) {
      cancelAnimationFrame(momentumFrame);
      momentumFrame = null;
    }
  };

  const startMomentum = () => {
    stopMomentum();
    const step = () => {
      if (Math.abs(velocity) < 0.08) {
        momentumFrame = null;
        return;
      }
      tabNavWrap.scrollLeft -= velocity * 16;
      velocity *= 0.92;
      momentumFrame = requestAnimationFrame(step);
    };
    momentumFrame = requestAnimationFrame(step);
  };

  tabNavWrap.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    navTransitionToken += 1;
    cancelNavScrollAnimation();
    stopMomentum();
    dragging = true;
    startX = event.clientX;
    startScroll = tabNavWrap.scrollLeft;
    lastX = event.clientX;
    lastT = performance.now();
    velocity = 0;
    tabNavWrap.classList.add("is-dragging");
    tabNavWrap.setPointerCapture(event.pointerId);
  });

  tabNavWrap.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const deltaX = event.clientX - startX;
    tabNavWrap.scrollLeft = startScroll - deltaX;
    const now = performance.now();
    const dt = Math.max(1, now - lastT);
    const dx = event.clientX - lastX;
    velocity = dx / dt;
    lastX = event.clientX;
    lastT = now;
  });

  const stopDragging = (event) => {
    if (!dragging) return;
    dragging = false;
    tabNavWrap.classList.remove("is-dragging");
    startMomentum();
    if (event && typeof event.pointerId === "number") {
      try {
        tabNavWrap.releasePointerCapture(event.pointerId);
      } catch {
        // ignore capture errors
      }
    }
  };

  tabNavWrap.addEventListener("pointerup", stopDragging);
  tabNavWrap.addEventListener("pointercancel", stopDragging);
  tabNavWrap.addEventListener("lostpointercapture", stopDragging);
  tabNavWrap.addEventListener("scroll", syncTabPill, { passive: true });
}

function setupTabNav() {
  if (!tabButtons.length || !tabSections.length) return;
  ensureTabFillLayers();

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabName = String(button.dataset.tab || "");
      if (!tabName) return;
      showTab(tabName);
    });
  });

  showTab("painel");
  window.addEventListener("resize", syncTabPill, { passive: true });
  setupTabDragScroll();
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function categoryGlyph(name) {
  const key = normalizeText(name);
  for (const token of Object.keys(CATEGORY_GLYPH)) {
    if (token !== "default" && key.includes(token)) return CATEGORY_GLYPH[token];
  }
  return CATEGORY_GLYPH.default;
}

function movementGlyph(item) {
  if (item?.type === "out") return "arrow_upward";
  if (item?.type === "in") return "arrow_downward";
  return categoryGlyph(item?.category || item?.description || "");
}

function monthRange() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${year}-${month}`;
}

function periodLabel() {
  const now = new Date();
  return now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatIsoDate(isoDate) {
  if (!isoDate) return "";
  const [year, month, day] = String(isoDate).split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`;
}

function parseMoneyInput(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return 0;
  return Number(digits) / 100;
}

function formatMoneyInput(value) {
  return moneyNoSymbol.format(value);
}

function renderAmountInput(rawValue) {
  const numeric = parseMoneyInput(rawValue);
  if (entryAmountInput) {
    entryAmountInput.value = formatMoneyInput(numeric);
  }
  return numeric;
}

function formatAttachmentLabel(name) {
  const text = String(name || "").trim();
  if (!text) return "Toque para anexar foto ou PDF";
  if (text.length <= 34) return text;
  return `${text.slice(0, 16)}...${text.slice(-14)}`;
}

function setPickerExpanded(element, expanded) {
  if (!element) return;
  element.setAttribute("aria-expanded", expanded ? "true" : "false");
}

function setEntryLayerState(open) {
  rootApp?.classList.toggle("is-entry-open", Boolean(open));
}

function refreshPickerLayerState() {
  // no-op: modal separator handled purely by CSS on .sheet-modal::before
}

function setEntryTheme(type) {
  if (!entryModal) return;
  entryModal.classList.remove("entry-theme--in", "entry-theme--out", "entry-theme--neutral");
  if (type === "in") {
    entryModal.classList.add("entry-theme--in");
    return;
  }
  if (type === "out") {
    entryModal.classList.add("entry-theme--out");
    return;
  }
  entryModal.classList.add("entry-theme--neutral");
}

function setSaveButtonVisualState(state = "idle") {
  if (!saveEntryBtn) return;
  const isDisabled = state === "disabled" || state === "saving";
  saveEntryBtn.disabled = isDisabled;
  saveEntryBtn.textContent = state === "saving" ? "Salvando..." : "Salvar";
  saveEntryBtn.classList.toggle("is-saving", state === "saving");
}

function updateEntryFlowUi() {
  if (openCategoryBtn) openCategoryBtn.disabled = false;
  if (openDateBtn) openDateBtn.disabled = false;
  if (openAttachmentBtn) openAttachmentBtn.disabled = false;
  if (entryDescriptionInput) entryDescriptionInput.disabled = false;
}

function setAttachmentPreview(file) {
  if (!file) {
    if (attachmentPreview) attachmentPreview.hidden = true;
    if (attachmentPreviewImage) {
      attachmentPreviewImage.hidden = true;
      attachmentPreviewImage.removeAttribute("src");
    }
    if (attachmentPreviewPdf) {
      attachmentPreviewPdf.hidden = true;
      attachmentPreviewPdf.removeAttribute("src");
    }
    if (attachmentPreviewName) attachmentPreviewName.textContent = "";
    if (attachmentNameEl) {
      attachmentNameEl.textContent = "Toque para anexar foto ou PDF";
      attachmentNameEl.classList.add("is-placeholder");
    }
    return;
  }

  const fileName = String(file.name || "arquivo");
  const type = String(file.type || "").toLowerCase();

  if (attachmentNameEl) {
    attachmentNameEl.textContent = formatAttachmentLabel(fileName);
    attachmentNameEl.classList.remove("is-placeholder");
  }
  if (attachmentPreviewName) attachmentPreviewName.textContent = fileName;
  if (attachmentPreview) attachmentPreview.hidden = false;

  const isPdf = type === "application/pdf" || fileName.toLowerCase().endsWith(".pdf");
  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = String(reader.result || "");
    if (!dataUrl) return;
    if (isPdf) {
      if (attachmentPreviewPdf) {
        attachmentPreviewPdf.src = dataUrl;
        attachmentPreviewPdf.hidden = false;
      }
      if (attachmentPreviewImage) {
        attachmentPreviewImage.hidden = true;
        attachmentPreviewImage.removeAttribute("src");
      }
      return;
    }
    if (attachmentPreviewImage) {
      attachmentPreviewImage.src = dataUrl;
      attachmentPreviewImage.hidden = false;
    }
    if (attachmentPreviewPdf) {
      attachmentPreviewPdf.hidden = true;
      attachmentPreviewPdf.removeAttribute("src");
    }
  };
  reader.onerror = () => {
    clearAttachmentSelection();
    showError("Não foi possível carregar a pré-visualização do comprovante.");
  };
  reader.readAsDataURL(file);
}

function clearAttachmentSelection() {
  selectedAttachmentFile = null;
  if (attachmentInput) attachmentInput.value = "";
  setAttachmentPreview(null);
}

async function openCategorySheet() {
  await closeDateSheet();
  await categoryModal?.present();
  setPickerExpanded(openCategoryBtn, true);
  refreshPickerLayerState();
  setTimeout(() => {
    categorySearchInput?.setFocus?.();
  }, 30);
}

async function closeCategorySheet() {
  try {
    await categoryModal?.dismiss();
  } catch {
    // no-op: modal may already be closed
  }
  setPickerExpanded(openCategoryBtn, false);
  refreshPickerLayerState();
}

async function openDateSheet() {
  await closeCategorySheet();
  await dateModal?.present();
  setPickerExpanded(openDateBtn, true);
  refreshPickerLayerState();
}

async function closeDateSheet() {
  try {
    await dateModal?.dismiss();
  } catch {
    // no-op: modal may already be closed
  }
  setPickerExpanded(openDateBtn, false);
  refreshPickerLayerState();
}

function isEntryFormValid() {
  const type = String(entryTypeInput?.value || "").trim();
  const amount = parseMoneyInput(entryAmountInput?.value || "");
  const category = String(selectedCategoryValue || "").trim();
  const date = String(selectedDateISO || "").slice(0, 10).trim();
  return ["in", "out"].includes(type)
    && Number.isFinite(amount)
    && amount > 0
    && category.length > 0
    && /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function updateSaveState() {
  updateEntryFlowUi();
  if (savingEntry) {
    setSaveButtonVisualState("saving");
    return;
  }
  setSaveButtonVisualState(isEntryFormValid() ? "idle" : "disabled");
}

function renderCategoryOptions(type = "") {
  if (!categoryListEl) return;
  const selectedType = String(type || "");
  const filtered = categories.filter((category) => {
    const categoryType = String(category?.type || "").trim();
    return !selectedType || !categoryType || categoryType === selectedType;
  });
  const query = String(categorySearchInput?.value || "").trim().toLowerCase();
  const searched = filtered.filter((category) =>
    String(category?.name || "").toLowerCase().includes(query)
  );

  if (!searched.length) {
    categoryListEl.innerHTML = `<p class="category-empty">Nenhuma categoria encontrada.</p>`;
    return;
  }

  categoryListEl.innerHTML = searched
    .map((category) => {
      const label = String(category?.name || "").trim();
      const safeLabel = escapeHtml(label);
      const encodedLabel = encodeURIComponent(label);
      const isSelected = selectedCategoryValue === label;
      return `<button type="button" class="category-option" data-category="${encodedLabel}"${isSelected ? ' aria-current="true"' : ""}>${safeLabel}</button>`;
    })
    .join("");
}

function toAmountClass(value) {
  if (value < 0) return "neg";
  if (value > 0) return "pos";
  return "";
}

function polylinePoints(series) {
  if (!Array.isArray(series) || series.length === 0) return "0,44 200,44";
  const values = series.map((point) => Number(point.month_balance || 0));
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 200;
      const y = 54 - ((value - min) / span) * 40;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function asDateLabel(isoDate) {
  if (!isoDate) return "Sem data";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "Sem data";
  return date.toLocaleDateString("pt-BR");
}

function rowTemplate(item, mode) {
  const amount = Number(item.amount || 0);
  const signed = item.type === "out" ? -Math.abs(amount) : Math.abs(amount);
  const amountClass = toAmountClass(signed);
  const title = escapeHtml(item.description || item.category || "Movimento");
  const category = escapeHtml(item.category || "Sem categoria");
  const subtitle = mode === "next"
    ? `Vence em ${asDateLabel(item.date)}`
    : mode === "entry"
      ? `${asDateLabel(item.date)} - ${category}`
      : category;

  return `
    <div class="row">
      <div class="icon-circle"><span class="material-symbols-rounded">${mode === "entry" ? movementGlyph(item) : categoryGlyph(item.category || item.description || "")}</span></div>
      <div>
        <div class="row-title">${title}</div>
        <div class="row-meta">${subtitle}</div>
      </div>
      <div class="row-value ${amountClass}">${money.format(signed)}</div>
    </div>
  `;
}

function renderRows(container, items, mode, emptyText) {
  if (!Array.isArray(items) || items.length === 0) {
    container.innerHTML = `
      <div class="row">
        <div class="icon-circle"><span class="material-symbols-rounded">check</span></div>
        <div>
          <div class="row-title">Sem itens</div>
          <div class="row-meta">${escapeHtml(emptyText)}</div>
        </div>
        <div class="row-value pos">OK</div>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map((item) => rowTemplate(item, mode)).join("");
}

function sortEntriesByDateDesc(items) {
  return [...items].sort((a, b) => {
    const dateA = String(a?.date || "");
    const dateB = String(b?.date || "");
    const byDate = dateB.localeCompare(dateA);
    if (byDate !== 0) return byDate;
    const updatedA = String(a?.updated_at || a?.created_at || "");
    const updatedB = String(b?.updated_at || b?.created_at || "");
    return updatedB.localeCompare(updatedA);
  });
}

function renderCategories(items) {
  const top = (Array.isArray(items) ? items : []).slice(0, 4);
  if (!top.length) {
    catGrid.innerHTML = `
      <div class="budget-item">
        <div class="budget-ring">
          <svg class="budget-ring__svg" viewBox="0 0 36 36" aria-hidden="true">
            <circle class="budget-ring__track" cx="18" cy="18" r="15.915"></circle>
            <circle class="budget-ring__value" cx="18" cy="18" r="15.915" pathLength="100" stroke-dasharray="7 100"></circle>
          </svg>
          <span class="budget-ring__inner"><span class="material-symbols-rounded">savings</span></span>
        </div>
        <span>Sem dados</span>
      </div>
    `;
    return;
  }

  catGrid.innerHTML = top
    .map((item) => {
      const pct = Number(item.share || 0);
      const fill = Math.max(4, Math.min(98, Math.round(pct)));
      const name = escapeHtml(item.name || "Categoria");
      return `
        <div class="budget-item" title="${name}">
          <div class="budget-ring">
            <svg class="budget-ring__svg" viewBox="0 0 36 36" aria-hidden="true">
              <circle class="budget-ring__track" cx="18" cy="18" r="15.915"></circle>
              <circle class="budget-ring__value" cx="18" cy="18" r="15.915" pathLength="100" stroke-dasharray="${fill} 100"></circle>
            </svg>
            <span class="budget-ring__inner"><span class="material-symbols-rounded">${categoryGlyph(item.name)}</span></span>
          </div>
          <span>${money.format(Number(item.out || 0))}</span>
        </div>
      `;
    })
    .join("");
}

async function loadCategories() {
  try {
    const response = await authFetch("/api/categories");
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    if (!response.ok) {
      categories = [];
      renderCategoryOptions(entryTypeInput?.value || "");
      return;
    }
    const data = await response.json();
    categories = Array.isArray(data) ? data : [];
    renderCategoryOptions(entryTypeInput?.value || "");
  } catch {
    categories = [];
    renderCategoryOptions(entryTypeInput?.value || "");
  }
}

async function uploadAttachment(file) {
  if (!file) return null;
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    credentials: "same-origin",
    headers: authHeaders(),
    body: formData,
  });

  if (response.status === 401) {
    window.location.href = "/";
    return null;
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok || !data?.file) {
    throw new Error(data?.error || "Não foi possível enviar o comprovante.");
  }

  return String(data.file);
}

function resetEntryForm() {
  if (entryTypeInput) entryTypeInput.value = "";
  setEntryTheme("");
  if (entryAmountInput) entryAmountInput.value = formatMoneyInput(0);
  selectedCategoryValue = "";
  if (categorySearchInput) categorySearchInput.value = "";
  if (selectedCategoryEl) {
    selectedCategoryEl.textContent = "Selecionar categoria";
    selectedCategoryEl.classList.add("is-placeholder");
  }
  setPickerExpanded(openCategoryBtn, false);
  if (entryDescriptionInput) entryDescriptionInput.value = "";
  selectedDateISO = todayIsoDate();
  if (datePicker) datePicker.value = selectedDateISO;
  if (selectedDateEl) {
    selectedDateEl.textContent = formatIsoDate(selectedDateISO);
    selectedDateEl.classList.remove("is-placeholder");
  }
  setPickerExpanded(openDateBtn, false);
  renderCategoryOptions("");
  clearAttachmentSelection();
  updateSaveState();
}

async function openEntryModal() {
  hideMessages();
  resetEntryForm();
  await loadCategories();
  await entryModal?.present();
  setEntryLayerState(true);
}

async function closeEntryModal() {
  await closeCategorySheet();
  await closeDateSheet();
  await entryModal?.dismiss();
  setEntryLayerState(false);
  refreshPickerLayerState();
}

async function createEntry() {
  const type = String(entryTypeInput?.value || "").trim();
  const amount = parseMoneyInput(entryAmountInput?.value || "");
  const category = String(selectedCategoryValue || "").trim();
  const date = String(selectedDateISO || "").slice(0, 10).trim();
  const description = String(entryDescriptionInput?.value || "").trim();

  if (!["in", "out"].includes(type)) {
    showError("Selecione se é entrada ou saída.");
    return;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    showError("Informe um valor válido.");
    return;
  }
  if (!category) {
    showError("Categoria é obrigatória.");
    return;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    showError("Data inválida.");
    return;
  }

  savingEntry = true;
  setSaveButtonVisualState("saving");
  try {
    const attachmentPath = selectedAttachmentFile
      ? await uploadAttachment(selectedAttachmentFile)
      : null;

    const response = await fetch("/api/entries", {
      method: "POST",
      credentials: "same-origin",
      headers: authHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({
        type,
        amount,
        category,
        date,
        description,
        attachment_path: attachmentPath,
      }),
    });

    if (response.status === 401) {
      window.location.href = "/";
      return;
    }

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      showError(data?.error || "Não foi possível salvar a entrada.");
      return;
    }

    await closeEntryModal();
    showInfo("Entrada adicionada com sucesso.");
    await loadDashboard();
    showTab("lancamentos");
  } catch {
    showError("Falha de rede ao salvar a entrada.");
  } finally {
    savingEntry = false;
    updateSaveState();
  }
}

function setupEntryModal() {
  openEntryBtn?.addEventListener("click", () => {
    void openEntryModal();
  });

  closeEntryBtn?.addEventListener("click", () => {
    void closeEntryModal();
  });

  cancelEntryBtn?.addEventListener("click", () => {
    void closeEntryModal();
  });

  saveEntryBtn?.addEventListener("click", () => {
    void createEntry();
  });

  entryTypeInput?.addEventListener("ionChange", (event) => {
    const type = String(event?.detail?.value || "");
    setEntryTheme(type);
    void closeCategorySheet();
    void closeDateSheet();
    setPickerExpanded(openDateBtn, false);
    if (categorySearchInput) categorySearchInput.value = "";
    renderCategoryOptions(type);
    selectedCategoryValue = "";
    if (selectedCategoryEl) {
      selectedCategoryEl.textContent = "Selecionar categoria";
      selectedCategoryEl.classList.add("is-placeholder");
    }
    updateSaveState();
  });

  entryAmountInput?.addEventListener("ionInput", (event) => {
    renderAmountInput(event?.detail?.value || "");
    updateSaveState();
  });

  openDateBtn?.addEventListener("click", () => {
    void openDateSheet();
  });

  datePicker?.addEventListener("ionChange", (event) => {
    const value = String(event?.detail?.value || "").slice(0, 10);
    if (!value) return;
    selectedDateISO = value;
    if (selectedDateEl) {
      selectedDateEl.textContent = formatIsoDate(value);
      selectedDateEl.classList.remove("is-placeholder");
    }
    void closeDateSheet();
    updateSaveState();
  });

  openCategoryBtn?.addEventListener("click", () => {
    renderCategoryOptions(entryTypeInput?.value || "");
    void openCategorySheet();
  });

  categorySearchInput?.addEventListener("ionInput", () => {
    const current = String(categorySearchInput?.value || "").trim();
    if (current !== selectedCategoryValue) {
      selectedCategoryValue = "";
      if (selectedCategoryEl) {
        selectedCategoryEl.textContent = "Selecionar categoria";
        selectedCategoryEl.classList.add("is-placeholder");
      }
      updateSaveState();
    }
    renderCategoryOptions(entryTypeInput?.value || "");
  });

  categoryListEl?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest(".category-option");
    if (!button) return;
    const encoded = String(button.getAttribute("data-category") || "").trim();
    const value = encoded ? decodeURIComponent(encoded) : "";
    if (!value) return;
    selectedCategoryValue = value;
    if (categorySearchInput) categorySearchInput.value = value;
    if (selectedCategoryEl) {
      selectedCategoryEl.textContent = value;
      selectedCategoryEl.classList.remove("is-placeholder");
    }
    updateSaveState();
    void closeCategorySheet();
  });

  closeCategoryModalBtn?.addEventListener("click", () => {
    void closeCategorySheet();
  });

  closeDateModalBtn?.addEventListener("click", () => {
    void closeDateSheet();
  });

  categoryModal?.addEventListener("ionModalDidDismiss", () => {
    setPickerExpanded(openCategoryBtn, false);
    refreshPickerLayerState();
  });

  categoryModal?.addEventListener("ionModalDidPresent", () => {
    refreshPickerLayerState();
  });

  dateModal?.addEventListener("ionModalDidDismiss", () => {
    setPickerExpanded(openDateBtn, false);
    refreshPickerLayerState();
  });

  dateModal?.addEventListener("ionModalDidPresent", () => {
    refreshPickerLayerState();
  });

  entryModal?.addEventListener("ionModalDidDismiss", () => {
    setEntryLayerState(false);
    refreshPickerLayerState();
  });

  openAttachmentBtn?.addEventListener("click", () => {
    attachmentInput?.click();
  });

  attachmentInput?.addEventListener("change", () => {
    const file = attachmentInput.files?.[0] || null;
    if (!file) {
      clearAttachmentSelection();
      return;
    }

    const type = String(file.type || "").toLowerCase();
    const isImage = type.startsWith("image/");
    const isPdf = type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isImage && !isPdf) {
      clearAttachmentSelection();
      showError("Anexe um arquivo de imagem ou PDF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      clearAttachmentSelection();
      showError("Arquivo muito grande. Limite de 10MB.");
      return;
    }

    selectedAttachmentFile = file;
    setAttachmentPreview(file);
  });

  clearAttachmentBtn?.addEventListener("click", () => {
    clearAttachmentSelection();
  });
}
async function authFetch(path) {
  return fetch(path, {
    method: "GET",
    credentials: "same-origin",
    headers: authHeaders({ Accept: "application/json" }),
  });
}

async function safeJson(response, fallback) {
  try {
    return await response.json();
  } catch {
    return fallback;
  }
}

async function loadDashboard() {
  hideMessages();
  if (refreshBtn) refreshBtn.disabled = true;

  const month = monthRange();
  if (periodEl) periodEl.textContent = `Período: ${periodLabel()}`;

  try {
    const [profileRes, monthAggRes, summaryRes, entriesRes] = await Promise.all([
      authFetch("/api/account/profile"),
      authFetch(`/api/reports/aggregate?start=${month}&end=${month}`),
      authFetch("/api/reports/summary"),
      authFetch("/api/entries"),
    ]);

    if ([profileRes, monthAggRes, summaryRes, entriesRes].some((response) => response.status === 401)) {
      window.location.href = "/";
      return;
    }
    if ([profileRes, monthAggRes, summaryRes, entriesRes].some((response) => !response.ok)) {
      showError("Não foi possível carregar o dashboard.");
      return;
    }

    const [profile, monthAgg, summary, entries] = await Promise.all([
      safeJson(profileRes, {}),
      safeJson(monthAggRes, {}),
      safeJson(summaryRes, {}),
      safeJson(entriesRes, []),
    ]);

    const displayName = profile?.name || profile?.email || "Usuário";
    if (userTitleEl) userTitleEl.textContent = displayName;

    const totals = monthAgg?.totals || {};
    const balance = Number(totals.balance || 0);
    const totalIn = Number(totals.in || 0);
    const totalOut = Number(totals.out || 0);

    if (kpiBalance) kpiBalance.textContent = money.format(balance);
    if (balanceHeadEl) {
      balanceHeadEl.textContent = money.format(balance);
      balanceHeadEl.className = `topbar-balance__value ${toAmountClass(balance)}`.trim();
    }
    if (budgetLine) budgetLine.textContent = `${money.format(totalIn + totalOut)} orçado no mês`;

    const trend = Number((summary?.last_12_months || []).slice(-1)[0]?.month_balance || 0);
    const trendPrefix = trend >= 0 ? "+" : "-";
    if (trendLabel) trendLabel.textContent = `Resultado do mês ${trendPrefix} ${money.format(Math.abs(trend))}`;
    if (trendLine) trendLine.setAttribute("points", polylinePoints(summary?.last_12_months || []));

    const listEntries = Array.isArray(entries) ? sortEntriesByDateDesc(entries).slice(0, 20) : [];
    renderRows(entriesList, listEntries, "entry", "Nenhum lançamento encontrado.");
    if (entriesMetaEl) {
      const count = listEntries.length;
      entriesMetaEl.textContent = count === 1 ? "1 item recente" : `${count} itens recentes`;
    }

    try {
      const pendingEntries = Array.isArray(entries)
        ? entries.filter((entry) => Number(entry.needs_review || 0) === 1).slice(0, 3)
        : [];
      renderRows(reviewList, pendingEntries, "review", "Tudo revisado por enquanto.");
      if (reviewActionEl) reviewActionEl.hidden = pendingEntries.length === 0;

      const today = todayIsoDate();
      const nextEntries = Array.isArray(entries)
        ? entries
            .filter((entry) => entry.type === "out" && (entry.date || "") >= today)
            .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")))
            .slice(0, 3)
        : [];
      renderRows(nextList, nextEntries, "next", "Nenhum lançamento futuro.");
      renderCategories(monthAgg?.by_category || []);
    } catch (sectionError) {
      console.error("Erro ao renderizar seções secundárias do dashboard:", sectionError);
    }

    await loadCategories();
    showInfo(`Atualizado com dados de ${periodLabel()}`);
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
    showError("Falha ao processar os dados do dashboard.");
  } finally {
    if (refreshBtn) refreshBtn.disabled = false;
  }
}

async function logout() {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
      headers: authHeaders({ Accept: "application/json" }),
    });
  } finally {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {
      // ignore storage errors
    }
    try {
      document.cookie = "auth_token=; Max-Age=0; Path=/; SameSite=Lax";
    } catch {
      // ignore cookie errors
    }
    window.location.href = "/";
  }
}

logoutBtn?.addEventListener("click", () => {
  void logout();
});

refreshBtn?.addEventListener("click", () => {
  void loadDashboard();
});

setupTabNav();
setupEntryModal();
void loadDashboard();



