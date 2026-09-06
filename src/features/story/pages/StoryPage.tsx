import { Box } from "@mui/material";
import { MusicPlayer } from "@/common/components/MusicPlayer";
import { Nebula } from "@/common/components/Nebula";
import { ProgressComet } from "@/common/components/ProgressComet";
import { StarField } from "@/common/components/StarField";
import { PLAYLIST } from "@/common/helpers/playlist";
import { useMusicPlayer } from "@/common/hooks/useMusicPlayer";
import { StoryFooter } from "@/features/story/components/shared/StoryFooter";
import { AccelerationContainer } from "@/features/story/containers/AccelerationContainer";
import { BudokanContainer } from "@/features/story/containers/BudokanContainer";
import { ClosingContainer } from "@/features/story/containers/ClosingContainer";
import { ConsolidationContainer } from "@/features/story/containers/ConsolidationContainer";
import { HeroContainer } from "@/features/story/containers/HeroContainer";
import { OriginsContainer } from "@/features/story/containers/OriginsContainer";
import { PillarsContainer } from "@/features/story/containers/PillarsContainer";
import { QuestionContainer } from "@/features/story/containers/QuestionContainer";
import { RejectionContainer } from "@/features/story/containers/RejectionContainer";
import { TodayContainer } from "@/features/story/containers/TodayContainer";
import { TurnContainer } from "@/features/story/containers/TurnContainer";
import { VideoContainer } from "@/features/story/containers/VideoContainer";
import {
  CREDITS_TEXT,
  SOURCES_TEXT,
} from "@/features/story/helpers/storyContent";

// Composition root: shared sky behind everything, the music bar, then the twelve scenes in talk order.
export const StoryPage = () => {
  const player = useMusicPlayer(PLAYLIST);
  return (
    <>
      <StarField />
      <MusicPlayer {...player} />
      <Nebula />
      <ProgressComet startLabel="2018" endLabel="2026" />
      <Box component="main" sx={{ position: "relative", zIndex: 1 }}>
        <HeroContainer />
        <QuestionContainer />
        <OriginsContainer />
        <RejectionContainer />
        <TurnContainer />
        <AccelerationContainer />
        <ConsolidationContainer />
        <BudokanContainer />
        <VideoContainer />
        <TodayContainer />
        <PillarsContainer />
        <ClosingContainer />
        <StoryFooter sources={SOURCES_TEXT} credits={CREDITS_TEXT} />
      </Box>
    </>
  );
};
