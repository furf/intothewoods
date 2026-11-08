import { esc } from '../ui.js';
import { FIELD, LNT } from '../data/field.js';

export default {
  render(el) {
    el.innerHTML = `
      <div class="page">
        <div class="intro-card">
          <h2>Forest field guide</h2>
          <p>What lives in a redwood forest? Read up before you go so you can point things out on the trail.</p>
        </div>
        ${FIELD.map((f) => `
          <article class="card field">
            <header><span class="field-ic" aria-hidden="true">${f.icon}</span><div><h3>${esc(f.name)}</h3><i class="muted small">${esc(f.sci)}</i></div></header>
            <ul class="bullets">${f.facts.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
            <p class="find"><b>Find it:</b> ${esc(f.find)}</p>
          </article>`).join('')}
        <section class="card">
          <h2>Leave No Trace</h2>
          <ol class="steps">${LNT.map((p) => `<li><span>${esc(p)}</span></li>`).join('')}</ol>
        </section>
      </div>`;
  },
};
