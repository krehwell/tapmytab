import { TBoard, TCard, TLabel } from '../types.ts'

const link = (href: string, text: string) =>
    `<a target="_blank" rel="noopener noreferrer nofollow" href="${href}">${text}</a>`

const WEEKEND = `
<h3>🌄 Weekend adventures</h3>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="false">Sunrise hike + coffee from a thermos</li>
<li data-type="taskItem" data-checked="false">Try the new ramen place downtown 🍜</li>
<li data-type="taskItem" data-checked="false">Picnic in the park if it's sunny</li>
</ul>
<p>Ideas: ${link('https://www.atlasobscura.com', 'Atlas Obscura')}</p>
`

const GROCERIES = `
<h3>🛒 Groceries & meal prep</h3>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="false">🥑 Avocados, eggs, sourdough</li>
<li data-type="taskItem" data-checked="false">🍝 Pasta night — fresh basil for pesto</li>
<li data-type="taskItem" data-checked="false">🍪 Bake cookies for the neighbors</li>
</ul>
<blockquote><p>Don't shop hungry 😅</p></blockquote>
`

const FITNESS = `
<h3>💪 Get moving</h3>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="true">Monday yoga 🧘</li>
<li data-type="taskItem" data-checked="true">Wednesday run — 5k</li>
<li data-type="taskItem" data-checked="false">Saturday bike ride along the coast 🚲</li>
</ul>
<p>Streak: <strong>3 weeks</strong> and counting!</p>
`

const HOBBY = `
<h3>🎸 Learn guitar</h3>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="true">Tune the strings without an app</li>
<li data-type="taskItem" data-checked="false">Nail the G–C–D chord change</li>
<li data-type="taskItem" data-checked="false">Play a full song start to finish</li>
</ul>
<p>Lessons: ${link('https://www.justinguitar.com', 'JustinGuitar')}</p>
`

const WATCHLIST = `
<h3>🍿 Movie night</h3>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="true">Spirited Away</li>
<li data-type="taskItem" data-checked="true">The Grand Budapest Hotel</li>
<li data-type="taskItem" data-checked="false">That documentary everyone keeps mentioning</li>
</ul>
<blockquote><p>“A reader lives a thousand lives… so does a movie lover 🎬”</p></blockquote>
`

const READING = `
<h3>📚 Books I finished</h3>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="true"><em>Atomic Habits</em> — James Clear</li>
<li data-type="taskItem" data-checked="true"><em>The Midnight Library</em> — Matt Haig</li>
<li data-type="taskItem" data-checked="false">Write a quick review on ${
    link('https://www.goodreads.com', 'Goodreads')
}</li>
</ul>
`

const card = (
    id: string,
    title: string,
    content: string,
    desc: string,
    label: TLabel,
): TCard => ({ id, title, content, desc, label })

export const CARD1 = card('card1', 'Weekend adventures 🌄', WEEKEND, 'Make the most of the days off', TLabel.Green)
export const CARD2 = card('card2', 'Groceries & meal prep 🛒', GROCERIES, 'Eat well this week', TLabel.Yellow)
export const CARD3 = card('card3', 'Get moving 💪', FITNESS, 'Keep the streak alive', TLabel.Red)
export const CARD4 = card('card4', 'Learn guitar 🎸', HOBBY, 'One song at a time', TLabel.Blue)
export const CARD5 = card('card5', 'Movie night 🍿', WATCHLIST, 'Cozy nights in', TLabel.Blue)
export const CARD6 = card('card6', 'Books I finished 📚', READING, 'Reading wins', TLabel.Yellow)

export const BOARD1: TBoard = { id: 'board1', name: '📋 To Do', cards: [CARD1, CARD2] }
export const BOARD2: TBoard = { id: 'board2', name: '🌟 Doing', cards: [CARD3, CARD4] }
export const BOARD3: TBoard = { id: 'board3', name: '✅ Done', cards: [CARD5, CARD6] }
