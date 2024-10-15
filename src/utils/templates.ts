import { TBoard, TCard } from '../types'

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
