/**
 * Extracts Axtara's existing brand colours from the live website in a real
 * browser and writes docs/BRAND-COLOUR-REPORT.md.
 *
 *   node scripts/extract-brand-colours.cjs [url]
 *
 * Requires Playwright + Chromium and network access to www.axtara.com.
 * It reads ONLY: CSS custom properties, computed colours of the navigation,
 * CTA buttons, links, active states and footer, the theme-color meta tag,
 * and the logo / favicon artwork. It never samples photographs.
 * Review the report, then set brandSource in config/brand.ts.
 */
const fs = require("node:fs");
const path = require("node:path");
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = require(path.join(process.env.NODE_PATH || "", "playwright")));
}

const URL_ = process.argv[2] || "https://www.axtara.com/";
const toHex = (c) => {
  const m = String(c).match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
  if (!m) return null;
  if (m[4] !== undefined && Number(m[4]) === 0) return null;
  return "#" + [m[1], m[2], m[3]].map((v) => Math.round(+v).toString(16).padStart(2, "0")).join("").toUpperCase();
};
const isNeutral = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return Math.max(r, g, b) - Math.min(r, g, b) < 18;
};

(async () => {
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const browser = await chromium.launch(proxy ? { proxy: { server: proxy, bypass: "localhost,127.0.0.1" } } : {});
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(URL_, { waitUntil: "networkidle", timeout: 60000 });

  const data = await page.evaluate(() => {
    const out = { vars: [], elements: [], meta: null, icons: [], logos: [] };
    // CSS custom properties on :root
    for (const sheet of Array.from(document.styleSheets)) {
      let rules;
      try { rules = sheet.cssRules; } catch { continue; }
      for (const r of Array.from(rules || [])) {
        if (r.selectorText && /(:root|html|body|\[data-theme)/.test(r.selectorText)) {
          for (const prop of Array.from(r.style)) if (prop.startsWith("--")) out.vars.push({ name: prop, value: r.style.getPropertyValue(prop).trim(), selector: r.selectorText, sheet: sheet.href || "inline" });
        }
      }
    }
    const groups = {
      navigation: "header a, nav a, header button",
      "cta buttons": "a[class*=btn], a[class*=button], button, [role=button], a[href*=demo], a[href*=contact]",
      links: "main a",
      "active states": "[aria-current], .active, [class*=active]",
      footer: "footer, footer a, footer *",
      headings: "h1, h2",
    };
    for (const [group, sel] of Object.entries(groups)) {
      document.querySelectorAll(sel).forEach((el, i) => {
        if (i > 60) return;
        const cs = getComputedStyle(el);
        out.elements.push({ group, tag: el.tagName.toLowerCase(), text: (el.textContent || "").trim().slice(0, 40), color: cs.color, bg: cs.backgroundColor, border: cs.borderTopColor });
      });
    }
    out.meta = document.querySelector('meta[name="theme-color"]')?.content || null;
    document.querySelectorAll('link[rel*="icon"]').forEach((l) => out.icons.push(l.href));
    document.querySelectorAll('img[src*="logo" i], img[alt*="logo" i], header img, header svg').forEach((el) => {
      if (el.tagName === "IMG") out.logos.push({ type: "img", src: el.src });
      else out.logos.push({ type: "svg", fills: Array.from(el.querySelectorAll("[fill],[stroke]")).flatMap((n) => [n.getAttribute("fill"), n.getAttribute("stroke")]).filter(Boolean) });
    });
    return out;
  });

  // Logo / favicon artwork: read SVG fills directly
  const artwork = [];
  for (const src of [...data.logos.filter((l) => l.type === "img").map((l) => l.src), ...data.icons]) {
    try {
      const res = await page.request.get(src);
      const type = res.headers()["content-type"] || "";
      if (type.includes("svg")) {
        const svg = await res.text();
        const fills = [...svg.matchAll(/(?:fill|stroke|stop-color)\s*[:=]\s*"?\s*(#[0-9a-fA-F]{3,8}|rgb[^)"]+\))/g)].map((m) => m[1]);
        artwork.push({ src, fills });
      } else artwork.push({ src, note: `${type} — inspect pixels manually (not sampled automatically)` });
    } catch (e) {
      artwork.push({ src, note: `could not download: ${e.message}` });
    }
  }
  await browser.close();

  // Tally non-neutral colours by where they were found
  const tally = new Map();
  const addTally = (hex, where) => {
    if (!hex || isNeutral(hex)) return;
    const t = tally.get(hex) || { count: 0, where: new Set() };
    t.count++;
    t.where.add(where);
    tally.set(hex, t);
  };
  for (const e of data.elements) for (const k of ["color", "bg", "border"]) addTally(toHex(e[k]), `${e.group} (${k === "bg" ? "background" : k})`);
  const ranked = [...tally.entries()].sort((a, b) => b[1].count - a[1].count);

  const lines = [
    "# Axtara Brand Colour Extraction Report",
    "",
    `Source: ${URL_}  `,
    `Extracted: ${new Date().toISOString()} with Playwright (Chromium), computed styles.`,
    "",
    "## Candidate brand colours (non-neutral, ranked by use)",
    "",
    "| HEX | RGB | Uses | Found in |",
    "| --- | --- | --- | --- |",
    ...ranked.slice(0, 12).map(([hex, t]) => {
      const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(", ");
      return `| \`${hex}\` | rgb(${rgb}) | ${t.count} | ${[...t.where].join("; ")} |`;
    }),
    "",
    "## CSS custom properties",
    "",
    ...(data.vars.length ? data.vars.map((v) => `- \`${v.name}: ${v.value}\` — ${v.selector} (${v.sheet})`) : ["- none found"]),
    "",
    `## theme-color meta: ${data.meta ?? "none"}`,
    "",
    "## Logo and favicon artwork",
    "",
    ...artwork.map((a) => `- ${a.src}: ${a.fills ? a.fills.join(", ") || "no fills" : a.note}`),
    ...data.logos.filter((l) => l.type === "svg").map((l) => `- inline header SVG fills: ${l.fills.join(", ") || "none"}`),
    "",
    "## Next step",
    "",
    "Cross-check the top candidates against the logo artwork, then set `brandSource.primary`",
    "(and `accent` / `secondary` if applicable) in `config/brand.ts` and `paletteVerified = true`.",
    "",
  ];
  const out = path.join(__dirname, "..", "docs", "BRAND-COLOUR-REPORT.md");
  fs.writeFileSync(out, lines.join("\n"));
  console.log(`Wrote ${out}`);
  console.log(ranked.slice(0, 6).map(([h, t]) => `${h} ×${t.count}`).join("\n"));
})().catch((e) => {
  console.error(`Extraction failed: ${e.message.split("\n")[0]}`);
  process.exit(1);
});
