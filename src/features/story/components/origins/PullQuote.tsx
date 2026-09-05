import type { Ref } from "react";
import { Box, Typography } from "@mui/material";
import { ORIGINS_QUOTE, ORIGINS_QUOTE_NOTE } from "@/features/story/helpers/originsContent";

interface PullQuoteProps {
  quoteRef: Ref<HTMLDivElement>;
}

/** Her answer to the agencies — the bridge into scene 4. Reveals once. */
export const PullQuote = ({ quoteRef }: PullQuoteProps) => (
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
      <Typography variant="h4" sx={{ color: "secondary.main" }}>
        {ORIGINS_QUOTE}
      </Typography>
    </Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: "block", marginTop: "0.9rem", maxWidth: "40ch" }}>
      {ORIGINS_QUOTE_NOTE}
    </Typography>
  </Box>
);
