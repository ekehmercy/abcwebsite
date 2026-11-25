# Axtara — Product Marketing Website

The product-led marketing website for **Axtara**, the connected workforce and project operations platform for construction and project-driven businesses. Axtara is a product of Anchor Bridge.

Built with Next.js (App Router), React, TypeScript and Tailwind CSS. Product demonstrations are real HTML/CSS components — not screenshots — so they stay sharp, accessible and editable.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in what you have; everything is optional for local dev
npm run dev                  # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | TypeScript type-check |
| `npm test` | Unit tests (pricing engine, form validation) |
| `npm run test:e2e` | Playwright QA against a running server (`BASE_URL=…`) |
| `npm run audit:claims` | Lists every claim, policy, price and asset still awaiting approval |

Requires Node.js 22+.

---

## Project structure

```
app/                     Routes (App Router). Feature and industry pages are data-driven:
  platform/[module]/       → config/features.ts
  industries/[industry]/   → config/industries.ts
  api/forms/[form]/        Server-side form handling (validation, spam protection, delivery)
  og/                      Dynamic social-sharing images
components/
  layout/                Header (mega menus, mobile drawer), footer, region selector, cookie consent
  marketing/             Page sections and templates (hero, journey, explorer, feature/industry pages)
  product-demo/          The Axtara demonstration UI system: AppFrame, PhoneFrame, screens, mobile screens
  forms/                 Accessible form components
  ui/                    Buttons, tabs, badges, reveal, icons, editorial image
config/                  Centralised business configuration (see below)
content/                 Demo data, resources articles, FAQs, security statements, media registry
lib/                     Pricing engine, validation, analytics, SEO, claims logic, delivery
public/brand, public/images
scripts/audit-claims.ts  Launch-readiness audit
tests/                   Unit and end-to-end tests
```

---

## Where business information lives

Nothing business-critical is hardcoded in components. Update these files instead:

| File | Controls |
| --- | --- |
| `config/brand.ts` | **Design tokens** — colours, radii, motion. Injected as CSS variables; Tailwind maps onto them. |
| `config/site.ts` | Company name, contact emails, application and app-store URLs (via env) |
| `config/features.ts` | **Feature availability register** — every capability shown on the site, with `status` and `verified` |
| `config/industries.ts` | Industry page content and scenarios |
| `config/pricing.ts` | Plans, billing arrangements, market commercial models, comparison table (no prices) |
| `config/pricing/rates.private.json` | **Private, gitignored** rate cards (or `PRICING_RATES_JSON`) — see `config/pricing/README.md` |
| `config/regions.ts` | Markets, currencies, contracting entities, privacy frameworks, compliance status |
| `config/integrations.ts` | Integration registry — status and public visibility; no vendor named until confirmed |
| `config/legal.ts` | Legal policies — unpublished until approved content is added |
| `config/navigation.ts` | Header and footer navigation |
| `config/analytics.ts` | Analytics provider and tracked conversion events |
| `content/security.ts` | Security statements — `implemented` vs `commitment` |
| `content/media.ts` | Photography slots, briefs, licence and credit |
| `content/demo-data.ts` | Fictional demonstration organisation, projects and people |

### Claims discipline

The site is built so that it **cannot overstate** the product:

- **Feature claims** — a capability marked `available` is only shown as available when `verified: true`. In production (`NEXT_PUBLIC_CLAIMS_MODE=strict`, the default) unverified capabilities display *“Confirm in demo”*. Planned or in-development items always show their status.
- **Security** — statements are labelled *Design commitment* until engineering evidence upgrades them to `implemented`. No certifications are claimed.
- **Integrations** — no third-party vendor is named until `partnerConfirmed: true`.
- **Pricing** — no prices ship in the repository. Only rate cards with `"approved": true` are ever sent to the browser.
- **Legal** — policy pages say they are being finalised and are `noindex` until approved text is supplied.
- **Product UI** — every demonstration is labelled illustrative and uses fictional data.

Run `npm run audit:claims` before launch to see everything still outstanding.

---

## Common content updates

**Apply the verified brand palette** — edit `palette` in `config/brand.ts`, set `paletteVerified = true`. Replace the provisional wordmark in `components/layout/logo.tsx` with the approved logo (place files in `public/brand/`).

**Verify a feature** — in `config/features.ts`, set the capability's `status` and `verified: true`.

**Add photography** — put licensed images in `public/images/`, then set `src`, `credit` and `licence` for the slot in `content/media.ts`. Images are served through `next/image` (AVIF/WebP, responsive sizes).

**Use real product screenshots** — when approved screenshots exist, they can replace or sit beside the components in `components/product-demo/`. The fictional data in `content/demo-data.ts` keeps all current demonstrations consistent.

**Publish a legal policy** — add the approved text to `content` in `config/legal.ts`, set `status: "published"`, `effectiveDate` and `approvedBy`.

**Publish an article** — set `status: "published"` in `content/resources.ts`. Drafts show only in development or with `CONTENT_PREVIEW=true`.

**Approve pricing** — see `config/pricing/README.md`.

---

## Forms

`/demo`, `/contact`, `/integrations` and `/security` submit to `POST /api/forms/[form]`, which:

1. validates with the same rules as the browser (`lib/validation.ts`),
2. rejects spam (honeypot field, minimum completion time, per-IP rate limit, origin check),
3. delivers to a CRM/automation **webhook** (`FORMS_WEBHOOK_URL`, HMAC-signed with `FORMS_WEBHOOK_SECRET`) and/or **email** via Resend (`RESEND_API_KEY`, `FORMS_EMAIL_TO`, `FORMS_EMAIL_FROM`).

If no delivery channel is configured the API returns **503** and the form tells the visitor it is not connected yet — it never shows a false confirmation. Credentials stay server-side.

> The built-in rate limiter is in-memory (per server instance). For multi-instance production hosting, back it with a shared store such as Redis or your platform's edge rate limiting.

---

## Analytics and consent

Analytics is **off** unless `NEXT_PUBLIC_ANALYTICS_PROVIDER` is set (`plausible` or `custom`). When consent is required (default), nothing loads until the visitor allows it in the banner or *Cookie preferences*. Tracked events are listed in `config/analytics.ts` (demo CTA clicks, form starts and submissions, product tour start and completion, pricing calculator use, feature and industry page views, integration requests).

---

## Deployment

The site needs a Node.js runtime for the form API and server-only pricing; everything else is statically generated.

**Vercel (recommended)** — import the repository, set environment variables from `.env.example`, deploy. Set `ALLOW_INDEXING=false` on preview deployments.

**Any Node host**

```bash
npm ci
npm run build
npm start            # serves on PORT (default 3000)
```

Security headers are set in `next.config.ts`. Put the site behind HTTPS.

---

## Accessibility and performance

- WCAG 2.2 AA approach: semantic landmarks, one `h1` per page, skip link, visible focus, keyboard-operable menus/tabs/walkthroughs, `aria-live` updates, status shown with icon + text (never colour alone), reduced-motion support (animations stop; autoplay disabled).
- Product demonstrations use container queries so they reflow into readable layouts on phones rather than shrinking.
- Interactive sections receive server-rendered panels, keeping client JavaScript small. Fonts are self-hosted (Geist via `next/font`).
