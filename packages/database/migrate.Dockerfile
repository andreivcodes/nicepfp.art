FROM node:20-alpine

WORKDIR /app

# Install dependencies and setup pnpm
RUN apk add --no-cache libc6-compat python3 make g++ && \
    corepack enable && \
    corepack prepare pnpm@10.15.0 --activate

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/database ./packages/database

# Install all dependencies (including devDependencies for typescript)
RUN pnpm install --filter @nicepfp/database...

# Run migrations (kysely-ctl uses jiti to run TypeScript files directly)
WORKDIR /app/packages/database
CMD ["pnpm", "migrate:latest"]
