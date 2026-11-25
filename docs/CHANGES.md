# Refinement Update — Summary of Changes

## 1. Positioning: Axtara as a complete product

- **Present-tense copy everywhere.** All copy is present tense and outcome-led. A crawl of every route's rendered text finds none of the banned development-stage phrases ("in development", "planned", "proposed", "under review", "being finalised", "design commitment", "confirm in demo", "draft", and the rest). The crawl is also part of the E2E suite.
- **Release-stage system** (`lib/release.ts`, `NEXT_PUBLIC_RELEASE_STAGE`):
  - **`staging`** is the default. Everything in the registers is presented as part of the product, and the site is **never indexable** (`robots.txt` disallow plus `noindex`).
  - **`public`** shows only items marked `verified: true`. Anything unverified is omitted, never labelled, and sections that would be empty collapse.
- **Internal registers.** Capability, integration and security statuses are internal fields only. The old on-page availability badges are removed.
- **Private publication checklist.** `npm run audit:claims` writes `docs/PUBLICATION-CHECKLIST.md` (111 items at handover).
- **Safeguards kept:**
  - no fabricated customers, statistics or testimonials
  - no certification or regulatory badges
  - no vendor named as a partner
  - no unapproved prices
  - payroll preparation is always distinguished from external payroll execution

## 2. Brand colours

- **Extraction attempted three ways, all blocked by the build environment's network policy:**
  - Playwright browser
  - direct HTTPS request
  - web-fetch service

  No original brand asset exists in the repository. Details are in `docs/BRAND-COLOUR-REPORT.md`.
- **Colours were not guessed.** The palette remains clearly marked provisional.
- **Ready to apply the real values:**
  - `config/brand.ts` is restructured around two brand source values (primary, accent). Every tint, shade, hover, active state and dark surface is derived from them, alongside a full semantic token set (backgrounds, text, borders, status).
  - Each token records whether it comes from the brand or was newly designed.
  - All tokens are exposed as CSS variables (`--ax-*` plus the scales).
  - `scripts/extract-brand-colours.cjs` performs the full extraction (CSS variables, nav, CTAs, links, active states, footer, theme-color, logo and favicon artwork) and writes the report once `www.axtara.com` is reachable.

## 3. Homepage

- **Hero:** "The work happens everywhere. Manage it from one place." with the new supporting line and the descriptor "Workforce and project operations for construction". The desktop app now shows labour cost alongside attendance, approvals, projects and exceptions, and the mobile app is named **Axtara Field**.
- **Signature walkthrough:** "From the jobsite to the boardroom", in 6 steps (field worker, site verification, supervisor, project manager, finance, executive).
  - Every step is a working interface: tap **Clock in**, approve on the supervisor phone, resolve an attendance exception, switch project records, clear payroll variances and prepare the schedule, then filter the executive view by project.
  - Controls: previous/next, clickable steps, progress, play/pause, restart.
- **Explorer, personas, feature pages and industry pages** now use **interactive** product screens (section 4).
- **Integrations:** "Your operation, connected to the tools you trust." with no status labels. Only confirmed integrations display as connected.
- **Security:** rewritten as a restrained list of present-tense controls; card grid and labels removed.
- **Restraint:** decorative eyebrow rules removed, fewer card patterns, and demonstration data labelled discreetly as "Demonstration data".

## 4. Interactive product demonstrations (`components/product-demo/interactive.tsx`)

| Module | What visitors can do |
| --- | --- |
| Workforce | Filter direct / subcontracted workers, open a profile with assignment, documents and certifications |
| Time and Attendance | Select records, review an out-of-boundary exception, choose a reason, resolve it, approve individual or all pending hours |
| Field Operations | Switch between report, expenses and incidents; open site photos; approve or reopen the daily report |
| Project Operations | Switch between Harbour Point, Cedar Heights and Riverside, each with its own cost codes, risks, crews and labour figures |
| Expenses | Select claims, view receipt and cost code, approve or query; approved claims add to project cost |
| Payroll Preparation | Review variances, then approve and prepare the schedule. It always states that the payroll provider pays employees and that Axtara holds no funds |
| Safety and Compliance | Certifications, company credentials and incidents tabs; request renewals |
| Reporting | Select a project to filter the operational exceptions |
| Mobile (Axtara Field) | Working Clock in button with location check; working supervisor approval |

One fictional organisation is used throughout: **Meridian Construction Group**, with Harbour Point Commercial Development, Cedar Heights Residential Estate and Riverside Infrastructure Project. Per-project data lives in `content/demo-data.ts`.

## 5. Secondary pages

- **Pricing:**
  - the proposed / under-review / being-finalised wording is removed
  - the calculator ends in a "Your Axtara quote" experience with a "Get your {currency} quote" button
  - approved JMD rates display prominently as soon as a rate card is approved
- **Integrations:** category directory with outcomes and a "Request this connection" button that pre-fills the working enquiry form.
- **Security:**
  - present-tense controls, with country sections describing how Axtara supports employers' obligations
  - no compliance-status chips
  - the contact form is kept
- **About, FAQ, legal, resources, demo:** confident language. Legal pages without approved text describe what each policy covers and how to request it, and stay `noindex`.

## 6. Engineering

- Tab panels and walkthrough steps mount on first view, keeping hydration light even though every demo is interactive.
- Typography stays on **Geist + Geist Mono** (two families). Geist was chosen over Inter, Manrope and Plus Jakarta Sans for its precision at small interface sizes inside the product demos, and its restrained character at display sizes, which suits an operational product.

## 7. Verification results

See the final summary in the session. Tests are in `tests/`; run `npm test` and `npm run test:e2e`.

---

# Update 3 — Brand palette, original logo and product intelligence from the reference

The existing design (layouts, typography, components, interactions) is retained. The changes are the mandatory brand colours and the original logo, plus richer construction product knowledge. A full comparison with the reference is in `docs/REFERENCE-REVIEW.md`.

## Brand

- **Palette:** the specified palette is applied through tokens (`config/brand.ts`):
  - teal `#009DA5`, turquoise `#00BEC4`, deep teal `#07575E`
  - navy `#02102B`, off-white `#F7F7F2`
  - text `#111111` / `#242424`
  - supporting colours `#007C84`, `#E6F7F7`, `#C3EBE8`, `#64748B`, `#DDE7E7`, `#061F29`
- **Accessibility:** white text sits on `#007C84` rather than `#009DA5` (see `docs/BRAND-COLOUR-REPORT.md`). The reference's alternative scheme was not adopted.
- **Logo:** the original logo is extracted from the reference with a transparent background, plus a light-wordmark variant, a favicon and a touch icon. It is used in the header, footer, mobile menu, integrations hub and social images.

## New product knowledge

| Addition | Where |
| --- | --- |
| Four connected applications (GC/Developer Web, Subcontractor Web, Supervisor Field, Field) | `/collaboration`, homepage, `/mobile`, industry pages |
| Cross-company collaboration, independent use and data ownership | `/collaboration` ("What can the GC see?" explorer), homepage "Shared projects. Separate companies." |
| Work packages, bid invitations, addenda, RFIs, change requests | New module `/platform/bids-rfis` with an interactive preview (answer an RFI, chase an addendum, award a bid) |
| Inspections, corrective items, handover readiness | New module `/platform/inspections-handover` with an interactive preview (accept closure evidence, request documents, publish readiness) |
| Construction lifecycle (8 stages, GC and subcontractor views, adjacent tools) | `/lifecycle` |
| Industry value propositions | Industry pages gain "What you do in Axtara", the apps each team uses, data position; developers get both delivery modes |
| Cross-company product tour | `/tour`: seven interactive moments across Meridian (GC), Volt Line Electrical (subcontractor) and Seabreeze Developments (developer), each with a "Who sees what" note |
| ROI calculator | `/roi`: presets per business type, hours recovered, value, net of subscription, payback. Visitor-entered costs only. |
| Pricing estimator | Company type, own crews and active projects inputs; the engine supports both proposed commercial structures; still no prices unless a rate card is approved |
| Partner programme | `/partners`: referral, reseller and regional, implementation, technology pathways, with a working enquiry form |
| Integration ecosystem | Each category states what stays in the specialist tool and what flows with Axtara |
| Personalised demo | Business type and challenge drive a live "Your demo agenda" |

## Consolidation

- The four-app model, product boundaries and privacy rules are written **once**, on `/collaboration`; other pages link to it.
- The homepage gains one compact section. Lifecycle, tour, ROI and partners live on inner pages.
- The explorer covers ten modules, using short tab labels so they fit on one row.

## Release gating

Every new product claim carries an internal `verified` flag. Staging shows the complete product; the public release omits anything unverified. The private checklist (`npm run audit:claims` → `docs/PUBLICATION-CHECKLIST.md`) now lists 186 items, including the commercial conflicts between the original brief and the reference.
