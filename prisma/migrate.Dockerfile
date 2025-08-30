FROM node:20-alpine

WORKDIR /app

# Install necessary dependencies
RUN apk add --no-cache libc6-compat python3 make g++ openssl openssl-dev

# Update and enable corepack
RUN apk update
RUN corepack enable
RUN corepack prepare pnpm@10.15.0 --activate

# Copy workspace files
COPY package.json .pnpmrc pnpm-workspace.yaml turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/generate_image/package.json ./apps/generate_image/
COPY apps/mint/package.json ./apps/mint/
COPY prisma ./prisma

# Install dependencies and generate Prisma client
RUN pnpm install
RUN pnpm prisma:generate

# Run Prisma migrations
CMD ["pnpm", "prisma:migrate:deploy"]
