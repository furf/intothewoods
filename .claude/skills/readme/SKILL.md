---
name: readme
description: Write or update README.md for this repository. Use when a change makes the README incorrect (routes, pages, files, data, deployment, workflow), when asked to document something, or when reviewing docs. Applies ASD-STE100, an IC4 software engineer audience, the inverted pyramid and the project's tutorial section structure.
---

# README

Keep `README.md` correct in the same pull request as the change that affects it. A README that is out of date is a bug.

## When to update

Update the README when a change affects any of these:

- Section names, routes, query parameters or the `ROUTES` fields in `js/main.js`
- Files or folders that the README names (`js/data/*`, `js/pages/*`, `sw.js`, `fonts/`)
- How to run, edit, add a page or release
- Offline behavior, the service worker update flow or the `SHELL` contents
- Deployment (Vercel: `main` is production, other branches get previews)
- The contributing workflow
- Design rules

If no update is necessary, say so in the pull request description.

## Audience

Write for an IC4 software engineer who is new to this repository.

- Do not explain general tools or concepts: Git, npm, HTTP, hash routing, service workers, `localStorage`.
- Do explain what is specific to this project: the cache `VERSION`, the `SHELL` list, the page module contract, the `ROUTES` fields, the data files, the storage prefixes and the design rules.

## Structure: inverted pyramid

Put the most important information first. A reader who stops after any section must have the most useful information so far.

1. **Title and summary** (no heading): what the app is, who uses it, that it works offline. Then a short list: stack, hosting, where content lives.
2. **Contents**: links to the sections below.
3. **Overview**: what the app does, as tables of sections and tools with routes and purpose.
4. **Getting started**: prerequisites, install, run. Numbered steps with code blocks.
5. **Usage**: tasks as procedures. Edit trip content, add a page, release a change.
6. **Technical details**: architecture, routing, offline support, data on the device, design rules. Use tables for reference data.
7. **FAQ**: the questions a new engineer asks first. Bold question, then a short answer.
8. **Contributing**: the workflow from the `workflow` skill, in short steps.
9. Credit line.

Add a section only when the content does not fit one of these.

## Style: ASD-STE100 (Simplified Technical English)

Apply these rules to all prose. Code, file names, UI labels and quotations keep their exact form.

**Words**
- Use simple, common words. Use "use" (not "utilize"), "start" (not "initiate"), "examine" (not "verify" in procedures), "help" (not "facilitate"), "make" (not "create" when "make" is clear).
- Use one word for one meaning. Do not use synonyms for variety. For example, always "route", never "path" or "URL" for the same thing.
- Do not use "-ing" forms of verbs, except in technical names.
- Do not use phrasal verbs when a single verb is available ("examine", not "look at"; "remove", not "take out").
- Do not use contractions.
- Use articles ("a", "the") and do not leave out words to make a sentence shorter.
- Do not use more than three nouns in a row. Rewrite noun clusters.

**Sentences**
- Procedural sentences: 20 words maximum. Descriptive sentences: 25 words maximum.
- Write one instruction in each sentence.
- Use the imperative (command) form for instructions: "Increase `VERSION` in `sw.js` by one."
- Use the active voice. Use the passive voice only in descriptive text, and only when the agent is not important.
- Use the present tense for descriptions.
- Put a condition before the instruction: "If the page does not load, clear the cache."

**Paragraphs and layout**
- Write one topic in each paragraph. Use six sentences maximum.
- Use numbered lists for sequences of steps. Use bulleted lists for items with no order.
- Use tables for reference data (routes, fields, files).
- Start a note with `> **Note:**`. A note gives information, not an instruction.
- Start a warning with `> **Warning:**` and a short command.

## Accuracy

Every statement must be true for the code on the branch.

1. Read the code that each statement describes before you write it.
2. Measure numbers. Do not estimate them. For example, count the `SHELL` files and add their sizes.
3. Run the commands in Getting started and Usage. Make sure that they work.
4. After you write the README, read each statement again and compare it with the code.
5. If a fact is not known (for example, a URL), do not guess. Leave it out and ask in the pull request.

## Checklist

- [ ] The summary tells what the app is, who uses it, the stack and the hosting.
- [ ] The sections follow the structure above.
- [ ] Each route, file and field in the README exists in the code.
- [ ] Procedures are numbered, with one instruction for each step.
- [ ] No sentence is longer than the limit.
- [ ] No contractions, no "-ing" verb forms, no noun clusters of four or more words.
- [ ] The pull request description says what changed in the README.
