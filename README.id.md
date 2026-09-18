# rakitmimpi-nextjs-boilerplate

[English](README.md) | **Bahasa Indonesia**

Boilerplate Enterprise Next.js 15 (App Router) standar ekosistem **Rakitmimpi Research**.

---

## 🚀 Fitur Unggulan Arsitektur

- **Next.js 15 + React 19:** App Router, SSR, SSG, dan React Server Components.
- **🛡️ Transparent Backend Reverse-Proxy:**
  - Endpoint catch-all di `/src/app/api/v1/[...path]/route.ts`.
  - Di browser/network tab, seluruh request FE diarahkan ke origin lokal (`/api/v1/...`) seolah-olah request lokal tanpa isu CORS.
  - Server Next.js secara transparan meneruskan request ke backend asli (`API_BACKEND_URL`), mengaburkan IP/origin backend, serta mendukung streaming duplex (video/audio/large binary).
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

---

## 📁 Struktur Direktori

```
.
├── kubb.config.ts            # Konfigurasi Kubb OpenAPI code generator
├── openapi/
│   └── openapi.yaml          # Spesifikasi OpenAPI backend
├── prisma/
│   └── schema.prisma         # Definisi schema database (SQLite / PostgreSQL)
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
└── .env.example              # Template environment variable
```

---

## 🛠️ Panduan Memulai

### 1. Kebutuhan Sistem

- Node.js >= 20
- pnpm (disarankan) atau npm / yarn

### 2. Instalasi Dependensi

```bash
pnpm install
```

### 3. Konfigurasi Environment

```bash
cp .env.example .env
```

### 4. Code Generation & Database Setup

```bash
# Generate TypeScript Types & React Query Hooks dari OpenAPI spec
pnpm kubb:gen

# Sinkronkan Database SQLite/Postgres
pnpm db:push
```

### 5. Jalankan Dev Server

```bash
pnpm dev
```

Akses [http://localhost:3000](http://localhost:3000) pada browser.

---

## 📜 Perintah yang Tersedia

| Perintah | Deskripsi |
|---|---|
| `pnpm dev` | Menjalankan server development di port 3000 |
| `pnpm build` | Menjalankan generate Prisma client dan build produksi |
| `pnpm start` | Menjalankan build produksi |
| `pnpm lint` | Menjalankan linter ESLint |
| `pnpm kubb:gen` | Menjalankan generate code dari spesifikasi OpenAPI |
| `pnpm db:push` | Mendorong perubahan skema Prisma ke database |
| `pnpm db:generate` | Menghasilkan Prisma client |
| `pnpm db:studio` | Membuka Prisma Studio GUI |

---

## Lisensi

Private / Rakitmimpi Ecosystem.
