import type { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import { ORIGINS_NARROW, ORIGINS_WIDE } from "@/features/story/components/origins/OriginsShell";
import { StatsClipBody } from "@/features/story/components/origins/StatsClipBody";
import { TextClipBody } from "@/features/story/components/origins/TextClipBody";
import type { ClipViewModel, FactTone } from "@/features/story/interfaces/StoryViewModels";

/** Where a card lands once the fan opens. */
export interface FanPose {
  rot: string;
  x: string;
  y: string;
}

interface ClipCardProps {
  clip: ClipViewModel;
  tone: FactTone;
  pose: FanPose;
  /** Stacking order inside the fan. */
  depth: number;
  /** The character render is taller than wide and must not be cropped. */
  isPortrait: boolean;
}

/** Clips with a bespoke body; anything else without an image falls back to TextClipBody. */
const bodyByClipId: Record<string, ReactNode> = { stats: <StatsClipBody /> };

/** One "recorte": media (or a typographic body) plus a source/tag caption row. */
export const ClipCard = ({ clip, tone, pose, depth, isPortrait }: ClipCardProps) => {
  const tagColor = tone === "sakura" ? "secondary.main" : "primary.main";
  return (
    <Stack
      component="figure"
      sx={{
        "--rot": pose.rot,
        "--x": pose.x,
        "--y": pose.y,
        margin: 0,
        zIndex: depth,
        width: "min(78%, 360px)",
        aspectRatio: clip.aspectRatio ?? (isPortrait ? "3 / 4" : "4 / 3"),
        overflow: "hidden",
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        background: `linear-gradient(160deg, ${alpha(Palette.SKY_2, 0.95)} 0%, ${alpha(Palette.SKY, 0.95)} 100%)`,
        boxShadow: `0 26px 62px ${alpha(Palette.SKY_DEEP, 0.62)}`,
        transform: "rotate(0deg)",
        transition: "transform 0.5s cubic-bezier(.2,.8,.2,1)",
        [ORIGINS_WIDE]: {
          position: "absolute",
          '[data-fanned="true"] &': {
            transform: "translate(var(--x), var(--y)) rotate(var(--rot))",
          },
        },
        [ORIGINS_NARROW]: {
          width: "min(100%, 360px)",
        },
      }}
    >
      {clip.image ? (
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            position: "relative",
            padding: isPortrait ? "1.1rem 1.1rem 0" : 0,
            background: isPortrait
              ? `radial-gradient(circle at 50% 58%, ${Palette.COMET_SOFT} 0%, transparent 68%)`
              : "none",
          }}
        >
          <Box
            component="img"
            src={clip.image}
            alt={clip.imageAlt}
            loading="lazy"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: isPortrait ? "contain" : "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
        </Box>
      ) : (
        (bodyByClipId[clip.id] ?? <TextClipBody text={clip.body ?? clip.title} isSakura={tone === "sakura"} />)
      )}

      <Stack sx={{ gap: "0.45rem", padding: "0.9rem 1.05rem 1.05rem" }}>
        <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
          {clip.title}
        </Typography>
        <Stack
          component="figcaption"
          direction="row"
          spacing={1.5}
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Typography variant="caption" color="text.disabled">
            {clip.source}
          </Typography>
          <Typography variant="label" sx={{ color: tagColor, whiteSpace: "nowrap" }}>
            {clip.tag}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
