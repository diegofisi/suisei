import { useEffect, type RefObject } from "react";

/** Visible fraction a block needs before its one-shot reveal fires. */
const DEFAULT_THRESHOLD = 0.12;

/**
 * Sets `data-on="true"` on each ref'd node the first time it scrolls into view (or immediately under reduced motion).
 * Components own the transition in `sx` via `'&[data-on="true"]'` / `'[data-on="true"] &'`.
 */
export const useRevealOnce = (
  refs: RefObject<HTMLElement | null>[],
  reducedMotion: boolean,
  onReveal?: (node: HTMLElement) => void,
  threshold = DEFAULT_THRESHOLD,
): void => {
  useEffect(() => {
    const targets = refs.map((ref) => ref.current).filter((node) => node !== null);
    if (targets.length === 0) return;

    if (reducedMotion) {
      for (const node of targets) node.dataset.on = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const node = entry.target;
          if (!(node instanceof HTMLElement)) continue;
          observer.unobserve(node);
          if (node.dataset.on === "true") continue;
          node.dataset.on = "true";
          onReveal?.(node);
        }
      },
      { threshold },
    );
    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
    // Refs are stable objects; the list identity is not what matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, threshold]);
};
