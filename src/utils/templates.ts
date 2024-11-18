import { TBoard, TCard, TLabel } from '../types'

const TEMPLATE_CONTENT_1 = `
<h2>Frontend Development Plan</h2>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="true">Setup Next.js project</li>
<li data-type="taskItem" data-checked="true">Configure TypeScript</li>
<li data-type="taskItem" data-checked="false">Setup testing with <a href="https://jestjs.io">Jest</a></li>
</ul>
<p>Reference: <a href="https://nextjs.org/docs">Next.js Documentation</a></p>
<div class="meta">
<span>Lead: Sarah</span>
</div>
`

const TEMPLATE_CONTENT_2 = `
<h2>API Documentation</h2>
<p>Review needed for our <strong>RESTful API endpoints</strong>.</p>
<ol>
<li>Authentication endpoints</li>
<li>User management</li>
<li>Content delivery</li>
<li>Analytics integration</li>
</ol>
<p><em>Priority: High - Needed before sprint review</em></p>
`

const TEMPLATE_CONTENT_3 = `
<h2>Design System Components</h2>
<blockquote>
<p>All components must follow <strong>atomic design principles</strong></p>
</blockquote>
<ul>
<li>Atoms:
  <ul>
    <li>Buttons</li>
    <li>Inputs</li>
    <li>Icons</li>
  </ul>
</li>
<li>Molecules:
  <ul>
    <li>Form groups</li>
    <li>Search bars</li>
  </ul>
</li>
</ul>
`

const TEMPLATE_CONTENT_4 = `
<h2>Performance Optimization</h2>
<pre><code class="language-typescript">// Implement lazy loading
const MyComponent = dynamic(() => import('./MyComponent'), {
  loading: () => <LoadingSpinner />
})</code></pre>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="false">Implement code splitting</li>
<li data-type="taskItem" data-checked="false">Optimize images</li>
<li data-type="taskItem" data-checked="false">Add caching strategy</li>
</ul>
`

const TEMPLATE_CONTENT_5 = `
<h2>Weekly Team Updates</h2>
<p><strong>Key Achievements:</strong></p>
<ol>
<li>Launched new authentication system</li>
<li>Reduced bundle size by 45%</li>
<li>Completed user testing phase</li>
</ol>
<p><em>Next steps will be discussed in the <a href="https://meet.google.com">team meeting</a></em></p>
`

const TEMPLATE_CONTENT_6 = `
<h2>Bug Fixes Required</h2>
<blockquote>
<p><strong>Critical issues</strong> found in production:</p>
</blockquote>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="false">Fix memory leak in dashboard</li>
<li data-type="taskItem" data-checked="false">Resolve authentication timeout</li>
<li data-type="taskItem" data-checked="false">Address Safari-specific CSS issues</li>
</ul>
`

const TEMPLATE_CONTENT_7 = `
<h2>Research Findings</h2>
<p>Analysis of <em>state management solutions</em>:</p>
<ol>
<li><strong>Redux Toolkit</strong>
  <ul>
    <li>Pros: TypeScript support, less boilerplate</li>
    <li>Cons: Learning curve</li>
  </ul>
</li>
<li><strong>Zustand</strong>
  <ul>
    <li>Pros: Lightweight, simple API</li>
    <li>Cons: Less ecosystem support</li>
  </ul>
</li>
</ol>
`

const TEMPLATE_CONTENT_8 = `
<h2>Accessibility Audit</h2>
<p><em>Required updates based on <a href="https://www.w3.org/WAI/WCAG21/quickref/">WCAG 2.1</a> guidelines:</em></p>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="true">Add ARIA labels</li>
<li data-type="taskItem" data-checked="false">Improve keyboard navigation</li>
<li data-type="taskItem" data-checked="false">Fix color contrast issues</li>
</ul>
`

// Card definitions with varied labels
export const CARD1: TCard = {
    id: 'card1',
    title: 'Frontend Setup',
    content: TEMPLATE_CONTENT_1,
    desc: 'a setup made with crxjs',
    label: TLabel.Blue,
}

export const CARD2: TCard = {
    id: 'card2',
    title: 'API Documentation',
    content: TEMPLATE_CONTENT_2,
}

export const CARD3: TCard = {
    id: 'card3',
    title: 'Design System',
    content: TEMPLATE_CONTENT_3,
    desc: 'Design system review required',
    label: TLabel.Red,
}

export const CARD4: TCard = {
    id: 'card4',
    title: 'Performance',
    content: TEMPLATE_CONTENT_4,
    desc: 'Needed before sprint review',
    label: TLabel.Yellow,
}

export const CARD5: TCard = {
    id: 'card5',
    title: 'Team Updates',
    content: TEMPLATE_CONTENT_5,
    label: TLabel.Green,
}

export const CARD6: TCard = {
    id: 'card6',
    title: 'Bug Fixes',
    content: TEMPLATE_CONTENT_6,
    label: TLabel.Red,
}

export const CARD7: TCard = {
    id: 'card7',
    title: 'State Management Research',
    content: TEMPLATE_CONTENT_7,
}

export const CARD8: TCard = {
    id: 'card8',
    title: 'Accessibility',
    desc: 'Accessibility audit required',
    content: TEMPLATE_CONTENT_8,
}

// Board definitions with distributed cards
export const BOARD1: TBoard = {
    id: 'board1',
    cards: [CARD1, CARD2, CARD8],
    name: 'Todo List',
}

export const BOARD2: TBoard = {
    id: 'board2',
    cards: [CARD3, CARD4, CARD7],
    name: 'In Learning',
}

export const BOARD3: TBoard = {
    id: 'board3',
    cards: [CARD5, CARD6],
    name: 'Backlog',
}
