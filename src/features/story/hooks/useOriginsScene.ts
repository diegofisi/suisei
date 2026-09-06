import { useEffect, useRef, type RefObject } from "react";
import { clamp, easeOutCubic } from "@/common/helpers/math";
import { entryProgressOf } from "@/common/helpers/scrollScrubber";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useScrollScrub } from "@/common/hooks/useScrollScrub";
import {
  ORIGINS_COUNT_UP_MS,
  ORIGINS_SUBSCRIBER_TARGET,
  formatSubscribers,
} from "@/features/story/helpers/originsContent";

/** Visible fraction a block needs before its one-shot reveal fires. */
const REVEAL_THRESHOLD = 0.12;
/** The fan opens once the section top has risen past this fraction of the viewport. */
const FAN_TRIGGER = 0.5;
/** Without the presenter button, the 6.000 and the quote show once the audience scrolls this far past the landing point. */
const TENSION_RELEASE_VH = 0.2;

export interface OriginsSceneRefs {
  sectionRef: RefObject<HTMLElement | null>;
  /** Holds `--r` (0→1): how much of the giant year is filled. */
  yearRef: RefObject<HTMLDivElement | null>;
  factsRef: RefObject<HTMLUListElement | null>;
  counterRef: RefObject<HTMLDivElement | null>;
  counterValueRef: RefObject<HTMLDivElement | null>;
  quoteRef: RefObject<HTMLDivElement | null>;
  /** Holds `data-fanned`: the clip stack spreads out. */
  fanRef: RefObject<HTMLDivElement | null>;
}

/** The brain of scene 3: year fill scrub, one-shot reveals, the 0→6.000 count-up and the clip fan. */
export const useOriginsScene = (): OriginsSceneRefs => {
  const reducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const factsRef = useRef<HTMLUListElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const counterValueRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const fanRef = useRef<HTMLDivElement>(null);
  const releasedRef = useRef(false);
  const countUpFrame = useRef(0);

  const runCountUp = () => {
    const value = counterValueRef.current;
    if (!value) return;
    const startedAt = performance.now();
    const step = (now: number) => {
      const progress = clamp((now - startedAt) / ORIGINS_COUNT_UP_MS, 0, 1);
      value.textContent = formatSubscribers(ORIGINS_SUBSCRIBER_TARGET * easeOutCubic(progress));
      if (progress < 1) countUpFrame.current = requestAnimationFrame(step);
    };
    countUpFrame.current = requestAnimationFrame(step);
  };

  // Continuous part: fill the year and decide whether the clips are fanned.
  useScrollScrub((frame) => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const year = yearRef.current;
    if (year) {
      year.style.setProperty("--r", entryProgressOf(section, frame.viewportHeight).toFixed(4));
    }

    const sectionTop = section.getBoundingClientRect().top;
    const fan = fanRef.current;
    if (fan) {
      const fanned = sectionTop < frame.viewportHeight * FAN_TRIGGER ? "true" : "false";
      if (fan.dataset.fanned !== fanned) fan.dataset.fanned = fanned;
    }

    // The tension beat: the subscriber count and the quote wait for "next" (data-presenter-step) or for real scrolling.
    const released =
      Number(section.dataset.presenterStep ?? "0") >= 1 || sectionTop < -frame.viewportHeight * TENSION_RELEASE_VH;
    if (released && !releasedRef.current) {
      releasedRef.current = true;
      for (const node of [counterRef.current, quoteRef.current]) if (node) node.dataset.on = "true";
      runCountUp();
    }
  });

  // Reduced motion: everything lands in its final state, no scrub and no observers.
  useEffect(() => {
    if (!reducedMotion) return;
    yearRef.current?.style.setProperty("--r", "1");
    if (fanRef.current) fanRef.current.dataset.fanned = "true";
    for (const node of [factsRef.current, counterRef.current, quoteRef.current]) {
      if (node) node.dataset.on = "true";
    }
    if (counterValueRef.current) {
      counterValueRef.current.textContent = formatSubscribers(ORIGINS_SUBSCRIBER_TARGET);
    }
  }, [reducedMotion]);

  // One-shot reveal of the facts; the counter and the quote are the tension beat handled in the scrub loop.
  useEffect(() => {
    if (reducedMotion) return;
    const facts = factsRef.current;
    if (!facts) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          facts.dataset.on = "true";
        }
      },
      { threshold: REVEAL_THRESHOLD },
    );
    observer.observe(facts);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(countUpFrame.current);
    };
  }, [reducedMotion]);

  return { sectionRef, yearRef, factsRef, counterRef, counterValueRef, quoteRef, fanRef };
};
