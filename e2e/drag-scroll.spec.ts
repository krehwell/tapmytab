import { expect, Page, test } from '@playwright/test'

// Grab the empty background and drag left/right to scroll the board strip.
// ?perf=15x2 (dev-mode seeding) gives 15 boards × 2 cards — wide enough to overflow.

const canvas = (page: Page) => page.getByTestId('board-canvas')
const scrollLeft = (page: Page) => canvas(page).evaluate((el) => el.scrollLeft)

const gotoWideBoard = async (page: Page) => {
    await page.goto('/?perf=15x2')
    await expect(page.getByTestId('card').first()).toBeVisible({ timeout: 20_000 })
}

// a point on the visual background (canvas itself or a board's empty padding/gutter,
// not a card/editor). Cards can cover most of a column, so scan a grid of candidates.
const bgPoint = (page: Page) =>
    page.evaluate(() => {
        const cv = document.querySelector('[data-testid="board-canvas"]')!
        const r = cv.getBoundingClientRect()
        for (let fy = 0.9; fy > 0.2; fy -= 0.2) {
            for (let fx = 0.3; fx < 0.95; fx += 0.05) {
                const x = r.x + r.width * fx
                const y = r.y + r.height * fy
                const el = document.elementFromPoint(x, y)
                if (el === cv || el?.getAttribute('data-testid') === 'board') return { x, y }
            }
        }
        throw new Error('no background point found')
    })

const drag = async (page: Page, from: { x: number; y: number }, dx: number) => {
    await page.mouse.move(from.x, from.y)
    await page.mouse.down()
    await page.mouse.move(from.x + dx, from.y, { steps: 10 })
    await page.mouse.up()
}

// regression: the bg handler once pointer-captured the menu's portaled backdrop
// (portal events bubble through the React tree), eating the click that closes it
test('an open board menu still closes on outside click', async ({ page }) => {
    await gotoWideBoard(page)

    await page.getByTestId('board').first().getByTitle('Board options').click()
    const menuItem = page.getByRole('menuitem', { name: 'Add Card' })
    await expect(menuItem).toBeVisible()

    // anywhere outside the menu lands on its backdrop, which must still close it
    const vp = page.viewportSize()!
    await page.mouse.click(vp.width / 2, vp.height - 20)
    await expect(menuItem).not.toBeVisible()
})

test('a wiggly bg drag over card text selects nothing', async ({ page }) => {
    await gotoWideBoard(page)

    const from = await bgPoint(page)
    await page.mouse.move(from.x, from.y)
    await page.mouse.down()
    // sweep up/down across card text while scrolling left
    for (let i = 1; i <= 10; i++) {
        await page.mouse.move(from.x - i * 30, from.y + (i % 2 ? -150 : 150), { steps: 4 })
    }
    await page.mouse.up()

    expect(await page.evaluate(() => String(globalThis.getSelection()))).toBe('')
    // userSelect is restored after the drag so normal selection still works
    expect(await canvas(page).evaluate((el) => el.style.userSelect)).toBe('')
})

test('dragging the background left scrolls the boards right', async ({ page }) => {
    await gotoWideBoard(page)
    expect(await scrollLeft(page)).toBe(0)

    await drag(page, await bgPoint(page), -400)
    expect(await scrollLeft(page)).toBeGreaterThan(0)
})

test('dragging back right scrolls the boards back', async ({ page }) => {
    await gotoWideBoard(page)

    await drag(page, await bgPoint(page), -400)
    const scrolled = await scrollLeft(page)
    expect(scrolled).toBeGreaterThan(0)

    await drag(page, await bgPoint(page), 400)
    expect(await scrollLeft(page)).toBeLessThan(scrolled)
})

test('dragging a card does not scroll the canvas', async ({ page }) => {
    await gotoWideBoard(page)

    const card = page.getByTestId('card').first()
    const box = await card.boundingBox()
    if (!box) throw new Error('card has no box')

    await page.mouse.move(box.x + box.width / 2, box.y + 10)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width / 2 + 150, box.y + 10, { steps: 10 })
    expect(await scrollLeft(page)).toBe(0)
    await page.keyboard.press('Escape') // cancel the dnd-kit drag so no card actually moves
    await page.mouse.up()
})
