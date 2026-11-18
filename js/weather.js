// Hourly weather at camp from Open-Meteo (free, no API key), with stale-while-revalidate:
// a page shows the last saved forecast at once, asks for a fresh one, and redraws when it arrives.
import { esc, icon, store, today } from './ui.js';
import { PLACES, SCHEDULE } from './data/trip.js';

const KEY = 'itw:weather';
const { lat, lon } = PLACES.camp;
const API = 'https://api.open-meteo.com/v1/forecast'
  + `?latitude=${lat}&longitude=${lon}`
  + '&hourly=temperature_2m,precipitation_probability,weather_code,is_day'
  + '&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles'
  + `&start_date=${SCHEDULE[0].date}&end_date=${SCHEDULE[SCHEDULE.length - 1].date}`;

// WMO weather codes → [label, day icon, night icon]
function sky(code) {
  if (code === 0 || code === 1) return ['Clear', 'sun', 'moon'];
  if (code === 2) return ['Partly cloudy', 'cloudsun', 'cloudmoon'];
  if (code === 3) return ['Cloudy', 'cloud', 'cloud'];
  if (code === 45 || code === 48) return ['Fog', 'fog', 'fog'];
  if (code >= 95) return ['Thunderstorm', 'storm', 'storm'];
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return ['Snow', 'snow', 'snow'];
  if (code >= 51 && code <= 82) return [code <= 57 ? 'Drizzle' : 'Rain', 'rain', 'rain'];
  return ['Cloudy', 'cloud', 'cloud'];
}

const listeners = new Set();
let inflight = null;

export const cachedWeather = () => store.get(KEY, null);

// Calls fn with every forecast that arrives. Returns an unsubscribe function.
export function onWeather(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Fetches a fresh forecast (one request at a time) and saves it. Offline, it does nothing.
export function refreshWeather() {
  if (!navigator.onLine) return Promise.resolve(null);
  inflight ||= fetch(API)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
    .then(({ hourly: h }) => {
      const hours = {};
      h.time.forEach((t, i) => {
        hours[t] = { temp: Math.round(h.temperature_2m[i]), rain: h.precipitation_probability[i], code: h.weather_code[i], day: h.is_day[i] === 1 };
      });
      const w = { fetchedAt: Date.now(), hours };
      store.set(KEY, w);
      listeners.forEach((fn) => fn(w));
      return w;
    })
    .catch(() => null)
    .finally(() => { inflight = null; });
  return inflight;
}

// The hours of a trip day's schedule: from the first item's hour to the last item, rounded up.
export function dayHours(i) {
  const items = SCHEDULE[i].items;
  const [h0] = items[0].t.split(':').map(Number);
  const [h1, m1] = items[items.length - 1].t.split(':').map(Number);
  const end = m1 ? h1 + 1 : h1;
  return Array.from({ length: end - h0 + 1 }, (_, k) => h0 + k);
}

const hourLabel = (h) => `${((h + 11) % 12) + 1} ${h < 12 ? 'am' : 'pm'}`;

function updatedLabel(ts) {
  const d = new Date(ts);
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
  return today(d) === today() ? time : `${d.toLocaleDateString('en-US', { weekday: 'short' })} ${time}`;
}

// The strip for trip day i: one chip per hour, the current hour highlighted on today.
function stripHTML(i, w) {
  const day = SCHEDULE[i];
  const now = new Date();
  const isToday = day.date === today(now);
  const credit = '<a href="https://open-meteo.com/" target="_blank" rel="noopener">Weather: Open-Meteo</a>';
  if (!w) {
    return `<p class="wx-status">${navigator.onLine ? 'Loading the forecast…' : 'The forecast loads the first time you are online.'} · ${credit}</p>`;
  }
  const chips = dayHours(i).map((h) => {
    const x = w.hours[`${day.date}T${String(h).padStart(2, '0')}:00`];
    if (!x) return '';
    const [label, dayIcon, nightIcon] = sky(x.code);
    const state = !isToday ? '' : h === now.getHours() ? 'now' : h < now.getHours() ? 'past' : '';
    const rain = Number.isFinite(x.rain) ? `${x.rain}%` : '';
    return `<li class="${state}" data-h="${h}" aria-label="${hourLabel(h)}: ${x.temp}°F, ${esc(label)}${rain ? `, ${rain} chance of rain` : ''}">
      <time aria-hidden="true">${state === 'now' ? 'Now' : hourLabel(h)}</time>
      ${icon(x.day ? dayIcon : nightIcon, 'wx-ic')}
      <b aria-hidden="true">${x.temp}°</b>
      <small aria-hidden="true">${rain ? `${icon('drop', 'wx-drop')}${rain}` : ''}</small>
    </li>`;
  }).join('');
  const offline = navigator.onLine ? '' : 'Offline · ';
  return `<ol class="wx-hours" aria-label="Hourly weather, ${esc(day.day)}">${chips}</ol>
    <p class="wx-status">${offline}Updated ${updatedLabel(w.fetchedAt)} · ${credit}</p>`;
}

// Draws day i's strip into el from the saved forecast, then refreshes it from the network.
// Redraws keep the scroll position; the first draw scrolls today's strip to the current hour.
export function mountWeather(el, i) {
  let first = true;
  const draw = (w) => {
    const prev = el.querySelector('.wx-hours')?.scrollLeft;
    el.innerHTML = stripHTML(i, w);
    const list = el.querySelector('.wx-hours');
    if (!list) return;
    if (!first && prev != null) { list.scrollLeft = prev; return; }
    const now = list.querySelector('.now');
    if (now) list.scrollLeft = Math.max(0, now.offsetLeft - list.offsetLeft - 8);
    first = !w;
  };
  draw(cachedWeather());
  const off = onWeather(draw);
  const onNet = () => draw(cachedWeather());
  window.addEventListener('online', onNet);
  window.addEventListener('offline', onNet);
  return () => { off(); window.removeEventListener('online', onNet); window.removeEventListener('offline', onNet); };
}
