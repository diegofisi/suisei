import type { TimelinePointViewModel } from "@/features/story/interfaces/StoryViewModels";

/** One word of the guiding question. Keywords carry the comet color; the last one also glows. */
export interface QuestionWordViewModel {
  text: string;
  isKeyword: boolean;
  hasGlow: boolean;
}

export const QUESTION_SENTENCE =
  "¿Qué se necesita para pasar de ser una artista independiente rechazada… a llenar el legendario Nippon Budokan?";

const QUESTION_KEYWORDS = new Set(["rechazada…", "Nippon", "Budokan?"]);
const GLOWING_WORD = "Budokan?";

/** Splits the sentence into words; tokens keep their punctuation so keyword matching is exact. */
export const buildQuestionWords = (): QuestionWordViewModel[] =>
  QUESTION_SENTENCE.split(" ").map((text) => ({
    text,
    isKeyword: QUESTION_KEYWORDS.has(text),
    hasGlow: text === GLOWING_WORD,
  }));

/** 2018 -> 2026: the whole arc of the talk, one outfit per milestone. */
export const QUESTION_TIMELINE_POINTS: TimelinePointViewModel[] = [
  { year: "2018", label: "Debut indie", image: "img/2018-03_indie-original.png", isDestination: false },
  { year: "2019", label: "hololive", image: "img/2019-12_hololive-default.png", isDestination: false },
  { year: "2020", label: "Debut 3D", image: "img/2020-11_hololive-2nd-amakara.png", isDestination: false },
  { year: "2021", label: "1st Live", image: "img/2021-10_stellar-into-the-galaxy.png", isDestination: false },
  { year: "2023", label: "2nd Live", image: "img/2023-01_shout-in-crisis.png", isDestination: false },
  { year: "2024", label: "Spectra of Nova", image: "img/2024-03_oriental-suit.png", isDestination: false },
  { year: "2025", label: "Budokan", image: "img/2025-02_budokan-comet.png", isDestination: false },
  { year: "2026", label: "Studio STELLAR", image: "img/studio-stellar.jpg", isDestination: true, thumbnailShape: "circle" },
];


// Raw queries: the layout breaks at 760px, not at a theme breakpoint.
export const COMPACT_MEDIA = "@media (max-width: 759px)";

// Scene pacing, in sticky-progress units (p = 0 at section top, 1 at its bottom).
export const WORDS_PHASE = { start: 0, end: 0.55 } as const;
export const TIMELINE_FADE_PHASE = { start: 0.55, end: 0.66 } as const;
export const TIMELINE_DRAW_PHASE = { start: 0.58, end: 0.96 } as const;
