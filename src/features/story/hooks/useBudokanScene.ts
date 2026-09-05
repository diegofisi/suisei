import { useEffect, useRef, type RefObject } from "react";
import { easeInOutCubic, lerp, phase } from "@/common/helpers/math";
import { stickyProgressOf } from "@/common/helpers/scrollScrubber";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useScrollScrub } from "@/common/hooks/useScrollScrub";
import {
  BRIDGE_REVEAL_AT,
  BUDOKAN_STEP_BOUNDS,
  COMET_RELIGHT_AT,
  FACTS_REVEAL_AT,
  FRAME_FOCUS_AT,
  REWIND_PHASE,
  YEAR_FILL_PHASE,
} from "@/features/story/helpers/budokanContent";

export interface BudokanSceneRefs {
  /** Carries `--p` (0→1), `data-step` (0..4) and `data-static` under reduced motion. */
  sectionRef: RefObject<HTMLElement | null>;
  /** Holds `--r`: how much of the giant gold year is filled. */
  yearRef: RefObject<HTMLDivElement | null>;
  factsRef: RefObject<HTMLUListElement | null>;
  /** Holds `--rw` (0→1): the playhead running backwards from 2025 to 2018. */
  stripRef: RefObject<HTMLDivElement | null>;
  /** One node per outfit frame; each carries `data-lit`, `data-focus`, `data-pulse`. */
  frameRefs: RefObject<(HTMLDivElement | null)[]>;
  bridgeRef: RefObject<HTMLDivElement | null>;
}

type FrameFlag = "lit" | "focus" | "pulse";

/** Where the playhead sits, in frame-index units: just right of the last frame (0) to just left of the first (1). */
const HEAD_START_OFFSET = 0.5;

const setFlag = (node: HTMLElement | null, key: "on" | FrameFlag, value: boolean): void => {
  if (!node) return;
  const next = value ? "true" : "false";
  // Only write on change: the loop runs at 60 fps and attribute churn forces style recalcs.
  if (node.dataset[key] !== next) node.dataset[key] = next;
};

const stepOf = (progress: number): string => {
  let step = 0;
  while (step < BUDOKAN_STEP_BOUNDS.length && progress >= (BUDOKAN_STEP_BOUNDS[step] ?? 1)) step += 1;
  return String(step);
};

/** The brain of scene 8: gold year fill, the backwards rewind of the outfit strip and the TOKIO DOME slam. */
export const useBudokanScene = (): BudokanSceneRefs => {
  const isStatic = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const factsRef = useRef<HTMLUListElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bridgeRef = useRef<HTMLDivElement>(null);

  /** The head sweeps right to left; every frame it has passed greys out, except 2018 (and 2025 once M13 starts). */
  const applyFrames = (rewind: number, progress: number) => {
    const frames = frameRefs.current;
    const count = frames.length;
    if (count === 0) return;
    const head = lerp(count - 1 + HEAD_START_OFFSET, -HEAD_START_OFFSET, easeInOutCubic(rewind));
    const isRelit = progress >= COMET_RELIGHT_AT;
    frames.forEach((node, index) => {
      const isFirst = index === 0;
      const isLast = index === count - 1;
      const isPassed = head <= index;
      setFlag(node, "lit", isFirst || !isPassed || (isLast && isRelit));
      setFlag(node, "focus", isFirst && rewind >= FRAME_FOCUS_AT);
      setFlag(node, "pulse", isLast && isRelit);
    });
  };

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
    setFlag(factsRef.current, "on", progress >= FACTS_REVEAL_AT);

    const rewind = phase(progress, REWIND_PHASE.start, REWIND_PHASE.end);
    stripRef.current?.style.setProperty("--rw", rewind.toFixed(4));
    applyFrames(rewind, progress);

    setFlag(bridgeRef.current, "on", progress >= BRIDGE_REVEAL_AT);
  });

  // Reduced motion: the stage stops being sticky and every step block is shown at once, already resolved.
  useEffect(() => {
    const section = sectionRef.current;
    if (!isStatic || !section) return;
    section.dataset.static = "true";
    section.dataset.step = String(BUDOKAN_STEP_BOUNDS.length);
    section.style.setProperty("--p", "1");
    yearRef.current?.style.setProperty("--r", "1");
    stripRef.current?.style.setProperty("--rw", "1");
    setFlag(factsRef.current, "on", true);
    setFlag(bridgeRef.current, "on", true);
    applyFrames(1, 1);
    // applyFrames only reads refs; it never needs to re-run for anything but the motion setting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStatic]);

  return { sectionRef, yearRef, factsRef, stripRef, frameRefs, bridgeRef };
};
