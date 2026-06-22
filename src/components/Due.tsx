import { useRef, useState } from 'react'
import { FlexRowAlignCenter } from './Flex/index.tsx'
import dayjs from 'dayjs'
import { CalendarDots, X } from '@phosphor-icons/react'
import { Button } from './Button.tsx'
import { tc } from '../utils/themeColors.ts'

export const Due = ({
    initialDueDate = null,
    onChange,
}: {
    initialDueDate: null | string
    onChange?: (props: { dueDate: string | null }) => void
}) => {
    const isEditable = typeof onChange === 'function'
    const [dueDate, setDueDate] = useState(initialDueDate)

    const today = dayjs()
    const todayStr = today.format('YYYY-MM-DD')
    const tomorrow = dayjs().add(1, 'day')

    const aboutToPassDue = // either today or one day before due
        dayjs(initialDueDate).isBefore(today, 'day') ||
        dayjs(initialDueDate).isSame(today, 'day') ||
        dayjs(initialDueDate).isSame(tomorrow, 'day')

    const ref = useRef<HTMLInputElement>(null)
    const color = dueDate ? tc.textPrimary : tc.textDisabledSecondary

    return (
        <FlexRowAlignCenter
            onClick={() => {
                ref.current?.showPicker()
            }}
            style={{
                cursor: !isEditable ? 'default' : 'pointer',
                marginLeft: 'auto',
                backgroundColor: aboutToPassDue ? tc.danger : tc.surfaceOverlay,
                padding: '0.6rem 0.8rem',
                borderRadius: '0.8rem',
                gap: '0.6rem',
                position: 'relative',
            }}
        >
            {isEditable && (
                <input
                    ref={ref}
                    tabIndex={-1}
                    style={{ position: 'absolute', width: 1, left: '0', zIndex: -1 }}
                    type='date'
                    id='start'
                    name='due'
                    value={dueDate ?? undefined}
                    min={todayStr}
                    onChange={(e) => {
                        const newDueDate = e.target.value
                        onChange({ dueDate: newDueDate })
                        setDueDate(newDueDate)
                    }}
                />
            )}
            {dueDate && !isEditable ? null : <CalendarDots size={22} color={color} />}

            <span style={{ fontSize: '1.2rem', color }}>
                {dueDate ? dayjs(dueDate).format('ddd, DD MMM YYYY') : 'Due date'}
            </span>

            {dueDate && isEditable && (
                <Button
                    radius='2rem'
                    title='Clear due date'
                    onClick={(e) => {
                        e.stopPropagation()
                        onChange?.({ dueDate: null })
                        setDueDate(null)
                    }}
                >
                    <X style={{ flexShrink: 0 }} />
                </Button>
            )}
        </FlexRowAlignCenter>
    )
}
