import { chromium } from '@playwright/test'
import { mkdirSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const skillDir = dirname(fileURLToPath(import.meta.url))
export const repoRoot = resolve(skillDir, '../../..')
export const distDir = join(repoRoot, 'dist')

export const launchExtension = async ({ runId = `${Date.now()}`, headless = true } = {}) => {
    const profile = `/tmp/tapmytab-verify-${runId}`
    const artifacts = join(skillDir, 'artifacts', runId)
    mkdirSync(artifacts, { recursive: true })

    const context = await chromium.launchPersistentContext(profile, {
        channel: 'chromium',
        headless,
        viewport: { width: 1440, height: 900 },
        args: [`--disable-extensions-except=${distDir}`, `--load-extension=${distDir}`],
    })

    const worker = context.serviceWorkers()[0] ||
        await context.waitForEvent('serviceworker', { timeout: 20_000 })
    const extensionId = new URL(worker.url()).host
    const newTabUrl = `chrome-extension://${extensionId}/index.html`

    const openNewTab = async () => {
        const page = await context.newPage()
        await page.goto(newTabUrl)
        await page.locator('[data-testid="board"]').first().waitFor({ state: 'visible', timeout: 30_000 })
        return page
    }

    const readStorage = () => worker.evaluate(() => chrome.storage.local.get(null))

    const shot = async (page, name) => {
        const path = join(artifacts, `${name}.png`)
        await page.screenshot({ path, fullPage: false })
        return path
    }

    const snapshot = async (page, name) => {
        const path = join(artifacts, `${name}.aria.txt`)
        const { writeFile } = await import('node:fs/promises')
        await writeFile(path, await page.locator('body').ariaSnapshot())
        return path
    }

    const close = async () => {
        await context.close()
        rmSync(profile, { recursive: true, force: true })
    }

    return { context, extensionId, newTabUrl, profile, artifacts, openNewTab, readStorage, shot, snapshot, close }
}
