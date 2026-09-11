import { useEffect, useRef, type RefObject } from "react";
import { phase } from "@/common/helpers/math";
import { hasEnteredView, topFractionOf } from "@/common/helpers/scrollScrubber";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useScrollScrub } from "@/common/hooks/useScrollScrub";
import { isNarrowViewport } from "@/features/story/helpers/layout";
import {
  REJECTION_ANSWER_TOP,
  REJECTION_DEAL_WINDOW,
  rejectionConditions,
} from "@/features/story/helpers/rejectionContent";
import { useRevealOnce } from "@/features/story/hooks/useRevealOnce";

export interface RejectionSceneViewModel {
  sectionRef: RefObject<HTMLElement | null>;
  factsRef: RefObject<HTMLUListElement | null>;
  lessonRef: RefObject<HTMLDivElement | null>;
  /** Holds `data-answered` once the pile is complete. */
  stackRef: RefObject<HTMLDivElement | null>;
  cardRefs: RefObject<(HTMLDivElement | null)[]>;
  answerRef: RefObject<HTMLDivElement | null>;
}

/** Narrow screens: a note lands a little later than the usual enter line, so it visibly rises into place. */
const NARROW_CARD_LINE = 0.9;

/** The brain of scene 4: one-shot reveals on the left, a scrubbed deal of condition cards on the right. */
export const useRejectionScene = (): RejectionSceneViewModel => {
  const isStatic = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const factsRef = useRef<HTMLUListElement>(null);
  const lessonRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const answerRef = useRef<HTMLDivElement>(null);
  const landedCount = useRef(-1);

  const cardCount = rejectionConditions.length;

  // Writes only on change: attribute churn at 60 fps would force needless style recalcs.
  const apply = (count: number, answered: boolean, lessonOn: boolean) => {
    if (landedCount.current !== count) {
      landedCount.current = count;
      cardRefs.current.forEach((node, index) => {
        if (node) node.dataset.landed = index < count ? "true" : "false";
      });
    }
    const stack = stackRef.current;
    const answeredFlag = answered ? "true" : "false";
    if (stack && stack.dataset.answered !== answeredFlag) stack.dataset.answered = answeredFlag;
    const lesson = lessonRef.current;
    const lessonFlag = lessonOn ? "true" : "false";
    if (lesson && lesson.dataset.on !== lessonFlag) lesson.dataset.on = lessonFlag;
  };

  useScrollScrub(({ viewportHeight, viewportWidth }) => {
    const section = sectionRef.current;
    if (isStatic || !section) return;

    // The presenter's "next" press reveals the answer in place (data-presenter-step on the section), without scrolling.
    const presenterRevealed = Number(section.dataset.presenterStep ?? "0") >= 1;
    if (presenterRevealed) {
      apply(cardCount, true, true);
      return;
    }

    // Single column: the pile, the answer and the lesson are stacked far below the facts, so each one lands
    // when it scrolls into view. The section's own progress says nothing about what is on screen here.
    if (isNarrowViewport(viewportWidth)) {
      let landed = 0;
      while (landed < cardCount) {
        const card = cardRefs.current[landed];
        if (!card || !hasEnteredView(card, viewportHeight, NARROW_CARD_LINE)) break;
        landed += 1;
      }
      const answer = answerRef.current;
      const answered = landed >= cardCount && answer !== null && hasEnteredView(answer, viewportHeight);
      const lesson = lessonRef.current;
      apply(landed, answered, answered && lesson !== null && hasEnteredView(lesson, viewportHeight));
      return;
    }

    // Two columns: the notes are dealt as the section arrives; the answer waits for a nudge past the top.
    const top = topFractionOf(section, viewportHeight);
    const dealt = phase(-top, -REJECTION_DEAL_WINDOW.from, -REJECTION_DEAL_WINDOW.to);
    const landed = Math.min(cardCount, Math.floor(dealt * (cardCount + 1)));
    const answered = landed >= cardCount && top <= REJECTION_ANSWER_TOP;
    apply(landed, answered, answered);
  });

  useRevealOnce([factsRef], isStatic);

  // Reduced motion: the pile is already dealt and the answer already on top.
  useEffect(() => {
    if (!isStatic) return;
    apply(cardCount, true, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStatic, cardCount]);

  return { sectionRef, factsRef, lessonRef, stackRef, cardRefs, answerRef };
};
