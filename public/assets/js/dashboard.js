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
const accountsListScreen = document.getElementById("accounts-list-screen");
const catSoFarEl = document.getElementById("cat-so-far");
const catLastMonthEl = document.getElementById("cat-last-month");
const catDonutEl = document.getElementById("cat-donut");
const entriesList = document.getElementById("entries-list");
const entriesSearchInput = document.getElementById("entries-search-input");
const txSearchOverlay = document.getElementById("tx-search-overlay");
const catSummaryOverlay = document.getElementById("cat-summary-overlay");
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
const confirmActionModalEl = document.getElementById("confirm-action-modal");
const confirmActionTitleEl = document.getElementById("confirm-action-title");
const confirmActionMessageEl = document.getElementById("confirm-action-message");
const closeConfirmActionModalBtn = document.getElementById("close-confirm-action-modal");
const cancelConfirmActionBtn = document.getElementById("cancel-confirm-action");
const confirmConfirmActionBtn = document.getElementById("confirm-confirm-action");

const tabButtons = Array.from(document.querySelectorAll(".dash-tab"));
const tabSections = Array.from(document.querySelectorAll("[data-tab-content]"));
const dashHeaderEl = document.querySelector(".dash-header");
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
const openAccountBtn = document.getElementById("open-account");
const selectedAccountEl = document.getElementById("selected-account");
const accountModal = document.getElementById("entry-account-modal");
const closeAccountModalBtn = document.getElementById("close-account-modal");
const accountSearchInput = document.getElementById("account-search");
const accountListEl = document.getElementById("account-list");
const openUserCategoryModalBtn = document.getElementById("open-user-category-modal");
const openUserAccountModalBtn = document.getElementById("open-user-account-modal");
const userCategoryModal = document.getElementById("user-category-modal");
const closeUserCategoryModalBtn = document.getElementById("close-user-category-modal");
const cancelUserCategoryBtn = document.getElementById("cancel-user-category");
const saveUserCategoryBtn = document.getElementById("save-user-category");
const userCategoryModalTitleEl = document.getElementById("user-category-modal-title");
const userCategoryNameInput = document.getElementById("user-category-name");
const openUserCategoryIconModalBtn = document.getElementById("open-user-category-icon-modal");
const selectedUserCategoryIconGlyphEl = document.getElementById("selected-user-category-icon-glyph");
const selectedUserCategoryIconTextEl = document.getElementById("selected-user-category-icon-text");
const userCategoryIconModal = document.getElementById("user-category-icon-modal");
const closeUserCategoryIconModalBtn = document.getElementById("close-user-category-icon-modal");
const userCategoryIconListEl = document.getElementById("user-category-icon-list");
const openUserCategoryGlobalModalBtn = document.getElementById("open-user-category-global-modal");
const selectedUserCategoryGlobalEl = document.getElementById("selected-user-category-global");
const userCategoryGlobalModal = document.getElementById("user-category-global-modal");
const closeUserCategoryGlobalModalBtn = document.getElementById("close-user-category-global-modal");
const userCategoryGlobalSearchInput = document.getElementById("user-category-global-search");
const userCategoryGlobalListEl = document.getElementById("user-category-global-list");
const userAccountModal = document.getElementById("user-account-modal");
const closeUserAccountModalBtn = document.getElementById("close-user-account-modal");
const cancelUserAccountBtn = document.getElementById("cancel-user-account");
const saveUserAccountBtn = document.getElementById("save-user-account");
const userAccountModalTitleEl = document.getElementById("user-account-modal-title");
const userAccountNameInput = document.getElementById("user-account-name");
const userAccountInitialBalanceInput = document.getElementById("user-account-initial-balance");
const userAccountTypeInput = document.getElementById("user-account-type");
const openUserAccountIconModalBtn = document.getElementById("open-user-account-icon-modal");
const selectedUserAccountIconGlyphEl = document.getElementById("selected-user-account-icon-glyph");
const selectedUserAccountIconTextEl = document.getElementById("selected-user-account-icon-text");
const userAccountIconModal = document.getElementById("user-account-icon-modal");
const closeUserAccountIconModalBtn = document.getElementById("close-user-account-icon-modal");
const userAccountIconListEl = document.getElementById("user-account-icon-list");
const categoryDetailModal = document.getElementById("category-detail-modal");
const closeCategoryDetailModalBtn = document.getElementById("close-category-detail-modal");
const editCategoryFromDetailBtn = document.getElementById("edit-category-from-detail");
const deleteCategoryFromDetailBtn = document.getElementById("delete-category-from-detail");
const categoryDetailFooterEl = categoryDetailModal?.querySelector("ion-footer");
const categoryDetailTitleEl = document.getElementById("category-detail-title");
const categoryDetailGlobalNameEl = document.getElementById("category-detail-global-name");
const categoryDetailTotalEl = document.getElementById("category-detail-total");
const categoryDetailBarsEl = document.getElementById("category-detail-bars");
const categoryDetailListEl = document.getElementById("category-detail-list");
const accountDetailModal = document.getElementById("account-detail-modal");
const closeAccountDetailModalBtn = document.getElementById("close-account-detail-modal");
const editAccountFromDetailBtn = document.getElementById("edit-account-from-detail");
const deleteAccountFromDetailBtn = document.getElementById("delete-account-from-detail");
const accountDetailFooterEl = accountDetailModal?.querySelector("ion-footer");
const accountDetailTitleEl = document.getElementById("account-detail-title");
const accountDetailTotalEl = document.getElementById("account-detail-total");
const accountDetailBarsEl = document.getElementById("account-detail-bars");
const accountDetailListEl = document.getElementById("account-detail-list");
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
let selectedAccountId = 0;
let accounts = [];
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
const topSummaryState = {
  categorias: { current: [], previous: [] },
  contas: { current: [], previous: [] },
};
let selectedUserCategoryIcon = "";
let selectedUserCategoryGlobalId = 0;
let userCategoryIconCatalog = [];
let userCategoryIconCatalogLoaded = false;
let dashboardEntriesCache = [];
let categoryRowsIndex = new Map();
let currentDetailCategoryName = "";
let currentDetailEditableCategoryId = 0;
let currentDetailGlobalCategoryName = "";
let editingUserCategoryId = 0;
let accountRowsIndex = new Map();
let currentDetailAccountId = 0;
let currentDetailAccountName = "";
let selectedUserAccountIcon = "";
let editingUserAccountId = 0;
let confirmActionResolver = null;
let confirmActionConfirmRole = "destructive";
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
    entriesMetaEl.textContent = "Sem dados no per\u00edodo";
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

async function confirmActionModal({
  header = "Confirmar ação",
  message = "",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmRole = "destructive",
} = {}) {
  if (!confirmActionModalEl) return false;
  confirmActionConfirmRole = String(confirmRole || "destructive");
  if (confirmActionTitleEl) confirmActionTitleEl.textContent = String(header || "Confirmar ação");
  if (confirmActionMessageEl) confirmActionMessageEl.innerHTML = String(message || "");
  if (cancelConfirmActionBtn) cancelConfirmActionBtn.textContent = String(cancelText || "Cancelar");
  if (confirmConfirmActionBtn) confirmConfirmActionBtn.textContent = String(confirmText || "Confirmar");
  return new Promise(async (resolve) => {
    confirmActionResolver = resolve;
    await confirmActionModalEl.present();
  });
}

async function closeConfirmActionModal(role = "cancel") {
  if (!confirmActionModalEl) return;
  const resolver = confirmActionResolver;
  confirmActionResolver = null;
  try {
    await confirmActionModalEl.dismiss(null, role);
  } catch {
    // no-op
  }
  if (typeof resolver === "function") {
    resolver(role === confirmActionConfirmRole);
  }
}

function setupConfirmActionModal() {
  closeConfirmActionModalBtn?.addEventListener("click", () => {
    void closeConfirmActionModal("cancel");
  });
  cancelConfirmActionBtn?.addEventListener("click", () => {
    void closeConfirmActionModal("cancel");
  });
  confirmConfirmActionBtn?.addEventListener("click", () => {
    void closeConfirmActionModal(confirmActionConfirmRole);
  });
  confirmActionModalEl?.addEventListener("ionModalDidDismiss", (event) => {
    const resolver = confirmActionResolver;
    confirmActionResolver = null;
    if (typeof resolver === "function") {
      const role = String(event?.detail?.role || "cancel");
      resolver(role === confirmActionConfirmRole);
    }
  });
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
  const isCategorias = tabName === "categorias";
  const isContas = tabName === "contas";
  tabSections.forEach((section) => {
    section.hidden = section.dataset.tabContent !== tabName;
  });
  if (txSearchOverlay) {
    txSearchOverlay.classList.toggle("is-visible", isLancamentos);
    txSearchOverlay.setAttribute("aria-hidden", isLancamentos ? "false" : "true");
  }
  if (catSummaryOverlay) {
    const showSummary = isCategorias || isContas;
    catSummaryOverlay.classList.toggle("is-visible", showSummary);
    catSummaryOverlay.setAttribute("aria-hidden", showSummary ? "false" : "true");
  }
  tabButtons.forEach((button) => {
    const isActive = button.dataset.tab === tabName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  const active = tabButtons.find((button) => button.classList.contains("is-active"));
  triggerTabLiquidFill(previousActive, active, transitionToken);
  renderTopSummaryForTab(tabName);

  requestAnimationFrame(() => {
    void scrollActiveTabIntoView(transitionToken);
    updateOverlayPositioning();
  });
}

function readCssPx(variableName, fallback = 0) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName);
  const parsed = Number.parseFloat(String(value || "").trim());
  return Number.isFinite(parsed) ? parsed : fallback;
}

function writeCssPx(variableName, value) {
  const px = Math.max(0, Number(value) || 0);
  document.documentElement.style.setProperty(variableName, `${Math.round(px)}px`);
}

function updateOverlayPositioning() {
  if (!dashHeaderEl || !tabNavShell) return;

  const headerRect = dashHeaderEl.getBoundingClientRect();
  const navRect = tabNavShell.getBoundingClientRect();
  if (!headerRect.height || !navRect.height) return;

  const minGap = readCssPx("--overlay-menu-min-gap", 14);
  const navBottomInsideHeader = navRect.bottom - headerRect.top;
  const maxOverlapInsideHeader = Math.max(0, headerRect.height - navBottomInsideHeader - minGap);

  const txSearchCard = txSearchOverlay?.querySelector(".tx-search");
  const catSummaryCard = catSummaryOverlay?.querySelector(".cat-summary");
  const txHeight = txSearchCard?.getBoundingClientRect().height || readCssPx("--tx-search-h", 64);
  const catHeight = catSummaryCard?.getBoundingClientRect().height || readCssPx("--cat-summary-h", 132);

  const txDesiredOverlap = txHeight * 0.4;
  const catDesiredOverlap = catHeight * 0.4;
  const txEffectiveOverlap = Math.min(txDesiredOverlap, maxOverlapInsideHeader);
  const catEffectiveOverlap = Math.min(catDesiredOverlap, maxOverlapInsideHeader);

  writeCssPx("--tx-search-h", txHeight);
  writeCssPx("--cat-summary-h", catHeight);
  writeCssPx("--tx-search-overlap", txDesiredOverlap);
  writeCssPx("--cat-summary-overlap", catDesiredOverlap);
  writeCssPx("--tx-search-overlap-effective", txEffectiveOverlap);
  writeCssPx("--cat-summary-overlap-effective", catEffectiveOverlap);
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
  window.addEventListener(
    "resize",
    () => {
      requestAnimationFrame(updateOverlayPositioning);
    },
    { passive: true },
  );
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
  const directName = String(name || "").trim();
  if (directName) {
    const categoryMatch = categories.find((item) => String(item?.name || "").trim() === directName);
    const explicitIcon = String(categoryMatch?.icon || "").trim().toLowerCase();
    if (/^[a-z0-9_]{2,64}$/.test(explicitIcon)) {
      return explicitIcon;
    }
  }
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
    entryModalTitleEl.textContent = isDeleted ? "Lan\u00e7amento exclu\u00eddo" : (isEdit ? "Editar lan\u00e7amento" : "Nova entrada");
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
  if (openAccountBtn) openAccountBtn.disabled = locked;
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
  if (attachmentPathEl) attachmentPathEl.textContent = "Ser\u00e1 definido ao salvar";
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
    showError("N\u00e3o foi poss\u00edvel carregar a pr\u00e9-visualiza\u00e7\u00e3o do comprovante.");
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
  await closeAccountSheet();
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

function activeTabName() {
  const active = tabButtons.find((button) => button.classList.contains("is-active"));
  return String(active?.dataset?.tab || "lancamentos");
}

function renderTopSummaryForTab(tabName) {
  const currentTab = String(tabName || activeTabName());
  if (currentTab === "categorias") {
    const state = topSummaryState.categorias || { current: [], previous: [] };
    updateTopSummaryPanel(
      state.current,
      state.previous,
      categoryBalance,
      (item) => String(item?.name || ""),
    );
    return;
  }
  if (currentTab === "contas") {
    const state = topSummaryState.contas || { current: [], previous: [] };
    updateTopSummaryPanel(
      state.current,
      state.previous,
      (item) => Number(item?.balance || 0),
      (item) => String(item?.name || ""),
    );
  }
}

async function openAccountSheet() {
  await closeDateSheet();
  await closeCategorySheet();
  await accountModal?.present();
  setPickerExpanded(openAccountBtn, true);
  refreshPickerLayerState();
  setTimeout(() => {
    accountSearchInput?.setFocus?.();
  }, 30);
}

async function closeAccountSheet() {
  try {
    await accountModal?.dismiss();
  } catch {
    // no-op: modal may already be closed
  }
  setPickerExpanded(openAccountBtn, false);
  refreshPickerLayerState();
}

async function openDateSheet() {
  await closeCategorySheet();
  await closeAccountSheet();
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
  const accountId = Number(selectedAccountId || 0);
  const date = String(selectedDateISO || "").slice(0, 10).trim();
  return ["in", "out"].includes(type)
    && Number.isFinite(amount)
    && amount > 0
    && category.length > 0
    && accountId > 0
    && /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function hasEntryMinimumRequiredData() {
  const amount = parseMoneyInput(entryAmountInput?.value || "");
  const category = String(selectedCategoryValue || "").trim();
  const accountId = Number(selectedAccountId || 0);
  return Number.isFinite(amount) && amount > 0 && category.length > 0 && accountId > 0;
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
    { key: "out", title: "Sa\u00edda", icon: "arrow_upward" },
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

function accountTypeLabel(value) {
  return String(value || "") === "card" ? "Cartões" : "Contas";
}

function accountTypeIcon(value) {
  return String(value || "") === "card" ? "credit_card" : "account_balance";
}

function renderAccountOptions() {
  if (!accountListEl) return;
  const query = String(accountSearchInput?.value || "").trim().toLowerCase();
  const searched = accounts.filter((account) =>
    String(account?.name || "").toLowerCase().includes(query)
  );

  if (!searched.length) {
    accountListEl.innerHTML = `<p class="category-empty">Nenhuma conta/cartão encontrada.</p>`;
    return;
  }

  const groups = [
    { key: "bank" },
    { key: "card" },
  ];

  const html = groups
    .map((group) => {
      const options = searched.filter((account) => String(account?.type || "bank") === group.key);
      if (!options.length) return "";
      const optionsHtml = options
        .map((account) => {
          const id = Number(account?.id || 0);
          const label = String(account?.name || "").trim();
          const isSelected = selectedAccountId === id;
          return `
            <button type="button" class="category-option is-neutral" data-account-id="${id}"${isSelected ? ' aria-current="true"' : ""}>
              <span class="category-option__lead"><span class="material-symbols-rounded">${accountTypeIcon(group.key)}</span></span>
              <span class="category-option__text">${escapeHtml(label)}</span>
            </button>
          `;
        })
        .join("");
      return `
        <section class="category-group">
          <h4 class="category-group__title">${accountTypeLabel(group.key)}</h4>
          <div class="category-group__items">${optionsHtml}</div>
        </section>
      `;
    })
    .join("");

  accountListEl.innerHTML = html || `<p class="category-empty">Nenhuma conta/cartão encontrada.</p>`;
}

async function loadAccounts(includeInactive = false) {
  try {
    const url = includeInactive ? "/api/accounts?include_inactive=1" : "/api/accounts";
    const response = await authFetch(url);
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    if (!response.ok) {
      accounts = [];
      renderAccountOptions();
      return;
    }
    const data = await response.json();
    accounts = Array.isArray(data) ? data : [];
    renderAccountOptions();
  } catch {
    accounts = [];
    renderAccountOptions();
  }
}

function globalCategoriesOnly() {
  return categories.filter((item) => String(item?.scope || "global") === "global");
}

function syncUserCategorySelections() {
  const globals = globalCategoriesOnly();
  if (!globals.length) {
    selectedUserCategoryGlobalId = 0;
  } else if (!globals.some((item) => Number(item?.id || 0) === selectedUserCategoryGlobalId)) {
    selectedUserCategoryGlobalId = Number(globals[0]?.id || 0);
  }

  if (selectedUserCategoryIconGlyphEl) {
    if (selectedUserCategoryIcon) {
      selectedUserCategoryIconGlyphEl.textContent = selectedUserCategoryIcon;
      selectedUserCategoryIconGlyphEl.hidden = false;
    } else {
      selectedUserCategoryIconGlyphEl.textContent = "label";
      selectedUserCategoryIconGlyphEl.hidden = true;
    }
  }
  if (selectedUserCategoryIconTextEl) {
    if (selectedUserCategoryIcon) {
      selectedUserCategoryIconTextEl.textContent = "Ícone selecionado";
      selectedUserCategoryIconTextEl.classList.remove("is-placeholder");
    } else {
      selectedUserCategoryIconTextEl.textContent = "Selecione um ícone";
      selectedUserCategoryIconTextEl.classList.add("is-placeholder");
    }
  }

  if (selectedUserCategoryGlobalEl) {
    const selected = globals.find((item) => Number(item?.id || 0) === selectedUserCategoryGlobalId);
    if (selected) {
      selectedUserCategoryGlobalEl.textContent = String(selected?.name || "");
      selectedUserCategoryGlobalEl.classList.remove("is-placeholder");
    } else {
      selectedUserCategoryGlobalEl.textContent = "Selecionar categoria global";
      selectedUserCategoryGlobalEl.classList.add("is-placeholder");
    }
  }
  updateUserCategorySaveState();
}

function updateUserCategorySaveState() {
  if (!saveUserCategoryBtn) return;
  const name = String(userCategoryNameInput?.value || "").trim();
  saveUserCategoryBtn.disabled = !(name && selectedUserCategoryGlobalId > 0 && selectedUserCategoryIcon);
}

async function ensureUserCategoryIconCatalogLoaded() {
  if (userCategoryIconCatalogLoaded) return;
  const fallback = Object.values(CATEGORY_GLYPH).filter((value, idx, arr) => value && arr.indexOf(value) === idx);
  try {
    const response = await fetch("/assets/data/material-symbols-rounded.json", {
      method: "GET",
      credentials: "same-origin",
      headers: authHeaders({ Accept: "application/json" }),
    });
    if (response.ok) {
      const payload = await safeJson(response, []);
      const normalized = Array.isArray(payload)
        ? payload
            .map((item) => String(item || "").trim())
            .filter((item, idx, arr) => item && arr.indexOf(item) === idx)
        : [];
      userCategoryIconCatalog = normalized.length ? normalized : fallback;
    } else {
      userCategoryIconCatalog = fallback;
    }
  } catch {
    userCategoryIconCatalog = fallback;
  } finally {
    userCategoryIconCatalogLoaded = true;
  }
}

function renderUserCategoryIconOptions() {
  if (!userCategoryIconListEl) return;
  userCategoryIconListEl.classList.add("icon-grid-list");
  const source = userCategoryIconCatalog.length ? userCategoryIconCatalog : ["label"];
  const filtered = source.slice(0, 600);
  if (!filtered.length) {
    userCategoryIconListEl.innerHTML = `<p class="category-empty">Nenhum ícone encontrado.</p>`;
    return;
  }
  userCategoryIconListEl.innerHTML = filtered
    .map((iconName) => {
      const safe = escapeHtml(iconName);
      const encoded = encodeURIComponent(iconName);
      const isSelected = selectedUserCategoryIcon === iconName;
      return `
        <button type="button" class="icon-grid-option" data-user-category-icon="${encoded}" aria-label="${safe}" title="${safe}"${isSelected ? ' aria-current="true"' : ""}>
          <span class="material-symbols-rounded">${safe}</span>
        </button>
      `;
    })
    .join("");
}

function renderUserCategoryGlobalOptions() {
  if (!userCategoryGlobalListEl) return;
  userCategoryGlobalListEl.classList.remove("icon-grid-list");
  const query = normalizeText(userCategoryGlobalSearchInput?.value || "");
  const globals = globalCategoriesOnly().filter((item) =>
    normalizeText(item?.name || "").includes(query)
  );
  if (!globals.length) {
    userCategoryGlobalListEl.innerHTML = `<p class="category-empty">Nenhuma categoria global encontrada.</p>`;
    return;
  }
  const groups = [
    { key: "in", title: "Entrada", icon: "arrow_downward" },
    { key: "out", title: "Saída", icon: "arrow_upward" },
  ];
  const html = groups
    .map((group) => {
      const options = globals.filter((item) => String(item?.type || "") === group.key);
      if (!options.length) return "";
      const optionsHtml = options
        .map((category) => {
          const id = Number(category?.id || 0);
          const label = String(category?.name || "").trim();
          const safeLabel = escapeHtml(label);
          const isSelected = selectedUserCategoryGlobalId === id;
          return `
            <button type="button" class="category-option is-${group.key}" data-user-category-global="${id}"${isSelected ? ' aria-current="true"' : ""}>
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

  userCategoryGlobalListEl.innerHTML = html || `<p class="category-empty">Nenhuma categoria global encontrada.</p>`;
}

async function openUserCategoryModal() {
  if (!userCategoryModal) return;
  editingUserCategoryId = 0;
  if (userCategoryModalTitleEl) userCategoryModalTitleEl.textContent = "Nova categoria";
  if (userCategoryNameInput) userCategoryNameInput.value = "";
  if (userCategoryGlobalSearchInput) userCategoryGlobalSearchInput.value = "";
  selectedUserCategoryIcon = "";
  syncUserCategorySelections();
  await userCategoryModal.present();
}

async function openUserCategoryEditModal(category) {
  if (!userCategoryModal) return;
  editingUserCategoryId = Number(category?.id || 0);
  if (userCategoryModalTitleEl) userCategoryModalTitleEl.textContent = "Editar categoria";
  if (userCategoryNameInput) userCategoryNameInput.value = String(category?.name || "");
  if (userCategoryGlobalSearchInput) userCategoryGlobalSearchInput.value = "";
  selectedUserCategoryIcon = String(category?.icon || "").trim();
  selectedUserCategoryGlobalId = Number(category?.global_category_id || 0);
  syncUserCategorySelections();
  await userCategoryModal.present();
}

async function closeUserCategoryModal() {
  await userCategoryModal?.dismiss();
}

async function openUserCategoryIconModal() {
  if (!userCategoryIconModal) return;
  await ensureUserCategoryIconCatalogLoaded();
  renderUserCategoryIconOptions();
  await userCategoryIconModal.present();
}

async function closeUserCategoryIconModal() {
  await userCategoryIconModal?.dismiss();
}

async function openUserCategoryGlobalModal() {
  if (!userCategoryGlobalModal) return;
  renderUserCategoryGlobalOptions();
  await userCategoryGlobalModal.present();
}

async function closeUserCategoryGlobalModal() {
  await userCategoryGlobalModal?.dismiss();
}

async function createUserCategory() {
  const name = String(userCategoryNameInput?.value || "").trim();
  const icon = String(selectedUserCategoryIcon || "").trim();
  const globalCategoryId = Number(selectedUserCategoryGlobalId || 0);
  if (!name || globalCategoryId <= 0 || !String(selectedUserCategoryIcon || "").trim()) {
    showError("Preencha nome, ícone e categoria global.");
    return;
  }

  if (saveUserCategoryBtn) saveUserCategoryBtn.disabled = true;
  try {
    const endpoint = editingUserCategoryId > 0 ? `/api/user-categories/${editingUserCategoryId}` : "/api/user-categories";
    const response = await fetch(endpoint, {
      method: editingUserCategoryId > 0 ? "PUT" : "POST",
      credentials: "same-origin",
      headers: authHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({
        name,
        icon,
        global_category_id: globalCategoryId,
      }),
    });
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    const payload = await safeJson(response, {});
    if (!response.ok) {
      showError(String(payload?.error || (editingUserCategoryId > 0 ? "Não foi possível atualizar categoria." : "Não foi possível criar categoria.")));
      return;
    }
    await closeUserCategoryModal();
    await loadCategories();
    selectedCategoryValue = String(payload?.name || name);
    if (selectedCategoryEl) {
      selectedCategoryEl.textContent = selectedCategoryValue;
      selectedCategoryEl.classList.remove("is-placeholder");
    }
    setEntryDirectionHint(selectedCategoryValue);
    setEntryTheme(entryTypeFromSelectedCategory() || "neutral");
    updateSaveState();
    showInfo(editingUserCategoryId > 0 ? "Categoria atualizada com sucesso." : "Categoria criada com sucesso.");
  } catch {
    showError(editingUserCategoryId > 0 ? "Falha de rede ao atualizar categoria." : "Falha de rede ao criar categoria.");
  } finally {
    if (saveUserCategoryBtn) saveUserCategoryBtn.disabled = false;
  }
}

function syncUserAccountSelections() {
  if (selectedUserAccountIconGlyphEl) {
    if (selectedUserAccountIcon) {
      selectedUserAccountIconGlyphEl.textContent = selectedUserAccountIcon;
      selectedUserAccountIconGlyphEl.hidden = false;
    } else {
      selectedUserAccountIconGlyphEl.textContent = "account_balance_wallet";
      selectedUserAccountIconGlyphEl.hidden = true;
    }
  }
  if (selectedUserAccountIconTextEl) {
    if (selectedUserAccountIcon) {
      selectedUserAccountIconTextEl.textContent = "Ícone selecionado";
      selectedUserAccountIconTextEl.classList.remove("is-placeholder");
    } else {
      selectedUserAccountIconTextEl.textContent = "Selecione um ícone";
      selectedUserAccountIconTextEl.classList.add("is-placeholder");
    }
  }
  updateUserAccountSaveState();
}

function updateUserAccountSaveState() {
  const hasName = String(userAccountNameInput?.value || "").trim().length > 0;
  const hasIcon = String(selectedUserAccountIcon || "").trim().length > 0;
  if (saveUserAccountBtn) {
    saveUserAccountBtn.disabled = !(hasName && hasIcon);
  }
}

function resetUserAccountModal() {
  editingUserAccountId = 0;
  if (userAccountModalTitleEl) userAccountModalTitleEl.textContent = "Nova conta/cartão";
  if (userAccountNameInput) userAccountNameInput.value = "";
  if (userAccountInitialBalanceInput) userAccountInitialBalanceInput.value = formatMoneyInput(0);
  if (userAccountTypeInput) userAccountTypeInput.value = "bank";
  selectedUserAccountIcon = "";
  syncUserAccountSelections();
}

async function openUserAccountModal() {
  resetUserAccountModal();
  await ensureUserCategoryIconCatalogLoaded();
  renderUserAccountIconOptions();
  await userAccountModal?.present();
}

async function openUserAccountEditModal(account) {
  editingUserAccountId = Number(account?.id || 0);
  if (editingUserAccountId <= 0) {
    showError("Conta/cartão inválido para edição.");
    return;
  }
  if (userAccountModalTitleEl) userAccountModalTitleEl.textContent = "Editar conta/cartão";
  if (userAccountNameInput) userAccountNameInput.value = String(account?.name || "");
  if (userAccountInitialBalanceInput) userAccountInitialBalanceInput.value = formatMoneyInput(Number(account?.initial_balance || 0));
  if (userAccountTypeInput) userAccountTypeInput.value = String(account?.type || "bank");
  selectedUserAccountIcon = String(account?.icon || "account_balance_wallet");
  syncUserAccountSelections();
  await ensureUserCategoryIconCatalogLoaded();
  renderUserAccountIconOptions();
  await userAccountModal?.present();
}

async function closeUserAccountModal() {
  await userAccountModal?.dismiss();
  resetUserAccountModal();
}

function renderUserAccountIconOptions() {
  if (!userAccountIconListEl) return;
  userAccountIconListEl.classList.add("icon-grid-list");
  const preferred = [
    "account_balance_wallet",
    "account_balance",
    "credit_card",
    "wallet",
    "savings",
    "payments",
    "paid",
    "attach_money",
    "currency_exchange",
    "receipt_long",
    "point_of_sale",
    "storefront",
    "shopping_cart",
    "local_atm",
    "calculate",
  ];
  const base = userCategoryIconCatalog.length
    ? userCategoryIconCatalog
    : preferred;
  const preferredAvailable = preferred.filter((icon) => base.includes(icon));
  const remaining = base.filter((icon) => !preferredAvailable.includes(icon));
  const ordered = [...preferredAvailable, ...remaining];
  const withSelected = selectedUserAccountIcon && !ordered.includes(selectedUserAccountIcon)
    ? [selectedUserAccountIcon, ...ordered]
    : ordered;
  const items = withSelected.slice(0, 600);
  userAccountIconListEl.innerHTML = items
    .map((iconName) => {
      const safe = escapeHtml(iconName);
      const encoded = encodeURIComponent(iconName);
      const isSelected = selectedUserAccountIcon === iconName;
      return `
        <button type="button" class="icon-grid-option" data-user-account-icon="${encoded}" aria-label="${safe}" title="${safe}"${isSelected ? ' aria-current="true"' : ""}>
          <span class="material-symbols-rounded">${safe}</span>
        </button>
      `;
    })
    .join("");
}

async function openUserAccountIconModal() {
  if (!userAccountIconModal) return;
  await ensureUserCategoryIconCatalogLoaded();
  renderUserAccountIconOptions();
  await userAccountIconModal.present();
}

async function closeUserAccountIconModal() {
  await userAccountIconModal?.dismiss();
}

async function saveUserAccount() {
  const name = String(userAccountNameInput?.value || "").trim();
  const icon = String(selectedUserAccountIcon || "").trim();
  const type = String(userAccountTypeInput?.value || "bank").trim();
  const initialBalance = parseMoneyInput(userAccountInitialBalanceInput?.value || "");
  if (!name || !icon || !["bank", "card"].includes(type)) {
    showError("Preencha nome, tipo e ícone da conta/cartão.");
    return;
  }
  if (!Number.isFinite(initialBalance)) {
    showError("Saldo inicial inválido.");
    return;
  }
  if (saveUserAccountBtn) saveUserAccountBtn.disabled = true;
  try {
    const endpoint = editingUserAccountId > 0 ? `/api/accounts/${editingUserAccountId}` : "/api/accounts";
    const response = await fetch(endpoint, {
      method: editingUserAccountId > 0 ? "PUT" : "POST",
      credentials: "same-origin",
      headers: authHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({ name, type, icon, initial_balance: initialBalance }),
    });
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    const payload = await safeJson(response, {});
    if (!response.ok) {
      showError(String(payload?.error || (editingUserAccountId > 0 ? "Não foi possível atualizar conta/cartão." : "Não foi possível criar conta/cartão.")));
      return;
    }
    await closeUserAccountModal();
    await loadAccounts(true);
    await loadDashboard();
    showInfo(editingUserAccountId > 0 ? "Conta/cartão atualizado com sucesso." : "Conta/cartão criado com sucesso.");
  } catch {
    showError(editingUserAccountId > 0 ? "Falha de rede ao atualizar conta/cartão." : "Falha de rede ao criar conta/cartão.");
  } finally {
    if (saveUserAccountBtn) saveUserAccountBtn.disabled = false;
  }
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
      <button type="button" class="entry-row entry-row--button" data-entry-id="${entryId}" aria-label="Editar lan\u00e7amento ${title}">
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

function renderEntriesEmptyState(container, message = "Nenhum lan\u00e7amento no per\u00edodo.") {
  container.innerHTML = `
    <div class="tx-empty-state" role="status" aria-live="polite">
      <p class="tx-empty-state__title">Nenhum lan\u00e7amento</p>
      <p class="tx-empty-state__text">${escapeHtml(message)}</p>
    </div>
  `;
}

function renderEntriesGroupedFromServer(container, groups, emptyText) {
  if (!Array.isArray(groups) || groups.length === 0) {
    renderEntriesEmptyState(container, emptyText || "Nenhum lan\u00e7amento encontrado.");
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
                    <div class="entry-group entry-group--day">${escapeHtml(dayGroupLabel(dayNode))}</div>
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
                <div class="entry-month__title">${escapeHtml(monthLabelWithoutYear(String(monthNode?.label || monthNode?.month || ""), String(monthNode?.month || "")))}</div>
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
    filterPanelPeriod.textContent = "Exclu\u00eddos (todos)";
    return;
  }
  const start = formatIsoDate(entryFilters.startDate);
  const end = formatIsoDate(entryFilters.endDate);
  filterPanelPeriod.textContent = start && end ? `${start} at\u00e9 ${end}` : "--";
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
  await loadAccounts(true);
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
  selectedAccountId = Number(entry.account_id || 0);
  if (selectedAccountEl) {
    const accountName = String(entry.account_name || "").trim();
    selectedAccountEl.textContent = accountName || "Selecionar conta/cartão";
    selectedAccountEl.classList.toggle("is-placeholder", !accountName);
  }
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

  categoriesListScreen?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest(".cat-row--button");
    if (!button) return;
    const encoded = String(button.getAttribute("data-category-name") || "").trim();
    const categoryName = encoded ? decodeURIComponent(encoded) : "";
    if (!categoryName) return;
    void openCategoryDetailModal(categoryName);
  });

  accountsListScreen?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-account-id]");
    if (!button) return;
    const accountId = Number(button.getAttribute("data-account-id") || 0);
    if (accountId <= 0) return;
    void openAccountDetailModal(accountId);
  });

  closeCategoryDetailModalBtn?.addEventListener("click", () => {
    void closeCategoryDetailModal();
  });

  editCategoryFromDetailBtn?.addEventListener("click", () => {
    if (!currentDetailCategoryName || currentDetailEditableCategoryId <= 0) {
      showError("Somente categorias do usuário podem ser editadas.");
      return;
    }
    const category = categories.find((item) => Number(item?.id || 0) === currentDetailEditableCategoryId);
    if (!category || String(category?.scope || "global") !== "user") {
      showError("Somente categorias do usuário podem ser editadas.");
      return;
    }
    void closeCategoryDetailModal().then(() => openUserCategoryEditModal(category));
  });

  deleteCategoryFromDetailBtn?.addEventListener("click", () => {
    void deleteUserCategoryFromDetail();
  });

  closeAccountDetailModalBtn?.addEventListener("click", () => {
    void closeAccountDetailModal();
  });

  editAccountFromDetailBtn?.addEventListener("click", () => {
    if (currentDetailAccountId <= 0) {
      showError("Conta/cartão inválido para edição.");
      return;
    }
    const account = accounts.find((item) => Number(item?.id || 0) === currentDetailAccountId);
    if (!account) {
      showError("Conta/cartão inválido para edição.");
      return;
    }
    void closeAccountDetailModal().then(() => openUserAccountEditModal(account));
  });

  deleteAccountFromDetailBtn?.addEventListener("click", () => {
    void deleteUserAccountFromDetail();
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

function hashString(value) {
  const key = normalizeText(value);
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = ((hash << 5) - hash) + key.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function clampByte(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function hslToRgbBytes(h, s, l) {
  const hue = (((Number(h) % 360) + 360) % 360) / 360;
  const sat = Math.max(0, Math.min(100, Number(s))) / 100;
  const lig = Math.max(0, Math.min(100, Number(l))) / 100;
  if (sat === 0) {
    const gray = clampByte(lig * 255);
    return [gray, gray, gray];
  }
  const q = lig < 0.5 ? lig * (1 + sat) : lig + sat - (lig * sat);
  const p = (2 * lig) - q;
  const tc = [hue + (1 / 3), hue, hue - (1 / 3)];
  const rgb = tc.map((tRaw) => {
    let t = tRaw;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    let c = p;
    if (t < (1 / 6)) c = p + ((q - p) * 6 * t);
    else if (t < (1 / 2)) c = q;
    else if (t < (2 / 3)) c = p + ((q - p) * ((2 / 3) - t) * 6);
    return clampByte(c * 255);
  });
  return [rgb[0], rgb[1], rgb[2]];
}

function rgbBytesToHex(r, g, b) {
  const toHex = (n) => clampByte(n).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex) {
  const clean = String(hex || "").trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return [0, 0, 0];
  return [
    Number.parseInt(clean.slice(0, 2), 16),
    Number.parseInt(clean.slice(2, 4), 16),
    Number.parseInt(clean.slice(4, 6), 16),
  ];
}

function srgbToLinear(channelByte) {
  const c = clampByte(channelByte) / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function contrastRatio(hexA, hexB) {
  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);
  const l1 = (0.2126 * srgbToLinear(r1)) + (0.7152 * srgbToLinear(g1)) + (0.0722 * srgbToLinear(b1));
  const l2 = (0.2126 * srgbToLinear(r2)) + (0.7152 * srgbToLinear(g2)) + (0.0722 * srgbToLinear(b2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function hueDistance(a, b) {
  const diff = Math.abs(a - b) % 360;
  return Math.min(diff, 360 - diff);
}

function isHueInRange(hue, start, end) {
  if (start <= end) return hue >= start && hue <= end;
  return hue >= start || hue <= end;
}

function isForbiddenCategoryHue(hue) {
  // Reservado para semântica financeira (positivo/negativo).
  const redBand = isHueInRange(hue, 345, 18);
  const greenBand = isHueInRange(hue, 88, 154);
  return redBand || greenBand;
}

function moveHueToAllowed(hue) {
  let candidate = ((Number(hue) % 360) + 360) % 360;
  if (!isForbiddenCategoryHue(candidate)) return candidate;
  for (let step = 1; step < 360; step += 1) {
    const forward = (candidate + step) % 360;
    if (!isForbiddenCategoryHue(forward)) return forward;
    const backward = (candidate - step + 360) % 360;
    if (!isForbiddenCategoryHue(backward)) return backward;
  }
  return 220;
}

function pickDistinctHue(baseHue, usedHues, minGap) {
  const safeBase = moveHueToAllowed(baseHue);
  if (!usedHues.length) return safeBase;
  let bestHue = baseHue;
  let bestScore = -1;
  for (let step = 0; step < 360; step += 3) {
    const forward = (safeBase + step) % 360;
    const backward = (safeBase - step + 360) % 360;
    for (const candidate of [forward, backward]) {
      if (isForbiddenCategoryHue(candidate)) continue;
      const nearest = Math.min(...usedHues.map((h) => hueDistance(candidate, h)));
      if (nearest >= minGap) return candidate;
      if (nearest > bestScore) {
        bestScore = nearest;
        bestHue = candidate;
      }
    }
  }
  return bestHue;
}

function buildCategoryToneMap(categoryNames) {
  const unique = Array.from(new Set((Array.isArray(categoryNames) ? categoryNames : [])
    .map((name) => String(name || "").trim())
    .filter(Boolean)));

  const result = new Map();
  if (!unique.length) return result;

  const canvasHex = "#eef1f5";
  const minHueGap = Math.max(14, Math.min(34, Math.floor(320 / Math.max(unique.length, 1))));
  const usedHues = [];

  const ordered = unique
    .map((name) => ({ name, hash: hashString(name) }))
    .sort((a, b) => a.hash - b.hash);

  for (const item of ordered) {
    const baseHue = Math.round((item.hash * 137.508) % 360);
    const safeBaseHue = moveHueToAllowed(baseHue);
    const hue = pickDistinctHue(safeBaseHue, usedHues, minHueGap);
    usedHues.push(hue);

    const sat = 74;
    let fgLight = 40;
    let fgHex = rgbBytesToHex(...hslToRgbBytes(hue, sat, fgLight));
    while (fgLight > 18 && contrastRatio(fgHex, canvasHex) < 4.6) {
      fgLight -= 2;
      fgHex = rgbBytesToHex(...hslToRgbBytes(hue, sat, fgLight));
    }

    const bgHex = rgbBytesToHex(...hslToRgbBytes(hue, 52, 92));
    result.set(item.name, {
      fg: fgHex,
      bg: bgHex,
      hue,
    });
  }
  return result;
}

function categoryBalance(item) {
  const inValue = Number(item?.in || 0);
  const outValue = Number(item?.out || 0);
  const explicitBalance = Number(item?.balance);
  if (Number.isFinite(explicitBalance)) return explicitBalance;
  return inValue - outValue;
}

function updateTopSummaryPanel(
  currentItems,
  previousItems,
  getBalance,
  getName,
  currentBalanceOverride = null,
  previousBalanceOverride = null,
  donutColorResolver = null,
) {
  const currList = Array.isArray(currentItems) ? currentItems : [];
  const prevList = Array.isArray(previousItems) ? previousItems : [];

  const computedCurrentBalance = currList.reduce((acc, item) => acc + Number(getBalance(item) || 0), 0);
  const computedPreviousBalance = prevList.reduce((acc, item) => acc + Number(getBalance(item) || 0), 0);
  const hasCurrentOverride = currentBalanceOverride !== null && currentBalanceOverride !== undefined && currentBalanceOverride !== "";
  const hasPreviousOverride = previousBalanceOverride !== null && previousBalanceOverride !== undefined && previousBalanceOverride !== "";
  const currentMonthBalance = hasCurrentOverride && Number.isFinite(Number(currentBalanceOverride))
    ? Number(currentBalanceOverride)
    : computedCurrentBalance;
  const previousMonthBalance = hasPreviousOverride && Number.isFinite(Number(previousBalanceOverride))
    ? Number(previousBalanceOverride)
    : computedPreviousBalance;

  if (catSoFarEl) {
    catSoFarEl.textContent = money.format(currentMonthBalance);
    catSoFarEl.classList.remove("pos", "neg");
    catSoFarEl.classList.add(currentMonthBalance >= 0 ? "pos" : "neg");
  }
  if (catLastMonthEl) {
    catLastMonthEl.textContent = money.format(previousMonthBalance);
    catLastMonthEl.classList.remove("pos", "neg");
    catLastMonthEl.classList.add(previousMonthBalance >= 0 ? "pos" : "neg");
  }

  const donutItems = currList
    .map((item) => ({ name: String(getName(item) || "").trim(), value: Math.abs(Number(getBalance(item) || 0)) }))
    .filter((item) => item.name && item.value > 0)
    .sort((a, b) => b.value - a.value);

  const toneMap = buildCategoryToneMap([
    ...currList.map((item) => String(getName(item) || "")),
    ...prevList.map((item) => String(getName(item) || "")),
  ]);

  const donutTotal = donutItems.reduce((acc, item) => acc + item.value, 0);
  if (catDonutEl) {
    if (!donutTotal) {
      catDonutEl.style.background = "conic-gradient(#dfe4ee 0turn 1turn)";
    } else {
      let cursor = 0;
      const segments = donutItems.map((item) => {
        const fraction = item.value / donutTotal;
        const start = cursor;
        cursor += fraction;
        let color = "";
        if (typeof donutColorResolver === "function") {
          const sourceItem = currList.find((entry) => String(getName(entry) || "").trim() === item.name) || null;
          color = String(donutColorResolver(sourceItem, item.name, Number(getBalance(sourceItem) || 0)) || "").trim();
        }
        if (!color) {
          const tone = toneMap.get(item.name);
          color = tone?.fg || "#2b7fff";
        }
        return `${color} ${start}turn ${cursor}turn`;
      });
      catDonutEl.style.background = `conic-gradient(${segments.join(", ")})`;
    }
  }
}

function categoryTypeByName(name) {
  const normalized = normalizeText(name);
  const match = categories.find((item) => normalizeText(item?.name || "") === normalized);
  const type = String(match?.type || "").trim();
  if (type === "in" || type === "out") return type;
  return "out";
}

function monthKeyFromIso(isoDate) {
  const value = String(isoDate || "").slice(0, 7);
  if (!/^\d{4}-\d{2}$/.test(value)) return "";
  return value;
}

function monthLabelFromKey(monthKey) {
  const [year, month] = String(monthKey || "").split("-").map((value) => Number(value));
  if (!Number.isFinite(year) || !Number.isFinite(month)) return "";
  const date = new Date(year, month - 1, 1);
  const raw = date.toLocaleDateString("pt-BR", { month: "long" }).trim();
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function monthLabelWithoutYear(label, fallbackMonthKey = "") {
  const source = String(label || "").trim();
  if (!source && fallbackMonthKey) return monthLabelFromKey(fallbackMonthKey);
  if (!source) return "";
  const cleaned = source
    .replace(/\s+de\s+\d{4}$/i, "")
    .replace(/\s+\d{4}$/i, "")
    .trim();
  if (!cleaned) return fallbackMonthKey ? monthLabelFromKey(fallbackMonthKey) : "";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function monthInitialFromKey(monthKey) {
  const [year, month] = String(monthKey || "").split("-").map((value) => Number(value));
  if (!Number.isFinite(year) || !Number.isFinite(month)) return "";
  const date = new Date(year, month - 1, 1);
  const short = String(date.toLocaleDateString("pt-BR", { month: "short" }) || "").trim();
  const normalized = short.replace(".", "");
  return normalized ? normalized.charAt(0).toUpperCase() : "";
}

function dayMonthShortLabel(isoDate) {
  const value = String(isoDate || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  const [year, month, day] = value.split("-").map((part) => Number(part));
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return "";
  const date = new Date(year, month - 1, day);
  const weekdayRaw = String(date.toLocaleDateString("pt-BR", { weekday: "short" }) || "").trim();
  const weekday = weekdayRaw.replace(".", "").slice(0, 3).toUpperCase();
  const monthShortRaw = String(date.toLocaleDateString("pt-BR", { month: "short" }) || "").trim();
  const monthShort = monthShortRaw.replace(".", "").slice(0, 3).toUpperCase();
  return `${weekday}, ${String(day).padStart(2, "0")}/${monthShort}`;
}

function dayGroupLabel(dayNode) {
  const direct = String(dayNode?.date || dayNode?.day || "").slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(direct)) return dayMonthShortLabel(direct);
  const firstEntryDate = String((Array.isArray(dayNode?.entries) && dayNode.entries[0]?.date) || "").slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(firstEntryDate)) return dayMonthShortLabel(firstEntryDate);
  return String(dayNode?.label || "").trim().toUpperCase();
}

function buildCategoryMonthlyBars(categoryName) {
  const keyNow = monthRange();
  const [yearNow, monthNow] = keyNow.split("-").map((value) => Number(value));
  const months = [];
  for (let i = 17; i >= 0; i -= 1) {
    const date = new Date(yearNow, monthNow - 1 - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    months.push({ key, label: monthInitialFromKey(key) });
  }
  const map = new Map(months.map((item) => [item.key, 0]));
  const normalizedCategory = normalizeText(categoryName);
  dashboardEntriesCache.forEach((entry) => {
    if (Number(entry?.deleted || 0) === 1) return;
    if (normalizeText(entry?.category || "") !== normalizedCategory) return;
    const key = monthKeyFromIso(entry?.date || "");
    if (!map.has(key)) return;
    map.set(key, Number(map.get(key) || 0) + Number(entry?.amount || 0));
  });
  const values = months.map((item) => Number(map.get(item.key) || 0));
  const max = Math.max(...values, 1);
  return months.map((item, idx) => ({
    label: item.label,
    value: values[idx],
    ratio: Math.max(6, Math.round((values[idx] / max) * 100)),
  }));
}

function signedEntryAmount(entry) {
  const amount = Number(entry?.amount || 0);
  return entry?.type === "out" ? -1 * amount : amount;
}

function buildCategoryEntriesHierarchy(categoryName) {
  const normalizedCategory = normalizeText(categoryName);
  const filtered = dashboardEntriesCache
    .filter((entry) => Number(entry?.deleted || 0) !== 1)
    .filter((entry) => normalizeText(entry?.category || "") === normalizedCategory)
    .sort((a, b) => String(b?.date || "").localeCompare(String(a?.date || "")));

  const yearsMap = new Map();
  filtered.forEach((entry) => {
    const iso = String(entry?.date || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return;
    const yearKey = iso.slice(0, 4);
    const monthKey = iso.slice(0, 7);
    const signed = signedEntryAmount(entry);

    if (!yearsMap.has(yearKey)) {
      yearsMap.set(yearKey, { yearKey, total: 0, monthsMap: new Map() });
    }
    const yearNode = yearsMap.get(yearKey);
    yearNode.total += signed;

    if (!yearNode.monthsMap.has(monthKey)) {
      yearNode.monthsMap.set(monthKey, { monthKey, total: 0, daysMap: new Map() });
    }
    const monthNode = yearNode.monthsMap.get(monthKey);
    monthNode.total += signed;
    const dayKey = iso;
    if (!monthNode.daysMap.has(dayKey)) {
      monthNode.daysMap.set(dayKey, { dayKey, total: 0, entries: [] });
    }
    const dayNode = monthNode.daysMap.get(dayKey);
    dayNode.total += signed;
    dayNode.entries.push(entry);
  });

  return [...yearsMap.values()]
    .sort((a, b) => b.yearKey.localeCompare(a.yearKey))
    .map((yearNode) => ({
      yearKey: yearNode.yearKey,
      total: yearNode.total,
      months: [...yearNode.monthsMap.values()]
        .sort((a, b) => b.monthKey.localeCompare(a.monthKey))
        .map((monthNode) => ({
          monthKey: monthNode.monthKey,
          total: monthNode.total,
          days: [...monthNode.daysMap.values()]
            .sort((a, b) => b.dayKey.localeCompare(a.dayKey)),
        })),
    }));
}

function buildCategoryGroupsForLaunchListPattern(categoryName) {
  const hierarchy = buildCategoryEntriesHierarchy(categoryName);
  return hierarchy.map((yearNode) => ({
    year: yearNode.yearKey,
    label: yearNode.yearKey,
    totals: { balance: Number(yearNode.total || 0) },
    months: (Array.isArray(yearNode.months) ? yearNode.months : []).map((monthNode) => ({
      month: monthNode.monthKey,
      label: monthLabelFromKey(monthNode.monthKey),
      totals: { balance: Number(monthNode.total || 0) },
      days: (Array.isArray(monthNode.days) ? monthNode.days : []).map((dayNode) => ({
        day: dayNode.dayKey,
        label: dayMonthShortLabel(dayNode.dayKey),
        totals: { balance: Number(dayNode.total || 0) },
        entries: (Array.isArray(dayNode.entries) ? dayNode.entries : []).map((entry) => ({
          ...entry,
          category: String(entry?.category || categoryName || "").trim(),
        })),
      })),
    })),
  }));
}

function buildAccountMonthlyBars(accountName) {
  const keyNow = monthRange();
  const [yearNow, monthNow] = keyNow.split("-").map((value) => Number(value));
  const months = [];
  for (let i = 17; i >= 0; i -= 1) {
    const date = new Date(yearNow, monthNow - 1 - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    months.push({ key, label: monthInitialFromKey(key) });
  }
  const map = new Map(months.map((item) => [item.key, 0]));
  const normalizedAccount = normalizeText(accountName);
  dashboardEntriesCache.forEach((entry) => {
    if (Number(entry?.deleted || 0) === 1) return;
    if (normalizeText(entry?.account_name || "") !== normalizedAccount) return;
    const key = monthKeyFromIso(entry?.date || "");
    if (!map.has(key)) return;
    map.set(key, Number(map.get(key) || 0) + Number(entry?.amount || 0));
  });
  const values = months.map((item) => Number(map.get(item.key) || 0));
  const max = Math.max(...values, 1);
  return months.map((item, idx) => ({
    label: item.label,
    value: values[idx],
    ratio: Math.max(6, Math.round((values[idx] / max) * 100)),
  }));
}

function buildAccountEntriesHierarchy(accountName) {
  const normalizedAccount = normalizeText(accountName);
  const filtered = dashboardEntriesCache
    .filter((entry) => Number(entry?.deleted || 0) !== 1)
    .filter((entry) => normalizeText(entry?.account_name || "") === normalizedAccount)
    .sort((a, b) => String(b?.date || "").localeCompare(String(a?.date || "")));

  const yearsMap = new Map();
  filtered.forEach((entry) => {
    const iso = String(entry?.date || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return;
    const yearKey = iso.slice(0, 4);
    const monthKey = iso.slice(0, 7);
    const signed = signedEntryAmount(entry);
    if (!yearsMap.has(yearKey)) {
      yearsMap.set(yearKey, { yearKey, total: 0, monthsMap: new Map() });
    }
    const yearNode = yearsMap.get(yearKey);
    yearNode.total += signed;
    if (!yearNode.monthsMap.has(monthKey)) {
      yearNode.monthsMap.set(monthKey, { monthKey, total: 0, daysMap: new Map() });
    }
    const monthNode = yearNode.monthsMap.get(monthKey);
    monthNode.total += signed;
    const dayKey = iso;
    if (!monthNode.daysMap.has(dayKey)) {
      monthNode.daysMap.set(dayKey, { dayKey, total: 0, entries: [] });
    }
    const dayNode = monthNode.daysMap.get(dayKey);
    dayNode.total += signed;
    dayNode.entries.push(entry);
  });

  return [...yearsMap.values()]
    .sort((a, b) => b.yearKey.localeCompare(a.yearKey))
    .map((yearNode) => ({
      yearKey: yearNode.yearKey,
      total: yearNode.total,
      months: [...yearNode.monthsMap.values()]
        .sort((a, b) => b.monthKey.localeCompare(a.monthKey))
        .map((monthNode) => ({
          monthKey: monthNode.monthKey,
          total: monthNode.total,
          days: [...monthNode.daysMap.values()]
            .sort((a, b) => b.dayKey.localeCompare(a.dayKey)),
        })),
    }));
}

function buildAccountGroupsForLaunchListPattern(accountName) {
  const hierarchy = buildAccountEntriesHierarchy(accountName);
  return hierarchy.map((yearNode) => ({
    year: yearNode.yearKey,
    label: yearNode.yearKey,
    totals: { balance: Number(yearNode.total || 0) },
    months: (Array.isArray(yearNode.months) ? yearNode.months : []).map((monthNode) => ({
      month: monthNode.monthKey,
      label: monthLabelFromKey(monthNode.monthKey),
      totals: { balance: Number(monthNode.total || 0) },
      days: (Array.isArray(monthNode.days) ? monthNode.days : []).map((dayNode) => ({
        day: dayNode.dayKey,
        label: dayMonthShortLabel(dayNode.dayKey),
        totals: { balance: Number(dayNode.total || 0) },
        entries: (Array.isArray(dayNode.entries) ? dayNode.entries : []).map((entry) => ({
          ...entry,
          category: String(entry?.category || "").trim(),
        })),
      })),
    })),
  }));
}

function renderCategoryDetailModal(categoryName) {
  if (!categoryDetailModal || !categoryDetailTitleEl || !categoryDetailTotalEl || !categoryDetailBarsEl || !categoryDetailListEl) return;
  const meta = categoryRowsIndex.get(categoryName);
  if (!meta) return;
  currentDetailCategoryName = categoryName;
  const categoryType = categoryTypeByName(categoryName);
  const graphColor = categoryType === "in" ? "#2f925f" : "#c95b5b";
  const sameNameCategories = categories.filter((item) => normalizeText(item?.name || "") === normalizeText(categoryName));
  const hasGlobalCategory = sameNameCategories.some((item) => String(item?.scope || "global") === "global");
  const globalCategoryWithSameName = sameNameCategories.find((item) => String(item?.scope || "global") === "global");
  const editableUserCategory = sameNameCategories.find((item) => String(item?.scope || "global") === "user");
  const isUserCategory = !hasGlobalCategory && Boolean(editableUserCategory);
  currentDetailEditableCategoryId = isUserCategory ? Number(editableUserCategory?.id || 0) : 0;
  currentDetailGlobalCategoryName = isUserCategory ? String(editableUserCategory?.global_name || "").trim() : "";
  if (editCategoryFromDetailBtn) {
    editCategoryFromDetailBtn.style.display = isUserCategory ? "" : "none";
    editCategoryFromDetailBtn.disabled = !isUserCategory;
  }
  if (deleteCategoryFromDetailBtn) {
    deleteCategoryFromDetailBtn.style.display = isUserCategory ? "" : "none";
    deleteCategoryFromDetailBtn.disabled = !isUserCategory;
  }
  if (categoryDetailFooterEl) {
    categoryDetailFooterEl.style.display = isUserCategory ? "" : "none";
  }

  categoryDetailTitleEl.textContent = categoryName;
  if (categoryDetailGlobalNameEl) {
    const candidate = String(
      editableUserCategory?.global_name
      || globalCategoryWithSameName?.name
      || currentDetailGlobalCategoryName
      || ""
    ).trim();
    const shouldShow = candidate && normalizeText(candidate) !== normalizeText(categoryName);
    categoryDetailGlobalNameEl.hidden = !shouldShow;
    categoryDetailGlobalNameEl.textContent = shouldShow ? candidate : "";
  }
  categoryDetailTotalEl.textContent = money.format(Number(meta?.currBalance || 0));
  categoryDetailTotalEl.classList.remove("pos", "neg");
  categoryDetailTotalEl.classList.add(Number(meta?.currBalance || 0) >= 0 ? "pos" : "neg");

  const bars = buildCategoryMonthlyBars(categoryName);
  categoryDetailBarsEl.innerHTML = bars
    .map((bar) => `
      <span class="category-detail-bars__item">
        <span class="category-detail-bars__slot">
          <span class="category-detail-bars__bar" style="height:${bar.ratio}%;--bar-color:${graphColor}"></span>
        </span>
        <span class="category-detail-bars__label">${escapeHtml(bar.label)}</span>
      </span>
    `)
    .join("");

  const groups = buildCategoryGroupsForLaunchListPattern(categoryName);
  renderEntriesGroupedFromServer(categoryDetailListEl, groups, "Sem lançamentos para esta categoria.");
}

async function openCategoryDetailModal(categoryName) {
  renderCategoryDetailModal(categoryName);
  await categoryDetailModal?.present();
}

async function closeCategoryDetailModal() {
  currentDetailCategoryName = "";
  currentDetailEditableCategoryId = 0;
  currentDetailGlobalCategoryName = "";
  await categoryDetailModal?.dismiss();
}

function renderAccountDetailModal(accountId) {
  if (!accountDetailModal || !accountDetailTitleEl || !accountDetailTotalEl || !accountDetailBarsEl || !accountDetailListEl) return;
  const meta = accountRowsIndex.get(Number(accountId));
  if (!meta) return;
  currentDetailAccountId = Number(accountId);
  currentDetailAccountName = String(meta?.name || "");
  const graphColor = Number(meta?.currBalance || 0) >= 0 ? "#2f925f" : "#c95b5b";
  if (editAccountFromDetailBtn) {
    editAccountFromDetailBtn.style.display = "";
    editAccountFromDetailBtn.disabled = false;
  }
  if (deleteAccountFromDetailBtn) {
    deleteAccountFromDetailBtn.style.display = "";
    deleteAccountFromDetailBtn.disabled = false;
  }
  if (accountDetailFooterEl) {
    accountDetailFooterEl.style.display = "";
  }

  accountDetailTitleEl.textContent = currentDetailAccountName || "Conta/Cartão";
  accountDetailTotalEl.textContent = money.format(Number(meta?.currBalance || 0));
  accountDetailTotalEl.classList.remove("pos", "neg");
  accountDetailTotalEl.classList.add(Number(meta?.currBalance || 0) >= 0 ? "pos" : "neg");

  const bars = buildAccountMonthlyBars(currentDetailAccountName);
  accountDetailBarsEl.innerHTML = bars
    .map((bar) => `
      <span class="category-detail-bars__item">
        <span class="category-detail-bars__slot">
          <span class="category-detail-bars__bar" style="height:${bar.ratio}%;--bar-color:${graphColor}"></span>
        </span>
        <span class="category-detail-bars__label">${escapeHtml(bar.label)}</span>
      </span>
    `)
    .join("");

  const groups = buildAccountGroupsForLaunchListPattern(currentDetailAccountName);
  renderEntriesGroupedFromServer(accountDetailListEl, groups, "Sem lançamentos para esta conta/cartão.");
}

async function openAccountDetailModal(accountId) {
  renderAccountDetailModal(accountId);
  await accountDetailModal?.present();
}

async function closeAccountDetailModal() {
  currentDetailAccountId = 0;
  currentDetailAccountName = "";
  await accountDetailModal?.dismiss();
}

async function deleteUserAccountFromDetail() {
  if (currentDetailAccountId <= 0) {
    showError("Conta/cartão inválido para exclusão.");
    return;
  }
  const confirmed = await confirmActionModal({
    header: "Excluir conta/cartão",
    message: "Se houver lançamentos vinculados, a conta/cartão será apenas desativada.",
    confirmText: "Excluir",
    cancelText: "Cancelar",
    confirmRole: "destructive",
  });
  if (!confirmed) return;
  try {
    const response = await fetch(`/api/accounts/${currentDetailAccountId}`, {
      method: "DELETE",
      credentials: "same-origin",
      headers: authHeaders({ Accept: "application/json" }),
    });
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    const payload = await safeJson(response, {});
    if (!response.ok) {
      showError(String(payload?.error || "Não foi possível excluir conta/cartão."));
      return;
    }
    await closeAccountDetailModal();
    await loadAccounts(true);
    await loadDashboard();
    if (payload?.deactivated) {
      showInfo("Conta/cartão desativada porque possui lançamentos vinculados.");
    } else {
      showInfo("Conta/cartão excluído com sucesso.");
    }
  } catch {
    showError("Falha de rede ao excluir conta/cartão.");
  }
}

async function deleteUserCategoryFromDetail() {
  if (!currentDetailCategoryName || currentDetailEditableCategoryId <= 0) {
    showError("Somente categorias do usuário podem ser excluídas.");
    return;
  }

  const globalName = String(currentDetailGlobalCategoryName || "").trim();
  const warning = globalName
    ? `Os lançamentos desta categoria não serão excluídos. Eles serão movidos para a categoria global <strong>${escapeHtml(globalName)}</strong>.`
    : "Os lançamentos desta categoria não serão excluídos. Eles serão movidos para a categoria global vinculada.";

  const confirmed = await confirmActionModal({
    header: "Excluir categoria",
    message: warning,
    confirmText: "Excluir",
    cancelText: "Cancelar",
    confirmRole: "destructive",
  });
  if (!confirmed) return;

  try {
    const response = await fetch(`/api/user-categories/${currentDetailEditableCategoryId}`, {
      method: "DELETE",
      credentials: "same-origin",
      headers: authHeaders({ Accept: "application/json" }),
    });
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    const payload = await safeJson(response, {});
    if (!response.ok) {
      showError(String(payload?.error || "Não foi possível excluir a categoria."));
      return;
    }
    await closeCategoryDetailModal();
    await loadCategories();
    await loadDashboard();
    showInfo("Categoria excluída. Lançamentos movidos para a categoria global.");
  } catch {
    showError("Falha de rede ao excluir a categoria.");
  }
}

function renderCategoriesTab(currentAgg, previousAgg) {
  if (!categoriesListScreen) return;

  const currentItems = Array.isArray(currentAgg?.by_category) ? currentAgg.by_category : [];
  const previousItems = Array.isArray(previousAgg?.by_category) ? previousAgg.by_category : [];
  topSummaryState.categorias.current = currentItems;
  topSummaryState.categorias.previous = previousItems;
  const prevMap = new Map(previousItems.map((item) => [String(item?.name || ""), categoryBalance(item)]));

  const toneMap = buildCategoryToneMap([
    ...currentItems.map((item) => String(item?.name || "")),
    ...previousItems.map((item) => String(item?.name || "")),
  ]);

  const listItems = currentItems
    .map((item) => {
      const name = String(item?.name || "").trim();
      const currBalance = categoryBalance(item);
      const prevBalance = Number(prevMap.get(name) || 0);
      return { name, currBalance, prevBalance };
    })
    .filter((item) => item.name);

  categoryRowsIndex = new Map();

  if (!listItems.length) {
    categoriesListScreen.innerHTML = `<p class="cat-empty">Sem dados de categorias no per\u00edodo.</p>`;
    return;
  }

  categoriesListScreen.innerHTML = listItems
    .map((item) => {
      const icon = categoryGlyph(item.name);
      const tone = toneMap.get(item.name) || { fg: "#2b7fff", bg: "#eaf1ff" };
      const toneColor = tone.fg;
      const chipBg = tone.bg;
      const safeName = escapeHtml(item.name);
      const currAbs = Math.abs(item.currBalance);
      const prevAbs = Math.abs(item.prevBalance);
      const base = Math.max(currAbs, prevAbs, 1);
      const currWidth = Math.max(0, Math.min(100, Math.round((currAbs / base) * 100)));
      const prevWidth = Math.max(0, Math.min(100, Math.round((prevAbs / base) * 100)));
      const currClass = item.currBalance >= 0 ? "pos" : "neg";
      const prevClass = item.prevBalance >= 0 ? "pos" : "neg";
      const encodedName = encodeURIComponent(item.name);
      categoryRowsIndex.set(item.name, { currBalance: item.currBalance, prevBalance: item.prevBalance, toneColor, chipBg });

      return `
        <button type="button" class="cat-row cat-row--button" data-category-name="${encodedName}">
          <div class="cat-row__meta">
            <span class="cat-chip" style="--cat-chip-bg:${chipBg};--cat-chip-fg:${toneColor}"><span class="material-symbols-rounded cat-chip__icon">${icon}</span>${safeName}</span>
          </div>
          <div class="cat-row__curr ${currClass}">${money.format(item.currBalance)}</div>
          <span class="cat-row__bar" style="--cat-tone:${toneColor}">
            <span class="cat-row__bar-fill-prev" style="width:${prevWidth}%"></span>
            <span class="cat-row__bar-fill-curr" style="width:${currWidth}%"></span>
          </span>
          <div class="cat-row__prev ${prevClass}">${money.format(item.prevBalance)}</div>
        </button>
      `;
    })
    .join("");
}

function renderAccountsTab(currentAgg, previousAgg) {
  if (!accountsListScreen) return;

  const currentItems = Array.isArray(currentAgg?.by_account) ? currentAgg.by_account : [];
  const previousItems = Array.isArray(previousAgg?.by_account) ? previousAgg.by_account : [];
  topSummaryState.contas.current = currentItems;
  topSummaryState.contas.previous = previousItems;
  const prevMap = new Map(previousItems.map((item) => [String(item?.name || ""), Number(item?.balance || 0)]));

  const listItems = currentItems
    .map((item) => {
      const name = String(item?.name || "").trim();
      const id = Number(item?.id || 0);
      const type = String(item?.type || "bank");
      const currBalance = Number(item?.balance || 0);
      const prevBalance = Number(prevMap.get(name) || 0);
      const normalizedName = name || "Sem conta/cartão";
      return { id, type, name: normalizedName, currBalance, prevBalance };
    })
    .filter((item) => item.name);

  accountRowsIndex = new Map();
  if (!listItems.length) {
    accountsListScreen.innerHTML = `<p class="cat-empty">Sem dados de contas/cartões no período.</p>`;
    return;
  }

  const toneMap = buildCategoryToneMap([
    ...currentItems.map((item) => String(item?.name || "")),
    ...previousItems.map((item) => String(item?.name || "")),
  ]);

  accountsListScreen.innerHTML = listItems
    .map((item) => {
      const tone = toneMap.get(item.name) || { fg: "#2b7fff", bg: "#eaf1ff" };
      const toneColor = tone.fg;
      const chipBg = tone.bg;
      const icon = item.id <= 0
        ? "account_balance_wallet"
        : (item.type === "card" ? "credit_card" : "account_balance");
      const safeName = escapeHtml(item.name);
      const currAbs = Math.abs(item.currBalance);
      const prevAbs = Math.abs(item.prevBalance);
      const base = Math.max(currAbs, prevAbs, 1);
      const currWidth = Math.max(0, Math.min(100, Math.round((currAbs / base) * 100)));
      const prevWidth = Math.max(0, Math.min(100, Math.round((prevAbs / base) * 100)));
      const currClass = item.currBalance >= 0 ? "pos" : "neg";
      const prevClass = item.prevBalance >= 0 ? "pos" : "neg";

      accountRowsIndex.set(item.id, {
        id: item.id,
        name: item.name,
        type: item.type,
        currBalance: item.currBalance,
        prevBalance: item.prevBalance,
      });

      return `
        <button type="button" class="cat-row cat-row--button" data-account-id="${item.id}">
          <div class="cat-row__meta">
            <span class="cat-chip" style="--cat-chip-bg:${chipBg};--cat-chip-fg:${toneColor}"><span class="material-symbols-rounded cat-chip__icon">${icon}</span>${safeName}</span>
          </div>
          <div class="cat-row__curr ${currClass}">${money.format(item.currBalance)}</div>
          <span class="cat-row__bar" style="--cat-tone:${toneColor}">
            <span class="cat-row__bar-fill-prev" style="width:${prevWidth}%"></span>
            <span class="cat-row__bar-fill-curr" style="width:${currWidth}%"></span>
          </span>
          <div class="cat-row__prev ${prevClass}">${money.format(item.prevBalance)}</div>
        </button>
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
    syncUserCategorySelections();
  } catch {
    categories = [];
    renderCategoryOptions("");
    syncUserCategorySelections();
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
    throw new Error(data?.error || "N\u00e3o foi poss\u00edvel enviar o comprovante.");
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
  selectedAccountId = 0;
  if (accountSearchInput) accountSearchInput.value = "";
  if (selectedAccountEl) {
    selectedAccountEl.textContent = "Selecionar conta/cartão";
    selectedAccountEl.classList.add("is-placeholder");
  }
  setEntryDirectionHint("");
  setPickerExpanded(openCategoryBtn, false);
  setPickerExpanded(openAccountBtn, false);
  if (entryDescriptionInput) entryDescriptionInput.value = "";
  selectedDateISO = todayIsoDate();
  if (datePicker) datePicker.value = selectedDateISO;
  if (selectedDateEl) {
    selectedDateEl.textContent = formatIsoDate(selectedDateISO);
    selectedDateEl.classList.remove("is-placeholder");
  }
  setPickerExpanded(openDateBtn, false);
  renderCategoryOptions("");
  renderAccountOptions();
  clearAttachmentSelection();
  updateSaveState();
}

async function openEntryModal() {
  hideMessages();
  resetEntryForm();
  await loadCategories();
  await loadAccounts();
  setEntryModalMode("create");
  await entryModal?.present();
  setEntryLayerState(true);
}

async function closeEntryModal() {
  await closeAttachmentViewer();
  await closeCategorySheet();
  await closeAccountSheet();
  await closeDateSheet();
  await entryModal?.dismiss();
  setEntryLayerState(false);
  refreshPickerLayerState();
}

async function createEntry() {
  const type = entryTypeFromSelectedCategory();
  const amount = parseMoneyInput(entryAmountInput?.value || "");
  const category = String(selectedCategoryValue || "").trim();
  const accountId = Number(selectedAccountId || 0);
  const date = String(selectedDateISO || "").slice(0, 10).trim();
  const description = String(entryDescriptionInput?.value || "").trim();

  if (!["in", "out"].includes(type)) {
    showError("Selecione uma categoria v\u00e1lida.");
    return;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    showError("Informe um valor v\u00e1lido.");
    return;
  }
  if (!category) {
    showError("Categoria \u00e9 obrigat\u00f3ria.");
    return;
  }
  if (accountId <= 0) {
    showError("Conta/cartão é obrigatória.");
    return;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    showError("Data inv\u00e1lida.");
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
        account_id: accountId,
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
      showError(data?.error || "N\u00e3o foi poss\u00edvel salvar a entrada.");
      return;
    }

    await closeEntryModal();
    showInfo(editingEntryId ? "Lan\u00e7amento atualizado com sucesso." : "Entrada adicionada com sucesso.");
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
      showError("N\u00e3o foi poss\u00edvel restaurar o lan\u00e7amento.");
      return;
    }
    await closeEntryModal();
    showInfo("Lan\u00e7amento restaurado com sucesso.");
    await loadDashboard();
  } catch {
    showError("Falha de rede ao restaurar o lan\u00e7amento.");
  }
}

async function deleteEntry() {
  if (!editingEntryId || editingEntryDeleted) return;
  const confirmed = await confirmActionModal({
    header: "Excluir lançamento",
    message: "Este lançamento será movido para excluídos e poderá ser restaurado depois.",
    confirmText: "Excluir",
    cancelText: "Cancelar",
    confirmRole: "destructive",
  });
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
      showError("N\u00e3o foi poss\u00edvel excluir o lan\u00e7amento.");
      return;
    }
    await closeEntryModal();
    showInfo("Lan\u00e7amento exclu\u00eddo com sucesso.");
    await loadDashboard();
  } catch {
    showError("Falha de rede ao excluir o lan\u00e7amento.");
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

  openAccountBtn?.addEventListener("click", () => {
    renderAccountOptions();
    void openAccountSheet();
  });

  accountSearchInput?.addEventListener("ionInput", () => {
    const typed = String(accountSearchInput?.value || "").trim();
    const selected = accounts.find((item) => Number(item?.id || 0) === Number(selectedAccountId || 0));
    if (selected && typed && typed !== String(selected?.name || "")) {
      selectedAccountId = 0;
      if (selectedAccountEl) {
        selectedAccountEl.textContent = "Selecionar conta/cartão";
        selectedAccountEl.classList.add("is-placeholder");
      }
      updateSaveState();
    }
    renderAccountOptions();
  });

  accountListEl?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-account-id]");
    if (!button) return;
    const accountId = Number(button.getAttribute("data-account-id") || 0);
    if (accountId <= 0) return;
    const account = accounts.find((item) => Number(item?.id || 0) === accountId);
    if (!account) return;
    selectedAccountId = accountId;
    if (accountSearchInput) accountSearchInput.value = String(account?.name || "");
    if (selectedAccountEl) {
      selectedAccountEl.textContent = String(account?.name || "");
      selectedAccountEl.classList.remove("is-placeholder");
    }
    updateSaveState();
    void closeAccountSheet();
  });

  closeAccountModalBtn?.addEventListener("click", () => {
    void closeAccountSheet();
  });

  openUserCategoryModalBtn?.addEventListener("click", () => {
    void openUserCategoryModal();
  });

  openUserAccountModalBtn?.addEventListener("click", () => {
    void openUserAccountModal();
  });

  closeUserCategoryModalBtn?.addEventListener("click", () => {
    void closeUserCategoryModal();
  });

  cancelUserCategoryBtn?.addEventListener("click", () => {
    void closeUserCategoryModal();
  });

  closeUserAccountModalBtn?.addEventListener("click", () => {
    void closeUserAccountModal();
  });

  cancelUserAccountBtn?.addEventListener("click", () => {
    void closeUserAccountModal();
  });

  saveUserCategoryBtn?.addEventListener("click", () => {
    void createUserCategory();
  });

  userCategoryNameInput?.addEventListener("ionInput", () => {
    updateUserCategorySaveState();
  });

  saveUserAccountBtn?.addEventListener("click", () => {
    void saveUserAccount();
  });

  userAccountNameInput?.addEventListener("ionInput", () => {
    updateUserAccountSaveState();
  });

  userAccountInitialBalanceInput?.addEventListener("ionInput", (event) => {
    const raw = event?.detail?.value ?? userAccountInitialBalanceInput.value ?? "";
    const value = parseMoneyInput(String(raw));
    if (userAccountInitialBalanceInput) {
      userAccountInitialBalanceInput.value = formatMoneyInput(Number.isFinite(value) ? value : 0);
    }
  });

  userAccountTypeInput?.addEventListener("ionChange", () => {
    updateUserAccountSaveState();
  });

  openUserCategoryIconModalBtn?.addEventListener("click", () => {
    void openUserCategoryIconModal();
  });

  closeUserCategoryIconModalBtn?.addEventListener("click", () => {
    void closeUserCategoryIconModal();
  });

  openUserAccountIconModalBtn?.addEventListener("click", () => {
    void openUserAccountIconModal();
  });

  closeUserAccountIconModalBtn?.addEventListener("click", () => {
    void closeUserAccountIconModal();
  });

  userCategoryIconListEl?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-user-category-icon]");
    if (!button) return;
    const encoded = String(button.getAttribute("data-user-category-icon") || "").trim();
    const iconName = encoded ? decodeURIComponent(encoded) : "";
    if (!iconName) return;
    selectedUserCategoryIcon = iconName;
    syncUserCategorySelections();
    renderUserCategoryIconOptions();
    void closeUserCategoryIconModal();
  });

  userAccountIconListEl?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-user-account-icon]");
    if (!button) return;
    const encoded = String(button.getAttribute("data-user-account-icon") || "").trim();
    const iconName = encoded ? decodeURIComponent(encoded) : "";
    if (!iconName) return;
    selectedUserAccountIcon = iconName;
    syncUserAccountSelections();
    renderUserAccountIconOptions();
    void closeUserAccountIconModal();
  });

  openUserCategoryGlobalModalBtn?.addEventListener("click", () => {
    void openUserCategoryGlobalModal();
  });

  closeUserCategoryGlobalModalBtn?.addEventListener("click", () => {
    void closeUserCategoryGlobalModal();
  });

  userCategoryGlobalSearchInput?.addEventListener("ionInput", () => {
    renderUserCategoryGlobalOptions();
  });

  userCategoryGlobalListEl?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-user-category-global]");
    if (!button) return;
    const id = Number(button.getAttribute("data-user-category-global") || 0);
    if (id <= 0) return;
    selectedUserCategoryGlobalId = id;
    syncUserCategorySelections();
    renderUserCategoryGlobalOptions();
    void closeUserCategoryGlobalModal();
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

  userAccountModal?.addEventListener("ionModalDidDismiss", () => {
    refreshPickerLayerState();
  });

  userAccountModal?.addEventListener("ionModalDidPresent", () => {
    refreshPickerLayerState();
  });

  accountModal?.addEventListener("ionModalDidDismiss", () => {
    setPickerExpanded(openAccountBtn, false);
    refreshPickerLayerState();
  });

  accountModal?.addEventListener("ionModalDidPresent", () => {
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
  if (periodEl) periodEl.textContent = `Per\u00edodo: ${periodLabel()}`;

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
      showError("N\u00e3o foi poss\u00edvel carregar o dashboard.");
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

    dashboardEntriesCache = Array.isArray(entries) ? entries : [];

    const displayName = profile?.name || profile?.email || "Usu\u00e1rio";
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
    if (budgetLine) budgetLine.textContent = `${money.format(totalIn + totalOut)} or\u00e7ado no m\u00eas`;

    const trend = Number((summary?.last_12_months || []).slice(-1)[0]?.month_balance || 0);
    const trendPrefix = trend >= 0 ? "+" : "-";
    if (trendLabel) trendLabel.textContent = `Resultado do m\u00eas ${trendPrefix} ${money.format(Math.abs(trend))}`;
    if (trendLine) trendLine.setAttribute("points", polylinePoints(summary?.last_12_months || []));

    const entryGroups = Array.isArray(groupedPayload?.groups) ? groupedPayload.groups : [];
    renderEntriesGroupedFromServer(entriesList, entryGroups, "Nenhum lan\u00e7amento encontrado.");
    if (entriesMetaEl) {
      const count = Number(groupedPayload?.count || 0);
      entriesMetaEl.textContent = count === 1 ? "1 lan\u00e7amento" : `${count} lan\u00e7amentos`;
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
      renderRows(nextList, nextEntries, "next", "Nenhum lan\u00e7amento futuro.");
      renderCategories(monthAgg?.by_category || []);
      renderCategoriesTab(monthAgg || {}, prevMonthAgg || {});
      renderAccountsTab(monthAgg || {}, prevMonthAgg || {});
      renderTopSummaryForTab(activeTabName());
    } catch (sectionError) {
      console.error("Erro ao renderizar se\u00e7\u00f5es secund\u00e1rias do dashboard:", sectionError);
    }

    await loadCategories();
    await loadAccounts(true);
    showInfo(`Atualizado com dados de ${periodLabel()}`);
    requestAnimationFrame(updateOverlayPositioning);
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
setupConfirmActionModal();
initEntryFilters();
formatFilterPanel();
setupEntriesInteractions();
setInitialLoading(true);
requestAnimationFrame(updateOverlayPositioning);
void loadDashboard();








