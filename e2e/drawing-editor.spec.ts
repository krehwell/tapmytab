import { expect, FrameLocator, Locator, Page, test } from '@playwright/test'
import { boardMenu, cardsIn, createBoard, gotoApp, openCard } from './helpers.ts'

test.beforeEach(async ({ page }) => await gotoApp(page))

const drawRectangle = async (page: Page, frame: FrameLocator, canvas: Locator) => {
    await frame.getByTestId('toolbar-rectangle').click({ force: true })
    const box = (await canvas.boundingBox())!
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width / 2 + 80, box.y + box.height / 2 + 80)
    await page.mouse.up()
}

test('adding a drawing card shows the draw placeholder', async ({ page }) => {
    const board = await createBoard(page, 'Doodles')
    await boardMenu(board, 'Add Drawing Card')
    await expect(board.getByText('click to draw')).toBeVisible()
})

test('popup auto-focuses the excalidraw canvas', async ({ page }) => {
    const board = await createBoard(page, 'UX-Draw')
    await boardMenu(board, 'Add Drawing Card')

    const dialog = await openCard(cardsIn(board).first())
    await expect(dialog.getByTitle('Excalidraw')).toBeFocused()
})

test('backdrop click closes popup when not dirty', async ({ page }) => {
    const board = await createBoard(page, 'UX-DrawBackdropClean')
    await boardMenu(board, 'Add Drawing Card')
    const dialog = await openCard(cardsIn(board).first())
    await page.mouse.click(10, 10)
    await expect(dialog).not.toBeVisible()
})

test('backdrop click does not close popup when dirty', async ({ page }) => {
    const board = await createBoard(page, 'UX-DrawBackdropDirty')
    await boardMenu(board, 'Add Drawing Card')
    const dialog = await openCard(cardsIn(board).first())

    const frame = page.frameLocator('iframe[title="Excalidraw"]')
    await drawRectangle(page, frame, dialog.getByTitle('Excalidraw'))

    await page.mouse.click(10, 10)
    await expect(dialog).toBeVisible()
})

test('fullscreen shows Exit (no changes) that closes the popup', async ({ page }) => {
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

test('fullscreen shows Save (dirty) that persists without closing', async ({ page }) => {
    const board = await createBoard(page, 'UX-DrawFullscreenSave')
    await boardMenu(board, 'Add Drawing Card')
    const dialog = await openCard(cardsIn(board).first())

    const frame = page.frameLocator('iframe[title="Excalidraw"]')

    // draw before fullscreen (excalidraw's baseline onChange has fired by now) -> dirty
    await drawRectangle(page, frame, dialog.getByTitle('Excalidraw'))
    await frame.getByTitle('Fullscreen').click()

    const save = frame.getByTitle('Save')
    await expect(save).toBeVisible()
    await page.waitForTimeout(700) // let excalidraw's trailing change/preview events settle before saving
    await save.click()

    // save must NOT close the popup, and clears dirty -> back to Exit
    await expect(dialog).toBeVisible()
    await expect(frame.getByTitle('Exit', { exact: true })).toBeVisible()
})
