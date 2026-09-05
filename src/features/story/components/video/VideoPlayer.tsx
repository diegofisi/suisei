import type { Ref } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import {
  VIDEO_MISSING_HINT,
  VIDEO_MISSING_MESSAGE,
  VIDEO_SRC,
} from "@/features/story/helpers/videoContent";

interface VideoPlayerProps {
  /** Root; the scene hook flips `data-missing` on it when the file is not in `public/video/`. */
  playerRef: Ref<HTMLDivElement>;
  videoRef: Ref<HTMLVideoElement>;
}

const MISSING = '[data-missing="true"] &';

/** The 60–90 s cut, played by hand: controls visible, no autoplay, and a clear notice if the mp4 is not there. */
export const VideoPlayer = ({ playerRef, videoRef }: VideoPlayerProps) => (
  <Box
    ref={playerRef}
    data-missing="false"
    sx={{
      position: "relative",
      width: "100%",
      aspectRatio: "16 / 9",
      borderRadius: 2,
      overflow: "hidden",
      border: `1px solid ${Palette.ICE_LINE}`,
      boxShadow: `0 40px 90px ${alpha(Palette.SKY_DEEP, 0.72)}`,
      backgroundColor: Palette.SKY_DEEP,
    }}
  >
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 2,
        background: `linear-gradient(90deg, ${Palette.GOLD} 0%, ${Palette.COMET} 100%)`,
      }}
    />
    <Box
      component="video"
      ref={videoRef}
      src={VIDEO_SRC}
      controls
      preload="metadata"
      playsInline
      sx={{
        display: "block",
        width: "100%",
        height: "100%",
        backgroundColor: Palette.SKY_DEEP,
        // Without the file, Chrome paints its own grey error box: hide it and let the notice show instead.
        [MISSING]: { visibility: "hidden" },
      }}
    />
    <Stack
      sx={{
        position: "absolute",
        inset: 0,
        display: "none",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: "0.6rem",
        padding: "2rem",
        pointerEvents: "none",
        [MISSING]: { display: "flex" },
      }}
    >
      <Typography variant="body2" sx={{ color: "secondary.main", fontWeight: 600 }}>
        {VIDEO_MISSING_MESSAGE}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {VIDEO_MISSING_HINT}
      </Typography>
    </Stack>
  </Box>
);
