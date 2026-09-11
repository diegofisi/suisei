import { useEffect } from "react";
import { Box, ButtonBase, IconButton, Link, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { PlayerIcon } from "@/common/components/PlayerIcon";
import { SPOTIFY_PLAYLIST_URL } from "@/common/helpers/playlist";
import { NARROW_MEDIA } from "@/common/helpers/viewport";
import type { MusicPlayerState } from "@/common/hooks/useMusicPlayer";
import { Palette } from "@/common/models/palette";

interface MusicSidebarProps extends MusicPlayerState {
  isOpen: boolean;
  onClose: () => void;
}

const PANEL_WIDTH = 360;

/**
 * Soundtrack panel, opened from the bar's ≡ button: Spotify's embed (on the web build) plus the track list in
 * story order. Always mounted, slid off screen when closed, so the embed keeps playing between openings.
 */
export const MusicSidebar = ({ isOpen, onClose, embedRef, tracks, trackIndex, source, onSelect }: MusicSidebarProps) => {
  // Esc closes, like any panel.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <>
      <Box
        aria-hidden
        onClick={onClose}
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 29,
          background: alpha(Palette.SKY_DEEP, 0.55),
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />
      <Stack
        component="aside"
        aria-label="Banda sonora"
        aria-hidden={!isOpen}
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 30,
          width: `min(${PANEL_WIDTH}px, 86vw)`,
          padding: "20px 20px calc(20px + env(safe-area-inset-bottom, 0px))",
          gap: "18px",
          overflowY: "auto",
          background: alpha(Palette.SKY, 0.94),
          borderLeft: `1px solid ${Palette.ICE_LINE}`,
          backdropFilter: "blur(18px)",
          boxShadow: `-24px 0 60px ${alpha(Palette.SKY_DEEP, 0.6)}`,
          transform: isOpen ? "translateX(0)" : "translateX(105%)",
          visibility: isOpen ? "visible" : "hidden",
          transition: "transform 0.45s cubic-bezier(.2,.8,.2,1), visibility 0s linear " + (isOpen ? "0s" : "0.45s"),
          [NARROW_MEDIA]: { padding: "16px 16px calc(16px + env(safe-area-inset-bottom, 0px))" },
        }}
      >
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="label" sx={{ color: "text.secondary" }}>
            Banda sonora
          </Typography>
          <IconButton size="small" aria-label="Cerrar" onClick={onClose} sx={{ color: "text.primary" }}>
            <PlayerIcon kind="close" />
          </IconButton>
        </Stack>

        {/* Spotify mounts its iframe here; the local player has nothing to show. Hidden panels keep the iframe alive. */}
        <Box
          ref={embedRef}
          sx={{
            display: source === "spotify" ? "block" : "none",
            minHeight: 152,
            borderRadius: 3,
            overflow: "hidden",
            "& iframe": { display: "block", border: 0 },
          }}
        />

        <Stack component="ol" sx={{ listStyle: "none", margin: 0, padding: 0, gap: "6px" }}>
          {tracks.map((track, index) => {
            const isCurrent = index === trackIndex;
            return (
              <Box component="li" key={track.id}>
                <ButtonBase
                  onClick={() => onSelect(index)}
                  aria-current={isCurrent ? "true" : undefined}
                  sx={{
                    width: "100%",
                    justifyContent: "flex-start",
                    textAlign: "left",
                    gap: "12px",
                    padding: "10px 12px",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: isCurrent ? alpha(Palette.COMET, 0.5) : "transparent",
                    backgroundColor: isCurrent ? Palette.COMET_SOFT : "transparent",
                    transition: "background-color 0.25s ease, border-color 0.25s ease",
                    "&:hover": { backgroundColor: isCurrent ? Palette.COMET_SOFT : alpha(Palette.ICE, 0.05) },
                    "&.Mui-focusVisible": { borderColor: Palette.COMET },
                  }}
                >
                  <Typography
                    variant="label"
                    aria-hidden
                    sx={{ color: isCurrent ? "primary.main" : "text.disabled", minWidth: "2ch", fontVariantNumeric: "tabular-nums" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </Typography>
                  <Stack sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: isCurrent ? "primary.main" : "text.primary" }}>
                      {track.title}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {track.release}
                    </Typography>
                  </Stack>
                </ButtonBase>
              </Box>
            );
          })}
        </Stack>

        {source === "spotify" && (
          <Typography variant="caption" color="text.disabled" sx={{ marginTop: "auto" }}>
            <Link href={SPOTIFY_PLAYLIST_URL} target="_blank" rel="noreferrer" underline="hover" sx={{ color: "primary.main" }}>
              Spotify
            </Link>
          </Typography>
        )}
      </Stack>
    </>
  );
};
