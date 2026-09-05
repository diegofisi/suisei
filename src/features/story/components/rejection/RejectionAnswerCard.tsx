import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import { NARROW_MEDIA, WIDE_MEDIA } from "@/features/story/helpers/layout";

interface RejectionAnswerCardProps {
  text: string;
  /** Sits above every condition card. */
  depth: number;
}

/** The punchline: her answer flips in over the finished pile, in COMET. Driven by `data-answered` on the stack root. */
export const RejectionAnswerCard = ({ text, depth }: RejectionAnswerCardProps) => (
  <Box
    sx={{
      zIndex: depth,
      width: "min(100%, 380px)",
      borderRadius: 2,
      border: "1px solid",
      borderColor: alpha(Palette.COMET, 0.7),
      backgroundColor: alpha(Palette.SKY_2, 0.98),
      boxShadow: `0 0 0 1px ${Palette.COMET_SOFT}, 0 26px 70px ${alpha(Palette.SKY_DEEP, 0.72)}, 0 0 46px ${Palette.COMET_SOFT}`,
      padding: "1.6rem 1.7rem",
      opacity: 0,
      transformStyle: "preserve-3d",
      transition: "opacity 0.5s ease, transform 0.8s cubic-bezier(.2,.85,.25,1)",
      [WIDE_MEDIA]: {
        position: "absolute",
        top: "6.4rem",
        left: "50%",
        transform: "translate(-50%, 26px) rotateX(58deg)",
        '[data-answered="true"] &': {
          opacity: 1,
          transform: "translate(-50%, 0px) rotateX(0deg)",
        },
      },
      [NARROW_MEDIA]: {
        position: "static",
        width: "100%",
        transform: "translateY(16px) rotateX(0deg)",
        '[data-answered="true"] &': { opacity: 1, transform: "translateY(0) rotateX(0deg)" },
      },
    }}
  >
    <Typography variant="h3" sx={{ color: "primary.main" }}>
      {text}
    </Typography>
  </Box>
);
