import { Box } from "@mui/material";
import { alpha, keyframes } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import { ignitedSelector } from "@/features/story/helpers/accelerationContent";

/** Short, irregular pulse so the plume reads as fire rather than as a progress bar. */
const flicker = keyframes({
  "0%": { opacity: 0.5, transform: "scaleY(0.72)" },
  "34%": { opacity: 1, transform: "scaleY(1.24)" },
  "62%": { opacity: 0.72, transform: "scaleY(0.92)" },
  "100%": { opacity: 0.95, transform: "scaleY(1.12)" },
});

interface StageExhaustProps {
  /** Stage this plume belongs to (1-based). */
  stageNumber: number;
}

/** The burning plume under an ignited stage: white-hot core fading into comet blue. */
export const StageExhaust = ({ stageNumber }: StageExhaustProps) => (
  <Box
    aria-hidden
    sx={{
      height: 26,
      marginTop: "0.25rem",
      display: "grid",
      placeItems: "center",
    }}
  >
    <Box
      sx={{
        width: "8%",
        height: "100%",
        borderRadius: "0 0 70% 70% / 0 0 90% 90%",
        transformOrigin: "top center",
        transform: "scaleY(0.2)",
        opacity: 0,
        filter: "blur(3px)",
        transition: "opacity 0.4s ease",
        background: `linear-gradient(180deg, ${alpha(Palette.ICE, 0.92)} 0%, ${Palette.COMET} 34%, ${alpha(
          Palette.COMET,
          0,
        )} 100%)`,
        [ignitedSelector(stageNumber)]: {
          opacity: 1,
          animation: `${flicker} 260ms ease-in-out infinite alternate`,
        },
      }}
    />
  </Box>
);
