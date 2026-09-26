/**
 * Структурный остаток страницы «Leistungen» — тексты в
 * `messages/<locale>/leistungen.json`. Здесь только `id` групп
 * `haeuslich`, которые не переводятся: один открыт по умолчанию
 * (`Accordion`), порядок и индекс должны совпадать с
 * `leistungen.haeuslich.groups` в словаре.
 */
export const haeuslichGroupIds = ["grundversorgung", "therapien", "organisation"] as const;
