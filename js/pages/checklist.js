import { esc, icon, store, buzz, $, $$ } from '../ui.js';
import { STUDENT, CHAPERONE } from '../data/packing.js';

// Storage key for the student list is kept from v1 so earlier progress survives the upgrade.
const LISTS = {
  student: { key: 'intothewoods:v1', title: 'Student', sections: STUDENT },
  chaperone: { key: 'intothewoods:chaperone', title: 'Chaperone', sections: CHAPERONE },
};
const blank = () => ({ checked: {}, custom: {}, collapsed: {}, hidePacked: false, camper: '' });
const load = (k) => Object.assign(blank(), store.get(LISTS[k].key, {}));

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const itemsFor = (sec, st) => [
  ...sec.items.map((it) => {
    const [label, hint] = Array.isArray(it) ? it : [it, ''];
    return { id: `${sec.id}/${slug(label)}`, label, hint };
  }),
  ...(st.custom[sec.id] || []).map((c) => ({ ...c, hint: '', custom: true })),
];

function tally(k) {
  const st = load(k);
  let total = 0, done = 0;
  for (const sec of LISTS[k].sections) {
    if (sec.optional) continue;
    const items = itemsFor(sec, st);
    total += items.length;
    done += items.filter((i) => st.checked[i.id]).length;
  }
  return { total, done };
}

export function updatePackBadge() {
  const { total, done } = tally('student');
  const left = total - done;
  const b = document.getElementById('packBadge');
  if (b) { b.hidden = left === 0 || done === 0; b.textContent = left; }
  try { if (left === 0) navigator.clearAppBadge?.(); else if (done > 0) navigator.setAppBadge?.(left); } catch { /* unsupported */ }
}

export default {
  render(el, { params }) {
    let which = params.get('list') === 'chaperone' ? 'chaperone' : store.get('itw:packTab', 'student');
    el.innerHTML = `
      <div class="page">
        <div class="seg two" role="group" aria-label="Which list">
          <button type="button" data-list="student"><b>Student</b><small>Camp packing list</small></button>
          <button type="button" data-list="chaperone"><b>Chaperone</b><small>For grown-ups</small></button>
        </div>
        <div id="list"></div>
      </div>
      <div id="celebrate" class="celebrate" hidden>
        <div class="celebrate-card">
          <img src="img/trees.webp" alt="" width="110" height="125">
          <h2>All packed!</h2>
          <p>See you under the redwoods.</p>
          <button class="btn" type="button" id="celebrateClose">Yay!</button>
        </div>
      </div>`;

    const listEl = $('#list', el);
    const cel = $('#celebrate', el);
    $('#celebrateClose', el).onclick = () => { cel.hidden = true; };
    cel.onclick = (e) => { if (e.target === cel) cel.hidden = true; };

    const draw = () => {
      store.set('itw:packTab', which);
      $$('.seg button', el).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.list === which)));
      renderList(listEl, which, () => { cel.hidden = false; });
    };
    $('.seg', el).addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (b && b.dataset.list !== which) { which = b.dataset.list; draw(); }
    });
    draw();
  },
};

function renderList(root, which, onComplete) {
  const cfg = LISTS[which];
  const st = load(which);
  const save = () => { store.set(cfg.key, st); updatePackBadge(); };
  let wasComplete = null;

  root.innerHTML = `
    <div class="progress-card">
      <div class="ring" role="img" aria-label="Packing progress">
        <svg viewBox="0 0 120 120" aria-hidden="true"><circle class="ring-track" cx="60" cy="60" r="52"/><circle class="ring-fill" cx="60" cy="60" r="52" pathLength="100"/></svg>
        <img src="img/trees.webp" alt="" width="46" height="52">
      </div>
      <div class="progress-text">
        <div class="pct"><span class="pctn">0</span>%</div>
        <div class="progress-label">Let's get packing</div>
        ${which === 'student' ? `<label class="camper"><span>Camper</span><input type="text" placeholder="Name" autocomplete="off" maxlength="40" value="${esc(st.camper)}"></label>` : '<p class="muted small">Your own bag. The cabin of 8–10 kids is the fun part.</p>'}
      </div>
    </div>
    <div class="toolbar">
      <label class="toggle"><input type="checkbox" class="hideP" ${st.hidePacked ? 'checked' : ''}><span class="switch" aria-hidden="true"></span>Hide packed</label>
      <button class="btn ghost small reset" type="button">Start over</button>
    </div>
    <div class="sections"></div>`;

  const secRoot = $('.sections', root);
  root.classList.toggle('hide-packed', st.hidePacked);

  const update = () => {
    let total = 0, done = 0;
    for (const sec of cfg.sections) {
      const items = itemsFor(sec, st);
      const d = items.filter((i) => st.checked[i.id]).length;
      const s = secRoot.querySelector(`[data-id="${sec.id}"]`);
      if (s) { $('.section-count', s).textContent = `${d}/${items.length}`; s.classList.toggle('complete', items.length > 0 && d === items.length); }
      if (sec.optional) continue;
      total += items.length; done += d;
    }
    const pct = total ? Math.round((done / total) * 100) : 0;
    $('.pctn', root).textContent = pct;
    root.style.setProperty('--pct', pct);
    const left = total - done;
    $('.progress-label', root).textContent = left === 0 ? 'Ready for the redwoods!' : done === 0 ? 'Let\'s get packing' : `${left} thing${left === 1 ? '' : 's'} to go`;
    if (wasComplete === false && left === 0) onComplete();
    wasComplete = left === 0;
  };

  const itemEl = (sec, item) => {
    const li = document.createElement('li');
    li.className = 'item' + (st.checked[item.id] ? ' done' : '');
    li.innerHTML = `<label><input type="checkbox" ${st.checked[item.id] ? 'checked' : ''}><span class="box" aria-hidden="true"></span>
      <span class="text"><span class="name">${esc(item.label)}</span>${item.hint ? `<small>${esc(item.hint)}</small>` : ''}${sec.leave ? '<em class="tag">left at home</em>' : ''}</span></label>
      ${item.custom ? `<button type="button" class="del" aria-label="Remove ${esc(item.label)}">×</button>` : ''}`;
    $('input', li).addEventListener('change', (e) => {
      if (e.target.checked) { st.checked[item.id] = true; buzz(); } else delete st.checked[item.id];
      li.classList.toggle('done', e.target.checked);
      save(); update();
    });
    $('.del', li)?.addEventListener('click', () => {
      st.custom[sec.id] = (st.custom[sec.id] || []).filter((c) => c.id !== item.id);
      delete st.checked[item.id];
      save(); li.remove(); update();
    });
    return li;
  };

  for (const sec of cfg.sections) {
    const s = document.createElement('section');
    s.className = 'section' + (sec.leave ? ' leave' : '') + (sec.optional ? ' optional' : '') + (st.collapsed[sec.id] ? ' collapsed' : '');
    s.dataset.id = sec.id;
    s.innerHTML = `
      <button class="section-head" type="button" aria-expanded="${!st.collapsed[sec.id]}">
        <span class="section-icon">${icon(sec.icon)}</span>
        <span class="section-title">${esc(sec.title)}</span>
        <span class="section-count"></span><span class="chev" aria-hidden="true"></span>
      </button>
      <div class="section-body">
        ${sec.note ? `<p class="section-note">${esc(sec.note)}</p>` : ''}
        <ul class="items"></ul>
        <button class="add-toggle" type="button" aria-expanded="false">${icon('plus')} Add your own</button>
        <form class="add-item" hidden><input type="text" placeholder="Item name" maxlength="80" enterkeyhint="done" aria-label="Add your own item to ${esc(sec.title)}"><button class="btn small" type="submit">Add</button></form>
      </div>`;
    const ul = $('.items', s);
    itemsFor(sec, st).forEach((it) => ul.appendChild(itemEl(sec, it)));
    $('.section-head', s).addEventListener('click', (e) => {
      st.collapsed[sec.id] = !st.collapsed[sec.id];
      s.classList.toggle('collapsed', st.collapsed[sec.id]);
      e.currentTarget.setAttribute('aria-expanded', String(!st.collapsed[sec.id]));
      save();
    });
    const addBtn = $('.add-toggle', s), addForm = $('form', s);
    addBtn.addEventListener('click', () => {
      addBtn.hidden = true; addBtn.setAttribute('aria-expanded', 'true');
      addForm.hidden = false; $('input', addForm).focus();
    });
    // Collapse back to the quiet link when the field is left empty.
    $('input', addForm).addEventListener('blur', (e) => {
      setTimeout(() => { if (!e.target.value.trim() && !addForm.contains(document.activeElement)) { addForm.hidden = true; addBtn.hidden = false; addBtn.setAttribute('aria-expanded', 'false'); } }, 150);
    });
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('input', e.currentTarget);
      const label = input.value.trim();
      if (!label) return;
      const item = { id: `${sec.id}/custom-${Date.now().toString(36)}`, label };
      (st.custom[sec.id] ||= []).push(item);
      save();
      ul.appendChild(itemEl(sec, { ...item, hint: '', custom: true }));
      input.value = '';
      update();
    });
    secRoot.appendChild(s);
  }

  $('.camper input', root)?.addEventListener('input', (e) => { st.camper = e.target.value; save(); });
  $('.hideP', root).addEventListener('change', (e) => { st.hidePacked = e.target.checked; root.classList.toggle('hide-packed', st.hidePacked); save(); });
  $('.reset', root).addEventListener('click', () => {
    if (!confirm('Uncheck everything on this list? Items you added will stay.')) return;
    st.checked = {}; save(); renderList(root, which, onComplete);
  });
  update();
}
