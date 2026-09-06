import { SceneShell } from "@/features/story/components/shared/SceneShell";
import { FactsList } from "@/features/story/components/shared/FactsList";
import { PullQuote } from "@/features/story/components/shared/PullQuote";
import { YearReveal } from "@/features/story/components/shared/YearReveal";
import { StudioCard } from "@/features/story/components/today/StudioCard";
import { TodayCounters } from "@/features/story/components/today/TodayCounters";
import { TodayHeadline } from "@/features/story/components/today/TodayHeadline";
import {
  TODAY_QUOTE,
  TODAY_QUOTE_NOTE,
  TODAY_SECTION_LABEL,
  TODAY_YEAR,
  todayCounters,
  todayFacts,
} from "@/features/story/helpers/todayContent";
import { useTodayScene } from "@/features/story/hooks/useTodayScene";

/** Scene 10 — "Actualidad 2026": Studio STELLAR, la gira y las cifras de hoy. */
export const TodayContainer = () => {
  const scene = useTodayScene();
  return (
    <SceneShell
      sectionRef={scene.sectionRef}
      label={TODAY_SECTION_LABEL}
      left={
        <>
          <YearReveal year={TODAY_YEAR} yearRef={scene.yearRef} tone="comet" />
          <TodayHeadline />
          <FactsList facts={todayFacts} listRef={scene.factsRef} />
          <TodayCounters
            counters={todayCounters}
            rowRefs={scene.counterRowRefs}
            valueRefs={scene.counterValueRefs}
          />
        </>
      }
      right={
        <>
          <StudioCard cardRef={scene.cardRef} />
          <PullQuote
            quote={TODAY_QUOTE}
            note={TODAY_QUOTE_NOTE}
            quoteRef={scene.quoteRef}
            tone="comet"
          />
        </>
      }
    />
  );
};
