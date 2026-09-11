import { useEffect, useRef, type RefObject } from "react";
import { clamp } from "@/common/helpers/math";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useScrollScrub } from "@/common/hooks/useScrollScrub";

const TRAIL_FULL_SPEED_PX = 26; // per-frame scroll delta that lights the trail completely
const TRAIL_DECAY = 0.9; // how fast the trail fades once scrolling stops
/** A press that moves less than this is a click (jump there smoothly), not a drag. */
const CLICK_SLOP_PX = 4;
/** Keyboard step on the focused rail: one screen per arrow press. */
const KEY_STEP_VH = 0.9;

interface ScrollVelocity {
  lastScrollY: number;
  trail: number;
}

const maxScroll = (): number => document.documentElement.scrollHeight - window.innerHeight;

/** Page y for a pointer at `clientY` over the rail: the rail spans the whole page, top to bottom. */
const scrollTargetOf = (rail: HTMLElement, clientY: number): number => {
  const rect = rail.getBoundingClientRect();
  return clamp((clientY - rect.top) / rect.height, 0, 1) * maxScroll();
};

/**
 * Writes page progress (--p) and scroll heat (--v) onto the rail element, and makes the rail a scrollbar:
 * click to jump, drag the comet head to scroll, arrows when focused. `data-dragging` styles the grab.
 */
export const useProgressComet = (railRef: RefObject<HTMLElement | null>): void => {
  const reducedMotion = useReducedMotion();
  const velocityRef = useRef<ScrollVelocity>({ lastScrollY: 0, trail: 0 });
  const lastPercent = useRef(-1);

  useScrollScrub((frame) => {
    const rail = railRef.current;
    if (rail === null) return;
    const travel = frame.documentHeight - frame.viewportHeight;
    const progress = travel > 0 ? clamp(frame.scrollY / travel, 0, 1) : 0;
    rail.style.setProperty("--p", progress.toFixed(4));
    // Accessible value, written only when the whole percent changes.
    const percent = Math.round(progress * 100);
    if (percent !== lastPercent.current) {
      lastPercent.current = percent;
      rail.setAttribute("aria-valuenow", String(percent));
    }

    const velocity = velocityRef.current;
    if (reducedMotion) {
      rail.style.setProperty("--v", "0");
      return;
    }
    const delta = Math.abs(frame.scrollY - velocity.lastScrollY);
    velocity.lastScrollY = frame.scrollY;
    velocity.trail = Math.max(clamp(delta / TRAIL_FULL_SPEED_PX, 0, 1), velocity.trail * TRAIL_DECAY);
    rail.style.setProperty("--v", velocity.trail.toFixed(3));
  });

  // Pointer: press anywhere on the rail, drag to scroll; a still press is a click that glides there.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let pressedAt: number | null = null;
    let moved = false;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      event.preventDefault();
      rail.setPointerCapture(event.pointerId);
      pressedAt = event.clientY;
      moved = false;
      rail.dataset.dragging = "true";
    };
    const onPointerMove = (event: PointerEvent) => {
      if (pressedAt === null) return;
      if (!moved && Math.abs(event.clientY - pressedAt) < CLICK_SLOP_PX) return;
      moved = true;
      // "instant": the page has smooth scroll-behavior, which would lag behind the hand.
      window.scrollTo({ top: scrollTargetOf(rail, event.clientY), behavior: "instant" });
    };
    const onPointerUp = (event: PointerEvent) => {
      if (pressedAt === null) return;
      if (!moved) window.scrollTo({ top: scrollTargetOf(rail, event.clientY), behavior: reducedMotion ? "instant" : "smooth" });
      pressedAt = null;
      rail.dataset.dragging = "false";
      if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const step = window.innerHeight * KEY_STEP_VH;
      const jumps: Record<string, number | undefined> = {
        ArrowDown: window.scrollY + step,
        ArrowRight: window.scrollY + step,
        PageDown: window.scrollY + step,
        ArrowUp: window.scrollY - step,
        ArrowLeft: window.scrollY - step,
        PageUp: window.scrollY - step,
        Home: 0,
        End: maxScroll(),
      };
      const target = jumps[event.key];
      if (target === undefined) return;
      event.preventDefault();
      // The presenter's keys also listen on window; a focused rail answers them itself, so stop them here.
      event.stopPropagation();
      window.scrollTo({ top: clamp(target, 0, maxScroll()), behavior: reducedMotion ? "instant" : "smooth" });
    };

    rail.addEventListener("pointerdown", onPointerDown);
    rail.addEventListener("pointermove", onPointerMove);
    rail.addEventListener("pointerup", onPointerUp);
    rail.addEventListener("pointercancel", onPointerUp);
    rail.addEventListener("keydown", onKeyDown);
    return () => {
      rail.removeEventListener("pointerdown", onPointerDown);
      rail.removeEventListener("pointermove", onPointerMove);
      rail.removeEventListener("pointerup", onPointerUp);
      rail.removeEventListener("pointercancel", onPointerUp);
      rail.removeEventListener("keydown", onKeyDown);
    };
  }, [railRef, reducedMotion]);
};
