import { Stack, Typography } from "@mui/material";

export interface HeroTitlesProps {
  japaneseName: string;
  eyebrow: string;
  title: string;
}

const ENTER_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export const HeroTitles = ({ japaneseName, eyebrow, title }: HeroTitlesProps) => (
  <Stack
    sx={{
      height: "100%",
      justifyContent: { xs: "flex-start", md: "center" },
      pt: { xs: "13vh", md: 0 },
      // Keeps the meta row clear of the scroll cue pinned to the bottom center.
      pb: { xs: 0, md: "9vh" },
      pl: "7vw",
      pr: { xs: "7vw", md: "4vw" },
    }}
  >
    <Typography
      variant="jp"
      sx={{
        display: { xs: "none", md: "block" },
        position: "absolute",
        left: "2.4vw",
        top: "50%",
        writingMode: "vertical-rl",
        color: "primary.main",
        "@keyframes heroJpIn": {
          from: { opacity: 0, transform: "translateY(-42%)" },
          to: { opacity: 1, transform: "translateY(-50%)" },
        },
        animation: `heroJpIn 1100ms ${ENTER_EASE} 120ms both`,
      }}
    >
      {japaneseName}
    </Typography>

    <Typography
      variant="subtitle1"
      color="text.secondary"
      sx={{
        "@keyframes heroEyebrowIn": {
          from: { opacity: 0, transform: "translateY(12px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        animation: `heroEyebrowIn 800ms ${ENTER_EASE} 260ms both`,
      }}
    >
      {eyebrow}
    </Typography>

    <Typography
      variant="h1"
      sx={{
        mt: 1.5,
        maxWidth: { xs: "100%", md: "min(46vw, 760px)" },
        // Short screens (laptops, 720-800px tall): a smaller title keeps the meta row clear of the SCROLL cue.
        "@media (max-height: 840px)": { fontSize: "clamp(38px, 5.2vw, 76px)" },
        "@keyframes heroTitleIn": {
          from: { opacity: 0, transform: "translateY(38px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        animation: `heroTitleIn 1200ms ${ENTER_EASE} 380ms both`,
      }}
    >
      {title}
    </Typography>

  </Stack>
);
