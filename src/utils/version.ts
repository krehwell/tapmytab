import { extensionAPI } from './extensionAPI.ts'
import manifest from '../../manifest.json'
import { genUid } from 'light-uid'
import { CARD1 } from './templates.ts'
import { TBoard } from '../types.ts'

export const VERSION = manifest.version

const getSeenVersion = async (): Promise<string | null> => {
    const result = await extensionAPI.storage.local.get('seenVersion')
    return result.seenVersion || null
}

/** check if the last-seen version is older than this build */
export const isVersionOutdated = async (): Promise<boolean> => {
    const seen = await getSeenVersion()
    return (seen ?? '0').localeCompare(VERSION, undefined, { numeric: true }) < 0
}

export const markVersionSeen = async () => {
    await extensionAPI.storage.local.set({ seenVersion: VERSION })
}

/** fresh-id copy of the welcome card */
const introCard = () => ({ ...CARD1, id: genUid(8) })

/** prepend the intro card to the first board */
export const withIntroCard = (boards: TBoard[]): TBoard[] =>
    boards.length ? [{ ...boards[0], cards: [introCard(), ...boards[0].cards] }, ...boards.slice(1)] : boards
