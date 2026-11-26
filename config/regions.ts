/**
 * Market / regional configuration: currencies, contracting entities and
 * regulatory context.
 *
 * `complianceStatus`, `pricingModel` and `contractingEntity.verified` are
 * INTERNAL fields for the private publication checklist — never rendered as
 * status labels. `complianceNote` is visitor-facing: it explains how Axtara
 * supports the employer's obligations. It must never claim registration,
 * certification or regulatory approval.
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
  /** INTERNAL — Axtara's own verified compliance position in this market. */
  complianceStatus: "verified" | "in-review" | "not-yet-assessed";
  /** Visitor-facing: how Axtara supports the employer's obligations in this market. */
  complianceNote: string;
  /** INTERNAL — approval state of the commercial model for this market. */
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
      "Axtara supports your obligations as the employer under Jamaican law: workers are told what is collected and why, location is captured only at clock-in and clock-out, biometric checks are optional and consent-based, and retention periods are configured to your requirements.",
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
      "Axtara supports the lawful-basis, purpose-limitation and data-subject-rights principles of the NDPA: personal data is collected for workforce administration only, workers can see the information held about them, and retention is configured to your requirements.",
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
      "Axtara supports your obligations under Guyanese law with purpose-limited collection, worker access to their own information, optional consent-based biometric checks and configurable retention.",
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
      "Axtara supports state-specific requirements with optional, consent-based biometric verification, point-in-time location capture, role-based access and configurable retention. Hours and payroll preparation records are kept with a full approval history.",
    pricingModel: "under-review",
  },
];

export const defaultRegion: RegionCode = "JM";

export function getRegion(code: string | null | undefined): Region {
  return regions.find((r) => r.code === code) ?? regions.find((r) => r.code === defaultRegion)!;
}
