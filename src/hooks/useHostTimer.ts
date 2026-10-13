"use client";

import { useEffect } from "react";
import type { GameAction } from "@/engine/types";

const useHostTimer = (
  timerRunning: boolean,
  dispatch: (action: GameAction) => void,
) => {
  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning, dispatch]);
};

export default useHostTimer;
