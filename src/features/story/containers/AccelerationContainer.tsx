import { AccelerationHeadline } from "@/features/story/components/acceleration/AccelerationHeadline";
import { AccelerationRenders } from "@/features/story/components/acceleration/AccelerationRenders";
import { AccelerationShell } from "@/features/story/components/acceleration/AccelerationShell";
import { RocketShell } from "@/features/story/components/acceleration/RocketShell";
import { StageCounters } from "@/features/story/components/acceleration/StageCounters";
import { PullQuote } from "@/features/story/components/shared/PullQuote";
import { ACCELERATION_QUOTE, ACCELERATION_QUOTE_NOTE } from "@/features/story/helpers/accelerationContent";
import { useAccelerationScene } from "@/features/story/hooks/useAccelerationScene";

/** Scene 6 — "La aceleración (2020–2021): un cohete de tres etapas". */
export const AccelerationContainer = () => {
  const scene = useAccelerationScene();
  return (
    <AccelerationShell
      sectionRef={scene.sectionRef}
      header={<AccelerationHeadline />}
      rocket={<RocketShell />}
      telemetry={
        <>
          <AccelerationRenders />
          <StageCounters valueRefs={scene.counterValueRefs} />
        </>
      }
      quote={
        <PullQuote
          quote={ACCELERATION_QUOTE}
          note={ACCELERATION_QUOTE_NOTE}
          quoteRef={scene.quoteRef}
          tone="comet"
        />
      }
    />
  );
};
