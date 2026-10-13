"use client";

import { useEffect, useRef } from "react";
import { ASSETS, type SfxCue } from "@/constants/assets";

const SRC: Record<Exclude<SfxCue, "none">, string> = {
  strike: ASSETS.sfx.strike,
  scoresAllot: ASSETS.sfx.scoresAllot,
  buzzerPressed: ASSETS.sfx.buzzerPressed,
  buzzer: ASSETS.sfx.buzzer,
  revealAnswer: ASSETS.sfx.revealAnswer,
};

const useSfxPlayer = (cue: SfxCue, nonce: number) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (cue === "none" || nonce === 0) return;
    const src = SRC[cue];
    if (!src) return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    audioRef.current.src = src;
    void audioRef.current.play().catch(() => {
      // Autoplay may be blocked until user gesture on some browsers.
    });
  }, [cue, nonce]);
};

export default useSfxPlayer;
