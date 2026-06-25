import { expect, Page, test } from '@playwright/test'
import { gotoApp } from './helpers.ts'

test.beforeEach(async ({ page }) => await gotoApp(page))

const searchInput = (page: Page) => page.getByPlaceholder(/Search by title/)
const results = (page: Page) => page.getByTestId('search-result')

// open via the Cmd/Ctrl+K shortcut (handler accepts either modifier)
const openSearch = async (page: Page) => {
    await page.keyboard.press('Control+k')
    await expect(searchInput(page)).toBeVisible()
}

test('Cmd/Ctrl+K opens search; Escape and Ctrl+[ close it', async ({ page }) => {
    await openSearch(page)
    await page.keyboard.press('Escape')
    await expect(searchInput(page)).toBeHidden()

    await openSearch(page)
    await searchInput(page).press('Control+[')
    await expect(searchInput(page)).toBeHidden()
})

test('persists the query across close/reopen and selects it on reopen', async ({ page }) => {
    await openSearch(page)
    await searchInput(page).fill('errands')
    await page.keyboard.press('Escape')
    await expect(searchInput(page)).toBeHidden()

    await openSearch(page)
    const input = searchInput(page)
    await expect(input).toHaveValue('errands')
    // onEntered focuses + selects all, so the first keystroke replaces the whole query
    await expect(input).toBeFocused()
    await page.keyboard.press('z')
    await expect(input).toHaveValue('z')
})

test('arrow / ctrl-n,p / tab,shift-tab move the active result', async ({ page }) => {
    await openSearch(page)
    const input = searchInput(page)
    await input.fill('a') // broad query → several results
    await expect(results(page).nth(1)).toBeVisible()

    // first row is active by default
    await expect(results(page).nth(0)).toHaveAttribute('aria-selected', 'true')

    for (const [next, prev] of [['ArrowDown', 'ArrowUp'], ['Control+n', 'Control+p'], ['Tab', 'Shift+Tab']]) {
        await input.press(next)
        await expect(results(page).nth(1)).toHaveAttribute('aria-selected', 'true')
        await input.press(prev)
        await expect(results(page).nth(0)).toHaveAttribute('aria-selected', 'true')
    }
})
