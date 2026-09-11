import { Box, IconButton, Slider, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { PlayerIcon } from "@/common/components/PlayerIcon";
import { NARROW_MEDIA } from "@/common/helpers/viewport";
import type { MusicPlayerState } from "@/common/hooks/useMusicPlayer";
import { Palette } from "@/common/models/palette";

/** Height of the invisible strip at the top of the page that brings the bar back when hovered. */
const HOT_ZONE_HEIGHT = 84;

const HIDDEN_BAR = '&[data-hidden="true"]';

interface MusicPlayerProps extends MusicPlayerState {
  /** Opens the soundtrack panel (the ≡ button). */
  onOpenPanel: () => void;
  isPanelOpen: boolean;
}

/**
 * Minimal pill: track, transport, mute, volume (when the source supports them), a hairline progress and the ≡ button
 * that opens the soundtrack panel. Desktop: top centre, slides away on scroll and returns on hover. Phones: a
 * full-width bar along the bottom edge (the scene counter owns the top-right corner), without previous/next; it
 * slides down while scrolling and returns on the way up.
 */
export const MusicPlayer = ({
  barRef,
  audioRef,
  track,
  isPlaying,
  supportsVolume,
  isMuted,
  volume,
  awaitingGesture,
  source,
  onToggle,
  onNext,
  onPrevious,
  onToggleMute,
  onVolumeChange,
  onOpenPanel,
  isPanelOpen,
}: MusicPlayerProps) => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: HOT_ZONE_HEIGHT,
      zIndex: 20,
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      paddingTop: "14px",
      // Hovering anywhere in the strip brings a hidden bar back.
      '&:hover [data-hidden="true"]': { transform: "translateY(0)", opacity: 1 },
      [NARROW_MEDIA]: {
        top: "auto",
        bottom: 0,
        height: "auto",
        alignItems: "flex-end",
        padding: "0 12px calc(12px + env(safe-area-inset-bottom, 0px))",
        // The strip must not swallow taps on the page; only the bar itself is interactive.
        pointerEvents: "none",
      },
    }}
  >
    {source === "local" && <Box component="audio" ref={audioRef} src={track.src} preload="auto" />}
    <Stack
      ref={barRef}
      data-hidden="false"
      direction="row"
      spacing={0.5}
      sx={{
        "--progress": 0,
        position: "relative",
        alignItems: "center",
        paddingLeft: "16px",
        paddingRight: "6px",
        height: 44,
        borderRadius: 999,
        overflow: "hidden",
        border: `1px solid ${Palette.ICE_LINE}`,
        background: alpha(Palette.SKY_2, 0.72),
        backdropFilter: "blur(16px)",
        boxShadow: `0 16px 40px ${alpha(Palette.SKY_DEEP, 0.55)}`,
        transition: "transform 0.45s cubic-bezier(.2,.8,.2,1), opacity 0.35s ease",
        [HIDDEN_BAR]: { transform: "translateY(-140%)", opacity: 0 },
        [NARROW_MEDIA]: {
          width: "100%",
          paddingLeft: "14px",
          paddingRight: "8px",
          pointerEvents: "auto",
          background: alpha(Palette.SKY_2, 0.86),
          [HIDDEN_BAR]: { transform: "translateY(160%)", opacity: 0 },
        },
      }}
    >
      <Box
        aria-hidden
        sx={{
          flex: "0 0 auto",
          width: 7,
          height: 7,
          marginRight: "10px",
          borderRadius: "50%",
          backgroundColor: isPlaying ? Palette.COMET : Palette.ICE_FAINT,
          boxShadow: isPlaying ? `0 0 10px ${Palette.COMET}` : "none",
          "@keyframes playerPulse": { "0%, 100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.5)" } },
          animation: isPlaying ? "playerPulse 1.6s ease-in-out infinite" : "none",
        }}
      />
      <Typography
        variant="label"
        sx={{
          color: "text.primary",
          marginRight: "10px",
          whiteSpace: "nowrap",
          // Phones: the title yields to the controls ("STELLAR STELLAR" would otherwise push them out).
          [NARROW_MEDIA]: { flex: "0 1 auto", minWidth: 0, maxWidth: "34vw", overflow: "hidden", textOverflow: "ellipsis" },
        }}
      >
        {track.title}
      </Typography>
      {awaitingGesture && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ marginRight: "6px", whiteSpace: "nowrap", [NARROW_MEDIA]: { display: "none" } }}
        >
          toca para sonar
        </Typography>
      )}
      <IconButton
        size="small"
        aria-label="Pista anterior"
        onClick={onPrevious}
        sx={{ color: "text.secondary", [NARROW_MEDIA]: { display: "none" } }}
      >
        <PlayerIcon kind="previous" />
      </IconButton>
      <IconButton
        size="small"
        aria-label={isPlaying ? "Pausar" : "Reproducir"}
        onClick={onToggle}
        sx={{ color: "primary.main", [NARROW_MEDIA]: { marginLeft: "auto" } }}
      >
        <PlayerIcon kind={isPlaying ? "pause" : "play"} />
      </IconButton>
      <IconButton
        size="small"
        aria-label="Pista siguiente"
        onClick={onNext}
        sx={{ color: "text.secondary", [NARROW_MEDIA]: { display: supportsVolume ? "none" : "inline-flex" } }}
      >
        <PlayerIcon kind="next" />
      </IconButton>
      {supportsVolume && (
        <>
          <IconButton
            size="small"
            aria-label={isMuted ? "Activar sonido" : "Silenciar"}
            aria-pressed={isMuted}
            onClick={onToggleMute}
            sx={{ color: isMuted ? "secondary.main" : "text.secondary" }}
          >
            <PlayerIcon kind={isMuted ? "muted" : "sound"} />
          </IconButton>
          <Slider
            aria-label="Volumen"
            size="small"
            min={0}
            max={1}
            step={0.02}
            value={isMuted ? 0 : volume}
            onChange={(_event, value) => onVolumeChange(Array.isArray(value) ? (value[0] ?? 0) : value)}
            sx={{
              width: 72,
              marginLeft: "4px",
              marginRight: "8px",
              color: "primary.main",
              "& .MuiSlider-thumb": { width: 10, height: 10, boxShadow: "none", "&:hover, &.Mui-focusVisible": { boxShadow: `0 0 0 6px ${alpha(Palette.COMET, 0.18)}` } },
              "& .MuiSlider-rail": { color: Palette.ICE_FAINT, opacity: 1 },
              [NARROW_MEDIA]: { width: "clamp(64px, 22vw, 120px)", marginRight: "4px", "& .MuiSlider-thumb": { width: 14, height: 14 } },
            }}
          />
        </>
      )}
      <IconButton
        size="small"
        aria-label="Banda sonora"
        aria-expanded={isPanelOpen}
        onClick={onOpenPanel}
        sx={{ color: "text.primary" }}
      >
        <PlayerIcon kind="menu" />
      </IconButton>
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 2,
          width: "calc(var(--progress, 0) * 100%)",
          backgroundColor: Palette.COMET,
          transition: "width 0.25s linear",
        }}
      />
    </Stack>
  </Box>
);
