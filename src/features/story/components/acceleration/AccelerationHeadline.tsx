import { Stack, Typography } from "@mui/material";
import { ACCELERATION_HEADLINE } from "@/features/story/helpers/accelerationContent";

/** Eyebrow + title of scene 6. */
export const AccelerationHeadline = () => (
  <Stack spacing={1.4}>
    <Typography variant="h3" sx={{ maxWidth: "18ch" }}>
      {ACCELERATION_HEADLINE}
    </Typography>
  </Stack>
);
