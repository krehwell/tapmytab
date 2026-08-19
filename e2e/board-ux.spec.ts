import { expect, Locator, Page, test } from '@playwright/test'
import { boardByName, boardMenu, boards, cardsIn, createBoard, gotoApp } from './helpers.ts'

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

// regression: the drag-scroll pointerdown once preventDefault'ed on the bg, blocking
// the blur that commits a new board's name
test('clicking the bg after typing a new board name creates the board', async ({ page }) => {
    const input = page.getByTestId('board-placeholder').getByPlaceholder('Type a name...')
    await input.click()
    await input.pressSequentially('Gamma')

    // the canvas's left padding strip is background at scroll position 0
    const box = (await page.getByTestId('board-canvas').boundingBox())!
    await page.mouse.click(box.x + 10, box.y + box.height / 2)

    await expect(boardByName(page, 'Gamma')).toBeVisible()
})

// The board title shrinks its font as the name grows, inside a fixed-height header,
// so long names fit without pushing the card list around.
const fontSize = (title: Locator) => title.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))

test('long board names get a smaller font than short ones', async ({ page }) => {
    const title = boards(page).first().getByPlaceholder('Type a name...')
    expect(await fontSize(title)).toBe(31) // "📋 TODO" stays full size

    await title.click()
    await title.press('ControlOrMeta+a')
    await title.pressSequentially('A Very Long Board Name Indeed')
    expect(await fontSize(title)).toBeLessThan(31)
})

test('typing a long title does not shift the card list', async ({ page }) => {
    const board = boards(page).first()
    const title = board.getByPlaceholder('Type a name...')
    const cardTop = async () => (await cardsIn(board).first().boundingBox())!.y

    const base = await cardTop()
    await title.click()
    await title.press('ControlOrMeta+a')
    // grow the name across the shrink threshold and into two wrapped rows
    for (const chunk of ['Short', ' And Now Much', ' Longer Title Here Really Long']) {
        await title.pressSequentially(chunk, { delay: 5 })
        expect(await cardTop()).toBe(base)
    }
})
