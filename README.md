# Into the Woods

An offline-first, installable web app (PWA) for parents and chaperones on
Thornhill's overnight trip to **Westminster Woods**, Nov 17–19, 2026.

Live: https://furf.github.io/intothewoods/

## Pages

Five tabs: **Home · Schedule · Packing · Chaperones · More**. Each fact lives in one place:

| Route | What's there |
| --- | --- |
| `#/` Home | Countdown → live "Now / Next", trip at a glance (the one place for logistics), overview video, what students will experience, where they stay, FAQ with its documents |
| `#/schedule` | Day-by-day timeline. Programs are prominent; routines and meals are compact rows you tap to expand. Chaperone notes toggle, "Now" button, add-to-calendar |
| `#/packing` | Student and chaperone lists |
| `#/guide` | Chaperones: shortcuts to schedule, emergencies and packing; handbook sections (role, tools of the trade, homesickness, bedtime & overnight, rules, good to know); cabin activities |
| `#/map` | Getting there (address, maps apps, live route, driving tips) and the zoomable campus map |
| `#/contacts` | Emergency numbers and the on-campus alarm, phones, radios and kits; camp, Thornhill, chaperones, your own contacts |
| `#/games`, `#/cabin`, `#/field` | Games & riddles, cabin agreement, field guide |
| `#/compass`, `#/light` | Compass with find-your-way-back; night light |

## Editing content

All trip content lives in plain data files, no build step:

- `js/data/trip.js`: dates, schedule, links, FAQ
- `js/data/people.js`: contacts (**add teacher and chaperone phone numbers here**)
- `js/data/packing.js`, `guide.js`, `games.js`, `field.js`

After changing any file, bump `VERSION` in `sw.js` (and add new files to its
`SHELL` list) so installed copies update.

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
