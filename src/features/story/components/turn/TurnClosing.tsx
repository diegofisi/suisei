import { Stack, Typography } from "@mui/material";
import { NARROW_MEDIA } from "@/features/story/helpers/layout";
import { TURN_CLOSING_PHASE, TURN_CLOSING_PHASE_NARROW, rampOf } from "@/features/story/helpers/turnContent";

interface TurnClosingProps {
  headline: string;
  /** Bridge into scene 6. */
  note: string;
}

const CLOSING_RAMP = rampOf(TURN_CLOSING_PHASE);
const CLOSING_RAMP_NARROW = rampOf(TURN_CLOSING_PHASE_NARROW);

/** Lands last: she was already inside, but the launch had not happened yet. */
export const TurnClosing = ({ headline, note }: TurnClosingProps) => (
  <Stack
    sx={{
      "--c": CLOSING_RAMP,
      [NARROW_MEDIA]: { "--c": CLOSING_RAMP_NARROW },
      opacity: "var(--c)",
      transform: "translateY(calc((1 - var(--c)) * 14px))",
      gap: "0.7rem",
    }}
  >
    <Typography variant="h4" sx={{ color: "primary.main", maxWidth: "28ch" }}>
      {headline}
    </Typography>
    {note && (
      <Typography variant="caption" color="text.secondary" sx={{ maxWidth: "44ch" }}>
        {note}
      </Typography>
    )}
  </Stack>
);
