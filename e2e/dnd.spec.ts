import { expect, Locator, Page, test } from '@playwright/test'
import { boardMenu, cardsIn, cardTitles, createBoard, dragCard, gotoApp } from './helpers.ts'

test.beforeEach(async ({ page }) => await gotoApp(page))

const buildCards = async (page: Page, name: string, titles: string[]): Promise<Locator> => {
    const board = await createBoard(page, name)
    await cardsIn(board).first().getByPlaceholder('Add Title...').fill(titles[0])
    for (const t of titles.slice(1)) {
        await boardMenu(board, 'Add Card')
        await cardsIn(board).first().getByPlaceholder('Add Title...').fill(t)
    }
    return board
}

const header = (board: Locator, title: string) =>
    board.locator(`[data-card-title="${title}"]`).getByTestId('card-header')

test('reorder cards within a board', async ({ page }) => {
    const board = await buildCards(page, 'Reorder', ['Alpha', 'Beta'])
    expect(await cardTitles(board)).toEqual(['Beta', 'Alpha'])

    await dragCard(page, header(board, 'Beta'), header(board, 'Alpha'))

    await expect.poll(() => cardTitles(board)).toEqual(['Alpha', 'Beta'])
})

test('move a card to another board', async ({ page }) => {
    const from = await buildCards(page, 'From', ['Mover'])
    const to = await createBoard(page, 'To')

    await dragCard(page, header(from, 'Mover'), to.getByTestId('card').first().getByTestId('card-header'))

    await expect.poll(() => cardTitles(to)).toContain('Mover')
    await expect.poll(() => cardTitles(from)).toEqual([])
})

test('shuffle several cards to another board keeps every card and its order', async ({ page }) => {
    const src = await buildCards(page, 'Src', ['a1', 'a2', 'a3']) // DOM: a3, a2, a1
    const dst = await buildCards(page, 'Dst', ['b1'])

    // drop each onto Dst's current top card, which inserts it at the top of Dst
    for (const title of ['a1', 'a2', 'a3']) {
        const top = dst.getByTestId('card').first().getByTestId('card-header')
        await dragCard(page, header(src, title), top)
        await expect.poll(() => cardTitles(dst)).toContain(title) // settle before the next drag
    }

    // integrity: nothing left behind, nothing lost or duplicated
    await expect.poll(() => cardTitles(src)).toEqual([])
    await expect.poll(async () => (await cardTitles(dst)).slice().sort()).toEqual(['a1', 'a2', 'a3', 'b1'])
    // position: each was dropped on top, so newest ends up highest
    await expect.poll(() => cardTitles(dst)).toEqual(['a3', 'a2', 'a1', 'b1'])
})
