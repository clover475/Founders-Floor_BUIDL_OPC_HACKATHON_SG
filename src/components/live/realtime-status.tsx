"use client";

import { getRealtimeConfig } from "@/lib/realtime/config";
import { useTranslations } from "use-intl";

export function RealtimeStatus() {
  const t = useTranslations("realtime");
  const config = getRealtimeConfig();

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-floor-ink">{t("title")}</p>
      <p className="text-sm leading-6 text-floor-muted">
        {config.enabled
          ? t("enabled")
          : t("disabled")}
      </p>
      <div className="flex items-center gap-2 text-xs text-floor-muted">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            config.enabled ? "bg-floor-green" : "bg-floor-gold"
          }`}
          aria-hidden="true"
        />
        {config.enabled ? t("configured") : t("fallback")}
      </div>
    </div>
  );
}
