export const Button = ({
    children,
    radius,
    style,
    ...props
}: { radius?: string } & React.HTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
            style={{
                width: radius,
                height: radius,
                borderRadius: '9999px',
                ...style,
            }}
            {...props}
        >
            {children}
        </button>
    )
}
