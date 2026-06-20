import { TBoard, TCard, TLabel } from '../types.ts'

const link = (href: string, text: string) =>
    `<a target="_blank" rel="noopener noreferrer nofollow" href="${href}">${text}</a>`

const WELCOME = `
<h3>👋 Welcome to your new tab!</h3>
<p>This whole page is your board. Try it out:</p>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="false">😀 Hit <strong>Emojify</strong> to jazz up a title</li>
<li data-type="taskItem" data-checked="false">✏️ <strong>Click</strong> a card to open and edit it</li>
<li data-type="taskItem" data-checked="false">🖐️ <strong>Drag</strong> cards between boards</li>
<li data-type="taskItem" data-checked="false">➕ Use the <strong>⋮ menu</strong> to add cards or boards</li>
</ul>
<p>Like it? ${link('https://github.com/krehwell/tapmytab', '⭐ Star us on GitHub')}</p>
`

const ERRANDS = `
<h3>🛒 This week's errands</h3>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="true">🥑 Groceries — avocados, eggs, sourdough</li>
<li data-type="taskItem" data-checked="false">📮 Drop off the package</li>
<li data-type="taskItem" data-checked="false">💧 Water the plants 🌿</li>
<li data-type="taskItem" data-checked="false">📞 Call grandma</li>
</ul>
`

const HABITS = `
<h3>💪 Daily habits</h3>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="true">🧘 Morning stretch</li>
<li data-type="taskItem" data-checked="true">💧 8 glasses of water</li>
<li data-type="taskItem" data-checked="false">🏃 30-min walk</li>
<li data-type="taskItem" data-checked="false">📖 Read 10 pages</li>
</ul>
<p><strong>🔥 5-day streak</strong> — keep it going!</p>
`

const LEARNING = `
<h3>📚 Learning</h3>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="true">Finish <em>"Atomic Habits"</em></li>
<li data-type="taskItem" data-checked="false">Practice <strong>G–C–D</strong> chords 🎸</li>
<li data-type="taskItem" data-checked="false">One Spanish lesson a day 🇪🇸</li>
</ul>
<p>Resources: ${link('https://www.justinguitar.com', 'JustinGuitar')}</p>
`

const WINS = `
<h3>🎉 This week's wins</h3>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="true">Shipped the side project 🚀</li>
<li data-type="taskItem" data-checked="true">Hit the gym 3×</li>
<li data-type="taskItem" data-checked="true">Cooked a new recipe 🍝</li>
</ul>
<blockquote><p>Small wins add up. 💫</p></blockquote>
`

const WATCHLIST = `
<h3>🍿 Watchlist</h3>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="true">Spirited Away</li>
<li data-type="taskItem" data-checked="true">The Grand Budapest Hotel</li>
<li data-type="taskItem" data-checked="false">That show everyone keeps recommending</li>
</ul>
`

const card = (
    id: string,
    title: string,
    content: string,
    desc: string,
    label: TLabel,
): TCard => ({ id, title, content, desc, label })

export const CARD1 = card('card1', 'Start here', WELCOME, 'A 30-second tour', TLabel.Green)
export const CARD2 = card('card2', '🛒 Errands', ERRANDS, 'Little things to knock out', TLabel.Yellow)
export const CARD3 = card('card3', '💪 Daily habits', HABITS, 'Keep the streak alive', TLabel.Red)
export const CARD4 = card('card4', '📚 Learning', LEARNING, 'Level up a little each day', TLabel.Blue)
export const CARD5 = card('card5', '🎉 Wins', WINS, 'Celebrate the small stuff', TLabel.Green)
export const CARD6 = card('card6', '🍿 Watchlist', WATCHLIST, 'For cozy nights in', TLabel.Blue)

export const BOARD1: TBoard = { id: 'board1', name: '📋 To Do', cards: [CARD1, CARD2] }
export const BOARD2: TBoard = { id: 'board2', name: '🌟 Doing', cards: [CARD3, CARD4] }
export const BOARD3: TBoard = { id: 'board3', name: '✅ Done', cards: [CARD5, CARD6] }
