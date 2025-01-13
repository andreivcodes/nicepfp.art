FROM node:20-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN corepack enable
RUN corepack prepare yarn@4.1.1 --activate
COPY . .
RUN yarn turbo prune @nicepfp/mint --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN corepack enable
RUN corepack prepare yarn@4.1.1 --activate

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN yarn turbo run build --filter=@nicepfp/mint...

FROM base AS runner
WORKDIR /app

COPY --from=installer /app/apps/mint/package.json .
COPY --from=installer /app/apps/mint/dist ./dist

ENV PORT 3000

CMD ["node", "dist/index.js"]
