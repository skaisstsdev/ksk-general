/**
 * Структурный остаток главной страницы — всё остальное (тексты)
 * переехало в словари next-intl (`messages/<locale>/home.json`).
 * Единственное, что здесь остаётся: `href` карточек услуг — они не
 * переводятся и должны совпадать по индексу с `home.services.items`
 * в словаре.
 */
export const serviceHrefs = [
  "/leistungen#haeuslich",
  "/leistungen#wohnprojekte",
  "/leistungen#krankheitsbild",
  "/leistungen#beratung",
] as const;
