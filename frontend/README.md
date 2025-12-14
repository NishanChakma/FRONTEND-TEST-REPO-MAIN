# AuditVault Frontend

A Next.js-based frontend application for document management and compliance tracking. This application provides a dashboard interface for managing documents, funds, users, and audit trails with role-based access control.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: React Query (TanStack Query) for server state
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Charts**: Recharts
- **Theme**: Dark mode support via next-themes

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (dashboard)/        # Route group for authenticated pages
│   │   │   ├── layout.tsx      # Dashboard layout with sidebar
│   │   │   ├── page.tsx        # Dashboard overview
│   │   │   ├── documents/      # Document management
│   │   │   │   ├── page.tsx    # Documents list
│   │   │   │   └── [id]/       # Dynamic route for document details
│   │   │   ├── funds/          # Fund management
│   │   │   ├── users/          # User management
│   │   │   ├── chat/           # Chat interface
│   │   │   └── settings/       # User settings
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css          # Global styles
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI primitives (shadcn/ui style)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...             # Other UI components
│   │   ├── dashboard/          # Dashboard-specific components
│   │   │   ├── stats-cards.tsx
│   │   │   ├── compliance-chart.tsx
│   │   │   ├── recent-activity.tsx
│   │   │   └── upload-document-modal.tsx
│   │   ├── chat/               # Chat components
│   │   ├── providers.tsx       # React Query and theme providers
│   │   └── theme-provider.tsx  # Theme context provider
│   │
│   ├── context/                # React contexts
│   │   └── auth-context.tsx    # Authentication context
│   │
│   ├── lib/                    # Utility libraries
│   │   ├── api.ts              # Axios instance with interceptors
│   │   ├── utils.ts            # General utilities (cn, etc.)
│   │   ├── data-helpers.ts     # Data transformation helpers
│   │   └── responsive-helpers.ts # Responsive design utilities
│   │
│   └── types.ts                # TypeScript type definitions
│
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.js
```

## Key Features

### Authentication & Authorization

- JWT-based authentication with localStorage
- Role-based access control (ADMIN, AUDITOR, COMPLIANCE_OFFICER, FUND_MANAGER)
- Protected routes via dashboard layout
- Automatic token refresh and logout on 401 errors

### Document Management

- Document listing with filtering and search
- Document detail view with audit trail
- Document status workflow (PENDING → IN_REVIEW → APPROVED/REJECTED)
- Document download functionality
- Upload documents with metadata

### Dashboard Features

- Overview statistics cards
- Compliance charts and visualizations
- Recent activity feed
- Upcoming deadlines tracking

### UI/UX

- Responsive design (mobile-first)
- Dark mode support
- Accessible components (Radix UI)
- Toast notifications for user feedback
- Loading states and error handling

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Backend API** must be running (see the main [README.md](../README.md) for backend setup instructions)

⚠️ **Important**: The backend must be running and accessible at `http://localhost:3000` before starting the frontend.

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

### Running the Application

1. **Ensure the Backend is Running**

   Before starting the frontend, make sure the backend server is running:

   - The backend should be accessible at `http://localhost:3000`
   - The database should be set up and migrated (see [backend README](../backend/README.md))
   - You can verify by visiting `http://localhost:3000/api` to see the Swagger documentation

2. **Start the Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3001`.

3. **Access the Application**

   Open your browser and navigate to:

   **http://localhost:3001**

### Quick Start (Complete Setup)

If you're starting from scratch, follow these steps in order:

```bash
# 1. Start the database (from backend directory)
cd ../backend
docker compose up -d db

# 2. Set up the database
npx prisma generate
npx prisma migrate deploy
npx prisma db seed  # Optional: adds test data

# 3. Start the backend server
npm run start:dev

# 4. In a new terminal, start the frontend
cd ../frontend
npm install  # Only needed the first time
npm run dev
```

The frontend will automatically connect to the backend API at `http://localhost:3000`.

### Available Scripts

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Patterns

### Data Fetching

- **React Query** is used for all server state management
- Query keys follow a consistent pattern: `["resource", id]` or `["resource", filters]`
- Mutations automatically invalidate related queries
- Error handling is centralized in mutation `onError` callbacks

### API Client

- Centralized Axios instance in `src/lib/api.ts`
- Request interceptor adds JWT token from localStorage
- Response interceptor handles 401 errors and redirects to login
- Base URL configured for backend API

### Component Organization

- **UI Components** (`components/ui/`): Reusable, unstyled primitives
- **Feature Components** (`components/dashboard/`, `components/chat/`): Feature-specific components
- **Pages** (`app/`): Route components that compose features

### Type Safety

- Shared types defined in `src/types.ts`
- TypeScript strict mode enabled
- No `any` types (enforced by ESLint)
- Proper error type handling with type guards

### Routing

- Next.js App Router with route groups
- `(dashboard)` route group wraps all authenticated pages
- Dynamic routes for resource details (`[id]`)
- Client-side navigation with Next.js Link

## Environment Configuration

The API base URL is currently hardcoded in `src/lib/api.ts` as `http://localhost:3000`. For production, consider using environment variables:

```typescript
// .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Development Guidelines

### Code Style

- Use TypeScript for all files
- Follow ESLint rules (no `any` types, no unused variables)
- Use Tailwind utility classes for styling
- Prefer functional components with hooks

### Component Patterns

- Use `"use client"` directive for client components
- Extract reusable logic into custom hooks
- Keep components focused and composable
- Use React Query hooks for data fetching

### Error Handling

- Use type guards for error handling (`error: unknown`)
- Display user-friendly error messages via toast notifications
- Log errors to console for debugging
- Handle loading and error states in UI

## Common Tasks

### Adding a New Page

1. Create a new file in `src/app/(dashboard)/your-page/page.tsx`
2. Use the dashboard layout (automatic via route group)
3. Fetch data with React Query hooks
4. Compose UI using components from `components/ui/`

### Adding a New API Endpoint

1. Add the API call in the appropriate component or create a custom hook
2. Use the `api` instance from `src/lib/api.ts`
3. Handle errors appropriately
4. Update types in `src/types.ts` if needed

### Adding a New UI Component

1. Create component in `components/ui/` if reusable
2. Use Radix UI primitives for accessibility
3. Style with Tailwind CSS
4. Export from component file

## Notes

- The application uses port 3001 to avoid conflicts with the backend (port 3000)
- Authentication state persists in localStorage
- All dashboard routes require authentication (enforced by layout)
- The sidebar navigation is responsive with mobile menu support
