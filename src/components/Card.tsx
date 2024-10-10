import { FlexColumn } from './Flex'

export const Card = ({ id, content }: { className?: string; id: string; content: string }) => {
    return (
        <FlexColumn
            className="relative"
            style={{
                padding: '0.5rem',
                gap: '0.625rem',
                borderRadius: '0.75rem',
                background: '#343A40',
                width: '100%',
            }}
        >
            <h2 style={{ color: '#F8F9FA', fontFamily: '"Rumiko Clear Demo"', fontSize: '1.25rem', fontWeight: '700' }}>
                title
            </h2>
            <p
                style={{
                    color: 'rgba(248, 249, 250, 0.80)',
                    fontFamily: '"Rumiko Clear Demo"',
                    fontSize: '0.8125rem',
                }}
            >
                desc
            </p>
            <span
                style={{
                    width: '2.6875rem',
                    height: '0.625rem',
                    backgroundColor: '#FFAEAD',
                    borderRadius: '0.25rem',
                }}
            />
            <FlexColumn
                dangerouslySetInnerHTML={{ __html: content }}
                style={{
                    padding: '1rem 0.25rem',
                    color: '#F8F9FA',
                    borderRadius: '0.5rem',
                    background: '#2C3034',
                    /* SF Pro Display/13px: Regular */
                    fontFamily: '"Rumiko Clear Demo"',
                    fontSize: '0.8125rem',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: 'normal',
                    textWrap: 'wrap',
                    wordBreak: 'break-word',
                }}
            />
        </FlexColumn>
    )
}
