import type { ReactNode, Ref } from "react";
import { Box, Stack } from "@mui/material";
import { NARROW_MEDIA } from "@/features/story/helpers/layout";

interface OriginsShellProps {
  sectionRef: Ref<HTMLElement>;
  left: ReactNode;
  right: ReactNode;
}

/** Scene 3 frame: a normal (non-sticky) section with a text column and a clip column. */
export const OriginsShell = ({ sectionRef, left, right }: OriginsShellProps) => (
  <Box
    component="section"
    ref={sectionRef}
    aria-label="Los inicios, 2018"
    sx={{
      position: "relative",
      padding: "clamp(56px, 10vh, 130px) 7vw clamp(48px, 8vh, 110px)",
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) minmax(300px, 44%)",
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
    <Stack sx={{ minWidth: 0 }}>{left}</Stack>
    <Box sx={{ minWidth: 0 }}>{right}</Box>
  </Box>
);
