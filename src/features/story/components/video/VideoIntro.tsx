import { Stack, Typography } from "@mui/material";
import { VIDEO_INTRO, VIDEO_TITLE } from "@/features/story/helpers/videoContent";

/** What she told the room before the song, from the MC of that night. */
export const VideoIntro = () => (
  <Stack sx={{ gap: "1rem", maxWidth: "72ch" }}>
    <Typography variant="h3">{VIDEO_TITLE}</Typography>
    <Typography variant="label" sx={{ color: "secondary.main", lineHeight: 1.6 }}>
      {VIDEO_INTRO}
    </Typography>
  </Stack>
);
