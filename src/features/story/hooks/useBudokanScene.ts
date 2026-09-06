import { useEffect, useRef, type RefObject } from "react";
import { phase } from "@/common/helpers/math";
import { stickyProgressOf } from "@/common/helpers/scrollScrubber";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useScrollScrub } from "@/common/hooks/useScrollScrub";
import {
  BUDOKAN_STEP_BOUNDS,
  CONCERT_TILES,
  FACTS_REVEAL_AT,
  WALL_PHASE,
  WALL_HOLD_MAX_MS,
  WALL_HOLD_MIN_MS,
  YEAR_FILL_PHASE,
} from "@/features/story/helpers/budokanContent";

export interface BudokanSceneRefs {
  /** Carries `--p` (0→1), `data-step` (0..3) and `data-static` under reduced motion. */
  sectionRef: RefObject<HTMLElement | null>;
  /** Holds `--r`: how much of the giant gold year is filled. */
  yearRef: RefObject<HTMLDivElement | null>;
  factsRef: RefObject<HTMLUListElement | null>;
  /** Holds `--rw` (0→1); each `[data-slot]` tile inside flips to `data-lit` once the deal passes its slot. */
  wallRef: RefObject<HTMLDivElement | null>;
}

const setFlag = (node: HTMLElement | null, value: boolean): void => {
  if (!node) return;
  const next = value ? "true" : "false";
  // Only write on change: the loop runs at 60 fps and attribute churn forces style recalcs.
  if (node.dataset.on !== next) node.dataset.on = next;
};

/** Hold time of a frame before its lid swaps again (the lid animation itself adds ~1 s of open time). */
const holdMs = (): number => WALL_HOLD_MIN_MS + Math.random() * (WALL_HOLD_MAX_MS - WALL_HOLD_MIN_MS);
const WALL_TICK_MS = 120;

const stepOf = (progress: number): string => {
  let step = 0;
  while (step < BUDOKAN_STEP_BOUNDS.length && progress >= (BUDOKAN_STEP_BOUNDS[step] ?? 1)) step += 1;
  return String(step);
};

/** The brain of scene 8: gold year fill, the wall flipping open tile by tile, and the TOKIO DOME slam. */
export const useBudokanScene = (): BudokanSceneRefs => {
  const isStatic = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const factsRef = useRef<HTMLUListElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<{ node: HTMLElement; slot: number; nextSwapAt: number }[] | null>(null);

  const tiles = () => {
    if (tilesRef.current) return tilesRef.current;
    const wall = wallRef.current;
    if (!wall) return [];
    const now = performance.now();
    tilesRef.current = [...wall.querySelectorAll<HTMLElement>("[data-slot]")].map((node) => ({
      node,
      slot: Number(node.dataset.slot ?? "0"),
      // Each lid keeps its own clock, desynchronised from the start, so many swap at once but never in lockstep.
      nextSwapAt: now + Math.random() * WALL_HOLD_MAX_MS * 2.5,
    }));
    return tilesRef.current;
  };

  const dealWall = (dealt: number) => {
    for (const tile of tiles()) {
      const lit = dealt >= tile.slot ? "true" : "false";
      if (tile.node.dataset.lit !== lit) tile.node.dataset.lit = lit;
    }
  };

  /** A lid closes and reopens on a different frame. */
  const swapLid = (node: HTMLElement) => {
    const image = node.querySelector("img");
    if (!image) return;
    const current = CONCERT_TILES.findIndex((tile) => image.getAttribute("src") === tile.src);
    const next = CONCERT_TILES[(current + 1 + Math.floor(Math.random() * (CONCERT_TILES.length - 1))) % CONCERT_TILES.length];
    if (!next) return;
    node.dataset.lit = "false";
    // Forcing a layout between the two writes restarts the lid animation.
    void node.offsetWidth;
    image.src = next.src;
    node.dataset.lit = "true";
  };

  /** Every lit lid swaps on its own clock: a frame stays 1.5–2 s, then changes; several change at the same time. */
  const swapDueLids = (now: number) => {
    for (const tile of tiles()) {
      if (tile.node.dataset.lit !== "true" || now < tile.nextSwapAt) continue;
      swapLid(tile.node);
      tile.nextSwapAt = now + holdMs();
    }
  };

  useScrollScrub(({ viewportHeight }) => {
    const section = sectionRef.current;
    if (isStatic || !section) return;

    const progress = stickyProgressOf(section, viewportHeight);
    section.style.setProperty("--p", progress.toFixed(4));
    const step = stepOf(progress);
    if (section.dataset.step !== step) section.dataset.step = step;

    // The year fills completely as soon as the stage is on screen (a timed wipe), so landing at p = 0 never shows it empty.
    const stageVisible = section.getBoundingClientRect().top < viewportHeight * YEAR_FILL_PHASE.end;
    yearRef.current?.style.setProperty("--r", stageVisible ? "1" : "0");
    setFlag(factsRef.current, progress >= FACTS_REVEAL_AT);

    const dealt = phase(progress, WALL_PHASE.start, WALL_PHASE.end);
    wallRef.current?.style.setProperty("--rw", dealt.toFixed(4));
    dealWall(dealt);
  });

  /** Spread the lids' clocks over the next few seconds, so swaps trickle continuously instead of arriving in waves. */
  const reseedClocks = (now: number) => {
    for (const tile of tiles()) tile.nextSwapAt = now + Math.random() * (WALL_HOLD_MAX_MS + WALL_HOLD_MIN_MS);
  };

  // Keep the wall alive while the scene is on screen: a coarse tick checks which lids are due to swap.
  useEffect(() => {
    if (isStatic) return;
    let onScreen = false;
    const timer = window.setInterval(() => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < window.innerHeight;
      if (!visible) {
        onScreen = false;
        return;
      }
      const now = performance.now();
      // Clocks seeded while the scene was off screen would all be overdue at once: reseed on entry.
      if (!onScreen) {
        onScreen = true;
        reseedClocks(now);
        return;
      }
      swapDueLids(now);
    }, WALL_TICK_MS);
    return () => window.clearInterval(timer);
    // swapDueLids / reseedClocks only read refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStatic]);

  // Reduced motion: the stage stops being sticky and every block is shown at once, already resolved.
  useEffect(() => {
    const section = sectionRef.current;
    if (!isStatic || !section) return;
    section.dataset.static = "true";
    section.dataset.step = String(BUDOKAN_STEP_BOUNDS.length);
    section.style.setProperty("--p", "1");
    yearRef.current?.style.setProperty("--r", "1");
    wallRef.current?.style.setProperty("--rw", "1");
    setFlag(factsRef.current, true);
    dealWall(1);
    // dealWall only reads refs; it never needs to re-run for anything but the motion setting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStatic]);

  return { sectionRef, yearRef, factsRef, wallRef };
};
