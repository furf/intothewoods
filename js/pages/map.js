import { esc, icon } from '../ui.js';

const SPOTS = [
  ['🟩', 'Big Green Field', 'Emergency meeting spot: line up behind your cabin post. Rec time ends here too.'],
  ['🍽️', 'Vernon Dining Hall', 'All meals. Has a phone and an emergency radio.'],
  ['📞', 'Redwood Center', 'Meeting room with a phone for teacher house extensions.'],
  ['📻', 'Hut J (by cabin 11)', 'Emergency radio.'],
  ['🚻', 'Meadow Cabin bath area', 'Emergency radio and a vomit kit.'],
  ['🎯', 'Rec areas', 'Tree House, Cargo Net, Playground, Ga-Ga Pit, Basketball Court.'],
  ['🧗', 'Challenge Course Canyon', 'Where High Ropes Challenges happen.'],
  ['🔥', 'Campfires', 'Hillside, Adventure, Center and Creekside campfire circles.'],
  ['🐟', 'Creek Zip & Coho Crossing', 'Bridge over Dutch Bill Creek, salmon habitat.'],
];

export default {
  render(el) {
    el.innerHTML = `
      <div class="page">
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
        </section>
      </div>`;

    // Lightweight pan/zoom with pointer events.
    const box = el.querySelector('#zoomer');
    const img = el.querySelector('#mapImg');
    let s = 1, x = 0, y = 0;
    const pts = new Map();
    let last = null;
    const clamp = () => {
      const w = box.clientWidth, h = box.clientHeight;
      s = Math.min(5, Math.max(1, s));
      const iw = w * s, ih = (img.naturalHeight / img.naturalWidth || 893 / 1159) * w * s;
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
        const d = Math.hypot(a[0] - b[0], a[1] - b[1]); const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        if (last) zoomAt(d / last, mid[0], mid[1]);
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
    const onResize = () => apply();
    window.addEventListener('resize', onResize);
    img.decode?.().then(apply).catch(apply);
    apply();
    return () => window.removeEventListener('resize', onResize);
  },
};
