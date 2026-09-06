import type { Ref } from "react";
import { Box, Stack, Typography } from "@mui/material";
import {
  ORIGINS_COUNTER_LEAD,
  ORIGINS_COUNTER_TAIL,
  ORIGINS_COUNT_UP_MS,
  ORIGINS_SUBSCRIBER_TARGET,
  formatSubscribers,
} from "@/features/story/helpers/originsContent";

interface SubscriberCounterProps {
  /** Observed by the hook; entering starts the count-up. */
  rowRef: Ref<HTMLDivElement>;
  /** The hook writes the running number straight into this node. */
  valueRef: Ref<HTMLDivElement>;
}

/** "6.000 suscriptores" — the number that makes the whole talk work. Counts up once, in SAKURA. */
export const SubscriberCounter = ({ rowRef, valueRef }: SubscriberCounterProps) => (
  <Stack
    ref={rowRef}
    direction="row"
    spacing={3}
    sx={{
      alignItems: "center",
      flexWrap: "wrap",
      borderTop: "1px solid",
      borderColor: "divider",
      marginTop: "2rem",
      paddingTop: "1.4rem",
      ["@media (max-height: 900px)"]: { marginTop: "1.2rem", paddingTop: "1rem" },
      ["@media (max-height: 780px)"]: { marginTop: "0.8rem", paddingTop: "0.7rem" },
    }}
  >
    <Typography
      ref={valueRef}
      variant="display"
      aria-label={formatSubscribers(ORIGINS_SUBSCRIBER_TARGET)}
      sx={{
        color: "secondary.main",
        fontSize: "clamp(56px, 7vw, 110px)",
        ["@media (max-height: 900px)"]: { fontSize: "clamp(44px, 5vw, 76px)" },
        fontVariantNumeric: "tabular-nums",
      }}
    >
      0
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "28ch" }}>
      <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
        {ORIGINS_COUNTER_LEAD}
      </Box>
      <Box
        component="span"
        sx={{
          // "0 suscriptores." at first; the tail unfolds while the number runs, and the full stop slides with it.
          display: "inline-block",
          verticalAlign: "bottom",
          whiteSpace: "pre",
          overflow: "hidden",
          maxWidth: 0,
          opacity: 0,
          transition: `max-width ${ORIGINS_COUNT_UP_MS}ms ease-out, opacity ${ORIGINS_COUNT_UP_MS * 0.6}ms ease-out ${ORIGINS_COUNT_UP_MS * 0.25}ms`,
          '[data-on="true"] &': { maxWidth: "24ch", opacity: 1 },
        }}
      >
        {ORIGINS_COUNTER_TAIL}
      </Box>
      .
    </Typography>
  </Stack>
);
