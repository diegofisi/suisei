import type { Ref } from "react";
import { Box, Typography } from "@mui/material";
import type { FactTone } from "@/features/story/interfaces/StoryViewModels";

interface PullQuoteProps {
  quote: string;
  note?: string;
  quoteRef: Ref<HTMLDivElement>;
  /** SAKURA (default) for her own words; COMET for milestones. */
  tone?: FactTone;
}

/** A big quotation that reveals once when the scene hook sets `data-on`. */
export const PullQuote = ({ quote, note, quoteRef, tone = "sakura" }: PullQuoteProps) => (
  <Box
    ref={quoteRef}
    sx={{
      marginTop: "4rem",
      opacity: 0,
      transform: "translateY(18px)",
      transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(.2,.8,.2,1)",
      '&[data-on="true"]': {
        opacity: 1,
        transform: "translateY(0)",
      },
    }}
  >
    <Box component="blockquote" sx={{ margin: 0, maxWidth: "40ch" }}>
      <Typography variant="h4" sx={{ color: tone === "sakura" ? "secondary.main" : "primary.main" }}>
        {quote}
      </Typography>
    </Box>
    {note && (
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", marginTop: "0.9rem", maxWidth: "40ch" }}>
        {note}
      </Typography>
    )}
  </Box>
);
