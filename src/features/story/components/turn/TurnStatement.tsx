import { Box, Stack, Typography } from "@mui/material";
import { NARROW_MEDIA } from "@/features/story/helpers/layout";
import { TURN_NO_PHASE, TURN_YET_PHASE, rampOf } from "@/features/story/helpers/turnContent";

interface TurnStatementProps {
  /** The word the agencies gave her. */
  before: string;
  /** What it turned out to mean. */
  after: string;
  body: string;
}

const NO_RAMP = rampOf(TURN_NO_PHASE);
const YET_RAMP = rampOf(TURN_YET_PHASE);

/** «No» shrinks away while «Todavía no.» settles in its place: the color turn of the whole talk. */
export const TurnStatement = ({ before, after, body }: TurnStatementProps) => (
  <Stack sx={{ gap: "1.2rem" }}>
    <Box
      sx={{
        display: "grid",
        justifyItems: "start",
        alignItems: "center",
        "& > *": { gridArea: "1 / 1" },
      }}
    >
      <Typography
        variant="h2"
        sx={{
          "--out": NO_RAMP,
          color: "secondary.main",
          opacity: "calc(1 - var(--out))",
          transform: "scale(calc(1 - var(--out) * 0.3))",
          transformOrigin: "left center",
        }}
      >
        {before}
      </Typography>
      <Typography
        variant="h2"
        sx={{
          "--in": YET_RAMP,
          color: "primary.main",
          opacity: "var(--in)",
          transform: "scale(calc(0.88 + var(--in) * 0.12)) translateY(calc((1 - var(--in)) * 0.18em))",
          transformOrigin: "left center",
        }}
      >
        {after}
      </Typography>
    </Box>

    <Typography
      variant="body1"
      color="text.secondary"
      sx={{ maxWidth: "42ch", [NARROW_MEDIA]: { maxWidth: "100%" } }}
    >
      {body}
    </Typography>
  </Stack>
);
