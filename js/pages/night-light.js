import { store, wakeLock } from '../ui.js';

const COLORS = [
  ['red', '#ff2a14', 'Red: keeps night vision'],
  ['amber', '#ffae2b', 'Amber: cozy'],
  ['white', '#fff8ec', 'White: brightest'],
];

export default {
  render(el) {
    const st = Object.assign({ color: 'red', level: 0.6 }, store.get('itw:light', {}));
    el.innerHTML = `
      <div class="nightlight" id="nl">
        <div class="nl-glow"></div>
        <div class="nl-controls">
          <div class="nl-swatches">${COLORS.map(([id, c, t]) => `<button type="button" data-c="${id}" style="--sw:${c}" aria-label="${t}"></button>`).join('')}</div>
          <label class="nl-slider"><span>Brightness</span><input type="range" min="0.08" max="1" step="0.01" value="${st.level}"></label>
          <p>The screen stays awake while this is open. Tap anywhere to hide the controls.</p>
          <a class="btn ghost" href="#/guide">Done</a>
        </div>
      </div>`;
    const nl = el.querySelector('#nl');
    const apply = () => {
      const c = COLORS.find((x) => x[0] === st.color) || COLORS[0];
      nl.style.setProperty('--nl', c[1]);
      nl.style.setProperty('--lvl', st.level);
      nl.querySelectorAll('[data-c]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.c === st.color)));
      store.set('itw:light', st);
    };
    nl.addEventListener('click', (e) => {
      const sw = e.target.closest('[data-c]');
      if (sw) { st.color = sw.dataset.c; apply(); return; }
      if (e.target.closest('.nl-controls')) return;
      nl.classList.toggle('hide-ui');
    });
    nl.querySelector('input').addEventListener('input', (e) => { st.level = Number(e.target.value); apply(); });
    apply();
    const meta = document.querySelector('meta[name="theme-color"]');
    const prev = meta.content;
    meta.content = '#000000';
    const release = wakeLock();
    return () => { release(); meta.content = prev; };
  },
};
