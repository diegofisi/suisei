import { Stack, Typography } from "@mui/material";
import { PILLARS_HEADLINE, PILLARS_LEAD } from "@/features/story/helpers/pillarsContent";

/** Sends the class back to the guiding question of scene 2 before the three answers. */
export const PillarsIntro = () => (
  <Stack sx={{ gap: "0.7rem", maxWidth: "48ch" }}>
    <Typography variant="h3">{PILLARS_HEADLINE}</Typography>
    <Typography variant="body1" color="text.secondary">
      {PILLARS_LEAD}
    </Typography>
  </Stack>
);
