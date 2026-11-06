import { esc, icon, telHref, smsHref, download, store, toast } from '../ui.js';
import { EMERGENCY, ON_SITE, TEACHERS, SCHOOL, CHAPERONES } from '../data/people.js';
import { PLACES } from '../data/trip.js';

const KEY = 'itw:myContacts';

function vcard(c) {
  const [first, ...rest] = c.name.split(' ');
  return ['BEGIN:VCARD', 'VERSION:3.0', `N:${rest.join(' ')};${first};;;`, `FN:${c.name}`,
    c.org ? `ORG:${c.org}` : 'ORG:Westminster Woods Trip', c.role ? `TITLE:${c.role}` : '',
    c.phone ? `TEL;TYPE=CELL:${c.phone}` : '', c.email ? `EMAIL:${c.email}` : '',
    c.address ? `ADR;TYPE=WORK:;;${c.address.replace(/,/g, '\\,')};;;;` : '',
    'END:VCARD'].filter(Boolean).join('\r\n');
}

let registry = [];
function card(c, opts = {}) {
  const i = registry.push(c) - 1;
  const canText = c.phone && !/^9-?1-?1$/.test(c.phone) && !/^1-800/.test(c.phone);
  return `<article class="contact ${opts.cls || ''}">
    <div class="avatar" aria-hidden="true">${esc((c.name.match(/\b\w/g) || []).slice(0, 2).join(''))}</div>
    <div class="contact-main">
      <b>${esc(c.name)}</b>${c.aka ? ` <span class="muted small">(${esc(c.aka)})</span>` : ''}
      <small>${esc(c.role || '')}</small>
      ${c.phone ? `<a class="contact-line" href="${telHref(c.phone)}">${esc(c.phone)}</a>` : '<span class="contact-line tbd">Phone: coming soon</span>'}
      ${c.email ? `<a class="contact-line" href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : ''}
      ${c.note ? `<p class="small">${esc(c.note)}</p>` : ''}
    </div>
    <div class="contact-actions">
      ${c.phone ? `<a class="round" href="${telHref(c.phone)}" aria-label="Call ${esc(c.name)}">${icon('phone')}</a>` : ''}
      ${canText ? `<a class="round" href="${smsHref(c.phone)}" aria-label="Text ${esc(c.name)}">${icon('msg')}</a>` : ''}
      ${c.email ? `<a class="round" href="mailto:${esc(c.email)}" aria-label="Email ${esc(c.name)}">${icon('mail')}</a>` : ''}
      ${!opts.noSave && (c.phone || c.email) ? `<button class="round" type="button" data-vcf="${i}" aria-label="Save ${esc(c.name)} to contacts">${icon('download')}</button>` : ''}
      ${opts.del != null ? `<button class="round" type="button" data-del="${opts.del}" aria-label="Remove ${esc(c.name)}">${icon('x')}</button>` : ''}
    </div>
  </article>`;
}

export default {
  render(el) {
    const draw = () => {
      registry = [];
      const mine = store.get(KEY, []);
      el.innerHTML = `
        <div class="page">
          <h2 class="group-title danger">${icon('alert')} Emergency</h2>
          ${EMERGENCY.map((c) => card(c, { cls: 'urgent', noSave: c.phone === '911' })).join('')}
          <details class="acc">
            <summary><span>On campus: alarm, phones, radios</span><span class="chev" aria-hidden="true"></span></summary>
            <div class="acc-body"><dl class="pairs">${ON_SITE.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>
          </details>

          <h2 class="group-title">Camp</h2>
          ${card({ name: PLACES.camp.name, role: 'Camp office', phone: PLACES.camp.phone, address: PLACES.camp.address, org: 'Westminster Woods', note: PLACES.camp.address })}

          <h2 class="group-title">Trip leaders</h2>
          ${TEACHERS.map((c) => card({ ...c, org: 'Thornhill School' })).join('')}
          ${card({ ...SCHOOL, org: 'Thornhill School', note: SCHOOL.address })}

          <h2 class="group-title">Chaperones</h2>
          ${CHAPERONES.map((c) => card({ ...c, org: 'Thornhill School' })).join('')}
          <p class="muted small pad">More chaperones will be added here soon.</p>

          <h2 class="group-title">My contacts <span class="muted small">(this device only)</span></h2>
          ${mine.map((c, i) => card(c, { del: i })).join('') || '<p class="muted small pad">Add a co-chaperone or your cabin buddy so their number is here even without signal.</p>'}
          <form class="card add-contact" id="addForm">
            <input name="name" placeholder="Name" required maxlength="60" autocomplete="off">
            <input name="role" placeholder="Role (e.g. Cabin 12 co-chaperone)" maxlength="80" autocomplete="off">
            <input name="phone" placeholder="Phone" type="tel" maxlength="30" autocomplete="off">
            <button class="btn" type="submit">${icon('plus')} Add contact</button>
          </form>
        </div>`;

      el.querySelectorAll('[data-vcf]').forEach((b) => b.addEventListener('click', () => {
        const c = registry[Number(b.dataset.vcf)];
        download(`${c.name.replace(/\W+/g, '-')}.vcf`, vcard(c), 'text/vcard');
      }));
      el.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => {
        const list = store.get(KEY, []);
        list.splice(Number(b.dataset.del), 1);
        store.set(KEY, list); draw();
      }));
      el.querySelector('#addForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const c = { name: f.get('name').trim(), role: f.get('role').trim(), phone: f.get('phone').trim() };
        if (!c.name) return;
        store.set(KEY, [...store.get(KEY, []), c]);
        toast('Saved on this device');
        draw();
      });
    };
    draw();
  },
};
