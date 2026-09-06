import { Box, Stack, Typography } from "@mui/material";
import { Palette } from "@/common/models/palette";
import type { FactViewModel } from "@/features/story/interfaces/StoryViewModels";

interface FactItemProps {
  fact: FactViewModel;
  /** Stagger position inside the list. */
  index: number;
}

/** One fact: a glowing tone dot plus the sentence. Revealed by `data-on` on the list root. */
export const FactItem = ({ fact, index }: FactItemProps) => {
  const dotColor = fact.tone === "sakura" ? Palette.SAKURA : Palette.COMET;
  return (
    <Stack
      component="li"
      direction="row"
      spacing={1.75}
      sx={{
        alignItems: "flex-start",
        // Same font size as the sentence, so the dot can be centred on its first line with em math.
        fontSize: (theme) => theme.typography.body1.fontSize,
        lineHeight: 1.6,
        opacity: 0,
        transform: "translateX(-14px)",
        transition: "opacity 0.6s ease, transform 0.7s cubic-bezier(.2,.8,.2,1)",
        transitionDelay: `${index * 0.12}s`,
        '[data-on="true"] &': {
          opacity: 1,
          transform: "translateX(0)",
        },
      }}
    >
      <Box
        component="span"
        aria-hidden
        sx={{
          flex: "0 0 auto",
          // First line box is 1.6em tall: centre a 7px dot in it. (Stack resets child margins, so offset via `top`.)
          position: "relative",
          top: "calc(0.8em - 3.5px)",
          width: 7,
          height: 7,
          borderRadius: "50%",
          backgroundColor: dotColor,
          boxShadow: `0 0 12px ${dotColor}`,
        }}
      />
      <Typography variant="body1" color="text.secondary">
        {fact.parts.map((part, partIndex) =>
          part.strong ? (
            <Box
              key={`${fact.id}-${partIndex}`}
              component="span"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {part.text}
            </Box>
          ) : (
            part.text
          ),
        )}
      </Typography>
    </Stack>
  );
};
