import { esc, icon } from '../ui.js';
import { MISSION, GOLDEN_RULE, ROLE, RULES, SERIOUS, BEDTIME, NIGHT, PROACTIVE, RESPONSIVE, HOMESICK, TN_TIPS, OTHER } from '../data/guide.js';

const pairs = (list) => `<dl class="pairs">${list.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`;
const tools = (list) => `<div class="cards-scroll">${list.map(([e, t, d]) => `<article class="tool"><span class="tool-ic" aria-hidden="true">${e}</span><h4>${esc(t)}</h4><p>${esc(d)}</p></article>`).join('')}</div>`;

// Ordered by when you'll need it: before the trip → during the day → at night → reference.
const SECTIONS = [
  ['role', 'Your role', () => `
    <p class="golden"><b>Golden rule:</b> ${esc(GOLDEN_RULE)}</p>
    ${pairs(ROLE)}
    <h3>On the trail</h3>
    ${pairs(TN_TIPS)}`],
  ['tools', 'Tools of the trade', () => `
    <p>There's usually a reason behind any behavior. Start from <b>underlying acceptance</b>: students who feel seen and respected tend to be their better selves.</p>
    <h3>Prevent it</h3>${tools(PROACTIVE)}
    <h3>In the moment</h3>${tools(RESPONSIVE)}`],
  ['homesick', 'Homesickness', () => `
    <p>Tell a teacher and a WW staff member if a student is homesick.</p>
    <div class="do-dont">
      <div class="do"><h4>Helps</h4>${HOMESICK.do.map(([k, v]) => `<p><b>${esc(k)}.</b> ${esc(v)}</p>`).join('')}</div>
      <div class="dont"><h4>Makes it worse</h4>${HOMESICK.avoid.map(([k, v]) => `<p><b>${esc(k)}.</b> ${esc(v)}</p>`).join('')}</div>
    </div>`],
  ['night', 'Bedtime & overnight', () => `
    <ol class="steps">${BEDTIME.map(([k, v]) => `<li><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join('')}</ol>
    <h3>If something comes up</h3>
    ${pairs(NIGHT)}`],
  ['rules', 'Campus rules', () => `
    ${Object.entries(RULES).map(([k, list]) => `<h3>${esc(k)}</h3><ul class="bullets">${list.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>`).join('')}
    <h3>Report immediately</h3>
    <p>Tell a WW staff member or a Thornhill teacher right away about:</p>
    <div class="chips">${SERIOUS.map((s) => `<span class="chip warn">${esc(s)}</span>`).join('')}</div>`],
  ['other', 'Good to know', () => pairs(OTHER)],
];

export default {
  render(el, { params }) {
    const open = params.get('s');
    el.innerHTML = `
      <div class="page">
        <div class="intro-card">
          <h2>Thank you, chaperone!</h2>
          <p class="mission">${esc(MISSION)}</p>
        </div>

        <nav class="menu quick" aria-label="Chaperone essentials">
          <a href="#/schedule"><span class="menu-ic">${icon('calendar')}</span><span><b>Your day, hour by hour</b><small>Chaperone notes on every item</small></span><span class="chev" aria-hidden="true"></span></a>
          <a href="#/contacts"><span class="menu-ic warn">${icon('alert')}</span><span><b>Emergencies &amp; contacts</b><small>Alarm, 911, phones, radios</small></span><span class="chev" aria-hidden="true"></span></a>
          <a href="#/packing?list=chaperone"><span class="menu-ic">${icon('pack')}</span><span><b>Your packing list</b><small>For grown-ups</small></span><span class="chev" aria-hidden="true"></span></a>
        </nav>

        <h2 class="group-title">Handbook</h2>
        ${SECTIONS.map(([id, t, body]) => `
          <details class="acc" id="g-${id}" ${id === open ? 'open' : ''}>
            <summary><span>${esc(t)}</span><span class="chev" aria-hidden="true"></span></summary>
            <div class="acc-body">${body()}</div>
          </details>`).join('')}

        <h2 class="group-title">With your cabin</h2>
        <nav class="menu" aria-label="Cabin activities">
          <a href="#/cabin"><span class="menu-ic">${icon('tent')}</span><span><b>Cabin agreement</b><small>Do it at your first Cabin Time</small></span><span class="chev" aria-hidden="true"></span></a>
          <a href="#/games"><span class="menu-ic">${icon('puzzle')}</span><span><b>Games &amp; riddles</b><small>Easy to lead, anywhere</small></span><span class="chev" aria-hidden="true"></span></a>
        </nav>

        <p class="footnote">Condensed from the Westminster Woods Chaperone Handbook. You'll get a full orientation at camp on day one.</p>
      </div>`;
    // Only one handbook section open at a time keeps the page short.
    el.querySelectorAll('details.acc').forEach((d) => d.addEventListener('toggle', () => {
      if (!d.open) return;
      el.querySelectorAll('details.acc[open]').forEach((o) => { if (o !== d) o.open = false; });
      d.scrollIntoView({ block: 'nearest' });
    }));
  },
};
