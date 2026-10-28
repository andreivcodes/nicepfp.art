import { getRedis } from "./db";

const REDIS_TIMEOUT_MS = 2000;

/**
 * Fixed-window counter in Redis. Returns true when `key` has been hit more
 * than `limit` times in the current `windowSeconds` window.
 *
 * Fails open: if Redis is unavailable or slow the request is allowed, so a
 * Redis outage can't block minting.
 */
export async function isRateLimited(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const counter = getRedis()
      .multi()
      // Creates the key with a TTL only if it doesn't exist; INCR keeps the TTL.
      .set(key, 0, "EX", windowSeconds, "NX")
      .incr(key)
      .exec();
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("Redis timeout")), REDIS_TIMEOUT_MS);
    });
    const results = await Promise.race([counter, timeout]);
    const [incrError, count] = results?.[1] ?? [];
    if (incrError) throw incrError;
    return Number(count) > limit;
  } catch (e) {
    console.error("[rate-limit] Redis unavailable, allowing request:", e);
    return false;
  } finally {
    clearTimeout(timer);
  }
}
