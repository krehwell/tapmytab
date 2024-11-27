import Menu, { MenuProps } from '@mui/material/Menu'
import React, { useCallback } from 'react'
import { tc } from '../utils/themeColors.ts'
import Box, { BoxProps } from '@mui/material/Box'

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
                {...menuProps}
                sx={{
                    // opinionated styles since we don't want shadow by default
                    '& .MuiPaper-root': { boxShadow: 'none' },
                    '& .MuiList-padding': { paddingTop: 0, paddingBottom: 0 },
                    borderRadius: '888px',
                    ...menuProps?.sx,
                }}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '8px',
                            backgroundColor: 'transparent',
                            ...menuProps?.slotProps?.paper?.sx,
                        },
                    },
                }}
            >
                {options.map((option, i) => {
                    if (!option || option.hide) return null

                    return (
                        <MenuItem
                            sx={{
                                height: '3.3rem',
                                alignContent: 'center',
                                position: 'relative',
                                textOverflow: 'ellipsis',
                                cursor: !option.disabled ? 'pointer' : 'default',
                                backgroundColor: tc.textActiveSecondary,
                                color: tc.tokenGrey,
                                '& svg': {
                                    fill: tc.tokenGrey,
                                },
                                '&:hover': {
                                    backgroundColor: tc.tokenGrey,
                                    color: tc.textActiveSecondary,
                                    '& svg': {
                                        fill: tc.textActiveSecondary,
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

const MenuItem = ({ sx, children, ...props }: BoxProps<'li'>) => {
    return <Box component='li' sx={sx} {...props}>{children}</Box>
}
