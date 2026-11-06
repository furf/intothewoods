import { $, $$, toast } from './ui.js';
import { updatePackBadge } from './pages/packing.js';

// route -> { module, tab, title, back }
const ROUTES = {
  '': { mod: 'home', tab: 'home', title: 'Into the Woods' },
  schedule: { mod: 'schedule', tab: 'schedule', title: 'Schedule' },
  packing: { mod: 'packing', tab: 'packing', title: 'Packing List' },
  guide: { mod: 'guide', tab: 'guide', title: 'Chaperones' },
  more: { mod: 'more', tab: 'more', title: 'More' },
  travel: { mod: 'travel', tab: 'more', title: 'Getting There', back: true },
  map: { mod: 'map', tab: 'more', title: 'Campus Map', back: true },
  contacts: { mod: 'contacts', tab: 'more', title: 'Contacts', back: true },
  games: { mod: 'games', tab: 'more', title: 'Games & Riddles', back: true },
  compass: { mod: 'compass', tab: 'more', title: 'Compass', back: true },
  light: { mod: 'light', tab: 'more', title: 'Night Light', back: true, immersive: true },
  field: { mod: 'field', tab: 'more', title: 'Field Guide', back: true },
  cabin: { mod: 'cabin', tab: 'more', title: 'Cabin Agreement', back: true },
};

const view = $('#view');
let cleanup = null;
let current = null;
const scrollPos = {};

function parse() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, query = ''] = raw.split('?');
  const [name, ...rest] = path.split('/');
  return { name: ROUTES[name] ? name : '', sub: rest.join('/'), params: new URLSearchParams(query) };
}

async function navigate() {
  const { name, sub, params } = parse();
  const route = ROUTES[name];
  if (current != null) scrollPos[current] = window.scrollY;

  let page;
  try {
    page = (await import(`./pages/${route.mod}.js`)).default;
  } catch (err) {
    console.error(err);
    view.innerHTML = '<div class="page"><div class="card"><h2>Page unavailable</h2><p>This page hasn\'t been saved for offline use yet. Reconnect once and it will be.</p></div></div>';
    return;
  }

  const swap = () => {
    if (typeof cleanup === 'function') cleanup();
    cleanup = null;
    document.body.dataset.route = name || 'home';
    document.body.classList.toggle('immersive', !!route.immersive);
    $('#appTitle').textContent = route.title;
    document.title = name ? `${route.title} · Into the Woods` : 'Into the Woods';
    $('#backBtn').hidden = !route.back;
    $$('#tabbar a').forEach((a) => {
      const on = a.dataset.tab === route.tab;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    view.innerHTML = '';
    cleanup = page.render(view, { sub, params }) || null;
    const restore = name === current ? window.scrollY : (scrollPos[name] || 0);
    window.scrollTo(0, sub ? 0 : restore);
  };

  const same = name === current;
  current = name;
  if (document.startViewTransition && !same && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.startViewTransition(swap);
  } else {
    swap();
  }
}

window.addEventListener('hashchange', navigate);
navigate();

// Back button: return to the previous in-app screen when there is one; otherwise go to More.
let internalNavs = 0;
window.addEventListener('hashchange', () => { internalNavs++; });
$('#backBtn').addEventListener('click', (e) => {
  if (internalNavs > 0) { e.preventDefault(); history.back(); }
});

// ---- Online / offline status ----
const statusBtn = $('#status');
let offlineReady = false;
function renderStatus() {
  const online = navigator.onLine;
  statusBtn.classList.toggle('offline', !online);
  statusBtn.classList.toggle('ready', offlineReady);
  $('.status-text', statusBtn).textContent = online ? 'Online' : 'Offline';
  statusBtn.setAttribute('aria-label', online
    ? `Online${offlineReady ? ', saved for offline use' : ''}`
    : 'Offline. Everything saved still works');
}
window.addEventListener('online', () => { renderStatus(); toast('Back online 📶'); });
window.addEventListener('offline', () => { renderStatus(); toast('Offline: no problem, the app still works 🌲'); });
statusBtn.addEventListener('click', () => {
  if (!navigator.onLine) toast('You\'re offline. Everything in the app still works; maps & video need signal.');
  else toast(offlineReady ? 'Online · the whole app is saved for offline use ✅' : 'Online · saving the app for offline use…');
});
renderStatus();

// ---- Service worker ----
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then((reg) => {
    navigator.serviceWorker.ready.then(() => { offlineReady = true; renderStatus(); });
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      nw?.addEventListener('statechange', () => {
        if (nw.state === 'installed' && navigator.serviceWorker.controller) {
          toast('Updated! Pull the latest by reopening the app.', 4000);
        }
      });
    });
  }).catch(() => {});
}

// Ask the browser to keep our data (checklists, notes) even under storage pressure.
navigator.storage?.persist?.().catch(() => {});

// Capture the install prompt so the More page can offer an "Install" button.
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
