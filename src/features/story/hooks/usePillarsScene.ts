import { useEffect, useRef, type RefObject } from "react";
import { stickyProgressOf } from "@/common/helpers/scrollScrubber";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useScrollScrub } from "@/common/hooks/useScrollScrub";
import {
  PILLARS_QUOTE_AT,
  PILLARS_STATIC_MAX_WIDTH,
  PILLARS_STEP_THRESHOLDS,
  PILLARS_TOTAL_STEPS,
} from "@/features/story/helpers/pillarsContent";

export interface PillarsSceneRefs {
  /** Holds `--p` (sticky progress) and `data-step` (0..4), read by the cards in `sx`. */
  sectionRef: RefObject<HTMLElement | null>;
  quoteRef: RefObject<HTMLDivElement | null>;
}

/** How many steps the given progress has passed. */
const stepOf = (progress: number): number =>
  PILLARS_STEP_THRESHOLDS.filter((threshold) => progress >= threshold).length;

/** The brain of scene 11: sticky progress → one `data-step` attribute, plus the closing quote. */
export const usePillarsScene = (): PillarsSceneRefs => {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const currentStep = useRef(-1);

  // Writes only on change: the loop runs at 60 fps and attribute churn forces style recalcs.
  const applyStep = (step: number) => {
    const section = sectionRef.current;
    if (!section || currentStep.current === step) return;
    currentStep.current = step;
    section.dataset.step = String(step);
  };

  const applyQuote = (isOn: boolean) => {
    const quote = quoteRef.current;
    const flag = isOn ? "true" : "false";
    if (quote && quote.dataset.on !== flag) quote.dataset.on = flag;
  };

  useScrollScrub(({ viewportHeight, viewportWidth }) => {
    const section = sectionRef.current;
    if (reducedMotion || !section) return;

    // Under 760px the stage is not sticky and the cards stack: show everything.
    if (viewportWidth <= PILLARS_STATIC_MAX_WIDTH) {
      section.style.setProperty("--p", "1");
      applyStep(PILLARS_TOTAL_STEPS);
      applyQuote(true);
      return;
    }

    const progress = stickyProgressOf(section, viewportHeight);
    section.style.setProperty("--p", progress.toFixed(4));
    applyStep(stepOf(progress));
    applyQuote(progress >= PILLARS_QUOTE_AT);
  });

  // Reduced motion: the three pillars, the bonus and the quote are all already there.
  useEffect(() => {
    if (!reducedMotion) return;
    sectionRef.current?.style.setProperty("--p", "1");
    applyStep(PILLARS_TOTAL_STEPS);
    applyQuote(true);
  }, [reducedMotion]);

  return { sectionRef, quoteRef };
};
