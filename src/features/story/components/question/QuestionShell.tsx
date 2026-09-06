import type { ReactNode, Ref } from "react";
import { Box } from "@mui/material";
import { Palette } from "@/common/models/palette";

interface QuestionShellProps {
  sectionRef: Ref<HTMLElement>;
  question: ReactNode;
  timeline: ReactNode;
}

/** Tall section + sticky stage. The scene progress (--p) is written on the section and inherited by everything inside. */
export const QuestionShell = ({ sectionRef, question, timeline }: QuestionShellProps) => (
  <Box component="section"
    data-beats="" ref={sectionRef} sx={{ position: "relative", height: "300vh" }}>
    <Box
      sx={{
        position: "sticky",
        top: 0,
        height: "100vh",
        display: "grid",
        placeItems: "center",
        px: "8vw",
        overflow: "hidden",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: "calc(var(--p, 0) * 0.9)",
          background: `radial-gradient(60% 45% at 50% 42%, ${Palette.COMET_SOFT} 0%, transparent 70%)`,
        }}
      />
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          // Once the timeline fades in (p 0.55-0.66) the question slides up and shrinks to make room for the renders.
          "--lift": "clamp(0, (var(--p, 0) - 0.55) / 0.11, 1)",
          transform: "translateY(calc(var(--lift) * -20vh)) scale(calc(1 - var(--lift) * 0.26))",
          transformOrigin: "50% 50%",
        }}
      >
        {question}
      </Box>
      {timeline}
    </Box>
  </Box>
);
