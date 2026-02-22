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
  tabSections.forEach((section) => {
    section.hidden = section.dataset.tabContent !== tabName;
  });
  tabButtons.forEach((button) => {
    const isActive = button.dataset.tab === tabName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function setupTabNav() {
  if (!tabButtons.length || !tabSections.length) return;

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabName = String(button.dataset.tab || "");
      if (!tabName) return;
      showTab(tabName);
    });
  });

  showTab("lancamentos");
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
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
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
    headers: { Accept: "application/json" },
  });
}

async function loadDashboard() {
  hideMessages();
  refreshBtn.disabled = true;

  const month = monthRange();
  periodEl.textContent = `Período: ${periodLabel()}`;

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
      profileRes.json(),
      monthAggRes.json(),
      summaryRes.json(),
      entriesRes.json(),
    ]);

    const displayName = profile?.name || profile?.email || "Usuário";
    userTitleEl.textContent = displayName;

    const totals = monthAgg?.totals || {};
    const balance = Number(totals.balance || 0);
    const totalIn = Number(totals.in || 0);
    const totalOut = Number(totals.out || 0);

    kpiBalance.textContent = money.format(balance);
    if (balanceHeadEl) {
      balanceHeadEl.textContent = money.format(balance);
      balanceHeadEl.className = `topbar-balance__value ${toAmountClass(balance)}`.trim();
    }
    budgetLine.textContent = `${money.format(totalIn + totalOut)} orçado no mês`;

    const trend = Number((summary?.last_12_months || []).slice(-1)[0]?.month_balance || 0);
    const trendPrefix = trend >= 0 ? "+" : "-";
    trendLabel.textContent = `Resultado do mês ${trendPrefix} ${money.format(Math.abs(trend))}`;
    trendLine.setAttribute("points", polylinePoints(summary?.last_12_months || []));

    const listEntries = Array.isArray(entries) ? sortEntriesByDateDesc(entries).slice(0, 20) : [];
    renderRows(entriesList, listEntries, "entry", "Nenhum lançamento encontrado.");
    if (entriesMetaEl) {
      const count = listEntries.length;
      entriesMetaEl.textContent = count === 1 ? "1 item recente" : `${count} itens recentes`;
    }

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
    await loadCategories();
    showInfo(`Atualizado com dados de ${periodLabel()}`);
  } catch {
    showError("Falha de rede ao carregar os dados.");
  } finally {
    refreshBtn.disabled = false;
  }
}

async function logout() {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
  } finally {
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



