# Persistence and data

Boards live only in `chrome.storage.local` on the user's machine. A first run seeds four template
boards; every later new tab loads from storage. The logo menu exports, imports, and resets the whole
data set.

## Sub-features

- `data-seed` a first install seeds `📋 TODO`, `🌟 Doing`, `✈️ Trip to Japan`, `🎨 Sketches`.
- `data-persist` edits survive closing and reopening the new tab.
- `data-export` `Export Boards` downloads `tapmytab_boards.json`.
- `data-import` `Import Boards` replaces every board from a JSON file, after a confirm.
- `data-reset` `Reset Board` exports a backup, then restores the template boards, after a confirm.
- `data-intro` upgrading from before 1.7.3 prepends a fresh welcome card to the first board.

## How to get to it (user POV)

- Open a new tab. That is the app.
- Click the tapmytab logo in the navbar for `Export Boards`, `Import Boards`, `Reset Board`.
- Both import and reset ask for confirmation first.

## Driving it with ext.mjs

Preconditions: doctor passes, fresh profile. The full worked script is `../drives/persistence.mjs`;
run it with `node .claude/skills/verify-tapmytab/drives/persistence.mjs <runId>`.

- **Seed.** `await ext.openNewTab()` then count `[data-testid="board"]`. Exactly 4 on a fresh profile.
- **Mutate.** Create a board through the placeholder and set a card title, as in `boards.md`.
- **Storage side effect.** Wait ~1.2s for the 500ms save debounce, then `await ext.readStorage()`.
  `stored.boards` contains the new board with its card title. This is the check that separates a
  rendered card from a saved one.
- **Reopen.** `await page.close()` then `await ext.openNewTab()`. The board and card are still there,
  which proves the load path, not just the save path.
- **Export.** Register `page.on('dialog', (d) => d.accept())`, start
  `page.waitForEvent('download')`, click the navbar logo (`page.getByRole('heading').first()`), then
  `page.getByRole('menuitem', { name: 'Export Boards' })`. The download is
  `tapmytab_boards.json`; read `await download.path()` and assert the parsed JSON matches the boards
  on screen.
- **Import.** Register `page.on('filechooser', (fc) => fc.setFiles(jsonPath))` and the dialog
  handler, then logo, `Import Boards`. The boards on screen become exactly the file's boards.
- **Reset.** Logo, `Reset Board`, accept the confirm. A `tapmytab_boards.json` backup downloads first,
  then the 4 template boards return, in storage as well as on screen.
- **Proof.** Numbered shots before and after, an ARIA snapshot of the reopened tab, the storage dump,
  and the exported JSON path.

## Gotchas

- Only the extension lane persists. On `localhost:5173` `extensionAPI` is `{}`, every storage call
  fails into a caught error, and the app reseeds templates on every load. A persistence claim from the
  web lane is worthless.
- Seeding is consumed. `firstInstall` is set by the service worker's `onInstalled` and flipped to
  false on first read, so only the very first new tab of a profile gets templates. A second profile
  run is the only way back to a clean baseline, which is why every run gets a fresh profile.
- Wait for the service worker before opening the first tab, otherwise `firstInstall` may not be set
  yet and the tab renders zero boards. `launchExtension` already waits.
- Saves are debounced 500ms, with a `pagehide` flush. Reading storage immediately after an edit reads
  the previous state.
- Import and reset both go through `globalThis.confirm`. Without a `dialog` handler the run hangs.
- There is no `storage.onChanged` listener. Tabs already open do not update when another tab writes;
  a new tab reads the newest data. Do not verify live cross-tab sync, it does not exist.
- Import replaces everything and only validates that the JSON is an array. It is destructive by design;
  keep it inside a disposable profile.
