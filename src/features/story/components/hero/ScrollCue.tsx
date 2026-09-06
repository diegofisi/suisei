import { Box, Stack, Typography } from "@mui/material";
import { Palette } from "@/common/models/palette";

export interface ScrollCueProps {
  label: string;
}

/** The cue is also the first "next" button: the presenter navigation listens for `data-presenter-next` clicks. */
export const ScrollCue = ({ label }: ScrollCueProps) => (
  <Stack
    alignItems="center"
    role="button"
    tabIndex={0}
    aria-label="Siguiente"
    data-presenter-next
    sx={{
      gap: 1.4,
      cursor: "pointer",
      pointerEvents: "auto",
      paddingX: 3,
      paddingY: 1,
      outline: "none",
      "&:focus-visible": { boxShadow: `0 0 0 1px ${Palette.COMET}` },
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
