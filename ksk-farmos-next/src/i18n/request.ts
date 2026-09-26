import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

const NAMESPACES = [
  "common",
  "home",
  "leistungen",
  "karriere",
  "kontakt",
  "faq",
  "ueberUns",
  "beratung",
  "schnellbewerbung",
  "legal",
] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  /**
   * Словари собраны из отдельных файлов по разделу сайта — как и
   * `src/content/`, а не один файл на язык, — так словарь остаётся
   * читаемым при 10 языках. Вложенная форма ключей (`idx.diag1` /
   * `idx.diag1.d` в старом сайте становится `diagnoses.items[0].title` /
   * `.text`) снимает коллизию плоских ключей старого `de.json`, где часть
   * ключей были одновременно и листом, и веткой.
   */
  const entries = await Promise.all(
    NAMESPACES.map(async (namespace) => {
      const messages = (
        (await import(`../../messages/${locale}/${namespace}.json`)) as {
          default: Record<string, unknown>;
        }
      ).default;
      return [namespace, messages] as const;
    }),
  );

  return { locale, messages: Object.fromEntries(entries) };
});
