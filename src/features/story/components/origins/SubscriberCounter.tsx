import type { Ref } from "react";
import { Box, Stack, Typography } from "@mui/material";
import {
  ORIGINS_COUNTER_LEAD,
  ORIGINS_COUNTER_TAIL,
  ORIGINS_SUBSCRIBER_TARGET,
  formatSubscribers,
} from "@/features/story/helpers/originsContent";

interface SubscriberCounterProps {
  /** The hook sets `data-on` once the row scrolls in. */
  rowRef: Ref<HTMLDivElement>;
}

/** "6.000 suscriptores tras un año entero" — the number that makes the whole talk work, in SAKURA. Rises once. */
export const SubscriberCounter = ({ rowRef }: SubscriberCounterProps) => (
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
      opacity: 0,
      transform: "translateY(14px)",
      transition: "opacity 0.7s ease 0.35s, transform 0.8s cubic-bezier(.2,.8,.2,1) 0.35s",
      '&[data-on="true"]': { opacity: 1, transform: "translateY(0)" },
    }}
  >
    <Typography
      variant="display"
      sx={{
        color: "secondary.main",
        fontSize: "clamp(56px, 7vw, 110px)",
        ["@media (max-height: 900px)"]: { fontSize: "clamp(44px, 5vw, 76px)" },
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {formatSubscribers(ORIGINS_SUBSCRIBER_TARGET)}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "28ch" }}>
      <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
        {ORIGINS_COUNTER_LEAD}
      </Box>
      {ORIGINS_COUNTER_TAIL}.
    </Typography>
  </Stack>
);
