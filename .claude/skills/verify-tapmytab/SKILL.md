---
name: verify-tapmytab
description: "Drive the real tapmytab browser extension (MV3 new-tab Kanban board: boards, cards, rich text, drawings, search, local storage) and capture proof that a change works. Use before claiming a UI or storage behavior is fixed, and whenever a change needs evidence beyond the e2e suite."
---

# Verify tapmytab

tapmytab is a Chrome/Firefox MV3 extension that replaces the new tab page with a Kanban board.
Everything is local: boards live in `chrome.storage.local`, there is no server and no login.

Two ways to run the app. They prove different things.

| Lane | What it is | Proves | Cannot prove |
| --- | --- | --- | --- |
| Extension (default) | `dist/` loaded unpacked into a real Chromium profile | the shipped artifact, `chrome.storage.local` persistence, new tab override, action popup | anything needing the `?perf=` URL flag |
| Web | `deno task dev` on `http://localhost:5173` | all UI behavior, fast edit loop, the `?perf=NxM` flag | persistence (no extension APIs, boards reseed on every load) |

Use the extension lane unless you need the perf flag or hot reload.

## Launch

Extension lane. Build first, then launch from a drive script:

```bash
cd <repo root> && deno task build      # writes dist/, ~20s
node .claude/skills/verify-tapmytab/drives/persistence.mjs my-run-id
```

`ext.mjs` does the launching. A drive script is a plain node module:

```js
import { launchExtension } from '../ext.mjs'
const ext = await launchExtension({ runId: 'my-run-id' })   // headless: false to watch it
const page = await ext.openNewTab()                          // resolves once a board is visible
```

Ready means `openNewTab()` returned: it waits for `[data-testid="board"]` to be visible.
Each launch gets a fresh profile at `/tmp/tapmytab-verify-<runId>`, so a fresh profile always
starts from the 4 seeded template boards (TODO, Doing, Trip to Japan, Sketches).

Web lane. Run `deno task dev` yourself, then `chromium.launch()` and `page.goto('http://localhost:5173')`.
The repo's own suite runs the whole thing for you: `deno task test` (Playwright starts the dev server via
`webServer` in `playwright.config.ts`). Run that first when a change could break existing behavior.

## Doctor

```bash
node .claude/skills/verify-tapmytab/doctor.mjs
```

Read-only. Fails when the Chromium binary is missing, when `dist/manifest.json` version drifts from
`deno.json`, or when `dist/` is older than `src/` (a stale build silently verifies old code). Prints
whether port 5173 is answering. Run it whenever a drive behaves oddly; a stale `dist/` is the usual cause.

## Drive

Write one `.mjs` file per proof under `drives/`, import `../ext.mjs`, run it with `node`.
`drives/persistence.mjs` is the worked example. Copy it.

Handles this app actually exposes, in preference order:

- `[data-testid="board"]`, with `data-board-name` carrying the live name (new boards get an emoji
  prepended, so match with `$=` on the typed part).
- `[data-testid="card"]` with `data-card-title`, `[data-testid="card-header"]`,
  `[data-testid="board-placeholder"]`, `[data-testid="board-canvas"]`, `[data-testid="search-result"]`.
- Placeholders as accessible names: `Type a name...` (board title), `Add Title...` (card title),
  `Add description...`, `Search by title, description, or content...`.
- `title` attributes on icon buttons: `Board options`, `Card options`, `Clear due date`, `Bold`,
  `Italic`, `Code`, `Link`, `Lists`, `Headings`, `Text Alignment`, `Undo`, `Redo`, `Excalidraw`,
  `Fullscreen`, `Save`, `Exit`.
- Menu items by role: `page.getByRole('menuitem', { name: 'Add Card' })`. Menus render in a MUI portal
  on `<body>`, so resolve them from `page`, never from inside the board or dialog locator.

The repo already ships tested recipes for all of this in `e2e/helpers.ts` (`createBoard`, `openCard`,
`boardMenu`, `dragCard`, `cardTitles`). Read that file before inventing a selector, and port the helper
rather than rewriting it. Nothing in `e2e/` may be modified by a verification run.

## Evidence

Everything lands in `.claude/skills/verify-tapmytab/artifacts/<runId>/`. Its contents are gitignored;
the directory itself stays. Capture with `ext.shot(page, '02-name')` and `ext.snapshot(page, '02-name')`
(ARIA tree, greppable, better for assertions than a PNG).

Proof standards for this app:

- Drive the user path. Do not call `useBoardStore.setState` or `StorageService` from `page.evaluate`
  to set up state; create the board and type the title like a user.
- Capture the action and the result, not only the last screen: a numbered shot before and after.
- Any mutation claim needs the storage side effect too. Read it from the service worker with
  `await ext.readStorage()` (returns the whole `chrome.storage.local`, including `boards`,
  `firstInstall`, `installDate`, `seenVersion`). A card that looks saved but is absent from
  `boards` is a bug, and only this check catches it.
- Saves are debounced 500ms and editor content 100ms. Wait ~1.2s before reading storage, and never
  assert persistence straight after a click.
- Nothing here is mocked and nothing should be: no network, no accounts, no external services.

## Cleanup

`await ext.close()` closes the context you launched and deletes its `/tmp/tapmytab-verify-<runId>`
profile. Put it in a `finally` block. It never touches `artifacts/`, which is the point.

Never `pkill chrome`: the user's own browser and other agents' runs share that name. If a run is
stranded, remove only its own profile directory by run id. `dist/` is a build output, leave it in place.

## Helpers

| File | Invocation | What it does |
| --- | --- | --- |
| `ext.mjs` | imported | `launchExtension({ runId, headless })` returns `{ context, extensionId, newTabUrl, profile, artifacts, openNewTab, readStorage, shot, snapshot, close }` |
| `doctor.mjs` | `node .claude/skills/verify-tapmytab/doctor.mjs` | read-only health check, exit 1 on failure |
| `drives/persistence.mjs` | `node .claude/skills/verify-tapmytab/drives/persistence.mjs <runId>` | worked example: create a board, prove it in storage, prove it survives a new tab |

They resolve `@playwright/test` from the repo's `node_modules`, which Deno populates
(`nodeModulesDir: auto`). From a fresh clone: `deno install --allow-scripts`,
`npx playwright install chromium`, `deno task build`. No other state is required, and the scripts hold
no state of their own.

## Isolation

Extension-lane runs are fully isolated: separate profile directory, separate Chromium process, no
port. Concurrent runs are safe as long as each gets its own `runId`.

The web lane is not isolated. Port 5173 is shared, and `playwright.config.ts` sets
`reuseExistingServer` outside CI, so a run will silently attach to a dev server the user is using.
That is read-mostly and acceptable, but do not run destructive web-lane drives against a server you
did not start.

## Feature map

`features/` is the maintained list of what a user can do and how to drive each part. Read
`features/README.md` first, then the file for the feature you are proving. A proof that drives one
convenient entry point while the file lists three is incomplete, and should say so.
