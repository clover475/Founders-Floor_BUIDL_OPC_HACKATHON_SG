"use client";

import Link from "next/link";
import { ClipboardCheck, DoorOpen, MessageSquarePlus, PencilLine } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "use-intl";
import { demoCoworkers } from "@/lib/demo-data";
import { useFloorPresence } from "@/lib/realtime/use-floor-presence";
import { loadDeskChecks, loadSession } from "@/lib/storage/repository";
import type { Coworker, DeskCheck, FounderSession, RoomId } from "@/types/domain";
import type { FloorPresence } from "@/types/realtime";

type CoworkerCard = {
  coworker: Coworker;
  source: "live" | "local" | "demo";
};

function presenceToCoworker(presence: FloorPresence): Coworker {
  return {
    participantId: presence.participantId,
    nickname: presence.nickname,
    room: presence.room,
    activity: presence.activity,
    goal: presence.goal ?? "",
  };
}

export function OfficeFloor({ roomId }: { roomId: RoomId }) {
  const t = useTranslations("office");
  const roomT = useTranslations("rooms");
  const [session, setSession] = useState<FounderSession | null>(null);
  const [deskChecks, setDeskChecks] = useState<DeskCheck[]>([]);
  const floor = useFloorPresence(session);

  useEffect(() => {
    setSession(loadSession());
    setDeskChecks(loadDeskChecks());
  }, []);

  const coworkerCards = useMemo<CoworkerCard[]>(() => {
    const liveCards = floor.participants
      .filter((item) => item.room === roomId)
      .map((item) => ({ coworker: presenceToCoworker(item), source: "live" as const }));

    const localCards: CoworkerCard[] = [];
    const liveParticipantIds = new Set(liveCards.map((item) => item.coworker.participantId));

    if (session && session.room === roomId && !liveParticipantIds.has(session.participant.participantId)) {
      localCards.push({
        coworker: {
          participantId: session.participant.participantId,
          nickname: session.participant.nickname,
          room: session.room,
          activity: session.activity,
          goal: session.goal,
        },
        source: "local",
      });
    }

    const demoCards = demoCoworkers
      .filter((item) => item.room === roomId)
      .map((item) => ({ coworker: item, source: "demo" as const }));

    return [...localCards, ...liveCards, ...demoCards];
  }, [floor.participants, roomId, session]);

  const liveCount = useMemo(
    () => floor.participants.filter((item) => item.room === roomId).length,
    [floor.participants, roomId],
  );

  const localParticipantId = session?.participant.participantId;

  function displayName(card: CoworkerCard) {
    if (card.coworker.participantId === localParticipantId) {
      return `${card.coworker.nickname} (${t("you")})`;
    }

    return card.coworker.nickname;
  }

  function coworkerGoal(coworker: Coworker) {
    if (coworker.participantId === "demo-mia") return t("demoMia");
    if (coworker.participantId === "demo-alex") return t("demoAlex");
    if (coworker.participantId === "demo-sam") return t("demoSam");
    return coworker.goal || t("noGoal");
  }

  function statusCopy() {
    if (!floor.liveEnabled) return t("liveDemo");
    if (floor.status === "connected") return t("liveConnected", { count: liveCount });
    if (floor.status === "connecting") return t("liveConnecting");
    return t("liveError");
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[0.75fr_0.25fr]">
      <section className="space-y-5">
        <div className="space-y-2">
          <p className="text-sm font-medium text-floor-green">{roomT(`${roomId}.name`)}</p>
          <h1 className="text-3xl font-semibold text-floor-ink">{t("title")}</h1>
          <p className="max-w-2xl text-sm leading-6 text-floor-muted">
            {t("description")}
          </p>
          <p className="text-xs font-medium uppercase text-floor-muted">{statusCopy()}</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {coworkerCards.map((card) => (
            <article key={`${card.source}-${card.coworker.participantId}`} className="border border-floor-line bg-white/75 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-floor-ink">{displayName(card)}</h2>
                    <span className="border border-floor-line px-2 py-0.5 text-[11px] uppercase text-floor-muted">
                      {t(`${card.source}Badge`)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs uppercase text-floor-muted">
                    {t(card.coworker.activity === "focused" ? "focused" : "openToChat")}
                  </p>
                </div>
                <ClipboardCheck size={18} className="text-floor-green" aria-hidden="true" />
              </div>
              <p className="mt-5 text-sm leading-6 text-floor-muted">{coworkerGoal(card.coworker)}</p>
            </article>
          ))}
        </div>
      </section>

      <aside className="space-y-3">
        <Link
          href="/desk-check"
          className="flex items-center gap-3 border border-floor-line bg-white p-4 text-sm font-medium text-floor-ink transition hover:border-floor-green"
        >
          <MessageSquarePlus size={18} aria-hidden="true" />
          {t("request")}
        </Link>
        <Link
          href="/clock-in"
          className="flex items-center gap-3 border border-floor-line bg-white/70 p-4 text-sm font-medium text-floor-ink transition hover:border-floor-blue"
        >
          <PencilLine size={18} aria-hidden="true" />
          {t("update")}
        </Link>
        <Link
          href="/clock-out"
          className="flex items-center gap-3 border border-floor-line bg-white/70 p-4 text-sm font-medium text-floor-ink transition hover:border-floor-coral"
        >
          <DoorOpen size={18} aria-hidden="true" />
          {t("clockOut")}
        </Link>

        <div className="border border-floor-line bg-white/60 p-4">
          <p className="text-sm font-semibold text-floor-ink">{t("deskChecks")}</p>
          <p className="mt-2 text-sm text-floor-muted">
            {deskChecks.length
              ? t("saved", { count: deskChecks.length, status: deskChecks[deskChecks.length - 1].status })
              : t("none")}
          </p>
        </div>
      </aside>
    </main>
  );
}
