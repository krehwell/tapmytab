import { TBoard, TCard, TLabel } from '../types.ts'

const link = (href: string, text: string) =>
    `<a target="_blank" rel="noopener noreferrer nofollow" href="${href}">${text}</a>`

const WELCOME = `
<h3>👋 Welcome to your new tab!</h3>
<img src="/tapmytab.png" style="width: 60%">
<p>This whole page is your board. Try it out:</p>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="false">😀 Hit <strong>Emojify</strong> to jazz up a title</li>
<li data-type="taskItem" data-checked="false">✏️ <strong>Click</strong> a card to open and edit it</li>
<li data-type="taskItem" data-checked="false">🖐️ <strong>Drag</strong> cards between boards</li>
<li data-type="taskItem" data-checked="false">➕ Use the <strong>⋮ menu</strong> to add cards or boards</li>
<li data-type="taskItem" data-checked="false">🧭 Click the <strong>tapmytab</strong> logo for import/export &amp; more</li>
</ul>
<p>Like it? ${link('https://github.com/krehwell/tapmytab', '⭐ Star us on GitHub')}</p>
`

const ERRANDS = `
<h3>🛒 This week's errands</h3>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="true">🥑 Groceries: avocados, eggs, sourdough</li>
<li data-type="taskItem" data-checked="false">📮 Drop off the package</li>
<li data-type="taskItem" data-checked="false">💧 Water the plants 🌿</li>
<li data-type="taskItem" data-checked="false">📞 Call grandma</li>
</ul>
`

const HABITS = `
<h3>💪 Daily habits</h3>
<ul>
<li>🧘 Morning stretch</li>
<li>💧 8 glasses of water</li>
<li>🏃 30-min walk</li>
<li>📖 Read 10 pages</li>
</ul>
<p><strong>🔥 5-day streak</strong></p>
`

const LEARNING = `
<h3>🎸 Learn guitar from scratch</h3>
<p><em>Check each off as it clicks.</em></p>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="true">Tune up &amp; learn the string names (EADGBE)</li>
<li data-type="taskItem" data-checked="true">First chords: <strong>Em</strong>, <strong>A</strong>, <strong>D</strong></li>
<li data-type="taskItem" data-checked="false">Open chords: <strong>G</strong>, <strong>C</strong>, <strong>D</strong></li>
<li data-type="taskItem" data-checked="false">Clean chord changes &amp; a basic strum</li>
<li data-type="taskItem" data-checked="false">First song: a 3-chord tune 🎵</li>
<li data-type="taskItem" data-checked="false">The F barre chord 😤</li>
</ul>
<p>Resources: ${link('https://www.justinguitar.com', 'JustinGuitar')}</p>
`

const JP_ITINERARY = `
<h2>🗾 12 days in Japan</h2>
<p><em>cherry blossoms, ramen, and a whole lot of walking</em></p>
<h3>Route</h3>
<ol>
<li>🗼 <strong>Tokyo</strong>: Shibuya, teamLab, Akihabara</li>
<li>⛩️ <strong>Kyoto</strong>: Fushimi Inari <em>at sunrise</em></li>
<li>🦌 <strong>Nara</strong>: feed the deer 🍪</li>
<li>🍜 <strong>Osaka</strong>: eat everything in Dotonbori</li>
</ol>
<blockquote><p>💡 Tip: grab a ${link('https://www.japanrailpass.net', 'JR Pass')} before flying</p></blockquote>
`

const JP_PACKING = `
<h3>🎒 Don't-forget list</h3>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="true">🚄 JR Pass <strong>printed</strong> + Suica topped up</li>
<li data-type="taskItem" data-checked="true">🔌 Plug adapter &amp; power bank</li>
<li data-type="taskItem" data-checked="false">👟 <em>Comfy</em> walking shoes</li>
<li data-type="taskItem" data-checked="false">💴 Cash: many shops are <code>cash only</code></li>
</ul>
<p>Daily budget guess:</p>
<pre><code>food   ¥4000
trains ¥1500
fun    ¥3000</code></pre>
`

const JP_EATS = `
<h3>🍣 Must-eat list</h3>
<ul>
<li>🍜 Tonkotsu ramen: ${link('https://www.ichiran.com/', 'Ichiran')}</li>
<li>🍢 Street food in <strong>Dotonbori</strong></li>
<li>🍵 Matcha <em>everything</em></li>
<li>🐟 Tsukiji sushi breakfast</li>
</ul>
<p>Phrases to know:</p>
<p>👉 <code>itadakimasu</code> before eating · <code>gochisousama</code> after</p>
`

const card = (
    id: string,
    title: string,
    content: string,
    desc: string,
    label: TLabel,
): TCard => ({ id, title, content, desc, label })

export const CARD1 = card('card1', 'Start here', WELCOME, 'A 30-second tour', TLabel.Green)
export const CARD2 = card('card2', 'Errands 🛒', ERRANDS, 'Little things to knock out', TLabel.Yellow)
export const CARD3 = card('card3', 'Daily habits 💪', HABITS, 'Keep the streak alive', TLabel.Red)
export const CARD4 = card('card4', 'Learning 📚', LEARNING, 'Level up a little each day', TLabel.Blue)
export const CARD5 = {
    ...card('card5', 'Japan itinerary 🗾', JP_ITINERARY, 'Where to go', TLabel.Blue),
    dueDate: '2027-04-01',
}
export const CARD6 = card('card6', 'Packing 🎒', JP_PACKING, "Don't forget", TLabel.Yellow)
export const CARD7 = card('card7', 'Must-eat list 🍣', JP_EATS, 'Hungry yet?', TLabel.Red)

export const BOARD1: TBoard = { id: 'board1', name: '📋 To Do', cards: [CARD1, CARD2] }
export const BOARD2: TBoard = { id: 'board2', name: '🌟 Doing', cards: [CARD3, CARD4] }
export const BOARD3: TBoard = { id: 'board3', name: '✈️ Trip to Japan', cards: [CARD5, CARD6, CARD7] }
