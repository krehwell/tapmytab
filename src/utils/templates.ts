import { TBoard, TCard, TExcalidraw, TLabel } from '../types.ts'
import manifest from '../../manifest.json'

// local to the welcome card text; version state/logic lives in ./version.ts
const VERSION = manifest.version

// useful for testing
// example:  http://localhost:5173/?perf=40x20
export const perfBoards = (spec: string): TBoard[] => {
    const [b, c] = spec.split('x').map((n) => parseInt(n, 10) || 0)
    return Array.from({ length: b }, (_, i) => ({
        id: `pb${i}`,
        name: `Perf ${i + 1}`,
        cards: Array.from({ length: c }, (_, j) => ({
            id: `pc${i}-${j}`,
            title: `Card ${j + 1}`,
            content: `<p>card ${j + 1} on board ${i + 1}</p>`,
            label: TLabel.No,
        })),
    }))
}

const link = (href: string, text: string) =>
    `<a target="_blank" rel="noopener noreferrer nofollow" href="${href}">${text}</a>`

const WELCOME = `
<h3>👋 Welcome to your new tab!</h3>
<img src="/tapmytab.png" style="width: 60%">
<p style="text-align: center"><strong>v${VERSION}</strong></p>
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
<h3>🛒 This week's errands</h3><ul data-type="taskList"><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>🥑 Groceries: avocados, eggs, sourdough</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>📮 Drop off the package</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>💧 Water the plants 🌿</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>📞 Call grandma</p></div></li></ul><p></p>
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
<li data-type="taskItem" data-checked="true">Open chords: <strong>G</strong>, <strong>C</strong>, <strong>D</strong></li>
<li data-type="taskItem" data-checked="false">Clean chord changes &amp; a basic strum</li>
<li data-type="taskItem" data-checked="false">First song: a 3-chord tune 🎵</li>
<li data-type="taskItem" data-checked="false">The F barre chord 😤</li>
</ul>
<p>Resources: ${link('https://www.justinguitar.com', 'JustinGuitar')}</p>
`

const JP_ITINERARY = `
<h2>🗾 12 days in Japan</h2><p><em>cherry blossoms, ramen, and a whole lot of walking</em></p><h3>Route</h3><ol><li><p>🗼 <strong>Tokyo</strong>: Shibuya, teamLab, Akihabara</p></li><li><p>⛩️ <strong>Kyoto</strong>: Fushimi Inari <em>at sunrise</em></p></li><li><p>🦌 <strong>Nara</strong>: feed the deer 🍪</p></li><li><p>🍜 <strong>Osaka</strong>: eat everything in Dotonbori</p></li></ol><blockquote><p>💡 Tip: grab a <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.japanrailpass.net">JR Pass</a> before flying</p></blockquote><p></p>
`

const JP_PACKING = `
<h3>🎒 Don't-forget list</h3><ul data-type="taskList"><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>🚄 JR Pass <strong>printed</strong> + Suica topped up</p></div></li><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>🔌 Plug adapter &amp; power bank</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>👟 <em>Comfy</em> walking shoes</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>💴 Cash: many shops are <code>cash only</code></p></div></li></ul><p>Daily budget guess:</p><pre><code>food   ¥4000
trains ¥1500
fun    ¥3000</code></pre><p></p>
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

// --- example excalidraw drawing (a little "idea → plan → ship" flow) ---
let elSeed = 1000
const el = (over: Record<string, unknown>) => ({
    angle: 0,
    strokeColor: '#1e1e1e',
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 2,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: { type: 3 },
    seed: ++elSeed * 7,
    version: 1,
    versionNonce: ++elSeed * 13,
    isDeleted: false,
    boundElements: [],
    updated: 1,
    link: null,
    locked: false,
    ...over,
})

const box = (id: string, x: number, bg: string) =>
    el({ id, type: 'rectangle', x, y: 150, width: 150, height: 80, backgroundColor: bg })

const label = (id: string, x: number, text: string) =>
    el({
        id,
        type: 'text',
        x,
        y: 178,
        width: text.length * 16,
        height: 30,
        text,
        fontSize: 24,
        fontFamily: 5, // Excalifont (hand-drawn)
        textAlign: 'center',
        verticalAlign: 'top',
        containerId: null,
        originalText: text,
        lineHeight: 1.25,
        roundness: null,
    })

const flowArrow = (id: string, x: number) =>
    el({
        id,
        type: 'arrow',
        x,
        y: 190,
        width: 50,
        height: 0,
        points: [[0, 0], [50, 0]],
        lastCommittedPoint: null,
        startBinding: null,
        endBinding: null,
        startArrowhead: null,
        endArrowhead: 'arrow',
        roundness: { type: 2 },
    })

const FLOW_DRAWING: TExcalidraw = {
    elements: [
        el({
            id: 'd-title',
            type: 'text',
            x: 100, // centered over the flow (boxes span x:40–630, center 335; width 470 → x=100)
            y: 30,
            width: 470,
            height: 45,
            text: 'from idea to production',
            fontSize: 36,
            fontFamily: 5,
            textAlign: 'center',
            verticalAlign: 'top',
            containerId: null,
            originalText: 'from idea to production',
            lineHeight: 1.25,
            roundness: null,
        }),
        el({
            id: 'd-subtitle',
            type: 'text',
            x: 100,
            y: 78,
            width: 470,
            height: 25,
            text: '(click to draw)',
            fontSize: 26,
            fontFamily: 5,
            textAlign: 'center',
            verticalAlign: 'top',
            containerId: null,
            originalText: '(click to draw)',
            lineHeight: 1.25,
            roundness: null,
        }),
        box('d-box1', 40, '#a5d8ff'),
        box('d-box2', 260, '#b2f2bb'),
        box('d-box3', 480, '#ffc9c9'),
        label('d-l1', 75, 'Idea'),
        label('d-l2', 295, 'Plan'),
        label('d-l3', 515, 'Ship'),
        flowArrow('d-a1', 200),
        flowArrow('d-a2', 420),
    ],
    files: {},
}

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

// excalidraw card: content is the scene object instead of html
export const CARD8: TCard = {
    id: 'card8',
    title: 'Flow sketch ✏️',
    content: FLOW_DRAWING,
    desc: 'Draw an Excalidraw card',
    label: TLabel.Green,
}

export const BOARD1: TBoard = { id: 'board1', name: '📋 TODO', cards: [CARD1, CARD2] }
export const BOARD2: TBoard = { id: 'board2', name: '🌟 Doing', cards: [CARD3, CARD4] }
export const BOARD3: TBoard = { id: 'board3', name: '✈️ Trip to Japan', cards: [CARD5, CARD6, CARD7] }
export const BOARD4: TBoard = { id: 'board4', name: '🎨 Sketches', cards: [CARD8] }
