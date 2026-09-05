import type { RefObject } from "react";
import { Box } from "@mui/material";
import { TodayCounter } from "@/features/story/components/today/TodayCounter";
import { NARROW_MEDIA } from "@/features/story/helpers/layout";
import type { TodayCounterViewModel } from "@/features/story/helpers/todayContent";

interface TodayCountersProps {
  counters: TodayCounterViewModel[];
  /** Index-aligned with `counters`; the hook observes the rows and fills the values. */
  rowRefs: RefObject<(HTMLDivElement | null)[]>;
  valueRefs: RefObject<(HTMLDivElement | null)[]>;
}

/** The two 2026 figures, side by side under the facts. */
export const TodayCounters = ({ counters, rowRefs, valueRefs }: TodayCountersProps) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "2rem",
      borderTop: "1px solid",
      borderColor: "divider",
      marginTop: "3rem",
      paddingTop: "2rem",
      [NARROW_MEDIA]: {
        gridTemplateColumns: "minmax(0, 1fr)",
      },
    }}
  >
    {counters.map((counter, index) => (
      <TodayCounter
        key={counter.id}
        counter={counter}
        rowRef={(node) => {
          rowRefs.current[index] = node;
        }}
        valueRef={(node) => {
          valueRefs.current[index] = node;
        }}
      />
    ))}
  </Box>
);
