import { useEffect, useMemo, useRef, type RefObject } from "react";
import { phase } from "@/common/helpers/math";
import { stickyProgressOf } from "@/common/helpers/scrollScrubber";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useScrollScrub } from "@/common/hooks/useScrollScrub";
import {
  buildClosingLines,
  CHORUS_PHASE,
  CLOSING_WORD_COUNT,
  END_ROLL_UNTIL,
  THOUGHT_PHASE,
  type ClosingLineViewModel,
} from "@/features/story/helpers/closingContent";

export interface ClosingSceneViewModel {
  /** Holds `--p`, `--sing` and `data-static`; everything inside reads them in `sx`. */
  sectionRef: RefObject<HTMLElement | null>;
  /** Holds `data-singing`: the crowd dots sway only while the chorus is being sung. */
  chorusRef: RefObject<HTMLDivElement | null>;
  wordRefs: RefObject<(HTMLSpanElement | null)[]>;
  lines: ClosingLineViewModel[];
}

/** Fraction of the chorus that must be filled before the crowd starts swaying. */
const SWAY_FROM = 0.02;

/** The brain of scene 12: the sung "comet", the two lighting lines and the thanks. */
export const useClosingScene = (): ClosingSceneViewModel => {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const chorusRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const litWordCount = useRef(-1);

  const lines = useMemo(buildClosingLines, []);

  // Writes only on change: the loop runs at 60 fps and attribute churn forces style recalcs.
  const applyWordCount = (count: number) => {
    if (litWordCount.current === count) return;
    litWordCount.current = count;
    wordRefs.current.forEach((node, index) => {
      if (node) node.dataset.on = index < count ? "true" : "false";
    });
  };

  const applySinging = (isSinging: boolean) => {
    const chorus = chorusRef.current;
    const flag = isSinging ? "true" : "false";
    if (chorus && chorus.dataset.singing !== flag) chorus.dataset.singing = flag;
  };

  useScrollScrub(({ viewportHeight }) => {
    const section = sectionRef.current;
    if (reducedMotion || !section) return;

    const progress = stickyProgressOf(section, viewportHeight);
    const sung = phase(progress, CHORUS_PHASE.start, CHORUS_PHASE.end);
    section.style.setProperty("--p", progress.toFixed(4));
    section.style.setProperty("--sing", sung.toFixed(4));
    applySinging(sung > SWAY_FROM && progress < END_ROLL_UNTIL);

    // Word i is on once the thought phase has passed i / (n + 1).
    applyWordCount(
      Math.floor(phase(progress, THOUGHT_PHASE.start, THOUGHT_PHASE.end) * (CLOSING_WORD_COUNT + 1)),
    );
  });

  // Reduced motion: the stage stops being sticky and the three phases stack, all final.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    section.dataset.static = reducedMotion ? "true" : "false";
    if (!reducedMotion) return;
    section.style.setProperty("--p", "1");
    section.style.setProperty("--sing", "1");
    applySinging(false);
    applyWordCount(CLOSING_WORD_COUNT);
  }, [reducedMotion]);

  return { sectionRef, chorusRef, wordRefs, lines };
};
