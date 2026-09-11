import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { join } from "node:path";

const AUDIO_SOURCE = fileURLToPath(new URL("./files/audio", import.meta.url));

/**
 * Classroom build only: the background MP3s live outside the repo (`files/audio/`, ignored by git) and are copied
 * next to the single-file page as `dist/assets/*.mp3`, where `playlist.ts` expects them.
 */
const classroomAudio = (): Plugin => ({
  name: "suisei-classroom-audio",
  apply: "build",
  closeBundle() {
    if (!existsSync(AUDIO_SOURCE)) {
      this.warn(`No local audio found in ${AUDIO_SOURCE}; the classroom build will be silent.`);
      return;
    }
    const target = fileURLToPath(new URL("./dist/assets", import.meta.url));
    mkdirSync(target, { recursive: true });
    for (const file of readdirSync(AUDIO_SOURCE).filter((name) => name.endsWith(".mp3"))) {
      copyFileSync(join(AUDIO_SOURCE, file), join(target, file));
    }
  },
});

// Two builds from the same source:
// - default (`npm run build`): one self-contained dist/index.html that opens from file:// on the classroom projector,
//   with the local MP3s beside it.
// - `--mode web` (`npm run build:web`, used by Vercel): a regular split bundle with hashed, cacheable chunks; the music
//   comes from Spotify's embed, so no audio file is ever published. The dev server behaves like the web build.
export default defineConfig(({ mode, command }) => {
  const isWeb = mode === "web";
  const localAudio = command === "build" && !isWeb;
  return {
    base: "./",
    plugins: [react(), ...(isWeb ? [] : [viteSingleFile()]), ...(localAudio ? [classroomAudio()] : [])],
    define: { __LOCAL_AUDIO__: JSON.stringify(localAudio) },
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
