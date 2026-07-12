"use client";

import type { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createLocalId, getOrCreateParticipant } from "@/lib/identity";
import { getRealtimeConfig } from "@/lib/realtime/config";
import { getSupabaseBrowserClient } from "@/lib/realtime/client";
import { loadSession, loadShips, saveShips } from "@/lib/storage/repository";
import type { RoomId } from "@/types/domain";
import type { ElevatorEvent, ElevatorPresence, PitchFeedbackInput } from "@/types/realtime";

const ROUND_SECONDS = 30;

type ElevatorStatus = "demo" | "idle" | "connecting" | "connected" | "error";
type ElevatorRole = "speaker" | "audience";

type ElevatorRound = {
  roundId: string;
  speakerId: string;
  speakerName: string;
  pitch: string;
  startedAt: string;
  endsAt: string;
  ended: boolean;
};

export type PitchFeedbackResult = PitchFeedbackInput & {
  participantId: string;
  nickname: string;
  submittedAt: string;
};

function isElevatorPresence(value: unknown): value is ElevatorPresence {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ElevatorPresence>;
  return (
    typeof candidate.participantId === "string" &&
    typeof candidate.nickname === "string" &&
    (candidate.role === "speaker" || candidate.role === "audience") &&
    typeof candidate.joinedAt === "string"
  );
}

function flattenPresenceState(state: Record<string, unknown[]>): ElevatorPresence[] {
  return Object.values(state)
    .flat()
    .filter(isElevatorPresence)
    .sort((a, b) => a.joinedAt.localeCompare(b.joinedAt));
}

function isPitchFeedbackInput(value: unknown): value is PitchFeedbackInput {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PitchFeedbackInput>;
  return (
    typeof candidate.understood === "boolean" &&
    typeof candidate.wantsFollowUp === "boolean" &&
    typeof candidate.couldBeUser === "boolean" &&
    typeof candidate.question === "string"
  );
}

function isElevatorEvent(value: unknown): value is ElevatorEvent {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ElevatorEvent>;
  if (candidate.type === "round_started") {
    return (
      typeof candidate.roundId === "string" &&
      typeof candidate.speakerId === "string" &&
      typeof candidate.pitch === "string" &&
      typeof candidate.endsAt === "string"
    );
  }

  if (candidate.type === "feedback_submitted") {
    return typeof candidate.roundId === "string" && isPitchFeedbackInput(candidate.feedback);
  }

  if (candidate.type === "round_ended" || candidate.type === "round_reset") {
    return typeof candidate.roundId === "string";
  }

  return false;
}

function createRound(roundId: string, speakerId: string, speakerName: string, pitch: string, endsAt: string) {
  const endTime = new Date(endsAt).getTime();
  const startedAt = Number.isFinite(endTime)
    ? new Date(endTime - ROUND_SECONDS * 1000).toISOString()
    : new Date().toISOString();

  return {
    roundId,
    speakerId,
    speakerName,
    pitch,
    startedAt,
    endsAt,
    ended: false,
  };
}

export function useElevatorStage() {
  const config = useMemo(() => getRealtimeConfig(), []);
  const client = useMemo(() => getSupabaseBrowserClient(), []);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const currentRoundRef = useRef<ElevatorRound | null>(null);
  const participantsRef = useRef<ElevatorPresence[]>([]);
  const roleRef = useRef<ElevatorRole | null>(null);
  const participant = useMemo(() => getOrCreateParticipant(), []);

  const [status, setStatus] = useState<ElevatorStatus>(config.enabled ? "idle" : "demo");
  const [role, setRole] = useState<ElevatorRole | null>(null);
  const [participants, setParticipants] = useState<ElevatorPresence[]>([]);
  const [currentRound, setCurrentRound] = useState<ElevatorRound | null>(null);
  const [feedback, setFeedback] = useState<PitchFeedbackResult[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [saved, setSaved] = useState(false);

  const activeSpeaker = participants.find((item) => item.role === "speaker");
  const audienceCount = participants.filter((item) => item.role === "audience").length;
  const isSpeaker = role === "speaker";
  const speakerBlocked = Boolean(activeSpeaker && activeSpeaker.participantId !== participant.participantId);

  const trackRole = useCallback(
    async (nextRole: ElevatorRole) => {
      roleRef.current = nextRole;
      setRole(nextRole);

      const presence: ElevatorPresence = {
        participantId: participant.participantId,
        nickname: participant.nickname,
        role: nextRole,
        joinedAt: new Date().toISOString(),
      };

      if (!config.enabled || !client) {
        setStatus("demo");
        setParticipants((current) => {
          const withoutMe = current.filter((item) => item.participantId !== participant.participantId);
          return [presence, ...withoutMe];
        });
        return;
      }

      const channel = channelRef.current;
      if (!channel) {
        setStatus("connecting");
        return;
      }

      try {
        await channel.track(presence);
      } catch {
        roleRef.current = null;
        setRole(null);
        setStatus("error");
      }
    },
    [client, config.enabled, participant.nickname, participant.participantId],
  );

  const broadcastEvent = useCallback(
    async (event: ElevatorEvent) => {
      const channel = channelRef.current;
      if (!config.enabled || !client || !channel) {
        return;
      }

      await channel.send({
        type: "broadcast",
        event: "elevator",
        payload: event,
      });
    },
    [client, config.enabled],
  );

  const startRound = useCallback(
    async (pitch: string) => {
      const cleanPitch = pitch.trim();
      if (!cleanPitch || speakerBlocked) {
        return;
      }

      await trackRole("speaker");
      const roundId = createLocalId("round");
      const endsAt = new Date(Date.now() + ROUND_SECONDS * 1000).toISOString();
      const nextRound = createRound(
        roundId,
        participant.participantId,
        participant.nickname,
        cleanPitch,
        endsAt,
      );

      setCurrentRound(nextRound);
      currentRoundRef.current = nextRound;
      setFeedback([]);
      setSaved(false);
      await broadcastEvent({
        type: "round_started",
        roundId,
        speakerId: participant.participantId,
        pitch: cleanPitch,
        endsAt,
      });
    },
    [broadcastEvent, participant.nickname, participant.participantId, speakerBlocked, trackRole],
  );

  const joinAudience = useCallback(async () => {
    await trackRole("audience");
  }, [trackRole]);

  const submitFeedback = useCallback(
    async (input: PitchFeedbackInput) => {
      const round = currentRoundRef.current;
      if (!round || !isPitchFeedbackInput(input)) {
        return;
      }

      const result: PitchFeedbackResult = {
        ...input,
        participantId: participant.participantId,
        nickname: participant.nickname,
        submittedAt: new Date().toISOString(),
      };

      if (!config.enabled || !client) {
        setFeedback((current) => [result, ...current]);
        return;
      }

      await broadcastEvent({
        type: "feedback_submitted",
        roundId: round.roundId,
        feedback: input,
      });
    },
    [broadcastEvent, client, config.enabled, participant.nickname, participant.participantId],
  );

  const endRound = useCallback(async () => {
    const round = currentRoundRef.current;
    if (!round) {
      return;
    }

    const endedRound = { ...round, ended: true };
    setCurrentRound(endedRound);
    currentRoundRef.current = endedRound;
    await broadcastEvent({ type: "round_ended", roundId: round.roundId });
  }, [broadcastEvent]);

  const resetRound = useCallback(async () => {
    const round = currentRoundRef.current;
    setCurrentRound(null);
    currentRoundRef.current = null;
    setFeedback([]);
    setSaved(false);

    if (round) {
      await broadcastEvent({ type: "round_reset", roundId: round.roundId });
    }
  }, [broadcastEvent]);

  const saveResult = useCallback(() => {
    const round = currentRoundRef.current;
    if (!round) {
      return;
    }

    const understood = feedback.filter((item) => item.understood).length;
    const wantsFollowUp = feedback.filter((item) => item.wantsFollowUp).length;
    const couldBeUser = feedback.filter((item) => item.couldBeUser).length;
    const questions = feedback
      .map((item) => item.question.trim())
      .filter(Boolean)
      .slice(0, 3)
      .join(" | ");
    const session = loadSession();
    const ships = loadShips();
    const room: RoomId = session?.room ?? "break";

    saveShips([
      {
        id: createLocalId("ship"),
        sessionId: session?.sessionId ?? createLocalId("session"),
        title: `Elevator pitch: ${round.pitch.slice(0, 72)}`,
        evidence:
          `Audience responses: ${feedback.length}. Understood: ${understood}. ` +
          `Follow-up: ${wantsFollowUp}. Potential users: ${couldBeUser}.` +
          (questions ? ` Questions: ${questions}` : ""),
        helpedBy: feedback.length ? "Elevator Stage audience" : undefined,
        room,
        shippedAt: new Date().toISOString(),
      },
      ...ships,
    ]);
    setSaved(true);
  }, [feedback]);

  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  useEffect(() => {
    participantsRef.current = participants;
  }, [participants]);

  useEffect(() => {
    if (!config.enabled || !client || channelRef.current) {
      return;
    }

    const channel = client.channel(`floor:elevator:${config.eventSlug}`, {
      config: {
        presence: {
          key: participant.participantId,
        },
      },
    });

    channel.on("presence", { event: "sync" }, () => {
      const nextParticipants = flattenPresenceState(channel.presenceState());
      participantsRef.current = nextParticipants;
      setParticipants(nextParticipants);
    });

    channel.on("broadcast", { event: "elevator" }, ({ payload }) => {
      if (!isElevatorEvent(payload)) {
        return;
      }

      if (payload.type === "round_started") {
        const speakerName =
          participantsRef.current.find((item) => item.participantId === payload.speakerId)?.nickname ??
          "Elevator speaker";
        const nextRound = createRound(
          payload.roundId,
          payload.speakerId,
          speakerName,
          payload.pitch,
          payload.endsAt,
        );
        setCurrentRound(nextRound);
        currentRoundRef.current = nextRound;
        setFeedback([]);
        setSaved(false);
        return;
      }

      const round = currentRoundRef.current;
      if (!round || payload.roundId !== round.roundId) {
        return;
      }

      if (payload.type === "feedback_submitted") {
        setFeedback((current) => [
          {
            ...payload.feedback,
            participantId: createLocalId("feedback"),
            nickname: "Audience member",
            submittedAt: new Date().toISOString(),
          },
          ...current,
        ]);
        return;
      }

      if (payload.type === "round_ended") {
        const endedRound = { ...round, ended: true };
        setCurrentRound(endedRound);
        currentRoundRef.current = endedRound;
        return;
      }

      if (payload.type === "round_reset") {
        setCurrentRound(null);
        currentRoundRef.current = null;
        setFeedback([]);
        setSaved(false);
      }
    });

    channelRef.current = channel;

    channel.subscribe(async (subscribeStatus) => {
      if (subscribeStatus === "SUBSCRIBED") {
        setStatus("connected");
        if (roleRef.current) {
          await trackRole(roleRef.current);
        }
      }

      if (subscribeStatus === "CHANNEL_ERROR" || subscribeStatus === "TIMED_OUT") {
        setStatus("error");
      }
    });

    setStatus("connecting");
  }, [client, config.enabled, config.eventSlug, participant.participantId, trackRole]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const round = currentRoundRef.current;
      if (!round) {
        setSecondsLeft(0);
        return;
      }

      const remaining = Math.max(0, Math.ceil((new Date(round.endsAt).getTime() - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0 && !round.ended) {
        const endedRound = { ...round, ended: true };
        setCurrentRound(endedRound);
        currentRoundRef.current = endedRound;
        void broadcastEvent({ type: "round_ended", roundId: round.roundId });
      }
    }, 500);

    return () => window.clearInterval(timer);
  }, [broadcastEvent]);

  useEffect(() => {
    return () => {
      if (channelRef.current) {
        void channelRef.current.untrack();
        void channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, []);

  return {
    status,
    liveEnabled: config.enabled,
    role,
    participants,
    activeSpeaker,
    audienceCount,
    currentRound,
    feedback,
    secondsLeft,
    isSpeaker,
    speakerBlocked,
    saved,
    startRound,
    joinAudience,
    submitFeedback,
    endRound,
    resetRound,
    saveResult,
  };
}
