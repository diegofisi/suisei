import { useEffect, useRef, type RefObject } from "react";
import { phase } from "@/common/helpers/math";
import { stickyProgressOf } from "@/common/helpers/scrollScrubber";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useScrollScrub } from "@/common/hooks/useScrollScrub";
import {
  BRIDGE_REVEAL_AT,
  BUDOKAN_STEP_BOUNDS,
  COLLAGE_PHASE,
  FACTS_REVEAL_AT,
  YEAR_FILL_PHASE,
} from "@/features/story/helpers/budokanContent";

export interface BudokanSceneRefs {
  /** Carries `--p` (0→1), `data-step` (0..4) and `data-static` under reduced motion. */
  sectionRef: RefObject<HTMLElement | null>;
  /** Holds `--r`: how much of the giant gold year is filled. */
  yearRef: RefObject<HTMLDivElement | null>;
  factsRef: RefObject<HTMLUListElement | null>;
  /** Holds `--rw` (0→1): how much of the concert collage has been dealt. */
  collageRef: RefObject<HTMLDivElement | null>;
  bridgeRef: RefObject<HTMLDivElement | null>;
}

const setFlag = (node: HTMLElement | null, value: boolean): void => {
  if (!node) return;
  const next = value ? "true" : "false";
  // Only write on change: the loop runs at 60 fps and attribute churn forces style recalcs.
  if (node.dataset.on !== next) node.dataset.on = next;
};

const stepOf = (progress: number): string => {
  let step = 0;
  while (step < BUDOKAN_STEP_BOUNDS.length && progress >= (BUDOKAN_STEP_BOUNDS[step] ?? 1)) step += 1;
  return String(step);
};

/** The brain of scene 8: gold year fill, the collage dealing itself out, and the TOKIO DOME slam. */
export const useBudokanScene = (): BudokanSceneRefs => {
  const isStatic = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const factsRef = useRef<HTMLUListElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLDivElement>(null);

  useScrollScrub(({ viewportHeight }) => {
    const section = sectionRef.current;
    if (isStatic || !section) return;

    const progress = stickyProgressOf(section, viewportHeight);
    section.style.setProperty("--p", progress.toFixed(4));
    const step = stepOf(progress);
    if (section.dataset.step !== step) section.dataset.step = step;

    yearRef.current?.style.setProperty(
      "--r",
      phase(progress, YEAR_FILL_PHASE.start, YEAR_FILL_PHASE.end).toFixed(4),
    );
    setFlag(factsRef.current, progress >= FACTS_REVEAL_AT);
    collageRef.current?.style.setProperty(
      "--rw",
      phase(progress, COLLAGE_PHASE.start, COLLAGE_PHASE.end).toFixed(4),
    );
    setFlag(bridgeRef.current, progress >= BRIDGE_REVEAL_AT);
  });

  // Reduced motion: the stage stops being sticky and every step block is shown at once, already resolved.
  useEffect(() => {
    const section = sectionRef.current;
    if (!isStatic || !section) return;
    section.dataset.static = "true";
    section.dataset.step = String(BUDOKAN_STEP_BOUNDS.length);
    section.style.setProperty("--p", "1");
    yearRef.current?.style.setProperty("--r", "1");
    collageRef.current?.style.setProperty("--rw", "1");
    setFlag(factsRef.current, true);
    setFlag(bridgeRef.current, true);
  }, [isStatic]);

  return { sectionRef, yearRef, factsRef, collageRef, bridgeRef };
};
