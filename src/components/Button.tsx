import Box, { BoxProps } from '@mui/material/Box'
import { tc } from '../utils/themeColors.ts'

export const Button = (
    { children, radius, sx, disabled, ...props }:
        & { radius?: string }
        & BoxProps<'button'>,
) => {
    return (
        <Box
            component='button'
            sx={[
                {
                    width: radius,
                    outline: 'none',
                    border: 'none',
                    backgroundColor: 'transparent',
                    height: radius,
                    borderRadius: '9999px',
                    justifyContent: 'center',
                    '&:hover': !disabled ? { boxShadow: `inset 0 0 0 10em ${tc.overlayHover}` } : null,
                    '&:active': !disabled ? { boxShadow: `inset 0 0 0 10em ${tc.overlayActive}` } : null,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    fontSize: '1.3rem',
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            {...props}
        >
            {children}
        </Box>
    )
}
