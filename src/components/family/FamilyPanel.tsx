"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ConnectionBadge from "@/components/ConnectionBadge";
import { ASSETS } from "@/constants/assets";
import type { ClientRole, TeamId } from "@/engine/types";
import useGameRoom from "@/hooks/useGameRoom";

type FamilyPanelProps = {
  roomCode: string;
};

const FamilyPanel = ({ roomCode }: FamilyPanelProps) => {
  const [teamId, setTeamId] = useState<TeamId | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(`fw-team-${roomCode}`) as TeamId | null;
    if (stored === "A" || stored === "B") setTeamId(stored);
    setReady(true);
  }, [roomCode]);

  const selectTeam = (next: TeamId) => {
    setTeamId(next);
    window.sessionStorage.setItem(`fw-team-${roomCode}`, next);
  };

  if (!ready) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-[#0b1220] text-slate-300">
        Loading…
      </div>
    );
  }

  if (!teamId) {
    return (
      <TeamPicker
        roomCode={roomCode}
        onSelect={selectTeam}
      />
    );
  }

  const role: ClientRole = teamId === "A" ? "familyA" : "familyB";
  return <FamilyPlay roomCode={roomCode} teamId={teamId} role={role} />;
};

type TeamPickerProps = {
  roomCode: string;
  onSelect: (teamId: TeamId) => void;
};

const TeamPicker = ({ roomCode, onSelect }: TeamPickerProps) => {
  const { state, connected, connectionError } = useGameRoom("tv", roomCode);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#0b1220] text-white">
      <Image src={ASSETS.boardArt} alt="" fill className="object-cover opacity-25" priority />
      <div className="absolute inset-0 bg-[#0b1220]/80" />
      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-md flex-col px-5 py-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Image
              src={ASSETS.brandMark}
              alt="Family Weekend"
              width={48}
              height={48}
              className="h-auto w-12 rounded-lg"
            />
            <p className="font-[family-name:var(--font-heading)] text-xl font-semibold text-amber-300">
              Family panel
            </p>
          </div>
          <ConnectionBadge connected={connected} roomCode={roomCode} error={connectionError} />
        </div>
        <div className="mt-10 grid gap-3">
          <p className="text-center text-sm text-slate-300">Choose your family</p>
          <button
            type="button"
            onClick={() => onSelect("A")}
            className="rounded-2xl border border-amber-300/40 bg-amber-400/15 px-4 py-5 text-left transition active:scale-[0.98]"
          >
            <p className="font-[family-name:var(--font-heading)] text-2xl font-semibold">
              {state.familyA.name}
            </p>
            <p className="text-sm text-slate-300">Score {state.familyA.score}</p>
          </button>
          <button
            type="button"
            onClick={() => onSelect("B")}
            className="rounded-2xl border border-sky-300/40 bg-sky-400/15 px-4 py-5 text-left transition active:scale-[0.98]"
          >
            <p className="font-[family-name:var(--font-heading)] text-2xl font-semibold">
              {state.familyB.name}
            </p>
            <p className="text-sm text-slate-300">Score {state.familyB.score}</p>
          </button>
        </div>
      </div>
    </div>
  );
};

type FamilyPlayProps = {
  roomCode: string;
  teamId: TeamId;
  role: ClientRole;
};

const FamilyPlay = ({ roomCode, teamId, role }: FamilyPlayProps) => {
  const { state, connected, connectionError, buzz } = useGameRoom(role, roomCode);
  const family = teamId === "A" ? state.familyA : state.familyB;
  const other = teamId === "A" ? state.familyB : state.familyA;

  const canBuzz =
    state.buzzersOpen &&
    !state.buzzerWinner &&
    (state.phase === "faceOff" || state.faceOffStep === "buzz");

  const isWinner = state.buzzerWinner === teamId;
  const isLoser = state.buzzerWinner !== null && state.buzzerWinner !== teamId;

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#0b1220] text-white">
      <Image src={ASSETS.boardArt} alt="" fill className="object-cover opacity-25" priority />
      <div className="absolute inset-0 bg-[#0b1220]/80" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-md flex-col px-5 py-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Image
              src={ASSETS.brandMark}
              alt="Family Weekend"
              width={48}
              height={48}
              className="h-auto w-12 rounded-lg"
            />
            <div>
              <p className="font-[family-name:var(--font-heading)] text-xl font-semibold text-amber-300">
                Family panel
              </p>
              <p className="text-xs text-slate-400">Buzzer + live score</p>
            </div>
          </div>
          <ConnectionBadge connected={connected} roomCode={roomCode} error={connectionError} />
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/35 p-5 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Your family</p>
          <p className="mt-1 font-[family-name:var(--font-heading)] text-3xl font-semibold text-amber-300">
            {family.name}
          </p>
          <p className="mt-3 font-[family-name:var(--font-heading)] text-5xl font-semibold tabular-nums">
            {family.score}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            vs {other.name} ({other.score})
          </p>
        </div>

        <div className="mt-auto flex flex-1 flex-col items-center justify-center py-8">
          {isWinner ? (
            <p className="mb-4 rounded-full bg-emerald-400/20 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-emerald-200">
              You&apos;re in!
            </p>
          ) : null}
          {isLoser ? (
            <p className="mb-4 rounded-full bg-white/10 px-4 py-2 text-sm text-slate-300">
              Locked out this buzz
            </p>
          ) : null}

          <button
            type="button"
            disabled={!canBuzz}
            onClick={() => buzz(teamId)}
            className={`relative grid size-56 place-items-center rounded-full border-4 transition duration-200 active:scale-[0.96] ${
              canBuzz
                ? "border-amber-200 bg-gradient-to-b from-rose-500 to-rose-700 shadow-[0_12px_40px_rgba(225,29,72,0.45)]"
                : "border-white/15 bg-slate-700/80 opacity-60"
            }`}
          >
            <span className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-wide">
              BUZZ
            </span>
          </button>
          <p className="mt-4 text-center text-sm text-slate-400">
            {state.buzzersOpen
              ? "Buzzers are open — hit it!"
              : "Wait for the host to open buzzers"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FamilyPanel;
