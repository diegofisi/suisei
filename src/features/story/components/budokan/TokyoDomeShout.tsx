import { Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import { DOME_CAPTION, DOME_LEAD, DOME_SHOUT } from "@/features/story/helpers/budokanContent";

const STATIC = '[data-static="true"] &';

/** Step 3: the room answers. The shout slams in from scale 1.3 as --slam runs 0→1. */
export const TokyoDomeShout = () => (
  <Stack
    sx={{
      "--slam": "clamp(0, (var(--p, 0) - 0.78) / 0.08, 1)",
      alignItems: "center",
      textAlign: "center",
      gap: "1.2rem",
      [STATIC]: { "--slam": 1 },
    }}
  >
    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "52ch" }}>
      {DOME_LEAD}
    </Typography>
    <Typography
      variant="h1"
      sx={{
        color: "warning.main",
        opacity: "var(--slam, 0)",
        transform: "scale(calc(1.3 - 0.3 * var(--slam, 0)))",
        textShadow: `0 0 calc(24px + var(--slam, 0) * 46px) ${alpha(Palette.GOLD, 0.55)}`,
      }}
    >
      {DOME_SHOUT}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {DOME_CAPTION}
    </Typography>
  </Stack>
);
