import { BonusPillar } from "@/features/story/components/pillars/BonusPillar";
import { PillarsIntro } from "@/features/story/components/pillars/PillarsIntro";
import { PillarsRow } from "@/features/story/components/pillars/PillarsRow";
import { PillarsShell } from "@/features/story/components/pillars/PillarsShell";
import { PullQuote } from "@/features/story/components/shared/PullQuote";
import { PILLARS_QUOTE, pillars } from "@/features/story/helpers/pillarsContent";
import { usePillarsScene } from "@/features/story/hooks/usePillarsScene";

/** Scene 11 — "La lección: tres pilares": the answer to the guiding question. */
export const PillarsContainer = () => {
  const scene = usePillarsScene();
  return (
    <PillarsShell
      sectionRef={scene.sectionRef}
      intro={<PillarsIntro />}
      cards={<PillarsRow pillars={pillars} />}
      bonus={<BonusPillar />}
      quote={<PullQuote quote={PILLARS_QUOTE} quoteRef={scene.quoteRef} tone="comet" />}
    />
  );
};
