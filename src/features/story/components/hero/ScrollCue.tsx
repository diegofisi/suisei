import { Box, Stack, Typography } from "@mui/material";
import { Palette } from "@/common/models/palette";

export interface ScrollCueProps {
  label: string;
}

export const ScrollCue = ({ label }: ScrollCueProps) => (
  <Stack
    alignItems="center"
    sx={{
      gap: 1.4,
      "@keyframes heroCueIn": {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      animation: "heroCueIn 900ms ease 1100ms both",
    }}
  >
    <Typography variant="label" color="text.secondary">
      {label}
    </Typography>
    <Box
      sx={{
        width: "1px",
        height: "38px",
        backgroundImage: `linear-gradient(to bottom, ${Palette.COMET}, transparent)`,
        transformOrigin: "top center",
        "@keyframes heroCuePulse": {
          "0%": { transform: "scaleY(0.35)", opacity: 0.25 },
          "45%": { transform: "scaleY(1)", opacity: 1 },
          "100%": { transform: "scaleY(0.35)", opacity: 0.25 },
        },
        animation: "heroCuePulse 2200ms ease-in-out infinite",
      }}
    />
  </Stack>
);
