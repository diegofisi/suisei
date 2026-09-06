// Scene 7 — "La consolidación (2022–2024)". Copy from guion.md (Diapo 7); concert data from CLAUDE.md §4.
// The guion marks this slide as trimmable, so the scene stays compact: a grid of small milestones.
import type { ClipViewModel, FactFragment } from "@/features/story/interfaces/StoryViewModels";

export const CONSOLIDATION_LABEL = "La consolidación, 2022–2024";


export const CONSOLIDATION_HEADLINE = "El cometa se vuelve constante";

export const CONSOLIDATION_CREDIT =
  "Renders generados a partir de los diseños © COVER Corp.";

export const CONSOLIDATION_QUOTE =
  "«Y entonces… llegó el momento que ella había estado esperando desde su primer video.»";

export const CONSOLIDATION_QUOTE_NOTE = "";

/** A tile of the milestone grid: a date on top, the fact below. */
export interface MilestoneViewModel {
  id: string;
  date: string;
  parts: FactFragment[];
}

export const consolidationMilestones: MilestoneViewModel[] = [
  {
    id: "first-take",
    date: "Ene. 2023",
    parts: [{ text: "Primera VTuber en " }, { text: "THE FIRST TAKE", strong: true }, { text: "." }],
  },
  {
    id: "specter",
    date: "2023",
    parts: [
      { text: "Segundo álbum, " },
      { text: "«Specter»", strong: true },
      { text: "; " },
      { text: "2 M de suscriptores", strong: true },
      { text: " (sept. 2023)." },
    ],
  },
  {
    id: "bibbidiba",
    date: "Mar. 2024",
    parts: [
      { text: "«Bibbidiba»: " },
      { text: "100 M de reproducciones", strong: true },
      { text: " en 7 meses y 24 días." },
    ],
  },
  {
    id: "shibuya",
    date: "Sept. 2024",
    parts: [{ text: "Live callejero en " }, { text: "Shibuya", strong: true }, { text: "." }],
  },
  {
    id: "countdown-japan",
    date: "Dic. 2024",
    parts: [{ text: "COUNTDOWN JAPAN", strong: true }, { text: "." }],
  },
  {
    id: "spectra-of-nova",
    date: "Nov.–dic. 2024",
    parts: [
      { text: "Gira " },
      { text: "«Spectra of Nova»", strong: true },
      { text: ": 14/11 Saitama Super Arena (14.000+ por noche), 10/12 Osaka, 28/12 Fukuoka." },
    ],
  },
];
// Order = stacking order in the fan: the last card lands centred on top, so the
// 2024 render closes the scene the way the Budokan outfit will open the next one.
export const consolidationClips: ClipViewModel[] = [
  {
    id: "shout-in-crisis",
    image: "img/2023-01_shout-in-crisis.png",
    imageAlt: "Traje del segundo concierto en solitario, Shout in Crisis",
    title: "2nd Solo Live «Shout in Crisis»",
    source: "28/01/2023 · TOKYO GARDEN THEATER",
    tag: "2023",
  },
  {
    id: "bibbidiba",
    imageAlt: "",
    body: "100 M\nen 7 meses y 24 días",
    title: "«Bibbidiba»",
    source: "Lanzada en marzo de 2024 · Bronce en los Clio Music 2025",
    tag: "2024",
  },
  {
    id: "oriental-suit",
    image: "img/2024-03_oriental-suit.png",
    imageAlt: "Traje oriental negro y dorado, octavo modelo 2D",
    title: "Traje oriental, 8.º modelo",
    source: "15/03/2024",
    tag: "2024",
  },
];

/** The two character renders: shown whole, not cropped. */
export const CONSOLIDATION_PORTRAIT_CLIP_IDS: readonly string[] = ["shout-in-crisis", "oriental-suit"];
