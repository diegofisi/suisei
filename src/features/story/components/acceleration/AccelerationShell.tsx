import type { ReactNode, Ref } from "react";
import { Box, Stack } from "@mui/material";
import { Palette } from "@/common/models/palette";
import { ACCELERATION_SECTION_HEIGHT } from "@/features/story/helpers/accelerationContent";
import { NARROW_MEDIA, WIDE_MEDIA } from "@/features/story/helpers/layout";

interface AccelerationShellProps {
  /** Carries `--p` and `data-stage`; both are inherited/selectable by everything inside. */
  sectionRef: Ref<HTMLElement>;
  header: ReactNode;
  rocket: ReactNode;
  telemetry: ReactNode;
  quote?: ReactNode;
}

/** Scene 6 frame: a tall section with a 100vh sticky stage (normal flow under 760px). */
export const AccelerationShell = ({ sectionRef, header, rocket, telemetry, quote }: AccelerationShellProps) => (
  <Box
    component="section"
    data-beats="0.5,0.9"
    ref={sectionRef}
    aria-label="La aceleración, 2020–2021"
    data-stage="0"
    sx={{
      position: "relative",
      "--p": 0,
      [WIDE_MEDIA]: { height: ACCELERATION_SECTION_HEIGHT },
    }}
  >
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "auto minmax(0, 1fr) auto",
        gap: "1.8vh",
        padding: "6vh 7vw 5vh",
        overflow: "hidden",
        [WIDE_MEDIA]: {
          position: "sticky",
          top: 0,
          height: "100vh",
          alignContent: "center",
        },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          // The exhaust glow grows with the scene: faint at lift-off, bright in orbit.
          opacity: "calc(var(--p, 0) * 0.85)",
          background: `radial-gradient(52% 40% at 26% 88%, ${Palette.COMET_SOFT} 0%, transparent 72%)`,
        }}
      />
      <Box sx={{ position: "relative", zIndex: 1 }}>{header}</Box>
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(260px, 38%)",
          gap: "4vw",
          alignItems: "center",
          [NARROW_MEDIA]: {
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: "5vh",
          },
        }}
      >
        <Box sx={{ minWidth: 0 }}>{rocket}</Box>
        <Stack sx={{ minWidth: 0, gap: "2.2vh" }}>{telemetry}</Stack>
      </Box>
      {quote && <Box sx={{ position: "relative", zIndex: 1 }}>{quote}</Box>}
    </Box>
  </Box>
);
