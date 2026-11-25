# Reference Review — `axtara-website (14).html` vs the current site

The reference was used as a source of **product intelligence only**. Its stylesheet, layouts, typography (Archivo), interface designs and alternative colour scheme were not adopted.

## What the reference contains

- A React concept site with embedded source.
- The original **Axtara logo**: a teal-gradient "A" mark with a navy serif wordmark.
- Five composite marketing images, which appear AI-generated.
- Detailed product data:
  - the four-application model
  - shared vs private data rules
  - an 8-stage construction lifecycle
  - a cross-company project tour
  - a proposed pricing model and a proposed capability matrix (19 Nov 2026)
  - an ROI model
  - partner pathways
  - integration boundaries
  - a personalised demo request

## 1. Important product information missing from the current site

| Topic | Gap |
| --- | --- |
| Four applications | The current site has one web app plus "worker" and "supervisor" phones. The product is four apps: GC/Developer Web, Subcontractor Web, Supervisor Field (mobile) and Field (mobile). |
| Cross-company collaboration | The current site shows a single employer. The product is built around a GC or developer inviting subcontractors into **work packages**. |
| Independent use | A subcontractor (or GC) can use Axtara without its clients or partners adopting it. This is not mentioned anywhere. |
| Data ownership | Shared package records (documents, RFIs, bid submissions, site reports) vs private company records (payroll, private rates, other projects, other customers). This is a key purchase objection for subcontractors and is not addressed. |
| Construction workflows | Work packages, bid invitations and addenda, technical RFIs (kept separate from bids), change requests, inspections, corrective items, handover and closeout. None are covered today. |
| Product boundaries | An RFI answer is not a change approval. Reviewing a subcontractor's report does not approve their payroll. Hours are not progress. Axtara is not estimating, accounting or CPM software. These boundaries build trust and are absent. |
| Lifecycle | Where Axtara adds value from package preparation to closeout, and which adjacent tools it sits beside. |

## 2. Existing sections improved rather than replaced

- **Brand:** the colours are corrected to the specified teal/navy palette and the original logo is used. Everything else in the design system is kept.
- **Industry pages:** enriched with each buyer's real jobs, the apps their team uses and their data-ownership position. The layout is unchanged.
- **Integrations:** each category now states what stays in the specialist tool and what flows to or from Axtara.
- **Pricing calculator:** gains company type, active projects and own-crews inputs, and the engine now supports both proposed pricing structures (section 6). No prices are published.
- **Demo form:** personalised by buyer type and main challenge. The page shows what the demo will focus on.
- **Explorer:** gains two construction modules (Bids and RFIs; Inspections and Handover), each with an interactive preview.
- **Mobile page:** aligned to the two field apps (Supervisor Field and Field).

## 3. New functionality that adds customer value

- **Cross-company project tour** (`/tour`): one project followed across the four apps and two companies, with a privacy note at every step.
- **ROI calculator** (`/roi`): presets per business type, hours recovered, value, net of subscription, payback. Clearly an estimate.
- **Shared-vs-private explorer:** "what can the GC see?" on the collaboration page.
- **Lifecycle explorer** (`/lifecycle`): 8 stages, GC and subcontractor views, records produced, and adjacent tools.
- **Partner programme** (`/partners`): referral, reseller, implementation and technology pathways, with a working enquiry form. No commercial terms promised.

## 4. Consolidation to prevent repetition

- The reference repeats the four-app model, the boundaries and the privacy rules on many pages. Here they live once, on the **collaboration page**, with short links from elsewhere.
- The homepage gains **one** compact "Shared projects, separate companies" section. Lifecycle, tour, ROI and partners stay on inner pages.
- The reference's separate "Who it's for" overview and "Why Axtara" page are not reproduced. That content is folded into the industry pages, the collaboration page and the FAQ.

## 5. Information placed on inner pages, not the homepage

| Page | Content |
| --- | --- |
| `/collaboration` | Four apps, shared vs private records, independent use, product boundaries |
| `/lifecycle` | Stage-by-stage fit and adjacent tools |
| `/tour` | Cross-company project story |
| `/roi` | Value estimate |
| `/partners` | Partner pathways and enquiry |

## 6. Conflicting pricing and commercial assumptions (require confirmation)

| Topic | Original brief | Reference concept | Status |
| --- | --- | --- | --- |
| Charge basis | Greater of (active workers × per-worker rate) or plan minimum | Base subscription per plan that includes N company-managed projects and N own workers, plus per-additional-project and per-additional-worker charges | **Conflict** |
| Billing arrangements (Jamaica) | 12-month commitment billed monthly; flexible month-to-month +15%; annual prepayment −10% | Monthly or annual; annual = 10% off the **base only**, additions always monthly; no flexible option | **Conflict** |
| Example prices | None approved | USD 199/499/999; J$19,900/49,900/99,900; ₦99,000/249,000/499,000 base; per-worker 3 / 300 / 1,500; per-project 30 / 3,000 / 15,000. Labelled "proposed … not a published price list" | **Not published** |
| Markets with price books | Jamaica, Nigeria, Guyana, United States | USD markets, Jamaica, Nigeria (no Guyana); Canada in the demo form | **Conflict** |
| Billing rules | Not specified | Office users included; GC not billed for subcontractors' workers; incoming invitations don't use project allowance; one subscription per company; no separate supervisor app subscription | **Needs approval** before publication |
| Plan entitlements | Indicative three-tier comparison | 138-row proposed capability matrix. Every row is "Not validated"; payroll preparation starts on Scale (Core exports approved time) | **Conflict** with the current comparison table (payroll on Scale — consistent; others differ) |
| Partner terms | — | "No commissions, discounts or free licences offered or promised" | Adopted as the public position |

**Resolution (25 Nov 2026):** Axtara approved publishing the reference price books. The site now uses the base-plus-allowance structure for the United States, Jamaica and Nigeria, with monthly or annual billing (10% off the base). The brief's +15% month-to-month option is withdrawn. Guyana is quoted until a price book is supplied.

**Previous handling, kept for reference:**
- The pricing engine supports **both** structures. The model, rates, allowances and modifiers are set per market in the private, gitignored rate card.
- The calculator still never displays a price unless a rate card is `approved: true`.
- All items above are listed in `docs/PUBLICATION-CHECKLIST.md`.

## 7. Other notes

- **Reference images:** they appear AI-generated (composited scenes, synthetic device screens). Your earlier brief asked to avoid AI imagery, so they are **not** used on the site. If they are approved assets, they can be registered in `content/media.ts`.
- **Payroll files:** the reference notes that a payroll-schedule PDF is "not automatically an ADP-compatible import". That boundary is reflected in the payroll copy, and no payroll provider is named.
