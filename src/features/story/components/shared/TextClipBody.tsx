import { Stack, Typography } from "@mui/material";

interface TextClipBodyProps {
  /** Short lines; "\n" splits them. */
  text: string;
  isSakura: boolean;
}

/** Image-less clip: a couple of big lines, for the facts that have no picture. */
export const TextClipBody = ({ text, isSakura }: TextClipBodyProps) => (
  <Stack sx={{ flex: 1, justifyContent: "center", gap: "0.2rem", padding: "1.4rem 1.4rem 0.4rem" }}>
    {text.split("\n").map((line) => (
      <Typography
        key={line}
        variant="h4"
        sx={{ color: isSakura ? "secondary.main" : "primary.main", fontWeight: 700, lineHeight: 1.15 }}
      >
        {line}
      </Typography>
    ))}
  </Stack>
);
