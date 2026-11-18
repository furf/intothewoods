// Hourly weather at camp from the National Weather Service (api.weather.gov, free, no key),
// with stale-while-revalidate: a page shows the last saved forecast at once, asks for a fresh one,
// and redraws when it arrives.
import { esc, icon, store, today } from './ui.js';
import { PLACES, SCHEDULE } from './data/trip.js';

const KEY = 'itw:weather';
const URL_KEY = 'itw:nwsHourlyUrl';
const FORMAT = 2; // saved forecasts in an older format (Open-Meteo) are ignored
const { lat, lon } = PLACES.camp;
const POINTS = `https://api.weather.gov/points/${lat},${lon}`;
const TRIP_DATES = new Set(SCHEDULE.map((d) => d.date));

// NWS describes the sky in words ("Mostly Cloudy", "Chance Light Rain") → [day icon, night icon]
function sky(text = '') {
  const t = text.toLowerCase();
  if (/thunder/.test(t)) return ['storm', 'storm'];
  if (/snow|sleet|flurr|ice/.test(t)) return ['snow', 'snow'];
  if (/rain|shower|drizzle/.test(t)) return ['rain', 'rain'];
  if (/fog|haze|smoke|mist/.test(t)) return ['fog', 'fog'];
  if (/mostly cloudy|overcast|^cloudy/.test(t)) return ['cloud', 'cloud'];
  if (/partly|mostly sunny|mostly clear|few clouds/.test(t)) return ['cloudsun', 'cloudmoon'];
  if (/sunny|clear|fair/.test(t)) return ['sun', 'moon'];
  return ['cloud', 'cloud'];
}

const listeners = new Set();
let inflight = null;
let failed = false; // the last refresh did not succeed

export function cachedWeather() {
  const w = store.get(KEY, null);
  return w && w.v === FORMAT ? w : null;
}

// Calls fn with the forecast after every refresh, also when a refresh fails. Returns an unsubscribe function.
export function onWeather(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

async function getJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

// The hourly forecast URL for camp comes from the /points lookup. It does not change, so it is saved.
async function hourlyPeriods() {
  let url = store.get(URL_KEY, null);
  if (!url) {
    url = (await getJSON(POINTS)).properties.forecastHourly;
    store.set(URL_KEY, url);
  }
  try {
    return (await getJSON(url)).properties.periods;
  } catch (e) {
    store.set(URL_KEY, null); // the saved URL may be out of date: look it up again next time
    throw e;
  }
}

// Fetches a fresh forecast (one request at a time) and saves it. Offline, it does nothing.
// NWS gives only coming hours, so new hours are merged into the saved ones: hours seen earlier stay.
export function refreshWeather() {
  if (!navigator.onLine) return Promise.resolve(null);
  inflight ||= hourlyPeriods()
    .then((periods) => {
      const hours = { ...(cachedWeather()?.hours || {}) };
      for (const p of periods) {
        const key = `${p.startTime.slice(0, 13)}:00`; // local camp time, e.g. 2026-11-18T14:00
        if (!TRIP_DATES.has(key.slice(0, 10))) continue;
        hours[key] = { temp: p.temperature, rain: p.probabilityOfPrecipitation?.value ?? null, sky: p.shortForecast, day: p.isDaytime };
      }
      const w = { v: FORMAT, fetchedAt: Date.now(), hours };
      store.set(KEY, w);
      failed = false;
      return w;
    })
    .catch(() => { failed = true; return null; })
    .finally(() => {
      inflight = null;
      const w = cachedWeather();
      listeners.forEach((fn) => fn(w));
    });
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
  const credit = '<a href="https://www.weather.gov/" target="_blank" rel="noopener">Weather: National Weather Service</a>';
  if (!w) {
    const msg = !navigator.onLine ? 'The forecast loads the first time you are online.'
      : failed ? 'Could not load the forecast. It tries again each time you open this page.'
        : 'Loading the forecast…';
    return `<p class="wx-status">${msg} · ${credit}</p>`;
  }
  const chips = dayHours(i).map((h) => {
    const x = w.hours[`${day.date}T${String(h).padStart(2, '0')}:00`];
    if (!x) return '';
    const [dayIcon, nightIcon] = sky(x.sky);
    const state = !isToday ? '' : h === now.getHours() ? 'now' : h < now.getHours() ? 'past' : '';
    const rain = Number.isFinite(x.rain) ? `${x.rain}%` : '';
    return `<li class="${state}" data-h="${h}" aria-label="${hourLabel(h)}: ${x.temp}°F, ${esc(x.sky)}${rain ? `, ${rain} chance of rain` : ''}">
      <time aria-hidden="true">${state === 'now' ? 'Now' : hourLabel(h)}</time>
      ${icon(x.day ? dayIcon : nightIcon, 'wx-ic')}
      <b aria-hidden="true">${x.temp}°</b>
      <small aria-hidden="true">${rain ? `${icon('drop', 'wx-drop')}${rain}` : ''}</small>
    </li>`;
  }).join('');
  const note = !navigator.onLine ? 'Offline · ' : failed ? 'Could not update · ' : '';
  const status = `<p class="wx-status">${note}Updated ${updatedLabel(w.fetchedAt)} · ${credit}</p>`;
  if (!chips) {
    // NWS forecasts only coming hours: a past day shows what was saved, if anything.
    const msg = day.date < today(now) ? 'No forecast was saved for this day.' : 'The forecast for this day is not out yet.';
    return `<p class="wx-empty">${msg}</p>${status}`;
  }
  return `<ol class="wx-hours" aria-label="Hourly weather, ${esc(day.day)}">${chips}</ol>${status}`;
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
