import { useEffect, useMemo, useRef, type RefObject } from "react";
import { easeOutCubic, phase } from "@/common/helpers/math";
import { stickyProgressOf } from "@/common/helpers/scrollScrubber";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useScrollScrub } from "@/common/hooks/useScrollScrub";
import type { TimelinePointViewModel } from "@/features/story/interfaces/StoryViewModels";
import {
  buildQuestionWords,
  QUESTION_TIMELINE_POINTS,
  TIMELINE_DRAW_PHASE,
  TIMELINE_FADE_PHASE,
  WORDS_PHASE,
  type QuestionWordViewModel,
} from "@/features/story/helpers/questionContent";

export interface QuestionSceneViewModel {
  sectionRef: RefObject<HTMLElement | null>;
  timelineRef: RefObject<HTMLDivElement | null>;
  wordRefs: RefObject<(HTMLSpanElement | null)[]>;
  pointRefs: RefObject<(HTMLDivElement | null)[]>;
  words: QuestionWordViewModel[];
  points: TimelinePointViewModel[];
}

/** Fraction of the drawn line at which point `index` lights up; the first one lights as soon as the line starts. */
const litThresholdOf = (index: number, count: number): number => (count < 2 ? 0 : (index / (count - 1)) * 0.98);

/** The brain of scene 2: no state, only CSS custom properties and data attributes written on the scrub loop. */
export const useQuestionScene = (): QuestionSceneViewModel => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const pointRefs = useRef<(HTMLDivElement | null)[]>([]);
  const litWordCount = useRef(-1);
  const litPointCount = useRef(-1);
  const isStatic = useReducedMotion();

  const words = useMemo(buildQuestionWords, []);
  const points = QUESTION_TIMELINE_POINTS;

  // Writes only on change: the loop runs at 60 fps and attribute churn forces style recalcs.
  const applyWordCount = (count: number) => {
    if (litWordCount.current === count) return;
    litWordCount.current = count;
    wordRefs.current.forEach((node, index) => {
      if (node) node.dataset.on = index < count ? "true" : "false";
    });
  };

  const applyPointCount = (count: number) => {
    if (litPointCount.current === count) return;
    litPointCount.current = count;
    pointRefs.current.forEach((node, index) => {
      if (node) node.dataset.lit = index < count ? "true" : "false";
    });
  };

  useScrollScrub(({ viewportHeight }) => {
    const section = sectionRef.current;
    const timeline = timelineRef.current;
    if (isStatic || !section || !timeline) return;

    const progress = stickyProgressOf(section, viewportHeight);
    section.style.setProperty("--p", progress.toFixed(4));

    // Word i is on once the word phase has passed i / (n + 1).
    applyWordCount(Math.floor(phase(progress, WORDS_PHASE.start, WORDS_PHASE.end) * (words.length + 1)));

    const fade = phase(progress, TIMELINE_FADE_PHASE.start, TIMELINE_FADE_PHASE.end);
    const drawn = easeOutCubic(phase(progress, TIMELINE_DRAW_PHASE.start, TIMELINE_DRAW_PHASE.end));
    timeline.style.setProperty("--f", fade.toFixed(4));
    timeline.style.setProperty("--t", drawn.toFixed(4));
    timeline.dataset.drawing = drawn > 0.002 && drawn < 0.998 ? "true" : "false";

    let reached = 0;
    while (reached < points.length && drawn >= litThresholdOf(reached, points.length)) reached += 1;
    applyPointCount(drawn <= 0 ? 0 : reached);
  });

  // Reduced motion: everything already at its final state, nothing animates.
  useEffect(() => {
    const section = sectionRef.current;
    const timeline = timelineRef.current;
    if (!isStatic || !section || !timeline) return;
    section.style.setProperty("--p", "1");
    timeline.style.setProperty("--f", "1");
    timeline.style.setProperty("--t", "1");
    timeline.dataset.drawing = "false";
    applyWordCount(words.length);
    applyPointCount(points.length);
  }, [isStatic, words.length, points.length]);

  return { sectionRef, timelineRef, wordRefs, pointRefs, words, points };
};
