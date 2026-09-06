import type { Ref } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import type { FactTone } from "@/features/story/interfaces/StoryViewModels";

interface YearRevealProps {
  year: string;
  yearRef: Ref<HTMLDivElement>;
  /** COMET for milestones (default), SAKURA for the human chapters, GOLD only for the Budokan. */
  tone?: FactTone | "gold";
  /** Animate the wipe over time when `--r` jumps (for scenes that set it to 1 on arrival instead of scrubbing it). */
  animatedFill?: boolean;
}

/** Room left around the glyphs so the glow is not cut into a hard rectangle by the wipe. */
const GLOW_BLEED = "48px";

const FILL_BY_TONE = {
  comet: { color: Palette.COMET, glow: Palette.COMET_SOFT },
  sakura: { color: Palette.SAKURA, glow: Palette.SAKURA_SOFT },
  gold: { color: Palette.GOLD, glow: alpha(Palette.GOLD, 0.35) },
} as const;

/** A giant year: an outlined copy with a filled copy wiped over it by `--r` (0→1), written by the scene hook. */
export const YearReveal = ({ year, yearRef, tone = "comet", animatedFill = false }: YearRevealProps) => {
  const fill = FILL_BY_TONE[tone];
  return (
    <Box
      ref={yearRef}
      sx={{
        "--r": 0,
        position: "relative",
        display: "inline-block",
        alignSelf: "flex-start",
        marginBottom: "0.2rem",
        // Laptop heights: a smaller year keeps a plain scene inside one screen.
        ["@media (max-height: 900px)"]: { "& > *": { fontSize: "clamp(60px, 7.2vw, 112px)" } },
        ["@media (max-height: 780px)"]: { "& > *": { fontSize: "clamp(52px, 6.2vw, 96px)" } },
      }}
    >
      <Typography
        variant="display"
        aria-label={year}
        sx={{
          color: "transparent",
          WebkitTextStroke: `1px ${alpha(fill.color, 0.55)}`,
        }}
      >
        {year}
      </Typography>
      <Typography
        variant="display"
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          color: fill.color,
          textShadow: `0 0 38px ${fill.glow}`,
          // The right edge travels from the box edge (r = 0) to beyond the glow (r = 1), so a full year keeps its whole halo.
          clipPath: `inset(-${GLOW_BLEED} calc((1 - var(--r)) * (100% + ${GLOW_BLEED}) - ${GLOW_BLEED}) -${GLOW_BLEED} -${GLOW_BLEED})`,
          transition: animatedFill ? "clip-path 1.4s cubic-bezier(.2,.8,.2,1)" : "none",
          pointerEvents: "none",
        }}
      >
        {year}
      </Typography>
    </Box>
  );
};
