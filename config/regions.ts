/**
 * Market / regional configuration: currencies, contracting entities, and
 * regulatory context. Nothing here asserts that Axtara is registered, certified
 * or compliant in a jurisdiction — `complianceStatus` records what has been verified.
 */

export type RegionCode = "JM" | "NG" | "GY" | "US";

export type LegalEntity = {
  name: string;
  /** Whether the legal name and contracting role have been confirmed for publication. */
  verified: boolean;
};

export type Region = {
  code: RegionCode;
  name: string;
  currency: { code: string; symbol: string; name: string };
  /** Entity that contracts with customers in this market. null = to be confirmed. */
  contractingEntity: LegalEntity | null;
  /** Data-protection frameworks relevant to customers in this market (context, not a compliance claim). */
  privacyFrameworks: { name: string; note: string }[];
  /** What Axtara has verified about its own compliance position in this market. */
  complianceStatus: "verified" | "in-review" | "not-yet-assessed";
  complianceNote: string;
  /** Whether a commercial pricing model has been proposed for this market. */
  pricingModel: "proposed" | "under-review";
};

export const regions: Region[] = [
  {
    code: "JM",
    name: "Jamaica",
    currency: { code: "JMD", symbol: "J$", name: "Jamaican dollar" },
    contractingEntity: { name: "AnchorBridge Jamaica Limited", verified: true },
    privacyFrameworks: [
      {
        name: "Data Protection Act, 2020 (Jamaica)",
        note: "Governs how personal data — including employee records, location and biometric information — is collected and processed.",
      },
    ],
    complianceStatus: "in-review",
    complianceNote:
      "Axtara's obligations and registration position under Jamaican data-protection law are being confirmed. We will publish verified status here once complete.",
    pricingModel: "proposed",
  },
  {
    code: "NG",
    name: "Nigeria",
    currency: { code: "NGN", symbol: "₦", name: "Nigerian naira" },
    contractingEntity: null,
    privacyFrameworks: [
      {
        name: "Nigeria Data Protection Act, 2023",
        note: "Sets requirements for processing personal data of individuals in Nigeria, overseen by the Nigeria Data Protection Commission.",
      },
    ],
    complianceStatus: "not-yet-assessed",
    complianceNote:
      "Market entry for Nigeria is in preparation. Compliance assessment will be completed before Axtara contracts with customers there.",
    pricingModel: "under-review",
  },
  {
    code: "GY",
    name: "Guyana",
    currency: { code: "GYD", symbol: "G$", name: "Guyanese dollar" },
    contractingEntity: null,
    privacyFrameworks: [
      {
        name: "Data Protection Act, 2023 (Guyana)",
        note: "Establishes rules for the processing of personal data in Guyana.",
      },
    ],
    complianceStatus: "not-yet-assessed",
    complianceNote:
      "Market entry for Guyana is in preparation. Compliance assessment will be completed before Axtara contracts with customers there.",
    pricingModel: "under-review",
  },
  {
    code: "US",
    name: "United States",
    currency: { code: "USD", symbol: "US$", name: "US dollar" },
    contractingEntity: null,
    privacyFrameworks: [
      {
        name: "State privacy and biometric laws",
        note: "Requirements vary by state — for example, biometric-information laws such as Illinois BIPA, and state consumer-privacy statutes.",
      },
      {
        name: "Federal wage-and-hour recordkeeping",
        note: "Employers remain responsible for timekeeping and payroll recordkeeping obligations; Axtara supports record preparation, not legal compliance on the employer's behalf.",
      },
    ],
    complianceStatus: "not-yet-assessed",
    complianceNote:
      "Market entry for the United States is in preparation. Compliance assessment will be completed before Axtara contracts with customers there.",
    pricingModel: "under-review",
  },
];

export const defaultRegion: RegionCode = "JM";

export function getRegion(code: string | null | undefined): Region {
  return regions.find((r) => r.code === code) ?? regions.find((r) => r.code === defaultRegion)!;
}
