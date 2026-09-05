import type { Ref } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Palette } from "@/common/models/palette";
import type { TurnMilestoneViewModel } from "@/features/story/helpers/turnContent";

interface TurnMilestoneProps {
  milestone: TurnMilestoneViewModel;
  itemRef: Ref<HTMLDivElement>;
}

/** One dated step of 2019. Lights up in COMET when the drawn line reaches it (`data-lit`). */
export const TurnMilestone = ({ milestone, itemRef }: TurnMilestoneProps) => (
  <Box
    ref={itemRef}
    data-lit="false"
    sx={{
      display: "grid",
      gridTemplateColumns: "1.7rem minmax(0, 1fr)",
      columnGap: "1rem",
      alignItems: "start",
      opacity: 0.4,
      transition: "opacity 0.5s ease",
      '&[data-lit="true"]': { opacity: 1 },
    }}
  >
    <Box
      aria-hidden
      sx={{
        justifySelf: "center",
        marginTop: "0.35rem",
        width: 11,
        height: 11,
        borderRadius: "50%",
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.default",
        transition: "background-color 0.4s ease, box-shadow 0.5s ease, border-color 0.4s ease",
        '[data-lit="true"] &': {
          backgroundColor: Palette.COMET,
          borderColor: Palette.COMET,
          boxShadow: `0 0 14px 3px ${Palette.COMET_SOFT}`,
        },
      }}
    />
    <Stack sx={{ gap: "0.5rem", minWidth: 0 }}>
      <Typography
        variant="label"
        sx={{
          color: "text.disabled",
          transition: "color 0.4s ease",
          '[data-lit="true"] &': { color: "primary.main" },
        }}
      >
        {milestone.date}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "46ch" }}>
        {milestone.text}
      </Typography>
    </Stack>
  </Box>
);
