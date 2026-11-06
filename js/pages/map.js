import { esc, icon, copy, store, $$ } from '../ui.js';
import { PLACES, MAPS } from '../data/trip.js';

// Places only. Emergency phones, radios and the alarm live on the Contacts page.
const SPOTS = [
  ['🟩', 'Big Green Field', 'Center of camp. Cabin line-up posts for end of rec time and emergencies.'],
  ['🍽️', 'Vernon Dining Hall', 'All meals.'],
  ['🏠', 'Cabins', 'Hillside 1–9, Creekside 11–19, Pool 22–24, Meadow 31–36.'],
  ['🎯', 'Rec areas', 'Tree House, Cargo Net, Playground, Ga-Ga Pit, Basketball Court.'],
  ['🧗', 'Challenge Course Canyon', 'High Ropes Challenges.'],
  ['🔥', 'Campfires', 'Hillside, Adventure, Center and Creekside campfire circles.'],
  ['🐟', 'Creek Zip & Coho Crossing', 'Bridge over Dutch Bill Creek, salmon habitat.'],
];

const directions = () => `
  <section class="card">
    <div class="address">
      ${icon('pin')}
      <div><b>${esc(PLACES.camp.name)}</b><span>${esc(PLACES.camp.address)}</span></div>
      <button class="icon-btn" type="button" id="copyAddr" aria-label="Copy address">${icon('copy')}</button>
    </div>
    <div class="btn-grid">
      <a class="btn" href="${MAPS.google}" target="_blank" rel="noopener">${icon('car')} Google Maps from Thornhill</a>
      <a class="btn ghost-dark" href="${MAPS.googleHere}" target="_blank" rel="noopener">From here</a>
      <a class="btn ghost-dark" href="${MAPS.apple}" target="_blank" rel="noopener">Apple Maps</a>
      <a class="btn ghost-dark" href="${MAPS.waze}" target="_blank" rel="noopener">Waze</a>
    </div>
    <div class="map-embed" id="mapEmbed">
      <div class="map-offline">${icon('map')}<p>The live map needs a connection.<br>The buttons above still open your maps app.</p></div>
    </div>
  </section>
  <section class="card">
    <h2>Driving tips</h2>
    <ul class="bullets">
      <li><b>About 1½–2 hours</b> from Oakland. We're due at camp by 10:15.</li>
      <li><b>Cell service fades</b> on the winding stretch near Occidental. Start navigation before you leave, or save an offline map area.</li>
      <li>The last roads are <b>narrow and curvy</b>. Car-sick kids do better up front with a window cracked.</li>
      <li>Going home: <a href="${MAPS.returnHome}" target="_blank" rel="noopener">directions back to Thornhill</a>.</li>
    </ul>
  </section>`;

const campus = () => `
  <div class="zoomer" id="zoomer" aria-label="Campus map. Pinch or use the buttons to zoom.">
    <img id="mapImg" src="img/campus-map.webp" alt="Westminster Woods main campus map showing cabins, meeting rooms, dining hall, rec areas, creek and trails" width="1159" height="893" draggable="false">
    <div class="zoom-ctl">
      <button class="icon-btn" type="button" data-z="1.5" aria-label="Zoom in">${icon('zoomin')}</button>
      <button class="icon-btn" type="button" data-z="0.667" aria-label="Zoom out">${icon('zoomout')}</button>
      <button class="icon-btn" type="button" data-z="0" aria-label="Reset zoom">${icon('expand')}</button>
    </div>
  </div>
  <p class="muted small center">Pinch, drag or double-tap to zoom. Map is not to scale.</p>
  <section class="card">
    <h2>Key spots</h2>
    <ul class="spots">${SPOTS.map(([e, n, d]) => `<li><span aria-hidden="true">${e}</span><div><b>${esc(n)}</b><p>${esc(d)}</p></div></li>`).join('')}</ul>
    <a class="btn small ghost-dark" href="#/contacts">${icon('alert')} Emergency phones, radios &amp; alarm</a>
  </section>`;

export default {
  render(el, { params }) {
    let tab = params.get('v') || store.get('itw:mapTab', 'directions');
    el.innerHTML = `
      <div class="page">
        <div class="seg two" role="tablist" aria-label="Map view">
          <button role="tab" type="button" data-v="directions"><b>Getting there</b></button>
          <button role="tab" type="button" data-v="campus"><b>Campus map</b></button>
        </div>
        <div id="mview"></div>
      </div>`;
    const mv = el.querySelector('#mview');
    let undo = null;
    const go = (v) => {
      tab = v === 'campus' ? 'campus' : 'directions';
      store.set('itw:mapTab', tab);
      $$('.seg button', el).forEach((b) => b.setAttribute('aria-selected', String(b.dataset.v === tab)));
      if (undo) undo();
      if (tab === 'campus') { mv.innerHTML = campus(); undo = panZoom(mv); } else { mv.innerHTML = directions(); undo = liveMap(mv); }
    };
    el.querySelector('.seg').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) go(b.dataset.v); });
    go(tab);
    return () => undo && undo();
  },
};

function liveMap(el) {
  el.querySelector('#copyAddr').addEventListener('click', () => copy(PLACES.camp.address, 'Address copied'));
  const box = el.querySelector('#mapEmbed');
  const load = () => {
    if (!navigator.onLine || box.querySelector('iframe')) return;
    box.insertAdjacentHTML('afterbegin', `<iframe title="Driving route from Thornhill to Westminster Woods" src="${MAPS.embed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`);
  };
  load();
  window.addEventListener('online', load);
  return () => window.removeEventListener('online', load);
}

// Lightweight pan/zoom with pointer events.
function panZoom(el) {
  const box = el.querySelector('#zoomer');
  const img = el.querySelector('#mapImg');
  let s = 1, x = 0, y = 0, last = null;
  const pts = new Map();
  const clamp = () => {
    const w = box.clientWidth, h = box.clientHeight;
    s = Math.min(5, Math.max(1, s));
    const iw = w * s, ih = (893 / 1159) * w * s;
    x = Math.min(0, Math.max(w - iw, x));
    y = ih > h ? Math.min(0, Math.max(h - ih, y)) : (h - ih) / 2;
  };
  const apply = () => { clamp(); img.style.transform = `translate(${x}px, ${y}px) scale(${s})`; };
  const zoomAt = (f, cx, cy) => {
    const ns = Math.min(5, Math.max(1, s * f));
    x = cx - (cx - x) * (ns / s); y = cy - (cy - y) * (ns / s); s = ns; apply();
  };
  const rel = (e) => { const r = box.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };

  box.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button')) return;
    box.setPointerCapture(e.pointerId); pts.set(e.pointerId, rel(e)); last = null;
  });
  box.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return;
    const prev = pts.get(e.pointerId); const cur = rel(e); pts.set(e.pointerId, cur);
    if (pts.size === 1) { x += cur[0] - prev[0]; y += cur[1] - prev[1]; apply(); }
    else if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (last) zoomAt(d / last, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
      last = d;
    }
  });
  const up = (e) => { pts.delete(e.pointerId); last = null; };
  box.addEventListener('pointerup', up);
  box.addEventListener('pointercancel', up);
  box.addEventListener('dblclick', (e) => { const [cx, cy] = rel(e); zoomAt(s > 2.5 ? 1 / s : 2, cx, cy); });
  box.addEventListener('wheel', (e) => { e.preventDefault(); const [cx, cy] = rel(e); zoomAt(e.deltaY < 0 ? 1.15 : 0.87, cx, cy); }, { passive: false });
  el.querySelectorAll('[data-z]').forEach((b) => b.addEventListener('click', () => {
    const f = Number(b.dataset.z);
    if (!f) { s = 1; x = 0; y = 0; apply(); return; }
    zoomAt(f, box.clientWidth / 2, box.clientHeight / 2);
  }));
  window.addEventListener('resize', apply);
  apply();
  return () => window.removeEventListener('resize', apply);
}
