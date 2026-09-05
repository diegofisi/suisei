import type { Ref } from "react";
import { Box } from "@mui/material";
import { FactItem } from "@/features/story/components/origins/FactItem";
import type { FactViewModel } from "@/features/story/interfaces/StoryViewModels";

interface FactsListProps {
  facts: FactViewModel[];
  listRef: Ref<HTMLUListElement>;
}

/** The four facts of 2018. The hook sets `data-on` once; each item staggers in. */
export const FactsList = ({ facts, listRef }: FactsListProps) => (
  <Box
    component="ul"
    ref={listRef}
    sx={{
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "grid",
      gap: "1.6rem",
      maxWidth: "56ch",
    }}
  >
    {facts.map((fact, index) => (
      <FactItem key={fact.id} fact={fact} index={index} />
    ))}
  </Box>
);
