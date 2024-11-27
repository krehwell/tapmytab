import { TBoard, TCard, TLabel } from '../types.ts'

const TEMPLATE_CONTENT_A = `
<h2>🌱 Garden Makeover Plan</h2>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="false">🌸 <strong>Plant new flowers:</strong> Lavender, Roses, and Daisies</li>
<li data-type="taskItem" data-checked="false">🍀 <em>Weed and mulch the garden beds</em></li>
<li data-type="taskItem" data-checked="false">🚿 Install a drip irrigation system</li>
</ul>
<p>Inspiration: <a href="https://example-garden-ideas.com">Garden Ideas</a></p>
<blockquote>
<p>“To plant a garden is to believe in tomorrow.”</p>
</blockquote>
`

const TEMPLATE_CONTENT_B = `
<h2>🎨 Home Decor Updates</h2>
<p><em>Creative tasks for a cozy home:</em></p>
<ol>
<li>🛋️ Rearrange living room furniture</li>
<li>🖼️ Hang new <strong>art pieces</strong> on walls</li>
<li>🕯️ Add <em>scented candles</em> for ambiance</li>
</ol>
<p>DIY Project: Build a rustic bookshelf with reclaimed wood!</p>
<pre><code class="language-plaintext">Supplies:
- Wood planks
- Screws and brackets
- Sandpaper and paint</code></pre>
`

const TEMPLATE_CONTENT_C = `
<h2>📚 Reading Goals</h2>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="true">📖 Finish <em>"Atomic Habits"</em> by James Clear</li>
<li data-type="taskItem" data-checked="false">📘 Start <strong>"The Power of Now"</strong> by Eckhart Tolle</li>
<li data-type="taskItem" data-checked="false">🖋️ Write a <em>book review</em> for Goodreads</li>
</ul>
<blockquote>
<p>“A reader lives a thousand lives before he dies.”</p>
</blockquote>
`

const TEMPLATE_CONTENT_D = `
<h2>🍳 Cooking Challenges</h2>
<p>Try these new recipes this week:</p>
<ol>
<li>🥗 Mediterranean quinoa salad</li>
<li>🍝 Homemade pasta with fresh basil pesto</li>
<li>🍪 Chocolate chip cookies with a pinch of sea salt</li>
</ol>
<p>Don’t forget to take photos for your food journal!</p>
`

// Card definitions
export const CARD1: TCard = {
    id: 'card1',
    title: 'Garden Makeover 🌸',
    content: TEMPLATE_CONTENT_A,
    desc: 'Planning a refreshing garden transformation',
    label: TLabel.Green,
}

export const CARD2: TCard = {
    id: 'card2',
    title: 'Home Decor Updates 🖼️',
    content: TEMPLATE_CONTENT_B,
    desc: 'Reimagining the living space',
    label: TLabel.Blue,
}

export const CARD3: TCard = {
    id: 'card3',
    title: 'Reading Goals 📚',
    content: TEMPLATE_CONTENT_C,
    desc: 'Curated book reading and review goals',
    label: TLabel.Yellow,
}

export const CARD4: TCard = {
    id: 'card4',
    title: 'Cooking Challenges 🍳',
    content: TEMPLATE_CONTENT_D,
    desc: 'Delicious recipes to try',
    label: TLabel.Red,
}

// Board definitions
export const BOARD1: TBoard = {
    id: 'board1',
    cards: [CARD1, CARD2],
    name: '🚀 To Do',
}

export const BOARD2: TBoard = {
    id: 'board2',
    cards: [CARD3, CARD4],
    name: '⚙️ Work in Progress',
}
