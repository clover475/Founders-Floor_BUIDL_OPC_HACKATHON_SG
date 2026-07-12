"use client";

import Link from "next/link";
import { Plus, ShipWheel, MessageSquarePlus, BadgeCheck, TreeDeciduous } from "lucide-react";
import { useLocale, useTranslations } from "use-intl";
import { useEffect, useState } from "react";
import { loadShips, loadDeskChecks } from "@/lib/storage/repository";
import type { Ship, DeskCheck } from "@/types/domain";

import { deskCheckTemplates } from "@/lib/demo-data";

export function ShipWall() {
  const t = useTranslations("shipWall");
  const locale = useLocale();
  const [ships, setShips] = useState<Ship[]>([]);
  const [deskChecks, setDeskChecks] = useState<DeskCheck[]>([]);
  const [treeCount, setTreeCount] = useState(0);
  const [acceptedChecks, setAcceptedChecks] = useState<Set<string>>(new Set());

  useEffect(() => {
    const allShips = loadShips();
    const allChecks = loadDeskChecks();
    setShips(allShips);
    // Only show desk checks that are currently requested
    setDeskChecks(allChecks.filter(check => check.status === "requested"));
    setTreeCount(allShips.length + allChecks.filter(check => check.status === "completed").length);
  }, []);

  const handleAccept = (id: string) => {
    setAcceptedChecks(prev => new Set(prev).add(id));
  };

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-12 px-5 py-8 sm:px-8">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-floor-green">{t("eyebrow")}</p>
          <h1 className="mt-2 text-3xl font-semibold text-floor-ink">{t("title")}</h1>
        </div>
        <Link
          href="/clock-in"
          className="inline-flex min-h-11 items-center gap-2 bg-floor-ink px-4 text-sm font-medium text-white"
        >
          <Plus size={16} aria-hidden="true" />
          {t("new")}
        </Link>
      </section>

      {/* Forest teaser */}
      <Link
        href="/work-log"
        className="flex items-center justify-between gap-4 border border-floor-line bg-floor-panel/60 p-4 transition hover:border-floor-green hover:bg-floor-panel"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-white text-floor-green">
            <TreeDeciduous size={18} aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-floor-ink">{t("forestTeaser", { count: treeCount })}</p>
        </div>
        <span className="text-sm font-medium text-floor-green">{t("forestTeaserCta")}</span>
      </Link>

      {/* Requests Section */}
      <section>
        <p className="text-sm font-medium text-floor-green">{t("deskCheckEyebrow")}</p>
        <h2 className="mt-2 text-2xl font-semibold text-floor-ink mb-4">{t("deskCheckTitle")}</h2>
        
        {deskChecks.length ? (
          <div className="grid gap-3">
            {deskChecks.map((check) => {
              const template = deskCheckTemplates.find(t => t.id === check.templateId);
              return (
                <article key={check.id} className="border border-floor-line bg-floor-panel p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center bg-white border border-floor-line text-floor-ink">
                        <MessageSquarePlus size={18} aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-floor-ink">{template?.title || "Desk Check"}</h3>
                        <p className="mt-2 text-sm leading-6 text-floor-ink whitespace-pre-wrap">{check.question}</p>
                        <p className="mt-3 text-xs uppercase text-floor-muted">
                          {new Date(check.createdAt).toLocaleString(locale)}
                        </p>
                      </div>
                    </div>
                    
                    {acceptedChecks.has(check.id) ? (
                      <button disabled className="inline-flex items-center gap-2 rounded border border-floor-green bg-floor-green px-4 py-2 text-sm font-medium text-white opacity-80 shrink-0">
                        <BadgeCheck size={16} />
                        Accepted
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleAccept(check.id)}
                        className="inline-flex items-center gap-2 border border-floor-green bg-white px-4 py-2 text-sm font-medium text-floor-green hover:bg-floor-green hover:text-white transition-colors shrink-0"
                      >
                        {t("helpAndEarn")}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="border border-floor-line bg-white/75 p-5">
            <p className="font-semibold text-floor-ink">{t("noDeskChecks")}</p>
          </div>
        )}
      </section>

      {/* Ships Section */}
      <section>
        <p className="text-sm font-medium text-floor-green">{t("shipEyebrow")}</p>
        <h2 className="mt-2 text-2xl font-semibold text-floor-ink mb-4">{t("shipTitle")}</h2>
        
        {ships.length ? (
          <div className="grid gap-3">
            {ships.map((ship) => (
              <article key={ship.id} className="border border-floor-line bg-white/80 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center bg-floor-panel text-floor-green">
                    <ShipWheel size={18} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-floor-ink">{ship.title}</h3>
                    <p className="mt-2 break-words text-sm leading-6 text-floor-muted whitespace-pre-wrap">{ship.evidence}</p>
                    <p className="mt-3 text-xs uppercase text-floor-muted">
                      {t("meta", {
                        room: ship.room,
                        date: new Date(ship.shippedAt).toLocaleString(locale),
                      })}
                      {ship.helpedBy ? ` · ${t("helped", { name: ship.helpedBy })}` : ""}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-floor-line bg-white/75 p-5">
            <p className="font-semibold text-floor-ink">{t("noneTitle")}</p>
            <p className="mt-2 text-sm text-floor-muted">
              {t("noneDescription")}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
