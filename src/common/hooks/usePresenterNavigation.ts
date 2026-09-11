import { useCallback, useEffect, useRef, type RefObject } from "react";
import { clamp, easeInOutCubic, easeOutCubic } from "@/common/helpers/math";
import { subscribeScrub } from "@/common/helpers/scrollScrubber";
import { isNarrowViewport } from "@/common/helpers/viewport";

export interface PresenterNavigation {
  /** Counter root; the hook writes `data-scene` and the "NN / MM" text into `counterRef`. */
  counterRef: RefObject<HTMLSpanElement | null>;
  sceneCount: number;
  onNext: () => void;
  onPrevious: () => void;
}

interface Stop {
  /** Page y to land on. */
  y: number;
  /** 1-based scene number the stop belongs to. */
  scene: number;
  /** The scene's own top: always kept, however close the next stop is. */
  isTop?: boolean;
}

/** Scroll speed of a "next" press: ms per viewport of travel, so long sticky scenes take longer and stay readable. */
const MS_PER_VIEWPORT = 1540;
const MIN_TWEEN_MS = 840;
const MAX_TWEEN_MS = 8400;
/** A section this much taller than the viewport also stops at its end, so nothing below the fold is skipped. */
const TALL_SECTION_RATIO = 1.15;
/** Plain scenes taller than that are paged: one stop per this fraction of a viewport, so every block gets its screen time. */
const PAGE_FRACTION = 0.8;
/**
 * `data-beats` describe a sticky stage, which is always at least this many viewports tall. A shorter section with
 * beats is that same scene stacked in normal flow (phones), where the beats mean nothing: it is paged instead.
 */
const STAGE_MIN_RATIO = 2;
const NEXT_KEYS = new Set(["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"]);
const PREVIOUS_KEYS = new Set(["ArrowLeft", "ArrowUp", "PageUp", "Backspace"]);

const pad = (value: number): string => String(value).padStart(2, "0");

/** Every landing point of the talk: each scene's top, its declared beats, and the end of tall (sticky) scenes. */
const collectStops = (): Stop[] => {
  const sections = [...document.querySelectorAll<HTMLElement>("main > section")];
  const viewport = window.innerHeight;
  const stops: Stop[] = [];
  sections.forEach((section, index) => {
    const top = Math.round(section.getBoundingClientRect().top + window.scrollY);
    const height = section.offsetHeight;
    stops.push({ y: top, scene: index + 1, isTop: true });
    // Scenes that fit one screen: a single stop, their reveals fire on arrival.
    if (height <= viewport * TALL_SECTION_RATIO) return;
    const travel = height - viewport;
    // Plain scenes that overflow the screen (single-column phone layouts, short windows) are paged screen by screen.
    if (section.dataset.beats === undefined || height < viewport * STAGE_MIN_RATIO) {
      const pages = Math.max(1, Math.ceil(travel / (viewport * PAGE_FRACTION)));
      for (let page = 1; page < pages; page += 1) stops.push({ y: top + Math.round((travel * page) / pages), scene: index + 1 });
      stops.push({ y: top + travel, scene: index + 1 });
      return;
    }
    // Sticky scenes list their inner beats (facts, collage, shout…) as progress fractions in `data-beats`.
    const beats = (section.dataset.beats ?? "")
      .split(",")
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value) && value > 0 && value < 1);
    beats.forEach((beat) => stops.push({ y: top + Math.round(travel * beat), scene: index + 1 }));
    stops.push({ y: top + travel, scene: index + 1 });
  });
  // Drop end-stops that sit almost on top of the next scene: that press would move a few pixels for nothing.
  return stops.filter((stop, index) => {
    const following = stops[index + 1];
    return stop.isTop || !following || following.y - stop.y > viewport * 0.35;
  });
};

/** The scene whose top is closest above the 40%-of-viewport line: what the audience is looking at. */
const currentSection = (): HTMLElement | null => {
  const sections = [...document.querySelectorAll<HTMLElement>("main > section")];
  const line = window.scrollY + window.innerHeight * 0.4;
  let current: HTMLElement | null = null;
  for (const section of sections) {
    if (section.getBoundingClientRect().top + window.scrollY <= line) current = section;
  }
  return current;
};

const isTypingTarget = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);

/** Space/Enter on a focused button must keep activating that button, not turn the page. */
const isActivationOnControl = (event: KeyboardEvent): boolean =>
  (event.key === " " || event.key === "Enter") &&
  event.target instanceof HTMLElement &&
  event.target.closest("button, a, [role='button']") !== null;

/**
 * PowerPoint-style control over a scroll-driven page: arrow keys, PageDown/Up, space, a clicker, or the on-screen
 * buttons glide to the next landing point at a readable speed, so every scroll animation still plays.
 */
export const usePresenterNavigation = (): PresenterNavigation => {
  const counterRef = useRef<HTMLSpanElement>(null);
  const sceneCountRef = useRef(0);
  const tweenFrame = useRef(0);
  const targetY = useRef<number | null>(null);

  const cancelTween = useCallback(() => {
    cancelAnimationFrame(tweenFrame.current);
    targetY.current = null;
  }, []);

  const glideTo = useCallback(
    (y: number, easing: (t: number) => number = easeInOutCubic) => {
      cancelAnimationFrame(tweenFrame.current);
      const from = window.scrollY;
      const to = clamp(y, 0, document.documentElement.scrollHeight - window.innerHeight);
      const distance = Math.abs(to - from);
      if (distance < 1) return;
      const duration = clamp((distance / window.innerHeight) * MS_PER_VIEWPORT, MIN_TWEEN_MS, MAX_TWEEN_MS);
      const startedAt = performance.now();
      targetY.current = to;
      const step = (now: number) => {
        const progress = clamp((now - startedAt) / duration, 0, 1);
        // "instant": the page has smooth scroll-behavior, which would otherwise fight the tween.
        window.scrollTo({ top: from + (to - from) * easing(progress), behavior: "instant" });
        if (progress < 1) {
          tweenFrame.current = requestAnimationFrame(step);
          return;
        }
        targetY.current = null;
      };
      tweenFrame.current = requestAnimationFrame(step);
    },
    [],
  );

  const move = useCallback(
    (direction: 1 | -1) => {
      // One press = one full glide: presses (and key auto-repeat) during a glide are ignored, so no beat is skipped.
      if (targetY.current !== null) return;
      // Scenes with `data-reveal-steps` first reveal in place (no scroll) before the page moves on. Only on wide
      // screens: stacked on a phone, what the step would reveal sits below the fold, so the press would look dead.
      const current = currentSection();
      if (current && current.dataset.revealSteps !== undefined && !isNarrowViewport(window.innerWidth)) {
        const steps = Number(current.dataset.revealSteps);
        const step = Number(current.dataset.presenterStep ?? "0");
        if (direction === 1 && step < steps) {
          current.dataset.presenterStep = String(step + 1);
          return;
        }
        if (direction === -1 && step > 0) {
          current.dataset.presenterStep = String(step - 1);
          return;
        }
      }
      const stops = collectStops();
      const origin = window.scrollY;
      const tolerance = 6;
      const next =
        direction === 1
          ? stops.find((stop) => stop.y > origin + tolerance)
          : [...stops].reverse().find((stop) => stop.y < origin - tolerance);
      // A scene marked data-glide="out" answers the press at once (no ease-in) and settles gently at the stop.
      const easing = current?.dataset.glide === "out" ? easeOutCubic : easeInOutCubic;
      if (next) glideTo(next.y, easing);
    },
    [glideTo],
  );

  const onNext = useCallback(() => move(1), [move]);
  const onPrevious = useCallback(() => move(-1), [move]);

  // Keys: the presenter (or a clicker) drives the page; the user's own wheel/touch cancels a glide in progress.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || isTypingTarget(event.target) || isActivationOnControl(event)) return;
      if (NEXT_KEYS.has(event.key)) {
        event.preventDefault();
        move(1);
      } else if (PREVIOUS_KEYS.has(event.key)) {
        event.preventDefault();
        move(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        glideTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        glideTo(document.documentElement.scrollHeight);
      }
    };
    // Any element marked data-presenter-next / data-presenter-previous (e.g. the hero's SCROLL cue) turns the page too.
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest("[data-presenter-next]")) move(1);
      else if (event.target.closest("[data-presenter-previous]")) move(-1);
    };
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", cancelTween, { passive: true });
    window.addEventListener("touchstart", cancelTween, { passive: true });
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", cancelTween);
      window.removeEventListener("touchstart", cancelTween);
      cancelAnimationFrame(tweenFrame.current);
    };
  }, [move, glideTo, cancelTween]);

  // Scene counter: written straight into the DOM from the shared scroll loop.
  useEffect(() => {
    sceneCountRef.current = document.querySelectorAll("main > section").length;
    let lastScene = -1;
    return subscribeScrub(({ scrollY, viewportHeight }) => {
      const counter = counterRef.current;
      if (!counter) return;
      const sections = document.querySelectorAll<HTMLElement>("main > section");
      let scene = 1;
      sections.forEach((section, index) => {
        if (section.getBoundingClientRect().top + window.scrollY <= scrollY + viewportHeight * 0.4) scene = index + 1;
      });
      if (scene === lastScene) return;
      lastScene = scene;
      counter.textContent = `${pad(scene)} / ${pad(sections.length)}`;
      counter.dataset.scene = String(scene);
    });
  }, []);

  return { counterRef, sceneCount: sceneCountRef.current, onNext, onPrevious };
};
