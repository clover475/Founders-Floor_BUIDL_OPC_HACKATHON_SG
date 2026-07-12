"use client";

import Link from "next/link";
import { CalendarClock, Plus, Sprout, TreeDeciduous } from "lucide-react";
import { useLocale, useTranslations } from "use-intl";
import { useEffect, useMemo, useState } from "react";
import {
  loadDeskChecks,
  loadSession,
  loadSessionHistory,
  loadShips,
} from "@/lib/storage/repository";
import type { DeskCheck, FounderSession, SessionRecord, Ship } from "@/types/domain";

const MILESTONES = [1, 3, 5, 10, 20, 35, 50, 75, 100];

type Tree = { kind: "ship" | "deskCheck"; key: string };

function durationMinutes(startIso: string, endIso: string) {
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return null;
  return Math.round(ms / 60000);
}

export function WorkLog() {
  const t = useTranslations("workLog");
  const roomT = useTranslations("rooms");
  const locale = useLocale();

  const [active, setActive] = useState<FounderSession | null>(null);
  const [history, setHistory] = useState<SessionRecord[]>([]);
  const [ships, setShips] = useState<Ship[]>([]);
  const [deskChecks, setDeskChecks] = useState<DeskCheck[]>([]);

  useEffect(() => {
    setActive(loadSession());
    setHistory(loadSessionHistory());
    setShips(loadShips());
    setDeskChecks(loadDeskChecks());
  }, []);

  const completedDeskChecks = useMemo(
    () => deskChecks.filter((item) => item.status === "completed"),
    [deskChecks],
  );

  const trees = useMemo<Tree[]>(() => {
    const shipTrees = ships.map((ship) => ({ kind: "ship" as const, key: ship.id }));
    const deskCheckTrees = completedDeskChecks.map((check) => ({ kind: "deskCheck" as const, key: check.id }));
    return [...shipTrees, ...deskCheckTrees];
  }, [ships, completedDeskChecks]);

  const nextMilestone = MILESTONES.find((milestone) => milestone > trees.length);

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-8 px-5 py-8 sm:px-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-floor-green">{t("eyebrow")}</p>
          <h1 className="mt-2 text-3xl font-semibold text-floor-ink">{t("title")}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-floor-muted">{t("description")}</p>
        </div>
        <Link
          href="/clock-in"
          className="inline-flex min-h-11 items-center gap-2 bg-floor-ink px-4 text-sm font-medium text-white"
        >
          <Plus size={16} aria-hidden="true" />
          {t("clockInCta")}
        </Link>
      </section>

      <section className="border border-floor-line bg-white/80 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold text-floor-ink">{t("forestTitle")}</h2>
          <p className="text-sm text-floor-muted">
            {t("forestCount", { count: trees.length })}
          </p>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-floor-muted">{t("forestDescription")}</p>

        {trees.length ? (
          <>
            <div className="mt-5 flex flex-wrap gap-2">
              {trees.map((tree) => (
                <div
                  key={tree.key}
                  title={tree.kind === "ship" ? t("treeShipLabel") : t("treeDeskCheckLabel")}
                  className={`flex h-11 w-11 items-center justify-center border ${
                    tree.kind === "ship"
                      ? "border-floor-green bg-floor-panel text-floor-green"
                      : "border-floor-line bg-white text-floor-blue"
                  }`}
                >
                  {tree.kind === "ship" ? (
                    <TreeDeciduous size={20} aria-hidden="true" />
                  ) : (
                    <Sprout size={18} aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
            {nextMilestone ? (
              <p className="mt-4 text-xs uppercase text-floor-muted">
                {t("nextMilestone", { count: nextMilestone - trees.length, milestone: nextMilestone })}
              </p>
            ) : (
              <p className="mt-4 text-xs uppercase text-floor-muted">{t("milestoneMax")}</p>
            )}
          </>
        ) : (
          <p className="mt-5 border border-dashed border-floor-line bg-floor-panel/40 p-4 text-sm text-floor-muted">
            {t("forestEmpty")}
          </p>
        )}
      </section>

      <section className="border border-floor-line bg-white/80 p-5">
        <h2 className="text-lg font-semibold text-floor-ink">{t("historyTitle")}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-floor-muted">{t("historyDescription")}</p>

        {active || history.length ? (
          <ul className="mt-5 grid gap-3">
            {active ? (
              <li className="border border-floor-blue bg-floor-panel/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <CalendarClock size={16} className="text-floor-blue" aria-hidden="true" />
                  <span className="font-semibold text-floor-ink">{roomT(`${active.room}.name`)}</span>
                  <span className="border border-floor-blue px-2 py-0.5 text-[11px] uppercase text-floor-blue">
                    {t("statusActive")}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-floor-muted">{active.goal}</p>
                <p className="mt-2 text-xs uppercase text-floor-muted">
                  {t("clockedInAt", { date: new Date(active.checkedInAt).toLocaleString(locale) })}
                </p>
              </li>
            ) : null}

            {history.map((record) => {
              const minutes = durationMinutes(record.checkedInAt, record.clockedOutAt);
              return (
                <li key={record.sessionId} className="border border-floor-line bg-white p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <CalendarClock size={16} className="text-floor-muted" aria-hidden="true" />
                    <span className="font-semibold text-floor-ink">{roomT(`${record.room}.name`)}</span>
                    <span className="border border-floor-line px-2 py-0.5 text-[11px] uppercase text-floor-muted">
                      {record.endReason === "clockedOut" ? t("statusCompleted") : t("statusSwitched")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-floor-muted">{record.goal}</p>
                  <p className="mt-2 text-xs uppercase text-floor-muted">
                    {t("sessionMeta", {
                      date: new Date(record.checkedInAt).toLocaleString(locale),
                      duration: minutes === null ? t("durationUnknown") : t("durationMinutes", { count: minutes }),
                    })}
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-5 border border-dashed border-floor-line bg-floor-panel/40 p-4 text-sm text-floor-muted">
            {t("historyEmpty")}
          </p>
        )}
      </section>
    </main>
  );
}
