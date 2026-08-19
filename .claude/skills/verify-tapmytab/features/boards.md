# Boards

A board is a named column of cards. The whole new tab is a horizontal canvas of boards, with a
placeholder board at the far right for creating the next one.

## Sub-features

- `board-create` typing a name into the trailing placeholder creates a board with one card.
- `board-emoji` a new board's name gets an emoji prepended (keyword match, else random).
- `board-rename` editing the title in place renames the board.
- `board-move` `Move Left` / `Move Right` reorder a board past its neighbour.
- `board-duplicate` `Duplicate Board` inserts a copy with the same cards and new card ids.
- `board-delete` `Delete Board` removes the board and its cards.
- `board-title-fit` long names shrink their font instead of pushing the card list down.

## How to get to it (user POV)

- Type a name into the placeholder board at the right end of the canvas, then click away or press Enter.
- Click the board title to rename it in place.
- Open the `⋮` button on any board header (`Board options`) for `Add Card`, `Add Drawing Card`,
  `Emojify`, `Move Left`, `Move Right`, `Duplicate Board`, `Delete Board`.
- Drag the canvas background to scroll to boards off screen.

## Driving it with ext.mjs

Preconditions: doctor passes, fresh profile with the 4 seeded boards.

- **Create.** Type a name into the placeholder and blur.
  `const input = page.getByTestId('board-placeholder').getByPlaceholder('Type a name...')`,
  `await input.fill('Groceries')`, `await input.blur()`. A board matching
  `[data-testid="board"][data-board-name$="Groceries"]` appears holding one `[data-testid="card"]`.
- **Emoji.** Read `data-board-name` on the new board. It starts with an emoji and ends with `Groceries`.
- **Rename.** Resolve the input while the old name is still live, then commit with Enter.
  `await boardByName('Temp').getByRole('textbox').first().fill('Renamed')`,
  `await page.keyboard.press('Enter')`. `data-board-name$="Renamed"` exists, `Temp` is gone.
- **Menu.** `await board.getByTitle('Board options').click()` then
  `await page.getByRole('menuitem', { name: 'Add Card' }).click()`. The card count goes from 1 to 2.
- **Duplicate.** `Duplicate Board` from the same menu. Two boards now match the name, and the second
  holds the same number of cards.
- **Delete.** `Delete Board`. The name matches zero boards.
- **Proof.** `ext.shot(page, '0N-boards')` and `ext.snapshot(page, '0N-boards')`, then
  `await ext.readStorage()` and assert the `boards` array names and lengths match what is on screen.

## Gotchas

- The placeholder is `board-placeholder`, not `board`. `getByTestId('board')` never includes it, so
  board counts stay stable.
- New board names get an emoji prepended. Always match with `$=` on the typed part, never `=`.
- A board locator built from a name goes stale the instant the name changes. Re-resolve after a rename.
- The menu deliberately stays open after `Move Left` / `Move Right` so you can move again. Do not
  expect it to close, and note that `Move Left` is absent on the first board and `Move Right` on the
  last.
- Only the first 6 boards mount, then 4 at a time (progressive mount). A board created past that window
  may not be in the DOM yet.
- Board creation commits on blur. Clicking the canvas background counts as blur, which is a past
  regression: drag-scroll once swallowed that pointerdown.
