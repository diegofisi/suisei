import type { SxProps, Theme } from "@mui/material";
import { NARROW_MEDIA } from "@/features/story/helpers/layout";

// Every step block lives in the same grid cell of the sticky stage and is faded in and out by --p.
// The windows below mirror the phase constants of `budokanContent.ts`.
const LAYER = { gridArea: "1 / 1", minWidth: 0, position: "relative", zIndex: 1 } as const;

/** Product of a fade-in and a fade-out window on --p, so a block is only lit inside its own step. */
const fadeWindow = (inStart: number, inSpan: number, outStart: number, outSpan: number): string =>
  `calc(clamp(0, (var(--p, 0) - ${inStart}) / ${inSpan}, 1) * clamp(0, (${outStart + outSpan} - var(--p, 0)) / ${outSpan}, 1))`;

/** Step 0: the year, the dateline, "SuperNova" and the lead paragraph. */
export const INTRO_LAYER_SX: SxProps<Theme> = {
  ...LAYER,
  alignSelf: "center",
  justifySelf: "start",
  width: "46%",
  // Fully lit at p = 0 so the year and title are there the moment the stage sticks.
  opacity: fadeWindow(-0.05, 0.05, 0.26, 0.08),
  [NARROW_MEDIA]: { width: "100%", alignSelf: "start" },
};

/** Step 1: the three facts, on the free half of the stage. */
export const FACTS_LAYER_SX: SxProps<Theme> = {
  ...LAYER,
  // Sits low on the stage: the giant year is wider than its own column and owns the top band.
  alignSelf: "end",
  justifySelf: "end",
  width: "min(46%, 52ch)",
  opacity: fadeWindow(0.14, 0.06, 0.26, 0.06),
  [NARROW_MEDIA]: { width: "100%" },
};

/** Step 2 (tail): the 2018 note next to the rewound frame plus the M13 "comet" note. */
export const NOTES_LAYER_SX: SxProps<Theme> = {
  ...LAYER,
  alignSelf: "end",
  justifySelf: "stretch",
  width: "100%",
  opacity: fadeWindow(0.6, 0.06, 0.72, 0.06),
};

/** Step 3: the new dream, shouted by the room. */
export const DOME_LAYER_SX: SxProps<Theme> = {
  ...LAYER,
  alignSelf: "center",
  justifySelf: "center",
  width: "min(100%, 62ch)",
  opacity: fadeWindow(0.74, 0.06, 0.88, 0.06),
};

/** Step 4: the bridge into scene 9. Its own reveal comes from `data-on`, not from --p. */
export const BRIDGE_LAYER_SX: SxProps<Theme> = {
  ...LAYER,
  alignSelf: "end",
  justifySelf: "center",
  width: "min(100%, 52ch)",
};
