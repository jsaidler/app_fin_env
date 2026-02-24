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
const categoriesListScreen = document.getElementById("categories-list-screen");
const catSoFarEl = document.getElementById("cat-so-far");
const catLastMonthEl = document.getElementById("cat-last-month");
const catDonutEl = document.getElementById("cat-donut");
const entriesList = document.getElementById("entries-list");
const entriesSearchInput = document.getElementById("entries-search-input");
const txSearchOverlay = document.getElementById("tx-search-overlay");
const filterPanel = document.querySelector(".tx-filter-panel");
const filterPanelPeriod = document.getElementById("entries-filter-panel-period");
const openEntryFiltersSummaryBtn = document.getElementById("open-entry-filters-summary");

const entriesFilterModal = document.getElementById("entries-filter-modal");
const closeEntryFiltersBtn = document.getElementById("close-entry-filters");
const cancelEntryFiltersBtn = document.getElementById("cancel-entry-filters");
const clearEntryFiltersBtn = document.getElementById("clear-entry-filters");
const applyEntryFiltersBtn = document.getElementById("apply-entry-filters");
const entriesFilterType = document.getElementById("entries-filter-type");
const entriesFilterCategories = document.getElementById("entries-filter-categories");

const openEntriesFilterStartDateBtn = document.getElementById("open-entries-filter-start-date");
const openEntriesFilterEndDateBtn = document.getElementById("open-entries-filter-end-date");
const selectedEntriesFilterStartDateEl = document.getElementById("selected-entries-filter-start-date");
const selectedEntriesFilterEndDateEl = document.getElementById("selected-entries-filter-end-date");
const entriesFilterStartDateModal = document.getElementById("entries-filter-start-date-modal");
const entriesFilterEndDateModal = document.getElementById("entries-filter-end-date-modal");
const closeEntriesFilterStartDateModalBtn = document.getElementById("close-entries-filter-start-date-modal");
const closeEntriesFilterEndDateModalBtn = document.getElementById("close-entries-filter-end-date-modal");
const entriesFilterStartDatePicker = document.getElementById("entries-filter-start-date-picker");
const entriesFilterEndDatePicker = document.getElementById("entries-filter-end-date-picker");

const tabButtons = Array.from(document.querySelectorAll(".dash-tab"));
const tabSections = Array.from(document.querySelectorAll("[data-tab-content]"));
const tabNavShell = document.querySelector(".dash-nav-shell");
const tabNavWrap = document.querySelector(".dash-nav-wrap");
const rootApp = document.querySelector("ion-app");
const pageLoadingOverlay = document.getElementById("page-loading-overlay");

const entryModal = document.getElementById("entry-modal");
const openEntryBtn = document.getElementById("open-entry");
const openEntryInlineBtn = document.getElementById("open-entry-inline");
const closeEntryBtn = document.getElementById("close-entry");
const cancelEntryBtn = document.getElementById("cancel-entry");
const deleteEntryBtn = document.getElementById("delete-entry");
const saveEntryBtn = document.getElementById("save-entry");
const restoreEntryBtn = document.getElementById("restore-entry");
const entryModalTitleEl = document.getElementById("entry-modal-title");
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
const attachmentViewerModal = document.getElementById("attachment-viewer-modal");
const closeAttachmentViewerBtn = document.getElementById("close-attachment-viewer");
const attachmentViewerImage = document.getElementById("attachment-viewer-image");
const attachmentViewerPdf = document.getElementById("attachment-viewer-pdf");
const attachmentPathWrapEl = document.getElementById("attachment-path-wrap");
const attachmentPathEl = document.getElementById("attachment-path");
let selectedDateISO = "";
let selectedCategoryValue = "";
let selectedAttachmentFile = null;
let categories = [];
let savingEntry = false;
let editingEntryId = null;
let editingEntryAttachmentPath = "";
let editingEntryDeleted = false;
let entriesSearchTerm = "";
let searchDebounceTimer = null;
let loadedEntriesIndex = new Map();
let initialBootPending = true;
let entryFilters = { startDate: "", endDate: "", type: "all", categories: [] };
let draftEntryFilters = { startDate: "", endDate: "", type: "all", categories: [] };
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
    entriesMetaEl.textContent = "Sem dados no perÃ­odo";
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
  const isLancamentos = tabName === "lancamentos";
  tabSections.forEach((section) => {
    section.hidden = section.dataset.tabContent !== tabName;
  });
  if (txSearchOverlay) {
    txSearchOverlay.classList.toggle("is-visible", isLancamentos);
    txSearchOverlay.setAttribute("aria-hidden", isLancamentos ? "false" : "true");
  }
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
  if (transitionToken !== navTransitionToken) return Promise.resolve(false);
  const current = tabNavWrap.scrollLeft;
  if (Math.abs(targetLeft - current) < 1) return Promise.resolve(false);
  tabNavWrap.scrollTo({ left: targetLeft, behavior: "smooth" });
  return Promise.resolve(true);
}

function setInitialLoading(active) {
  if (!rootApp) return;
  if (active) {
    if (window.__dashboardLoading && typeof window.__dashboardLoading.begin === "function") {
      window.__dashboardLoading.begin();
    } else {
      rootApp.classList.add("is-booting");
      rootApp.classList.remove("is-boot-exiting");
    }
  } else {
    rootApp.classList.remove("is-boot-exiting");
    rootApp.classList.remove("is-booting");
  }
  if (pageLoadingOverlay) pageLoadingOverlay.setAttribute("aria-hidden", active ? "false" : "true");
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
    if (event.pointerType === "mouse" && event.button !== 0) return;
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

  showTab("lancamentos");
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

function previousMonthRange(monthKey) {
  const [year, month] = String(monthKey || "").split("-").map((value) => Number(value));
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }
  const date = new Date(year, month - 1, 1);
  date.setMonth(date.getMonth() - 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
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

function currentMonthBounds() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const toIso = (value) => {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };
  return { start: toIso(start), end: toIso(end) };
}

function initEntryFilters() {
  const bounds = currentMonthBounds();
  entryFilters = { startDate: bounds.start, endDate: bounds.end, type: "all", categories: [] };
  draftEntryFilters = { ...entryFilters, categories: [...entryFilters.categories] };
}

function buildEntriesGroupsQueryString(filters, searchTerm) {
  const query = new URLSearchParams();
  if (String(filters?.type || "") === "deleted") {
    query.set("type", "deleted");
    query.set("deleted_only", "1");
    return query.toString();
  }
  if (filters?.startDate) query.set("start", filters.startDate);
  if (filters?.endDate) query.set("end", filters.endDate);
  query.set("type", String(filters?.type || "all"));
  if (String(searchTerm || "").trim()) query.set("q", String(searchTerm || "").trim());
  for (const category of (filters?.categories || [])) {
    query.append("categories[]", category);
  }
  return query.toString();
}

function setEntryDirectionHint(categoryName) {
  const directionEl = document.getElementById("selected-category-direction");
  const categoryValueEl = document.getElementById("selected-category");
  const category = categories.find((item) => String(item?.name || "") === String(categoryName || ""));
  const type = String(category?.type || "");
  if (!directionEl || !type) {
    if (directionEl) directionEl.hidden = true;
    if (categoryValueEl) categoryValueEl.classList.remove("is-in", "is-out");
    return;
  }
  directionEl.hidden = false;
  directionEl.textContent = type === "in" ? "arrow_downward" : "arrow_upward";
  directionEl.classList.remove("is-in", "is-out");
  directionEl.classList.add(type === "in" ? "is-in" : "is-out");
  if (categoryValueEl) {
    categoryValueEl.classList.remove("is-in", "is-out");
    categoryValueEl.classList.add(type === "in" ? "is-in" : "is-out");
  }
}

function entryTypeFromSelectedCategory() {
  const category = categories.find((item) => String(item?.name || "") === String(selectedCategoryValue || ""));
  return String(category?.type || "");
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
  saveEntryBtn.classList.toggle("is-disabled", state === "disabled");
  saveEntryBtn.classList.toggle("is-saving", state === "saving");
  saveEntryBtn.textContent = state === "saving" ? "Salvando..." : "Salvar";
}

function setEntryModalMode(mode = "create") {
  const isEdit = mode === "edit";
  const isDeleted = mode === "deleted";
  if (entryModalTitleEl) {
    entryModalTitleEl.textContent = isDeleted ? "LanÃ§amento excluÃ­do" : (isEdit ? "Editar lanÃ§amento" : "Nova entrada");
  }
  if (deleteEntryBtn) {
    const showDelete = isEdit && !isDeleted;
    deleteEntryBtn.hidden = !showDelete;
    deleteEntryBtn.style.display = showDelete ? "" : "none";
  }
  if (restoreEntryBtn) {
    restoreEntryBtn.hidden = !isDeleted;
    restoreEntryBtn.style.display = isDeleted ? "" : "none";
  }
  if (saveEntryBtn) {
    saveEntryBtn.hidden = isDeleted;
    saveEntryBtn.style.display = isDeleted ? "none" : "";
  }
}

function updateEntryFlowUi() {
  const locked = Boolean(editingEntryDeleted);
  if (openCategoryBtn) openCategoryBtn.disabled = locked;
  if (openDateBtn) openDateBtn.disabled = locked;
  if (openAttachmentBtn) openAttachmentBtn.disabled = locked;
  if (entryDescriptionInput) entryDescriptionInput.disabled = locked;
  if (entryAmountInput) entryAmountInput.disabled = locked;
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
    if (attachmentPathEl) attachmentPathEl.textContent = "";
    if (attachmentPathWrapEl) attachmentPathWrapEl.hidden = true;
    return;
  }

  const fileName = String(file.name || "arquivo");
  const type = String(file.type || "").toLowerCase();

  if (attachmentNameEl) {
    attachmentNameEl.textContent = formatAttachmentLabel(fileName);
    attachmentNameEl.classList.remove("is-placeholder");
  }
  if (attachmentPathEl) attachmentPathEl.textContent = "SerÃ¡ definido ao salvar";
  if (attachmentPathWrapEl) attachmentPathWrapEl.hidden = false;
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
    showError("NÃ£o foi possÃ­vel carregar a prÃ©-visualizaÃ§Ã£o do comprovante.");
  };
  reader.readAsDataURL(file);
}

async function closeAttachmentViewer() {
  try {
    await attachmentViewerModal?.dismiss();
  } catch {
    // modal may already be closed
  }
  if (attachmentViewerImage) {
    attachmentViewerImage.hidden = true;
    attachmentViewerImage.removeAttribute("src");
  }
  if (attachmentViewerPdf) {
    attachmentViewerPdf.hidden = true;
    attachmentViewerPdf.removeAttribute("src");
  }
}

async function openAttachmentViewer(source, isPdf = false) {
  const src = String(source || "").trim();
  if (!src) return;
  if (isPdf) {
    if (attachmentViewerPdf) {
      attachmentViewerPdf.src = src;
      attachmentViewerPdf.hidden = false;
    }
    if (attachmentViewerImage) {
      attachmentViewerImage.hidden = true;
      attachmentViewerImage.removeAttribute("src");
    }
  } else {
    if (attachmentViewerImage) {
      attachmentViewerImage.src = src;
      attachmentViewerImage.hidden = false;
    }
    if (attachmentViewerPdf) {
      attachmentViewerPdf.hidden = true;
      attachmentViewerPdf.removeAttribute("src");
    }
  }
  await attachmentViewerModal?.present();
}

function attachmentUrlFromPath(path) {
  const raw = String(path || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("/uploads/")) return raw;
  return `/uploads/${raw.replace(/^\/+/, "")}`;
}

function setAttachmentPreviewFromPath(path) {
  const raw = String(path || "").trim();
  if (!raw) {
    setAttachmentPreview(null);
    return;
  }

  const fileNameRaw = raw.split("/").pop() || "arquivo";
  let fileName = fileNameRaw;
  try {
    fileName = decodeURIComponent(fileNameRaw);
  } catch {
    fileName = fileNameRaw;
  }
  const src = attachmentUrlFromPath(raw);
  const isPdf = raw.toLowerCase().endsWith(".pdf");

  selectedAttachmentFile = null;
  if (attachmentInput) attachmentInput.value = "";
  if (attachmentNameEl) {
    attachmentNameEl.textContent = formatAttachmentLabel(fileName);
    attachmentNameEl.classList.remove("is-placeholder");
  }
  if (attachmentPathEl) attachmentPathEl.textContent = raw;
  if (attachmentPathWrapEl) attachmentPathWrapEl.hidden = false;
  if (attachmentPreviewName) attachmentPreviewName.textContent = fileName;
  if (attachmentPreview) attachmentPreview.hidden = false;

  if (isPdf) {
    if (attachmentPreviewPdf) {
      attachmentPreviewPdf.src = src;
      attachmentPreviewPdf.hidden = false;
    }
    if (attachmentPreviewImage) {
      attachmentPreviewImage.hidden = true;
      attachmentPreviewImage.removeAttribute("src");
    }
    return;
  }

  if (attachmentPreviewImage) {
    attachmentPreviewImage.src = src;
    attachmentPreviewImage.hidden = false;
  }
  if (attachmentPreviewPdf) {
    attachmentPreviewPdf.hidden = true;
    attachmentPreviewPdf.removeAttribute("src");
  }
}

function clearAttachmentSelection(clearStoredPath = false) {
  selectedAttachmentFile = null;
  if (attachmentInput) attachmentInput.value = "";
  if (clearStoredPath) editingEntryAttachmentPath = "";
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
  if (editingEntryDeleted) return false;
  const type = entryTypeFromSelectedCategory();
  const amount = parseMoneyInput(entryAmountInput?.value || "");
  const category = String(selectedCategoryValue || "").trim();
  const date = String(selectedDateISO || "").slice(0, 10).trim();
  return ["in", "out"].includes(type)
    && Number.isFinite(amount)
    && amount > 0
    && category.length > 0
    && /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function hasEntryMinimumRequiredData() {
  const amount = parseMoneyInput(entryAmountInput?.value || "");
  const category = String(selectedCategoryValue || "").trim();
  return Number.isFinite(amount) && amount > 0 && category.length > 0;
}

function updateSaveState() {
  updateEntryFlowUi();
  if (savingEntry) {
    setSaveButtonVisualState("saving");
    return;
  }
  if (!hasEntryMinimumRequiredData()) {
    setSaveButtonVisualState("disabled");
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
  const groups = [
    { key: "in", title: "Entrada", icon: "arrow_downward" },
    { key: "out", title: "SaÃ­da", icon: "arrow_upward" },
  ];

  const html = groups
    .map((group) => {
      const options = searched.filter((category) => String(category?.type || "") === group.key);
      if (!options.length) return "";
      const optionsHtml = options
        .map((category) => {
          const label = String(category?.name || "").trim();
          const safeLabel = escapeHtml(label);
          const encodedLabel = encodeURIComponent(label);
          const isSelected = selectedCategoryValue === label;
          return `
            <button type="button" class="category-option is-${group.key}" data-category="${encodedLabel}"${isSelected ? ' aria-current="true"' : ""}>
              <span class="category-option__lead"><span class="material-symbols-rounded">${group.icon}</span></span>
              <span class="category-option__text">${safeLabel}</span>
            </button>
          `;
        })
        .join("");
      return `
        <section class="category-group">
          <h4 class="category-group__title">${group.title}</h4>
          <div class="category-group__items">${optionsHtml}</div>
        </section>
      `;
    })
    .join("");

  categoryListEl.innerHTML = html || `<p class="category-empty">Nenhuma categoria encontrada.</p>`;
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
  if (mode === "entry") {
    const chipTone = item.type === "in" ? "entry-chip--in" : "entry-chip--out";
    const entryId = Number(item.id || 0);
    return `
      <button type="button" class="entry-row entry-row--button" data-entry-id="${entryId}" aria-label="Editar lanÃ§amento ${title}">
        <div class="entry-row__title">${title}</div>
        <div class="entry-row__chips">
          <span class="entry-chip ${chipTone}">${category}</span>
        </div>
        <div class="entry-row__value ${amountClass}">${money.format(signed)}</div>
      </button>
    `;
  }

  const subtitle = mode === "next" ? `Vence em ${asDateLabel(item.date)}` : category;
  return `
    <div class="row">
      <div class="icon-circle"><span class="material-symbols-rounded">${categoryGlyph(item.category || item.description || "")}</span></div>
      <div>
        <div class="row-title">${title}</div>
        <div class="row-meta">${subtitle}</div>
      </div>
      <div class="row-value ${amountClass}">${money.format(signed)}</div>
    </div>
  `;
}

function renderEntriesEmptyState(container, message = "Nenhum lanÃ§amento no perÃ­odo.") {
  container.innerHTML = `
    <div class="tx-empty-state" role="status" aria-live="polite">
      <p class="tx-empty-state__title">Nenhum lanÃ§amento</p>
      <p class="tx-empty-state__text">${escapeHtml(message)}</p>
    </div>
  `;
}

function renderEntriesGroupedFromServer(container, groups, emptyText) {
  if (!Array.isArray(groups) || groups.length === 0) {
    renderEntriesEmptyState(container, emptyText || "Nenhum lanÃ§amento encontrado.");
    return;
  }

  loadedEntriesIndex = new Map();
  container.innerHTML = groups
    .map((yearNode) => {
      const yearBalance = Number(yearNode?.totals?.balance || 0);
      const yearClass = toAmountClass(yearBalance);
      const months = (Array.isArray(yearNode?.months) ? yearNode.months : [])
        .map((monthNode) => {
          const monthBalance = Number(monthNode?.totals?.balance || 0);
          const monthClass = toAmountClass(monthBalance);
          const days = (Array.isArray(monthNode?.days) ? monthNode.days : [])
            .map((dayNode) => {
              const dayBalanceValue = Number(dayNode?.totals?.balance || 0);
              const dayClass = toAmountClass(dayBalanceValue);
              const rows = (Array.isArray(dayNode?.entries) ? dayNode.entries : [])
                .map((item) => {
                  const id = Number(item?.id || 0);
                  if (id > 0) loadedEntriesIndex.set(id, item);
                  return rowTemplate(item, "entry");
                })
                .join("");
              return `
                <section class="entry-day">
                  <header class="entry-day__head">
                    <div class="entry-group entry-group--day">${escapeHtml(String(dayNode?.label || ""))}</div>
                    <div class="entry-day__value ${dayClass}">${money.format(dayBalanceValue)}</div>
                  </header>
                  <div class="entry-cluster__rows">${rows}</div>
                </section>
              `;
            })
            .join("");
          return `
            <section class="entry-month">
              <header class="entry-month__head">
                <div class="entry-month__title">${escapeHtml(String(monthNode?.label || monthNode?.month || ""))}</div>
                <div class="entry-month__value ${monthClass}">${money.format(monthBalance)}</div>
              </header>
              ${days}
            </section>
          `;
        })
        .join("");
      return `
        <section class="entry-year">
          <header class="entry-year__head">
            <div class="entry-group entry-group--year">${escapeHtml(String(yearNode?.label || yearNode?.year || ""))}</div>
            <div class="entry-year__value ${yearClass}">${money.format(yearBalance)}</div>
          </header>
          ${months}
        </section>
      `;
    })
    .join("");
}

function formatFilterPanel() {
  if (!filterPanelPeriod) return;
  if (entryFilters.type === "deleted") {
    filterPanelPeriod.textContent = "ExcluÃ­dos (todos)";
    return;
  }
  const start = formatIsoDate(entryFilters.startDate);
  const end = formatIsoDate(entryFilters.endDate);
  filterPanelPeriod.textContent = start && end ? `${start} atÃ© ${end}` : "--";
}

function syncFilterDraftToUi() {
  if (entriesFilterStartDatePicker) entriesFilterStartDatePicker.value = draftEntryFilters.startDate || "";
  if (entriesFilterEndDatePicker) entriesFilterEndDatePicker.value = draftEntryFilters.endDate || "";
  if (selectedEntriesFilterStartDateEl) selectedEntriesFilterStartDateEl.textContent = formatIsoDate(draftEntryFilters.startDate);
  if (selectedEntriesFilterEndDateEl) selectedEntriesFilterEndDateEl.textContent = formatIsoDate(draftEntryFilters.endDate);
  if (entriesFilterType) entriesFilterType.value = draftEntryFilters.type || "all";
  const deletedMode = draftEntryFilters.type === "deleted";
  if (openEntriesFilterStartDateBtn) openEntriesFilterStartDateBtn.disabled = deletedMode;
  if (openEntriesFilterEndDateBtn) openEntriesFilterEndDateBtn.disabled = deletedMode;
  if (entriesFilterCategories) entriesFilterCategories.style.pointerEvents = deletedMode ? "none" : "";
  if (entriesFilterCategories) entriesFilterCategories.style.opacity = deletedMode ? "0.5" : "";

  const selected = new Set(draftEntryFilters.categories || []);
  const categoriesHtml = categories.map((category) => {
    const name = String(category?.name || "").trim();
    const type = String(category?.type || "");
    const selectedClass = selected.has(name) ? " is-selected" : "";
    const tone = type === "in" ? "is-in" : "is-out";
    return `<button type="button" class="filter-category-chip ${tone}${selectedClass}" data-category="${encodeURIComponent(name)}">${escapeHtml(name)}</button>`;
  }).join("");
  if (entriesFilterCategories) entriesFilterCategories.innerHTML = categoriesHtml;
}

function applyTypeRulesOnDraft(type) {
  draftEntryFilters.type = type;
  const ins = categories.filter((c) => String(c?.type || "") === "in").map((c) => String(c?.name || ""));
  const outs = categories.filter((c) => String(c?.type || "") === "out").map((c) => String(c?.name || ""));
  const current = new Set(draftEntryFilters.categories || []);

  if (type === "deleted") {
    draftEntryFilters.startDate = "";
    draftEntryFilters.endDate = "";
    draftEntryFilters.categories = [];
    return;
  }
  if (type === "all") {
    draftEntryFilters.categories = categories.map((c) => String(c?.name || ""));
    return;
  }
  if (type === "in") {
    const inSelected = ins.some((name) => current.has(name));
    draftEntryFilters.categories = inSelected ? ins.filter((name) => current.has(name)) : ins;
    return;
  }
  const outSelected = outs.some((name) => current.has(name));
  draftEntryFilters.categories = outSelected ? outs.filter((name) => current.has(name)) : outs;
}

function startSearchDebouncedReload() {
  if (searchDebounceTimer) window.clearTimeout(searchDebounceTimer);
  searchDebounceTimer = window.setTimeout(() => {
    void loadDashboard();
  }, 220);
}

async function openEntryFiltersModal() {
  await loadCategories();
  draftEntryFilters = { ...entryFilters, categories: [...entryFilters.categories] };
  syncFilterDraftToUi();
  await entriesFilterModal?.present();
}

async function closeEntryFiltersModal() {
  try {
    await entriesFilterModal?.dismiss();
  } catch {
    // modal may already be closed
  }
}

async function openEntryEditor(entryId) {
  const entry = loadedEntriesIndex.get(Number(entryId));
  if (!entry) return;
  await loadCategories();
  resetEntryForm();
  editingEntryId = Number(entry.id || 0);
  editingEntryAttachmentPath = String(entry.attachment_path || "");
  const deletedAtRaw = entry?.deleted_at;
  const deletedAtText = typeof deletedAtRaw === "string" ? deletedAtRaw.trim().toLowerCase() : "";
  const hasDeletedAt = deletedAtRaw != null && deletedAtText !== "" && deletedAtText !== "null" && deletedAtText !== "0";
  const status = String(entry?.status || "").toLowerCase();
  const hasDeletedStatus = status === "deleted_soft" || status === "deleted_hard";
  editingEntryDeleted = hasDeletedAt || hasDeletedStatus;
  if (entryAmountInput) entryAmountInput.value = formatMoneyInput(Number(entry.amount || 0));
  selectedCategoryValue = String(entry.category || "");
  if (selectedCategoryEl) {
    selectedCategoryEl.textContent = selectedCategoryValue || "Selecionar categoria";
    selectedCategoryEl.classList.toggle("is-placeholder", !selectedCategoryValue);
  }
  setEntryDirectionHint(selectedCategoryValue);
  setEntryTheme(entryTypeFromSelectedCategory() || "neutral");
  setEntryModalMode(editingEntryDeleted ? "deleted" : "edit");
  selectedDateISO = String(entry.date || todayIsoDate()).slice(0, 10);
  if (datePicker) datePicker.value = selectedDateISO;
  if (selectedDateEl) {
    selectedDateEl.textContent = formatIsoDate(selectedDateISO);
    selectedDateEl.classList.remove("is-placeholder");
  }
  if (entryDescriptionInput) entryDescriptionInput.value = String(entry.description || "");
  setAttachmentPreviewFromPath(editingEntryAttachmentPath);
  updateSaveState();
  await entryModal?.present();
  setEntryLayerState(true);
}

function setupEntriesInteractions() {
  openEntryFiltersSummaryBtn?.addEventListener("click", () => {
    void openEntryFiltersModal();
  });
  filterPanel?.addEventListener("click", () => {
    void openEntryFiltersModal();
  });
  closeEntryFiltersBtn?.addEventListener("click", () => void closeEntryFiltersModal());
  cancelEntryFiltersBtn?.addEventListener("click", () => void closeEntryFiltersModal());

  clearEntryFiltersBtn?.addEventListener("click", () => {
    const bounds = currentMonthBounds();
    draftEntryFilters = { startDate: bounds.start, endDate: bounds.end, type: "all", categories: categories.map((c) => String(c?.name || "")) };
    syncFilterDraftToUi();
    entryFilters = { ...draftEntryFilters, categories: [...draftEntryFilters.categories] };
    formatFilterPanel();
    void closeEntryFiltersModal();
    void loadDashboard();
  });

  applyEntryFiltersBtn?.addEventListener("click", () => {
    entryFilters = { ...draftEntryFilters, categories: [...draftEntryFilters.categories] };
    if (entryFilters.type === "deleted") {
      entriesSearchTerm = "";
      if (entriesSearchInput) entriesSearchInput.value = "";
    }
    formatFilterPanel();
    void closeEntryFiltersModal();
    void loadDashboard();
  });

  entriesFilterType?.addEventListener("ionChange", (event) => {
    const type = String(event?.detail?.value || "all");
    applyTypeRulesOnDraft(type);
    syncFilterDraftToUi();
  });

  entriesFilterCategories?.addEventListener("click", (event) => {
    if (draftEntryFilters.type === "deleted") return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest(".filter-category-chip");
    if (!button) return;
    const name = decodeURIComponent(String(button.getAttribute("data-category") || ""));
    const selected = new Set(draftEntryFilters.categories || []);
    if (selected.has(name)) selected.delete(name); else selected.add(name);
    draftEntryFilters.categories = [...selected];
    syncFilterDraftToUi();
  });

  openEntriesFilterStartDateBtn?.addEventListener("click", async () => {
    await entriesFilterStartDateModal?.present();
  });
  openEntriesFilterEndDateBtn?.addEventListener("click", async () => {
    await entriesFilterEndDateModal?.present();
  });
  closeEntriesFilterStartDateModalBtn?.addEventListener("click", async () => {
    try { await entriesFilterStartDateModal?.dismiss(); } catch {}
  });
  closeEntriesFilterEndDateModalBtn?.addEventListener("click", async () => {
    try { await entriesFilterEndDateModal?.dismiss(); } catch {}
  });

  entriesFilterStartDatePicker?.addEventListener("ionChange", (event) => {
    const value = String(event?.detail?.value || "").slice(0, 10);
    if (!value) return;
    draftEntryFilters.startDate = value;
    syncFilterDraftToUi();
    void entriesFilterStartDateModal?.dismiss();
  });

  entriesFilterEndDatePicker?.addEventListener("ionChange", (event) => {
    const value = String(event?.detail?.value || "").slice(0, 10);
    if (!value) return;
    draftEntryFilters.endDate = value;
    syncFilterDraftToUi();
    void entriesFilterEndDateModal?.dismiss();
  });

  entriesSearchInput?.addEventListener("input", () => {
    if (entryFilters.type === "deleted") {
      entriesSearchInput.value = "";
      entriesSearchTerm = "";
      return;
    }
    entriesSearchTerm = String(entriesSearchInput.value || "").trim();
    startSearchDebouncedReload();
  });

  entriesList?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest(".entry-row--button");
    if (!button) return;
    const entryId = Number(button.getAttribute("data-entry-id") || 0);
    if (entryId > 0) {
      void openEntryEditor(entryId);
    }
  });
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

function toneClassForCategory(name) {
  const key = normalizeText(name);
  let sum = 0;
  for (let i = 0; i < key.length; i += 1) sum += key.charCodeAt(i);
  return `tone-${(sum % 6) + 1}`;
}

function renderCategoriesTab(currentAgg, previousAgg) {
  if (!categoriesListScreen) return;

  const currentItems = Array.isArray(currentAgg?.by_category) ? currentAgg.by_category : [];
  const previousItems = Array.isArray(previousAgg?.by_category) ? previousAgg.by_category : [];
  const prevMap = new Map(previousItems.map((item) => [String(item?.name || ""), Number(item?.out || 0)]));

  const currentMonthOut = Number(currentAgg?.totals?.out || 0);
  const previousMonthOut = Number(previousAgg?.totals?.out || 0);
  if (catSoFarEl) catSoFarEl.textContent = money.format(currentMonthOut);
  if (catLastMonthEl) catLastMonthEl.textContent = money.format(previousMonthOut);

  const topForDonut = currentItems
    .map((item) => ({ name: String(item?.name || ""), out: Number(item?.out || 0) }))
    .filter((item) => item.out > 0)
    .sort((a, b) => b.out - a.out)
    .slice(0, 4);
  const donutTotal = topForDonut.reduce((acc, item) => acc + item.out, 0);
  if (catDonutEl) {
    if (!donutTotal) {
      catDonutEl.style.background = "conic-gradient(#dfe4ee 0turn 1turn)";
    } else {
      const colors = ["#ea8a32", "#7c2fe0", "#de4f42", "#53b241"];
      let cursor = 0;
      const segments = topForDonut.map((item, index) => {
        const fraction = item.out / donutTotal;
        const start = cursor;
        cursor += fraction;
        return `${colors[index % colors.length]} ${start}turn ${cursor}turn`;
      });
      catDonutEl.style.background = `conic-gradient(${segments.join(", ")})`;
    }
  }

  const listItems = currentItems
    .map((item) => {
      const name = String(item?.name || "").trim();
      const currOut = Number(item?.out || 0);
      const prevOut = Number(prevMap.get(name) || 0);
      return { name, currOut, prevOut };
    })
    .filter((item) => item.name);

  if (!listItems.length) {
    categoriesListScreen.innerHTML = `<p class="cat-empty">Sem dados de categorias no perÃ­odo.</p>`;
    return;
  }

  categoriesListScreen.innerHTML = listItems
    .map((item) => {
      const icon = categoryGlyph(item.name);
      const safeName = escapeHtml(item.name);
      const base = Math.max(item.prevOut, item.currOut, 1);
      const width = Math.max(4, Math.min(100, Math.round((item.currOut / base) * 100)));
      const overClass = item.currOut > item.prevOut ? " is-over" : "";
      return `
        <div class="cat-row">
          <div class="cat-row__meta">
            <span class="cat-chip ${toneClassForCategory(item.name)}"><span class="material-symbols-rounded cat-chip__icon">${icon}</span>${safeName}</span>
            <span class="cat-row__bar"><span class="cat-row__bar-fill${overClass}" style="width:${width}%"></span></span>
          </div>
          <div class="cat-row__curr">${money.format(item.currOut)}</div>
          <div class="cat-row__prev">${money.format(item.prevOut)}</div>
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
    renderCategoryOptions("");
      return;
    }
    const data = await response.json();
    categories = Array.isArray(data) ? data : [];
    if (!entryFilters.categories.length) {
      entryFilters.categories = categories.map((item) => String(item?.name || ""));
      draftEntryFilters.categories = [...entryFilters.categories];
      formatFilterPanel();
    }
    renderCategoryOptions("");
  } catch {
    categories = [];
    renderCategoryOptions("");
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
    throw new Error(data?.error || "NÃ£o foi possÃ­vel enviar o comprovante.");
  }

  return String(data.file);
}

function resetEntryForm() {
  if (entryTypeInput) entryTypeInput.value = "";
  editingEntryId = null;
  editingEntryAttachmentPath = "";
  editingEntryDeleted = false;
  setEntryModalMode("create");
  setEntryTheme("neutral");
  if (entryAmountInput) entryAmountInput.value = formatMoneyInput(0);
  selectedCategoryValue = "";
  if (categorySearchInput) categorySearchInput.value = "";
  if (selectedCategoryEl) {
    selectedCategoryEl.textContent = "Selecionar categoria";
    selectedCategoryEl.classList.add("is-placeholder");
  }
  setEntryDirectionHint("");
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
  setEntryModalMode("create");
  await entryModal?.present();
  setEntryLayerState(true);
}

async function closeEntryModal() {
  await closeAttachmentViewer();
  await closeCategorySheet();
  await closeDateSheet();
  await entryModal?.dismiss();
  setEntryLayerState(false);
  refreshPickerLayerState();
}

async function createEntry() {
  const type = entryTypeFromSelectedCategory();
  const amount = parseMoneyInput(entryAmountInput?.value || "");
  const category = String(selectedCategoryValue || "").trim();
  const date = String(selectedDateISO || "").slice(0, 10).trim();
  const description = String(entryDescriptionInput?.value || "").trim();

  if (!["in", "out"].includes(type)) {
    showError("Selecione uma categoria vÃ¡lida.");
    return;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    showError("Informe um valor vÃ¡lido.");
    return;
  }
  if (!category) {
    showError("Categoria Ã© obrigatÃ³ria.");
    return;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    showError("Data invÃ¡lida.");
    return;
  }

  savingEntry = true;
  setSaveButtonVisualState("saving");
  try {
    const attachmentPath = selectedAttachmentFile
      ? await uploadAttachment(selectedAttachmentFile)
      : (editingEntryId ? editingEntryAttachmentPath : null);

    const endpoint = editingEntryId ? `/api/entries/${editingEntryId}` : "/api/entries";
    const response = await fetch(endpoint, {
      method: editingEntryId ? "PUT" : "POST",
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
      showError(data?.error || "NÃ£o foi possÃ­vel salvar a entrada.");
      return;
    }

    await closeEntryModal();
    showInfo(editingEntryId ? "LanÃ§amento atualizado com sucesso." : "Entrada adicionada com sucesso.");
    await loadDashboard();
    showTab("lancamentos");
  } catch {
    showError("Falha de rede ao salvar a entrada.");
  } finally {
    savingEntry = false;
    updateSaveState();
  }
}

async function restoreEntry() {
  if (!editingEntryId) return;
  try {
    const response = await fetch(`/api/entries/${editingEntryId}/restore`, {
      method: "PUT",
      credentials: "same-origin",
      headers: authHeaders({ Accept: "application/json" }),
    });
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    if (!response.ok) {
      showError("NÃ£o foi possÃ­vel restaurar o lanÃ§amento.");
      return;
    }
    await closeEntryModal();
    showInfo("LanÃ§amento restaurado com sucesso.");
    await loadDashboard();
  } catch {
    showError("Falha de rede ao restaurar o lanÃ§amento.");
  }
}

async function deleteEntry() {
  if (!editingEntryId || editingEntryDeleted) return;
  const confirmed = window.confirm("Excluir este lanÃ§amento?");
  if (!confirmed) return;

  try {
    const response = await fetch(`/api/entries/${editingEntryId}`, {
      method: "DELETE",
      credentials: "same-origin",
      headers: authHeaders({ Accept: "application/json" }),
    });
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    if (!response.ok) {
      showError("NÃ£o foi possÃ­vel excluir o lanÃ§amento.");
      return;
    }
    await closeEntryModal();
    showInfo("LanÃ§amento excluÃ­do com sucesso.");
    await loadDashboard();
  } catch {
    showError("Falha de rede ao excluir o lanÃ§amento.");
  }
}

function setupEntryModal() {
  openEntryBtn?.addEventListener("click", () => {
    void openEntryModal();
  });

  openEntryInlineBtn?.addEventListener("click", () => {
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

  restoreEntryBtn?.addEventListener("click", () => {
    void restoreEntry();
  });

  deleteEntryBtn?.addEventListener("click", () => {
    void deleteEntry();
  });

  entryTypeInput?.addEventListener("ionChange", () => {
    // Mantido por compatibilidade: tipo agora deriva da categoria.
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
    renderCategoryOptions("");
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
    renderCategoryOptions("");
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
    setEntryDirectionHint(value);
    setEntryTheme(entryTypeFromSelectedCategory() || "neutral");
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
    const maxSize = isPdf ? 1 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      clearAttachmentSelection();
      showError(isPdf ? "Arquivo PDF muito grande. Limite de 1MB." : "Arquivo muito grande. Limite de 10MB.");
      return;
    }

    selectedAttachmentFile = file;
    setAttachmentPreview(file);
  });

  clearAttachmentBtn?.addEventListener("click", () => {
    clearAttachmentSelection(true);
  });

  closeAttachmentViewerBtn?.addEventListener("click", () => {
    void closeAttachmentViewer();
  });

  attachmentViewerModal?.addEventListener("ionModalDidDismiss", () => {
    if (attachmentViewerImage) {
      attachmentViewerImage.hidden = true;
      attachmentViewerImage.removeAttribute("src");
    }
    if (attachmentViewerPdf) {
      attachmentViewerPdf.hidden = true;
      attachmentViewerPdf.removeAttribute("src");
    }
  });

  attachmentPreviewImage?.addEventListener("click", () => {
    if (attachmentPreviewImage.hidden) return;
    const src = String(attachmentPreviewImage.getAttribute("src") || "");
    if (!src) return;
    void openAttachmentViewer(src, false);
  });

  attachmentPreviewPdf?.addEventListener("click", () => {
    if (attachmentPreviewPdf.hidden) return;
    const src = String(attachmentPreviewPdf.getAttribute("src") || "");
    if (!src) return;
    void openAttachmentViewer(src, true);
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
  const prevMonth = previousMonthRange(month);
  const groupsQuery = buildEntriesGroupsQueryString(entryFilters, entriesSearchTerm);
  if (periodEl) periodEl.textContent = `PerÃ­odo: ${periodLabel()}`;

  try {
    const [profileRes, monthAggRes, prevMonthAggRes, summaryRes, entriesRes, entryGroupsRes] = await Promise.all([
      authFetch("/api/account/profile"),
      authFetch(`/api/reports/aggregate?start=${month}&end=${month}`),
      authFetch(`/api/reports/aggregate?start=${prevMonth}&end=${prevMonth}`),
      authFetch("/api/reports/summary"),
      authFetch("/api/entries"),
      authFetch(`/api/reports/entries-groups?${groupsQuery}`),
    ]);

    if ([profileRes, monthAggRes, prevMonthAggRes, summaryRes, entriesRes, entryGroupsRes].some((response) => response.status === 401)) {
      window.location.href = "/";
      return;
    }
    if ([profileRes, monthAggRes, prevMonthAggRes, summaryRes, entriesRes, entryGroupsRes].some((response) => !response.ok)) {
      showError("NÃ£o foi possÃ­vel carregar o dashboard.");
      return;
    }

    const [profile, monthAgg, prevMonthAgg, summary, entries, groupedPayload] = await Promise.all([
      safeJson(profileRes, {}),
      safeJson(monthAggRes, {}),
      safeJson(prevMonthAggRes, {}),
      safeJson(summaryRes, {}),
      safeJson(entriesRes, []),
      safeJson(entryGroupsRes, {}),
    ]);

    const displayName = profile?.name || profile?.email || "UsuÃ¡rio";
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
    if (budgetLine) budgetLine.textContent = `${money.format(totalIn + totalOut)} orÃ§ado no mÃªs`;

    const trend = Number((summary?.last_12_months || []).slice(-1)[0]?.month_balance || 0);
    const trendPrefix = trend >= 0 ? "+" : "-";
    if (trendLabel) trendLabel.textContent = `Resultado do mÃªs ${trendPrefix} ${money.format(Math.abs(trend))}`;
    if (trendLine) trendLine.setAttribute("points", polylinePoints(summary?.last_12_months || []));

    const entryGroups = Array.isArray(groupedPayload?.groups) ? groupedPayload.groups : [];
    renderEntriesGroupedFromServer(entriesList, entryGroups, "Nenhum lanÃ§amento encontrado.");
    if (entriesMetaEl) {
      const count = Number(groupedPayload?.count || 0);
      entriesMetaEl.textContent = count === 1 ? "1 lanÃ§amento" : `${count} lanÃ§amentos`;
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
      renderRows(nextList, nextEntries, "next", "Nenhum lanÃ§amento futuro.");
      renderCategories(monthAgg?.by_category || []);
      renderCategoriesTab(monthAgg || {}, prevMonthAgg || {});
    } catch (sectionError) {
      console.error("Erro ao renderizar seÃ§Ãµes secundÃ¡rias do dashboard:", sectionError);
    }

    await loadCategories();
    showInfo(`Atualizado com dados de ${periodLabel()}`);
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
    showError("Falha ao processar os dados do dashboard.");
  } finally {
    if (initialBootPending) {
      initialBootPending = false;
      if (window.__dashboardLoading && typeof window.__dashboardLoading.finishWithSlide === "function") {
        window.__dashboardLoading.finishWithSlide(500, 420);
      } else {
        window.setTimeout(() => {
          if (!rootApp) return;
          rootApp.classList.add("is-boot-exiting");
          window.setTimeout(() => {
            setInitialLoading(false);
          }, 420);
        }, 500);
      }
    }
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
initEntryFilters();
formatFilterPanel();
setupEntriesInteractions();
setInitialLoading(true);
void loadDashboard();






