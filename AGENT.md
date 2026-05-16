# AGENT.md — ThreadHive Frontend

## Project Overview

ThreadHive is a Reddit-like forum application. This repository is the **frontend**, built with React 19 and Vite. It communicates with a backend API running at `http://localhost:3001/api`.

## Tech Stack

- **Framework:** React 19 (JSX, no TypeScript)
- **Build Tool:** Vite 6
- **Routing:** React Router v7 (`react-router-dom`)
- **UI:** React Bootstrap 2 + Bootstrap 5, Bootstrap Icons
- **State Management:** React Context API (`AuthContext`)
- **HTTP Client:** Custom `fetchAPI` wrapper around `fetch` (see `src/api/apiClient.js`)
- **Linting:** ESLint 9 with `react-hooks` and `react-refresh` plugins

## Commands

- `npm run dev` — Start dev server (default: http://localhost:5173)
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint


## Auth

The AuthContext is central store for datat about the current user. Alway use the `useAuth()` hook to access and control the current user and their token. Do not use localstorage directly. Access data about the current user with `user` and `token` proerties from `useAuth()` and control teh current user with `loginuser` `logout` and `update user` functions from `useAuth()`

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  App.jsx (BrowserRouter + AuthProvider)           │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  Header ──── Navbar (Login/Logout/Register) │  │  │
│  │  ├─────────────────────────────────────────────┤  │  │
│  │  │  Routes                                     │  │  │
│  │  │  ├── /login ────────► Login page            │  │  │
│  │  │  ├── /register ────► Register page          │  │  │
│  │  │  ├── /home ────────► Home (PrivateRoute)    │  │  │
│  │  │  │                    └► ThreadList          │  │  │
│  │  │  │                       └► ThreadCard      │  │  │
│  │  │  └── /thread/:id ─► ThreadPage (Private)    │  │  │
│  │  │                      ├► ThreadCard          │  │  │
│  │  │                      ├► CommentForm         │  │  │
│  │  │                      └► CommentList         │  │  │
│  │  ├─────────────────────────────────────────────┤  │  │
│  │  │  Footer                                     │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           │
                    Data Flow (fetch)
                           │
┌──────────────────────────▼──────────────────────────────┐
│  Services Layer (src/services/)                         │
│  authService ─┐                                         │
│  threadService┼──► fetchAPI (src/api/apiClient.js)      │
│  commentService┘   ├─ Adds Authorization: Bearer header │
│                    └─ Base URL: http://localhost:3001/api│
└──────────────────────────┬──────────────────────────────┘
                           │
                    HTTP (JSON REST)
                           │
┌──────────────────────────▼──────────────────────────────┐
│  Backend API  (localhost:3001)                           │
│  /api/auth/login, /api/auth/register                    │
│  /api/threads, /api/threads/:id, /api/threads/:id/upvote│
│  /api/comments/:threadId, POST /api/comments            │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Auth flow:** Login/Register pages → `authService` → backend `/api/auth/*` → JWT token stored in `localStorage` → `AuthContext` provides `token` and `user` to all components.
2. **Protected routes:** `PrivateRoute` reads `token` from `AuthContext`; redirects to `/login` if absent.
3. **Thread flow:** `Home` page calls `threadService.fetchRecentThreads()` on mount → renders `ThreadList` → each `ThreadCard` links to `/thread/:id`.
4. **Thread detail:** `ThreadPage` fetches thread + comments in parallel via `Promise.all` → renders `ThreadCard`, `CommentForm`, and `CommentList`.
5. **Voting:** `VoteButtons` (shared component) calls `threadService.upvoteThread/downvoteThread` → parent updates local state via `onVoteUpdate` callback.
6. **API client:** All HTTP calls go through `fetchAPI` which auto-attaches the JWT header and provides uniform error handling.

### State Management

- **Global state:** `AuthContext` (token, user, loginUser, logout, updateUser) — React Context + `localStorage` persistence.
- **Local state:** Each page manages its own data via `useState` + `useEffect` (no Redux/Zustand).

## Project Structure

```
src/
├── api/apiClient.js          # fetchAPI utility (base URL, auth headers, error handling)
├── config/apiConfig.js       # API endpoint constants (AUTH_API, THREAD_API, COMMENT_API, etc.)
├── context/AuthContext.jsx   # Auth provider: token, user, loginUser, logout, updateUser
├── components/               # Reusable UI components
│   ├── Header/               # App header with navigation
│   ├── Footer/               # App footer
│   ├── Comment/              # CommentForm, CommentList
│   ├── Forms/                # CreateThreadForm
│   ├── PrivateRoute/         # Auth-guarded route wrapper
│   ├── Shared/               # VoteButtons
│   └── ThreadList/           # ThreadCard, ThreadList
├── pages/
│   ├── Auth/                 # Login, Register pages
│   └── User/                 # Home (feed), ThreadPage
├── services/                 # API service modules (authService, threadService, etc.)
└── utils/handleApiError.js   # Shared error handler
```

## Key Conventions

- **Component files** are `.jsx` in PascalCase folders matching the component name.
- **CSS** is co-located with components (e.g., `Header.css` next to `Header.jsx`).
- **API endpoints** are defined as constants in `src/config/apiConfig.js`; services in `src/services/` call `fetchAPI` with those constants.
- **Authentication** uses JWT tokens stored in `localStorage`; the `fetchAPI` client attaches the `Authorization: Bearer` header automatically.
- **Routing** is in `src/App.jsx`; protected routes use the `<PrivateRoute>` wrapper.
- **Vite proxy** forwards `/api` requests to `http://localhost:3001` in development.

## Development Notes

- The backend must be running on port **3001** for API calls to work.
- No TypeScript — all source files are plain `.js` or `.jsx`.
- ESLint ignores unused variables that start with an uppercase letter or underscore.
