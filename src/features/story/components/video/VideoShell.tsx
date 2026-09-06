import type { ReactNode, Ref } from "react";
import { Box, Stack } from "@mui/material";
import { NARROW_MEDIA } from "@/features/story/helpers/layout";

interface VideoShellProps {
  sectionRef: Ref<HTMLElement>;
  intro: ReactNode;
  player: ReactNode;
  notes: ReactNode;
  quote: ReactNode;
}

/**
 * Scene 9 frame: title on top, then the player beside its notes, so the cue and the thesis line are on screen
 * together with the video at any size (the player is capped by height, never taller than ~58% of the screen).
 */
export const VideoShell = ({ sectionRef, intro, player, notes, quote }: VideoShellProps) => (
  <Box
    component="section"
    ref={sectionRef}
    aria-label="Video: Orbital Period"
    sx={{
      position: "relative",
      minHeight: "100vh",
      padding: "clamp(56px, 10vh, 130px) 7vw clamp(48px, 8vh, 110px)",
      display: "grid",
      alignContent: "center",
      ["@media (max-height: 900px)"]: { paddingTop: "40px", paddingBottom: "32px" },
    }}
  >
    <Stack sx={{ width: "100%", minWidth: 0, gap: "2rem" }}>
      {intro}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 34%)",
          gap: "3vw",
          alignItems: "center",
          [NARROW_MEDIA]: { gridTemplateColumns: "minmax(0, 1fr)", gap: "1.6rem" },
        }}
      >
        <Box sx={{ minWidth: 0, width: "min(100%, calc(58vh * 16 / 9))" }}>{player}</Box>
        <Box sx={{ minWidth: 0 }}>{notes}</Box>
      </Box>
      {quote}
    </Stack>
  </Box>
);
