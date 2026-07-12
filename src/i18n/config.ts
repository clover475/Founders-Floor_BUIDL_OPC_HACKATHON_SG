export const locales = ["en", "zh-CN"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

export function isAppLocale(value: string | null): value is AppLocale {
  return locales.includes(value as AppLocale);
}
