import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

const redisClientSingleton = () => {
  return new Redis(process.env.REDIS_URL!);
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
  var redis: undefined | ReturnType<typeof redisClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();
const redis = globalThis.redis ?? redisClientSingleton();

export { prisma, redis };

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
if (process.env.NODE_ENV !== "production") globalThis.redis = redis;
