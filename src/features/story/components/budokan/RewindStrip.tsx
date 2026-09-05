import type { Ref, RefObject } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import { RewindFrame } from "@/features/story/components/budokan/RewindFrame";
import { BUDOKAN_CREDIT, REWIND_LABEL } from "@/features/story/helpers/budokanContent";
import { NARROW_MEDIA } from "@/features/story/helpers/layout";
import type { TimelinePointViewModel } from "@/features/story/interfaces/StoryViewModels";

interface RewindStripProps {
  frames: TimelinePointViewModel[];
  /** Holds --rw (0→1): the playhead running backwards. */
  stripRef: Ref<HTMLDivElement>;
  frameRefs: RefObject<(HTMLDivElement | null)[]>;
}

/** Visible only while the tape is actually rewinding. */
const HEAD_OPACITY = "calc(clamp(0, var(--rw, 0) / 0.04, 1) * clamp(0, (1 - var(--rw, 0)) / 0.06, 1))";
const HEAD_LEFT = "calc((1 - var(--rw, 0)) * 100%)";
const STATIC = '[data-static="true"] &';

/** The interlude video as a strip: seven outfits, a gold playhead that runs 2025 → 2018 and greys out what it passes. */
export const RewindStrip = ({ frames, stripRef, frameRefs }: RewindStripProps) => (
  <Box
    ref={stripRef}
    sx={{
      position: "relative",
      zIndex: 1,
      opacity: "clamp(0, (var(--p, 0) - 0.34) / 0.06, 1)",
      transition: "opacity 0.3s ease",
      '[data-step="3"] &': { opacity: 0.5 },
      '[data-step="4"] &': { opacity: 0.5 },
      [STATIC]: { opacity: 1 },
    }}
  >
    <Box sx={{ overflowX: "auto", overflowY: "hidden", paddingBottom: 1 }}>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          gap: 2,
          width: "fit-content",
          margin: "0 auto",
          paddingTop: "3rem",
          paddingX: 2,
          [NARROW_MEDIA]: { gap: 1.5 },
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: "2.8rem",
            bottom: "1.4rem",
            left: HEAD_LEFT,
            width: 2,
            transform: "translateX(-50%)",
            backgroundColor: Palette.GOLD,
            boxShadow: `0 0 16px 2px ${alpha(Palette.GOLD, 0.6)}`,
            opacity: HEAD_OPACITY,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: HEAD_LEFT,
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            opacity: HEAD_OPACITY,
          }}
        >
          <Typography
            variant="label"
            sx={{
              color: "warning.main",
              "@keyframes rewindBlink": { "0%, 100%": { opacity: 1 }, "50%": { opacity: 0.35 } },
              animation: "rewindBlink 0.7s steps(1, end) infinite",
            }}
          >
            {REWIND_LABEL}
          </Typography>
        </Box>
        {frames.map((frame, index) => (
          <RewindFrame
            key={frame.year}
            frame={frame}
            rootRef={(node) => {
              frameRefs.current[index] = node;
            }}
          />
        ))}
      </Box>
    </Box>
    <Stack sx={{ alignItems: "center", marginTop: 1 }}>
      <Typography variant="caption" color="text.disabled" sx={{ textAlign: "center" }}>
        {BUDOKAN_CREDIT}
      </Typography>
    </Stack>
  </Box>
);
