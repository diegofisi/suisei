import type { Ref } from "react";
import { Box } from "@mui/material";

export interface SignatureCanvasProps {
  canvasRef: Ref<HTMLCanvasElement>;
}

/** Pure surface: every pixel is drawn by useSignatureParticles. */
export const SignatureCanvas = ({ canvasRef }: SignatureCanvasProps) => (
  <Box
    component="canvas"
    ref={canvasRef}
    sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
  />
);
