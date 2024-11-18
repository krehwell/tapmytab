import { TBoard, TCard, TLabel } from '../types'

const TEMPLATE_CONTENT_1 = `
<h2>New Feature Requirements</h2>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="false">Setup Next.js project</li>
<li data-type="taskItem" data-checked="false">Configure TypeScript</li>
<li data-type="taskItem" data-checked="false">Setup testing with <a href="https://jestjs.io">Jest</a></li>
</ul>
<p>Reference: <a href="https://nextjs.org/docs">Next.js Documentation</a></p>
<div class="meta">
<span>Lead: Sarah</span>
</div>
`

const TEMPLATE_CONTENT_2 = `
<h2>API Documentation</h2>
<p>Planning phase for our <strong>RESTful API endpoints</strong>.</p>
<ol>
<li>Authentication endpoints</li>
<li>User management</li>
<li>Content delivery</li>
<li>Analytics integration</li>
</ol>
<p><em>Priority: High - Initial planning needed</em></p>
`

const TEMPLATE_CONTENT_3 = `
<h2>In Progress: Design System Components</h2>
<blockquote>
<p>Currently implementing <strong>atomic design principles</strong></p>
</blockquote>
<ul>
<li>Atoms:
  <ul>
    <li>Buttons - In Review</li>
    <li>Inputs - WIP</li>
    <li>Icons - WIP</li>
  </ul>
</li>
<li>Molecules:
  <ul>
    <li>Form groups - Pending</li>
    <li>Search bars - Pending</li>
  </ul>
</li>
</ul>
`

const TEMPLATE_CONTENT_4 = `
<h2>Active: Performance Optimization</h2>
<pre><code class="language-typescript">// Currently implementing lazy loading
const MyComponent = dynamic(() => import('./MyComponent'), {
  loading: () => <LoadingSpinner />
})</code></pre>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="true">Initial performance audit</li>
<li data-type="taskItem" data-checked="false">Implement code splitting</li>
<li data-type="taskItem" data-checked="false">Optimize images</li>
</ul>
`

const TEMPLATE_CONTENT_5 = `
<h2>Done: Authentication System</h2>
<p><strong>Completed Deliverables:</strong></p>
<ol>
<li>Implemented JWT authentication</li>
<li>Added OAuth integration</li>
<li>Completed security testing</li>
</ol>
<p><em>Ready for deployment review</em></p>
`

const TEMPLATE_CONTENT_6 = `
<h2>Done: CSS Framework Migration</h2>
<blockquote>
<p><strong>Completed tasks:</strong></p>
</blockquote>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="true">Migrate to Tailwind CSS</li>
<li data-type="taskItem" data-checked="true">Update component styles</li>
<li data-type="taskItem" data-checked="true">Documentation update</li>
</ul>
`

const TEMPLATE_CONTENT_7 = `
<h2>In Progress: State Management Implementation</h2>
<p>Currently implementing <em>Redux Toolkit</em>:</p>
<ol>
<li><strong>Progress:</strong>
  <ul>
    <li>Store configuration ✓</li>
    <li>Basic reducers ✓</li>
    <li>Middleware setup - WIP</li>
  </ul>
</li>
<li><strong>Next Steps:</strong>
  <ul>
    <li>Implement async thunks</li>
    <li>Add error handling</li>
  </ul>
</li>
</ol>
`

const TEMPLATE_CONTENT_8 = `
<h2>To Do: Accessibility Implementation</h2>
<p><em>Required updates based on <a href="https://www.w3.org/WAI/WCAG21/quickref/">WCAG 2.1</a> guidelines:</em></p>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="false">Add ARIA labels</li>
<li data-type="taskItem" data-checked="false">Improve keyboard navigation</li>
<li data-type="taskItem" data-checked="false">Fix color contrast issues</li>
</ul>
`

// Card definitions with varied labels
export const CARD1: TCard = {
    id: 'card1',
    title: 'New Feature Setup',
    content: TEMPLATE_CONTENT_1,
    desc: 'Initial project setup tasks',
    label: TLabel.Red,
}

export const CARD2: TCard = {
    id: 'card2',
    title: 'API Planning',
    content: TEMPLATE_CONTENT_2,
    desc: 'Initial API architecture planning',
    label: TLabel.Blue,
}

export const CARD3: TCard = {
    id: 'card3',
    title: 'Design System Implementation',
    content: TEMPLATE_CONTENT_3,
    desc: 'In progress - Component development',
    label: TLabel.Yellow,
}

export const CARD4: TCard = {
    id: 'card4',
    title: 'Performance Optimization',
    content: TEMPLATE_CONTENT_4,
    desc: 'Active development',
    label: TLabel.Yellow,
}

export const CARD5: TCard = {
    id: 'card5',
    title: 'Authentication System',
    content: TEMPLATE_CONTENT_5,
    desc: 'Completed and ready for review',
    label: TLabel.Green,
}

export const CARD6: TCard = {
    id: 'card6',
    title: 'CSS Framework Migration',
    content: TEMPLATE_CONTENT_6,
    desc: 'Migration completed',
    label: TLabel.Green,
}

export const CARD7: TCard = {
    id: 'card7',
    title: 'State Management',
    content: TEMPLATE_CONTENT_7,
    desc: 'Redux implementation in progress',
    label: TLabel.Yellow,
}

export const CARD8: TCard = {
    id: 'card8',
    title: 'Accessibility Implementation',
    desc: 'Pending accessibility updates',
    content: TEMPLATE_CONTENT_8,
    label: TLabel.Blue,
}

// Board definitions with distributed cards
export const BOARD1: TBoard = {
    id: 'board1',
    cards: [CARD1, CARD2, CARD8],
    name: 'To Do',
}

export const BOARD2: TBoard = {
    id: 'board2',
    cards: [CARD3, CARD4, CARD7],
    name: 'In Progress',
}

export const BOARD3: TBoard = {
    id: 'board3',
    cards: [CARD5, CARD6],
    name: 'Done',
}
