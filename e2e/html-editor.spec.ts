import { expect, Locator, test } from '@playwright/test'
import { cardsIn, createBoard, gotoApp, openCard } from './helpers.ts'

test.beforeEach(async ({ page }) => await gotoApp(page))

const openEditor = async (page, name: string): Promise<[Locator, Locator]> => {
    const board = await createBoard(page, name)
    const dialog = await openCard(cardsIn(board).first())
    const editor = dialog.locator('.tiptap')
    await expect(editor).toBeVisible()
    return [dialog, editor]
}

test('bold the selected text', async ({ page }) => {
    const [dialog, editor] = await openEditor(page, 'Bold')
    await editor.click()
    await page.keyboard.insertText('make me bold')
    await page.keyboard.press('ControlOrMeta+A')
    await dialog.getByTitle('Bold', { exact: true }).click()

    await expect(editor.locator('strong')).toHaveText('make me bold')
})

test('insert a link', async ({ page }) => {
    const [dialog, editor] = await openEditor(page, 'Link')
    await editor.click()
    await dialog.getByTitle('Link', { exact: true }).click()
    await dialog.getByPlaceholder('link text').fill('Anthropic')
    await dialog.getByPlaceholder('url').fill('https://anthropic.com')
    await dialog.getByPlaceholder('url').press('Enter')

    const link = editor.locator('a', { hasText: 'Anthropic' })
    await expect(link).toHaveAttribute('href', 'https://anthropic.com')
})

test('make a bullet list', async ({ page }) => {
    const [dialog, editor] = await openEditor(page, 'List')
    await editor.click()
    await page.keyboard.insertText('first item')
    await dialog.getByTitle('Lists', { exact: true }).click()
    await page.getByRole('menuitem').first().click() // Bullet List (icon-only options)

    await expect(editor.locator('ul li')).toContainText('first item')
})

test('typed content persists after save and reopen', async ({ page }) => {
    const board = await createBoard(page, 'Persist')
    const dialog = await openCard(cardsIn(board).first())
    await dialog.locator('.tiptap').click()
    await page.keyboard.insertText('remember this')
    await page.waitForTimeout(200) // editor onChange is debounced 100ms before it reaches the store
    await dialog.getByRole('button', { name: 'Save' }).click()

    const reopened = await openCard(cardsIn(board).first())
    await expect(reopened.locator('.tiptap')).toContainText('remember this')
})
