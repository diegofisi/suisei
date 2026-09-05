import type { ReactNode, Ref } from "react";
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import { CLOSING_SECTION_LABEL } from "@/features/story/helpers/closingContent";

interface ClosingShellProps {
  sectionRef: Ref<HTMLElement>;
  endRoll: ReactNode;
  thought: ReactNode;
  thanks: ReactNode;
}

// Phase windows in `--p`: A fades out at 0.40, B lives 0.38-0.80, C takes over from 0.78.
const END_ROLL_FADE = "clamp(0, calc((0.4 - var(--p, 0)) / 0.06), 1)";
const THOUGHT_IN = "clamp(0, calc((var(--p, 0) - 0.38) / 0.06), 1)";
const THOUGHT_OUT = "clamp(0, calc((0.8 - var(--p, 0)) / 0.05), 1)";
const THANKS_IN = "clamp(0, calc((var(--p, 0) - 0.78) / 0.07), 1)";

/** One phase of the sticky stage: stacked layers that cross-fade with the scene progress. */
const phaseLayerSx = (opacity: string, transform: string): SxProps<Theme> => ({
  position: "absolute",
  inset: 0,
  display: "grid",
  placeItems: "center",
  padding: "0 7vw",
  pointerEvents: "none",
  opacity,
  transform,
  // Reduced motion: the stage unsticks and the three phases simply stack, all final.
  '[data-static="true"] &': {
    position: "static",
    opacity: 1,
    transform: "none",
  },
});

/** Tall section + sticky stage. `--p` and `--sing` live on the section and are inherited. */
export const ClosingShell = ({ sectionRef, endRoll, thought, thanks }: ClosingShellProps) => (
  <Box
    component="section"
    ref={sectionRef}
    aria-label={CLOSING_SECTION_LABEL}
    data-static="false"
    sx={{
      position: "relative",
      height: "360vh",
      '&[data-static="true"]': { height: "auto" },
    }}
  >
    <Box
      sx={{
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
        isolation: "isolate",
        '[data-static="true"] &': {
          position: "static",
          height: "auto",
          display: "grid",
          gap: "12vh",
          padding: "14vh 0",
        },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: THANKS_IN,
          background: `radial-gradient(58% 46% at 50% 48%, ${Palette.COMET_SOFT} 0%, transparent 72%)`,
        }}
      />
      <Box sx={phaseLayerSx(END_ROLL_FADE, "none")}>{endRoll}</Box>
      <Box sx={phaseLayerSx(`min(${THOUGHT_IN}, ${THOUGHT_OUT})`, `translateY(calc((1 - ${THOUGHT_IN}) * 22px))`)}>
        {thought}
      </Box>
      <Box sx={phaseLayerSx(THANKS_IN, `scale(calc(0.96 + ${THANKS_IN} * 0.04))`)}>{thanks}</Box>
    </Box>
  </Box>
);
