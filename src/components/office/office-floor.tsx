"use client";

import Link from "next/link";
import { ClipboardCheck, DoorOpen, MessageSquarePlus, PencilLine } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "use-intl";
import { demoCoworkers } from "@/lib/demo-data";
import { loadDeskChecks, loadSession } from "@/lib/storage/repository";
import type { Coworker, DeskCheck, FounderSession, RoomId } from "@/types/domain";

export function OfficeFloor({ roomId }: { roomId: RoomId }) {
  const t = useTranslations("office");
  const roomT = useTranslations("rooms");
  const [session, setSession] = useState<FounderSession | null>(null);
  const [deskChecks, setDeskChecks] = useState<DeskCheck[]>([]);

  useEffect(() => {
    setSession(loadSession());
    setDeskChecks(loadDeskChecks());
  }, []);

  const coworkers = useMemo(() => {
    const demo = demoCoworkers.filter((item) => item.room === roomId);
    if (!session || session.room !== roomId) {
      return demo;
    }

    const you: Coworker = {
      participantId: session.participant.participantId,
      nickname: `${session.participant.nickname} (${t("you")})`,
      room: session.room,
      activity: session.activity,
      goal: session.goal,
    };

    return [you, ...demo];
  }, [roomId, session, t]);

  function coworkerGoal(coworker: Coworker) {
    if (coworker.participantId === "demo-mia") return t("demoMia");
    if (coworker.participantId === "demo-alex") return t("demoAlex");
    if (coworker.participantId === "demo-sam") return t("demoSam");
    return coworker.goal;
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
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {coworkers.map((coworker) => (
            <article key={coworker.participantId} className="border border-floor-line bg-white/75 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-floor-ink">{coworker.nickname}</h2>
                  <p className="mt-1 text-xs uppercase text-floor-muted">
                    {t(coworker.activity === "focused" ? "focused" : "openToChat")}
                  </p>
                </div>
                <ClipboardCheck size={18} className="text-floor-green" aria-hidden="true" />
              </div>
              <p className="mt-5 text-sm leading-6 text-floor-muted">{coworkerGoal(coworker)}</p>
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
