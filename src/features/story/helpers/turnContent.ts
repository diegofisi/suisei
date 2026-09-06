// Scene 5 — "El giro: INoNaKa Music y hololive (2019)" (guion.md, Diapo 5).
// This is where the page turns from SAKURA to COMET.


/** The word she kept hearing, and the word the story actually ends on. */
export const TURN_STATEMENT_BEFORE = "«No»";
export const TURN_STATEMENT_AFTER = "«Todavía no.»";
export const TURN_STATEMENT_BODY =
  "La historia del cometa no termina en «no». Termina en «todavía no».";

export interface TurnMilestoneViewModel {
  id: string;
  /** Rendered as "19 · 05 · 2019". */
  date: string;
  text: string;
}

export const turnMilestones: TurnMilestoneViewModel[] = [
  {
    id: "innk",
    date: "19 · 05 · 2019",
    text: "Invitada sorpresa en el primer concierto de AZKi. Se anuncia INoNaKa Music, el sello musical de hololive.",
  },
  {
    id: "hololive",
    date: "01 · 12 · 2019",
    text: "Se transfiere oficialmente a hololive, generación cero. Modelo nuevo.",
  },
];

export const TURN_RENDER_SRC = "img/2019-12_hololive-default.png";
export const TURN_RENDER_ALT =
  "Render del primer traje de Suisei en hololive: boina a cuadros, chaqueta gris y calcetines desparejos";
export const TURN_RENDER_TAG = "Modelo hololive · dic. 2019 · Teshima Nari";
export const TURN_RENDER_CREDIT = "Render generado a partir del diseño © COVER Corp.";

export const TURN_CLOSING_HEADLINE = "La chica que una vez fue rechazada… ya estaba adentro.";
export const TURN_CLOSING_NOTE =
  "Pero el despegue no fue inmediato. Lo que siguió fue un cohete de tres etapas.";

/** Tall section: 240vh of scroll drive the 100vh sticky stage. */
export const TURN_SECTION_HEIGHT = "240vh";

// Every phase below is a window of `--p` (stickyProgressOf) and lives in CSS `clamp()` math.
export const TURN_NO_PHASE = { start: 0, end: 0.35 } as const;
export const TURN_YET_PHASE = { start: 0.25, end: 0.55 } as const;
export const TURN_LINE_PHASE = { start: 0.45, end: 0.9 } as const;
export const TURN_RENDER_PHASE = { start: 0.5, end: 0.8 } as const;
export const TURN_CLOSING_PHASE = { start: 0.85, end: 0.95 } as const;

/** A 0→1 CSS ramp over a `--p` window, for `calc()` math inside `sx`. */
export const rampOf = (window: { start: number; end: number }): string =>
  `clamp(0, (var(--p, 0) - ${window.start}) / ${(window.end - window.start).toFixed(4)}, 1)`;
