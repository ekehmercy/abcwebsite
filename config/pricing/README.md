# Pricing configuration

## Published price books

`config/pricing/published-rates.ts` holds the **approved, published** price books (approved 25 Nov 2026, from the Axtara reference pricing model).

| Market | Currency | Core | Scale | Enterprise (from) | Per extra worker | Per extra project |
| --- | --- | --- | --- | --- | --- | --- |
| United States | USD | 199 | 499 | 999 | 3 | 30 |
| Jamaica | JMD | 19,900 | 49,900 | 99,900 | 300 | 3,000 |
| Nigeria | NGN | 99,000 | 249,000 | 499,000 | 1,500 | 15,000 |

All prices are per month.

**Included allowances:**

| Plan | Company-managed active projects | Own active workers |
| --- | --- | --- |
| Core | 3 | 25 |
| Scale | 10 | 100 |
| Enterprise (from) | 25 | 250 |

**Billing:** monthly, or annual prepayment with 10% off the **base only**. Additional projects and workers are always billed monthly. Enterprise prices are starting points and are confirmed by quote.

Markets without a price book (currently Guyana) are quoted in local currency.

## Changing prices

Edit `published-rates.ts`. The unit test `tests/unit/published-rates.test.ts` pins the published values, so update it in the same change.

To trial new prices without publishing them, use `PRICING_RATES_JSON` or `config/pricing/rates.private.json` (gitignored). These override a market's published book. Set `"approved": false` and `PRICING_PREVIEW=true` on a non-production deployment to show them only internally. See `rates.example.json` for both supported structures (`base-plus-allowance` and `max-of-workers-or-minimum`).
