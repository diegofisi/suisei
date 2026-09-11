import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import { COMPACT_MEDIA } from "@/features/story/helpers/questionContent";
import type { TimelinePointViewModel } from "@/features/story/interfaces/StoryViewModels";

interface TimelinePointProps {
  point: TimelinePointViewModel;
  index: number;
  count: number;
  /** Under 760px every other frame hangs below the rail (its year goes above), so eight frames fit a phone. */
  isBelowRail: boolean;
  rootRef: (node: HTMLDivElement | null) => void;
}

const LIT = "[data-lit='true'] &";

/** Frame sizes: the full-body renders need a tall frame; logos get a circle. The destination (today) is the biggest. */
// Capped by viewport height too, so a 768px laptop keeps the frames under the question.
const PORTRAIT_FRAME = { width: "min(168px, 19.4vh)", height: "min(260px, 30vh)" };
const PORTRAIT_FRAME_DESTINATION = { width: "min(190px, 22vh)", height: "min(292px, 34vh)" };
const PORTRAIT_FRAME_COMPACT = { width: "58px", height: "88px" };
const CIRCLE_FRAME = { width: "min(124px, 15vh)", height: "min(124px, 15vh)" };
const CIRCLE_FRAME_DESTINATION = { width: "min(150px, 18vh)", height: "min(150px, 18vh)" };
const CIRCLE_FRAME_COMPACT = { width: "60px", height: "60px" };

/** One milestone: whole render above the rail, dot on it, year + label below. Pops when the comet reaches it. */
export const TimelinePoint = ({ point, index, count, isBelowRail, rootRef }: TimelinePointProps) => {
  const accent = point.isDestination ? Palette.GOLD : Palette.COMET;
  const offset = count < 2 ? 50 : (index / (count - 1)) * 100;
  const isCircle = point.thumbnailShape === "circle";
  const frame = isCircle
    ? point.isDestination
      ? CIRCLE_FRAME_DESTINATION
      : CIRCLE_FRAME
    : point.isDestination
      ? PORTRAIT_FRAME_DESTINATION
      : PORTRAIT_FRAME;
  const compactFrame = isCircle ? CIRCLE_FRAME_COMPACT : PORTRAIT_FRAME_COMPACT;
  const ringRepeat = point.isDestination ? 3 : 1;

  return (
    <Box
      ref={rootRef}
      data-lit="false"
      sx={{ position: "absolute", left: `${offset}%`, top: "50%", width: 0, height: 0 }}
    >
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          bottom: 18,
          width: frame.width,
          height: frame.height,
          padding: isCircle ? 0 : "8px 4px",
          borderRadius: isCircle ? "50%" : 2.5,
          overflow: "hidden",
          background: `linear-gradient(180deg, ${Palette.SKY_2} 0%, ${Palette.SKY} 100%)`,
          border: `1.5px solid ${accent}`,
          boxShadow: `0 0 0 1px ${Palette.SKY}, 0 0 20px ${Palette.COMET_SOFT}`,
          opacity: 0,
          transform: "translateX(-50%) translateY(18px) scale(0.6)",
          transformOrigin: "50% 100%",
          "@keyframes framePop": {
            "0%": { opacity: 0, transform: "translateX(-50%) translateY(18px) scale(0.6)" },
            "55%": { opacity: 1, transform: "translateX(-50%) translateY(-8px) scale(1.06)" },
            "100%": { opacity: 1, transform: "translateX(-50%) translateY(0) scale(1)" },
          },
          "@keyframes frameBreathe": {
            "0%, 100%": { boxShadow: `0 0 0 1px ${Palette.SKY}, 0 0 22px ${alpha(Palette.GOLD, 0.35)}` },
            "50%": { boxShadow: `0 0 0 1px ${Palette.SKY}, 0 0 44px ${alpha(Palette.GOLD, 0.7)}` },
          },
          [COMPACT_MEDIA]: isBelowRail
            ? { width: compactFrame.width, height: compactFrame.height, bottom: "auto", top: 14, transformOrigin: "50% 0%" }
            : { width: compactFrame.width, height: compactFrame.height, bottom: 14 },
          [LIT]: {
            opacity: 1,
            transform: "translateX(-50%) translateY(0) scale(1)",
            animation: point.isDestination
              ? "framePop 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both, frameBreathe 2.4s ease-in-out 0.9s infinite"
              : "framePop 0.65s cubic-bezier(0.22, 1, 0.36, 1) 0.06s both",
          },
        }}
      >
        <Box
          component="img"
          src={point.image}
          alt={`Suisei — ${point.label} (${point.year})`}
          loading="lazy"
          sx={{ display: "block", width: "100%", height: "100%", objectFit: isCircle ? "cover" : "contain" }}
        />
      </Box>
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 14,
          height: 14,
          borderRadius: "50%",
          border: `2px solid ${accent}`,
          transform: "translate(-50%, -50%) scale(0.4)",
          opacity: 0,
          "@keyframes ringBurst": {
            "0%": { opacity: 0.9, transform: "translate(-50%, -50%) scale(0.5)" },
            "100%": { opacity: 0, transform: "translate(-50%, -50%) scale(4.2)" },
          },
          [LIT]: { animation: `ringBurst 0.9s ease-out ${ringRepeat}` },
        }}
      />
      <Box
        component="svg"
        viewBox="0 0 16 16"
        aria-hidden
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 16,
          height: 16,
          overflow: "visible",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Box
          component="circle"
          cx={8}
          cy={8}
          r={point.isDestination ? 6.5 : 5}
          sx={{
            fill: Palette.SKY,
            stroke: Palette.ICE_LINE,
            strokeWidth: 1.5,
            transformBox: "fill-box",
            transformOrigin: "center",
            transition: "fill 0.35s ease, stroke 0.35s ease, filter 0.45s ease",
            "@keyframes dotPop": {
              "0%": { transform: "scale(1)" },
              "40%": { transform: "scale(1.7)" },
              "100%": { transform: "scale(1)" },
            },
            [LIT]: {
              fill: accent,
              stroke: accent,
              filter: `drop-shadow(0 0 8px ${accent})`,
              animation: `dotPop 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${ringRepeat}`,
            },
          }}
        />
      </Box>
      <Stack
        sx={{
          position: "absolute",
          left: "50%",
          top: 18,
          width: 170,
          alignItems: "center",
          transform: "translateX(-50%)",
          [COMPACT_MEDIA]: isBelowRail ? { top: "auto", bottom: 14, width: 64 } : { top: 14, width: 64 },
        }}
      >
        <Typography
          variant="label"
          sx={{
            textTransform: "none",
            letterSpacing: "0.12em",
            color: "text.disabled",
            fontSize: point.isDestination ? 20 : 16,
            transition: "color 0.35s ease, text-shadow 0.5s ease",
            [LIT]: {
              color: point.isDestination ? Palette.GOLD : Palette.ICE,
              textShadow: point.isDestination ? `0 0 16px ${alpha(Palette.GOLD, 0.7)}` : "none",
            },
            [COMPACT_MEDIA]: { fontSize: point.isDestination ? 16 : 13 },
          }}
        >
          {point.year}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            textAlign: "center",
            color: point.isDestination ? "text.primary" : "text.secondary",
            opacity: 0,
            transform: "translateY(6px)",
            transition: "opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s",
            [LIT]: { opacity: 1, transform: "translateY(0)" },
            [COMPACT_MEDIA]: { display: "none" },
          }}
        >
          {point.label}
        </Typography>
      </Stack>
    </Box>
  );
};
