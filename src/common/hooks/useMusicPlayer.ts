import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { subscribeScrub } from "@/common/helpers/scrollScrubber";
import { PLAYER_VOLUME, type TrackViewModel } from "@/common/helpers/playlist";

export interface MusicPlayerState {
  /** Bar root; carries `data-hidden` (scrolled away) and `--progress` (0→1 of the current track). */
  barRef: RefObject<HTMLDivElement | null>;
  audioRef: RefObject<HTMLAudioElement | null>;
  track: TrackViewModel;
  isPlaying: boolean;
  isMuted: boolean;
  /** 0..1 */
  volume: number;
  /** Autoplay was blocked: the first click or key anywhere will start the music. */
  awaitingGesture: boolean;
  onToggle: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
}

/** Phones start muted (a classroom projector does not); the pill's speaker button turns the sound on. */
const STARTS_MUTED_MEDIA = "(max-width: 760px)";

/** Scroll distance (px) before the bar hides; it comes back on any upward scroll or when hovered. */
const HIDE_AFTER_PX = 120;
const SCROLL_DEADBAND_PX = 4;

/** Owns the <audio> element: playlist, autoplay handshake, mute, and hiding the bar while the page scrolls down. */
export const useMusicPlayer = (tracks: TrackViewModel[], defaultIndex = 0): MusicPlayerState => {
  const barRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
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

  // Hide while scrolling down, show on the way up. Written as a data attribute: no React work per frame.
  useEffect(() => {
    let lastY = window.scrollY;
    return subscribeScrub(({ scrollY }) => {
      const bar = barRef.current;
      const delta = scrollY - lastY;
      if (!bar || Math.abs(delta) < SCROLL_DEADBAND_PX) return;
      lastY = scrollY;
      const hidden = delta > 0 && scrollY > HIDE_AFTER_PX ? "true" : "false";
      if (bar.dataset.hidden !== hidden) bar.dataset.hidden = hidden;
    });
  }, []);

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
  const onToggleMute = useCallback(() => setIsMuted((muted) => !muted), []);
  const onVolumeChange = useCallback((next: number) => {
    setVolume(Math.min(1, Math.max(0, next)));
    // Dragging the slider up again is the natural way to un-mute.
    if (next > 0) setIsMuted(false);
  }, []);

  return {
    barRef,
    audioRef,
    track: track ?? { id: "none", title: "", src: "" },
    isPlaying,
    isMuted,
    volume,
    awaitingGesture,
    onToggle,
    onNext,
    onPrevious,
    onToggleMute,
    onVolumeChange,
  };
};
