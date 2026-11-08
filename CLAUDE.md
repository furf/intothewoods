# CLAUDE.md

Into the Woods is an offline web app for the Thornhill School trip to Westminster Woods (November 17–19, 2026). It is static HTML, CSS and JavaScript modules, with no framework and no build step. `README.md` describes the app, the routes and the files.

## Rules for every request

1. Before you change a file, use the `workflow` skill. Follow all of its steps.
2. Do only what the request asks. Write other ideas as recommendations and wait for approval.
3. If a request has more than one meaning, ask before you start.
4. Make one branch and one pull request for each request. Follow-up instructions about the same request go in the same pull request.
5. Do not deploy, push to `main` or merge, unless the requester tells you to. Vercel deploys `main` to production and makes a preview for each other branch.
6. When a change makes `README.md` incorrect, use the `readme` skill and update it in the same pull request.

## Rules for the code

- If you change a file in the `SHELL` list of `sw.js`, increase `VERSION` by one in that pull request.
- If you add or remove a cached file, update the `SHELL` list.
- In `ROUTES` (`js/main.js`), the route key, `module` and the page file name in `js/pages/` are the same.
- Every control is at least 44 x 44 px. Follow the design rules in `README.md`.

## Commands

Start the app:

```bash
python3 -m http.server 8765
```

Test each changed route in a headless browser with a phone viewport (Playwright, `devices['iPhone 13']`). Test it offline after the service worker is ready. The `workflow` skill has the full test steps.

## Skills

| Skill | Use it for |
| --- | --- |
| `workflow` | Every request that changes files |
| `readme` | `README.md` and other documentation |
| `accessibility`, `web-quality-audit`, `web-design-guidelines`, `frontend-design` | Audits and UI work, when the request asks for them |
