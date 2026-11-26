/**
 * PHOTOGRAPHY REGISTRY
 * --------------------
 * Every photograph slot on the site is listed here with an art-direction brief.
 * Add licensed / approved images to /public/images and set `src`, `alt`,
 * `credit` and `licence`. Until then, slots render a neutral architectural
 * placeholder (and, outside production, the brief).
 *
 * Do not use images copied from competitor websites or unlicensed stock.
 */
export type MediaSlot = {
  brief: string;
  alt: string;
  src: string | null;
  credit: string | null;
  licence: string | null;
};

export const media: Record<string, MediaSlot> = {
  field: {
    brief: "Site supervisor in correct PPE reviewing a phone with a steel-fixing crew on an active commercial slab — natural light, Caribbean or West African site.",
    alt: "A site supervisor reviews the day's attendance with her crew on a commercial building site.",
    src: null, credit: null, licence: null,
  },
  gc: {
    brief: "Site supervisor in correct PPE reviewing a tablet with a foreman on an active commercial structure.",
    alt: "A supervisor and foreman review progress on a tablet at a commercial construction site.",
    src: null, credit: null, licence: null,
  },
  sub: {
    brief: "Specialist trade crew (electrical or MEP) working at height with correct harnesses, lead hand checking a phone.",
    alt: "An electrical crew works on containment while the lead hand checks assignments on a phone.",
    src: null, credit: null, licence: null,
  },
  re: {
    brief: "Residential development in progress, development manager and site engineer walking the site in PPE.",
    alt: "A development manager and site engineer walk a residential development under construction.",
    src: null, credit: null, licence: null,
  },
  infra: {
    brief: "Civil works crew in high-visibility PPE on a road or drainage corridor, engineer with a tablet beside plant.",
    alt: "A civil engineering crew works on a drainage corridor while an engineer records progress on a tablet.",
    src: null, credit: null, licence: null,
  },
  about: {
    brief: "Office-to-field collaboration: project manager and supervisor at a site cabin table with drawings and a laptop.",
    alt: "A project manager and site supervisor plan the week in a site office.",
    src: null, credit: null, licence: null,
  },
};
