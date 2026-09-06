import { useRef, type RefObject } from "react";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useRevealOnce } from "@/features/story/hooks/useRevealOnce";

export interface VideoSceneRefs {
  sectionRef: RefObject<HTMLElement | null>;
  notesRef: RefObject<HTMLDivElement | null>;
  quoteRef: RefObject<HTMLDivElement | null>;
}

/** The brain of scene 9: one-shot reveals around the embedded player. */
export const useVideoScene = (): VideoSceneRefs => {
  const reducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useRevealOnce([notesRef, quoteRef], reducedMotion);

  return { sectionRef, notesRef, quoteRef };
};
