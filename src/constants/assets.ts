export const ASSETS = {
  /** Light logo for dark UI chrome and branding view. */
  logoLite: "/logo-lite.png",
  logo: "/logo.png",
  /** @deprecated Prefer logoLite — kept as alias for existing imports. */
  brandMark: "/logo-lite.png",
  boardArt: "/board-art.png",
  sfx: {
    strike: "/strike.mp3",
    scoresAllot: "/scores-allot.mp3",
    buzzerPressed: "/buzzer-pressed.wav",
    buzzer: "/buzzer.mp3",
    revealAnswer: "/reveal-answer.mp3",
  },
} as const;

export type SfxCue =
  | "strike"
  | "scoresAllot"
  | "buzzerPressed"
  | "buzzer"
  | "revealAnswer"
  | "none";
