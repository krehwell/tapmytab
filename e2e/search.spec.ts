import { expect, Page, test } from '@playwright/test'
import { gotoApp } from './helpers.ts'

const searchInput = (page: Page) => page.getByPlaceholder(/Search by title/)
const results = (page: Page) => page.getByTestId('search-result')

const openSearch = async (page: Page) => {
    await page.keyboard.press('Control+k')
    await expect(searchInput(page)).toBeVisible()
}

test('finds template cards by title, and across fields by content', async ({ page }) => {
    await gotoApp(page)
    await openSearch(page)
    const input = searchInput(page)

    // title match
    await input.fill('Errands')
    await expect(results(page).first()).toContainText('Errands')

    // content match: the Errands card body lists "avocados", title doesn't
    await input.fill('avocados')
    await expect(results(page).first()).toContainText('Errands')
})

test('search is typo-resistant', async ({ page }) => {
    await gotoApp(page)
    await openSearch(page)
    // "Daily habits 💪" with two typos
    await searchInput(page).fill('daly habts')
    await expect(results(page).first()).toContainText('Daily habits')
})

test('Enter on a result closes search and focuses the matching card', async ({ page }) => {
    await gotoApp(page)
    await openSearch(page)
    const input = searchInput(page)
    await input.fill('Japan itinerary')
    await expect(results(page).first()).toContainText('Japan itinerary')

    await input.press('Enter')
    await expect(searchInput(page)).toBeHidden()
    // CARD5 ("Japan itinerary") has id "card5"; its title input gets focused
    await expect(page.locator('#card5 input').first()).toBeFocused()
})

test('clicking a result selects it', async ({ page }) => {
    await gotoApp(page)
    await openSearch(page)
    await searchInput(page).fill('Japan itinerary')
    await results(page).first().click()
    await expect(searchInput(page)).toBeHidden()
    await expect(page.locator('#card5 input').first()).toBeFocused()
})

test('selecting a not-yet-mounted card opens it in the card popup', async ({ page }) => {
    // perf mode renders a huge board; progressive mount reveals only the first cards,
    // so a deep card has no element to scroll to and the search falls back to the popup.
    await page.goto('/?perf=1x500')
    await expect(page.getByTestId('board').first()).toBeVisible({ timeout: 20_000 })

    await openSearch(page)
    // unique to card 480, which is far beyond the mount window
    await searchInput(page).fill('card 480 on board 1')
    await expect(results(page).first()).toContainText('Card 480')
    await searchInput(page).press('Enter')

    // the card popup (not a board card) is what shows the title now
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByPlaceholder('Add Title...')).toHaveValue('Card 480')
})
