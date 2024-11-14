import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import React from 'react'
import { tc } from '../utils/themeColors'

export type WithMenuOption =
    | null
    | ({
          label: string
          node?: React.ReactNode
          hide?: boolean
          disabled?: boolean
          onClick?: (e: React.MouseEvent) => void
      } & { menuItemProps?: MenuItemProps })

export type WithOptionsMenuProps = {
    children: ({
        openMenu,
        closeMenu,
    }: {
        openMenu: (e: React.MouseEvent<HTMLElement>) => void
        closeMenu: () => void
    }) => React.ReactNode
    options: WithMenuOption[]
    menuItemProps?: MenuItemProps
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
export const WithOptionsMenu = ({ children, options, menuItemProps, menuProps }: WithOptionsMenuProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    const openMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl((prev) => (prev ? null : event.currentTarget))
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

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
                    '& .MuiMenu-paper': {
                        backgroundColor: 'var(--color-neutral-white)',
                    },
                    '& .MuiList-padding': { paddingTop: 0, paddingBottom: 0 },
                    ...menuProps?.sx,
                }}
                BackdropProps={{
                    ...menuProps?.BackdropProps,
                    style: {
                        backdropFilter: 'none',
                        WebkitBackdropFilter: 'none',
                        ...menuProps?.BackdropProps?.style,
                    },
                }}
                PaperProps={{
                    sx: { overflow: 'hidden', borderRadius: '0.8rem', ...menuProps?.sx },
                    ...menuProps?.PaperProps,
                }}
            >
                {options.map((option, i) => {
                    if (!option || option.hide) return null

                    const optionStyle = {
                        ...menuItemProps?.sx,
                        ...option.menuItemProps?.sx,
                    }

                    return (
                        <MenuItem
                            {...menuItemProps}
                            {...option?.menuItemProps}
                            disableRipple
                            sx={{
                                '&:hover': {
                                    backgroundColor: tc.tokenGrey,
                                    color: tc.textActiveSecondary,
                                },
                                position: 'relative',
                                textOverflow: 'ellipsis',
                                cursor: !option.disabled ? 'pointer' : 'default',
                                backgroundColor: tc.textActiveSecondary,
                                color: tc.tokenGrey,
                                fontFamily: 'Rumiko Sans',
                                paddingInline: '1.2rem',
                                fontSize: '1rem',
                                margin: 0,
                                zIndex: 9999,
                                gap: '0.8rem',
                                '&>svg': {
                                    color: 'inherit',
                                    fill: 'inherit',
                                },
                                ...optionStyle,
                            }}
                            key={String(option.label) + i}
                            onClick={option?.onClick}
                        >
                            {option?.node || option?.label}
                        </MenuItem>
                    )
                })}
            </Menu>
        </>
    )
}
