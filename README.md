# Comet AI 
# Production-Ready Comet AI Agentic Browser

## Project Overview
Create a full-scale, production-ready AI-powered agentic browser called "Comet AI" that combines traditional web browsing with intelligent AI automation. The browser should allow users to delegate complex multi-step tasks to AI agents that can navigate websites, extract information, compare data, and complete actions autonomously.

---

## Core Requirements

### 1. Technology Stack
- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS v3+ with custom design system
- **State Management**: Zustand or Redux Toolkit
- **Routing**: React Router v6
- **Build Tool**: Vite
- **UI Components**: Headless UI or Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod validation

### 2. Browser Core Features

#### 2.1 Traditional Browser Functionality
- **Multi-tab Management**: 
  - Create, close, switch between tabs
  - Tab preview on hover
  - Drag and drop tab reordering
  - Pin/unpin tabs
  - Tab groups with color coding

- **Navigation Controls**:
  - Back/forward with gesture support
  - Refresh with loading states
  - Stop loading
  - Home button
  - URL bar with autocomplete
  - Search engine integration (Google, DuckDuckGo, Bing)

- **Bookmarks System**:
  - Add/remove bookmarks
  - Bookmark folders and organization
  - Bookmark bar toggle
  - Import/export bookmarks
  - Bookmark sync (local storage initially)

- **History Management**:
  - Browse history with search
  - Clear history options
  - Recently closed tabs
  - Most visited sites

- **Downloads Manager**:
  - Download progress tracking
  - Pause/resume downloads
  - Download history
  - Open file location

#### 2.2 AI Agent Features

##### Core AI Capabilities
- **Natural Language Interface**:
  - Chat-style AI command interface
  - Voice input support (Web Speech API)
  - Context-aware suggestions
  - Multi-turn conversations

- **Autonomous Browsing Agents**:
  - **Research Agent**: Gather information across multiple sources
  - **Shopping Agent**: Compare prices, find deals, track availability
  - **Booking Agent**: Handle reservations, appointments, tickets
  - **Data Extraction Agent**: Scrape structured data from websites
  - **Automation Agent**: Fill forms, click buttons, navigate flows
  - **Summarization Agent**: Create concise summaries of long content

##### Agent Execution System
- **Task Planning**: Break down complex requests into steps
- **Multi-site Navigation**: Visit multiple websites in sequence
- **Data Persistence**: Store extracted data in structured format
- **Progress Tracking**: Real-time status updates with visual progress
- **Error Handling**: Retry logic and fallback strategies
- **Human-in-the-loop**: Ask for confirmation on critical actions

##### AI Models Integration
- **Primary**: Anthropic Claude API integration
- **Fallback**: OpenAI GPT-4 API support
- **Local Option**: Ollama integration for privacy-focused users
- **Vision**: GPT-4 Vision or Claude 3 for screenshot analysis

### 3. UI/UX Design System

#### 3.1 Visual Design
- **Color Palette**:
  ```
  Primary: Purple (#A855F7) to Pink (#EC4899) gradient
  Background: Dark slate (#0F172A, #1E1B4B)
  Surface: Black with opacity (rgba(0,0,0,0.4))
  Text: White with varying opacity
  Accent: Cyan (#06B6D4), Blue (#3B82F6)
  Success: Green (#10B981)
  Warning: Amber (#F59E0B)
  Error: Red (#EF4444)
  ```

- **Typography**:
  - Primary: Inter or DM Sans
  - Monospace: Fira Code (for code/technical content)
  - Font sizes: 12px-48px with responsive scaling

- **Glassmorphism Effects**:
  - Backdrop blur on all panels
  - Subtle borders with white/10 opacity
  - Layered transparency for depth

#### 3.2 Layout Structure
- **Desktop Layout**:
  - Top: Tab bar + navigation controls + URL bar
  - Left Sidebar (collapsible): Bookmarks, History, AI Agents
  - Main: Browser viewport / AI chat interface
  - Right Sidebar (collapsible): AI assistant, tools
  - Bottom: Status bar with progress indicators

- **Mobile Layout**:
  - Responsive hamburger menu
  - Bottom navigation bar
  - Full-screen AI mode toggle
  - Swipe gestures for navigation

#### 3.3 Interactive Elements
- **Buttons**: Rounded corners, hover states, ripple effects
- **Inputs**: Glassmorphic with focus rings, icon support
- **Cards**: Elevated with hover animations
- **Modals**: Centered with backdrop blur
- **Tooltips**: Context-sensitive help
- **Loading States**: Skeleton screens and spinners

### 4. Key Pages/Views

#### 4.1 Home/New Tab Page
- AI-powered quick actions grid
- Recently visited sites (visual thumbnails)
- Trending AI tasks
- Personalized recommendations
- Search bar with AI toggle
- Background: Animated gradient or particles

#### 4.2 Browser View
- Web content iframe or webview
- Overlay controls (fade on scroll)
- Mini AI assistant (bottom right corner)
- Reading mode toggle
- Screenshot tool
- Translate page option

#### 4.3 AI Command Center
- **Chat Interface**:
  - Message history
  - Streaming responses
  - Code blocks with syntax highlighting
  - Markdown rendering
  - Image preview
  
- **Agent Dashboard**:
  - Active agents list
  - Task queue
  - Completed tasks history
  - Agent performance metrics
  
- **Templates Library**:
  - Pre-built agent workflows
  - Custom workflow builder
  - Share workflows with community

#### 4.4 Settings Panel
- **General**: Theme, language, default search engine
- **Privacy**: Cookie settings, tracking protection, history
- **AI Settings**: Model selection, API keys, temperature
- **Appearance**: Customize colors, layout, density
- **Shortcuts**: Keyboard shortcuts configuration
- **Advanced**: Developer tools, experimental features

### 5. Advanced Features

#### 5.1 AI-Powered Tools
- **Smart Autofill**: AI predicts and fills forms
- **Content Summarization**: TL;DR for any webpage
- **Translation**: Real-time page translation
- **Ad Blocking**: AI-powered content filtering
- **Privacy Protection**: Tracker blocking, fingerprint protection
- **Screenshot + OCR**: Extract text from images

#### 5.2 Productivity Features
- **Workspaces**: Group related tabs by project
- **Session Manager**: Save and restore browsing sessions
- **Notes Integration**: Take notes linked to webpages
- **Calendar Integration**: AI extracts dates and creates events
- **Task Extraction**: Convert web content to todo items

#### 5.3 Developer Tools
- **Console**: JavaScript console access
- **Network Monitor**: Track requests/responses
- **Elements Inspector**: Basic DOM inspection
- **Storage Viewer**: View cookies, localStorage, etc.

### 6. Data Architecture

#### 6.1 State Management Structure
```typescript
interface BrowserState {
  tabs: Tab[];
  activeTabId: string;
  bookmarks: Bookmark[];
  history: HistoryItem[];
  downloads: Download[];
  settings: Settings;
  aiAgents: AIAgent[];
  user: User;
}

interface Tab {
  id: string;
  url: string;
  title: string;
  favicon: string;
  loading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  isPinned: boolean;
  groupId?: string;
}

interface AIAgent {
  id: string;
  type: AgentType;
  status: 'idle' | 'planning' | 'executing' | 'completed' | 'error';
  task: string;
  steps: AgentStep[];
  results: any[];
  progress: number;
}
```

#### 6.2 Local Storage Strategy
- IndexedDB for large data (history, bookmarks, downloads)
- LocalStorage for settings and preferences
- SessionStorage for temporary agent data
- Cache API for offline support

### 7. Security & Privacy

#### 7.1 Security Features
- Content Security Policy (CSP) headers
- HTTPS enforcement
- Sandboxed iframe execution
- XSS protection
- Input sanitization
- Secure API key storage (never exposed to client)

#### 7.2 Privacy Features
- Incognito/Private mode
- Do Not Track header
- Cookie management
- Third-party cookie blocking
- Clear browsing data options
- No telemetry by default

### 8. Performance Optimization

#### 8.1 Code Splitting
- Route-based code splitting
- Lazy load heavy components
- Dynamic imports for AI features
- Separate bundles for extensions

#### 8.2 Rendering Optimization
- Virtual scrolling for large lists
- Memoization of expensive computations
- Debounced search inputs
- Throttled scroll handlers
- Image lazy loading

#### 8.3 Caching Strategy
- Service Worker for offline support
- Cache-first strategy for static assets
- Network-first for dynamic content
- Stale-while-revalidate for API calls

### 9. Accessibility (WCAG 2.1 AA)
- Keyboard navigation throughout
- Screen reader support (ARIA labels)
- Focus indicators
- Color contrast compliance
- Reduced motion option
- Text resizing support

### 10. Testing Requirements
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Playwright or Cypress
- **E2E Tests**: Critical user flows
- **Performance Tests**: Lighthouse CI
- **Accessibility Tests**: axe-core

### 11. Deployment Considerations
- Environment variables for API keys
- CI/CD pipeline configuration
- Error tracking (Sentry integration)
- Analytics (optional, privacy-respecting)
- Progressive Web App (PWA) support
- Cross-browser compatibility

---

## Implementation Priorities

### Phase 1: MVP (Weeks 1-2)
1. Basic browser UI with single tab
2. URL navigation and rendering
3. Bookmark system (CRUD operations)
4. Simple AI chat interface
5. Integration with Claude/GPT API
6. Basic agent: Research assistant

### Phase 2: Core Features (Weeks 3-4)
1. Multi-tab management
2. History tracking
3. Downloads manager
4. Multiple AI agents (Shopping, Booking)
5. Agent execution pipeline
6. Settings panel

### Phase 3: Advanced Features (Weeks 5-6)
1. Workspaces and tab groups
2. Advanced AI tools (summarization, translation)
3. Developer tools
4. Performance optimizations
5. Mobile responsive design
6. PWA implementation

### Phase 4: Polish (Week 7+)
1. Animations and micro-interactions
2. Comprehensive testing
3. Documentation
4. Accessibility improvements
5. Bug fixes and optimization
6. Production deployment

---

## Bolt.new Specific Instructions

When you receive this prompt:

1. **Start with scaffolding**: Set up Vite + React + TypeScript + Tailwind
2. **Install dependencies**: All packages mentioned in tech stack
3. **Create folder structure**:
   ```
   src/
   ├── components/
   │   ├── browser/
   │   ├── ai/
   │   ├── ui/
   │   └── layout/
   ├── hooks/
   ├── stores/
   ├── services/
   ├── types/
   ├── utils/
   └── styles/
   ```

4. **Implement incrementally**: Build feature by feature, test as you go
5. **Use placeholder data**: Mock API responses initially
6. **Prioritize working code**: Focus on functionality first, polish later
7. **Add comments**: Explain complex logic and AI integration points
8. **Handle errors gracefully**: Show user-friendly error messages
9. **Make it responsive**: Mobile-first approach
10. **Keep it modular**: Reusable components and utilities
