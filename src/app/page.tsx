import Link from "next/link";
import { Badge, Button, Card, StatusChip } from "@/components/ui";
import { getSession } from "@/server/auth";

export default async function HomePage() {
  const session = await getSession();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto space-y-8">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <StatusChip status="up" label="SYSTEM ONLINE" pulse />
        <Badge variant="outline">Next.js 15 App Router</Badge>
        <Badge variant="primary">@rakitmimpi/ui v0.2.0</Badge>
      </div>

      <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-2xl leading-tight">
        High-Performance Modern Web Architecture
      </h1>

      <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
        Boilerplate frontend Next.js standar Rakitmimpi Ecosystem. Dilengkapi dengan Tailwind CSS,
        Dark Mode, UI Kit terintegrasi (@rakitmimpi/ui), OpenAPI &amp; Kubb Codegen, Transparent
        Backend Reverse-Proxy, dan Stateless JWT Session.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {session ? (
          <div className="p-4 rounded-md bg-slate-900 border border-slate-800 text-sm">
            Halo, <strong className="text-indigo-400">{session.email}</strong> ({session.role})
          </div>
        ) : (
          <Link href="/login">
            <Button variant="primary" size="md">
              Mulai Masuk (Login) 🚀
            </Button>
          </Link>
        )}

        <a href="https://storybook.rakitmimpi.my.id" target="_blank" rel="noreferrer">
          <Button variant="secondary" size="md">
            Komponen Storybook 📚
          </Button>
        </a>

        <a href="https://github.com/MAbduhI/rakitmimpi" target="_blank" rel="noreferrer">
          <Button variant="outline" size="md">
            GitHub UI Kit
          </Button>
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-8 text-left">
        <Card className="p-5 border-slate-800/80 bg-slate-900/60">
          <span className="text-2xl mb-2 block">🎨</span>
          <h3 className="font-bold text-white text-sm">@rakitmimpi/ui Ready</h3>
          <p className="text-xs text-slate-400 mt-1">
            Pre-configured Tailwind tokens, Nordic Dark &amp; Swiss themes, 30+ enterprise
            components &amp; Storybook docs.
          </p>
        </Card>
        <Card className="p-5 border-slate-800/80 bg-slate-900/60">
          <span className="text-2xl mb-2 block">🔐</span>
          <h3 className="font-bold text-white text-sm">Stateless JWT Auth</h3>
          <p className="text-xs text-slate-400 mt-1">
            HttpOnly cookie session menggunakan library Jose &amp; BcryptJS aman terhadap XSS.
          </p>
        </Card>
        <Card className="p-5 border-slate-800/80 bg-slate-900/60">
          <span className="text-2xl mb-2 block">🔌</span>
          <h3 className="font-bold text-white text-sm">OpenAPI &amp; Reverse Proxy</h3>
          <p className="text-xs text-slate-400 mt-1">
            Otomatis generate TypeScript types, React Query hooks, dan transparent proxy ke backend.
          </p>
        </Card>
      </div>
    </main>
  );
}
