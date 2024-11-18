// utility function to check if the extension is opened for first time
export const FirstTimeCheck = {
    isFirstTime: async (): Promise<boolean> => {
        const result = await chrome.storage.local.get('firstInstall')
        if (result.firstInstall) {
            // reset the flag after checking
            await chrome.storage.local.set({ firstInstall: false })
            return true
        }
        return false
    },

    getInstallDate: async (): Promise<string | null> => {
        const result = await chrome.storage.local.get('installDate')
        return result.installDate || null
    },

    reset: async () => {
        await chrome.storage.local.set({
            firstInstall: true,
            installDate: new Date().toISOString(),
        })
    },
}
