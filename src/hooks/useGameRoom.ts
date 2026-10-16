"use client";

import PartySocket from "partysocket";
import { useEffect } from "react";
import type { ClientRole, GameAction, GameState, TeamId } from "@/engine/types";
import {
  getPartyHost,
  getPartyProtocol,
  normalizeRoomCode,
} from "@/lib/party";
import useGameStore from "@/store";

type ServerMessage =
  | { type: "state"; state: GameState }
  | { type: "error"; message: string };

const useGameRoom = (role: ClientRole, roomCode: string) => {
  const connected = useGameStore((store) => store.connected);
  const connectionError = useGameStore((store) => store.connectionError);
  const state = useGameStore((store) => store.state);

  useEffect(() => {
    const code = normalizeRoomCode(roomCode);
    if (!code) return;

    const store = useGameStore.getState();
    store.setRole(role);
    store.setRoomCode(code);
    store.setConnectionError(null);

    let disposed = false;
    const socket = new PartySocket({
      host: getPartyHost(),
      room: code,
      protocol: getPartyProtocol(),
      minReconnectionDelay: 800,
      maxReconnectionDelay: 5000,
      maxRetries: 12,
    });

    const sendAction = (action: GameAction) => {
      if (socket.readyState === socket.OPEN) {
        socket.send(JSON.stringify({ type: "action", action }));
      }
    };

    const sendBuzz = (teamId: TeamId) => {
      if (socket.readyState === socket.OPEN) {
        socket.send(JSON.stringify({ type: "buzz", teamId }));
      }
    };

    store.bindSenders({ sendAction, sendBuzz });

    const handleOpen = () => {
      if (disposed) return;
      useGameStore.getState().setConnected(true);
      useGameStore.getState().setConnectionError(null);
      socket.send(JSON.stringify({ type: "hello", role }));
    };

    const handleMessage = (event: MessageEvent) => {
      if (disposed) return;
      try {
        const parsed = JSON.parse(String(event.data)) as ServerMessage;
        if (parsed.type === "state") {
          useGameStore.getState().hydrate(parsed.state);
          return;
        }
        if (parsed.type === "error") {
          useGameStore.getState().setConnectionError(parsed.message);
        }
      } catch {
        useGameStore.getState().setConnectionError("Failed to parse room message");
      }
    };

    const handleClose = () => {
      if (disposed) return;
      useGameStore.getState().setConnected(false);
    };

    const handleError = () => {
      if (disposed) return;
      useGameStore.getState().setConnectionError(
        `PartyServer connection error — expected ${getPartyHost()}. Restart with pnpm party:dev`,
      );
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("message", handleMessage);
    socket.addEventListener("close", handleClose);
    socket.addEventListener("error", handleError);

    return () => {
      disposed = true;
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("message", handleMessage);
      socket.removeEventListener("close", handleClose);
      socket.removeEventListener("error", handleError);
      // close() sets _shouldReconnect=false and stops the retry loop
      socket.close();
      useGameStore.getState().setConnected(false);
    };
  }, [role, roomCode]);

  const dispatch = (action: GameAction) => {
    useGameStore.getState().sendAction?.(action);
  };

  const buzz = (teamId: TeamId) => {
    useGameStore.getState().sendBuzz?.(teamId);
  };

  return { state, connected, connectionError, dispatch, buzz };
};

export default useGameRoom;
