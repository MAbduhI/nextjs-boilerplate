#!/usr/bin/env node

/**
 * pull-openapi.mjs
 *
 * Mengambil (pull) spesifikasi OpenAPI (JSON atau YAML) terbaru dari backend server
 * atau URL remote, menyimpannya ke folder ./openapi/, dan mempersiapkannya
 * untuk codegen Kubb (TypeScript types, HTTP clients, dan TanStack React Query hooks).
 *
 * Penggunaan:
 *   npm run openapi:pull
 *   OPENAPI_URL=http://localhost:8095/api/v1/openapi.json npm run openapi:pull
 *   node scripts/pull-openapi.mjs https://api.example.com/openapi.json
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const openapiDir = path.join(rootDir, "openapi");

// Target URL dari CLI arguments atau Environment Variable (default ke Go Backend :8095 /swagger/doc.json)
const targetUrl =
  process.argv[2] ||
  process.env.OPENAPI_URL ||
  "http://localhost:8095/swagger/doc.json";

async function main() {
  console.log(`[openapi:pull] Menghubungi backend di: ${targetUrl}`);

  if (!fs.existsSync(openapiDir)) {
    fs.mkdirSync(openapiDir, { recursive: true });
  }

  try {
    const res = await fetch(targetUrl, {
      headers: { Accept: "application/json, application/yaml, text/yaml, */*" },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    const contentType = res.headers.get("content-type") || "";
    const text = await res.text();

    if (!text || text.trim().length === 0) {
      throw new Error("Respon dari server kosong");
    }

    // Tentukan apakah JSON atau YAML
    let isJson = false;
    try {
      JSON.parse(text);
      isJson = true;
    } catch {
      isJson = false;
    }

    const outputFile = isJson
      ? path.join(openapiDir, "doc.json")
      : path.join(openapiDir, "openapi.yaml");

    fs.writeFileSync(outputFile, text, "utf-8");
    if (isJson) {
      fs.writeFileSync(path.join(openapiDir, "openapi.json"), text, "utf-8");
    }

    console.log(
      `✔ [openapi:pull] Berhasil mengunduh spesifikasi OpenAPI ke: ${path.relative(rootDir, outputFile)}`
    );
    console.log(
      `ℹ [openapi:pull] Sekarang jalankan 'npm run openapi:gen' untuk me-regenerate TypeScript types & hooks.`
    );
  } catch (err) {
    console.error(`✖ [openapi:pull] Gagal mengambil OpenAPI spec dari ${targetUrl}`);
    console.error(`  Detail error: ${err.message}`);
    console.error(
      `\n💡 Tips:\n` +
      `  1. Pastikan backend aktif (misal di http://localhost:8095).\n` +
      `  2. Atau tentukan URL spesifik:\n` +
      `     OPENAPI_URL=http://localhost:8095/api/v1/openapi.yaml npm run openapi:pull\n` +
      `  3. Jika backend offline, file cadangan ./openapi/openapi.yaml tetap bisa digunakan untuk 'npm run openapi:gen'.`
    );
    process.exit(1);
  }
}

main();
