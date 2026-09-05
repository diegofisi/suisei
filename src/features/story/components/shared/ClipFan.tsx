import type { ReactNode, Ref } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { ClipCard, type FanPose } from "@/features/story/components/shared/ClipCard";
import { NARROW_MEDIA, WIDE_MEDIA } from "@/features/story/helpers/layout";
import type { ClipViewModel, FactTone } from "@/features/story/interfaces/StoryViewModels";

/** Where each card lands once `data-fanned` flips. Index-aligned with the clips; the last card lands on top. */
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

/** Sticky stack of clips that fans out when the scene hook sets `data-fanned`. */
export const ClipFan = ({
  clips,
  fanRef,
  credit,
  sakuraClipIds = [],
  portraitClipIds = [],
  bodyByClipId = {},
}: ClipFanProps) => (
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
      {clips.map((clip, index) => {
        const tone: FactTone = sakuraClipIds.includes(clip.id) ? "sakura" : "comet";
        return (
          <ClipCard
            key={clip.id}
            clip={clip}
            tone={tone}
            pose={FAN_POSES[index] ?? STACKED_POSE}
            depth={index + 1}
            isPortrait={portraitClipIds.includes(clip.id)}
            body={bodyByClipId[clip.id]}
          />
        );
      })}
    </Box>
    {credit && (
      <Stack sx={{ marginTop: "1.4rem", alignItems: "center" }}>
        <Typography variant="caption" color="text.disabled" sx={{ textAlign: "center", maxWidth: "40ch" }}>
          {credit}
        </Typography>
      </Stack>
    )}
  </Box>
);
