import { Box } from "@mui/material";
import { Nebula } from "@/common/components/Nebula";
import { ProgressComet } from "@/common/components/ProgressComet";
import { StarField } from "@/common/components/StarField";
import { StoryFooter } from "@/features/story/components/shared/StoryFooter";
import { HeroContainer } from "@/features/story/containers/HeroContainer";
import { OriginsContainer } from "@/features/story/containers/OriginsContainer";
import { QuestionContainer } from "@/features/story/containers/QuestionContainer";
import { CREDITS_TEXT, PENDING_SCENES_TEXT } from "@/features/story/helpers/storyContent";

// Composition root: shared sky behind everything, then the scenes in talk order.
export const StoryPage = () => (
  <>
    <StarField />
    <Nebula />
    <ProgressComet startLabel="2018" endLabel="2026" />
    <Box component="main" sx={{ position: "relative", zIndex: 1 }}>
      <HeroContainer />
      <QuestionContainer />
      <OriginsContainer />
      <StoryFooter pendingScenes={PENDING_SCENES_TEXT} credits={CREDITS_TEXT} />
    </Box>
  </>
);
