import type { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import { TextClipBody } from "@/features/story/components/shared/TextClipBody";
import { NARROW_MEDIA, WIDE_MEDIA } from "@/features/story/helpers/layout";
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
  /** Bespoke body for an image-less clip; otherwise the clip text is used. */
  body?: ReactNode;
  /** True for the card on top of the fan. */
  isFront: boolean;
  /** Bring this card to the front. */
  onSelect: () => void;
}

/** One "recorte": media (or a typographic body) plus a source/tag caption row. */
export const ClipCard = ({ clip, tone, pose, depth, isPortrait, body, isFront, onSelect }: ClipCardProps) => {
  const tagColor = tone === "sakura" ? "secondary.main" : "primary.main";
  return (
    <Stack
      component="figure"
      role="button"
      tabIndex={0}
      aria-pressed={isFront}
      aria-label={`Traer al frente: ${clip.title}`}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      sx={{
        cursor: isFront ? "default" : "pointer",
        outline: "none",
        "--rot": pose.rot,
        "--x": pose.x,
        "--y": pose.y,
        margin: 0,
        zIndex: depth,
        width: "min(78%, 360px)",
        // Every card in a fan shares the same 3:4 frame so they read as one deck.
        aspectRatio: "3 / 4",
        overflow: "hidden",
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        background: `linear-gradient(160deg, ${Palette.SKY_2} 0%, ${Palette.SKY} 100%)`,
        boxShadow: `0 26px 62px ${alpha(Palette.SKY_DEEP, 0.62)}`,
        transform: "rotate(0deg)",
        // Springy swap when a card is brought to the front; the pose vars change and the transform follows.
        transition: "transform 0.7s cubic-bezier(.34,1.4,.64,1), box-shadow 0.4s ease, border-color 0.3s ease",
        "&:focus-visible": { borderColor: "primary.main" },
        position: "absolute",
        '[data-fanned="true"] &': {
          transform: "translate(var(--x), var(--y)) rotate(var(--rot))",
        },
        [WIDE_MEDIA]: {
          '[data-fanned="true"] &:hover': {
            transform: isFront
              ? "translate(var(--x), var(--y)) rotate(var(--rot)) scale(1.02)"
              : "translate(var(--x), calc(var(--y) - 18px)) rotate(var(--rot))",
            boxShadow: `0 34px 70px ${alpha(Palette.SKY_DEEP, 0.75)}`,
          },
        },
        [NARROW_MEDIA]: {
          // Less sideways spread: the phone has no room for the wide fan, but the deck must still read as one.
          '[data-fanned="true"] &': {
            transform: "translate(calc(var(--x) * 0.55), calc(var(--y) * 0.6)) rotate(var(--rot))",
          },
        },
      }}
    >
      {clip.image ? (
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            position: "relative",
            padding: isPortrait ? "1.1rem 1.1rem 0" : "1rem 1rem 0",
            background: `radial-gradient(circle at 50% 58%, ${Palette.COMET_SOFT} 0%, transparent 68%)`,
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
              objectPosition: isPortrait ? "center" : "50% 35%",
              borderRadius: isPortrait ? 0 : 6,
              display: "block",
            }}
          />
        </Box>
      ) : (
        (body ?? <TextClipBody text={clip.body ?? clip.title} isSakura={tone === "sakura"} />)
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
