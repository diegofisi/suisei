import type { Ref } from "react";
import { Stack, Typography } from "@mui/material";
import {
  formatCount,
  ignitedSelector,
  type StageCounterViewModel,
} from "@/features/story/helpers/accelerationContent";

interface StageCounterProps {
  counter: StageCounterViewModel;
  /** The hook writes the running number straight into this node. */
  valueRef: Ref<HTMLDivElement>;
}

/** A milestone figure that counts up the moment its stage ignites. Milestones are COMET. */
export const StageCounter = ({ counter, valueRef }: StageCounterProps) => (
  <Stack
    sx={{
      gap: "0.15rem",
      opacity: 0.25,
      transition: "opacity 0.6s ease",
      [ignitedSelector(counter.stageNumber)]: { opacity: 1 },
    }}
  >
    <Typography
      ref={valueRef}
      variant="display"
      aria-label={formatCount(counter.target)}
      sx={{
        color: "primary.main",
        fontSize: "clamp(30px, 3vw, 54px)",
        fontVariantNumeric: "tabular-nums",
        lineHeight: 1,
      }}
    >
      0
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {counter.caption}
    </Typography>
  </Stack>
);
