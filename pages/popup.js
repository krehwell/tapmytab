// open the repo as a new tab in the current window (not a new window), then close the popup.
// target="_blank" from a popup tends to spawn a whole new window, so we use tabs.create.
const REPO = 'https://github.com/krehwell/tapmytab'
const api = globalThis.browser ?? globalThis.chrome

document.querySelector('a.gh')?.addEventListener('click', (e) => {
    e.preventDefault()
    api?.tabs?.create({ url: REPO }) // defaults to the active window, focused
    globalThis.close()
})
