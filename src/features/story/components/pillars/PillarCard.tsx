import { Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import { WIDE_MEDIA } from "@/features/story/helpers/layout";
import { PILLARS_TOTAL_STEPS, type PillarViewModel } from "@/features/story/helpers/pillarsContent";

interface PillarCardProps {
  pillar: PillarViewModel;
}

/** Selector list matching every step at or past `step`, e.g. `[data-step="2"] &, [data-step="3"] &…`. */
const shownFrom = (step: number): string =>
  Array.from({ length: PILLARS_TOTAL_STEPS }, (_unused, index) => index + 1)
    .filter((candidate) => candidate >= step)
    .map((candidate) => `[data-step="${candidate}"] &`)
    .join(", ");

/** One of the three answers. Hidden until the hook's `data-step` reaches this card. */
export const PillarCard = ({ pillar }: PillarCardProps) => (
  <Stack
    sx={{
      gap: "0.7rem",
      height: "100%",
      padding: "clamp(1rem, 2vh, 1.6rem) clamp(1rem, 1.6vw, 1.6rem)",
      borderRadius: 2,
      border: "1px solid",
      borderColor: alpha(Palette.COMET, 0.28),
      backgroundColor: alpha(Palette.SKY_2, 0.55),
      [WIDE_MEDIA]: {
        opacity: 0,
        transform: "translateY(28px)",
        transition: "opacity 0.6s ease, transform 0.7s cubic-bezier(.2,.8,.2,1)",
        [shownFrom(pillar.step)]: {
          opacity: 1,
          transform: "translateY(0)",
        },
      },
    }}
  >
    <Typography
      variant="display"
      aria-hidden
      sx={{
        color: "primary.main",
        fontSize: "clamp(40px, 5vw, 72px)",
        lineHeight: 0.9,
      }}
    >
      {pillar.numeral}
    </Typography>
    <Typography variant="h4">{pillar.title}</Typography>
    <Typography variant="body2" color="text.secondary">
      {pillar.body}
    </Typography>
  </Stack>
);
