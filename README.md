# rakitmimpi-nextjs-boilerplate

Boilerplate Enterprise Next.js 15 (App Router) standar ekosistem **Rakitmimpi Research**.

## 🚀 Fitur Unggulan Arsitektur
- **Next.js 15 + React 19:** App Router, SSR, SSG, dan React Server Components.
- **🛡️ Transparent Backend Reverse-Proxy:**
  - Endpoint catch-all `/src/app/api/v1/[...path]/route.ts`.
  - Di browser/network tab, seluruh request FE diarahkan ke origin lokal (`/api/v1/...`) seolah-olah request lokal.
  - Server Next.js secara transparan meneruskan request ke backend asli (`API_BACKEND_URL`), otomatis menyembunyikan IP backend, bebas isu CORS, dan mendukung streaming duplex (video/audio/large binary).
- **⚙️ Kubb CLI (OpenAPI TypeScript Codegen):**
  - Dikonfigurasi penuh di `kubb.config.ts`.
  - Mengonversi file OpenAPI specification (`./openapi/openapi.yaml`) menjadi:
    1. **TypeScript Models/Types** (`src/gen/types`)
    2. **API Clients & SDK** (`src/gen/clients`)
    3. **React Query Hooks** (`src/gen/hooks` via `@tanstack/react-query`)
  - Seluruh call otomatis melewati `src/lib/api-client.ts` yang ramah reverse-proxy.
- **Styling:** Tailwind CSS + PostCSS dengan Dark Theme bawaan.
- **Authentication:** Stateless JWT Session menggunakan `jose` dan `bcryptjs` disimpan di `HttpOnly` cookie.
- **Database & ORM:** Prisma ORM siap pakai (default SQLite untuk portabilitas cepat, mudah diubah ke PostgreSQL).
- **Icons & UI Primitives:** Lucide React, clsx, tailwind-merge (`cn` utility), dan Framer Motion.
- **Docker Production Ready:** Multi-stage Dockerfile dengan output standalone yang sangat ringan.

## 📁 Struktur Direktori
```
.
├── kubb.config.ts            # Konfigurasi Kubb OpenAPI code generator
├── openapi/
│   └── openapi.yaml          # Spesifikasi OpenAPI backend
├── prisma/
│   └── schema.prisma         # Definisi schema database
├── src/
│   ├── app/
│   │   ├── api/v1/[...path]/ # Reverse Proxy Catch-All ke backend asli
│   │   ├── layout.tsx        # Root layout HTML & Theme
│   │   ├── globals.css       # Tailwind CSS root tokens
│   │   └── page.tsx          # Landing page
│   ├── components/           # Reusable UI & Layout components
│   ├── gen/                  # Hasil generate otomatis Kubb (types, clients, hooks)
│   ├── hooks/                # Custom React Hooks
│   ├── lib/
│   │   ├── api-client.ts     # Client HTTP (Auto proxy-aware & SSR direct)
│   │   └── utils.ts          # Helper cn, formatter, dll
│   └── server/
│       ├── auth.ts           # Stateless JWT, password hashing & cookie session
│       └── prisma.ts         # Singleton Prisma Client
└── Dockerfile                # Production standalone container build
```

## 🛠️ Perintah Utama
```bash
# 1. Install dependencies
pnpm install

# 2. Generate TypeScript Types & React Query Hooks dari OpenAPI spec
pnpm kubb:gen

# 3. Sinkronkan Database SQLite/Postgres
pnpm db:push

# 4. Jalankan Dev Server
pnpm dev
```
