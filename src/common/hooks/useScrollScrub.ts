import { useEffect, useRef } from "react";
import { subscribeScrub, type ScrubFrame } from "@/common/helpers/scrollScrubber";

/** Runs `onFrame` on the shared rAF loop. The callback may write DOM/canvas directly; it must never set React state. */
export const useScrollScrub = (onFrame: (frame: ScrubFrame) => void): void => {
  const latest = useRef(onFrame);
  latest.current = onFrame;
  useEffect(() => subscribeScrub((frame) => latest.current(frame)), []);
};
