# Search

Search finds cards across every board by title, description, and content, tolerates typos, and jumps to
the chosen card.

## Sub-features

- `search-open` Ctrl/Cmd+K or the navbar search bar opens the search popup.
- `search-match` matches title (weight 3), description (2), and content (1), with the matched text
  highlighted.
- `search-fuzzy` returns the right card despite typos.
- `search-keyboard` ArrowUp/Down, Ctrl+N / Ctrl+P, and Tab / Shift+Tab move the selection; Enter picks.
- `search-select` picking a result closes search and focuses that card's title input.
- `search-fallback` picking a card that is not mounted yet opens it in the card popup instead.

## How to get to it (user POV)

- Press Ctrl+K or Cmd+K anywhere on the new tab.
- Click the `Search cards...` bar in the navbar.
- Type a query, then click a result or press Enter.

## Driving it with ext.mjs

Preconditions: doctor passes, fresh profile with the seeded template boards, which contain the
searchable fixtures below.

- **Open.** `await page.keyboard.press('Control+k')`. The input
  `page.getByPlaceholder(/Search by title/)` is visible. Also verify the navbar bar as a second entry
  point.
- **Title match.** Fill `Errands`. `page.getByTestId('search-result').first()` contains `Errands`.
- **Content match.** Fill `avocados`, which appears only in the Errands card body. The same card is
  first.
- **Fuzzy.** Fill `daly habts`. The first result is `Daily habits`.
- **Select.** Fill `Japan itinerary`, press Enter. The search input is hidden and
  `page.locator('#card5 input').first()` is focused. Clicking the result does the same.
- **Not-yet-mounted fallback.** This one needs the web lane: `deno task dev`, then
  `page.goto('http://localhost:5173/?perf=1x500')`, search `card 480 on board 1`, press Enter. A
  dialog opens with title `Card 480`.
- **Proof.** ARIA snapshot of the populated result list plus a shot, and the focused element or dialog
  title after selection. Search mutates nothing, so no storage read is needed.

## Gotchas

- The `?perf=NxM` flag only works in web mode. Inside the extension the boards come from storage and
  the parameter is ignored, so `search-fallback` cannot be proved in the extension lane.
- The card ids in the seeded template are stable (`card5` is `Japan itinerary`). Cards you create get
  random ids, so assert focus by id only for seeded fixtures.
- Fuse is weighted, not exact. Assert the expected card is first, not that it is the only result.
- Drawing cards carry no text and never appear in results.
- Only the first mounted boards are in the DOM. A result deep in a long board scrolls into view if it
  is mounted, and falls back to the popup if it is not; both are correct.
- Ctrl+K while a text field has focus still opens search, but Enter inside the editor does not.
