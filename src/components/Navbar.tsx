import { FlexRowAlignCenter } from './Flex'

const SocMedInput = () => {
    return (
        <FlexRowAlignCenter
            style={{ padding: '0px 4px', backgroundColor: '#2B2F32', borderRadius: '12px', color: '#ffffff' }}
        >
            <button style={{ width: '68px', height: '40px' }}>yt</button>
            <input
                style={{
                    fontSize: '13px',
                    width: '200px',
                    height: '40px',
                    backgroundColor: 'transparent',
                    color: '#ffffff',
                }}
                defaultValue="Results from youtube.com"
            />
        </FlexRowAlignCenter>
    )
}

export const Navbar = () => {
    return (
        <FlexRowAlignCenter
            as="nav"
            style={{
                height: 'var(--navbar-height)',
                padding: '0px 32px',
                justifyContent: 'space-between',
                backgroundColor: '#2F3336',
            }}
        >
            <span style={{ color: '#5F6061', fontFamily: 'Rumiko Sans', fontSize: '24px', fontWeight: '600' }}>
                Tap my Tab
            </span>
            {/* <SocMedInput /> */}
        </FlexRowAlignCenter>
    )
}
