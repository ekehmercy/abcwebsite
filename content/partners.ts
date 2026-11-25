/**
 * Partner programme content. No commercial terms, commissions, discounts or
 * free licences are offered or implied — terms are agreed individually, in
 * writing, after a fit discussion.
 */

export type PartnerPathway = {
  id: "referral" | "reseller" | "implementation" | "technology";
  name: string;
  /** Matches the option in the partner enquiry form. */
  formValue: string;
  icon: string;
  short: string;
  suits: string;
  contribute: string;
  customer: string;
  both: string;
  discuss: string;
};

export const partnerPathways: PartnerPathway[] = [
  {
    id: "referral",
    name: "Referral",
    formValue: "Referral",
    icon: "Users",
    short: "For advisers, consultants and industry networks introducing construction businesses.",
    suits: "Construction advisers, management consultants, quantity surveyors, accountants and industry associations who already work with general contractors, developers or specialty contractors.",
    contribute: "Introductions to businesses where coordination and field operations are a real problem, with context about their situation.",
    customer: "An introduction from someone who already understands their business, to a platform built for how their projects run.",
    both: "You add a relevant option for your clients. Axtara reaches businesses through people they already trust.",
    discuss: "How introductions work, how the customer's consent is handled, any conflicts of interest, and whether a commercial arrangement applies.",
  },
  {
    id: "reseller",
    name: "Reseller and regional",
    formValue: "Reseller and regional",
    icon: "Route",
    short: "For firms with local construction relationships, sales capability and support capacity.",
    suits: "Firms with existing construction customers, a sales team and the ability to support customers locally, in their working hours.",
    contribute: "Local market knowledge, sales conversations, first-line customer support and familiarity with local business practice.",
    customer: "A local point of contact who understands their market and can support them on their schedule.",
    both: "You extend your offer to construction customers. Axtara serves markets with local expertise on the ground.",
    discuss: "Markets and customer segments, support responsibilities and service levels, how pricing is presented, training, and how customer data responsibilities are divided.",
  },
  {
    id: "implementation",
    name: "Implementation",
    formValue: "Implementation",
    icon: "Wrench",
    short: "For firms that onboard, configure, migrate data, train teams and support adoption.",
    suits: "Consultancies and service firms experienced in rolling out software to construction offices and site teams.",
    contribute: "Onboarding, configuration, data migration, role-specific training for office, supervisor and field users, and adoption support.",
    customer: "A focused, well-supported start — records and responsibilities agreed before anyone is trained.",
    both: "You offer construction-specific services around a defined product. Customers get hands-on help where it matters.",
    discuss: "Service scope and quality expectations, who the customer contracts with for services, how product questions are escalated, and how data access during migration is authorised and limited.",
  },
  {
    id: "technology",
    name: "Technology and integration",
    formValue: "Technology and integration",
    icon: "Blocks",
    short: "For estimating, accounting, payroll, document and specialist construction software providers.",
    suits: "Providers of software that construction businesses keep using alongside Axtara.",
    contribute: "Knowledge of your system, a clear view of the workflow worth connecting, and engineering or product time once a technical approach is agreed.",
    customer: "Less re-entry between tools, with each system kept for the job it does best.",
    both: "Each product becomes more useful to shared customers without trying to do the other's job.",
    discuss: "The workflow and records involved, whether a file exchange is enough or a live integration is justified, customer authorisation, data responsibilities and ongoing maintenance.",
  },
];

export const partnerMarkets = [
  { name: "Nigeria", text: "Construction businesses coordinating partners and site teams across projects, where local implementation and support make a difference." },
  { name: "Jamaica", text: "General contractors, developers and specialty contractors on residential and commercial projects, with workforce and payroll preparation needs." },
  { name: "The wider Caribbean", text: "Firms working across islands, where regional relationships and support coverage help." },
  { name: "United States", text: "Specialty contractors and GCs who keep their estimating, accounting and payroll tools and want them alongside a connected field record." },
];

export const partnerSteps = [
  { t: "Expression of interest", d: "Send a short enquiry describing your organisation and the collaboration you have in mind." },
  { t: "Fit discussion", d: "A conversation about customers, markets and whether the pathway makes sense for both sides." },
  { t: "Responsibilities and capabilities", d: "Confirming who does what, and that both sides can deliver it — including support and data responsibilities." },
  { t: "Written agreement", d: "Scope and any commercial terms are set out in a written agreement. Nothing applies before then." },
  { t: "Joint onboarding or technical planning", d: "Shared onboarding for service partners, or technical planning for an agreed integration." },
];

export const partnerFaq = [
  { q: "Are commissions, discounts or free licences offered?", a: "Nothing is offered or promised on this website. Benefits, responsibilities and any commercial terms are agreed individually, in writing, after a fit discussion." },
  { q: "Do we need to be a software company to partner with Axtara?", a: "No. Referral and implementation partners are often advisers, consultancies and service firms that already work with construction businesses." },
  { q: "Which markets are you looking for partners in?", a: "Nigeria, Jamaica, the wider Caribbean and the United States. If you work elsewhere, tell us — we'll say plainly whether it's a fit." },
  { q: "Will we get access to customer data?", a: "Only where a customer authorises it for an agreed purpose, such as a data migration, and only for as long as that work needs. Access responsibilities are written into the agreement." },
  { q: "What should we include in the enquiry?", a: "Your organisation, the customers or markets you work with and what you'd bring. Please don't send customer records, credentials or financial documents." },
];
