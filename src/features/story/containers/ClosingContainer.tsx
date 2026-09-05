import { ClosingEndRoll } from "@/features/story/components/closing/ClosingEndRoll";
import { ClosingShell } from "@/features/story/components/closing/ClosingShell";
import { ClosingThanks } from "@/features/story/components/closing/ClosingThanks";
import { ClosingWords } from "@/features/story/components/closing/ClosingWords";
import { useClosingScene } from "@/features/story/hooks/useClosingScene";

/** Scene 12 — "Cierre": the end roll, the closing thought and the questions prompt. */
export const ClosingContainer = () => {
  const scene = useClosingScene();
  return (
    <ClosingShell
      sectionRef={scene.sectionRef}
      endRoll={<ClosingEndRoll chorusRef={scene.chorusRef} />}
      thought={<ClosingWords lines={scene.lines} wordRefs={scene.wordRefs} />}
      thanks={<ClosingThanks />}
    />
  );
};
