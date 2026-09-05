import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rakitmimpi Next.js Boilerplate",
  description: "Enterprise Monorepo Starter with Tailwind CSS, Dark Theme, and Stateless JWT Auth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
