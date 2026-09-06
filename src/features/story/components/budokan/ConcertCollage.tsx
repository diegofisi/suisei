import type { Ref } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import type { ConcertTileViewModel } from "@/features/story/helpers/budokanContent";
import { NARROW_MEDIA } from "@/features/story/helpers/layout";

interface ConcertCollageProps {
  tiles: ConcertTileViewModel[];
  /** Holds --rw (0→1): how much of the collage has been dealt. */
  collageRef: Ref<HTMLDivElement>;
  credit: string;
}

const COLUMNS = 7;
const ROWS = 3;
const STATIC = '[data-static="true"] &';

/** Tile `index` lands when --rw passes its own slot, so the wall builds up frame by frame while scrolling. */
const tileReveal = (index: number, count: number): string => {
  const slot = ((index / count) * 0.86).toFixed(3);
  return `clamp(0, (var(--rw, 0) - ${slot}) / 0.1, 1)`;
};

/** The night itself: a wall of concert frames that fills in as the scene scrolls; the 2018 note lands over it. */
export const ConcertCollage = ({ tiles, collageRef, credit }: ConcertCollageProps) => (
  <Box
    ref={collageRef}
    sx={{
      position: "relative",
      zIndex: 1,
      // Fades in once the intro is gone, then dims to a backdrop when the 2018 note lands on top of it.
      opacity: "calc(clamp(0, (var(--p, 0) - 0.34) / 0.06, 1) * (1 - 0.6 * clamp(0, (var(--p, 0) - 0.62) / 0.05, 1)))",
      transition: "opacity 0.3s ease",
      [STATIC]: { opacity: 1 },
    }}
  >
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
        gridAutoFlow: "dense",
        gap: "0.6vw",
        height: "min(62vh, 720px)",
        [NARROW_MEDIA]: {
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gridTemplateRows: "none",
          gridAutoRows: "22vw",
          height: "auto",
          gap: 1,
        },
      }}
    >
      {tiles.map((tile, index) => (
        <Box
          key={tile.src}
          sx={{
            "--k": tileReveal(index, tiles.length),
            gridColumn: tile.span === 2 ? "span 2" : "span 1",
            gridRow: tile.span === 2 ? "span 2" : "span 1",
            minWidth: 0,
            minHeight: 0,
            borderRadius: 1.5,
            overflow: "hidden",
            border: `1px solid ${Palette.ICE_LINE}`,
            boxShadow: `0 18px 40px ${alpha(Palette.SKY_DEEP, 0.55)}`,
            opacity: "var(--k)",
            transform: "scale(calc(0.9 + var(--k) * 0.1))",
            [STATIC]: { opacity: 1, transform: "none" },
            [NARROW_MEDIA]: { gridColumn: "span 1", gridRow: "span 1" },
          }}
        >
          <Box
            component="img"
            src={tile.src}
            alt={tile.alt}
            loading="lazy"
            sx={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      ))}
    </Box>
    <Stack sx={{ alignItems: "center", marginTop: 1 }}>
      <Typography variant="caption" color="text.disabled" sx={{ textAlign: "center" }}>
        {credit}
      </Typography>
    </Stack>
  </Box>
);
