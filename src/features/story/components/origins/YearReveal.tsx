import type { Ref } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import { ORIGINS_YEAR } from "@/features/story/helpers/originsContent";

interface YearRevealProps {
  yearRef: Ref<HTMLDivElement>;
}

/** The giant "2018": an outlined copy with a filled COMET copy wiped over it by `--r` (0→1). */
export const YearReveal = ({ yearRef }: YearRevealProps) => (
  <Box
    ref={yearRef}
    sx={{
      "--r": 0,
      position: "relative",
      display: "inline-block",
      alignSelf: "flex-start",
      marginBottom: "0.4rem",
    }}
  >
    <Typography
      variant="display"
      aria-label={ORIGINS_YEAR}
      sx={{
        color: "transparent",
        WebkitTextStroke: `1px ${alpha(Palette.COMET, 0.55)}`,
      }}
    >
      {ORIGINS_YEAR}
    </Typography>
    <Typography
      variant="display"
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        color: "primary.main",
        textShadow: `0 0 38px ${Palette.COMET_SOFT}`,
        clipPath: "inset(0 calc(100% - var(--r) * 100%) 0 0)",
        pointerEvents: "none",
      }}
    >
      {ORIGINS_YEAR}
    </Typography>
  </Box>
);
