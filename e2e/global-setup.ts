import { chromium, FullConfig } from '@playwright/test'

const globalSetup = async (config: FullConfig) => {
    const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:5173'
    const browser = await chromium.launch()
    const page = await browser.newPage()
    try {
        await page.goto(baseURL, { timeout: 60_000 })
        await page.getByTestId('board').first().waitFor({ state: 'visible', timeout: 60_000 })
    } finally {
        await browser.close()
    }
}

export default globalSetup
