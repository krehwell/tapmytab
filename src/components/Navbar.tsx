import { FlexRowAlignCenter } from './Flex/index.tsx'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import { CaretDown, GoogleLogo, TwitterLogo, YoutubeLogo } from '@phosphor-icons/react'
import { WithOptionsMenu } from './WithOptionsMenu.tsx'
import { Button } from './Button.tsx'
import React, { useState } from 'react'

enum SearchOption {
    Youtube,
    Google,
    Twitter,
}

const SocMedInput = ({ style }: { style?: React.CSSProperties }) => {
    const [searchWith, setSearchWith] = useState<SearchOption>(
        SearchOption.Youtube,
    )
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
                backgroundColor: '#2B2F32',
                borderRadius: '12px',
                color: '#ffffff',
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
                        if (searchWith === SearchOption.Youtube) {
                            globalThis.open(
                                `https://www.youtube.com/results?search_query=${e.currentTarget.value}`,
                            )
                        } else if (searchWith === SearchOption.Google) {
                            globalThis.open(
                                `https://www.google.com/search?q=${e.currentTarget.value}`,
                            )
                        } else if (searchWith === SearchOption.Twitter) {
                            globalThis.open(
                                `https://twitter.com/search?q=${e.currentTarget.value}`,
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

export const Navbar = () => {
    return (
        <FlexRowAlignCenter
            as='nav'
            style={{
                height: 'var(--navbar-height)',
                padding: '0px 3.2rem',
                justifyContent: 'space-between',
                backgroundColor: '#2F3336',
            }}
        >
            <span
                style={{
                    color: '#5F6061',
                    fontFamily: 'Rumiko Sans',
                    fontSize: '2.4rem',
                    fontWeight: '600',
                }}
            >
                tapmytab
            </span>
            <SocMedInput style={{ marginLeft: 'auto' }} />
        </FlexRowAlignCenter>
    )
}
