import { esc, icon, copy } from '../ui.js';
import { PLACES, MAPS } from '../data/trip.js';

export default {
  render(el) {
    el.innerHTML = `
      <div class="page">
        <section class="card">
          <h2>Trip day plan</h2>
          <ol class="mini-timeline">
            <li><time>Tue 8:00</time><div><b>Meet at Thornhill</b><p>${esc(PLACES.school.address)}</p></div></li>
            <li><time>8:30</time><div><b>Depart in parent vehicles</b><p>Carpools are assigned by the teachers.</p></div></li>
            <li><time>10:15</time><div><b>Arrive at Westminster Woods</b><p>Park as directed; students stretch & use the restroom.</p></div></li>
            <li><time>Thu PM</time><div><b>Depart camp</b><p>Back at Thornhill around 3:00 pm.</p></div></li>
          </ol>
        </section>

        <section class="card">
          <h2>Where we're going</h2>
          <div class="address">
            ${icon('pin')}
            <div><b>${esc(PLACES.camp.name)}</b><span>${esc(PLACES.camp.address)}</span></div>
            <button class="icon-btn" type="button" id="copyAddr" aria-label="Copy address">${icon('copy')}</button>
          </div>
          <div class="btn-grid">
            <a class="btn" href="${MAPS.google}" target="_blank" rel="noopener">${icon('car')} Google Maps from Thornhill</a>
            <a class="btn ghost-dark" href="${MAPS.googleHere}" target="_blank" rel="noopener">${icon('pin')} From here</a>
            <a class="btn ghost-dark" href="${MAPS.apple}" target="_blank" rel="noopener">Apple Maps</a>
            <a class="btn ghost-dark" href="${MAPS.waze}" target="_blank" rel="noopener">Waze</a>
          </div>
          <div class="map-embed" id="mapEmbed">
            <div class="map-offline">${icon('map')}<p>The live map needs a connection.<br>Your directions links still open in your maps app.</p></div>
          </div>
        </section>

        <section class="card">
          <h2>Driving tips</h2>
          <ul class="bullets">
            <li><b>About 1½–2 hours</b> from Oakland, depending on traffic. Leave on time; arrival is 10:15.</li>
            <li><b>Cell service fades</b> on the final winding stretch through the redwoods near Occidental. Start navigation before you leave, or download an offline map area in Google Maps.</li>
            <li>The last roads are <b>narrow and curvy</b>. Car-sick kids do better up front-facing with a window cracked; pack a bag just in case.</li>
            <li>Students carry their own luggage to the cabin, so keep it to what they can manage.</li>
            <li>Heading home Thursday? <a href="${MAPS.returnHome}" target="_blank" rel="noopener">Directions back to Thornhill</a>.</li>
          </ul>
        </section>

        <a class="map-teaser card flush" href="#/map">
          <img src="img/campus-map.webp" alt="Westminster Woods main campus map" width="1159" height="893" loading="lazy">
          <span class="map-teaser-label">${icon('expand')} Open campus map</span>
        </a>
      </div>`;

    el.querySelector('#copyAddr').addEventListener('click', () => copy(PLACES.camp.address, 'Address copied'));

    const embed = el.querySelector('#mapEmbed');
    const load = () => {
      if (!navigator.onLine || embed.querySelector('iframe')) return;
      embed.insertAdjacentHTML('afterbegin', `<iframe title="Driving route from Thornhill to Westminster Woods" src="${MAPS.embed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`);
    };
    load();
    window.addEventListener('online', load);
    return () => window.removeEventListener('online', load);
  },
};
