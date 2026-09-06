import type { Ref } from "react";
import { Stack, Typography } from "@mui/material";
import {
  VIDEO_CUE,
  VIDEO_LYRIC_NOTE,
  VIDEO_THESIS,
} from "@/features/story/helpers/videoContent";

interface VideoNotesProps {
  notesRef: Ref<HTMLDivElement>;
}

/** Cue for the presenter plus the thesis line of the whole talk. Revealed once by the scene hook. */
export const VideoNotes = ({ notesRef }: VideoNotesProps) => (
  <Stack
    ref={notesRef}
    sx={{
      gap: "1rem",
      maxWidth: "40ch",
      opacity: 0,
      transform: "translateY(16px)",
      transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(.2,.8,.2,1)",
      '&[data-on="true"]': { opacity: 1, transform: "translateY(0)" },
    }}
  >
    <Typography variant="label" sx={{ color: "secondary.main" }}>
      {VIDEO_CUE}
    </Typography>
    <Typography variant="h4" sx={{ color: "secondary.main" }}>
      {VIDEO_THESIS}
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ fontSize: "clamp(1.1rem, 1.35vw, 1.4rem)" }}>
      {VIDEO_LYRIC_NOTE}
    </Typography>
  </Stack>
);
