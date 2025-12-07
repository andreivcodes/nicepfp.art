FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies and setup pnpm
RUN apk add --no-cache libc6-compat python3 make g++ openssl openssl-dev && \
    corepack enable && \
    corepack prepare pnpm@10.15.0 --activate

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/mint/package.json ./apps/mint/
COPY packages/database ./packages/database/

# Install dependencies (only mint and its dependencies)
RUN pnpm install --filter @nicepfp/mint...

# Build the database package first
RUN pnpm --filter @nicepfp/database build

# Copy source files
COPY apps/mint ./apps/mint
COPY tsconfig.json ./

# Build the app
RUN pnpm build --filter=@nicepfp/mint

# Deploy creates a standalone bundle with no symlinks
RUN pnpm deploy --filter=@nicepfp/mint --prod /app/deploy

FROM node:20-alpine AS runner

# Only runtime dependencies needed
RUN apk add --no-cache libc6-compat dumb-init

WORKDIR /app

# Create non-root user for security BEFORE copying files
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --home /app nodejs

# Copy the deployed bundle with proper ownership
COPY --from=builder --chown=nodejs:nodejs /app/deploy ./

# Copy built application with proper ownership
COPY --from=builder --chown=nodejs:nodejs /app/apps/mint/dist ./dist

# Switch to non-root user
USER nodejs

ENV NODE_ENV=production
ENV PORT=3000

CMD ["dumb-init", "node", "dist/index.js"]
