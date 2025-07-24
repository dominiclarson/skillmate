# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

The main application is in the `skillmate-app/` directory. Always `cd skillmate-app` before running commands.

### Core Commands
- `npm run dev` - Start development server with Turbopack (http://localhost:3000)
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run Next.js linting

### Testing
- `npm run test` - Run all Jest tests with updates
- `npm run test:unit` - Run unit tests for auth utilities
- `npm run test:api` - Run API endpoint tests
- `npm run cy:open` - Open Cypress test runner
- `npm run cy:run` - Run Cypress tests headlessly
- `npm run test:db` - Test database connection

## Architecture Overview

**SkillMate** is a skill-sharing platform built with Next.js 15, using the App Router architecture.

### Tech Stack
- **Frontend**: Next.js 15 with React 19, Tailwind CSS, Radix UI components
- **Backend**: Next.js API routes, MySQL with connection pooling
- **Authentication**: Custom JWT-based auth (not NextAuth despite dependency)
- **Testing**: Jest for unit/API tests, Cypress for E2E
- **Styling**: Tailwind CSS with dark/light theme support

### Key Architecture Patterns

#### Database Layer
- MySQL connection pool in `lib/db.js` (legacy JS file)
- Connection pool configured with 10 concurrent connections
- Environment variables required: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`

#### Authentication System
- JWT-based authentication in `lib/auth-file.ts` and `lib/auth-utils.ts`
- Session management in `lib/session-helper.ts`
- API routes: `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/session`
- File-based user storage in `data/users.json` alongside database

#### Core Services
- `lib/user-service.ts` - User management operations
- `lib/skills.ts` - Skills data and operations
- `lib/message-store.ts` - Chat/messaging functionality
- `lib/file-store.ts` - File handling utilities

#### Component Structure
- Shared UI components in `components/ui/` (Radix-based)
- Feature components: `NavBar`, `ChatPanel`, `SkillOverview`, `AppSidebar`
- Theme management with `next-themes` and custom `ThemeProvider`

### Data Flow
1. **Authentication**: JWT tokens stored in cookies, validated on API routes
2. **Skills**: Centralized in `lib/skills.ts`, displayed via grid layouts and sidebar
3. **Messaging**: Real-time chat system with file-based message persistence
4. **User Profiles**: Combined database + file storage approach

### Development Notes
- Uses `@/` path mapping for imports (configured in `tsconfig.json`)
- Jest tests in `tests/` directory with custom `@/` module mapping
- Cypress E2E tests in `cypress/e2e/`
- Environment files: `.env.local` for development, `pw.env` for production