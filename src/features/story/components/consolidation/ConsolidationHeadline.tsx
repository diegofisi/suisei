import { Stack, Typography } from "@mui/material";
import { CONSOLIDATION_HEADLINE } from "@/features/story/helpers/consolidationContent";

/** Eyebrow + title of scene 7. */
export const ConsolidationHeadline = () => (
  <Stack spacing={1.4} sx={{ marginBottom: "2.6rem" }}>
    <Typography variant="h3" sx={{ maxWidth: "18ch" }}>
      {CONSOLIDATION_HEADLINE}
    </Typography>
  </Stack>
);
