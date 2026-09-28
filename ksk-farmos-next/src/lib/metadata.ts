import type { Metadata } from "next";
import { hasLocale } from "next-intl";

import { getPathname } from "@/i18n/navigation";
import { locales, routing, type Locale } from "@/i18n/routing";
import { company, siteUrl } from "@/content/site";

/**
 * hreflang + canonical для одной страницы на всех языках сайта.
 *
 * `getPathname` уже знает про `localePrefix: "as-needed"` (немецкий без
 * префикса, остальные девять — с ним) — здесь префиксы не собираются
 * руками, только перечисление языков.
 *
 * `x-default` указывает на немецкую версию: она без префикса и есть
 * зафиксированный дефолт роутинга (`routing.defaultLocale`).
 */
export function localizedAlternates(
  locale: Locale,
  href: string,
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = getPathname({ locale: l, href });
  }
  languages["x-default"] = getPathname({ locale: routing.defaultLocale, href });

  return {
    canonical: getPathname({ locale, href }),
    languages,
  };
}

/** Соответствие локали и `og:locale` (регион нужен только там, где он есть). */
const OG_LOCALE: Record<Locale, string> = {
  de: "de_DE",
  en: "en_US",
  ru: "ru_RU",
  tr: "tr_TR",
  pl: "pl_PL",
  ro: "ro_RO",
  bg: "bg_BG",
  ua: "uk_UA",
  ar: "ar_AR",
  bs: "bs_BA",
};

/**
 * Общий набор метаданных для одной страницы: canonical + hreflang уже
 * готовым блоком (`localizedAlternates`), OpenGraph и Twitter Card поверх
 * заголовка/описания, которые страница переводит сама. Заголовок и
 * описание не меняются — этот хелпер только добавляет то, чего не было
 * вообще (alternates, og:locale, превью для соцсетей).
 */
export function buildPageMetadata({
  locale: rawLocale,
  path,
  title,
  description,
  image = "/img/home/pflege-zu-hause.webp",
  titleSuffix,
}: {
  /**
   * `params` в `generateMetadata` типизирован как `string` (см.
   * `LayoutProps`/`PageProps` в Next 16), хотя по факту это всегда
   * одна из локалей роутинга — `hasLocale` сужает тип здесь, один раз,
   * а не в каждой странице.
   */
  locale: string;
  /** Путь без языкового префикса, как в `getPathname` (`"/"`, `"/kontakt"`…). */
  path: string;
  title: string;
  description: string;
  /** Путь к изображению для превью в соцсетях. По умолчанию — фото хиро главной. */
  image?: string;
  /**
   * Только для главной. `title.template` из `[locale]/layout.tsx`
   * достраивает суффикс к заголовку любой вложенной страницы
   * (`/leistungen`, `/kontakt`…), но не к `[locale]/page.tsx` — тот
   * лежит в том же сегменте, что и сам layout, а по документации Next
   * («title.template defined in layout.js will not apply to a title
   * defined in a page.js of the same route segment», см.
   * `node_modules/next/dist/docs/.../generate-metadata.md`) шаблон
   * работает только для дочерних сегментов. Без этого параметра
   * заголовок вкладки на главной был короче, чем везде на сайте,
   * молча — суффикс просто не приклеивался. `title.absolute` здесь
   * складывает то же самое вручную, ровно один раз.
   */
  titleSuffix?: string;
}): Metadata {
  const locale: Locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale;
  const url = getPathname({ locale, href: path });
  const alternateLocales = locales
    .filter((l) => l !== locale)
    .map((l) => OG_LOCALE[l]);

  return {
    title: titleSuffix ? { absolute: `${title} — ${titleSuffix}` } : title,
    description,
    alternates: localizedAlternates(locale, path),
    openGraph: {
      title,
      description,
      url,
      siteName: company.legalName,
      locale: OG_LOCALE[locale],
      alternateLocale: alternateLocales,
      images: [{ url: image, width: 2000, height: 1332 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export { siteUrl };
