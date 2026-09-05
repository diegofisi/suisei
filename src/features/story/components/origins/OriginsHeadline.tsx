import { Typography } from "@mui/material";
import { ORIGINS_HEADLINE } from "@/features/story/helpers/originsContent";

/** The lede under the year. */
export const OriginsHeadline = () => (
  <Typography variant="h3" sx={{ maxWidth: "20ch", marginBottom: "2.6rem" }}>
    {ORIGINS_HEADLINE}
  </Typography>
);
