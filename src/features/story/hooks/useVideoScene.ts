import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useRevealOnce } from "@/features/story/hooks/useRevealOnce";

export interface VideoSceneRefs {
  sectionRef: RefObject<HTMLElement | null>;
  /** Player root; carries `data-missing` when the mp4 is not there yet. */
  playerRef: RefObject<HTMLDivElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  notesRef: RefObject<HTMLDivElement | null>;
  quoteRef: RefObject<HTMLDivElement | null>;
}

/** The brain of scene 9: one-shot reveals plus the missing-file guard for the local clip. */
export const useVideoScene = (): VideoSceneRefs => {
  const reducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useRevealOnce([notesRef, quoteRef], reducedMotion);

  // The mp4 is dropped in by hand before the talk; if it is missing the player says so instead of showing a black box.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const markMissing = () => {
      const player = playerRef.current;
      if (player && player.dataset.missing !== "true") player.dataset.missing = "true";
    };
    // The error may have fired before this effect ran (cached 404).
    if (video.error) markMissing();
    video.addEventListener("error", markMissing);
    return () => video.removeEventListener("error", markMissing);
  }, []);

  return { sectionRef, playerRef, videoRef, notesRef, quoteRef };
};
