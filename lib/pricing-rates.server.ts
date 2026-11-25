import "server-only";
import fs from "node:fs";
import path from "node:path";
import { parseRateCards, type RateCard } from "./pricing-engine";

/**
 * Loads rate cards on the server only. Sources (first found wins):
 *   1. PRICING_RATES_JSON environment variable
 *   2. config/pricing/rates.private.json (gitignored)
 *
 * Only APPROVED rate cards are returned, unless PRICING_PREVIEW=true — which
 * is intended for internal preview deployments and must never be set in production.
 */
export function getPublicRateCards(): { cards: RateCard[]; preview: boolean } {
  const preview = process.env.PRICING_PREVIEW === "true" && process.env.VERCEL_ENV !== "production";
  let raw: unknown = [];
  try {
    if (process.env.PRICING_RATES_JSON) {
      raw = JSON.parse(process.env.PRICING_RATES_JSON);
    } else {
      const file = path.join(process.cwd(), "config", "pricing", "rates.private.json");
      if (fs.existsSync(file)) raw = JSON.parse(fs.readFileSync(file, "utf8"));
    }
  } catch {
    raw = [];
  }
  const cards = parseRateCards(raw).filter((c) => c.approved || preview);
  return { cards, preview: preview && cards.some((c) => !c.approved) };
}
