import { OriginsHeadline } from "@/features/story/components/origins/OriginsHeadline";
import { OriginsShell } from "@/features/story/components/origins/OriginsShell";
import { StatsClipBody } from "@/features/story/components/origins/StatsClipBody";
import { SubscriberCounter } from "@/features/story/components/origins/SubscriberCounter";
import { ClipFan } from "@/features/story/components/shared/ClipFan";
import { FactsList } from "@/features/story/components/shared/FactsList";
import { YearReveal } from "@/features/story/components/shared/YearReveal";
import {
  ORIGINS_CREDIT,
  ORIGINS_YEAR,
  originsClips,
  originsFacts,
} from "@/features/story/helpers/originsContent";
import { useOriginsScene } from "@/features/story/hooks/useOriginsScene";

/** The 6.000 and the day job are the doubt, not the milestone. */
const SAKURA_CLIP_IDS: readonly string[] = ["stats", "day-job"];

/** Scene 3 — "Los inicios (2018)". */
export const OriginsContainer = () => {
  const scene = useOriginsScene();
  return (
    <OriginsShell
      sectionRef={scene.sectionRef}
      left={
        <>
          <YearReveal year={ORIGINS_YEAR} yearRef={scene.yearRef} />
          <OriginsHeadline />
          <FactsList facts={originsFacts} listRef={scene.factsRef} />
          <SubscriberCounter rowRef={scene.counterRef} valueRef={scene.counterValueRef} />
        </>
      }
      right={
        <ClipFan
          clips={originsClips}
          fanRef={scene.fanRef}
          credit={ORIGINS_CREDIT}
          sakuraClipIds={SAKURA_CLIP_IDS}
          bodyByClipId={{ stats: <StatsClipBody /> }}
        />
      }
    />
  );
};
