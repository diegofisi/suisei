import { TurnClosing } from "@/features/story/components/turn/TurnClosing";
import { TurnMilestones } from "@/features/story/components/turn/TurnMilestones";
import { TurnRender } from "@/features/story/components/turn/TurnRender";
import { TurnShell } from "@/features/story/components/turn/TurnShell";
import { TurnStatement } from "@/features/story/components/turn/TurnStatement";
import {
  TURN_CLOSING_HEADLINE,
  TURN_CLOSING_NOTE,
  TURN_EYEBROW,
  TURN_RENDER_ALT,
  TURN_RENDER_CREDIT,
  TURN_RENDER_SRC,
  TURN_RENDER_TAG,
  TURN_STATEMENT_AFTER,
  TURN_STATEMENT_BEFORE,
  TURN_STATEMENT_BODY,
  turnMilestones,
} from "@/features/story/helpers/turnContent";
import { useTurnScene } from "@/features/story/hooks/useTurnScene";

/** Scene 5 — "El giro: INoNaKa Music y hololive (2019)": the page crosses from SAKURA to COMET. */
export const TurnContainer = () => {
  const scene = useTurnScene();
  return (
    <TurnShell
      sectionRef={scene.sectionRef}
      statement={
        <TurnStatement
          eyebrow={TURN_EYEBROW}
          before={TURN_STATEMENT_BEFORE}
          after={TURN_STATEMENT_AFTER}
          body={TURN_STATEMENT_BODY}
        />
      }
      milestones={<TurnMilestones milestones={turnMilestones} milestoneRefs={scene.milestoneRefs} />}
      render={
        <TurnRender
          src={TURN_RENDER_SRC}
          alt={TURN_RENDER_ALT}
          tag={TURN_RENDER_TAG}
          credit={TURN_RENDER_CREDIT}
        />
      }
      closing={<TurnClosing headline={TURN_CLOSING_HEADLINE} note={TURN_CLOSING_NOTE} />}
    />
  );
};
