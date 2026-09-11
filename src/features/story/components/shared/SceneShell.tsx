import type { ReactNode, Ref } from "react";
import { Box, Stack } from "@mui/material";
import { NARROW_MEDIA, WIDE_MEDIA } from "@/features/story/helpers/layout";

interface SceneShellProps {
  sectionRef: Ref<HTMLElement>;
  /** Accessible name of the section, in Spanish. */
  label: string;
  left: ReactNode;
  /** Optional second column (clips, cards); without it the text column takes the full width, capped at 72ch. */
  right?: ReactNode;
  /**
   * Optional closing block. On wide screens it sits under the text column (the visual column runs beside both);
   * under 760px it comes last, after the visual, so the reading order stays text → visual → conclusion.
   */
  tail?: ReactNode;
  /** Swap the columns so the visual sits on the left. */
  mirrored?: boolean;
  /** Presenter "next" presses that reveal something in place (no scroll) before leaving the scene. */
  revealSteps?: number;
}

/** Normal (non-sticky) scene frame: a text column plus an optional visual column; single column under 760px. */
export const SceneShell = ({ sectionRef, label, left, right, tail, mirrored = false, revealSteps }: SceneShellProps) => {
  const textColumn = mirrored ? 2 : 1;
  const visualColumn = mirrored ? 1 : 2;
  return (
    <Box
      component="section"
      ref={sectionRef}
      aria-label={label}
      data-reveal-steps={revealSteps}
      data-presenter-step="0"
      sx={{
        position: "relative",
        // Never shorter than the screen: the next scene must not peek in under a short one.
        minHeight: "100vh",
        padding: "clamp(56px, 10vh, 130px) 7vw clamp(48px, 8vh, 110px)",
        display: "grid",
        gridTemplateColumns: right
          ? mirrored
            ? "minmax(300px, 44%) minmax(0, 1fr)"
            : "minmax(0, 1fr) minmax(300px, 44%)"
          : "minmax(0, 72ch)",
        gap: "6vw",
        alignItems: "start",
        ["@media (max-height: 900px)"]: { paddingTop: "48px", paddingBottom: "40px" },
        ["@media (max-height: 780px)"]: { paddingTop: "36px", paddingBottom: "32px" },
        [NARROW_MEDIA]: {
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: "8vh",
        },
      }}
    >
      <Stack sx={{ minWidth: 0, [WIDE_MEDIA]: right ? { gridColumn: textColumn, gridRow: 1 } : {} }}>{left}</Stack>
      {right && (
        <Box
          sx={{
            minWidth: 0,
            [WIDE_MEDIA]: { gridColumn: visualColumn, gridRow: tail ? "1 / span 2" : 1 },
            [NARROW_MEDIA]: { order: mirrored ? -1 : 0 },
          }}
        >
          {right}
        </Box>
      )}
      {tail && <Box sx={{ minWidth: 0, [WIDE_MEDIA]: { gridColumn: right ? textColumn : 1, gridRow: 2 } }}>{tail}</Box>}
    </Box>
  );
};
