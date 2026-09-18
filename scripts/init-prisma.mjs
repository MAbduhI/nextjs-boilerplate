#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("\n🚀 Initializing Prisma ORM for rakitmimpi-nextjs-boilerplate...\n");

// 1. Create prisma/ directory and prisma/schema.prisma
const prismaDir = path.join(rootDir, "prisma");
if (!fs.existsSync(prismaDir)) {
  fs.mkdirSync(prismaDir, { recursive: true });
}

const schemaContent = `datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  name         String?
  passwordHash String
  role         String   @default("user") // "admin", "user"
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Setting {
  key       String   @id
  value     String
  updatedAt DateTime @updatedAt
}
`;

const schemaPath = path.join(prismaDir, "schema.prisma");
fs.writeFileSync(schemaPath, schemaContent, "utf-8");
console.log("  ✅ Created prisma/schema.prisma");

// 2. Create src/server/prisma.ts
const serverDir = path.join(rootDir, "src", "server");
if (!fs.existsSync(serverDir)) {
  fs.mkdirSync(serverDir, { recursive: true });
}

const prismaClientContent = `import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
`;

const prismaClientPath = path.join(serverDir, "prisma.ts");
fs.writeFileSync(prismaClientPath, prismaClientContent, "utf-8");
console.log("  ✅ Created src/server/prisma.ts");

// 3. Update package.json
const pkgPath = path.join(rootDir, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

pkg.scripts = pkg.scripts || {};
pkg.scripts["build"] = "prisma generate && next build";
pkg.scripts["db:push"] = "prisma db push";
pkg.scripts["db:studio"] = "prisma studio";
pkg.scripts["db:generate"] = "prisma generate";

pkg.dependencies = pkg.dependencies || {};
pkg.dependencies["@prisma/client"] = "^6.4.1";

pkg.devDependencies = pkg.devDependencies || {};
pkg.devDependencies["prisma"] = "^6.4.1";

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
console.log("  ✅ Updated package.json (scripts and dependencies)");

// 4. Ensure DATABASE_URL is present in .env
const envPath = path.join(rootDir, ".env");
const defaultDbUrl = 'DATABASE_URL="file:./dev.db"';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  if (!envContent.includes("DATABASE_URL")) {
    fs.appendFileSync(envPath, `\n# Database (Prisma SQLite)\n${defaultDbUrl}\n`, "utf-8");
    console.log("  ✅ Appended DATABASE_URL to .env");
  }
} else {
  fs.writeFileSync(envPath, `# Database (Prisma SQLite)\n${defaultDbUrl}\n`, "utf-8");
  console.log("  ✅ Created .env with DATABASE_URL");
}

// 5. Detect package manager and install dependencies
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
console.log(`\n📦 Installing Prisma dependencies using ${pm}...`);

try {
  execSync(`${pm} install`, { cwd: rootDir, stdio: "inherit" });
  console.log("  ✅ Dependencies installed successfully.");

  console.log("\n⚙️ Generating Prisma Client...");
  execSync(`${pm} prisma generate`, { cwd: rootDir, stdio: "inherit" });
  console.log("  ✅ Prisma Client generated.");
} catch (error) {
  console.error("\n⚠️ Failed to install dependencies or generate Prisma Client automatically.");
  console.error("Please run manually:");
  console.error(`  ${pm} install`);
  console.error(`  ${pm} prisma generate\n`);
}

console.log("\n🎉 Prisma setup complete!");
console.log("Next steps:");
console.log("  1. Run database sync:    " + pm + " db:push");
console.log("  2. Open Prisma Studio:   " + pm + " db:studio\n");
