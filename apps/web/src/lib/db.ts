import Redis from "ioredis";

// Re-export db from shared package
export { db } from "@nicepfp/database";

const redisClientSingleton = () => {
  return new Redis(process.env.REDIS_URL!);
};

declare global {
  var redis: undefined | ReturnType<typeof redisClientSingleton>;
}

const redis = globalThis.redis ?? redisClientSingleton();

export { redis };

if (process.env.NODE_ENV !== "production") globalThis.redis = redis;
