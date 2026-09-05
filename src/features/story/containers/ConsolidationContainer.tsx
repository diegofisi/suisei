import { ConsolidationHeadline } from "@/features/story/components/consolidation/ConsolidationHeadline";
import { MilestoneGrid } from "@/features/story/components/consolidation/MilestoneGrid";
import { ClipFan } from "@/features/story/components/shared/ClipFan";
import { PullQuote } from "@/features/story/components/shared/PullQuote";
import { SceneShell } from "@/features/story/components/shared/SceneShell";
import {
  CONSOLIDATION_CREDIT,
  CONSOLIDATION_LABEL,
  CONSOLIDATION_PORTRAIT_CLIP_IDS,
  CONSOLIDATION_QUOTE,
  CONSOLIDATION_QUOTE_NOTE,
  consolidationClips,
} from "@/features/story/helpers/consolidationContent";
import { useConsolidationScene } from "@/features/story/hooks/useConsolidationScene";

/** Scene 7 — "La consolidación (2022–2024)". */
export const ConsolidationContainer = () => {
  const scene = useConsolidationScene();
  return (
    <SceneShell
      sectionRef={scene.sectionRef}
      label={CONSOLIDATION_LABEL}
      left={
        <>
          <ConsolidationHeadline />
          <MilestoneGrid gridRef={scene.gridRef} />
          <PullQuote
            quote={CONSOLIDATION_QUOTE}
            note={CONSOLIDATION_QUOTE_NOTE}
            quoteRef={scene.quoteRef}
            tone="comet"
          />
        </>
      }
      right={
        <ClipFan
          clips={consolidationClips}
          fanRef={scene.fanRef}
          credit={CONSOLIDATION_CREDIT}
          portraitClipIds={CONSOLIDATION_PORTRAIT_CLIP_IDS}
        />
      }
    />
  );
};
