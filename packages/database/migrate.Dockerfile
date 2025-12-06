FROM node:20-alpine

WORKDIR /app

# Install necessary dependencies
RUN apk add --no-cache libc6-compat python3 make g++

# Update and enable corepack
RUN apk update
RUN corepack enable
RUN corepack prepare pnpm@10.15.0 --activate

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/database ./packages/database

# Install dependencies
RUN pnpm install --filter @nicepfp/database

# Build the database package
RUN pnpm --filter @nicepfp/database build

# Run migrations
WORKDIR /app/packages/database
CMD ["pnpm", "migrate:latest"]
