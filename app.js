(() => {
  'use strict';

  // ---- Checklist data (from the Westminster Woods overnight packing list) ----
  const SECTIONS = [
    {
      id: 'gear', title: 'Gear', icon: 'pack',
      items: [
        'Reusable water bottle',
        'Backpack',
        'Sleeping bag',
        'Pillow',
        'Towel',
        ['Dirty clothes bag', 'Trash bags work well'],
      ],
    },
    {
      id: 'clothing', title: 'Clothing', icon: 'shirt',
      items: [
        '2 pairs of closed-toed shoes',
        'Flip-flops for shower',
        'Swimsuit for shower',
        'Pajamas',
        ['Socks', '1 pair per day'],
        ['Underwear', '1 per day'],
        ['Long pants', '2–4'],
        ['Short sleeved shirts', '2–4'],
        ['Long sleeved shirts', '2–4'],
        'Sweatshirt',
        'Warm jacket',
        ['Hats', '1 for sun and 1 for cold'],
        ['Rain gear', 'Rain jacket, waterproof pants, or poncho'],
      ],
    },
    {
      id: 'medication', title: 'Medication', icon: 'med',
      items: [
        ['All necessary medications', 'Including Epi-Pens and inhalers'],
      ],
    },
    {
      id: 'food', title: 'Food', icon: 'food',
      note: 'Westminster Woods provides meals beginning with dinner on the first day. ' +
            'Participants with special dietary needs, please refer to the Dietary Letter.',
      items: ['Sack lunch for the first day'],
    },
    {
      id: 'toiletries', title: 'Toiletries', icon: 'drop',
      items: [
        'Sunscreen', 'Toothbrush', 'Toothpaste', 'Deodorant',
        'Soap', 'Shampoo', 'Comb or brush', 'Hand sanitizer',
      ],
    },
    {
      id: 'extras', title: 'Optional Extras', icon: 'star', optional: true,
      items: [
        'Book', ['Bug repellent', 'Non-DEET'], 'Binoculars', 'Chapstick',
        'Disposable camera', 'Flashlight', 'Gloves', 'Wrist watch',
      ],
    },
    {
      id: 'dontbring', title: 'Do Not Bring', icon: 'no', leave: true,
      note: 'Check each one off once you\'ve made sure it stays home.',
      items: [
        'Cell phones',
        ['Electronics of any kind', 'Tablets, music players, or video games'],
        ['Additional snacks', 'Gum, sodas, or candy'],
        ['Scented products', 'Perfume, cologne, or body sprays'],
      ],
    },
  ];

  const ICONS = {
    pack: '<path d="M8 7V5a4 4 0 0 1 8 0v2"/><rect x="5" y="7" width="14" height="14" rx="3"/><path d="M9 14h6v3H9z"/>',
    shirt: '<path d="M8 3 4 6l2 4 2-1v12h8V9l2 1 2-4-4-3c-.5 1.5-2 2.5-4 2.5S8.5 4.5 8 3z"/>',
    med: '<rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-35 12 12)"/><path d="m9.2 8 5.6 8"/>',
    food: '<path d="M12 7c-1-3-4-3-5-2M12 7c3-2 7 0 7 5s-3 9-7 9-7-4-7-9 4-7 7-5z"/>',
    drop: '<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    no: '<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>',
  };

  // ---- State ----
  const KEY = 'intothewoods:v1';
  const load = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
  };
  const state = Object.assign({ checked: {}, custom: {}, collapsed: {}, hidePacked: false, camper: '' }, load());
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
  };

  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const itemsFor = (sec) => [
    ...sec.items.map((it) => {
      const [label, hint] = Array.isArray(it) ? it : [it, ''];
      return { id: `${sec.id}/${slug(label)}`, label, hint };
    }),
    ...(state.custom[sec.id] || []).map((c) => ({ id: c.id, label: c.label, hint: '', custom: true })),
  ];

  // ---- Rendering ----
  const $ = (s, el = document) => el.querySelector(s);
  const root = $('#sections');
  const tpl = $('#sectionTpl');
  let wasComplete = null;

  function render() {
    root.textContent = '';
    for (const sec of SECTIONS) root.appendChild(renderSection(sec));
    document.body.classList.toggle('hide-packed', state.hidePacked);
    updateProgress();
  }

  function renderSection(sec) {
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.dataset.id = sec.id;
    if (sec.leave) node.classList.add('leave');
    if (sec.optional) node.classList.add('optional');
    if (state.collapsed[sec.id]) node.classList.add('collapsed');

    const head = $('.section-head', node);
    head.setAttribute('aria-expanded', String(!state.collapsed[sec.id]));
    $('.section-icon', node).innerHTML =
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[sec.icon]}</svg>`;
    $('.section-title', node).textContent = sec.title;
    head.addEventListener('click', () => {
      state.collapsed[sec.id] = !state.collapsed[sec.id];
      node.classList.toggle('collapsed', state.collapsed[sec.id]);
      head.setAttribute('aria-expanded', String(!state.collapsed[sec.id]));
      save();
    });

    if (sec.note) {
      const note = $('.section-note', node);
      note.textContent = sec.note;
      note.hidden = false;
    }

    const ul = $('.items', node);
    for (const item of itemsFor(sec)) ul.appendChild(renderItem(sec, item));

    const form = $('.add-item', node);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('input', form);
      const label = input.value.trim();
      if (!label) return;
      const item = { id: `${sec.id}/custom-${Date.now().toString(36)}`, label };
      (state.custom[sec.id] ||= []).push(item);
      save();
      ul.appendChild(renderItem(sec, { ...item, hint: '', custom: true }));
      input.value = '';
      updateProgress();
    });

    return node;
  }

  function renderItem(sec, item) {
    const li = document.createElement('li');
    li.className = 'item';
    li.dataset.id = item.id;
    const checked = !!state.checked[item.id];
    li.classList.toggle('done', checked);

    const label = document.createElement('label');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = checked;
    cb.addEventListener('change', () => {
      if (cb.checked) state.checked[item.id] = true; else delete state.checked[item.id];
      li.classList.toggle('done', cb.checked);
      if (cb.checked && navigator.vibrate) navigator.vibrate(8);
      save();
      updateProgress();
    });

    const box = document.createElement('span');
    box.className = 'box';
    box.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.className = 'text';
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = item.label;
    text.appendChild(name);
    if (item.hint) {
      const hint = document.createElement('small');
      hint.textContent = item.hint;
      text.appendChild(hint);
    }
    if (sec.leave) {
      const tag = document.createElement('em');
      tag.className = 'tag';
      tag.textContent = 'left at home';
      text.appendChild(tag);
    }

    label.append(cb, box, text);
    li.appendChild(label);

    if (item.custom) {
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'del';
      del.setAttribute('aria-label', `Remove ${item.label}`);
      del.textContent = '×';
      del.addEventListener('click', () => {
        state.custom[sec.id] = (state.custom[sec.id] || []).filter((c) => c.id !== item.id);
        delete state.checked[item.id];
        save();
        li.remove();
        updateProgress();
      });
      li.appendChild(del);
    }
    return li;
  }

  function updateProgress() {
    let total = 0, done = 0;
    for (const sec of SECTIONS) {
      const items = itemsFor(sec);
      const d = items.filter((i) => state.checked[i.id]).length;
      const el = root.querySelector(`.section[data-id="${sec.id}"]`);
      if (el) {
        $('.section-count', el).textContent = `${d}/${items.length}`;
        el.classList.toggle('complete', items.length > 0 && d === items.length);
      }
      if (sec.optional) continue; // optional extras don't count toward "all packed"
      total += items.length;
      done += d;
    }
    const pct = total ? Math.round((done / total) * 100) : 0;
    $('#pct').textContent = pct;
    document.documentElement.style.setProperty('--pct', pct);
    const left = total - done;
    $('#progressLabel').textContent =
      left === 0 ? 'Ready for the redwoods!' :
      done === 0 ? "Let's get packing" :
      `${left} thing${left === 1 ? '' : 's'} to go`;

    const complete = left === 0;
    if (wasComplete === false && complete) $('#celebrate').hidden = false;
    wasComplete = complete;
  }

  // ---- Controls ----
  const camper = $('#camper');
  camper.value = state.camper || '';
  camper.addEventListener('input', () => { state.camper = camper.value; save(); });

  const hide = $('#hidePacked');
  hide.checked = state.hidePacked;
  hide.addEventListener('change', () => {
    state.hidePacked = hide.checked;
    document.body.classList.toggle('hide-packed', hide.checked);
    save();
  });

  $('#resetBtn').addEventListener('click', () => {
    if (!confirm('Uncheck everything and start a fresh packing list? Your own added items will stay.')) return;
    state.checked = {};
    save();
    wasComplete = null;
    render();
  });

  $('#celebrateClose').addEventListener('click', () => { $('#celebrate').hidden = true; });
  $('#celebrate').addEventListener('click', (e) => {
    if (e.target.id === 'celebrate') e.currentTarget.hidden = true;
  });

  render();

  // ---- Offline support ----
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
})();
