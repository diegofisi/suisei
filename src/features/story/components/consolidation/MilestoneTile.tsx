import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import type { MilestoneViewModel } from "@/features/story/helpers/consolidationContent";

interface MilestoneTileProps {
  milestone: MilestoneViewModel;
  /** Stagger position inside the grid. */
  index: number;
}

/** One milestone: the date in COMET on top, the fact below. Revealed by `data-on` on the grid root. */
export const MilestoneTile = ({ milestone, index }: MilestoneTileProps) => (
  <Stack
    component="li"
    sx={{
      listStyle: "none",
      gap: "0.5rem",
      padding: "1rem 1.1rem 1.1rem",
      borderRadius: 1,
      border: "1px solid",
      borderColor: "divider",
      background: `linear-gradient(155deg, ${alpha(Palette.SKY_2, 0.6)} 0%, ${alpha(Palette.SKY, 0.6)} 100%)`,
      opacity: 0,
      transform: "translateY(14px)",
      transition: "opacity 0.6s ease, transform 0.7s cubic-bezier(.2,.8,.2,1)",
      transitionDelay: `${index * 0.09}s`,
      '[data-on="true"] &': {
        opacity: 1,
        transform: "translateY(0)",
      },
    }}
  >
    <Typography variant="label" sx={{ color: "primary.main" }}>
      {milestone.date}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {milestone.parts.map((part, partIndex) =>
        part.strong ? (
          <Box key={`${milestone.id}-${partIndex}`} component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
            {part.text}
          </Box>
        ) : (
          part.text
        ),
      )}
    </Typography>
  </Stack>
);
