import type { Ref } from "react";
import { Stack, Typography } from "@mui/material";
import { formatCounter, type TodayCounterViewModel } from "@/features/story/helpers/todayContent";

interface TodayCounterProps {
  counter: TodayCounterViewModel;
  /** Observed by the hook; entering starts the count-up. */
  rowRef: Ref<HTMLDivElement>;
  /** The hook writes the running number straight into this node. */
  valueRef: Ref<HTMLDivElement>;
}

/** One 2026 figure counting up in COMET: a milestone number, not a doubt. */
export const TodayCounter = ({ counter, rowRef, valueRef }: TodayCounterProps) => (
  <Stack
    ref={rowRef}
    sx={{
      gap: "0.35rem",
      opacity: 0,
      transform: "translateY(14px)",
      transition: "opacity 0.6s ease, transform 0.7s cubic-bezier(.2,.8,.2,1)",
      '&[data-on="true"]': {
        opacity: 1,
        transform: "translateY(0)",
      },
    }}
  >
    <Typography
      ref={valueRef}
      variant="display"
      aria-label={formatCounter(counter.target, counter)}
      sx={{
        color: "primary.main",
        fontSize: "clamp(38px, 4.2vw, 64px)",
        whiteSpace: "nowrap",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {formatCounter(0, counter)}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "24ch" }}>
      {counter.caption}
    </Typography>
  </Stack>
);
