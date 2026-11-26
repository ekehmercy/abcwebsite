/**
 * Minimal in-memory sliding-window rate limiter, keyed by client IP.
 *
 * NOTE: memory is per server instance. On serverless or multi-instance
 * deployments, replace this with a shared store (e.g. Redis / Upstash / a
 * platform firewall rule) so limits apply across instances.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }
  hits.push(now);
  buckets.set(key, hits);
  // Opportunistic cleanup to bound memory.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return { ok: true, retryAfter: 0 };
}
