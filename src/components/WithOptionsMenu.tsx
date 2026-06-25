import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React, { useCallback } from 'react'
import { tc } from '../utils/themeColors.ts'

export type WithMenuOption =
    | null
    | {
        label: string
        node?: React.ReactNode
        hide?: boolean
        disabled?: boolean
        onClick?: (e: React.MouseEvent) => void
    }

export type WithOptionsMenuProps = {
    children: ({
        openMenu,
        closeMenu,
    }: {
        openMenu: (e: React.MouseEvent<HTMLElement>) => void
        closeMenu: () => void
    }) => React.ReactNode
    options: WithMenuOption[]
    menuProps?: Omit<MenuProps, 'open'>
}

/**
 * MUI `Menu` wrapper so that parent don't have to control the `ref`
 *
 * Customize the menu through `menuProps`. It supports all menu props listed here https://mui.com/material-ui/react-menu/
 * - The body of the menu is MUI Paper, so if you want to customize the body, customize it through `menuProps.PaperProps`
 * - Create gap between menu and button by passing margin to Paper's sx
 *
 * Customize the menu's item globally through `menuItemProps`.
 *
 * To customize custom style per-item, you can pass `menuItemProps` through option (`options.menuItemProps`)
 */
export const WithOptionsMenu = (
    { children, options, menuProps }: WithOptionsMenuProps,
) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    const openMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl((prev) => (prev ? null : event.currentTarget))
    }, [])

    const handleClose = useCallback(() => {
        setAnchorEl(null)
    }, [])

    return (
        <>
            {children({ openMenu, closeMenu: handleClose })}
            <Menu
                disableAutoFocusItem
                disableScrollLock
                open={!!anchorEl}
                onClose={handleClose}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                transitionDuration={0}
                marginThreshold={0}
                {...menuProps}
                sx={{
                    '& .MuiPaper-root': { boxShadow: 'none' },
                    '& .MuiList-padding': { paddingTop: 0, paddingBottom: 0 },
                    listStyleType: 'none',
                    listStyle: 'none',
                    marginTop: anchorEl?.tagName === 'BUTTON' ? 0 : '0.8rem',
                    ...menuProps?.sx,
                }}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '8px',
                            overflow: 'hidden',
                            // darker than the board/editor so the menu reads as a distinct surface
                            backgroundColor: tc.surfaceOverlay,
                            border: `1px solid ${tc.surfaceStrong}`,
                        },
                    },
                }}
            >
                {options.map((option, i) => {
                    if (!option || option.hide) return null

                    return (
                        <MenuItem
                            disableRipple
                            sx={{
                                position: 'relative',
                                minHeight: '3.3rem',
                                textOverflow: 'ellipsis',
                                cursor: !option.disabled ? 'pointer' : 'default',
                                backgroundColor: 'transparent',
                                color: tc.textSecondary,
                                '& svg': {
                                    fill: tc.textSecondary,
                                },
                                '&:hover': {
                                    backgroundColor: tc.surfaceStrong,
                                    color: tc.textSecondary,
                                    '& svg': {
                                        fill: tc.textSecondary,
                                    },
                                },
                                fontFamily: 'Rumiko Sans',
                                paddingInline: '1.2rem',
                                fontSize: '1rem',
                                margin: 0,
                                zIndex: 9999,
                                gap: '0.8rem',
                            }}
                            key={String(option.label) + i}
                            onClick={(e) => {
                                option?.onClick?.(e)
                                handleClose()
                            }}
                        >
                            {option?.node || option?.label}
                        </MenuItem>
                    )
                })}
            </Menu>
        </>
    )
}
