# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (uses Turbopack)
- **Build for production**: `npm run build`
- **Run linting**: `npm run lint`
- **Run all tests**: `npm test`
- **Run specific unit tests**: `npm run test:unit`
- **Run API tests**: `npm run test:api`
- **Test database connection**: `npm run test:db`
- **Cypress E2E testing**: `npm run cy:open` (interactive) or `npm run cy:run` (headless)

## Architecture Overview

**SkillMate** is a Next.js 15 skill-swapping application with App Router architecture:

### Core Structure
- **Frontend**: React 19 + Next.js 15 with App Router
- **Database**: MySQL with mysql2 connection pooling
- **Authentication**: JWT-based auth with secure httpOnly cookies
- **Styling**: Tailwind CSS with shadcn/ui components
- **Forms**: react-hook-form with zod validation
- **Testing**: Jest for unit/API tests, Cypress for E2E

### Key Directories
- `app/`: Next.js App Router pages and API routes
- `components/`: Reusable UI components (shadcn/ui based)
- `lib/`: Core utilities (auth, database, chat, friends, skills)
- `types/`: TypeScript type definitions
- `tests/`: Jest unit tests
- `cypress/`: E2E test specifications

### Authentication Flow
Uses custom JWT implementation in `lib/auth-utils.ts` with:
- User registration/login via bcrypt password hashing
- JWT tokens stored in secure httpOnly cookies
- Session management with automatic expiration
- Middleware protection for authenticated routes

### Database Layer
- Connection pooling via `lib/db.ts`
- Environment variables for DB credentials (DB_HOST, DB_USER, DB_PASS, DB_NAME)
- User, message, and friend relationship tables

### Component Architecture
- shadcn/ui component library for consistent design
- Theme provider for dark/light mode switching
- Sidebar navigation with authenticated/unauthenticated states
- Real-time chat functionality with message persistence

### Path Aliases
- `@/*`: Root directory imports
- `@/lib/*`: Library utilities
- `@/components/*`: UI components

## Environment Requirements
Required environment variables:
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`: Database connection
- `JWT_SECRET`: JWT token signing key
- `COOKIE_NAME`: Authentication cookie identifier