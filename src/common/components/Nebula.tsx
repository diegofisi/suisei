import type { ReactElement } from "react";
import { Box } from "@mui/material";
import { withAlpha } from "@/common/helpers/color";
import { Palette } from "@/common/models/palette";

const cloudOf = (color: string, peakAlpha: number): string =>
  `radial-gradient(circle at 50% 50%, ${withAlpha(color, peakAlpha)} 0%, ${withAlpha(color, peakAlpha * 0.45)} 38%, ${withAlpha(color, 0)} 70%)`;

// Screen blending keeps the clouds additive: they lift the sky, they never darken text behind them.
const cloudBase = {
  position: "absolute" as const,
  borderRadius: "50%",
  mixBlendMode: "screen" as const,
  willChange: "transform",
};

/** Three slow blurred colour fields behind the sky. CSS-only: transform loops, no scroll work. */
export const Nebula = (): ReactElement => (
  <Box
    aria-hidden
    sx={{
      position: "fixed",
      inset: 0,
      zIndex: 0,
      pointerEvents: "none",
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        ...cloudBase,
        top: "-22vw",
        right: "-16vw",
        width: "68vw",
        height: "62vw",
        filter: "blur(56px)",
        background: cloudOf(Palette.COMET, 0.22),
        animation: "nebulaComet 52s ease-in-out infinite alternate",
        "@keyframes nebulaComet": {
          from: { transform: "translate3d(0, 0, 0) scale(1)" },
          to: { transform: "translate3d(-4vw, 3vh, 0) scale(1.12)" },
        },
      }}
    />
    <Box
      sx={{
        ...cloudBase,
        bottom: "-24vw",
        left: "-18vw",
        width: "62vw",
        height: "58vw",
        filter: "blur(60px)",
        background: cloudOf(Palette.SAKURA, 0.16),
        animation: "nebulaSakura 64s ease-in-out infinite alternate",
        "@keyframes nebulaSakura": {
          from: { transform: "translate3d(0, 0, 0) scale(1.06)" },
          to: { transform: "translate3d(5vw, -4vh, 0) scale(1)" },
        },
      }}
    />
    <Box
      sx={{
        ...cloudBase,
        top: "38%",
        left: "26%",
        width: "34vw",
        height: "28vw",
        filter: "blur(48px)",
        background: cloudOf(Palette.GOLD, 0.07),
        animation: "nebulaGold 44s ease-in-out infinite alternate",
        "@keyframes nebulaGold": {
          from: { transform: "translate3d(-3vw, 2vh, 0) scale(0.94)" },
          to: { transform: "translate3d(4vw, -3vh, 0) scale(1.1)" },
        },
      }}
    />
  </Box>
);
