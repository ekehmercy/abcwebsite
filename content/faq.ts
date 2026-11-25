/**
 * Frequently asked questions. Answers must stay consistent with the feature
 * register (config/features.ts), pricing configuration and security content —
 * no unverified claims.
 */
export type FaqGroup = { id: string; title: string; items: { q: string; a: string }[] };

export const faqGroups: FaqGroup[] = [
  {
    id: "product",
    title: "The product",
    items: [
      {
        q: "What is Axtara?",
        a: "Axtara is a workforce and project operations platform for construction and project-driven businesses. It connects field workers, supervisors, project managers, finance and leadership around one record of the work — from clock-in on site to approval, project cost and payroll preparation.",
      },
      {
        q: "Is Axtara an HR system, a time-tracking app or project management software?",
        a: "It brings the parts of each that construction businesses need into one connected platform. Attendance recorded on site becomes approved hours, which become project labour cost and payroll information. Axtara works alongside your accounting, payroll and document systems rather than replacing them.",
      },
      {
        q: "Which modules are included in my plan?",
        a: "Core covers workforce records, verified attendance and supervisor approvals. Scale adds project operations, field reporting, expenses and payroll preparation. Enterprise adds advanced permissions, governance, multi-entity reporting and integration support. Your exact entitlements are set out in your order form.",
      },
      {
        q: "Are the product screens on this website real customer data?",
        a: "No. Every interface shown on this website is an illustrative demonstration using fictional organisations, projects and people.",
      },
    ],
  },
  {
    id: "field",
    title: "Attendance and the field",
    items: [
      {
        q: "How does location verification work?",
        a: "When a worker clocks in or out, Axtara checks their location at that moment against the site boundary set by the employer. Records outside the boundary are flagged for a supervisor to review. Location is not tracked continuously.",
      },
      {
        q: "Does Axtara use facial recognition?",
        a: "Facial verification is an optional feature and is off by default. Enable it only where you have a lawful basis and, where required, the worker's informed consent.",
      },
      {
        q: "Do field workers need their own phone?",
        a: "Workers use the Axtara mobile app on a smartphone — personal or company-provided, as the employer decides. Talk to us about crews without smartphones and we'll walk through the options in your demo.",
      },
    ],
  },
  {
    id: "payroll",
    title: "Payroll and costs",
    items: [
      {
        q: "Does Axtara pay my workers?",
        a: "No. Axtara prepares payroll information from approved hours and configured rules, and supports review and approval. Payment of wages is carried out by your payroll provider or bank under your own arrangements. Axtara does not hold funds or transfer wages.",
      },
      {
        q: "Can Axtara send information to our payroll provider?",
        a: "Yes. Approved payroll information is prepared for handoff to your external payroll provider. If you'd like a direct connection to the provider you use, request it on the Integrations page.",
      },
      {
        q: "Can we see labour cost by project?",
        a: "Yes. Approved hours are allocated to projects and cost codes, so you can review labour against budget while the work is still under way.",
      },
    ],
  },
  {
    id: "commercial",
    title: "Pricing and subscriptions",
    items: [
      {
        q: "How is Axtara priced?",
        a: "Axtara is a subscription priced by active workers, with Core, Scale and Enterprise plans. Use the calculator on the Pricing page to build your quote in your local currency.",
      },
      {
        q: "Are there costs beyond the subscription?",
        a: "Implementation and onboarding are scoped and quoted separately. Third-party software such as payroll or accounting systems is subscribed to and billed by its provider, and applicable taxes are added where required.",
      },
      {
        q: "Which countries does Axtara serve?",
        a: "Axtara serves construction and project-driven businesses in Jamaica, Nigeria, Guyana and the United States. In Jamaica, Axtara is offered by AnchorBridge Jamaica Limited.",
      },
    ],
  },
  {
    id: "data",
    title: "Security and data",
    items: [
      {
        q: "Who owns our data?",
        a: "Your organisation remains in control of its workforce and operational data. Axtara processes it to provide the service. Retention, export and deletion terms are set out in your agreement.",
      },
      {
        q: "How is our data protected?",
        a: "Access is role-based, each organisation's records are kept separate, and every approval and correction is recorded. The Security and Trust centre explains how Axtara handles employee, location and biometric information — and how to contact our security team.",
      },
    ],
  },
];
