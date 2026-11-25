import { test } from "node:test";
import assert from "node:assert/strict";
import { validate, isFormId } from "../../lib/validation.ts";

const good = {
  firstName: "Shanice",
  lastName: "Brown",
  email: "shanice@example.com",
  company: "Example Contractors",
  country: "Jamaica",
  businessType: "General Contractor",
  employees: "75–199",
  interest: "Complete Platform",
  challenge: "Crew time and payroll preparation",
};

test("accepts a complete demo request", () => {
  const { errors } = validate("demo", good);
  assert.deepEqual(errors, {});
});

test("flags every missing required field", () => {
  const { errors } = validate("demo", {});
  for (const f of ["firstName", "lastName", "email", "company", "country", "businessType", "employees", "challenge"]) {
    assert.ok(errors[f], `expected error for ${f}`);
  }
});

test("rejects malformed email and out-of-list select values", () => {
  const { errors } = validate("demo", { ...good, email: "not-an-email", businessType: "Bank" });
  assert.ok(errors.email);
  assert.ok(errors.businessType);
});

test("enforces length limits and trims input", () => {
  const { errors, values } = validate("demo", { ...good, firstName: "  Shanice  ", message: "x".repeat(5000) });
  assert.equal(values.firstName, "Shanice");
  assert.ok(errors.message);
});

test("ignores non-string input safely", () => {
  const { errors } = validate("demo", { ...good, firstName: { $ne: 1 } as unknown as string });
  assert.ok(errors.firstName);
});

test("recognises only known form ids", () => {
  assert.equal(isFormId("demo"), true);
  assert.equal(isFormId("../etc"), false);
});

test("validates partner enquiries", () => {
  const { errors } = validate("partner", {
    firstName: "Ada", lastName: "Obi", email: "ada@example.com", company: "Example Advisory",
    country: "Nigeria", pathway: "Referral", orgType: "Construction adviser or consultancy", message: "We advise contractors in Lagos.",
  });
  assert.deepEqual(errors, {});
  assert.ok(validate("partner", { pathway: "Commission" }).errors.pathway);
  assert.equal(isFormId("partner"), true);
});

test("optional demo fields accept blanks but reject unknown options", () => {
  assert.equal(validate("demo", { ...good, projects: "" }).errors.projects, undefined);
  assert.ok(validate("demo", { ...good, ownWorkforce: "Thousands" }).errors.ownWorkforce);
});
