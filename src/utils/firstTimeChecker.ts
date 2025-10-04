import { extensionAPI } from './extensionAPI.ts'

// utility function to check if the extension is opened for first time
export const FirstTimeService = {
    flagIsFirstTime: async () => {
        await extensionAPI.storage.local.set({
            firstInstall: true,
            installDate: new Date().toISOString(),
        })
    },

    isFirstTime: async (): Promise<boolean> => {
        const result = await extensionAPI.storage.local.get('firstInstall')
        if (result.firstInstall) {
            await extensionAPI.storage.local.set({ firstInstall: false })
            return true
        }
        return false
    },

    getInstallDate: async (): Promise<string | null> => {
        const result = await extensionAPI.storage.local.get('installDate')
        return result.installDate || null
    },

    reset: async () => {
        await extensionAPI.storage.local.set({
            firstInstall: true,
            installDate: new Date().toISOString(),
        })
    },
}
