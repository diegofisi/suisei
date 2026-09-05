import { useEffect, useRef, type RefObject } from "react";
import { clamp, easeOutCubic } from "@/common/helpers/math";
import { entryProgressOf } from "@/common/helpers/scrollScrubber";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useScrollScrub } from "@/common/hooks/useScrollScrub";
import { TODAY_COUNT_UP_MS, formatCounter, todayCounters } from "@/features/story/helpers/todayContent";
import { useRevealOnce } from "@/features/story/hooks/useRevealOnce";

/** Visible fraction a counter needs before its count-up fires. */
const COUNTER_THRESHOLD = 0.4;

export interface TodaySceneRefs {
  sectionRef: RefObject<HTMLElement | null>;
  /** Holds `--r` (0→1): how much of the giant year is filled. */
  yearRef: RefObject<HTMLDivElement | null>;
  factsRef: RefObject<HTMLUListElement | null>;
  cardRef: RefObject<HTMLDivElement | null>;
  quoteRef: RefObject<HTMLDivElement | null>;
  /** One row per counter; entering starts that counter's count-up. */
  counterRowRefs: RefObject<(HTMLDivElement | null)[]>;
  /** The hook writes the running number straight into these nodes. */
  counterValueRefs: RefObject<(HTMLDivElement | null)[]>;
}

/** The brain of scene 10: the 2026 year fill, one-shot reveals and the two count-ups. */
export const useTodayScene = (): TodaySceneRefs => {
  const reducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const factsRef = useRef<HTMLUListElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const counterRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterValueRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Continuous part: only the year fill depends on scroll here.
  useScrollScrub((frame) => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const year = yearRef.current;
    if (!section || !year) return;
    year.style.setProperty("--r", entryProgressOf(section, frame.viewportHeight).toFixed(4));
  });

  useRevealOnce([factsRef, cardRef, quoteRef], reducedMotion);

  // Reduced motion: everything lands in its final state, no scrub and no observers.
  useEffect(() => {
    if (!reducedMotion) return;
    yearRef.current?.style.setProperty("--r", "1");
    counterRowRefs.current.forEach((row) => {
      if (row) row.dataset.on = "true";
    });
    counterValueRefs.current.forEach((value, index) => {
      const counter = todayCounters[index];
      if (value && counter) value.textContent = formatCounter(counter.target, counter);
    });
  }, [reducedMotion]);

  // Each counter runs its own short rAF (a one-off, not a scroll loop) when it scrolls in.
  useEffect(() => {
    if (reducedMotion) return;
    const rows = counterRowRefs.current.filter((row) => row !== null);
    if (rows.length === 0) return;

    const frames = new Map<number, number>();
    const runCountUp = (index: number) => {
      const value = counterValueRefs.current[index];
      const counter = todayCounters[index];
      if (!value || !counter) return;
      const startedAt = performance.now();
      const step = (now: number) => {
        const progress = clamp((now - startedAt) / TODAY_COUNT_UP_MS, 0, 1);
        value.textContent = formatCounter(counter.target * easeOutCubic(progress), counter);
        if (progress < 1) frames.set(index, requestAnimationFrame(step));
      };
      frames.set(index, requestAnimationFrame(step));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const node = entry.target;
          if (!(node instanceof HTMLElement)) continue;
          observer.unobserve(node);
          if (node.dataset.on === "true") continue;
          node.dataset.on = "true";
          const index = counterRowRefs.current.findIndex((row) => row === node);
          if (index >= 0) runCountUp(index);
        }
      },
      { threshold: COUNTER_THRESHOLD },
    );
    for (const row of rows) observer.observe(row);

    return () => {
      observer.disconnect();
      frames.forEach((handle) => cancelAnimationFrame(handle));
    };
  }, [reducedMotion]);

  return { sectionRef, yearRef, factsRef, cardRef, quoteRef, counterRowRefs, counterValueRefs };
};
