/**
 * Lists every public claim that still needs verification before launch.
 * Run: npm run audit:claims
 */
import { modules } from "../config/features.ts";
import { integrations } from "../config/integrations.ts";
import { securityPrinciples, trustTopics } from "../content/security.ts";
import { policies } from "../config/legal.ts";
import { paletteVerified } from "../config/brand.ts";
import { comparisonApproved, marketModels } from "../config/pricing.ts";
import { regions } from "../config/regions.ts";
import { media } from "../content/media.ts";

let open = 0;
const section = (t: string) => console.log(`\n\u001b[1m${t}\u001b[0m`);
const item = (t: string) => {
  open++;
  console.log(`  • ${t}`);
};

section("Feature availability register (config/features.ts)");
for (const m of modules)
  for (const c of m.capabilities)
    if (!c.verified) item(`${m.name} → ${c.name} [status: ${c.status}] — not verified`);

section("Integrations (config/integrations.ts)");
for (const i of integrations) if (i.public && !i.verified) item(`${i.name} [${i.status}] — status not verified`);

section("Security statements (content/security.ts)");
for (const s of [...securityPrinciples, ...trustTopics]) if (s.status === "commitment") item(`${s.title} — presented as design commitment; confirm or upgrade with evidence`);

section("Legal policies (config/legal.ts)");
for (const p of policies) if (p.status !== "published") item(`${p.title} — unpublished (approved content required)`);

section("Brand, pricing, regions, media");
if (!paletteVerified) item("Brand palette is provisional (config/brand.ts)");
if (!comparisonApproved) item("Plan comparison entitlements not approved (config/pricing.ts)");
for (const [r, m] of Object.entries(marketModels)) if (m?.status !== "approved") item(`Commercial model for ${r} is ${m?.status}`);
for (const r of regions) {
  if (!r.contractingEntity?.verified) item(`${r.name}: contracting entity not confirmed`);
  if (r.complianceStatus !== "verified") item(`${r.name}: compliance status ${r.complianceStatus}`);
}
for (const [k, v] of Object.entries(media)) if (!v.src) item(`Photography slot "${k}" has no licensed image`);

console.log(`\n${open} item(s) awaiting verification or approval.\n`);
