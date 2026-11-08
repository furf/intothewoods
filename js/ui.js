// Shared helpers: escaping, icons, storage, toasts, small utilities.

export const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const $ = (sel, el = document) => el.querySelector(sel);
export const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

const P = {
  pack: '<path d="M8 7V5a4 4 0 0 1 8 0v2"/><rect x="5" y="7" width="14" height="14" rx="3"/><path d="M9 14h6v3H9z"/>',
  shirt: '<path d="M8 3 4 6l2 4 2-1v12h8V9l2 1 2-4-4-3c-.5 1.5-2 2.5-4 2.5S8.5 4.5 8 3z"/>',
  med: '<rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-35 12 12)"/><path d="m9.2 8 5.6 8"/>',
  food: '<path d="M12 7c-1-3-4-3-5-2M12 7c3-2 7 0 7 5s-3 9-7 9-7-4-7-9 4-7 7-5z"/>',
  drop: '<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  no: '<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>',
  book: '<path d="M12 6c-2-1.5-5-2-8-1.5V19c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V4.5c-3-.5-6 0-8 1.5z"/><path d="M12 6v14.5"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  kit: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M12 11v5M9.5 13.5h5"/>',
  map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
  car: '<path d="M5 16V11l2-5h10l2 5v5"/><path d="M3 16h18v3H3z"/><circle cx="7.5" cy="16" r="1.5"/><circle cx="16.5" cy="16" r="1.5"/>',
  phone: '<path d="M5 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
  msg: '<path d="M4 5h16v11H9l-5 4z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14a5 5 0 0 1 5.5 5"/>',
  puzzle: '<path d="M10 3h4v3a2 2 0 1 0 4 0V3h3v7h-3a2 2 0 1 0 0 4h3v7h-7v-3a2 2 0 1 0-4 0v3H3v-7h3a2 2 0 1 0 0-4H3V3z"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  light: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
  leaf: '<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15"/><path d="M5 19 14 10"/>',
  tent: '<path d="M12 4 3 20h18z"/><path d="m12 4 0 0M12 12l-3 8M12 12l3 8"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  share: '<path d="M12 15V4M8 8l4-4 4 4"/><path d="M5 12v8h14v-8"/>',
  play: '<path d="M8 5v14l11-7z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5H5V6h5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  pin: '<path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>',
  heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
  shuffle: '<path d="M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3"/>',
  zoomin: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M8 11h6M11 8v6"/>',
  zoomout: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M8 11h6"/>',
  expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  tree: '<path d="M12 3 6.5 10.5h3L5 17h14l-4.5-6.5h3z"/><path d="M12 17v4"/>',
  fire: '<path d="M12 3c.5 3 5 5 5 10a5 5 0 0 1-10 0c0-2.4 1.3-4 2.5-5 .3 1.8 1.2 3 2.5 3-.5-2.8-.7-5.3 0-8z"/><path d="M5 21h14"/>',
  flag: '<path d="M6 21V4"/><path d="M6 4h12l-3 4 3 4H6"/>',
  utensils: '<path d="M5 3v5a2 2 0 0 0 4 0V3M7 3v18"/><path d="M18 21V3c-2.5 1.5-3.5 4.5-3.5 9H18"/>',
  cabin: '<path d="M2 12 12 4l10 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
  ball: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.6 5.6c2.6 3.2 2.6 9.6 0 12.8M18.4 5.6c-2.6 3.2-2.6 9.6 0 12.8"/>',
  mountain: '<path d="M2 20 9 8l4 6 3-4 6 10z"/>',
  fish: '<path d="M2.5 12c2.8-3.8 8-5 12.5-2.5L20 6v12l-5-3.5C10.5 17 5.3 15.8 2.5 12z"/><path d="M7 11.5v.5"/>',
};
export const icon = (name, cls = '') =>
  `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[name] || ''}</svg>`;

export const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); } catch { return fallback; }
  },
  set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage unavailable */ }
  },
};

let toastTimer;
// toast('Saved') or toast('Update ready', 0, { label: 'Reload', onClick }). ms = 0 keeps it up until acted on.
export function toast(msg, ms = 2600, action = null) {
  const el = $('#toast');
  $('.toast-msg', el).textContent = msg;
  const btn = $('.toast-act', el);
  btn.hidden = !action;
  btn.textContent = action?.label || '';
  btn.onclick = action ? () => { el.classList.remove('show'); el.hidden = true; action.onClick(); } : null;
  el.hidden = false;
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
  clearTimeout(toastTimer);
  if (ms) toastTimer = setTimeout(() => { el.classList.remove('show'); setTimeout(() => { el.hidden = true; }, 250); }, ms);
}

export const buzz = (ms = 8) => { try { navigator.vibrate?.(ms); } catch { /* unsupported */ } };

// Show a North American number as (###) ###-####. A leading 1 is dropped.
// Other numbers (911, international) stay as they were typed.
export function formatPhone(p = '') {
  const s = String(p).trim();
  const d = s.replace(/\D/g, '');
  const n = d.length === 11 && d[0] === '1' ? d.slice(1) : d;
  return n.length === 10 ? `(${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6)}` : s;
}

export const telHref = (p) => 'tel:' + String(p).replace(/[^\d+]/g, '');
export const smsHref = (p) => 'sms:' + String(p).replace(/[^\d+]/g, '');

export function download(filename, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function shareOrCopy({ title, text, url }) {
  if (navigator.share) {
    try { await navigator.share({ title, text, url }); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  try { await navigator.clipboard.writeText([text, url].filter(Boolean).join('\n')); toast('Copied to clipboard'); } catch { toast('Sharing isn\'t available here'); }
}

export async function copy(text, msg = 'Copied') {
  try { await navigator.clipboard.writeText(text); toast(msg); buzz(); } catch { toast('Couldn\'t copy'); }
}

// Times on the schedule are local camp time (Pacific). We treat the device clock as local.
export const at = (date, hhmm) => new Date(`${date}T${hhmm}:00`);
export function fmtTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const hr = ((h + 11) % 12) + 1;
  return `${hr}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
}

export function wakeLock() {
  let lock = null;
  const req = async () => { try { lock = await navigator.wakeLock?.request('screen'); } catch { /* denied */ } };
  const onVis = () => { if (document.visibilityState === 'visible') req(); };
  req();
  document.addEventListener('visibilitychange', onVis);
  return () => { document.removeEventListener('visibilitychange', onVis); lock?.release?.().catch(() => {}); };
}

export const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

// Local calendar date as YYYY-MM-DD (not UTC).
export function today(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
