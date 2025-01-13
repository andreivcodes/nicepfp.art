FROM node:20-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat python3 make g++
RUN apk update
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune @nicepfp/gen-img --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat python3 make g++
RUN apk update
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN yarn turbo run build --filter=@nicepfp/gen-img...

FROM base AS runner
WORKDIR /app

COPY --from=installer /app/apps/generate_image/package.json .
COPY --from=installer /app/apps/generate_image/dist ./dist

ENV PORT 3000

CMD ["node", "dist/index.js"]
