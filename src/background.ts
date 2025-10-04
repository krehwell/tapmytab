import { extensionAPI, isFirefox } from './utils/extensionAPI.ts'
import { FirstTimeService } from './utils/firstTimeChecker.ts'

extensionAPI.runtime.onInstalled.addListener(async (details) => {
    console.log('Extension installed')

    if (details.reason === 'install') {
        await FirstTimeService.flagIsFirstTime()
        console.log('First time installation detected')
    }
})

extensionAPI.action.onClicked.addListener((tab) => {
    const newTabUrl = isFirefox ? 'about:newtab' : 'chrome://newtab'
    extensionAPI.tabs.create({ url: newTabUrl })
})
