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
      // Content-sized columns pulled to the centre, so text and word stay close on wide screens too.
      gridTemplateColumns: "minmax(0, 32ch) auto",
      justifyContent: "center",
      gap: "clamp(2.5rem, 5vw, 6rem)",
      alignItems: "center",
      width: "100%",
      [NARROW_MEDIA]: {
        gridTemplateColumns: "minmax(0, 1fr)",
        gap: "5vh",
      },
    }}
  >
    <Stack sx={{ gap: "1.4rem", maxWidth: "30ch", justifySelf: "end" }}>
      <Typography variant="h3" component="p" sx={{ color: "text.primary", fontWeight: 600 }}>
        {CLOSING_END_ROLL}
      </Typography>
      <Typography variant="h4" component="p" sx={{ color: "secondary.main" }}>
        {CLOSING_END_ROLL_CAPTION}
      </Typography>
    </Stack>
    <CrowdChorus chorusRef={chorusRef} />
  </Box>
);
