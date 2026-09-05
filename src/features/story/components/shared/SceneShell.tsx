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
}

/** Normal (non-sticky) scene frame: a text column plus an optional visual column; single column under 760px. */
export const SceneShell = ({ sectionRef, label, left, right, mirrored = false }: SceneShellProps) => (
  <Box
    component="section"
    ref={sectionRef}
    aria-label={label}
    sx={{
      position: "relative",
      padding: "18vh 7vw 22vh",
      display: "grid",
      gridTemplateColumns: right
        ? mirrored
          ? "minmax(300px, 44%) minmax(0, 1fr)"
          : "minmax(0, 1fr) minmax(300px, 44%)"
        : "minmax(0, 72ch)",
      gap: "6vw",
      alignItems: "start",
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
