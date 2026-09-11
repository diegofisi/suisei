import type { ReactNode, Ref } from "react";
import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import { STAGE_HEIGHT_SX } from "@/features/story/helpers/layout";
import { DOME_LAYER_SX, FACTS_LAYER_SX, INTRO_LAYER_SX } from "@/features/story/components/budokan/stageLayers";

interface BudokanShellProps {
  /** Carries --p, data-step and (reduced motion) data-static for the whole scene. */
  sectionRef: Ref<HTMLElement>;
  intro: ReactNode;
  facts: ReactNode;
  dome: ReactNode;
  wall: ReactNode;
}

const STATIC = '[data-static="true"] &';

/** Darkens the wall while text sits on it: fully during the intro, lifted while the wall is the show, back for the shout. */
const VEIL_OPACITY =
  "min(1, calc(1 - clamp(0, (var(--p, 0) - 0.06) / 0.1, 1) + clamp(0, (var(--p, 0) - 0.78) / 0.06, 1)))";

/** Sticky stage: the concert wall fills the screen; year + facts sit on it at first, the shout lands on it at the end. */
export const BudokanShell = ({ sectionRef, intro, facts, dome, wall }: BudokanShellProps) => (
  <Box
    component="section"
    data-beats="0.9"
    data-glide="out"
    ref={sectionRef}
    aria-label="El momento: Budokan SuperNova, 1 de febrero de 2025"
    data-step="0"
    sx={{ position: "relative", height: "320vh", '&[data-static="true"]': { height: "auto" } }}
  >
    <Box
      sx={{
        position: "sticky",
        top: 0,
        ...STAGE_HEIGHT_SX,
        overflow: "hidden",
        isolation: "isolate",
        [STATIC]: { position: "static", height: "auto" },
      }}
    >
      {wall}

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          opacity: VEIL_OPACITY,
          background: `linear-gradient(180deg, ${alpha(Palette.SKY, 0.66)} 0%, ${alpha(Palette.SKY, 0.5)} 55%, ${alpha(Palette.SKY, 0.7)} 100%),
            radial-gradient(58% 46% at 50% 4%, ${alpha(Palette.GOLD, 0.16)} 0%, transparent 72%)`,
          [STATIC]: { display: "none" },
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          padding: "9vh 7vw 6vh",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          alignItems: "stretch",
          [STATIC]: {
            height: "auto",
            gap: "7vh",
            padding: "12vh 7vw",
            "& > *": { gridArea: "auto", opacity: 1, transform: "none" },
          },
        }}
      >
        <Box sx={INTRO_LAYER_SX}>{intro}</Box>
        <Box sx={FACTS_LAYER_SX}>{facts}</Box>
        <Box sx={DOME_LAYER_SX}>{dome}</Box>
      </Box>
    </Box>
  </Box>
);
