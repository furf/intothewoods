import { esc, icon, at, fmtTime } from '../ui.js';
import { TRIP, QUICK, EXPERIENCE, STAY, FAQ, LINKS, SCHEDULE } from '../data/trip.js';

const TILES = [
  ['#/schedule', 'calendar', 'Schedule'],
  ['#/packing', 'pack', 'Packing'],
  ['#/travel', 'car', 'Directions'],
  ['#/map', 'map', 'Campus map'],
  ['#/contacts', 'phone', 'Contacts'],
  ['#/guide', 'book', 'Chaperones'],
  ['#/games', 'puzzle', 'Games'],
  ['#/compass', 'compass', 'Compass'],
];

// Find what's happening now / next during the trip.
export function nowNext(now = new Date()) {
  const all = SCHEDULE.flatMap((d) => d.items.map((it) => ({ ...it, day: d, start: at(d.date, it.t) })));
  let cur = null, next = null;
  for (let i = 0; i < all.length; i++) {
    const it = all[i];
    // An item lasts until its own end time, or until the next item starts (overnight included).
    const end = it.end ? at(it.day.date, it.end) : all[i + 1]?.start;
    if (now >= it.start && (!end || now < end)) cur = it;
    if (it.start > now) { next = it; break; }
  }
  // Overnight: after lights out, "now" is sleep.
  if (cur && cur.title === 'Lights Out' && next && next.day.date !== cur.day.date) cur = { ...cur, title: 'Sleeping 😴', desc: 'Lights out. See you at 7:00 am.' };
  return { cur, next };
}

function countdown(target) {
  const ms = target - Date.now();
  if (ms <= 0) return null;
  const d = Math.floor(ms / 864e5), h = Math.floor((ms % 864e5) / 36e5), m = Math.floor((ms % 36e5) / 6e4);
  return { d, h, m };
}

function statusCard() {
  const start = new Date(TRIP.start), end = new Date(TRIP.end), now = new Date();
  if (now < start) {
    const c = countdown(start);
    return `<div class="countdown" aria-label="Countdown to departure">
      <div><b>${c.d}</b><span>days</span></div>
      <div><b>${c.h}</b><span>hours</span></div>
      <div><b>${c.m}</b><span>min</span></div>
    </div>
    <p class="hero-note">until we meet at Thornhill: <b>Tue Nov 17, 8:00 am</b></p>`;
  }
  if (now > end) {
    return '<p class="hero-note big">We made it home! 🌲 Thanks for an amazing trip.</p>';
  }
  const { cur, next } = nowNext(now);
  return `<div class="nownext">
    ${cur ? `<a class="nn now" href="#/schedule"><small>Now</small><b>${esc(cur.title)}</b><span>${fmtTime(cur.t)}${cur.where ? ' · ' + esc(cur.where) : ''}</span></a>` : ''}
    ${next ? `<a class="nn" href="#/schedule"><small>Next · ${esc(next.day.short)}</small><b>${esc(next.title)}</b><span>${fmtTime(next.t)}${next.where ? ' · ' + esc(next.where) : ''}</span></a>` : ''}
  </div>`;
}

export default {
  render(el) {
    el.innerHTML = `
      <section class="hero">
        <img class="logo" src="img/logo.webp" alt="Westminster Woods" width="919" height="163">
        <h2 class="hero-title">Thornhill goes into the woods</h2>
        <p class="sub">${esc(TRIP.dates)} · Overnight field trip</p>
        <div class="hero-card" id="heroStatus">${statusCard()}</div>
        <svg class="ridge" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 60 L0 38 L18 22 L30 34 L46 10 L62 32 L74 20 L92 40 L110 16 L126 34 L140 24 L158 44 L176 14 L192 36 L206 26 L224 46 L240 18 L258 38 L270 28 L288 42 L304 12 L320 34 L334 24 L352 44 L368 20 L384 36 L400 26 L400 60 Z"/></svg>
      </section>

      <div class="page">
        <nav class="tiles" aria-label="Quick links">
          ${TILES.map(([h, i, l]) => `<a href="${h}">${icon(i)}<span>${l}</span></a>`).join('')}
        </nav>

        <section class="card">
          <h2>The quick details</h2>
          <dl class="facts">${QUICK.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
        </section>

        <section class="card flush">
          <div class="video" id="video">
            <button class="video-facade" type="button" aria-label="Play the Westminster Woods overview video">
              <img src="img/trees.webp" alt="" width="120" height="136">
              <span class="play">${icon('play')}</span>
              <span class="video-label">Watch: Westminster Woods overview</span>
            </button>
          </div>
          <p class="video-note" id="videoNote">See the forest, the cabins and the dining hall before you go.</p>
        </section>

        <section class="card">
          <h2>What we'll be experiencing</h2>
          <ul class="exp">${EXPERIENCE.map((e) => `<li><span class="exp-ic" aria-hidden="true">${e.icon}</span><div><b>${esc(e.title)}</b><p>${esc(e.text)}</p></div></li>`).join('')}</ul>
        </section>

        <section class="card">
          <h2>Cabins, groups &amp; meals</h2>
          <ul class="bullets">${STAY.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
        </section>

        <section class="card">
          <h2>Food &amp; documents</h2>
          <p class="muted small">These open in Google Drive and need a connection.</p>
          <div class="linklist">${LINKS.map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}${icon('external')}</a>`).join('')}</div>
        </section>

        <section class="card">
          <h2>Questions</h2>
          ${FAQ.map(([q, a]) => `<details class="faq"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}
        </section>

        <p class="footnote">Unofficial trip helper made by Thornhill parents. Not affiliated with Westminster Woods.</p>
      </div>`;

    // Lite YouTube: only load the player on tap (keeps the page fast & offline-friendly).
    const video = el.querySelector('#video');
    video.querySelector('button').addEventListener('click', () => {
      if (!navigator.onLine) {
        el.querySelector('#videoNote').textContent = 'The video needs a connection. Try again when you have signal.';
        return;
      }
      video.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${TRIP.video}?autoplay=1&rel=0&playsinline=1" title="Westminster Woods overview video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe>`;
    });

    const tick = setInterval(() => {
      const h = el.querySelector('#heroStatus');
      if (h) h.innerHTML = statusCard();
    }, 30000);
    return () => clearInterval(tick);
  },
};
