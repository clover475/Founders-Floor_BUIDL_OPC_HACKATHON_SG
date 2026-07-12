"use client";

import type { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getOrCreateParticipant } from "@/lib/identity";
import { getRealtimeConfig } from "@/lib/realtime/config";
import { getSupabaseBrowserClient } from "@/lib/realtime/client";
import type { Activity, FounderSession, RoomId } from "@/types/domain";
import type { FloorPresence } from "@/types/realtime";

type FloorStatus = "demo" | "connecting" | "connected" | "error";

const roomIds: RoomId[] = ["idea", "build", "feedback", "growth", "break"];
const activities: Activity[] = ["focused", "open_to_chat", "coffee", "elevator"];

function isRoomId(value: unknown): value is RoomId {
  return typeof value === "string" && roomIds.includes(value as RoomId);
}

function isActivity(value: unknown): value is Activity {
  return typeof value === "string" && activities.includes(value as Activity);
}

function isFloorPresence(value: unknown): value is FloorPresence {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<FloorPresence>;
  return (
    typeof candidate.participantId === "string" &&
    typeof candidate.nickname === "string" &&
    isRoomId(candidate.room) &&
    isActivity(candidate.activity) &&
    typeof candidate.onlineAt === "string" &&
    (candidate.goal === undefined || typeof candidate.goal === "string")
  );
}

function flattenPresenceState(state: Record<string, unknown[]>): FloorPresence[] {
  return Object.values(state)
    .flat()
    .filter(isFloorPresence)
    .sort((a, b) => b.onlineAt.localeCompare(a.onlineAt));
}

function createPresence(session: FounderSession): FloorPresence {
  return {
    participantId: session.participant.participantId,
    nickname: session.participant.nickname,
    room: session.room,
    activity: session.activity,
    goal: session.goal,
    region: session.region,
    onlineAt: new Date().toISOString(),
  };
}

export function useFloorPresence(session: FounderSession | null) {
  const config = useMemo(() => getRealtimeConfig(), []);
  const client = useMemo(() => getSupabaseBrowserClient(), []);
  const participant = useMemo(() => getOrCreateParticipant(), []);
  const sessionRef = useRef<FounderSession | null>(session);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const trackedSessionIdRef = useRef<string | null>(null);
  const [participants, setParticipants] = useState<FloorPresence[]>([]);
  const [status, setStatus] = useState<FloorStatus>(config.enabled ? "connecting" : "demo");

  const trackSession = useCallback(
    async (nextSession: FounderSession | null) => {
      const channel = channelRef.current;
      if (!channel) {
        return;
      }

      if (!nextSession) {
        if (trackedSessionIdRef.current) {
          trackedSessionIdRef.current = null;
          await channel.untrack();
        }
        return;
      }

      if (trackedSessionIdRef.current === nextSession.sessionId) {
        return;
      }

      trackedSessionIdRef.current = nextSession.sessionId;
      await channel.track(createPresence(nextSession));
    },
    [],
  );

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    if (!config.enabled || !client || channelRef.current) {
      return;
    }

    const channel = client.channel(`floor:lobby:${config.eventSlug}`, {
      config: {
        presence: {
          key: participant.participantId,
        },
      },
    });

    channel.on("presence", { event: "sync" }, () => {
      setParticipants(flattenPresenceState(channel.presenceState()));
    });

    channel.subscribe(async (subscribeStatus) => {
      if (subscribeStatus === "SUBSCRIBED") {
        setStatus("connected");
        await trackSession(sessionRef.current);
      }

      if (subscribeStatus === "CHANNEL_ERROR" || subscribeStatus === "TIMED_OUT") {
        setStatus("error");
      }
    });

    channelRef.current = channel;
    setStatus("connecting");

    return () => {
      void channel.untrack();
      void channel.unsubscribe();
      channelRef.current = null;
      trackedSessionIdRef.current = null;
    };
  }, [client, config.enabled, config.eventSlug, participant.participantId, trackSession]);

  useEffect(() => {
    if (!config.enabled || !client) {
      return;
    }

    void trackSession(session).catch(() => {
      setStatus("error");
    });
  }, [client, config.enabled, session, trackSession]);

  return {
    participants,
    status,
    liveEnabled: config.enabled,
  };
}
