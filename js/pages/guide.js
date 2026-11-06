import { esc, icon } from '../ui.js';
import { MISSION, GOLDEN_RULE, ROLE, RULES, SERIOUS, BEDTIME, NIGHT, PROACTIVE, RESPONSIVE, HOMESICK, TN_TIPS, OTHER } from '../data/guide.js';

const pairs = (list) => `<dl class="pairs">${list.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`;
const tools = (list) => pairs(list.map(([, t, d]) => [t, d]));
const row = ([href, ic, t, d]) => `<a href="${href}"><span class="menu-ic">${icon(ic)}</span><span><b>${t}</b><small>${d}</small></span><span class="chev" aria-hidden="true"></span></a>`;

// Things chaperones open at camp, grouped by when they reach for them.
const AT_CAMP = [
  ['#/map', 'map', 'Map &amp; directions', 'Campus map, driving route, address'],
  ['#/light', 'light', 'Night light', 'Red cabin light that keeps the screen on'],
  ['#/compass', 'compass', 'Compass', 'Save a spot and find your way back'],
];
const WITH_CABIN = [
  ['#/cabin', 'tent', 'Cabin agreement', 'Do it at your first Cabin Time'],
  ['#/games', 'puzzle', 'Games &amp; riddles', 'Easy to lead, anywhere'],
  ['#/field', 'leaf', 'Field guide', 'Redwoods, banana slugs, coho and stars'],
];

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
        <p class="mission">${esc(MISSION)}</p>

        <h2 class="group-title">At camp</h2>
        <nav class="menu" aria-label="At camp">${AT_CAMP.map(row).join('')}</nav>

        <h2 class="group-title">With your cabin</h2>
        <nav class="menu" aria-label="With your cabin">${WITH_CABIN.map(row).join('')}</nav>

        <h2 class="group-title">Handbook</h2>
        ${SECTIONS.map(([id, t, body]) => `
          <details class="acc" id="g-${id}" ${id === open ? 'open' : ''}>
            <summary><span>${esc(t)}</span><span class="chev" aria-hidden="true"></span></summary>
            <div class="acc-body">${body()}</div>
          </details>`).join('')}

        <nav class="menu" aria-label="Before you go">${row(['#/packing?list=chaperone', 'pack', 'Your packing list', 'What grown-ups bring'])}</nav>

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
