import type { Ref } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";

interface LessonCardProps {
  /** Big tabular numeral, e.g. "01". */
  number: string;
  label: string;
  text: string;
  cardRef: Ref<HTMLDivElement>;
}

/** The lesson of the scene, framed in SAKURA. Rises once when the hook sets `data-on`. */
export const LessonCard = ({ number, label, text, cardRef }: LessonCardProps) => (
  <Box
    ref={cardRef}
    sx={{
      position: "relative",
      overflow: "hidden",
      marginTop: "3.4rem",
      padding: "2rem 2.4rem",
      borderRadius: 2,
      border: "1px solid",
      borderColor: alpha(Palette.SAKURA, 0.45),
      background: `radial-gradient(120% 140% at 8% 0%, ${Palette.SAKURA_SOFT} 0%, transparent 62%)`,
      opacity: 0,
      transform: "translateY(20px)",
      transition: "opacity 0.7s ease, transform 0.8s cubic-bezier(.2,.8,.2,1)",
      '&[data-on="true"]': { opacity: 1, transform: "translateY(0)" },
    }}
  >
    <Stack
      direction="row"
      spacing={2.6}
      sx={{ alignItems: "center", flexWrap: "wrap", rowGap: "1rem" }}
    >
      <Typography
        variant="display"
        aria-hidden
        sx={{
          color: "secondary.main",
          fontSize: "clamp(48px, 6vw, 88px)",
          fontVariantNumeric: "tabular-nums",
          textShadow: `0 0 34px ${Palette.SAKURA_SOFT}`,
          flex: "0 0 auto",
        }}
      >
        {number}
      </Typography>
      <Stack sx={{ gap: "0.9rem", minWidth: 0, flex: "1 1 18ch" }}>
        <Typography variant="label" sx={{ color: "secondary.main" }}>
          {label}
        </Typography>
        <Typography variant="h4" sx={{ maxWidth: "34ch" }}>
          {text}
        </Typography>
      </Stack>
    </Stack>
  </Box>
);
