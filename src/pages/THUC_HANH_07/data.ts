import { IPost, ITag, IUser, PostStatus } from './types';

export const seedTags: ITag[] = [
  { id: 'tag-1', name: 'React', color: '#61dafb', description: 'React library and ecosystem', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'tag-2', name: 'TypeScript', color: '#3178c6', description: 'TypeScript language', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'tag-3', name: 'CSS', color: '#e44d26', description: 'Styling and CSS techniques', createdAt: '2025-01-02T00:00:00Z' },
  { id: 'tag-4', name: 'Node.js', color: '#68a063', description: 'Server-side JavaScript', createdAt: '2025-01-03T00:00:00Z' },
  { id: 'tag-5', name: 'DevOps', color: '#f59e0b', description: 'CI/CD and infrastructure', createdAt: '2025-01-04T00:00:00Z' },
  { id: 'tag-6', name: 'UI/UX', color: '#8b5cf6', description: 'Design principles', createdAt: '2025-01-05T00:00:00Z' },
  { id: 'tag-7', name: 'Performance', color: '#ef4444', description: 'Web performance optimization', createdAt: '2025-01-06T00:00:00Z' },
  { id: 'tag-8', name: 'Tutorial', color: '#10b981', description: 'Step-by-step guides', createdAt: '2025-01-07T00:00:00Z' },
];

const mdReactHooks = `## Why React Hooks Changed Everything

React Hooks revolutionized how we write components. Before hooks, class components were the only way to manage state and lifecycle.

### useState - The Foundation

\`\`\`tsx
const [count, setCount] = useState(0);
\`\`\`

The simplest hook, yet incredibly powerful. It gives functional components the ability to hold and update state.

### useEffect - Side Effects Made Simple

\`\`\`tsx
useEffect(() => {
  document.title = \`Count: \${count}\`;
  return () => {  };
}, [count]);
\`\`\`

### Custom Hooks - Reusable Logic

The real power comes from **custom hooks**. Extract logic into reusable functions:

\`\`\`tsx
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const handler = () => setSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return size;
}
\`\`\`

> Hooks are not just a feature — they are a paradigm shift in React development.`;

const mdTypeScript = `## TypeScript Best Practices for 2025

TypeScript has become the standard for modern web development. Here are essential patterns every developer should know.

### Strict Mode Configuration

Always enable strict mode in your \`tsconfig.json\`:

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
\`\`\`

### Discriminated Unions

\`\`\`typescript
type Result<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function handleResult(result: Result<string>) {
  if (result.status === 'success') {
    console.log(result.data);
  }
}
\`\`\`

### Utility Types

- \`Partial<T>\` — makes all properties optional
- \`Required<T>\` — makes all properties required
- \`Pick<T, K>\` — selects specific properties
- \`Omit<T, K>\` — removes specific properties

> Type safety is not overhead — it is an investment in code quality.`;

const mdCssGrid = `## Mastering CSS Grid Layout

CSS Grid is the most powerful layout system in CSS. Let's explore advanced patterns.

### Basic Grid Setup

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}
\`\`\`

### Named Grid Areas

\`\`\`css
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 260px 1fr;
}
\`\`\`

### Responsive Without Media Queries

The \`auto-fill\` and \`minmax()\` combination creates responsive layouts without a single media query.

| Property | Use Case |
|----------|----------|
| \`auto-fill\` | Fill row with as many tracks as possible |
| \`auto-fit\` | Same as auto-fill but collapses empty tracks |
| \`minmax()\` | Set minimum and maximum track sizes |

> CSS Grid eliminates the need for most CSS frameworks.`;

const mdNodeApi = `## Building REST APIs with Node.js and Express

A practical guide to creating production-ready APIs.

### Project Structure

\`\`\`
src/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
└── app.ts
\`\`\`

### Middleware Pattern

\`\`\`typescript
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
};
\`\`\`

### Error Handling

Always implement a global error handler to catch unhandled errors gracefully.

> A well-structured API is the backbone of any modern application.`;

const mdRedux = `## Redux Toolkit: Modern State Management

Redux Toolkit (RTK) simplifies Redux development dramatically.

### Creating a Slice

\`\`\`typescript
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value -= 1; },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});
\`\`\`

### RTK Query

RTK Query is a powerful data fetching and caching tool built on top of Redux Toolkit.

### Best Practices

1. **Normalize state** — use entity adapters
2. **Keep slices focused** — one slice per feature
3. **Use selectors** — memoize derived data
4. **Avoid side effects in reducers** — use middleware

> RTK makes Redux bearable, even enjoyable.`;

const mdDocker = `## Docker for Frontend Developers

Understanding Docker is essential for modern development workflows.

### Dockerfile for React

\`\`\`dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
\`\`\`

### Docker Compose

\`\`\`yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:80"
  api:
    image: node:18-alpine
    ports:
      - "8080:8080"
\`\`\`

### Key Concepts

- **Images** — read-only templates
- **Containers** — running instances of images
- **Volumes** — persistent data storage
- **Networks** — communication between containers

> Docker ensures your app works the same everywhere.`;

const mdDesign = `## UI Design Principles for Developers

Great design is not about making things pretty — it is about making things work.

### Visual Hierarchy

1. **Size** — larger elements draw attention first
2. **Color** — high contrast elements stand out
3. **Spacing** — whitespace creates breathing room
4. **Typography** — font weight guides the eye

### The 8px Grid System

All spacing should be multiples of 8px:
- \`8px\` — tight spacing
- \`16px\` — default spacing
- \`24px\` — comfortable spacing
- \`32px\` — section spacing

### Color Theory

| Purpose | Recommended |
|---------|-------------|
| Primary | One brand color |
| Neutral | Grays for text and borders |
| Semantic | Green/Red/Yellow for states |

### Accessibility

- Minimum contrast ratio: 4.5:1 for text
- Focus indicators for keyboard navigation
- Semantic HTML over div soup

> Design is how it works, not just how it looks — Steve Jobs`;

const mdPerfTips = `## Web Performance Optimization Guide

Performance directly impacts user experience and business metrics.

### Core Web Vitals

- **LCP** (Largest Contentful Paint) — under 2.5s
- **FID** (First Input Delay) — under 100ms
- **CLS** (Cumulative Layout Shift) — under 0.1

### Image Optimization

\`\`\`html
<img
  src="photo.webp"
  srcset="photo-400.webp 400w, photo-800.webp 800w"
  sizes="(max-width: 600px) 400px, 800px"
  loading="lazy"
  alt="Description"
/>
\`\`\`

### Code Splitting

\`\`\`typescript
const HeavyComponent = React.lazy(
  () => import('./HeavyComponent')
);
\`\`\`

### Bundle Analysis

Use tools like \`webpack-bundle-analyzer\` to identify oversized dependencies.

> Every millisecond counts — optimize relentlessly.`;

const mdReactPatterns = `## Advanced React Patterns

Level up your React architecture with these proven patterns.

### Compound Components

\`\`\`tsx
<Select>
  <Select.Option value="a">Option A</Select.Option>
  <Select.Option value="b">Option B</Select.Option>
</Select>
\`\`\`

### Render Props

\`\`\`tsx
<DataFetcher url="/api/users">
  {({ data, loading }) =>
    loading ? <Spinner /> : <UserList users={data} />
  }
</DataFetcher>
\`\`\`

### Higher-Order Components

\`\`\`tsx
function withAuth<P>(Component: React.ComponentType<P>) {
  return function AuthWrapper(props: P) {
    const isAuth = useAuth();
    if (!isAuth) return <Redirect to="/login" />;
    return <Component {...props} />;
  };
}
\`\`\`

### Custom Hook Pattern

Extract business logic into hooks for maximum reusability.

> Patterns are tools — choose the right one for each problem.`;

const mdTesting = `## Testing React Applications

A comprehensive testing strategy ensures code reliability.

### Testing Pyramid

1. **Unit Tests** — fast, isolated, many
2. **Integration Tests** — components working together
3. **E2E Tests** — full user flows, few

### React Testing Library

\`\`\`tsx
test('renders greeting', () => {
  render(<Greeting name="World" />);
  expect(screen.getByText('Hello, World!')).toBeInTheDocument();
});
\`\`\`

### Testing Hooks

\`\`\`tsx
test('useCounter increments', () => {
  const { result } = renderHook(() => useCounter());
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
});
\`\`\`

### Best Practices

- Test behavior, not implementation
- Use data-testid sparingly
- Mock external dependencies
- Write tests that resemble user interactions

> Tests are not overhead — they are documentation that verifies itself.`;

const mdGit = `## Git Workflow for Teams

A solid Git workflow prevents chaos in collaborative development.

### Branch Strategy

\`\`\`
main ─── develop ─── feature/xyz
              └──── bugfix/abc
              └──── release/1.0
\`\`\`

### Conventional Commits

\`\`\`
feat(auth): add OAuth2 login flow
fix(api): handle timeout errors gracefully
docs(readme): update installation guide
refactor(utils): simplify date formatting
\`\`\`

### Interactive Rebase

\`\`\`bash
git rebase -i HEAD~3
# pick, squash, reword, drop
\`\`\`

### Code Review Checklist

- Does it solve the stated problem?
- Are edge cases handled?
- Is the code readable without comments?
- Are there tests?

> Good Git hygiene saves hours of debugging.`;

const mdResponsive = `## Responsive Design in 2025

Modern responsive design goes beyond media queries.

### Container Queries

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card { flex-direction: row; }
}
\`\`\`

### Fluid Typography

\`\`\`css
h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
}
\`\`\`

### Modern Breakpoints

| Device | Width |
|--------|-------|
| Mobile | < 768px |
| Tablet | 768px - 1024px |
| Desktop | > 1024px |

### Mobile-First Approach

Start with the mobile layout, then enhance for larger screens:

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
\`\`\`

> Design for the smallest screen first, then scale up.`;

export const seedPosts: IPost[] = [
  {
    id: 'post-1', title: 'Mastering React Hooks in 2025', slug: 'mastering-react-hooks-2025',
    excerpt: 'A deep dive into React Hooks — from useState to custom hooks that supercharge your components.',
    content: mdReactHooks, coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    tagIds: ['tag-1', 'tag-8'], status: PostStatus.PUBLISHED, viewCount: 245,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2025-03-15T08:00:00Z',
  },
  {
    id: 'post-2', title: 'TypeScript Best Practices', slug: 'typescript-best-practices',
    excerpt: 'Essential TypeScript patterns every developer should know for writing safer, more maintainable code.',
    content: mdTypeScript, coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
    tagIds: ['tag-2', 'tag-8'], status: PostStatus.PUBLISHED, viewCount: 189,
    createdAt: '2025-03-10T10:00:00Z', updatedAt: '2025-03-10T10:00:00Z',
  },
  {
    id: 'post-3', title: 'CSS Grid Layout Mastery', slug: 'css-grid-layout-mastery',
    excerpt: 'Unlock the full potential of CSS Grid with advanced patterns and responsive techniques.',
    content: mdCssGrid, coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80',
    tagIds: ['tag-3', 'tag-6'], status: PostStatus.PUBLISHED, viewCount: 156,
    createdAt: '2025-03-05T09:00:00Z', updatedAt: '2025-03-05T09:00:00Z',
  },
  {
    id: 'post-4', title: 'Building REST APIs with Node.js', slug: 'building-rest-apis-nodejs',
    excerpt: 'A practical guide to creating production-ready REST APIs with Express and TypeScript.',
    content: mdNodeApi, coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    tagIds: ['tag-4', 'tag-2'], status: PostStatus.PUBLISHED, viewCount: 312,
    createdAt: '2025-02-28T11:00:00Z', updatedAt: '2025-02-28T11:00:00Z',
  },
  {
    id: 'post-5', title: 'Redux Toolkit Deep Dive', slug: 'redux-toolkit-deep-dive',
    excerpt: 'Modern state management with Redux Toolkit — slices, thunks, and RTK Query explained.',
    content: mdRedux, coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    tagIds: ['tag-1', 'tag-2'], status: PostStatus.PUBLISHED, viewCount: 198,
    createdAt: '2025-02-20T14:00:00Z', updatedAt: '2025-02-20T14:00:00Z',
  },
  {
    id: 'post-6', title: 'Docker for Frontend Developers', slug: 'docker-frontend-developers',
    excerpt: 'Essential Docker knowledge for frontend developers — containers, images, and deployment.',
    content: mdDocker, coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80',
    tagIds: ['tag-5', 'tag-8'], status: PostStatus.PUBLISHED, viewCount: 134,
    createdAt: '2025-02-15T16:00:00Z', updatedAt: '2025-02-15T16:00:00Z',
  },
  {
    id: 'post-7', title: 'UI Design Principles for Devs', slug: 'ui-design-principles-devs',
    excerpt: 'Learn fundamental design principles that will make your UIs stand out.',
    content: mdDesign, coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    tagIds: ['tag-6', 'tag-3'], status: PostStatus.PUBLISHED, viewCount: 267,
    createdAt: '2025-02-10T09:00:00Z', updatedAt: '2025-02-10T09:00:00Z',
  },
  {
    id: 'post-8', title: 'Web Performance Optimization', slug: 'web-performance-optimization',
    excerpt: 'Comprehensive guide to optimizing web performance — Core Web Vitals and beyond.',
    content: mdPerfTips, coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    tagIds: ['tag-7', 'tag-1'], status: PostStatus.PUBLISHED, viewCount: 178,
    createdAt: '2025-02-05T13:00:00Z', updatedAt: '2025-02-05T13:00:00Z',
  },
  {
    id: 'post-9', title: 'Advanced React Patterns', slug: 'advanced-react-patterns',
    excerpt: 'Compound components, render props, and HOCs — patterns for scalable React apps.',
    content: mdReactPatterns, coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    tagIds: ['tag-1', 'tag-7'], status: PostStatus.PUBLISHED, viewCount: 221,
    createdAt: '2025-01-30T10:00:00Z', updatedAt: '2025-01-30T10:00:00Z',
  },
  {
    id: 'post-10', title: 'Testing React Applications', slug: 'testing-react-applications',
    excerpt: 'Build confidence in your code with a comprehensive React testing strategy.',
    content: mdTesting, coverImage: 'https://images.unsplash.com/photo-1576836165612-8bc9b07e7778?w=800&q=80',
    tagIds: ['tag-1', 'tag-2', 'tag-8'], status: PostStatus.PUBLISHED, viewCount: 145,
    createdAt: '2025-01-25T08:00:00Z', updatedAt: '2025-01-25T08:00:00Z',
  },
  {
    id: 'post-11', title: 'Git Workflow for Teams', slug: 'git-workflow-teams',
    excerpt: 'Establish a solid Git workflow with conventional commits and code review best practices.',
    content: mdGit, coverImage: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&q=80',
    tagIds: ['tag-5', 'tag-8'], status: PostStatus.DRAFT, viewCount: 0,
    createdAt: '2025-01-20T15:00:00Z', updatedAt: '2025-01-20T15:00:00Z',
  },
  {
    id: 'post-12', title: 'Responsive Design in 2025', slug: 'responsive-design-2025',
    excerpt: 'Modern responsive techniques — container queries, fluid typography, and mobile-first.',
    content: mdResponsive, coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    tagIds: ['tag-3', 'tag-6', 'tag-8'], status: PostStatus.PUBLISHED, viewCount: 203,
    createdAt: '2025-01-15T11:00:00Z', updatedAt: '2025-01-15T11:00:00Z',
  },
];

export const seedUser: IUser = {
  name: 'Nguyen Dev',
  title: 'Senior Frontend Developer & BrSE',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
  bio: 'Passionate about building beautiful, performant web applications. 5+ years of experience with React, TypeScript, and modern frontend tooling. Currently working as a Bridge System Engineer, connecting development teams across cultures.',
  skills: ['React', 'TypeScript', 'Node.js', 'Redux', 'Ant Design', 'Docker', 'CI/CD', 'Agile/Scrum', 'Japanese (N2)', 'System Design'],
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com', icon: 'github' },
    { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
    { platform: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
    { platform: 'Email', url: 'mailto:dev@example.com', icon: 'mail' },
  ],
};
