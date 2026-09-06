import { Stack, Typography } from "@mui/material";
import { TODAY_HEADLINE } from "@/features/story/helpers/todayContent";

/** Eyebrow + lede under the 2026 year. */
export const TodayHeadline = () => (
  <Stack sx={{ gap: "0.9rem", marginBottom: "2.6rem" }}>
    <Typography variant="h3" sx={{ maxWidth: "20ch" }}>
      {TODAY_HEADLINE}
    </Typography>
  </Stack>
);
