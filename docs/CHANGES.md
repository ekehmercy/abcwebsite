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
