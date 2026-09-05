import { Stack, Typography } from "@mui/material";
import {
  CLOSING_ECHO,
  CLOSING_JP,
  CLOSING_QUESTIONS,
  CLOSING_SIGNATURE,
  CLOSING_THANKS,
} from "@/features/story/helpers/closingContent";

/** Phase C: the thanks, the questions prompt and the guiding question echoed back. */
export const ClosingThanks = () => (
  <Stack sx={{ alignItems: "center", textAlign: "center", gap: "1.1rem" }}>
    <Typography variant="h2">{CLOSING_THANKS}</Typography>
    <Typography variant="h1" sx={{ color: "primary.main" }}>
      {CLOSING_QUESTIONS}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "44ch" }}>
      {CLOSING_ECHO}
    </Typography>
    <Typography variant="jp" sx={{ color: "primary.main", marginTop: "1.4rem" }}>
      {CLOSING_JP}
    </Typography>
    <Typography variant="label" color="text.disabled">
      {CLOSING_SIGNATURE}
    </Typography>
  </Stack>
);
