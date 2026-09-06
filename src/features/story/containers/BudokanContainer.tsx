import { BudokanIntro } from "@/features/story/components/budokan/BudokanIntro";
import { BudokanShell } from "@/features/story/components/budokan/BudokanShell";
import { FlashbackNotes } from "@/features/story/components/budokan/FlashbackNotes";
import { ConcertCollage } from "@/features/story/components/budokan/ConcertCollage";
import { TokyoDomeShout } from "@/features/story/components/budokan/TokyoDomeShout";
import { FactsList } from "@/features/story/components/shared/FactsList";
import { PullQuote } from "@/features/story/components/shared/PullQuote";
import {
  BUDOKAN_BRIDGE_NOTE,
  BUDOKAN_BRIDGE_QUOTE,
  BUDOKAN_FACTS,
  BUDOKAN_CREDIT,
  CONCERT_TILES,
} from "@/features/story/helpers/budokanContent";
import { useBudokanScene } from "@/features/story/hooks/useBudokanScene";

/** Scene 8 — "El momento: Budokan «SuperNova» (01/02/2025)": the climax, and the only gold scene of the page. */
export const BudokanContainer = () => {
  const scene = useBudokanScene();
  return (
    <BudokanShell
      sectionRef={scene.sectionRef}
      intro={<BudokanIntro yearRef={scene.yearRef} />}
      facts={<FactsList facts={BUDOKAN_FACTS} listRef={scene.factsRef} />}
      notes={<FlashbackNotes />}
      dome={<TokyoDomeShout />}
      bridge={
        <PullQuote
          quote={BUDOKAN_BRIDGE_QUOTE}
          note={BUDOKAN_BRIDGE_NOTE}
          quoteRef={scene.bridgeRef}
          tone="comet"
        />
      }
      collage={<ConcertCollage tiles={CONCERT_TILES} collageRef={scene.collageRef} credit={BUDOKAN_CREDIT} />}
    />
  );
};
