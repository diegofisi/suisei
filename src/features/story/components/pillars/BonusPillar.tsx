import { Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import { WIDE_MEDIA } from "@/features/story/helpers/layout";
import { PILLARS_BONUS } from "@/features/story/helpers/pillarsContent";

/** The fourth, smaller pillar: the audience holding her, so it reads in SAKURA. */
export const BonusPillar = () => (
  <Stack
    direction="row"
    spacing={2}
    sx={{
      alignItems: "baseline",
      flexWrap: "wrap",
      rowGap: "0.4rem",
      padding: "0.8rem 1.1rem",
      borderRadius: 2,
      border: "1px solid",
      borderColor: alpha(Palette.SAKURA, 0.34),
      backgroundColor: Palette.SAKURA_SOFT,
      [WIDE_MEDIA]: {
        opacity: 0,
        transform: "translateY(18px)",
        transition: "opacity 0.55s ease, transform 0.65s cubic-bezier(.2,.8,.2,1)",
        [`[data-step="${PILLARS_BONUS.step}"] &`]: {
          opacity: 1,
          transform: "translateY(0)",
        },
      },
    }}
  >
    <Typography variant="label" sx={{ color: "secondary.main", whiteSpace: "nowrap" }}>
      {PILLARS_BONUS.label}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {PILLARS_BONUS.body}
    </Typography>
  </Stack>
);
