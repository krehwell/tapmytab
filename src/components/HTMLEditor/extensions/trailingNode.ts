import { Extension } from '@tiptap/react'
import { Node, NodeType } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'

// when the document ends with a hard-to-escape block (image, code block, hr,
// list…), append an empty paragraph so there's always a line to type on.
const needsTrailing = (last: Node | null, notAfter: NodeType[]) => !!last && notAfter.indexOf(last.type) === -1

export const TrailingNode = Extension.create({
    name: 'trailingNode',

    addOptions() {
        return {
            node: 'paragraph',
            // last nodes that are already typeable → no trailing paragraph needed
            notAfter: ['paragraph'] as string[],
        }
    },

    addProseMirrorPlugins() {
        const key = new PluginKey(this.name)
        const trailingNode = this.options.node
        const nodes = this.editor.schema.nodes
        const notAfter = Object.keys(nodes)
            .map((name) => nodes[name])
            .filter((node: NodeType) => this.options.notAfter.indexOf(node.name) !== -1)

        return [
            new Plugin({
                key,
                appendTransaction: (_transactions, _oldState, state) => {
                    if (!key.getState(state)) return
                    const { doc, tr, schema } = state
                    return tr.insert(doc.content.size, schema.nodes[trailingNode].create())
                },
                state: {
                    init: (_, state) => needsTrailing(state.doc.lastChild, notAfter),
                    apply: (tr, value) => (tr.docChanged ? needsTrailing(tr.doc.lastChild, notAfter) : value),
                },
            }),
        ]
    },
})
