FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies and setup pnpm
RUN apk add --no-cache libc6-compat python3 make g++ openssl openssl-dev && \
    corepack enable && \
    corepack prepare pnpm@10.15.0 --activate

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/generate_image/package.json ./apps/generate_image/
COPY packages/database ./packages/database/

# Install dependencies (only generate_image and its dependencies)
RUN pnpm install --filter @nicepfp/gen-img...

# Build the database package first
RUN pnpm --filter @nicepfp/database build

# Copy source files
COPY apps/generate_image ./apps/generate_image
COPY tsconfig.json ./

# Build the app
RUN pnpm build --filter=@nicepfp/gen-img

# Deploy creates a standalone bundle with no symlinks
RUN pnpm deploy --filter=@nicepfp/gen-img --prod /app/deploy

FROM node:20-alpine AS runner
WORKDIR /app

# Only runtime dependencies needed (chromium for Puppeteer)
RUN apk add --no-cache libc6-compat chromium

# Copy the deployed bundle (self-contained, no symlinks)
COPY --from=builder /app/deploy ./

# Copy built application
COPY --from=builder /app/apps/generate_image/dist ./dist

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs
USER nodejs

ENV PORT=3000
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

CMD ["node", "dist/index.js"]
