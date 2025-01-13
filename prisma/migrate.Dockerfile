FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat python3 make g++
RUN apk update

RUN corepack enable
RUN corepack prepare yarn@4 --activate

# Copy workspace files
COPY package.json .yarnrc.yml turbo.json ./
COPY prisma ./prisma

RUN yarn install
RUN yarn prisma generate

CMD ["yarn", "prisma", "migrate", "deploy"]
