# rakitmimpi-nextjs-boilerplate

**English** | [Bahasa Indonesia](README.id.md)

Production-ready enterprise Next.js 15 (App Router) boilerplate by **Rakitmimpi Ecosystem**.

Built as a lightweight, thin-client frontend architecture designed to interface seamlessly with upstream backend microservices (Go/Rust/etc.) via transparent reverse-proxying and contract-driven OpenAPI codegen.

---

## Architectural Highlights

- **Next.js 15 + React 19:** App Router, SSR, SSG, and React Server Components.
- **🛡️ Transparent Backend Reverse Proxy:**
  - Catch-all route handler at `/src/app/api/v1/[...path]/route.ts`.
  - Browser/client requests hit the local origin (`/api/v1/...`) without cross-origin (CORS) issues.
  - Next.js server transparently proxies requests to the upstream backend (`API_BACKEND_URL`), hiding backend IP/origin, and supporting duplex streaming (video/audio/large binaries).
- **⚙️ Kubb CLI (OpenAPI TypeScript Codegen):**
  - Configured in `kubb.config.ts`.
  - Generates types, client SDK, and hooks directly from `./openapi/openapi.yaml`:
    1. **TypeScript Models & Types** (`src/gen/types`)
    2. **API Client & SDK** (`src/gen/clients`)
    3. **React Query Hooks** (`src/gen/hooks` via `@tanstack/react-query`)
  - All calls flow through proxy-aware HTTP client (`src/lib/api-client.ts`).
- **Styling:** Tailwind CSS + PostCSS with built-in dark theme.
- **Stateless JWT Authentication:** Built-in session handling with `jose` and `bcryptjs` via `HttpOnly` cookies.
- **Icons & UI Primitives:** Lucide React, clsx, tailwind-merge (`cn`), and Framer Motion.
- **Optional On-Demand Prisma ORM:** Zero database dependencies by default (pure frontend). When fullstack database access is needed, scaffold Prisma on-demand with `pnpm gen:prisma`.

---

## Directory Structure

```
.
├── kubb.config.ts            # Kubb OpenAPI code generator configuration
├── openapi/
│   └── openapi.yaml          # Upstream OpenAPI specification
├── scripts/
│   └── init-prisma.mjs       # On-demand Prisma scaffolding script
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
│       └── auth.ts           # Stateless JWT, password hashing & cookie sessions
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

### 4. Generate Types & Hooks from OpenAPI

```bash
# Generate TypeScript types & React Query hooks from openapi/openapi.yaml
pnpm kubb:gen
```

### 5. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Optional: On-Demand Prisma Setup

If your project specifically requires a direct database connection (e.g. SQLite / PostgreSQL) rather than a pure frontend consuming external APIs:

```bash
# Scaffold Prisma schema, server client, dependencies, and DB scripts
pnpm gen:prisma

# Push schema changes to database
pnpm db:push
```

This command automatically:
1. Creates `prisma/schema.prisma` with baseline User & Setting models.
2. Creates `src/server/prisma.ts` singleton client.
3. Adds `@prisma/client` and `prisma` to `package.json`.
4. Injects `db:push`, `db:studio`, and `db:generate` scripts into `package.json`.
5. Installs the dependencies and runs `prisma generate`.

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server on port 3000 |
| `pnpm build` | Build production bundle |
| `pnpm start` | Run production server |
| `pnpm lint` | Run ESLint checks |
| `pnpm kubb:gen` | Generate code from OpenAPI spec |
| `pnpm gen:prisma` | Scaffold Prisma ORM on demand |

---

## License

Private / Rakitmimpi Ecosystem.
