# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development Server
- `npm run dev` - Start development server with Turbopack at http://localhost:3000

### Build & Production
- `npm run build` - Build production version
- `npm start` - Start production server
- `npm run lint` - Run Next.js linter

### Testing
- `npm run test` - Run all Jest tests with update snapshots
- `npm run test:unit` - Run unit tests for auth file (jest tests/auth-utils.test.ts)
- `npm run test:api` - Run API tests for auth endpoints (jest __tests__/auth-api.test.ts)
- `npm run cy:open` - Open Cypress test runner
- `npm run cy:run` - Run Cypress tests headlessly
- `npm run test:db` - Test database connection using ts-node script

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router and TypeScript
- **Database**: MySQL with mysql2 connection pooling
- **Authentication**: JWT tokens with httpOnly cookies
- **UI**: React 19, Tailwind CSS, Radix UI components
- **Form Validation**: React Hook Form with Zod schemas
- **Testing**: Jest for unit tests, Cypress for e2e tests

### Database Connection
The app uses MySQL connection pooling via `lib/db.ts`. Database credentials are managed through environment variables (DB_HOST, DB_USER, DB_PASS, DB_NAME). Test database connectivity with `npm run test:db`.

### Authentication System
Authentication is handled through:
- JWT tokens stored in httpOnly cookies
- `lib/auth-utils.ts` provides core auth functions: createUser, findUserByEmail, setAuthCookie, getSession
- `app/middleware.ts` protects routes `/profile` and `/chat`
- Session management uses JWT_SECRET and COOKIE_NAME environment variables

### API Structure
API routes follow Next.js App Router conventions in `app/api/`:
- **Auth**: `/api/auth/[login|logout|register|session]`
- **Chat**: `/api/chat/[messages|send|connections]`
- **Friends**: `/api/friends/[request|pending|incoming|confirmed]`
- **Profile & Users**: `/api/[profile|users]`

### Core Features
1. **Skill Trading Platform**: Users have skills defined in `lib/skills.ts` with predefined skill categories
2. **Friend System**: Friend requests with pending/accepted/rejected states
3. **Real-time Chat**: Message system between connected users
4. **User Profiles**: Profile management with skill associations

### Key Components
- **NavBar**: Main navigation with theme toggle
- **Chat System**: ChatInput and ChatMessageList components
- **Sidebar**: App sidebar with navigation projects and user components
- **Theme**: Dark/light mode support via next-themes

### Type Definitions
- `types/chat.ts`: ChatMessage interface
- `types/friend.ts`: FriendRequest interface
- Component props use TypeScript throughout

### Data Flow
- Authentication state flows through JWT cookies and session helpers
- Chat messages are stored in MySQL Messages table
- Friend relationships managed through database with status tracking
- Skills are statically defined in `lib/skills.ts` but associated with users dynamically

### Environment Configuration
Required environment variables:
- `JWT_SECRET` - Secret key for JWT token signing
- `COOKIE_NAME` - Name for authentication cookie
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` - MySQL database credentials

### Testing Structure
- Jest configuration uses ts-jest preset with module path mapping (`@/` -> root)
- Unit tests located in `/tests` directory
- API tests use next-test-api-route-handler for testing Next.js API routes
- Cypress E2E tests configured for http://localhost:3000 base URL