import { TBoard } from '../types.ts'

export const StorageService = {
    saveBoards: async (boards: TBoard[]) => {
        try {
            await chrome.storage.local.set({ boards })
            console.log('Boards saved successfully')

            const bytes = await chrome.storage.local.getBytesInUse()
            console.log(`Storage usage: ${bytes} bytes`)
        } catch (error) {
            console.error('Error saving boards:', error)
        }
    },

    loadBoards: async (): Promise<TBoard[] | null> => {
        try {
            const result = await chrome.storage.local.get('boards')
            return result.boards || null
        } catch (error) {
            console.error('Error loading boards:', error)
            return null
        }
    },

    clearBoards: async () => {
        try {
            await chrome.storage.local.remove('boards')
            console.log('Boards cleared successfully')
        } catch (error) {
            console.error('Error clearing boards:', error)
        }
    },
}

export const isInsideChromeExtension = () => {
    return !!chrome?.runtime?.id
}
