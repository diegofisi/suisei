import type { Ref, RefObject } from "react";
import { Box } from "@mui/material";
import { RejectionAnswerCard } from "@/features/story/components/rejection/RejectionAnswerCard";
import { RejectionCard, type CardPose } from "@/features/story/components/rejection/RejectionCard";
import { NARROW_MEDIA, WIDE_MEDIA } from "@/features/story/helpers/layout";
import type { RejectionConditionViewModel } from "@/features/story/helpers/rejectionContent";

/** Where each note lands: a slightly crooked pile, index-aligned with the conditions. */
const CARD_POSES: readonly CardPose[] = [
  { rot: "-4deg", x: "-4%", y: "0rem" },
  { rot: "3deg", x: "4%", y: "5.6rem" },
  { rot: "-2.5deg", x: "-3%", y: "11.2rem" },
  { rot: "2deg", x: "3%", y: "16.8rem" },
];
const FLAT_POSE: CardPose = { rot: "0deg", x: "0%", y: "0rem" };

interface RejectionStackProps {
  conditions: RejectionConditionViewModel[];
  answer: string;
  stackRef: Ref<HTMLDivElement>;
  cardRefs: RefObject<(HTMLDivElement | null)[]>;
}

/** The pile of conditions plus her answer on top. Sticky while the section scrolls; a plain list under 760px. */
export const RejectionStack = ({ conditions, answer, stackRef, cardRefs }: RejectionStackProps) => (
  // The outer height bounds the sticky travel, so the pile never slides over the quote below it.
  <Box ref={stackRef} data-answered="false" sx={{ [WIDE_MEDIA]: { height: "76vh" } }}>
    <Box
      sx={{
        [WIDE_MEDIA]: {
          position: "sticky",
          top: "12vh",
          height: "25rem",
          perspective: "900px",
        },
        [NARROW_MEDIA]: { display: "flex", flexDirection: "column", gap: "1.1rem" },
      }}
    >
      {conditions.map((condition, index) => (
        <RejectionCard
          key={condition.id}
          text={condition.text}
          pose={CARD_POSES[index] ?? FLAT_POSE}
          depth={index + 1}
          cardRef={(node: HTMLDivElement | null) => {
            cardRefs.current[index] = node;
          }}
        />
      ))}
      <RejectionAnswerCard text={answer} depth={conditions.length + 1} />
    </Box>
  </Box>
);
