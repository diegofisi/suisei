import type { RefObject } from "react";
import { Stack } from "@mui/material";
import { StageCounter } from "@/features/story/components/acceleration/StageCounter";
import { accelerationCounters } from "@/features/story/helpers/accelerationContent";

interface StageCountersProps {
  /** One slot per counter, filled by the hook so it can write numbers without re-rendering. */
  valueRefs: RefObject<(HTMLDivElement | null)[]>;
}

/** Telemetry readout: the two figures that prove the acceleration. */
export const StageCounters = ({ valueRefs }: StageCountersProps) => (
  <Stack
    sx={{
      gap: "1.1rem",
      borderTop: "1px solid",
      borderColor: "divider",
      paddingTop: "1.1rem",
    }}
  >
    {accelerationCounters.map((counter, index) => (
      <StageCounter
        key={counter.id}
        counter={counter}
        valueRef={(node) => {
          valueRefs.current[index] = node;
        }}
      />
    ))}
  </Stack>
);
