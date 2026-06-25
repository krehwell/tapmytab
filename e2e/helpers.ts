import { expect, Locator, Page } from '@playwright/test'

// Real boards (not the trailing placeholder). data-* attrs come from the app
// containers; we scope by them because React controlled-input values aren't
// matchable via CSS selectors.
export const boards = (page: Page) => page.getByTestId('board')
// new boards get an emoji prepended (see emojify), so match on the trailing typed name.
export const boardByName = (page: Page, name: string) =>
    page.locator(`[data-testid="board"][data-board-name$="${name}"]`)
export const cardsIn = (board: Locator) => board.getByTestId('card')

export const gotoApp = async (page: Page) => {
    await page.goto('/')
    // generous: a cold vite dev server optimizes deps on first hit and reloads the page mid-load
    await expect(boards(page).first()).toBeVisible({ timeout: 20_000 })
}

export const createBoard = async (page: Page, name: string): Promise<Locator> => {
    const input = page.getByTestId('board-placeholder').getByPlaceholder('Type a name...')
    await input.fill(name)
    await input.blur()
    const board = boardByName(page, name)
    await expect(board).toBeVisible()
    return board
}

export const boardMenu = async (board: Locator, item: string) => {
    await board.getByTitle('Board options').click()
    await board.page().getByRole('menuitem', { name: item }).click()
}

export const openCard = async (card: Locator): Promise<Locator> => {
    const header = card.getByTestId('card-header')
    const box = await header.boundingBox()
    if (!box) throw new Error('card header has no box')
    await header.click({ position: { x: 12, y: box.height - 6 } })
    const dialog = card.page().getByRole('dialog')
    await expect(dialog).toBeVisible()
    return dialog
}

// dnd-kit PointerSensor needs an 8px move to activate; drag in steps and settle.
export const dragCard = async (page: Page, source: Locator, target: Locator) => {
    const s = await source.boundingBox()
    const t = await target.boundingBox()
    if (!s || !t) throw new Error('drag source/target has no box')
    await page.mouse.move(s.x + s.width / 2, s.y + 10)
    await page.mouse.down()
    await page.mouse.move(s.x + s.width / 2, s.y + 24, { steps: 6 }) // pass activation threshold
    await page.mouse.move(t.x + t.width / 2, t.y + t.height / 2, { steps: 12 })
    await page.mouse.move(t.x + t.width / 2, t.y + t.height / 2, { steps: 4 }) // let dnd-kit settle
    await page.mouse.up()
}

export const cardTitles = async (board: Locator): Promise<string[]> =>
    cardsIn(board).evaluateAll((els) => els.map((e) => e.getAttribute('data-card-title') || ''))
