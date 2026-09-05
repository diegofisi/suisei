import { Stack, Typography } from "@mui/material";
import { TURN_CLOSING_PHASE, rampOf } from "@/features/story/helpers/turnContent";

interface TurnClosingProps {
  headline: string;
  /** Bridge into scene 6. */
  note: string;
}

const CLOSING_RAMP = rampOf(TURN_CLOSING_PHASE);

/** Lands last: she was already inside, but the launch had not happened yet. */
export const TurnClosing = ({ headline, note }: TurnClosingProps) => (
  <Stack
    sx={{
      "--c": CLOSING_RAMP,
      opacity: "var(--c)",
      transform: "translateY(calc((1 - var(--c)) * 14px))",
      gap: "0.7rem",
    }}
  >
    <Typography variant="h4" sx={{ color: "primary.main", maxWidth: "28ch" }}>
      {headline}
    </Typography>
    <Typography variant="caption" color="text.secondary" sx={{ maxWidth: "44ch" }}>
      {note}
    </Typography>
  </Stack>
);
