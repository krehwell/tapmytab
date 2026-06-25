import { expect, test } from '@playwright/test'
import { cardsIn, createBoard, gotoApp, openCard } from './helpers.ts'

test.beforeEach(async ({ page }) => await gotoApp(page))

test('edit a card title in the popup and save', async ({ page }) => {
    const board = await createBoard(page, 'Edit')
    const card = cardsIn(board).first()

    const dialog = await openCard(card)
    await dialog.getByPlaceholder('Add Title...').fill('Buy milk')
    await dialog.getByRole('button', { name: 'Save' }).click()

    await expect(page.locator('[data-card-title="Buy milk"]')).toBeVisible()
})

test('add a description in the popup', async ({ page }) => {
    const board = await createBoard(page, 'Desc')
    const dialog = await openCard(cardsIn(board).first())
    await dialog.getByPlaceholder('Add description...').fill('two liters')
    await dialog.getByRole('button', { name: 'Save' }).click()

    // reopen to confirm it persisted
    const reopened = await openCard(cardsIn(board).first())
    await expect(reopened.getByPlaceholder('Add description...')).toHaveValue('two liters')
})

test('emojify a card title from the popup menu', async ({ page }) => {
    const board = await createBoard(page, 'Emoji')
    const card = cardsIn(board).first()
    const before = await card.getAttribute('data-card-title')

    const dialog = await openCard(card)
    await dialog.getByTitle('Card options').click()
    await page.getByRole('menuitem', { name: 'Emojify' }).click()
    await dialog.getByRole('button', { name: 'Save' }).click()

    const after = await cardsIn(board).first().getAttribute('data-card-title')
    expect(after).not.toEqual(before)
    expect(after?.length || 0).toBeGreaterThan((before || '').length)
})

test('inline edits on the board match the popup', async ({ page }) => {
    const board = await createBoard(page, 'Sync')
    const card = cardsIn(board).first()

    // edit the card's title and content inline, straight on the board
    await card.getByPlaceholder('Add Title...').fill('Groceries')
    await card.locator('.tiptap').click()
    await page.keyboard.insertText('buy oat milk')
    await page.waitForTimeout(200) // content onChange is debounced 100ms before it reaches the store

    // open the popup; it reads the same card, so both should match
    const dialog = await openCard(card)
    await expect(dialog.getByPlaceholder('Add Title...')).toHaveValue('Groceries')
    await expect(dialog.locator('.tiptap')).toContainText('buy oat milk')
})

test('cancel does not persist edits', async ({ page }) => {
    const board = await createBoard(page, 'Cancel')
    const dialog = await openCard(cardsIn(board).first())
    await dialog.getByPlaceholder('Add Title...').fill('Should not stick')
    await dialog.getByRole('button', { name: 'Cancel' }).click()

    await expect(page.locator('[data-card-title="Should not stick"]')).toHaveCount(0)
})

test('delete a card from the popup', async ({ page }) => {
    const board = await createBoard(page, 'DeleteCard')
    await expect(cardsIn(board)).toHaveCount(1)

    const dialog = await openCard(cardsIn(board).first())
    await dialog.getByTitle('Card options').click()
    await page.getByRole('menuitem', { name: 'Delete Card' }).click()

    await expect(cardsIn(board)).toHaveCount(0)
})
