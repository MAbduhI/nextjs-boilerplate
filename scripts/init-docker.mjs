#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("\n🐳 Initializing Docker production setup for rakitmimpi-nextjs-boilerplate...\n");

// 1. Dockerfile
const dockerfileContent = `# syntax=docker/dockerfile:1

# ---------- Base ----------
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
WORKDIR /app

# ---------- Dependencies ----------
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile=false

# ---------- Builder ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Run codegen if OpenAPI spec exists
RUN if [ -f "./openapi/openapi.yaml" ]; then pnpm kubb:gen || true; fi
# Build Next.js application with standalone output
RUN pnpm build

# ---------- Runner ----------
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Copy Next.js standalone server and static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
`;

const dockerfilePath = path.join(rootDir, "Dockerfile");
fs.writeFileSync(dockerfilePath, dockerfileContent, "utf-8");
console.log("  ✅ Created Dockerfile (multi-stage Node 22 Alpine standalone)");

// 2. docker-compose.yml
const dockerComposeContent = `services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: rakitmimpi-nextjs-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HOSTNAME=0.0.0.0
      - API_BACKEND_URL=\${API_BACKEND_URL:-http://localhost:8080}
      - API_KEY=\${API_KEY:-}
      - JWT_SECRET=\${JWT_SECRET:-rakitmimpi-production-secret-change-me}
    env_file:
      - path: .env
        required: false
`;

const dockerComposePath = path.join(rootDir, "docker-compose.yml");
fs.writeFileSync(dockerComposePath, dockerComposeContent, "utf-8");
console.log("  ✅ Created docker-compose.yml");

// 3. .dockerignore
const dockerIgnoreContent = `Dockerfile
docker-compose*.yml
.dockerignore
node_modules
.pnpm-store
.next
out
build
dist
.git
.gitignore
*.log
.env.local
.env*.local
.DS_Store
.idea
.vscode
*.tsbuildinfo
coverage
`;

const dockerIgnorePath = path.join(rootDir, ".dockerignore");
fs.writeFileSync(dockerIgnorePath, dockerIgnoreContent, "utf-8");
console.log("  ✅ Created .dockerignore");

console.log("\n🎉 Docker setup complete!");
console.log("Commands to test / run container:");
console.log("  1. Build image:          docker compose build");
console.log("  2. Run container:        docker compose up -d");
console.log("  3. Check logs:           docker compose logs -f app\n");
