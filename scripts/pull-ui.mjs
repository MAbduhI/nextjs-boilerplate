#!/usr/bin/env node

/**
 * pull-ui.mjs
 *
 * Mengambil (pull) packages/ui terbaru langsung dari GitHub repository
 * https://github.com/MAbduhI/rakitmimpi.git (branch main) dan menempatkannya
 * ke folder internal ./packages/ui sebagai pnpm workspace local package.
 *
 * Penggunaan:
 *   pnpm ui:pull
 *   UI_KIT_BRANCH=development pnpm ui:pull
 *   UI_KIT_REPO=https://github.com/user/custom-repo.git pnpm ui:pull
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const packagesDir = path.join(rootDir, "packages");
const targetUiDir = path.join(packagesDir, "ui");

const targetRepo =
  process.env.UI_KIT_REPO || "https://github.com/MAbduhI/rakitmimpi.git";
const targetBranch = process.env.UI_KIT_BRANCH || "main";
const localFallbackPath =
  process.env.UI_KIT_LOCAL_PATH || "/app/data/Base/ui-kit-react/packages/ui";

function copyDirectorySync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.name === "node_modules" || entry.name === ".turbo" || entry.name === ".git") {
      continue;
    }

    if (entry.isDirectory()) {
      copyDirectorySync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function applyCompatibilityPatches(uiDir) {
  // 1. Pastikan banner: { js: '"use client";' } ada di tsup.config.ts untuk kompatibilitas Next.js App Router
  const tsupPath = path.join(uiDir, "tsup.config.ts");
  if (fs.existsSync(tsupPath)) {
    let tsupContent = fs.readFileSync(tsupPath, "utf-8");
    if (!tsupContent.includes("banner:")) {
      tsupContent = tsupContent.replace(
        'external: ["react", "react-dom"],',
        'external: ["react", "react-dom"],\n  banner: { js: \'"use client";\' },'
      );
      fs.writeFileSync(tsupPath, tsupContent, "utf-8");
    }
  }

  // 2. Sesuaikan @layer base pada src/styles.css agar tidak crash di PostCSS consumer Tailwind v3
  const stylesPath = path.join(uiDir, "src", "styles.css");
  if (fs.existsSync(stylesPath)) {
    let css = fs.readFileSync(stylesPath, "utf-8");
    if (css.includes("@layer base {")) {
      css = css.replace("@layer base {\n", "/* @layer base */\n");
      css = css.replace(
        "    display: none;\n  }\n}\n\n/*\n * RunBanner",
        "    display: none;\n  }\n/* end base */\n\n/*\n * RunBanner"
      );
      fs.writeFileSync(stylesPath, css, "utf-8");
    }
  }
}

async function main() {
  console.log(`[ui:pull] Memulai penarikan packages/ui dari ${targetRepo} (branch: ${targetBranch})...`);

  if (!fs.existsSync(packagesDir)) {
    fs.mkdirSync(packagesDir, { recursive: true });
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "rakitmimpi-ui-pull-"));
  let pulledSuccessfully = false;

  try {
    console.log(`[ui:pull] Melakukan sparse checkout dari GitHub ke temporary directory...`);
    execSync(
      `git clone --depth 1 --branch ${targetBranch} --filter=blob:none --sparse ${targetRepo} "${tempDir}"`,
      { stdio: "pipe" }
    );
    execSync(`git sparse-checkout set packages/ui`, { cwd: tempDir, stdio: "pipe" });

    const sourcePath = path.join(tempDir, "packages", "ui");
    if (fs.existsSync(sourcePath)) {
      console.log(`[ui:pull] Menyalin file packages/ui ke ./packages/ui...`);
      if (fs.existsSync(targetUiDir)) {
        fs.rmSync(targetUiDir, { recursive: true, force: true });
      }
      copyDirectorySync(sourcePath, targetUiDir);
      pulledSuccessfully = true;
    }
  } catch (err) {
    console.warn(`[ui:pull] Gagal mengambil via git remote (${err.message}). Memeriksa local fallback...`);
    if (fs.existsSync(localFallbackPath)) {
      console.log(`[ui:pull] Menggunakan sumber lokal di: ${localFallbackPath}`);
      if (fs.existsSync(targetUiDir)) {
        fs.rmSync(targetUiDir, { recursive: true, force: true });
      }
      copyDirectorySync(localFallbackPath, targetUiDir);
      pulledSuccessfully = true;
    } else {
      console.error(`✖ [ui:pull] Gagal mengambil UI kit dari GitHub maupun local fallback.`);
      process.exit(1);
    }
  } finally {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (_) {}
  }

  if (pulledSuccessfully) {
    applyCompatibilityPatches(targetUiDir);
    console.log(`✔ [ui:pull] Folder packages/ui berhasil diperbarui.`);

    console.log(`[ui:pull] Menjalankan pnpm install untuk menghubungkan workspace package...`);
    try {
      execSync("pnpm install", { cwd: rootDir, stdio: "inherit" });
      console.log(`\n✔ [ui:pull] Selesai! @rakitmimpi/ui berhasil terhubung ke workspace.`);
      console.log(`ℹ [ui:pull] Sekarang jalankan: pnpm ui:build\n`);
    } catch (installErr) {
      console.warn(`[ui:pull] pnpm install menghasilkan catatan: ${installErr.message}`);
    }
  }
}

main();
