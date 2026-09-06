import type { Ref } from "react";
import { Stack, Typography } from "@mui/material";
import { YearReveal } from "@/features/story/components/shared/YearReveal";
import {
  BUDOKAN_DATELINE,
  BUDOKAN_TITLE,
  BUDOKAN_YEAR,
} from "@/features/story/helpers/budokanContent";

interface BudokanIntroProps {
  /** Holds --r: the gold year fills as the scene opens. */
  yearRef: Ref<HTMLDivElement>;
}

/** Step 0: the date, the venue and why it matters. */
export const BudokanIntro = ({ yearRef }: BudokanIntroProps) => (
  <Stack sx={{ alignItems: "flex-start", gap: "0.9rem" }}>
    <YearReveal year={BUDOKAN_YEAR} yearRef={yearRef} tone="gold" animatedFill />
    <Typography variant="label" sx={{ color: "warning.main" }}>
      {BUDOKAN_DATELINE}
    </Typography>
    <Typography variant="h2">{BUDOKAN_TITLE}</Typography>
  </Stack>
);
