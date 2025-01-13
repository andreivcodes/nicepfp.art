FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat python3 make g++ openssl openssl-dev
RUN apk update

# Setup yarn
RUN corepack enable
RUN corepack prepare yarn@4 --activate

# Copy workspace files
COPY package.json .yarnrc.yml turbo.json ./
COPY apps/mint/package.json ./apps/mint/
COPY prisma ./prisma/

# Install dependencies
RUN yarn install
RUN yarn prisma generate

# Copy source files
COPY apps/mint ./apps/mint
COPY tsconfig.json ./

# Build
RUN yarn workspace @nicepfp/mint build

FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat python3 make g++ openssl openssl-dev

COPY --from=builder /app/apps/mint/package.json ./
COPY --from=builder /app/apps/mint/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

ENV PORT=3000

CMD ["node", "dist/index.js"]
