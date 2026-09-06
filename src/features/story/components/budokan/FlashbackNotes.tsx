import { Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import { DreamQuoteCard } from "@/features/story/components/budokan/DreamQuoteCard";
import { COMET_NOTE } from "@/features/story/helpers/budokanContent";
import { NARROW_MEDIA } from "@/features/story/helpers/layout";

/** The M13 note trails the quote card by a few percent of scroll, when the gold frame lights up again. */
const NOTE_OPACITY = "clamp(0, (var(--p, 0) - 0.66) / 0.05, 1)";
const STATIC = '[data-static="true"] &';

/** Tail of step 2: the 2018 note over the leftmost frame, the "comet" note over the gold one. */
export const FlashbackNotes = () => (
  <Stack
    direction="row"
    sx={{
      justifyContent: "space-between",
      alignItems: "flex-end",
      gap: "4vw",
      [NARROW_MEDIA]: { flexDirection: "column", alignItems: "flex-start", gap: "2.4rem" },
    }}
  >
    <DreamQuoteCard />
    <Stack
      sx={{
        maxWidth: "38ch",
        padding: "1.3rem 1.6rem",
        borderRadius: 2,
        border: `1px solid ${alpha(Palette.GOLD, 0.45)}`,
        borderLeft: `3px solid ${Palette.GOLD}`,
        background: alpha(Palette.SKY, 0.95),
        backdropFilter: "blur(14px)",
        boxShadow: `0 24px 60px ${alpha(Palette.SKY_DEEP, 0.6)}`,
        opacity: NOTE_OPACITY,
        [STATIC]: { opacity: 1 },
      }}
    >
      <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 600 }}>
        {COMET_NOTE}
      </Typography>
      <Typography variant="body2" sx={{ color: alpha(Palette.GOLD, 0.9), marginTop: "0.5rem" }}>
        M13 · setlist SuperNova
      </Typography>
    </Stack>
  </Stack>
);
