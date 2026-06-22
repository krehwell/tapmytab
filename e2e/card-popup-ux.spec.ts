import { expect, test } from '@playwright/test'
import { boardMenu, cardsIn, createBoard, gotoApp, openCard } from './helpers.ts'

test.beforeEach(async ({ page }) => await gotoApp(page))

test('popup auto-focuses title on open', async ({ page }) => {
    const board = await createBoard(page, 'UX-Focus')
    const dialog = await openCard(cardsIn(board).first())
    await expect(dialog.getByPlaceholder('Add Title...')).toBeFocused()
})

test('tab moves focus: title → description → editor', async ({ page }) => {
    const board = await createBoard(page, 'UX-Tab')
    const dialog = await openCard(cardsIn(board).first())

    await expect(dialog.getByPlaceholder('Add Title...')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(dialog.getByPlaceholder('Add description...')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(dialog.locator('[contenteditable="true"]')).toBeFocused()
})

test('cmd+enter saves and closes the popup', async ({ page }) => {
    const board = await createBoard(page, 'UX-CmdEnter')
    const dialog = await openCard(cardsIn(board).first())
    await dialog.getByPlaceholder('Add Title...').fill('Shortcut save')
    await page.keyboard.press('Meta+Enter')

    await expect(dialog).not.toBeVisible()
    await expect(page.locator('[data-card-title="Shortcut save"]')).toBeVisible()
})

test('drawing popup auto-focuses the excalidraw canvas', async ({ page }) => {
    const board = await createBoard(page, 'UX-Draw')
    await boardMenu(board, 'Add Excalidraw Card')

    const dialog = await openCard(cardsIn(board).first())
    await expect(dialog.getByTitle('Excalidraw')).toBeFocused()
})

test('backdrop click closes popup when not dirty', async ({ page }) => {
    const board = await createBoard(page, 'UX-BackdropClean')
    const dialog = await openCard(cardsIn(board).first())
    await page.mouse.click(10, 10)
    await expect(dialog).not.toBeVisible()
})

test('backdrop click does not close popup when dirty', async ({ page }) => {
    const board = await createBoard(page, 'UX-BackdropDirty')
    const dialog = await openCard(cardsIn(board).first())
    await dialog.getByPlaceholder('Add Title...').fill('unsaved')
    await page.mouse.click(10, 10)
    await expect(dialog).toBeVisible()
})
