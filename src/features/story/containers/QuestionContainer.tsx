import { QuestionShell } from "@/features/story/components/question/QuestionShell";
import { QuestionWords } from "@/features/story/components/question/QuestionWords";
import { TimelineRail } from "@/features/story/components/question/TimelineRail";
import { useQuestionScene } from "@/features/story/hooks/useQuestionScene";

/** Scene 2 — "La pregunta rectora": the question lights up word by word, then the 2018 -> 2026 rail draws. */
export const QuestionContainer = () => {
  const { sectionRef, timelineRef, wordRefs, pointRefs, words, points } = useQuestionScene();

  return (
    <QuestionShell
      sectionRef={sectionRef}
      question={<QuestionWords words={words} wordRefs={wordRefs} />}
      timeline={<TimelineRail points={points} rootRef={timelineRef} pointRefs={pointRefs} />}
    />
  );
};
