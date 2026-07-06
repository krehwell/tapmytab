import { extensionAPI } from './utils/extensionAPI.ts'
import { FirstTimeService } from './utils/firstTimeChecker.ts'

extensionAPI.runtime.onUpdateAvailable.addListener(() => {
    extensionAPI.runtime.reload()
})

extensionAPI.runtime.onInstalled.addListener(async (details) => {
    console.log('Extension installed')

    if (details.reason === 'install') {
        await FirstTimeService.flagIsFirstTime()
        console.log('First time installation detected')
    }
})
