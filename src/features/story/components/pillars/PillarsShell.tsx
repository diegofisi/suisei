import type { ReactNode, Ref } from "react";
import { Box, Stack } from "@mui/material";
import { Palette } from "@/common/models/palette";
import { NARROW_MEDIA } from "@/features/story/helpers/layout";
import { PILLARS_SECTION_LABEL } from "@/features/story/helpers/pillarsContent";

interface PillarsShellProps {
  sectionRef: Ref<HTMLElement>;
  intro: ReactNode;
  cards: ReactNode;
  bonus: ReactNode;
  quote: ReactNode;
}

/** Tall section + sticky stage; `--p` and `data-step` live on the section and are inherited. */
export const PillarsShell = ({ sectionRef, intro, cards, bonus, quote }: PillarsShellProps) => (
  <Box
    component="section"
    data-beats="0.47,0.69,0.9"
    ref={sectionRef}
    aria-label={PILLARS_SECTION_LABEL}
    data-step="0"
    sx={{
      position: "relative",
      height: "300vh",
      [NARROW_MEDIA]: { height: "auto" },
    }}
  >
    <Stack
      sx={{
        position: "sticky",
        top: 0,
        height: "100vh",
        justifyContent: "center",
        gap: "clamp(1rem, 2.4vh, 2.4rem)",
        padding: "0 7vw",
        overflow: "hidden",
        [NARROW_MEDIA]: {
          position: "static",
          height: "auto",
          padding: "14vh 7vw 18vh",
        },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: "calc(var(--p, 0) * 0.85)",
          background: `radial-gradient(58% 42% at 50% 46%, ${Palette.COMET_SOFT} 0%, transparent 72%)`,
        }}
      />
      <Stack sx={{ position: "relative", zIndex: 1, gap: "clamp(1rem, 2.4vh, 2.4rem)" }}>
        {intro}
        {cards}
        {bonus}
        {/* The shared PullQuote carries its own 4rem top margin; trimmed so the stage still fits 100vh. */}
        <Box sx={{ marginTop: "-2.6rem" }}>{quote}</Box>
      </Stack>
    </Stack>
  </Box>
);
