// Scene 6 — "La aceleración (2020–2021)": the three-stage rocket.
// Every figure comes from guion.md (Diapo 6); the concert line comes from CLAUDE.md §4.
import type { FactViewModel } from "@/features/story/interfaces/StoryViewModels";

export const ACCELERATION_EYEBROW = "Escena 6 · 2020–2021";

export const ACCELERATION_HEADLINE = "Un cohete de tres etapas";

/** Scroll length of the tall sticky section. */
export const ACCELERATION_SECTION_HEIGHT = "340vh";

/** Scene progress (--p) at which each stage ignites; index 0 = stage 1. */
export const STAGE_IGNITION_POINTS = [0.15, 0.45, 0.75] as const;

export const ROCKET_STAGE_COUNT = STAGE_IGNITION_POINTS.length;

/** Scene progress at which the closing pull quote reveals. */
export const ACCELERATION_QUOTE_POINT = 0.85;

/** Duration of a one-shot counter count-up, in ms. */
export const ACCELERATION_COUNT_UP_MS = 1500;

export const ACCELERATION_CREDIT =
  "Renders generados a partir de los diseños © COVER Corp. · uso en clase";

export const ACCELERATION_QUOTE = "«La chica que empezó con seis mil empezó a llenar salas.»";

export const ACCELERATION_QUOTE_NOTE = "Pero el cometa todavía no había terminado de encenderse.";

/**
 * Selector list that matches once the rocket has reached `minStage` (1-based).
 * The hook writes `data-stage="0|1|2|3"` on the scene root, so a stage styles itself
 * with `[data-stage="1"] &, [data-stage="2"] &, [data-stage="3"] &`.
 */
export const ignitedSelector = (minStage: number): string =>
  Array.from(
    { length: ROCKET_STAGE_COUNT - minStage + 1 },
    (_, offset) => `[data-stage="${minStage + offset}"] &`,
  ).join(", ");

export interface RocketStageViewModel {
  id: string;
  /** 1-based position from the bottom of the rocket; also the data-stage value that ignites it. */
  stageNumber: number;
  /** Uppercase eyebrow, e.g. "Etapa 1". */
  stageLabel: string;
  year: string;
  title: string;
  facts: FactViewModel[];
}

export interface StageCounterViewModel {
  id: string;
  target: number;
  caption: string;
  /** Counts up as soon as this stage ignites. */
  stageNumber: number;
}

export interface AccelerationRenderViewModel {
  id: string;
  /** Path relative to the page. */
  image: string;
  imageAlt: string;
  tag: string;
  /** Fades in once the rocket has reached this stage. */
  stageNumber: number;
}

/**
 * Spanish thousands separator ("55.000", "1.000.000"). Written by hand instead of Intl
 * because grouping is locale-flaky for short numbers and this must never change shape.
 */
export const formatCount = (value: number): string =>
  Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/** Bottom to top: stage 1 fires first. */
export const accelerationStages: RocketStageViewModel[] = [
  {
    id: "debut-3d",
    stageNumber: 1,
    stageLabel: "Etapa 1",
    year: "2020",
    title: "Despegue: el debut 3D",
    facts: [
      {
        id: "debut-3d-live",
        tone: "comet",
        parts: [
          { text: "01 / 03 / 2020 — " },
          { text: "Debut 3D", strong: true },
          { text: ": 55.000 personas conectadas en vivo; hashtag #1 mundial en Twitter (dato a verificar)." },
        ],
      },
      {
        id: "next-color-planet",
        tone: "comet",
        parts: [
          { text: "«NEXT COLOR PLANET» (mar. 2020) → " },
          { text: "Top 5 de Oricon", strong: true },
          { text: "." },
        ],
      },
    ],
  },
  {
    id: "ghost-and-million",
    stageNumber: 2,
    stageLabel: "Etapa 2",
    year: "2021",
    title: "Empuje: el número uno y el millón",
    facts: [
      {
        id: "ghost",
        tone: "comet",
        parts: [
          { text: "«Ghost» (abr. 2021) → " },
          { text: "#1 del ranking digital diario de Oricon", strong: true },
          { text: "." },
        ],
      },
      {
        id: "one-million",
        tone: "comet",
        parts: [
          { text: "26 / 06 / 2021 — " },
          { text: "1.000.000 de suscriptores", strong: true },
          { text: "." },
        ],
      },
    ],
  },
  {
    id: "album-and-live",
    stageNumber: 3,
    stageLabel: "Etapa 3",
    year: "2021",
    title: "Órbita: álbum y primer concierto",
    facts: [
      {
        id: "still-still-stellar",
        tone: "comet",
        parts: [
          { text: "Sept. 2021 — «Still Still Stellar», " },
          { text: "primer álbum", strong: true },
          { text: "." },
        ],
      },
      {
        id: "stellar-into-the-galaxy",
        tone: "comet",
        parts: [
          { text: "21 / 10 / 2021 — " },
          { text: "primer concierto pagado", strong: true },
          { text: ": 1st Solo Live «STELLAR into the GALAXY», Toyosu PIT." },
        ],
      },
    ],
  },
];

/** Both are milestones, so both are COMET. */
export const accelerationCounters: StageCounterViewModel[] = [
  { id: "debut-viewers", target: 55000, caption: "viewers en el debut 3D", stageNumber: 1 },
  { id: "subscribers", target: 1000000, caption: "suscriptores · 26/06/2021", stageNumber: 2 },
];

export const accelerationRenders: AccelerationRenderViewModel[] = [
  {
    id: "amakara",
    image: "img/2020-11_hololive-2nd-amakara.png",
    imageAlt: "2.º traje de hololive de Suisei, tema dulce-picante",
    tag: "2020 · 2.º traje hololive",
    stageNumber: 1,
  },
  {
    id: "stellar",
    image: "img/2021-10_stellar-into-the-galaxy.png",
    imageAlt: "Traje del primer concierto en solitario STELLAR into the GALAXY",
    tag: "2021 · STELLAR into the GALAXY",
    stageNumber: 3,
  },
];
