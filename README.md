# rakitmimpi-nextjs-boilerplate

Boilerplate Enterprise Next.js 15 (App Router) standar ekosistem **Rakitmimpi Research**.

## 🚀 Fitur Utama
- **Next.js 15 + React 19:** App Router, SSR, SSG, dan React Server Components.
- **Styling:** Tailwind CSS + PostCSS dengan Dark Theme bawaan.
- **Authentication:** Stateless JWT Session menggunakan `jose` dan `bcryptjs` disimpan di `HttpOnly` cookie.
- **Database & ORM:** Prisma ORM siap pakai (default SQLite untuk portabilitas cepat, mudah diubah ke PostgreSQL).
- **Icons & UI Primitives:** Lucide React, clsx, tailwind-merge (`cn` utility), dan Framer Motion.
- **Docker Production Ready:** Multi-stage Dockerfile dengan output standalone yang sangat ringan.

## 📁 Struktur Direktori
```
.
├── prisma/
│   └── schema.prisma         # Definisi schema database
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout HTML & Theme
│   │   ├── globals.css       # Tailwind CSS root tokens
│   │   ├── page.tsx          # Landing page
│   │   └── api/              # API Route Handlers
│   ├── components/           # Reusable UI & Layout components
│   ├── hooks/                # Custom React Hooks
│   ├── lib/
│   │   └── utils.ts          # Helper cn, formatter, dll
│   └── server/
│       ├── auth.ts           # Stateless JWT, password hashing & cookie session
│       └── prisma.ts         # Singleton Prisma Client
├── Dockerfile                # Production standalone container build
└── docker-compose.yml        # Docker compose runner
```

## 🛠️ Cara Menjalankan
```bash
# 1. Install dependencies
pnpm install

# 2. Sinkronkan Database
pnpm db:push

# 3. Jalankan Dev Server
pnpm dev
```
Buka browser di `http://localhost:3000`.
