// Scene 4 — "El rechazo y la terquedad" (guion.md, Diapo 4). Static copy only.
import type { FactViewModel } from "@/features/story/interfaces/StoryViewModels";


export const REJECTION_HEADLINE = "Todas pedían lo mismo: dejar de ser ella";

export const rejectionFacts: FactViewModel[] = [
  {
    id: "conditions",
    tone: "sakura",
    parts: [
      { text: "Las agencias pedían " },
      { text: "abandonar el nombre «Hoshimachi Suisei»", strong: true },
      { text: " y re-debutar como otra persona." },
    ],
  },
  {
    id: "refusal",
    tone: "sakura",
    parts: [{ text: "Se negó. " }, { text: "Una y otra vez.", strong: true }],
  },
  {
    // COMET on purpose: hololive is the house that later takes her in (scene 5).
    id: "hololive",
    tone: "comet",
    parts: [
      { text: "Incluso hololive la rechazó", strong: true },
      { text: " en su primera aplicación. Seis mil suscriptores, cien viewers en vivo." },
    ],
  },
  {
    id: "essence",
    tone: "sakura",
    parts: [{ text: "Aun así, " }, { text: "no negoció su esencia", strong: true }, { text: "." }],
  },
];

export const REJECTION_LESSON_NUMBER = "01";
export const REJECTION_LESSON_LABEL = "Lección 1 de resiliencia";
export const REJECTION_LESSON_TEXT =
  "La resiliencia no es aguantar el golpe: es no negociar quién eres a cambio de un atajo.";

/** One curt note from an agency. */
export interface RejectionConditionViewModel {
  id: string;
  text: string;
}

export const rejectionConditions: RejectionConditionViewModel[] = [
  { id: "name", text: "Cambia el nombre." },
  { id: "restart", text: "Empieza de cero." },
  { id: "other", text: "Sé otra persona." },
  { id: "hololive", text: "hololive · primera aplicación: no." },
];

export const REJECTION_ANSWER = "Yo soy Hoshimachi Suisei.";

export const REJECTION_QUOTE = "«Yo no quiero ser otra persona. Yo soy Hoshimachi Suisei.»";
export const REJECTION_QUOTE_NOTE = "";

/**
 * Wide screens: the four notes are dealt while the section top travels from `from` to `to` viewport heights,
 * so the pile is complete by the time the scene has settled at the top.
 */
export const REJECTION_DEAL_WINDOW = { from: 0.85, to: 0.1 } as const;
/**
 * Wide screens: the COMET answer flips on top once the section top has scrolled this far past the viewport top.
 * A small nudge only: the presenter's "next" reveals it in place, a scrolling reader gets it after one wheel notch.
 */
export const REJECTION_ANSWER_TOP = -0.08;
