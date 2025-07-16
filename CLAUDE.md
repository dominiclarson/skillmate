# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SkillMate is a skill-sharing platform built with Next.js 15, allowing users to connect and exchange skills. The project is organized as a monorepo with the main application in `skillmate-app/` and database scripts in the root directory.

## Development Commands

All development commands should be run from the `skillmate-app/` directory:

```bash
cd skillmate-app
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

The development server runs on http://localhost:3000 by default.

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with CSS Variables
- **UI Components**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React
- **Theme**: Dark/light mode support via next-themes

### Project Structure
```
skillmate-app/
├── app/                    # Next.js App Router pages
│   ├── page.js            # Home page with skill cards
│   ├── layout.js          # Root layout with theme provider
│   ├── globals.css        # Global styles and CSS variables
│   └── dashboard/         # Dashboard with sidebar layout
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── app-sidebar.jsx   # Main sidebar component
│   ├── nav-*.jsx         # Navigation components
│   └── theme-provider.js # Theme context provider
├── lib/                  # Utilities
│   └── utils.js          # cn() utility for class merging
└── hooks/                # Custom React hooks
    └── use-mobile.js     # Mobile detection hook
```

### Key Components
- **AppSidebar**: Main navigation sidebar with user profile, main nav, projects, and secondary nav
- **ThemeProvider**: Wraps the app to provide dark/light theme switching
- **UI Components**: Built using Radix UI primitives and styled with Tailwind CSS

### Database
MySQL database with scripts located in root directory:
- `MySqlscript db.sql` - Main database schema
- `backend/MySQL script.sql` - Additional database scripts

## Development Notes

### Styling Approach
- Uses CSS variables for theming (defined in `globals.css`)
- Tailwind classes combined with `cn()` utility from `lib/utils.js`
- Dark mode support through CSS variables and `next-themes`

### Component Patterns
- Components use JSX extension
- Functional components with hooks
- Consistent import patterns with `@/` alias for root imports
- Props destructuring and spreading patterns

### Current Features
- Landing page with skill categories grid
- Dashboard with sidebar navigation
- Theme switching (light/dark)
- Responsive design with mobile support

The application appears to be in early development with placeholder content in the dashboard and basic navigation structure in place.