import { useCallback, useEffect, useRef, useState } from "react";
import type { TrackViewModel } from "@/common/helpers/playlist";
import { loadSpotifyIframeApi, type SpotifyEmbedController } from "@/common/helpers/spotifyEmbed";
import { NARROW_MEDIA } from "@/common/helpers/viewport";
import { useBarAutoHide } from "@/common/hooks/useBarAutoHide";
import type { MusicPlayerState } from "@/common/hooks/useMusicPlayer";

/** Height of the embed inside the panel: Spotify's standard card (cover, title, transport). */
const EMBED_HEIGHT = 152;
/** A track counts as finished when playback stops within this many ms of its end. */
const END_TOLERANCE_MS = 1500;
/** Phones start silent (no autoplay); on wide screens the first click or key starts the music, as the local player did. */
const SILENT_START_MEDIA = NARROW_MEDIA.replace("@media ", "");

const noop = (): void => undefined;

/**
 * Same contract as the local player, with Spotify's embed as the sound source. The iframe lives in the soundtrack
 * panel (`embedRef`); the bar drives it through the iFrame API: play/pause, previous/next, pick a track.
 * The API exposes no mute or volume, so those controls are reported as unsupported.
 */
export const useSpotifyPlayer = (tracks: TrackViewModel[], defaultIndex = 0): MusicPlayerState => {
  const barRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SpotifyEmbedController | null>(null);
  const trackIndexRef = useRef(defaultIndex);
  /** Set when a track was loaded because the user asked for it, so it starts as soon as the embed has it. */
  const playOnLoad = useRef(false);
  const advancedAtEnd = useRef(false);
  const [trackIndex, setTrackIndex] = useState(defaultIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [awaitingGesture, setAwaitingGesture] = useState(() => !window.matchMedia(SILENT_START_MEDIA).matches);
  const track = tracks[trackIndex] ?? tracks[0];

  const goTo = useCallback(
    (index: number, play: boolean) => {
      const next = ((index % tracks.length) + tracks.length) % tracks.length;
      const target = tracks[next];
      if (!target) return;
      trackIndexRef.current = next;
      advancedAtEnd.current = false;
      playOnLoad.current = play;
      setTrackIndex(next);
      const controller = controllerRef.current;
      if (!controller) return;
      controller.loadUri(target.spotifyUri);
      if (play) controller.play();
    },
    [tracks],
  );

  // Mount the embed once the API script is in, wire its events, tear it down on unmount.
  useEffect(() => {
    const host = embedRef.current;
    const first = tracks[trackIndexRef.current];
    if (!host || !first) return;
    let cancelled = false;
    let controller: SpotifyEmbedController | null = null;
    // The API replaces the element it is given, so give it a disposable child and keep our node.
    const mount = document.createElement("div");
    host.replaceChildren(mount);

    loadSpotifyIframeApi()
      .then((api) => {
        if (cancelled) return;
        api.createController(mount, { uri: first.spotifyUri, width: "100%", height: EMBED_HEIGHT }, (instance) => {
          if (cancelled) {
            instance.destroy();
            return;
          }
          controller = instance;
          controllerRef.current = instance;
          instance.addListener("playback_update", ({ data }) => {
            const playing = !data.isPaused;
            setIsPlaying((current) => (current === playing ? current : playing));
            if (playing) setAwaitingGesture(false);
            const bar = barRef.current;
            if (bar && data.duration > 0) bar.style.setProperty("--progress", (data.position / data.duration).toFixed(4));
            // The embed stops at the end of a track: chain the next one, as the local playlist did.
            const ended = data.isPaused && data.duration > 0 && data.position >= data.duration - END_TOLERANCE_MS;
            if (ended && !advancedAtEnd.current) {
              advancedAtEnd.current = true;
              goTo(trackIndexRef.current + 1, true);
            }
          });
        });
      })
      .catch(() => {
        // Offline or blocked: the bar stays, silent; nothing else on the page depends on the music.
      });

    return () => {
      cancelled = true;
      controller?.destroy();
      controllerRef.current = null;
    };
    // Mount once: the track list is static and the first track is read from the ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wide screens: the first click or key anywhere starts the music (browsers block sound before a gesture).
  useEffect(() => {
    if (!awaitingGesture) return;
    const start = () => controllerRef.current?.play();
    window.addEventListener("pointerdown", start, { once: true, capture: true });
    window.addEventListener("keydown", start, { once: true, capture: true });
    return () => {
      window.removeEventListener("pointerdown", start, { capture: true });
      window.removeEventListener("keydown", start, { capture: true });
    };
  }, [awaitingGesture]);

  useBarAutoHide(barRef);

  const onToggle = useCallback(() => {
    setAwaitingGesture(false);
    controllerRef.current?.togglePlay();
  }, []);
  const onNext = useCallback(() => goTo(trackIndexRef.current + 1, true), [goTo]);
  const onPrevious = useCallback(() => goTo(trackIndexRef.current - 1, true), [goTo]);
  const onSelect = useCallback((index: number) => goTo(index, true), [goTo]);

  return {
    barRef,
    audioRef,
    embedRef,
    tracks,
    trackIndex,
    track: track ?? { id: "none", title: "", release: "", spotifyUri: "" },
    isPlaying,
    supportsVolume: false,
    isMuted: false,
    volume: 1,
    awaitingGesture,
    source: "spotify",
    onToggle,
    onNext,
    onPrevious,
    onSelect,
    onToggleMute: noop,
    onVolumeChange: noop,
  };
};
