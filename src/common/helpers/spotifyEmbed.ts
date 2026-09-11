// Minimal typing of Spotify's iFrame API (https://developer.spotify.com/documentation/embeds/references/iframe-api).

export interface SpotifyPlaybackUpdate {
  isPaused: boolean;
  isBuffering: boolean;
  /** Milliseconds. */
  duration: number;
  /** Milliseconds. */
  position: number;
  playingURI: string;
}

export interface SpotifyEmbedController {
  loadUri(spotifyUri: string): void;
  play(): void;
  pause(): void;
  resume(): void;
  togglePlay(): void;
  seek(seconds: number): void;
  destroy(): void;
  addListener(event: "ready", callback: () => void): void;
  addListener(event: "playback_update" | "playback_started", callback: (event: { data: SpotifyPlaybackUpdate }) => void): void;
}

export interface SpotifyEmbedOptions {
  uri: string;
  width?: number | string;
  height?: number | string;
  theme?: "dark" | "0";
}

export interface SpotifyIFrameApi {
  createController(element: HTMLElement, options: SpotifyEmbedOptions, callback: (controller: SpotifyEmbedController) => void): void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameApi) => void;
  }
}

const SCRIPT_SRC = "https://open.spotify.com/embed/iframe-api/v1";

let apiPromise: Promise<SpotifyIFrameApi> | null = null;

/** Loads Spotify's iFrame API once; every caller shares the same promise. */
export const loadSpotifyIframeApi = (): Promise<SpotifyIFrameApi> => {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<SpotifyIFrameApi>((resolve, reject) => {
    window.onSpotifyIframeApiReady = (api) => resolve(api);
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onerror = () => {
      apiPromise = null;
      reject(new Error("Spotify iFrame API could not be loaded"));
    };
    document.head.appendChild(script);
  });
  return apiPromise;
};
