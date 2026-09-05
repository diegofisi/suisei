import { Box, Stack, Typography } from "@mui/material";

interface StoryFooterProps {
  sources: string;
  credits: string;
}

export const StoryFooter = ({ sources, credits }: StoryFooterProps) => (
  <Box component="footer" sx={{ px: "7vw", pt: "10vh", pb: "14vh", borderTop: 1, borderColor: "divider", textAlign: "center" }}>
    <Stack spacing={2} alignItems="center">
      <Typography variant="label" color="primary.main">
        Fuentes y créditos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "64ch" }}>
        {sources}
      </Typography>
      <Typography variant="caption" color="text.disabled" sx={{ maxWidth: "60ch" }}>
        {credits}
      </Typography>
    </Stack>
  </Box>
);
