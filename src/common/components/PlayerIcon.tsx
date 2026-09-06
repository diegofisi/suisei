import { Box } from "@mui/material";

export type PlayerIconKind = "play" | "pause" | "previous" | "next" | "sound" | "muted";

/** 24×24 outlines; the player has six glyphs, so an icon library would be dead weight. */
const PATH_BY_KIND: Record<PlayerIconKind, string> = {
  play: "M8 5.5v13l11-6.5z",
  pause: "M7 5h4v14H7zM13 5h4v14h-4z",
  previous: "M6 5h2v14H6zM19 5.5v13L9 12z",
  next: "M16 5h2v14h-2zM5 5.5v13L15 12z",
  sound: "M4 9v6h4l5 4V5L8 9zM16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12",
  muted: "M4 9v6h4l5 4V5L8 9zM16 9l5 6M21 9l-5 6",
};

interface PlayerIconProps {
  kind: PlayerIconKind;
}

export const PlayerIcon = ({ kind }: PlayerIconProps) => (
  <Box
    component="svg"
    viewBox="0 0 24 24"
    aria-hidden
    sx={{ width: 18, height: 18, display: "block", fill: "currentColor", stroke: "currentColor", strokeWidth: 1.6, strokeLinejoin: "round", strokeLinecap: "round" }}
  >
    <Box component="path" d={PATH_BY_KIND[kind]} sx={{ fill: kind === "sound" || kind === "muted" ? "none" : "currentColor" }} />
  </Box>
);
