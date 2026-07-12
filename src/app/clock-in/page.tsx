"use client";

import { ClockInForm } from "@/components/office/clock-in-form";
import { useTranslations } from "use-intl";

export default function ClockInPage() {
  const t = useTranslations("clockIn");

  return (
    <main className="mx-auto grid w-full max-w-4xl gap-6 px-5 py-8 sm:px-8">
      <section className="space-y-2">
        <p className="text-sm font-medium text-floor-green">{t("eyebrow")}</p>
        <h1 className="text-3xl font-semibold text-floor-ink">{t("title")}</h1>
        <p className="max-w-2xl text-sm leading-6 text-floor-muted">
          {t("description")}
        </p>
      </section>
      <section className="border border-floor-line bg-white/80 p-5">
        <ClockInForm />
      </section>
    </main>
  );
}
