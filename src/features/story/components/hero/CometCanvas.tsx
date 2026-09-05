import type { Ref } from "react";
import { Box } from "@mui/material";

export interface CometCanvasProps {
  canvasRef: Ref<HTMLCanvasElement>;
}

/** WebGL surface for the volumetric comet; sits under the particle canvas. */
export const CometCanvas = ({ canvasRef }: CometCanvasProps) => (
  <Box
    component="canvas"
    ref={canvasRef}
    sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
  />
);
