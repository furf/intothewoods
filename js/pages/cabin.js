import { esc, icon, store, shareOrCopy, buzz } from '../ui.js';

const KEY = 'itw:cabin';
const STEPS = [
  'Sit in a circle so everyone can see each other. Bring the energy down to conversation level.',
  'Go around and share names if anyone doesn\'t know each other yet.',
  'Explain why: "This cabin is our home this week, and we want everyone to feel safe here."',
  'Each person shares something to bring to the cabin (kindness, curiosity…) or leave behind (drama, negativity…).',
  'Frame it positively: "walk," not "don\'t run." Pass a stuffed animal as a talking piece.',
  'Thumbs up from everyone? Add it!',
  'Everyone signs the agreement. Hang it up and point out when people follow it.',
];

export default {
  render(el) {
    const st = Object.assign({ number: '', bring: [], leave: [], names: [] }, store.get(KEY, {}));
    const save = () => store.set(KEY, st);

    const draw = () => {
      el.innerHTML = `
        <div class="page">
          <div class="intro-card">
            <h2>Cabin community guidelines</h2>
            <p>Do this at your first Cabin Time. It sets the tone for the whole trip.</p>
            <label class="cabin-no">Cabin # <input inputmode="numeric" maxlength="4" value="${esc(st.number)}" placeholder="__"></label>
          </div>

          <div class="rings" aria-label="Cabin agreement">
            <div class="ring-outer">
              <span class="ring-label">What we want to leave behind</span>
              <div class="chips">${st.leave.map((t, i) => `<button class="chip leave" type="button" data-rm="leave:${i}" aria-label="Remove ${esc(t)}">${esc(t)} ×</button>`).join('')}</div>
              <div class="ring-inner">
                <span class="ring-label">What we want to bring to camp</span>
                <div class="chips">${st.bring.map((t, i) => `<button class="chip bring" type="button" data-rm="bring:${i}" aria-label="Remove ${esc(t)}">${esc(t)} ×</button>`).join('')}</div>
              </div>
            </div>
          </div>

          <form class="card add-two" id="addForm">
            <input name="text" placeholder="e.g. kindness, or drama" maxlength="40" autocomplete="off" aria-label="Guideline">
            <div class="btn-row">
              <button class="btn" type="submit" name="to" value="bring">${icon('plus')} Bring</button>
              <button class="btn warn" type="submit" name="to" value="leave">${icon('plus')} Leave behind</button>
            </div>
          </form>

          <section class="card">
            <h2>Signed by</h2>
            <div class="chips">${st.names.map((n, i) => `<button class="chip sig" type="button" data-rm="names:${i}" aria-label="Remove ${esc(n)}">✍️ ${esc(n)}</button>`).join('') || '<span class="muted small">No signatures yet</span>'}</div>
            <form class="inline-form" id="signForm"><input name="n" placeholder="Name" maxlength="30" autocomplete="off" aria-label="Name"><button class="btn small" type="submit">Sign</button></form>
          </section>

          <div class="btn-row">
            <button class="btn" type="button" id="share">${icon('share')} Share / copy</button>
            <button class="btn ghost" type="button" id="reset">Start over</button>
          </div>

          <details class="acc">
            <summary><span>How to lead it</span><span class="chev" aria-hidden="true"></span></summary>
            <div class="acc-body"><ol class="steps">${STEPS.map((s) => `<li><span>${esc(s)}</span></li>`).join('')}</ol></div>
          </details>
        </div>`;

      el.querySelector('.cabin-no input').addEventListener('input', (e) => { st.number = e.target.value; save(); });
      el.querySelectorAll('[data-rm]').forEach((b) => b.addEventListener('click', () => {
        const [k, i] = b.dataset.rm.split(':'); st[k].splice(Number(i), 1); save(); draw();
      }));
      el.querySelector('#addForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const t = e.currentTarget.text.value.trim();
        const to = e.submitter?.value || 'bring';
        if (!t) return;
        st[to].push(t); save(); buzz(); draw();
        el.querySelector('#addForm input').focus();
      });
      el.querySelector('#signForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const n = e.currentTarget.n.value.trim();
        if (!n) return;
        st.names.push(n); save(); buzz(); draw();
      });
      el.querySelector('#share').addEventListener('click', () => shareOrCopy({
        title: `Cabin ${st.number} guidelines`,
        text: `Cabin ${st.number || '?'} Community Guidelines\n\nWe bring: ${st.bring.join(', ') || '-'}\nWe leave behind: ${st.leave.join(', ') || '-'}\n\nSigned: ${st.names.join(', ') || '-'}`,
      }));
      el.querySelector('#reset').addEventListener('click', () => {
        if (!confirm('Clear this cabin agreement?')) return;
        Object.assign(st, { number: '', bring: [], leave: [], names: [] }); save(); draw();
      });
    };
    draw();
  },
};
