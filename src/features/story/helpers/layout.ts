import type { SxProps, Theme } from "@mui/material/styles";
import { NARROW_MEDIA } from "@/common/helpers/viewport";

// The breakpoint itself lives in common/ (the presenter navigation needs it too); scenes import it from here.
export { NARROW_MAX_WIDTH, NARROW_MEDIA, WIDE_MEDIA, isNarrowViewport } from "@/common/helpers/viewport";

/**
 * Height of a full-screen sticky stage. Phones use the *small* viewport height so the bottom of the stage
 * (facts, captions, the render) never hides behind the browser's address bar.
 */
export const STAGE_HEIGHT_SX: SxProps<Theme> = {
  height: "100vh",
  [NARROW_MEDIA]: { "@supports (height: 100svh)": { height: "100svh" } },
};
