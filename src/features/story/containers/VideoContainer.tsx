import { VideoIntro } from "@/features/story/components/video/VideoIntro";
import { VideoNotes } from "@/features/story/components/video/VideoNotes";
import { VideoPlayer } from "@/features/story/components/video/VideoPlayer";
import { VideoShell } from "@/features/story/components/video/VideoShell";
import { useVideoScene } from "@/features/story/hooks/useVideoScene";

/** Scene 9 — "Video: «Orbital Period»": the clip of the night, played live in class. */
export const VideoContainer = () => {
  const scene = useVideoScene();
  return (
    <VideoShell
      sectionRef={scene.sectionRef}
      intro={<VideoIntro />}
      player={<VideoPlayer />}
      notes={<VideoNotes notesRef={scene.notesRef} />}
      quote={null}
    />
  );
};
