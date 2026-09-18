# rakitmimpi-nextjs-boilerplate

[English](README.md) | **Bahasa Indonesia**

Boilerplate Enterprise Next.js 15 (App Router) standar ekosistem **Rakitmimpi Research**.

Dirancang khusus sebagai arsitektur frontend thin-client modern yang berorientasi mengonsumsi microservices backend (Go/Rust/dsb) via transparent reverse-proxy dan OpenAPI contract codegen.

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
    1. **TypeScript Models & Types** (`src/gen/types`)
    2. **API Clients & SDK** (`src/gen/clients`)
    3. **React Query Hooks** (`src/gen/hooks` via `@tanstack/react-query`)
  - Seluruh call otomatis melewati `src/lib/api-client.ts` yang ramah reverse-proxy.
- **Styling:** Tailwind CSS + PostCSS dengan Dark Theme bawaan.
- **Authentication:** Stateless JWT Session menggunakan `jose` dan `bcryptjs` disimpan di `HttpOnly` cookie.
- **Icons & UI Primitives:** Lucide React, clsx, tailwind-merge (`cn` utility), dan Framer Motion.
- **Modular On-Demand Scaffolding:** Bebas dependensi database & Docker secara default (pure frontend garis keras). Modul Database (Prisma), Docker, dan i18n dapat diinisialisasi on-demand via `pnpm gen:...`.

---

## 📁 Struktur Direktori

```
.
├── kubb.config.ts            # Konfigurasi Kubb OpenAPI code generator
├── openapi/
│   └── openapi.yaml          # Spesifikasi OpenAPI backend
├── scripts/
│   ├── init-prisma.mjs       # Script inisialisasi on-demand Prisma ORM
│   ├── init-docker.mjs       # Script inisialisasi on-demand Docker container
│   └── init-i18n.mjs         # Script inisialisasi on-demand Dual-Language i18n
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
│       └── auth.ts           # Stateless JWT, password hashing & cookie session
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

### 4. Generate Types & Hooks dari OpenAPI Spec

```bash
# Generate TypeScript Types & React Query Hooks dari OpenAPI spec
pnpm kubb:gen
```

### 5. Jalankan Dev Server

```bash
pnpm dev
```

Akses [http://localhost:3000](http://localhost:3000) pada browser.

---

## 📦 Modul Scaffolding On-Demand

### 1. Setup Docker Produksi (`pnpm gen:docker`)
Membuat konfigurasi containerization multi-stage siap produksi:
```bash
pnpm gen:docker
```
- Menghasilkan `Dockerfile` multi-stage berbasis Node 22 Alpine dengan Next.js standalone runner.
- Menghasilkan `docker-compose.yml`.
- Menghasilkan `.dockerignore`.

### 2. Dual-Language i18n (`pnpm gen:i18n`)
Menyiapkan dukungan multi-bahasa (EN default, auto ID berdasarkan locale browser) ditenagai oleh `next-intl`:
```bash
pnpm gen:i18n
```
- Menghasilkan `messages/en.json` dan `messages/id.json`.
- Menyiapkan konfigurasi request di `src/i18n/request.ts`.
- Membuat komponen pemilih bahasa `src/components/language-switcher.tsx`.
- Mengupdate `next.config.mjs` dan membungkus root layout dengan `NextIntlClientProvider`.

### 3. Database Prisma ORM (`pnpm gen:prisma`)
Jika proyek Anda membutuhkan koneksi database langsung (SQLite / PostgreSQL):
```bash
pnpm gen:prisma
pnpm db:push
```
- Membuat folder `prisma/schema.prisma` dengan model baseline User & Setting.
- Membuat singleton client `src/server/prisma.ts`.
- Menambahkan dependensi `@prisma/client` & `prisma` ke `package.json` serta script `db:push`, `db:studio`, dan `db:generate`.

---

## 📜 Perintah yang Tersedia

| Perintah | Deskripsi |
|---|---|
| `pnpm dev` | Menjalankan server development di port 3000 |
| `pnpm build` | Menjalankan build bundle produksi |
| `pnpm start` | Menjalankan server produksi |
| `pnpm lint` | Menjalankan linter ESLint |
| `pnpm kubb:gen` | Menjalankan generate code dari spesifikasi OpenAPI |
| `pnpm gen:docker` | Menginisialisasi Dockerfile & Docker Compose produksi |
| `pnpm gen:i18n` | Menginisialisasi internationalization dual-language (EN/ID) |
| `pnpm gen:prisma` | Menginisialisasi Prisma ORM on-demand |

---

## Lisensi

Private / Rakitmimpi Ecosystem.
