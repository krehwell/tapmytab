import { expect, test } from '@playwright/test'
import { boardByName, boardMenu, cardsIn, createBoard, gotoApp } from './helpers.ts'

test.beforeEach(async ({ page }) => await gotoApp(page))

test('create a board: it appears with one default card', async ({ page }) => {
    const board = await createBoard(page, 'Groceries')
    await expect(cardsIn(board)).toHaveCount(1)
})

test('new board title gets an emoji prepended', async ({ page }) => {
    // 'Groceries' hits a keyword (🛒…), 'Zxqv' has no match and falls back to a random emoji.
    for (const name of ['Groceries', 'Zxqv']) {
        const title = await createBoard(page, name).then((b) => b.getAttribute('data-board-name'))
        expect(title).toMatch(/^\p{Extended_Pictographic}/u)
        expect(title).toContain(name)
    }
})

test('rename a board', async ({ page }) => {
    await createBoard(page, 'Temp')
    // data-board-name reflects the live value, so resolve the input while it's still "Temp",
    // then commit with Enter (the locator would go stale the moment the name changes).
    await boardByName(page, 'Temp').getByRole('textbox').first().fill('Renamed')
    await page.keyboard.press('Enter')
    await expect(boardByName(page, 'Renamed')).toBeVisible()
    await expect(boardByName(page, 'Temp')).toHaveCount(0)
})

test('add a card via the board menu', async ({ page }) => {
    const board = await createBoard(page, 'Tasks')
    await boardMenu(board, 'Add Card')
    await expect(cardsIn(board)).toHaveCount(2)
})

test('duplicate a board copies its cards', async ({ page }) => {
    const board = await createBoard(page, 'Dup')
    await boardMenu(board, 'Add Card')
    await expect(cardsIn(board)).toHaveCount(2)

    await boardMenu(board, 'Duplicate Board')
    // a second board with the same name now exists, carrying the same card count
    const copies = boardByName(page, 'Dup')
    await expect(copies).toHaveCount(2)
    await expect(cardsIn(copies.nth(1))).toHaveCount(2)
})

test('delete a board removes it', async ({ page }) => {
    const board = await createBoard(page, 'ToDelete')
    await boardMenu(board, 'Delete Board')
    await expect(boardByName(page, 'ToDelete')).toHaveCount(0)
})
