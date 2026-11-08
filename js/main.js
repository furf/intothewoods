import { $, $$, toast } from './ui.js';
import { updatePackBadge } from './pages/checklist.js';

// route -> { module, tab, title, back, immersive }
//   module:    page file in js/pages/
//   tab:       tab bar item to highlight (null for none)
//   title:     header and document title
//   back:      Back button target (null hides it)
//   immersive: hide the header and tab bar
const ROUTES = {
  home: { module: 'home', tab: 'home', title: 'Into the Woods', back: null, immersive: false },
  schedule: { module: 'schedule', tab: 'schedule', title: 'Schedule', back: null, immersive: false },
  checklist: { module: 'checklist', tab: 'checklist', title: 'Checklist', back: null, immersive: false },
  directions: { module: 'directions', tab: 'directions', title: 'Directions', back: null, immersive: false },
  guide: { module: 'guide', tab: 'guide', title: 'Guide', back: null, immersive: false },
  // Contacts opens from the phone button in the header.
  contacts: { module: 'contacts', tab: null, title: 'Contacts', back: '#/', immersive: false },
  // Tools live under the Guide tab; Back returns there.
  games: { module: 'games', tab: 'guide', title: 'Games & Riddles', back: '#/guide', immersive: false },
  compass: { module: 'compass', tab: 'guide', title: 'Compass', back: '#/guide', immersive: false },
  light: { module: 'light', tab: 'guide', title: 'Night Light', back: '#/guide', immersive: true },
  field: { module: 'field', tab: 'guide', title: 'Field Guide', back: '#/guide', immersive: false },
  cabin: { module: 'cabin', tab: 'guide', title: 'Cabin Agreement', back: '#/guide', immersive: false },
};
// Old links (home-screen shortcuts, shared URLs) keep working.
const ALIASES = { '': 'home', more: 'guide', travel: 'directions', packing: 'checklist', map: 'directions' };

const view = $('#view');
let cleanup = null;
let current = null;

// We decide scroll position ourselves: every new page starts at the top.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

function parse() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, query = ''] = raw.split('?');
  const [raw0, ...rest] = path.split('/');
  const name = ALIASES[raw0] || raw0;
  return { name: ROUTES[name] ? name : 'home', sub: rest.join('/'), params: new URLSearchParams(query) };
}
let firstRender = true;

async function navigate() {
  const { name, sub, params } = parse();
  const route = ROUTES[name];
  const same = name === current;
  current = name;

  let page;
  try {
    page = (await import(`./pages/${route.module}.js`)).default;
  } catch (err) {
    console.error(err);
    view.innerHTML = '<div class="page"><div class="card"><h2>Page unavailable</h2><p>This page hasn\'t been saved for offline use yet. Reconnect once and it will be.</p></div></div>';
    return;
  }

  const swap = () => {
    if (typeof cleanup === 'function') cleanup();
    cleanup = null;
    document.body.dataset.route = name;
    document.body.classList.toggle('immersive', !!route.immersive);
    $('#appTitle').textContent = route.title;
    document.title = name === 'home' ? route.title : `${route.title} · Into the Woods`;
    $('#backBtn').hidden = !route.back;
    if (route.back) $('#backBtn').setAttribute('href', route.back);
    const cb = $('#contactsBtn');
    if (name === 'contacts') cb.setAttribute('aria-current', 'page'); else cb.removeAttribute('aria-current');
    $$('#tabbar a').forEach((a) => {
      const on = a.dataset.tab === route.tab;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    view.innerHTML = '';
    if (!same) window.scrollTo(0, 0);
    cleanup = page.render(view, { sub, params }) || null;
    // Move focus to the new page so screen readers announce it (not on first load).
    if (!same && !firstRender) view.focus({ preventScroll: true });
    firstRender = false;
  };
  if (document.startViewTransition && !same && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // A fast second tap skips the animation (the page still updates); don't log that as an error.
    document.startViewTransition(swap).ready.catch(() => {});
  } else {
    swap();
  }
}

window.addEventListener('hashchange', navigate);
navigate();

// Back button: return to the previous in-app screen when there is one; otherwise go to the route's parent.
let internalNavs = 0;
window.addEventListener('hashchange', () => { internalNavs++; });
$('#backBtn').addEventListener('click', (e) => {
  if (internalNavs > 0) { e.preventDefault(); history.back(); }
});

// ---- Online / offline status ----
// Always visible: signal is spotty in the woods, so chaperones can see at a glance whether they're connected.
const statusBtn = $('#status');
const swSupported = 'serviceWorker' in navigator;
let offlineReady = !swSupported;
function renderStatus() {
  const online = navigator.onLine;
  const saving = online && !offlineReady;
  statusBtn.classList.toggle('offline', !online);
  statusBtn.classList.toggle('saving', saving);
  $('.status-text', statusBtn).textContent = !online ? 'Offline' : saving ? 'Saving…' : 'Online';
  statusBtn.setAttribute('aria-label', !online
    ? 'Offline. Everything in the app still works'
    : saving ? 'Online. Saving the app for offline use' : 'Online');
}
window.addEventListener('online', () => { renderStatus(); toast('Back online'); });
window.addEventListener('offline', () => { renderStatus(); toast('You\'re offline. The app still works; live maps and video need signal.', 4000); });
statusBtn.addEventListener('click', () => {
  if (!navigator.onLine) toast('You\'re offline. Everything in the app still works; live maps and video need signal.', 4000);
  else if (!offlineReady) toast('Saving the app for offline use. Keep it open for a moment.');
  else toast('You\'re online. Live maps and video will load. The rest works either way.', 3200);
});
renderStatus();

// ---- Service worker ----
// A new version waits until the person chooses to reload, so a page never mixes old and new code.
if (swSupported) {
  // Reload only when the person asked for the update (not when a first install takes control).
  let updateRequested = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!updateRequested) return;
    updateRequested = false;
    location.reload();
  });
  const offerUpdate = (worker) => toast('A new version of the app is ready.', 0, {
    label: 'Reload', onClick: () => { updateRequested = true; worker.postMessage('SKIP_WAITING'); },
  });
  navigator.serviceWorker.register('sw.js').then((reg) => {
    navigator.serviceWorker.ready.then(() => {
      offlineReady = true; renderStatus();
      if (!navigator.serviceWorker.controller) toast('Saved for offline use. Works without signal.', 3200);
    });
    if (reg.waiting && navigator.serviceWorker.controller) offerUpdate(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      nw?.addEventListener('statechange', () => {
        if (nw.state === 'installed' && navigator.serviceWorker.controller) offerUpdate(nw);
      });
    });
    // Check for updates when the app comes back to the foreground.
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); });
  }).catch(() => { offlineReady = true; renderStatus(); });
}

// Ask the browser to keep our data (checklists, notes) even under storage pressure.
navigator.storage?.persist?.().catch(() => {});

// Capture the install prompt so Home can offer an "Install" button.
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.__installPrompt = e;
  document.body.classList.add('can-install');
});
window.addEventListener('appinstalled', () => {
  window.__installPrompt = null;
  document.body.classList.remove('can-install');
  toast('Installed! Find "Into the Woods" on your home screen.');
});

updatePackBadge();
