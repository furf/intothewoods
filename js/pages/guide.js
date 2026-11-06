import { esc, $$ } from '../ui.js';
import { MISSION, GOLDEN_RULE, ROLE, DAY, RULES, SERIOUS, BEDTIME, NIGHT, PROACTIVE, RESPONSIVE, HOMESICK, TN_TIPS, OTHER } from '../data/guide.js';

const pairs = (list) => `<dl class="pairs">${list.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`;
const tools = (list) => `<div class="cards-scroll">${list.map(([e, t, d]) => `<article class="tool"><span class="tool-ic" aria-hidden="true">${e}</span><h4>${esc(t)}</h4><p>${esc(d)}</p></article>`).join('')}</div>`;

const SECTIONS = [
  ['role', 'Your role', () => `
    <blockquote class="mission">${esc(MISSION)}</blockquote>
    <p class="golden"><b>Golden rule:</b> ${esc(GOLDEN_RULE)}</p>
    ${pairs(ROLE)}`],
  ['day', 'A day in your boots', () => `
    <ol class="mini-timeline">${DAY.map(([t, h, d]) => `<li><time>${esc(t)}</time><div><b>${esc(h)}</b><p>${esc(d)}</p></div></li>`).join('')}</ol>`],
  ['tools', 'Tools of the trade', () => `
    <p>There's usually a reason behind any behavior. Understanding the <i>why</i> goes a long way. Start from <b>underlying acceptance</b>: students who feel seen and respected tend to be their better selves.</p>
    <h3>Proactive: prevent it</h3>${tools(PROACTIVE)}
    <h3>Responsive: in the moment</h3>${tools(RESPONSIVE)}
    <p class="muted small">Swipe sideways for more cards →</p>`],
  ['homesick', 'Homesickness', () => `
    <p>Tell a teacher and a WW staff member if a student is homesick.</p>
    <div class="do-dont">
      <div class="do"><h4>Helps</h4>${HOMESICK.do.map(([k, v]) => `<p><b>${esc(k)}.</b> ${esc(v)}</p>`).join('')}</div>
      <div class="dont"><h4>Makes it worse</h4>${HOMESICK.avoid.map(([k, v]) => `<p><b>${esc(k)}.</b> ${esc(v)}</p>`).join('')}</div>
    </div>`],
  ['bedtime', 'Bedtime routine', () => `
    <ol class="steps">${BEDTIME.map(([k, v]) => `<li><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join('')}</ol>`],
  ['night', 'Nighttime situations', () => pairs(NIGHT)],
  ['rules', 'Campus rules', () => `
    ${Object.entries(RULES).map(([k, list]) => `<h3>${esc(k)}</h3><ul class="bullets">${list.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>`).join('')}
    <h3>Report immediately</h3>
    <p>Tell a WW staff member or a Thornhill teacher right away about:</p>
    <div class="chips">${SERIOUS.map((s) => `<span class="chip warn">${esc(s)}</span>`).join('')}</div>`],
  ['emergency', 'Emergencies', () => `
    <div class="alert">
      <p><b>Alarm:</b> train whistle or air horn, 3 quick blasts repeated 15 times. Head to the <b>Big Green Field</b> and line up your cabin behind its numbered post.</p>
      <p><b>911 first</b> (phones in the Dining Hall &amp; Redwood Center), then a Thornhill teacher and WW staff.</p>
    </div>
    <div class="btn-row"><a class="btn" href="#/contacts">Contacts</a><a class="btn ghost-dark" href="#/map">Campus map</a></div>`],
  ['tn', 'Working with your Naturalist', () => pairs(TN_TIPS)],
  ['other', 'Good to know', () => pairs(OTHER)],
];

export default {
  render(el, { params }) {
    const open = params.get('s') || 'role';
    el.innerHTML = `
      <div class="page">
        <div class="intro-card">
          <h2>Thank you, chaperone! 🌲</h2>
          <p>This program could not exist without you. By the end of the trip, you'll be a hero in your students' eyes.</p>
          <a class="btn small" href="#/packing?list=chaperone">Your packing list</a>
        </div>
        <nav class="chips jump" aria-label="Jump to section">${SECTIONS.map(([id, t]) => `<a class="chip" href="#g-${id}" data-jump="${id}">${esc(t)}</a>`).join('')}</nav>
        ${SECTIONS.map(([id, t, body]) => `
          <details class="acc" id="g-${id}" ${id === open ? 'open' : ''}>
            <summary><span>${esc(t)}</span><span class="chev" aria-hidden="true"></span></summary>
            <div class="acc-body">${body()}</div>
          </details>`).join('')}
        <p class="footnote">Condensed from the Westminster Woods Chaperone Handbook. You'll also get a full chaperone orientation on day one.</p>
      </div>`;
    $$('[data-jump]', el).forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      const d = el.querySelector(`#g-${a.dataset.jump}`);
      d.open = true;
      d.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
  },
};
