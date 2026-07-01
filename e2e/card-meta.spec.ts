import { expect, test } from '@playwright/test'
import { cardsIn, createBoard, gotoApp, openCard } from './helpers.ts'

test.beforeEach(async ({ page }) => await gotoApp(page))

for (const color of ['red', 'green', 'blue', 'yellow'] as const) {
    test(`set the ${color} label on a card`, async ({ page }) => {
        const board = await createBoard(page, `Label-${color}`)
        const dialog = await openCard(cardsIn(board).first())

        await dialog.locator('[data-label]').click() // open the label menu
        await page.locator(`[role="menuitem"] [data-label="${color}"]`).click()
        await dialog.getByRole('button', { name: 'Save' }).click()

        await expect(cardsIn(board).first().locator(`[data-label="${color}"]`)).toBeVisible()
    })
}

test('change a label from one color to another', async ({ page }) => {
    const board = await createBoard(page, 'LabelChange')
    const card = cardsIn(board).first()

    let dialog = await openCard(card)
    await dialog.locator('[data-label]').click()
    await page.locator('[role="menuitem"] [data-label="red"]').click()
    await dialog.getByRole('button', { name: 'Save' }).click()
    await expect(card.locator('[data-label="red"]')).toBeVisible()

    dialog = await openCard(card)
    await dialog.locator('[data-label="red"]').click() // trigger now shows red
    await page.locator('[role="menuitem"] [data-label="blue"]').click()
    await dialog.getByRole('button', { name: 'Save' }).click()
    await expect(card.locator('[data-label="blue"]')).toBeVisible()
    await expect(card.locator('[data-label="red"]')).toHaveCount(0)
})

test('clearing a label back to "no" removes it from the card', async ({ page }) => {
    const board = await createBoard(page, 'LabelClear')
    const card = cardsIn(board).first()

    let dialog = await openCard(card)
    await dialog.locator('[data-label]').click()
    await page.locator('[role="menuitem"] [data-label="green"]').click()
    await dialog.getByRole('button', { name: 'Save' }).click()
    await expect(card.locator('[data-label="green"]')).toBeVisible()

    dialog = await openCard(card)
    await dialog.locator('[data-label="green"]').click()
    await page.locator('[role="menuitem"] [data-label="transparent"]').click() // "No" label
    await dialog.getByRole('button', { name: 'Save' }).click()
    await expect(card.locator('[data-label]')).toHaveCount(0)
})

test('a "no" label is hidden on the card but shown as a grey preview in the popup', async ({ page }) => {
    const board = await createBoard(page, 'NoLabel')
    const card = cardsIn(board).first() // default card carries TLabel.No

    // not rendered on the card face
    await expect(card.locator('[data-label]')).toHaveCount(0)

    // popup still shows it as the empty/grey preview
    const dialog = await openCard(card)
    await expect(dialog.locator('[data-label="transparent"]')).toBeVisible()
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
