import { useEffect, useRef, type RefObject } from "react";
import { phase } from "@/common/helpers/math";
import { entryProgressOf } from "@/common/helpers/scrollScrubber";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useScrollScrub } from "@/common/hooks/useScrollScrub";
import {
  REJECTION_ANSWER_AT,
  REJECTION_DEAL_PHASE,
  REJECTION_SETTLE_AT,
  rejectionConditions,
} from "@/features/story/helpers/rejectionContent";
import { useRevealOnce } from "@/features/story/hooks/useRevealOnce";

export interface RejectionSceneViewModel {
  sectionRef: RefObject<HTMLElement | null>;
  factsRef: RefObject<HTMLUListElement | null>;
  lessonRef: RefObject<HTMLDivElement | null>;
  quoteRef: RefObject<HTMLDivElement | null>;
  /** Holds `data-answered` once the pile is complete. */
  stackRef: RefObject<HTMLDivElement | null>;
  cardRefs: RefObject<(HTMLDivElement | null)[]>;
}

/** The brain of scene 4: one-shot reveals on the left, a scrubbed deal of condition cards on the right. */
export const useRejectionScene = (): RejectionSceneViewModel => {
  const isStatic = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const factsRef = useRef<HTMLUListElement>(null);
  const lessonRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const landedCount = useRef(-1);

  const cardCount = rejectionConditions.length;

  // Writes only on change: attribute churn at 60 fps would force needless style recalcs.
  const applyLandedCount = (count: number, answered: boolean) => {
    const stack = stackRef.current;
    if (landedCount.current !== count) {
      landedCount.current = count;
      cardRefs.current.forEach((node, index) => {
        if (node) node.dataset.landed = index < count ? "true" : "false";
      });
    }
    if (!stack) return;
    const flag = answered ? "true" : "false";
    if (stack.dataset.answered !== flag) stack.dataset.answered = flag;
    const lesson = lessonRef.current;
    if (lesson && lesson.dataset.on !== flag) lesson.dataset.on = flag;
  };

  useScrollScrub(({ viewportHeight }) => {
    const section = sectionRef.current;
    if (isStatic || !section) return;

    const progress = entryProgressOf(section, viewportHeight, REJECTION_SETTLE_AT);
    const dealt = phase(progress, REJECTION_DEAL_PHASE.start, REJECTION_DEAL_PHASE.end);
    // The presenter's "next" press reveals the answer in place (data-presenter-step on the section), without scrolling.
    const presenterRevealed = Number(section.dataset.presenterStep ?? "0") >= 1;
    const landed = presenterRevealed ? cardCount : Math.min(cardCount, Math.floor(dealt * (cardCount + 1)));
    applyLandedCount(landed, presenterRevealed || (landed >= cardCount && progress >= REJECTION_ANSWER_AT));
  });

  // The lesson card is not a scroll reveal: it lands together with the answer card (same press, same beat).
  useRevealOnce([factsRef, quoteRef], isStatic);

  // Reduced motion: the pile is already dealt and the answer already on top.
  useEffect(() => {
    if (!isStatic) return;
    applyLandedCount(cardCount, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStatic, cardCount]);

  return { sectionRef, factsRef, lessonRef, quoteRef, stackRef, cardRefs };
};
