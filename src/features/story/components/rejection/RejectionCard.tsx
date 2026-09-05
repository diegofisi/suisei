import type { Ref } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import { NARROW_MEDIA, WIDE_MEDIA } from "@/features/story/helpers/layout";

/** Where a condition card lands in the pile. */
export interface CardPose {
  rot: string;
  x: string;
  y: string;
}

interface RejectionCardProps {
  text: string;
  pose: CardPose;
  /** Stacking order inside the pile. */
  depth: number;
  cardRef: Ref<HTMLDivElement>;
}

/** A curt note from an agency: SKY_2 paper with a SAKURA bar, dealt onto the pile by `data-landed`. */
export const RejectionCard = ({ text, pose, depth, cardRef }: RejectionCardProps) => (
  <Box
    ref={cardRef}
    data-landed="false"
    sx={{
      "--rot": pose.rot,
      "--x": pose.x,
      "--y": pose.y,
      zIndex: depth,
      width: "min(100%, 360px)",
      borderRadius: 2,
      border: "1px solid",
      borderColor: "divider",
      borderLeft: `3px solid ${Palette.SAKURA}`,
      backgroundColor: alpha(Palette.SKY_2, 0.96),
      boxShadow: `0 22px 54px ${alpha(Palette.SKY_DEEP, 0.66)}`,
      padding: "1.25rem 1.5rem",
      opacity: 0,
      transition: "opacity 0.45s ease, transform 0.65s cubic-bezier(.2,.8,.2,1)",
      [WIDE_MEDIA]: {
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translate(calc(-50% + var(--x)), calc(var(--y) + 46px)) rotate(0deg)",
        '&[data-landed="true"]': {
          opacity: 1,
          transform: "translate(calc(-50% + var(--x)), var(--y)) rotate(var(--rot))",
        },
      },
      [NARROW_MEDIA]: {
        position: "static",
        width: "100%",
        transform: "translateY(16px)",
        '&[data-landed="true"]': { opacity: 1, transform: "translateY(0)" },
      },
    }}
  >
    <Typography variant="h4" sx={{ color: "text.primary" }}>
      {text}
    </Typography>
  </Box>
);
