import Image from '@tiptap/extension-image'
import { Plugin } from '@tiptap/pm/state'

// 5 resize ticks (% of the editor width). [1] (40%) is the insert default.
export const IMAGE_SIZES = ['25%', '40%', '60%', '80%', '100%']

// Image with a resizable `width` attribute + paste-to-insert (as base64 data URL)
export const ImageExtension = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: IMAGE_SIZES[1], // 40%
                parseHTML: (el) => el.style.width || IMAGE_SIZES[1],
                renderHTML: (attrs) => (attrs.width ? { style: `width: ${attrs.width}` } : {}),
            },
        }
    },
    addProseMirrorPlugins() {
        const editor = this.editor
        return [
            new Plugin({
                props: {
                    handlePaste: (_view, event) => {
                        const file = Array.from(event.clipboardData?.files || [])
                            .find((f) => f.type.startsWith('image/'))
                        if (!file) return false
                        event.preventDefault()
                        const reader = new FileReader()
                        reader.onload = () => editor.chain().focus().setImage({ src: String(reader.result) }).run()
                        reader.readAsDataURL(file)
                        return true
                    },
                },
            }),
        ]
    },
}).configure({ allowBase64: true })
