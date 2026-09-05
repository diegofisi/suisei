import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import { NARROW_MEDIA } from "@/features/story/helpers/layout";
import type { TimelinePointViewModel } from "@/features/story/interfaces/StoryViewModels";

interface RewindFrameProps {
  frame: TimelinePointViewModel;
  rootRef: (node: HTMLDivElement | null) => void;
}

/** The strip has to fit seven tall frames on a projector as well as on a laptop. */
const MID_MEDIA = "@media (max-width: 1200px)";
const FRAME = { width: 150, height: 230 };
const FRAME_MID = { width: 118, height: 182 };
const FRAME_NARROW = { width: 96, height: 148 };

const FOCUSED = '[data-focus="true"] &';
const PULSING = '[data-pulse="true"] &';

/** One outfit of the interlude video. Greys out when the playhead has run past it; 2018 and the final "comet" stay lit. */
export const RewindFrame = ({ frame, rootRef }: RewindFrameProps) => (
  <Stack
    ref={rootRef}
    data-lit="true"
    data-focus="false"
    data-pulse="false"
    sx={{
      flex: "0 0 auto",
      alignItems: "center",
      gap: "0.5rem",
      transformOrigin: "50% 100%",
      transition: "filter 0.45s ease, transform 0.5s cubic-bezier(.2,.8,.2,1)",
      '&[data-lit="false"]': { filter: "grayscale(1) brightness(0.5)" },
      '&[data-focus="true"]': { transform: "scale(1.08)" },
    }}
  >
    <Box
      sx={{
        width: FRAME.width,
        height: FRAME.height,
        padding: "8px 4px 0",
        borderRadius: 2,
        overflow: "hidden",
        border: `1px solid ${Palette.ICE_LINE}`,
        background: `linear-gradient(180deg, ${alpha(Palette.SKY_2, 0.9)} 0%, ${alpha(Palette.SKY, 0.9)} 100%)`,
        transition: "border-color 0.4s ease, box-shadow 0.5s ease",
        "@keyframes goldPulse": {
          "0%, 100%": { boxShadow: `0 0 18px ${alpha(Palette.GOLD, 0.28)}` },
          "50%": { boxShadow: `0 0 40px ${alpha(Palette.GOLD, 0.62)}` },
        },
        [FOCUSED]: {
          borderColor: Palette.SAKURA,
          boxShadow: `0 0 30px ${Palette.SAKURA_SOFT}`,
        },
        [PULSING]: {
          borderColor: Palette.GOLD,
          animation: "goldPulse 2.2s ease-in-out infinite",
        },
        [MID_MEDIA]: { width: FRAME_MID.width, height: FRAME_MID.height },
        [NARROW_MEDIA]: { width: FRAME_NARROW.width, height: FRAME_NARROW.height },
      }}
    >
      <Box
        component="img"
        src={frame.image}
        alt={`Suisei — ${frame.label} (${frame.year})`}
        loading="lazy"
        sx={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }}
      />
    </Box>
    <Typography
      variant="label"
      sx={{
        color: "text.disabled",
        transition: "color 0.4s ease",
        [FOCUSED]: { color: Palette.SAKURA },
        [PULSING]: { color: Palette.GOLD },
      }}
    >
      {frame.year}
    </Typography>
  </Stack>
);
