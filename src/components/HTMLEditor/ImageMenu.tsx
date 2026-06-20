import { BubbleMenu, Editor as TiptapEditor } from '@tiptap/react'
import { tc } from '../../utils/themeColors.ts'
import { Button } from '../Button.tsx'
import { FlexRowAlignCenter } from '../Flex/index.tsx'
import { IMAGE_SIZES } from './extensions/image.ts'

export const ImageMenu = ({ editor }: { editor: TiptapEditor }) => {
    return (
        <BubbleMenu
            editor={editor}
            pluginKey='imageMenu'
            shouldShow={({ editor }) => editor.isActive('image')}
            updateDelay={0}
            tippyOptions={{ offset: [0, 8] }}
        >
            <FlexRowAlignCenter
                style={{
                    gap: '0.2rem',
                    backgroundColor: tc.surfaceStrong,
                    fontSize: '1.3rem',
                    padding: '0.5rem 0.8rem',
                    borderRadius: '0.4rem',
                    boxShadow: tc.shadowPopover,
                    width: 'fit-content',
                }}
            >
                {IMAGE_SIZES.map((size) => {
                    const active = editor.getAttributes('image').width === size
                    return (
                        <Button
                            key={size}
                            title={`Resize to ${size}`}
                            onClick={() => editor.chain().focus().updateAttributes('image', { width: size }).run()}
                            sx={{
                                padding: '0.4rem 0.7rem',
                                borderRadius: '0.4rem',
                                fontSize: '1.2rem',
                                color: tc.textSecondary,
                                backgroundColor: active ? tc.surfaceOverlay : 'transparent',
                            }}
                        >
                            {parseInt(size)}
                        </Button>
                    )
                })}
            </FlexRowAlignCenter>
        </BubbleMenu>
    )
}
