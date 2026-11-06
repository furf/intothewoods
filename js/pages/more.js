import { icon, isStandalone, shareOrCopy, toast } from '../ui.js';

const ITEMS = [
  ['Plan', [
    ['#/map', 'map', 'Map & Directions', 'Driving directions and the campus map'],
    ['#/contacts', 'phone', 'Contacts & Emergencies', 'Alarm, 911, camp, teachers, chaperones'],
  ]],
  ['At camp', [
    ['#/games', 'puzzle', 'Games & Riddles', 'Trail games, riddles, question deck'],
    ['#/cabin', 'tent', 'Cabin Agreement', 'Build your cabin\'s community guidelines'],
    ['#/field', 'leaf', 'Field Guide', 'Redwoods, banana slugs, coho & stars'],
  ]],
  ['Tools', [
    ['#/compass', 'compass', 'Compass', 'Heading, GPS & find-your-way-back'],
    ['#/light', 'light', 'Night Light', 'Red cabin light that keeps the screen on'],
  ]],
];

export default {
  render(el) {
    el.innerHTML = `
      <div class="page">
        ${ITEMS.map(([h, list]) => `
          <h2 class="group-title">${h}</h2>
          <div class="menu">${list.map(([href, ic, t, d]) => `
            <a href="${href}"><span class="menu-ic">${icon(ic)}</span><span><b>${t}</b><small>${d}</small></span><span class="chev" aria-hidden="true"></span></a>`).join('')}
          </div>`).join('')}

        <h2 class="group-title">This app</h2>
        <div class="card">
          <div class="install-box">
            <img src="icons/icon-192.png" alt="" width="56" height="56">
            <div>
              <b>${isStandalone() ? 'Installed ✓' : 'Install Into the Woods'}</b>
              <p class="small muted" id="installHint">${isStandalone()
                ? 'Running as an app. Everything works offline.'
                : /iphone|ipad|ipod/i.test(navigator.userAgent)
                  ? 'In Safari, tap Share, then "Add to Home Screen".'
                  : 'Add it to your home screen for one-tap, offline access.'}</p>
            </div>
          </div>
          <div class="btn-row">
            <button class="btn install-btn" type="button" id="installBtn">${icon('download')} Install</button>
            <button class="btn ghost-dark" type="button" id="shareBtn">${icon('share')} Share with parents</button>
          </div>
          <p class="small muted">Works without signal once opened. Checklists and notes stay on this device.</p>
        </div>
        <p class="footnote">Unofficial trip helper made by Thornhill parents. Not affiliated with Westminster Woods. Content adapted from the WW packing list, trip slides and Chaperone Handbook.</p>
      </div>`;

    el.querySelector('#installBtn').addEventListener('click', async () => {
      const p = window.__installPrompt;
      if (!p) { toast(isStandalone() ? 'Already installed 🎉' : 'Use your browser menu: "Add to Home Screen" / "Install app".'); return; }
      p.prompt();
      await p.userChoice.catch(() => {});
      window.__installPrompt = null;
    });
    el.querySelector('#shareBtn').addEventListener('click', () => shareOrCopy({
      title: 'Into the Woods',
      text: 'Thornhill\'s Westminster Woods trip app: schedule, packing list, directions & chaperone guide. Works offline!',
      url: location.href.split('#')[0],
    }));
  },
};
