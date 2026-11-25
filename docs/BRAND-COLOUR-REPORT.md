# Axtara Brand Colour Extraction Report

**Status: NOT VERIFIED — extraction blocked. The website currently uses provisional brand values.**

## What was attempted

The official reference for Axtara's colours is <https://www.axtara.com/>. Before refining the design, three independent methods were tried from the build environment:

| Method | Result |
| --- | --- |
| Playwright (Chromium), real browser through the environment proxy | `net::ERR_TUNNEL_CONNECTION_FAILED` — the proxy refused the connection |
| HTTPS request (`curl`) | DNS: `www.axtara.com` does not resolve from the build environment |
| Web fetch service | `getaddrinfo ENOTFOUND www.axtara.com` |

A search of the repository found **no original Axtara logo, favicon or brand asset**. The only logo is the provisional wordmark created for this build (`components/layout/logo.tsx`).

As instructed, **no colours were guessed or presented as official**. No colour was taken from photography or decorative imagery.

## Values currently in use (provisional — not Axtara brand colours)

| Token | HEX | RGB | Source |
| --- | --- | --- | --- |
| Primary (`brandSource.primary`) | `#244BCC` | 36, 75, 204 | **Provisional placeholder** |
| Accent (`brandSource.accent`) | `#E39B2D` | 227, 155, 45 | **Provisional placeholder** |
| Secondary | — | — | Not set (none known) |

Everything else in the system is generated from these two values, so replacing them re-themes the whole site.
- **Derived from the primary:** hover (`brand-700`), active (`brand-800`), tint (`brand-50`), shade (`brand-900`) and the dark ink surfaces.
- **Derived from the accent:** the accent ramp.

## Newly designed values (not brand colours — keep these)

| Role | HEX |
| --- | --- |
| Main background | `#FBFBFA` |
| Secondary background | `#FFFFFF` |
| Primary text | `#0C0D0D` |
| Secondary text | `#51534F` |
| Muted text | `#6C6E6A` |
| Borders | `#E5E5E1` |
| Dividers | `#EEEEEB` |
| Success | `#16794A` on `#E6F4EC` |
| Warning | `#A15C07` on `#FDF1DE` |
| Error | `#B4321F` on `#FCE9E5` |
| Information | follows the primary brand colour |

## How to complete the extraction (about 5 minutes)

1. Allow `www.axtara.com` in this environment's network settings (Network access → Allowed domains), or run the script on any machine with internet access.
2. Run:
   ```bash
   node scripts/extract-brand-colours.cjs
   ```
   It opens the site in Chromium and reads:
   - `:root` CSS custom properties
   - the computed colours of the navigation, CTA buttons, links, active states and footer
   - the `theme-color` meta tag
   - the logo and favicon artwork (SVG fills, or files listed for manual inspection)

   It then overwrites this file with the exact HEX/RGB values and where each was found.
3. Cross-check the top candidates against the logo artwork. Then set `brandSource.primary`, `brandSource.accent` (and `secondary` if there is one) in `config/brand.ts`, and set `paletteVerified = true`.
4. Replace the provisional wordmark in `components/layout/logo.tsx` with the original logo file placed in `public/brand/`.

Alternatively, send the official HEX values and logo files and they can be applied directly.
