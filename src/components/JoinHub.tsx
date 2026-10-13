"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/constants/assets";
import { createRoomCode, normalizeRoomCode } from "@/lib/party";

const JoinHub = () => {
  const [roomCode, setRoomCode] = useState("");
  const code = normalizeRoomCode(roomCode);

  const makeRoom = () => {
    setRoomCode(createRoomCode());
  };

  const hrefFor = (path: string) => (code ? `${path}?room=${encodeURIComponent(code)}` : "#");

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#070b16] text-white">
      <Image src={ASSETS.boardArt} alt="" fill priority className="object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#070b16]/55 via-[#0b1220]/85 to-[#070b16]" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-3xl flex-col justify-center px-6 py-10">
        <div className="flex items-center gap-4">
          <Image
            src={ASSETS.brandMark}
            alt="Family Weekend"
            width={80}
            height={80}
            className="h-auto w-20 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
          />
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl font-semibold tracking-tight text-amber-300 md:text-6xl">
              Family Weekend
            </h1>
            <p className="mt-1 max-w-md text-slate-300">
              Host tablet, TV board, and family buzzers — one live room.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm">
          <label className="grid gap-2 text-sm text-slate-300">
            Room code
            <div className="flex flex-wrap gap-2">
              <input
                className="min-w-[12rem] flex-1 rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono tracking-[0.2em] uppercase"
                value={roomCode}
                onChange={(event) => setRoomCode(event.target.value)}
                placeholder="FW-ABCD"
              />
              <Button type="button" variant="secondary" onClick={makeRoom}>
                New room
              </Button>
            </div>
          </label>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <RoleLink href={hrefFor("/host")} disabled={!code} label="Host" hint="Tablet controls" />
            <RoleLink href={hrefFor("/tv")} disabled={!code} label="TV" hint="Board display" />
            <RoleLink href={hrefFor("/family")} disabled={!code} label="Family" hint="Phone buzzer" />
          </div>

          <p className="mt-5 text-xs text-slate-400">
            Run <code className="text-amber-200">pnpm partykit:dev</code> locally alongside{" "}
            <code className="text-amber-200">pnpm dev</code>. Set{" "}
            <code className="text-amber-200">NEXT_PUBLIC_PARTYKIT_HOST</code> for deploy.
          </p>
        </div>
      </div>
    </div>
  );
};

type RoleLinkProps = {
  href: string;
  disabled: boolean;
  label: string;
  hint: string;
};

const RoleLink = ({ href, disabled, label, hint }: RoleLinkProps) => {
  if (disabled) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 opacity-40">
        <p className="font-[family-name:var(--font-heading)] text-xl font-semibold">{label}</p>
        <p className="text-sm text-slate-400">{hint}</p>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="rounded-2xl border border-amber-300/30 bg-amber-400/10 px-4 py-5 transition hover:border-amber-300/60 hover:bg-amber-400/15 active:scale-[0.99]"
    >
      <p className="font-[family-name:var(--font-heading)] text-xl font-semibold text-amber-200">
        {label}
      </p>
      <p className="text-sm text-slate-300">{hint}</p>
    </Link>
  );
};

export default JoinHub;
