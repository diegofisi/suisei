import type { Ref } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { CrowdChorus } from "@/features/story/components/closing/CrowdChorus";
import { NARROW_MEDIA } from "@/features/story/helpers/layout";
import {
  CLOSING_END_ROLL,
  CLOSING_END_ROLL_CAPTION,
  } from "@/features/story/helpers/closingContent";

interface ClosingEndRollProps {
  chorusRef: Ref<HTMLDivElement>;
}

/** Phase A: the story of the end roll on the left, the audience singing on the right. */
export const ClosingEndRoll = ({ chorusRef }: ClosingEndRollProps) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
      gap: "5vw",
      alignItems: "center",
      width: "100%",
      [NARROW_MEDIA]: {
        gridTemplateColumns: "minmax(0, 1fr)",
        gap: "5vh",
      },
    }}
  >
    <Stack sx={{ gap: "1.1rem", maxWidth: "46ch" }}>
      <Typography variant="body1" color="text.secondary">
        {CLOSING_END_ROLL}
      </Typography>
      <Typography variant="body2" sx={{ color: "secondary.main", maxWidth: "38ch" }}>
        {CLOSING_END_ROLL_CAPTION}
      </Typography>
    </Stack>
    <CrowdChorus chorusRef={chorusRef} />
  </Box>
);
