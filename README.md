# Into the Woods

An offline-first, installable web app (PWA) for parents and chaperones on
Thornhill's overnight trip to **Westminster Woods**, Nov 17–19, 2026.

Live: https://furf.github.io/intothewoods/

## Pages

Five tabs: **Home · Packing · Driving · Schedule · Guide**. The header holds an
always-on Online/Offline badge (signal is spotty in the woods) and a phone button for
**Contacts**. Each fact lives in one place:

| Route | What's there |
| --- | --- |
| `#/` Home | Countdown (to the second) → live "Now / Next", today at a glance (the day's major activities; previews day one before the trip), overview video, what students will experience, where they stay, FAQ with its documents, install & share |
| `#/packing` | Student and chaperone lists (the design reference for the rest of the app) |
| `#/map` | Driving: getting there, getting home (opens by default on the last day), campus map |
| `#/schedule` | Day-by-day timeline (`?day=0–2` opens a day). Programs are prominent; routines and meals are compact rows you tap to expand, and whatever is happening now opens on its own. Chaperone notes toggle, "Now" button, add-to-calendar |
| `#/guide` | Guide: before you go (packing list, cabin agreement, games, field guide), handbook sections, then what you might need at camp (campus map, night light, compass) |
| `#/contacts` | From the header. Emergency numbers and the on-campus alarm, phones, radios and kits; camp, Thornhill, chaperones; save all to your phone; your own contacts |
| `#/light`, `#/compass`, `#/cabin`, `#/games`, `#/field` | Opened from Guide, with a Back button |

Phones are mostly put away at camp (photos aside), so the app is built for
preparation, guidance and travel first.

Old `#/more` and `#/travel` links redirect to Guide and Driving.

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

Built with ❤️ for Thornhill by SPARKLER*FUN. Not affiliated with Thornhill Elementary School or Westminster Woods.
