import Box, { BoxProps } from '@mui/material/Box'

export const Button = ({ children, radius, sx, disabled, ...props }: { radius?: string } & BoxProps<'button'>) => {
    return (
        <Box
            component="button"
            sx={[
                {
                    width: radius,
                    height: radius,
                    borderRadius: '9999px',
                    justifyContent: 'center',
                    '&:hover': !disabled ? { boxShadow: 'inset 0 0 0 10em rgba(0, 0, 0, 0.4)' } : null,
                    '&:active': !disabled ? { boxShadow: 'inset 0 0 0 10em rgba(0, 0, 0, 0.55)' } : null,
                    display: 'flex',
                    alignItems: 'center',
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
