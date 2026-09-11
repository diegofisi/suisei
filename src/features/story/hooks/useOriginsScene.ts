import { useEffect, useRef, type RefObject } from "react";
import { entryProgressOf, hasEnteredView, topFractionOf } from "@/common/helpers/scrollScrubber";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useScrollScrub } from "@/common/hooks/useScrollScrub";
import { isNarrowViewport } from "@/features/story/helpers/layout";
import { useRevealOnce } from "@/features/story/hooks/useRevealOnce";

/** Wide screens: the fan opens once the section top has risen past this fraction of the viewport. */
const FAN_TRIGGER = 0.5;

export interface OriginsSceneRefs {
  sectionRef: RefObject<HTMLElement | null>;
  /** Holds `--r` (0→1): how much of the giant year is filled. */
  yearRef: RefObject<HTMLDivElement | null>;
  factsRef: RefObject<HTMLUListElement | null>;
  /** The "6.000 suscriptores" row: a one-shot reveal right after the facts. */
  counterRef: RefObject<HTMLDivElement | null>;
  /** Holds `data-fanned`: the clip stack spreads out. */
  fanRef: RefObject<HTMLDivElement | null>;
}

/** The brain of scene 3: year fill scrub, one-shot reveals and the clip fan. */
export const useOriginsScene = (): OriginsSceneRefs => {
  const reducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const factsRef = useRef<HTMLUListElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const fanRef = useRef<HTMLDivElement>(null);

  // Continuous part: fill the year and decide whether the clips are fanned.
  useScrollScrub((frame) => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const year = yearRef.current;
    if (year) {
      year.style.setProperty("--r", entryProgressOf(section, frame.viewportHeight).toFixed(4));
    }

    const fan = fanRef.current;
    if (fan) {
      // Single column: the clips sit far below the text, so they open when they themselves scroll in.
      const fanned = isNarrowViewport(frame.viewportWidth)
        ? hasEnteredView(fan, frame.viewportHeight)
        : topFractionOf(section, frame.viewportHeight) < FAN_TRIGGER;
      const flag = fanned ? "true" : "false";
      if (fan.dataset.fanned !== flag) fan.dataset.fanned = flag;
    }
  });

  // The facts stagger in, then the 6.000 row lands right after them: no count-up, the number is the point.
  useRevealOnce([factsRef, counterRef], reducedMotion);

  // Reduced motion: everything lands in its final state, no scrub.
  useEffect(() => {
    if (!reducedMotion) return;
    yearRef.current?.style.setProperty("--r", "1");
    if (fanRef.current) fanRef.current.dataset.fanned = "true";
  }, [reducedMotion]);

  return { sectionRef, yearRef, factsRef, counterRef, fanRef };
};
