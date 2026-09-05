import { ClipFan } from "@/features/story/components/origins/ClipFan";
import { FactsList } from "@/features/story/components/origins/FactsList";
import { OriginsHeadline } from "@/features/story/components/origins/OriginsHeadline";
import { OriginsShell } from "@/features/story/components/origins/OriginsShell";
import { PullQuote } from "@/features/story/components/origins/PullQuote";
import { SubscriberCounter } from "@/features/story/components/origins/SubscriberCounter";
import { YearReveal } from "@/features/story/components/origins/YearReveal";
import { originsClips, originsFacts } from "@/features/story/helpers/originsContent";
import { useOriginsScene } from "@/features/story/hooks/useOriginsScene";

/** Scene 3 — "Los inicios (2018)". */
export const OriginsContainer = () => {
  const scene = useOriginsScene();
  return (
    <OriginsShell
      sectionRef={scene.sectionRef}
      left={
        <>
          <YearReveal yearRef={scene.yearRef} />
          <OriginsHeadline />
          <FactsList facts={originsFacts} listRef={scene.factsRef} />
          <SubscriberCounter rowRef={scene.counterRef} valueRef={scene.counterValueRef} />
          <PullQuote quoteRef={scene.quoteRef} />
        </>
      }
      right={<ClipFan clips={originsClips} fanRef={scene.fanRef} />}
    />
  );
};
