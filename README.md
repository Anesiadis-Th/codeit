# CodeIT

A web application for learning the C programming language through structured lessons, interactive exercises, and an in-browser compiler. Lessons are organized by topic, exercises are graded automatically, and user code is compiled and run against expected output.

Live: [code-it.gr](https://code-it.gr)

<!-- Add a screenshot here, e.g. ![Home](docs/home.png) -->

## Overview

CodeIT delivers C lessons as short, sequential steps. Each step is one of three exercise types: multiple choice, fill in the blank, or a code task whose output is compiled and compared to an expected result. Progress, experience points, levels, and daily streaks are stored per user. Content is available in English and Greek, and lessons can be authored through a built-in admin editor.

The frontend is a single-page React application. Authentication, the database, and authorization are handled by Supabase; C code is compiled and executed by the Judge0 API.

## Features

- Lessons grouped into sections (control flow, loops, functions, arrays, pointers, and more)
- Three exercise types: multiple choice, fill in the blank, and code tasks executed against expected output
- In-browser C compilation and execution via the Judge0 API
- Progress tracking with experience points, levels, and daily streaks
- Bilingual content (English and Greek) using react-i18next
- Authentication with Supabase (email and password, Google, GitHub) and anonymous guest access
- Admin lesson editor for creating lessons and exercises
- Responsive interface built with a small reusable component library

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React 19, React Router 7, Vite 6 |
| Styling | Tailwind CSS 4 |
| Backend, auth, database | Supabase (PostgreSQL, Auth, Row Level Security) |
| Code execution | Judge0 REST API (via RapidAPI) |
| Internationalization | react-i18next |
| Editor and highlighting | react-simple-code-editor, Prism |
| Icons | lucide-react |

## Project Structure

```
src/
├── assets/         Images and mascot illustrations
├── components/
│   ├── ui/         Reusable UI primitives (Button, Card, Input, Alert, ...)
│   ├── lesson/     Lesson screen subcomponents
│   ├── admin/      Admin editor subcomponents
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── ProtectedRoute.jsx
├── context/        Authentication provider
├── hooks/          useAuth, useLang, useUserStats
├── lib/            Supabase client and data services (lessons, progress, stats, code)
├── locales/        English and Greek translations
├── pages/          Route-level components
├── index.css       Tailwind theme and design tokens
└── main.jsx        Application entry point
```

Data access is isolated in `src/lib`: each service module wraps a single concern (lessons, progress, statistics, code submission, and the Judge0 client). Shared state and logic live in `src/context` and `src/hooks`. The Supabase schema includes `lessons`, `progress`, `user_stats`, `submissions`, and `profiles` tables, with Row Level Security enforcing per-user access.

## Getting Started

### Prerequisites

- Node.js 18 or later
- A Supabase project (URL and anon key)
- A Judge0 API key from RapidAPI

### Installation

```bash
git clone https://github.com/Anesiadis-Th/codeit.git
cd codeit
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_JUDGE0_API_KEY=your-rapidapi-judge0-key
```

These values are read at build time through Vite's `import.meta.env`. The `.env.local` file is git-ignored and should not be committed.

### Running Locally

```bash
npm run dev
```

The application is served at `http://localhost:5173` by default.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the production bundle to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Deployment

The application is a static single-page app and can be deployed to any static host. It is currently deployed on Netlify, with `public/_redirects` routing all paths to `index.html` for client-side routing. Set the three environment variables above in the hosting provider's configuration before building.

## Author

Theocharis Anesiadis
[GitHub](https://github.com/Anesiadis-Th) · [LinkedIn](https://www.linkedin.com/in/anesiadis-theocharis/)
