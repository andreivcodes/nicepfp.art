FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat python3 make g++ openssl openssl-dev
RUN apk update

# Setup yarn
RUN corepack enable
RUN corepack prepare yarn@4.6.0 --activate

# Copy workspace files
COPY package.json .yarnrc.yml turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY prisma ./prisma/

# Install dependencies
RUN yarn install
RUN yarn prisma generate

# Copy source files
COPY apps/web ./apps/web
COPY tsconfig.json ./

# Build
RUN yarn workspace @nicepfp/web build

FROM node:20-alpine AS runner

RUN apk add --no-cache libc6-compat python3 make g++ openssl openssl-dev
RUN apk update

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/next.config.mjs .
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/package.json .
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "apps/web/server.js"]
