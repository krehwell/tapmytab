import { expect, test } from '@playwright/test'
import { cardsIn, createBoard, gotoApp, openCard } from './helpers.ts'

test.beforeEach(async ({ page }) => await gotoApp(page))

test('set a label on a card', async ({ page }) => {
    const board = await createBoard(page, 'Labels')
    const dialog = await openCard(cardsIn(board).first())

    await dialog.locator('[data-label]').click() // open the label menu
    await page.locator('[role="menuitem"] [data-label="red"]').click()
    await dialog.getByRole('button', { name: 'Save' }).click()

    await expect(cardsIn(board).first().locator('[data-label="red"]')).toBeVisible()
})

test('set and clear a due date', async ({ page }) => {
    const board = await createBoard(page, 'Due')
    const card = cardsIn(board).first()

    const dialog = await openCard(card)
    await dialog.locator('input[type="date"]').fill('2030-01-15')
    await dialog.getByRole('button', { name: 'Save' }).click()
    await expect(card).toContainText('15 Jan 2030')

    // reopen and clear via the X next to the date
    const reopened = await openCard(card)
    await reopened.getByTitle('Clear due date').click()
    await reopened.getByRole('button', { name: 'Save' }).click()
    // the card only renders the Due chip when a date is set, so clearing removes it entirely
    await expect(card).not.toContainText('15 Jan 2030')
})
