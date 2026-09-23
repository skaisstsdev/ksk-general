import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  /**
   * Этап 6: сюда подключаются каталоги из `messages/<locale>.json`.
   * Пока машинерия маршрутизации включена, а тексты живут в `src/content/`
   * — так каркас можно проверять до миграции словарей.
   *
   * Миграция потребует переименования ключей-коллизий: в старом
   * `de.json` ключи плоские, и часть из них одновременно лист и ветка
   * (`form.nachricht` и `form.nachricht.ph`, `idx.diag1` и `idx.diag1.d`,
   * `cta.beratung` и `cta.beratung.p`). При переводе в вложенную форму
   * такие пары конфликтуют.
   */
  return { locale, messages: {} };
});
