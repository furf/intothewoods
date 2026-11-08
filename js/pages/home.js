import { esc, icon, at, fmtTime, today, isStandalone, shareOrCopy, toast } from '../ui.js';
import { TRIP, EXPERIENCE, STAY, FAQ, SCHEDULE } from '../data/trip.js';


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
  const d = Math.floor(ms / 864e5), h = Math.floor((ms % 864e5) / 36e5), m = Math.floor((ms % 36e5) / 6e4), s = Math.floor((ms % 6e4) / 1e3);
  return { d, h, m, s };
}

function statusCard() {
  const start = new Date(TRIP.start), end = new Date(TRIP.end), now = new Date();
  if (now < start) {
    const c = countdown(start);
    const two = (n) => String(n).padStart(2, '0');
    return `<div class="countdown" role="timer" aria-label="Countdown to departure">
      <div><b>${c.d}</b><span>days</span></div>
      <div><b>${two(c.h)}</b><span>hours</span></div>
      <div><b>${two(c.m)}</b><span>min</span></div>
      <div><b>${two(c.s)}</b><span>sec</span></div>
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

// The day's major activities (the ones that go on the calendar). On a trip day that's today;
// before the trip it previews day one; after the trip there's nothing to show.
function glance(now = new Date()) {
  let i = SCHEDULE.findIndex((d) => d.date === today(now));
  const isToday = i >= 0;
  if (!isToday) {
    if (now > new Date(TRIP.end)) return '';
    i = 0;
  }
  const day = SCHEDULE[i];
  const items = day.items.filter((it) => it.cal);
  const rows = items.map((it, j) => {
    const start = at(day.date, it.t);
    const nextStart = items[j + 1] && at(day.date, items[j + 1].t);
    const end = it.end ? at(day.date, it.end) : nextStart;
    const state = !isToday || now < start ? '' : !end || now < end ? 'now' : 'past';
    return `<li class="${state}">
      <time>${fmtTime(it.t)}${it.approx ? '<small>approx</small>' : ''}</time>
      <span><b>${esc(it.title)}</b>${state === 'now' ? '<em>Now</em>' : ''}${it.where ? `<small>${esc(it.where)}</small>` : ''}</span>
    </li>`;
  }).join('');
  return `<section class="card" id="glance">
    <h2>${isToday ? 'Today' : esc(day.day)} at a glance</h2>
    <p class="muted small glance-sub">${esc(day.label)}${isToday ? '' : ' · ' + esc(day.short) + ' ' + day.date.slice(5).replace('-', '/')}</p>
    <ol class="glance">${rows}</ol>
    <a class="btn small" href="#/schedule?day=${i}">${icon('calendar')} Full schedule</a>
  </section>`;
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
        ${glance()}

        <section class="card flush">
          <div class="video" id="video">
            <button class="video-facade" type="button" aria-label="Play the Westminster Woods overview video">
              <img src="img/trees.webp" alt="" width="120" height="158">
              <span class="play">${icon('play')}</span>
              <span class="video-label">Watch: Westminster Woods overview</span>
            </button>
          </div>
          <p class="video-note" id="videoNote">See the forest, the cabins and the dining hall before you go.</p>
        </section>

        <section class="card">
          <h2>What students will experience</h2>
          <ul class="ilist">${EXPERIENCE.map((e) => `<li><span class="menu-ic">${icon(e.icon)}</span><div><b>${esc(e.title)}</b><p>${esc(e.text)}</p></div></li>`).join('')}</ul>
        </section>

        <section class="card">
          <h2>Where students stay</h2>
          <ul class="bullets">${STAY.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        </section>

        <section class="card">
          <h2>Questions</h2>
          ${FAQ.map((f) => `<details class="faq"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p>${f.links ? `<div class="linklist">${f.links.map(([l, h]) => `<a href="${esc(h)}" target="_blank" rel="noopener">${esc(l)}${icon('external')}</a>`).join('')}</div>` : ''}</details>`).join('')}
        </section>

        <section class="card">
          <h2>Keep it on your phone</h2>
          <div class="install-box">
            <img src="icons/icon-192.png" alt="" width="52" height="52">
            <p class="small muted">${isStandalone()
              ? 'Installed. Everything works without signal.'
              : /iphone|ipad|ipod/i.test(navigator.userAgent)
                ? 'In Safari, tap Share, then \u201cAdd to Home Screen\u201d. Open it once on Wi-Fi and it works without signal.'
                : 'Install it for one-tap access. Open it once on Wi-Fi and it works without signal.'}</p>
          </div>
          <div class="btn-row">
            ${isStandalone() ? '' : `<button class="btn install-btn" type="button" id="installBtn">${icon('download')} Install</button>`}
            <button class="btn ghost-dark" type="button" id="shareBtn">${icon('share')} Share with families</button>
          </div>
        </section>

        <p class="footnote">This app was built with <span role="img" aria-label="love">❤️</span> for Thornhill by <a href="https://sparkler.fun/" target="_blank" rel="noopener">SPARKLER*FUN</a>. Not affiliated with Thornhill Elementary School or Westminster Woods. Site content adapted from materials provided to parents and chaperones.</p>
      </div>`;

    el.querySelector('#installBtn')?.addEventListener('click', async () => {
      const p = window.__installPrompt;
      if (!p) { toast('Use your browser menu: \u201cAdd to Home Screen\u201d or \u201cInstall app\u201d.', 4000); return; }
      p.prompt();
      await p.userChoice.catch(() => {});
      window.__installPrompt = null;
    });
    el.querySelector('#shareBtn').addEventListener('click', () => shareOrCopy({
      title: 'Into the Woods',
      text: 'Thornhill\'s Westminster Woods trip app: schedule, packing checklist, directions and chaperone guide. Works offline.',
      url: location.href.split('#')[0],
    }));

    // Lite YouTube: only load the player on tap (keeps the page fast & offline-friendly).
    const video = el.querySelector('#video');
    video.querySelector('button').addEventListener('click', () => {
      if (!navigator.onLine) {
        el.querySelector('#videoNote').textContent = 'The video needs a connection. Try again when you have signal.';
        return;
      }
      video.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${TRIP.video}?autoplay=1&rel=0&playsinline=1" title="Westminster Woods overview video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe>`;
    });

    // Before the trip the countdown ticks every second; otherwise Now/Next and the glance refresh every 30 s.
    let n = 0;
    const tick = setInterval(() => {
      n++;
      const before = Date.now() < new Date(TRIP.start);
      if (before || n % 30 === 0) {
        const h = el.querySelector('#heroStatus');
        if (h) h.innerHTML = statusCard();
      }
      if (n % 30) return;
      const g = el.querySelector('#glance'), fresh = glance();
      if (g && fresh) g.outerHTML = fresh; else if (g) g.remove();
    }, 1000);
    return () => clearInterval(tick);
  },
};
