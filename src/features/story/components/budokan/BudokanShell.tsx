import type { ReactNode, Ref } from "react";
import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import {
  BRIDGE_LAYER_SX,
  DOME_LAYER_SX,
  FACTS_LAYER_SX,
  INTRO_LAYER_SX,
  NOTES_LAYER_SX,
} from "@/features/story/components/budokan/stageLayers";

interface BudokanShellProps {
  /** Carries --p, data-step and (reduced motion) data-static for the whole scene. */
  sectionRef: Ref<HTMLElement>;
  intro: ReactNode;
  facts: ReactNode;
  notes: ReactNode;
  dome: ReactNode;
  bridge: ReactNode;
  collage: ReactNode;
}

const STATIC = '[data-static="true"] &';

/** Tall sticky section: one 100vh stage where the five steps cross-fade over a gold nebula, collage pinned at the bottom. */
export const BudokanShell = ({ sectionRef, intro, facts, notes, dome, bridge, collage }: BudokanShellProps) => (
  <Box
    component="section"
    ref={sectionRef}
    aria-label="El momento: Budokan SuperNova, 1 de febrero de 2025"
    data-step="0"
    sx={{ position: "relative", height: "420vh", '&[data-static="true"]': { height: "auto" } }}
  >
    <Box
      sx={{
        position: "sticky",
        top: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "3vh",
        padding: "9vh 7vw 5vh",
        overflow: "hidden",
        isolation: "isolate",
        [STATIC]: { position: "static", height: "auto", padding: "16vh 7vw", gap: "8vh" },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: "clamp(0, var(--p, 0) / 0.2, 1)",
          background: `radial-gradient(58% 46% at 50% 4%, ${alpha(Palette.GOLD, 0.14)} 0%, transparent 72%),
            radial-gradient(46% 38% at 16% 92%, ${Palette.COMET_SOFT} 0%, transparent 74%)`,
          [STATIC]: { opacity: 1 },
        }}
      />

      <Box
        sx={{
          position: "relative",
          // Above the collage: the 2018 note and TOKIO DOME land on top of the dimmed wall.
          zIndex: 2,
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          alignItems: "stretch",
          [STATIC]: {
            flex: "none",
            gap: "7vh",
            "& > *": { gridArea: "auto", opacity: 1, transform: "none" },
          },
        }}
      >
        <Box sx={INTRO_LAYER_SX}>{intro}</Box>
        <Box sx={FACTS_LAYER_SX}>{facts}</Box>
        <Box sx={NOTES_LAYER_SX}>{notes}</Box>
        <Box sx={DOME_LAYER_SX}>{dome}</Box>
        <Box sx={BRIDGE_LAYER_SX}>{bridge}</Box>
      </Box>

      {collage}
    </Box>
  </Box>
);
