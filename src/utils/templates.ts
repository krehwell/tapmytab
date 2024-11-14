import { TBoard, TCard, TLabel } from '../types'

export const TEMPLATE_CONTENT_1 = `
<h1 id="sample-markdown">Sample Markdown</h1>
<p>This is some basic, sample markdown.</p>
<h2 id="second-heading">Second Heading</h2>
<ul>
<li>Unordered lists, and:<ol>
<li>One</li>
<li>Two</li>
<li>Three</li>
</ol>
</li>
<li>More</li>
</ul>
<blockquote>
<p>Blockquote</p>
</blockquote>
`

export const TEMPLATE_CONTENT_2 = `
<p>mom asks</p>
<ul>
<li>[x] buy tomato</li>
<li>[] buy mac</li>
</ul>
`

export const CARD1: TCard = {
    id: 'card-1',
    title: 'My Content',
    content: TEMPLATE_CONTENT_1,
}

export const CARD2: TCard = {
    id: 'card-2',
    title: 'Reminder',
    content: TEMPLATE_CONTENT_1,
}

export const CARD3: TCard = {
    id: 'card-3',
    title: 'mom reminders',
    content: TEMPLATE_CONTENT_2,
}

export const CARD4: TCard = {
    id: 'card-4',
    title: 'another list',
    content: TEMPLATE_CONTENT_2,
}

export const BOARD1: TBoard = {
    id: 'board-1',
    cards: [CARD1, CARD2, CARD4],
    title: 'Latest',
}

export const BOARD2: TBoard = {
    id: 'board-2',
    cards: [CARD3],
    title: 'Todo',
}

export const TEMPLATE_BOARDS: { [id: string]: TCard[] } = {
    Latest: [
        { id: 'card-1', content: 'content card - 1', title: 'card - 1', desc: 'desc card 1', label: TLabel.Red },
        { id: 'card-2', content: 'content card - 2', title: 'card - 2', desc: 'desc card 2', label: TLabel.Blue },
        { id: 'card-3', content: 'content card - 3', title: 'card - 3', desc: 'desc card 3' },
    ],
    'To-dos': [
        { id: 'card-4', content: 'content card - 4', title: 'card - 4', desc: 'desc card 4', label: TLabel.Yellow },
        { id: 'card-5', content: 'content card - 5', title: 'card - 5', desc: 'desc card 5' },
    ],
    Done: [
        { id: 'card-6', content: 'content card - 7', title: 'card - 6', desc: 'desc card 6' },
        { id: 'card-7', content: 'content card - 8', title: 'card - 7', desc: 'desc card 7', label: TLabel.Green },
    ],
}
