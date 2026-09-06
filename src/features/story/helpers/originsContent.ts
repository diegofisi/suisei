// Scene 3 — "Los inicios (2018)". Static copy; figures come from guion.md (Diapo 3).
import type { ClipViewModel, FactViewModel } from "@/features/story/interfaces/StoryViewModels";

export const ORIGINS_YEAR = "2018";

export const ORIGINS_HEADLINE = "El principio es casi ridículo de humilde";

/** Subscribers after one full year of publishing alone. */
export const ORIGINS_SUBSCRIBER_TARGET = 6000;

/** Duration of the one-shot count-up, in ms. */
export const ORIGINS_COUNT_UP_MS = 1400;

export const ORIGINS_CREDIT = "Renders: generados a partir de diseños © COVER Corp.";

/**
 * Spanish thousands separator ("6.000"). Written by hand instead of Intl because
 * grouping for 4-digit numbers is locale-flaky (es-ES drops it, es-PE uses a comma).
 */
export const formatSubscribers = (value: number): string =>
  Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const originsFacts: FactViewModel[] = [
  {
    id: "debut",
    tone: "comet",
    parts: [
      { text: "Debutó el " },
      { text: "22 de marzo de 2018", strong: true },
      { text: " como VTuber independiente, sin agencia." },
    ],
  },
  {
    id: "self-made-model",
    tone: "comet",
    parts: [
      { text: "Se dibujó, " },
      { text: "riggeó y animó su propio modelo", strong: true },
      { text: ": aprendió Live2D con tutoriales de YouTube." },
    ],
  },
  {
    id: "auditions",
    tone: "sakura",
    parts: [
      { text: "Antes quería ser " },
      { text: "idol real", strong: true },
      { text: ". Audicionó en varias agencias… y " },
      { text: "falló en todas", strong: true },
      { text: "." },
    ],
  },
  {
    id: "day-job",
    tone: "sakura",
    parts: [
      { text: "Trabajó de " },
      { text: "mesera en un pub", strong: true },
      { text: " y editaba videos para otros VTubers por dinero." },
    ],
  },
];

/** Caption beside the number: "suscriptores" is there from the start; the tail unfolds with the count-up. */
export const ORIGINS_COUNTER_LEAD = "suscriptores";
export const ORIGINS_COUNTER_TAIL = " tras un año entero";

export const ORIGINS_QUOTE = "«No quería ser otra. Yo soy Hoshimachi Suisei.»";

export const ORIGINS_QUOTE_NOTE = "";

// Order = stacking order: the character render goes last so it lands on top of the fan.
export const originsClips: ClipViewModel[] = [
  {
    id: "day-job",
    imageAlt: "",
    body: "Mesera de día.\nEditora de noche.",
    title: "Sobrevivir mientras nadie miraba",
    source: "Pub + edición freelance · 2018–2019",
    tag: "la persona",
  },
  {
    id: "stats",
    imageAlt: "",
    title: "≈ 6.000 suscriptores",
    source: "Un año después del debut · 2019",
    tag: "6.000",
  },
  {
    id: "model",
    image: "img/2018-03_perfil-debut.png",
    imageAlt: "Ficha de perfil del debut de Suisei con su modelo original",
    aspectRatio: "7 / 6",
    title: "Su ficha de debut: el modelo que dibujó ella misma",
    source: "Perfil de debut · 22/03/2018",
    tag: "era indie",
  },
];
