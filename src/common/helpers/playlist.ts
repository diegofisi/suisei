export interface TrackViewModel {
  id: string;
  title: string;
  /** Relative to the page, under public/assets. */
  src: string;
}

/** Background music for the talk; the player starts on the first entry. */
export const PLAYLIST: TrackViewModel[] = [
  { id: "stellar-stellar", title: "Stellar Stellar", src: "assets/stellar-stellar.mp3" },
  { id: "comet", title: "comet", src: "assets/comet.mp3" },
  { id: "bibbidiba", title: "Bibbidiba", src: "assets/bibbidiba.mp3" },
];

export const PLAYER_VOLUME = 0.28;
