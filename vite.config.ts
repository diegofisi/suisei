import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { fileURLToPath, URL } from "node:url";

// Two builds from the same source:
// - default (`npm run build`): one self-contained dist/index.html that opens from file:// on the classroom projector.
// - `--mode web` (`npm run build:web`, used by Vercel): a regular split bundle with hashed, cacheable chunks.
export default defineConfig(({ mode }) => {
  const isWeb = mode === "web";
  return {
    base: "./",
    plugins: [react(), ...(isWeb ? [] : [viteSingleFile()])],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    build: {
      target: "es2022",
      assetsInlineLimit: isWeb ? 4096 : 0,
      cssCodeSplit: isWeb,
      reportCompressedSize: true,
      rollupOptions: isWeb
        ? {
            output: {
              // All vendor code in one long-lived chunk (splitting react/mui further creates circular chunks):
              // a copy change re-downloads only the app chunk.
              manualChunks: (id: string) => (id.includes("node_modules") ? "vendor" : undefined),
            },
          }
        : {},
    },
  };
});
