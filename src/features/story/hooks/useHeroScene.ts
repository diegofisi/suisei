import { useRef, type RefObject } from "react";
import { stickyProgressOf } from "@/common/helpers/scrollScrubber";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useScrollScrub } from "@/common/hooks/useScrollScrub";
import { useCometShader } from "@/features/story/hooks/useCometShader";
import { useSignatureParticles } from "@/features/story/hooks/useSignatureParticles";

export interface HeroScene {
  sectionRef: RefObject<HTMLElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  cometRef: RefObject<HTMLCanvasElement | null>;
}

/** Brain of scene 1: turns scroll into `--p` on the section and into comet + particle frames. */
export const useHeroScene = (): HeroScene => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cometRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();
  const particles = useSignatureParticles(canvasRef, reducedMotion);
  const comet = useCometShader(cometRef, reducedMotion);
  const lastProgress = useRef(-1);

  useScrollScrub(({ viewportHeight, time }) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const progress = stickyProgressOf(section, viewportHeight);
    if (progress !== lastProgress.current) {
      section.style.setProperty("--p", progress.toFixed(4));
      lastProgress.current = progress;
    }
    // Nothing to paint while the stage is off screen.
    if (rect.bottom <= 0 || rect.top >= viewportHeight) return;
    comet.render(progress, time);
    particles.render(progress, time);
  });

  return { sectionRef, canvasRef, cometRef };
};
