import { Box } from "@mui/material";
import { RocketStage } from "@/features/story/components/acceleration/RocketStage";
import { accelerationStages } from "@/features/story/helpers/accelerationContent";
import { NARROW_MEDIA } from "@/features/story/helpers/layout";

/**
 * The rocket itself. Reading order stays chronological (1 → 3) while `column-reverse`
 * stacks stage 1 at the bottom and stage 3 on top, so the fire climbs as the scene advances.
 * Under 760px the stage is not sticky and the reader scrolls down through it, so the stack
 * goes chronological top-down: stage 3 on top would ignite once it had already scrolled away.
 */
export const RocketShell = () => (
  <Box
    component="ul"
    sx={{
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column-reverse",
      justifyContent: "flex-start",
      gap: "0.8rem",
      maxWidth: "62ch",
      [NARROW_MEDIA]: { flexDirection: "column" },
    }}
  >
    {accelerationStages.map((stage) => (
      <RocketStage key={stage.id} stage={stage} />
    ))}
  </Box>
);
