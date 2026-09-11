/// <reference types="vite/client" />

/**
 * True only in the single-file classroom build (`npm run build`): the page plays local MP3s copied from
 * `files/audio/`. The dev server and the web build (`--mode web`) play the soundtrack through Spotify.
 */
declare const __LOCAL_AUDIO__: boolean;
