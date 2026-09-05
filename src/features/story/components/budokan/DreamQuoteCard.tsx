import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import {
  DREAM_QUOTE,
  DREAM_QUOTE_SOURCE,
  DREAM_QUOTE_TEARS,
} from "@/features/story/helpers/budokanContent";

/** The 2018 line the interlude rewinds to, framed like a note from that year: sakura border, nothing gold. */
export const DreamQuoteCard = () => (
  <Stack
    sx={{
      gap: "0.8rem",
      maxWidth: "40ch",
      padding: "1.3rem 1.5rem",
      borderRadius: 2,
      border: `1px solid ${alpha(Palette.SAKURA, 0.5)}`,
      borderLeft: `3px solid ${Palette.SAKURA}`,
      background: `linear-gradient(150deg, ${alpha(Palette.SKY_2, 0.92)} 0%, ${alpha(Palette.SKY, 0.92)} 100%)`,
      boxShadow: `0 24px 60px ${alpha(Palette.SKY_DEEP, 0.6)}`,
    }}
  >
    <Box component="blockquote" sx={{ margin: 0 }}>
      <Typography variant="h4" sx={{ color: "secondary.main" }}>
        {DREAM_QUOTE}
      </Typography>
    </Box>
    <Typography variant="caption" color="text.secondary">
      {DREAM_QUOTE_SOURCE}
    </Typography>
    <Typography variant="body2" sx={{ color: "secondary.main", fontWeight: 600 }}>
      {DREAM_QUOTE_TEARS}
    </Typography>
  </Stack>
);
