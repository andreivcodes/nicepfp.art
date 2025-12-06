FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat python3 make g++ openssl openssl-dev
RUN apk update

# Setup pnpm
RUN corepack enable
RUN corepack prepare pnpm@10.15.0 --activate

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/mint/package.json ./apps/mint/
COPY apps/web/package.json ./apps/web/
COPY apps/generate_image/package.json ./apps/generate_image/
COPY packages/database ./packages/database/

# Install dependencies
RUN pnpm install

# Build the database package first
RUN pnpm --filter @nicepfp/database build

# Copy source files
COPY apps/mint ./apps/mint
COPY tsconfig.json ./

# Build
RUN pnpm build --filter=@nicepfp/mint

FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat python3 make g++ openssl openssl-dev

# Setup pnpm for production install
RUN corepack enable
RUN corepack prepare pnpm@10.15.0 --activate

# Copy workspace files needed for pnpm install
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/apps/mint/package.json ./apps/mint/
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/apps/generate_image/package.json ./apps/generate_image/
COPY --from=builder /app/packages/database/package.json ./packages/database/
COPY --from=builder /app/packages/database/dist ./packages/database/dist

# Install production dependencies only (ignore-scripts to skip husky)
# Include database package to get kysely and pg dependencies
RUN pnpm install --prod --ignore-scripts --filter @nicepfp/mint --filter @nicepfp/database

# Copy built application
COPY --from=builder /app/apps/mint/dist ./apps/mint/dist

WORKDIR /app/apps/mint

ENV PORT=3000

CMD ["node", "dist/index.js"]
