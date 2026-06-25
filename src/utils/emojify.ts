const KEYWORD_EMOJI: [RegExp, string[]][] = [
    // generic/default board names (exact match only)
    [/^\s*(untitled|new card|card|new item|item|random|misc|other)\s*$/i, ['🗂️', '📌', '🗒️', '📄', '🪄', '✨']],
    [/^\s*(note|notes|scratch|scratchpad|thought|thoughts)\s*$/i, ['📝', '✏️', '📓', '🗒️', '🖊️', '💭']],
    [/^\s*(remember|reminder|reminders|remind|forget|keep|mind)\s*$/i, ['🔔', '⏰', '📌', '🧠', '👀', '🧷']],
    [/^\s*(checklist|action)\s*$/i, ['📋', '☐', '✅', '🗂️', '📌', '✏️']],
    [/^\s*(inbox|capture|dump|parking)\s*$/i, ['📥', '🗃️', '📬', '🧺', '🫙', '🧠']],
    [/^\s*(ideas|maybe|future|wishlist)\s*$/i, ['💡', '🌱', '🔮', '💭', '🌠', '✨']],
    [/^\s*(reference|resources|resource|links|bookmarks|saved|archive|reading)\s*$/i, [
        '🔖',
        '📚',
        '🗃️',
        '🧷',
        '🔗',
        '📂',
    ]],
    [/^\s*(planning|project|projects|next)\s*$/i, ['🗺️', '🎯', '🧭', '📍', '🏗️', '🚩']],
    [/^\s*(shopping|list|groceries|errands)\s*$/i, ['🛒', '🛍️', '📦', '🏪', '🧾', '💳']],
    // status
    [/\b(todo|to do|tasks?|backlog|later)\b/i, ['📋', '📝', '📌', '🗂️', '✏️', '☐']],
    [/\b(doing|progress|wip|ongoing|working)\b/i, ['🚧', '⚙️', '🔄', '🛠️', '🏗️', '⏳']],
    [/\b(done|complete|completed|finish|finished|shipped)\b/i, ['✅', '🎉', '🏁', '🙌', '💯', '✨']],
    [/\b(blocked|stuck|waiting|pending|hold)\b/i, ['🚫', '🧱', '⏸️', '⌛', '🚦', '🫠']],
    [/\b(urgent|important|priority|asap|critical)\b/i, ['🚨', '🔥', '⚠️', '❗', '⚡', '🔴']],
    [/\b(due|deadline|overdue|eta)\b/i, ['⏰', '📆', '🗓️', '⌛', '🔴', '❗']],
    // thinking and planning
    [/\b(idea|brainstorm|think|concept|inspiration)\b/i, ['💡', '🧠', '✨', '🌟', '🔮', '💭']],
    [/\b(goal|plan|target|roadmap|milestone|resolution)\b/i, ['🎯', '🗺️', '🧭', '🏹', '📍', '🚩']],
    [/\b(review|retro|reflect|feedback|evaluate)\b/i, ['🔍', '🪞', '💬', '📊', '🧾', '👀']],
    [/\b(research|explore|investigate|compare|discover)\b/i, ['🔎', '🧪', '🔬', '📚', '🧭', '🗺️']],
    [/\b(what|why|how|question|faq|unsure)\b/i, ['❓', '🤔', '🧐', '❔', '💬', '🤷']],
    [/\b(step|steps|stage|phase|flow|process)\b/i, ['👣', '🪜', '➡️', '🔢', '🚶', '🧗']],
    // work and learning
    [/\b(work|job|office|career|client)\b/i, ['💼', '🏢', '👔', '🖥️', '📊', '☕']],
    [/\b(meet|meeting|call|sync|standup|interview|schedule)\b/i, ['📅', '🤝', '📞', '💬', '🗓️', '🎙️']],
    [/\b(email|message|mail|reply|dm)\b/i, ['📧', '📨', '✉️', '📬', '💌', '🕊️']],
    [/\b(write|writing|blog|article|draft|copy)\b/i, ['✍️', '📝', '🖊️', '📄', '📰', '🪶']],
    [/\b(read|book|study|learn|course)\b/i, ['📚', '📖', '🎒', '🧑‍🎓', '🕯️', '🔖']],
    [/\b(school|class|exam|homework|college|assignment)\b/i, ['🎓', '🏫', '📚', '✏️', '🧑‍🏫', '📐']],
    // tech and creative
    [/\b(code|coding|dev|program|developer|software)\b/i, ['💻', '⌨️', '🧑‍💻', '🖥️', '🔌', '⚡']],
    [/\b(bug|fix|issue|error|debug|broken)\b/i, ['🐛', '🔧', '🩹', '🚑', '💢', '🧯']],
    [/\b(launch|ship|release|deploy|publish|rollout)\b/i, ['🚀', '📦', '🛰️', '🎯', '⚡', '📣']],
    [/\b(flag|sentry|monitor|alert|log|logs|metric|metrics)\b/i, ['🚩', '📡', '🛰️', '🔭', '📊', '🚨']],
    [/\b(design|ui|ux|figma|sketch|prototype)\b/i, ['🎨', '📐', '🖌️', '🧩', '📱', '🖼️']],
    [/\b(art|paint|draw|craft|illustration)\b/i, ['🎨', '🖌️', '🖍️', '🧵', '🖼️', '🪡']],
    [/\b(photo|camera|picture|shoot|video)\b/i, ['📸', '📷', '🎥', '🎞️', '🤳', '📺']],
    // personal life
    [/\b(home|house|move|apartment|room)\b/i, ['🏠', '🔑', '🛋️', '📦', '🏡', '🪟']],
    [/\b(clean|chore|laundry|tidy|wash)\b/i, ['🧹', '🧽', '🫧', '🪣', '🧺', '🧼']],
    [/\b(garden|plant|grow|flower|water)\b/i, ['🌱', '🪴', '🌿', '🌻', '🌸', '💧']],
    [/\b(sleep|rest|nap|bed|relax)\b/i, ['😴', '🛏️', '🌙', '💤', '🧸', '☁️']],
    [/\b(health|doctor|medic|appointment|therapy)\b/i, ['🩺', '💊', '🏥', '🩹', '❤️‍🩹', '🧬']],
    [/\b(gym|workout|fitness|exercise|train)\b/i, ['💪', '🏋️', '🤸', '🥊', '🏃', '🏅']],
    [/\b(run|jog|marathon|race|cardio|sports)\b/i, ['🏃', '👟', '💨', '🫁', '🛣️', '⏱️']],
    // food, shopping, and money
    [/\b(food|eat|cook|recipe|lunch|dinner|meal)\b/i, ['🍳', '🍜', '🥗', '🍕', '👨‍🍳', '🫕']],
    [/\b(coffee|cafe|brew|tea)\b/i, ['☕', '🫖', '🍵', '🧋', '🥐', '🫘']],
    [/\b(buy|shop|grocer|cart|order|purchase)\b/i, ['🛒', '🛍️', '📦', '💳', '🏪', '🧾']],
    [/\b(money|budget|finance|save|invest|bank|invoice)\b/i, ['💰', '💵', '📈', '🏦', '🪙', '🐷']],
    // fun and social
    [/\b(love|date|crush|romance)\b/i, ['❤️', '💕', '💌', '🌹', '😍', '🫶']],
    [/\b(birthday|gift|present)\b/i, ['🎂', '🎁', '🥳', '🎈', '🪅', '🎀']],
    [/\b(beer|drink|party|night|hangout)\b/i, ['🍺', '🥂', '🍾', '🎊', '🪩', '🍸']],
    [/\b(music|song|playlist|gig|concert)\b/i, ['🎵', '🎸', '🎤', '🎧', '🎼', '🎹']],
    [/\b(game|gaming|arcade|stream)\b/i, ['🎮', '🕹️', '👾', '🎲', '🏆', '🧩']],
    [/\b(weird|chaos|silly|fun|funny)\b/i, ['🤪', '🌀', '🃏', '🙃', '✨', '👽']],
    [/\b(movie|film|cinema|watch|show|series)\b/i, ['🎬', '🍿', '📽️', '🎥', '🎞️', '📺']],
    [/\b(travel|trip|vacation|holiday|flight|hotel)\b/i, ['✈️', '🧳', '🌍', '🗺️', '🏖️', '🚆']],
    // pets
    [/\b(pet|dog|puppy)\b/i, ['🐶', '🐾', '🦴', '🐕', '🎾', '🦮']],
    [/\b(cat|kitten)\b/i, ['🐱', '🐈', '😸', '🐾', '🧶', '🐟']],
    // achievement and aspirations
    [/\b(win|success|achiev|trophy)\b/i, ['🏆', '🥇', '🎊', '🙌', '💯', '🦁']],
    [/\b(dream|someday|bucket|wish)\b/i, ['🌠', '🌈', '💭', '✨', '🔮', '🪄']],
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

export const PLACEHOLDER_TITLE = 'Untitled'

export const hasEmoji = (s: string) => /\p{Extended_Pictographic}/u.test(s)
export const hasLeadingEmoji = (s: string) => /^\s*\p{Extended_Pictographic}/u.test(s)
const hasTrailingEmoji = (s: string) => /\p{Extended_Pictographic}\s*$/u.test(s)

export const emojify = (title: string, position: 'start' | 'end' = 'start'): string => {
    const end = position === 'end'
    if (end ? hasTrailingEmoji(title) : hasLeadingEmoji(title)) return title
    const trimmed = title.trim()
    const base = trimmed || PLACEHOLDER_TITLE
    const match = KEYWORD_EMOJI.find(([re]) => re.test(base))
    const emoji = match ? match[1][Math.floor(Math.random() * match[1].length)] : randomEmoji()
    return end ? `${base} ${emoji}` : `${emoji} ${base}`
}
