import { expect, test } from '@playwright/test'
import { gotoApp } from './helpers.ts'

// Capture window.open so search/links don't spawn real external tabs.
test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        ;(globalThis as unknown as { __opened: string[] }).__opened = []
        globalThis.open = ((url: string) => {
            ;(globalThis as unknown as { __opened: string[] }).__opened.push(String(url))
            return null
        }) as typeof globalThis.open
    })
    await gotoApp(page)
})

const opened = (page) => page.evaluate(() => (globalThis as unknown as { __opened: string[] }).__opened)

test('search opens the default provider (YouTube) with the query', async ({ page }) => {
    const input = page.getByPlaceholder(/Search from/)
    await input.fill('lofi beats')
    await input.press('Enter')

    await expect.poll(() => opened(page)).toEqual([
        'https://www.youtube.com/results?search_query=lofi%20beats',
    ])
})

test('switching provider changes the placeholder and the search URL', async ({ page }) => {
    // the navbar's only button is the provider dropdown (the logo is an <h1>)
    await page.locator('nav button').first().click()
    await page.getByRole('menuitem').nth(1).click() // Google (icon-only options)

    await expect(page.getByPlaceholder('Search from Google')).toBeVisible()

    const input = page.getByPlaceholder('Search from Google')
    await input.fill('claude')
    await input.press('Enter')
    await expect.poll(() => opened(page)).toContain('https://www.google.com/search?q=claude')
})
