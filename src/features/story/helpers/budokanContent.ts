// Scene 8 — "El momento: Budokan «SuperNova» (01/02/2025)". The only GOLD scene of the page.
// Facts and setlist come from guion.md (Diapo 8) and CLAUDE.md §4.
import type { FactViewModel } from "@/features/story/interfaces/StoryViewModels";

export const BUDOKAN_YEAR = "2025";
export const BUDOKAN_DATELINE = "01 · 02 · 2025 — Nippon Budokan";
export const BUDOKAN_TITLE = "SuperNova";
export const BUDOKAN_LEAD = "";

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

/** One frame of the concert wall. */
export interface ConcertTileViewModel {
  src: string;
  alt: string;
}

/** Fifteen frames of SuperNova, from the carriage entrance to the thank-you screen. */
export const CONCERT_TILES: ConcertTileViewModel[] = [
  { src: "concert/concert-01.jpg", alt: "La carroza dorada baja desde el techo del Budokan" },
  { src: "concert/concert-02.jpg", alt: "Escenario con el cartel BOBBIDI y el público con luces" },
  { src: "concert/concert-03.jpg", alt: "Suisei con el brazo en alto" },
  { src: "concert/concert-04.jpg", alt: "Suisei ante el telón de letras" },
  { src: "concert/concert-05.jpg", alt: "La carroza en lo alto del escenario" },
  { src: "concert/concert-06.jpg", alt: "Suisei entre haces de luz roja" },
  { src: "concert/concert-07.jpg", alt: "Silueta bajo la luz azul" },
  { src: "concert/concert-08.jpg", alt: "Suisei con capa negra y micrófono" },
  { src: "concert/concert-09.jpg", alt: "Primer plano con luz dorada" },
  { src: "concert/concert-10.jpg", alt: "Las bailarinas y el número 2025" },
  { src: "concert/concert-11.jpg", alt: "Primer plano con el traje indie rediseñado" },
  { src: "concert/concert-12.jpg", alt: "Suisei en el centro del escenario" },
  { src: "concert/concert-13.jpg", alt: "Suisei guiña un ojo con el micrófono" },
  { src: "concert/concert-14.jpg", alt: "Suisei sonríe con el brazo en alto" },
  { src: "concert/concert-15.jpg", alt: "Pantalla final: SuperNova, gracias por venir" },
];
export const BUDOKAN_CREDIT = "Capturas del concierto «SuperNova» © COVER Corp.";

export const DOME_LEAD = "«¿Cuál es el siguiente sueño?»";
export const DOME_SHOUT = "¡¡TOKIO DOME!!";
export const DOME_CAPTION = "El público, al unísono.";

// Scene pacing, in sticky-progress units (p = 0 at section top, 1 at its bottom).
// The components mirror these numbers as CSS clamp() windows on --p.
/** The year wipes in once the section top is within this fraction of the viewport height. */
export const YEAR_FILL_PHASE = { start: 0, end: 0.6 } as const;
/** The wall deals itself out (tiles flip open) across this window. */
export const WALL_PHASE = { start: -0.28, end: 0.6 } as const; // negative start: a third of the lids are already open on arrival
/** Each open lid keeps its frame this long (random in range) before closing and reopening on another one. */
export const WALL_HOLD_MIN_MS = 1500;
export const WALL_HOLD_MAX_MS = 2000;
/** p at which the facts list starts its staggered reveal (step 1). */
export const FACTS_REVEAL_AT = 0;
/** Upper bound of steps 0..2; anything past the last bound is step 3. */
export const BUDOKAN_STEP_BOUNDS: readonly number[] = [0.32, 0.62, 0.8];
