import { useRef, type ReactElement } from "react";
import { Box } from "@mui/material";
import { useStarField } from "@/common/hooks/useStarField";

/** Full-viewport canvas sky: layered parallax stars, twinkle and the odd shooting star. Purely decorative. */
export const StarField = (): ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useStarField(canvasRef);

  return (
    <Box
      component="canvas"
      ref={canvasRef}
      aria-hidden
      sx={{
        position: "fixed",
        inset: 0,
        display: "block",
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};
