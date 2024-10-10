import { FlexRowAlignCenter } from './Flex'

export const Navbar = () => {
    return (
        <FlexRowAlignCenter
            as="nav"
            style={{
                padding: '0.75rem 33.75rem 0.6875rem 1.5rem',
                alignItems: 'flex-start',
                gap: '23.25rem',
                backgroundColor: 'rgba(47, 51, 54, 1)',
                height: '3.5rem',
                width: '100%',
            }}
        >
            <span
                style={{
                    color: '#5F6061',
                    fontFamily: '"Rumiko Sans Demo"',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    height: 'fit-content',
                    margin: 'auto 0',
                }}
            >
                Tap my Tab
            </span>
        </FlexRowAlignCenter>
    )
}
