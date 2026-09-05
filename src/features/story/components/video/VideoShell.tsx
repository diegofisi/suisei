import type { ReactNode, Ref } from "react";
import { Box, Stack } from "@mui/material";

interface VideoShellProps {
  sectionRef: Ref<HTMLElement>;
  intro: ReactNode;
  player: ReactNode;
  notes: ReactNode;
  quote: ReactNode;
}

/**
 * Scene 9 frame. Like `SceneShell` but single-column and wide: the shared shell caps its only column at 72ch,
 * and the player has to reach 1100px, so the text keeps a reading width while the video spans the column.
 */
export const VideoShell = ({ sectionRef, intro, player, notes, quote }: VideoShellProps) => (
  <Box
    component="section"
    ref={sectionRef}
    aria-label="Video: Orbital Period"
    sx={{ position: "relative", padding: "18vh 7vw 22vh", display: "grid", placeItems: "center" }}
  >
    <Stack sx={{ width: "min(100%, 1100px)", minWidth: 0, gap: "3.2rem" }}>
      {intro}
      {player}
      {notes}
      {quote}
    </Stack>
  </Box>
);
