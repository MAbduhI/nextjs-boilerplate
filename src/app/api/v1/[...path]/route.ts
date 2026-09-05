/**
 * Universal Reverse-Proxy Catch-All Route Handler untuk Next.js
 *
 * Pola Arsitektur Rakitmimpi:
 * Setiap browser request ke `/api/v1/*` diarahkan seolah-olah request ke origin lokal yang sama.
 * Next.js secara transparan meneruskan request ini ke server backend asli (Go/Rust/dsb)
 * yang didefinisikan pada environment variable `API_BACKEND_URL`.
 *
 * Manfaat Utama:
 * 1. Menghilangkan masalah CORS sepenuhnya (browser hanya melihat origin lokal).
 * 2. Mengaburkan (obscure) URL & IP asli backend server dari inspeksi network browser.
 * 3. Menyuntikkan credential internal (X-API-Key atau internal auth) di layer server Next.js.
 * 4. Mendukung full streaming duplex & HTTP 206 Partial Content (Video/Audio/Large Files).
 */

import { type NextRequest, NextResponse } from "next/server";

function getBackendUrl(): string {
  return (process.env.API_BACKEND_URL ?? "http://localhost:8080").replace(
    /\/+$/,
    ""
  );
}

function getApiKey(): string {
  return process.env.API_KEY?.trim() ?? "";
}

async function handler(request: NextRequest) {
  const backend = getBackendUrl();

  // Rekonstruksi path dan query string
  const { pathname, search } = request.nextUrl;
  const target = `${backend}${pathname}${search}`;

  // Salin header asli dan buang host Next.js
  const headers = new Headers(request.headers);
  headers.delete("host");

  // Injeksi API Key internal jika ada
  const apiKey = getApiKey();
  if (apiKey) {
    headers.set("X-API-Key", apiKey);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    // @ts-expect-error - duplex diperlukan untuk streaming request bodies di Node 18+
    duplex: "half",
  };

  // Forward body jika method memiliki payload
  if (request.body && !["GET", "HEAD"].includes(request.method)) {
    init.body = request.body;
  }

  try {
    const upstream = await fetch(target, init);

    // Stream response balik ke browser
    const responseHeaders = new Headers();
    for (const [key, value] of upstream.headers) {
      if (/^(transfer-encoding|connection|keep-alive)$/i.test(key)) continue;
      responseHeaders.set(key, value);
    }

    return new NextResponse(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Bad Gateway",
        message: error.message || "Failed to reach backend service",
        target,
      },
      { status: 502 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const HEAD = handler;
export const OPTIONS = handler;
