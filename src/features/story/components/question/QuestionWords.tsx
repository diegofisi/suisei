import type { RefObject } from "react";
import { Box, Typography } from "@mui/material";
import { Palette } from "@/common/models/palette";
import type { QuestionWordViewModel } from "@/features/story/helpers/questionContent";

interface QuestionWordsProps {
  words: QuestionWordViewModel[];
  wordRefs: RefObject<(HTMLSpanElement | null)[]>;
}

const GLOW = `0 0 18px ${Palette.COMET_SOFT}, 0 0 46px ${Palette.COMET_SOFT}`;

/** The guiding question. Each word waits for its `data-on` flag; the hook flips them in reading order. */
export const QuestionWords = ({ words, wordRefs }: QuestionWordsProps) => (
  <Typography variant="h2" component="h2" sx={{ maxWidth: "22ch", mx: "auto", textAlign: "center" }}>
    {words.map((word, index) => (
      <Box
        key={`${index}-${word.text}`}
        component="span"
        data-on="false"
        ref={(node: HTMLSpanElement | null) => {
          wordRefs.current[index] = node;
        }}
        sx={{
          display: "inline-block",
          mr: "0.28em",
          opacity: 0.08,
          transform: "translateY(0.25em)",
          color: word.isKeyword ? "primary.main" : "inherit",
          transition: "opacity 0.35s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), text-shadow 0.8s ease",
          "&[data-on='true']": {
            opacity: 1,
            transform: "translateY(0)",
            ...(word.hasGlow ? { textShadow: GLOW } : {}),
          },
        }}
      >
        {word.text}
      </Box>
    ))}
  </Typography>
);
