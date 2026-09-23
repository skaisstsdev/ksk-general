import type { Locale } from "@/i18n/routing";

/**
 * Какие файлы шрифтов предзагружать для конкретного языка.
 *
 * Шрифты разрезаны по `unicode-range`, поэтому браузер скачает нужное
 * подмножество сам — но только после разбора CSS. Предзагрузка снимает
 * этот шаг для того, что точно понадобится на первом экране.
 *
 * Латиница нужна всегда, включая арабскую версию: цифры, телефоны
 * и адреса набираются ею в любом языке.
 */
const SANS = {
  latin: "manrope-latin.woff2",
  latinExt: "manrope-latin-ext.woff2",
  cyrillic: "manrope-cyrillic.woff2",
} as const;

const SERIF = {
  latin: "literata-latin.woff2",
  latinExt: "literata-latin-ext.woff2",
  cyrillic: "literata-cyrillic.woff2",
} as const;

const ARABIC = ["noto-sans-arabic.woff2", "noto-naskh-arabic.woff2"] as const;

const LATIN = [SANS.latin, SERIF.latin];
const LATIN_EXT = [SANS.latinExt, SERIF.latinExt]; // ș, ț, ğ, ş, ł, č …
const CYRILLIC = [SANS.cyrillic, SERIF.cyrillic];

const byLocale: Record<Locale, string[]> = {
  de: LATIN,
  en: LATIN,
  bs: [...LATIN, ...LATIN_EXT],
  pl: [...LATIN, ...LATIN_EXT],
  ro: [...LATIN, ...LATIN_EXT],
  tr: [...LATIN, ...LATIN_EXT],
  ru: [...LATIN, ...CYRILLIC],
  ua: [...LATIN, ...CYRILLIC],
  bg: [...LATIN, ...CYRILLIC],
  ar: [...LATIN, ...ARABIC],
};

export function preloadedFonts(locale: Locale) {
  return byLocale[locale] ?? LATIN;
}
