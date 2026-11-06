import { icon, store, toast, buzz, wakeLock } from '../ui.js';

const DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const cardinal = (deg) => DIRS[Math.round(deg / 45) % 8];
const toRad = (d) => (d * Math.PI) / 180;

function distBearing(a, b) {
  const R = 6371e3;
  const φ1 = toRad(a.lat), φ2 = toRad(b.lat), Δφ = toRad(b.lat - a.lat), Δλ = toRad(b.lon - a.lon);
  const h = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const d = 2 * R * Math.asin(Math.sqrt(h));
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return { d, brg: (Math.atan2(y, x) * 180 / Math.PI + 360) % 360 };
}
const fmtDist = (m) => (m < 1000 ? `${Math.round(m * 3.281)} ft` : `${(m / 1609).toFixed(2)} mi`);

const ticks = Array.from({ length: 72 }, (_, i) => {
  const a = i * 5, long = a % 30 === 0;
  return `<line x1="100" y1="${long ? 14 : 18}" x2="100" y2="24" transform="rotate(${a} 100 100)" class="${long ? 'tk long' : 'tk'}"/>`;
}).join('');
const labels = DIRS.map((d, i) => `<text x="100" y="${d.length === 1 ? 42 : 40}" transform="rotate(${i * 45} 100 100)" class="${d === 'N' ? 'lbl n' : d.length === 1 ? 'lbl' : 'lbl sm'}">${d}</text>`).join('');

export default {
  render(el) {
    el.innerHTML = `
      <div class="page compass-page">
        <div class="compass" id="compass">
          <svg viewBox="0 0 200 200" class="dial" id="dial" aria-hidden="true">
            <circle cx="100" cy="100" r="96" class="rim"/>
            ${ticks}${labels}
            <g class="rose"><path d="M100 52 L108 100 L100 148 L92 100 Z" class="rose-ns"/><path d="M52 100 L100 92 L148 100 L100 108 Z" class="rose-ew"/></g>
          </svg>
          <svg viewBox="0 0 200 200" class="needle-back" id="backArrow" aria-hidden="true" hidden>
            <path d="M100 30 L112 58 L100 52 L88 58 Z" class="back-arrow"/>
          </svg>
          <div class="lubber" aria-hidden="true"></div>
          <img src="img/trees.webp" class="compass-trees" alt="" width="40" height="45">
        </div>
        <div class="heading" aria-live="polite"><b id="deg">--°</b><span id="dir">Tap start</span></div>
        <div class="btn-row center"><button class="btn" type="button" id="start">${icon('compass')} Start compass</button></div>
        <p class="muted small center" id="hint">Hold your phone flat. Move it in a figure-8 to calibrate.</p>

        <section class="card">
          <h2>Find your way back</h2>
          <p class="small">Save a spot (your cabin, the dining hall), and the compass will point back to it. Uses GPS, which works without cell signal, but it's rough under tall trees.</p>
          <dl class="facts" id="gps"><dt>Position</dt><dd>-</dd><dt>Accuracy</dt><dd>-</dd><dt>Saved spot</dt><dd id="saved">None yet</dd></dl>
          <div class="btn-row">
            <button class="btn" type="button" id="mark">${icon('pin')} Save this spot</button>
            <button class="btn ghost-dark" type="button" id="clear">Clear</button>
          </div>
        </section>

        <section class="card">
          <h2>Signal check</h2>
          <dl class="facts" id="net"></dl>
        </section>
      </div>`;

    const dial = el.querySelector('#dial');
    const back = el.querySelector('#backArrow');
    const degEl = el.querySelector('#deg'), dirEl = el.querySelector('#dir');
    let heading = null, smooth = null, pos = null;
    let spot = store.get('itw:spot', null);
    const offs = [];

    const paint = () => {
      if (heading == null) return;
      // Smooth across the 0/360 seam.
      if (smooth == null) smooth = heading;
      let diff = ((heading - smooth + 540) % 360) - 180;
      smooth = (smooth + diff * 0.25 + 360) % 360;
      dial.style.transform = `rotate(${-smooth}deg)`;
      degEl.textContent = `${Math.round(smooth)}°`;
      dirEl.textContent = cardinal(smooth);
      if (spot && pos) {
        const { d, brg } = distBearing(pos, spot);
        back.hidden = false;
        back.style.transform = `rotate(${brg - smooth}deg)`;
        dirEl.textContent = `${cardinal(smooth)} · spot ${fmtDist(d)} away`;
      } else back.hidden = true;
    };
    let raf = 0;
    const loop = () => { paint(); raf = requestAnimationFrame(loop); };

    const onOrient = (e) => {
      let h = null;
      if (typeof e.webkitCompassHeading === 'number') h = e.webkitCompassHeading;
      else if (e.absolute && typeof e.alpha === 'number') h = 360 - e.alpha;
      else if (typeof e.alpha === 'number' && !('ondeviceorientationabsolute' in window)) h = 360 - e.alpha;
      if (h == null) return;
      const so = (screen.orientation?.angle || 0);
      heading = (h + so + 360) % 360;
    };

    const start = async () => {
      try {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
          const r = await DeviceOrientationEvent.requestPermission();
          if (r !== 'granted') { toast('Compass permission denied'); return; }
        }
      } catch { /* not supported */ }
      const evt = 'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation';
      window.addEventListener(evt, onOrient, true);
      offs.push(() => window.removeEventListener(evt, onOrient, true));
      cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
      el.querySelector('#start').hidden = true;
      buzz(15);
      setTimeout(() => { if (heading == null) { dirEl.textContent = 'No compass sensor'; el.querySelector('#hint').textContent = 'This device doesn\'t report a heading. Try it on your phone.'; } }, 2500);
      watchGps();
    };

    let watchId = null;
    const watchGps = () => {
      if (!navigator.geolocation || watchId != null) return;
      watchId = navigator.geolocation.watchPosition((p) => {
        pos = { lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy };
        const gps = el.querySelector('#gps');
        gps.children[1].textContent = `${pos.lat.toFixed(5)}, ${pos.lon.toFixed(5)}`;
        gps.children[3].textContent = `±${fmtDist(pos.acc)}`;
        if (heading == null) paint();
      }, () => { el.querySelector('#gps').children[1].textContent = 'Location unavailable'; }, { enableHighAccuracy: true, maximumAge: 5000 });
      offs.push(() => navigator.geolocation.clearWatch(watchId));
    };

    const showSaved = () => { el.querySelector('#saved').textContent = spot ? `${spot.lat.toFixed(5)}, ${spot.lon.toFixed(5)}` : 'None yet'; };
    showSaved();
    el.querySelector('#start').addEventListener('click', start);
    el.querySelector('#mark').addEventListener('click', () => {
      watchGps();
      if (!pos) { toast('Waiting for GPS… try again in a moment'); return; }
      spot = { lat: pos.lat, lon: pos.lon }; store.set('itw:spot', spot); showSaved(); buzz(20); toast('Spot saved 📍');
    });
    el.querySelector('#clear').addEventListener('click', () => { spot = null; store.set('itw:spot', null); showSaved(); back.hidden = true; });

    const net = () => {
      const c = navigator.connection;
      el.querySelector('#net').innerHTML = `
        <dt>Status</dt><dd>${navigator.onLine ? '🟢 Online' : '⚪ Offline (app still works)'}</dd>
        ${c?.effectiveType ? `<dt>Connection</dt><dd>${c.effectiveType.toUpperCase()}${c.downlink ? ` · ~${c.downlink} Mbps` : ''}</dd>` : ''}
        <dt>Saved offline</dt><dd>${navigator.serviceWorker?.controller ? '✅ Yes' : '⏳ Not yet'}</dd>`;
    };
    net();
    window.addEventListener('online', net); window.addEventListener('offline', net);
    offs.push(() => { window.removeEventListener('online', net); window.removeEventListener('offline', net); });
    offs.push(wakeLock());

    return () => { cancelAnimationFrame(raf); offs.forEach((f) => f()); };
  },
};
