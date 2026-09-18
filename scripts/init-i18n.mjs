#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("\n🌐 Initializing Dual-Language i18n (EN/ID) for rakitmimpi-nextjs-boilerplate...\n");

// 1. Create messages/en.json and messages/id.json
const messagesDir = path.join(rootDir, "messages");
if (!fs.existsSync(messagesDir)) {
  fs.mkdirSync(messagesDir, { recursive: true });
}

const enMessages = {
  common: {
    title: "Rakitmimpi Next.js 15 App Router Boilerplate",
    headline: "High-Performance Modern Web Architecture",
    description: "Enterprise-standard Next.js frontend boilerplate by Rakitmimpi Ecosystem. Featuring Tailwind CSS, Dark Mode, OpenAPI & Kubb Codegen, Transparent Backend Reverse-Proxy, Stateless JWT Session, and modular enterprise architecture.",
    login: "Sign In (Login) 🚀",
    github: "GitHub Repository",
    welcome: "Hello",
    language: "Language"
  },
  features: {
    nextjs: {
      title: "Next.js 15 & React 19",
      desc: "High-speed App Router, Server Components, Server Actions & Route Handlers."
    },
    auth: {
      title: "Stateless JWT Auth",
      desc: "HttpOnly cookie sessions using Jose & BcryptJS, secure against XSS."
    },
    openapi: {
      title: "OpenAPI & Reverse Proxy",
      desc: "Automatically generated TypeScript types, React Query hooks, and transparent proxy to backend."
    }
  }
};

const idMessages = {
  common: {
    title: "Rakitmimpi Next.js 15 App Router Boilerplate",
    headline: "Arsitektur Web Modern Berkinerja Tinggi",
    description: "Boilerplate frontend Next.js standar Rakitmimpi Ecosystem. Dilengkapi dengan Tailwind CSS, Dark Mode, OpenAPI & Kubb Codegen, Transparent Backend Reverse-Proxy, Stateless JWT Session, dan arsitektur modular enterprise.",
    login: "Mulai Masuk (Login) 🚀",
    github: "GitHub Repository",
    welcome: "Halo",
    language: "Bahasa"
  },
  features: {
    nextjs: {
      title: "Next.js 15 & React 19",
      desc: "App Router, Server Components, Server Actions & Route Handlers berkecepatan tinggi."
    },
    auth: {
      title: "Stateless JWT Auth",
      desc: "HttpOnly cookie session menggunakan library Jose & BcryptJS aman terhadap XSS."
    },
    openapi: {
      title: "OpenAPI & Reverse Proxy",
      desc: "Otomatis generate TypeScript types, React Query hooks, dan transparent proxy ke backend."
    }
  }
};

fs.writeFileSync(path.join(messagesDir, "en.json"), JSON.stringify(enMessages, null, 2) + "\n", "utf-8");
fs.writeFileSync(path.join(messagesDir, "id.json"), JSON.stringify(idMessages, null, 2) + "\n", "utf-8");
console.log("  ✅ Created messages/en.json and messages/id.json");

// 2. Create src/i18n/request.ts
const i18nDir = path.join(rootDir, "src", "i18n");
if (!fs.existsSync(i18nDir)) {
  fs.mkdirSync(i18nDir, { recursive: true });
}

const requestContent = `import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export const locales = ["en", "id"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerList = await headers();

  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  let locale: Locale = defaultLocale;

  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    locale = cookieLocale as Locale;
  } else {
    const acceptLang = headerList.get("accept-language");
    if (acceptLang && acceptLang.toLowerCase().includes("id")) {
      locale = "id";
    }
  }

  return {
    locale,
    messages: (await import(\`../../messages/\${locale}.json\`)).default,
  };
});
`;

fs.writeFileSync(path.join(i18nDir, "request.ts"), requestContent, "utf-8");
console.log("  ✅ Created src/i18n/request.ts");

// 3. Create src/components/language-switcher.tsx
const componentsDir = path.join(rootDir, "src", "components");
if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
}

const switcherContent = `"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  function onSelectChange(nextLocale: string) {
    document.cookie = \`NEXT_LOCALE=\${nextLocale}; path=/; max-age=31536000; SameSite=Lax\`;
    startTransition(() => {
      window.location.reload();
    });
  }

  return (
    <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
      <button
        type="button"
        disabled={isPending}
        onClick={() => onSelectChange("en")}
        className={\`px-2.5 py-1 rounded-lg font-medium transition \${
          locale === "en"
            ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
            : "text-slate-400 hover:text-white"
        }\`}
      >
        EN
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => onSelectChange("id")}
        className={\`px-2.5 py-1 rounded-lg font-medium transition \${
          locale === "id"
            ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
            : "text-slate-400 hover:text-white"
        }\`}
      >
        ID
      </button>
    </div>
  );
}
`;

fs.writeFileSync(path.join(componentsDir, "language-switcher.tsx"), switcherContent, "utf-8");
console.log("  ✅ Created src/components/language-switcher.tsx");

// 4. Update next.config.mjs to integrate next-intl plugin
const nextConfigPath = path.join(rootDir, "next.config.mjs");
const nextConfigContent = `import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default withNextIntl(nextConfig);
`;

fs.writeFileSync(nextConfigPath, nextConfigContent, "utf-8");
console.log("  ✅ Updated next.config.mjs with withNextIntl plugin");

// 5. Update src/app/layout.tsx with NextIntlClientProvider
const layoutPath = path.join(rootDir, "src", "app", "layout.tsx");
const layoutContent = `import type { Metadata } from "next";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rakitmimpi Next.js Boilerplate",
  description: "Enterprise Starter with Tailwind CSS, Dark Theme, and Stateless JWT Auth",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body className="antialiased selection:bg-indigo-500 selection:text-white">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
`;

fs.writeFileSync(layoutPath, layoutContent, "utf-8");
console.log("  ✅ Updated src/app/layout.tsx with NextIntlClientProvider");

// 6. Update package.json to include next-intl
const pkgPath = path.join(rootDir, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
pkg.dependencies = pkg.dependencies || {};
pkg.dependencies["next-intl"] = "^3.26.3";
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
console.log("  ✅ Added next-intl to package.json dependencies");

// 7. Detect package manager and install dependencies
function getPackageManager() {
  const userAgent = process.env.npm_config_user_agent || "";
  if (userAgent.startsWith("pnpm")) return "pnpm";
  if (userAgent.startsWith("yarn")) return "yarn";
  if (userAgent.startsWith("bun")) return "bun";
  if (userAgent.startsWith("npm")) return "npm";

  if (fs.existsSync(path.join(rootDir, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(rootDir, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(rootDir, "bun.lockb"))) return "bun";
  return "pnpm";
}

const pm = getPackageManager();
console.log(`\n📦 Installing next-intl using ${pm}...`);

try {
  execSync(`${pm} install`, { cwd: rootDir, stdio: "inherit" });
  console.log("  ✅ Dependencies installed successfully.");
} catch (error) {
  console.error("\n⚠️ Failed to install dependencies automatically.");
  console.error("Please run manually:");
  console.error(`  ${pm} install\n`);
}

console.log("\n🎉 Dual-Language i18n setup complete!");
console.log("How to use:");
console.log("  1. Server Component: const t = await getTranslations('common');");
console.log("  2. Client Component: const t = useTranslations('common');");
console.log("  3. Switcher:         import { LanguageSwitcher } from '@/components/language-switcher';\n");
