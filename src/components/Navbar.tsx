import React from 'react'
import { FlexRowAlignCenter } from './Flex/index.tsx'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import { CaretDown, GoogleLogo, TwitterLogo, YoutubeLogo } from '@phosphor-icons/react'
import { WithOptionsMenu } from './WithOptionsMenu.tsx'
import { Button } from './Button.tsx'
import { useLocalStorage } from 'react-use'
import { StorageService } from '../utils/storage.ts'
import { useBoardStore } from '../stores/useBoardStore.ts'
import { BOARD1, BOARD2, BOARD3, BOARD4 } from '../utils/templates.ts'
import { tc } from '../utils/themeColors.ts'
import { Logo } from './Logo.tsx'

enum SearchOption {
    Youtube,
    Google,
    Twitter,
}

const SocMedInput = ({ style }: { style?: React.CSSProperties }) => {
    const [searchWith_, setSearchWith] = useLocalStorage(
        'default-search-with',
        SearchOption.Youtube,
    )
    const searchWith = searchWith_ || SearchOption.Youtube

    const SEARCH_OPTIONS = [
        {
            label: 'Youtube',
            node: <YoutubeLogo size={18} />,
            onClick: () => setSearchWith(SearchOption.Youtube),
        },
        {
            label: 'Google',
            node: <GoogleLogo size={18} />,
            onClick: () => setSearchWith(SearchOption.Google),
        },
        {
            label: 'Twitter',
            node: <TwitterLogo size={18} />,
            onClick: () => setSearchWith(SearchOption.Twitter),
        },
    ]

    return (
        <FlexRowAlignCenter
            style={{
                backgroundColor: tc.surfaceMuted,
                borderRadius: '12px',
                color: tc.textPrimary,
                height: '4rem',
                padding: '0 0.8rem',
                gap: '1.2rem',
                ...style,
            }}
        >
            <WithOptionsMenu options={SEARCH_OPTIONS}>
                {({ openMenu }) => (
                    <Button
                        onClick={openMenu}
                        style={{ height: '3rem', padding: '0 1rem', gap: '0.5rem' }}
                    >
                        {SEARCH_OPTIONS[searchWith].node}
                        <CaretDown size={12} />
                    </Button>
                )}
            </WithOptionsMenu>
            <FlexRowAlignCenter
                as={TextareaAutosize}
                maxRows={1}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
                        const query = e.currentTarget.value

                        if (searchWith === SearchOption.Youtube) {
                            globalThis.open(
                                `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
                                '_blank',
                            )
                        } else if (searchWith === SearchOption.Google) {
                            globalThis.open(
                                `https://www.google.com/search?q=${encodeURIComponent(query)}`,
                                '_blank',
                            )
                        } else if (searchWith === SearchOption.Twitter) {
                            globalThis.open(
                                `https://twitter.com/search?q=${encodeURIComponent(query)}`,
                                '_blank',
                            )
                        }
                    }
                }}
                placeholder={`Search from ${SEARCH_OPTIONS[searchWith].label}`}
                style={{
                    backgroundColor: 'transparent',
                    resize: 'none',
                    fontSize: '1.3rem',
                    width: '28.8rem',
                    paddingBlock: '0.5rem',
                    verticalAlign: 'center',
                }}
            />
        </FlexRowAlignCenter>
    )
}

const MainTitle = () => {
    return (
        <WithOptionsMenu
            options={[
                {
                    label: 'Export Boards',
                    onClick: () => StorageService.exportBoards(),
                },
                {
                    label: 'Import Boards',
                    onClick: async () => {
                        const ok = globalThis.confirm(
                            'Importing replaces all your current boards. Make a backup with "Export Boards" first.\n\nContinue?',
                        )
                        if (!ok) return
                        const boards = await StorageService.importBoards()
                        if (boards) useBoardStore.setState({ boards })
                    },
                },
                {
                    label: 'Reset Board',
                    onClick: async () => {
                        const ok = globalThis.confirm(
                            'Resetting replaces all your current boards with the default template. We\'ll export a backup of your current boards first.\n\nContinue?',
                        )
                        if (!ok) return
                        await StorageService.exportBoards()
                        useBoardStore.setState({ boards: [BOARD1, BOARD2, BOARD3, BOARD4] })
                    },
                },
                {
                    label: 'Submit Issue/Suggestion',
                    onClick: () =>
                        globalThis.open(
                            'https://github.com/krehwell/tapmytab/issues/new',
                            '_blank',
                        ),
                },
                {
                    label: 'Star Us on Github 😉',
                    onClick: () => globalThis.open('https://github.com/krehwell/tapmytab/', '_blank'),
                },
            ]}
        >
            {({ openMenu }) => (
                <h1
                    onClick={openMenu}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', margin: 0 }}
                >
                    <Logo height={27} />
                </h1>
            )}
        </WithOptionsMenu>
    )
}

export const Navbar = () => {
    return (
        <FlexRowAlignCenter
            as='nav'
            style={{
                height: 'var(--navbar-height)',
                padding: '0px 3.2rem',
                justifyContent: 'space-between',
                backgroundColor: tc.surfaceInput,
            }}
        >
            <MainTitle />
            <SocMedInput style={{ marginLeft: 'auto' }} />
        </FlexRowAlignCenter>
    )
}
