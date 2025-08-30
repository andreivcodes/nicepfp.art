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
COPY apps/generate_image/package.json ./apps/generate_image/
COPY apps/web/package.json ./apps/web/
COPY apps/mint/package.json ./apps/mint/
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install
RUN pnpm prisma:generate

# Copy source files
COPY apps/generate_image ./apps/generate_image
COPY tsconfig.json ./

# Build
RUN pnpm build --filter=@nicepfp/gen-img

FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat python3 make g++ openssl openssl-dev chromium

COPY --from=builder /app/apps/generate_image/package.json ./
COPY --from=builder /app/apps/generate_image/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

ENV PORT=3000
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

CMD ["node", "dist/index.js"]
