/**
 * RELEASE STAGE
 * -------------
 * staging (default): the site presents Axtara as a complete product. Every
 *   capability, integration and security control in the registers is shown in
 *   confident, present-tense language with NO development-status labels.
 *   The whole site is noindex and robots.txt disallows crawling, so staging
 *   content can never be picked up by search engines.
 *
 * public: set NEXT_PUBLIC_RELEASE_STAGE=public for the production launch.
 *   Only items marked `verified: true` in the registers are shown; anything
 *   unverified is simply omitted (never labelled "planned" or "in development").
 *   Indexing is enabled.
 *
 * Outstanding verification lives in the private checklist:
 *   npm run audit:claims   →  docs/PUBLICATION-CHECKLIST.md
 */
export type ReleaseStage = "staging" | "public";

export const releaseStage: ReleaseStage = process.env.NEXT_PUBLIC_RELEASE_STAGE === "public" ? "public" : "staging";
export const isPublicRelease = releaseStage === "public";

/** Whether an item from a register may be shown in the current release stage. */
export function isPublishable(item: { verified: boolean }): boolean {
  return !isPublicRelease || item.verified;
}

/** Whether search engines may index the site. */
export const indexingAllowed = isPublicRelease && process.env.ALLOW_INDEXING !== "false";
