import type { SxProps, Theme } from "@mui/material";
import { NARROW_MEDIA } from "@/features/story/helpers/layout";

// Every step block lives in the same grid cell of the sticky stage and is faded in and out by --p.
// The windows below mirror the phase constants of `budokanContent.ts`.
const LAYER = { gridArea: "1 / 1", minWidth: 0, position: "relative", zIndex: 1 } as const;

/** Product of a fade-in and a fade-out window on --p, so a block is only lit inside its own step. */
const fadeWindow = (inStart: number, inSpan: number, outStart: number, outSpan: number): string =>
  `calc(clamp(0, (var(--p, 0) - ${inStart}) / ${inSpan}, 1) * clamp(0, (${outStart + outSpan} - var(--p, 0)) / ${outSpan}, 1))`;

/** Step 0: the year, the dateline and "SuperNova", over the darkened wall. */
export const INTRO_LAYER_SX: SxProps<Theme> = {
  ...LAYER,
  alignSelf: "center",
  justifySelf: "start",
  width: "46%",
  // Fully lit at p = 0 so the year and title are there the moment the stage sticks.
  opacity: fadeWindow(-0.05, 0.05, 0.04, 0.1),
  [NARROW_MEDIA]: { width: "100%", alignSelf: "start" },
};

/** Step 0 too: the three facts, on the free half of the stage. */
export const FACTS_LAYER_SX: SxProps<Theme> = {
  ...LAYER,
  alignSelf: "center",
  justifySelf: "end",
  width: "min(46%, 52ch)",
  opacity: fadeWindow(-0.05, 0.05, 0.04, 0.08),
  [NARROW_MEDIA]: { width: "100%", alignSelf: "end" },
};

/** Step 2: the new dream, shouted by the room, centred on the dimmed wall. Stays until the next scene. */
export const DOME_LAYER_SX: SxProps<Theme> = {
  ...LAYER,
  alignSelf: "center",
  justifySelf: "center",
  width: "min(100%, 62ch)",
  opacity: fadeWindow(0.8, 0.05, 1.5, 0.1),
};
