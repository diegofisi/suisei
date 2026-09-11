import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { PLAYER_VOLUME, type TrackViewModel } from "@/common/helpers/playlist";
import { NARROW_MEDIA } from "@/common/helpers/viewport";
import { useBarAutoHide } from "@/common/hooks/useBarAutoHide";

/** What the music bar and the soundtrack panel need, whoever produces the sound (local files or Spotify). */
export interface MusicPlayerState {
  /** Bar root; carries `data-hidden` (scrolled away) and `--progress` (0→1 of the current track). */
  barRef: RefObject<HTMLDivElement | null>;
  /** Local player: the <audio> element. Spotify: unused. */
  audioRef: RefObject<HTMLAudioElement | null>;
  /** Spotify: the node the embed (iframe) is mounted into, inside the panel. Local: unused. */
  embedRef: RefObject<HTMLDivElement | null>;
  tracks: TrackViewModel[];
  trackIndex: number;
  track: TrackViewModel;
  isPlaying: boolean;
  /** False for Spotify: the embed exposes no mute or volume, only transport. */
  supportsVolume: boolean;
  isMuted: boolean;
  /** 0..1 */
  volume: number;
  /** Autoplay was blocked: the first click or key anywhere will start the music. */
  awaitingGesture: boolean;
  /** Where the sound comes from, for the panel's footnote. */
  source: "local" | "spotify";
  onToggle: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSelect: (index: number) => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
}

/** Phones start muted (a classroom projector does not); the bar's speaker button turns the sound on. */
const STARTS_MUTED_MEDIA = NARROW_MEDIA.replace("@media ", "");

/** Owns the <audio> element (classroom build): playlist, autoplay handshake, mute, and hiding the bar while scrolling. */
export const useMusicPlayer = (tracks: TrackViewModel[], defaultIndex = 0): MusicPlayerState => {
  const barRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const [trackIndex, setTrackIndex] = useState(defaultIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => window.matchMedia(STARTS_MUTED_MEDIA).matches);
  const [volume, setVolume] = useState(PLAYER_VOLUME);
  const [awaitingGesture, setAwaitingGesture] = useState(false);
  const wantsPlayback = useRef(true);
  const track = tracks[trackIndex] ?? tracks[0];

  const tryPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => setAwaitingGesture(false))
      .catch(() => setAwaitingGesture(true));
  }, []);

  // Keep the element in step with the React state (React only re-renders on the rare control clicks).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = isMuted;
  }, [isMuted, volume]);

  // Track change: (re)load and resume if the player was running.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    if (wantsPlayback.current) tryPlay();
  }, [trackIndex, tryPlay]);

  // Element events → state; progress goes straight to a CSS variable.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setTrackIndex((index) => (index + 1) % tracks.length);
    const onTime = () => {
      const bar = barRef.current;
      if (!bar || !audio.duration) return;
      bar.style.setProperty("--progress", (audio.currentTime / audio.duration).toFixed(4));
    };
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTime);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTime);
    };
  }, [tracks.length]);

  // Browsers block sound before the first gesture: the first click or key anywhere starts the music.
  useEffect(() => {
    if (!awaitingGesture) return;
    const start = () => {
      if (wantsPlayback.current) tryPlay();
    };
    window.addEventListener("pointerdown", start, { once: true, capture: true });
    window.addEventListener("keydown", start, { once: true, capture: true });
    return () => {
      window.removeEventListener("pointerdown", start, { capture: true });
      window.removeEventListener("keydown", start, { capture: true });
    };
  }, [awaitingGesture, tryPlay]);

  useBarAutoHide(barRef);

  const onToggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      wantsPlayback.current = true;
      tryPlay();
      return;
    }
    wantsPlayback.current = false;
    audio.pause();
  }, [tryPlay]);

  const onNext = useCallback(() => setTrackIndex((index) => (index + 1) % tracks.length), [tracks.length]);
  const onPrevious = useCallback(
    () => setTrackIndex((index) => (index - 1 + tracks.length) % tracks.length),
    [tracks.length],
  );
  const onSelect = useCallback(
    (index: number) => {
      wantsPlayback.current = true;
      setTrackIndex(((index % tracks.length) + tracks.length) % tracks.length);
    },
    [tracks.length],
  );
  const onToggleMute = useCallback(() => setIsMuted((muted) => !muted), []);
  const onVolumeChange = useCallback((next: number) => {
    setVolume(Math.min(1, Math.max(0, next)));
    // Dragging the slider up again is the natural way to un-mute.
    if (next > 0) setIsMuted(false);
  }, []);

  return {
    barRef,
    audioRef,
    embedRef,
    tracks,
    trackIndex,
    track: track ?? { id: "none", title: "", release: "", spotifyUri: "" },
    isPlaying,
    supportsVolume: true,
    isMuted,
    volume,
    awaitingGesture,
    source: "local",
    onToggle,
    onNext,
    onPrevious,
    onSelect,
    onToggleMute,
    onVolumeChange,
  };
};
