/**
 * End-to-end QA: route health, console errors, broken links, horizontal
 * overflow at six widths, and the key interactions.
 *
 *   BASE_URL=http://localhost:3000 node tests/e2e/run.mjs
 *
 * Requires Playwright with Chromium available (`npm i -D playwright` locally).
 */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = require(require("node:path").join(process.env.NODE_PATH ?? "", "playwright")));
}

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ROUTES = [
  "/", "/platform", "/platform/workforce", "/platform/time-attendance", "/platform/field-operations",
  "/platform/project-operations", "/platform/payroll", "/platform/expenses", "/platform/compliance",
  "/platform/reporting", "/platform/bids-rfis", "/platform/inspections-handover", "/mobile", "/collaboration", "/lifecycle", "/tour", "/roi", "/partners", "/industries/general-contractors", "/industries/subcontractors",
  "/industries/real-estate", "/industries/infrastructure", "/pricing", "/integrations", "/security",
  "/resources", "/about", "/demo", "/contact", "/faq", "/legal/privacy", "/legal/terms",
  "/legal/subscription", "/legal/cookies", "/login",
];
const WIDTHS = [375, 390, 768, 1024, 1440, 1920];

const results = [];
const pass = (name) => results.push({ name, ok: true });
const fail = (name, detail) => results.push({ name, ok: false, detail });
const check = async (name, fn) => {
  try {
    await fn();
    pass(name);
  } catch (e) {
    const msg = String(e?.message ?? e);
    const waiting = msg.split("\n").find((l) => l.includes("waiting for")) ?? "";
    fail(name, `${msg.split("\n")[0]} ${waiting.trim()}`);
  }
};
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

const browser = await chromium.launch();

/* 1. Route health, console errors, overflow at every width */
const links = new Set();
for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    const errors = [];
    page.removeAllListeners("console");
    page.removeAllListeners("pageerror");
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    await check(`[${width}] ${route} renders without errors or horizontal scroll`, async () => {
      const res = await page.goto(BASE + route, { waitUntil: "networkidle" });
      assert(res && res.status() < 400, `status ${res?.status()}`);
      const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      assert(sw <= cw, `horizontal overflow ${sw} > ${cw}`);
      assert(errors.length === 0, `console errors: ${errors.slice(0, 2).join(" | ")}`);
      const h1 = await page.locator("h1").count();
      assert(h1 === 1, `expected exactly one h1, found ${h1}`);
      if (width === 1440) {
        for (const href of await page.$$eval("a[href^='/']", (as) => as.map((a) => a.getAttribute("href")))) links.add(href.split("#")[0].split("?")[0] || "/");
      }
    });
  }
  await ctx.close();
}

/* 2. Broken internal links */
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  for (const href of links) {
    await check(`link ${href} resolves`, async () => {
      const res = await page.request.get(BASE + href);
      assert(res.status() < 400, `status ${res.status()}`);
    });
  }
  await ctx.close();
}

/* 3. Interactions */
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE + "/", { waitUntil: "networkidle" });

await check("mega menu opens with keyboard, Escape closes and returns focus", async () => {
  const trigger = page.getByRole("button", { name: "Platform" });
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(150);
  assert((await trigger.getAttribute("aria-expanded")) === "true", "menu did not open");
  const focusedInside = await page.evaluate(() => document.activeElement?.closest("[id$='-platform']") != null);
  assert(focusedInside, "focus did not move into the menu");
  await page.keyboard.press("Escape");
  assert((await trigger.getAttribute("aria-expanded")) === "false", "menu did not close");
  assert(await trigger.evaluate((el) => el === document.activeElement), "focus not returned to trigger");
});

await check("product explorer tabs switch panel and support arrow keys", async () => {
  const list = page.getByRole("tablist", { name: "Product areas" });
  const tab = list.getByRole("tab", { name: "Payroll", exact: true });
  await tab.click();
  assert((await tab.getAttribute("aria-selected")) === "true", "tab not selected");
  await page.keyboard.press("ArrowRight");
  const sel = await list.locator("[aria-selected=true]").innerText();
  assert(sel.includes("Handover"), `arrow key moved to "${sel}"`);
});

await check("fragmented → connected toggle works", async () => {
  const btn = page.getByRole("button", { name: "With Axtara" });
  await btn.click();
  assert((await btn.getAttribute("aria-pressed")) === "true", "not pressed");
  await page.getByText(/One record moves from the site/).waitFor();
});

await check("journey next / previous / restart controls", async () => {
  await page.locator("#journey").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Restart walkthrough" }).click();
  await page.getByRole("button", { name: "Next step" }).click();
  await page.getByText(/Step 2 of 6/).waitFor();
  await page.getByRole("button", { name: "Previous step" }).click();
  await page.getByText(/Step 1 of 6/).waitFor();
  await page.getByRole("button", { name: /See the whole operation/ }).click();
  await page.getByText(/Step 6 of 6/).waitFor();
});

await check("cookie preferences dialog opens and closes", async () => {
  await page.getByRole("button", { name: "Cookie preferences" }).click();
  await page.getByRole("dialog", { name: "Cookie preferences" }).waitFor();
  await page.keyboard.press("Escape");
});

await check("pricing calculator responds to worker count and billing", async () => {
  await page.goto(BASE + "/pricing", { waitUntil: "networkidle" });
  const input = page.getByRole("spinbutton").first();
  await input.fill("250");
  await page.waitForTimeout(150);
  const text = await page.locator("main").innerText();
  assert(/Scale/.test(text), "Scale plan not suggested for 250 workers");
  // Jamaica (default market), Scale, 250 workers, 3 projects: J$49,900 + 150 × J$300 = J$94,900 a month.
  assert(/J\$94,900/.test(text), "published Jamaica Scale price not calculated");
  assert(/J\$19,900/.test(text), "Core price not shown on the plan card");
  const quote = page.locator("a[href*='/demo?'][href*='interest=pricing']").first();
  const href = await quote.getAttribute("href");
  assert(href && href.includes("workers=250"), `quote link does not carry worker count: ${href}`);
});

await check("demo form shows accessible validation errors and never fakes success", async () => {
  await page.goto(BASE + "/demo", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /request|submit|send/i }).last().click();
  await page.waitForTimeout(300);
  const invalid = await page.locator("[aria-invalid=true]").count();
  assert(invalid > 0, "no invalid fields flagged");
  const res = await page.request.post(BASE + "/api/forms/demo", { data: {}, headers: { origin: BASE } });
  assert(res.status() === 422 || res.status() === 400, `empty submission returned ${res.status()}`);
});

await check("mobile navigation drawer opens, traps focus, closes on Escape", async () => {
  const m = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await m.newPage();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.getByRole("button", { name: "Open menu" }).click();
  await p.getByRole("dialog", { name: "Site navigation" }).waitFor();
  await p.keyboard.press("Escape");
  assert((await p.getByRole("dialog", { name: "Site navigation" }).count()) === 0, "drawer still open");
  await m.close();
});

await check("interactive product demos respond like the application", async () => {
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const j = page.locator("#journey");
  await j.scrollIntoViewIfNeeded();
  await j.getByRole("button", { name: "Restart walkthrough" }).click();
  await j.getByRole("button", { name: "Clock in", exact: true }).click();
  await j.getByText("Recorded and sent for review").waitFor({ timeout: 4000 });
  await j.getByRole("button", { name: /Review and approve/ }).click();
  await j.getByRole("button", { name: "Approve", exact: true }).first().click();
  await j.getByText("Approved by Shanice Brown").waitFor();
  await j.getByRole("button", { name: /Update the project picture/ }).click();
  await j.getByRole("tab", { name: "Cedar Heights" }).click();
  await j.getByText("Cedar Heights Residential Estate").waitFor();
  await j.getByRole("button", { name: /Prepare payroll/ }).click();
  // The payroll step mounts on first open — wait for it before counting variances.
  await j.getByText("Period summary").waitFor();
  const rev = j.getByRole("button", { name: "Review", exact: true });
  // Resolve each variance and wait for the UI to register it before the next click.
  for (let k = 0; k < 6; k++) {
    const before = await rev.count();
    if (!before) break;
    await rev.first().click();
    await page.waitForFunction(
      ([n]) => document.querySelectorAll("#journey button").length >= 0 && [...document.querySelectorAll("#journey button")].filter((b) => b.textContent?.trim() === "Review").length < n,
      [before],
      { timeout: 5000 },
    );
  }
  await j.getByRole("button", { name: "Approve and prepare schedule" }).click();
  await j.getByText("Schedule ready for your payroll provider").waitFor();
  const ex = page.locator("section[aria-labelledby=explore-title]");
  await ex.getByRole("tab", { name: "Costs" }).click();
  await ex.getByRole("button", { name: /Formwork release agent/ }).click();
  await ex.getByRole("button", { name: "Approve", exact: true }).click();
  await ex.getByText("Approved · added to project cost").waitFor();
});

await check("no development-stage language is visible", async () => {
  const banned = /\b(under development|in development|coming soon|proposed model|being finalised|under review|under evaluation|design commitment|not yet assessed|confirm in demo)\b/i;
  for (const r of ["/", "/platform/payroll", "/pricing", "/integrations", "/security", "/mobile", "/about"]) {
    await page.goto(BASE + r, { waitUntil: "networkidle" });
    const t = await page.evaluate(() => document.body.innerText);
    const m = t.match(banned);
    assert(!m, `${r}: "${m?.[0]}"`);
  }
});

await check("sitemap and robots are served", async () => {
  const s = await page.request.get(BASE + "/sitemap.xml");
  assert(s.status() === 200 && (await s.text()).includes("/platform/payroll"), "sitemap missing routes");
  const r = await page.request.get(BASE + "/robots.txt");
  assert(r.status() === 200, "robots missing");
});

await browser.close();

const failed = results.filter((r) => !r.ok);
for (const f of failed) console.log(`✗ ${f.name}\n    ${f.detail}`);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
