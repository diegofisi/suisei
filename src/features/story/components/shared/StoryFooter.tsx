import { Box, Stack, Typography } from "@mui/material";

interface StoryFooterProps {
  pendingScenes: string;
  credits: string;
}

export const StoryFooter = ({ pendingScenes, credits }: StoryFooterProps) => (
  <Box component="footer" sx={{ px: "7vw", pt: "14vh", pb: "18vh", borderTop: 1, borderColor: "divider", textAlign: "center" }}>
    <Stack spacing={2} alignItems="center">
      <Typography variant="label" color="primary.main">
        Fin del preview
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "52ch" }}>
        {pendingScenes}
      </Typography>
      <Typography variant="caption" color="text.disabled" sx={{ maxWidth: "60ch" }}>
        {credits}
      </Typography>
    </Stack>
  </Box>
);
