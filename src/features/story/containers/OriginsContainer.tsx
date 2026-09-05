import { OriginsHeadline } from "@/features/story/components/origins/OriginsHeadline";
import { OriginsShell } from "@/features/story/components/origins/OriginsShell";
import { StatsClipBody } from "@/features/story/components/origins/StatsClipBody";
import { SubscriberCounter } from "@/features/story/components/origins/SubscriberCounter";
import { ClipFan } from "@/features/story/components/shared/ClipFan";
import { FactsList } from "@/features/story/components/shared/FactsList";
import { PullQuote } from "@/features/story/components/shared/PullQuote";
import { YearReveal } from "@/features/story/components/shared/YearReveal";
import {
  ORIGINS_CREDIT,
  ORIGINS_QUOTE,
  ORIGINS_QUOTE_NOTE,
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
          <PullQuote quote={ORIGINS_QUOTE} note={ORIGINS_QUOTE_NOTE} quoteRef={scene.quoteRef} />
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
