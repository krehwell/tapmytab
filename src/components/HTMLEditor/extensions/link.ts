import Link from '@tiptap/extension-link'

// non-inclusive so typing at the end of a link exits it instead of extending
export const LinkExtension = Link.extend({ inclusive: false }).configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: 'https',
})
