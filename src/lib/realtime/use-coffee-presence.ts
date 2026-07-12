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
    typeof candidate.roomId === "string" &&
    typeof candidate.joinedAt === "string"
  );
}

function flattenPresenceState(state: Record<string, unknown[]>): CoffeePresence[] {
  return Object.values(state)
    .flat()
    .filter(isCoffeePresence)
    .sort((a, b) => a.joinedAt.localeCompare(b.joinedAt));
}

export function useCoffeePresence(roomId = "main", roomTitle = "", roomTopic = "") {
  const config = useMemo(() => getRealtimeConfig(), []);
  const client = useMemo(() => getSupabaseBrowserClient(), []);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const joinedRef = useRef(false);
  const pendingJoinRef = useRef(false);
  const participant = useMemo(() => getOrCreateParticipant(), []);
  const [participants, setParticipants] = useState<CoffeePresence[]>([]);
  const [joined, setJoined] = useState(false);
  const [status, setStatus] = useState<CoffeeStatus>(config.enabled ? "idle" : "demo");

  const createLocalPresence = useCallback(
    (): CoffeePresence => ({
      participantId: participant.participantId,
      nickname: participant.nickname,
      roomId,
      roomTitle: roomTitle.trim() || undefined,
      roomTopic: roomTopic.trim() || undefined,
      joinedAt: new Date().toISOString(),
    }),
    [participant.nickname, participant.participantId, roomId, roomTitle, roomTopic],
  );
  const createLocalPresenceRef = useRef(createLocalPresence);

  useEffect(() => {
    createLocalPresenceRef.current = createLocalPresence;
  }, [createLocalPresence]);

  const tableFull = participants.length >= COFFEE_CAPACITY && !joined;

  const leave = useCallback(async () => {
    joinedRef.current = false;
    pendingJoinRef.current = false;
    setJoined(false);
    setParticipants((current) =>
      current.filter((item) => item.participantId !== participant.participantId),
    );

    if (channelRef.current) {
      await channelRef.current.untrack();
    }

    setStatus(config.enabled ? "connected" : "demo");
  }, [config.enabled, participant.participantId]);

  const join = useCallback(() => {
    if (tableFull) {
      return;
    }

    joinedRef.current = true;
    setJoined(true);

    if (!config.enabled || !client) {
      setStatus("demo");
      const localPresence = createLocalPresence();
      setParticipants((current) => {
        const withoutMe = current.filter(
          (item) => item.participantId !== localPresence.participantId,
        );
        return [localPresence, ...withoutMe].slice(0, COFFEE_CAPACITY);
      });
      return;
    }

    const channel = channelRef.current;
    if (!channel) {
      pendingJoinRef.current = true;
      setStatus("connecting");
      return;
    }

    void channel.track(createLocalPresence()).catch(() => {
      joinedRef.current = false;
      setJoined(false);
      setStatus("error");
    });
  }, [client, config.enabled, createLocalPresence, tableFull]);

  useEffect(() => {
    if (!config.enabled || !client || channelRef.current) {
      return;
    }

    const channel = client.channel(`floor:coffee:${config.eventSlug}:${roomId}`, {
      config: {
        presence: {
          key: participant.participantId,
        },
      },
    });

    channel.on("presence", { event: "sync" }, () => {
      const nextParticipants = flattenPresenceState(channel.presenceState());
      const visibleParticipants = nextParticipants.slice(0, COFFEE_CAPACITY);
      const localSeatIndex = nextParticipants.findIndex(
        (item) => item.participantId === participant.participantId,
      );

      if (joinedRef.current && localSeatIndex >= COFFEE_CAPACITY) {
        joinedRef.current = false;
        pendingJoinRef.current = false;
        setJoined(false);
        void channel.untrack();
      }

      setParticipants(visibleParticipants);
    });

    channel.subscribe(async (subscribeStatus) => {
      if (subscribeStatus === "SUBSCRIBED") {
        setStatus("connected");

        if (pendingJoinRef.current) {
          pendingJoinRef.current = false;
          await channel.track(createLocalPresenceRef.current());
        }
      }

      if (subscribeStatus === "CHANNEL_ERROR" || subscribeStatus === "TIMED_OUT") {
        setStatus("error");
      }
    });

    channelRef.current = channel;
    setStatus("connecting");
  }, [client, config.enabled, config.eventSlug, participant.participantId, roomId]);

  useEffect(() => {
    if (!joined || !channelRef.current) {
      return;
    }

    void channelRef.current.track(createLocalPresence()).catch(() => {
      setStatus("error");
    });
  }, [createLocalPresence, joined]);

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
