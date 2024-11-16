import { TBoard, TCard, TLabel } from '../types'

export const TEMPLATE_CONTENT_1 = `
<h1 id="samplemarkdown">Sample Markdown</h1>
<p>This is some basic, sample markdown.</p>
<h2 id="secondheading">Second Heading</h2>
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
    id: 'card1',
    title: 'Card 1',
    content: TEMPLATE_CONTENT_1,
}

export const CARD2: TCard = {
    id: 'card2',
    title: 'Card 2',
    content: TEMPLATE_CONTENT_1,
}

export const CARD3: TCard = {
    id: 'card3',
    title: 'Card 3',
    content: TEMPLATE_CONTENT_2,
}

export const CARD4: TCard = {
    id: 'card4',
    title: 'Card 4',
    content: TEMPLATE_CONTENT_2,
    label: TLabel.Yellow,
}

export const BOARD1: TBoard = {
    id: 'board1',
    cards: [CARD1, CARD2, CARD4],
    title: 'Latest',
}

export const BOARD2: TBoard = {
    id: 'board2',
    cards: [CARD3],
    title: 'Todo',
}
