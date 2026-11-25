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

Each entry chooses one of two commercial structures with `model`
(see `rates.example.json` for complete examples):

### Model A — `"max-of-workers-or-minimum"` (default)

```json
{
  "region": "JM", "currency": "JMD", "approved": false,
  "model": "max-of-workers-or-minimum",
  "plans": {
    "core":  { "perWorkerMonthly": 0, "minimumMonthly": 0 },
    "scale": { "perWorkerMonthly": 0, "minimumMonthly": 0 }
  }
}
```

The monthly charge is the **greater** of `own active workers × perWorkerMonthly`
or `minimumMonthly`, then the billing multiplier for the market from
`config/pricing.ts` is applied (Jamaica: ×1.15 flexible month-to-month,
×0.9 annual prepayment, 12-month commitment at the standard rate).

### Model B — `"base-plus-allowance"`

```json
{
  "region": "NG", "currency": "NGN", "approved": false,
  "model": "base-plus-allowance",
  "annualBaseDiscount": 0.1,
  "plans": {
    "core":  { "baseMonthly": 0, "includedProjects": 0, "includedWorkers": 0, "perExtraProjectMonthly": 0, "perExtraWorkerMonthly": 0 },
    "scale": { "baseMonthly": 0, "includedProjects": 0, "includedWorkers": 0, "perExtraProjectMonthly": 0, "perExtraWorkerMonthly": 0 }
  }
}
```

The monthly charge is the plan base (which includes `includedProjects`
company-managed active projects and `includedWorkers` of the company's own
workers) plus additional projects and workers at the per-unit rates. With
annual prepayment, `annualBaseDiscount` applies to the **base only**; additions
stay monthly. The calculator then offers "Monthly" and "Annual prepayment"
instead of the market's multiplier-based arrangements.

### Common rules

- `region` must match a code in `config/regions.ts` (`JM`, `NG`, `GY`, `US`).
- Enterprise is always quoted individually and has no rate card.
- Plans with the wrong shape for the chosen model are ignored.
- The calculator collects company type, own site crews, company-managed
  projects and own active workers for both models and passes them to the
  quote request.

**Which model applies to which market is a commercial decision that has not
been approved.** See `docs/REFERENCE-REVIEW.md` §6 for the conflict between
the original brief (Model A) and the reference concept (Model B).

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
