import { BudokanIntro } from "@/features/story/components/budokan/BudokanIntro";
import { BudokanShell } from "@/features/story/components/budokan/BudokanShell";
import { ConcertWall } from "@/features/story/components/budokan/ConcertWall";
import { TokyoDomeShout } from "@/features/story/components/budokan/TokyoDomeShout";
import { FactsList } from "@/features/story/components/shared/FactsList";
import { BUDOKAN_CREDIT, BUDOKAN_FACTS, CONCERT_TILES } from "@/features/story/helpers/budokanContent";
import { useBudokanScene } from "@/features/story/hooks/useBudokanScene";

/** Scene 8 — "El momento: Budokan «SuperNova» (01/02/2025)": the climax, and the only gold scene of the page. */
export const BudokanContainer = () => {
  const scene = useBudokanScene();
  return (
    <BudokanShell
      sectionRef={scene.sectionRef}
      intro={<BudokanIntro yearRef={scene.yearRef} />}
      facts={<FactsList facts={BUDOKAN_FACTS} listRef={scene.factsRef} />}
      dome={<TokyoDomeShout />}
      wall={<ConcertWall tiles={CONCERT_TILES} wallRef={scene.wallRef} credit={BUDOKAN_CREDIT} />}
    />
  );
};
