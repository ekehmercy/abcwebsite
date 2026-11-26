import { test } from "node:test";
import assert from "node:assert/strict";
import { checkNumber, computeRoi, payback, roiFromPreset, roiPresets } from "../../lib/roi.ts";

const base = () => ({
  activities: [
    { id: "a", label: "A", hours: "60" },
    { id: "b", label: "B", hours: "40" },
  ],
  rate: "30",
  reduction: "20",
  subscription: "300",
  setupCost: "1200",
  trainingHours: "10",
});

test("computes recovered hours, value, net, payback and year net", () => {
  const { ok, result } = computeRoi(base());
  assert.equal(ok, true);
  assert.equal(result!.baselineHours, 100);
  assert.equal(result!.recoveredHours, 20);
  assert.equal(result!.value, 600);
  assert.equal(result!.monthlyNet, 300);
  assert.equal(result!.upfront, 1200 + 10 * 30);
  assert.equal(result!.payback.months, 5);
  assert.equal(result!.yearNet, 12 * 300 - 1500);
});

test("payback never returns Infinity or NaN", () => {
  assert.deepEqual(payback(1000, 0), { months: null, text: "No payback under these assumptions" });
  assert.deepEqual(payback(1000, -50).months, null);
  assert.equal(payback(0, 100).months, 0);
});

test("negative net is reported, not hidden", () => {
  const { result } = computeRoi({ ...base(), subscription: "900" });
  assert.equal(result!.monthlyNet, -300);
  assert.equal(result!.payback.months, null);
});

test("hours are shown even before money inputs are complete", () => {
  const { ok, hoursOnly, result, errors } = computeRoi({ ...base(), rate: "", subscription: "" });
  assert.equal(ok, false);
  assert.equal(result, null);
  assert.deepEqual(hoursOnly, { baselineHours: 100, recoveredHours: 20 });
  assert.ok(errors.rate && errors.subscription);
});

test("validates inputs", () => {
  assert.ok(checkNumber("abc", "money"));
  assert.ok(checkNumber("-1", "hours"));
  assert.ok(checkNumber("101", "pct"));
  assert.equal(checkNumber("", "money", false), null);
  assert.equal(checkNumber("1,200", "money"), null);
  const { errors } = computeRoi({ ...base(), activities: [{ id: "x", label: "X", hours: "lots" }] });
  assert.ok(errors["act:x"]);
});

test("presets carry hours only — never a rate or an Axtara price", () => {
  for (const id of Object.keys(roiPresets) as (keyof typeof roiPresets)[]) {
    const v = roiFromPreset(id);
    assert.equal(v.rate, "");
    assert.equal(v.subscription, "");
    assert.ok(v.activities.length > 0);
  }
  assert.equal(roiFromPreset("sub", { rate: "25" }).rate, "25");
});
