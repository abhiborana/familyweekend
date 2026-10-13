"use client";

import { create } from "zustand";
import { createInitialState } from "@/engine";
import type { ClientRole, GameAction, GameState, TeamId } from "@/engine/types";

type GameStore = {
  state: GameState;
  role: ClientRole | null;
  roomCode: string;
  connected: boolean;
  connectionError: string | null;
  setRole: (role: ClientRole) => void;
  setRoomCode: (roomCode: string) => void;
  setConnected: (connected: boolean) => void;
  setConnectionError: (error: string | null) => void;
  hydrate: (state: GameState) => void;
  sendAction: ((action: GameAction) => void) | null;
  sendBuzz: ((teamId: TeamId) => void) | null;
  bindSenders: (handlers: {
    sendAction: (action: GameAction) => void;
    sendBuzz: (teamId: TeamId) => void;
  }) => void;
};

const useGameStore = create<GameStore>((set) => ({
  state: createInitialState(),
  role: null,
  roomCode: "",
  connected: false,
  connectionError: null,
  setRole: (role) => set({ role }),
  setRoomCode: (roomCode) => set({ roomCode }),
  setConnected: (connected) => set({ connected }),
  setConnectionError: (connectionError) => set({ connectionError }),
  hydrate: (state) => set({ state }),
  sendAction: null,
  sendBuzz: null,
  bindSenders: ({ sendAction, sendBuzz }) => set({ sendAction, sendBuzz }),
}));

export default useGameStore;
