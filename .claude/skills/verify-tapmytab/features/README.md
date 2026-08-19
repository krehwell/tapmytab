# tapmytab verification map

This directory is the maintained source for verifying tapmytab's user-facing behavior. Read this index
before driving the app, then use the matching feature file as the recipe. `../SKILL.md` covers launch,
doctor, evidence, and cleanup.

## Baseline preconditions

- `deno task build` has run, and `node ../doctor.mjs` passes (fresh `dist/`, matching version).
- Launch through `launchExtension({ runId })`. Every run gets its own profile at
  `/tmp/tapmytab-verify-<runId>`.
- A fresh profile seeds exactly 4 boards: `📋 TODO`, `🌟 Doing`, `✈️ Trip to Japan`, `🎨 Sketches`,
  plus a trailing add-board placeholder. Assert that count before doing anything else; if it is not 4,
  the profile is not fresh and the run is invalid.
- Never drive a browser or dev server this run did not start.

## Driving conventions

- Start from the seeded baseline unless a file says otherwise.
- Prefer `data-testid`, `data-board-name`, `data-card-title`, placeholders, and `title` attributes.
  Never coordinates or nth-child, except where a file says the option menu is icon-only.
- Menus and bubble menus render in a portal on `<body>`. Resolve them from `page`, not from the board
  or dialog locator.
- React controlled inputs do not expose their value to CSS. Match on the `data-*` mirror attributes.
- Create state through the UI. Never through `useBoardStore.setState` or `StorageService`.
- Mutations reach storage after a 500ms debounce, editor content after 100ms. Wait, then read
  `await ext.readStorage()`.

## Proof and skip reporting

- Capture the action and the result, numbered, not just the final screen.
- UI proof is `ext.shot(page, name)` plus `ext.snapshot(page, name)` in the run's artifacts directory.
- Mutation proof also includes the value read back from `chrome.storage.local`.
- Record the feature ID and the entry point used with every artifact.
- Report an unreachable path with the attempted command and the unmet precondition. Do not report a
  skipped entry point as verified through a different one.

## Feature entry contract

Each file starts with an H1 and one paragraph of user-visible behavior, then exactly four H2 sections:
`Sub-features`, `How to get to it (user POV)`, `Driving it with ext.mjs`, `Gotchas`.

## Features

- [Boards](./boards.md) create, rename, reorder, duplicate, delete, and the board options menu.
- [Cards](./cards.md) add, edit, label, due date, delete, and drag between boards.
- [Rich text editor](./rich-text-editor.md) the Tiptap toolbar, links, lists, headings, images.
- [Drawing cards](./drawing-cards.md) Excalidraw cards, the iframe, fullscreen save and exit.
- [Search](./search.md) Ctrl/Cmd+K fuzzy search across title, description, and content.
- [Persistence and data](./persistence.md) chrome.storage, export, import, reset, first-run seeding.
