import type { CSSProperties } from "react";
import { createTheme } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    jp: CSSProperties;
    label: CSSProperties;
    display: CSSProperties;
  }
  interface TypographyVariantsOptions {
    jp?: CSSProperties;
    label?: CSSProperties;
    display?: CSSProperties;
  }
}
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    jp: true;
    label: true;
    display: true;
  }
}

export const FONT_DISPLAY = "'Syne', 'Sora', system-ui, sans-serif";
export const FONT_BODY = "'Sora', system-ui, sans-serif";
export const FONT_JP = "'Zen Kaku Gothic New', 'Noto Sans JP', 'Yu Gothic', sans-serif";

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: Palette.SKY, paper: Palette.SKY_2 },
    primary: { main: Palette.COMET },
    secondary: { main: Palette.SAKURA },
    warning: { main: Palette.GOLD },
    text: { primary: Palette.ICE, secondary: Palette.ICE_DIM, disabled: Palette.ICE_FAINT },
    divider: Palette.ICE_LINE,
  },
  shape: { borderRadius: 14 },
  spacing: 8,
  typography: {
    fontFamily: FONT_BODY,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightBold: 600,
    h1: { fontFamily: FONT_DISPLAY, fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.02em", fontSize: "clamp(44px, 7vw, 108px)" },
    h2: { fontFamily: FONT_DISPLAY, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.015em", fontSize: "clamp(30px, 5.2vw, 76px)" },
    h3: { fontFamily: FONT_DISPLAY, fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.015em", fontSize: "clamp(26px, 3vw, 42px)" },
    h4: { fontFamily: FONT_DISPLAY, fontWeight: 500, lineHeight: 1.3, fontSize: "clamp(20px, 2vw, 30px)" },
    subtitle1: { fontFamily: FONT_DISPLAY, fontWeight: 500, lineHeight: 1.2, fontSize: "clamp(18px, 2vw, 30px)", letterSpacing: "0.01em" },
    body1: { fontWeight: 300, lineHeight: 1.6, fontSize: "clamp(15px, 1.15vw, 18px)" },
    body2: { fontWeight: 300, lineHeight: 1.5, fontSize: 15 },
    caption: { fontWeight: 300, lineHeight: 1.45, fontSize: 12.5, letterSpacing: "0.01em" },
    display: { fontFamily: FONT_DISPLAY, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.05em", fontSize: "clamp(72px, 11.5vw, 220px)" },
    label: { fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", lineHeight: 1 },
    jp: { fontFamily: FONT_JP, fontWeight: 900, fontSize: "clamp(14px, 1.4vw, 20px)", letterSpacing: "0.5em", lineHeight: 1 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: "smooth" },
        body: { backgroundColor: Palette.SKY, color: Palette.ICE, overflowX: "hidden" },
        "::selection": { backgroundColor: Palette.COMET, color: Palette.SKY },
        "@media (prefers-reduced-motion: reduce)": {
          "*": { animationDuration: "0.01ms !important", animationDelay: "0s !important", transitionDuration: "0.01ms !important" },
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: { display: "div", label: "span", jp: "span" },
      },
    },
  },
});
