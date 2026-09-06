import type { Ref } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import { CHORUS_WORD, crowdDots } from "@/features/story/helpers/closingContent";

interface CrowdChorusProps {
  /** Holds `data-singing`; the crowd only sways while the chorus is being sung. */
  chorusRef: Ref<HTMLDivElement>;
}

const WORD_SIZE = "clamp(56px, 8.6vw, 168px)";

/** The word "comet" sung by the audience: an outline that fills left to right with `--sing`. */
export const CrowdChorus = ({ chorusRef }: CrowdChorusProps) => (
  <Stack ref={chorusRef} data-singing="false" sx={{ alignItems: "center", gap: "1.8rem" }}>
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <Typography
        variant="display"
        aria-label={CHORUS_WORD}
        sx={{ color: "transparent", WebkitTextStroke: `1px ${Palette.ICE_LINE}`, fontSize: WORD_SIZE }}
      >
        {CHORUS_WORD}
      </Typography>
      <Typography
        variant="display"
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          color: "text.primary",
          fontSize: WORD_SIZE,
          clipPath: "inset(0 calc(100% - var(--sing, 0) * 100%) 0 0)",
          pointerEvents: "none",
        }}
      >
        {CHORUS_WORD}
      </Typography>
    </Box>

    <Box
      aria-hidden
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(20, 1fr)",
        gap: "0.55rem",
        width: "min(100%, 420px)",
        opacity: "calc(0.28 + var(--sing, 0) * 0.72)",
        "@keyframes closingCrowdSway": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        '[data-singing="true"] & > span': {
          animationName: "closingCrowdSway",
          animationDuration: "2.4s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
        },
      }}
    >
      {crowdDots.map((dot) => (
        <Box
          key={dot.id}
          component="span"
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: alpha(Palette.ICE, 0.34),
            animationDelay: dot.delay,
          }}
        />
      ))}
    </Box>
  </Stack>
);
