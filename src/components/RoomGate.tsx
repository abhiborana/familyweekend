"use client";

import { useSearchParams } from "next/navigation";
import type { ComponentType } from "react";
import { normalizeRoomCode } from "@/lib/party";

type RoomPanelProps = {
  roomCode: string;
};

type RoomGateProps = {
  Panel: ComponentType<RoomPanelProps>;
};

const RoomGate = ({ Panel }: RoomGateProps) => {
  const params = useSearchParams();
  const roomCode = normalizeRoomCode(params.get("room") ?? "");

  if (!roomCode) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-[#0b1220] px-6 text-center text-slate-200">
        <div>
          <p className="font-[family-name:var(--font-heading)] text-2xl text-amber-300">
            Missing room code
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Open this panel from the home page with a room code.
          </p>
          <a href="/" className="mt-4 inline-block text-amber-200 underline">
            Go home
          </a>
        </div>
      </div>
    );
  }

  return <Panel roomCode={roomCode} />;
};

export default RoomGate;
