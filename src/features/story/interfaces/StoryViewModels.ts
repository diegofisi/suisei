// Static content of the talk, typed so components stay props-only.

export interface TimelinePointViewModel {
  year: string;
  label: string;
  /** Path relative to the page, e.g. "img/2018-03_indie-original.png". */
  image: string;
  /** Only the destination (Budokan 2025) is gold. */
  isDestination: boolean;
  /** "portrait" shows the whole render in a tall frame (default); "circle" for logos. */
  thumbnailShape?: "portrait" | "circle";
}

export type FactTone = "comet" | "sakura";

export interface FactFragment {
  text: string;
  strong?: boolean;
}

export interface FactViewModel {
  id: string;
  parts: FactFragment[];
  tone: FactTone;
}

export interface ClipViewModel {
  id: string;
  image?: string;
  imageAlt: string;
  /** Big text for image-less clips. */
  body?: string;
  /** CSS aspect-ratio of the card, e.g. "7 / 6"; defaults per card kind. */
  aspectRatio?: string;
  title: string;
  source: string;
  tag: string;
}
