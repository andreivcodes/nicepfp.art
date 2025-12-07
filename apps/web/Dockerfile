FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies and setup pnpm
RUN apk add --no-cache libc6-compat python3 make g++ openssl openssl-dev && \
    corepack enable && \
    corepack prepare pnpm@10.15.0 --activate

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/database ./packages/database/

# Install dependencies (only web and its dependencies)
RUN pnpm install --filter @nicepfp/web...

# Build the database package first
RUN pnpm --filter @nicepfp/database build

# Copy source files
COPY apps/web ./apps/web
COPY tsconfig.json ./

# Build
RUN pnpm build --filter=@nicepfp/web

FROM node:20-alpine AS runner

# Only runtime dependencies needed
RUN apk add --no-cache libc6-compat dumb-init

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --home /app nextjs

# Copy files with proper ownership
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/next.config.mjs .
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/package.json .
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Switch to non-root user
USER nextjs

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["dumb-init", "node", "apps/web/server.js"]
