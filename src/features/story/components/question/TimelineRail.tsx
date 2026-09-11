import type { Ref, RefObject } from "react";
import { Box } from "@mui/material";
import { Palette } from "@/common/models/palette";
import { TimelinePoint } from "@/features/story/components/question/TimelinePoint";
import { COMPACT_MEDIA } from "@/features/story/helpers/questionContent";
import type { TimelinePointViewModel } from "@/features/story/interfaces/StoryViewModels";

interface TimelineRailProps {
  points: TimelinePointViewModel[];
  rootRef: Ref<HTMLDivElement>;
  pointRefs: RefObject<(HTMLDivElement | null)[]>;
}

/** 2018 -> 2026 rail. --f fades it in, --t draws the comet line and rides the head along its tip. */
export const TimelineRail = ({ points, rootRef, pointRefs }: TimelineRailProps) => (
  <Box
    ref={rootRef}
    data-drawing="false"
    sx={{
      position: "absolute",
      bottom: "13vh",
      left: "50%",
      transform: "translateX(-50%)",
      width: "min(1540px, 90vw)",
      opacity: "var(--f, 0)",
      transition: "opacity 0.45s ease",
      pointerEvents: "none",
      // Two rows of frames on phones (above and below the rail), so the rail sits higher to make room below.
      [COMPACT_MEDIA]: { width: "88vw", bottom: "22vh" },
    }}
  >
    <Box sx={{ position: "relative", height: 16, mx: 4, [COMPACT_MEDIA]: { mx: 3 } }}>
      <Box
        component="svg"
        viewBox="0 0 100 2"
        preserveAspectRatio="none"
        aria-hidden
        sx={{ position: "absolute", left: 0, top: "50%", width: "100%", height: 2, transform: "translateY(-50%)" }}
      >
        <Box component="line" x1={0} y1={1} x2={100} y2={1} sx={{ stroke: Palette.ICE_LINE, strokeWidth: 2 }} />
        <Box
          component="line"
          x1={0}
          y1={1}
          x2={100}
          y2={1}
          pathLength={100}
          sx={{
            stroke: Palette.COMET,
            strokeWidth: 2,
            strokeDasharray: "100px",
            strokeDashoffset: "calc(100px - var(--t, 0) * 100px)",
          }}
        />
      </Box>
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: "50%",
          left: "calc(var(--t, 0) * 100%)",
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: Palette.ICE,
          boxShadow: `0 0 12px 3px ${Palette.COMET}`,
          transform: "translate(-50%, -50%)",
          opacity: 0,
          transition: "opacity 0.3s ease",
          "[data-drawing='true'] &": { opacity: 1 },
        }}
      />
      {points.map((point, index) => (
        <TimelinePoint
          key={point.year}
          point={point}
          index={index}
          count={points.length}
          isBelowRail={index % 2 === 1}
          rootRef={(node) => {
            pointRefs.current[index] = node;
          }}
        />
      ))}
    </Box>
  </Box>
);
