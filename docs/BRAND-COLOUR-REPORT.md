# Axtara Brand Colours — Applied Palette

**Status: applied.** These values were supplied by Axtara (screenshot-derived) and are applied as mandatory brand colours. They are centralised in `config/brand.ts`, exposed as CSS variables (`--brand-*`, `--accent-*`, `--n-*`, `--ink-*`, `--ax-*`) and mapped into Tailwind.

The live site <https://www.axtara.com/> is still unreachable from the build environment (DNS and proxy blocked), so these values could not be cross-checked against its computed CSS. `scripts/extract-brand-colours.cjs` will produce that cross-check when run with network access.

## Brand colours

| Role | HEX | RGB | Token(s) | Where it is used |
| --- | --- | --- | --- | --- |
| Primary teal | `#009DA5` | 0, 157, 165 | `brand-500`, `--ax-primary` | Brand accents, icons, charts, meters, focus rings, data paths |
| Bright turquoise | `#00BEC4` | 0, 190, 196 | `brand-400`, `accent-500` | Highlights, live indicators, accents on dark sections |
| Deep teal | `#07575E` | 7, 87, 94 | `brand-800`, `--ax-secondary` | Pressed states, subcontractor app mark, tags on light teal |
| Brand navy | `#02102B` | 2, 16, 43 | `ink-950`, `--ax-navy` | Logo wordmark, final call-to-action band, deepest surfaces |
| Warm off-white | `#F7F7F2` | 247, 247, 242 | `n-25`, `--ax-background` | Page background |
| White | `#FFFFFF` | 255, 255, 255 | `n-0` | Cards, panels, application surfaces |
| Primary text | `#111111` | 17, 17, 17 | `n-950` | Headlines and primary text |
| Secondary text | `#242424` | 36, 36, 36 | `n-800` | Secondary emphasis text |

## Supporting UI colours

| Role | HEX | Token(s) | Use |
| --- | --- | --- | --- |
| Dark teal hover | `#007C84` | `brand-600`, `--ax-primary-hover` | **Filled buttons and links** (see accessibility), hover states |
| Light teal surface | `#E6F7F7` | `brand-50`, `--ax-tint` | Selected rows, tags, info backgrounds |
| Pale turquoise | `#C3EBE8` | `brand-100` | Selection, light accents on dark sections |
| Muted text | `#64748B` | `--ax-text-muted` | Muted text on white |
| Subtle border | `#DDE7E7` | `n-150`, `--ax-border` | Borders and dividers |
| Dark section background | `#061F29` | `ink-900`, `--ax-background-dark` | Product explorer, scenario and supervisor sections |

## Accessibility adjustments (WCAG 2.2 AA)

| Pair | Contrast | Decision |
| --- | --- | --- |
| White on `#009DA5` | 3.30:1 | Fails AA for normal text. `#009DA5` is reserved for accents, large display and non-text UI (≥ 3:1). |
| White on `#007C84` | 4.98:1 | Passes. Used as the base for filled buttons and small interactive labels, with `#066A71` and then deep teal on hover. |
| `#007C84` on `#F7F7F2` | 4.63:1 | Passes. Used for text links. |
| `#64748B` on `#F7F7F2` | 4.43:1 | Just below AA. Small muted text on the off-white background uses `#5F6F84` (`n-500`); `#64748B` remains the semantic muted value. |
| `#00BEC4` on `#061F29` | 7.41:1 | Passes. Used for accents on dark sections. |
| White on `#061F29` | 16.99:1 | Passes. |

## Functional colours (newly designed, not brand)

| Role | Text | Background |
| --- | --- | --- |
| Success | `#16794A` | `#E6F4EC` |
| Warning | `#A15C07` | `#FDF1DE` |
| Error | `#B4321F` | `#FCE9E5` |
| Information | `#007C84` | `#E6F7F7` |

Status is always shown with an icon and text, never colour alone. Warning states previously borrowed the accent colour; they now use the functional warning amber, so the turquoise accent never signals a problem.

## Logo

The original Axtara logo (teal-gradient "A" mark and navy wordmark) was taken from the supplied reference file and prepared as:

| File | Use |
| --- | --- |
| `public/brand/axtara-logo.png` | Transparent background, light surfaces (header, footer, mobile menu) |
| `public/brand/axtara-logo-light.png` | Light wordmark for dark surfaces (Open Graph image, dark panels) |
| `public/brand/axtara-mark.png` | The "A" mark alone |
| `app/icon.png`, `app/apple-icon.png` | Favicon and touch icon, generated from the mark |

A vector (SVG) master of the logo should replace the PNGs when available. The current PNG is 593 × 156 px, sharp at up to about 3× display density at header size.

## Typography

Unchanged: Geist and Geist Mono, as already established. The reference's Archivo typeface was not adopted.
