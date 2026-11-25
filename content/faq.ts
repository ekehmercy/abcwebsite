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
        a: "It covers parts of each, but it is built around how they connect. Attendance recorded on site becomes approved hours, which become project labour cost and payroll information. Axtara is designed to sit alongside your accounting, payroll and document systems rather than replace them.",
      },
      {
        q: "Which features are available today?",
        a: "Feature pages mark capabilities that are in development, planned or dependent on an integration. Availability can vary by plan and market, so we confirm exactly what is live for you during your demonstration.",
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
        a: "Facial verification is being developed as an optional feature. It is designed to be off by default and should only be enabled where the employer has a lawful basis and, where required, the worker's informed consent.",
      },
      {
        q: "Do field workers need their own phone?",
        a: "Workers use the Axtara mobile app on a smartphone. Whether that is a personal or company-provided device is up to the employer. We can discuss options for crews without smartphones during your demo.",
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
        a: "Approved payroll information can be prepared for handoff to an external payroll provider. Direct connections to specific providers depend on integration availability in your market — see the Integrations page for current status.",
      },
      {
        q: "Can we see labour cost by project?",
        a: "That is what Axtara is designed for: approved hours are allocated to projects and cost codes, so labour can be reviewed against budget while the work is still under way. We confirm current reporting capabilities for your plan during your demo.",
      },
    ],
  },
  {
    id: "commercial",
    title: "Pricing and subscriptions",
    items: [
      {
        q: "How is Axtara priced?",
        a: "Axtara is a subscription priced by active workers, with Core, Scale and Enterprise plans. Approved prices are published by market on the Pricing page; where they are not yet published, we provide a quote.",
      },
      {
        q: "Are there costs beyond the subscription?",
        a: "Implementation and onboarding are scoped and quoted separately. Third-party software such as payroll or accounting systems is subscribed to and billed by its provider, and applicable taxes are added where required.",
      },
      {
        q: "Which countries does Axtara serve?",
        a: "Axtara is being positioned for Jamaica, Nigeria, Guyana and the United States. In Jamaica, commercial operations are carried out by AnchorBridge Jamaica Limited. Additional markets are subject to future validation.",
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
        q: "Is Axtara certified (for example ISO 27001 or SOC 2)?",
        a: "We do not claim any security certification on this website. Our approach to security and privacy — and the status of each commitment — is described in the Security and Trust centre.",
      },
    ],
  },
];
