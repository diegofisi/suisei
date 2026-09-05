import type { ReactNode, Ref } from "react";
import { Box, Stack } from "@mui/material";
import { Palette } from "@/common/models/palette";
import { NARROW_MEDIA } from "@/features/story/helpers/layout";
import { TURN_SECTION_HEIGHT } from "@/features/story/helpers/turnContent";

interface TurnShellProps {
  sectionRef: Ref<HTMLElement>;
  statement: ReactNode;
  milestones: ReactNode;
  render: ReactNode;
  closing: ReactNode;
}

/** Tall sticky stage for scene 5. The wash cross-fades from SAKURA to COMET as `--p` runs 0→1. */
export const TurnShell = ({ sectionRef, statement, milestones, render, closing }: TurnShellProps) => (
  <Box
    component="section"
    ref={sectionRef}
    aria-label="El giro: INoNaKa Music y hololive, 2019"
    sx={{ position: "relative", height: TURN_SECTION_HEIGHT }}
  >
    <Box
      sx={{
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
        isolation: "isolate",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 40%)",
        alignItems: "center",
        gap: "5vw",
        padding: "0 7vw",
        [NARROW_MEDIA]: {
          gridTemplateColumns: "minmax(0, 1fr)",
          alignContent: "center",
          gap: "3vh",
        },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: "calc(1 - var(--p, 0))",
          background: `radial-gradient(66% 52% at 24% 46%, ${Palette.SAKURA_SOFT} 0%, transparent 70%)`,
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: "var(--p, 0)",
          background: `radial-gradient(72% 58% at 66% 48%, ${Palette.COMET_SOFT} 0%, transparent 72%)`,
        }}
      />

      <Stack sx={{ position: "relative", zIndex: 1, minWidth: 0, gap: "2.2rem" }}>
        {statement}
        {milestones}
        {closing}
      </Stack>
      <Box sx={{ position: "relative", zIndex: 1, minWidth: 0 }}>{render}</Box>
    </Box>
  </Box>
);
