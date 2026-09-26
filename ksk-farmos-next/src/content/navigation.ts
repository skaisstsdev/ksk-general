/**
 * Структура навигации отделена от разметки. Подписи приходят из
 * словаря next-intl (`common.nav.*`, `common.legalNav.*`) по ключу
 * `key` — здесь остаётся только то, что не переводится: маршруты
 * и их стабильный порядок.
 */

export type NavKey =
  | "start"
  | "leistungen"
  | "ueberUns"
  | "karriere"
  | "faq"
  | "kontakt";

export type NavItem = { href: string; key: NavKey };

/** Страница для соискателей — на неё ведёт вторая дверь хиро. */
export const karriereNav: NavItem = { href: "/karriere", key: "karriere" };

export const mainNav: NavItem[] = [
  { href: "/", key: "start" },
  { href: "/leistungen", key: "leistungen" },
  { href: "/ueber-uns", key: "ueberUns" },
  karriereNav,
  { href: "/faq", key: "faq" },
  { href: "/kontakt", key: "kontakt" },
];

export const legalNav: { href: string; key: "datenschutz" | "impressum" }[] = [
  { href: "/datenschutz", key: "datenschutz" },
  { href: "/impressum", key: "impressum" },
];

/** Главный призыв шапки. Живёт отдельно: он не пункт меню. */
export const primaryCta = { href: "/beratung" };

export const applyCta = { href: "/schnellbewerbung" };

/**
 * Страницы, которые начинаются тёмным хиро во весь экран: шапка на них
 * прозрачна, пока страница не прокручена. Остальные (формы, юридические)
 * начинаются светлым полем, и шапка на них сразу сплошная.
 */
export const pagesWithHero: readonly string[] = ["/", "/karriere"];
