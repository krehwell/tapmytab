const src = chrome.runtime.getURL('pages/iframe.html')

const iframe = new DOMParser().parseFromString(
    `<iframe class="crx" src="${src}"></iframe>`
).body.firstElementChild

document.body.append(iframe)
