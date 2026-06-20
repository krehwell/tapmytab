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
// random smiley from the emoticons block (U+1F600–U+1F64F) — densely assigned, no tofu
const randomEmoji = () => String.fromCodePoint(0x1f600 + Math.floor(Math.random() * (0x1f64f - 0x1f600 + 1)))

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
