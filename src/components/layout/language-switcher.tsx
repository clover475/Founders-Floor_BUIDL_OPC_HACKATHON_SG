"use client";

import { Languages } from "lucide-react";
import { useTranslations } from "use-intl";
import { useAppLocale } from "@/i18n/locale-provider";

export function LanguageSwitcher() {
  const t = useTranslations("language");
  const { locale, setLocale } = useAppLocale();
  const nextLocale = locale === "en" ? "zh-CN" : "en";

  return (
    <button
      type="button"
      onClick={() => setLocale(nextLocale)}
      aria-label={t("switchTo", { language: t(nextLocale === "en" ? "english" : "chinese") })}
      className="inline-flex min-h-10 items-center gap-2 border border-floor-line bg-white/70 px-3 text-sm font-medium text-floor-ink transition hover:bg-white"
    >
      <Languages size={16} aria-hidden="true" />
      <span>{locale === "en" ? "中文" : "EN"}</span>
    </button>
  );
}
