import { NextResponse, type NextRequest } from "next/server";
import { isFormId, validate } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { deliver } from "@/lib/delivery.server";
import { site } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;
const MIN_FILL_MS = 3000;
const MAX_FILL_MS = 24 * 60 * 60 * 1000;

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function allowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  const allowed = new Set([new URL(site.url).origin, req.nextUrl.origin]);
  for (const o of (process.env.FORMS_ALLOWED_ORIGINS ?? "").split(",")) if (o.trim()) allowed.add(o.trim());
  return allowed.has(origin);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ form: string }> }) {
  const { form } = await ctx.params;
  if (!isFormId(form)) return json({ error: "not_found" }, 404);

  if (!allowedOrigin(req)) return json({ error: "forbidden" }, 403);
  if (!req.headers.get("content-type")?.includes("application/json")) return json({ error: "unsupported_media_type" }, 415);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const rl = rateLimit(`${form}:${ip}`);
  if (!rl.ok) return json({ error: "rate_limited", message: "Too many submissions. Please try again later." }, 429, { "Retry-After": String(rl.retryAfter) });

  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) return json({ error: "payload_too_large" }, 413);

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(text);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  // Spam protection: honeypot + minimum time to complete the form.
  const startedAt = Number(body._startedAt);
  const elapsed = Date.now() - startedAt;
  if (typeof body.company_website === "string" && body.company_website.length > 0) {
    // Respond like a normal validation failure; never pretend success.
    return json({ error: "rejected", message: "Your submission could not be accepted." }, 400);
  }
  if (!Number.isFinite(startedAt) || elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS) {
    return json({ error: "rejected", message: "Please take a moment to complete the form, then submit again." }, 400);
  }

  const { values, errors } = validate(form, body);
  if (Object.keys(errors).length) return json({ error: "validation", errors }, 422);

  const page = typeof body._page === "string" ? body._page.slice(0, 200) : undefined;
  const result = await deliver(form, values, { page, receivedAt: new Date().toISOString() });

  if (result.status === "delivered") return json({ ok: true }, 200);
  if (result.status === "not_configured") {
    return json(
      {
        error: "not_configured",
        message: "This form is not connected to a delivery service yet, so your details have not been sent.",
      },
      503,
    );
  }
  console.error(`[forms] delivery failed for ${form}: ${result.reason}`);
  return json({ error: "delivery_failed", message: "We couldn't send your submission. Please try again shortly." }, 502);
}
