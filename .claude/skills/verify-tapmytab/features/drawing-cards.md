# Drawing cards

A drawing card holds an Excalidraw scene instead of text. It renders a preview on the board and opens
a full editor, hosted in an iframe, in the card popup.

## Sub-features

- `draw-add` `Add Drawing Card` creates a card showing a `click to draw` placeholder.
- `draw-open` opening the card focuses the Excalidraw canvas.
- `draw-edit` drawing on the canvas marks the card dirty.
- `draw-fullscreen` the fullscreen view shows `Exit` when clean and `Save` when dirty.
- `draw-save` `Save` persists the scene without closing the popup and clears dirty.
- `draw-backdrop` a backdrop click closes a clean popup and is ignored on a dirty one.

## How to get to it (user POV)

- `Board options` (`⋮`) then `Add Drawing Card`.
- Click the card body to open the drawing editor.
- Inside the editor, use the Excalidraw toolbar, `Fullscreen`, and `Save` / `Exit`.

## Driving it with ext.mjs

Preconditions: doctor passes, a board created for this proof.

- **Add.** `Board options` then `page.getByRole('menuitem', { name: 'Add Drawing Card' }).click()`.
  `board.getByText('click to draw')` is visible.
- **Open.** Open the card popup as in `cards.md`. `dialog.getByTitle('Excalidraw')` (the iframe) is
  focused.
- **Draw.** `const frame = page.frameLocator('iframe[title="Excalidraw"]')`, then
  `await frame.getByTestId('toolbar-rectangle').click({ force: true })`, take the canvas bounding box,
  and drag with `page.mouse` from its center out by ~80px.
- **Dirty backdrop.** `await page.mouse.click(10, 10)`. The dialog stays visible after drawing, and
  closes when nothing was drawn.
- **Fullscreen.** `await frame.getByTitle('Fullscreen').click()`. With no changes,
  `frame.getByTitle('Exit', { exact: true })` is visible and `frame.getByTitle('Save')` has count 0.
  After drawing, `Save` is visible.
- **Save.** Wait ~700ms for Excalidraw's trailing change and preview events, click `Save`. The dialog
  stays open and the button flips back to `Exit`.
- **Proof.** Shot the board card preview after saving, plus `await ext.readStorage()` showing the
  card's `content` as an object with a non-empty `elements` array.

## Gotchas

- Everything inside the editor lives in an iframe. Use `frameLocator('iframe[title="Excalidraw"]')`;
  a plain `dialog.getByTitle('Save')` will not find it.
- Excalidraw's own toolbar buttons need `click({ force: true })`; its canvas overlay intercepts
  Playwright's actionability check.
- `Exit` needs `{ exact: true }`, otherwise it also matches other Excalidraw labels.
- Dirty tracking depends on Excalidraw's baseline `onChange` having fired. Draw before entering
  fullscreen, and let its trailing events settle before saving, or the save writes a stale scene.
- Drawing card content is `{ elements, files }`, not an HTML string. Search indexes text, so drawings
  are effectively invisible to search.
- The Excalidraw mermaid feature is stubbed out in `vite.config.ts`. Do not verify mermaid-to-excalidraw
  behavior; it does not ship.
