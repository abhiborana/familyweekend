"use client";

import { useEffect } from "react";
import type { SfxCue } from "@/constants/assets";
import { playSfx, preloadSfx } from "@/lib/sfxCache";

const useSfxPlayer = (cue: SfxCue, nonce: number) => {
  useEffect(() => {
    void preloadSfx();
  }, []);

  useEffect(() => {
    if (cue === "none" || nonce === 0) return;
    void playSfx(cue);
  }, [cue, nonce]);
};

export default useSfxPlayer;
