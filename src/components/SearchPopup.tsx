import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useKey } from 'react-use'
import { create } from 'zustand'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import Fuse, { FuseResultMatch } from 'fuse.js'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { FlexColumn, FlexRowAlignCenter } from './Flex/index.tsx'
import { tc } from '../utils/themeColors.ts'
import { useBoardStore } from '../stores/useBoardStore.ts'
import { isExcalidrawCard, TBoard, TCard } from '../types.ts'
import { createSortableCheat } from '../utils/dndIdManager.ts'
import { useCardPopupStore } from './CardPopup.tsx'
import { htmlToText } from '../utils/htmlToText.ts'
import { PLACEHOLDER_TITLE } from '../utils/emojify.ts'

export const useSearchStore = create<
    { isOpen: boolean; query: string; setQuery: (q: string) => void; open: () => void; close: () => void }
>((set) => ({
    isOpen: false,
    query: '',
    setQuery: (query) => set({ query }),
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}))

type Hit = {
    boardId: string
    boardName: string
    cardId: string
    card: TCard
    sortableCheat: string
    title: string
    desc: string
    content: string
}

const scrollToCardFound = (hit: Hit) => {
    const cardEl = document.getElementById(hit.cardId)
    if (!cardEl) {
        useCardPopupStore.getState().openPopup({ card: hit.card, sortableCheat: hit.sortableCheat })
        return
    }
    cardEl.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' })
    cardEl.querySelector('input')?.focus({ preventScroll: true })
}

const Highlight = (
    { text, match, windowSize = 120 }: { text: string; match?: FuseResultMatch; windowSize?: number },
) => {
    const indices = match?.indices ?? []
    let str = text
    let offset = 0
    if (indices.length && text.length > windowSize) {
        const start = Math.max(0, indices[0][0] - 30)
        str = (start > 0 ? '…' : '') + text.slice(start, start + windowSize) + '…'
        offset = start - (start > 0 ? 1 : 0)
    }
    const parts: React.ReactNode[] = []
    let last = 0
    for (const [s0, e0] of indices) {
        const s = s0 - offset
        const e = e0 - offset
        if (e < 0 || s > str.length) continue
        if (s > last) parts.push(str.slice(last, s))
        parts.push(
            <mark key={s} style={{ backgroundColor: tc.accent, color: tc.textPrimary, borderRadius: 2 }}>
                {str.slice(Math.max(s, last), e + 1)}
            </mark>,
        )
        last = e + 1
    }
    if (last < str.length) parts.push(str.slice(last))
    return <>{parts.length ? parts : str}</>
}

const SearchResultItem = (
    { hit, matches, isActive, onHover, onSelect }: {
        hit: Hit
        matches: readonly FuseResultMatch[]
        isActive: boolean
        onHover: () => void
        onSelect: () => void
    },
) => {
    const titleMatch = matches.find((m) => m.key === 'title')
    const subMatch = matches.find((m) => m.key === 'content' || m.key === 'desc')
    const subText = subMatch?.value || hit.desc || ''
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isActive) {
            ref.current?.scrollIntoView({ block: 'nearest' })
        }
    }, [isActive])

    return (
        <FlexColumn
            ref={ref}
            data-testid='search-result'
            aria-selected={isActive}
            onMouseEnter={onHover}
            onClick={onSelect}
            style={{
                gap: '0.3rem',
                padding: '1.2rem 1.6rem',
                backgroundColor: isActive ? tc.overlayHover : 'transparent',
            }}
        >
            <span style={{ fontSize: '1.1rem', color: tc.textMuted }}>{hit.boardName}</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, color: tc.textPrimary }}>
                <Highlight text={hit.title || PLACEHOLDER_TITLE} match={titleMatch} />
            </span>
            {subText && (
                <span
                    style={{
                        fontSize: '1.3rem',
                        color: tc.textSecondary,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <Highlight text={subText} match={subMatch} />
                </span>
            )}
        </FlexColumn>
    )
}

const SearchPaper = ({ children, style, ...props }: React.ComponentProps<typeof Box>) => (
    <Box
        component={FlexColumn}
        style={{
            backgroundColor: tc.surfaceBase,
            borderRadius: '1.2rem',
            width: '62.4rem',
            maxWidth: '90vw',
            marginTop: '12vh',
            overflow: 'hidden',
            ...style,
        }}
        {...props}
    >
        {children}
    </Box>
)

export const SearchBar = ({ style }: { style?: React.CSSProperties }) => {
    const open = useSearchStore((s) => s.open)
    return (
        <Box
            component='button'
            onClick={open}
            title='Search boards (⌘K)'
            sx={{
                display: 'flex',
                alignItems: 'center',
                '&:hover': { boxShadow: `inset 0 0 0 10em ${tc.overlayHover}` },
                '&:active': { boxShadow: `inset 0 0 0 10em ${tc.overlayActive}` },
                backgroundColor: tc.surfaceMuted,
                border: 'none',
                borderRadius: '12px',
                color: tc.textSecondary,
                height: '4rem',
                padding: '0 1.4rem',
                gap: '0.8rem',
                width: '32rem',
                fontSize: '1.3rem',
                ...style,
            }}
        >
            <MagnifyingGlass size={18} />
            <span style={{ marginRight: 'auto' }}>Search cards...</span>
            <kbd style={{ fontSize: '1.1rem', opacity: 0.8 }}>⌘K</kbd>
        </Box>
    )
}

export const SearchPopup = () => {
    const isOpen = useSearchStore((s) => s.isOpen)
    const close = useSearchStore((s) => s.close)
    const boards = useBoardStore((s) => s.boards)
    const query = useSearchStore((s) => s.query)
    const setQuery = useSearchStore((s) => s.setQuery)
    const [focusIndex, setFocusIndex] = useState(0)

    useKey(
        (e) => (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k',
        (e) => {
            e.preventDefault()
            useSearchStore.getState().open()
        },
    )

    const fuse = useMemo(() => {
        const records: Hit[] = boards.flatMap((board: TBoard, boardIdx: number) =>
            board.cards.map((card: TCard, cardIdx: number) => ({
                boardId: board.id,
                boardName: board.name || PLACEHOLDER_TITLE,
                cardId: card.id,
                card,
                sortableCheat: createSortableCheat({ boardId: board.id, cardId: card.id, boardIdx, cardIdx }),
                title: card.title || '',
                desc: card.desc || '',
                content: isExcalidrawCard(card) ? '' : htmlToText(card.content as string),
            }))
        )
        return new Fuse(records, {
            keys: [{ name: 'title', weight: 3 }, { name: 'desc', weight: 2 }, { name: 'content', weight: 1 }],
            includeMatches: true,
            ignoreLocation: true,
            threshold: 0.4,
            minMatchCharLength: 0,
        })
    }, [boards])

    const results = useMemo(() => (query.trim() ? fuse.search(query.trim()).slice(0, 30) : []), [query, fuse])

    const select = (i: number) => {
        const hit = results[i]?.item
        if (!hit) return
        close()
        setTimeout(() => scrollToCardFound(hit), 0)
    }

    const handleQueryChange = (q: string) => {
        setQuery(q)
        setFocusIndex(0)
    }

    return (
        <Dialog
            open={isOpen}
            transitionDuration={0}
            disableScrollLock
            slotProps={{
                transition: {
                    onEntered: (node) => node.querySelector('input')?.select(),
                    unmountOnExit: true,
                    mountOnEnter: true,
                },
            }}
            onClose={close}
            sx={{ '& .MuiDialog-container': { alignItems: 'flex-start' } }}
            PaperComponent={SearchPaper}
        >
            <FlexRowAlignCenter style={{ gap: '1rem', padding: '1.6rem', borderBottom: `1px solid ${tc.borderMuted}` }}>
                <MagnifyingGlass size={22} color={tc.textSecondary} />
                <input
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    onKeyDown={(e) => {
                        const next = e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'n') ||
                            (e.key === 'Tab' && !e.shiftKey)
                        const prev = e.key === 'ArrowUp' || (e.ctrlKey && e.key === 'p') ||
                            (e.key === 'Tab' && e.shiftKey)
                        if (next) {
                            e.preventDefault()
                            setFocusIndex((a) => Math.min(a + 1, results.length - 1))
                        } else if (prev) {
                            e.preventDefault()
                            setFocusIndex((a) => Math.max(a - 1, 0))
                        } else if (e.key === 'Enter') {
                            e.preventDefault()
                            select(focusIndex)
                        } else if (e.ctrlKey && e.key === '[') {
                            e.preventDefault()
                            close()
                        }
                    }}
                    placeholder='Search by title, description, or content...'
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: tc.textPrimary,
                        fontSize: '1.8rem',
                    }}
                />
            </FlexRowAlignCenter>

            <FlexColumn style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                {query.trim() && !results.length && (
                    <p style={{ padding: '2rem 1.6rem', color: tc.textMuted, fontSize: '1.4rem' }}>
                        No cards found for "{query}"
                    </p>
                )}
                {results.map((r, i) => (
                    <SearchResultItem
                        key={r.item.cardId}
                        hit={r.item}
                        matches={r.matches ?? []}
                        isActive={i === focusIndex}
                        onHover={() => setFocusIndex(i)}
                        onSelect={() => select(i)}
                    />
                ))}
            </FlexColumn>
        </Dialog>
    )
}
