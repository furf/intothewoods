import { esc, icon, store, buzz, $, $$ } from '../ui.js';
import { RIDDLES, GAMES, QUESTIONS } from '../data/games.js';

const TABS = [['riddles', 'Riddles'], ['games', 'Games'], ['questions', 'Questions']];

function shuffle(a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
}

export default {
  render(el, { params }) {
    let tab = params.get('t') || store.get('itw:gamesTab', 'riddles');
    el.innerHTML = `
      <div class="page">
        <div class="seg three" role="group" aria-label="Activity type">${TABS.map(([id, t]) => `<button type="button" data-t="${id}"><b>${t}</b></button>`).join('')}</div>
        <div id="gview"></div>
      </div>`;
    const v = $('#gview', el);

    const views = {
      riddles() {
        const solved = new Set(store.get('itw:solved', []));
        v.innerHTML = `
          <p class="lead">Tap a card to reveal the answer. Great for trail walks and the dinner line.</p>
          <div class="toolbar">
            <label class="toggle"><input type="checkbox" id="showAll"><span class="switch" aria-hidden="true"></span>Show all answers</label>
            <span class="muted small" id="solvedCount"></span>
          </div>
          <div class="riddles">${RIDDLES.map(([q, a], i) => `
            <button class="riddle" type="button" data-i="${i}" aria-pressed="false">
              <span class="riddle-n">#${i + 1}</span>
              <span class="riddle-q">${esc(q)}</span>
              <span class="riddle-a"><b>Answer:</b> ${esc(a)}</span>
            </button>`).join('')}</div>`;
        const cards = $$('.riddle', v);
        const showAll = $('#showAll', v);
        // Cards and the switch stay in step: the switch is on only when every answer is showing.
        const sync = () => {
          cards.forEach((c, i) => { const on = solved.has(i); c.classList.toggle('flipped', on); c.setAttribute('aria-pressed', String(on)); });
          showAll.checked = solved.size === RIDDLES.length;
          $('#solvedCount', v).textContent = `${solved.size} of ${RIDDLES.length} revealed`;
          store.set('itw:solved', [...solved]);
        };
        sync();
        cards.forEach((c, i) => c.addEventListener('click', () => {
          if (solved.has(i)) solved.delete(i); else { solved.add(i); buzz(); }
          sync();
        }));
        showAll.addEventListener('change', () => {
          solved.clear();
          if (showAll.checked) RIDDLES.forEach((_, i) => solved.add(i));
          sync();
        });
      },
      games() {
        v.innerHTML = `
          <button class="btn wide" type="button" id="pick">${icon('shuffle')} Pick a game for us</button>
          <div class="games">${GAMES.map((g, i) => `
            <article class="game card" data-i="${i}">
              <h3>${esc(g.name)}</h3>
              <div class="chips">
                <span class="chip">${esc(g.players)} players</span><span class="chip">${esc(g.where)}</span><span class="chip">${esc(g.energy)} energy</span>
              </div>
              <p>${esc(g.how)}</p>
            </article>`).join('')}</div>`;
        $('#pick', v).addEventListener('click', () => {
          const cards = $$('.game', v);
          cards.forEach((c) => c.classList.remove('picked'));
          const c = cards[Math.floor(Math.random() * cards.length)];
          c.classList.add('picked'); buzz(20);
          c.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      },
      questions() {
        let deck = shuffle(QUESTIONS), i = 0;
        v.innerHTML = `
          <p class="lead">From the handbook: a captivating question is a great way to redirect energy. Use them at meals, on the trail, or at bedtime.</p>
          <div class="qcard" aria-live="polite"><span class="q-mark" aria-hidden="true">?</span><p id="qtext"></p><small id="qn"></small></div>
          <div class="btn-row center"><button class="btn" type="button" id="nextQ">Next question</button></div>`;
        const show = () => { $('#qtext', v).textContent = deck[i]; $('#qn', v).textContent = `${i + 1} / ${deck.length}`; };
        $('#nextQ', v).addEventListener('click', () => {
          i++; if (i >= deck.length) { deck = shuffle(QUESTIONS); i = 0; }
          buzz(); show();
          const q = $('.qcard', v); q.classList.remove('pop'); void q.offsetWidth; q.classList.add('pop');
        });
        show();
      },
    };

    const go = (t) => {
      tab = views[t] ? t : 'riddles';
      store.set('itw:gamesTab', tab);
      $$('.seg button', el).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.t === tab)));
      views[tab]();
    };
    $('.seg', el).addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) go(b.dataset.t); });
    go(tab);
  },
};
