import { useRef, type ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import { withAlpha } from "@/common/helpers/color";
import { useProgressComet } from "@/common/hooks/useProgressComet";
import { Palette } from "@/common/models/palette";

const RAIL_HEIGHT = "72vh"; // the head travels exactly this far, so both places must use the same value
const HEAD_SIZE_PX = 10;
const TRAIL_HEIGHT_PX = 40;

export interface ProgressCometProps {
  startLabel: string;
  endLabel: string;
}

/** Right-hand rail: a comet head riding the page scroll between the two year labels. */
export const ProgressComet = ({ startLabel, endLabel }: ProgressCometProps): ReactElement => {
  const railRef = useRef<HTMLDivElement>(null);
  useProgressComet(railRef);

  return (
    <Box
      ref={railRef}
      aria-hidden
      sx={{
        position: "fixed",
        right: 28,
        top: "14vh",
        width: "2px",
        height: RAIL_HEIGHT,
        zIndex: 5,
        pointerEvents: "none",
        borderRadius: "1px",
        backgroundColor: Palette.ICE_LINE,
        display: "none",
        "@media (min-width: 760px)": { display: "block" },
      }}
    >
      <Typography
        variant="label"
        sx={{ position: "absolute", left: "50%", top: -26, transform: "translateX(-50%)", color: Palette.ICE_FAINT, whiteSpace: "nowrap" }}
      >
        {startLabel}
      </Typography>

      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: "2px",
          height: TRAIL_HEIGHT_PX,
          borderRadius: "1px",
          opacity: "var(--v, 0)",
          background: `linear-gradient(to top, ${withAlpha(Palette.COMET, 0.85)}, ${withAlpha(Palette.COMET, 0)})`,
          transform: `translate(-50%, -100%) translateY(calc(var(--p, 0) * ${RAIL_HEIGHT}))`,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: HEAD_SIZE_PX,
          height: HEAD_SIZE_PX,
          borderRadius: "50%",
          background: `radial-gradient(circle at 50% 50%, ${Palette.ICE} 0%, ${Palette.COMET} 65%)`,
          boxShadow: `0 0 10px ${withAlpha(Palette.COMET, 0.9)}, 0 0 26px ${withAlpha(Palette.COMET, 0.45)}`,
          transform: `translate(-50%, -50%) translateY(calc(var(--p, 0) * ${RAIL_HEIGHT}))`,
        }}
      />

      <Typography
        variant="label"
        sx={{ position: "absolute", left: "50%", bottom: -26, transform: "translateX(-50%)", color: Palette.ICE_FAINT, whiteSpace: "nowrap" }}
      >
        {endLabel}
      </Typography>
    </Box>
  );
};
