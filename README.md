# Into the Woods

An offline-first, installable web app (PWA) for parents and chaperones on
Thornhill's overnight trip to **Westminster Woods**, Nov 17–19, 2026.

Live: https://furf.github.io/intothewoods/

## Pages

| Route | What's there |
| --- | --- |
| `#/` Home | Countdown → live "Now / Next" during the trip, quick details, overview video, what students will experience, cabins & meals, food docs, FAQ |
| `#/schedule` | Day-by-day timeline (Thornhill Week 12 schedule + details from the trip slides & handbook), live "now" marker, chaperone notes, add-to-calendar (.ics) |
| `#/packing` | Student packing list + chaperone list, progress ring, custom items, app-icon badge |
| `#/guide` | Chaperone roles & responsibilities, a day in your boots, Tools of the Trade cards, homesickness, bedtime, nighttime, rules, emergencies |
| `#/travel` | Trip-day plan, address, Google/Apple/Waze links, embedded route map, driving tips |
| `#/map` | Campus map from the handbook with pinch-zoom + key spots |
| `#/contacts` | Emergency, camp, teachers, chaperones; tap to call/text/email, save as vCard, add your own (stored on device) |
| `#/games` | Riddles (tap to reveal), easy-to-lead games with a random picker, conversation-starter deck |
| `#/cabin` | Interactive cabin community guidelines (bring / leave behind + signatures) |
| `#/field` | Redwood-forest field guide with "I spotted it!" tracking, Leave No Trace |
| `#/compass` | Compass, GPS position, save a spot & arrow back to it, signal check |
| `#/light` | Red/amber/white night light that keeps the screen awake |

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
