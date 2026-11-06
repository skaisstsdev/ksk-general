import type { MetadataRoute } from "next";

import { getPathname } from "@/i18n/navigation";
import { locales, routing } from "@/i18n/routing";
import { stellen } from "@/content/pages/stellen";
import { siteUrl } from "@/content/site";

/**
 * Все публичные страницы сайта, без языкового префикса. `/styleguide`
 * не входит — служебная страница с `robots: { index: false }`
 * (см. `[locale]/styleguide/page.tsx`), в карте сайта ей делать нечего.
 */
const PATHS = [
  "/",
  "/leistungen",
  "/ueber-uns",
  "/karriere",
  "/faq",
  "/kontakt",
  "/beratung",
  "/schnellbewerbung",
  "/impressum",
  "/datenschutz",
] as const;

/**
 * Каждый путь — один URL на каждый язык, и у каждого — полный список
 * `alternates.languages` на все десять версий той же страницы плюс
 * `x-default` на немецкую (без префикса, зафиксированный дефолт
 * роутинга). Так Google видит все языковые версии страницы как одну
 * группу, а не как десять несвязанных дублей — ровно то, чего не было
 * совсем: `hreflang` отсутствовал и в `<head>`, и здесь.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Вакансии переведены на все языки и идут тем же путём, что остальные
  // страницы: по записи на язык с полным набором hreflang.
  const allPaths: readonly string[] = [
    ...PATHS,
    ...stellen.map(({ slug }) => `/karriere/${slug}`),
  ];

  return allPaths.flatMap((path) => {
    const urls = {} as Record<(typeof locales)[number], string>;
    const languages: Record<string, string> = {};
    for (const l of locales) {
      urls[l] = new URL(getPathname({ locale: l, href: path }), siteUrl).toString();
      // Маршрут сайта — `/ua`, но код языка в hreflang — `uk` (BCP 47),
      // как и в `<head>` страниц (`lib/metadata.ts`).
      languages[l === "ua" ? "uk" : l] = urls[l];
    }
    languages["x-default"] = new URL(
      getPathname({ locale: routing.defaultLocale, href: path }),
      siteUrl,
    ).toString();

    return locales.map((locale) => ({
      url: urls[locale],
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
      alternates: { languages },
    }));
  });
}
