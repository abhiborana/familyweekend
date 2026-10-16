export const getPartyHost = (): string => {
  if (typeof process !== "undefined") {
    const host =
      process.env.NEXT_PUBLIC_PARTY_HOST ??
      process.env.NEXT_PUBLIC_PARTYKIT_HOST;
    if (host) return host;
  }
  return "127.0.0.1:1999";
};

export const getPartyProtocol = (): "ws" | "wss" => {
  const host = getPartyHost();
  if (host.includes("127.0.0.1") || host.includes("localhost")) return "ws";
  return "wss";
};

export const normalizeRoomCode = (value: string): string =>
  value.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 12);

export const createRoomCode = (): string => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `FW-${suffix}`;
};
