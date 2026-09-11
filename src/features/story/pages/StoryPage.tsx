import { useCallback, useState } from "react";
import { Box } from "@mui/material";
import { MusicPlayer } from "@/common/components/MusicPlayer";
import { MusicSidebar } from "@/common/components/MusicSidebar";
import { Nebula } from "@/common/components/Nebula";
import { PresenterControls } from "@/common/components/PresenterControls";
import { ProgressComet } from "@/common/components/ProgressComet";
import { StarField } from "@/common/components/StarField";
import { LOCAL_PLAYLIST, PLAYLIST } from "@/common/helpers/playlist";
import { useMusicPlayer } from "@/common/hooks/useMusicPlayer";
import { usePresenterNavigation } from "@/common/hooks/usePresenterNavigation";
import { useSpotifyPlayer } from "@/common/hooks/useSpotifyPlayer";
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

// Build-time switch (vite.config.ts): the single-file classroom build ships local MP3s and plays them itself;
// the dev server and the web build play the same soundtrack through Spotify's embed.
const useSoundtrack = __LOCAL_AUDIO__ ? useMusicPlayer : useSpotifyPlayer;
const soundtrack = __LOCAL_AUDIO__ ? LOCAL_PLAYLIST : PLAYLIST;

// Composition root: shared sky behind everything, the music bar and its panel, then the twelve scenes in talk order.
export const StoryPage = () => {
  const player = useSoundtrack(soundtrack);
  const navigation = usePresenterNavigation();
  const [isPanelOpen, setPanelOpen] = useState(false);
  const openPanel = useCallback(() => setPanelOpen(true), []);
  const closePanel = useCallback(() => setPanelOpen(false), []);
  return (
    <>
      <StarField />
      <MusicPlayer {...player} onOpenPanel={openPanel} isPanelOpen={isPanelOpen} />
      <MusicSidebar {...player} isOpen={isPanelOpen} onClose={closePanel} />
      <PresenterControls {...navigation} />
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
