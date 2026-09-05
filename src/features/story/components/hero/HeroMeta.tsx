import { Stack, Typography } from "@mui/material";
import type { HeroMetaItem } from "@/features/story/helpers/heroContent";

export interface HeroMetaProps {
  items: HeroMetaItem[];
  /** Entrance delay in ms, so the meta row lands after the title. */
  enterDelay: number;
}

export const HeroMeta = ({ items, enterDelay }: HeroMetaProps) => (
  <Stack
    direction="row"
    flexWrap="wrap"
    sx={{
      gap: "2.2rem",
      mt: 4.5,
      "@keyframes heroMetaIn": {
        from: { opacity: 0, transform: "translateY(14px)" },
        to: { opacity: 1, transform: "translateY(0)" },
      },
      animation: `heroMetaIn 900ms cubic-bezier(0.22, 1, 0.36, 1) ${enterDelay}ms both`,
    }}
  >
    {items.map((item) => (
      <Stack key={item.id} direction="row" alignItems="baseline" sx={{ gap: 0.9 }}>
        <Typography variant="caption" color="text.secondary">
          {item.label} —
        </Typography>
        <Typography variant="body2" color="text.primary">
          {item.value}
        </Typography>
      </Stack>
    ))}
  </Stack>
);
