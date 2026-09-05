// Scene 8 — "El momento: Budokan «SuperNova» (01/02/2025)". The only GOLD scene of the page.
// Facts and setlist come from guion.md (Diapo 8) and CLAUDE.md §4.
import type { FactViewModel, TimelinePointViewModel } from "@/features/story/interfaces/StoryViewModels";

export const BUDOKAN_YEAR = "2025";
export const BUDOKAN_DATELINE = "01 · 02 · 2025 — Nippon Budokan";
export const BUDOKAN_TITLE = "SuperNova";
export const BUDOKAN_LEAD =
  "La catedral del rock japonés, donde tocaron los Beatles. Ella anunció ese sueño en su primer video, en 2018, cuando nadie la veía. Siete años después… lo estaba haciendo.";

export const BUDOKAN_FACTS: FactViewModel[] = [
  {
    id: "opening",
    tone: "comet",
    parts: [
      { text: "Abrió con " },
      { text: "«Bibbidiba»", strong: true },
      { text: " bajando en una carroza desde el techo." },
    ],
  },
  {
    id: "first-vtuber",
    tone: "comet",
    parts: [
      { text: "Primera VTuber", strong: true },
      { text: " en llenar el Budokan con un concierto solista." },
    ],
  },
  {
    id: "forbes",
    tone: "comet",
    parts: [
      { text: "Forbes Japan " },
      { text: "30 Under 30 · 2025", strong: true },
      { text: "." },
    ],
  },
];

/** The interlude video: she walks through her successive outfits, then the tape rewinds to 2018. */
export const BUDOKAN_REWIND_FRAMES: TimelinePointViewModel[] = [
  { year: "2018", label: "Debut indie", image: "img/2018-03_indie-original.png", isDestination: false },
  { year: "2019", label: "hololive", image: "img/2019-12_hololive-default.png", isDestination: false },
  { year: "2020", label: "甘辛ミックス", image: "img/2020-11_hololive-2nd-amakara.png", isDestination: false },
  { year: "2021", label: "1st Live", image: "img/2021-10_stellar-into-the-galaxy.png", isDestination: false },
  { year: "2023", label: "2nd Live", image: "img/2023-01_shout-in-crisis.png", isDestination: false },
  { year: "2024", label: "Traje oriental", image: "img/2024-03_oriental-suit.png", isDestination: false },
  { year: "2025", label: "comet · Budokan", image: "img/2025-02_budokan-comet.png", isDestination: true },
];

export const REWIND_LABEL = "◀◀ 2018";
export const BUDOKAN_CREDIT = "Renders generados a partir de los diseños © COVER Corp. · uso en clase";

export const DREAM_QUOTE = "«¡Mi sueño es hacer un concierto en el Budokan!»";
export const DREAM_QUOTE_SOURCE = "Hoshimachi Suisei, 2018 · ~7 años antes de esa noche";
export const DREAM_QUOTE_TEARS = "La cámara la captó llorando.";

export const COMET_NOTE =
  "M13 «comet -TAKU INOUE Remix-» — estrena el traje indie rediseñado. Canta llorando.";

export const DOME_LEAD =
  "Cerca del final preguntó: «Ya cumplí mi sueño del Budokan… ¿cuál es el siguiente?». Y todo el recinto gritó:";
export const DOME_SHOUT = "¡¡TOKIO DOME!!";
export const DOME_CAPTION = "El público, al unísono.";

export const BUDOKAN_BRIDGE_QUOTE =
  "«Pero el momento más importante de esa noche… es el que les voy a mostrar ahora.»";
export const BUDOKAN_BRIDGE_NOTE = "Escena 9: el video.";

// Scene pacing, in sticky-progress units (p = 0 at section top, 1 at its bottom).
// The components mirror these numbers as CSS clamp() windows on --p.
export const YEAR_FILL_PHASE = { start: 0, end: 0.15 } as const;
export const REWIND_PHASE = { start: 0.38, end: 0.6 } as const;
/** p at which the facts list starts its staggered reveal (step 1). */
export const FACTS_REVEAL_AT = 0.18;
/** p at which the 2025 frame lights up again in gold (M13 "comet"). */
export const COMET_RELIGHT_AT = 0.66;
/** Rewind fraction at which the 2018 frame takes focus and grows. */
export const FRAME_FOCUS_AT = 0.88;
/** p at which the bridge pull quote reveals (step 4). */
export const BRIDGE_REVEAL_AT = 0.9;
/** Upper bound of steps 0..3; anything past the last bound is step 4. */
export const BUDOKAN_STEP_BOUNDS: readonly number[] = [0.18, 0.38, 0.72, 0.9];
