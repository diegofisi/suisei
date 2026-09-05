import { Stack, Typography } from "@mui/material";

export interface SignatureCaptionProps {
  label: string;
  note: string;
}

export const SignatureCaption = ({ label, note }: SignatureCaptionProps) => (
  <Stack alignItems="center" sx={{ gap: 1.2, px: "7vw" }}>
    <Typography variant="label" color="primary.main">
      {label}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", maxWidth: "42ch" }}>
      {note}
    </Typography>
  </Stack>
);
