export const ASSETS = {
  brandMark: "/brand-mark.png",
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
