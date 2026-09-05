import type { RefObject } from "react";
import { Box, Stack } from "@mui/material";
import { Palette } from "@/common/models/palette";
import { TurnMilestone } from "@/features/story/components/turn/TurnMilestone";
import { TURN_LINE_PHASE, rampOf, type TurnMilestoneViewModel } from "@/features/story/helpers/turnContent";

interface TurnMilestonesProps {
  milestones: TurnMilestoneViewModel[];
  milestoneRefs: RefObject<(HTMLDivElement | null)[]>;
}

/** The COMET line grows top-down with `--p`; the hook lights each milestone as it is reached. */
const LINE_SCALE = `scaleY(${rampOf(TURN_LINE_PHASE)})`;

export const TurnMilestones = ({ milestones, milestoneRefs }: TurnMilestonesProps) => (
  <Box sx={{ position: "relative" }}>
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        left: "0.85rem",
        top: "0.6rem",
        bottom: "0.6rem",
        width: "2px",
        backgroundColor: Palette.ICE_LINE,
      }}
    />
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        left: "0.85rem",
        top: "0.6rem",
        bottom: "0.6rem",
        width: "2px",
        backgroundColor: Palette.COMET,
        boxShadow: `0 0 12px ${Palette.COMET_SOFT}`,
        transformOrigin: "50% 0",
        transform: LINE_SCALE,
      }}
    />
    <Stack sx={{ gap: "1.8rem" }}>
      {milestones.map((milestone, index) => (
        <TurnMilestone
          key={milestone.id}
          milestone={milestone}
          itemRef={(node: HTMLDivElement | null) => {
            milestoneRefs.current[index] = node;
          }}
        />
      ))}
    </Stack>
  </Box>
);
