"use client";

import { useRouter } from "next/navigation";
import { DoorOpen } from "lucide-react";
import { useTranslations } from "use-intl";
import { useEffect, useState } from "react";
import { createLocalId } from "@/lib/identity";
import { archiveSession, clearSession, loadSession, loadShips, saveShips } from "@/lib/storage/repository";
import type { FounderSession } from "@/types/domain";

export function ClockOutForm() {
  const t = useTranslations("clockOut");
  const router = useRouter();
  const [session, setSession] = useState<FounderSession | null>(null);
  const [title, setTitle] = useState("");
  const [evidence, setEvidence] = useState("");
  const [helpedBy, setHelpedBy] = useState("");

  useEffect(() => {
    const current = loadSession();
    setSession(current);
    if (current) {
      setTitle(current.goal);
    }
  }, []);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) {
      router.push("/clock-in");
      return;
    }

    const ships = loadShips();
    const shipId = createLocalId("ship");
    saveShips([
      {
        id: shipId,
        sessionId: session.sessionId,
        title: title.trim() || session.goal,
        evidence: evidence.trim() || t("defaultEvidence"),
        helpedBy: helpedBy.trim() || undefined,
        room: session.room,
        shippedAt: new Date().toISOString(),
      },
      ...ships,
    ]);
    archiveSession(session, "clockedOut", shipId);
    clearSession();
    router.push("/ship-wall");
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <div className="border border-floor-line bg-white/80 p-5">
          <h1 className="text-2xl font-semibold text-floor-ink">{t("noneTitle")}</h1>
          <p className="mt-2 text-sm text-floor-muted">{t("noneDescription")}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto grid w-full max-w-3xl gap-5 px-5 py-8 sm:px-8">
      <section className="space-y-2">
        <p className="text-sm font-medium text-floor-green">{t("eyebrow")}</p>
        <h1 className="text-3xl font-semibold text-floor-ink">{t("title")}</h1>
        <p className="text-sm leading-6 text-floor-muted">
          {t("description")}
        </p>
      </section>

      <label htmlFor="ship-title" className="text-sm font-medium text-floor-ink">
        {t("what")}
      </label>
      <input
        id="ship-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="min-h-12 border border-floor-line bg-white px-3 text-sm outline-none focus:border-floor-green"
      />

      <label htmlFor="ship-evidence" className="text-sm font-medium text-floor-ink">
        {t("evidence")}
      </label>
      <textarea
        id="ship-evidence"
        value={evidence}
        onChange={(event) => setEvidence(event.target.value)}
        placeholder={t("evidencePlaceholder")}
        rows={4}
        className="border border-floor-line bg-white px-3 py-3 text-sm outline-none focus:border-floor-green"
      />

      <label htmlFor="helped-by" className="text-sm font-medium text-floor-ink">
        {t("helpedBy")}
      </label>
      <input
        id="helped-by"
        value={helpedBy}
        onChange={(event) => setHelpedBy(event.target.value)}
        placeholder={t("helpedPlaceholder")}
        className="min-h-12 border border-floor-line bg-white px-3 text-sm outline-none focus:border-floor-green"
      />

      <button
        type="submit"
        className="inline-flex min-h-12 items-center justify-center gap-2 bg-floor-ink px-4 text-sm font-medium text-white"
      >
        <DoorOpen size={16} aria-hidden="true" />
        {t("publish")}
      </button>
    </form>
  );
}
