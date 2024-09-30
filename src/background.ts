console.log('Background script loaded')

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed')
})

chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({ url: 'chrome://newtab' })
})
