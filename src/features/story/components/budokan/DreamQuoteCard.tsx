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
      gap: "0.9rem",
      maxWidth: "44ch",
      padding: "1.7rem 2rem",
      borderRadius: 2,
      border: `1px solid ${alpha(Palette.SAKURA, 0.5)}`,
      borderLeft: `3px solid ${Palette.SAKURA}`,
      background: `linear-gradient(150deg, ${alpha(Palette.SKY_2, 0.97)} 0%, ${alpha(Palette.SKY, 0.97)} 100%)`,
      backdropFilter: "blur(14px)",
      boxShadow: `0 24px 60px ${alpha(Palette.SKY_DEEP, 0.6)}`,
    }}
  >
    <Box component="blockquote" sx={{ margin: 0 }}>
      <Typography variant="h3" sx={{ color: "secondary.main" }}>
        {DREAM_QUOTE}
      </Typography>
    </Box>
    <Typography variant="body2" color="text.secondary">
      {DREAM_QUOTE_SOURCE}
    </Typography>
    <Typography variant="body1" sx={{ color: "secondary.main", fontWeight: 600 }}>
      {DREAM_QUOTE_TEARS}
    </Typography>
  </Stack>
);
