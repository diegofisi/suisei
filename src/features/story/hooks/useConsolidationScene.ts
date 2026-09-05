import { useRef, type RefObject } from "react";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useScrollScrub } from "@/common/hooks/useScrollScrub";
import { useRevealOnce } from "@/features/story/hooks/useRevealOnce";

/** The clip stack opens once the section top has risen past this fraction of the viewport. */
const FAN_TRIGGER = 0.5;

export interface ConsolidationSceneRefs {
  sectionRef: RefObject<HTMLElement | null>;
  /** Holds `data-on`: the milestone tiles stagger in. */
  gridRef: RefObject<HTMLUListElement | null>;
  quoteRef: RefObject<HTMLDivElement | null>;
  /** Holds `data-fanned`: the clip stack spreads out. */
  fanRef: RefObject<HTMLDivElement | null>;
}

/** The brain of scene 7: two one-shot reveals plus the clip fan. Deliberately light — this slide is trimmable. */
export const useConsolidationScene = (): ConsolidationSceneRefs => {
  const reducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const fanRef = useRef<HTMLDivElement>(null);

  useRevealOnce([gridRef, quoteRef], reducedMotion);

  useScrollScrub(({ viewportHeight }) => {
    const section = sectionRef.current;
    const fan = fanRef.current;
    if (!section || !fan) return;
    const fanned =
      reducedMotion || section.getBoundingClientRect().top < viewportHeight * FAN_TRIGGER ? "true" : "false";
    if (fan.dataset.fanned !== fanned) fan.dataset.fanned = fanned;
  });

  return { sectionRef, gridRef, quoteRef, fanRef };
};
