import type { Ref } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { hashNoise } from "@/common/helpers/math";
import { Palette } from "@/common/models/palette";
import type { ConcertTileViewModel } from "@/features/story/helpers/budokanContent";
import { NARROW_MEDIA } from "@/features/story/helpers/layout";

interface ConcertWallProps {
  tiles: ConcertTileViewModel[];
  /** Root; the scene hook writes --rw (0→1) on it and flips `data-lit` on each plate as the deal passes its slot. */
  wallRef: Ref<HTMLDivElement>;
  credit: string;
}

/** Cases on the wall. The grid picks the columns from the viewport, so a wide screen simply shows more of them. */
const WALL_SLOTS = 48;
const STATIC = '[data-static="true"] &';

/** Each case takes a frame (cycling through the fifteen) and a scattered deal order, so the wall never lights row by row. */
const buildSlots = (tiles: ConcertTileViewModel[]) =>
  Array.from({ length: WALL_SLOTS }, (_unused, index) => {
    const tile = tiles[(index * 7) % tiles.length];
    return { key: `${index}-${tile?.src ?? ""}`, tile, order: (hashNoise(index * 7.31 + 2.1) * 0.9).toFixed(3) };
  });

/**
 * The night as a record wall, like the album shelves of the SuperNova opening film: dark cases in columns,
 * each sleeve dark until the deal reaches it, then its lid swings open from the top edge and the frame lights up.
 */
export const ConcertWall = ({ tiles, wallRef, credit }: ConcertWallProps) => (
  <Box
    ref={wallRef}
    aria-hidden
    sx={{
      "--rw": 0,
      position: "absolute",
      inset: 0,
      zIndex: 0,
      overflow: "hidden",
      pointerEvents: "none",
      // Only a thin tint: the cases hang on the same star sky as the rest of the page, not on a black wall.
      backgroundColor: alpha(Palette.SKY_DEEP, 0.28),
      // Soft edges: the wall dissolves into the sky instead of ending on a hard line.
      maskImage: `radial-gradient(92% 94% at 50% 50%, ${Palette.SKY} 58%, transparent 100%)`,
      [STATIC]: { position: "relative", height: "70vh", maskImage: "none" },
    }}
  >
    <Box
      sx={{
        position: "absolute",
        inset: "-6% -4%",
        perspective: "1100px",
        perspectiveOrigin: "50% 50%",
        [STATIC]: { position: "static", perspective: "none" },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(clamp(150px, 15.5vw, 300px), 1fr))",
          gridAutoRows: "min-content",
          alignContent: "start",
          columnGap: "clamp(8px, 1.4vw, 26px)",
          rowGap: "clamp(4px, 0.5vw, 10px)",
          padding: "1.5vw 2vw",
          transformStyle: "preserve-3d",
          // Head-on, like a shelf seen straight; a slow pan keeps it alive between lid flips.
          transform: "scale(1.04)",
          transformOrigin: "50% 50%",
          "@keyframes wallDrift": {
            "0%, 100%": { translate: "0 0" },
            "50%": { translate: "-2% 0.6%" },
          },
          animation: "wallDrift 46s ease-in-out infinite",
          [NARROW_MEDIA]: { gridTemplateColumns: "repeat(3, minmax(0, 1fr))", transform: "none" },
          [STATIC]: { transform: "none", animation: "none" },
        }}
      >
        {buildSlots(tiles).map((slot) => (
          <Box
            key={slot.key}
            sx={{
              // The case: a dark slab with a hairline lip, always there; only the lid inside it animates.
              aspectRatio: "1 / 1.06",
              padding: "3.5%",
              borderRadius: 1,
              backgroundColor: alpha(Palette.ICE, 0.055),
              boxShadow: `inset 0 0 0 1px ${alpha(Palette.ICE, 0.05)}, 0 14px 26px ${alpha(Palette.SKY_DEEP, 0.5)}`,
              transformStyle: "preserve-3d",
            }}
          >
            <Box
              data-slot={slot.order}
              data-lit="false"
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: 0.75,
                overflow: "hidden",
                backgroundColor: Palette.SKY_DEEP,
                transformOrigin: "50% 0%",
                transformStyle: "preserve-3d",
                filter: "brightness(0.22) saturate(0.5)",
                "@keyframes lidOpen": {
                  "0%": { transform: "rotateX(-96deg) scale(0.96)", filter: "brightness(0.18) saturate(0.4)" },
                  "55%": { transform: "rotateX(9deg) scale(1.02)", filter: "brightness(1.25) saturate(1.05)" },
                  "100%": { transform: "rotateX(0deg) scale(1)", filter: "brightness(1) saturate(1)" },
                },
                '&[data-lit="true"]': { animation: "lidOpen 1.05s cubic-bezier(0.2, 0.8, 0.2, 1) both" },
                [STATIC]: { filter: "none", animation: "none" },
              }}
            >
              {slot.tile && (
                <Box
                  component="img"
                  src={slot.tile.src}
                  alt=""
                  loading="lazy"
                  sx={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
    <Typography
      variant="caption"
      color="text.disabled"
      sx={{ position: "absolute", left: "50%", bottom: 14, transform: "translateX(-50%)", whiteSpace: "nowrap" }}
    >
      {credit}
    </Typography>
  </Box>
);
