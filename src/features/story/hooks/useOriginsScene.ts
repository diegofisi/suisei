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
const REVEAL_THRESHOLD = 0.35;
/** The fan opens once the section top has risen past this fraction of the viewport. */
const FAN_TRIGGER = 0.5;

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

  // Continuous part: fill the year and decide whether the clips are fanned.
  useScrollScrub((frame) => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const year = yearRef.current;
    if (year) {
      year.style.setProperty("--r", entryProgressOf(section, frame.viewportHeight).toFixed(4));
    }

    const fan = fanRef.current;
    if (fan) {
      const fanned = section.getBoundingClientRect().top < frame.viewportHeight * FAN_TRIGGER ? "true" : "false";
      if (fan.dataset.fanned !== fanned) fan.dataset.fanned = fanned;
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

  // One-shot reveals. The counter also kicks off its own short rAF (a one-off, not a scroll loop).
  useEffect(() => {
    if (reducedMotion) return;
    const targets = [factsRef.current, counterRef.current, quoteRef.current].filter((node) => node !== null);
    if (targets.length === 0) return;

    let countUpFrame = 0;
    const runCountUp = () => {
      const value = counterValueRef.current;
      if (!value) return;
      const startedAt = performance.now();
      const step = (now: number) => {
        const progress = clamp((now - startedAt) / ORIGINS_COUNT_UP_MS, 0, 1);
        value.textContent = formatSubscribers(ORIGINS_SUBSCRIBER_TARGET * easeOutCubic(progress));
        if (progress < 1) countUpFrame = requestAnimationFrame(step);
      };
      countUpFrame = requestAnimationFrame(step);
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
          if (node === counterRef.current) runCountUp();
        }
      },
      { threshold: REVEAL_THRESHOLD },
    );
    for (const target of targets) observer.observe(target);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(countUpFrame);
    };
  }, [reducedMotion]);

  return { sectionRef, yearRef, factsRef, counterRef, counterValueRef, quoteRef, fanRef };
};
