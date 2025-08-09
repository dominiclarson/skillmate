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
- `npm run test:unit` - Run unit tests for auth file
- `npm run test:api` - Run API tests for auth endpoints
- `npm run cy:open` - Open Cypress test runner
- `npm run cy:run` - Run Cypress tests headlessly
- `npm run test:db` - Test database connection

### Documentation
- `npm run docs` - Generate TypeDoc documentation
- `npm run docs:serve` - Generate and serve documentation at http://localhost:8080
- `npm run docs:clean` - Remove generated documentation files

### Deployment
- **Docker**: Dockerfile configured for containerized deployment with standalone build
- **Environment**: Production debugging enabled in middleware

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router and TypeScript
- **Database**: MySQL with mysql2 connection pooling (direct queries, Prisma client available but not primary)
- **Authentication**: JWT tokens with httpOnly cookies
- **UI**: React 19, Tailwind CSS, Radix UI components, shadcn/ui, react-icons
- **Forms**: React Hook Form with Zod validation
- **Notifications**: React Toastify for user feedback, custom notification system
- **Icons**: Lucide React and react-icons libraries
- **Animations**: tw-animate-css for enhanced Tailwind animations
- **Security**: bcrypt/bcryptjs for password hashing
- **Testing**: Jest for unit tests (jsdom environment), Cypress for e2e tests

### Database Connection
The app uses MySQL connection pooling via `lib/db.ts`. Database credentials are managed through environment variables (DB_HOST, DB_USER, DB_PASS, DB_NAME).

### Authentication System
Authentication is handled through:
- JWT tokens stored in httpOnly cookies
- `lib/auth-utils.ts` provides core auth functions: createUser, findUserByEmail, setAuthCookie, getSession
- `app/middleware.ts` protects routes including `/profile`, `/chat`, `/sessions`, `/notifications`
- Session management uses JWT_SECRET and COOKIE_NAME environment variables
- Production debugging enabled for session troubleshooting

### API Structure
API routes follow Next.js App Router conventions in `app/api/`:
- **Auth**: `/api/auth/[login|logout|register|session]`
- **Chat**: `/api/chat/[messages|send|connections]`
- **Friends**: `/api/friends/[request|pending|incoming|confirmed]`
- **Profile & Users**: `/api/[profile|users]`
- **Sessions**: `/api/sessions/[id]` - Individual session management, `/api/sessions` - Session CRUD
- **Notifications**: `/api/notifications/[id]` - Individual actions, `/api/notifications` - Management
- **Availability**: `/api/availability` - User availability management
- **Skills**: `/api/skills/teachers` - Teacher discovery by skill
- **Location**: `/api/update-location` - User location updates
- **Account**: `/api/account` - Account settings management
- **Jobs**: `/api/jobs/run-reminders` - Background reminder system

### Core Features
1. **Skill Trading Platform**: Users have skills defined in `lib/skills.ts` with 24 predefined skill categories
2. **Friend System**: Friend requests with pending/accepted/rejected states
3. **Real-time Chat**: Message system between connected users
4. **User Profiles**: Profile management with skill associations
5. **Session Scheduling**: Complete booking system with availability management, automated reminders
6. **Notification System**: Real-time notifications with 30-second polling, NotificationBell component
7. **Location Services**: Geographic features for local skill matching and teacher discovery
8. **Reminder System**: Automated 24h and 1h session reminders via background jobs
9. **Account Management**: User settings, location updates, and profile customization
10. **Teacher Discovery**: Find teachers by skill with location-based matching

### Key Components
- **NavBar**: Main navigation with theme toggle
- **Chat System**: ChatInput and ChatMessageList components
- **Sidebar**: App sidebar with navigation projects and user components
- **Theme**: Dark/light mode support via next-themes
- **NotificationBell**: Real-time notification dropdown with 30-second polling
- **QuickScheduleDialog**: Session booking interface with teacher selection
- **SkillOverview**: Skill information and teacher discovery display
- **Session Management**: Complete session lifecycle components

### Type Definitions
- `types/chat.ts`: ChatMessage interface
- `types/friend.ts`: FriendRequest interface
- `lib/notification-types.ts`: Notification type definitions and enums
- Session-related types throughout scheduling components
- Teacher interface in QuickScheduleDialog
- Component props use TypeScript throughout

### Data Flow
- Authentication state flows through JWT cookies and session helpers
- Chat messages are stored in MySQL Messages table
- Friend relationships managed through database with status tracking
- Skills are statically defined but associated with users dynamically
- Session requests → acceptance → automated reminder scheduling
- Real-time notification polling (30-second intervals) for live updates
- Background job processing for session reminders (24h and 1h before)
- Location-based teacher discovery and matching

### Testing Configuration
- **Unit Tests**: Jest with ts-jest preset in jsdom environment, tests located in `/tests/` directory
- **Setup**: Jest DOM matchers configured via `jest.setup.ts`
- **E2E Tests**: Cypress for integration testing authentication flows
- **Test Environment**: Tests run against development server on localhost:3000

### Development Environment
- **Module System**: Full ESM with TypeScript strict null checks enabled
- **Path Aliases**: Comprehensive alias system (@/, @/lib/*, @/components/*)
- **Build Tool**: Turbopack for development server acceleration
- **Component Library**: shadcn/ui configured in `components.json`

### Key Utility Libraries
- `lib/schedule-utils.ts`: Session scheduling and reminder utilities
- `lib/notification-types.ts`: Notification type definitions and constants
- `lib/auth-utils.ts`: Authentication and session management
- `lib/skills.ts`: Skill definitions and categories
- `lib/db.ts`: MySQL connection pooling and database utilities

### Application Pages
- `/` - Landing page with authentication
- `/profile` - User profile management
- `/chat` - Real-time messaging system
- `/sessions` - Session management and booking
- `/notifications` - Full notifications interface
- `/featured` - Featured users and content
- `/search` - User and skill search
- `/post-request` - Request posting interface
- `/skills/[id]` - Individual skill pages with teacher discovery