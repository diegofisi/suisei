import type { Ref } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import { OmikujiNote } from "@/features/story/components/today/OmikujiNote";
import { WIDE_MEDIA } from "@/features/story/helpers/layout";
import { TODAY_CARD, TODAY_CREDIT } from "@/features/story/helpers/todayContent";

interface StudioCardProps {
  /** Revealed once by the scene hook via `data-on`. */
  cardRef: Ref<HTMLDivElement>;
}

/** The 2026 milestone card: the Studio STELLAR logo plus the omikuji note. */
export const StudioCard = ({ cardRef }: StudioCardProps) => (
  <Box sx={{ [WIDE_MEDIA]: { position: "sticky", top: "14vh" } }}>
    <Stack
      ref={cardRef}
      sx={{
        gap: "1.1rem",
        padding: "1.2rem",
        borderRadius: 2,
        border: "1px solid",
        borderColor: alpha(Palette.COMET, 0.45),
        backgroundColor: Palette.SKY_2,
        boxShadow: `0 26px 62px ${alpha(Palette.SKY_DEEP, 0.6)}`,
        opacity: 0,
        transform: "translateY(20px)",
        transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(.2,.8,.2,1)",
        '&[data-on="true"]': {
          opacity: 1,
          transform: "translateY(0)",
        },
      }}
    >
      <Box
        component="img"
        src={TODAY_CARD.image}
        alt={TODAY_CARD.imageAlt}
        loading="lazy"
        sx={{
          display: "block",
          width: "100%",
          maxWidth: 360,
          ["@media (max-height: 900px)"]: { maxWidth: 220 },
          alignSelf: "center",
          aspectRatio: "1 / 1",
          objectFit: "cover",
          borderRadius: 1,
        }}
      />
      <Typography variant="label" sx={{ color: "primary.main" }}>
        {TODAY_CARD.label}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {TODAY_CARD.body}
      </Typography>
      <OmikujiNote />
    </Stack>
    <Typography
      variant="caption"
      color="text.disabled"
      sx={{ display: "block", marginTop: "0.9rem", textAlign: "center" }}
    >
      {TODAY_CREDIT}
    </Typography>
  </Box>
);
