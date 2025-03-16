import { FlexRowAlignCenter } from './Flex/index.tsx'

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
        </FlexRowAlignCenter>
    )
}
