FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat python3 make g++ openssl openssl-dev
RUN apk update

# Setup pnpm
RUN corepack enable
RUN corepack prepare pnpm@10.15.0 --activate

# Copy workspace files
COPY package.json .pnpmrc pnpm-workspace.yaml turbo.json ./
COPY apps/mint/package.json ./apps/mint/
COPY apps/web/package.json ./apps/web/
COPY apps/generate_image/package.json ./apps/generate_image/
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install
RUN pnpm prisma:generate

# Copy source files
COPY apps/mint ./apps/mint
COPY tsconfig.json ./

# Build
RUN pnpm build --filter=@nicepfp/mint

FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat python3 make g++ openssl openssl-dev

COPY --from=builder /app/apps/mint/package.json ./
COPY --from=builder /app/apps/mint/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

ENV PORT=3000

CMD ["node", "dist/index.js"]
