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

test('drawing popup toolbar toggles native fullscreen', async ({ page }) => {
    const board = await createBoard(page, 'UX-Fullscreen')
    await boardMenu(board, 'Add Drawing Card')
    await openCard(cardsIn(board).first())

    // the fullscreen toggle lives inside the excalidraw toolbar (the iframe)
    const frame = page.frameLocator('iframe[title="Excalidraw"]')
    const fsFrame = () => page.frames().find((f) => f.url().includes('excalidraw.html'))!
    const fullscreenEl = () => fsFrame().evaluate(() => document.fullscreenElement?.tagName ?? null)

    await expect(frame.getByTitle('Fullscreen', { exact: true })).toBeVisible()
    expect(await fullscreenEl()).toBeNull()

    // enter: the button requests native fullscreen; the icon flips on fullscreenchange
    await frame.getByTitle('Fullscreen', { exact: true }).click()
    await expect(frame.getByTitle('Exit fullscreen', { exact: true })).toBeVisible()
    expect(await fullscreenEl()).toBe('HTML')

    // exit restores the normal toolbar button
    await frame.getByTitle('Exit fullscreen', { exact: true }).click()
    await expect(frame.getByTitle('Fullscreen', { exact: true })).toBeVisible()
    expect(await fullscreenEl()).toBeNull()
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
