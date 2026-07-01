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

const drawRectangle = async (
    page: import('@playwright/test').Page,
    frame: import('@playwright/test').FrameLocator,
    canvas: import('@playwright/test').Locator,
) => {
    await frame.getByTestId('toolbar-rectangle').click({ force: true })
    const box = (await canvas.boundingBox())!
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width / 2 + 80, box.y + box.height / 2 + 80)
    await page.mouse.up()
}

test('fullscreen drawing shows Exit (no changes) that closes the popup', async ({ page }) => {
    const board = await createBoard(page, 'UX-DrawFullscreenExit')
    await boardMenu(board, 'Add Drawing Card')
    const dialog = await openCard(cardsIn(board).first())

    const frame = page.frameLocator('iframe[title="Excalidraw"]')
    await frame.getByTitle('Fullscreen').click()

    // nothing drawn: Exit shows, Save hidden
    await expect(frame.getByTitle('Exit', { exact: true })).toBeVisible()
    await expect(frame.getByTitle('Save')).toHaveCount(0)

    await frame.getByTitle('Exit', { exact: true }).click({ force: true })
    await expect(dialog).not.toBeVisible()
})

test('fullscreen drawing shows Save (dirty) that persists without closing', async ({ page }) => {
    const board = await createBoard(page, 'UX-DrawFullscreenSave')
    await boardMenu(board, 'Add Drawing Card')
    const dialog = await openCard(cardsIn(board).first())

    const frame = page.frameLocator('iframe[title="Excalidraw"]')
    const canvas = dialog.getByTitle('Excalidraw')

    // draw before fullscreen (excalidraw's baseline onChange has fired by now) -> dirty
    await drawRectangle(page, frame, canvas)
    await frame.getByTitle('Fullscreen').click()

    const save = frame.getByTitle('Save')
    await expect(save).toBeVisible()
    await page.waitForTimeout(700) // let excalidraw's trailing change/preview events settle before saving
    await save.click()

    // save must NOT close the popup, and clears dirty -> back to Exit
    await expect(dialog).toBeVisible()
    await expect(frame.getByTitle('Exit', { exact: true })).toBeVisible()
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
