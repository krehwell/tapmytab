# Cards

A card holds a title, a description, rich-text content, an optional color label, and an optional due
date. It is editable inline on the board and in a popup, and can be dragged between boards.

## Sub-features

- `card-add` `Add Card` prepends a new card to a board.
- `card-inline-edit` title and content are editable straight on the board card.
- `card-popup-edit` the popup edits the same card, with `Save` and `Cancel`.
- `card-emojify` `Emojify` prepends an emoji to the title.
- `card-label` a color label (red, green, blue, yellow) shows as a chip on the board card.
- `card-due` a due date shows as a formatted chip, and can be cleared.
- `card-delete` `Delete Card` removes the card from its board.
- `card-drag` dragging reorders within a board and moves cards across boards.

## How to get to it (user POV)

- `Board options` (`⋮`) then `Add Card` on any board.
- Click the lower part of a card header, or its `Expand` button, to open the card popup.
- Type directly into a card's title field or hover its body to edit the text in place.
- Drag a card by its header onto another card or another board.

## Driving it with ext.mjs

Preconditions: doctor passes, fresh profile, a board created for this proof so the seeded templates
stay untouched.

- **Add.** `await board.getByTitle('Board options').click()`,
  `await page.getByRole('menuitem', { name: 'Add Card' }).click()`. Card count increases by one and the
  new card is first.
- **Open popup.** Click the header near its bottom edge, away from the buttons:
  `const box = await card.getByTestId('card-header').boundingBox()`,
  `await card.getByTestId('card-header').click({ position: { x: 12, y: box.height - 6 } })`. A
  `page.getByRole('dialog')` becomes visible. This is what `e2e/helpers.ts` `openCard` does.
- **Edit and save.** `await dialog.getByPlaceholder('Add Title...').fill('Buy milk')`,
  `await dialog.getByPlaceholder('Add description...').fill('two liters')`,
  `await dialog.getByRole('button', { name: 'Save' }).click()`.
  `[data-card-title="Buy milk"]` is visible on the board.
- **Confirm.** Reopen the same card. The title and description fields hold the saved values.
- **Cancel.** Open a card, change the title, click `Cancel`. The new title matches zero cards.
- **Inline edit.** `await card.getByPlaceholder('Add Title...').fill('Groceries')`, then
  `await card.locator('.tiptap').hover()` to mount the live editor,
  `await card.locator('.tiptap[contenteditable="true"]').click()`,
  `await page.keyboard.insertText('buy oat milk')`, wait 200ms. Opening the popup shows both values.
- **Label.** In the popup, `await dialog.locator('[data-label]').click()` then
  `await page.locator('[role="menuitem"] [data-label="red"]').click()`, then `Save`. The board card
  shows `[data-label="red"]`.
- **Due date.** `await dialog.locator('input[type="date"]').fill('2030-01-15')`, `Save`. The card
  contains `15 Jan 2030`. Reopen and click `Clear due date`, `Save`; the chip disappears entirely.
- **Emojify.** In the popup, `Card options` then `page.getByRole('menuitem', { name: 'Emojify' })`,
  then `Save`. `data-card-title` grows and now starts with an emoji.
- **Delete.** `Card options` then `Delete Card`. Card count drops.
- **Drag.** dnd-kit needs an 8px activation move: mouse down on the source header, move ~14px in
  steps, then move onto the target header in steps, settle, mouse up. Use `dragCard` from
  `e2e/helpers.ts` verbatim.
- **Proof.** Shot and ARIA snapshot before and after, plus `await ext.readStorage()` showing the card
  under the right board with the right `title`, `label`, and `date`.

## Gotchas

- Clicking the middle of a card header hits the title input or a button. Click near the bottom edge, as
  `openCard` does, or the popup will not open.
- The board card's body is a static preview until hovered. Hover mounts the live Tiptap instance; a
  click without hover types into nothing.
- Content edits are debounced 100ms into the store and 500ms into storage. Wait before asserting.
- `Cancel` discards popup edits, but inline edits on the board are already committed.
- Label and card-options menus are portalled to `<body>`. `dialog.getByRole('menuitem', ...)` finds
  nothing; use `page`.
- After a rename, a locator built from `data-card-title` is stale. Re-resolve.
- Drag with `page.mouse` only. A Playwright `dragTo` does not trip dnd-kit's PointerSensor.
