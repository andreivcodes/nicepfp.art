FROM node:20-alpine

WORKDIR /app

RUN corepack enable
RUN corepack prepare yarn@4.1.1 --activate

COPY package.json .
COPY yarn.lock .
COPY prisma ./prisma

RUN yarn install

CMD ["yarn", "prisma", "migrate", "deploy"]
