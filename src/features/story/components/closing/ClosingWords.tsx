import type { RefObject } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Palette } from "@/common/models/palette";
import type { ClosingLineViewModel, ClosingWordTone } from "@/features/story/helpers/closingContent";

interface ClosingWordsProps {
  lines: ClosingLineViewModel[];
  wordRefs: RefObject<(HTMLSpanElement | null)[]>;
}

const GLOW = `0 0 18px ${Palette.COMET_SOFT}, 0 0 46px ${Palette.COMET_SOFT}`;

const COLOR_BY_TONE: Record<ClosingWordTone, string> = {
  plain: "inherit",
  comet: "primary.main",
  sakura: "secondary.main",
};

/** Phase B: the closing thought, lit word by word by the scene hook (same idea as scene 2). */
export const ClosingWords = ({ lines, wordRefs }: ClosingWordsProps) => (
  <Stack sx={{ gap: "1.6rem", maxWidth: "min(90vw, 820px)", mx: "auto", textAlign: "center" }}>
    {lines.map((line) => (
      <Typography key={line.id} variant="h3" component="p">
        {line.words.map((word) => (
          <Box
            key={`${word.index}-${word.text}`}
            component="span"
            data-on="false"
            ref={(node: HTMLSpanElement | null) => {
              wordRefs.current[word.index] = node;
            }}
            sx={{
              display: "inline-block",
              mr: "0.26em",
              opacity: 0.08,
              transform: "translateY(0.25em)",
              color: COLOR_BY_TONE[word.tone],
              transition:
                "opacity 0.35s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), text-shadow 0.8s ease",
              "&[data-on='true']": {
                opacity: 1,
                transform: "translateY(0)",
                ...(word.tone === "comet" ? { textShadow: GLOW } : {}),
              },
            }}
          >
            {word.text}
          </Box>
        ))}
      </Typography>
    ))}
  </Stack>
);
