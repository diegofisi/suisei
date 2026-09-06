import { useEffect, useRef, type RefObject } from "react";
import { clamp, easeOutCubic } from "@/common/helpers/math";
import { stickyProgressOf } from "@/common/helpers/scrollScrubber";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useScrollScrub } from "@/common/hooks/useScrollScrub";
import {
  ACCELERATION_COUNT_UP_MS,
  ACCELERATION_QUOTE_POINT,
  ROCKET_STAGE_COUNT,
  STAGE_IGNITION_POINTS,
  accelerationCounters,
  formatCount,
} from "@/features/story/helpers/accelerationContent";

/** Mirrors NARROW_MEDIA in helpers/layout.ts: under it the stage stops being sticky. */
const NARROW_MAX_WIDTH = 760;

/**
 * Progress of a non-sticky section across the viewport: 0 when its top touches the
 * bottom edge, 1 once its bottom has left through the top. Used on narrow screens,
 * where the stage scrolls in normal flow but the rocket must still ignite in order.
 */
const flowProgressOf = (element: HTMLElement, viewportHeight: number): number => {
  const rect = element.getBoundingClientRect();
  const travel = rect.height + viewportHeight;
  if (travel <= 0) return 0;
  return clamp((viewportHeight - rect.top) / travel, 0, 1);
};

/** How many stages have ignited at this progress. */
const ignitedStageCountOf = (progress: number): number =>
  STAGE_IGNITION_POINTS.reduce<number>((count, point) => (progress >= point ? count + 1 : count), 0);

export interface AccelerationSceneRefs {
  /** Carries `--p` (0→1) and `data-stage` ("0".."3") for every descendant to style against. */
  sectionRef: RefObject<HTMLElement | null>;
  /** One node per counter; the hook writes the running number straight into it. */
  counterValueRefs: RefObject<(HTMLDivElement | null)[]>;
  quoteRef: RefObject<HTMLDivElement | null>;
}

/** The brain of scene 6: scene progress, staged ignition, two one-shot count-ups and the closing quote. */
export const useAccelerationScene = (): AccelerationSceneRefs => {
  const reducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const counterValueRefs = useRef<(HTMLDivElement | null)[]>([]);
  const quoteRef = useRef<HTMLDivElement>(null);

  const litStageCount = useRef(-1);
  const countedUp = useRef<boolean[]>(accelerationCounters.map(() => false));
  const countUpFrames = useRef<number[]>(accelerationCounters.map(() => 0));

  // One-off rAF per counter: a short animation, not a scroll loop, so it never touches state.
  const runCountUp = (index: number) => {
    const value = counterValueRefs.current[index];
    const counter = accelerationCounters[index];
    if (!value || !counter || countedUp.current[index]) return;
    countedUp.current[index] = true;
    const startedAt = performance.now();
    const step = (now: number) => {
      const progress = clamp((now - startedAt) / ACCELERATION_COUNT_UP_MS, 0, 1);
      value.textContent = formatCount(counter.target * easeOutCubic(progress));
      if (progress < 1) countUpFrames.current[index] = requestAnimationFrame(step);
    };
    countUpFrames.current[index] = requestAnimationFrame(step);
  };

  useScrollScrub(({ viewportHeight, viewportWidth }) => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const progress =
      viewportWidth <= NARROW_MAX_WIDTH
        ? flowProgressOf(section, viewportHeight)
        : stickyProgressOf(section, viewportHeight);
    section.style.setProperty("--p", progress.toFixed(4));

    // Attribute churn forces style recalcs, so only write when the stage actually changes.
    const stageCount = ignitedStageCountOf(progress);
    if (litStageCount.current !== stageCount) {
      litStageCount.current = stageCount;
      section.dataset.stage = stageCount.toString();
      accelerationCounters.forEach((counter, index) => {
        if (stageCount >= counter.stageNumber) runCountUp(index);
      });
    }

    const quote = quoteRef.current;
    if (quote) {
      const on = progress >= ACCELERATION_QUOTE_POINT ? "true" : "false";
      if (quote.dataset.on !== on) quote.dataset.on = on;
    }
  });

  // Reduced motion: full thrust, final numbers, quote already in place.
  useEffect(() => {
    if (!reducedMotion) return;
    const section = sectionRef.current;
    if (section) {
      section.style.setProperty("--p", "1");
      section.dataset.stage = ROCKET_STAGE_COUNT.toString();
    }
    if (quoteRef.current) quoteRef.current.dataset.on = "true";
    accelerationCounters.forEach((counter, index) => {
      const value = counterValueRefs.current[index];
      if (value) value.textContent = formatCount(counter.target);
    });
  }, [reducedMotion]);

  useEffect(() => {
    const frames = countUpFrames.current;
    return () => {
      for (const frame of frames) cancelAnimationFrame(frame);
    };
  }, []);

  return { sectionRef, counterValueRefs, quoteRef };
};
