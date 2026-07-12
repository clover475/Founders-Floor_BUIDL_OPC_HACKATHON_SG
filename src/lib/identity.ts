import type { Participant } from "@/types/domain";

const IDENTITY_KEY = "founders-floor:identity:v1";

type StoredIdentity = {
  participantId: string;
  nickname: string;
};

export function createLocalId(prefix = "local") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createParticipant(nickname?: string): Participant {
  return {
    participantId: createLocalId(),
    nickname: nickname?.trim() || "Solo founder",
  };
}

export function getOrCreateParticipant(): Participant {
  if (typeof window === "undefined") {
    return createParticipant();
  }

  const stored = window.localStorage.getItem(IDENTITY_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as StoredIdentity;
      if (parsed.participantId && parsed.nickname) {
        return parsed;
      }
    } catch {
      window.localStorage.removeItem(IDENTITY_KEY);
    }
  }

  const participant = createParticipant();
  window.localStorage.setItem(IDENTITY_KEY, JSON.stringify(participant));
  return participant;
}

export function saveParticipantNickname(nickname: string) {
  if (typeof window === "undefined") {
    return;
  }

  const current = getOrCreateParticipant();
  window.localStorage.setItem(
    IDENTITY_KEY,
    JSON.stringify({ ...current, nickname: nickname.trim() || current.nickname }),
  );
}
