import { IconButton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { PlayerIcon } from "@/common/components/PlayerIcon";
import type { PresenterNavigation } from "@/common/hooks/usePresenterNavigation";
import { Palette } from "@/common/models/palette";

/** Discreet pill in the top-left corner: scene counter plus previous/next, mirroring the keyboard. */
export const PresenterControls = ({ counterRef, onNext, onPrevious }: PresenterNavigation) => (
  <Stack
    direction="row"
    spacing={0.25}
    sx={{
      position: "fixed",
      left: 24,
      top: 14,
      zIndex: 20,
      alignItems: "center",
      height: 40,
      paddingX: "6px",
      borderRadius: 999,
      border: `1px solid ${Palette.ICE_LINE}`,
      background: alpha(Palette.SKY_2, 0.72),
      backdropFilter: "blur(16px)",
      boxShadow: `0 16px 40px ${alpha(Palette.SKY_DEEP, 0.55)}`,
      opacity: 0.85,
      transition: "opacity 0.3s ease",
      "&:hover": { opacity: 1 },
      "@media (max-width: 760px)": { left: 12, top: 10 },
    }}
  >
    <IconButton size="small" aria-label="Sección anterior (←)" onClick={onPrevious} sx={{ color: "text.secondary" }}>
      <PlayerIcon kind="previous" />
    </IconButton>
    <Typography
      ref={counterRef}
      component="span"
      variant="label"
      sx={{ color: "text.secondary", minWidth: "6.5ch", textAlign: "center", fontVariantNumeric: "tabular-nums" }}
    >
      01 / 12
    </Typography>
    <IconButton size="small" aria-label="Siguiente sección (→)" onClick={onNext} sx={{ color: "primary.main" }}>
      <PlayerIcon kind="next" />
    </IconButton>
  </Stack>
);
