"use client";

import Link from "next/link";
import { Plus, ShipWheel } from "lucide-react";
import { useLocale, useTranslations } from "use-intl";
import { useEffect, useState } from "react";
import { loadShips } from "@/lib/storage/repository";
import type { Ship } from "@/types/domain";

export function ShipWall() {
  const t = useTranslations("shipWall");
  const locale = useLocale();
  const [ships, setShips] = useState<Ship[]>([]);

  useEffect(() => {
    setShips(loadShips());
  }, []);

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-6 px-5 py-8 sm:px-8">
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

      {ships.length ? (
        <section className="grid gap-3">
          {ships.map((ship) => (
            <article key={ship.id} className="border border-floor-line bg-white/80 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center bg-floor-panel text-floor-green">
                  <ShipWheel size={18} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-floor-ink">{ship.title}</h2>
                  <p className="mt-2 break-words text-sm leading-6 text-floor-muted">{ship.evidence}</p>
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
        </section>
      ) : (
        <section className="border border-floor-line bg-white/75 p-5">
          <p className="font-semibold text-floor-ink">{t("noneTitle")}</p>
          <p className="mt-2 text-sm text-floor-muted">
            {t("noneDescription")}
          </p>
        </section>
      )}
    </main>
  );
}
