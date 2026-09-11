import { Stack, Typography } from "@mui/material";
import { NARROW_MEDIA } from "@/features/story/helpers/layout";
import {
  CLOSING_ECHO,
  CLOSING_JP,
  CLOSING_QUESTIONS,
  CLOSING_SIGNATURE,
  CLOSING_THANKS,
} from "@/features/story/helpers/closingContent";

/** Phase C: the thanks, the questions prompt and the guiding question echoed back. */
export const ClosingThanks = () => (
  <Stack sx={{ alignItems: "center", textAlign: "center", gap: "1.1rem", width: "100%" }}>
    <Typography variant="h2">{CLOSING_THANKS}</Typography>
    <Typography variant="h1" sx={{ color: "primary.main", [NARROW_MEDIA]: { fontSize: "clamp(32px, 10vw, 64px)" } }}>
      {CLOSING_QUESTIONS}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "44ch" }}>
      {CLOSING_ECHO}
    </Typography>
    <Typography variant="jp" sx={{ color: "primary.main", marginTop: "1.4rem" }}>
      {CLOSING_JP}
    </Typography>
    <Typography variant="label" color="text.disabled" sx={{ lineHeight: 1.6 }}>
      {CLOSING_SIGNATURE}
    </Typography>
  </Stack>
);
