import { launchExtension } from '../ext.mjs'

const runId = process.argv[2] || `${Date.now()}`
const NAME = 'VerifyRun'

const ext = await launchExtension({ runId })
console.log(`extension id: ${ext.extensionId}`)
console.log(`artifacts: ${ext.artifacts}`)

try {
    const page = await ext.openNewTab()
    const seeded = await page.locator('[data-testid="board"]').count()
    if (seeded !== 4) throw new Error(`expected 4 seeded boards on a fresh profile, got ${seeded}`)
    await ext.shot(page, '01-fresh-newtab')

    const input = page.getByTestId('board-placeholder').getByPlaceholder('Type a name...')
    await input.fill(NAME)
    await input.blur()
    const board = page.locator(`[data-testid="board"][data-board-name$="${NAME}"]`)
    await board.waitFor({ state: 'visible', timeout: 10_000 })

    await board.getByTestId('card').first().getByPlaceholder('Add Title...').fill('Persist me')
    await page.locator('[data-card-title="Persist me"]').waitFor({ state: 'visible', timeout: 10_000 })
    await ext.shot(page, '02-board-created')

    await page.waitForTimeout(1200)
    const stored = await ext.readStorage()
    const storedBoard = (stored.boards || []).find((b) => b.name.endsWith(NAME))
    if (!storedBoard) throw new Error('board missing from chrome.storage.local')
    if (!storedBoard.cards.some((c) => c.title === 'Persist me')) {
        throw new Error('card title missing from chrome.storage.local')
    }
    console.log(`storage: ${stored.boards.length} boards, "${storedBoard.name}" holds "Persist me"`)

    await page.close()
    const reopened = await ext.openNewTab()
    const after = reopened.locator(`[data-testid="board"][data-board-name$="${NAME}"]`)
    await after.waitFor({ state: 'visible', timeout: 10_000 })
    await reopened.locator('[data-card-title="Persist me"]').waitFor({ state: 'visible', timeout: 10_000 })
    await ext.shot(reopened, '03-after-reopen')
    await ext.snapshot(reopened, '03-after-reopen')

    console.log('PASS persistence: board and card survived a new-tab reopen')
} finally {
    await ext.close()
}
