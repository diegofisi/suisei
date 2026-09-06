import { AccelerationHeadline } from "@/features/story/components/acceleration/AccelerationHeadline";
import { AccelerationRenders } from "@/features/story/components/acceleration/AccelerationRenders";
import { AccelerationShell } from "@/features/story/components/acceleration/AccelerationShell";
import { RocketShell } from "@/features/story/components/acceleration/RocketShell";
import { StageCounters } from "@/features/story/components/acceleration/StageCounters";
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
    />
  );
};
