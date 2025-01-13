FROM node:20-alpine

WORKDIR /app

# Install necessary dependencies
RUN apk add --no-cache libc6-compat python3 make g++ openssl openssl-dev

# Update and enable corepack
RUN apk update
RUN corepack enable
RUN corepack prepare yarn@4 --activate

# Copy workspace files
COPY package.json .yarnrc.yml turbo.json ./
COPY prisma ./prisma

# Install dependencies and generate Prisma client
RUN yarn install
RUN yarn prisma generate

RUN yarn prisma migrate dev --name init --skip-generate

# Run Prisma migrations
CMD ["yarn", "prisma", "migrate", "deploy"]
