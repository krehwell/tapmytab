import React, { ElementType, ForwardedRef, forwardRef, MutableRefObject, ReactElement } from 'react'

type FlexProps<T extends React.ElementType> =
    & React.ComponentPropsWithoutRef<T>
    & {
        as?: T
        children?: React.ReactNode
        className?: string
        ref?: MutableRefObject<HTMLElement> | ForwardedRef<HTMLElement>
    }

export type PolymorphicComponent = <T extends ElementType = 'div'>(
    props: FlexProps<T>,
) => ReactElement | null
export type PolymorphicComponentWithDisplayName = PolymorphicComponent & {
    displayName?: string
}

export const Flex: PolymorphicComponentWithDisplayName = forwardRef(
    <T extends ElementType>(props: FlexProps<T>, ref) => {
        const { as, children, style, ...rest } = props
        const Element = as || 'div'
        return (
            <Element ref={ref} style={{ display: 'flex', ...style }} {...rest}>
                {children}
            </Element>
        )
    },
)
Flex.displayName = 'Flex'

export const FlexRowAlignCenter: PolymorphicComponentWithDisplayName = forwardRef(
    <T extends ElementType>(props: FlexProps<T>, ref) => {
        const { style, children, ...rest } = props
        return (
            <Flex
                ref={ref}
                style={{ flexDirection: 'row', alignItems: 'center', ...style }}
                {...rest}
            >
                {children}
            </Flex>
        )
    },
)
FlexRowAlignCenter.displayName = 'FlexRowAlignCenter'

export const FlexColumn: PolymorphicComponentWithDisplayName = forwardRef(
    <T extends ElementType>(props: FlexProps<T>, ref) => {
        const { style, children, ...rest } = props
        return (
            <Flex ref={ref} style={{ flexDirection: 'column', ...style }} {...rest}>
                {children}
            </Flex>
        )
    },
)
FlexColumn.displayName = 'FlexColumn'

export const FlexColumnJustifyCenter: PolymorphicComponentWithDisplayName = forwardRef(
    <T extends ElementType>(props: FlexProps<T>, ref) => {
        const { style, children, ...rest } = props
        return (
            <Flex
                ref={ref}
                style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    ...style,
                }}
                {...rest}
            >
                {children}
            </Flex>
        )
    },
)
FlexColumnJustifyCenter.displayName = 'FlexColumnJustifyCenter'
