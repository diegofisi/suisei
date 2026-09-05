import { Box } from "@mui/material";
import { PillarCard } from "@/features/story/components/pillars/PillarCard";
import { NARROW_MEDIA } from "@/features/story/helpers/layout";
import type { PillarViewModel } from "@/features/story/helpers/pillarsContent";

interface PillarsRowProps {
  pillars: PillarViewModel[];
}

/** The three pillars side by side; a single stacked column under 760px. */
export const PillarsRow = ({ pillars }: PillarsRowProps) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "clamp(0.9rem, 1.6vw, 1.8rem)",
      alignItems: "stretch",
      [NARROW_MEDIA]: {
        gridTemplateColumns: "minmax(0, 1fr)",
      },
    }}
  >
    {pillars.map((pillar) => (
      <PillarCard key={pillar.id} pillar={pillar} />
    ))}
  </Box>
);
