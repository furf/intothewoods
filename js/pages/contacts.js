import { esc, icon, telHref, smsHref, download, store, toast, formatPhone } from '../ui.js';
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

// Every trip contact with a number, for the one-tap "save all" download.
let registry = [];
function card(contact, opts = {}) {
  // Format on render, so numbers that people typed in any style look the same.
  const c = { ...contact, phone: formatPhone(contact.phone) };
  if (!opts.noSave && (c.phone || c.email)) registry.push(c);
  // Toll-free numbers (800, 833, 844, 855, 866, 877, 888) cannot receive texts.
  const canText = c.phone && !/^9-?1-?1$/.test(c.phone) && !/^\(8(00|33|44|55|66|77|88)\)/.test(c.phone);
  return `<article class="contact ${opts.cls || ''}">
    <div class="avatar" aria-hidden="true">${opts.cls === 'urgent' ? icon('alert') : esc((c.name.match(/\b\w/g) || []).slice(0, 2).join(''))}</div>
    <div class="contact-main">
      <b>${esc(c.name)}</b>${c.aka ? ` <span class="muted small">(${esc(c.aka)})</span>` : ''}
      <small>${esc(c.role || '')}</small>
      ${c.phone ? `<span class="contact-line">${esc(c.phone)}</span>` : '<span class="contact-line tbd">Number coming soon</span>'}
      ${c.note ? `<p class="small">${esc(c.note)}</p>` : ''}
    </div>
    <div class="contact-actions">
      ${c.phone ? `<a class="act call" href="${telHref(c.phone)}" aria-label="Call ${esc(c.name)}">${icon('phone')}Call${c.phone === '911' ? ' 911' : ''}</a>` : ''}
      ${canText ? `<a class="act" href="${smsHref(c.phone)}" aria-label="Text ${esc(c.name)}">${icon('msg')}Text</a>` : ''}
      ${c.email ? `<a class="act" href="mailto:${esc(c.email)}" aria-label="Email ${esc(c.name)}">${icon('mail')}Email</a>` : ''}
      ${opts.del != null ? `<button class="act" type="button" data-del="${opts.del}" aria-label="Remove ${esc(c.name)}">${icon('x')}Remove</button>` : ''}
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
          ${EMERGENCY.map((c) => card(c, { cls: 'urgent', noSave: true })).join('')}
          <section class="card alert-card">
            <h2>At camp</h2>
            <dl class="pairs">${ON_SITE.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
          </section>

          <h2 class="group-title">Westminster Woods</h2>
          ${card({ name: PLACES.camp.name, role: 'Camp office · Evening Coordinator on site at night', phone: PLACES.camp.phone, address: PLACES.camp.address, org: 'Westminster Woods' })}

          <h2 class="group-title">Thornhill</h2>
          ${TEACHERS.map((c) => card({ ...c, org: 'Thornhill School' })).join('')}
          ${card({ ...SCHOOL, org: 'Thornhill School' })}

          <h2 class="group-title">Chaperones</h2>
          ${CHAPERONES.map((c) => card({ ...c, org: 'Thornhill School' })).join('')}
          <p class="muted small pad">More chaperones will be added here soon.</p>

          <button class="btn wide ghost" type="button" id="saveAll">${icon('download')} Save all trip contacts to my phone</button>

          <h2 class="group-title">My contacts</h2>
          <p class="lead small">Saved on this device only.</p>
          ${mine.map((c, i) => card(c, { del: i, noSave: true })).join('') || '<p class="muted small pad">Add a co-chaperone or your cabin buddy so their number is here even without signal.</p>'}
          <form class="card add-contact" id="addForm">
            <input name="name" placeholder="Name" required maxlength="60" autocomplete="off">
            <input name="role" placeholder="Role (e.g. Cabin 12 co-chaperone)" maxlength="80" autocomplete="off">
            <input name="phone" placeholder="Phone" type="tel" maxlength="30" autocomplete="off">
            <button class="btn" type="submit">${icon('plus')} Add contact</button>
          </form>
        </div>`;

      el.querySelector('#saveAll').addEventListener('click', () => {
        download('westminster-woods-trip-contacts.vcf', registry.map(vcard).join('\r\n'), 'text/vcard');
      });
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
