"use client";

import Link from "next/link";
import { CheckCircle2, MessageSquarePlus, Save } from "lucide-react";
import { useTranslations } from "use-intl";
import { useEffect, useState } from "react";
import { createLocalId } from "@/lib/identity";
import { loadDeskChecks, saveDeskChecks } from "@/lib/storage/repository";
import type { DeskCheck } from "@/types/domain";

export function DeskCheckFlow() {
  const t = useTranslations("deskCheck");
  const [question, setQuestion] = useState(() => t("templatePrompt"));
  const [current, setCurrent] = useState<DeskCheck | null>(null);

  useEffect(() => {
    const checks = loadDeskChecks();
    setCurrent(checks[checks.length - 1] ?? null);
  }, []);

  function saveRequest(status: DeskCheck["status"]) {
    const checks = loadDeskChecks();
    const next: DeskCheck = {
      id: current?.id ?? createLocalId("desk-check"),
      templateId: "ten-minute-positioning",
      question: question.trim() || t("templatePrompt"),
      status,
      createdAt: current?.createdAt ?? new Date().toISOString(),
    };

    const others = checks.filter((item) => item.id !== next.id);
    saveDeskChecks([...others, next]);
    setCurrent(next);
  }

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6 px-5 py-8 sm:px-8">
      <section className="space-y-2">
        <p className="text-sm font-medium text-floor-green">{t("eyebrow")}</p>
        <h1 className="text-3xl font-semibold text-floor-ink">{t("title")}</h1>
        <p className="max-w-2xl text-sm leading-6 text-floor-muted">
          {t("description")}
        </p>
      </section>

      <section className="grid gap-5 border border-floor-line bg-white/80 p-5">
        <div>
          <h2 className="font-semibold text-floor-ink">{t("templateTitle")}</h2>
          <p className="mt-2 text-sm leading-6 text-floor-muted">{t("templateOutcome")}</p>
        </div>

        <label htmlFor="desk-question" className="text-sm font-medium text-floor-ink">
          {t("question")}
        </label>
        <textarea
          id="desk-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows={5}
          className="border border-floor-line bg-white px-3 py-3 text-sm outline-none focus:border-floor-green"
        />

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => saveRequest("requested")}
            className="inline-flex min-h-11 items-center gap-2 bg-floor-ink px-4 text-sm font-medium text-white"
          >
            <MessageSquarePlus size={16} aria-hidden="true" />
            {t("request")}
          </button>
          <button
            type="button"
            onClick={() => saveRequest("completed")}
            className="inline-flex min-h-11 items-center gap-2 border border-floor-line bg-white px-4 text-sm font-medium text-floor-ink"
          >
            <CheckCircle2 size={16} aria-hidden="true" />
            {t("complete")}
          </button>
          <button
            type="button"
            onClick={() => saveRequest("draft")}
            className="inline-flex min-h-11 items-center gap-2 border border-floor-line bg-white/70 px-4 text-sm font-medium text-floor-ink"
          >
            <Save size={16} aria-hidden="true" />
            {t("draft")}
          </button>
        </div>

        {current ? (
          <div className="border border-floor-line bg-floor-panel p-3 text-sm text-floor-muted">
            {t("current", { status: current.status })}
          </div>
        ) : null}
      </section>

      <Link href="/clock-out" className="text-sm font-medium text-floor-green">
        {t("continue")}
      </Link>
    </div>
  );
}
