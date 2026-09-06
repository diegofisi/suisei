// Scene 10 — "Actualidad 2026" (guion.md, Diapo 10). Static copy; figures flagged
// "(por verificar)" are the ones the guion still lists as pending review.
import type { FactViewModel } from "@/features/story/interfaces/StoryViewModels";

export const TODAY_SECTION_LABEL = "Actualidad, 2026";
export const TODAY_YEAR = "2026";
export const TODAY_HEADLINE = "Dueña de su propia órbita";

/** Duration of each one-shot count-up, in ms. */
export const TODAY_COUNT_UP_MS = 1400;

export const TODAY_CREDIT = "Logo © Studio STELLAR";

export const TODAY_CARD = {
  image: "img/studio-stellar.jpg",
  imageAlt: "Logo de Studio STELLAR",
  label: "Studio STELLAR · 22/03/2026",
  body: "Su propia agencia · fundada en su 8.º aniversario.",
} as const;

/** The omikuji anecdote is the person behind the milestone, so it reads in SAKURA. */
export const TODAY_OMIKUJI = {
  title: "御神籤 · 大吉",
  body: "Omikuji en la duda: 大吉, bendición mayor. «No me queda más que creer en esto».",
} as const;

export const TODAY_QUOTE = "«Quiero seguir rompiendo mi propio caparazón… y el caparazón del mundo virtual.»";
export const TODAY_QUOTE_NOTE = "Hoshimachi Suisei, 2026.";

export const todayFacts: FactViewModel[] = [
  {
    id: "studio-stellar",
    tone: "comet",
    parts: [
      { text: "22 / 03 / 2026", strong: true },
      { text: " — Funda " },
      { text: "Studio STELLAR", strong: true },
      { text: ", su propia agencia; conferencia de prensa al día siguiente." },
    ],
  },
  {
    id: "rock-in-japan",
    tone: "comet",
    parts: [
      { text: "Primera VTuber en ROCK IN JAPAN FESTIVAL", strong: true },
      { text: " (19/09/2026, Chiba) (fecha por verificar)." },
    ],
  },
  {
    id: "tour",
    tone: "comet",
    parts: [
      { text: "Gira " },
      { text: "«Once Upon a Stellar»", strong: true },
      { text: ": 5 shows en 4 ciudades, sept–nov 2026." },
    ],
  },
  {
    id: "single",
    tone: "comet",
    parts: [
      { text: "Single " },
      { text: "«GUM & DROP»", strong: true },
      { text: " (31/08/2026), escrito en Los Ángeles, prod. TAKU INOUE." },
    ],
  },
  {
    id: "anime",
    tone: "comet",
    parts: [
      { text: "Anime: " },
      { text: "Gundam GQuuuuuuX", strong: true },
      { text: " (ending) y " },
      { text: "Mayonaka Heart Tune", strong: true },
      { text: " (opening)." },
    ],
  },
];

export interface TodayCounterViewModel {
  id: string;
  /** Value the count-up lands on, in millions. */
  target: number;
  decimals: number;
  suffix: string;
  caption: string;
}

export const todayCounters: TodayCounterViewModel[] = [
  {
    id: "subscribers",
    target: 2.88,
    decimals: 2,
    suffix: " M",
    caption: "suscriptores · mayo 2026 (por verificar)",
  },
  {
    id: "views",
    target: 1670,
    decimals: 0,
    suffix: " M",
    caption: "reproducciones · mayo 2026 (por verificar)",
  },
];

/**
 * Spanish number formatting by hand ("2,88" / "1.670"): dot groups thousands, comma
 * opens the decimals. Intl is avoided because grouping differs between es-* locales.
 */
export const formatSpanishNumber = (value: number, decimals: number): string => {
  const fixed = Math.abs(value).toFixed(decimals);
  const dotAt = fixed.indexOf(".");
  const whole = dotAt < 0 ? fixed : fixed.slice(0, dotAt);
  const fraction = dotAt < 0 ? "" : fixed.slice(dotAt + 1);
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return fraction ? `${grouped},${fraction}` : grouped;
};

export const formatCounter = (value: number, counter: TodayCounterViewModel): string =>
  `${formatSpanishNumber(value, counter.decimals)}${counter.suffix}`;
