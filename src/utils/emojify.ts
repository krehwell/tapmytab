// Prepend a relevant emoji to a title that doesn't already start with one.

// matched at a word start (no trailing boundary) so plurals/gerunds hit: "tasks", "reading"
const KEYWORD_EMOJI: [RegExp, string][] = [
    [/\b(todo|to do|task)/i, '📋'],
    [/\b(doing|progress|wip|ongoing)/i, '🚧'],
    [/\b(done|complete|finish|shipped)/i, '✅'],
    [/\b(idea|brainstorm|think)/i, '💡'],
    [/\b(bug|fix|issue|error|debug)/i, '🐛'],
    [/\b(work|job|office|career)/i, '💼'],
    [/\b(read|book|study|learn|note)/i, '📚'],
    [/\b(buy|shop|grocer|cart|order)/i, '🛒'],
    [/\b(launch|ship|release|rocket|deploy)/i, '🚀'],
    [/\b(love|date|crush|wishlist)/i, '❤️'],
    [/\b(gym|workout|fitness|exercise|train)/i, '💪'],
    [/\b(run|jog|marathon)/i, '🏃'],
    [/\b(food|eat|cook|recipe|lunch|dinner)/i, '🍕'],
    [/\b(coffee|cafe|brew)/i, '☕'],
    [/\b(beer|drink|party|celebrat)/i, '🍺'],
    [/\b(music|song|playlist|gig)/i, '🎵'],
    [/\b(game|gaming|play|arcade)/i, '🎮'],
    [/\b(movie|film|cinema|watch|show)/i, '🎬'],
    [/\b(travel|trip|vacation|holiday|flight)/i, '✈️'],
    [/\b(home|house|move|apartment)/i, '🏠'],
    [/\b(money|budget|finance|save|invest|bank)/i, '💰'],
    [/\b(health|doctor|medic|appointment)/i, '🩺'],
    [/\b(sleep|rest|nap|bed)/i, '😴'],
    [/\b(clean|chore|laundry|tidy)/i, '🧹'],
    [/\b(garden|plant|grow|flower)/i, '🌱'],
    [/\b(pet|dog|puppy)/i, '🐶'],
    [/\b(cat|kitten)/i, '🐱'],
    [/\b(code|coding|dev|program|hack)/i, '💻'],
    [/\b(design|ui|ux|figma|sketch)/i, '🎨'],
    [/\b(write|writing|blog|article|draft)/i, '✍️'],
    [/\b(meet|meeting|call|sync|standup)/i, '📅'],
    [/\b(email|inbox|message|mail)/i, '📧'],
    [/\b(goal|plan|target|resolution)/i, '🎯'],
    [/\b(dream|someday|bucket|wish)/i, '✨'],
    [/\b(school|class|exam|homework|college)/i, '🎓'],
    [/\b(birthday|gift|present|party)/i, '🎉'],
    [/\b(urgent|important|priority|asap|fire)/i, '🔥'],
    [/\b(win|success|achiev|trophy)/i, '🏆'],
    [/\b(art|paint|draw|craft)/i, '🖌️'],
    [/\b(photo|camera|picture|shoot)/i, '📸'],
]

const EMOJI_RANGES: [number, number][] = [
    [0x1f300, 0x1f5ff], // misc symbols & pictographs (weather, animals, food, places…)
    [0x1f600, 0x1f64f], // emoticons (faces, gestures)
    [0x1f680, 0x1f6c5], // transport & map
    [0x1f90c, 0x1f9ff], // supplemental symbols & pictographs
    [0x1fa70, 0x1faf8], // symbols & pictographs extended-A
]
const FLAG_CODEPOINTS = [0x1f3c1, 0x1f3f3, 0x1f3f4, 0x1f6a9] // 🏁 🏳 🏴 🚩

const randomEmoji = (): string => {
    while (true) {
        const [lo, hi] = EMOJI_RANGES[Math.floor(Math.random() * EMOJI_RANGES.length)]
        const cp = lo + Math.floor(Math.random() * (hi - lo + 1))
        if (FLAG_CODEPOINTS.indexOf(cp) === -1) return String.fromCodePoint(cp)
    }
}

const PLACEHOLDER_TITLE = 'Untitled'

export const hasEmoji = (s: string) => /\p{Extended_Pictographic}/u.test(s)
export const hasLeadingEmoji = (s: string) => /^\s*\p{Extended_Pictographic}/u.test(s)
const hasTrailingEmoji = (s: string) => /\p{Extended_Pictographic}\s*$/u.test(s)

export const emojify = (title: string, position: 'start' | 'end' = 'start'): string => {
    const end = position === 'end'
    if (end ? hasTrailingEmoji(title) : hasLeadingEmoji(title)) return title
    const trimmed = title.trim()
    const base = trimmed || PLACEHOLDER_TITLE
    const match = trimmed ? KEYWORD_EMOJI.find(([re]) => re.test(title)) : undefined
    const emoji = match ? match[1] : randomEmoji()
    return end ? `${base} ${emoji}` : `${emoji} ${base}`
}
