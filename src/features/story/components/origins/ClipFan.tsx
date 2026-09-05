import type { Ref } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { ClipCard, type FanPose } from "@/features/story/components/origins/ClipCard";
import { ORIGINS_NARROW, ORIGINS_WIDE } from "@/features/story/components/origins/OriginsShell";
import { ORIGINS_CREDIT } from "@/features/story/helpers/originsContent";
import type { ClipViewModel, FactTone } from "@/features/story/interfaces/StoryViewModels";

/** Where each card lands once `data-fanned` flips. Index-aligned with the clips. */
const FAN_POSES: readonly FanPose[] = [
  { rot: "-9deg", x: "-24%", y: "8%" },
  { rot: "8deg", x: "24%", y: "-4%" },
  { rot: "-2deg", x: "0%", y: "-2%" },
];
const STACKED_POSE: FanPose = { rot: "0deg", x: "0%", y: "0%" };

/** The lone SAKURA card: 6.000 subscribers is the doubt, not the milestone. */
const SAKURA_CLIP_IDS: readonly string[] = ["stats", "day-job"];
/** Only the character render keeps a portrait crop. */
const PORTRAIT_CLIP_IDS: readonly string[] = [];

interface ClipFanProps {
  clips: ClipViewModel[];
  fanRef: Ref<HTMLDivElement>;
}

/** Sticky stack of clips that fans out when the section crosses mid-viewport. */
export const ClipFan = ({ clips, fanRef }: ClipFanProps) => (
  <Box>
    <Box
      ref={fanRef}
      data-fanned="false"
      sx={{
        [ORIGINS_WIDE]: {
          position: "sticky",
          top: "12vh",
          height: "76vh",
          display: "grid",
          placeItems: "center",
        },
        [ORIGINS_NARROW]: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.4rem",
        },
      }}
    >
      {clips.map((clip, index) => {
        const tone: FactTone = SAKURA_CLIP_IDS.includes(clip.id) ? "sakura" : "comet";
        return (
          <ClipCard
            key={clip.id}
            clip={clip}
            tone={tone}
            pose={FAN_POSES[index] ?? STACKED_POSE}
            depth={index + 1}
            isPortrait={PORTRAIT_CLIP_IDS.includes(clip.id)}
          />
        );
      })}
    </Box>
    <Stack sx={{ marginTop: "1.4rem", alignItems: "center" }}>
      <Typography variant="caption" color="text.disabled" sx={{ textAlign: "center", maxWidth: "40ch" }}>
        {ORIGINS_CREDIT}
      </Typography>
    </Stack>
  </Box>
);
