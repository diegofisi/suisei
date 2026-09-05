import { clamp } from "@/common/helpers/math";

export interface ScrubFrame {
  scrollY: number;
  time: number;
  viewportWidth: number;
  viewportHeight: number;
  documentHeight: number;
}

type ScrubListener = (frame: ScrubFrame) => void;

const listeners = new Set<ScrubListener>();
let running = false;

// One rAF loop for the whole page: every scroll-driven effect reads the same frame,
// so nothing thrashes layout by measuring at different times.
const loop = (time: number) => {
  if (listeners.size === 0) {
    running = false;
    return;
  }
  const frame: ScrubFrame = {
    scrollY: window.scrollY,
    time,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    documentHeight: document.documentElement.scrollHeight,
  };
  listeners.forEach((listener) => listener(frame));
  requestAnimationFrame(loop);
};

export const subscribeScrub = (listener: ScrubListener): (() => void) => {
  listeners.add(listener);
  if (!running) {
    running = true;
    requestAnimationFrame(loop);
  }
  return () => {
    listeners.delete(listener);
  };
};

/** 0 when the section top reaches the viewport top, 1 when its bottom reaches the viewport bottom. For tall sticky sections. */
export const stickyProgressOf = (element: HTMLElement, viewportHeight: number): number => {
  const rect = element.getBoundingClientRect();
  const travel = rect.height - viewportHeight;
  if (travel <= 0) return 0;
  return clamp(-rect.top / travel, 0, 1);
};

/** 0 while the element top is below the viewport, 1 once its top has risen to `settleAt` x viewport height. */
export const entryProgressOf = (element: HTMLElement, viewportHeight: number, settleAt = 0.35): number => {
  const rect = element.getBoundingClientRect();
  return clamp((viewportHeight - rect.top) / (viewportHeight * (1 - settleAt)), 0, 1);
};
