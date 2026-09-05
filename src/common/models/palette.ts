// Every color in the app comes from here. The two accent colors carry meaning:
// COMET = Suisei "the star" (milestones, dates); SAKURA = the person behind (rejection, doubt, tears).
export const Palette = {
  SKY: "#0B1230",
  SKY_2: "#121D4A",
  SKY_DEEP: "#060A1C",
  COMET: "#5EC8F2",
  COMET_SOFT: "rgba(94,200,242,0.18)",
  SAKURA: "#F6A5C0",
  SAKURA_SOFT: "rgba(246,165,192,0.14)",
  GOLD: "#F2D68B",
  ICE: "#EAF4FF",
  ICE_DIM: "rgba(234,244,255,0.62)",
  ICE_FAINT: "rgba(234,244,255,0.32)",
  ICE_LINE: "rgba(234,244,255,0.12)",
  STAR_WHITE: "#EAF4FF",
  STAR_BLUE: "#9FD8F7",
  STAR_WARM: "#F2B27A",
  STAR_PINK: "#F6A5C0",
} as const;

export type Palette = (typeof Palette)[keyof typeof Palette];
