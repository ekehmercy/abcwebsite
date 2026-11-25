# Axtara Website — Launch-Readiness Report

_Status at handover. Re-run `npm run audit:claims` for the live list of outstanding approvals._

## Summary

The website is fully built and functional. It passes type-checking, unit tests and the end-to-end QA suite. Lighthouse targets are met on desktop; they are close on mobile (see Performance).

**It is not ready for public launch until the approvals below are completed.** The blockers are business inputs — brand colours, verified product claims, legal text, pricing and form delivery — not engineering work. The site is built to display each of these honestly until they arrive.

---

## 1. Completed functionality

| Area | Status |
| --- | --- |
| **Routes** | All 27 required routes, plus `/login`, a custom 404, `sitemap.xml`, `robots.txt` and dynamic Open Graph images (`/og`). |
| **Design system** | Centralised tokens in `config/brand.ts`, exposed as CSS variables. Geist / Geist Mono typography with `clamp()` scales, a 12-column grid and 8-point spacing. |
| **Product demonstration UI** | A reusable app frame, phone frame and 9 desktop and 10 mobile screens, all using one consistent fictional dataset. They reflow with container queries on phones. |
| **Homepage** | 11 sections:<br>• animated hero (worker clocks in → review queue → approval → dashboard update, with pause control)<br>• fragmented → connected interactive<br>• 8-tab product explorer<br>• 7-step operational journey (play/pause, previous/next, restart, clickable steps)<br>• field / mobile section<br>• 6-persona switcher<br>• integrations, security and pricing introductions<br>• final call to action |
| **Platform and features** | Platform overview with a clickable product map that separates operational records, approval stages and externally processed transactions. 8 feature pages are generated from the feature register. |
| **Industries** | 4 industry pages with distinct copy, visuals and illustrative scenarios. |
| **Pricing** | Configurable engine: the charge is the greater of workers × rate or the plan minimum; Jamaica billing is +15% flexible, −10% annual. Country and currency selector, worker count, plan suggestion, billing selector, comparison table, separate charges and FAQs. Quote links pre-fill the demo form. |
| **Forms** | Demo, contact, integration request and security contact forms:<br>• validation in the browser and on the server, with accessible errors<br>• honeypot, timing and rate-limit spam protection, plus an origin check<br>• webhook (HMAC-signed) and/or email delivery<br>• never shows success unless the submission was actually delivered |
| **Navigation** | Sticky header with mega menus (keyboard arrows, Escape, focus return, hover intent) and a focus-trapped mobile drawer. Footer region selector shows the contracting entity for that market. |
| **Trust** | Security and Trust centre with sections for Nigeria, Jamaica, Guyana and the US, and a security / privacy contact form. |
| **Content** | Resources centre with search, category filter, article layout and related reading. Draft articles are hidden in production. |
| **Analytics and consent** | Optional and privacy-conscious; nothing loads before consent. Functional cookie preferences dialog. 10 conversion events are wired. |
| **SEO** | Unique metadata, canonical URLs, Open Graph and Twitter cards, and structured data (Organization, SoftwareApplication, FAQPage, Article). Unpublished and draft pages are `noindex` and left out of the sitemap. |
| **Documentation** | `README.md` (setup, content updates, deployment), `.env.example`, `config/pricing/README.md`. |

## 2. Testing results

| Check | Result |
| --- | --- |
| TypeScript (`npm run lint`) | Pass |
| Unit tests (`npm test`) | 12 / 12 — pricing engine and form validation |
| Production build | Pass — 32 static or SSG pages; dynamic: `/pricing`, `/api/forms/[form]`, `/og` |
| End-to-end (`npm run test:e2e`) | 205 / 205 checks:<br>• 28 routes × 6 widths (375, 390, 768, 1024, 1440, 1920) with no console errors, no horizontal scroll and exactly one `h1`<br>• all internal links resolve<br>• mega menu keyboard and Escape, tabs and arrow keys, fragmented toggle, journey controls, cookie dialog, pricing calculator, form validation, mobile drawer, sitemap and robots |
| Form API (manual) | Bad origin → 403, too fast → 400, honeypot → 400, invalid → 422 with field errors, unknown form → 404, no delivery configured → 503. **A successful delivery has not been tested** because no webhook or email is configured. |

### Lighthouse (production build, local server)

| Page | Mobile Perf | Desktop Perf | Accessibility | Best Practices | SEO | Mobile LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 88 | 100 | 97 | 96 | 100 | 3.7 s | 0 |
| `/platform/time-attendance` | 92 | 100 | 96 | 96 | 100 | 3.3 s | 0 |
| `/pricing` | 92 | 100 | 96–100 | 96 | 100 | 3.3 s | 0 |
| `/demo` | 92 | 100 | 96–100 | 96 | 100 | 3.2 s | 0 |
| `/industries/general-contractors` | 96 | 100 | 96–100 | 96 | 100 | 2.8 s | 0 |
| `/mobile` | 91 | 100 | 97 | 96 | 100 | 3.5 s | 0 |

**What this means**
- Desktop meets every target, with LCP around 0.7 s.
- Under Lighthouse's simulated slow-4G mobile throttling, LCP is 2.8–3.7 s, above the 2.5 s target, and homepage mobile performance is 88 (target 90).
- These figures come from a local `next start` server without a CDN. Re-measure on the production host, where caching and compression usually improve them.
- Best Practices 96 reflects the local HTTP server; it should reach 100 under HTTPS.
- INP was not measured. It needs real-user data; Total Blocking Time in the lab was 10–140 ms.

## 3. Items requiring approved product screenshots or a demo environment

Every product interface is an HTML/CSS reconstruction labelled *“Illustrative product demonstration · fictional data”*. The layouts, navigation labels and workflows (e.g. site-boundary checks, review queue, payroll preparation stages) are proposals, not copies of the real Axtara product.

**Action:** share current web and mobile screenshots or demo access. The screens in `components/product-demo/` can then be aligned to the real product, or replaced.

## 4. Unverified feature claims

`config/features.ts` lists **55 capabilities, none verified**.

**The statuses were assigned by the build team as placeholders and must be confirmed by Product**:

- 47 are marked *available*. In production these display **“Confirm in demo”** until `verified: true`.
- 5 are marked *in development*: shift scheduling, facial verification, field communication, operational risk monitoring, payroll schedule generation.
- 2 are marked *planned*: recruitment and onboarding, payslip-related workflows.
- 1 is marked *integration required*: external payroll handoff.

**Copy that describes product behaviour and also needs Product review:**
- the homepage journey
- the feature-page workflows
- the mobile page principles
- the draft article “How an attendance exception moves through Axtara”
- the security statements, all currently labelled *Design commitment*

## 5. Legal policy content required

Privacy Policy, Terms of Service, Subscription Policy and Cookie Policy are all **unpublished**. They show a “being finalised” notice, are `noindex`, and are excluded from the sitemap.

**Action:** supply approved text in `config/legal.ts`. The demo form's privacy note links to the privacy policy, so it should be published before launch.

## 6. Pending pricing approval

- **No prices are in the codebase.** The calculator shows the plan structure, billing adjustments and the minimum-charge rule, then asks for a quote.
- **Jamaica:** the commercial model is shown as *Proposed*.
- **Nigeria, Guyana, United States:** shown as *Under review*.
- **Plan comparison:** entitlements are marked indicative (`comparisonApproved = false`).

**Action:** approve the rate cards (see `config/pricing/README.md`), the plan packaging and the market models.

## 7. External integration and configuration

| Item | Configuration |
| --- | --- |
| Form delivery (**required**) | Set `FORMS_WEBHOOK_URL` (+ `FORMS_WEBHOOK_SECRET`) and/or `RESEND_API_KEY`, `FORMS_EMAIL_TO`, `FORMS_EMAIL_FROM`. Until then, every form returns “not connected”. |
| Rate limiting | The in-memory limiter is per server instance. Use a shared store (e.g. Redis) or platform rate limiting on multi-instance or serverless hosting. |
| Contact emails | `NEXT_PUBLIC_SALES_EMAIL`, `_SUPPORT_EMAIL`, `_PRIVACY_EMAIL`, `_SECURITY_EMAIL`. Hidden until set. |
| Customer login | `NEXT_PUBLIC_APP_LOGIN_URL`. `/login` explains sign-in until set. |
| App stores | `NEXT_PUBLIC_APP_STORE_URL`, `NEXT_PUBLIC_GOOGLE_PLAY_URL`. Download buttons only appear when these are set. |
| Analytics | `NEXT_PUBLIC_ANALYTICS_PROVIDER` (plausible / custom). Off by default. |
| Integrations directory | Lists integration types only. No vendor is named until `partnerConfirmed: true`. |

## 8. Deployment blockers

1. **Brand palette and logo are provisional.** `www.axtara.com` could not be reached from the build environment, so the official HEX values were not extracted. Update `config/brand.ts` (`paletteVerified`) and `components/layout/logo.tsx`.
2. **No licensed photography.** Six image slots (`content/media.ts`) render a neutral architectural placeholder, with art-direction briefs visible outside production.
3. **Legal policies not published** (section 5).
4. **Form delivery not configured** (section 7).
5. **Feature register not verified** (section 4).
6. **Contracting entities.** Only Jamaica's (AnchorBridge Jamaica Limited) is confirmed. Nigeria, Guyana and the US show “confirmed in your order form”.
7. **Compliance status:** Jamaica *in review*; Nigeria, Guyana and the US *not yet assessed*.
8. **Resources articles are drafts** (7). Review and set `status: "published"` to make them public.

Non-blocking follow-ups:
- re-measure Lighthouse on the production host
- add real-user monitoring for INP
- consider a shared rate-limit store
