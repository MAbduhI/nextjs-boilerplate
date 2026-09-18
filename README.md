# rakitmimpi-nextjs-boilerplate

**English** | [Bahasa Indonesia](README.id.md)

Production-ready enterprise Next.js 15 (App Router) boilerplate by **Rakitmimpi Ecosystem**.

---

## Architectural Highlights

- **Next.js 15 + React 19:** Full App Router support, SSR, SSG, and React Server Components.
- **Transparent Backend Reverse Proxy:**
  - Catch-all route handler at `/src/app/api/v1/[...path]/route.ts`.
  - Browser/client requests hit the local origin (`/api/v1/...`) without cross-origin issues.
  - Next.js server transparently proxies requests to the upstream backend (`API_BACKEND_URL`), hiding backend IP/origin, eliminating CORS, and supporting duplex streaming (video/audio/large binaries).
- **Kubb CLI (OpenAPI TypeScript Codegen):**
  - Configured in `kubb.config.ts`.
  - Generates types and client hooks from `./openapi/openapi.yaml`:
    1. **TypeScript Types & Models** (`src/gen/types`)
    2. **API Client & SDK** (`src/gen/clients`)
    3. **React Query Hooks** (`src/gen/hooks` via `@tanstack/react-query`)
  - All calls flow through proxy-aware HTTP client (`src/lib/api-client.ts`).
- **Styling:** Tailwind CSS + PostCSS with built-in dark theme.
- **Stateless JWT Authentication:** Built-in session handling with `jose` and `bcryptjs` via `HttpOnly` cookies.
- **Database & ORM:** Prisma ORM ready (SQLite default for zero-setup portability, easy to switch to PostgreSQL).
- **Icons & UI Primitives:** Lucide React, clsx, tailwind-merge (`cn`), and Framer Motion.

---

## Directory Structure

```
.
├── kubb.config.ts            # Kubb OpenAPI code generator configuration
├── openapi/
│   └── openapi.yaml          # Upstream OpenAPI specification
├── prisma/
│   └── schema.prisma         # Prisma database schema (SQLite / PostgreSQL)
├── src/
│   ├── app/
│   │   ├── api/v1/[...path]/ # Reverse proxy catch-all to upstream backend
│   │   ├── layout.tsx        # Root HTML layout & theme wrapper
│   │   ├── globals.css       # Tailwind CSS & theme tokens
│   │   └── page.tsx          # Landing page
│   ├── components/           # Reusable UI & layout components
│   ├── gen/                  # Kubb generated code (types, clients, hooks)
│   ├── hooks/                # Custom React hooks
│   ├── lib/
│   │   ├── api-client.ts     # Proxy-aware fetch client (SSR direct, client proxied)
│   │   └── utils.ts          # Class merging (cn) and shared helpers
│   └── server/
│       ├── auth.ts           # Stateless JWT, password hashing & cookie sessions
│       └── prisma.ts         # Singleton Prisma client instance
└── .env.example              # Environment variables template
```

---

## Quick Start

### 1. Prerequisites

- Node.js >= 20
- pnpm (recommended) or npm / yarn

### 2. Installation

```bash
# Install dependencies
pnpm install
```

### 3. Environment Configuration

```bash
# Copy sample environment configuration
cp .env.example .env
```

### 4. Code Generation & Database Setup

```bash
# Generate TypeScript types & React Query hooks from openapi/openapi.yaml
pnpm kubb:gen

# Sync database schema (creates local SQLite file dev.db)
pnpm db:push
```

### 5. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server on port 3000 |
| `pnpm build` | Generate Prisma client and build production bundle |
| `pnpm start` | Run production server |
| `pnpm lint` | Run ESLint checks |
| `pnpm kubb:gen` | Run Kubb code generation from OpenAPI spec |
| `pnpm db:push` | Push Prisma schema changes to database |
| `pnpm db:generate` | Regenerate Prisma client |
| `pnpm db:studio` | Open Prisma Studio database GUI |

---

## License

Private / Rakitmimpi Ecosystem.
