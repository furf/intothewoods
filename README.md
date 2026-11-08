# Into the Woods

Into the Woods is an installable web app for the Thornhill School overnight trip to Westminster Woods (November 17–19, 2026).
Parents and chaperones use it to prepare for the trip and to find information at camp.
The app works offline. Cell signal at camp is weak or not available.

- **Production:** https://thornhill-intothewoods.vercel.app/
- **Stack:** static HTML, CSS and JavaScript modules. There is no framework and no build step.
- **Host:** Vercel. The `main` branch deploys to production. Each other branch gets a preview deployment.
- **Content:** trip data is in plain JavaScript files in `js/data/`.

## Contents

- [Overview](#overview)
- [Getting started](#getting-started)
- [Usage](#usage)
- [Technical details](#technical-details)
- [FAQ](#faq)
- [Contributing](#contributing)

## Overview

The app has five sections in the tab bar:

| Section | Route | Purpose |
| --- | --- | --- |
| Home | `#/home` | Countdown to departure. During the trip, it shows what happens now and next. It also shows today at a glance, an overview video, what students do, where they stay, the FAQ, and install and share buttons. |
| Checklist | `#/checklist` | Packing checklists for students and chaperones. Progress is saved on the device. |
| Directions | `#/directions` | Directions to camp, directions home, and the campus map. The campus map also shows on-campus emergency information. |
| Schedule | `#/schedule` | The timeline for each day of the trip, with notes for chaperones. |
| Guide | `#/guide` | The chaperone handbook, and links to the tools below. |

The header has an online/offline badge and a phone button. The phone button opens Contacts (`#/contacts`): emergency numbers, and camp, school and chaperone contacts.

The Guide links to these tools. Each tool has a Back button that returns to the Guide.

| Tool | Route | Purpose |
| --- | --- | --- |
| Games & Riddles | `#/games` | Riddles, games and question cards for groups of students. |
| Compass | `#/compass` | A compass. You can save a location and find your way back to it. |
| Night Light | `#/night-light` | A full-screen light in red, amber or white. Red keeps night vision. The screen stays on. |
| Field Guide | `#/field-guide` | Plants, animals and the night sky at camp. |
| Cabin Agreement | `#/cabin-agreement` | A tool to write the cabin community guidelines with students. |

Phones are mostly put away at camp. For this reason, the app puts preparation, guidance and travel first.

## Getting started

### Prerequisites

- Git
- Python 3, or a different static file server

### Install

1. Clone the repository:

   ```bash
   git clone https://github.com/furf/intothewoods.git
   ```

2. Go to the project directory:

   ```bash
   cd intothewoods
   ```

There are no dependencies to install.

### Run

1. Start a static file server in the project directory:

   ```bash
   python3 -m http.server 8000
   ```

2. Open `http://localhost:8000` in a browser.

The service worker operates on `localhost` and on HTTPS only.

## Usage

### Edit trip content

All trip content is in `js/data/`. Each file exports plain arrays and objects.

| File | Content |
| --- | --- |
| `trip.js` | Dates, places, map links, schedule, FAQ, and what students do. |
| `people.js` | Emergency numbers, on-campus emergency information, teachers, school and chaperones. |
| `packing.js` | The student and chaperone packing checklists. |
| `guide.js` | The chaperone handbook text. |
| `games.js` | Riddles, games and question cards. |
| `field.js` | Field guide entries. |

To change content:

1. Edit the data file.
2. Increase `VERSION` in `sw.js` by one.
3. Run the app and examine the changed page.
4. Commit the change.

> **Note:** Teacher and chaperone phone numbers are in `js/data/people.js`. Some numbers are not available yet. These contacts show "Number coming soon". You can write a number in any format. Contacts shows it as (###) ###-####.

### Add a page

1. Make a page module in `js/pages/`. Use the route key as the file name, for example `js/pages/packing-tips.js`.
2. Export a default object with a `render(el, { sub, params })` method:

   ```js
   export default {
     render(el, { params }) {
       el.innerHTML = '<div class="page">…</div>';
       return () => { /* optional: remove listeners and timers */ };
     },
   };
   ```

3. Add a route to `ROUTES` in `js/main.js`. Use the same key as the file name.
4. Add the file to the `SHELL` list in `sw.js`.
5. Increase `VERSION` in `sw.js` by one.
6. Add a link to the page, for example `<a href="#/packing-tips">`.

### Release a change

1. Open a pull request. Vercel builds a preview deployment for the branch.
2. Examine the preview deployment on a phone.
3. Merge the pull request into `main`. Vercel deploys `main` to production.

Installed copies of the app download the new version in the background. The app then shows "A new version of the app is ready" with a **Reload** button. The new version starts only when the person taps **Reload**.

## Technical details

### Architecture

- `index.html` contains the header, the tab bar and an empty `<main id="view">`.
- `js/main.js` is the router. It reads the URL hash, loads the page module, and renders the page into `#view`.
- `js/pages/*.js` contains one module for each route.
- `js/data/*.js` contains the trip content.
- `js/ui.js` contains shared helpers: icons, storage, toasts, phone number format and downloads.
- `css/app.css` contains all styles.
- `sw.js` is the service worker.

### Routes

The router uses hash URLs, for example `#/checklist?list=chaperone`. Hash URLs work on a static host without server rewrites.

Each entry in `ROUTES` has the same fields in the same order:

| Field | Type | Meaning |
| --- | --- | --- |
| `module` | string | Page file in `js/pages/`, without `.js`. It is the same as the route key. |
| `tab` | string or `null` | Tab bar item to highlight. Tools use `guide`. |
| `title` | string | Text for the header and the document title. |
| `back` | string or `null` | Back button target. `null` hides the Back button. |
| `immersive` | boolean | `true` hides the header and the tab bar. |

`#/`, an empty hash and unknown routes open Home.

Some pages read query parameters:

| URL | Result |
| --- | --- |
| `#/checklist?list=chaperone` | Opens the chaperone packing checklist. |
| `#/directions?v=campus` | Opens the campus map. |
| `#/schedule?day=0` | Opens a day of the trip. Use `0`, `1` or `2`. |

### Offline support

The service worker caches all files in the `SHELL` list when it installs. The cache has 32 files (538 KB). This total includes the fonts, images and icons.

- Pages, scripts, styles and images come from the cache first.
- The YouTube video, the live Google map and Google Drive documents need a connection.
- When `VERSION` changes, the browser installs the new service worker. The new worker waits until the person taps **Reload**. Then it deletes the old cache.

### Data on the device

Checklist progress is in `localStorage` with the prefix `intothewoods:`. Settings and contacts that people add use the prefix `itw:`. The app asks the browser to keep this data (`navigator.storage.persist()`). The app does not send data to a server.

### Phone numbers

Contacts shows each phone number in one format. The `formatPhone()` helper in `js/ui.js` applies the format when the page renders. The helper does not change the stored value.

| Number | Result |
| --- | --- |
| 10 digits, or 11 digits that start with 1 | (###) ###-####. The first digit (1) is removed. |
| Other numbers, for example `911` or `+44 20 7946 0958` | No change. |

The same rules apply to the trip data and to contacts that people add on the device.

The **Text** button does not show for these numbers:

- `911`
- Toll-free numbers: area codes 800, 833, 844, 855, 866, 877 and 888

The **Save all trip contacts to my phone** button saves the camp, school and chaperone contacts that have a phone number or an email address. It does not save the emergency numbers or the contacts that people add.

### Design rules

The packing checklist is the model for all pages:

- Each screen has one job.
- List rows have touch targets of 44 px or more.
- The header and the tab bar are quiet.
- The handwritten font (Gochi Hand) is for page titles, section titles and brand moments only.
- Text that people scan or tap uses Nunito.
- Category color goes on dots, icons and labels. Do not use colored side stripes.
- Do not use emoji as icons.

Both fonts are in `fonts/` (SIL Open Font License).

## FAQ

**I changed a file, but the browser shows the old version. Why?**
The service worker serves files from its cache. Increase `VERSION` in `sw.js`, then reload. During development, you can also select **Update on reload** in the browser developer tools (Application > Service workers).

**Why does the app not use a framework?**
The app has few pages and must load fast with a weak signal. Plain modules keep the app small and remove the build step.

**Do old links like `#/packing` still work?**
No. Old route keys open Home. The app has no users who depend on old links yet.

**Are there automated tests?**
No. Examine each change in a browser before you merge it. Use a phone-sized viewport and test offline mode.

**Where do I add a new trip document?**
Add the link to the related FAQ entry in `js/data/trip.js`.

## Contributing

1. Make a branch from `main` for each request.
2. Push the branch and open a pull request. In the description, write the request and the plan.
3. Make small commits. Use [Conventional Commits](https://www.conventionalcommits.org/) for the messages, for example `feat(nav): rename Packing section to Checklist`.
4. Update this README in the same pull request when a change makes it incorrect.
5. Push your commits and update the pull request title and description.

Claude Code uses the project skills in `.claude/skills/`:

| Skill | Purpose |
| --- | --- |
| `workflow` | The steps above, scope rules, consistency rules and tests. |
| `readme` | The rules for this README: structure, ASD-STE100 style and accuracy. |

---

Built with ❤️ for Thornhill by SPARKLER*FUN. Not affiliated with Thornhill Elementary School or Westminster Woods.
