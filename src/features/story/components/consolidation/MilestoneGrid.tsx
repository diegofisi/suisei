import type { Ref } from "react";
import { Box } from "@mui/material";
import { MilestoneTile } from "@/features/story/components/consolidation/MilestoneTile";
import { consolidationMilestones } from "@/features/story/helpers/consolidationContent";
import { NARROW_MEDIA } from "@/features/story/helpers/layout";

interface MilestoneGridProps {
  gridRef: Ref<HTMLUListElement>;
}

/** Six compact milestones, two columns on desktop and one below 760px. The hook sets `data-on` once. */
export const MilestoneGrid = ({ gridRef }: MilestoneGridProps) => (
  <Box
    component="ul"
    ref={gridRef}
    sx={{
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "1rem",
      maxWidth: "62ch",
      [NARROW_MEDIA]: { gridTemplateColumns: "minmax(0, 1fr)" },
    }}
  >
    {consolidationMilestones.map((milestone, index) => (
      <MilestoneTile key={milestone.id} milestone={milestone} index={index} />
    ))}
  </Box>
);
