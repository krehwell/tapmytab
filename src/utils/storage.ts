import { TBoard } from '../types.ts'
import { extensionAPI } from './extensionAPI.ts'

export const StorageService = {
    saveBoards: async (boards: TBoard[]) => {
        try {
            await extensionAPI.storage.local.set({ boards })
            console.log('Boards saved successfully')

            const bytes = await extensionAPI.storage.local.getBytesInUse?.()
            console.log(`Storage usage: ${bytes} bytes`)
        } catch (error) {
            console.error('Error saving boards:', error)
        }
    },

    loadBoards: async (): Promise<TBoard[] | null> => {
        try {
            const result = await extensionAPI.storage.local.get('boards')
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

    importBoards: (): Promise<TBoard[] | null> => {
        return new Promise((resolve) => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'application/json'
            input.onchange = async () => {
                try {
                    const file = input.files?.[0]
                    if (!file) return resolve(null)
                    const boards = JSON.parse(await file.text())
                    if (!Array.isArray(boards)) throw new Error('Expected an array of boards')
                    resolve(boards)
                } catch (error) {
                    console.error('Error importing boards:', error)
                    resolve(null)
                }
            }
            input.click()
        })
    },

    clearBoards: async () => {
        try {
            await extensionAPI.storage.local.remove('boards')
            console.log('Boards cleared successfully')
        } catch (error) {
            console.error('Error clearing boards:', error)
        }
    },
}

export const isInsideExtension = () => {
    return extensionAPI?.runtime?.id
}
