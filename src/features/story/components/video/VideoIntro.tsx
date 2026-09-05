import { Stack, Typography } from "@mui/material";
import { VIDEO_INTRO, VIDEO_LABEL, VIDEO_TITLE } from "@/features/story/helpers/videoContent";

/** What she told the room before the song, from the MC of that night. */
export const VideoIntro = () => (
  <Stack sx={{ gap: "1rem", maxWidth: "72ch" }}>
    <Typography variant="label" color="primary.main">
      {VIDEO_LABEL}
    </Typography>
    <Typography variant="h3">{VIDEO_TITLE}</Typography>
    <Typography variant="body1" color="text.secondary">
      {VIDEO_INTRO}
    </Typography>
  </Stack>
);
