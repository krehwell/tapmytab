# Rich text editor

Card bodies are Tiptap documents. A toolbar above the editor applies marks, blocks, lists, headings,
alignment, links, images, and undo/redo, and the result is stored as HTML.

## Sub-features

- `rte-marks` bold, italic, inline code.
- `rte-blocks` code block, horizontal rule, headings.
- `rte-lists` bullet, ordered, and task lists.
- `rte-align` left, center, right.
- `rte-link` insert a link, then rename it from the bubble menu without losing the href.
- `rte-image` insert an image and resize it from the image menu.
- `rte-history` undo and redo.
- `rte-persist` typed content survives save and reopen.

## How to get to it (user POV)

- Open a card popup; the toolbar sits above the body.
- Or hover a card's body on the board to edit in place (same editor, no toolbar).
- Click an existing link in the editor to get its bubble menu.
- Markdown input rules work while typing (`# `, `- `, `1. `).

## Driving it with ext.mjs

Preconditions: doctor passes, a card popup open with the editor focused
(`await dialog.locator('.tiptap').click()`, then assert it is focused).

- **Bold.** `await dialog.getByTitle('Bold', { exact: true }).click()` then
  `await page.keyboard.insertText('make me bold')`. `editor.locator('strong')` holds the text.
- **Italic / code.** Type, `await page.keyboard.press('ControlOrMeta+A')`, then
  `getByTitle('Italic', { exact: true })` or `getByTitle('Code', { exact: true })`. `em` / `code`
  wraps the text.
- **Code block.** Same select-all, then `getByTitle('Code Block', { exact: true })`.
  `pre code` holds the text.
- **Horizontal rule.** `getByTitle('Horizontal Rule', { exact: true })`. One `hr` appears; clicking it
  gives `hr.ProseMirror-selectednode` and Backspace deletes it.
- **Lists.** Type, `getByTitle('Lists', { exact: true }).click()`, then
  `page.getByRole('menuitem').nth(n)` where n is 0 bullet, 1 ordered, 2 task. Assert `ul li`, `ol li`,
  `ul[data-type="taskList"] li`.
- **Headings.** `getByTitle('Headings', { exact: true })` then `menuitem` nth 0 paragraph, 1 H1, 2 H2,
  3 H3, 4 H4.
- **Alignment.** `getByTitle('Text Alignment', { exact: true })` then `menuitem` nth 0 left, 1 center,
  2 right. Assert computed `text-align`.
- **Link.** `getByTitle('Link', { exact: true })`, fill `link text` and `url`, press Enter on `url`.
  The anchor carries the href. To rename: click the anchor, then `page.getByTitle('Edit Link')` (the
  bubble menu is on `<body>`, outside the dialog), refill `link text`, Enter. Text changes, href does
  not.
- **Image.** `getByTitle('Image', { exact: true })`, then the image menu offers `Resize to <size>`.
- **Undo / redo.** `getByTitle('Undo', { exact: true })` and `getByTitle('Redo', { exact: true })`.
- **Persist.** Type, wait 200ms, `Save`, reopen the card. The body still contains the text. Then
  `await ext.readStorage()` and assert the card's `content` HTML contains it.
- **Proof.** ARIA snapshot plus a shot of the editor after the operation, and the stored HTML for any
  persistence claim.

## Gotchas

- The toolbar buttons are icon-only. `getByTitle(..., { exact: true })` is the only stable handle, and
  `exact` matters: `Code` also matches `Code Block` without it.
- The list, heading, and alignment submenus are icon-only menu items with no accessible name. Index
  with `nth()` and keep the ordering comment next to it.
- The link bubble menu renders on `<body>`, not inside the dialog.
- Editor `onChange` is debounced 100ms before it reaches the store, then 500ms before storage. A save
  clicked immediately after typing can miss the last keystrokes.
- Templates are stored pre-normalized to exactly what `editor.getHTML()` emits. Do not hand-edit
  expected HTML in `src/utils/templates.ts` to match a proof.
- The board-card inline editor has no toolbar. Marks there need keyboard shortcuts.
