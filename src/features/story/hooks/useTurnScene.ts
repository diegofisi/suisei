import { useEffect, useRef, type RefObject } from "react";
import { phase } from "@/common/helpers/math";
import { stickyProgressOf } from "@/common/helpers/scrollScrubber";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useScrollScrub } from "@/common/hooks/useScrollScrub";
import { TURN_LINE_PHASE, turnMilestones } from "@/features/story/helpers/turnContent";

export interface TurnSceneViewModel {
  /** Holds `--p` (0→1); everything in the stage is CSS math on it. */
  sectionRef: RefObject<HTMLElement | null>;
  milestoneRefs: RefObject<(HTMLDivElement | null)[]>;
}

/** Fraction of the drawn line at which milestone `index` lights up. */
const litThresholdOf = (index: number, count: number): number =>
  count < 2 ? 0 : (index / (count - 1)) * 0.92;

/** The brain of scene 5: one custom property on the section plus the `data-lit` milestones. */
export const useTurnScene = (): TurnSceneViewModel => {
  const isStatic = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const litCount = useRef(-1);

  const milestoneCount = turnMilestones.length;

  const applyLitCount = (count: number) => {
    if (litCount.current === count) return;
    litCount.current = count;
    milestoneRefs.current.forEach((node, index) => {
      if (node) node.dataset.lit = index < count ? "true" : "false";
    });
  };

  useScrollScrub(({ viewportHeight }) => {
    const section = sectionRef.current;
    if (isStatic || !section) return;

    const progress = stickyProgressOf(section, viewportHeight);
    section.style.setProperty("--p", progress.toFixed(4));

    const drawn = phase(progress, TURN_LINE_PHASE.start, TURN_LINE_PHASE.end);
    let reached = 0;
    while (reached < milestoneCount && drawn >= litThresholdOf(reached, milestoneCount)) reached += 1;
    applyLitCount(drawn <= 0 ? 0 : reached);
  });

  // Reduced motion: the scene sits at its end state ("Todavía no.", line drawn, render in place).
  useEffect(() => {
    if (!isStatic) return;
    sectionRef.current?.style.setProperty("--p", "1");
    applyLitCount(milestoneCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStatic, milestoneCount]);

  return { sectionRef, milestoneRefs };
};
