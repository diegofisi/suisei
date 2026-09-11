import { useEffect, useRef, type RefObject } from "react";
import { clamp, easeOutCubic } from "@/common/helpers/math";
import { hasEnteredView, stickyProgressOf } from "@/common/helpers/scrollScrubber";
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
import { isNarrowViewport } from "@/features/story/helpers/layout";

/**
 * Progress of a non-sticky section across the viewport: 0 when its top touches the
 * bottom edge, 1 once its bottom has left through the top. Drives only the exhaust
 * glow on narrow screens, where the stage scrolls in normal flow.
 */
const flowProgressOf = (element: HTMLElement, viewportHeight: number): number => {
  const rect = element.getBoundingClientRect();
  const travel = rect.height + viewportHeight;
  if (travel <= 0) return 0;
  return clamp((viewportHeight - rect.top) / travel, 0, 1);
};

/** Narrow screens: the counters close the stage, so they start as soon as they peek in at the bottom edge. */
const NARROW_COUNTER_LINE = 0.96;

/** How many stages have ignited at this progress (wide screens, sticky stage). */
const ignitedStageCountOf = (progress: number): number =>
  STAGE_IGNITION_POINTS.reduce<number>((count, point) => (progress >= point ? count + 1 : count), 0);

/** Narrow screens: a stage ignites when its own card has scrolled in; the stack is chronological top-down. */
const enteredStageCountOf = (stages: HTMLElement[], viewportHeight: number): number => {
  let count = 0;
  for (const stage of stages) {
    if (!hasEnteredView(stage, viewportHeight)) break;
    count += 1;
  }
  return count;
};

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
  const stageNodes = useRef<HTMLElement[] | null>(null);

  const litStageCount = useRef(-1);
  const countedUp = useRef<boolean[]>(accelerationCounters.map(() => false));
  const countUpFrames = useRef<number[]>(accelerationCounters.map(() => 0));

  /** The three stage cards, in chronological (DOM) order; looked up once. */
  const stages = (section: HTMLElement): HTMLElement[] => {
    if (!stageNodes.current) {
      stageNodes.current = [...section.querySelectorAll<HTMLElement>("[data-rocket-stage]")].sort(
        (a, b) => Number(a.dataset.rocketStage) - Number(b.dataset.rocketStage),
      );
    }
    return stageNodes.current;
  };

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
    const narrow = isNarrowViewport(viewportWidth);

    const progress = narrow ? flowProgressOf(section, viewportHeight) : stickyProgressOf(section, viewportHeight);
    section.style.setProperty("--p", progress.toFixed(4));

    // Attribute churn forces style recalcs, so only write when the stage actually changes.
    const stageCount = narrow ? enteredStageCountOf(stages(section), viewportHeight) : ignitedStageCountOf(progress);
    if (litStageCount.current !== stageCount) {
      litStageCount.current = stageCount;
      section.dataset.stage = stageCount.toString();
    }

    // Counters: on the sticky stage they run with their stage; stacked, each one runs when it scrolls in itself
    // (they sit under the rocket there, so running them earlier would finish off screen).
    accelerationCounters.forEach((counter, index) => {
      if (stageCount < counter.stageNumber) return;
      const value = counterValueRefs.current[index];
      if (narrow && (!value || !hasEnteredView(value, viewportHeight, NARROW_COUNTER_LINE))) return;
      runCountUp(index);
    });

    const quote = quoteRef.current;
    if (quote) {
      const shown = narrow ? hasEnteredView(quote, viewportHeight) : progress >= ACCELERATION_QUOTE_POINT;
      const on = shown ? "true" : "false";
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
