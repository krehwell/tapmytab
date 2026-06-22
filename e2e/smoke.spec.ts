import { expect, test } from '@playwright/test'
import { boards, gotoApp } from './helpers.ts'

test('app loads with the seeded boards and an add-board placeholder', async ({ page }) => {
    await gotoApp(page)
    await expect(boards(page)).toHaveCount(4)
    await expect(page.getByTestId('board-placeholder')).toBeVisible()
})
