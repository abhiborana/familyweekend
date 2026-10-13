"use client";

type ConnectionBadgeProps = {
  connected: boolean;
  roomCode: string;
  error: string | null;
};

const ConnectionBadge = ({ connected, roomCode, error }: ConnectionBadgeProps) => (
  <div className="flex flex-wrap items-center gap-2 text-xs">
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium ${
        connected
          ? "bg-emerald-500/15 text-emerald-300"
          : "bg-amber-500/15 text-amber-200"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${connected ? "bg-emerald-400" : "bg-amber-300"}`}
      />
      {connected ? "Live" : "Connecting"}
    </span>
    {roomCode ? (
      <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono tracking-wider text-white/80">
        {roomCode}
      </span>
    ) : null}
    {error ? <span className="text-rose-300">{error}</span> : null}
  </div>
);

export default ConnectionBadge;
