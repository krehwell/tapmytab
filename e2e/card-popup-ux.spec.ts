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
    await boardMenu(board, 'Add Drawing Card')

    const dialog = await openCard(cardsIn(board).first())
    await expect(dialog.getByTitle('Excalidraw')).toBeFocused()
})

test('drawing popup toggles fullscreen and hides meta/actions', async ({ page }) => {
    const board = await createBoard(page, 'UX-Fullscreen')
    await boardMenu(board, 'Add Drawing Card')
    const dialog = await openCard(cardsIn(board).first())

    // normal drawing popup: description, Save, and the expand control are present
    await expect(dialog.getByPlaceholder('Add description...')).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'Save' })).toBeVisible()
    await expect(dialog.getByTitle('Fullscreen', { exact: true })).toBeVisible()

    // enter fullscreen via the floating canvas button
    await dialog.getByTitle('Fullscreen', { exact: true }).click()

    // the paper now fills the viewport (normal drawing popup is capped at 90rem wide)
    const vp = page.viewportSize()!
    const box = await dialog.boundingBox()
    expect(box!.width).toBeGreaterThanOrEqual(vp.width - 5)
    expect(box!.height).toBeGreaterThanOrEqual(vp.height - 5)

    // meta + actions + the options menu are hidden to maximize the canvas
    await expect(dialog.getByTitle('Exit fullscreen', { exact: true })).toBeVisible()
    await expect(dialog.getByPlaceholder('Add description...')).toHaveCount(0)
    await expect(dialog.getByTitle('Card options')).toHaveCount(0)
    await expect(dialog.getByRole('button', { name: 'Save' })).toHaveCount(0)
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toHaveCount(0)

    // title + close stay
    await expect(dialog.getByPlaceholder('Add Title...')).toBeVisible()
    await expect(dialog.getByTitle('Close')).toBeVisible()

    // exit fullscreen restores the normal popup
    await dialog.getByTitle('Exit fullscreen', { exact: true }).click()
    await expect(dialog.getByTitle('Fullscreen', { exact: true })).toBeVisible()
    await expect(dialog.getByPlaceholder('Add description...')).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'Save' })).toBeVisible()
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

test('drawing popup backdrop click closes when not dirty', async ({ page }) => {
    const board = await createBoard(page, 'UX-DrawBackdropClean')
    await boardMenu(board, 'Add Drawing Card')
    const dialog = await openCard(cardsIn(board).first())
    await page.mouse.click(10, 10)
    await expect(dialog).not.toBeVisible()
})

test('drawing popup backdrop click does not close when dirty', async ({ page }) => {
    const board = await createBoard(page, 'UX-DrawBackdropDirty')
    await boardMenu(board, 'Add Drawing Card')
    const dialog = await openCard(cardsIn(board).first())

    const canvas = dialog.getByTitle('Excalidraw')
    const frame = page.frameLocator('iframe[title="Excalidraw"]')
    await frame.getByTestId('toolbar-rectangle').click({ force: true })

    const box = (await canvas.boundingBox())!
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width / 2 + 80, box.y + box.height / 2 + 80)
    await page.mouse.up()

    await page.mouse.click(10, 10)
    await expect(dialog).toBeVisible()
})
