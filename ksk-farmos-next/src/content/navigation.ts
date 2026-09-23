/**
 * Структура навигации отделена от разметки: на этапе 6 подписи начнут
 * приходить из словарей next-intl, а компоненты не изменятся — поменяется
 * только источник. То же требование действует и для будущего переезда
 * на headless CMS (раздел 8 брифа).
 */

export type NavItem = { href: string; label: string };

/** Страница для соискателей — на неё ведёт вторая дверь хиро. */
export const karriere: NavItem = { href: "/karriere", label: "Karriere" };

export const mainNav: NavItem[] = [
  { href: "/", label: "Startseite" }, // nav.start
  { href: "/leistungen", label: "Leistungen" },
  { href: "/ueber-uns", label: "Über uns" },
  karriere,
  { href: "/faq", label: "FAQ" },
  { href: "/kontakt", label: "Kontakt" },
];

export const legalNav: NavItem[] = [
  { href: "/datenschutz", label: "Datenschutzerklärung" },
  { href: "/impressum", label: "Impressum" },
];

/** Главный призыв шапки. Живёт отдельно: он не пункт меню. */
export const primaryCta: NavItem = {
  href: "/beratung",
  label: "Kostenlose Beratung",
};

export const applyCta: NavItem = {
  href: "/schnellbewerbung",
  label: "Jetzt bewerben",
};

/**
 * Страницы, которые начинаются тёмным хиро во весь экран: шапка на них
 * прозрачна, пока страница не прокручена. Остальные (формы, юридические)
 * начинаются светлым полем, и шапка на них сразу сплошная.
 */
export const pagesWithHero: readonly string[] = ["/", "/leistungen"];
