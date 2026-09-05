import { Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import { TODAY_OMIKUJI } from "@/features/story/helpers/todayContent";

/** The omikuji anecdote: the doubt behind the milestone, so it is SAKURA, not COMET. */
export const OmikujiNote = () => (
  <Stack
    sx={{
      gap: "0.5rem",
      padding: "0.85rem 1rem",
      borderRadius: 2,
      border: "1px solid",
      borderColor: alpha(Palette.SAKURA, 0.38),
      backgroundColor: Palette.SAKURA_SOFT,
    }}
  >
    <Typography variant="jp" sx={{ color: "secondary.main" }}>
      {TODAY_OMIKUJI.title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {TODAY_OMIKUJI.body}
    </Typography>
  </Stack>
);
