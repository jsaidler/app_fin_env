const state = {


  token: null,


  user: null,


  entries: [],


  adminEntries: [],


  trash: [],


  users: [],


  categories: [],


  closedMonths: [],


  supportThreads: [],

  supportMessages: [],

  supportActiveThreadId: null,

  supportEntryId: null,

  activeView: null,

  entryReturnView: null,

  entryDetailReturnView: null,

  closureReport: null,


  closureEntries: [],


};


const API_BASE = '/api';


const views = [
  'view-auth',
  'view-dashboard',
  'view-reports',
  'view-support',
  'view-support-chat',
  'view-entry',
  'view-entry-detail',
  'view-user-options',
  'view-admin-users',
  'view-admin-categories',
  'view-admin-locks',
];

const TRANSIENT_VIEWS = new Set(['view-entry', 'view-entry-detail', 'view-support-chat']);


const STORAGE_LAST_VIEW = 'lastView';


let attachmentPreviewUrl = null;

let supportNewAttachment = null;

let supportReplyAttachment = null;

let confirmResolve = null;


const attachmentCache = new Map();


let isSubmittingEntry = false;


let currentUploadController = null;


function setRoleClass(role) {


  document.body.classList.remove('role-admin', 'role-user');


  if (role === 'admin') document.body.classList.add('role-admin');


  else if (role === 'user') document.body.classList.add('role-user');


}





function emailValid(v) {


  return /^[^@\s]+@[^@\s]+(\.[^@\s]+)?$/.test(v);


}





function resolveStartView(defaultView) {


  const saved = localStorage.getItem(STORAGE_LAST_VIEW);


  if (!saved || saved === 'view-auth') return defaultView;

  if (TRANSIENT_VIEWS.has(saved)) return defaultView;


  if (!views.includes(saved)) return defaultView;


  if (!state.token) return defaultView;


  if (saved.startsWith('view-admin') && state.user?.role !== 'admin') return defaultView;


  return saved;


}





function persistView(view) {


  if (view === 'view-auth') {


    localStorage.removeItem(STORAGE_LAST_VIEW);


    return;


  }


  if (!state.token) return;


  if (!views.includes(view)) return;

  if (TRANSIENT_VIEWS.has(view)) return;


  if (view.startsWith('view-admin') && state.user?.role !== 'admin') return;


  localStorage.setItem(STORAGE_LAST_VIEW, view);


}





function goTo(view) {


  if (!view) return;

  const previousView = state.activeView;


  const unauth = !state.token;


  if (unauth && view !== 'view-auth') {


    view = 'view-auth';


  }


  if (view.startsWith('view-admin') && state.user?.role !== 'admin') return;

  if (previousView === 'view-entry' && view !== 'view-entry') {

    cleanupEntryView();

  }


  views.forEach(id => {


    const el = document.getElementById(id);


    if (!el) return;


    const active = id === view;


    el.hidden = !active;


    el.classList.toggle('active', active);


  });


  document.body.classList.toggle('is-auth-view', view === 'view-auth');


  const bottomNav = document.querySelector('.c-bottom-nav, .bottom-nav');


  if (bottomNav) {


    const isAuth = view === 'view-auth';


    const isAdmin = state.user?.role === 'admin';


    bottomNav.hidden = isAuth || isAdmin;


    bottomNav.querySelectorAll('[data-go-view]').forEach(btn => {


      const target = btn.dataset.goView;


      btn.classList.toggle('active', target === view);
      btn.classList.toggle('is-active', target === view);


    });


  }


  persistView(view);

  state.activeView = view;


  rerenderCharts(view);


}





function clearAttachmentCache() {


  attachmentCache.forEach(url => URL.revokeObjectURL(url));


  attachmentCache.clear();


}





async function fetchAttachmentUrl(relPath) {


  if (!relPath || !state.token) return null;


  if (attachmentCache.has(relPath)) return attachmentCache.get(relPath);


  const headers = { Authorization: 'Bearer ' + state.token };


  const res = await fetch('/uploads/' + relPath.replace(/^\/+/, ''), { headers }).catch(() => null);


  if (!res || !res.ok) return null;


  const blob = await res.blob();


  const url = URL.createObjectURL(blob);


  attachmentCache.set(relPath, url);


  return url;


}





async function renderAttachmentPreview(container, relPath) {


  if (!container || !relPath) return;


  const url = await fetchAttachmentUrl(relPath);


  if (!url) {


    container.innerHTML = '<p class="muted tiny">Não foi possível carregar o anexo.</p>';
    return;


  }


  container.innerHTML = `<img src="${url}" alt="Anexo do lançamento">


    <a class="download-fab" href="${url}" download title="Baixar anexo" aria-label="Baixar anexo">


      <span class="material-icons-outlined">download</span>


    </a>`;


}


async function renderSupportAttachment(container, relPath) {

  if (!container || !relPath) return;

  const url = await fetchAttachmentUrl(relPath);

  if (!url) {

    container.innerHTML = '<span class="muted tiny">Nao foi possivel carregar.</span>';

    return;

  }

  container.innerHTML = `<img src="${url}" alt="Anexo do suporte">

    <a class="support-attachment-link" href="${url}" download title="Baixar anexo" aria-label="Baixar anexo">Baixar</a>`;

}


async function init() {


  if ('serviceWorker' in navigator) {


    navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister())).catch(() => {});


    if (typeof caches !== 'undefined') {


      caches.keys().then(keys => keys.forEach(k => caches.delete(k))).catch(() => {});


    }


  }


  wireEvents();


  setDefaultMonthFilters();


  const saved = JSON.parse(localStorage.getItem('auth') || 'null');


  if (saved?.token) {


    state.token = saved.token;


    state.user = saved.user;


    const ok = await ensureSession(true);


    if (!ok) goTo('view-auth');


  } else {


    goTo('view-auth');


  }


}








function wireEvents() {


  const bind = (id, evt, fn) => {


    const el = document.getElementById(id);


    if (el) el.addEventListener(evt, fn);


  };


  window.addEventListener('resize', () => adjustKpiTextSizes());


  bind('login-form', 'submit', submitLogin);


  const loginForm = document.getElementById('login-form');


  if (loginForm) {


    loginForm.setAttribute('novalidate', 'true');


    ['input', 'blur'].forEach(evt => {


      loginForm.addEventListener(evt, ev => {


        const field = ev.target?.name;


        if (!field) return;


        clearLoginErrors(loginForm, field);


      });


    });


  }


  bind('btn-add', 'click', () => openEntryView('in'));


  bind('btn-entry-back', 'click', () => closeEntryView());


  bind('nav-add-in', 'click', () => openEntryView('in'));


  bind('nav-add-out', 'click', () => openEntryView('out'));


  bind('entry-type-in', 'click', () => setEntryType('in'));


  bind('entry-type-out', 'click', () => setEntryType('out'));

  bindEntrySheet();
  bindFilterSheet();


  bind('entry-form', 'submit', submitEntry);


  bind('filter-type', 'change', renderEntries);


  ui.enhanceSelect('filter-type');


  bind('filter-start', 'change', renderEntries);


  bind('filter-end', 'change', renderEntries);


  bind('filter-reset', 'click', resetUserFilters);


  bind('filter-toggle', 'click', (e) => toggleFilterPanel('filter-controls', e.currentTarget));

  bind('dashboard-filter-btn', 'click', () => openFilterSheet());

  bind('filter-apply-sheet', 'click', applyFilterSheet);

  bind('filter-close-sheet', 'click', closeFilterSheet);


  bind('report-type', 'change', renderReports);


  ui.enhanceSelect('report-type');


  bind('report-start', 'change', renderReports);


  bind('report-end', 'change', renderReports);


  bind('report-reset', 'click', resetReportFilters);


  bind('report-toggle', 'click', (e) => toggleFilterPanel('report-controls', e.currentTarget));


  bind('btn-report-pdf', 'click', exportReportTablePdf);


  bind('report-list', 'click', handleReportTableClick);
  bind('report-closure-month', 'change', loadClosureReport);
  bind('report-closure-refresh', 'click', loadClosureReport);
  bind('support-new-form', 'submit', submitSupportThread);
  bind('support-reply-form', 'submit', submitSupportReply);
  bind('btn-export', 'click', exportPdf);


  bind('entries-list', 'click', handleEntryClick);
  const entriesList = document.getElementById('entries-list');
  if (entriesList) entriesList.addEventListener('click', handleStatusTooltipClick);


  const trash = document.getElementById('trash-list');


  if (trash) trash.addEventListener('click', handleTrashClick);


  bind('btn-empty-trash', 'click', emptyTrash);


  bind('profile-form', 'submit', updateProfile);


  bind('password-form', 'submit', changePassword);


  bind('close-month-form', 'submit', closeMonth);


  bind('btn-logout', 'click', logout);


  bind('category-form', 'submit', submitCategory);


  bind('user-form', 'submit', submitUser);


  bind('btn-cancel-upload', 'click', cancelAttachmentUpload);


  bind('btn-new-user', 'click', () => toggleArea('user-form-area', true));


  bind('btn-new-category', 'click', () => toggleArea('category-form-area', true));


  bind('users-table', 'click', handleUserAction);


  bind('categories-table', 'click', handleCategoryAction);


  bind('select-all-users', 'change', toggleSelectAllUsers);


  bind('btn-entry-detail-back', 'click', () => toggleReportEntryModal(false));

  const supportThreads = document.getElementById('support-thread-list');

  if (supportThreads) supportThreads.addEventListener('click', handleSupportThreadClick);


  bind('support-back', 'click', () => goTo('view-support'));

  bind('support-entry-view', 'click', handleSupportEntryView);


  document.querySelectorAll('[data-go-view]').forEach(btn => btn.addEventListener('click', e => {

    cleanupEntryView();

    goTo(e.currentTarget.dataset.goView);

  }));


  bind('btn-go-admin', 'click', () => { cleanupEntryView(); goTo('view-admin-users'); });


  bind('btn-go-admin-2', 'click', () => { cleanupEntryView(); goTo('view-admin-users'); });


  const navOptions = document.getElementById('nav-options');


  if (navOptions) navOptions.addEventListener('click', () => { cleanupEntryView(); goTo('view-user-options'); });


  bind('btn-logout-options', 'click', () => { cleanupEntryView(); logout(); });


  document.querySelectorAll('.c-bottom-nav [data-go-view], .bottom-nav [data-go-view]').forEach(btn => btn.addEventListener('click', e => {

    cleanupEntryView();

    goTo(e.target.closest('button').dataset.goView);

  }));


  document.querySelectorAll('input[name="amount"], input[data-mask="money"]').forEach(el => {


    el.addEventListener('input', (ev) => { maskMoney(ev); validateEntryField(ev.target); });


    el.addEventListener('blur', (ev) => { maskMoney(ev); validateEntryField(ev.target); });


  });


  const dateInput = document.getElementById('entry-date');


  if (dateInput) {


    dateInput.addEventListener('input', (ev) => { maskDate(ev); validateEntryField(ev.target); });


    dateInput.addEventListener('blur', (ev) => { maskDate(ev); validateEntryField(ev.target); });


  }


  setDefaultEntryDate(true);


  const categoryInput = document.getElementById('entry-category');


  if (categoryInput) {


    categoryInput.addEventListener('change', (ev) => validateEntryField(ev.target));


  }


  setupAttachmentPreview();

  setupSupportAttachmentPreviews();

  clearAttachmentPreview(true);


}





function currentMonthValue() {


  const now = new Date();


  const month = String(now.getMonth() + 1).padStart(2, '0');


  return `${now.getFullYear()}-${month}`;


}





function setDefaultMonthFilters() {


  const current = currentMonthValue();


  ['filter-start', 'filter-end', 'report-start', 'report-end', 'close-month'].forEach(id => {


    const el = document.getElementById(id);


    if (el && !el.value) el.value = current;


  });


}





function resetUserFilters() {


  const current = currentMonthValue();


  const start = document.getElementById('filter-start');


  const end = document.getElementById('filter-end');


  const type = document.getElementById('filter-type');


  if (start) start.value = current;


  if (end) end.value = current;


  if (type) {


    type.value = 'all';


    type.dispatchEvent(new Event('change', { bubbles: true }));


  }


  renderEntries();


}





function resetReportFilters() {


  const current = currentMonthValue();


  const start = document.getElementById('report-start');


  const end = document.getElementById('report-end');


  const type = document.getElementById('report-type');


  if (start) start.value = current;


  if (end) end.value = current;


  if (type) {


    type.value = 'all';


    type.dispatchEvent(new Event('change', { bubbles: true }));


  }


  renderReports();


}





function normalizeMonthRange(startMonth, endMonth) {


  let start = startMonth ? `${startMonth}-01` : '';


  let end = endMonth ? `${endMonth}-31` : '';


  if (start && end && start > end) {


    const tmp = start;


    start = end;


    end = tmp;


  }


  return { start, end };


}





function isDateInRange(date, start, end) {


  if (start && date < start) return false;


  if (end && date > end) return false;


  return true;


}





function rerenderCharts(view) {


  if (view === 'view-dashboard') {


    loadSummaryChart();


  } else if (view === 'view-reports') {


    renderReports();


  }


  if (view === 'view-dashboard' || view === 'view-reports') {


    requestAnimationFrame(() => adjustKpiTextSizes());


  }


}





function fitTextToContainer(el, baseSize = 48, minSize = 28) {


  if (!el) return;


  const container = el.closest('.kpi-card') || el.parentElement || el;


  if (!container) return;


  const style = window.getComputedStyle(container);


  const padding =


    parseFloat(style.paddingLeft || '0') +


    parseFloat(style.paddingRight || '0');


  const maxWidth = Math.max(0, (container.clientWidth || container.scrollWidth) - padding);


  if (!maxWidth) return;


  let size = baseSize;


  el.style.display = 'inline-block';


  el.style.whiteSpace = 'nowrap';


  el.style.maxWidth = `${maxWidth}px`;


  el.style.fontSize = `${size}px`;


  el.style.transform = '';


  el.style.transformOrigin = 'center center';


  while (el.scrollWidth > maxWidth && size > minSize) {


    size -= 1;


    el.style.fontSize = `${size}px`;


  }


  if (el.scrollWidth > maxWidth) {


    const ratio = Math.max(0.45, maxWidth / el.scrollWidth);


    el.style.transform = `scale(${ratio})`;


  }


}





function adjustKpiTextSizes() {


  fitTextToContainer(document.getElementById('balance'), 48, 30);


  fitTextToContainer(document.getElementById('total-in'), 18, 6);


  fitTextToContainer(document.getElementById('total-out'), 18, 6);


  fitTextToContainer(document.getElementById('report-balance'), 48, 30);


  fitTextToContainer(document.getElementById('report-total-in'), 18, 6);


  fitTextToContainer(document.getElementById('report-total-out'), 18, 6);


}





function maskMoney(e) {


  const digits = e.target.value.replace(/\D/g, '').replace(/^0+/, '');


  if (!digits) {


    e.target.value = '';


    return;


  }


  const cents = Number(digits);


  const value = cents / 100;


  e.target.value = 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (e.target.id === 'entry-amount') {
    updateEntryAmountPreview();
  }


}





function maskDate(e) {


  const digits = e.target.value.replace(/\D/g, '').slice(0, 8);


  const parts = [];


  if (digits.length > 0) parts.push(digits.slice(0, 2));


  if (digits.length >= 3) parts.push(digits.slice(2, 4));


  if (digits.length >= 5) parts.push(digits.slice(4, 8));


  e.target.value = parts.join('/');


}





function todayDateBR() {


  const now = new Date();


  const day = String(now.getDate()).padStart(2, '0');


  const month = String(now.getMonth() + 1).padStart(2, '0');


  return `${day}/${month}/${now.getFullYear()}`;


}





function setDefaultEntryDate(force = false) {


  const input = document.getElementById('entry-date');


  if (!input) return;


  if (!force && input.value.trim()) return;


  input.value = todayDateBR();


  maskDate({ target: input });


}





function parseDateBR(value) {


  const clean = value.replace(/\D/g, '');


  if (clean.length !== 8) return null;


  const day = Number(clean.slice(0, 2));


  const month = Number(clean.slice(2, 4));


  const year = Number(clean.slice(4, 8));


  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900) return null;


  const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;


  const d = new Date(iso);


  if (Number.isNaN(d.getTime())) return null;


  // ensure date matches (avoid 31/02 rolling over)


  if (d.getUTCFullYear() !== year || d.getUTCMonth() + 1 !== month || d.getUTCDate() !== day) return null;


  return iso;


}





function parseMoney(value) {


  const digits = String(value).replace(/\D/g, '');


  if (!digits) return null;


  const cents = Number(digits);


  if (!Number.isFinite(cents)) return null;


  return cents / 100;


}





function clearInvalid(form) {


  if (!form) return;


  form.querySelectorAll('.input-invalid').forEach(el => el.classList.remove('input-invalid'));


  const catSelect = document.getElementById('entry-category');


  if (catSelect && catSelect._trigger) catSelect._trigger.classList.remove('input-invalid');


}





function markInvalid(el) {


  if (!el) return;


  el.classList.add('input-invalid');


  if (el.id === 'entry-category' && el._trigger) {


    el._trigger.classList.add('input-invalid');


  }


}





function clearInvalidField(el) {


  if (!el) return;


  el.classList.remove('input-invalid');


  if (el.id === 'entry-category' && el._trigger) {


    el._trigger.classList.remove('input-invalid');


  }


}





function clearLoginErrors(form, field = null) {


  if (!form) return;


  if (field) {


    const input = form.querySelector(`[name="${field}"]`);


    clearInvalidField(input);


  } else {


    clearInvalid(form);


  }


  form.querySelectorAll('.field-error').forEach(err => {


    if (!field || err.dataset.field === field) {


      err.textContent = '';


      err.hidden = true;


    }


  });


  if (!field) {


    const formError = form.querySelector('.form-error');


    if (formError) formError.hidden = true;


  }


}





function showLoginError(form, field, message) {


  if (!form) return;


  const input = form.querySelector(`[name="${field}"]`);


  if (input) markInvalid(input);


  const err = form.querySelector(`.field-error[data-field="${field}"]`);


  if (err) {


    err.textContent = message;


    err.hidden = false;


  }


}





function showLoginFormError(form, message) {


  const box = form?.querySelector('.form-error');


  if (box) {


    box.textContent = message;


    box.hidden = false;


  } else {


    ui.toast(message);


  }


}





function validateEntryField(el) {


  if (!el) return false;


  if (el.name === 'amount') {


    const raw = el.value.trim();


    if (!raw) { markInvalid(el); return false; }


    const parsed = parseMoney(raw);


    if (parsed === null || parsed <= 0) { markInvalid(el); return false; }


    clearInvalidField(el); return true;


  }


  if (el.name === 'date' || el.id === 'entry-date') {


    const raw = el.value.trim();


    if (!raw) { markInvalid(el); return false; }


    const iso = parseDateBR(raw);


    if (!iso) { markInvalid(el); return false; }


    clearInvalidField(el); return true;


  }


  if (el.name === 'category' || el.id === 'entry-category') {


    if (!el.value.trim()) { markInvalid(el); return false; }


    clearInvalidField(el); return true;


  }


  return true;


}





function validateUserOptionField(el) {


  if (!el) return true;


  const val = (el.value || '').trim();


  if (el.name === 'name') {


    if (!val) { markInvalid(el); return false; }


    clearInvalidField(el); return true;


  }


  if (el.name === 'current_password') {


    if (!val) { markInvalid(el); return false; }


    clearInvalidField(el); return true;


  }


  if (el.name === 'password') {


    if (val.length < 8) { markInvalid(el); return false; }


    clearInvalidField(el); return true;


  }


  return true;


}





function showConfirmModal(message, title = 'Confirmar') {

  return Promise.resolve(window.confirm(message));

}





function resolveConfirmModal(ok) {


  const modal = document.getElementById('confirm-modal');


  if (modal) modal.hidden = true;


  document.body.classList.remove('modal-open');


  if (confirmResolve) {


    confirmResolve(ok);


    confirmResolve = null;


  }


}


async function submitLogin(e) {


  e.preventDefault();


  const form = e.target;


  const email = (form.email?.value || '').trim().toLowerCase();


  const password = form.password?.value || '';


  clearLoginErrors(form);


  let hasError = false;


  if (!email) {


    showLoginError(form, 'email', 'Informe seu email');


    hasError = true;


  } else if (!emailValid(email)) {


    showLoginError(form, 'email', 'Use um email valido');


    hasError = true;


  }


  if (!password) {


    showLoginError(form, 'password', 'Digite sua senha');


    hasError = true;


  } else if (password.length < 6) {


    showLoginError(form, 'password', 'Mínimo de 6 caracteres');


    hasError = true;


  }


  if (hasError) {


    showLoginFormError(form, 'Corrija os campos destacados antes de continuar.');


    return;


  }


  const res = await api.post(`${API_BASE}/auth/login`, { email, password });


  if (res.ok) {


    state.token = res.data.token;


    state.user = res.data.user;


    localStorage.setItem('auth', JSON.stringify({ token: state.token, user: state.user }));


    const ok = await ensureSession(true);


    if (!ok) ui.toast('Não foi possível validar a sessão');
  } else {


    showLoginError(form, 'password', 'Verifique email e senha');


    showLoginFormError(form, res.error || 'Falha no login');


  }


}





function clearAuth() {


  state.token = null;


  state.user = null;


  localStorage.removeItem('auth');


  localStorage.removeItem(STORAGE_LAST_VIEW);


  clearAttachmentCache();


  setRoleClass(null);


  goTo('view-auth');


}





function logout() {


  clearAuth();


  ui.toast('Sessão encerrada');


  goTo('view-auth');


  toggleModal(false);


}





function applyTheme(theme) {


  const isLight = theme === 'light';


  document.body.classList.toggle('theme-light', isLight);


  document.documentElement.classList.toggle('theme-light', isLight);


  const select = document.getElementById('theme-select');


  if (select) select.value = theme;


}





async function ensureSession(fromInit = false) {


  const res = await api.get(`${API_BASE}/account/profile`);


  if (!res.ok) {


    clearAuth();


    if (!fromInit) goTo('view-auth');


    return false;


  }


  state.user = res.data;


  localStorage.setItem('auth', JSON.stringify({ token: state.token, user: state.user }));


  applyTheme(state.user.theme || 'dark');


  if (state.user.role === 'admin') {


    window.location.href = '/admin.html';


    return true;


  }


  setRoleClass(state.user.role);


  const defaultView = 'view-dashboard';


  const startView = resolveStartView(defaultView);


  toggleUserUI(true);


  goTo(startView);


  await loadCategories();


  await loadClosedMonths();


  await loadEntries();


  await loadSupportThreads();


  await loadTrash();


  await loadSummaryChart();


  updateUserChip();


  populateProfileForm();


  return true;


}





async function loadEntries() {


  const res = await api.get(`${API_BASE}/entries`);


  if (!res.ok) {


    ui.toast(res.error || 'Erro ao carregar');


    return;


  }


  state.entries = res.data;


  renderEntries();


  await loadSummaryChart();


  renderReports();


}





async function loadSupportThreads() {

  const res = await api.get(`${API_BASE}/support/threads`);

  if (!res.ok) return;

  state.supportThreads = res.data.threads || [];

  renderSupportThreads();

  if (state.supportActiveThreadId && !state.supportThreads.some(t => Number(t.id) === Number(state.supportActiveThreadId))) {

    state.supportActiveThreadId = null;

  }

  if (!state.supportThreads.length) {

    state.supportActiveThreadId = null;

    state.supportMessages = [];

    renderSupportMessages();

    return;

  }

  const shouldLoadMessages = state.activeView === 'view-support-chat';

  if (!shouldLoadMessages) return;

  if (!state.supportActiveThreadId && state.supportThreads.length) {

    state.supportActiveThreadId = state.supportThreads[0].id;

  }

  if (state.supportActiveThreadId) {

    await loadSupportMessages(state.supportActiveThreadId);

  }

}


function renderSupportThreads() {

  const container = document.getElementById('support-thread-list');

  const empty = document.getElementById('support-thread-empty');

  if (!container) return;

  container.innerHTML = '';

  if (!state.supportThreads.length) {

    if (empty) empty.hidden = false;

    return;

  }

  if (empty) empty.hidden = true;

  state.supportThreads.forEach(thread => {

    const btn = document.createElement('button');

    btn.type = 'button';

    const isActive = Number(state.supportActiveThreadId) === Number(thread.id);

    btn.className = `support-thread-item${isActive ? ' active' : ''}`;

    btn.dataset.threadId = String(thread.id);

    const when = thread.last_at ? formatDateTime(thread.last_at) : '';

    const unread = Number(thread.unread_count || 0);

    const previewText = thread.last_message || (thread.last_attachment ? 'Anexo' : '');

    const preview = escapeHtml(previewText);

    btn.innerHTML = `<div class="support-thread-title">${escapeHtml(thread.subject || 'Atendimento')}</div>

      <div class="support-thread-meta">

        <span>${when || 'Sem data'}</span>

        ${unread ? `<span class="count-badge">${unread}</span>` : ''}

      </div>

      <div class="support-thread-preview">${preview}</div>`;

    container.appendChild(btn);

  });

}


async function loadSupportMessages(threadId) {

  if (!threadId) return;

  if (supportReplyAttachment) supportReplyAttachment.clear(true);

  const res = await api.get(`${API_BASE}/support/messages?thread_id=${threadId}`);

  if (!res.ok) {

    ui.toast(res.error || 'Erro ao carregar mensagens');

    return;

  }

  state.supportActiveThreadId = Number(threadId);

  state.supportMessages = res.data.messages || [];

  renderSupportMessages();

  renderSupportThreads();

}


function renderSupportMessages() {

  const list = document.getElementById('support-chat');

  const empty = document.getElementById('support-chat-empty');

  const subject = document.getElementById('support-active-subject');

  const meta = document.getElementById('support-active-meta');

  if (!list) return;

  list.innerHTML = '';

  const active = state.supportThreads.find(t => Number(t.id) === Number(state.supportActiveThreadId));

  if (subject) subject.textContent = active?.subject || 'Selecione um atendimento';

  if (meta) {

    meta.textContent = active ? formatDateTime(active.updated_at || active.created_at || '') : '-';

  }

  renderSupportEntrySummary(active);

  if (!state.supportActiveThreadId || !state.supportMessages.length) {

    if (empty) empty.hidden = !state.supportActiveThreadId;

    return;

  }

  if (empty) empty.hidden = true;

  state.supportMessages.forEach(m => {

    const wrapper = document.createElement('div');

    const role = m.sender_role === 'admin' ? 'from-admin' : 'from-user';

    wrapper.className = `support-message ${role}`;

    const createdAt = m.created_at ? new Date(m.created_at) : null;

    const when = createdAt && !Number.isNaN(createdAt.getTime())

      ? createdAt.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

      : '';

    const attachment = m.attachment_path

      ? `<div class="support-attachment" data-attachment="${m.attachment_path}"></div>`

      : '';

    const message = escapeHtml(m.message || '');

    wrapper.innerHTML = `${message ? `<div class="support-bubble">${message}</div>` : ''}

      ${attachment}

      ${when ? `<div class="support-meta">${when}</div>` : ''}`;

    list.appendChild(wrapper);

  });

  list.querySelectorAll('.support-attachment[data-attachment]').forEach(container => {

    renderSupportAttachment(container, container.dataset.attachment);

  });

  list.scrollTop = list.scrollHeight;

}

function renderSupportEntrySummary(active) {

  const summary = document.getElementById('support-entry-summary');

  const title = document.getElementById('support-entry-title');

  const meta = document.getElementById('support-entry-meta');

  const btn = document.getElementById('support-entry-view');

  if (!summary || !title || !meta || !btn) return;

  if (!active?.entry_id) {

    summary.hidden = true;

    state.supportEntryId = null;

    btn.disabled = true;

    return;

  }

  const entryId = Number(active.entry_id);

  const entry = state.entries.find(item => Number(item.id) === entryId);

  state.supportEntryId = entryId;

  title.textContent = `Lançamento #${entryId}`;

  if (entry) {

    const label = entry.type === 'in' ? 'Entrada' : 'Saída';

    meta.textContent = `${label} ${formatMoney(Number(entry.amount || 0))} - ${formatDate(entry.date)}`;

    btn.disabled = false;

  } else {

    meta.textContent = 'Detalhes indisponiveis no momento.';

    btn.disabled = true;

  }

  summary.hidden = false;

}

async function handleSupportEntryView() {
  const entryId = Number(state.supportEntryId);

  if (!entryId) {
    ui.toast('Nenhum lançamento relacionado.');
    return;
  }

  let entry = state.entries.find(item => Number(item.id) === entryId);

  if (!entry) {
    await loadEntries();
    entry = state.entries.find(item => Number(item.id) === entryId);
  }

  if (!entry) {
    ui.toast('Lançamento não encontrado.');
    return;
  }

  showReportEntryDetails(entry);
}


async function submitSupportThread(e) {

  e.preventDefault();

  const subject = (e.target.subject?.value || '').trim();

  const message = (e.target.message?.value || '').trim();

  const hasFile = supportNewAttachment?.getFile?.();

  if (!subject) return ui.toast('Informe o assunto');

  if (!message && !hasFile) return ui.toast('Informe a mensagem ou o anexo');

  const res = await api.post(`${API_BASE}/support/threads`, { subject });

  if (!res.ok) {

    ui.toast(res.error || 'Erro ao abrir atendimento');

    return;

  }

  const thread = res.data || {};

  const upload = await uploadSupportAttachment(supportNewAttachment);

  if (!upload.ok) return;

  const msgRes = await api.post(`${API_BASE}/support/messages`, {

    thread_id: thread.id,

    message,

    attachment_path: upload.path || null,

  });

  if (!msgRes.ok) {

    ui.toast(msgRes.error || 'Erro ao enviar mensagem');

    return;

  }

  e.target.reset();

  supportNewAttachment.clear(true);

  state.supportActiveThreadId = thread.id;

  await loadSupportThreads();

  await openSupportChat(thread.id);

}


async function submitSupportReply(e) {

  e.preventDefault();

  if (!state.supportActiveThreadId) return ui.toast('Selecione um atendimento');

  const message = (e.target.message?.value || '').trim();

  const hasFile = supportReplyAttachment?.getFile?.();

  if (!message && !hasFile) return ui.toast('Digite a mensagem ou anexe um arquivo');

  const upload = await uploadSupportAttachment(supportReplyAttachment);

  if (!upload.ok) return;

  const res = await api.post(`${API_BASE}/support/messages`, {

    thread_id: state.supportActiveThreadId,

    message,

    attachment_path: upload.path || null,

  });

  if (res.ok) {

    e.target.reset();

    supportReplyAttachment.clear(true);

    await loadSupportMessages(state.supportActiveThreadId);

    await loadSupportThreads();

  } else {

    ui.toast(res.error || 'Erro ao enviar mensagem');

  }

}

async function openSupportChat(threadId) {

  const id = Number(threadId);

  if (!id) return;

  state.supportActiveThreadId = id;

  goTo('view-support-chat');

  await loadSupportMessages(id);

}


function handleSupportThreadClick(e) {

  const btn = e.target.closest('.support-thread-item');

  if (!btn) return;

  const id = Number(btn.dataset.threadId);

  if (!id) return;

  openSupportChat(id);

}


function renderEntries() {


  const ul = document.getElementById('entries-list');


  const empty = document.getElementById('entries-empty');


  if (!ul) return;


  ul.innerHTML = '';


  if (empty) empty.hidden = true;


  const typeFilter = document.getElementById('filter-type')?.value || 'all';


  const startMonth = document.getElementById('filter-start')?.value || '';


  const endMonth = document.getElementById('filter-end')?.value || '';


  const range = normalizeMonthRange(startMonth, endMonth);


  const rangeEntries = state.entries.filter(e => isDateInRange(e.date, range.start, range.end));


  const filtered = rangeEntries.filter(e => typeFilter === 'all' || e.type === typeFilter);


  updateFilterSummary('filter', startMonth, endMonth, typeFilter);
  updateFilterIndicator(startMonth, endMonth, typeFilter);


  const approvedEntries = filtered.filter(e => !e.needs_review);

  renderPeriodInsights(approvedEntries);

  renderBalance(approvedEntries, typeFilter);

  updatePendingSummary('pending-summary', 'pending-summary-text', getPendingTotals(filtered));
  const pendingEmpty = document.getElementById('pending-empty');
  if (pendingEmpty) pendingEmpty.hidden = filtered.some(e => e.needs_review);


  const lockedInfo = document.getElementById('locked-info');


  if (lockedInfo) lockedInfo.hidden = !filtered.some(e => e.locked);


  if (filtered.length === 0) {


    if (empty) empty.hidden = false;


    return;


  }


    filtered.forEach(e => {


      const li = document.createElement('li');
      li.classList.add('c-list-row');


      const initial = (escapeHtml(e.category || '').charAt(0).toUpperCase() || '?');
      const statusText = statusLabel(e);
      const valueClass = e.type === 'in' ? 'c-badge c-badge--success' : 'c-badge c-badge--danger';
      const valuePrefix = e.type === 'out' ? '-' : '+';


      li.dataset.detailId = e.id;


      li.innerHTML = `<div class="c-list-row__leading" aria-hidden="true">${initial}</div>
      <div>
        <p class="c-list-row__title">${escapeHtml(e.category)}</p>
        <div class="c-inline-actions">
          <span class="c-list-row__meta">${formatDateBR(e.date)}</span>
        </div>
      </div>
      <div class="c-list-row__value">
        <span class="c-tooltip">
          <button type="button" class="c-status-icon" aria-label="Status: ${escapeHtml(statusText)}">
            <span class="material-icons-outlined" aria-hidden="true">${statusIcon(e)}</span>
          </button>
          <span class="c-tooltip__content" role="tooltip">${escapeHtml(statusText)}</span>
        </span>
        <span class="${valueClass}">${valuePrefix}${formatMoney(Number(e.amount))}</span>
      </div>`;


      ul.appendChild(li);


    });


}





function renderBalance(entries = null, typeFilter = 'all') {


  const source = entries || state.entries;


  let totalIn = 0, totalOut = 0;


  source.forEach(e => {


    if (e.type === 'in') totalIn += Number(e.amount);


    else totalOut += Number(e.amount);


  });


  const balance = totalIn - totalOut;


  document.getElementById('balance').textContent = formatMoney(balance);


  const balanceLabel = document.getElementById('balance-label');


  if (balanceLabel) {


    balanceLabel.textContent = typeFilter === 'all' ? 'Saldo do período' : 'Saldo filtrado';
  }


  const elIn = document.getElementById('total-in');


  const elOut = document.getElementById('total-out');


  if (elIn) elIn.innerHTML = `<span class="material-icons-outlined tiny-icon">arrow_upward</span> ${formatMoney(totalIn)}`;


  if (elOut) elOut.innerHTML = `<span class="material-icons-outlined tiny-icon">arrow_downward</span> ${formatMoney(totalOut)}`;


  adjustKpiTextSizes();


}

function getPendingTotals(entries) {
  const pending = (entries || []).filter(e => e.needs_review);
  let totalIn = 0;
  let totalOut = 0;

  pending.forEach(e => {
    if (e.type === 'in') totalIn += Number(e.amount);
    else totalOut += Number(e.amount);
  });

  return {
    count: pending.length,
    in: totalIn,
    out: totalOut,
    balance: totalIn - totalOut,
  };
}

function updatePendingSummary(wrapperId, textId, totals) {
  const wrapper = document.getElementById(wrapperId);
  const text = document.getElementById(textId);

  if (!wrapper || !text) return;

  if (!totals || !totals.count) {
    wrapper.hidden = true;
    return;
  }

  text.textContent = `Pendencias: +${formatMoney(totals.in)} -${formatMoney(totals.out)} (saldo ${formatMoney(totals.balance)} / ${totals.count} mov.)`;
  wrapper.hidden = false;
}





async function loadSummaryChart() {


  const el = document.getElementById('chart');


  if (!el) return;


  const daily = {};


  state.entries.forEach(e => {


    const d = e.date;


    if (!daily[d]) daily[d] = { in: 0, out: 0 };

    if (e.needs_review) return;

    daily[d][e.type] += Number(e.amount);


  });


  const sortedDates = Object.keys(daily).sort();


  const series = sortedDates.map(d => ({


    label: d,


    in: Number(daily[d].in || 0),


    out: Number(daily[d].out || 0),


    total: Number((daily[d].in || 0) - (daily[d].out || 0)),


  }));


  chart.render(el, series);


}





async function submitEntry(e) {


  e.preventDefault();


  if (isSubmittingEntry) return;


  const form = e.target;


  const fd = new FormData(form);


  clearInvalid(form);


  const amountInput = form.querySelector('input[name="amount"]');


  const dateInput = document.getElementById('entry-date');


  const categoryInput = document.getElementById('entry-category');


  const errors = [];


  const amountRaw = (fd.get('amount') || '').trim();


  let amount = null;


  if (!amountRaw) {


    markInvalid(amountInput);


    errors.push('valor');


  } else {


    const parsed = parseMoney(amountRaw);


    if (parsed === null || parsed <= 0) {


      markInvalid(amountInput);


      errors.push('valor vlido');


    } else {


      amount = parsed;


      clearInvalidField(amountInput);


    }


  }


  const dateRaw = (fd.get('date') || '').trim();


  let dateIso = null;


  if (!dateRaw) {


    markInvalid(dateInput);


    errors.push('data');


  } else {


    dateIso = parseDateBR(dateRaw);


    if (!dateIso) {


      markInvalid(dateInput);


      errors.push('data vlida (dd/mm/aaaa)');


    } else {


      clearInvalidField(dateInput);


    }


  }


  const category = (fd.get('category') || '').trim();


  if (!category) {


    markInvalid(categoryInput);


    errors.push('categoria');


  } else {


    clearInvalidField(categoryInput);


  }


  if (errors.length) {


    ui.toast('Corrija: ' + errors.join(', '));


    return;


  }


  let isLockedMonth = false;


  if (dateIso) {


    const month = dateIso.slice(0, 7);


    const locked = state.closedMonths.find(l => l.user_id === state.user.id && l.month === month && l.closed);


    if (locked) isLockedMonth = true;


  }


  setEntrySubmitting(true);


  try {


    const attachment = document.getElementById('attachment').files[0];


    let fileName = null;


    if (attachment) {


      setAttachmentUploading(true);


      currentUploadController = new AbortController();


      const upRes = await uploadFile(attachment, currentUploadController.signal).catch((err) => {


        const aborted = err?.name === 'AbortError';


        return { ok: false, error: aborted ? 'Upload cancelado' : 'Erro no upload' };


      });


      setAttachmentUploading(false);


      currentUploadController = null;


      if (!upRes?.ok) throw new Error(upRes?.error || 'Erro no upload');


      fileName = upRes.data.file;


    }


    const payload = {


      type: fd.get('type'),


      amount: amount !== null ? Number(amount.toFixed(2)) : null,


      category: category || null,


      description: fd.get('description') || '',


      date: dateIso,


      attachment_path: fileName,


    };


    const res = await api.post(`${API_BASE}/entries`, payload);


    if (!res.ok) throw new Error(res.error || 'Erro ao salvar');


    ui.toast(isLockedMonth ? 'Mês fechado. Lançamento enviado para revisão.' : 'Salvo');
    toggleModal(false);


    form.reset();


    clearAttachmentPreview(true);


    setEntryType('in');


    await loadEntries();


    await loadTrash();


  } catch (err) {


    ui.toast(err?.message || 'Erro ao salvar');


  } finally {


    currentUploadController = null;


    setEntrySubmitting(false);


  }


}





async function handleEntryClick(e) {
  if (e.target.closest('.c-status-icon') || e.target.closest('.c-tooltip')) return;

  const row = e.target.closest('li[data-detail-id]');

  if (!row) return;

  const id = Number(row.dataset.detailId);

  if (!id) return;

  const entry = state.entries.find(item => item.id === id);

  if (entry) showReportEntryDetails(entry);
}

function updateEntryAmountPreview() {
  const preview = document.getElementById('entry-amount-preview');
  const amountInput = document.getElementById('entry-amount');
  const typeInput = document.getElementById('entry-type');

  if (!preview || !amountInput) return;

  const type = typeInput?.value === 'out' ? 'out' : 'in';
  const value = amountInput.value || 'R$ 0,00';
  const cleanValue = value.startsWith('R$') ? value : `R$ ${value}`;
  const prefix = type === 'out' ? '-' : '+';

  preview.textContent = `${prefix} ${cleanValue}`;
}

function updateEntryAccent(type = 'in') {
  const t = type === 'out' ? 'out' : 'in';
  const accents = document.querySelectorAll('#view-entry .c-entry-accent');
  const label = document.getElementById('entry-type-badge-label');
  const icon = document.getElementById('entry-type-badge-icon');
  const submitLabel = document.getElementById('entry-submit-label');
  const submitBtn = document.getElementById('entry-submit');
  const submitText = t === 'in' ? 'Salvar entrada' : 'Salvar saída';

  accents.forEach((el) => {
    el.classList.toggle('c-badge--success', t === 'in');
    el.classList.toggle('c-badge--danger', t === 'out');
  });

  if (label) label.textContent = t === 'in' ? 'Entrada' : 'Saída';
  if (icon) icon.textContent = t === 'in' ? 'arrow_upward' : 'arrow_downward';
  if (submitLabel) submitLabel.textContent = submitText;
  if (submitBtn) submitBtn.setAttribute('aria-label', submitText);
}





async function deleteEntry(id) {


  const res = await api.del(`${API_BASE}/entries/${id}`);


  if (res.ok) {


    ui.toast('Apagado');


    await loadEntries();


    await loadTrash();


    return true;
  }


  ui.toast(res.error || 'Não foi possível apagar');
  return false;


}





async function uploadFile(file, signal, userId = null) {


  const headers = {};


  if (state.token) headers['Authorization'] = 'Bearer ' + state.token;


  let res = null;


  try {


    res = await fetch(`${API_BASE}/upload`, {


      method: 'POST',


      headers,


      signal,


      body: (() => {
        const f = new FormData();
        f.append('file', file);
        if (userId) f.append('user_id', userId);
        return f;
      })(),


    });


  } catch (err) {


    const aborted = err?.name === 'AbortError';


    return { ok: false, error: aborted ? 'Upload cancelado' : 'Sem conexão' };


  }


  if (!res) return { ok: false, error: 'Sem conexão' };


  const text = await res.text();


  let data = {};


  try { data = JSON.parse(text || '{}'); } catch { data = {}; }


  if (!res.ok) {


    const errMsg = data.error || text || 'Erro no upload';


    return { ok: false, error: errMsg };


  }


  return { ok: true, data };


}


async function uploadSupportAttachment(controller) {

  if (!controller) return { ok: true, path: null };

  const file = controller.getFile();

  if (!file) return { ok: true, path: null };

  controller.setUploading(true);

  const res = await uploadFile(file, null).catch((err) => ({ ok: false, error: err?.message || 'Erro no upload' }));

  controller.setUploading(false);

  if (!res.ok) {

    ui.toast(res.error || 'Erro no upload');

    return { ok: false, path: null };

  }

  return { ok: true, path: res.data?.file || null };

}





function cleanupEntryView() {

  if (currentUploadController) {

    currentUploadController.abort();

    currentUploadController = null;

  }

  clearAttachmentPreview(true);

  setEntryType('in');

  setAttachmentUploading(false);

  setEntrySubmitting(false);

}


function openEntryView(type = 'in') {

  if (!state.categories.length) loadCategories();

  state.entryReturnView = state.activeView || 'view-dashboard';

  closeEntrySheet();

  setEntryType(type);

  setDefaultEntryDate(true);

  setEntrySubmitting(false);

  setAttachmentUploading(false);

  goTo('view-entry');

}


function closeEntryView() {

  cleanupEntryView();

  const returnView = state.entryReturnView || 'view-dashboard';

  state.entryReturnView = null;

  goTo(returnView);

}


function toggleModal(show, type = 'in') {

  if (show) {

    openEntryView(type);

  } else {

    closeEntryView();

  }

}


function openEntrySheet() {
  const sheet = document.getElementById('entry-sheet');
  if (!sheet) return;
  const panel = sheet.querySelector('.c-bottom-sheet__panel');
  sheet.hidden = false;
  document.body.classList.add('modal-open');
  sheet.dataset.focused = document.activeElement ? document.activeElement.id || '' : '';
  const focusTarget = panel?.querySelector('button');
  if (focusTarget) focusTarget.focus();
}

function closeEntrySheet() {
  const sheet = document.getElementById('entry-sheet');
  if (!sheet) return;
  sheet.hidden = true;
  document.body.classList.remove('modal-open');
  const focusedId = sheet.dataset.focused;
  if (focusedId) {
    const el = document.getElementById(focusedId);
    if (el) el.focus();
  }
  sheet.dataset.focused = '';
}

function bindEntrySheet() {
  const fab = document.getElementById('nav-add');
  const sheet = document.getElementById('entry-sheet');
  const panel = sheet?.querySelector('.c-bottom-sheet__panel');

  if (fab) {
    fab.addEventListener('click', () => {
      if (sheet && !sheet.hidden) closeEntrySheet();
      else openEntrySheet();
    });
  }

  if (sheet) {
    sheet.addEventListener('click', (e) => {
      if (e.target === sheet) closeEntrySheet();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (sheet && !sheet.hidden) closeEntrySheet();
  });

  if (panel) {
    panel.addEventListener('click', (e) => e.stopPropagation());
  }
}

function openFilterSheet() {
  const sheet = document.getElementById('filter-sheet');
  if (!sheet) return;
  const panel = sheet.querySelector('.c-bottom-sheet__panel');
  const startMain = document.getElementById('filter-start');
  const endMain = document.getElementById('filter-end');
  const typeMain = document.getElementById('filter-type');
  const startSheet = document.getElementById('filter-start-sheet');
  const endSheet = document.getElementById('filter-end-sheet');
  const typeSheet = document.getElementById('filter-type-sheet');

  if (startSheet && startMain) startSheet.value = startMain.value;
  if (endSheet && endMain) endSheet.value = endMain.value;
  if (typeSheet && typeMain) typeSheet.value = typeMain.value;

  sheet.hidden = false;
  document.body.classList.add('modal-open');
  const focusTarget = panel?.querySelector('input, select, button');
  if (focusTarget) focusTarget.focus();
}

function bindFilterSheet() {
  const sheet = document.getElementById('filter-sheet');
  const panel = sheet?.querySelector('.c-bottom-sheet__panel');

  if (sheet) {
    sheet.addEventListener('click', (e) => {
      if (e.target === sheet) closeFilterSheet();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (sheet && !sheet.hidden) closeFilterSheet();
  });

  if (panel) {
    panel.addEventListener('click', (e) => e.stopPropagation());
  }
}

function closeFilterSheet() {
  const sheet = document.getElementById('filter-sheet');
  if (!sheet) return;
  sheet.hidden = true;
  document.body.classList.remove('modal-open');
}

function applyFilterSheet() {
  const startMain = document.getElementById('filter-start');
  const endMain = document.getElementById('filter-end');
  const typeMain = document.getElementById('filter-type');
  const startSheet = document.getElementById('filter-start-sheet');
  const endSheet = document.getElementById('filter-end-sheet');
  const typeSheet = document.getElementById('filter-type-sheet');

  if (startMain && startSheet) startMain.value = startSheet.value;
  if (endMain && endSheet) endMain.value = endSheet.value;
  if (typeMain && typeSheet) typeMain.value = typeSheet.value;

  closeFilterSheet();
  renderEntries();
}

function updateFilterIndicator(startMonth, endMonth, typeFilter) {
  const indicator = document.getElementById('dashboard-filter-indicator');
  if (!indicator) return;
  const active = Boolean(startMonth || endMonth || (typeFilter && typeFilter !== 'all'));
  indicator.hidden = !active;
}

function handleStatusTooltipClick(e) {
  const statusBtn = e.target.closest('.c-status-icon');
  if (!statusBtn) return;
  e.stopPropagation();
  const tooltip = statusBtn.closest('.c-tooltip');
  if (!tooltip) return;
  document.querySelectorAll('.c-tooltip.is-open').forEach(t => {
    if (t !== tooltip) t.classList.remove('is-open');
  });
  tooltip.classList.toggle('is-open');
}

document.addEventListener('click', (e) => {
  if (e.target.closest('.c-tooltip')) return;
  document.querySelectorAll('.c-tooltip.is-open').forEach(t => t.classList.remove('is-open'));
});





async function exportPdf() {


  const headers = {};


  if (state.token) headers['Authorization'] = 'Bearer ' + state.token;


  const res = await fetch(`${API_BASE}/export/pdf`, { headers }).catch(() => null);


  if (!res || !res.ok) {


    ui.toast('Erro ao gerar PDF');


    return;


  }


  const blob = await res.blob();


  const url = URL.createObjectURL(blob);


  const a = document.createElement('a');


  a.href = url;


  a.download = 'relatorio-caixa.pdf';


  a.click();


  URL.revokeObjectURL(url);


}





async function changeTheme(e) {


  const theme = e.target.value;


  


  const res = await api.put(`${API_BASE}/account/preferences`, { theme });


  if (!res.ok) ui.toast(res.error || 'No foi possvel salvar tema');


}





async function changePassword(e) {


  e.preventDefault();


  clearInvalid(e.target);


  const current = e.target.current_password.value;


  const pwd = e.target.password.value;


  const okCurrent = validateUserOptionField(e.target.current_password);


  const okNew = validateUserOptionField(e.target.password);


  if (!okCurrent || !okNew) return ui.toast('Corrija os campos destacados');


  const res = await api.put(`${API_BASE}/account/password`, { current_password: current, password: pwd });


  if (res.ok) {


    ui.toast('Senha atualizada. Faça login novamente.');
    e.target.reset();


    clearAuth();


  } else {


    ui.toast(res.error || 'Falha ao alterar senha');


  }


}





function toggleArea(id, show) {


  const el = document.getElementById(id);


  el.hidden = show === undefined ? !el.hidden : !show ? true : false;


}





function setEntryType(type = 'in') {


  const t = type === 'out' ? 'out' : 'in';


  const input = document.getElementById('entry-type');


  if (input) input.value = t;


  const form = document.getElementById('entry-form');
  const typeIn = document.getElementById('entry-type-in');
  const typeOut = document.getElementById('entry-type-out');

  if (form) {
    form.classList.toggle('is-in', t === 'in');
    form.classList.toggle('is-out', t === 'out');
  }

  if (typeIn && typeOut) {
    typeIn.classList.toggle('is-active', t === 'in');
    typeOut.classList.toggle('is-active', t === 'out');
    typeIn.setAttribute('aria-selected', t === 'in' ? 'true' : 'false');
    typeOut.setAttribute('aria-selected', t === 'out' ? 'true' : 'false');
  }

  updateEntryAccent(t);
  updateEntryAmountPreview();


  populateEntryCategories(t);


}





async function submitUser(e) {


  e.preventDefault();


  const fd = new FormData(e.target);


  const payload = {


    name: fd.get('name').trim(),


    email: fd.get('email').trim().toLowerCase(),


    password: fd.get('password') || undefined,


    role: fd.get('role'),


  };


  if (!emailValid(payload.email) || payload.name === '' || (payload.password && payload.password.length < 8)) {


    return ui.toast('Dados do usuário inválidos');
  }


  const id = e.target.dataset.editId ? Number(e.target.dataset.editId) : null;


  const res = id


    ? await api.put(`${API_BASE}/admin/users/${id}`, { name: payload.name, email: payload.email, role: payload.role })


    : await api.post(`${API_BASE}/admin/users`, payload);


  if (res.ok) {


    ui.toast('Usuário salvo');


    e.target.reset();


    e.target.dataset.editId = '';


    toggleArea('user-form-area', false);


    await loadUsers();


  } else {


    ui.toast(res.error || 'Erro ao salvar usuário');


  }


}





async function submitCategory(e) {


  e.preventDefault();


  const fd = new FormData(e.target);


  const payload = { name: fd.get('name').trim(), type: fd.get('type') };


  if (!payload.name) return ui.toast('Nome obrigatorio');


  const id = e.target.dataset.editId ? Number(e.target.dataset.editId) : null;


  const res = id


    ? await api.put(`${API_BASE}/admin/categories/${id}`, payload)


    : await api.post(`${API_BASE}/admin/categories`, payload);


  if (res.ok) {


    ui.toast('Categoria salva');


    e.target.reset();


    e.target.dataset.editId = '';


    toggleArea('category-form-area', false);


    await loadCategories();


  } else {


    ui.toast(res.error || 'Erro ao salvar categoria');


  }


}





async function loadUsers() {


  const res = await api.get(`${API_BASE}/admin/users`);


  if (!res.ok) return;


  state.users = res.data;


  renderUsers();


  renderUserFilters();


  renderCloseMonthUsers();


}





function renderUsers() {


  const tbody = document.querySelector('#users-table tbody');


  tbody.innerHTML = '';


  state.users.forEach(u => {


    const tr = document.createElement('tr');


    tr.innerHTML = `<td>${escapeHtml(u.name)}</td>


      <td>${escapeHtml(u.email)}</td>


      <td>${u.role}</td>


      <td><div class="inline-actions">


        <button class="ghost" data-action="edit-user" data-id="${u.id}">Editar</button>


        <button class="ghost" data-action="delete-user" data-id="${u.id}">Excluir</button>


      </div></td>`;


    tbody.appendChild(tr);


  });


}





function renderUserFilters() {


  const sel = document.getElementById('admin-filter-user');


  sel.innerHTML = '<option value="">Todos</option>';


  state.users.forEach(u => {


    const opt = document.createElement('option');


    opt.value = u.id;


    opt.textContent = u.name;


    sel.appendChild(opt);


  });


}





function renderCloseMonthUsers() {


  const box = document.getElementById('close-month-users');


  box.innerHTML = '';


  state.users.forEach(u => {


    const label = document.createElement('label');
    label.className = 'control-chip';


    label.innerHTML = `<input type="checkbox" name="user_ids" value="${u.id}"><span>${escapeHtml(u.name)}</span>`;


    box.appendChild(label);


  });


}





async function handleUserAction(e) {


  const btn = e.target.closest('button[data-action]');


  if (!btn) return;


  const id = Number(btn.dataset.id);


  if (!id) return;


  if (btn.dataset.action === 'delete-user') {


    const res = await api.del(`${API_BASE}/admin/users/${id}`);


    if (res.ok) {


      ui.toast('Usuário removido');


      await loadUsers();


    } else {


      ui.toast(res.error || 'Falha ao remover');


    }


  } else if (btn.dataset.action === 'edit-user') {


    const user = state.users.find(u => u.id === id);


    if (!user) return;


    const form = document.getElementById('user-form');


    form.name.value = user.name;


    form.email.value = user.email;


    form.role.value = user.role;


    form.password.value = '';


    form.dataset.editId = String(id);


    toggleArea('user-form-area', true);


  }


}





async function loadCategories() {


  if (!state.user) return;


  const isAdmin = state.user.role === 'admin';


  const url = isAdmin ? `${API_BASE}/admin/categories` : `${API_BASE}/categories`;


  const res = await api.get(url);


  if (!res.ok) return;


  state.categories = res.data;


  renderCategories();


}





function renderCategories() {


  const tbody = document.querySelector('#categories-table tbody');


  if (tbody) {


    tbody.innerHTML = '';


    state.categories.forEach(c => {


      const tr = document.createElement('tr');


      tr.innerHTML = `<td>${escapeHtml(c.name)}</td>


        <td>${c.type === 'in' ? 'Entrada' : 'Saída'}</td>


        <td><div class="inline-actions">


          <button class="ghost" data-action="edit-category" data-id="${c.id}">Editar</button>


          <button class="ghost" data-action="delete-category" data-id="${c.id}">Excluir</button>


        </div></td>`;


      tbody.appendChild(tr);


    });


  }


  const dl = document.getElementById('category-options');


  if (dl) {


    dl.innerHTML = '';


    state.categories.forEach(c => {


      const opt = document.createElement('option');


      opt.value = c.name;


      dl.appendChild(opt);


    });


  }


  populateEntryCategories(document.getElementById('entry-type')?.value || 'in');


}





async function handleCategoryAction(e) {


  const btn = e.target.closest('button[data-action]');


  if (!btn) return;


  const id = Number(btn.dataset.id);


  if (!id) return;


  if (btn.dataset.action === 'delete-category') {


    const res = await api.del(`${API_BASE}/admin/categories/${id}`);


    if (res.ok) {


      ui.toast('Categoria removida');


      await loadCategories();


    } else {


      ui.toast(res.error || 'Falha ao remover');


    }


  } else if (btn.dataset.action === 'edit-category') {


    const cat = state.categories.find(c => c.id === id);


    if (!cat) return;


    const form = document.getElementById('category-form');


    form.name.value = cat.name;


    form.type.value = cat.type;


    form.dataset.editId = String(id);


    toggleArea('category-form-area', true);


  }


}





async function closeMonth(e) {


  e.preventDefault();


  const fd = new FormData(e.target);


  const userIds = Array.from(document.querySelectorAll('input[name="user_ids"]:checked')).map(el => Number(el.value));


  if (!userIds.length) return ui.toast('Selecione usuários');


  const payload = { month: fd.get('month'), closed: fd.get('closed') === '1', user_ids: userIds };


  if (!payload.month) return ui.toast('Informe o mês');


  const res = await api.post(`${API_BASE}/admin/close-month`, payload);


  if (res.ok) {


    ui.toast('Configuração aplicada');


    state.closedMonths = res.data.closed_months || [];


    await loadEntries();


    await loadTrash();


    renderClosedMonths();


  } else {


    ui.toast(res.error || 'Não foi possível atualizar mês');
  }


}





async function loadClosedMonths() {


  const res = await api.get(`${API_BASE}/admin/closed-months`);


  if (res.ok) {


    state.closedMonths = res.data.closed_months || [];


    renderClosedMonths();


    renderClosureMonthOptions();


  }


}





function renderClosedMonths() {


  const container = document.getElementById('closed-months-list');


  if (!container) return;


  container.innerHTML = '';


  const byUser = {};


  state.closedMonths.forEach(lock => {


    if (!lock.closed) return;


    if (!byUser[lock.user_id]) byUser[lock.user_id] = [];


    byUser[lock.user_id].push(lock.month);


  });


  Object.entries(byUser).forEach(([uid, months]) => {


    const user = state.users.find(u => u.id === Number(uid));


    const div = document.createElement('div');


    div.textContent = `${user?.name || 'Usuário ' + uid}: ${months.join(', ')}`;
    container.appendChild(div);


  });


}





function renderClosureMonthOptions() {

  const select = document.getElementById('report-closure-month');

  if (!select) return;

  const closed = state.closedMonths.filter(lock => lock.closed);

  const months = [...new Set(closed.map(lock => lock.month))].sort().reverse();

  select.innerHTML = '';

  if (!months.length) {

    const opt = document.createElement('option');

    opt.value = '';

    opt.textContent = 'Nenhum fechamento';

    select.appendChild(opt);

    select.disabled = true;

    renderClosureReport(null);

    return;

  }

  months.forEach(month => {

    const opt = document.createElement('option');

    opt.value = month;

    opt.textContent = formatMonthLabel(month) || month;

    select.appendChild(opt);

  });

  select.disabled = false;

  ui.enhanceSelect(select);

  if (!months.includes(select.value)) {

    select.value = months[0];

  }

  loadClosureReport();

}


async function loadClosureReport() {

  const month = document.getElementById('report-closure-month')?.value || '';

  if (!month) {

  state.closureReport = null;

    renderClosureReport(null);

    return;

  }

  const res = await api.get(`${API_BASE}/reports/closure?month=${encodeURIComponent(month)}`);

  if (!res.ok) {

    ui.toast(res.error || 'Erro ao carregar fechamento');

    return;

  }

  state.closureReport = res.data;

  renderClosureReport(res.data);

}


function renderClosureReport(report) {

  const summary = document.getElementById('report-closure-summary');

  const empty = document.getElementById('report-closure-empty');

  const title = document.getElementById('report-closure-title');

  const meta = document.getElementById('report-closure-meta');

  const pendingSummary = document.getElementById('report-closure-pending');

  if (!summary) return;

  if (!report) {

    summary.hidden = true;

    if (empty) empty.hidden = false;

    if (pendingSummary) pendingSummary.hidden = true;

    return;

  }

  if (empty) empty.hidden = true;

  summary.hidden = false;

  if (title) title.textContent = `Fechamento ${formatMonthLabel(report.month) || report.month}`;

  const closedLabel = report.closed ? 'Fechado' : 'Aberto';

  const closedAt = report.closed_at ? ` em ${formatDateBR(report.closed_at)}` : '';

  if (meta) meta.textContent = `${closedLabel}${closedAt}`;

  const totalIn = Number(report.total_in || 0);

  const totalOut = Number(report.total_out || 0);

  const balance = Number(report.balance || 0);

  const count = Number(report.count || (report.entries || []).length || 0);

  const inEl = document.getElementById('report-closure-in');

  const outEl = document.getElementById('report-closure-out');

  const balEl = document.getElementById('report-closure-balance');

  const countEl = document.getElementById('report-closure-count');

  if (inEl) inEl.textContent = formatMoney(totalIn);

  if (outEl) outEl.textContent = formatMoney(totalOut);

  if (balEl) balEl.textContent = formatMoney(balance);

  if (countEl) countEl.textContent = String(count);

  if (pendingSummary) pendingSummary.hidden = false;

  const pendingIn = Number(report.pending_in || 0);

  const pendingOut = Number(report.pending_out || 0);

  const pendingBalance = Number(report.pending_balance || (pendingIn - pendingOut));

  const pendingCount = Number(report.pending_count || 0);

  const pendingInEl = document.getElementById('report-closure-pending-in');

  const pendingOutEl = document.getElementById('report-closure-pending-out');

  const pendingBalEl = document.getElementById('report-closure-pending-balance');

  const pendingCountEl = document.getElementById('report-closure-pending-count');

  if (pendingInEl) pendingInEl.textContent = formatMoney(pendingIn);

  if (pendingOutEl) pendingOutEl.textContent = formatMoney(pendingOut);

  if (pendingBalEl) pendingBalEl.textContent = formatMoney(pendingBalance);

  if (pendingCountEl) pendingCountEl.textContent = String(pendingCount);

}



function toggleSelectAllUsers(e) {


  const checked = e.target.checked;


  document.querySelectorAll('input[name="user_ids"]').forEach(cb => cb.checked = checked);


}





function escapeHtml(str = '') {


  return str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));


}


function formatDateBR(v) {


  if (!v) return '';


  try { return new Intl.DateTimeFormat('pt-BR').format(new Date(v)); }


  catch { return v; }


}


function formatDateTime(v) {

  if (!v) return '';

  try {

    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(v));

  } catch {

    return v;

  }

}


function formatMoney(v) {


  const num = Number(v) || 0;


  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });


}





function updateUserChip() {


  const name = state.user?.name || '';


  const email = state.user?.email || '';


  const role = state.user?.role === 'admin' ? 'Administrador' : 'Usuário';


  const chip = document.getElementById('user-chip');


  if (chip) {


    if (name) {


      chip.textContent = name;


      chip.hidden = false;


    } else {


      chip.hidden = true;


    }


  }


  const optChip = document.getElementById('options-user');


  if (optChip) {


    if (name) { optChip.textContent = name; optChip.hidden = false; }


    else optChip.hidden = true;


  }


  const reportChip = document.getElementById('report-user');


  if (reportChip) {


    if (name) { reportChip.textContent = name; reportChip.hidden = false; }


    else reportChip.hidden = true;


  }


  const optEmail = document.getElementById('options-email');


  if (optEmail) {


    optEmail.textContent = email || '-';


  }


  const optRole = document.getElementById('options-role');


  if (optRole) {


    optRole.querySelector('small')?.replaceChildren(document.createTextNode(role));


  }


}





function setAttachmentUploading(isUploading) {


  const preview = document.getElementById('attachment-preview');


  const status = document.getElementById('attachment-status');


  const clearBtn = document.getElementById('btn-clear-attachment');


  const cancelBtn = document.getElementById('btn-cancel-upload');


  const overlay = document.getElementById('entry-upload-overlay');


  const bottomNav = document.querySelector('.c-bottom-nav, .bottom-nav');


  const hasPreview = preview && !preview.classList.contains('is-empty');


  const shouldShow = Boolean(isUploading && hasPreview);


  if (preview) preview.classList.toggle('is-uploading', shouldShow);


  if (status) {


    status.hidden = !shouldShow;


    status.textContent = shouldShow ? 'Enviando anexo...' : '';


    status.classList.toggle('is-uploading', shouldShow);


  }


  if (clearBtn) {


    const previewIsEmpty = preview ? preview.classList.contains('is-empty') : true;


    clearBtn.disabled = Boolean(isUploading) || previewIsEmpty;


  }


  if (cancelBtn) {


    cancelBtn.hidden = !shouldShow;


    cancelBtn.disabled = !shouldShow;


  }


  if (overlay) overlay.hidden = !shouldShow;


  if (bottomNav) {


    bottomNav.style.pointerEvents = shouldShow ? 'none' : '';


  }


}





function setEntrySubmitting(isSubmitting) {


  isSubmittingEntry = Boolean(isSubmitting);


  const submitBtn = document.querySelector('#entry-form button[type="submit"]');


  if (submitBtn) {
    submitBtn.disabled = isSubmittingEntry;
    submitBtn.classList.toggle('is-loading', isSubmittingEntry);
    submitBtn.setAttribute('aria-busy', isSubmittingEntry ? 'true' : 'false');
  }


}





function cancelAttachmentUpload() {


  if (currentUploadController) {


    currentUploadController.abort();


    currentUploadController = null;


  }


  setAttachmentUploading(false);


  setEntrySubmitting(false);


  ui.toast('Upload cancelado');


}





function setupAttachmentPreview() {


  const input = document.getElementById('attachment');


  if (input) input.addEventListener('change', handleAttachmentChange);


  const clearBtn = document.getElementById('btn-clear-attachment');


  if (clearBtn) clearBtn.addEventListener('click', (e) => {


    e.stopPropagation();


    clearAttachmentPreview(true);


  });


  const preview = document.getElementById('attachment-preview');


  if (preview && input) {


    const trigger = () => {


      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');


      if (isMobile) {


        const useCamera = window.confirm('Usar a câmera? (Cancelar abre a galeria)');
        if (useCamera) input.setAttribute('capture', 'environment');


        else input.removeAttribute('capture');


      } else {


        input.removeAttribute('capture');


      }


      input.click();


    };


    preview.addEventListener('click', (e) => {


      if (e.target.closest('#btn-clear-attachment')) return;


      trigger();


    });


    preview.addEventListener('keydown', (e) => {


      if (e.key === 'Enter' || e.key === ' ') {


        e.preventDefault();


        trigger();


      }


    });


  }


}


function setupSupportAttachmentPreviews() {

  supportNewAttachment = createAttachmentController('support-new');

  supportReplyAttachment = createAttachmentController('support-reply');

}


function createAttachmentController(prefix) {

  const input = document.getElementById(`${prefix}-attachment`);

  const preview = document.getElementById(`${prefix}-attachment-preview`);

  const thumb = document.getElementById(`${prefix}-attachment-thumb`);

  const name = document.getElementById(`${prefix}-attachment-name`);

  const status = document.getElementById(`${prefix}-attachment-status`);

  const clearBtn = document.getElementById(`${prefix}-clear-attachment`);

  const actionBtn = document.getElementById(`${prefix}-attachment-btn`);

  const state = { file: null, previewUrl: null };

  if (!input || !preview || !thumb || !name || !clearBtn || !status) {

    return {

      getFile: () => null,

      clear: () => {},

      setUploading: () => {},

    };

  }

  const updatePreview = (file) => {

    if (state.previewUrl) {

      URL.revokeObjectURL(state.previewUrl);

      state.previewUrl = null;

    }

    state.file = file;

    if (!file) {

      preview.classList.add('is-empty');

      name.textContent = 'Nenhum arquivo selecionado';

      clearBtn.disabled = true;

      thumb.removeAttribute('src');

      return;

    }

    state.previewUrl = URL.createObjectURL(file);

    thumb.src = state.previewUrl;

    preview.classList.remove('is-empty');

    name.textContent = file.name;

    clearBtn.disabled = false;

  };

  const trigger = () => {

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');

    if (isMobile) {

      const useCamera = window.confirm('Usar a câmera? (Cancelar abre a galeria)');

      if (useCamera) input.setAttribute('capture', 'environment');

      else input.removeAttribute('capture');

    } else {

      input.removeAttribute('capture');

    }

    input.click();

  };

  input.addEventListener('change', (e) => {

    const file = e.target.files?.[0] || null;

    if (!file) {

      updatePreview(null);

      return;

    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowed.includes(file.type)) {

      ui.toast('Use apenas JPEG, PNG ou WEBP');

      input.value = '';

      updatePreview(null);

      return;

    }

    if (file.size > 10 * 1024 * 1024) {

      ui.toast('Arquivo acima de 10MB');

      input.value = '';

      updatePreview(null);

      return;

    }

    updatePreview(file);

  });

  clearBtn.addEventListener('click', (e) => {

    e.stopPropagation();

    input.value = '';

    updatePreview(null);

  });

  preview.addEventListener('click', (e) => {

    if (e.target.closest(`#${prefix}-clear-attachment`)) return;

    trigger();

  });

  preview.addEventListener('keydown', (e) => {

    if (e.key === 'Enter' || e.key === ' ') {

      e.preventDefault();

      trigger();

    }

  });

  if (actionBtn) {

    actionBtn.addEventListener('click', (e) => {

      e.preventDefault();

      trigger();

    });

  }

  return {

    getFile: () => state.file,

    clear: (reset = false) => {

      if (reset) input.value = '';

      updatePreview(null);

    },

    setUploading: (isUploading) => {

      status.hidden = !isUploading;

    },

  };

}





function handleAttachmentChange(e) {


  const file = e.target.files?.[0];


  if (!file) {


    clearAttachmentPreview();


    return;


  }


  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];


  if (!allowedTypes.includes(file.type)) {


    ui.toast('Use apenas JPEG, PNG ou WEBP');


    clearAttachmentPreview(true);


    return;


  }


  if (file.size > 10 * 1024 * 1024) {


    ui.toast('Limite de 10MB por imagem');


    clearAttachmentPreview(true);


    return;


  }


  if (attachmentPreviewUrl) {


    URL.revokeObjectURL(attachmentPreviewUrl);


    attachmentPreviewUrl = null;


  }


  attachmentPreviewUrl = URL.createObjectURL(file);


  const preview = document.getElementById('attachment-preview');


  const img = document.getElementById('attachment-thumb');


  const name = document.getElementById('attachment-name');


  if (img) {


    img.src = attachmentPreviewUrl;


    img.alt = file.name;


  }


  if (name) {


    name.textContent = file.name;


    name.title = file.name;


  }


  if (preview) preview.classList.remove('is-empty');


  setAttachmentUploading(false);


}





function clearAttachmentPreview(resetInput = false) {


  const preview = document.getElementById('attachment-preview');


  const img = document.getElementById('attachment-thumb');


  const name = document.getElementById('attachment-name');


  const clearBtn = document.getElementById('btn-clear-attachment');


  const status = document.getElementById('attachment-status');


  if (preview) preview.classList.add('is-empty');


  if (img) {


    img.src = '';


    img.alt = '';


  }


  if (name) {


    name.textContent = 'Nenhum arquivo selecionado';


    name.title = '';


  }


  if (status) {


    status.hidden = true;


    status.textContent = '';


    status.classList.remove('is-uploading');


  }


  if (clearBtn) clearBtn.disabled = true;


  setAttachmentUploading(false);


  if (attachmentPreviewUrl) {


    URL.revokeObjectURL(attachmentPreviewUrl);


    attachmentPreviewUrl = null;


  }


  if (resetInput) {


    const input = document.getElementById('attachment');


    if (input) input.value = '';


  }


}





function populateProfileForm() {


  const nameInput = document.getElementById('profile-name');


  if (nameInput && state.user?.name) nameInput.value = state.user.name;


}





function populateEntryCategories(type = 'in') {


  const selectCat = document.getElementById('entry-category');


  if (!selectCat) return;


  const currentType = type === 'out' ? 'out' : 'in';


  const previous = selectCat.value;


  selectCat.innerHTML = '<option value="" disabled selected>Selecione uma categoria</option>';


  state.categories


    .filter(c => c.type === currentType)


    .forEach(c => {


      const opt = document.createElement('option');


      opt.value = c.name;


      opt.textContent = c.name;


      selectCat.appendChild(opt);


    });


  if (previous) {


    const match = state.categories.find(c => c.type === currentType && c.name === previous);


    if (match) selectCat.value = previous;


  }


  ui.enhanceSelect('entry-category');


}





async function updateProfile(e) {


  e.preventDefault();


  clearInvalid(e.target);


  const name = e.target.name.value.trim();


  const theme = state.user?.theme || 'dark';


  if (!validateUserOptionField(e.target.name)) return ui.toast('Informe um nome');


  const res = await api.put(`${API_BASE}/account/preferences`, { name, theme });


  if (res.ok) {


    state.user.name = name;


    state.user.theme = theme;


    localStorage.setItem('auth', JSON.stringify({ token: state.token, user: state.user }));


    applyTheme(theme);


    


    updateUserChip();


    populateProfileForm();


    ui.toast('Perfil atualizado');


  } else {


    ui.toast(res.error || 'Erro ao salvar perfil');


  }


}





function getReportEntries(includePending = false) {


  const type = document.getElementById('report-type')?.value || 'all';


  const startMonth = document.getElementById('report-start')?.value || '';


  const endMonth = document.getElementById('report-end')?.value || '';


  const range = normalizeMonthRange(startMonth, endMonth);


  return state.entries.filter(e => {

    const okType = type === 'all' ? true : e.type === type;

    const okRange = isDateInRange(e.date, range.start, range.end);

    return okType && okRange && (includePending || !e.needs_review);

  });


}





function renderReports() {


  const reportStart = document.getElementById('report-start')?.value || '';


  const reportEnd = document.getElementById('report-end')?.value || '';


  const reportType = document.getElementById('report-type')?.value || 'all';


  updateFilterSummary('report', reportStart, reportEnd, reportType);


  const allFiltered = getReportEntries(true);
  const filtered = allFiltered.filter(e => !e.needs_review);


  let totalIn = 0, totalOut = 0;


  filtered.forEach(e => {


    if (e.type === 'in') totalIn += Number(e.amount);


    else totalOut += Number(e.amount);


  });


  const balance = totalIn - totalOut;


  const headerIn = document.getElementById('report-total-in');


  const headerOut = document.getElementById('report-total-out');


  const headerBal = document.getElementById('report-balance');


  const balLabel = document.getElementById('report-balance-label');


  if (headerIn) headerIn.innerHTML = `<span class="material-icons-outlined tiny-icon">arrow_upward</span> ${formatMoney(totalIn)}`;


  if (headerOut) headerOut.innerHTML = `<span class="material-icons-outlined tiny-icon">arrow_downward</span> ${formatMoney(totalOut)}`;


  if (headerBal) headerBal.textContent = formatMoney(balance);


  if (balLabel) balLabel.textContent = formatPeriodLabel(reportStart, reportEnd);

  updatePendingSummary('report-pending-summary', 'report-pending-summary-text', getPendingTotals(allFiltered));

  adjustKpiTextSizes();


  renderReport12Months();


  renderReportChart(filtered);


  renderReportCategories(filtered);


  renderReportTypeSplit(totalIn, totalOut, balance);


  renderReportTable(filtered);


}





function renderReport12Months() {


  const data = getLast12MonthsSummary();


  render12mChart(document.getElementById('report-12m-chart'), data);


  const monthList = document.getElementById('report-12m-month-list');


  const empty = document.getElementById('report-12m-empty');


  if (!monthList) return;


  monthList.innerHTML = '';


  const hasData = data.some(m => m.in > 0 || m.out > 0);


  if (!hasData) {


    if (empty) empty.hidden = false;


    return;


  }


  if (empty) empty.hidden = true;


  data.slice().reverse().forEach(m => {


    const monthBalance = m.month_balance ?? (m.in - m.out);


    const mainBalClass = monthBalance >= 0 ? 'text-in' : 'text-out';


    const accBalClass = m.balance >= 0 ? 'text-in' : 'text-out';





    const monthItem = document.createElement('div');


    monthItem.className = 'summary-item';


    monthItem.innerHTML = `<div class="summary-label">${escapeHtml(m.label)}</div>


      <div class="summary-values">


        <div class="summary-value text-in">


          <small>Entradas</small>


          <strong>${formatMoney(m.in)}</strong>


        </div>


        <div class="summary-value text-out">


          <small>Saídas</small>
          <strong>${formatMoney(m.out)}</strong>


        </div>


        <div class="summary-value ${mainBalClass}">


          <small>Saldo do mês</small>
          <strong>${formatMoney(monthBalance)}</strong>


        </div>


        <div class="summary-value ${accBalClass}">


          <small>Saldo acumulado</small>


          <strong>${formatMoney(m.balance)}</strong>


        </div>


      </div>`;


    monthList.appendChild(monthItem);


  });


}





function getLast12MonthsSummary() {


  const now = new Date();


  const months = [];


  for (let i = 11; i >= 0; i--) {


    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);


    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;


    months.push({ key, label: formatMonthShort(key), in: 0, out: 0, balance: 0 });


  }


  const map = {};


  months.forEach(m => { map[m.key] = m; });


  (state.entries || []).forEach(e => {

    const month = (e.date || '').slice(0, 7);

    if (!map[month]) return;

    if (e.needs_review) return;

    const amount = Number(e.amount) || 0;


    if (e.type === 'in') map[month].in += amount;


    else map[month].out += amount;


  });


  let runningIn = 0;


  let runningOut = 0;


  let runningBalance = 0;


  months.forEach(m => {


    runningIn += m.in;


    runningOut += m.out;


    const monthBalance = m.in - m.out;


    runningBalance += monthBalance;


    m.in_acc = runningIn;


    m.out_acc = runningOut;


    m.month_balance = monthBalance;


    m.balance = runningBalance;


  });


  return months;


}





function render12mChart(canvas, series) {


  if (!canvas) return;


  const ctx = canvas.getContext('2d');


  const w = canvas.width = canvas.clientWidth;


  const h = canvas.height;


  ctx.clearRect(0, 0, w, h);


  if (!series || !series.length) return;


  const maxVal = Math.max(...series.map(s => Math.max(s.in, s.out, Math.abs(s.balance))), 1);


  const minVal = Math.min(...series.map(s => Math.min(0, -s.out, s.balance)), 0);


  const range = maxVal - minVal || 1;


  const padX = 36;


  const padY = 28;


  const zeroY = h - padY - ((0 - minVal) / range) * (h - padY * 2);


  ctx.strokeStyle = '#e2e8f0';


  ctx.lineWidth = 1;


  ctx.beginPath();


  ctx.moveTo(padX, zeroY);


  ctx.lineTo(w - padX, zeroY);


  ctx.stroke();


  const groupW = (w - padX * 2) / series.length;


  const barW = Math.max(6, Math.min(14, groupW / 2.6));


  const colors = { in: '#22c55e', out: '#f87171', bal: '#0ea5e9' };


  const drawBar = (x, val, color) => {


    const height = Math.abs(val) / range * (h - padY * 2);


    const y = val >= 0 ? zeroY - height : zeroY;


    ctx.fillStyle = color;


    ctx.fillRect(x - barW / 2, y, barW, height);


  };


  series.forEach((s, idx) => {


    const center = padX + groupW * idx + groupW / 2;


    drawBar(center - barW * 0.7, s.in, colors.in);


    drawBar(center + barW * 0.7, -s.out, colors.out);


  });


  // linha do saldo consolidado


  ctx.beginPath();


  series.forEach((s, idx) => {


    const center = padX + groupW * idx + groupW / 2;


    const y = h - padY - ((s.balance - minVal) / range) * (h - padY * 2);


    if (idx === 0) ctx.moveTo(center, y);


    else ctx.lineTo(center, y);


  });


  ctx.strokeStyle = colors.bal;


  ctx.lineWidth = 2.2;


  ctx.stroke();


  series.forEach((s, idx) => {


    const center = padX + groupW * idx + groupW / 2;


    const y = h - padY - ((s.balance - minVal) / range) * (h - padY * 2);


    ctx.fillStyle = colors.bal;


    ctx.beginPath();


    ctx.arc(center, y, 3, 0, Math.PI * 2);


    ctx.fill();


  });


  // labels com espaçamento para mobile
  ctx.fillStyle = '#94a3b8';


  ctx.font = '11px Inter, sans-serif';


  ctx.textAlign = 'center';


  const skip = Math.max(1, Math.ceil(series.length / 6));


  series.forEach((s, idx) => {


    if (idx % skip !== 0 && idx !== series.length - 1) return;


    ctx.fillText(s.label, padX + groupW * idx + groupW / 2, h - 6);


  });


}





function renderReportChart(entries) {


  const byDay = {};


  entries.forEach(e => {


    const day = e.date;


    if (!byDay[day]) byDay[day] = { label: day, in: 0, out: 0, total: 0 };


    if (e.type === 'in') byDay[day].in += Number(e.amount);


    else byDay[day].out += Number(e.amount);


    byDay[day].total = byDay[day].in - byDay[day].out;


  });


  const series = Object.values(byDay).sort((a, b) => a.label.localeCompare(b.label));


  chart.render(document.getElementById('report-chart'), series);


}





function renderReportCategories(entries) {


  const container = document.getElementById('report-category-bars');


  if (!container) return;


  container.innerHTML = '';


  if (!entries.length) {


    container.innerHTML = '<div class="muted tiny">Sem movimentações neste filtro.</div>';
    return;


  }


  const map = {};


  entries.forEach(e => {


    const name = e.category || 'Sem categoria';


    if (!map[name]) map[name] = { name, in: 0, out: 0 };


    map[name][e.type] += Number(e.amount);


  });


  const allItems = Object.values(map);
  const totalAll = allItems.reduce((acc, i) => acc + i.in + i.out, 0);
  const items = allItems.sort((a, b) => (b.in + b.out) - (a.in + a.out)).slice(0, 6);


  items.forEach(item => {


    const wrap = document.createElement('div');


    wrap.className = 'bar-row';


    const percentIn = totalAll ? (item.in / totalAll) * 100 : 0;
    const percentOut = totalAll ? (item.out / totalAll) * 100 : 0;
    const share = Math.round(((item.in + item.out) / Math.max(totalAll, 1)) * 100);


    const trackClass = percentIn === 0 || percentOut === 0 ? 'bar-track dual single' : 'bar-track dual';

    wrap.innerHTML = `<div class="bar-row-head">


        <div>


          <strong>${escapeHtml(item.name)}</strong>


          <small class="muted">Saldo ${formatMoney(item.in - item.out)}</small>


        </div>


        <span class="muted tiny">${share}% do volume</span>


      </div>


      <div class="${trackClass}">


        <div class="bar-fill in" style="width:${percentIn}%;"></div>


        <div class="bar-fill out" style="width:${percentOut}%;"></div>


      </div>


      <div class="bar-meta">


        <span class="dot in">Entradas ${formatMoney(item.in)}</span>


        <span class="dot out">Saídas ${formatMoney(item.out)}</span>
      </div>`;


    container.appendChild(wrap);


  });


}





function renderReportTypeSplit(totalIn, totalOut, balance) {


  const donut = document.getElementById('report-type-donut');


  const legend = document.getElementById('report-type-legend');


  const percentLabel = document.getElementById('report-type-percent');


  const balEl = document.getElementById('report-type-balance');


  const total = totalIn + totalOut;


  const pctIn = total ? Math.round((totalIn / total) * 100) : 0;


  const pctOut = total ? 100 - pctIn : 0;


  const deg = total ? (totalIn / total) * 360 : 0;


  if (donut) {


    donut.style.background = total


      ? `conic-gradient(var(--success) 0deg ${deg}deg, var(--danger) ${deg}deg 360deg)`


      : 'repeating-linear-gradient(45deg, #e5e7eb 0 10px, #f8fafc 10px 20px)';


  }


  if (balEl) balEl.textContent = formatMoney(balance);


  if (percentLabel) percentLabel.textContent = `${pctIn}% entradas`;


  if (legend) legend.innerHTML = `<span class="dot in">Entradas ${formatMoney(totalIn)}</span>


    <span class="dot out">Saídas ${formatMoney(totalOut)}</span>
    <span class="dot total">Saldo do período ${formatMoney(balance)}</span>`;
}





function renderReportTable(entries) {

  const list = document.getElementById('report-list');
  const empty = document.getElementById('report-table-empty');
  if (!list) return;

  list.innerHTML = '';

  if (!entries.length) {
    if (empty) empty.hidden = false;
    return;
  }

  if (empty) empty.hidden = true;

  entries.slice().sort((a, b) => b.date.localeCompare(a.date)).forEach(e => {
    const li = document.createElement('li');
    const initial = (escapeHtml(e.category || '').charAt(0).toUpperCase() || '?');
    const sign = e.type === 'out' ? '-' : '+';
    const badgeClass = e.type === 'in' ? 'badge-in' : 'badge-out';
    const statusClass = e.status || 'open';

    li.dataset.detailId = e.id;

    li.innerHTML = `<div class="entry-left">
        <div class="avatar tiny">${initial}</div>
        <div>
          <strong>${escapeHtml(e.category || '')}</strong>
          <small class="muted">${formatDateBR(e.date)}</small>
        </div>
      </div>
      <div class="entry-right">
        <div class="entry-meta">
          <span class="status-dot status-${statusClass}" title="${statusLabel(e)}"><span class="material-icons-outlined status-icon">${statusIcon(e)}</span></span>
          <div class="${badgeClass}">${sign}${formatMoney(Number(e.amount))}</div>
        </div>
      </div>`;

    list.appendChild(li);
  });
}






function handleReportTableClick(e) {

  const row = e.target.closest('li[data-detail-id]');

  if (!row) return;

  const id = Number(row.dataset.detailId);

  if (!id) return;

  const entry = state.entries.find(item => item.id === id);

  if (!entry) return;

  showReportEntryDetails(entry);

}






function showReportEntryDetails(entry) {


  const modal = document.getElementById('report-entry-modal');


  const title = document.getElementById('report-entry-title');


  const content = document.getElementById('report-entry-content');


  const panel = modal?.querySelector('.modal-panel');
  const detailHero = document.querySelector('#view-entry-detail .entry-detail-hero');


  if (!content) return;


  const sign = entry.type === 'out' ? '-' : '+';


  const badgeClass = entry.type === 'in' ? 'badge-in' : 'badge-out';


  if (title) title.textContent = `${entry.type === 'in' ? 'Entrada' : 'Saída'} - ${sign}${formatMoney(Number(entry.amount))}`;


  const hasAttachment = Boolean(entry.attachment_path);
  const canDelete = Boolean(entry.can_delete);


  const typeClass = entry.type === 'out' ? 'type-out' : 'type-in';


  if (panel) {


    panel.classList.remove('type-in', 'type-out');


    panel.classList.add(typeClass);


  }

  if (detailHero) {
    detailHero.classList.remove('type-in', 'type-out');
    detailHero.classList.add(typeClass);
  }


  const parts = [


    `<div class="detail-grid">


      <div>


        <p class="muted tiny">Data</p>


        <p><strong>${formatDateBR(entry.date)}</strong></p>


      </div>


      <div>


        <p class="muted tiny">Categoria</p>


        <p><strong>${escapeHtml(entry.category || '')}</strong></p>


      </div>


      <div>


        <p class="muted tiny">Tipo</p>


        <p><strong>${entry.type === 'in' ? 'Entrada' : 'Saída'}</strong></p>


      </div>


      <div>


        <p class="muted tiny">Valor</p>


        <p><strong class="${badgeClass}">${sign}${formatMoney(Number(entry.amount))}</strong></p>


      </div>


    </div>


    <div class="detail-block">


      <p class="muted tiny">Descrição</p>


      ${entry.description ? `<p>${escapeHtml(entry.description)}</p>` : `<p class="muted">Sem descrição.</p>`}
    </div>


    ${hasAttachment ? `<div class="detail-block attachment-block">


      <p class="muted tiny">Anexo</p>


      <div class="attachment-preview-modal" data-attachment="${entry.attachment_path}">


        <p class="muted tiny">Carregando anexo...</p>


      </div>


    </div>` : ''}
    ${canDelete ? `<div class="detail-actions">
      <button type="button" class="icon-btn danger" id="btn-entry-delete" title="Remover lançamento" aria-label="Remover lançamento">
        <span class="material-icons-outlined">delete</span>
      </button>
    </div>` : ''}`


  ];


  content.innerHTML = parts.join('');


  if (hasAttachment) {


    const preview = content.querySelector('[data-attachment]');


    renderAttachmentPreview(preview, entry.attachment_path);


  }

  if (canDelete) {

    const deleteBtn = content.querySelector('#btn-entry-delete');

    if (deleteBtn) {

      deleteBtn.onclick = async () => {

        const ok = await deleteEntry(entry.id);

        if (ok) toggleReportEntryModal(false);

      };

    }

  }


  toggleReportEntryModal(true);


}





function toggleReportEntryModal(show) {


  const modal = document.getElementById('report-entry-modal');


  const view = document.getElementById('view-entry-detail');

  if (modal) {
    modal.hidden = !show;
    document.body.classList.toggle('modal-open', show);
    return;
  }

  if (!view) return;

  if (show) {
    state.entryDetailReturnView = state.activeView || 'view-dashboard';
    goTo('view-entry-detail');
  } else {
    const returnView = state.entryDetailReturnView || 'view-dashboard';
    state.entryDetailReturnView = null;
    goTo(returnView);
  }

}





function exportReportTablePdf() {


  const entries = getReportEntries();


  if (!entries.length) {


    ui.toast('Nenhuma movimentação para exportar');
    return;


  }


  const startMonth = document.getElementById('report-start')?.value || '';


  const endMonth = document.getElementById('report-end')?.value || '';


  const range = normalizeMonthRange(startMonth, endMonth);


  const type = document.getElementById('report-type')?.value || 'all';


  const params = new URLSearchParams();


  if (range.start) params.append('start', range.start);


  if (range.end) params.append('end', range.end);


  if (type) params.append('type', type);


  const headers = state.token ? { Authorization: 'Bearer ' + state.token } : {};


  fetch(`${API_BASE}/export/pdf?${params.toString()}`, { headers })


    .then(res => {


      if (!res.ok) return res.json().then(data => { throw new Error(data.error || 'Erro ao gerar PDF'); });


      const ct = res.headers.get('Content-Type') || '';


      if (!ct.includes('pdf')) throw new Error('Retorno inesperado');


      return res.blob();


    })


    .then(blob => {


      const url = URL.createObjectURL(blob);


      const a = document.createElement('a');


      a.href = url;


      a.download = 'relatorio-caixa.pdf';


      a.click();


      URL.revokeObjectURL(url);


    })


    .catch((err) => ui.toast(err?.message || 'Erro ao gerar PDF'));


}





function formatMonthLabel(month) {


  if (!month) return '';


  try {


    const d = new Date(`${month}-01T00:00:00`);


    return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(d);


  } catch {


    return month;


  }


}





function formatPeriodLabel(startMonth, endMonth) {


  const startLabel = startMonth ? formatMonthLabel(startMonth) : '';


  const endLabel = endMonth ? formatMonthLabel(endMonth) : '';


  if (startLabel && endLabel) {


    if (startMonth === endMonth) return startLabel;


    return `${startLabel} a ${endLabel}`;


  }


  if (startLabel) return `${startLabel} em diante`;


  if (endLabel) return `Até ${endLabel}`;
  return 'Período aberto';
}





function updateFilterSummary(prefix, startMonth, endMonth, typeValue) {


  const periodLabel = formatPeriodLabel(startMonth, endMonth);


  const periodText = document.getElementById(`${prefix}-summary-period-text`);


  if (periodText) periodText.textContent = periodLabel;


  if (prefix === 'filter') {


    const label = document.getElementById('filter-period-label');


    if (label) label.textContent = periodLabel;


  }


  const typeLabel = typeValue === 'in' ? 'Entradas' : typeValue === 'out' ? 'Saídas' : 'Todos';
  const typeText = document.getElementById(`${prefix}-summary-type-text`);


  if (typeText) typeText.textContent = `Tipo: ${typeLabel}`;


}





function renderPeriodInsights(entries) {


  const maxInEl = document.getElementById('insight-max-in');


  const maxOutEl = document.getElementById('insight-max-out');


  const avgEl = document.getElementById('insight-avg');


  const countEl = document.getElementById('insight-count');


  if (!maxInEl && !maxOutEl && !avgEl && !countEl) return;


  let maxIn = 0;


  let maxOut = 0;


  let totalAbs = 0;


  entries.forEach(e => {


    const amount = Number(e.amount) || 0;


    totalAbs += Math.abs(amount);


    if (e.type === 'in') maxIn = Math.max(maxIn, amount);


    if (e.type === 'out') maxOut = Math.max(maxOut, amount);


  });


  const avg = entries.length ? totalAbs / entries.length : 0;


  if (maxInEl) {


    maxInEl.textContent = maxIn ? `+${formatMoney(maxIn)}` : 'R$ 0,00';


    maxInEl.className = 'badge-in';


  }


  if (maxOutEl) {


    maxOutEl.textContent = maxOut ? `-${formatMoney(maxOut)}` : 'R$ 0,00';


    maxOutEl.className = 'badge-out';


  }


  if (avgEl) avgEl.textContent = formatMoney(avg);


  if (countEl) countEl.textContent = String(entries.length);


}





function toggleFilterPanel(targetId, button) {


  const panel = document.getElementById(targetId);


  if (!panel) return;


  panel.classList.toggle('is-open');


  const isOpen = panel.classList.contains('is-open');


  if (button) {


    button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');


    button.setAttribute('title', isOpen ? 'Ocultar filtros' : 'Mostrar filtros');


    button.setAttribute('aria-label', isOpen ? 'Ocultar filtros' : 'Mostrar filtros');


  }


}





function formatMonthShort(month) {


  if (!month) return '';


  try {


    const d = new Date(`${month}-01T00:00:00`);


    const mon = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(d).replace('.', '');


    const year = String(d.getFullYear()).slice(2);


    return `${mon}/${year}`;


  } catch {


    return month;


  }


}





init();


function toggleUserUI(isUser) {


  const add = document.getElementById('btn-add');


  if (add) add.hidden = !isUser;


  const goAdmin = document.getElementById('btn-go-admin');


  if (goAdmin) goAdmin.hidden = isUser;


  const adminAlt = document.getElementById('btn-go-admin-2');


  if (adminAlt) adminAlt.hidden = isUser;


  document.querySelectorAll('[data-go-view^="view-admin"]').forEach(btn => btn.hidden = isUser);


  const navOptions = document.getElementById('nav-options');


  if (navOptions) navOptions.hidden = !isUser;


  const navAddIn = document.getElementById('nav-add-in');


  const navAddOut = document.getElementById('nav-add-out');


  if (navAddIn) navAddIn.hidden = !isUser;


  if (navAddOut) navAddOut.hidden = !isUser;


  document.querySelectorAll('#profile-form input, #password-form input').forEach(el => {


    el.addEventListener('blur', ev => validateUserOptionField(ev.target));


    el.addEventListener('input', ev => validateUserOptionField(ev.target));


  });


}











async function loadTrash() {


  const res = await api.get(`${API_BASE}/entries/trash`);


  if (res.ok) {


    const payload = res.data;


    const items = Array.isArray(payload) ? payload : (payload && typeof payload === 'object' ? Object.values(payload) : []);


    state.trash = items;


    renderTrash();


  }


}





function renderTrash() {


  const list = document.getElementById('trash-list');


  const empty = document.getElementById('trash-empty');


  if (!list) return;


  if (!list.dataset.bound) {


    list.addEventListener('click', handleTrashClick);


    list.dataset.bound = '1';


  }


  list.innerHTML = '';


  const items = Array.isArray(state.trash) ? state.trash.filter(e => e.deleted_at) : [];


  if (!items.length) {


    if (empty) empty.hidden = false;


    return;


  }


  if (empty) empty.hidden = true;


  items.forEach(e => {


    const li = document.createElement('li');


    const initial = (escapeHtml(e.category || '').charAt(0).toUpperCase() || '?');


    const badgeClass = e.type === 'out' ? 'badge-out' : 'badge-in';


    const prefix = e.type === 'out' ? '-' : '+';


    li.innerHTML = `<div class="entry-left">


      <div class="avatar tiny">${initial}</div>


      <div>


        <strong>${escapeHtml(e.category || '')}</strong>


        <small class="muted">${formatDateBR(e.date)}</small>


      </div>


    </div>


    <div class="entry-right">


      <div class="entry-meta">


        <div class="${badgeClass}">${prefix}${formatMoney(Number(e.amount))}</div>


      </div>


      <div class="inline-actions trash-actions">


        <button type="button" class="icon-btn ghost" data-action="restore" data-id="${e.id}" title="Restaurar" aria-label="Restaurar">


          <span class="material-icons-outlined">undo</span>


        </button>


        <button type="button" class="icon-btn danger" data-action="purge" data-id="${e.id}" title="Excluir definitivamente" aria-label="Excluir definitivamente">


          <span class="material-icons-outlined">delete</span>


        </button>


      </div>


    </div>`;


    list.appendChild(li);


  });


}





function statusIcon(e) {


  const map = {


    open: 'hourglass_empty',


    pending: 'pending_actions',


    locked: 'verified',


    deleted_soft: 'undo',

    deleted_hard: 'delete',

    rejected: 'block'


  };


  return map[e?.status] || 'info';


}





function statusLabel(e) {


  const map = {


    open: 'Não consolidado',

    pending: 'Pendente de aprovacao',


    locked: 'Consolidado',


    deleted_soft: 'Excluído (soft)',


    deleted_hard: 'Excluído (hard aguardando purga)',

    rejected: 'Recusado',


  };


  return map[e?.status] || 'Status';


}





async function handleTrashClick(e) {


  const btn = e.target.closest('button[data-action]');


  if (!btn) return;


  e.preventDefault();


  const id = Number(btn.dataset.id);


  if (!id) return;


  btn.disabled = true;


  try {


    if (btn.dataset.action === 'restore') {


      await restoreEntry(id);


    } else if (btn.dataset.action === 'purge') {


      await purgeEntry(id);


    }


  } catch (err) {


    console.error(err);


    ui.toast('Não foi possível executar ação');
  } finally {


    btn.disabled = false;


  }


}





async function restoreEntry(id) {


  const res = await api.put(`${API_BASE}/entries/${id}/restore`, {});


  if (res.ok) {


    ui.toast('Restaurado');


    await loadEntries();


    await loadTrash();


  } else {


    ui.toast(res.error || 'Não foi possível restaurar');
  }


}





async function purgeEntry(id) {


  const ok = await showConfirmModal('Excluir definitivamente este item?', 'Excluir item');


  if (!ok) return;


  const res = await api.del(`${API_BASE}/entries/${id}/purge`);


  if (res.ok) {


    ui.toast('Removido da lixeira');


    await loadEntries();


  await loadTrash();


} else {


    ui.toast(res.error || 'Não foi possível remover');
  }


}





async function emptyTrash() {


  const ok = await showConfirmModal('Esvaziar lixeira? Essa ação não pode ser desfeita.', 'Limpar lixeira');


  if (!ok) return;


  const items = state.trash.filter(e => e.deleted_at);


  for (const item of items) {


    await api.del(`${API_BASE}/entries/${item.id}/purge`);


  }


  await loadEntries();


  await loadTrash();


}











