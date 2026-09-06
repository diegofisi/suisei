import { useState, type ReactNode, type Ref } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { ClipCard, type FanPose } from "@/features/story/components/shared/ClipCard";
import { NARROW_MEDIA, WIDE_MEDIA } from "@/features/story/helpers/layout";
import type { ClipViewModel, FactTone } from "@/features/story/interfaces/StoryViewModels";

/** Where each card lands once `data-fanned` flips, by position in the pile; the last position is on top. */
const FAN_POSES: readonly FanPose[] = [
  { rot: "-9deg", x: "-24%", y: "8%" },
  { rot: "8deg", x: "24%", y: "-4%" },
  { rot: "-2deg", x: "0%", y: "-2%" },
];
const STACKED_POSE: FanPose = { rot: "0deg", x: "0%", y: "0%" };

interface ClipFanProps {
  clips: ClipViewModel[];
  fanRef: Ref<HTMLDivElement>;
  /** Small credit line under the fan. */
  credit?: string;
  /** Clip ids that carry the SAKURA tag (the human side); everything else is COMET. */
  sakuraClipIds?: readonly string[];
  /** Clip ids rendered 3:4 with `contain` and a glow — character renders. */
  portraitClipIds?: readonly string[];
  /** Bespoke bodies for image-less clips, by id; the rest fall back to their `body` text. */
  bodyByClipId?: Record<string, ReactNode>;
}

/** Sticky pile of clips that fans out when the scene hook sets `data-fanned`; tapping a card brings it to the front. */
export const ClipFan = ({
  clips,
  fanRef,
  credit,
  sakuraClipIds = [],
  portraitClipIds = [],
  bodyByClipId = {},
}: ClipFanProps) => {
  // Pile order, bottom to top. Ephemeral UI state: nothing outside the fan depends on it.
  const [pileOrder, setPileOrder] = useState<string[]>(() => clips.map((clip) => clip.id));
  const bringToFront = (id: string) => {
    setPileOrder((order) => (order[order.length - 1] === id ? order : [...order.filter((other) => other !== id), id]));
  };
  const positionOf = (id: string) => pileOrder.indexOf(id);
  const topId = pileOrder[pileOrder.length - 1];

  return (
    <Box>
      <Box
        ref={fanRef}
        data-fanned="false"
        sx={{
          [WIDE_MEDIA]: {
            position: "sticky",
            top: "12vh",
            height: "76vh",
            display: "grid",
            placeItems: "center",
          },
          [NARROW_MEDIA]: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2.4rem",
          },
        }}
      >
        {clips.map((clip) => {
          const tone: FactTone = sakuraClipIds.includes(clip.id) ? "sakura" : "comet";
          const position = positionOf(clip.id);
          return (
            <ClipCard
              key={clip.id}
              clip={clip}
              tone={tone}
              pose={FAN_POSES[position] ?? STACKED_POSE}
              depth={position + 1}
              isPortrait={portraitClipIds.includes(clip.id)}
              body={bodyByClipId[clip.id]}
              isFront={clip.id === topId}
              onSelect={() => bringToFront(clip.id)}
            />
          );
        })}
      </Box>
      <Stack sx={{ marginTop: "1.4rem", alignItems: "center", gap: 0.5 }}>
        {credit && (
          <Typography variant="caption" color="text.disabled" sx={{ textAlign: "center", maxWidth: "40ch" }}>
            {credit}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};
