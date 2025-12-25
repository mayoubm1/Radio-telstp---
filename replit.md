# TELsTP - PMO Framework

## Overview

TELsTP is a Project Management Office (PMO) dashboard for managing podcast/audio episode production. It provides a sci-fi themed interface for tracking episodes, team members (both AI and human), production tasks, and audio assets. The application follows a full-stack TypeScript architecture with a React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom sci-fi dark theme (cyan/purple neon accents)
- **Animations**: Framer Motion for smooth transitions
- **Charts**: Recharts for dashboard analytics
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod validation
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Development**: tsx for TypeScript execution, Vite middleware for HMR

### Data Storage
- **Database**: PostgreSQL (connection via DATABASE_URL environment variable)
- **Schema**: Defined in `shared/schema.ts` using Drizzle's table definitions
- **Tables**: episodes, teamMembers, tasks, productionAssets, dailyBroadcasts
- **Migrations**: Managed via `drizzle-kit push` command

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts`: Database table definitions and Zod insert schemas
- `routes.ts`: API route definitions with input/output types for type-safe client-server communication

### Build System
- **Development**: `npm run dev` runs Express server with Vite middleware
- **Production**: `npm run build` bundles client with Vite and server with esbuild
- **Database**: `npm run db:push` pushes schema changes to PostgreSQL

## External Dependencies

### Database
- **PostgreSQL**: Primary database, requires DATABASE_URL environment variable
- **Drizzle ORM**: Database client and schema management
- **connect-pg-simple**: PostgreSQL session store (available but not currently used)

### UI Framework
- **Radix UI**: Complete set of accessible primitive components (accordion, dialog, dropdown, etc.)
- **shadcn/ui**: Pre-styled component system using Radix primitives
- **Lucide React**: Icon library
- **Recharts**: Data visualization library

### Form Handling
- **React Hook Form**: Form state management
- **@hookform/resolvers**: Zod schema validation integration
- **Zod**: Runtime type validation for API inputs/outputs

### Development Tools
- **Vite**: Frontend build tool with React plugin
- **esbuild**: Server bundling for production
- **Drizzle Kit**: Database migration tooling

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Replit development integration
- **@replit/vite-plugin-dev-banner**: Development environment indicator