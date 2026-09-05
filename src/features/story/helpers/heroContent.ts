// Scene 1 copy. Spanish, exactly as it is spoken in class.

export interface HeroMetaItem {
  id: string;
  label: string;
  value: string;
}

export interface HeroContent {
  japaneseName: string;
  eyebrow: string;
  title: string;
  meta: HeroMetaItem[];
  scrollCue: string;
  signatureLabel: string;
  signatureNote: string;
}

export const heroContent: HeroContent = {
  japaneseName: "星街すいせい",
  eyebrow: "Hoshimachi Suisei",
  title: "La cometa que desafió la gravedad",
  meta: [
    { id: "exposicion", label: "Exposición", value: "Tu nombre · fecha" },
    { id: "tema", label: "Tema", value: "Resiliencia" },
    { id: "duracion", label: "Duración", value: "~13 min" },
  ],
  scrollCue: "Scroll",
  signatureLabel: "firma · 星街すいせい",
  signatureNote: "Todo empieza con un nombre que no quiso cambiar.",
};
