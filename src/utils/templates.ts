import { TBoard, TCard } from '../types'

export const TEMPLATE_CONTENT_0 = `
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

export const TEMPLATE_CONTENT_1 = `
<p>Links
photopea: <a href="https://www.photopea.com/">https://www.photopea.com/</a>
linear: <a href="https://linear.app/knowt/">https://linear.app/knowt/</a>
slack: <a href="https://app.slack.com/client/TCH187HU3/C02S6K74LTT">https://app.slack.com/client/TCH187HU3/C02S6K74LTT</a>
lucide: <a href="https://lucide.dev/icons/?focus=&amp;search=">https://lucide.dev/icons/?focus=&amp;search=</a>
google calendar: <a href="https://calendar.google.com/calendar/u/1/r/month">https://calendar.google.com/calendar/u/1/r/month</a>
sentry: <a href="https://knowt-app.sentry.io/issues/?project=6449878&amp;query=is%3Aunresolved%20issue.priority%3A%5Bhigh%2C%20medium%5D&amp;referrer=issue-list&amp;statsPeriod=14d&amp;stream_index=0">https://knowt-app.sentry.io/issues/?project=6449878&amp;query=is%3Aunresolved%20issue.priority%3A%5Bhigh%2C%20medium%5D&amp;referrer=issue-list&amp;statsPeriod=14d&amp;stream_index=0</a></p>
<p>Temp
test preview chat page <a href="http://localhost:3000/ai-media-note/1ff56a67-49cd-424d-8f82-f5528a6256d2?tab=Chat">http://localhost:3000/ai-media-note/1ff56a67-49cd-424d-8f82-f5528a6256d2?tab=Chat</a>
created note: <a href="http://localhost:3000/note/d1ffc462-e22d-4d5b-a973-1cb1b31b6981/Rainforest?tab=Chat">http://localhost:3000/note/d1ffc462-e22d-4d5b-a973-1cb1b31b6981/Rainforest?tab=Chat</a></p>
<p>Linear Me Now
flashcard edit screen: <a href="https://linear.app/knowt/issue/WEB-1465/new-flashcards-edit-screen-flow">https://linear.app/knowt/issue/WEB-1465/new-flashcards-edit-screen-flow</a>
mock for regular flow: <a href="https://www.figma.com/design/j5UWxHItBJ0ZowqqbAySff/Web?node-id=28851-15060&amp;m=dev">https://www.figma.com/design/j5UWxHItBJ0ZowqqbAySff/Web?node-id=28851-15060&amp;m=dev</a></p>
<p>Movies
myasiantv: <a href="https://myasiantv.ac/drama?selOrder=0&amp;selCat=0&amp;selCountry=2&amp;selYear=0&amp;btnFilter=Submit">https://myasiantv.ac/drama?selOrder=0&amp;selCat=0&amp;selCountry=2&amp;selYear=0&amp;btnFilter=Submit</a>
f2movies: <a href="https://www6.f2movies.to/home">https://www6.f2movies.to/home</a></p>
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
    content: TEMPLATE_CONTENT_0,
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

export const BOARD1: TBoard = {
    id: 'board-1',
    cards: [CARD1, CARD2],
    title: 'Latest',
}

export const BOARD2: TBoard = {
    id: 'board-2',
    cards: [CARD3],
    title: 'Todo',
}
