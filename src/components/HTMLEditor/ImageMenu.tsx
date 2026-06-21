import { memo } from 'react'
import { Editor as TiptapEditor, useEditorState } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import { tc } from '../../utils/themeColors.ts'
import { Button } from '../Button.tsx'
import { FlexRowAlignCenter } from '../Flex/index.tsx'
import { IMAGE_SIZES } from './extensions/image.ts'

export const ImageMenu = memo(({ editor }: { editor: TiptapEditor }) => {
    const activeWidth = useEditorState({
        editor,
        selector: ({ editor }) => editor.getAttributes('image').width as string | undefined,
    })

    return (
        <BubbleMenu
            editor={editor}
            pluginKey='imageMenu'
            shouldShow={({ editor }: { editor: TiptapEditor }) => editor.isActive('image')}
            updateDelay={0}
            options={{ offset: 8 }}
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
                {IMAGE_SIZES.map((size) => (
                    <Button
                        key={size}
                        title={`Resize to ${size}`}
                        onClick={() => editor.chain().focus().updateAttributes('image', { width: size }).run()}
                        sx={{
                            padding: '0.4rem 0.7rem',
                            borderRadius: '0.4rem',
                            fontSize: '1.2rem',
                            color: tc.textSecondary,
                            backgroundColor: activeWidth === size ? tc.surfaceOverlay : 'transparent',
                        }}
                    >
                        {parseInt(size)}
                    </Button>
                ))}
            </FlexRowAlignCenter>
        </BubbleMenu>
    )
})
