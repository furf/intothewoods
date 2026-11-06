import { esc, icon, at, fmtTime, download, store, today, $$ } from '../ui.js';
import { SCHEDULE, PLACES } from '../data/trip.js';

const KIND = { travel: 'Travel', program: 'Program', meal: 'Meal', routine: '', chaperone: 'Chaperones', evening: 'Evening' };

function pickDay() {
  const idx = SCHEDULE.findIndex((d) => d.date === today());
  return idx >= 0 ? idx : store.get('itw:day', 0);
}

function ics() {
  const pad = (n) => String(n).padStart(2, '0');
  const stamp = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const escI = (s) => String(s).replace(/[\\;,]/g, (c) => '\\' + c).replace(/\n/g, '\\n');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Into the Woods//Trip//EN', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Westminster Woods Trip'];
  const now = stamp(new Date());
  SCHEDULE.forEach((day) => {
    day.items.forEach((it, i) => {
      if (!it.cal) return;
      const start = at(day.date, it.t);
      const nextT = day.items[i + 1]?.t;
      const end = it.end ? at(day.date, it.end) : nextT ? at(day.date, nextT) : new Date(start.getTime() + 30 * 6e4);
      lines.push('BEGIN:VEVENT',
        `UID:${day.date}-${it.t.replace(':', '')}@intothewoods`,
        `DTSTAMP:${now}`,
        `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
        `SUMMARY:${escI(it.title)}`,
        `LOCATION:${escI(it.where || (it.kind === 'travel' && i < 2 && day === SCHEDULE[0] ? 'Thornhill Elementary School' : PLACES.camp.address))}`,
        `DESCRIPTION:${escI([it.desc, it.chap && 'Chaperones: ' + it.chap].filter(Boolean).join('\n'))}`,
        'END:VEVENT');
    });
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function itemHTML(day, it, i) {
  const k = KIND[it.kind];
  return `<li class="ev ev-${it.kind}" data-i="${i}">
    <div class="ev-time"><b>${fmtTime(it.t).replace(/ (am|pm)/, '<small>$1</small>')}</b>${it.approx ? '<em>approx</em>' : ''}</div>
    <div class="ev-dot" aria-hidden="true"></div>
    <div class="ev-body">
      ${k ? `<span class="ev-kind">${k}</span>` : ''}
      <h3>${esc(it.title)}${it.with ? ` <span class="with">with ${esc(it.with)}</span>` : ''}</h3>
      ${it.end ? `<p class="ev-meta">${icon('clock')}${fmtTime(it.t)} – ${fmtTime(it.end)}</p>` : ''}
      ${it.where ? `<p class="ev-meta">${icon('pin')}${esc(it.where)}</p>` : ''}
      ${it.desc ? `<p>${esc(it.desc)}</p>` : ''}
      ${it.chap ? `<p class="chap-note"><b>Chaperones:</b> ${esc(it.chap)}</p>` : ''}
    </div>
  </li>`;
}

export default {
  render(el) {
    let dayIdx = pickDay();
    el.innerHTML = `
      <div class="page">
        <div class="seg" role="tablist" aria-label="Trip day">
          ${SCHEDULE.map((d, i) => `<button role="tab" type="button" data-day="${i}"><b>${d.short}</b><small>${d.date.slice(5).replace('-', '/')}</small></button>`).join('')}
        </div>
        <div id="dayView"></div>
        <div class="card actions-card">
          <button class="btn" type="button" id="icsBtn">${icon('calendar')} Add trip to my calendar</button>
          <p class="muted small">Adds the main programs and travel times. Times are from Thornhill's Week 12 schedule; "approx" times may shift on site.</p>
        </div>
      </div>`;

    const dayView = el.querySelector('#dayView');
    const show = (i, scrollToNow) => {
      dayIdx = i;
      store.set('itw:day', i);
      const day = SCHEDULE[i];
      $$('.seg button', el).forEach((b, j) => b.setAttribute('aria-selected', String(j === i)));
      dayView.innerHTML = `
        <h2 class="day-title">${esc(day.day)} <span>${esc(day.label)}</span></h2>
        <ol class="timeline">${day.items.map((it, j) => itemHTML(day, it, j)).join('')}</ol>`;
      markNow(scrollToNow);
    };

    const markNow = (scroll) => {
      const day = SCHEDULE[dayIdx];
      const now = new Date();
      let curI = -1;
      day.items.forEach((it, j) => { if (at(day.date, it.t) <= now) curI = j; });
      const last = day.items[day.items.length - 1];
      const dayOver = now > at(day.date, last.t) && today(now) !== day.date;
      $$('.ev', dayView).forEach((li, j) => {
        li.classList.toggle('past', curI >= 0 && (j < curI || dayOver));
        li.classList.toggle('now', j === curI && !dayOver);
      });
      if (scroll) dayView.querySelector('.ev.now')?.scrollIntoView({ block: 'center' });
    };

    el.querySelector('.seg').addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (b) show(Number(b.dataset.day));
    });
    el.querySelector('#icsBtn').addEventListener('click', () => download('westminster-woods-trip.ics', ics(), 'text/calendar'));

    show(dayIdx, true);
    const t = setInterval(() => markNow(false), 60000);
    return () => clearInterval(t);
  },
};
