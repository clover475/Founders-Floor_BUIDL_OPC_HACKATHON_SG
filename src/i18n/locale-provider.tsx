"use client";

import { IntlProvider } from "use-intl";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "@/messages/en.json";
import zhCN from "@/messages/zh-CN.json";
import { defaultLocale, isAppLocale, type AppLocale } from "@/i18n/config";

const STORAGE_KEY = "founders-floor-locale";
const messages = { en, "zh-CN": zhCN };

type LocaleContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(defaultLocale);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    setLocaleState(isAppLocale(saved) ? saved : defaultLocale);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale(nextLocale: AppLocale) {
        window.localStorage.setItem(STORAGE_KEY, nextLocale);
        setLocaleState(nextLocale);
      },
    }),
    [locale],
  );

  return (
    <LocaleContext.Provider value={value}>
      <IntlProvider locale={locale} messages={messages[locale]} timeZone="UTC">
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}

export function useAppLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useAppLocale must be used within LocaleProvider");
  }
  return context;
}
