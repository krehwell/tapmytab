import { cn } from '../../utils/cn'
import { Flex, FlexColumn, FlexColumnAlignJustifyCenter } from '../Flex'
import { TemplateContent } from '../TemplateContent'

const Board = ({
    title,
    className,
    children,
}: {
    title: string
    className?: string
    children: React.ReactNode
}) => {
    return (
        <FlexColumn
            className={cn('card', className)}
            style={{
                width: '20rem',
                height: '100vh',
            }}
        >
            <h1 className="notice">{title}</h1>
            {children}
        </FlexColumn>
    )
}

const Card = ({
    className,
    children,
}: {
    className?: string
    children: React.ReactNode
}) => {
    return (
        <FlexColumn as="textarea" className={cn('resize-y', className)}>
            {children}
        </FlexColumn>
    )
}

const AddCard = () => {
    return (
        <FlexColumnAlignJustifyCenter
            as="button"
            className={cn(
                'border-2 border-solid border-red-50-600 rounded h-8'
            )}
        >
            +
        </FlexColumnAlignJustifyCenter>
    )
}

export const App = ({ isExtension }: { isExtension: boolean }) => {
    return (
        <Flex className="gap-3">
            <Board title="Column 1">
                <AddCard />
                <Card>Card 1</Card>
                <Card>Card 2</Card>
                <Card>Card 3</Card>
            </Board>
            <Board title="Column 2">
                <AddCard />
            </Board>
            <Board title="Column 3">
                <Card>Card 1</Card>
            </Board>
            <Board title="Column 4">
                <Card>Card 1</Card>
                <Card>Card 2</Card>
                <Card>Card 3</Card>
            </Board>
        </Flex>
    )
}
