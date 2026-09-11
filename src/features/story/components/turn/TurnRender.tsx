import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import { NARROW_MEDIA } from "@/features/story/helpers/layout";
import { TURN_RENDER_PHASE, TURN_RENDER_PHASE_NARROW, rampOf } from "@/features/story/helpers/turnContent";

interface TurnRenderProps {
  src: string;
  alt: string;
  /** Small label pinned over the render. */
  tag: string;
  credit: string;
}

const RENDER_RAMP = rampOf(TURN_RENDER_PHASE);
const RENDER_RAMP_NARROW = rampOf(TURN_RENDER_PHASE_NARROW);

/** The new hololive model slides in from the right as the scene turns blue. */
export const TurnRender = ({ src, alt, tag, credit }: TurnRenderProps) => (
  <Stack
    sx={{
      "--k": RENDER_RAMP,
      [NARROW_MEDIA]: { "--k": RENDER_RAMP_NARROW },
      opacity: "var(--k)",
      transform: "translateX(calc((1 - var(--k)) * 12vw))",
      alignItems: "center",
      gap: "0.9rem",
    }}
  >
    <Box sx={{ position: "relative", width: "100%" }}>
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: "-6% -10%",
          background: `radial-gradient(circle at 50% 54%, ${Palette.COMET_SOFT} 0%, transparent 66%)`,
          pointerEvents: "none",
        }}
      />
      <Box
        component="img"
        src={src}
        alt={alt}
        loading="lazy"
        sx={{
          position: "relative",
          display: "block",
          width: "100%",
          height: "70vh",
          objectFit: "contain",
          objectPosition: "center",
          [NARROW_MEDIA]: { height: "30vh" },
        }}
      />
      <Typography
        variant="label"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          color: "primary.main",
          backgroundColor: alpha(Palette.SKY, 0.55),
          padding: "0.45rem 0.6rem",
          borderRadius: 1,
        }}
      >
        {tag}
      </Typography>
    </Box>
    <Typography variant="caption" color="text.disabled" sx={{ textAlign: "center", maxWidth: "36ch" }}>
      {credit}
    </Typography>
  </Stack>
);
