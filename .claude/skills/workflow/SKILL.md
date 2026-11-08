---
name: workflow
description: The required workflow for every change request in this repository. Use at the start of any request that changes files - a feature, fix, rename, refactor, content edit or docs change. Covers scope control, one branch and pull request per request, the plan in the PR description, small Conventional Commits, testing, and what not to do without approval.
---

# Workflow

Follow these steps for each request that changes files.

## 1. Control the scope

Do only what the request asks.

- If a change is not in the request, do not make it. Write it as a recommendation in the pull request and in your reply. Wait for approval.
- If the request has more than one possible meaning, ask before you start. Give the possible meanings as options.
- If the request names something that does not exist (for example, a tab that is not in the code), ask. Do not guess.
- Some changes are necessary for a requested change to work. Examples: a cache `VERSION` bump, a new file in the `SHELL` list, links to a renamed route. You can make these changes. Put each one in a separate commit and explain it in the pull request.
- Do not deploy. Vercel deploys `main` to production and builds a preview for each other branch.
- Do not push to `main` or merge pull requests unless the requester tells you to.

## 2. Make a branch for the request

1. Fetch `origin`.
2. Make a branch from `origin/main`. Name the branch `<type>/<short-description>`, for example `feat/section-noun-names` or `docs/readme`.
3. If the request depends on an open pull request, make the branch from that pull request's branch. Set that branch as the base of the new pull request (a stacked pull request). Write the merge order in the description.

Use one branch and one pull request for each request. Add follow-up instructions about the same request to the same pull request.

## 3. Open the pull request early

1. Make the first commit.
2. Push the branch with `git push -u origin <branch>`.
3. Open a draft pull request. The description has these sections:
   - **Request**: the exact words of the request, as a quote. Add follow-up instructions as more quotes.
   - **Plan**: the scope in one or two sentences, then a task list with one item for each planned commit.
   - **Not included (recommendations, awaiting approval)**: changes that you suggest but did not make.
   - **Open questions**: facts that you need from the requester.

## 4. Commit in small, logical steps

- Make one commit for each logical change. A reviewer must be able to read each commit alone.
- Use [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): summary`.
  - Types: `feat`, `fix`, `refactor`, `docs`, `style`, `chore`, `test`, `perf`.
  - Scopes in this repo: `nav`, `routes`, `sw`, `readme`, `skills`, or the page name (`checklist`, `directions`, `schedule`, `guide`, `home`, `contacts`).
  - Summary: imperative, lowercase, no period, 72 characters maximum.
- In the commit body, tell why the change is necessary.
- Use `git mv` to rename files, so that history follows the file.

## 5. Keep the app consistent

When a change affects these items, update them in the same pull request:

- **`sw.js`**: add new files to `SHELL` and remove deleted files. Increase `VERSION` by one once in each pull request that changes a cached file.
- **`ROUTES` in `js/main.js`**: the key, `module` and page file name are the same. Every entry has `module, tab, title, back, immersive` in that order.
- **Links**: `index.html`, page modules and `manifest.webmanifest` shortcuts use the current route keys.
- **README.md**: use the `readme` skill.

## 6. Test before you push

1. Start a server: `python3 -m http.server 8765`.
2. Open each changed route in a headless browser with a phone viewport (Playwright, `devices['iPhone 13']`).
3. Make sure that there are no page errors and no console errors.
4. Make sure that the changed pages load offline after the service worker is ready.
5. Take a screenshot of each visible change and examine it.
6. Stop the server.

Record what you tested in the pull request description.

## 7. Finish

1. Push the commits.
2. Update the pull request title and description. Mark each task as done. Add a **Result** section with what changed and what you tested.
3. Mark the pull request as ready for review.
4. In your reply, give the pull request link, a short summary, the recommendations, and the open questions.
