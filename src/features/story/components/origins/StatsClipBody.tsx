import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import { ORIGINS_SUBSCRIBER_TARGET, formatSubscribers } from "@/features/story/helpers/originsContent";

/** A year of uploads, plotted. The joke is how flat it stays. */
const SPARKLINE_POINTS =
  "0,34 20,33.7 40,34.1 60,33.3 80,33.9 100,33.1 120,33.5 140,32.7 160,32.9 180,31.9 200,30.4";

/** The image-less clip: the number itself, plus a sparkline that barely moves. */
export const StatsClipBody = () => (
  <Stack
    sx={{
      flex: 1,
      justifyContent: "center",
      gap: "0.6rem",
      padding: "1.4rem 1.4rem 0.4rem",
    }}
  >
    <Typography variant="label" color="text.disabled">
      Suscriptores
    </Typography>
    <Typography
      variant="h2"
      sx={{
        color: "secondary.main",
        fontSize: "clamp(38px, 4.4vw, 62px)",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {formatSubscribers(ORIGINS_SUBSCRIBER_TARGET)}
    </Typography>
    <Box
      component="svg"
      viewBox="0 0 200 40"
      preserveAspectRatio="none"
      aria-hidden
      sx={{ width: "100%", height: 42, overflow: "visible" }}
    >
      <Box
        component="polyline"
        points={SPARKLINE_POINTS}
        sx={{
          fill: "none",
          stroke: alpha(Palette.COMET, 0.45),
          strokeWidth: 1.4,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
      />
    </Box>
  </Stack>
);
