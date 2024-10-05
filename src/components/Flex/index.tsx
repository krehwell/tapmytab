import { cn } from '../../utils/cn'
import React, {
    ElementType,
    ForwardedRef,
    forwardRef,
    MutableRefObject,
    ReactElement,
} from 'react'

type FlexProps<T extends React.ElementType> =
    React.ComponentPropsWithoutRef<T> & {
        as?: T
        children?: React.ReactNode
        className?: string
        ref?: MutableRefObject<HTMLElement> | ForwardedRef<HTMLElement>
    }

export type PolymorphicComponent = <T extends ElementType = 'div'>(
    props: FlexProps<T>
) => ReactElement | null
export type PolymorphicComponentWithDisplayName = PolymorphicComponent & {
    displayName?: string
}

export const Flex: PolymorphicComponentWithDisplayName = forwardRef(
    <T extends ElementType>(props: FlexProps<T>, ref) => {
        const { as, children, className, ...rest } = props
        const Element = as || 'div'
        return (
            <Element ref={ref} className={cn('flex', className)} {...rest}>
                {children}
            </Element>
        )
    }
)
Flex.displayName = 'Flex'

export const FlexRowAlignCenter: PolymorphicComponentWithDisplayName =
    forwardRef(<T extends ElementType>(props: FlexProps<T>, ref) => {
        const { className, children, ...rest } = props
        return (
            <Flex
                ref={ref}
                className={cn('flex-row', 'items-center', className)}
                {...rest}
            >
                {children}
            </Flex>
        )
    })
FlexRowAlignCenter.displayName = 'FlexRowAlignCenter'

export const FlexColumn: PolymorphicComponentWithDisplayName = forwardRef(
    <T extends ElementType>(props: FlexProps<T>, ref) => {
        const { className, children, ...rest } = props
        return (
            <Flex ref={ref} className={cn('flex-col', className)} {...rest}>
                {children}
            </Flex>
        )
    }
)
FlexColumn.displayName = 'FlexColumn'

export const FlexColumnJustifyCenter: PolymorphicComponentWithDisplayName =
    forwardRef(<T extends ElementType>(props: FlexProps<T>, ref) => {
        const { className, children, ...rest } = props
        return (
            <Flex
                ref={ref}
                className={cn('flex-col', 'justify-center', className)}
                {...rest}
            >
                {children}
            </Flex>
        )
    })
FlexColumnJustifyCenter.displayName = 'FlexColumnJustifyCenter'

export const FlexColumnAlignJustifyCenter: PolymorphicComponentWithDisplayName =
    forwardRef(<T extends ElementType>(props: FlexProps<T>, ref) => {
        const { className, children, ...rest } = props
        return (
            <Flex
                ref={ref}
                className={cn(
                    'flex-col',
                    'items-center',
                    'justify-center',
                    className
                )}
                {...rest}
            >
                {children}
            </Flex>
        )
    })
FlexColumnAlignJustifyCenter.displayName = 'FlexColumnAlignJustifyCenter'
