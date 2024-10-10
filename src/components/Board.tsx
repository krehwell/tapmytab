import { FlexColumn, FlexRowAlignCenter } from './Flex'

export const Board = ({ title, children }: { title?: string; className?: string; children: React.ReactNode }) => {
    return (
        <FlexColumn
            style={{
                width: '18.75rem',
                padding: '0.75rem',
                alignItems: 'center',
                gap: '1.5rem',
                borderRight: '6px solid #313436',
                height: '100%',
            }}
        >
            <FlexRowAlignCenter style={{ width: '100%', color: '#F8F9FA' }}>
                <h1 style={{ fontFamily: '"Rumiko Clear Demo"', fontSize: '1.9375rem', fontWeight: '700' }}>{title}</h1>
                <span title="Add Card" style={{ marginLeft: 'auto', fontWeight: 'bold', fontSize: '2rem' }}>
                    +
                </span>
            </FlexRowAlignCenter>
            {children}
        </FlexColumn>
    )
}
