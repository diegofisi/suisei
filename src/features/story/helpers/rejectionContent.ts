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
export const REJECTION_QUOTE_NOTE =
  "Lo que respondió, una y otra vez, cuando le ofrecían firmar a cambio del nombre.";

/** `entryProgressOf` settle point: negative so the deal spreads over most of the section. */
export const REJECTION_SETTLE_AT = -0.5;
/** Entry progress window in which the four condition cards land, one by one. */
export const REJECTION_DEAL_PHASE = { start: 0.18, end: 0.74 } as const;
/** Entry progress at which the COMET answer flips on top of the finished pile. */
export const REJECTION_ANSWER_AT = 0.82;
