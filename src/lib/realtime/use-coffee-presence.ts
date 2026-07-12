"use client";

import type { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getOrCreateParticipant } from "@/lib/identity";
import { getRealtimeConfig } from "@/lib/realtime/config";
import { getSupabaseBrowserClient } from "@/lib/realtime/client";
import type { CoffeePresence } from "@/types/realtime";

const COFFEE_CAPACITY = 4;

type CoffeeStatus = "demo" | "idle" | "connecting" | "connected" | "error";

function isCoffeePresence(value: unknown): value is CoffeePresence {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<CoffeePresence>;
  return (
    typeof candidate.participantId === "string" &&
    typeof candidate.nickname === "string" &&
    typeof candidate.joinedAt === "string"
  );
}

function flattenPresenceState(state: Record<string, unknown[]>): CoffeePresence[] {
  return Object.values(state)
    .flat()
    .filter(isCoffeePresence)
    .sort((a, b) => a.joinedAt.localeCompare(b.joinedAt));
}

export function useCoffeePresence() {
  const config = useMemo(() => getRealtimeConfig(), []);
  const client = useMemo(() => getSupabaseBrowserClient(), []);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const participant = useMemo(() => getOrCreateParticipant(), []);
  const [participants, setParticipants] = useState<CoffeePresence[]>([]);
  const [joined, setJoined] = useState(false);
  const [status, setStatus] = useState<CoffeeStatus>(config.enabled ? "idle" : "demo");

  const localPresence: CoffeePresence = useMemo(
    () => ({
      participantId: participant.participantId,
      nickname: participant.nickname,
      joinedAt: new Date().toISOString(),
    }),
    [participant.nickname, participant.participantId],
  );

  const tableFull = participants.length >= COFFEE_CAPACITY && !joined;

  const leave = useCallback(async () => {
    setJoined(false);
    setParticipants((current) =>
      current.filter((item) => item.participantId !== participant.participantId),
    );

    if (channelRef.current) {
      await channelRef.current.untrack();
      await channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    setStatus(config.enabled ? "idle" : "demo");
  }, [config.enabled, participant.participantId]);

  const join = useCallback(() => {
    if (tableFull) {
      return;
    }

    setJoined(true);

    if (!config.enabled || !client) {
      setStatus("demo");
      setParticipants((current) => {
        const withoutMe = current.filter(
          (item) => item.participantId !== localPresence.participantId,
        );
        return [localPresence, ...withoutMe].slice(0, COFFEE_CAPACITY);
      });
      return;
    }

    setStatus("connecting");
  }, [client, config.enabled, localPresence, tableFull]);

  useEffect(() => {
    if (!joined || !config.enabled || !client || channelRef.current) {
      return;
    }

    const channel = client.channel(`floor:coffee:${config.eventSlug}`, {
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
        await channel.track(localPresence);
        setStatus("connected");
      }

      if (subscribeStatus === "CHANNEL_ERROR" || subscribeStatus === "TIMED_OUT") {
        setStatus("error");
      }
    });

    channelRef.current = channel;
  }, [client, config.enabled, config.eventSlug, joined, localPresence, participant.participantId]);

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
    capacity: COFFEE_CAPACITY,
    participants,
    joined,
    tableFull,
    status,
    liveEnabled: config.enabled,
    join,
    leave,
  };
}
