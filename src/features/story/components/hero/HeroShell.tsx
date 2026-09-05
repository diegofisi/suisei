import type { ReactNode, Ref } from "react";
import { Box } from "@mui/material";

export interface HeroShellProps {
  sectionRef: Ref<HTMLElement>;
  titles: ReactNode;
  canvas: ReactNode;
  cue: ReactNode;
  caption: ReactNode;
}

/** Fades out over the first 30% of the scroll. */
const EXIT_FADE = "clamp(0, calc(1 - var(--p, 0) / 0.3), 1)";
const EXIT_RISE = "translateY(calc(clamp(0, var(--p, 0) / 0.3, 1) * -34px))";
/** Fades in over the last 15%. */
const CAPTION_FADE = "clamp(0, calc((var(--p, 0) - 0.85) / 0.12), 1)";
const CAPTION_RISE = "translateY(calc((1 - clamp(0, (var(--p, 0) - 0.85) / 0.12, 1)) * 16px))";

export const HeroShell = ({ sectionRef, titles, canvas, cue, caption }: HeroShellProps) => (
  <Box component="section" ref={sectionRef} sx={{ position: "relative", height: "260vh" }}>
    <Box
      sx={{
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>{canvas}</Box>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          opacity: EXIT_FADE,
          transform: EXIT_RISE,
        }}
      >
        {titles}
      </Box>

      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "3vh",
          zIndex: 2,
          pointerEvents: "none",
          opacity: EXIT_FADE,
          transform: EXIT_RISE,
        }}
      >
        {cue}
      </Box>

      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: { xs: "4vh", md: "7vh" },
          zIndex: 2,
          pointerEvents: "none",
          opacity: CAPTION_FADE,
          transform: CAPTION_RISE,
        }}
      >
        {caption}
      </Box>
    </Box>
  </Box>
);
