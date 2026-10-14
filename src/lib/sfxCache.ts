import { ASSETS, type SfxCue } from "@/constants/assets";

export type PlayableSfx = Exclude<SfxCue, "none">;

const SRC: Record<PlayableSfx, string> = {
  strike: ASSETS.sfx.strike,
  scoresAllot: ASSETS.sfx.scoresAllot,
  buzzerPressed: ASSETS.sfx.buzzerPressed,
  buzzer: ASSETS.sfx.buzzer,
  revealAnswer: ASSETS.sfx.revealAnswer,
};

/** Blob URLs — one network fetch per cue per browser tab, then local replay. */
const blobUrls = new Map<PlayableSfx, string>();
let preloadPromise: Promise<void> | null = null;

const cues = Object.keys(SRC) as PlayableSfx[];

const loadCue = async (cue: PlayableSfx): Promise<void> => {
  if (blobUrls.has(cue)) return;
  const response = await fetch(SRC[cue], { cache: "force-cache" });
  if (!response.ok) return;
  const blob = await response.blob();
  blobUrls.set(cue, URL.createObjectURL(blob));
};

/** Fetch every SFX once into memory. Safe to call repeatedly. */
export const preloadSfx = (): Promise<void> => {
  if (typeof window === "undefined") return Promise.resolve();
  if (!preloadPromise) {
    preloadPromise = Promise.all(cues.map((cue) => loadCue(cue))).then(() => undefined);
  }
  return preloadPromise;
};

/** Play a cue from the in-memory blob (no CDN hit after preload). */
export const playSfx = async (cue: PlayableSfx): Promise<void> => {
  await preloadSfx();
  const url = blobUrls.get(cue);
  if (!url) return;
  const audio = new Audio(url);
  try {
    await audio.play();
  } catch {
    // Autoplay may be blocked until a user gesture.
  }
};
