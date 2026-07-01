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
    cards: number
    firstCardMs: number
    fcpMs: number | null // the browser's own "first paint" timing
    loadMs: number | null // when the page "load" event fired
}

const measure = async (page: Page, spec: string): Promise<Sample> => {
    const startedAt = Date.now()

    // ?perf=BxC tells the app (dev mode) to seed B boards × C cards. "commit" means: don't
    // wait for the whole page to load, just start the clock when navigation begins, so we
    // measure the paint and not the full load.
    await page.goto(`/?perf=${spec}`, { waitUntil: 'commit' })

    await page.getByTestId('card').first().waitFor({ state: 'visible' })
    const firstCardMs = Date.now() - startedAt

    const cards = await page.getByTestId('card').count()

    const timings = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
        const fcp = performance.getEntriesByType('paint').find((p) => p.name === 'first-contentful-paint')
        return { fcpMs: fcp?.startTime ?? null, loadMs: nav?.loadEventEnd ?? null }
    })

    return { spec, cards, firstCardMs, ...timings }
}

test('first card shows up fast, no matter how many cards there are', async ({ page }) => {
    test.setTimeout(180_000)

    // just to prevent cold start for the actual test below it
    await measure(page, '100x100')

    const samples: Sample[] = []
    for (const spec of ['5x4', '20x10', '40x20']) {
        samples.push(await measure(page, spec))
    }

    console.table(samples)

    const biggest = samples[samples.length - 1]
    expect(biggest.firstCardMs).toBeLessThan(30_000)
})
