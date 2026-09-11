import { useRef, type ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import { withAlpha } from "@/common/helpers/color";
import { useProgressComet } from "@/common/hooks/useProgressComet";
import { Palette } from "@/common/models/palette";

const RAIL_HEIGHT = "72vh"; // the head travels exactly this far, so both places must use the same value
const HEAD_SIZE_PX = 10;
const TRAIL_HEIGHT_PX = 40;
/** Invisible grab zone around the 2px line, so the rail is easy to hit with a mouse. */
const HIT_WIDTH_PX = 28;

const DRAGGING = '&[data-dragging="true"]';

export interface ProgressCometProps {
  startLabel: string;
  endLabel: string;
}

/**
 * Right-hand rail: a comet head riding the page scroll between the two year labels. It is also a scrollbar:
 * click anywhere on it to glide there, drag the head to scroll, arrows when focused (see useProgressComet).
 */
export const ProgressComet = ({ startLabel, endLabel }: ProgressCometProps): ReactElement => {
  const railRef = useRef<HTMLDivElement>(null);
  useProgressComet(railRef);

  return (
    <Box
      ref={railRef}
      role="slider"
      tabIndex={0}
      aria-label="Posición en la página"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      data-scroll-rail
      data-dragging="false"
      sx={{
        position: "fixed",
        right: 28,
        top: "14vh",
        width: "2px",
        height: RAIL_HEIGHT,
        zIndex: 5,
        borderRadius: "1px",
        backgroundColor: Palette.ICE_LINE,
        cursor: "pointer",
        touchAction: "none",
        outline: "none",
        transition: "background-color 0.3s ease",
        display: "none",
        "@media (min-width: 760px)": { display: "block" },
        // The grab zone: wider than the line, spanning it with room above and below the labels.
        "&::before": {
          content: '""',
          position: "absolute",
          left: "50%",
          top: -8,
          bottom: -8,
          width: HIT_WIDTH_PX,
          transform: "translateX(-50%)",
        },
        "&:hover, &:focus-visible": { backgroundColor: withAlpha(Palette.ICE, 0.28) },
        [DRAGGING]: { cursor: "grabbing", backgroundColor: withAlpha(Palette.COMET, 0.5) },
        "&:focus-visible [data-head]": { boxShadow: `0 0 0 3px ${withAlpha(Palette.COMET, 0.45)}, 0 0 14px ${withAlpha(Palette.COMET, 0.9)}` },
      }}
    >
      <Typography
        variant="label"
        aria-hidden
        sx={{ position: "absolute", left: "50%", top: -26, transform: "translateX(-50%)", color: Palette.ICE_FAINT, whiteSpace: "nowrap", pointerEvents: "none" }}
      >
        {startLabel}
      </Typography>

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: "2px",
          height: TRAIL_HEIGHT_PX,
          borderRadius: "1px",
          opacity: "var(--v, 0)",
          pointerEvents: "none",
          background: `linear-gradient(to top, ${withAlpha(Palette.COMET, 0.85)}, ${withAlpha(Palette.COMET, 0)})`,
          transform: `translate(-50%, -100%) translateY(calc(var(--p, 0) * ${RAIL_HEIGHT}))`,
        }}
      />

      <Box
        data-head
        aria-hidden
        sx={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: HEAD_SIZE_PX,
          height: HEAD_SIZE_PX,
          borderRadius: "50%",
          cursor: "grab",
          background: `radial-gradient(circle at 50% 50%, ${Palette.ICE} 0%, ${Palette.COMET} 65%)`,
          boxShadow: `0 0 10px ${withAlpha(Palette.COMET, 0.9)}, 0 0 26px ${withAlpha(Palette.COMET, 0.45)}`,
          transform: `translate(-50%, -50%) translateY(calc(var(--p, 0) * ${RAIL_HEIGHT}))`,
          // The head grows under the hand; the ride itself follows --p with no easing, so it never lags the page.
          "&::after": {
            content: '""',
            position: "absolute",
            inset: -4,
            borderRadius: "50%",
            border: `1px solid ${withAlpha(Palette.COMET, 0.6)}`,
            opacity: 0,
            transform: "scale(0.7)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
          },
          "[data-scroll-rail]:hover &::after": { opacity: 1, transform: "scale(1)" },
          '[data-dragging="true"] &': { cursor: "grabbing" },
          '[data-dragging="true"] &::after': { opacity: 1, transform: "scale(1.5)" },
        }}
      />

      <Typography
        variant="label"
        aria-hidden
        sx={{ position: "absolute", left: "50%", bottom: -26, transform: "translateX(-50%)", color: Palette.ICE_FAINT, whiteSpace: "nowrap", pointerEvents: "none" }}
      >
        {endLabel}
      </Typography>
    </Box>
  );
};
