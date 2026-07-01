import { expect, Locator, Page, test } from '@playwright/test'
import { cardsIn, createBoard, gotoApp, openCard } from './helpers.ts'

test.beforeEach(async ({ page }) => await gotoApp(page))

const openEditor = async (page: Page, name: string): Promise<[Locator, Locator]> => {
    const board = await createBoard(page, name)
    const dialog = await openCard(cardsIn(board).first())
    await expect(dialog.getByPlaceholder('Add Title...')).toBeFocused()
    const editor = dialog.locator('.tiptap')
    await editor.click()
    await expect(editor).toBeFocused()
    return [dialog, editor]
}

const typeAndSelectAll = async (page: Page, editor: Locator, content: string) => {
    await editor.click()
    await page.keyboard.insertText(content)
    await page.keyboard.press('ControlOrMeta+A')
}

test('bold the selected text', async ({ page }) => {
    const [dialog, editor] = await openEditor(page, 'Bold')
    await dialog.getByTitle('Bold', { exact: true }).click()
    await page.keyboard.insertText('make me bold')
    await expect(editor.locator('strong')).toHaveText('make me bold')
})

test('insert a link', async ({ page }) => {
    const [dialog, editor] = await openEditor(page, 'Link')
    await editor.click()
    await dialog.getByTitle('Link', { exact: true }).click()
    await dialog.getByPlaceholder('link text').fill('Youtube')
    await dialog.getByPlaceholder('url').fill('https://youtube.com')
    await dialog.getByPlaceholder('url').press('Enter')

    const link = editor.locator('a', { hasText: 'Youtube' })
    await expect(link).toHaveAttribute('href', 'https://youtube.com')
})

test('editing a link name keeps it a link', async ({ page }) => {
    const [dialog, editor] = await openEditor(page, 'EditLink')
    await editor.click()
    await dialog.getByTitle('Link', { exact: true }).click()
    await dialog.getByPlaceholder('link text').fill('Youtube')
    await dialog.getByPlaceholder('url').fill('https://youtube.com')
    await dialog.getByPlaceholder('url').press('Enter')
    await expect(editor.locator('a', { hasText: 'Youtube' })).toBeVisible()

    await editor.locator('a', { hasText: 'Youtube' }).click()
    await dialog.getByTitle('Edit Link').click()
    await dialog.getByPlaceholder('link text').fill('YT')
    await dialog.getByPlaceholder('link text').press('Enter')

    // the renamed text must still be an <a> with the original href
    const link = editor.locator('a', { hasText: 'YT' })
    await expect(link).toHaveText('YT')
    await expect(link).toHaveAttribute('href', 'https://youtube.com')
})

test('add, select, and delete a horizontal rule', async ({ page }) => {
    const [dialog, editor] = await openEditor(page, 'Rule')
    await editor.click()

    // add
    await dialog.getByTitle('Horizontal Rule', { exact: true }).click()
    await expect(editor.locator('hr')).toHaveCount(1)

    // click to select it (node selection), then delete
    await editor.locator('hr').click()
    await expect(editor.locator('hr.ProseMirror-selectednode')).toBeVisible()
    await page.keyboard.press('Backspace')
    await expect(editor.locator('hr')).toHaveCount(0)

    // add again
    await dialog.getByTitle('Horizontal Rule', { exact: true }).click()
    await expect(editor.locator('hr')).toHaveCount(1)
})

test('make a bullet list', async ({ page }) => {
    const [dialog, editor] = await openEditor(page, 'List')
    await editor.click()
    await page.keyboard.insertText('first item')
    await dialog.getByTitle('Lists', { exact: true }).click()
    await page.getByRole('menuitem').first().click() // Bullet List (icon-only options)

    await expect(editor.locator('ul li')).toContainText('first item')
})

test('italic the selected text', async ({ page }) => {
    const [dialog, editor] = await openEditor(page, 'Italic')
    await typeAndSelectAll(page, editor, 'make me italic')
    await dialog.getByTitle('Italic', { exact: true }).click()

    await expect(editor.locator('em')).toHaveText('make me italic')
})

test('inline code the selected text', async ({ page }) => {
    const [dialog, editor] = await openEditor(page, 'Code')
    await typeAndSelectAll(page, editor, 'const x = 1')
    await dialog.getByTitle('Code', { exact: true }).click()

    await expect(editor.locator('code')).toHaveText('const x = 1')
})

test('code block the selected text', async ({ page }) => {
    const [dialog, editor] = await openEditor(page, 'CodeBlock')
    await typeAndSelectAll(page, editor, 'sum = a + b')
    await dialog.getByTitle('Code Block', { exact: true }).click()

    await expect(editor.locator('pre code')).toHaveText('sum = a + b')
})

test('turn a line into a heading', async ({ page }) => {
    const [dialog, editor] = await openEditor(page, 'Heading')
    await editor.click()
    await page.keyboard.insertText('big title')
    await dialog.getByTitle('Headings', { exact: true }).click()
    await page.getByRole('menuitem').nth(1).click() // Paragraph, H1, H2, H3, H4

    await expect(editor.locator('h1')).toHaveText('big title')
})

test('center align a paragraph', async ({ page }) => {
    const [dialog, editor] = await openEditor(page, 'Align')
    await editor.click()
    await page.keyboard.insertText('center me')
    await dialog.getByTitle('Text Alignment', { exact: true }).click()
    await page.getByRole('menuitem').nth(1).click() // Left, center, Right

    await expect(editor.locator('p', { hasText: 'center me' })).toHaveCSS('text-align', 'center')
})

test('make an ordered list', async ({ page }) => {
    const [dialog, editor] = await openEditor(page, 'Ordered')
    await editor.click()
    await page.keyboard.insertText('step one')
    await dialog.getByTitle('Lists', { exact: true }).click()
    await page.getByRole('menuitem').nth(1).click() // Bullet, Ordered, Task

    await expect(editor.locator('ol li')).toContainText('step one')
})

test('make a task list', async ({ page }) => {
    const [dialog, editor] = await openEditor(page, 'Tasks')
    await editor.click()
    await page.keyboard.insertText('todo item')
    await dialog.getByTitle('Lists', { exact: true }).click()
    await page.getByRole('menuitem').nth(2).click() // Bullet, Ordered, Task

    await expect(editor.locator('ul[data-type="taskList"] li')).toContainText('todo item')
})

test('undo and redo typing', async ({ page }) => {
    const [dialog, editor] = await openEditor(page, 'History')
    await editor.click()
    await page.keyboard.insertText('typed text')
    await expect(editor).toContainText('typed text')

    await dialog.getByTitle('Undo', { exact: true }).click()
    await expect(editor).not.toContainText('typed text')

    await dialog.getByTitle('Redo', { exact: true }).click()
    await expect(editor).toContainText('typed text')
})

test('typed content persists after save and reopen', async ({ page }) => {
    const board = await createBoard(page, 'Persist')
    const dialog = await openCard(cardsIn(board).first())
    await expect(dialog.getByPlaceholder('Add Title...')).toBeFocused()
    const editor = dialog.locator('.tiptap')
    await editor.click()
    await expect(editor).toBeFocused()
    await page.keyboard.insertText('remember this')
    await page.waitForTimeout(200) // editor onChange is debounced 100ms before it reaches the store
    await dialog.getByRole('button', { name: 'Save' }).click()

    const reopened = await openCard(cardsIn(board).first())
    await expect(reopened.locator('.tiptap')).toContainText('remember this')
})
