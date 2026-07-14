// records the landing-page demo video (landing/img/demo.mp4).
// needs: deno task dev (localhost:5173), then: node scripts/record-demo.mjs
// encode: ffmpeg -ss 1.0 -i .videotmp/page@*.webm -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart -an landing/img/demo.mp4
import { chromium } from '@playwright/test'

const VDIR = '/Users/ard/Documents/personal/tapmytab/.videotmp'
const browser = await chromium.launch()
const context = await browser.newContext({
    viewport: { width: 1280, height: 776 },
    deviceScaleFactor: 2,
    recordVideo: { dir: VDIR, size: { width: 1280, height: 776 } },
})
const page = await context.newPage()

// big Screen-Studio-ish cursor: smooth follow, squish + ripple on click
await page.addInitScript(() => {
    const mount = () => {
        if (document.getElementById('__cur')) return
        const c = document.createElement('div')
        c.id = '__cur'
        c.style.cssText = 'position:fixed;top:0;left:0;z-index:2147483647;pointer-events:none;transition:transform 40ms linear;will-change:transform'
        c.innerHTML = `<svg width="44" height="52" viewBox="0 0 24 28" style="filter: drop-shadow(0 2px 6px rgba(0,0,0,.5)); transition: transform 90ms ease; transform-origin: 4px 3px">
            <path d="M4 2 L4 21.5 L9 17.5 L12.2 24.6 L15.4 23.1 L12.2 16.2 L18.5 15.7 Z" fill="#fff" stroke="#1a1a1a" stroke-width="1.4" stroke-linejoin="round"/>
        </svg>`
        document.documentElement.appendChild(c)
        const svg = c.firstElementChild
        window.addEventListener('mousemove', (e) => {
            c.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
        }, true)
        window.addEventListener('mousedown', (e) => {
            svg.style.transform = 'scale(0.82)'
            const r = document.createElement('div')
            r.style.cssText = `position:fixed;left:${e.clientX - 24}px;top:${e.clientY - 24}px;width:48px;height:48px;border-radius:50%;border:3px solid rgba(153,200,255,.9);z-index:2147483646;pointer-events:none`
            document.documentElement.appendChild(r)
            r.animate([
                { transform: 'scale(0.4)', opacity: 0.9 },
                { transform: 'scale(1.6)', opacity: 0 },
            ], { duration: 480, easing: 'ease-out' }).onfinish = () => r.remove()
        }, true)
        window.addEventListener('mouseup', () => { svg.style.transform = 'scale(1)' }, true)
    }
    if (document.readyState !== 'loading') mount()
    else document.addEventListener('DOMContentLoaded', mount)
})

await page.goto('http://localhost:5173/')
await page.locator('[data-testid="board"]').first().waitFor({ timeout: 30000 })
await page.waitForTimeout(2000)
await page.mouse.move(640, 400, { steps: 10 })
await page.waitForTimeout(1200)

// ---- 1. drag "Daily habits" from Doing into Trip to Japan, and DROP it
const doing = page.locator('[data-testid="board"][data-board-name$="Doing"]')
const japan = page.locator('[data-testid="board"][data-board-name*="Trip to Japan"]')
const habits = doing.getByTestId('card').first().getByTestId('card-header')
const hb = await habits.boundingBox()
await page.mouse.move(hb.x + hb.width / 2, hb.y + hb.height - 14, { steps: 22 })
await page.waitForTimeout(350)
await page.mouse.down()
await page.mouse.move(hb.x + hb.width / 2 + 24, hb.y + hb.height + 24, { steps: 10 })
const jp = await japan.boundingBox()
await page.mouse.move(jp.x + jp.width / 2, jp.y + 330, { steps: 34 })
await page.waitForTimeout(500)
await page.mouse.up()
await page.waitForTimeout(1400)

// ---- 2. add a card on TODO and type into it
const todo = page.locator('[data-testid="board"][data-board-name$="TODO"]')
await todo.scrollIntoViewIfNeeded()
const opts = todo.getByTitle('Board options')
const ob = await opts.boundingBox()
await page.mouse.move(ob.x + ob.width / 2, ob.y + ob.height / 2, { steps: 24 })
await page.mouse.click(ob.x + ob.width / 2, ob.y + ob.height / 2)
await page.waitForTimeout(500)
const addItem = page.getByRole('menuitem', { name: 'Add Card' })
const ab = await addItem.boundingBox()
await page.mouse.move(ab.x + ab.width / 2, ab.y + ab.height / 2, { steps: 12 })
await page.mouse.click(ab.x + ab.width / 2, ab.y + ab.height / 2)
await page.waitForTimeout(700)

const newCard = todo.getByTestId('card').first()
const titleInput = newCard.getByPlaceholder('Add Title...')
const tb = await titleInput.boundingBox()
await page.mouse.move(tb.x + 60, tb.y + tb.height / 2, { steps: 14 })
await page.mouse.click(tb.x + 60, tb.y + tb.height / 2)
await page.keyboard.press('Meta+a')
await page.keyboard.type('buy oat milk 🥛', { delay: 70 })
await page.waitForTimeout(400)
await newCard.locator('.tiptap').first().hover()
const inline = newCard.locator('.tiptap[contenteditable="true"]')
const ib = await inline.boundingBox()
await page.mouse.move(ib.x + 40, ib.y + 20, { steps: 10 })
await page.mouse.click(ib.x + 40, ib.y + 20)
await page.keyboard.type('- the fancy barista kind\n', { delay: 55 })
await page.keyboard.type('back to tea otherwise', { delay: 55 })
await page.waitForTimeout(900)
await page.mouse.click(500, 40)
await page.waitForTimeout(800)

// ---- 3. fuzzy search
await page.keyboard.press('Meta+k')
await page.waitForTimeout(700)
await page.keyboard.type('jpan', { delay: 140 })
await page.waitForTimeout(1800)
await page.keyboard.press('Escape')
await page.waitForTimeout(900)

// ---- 4. peek at the drawing card
const sketches = page.locator('[data-testid="board"][data-board-name*="Sketches"]')
await sketches.scrollIntoViewIfNeeded()
await page.waitForTimeout(400)
const flow = sketches.getByTestId('card').first()
const fb = await flow.boundingBox()
await page.mouse.move(fb.x + fb.width / 2, fb.y + 200, { steps: 26 })
await page.waitForTimeout(300)
await page.mouse.click(fb.x + fb.width / 2, fb.y + 200)
await page.waitForTimeout(3200)
const cancel = page.getByRole('button', { name: 'Cancel' })
const cb = await cancel.boundingBox()
if (cb) {
    await page.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2, { steps: 18 })
    await page.mouse.click(cb.x + cb.width / 2, cb.y + cb.height / 2)
}
await page.waitForTimeout(1000)

// ---- outro: drift back over the board
await page.mouse.move(640, 380, { steps: 26 })
await page.waitForTimeout(1400)

await context.close()
const [pageVid] = await Promise.all([page.video().path()])
console.log('VIDEO:', pageVid)
await browser.close()
