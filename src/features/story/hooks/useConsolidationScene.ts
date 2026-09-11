import { useEffect, useRef, type RefObject } from "react";
import { hasEnteredView, topFractionOf } from "@/common/helpers/scrollScrubber";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useScrollScrub } from "@/common/hooks/useScrollScrub";
import { isNarrowViewport } from "@/features/story/helpers/layout";
import { useRevealOnce } from "@/features/story/hooks/useRevealOnce";

/** Wide screens: the clip stack opens once the section top has risen past this fraction of the viewport. */
const FAN_TRIGGER = 0.5;

export interface ConsolidationSceneRefs {
  sectionRef: RefObject<HTMLElement | null>;
  /** Each tile inside gets its own `data-on` as it scrolls in (the root gets it under reduced motion). */
  gridRef: RefObject<HTMLUListElement | null>;
  quoteRef: RefObject<HTMLDivElement | null>;
  /** Holds `data-fanned`: the clip stack spreads out. */
  fanRef: RefObject<HTMLDivElement | null>;
}

/** The brain of scene 7: tile-by-tile reveals, the quote and the clip fan. Deliberately light — this slide is trimmable. */
export const useConsolidationScene = (): ConsolidationSceneRefs => {
  const reducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const fanRef = useRef<HTMLDivElement>(null);

  useRevealOnce([quoteRef], reducedMotion);

  useScrollScrub(({ viewportHeight, viewportWidth }) => {
    const section = sectionRef.current;
    if (reducedMotion || !section) return;

    // Six tiles in one or two columns: each lights the first time its own top crosses the enter line,
    // so on a phone the lower ones still animate instead of finishing while off screen.
    const grid = gridRef.current;
    if (grid) {
      for (const tile of grid.children) {
        if (!(tile instanceof HTMLElement) || tile.dataset.on === "true") continue;
        if (hasEnteredView(tile, viewportHeight)) tile.dataset.on = "true";
      }
    }

    const fan = fanRef.current;
    if (fan) {
      // Single column: the clips sit far below the text, so they open when they themselves scroll in.
      const fanned = isNarrowViewport(viewportWidth)
        ? hasEnteredView(fan, viewportHeight)
        : topFractionOf(section, viewportHeight) < FAN_TRIGGER;
      const flag = fanned ? "true" : "false";
      if (fan.dataset.fanned !== flag) fan.dataset.fanned = flag;
    }
  });

  // Reduced motion: every tile on, the fan open.
  useEffect(() => {
    if (!reducedMotion) return;
    if (gridRef.current) gridRef.current.dataset.on = "true";
    if (fanRef.current) fanRef.current.dataset.fanned = "true";
  }, [reducedMotion]);

  return { sectionRef, gridRef, quoteRef, fanRef };
};
