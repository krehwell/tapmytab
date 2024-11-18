console.log('Background script loaded')

chrome.runtime.onInstalled.addListener(async (details) => {
    console.log('Extension installed')

    if (details.reason === 'install') {
        // First time installation
        await chrome.storage.local.set({
            firstInstall: true,
            installDate: new Date().toISOString(),
        })
        console.log('First time installation detected')
    }
})

chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({ url: 'chrome://newtab' })
})
