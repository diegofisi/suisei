import { useRef, type RefObject } from "react";
import { clamp } from "@/common/helpers/math";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useScrollScrub } from "@/common/hooks/useScrollScrub";

const TRAIL_FULL_SPEED_PX = 26; // per-frame scroll delta that lights the trail completely
const TRAIL_DECAY = 0.9; // how fast the trail fades once scrolling stops

interface ScrollVelocity {
  lastScrollY: number;
  trail: number;
}

/** Writes page progress (--p) and scroll heat (--v) onto the rail element; the CSS in the component does the rest. */
export const useProgressComet = (railRef: RefObject<HTMLElement | null>): void => {
  const reducedMotion = useReducedMotion();
  const velocityRef = useRef<ScrollVelocity>({ lastScrollY: 0, trail: 0 });

  useScrollScrub((frame) => {
    const rail = railRef.current;
    if (rail === null) return;
    const travel = frame.documentHeight - frame.viewportHeight;
    const progress = travel > 0 ? clamp(frame.scrollY / travel, 0, 1) : 0;
    rail.style.setProperty("--p", progress.toFixed(4));

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
};
