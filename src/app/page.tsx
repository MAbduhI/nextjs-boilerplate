import Link from "next/link";
import { getSession } from "@/server/auth";

export default async function HomePage() {
  const session = await getSession();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto space-y-8">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
        <span>✨</span>
        <span>Rakitmimpi Next.js 15 App Router Boilerplate</span>
      </div>

      <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-2xl leading-tight">
        High-Performance Modern Web Architecture
      </h1>

      <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
        Boilerplate frontend Next.js standar Rakitmimpi Ecosystem. Dilengkapi dengan Tailwind CSS, Dark Mode, OpenAPI &amp; Kubb Codegen, Transparent Backend Reverse-Proxy, Stateless JWT Session, dan arsitektur modular enterprise.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {session ? (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-sm">
            Halo, <strong className="text-indigo-400">{session.email}</strong> ({session.role})
          </div>
        ) : (
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition"
          >
            Mulai Masuk (Login) 🚀
          </Link>
        )}

        <a
          href="https://github.com/MAbduhI/rakitmimpi"
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-sm font-semibold transition"
        >
          GitHub Repository
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-8 text-left">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-2xl mb-2 block">⚡</span>
          <h3 className="font-bold text-white text-sm">Next.js 15 & React 19</h3>
          <p className="text-xs text-slate-400 mt-1">App Router, Server Components, Server Actions & Route Handlers berkecepatan tinggi.</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-2xl mb-2 block">🔐</span>
          <h3 className="font-bold text-white text-sm">Stateless JWT Auth</h3>
          <p className="text-xs text-slate-400 mt-1">HttpOnly cookie session menggunakan library Jose & BcryptJS aman terhadap XSS.</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-2xl mb-2 block">🔌</span>
          <h3 className="font-bold text-white text-sm">OpenAPI & Reverse Proxy</h3>
          <p className="text-xs text-slate-400 mt-1">Otomatis generate TypeScript types, React Query hooks, dan transparent proxy ke backend.</p>
        </div>
      </div>
    </main>
  );
}
