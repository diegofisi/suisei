// Scene 11 — "La lección: tres pilares" (guion.md, Diapo 11).

export interface PillarViewModel {
  id: string;
  numeral: string;
  title: string;
  body: string;
  /** Step at which the card is on; the hook writes `data-step` 0..4 on the section. */
  step: number;
}

export const PILLARS_SECTION_LABEL = "La lección: tres pilares";
export const PILLARS_HEADLINE = "La pregunta del inicio";
export const PILLARS_LEAD = "Tres respuestas.";

export const pillars: PillarViewModel[] = [
  {
    id: "identity",
    numeral: "01",
    title: "Identidad inquebrantable",
    body: "Éxito a cambio de su nombre: dijo que no.",
    step: 1,
  },
  {
    id: "consistency",
    numeral: "02",
    title: "Consistencia invisible",
    body: "6.000 suscriptores y seguía publicando. El músculo se entrena en la oscuridad.",
    step: 2,
  },
  {
    id: "pivot",
    numeral: "03",
    title: "Flexibilidad para pivotar",
    body: "Idol → VTuber indie → sello → su propia agencia.",
    step: 3,
  },
];

/** The bonus pillar is about the audience holding her, so it reads in SAKURA. */
export const PILLARS_BONUS = {
  label: "Bonus · Dejarse sostener",
  body: "El público cantó «comet» en el end roll cuando ella ya no estaba en el escenario.",
  step: 4,
} as const;

export const PILLARS_QUOTE =
  "«Resiliencia no es repetir lo mismo con más rabia: es cambiar de ruta sin cambiar de destino.»";

/** Sticky progress at which each step turns on. Index 0 is step 1. */
export const PILLARS_STEP_THRESHOLDS = [0, 0.42, 0.64, 0.8] as const;
export const PILLARS_TOTAL_STEPS = PILLARS_STEP_THRESHOLDS.length;
/** Sticky progress at which the closing quote reveals. */
export const PILLARS_QUOTE_AT = 0.88;
/** At or below this width the stage stops being sticky, so everything shows at once. */
export const PILLARS_STATIC_MAX_WIDTH = 760;
