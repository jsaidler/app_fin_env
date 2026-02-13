const state = {


  user: null,


  users: [],


  categories: [],


  entries: [],


  pendingEntries: [],


  closedMonths: [],


  notifications: [],


  supportThreads: [],


  supportMessages: [],


  supportActiveThreadId: null,


  closureReport: null,


  closureEntries: [],


  impersonateUserId: null,


  editingEntryId: null,


  editingEntryUserId: null,


};


const API_BASE = '/api';



const STORAGE_ADMIN_PANEL = 'adminPanel';


const STORAGE_IMPERSONATE = 'adminImpersonateUser';

const attachmentCache = new Map();

let supportReplyAttachment = null;





function setRoleClass(role) {


  document.body.classList.remove('role-admin', 'role-user');


  if (role === 'admin') document.body.classList.add('role-admin');


}





function updateAdminKpis() {


  const users = state.users.filter(u => u.role !== 'admin').length;


  const entries = state.entries.length;


  const notifications = state.notifications.length;


  const map = [


    ['admin-kpi-users', users],


    ['admin-kpi-entries', entries],


    ['admin-kpi-notifications', notifications],


  ];


  map.forEach(([id, value]) => {


    const el = document.getElementById(id);


    if (el) el.textContent = String(value);


  });


}





function getUserNameById(id) {


  const user = state.users.find(u => Number(u.id) === Number(id));


  return user?.name || '';


}





function updateEntryUserLabel(userId) {


  const label = document.getElementById('admin-entry-user-label');


  if (!label) return;


  const name = userId ? getUserNameById(userId) : '';


  label.textContent = name || 'Selecione um usuário';


}





function updateFilterUserLabel(userId) {


  const label = document.getElementById('admin-summary-user-text');


  if (!label) return;


  const name = userId ? getUserNameById(userId) : '';


  label.textContent = name || 'Todos';


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





function updateImpersonationLabels() {


  updateFilterUserLabel(state.impersonateUserId);


  if (!state.editingEntryId) {


    updateEntryUserLabel(state.impersonateUserId);


  }


}





function updateEntrySubmitLabel(label) {


  const submit = document.getElementById('admin-entry-submit');


  if (!submit) return;


  submit.setAttribute('title', label);


  submit.setAttribute('aria-label', label);


}





function currentMonthValue() {


  const now = new Date();


  const month = String(now.getMonth() + 1).padStart(2, '0');


  return `${now.getFullYear()}-${month}`;


}





function normalizeMonthRange(startMonth, endMonth) {


  let start = startMonth || '';


  let end = endMonth || '';


  if (start && end && start > end) {


    const tmp = start;


    start = end;


    end = tmp;


  }


  return { start, end };


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





function updateAdminFilterSummary() {


  const startMonth = document.getElementById('admin-filter-start')?.value || '';


  const endMonth = document.getElementById('admin-filter-end')?.value || '';


  const type = document.getElementById('admin-filter-type')?.value || 'all';


  const showDeleted = document.getElementById('admin-filter-deleted')?.checked;


  const periodEl = document.getElementById('admin-summary-period-text');


  const typeEl = document.getElementById('admin-summary-type-text');


  const deletedChip = document.getElementById('admin-summary-deleted');


  if (periodEl) periodEl.textContent = formatPeriodLabel(startMonth, endMonth);


  if (typeEl) {


    const typeLabel = type === 'in' ? 'Entradas' : type === 'out' ? 'Saídas' : 'Todos';


    typeEl.textContent = `Tipo: ${typeLabel}`;


  }


  if (deletedChip) deletedChip.hidden = !showDeleted;


}





function resetAdminFilters() {


  const current = currentMonthValue();


  const start = document.getElementById('admin-filter-start');


  const end = document.getElementById('admin-filter-end');


  const type = document.getElementById('admin-filter-type');


  const deleted = document.getElementById('admin-filter-deleted');


  if (start) start.value = current;


  if (end) end.value = current;


  if (type) {


    type.value = 'all';


    type.dispatchEvent(new Event('change', { bubbles: true }));


  }


  if (deleted) deleted.checked = false;


  updateAdminFilterSummary();


  loadAdminEntries();


}





function setDefaultMonths() {


  const current = currentMonthValue();


  ['admin-filter-start', 'admin-filter-end', 'admin-export-month', 'admin-closure-month', 'close-month'].forEach(id => {


    const el = document.getElementById(id);


    if (el && !el.value) el.value = current;


  });


}





function enhanceAdminSelects() {


  const root = document.getElementById('view-admin') || document;


  ui.enhanceSelects(root);


}





function bind(id, evt, fn) {


  const el = document.getElementById(id);


  if (el) el.addEventListener(evt, fn);


}





function showAuth() {


  redirectToLogin();


}





function showAdmin() {


  const auth = document.getElementById('view-auth');


  const admin = document.getElementById('view-admin');


  if (auth) auth.hidden = true;


  if (admin) {


    admin.hidden = false;


    admin.classList.add('active');


  }


}





function goToPanel(panel) {


  const panels = document.querySelectorAll('.admin-panel');


  panels.forEach(p => {


    p.hidden = p.dataset.adminPanel !== panel;


  });


  document.querySelectorAll('[data-admin-panel]').forEach(btn => {


    if (!btn.matches('button')) return;


    btn.classList.toggle('active', btn.dataset.adminPanel === panel);


  });


  const title = document.getElementById('admin-view-title');


  if (title) {


    const map = {


      entries: 'Lançamentos',


      users: 'Usuários',


      categories: 'Categorias',


      locks: 'Fechamento',


      notifications: 'Notificações',


      support: 'Suporte',


      export: 'Exportar',


    };


    title.textContent = map[panel] || 'Admin';


  }


  localStorage.setItem(STORAGE_ADMIN_PANEL, panel);


  if (panel === 'notifications') {


    loadNotifications();


  }


  if (panel === 'support') {


    loadSupportThreads();


    if (state.supportActiveThreadId) loadSupportMessages(state.supportActiveThreadId);


  }


}





function clearAuth() {

  state.user = null;

}





function logout() {
  api.post(`${API_BASE}/auth/logout`).finally(() => {
    clearAuth();
    ui.toast('Sess?o encerrada');
    redirectToLogin();
  });
}






async function ensureSession() {


  const res = await api.get(`${API_BASE}/account/profile`);


  if (!res.ok) {


    clearAuth();


    redirectToLogin();


    return false;


  }


  if (res.data.role !== 'admin') {


    window.location.href = '/index.html';


    return false;


  }


  state.user = res.data;


  setRoleClass('admin');


  const label = document.getElementById('admin-user-label');


  if (label) label.textContent = `${state.user.name} (${state.user.email})`;


  showAdmin();


  const panel = localStorage.getItem(STORAGE_ADMIN_PANEL);


  const allowed = ['entries', 'users', 'categories', 'locks', 'notifications', 'support', 'export'];


  goToPanel(allowed.includes(panel) ? panel : 'entries');


  await loadUsers();


  await loadCategories();


  await loadClosedMonths();


  await loadNotifications();


  await loadSupportThreads();


  await loadAdminEntries();


  renderAdminClosureReport(state.closureReport);


  return true;


}





async function loadUsers() {


  const res = await api.get(`${API_BASE}/admin/users`);


  if (!res.ok) {


    ui.toast(res.error || 'Erro ao carregar usuários');


    return;


  }


  state.users = Array.isArray(res.data) ? res.data : [];


  renderUsersTable();


  renderUserSelects();


  renderCloseMonthUsers();


  updateAdminKpis();


}





function renderUsersTable() {


  const tbody = document.querySelector('#users-table tbody');


  if (!tbody) return;


  tbody.innerHTML = '';


  state.users.forEach(u => {


    const tr = document.createElement('tr');


    tr.innerHTML = `<td>${escapeHtml(u.name || '')}</td>


      <td>${escapeHtml(u.email || '')}</td>


      <td>${escapeHtml(u.role || '')}</td>


      <td>${escapeHtml(u.alterdata_code || '')}</td>


      <td><div class="inline-actions">

        <button class="icon-btn ghost square" data-action="edit-user" data-id="${u.id}" title="Editar" aria-label="Editar usuário">


          <span class="material-icons-outlined" aria-hidden="true">edit</span>


        </button>


        <button class="icon-btn ghost square danger" data-action="delete-user" data-id="${u.id}" title="Excluir" aria-label="Excluir usuário">


          <span class="material-icons-outlined" aria-hidden="true">delete</span>


        </button>


      </div></td>`;


    tbody.appendChild(tr);


  });


}





function renderUserSelects() {


  const nonAdmins = state.users.filter(u => u.role !== 'admin');


  const impersonate = document.getElementById('admin-impersonate-user');


  const exportUser = document.getElementById('admin-export-user');


  const closureUser = document.getElementById('admin-closure-user');

  const supportUser = document.getElementById('support-new-user');





  if (impersonate) {


    impersonate.innerHTML = '';


    if (!nonAdmins.length) {


      const opt = document.createElement('option');


      opt.value = '';


      opt.textContent = 'Nenhum usuário';


      impersonate.appendChild(opt);


      impersonate.disabled = true;


    } else {


      const opt = document.createElement('option');


      opt.value = '';


      opt.textContent = 'Selecione um usuário';


      impersonate.appendChild(opt);


      nonAdmins.forEach(u => {


        const opt = document.createElement('option');


        opt.value = u.id;


        opt.textContent = u.name;


        impersonate.appendChild(opt);


      });


      impersonate.disabled = false;


    }


  }





  if (exportUser) {


    exportUser.innerHTML = '<option value="">Todos</option>';


    nonAdmins.forEach(u => {


      const opt = document.createElement('option');


      opt.value = u.id;


      opt.textContent = u.name;


      exportUser.appendChild(opt);


    });


  }





  if (closureUser) {


    closureUser.innerHTML = '<option value="">Selecione um usuario</option>';


    nonAdmins.forEach(u => {


      const opt = document.createElement('option');


      opt.value = u.id;


      opt.textContent = u.name;


      closureUser.appendChild(opt);


    });


  }

  if (supportUser) {

    supportUser.innerHTML = '';

    if (!nonAdmins.length) {

      const opt = document.createElement('option');

      opt.value = '';

      opt.textContent = 'Nenhum usuario';

      supportUser.appendChild(opt);

      supportUser.disabled = true;

    } else {

      const opt = document.createElement('option');

      opt.value = '';

      opt.textContent = 'Selecione um usuario';

      supportUser.appendChild(opt);

      nonAdmins.forEach(u => {

        const opt = document.createElement('option');

        opt.value = u.id;

        opt.textContent = u.name;

        supportUser.appendChild(opt);

      });

      supportUser.disabled = false;

    }

  }


  if (impersonate) ui.enhanceSelect(impersonate);


  if (exportUser) ui.enhanceSelect(exportUser);


  if (closureUser) ui.enhanceSelect(closureUser);

  if (supportUser) ui.enhanceSelect(supportUser);





  const stored = localStorage.getItem(STORAGE_IMPERSONATE);


  const storedId = stored && nonAdmins.some(u => String(u.id) === stored) ? Number(stored) : null;


  const currentId = state.impersonateUserId && nonAdmins.some(u => Number(u.id) === Number(state.impersonateUserId))


    ? state.impersonateUserId


    : null;


  const defaultId = storedId || currentId || nonAdmins[0]?.id || null;


  state.impersonateUserId = defaultId;


  if (impersonate) {


    impersonate.value = defaultId ? String(defaultId) : '';


  }


  updateImpersonationLabels();


}





async function submitUser(e) {


  e.preventDefault();


  const fd = new FormData(e.target);


  const payload = {


    name: (fd.get('name') || '').trim(),


    email: (fd.get('email') || '').trim().toLowerCase(),


    password: fd.get('password') || '',


    role: fd.get('role') || 'user',


    alterdata_code: (fd.get('alterdata_code') || '').trim(),


  };


  if (!payload.name || !payload.email) {


    return ui.toast('Nome e email sao obrigatorios');


  }


  const id = e.target.dataset.editId ? Number(e.target.dataset.editId) : null;


  const body = {


    name: payload.name,


    email: payload.email,


    role: payload.role,


    alterdata_code: payload.alterdata_code,


  };


  if (!id && payload.password) body.password = payload.password;


  if (!id && payload.password.length < 8) {


    return ui.toast('Senha deve ter ao menos 8 caracteres');


  }


  const res = id


    ? await api.put(`${API_BASE}/admin/users/${id}`, body)


    : await api.post(`${API_BASE}/admin/users`, { ...body, password: payload.password });


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





async function handleUserAction(e) {


  const btn = e.target.closest('button');


  if (!btn) return;


  const id = Number(btn.dataset.id);


  if (!id) return;


  if (btn.dataset.action === 'delete-user') {


    if (!window.confirm('Excluir usuário?')) return;


    const res = await api.del(`${API_BASE}/admin/users/${id}`);


    if (res.ok) {


      ui.toast('Usuário excluido');


      await loadUsers();


    } else {


      ui.toast(res.error || 'Erro ao excluir usuário');


    }


    return;


  }


  if (btn.dataset.action === 'edit-user') {


    const user = state.users.find(u => Number(u.id) === id);


    if (!user) return;


    const form = document.getElementById('user-form');


    if (!form) return;


    toggleArea('user-form-area', true);


    form.name.value = user.name || '';


    form.email.value = user.email || '';


    form.password.value = '';


    form.role.value = user.role || 'user';


    form.alterdata_code.value = user.alterdata_code || '';


    form.dataset.editId = String(id);


  }


}





async function loadCategories() {


  const res = await api.get(`${API_BASE}/admin/categories`);


  if (!res.ok) {


    ui.toast(res.error || 'Erro ao carregar categorias');


    return;


  }


  state.categories = Array.isArray(res.data) ? res.data : [];


  renderCategoriesTable();


  renderEntryCategoryOptions();


}





function renderCategoriesTable() {


  const tbody = document.querySelector('#categories-table tbody');


  if (!tbody) return;


  tbody.innerHTML = '';


  state.categories.forEach(c => {


    const tr = document.createElement('tr');


    tr.innerHTML = `<td>${escapeHtml(c.name || '')}</td>


      <td>${c.type === 'in' ? 'Entrada' : 'Saída'}</td>


      <td>${escapeHtml(c.alterdata_auto || '')}</td>


      <td><div class="inline-actions">


        <button class="icon-btn ghost square" data-action="edit-category" data-id="${c.id}" title="Editar" aria-label="Editar categoria">


          <span class="material-icons-outlined" aria-hidden="true">edit</span>


        </button>


        <button class="icon-btn ghost square danger" data-action="delete-category" data-id="${c.id}" title="Excluir" aria-label="Excluir categoria">


          <span class="material-icons-outlined" aria-hidden="true">delete</span>


        </button>


      </div></td>`;


    tbody.appendChild(tr);


  });


}





function renderEntryCategoryOptions(selected) {


  const type = document.getElementById('admin-entry-type')?.value || 'in';


  const select = document.getElementById('admin-entry-category');


  if (!select) return;


  const prev = selected || select.value;


  select.innerHTML = '';


  const available = state.categories.filter(c => c.type === type);


  available.forEach(c => {


    const opt = document.createElement('option');


    opt.value = c.name;


    opt.textContent = c.name;


    select.appendChild(opt);


  });


  if (prev && !available.some(c => c.name === prev)) {


    const opt = document.createElement('option');


    opt.value = prev;


    opt.textContent = prev;


    select.appendChild(opt);


  }


  if (prev) select.value = prev;


  ui.enhanceSelect(select);


}





async function submitCategory(e) {


  e.preventDefault();


  const fd = new FormData(e.target);


  const payload = {


    name: (fd.get('name') || '').trim(),


    type: fd.get('type') || '',


    alterdata_auto: (fd.get('alterdata_auto') || '').trim(),


  };


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





async function handleCategoryAction(e) {


  const btn = e.target.closest('button');


  if (!btn) return;


  const id = Number(btn.dataset.id);


  if (!id) return;


  if (btn.dataset.action === 'delete-category') {


    if (!window.confirm('Excluir categoria?')) return;


    const res = await api.del(`${API_BASE}/admin/categories/${id}`);


    if (res.ok) {


      ui.toast('Categoria excluida');


      await loadCategories();


    } else {


      ui.toast(res.error || 'Erro ao excluir categoria');


    }


    return;


  }


  if (btn.dataset.action === 'edit-category') {


    const cat = state.categories.find(c => Number(c.id) === id);


    if (!cat) return;


    const form = document.getElementById('category-form');


    if (!form) return;


    toggleArea('category-form-area', true);


    form.name.value = cat.name || '';


    form.type.value = cat.type || 'in';


    form.alterdata_auto.value = cat.alterdata_auto || '';


    form.dataset.editId = String(id);


  }


}





async function loadAdminEntries() {


  updateAdminFilterSummary();


  const params = new URLSearchParams();


  const userId = state.impersonateUserId ? String(state.impersonateUserId) : '';


  const type = document.getElementById('admin-filter-type')?.value || 'all';


  const startMonth = document.getElementById('admin-filter-start')?.value || '';


  const endMonth = document.getElementById('admin-filter-end')?.value || '';


  const range = normalizeMonthRange(startMonth, endMonth);


  if (userId) params.set('user_id', userId);


  if (type !== 'all') params.set('type', type);


  if (range.start) params.set('start', range.start);


  if (range.end) params.set('end', range.end);


  const url = `${API_BASE}/admin/entries${params.toString() ? '?' + params.toString() : ''}`;


  const res = await api.get(url);


  if (!res.ok) {


    ui.toast(res.error || 'Erro ao carregar lançamentos');


    return;


  }


  state.entries = Array.isArray(res.data) ? res.data : [];


  renderEntriesTable();


  await loadPendingEntries();


  updateAdminKpis();


}





function resolveEntryStatus(entry) {

  if (entry.deleted_type === 'rejected') {

    return { label: 'Recusado', className: 'status-rejected' };

  }

  const labels = [];

  if (entry.pending_review) labels.push('Pendente');

  if (entry.soft_deleted) labels.push('Excluido');

  if (entry.locked && !entry.soft_deleted && !entry.pending_review) labels.push('Fechado');

  const label = labels.length ? labels.join(' / ') : 'Ativo';

  let className = 'status-open';

  if (entry.pending_review) className = 'status-pending';

  else if (entry.soft_deleted) className = 'status-deleted';

  else if (entry.locked) className = 'status-locked';

  return { label, className };

}

function renderEntriesTable() {


  updateAdminFilterSummary();


  const tbody = document.querySelector('#admin-entries-table tbody');


  const empty = document.getElementById('admin-entries-empty');


  if (!tbody) return;


  tbody.innerHTML = '';


  if (empty) empty.hidden = true;


  const showDeleted = document.getElementById('admin-filter-deleted')?.checked;


  const filtered = state.entries.filter(e => showDeleted || !e.soft_deleted);


  if (!filtered.length) {


    if (empty) empty.hidden = false;


    return;


  }


  filtered.forEach(e => {


    const user = state.users.find(u => Number(u.id) === Number(e.user_id));

    const status = resolveEntryStatus(e);


    const tr = document.createElement('tr');


    tr.innerHTML = `<td>${formatDate(e.date)}</td>


      <td>${escapeHtml(user?.name || 'Usuário')}</td>


      <td>${escapeHtml(e.category || '')}</td>


      <td>${e.type === 'in' ? 'Entrada' : 'Saída'}</td>


      <td class="text-right">${formatMoney(Number(e.amount || 0))}</td>


      <td><span class="status-pill ${status.className}">${status.label}</span></td>


      <td><div class="inline-actions">


        ${e.soft_deleted ? '' : `<button class="icon-btn ghost square" data-action="edit-entry" data-id="${e.id}" title="Editar" aria-label="Editar lançamento">


          <span class="material-icons-outlined" aria-hidden="true">edit</span>


        </button>


        <button class="icon-btn ghost square danger" data-action="delete-entry" data-id="${e.id}" title="Excluir" aria-label="Excluir lançamento">


          <span class="material-icons-outlined" aria-hidden="true">delete</span>


        </button>`}


      </div></td>`;


    tbody.appendChild(tr);


  });


}





async function submitAdminEntry(e) {


  e.preventDefault();


  const form = e.target;


  const userId = Number(state.editingEntryUserId || state.impersonateUserId || 0);


  const type = form.type?.value || 'in';


  const amount = parseMoney(form.amount?.value || '');


  const date = form.date?.value || '';


  const category = form.category?.value || '';


  const description = form.description?.value || '';


  if (!userId) {


    return ui.toast('Selecione um usuário para personificar');


  }


  if (!category || !date || amount === null) {


    return ui.toast('Preencha todos os campos obrigatorios');


  }


  const payload = {


    user_id: userId,


    type,


    amount: Number(amount.toFixed(2)),


    category,


    description,


    date,


  };


  const id = state.editingEntryId;


  const res = id


    ? await api.put(`${API_BASE}/admin/entries/${id}`, payload)


    : await api.post(`${API_BASE}/admin/entries`, payload);


  if (res.ok) {


    ui.toast(id ? 'Lançamento atualizado' : 'Lançamento criado');


    resetEntryForm();


    await loadAdminEntries();


  } else {


    ui.toast(res.error || 'Erro ao salvar lançamento');


  }


}





function resetEntryForm() {


  const form = document.getElementById('admin-entry-form');


  if (form) form.reset();


  state.editingEntryId = null;


  state.editingEntryUserId = null;


  const cancel = document.getElementById('admin-entry-cancel');


  if (cancel) cancel.hidden = true;


  updateEntrySubmitLabel('Salvar');


  renderEntryCategoryOptions();


  updateEntryUserLabel(state.impersonateUserId);


}

function startEditEntry(entry) {

  if (!entry) return;


  const form = document.getElementById('admin-entry-form');


  if (!form) return;


  state.editingEntryId = Number(entry.id);


  state.editingEntryUserId = Number(entry.user_id);


  form.type.value = entry.type;


  renderEntryCategoryOptions(entry.category);


  form.amount.value = formatMoneyPlain(Number(entry.amount || 0));


  form.date.value = entry.date;


  form.description.value = entry.description || '';


  updateEntryUserLabel(state.editingEntryUserId);


  const cancel = document.getElementById('admin-entry-cancel');


  if (cancel) cancel.hidden = false;


  updateEntrySubmitLabel('Atualizar');


}





async function handleApprovalAction(e) {

  const btn = e.target.closest('button');

  if (!btn) return;

  if (btn.dataset.action === 'view-attachment') {

    openAttachment(btn.dataset.attachment);

    return;

  }

  const id = Number(btn.dataset.id);

  if (!id) return;

  if (btn.dataset.action === 'approve-entry') {

    const res = await api.put(`${API_BASE}/admin/entries/${id}/approve`, {});

    if (res.ok) {

      ui.toast('Lancamento aprovado');

      await loadPendingEntries();

      await loadAdminEntries();

      await loadNotifications();

    } else {

      ui.toast(res.error || 'Erro ao aprovar lancamento');

    }

    return;

  }

  if (btn.dataset.action === 'reject-entry') {

    if (!window.confirm('Recusar lancamento?')) return;

    const res = await api.put(`${API_BASE}/admin/entries/${id}/reject`, {});

    if (res.ok) {

      ui.toast('Lancamento recusado');

      await loadPendingEntries();

      await loadAdminEntries();

      await loadNotifications();

    } else {

      ui.toast(res.error || 'Erro ao recusar lancamento');

    }

    return;

  }

  if (btn.dataset.action === 'support-entry') {

    const entry = state.pendingEntries.find(item => Number(item.id) === id);

    if (!entry) return;

    openSupportThreadFromEntry(entry);

    return;

  }

  if (btn.dataset.action === 'edit-entry') {

    const entry = state.pendingEntries.find(item => Number(item.id) === id);

    if (!entry) return;

    startEditEntry(entry);

    return;

  }

  if (btn.dataset.action === 'delete-entry') {

    if (!window.confirm('Excluir lancamento?')) return;

    const res = await api.del(`${API_BASE}/admin/entries/${id}`);

    if (res.ok) {

      ui.toast('Lancamento excluido');

      await loadPendingEntries();

      await loadAdminEntries();

      await loadNotifications();

    } else {

      ui.toast(res.error || 'Erro ao excluir lancamento');

    }

  }

}


async function handleEntryAction(e) {


  const btn = e.target.closest('button');


  if (!btn) return;


  const id = Number(btn.dataset.id);


  if (!id) return;


  if (btn.dataset.action === 'delete-entry') {


    if (!window.confirm('Excluir lançamento?')) return;


    const res = await api.del(`${API_BASE}/admin/entries/${id}`);


    if (res.ok) {


      ui.toast('Lançamento excluido');


      await loadAdminEntries();

      await loadPendingEntries();

      await loadNotifications();


    } else {


      ui.toast(res.error || 'Erro ao excluir lançamento');


    }


    return;


  }

  if (btn.dataset.action === 'support-entry') {

    const entry = state.entries.find(item => Number(item.id) === id);

    if (!entry) return;

    openSupportThreadFromEntry(entry);

    return;

  }


  if (btn.dataset.action === 'edit-entry') {


    const entry = state.entries.find(item => Number(item.id) === id);


    if (!entry) return;


    startEditEntry(entry);


  }


}





async function loadClosedMonths() {


  const res = await api.get(`${API_BASE}/admin/closed-months`);


  if (!res.ok) return;


  const list = res.data.closed_months || [];


  state.closedMonths = list;


  renderClosedMonths();


}





function renderCloseMonthUsers() {


  const box = document.getElementById('close-month-users');


  if (!box) return;


  box.innerHTML = '';


  state.users.filter(u => u.role !== 'admin').forEach(u => {


    const label = document.createElement('label');
    label.className = 'control-chip';
    label.innerHTML = `<input type="checkbox" name="user_ids" value="${u.id}"><span>${escapeHtml(u.name || '')}</span>`;
    box.appendChild(label);


  });


}





function renderClosedMonths() {


  const list = document.getElementById('closed-months-list');


  if (!list) return;


  if (!state.closedMonths.length) {


    list.textContent = 'Nenhum fechamento registrado.';


    return;


  }


  const lines = state.closedMonths.filter(l => l.closed).map(lock => {


    const user = state.users.find(u => Number(u.id) === Number(lock.user_id));


    const name = user ? user.name : `Usuário ${lock.user_id}`;


    return `${lock.month} - ${name}`;


  });


  list.innerHTML = lines.map(line => `<div>${escapeHtml(line)}</div>`).join('');


}





async function closeMonth(e) {


  e.preventDefault();


  const form = e.target;


  const month = form.month.value;


  const closed = form.closed.value === '1';


  const selected = Array.from(form.querySelectorAll('input[name="user_ids"]:checked')).map(el => Number(el.value));


  if (!month || !selected.length) {


    return ui.toast('Selecione mês e usuários');
  }


  const res = await api.post(`${API_BASE}/admin/close-month`, { month, closed, user_ids: selected });


  if (res.ok) {


    ui.toast('Fechamento atualizado');


    state.closedMonths = res.data.closed_months || [];


    renderClosedMonths();


    form.reset();


    setDefaultMonths();


  } else {


    ui.toast(res.error || 'Erro ao fechar mes');


  }


}





function toggleSelectAllUsers(e) {


  const checked = e.target.checked;


  document.querySelectorAll('#close-month-users input[type="checkbox"]').forEach(cb => {


    cb.checked = checked;


  });


}





async function loadNotifications() {


  const res = await api.get(`${API_BASE}/admin/notifications`);


  if (!res.ok) return;


  state.notifications = res.data.notifications || [];


  renderNotifications();


  updateAdminKpis();


}





function renderNotifications() {


  const tbody = document.querySelector('#admin-notifications-table tbody');


  const empty = document.getElementById('admin-notifications-empty');


  if (!tbody) return;


  tbody.innerHTML = '';


  if (empty) empty.hidden = true;


  if (!state.notifications.length) {


    if (empty) empty.hidden = false;


  }


  state.notifications.forEach(n => {


    const payload = n.payload || {};


    const actionLabel = n.action === 'created' ? 'Entrada' : n.action === 'deleted' ? 'Exclusão' : 'Edição';


    const details = `${formatDate(payload.date || '')} | ${escapeHtml(payload.category || '')} | ${formatMoney(Number(payload.amount || 0))}`;


    const tr = document.createElement('tr');


    tr.innerHTML = `<td>${formatDateTime(n.created_at)}</td>


      <td>${escapeHtml(n.user_name || '')}</td>


      <td>${actionLabel}</td>


      <td>${details}</td>


      <td>


        <button class="icon-btn ghost square" data-action="read-notification" data-id="${n.id}" title="Marcar lido" aria-label="Marcar lido">


          <span class="material-icons-outlined" aria-hidden="true">done</span>


        </button>


      </td>`;


    tbody.appendChild(tr);


  });


  const badge = document.getElementById('notification-count');


  if (badge) {


    badge.textContent = String(state.notifications.length);


    badge.hidden = state.notifications.length === 0;


  }


}





async function handleNotificationAction(e) {


  const btn = e.target.closest('button');


  if (!btn || btn.dataset.action !== 'read-notification') return;


  const id = Number(btn.dataset.id);


  if (!id) return;


  const res = await api.put(`${API_BASE}/admin/notifications/${id}/read`, {});


  if (res.ok) {


    await loadNotifications();


  } else {


    ui.toast(res.error || 'Erro ao atualizar notificação');


  }


}





function updateSupportBadge() {

  const badge = document.getElementById('support-count');

  if (!badge) return;

  const total = state.supportThreads.reduce((sum, t) => sum + Number(t.unread_count || 0), 0);

  badge.textContent = String(total);

  badge.hidden = total === 0;

}


async function loadSupportThreads() {

  const res = await api.get(`${API_BASE}/admin/support/threads`);

  if (!res.ok) return;

  state.supportThreads = res.data.threads || [];

  renderSupportThreads();

  updateSupportBadge();

  if (state.supportActiveThreadId && !state.supportThreads.some(t => Number(t.id) === Number(state.supportActiveThreadId))) {

    state.supportActiveThreadId = null;

  }

  if (!state.supportThreads.length) {

    state.supportActiveThreadId = null;

    state.supportMessages = [];

    renderSupportMessages();

    return;

  }

  if (!state.supportActiveThreadId && state.supportThreads.length) {

    state.supportActiveThreadId = state.supportThreads[0].id;

  }

}


function renderSupportThreads() {

  const container = document.getElementById('support-thread-list');

  const empty = document.getElementById('support-thread-empty');

  if (!container) return;

  container.innerHTML = '';

  if (!state.supportThreads.length) {

    if (empty) empty.hidden = false;

    updateSupportBadge();

    return;

  }

  if (empty) empty.hidden = true;

  state.supportThreads.forEach(thread => {

    const btn = document.createElement('button');

    btn.type = 'button';

    const isActive = Number(state.supportActiveThreadId) === Number(thread.id);

    btn.className = `support-thread-item${isActive ? ' active' : ''}`;

    btn.dataset.threadId = String(thread.id);

    const previewText = thread.last_message || (thread.last_attachment ? 'Anexo' : '');

    const preview = escapeHtml(previewText);

    const when = thread.last_at ? formatDateTime(thread.last_at) : '';

    const unread = Number(thread.unread_count || 0);

    const metaText = `${thread.user_name || 'Usuario'}${when ? ' - ' + when : ''}`;

    btn.innerHTML = `<div class="support-thread-title">${escapeHtml(thread.subject || 'Atendimento')}</div>

      <div class="support-thread-meta">

        <span>${escapeHtml(metaText)}</span>

        ${unread ? `<span class="count-badge">${unread}</span>` : ''}

      </div>

      <div class="support-thread-preview">${preview || 'Sem mensagem'}</div>`;

    container.appendChild(btn);

  });

}

async function loadPendingEntries() {

  const params = new URLSearchParams();

  params.set('needs_review', '1');

  const res = await api.get(`${API_BASE}/admin/entries?${params.toString()}`);

  if (!res.ok) {

    ui.toast(res.error || 'Erro ao carregar pendencias');

    return;

  }

  state.pendingEntries = Array.isArray(res.data) ? res.data : [];

  renderPendingEntries();

}


function renderPendingEntries() {

  const tbody = document.querySelector('#admin-approvals-table tbody');

  const empty = document.getElementById('admin-approvals-empty');

  if (!tbody) return;

  tbody.innerHTML = '';

  if (empty) empty.hidden = true;

  if (!state.pendingEntries.length) {

    if (empty) empty.hidden = false;

    return;

  }

  state.pendingEntries.forEach(entry => {

    const user = state.users.find(u => Number(u.id) === Number(entry.user_id));

    const status = resolveEntryStatus(entry);

    const tr = document.createElement('tr');

    const actions = [`<button class="icon-btn ghost square" data-action="approve-entry" data-id="${entry.id}" title="Aprovar" aria-label="Aprovar lancamento">

        <span class="material-icons-outlined" aria-hidden="true">check_circle</span>

      </button>`,
      `<button class="icon-btn ghost square" data-action="reject-entry" data-id="${entry.id}" title="Recusar" aria-label="Recusar lancamento">

        <span class="material-icons-outlined" aria-hidden="true">block</span>

      </button>`,
      `<button class="icon-btn ghost square" data-action="support-entry" data-id="${entry.id}" title="Abrir atendimento" aria-label="Abrir atendimento">

        <span class="material-icons-outlined" aria-hidden="true">support_agent</span>

      </button>`];

    if (!entry.soft_deleted) {

      actions.push(`<button class="icon-btn ghost square" data-action="edit-entry" data-id="${entry.id}" title="Editar" aria-label="Editar lancamento">

        <span class="material-icons-outlined" aria-hidden="true">edit</span>

      </button>`);

      actions.push(`<button class="icon-btn ghost square danger" data-action="delete-entry" data-id="${entry.id}" title="Excluir" aria-label="Excluir lancamento">

        <span class="material-icons-outlined" aria-hidden="true">delete</span>

      </button>`);

    }

    tr.innerHTML = `<td>${formatDate(entry.date)}</td>

      <td>${escapeHtml(user?.name || 'Usuario')}</td>

      <td>${escapeHtml(entry.category || '')}</td>

      <td>${entry.type === 'in' ? 'Entrada' : 'Saida'}</td>

      <td class="text-right">${formatMoney(Number(entry.amount || 0))}</td>

      <td>${escapeHtml(entry.description || '')}</td>

      <td>${entry.attachment_path ? `<button class="icon-btn ghost square" data-action="view-attachment" data-attachment="${entry.attachment_path}" title="Ver anexo" aria-label="Ver anexo">
        <span class="material-icons-outlined" aria-hidden="true">image</span>
      </button>` : '<span class="muted tiny">-</span>'}</td>

      <td><span class="status-pill ${status.className}">${status.label}</span></td>

      <td><div class="inline-actions">${actions.join('')}</div></td>`;

    tbody.appendChild(tr);

  });

}


async function loadSupportMessages(threadId) {

  if (!threadId) return;

  state.supportActiveThreadId = Number(threadId);

  if (supportReplyAttachment) supportReplyAttachment.clear(true);

  const res = await api.get(`${API_BASE}/admin/support/messages?thread_id=${threadId}`);

  if (!res.ok) {

    ui.toast(res.error || 'Erro ao carregar mensagens');

    return;

  }

  state.supportMessages = res.data.messages || [];

  renderSupportMessages();

  await loadSupportThreads();

}


function renderSupportMessages() {

  const list = document.getElementById('support-chat');

  const empty = document.getElementById('support-chat-empty');

  const label = document.getElementById('support-active-user');

  if (!list) return;

  list.innerHTML = '';

  const active = state.supportThreads.find(t => Number(t.id) === Number(state.supportActiveThreadId));

  if (label) {

    label.textContent = active

      ? `${active.user_name || 'Usuario'} (${active.user_email || ''}) - ${active.subject || 'Atendimento'}`

      : 'Selecione um atendimento';

  }

  if (!state.supportActiveThreadId || !state.supportMessages.length) {

    if (empty) empty.hidden = !state.supportActiveThreadId;

    return;

  }

  if (empty) empty.hidden = true;

  state.supportMessages.forEach(msg => {

    const wrapper = document.createElement('div');

    const role = msg.sender_role === 'admin' ? 'from-admin' : 'from-user';

    wrapper.className = `support-message ${role}`;

    const when = msg.created_at ? formatDateTime(msg.created_at) : '';

    const attachment = msg.attachment_path

      ? `<div class="support-attachment" data-attachment="${msg.attachment_path}"></div>`

      : '';

    const message = escapeHtml(msg.message || '');

    wrapper.innerHTML = `${message ? `<div class="support-bubble">${message}</div>` : ''}

      ${attachment}

      ${when ? `<div class="support-meta">${when}</div>` : ''}`;

    list.appendChild(wrapper);

  });

  list.querySelectorAll('.support-attachment[data-attachment]').forEach(container => {

    renderAttachmentPreview(container, container.dataset.attachment);

  });

  list.scrollTop = list.scrollHeight;

}


async function submitSupportReply(e) {

  e.preventDefault();

  if (!state.supportActiveThreadId) return ui.toast('Selecione um atendimento');

  const message = (e.target.message?.value || '').trim();

  const hasFile = supportReplyAttachment?.getFile?.();

  if (!message && !hasFile) return ui.toast('Digite a resposta ou anexe um arquivo');

  const active = state.supportThreads.find(t => Number(t.id) === Number(state.supportActiveThreadId));

  const upload = await uploadSupportAttachment(supportReplyAttachment, active?.user_id);

  if (!upload.ok) return;

  const res = await api.post(`${API_BASE}/admin/support/messages`, {

    thread_id: state.supportActiveThreadId,

    message,

    attachment_path: upload.path || null,

  });

  if (res.ok) {

    e.target.reset();

    supportReplyAttachment.clear(true);

    await loadSupportMessages(state.supportActiveThreadId);

  } else {

    ui.toast(res.error || 'Erro ao enviar resposta');

  }

}


function handleSupportThreadClick(e) {

  const btn = e.target.closest('.support-thread-item');

  if (!btn) return;

  const threadId = Number(btn.dataset.threadId);

  if (!threadId) return;

  loadSupportMessages(threadId);

}

async function openSupportThreadFromEntry(entry) {

  if (!entry) return;

  const subject = `Lancamento #${entry.id}`;

  const res = await api.post(`${API_BASE}/admin/support/threads`, {

    user_id: entry.user_id,

    entry_id: entry.id,

    subject,

  });

  if (!res.ok) {

    ui.toast(res.error || 'Erro ao abrir atendimento');

    return;

  }

  const threadId = res.data?.id;

  if (!threadId) return;

  state.supportActiveThreadId = threadId;

  goToPanel('support');

  await loadSupportThreads();

  await loadSupportMessages(threadId);

}


async function submitSupportThread(e) {

  e.preventDefault();

  const userId = Number(document.getElementById('support-new-user')?.value || 0);

  const subject = (document.getElementById('support-new-subject')?.value || '').trim();

  if (!userId || !subject) return ui.toast('Selecione usuario e assunto');

  const res = await api.post(`${API_BASE}/admin/support/threads`, {

    user_id: userId,

    subject,

  });

  if (!res.ok) {

    ui.toast(res.error || 'Erro ao abrir atendimento');

    return;

  }

  e.target.reset();

  state.supportActiveThreadId = res.data?.id || null;

  await loadSupportThreads();

  if (state.supportActiveThreadId) {

    await loadSupportMessages(state.supportActiveThreadId);

  }

}


async function submitAdminClosureReport(e) {

  e.preventDefault();

  const month = document.getElementById('admin-closure-month')?.value || '';

  const userId = document.getElementById('admin-closure-user')?.value || '';

  if (!month || !userId) return ui.toast('Selecione mes e usuario');

  const params = new URLSearchParams();

  params.set('month', month);

  params.set('user_id', userId);

  const res = await api.get(`${API_BASE}/admin/reports/closure?${params.toString()}`);

  if (!res.ok) {

    ui.toast(res.error || 'Erro ao carregar relatorio');

    return;

  }

  state.closureReport = res.data;

  renderAdminClosureReport(res.data);

}


function renderAdminClosureReport(report) {

  const summary = document.getElementById('admin-closure-summary');

  const empty = document.getElementById('admin-closure-empty');

  const title = document.getElementById('admin-closure-title');

  const meta = document.getElementById('admin-closure-meta');

  const pendingSummary = document.getElementById('admin-closure-pending');

  if (!summary) return;

  if (!report) {

    summary.hidden = true;

    if (empty) empty.hidden = false;

    if (pendingSummary) pendingSummary.hidden = true;

    return;

  }

  if (empty) empty.hidden = true;

  summary.hidden = false;

  const userLabel = report.user ? ` - ${report.user.name || report.user.email || ''}` : '';

  if (title) title.textContent = `Fechamento ${formatMonthLabel(report.month) || report.month}${userLabel}`;

  const closedLabel = report.closed ? 'Fechado' : 'Aberto';

  const closedAt = report.closed_at ? ` em ${formatDate(report.closed_at)}` : '';

  if (meta) meta.textContent = `${closedLabel}${closedAt}`;

  const totalIn = Number(report.total_in || 0);

  const totalOut = Number(report.total_out || 0);

  const balance = Number(report.balance || 0);

  const count = Number(report.count || (report.entries || []).length || 0);

  const inEl = document.getElementById('admin-closure-in');

  const outEl = document.getElementById('admin-closure-out');

  const balEl = document.getElementById('admin-closure-balance');

  const countEl = document.getElementById('admin-closure-count');

  if (inEl) inEl.textContent = formatMoney(totalIn);

  if (outEl) outEl.textContent = formatMoney(totalOut);

  if (balEl) balEl.textContent = formatMoney(balance);

  if (countEl) countEl.textContent = String(count);

  if (pendingSummary) pendingSummary.hidden = false;

  const pendingIn = Number(report.pending_in || 0);

  const pendingOut = Number(report.pending_out || 0);

  const pendingBalance = Number(report.pending_balance || (pendingIn - pendingOut));

  const pendingCount = Number(report.pending_count || 0);

  const pendingInEl = document.getElementById('admin-closure-pending-in');

  const pendingOutEl = document.getElementById('admin-closure-pending-out');

  const pendingBalEl = document.getElementById('admin-closure-pending-balance');

  const pendingCountEl = document.getElementById('admin-closure-pending-count');

  if (pendingInEl) pendingInEl.textContent = formatMoney(pendingIn);

  if (pendingOutEl) pendingOutEl.textContent = formatMoney(pendingOut);

  if (pendingBalEl) pendingBalEl.textContent = formatMoney(pendingBalance);

  if (pendingCountEl) pendingCountEl.textContent = String(pendingCount);

}


async function exportAlterdata(e) {


  e.preventDefault();


  const month = document.getElementById('admin-export-month')?.value || '';


  const type = document.getElementById('admin-export-type')?.value || 'all';


  const userId = document.getElementById('admin-export-user')?.value || '';


  const params = new URLSearchParams();


  if (month) params.set('month', month);


  if (type) params.set('type', type);


  if (userId) params.set('user_id', userId);


  const url = `${API_BASE}/admin/export/alterdata?${params.toString()}`;

  const res = await fetch(url, { credentials: 'same-origin' }).catch(() => null);


  if (!res || !res.ok) {


    const data = await res?.json().catch(() => ({}));


    ui.toast(data?.error || 'Erro ao exportar');


    return;


  }


  const blob = await res.blob();


  const dl = document.createElement('a');


  const name = month ? `alterdata-${month}.txt` : 'alterdata.txt';


  dl.href = URL.createObjectURL(blob);


  dl.download = name;


  dl.click();


  URL.revokeObjectURL(dl.href);


}





function applyImpersonation() {


  const select = document.getElementById('admin-impersonate-user');


  if (!select) return;


  const value = Number(select.value || 0);


  if (value) {


    state.impersonateUserId = value;


    localStorage.setItem(STORAGE_IMPERSONATE, String(value));


  } else {


    state.impersonateUserId = null;


    localStorage.removeItem(STORAGE_IMPERSONATE);


  }


  updateImpersonationLabels();


  loadAdminEntries();


  loadPendingEntries();


}





function toggleArea(id, show) {


  const el = document.getElementById(id);


  if (el) el.hidden = !show;


}





function parseMoney(value) {


  const trimmed = String(value || '').trim();


  if (!trimmed) return null;


  let raw = trimmed;


  if (raw.includes(',')) {


    raw = raw.replace(/\./g, '').replace(',', '.');


  }


  raw = raw.replace(/[^\d.-]/g, '');


  const num = Number(raw);


  return Number.isFinite(num) && num > 0 ? num : null;


}





function formatMoney(value) {


  if (!Number.isFinite(value)) return 'R$ 0,00';


  return 'R$ ' + value.toFixed(2).replace('.', ',');


}





function formatMoneyPlain(value) {


  if (!Number.isFinite(value)) return '';


  return value.toFixed(2).replace('.', ',');


}





function formatDate(value) {


  if (!value) return '-';


  const parts = value.split('-');


  if (parts.length !== 3) return value;


  return `${parts[2]}/${parts[1]}/${parts[0]}`;


}





function formatDateTime(value) {


  if (!value) return '-';


  const d = new Date(value);


  if (Number.isNaN(d.getTime())) return value;


  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });


}





function escapeHtml(text) {


  const div = document.createElement('div');


  div.textContent = text ?? '';


  return div.innerHTML;


}


function setupSupportAttachmentPreviews() {

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

      const useCamera = window.confirm('Usar a camera? (Cancelar abre a galeria)');

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


async function uploadFile(file, userId = null) {

  const headers = {};

  let res = null;

  try {

    res = await fetch(`${API_BASE}/upload`, {

      method: 'POST',

      headers,
      credentials: 'same-origin',
      body: (() => {
        const f = new FormData();
        f.append('file', file);
        if (userId) f.append('user_id', userId);
        return f;
      })(),

    });

  } catch (err) {

    return { ok: false, error: 'Sem conexao' };

  }

  if (!res) return { ok: false, error: 'Sem conexao' };

  const text = await res.text();

  let data = {};

  try { data = JSON.parse(text || '{}'); } catch { data = {}; }

  if (!res.ok) {

    const errMsg = data.error || text || 'Erro no upload';

    return { ok: false, error: errMsg };

  }

  return { ok: true, data };

}


async function uploadSupportAttachment(controller, userId) {

  if (!controller) return { ok: true, path: null };

  const file = controller.getFile();

  if (!file) return { ok: true, path: null };

  controller.setUploading(true);

  const res = await uploadFile(file, userId).catch((err) => ({ ok: false, error: err?.message || 'Erro no upload' }));

  controller.setUploading(false);

  if (!res.ok) {

    ui.toast(res.error || 'Erro no upload');

    return { ok: false, path: null };

  }

  return { ok: true, path: res.data?.file || null };

}


async function fetchAttachmentUrl(relPath) {

  if (!relPath || !state.user) return null;

  if (attachmentCache.has(relPath)) return attachmentCache.get(relPath);

  const res = await fetch('/uploads/' + relPath.replace(/^\/+/, ''), { credentials: 'same-origin' }).catch(() => null);

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

    container.innerHTML = '<span class="muted tiny">Nao foi possivel carregar.</span>';

    return;

  }

  container.innerHTML = `<img src="${url}" alt="Anexo do suporte">

    <a class="support-attachment-link" href="${url}" download title="Baixar anexo" aria-label="Baixar anexo">Baixar</a>`;

}


async function openAttachment(relPath) {

  if (!relPath) return;

  const url = await fetchAttachmentUrl(relPath);

  if (!url) {

    ui.toast('Nao foi possivel carregar o anexo');

    return;

  }

  window.open(url, '_blank', 'noopener');

}





function redirectToLogin() {


  window.location.href = '/index.html';


}





function wireEvents() {


  bind('btn-admin-logout', 'click', logout);


  bind('btn-admin-refresh', 'click', async () => {


    await loadUsers();


    await loadCategories();


    await loadClosedMonths();


    await loadNotifications();


    await loadSupportThreads();


    await loadAdminEntries();


  });


  document.querySelectorAll('[data-admin-panel]').forEach(btn => {


    if (!btn.matches('button')) return;


    btn.addEventListener('click', () => goToPanel(btn.dataset.adminPanel));


  });


  bind('btn-new-user', 'click', () => toggleArea('user-form-area', true));


  bind('btn-new-category', 'click', () => toggleArea('category-form-area', true));


  bind('user-form', 'submit', submitUser);


  bind('category-form', 'submit', submitCategory);


  bind('admin-entry-form', 'submit', submitAdminEntry);


  bind('admin-entry-cancel', 'click', resetEntryForm);


  bind('admin-filter-type', 'change', loadAdminEntries);


  bind('admin-filter-start', 'change', loadAdminEntries);


  bind('admin-filter-end', 'change', loadAdminEntries);


  bind('admin-filter-deleted', 'change', renderEntriesTable);


  bind('admin-filter-refresh', 'click', loadAdminEntries);


  bind('admin-filter-reset', 'click', resetAdminFilters);


  bind('admin-filter-toggle', 'click', (e) => toggleFilterPanel('admin-filter-controls', e.currentTarget));


  bind('close-month-form', 'submit', closeMonth);


  bind('select-all-users', 'change', toggleSelectAllUsers);


  bind('admin-impersonate-user', 'change', applyImpersonation);


  bind('admin-entry-type', 'change', () => renderEntryCategoryOptions());


  bind('admin-export-form', 'submit', exportAlterdata);


  bind('support-new-form', 'submit', submitSupportThread);

  bind('support-reply-form', 'submit', submitSupportReply);


  bind('admin-closure-form', 'submit', submitAdminClosureReport);


  const usersTable = document.getElementById('users-table');


  if (usersTable) usersTable.addEventListener('click', handleUserAction);


  const categoriesTable = document.getElementById('categories-table');


  if (categoriesTable) categoriesTable.addEventListener('click', handleCategoryAction);


  const entriesTable = document.getElementById('admin-entries-table');


  if (entriesTable) entriesTable.addEventListener('click', handleEntryAction);


  const approvalsTable = document.getElementById('admin-approvals-table');


  if (approvalsTable) approvalsTable.addEventListener('click', handleApprovalAction);


  const supportThreads = document.getElementById('support-thread-list');


  if (supportThreads) supportThreads.addEventListener('click', handleSupportThreadClick);


  const notifTable = document.getElementById('admin-notifications-table');


  if (notifTable) notifTable.addEventListener('click', handleNotificationAction);

  setupSupportAttachmentPreviews();

  enhanceAdminSelects();


}





async function init() {


  wireEvents();


  setDefaultMonths();


  const ok = await ensureSession();
  if (!ok) redirectToLogin();


}





init();


