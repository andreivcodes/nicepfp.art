import Redis from "ioredis";

// Re-export db from shared package
export { db } from "@nicepfp/database";

declare global {
  var redis: undefined | Redis;
}

// Create the client on first use rather than at import time, so that
// `next build` (which evaluates server modules) doesn't try to connect.
export const getRedis = (): Redis => {
  if (!globalThis.redis) {
    globalThis.redis = new Redis(process.env.REDIS_URL!);
  }
  return globalThis.redis;
};
