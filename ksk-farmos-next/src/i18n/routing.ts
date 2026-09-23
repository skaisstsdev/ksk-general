import { defineRouting } from "next-intl/routing";

/**
 * Языки сайта. Порядок — как в переключателе старого сайта.
 * `dir` нужен для arabisch: вся раскладка переворачивается на RTL.
 */
export const localeMeta = {
  de: { label: "Deutsch", dir: "ltr" },
  en: { label: "English", dir: "ltr" },
  ru: { label: "Русский", dir: "ltr" },
  tr: { label: "Türkçe", dir: "ltr" },
  pl: { label: "Polski", dir: "ltr" },
  ro: { label: "Română", dir: "ltr" },
  bg: { label: "Български", dir: "ltr" },
  ua: { label: "Українська", dir: "ltr" },
  ar: { label: "العربية", dir: "rtl" },
  bs: { label: "Bosanski", dir: "ltr" },
} as const satisfies Record<string, { label: string; dir: "ltr" | "rtl" }>;

export type Locale = keyof typeof localeMeta;

export const locales = Object.keys(localeMeta) as [Locale, ...Locale[]];

export const routing = defineRouting({
  locales,
  defaultLocale: "de",
  /**
   * Немецкий — без префикса (`/leistungen`), чтобы существующие ссылки
   * и позиции в поиске не пострадали. Остальные девять — с префиксом
   * (`/ru/leistungen`). В старом сайте все языки жили на одном URL,
   * поэтому для поиска существовала только немецкая версия.
   */
  localePrefix: "as-needed",
  /** Язык выбирается ссылкой, а не заголовком браузера: адрес должен быть предсказуем. */
  localeDetection: false,
});

export function localeDir(locale: string): "ltr" | "rtl" {
  return locale in localeMeta ? localeMeta[locale as Locale].dir : "ltr";
}
