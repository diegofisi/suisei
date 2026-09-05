import { Stack, Typography } from "@mui/material";

interface RejectionHeadlineProps {
  eyebrow: string;
  headline: string;
}

/** Scene 4 lede: the SAKURA eyebrow plus the sentence that names what every agency asked for. */
export const RejectionHeadline = ({ eyebrow, headline }: RejectionHeadlineProps) => (
  <Stack sx={{ gap: "1.1rem", marginBottom: "2.6rem" }}>
    <Typography variant="label" sx={{ color: "secondary.main" }}>
      {eyebrow}
    </Typography>
    <Typography variant="h3" sx={{ maxWidth: "18ch" }}>
      {headline}
    </Typography>
  </Stack>
);
