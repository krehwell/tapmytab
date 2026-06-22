/***
 * I personally don't really understand this code.  I normally just ask AI to measure it for me using this code
 ***/

import { expect, Page, test } from '@playwright/test'

// This test answers one question: "how long until the user sees their first card?"
// We load the board with different amounts of cards and time the paint, so we can
// tell whether a change made things faster or slower.
//
// Heads up: timings get noisy when the CPU is busy running other tests in parallel.
// For numbers you can trust, run this file on its own:
//   npx playwright test perf --workers=1
test.describe.configure({ mode: 'serial' })

type Sample = {
    spec: string // the dataset we loaded, e.g. "40x20" = 40 boards, 20 cards each
    cards: number // how many cards were actually on screen when the first one showed up
    firstCardMs: number // the number that matters: page open → first card visible (what the user feels)
    fcpMs: number | null // the browser's own "first paint" timing, as a sanity check
    loadMs: number | null // when the page "load" event fired (mostly ignore this; it lies for single-page apps)
}

// Load a board with `spec` worth of cards and measure how fast the first card appears.
const measure = async (page: Page, spec: string): Promise<Sample> => {
    const startedAt = Date.now()

    // ?perf=BxC tells the app (dev mode) to seed B boards × C cards. "commit" means: don't
    // wait for the whole page to load, just start the clock when navigation begins, so we
    // measure the paint and not the full load.
    await page.goto(`/?perf=${spec}`, { waitUntil: 'commit' })

    // wait until the very first card is actually on screen, then stop the clock
    await page.getByTestId('card').first().waitFor({ state: 'visible' })
    const firstCardMs = Date.now() - startedAt

    const cards = await page.getByTestId('card').count()

    // ask the browser for its own paint timings (more precise than our stopwatch)
    const timings = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
        const fcp = performance.getEntriesByType('paint').find((p) => p.name === 'first-contentful-paint')
        return { fcpMs: fcp?.startTime ?? null, loadMs: nav?.loadEventEnd ?? null }
    })

    return { spec, cards, firstCardMs, ...timings }
}

test('first card shows up fast, no matter how many cards there are', async ({ page }) => {
    test.setTimeout(180_000) // big datasets take a while to fully load, so give it room

    // try a small, medium, and large board and print the results side by side
    const samples: Sample[] = []
    for (const spec of ['5x4', '20x10', '40x20']) {
        samples.push(await measure(page, spec))
    }

    // eslint-disable-next-line no-console
    console.table(samples) // read this table to compare before/after a change

    // Not a strict budget, just a tripwire. If the biggest board ever takes longer than
    // 30s to show its first card, something is badly broken and we want the test to shout.
    const biggest = samples[samples.length - 1]
    expect(biggest.firstCardMs).toBeLessThan(30_000)
})
