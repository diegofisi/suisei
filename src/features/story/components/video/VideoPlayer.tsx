import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import { VIDEO_EMBED_SRC, VIDEO_EMBED_TITLE } from "@/features/story/helpers/videoContent";

/** The official upload, embedded and cued to the verse; played by hand in class, never on autoplay. */
export const VideoPlayer = () => (
  <Box
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
      component="iframe"
      src={VIDEO_EMBED_SRC}
      title={VIDEO_EMBED_TITLE}
      allow="fullscreen; picture-in-picture"
      allowFullScreen
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      sx={{ display: "block", width: "100%", height: "100%", border: 0 }}
    />
  </Box>
);
