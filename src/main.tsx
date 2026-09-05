import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "@/common/theme/theme";
import { StoryPage } from "@/features/story/pages/StoryPage";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StoryPage />
      </ThemeProvider>
    </StrictMode>,
  );
}
