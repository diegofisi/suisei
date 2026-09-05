import { Box, Stack, Typography } from "@mui/material";
import { Palette } from "@/common/models/palette";
import { ignitedSelector } from "@/features/story/helpers/accelerationContent";
import type { FactViewModel } from "@/features/story/interfaces/StoryViewModels";

interface StageFactProps {
  fact: FactViewModel;
  /** Stage this fact belongs to (1-based); it fades in when that stage ignites. */
  stageNumber: number;
  /** Stagger position inside the stage. */
  index: number;
}

/** One line of a rocket stage: a comet dot plus the sentence. Revealed by `data-stage` on the scene root. */
export const StageFact = ({ fact, stageNumber, index }: StageFactProps) => (
  <Stack
    component="li"
    direction="row"
    spacing={1.3}
    sx={{
      alignItems: "flex-start",
      opacity: 0,
      transform: "translateY(8px)",
      transition: "opacity 0.55s ease, transform 0.6s cubic-bezier(.2,.8,.2,1)",
      transitionDelay: `${0.12 + index * 0.1}s`,
      [ignitedSelector(stageNumber)]: {
        opacity: 1,
        transform: "translateY(0)",
      },
    }}
  >
    <Box
      component="span"
      aria-hidden
      sx={{
        flex: "0 0 auto",
        marginTop: "0.58em",
        width: 6,
        height: 6,
        borderRadius: "50%",
        backgroundColor: Palette.COMET,
        boxShadow: `0 0 10px ${Palette.COMET}`,
      }}
    />
    <Typography variant="body2" color="text.secondary">
      {fact.parts.map((part, partIndex) =>
        part.strong ? (
          <Box key={`${fact.id}-${partIndex}`} component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
            {part.text}
          </Box>
        ) : (
          part.text
        ),
      )}
    </Typography>
  </Stack>
);
