# Private pricing rates

The public website contains **no monetary values**. Per-worker rates and plan
minimums are supplied privately and only reach a visitor's browser once they
are explicitly approved for publication.

## Supplying rates

Use **one** of:

1. **Environment variable (recommended for hosted deployments)** — set
   `PRICING_RATES_JSON` to a JSON array in the shape of `rates.example.json`.
2. **Local file** — copy `rates.example.json` to `rates.private.json` in this
   folder. The file is gitignored and must never be committed.

Each entry:

```json
{
  "region": "JM",
  "currency": "JMD",
  "approved": false,
  "plans": {
    "core":  { "perWorkerMonthly": 0, "minimumMonthly": 0 },
    "scale": { "perWorkerMonthly": 0, "minimumMonthly": 0 }
  }
}
```

- `region` must match a code in `config/regions.ts` (`JM`, `NG`, `GY`, `US`).
- Enterprise is always quoted individually and has no rate card.
- The monthly charge is the **greater** of `workers × perWorkerMonthly` or
  `minimumMonthly`, then the billing multiplier from `config/pricing.ts`
  (e.g. ×1.15 flexible, ×0.9 annual prepayment) is applied.

## Approval

- `"approved": false` — rates are never sent to the browser. The calculator
  still works end to end (country, currency, workers, plan, billing modifiers,
  minimum rule) and finishes with a “Get your {currency} quote” request.
- `"approved": true` — the calculator shows the computed subscription price
  prominently for that market (Jamaica / JMD is the priority market).
- `PRICING_PREVIEW=true` shows unapproved rates (with an “Internal preview”
  label) on non-production deployments only. Never set it in production.

Billing arrangements, plan descriptions and the plan comparison live in
`config/pricing.ts`. `comparisonApproved` and each market model's `status` are
internal flags for the private publication checklist — they are never shown on
the website. Set them once plan packaging and market terms are signed off.
