// Scene 12 — "Cierre" + the "Preguntas" ending (guion.md, Diapo 12).
import { hashNoise } from "@/common/helpers/math";

export const CLOSING_SECTION_LABEL = "Cierre y preguntas";

// --- Phase A: the end roll -------------------------------------------------
export const CLOSING_END_ROLL = "End roll del Budokan: el público canta «comet» a capela.";
/** The audience carrying her back is the human beat: SAKURA. */
export const CLOSING_END_ROLL_CAPTION = "Ella los cargó durante años. Esa noche, ellos la cargaron a ella.";
export const CHORUS_WORD = "comet";

export interface CrowdDotViewModel {
  id: string;
  /** Deterministic stagger so the crowd never sways in lockstep. */
  delay: string;
}

const CROWD_DOT_COUNT = 40;

export const crowdDots: CrowdDotViewModel[] = Array.from({ length: CROWD_DOT_COUNT }, (_unused, index) => ({
  id: `dot-${index}`,
  delay: `${(hashNoise(index + 1) * 1.9).toFixed(2)}s`,
}));

// --- Phase B: the final thought -------------------------------------------
export type ClosingWordTone = "plain" | "comet" | "sakura";

export interface ClosingWordViewModel {
  text: string;
  tone: ClosingWordTone;
  /** Position across both lines; the hook lights words in this order. */
  index: number;
}

export interface ClosingLineViewModel {
  id: string;
  words: ClosingWordViewModel[];
}

const CLOSING_THOUGHT_LINES = [
  "Un cometa no brilla porque nunca se desintegró: brilla porque siguió su órbita a pesar de la fricción.",
  "El rechazo no es el final de la trayectoria… es solo el punto donde la trayectoria aún no se ha completado.",
] as const;

const COMET_WORDS = new Set(["brilla", "órbita", "fricción."]);
const SAKURA_WORDS = new Set(["rechazo"]);

const toneOf = (text: string): ClosingWordTone => {
  if (COMET_WORDS.has(text)) return "comet";
  if (SAKURA_WORDS.has(text)) return "sakura";
  return "plain";
};

/** Splits both lines into words keeping punctuation, so keyword matching stays exact. */
export const buildClosingLines = (): ClosingLineViewModel[] => {
  let running = 0;
  return CLOSING_THOUGHT_LINES.map((line, lineIndex) => ({
    id: `line-${lineIndex}`,
    words: line.split(" ").map((text) => ({ text, tone: toneOf(text), index: running++ })),
  }));
};

export const CLOSING_WORD_COUNT = CLOSING_THOUGHT_LINES.reduce(
  (total, line) => total + line.split(" ").length,
  0,
);

// --- Phase C: thanks and questions ----------------------------------------
export const CLOSING_THANKS = "Muchas gracias.";
export const CLOSING_QUESTIONS = "¿Preguntas?";
export const CLOSING_ECHO =
  "¿Qué se necesita para pasar de ser una artista independiente rechazada a llenar el legendario Nippon Budokan?";
export const CLOSING_JP = "星街すいせい";
export const CLOSING_SIGNATURE = "Hoshimachi Suisei · 2018 → 2026";

// --- Pacing, in sticky-progress units (p = 0 at section top, 1 at its bottom)
export const CHORUS_PHASE = { start: 0.05, end: 0.35 } as const;
export const THOUGHT_PHASE = { start: 0.42, end: 0.74 } as const;
/** Above this progress the chorus is gone and phase B owns the stage. */
export const END_ROLL_UNTIL = 0.4;
