import { esc, store, buzz } from '../ui.js';
import { FIELD, LNT } from '../data/field.js';

export default {
  render(el) {
    const seen = new Set(store.get('itw:seen', []));
    const draw = () => {
      el.innerHTML = `
        <div class="page">
          <div class="intro-card">
            <h2>Forest field guide</h2>
            <p>What lives in a redwood forest? Tap <b>"I spotted it!"</b> as your cabin finds each one.</p>
            <div class="spotted"><b>${seen.size}</b> / ${FIELD.length} spotted ${seen.size === FIELD.length ? '🏅 Naturalist!' : ''}</div>
          </div>
          ${FIELD.map((f, i) => `
            <article class="card field ${seen.has(i) ? 'seen' : ''}">
              <header><span class="field-ic" aria-hidden="true">${f.icon}</span><div><h3>${esc(f.name)}</h3><i class="muted small">${esc(f.sci)}</i></div></header>
              <ul class="bullets">${f.facts.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
              <p class="find"><b>Find it:</b> ${esc(f.find)}</p>
              <button class="btn small ${seen.has(i) ? 'ghost-dark' : ''}" type="button" data-i="${i}">${seen.has(i) ? '✓ Spotted' : 'I spotted it!'}</button>
            </article>`).join('')}
          <section class="card">
            <h2>Leave No Trace</h2>
            <ol class="steps">${LNT.map((p) => `<li><span>${esc(p)}</span></li>`).join('')}</ol>
          </section>
        </div>`;
      el.querySelectorAll('[data-i]').forEach((b) => b.addEventListener('click', () => {
        const i = Number(b.dataset.i);
        if (seen.has(i)) seen.delete(i); else { seen.add(i); buzz(20); }
        store.set('itw:seen', [...seen]);
        const y = window.scrollY; draw(); window.scrollTo(0, y);
      }));
    };
    draw();
  },
};
