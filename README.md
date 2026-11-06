# Into the Woods

An offline-first, installable web app (PWA) for parents and chaperones on
Thornhill's overnight trip to **Westminster Woods**, Nov 17–19, 2026.

Live: https://furf.github.io/intothewoods/

## Pages

Five tabs: **Home · Schedule · Packing · Chaperones · Contacts**. Each fact lives in one place:

| Route | What's there |
| --- | --- |
| `#/` Home | Countdown → live "Now / Next", trip at a glance, overview video, what students will experience, where they stay, FAQ with its documents, install & share |
| `#/schedule` | Day-by-day timeline. Programs are prominent; routines and meals are compact rows you tap to expand. Chaperone notes toggle, "Now" button, add-to-calendar |
| `#/packing` | Student and chaperone lists (the design reference for the rest of the app) |
| `#/guide` | Chaperones: at-camp tools (map, night light, compass), cabin activities (agreement, games, field guide), handbook sections |
| `#/contacts` | Emergency numbers and the on-campus alarm, phones, radios and kits; camp, Thornhill, chaperones; save all to your phone; your own contacts |
| `#/map`, `#/light`, `#/compass`, `#/cabin`, `#/games`, `#/field` | Opened from Chaperones, with a Back button |

Old `#/more` and `#/travel` links redirect to Chaperones and the map.

## Design rules

The packing checklist is the model: one job per screen, list rows with 44px+ targets,
quiet chrome. The handwritten face (Gochi Hand) is only for page and section titles and
brand moments; anything you scan or tap is Nunito. Category color goes on dots, icons and
labels, never on side stripes. No emoji as icons.

## Editing content

All trip content lives in plain data files, no build step:

- `js/data/trip.js`: dates, schedule, links, FAQ
- `js/data/people.js`: contacts (**add teacher and chaperone phone numbers here**)
- `js/data/packing.js`, `guide.js`, `games.js`, `field.js`

After changing any file, bump `VERSION` in `sw.js` (and add new files to its
`SHELL` list). Installed copies download the new version in the background and show
"A new version is ready · Reload"; nothing switches until the person taps it.

## Run & deploy

```bash
python3 -m http.server 8000
```

Deploy by pushing to the `gh-pages` branch:

```bash
git push origin HEAD:gh-pages
```

## Tech

Vanilla ES modules + a tiny hash router: no framework and no build. The
whole app, including fonts, images and icons, is about 500 KB. Every page is
precached by the service worker, so the app runs fully offline.
Self-hosted fonts: Gochi Hand & Nunito (SIL OFL).

Unofficial helper made by Thornhill parents; not affiliated with Westminster Woods.
