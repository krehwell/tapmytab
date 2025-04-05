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

    exportBoards: async () => {
        try {
            const boards = await StorageService.loadBoards()
            if (boards) {
                const json = JSON.stringify(boards, null, 2)
                const blob = new Blob([json], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = 'tapmytab_boards.json'
                link.click()
                URL.revokeObjectURL(url)
            }
        } catch (error) {
            console.error('Error exporting boards:', error)
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
