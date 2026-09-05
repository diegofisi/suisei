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
      padding: "18vh 7vw 22vh",
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) minmax(300px, 44%)",
      gap: "6vw",
      alignItems: "start",
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
