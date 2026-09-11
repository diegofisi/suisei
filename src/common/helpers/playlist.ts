export interface TrackViewModel {
  id: string;
  title: string;
  /** Album or single, with its year. */
  release: string;
  /** Spotify URI the embed loads (track, or album for a single). */
  spotifyUri: string;
  /** Local file for the classroom build only (relative to the page); tracks without one exist only on Spotify. */
  src?: string;
}

/** The soundtrack in story order: from the indie years to today. The web plays it through Spotify. */
export const PLAYLIST: TrackViewModel[] = [
  { id: "comet", title: "comet", release: "Still Still Stellar · 2021", spotifyUri: "spotify:track:5th8D9oZt1VAuReQ2mtkwH", src: "assets/comet.mp3" },
  { id: "stellar-stellar", title: "Stellar Stellar", release: "Still Still Stellar · 2021", spotifyUri: "spotify:track:6OC9BOO9qGXQARZGWb8rqy", src: "assets/stellar-stellar.mp3" },
  { id: "ghost", title: "GHOST", release: "Single · 2021", spotifyUri: "spotify:track:6Ft1XuvNszzYKUzWYK67VR" },
  { id: "bibbidiba", title: "Bibbidiba", release: "Single · 2024", spotifyUri: "spotify:track:0ShUHmWaz48KgyjaOG7Tpv", src: "assets/bibbidiba.mp3" },
  { id: "orbital-period", title: "Orbital Period", release: "Single · 2025", spotifyUri: "spotify:track:6zG5U3wCnQfYKrMSWWmbD2" },
  { id: "gum-and-drop", title: "GUM & DROP", release: "Single · 2026", spotifyUri: "spotify:album:1UrRVoRFsslGvbiUDUvtIQ" },
];

/** Spotify's own "This Is Hoshimachi Suisei" playlist, linked from the panel. */
export const SPOTIFY_PLAYLIST_URL = "https://open.spotify.com/playlist/37i9dQZF1DZ06evO49Wc2k";

/** Classroom build: only the tracks that exist as local files. */
export const LOCAL_PLAYLIST: TrackViewModel[] = PLAYLIST.filter((track) => track.src !== undefined);

export const PLAYER_VOLUME = 0.28;
