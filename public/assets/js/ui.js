const ui = {
  show(el) { el.hidden = false; },
  hide(el) { el.hidden = true; },
  toast(message, ms = 2200) {
    const t = document.getElementById('toast');
    t.textContent = message;
    t.hidden = false;
    setTimeout(() => t.hidden = true, ms);
  },
  enhanceSelect(selectOrId, options = {}) {
    const select = typeof selectOrId === 'string'
      ? document.getElementById(selectOrId)
      : selectOrId;
    if (!select) return;
    if (select._enhanceCleanup) {
      select._enhanceCleanup();
      select._enhanceCleanup = null;
    }
    const existing = select.nextElementSibling;
    if (existing && existing.classList.contains('select-shell')) existing.remove();

    select.classList.add('visually-hidden');

    const wrapper = document.createElement('div');
    wrapper.className = 'select-shell';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'select-trigger';

    const list = document.createElement('div');
    list.className = 'select-options';

    const search = document.createElement('input');
    search.type = 'search';
    search.className = 'select-search';
    search.placeholder = options.searchPlaceholder || 'Buscar...';
    search.setAttribute('aria-label', options.searchAriaLabel || 'Buscar');
    search.autocomplete = 'off';
    search.spellcheck = false;

    const empty = document.createElement('div');
    empty.className = 'select-empty';
    empty.textContent = options.emptyLabel || 'Sem resultados';
    empty.hidden = true;

    const updateTrigger = () => {
      const selected = select.options[select.selectedIndex];
      trigger.textContent = selected?.text || '';
      trigger.disabled = select.disabled;
      wrapper.classList.toggle('is-disabled', select.disabled);
    };

    const build = () => {
      list.innerHTML = '';
      list.appendChild(search);
      list.appendChild(empty);
      Array.from(select.options).forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = opt.text;
        btn.dataset.value = opt.value;
        btn.className = opt.selected ? 'active' : '';
        btn.addEventListener('click', () => {
          select.value = opt.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          updateTrigger();
          list.querySelectorAll('button').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          list.classList.remove('open');
        });
        list.appendChild(btn);
      });
      updateTrigger();
      filterOptions();
    };

    const filterOptions = () => {
      const query = (search.value || '').trim().toLowerCase();
      let visible = 0;
      list.querySelectorAll('button').forEach(btn => {
        const text = btn.textContent.toLowerCase();
        const show = !query || text.includes(query);
        btn.hidden = !show;
        if (show) visible += 1;
      });
      empty.hidden = visible > 0;
    };

    const openList = () => {
      if (select.disabled) return;
      list.classList.add('open');
      search.value = '';
      filterOptions();
      setTimeout(() => search.focus(), 0);
    };

    const toggleList = () => {
      if (list.classList.contains('open')) {
        list.classList.remove('open');
      } else {
        openList();
      }
    };

    const handleOutside = (e) => {
      if (!wrapper.contains(e.target)) list.classList.remove('open');
    };

    const handleKeydown = (e) => {
      if (e.key === 'Escape') list.classList.remove('open');
    };

    const handleChange = () => {
      updateTrigger();
      list.querySelectorAll('button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.value === select.value);
      });
    };

    trigger.addEventListener('click', toggleList);
    search.addEventListener('input', filterOptions);
    document.addEventListener('click', handleOutside);
    document.addEventListener('keydown', handleKeydown);
    select.addEventListener('change', handleChange);

    build();
    wrapper.appendChild(trigger);
    wrapper.appendChild(list);
    select.insertAdjacentElement('afterend', wrapper);

    select._enhanceCleanup = () => {
      document.removeEventListener('click', handleOutside);
      document.removeEventListener('keydown', handleKeydown);
      select.removeEventListener('change', handleChange);
    };
  },
  enhanceSelects(root = document) {
    root.querySelectorAll('select').forEach(select => ui.enhanceSelect(select));
  }
};
