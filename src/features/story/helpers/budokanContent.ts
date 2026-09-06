// Scene 8 — "El momento: Budokan «SuperNova» (01/02/2025)". The only GOLD scene of the page.
// Facts and setlist come from guion.md (Diapo 8) and CLAUDE.md §4.
import type { FactViewModel } from "@/features/story/interfaces/StoryViewModels";

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

/** One frame of the concert wall; `span: 2` tiles take a 2×2 cell. */
export interface ConcertTileViewModel {
  src: string;
  alt: string;
  span: 1 | 2;
}

/** Fifteen frames of SuperNova, from the carriage entrance to the thank-you screen. */
export const CONCERT_TILES: ConcertTileViewModel[] = [
  { src: "concert/concert-01.jpg", alt: "La carroza dorada baja desde el techo del Budokan", span: 2 },
  { src: "concert/concert-02.jpg", alt: "Escenario con el cartel BOBBIDI y el público con luces", span: 1 },
  { src: "concert/concert-03.jpg", alt: "Suisei con el brazo en alto", span: 1 },
  { src: "concert/concert-04.jpg", alt: "Suisei ante el telón de letras", span: 1 },
  { src: "concert/concert-05.jpg", alt: "La carroza en lo alto del escenario", span: 1 },
  { src: "concert/concert-06.jpg", alt: "Suisei entre haces de luz roja", span: 1 },
  { src: "concert/concert-07.jpg", alt: "Silueta bajo la luz azul", span: 1 },
  { src: "concert/concert-08.jpg", alt: "Suisei con capa negra y micrófono", span: 1 },
  { src: "concert/concert-09.jpg", alt: "Primer plano con luz dorada", span: 1 },
  { src: "concert/concert-10.jpg", alt: "Las bailarinas y el número 2025", span: 1 },
  { src: "concert/concert-11.jpg", alt: "Primer plano con el traje indie rediseñado", span: 1 },
  { src: "concert/concert-12.jpg", alt: "Suisei en el centro del escenario", span: 1 },
  { src: "concert/concert-13.jpg", alt: "Suisei guiña un ojo con el micrófono", span: 2 },
  { src: "concert/concert-14.jpg", alt: "Suisei sonríe con el brazo en alto", span: 1 },
  { src: "concert/concert-15.jpg", alt: "Pantalla final: SuperNova, gracias por venir", span: 1 },
];
export const BUDOKAN_CREDIT = "Capturas del concierto «SuperNova» © COVER Corp.";

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
export const BUDOKAN_BRIDGE_NOTE = "";

// Scene pacing, in sticky-progress units (p = 0 at section top, 1 at its bottom).
// The components mirror these numbers as CSS clamp() windows on --p.
export const YEAR_FILL_PHASE = { start: 0, end: 0.15 } as const;
export const COLLAGE_PHASE = { start: 0.36, end: 0.62 } as const;
/** p at which the facts list starts its staggered reveal (step 1). */
export const FACTS_REVEAL_AT = 0.18;
/** p at which the bridge pull quote reveals (step 4). */
export const BRIDGE_REVEAL_AT = 0.9;
/** Upper bound of steps 0..3; anything past the last bound is step 4. */
export const BUDOKAN_STEP_BOUNDS: readonly number[] = [0.18, 0.38, 0.72, 0.9];
