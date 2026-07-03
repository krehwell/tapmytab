import { expect, Page, test } from '@playwright/test'
import { boardByName, boardMenu, boards, createBoard, gotoApp } from './helpers.ts'

test.beforeEach(async ({ page }) => await gotoApp(page))

// live order of the typed board names, in DOM (= array) order
const order = (page: Page): Promise<string[]> =>
    boards(page).evaluateAll((els) => els.map((e) => e.getAttribute('data-board-name') || ''))

const indexOf = async (page: Page, name: string) =>
    (await order(page)).findIndex((n) => n.endsWith(name))

test('move a board right swaps it past its neighbour', async ({ page }) => {
    await createBoard(page, 'Alpha')
    await createBoard(page, 'Beta')
    // Beta was inserted right after Alpha
    expect(await indexOf(page, 'Alpha')).toBeLessThan(await indexOf(page, 'Beta'))

    await boardMenu(boardByName(page, 'Alpha'), 'Move Right')
    expect(await indexOf(page, 'Alpha')).toBeGreaterThan(await indexOf(page, 'Beta'))
})

test('move a board left swaps it back', async ({ page }) => {
    await createBoard(page, 'Alpha')
    await createBoard(page, 'Beta')

    await boardMenu(boardByName(page, 'Beta'), 'Move Left')
    expect(await indexOf(page, 'Beta')).toBeLessThan(await indexOf(page, 'Alpha'))
})

test('Move Left is hidden on the first board', async ({ page }) => {
    const first = boards(page).first()
    await first.getByTitle('Board options').click()
    await expect(page.getByRole('menuitem', { name: 'Move Left' })).toHaveCount(0)
})

test('the menu stays open after moving so you can move again', async ({ page }) => {
    await createBoard(page, 'Alpha')
    await createBoard(page, 'Beta')

    // Alpha starts first, so move it right (it becomes last)
    await boardByName(page, 'Alpha').getByTitle('Board options').click()
    await page.getByRole('menuitem', { name: 'Move Right' }).click()
    expect(await indexOf(page, 'Alpha')).toBeGreaterThan(await indexOf(page, 'Beta'))

    // menu never closed: 'Move Left' is now available (Alpha is no longer first) and clicking it
    // moves the board again without reopening the menu
    const moveLeft = page.getByRole('menuitem', { name: 'Move Left' })
    await expect(moveLeft).toBeVisible()
    await moveLeft.click()
    expect(await indexOf(page, 'Alpha')).toBeLessThan(await indexOf(page, 'Beta'))
})
