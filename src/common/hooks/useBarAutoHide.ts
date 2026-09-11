import { useEffect, type RefObject } from "react";
import { subscribeScrub } from "@/common/helpers/scrollScrubber";

/** Scroll distance (px) before the bar hides; it comes back on any upward scroll or when hovered. */
const HIDE_AFTER_PX = 120;
const SCROLL_DEADBAND_PX = 4;

/** Hides the music bar while the page scrolls down and shows it on the way up: `data-hidden` on the bar, no React work per frame. */
export const useBarAutoHide = (barRef: RefObject<HTMLElement | null>): void => {
  useEffect(() => {
    let lastY = window.scrollY;
    return subscribeScrub(({ scrollY }) => {
      const bar = barRef.current;
      const delta = scrollY - lastY;
      if (!bar || Math.abs(delta) < SCROLL_DEADBAND_PX) return;
      lastY = scrollY;
      const hidden = delta > 0 && scrollY > HIDE_AFTER_PX ? "true" : "false";
      if (bar.dataset.hidden !== hidden) bar.dataset.hidden = hidden;
    });
  }, [barRef]);
};
