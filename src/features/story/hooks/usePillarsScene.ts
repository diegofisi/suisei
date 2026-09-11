import { useEffect, useRef, type RefObject } from "react";
import { hasEnteredView, stickyProgressOf } from "@/common/helpers/scrollScrubber";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useScrollScrub } from "@/common/hooks/useScrollScrub";
import { isNarrowViewport } from "@/features/story/helpers/layout";
import {
  PILLARS_QUOTE_AT,
  PILLARS_STEP_THRESHOLDS,
  PILLARS_TOTAL_STEPS,
} from "@/features/story/helpers/pillarsContent";

export interface PillarsSceneRefs {
  /** Holds `--p` (sticky progress) and `data-step` (0..4), read by the cards in `sx`. */
  sectionRef: RefObject<HTMLElement | null>;
  quoteRef: RefObject<HTMLDivElement | null>;
}

/** How many steps the given sticky progress has passed (wide screens). */
const stepOf = (progress: number): number =>
  PILLARS_STEP_THRESHOLDS.filter((threshold) => progress >= threshold).length;

/** Narrow screens: the highest step whose card has scrolled in (the cards stack in step order). */
const enteredStepOf = (cards: HTMLElement[], viewportHeight: number): number =>
  cards.reduce((step, card) => (hasEnteredView(card, viewportHeight) ? Math.max(step, Number(card.dataset.pillarStep)) : step), 0);

/** The brain of scene 11: sticky progress → one `data-step` attribute, plus the closing quote. */
export const usePillarsScene = (): PillarsSceneRefs => {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const currentStep = useRef(-1);
  const cardNodes = useRef<HTMLElement[] | null>(null);

  /** The three pillars plus the bonus, each tagged with its step; looked up once. */
  const cards = (section: HTMLElement): HTMLElement[] => {
    if (!cardNodes.current) cardNodes.current = [...section.querySelectorAll<HTMLElement>("[data-pillar-step]")];
    return cardNodes.current;
  };

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

    // Under 760px the stage is not sticky and the cards stack: each one turns on as it scrolls in.
    if (isNarrowViewport(viewportWidth)) {
      section.style.setProperty("--p", "1");
      applyStep(enteredStepOf(cards(section), viewportHeight));
      const quote = quoteRef.current;
      applyQuote(quote !== null && hasEnteredView(quote, viewportHeight));
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
