import { TBoard } from '../types'

export const StorageService = {
    saveBoards: async (boards: TBoard[]) => {
        try {
            await chrome.storage.sync.set({ boards })
            console.log('Boards saved successfully')
        } catch (error) {
            console.error('Error saving boards:', error)
        }
    },

    loadBoards: async (): Promise<TBoard[] | null> => {
        try {
            const result = await chrome.storage.sync.get('boards')
            return result.boards || null
        } catch (error) {
            console.error('Error loading boards:', error)
            return null
        }
    },

    clearBoards: async () => {
        try {
            await chrome.storage.sync.remove('boards')
            console.log('Boards cleared successfully')
        } catch (error) {
            console.error('Error clearing boards:', error)
        }
    },
}

export const isInsideChromeExtension = () => {
    return !!chrome?.runtime?.id
}
