import { LessonCard } from "@/features/story/components/rejection/LessonCard";
import { RejectionHeadline } from "@/features/story/components/rejection/RejectionHeadline";
import { RejectionStack } from "@/features/story/components/rejection/RejectionStack";
import { FactsList } from "@/features/story/components/shared/FactsList";
import { SceneShell } from "@/features/story/components/shared/SceneShell";
import {
  REJECTION_ANSWER,
  REJECTION_HEADLINE,
  REJECTION_LESSON_LABEL,
  REJECTION_LESSON_NUMBER,
  REJECTION_LESSON_TEXT,
  rejectionConditions,
  rejectionFacts,
} from "@/features/story/helpers/rejectionContent";
import { useRejectionScene } from "@/features/story/hooks/useRejectionScene";

/** Scene 4 — "El rechazo y la terquedad": the conditions pile up on the right, her answer lands on top. */
export const RejectionContainer = () => {
  const scene = useRejectionScene();
  return (
    <SceneShell
      sectionRef={scene.sectionRef}
      revealSteps={1}
      label="El rechazo y la terquedad"
      left={
        <>
          <RejectionHeadline headline={REJECTION_HEADLINE} />
          <FactsList facts={rejectionFacts} listRef={scene.factsRef} />
          <LessonCard
            number={REJECTION_LESSON_NUMBER}
            label={REJECTION_LESSON_LABEL}
            text={REJECTION_LESSON_TEXT}
            cardRef={scene.lessonRef}
          />
        </>
      }
      right={
        <>
          <RejectionStack
            conditions={rejectionConditions}
            answer={REJECTION_ANSWER}
            stackRef={scene.stackRef}
            cardRefs={scene.cardRefs}
          />
        </>
      }
    />
  );
};
