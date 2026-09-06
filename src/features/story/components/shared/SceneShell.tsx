import type { ReactNode, Ref } from "react";
import { Box, Stack } from "@mui/material";
import { NARROW_MEDIA } from "@/features/story/helpers/layout";

interface SceneShellProps {
  sectionRef: Ref<HTMLElement>;
  /** Accessible name of the section, in Spanish. */
  label: string;
  left: ReactNode;
  /** Optional second column (clips, cards); without it the text column takes the full width, capped at 72ch. */
  right?: ReactNode;
  /** Swap the columns so the visual sits on the left. */
  mirrored?: boolean;
  /** Presenter "next" presses that reveal something in place (no scroll) before leaving the scene. */
  revealSteps?: number;
}

/** Normal (non-sticky) scene frame: a text column plus an optional visual column; single column under 760px. */
export const SceneShell = ({ sectionRef, label, left, right, mirrored = false, revealSteps }: SceneShellProps) => (
  <Box
    component="section"
    ref={sectionRef}
    aria-label={label}
    data-reveal-steps={revealSteps}
    data-presenter-step="0"
    sx={{
      position: "relative",
      padding: "clamp(56px, 10vh, 130px) 7vw clamp(48px, 8vh, 110px)",
      display: "grid",
      gridTemplateColumns: right
        ? mirrored
          ? "minmax(300px, 44%) minmax(0, 1fr)"
          : "minmax(0, 1fr) minmax(300px, 44%)"
        : "minmax(0, 72ch)",
      gap: "6vw",
      alignItems: "start",
      ["@media (max-height: 900px)"]: { paddingTop: "48px", paddingBottom: "40px" },
      ["@media (max-height: 780px)"]: { paddingTop: "36px", paddingBottom: "32px" },
      [NARROW_MEDIA]: {
        gridTemplateColumns: "minmax(0, 1fr)",
        gap: "8vh",
      },
    }}
  >
    {right && mirrored && <Box sx={{ minWidth: 0, [NARROW_MEDIA]: { order: 2 } }}>{right}</Box>}
    <Stack sx={{ minWidth: 0 }}>{left}</Stack>
    {right && !mirrored && <Box sx={{ minWidth: 0 }}>{right}</Box>}
  </Box>
);
